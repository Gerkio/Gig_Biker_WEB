// Escribe stock + umbral de stock bajo en los productos del CMS (que se
// importaron sin esos campos). Usa el token de escritura de .env.local.
import fs from "node:fs";
import { createClient } from "@sanity/client";

const env = Object.fromEntries(
  fs.readFileSync(".env.local", "utf8")
    .split("\n").map((l) => l.trim()).filter((l) => l && !l.startsWith("#"))
    .map((l) => { const i = l.indexOf("="); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^"|"$/g, "")]; })
);

const token = process.env.SANITY_API_WRITE_TOKEN || env.SANITY_API_WRITE_TOKEN;
if (!token) throw new Error("Falta SANITY_API_WRITE_TOKEN en .env.local");

const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

const products = JSON.parse(fs.readFileSync("scripts/products.json", "utf8"));
const tx = client.transaction();
for (const p of products) {
  tx.patch(`product.${p.slug}`, (patch) =>
    patch.set({ stock: p.stock ?? 0, lowStockThreshold: p.lowStockThreshold ?? 5 })
  );
}
await tx.commit({ visibility: "async" });
console.error(`Stock escrito en ${products.length} productos.`);
