import { site } from "./config";
import { absoluteUrl } from "./seo";
import type { Product } from "./types";

// ─────────────────────────────────────────────────────────────
// Builders de datos estructurados (schema.org / JSON-LD).
// Funciones puras: devuelven objetos listos para <JsonLd>.
// ─────────────────────────────────────────────────────────────

const phone = `+${site.whatsappNumber}`;
const sameAs = Object.values(site.social).filter(Boolean);

/** Identidad de la marca. */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${site.url}/#organization`,
    name: site.name,
    url: site.url,
    logo: absoluteUrl(site.logo),
    email: site.email,
    telephone: phone,
    sameAs,
  };
}

/** Tienda física + e-commerce local (clave para SEO local en Medellín). */
export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Store",
    "@id": `${site.url}/#store`,
    name: site.name,
    image: absoluteUrl(site.logo),
    url: site.url,
    telephone: phone,
    email: site.email,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Calle 7 #83A-24 Interior 143",
      addressLocality: "Medellín",
      addressRegion: "Antioquia",
      addressCountry: "CO",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.geo.lat,
      longitude: site.geo.lng,
    },
    areaServed: { "@type": "Country", name: "Colombia" },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "09:00",
        closes: "19:00",
      },
    ],
    sameAs,
  };
}

/** Sitio web + caja de búsqueda (sitelinks searchbox en Google). */
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    name: site.name,
    url: site.url,
    inLanguage: "es-CO",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${site.url}/catalogo?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

function availabilityOf(p: Product): string {
  const stock = p.stock ?? 0;
  return stock > 0
    ? "https://schema.org/InStock"
    : "https://schema.org/OutOfStock";
}

/** Producto con oferta (precio, moneda COP, disponibilidad). */
export function productSchema(p: Product) {
  const url = absoluteUrl(`/producto/${p.slug}`);
  const images = [p.image, ...(p.gallery ?? [])]
    .filter(Boolean)
    .map((img) => absoluteUrl(img));
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.title,
    description: p.description,
    image: images,
    sku: p._id,
    brand: { "@type": "Brand", name: p.brand || site.name },
    category: p.category,
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "COP",
      price: p.price,
      availability: availabilityOf(p),
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: site.name },
    },
  };
}

/** Migas de pan (coincide con el breadcrumb visual). */
export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  };
}

/** Lista de productos (PLP / categoría). */
export function itemListSchema(products: Product[], path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    url: absoluteUrl(path),
    numberOfItems: products.length,
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: absoluteUrl(`/producto/${p.slug}`),
      name: p.title,
    })),
  };
}

/** FAQ (AEO: elegible para AI Overviews / rich results). */
export function faqSchema(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };
}
