import styles from './Row.module.css';

type Props = {
  title: string;
  subtitle: string;
  isPinkGg?: boolean;
};

export const Row = ({ title, subtitle, isPinkGg = false }: Props) => {
  return (
    <div
      className={`${styles.container} ${isPinkGg ? styles.bgPink : styles.bgWhite}`}
    >
      <p className={styles.title}>{title}</p>
      <p className={styles.subtitle}>{subtitle}</p>
    </div>
  );
};
