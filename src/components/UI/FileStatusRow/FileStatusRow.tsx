import styles from './FileStatusRow.module.css';

type FileStatuses = 'success' | 'error';

type Props = {
  fileName: string;
  date: string;
  status: FileStatuses;
  onDelete: (id: string) => void;
};

const titles: Record<FileStatuses, { title: string; iconSrc: string }> = {
  success: {
    title: 'Обработан успешно',
    iconSrc: './icons/Smile.svg',
  },
  error: {
    title: 'Не удалось обработать',
    iconSrc: './icons/sad_icon.svg',
  },
};

export const FileStatusRow = ({ fileName, date, status, onDelete }: Props) => {
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
        <p>{new Date(date).toLocaleDateString('ru-RU')}</p>
        {(['success', 'error'] as const).map((type) => (
          <div
            key={type}
            className={`${styles.statusContainer} ${
              status === type ? styles.activeStatus : styles.inactiveStatus
            }`}
          >
            <p>{titles[type].title}</p>
            <img
              src={titles[type].iconSrc}
              alt={`${type} icon`}
              className={styles.icon}
            />
          </div>
        ))}
      </div>
      <div className={styles.deleteBtn}>
        <img src="./icons/Trash.svg" alt="trash icon" className={styles.icon} />
      </div>
    </div>
  );
};
