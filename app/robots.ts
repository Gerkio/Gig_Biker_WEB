import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";
import { site } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/studio", "/api/", "/carrito", "/checkout"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: site.url,
  };
}
