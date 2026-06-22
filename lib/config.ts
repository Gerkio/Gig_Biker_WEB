// Datos de marca / contacto centralizados (consumidos por la UI).
// Configurables via .env; con valores por defecto del cliente Big Biker.

export const site = {
  name: "Big Biker",
  tagline: "Indumentaria y accesorios para motociclismo",
  // URL canónica del sitio en producción (sin barra final).
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://www.bigbiker.com.co").replace(/\/$/, ""),
  city: "Medellín, Antioquia",
  // Coordenadas aproximadas de la tienda en Medellín (refinar con la real).
  geo: { lat: 6.2476, lng: -75.5658 },
  logo: "/logo.png",
  whatsappNumber:
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "573006098946",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "info@bigbiker.com.co",
  address:
    process.env.NEXT_PUBLIC_CONTACT_ADDRESS ||
    "Calle 7 #83A-24 Interior 143, Medellín",
  social: {
    instagram: "https://instagram.com/bigbiker",
    facebook: "https://facebook.com/bigbiker",
  },
} as const;

export const categoriesNav = [
  { title: "Jerseys", slug: "jerseys" },
  { title: "Chaquetas", slug: "chaquetas" },
  { title: "Tubulares", slug: "tubulares" },
  { title: "Accesorios", slug: "accesorios" },
] as const;
