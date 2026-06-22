import { defineField, defineType } from "sanity";
import { CogIcon } from "@sanity/icons";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Ajustes del sitio",
  type: "document",
  icon: CogIcon,
  groups: [
    { name: "marca", title: "Marca", default: true },
    { name: "contacto", title: "Contacto" },
    { name: "redes", title: "Redes sociales" },
    { name: "tienda", title: "Tienda" },
  ],
  fields: [
    // Marca
    defineField({ name: "name", title: "Nombre de la marca", type: "string", group: "marca", initialValue: "Big Biker" }),
    defineField({ name: "tagline", title: "Eslogan", type: "string", group: "marca" }),
    defineField({ name: "logo", title: "Logo", type: "image", group: "marca", options: { hotspot: false } }),

    // Contacto
    defineField({
      name: "whatsapp",
      title: "WhatsApp (solo números)",
      type: "string",
      group: "contacto",
      description: "Formato internacional sin signos. Ej: 573006098946",
      validation: (r) => r.regex(/^\d{8,15}$/, { name: "número", invert: false }).error("Solo dígitos (8-15)."),
    }),
    defineField({ name: "email", title: "Correo", type: "string", group: "contacto" }),
    defineField({ name: "address", title: "Dirección", type: "string", group: "contacto" }),
    defineField({ name: "city", title: "Ciudad", type: "string", group: "contacto", initialValue: "Medellín, Antioquia" }),
    defineField({ name: "hours", title: "Horario de atención", type: "string", group: "contacto", initialValue: "Lun a Sáb · 9:00 a.m. – 7:00 p.m." }),

    // Redes
    defineField({ name: "instagram", title: "Instagram (URL)", type: "url", group: "redes" }),
    defineField({ name: "facebook", title: "Facebook (URL)", type: "url", group: "redes" }),
    defineField({ name: "tiktok", title: "TikTok (URL)", type: "url", group: "redes" }),

    // Tienda
    defineField({
      name: "freeShippingThreshold",
      title: "Envío gratis desde (COP)",
      type: "number",
      group: "tienda",
      description: "Monto a partir del cual el envío es gratis (0 = sin umbral).",
      initialValue: 0,
    }),
    defineField({
      name: "announcements",
      title: "Mensajes de la barra superior",
      type: "array",
      group: "tienda",
      of: [{ type: "string" }],
      description: "Mensajes que rotan en la cinta superior del sitio.",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Ajustes del sitio" }),
  },
});
