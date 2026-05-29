import { createTranslate } from "@/i18n/content";
import { en } from "@/i18n/translations/en";
import { es } from "@/i18n/translations/es";
import type { Locale } from "@/i18n/types";

import type { ContactFormPayload } from "./contactSchema";
import type { TranslationKey } from "@/i18n/types";

const messagesByLocale = { es, en } as const;

const SERVICE_KEYS = {
  corporate: "contact.services.corporate",
  ecommerce: "contact.services.ecommerce",
  landing: "contact.services.landing",
  redesign: "contact.services.redesign",
  maintenance: "contact.services.maintenance",
  other: "contact.services.other",
} as const satisfies Record<ContactFormPayload["service"], TranslationKey>;

export function getServiceLabel(
  service: ContactFormPayload["service"],
  locale: Locale,
): string {
  const t = createTranslate(messagesByLocale[locale]);
  return t(SERVICE_KEYS[service]);
}
