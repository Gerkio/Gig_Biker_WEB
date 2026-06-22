import Link from "next/link";

// 404 a nivel raiz (rutas no encontradas fuera del grupo del sitio).
// Se renderiza sin el chrome del sitio; en espanol y con la marca.
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-brand-black px-4 text-center text-zinc-100">
      <p className="heading-display text-8xl text-brand-yellow">404</p>
      <h1 className="heading-display text-3xl">Te saliste de la vía</h1>
      <p className="text-zinc-400">
        La página que buscas no existe o fue movida.
      </p>
      <Link
        href="/"
        className="mt-2 inline-flex h-12 items-center rounded-md bg-brand-yellow px-6 font-semibold uppercase tracking-wide text-brand-black transition-colors hover:bg-yellow-400"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
