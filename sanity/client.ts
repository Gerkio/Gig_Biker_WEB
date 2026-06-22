import { createClient, type SanityClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import { apiVersion, dataset, isSanityConfigured, projectId } from "./env";

// Token de SOLO LECTURA (server-only, sin NEXT_PUBLIC). En este dataset los
// documentos requieren autenticación para leerse, así que la tienda necesita
// este token para mostrar el contenido del CMS. Sin token, el data layer cae
// a los datos semilla (lib/data.ts).
const readToken = process.env.SANITY_API_READ_TOKEN;

// El cliente solo se crea si hay projectId.
export const sanityClient: SanityClient | null = isSanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      // Con token leemos contenido autenticado y fresco (ISR cachea 60s);
      // solo documentos publicados (sin borradores).
      ...(readToken
        ? { token: readToken, useCdn: false, perspective: "published" }
        : { useCdn: true }),
    })
  : null;

const builder = sanityClient ? imageUrlBuilder(sanityClient) : null;

/** Convierte una referencia de imagen de Sanity en URL. */
export function urlForImage(source: unknown, width = 800): string {
  if (!builder || !source) return "";
  return builder.image(source as never).width(width).auto("format").url();
}
