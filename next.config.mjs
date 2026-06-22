/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Optimización activa: next/image sirve AVIF/WebP responsivos (mejor LCP/CWV,
    // factor de ranking SEO). Las fotos locales y de Sanity se optimizan.
    formats: ["image/avif", "image/webp"],
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
  // Redirects 301 desde las URLs del sitio anterior (VirtueMart) para preservar
  // el posicionamiento al reemplazar el dominio bigbiker.com.co.
  async redirects() {
    return [
      { source: "/jersey", destination: "/catalogo/jerseys", permanent: true },
      { source: "/jersey/:path*", destination: "/catalogo/jerseys", permanent: true },
      { source: "/chaquetas", destination: "/catalogo/chaquetas", permanent: true },
      { source: "/chaquetas/:path*", destination: "/catalogo/chaquetas", permanent: true },
      { source: "/tubulares", destination: "/catalogo/tubulares", permanent: true },
      { source: "/tubulares/:path*", destination: "/catalogo/tubulares", permanent: true },
      { source: "/accesorios", destination: "/catalogo/accesorios", permanent: true },
      { source: "/accesorios/:path*", destination: "/catalogo/accesorios", permanent: true },
      { source: "/outlet", destination: "/promociones", permanent: true },
      { source: "/outlet/:path*", destination: "/promociones", permanent: true },
      { source: "/linea-institucional", destination: "/contacto", permanent: true },
    ];
  },
};

export default nextConfig;
