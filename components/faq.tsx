import { JsonLd } from "./json-ld";
import { faqSchema } from "@/lib/structured-data";
import { Reveal } from "./reveal";

// Preguntas frecuentes (contenido estático conciso, formato "respuesta directa").
// Alimenta AEO: emite FAQPage para AI Overviews / asistentes y rich results.
export const faqItems = [
  {
    q: "¿Hacen envíos a toda Colombia?",
    a: "Sí. Big Biker despacha a todo el país desde Medellín. Los tiempos de entrega típicos son de 2 a 5 días hábiles según la ciudad.",
  },
  {
    q: "¿Puedo pagar contra entrega?",
    a: "Sí, ofrecemos pago contra entrega en las principales ciudades de Colombia. También puedes coordinar el pago por WhatsApp al concretar tu pedido.",
  },
  {
    q: "¿Los productos son originales?",
    a: "Todos nuestros jerseys, chaquetas, tubulares y accesorios son originales y de alta calidad, pensados para el uso real en moto.",
  },
  {
    q: "¿Cómo sé qué talla elegir?",
    a: "Cada producto muestra sus tallas disponibles. Si tienes dudas, escríbenos por WhatsApp y te asesoramos para que elijas la talla correcta.",
  },
  {
    q: "¿Puedo cambiar un producto si no me queda?",
    a: "Sí. Aceptamos cambios dentro de los 5 días hábiles siguientes a la entrega, siempre que el producto esté sin uso y con sus etiquetas.",
  },
  {
    q: "¿Dónde están ubicados?",
    a: "Estamos en Calle 7 #83A-24 Interior 143, Medellín, Antioquia. Atendemos de lunes a sábado de 9:00 a.m. a 7:00 p.m.",
  },
];

export function Faq() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-20 lg:px-8">
      <JsonLd data={faqSchema(faqItems.map((i) => ({ q: i.q, a: i.a })))} />
      <Reveal>
        <p className="text-sm font-semibold uppercase tracking-widest text-brand-yellow">
          Preguntas frecuentes
        </p>
        <h2 className="heading-display mt-1 text-4xl sm:text-5xl">
          Todo lo que <span className="text-brand-yellow">necesitas saber</span>
        </h2>
      </Reveal>

      <div className="mt-10 space-y-3">
        {faqItems.map((item, i) => (
          <Reveal key={item.q} delay={i * 0.05}>
            <details className="group rounded-xl border border-white/10 bg-ink-800/60 p-5 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer items-center justify-between gap-4 font-semibold text-white">
                {item.q}
                <span className="shrink-0 text-brand-yellow transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-zinc-300">{item.a}</p>
            </details>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
