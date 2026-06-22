import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout-form";
import { getActiveCoupons } from "@/lib/data";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false, follow: false },
};

export default async function CheckoutPage() {
  // Los cupones activos se cargan en el servidor (desde Sanity o semilla)
  // y se validan en el cliente sin exponer logica de backend.
  const coupons = await getActiveCoupons();
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 lg:px-8">
      <h1 className="heading-display mb-2 text-4xl">Finalizar compra</h1>
      <p className="mb-8 text-sm text-zinc-400">
        Maqueta de demostración · no se realiza ningún cobro real.
      </p>
      <CheckoutForm coupons={coupons} />
    </div>
  );
}
