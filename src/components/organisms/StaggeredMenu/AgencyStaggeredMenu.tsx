"use client";

import StaggeredMenu from "./StaggeredMenu";

const NAV_ITEMS = [
  { label: "Inicio", link: "/#inicio", ariaLabel: "Ir al inicio" },
  { label: "Proyectos", link: "/#proyectos", ariaLabel: "Ir a proyectos" },
  { label: "Contacto", link: "/#contact", ariaLabel: "Ir a contacto" },
];

export function AgencyStaggeredMenu() {
  return (
    <StaggeredMenu
      isFixed
      position="left"
      logoUrl="/logo.svg"
      colors={["#090909", "#000000"]}
      accentColor="#0099ff"
      items={NAV_ITEMS}
      displaySocials={false}
      menuButtonColor="#0a0a0a"
      openMenuButtonColor="#0a0a0a"
      changeMenuColorOnOpen={false}
    />
  );
}
