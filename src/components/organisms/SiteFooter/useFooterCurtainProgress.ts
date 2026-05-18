"use client";

import { useMotionValue } from "motion/react";
import {
  useCallback,
  useLayoutEffect,
  type RefObject,
} from "react";

const CONTACT_INNER_SELECTOR = "[data-contact-inner]";

/**
 * Progreso 0→1 del telón del footer mientras el usuario recorre la zona de
 * revelado, que empieza cuando el bloque interior de contacto termina su paso
 * por el viewport (borde inferior alineado con el borde inferior de la ventana).
 */
export function useFooterCurtainProgress(
  revealZoneRef: RefObject<HTMLElement | null>,
  enabled: boolean,
) {
  const progress = useMotionValue(0);

  const update = useCallback(() => {
    if (!enabled) return;

    const zone = revealZoneRef.current;
    const contactInner = document.querySelector(
      CONTACT_INNER_SELECTOR,
    ) as HTMLElement | null;

    if (!zone || !contactInner) return;

    const vh =
      typeof window !== "undefined"
        ? (window.visualViewport?.height ?? window.innerHeight)
        : 0;
    const zoneHeight = zone.offsetHeight;
    if (vh <= 0 || zoneHeight <= 0) return;

    const innerBottom = contactInner.getBoundingClientRect().bottom;

    if (innerBottom > vh) {
      progress.set(0);
      return;
    }

    const zoneTop = zone.getBoundingClientRect().top;
    const scrolled = vh - zoneTop;
    const p = Math.max(0, Math.min(1, scrolled / zoneHeight));
    progress.set(p);
  }, [enabled, progress, revealZoneRef]);

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
    if (revealZoneRef.current) ro.observe(revealZoneRef.current);
    const contactInner = document.querySelector(CONTACT_INNER_SELECTOR);
    if (contactInner) ro.observe(contactInner);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      vv?.removeEventListener("scroll", update);
      vv?.removeEventListener("resize", update);
      ro.disconnect();
    };
  }, [enabled, progress, revealZoneRef, update]);

  return progress;
}
