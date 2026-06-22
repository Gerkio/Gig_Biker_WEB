"use client";

import { useEffect, useMemo, useState } from "react";
import { useClient } from "sanity";
import {
  Badge,
  Box,
  Card,
  Container,
  Flex,
  Grid,
  Heading,
  Spinner,
  Stack,
  Text,
} from "@sanity/ui";
import {
  computeDashboard,
  totalStock,
  type DashboardData,
} from "../lib/dashboard-compute";
import type { DailyStat, Product, ProductStat } from "../lib/types";

const YELLOW = "#FDB92E";
const RED = "#C52F33";
const GREEN = "#22c55e";

const money = (n: number) =>
  n >= 1_000_000
    ? `$${(n / 1_000_000).toFixed(1).replace(".", ",")} M`
    : n >= 1_000
      ? `$${Math.round(n / 1_000)} K`
      : `$${n.toLocaleString("es-CO")}`;

const PRODUCTS_QUERY = `*[_type == "product"]{
  "_id": _id, title, "slug": slug.current, price,
  "category": category->slug.current,
  "image": image.asset->url,
  stock, lowStockThreshold, variants
}`;

export function DashboardTool() {
  const client = useClient({ apiVersion: "2024-01-01" });
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    Promise.all([
      client.fetch<Product[]>(PRODUCTS_QUERY),
      client.fetch<{ title: string; slug: string }[]>(
        `*[_type == "category"]{ title, "slug": slug.current }`
      ),
      client.fetch<unknown[]>(`*[_type == "coupon" && active == true]{ _id }`),
      client.fetch<ProductStat[]>(
        `*[_type == "productStat"]{ slug, title, views, addToCarts, purchases, unitsSold, lastSoldAt }`
      ),
      client.fetch<DailyStat[]>(
        `*[_type == "dailyStat"] | order(date desc)[0...30]{ date, pageViews, productViews, addToCarts, whatsappClicks, orders }`
      ),
    ])
      .then(([products, categories, coupons, productStats, dailyStats]) => {
        if (active)
          setData(
            computeDashboard(products, categories, coupons, productStats, dailyStats)
          );
      })
      .catch((e) => active && setError(String(e)));
    return () => {
      active = false;
    };
  }, [client]);

  if (error)
    return (
      <Container width={4} padding={4}>
        <Card padding={4} tone="critical" radius={3}>
          <Text>Error cargando el dashboard: {error}</Text>
        </Card>
      </Container>
    );

  if (!data)
    return (
      <Flex align="center" justify="center" padding={6} style={{ minHeight: 240 }}>
        <Spinner muted />
      </Flex>
    );

  const totalVisits = data.traffic.reduce((a, t) => a + t.visits, 0);
  const totalOrders = data.traffic.reduce((a, t) => a + t.orders, 0);
  const convRate = ((totalOrders / totalVisits) * 100).toFixed(1);

  return (
    <Container width={5} padding={4}>
      <Stack space={5}>
        <Stack space={2}>
          <Heading size={3}>Dashboard</Heading>
          <Text muted size={1}>
            Resumen del sitio, inventario y ventas — datos en vivo del CMS.
          </Text>
        </Stack>

        {!data.hasTraffic && !data.hasSales && (
          <Card padding={3} radius={3} tone="primary" border>
            <Text size={1}>
              📈 El tráfico y las ventas se registran automáticamente con la
              actividad real del sitio. Cuando la web esté publicada y reciba
              visitas, estas métricas se llenarán solas. El inventario ya es real
              (lo gestionas en Productos).
            </Text>
          </Card>
        )}

        {/* KPIs */}
        <Grid columns={[2, 2, 4]} gap={3}>
          <Kpi label="Productos" value={String(data.totals.products)} hint={`${data.totals.categories} categorías`} color={YELLOW} />
          <Kpi label="Valor inventario" value={money(data.totals.inventoryValue)} hint={`${data.totals.inventoryUnits} unidades`} color={GREEN} />
          <Kpi label="Unidades vendidas" value={String(data.totals.unitsSold)} hint="Acumulado" />
          <Kpi label="Ingresos estimados" value={money(data.totals.estimatedRevenue)} hint="Ventas registradas" color={GREEN} />
        </Grid>

        {/* Alertas */}
        <Grid columns={[1, 1, 3]} gap={3}>
          <AlertCard title="Agotados" color={RED} items={data.outOfStock} count={data.outOfStock.length} right={() => "0 u."} empty="Sin agotados 🎉" />
          <AlertCard title="Stock bajo" color={YELLOW} items={data.lowStock} count={data.lowStock.length} right={(p) => `${totalStock(p)} u.`} empty="Stock saludable" />
          <AlertCard title="Sin ventas registradas" color="#8a8585" items={data.neverSold} count={data.neverSold.length} right={() => "—"} empty="Todo rotando" />
        </Grid>

        {/* Tráfico */}
        <Card padding={4} radius={3} shadow={1}>
          <Flex align="flex-end" justify="space-between" wrap="wrap" gap={3} style={{ marginBottom: 16 }}>
            <Stack space={2}>
              <Heading size={1}>Tráfico del sitio</Heading>
              <Text muted size={0}>
                Últimos 14 días · datos reales del sitio
                {!data.hasTraffic ? " (aún sin visitas registradas)" : ""}
              </Text>
            </Stack>
            <Flex gap={4}>
              <Metric label="Visitas" value={totalVisits.toLocaleString("es-CO")} />
              <Metric label="Pedidos" value={String(totalOrders)} />
              <Metric label="Conversión" value={`${convRate}%`} color={YELLOW} />
            </Flex>
          </Flex>
          <TrafficBars data={data.traffic} />
        </Card>

        {/* Rankings */}
        <Grid columns={[1, 1, 2]} gap={3}>
          <RankCard title="Más vendidos" color={GREEN} rows={data.bestSellers} />
          <RankCard title="Menos vendidos" color={RED} rows={data.worstSellers} />
        </Grid>

        {/* Por categoría */}
        <Card padding={4} radius={3} shadow={1}>
          <Heading size={1} style={{ marginBottom: 16 }}>Ingresos por categoría</Heading>
          <Stack space={4}>
            {data.byCategory.map((c) => {
              const max = Math.max(...data.byCategory.map((x) => x.revenue), 1);
              return (
                <Stack space={2} key={c.category}>
                  <Flex justify="space-between">
                    <Text size={1}>
                      {c.category}{" "}
                      <span style={{ opacity: 0.5 }}>· {c.products} productos · {c.units} u.</span>
                    </Text>
                    <Text size={1} weight="bold">{money(c.revenue)}</Text>
                  </Flex>
                  <Box style={{ height: 8, background: "rgba(255,255,255,0.06)", borderRadius: 999 }}>
                    <div style={{ height: "100%", width: `${(c.revenue / max) * 100}%`, background: `linear-gradient(90deg, ${RED}, ${YELLOW})`, borderRadius: 999 }} />
                  </Box>
                </Stack>
              );
            })}
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
}

