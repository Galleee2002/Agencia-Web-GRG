import {
  SITE_CONTACT,
  SITE_NAME,
  SITE_OG_IMAGE_PATH,
  SITE_URL,
} from "@/config/site";

export function buildOrganizationJsonLd() {
  const imageUrl = new URL(SITE_OG_IMAGE_PATH, SITE_URL).toString();

  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: SITE_NAME,
    url: SITE_URL,
    image: imageUrl,
    email: SITE_CONTACT.email,
    telephone: [SITE_CONTACT.phone, SITE_CONTACT.phone2],
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE_CONTACT.streetAddress,
      addressLocality: SITE_CONTACT.addressLocality,
      addressRegion: SITE_CONTACT.addressRegion,
      addressCountry: SITE_CONTACT.addressCountry,
    },
    areaServed: {
      "@type": "Country",
      name: "Argentina",
    },
    knowsAbout: [
      "Desarrollo web",
      "Diseño web",
      "E-commerce",
      "Landing pages",
      "Aplicaciones web",
    ],
  };
}
