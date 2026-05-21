"use client";

import { motion, useReducedMotion, useTransform } from "motion/react";
import { useRef, useState, useEffect } from "react";

import { useI18n } from "@/components/providers/I18nProvider";

import { SiteFooterContent } from "./SiteFooterContent";
import footerStyles from "./SiteFooter.module.scss";
import styles from "./SiteFooterReveal.module.scss";
import { useFooterCurtainProgress } from "./useFooterCurtainProgress";

export function SiteFooterReveal() {
  const { t } = useI18n();
  const revealZoneRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const animateScroll = reduceMotion !== true;

  const progress = useFooterCurtainProgress(revealZoneRef, animateScroll);

  const footerY = useTransform(progress, [0.06, 0.9], ["-100%", "0%"]);
  const curtainClip = useTransform(
    progress,
    [0, 0.88],
    ["inset(0% 0% 0% 0%)", "inset(100% 0% 0% 0%)"],
  );

  const [zoneReady, setZoneReady] = useState(!animateScroll);

  useEffect(() => {
    if (!animateScroll) return;

    const unsubscribe = progress.on("change", (value) => {
      setZoneReady(value > 0.02);
    });

    return () => unsubscribe();
  }, [animateScroll, progress]);

  if (!animateScroll) {
    return (
      <footer
        className={footerStyles.wrap}
        id="pie"
        aria-label={t("footer.ariaLabel")}
      >
        <SiteFooterContent />
      </footer>
    );
  }

  return (
    <motion.div
      ref={revealZoneRef}
      className={`${styles.revealZone} ${zoneReady ? styles.revealZoneReady : ""}`}
      aria-hidden={!zoneReady}
    >
      <footer
        className={`${footerStyles.wrap} ${styles.curtainShell}`}
        id="pie"
        aria-label={t("footer.ariaLabel")}
      >
        <motion.div className={styles.footerBody} style={{ y: footerY }}>
          <SiteFooterContent />
        </motion.div>

        <motion.div
          className={styles.curtain}
          aria-hidden
          style={{ clipPath: curtainClip }}
        />
      </footer>
    </motion.div>
  );
}
