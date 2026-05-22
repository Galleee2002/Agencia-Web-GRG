import { ensureGsapPlugins, gsap } from "@/lib/gsapPlugins";
import {
  resumeWorkWithUsScrollPinForNav,
  shouldBypassWorkWithUsPinForNavScroll,
  suspendWorkWithUsScrollPinForNav,
} from "@/lib/workWithUsScrollPin";

ensureGsapPlugins();

let activeScrollTween: gsap.core.Tween | null = null;

const DEFAULT_DURATION = 1.15;
const DEFAULT_EASE = "power3.inOut";

export function getStickyNavOffset(): number {
  if (typeof window === "undefined") return 0;

  const host = document.querySelector<HTMLElement>(".sm-sticky-brand-host");
  if (host) return host.offsetHeight;

  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue("--site-sticky-nav-offset")
    .trim();
  if (!raw) return 0;

  const probe = document.createElement("div");
  probe.style.cssText =
    "position:absolute;visibility:hidden;pointer-events:none;height:var(--site-sticky-nav-offset)";
  document.documentElement.appendChild(probe);
  const height = probe.offsetHeight;
  probe.remove();
  return height;
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function isSamePageHashLink(anchor: HTMLAnchorElement): boolean {
  const href = anchor.getAttribute("href");
  if (!href || !href.includes("#")) return false;
  if (href.startsWith("#")) return true;

  try {
    const url = new URL(href, window.location.href);
    return (
      url.origin === window.location.origin &&
      url.pathname === window.location.pathname
    );
  } catch {
    return false;
  }
}

export function hashFromHref(href: string): string {
  const i = href.indexOf("#");
  return i >= 0 ? href.slice(i) : "";
}

export type SmoothScrollOptions = {
  duration?: number;
  offset?: number;
  onComplete?: () => void;
};

export function smoothScrollToElement(
  el: HTMLElement,
  options?: SmoothScrollOptions,
): void {
  const reduced = prefersReducedMotion();
  const duration = reduced ? 0 : (options?.duration ?? DEFAULT_DURATION);
  const offset = options?.offset ?? getStickyNavOffset();

  activeScrollTween?.kill();

  const fromY = window.scrollY;
  const targetY = el.getBoundingClientRect().top + window.scrollY - offset;
  const bypassPin = shouldBypassWorkWithUsPinForNavScroll(fromY, targetY);

  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    if (bypassPin) resumeWorkWithUsScrollPinForNav();
    options?.onComplete?.();
  };

  if (bypassPin) suspendWorkWithUsScrollPinForNav();

  if (duration === 0) {
    window.scrollTo({ top: targetY, behavior: "auto" });
    finish();
    return;
  }

  activeScrollTween = gsap.to(window, {
    duration,
    scrollTo: { y: el, offsetY: offset, autoKill: true },
    ease: DEFAULT_EASE,
    overwrite: "auto",
    onComplete: () => {
      activeScrollTween = null;
      finish();
    },
    onInterrupt: () => {
      activeScrollTween = null;
      finish();
    },
  });
}

export function smoothScrollToHash(
  hash: string,
  options?: SmoothScrollOptions,
): boolean {
  const id = hash.replace(/^#/, "");

  if (!id) {
    activeScrollTween?.kill();

    const fromY = window.scrollY;
    const bypassPin = shouldBypassWorkWithUsPinForNavScroll(fromY, 0);
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      if (bypassPin) resumeWorkWithUsScrollPinForNav();
      options?.onComplete?.();
    };

    if (bypassPin) suspendWorkWithUsScrollPinForNav();

    if (prefersReducedMotion()) {
      window.scrollTo({ top: 0, behavior: "auto" });
      finish();
    } else {
      activeScrollTween = gsap.to(window, {
        duration: options?.duration ?? DEFAULT_DURATION,
        scrollTo: { y: 0, autoKill: true },
        ease: DEFAULT_EASE,
        overwrite: "auto",
        onComplete: () => {
          activeScrollTween = null;
          finish();
        },
        onInterrupt: () => {
          activeScrollTween = null;
          finish();
        },
      });
    }
    return true;
  }

  const target = document.getElementById(id);
  if (!target) return false;

  smoothScrollToElement(target, options);
  return true;
}

export function cancelSmoothScroll(): void {
  activeScrollTween?.kill();
  activeScrollTween = null;
  resumeWorkWithUsScrollPinForNav();
}
