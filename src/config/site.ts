/** Configuración global del sitio (SEO, JSON-LD, sitemap). */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://grgsolutions.com";

export const SITE_NAME = "GRG Solutions";

export const SITE_DEFAULT_LOCALE = "es_AR";

export const SITE_DEFAULT_DESCRIPTION =
  "Agencia de desarrollo web en Argentina: diseño, productos digitales a medida y experiencias que convierten visitas en clientes.";

export const SITE_OG_IMAGE_PATH = "/GRG-banner.webp";

export const SITE_CONTACT = {
  email: "hola@agenciawebgmg.com",
  phone: "+54 11 5555-0100",
  streetAddress: "Av. Corrientes 1234",
  addressLocality: "Ciudad Autónoma de Buenos Aires",
  addressRegion: "Buenos Aires",
  addressCountry: "AR",
} as const;

export const LEGAL_PATHS = {
  privacy: "/privacidad",
  terms: "/terminos",
  cookies: "/cookies",
} as const;
