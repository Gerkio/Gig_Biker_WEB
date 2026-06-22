import { defineArrayMember, defineField, defineType } from "sanity";
import { PackageIcon } from "@sanity/icons";

export const product = defineType({
  name: "product",
  title: "Producto",
  type: "document",
  icon: PackageIcon,
  groups: [
    { name: "info", title: "Información", default: true },
    { name: "precios", title: "Precios" },
    { name: "multimedia", title: "Multimedia" },
    { name: "variantes", title: "Tallas / Colores" },
    { name: "seo", title: "SEO" },
  ],
  fieldsets: [
    { name: "inventory", title: "Inventario", options: { columns: 2 } },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Nombre del producto",
      type: "string",
      group: "info",
      validation: (r) => r.required().min(3),
    }),
    defineField({
      name: "slug",
      title: "Slug (URL)",
      type: "slug",
      group: "info",
      description: "Se genera del nombre. Define la dirección del producto.",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "status",
      title: "Estado",
      type: "string",
      group: "info",
      options: {
        list: [
          { title: "Activo", value: "activo" },
          { title: "Agotado", value: "agotado" },
          { title: "Oculto", value: "oculto" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "activo",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "stock",
      title: "Stock disponible",
      type: "number",
      group: "info",
      fieldset: "inventory",
      description: "Unidades disponibles. En 0 = agotado.",
      initialValue: 0,
      validation: (r) => r.required().min(0).integer(),
    }),
    defineField({
      name: "lowStockThreshold",
      title: "Avisar bajo",
      type: "number",
      group: "info",
      fieldset: "inventory",
      description: "Umbral de stock bajo para la alerta.",
      initialValue: 5,
      validation: (r) => r.min(0).integer(),
    }),
    defineField({
      name: "brand",
      title: "Marca",
      type: "string",
      group: "info",
      initialValue: "Big Biker",
    }),
    defineField({
      name: "category",
      title: "Categoría",
      type: "reference",
      group: "info",
      to: [{ type: "category" }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "description",
      title: "Descripción",
      type: "text",
      group: "info",
      rows: 4,
      validation: (r) => r.required().min(10),
    }),
    defineField({
      name: "tags",
      title: "Etiquetas",
      type: "array",
      group: "info",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
      description: "Palabras clave para búsqueda y filtros (ej: reflectiva, dama, impermeable).",
    }),
    defineField({
      name: "featured",
      title: "Destacado (aparece en Home)",
      type: "boolean",
      group: "info",
      initialValue: false,
    }),
    defineField({
      name: "rating",
      title: "Calificación (0-5)",
      type: "number",
      group: "info",
      validation: (r) => r.min(0).max(5),
    }),

    // Precios
    defineField({
      name: "price",
      title: "Precio (COP)",
      type: "number",
      group: "precios",
      validation: (r) => r.required().min(0),
    }),
    defineField({
      name: "compareAtPrice",
      title: "Precio anterior (tachado)",
      type: "number",
      group: "precios",
      description: "Opcional. Si es mayor al precio, se muestra el % de descuento.",
      validation: (r) =>
        r.custom((compareAt, ctx) => {
          const price = (ctx.document as { price?: number })?.price;
          if (compareAt && price && compareAt <= price)
            return "Debe ser mayor que el precio actual.";
          return true;
        }),
    }),
    defineField({
      name: "sku",
      title: "SKU / Referencia",
      type: "string",
      group: "precios",
    }),

    // Multimedia
    defineField({
      name: "image",
      title: "Imagen principal",
      type: "image",
      group: "multimedia",
      options: { hotspot: true },
      fields: [
        { name: "alt", title: "Texto alternativo", type: "string" },
      ],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "hoverImage",
      title: "Imagen al pasar el mouse (opcional)",
      type: "image",
      group: "multimedia",
      options: { hotspot: true },
    }),
    defineField({
      name: "gallery",
      title: "Galería",
      type: "array",
      group: "multimedia",
      of: [defineArrayMember({ type: "image", options: { hotspot: true } })],
      options: { layout: "grid" },
    }),

    // Tallas / Colores (solo opciones para el cliente; el stock es único arriba)
    defineField({
      name: "variants",
      title: "Tallas o colores disponibles",
      type: "array",
      group: "variantes",
      description: "Opciones que el cliente puede elegir. El stock se controla con el campo único de la pestaña Información.",
      of: [
        defineArrayMember({
          type: "object",
          name: "variant",
          fields: [
            { name: "label", title: "Etiqueta", type: "string", validation: (r) => r.required() },
            {
              name: "kind",
              title: "Tipo",
              type: "string",
              options: { list: ["talla", "color"], layout: "radio" },
              initialValue: "talla",
            },
          ],
          preview: {
            select: { title: "label", kind: "kind" },
            prepare: ({ title, kind }) => ({ title, subtitle: kind }),
          },
        }),
      ],
    }),

    // SEO
    defineField({
      name: "seoTitle",
      title: "Título SEO",
      type: "string",
      group: "seo",
      description: "Si se deja vacío se usa el nombre del producto.",
      validation: (r) => r.max(60).warning("Idealmente menos de 60 caracteres."),
    }),
    defineField({
      name: "seoDescription",
      title: "Descripción SEO",
      type: "text",
      group: "seo",
      rows: 2,
      validation: (r) => r.max(160).warning("Idealmente menos de 160 caracteres."),
    }),
  ],
  preview: {
    select: {
      title: "title",
      price: "price",
      media: "image",
      stock: "stock",
      threshold: "lowStockThreshold",
    },
    prepare: ({ title, price, media, stock, threshold }) => {
      const s = stock ?? 0;
      const t = threshold ?? 5;
      // Indicador visual de inventario
      const flag = s === 0 ? "🔴" : s <= t ? "🟡" : "🟢";
      const estado = s === 0 ? "Agotado" : s <= t ? `Stock bajo (${s})` : `${s} en stock`;
      return {
        title: `${flag} ${title}`,
        subtitle: `${price ? `$${price.toLocaleString("es-CO")}` : ""} · ${estado}`,
        media,
      };
    },
  },
  orderings: [
    { title: "Stock: menor a mayor", name: "stockAsc", by: [{ field: "stock", direction: "asc" }] },
    { title: "Precio: menor a mayor", name: "priceAsc", by: [{ field: "price", direction: "asc" }] },
    { title: "Precio: mayor a menor", name: "priceDesc", by: [{ field: "price", direction: "desc" }] },
    { title: "Nombre A-Z", name: "titleAsc", by: [{ field: "title", direction: "asc" }] },
  ],
});
