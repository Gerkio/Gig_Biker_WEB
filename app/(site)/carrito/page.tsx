"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-store";
import { formatCOP } from "@/lib/utils";
import { whatsappCartUrl } from "@/lib/whatsapp";

export default function CarritoPage() {
  const { items, removeItem, updateQuantity } = useCart();
  const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-4 px-4 py-32 text-center">
        <ShoppingBag className="h-16 w-16 text-zinc-700" />
        <h1 className="heading-display text-3xl">Tu carrito está vacío</h1>
        <p className="text-zinc-400">Aún no agregas productos.</p>
        <Link href="/catalogo">
          <Button variant="primary" size="lg">
            Explorar catálogo
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 lg:px-8">
      <h1 className="heading-display mb-8 text-4xl">Tu carrito</h1>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 rounded-xl border border-white/5 bg-ink-700/40 p-4"
            >
              <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-md bg-ink-900">
                <Image src={item.image} alt={item.title} fill sizes="80px" className="object-cover" />
              </div>
              <div className="flex flex-1 flex-col">
                <div className="flex justify-between">
                  <Link href={`/producto/${item.slug}`} className="font-medium hover:text-brand-yellow">
                    {item.title}
                  </Link>
                  <button onClick={() => removeItem(item.id)} className="text-zinc-500 hover:text-brand-red">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                {item.variant && <p className="text-sm text-zinc-400">{item.variant}</p>}
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center gap-2 rounded border border-white/10">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 py-1 hover:text-brand-yellow">
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="min-w-[2rem] text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 py-1 hover:text-brand-yellow">
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <span className="font-semibold">{formatCOP(item.price * item.quantity)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Resumen */}
        <div className="h-fit space-y-4 rounded-xl border border-white/10 bg-ink-900 p-6">
          <h2 className="font-display text-xl uppercase">Resumen</h2>
          <div className="flex justify-between text-sm text-zinc-400">
            <span>Subtotal</span>
            <span className="text-lg font-bold text-white">{formatCOP(subtotal)}</span>
          </div>
          <Link href="/checkout" className="block">
            <Button variant="primary" size="lg" className="w-full">
              Finalizar compra
            </Button>
          </Link>
          <a href={whatsappCartUrl(items, subtotal)} target="_blank" rel="noopener noreferrer" className="block">
            <Button variant="whatsapp" size="md" className="w-full">
              Pedir por WhatsApp
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
