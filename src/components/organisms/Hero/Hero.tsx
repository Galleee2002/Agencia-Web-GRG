import Link from "next/link";

import { HeroBeamsBackground } from "./HeroBeamsBackground";
import { HeroToolsLogoLoop } from "./HeroToolsLogoLoop";
import styles from "./Hero.module.scss";

export function Hero() {
  return (
    <section id="inicio" className={styles.hero} aria-label="Inicio">
      <HeroBeamsBackground />
      <div className={styles.inner}>
        <h1 className={styles.title}>EXPERIENCIAS WEB DE ALTO NIVEL
        </h1>
        <p className={styles.description}>
        Diseñamos y desarrollamos sitios rápidos, escalables y a medida, con una identidad clara y una ejecución precisa. Menos ruido, más impacto — la presencia digital que tu marca necesita.
        </p>
        <Link className={styles.cta} href="#contact">
          Empezar proyecto
        </Link>
        <span id="contact" className={styles.anchorTarget} tabIndex={-1}>
          Contacto
        </span>
      </div>
      <div className={styles.heroToolsBand}>
        <p className={styles.sectionFadeLabel}>
          Nuestras herramientas de trabajo
        </p>
        <div className={styles.toolsCarouselShell}>
          <div className={styles.toolsCarousel}>
            <HeroToolsLogoLoop />
          </div>
        </div>
      </div>
    </section>
  );
}
