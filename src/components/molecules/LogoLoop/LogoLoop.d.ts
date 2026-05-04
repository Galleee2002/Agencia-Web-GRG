import type * as React from "react";

export type LogoLoopLogoItem = {
  name?: string;
  src?: string;
  srcSet?: string;
  sizes?: string;
  width?: number;
  height?: number;
  alt?: string;
  title?: string;
  href?: string;
};

export type LogoLoopNodeItem = {
  node: React.ReactNode;
  href?: string;
  ariaLabel?: string;
  title?: string;
};

export type LogoLoopItem = LogoLoopLogoItem | LogoLoopNodeItem;

export type LogoLoopProps = {
  logos: LogoLoopItem[];
  speed?: number;
  direction?: "left" | "right" | "up" | "down";
  width?: number | string;
  logoHeight?: number;
  gap?: number;
  pauseOnHover?: boolean;
  hoverSpeed?: number;
  fadeOut?: boolean;
  fadeOutColor?: string;
  scaleOnHover?: boolean;
  renderItem?: (item: LogoLoopItem, key: string) => React.ReactNode;
  ariaLabel?: string;
  className?: string;
  style?: React.CSSProperties;
};

declare const LogoLoop: React.FC<LogoLoopProps>;
export { LogoLoop };
export default LogoLoop;
