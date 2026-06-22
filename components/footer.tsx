import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { categoriesNav, site } from "@/lib/config";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-white/10 bg-ink-900">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div className="space-y-3">
          <p className="heading-display text-2xl text-brand-yellow">
            {site.name}
          </p>
          <p className="text-sm text-zinc-400">{site.tagline}.</p>
          <p className="text-sm text-zinc-400">{site.city}</p>
        </div>

        <div className="space-y-2">
          <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-white">
            Tienda
          </h4>
          {categoriesNav.map((c) => (
            <Link
              key={c.slug}
              href={`/catalogo/${c.slug}`}
              className="block text-sm text-zinc-400 hover:text-brand-yellow"
            >
              {c.title}
            </Link>
          ))}
          <Link href="/promociones" className="block text-sm text-zinc-400 hover:text-brand-yellow">
            Promociones
          </Link>
        </div>

        <div className="space-y-2">
          <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-white">
            Compañía
          </h4>
          <Link href="/nosotros" className="block text-sm text-zinc-400 hover:text-brand-yellow">
            Nosotros
          </Link>
          <Link href="/contacto" className="block text-sm text-zinc-400 hover:text-brand-yellow">
            Contacto
          </Link>
        </div>

        <div className="space-y-3">
          <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-white">
            Contacto
          </h4>
          <a
            href={`https://wa.me/${site.whatsappNumber}`}
            className="flex items-center gap-2 text-sm text-zinc-400 hover:text-brand-yellow"
          >
            <Phone className="h-4 w-4" /> +57 300 609 8946
          </a>
          <a
            href={`mailto:${site.email}`}
            className="flex items-center gap-2 text-sm text-zinc-400 hover:text-brand-yellow"
          >
            <Mail className="h-4 w-4" /> {site.email}
          </a>
          <p className="flex items-start gap-2 text-sm text-zinc-400">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0" /> {site.address}
          </p>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-xs text-zinc-500">
        © {site.name} — Maqueta de demostración. Pagos en línea disponibles en
        la versión final.
      </div>
    </footer>
  );
}
