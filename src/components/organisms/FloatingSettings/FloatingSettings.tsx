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
import styles from "./FloatingSettings.module.scss";

type FloatingSettingsProps = {
  /**
   * "floating": botón flotante esquina inferior derecha (default, visible solo en mobile).
   * "inline": se integra en el contenedor padre (sin position:fixed), visible solo en desktop.
   */
  placement?: "floating" | "inline";
};

export function FloatingSettings({
  placement = "floating",
}: FloatingSettingsProps = {}) {
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

    const onScroll = () => {
      close();
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onPointerDown);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("scroll", onScroll);
    };
  }, [close, open]);

  const cycleLocale = () => {
    setLocale(locale === "es" ? "en" : "es");
  };

  const cycleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <div
      ref={rootRef}
      className={styles.root}
      data-placement={placement}
      data-open={open ? "true" : "false"}
    >
      <div
        id={menuId}
        className={styles.menu}
        data-open={open ? "true" : "false"}
        role="region"
        aria-label={`${t("settings.language")}, ${t("settings.theme")}`}
        aria-hidden={!open}
      >
        <div className={styles.menuSection}>
          <p className={styles.menuLabel}>{t("settings.language")}</p>
          <button
            type="button"
            className={styles.toggleGroup}
            aria-label={`${t("settings.language")}: ${locale === "es" ? "ES" : "EN"}`}
            data-active-index={locale === "es" ? "0" : "1"}
            onClick={cycleLocale}
          >
            <span className={styles.toggleThumb} aria-hidden />
            <span
              className={styles.toggleOption}
              data-active={locale === "es" ? "true" : "false"}
              aria-hidden
            >
              ES
            </span>
            <span
              className={styles.toggleOption}
              data-active={locale === "en" ? "true" : "false"}
              aria-hidden
            >
              EN
            </span>
          </button>
        </div>

        <div className={styles.menuSection}>
          <p className={styles.menuLabel}>{t("settings.theme")}</p>
          <button
            type="button"
            className={styles.toggleGroup}
            aria-label={
              isDark
                ? `${t("settings.theme")}: ${t("settings.themeDark")}`
                : `${t("settings.theme")}: ${t("settings.themeLight")}`
            }
            data-active-index={isDark ? "1" : "0"}
            onClick={cycleTheme}
          >
            <span className={styles.toggleThumb} aria-hidden />
            <span
              className={styles.toggleOption}
              data-active={!isDark ? "true" : "false"}
              aria-hidden
            >
              <Sun size={16} strokeWidth={1.75} />
            </span>
            <span
              className={styles.toggleOption}
              data-active={isDark ? "true" : "false"}
              aria-hidden
            >
              <Moon size={16} strokeWidth={1.75} />
            </span>
          </button>
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
        <span className={styles.triggerIcon} aria-hidden>
          <Settings size={20} strokeWidth={1.75} />
        </span>
      </button>
    </div>
  );
}
