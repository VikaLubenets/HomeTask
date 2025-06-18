import styles from './Row.module.css';

type Props = {
  title: string;
  subtitle: string;
};

export const Row = ({ title, subtitle }: Props) => {
  return (
    <div className={styles.container}>
      <p className={styles.title}>{title}</p>
      <p className={styles.subtitle}>{subtitle}</p>
    </div>
  );
};
