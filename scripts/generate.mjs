// Genera lib/seed-data.ts a partir de scripts/catalog.json (datos reales).
import fs from "node:fs";

const items = JSON.parse(fs.readFileSync("scripts/catalog.json", "utf8"));

const stripAccents = (s) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "");

// Nombre de archivo 100% ASCII y URL-safe (evita roturas con n-tilde/acentos).
function safeName(file) {
  return stripAccents(file).replace(/[^A-Za-z0-9._-]/g, "_");
}

// Renombra en disco cualquier imagen con caracteres no-ASCII a su version segura.
const IMG_DIR = "public/productos";
for (const f of fs.readdirSync(IMG_DIR)) {
  const safe = safeName(f);
  if (safe !== f && !fs.existsSync(`${IMG_DIR}/${safe}`)) {
    fs.renameSync(`${IMG_DIR}/${f}`, `${IMG_DIR}/${safe}`);
    console.error(`renombrado: ${f} -> ${safe}`);
  }
}

function slugify(name) {
  return stripAccents(name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Descripcion realista por categoria/palabra clave (no inventa datos de stock)
function describe(p) {
  const n = stripAccents(p.name).toLowerCase();
  if (p.slug === "jerseys")
    return "Jersey BigBiker de tela técnica transpirable y secado rápido. Cómodo y resistente para cada rodada.";
  if (p.slug === "tubulares")
    return "Tubular multifuncional BigBiker: protege del sol, viento y polvo. Tela elástica, suave y transpirable.";
  if (p.slug === "chaquetas") {
    if (n.includes("cortavientos"))
      return "Cortavientos BigBiker en tela impermeable con capucha. Liviano, plegable y con logo de la marca.";
    if (n.includes("impermeable") || n.includes("conjunto"))
      return "Conjunto impermeable BigBiker. Te mantiene seco en la lluvia sin perder movilidad.";
    return "Chaqueta reflectiva BigBiker de alta visibilidad. Costuras termo-selladas y protección contra el clima.";
  }
  // accesorios
  if (n.includes("gorra")) return "Gorra BigBiker con logo bordado. Ajuste cómodo y acabado de calidad.";
  if (n.includes("drybag") || n.includes("morral")) return "Equipo tipo drybag 100% impermeable, ideal para ciudad y viaje. Altamente resistente.";
  if (n.includes("cubre")) return "Cubierta 100% impermeable que protege tu carga y aumenta tu visibilidad.";
  if (n.includes("chaleco")) return "Chaleco reflectivo ajustable. Mayor visibilidad y seguridad en la vía.";
  if (n.includes("portacasco") || n.includes("casco")) return "Bolso resistente para transportar tu casco con seguridad.";
  if (n.includes("herramient")) return "Bolso organizador para cargar la herramienta en la moto.";
  if (n.includes("celular") || n.includes("documento")) return "Bolso para llevar documentos y celular de forma segura y a la mano.";
  if (n.includes("rinonera") || n.includes("rino")) return "Riñonera BigBiker práctica y resistente para tus salidas.";
  return "Accesorio BigBiker de alta calidad para complementar tu equipo motero.";
}

const tallasFor = (slug) =>
  slug === "jerseys" || slug === "chaquetas";

// rating determinista 4.3 - 4.9 a partir del id
function rating(id) {
  const n = parseInt(id, 10) || 0;
  return Math.round((4.3 + (n % 7) * 0.1) * 10) / 10;
}

// Stock inicial (determinista) para el inventario del CMS.
// Mezcla intencional: agotados (0), stock bajo (1-4) y stock sano.
// Las ventas NO se simulan: se registran de forma real vía /api/track.
const STOCK_TABLE = [0, 2, 3, 0, 18, 35, 4, 27, 50, 1, 12, 8, 0, 22, 6];
function inventory(idStr) {
  const n = parseInt(idStr, 10) || 0;
  return { stock: STOCK_TABLE[n % STOCK_TABLE.length] };
}
// destacados: primeros 2 de cada categoria
const counts = {};
const usedSlugs = new Set();

const products = items.map((p) => {
  counts[p.slug] = (counts[p.slug] || 0) + 1;
  let slug = slugify(p.name);
  if (usedSlugs.has(slug)) slug = `${slug}-${p.id}`;
  usedSlugs.add(slug);
  const featured = counts[p.slug] <= 2;
  const inv = inventory(p.id);
  const obj = {
    _id: `bb-${p.id}`,
    title: p.name,
    slug,
    brand: "Big Biker",
    category: p.slug,
    price: p.price,
    description: describe(p),
    image: "/productos/" + safeName(p.local),
    variants: tallasFor(p.slug)
      ? ["S", "M", "L", "XL"].map((label) => ({ label, kind: "talla" }))
      : undefined,
    featured: featured || undefined,
    rating: rating(p.id),
    stock: inv.stock,
    lowStockThreshold: 5,
  };
  return obj;
});

// Serializa a TS legible
function tsValue(v, indent = 2) {
  const pad = " ".repeat(indent);
  if (Array.isArray(v)) {
    if (v.length === 0) return "[]";
    return (
      "[\n" +
      v.map((x) => pad + "  " + tsValue(x, indent + 2)).join(",\n") +
      "\n" + pad + "]"
    );
  }
  if (v && typeof v === "object") {
    const keys = Object.keys(v).filter((k) => v[k] !== undefined);
    return (
      "{ " +
      keys.map((k) => `${k}: ${tsValue(v[k], indent)}`).join(", ") +
      " }"
    );
  }
  if (typeof v === "string") return JSON.stringify(v);
  return String(v);
}

const productsTs = products
  .map((p) => "  " + tsValue(p, 2))
  .join(",\n");

const file = `import type { Category, Coupon, Product, Promo } from "./types";

// ─────────────────────────────────────────────────────────────
// Catalogo real de Big Biker (bigbiker.com.co), usado con
// autorizacion del cliente. Big Biker NO vende motocicletas:
// se especializa en INDUMENTARIA y ACCESORIOS para motociclismo.
//
// GENERADO automaticamente desde el catalogo real (ver scripts/).
// ${products.length} productos. Imagenes en /public/productos (servidas localmente).
// Las tallas son referenciales para la demo; los precios son reales.
// ─────────────────────────────────────────────────────────────

export const seedCategories: Category[] = [
  { _id: "cat-jerseys", title: "Jerseys", slug: "jerseys", description: "Jerseys BigBiker de alto desempeño." },
  { _id: "cat-chaquetas", title: "Chaquetas e Impermeables", slug: "chaquetas", description: "Reflectivas, cortavientos e impermeables." },
  { _id: "cat-tubulares", title: "Tubulares y Balaclavas", slug: "tubulares", description: "Protección facial con estilo." },
  { _id: "cat-accesorios", title: "Accesorios", slug: "accesorios", description: "Gorras, riñoneras, maletas y más." },
];

export const seedProducts: Product[] = [
${productsTs},
];

export const seedCoupons: Coupon[] = [
  { _id: "c-1", code: "BIGBIKER10", percentage: 10, active: true, label: "10% en tu primera compra" },
  { _id: "c-2", code: "MOTERO15", percentage: 15, active: true, label: "15% en indumentaria seleccionada" },
  { _id: "c-3", code: "EXPIRADO20", percentage: 20, active: false, label: "Promo vencida" },
];

export const seedPromos: Promo[] = [
  {
    _id: "promo-1",
    title: "TEMPORADA DE RODADA",
    subtitle: "Aprovecha tus cupones BigBiker en jerseys, chaquetas y accesorios.",
    ctaLabel: "Ver promociones",
    ctaHref: "/promociones",
    active: true,
  },
];
`;

fs.writeFileSync("lib/seed-data.ts", file);
// Tambien exportamos los productos como JSON para el script de carga a Sanity.
fs.writeFileSync("scripts/products.json", JSON.stringify(products, null, 2));
console.error(`seed-data.ts generado con ${products.length} productos.`);
console.error("Por categoria:", JSON.stringify(counts));
