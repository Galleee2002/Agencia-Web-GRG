import { SITE_LOGO_DARK, SITE_LOGO_LIGHT } from "@/config/siteAssets";

import styles from "./ThemeLogo.module.scss";

type ThemeLogoProps = {
  className?: string;
  width?: number;
  height?: number;
};

export function ThemeLogo({
  className,
  width = 998,
  height = 364,
}: ThemeLogoProps) {
  const baseClass = className
    ? `${styles.img} ${className}`
    : styles.img;

  return (
    <>
      <img
        src={SITE_LOGO_LIGHT}
        alt=""
        className={`${baseClass} ${styles.light}`}
        width={width}
        height={height}
        draggable={false}
        decoding="async"
      />
      <img
        src={SITE_LOGO_DARK}
        alt=""
        className={`${baseClass} ${styles.dark}`}
        width={width}
        height={height}
        draggable={false}
        decoding="async"
      />
    </>
  );
}
