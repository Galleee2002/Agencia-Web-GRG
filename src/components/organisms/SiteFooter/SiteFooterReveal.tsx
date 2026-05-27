"use client";

import { motion, useReducedMotion, useTransform } from "motion/react";
import { useLayoutEffect, useRef, useState, useEffect } from "react";

import { useI18n } from "@/components/providers/I18nProvider";

import { SiteFooterContent } from "./SiteFooterContent";
import footerStyles from "./SiteFooter.module.scss";
import styles from "./SiteFooterReveal.module.scss";
import { useFooterCurtainProgress } from "./useFooterCurtainProgress";

const MOBILE_MAX_WIDTH = 1024;

function useMaxWidth(maxWidthPx: number) {
  const [matches, setMatches] = useState(false);

  useLayoutEffect(() => {
    const mq = window.matchMedia(`(max-width: ${maxWidthPx}px)`);
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [maxWidthPx]);

  return matches;
}

function StaticFooter({ ariaLabel }: { ariaLabel: string }) {
  return (
    <footer
      className={`${footerStyles.wrap} ${footerStyles.wrapWithMobileDock}`}
      id="pie"
      aria-label={ariaLabel}
    >
      <SiteFooterContent />
    </footer>
  );
}

export function SiteFooterReveal() {
  const { t } = useI18n();
  const revealZoneRef = useRef<HTMLDivElement>(null);
  const footerShellRef = useRef<HTMLElement>(null);
  const mobileLayout = useMaxWidth(MOBILE_MAX_WIDTH);
  const reduceMotion = useReducedMotion();
  const useRevealAnimation = reduceMotion !== true && !mobileLayout;

  const progress = useFooterCurtainProgress(
    revealZoneRef,
    useRevealAnimation,
  );

  const footerY = useTransform(progress, [0.06, 0.9], ["-100%", "0%"]);
  const curtainClip = useTransform(
    progress,
    [0, 0.88],
    ["inset(0% 0% 0% 0%)", "inset(100% 0% 0% 0%)"],
  );

  const [zoneReady, setZoneReady] = useState(!useRevealAnimation);

  useLayoutEffect(() => {
    if (!useRevealAnimation) return;

    const zone = revealZoneRef.current;
    const shell = footerShellRef.current;
    if (!zone || !shell) return;

    const syncHeight = () => {
      zone.style.setProperty(
        "--footer-content-height",
        `${shell.offsetHeight}px`,
      );
    };

    syncHeight();
    const ro = new ResizeObserver(syncHeight);
    ro.observe(shell);
    return () => ro.disconnect();
  }, [useRevealAnimation, t]);

  useEffect(() => {
    if (!useRevealAnimation) return;

    const unsubscribe = progress.on("change", (value) => {
      setZoneReady(value > 0.02);
    });

    return () => unsubscribe();
  }, [useRevealAnimation, progress]);

  if (!useRevealAnimation) {
    return <StaticFooter ariaLabel={t("footer.ariaLabel")} />;
  }

  return (
    <motion.div
      ref={revealZoneRef}
      className={`${styles.revealZone} ${zoneReady ? styles.revealZoneReady : ""}`}
      aria-hidden={!zoneReady}
    >
      <footer
        ref={footerShellRef}
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
