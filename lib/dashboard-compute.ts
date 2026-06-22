import type { DailyStat, Product, ProductStat } from "./types";

// ─────────────────────────────────────────────────────────────
// Cálculo del dashboard a partir de datos REALES:
//  - Inventario: campos del producto en el CMS (stock).
//  - Ventas/tráfico: eventos registrados por /api/track
//    (productStat + dailyStat). Sin tráfico aún → todo en 0.
// ─────────────────────────────────────────────────────────────

const STALE_DAYS = 30;

export function totalStock(p: Product): number {
  return p.stock ?? 0;
}

function daysSince(iso?: string): number {
  if (!iso) return Infinity;
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return Infinity;
  return Math.floor((Date.now() - then) / 86400000);
}

function last14Days() {
  const out: { date: string; label: string }[] = [];
  const letters = ["D", "L", "M", "X", "J", "V", "S"];
  const now = Date.now();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now - i * 86400000);
    out.push({ date: d.toISOString().slice(0, 10), label: letters[d.getUTCDay()] });
  }
  return out;
}

export interface DashboardData {
  totals: {
    products: number;
    categories: number;
    activeCoupons: number;
    inventoryUnits: number;
    inventoryValue: number;
    unitsSold: number;
    estimatedRevenue: number;
  };
  outOfStock: Product[];
  lowStock: Product[];
  neverSold: Product[];
  bestSellers: { product: Product; units: number; revenue: number }[];
  worstSellers: { product: Product; units: number; revenue: number }[];
  byCategory: { category: string; products: number; units: number; revenue: number }[];
  traffic: { label: string; visits: number; orders: number }[];
  hasTraffic: boolean;
  hasSales: boolean;
}

export function computeDashboard(
  products: Product[],
  categories: { title: string; slug: string }[],
  coupons: unknown[],
  productStats: ProductStat[] = [],
  dailyStats: DailyStat[] = []
): DashboardData {
  const statBySlug = new Map(productStats.map((s) => [s.slug, s]));
  const unitsOf = (p: Product) => statBySlug.get(p.slug)?.unitsSold ?? 0;
  const lastSoldOf = (p: Product) => statBySlug.get(p.slug)?.lastSoldAt;

  const withStock = products.map((p) => ({ p, stock: totalStock(p) }));

  const inventoryUnits = withStock.reduce((a, x) => a + x.stock, 0);
  const inventoryValue = withStock.reduce((a, x) => a + x.stock * x.p.price, 0);
  const unitsSold = products.reduce((a, p) => a + unitsOf(p), 0);
  const estimatedRevenue = products.reduce((a, p) => a + unitsOf(p) * p.price, 0);

  const outOfStock = withStock.filter((x) => x.stock === 0).map((x) => x.p);
  const lowStock = withStock
    .filter((x) => x.stock > 0 && x.stock <= (x.p.lowStockThreshold ?? 5))
    .sort((a, b) => a.stock - b.stock)
    .map((x) => x.p);

  // "Sin ventas": nunca vendido o última venta hace 30+ días.
  const neverSold = products
    .filter((p) => daysSince(lastSoldOf(p)) >= STALE_DAYS)
    .sort((a, b) => daysSince(lastSoldOf(b)) - daysSince(lastSoldOf(a)));

  const ranked = products
    .map((p) => ({ product: p, units: unitsOf(p), revenue: unitsOf(p) * p.price }))
    .sort((a, b) => b.units - a.units);
  const bestSellers = ranked.slice(0, 6);
  const worstSellers = [...ranked].reverse().slice(0, 6);

  const catMap = new Map<string, { products: number; units: number; revenue: number }>();
  for (const { p, stock } of withStock) {
    const c = catMap.get(p.category) || { products: 0, units: 0, revenue: 0 };
    c.products += 1;
    c.units += stock;
    c.revenue += unitsOf(p) * p.price;
    catMap.set(p.category, c);
  }
  const byCategory = categories.map((c) => ({
    category: c.title,
    ...(catMap.get(c.slug) || { products: 0, units: 0, revenue: 0 }),
  }));

  const dailyByDate = new Map(dailyStats.map((d) => [d.date, d]));
  const traffic = last14Days().map(({ date, label }) => {
    const d = dailyByDate.get(date);
    return { label, visits: d?.pageViews ?? 0, orders: d?.orders ?? 0 };
  });

  return {
    totals: {
      products: products.length,
      categories: categories.length,
      activeCoupons: coupons.length,
      inventoryUnits,
      inventoryValue,
      unitsSold,
      estimatedRevenue,
    },
    outOfStock,
    lowStock,
    neverSold,
    bestSellers,
    worstSellers,
    byCategory,
    traffic,
    hasTraffic: traffic.some((t) => t.visits > 0),
    hasSales: unitsSold > 0,
  };
}
