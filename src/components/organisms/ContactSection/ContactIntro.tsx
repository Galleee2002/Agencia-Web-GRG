"use client";

import { useI18n } from "@/components/providers/I18nProvider";

import styles from "./ContactSection.module.scss";

export function ContactIntro() {
  const { t } = useI18n();

  return (
    <div className={styles.intro}>
      <h2 id="contact-heading" className={styles.heading}>
        {t("contact.heading")}
        <span className={styles.headingAccent}>{t("contact.headingAccent")}</span>
        {t("contact.headingEnd")}
      </h2>
      <p className={styles.sublead}>{t("contact.sublead")}</p>
    </div>
  );
}
