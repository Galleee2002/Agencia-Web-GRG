"use client";

import { Moon, Settings, Sun } from "lucide-react";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import { useI18n } from "@/components/providers/I18nProvider";
import type { Locale } from "@/i18n/types";

import styles from "./FloatingSettings.module.scss";

export function FloatingSettings() {
  const { locale, setLocale, t } = useI18n();
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  // TODO: Connect Sun/Moon toggle to real theme switching (dark class / CSS variables).
  const [themePlaceholderDark, setThemePlaceholderDark] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    const onPointerDown = (event: MouseEvent) => {
      const root = rootRef.current;
      if (!root || root.contains(event.target as Node)) return;
      close();
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onPointerDown);
    };
  }, [close, open]);

  const selectLocale = (next: Locale) => {
    setLocale(next);
  };

  return (
    <div ref={rootRef} className={styles.root}>
      <div
        id={menuId}
        className={styles.menu}
        data-open={open ? "true" : "false"}
        role="region"
        aria-label={t("settings.language")}
        aria-hidden={!open}
      >
        <div className={styles.menuSection}>
          <p className={styles.menuLabel}>{t("settings.language")}</p>
          <div
            className={styles.toggleGroup}
            role="group"
            aria-label={t("settings.language")}
          >
            <button
              type="button"
              className={styles.toggleOption}
              data-active={locale === "es" ? "true" : "false"}
              aria-pressed={locale === "es"}
              onClick={() => selectLocale("es")}
            >
              ES
            </button>
            <button
              type="button"
              className={styles.toggleOption}
              data-active={locale === "en" ? "true" : "false"}
              aria-pressed={locale === "en"}
              onClick={() => selectLocale("en")}
            >
              EN
            </button>
          </div>
        </div>

        <div className={styles.menuSection}>
          <p className={styles.menuLabel}>{t("settings.theme")}</p>
          <div
            className={styles.toggleGroup}
            role="group"
            aria-label={t("settings.theme")}
          >
            <button
              type="button"
              className={styles.toggleOption}
              data-active={!themePlaceholderDark ? "true" : "false"}
              aria-pressed={!themePlaceholderDark}
              aria-label={t("settings.themeLight")}
              onClick={() => setThemePlaceholderDark(false)}
            >
              <Sun size={16} strokeWidth={1.75} aria-hidden />
            </button>
            <button
              type="button"
              className={styles.toggleOption}
              data-active={themePlaceholderDark ? "true" : "false"}
              aria-pressed={themePlaceholderDark}
              aria-label={t("settings.themeDark")}
              onClick={() => setThemePlaceholderDark(true)}
            >
              <Moon size={16} strokeWidth={1.75} aria-hidden />
            </button>
          </div>
        </div>
      </div>

      <button
        type="button"
        className={styles.trigger}
        aria-label={open ? t("settings.closeMenu") : t("settings.openMenu")}
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
      >
        <Settings size={20} strokeWidth={1.75} aria-hidden />
      </button>
    </div>
  );
}
