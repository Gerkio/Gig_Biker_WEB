import { defineArrayMember, defineField, defineType } from "sanity";
import { TagIcon } from "@sanity/icons";

export const coupon = defineType({
  name: "coupon",
  title: "Cupón",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "code",
      title: "Código",
      type: "string",
      description: "Ej: BIGBIKER10. Se valida sin distinguir mayúsculas.",
      validation: (r) => r.required().uppercase(),
    }),
    defineField({
      name: "percentage",
      title: "Descuento (%)",
      type: "number",
      validation: (r) => r.required().min(1).max(100),
    }),
    defineField({
      name: "label",
      title: "Descripción corta",
      type: "string",
      description: "Texto que ve el cliente (ej: 10% en tu primera compra).",
    }),
    defineField({
      name: "active",
      title: "Activo",
      type: "boolean",
      description: "Desactiva el cupón sin borrarlo.",
      initialValue: true,
    }),
    defineField({
      name: "minPurchase",
      title: "Compra mínima (COP)",
      type: "number",
      description: "Opcional. Monto mínimo del carrito para aplicar.",
    }),
    defineField({
      name: "validUntil",
      title: "Válido hasta",
      type: "date",
      description: "Opcional. Fecha de expiración.",
      options: { dateFormat: "YYYY-MM-DD" },
    }),
    defineField({
      name: "appliesTo",
      title: "Aplica a categorías",
      type: "array",
      description: "Opcional. Si se deja vacío, aplica a toda la tienda.",
      of: [defineArrayMember({ type: "reference", to: [{ type: "category" }] })],
    }),
  ],
  preview: {
    select: { title: "code", active: "active", percentage: "percentage", label: "label" },
    prepare: ({ title, active, percentage, label }) => ({
      title: `${title} · -${percentage}%`,
      subtitle: `${active ? "🟢 Activo" : "⚪ Inactivo"}${label ? ` — ${label}` : ""}`,
    }),
  },
});
