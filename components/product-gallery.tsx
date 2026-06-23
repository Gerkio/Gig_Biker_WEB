"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Visualizador de producto: imagen principal con zoom al pasar el mouse,
 * navegación con flechas/teclado, contador y lightbox a pantalla completa.
 */
export function ProductGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const gallery = images.filter(Boolean);
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const [lightbox, setLightbox] = useState(false);

  const count = gallery.length;

  const go = useCallback(
    (next: number) => {
      const n = (next + count) % count;
      setDir(next > active ? 1 : -1);
      setActive(n);
    },
    [active, count]
  );

  // Teclado en el lightbox
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false);
      if (e.key === "ArrowRight") go(active + 1);
      if (e.key === "ArrowLeft") go(active - 1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, active, go]);

  if (count === 0) return null;

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    setZoom({
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
    });
  }

  const slide = {
    enter: (d: number) => ({ opacity: 0, x: d > 0 ? 40 : -40 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: d > 0 ? -40 : 40 }),
  };

  return (
    <div className="space-y-3">
      {/* Imagen principal */}
      <div
        className="group relative aspect-square cursor-zoom-in select-none overflow-hidden rounded-2xl border border-white/10 bg-ink-900"
        onMouseMove={onMove}
        onMouseLeave={() => setZoom(null)}
        onClick={() => setLightbox(true)}
      >
        <AnimatePresence custom={dir} mode="popLayout">
          <motion.div
            key={active}
            custom={dir}
            variants={slide}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="absolute inset-0"
          >
            <div
              className="h-full w-full transition-transform duration-200 ease-out"
              style={{
                transform: zoom ? "scale(1.9)" : "scale(1)",
                transformOrigin: zoom ? `${zoom.x}% ${zoom.y}%` : "center",
              }}
            >
              <Image
                src={gallery[active]}
                alt={alt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Contador */}
        {count > 1 && (
          <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
            {active + 1} / {count}
          </span>
        )}

        {/* Expandir */}
        <span className="pointer-events-none absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/55 text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
          <Maximize2 className="h-4 w-4" />
        </span>

        {/* Flechas */}
        {count > 1 && (
          <>
            <ArrowBtn side="left" onClick={(e) => { e.stopPropagation(); go(active - 1); }} />
            <ArrowBtn side="right" onClick={(e) => { e.stopPropagation(); go(active + 1); }} />
          </>
        )}
      </div>

      {/* Miniaturas */}
      {count > 1 && (
        <div className="flex gap-2.5 overflow-x-auto pb-1">
          {gallery.map((img, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Ver imagen ${i + 1}`}
              onClick={() => go(i)}
              className={cn(
                "relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all",
                active === i
                  ? "border-brand-yellow opacity-100"
                  : "border-transparent opacity-60 hover:opacity-100"
              )}
            >
              <Image src={img} alt={`${alt} ${i + 1}`} fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex flex-col bg-black/90 backdrop-blur-sm"
            onClick={() => setLightbox(false)}
          >
            {/* Barra superior */}
            <div className="flex items-center justify-between px-5 py-4 text-white">
              <span className="text-sm font-semibold">
                {active + 1} / {count}
              </span>
              <button
                aria-label="Cerrar"
                onClick={() => setLightbox(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Imagen */}
            <div className="relative flex flex-1 items-center justify-center overflow-hidden px-4">
              <AnimatePresence custom={dir} mode="popLayout">
                <motion.div
                  key={active}
                  custom={dir}
                  variants={slide}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.25 }}
                  drag={count > 1 ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -80) go(active + 1);
                    else if (info.offset.x > 80) go(active - 1);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="relative h-full w-full max-w-4xl"
                >
                  <Image
                    src={gallery[active]}
                    alt={alt}
                    fill
                    sizes="100vw"
                    className="object-contain"
                  />
                </motion.div>
              </AnimatePresence>

              {count > 1 && (
                <>
                  <ArrowBtn side="left" big onClick={(e) => { e.stopPropagation(); go(active - 1); }} />
                  <ArrowBtn side="right" big onClick={(e) => { e.stopPropagation(); go(active + 1); }} />
                </>
              )}
            </div>

            {/* Miniaturas */}
            {count > 1 && (
              <div className="flex justify-center gap-2 px-4 py-4" onClick={(e) => e.stopPropagation()}>
                {gallery.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={`Ver imagen ${i + 1}`}
                    onClick={() => go(i)}
                    className={cn(
                      "relative h-14 w-14 shrink-0 overflow-hidden rounded-md border-2 transition-all",
                      active === i ? "border-brand-yellow" : "border-transparent opacity-50 hover:opacity-100"
                    )}
                  >
                    <Image src={img} alt="" fill sizes="56px" className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ArrowBtn({
  side,
  big,
  onClick,
}: {
  side: "left" | "right";
  big?: boolean;
  onClick: (e: React.MouseEvent) => void;
}) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      aria-label={side === "left" ? "Anterior" : "Siguiente"}
      onClick={onClick}
      className={cn(
        "absolute top-1/2 z-10 flex -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur transition-all hover:bg-brand-yellow hover:text-brand-black",
        side === "left" ? "left-3" : "right-3",
        big ? "h-12 w-12" : "h-10 w-10 opacity-0 group-hover:opacity-100"
      )}
    >
      <Icon className={big ? "h-6 w-6" : "h-5 w-5"} />
    </button>
  );
}
