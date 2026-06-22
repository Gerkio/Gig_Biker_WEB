import { defineField, defineType } from "sanity";
import { RocketIcon } from "@sanity/icons";

export const promo = defineType({
  name: "promo",
  title: "Promoción (banner)",
  type: "document",
  icon: RocketIcon,
  fields: [
    defineField({
      name: "title",
      title: "Título",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({ name: "subtitle", title: "Subtítulo", type: "string" }),
    defineField({
      name: "position",
      title: "Ubicación",
      type: "string",
      options: {
        list: [
          { title: "Banner de la Home", value: "home" },
          { title: "Página de promociones", value: "promociones" },
        ],
        layout: "radio",
      },
      initialValue: "home",
    }),
    defineField({ name: "ctaLabel", title: "Texto del botón", type: "string" }),
    defineField({ name: "ctaHref", title: "Enlace del botón", type: "string", initialValue: "/promociones" }),
    defineField({
      name: "image",
      title: "Imagen de fondo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "active",
      title: "Activa",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "startsAt",
      title: "Inicia",
      type: "datetime",
      description: "Opcional. Para programar la promoción.",
    }),
    defineField({
      name: "endsAt",
      title: "Termina",
      type: "datetime",
      description: "Opcional.",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "subtitle", media: "image", active: "active" },
    prepare: ({ title, subtitle, media, active }) => ({
      title: `${active ? "" : "⚪ "}${title}`,
      subtitle,
      media,
    }),
  },
});
