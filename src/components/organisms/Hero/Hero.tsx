import Link from "next/link";

import { HeroBeamsBackground } from "./HeroBeamsBackground";
import styles from "./Hero.module.scss";

export function Hero() {
  return (
    <section id="inicio" className={styles.hero} aria-label="Inicio">
      <HeroBeamsBackground />
      <div className={styles.inner}>
        <h1 className={styles.title}>
          <span className={styles.titleWord}>Desarrollamos</span>
          <span className={`${styles.titleWord} ${styles.titleWordAccent}`}>
            Experiencias
          </span>
          <span className={styles.titleWord}>Digitales</span>
        </h1>
        <p className={styles.description}>
          Una presencia digital sólida, moderna y pensada para convertir visitas
          en clientes.
        </p>
        <Link className={styles.cta} href="#contact">
          Empieza aquí{" "}
        </Link>
      </div>
    </section>
  );
}
