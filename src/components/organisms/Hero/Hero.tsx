"use client";

import Link from "next/link";

import { useI18n } from "@/components/providers/I18nProvider";

import { HeroBeamsBackground } from "./HeroBeamsBackground";
import styles from "./Hero.module.scss";

export function Hero() {
  const { t } = useI18n();

  return (
    <section id="inicio" className={styles.hero} aria-label={t("hero.ariaLabel")}>
      <HeroBeamsBackground />
      <div className={styles.inner}>
        <h1 className={styles.title}>
          <span className={styles.titleWord}>{t("hero.titleDevelop")}</span>
          <span className={`${styles.titleWord} ${styles.titleWordAccent}`}>
            {t("hero.titleExperiences")}
          </span>
          <span className={styles.titleWord}>{t("hero.titleDigital")}</span>
        </h1>
        <p className={styles.description}>{t("hero.description")}</p>
        <Link className={styles.cta} href="#trabajar-con-nosotros">
          {t("hero.cta")}{" "}
        </Link>
      </div>
    </section>
  );
}
