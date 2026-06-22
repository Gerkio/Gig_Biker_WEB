"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-store";
import { formatCOP } from "@/lib/utils";
import { track } from "@/lib/track";
import { site } from "@/lib/config";
import type { Coupon } from "@/lib/types";

type Customer = {
  name: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  notes: string;
};

const EMPTY: Customer = { name: "", phone: "", email: "", city: "", address: "", notes: "" };
const REQUIRED: (keyof Customer)[] = ["name", "phone", "city", "address"];

export function CheckoutForm({ coupons }: { coupons: Coupon[] }) {
  const router = useRouter();
  const { items, subtotal, clear } = useCart();
  const sub = subtotal();

  const [form, setForm] = useState<Customer>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Customer, boolean>>>({});
  const [code, setCode] = useState("");
  const [applied, setApplied] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const discount = applied ? Math.round((sub * applied.percentage) / 100) : 0;
  const total = sub - discount;

  const set = (k: keyof Customer) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: false }));
  };

  function applyCoupon() {
    const found = coupons.find((c) => c.code.toUpperCase() === code.trim().toUpperCase());
    if (found) {
      setApplied(found);
      setCouponError("");
    } else {
      setApplied(null);
      setCouponError("Cupón inválido o vencido.");
    }
  }

  function validate(): boolean {
    const er: Partial<Record<keyof Customer, boolean>> = {};
    for (const f of REQUIRED) if (!form[f].trim()) er[f] = true;
    setErrors(er);
    return Object.keys(er).length === 0;
  }

  async function submit(channel: "checkout" | "whatsapp") {
    if (items.length === 0 || submitting) return;
    if (!validate()) {
      setSubmitError("Completa los campos obligatorios.");
      return;
    }
    setSubmitError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ slug: i.slug, quantity: i.quantity })),
          customer: form,
          couponCode: applied?.code,
          channel,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "No se pudo crear el pedido.");

      // Resumen para la pantalla de confirmación.
      sessionStorage.setItem(
        "bigbiker-last-order",
        JSON.stringify({
          orderNumber: data.orderNumber,
          items: items.map((i) => ({ title: i.title, variant: i.variant, quantity: i.quantity, price: i.price })),
          subtotal: data.subtotal ?? sub,
          discount: data.discount ?? discount,
          total: data.total ?? total,
          coupon: applied?.code ?? null,
        })
      );
      track({
        type: "purchase",
        source: channel === "whatsapp" ? "whatsapp" : "checkout",
        items: items.map((i) => ({ slug: i.slug, title: i.title, qty: i.quantity })),
      });

      if (channel === "whatsapp") {
        const msg = [
          `¡Hola ${site.name}! Acabo de realizar el pedido *${data.orderNumber}*:`,
          "",
          ...items.map((i) => `• ${i.title}${i.variant ? ` (${i.variant})` : ""} x${i.quantity}`),
          "",
          `Total: ${formatCOP(data.total ?? total)}`,
          `A nombre de: ${form.name} — ${form.address}, ${form.city}`,
          "Quiero coordinar el pago y la entrega.",
        ].join("\n");
        window.open(`https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(msg)}`, "_blank");
      }

      clear();
      router.push("/checkout/confirmacion");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Error al procesar el pedido.");
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-white/10 bg-ink-900 p-10 text-center">
        <p className="text-zinc-400">Tu carrito está vacío.</p>
        <Link href="/catalogo" className="mt-4 inline-block">
          <Button variant="primary">Explorar catálogo</Button>
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit("checkout");
      }}
      className="grid gap-8 lg:grid-cols-5"
    >
      <div className="space-y-6 lg:col-span-3">
        <div className="rounded-xl border border-white/10 bg-ink-900 p-6">
          <h2 className="mb-4 font-display text-xl uppercase">Datos de envío</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nombre completo" value={form.name} onChange={set("name")} error={errors.name} required />
            <Field label="Teléfono / WhatsApp" value={form.phone} onChange={set("phone")} error={errors.phone} required />
            <Field label="Correo (opcional)" type="email" value={form.email} onChange={set("email")} />
            <Field label="Ciudad" value={form.city} onChange={set("city")} error={errors.city} required />
            <div className="sm:col-span-2">
              <Field label="Dirección" value={form.address} onChange={set("address")} error={errors.address} required />
            </div>
            <div className="sm:col-span-2">
              <Field label="Notas (opcional)" value={form.notes} onChange={set("notes")} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-ink-900 p-6">
          <h2 className="mb-4 font-display text-xl uppercase">Pago</h2>
          <div className="rounded-lg border border-dashed border-brand-yellow/40 bg-brand-yellow/5 p-4 text-sm text-zinc-300">
            Pago contra entrega o por WhatsApp. La pasarela de pagos en línea
            (Wompi / Mercado Pago / PSE) se integra en la versión final.
          </div>
        </div>
      </div>

      {/* Resumen + cupón */}
      <div className="h-fit space-y-4 rounded-xl border border-white/10 bg-ink-900 p-6 lg:col-span-2">
        <h2 className="font-display text-xl uppercase">Tu orden</h2>

        <ul className="space-y-2 text-sm">
          {items.map((i) => (
            <li key={i.id} className="flex justify-between gap-2 text-zinc-300">
              <span className="truncate">
                {i.title}
                {i.variant ? ` (${i.variant})` : ""} × {i.quantity}
              </span>
              <span className="shrink-0">{formatCOP(i.price * i.quantity)}</span>
            </li>
          ))}
        </ul>

        <div className="border-t border-white/10 pt-4">
          <label className="mb-1 block text-xs uppercase tracking-wide text-zinc-400">
            Cupón de descuento
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="BIGBIKER10"
                className="w-full rounded-md border border-white/15 bg-ink-800 py-2 pl-9 pr-3 text-sm uppercase text-white placeholder:normal-case placeholder:text-zinc-600 focus:border-brand-yellow focus:outline-none"
              />
            </div>
            <Button type="button" variant="outline" size="md" onClick={applyCoupon}>
              Aplicar
            </Button>
          </div>
          {couponError && <p className="mt-1 text-xs text-brand-red">{couponError}</p>}
          {applied && (
            <p className="mt-1 flex items-center gap-1 text-xs text-green-400">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {applied.code} aplicado (-{applied.percentage}%)
            </p>
          )}
          {coupons.length > 0 && (
            <p className="mt-2 text-[11px] text-zinc-500">
              Prueba: {coupons.map((c) => c.code).join(", ")}
            </p>
          )}
        </div>

        <div className="space-y-1 border-t border-white/10 pt-4 text-sm">
          <div className="flex justify-between text-zinc-400">
            <span>Subtotal</span>
            <span>{formatCOP(sub)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-green-400">
              <span>Descuento</span>
              <span>- {formatCOP(discount)}</span>
            </div>
          )}
          <div className="flex justify-between pt-2 text-lg font-bold text-white">
            <span>Total</span>
            <span>{formatCOP(total)}</span>
          </div>
        </div>

        {submitError && <p className="text-sm text-brand-red">{submitError}</p>}

        <Button type="submit" variant="primary" size="lg" className="w-full" disabled={submitting}>
          {submitting ? "Procesando..." : "Confirmar orden"}
        </Button>
        <Button
          type="button"
          variant="whatsapp"
          size="md"
          className="w-full"
          disabled={submitting}
          onClick={() => submit("whatsapp")}
        >
          Confirmar y coordinar por WhatsApp
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  ...props
}: { label: string; error?: boolean } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs uppercase tracking-wide text-zinc-400">{label}</span>
      <input
        {...props}
        className={`w-full rounded-md border bg-ink-800 px-3 py-2 text-sm text-white focus:outline-none ${
          error ? "border-brand-red focus:border-brand-red" : "border-white/15 focus:border-brand-yellow"
        }`}
      />
      {error && <span className="mt-1 block text-[11px] text-brand-red">Campo obligatorio</span>}
    </label>
  );
}
