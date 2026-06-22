import { createClient, type SanityClient } from "@sanity/client";
import { dataset, projectId } from "@/sanity/env";

// Cliente de ESCRITURA (solo servidor). Requiere SANITY_API_WRITE_TOKEN.
// Si no hay token, queda null y el tracking simplemente no persiste
// (la maqueta sigue funcionando; en producción se define el token).
const token = process.env.SANITY_API_WRITE_TOKEN;

export const writeClient: SanityClient | null =
  token && projectId
    ? createClient({
        projectId,
        dataset,
        apiVersion: "2024-01-01",
        token,
        useCdn: false,
      })
    : null;
