export type SiteNavItem = {
  label: string;
  link: string;
  ariaLabel?: string;
};

export type SiteSocialItem = {
  label: string;
  link: string;
};

/** Rellena con URLs reales para mostrar iconos en el pie; vacío = sin fila social. */
export const SITE_SOCIAL_LINKS: SiteSocialItem[] = [];

export type LegalNavLink = { label: string; href: string };
