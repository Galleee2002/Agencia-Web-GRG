import styles from "./Button.module.scss";

type ButtonProps = {
  label: string;
  onClick?: () => void;
};

export function Button({ label, onClick }: ButtonProps) {
  return (
    <button type="button" className={styles.button} onClick={onClick}>
      {label}
    </button>
  );
}
