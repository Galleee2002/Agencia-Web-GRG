"use client";

import { motion } from "motion/react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";

function buildKeyframes(
  from: Record<string, string | number>,
  steps: Record<string, string | number>[],
) {
  const keys = new Set([
    ...Object.keys(from),
    ...steps.flatMap((s) => Object.keys(s)),
  ]);
  const keyframes: Record<string, (string | number)[]> = {};
  keys.forEach((k) => {
    keyframes[k] = [from[k]!, ...steps.map((s) => s[k]!)];
  });
  return keyframes;
}

export type BlurTextProps = {
  text?: string;
  delay?: number;
  className?: string;
  animateBy?: "words" | "letters";
  direction?: "top" | "bottom";
  threshold?: number;
  rootMargin?: string;
  animationFrom?: Record<string, string | number>;
  animationTo?: Record<string, string | number>[];
  easing?: (t: number) => number;
  onAnimationComplete?: () => void;
  stepDuration?: number;
  /** Nodo raíz semántico (p. ej. `h2` para un titular). */
  as?: "p" | "h2";
  id?: string;
  /** Tokens exactos (tras `split(" ")` en modo words) que reciben `accentWordClassName`. */
  accentWords?: string[];
  /** Clase para palabras listadas en `accentWords` (p. ej. desde CSS modules). */
  accentWordClassName?: string;
};

const rootStyle: CSSProperties = {
  display: "flex",
};

export function BlurText({
  text = "",
  delay = 200,
  className = "",
  animateBy = "words",
  direction = "top",
  threshold = 0.1,
  rootMargin = "0px",
  animationFrom,
  animationTo,
  easing = (t: number) => t,
  onAnimationComplete,
  stepDuration = 0.35,
  as = "p",
  id,
  accentWords,
  accentWordClassName,
}: BlurTextProps) {
  const elements =
    animateBy === "words"
      ? text.split(" ").filter((segment) => segment.length > 0)
      : [...text];

  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLHeadingElement | HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(el);
        }
      },
      { threshold, rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  const defaultFrom = useMemo(
    () =>
      direction === "top"
        ? { filter: "blur(10px)", opacity: 0, y: -50 }
        : { filter: "blur(10px)", opacity: 0, y: 50 },
    [direction],
  );

  const defaultTo = useMemo(
    () => [
      {
        filter: "blur(5px)",
        opacity: 0.5,
        y: direction === "top" ? 5 : -5,
      },
      { filter: "blur(0px)", opacity: 1, y: 0 },
    ],
    [direction],
  );

  const fromSnapshot = animationFrom ?? defaultFrom;
  const toSnapshots = animationTo ?? defaultTo;

  const stepCount = toSnapshots.length + 1;
  const totalDuration = stepDuration * (stepCount - 1);
  const times = Array.from({ length: stepCount }, (_, i) =>
    stepCount === 1 ? 0 : i / (stepCount - 1),
  );

  const spans = elements.map((segment, index) => {
    const animateKeyframes = buildKeyframes(fromSnapshot, toSnapshots);

    const spanTransition = {
      duration: totalDuration,
      times,
      delay: (index * delay) / 1000,
      ease: easing,
    };

    const isAccent =
      Boolean(accentWordClassName) && Boolean(accentWords?.includes(segment));

    const spanClass = [
      "inline-block will-change-[transform,filter,opacity]",
      isAccent ? accentWordClassName : "",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <motion.span
        className={spanClass}
        key={`${index}-${segment}`}
        initial={fromSnapshot}
        animate={inView ? animateKeyframes : fromSnapshot}
        transition={spanTransition}
        onAnimationComplete={
          index === elements.length - 1 ? onAnimationComplete : undefined
        }
      >
        {segment === " " ? "\u00A0" : segment}
        {animateBy === "words" && index < elements.length - 1 && "\u00A0"}
      </motion.span>
    );
  });

  if (as === "h2") {
    return (
      <motion.h2
        ref={ref}
        id={id}
        className={className}
        style={rootStyle}
      >
        {spans}
      </motion.h2>
    );
  }

  return (
    <motion.p ref={ref} id={id} className={className} style={rootStyle}>
      {spans}
    </motion.p>
  );
}
