import { z } from "zod";

const SERVICE_VALUES = [
  "corporate",
  "ecommerce",
  "landing",
  "redesign",
  "maintenance",
  "other",
] as const;

export const CONTACT_NAME_MIN_LENGTH = 2;
export const CONTACT_PROJECT_MIN_LENGTH = 10;

const suspiciousUrlPattern = /https?:\/\//i;

function noSuspiciousUrls(value: string) {
  return !suspiciousUrlPattern.test(value);
}

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(CONTACT_NAME_MIN_LENGTH, "Nombre demasiado corto")
    .max(120)
    .refine(noSuspiciousUrls, "Contenido no permitido"),
  email: z.string().trim().email("Email inválido").max(254),
  company: z.string().trim().max(120).optional(),
  service: z.enum(SERVICE_VALUES),
  project: z
    .string()
    .trim()
    .min(CONTACT_PROJECT_MIN_LENGTH, "Describe tu proyecto con más detalle")
    .max(4000)
    .refine(noSuspiciousUrls, "Contenido no permitido"),
  locale: z.enum(["es", "en"]).default("es"),
});

export type ContactFormPayload = z.infer<typeof contactSchema>;

export const SERVICE_VALUES_LIST = SERVICE_VALUES;
