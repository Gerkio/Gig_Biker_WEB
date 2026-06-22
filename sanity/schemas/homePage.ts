import { defineArrayMember, defineField, defineType } from "sanity";
import { HomeIcon } from "@sanity/icons";

export const homePage = defineType({
  name: "homePage",
  title: "Página de inicio",
  type: "document",
  icon: HomeIcon,
  groups: [
    { name: "hero", title: "Portada (Hero)", default: true },
    { name: "secciones", title: "Secciones" },
  ],
  fields: [
    // Hero
    defineField({ name: "heroBadge", title: "Etiqueta superior", type: "string", group: "hero", initialValue: "Medellín · Colombia" }),
    defineField({ name: "heroTitle", title: "Título", type: "string", group: "hero", initialValue: "Vive la moto" }),
    defineField({ name: "heroHighlight", title: "Título (resaltado en amarillo)", type: "string", group: "hero", initialValue: "al máximo" }),
    defineField({ name: "heroSubtitle", title: "Subtítulo", type: "text", group: "hero", rows: 2 }),
    defineField({ name: "heroImage", title: "Imagen de fondo", type: "image", group: "hero", options: { hotspot: true } }),
    defineField({ name: "primaryCtaLabel", title: "Botón principal — texto", type: "string", group: "hero", initialValue: "Explorar catálogo" }),
    defineField({ name: "primaryCtaHref", title: "Botón principal — enlace", type: "string", group: "hero", initialValue: "/catalogo" }),
    defineField({ name: "secondaryCtaLabel", title: "Botón secundario — texto", type: "string", group: "hero", initialValue: "Ver chaquetas" }),
    defineField({ name: "secondaryCtaHref", title: "Botón secundario — enlace", type: "string", group: "hero", initialValue: "/catalogo/chaquetas" }),

    // Secciones
    defineField({
      name: "marquee",
      title: "Cinta de marcas/palabras",
      type: "array",
      group: "secciones",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "stats",
      title: "Estadísticas",
      type: "array",
      group: "secciones",
      of: [
        defineArrayMember({
          type: "object",
          name: "stat",
          fields: [
            { name: "value", title: "Valor", type: "string" },
            { name: "label", title: "Etiqueta", type: "string" },
          ],
          preview: {
            select: { title: "value", subtitle: "label" },
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Página de inicio" }),
  },
});
