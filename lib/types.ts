// Tipos de dominio compartidos entre el data layer (Sanity / semilla) y la UI.

export type CategorySlug =
  | "jerseys"
  | "chaquetas"
  | "tubulares"
  | "accesorios";

export interface Category {
  _id: string;
  title: string;
  slug: CategorySlug;
  description?: string;
  image?: string;
}

/** Ajustes globales del sitio (singleton en el CMS). */
export interface SiteSettings {
  announcements?: string[];
  freeShippingThreshold?: number;
  whatsapp?: string;
  email?: string;
  address?: string;
  city?: string;
  hours?: string;
}

/** Contenido de la página de inicio (singleton en el CMS). */
export interface HomePageContent {
  heroBadge?: string;
  heroTitle?: string;
  heroHighlight?: string;
  heroSubtitle?: string;
  heroImage?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  marquee?: string[];
  stats?: { value: string; label: string }[];
}

export interface Testimonial {
  _id: string;
  name: string;
  city?: string;
  rating?: number;
  text: string;
}

export interface ProductVariant {
  /** Etiqueta visible: talla ("M", "42") o color ("Negro"). */
  label: string;
  /** Tipo de variante para agrupar selectores en el PDP. */
  kind: "talla" | "color";
}

export interface Product {
  _id: string;
  title: string;
  slug: string;
  brand?: string;
  category: CategorySlug;
  /** Precio en COP (entero, sin decimales). */
  price: number;
  /** Precio antes de descuento; si existe, se muestra tachado. */
  compareAtPrice?: number;
  description: string;
  /** URL absoluta de imagen principal. */
  image: string;
  /** Imagen secundaria para el swap en hover (opcional). */
  hoverImage?: string;
  gallery?: string[];
  variants?: ProductVariant[];
  featured?: boolean;
  rating?: number;
  tags?: string[];
  // ── Inventario (gestionado en el CMS) ──
  /** Existencias disponibles (unidades). */
  stock?: number;
  /** Umbral para alertar "stock bajo". Por defecto 5. */
  lowStockThreshold?: number;
  // ── SEO (opcional, override por producto desde el CMS) ──
  seoTitle?: string;
  seoDescription?: string;
}

/** Métricas reales por producto (escritas por /api/track). */
export interface ProductStat {
  slug: string;
  title?: string;
  views?: number;
  addToCarts?: number;
  purchases?: number;
  unitsSold?: number;
  lastSoldAt?: string;
}

/** Agregado diario de tráfico (escrito por /api/track). */
export interface DailyStat {
  date: string;
  pageViews?: number;
  productViews?: number;
  addToCarts?: number;
  whatsappClicks?: number;
  orders?: number;
}

export interface Coupon {
  _id: string;
  code: string;
  /** Porcentaje de descuento (0-100). */
  percentage: number;
  active: boolean;
  label?: string;
}

export interface Promo {
  _id: string;
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  image?: string;
  active: boolean;
}
