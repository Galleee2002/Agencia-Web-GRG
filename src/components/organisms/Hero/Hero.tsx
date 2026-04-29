import { HeroContent } from "@/components/molecules";
import styles from "./Hero.module.scss";

export function Hero() {
  return (
    <section className={styles.hero}>
      <HeroContent
        title="Next.js + TypeScript + SCSS"
        description="Proyecto base con arquitectura Atomic Design para escalar componentes de forma ordenada."
      />
    </section>
  );
}
