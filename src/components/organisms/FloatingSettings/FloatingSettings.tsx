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
import { useTheme } from "@/components/providers/ThemeProvider";
import type { Locale } from "@/i18n/types";

import styles from "./FloatingSettings.module.scss";

export function FloatingSettings() {
  const { locale, setLocale, t } = useI18n();
  const { theme, setTheme } = useTheme();
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const isDark = theme === "dark";

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

  const toggleLocale = (option: Locale) => {
    setLocale(locale === option ? (option === "es" ? "en" : "es") : option);
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
            data-active-index={locale === "es" ? "0" : "1"}
          >
            <span className={styles.toggleThumb} aria-hidden />
            <button
              type="button"
              className={styles.toggleOption}
              data-active={locale === "es" ? "true" : "false"}
              aria-pressed={locale === "es"}
              onClick={() => toggleLocale("es")}
            >
              ES
            </button>
            <button
              type="button"
              className={styles.toggleOption}
              data-active={locale === "en" ? "true" : "false"}
              aria-pressed={locale === "en"}
              onClick={() => toggleLocale("en")}
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
            data-active-index={isDark ? "1" : "0"}
          >
            <span className={styles.toggleThumb} aria-hidden />
            <button
              type="button"
              className={styles.toggleOption}
              data-active={!isDark ? "true" : "false"}
              aria-pressed={!isDark}
              aria-label={t("settings.themeLight")}
              onClick={() => setTheme("light")}
            >
              <Sun size={16} strokeWidth={1.75} aria-hidden />
            </button>
            <button
              type="button"
              className={styles.toggleOption}
              data-active={isDark ? "true" : "false"}
              aria-pressed={isDark}
              aria-label={t("settings.themeDark")}
              onClick={() => setTheme("dark")}
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
