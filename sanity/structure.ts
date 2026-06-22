import type { StructureResolver } from "sanity/structure";
import {
  CogIcon,
  HomeIcon,
  PackageIcon,
  ThLargeIcon,
  TagIcon,
  RocketIcon,
  StarIcon,
  DocumentTextIcon,
  ClockIcon,
} from "@sanity/icons";

// Tipos "singleton" (un solo documento, no se crean/borran).
const SINGLETONS = ["siteSettings", "homePage"];
// Tipos internos de analítica: no se muestran en el menú (los expone el Dashboard).
const HIDDEN = ["dailyStat", "productStat"];
const HANDLED = [
  "product",
  "category",
  "order",
  "coupon",
  "promo",
  "testimonial",
  ...SINGLETONS,
  ...HIDDEN,
];

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Big Biker")
    .items([
      // ── Catálogo (uso diario) ──
      S.listItem()
        .title("Productos")
        .icon(PackageIcon)
        .child(S.documentTypeList("product").title("Productos")),
      S.listItem()
        .title("Categorías")
        .icon(ThLargeIcon)
        .child(S.documentTypeList("category").title("Categorías")),

      S.divider(),

      // ── Pedidos ──
      S.listItem()
        .title("Pedidos")
        .icon(DocumentTextIcon)
        .child(
          S.list()
            .title("Pedidos")
            .items([
              S.listItem()
                .title("Pendientes de pago")
                .icon(ClockIcon)
                .child(
                  S.documentList()
                    .title("Pendientes de pago")
                    .filter('_type == "order" && status == "pendiente"')
                    .defaultOrdering([{ field: "createdAt", direction: "desc" }])
                ),
              S.listItem()
                .title("Todos los pedidos")
                .icon(DocumentTextIcon)
                .child(
                  S.documentList()
                    .title("Todos los pedidos")
                    .filter('_type == "order"')
                    .defaultOrdering([{ field: "createdAt", direction: "desc" }])
                ),
            ])
        ),

      S.divider(),

      // ── Marketing ──
      S.listItem()
        .title("Cupones")
        .icon(TagIcon)
        .child(S.documentTypeList("coupon").title("Cupones")),
      S.listItem()
        .title("Promociones")
        .icon(RocketIcon)
        .child(S.documentTypeList("promo").title("Promociones")),
      S.listItem()
        .title("Testimonios")
        .icon(StarIcon)
        .child(S.documentTypeList("testimonial").title("Testimonios")),

      S.divider(),

      // ── Contenido y ajustes (menos frecuente) ──
      S.listItem()
        .title("Página de inicio")
        .id("homePage")
        .icon(HomeIcon)
        .child(S.document().schemaType("homePage").documentId("homePage")),
      S.listItem()
        .title("Ajustes del sitio")
        .id("siteSettings")
        .icon(CogIcon)
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),

      // Cualquier otro tipo futuro no contemplado arriba.
      ...S.documentTypeListItems().filter(
        (item) => !HANDLED.includes(item.getId() ?? "")
      ),
    ]);
