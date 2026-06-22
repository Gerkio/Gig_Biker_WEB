// Carga el catalogo (85 productos + categorias + cupones + promos) al dataset
// de Sanity, subiendo las imagenes locales como assets.
//
// REQUISITOS:
//   1) Un token de ESCRITURA de Sanity (rol Editor):
//      https://www.sanity.io/manage  ->  proyecto BigBiker  ->  API  ->  Tokens
//   2) Ponlo en .env.local como:  SANITY_API_TOKEN=sk...
//
// USO:   node scripts/seed-sanity.mjs
import fs from "node:fs";
import path from "node:path";
import { createClient } from "@sanity/client";

// --- Cargar variables de .env.local ---
const envText = fs.readFileSync(".env.local", "utf8");
const env = Object.fromEntries(
  envText
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#"))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^"|"$/g, "")];
    })
);

const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_TOKEN || env.SANITY_API_TOKEN;

if (!projectId || !dataset) throw new Error("Faltan PROJECT_ID/DATASET en .env.local");
if (!token) throw new Error("Falta SANITY_API_TOKEN (token de escritura) en .env.local o el entorno");

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

const products = JSON.parse(fs.readFileSync("scripts/products.json", "utf8"));

const categories = [
  { _id: "category.jerseys", title: "Jerseys", slug: "jerseys", description: "Jerseys BigBiker de alto desempeño." },
  { _id: "category.chaquetas", title: "Chaquetas e Impermeables", slug: "chaquetas", description: "Reflectivas, cortavientos e impermeables." },
  { _id: "category.tubulares", title: "Tubulares y Balaclavas", slug: "tubulares", description: "Protección facial con estilo." },
  { _id: "category.accesorios", title: "Accesorios", slug: "accesorios", description: "Gorras, riñoneras, maletas y más." },
];

const coupons = [
  { _id: "coupon.bigbiker10", code: "BIGBIKER10", percentage: 10, active: true, label: "10% en tu primera compra" },
  { _id: "coupon.motero15", code: "MOTERO15", percentage: 15, active: true, label: "15% en indumentaria seleccionada" },
];

const promos = [
  {
    _id: "promo.temporada",
    title: "TEMPORADA DE RODADA",
    subtitle: "Aprovecha tus cupones BigBiker en jerseys, chaquetas y accesorios.",
    ctaLabel: "Ver promociones",
    ctaHref: "/promociones",
    active: true,
  },
];

// --- 1) Categorias ---
for (const c of categories) {
  await client.createOrReplace({
    _id: c._id,
    _type: "category",
    title: c.title,
    slug: { _type: "slug", current: c.slug },
    description: c.description,
  });
}
console.error(`Categorias: ${categories.length}`);

// --- 2) Imagenes (dedupe) ---
const assetByFile = new Map();
let up = 0;
for (const p of products) {
  const file = p.image.replace("/productos/", "");
  if (assetByFile.has(file)) continue;
  const full = path.join("public/productos", file);
  const asset = await client.assets.upload("image", fs.createReadStream(full), {
    filename: file,
  });
  assetByFile.set(file, asset._id);
  up++;
  if (up % 10 === 0) console.error(`  imagenes subidas: ${up}`);
}
console.error(`Imagenes subidas: ${up}`);

// --- 3) Productos ---
for (const p of products) {
  const file = p.image.replace("/productos/", "");
  const doc = {
    _id: `product.${p.slug}`,
    _type: "product",
    title: p.title,
    slug: { _type: "slug", current: p.slug },
    brand: p.brand,
    category: { _type: "reference", _ref: `category.${p.category}` },
    price: p.price,
    description: p.description,
    image: {
      _type: "image",
      asset: { _type: "reference", _ref: assetByFile.get(file) },
    },
    rating: p.rating,
  };
  if (p.compareAtPrice) doc.compareAtPrice = p.compareAtPrice;
  if (p.featured) doc.featured = true;
  if (p.variants) {
    doc.variants = p.variants.map((v, i) => ({
      _key: `v${i}`,
      _type: "object",
      label: v.label,
      kind: v.kind,
      stock: v.stock,
    }));
  }
  await client.createOrReplace(doc);
}
console.error(`Productos: ${products.length}`);

// --- 4) Cupones y promos ---
for (const c of coupons) await client.createOrReplace({ ...c, _type: "coupon" });
for (const pr of promos) await client.createOrReplace({ ...pr, _type: "promo" });
console.error(`Cupones: ${coupons.length} | Promos: ${promos.length}`);

console.error("\n✅ Dataset poblado. El sitio ahora lee del CMS.");
