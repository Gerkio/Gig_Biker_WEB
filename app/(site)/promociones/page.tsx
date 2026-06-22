import type { Metadata } from "next";
import { Ticket } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import { getActiveCoupons, getFeaturedProducts, getProducts } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Promociones",
  description: "Cupones activos y productos destacados de Big Biker. Aprovecha los descuentos en indumentaria y accesorios para moto.",
  path: "/promociones",
});

export default async function PromocionesPage() {
  const [coupons, products, featured] = await Promise.all([
    getActiveCoupons(),
    getProducts(),
    getFeaturedProducts(),
  ]);
  // Si hay productos con precio anterior, son "ofertas"; si no, mostramos destacados.
  const onSale = products.filter((p) => p.compareAtPrice);
  const showcase = onSale.length > 0 ? onSale : featured;
  const showcaseTitle = onSale.length > 0 ? "En oferta" : "Destacados";

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <header className="mb-10">
        <h1 className="heading-display text-4xl sm:text-5xl">
          Zona de <span className="text-brand-red">ofertas</span>
        </h1>
        <p className="mt-2 text-zinc-400">
          Cupones activos para aplicar en tu compra. Gestionados desde el CMS.
        </p>
      </header>

      {/* Cupones */}
      {coupons.length > 0 && (
        <section className="mb-14">
          <h2 className="mb-4 font-display text-2xl uppercase">Cupones activos</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {coupons.map((c, i) => (
              <Reveal key={c._id} delay={i * 0.06}>
                <div className="relative overflow-hidden rounded-xl border border-dashed border-brand-yellow/50 bg-gradient-to-br from-ink-700 to-ink-900 p-5">
                  <div className="flex items-center gap-3">
                    <Ticket className="h-8 w-8 text-brand-yellow" />
                    <div>
                      <p className="font-display text-2xl text-brand-yellow">
                        {c.code}
                      </p>
                      <p className="text-sm text-zinc-400">
                        {c.label ?? `${c.percentage}% de descuento`}
                      </p>
                    </div>
                  </div>
                  <span className="absolute -right-4 -top-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-red text-sm font-bold text-white">
                    -{c.percentage}%
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Productos: ofertas reales o destacados */}
      <section>
        <h2 className="mb-4 font-display text-2xl uppercase">{showcaseTitle}</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {showcase.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
