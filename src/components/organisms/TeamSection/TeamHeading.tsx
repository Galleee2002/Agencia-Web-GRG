"use client";

import { useEffect, useRef, useState } from "react";

import { useI18n } from "@/components/providers/I18nProvider";

import styles from "./TeamSection.module.scss";

export function TeamHeading() {
  const { t } = useI18n();
  const ref = useRef<HTMLHeadingElement>(null);
  const [lineVisible, setLineVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setLineVisible(true);
          obs.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <h2
      ref={ref}
      id="team-heading"
      className={styles.heading}
      data-line-visible={lineVisible ? "true" : "false"}
    >
      <span className={styles.headingStack}>
        <span className={styles.headingRow}>
          <span className={styles.headingLead}>{t("team.headingLead")}</span>
          <span className={styles.headingAccent}>{t("team.headingAccent")}</span>
        </span>
        <span className={styles.headingLineTrack} aria-hidden>
          <span className={styles.headingLine} />
        </span>
      </span>
    </h2>
  );
}
