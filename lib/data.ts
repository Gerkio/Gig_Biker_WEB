import { sanityClient, urlForImage } from "@/sanity/client";
import {
  seedCategories,
  seedCoupons,
  seedProducts,
  seedPromos,
} from "./seed-data";
import type {
  Category,
  CategorySlug,
  Coupon,
  HomePageContent,
  Product,
  Promo,
  SiteSettings,
  Testimonial,
} from "./types";

// ─────────────────────────────────────────────────────────────
// Data layer unico para la UI. Si Sanity esta configurado lee del
// CMS; si no (o si la peticion FALLA), devuelve datos semilla.
// Esto garantiza que el build/runtime nunca se rompa por un fallo
// de red/credenciales de Sanity. ISR (revalidate) mantiene fresco.
// ─────────────────────────────────────────────────────────────

const REVALIDATE = 60;

/**
 * Ejecuta una lectura de Sanity con red de seguridad:
 * - sin cliente configurado → fallback (semilla)
 * - si la peticion lanza error → fallback (semilla) + log
 */
async function safe<T>(label: string, run: () => Promise<T>, fallback: T): Promise<T> {
  if (!sanityClient) return fallback;
  try {
    return await run();
  } catch (e) {
    console.error(
      `[data] ${label}: Sanity no respondio, usando datos semilla.`,
      (e as Error)?.message ?? e
    );
    return fallback;
  }
}

// ── Proyecciones GROQ ────────────────────────────────────────
const productProjection = `{
  "_id": _id,
  title,
  "slug": slug.current,
  brand,
  "category": category->slug.current,
  price,
  compareAtPrice,
  description,
  "image": image.asset->url,
  "hoverImage": hoverImage.asset->url,
  "gallery": gallery[].asset->url,
  variants,
  featured,
  rating,
  tags,
  stock,
  lowStockThreshold,
  unitsSold,
  lastSoldAt,
  seoTitle,
  seoDescription
}`;

function mapSanityProduct(raw: Record<string, unknown>): Product {
  return {
    ...(raw as unknown as Product),
    image: (raw.image as string) || urlForImage(raw.image, 800),
  };
}

// ── Productos ────────────────────────────────────────────────
export async function getProducts(category?: CategorySlug): Promise<Product[]> {
  const seed = category
    ? seedProducts.filter((p) => p.category === category)
    : seedProducts;
  return safe(
    "getProducts",
    async () => {
      const filter = category
        ? `*[_type == "product" && category->slug.current == $category]`
        : `*[_type == "product"]`;
      const data = await sanityClient!.fetch(
        `${filter} | order(featured desc, _createdAt desc) ${productProjection}`,
        category ? { category } : {},
        { next: { revalidate: REVALIDATE } }
      );
      const mapped = (data as Record<string, unknown>[]).map(mapSanityProduct);
      return mapped.length ? mapped : seed;
    },
    seed
  );
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const all = await getProducts();
  const featured = all.filter((p) => p.featured);
  return featured.length ? featured : all.slice(0, 6);
}

export async function getProduct(slug: string): Promise<Product | null> {
  const seed = seedProducts.find((p) => p.slug === slug) ?? null;
  return safe(
    "getProduct",
    async () => {
      const data = await sanityClient!.fetch(
        `*[_type == "product" && slug.current == $slug][0] ${productProjection}`,
        { slug },
        { next: { revalidate: REVALIDATE } }
      );
      return data ? mapSanityProduct(data as Record<string, unknown>) : seed;
    },
    seed
  );
}

export async function getAllProductSlugs(): Promise<string[]> {
  const seed = seedProducts.map((p) => p.slug);
  return safe(
    "getAllProductSlugs",
    async () => {
      const data = await sanityClient!.fetch(
        `*[_type == "product"].slug.current`,
        {},
        { next: { revalidate: REVALIDATE } }
      );
      const slugs = data as string[];
      return slugs.length ? slugs : seed;
    },
    seed
  );
}

