"use client";

import { FloatingSettings } from "@/components/organisms/FloatingSettings/FloatingSettings";
import { useI18n, useSiteNavItems } from "@/components/providers/I18nProvider";
import { useMenuOverlay } from "@/contexts/MenuOverlayContext";
import StaggeredMenu from "./StaggeredMenu";

export function AgencyStaggeredMenu() {
  const { setMenuOpen } = useMenuOverlay();
  const { t } = useI18n();
  const items = useSiteNavItems();
  const menuPrelayerColors = [
    "var(--site-menu-prelayer-1)",
    "var(--site-menu-prelayer-2)",
  ];

  return (
    <StaggeredMenu
      isFixed
      position="left"
      colors={menuPrelayerColors}
      accentColor="#0099ff"
      items={items}
      displaySocials={false}
      menuButtonColor="#252525"
      openMenuButtonColor="#252525"
      changeMenuColorOnOpen={false}
      ctaLabel={t("nav.cta")}
      showHeaderCta={false}
      rightSlot={<FloatingSettings placement="inline" />}
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
