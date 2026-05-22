"use client";

import Link from "next/link";

import { useI18n } from "@/components/providers/I18nProvider";
import type { TranslationKey } from "@/i18n/types";

import styles from "./LegalDocumentPage.module.scss";

export type LegalDocumentKind = "privacy" | "terms" | "cookies";

type LegalDocumentPageProps = {
  kind: LegalDocumentKind;
};

function legalKey(
  kind: LegalDocumentKind,
  suffix: string,
): TranslationKey {
  return `legal.${kind}.${suffix}` as TranslationKey;
}

export function LegalDocumentPage({ kind }: LegalDocumentPageProps) {
  const { t } = useI18n();

  const sections = [1, 2, 3, 4, 5] as const;

  return (
    <div className={styles.page}>
      <article className={styles.inner}>
        <nav className={styles.nav} aria-label={t("legal.backHome")}>
          <Link href="/" className={styles.backLink}>
            ← {t("legal.backHome")}
          </Link>
        </nav>

        <h1 className={styles.title}>{t(legalKey(kind, "title"))}</h1>
        <p className={styles.updated}>{t(legalKey(kind, "updated"))}</p>
        <p className={styles.intro}>{t(legalKey(kind, "intro"))}</p>

        {sections.map((index) => (
          <section key={index} className={styles.section}>
            <h2 className={styles.sectionTitle}>
              {t(legalKey(kind, `s${index}Title`))}
            </h2>
            <p className={styles.sectionBody}>
              {t(legalKey(kind, `s${index}Body`))}
            </p>
          </section>
        ))}
      </article>
    </div>
  );
}
