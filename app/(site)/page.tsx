import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/hero";
import { Marquee } from "@/components/marquee";
import { Reveal } from "@/components/reveal";
import { ProductSlider } from "@/components/product-slider";
import { TrustBar } from "@/components/trust-bar";
import { Testimonials } from "@/components/testimonials";
import { CtaBand } from "@/components/cta-band";
import { Faq } from "@/components/faq";
import { JsonLd } from "@/components/json-ld";
import { Button } from "@/components/ui/button";
import {
  getActivePromos,
  getCategories,
  getFeaturedProducts,
  getHomePage,
  getTestimonials,
} from "@/lib/data";
import { categoriesNav } from "@/lib/config";
import {
  itemListSchema,
  localBusinessSchema,
  organizationSchema,
  websiteSchema,
} from "@/lib/structured-data";

// Imágenes de categoría por defecto (si el CMS no define una).
const categoryImageFallback: Record<string, string> = {
  jerseys: "/productos/Brujula_frente_caballero_250x285.jpg",
  chaquetas: "/productos/IMG_2427_250x285.jpg",
  tubulares: "/productos/Camo_acuarela_1_250x285.jpg",
  accesorios: "/productos/Gorra_Azul_Navy_Delta_Premium_1_250x285.jpg",
};

const defaultMarquee = [
  "Jerseys",
  "Chaquetas Reflectivas",
  "Impermeables",
  "Tubulares",
  "Gorras Premium",
  "Maletas Drybag",
  "Big Biker",
];

export default async function HomePage() {
  const [featured, promos, home, testimonials, categories] = await Promise.all([
    getFeaturedProducts(),
    getActivePromos(),
    getHomePage(),
    getTestimonials(),
    getCategories(),
  ]);
  const promo = promos[0];
  const marqueeItems = home?.marquee?.length ? home.marquee : defaultMarquee;
  // Mostramos las categorías del CMS que tengan ruta válida en la tienda.
  const homeCategories = categories.filter((c) =>
    categoriesNav.some((n) => n.slug === c.slug)
  );

  return (
    <>
      <JsonLd
        data={[
          organizationSchema(),
          localBusinessSchema(),
          websiteSchema(),
          itemListSchema(featured, "/"),
        ]}
      />
      <Hero
        badge={home?.heroBadge}
        title={home?.heroTitle}
        highlight={home?.heroHighlight}
        subtitle={home?.heroSubtitle}
        image={home?.heroImage}
        primaryCtaLabel={home?.primaryCtaLabel}
        primaryCtaHref={home?.primaryCtaHref}
        secondaryCtaLabel={home?.secondaryCtaLabel}
        secondaryCtaHref={home?.secondaryCtaHref}
      />

      <TrustBar />

      <Marquee items={marqueeItems} />

      {/* Categorias */}
      <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
        <Reveal>
          <h2 className="heading-display mb-2 text-4xl sm:text-5xl">
            Explora por <span className="text-brand-yellow">categoría</span>
          </h2>
          <p className="mb-10 text-zinc-400">
            Indumentaria y accesorios para vestir tu pasión motera.
          </p>
        </Reveal>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {homeCategories.map((c, i) => (
            <Reveal key={c.slug} delay={i * 0.08}>
              <Link
                href={`/catalogo/${c.slug}`}
                className="group relative block aspect-[3/4] overflow-hidden rounded-xl border border-white/5"
              >
                <Image
                  src={c.image || categoryImageFallback[c.slug]}
                  alt={c.title}
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/30 to-transparent" />
                <div className="absolute bottom-0 left-0 p-5">
                  <h3 className="heading-display text-2xl text-white">
                    {c.title}
                  </h3>
                  <span className="mt-1 flex items-center gap-1 text-sm text-brand-yellow opacity-0 transition-opacity group-hover:opacity-100">
                    Ver mas <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Banner de promo */}
      {promo && (
        <section className="mx-auto max-w-7xl px-4 lg:px-8">
          <Reveal>
            <div className="relative overflow-hidden rounded-2xl border border-brand-yellow/30 bg-gradient-to-r from-brand-red to-ink-900 p-10 lg:p-16">
              <div className="absolute -right-10 top-0 h-full w-1/2 -skew-x-12 bg-white/5" />
              <div className="relative max-w-xl">
                <p className="mb-3 inline-block bg-brand-yellow px-3 py-1 text-xs font-bold uppercase tracking-widest text-brand-black">
                  Promocion
                </p>
                <h2 className="heading-display text-4xl text-white sm:text-5xl">
                  {promo.title}
                </h2>
                {promo.subtitle && (
                  <p className="mt-3 text-lg text-zinc-200">{promo.subtitle}</p>
                )}
                <Link href={promo.ctaHref || "/promociones"} className="mt-6 inline-block">
                  <Button variant="primary" size="lg">
                    {promo.ctaLabel || "Ver ofertas"}{" "}
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </Reveal>
        </section>
      )}

      {/* Destacados */}
      <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
        <Reveal>
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="heading-display text-4xl sm:text-5xl">
                Lo más <span className="text-brand-yellow">vendido</span>
              </h2>
              <p className="mt-2 text-zinc-400">
                Selección de la casa para los que viven la moto.
              </p>
            </div>
            <Link
              href="/catalogo"
              className="hidden items-center gap-1 text-sm font-semibold uppercase tracking-wide text-brand-yellow hover:underline sm:flex"
            >
              Ver todo <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
        <ProductSlider products={featured} />
      </section>

      {/* Prueba social */}
      <Testimonials items={testimonials} />

      {/* Stats */}
      <section className="border-y border-white/10 bg-ink-900">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-14 lg:grid-cols-4 lg:px-8">
          {(home?.stats?.length
            ? home.stats.map((s) => ({ value: s.value, label: s.label }))
            : [
                { value: "+5.000", label: "Moteros felices" },
                { value: "+1.200", label: "Productos" },
                { value: "15 años", label: "De experiencia" },
                { value: "4.9", label: "Calificación" },
              ]
          ).map((s) => (
            <div key={s.label} className="text-center">
              <p className="heading-display text-4xl text-brand-yellow sm:text-5xl">
                {s.value}
              </p>
              <p className="mt-1 text-sm uppercase tracking-wide text-zinc-400">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Preguntas frecuentes (AEO) */}
      <Faq />

      {/* Cierre de conversion */}
      <CtaBand />
    </>
  );
}
