import { Button } from "@/components/atoms";
import styles from "./HeroContent.module.scss";

type HeroContentProps = {
  title: string;
  description: string;
};

export function HeroContent({ title, description }: HeroContentProps) {
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.description}>{description}</p>
      <div>
        <Button label="Comenzar" />
      </div>
    </div>
  );
}
