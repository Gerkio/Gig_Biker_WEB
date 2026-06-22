"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Mensajes por defecto si el CMS no define ninguno.
const defaultMessages = [
  "🚚 Envío a todo Colombia",
  "💵 Paga contra entrega",
  "🏷️ 10% OFF con el código BIGBIKER10",
  "🔒 Compra 100% segura",
];

// Barra superior con mensajes rotativos (gestionables desde el CMS).
export function AnnouncementBar({ messages: cmsMessages }: { messages?: string[] }) {
  const messages = cmsMessages && cmsMessages.length ? cmsMessages : defaultMessages;
  const [i, setI] = useState(0);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;
    const t = setInterval(() => setI((p) => (p + 1) % messages.length), 3200);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative flex h-8 items-center justify-center overflow-hidden bg-brand-yellow text-brand-black">
      <AnimatePresence mode="wait">
        <motion.span
          key={i}
          initial={{ y: 14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -14, opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="text-[11px] font-bold uppercase tracking-widest sm:text-xs"
        >
          {messages[i]}
        </motion.span>
      </AnimatePresence>
      <span className="absolute right-3 hidden text-[10px] font-semibold uppercase tracking-wider text-brand-black/50 sm:block">
        Maqueta demo
      </span>
    </div>
  );
}
