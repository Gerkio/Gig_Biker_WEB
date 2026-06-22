"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-store";
import { cn } from "@/lib/utils";
import { whatsappProductUrl } from "@/lib/whatsapp";
import { track } from "@/lib/track";
import type { Product } from "@/lib/types";

/** Selector de variante + CTAs de compra del PDP (clics 2 y 3). */
export function ProductPurchase({ product }: { product: Product }) {
  const addItem = useCart((s) => s.addItem);
  const hasVariants = (product.variants?.length ?? 0) > 0;
  const [variant, setVariant] = useState<string | undefined>(undefined);
  const [error, setError] = useState(false);

  // El stock es único por producto (no por talla).
  const outOfStock = (product.stock ?? 0) === 0;

  function validate(): boolean {
    if (hasVariants && !variant) {
      setError(true);
      return false;
    }
    return true;
  }

  function handleAdd() {
    if (!validate()) return;
    addItem(product, variant);
  }

  return (
    <div className="space-y-6">
      {/* Selector de variantes */}
      {hasVariants && (
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-semibold uppercase tracking-wide text-zinc-300">
              {product.variants![0].kind === "color" ? "Color" : "Talla"}
            </span>
            {error && (
              <span className="text-xs text-brand-red">
                Selecciona una opción
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {product.variants!.map((v) => (
              <button
                key={v.label}
                onClick={() => {
                  setVariant(v.label);
                  setError(false);
                }}
                className={cn(
                  "min-w-[3rem] rounded-md border px-3 py-2 text-sm font-semibold transition-colors",
                  variant === v.label
                    ? "border-brand-yellow bg-brand-yellow text-brand-black"
                    : "border-white/15 text-zinc-200 hover:border-brand-yellow/60"
                )}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* CTAs — clic 3 (dos rutas) */}
      <div className="flex flex-col gap-3">
        <a
          href={whatsappProductUrl(product, variant)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            if (!validate()) {
              e.preventDefault();
              return;
            }
            track({
              type: "purchase",
              source: "whatsapp",
              slug: product.slug,
              title: product.title,
            });
          }}
        >
          <Button variant="whatsapp" size="lg" className="w-full" disabled={outOfStock}>
            Comprar por WhatsApp
          </Button>
        </a>
        <Button
          variant="primary"
          size="lg"
          className="w-full"
          onClick={handleAdd}
          disabled={outOfStock}
        >
          <ShoppingBag className="h-5 w-5" />
          {outOfStock ? "Agotado" : "Agregar al carrito"}
        </Button>
        <Link href="/checkout" className="text-center text-xs text-zinc-400 underline-offset-4 hover:text-brand-yellow hover:underline">
          Ir directo al checkout
        </Link>
      </div>
    </div>
  );
}
