"use client";

import { useEffect, useRef, useState } from "react";

import styles from "./TeamSection.module.scss";

export function TeamHeading() {
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
          <span className={styles.headingLead}>Quiénes </span>
          <span className={styles.headingAccent}>somos</span>
        </span>
        <span className={styles.headingLineTrack} aria-hidden>
          <span className={styles.headingLine} />
        </span>
      </span>
    </h2>
  );
}
