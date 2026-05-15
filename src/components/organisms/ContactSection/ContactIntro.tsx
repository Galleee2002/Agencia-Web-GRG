import { Code2, Monitor, Zap } from "lucide-react";

import { CONTACT_FEATURES } from "./contactFormData";
import styles from "./ContactSection.module.scss";

const FEATURE_ICONS = {
  monitor: Monitor,
  code: Code2,
  zap: Zap,
} as const;

export function ContactIntro() {
  return (
    <div className={styles.intro}>
      <h2 id="contact-heading" className={styles.heading}>
        Creamos sitios web que{" "}
        <span className={styles.headingAccent}>impulsan</span> tu negocio.
      </h2>

      <p className={styles.lead}>
        Analizamos tu proyecto y te enviamos una propuesta personalizada. Cuéntanos
        qué necesitas y te respondemos con claridad.
      </p>

      <ul className={styles.features} aria-label="Ventajas">
        {CONTACT_FEATURES.map((feature) => {
          const Icon = FEATURE_ICONS[feature.icon];
          return (
            <li key={feature.title} className={styles.feature}>
              <div className={styles.featureIcon} aria-hidden>
                <Icon />
              </div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDesc}>{feature.description}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
