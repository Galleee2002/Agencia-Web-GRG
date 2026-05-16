"use client";

import {
  motion,
  motionValue,
  useReducedMotion,
  useMotionValue,
  useTransform,
} from "motion/react";
import {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  type RefObject,
} from "react";

import { ContactForm } from "./ContactForm";
import { ContactIntro } from "./ContactIntro";
import styles from "./ContactSection.module.scss";

/**
 * Progreso 0→1 mientras la sección atraviesa el viewport (equivalente práctico a
 * useScroll offset ["start end","end start"] pero sin depender del cálculo del
 * scrollingElement cuando `html` es `position: static`, típico en Next + Tailwind.
 */
function useSectionRevealProgress(
  sectionRef: RefObject<HTMLElement | null>,
  enabled: boolean,
) {
  const progress = useMotionValue(0);

  const update = useCallback(() => {
    if (!enabled) return;
    const el = sectionRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const vh =
      typeof window !== "undefined"
        ? (window.visualViewport?.height ?? window.innerHeight)
        : 0;
    const sh = el.offsetHeight;
    if (vh <= 0 || sh <= 0) return;

    const range = vh + sh;
    const traveled = vh - rect.top;
    const p = Math.max(0, Math.min(1, traveled / range));
    progress.set(p);
  }, [enabled, progress, sectionRef]);

  useLayoutEffect(() => {
    if (!enabled) {
      progress.set(1);
      return;
    }

    update();

    const opts: AddEventListenerOptions = { passive: true };
    window.addEventListener("scroll", update, opts);
    window.addEventListener("resize", update);
    const vv = window.visualViewport;
    vv?.addEventListener("scroll", update, opts);
    vv?.addEventListener("resize", update);

    const ro = new ResizeObserver(() => update());
    if (sectionRef.current) ro.observe(sectionRef.current);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      vv?.removeEventListener("scroll", update);
      vv?.removeEventListener("resize", update);
      ro.disconnect();
    };
  }, [enabled, progress, sectionRef, update]);

  return progress;
}

export function ContactScrollShell() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const staticRevealed = useMemo(() => motionValue(1), []);

  const animateScroll = reduceMotion !== true;
  const sectionProgress = useSectionRevealProgress(sectionRef, animateScroll);

  const introOpacity = useTransform(
    sectionProgress,
    [0, 0.08, 0.22],
    [0, 1, 1],
  );
  const introY = useTransform(sectionProgress, [0, 0.2], [28, 0]);

  const formProgress = reduceMotion === true ? staticRevealed : sectionProgress;

  return (
    <section
      ref={sectionRef}
      id="contact"
      className={styles.section}
      aria-labelledby="contact-heading"
    >
      <div className={styles.inner}>
        <div className={styles.grid}>
          {!animateScroll ? (
            <>
              <ContactIntro />
              <ContactForm scrollYProgress={staticRevealed} />
            </>
          ) : (
            <>
              <motion.div
                className={styles.revealBlock}
                style={{ opacity: introOpacity, y: introY }}
              >
                <ContactIntro />
              </motion.div>
              <div className={styles.revealBlock}>
                <ContactForm scrollYProgress={formProgress} />
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
