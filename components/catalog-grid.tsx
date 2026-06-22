"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "./product-card";
import { cn } from "@/lib/utils";
import { categoriesNav } from "@/lib/config";
import type { CategorySlug, Product } from "@/lib/types";

type SortKey = "relevancia" | "precio-asc" | "precio-desc";

interface CatalogGridProps {
  products: Product[];
  /** Si viene fija (PLP por categoria), oculta el filtro de categoria. */
  lockedCategory?: CategorySlug;
}

const norm = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/** Grid de productos con búsqueda (?q=), filtro por categoría y orden. */
export function CatalogGrid({ products, lockedCategory }: CatalogGridProps) {
  const query = (useSearchParams().get("q") ?? "").trim();
  const [category, setCategory] = useState<CategorySlug | "todas">(
    lockedCategory ?? "todas"
  );
  const [sort, setSort] = useState<SortKey>("relevancia");

  const filtered = useMemo(() => {
    let list = products;
    if (!lockedCategory && category !== "todas") {
      list = list.filter((p) => p.category === category);
    }
    if (query) {
      const q = norm(query);
      list = list.filter((p) =>
        norm(
          `${p.title} ${p.brand ?? ""} ${p.category} ${(p.tags ?? []).join(" ")} ${p.description}`
        ).includes(q)
      );
    }
    if (sort === "precio-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "precio-desc") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [products, category, sort, lockedCategory, query]);

  return (
    <div>
      {query && (
        <p className="mb-6 text-zinc-300">
          Resultados para <span className="font-bold text-brand-yellow">“{query}”</span>
        </p>
      )}
      {/* Barra de filtros */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {!lockedCategory && (
          <div className="flex flex-wrap gap-2">
            {(["todas", ...categoriesNav.map((c) => c.slug)] as const).map(
              (slug) => (
                <button
                  key={slug}
                  onClick={() => setCategory(slug as CategorySlug | "todas")}
                  className={cn(
                    "rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors",
                    category === slug
                      ? "border-brand-yellow bg-brand-yellow text-brand-black"
                      : "border-white/15 text-zinc-300 hover:border-brand-yellow/60"
                  )}
                >
                  {slug === "todas" ? "Todas" : slug}
                </button>
              )
            )}
          </div>
        )}

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="rounded-md border border-white/15 bg-ink-800 px-3 py-2 text-sm text-zinc-200 focus:border-brand-yellow focus:outline-none"
        >
          <option value="relevancia">Relevancia</option>
          <option value="precio-asc">Precio: menor a mayor</option>
          <option value="precio-desc">Precio: mayor a menor</option>
        </select>
      </div>

      <p className="mb-4 text-sm text-zinc-400">
        {filtered.length} producto{filtered.length !== 1 ? "s" : ""}
      </p>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {filtered.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-20 text-center text-zinc-500">
          {query
            ? `No encontramos productos para “${query}”.`
            : "No hay productos en esta categoría."}
        </p>
      )}
    </div>
  );
}
