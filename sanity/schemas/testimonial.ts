import { defineField, defineType } from "sanity";
import { StarIcon } from "@sanity/icons";

export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonio",
  type: "document",
  icon: StarIcon,
  fields: [
    defineField({
      name: "name",
      title: "Nombre del cliente",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({ name: "city", title: "Ciudad", type: "string" }),
    defineField({
      name: "rating",
      title: "Calificación (1-5)",
      type: "number",
      initialValue: 5,
      validation: (r) => r.required().min(1).max(5),
    }),
    defineField({
      name: "text",
      title: "Testimonio",
      type: "text",
      rows: 3,
      validation: (r) => r.required(),
    }),
    defineField({
      name: "featured",
      title: "Mostrar en la Home",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "order",
      title: "Orden",
      type: "number",
      initialValue: 100,
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "city", rating: "rating" },
    prepare: ({ title, subtitle, rating }) => ({
      title,
      subtitle: `${"★".repeat(rating ?? 0)}${subtitle ? ` · ${subtitle}` : ""}`,
    }),
  },
});
