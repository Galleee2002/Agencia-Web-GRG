"use client";

import StaggeredMenu from "@/components/StaggeredMenu";

const NAV_ITEMS = [
  { label: "Inicio", link: "/#inicio", ariaLabel: "Ir al inicio" },
  { label: "Contacto", link: "/#contact", ariaLabel: "Ir a contacto" },
];

export function AgencyStaggeredMenu() {
  return (
    <StaggeredMenu
      isFixed
      position="right"
      logoUrl="/gmg-wordmark.svg"
      colors={["#090909", "#000000"]}
      accentColor="#0099ff"
      items={NAV_ITEMS}
      displaySocials={false}
      menuButtonColor="#ffffff"
      openMenuButtonColor="#ffffff"
      changeMenuColorOnOpen={false}
    />
  );
}
