import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center justify-center gap-4 px-4 py-32 text-center">
      <p className="heading-display text-8xl text-brand-yellow">404</p>
      <h1 className="heading-display text-3xl">Te saliste de la vía</h1>
      <p className="text-zinc-400">
        La página que buscas no existe o fue movida.
      </p>
      <Link href="/">
        <Button variant="primary" size="lg">
          Volver al inicio
        </Button>
      </Link>
    </div>
  );
}
