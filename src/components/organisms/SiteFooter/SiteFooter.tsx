import { SiteFooterContent } from "./SiteFooterContent";
import styles from "./SiteFooter.module.scss";

export function SiteFooter() {
  return (
    <footer className={styles.wrap} id="pie" aria-label="Pie de página">
      <SiteFooterContent />
    </footer>
  );
}
