"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import {
  clientLabel,
  createTranslate,
  getPortfolioProjects,
  getProjectsDisplayLinesDesktop,
  getProjectsDisplayLinesMobile,
  getServiceOptions,
  getSiteLegalLinks,
  getSiteNavItems,
  getTeamMembers,
  getWorkWithUsSteps,
  type TranslateFn,
} from "@/i18n/content";
import {
  getLocaleSnapshot,
  getServerLocaleSnapshot,
  setLocaleSnapshot,
  subscribeLocale,
} from "@/i18n/localeStore";
import { messagesByLocale } from "@/i18n/translations";
import type { Locale, TranslationKey } from "@/i18n/types";

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TranslateFn;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const locale = useSyncExternalStore(
    subscribeLocale,
    getLocaleSnapshot,
    getServerLocaleSnapshot,
  );

  const setLocale = useCallback((next: Locale) => {
    setLocaleSnapshot(next);
  }, []);

  const messages = messagesByLocale[locale];

  const t = useMemo(() => createTranslate(messages), [messages]);

  const value = useMemo<I18nContextValue>(
    () => ({ locale, setLocale, t }),
    [locale, setLocale, t],
  );

  return (
    <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
  );
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return ctx;
}

export function useSiteNavItems() {
  const { t } = useI18n();
  return useMemo(() => getSiteNavItems(t), [t]);
}

export function useSiteLegalLinks() {
  const { t } = useI18n();
  return useMemo(() => getSiteLegalLinks(t), [t]);
}

export function useServiceOptions() {
  const { t } = useI18n();
  return useMemo(() => getServiceOptions(t), [t]);
}

export function useTeamMembers() {
  const { t } = useI18n();
  return useMemo(() => getTeamMembers(t), [t]);
}

export function useWorkWithUsSteps() {
  const { t } = useI18n();
  return useMemo(() => getWorkWithUsSteps(t), [t]);
}

export function usePortfolioProjects() {
  const { t } = useI18n();
  return useMemo(() => getPortfolioProjects(t), [t]);
}

export function useProjectsDisplayLines() {
  const { t } = useI18n();
  return useMemo(
    () => ({
      mobile: getProjectsDisplayLinesMobile(t),
      desktop: getProjectsDisplayLinesDesktop(t),
      full: t("projects.displayFull"),
    }),
    [t],
  );
}

export function useClientLabel() {
  const { t } = useI18n();
  return useCallback(
    (type: Parameters<typeof clientLabel>[1]) => clientLabel(t, type),
    [t],
  );
}

export type { TranslationKey };
