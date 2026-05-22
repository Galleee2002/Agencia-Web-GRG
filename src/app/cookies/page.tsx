import type { Metadata } from "next";

import { LegalDocumentPage } from "@/components/pages/LegalDocumentPage/LegalDocumentPage";
import { SITE_NAME, SITE_URL } from "@/config/site";
import { es } from "@/i18n/translations/es";

const doc = es.legal.cookies;

export const metadata: Metadata = {
  title: doc.metaTitle,
  description: doc.metaDescription,
  alternates: { canonical: "/cookies" },
  openGraph: {
    title: `${doc.metaTitle} | ${SITE_NAME}`,
    description: doc.metaDescription,
    url: `${SITE_URL}/cookies`,
  },
};

export default function CookiesPage() {
  return <LegalDocumentPage kind="cookies" />;
}
