"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useCallback, type PointerEvent as ReactPointerEvent } from "react";

import { useI18n } from "@/components/providers/I18nProvider";
import { publicAssetUrl } from "@/lib/publicAssetUrl";

import { HeroBeamsBackground } from "./HeroBeamsBackground";
import styles from "./Hero.module.scss";

const HERO_BANNER_SRC = publicAssetUrl("/GRG-banner.webp");

/**
 * Setea las CSS vars --cta-mx/--cta-my con la posición del puntero relativa al
 * botón. El `::before` usa estas vars como origen del círculo de relleno que
 * crece (enter) o se contrae (leave) hacia el punto exacto donde está el cursor.
 */
function syncCtaPointerPosition(event: ReactPointerEvent<HTMLAnchorElement>) {
  const el = event.currentTarget;
  const rect = el.getBoundingClientRect();
  el.style.setProperty("--cta-mx", `${event.clientX - rect.left}px`);
  el.style.setProperty("--cta-my", `${event.clientY - rect.top}px`);
}

export function Hero() {
  const { t } = useI18n();

  const handleCtaPointerEnter = useCallback(syncCtaPointerPosition, []);
  const handleCtaPointerLeave = useCallback(syncCtaPointerPosition, []);

  return (
    <section id="inicio" className={styles.hero} aria-label={t("hero.ariaLabel")}>
      <HeroBeamsBackground />
      <div className={styles.inner}>
        <div className={styles.bannerMedia}>
          <div className={styles.bannerImageWrap}>
            <Image
              src={HERO_BANNER_SRC}
              alt={t("hero.bannerAlt")}
              width={960}
              height={720}
              priority
              quality={72}
              className={styles.bannerImage}
              sizes="(max-width: 809px) min(88vw, 420px), min(68vw, 728px)"
            />
          </div>
        </div>

        <div className={styles.content}>
          <h1 className={styles.title}>
            <span className={styles.titleWord}>{t("hero.titleDevelop")}</span>
            <span className={`${styles.titleWord} ${styles.titleWordAccent}`}>
              {t("hero.titleExperiences")}
            </span>
            <span className={styles.titleWord}>{t("hero.titleDigital")}</span>
          </h1>
          <p className={styles.description}>{t("hero.description")}</p>
          <Link
            className={styles.cta}
            href="#trabajar-con-nosotros"
            scroll={false}
            onPointerEnter={handleCtaPointerEnter}
            onPointerLeave={handleCtaPointerLeave}
          >
            <span>{t("hero.cta")}</span>
            <ArrowRight size={18} strokeWidth={2} aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
