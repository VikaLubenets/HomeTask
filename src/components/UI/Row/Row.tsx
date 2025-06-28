import styles from './Row.module.css';

type Props = {
  title: string;
  subtitle: string;
  isPinkGg?: boolean;
};

export const Row = ({ title, subtitle, isPinkGg = false, ...rest }: Props) => {
  return (
    <div
      className={`${styles.container} ${isPinkGg ? styles.bgPink : styles.bgWhite}`}
      {...rest}
    >
      <p className={styles.title}>{title}</p>
      <p className={styles.subtitle}>{subtitle}</p>
    </div>
  );
};
