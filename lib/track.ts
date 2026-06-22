"use client";

// Envía eventos reales del sitio a /api/track (analítica de primera mano).
// Usa sendBeacon cuando es posible para no bloquear la navegación.

type TrackPayload = {
  type: "pageview" | "product_view" | "add_to_cart" | "purchase";
  slug?: string;
  title?: string;
  source?: "whatsapp" | "checkout";
  items?: { slug: string; title?: string; qty?: number }[];
};

export function track(payload: TrackPayload) {
  if (typeof window === "undefined") return;
  try {
    const body = JSON.stringify(payload);
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/track", new Blob([body], { type: "application/json" }));
    } else {
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    /* la analítica nunca debe romper la UX */
  }
}
