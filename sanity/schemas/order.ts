import { defineArrayMember, defineField, defineType } from "sanity";
import { DocumentTextIcon } from "@sanity/icons";

// Pedido real creado por /api/order. El comercio gestiona el ESTADO;
// el resto de campos son de solo lectura (los fija el servidor).
export const order = defineType({
  name: "order",
  title: "Pedido",
  type: "document",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: "status",
      title: "Estado",
      type: "string",
      options: {
        list: [
          { title: "Pendiente de pago", value: "pendiente" },
          { title: "Pagado", value: "pagado" },
          { title: "Enviado", value: "enviado" },
          { title: "Entregado", value: "entregado" },
          { title: "Cancelado", value: "cancelado" },
        ],
        layout: "radio",
      },
      initialValue: "pendiente",
    }),
    defineField({ name: "orderNumber", title: "Número de orden", type: "string", readOnly: true }),
    defineField({
      name: "channel",
      title: "Canal",
      type: "string",
      readOnly: true,
      options: { list: ["checkout", "whatsapp"] },
    }),
    defineField({ name: "createdAt", title: "Fecha", type: "datetime", readOnly: true }),
    defineField({
      name: "customer",
      title: "Cliente",
      type: "object",
      readOnly: true,
      fields: [
        { name: "name", title: "Nombre", type: "string" },
        { name: "phone", title: "Teléfono", type: "string" },
        { name: "email", title: "Correo", type: "string" },
        { name: "address", title: "Dirección", type: "string" },
        { name: "city", title: "Ciudad", type: "string" },
        { name: "notes", title: "Notas", type: "text" },
      ],
    }),
    defineField({
      name: "items",
      title: "Productos",
      type: "array",
      readOnly: true,
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            { name: "title", title: "Producto", type: "string" },
            { name: "slug", title: "Slug", type: "string" },
            { name: "quantity", title: "Cantidad", type: "number" },
            { name: "price", title: "Precio unitario", type: "number" },
          ],
          preview: {
            select: { title: "title", qty: "quantity", price: "price" },
            prepare: ({ title, qty, price }) => ({
              title: `${qty}× ${title}`,
              subtitle: price ? `$${price.toLocaleString("es-CO")}` : "",
            }),
          },
        }),
      ],
    }),
    defineField({ name: "couponCode", title: "Cupón", type: "string", readOnly: true }),
    defineField({ name: "subtotal", title: "Subtotal", type: "number", readOnly: true }),
    defineField({ name: "discount", title: "Descuento", type: "number", readOnly: true }),
    defineField({ name: "total", title: "Total", type: "number", readOnly: true }),
  ],
  orderings: [
    { title: "Más recientes", name: "newest", by: [{ field: "createdAt", direction: "desc" }] },
  ],
  preview: {
    select: { num: "orderNumber", total: "total", status: "status", name: "customer.name" },
    prepare: ({ num, total, status, name }) => {
      const flag =
        status === "pendiente" ? "🟡" :
        status === "pagado" ? "🟢" :
        status === "enviado" ? "🔵" :
        status === "entregado" ? "✅" : "⚪";
      return {
        title: `${flag} ${num ?? "Pedido"}${total ? ` · $${total.toLocaleString("es-CO")}` : ""}`,
        subtitle: `${name ?? ""}${status ? ` · ${status}` : ""}`,
      };
    },
  },
});
