"use client";

import Image from "next/image";
import { ensureGsapPlugins, gsap, ScrollTrigger } from "@/lib/gsapPlugins";
import {
  useCallback,
  useLayoutEffect,
  useRef,
  useSyncExternalStore,
} from "react";

import { prefersReducedMotion } from "@/lib/smoothScroll";
import { registerWorkWithUsScrollTrigger } from "@/lib/workWithUsScrollPin";
import { cn } from "@/lib/utils";

import { useI18n, useWorkWithUsSteps } from "@/components/providers/I18nProvider";

import styles from "./WorkWithUsSection.module.scss";

ensureGsapPlugins();

const SCROLL_PER_STEP_VH = 110;
/** Porción de cada tramo dedicada al crossfade (scroll y visual van juntos) */
const CROSSFADE_SPAN = 0.42;
const MOBILE_LAYOUT_MQ = "(max-width: 808px)";

type WorkWithUsLayoutMode = "desktop" | "mobile" | "reduced";

function getWorkWithUsLayoutMode(): WorkWithUsLayoutMode {
  if (typeof window === "undefined") return "desktop";
  if (prefersReducedMotion()) return "reduced";
  if (window.matchMedia(MOBILE_LAYOUT_MQ).matches) return "mobile";
  return "desktop";
}

function subscribeWorkWithUsLayoutMode(onStoreChange: () => void): () => void {
  if (typeof window === "undefined") return () => {};

  const mobileMq = window.matchMedia(MOBILE_LAYOUT_MQ);
  const reducedMq = window.matchMedia("(prefers-reduced-motion: reduce)");

  const notify = () => onStoreChange();
  mobileMq.addEventListener("change", notify);
  reducedMq.addEventListener("change", notify);

  return () => {
    mobileMq.removeEventListener("change", notify);
    reducedMq.removeEventListener("change", notify);
  };
}

function setupMobileStackReveal(panels: HTMLElement[]) {
  panels.forEach((panel) => {
    setPanelVisible(panel, true);
    setPanelContentVisible(panel);

    gsap.fromTo(
      panel,
      { y: 72 },
      {
        y: 0,
        duration: 0.65,
        ease: "power3.out",
        scrollTrigger: {
          trigger: panel,
          start: "top 94%",
          toggleActions: "play none none none",
          once: true,
        },
      },
    );
  });
}

function stepProgressForIndex(index: number, stepCount: number): number {
  if (stepCount <= 1) return 0;
  if (index >= stepCount - 1) return 1;
  return index / (stepCount - 1);
}

function setPanelVisible(panel: HTMLElement, visible: boolean) {
  gsap.set(panel, {
    autoAlpha: visible ? 1 : 0,
    pointerEvents: visible ? "auto" : "none",
  });
}

function setPanelContentVisible(panel: HTMLElement) {
  const image = panel.querySelector<HTMLElement>("[data-step-image]");
  const text = panel.querySelector<HTMLElement>("[data-step-text]");
  const meta = panel.querySelector<HTMLElement>("[data-step-meta]");

  if (image) gsap.set(image, { opacity: 1, y: 0, scale: 1, clearProps: "transform" });
  if (text) gsap.set(text, { opacity: 1, y: 0, clearProps: "transform" });
  if (meta) gsap.set(meta, { opacity: 1, x: 0, clearProps: "transform" });
}

