// Lectura centralizada de la config de Sanity.
// `isSanityConfigured` decide si el data layer usa el CMS real o datos semilla.
// No lanza error si faltan variables: así la maqueta corre con datos semilla.

// Sanea valores de entorno: quita comillas y espacios accidentales (un error
// común al pegar variables en paneles como Vercel: KEY="valor" -> valor).
const clean = (v?: string) => (v ?? "").trim().replace(/^['"]|['"]$/g, "").trim();

export const projectId = clean(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);
export const dataset = clean(process.env.NEXT_PUBLIC_SANITY_DATASET) || "production";
export const apiVersion =
  clean(process.env.NEXT_PUBLIC_SANITY_API_VERSION) || "2024-01-01";

export const isSanityConfigured = Boolean(projectId);
