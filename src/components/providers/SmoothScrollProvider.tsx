"use client";

import { useEffect } from "react";

import {
  hashFromHref,
  isSamePageHashLink,
  smoothScrollToHash,
} from "@/lib/smoothScroll";

const MENU_CLOSE_EVENT = "staggered-menu:close";
const MENU_CLOSE_DELAY_MS = 340;

function isMenuOpen(): boolean {
  return Boolean(
    document.querySelector(".staggered-menu-wrapper[data-open]"),
  );
}

function requestMenuClose(): void {
  window.dispatchEvent(new CustomEvent(MENU_CLOSE_EVENT));
}

export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented) return;
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (!isSamePageHashLink(anchor)) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      const hash = hashFromHref(href);
      if (!hash) return;

      event.preventDefault();

      const runScroll = () => {
        const ok = smoothScrollToHash(hash);
        if (ok) {
          const nextUrl = `${window.location.pathname}${window.location.search}${hash}`;
          window.history.pushState(null, "", nextUrl);
        } else {
          window.location.assign(anchor.href);
        }
      };

      if (isMenuOpen()) {
        requestMenuClose();
        window.setTimeout(runScroll, MENU_CLOSE_DELAY_MS);
      } else {
        runScroll();
      }
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return children;
}