export function WorkWithUsSection() {
  const { t } = useI18n();
  const steps = useWorkWithUsSteps();
  const stepCount = steps.length;
  const scrollPanels = stepCount * SCROLL_PER_STEP_VH;
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLElement | null)[]>([]);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const layoutMode = useSyncExternalStore(
    subscribeWorkWithUsLayoutMode,
    getWorkWithUsLayoutMode,
    () => "desktop" as WorkWithUsLayoutMode,
  );
  const isMobileLayout = layoutMode === "mobile";
  const isReducedLayout = layoutMode === "reduced";

  const setStepRef = useCallback(
    (index: number) => (el: HTMLElement | null) => {
      stepRefs.current[index] = el;
    },
    [],
  );

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    if (!section || !pin) return;

    const ctx = gsap.context(() => {
      const panels = stepRefs.current.filter(
        (el): el is HTMLElement => el != null,
      );

      if (!panels.length) return;

      if (isReducedLayout) {
        panels.forEach((panel) => {
          gsap.set(panel, { autoAlpha: 1, clearProps: "transform" });
          setPanelContentVisible(panel);
        });
        registerWorkWithUsScrollTrigger(null);
        return;
      }

      if (isMobileLayout) {
        setupMobileStackReveal(panels);
        registerWorkWithUsScrollTrigger(null);
        return;
      }

      panels.forEach((panel, index) => {
        if (index === 0) {
          setPanelVisible(panel, true);
          setPanelContentVisible(panel);
          return;
        }
        setPanelVisible(panel, false);
        const image = panel.querySelector<HTMLElement>("[data-step-image]");
        const text = panel.querySelector<HTMLElement>("[data-step-text]");
        const meta = panel.querySelector<HTMLElement>("[data-step-meta]");
        if (image) gsap.set(image, { opacity: 0, y: 18, scale: 0.98 });
        if (text) gsap.set(text, { opacity: 0, y: 12 });
        if (meta) gsap.set(meta, { opacity: 0, x: -8 });
      });

      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: `+=${scrollPanels}%`,
          pin,
          scrub: 0.25,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          ...(stepCount > 1
            ? {
                snap: {
                  snapTo: (progress: number) => {
                    if (progress >= 0.92) return 1;
                    const idx = Math.min(
                      stepCount - 1,
                      Math.round(progress * (stepCount - 1)),
                    );
                    return stepProgressForIndex(idx, stepCount);
                  },
                  duration: { min: 0.12, max: 0.32 },
                  delay: 0,
                  ease: "power1.out",
                },
              }
            : {}),
        },
      });

      const st = tl.scrollTrigger ?? null;
      scrollTriggerRef.current = st;
      registerWorkWithUsScrollTrigger(st);

      for (let i = 1; i < panels.length; i++) {
        const prev = panels[i - 1];
        const curr = panels[i];
        const fadeStart = i - CROSSFADE_SPAN;

        tl.to(
          prev,
          {
            autoAlpha: 0,
            duration: CROSSFADE_SPAN,
            ease: "power2.inOut",
            onStart: () => setPanelVisible(prev, false),
          },
          fadeStart,
        );

        tl.fromTo(
          curr,
          { autoAlpha: 0 },
          {
            autoAlpha: 1,
            duration: CROSSFADE_SPAN,
            ease: "power2.inOut",
            onStart: () => setPanelVisible(curr, true),
          },
          fadeStart,
        );

        const image = curr.querySelector<HTMLElement>("[data-step-image]");
        const text = curr.querySelector<HTMLElement>("[data-step-text]");
        const meta = curr.querySelector<HTMLElement>("[data-step-meta]");

        if (image) {
          tl.to(
            image,
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: CROSSFADE_SPAN * 0.9,
              ease: "power3.out",
            },
            fadeStart + 0.03,
          );
        }
        if (text) {
          tl.to(
            text,
            { opacity: 1, y: 0, duration: CROSSFADE_SPAN * 0.85, ease: "power3.out" },
            fadeStart + 0.06,
          );
        }
        if (meta) {
          tl.to(
            meta,
            { opacity: 1, x: 0, duration: CROSSFADE_SPAN * 0.75, ease: "power2.out" },
            fadeStart + 0.04,
          );
        }
      }

      if (panels.length > 0) {
        tl.to({}, { duration: 1 - CROSSFADE_SPAN * 0.5 }, panels.length - 1);
      }
    }, section);

    let resizeTimer: ReturnType<typeof setTimeout> | undefined;
    const refresh = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 150);
    };
    window.addEventListener("resize", refresh);

    return () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      window.removeEventListener("resize", refresh);
      scrollTriggerRef.current = null;
      registerWorkWithUsScrollTrigger(null);
      ctx.revert();
    };
  }, [isMobileLayout, isReducedLayout, scrollPanels, stepCount]);

  return (
    <section
      ref={sectionRef}
      id="trabajar-con-nosotros"
      className={cn(
        styles.section,
        isReducedLayout && styles.sectionReduced,
        isMobileLayout && styles.sectionMobile,
      )}
      aria-labelledby="work-with-us-heading"
    >
      <div
        ref={pinRef}
        className={cn(
          styles.viewport,
          isReducedLayout && styles.viewportReduced,
          isMobileLayout && styles.viewportMobile,
        )}
      >
        <header className={styles.sectionHeader}>
          <h2 id="work-with-us-heading" className={styles.eyebrow}>
            {t("workWithUs.eyebrow")}
          </h2>
        </header>

        <div className={styles.stepsStack}>
          {steps.map((step, index) => (
            <article
              key={step.id}
              ref={setStepRef(index)}
              id={`trabajar-con-nosotros-${step.id}`}
              className={cn(
                styles.step,
                step.imageFirst
                  ? styles.stepImageLeft
                  : styles.stepImageRight,
                (isReducedLayout || isMobileLayout) && styles.stepMobile,
              )}
              aria-labelledby={`${step.id}-title`}
            >
              <div className={styles.stepGrid}>
                <div
                  className={styles.stepMedia}
                  data-step-image
                >
                  <div className={styles.stepImageFrame}>
                    <Image
                      src={step.imageSrc}
                      alt={step.imageAlt}
                      fill
                      priority={index === 0}
                      loading={index === 0 ? "eager" : "lazy"}
                      decoding="async"
                      quality={75}
                      sizes="(max-width: 808px) 100vw, 58vw"
                      className={styles.stepImage}
                    />
                  </div>
                </div>

                <div className={styles.stepContent} data-step-text>
                  <div className={styles.stepMeta} data-step-meta>
                    <span className={styles.stepNumber}>{step.number}</span>
                    <span className={styles.stepAccentLine} aria-hidden="true" />
                  </div>
                  <h3
                    id={`${step.id}-title`}
                    className={styles.stepTitle}
                    data-step-title
                  >
                    {step.title}
                  </h3>
                  <p className={styles.stepBody}>{step.text}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
