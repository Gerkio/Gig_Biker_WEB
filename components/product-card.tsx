"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/lib/cart-store";
import { cn, discountPct, formatCOP } from "@/lib/utils";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCart((s) => s.addItem);
  const off = discountPct(product.price, product.compareAtPrice);

  function quickAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    // Si tiene variantes, mejor enviar al PDP; si no, agregado directo.
    addItem(product);
  }

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="group relative"
    >
      <Link
        href={`/producto/${product.slug}`}
        className="block overflow-hidden rounded-xl border border-white/5 bg-ink-700/40 transition-colors duration-300 group-hover:border-brand-yellow/60"
      >
        {/* Imagen + swap en hover */}
        <div className="relative aspect-[4/5] overflow-hidden bg-ink-900">
          <Image
            src={product.image}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className={cn(
              "object-cover transition-all duration-500",
              product.hoverImage
                ? "group-hover:opacity-0"
                : "group-hover:scale-105"
            )}
          />
          {product.hoverImage && (
            <Image
              src={product.hoverImage}
              alt={`${product.title} - detalle`}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover opacity-0 scale-105 transition-opacity duration-500 group-hover:opacity-100"
            />
          )}

          {/* Badges */}
          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {off && (
              <Badge tone="red" className="animate-pulse">
                -{off}%
              </Badge>
            )}
            {product.featured && <Badge tone="yellow">Top</Badge>}
          </div>

          {/* Boton rapido "+ Agregar" que sube en hover */}
          <div className="absolute inset-x-0 bottom-0 translate-y-full p-3 transition-transform duration-300 group-hover:translate-y-0">
            <button
              onClick={quickAdd}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-brand-yellow py-2.5 text-xs font-bold uppercase tracking-wide text-brand-black transition-colors hover:bg-yellow-400"
            >
              <Plus className="h-4 w-4" /> Agregar rápido
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-1 p-4">
          {product.brand && (
            <p className="text-[11px] font-semibold uppercase tracking-widest text-brand-yellow/80">
              {product.brand}
            </p>
          )}
          <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-medium text-zinc-100">
            {product.title}
          </h3>
          {product.rating && (
            <div className="flex items-center gap-1 text-xs text-zinc-400">
              <Star className="h-3.5 w-3.5 fill-brand-yellow text-brand-yellow" />
              {product.rating.toFixed(1)}
            </div>
          )}
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-base font-bold text-white">
              {formatCOP(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-xs text-zinc-500 line-through">
                {formatCOP(product.compareAtPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
