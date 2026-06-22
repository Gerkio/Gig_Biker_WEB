"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCOP } from "@/lib/utils";
import { site } from "@/lib/config";

interface OrderLine {
  title: string;
  variant?: string;
  quantity: number;
  price: number;
}
interface Order {
  orderNumber?: string;
  items: OrderLine[];
  subtotal: number;
  discount: number;
  total: number;
  coupon: string | null;
}

export default function ConfirmacionPage() {
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("bigbiker-last-order");
    if (raw) setOrder(JSON.parse(raw));
  }, []);

  // Número real generado por el servidor (fallback si se entra directo).
  const orderId = order?.orderNumber ?? "—";

  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center lg:px-8">
      <motion.div
        initial={{ scale: 0, rotate: -45 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-500"
      >
        <Check className="h-12 w-12 text-white" strokeWidth={3} />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="heading-display mt-6 text-4xl"
      >
        ¡Orden recibida!
      </motion.h1>
      <p className="mt-3 text-zinc-400">
        Gracias por tu compra. Pronto te contactaremos para coordinar el pago y
        la entrega.
      </p>
      <p className="mt-1 text-sm text-zinc-500">
        Número de orden: <span className="text-brand-yellow">{orderId}</span>
      </p>

      {order && (
        <div className="mx-auto mt-8 max-w-md rounded-xl border border-white/10 bg-ink-900 p-6 text-left">
          <h2 className="mb-3 font-display uppercase">Resumen</h2>
          <ul className="space-y-1 text-sm text-zinc-300">
            {order.items.map((i, idx) => (
              <li key={idx} className="flex justify-between gap-2">
                <span className="truncate">
                  {i.title}
                  {i.variant ? ` (${i.variant})` : ""} × {i.quantity}
                </span>
                <span>{formatCOP(i.price * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 space-y-1 border-t border-white/10 pt-3 text-sm">
            {order.discount > 0 && (
              <div className="flex justify-between text-green-400">
                <span>Descuento {order.coupon ? `(${order.coupon})` : ""}</span>
                <span>- {formatCOP(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold text-white">
              <span>Total</span>
              <span>{formatCOP(order.total)}</span>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <a
          href={`https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(
            `¡Hola ${site.name}! Acabo de generar la orden ${orderId}, quiero coordinar el pago.`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="whatsapp" size="lg">
            Coordinar por WhatsApp
          </Button>
        </a>
        <Link href="/catalogo">
          <Button variant="outline" size="lg">
            Seguir comprando
          </Button>
        </Link>
      </div>
    </div>
  );
}
