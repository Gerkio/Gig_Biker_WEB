"use client";

import { motion } from "framer-motion";
import { Banknote, RefreshCw, ShieldCheck, Truck } from "lucide-react";

const items = [
  { icon: Truck, title: "Envío a todo el país", text: "Despachos a toda Colombia" },
  { icon: Banknote, title: "Paga contra entrega", text: "En ciudades principales" },
  { icon: ShieldCheck, title: "Producto original", text: "Calidad garantizada" },
  { icon: RefreshCw, title: "Cambios fáciles", text: "Tienes 5 días hábiles" },
];

// Barra de confianza: dispara la conversion mostrando garantias clave.
export function TrustBar() {
  return (
    <section className="border-y border-white/10 bg-ink-900">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-4 gap-y-6 px-4 py-8 lg:grid-cols-4 lg:px-8">
        {items.map((it, idx) => (
          <motion.div
            key={it.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.08 }}
            className="flex items-center gap-3"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-yellow/10 text-brand-yellow">
              <it.icon className="h-5 w-5" />
            </span>
            <div className="leading-tight">
              <p className="text-sm font-bold text-white">{it.title}</p>
              <p className="text-xs text-zinc-400">{it.text}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
