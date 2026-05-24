"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { useI18n } from "@/components/providers/I18nProvider";

import type { TeamMember } from "./teamData";
import styles from "./TeamSection.module.scss";

type Props = {
  members: readonly TeamMember[];
};

/** Umbral bajo el viewport: el bloque entra al animar cuando queda “entrando” en pantalla. */
const ROOT_MARGIN = "0px 0px -12% 0px";
const THRESHOLD = 0.08;

export function TeamMemberRows({ members }: Props) {
  const { t } = useI18n();
  const [entered, setEntered] = useState<Record<number, boolean>>(() => {
    const initial: Record<number, boolean> = {};
    for (let i = 0; i < members.length; i += 1) initial[i] = false;
    return initial;
  });
  const elementsRef = useRef<Map<number, HTMLElement>>(new Map());

  useEffect(() => {
    const map = elementsRef.current;
    if (map.size === 0) return;

    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const raw = entry.target.getAttribute("data-member-index");
          const idx = raw == null ? NaN : Number.parseInt(raw, 10);
          if (Number.isNaN(idx)) continue;
          setEntered((prev) => {
            if (prev[idx]) return prev;
            return { ...prev, [idx]: true };
          });
          obs.unobserve(entry.target);
        }
      },
      { root: null, rootMargin: ROOT_MARGIN, threshold: THRESHOLD },
    );

    for (const el of map.values()) {
      obs.observe(el);
    }

    return () => obs.disconnect();
  }, [members.length]);

  return (
    <div className={styles.rows}>
      {members.map((member, i) => (
        <article
          key={member.name}
          ref={(el) => {
            if (el) elementsRef.current.set(i, el);
            else elementsRef.current.delete(i);
          }}
          data-member-index={i}
          data-entered={entered[i] === true ? "true" : "false"}
          className={`${styles.row} ${i % 2 === 1 ? styles.rowFlip : ""}`}
        >
          <div className={styles.copy}>
            <span className={styles.index} aria-hidden>
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className={styles.copyMain}>
              <h3 className={styles.name}>
                {member.nameSegments ? (
                  <>
                    {member.nameSegments.map((seg, j) =>
                      seg.accent ? (
                        <span key={j} className={styles.nameAccent}>
                          {seg.text}
                        </span>
                      ) : (
                        <span key={j}>{seg.text}</span>
                      ),
                    )}
                  </>
                ) : (
                  member.name
                )}
              </h3>
              <div className={styles.roleRow}>
                <span className={styles.coFounderPill}>{t("team.coFounderBadge")}</span>
                <p className={styles.role}>{member.role}</p>
              </div>
              <p className={styles.description}>
                {member.description.map((part, j) =>
                  part.emphasize ? (
                    <span key={j} className={styles.descEm}>
                      {part.text}
                    </span>
                  ) : (
                    <span key={j}>{part.text}</span>
                  ),
                )}
              </p>
            </div>
          </div>

          <figure className={styles.media}>
            <Image
              key={member.imageSrc}
              className={styles.illustration}
              src={member.imageSrc}
              alt={member.imageAlt}
              width={member.imageWidth}
              height={member.imageHeight}
              sizes="(min-width: 809px) min(38vw, 336px), min(68vw, 256px)"
              quality={72}
              loading="lazy"
              decoding="async"
            />
          </figure>
        </article>
      ))}
    </div>
  );
}
