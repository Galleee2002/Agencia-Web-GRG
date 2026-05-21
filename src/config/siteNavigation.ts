export type SiteNavItem = {
  label: string;
  link: string;
  ariaLabel?: string;
};

export const SITE_NAV_ITEMS: SiteNavItem[] = [
  { label: "Inicio", link: "/#inicio", ariaLabel: "Ir al inicio" },
  {
    label: "Proceso",
    link: "/#trabajar-con-nosotros",
    ariaLabel: "Ir al proceso de trabajo",
  },
  { label: "Proyectos", link: "/#proyectos", ariaLabel: "Ir a proyectos" },
  { label: "Nosotros", link: "/#equipo", ariaLabel: "Ir a nosotros" },
  { label: "Contacto", link: "/#contact", ariaLabel: "Ir a contacto" },
];

export type SiteSocialItem = {
  label: string;
  link: string;
};

/** Rellena con URLs reales para mostrar iconos en el pie; vacío = sin fila social. */
export const SITE_SOCIAL_LINKS: SiteSocialItem[] = [];

export type LegalNavLink = { label: string; href: string };

export const SITE_LEGAL_LINKS: LegalNavLink[] = [
  { label: "Política de privacidad", href: "#" },
  { label: "Términos y condiciones", href: "#" },
  { label: "Cookies", href: "#" },
];
