import { Link, useLocation } from 'react-router-dom';
import styles from './NavLink.module.css';

type Props = {
  title: string;
  link: string;
  iconSrc: string;
};

export const NavLink = ({ title, link, iconSrc }: Props) => {
  const location = useLocation();
  const isActive = location.pathname.includes(link);
  console.log('link', link, isActive)
  return (
    <Link
      to={link}
      className={`${styles.link} ${isActive ? styles.active : ''}`}
    >
      <img src={iconSrc} alt="icon for nav link" className={styles.icon} />
      {title}
    </Link>
  );
};
