import { site } from "./config";
import { formatCOP } from "./utils";
import type { CartItem } from "./cart-store";
import type { Product } from "./types";

// Construye deep links a WhatsApp (wa.me) con mensaje pre-llenado.
// Es el cierre "compra ultra-rapida" de la maqueta.

function buildUrl(message: string): string {
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

/** Mensaje para "Comprar por WhatsApp" desde el PDP (1 producto). */
export function whatsappProductUrl(
  product: Product,
  variant?: string,
  quantity = 1
): string {
  const lines = [
    `¡Hola ${site.name}! Quiero comprar:`,
    "",
    `*${product.title}*`,
    variant ? `Variante: ${variant}` : null,
    `Cantidad: ${quantity}`,
    `Precio: ${formatCOP(product.price)}`,
    "",
    "¿Me confirman disponibilidad y forma de pago?",
  ].filter(Boolean);
  return buildUrl(lines.join("\n"));
}

/** Mensaje para enviar el carrito completo por WhatsApp. */
export function whatsappCartUrl(items: CartItem[], total: number): string {
  const lines = [
    `¡Hola ${site.name}! Quiero finalizar este pedido:`,
    "",
    ...items.map(
      (i) =>
        `• ${i.title}${i.variant ? ` (${i.variant})` : ""} x${i.quantity} — ${formatCOP(
          i.price * i.quantity
        )}`
    ),
    "",
    `*Total: ${formatCOP(total)}*`,
    "",
    "Quedo atento para coordinar pago y entrega.",
  ];
  return buildUrl(lines.join("\n"));
}

/** Mensaje generico de contacto. */
export function whatsappContactUrl(message?: string): string {
  return buildUrl(
    message || `¡Hola ${site.name}! Quiero más información.`
  );
}
