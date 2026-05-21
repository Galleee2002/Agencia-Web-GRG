import type { Locale, Messages } from "../types";
import { en } from "./en";
import { es } from "./es";

export const messagesByLocale: Record<Locale, Messages> = {
  es,
  en,
};


export { es, en };
