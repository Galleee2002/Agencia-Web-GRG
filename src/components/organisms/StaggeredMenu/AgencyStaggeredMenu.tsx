"use client";

import { SITE_NAV_ITEMS } from "@/config/siteNavigation";
import { useMenuOverlay } from "@/contexts/MenuOverlayContext";
import StaggeredMenu from "./StaggeredMenu";

export function AgencyStaggeredMenu() {
  const { setMenuOpen } = useMenuOverlay();

  return (
    <StaggeredMenu
      isFixed
      position="left"
      logoUrl="/logo-negro.svg"
      colors={["#252525"]}
      accentColor="#0099ff"
      items={SITE_NAV_ITEMS}
      displaySocials={false}
      menuButtonColor="#252525"
      openMenuButtonColor="#252525"
      changeMenuColorOnOpen={false}
      ctaLabel="Contáctanos"
      onMenuOpen={() => setMenuOpen(true)}
      onMenuClose={() => setMenuOpen(false)}
    />
  );
}
