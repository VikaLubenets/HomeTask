import styles from './Header.module.css';
import { NavLink } from '../UI/NavLink/NavLink';

const links = [
  {
    title: 'CSV Аналитик',
    link: '/',
    iconSrc: './icons/upload.svg',
  },
  {
    title: 'CSV Генератор',
    link: '/generation',
    iconSrc: './icons/generate.svg',
  },
  {
    title: 'История',
    link: '/history',
    iconSrc: './icons/history.svg',
  },
];

export const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.wrapper}>
        <img
          src="./logo/logo.png"
          alt="logo of yandex summer school"
          className={styles.logo}
        />
        <p className={styles.logoText}>Межгалактическая аналитика</p>
      </div>
      <nav className={styles.navigation}>
        {links.map((link) => (
          <NavLink
            key={link.link}
            {...link}
          />
        ))}
      </nav>
    </header>
  );
};
