"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback } from "react";
import { ProductCard } from "./product-card";
import type { Product } from "@/lib/types";

/** Carrusel horizontal de productos con autoplay suave (Embla). */
export function ProductSlider({ products }: { products: Product[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { align: "start", loop: true, dragFree: true },
    [Autoplay({ delay: 3500, stopOnInteraction: true })]
  );

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4">
          {products.map((p) => (
            <div
              key={p._id}
              className="min-w-0 flex-[0_0_70%] sm:flex-[0_0_42%] lg:flex-[0_0_25%]"
            >
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={scrollPrev}
        aria-label="Anterior"
        className="absolute -left-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-brand-yellow text-brand-black shadow-lg transition-transform hover:scale-110 lg:flex"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={scrollNext}
        aria-label="Siguiente"
        className="absolute -right-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-brand-yellow text-brand-black shadow-lg transition-transform hover:scale-110 lg:flex"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
