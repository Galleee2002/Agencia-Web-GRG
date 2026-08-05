import Image from "next/image";
import type { CSSProperties } from "react";

import { publicAssetUrl } from "@/lib/publicAssetUrl";
import { cn } from "@/lib/utils";

import type { HeroServiceCardBase } from "./heroServicesData";
import styles from "./Hero.module.scss";

export type HeroServiceCardContent = {
  title: string;
  description: string;
  imageAlt: string;
};

type HeroServiceCardProps = {
  card: HeroServiceCardBase;
  content: HeroServiceCardContent;
  className?: string;
  style?: CSSProperties;
};

export function HeroServiceCard({
  card,
  content,
  className,
  style,
}: HeroServiceCardProps) {
  const imageSrc = card.imageSrc;

  return (
    <article className={cn(styles.card, className)} style={style}>
      <div className={styles.cardMedia}>
        {imageSrc ? (
          <Image
            src={publicAssetUrl(imageSrc)}
            alt={content.imageAlt}
            width={320}
            height={320}
            className={styles.cardImage}
            sizes="120px"
            quality={75}
          />
        ) : (
          <div className={styles.cardMediaPlaceholder} aria-hidden />
        )}
      </div>

      <div className={styles.cardBody}>
        <h2 className={styles.cardTitle}>
          {content.title.split("\n").map((line, index) => (
            <span key={`${card.id}-title-${index}`} className={styles.cardTitleLine}>
              {line}
            </span>
          ))}
        </h2>
        <p className={styles.cardDescription}>{content.description}</p>
      </div>
    </article>
  );
}
