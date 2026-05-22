import styles from "./SectionDivider.module.scss";

export function SectionDivider() {
  return (
    <div className={styles.wrap} aria-hidden="true">
      <span className={styles.line} />
    </div>
  );
}
