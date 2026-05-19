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
      logoUrl="/logo.svg"
      colors={["#090909", "#000000"]}
      accentColor="#0099ff"
      items={SITE_NAV_ITEMS}
      displaySocials={false}
      menuButtonColor="#ffffff"
      openMenuButtonColor="#ffffff"
      changeMenuColorOnOpen={false}
      ctaLabel="Contáctanos"
      onMenuOpen={() => setMenuOpen(true)}
      onMenuClose={() => setMenuOpen(false)}
    />
  );
}
