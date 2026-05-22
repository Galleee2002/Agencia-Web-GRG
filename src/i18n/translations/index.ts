import type { Locale, Messages } from "../types";
import { es } from "./es";

/** @deprecated Usar carga dinámica en I18nProvider; se mantiene `es` para SSR/fallback. */
export const messagesByLocale: Record<Locale, Messages> = {
  es,
  en: es,
};

export { es };
