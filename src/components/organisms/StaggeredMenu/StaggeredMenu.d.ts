import type * as React from "react";

export type StaggeredNavItem = {
  label: string;
  link: string;
  ariaLabel?: string;
};

export type StaggeredSocialItem = {
  label: string;
  link: string;
};

export type StaggeredMenuProps = {
  position?: "left" | "right";
  colors?: string[];
  items?: StaggeredNavItem[];
  socialItems?: StaggeredSocialItem[];
  displaySocials?: boolean;
  displayItemNumbering?: boolean;
  className?: string;
  /** Enlace del logo (por defecto inicio de la landing). */
  logoHref?: string;
  menuButtonColor?: string;
  openMenuButtonColor?: string;
  accentColor?: string;
  changeMenuColorOnOpen?: boolean;
  isFixed?: boolean;
  closeOnClickAway?: boolean;
  /** Header CTA link (e.g. contact). Omit or set showHeaderCta false to hide. */
  ctaHref?: string;
  ctaLabel?: string;
  showHeaderCta?: boolean;
  toggleLabelMenu?: string;
  toggleLabelClose?: string;
  ariaOpenMenu?: string;
  ariaCloseMenu?: string;
  ariaMenuOpen?: string;
  onMenuOpen?: () => void;
  onMenuClose?: () => void;
  /** Nodo opcional que reemplaza el CTA de la columna derecha de la sticky bar. */
  rightSlot?: React.ReactNode;
  /** Nodo al pie del panel del menú (p. ej. ajustes). */
  panelFooterSlot?: React.ReactNode;
  /** Nodo opcional junto al botón de menú en el dock mobile (esquina inferior). */
  dockSlot?: React.ReactNode;
};

export declare const StaggeredMenu: React.FC<StaggeredMenuProps>;
export default StaggeredMenu;
