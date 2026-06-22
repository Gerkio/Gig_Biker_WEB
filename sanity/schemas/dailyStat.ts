import { defineField, defineType } from "sanity";
import { ActivityIcon } from "@sanity/icons";

// Agregado diario de tráfico/eventos. Lo escribe la API /api/track.
export const dailyStat = defineType({
  name: "dailyStat",
  title: "Tráfico diario",
  type: "document",
  icon: ActivityIcon,
  readOnly: true,
  fields: [
    defineField({ name: "date", title: "Fecha", type: "date" }),
    defineField({ name: "pageViews", title: "Visitas", type: "number", initialValue: 0 }),
    defineField({ name: "productViews", title: "Vistas de producto", type: "number", initialValue: 0 }),
    defineField({ name: "addToCarts", title: "Agregados al carrito", type: "number", initialValue: 0 }),
    defineField({ name: "whatsappClicks", title: "Clics de WhatsApp", type: "number", initialValue: 0 }),
    defineField({ name: "orders", title: "Pedidos", type: "number", initialValue: 0 }),
  ],
  preview: {
    select: { title: "date", pv: "pageViews", o: "orders" },
    prepare: ({ title, pv, o }) => ({
      title: title ?? "—",
      subtitle: `${pv ?? 0} visitas · ${o ?? 0} pedidos`,
    }),
  },
});
