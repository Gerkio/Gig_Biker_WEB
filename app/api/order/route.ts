import { NextResponse } from "next/server";
import { writeClient } from "@/lib/sanity-write";
import { findCoupon, getProduct } from "@/lib/data";

export const runtime = "nodejs";

interface OrderItemInput {
  slug: string;
  quantity: number;
}
interface OrderBody {
  items: OrderItemInput[];
  customer: {
    name?: string;
    phone?: string;
    email?: string;
    address?: string;
    city?: string;
    notes?: string;
  };
  couponCode?: string;
  channel?: "checkout" | "whatsapp";
}

const today = () => new Date().toISOString().slice(0, 10);

function genOrderNumber() {
  const ymd = today().replace(/-/g, "");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `BB-${ymd}-${rand}`;
}

export async function POST(req: Request) {
  let body: OrderBody;
  try {
    body = (await req.json()) as OrderBody;
  } catch {
    return NextResponse.json({ ok: false, error: "bad json" }, { status: 400 });
  }

  const { items, customer = {}, couponCode } = body;

  // Validación de datos del cliente.
  if (!items?.length)
    return NextResponse.json({ ok: false, error: "carrito vacío" }, { status: 400 });
  for (const f of ["name", "phone", "address", "city"] as const) {
    if (!customer[f]?.trim())
      return NextResponse.json({ ok: false, error: `falta ${f}` }, { status: 400 });
  }

  // Precios REALES desde el CMS (no se confía en el cliente).
  const lineItems: { title: string; slug: string; quantity: number; price: number }[] = [];
  for (const it of items) {
    const product = await getProduct(it.slug);
    if (!product) continue;
    const qty = Math.max(1, Math.floor(it.quantity || 1));
    lineItems.push({ title: product.title, slug: product.slug, quantity: qty, price: product.price });
  }
  if (!lineItems.length)
    return NextResponse.json({ ok: false, error: "sin productos válidos" }, { status: 400 });

  const subtotal = lineItems.reduce((a, i) => a + i.price * i.quantity, 0);

  // Validación de cupón server-side.
  let discount = 0;
  let appliedCode: string | undefined;
  if (couponCode) {
    const coupon = await findCoupon(couponCode);
    if (coupon) {
      discount = Math.round((subtotal * coupon.percentage) / 100);
      appliedCode = coupon.code;
    }
  }
  const total = subtotal - discount;
  const orderNumber = genOrderNumber();
  const createdAt = new Date().toISOString();

  // Sin token de escritura: el pedido no se persiste (demo), pero responde ok.
  if (!writeClient) {
    return NextResponse.json({
      ok: true,
      persisted: false,
      orderNumber,
      subtotal,
      discount,
      total,
    });
  }

  try {
    const tx = writeClient.transaction();

    tx.create({
      _type: "order",
      orderNumber,
      status: "pendiente",
      channel: body.channel || "checkout",
      createdAt,
      customer: {
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        address: customer.address,
        city: customer.city,
        notes: customer.notes,
      },
      items: lineItems.map((i) => ({ _key: i.slug, ...i })),
      couponCode: appliedCode,
      subtotal,
      discount,
      total,
    });

    const date = today();
    // Descuento de stock + registro de venta (alimenta el dashboard).
    for (const it of lineItems) {
      const product = await getProduct(it.slug);
      if (product) {
        const newStock = Math.max(0, (product.stock ?? 0) - it.quantity);
        tx.patch(product._id, (p) => p.set({ stock: newStock }));
      }
      const pid = `productStat.${it.slug}`;
      tx.createIfNotExists({
        _id: pid,
        _type: "productStat",
        slug: it.slug,
        title: it.title,
        views: 0,
        addToCarts: 0,
        purchases: 0,
        unitsSold: 0,
      });
      tx.patch(pid, (p) =>
        p.set({ lastSoldAt: date }).inc({ purchases: 1, unitsSold: it.quantity })
      );
    }

    const did = `dailyStat.${date}`;
    tx.createIfNotExists({
      _id: did,
      _type: "dailyStat",
      date,
      pageViews: 0,
      productViews: 0,
      addToCarts: 0,
      whatsappClicks: 0,
      orders: 0,
    });
    tx.patch(did, (p) => p.inc({ orders: 1 }));

    await tx.commit({ visibility: "async" });

    return NextResponse.json({
      ok: true,
      persisted: true,
      orderNumber,
      subtotal,
      discount,
      total,
    });
  } catch (e) {
    // Si falla la persistencia, igual confirmamos al cliente (no perdemos la venta).
    return NextResponse.json({
      ok: true,
      persisted: false,
      orderNumber,
      subtotal,
      discount,
      total,
      error: String(e),
    });
  }
}
