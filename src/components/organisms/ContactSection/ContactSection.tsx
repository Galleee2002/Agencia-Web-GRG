import { ContactForm } from "./ContactForm";
import { ContactIntro } from "./ContactIntro";
import styles from "./ContactSection.module.scss";

export function ContactSection() {
  return (
    <section
      id="contact"
      className={styles.section}
      aria-labelledby="contact-heading"
    >
      <div className={styles.inner}>
        <div className={styles.grid}>
          <ContactIntro />
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
