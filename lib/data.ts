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
// CMS; si no, devuelve datos semilla. La UI no sabe la diferencia.
// `revalidate` permite ISR: el cliente edita en Sanity y el sitio
// se actualiza sin redeploy.
// ─────────────────────────────────────────────────────────────

const REVALIDATE = 60;

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
  // En Sanity las imagenes pueden venir como ref; urlForImage las resuelve.
  return {
    ...(raw as unknown as Product),
    image: (raw.image as string) || urlForImage(raw.image, 800),
  };
}

// ── Productos ────────────────────────────────────────────────
export async function getProducts(category?: CategorySlug): Promise<Product[]> {
  if (!sanityClient) {
    return category
      ? seedProducts.filter((p) => p.category === category)
      : seedProducts;
  }
  const filter = category
    ? `*[_type == "product" && category->slug.current == $category]`
    : `*[_type == "product"]`;
  const data = await sanityClient.fetch(
    `${filter} | order(featured desc, _createdAt desc) ${productProjection}`,
    category ? { category } : {},
    { next: { revalidate: REVALIDATE } }
  );
  const mapped = (data as Record<string, unknown>[]).map(mapSanityProduct);
  // Si el dataset de Sanity aun esta vacio, mostramos el catalogo semilla.
  if (mapped.length === 0) {
    return category
      ? seedProducts.filter((p) => p.category === category)
      : seedProducts;
  }
  return mapped;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const all = await getProducts();
  const featured = all.filter((p) => p.featured);
  return featured.length ? featured : all.slice(0, 6);
}

export async function getProduct(slug: string): Promise<Product | null> {
  if (!sanityClient) {
    return seedProducts.find((p) => p.slug === slug) ?? null;
  }
  const data = await sanityClient.fetch(
    `*[_type == "product" && slug.current == $slug][0] ${productProjection}`,
    { slug },
    { next: { revalidate: REVALIDATE } }
  );
  if (data) return mapSanityProduct(data as Record<string, unknown>);
  // Fallback a semilla mientras el dataset no tenga este producto.
  return seedProducts.find((p) => p.slug === slug) ?? null;
}

export async function getAllProductSlugs(): Promise<string[]> {
  if (!sanityClient) return seedProducts.map((p) => p.slug);
  const data = await sanityClient.fetch(
    `*[_type == "product"].slug.current`,
    {},
    { next: { revalidate: REVALIDATE } }
  );
  const slugs = data as string[];
  return slugs.length ? slugs : seedProducts.map((p) => p.slug);
}

// ── Categorias ───────────────────────────────────────────────
export async function getCategories(): Promise<Category[]> {
  if (!sanityClient) return seedCategories;
  const data = await sanityClient.fetch(
    `*[_type == "category"] | order(order asc, title asc) {
      "_id": _id, title, "slug": slug.current, description,
      "image": image.asset->url
    }`,
    {},
    { next: { revalidate: REVALIDATE } }
  );
  const cats = data as Category[];
  return cats.length ? cats : seedCategories;
}

// ── Cupones ──────────────────────────────────────────────────
export async function getActiveCoupons(): Promise<Coupon[]> {
  if (!sanityClient) return seedCoupons.filter((c) => c.active);
  const data = await sanityClient.fetch(
    `*[_type == "coupon" && active == true] {
      "_id": _id, code, percentage, active, label
    }`,
    {},
    { next: { revalidate: REVALIDATE } }
  );
  const coupons = data as Coupon[];
  return coupons.length ? coupons : seedCoupons.filter((c) => c.active);
}

/** Valida un codigo de cupon. Devuelve el cupon si esta activo, o null. */
export async function findCoupon(code: string): Promise<Coupon | null> {
  const normalized = code.trim().toUpperCase();
  if (!sanityClient) {
    return (
      seedCoupons.find((c) => c.code === normalized && c.active) ?? null
    );
  }
  const data = await sanityClient.fetch(
    `*[_type == "coupon" && upper(code) == $code && active == true][0] {
      "_id": _id, code, percentage, active, label
    }`,
    { code: normalized },
    { next: { revalidate: REVALIDATE } }
  );
  return (
    (data as Coupon) ??
    seedCoupons.find((c) => c.code === normalized && c.active) ??
    null
  );
}

// ── Promos ───────────────────────────────────────────────────
export async function getActivePromos(): Promise<Promo[]> {
  if (!sanityClient) return seedPromos.filter((p) => p.active);
  const data = await sanityClient.fetch(
    `*[_type == "promo" && active == true] {
      "_id": _id, title, subtitle, ctaLabel, ctaHref,
      "image": image.asset->url, active
    }`,
    {},
    { next: { revalidate: REVALIDATE } }
  );
  const promos = data as Promo[];
  return promos.length ? promos : seedPromos.filter((p) => p.active);
}

// ── Ajustes del sitio (singleton) ────────────────────────────
export async function getSiteSettings(): Promise<SiteSettings | null> {
  if (!sanityClient) return null;
  const data = await sanityClient.fetch(
    `*[_type == "siteSettings"][0]{
      announcements, freeShippingThreshold, whatsapp, email, address, city, hours
    }`,
    {},
    { next: { revalidate: REVALIDATE } }
  );
  return (data as SiteSettings) ?? null;
}

// ── Página de inicio (singleton) ─────────────────────────────
export async function getHomePage(): Promise<HomePageContent | null> {
  if (!sanityClient) return null;
  const data = await sanityClient.fetch(
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
}

// ── Testimonios ──────────────────────────────────────────────
export async function getTestimonials(): Promise<Testimonial[]> {
  if (!sanityClient) return [];
  const data = await sanityClient.fetch(
    `*[_type == "testimonial" && featured == true] | order(order asc){
      "_id": _id, name, city, rating, text
    }`,
    {},
    { next: { revalidate: REVALIDATE } }
  );
  return (data as Testimonial[]) ?? [];
}
