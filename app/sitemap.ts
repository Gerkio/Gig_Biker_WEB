import type { MetadataRoute } from "next";
import { getAllProductSlugs, getCategories } from "@/lib/data";
import { absoluteUrl } from "@/lib/seo";

// Sitemap dinámico: rutas estáticas + categorías + todos los productos.
// Excluye carrito/checkout/studio/api (transaccionales o privadas).
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: absoluteUrl("/catalogo"), lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl("/promociones"), lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: absoluteUrl("/nosotros"), lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: absoluteUrl("/contacto"), lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  const [categories, slugs] = await Promise.all([
    getCategories(),
    getAllProductSlugs(),
  ]);

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
    url: absoluteUrl(`/catalogo/${c.slug}`),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const productRoutes: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: absoluteUrl(`/producto/${slug}`),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
