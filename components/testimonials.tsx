"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { Reveal } from "./reveal";

interface Review {
  name: string;
  city?: string;
  text: string;
  rating?: number;
}

// Testimonios por defecto si el CMS no tiene ninguno.
const defaultReviews: Review[] = [
  {
    name: "Andrés R.",
    city: "Medellín",
    text: "La chaqueta reflectiva es brutal, me ven a kilómetros de noche. Pedido entregado en 2 días.",
  },
  {
    name: "Catalina M.",
    city: "Bogotá",
    text: "El tubular es comodísimo y la tela no aprieta. Ya pedí tres más para mis parceros.",
  },
  {
    name: "Jorge L.",
    city: "Cali",
    text: "Pagué contra entrega sin problema. Calidad real, no como otras tiendas. Vuelvo a comprar fijo.",
  },
];

// Prueba social del nicho motero (gestionable desde el CMS).
export function Testimonials({ items }: { items?: Review[] }) {
  const reviews = items && items.length ? items : defaultReviews;
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
      <Reveal>
        <p className="text-sm font-semibold uppercase tracking-widest text-brand-yellow">
          Lo que dicen los moteros
        </p>
        <h2 className="heading-display mt-1 text-4xl sm:text-5xl">
          Miles ruedan con <span className="text-brand-yellow">Big Biker</span>
        </h2>
      </Reveal>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {reviews.map((r, i) => (
          <motion.div
            key={r.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            whileHover={{ y: -6 }}
            className="card-dark relative p-6"
          >
            <Quote className="absolute right-5 top-5 h-8 w-8 text-brand-yellow/20" />
            <div className="mb-3 flex gap-0.5">
              {Array.from({ length: 5 }).map((_, s) => (
                <Star key={s} className="h-4 w-4 fill-brand-yellow text-brand-yellow" />
              ))}
            </div>
            <p className="text-zinc-200">“{r.text}”</p>
            <div className="mt-5 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-red font-display text-lg text-white">
                {r.name[0]}
              </span>
              <div className="leading-tight">
                <p className="text-sm font-bold text-white">{r.name}</p>
                <p className="text-xs text-zinc-400">{r.city}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
