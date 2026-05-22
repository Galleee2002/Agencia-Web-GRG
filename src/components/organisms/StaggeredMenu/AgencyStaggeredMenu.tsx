"use client";

import { useI18n, useSiteNavItems } from "@/components/providers/I18nProvider";
import { useTheme } from "@/components/providers/ThemeProvider";
import { siteLogoForTheme } from "@/config/siteAssets";
import { useMenuOverlay } from "@/contexts/MenuOverlayContext";
import StaggeredMenu from "./StaggeredMenu";

export function AgencyStaggeredMenu() {
  const { setMenuOpen } = useMenuOverlay();
  const { locale, t } = useI18n();
  const { theme } = useTheme();
  const items = useSiteNavItems();
  const menuPrelayerColors = [
    "var(--site-menu-prelayer-1)",
    "var(--site-menu-prelayer-2)",
  ];

  return (
    <StaggeredMenu
      key={locale}
      isFixed
      position="left"
      logoUrl={siteLogoForTheme(theme)}
      colors={menuPrelayerColors}
      accentColor="#0099ff"
      items={items}
      displaySocials={false}
      menuButtonColor="#252525"
      openMenuButtonColor="#252525"
      changeMenuColorOnOpen={false}
      ctaLabel={t("nav.cta")}
      toggleLabelMenu={t("nav.menu")}
      toggleLabelClose={t("nav.close")}
      ariaOpenMenu={t("nav.openMenu")}
      ariaCloseMenu={t("nav.closeMenu")}
      ariaMenuOpen={t("nav.menuOpen")}
      onMenuOpen={() => setMenuOpen(true)}
      onMenuClose={() => setMenuOpen(false)}
    />
  );
}
