"use client";

import Image from "next/image";

import LogoLoop, { type LogoLoopItem } from "@/components/molecules/LogoLoop";

import { HERO_TOOLS, type HeroTool } from "./heroTools";
import styles from "./Hero.module.scss";

export function HeroToolsLogoLoop() {
  return (
    <LogoLoop
      className={styles.heroLogoLoop}
      logos={[...HERO_TOOLS]}
      speed={48}
      direction="left"
      logoHeight={36}
      gap={0}
      pauseOnHover={false}
      fadeOut
      fadeOutColor="#000000"
      ariaLabel="Tecnologías y herramientas que utilizamos"
      renderItem={(tool: LogoLoopItem) => {
        const { name, src } = tool as HeroTool;
        return (
          <span className={styles.heroToolEntry}>
            <Image
              className={styles.toolsIcon}
              src={src}
              alt=""
              width={36}
              height={36}
              unoptimized
            />
            <span className={styles.toolsName}>{name}</span>
          </span>
        );
      }}
    />
  );
}
