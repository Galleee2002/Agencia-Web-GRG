import type { Metadata } from "next";

import { LegalDocumentPage } from "@/components/pages/LegalDocumentPage/LegalDocumentPage";
import { SITE_NAME, SITE_URL } from "@/config/site";
import { es } from "@/i18n/translations/es";

const doc = es.legal.terms;

export const metadata: Metadata = {
  title: doc.metaTitle,
  description: doc.metaDescription,
  alternates: { canonical: "/terminos" },
  openGraph: {
    title: `${doc.metaTitle} | ${SITE_NAME}`,
    description: doc.metaDescription,
    url: `${SITE_URL}/terminos`,
  },
};

export default function TermsPage() {
  return <LegalDocumentPage kind="terms" />;
}
