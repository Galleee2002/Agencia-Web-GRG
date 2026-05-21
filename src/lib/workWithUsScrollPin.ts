import type { ScrollTrigger } from "gsap/ScrollTrigger";

let workWithUsScrollTrigger: ScrollTrigger | null = null;
let navPinBypassActive = false;

export function registerWorkWithUsScrollTrigger(
  instance: ScrollTrigger | null,
): void {
  workWithUsScrollTrigger = instance;
}

/**
 * Evita scrub/snap del pin durante scroll del nav. El scroll manual no pasa por aquí.
 * Proceso desde el hero (entrada por arriba) sigue usando el pin con animación.
 */
export function shouldBypassWorkWithUsPinForNavScroll(
  fromY: number,
  toY: number,
): boolean {
  const st = workWithUsScrollTrigger;
  if (!st) return false;

  const scrollMin = Math.min(fromY, toY);
  const scrollMax = Math.max(fromY, toY);
  const crosses = scrollMax > st.start && scrollMin < st.end;
  if (!crosses) return false;

  const destInPinZone = toY >= st.start - 4 && toY <= st.end + 4;
  if (destInPinZone && fromY < st.start) {
    return false;
  }

  return true;
}

/** No resetea el pin (evita saltos de layout); solo congela scrub/snap. */
export function suspendWorkWithUsScrollPinForNav(): void {
  if (!workWithUsScrollTrigger || navPinBypassActive) return;
  workWithUsScrollTrigger.disable(false);
  navPinBypassActive = true;
}

export function resumeWorkWithUsScrollPinForNav(): void {
  if (!navPinBypassActive) return;

  const st = workWithUsScrollTrigger;
  const y = window.scrollY;

  if (st) {
    st.enable();
    window.scrollTo({ top: y, behavior: "instant" });
  }

  navPinBypassActive = false;
}
