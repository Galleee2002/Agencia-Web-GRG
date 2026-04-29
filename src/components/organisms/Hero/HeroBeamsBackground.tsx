"use client";

import dynamic from "next/dynamic";

import styles from "./Hero.module.scss";

const Beams = dynamic(() => import("./Beams"), {
  ssr: false,
  loading: () => null,
});

export function HeroBeamsBackground() {
  return (
    <div className={styles.beamsLayer} aria-hidden>
      <Beams
        beamWidth={2}
        beamHeight={15}
        beamNumber={12}
        lightColor="#ffffff"
        speed={2}
        noiseIntensity={1.75}
        scale={0.2}
        rotation={0}
      />
    </div>
  );
}
