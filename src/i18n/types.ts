import type { es } from "./translations/es";

export type Locale = "es" | "en";

export const LOCALES = ["es", "en"] as const satisfies readonly Locale[];

export const DEFAULT_LOCALE: Locale = "es";

export const LOCALE_STORAGE_KEY = "agencia-web-gmg-locale";

type DeepStringMap<T> = {
  [K in keyof T]: T[K] extends object ? DeepStringMap<T[K]> : string;
};

/** Shape compartido entre `es` y `en`; los valores son siempre `string` en hojas. */
export type Messages = DeepStringMap<typeof es>;

type Join<K extends string, P extends string> = P extends "" ? K : `${K}.${P}`;

type Paths<T> = T extends string
  ? ""
  : {
      [K in keyof T & string]: T[K] extends string
        ? K
        : T[K] extends readonly string[]
          ? K
          : Join<K, Paths<T[K]>>;
    }[keyof T & string];

export type TranslationKey = Paths<Messages>;

export type InterpolationParams = Record<string, string | number>;
