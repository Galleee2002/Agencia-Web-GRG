import { buildOrganizationJsonLd } from "@/lib/seo/organizationJsonLd";

export function OrganizationJsonLd() {
  const data = buildOrganizationJsonLd();

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
