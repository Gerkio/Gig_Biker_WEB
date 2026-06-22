import type { Metadata } from "next";
import { Inter, Anton } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/config";
import { ChunkErrorHandler } from "@/components/chunk-error-handler";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Tienda de Motociclismo en Medellín`,
    template: `%s · ${site.name}`,
  },
  description:
    "Indumentaria y accesorios para motociclismo: jerseys, chaquetas reflectivas, tubulares, gorras y maletas. Envíos a toda Colombia. Big Biker, Medellín.",
  applicationName: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "es_CO",
    url: site.url,
    images: [{ url: "/hero.jpg", width: 1600, height: 900 }],
  },
  twitter: { card: "summary_large_image" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  // Los íconos se detectan automáticamente desde app/icon.png y app/apple-icon.png.
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } }
    : {}),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es-CO" className={`${inter.variable} ${anton.variable}`}>
      <body className="min-h-screen">
        <ChunkErrorHandler />
        {children}
      </body>
    </html>
  );
}
