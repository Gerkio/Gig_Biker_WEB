import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import { site } from "@/lib/config";
import { whatsappContactUrl } from "@/lib/whatsapp";

export const metadata: Metadata = buildMetadata({
  title: "Contacto",
  description: "Visítanos o escríbenos por WhatsApp. Calle 7 #83A-24, Medellín. Envíos a toda Colombia.",
  path: "/contacto",
});

export default function ContactoPage() {
  const mapsQuery = encodeURIComponent(site.address);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <header className="mb-10">
        <h1 className="heading-display text-4xl sm:text-5xl">
          Hablemos de <span className="text-brand-yellow">motos</span>
        </h1>
        <p className="mt-2 text-zinc-400">
          Visítanos en nuestra tienda o escríbenos por WhatsApp.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Info */}
        <Reveal>
          <div className="space-y-6">
            <ContactRow icon={MapPin} title="Dirección">
              {site.address}
            </ContactRow>
            <ContactRow icon={Phone} title="WhatsApp">
              +57 300 609 8946
            </ContactRow>
            <ContactRow icon={Mail} title="Correo">
              {site.email}
            </ContactRow>
            <ContactRow icon={Clock} title="Horario">
              Lun a Sáb · 9:00 a.m. – 7:00 p.m.
            </ContactRow>

            <a
              href={whatsappContactUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <Button variant="whatsapp" size="lg">
                Escríbenos por WhatsApp
              </Button>
            </a>
          </div>
        </Reveal>

        {/* Mapa */}
        <Reveal delay={0.1}>
          <div className="h-80 overflow-hidden rounded-xl border border-white/10 lg:h-full">
            <iframe
              title="Ubicación Big Biker"
              src={`https://www.google.com/maps?q=${mapsQuery}&output=embed`}
              className="h-full w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </Reveal>
      </div>
    </div>
  );
}

function ContactRow({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-4 rounded-xl border border-white/5 bg-ink-700/40 p-5">
      <Icon className="mt-0.5 h-6 w-6 shrink-0 text-brand-yellow" />
      <div>
        <p className="text-sm font-bold uppercase tracking-wide text-white">
          {title}
        </p>
        <p className="text-zinc-400">{children}</p>
      </div>
    </div>
  );
}
