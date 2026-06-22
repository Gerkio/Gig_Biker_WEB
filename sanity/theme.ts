import { buildLegacyTheme } from "sanity";

// Tema del Studio con la identidad visual de Big Biker:
// fondo oscuro, acentos amarillos (#FDB92E) y rojo de marca (#C52F33).
const props = {
  // Base
  "--my-white": "#FFFFFF",
  "--my-black": "#1A1818",
  "--black": "#141212",
  "--white": "#FFFFFF",

  // Acento de marca
  "--brand-primary": "#FDB92E",
  "--focus-color": "#FDB92E",

  // Botones: amarillo = acción primaria (estilo Shopify, pero con marca)
  "--default-button-color": "#3A3737",
  "--default-button-primary-color": "#FDB92E",
  "--default-button-success-color": "#22c55e",
  "--default-button-warning-color": "#FDB92E",
  "--default-button-danger-color": "#C52F33",

  // Estados (semáforo de stock / validaciones)
  "--state-info-color": "#FDB92E",
  "--state-success-color": "#22c55e",
  "--state-warning-color": "#FDB92E",
  "--state-danger-color": "#C52F33",

  // Navegación superior
  "--main-navigation-color": "#1A1818",
  "--main-navigation-color--inverted": "#FDB92E",

  // Grises y superficies (mejor jerarquía de tarjetas/paneles)
  "--gray-base": "#7E7A7A",
  "--component-bg": "#211F1F",
  "--component-text-color": "#F4F2F2",
};

export const bigBikerTheme = buildLegacyTheme(props);
