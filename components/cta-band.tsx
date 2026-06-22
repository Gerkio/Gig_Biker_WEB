"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { whatsappContactUrl } from "@/lib/whatsapp";

// Banda final de conversion: empuja a comprar o a escribir por WhatsApp.
export function CtaBand() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl border border-brand-yellow/30 bg-gradient-to-br from-brand-red via-ink-800 to-ink-900 p-10 text-center lg:p-16"
      >
        {/* Detalle diagonal animado */}
        <div className="pointer-events-none absolute -right-24 top-0 h-full w-1/2 -skew-x-12 bg-brand-yellow/10" />
        <div className="pointer-events-none absolute -left-24 bottom-0 h-2/3 w-1/3 skew-x-12 bg-white/5" />

        <div className="relative">
          <h2 className="heading-display text-4xl text-white sm:text-6xl">
            ¿Listo para rodar con <span className="text-brand-yellow">estilo</span>?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-zinc-200">
            Equípate con lo mejor para el motero. Atención inmediata y pago
            contra entrega.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/catalogo">
              <Button size="lg" variant="primary">
                Comprar ahora <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <a href={whatsappContactUrl()} target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="whatsapp">
                Asesoría por WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
