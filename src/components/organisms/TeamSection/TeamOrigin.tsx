"use client";

import Image from "next/image";

import { useI18n } from "@/components/providers/I18nProvider";
import { publicAssetUrl } from "@/lib/publicAssetUrl";

import styles from "./TeamSection.module.scss";

const ORIGIN_IMAGE_SRC = publicAssetUrl("/team/manu-gael-grg.webp");

export function TeamOrigin() {
  const { t } = useI18n();

  return (
    <div className={styles.origin}>
      <figure className={styles.originMedia}>
        <Image
          className={styles.originImage}
          src={ORIGIN_IMAGE_SRC}
          alt={t("team.originImageAlt")}
          width={675}
          height={506}
          sizes="(min-width: 809px) min(676px, 35vw), min(88vw, 360px)"
          quality={75}
          loading="lazy"
          decoding="async"
        />
      </figure>
      <p className={styles.originText}>{t("team.originStory")}</p>
    </div>
  );
}
