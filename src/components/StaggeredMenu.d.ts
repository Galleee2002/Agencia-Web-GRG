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
  logoUrl?: string;
  menuButtonColor?: string;
  openMenuButtonColor?: string;
  accentColor?: string;
  changeMenuColorOnOpen?: boolean;
  isFixed?: boolean;
  closeOnClickAway?: boolean;
  onMenuOpen?: () => void;
  onMenuClose?: () => void;
};

export declare const StaggeredMenu: React.FC<StaggeredMenuProps>;
export default StaggeredMenu;
