import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

let registered = false;

/** Registra plugins GSAP una sola vez en toda la app. */
export function ensureGsapPlugins(): void {
  if (registered) return;
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
  registered = true;
}

export { gsap, ScrollTrigger, ScrollToPlugin };
