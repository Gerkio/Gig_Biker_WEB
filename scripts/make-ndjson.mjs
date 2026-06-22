// Genera scripts/import.ndjson para `sanity dataset import`.
// Las imagenes se referencian con _sanityAsset + file:// (ruta absoluta),
// y el importador las sube como assets automaticamente.
import fs from "node:fs";

const cwd = process.cwd().replace(/\\/g, "/");
const fileUrl = (file) => `image@file:///${cwd}/public/productos/${file}`;

const products = JSON.parse(fs.readFileSync("scripts/products.json", "utf8"));
const docs = [];

// Categorias
const categories = [
  { slug: "jerseys", title: "Jerseys", description: "Jerseys BigBiker de alto desempeño." },
  { slug: "chaquetas", title: "Chaquetas e Impermeables", description: "Reflectivas, cortavientos e impermeables." },
  { slug: "tubulares", title: "Tubulares y Balaclavas", description: "Protección facial con estilo." },
  { slug: "accesorios", title: "Accesorios", description: "Gorras, riñoneras, maletas y más." },
];
for (const c of categories) {
  docs.push({
    _id: `category.${c.slug}`,
    _type: "category",
    title: c.title,
    slug: { _type: "slug", current: c.slug },
    description: c.description,
  });
}

// Productos
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
    image: { _sanityAsset: fileUrl(file) },
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
  docs.push(doc);
}

// Cupones y promos
docs.push(
  { _id: "coupon.bigbiker10", _type: "coupon", code: "BIGBIKER10", percentage: 10, active: true, label: "10% en tu primera compra" },
  { _id: "coupon.motero15", _type: "coupon", code: "MOTERO15", percentage: 15, active: true, label: "15% en indumentaria seleccionada" },
  {
    _id: "promo.temporada",
    _type: "promo",
    title: "TEMPORADA DE RODADA",
    subtitle: "Aprovecha tus cupones BigBiker en jerseys, chaquetas y accesorios.",
    ctaLabel: "Ver promociones",
    ctaHref: "/promociones",
    active: true,
  }
);

fs.writeFileSync("scripts/import.ndjson", docs.map((d) => JSON.stringify(d)).join("\n") + "\n");
console.log(`NDJSON generado: ${docs.length} documentos (${products.length} productos + 4 cat + 3 promos/cupones)`);
