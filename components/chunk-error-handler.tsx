"use client";

import { useEffect } from "react";

// Auto-recuperación ante ChunkLoadError: ocurre cuando el navegador tiene
// cacheada una versión anterior del sitio y pide archivos JS que cambiaron
// tras un nuevo build/deploy. En vez de mostrar "Application error", se
// recarga la página una sola vez (con guardia anti-bucle).
export function ChunkErrorHandler() {
  useEffect(() => {
    const KEY = "bb-chunk-reload-at";

    function isChunkError(msg: string) {
      return /ChunkLoadError|Loading chunk [\d]+ failed|Loading CSS chunk|Failed to fetch dynamically imported module|importing a module script failed/i.test(
        msg
      );
    }

    function recover() {
      const last = Number(sessionStorage.getItem(KEY) || 0);
      // Evita bucles: máximo una recarga cada 10s.
      if (Date.now() - last < 10000) return;
      sessionStorage.setItem(KEY, String(Date.now()));
      window.location.reload();
    }

    function onError(e: ErrorEvent) {
      if (isChunkError(e?.message || "")) recover();
    }
    function onRejection(e: PromiseRejectionEvent) {
      const reason = e?.reason;
      const msg =
        typeof reason === "string" ? reason : reason?.message || reason?.name || "";
      if (isChunkError(msg)) recover();
    }

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);

  return null;
}
