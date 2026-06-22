"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, ChevronDown, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] } },
};

export interface HeroProps {
  badge?: string;
  title?: string;
  highlight?: string;
  subtitle?: string;
  image?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
}

// Valores por defecto si el CMS no define el contenido del Hero.
const DEFAULTS: Required<Omit<HeroProps, "image">> = {
  badge: "Medellín · Colombia",
  title: "Vive la moto",
  highlight: "al máximo",
  subtitle:
    "Jerseys, chaquetas reflectivas, tubulares y accesorios de alto desempeño. Todo para el motero que no se detiene.",
  primaryCtaLabel: "Explorar catálogo",
  primaryCtaHref: "/catalogo",
  secondaryCtaLabel: "Ver chaquetas",
  secondaryCtaHref: "/catalogo/chaquetas",
};

export function Hero(props: HeroProps) {
  const c = { ...DEFAULTS, ...Object.fromEntries(Object.entries(props).filter(([, v]) => v)) } as Required<HeroProps>;
  const image = props.image || "/hero.jpg";

  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  // Parallax sutil: la imagen se mueve mas lento que el scroll.
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);

  return (
    <section ref={ref} className="relative overflow-hidden bg-ink-900">
      {/* Imagen de fondo con overlay + parallax */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 scale-110">
        <Image
          src={image}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-900 via-ink-900/80 to-ink-900/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900 to-transparent" />
      </motion.div>

      {/* Detalle diagonal amarillo */}
      <div className="absolute -right-20 top-0 h-full w-1/3 -skew-x-12 bg-brand-yellow/10" />

      <div className="relative mx-auto flex min-h-[78vh] max-w-7xl flex-col justify-center px-4 py-20 lg:px-8">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-2xl"
        >
          <motion.p
            variants={item}
            className="mb-4 inline-block bg-brand-red px-3 py-1 text-xs font-bold uppercase tracking-[0.2em]"
          >
            {c.badge}
          </motion.p>
          <motion.h1
            variants={item}
            className="heading-display text-5xl text-white sm:text-7xl lg:text-8xl"
          >
            {c.title}
            <span className="block text-brand-yellow">{c.highlight}</span>
          </motion.h1>
          <motion.p
            variants={item}
            className="mt-6 max-w-lg text-lg text-zinc-300"
          >
            {c.subtitle}
          </motion.p>
          <motion.div variants={item} className="mt-8 flex flex-wrap gap-4">
            <Link href={c.primaryCtaHref}>
              <Button size="lg" variant="primary">
                {c.primaryCtaLabel} <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href={c.secondaryCtaHref}>
              <Button size="lg" variant="outline">
                {c.secondaryCtaLabel}
              </Button>
            </Link>
          </motion.div>

          {/* Prueba social */}
          <motion.div
            variants={item}
            className="mt-8 flex items-center gap-3 text-sm text-zinc-300"
          >
            <span className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-brand-yellow text-brand-yellow" />
              ))}
            </span>
            <span>
              <strong className="text-white">+5.000 moteros</strong> ya se
              equipan con Big Biker
            </span>
          </motion.div>
        </motion.div>
      </div>

      {/* Indicador de scroll */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-5 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="h-6 w-6 text-brand-yellow/70" />
        </motion.div>
      </motion.div>
    </section>
  );
}
