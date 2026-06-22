"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-store";
import { formatCOP } from "@/lib/utils";
import { whatsappCartUrl } from "@/lib/whatsapp";
import { track } from "@/lib/track";

/** Panel lateral del carrito. Se abre al agregar un producto. */
export function CartSheet() {
  const { items, isOpen, closeCart, removeItem, updateQuantity } = useCart();
  const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />
          {/* Panel */}
          <motion.aside
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-white/10 bg-ink-900 shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
          >
            <header className="flex items-center justify-between border-b border-white/10 p-5">
              <h2 className="flex items-center gap-2 font-display text-xl uppercase">
                <ShoppingBag className="h-5 w-5 text-brand-yellow" />
                Tu carrito
              </h2>
              <button
                onClick={closeCart}
                aria-label="Cerrar"
                className="rounded p-1 text-zinc-400 hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </header>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center text-zinc-400">
                <ShoppingBag className="h-12 w-12 opacity-30" />
                <p>Tu carrito está vacío.</p>
                <Button variant="outline" size="sm" onClick={closeCart}>
                  Seguir comprando
                </Button>
              </div>
            ) : (
              <>
                <div className="flex-1 space-y-4 overflow-y-auto p-5">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-md bg-ink-700">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-1 flex-col">
                        <div className="flex justify-between gap-2">
                          <p className="text-sm font-medium leading-tight">
                            {item.title}
                          </p>
                          <button
                            onClick={() => removeItem(item.id)}
                            aria-label="Eliminar"
                            className="text-zinc-500 hover:text-brand-red"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        {item.variant && (
                          <p className="text-xs text-zinc-400">{item.variant}</p>
                        )}
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center gap-2 rounded border border-white/10">
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className="px-2 py-1 text-zinc-300 hover:text-brand-yellow"
                              aria-label="Restar"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="min-w-[1.5rem] text-center text-sm">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="px-2 py-1 text-zinc-300 hover:text-brand-yellow"
                              aria-label="Sumar"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <span className="text-sm font-semibold">
                            {formatCOP(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <footer className="space-y-3 border-t border-white/10 p-5">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Subtotal</span>
                    <span className="text-lg font-bold">
                      {formatCOP(subtotal)}
                    </span>
                  </div>
                  <Link href="/checkout" onClick={closeCart} className="block">
                    <Button variant="primary" size="lg" className="w-full">
                      Finalizar compra
                    </Button>
                  </Link>
                  <a
                    href={whatsappCartUrl(items, subtotal)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                    onClick={() =>
                      track({
                        type: "purchase",
                        source: "whatsapp",
                        items: items.map((i) => ({
                          slug: i.slug,
                          title: i.title,
                          qty: i.quantity,
                        })),
                      })
                    }
                  >
                    <Button variant="whatsapp" size="md" className="w-full">
                      Pedir por WhatsApp
                    </Button>
                  </a>
                </footer>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