function Kpi({ label, value, hint, color }: { label: string; value: string; hint?: string; color?: string }) {
  return (
    <Card padding={4} radius={3} shadow={1}>
      <Stack space={3}>
        <Text size={0} muted style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</Text>
        <Heading size={4} style={color ? { color } : undefined}>{value}</Heading>
        {hint && <Text size={0} muted>{hint}</Text>}
      </Stack>
    </Card>
  );
}

function Metric({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <Stack space={2} style={{ textAlign: "right" }}>
      <Text size={3} weight="bold" style={color ? { color } : undefined}>{value}</Text>
      <Text size={0} muted style={{ textTransform: "uppercase" }}>{label}</Text>
    </Stack>
  );
}

function AlertCard({
  title, color, items, count, right, empty,
}: {
  title: string; color: string; items: Product[]; count: number;
  right: (p: Product) => string; empty: string;
}) {
  return (
    <Card padding={4} radius={3} shadow={1} style={{ borderTop: `2px solid ${color}` }}>
      <Flex justify="space-between" align="center" style={{ marginBottom: 12 }}>
        <Text weight="bold" size={1}>{title}</Text>
        <Badge tone={count > 0 ? "caution" : "positive"} mode="outline">{count}</Badge>
      </Flex>
      {items.length === 0 ? (
        <Text size={1} muted align="center" style={{ padding: "12px 0" }}>{empty}</Text>
      ) : (
        <Stack space={3}>
          {items.slice(0, 4).map((p) => (
            <Flex key={p._id} align="center" gap={2}>
              <Thumb src={p.image} />
              <Box flex={1} style={{ minWidth: 0 }}>
                <Text size={1} textOverflow="ellipsis">{p.title}</Text>
              </Box>
              <Text size={1} weight="medium" style={{ color }}>{right(p)}</Text>
            </Flex>
          ))}
          {count > 4 && <Text size={0} muted>+{count - 4} más…</Text>}
        </Stack>
      )}
    </Card>
  );
}

function RankCard({
  title, color, rows,
}: {
  title: string; color: string;
  rows: { product: Product; units: number; revenue: number }[];
}) {
  return (
    <Card padding={4} radius={3} shadow={1}>
      <Heading size={1} style={{ marginBottom: 16, color }}>{title}</Heading>
      <Stack space={3}>
        {rows.map(({ product: p, units, revenue }, i) => (
          <Flex key={p._id} align="center" gap={3}>
            <Text size={1} muted style={{ width: 16, textAlign: "center" }}>{i + 1}</Text>
            <Thumb src={p.image} />
            <Box flex={1} style={{ minWidth: 0 }}>
              <Text size={1} textOverflow="ellipsis">{p.title}</Text>
            </Box>
            <Stack space={1} style={{ textAlign: "right" }}>
              <Text size={1} weight="bold">{units} u.</Text>
              <Text size={0} muted>{money(revenue)}</Text>
            </Stack>
          </Flex>
        ))}
      </Stack>
    </Card>
  );
}

function TrafficBars({ data }: { data: { label: string; visits: number; orders: number }[] }) {
  const max = useMemo(() => Math.max(...data.map((d) => d.visits), 1), [data]);
  return (
    <Flex align="flex-end" gap={2} style={{ height: 180 }}>
      {data.map((d, i) => (
        <Flex key={i} direction="column" align="center" justify="flex-end" flex={1} style={{ height: "100%" }}>
          <div
            title={`${d.visits} visitas`}
            style={{
              width: "100%",
              height: `${Math.max(4, (d.visits / max) * 100)}%`,
              background: `linear-gradient(180deg, ${YELLOW}, rgba(253,185,46,0.35))`,
              borderRadius: "3px 3px 0 0",
            }}
          />
          <Text size={0} muted style={{ marginTop: 6 }}>{d.label}</Text>
        </Flex>
      ))}
    </Flex>
  );
}

function Thumb({ src }: { src?: string }) {
  return (
    <div style={{ width: 30, height: 30, flexShrink: 0, borderRadius: 4, overflow: "hidden", background: "#171515" }}>
      {src ? <img src={src} alt="" width={30} height={30} style={{ objectFit: "cover", width: 30, height: 30 }} /> : null}
    </div>
  );
}
