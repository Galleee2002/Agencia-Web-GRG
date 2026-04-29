import Link from "next/link";

import { HeroBeamsBackground } from "./HeroBeamsBackground";
import styles from "./Hero.module.scss";

export function Hero() {
  return (
    <section id="inicio" className={styles.hero} aria-label="Inicio">
      <HeroBeamsBackground />
      <div className={styles.inner}>
        <h1 className={styles.title}>
          Webs que se sienten
          <span className={styles.titleBreak}> premium.</span>
        </h1>
        <p className={styles.description}>
          Sitios rápidos, identidad sólida y desarrollo a medida. Menos ruido,
          más precisión — la web que tu marca merece.
        </p>
        <Link className={styles.cta} href="#contact">
          Empezar proyecto
        </Link>
        <span id="contact" className={styles.anchorTarget} tabIndex={-1}>
          Contacto
        </span>
      </div>
    </section>
  );
}
