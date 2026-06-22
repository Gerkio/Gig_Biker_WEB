import { defineField, defineType } from "sanity";
import { TrendUpwardIcon } from "@sanity/icons";

// Métricas reales por producto. Las escribe la API /api/track.
export const productStat = defineType({
  name: "productStat",
  title: "Métricas de producto",
  type: "document",
  icon: TrendUpwardIcon,
  readOnly: true,
  fields: [
    defineField({ name: "slug", title: "Slug del producto", type: "string" }),
    defineField({ name: "title", title: "Producto", type: "string" }),
    defineField({ name: "views", title: "Vistas", type: "number", initialValue: 0 }),
    defineField({ name: "addToCarts", title: "Agregados al carrito", type: "number", initialValue: 0 }),
    defineField({ name: "purchases", title: "Compras (eventos)", type: "number", initialValue: 0 }),
    defineField({ name: "unitsSold", title: "Unidades vendidas", type: "number", initialValue: 0 }),
    defineField({ name: "lastSoldAt", title: "Última venta", type: "date" }),
  ],
  preview: {
    select: { title: "title", units: "unitsSold", views: "views" },
    prepare: ({ title, units, views }) => ({
      title: title ?? "—",
      subtitle: `${units ?? 0} vendidas · ${views ?? 0} vistas`,
    }),
  },
});
