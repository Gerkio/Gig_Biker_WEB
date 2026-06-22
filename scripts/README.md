# Scripts de datos (uso único / mantenimiento)

Herramientas para poblar y mantener el catálogo en el CMS (Sanity). No son
parte del runtime de la app; se ejecutan a mano desde la raíz del proyecto.

Requieren credenciales en `.env.local` (ver `.env.example`). Los scripts de
escritura necesitan un token **Editor** (`SANITY_API_WRITE_TOKEN`).

| Script | Qué hace |
|--------|----------|
| `crawl.mjs` | Scrapea el catálogo real de bigbiker.com.co → `scripts/catalog.json` y descarga imágenes a `public/productos/`. |
| `generate.mjs` | Convierte `catalog.json` → `lib/seed-data.ts` (catálogo semilla) + `scripts/products.json`. |
| `products.json` | **Fuente de verdad** del catálogo: 85 productos con título, slug, precio (COP), descripción, variantes, stock, categoría e imagen. |
| `seed-sanity.mjs` | Sube `products.json` a Sanity: imágenes como assets + productos, categorías, cupones y promos. Idempotente. |
| `set-stock.mjs` | Escribe `stock` + `lowStockThreshold` en los productos ya existentes en el CMS. |
| `make-ndjson.mjs` | (Alternativa) genera `scripts/import.ndjson` para `sanity dataset import`. |

## Flujo típico

```bash
# 1) (Opcional) re-scrapear el catálogo
node scripts/crawl.mjs

# 2) Regenerar seed-data.ts + products.json
node scripts/generate.mjs

# 3) Poblar el CMS (requiere SANITY_API_WRITE_TOKEN)
node scripts/seed-sanity.mjs

# 4) Fijar inventario en el CMS
node scripts/set-stock.mjs
```

> `catalog.json` e `import.ndjson` son artefactos regenerables (no se versionan).
