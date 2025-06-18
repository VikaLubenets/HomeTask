import styles from './FileStatusRow.module.css';

type FileStatuses = 'success' | 'error';

type Props = {
  fileName: string;
  date: string;
  status: FileStatuses;
};

const titles: Record<FileStatuses, { title: string; iconSrc: string }> = {
  success: {
    title: 'Обработан успешно',
    iconSrc: './icons/Smaile.svg',
  },
  error: {
    title: 'Не удалось обработать',
    iconSrc: './icons/ph_smiley-sad.svg',
  },
};

export const FileStatusRow = ({ fileName, date, status }: Props) => {
  return (
    <div className={styles.row}>
      <div className={styles.wrapper}>
        <div className={styles.fileName}>
          <img
            src="./icons/akar-icons_file.svg"
            alt="file icon"
            className={styles.icon}
          />
          <p>{fileName}</p>
        </div>
        <p>{date}</p>
        <div
          className={`${styles.statusContainer} ${status === 'success' ? 'activeStatus' : 'inactiveStatus'}`}
        >
          <p>{titles.success.title}</p>
          <img
            src={titles.success.iconSrc}
            alt="smile icon"
            className={styles.icon}
          />
        </div>
        <div
          className={`${styles.statusContainer} ${status === 'error' ? 'activeStatus' : 'inactiveStatus'}`}
        >
          <p>{titles.error.title}</p>
          <img
            src={titles.error.iconSrc}
            alt="sad icon"
            className={styles.icon}
          />
        </div>
      </div>
      <div className={styles.deleteBtn}>
        <img src="./icons/Trash.svg" alt="trash icon" className={styles.icon} />
      </div>
    </div>
  );
};
