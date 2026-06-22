import { product } from "./product";
import { category } from "./category";
import { coupon } from "./coupon";
import { promo } from "./promo";
import { testimonial } from "./testimonial";
import { siteSettings } from "./siteSettings";
import { homePage } from "./homePage";
import { dailyStat } from "./dailyStat";
import { productStat } from "./productStat";
import { order } from "./order";

export const schemaTypes = [
  // Catálogo
  product,
  category,
  // Pedidos
  order,
  // Marketing
  coupon,
  promo,
  testimonial,
  // Configuración (singletons)
  siteSettings,
  homePage,
  // Analítica (gestionado por el sistema)
  dailyStat,
  productStat,
];
