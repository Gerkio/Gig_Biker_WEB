import type { Metadata } from "next";
import { site } from "./config";

/** Convierte una ruta relativa en URL absoluta sobre el dominio canónico. */
export function absoluteUrl(path = "/"): string {
  if (path.startsWith("http")) return path;
  return `${site.url}${path.startsWith("/") ? path : `/${path}`}`;
}

interface BuildMetadataInput {
  title?: string;
  description?: string;
  /** Ruta canónica de la página (ej. "/catalogo/jerseys"). */
  path?: string;
  /** Imagen para Open Graph (URL absoluta o ruta). Por defecto la OG global. */
  image?: string;
  /** Marca la página como no indexable (carrito, checkout, etc.). */
  noindex?: boolean;
  type?: "website" | "article";
}

/**
 * Arma metadata consistente (canonical + Open Graph + Twitter) para una página.
 * Centraliza el SEO on-page para no repetir bloques en cada ruta.
 */
/** Imagen Open Graph por defecto de la marca. */
export const DEFAULT_OG_IMAGE = "/hero.jpg";

export function buildMetadata({
  title,
  description,
  path = "/",
  image,
  noindex,
  type = "website",
}: BuildMetadataInput): Metadata {
  const canonical = absoluteUrl(path);
  const ogImage = absoluteUrl(image || DEFAULT_OG_IMAGE);

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type,
      url: canonical,
      siteName: site.name,
      title: title ?? undefined,
      description: description ?? undefined,
      locale: "es_CO",
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: title ?? undefined,
      description: description ?? undefined,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
  };
}
