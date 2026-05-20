"use client";

import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

import {
  cancelSmoothScroll,
  prefersReducedMotion,
  smoothScrollToElement,
} from "@/lib/smoothScroll";
import { cn } from "@/lib/utils";

import { WORK_WITH_US_STEPS } from "./workWithUsSteps";
import styles from "./WorkWithUsSection.module.scss";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const STEP_COUNT = WORK_WITH_US_STEPS.length;
const SCROLL_PER_STEP_VH = 110;
const SCROLL_PANELS = STEP_COUNT * SCROLL_PER_STEP_VH;
/** Porción de cada tramo dedicada al crossfade (scroll y visual van juntos) */
const CROSSFADE_SPAN = 0.42;

function stepProgressForIndex(index: number): number {
  if (STEP_COUNT <= 1) return 0;
  if (index >= STEP_COUNT - 1) return 1;
  return index / (STEP_COUNT - 1);
}

function stepIndexFromProgress(progress: number): number {
  if (STEP_COUNT <= 1) return 0;
  if (progress >= 0.9) return STEP_COUNT - 1;
  return Math.min(
    STEP_COUNT - 1,
    Math.round(progress * (STEP_COUNT - 1)),
  );
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
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLElement | null)[]>([]);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(
    () =>
      typeof window !== "undefined" && prefersReducedMotion(),
  );

  const setStepRef = useCallback(
    (index: number) => (el: HTMLElement | null) => {
      stepRefs.current[index] = el;
    },
    [],
  );

  const scrollToStep = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(STEP_COUNT - 1, index));
    cancelSmoothScroll();

    const st = scrollTriggerRef.current;
    const stepEl = stepRefs.current[clamped];

    if (!st || reducedMotion) {
      if (stepEl) {
        smoothScrollToElement(stepEl, { duration: 0.85 });
      }
      setActiveStep(clamped);
      return;
    }

    const targetY =
      st.start + (st.end - st.start) * stepProgressForIndex(clamped);

    gsap.to(window, {
      duration: 0.55,
      scrollTo: { y: targetY, autoKill: true },
      ease: "power2.inOut",
      overwrite: "auto",
      onComplete: () => setActiveStep(clamped),
    });
  }, [reducedMotion]);

  const handleDotKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        scrollToStep(index);
      }
    },
    [scrollToStep],
  );

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    if (!section || !pin) return;

    const reduced = prefersReducedMotion();

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMqChange = () => {
      setReducedMotion(mq.matches);
      ScrollTrigger.refresh();
    };
    mq.addEventListener("change", onMqChange);

    const ctx = gsap.context(() => {
      const panels = stepRefs.current.filter(
        (el): el is HTMLElement => el != null,
      );

      if (!panels.length) return;

      if (reduced) {
        panels.forEach((panel) => {
          gsap.set(panel, { autoAlpha: 1, clearProps: "transform" });
          setPanelContentVisible(panel);
        });
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
          end: `+=${SCROLL_PANELS}%`,
          pin,
          scrub: 0.25,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          ...(STEP_COUNT > 1
            ? {
                snap: {
                  snapTo: (progress: number) => {
                    if (progress >= 0.92) return 1;
                    const idx = Math.min(
                      STEP_COUNT - 1,
                      Math.round(progress * (STEP_COUNT - 1)),
                    );
                    return stepProgressForIndex(idx);
                  },
                  duration: { min: 0.12, max: 0.32 },
                  delay: 0,
                  ease: "power1.out",
                },
              }
            : {}),
          onUpdate: (self) => {
            setActiveStep(stepIndexFromProgress(self.progress));
          },
        },
      });

      scrollTriggerRef.current = tl.scrollTrigger ?? null;

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

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("resize", refresh);

    return () => {
      mq.removeEventListener("change", onMqChange);
      window.removeEventListener("resize", refresh);
      scrollTriggerRef.current = null;
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="trabajar-con-nosotros"
      className={cn(
        styles.section,
        reducedMotion && styles.sectionReduced,
      )}
      aria-labelledby="work-with-us-heading"
    >
      <div
        ref={pinRef}
        className={cn(
          styles.viewport,
          reducedMotion && styles.viewportReduced,
        )}
      >
        <header className={styles.sectionHeader}>
          <p id="work-with-us-heading" className={styles.eyebrow}>
            Trabajar con nosotros
          </p>
        </header>

        <nav
          className={cn(
            styles.progress,
            reducedMotion && styles.progressReduced,
          )}
          aria-label="Progreso del proceso"
        >
          <div className={styles.progressTrack}>
            <span className={styles.progressLine} aria-hidden="true" />
            {WORK_WITH_US_STEPS.map((step, index) => (
              <button
                key={step.id}
                type="button"
                className={cn(
                  styles.progressDot,
                  activeStep === index && styles.progressDotActive,
                )}
                aria-label={`Ir al paso ${index + 1}`}
                aria-current={activeStep === index ? "step" : undefined}
                onClick={() => scrollToStep(index)}
                onKeyDown={(event) => handleDotKeyDown(event, index)}
              />
            ))}
          </div>
        </nav>

        <div className={styles.stepsStack}>
          {WORK_WITH_US_STEPS.map((step, index) => (
            <article
              key={step.id}
              ref={setStepRef(index)}
              id={`trabajar-con-nosotros-${step.id}`}
              className={cn(
                styles.step,
                step.imageFirst
                  ? styles.stepImageLeft
                  : styles.stepImageRight,
                reducedMotion && styles.stepReduced,
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
                  <h2
                    id={`${step.id}-title`}
                    className={styles.stepTitle}
                    data-step-title
                  >
                    {step.title}
                  </h2>
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
