import { defineField, defineType } from "sanity";
import { ThLargeIcon } from "@sanity/icons";

export const category = defineType({
  name: "category",
  title: "Categoría",
  type: "document",
  icon: ThLargeIcon,
  fields: [
    defineField({
      name: "title",
      title: "Nombre",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug (URL)",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "description",
      title: "Descripción",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "image",
      title: "Imagen de la categoría",
      type: "image",
      options: { hotspot: true },
      description: "Se muestra en la cuadrícula de categorías de la Home.",
    }),
    defineField({
      name: "order",
      title: "Orden",
      type: "number",
      description: "Menor número aparece primero.",
      initialValue: 100,
    }),
    defineField({
      name: "featured",
      title: "Mostrar en la Home",
      type: "boolean",
      initialValue: true,
    }),
  ],
  preview: {
    select: { title: "title", slug: "slug.current", media: "image", featured: "featured" },
    prepare: ({ title, slug, media, featured }) => ({
      title,
      subtitle: `/${slug ?? ""}${featured ? " · en Home" : ""}`,
      media,
    }),
  },
  orderings: [
    { title: "Orden", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
});
