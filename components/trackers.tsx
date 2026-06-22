"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { track } from "@/lib/track";

/** Registra una visita en cada cambio de ruta. */
export function PageViewTracker() {
  const pathname = usePathname();
  useEffect(() => {
    track({ type: "pageview" });
  }, [pathname]);
  return null;
}

/** Registra la vista de un producto (se monta en el PDP). */
export function ProductViewTracker({ slug, title }: { slug: string; title: string }) {
  useEffect(() => {
    track({ type: "product_view", slug, title });
  }, [slug, title]);
  return null;
}
