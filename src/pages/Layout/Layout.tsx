import { Header } from '../../components/Header/Header';
import styles from './Layout.module.css';

type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function Layout({ children, className, ...rest }: Props) {
  return (
    <div className={`${styles.layout} ${className ? className : ''}`} {...rest}>
      <Header />
      <div className={styles.wrapper}>{children}</div>
    </div>
  );
}
