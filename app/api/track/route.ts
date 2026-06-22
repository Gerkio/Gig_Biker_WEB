import { NextResponse } from "next/server";
import { writeClient } from "@/lib/sanity-write";

// Endpoint de analítica de primera mano. Recibe eventos REALES del sitio
// y los agrega en Sanity (dailyStat + productStat). Sin token de escritura
// configurado, responde ok sin persistir (no rompe la maqueta).

export const runtime = "nodejs";

interface TrackBody {
  type: "pageview" | "product_view" | "add_to_cart" | "purchase";
  slug?: string;
  title?: string;
  source?: "whatsapp" | "checkout";
  items?: { slug: string; title?: string; qty?: number }[];
}

const today = () => new Date().toISOString().slice(0, 10);
const pstatId = (slug: string) => `productStat.${slug}`;

function ensureProductStat(tx: ReturnType<NonNullable<typeof writeClient>["transaction"]>, slug: string, title?: string) {
  tx.createIfNotExists({
    _id: pstatId(slug),
    _type: "productStat",
    slug,
    title: title ?? slug,
    views: 0,
    addToCarts: 0,
    purchases: 0,
    unitsSold: 0,
  });
}

export async function POST(req: Request) {
  let body: TrackBody;
  try {
    body = (await req.json()) as TrackBody;
  } catch {
    return NextResponse.json({ ok: false, error: "bad json" }, { status: 400 });
  }

  // Sin token: no persistimos, pero respondemos ok.
  if (!writeClient) return NextResponse.json({ ok: true, tracked: false });

  const date = today();
  const dailyId = `dailyStat.${date}`;
  const tx = writeClient.transaction();

  tx.createIfNotExists({
    _id: dailyId,
    _type: "dailyStat",
    date,
    pageViews: 0,
    productViews: 0,
    addToCarts: 0,
    whatsappClicks: 0,
    orders: 0,
  });

  try {
    switch (body.type) {
      case "pageview":
        tx.patch(dailyId, (p) => p.inc({ pageViews: 1 }));
        break;

      case "product_view":
        tx.patch(dailyId, (p) => p.inc({ productViews: 1 }));
        if (body.slug) {
          ensureProductStat(tx, body.slug, body.title);
          tx.patch(pstatId(body.slug), (p) =>
            p.set({ title: body.title }).inc({ views: 1 })
          );
        }
        break;

      case "add_to_cart":
        tx.patch(dailyId, (p) => p.inc({ addToCarts: 1 }));
        if (body.slug) {
          ensureProductStat(tx, body.slug, body.title);
          tx.patch(pstatId(body.slug), (p) => p.inc({ addToCarts: 1 }));
        }
        break;

      case "purchase": {
        const items = body.items?.length
          ? body.items
          : body.slug
            ? [{ slug: body.slug, title: body.title, qty: 1 }]
            : [];
        tx.patch(dailyId, (p) =>
          p.inc({
            orders: 1,
            whatsappClicks: body.source === "whatsapp" ? 1 : 0,
          })
        );
        for (const it of items) {
          ensureProductStat(tx, it.slug, it.title);
          tx.patch(pstatId(it.slug), (p) =>
            p.set({ lastSoldAt: date }).inc({
              purchases: 1,
              unitsSold: Math.max(1, it.qty ?? 1),
            })
          );
        }
        break;
      }

      default:
        return NextResponse.json({ ok: false, error: "unknown type" }, { status: 400 });
    }

    await tx.commit({ visibility: "async" });
    return NextResponse.json({ ok: true, tracked: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
