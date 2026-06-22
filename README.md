# Big Biker — Tienda de motociclismo (Next.js + Sanity)

E-commerce para **Big Biker** (Medellín, Colombia): indumentaria y accesorios
para motociclismo (jerseys, chaquetas reflectivas, tubulares, gorras y maletas).
Estética urbana, flujo de compra ultra-rápido (≤ 3 clics), CMS gestionable por el
cliente y datos reales (pedidos, inventario, analítica).

> **Único pendiente:** integración de **pasarela de pagos** (Wompi / Mercado Pago
> / PSE). Hoy el cierre es por **WhatsApp** o **checkout nativo** (contra entrega),
> con creación de pedido real en el CMS.

## Stack

- **Next.js 15** (App Router) + **TypeScript**
- **Tailwind CSS** (tokens de marca `#FDB92E` / `#C52F33` / `#201E1E`, fuentes Anton/Inter)
- **Framer Motion** (animaciones) · **Embla** (sliders)
- **Zustand** (carrito persistido)
- **Sanity** (CMS headless + Studio embebido en `/studio`)

## Funcionalidades

- 🛍️ Catálogo dinámico desde el CMS (productos, categorías, cupones, promos) con
  **fallback** a datos semilla (`lib/seed-data.ts`) si no hay CMS.
- 🔎 Búsqueda (`/catalogo?q=`), filtros por categoría y orden.
- 🛒 Carrito + checkout con validación → **pedido real** guardado en el CMS,
  **descuento de stock** y registro de venta.
- 📦 Inventario gestionable (stock por producto, alertas de stock bajo/agotado).
- 📊 **Dashboard** dentro del CMS (inventario, ventas y tráfico **reales**).
- 🎨 Contenido editable desde el CMS: hero, marquee, stats, anuncios, testimonios,
  imágenes de categoría.
- 🔍 SEO/AEO: `sitemap.xml`, `robots.txt`, datos estructurados JSON-LD
  (Product, LocalBusiness, FAQPage, BreadcrumbList…), Open Graph, redirects 301.

## Cómo correr

```bash
npm install
cp .env.example .env.local   # y completa las variables (ver abajo)
npm run dev                  # http://localhost:3000
```

La app **funciona sin configurar nada** (usa el catálogo semilla). Con Sanity
configurado, lee el contenido en vivo del CMS (ISR, 60s).

En Windows también hay accesos directos: `iniciar.bat` (sitio en producción) y
`cms.bat` (abre el Studio).

## Variables de entorno

Ver [`.env.example`](.env.example). Las clave:

| Variable | Para qué |
|----------|----------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` / `_DATASET` | Conexión al CMS |
| `SANITY_API_READ_TOKEN` | **Lectura** del catálogo desde el CMS (rol *Viewer*) |
| `SANITY_API_WRITE_TOKEN` | **Escritura**: pedidos + analítica (rol *Editor*) |
| `NEXT_PUBLIC_SITE_URL` | Dominio canónico (SEO/sitemap) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` / `_CONTACT_*` | Datos de contacto |

> Los tokens son **server-only** (sin `NEXT_PUBLIC`). Nunca se versionan
> (`.env.local` está en `.gitignore`).

## CMS (Sanity)

El Studio vive en **`/studio`** y gestiona: productos, categorías, **pedidos**,
cupones, promociones, testimonios, página de inicio y ajustes del sitio
(schemas en [`sanity/schemas/`](sanity/schemas/)). El **Dashboard** es una
pestaña del Studio (analítica de inventario/ventas/tráfico).

La analítica real la captura el sitio vía [`/api/track`](app/api/track/route.ts)
y los pedidos vía [`/api/order`](app/api/order/route.ts) (validan precios y
cupones del lado servidor).

## Mapa de rutas

| Ruta | Descripción |
|------|-------------|
| `/` | Home (hero, categorías, destacados, testimonios, FAQ) |
| `/catalogo` · `/catalogo/[categoria]` | Listado con búsqueda, filtros y orden |
| `/producto/[slug]` | Detalle (galería, tallas, CTAs) |
| `/carrito` · `/checkout` · `/checkout/confirmacion` | Flujo de compra |
| `/promociones` · `/nosotros` · `/contacto` | Páginas de marca |
| `/studio` | CMS (Sanity) + Dashboard |
| `/api/order` · `/api/track` | Creación de pedidos · analítica |

## Scripts de datos

Las herramientas para poblar/mantener el catálogo en el CMS están en
[`scripts/`](scripts/) (ver su README). Ej.: `node scripts/seed-sanity.mjs`
para subir el catálogo, `node scripts/set-stock.mjs` para el inventario.

## Deploy

Pensado para **Vercel**: conecta el repo y define las variables de entorno
(incluidos `SANITY_API_READ_TOKEN` y `SANITY_API_WRITE_TOKEN`). El dominio
canónico va en `NEXT_PUBLIC_SITE_URL`.

## Roadmap

- **Pasarela de pagos** (Wompi / Mercado Pago / PSE) — único pendiente para venta online completa.
- (Opcional) Migración a **Shopify** (tema Liquid) — plan documentado aparte.
