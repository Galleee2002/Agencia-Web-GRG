"use client";

import { useI18n, useSiteNavItems } from "@/components/providers/I18nProvider";
import { useMenuOverlay } from "@/contexts/MenuOverlayContext";
import StaggeredMenu from "./StaggeredMenu";

export function AgencyStaggeredMenu() {
  const { setMenuOpen } = useMenuOverlay();
  const { locale, t } = useI18n();
  const items = useSiteNavItems();

  return (
    <StaggeredMenu
      key={locale}
      isFixed
      position="left"
      logoUrl="/logo-negro.svg"
      colors={["#252525"]}
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
