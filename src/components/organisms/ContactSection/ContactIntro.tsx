import styles from "./ContactSection.module.scss";

export function ContactIntro() {
  return (
    <div className={styles.intro}>
      <h2 id="contact-heading" className={styles.heading}>
        Creamos sitios web que{" "}
        <span className={styles.headingAccent}>impulsan</span> tu negocio.
      </h2>
      <p className={styles.sublead}>
        Cuéntanos tu proyecto y te respondemos con una propuesta clara.
      </p>
    </div>
  );
}
