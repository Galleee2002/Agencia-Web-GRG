import { Hero } from "@/components/organisms";
import styles from "./HomeTemplate.module.scss";

export function HomeTemplate() {
  return (
    <div className={styles.container}>
      <Hero />
    </div>
  );
}
