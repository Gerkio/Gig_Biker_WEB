// Crawler del catalogo real de bigbiker.com.co.
// Recorre cada seccion (siguiendo subcategorias y paginacion),
// extrae nombre/precio/imagen EXACTOS del HTML y descarga las imagenes.
import fs from "node:fs";
import path from "node:path";

const ORIGIN = "https://www.bigbiker.com.co";
const UA = { "User-Agent": "Mozilla/5.0" };
const OUT_IMG = "public/productos";
fs.mkdirSync(OUT_IMG, { recursive: true });

// Secciones de nivel superior -> slug interno de nuestra tienda
const SECTIONS = [
  { slug: "jerseys", start: "/jersey" },
  { slug: "chaquetas", start: "/chaquetas" },
  { slug: "tubulares", start: "/tubulares" },
  { slug: "accesorios", start: "/accesorios" },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getHtml(url) {
  const res = await fetch(ORIGIN + url, { headers: UA });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.text();
}

// Extrae bloques de producto de una pagina de listado
function parseProducts(html) {
  const out = [];
  // Cada producto: <div class="product item item_product ..."> ... </div>
  const blocks = html.split('class="product item item_product');
  for (let i = 1; i < blocks.length; i++) {
    const b = blocks[i];
    const img = b.match(/resized\/([^"]+\.(?:jpg|jpeg|png|gif))/i);
    const name = b.match(/<a\s+title="([^"]+)"\s+href="[^"]*productdetails/i);
    const id = b.match(/virtuemart_product_id\/(\d+)/);
    const price = b.match(/PricesalesPrice">\s*\$?\s*([\d.]+)/);
    if (img && name && id) {
      out.push({
        id: id[1],
        name: decodeEntities(name[1].trim()),
        image: decodeURIComponent(img[1]),
        price: price ? parseInt(price[1].replace(/\./g, ""), 10) : null,
      });
    }
  }
  return out;
}

// Enlaces a subcategorias dentro de una seccion
function parseSubcats(html, sectionPath) {
  const set = new Set();
  const re = /href="(\/[^"]*\/view\/category\/virtuemart_category_id\/\d+[^"]*)"/g;
  let m;
  while ((m = re.exec(html))) {
    const href = m[1].replace(/&amp;/g, "&");
    // misma seccion (mismo primer segmento) y sin paginacion
    if (href.startsWith(sectionPath) && !/\/start\/\d+/.test(href)) set.add(href);
  }
  return [...set];
}

// Link "siguiente" de paginacion
function parseNext(html) {
  const m = html.match(/rel="next"[^>]*href="([^"]+)"/);
  return m ? m[1].replace(/&amp;/g, "&") : null;
}

function decodeEntities(s) {
  return s
    .replace(/&aacute;/g, "a").replace(/&eacute;/g, "e").replace(/&iacute;/g, "i")
    .replace(/&oacute;/g, "o").replace(/&uacute;/g, "u").replace(/&ntilde;/g, "n")
    .replace(/&Aacute;/g, "A").replace(/&ordm;/g, "").replace(/&deg;/g, "")
    .replace(/&amp;/g, "&").replace(/&#176;/g, "").replace(/&quot;/g, '"').trim();
}

const seenProducts = new Map(); // id -> {slug, name, image, price}

async function crawlListing(url, slug, visited) {
  let next = url;
  let guard = 0;
  while (next && guard++ < 12) {
    const html = await getHtml(next);
    for (const p of parseProducts(html)) {
      if (!seenProducts.has(p.id)) seenProducts.set(p.id, { ...p, slug });
    }
    // subcategorias (solo en la primera pasada de cada url base)
    const sectionPath = "/" + url.split("/")[1];
    for (const sub of parseSubcats(html, sectionPath)) {
      if (!visited.has(sub)) {
        visited.add(sub);
        await crawlListing(sub, slug, visited);
        await sleep(150);
      }
    }
    next = parseNext(html);
    await sleep(150);
  }
}

for (const s of SECTIONS) {
  const visited = new Set([s.start]);
  console.error("Crawling seccion:", s.slug);
  await crawlListing(s.start, s.slug, visited);
}

const products = [...seenProducts.values()];
console.error(`Productos encontrados: ${products.length}`);

// Descargar imagenes
let dl = 0, fail = 0;
for (const p of products) {
  const local = p.image.replace(/ /g, "_");
  const dest = path.join(OUT_IMG, local);
  if (fs.existsSync(dest) && fs.statSync(dest).size > 1500) { p.local = local; dl++; continue; }
  try {
    const r = await fetch(ORIGIN + "/images/stories/virtuemart/product/resized/" + encodeURI(p.image), { headers: UA });
    if (!r.ok) throw new Error(r.status);
    const buf = Buffer.from(await r.arrayBuffer());
    if (buf.length < 1500) throw new Error("muy pequeno " + buf.length);
    fs.writeFileSync(dest, buf);
    p.local = local; dl++;
  } catch (e) {
    console.error("FALLO img:", p.image, String(e));
    p.local = null; fail++;
  }
  await sleep(80);
}
console.error(`Imagenes OK: ${dl} | Fallidas: ${fail}`);

// Guardar JSON (solo productos con imagen valida)
const valid = products.filter((p) => p.local && p.price);
fs.writeFileSync("scripts/catalog.json", JSON.stringify(valid, null, 2));
console.error(`Catalogo valido (con imagen+precio): ${valid.length}`);
// Resumen por seccion
const by = {};
for (const p of valid) by[p.slug] = (by[p.slug] || 0) + 1;
console.error("Por categoria:", JSON.stringify(by));
