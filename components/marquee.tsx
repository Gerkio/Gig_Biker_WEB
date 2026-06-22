/** Cinta horizontal infinita con palabras/marcas (efecto agresivo). */
export function Marquee({ items }: { items: string[] }) {
  const doubled = [...items, ...items];
  return (
    <div className="relative flex overflow-hidden border-y border-white/10 bg-brand-yellow py-3">
      <div className="flex shrink-0 animate-marquee items-center gap-8 whitespace-nowrap pr-8">
        {doubled.map((it, i) => (
          <span
            key={i}
            className="font-display text-xl uppercase tracking-wide text-brand-black"
          >
            {it} <span className="text-brand-red">✦</span>
          </span>
        ))}
      </div>
      <div
        aria-hidden
        className="flex shrink-0 animate-marquee items-center gap-8 whitespace-nowrap pr-8"
      >
        {doubled.map((it, i) => (
          <span
            key={i}
            className="font-display text-xl uppercase tracking-wide text-brand-black"
          >
            {it} <span className="text-brand-red">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
