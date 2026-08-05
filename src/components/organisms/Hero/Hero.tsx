"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";

import { useI18n } from "@/components/providers/I18nProvider";
import { useTheme } from "@/components/providers/ThemeProvider";
import type { TranslateFn } from "@/i18n/content";
import { publicAssetUrl } from "@/lib/publicAssetUrl";
import { cn } from "@/lib/utils";

import { HeroBeamsBackground } from "./HeroBeamsBackground";
import {
  HERO_SERVICE_CARDS,
  HERO_VISUAL_IMAGE_SRC,
  HERO_VISUAL_IMAGE_SRC_DARK,
  type HeroServiceId,
} from "./heroServicesData";
import {
  HeroServiceCard,
  type HeroServiceCardContent,
} from "./HeroServiceCard";
import styles from "./Hero.module.scss";

/**
 * Setea las CSS vars --cta-mx/--cta-my con la posición del puntero relativa al
 * botón. El `::before` usa estas vars como origen del círculo de relleno.
 */
function syncCtaPointerPosition(event: ReactPointerEvent<HTMLAnchorElement>) {
  const el = event.currentTarget;
  const rect = el.getBoundingClientRect();
  el.style.setProperty("--cta-mx", `${event.clientX - rect.left}px`);
  el.style.setProperty("--cta-my", `${event.clientY - rect.top}px`);
}

function getServiceContent(
  id: HeroServiceId,
  t: TranslateFn,
): HeroServiceCardContent {
  switch (id) {
    case "management":
      return {
        title: t("hero.services.management.title"),
        description: t("hero.services.management.description"),
        imageAlt: t("hero.services.management.imageAlt"),
      };
    case "websites":
      return {
        title: t("hero.services.websites.title"),
        description: t("hero.services.websites.description"),
        imageAlt: t("hero.services.websites.imageAlt"),
      };
    case "invoicing":
      return {
        title: t("hero.services.invoicing.title"),
        description: t("hero.services.invoicing.description"),
        imageAlt: t("hero.services.invoicing.imageAlt"),
      };
    case "ecommerce":
      return {
        title: t("hero.services.ecommerce.title"),
        description: t("hero.services.ecommerce.description"),
        imageAlt: t("hero.services.ecommerce.imageAlt"),
      };
    default: {
      const _exhaustive: never = id;
      return _exhaustive;
    }
  }
}

function slotClass(slot: (typeof HERO_SERVICE_CARDS)[number]["slot"]): string {
  switch (slot) {
    case "topLeft":
      return styles.cardSlotTopLeft;
    case "topRight":
      return styles.cardSlotTopRight;
    case "bottomLeft":
      return styles.cardSlotBottomLeft;
    case "bottomRight":
      return styles.cardSlotBottomRight;
    default: {
      const _exhaustive: never = slot;
      return _exhaustive;
    }
  }
}

export function Hero() {
  const { t } = useI18n();
  const { theme } = useTheme();
  const visualSrc = publicAssetUrl(
    theme === "dark" ? HERO_VISUAL_IMAGE_SRC_DARK : HERO_VISUAL_IMAGE_SRC,
  );

  return (
    <section id="inicio" className={styles.hero} aria-label={t("hero.ariaLabel")}>
      <HeroBeamsBackground />
      <div className={styles.inner}>
        <div className={styles.content}>
          <h1 className={styles.title}>
            <span className={styles.titleWord}>{t("hero.titleLine1")}</span>
            <span className={`${styles.titleWord} ${styles.titleAccent}`}>
              {t("hero.titleAccent")}
            </span>
          </h1>

          <p className={styles.description}>{t("hero.description")}</p>

          <Link
            className={styles.cta}
            href="#contact"
            scroll={false}
            onPointerEnter={syncCtaPointerPosition}
            onPointerLeave={syncCtaPointerPosition}
          >
            <span>{t("hero.cta")}</span>
            <ArrowRight size={18} strokeWidth={2} aria-hidden />
          </Link>
        </div>

        <div className={styles.visualStage} aria-label={t("hero.visualAria")}>
          <div className={styles.visualCore}>
            <Image
              src={visualSrc}
              alt={t("hero.visualAlt")}
              width={960}
              height={960}
              priority
              quality={75}
              className={styles.visualImage}
              sizes="(max-width: 808px) min(100vw, 432px), (max-width: 1199px) min(52dvh, 540px), min(58dvh, 630px)"
            />
          </div>

          <div className={styles.visualCards} role="list">
            {HERO_SERVICE_CARDS.map((card, index) => (
              <div
                key={card.id}
                className={cn(styles.cardSlot, slotClass(card.slot))}
                role="listitem"
                style={{ "--card-index": index } as CSSProperties}
              >
                <HeroServiceCard
                  card={card}
                  content={getServiceContent(card.id, t)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
