import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";
import { Flag, Gauge, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import { Counter } from "@/components/counter";

export const metadata: Metadata = buildMetadata({
  title: "Nosotros",
  description: "La historia de Big Biker, tu tienda de indumentaria y accesorios para motociclismo en Medellín.",
  path: "/nosotros",
});

const values = [
  { icon: Gauge, title: "Alto desempeño", text: "Prendas reflectivas, impermeables y técnicas que rinden en cada rodada." },
  { icon: Wrench, title: "Asesoría experta", text: "Moteros atendiendo a moteros. Sabemos lo que necesitas para rodar seguro." },
  { icon: Flag, title: "Pasión por la moto", text: "Más que una tienda, una comunidad que vive sobre dos ruedas." },
];

export default function NosotrosPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/hero.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/70 to-ink-900/40" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-28 lg:px-8">
          <Reveal>
            <p className="mb-3 inline-block bg-brand-red px-3 py-1 text-xs font-bold uppercase tracking-widest">
              Medellín · desde 2011
            </p>
            <h1 className="heading-display max-w-2xl text-5xl sm:text-6xl">
              Nacimos del <span className="text-brand-yellow">asfalto</span>
            </h1>
            <p className="mt-4 max-w-xl text-lg text-zinc-300">
              Big Biker es la tienda de los que viven la moto al máximo. Desde
              el corazón de Antioquia para todo Colombia.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Valores */}
      <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {values.map((v, i) => (
            <Reveal key={v.title} delay={i * 0.1}>
              <div className="card-dark h-full p-8">
                <v.icon className="h-10 w-10 text-brand-yellow" />
                <h3 className="heading-display mt-4 text-2xl">{v.title}</h3>
                <p className="mt-2 text-zinc-400">{v.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-white/10 bg-ink-900">
        <div className="mx-auto grid max-w-7xl grid-cols-3 gap-8 px-4 py-14 lg:px-8">
          {[
            { n: 15, suffix: " años", label: "En el mercado" },
            { n: 5000, suffix: "+", label: "Clientes" },
            { n: 1200, suffix: "+", label: "Productos" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="heading-display text-4xl text-brand-yellow sm:text-5xl">
                <Counter to={s.n} suffix={s.suffix} />
              </p>
              <p className="mt-1 text-sm uppercase tracking-wide text-zinc-400">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-3xl px-4 py-20 text-center lg:px-8">
        <h2 className="heading-display text-4xl">
          ¿Listo para tu próxima <span className="text-brand-yellow">rodada?</span>
        </h2>
        <Link href="/catalogo" className="mt-6 inline-block">
          <Button variant="primary" size="lg">
            Ver catálogo
          </Button>
        </Link>
      </section>
    </div>
  );
}