// ── Categorias ───────────────────────────────────────────────
export async function getCategories(): Promise<Category[]> {
  return safe(
    "getCategories",
    async () => {
      const data = await sanityClient!.fetch(
        `*[_type == "category"] | order(order asc, title asc) {
          "_id": _id, title, "slug": slug.current, description,
          "image": image.asset->url
        }`,
        {},
        { next: { revalidate: REVALIDATE } }
      );
      const cats = data as Category[];
      return cats.length ? cats : seedCategories;
    },
    seedCategories
  );
}

// ── Cupones ──────────────────────────────────────────────────
export async function getActiveCoupons(): Promise<Coupon[]> {
  const seed = seedCoupons.filter((c) => c.active);
  return safe(
    "getActiveCoupons",
    async () => {
      const data = await sanityClient!.fetch(
        `*[_type == "coupon" && active == true] {
          "_id": _id, code, percentage, active, label
        }`,
        {},
        { next: { revalidate: REVALIDATE } }
      );
      const coupons = data as Coupon[];
      return coupons.length ? coupons : seed;
    },
    seed
  );
}

/** Valida un codigo de cupon. Devuelve el cupon si esta activo, o null. */
export async function findCoupon(code: string): Promise<Coupon | null> {
  const normalized = code.trim().toUpperCase();
  const seed = seedCoupons.find((c) => c.code === normalized && c.active) ?? null;
  return safe(
    "findCoupon",
    async () => {
      const data = await sanityClient!.fetch(
        `*[_type == "coupon" && upper(code) == $code && active == true][0] {
          "_id": _id, code, percentage, active, label
        }`,
        { code: normalized },
        { next: { revalidate: REVALIDATE } }
      );
      return (data as Coupon) ?? seed;
    },
    seed
  );
}

// ── Promos ───────────────────────────────────────────────────
export async function getActivePromos(): Promise<Promo[]> {
  const seed = seedPromos.filter((p) => p.active);
  return safe(
    "getActivePromos",
    async () => {
      const data = await sanityClient!.fetch(
        `*[_type == "promo" && active == true] {
          "_id": _id, title, subtitle, ctaLabel, ctaHref,
          "image": image.asset->url, active
        }`,
        {},
        { next: { revalidate: REVALIDATE } }
      );
      const promos = data as Promo[];
      return promos.length ? promos : seed;
    },
    seed
  );
}

// ── Ajustes del sitio (singleton) ────────────────────────────
export async function getSiteSettings(): Promise<SiteSettings | null> {
  return safe(
    "getSiteSettings",
    async () => {
      const data = await sanityClient!.fetch(
        `*[_type == "siteSettings"][0]{
          announcements, freeShippingThreshold, whatsapp, email, address, city, hours
        }`,
        {},
        { next: { revalidate: REVALIDATE } }
      );
      return (data as SiteSettings) ?? null;
    },
    null
  );
}

// ── Página de inicio (singleton) ─────────────────────────────
export async function getHomePage(): Promise<HomePageContent | null> {
  return safe(
    "getHomePage",
    async () => {
      const data = await sanityClient!.fetch(
        `*[_type == "homePage"][0]{
          heroBadge, heroTitle, heroHighlight, heroSubtitle,
          "heroImage": heroImage.asset->url,
          primaryCtaLabel, primaryCtaHref, secondaryCtaLabel, secondaryCtaHref,
          marquee, stats
        }`,
        {},
        { next: { revalidate: REVALIDATE } }
      );
      return (data as HomePageContent) ?? null;
    },
    null
  );
}

// ── Testimonios ──────────────────────────────────────────────
export async function getTestimonials(): Promise<Testimonial[]> {
  return safe(
    "getTestimonials",
    async () => {
      const data = await sanityClient!.fetch(
        `*[_type == "testimonial" && featured == true] | order(order asc){
          "_id": _id, name, city, rating, text
        }`,
        {},
        { next: { revalidate: REVALIDATE } }
      );
      return (data as Testimonial[]) ?? [];
    },
    []
  );
}
