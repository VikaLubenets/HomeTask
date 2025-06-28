import styles from './FileStatusRow.module.css';

type FileStatuses = 'success' | 'error';

type Props = {
  id: string;
  fileName: string;
  date: string;
  status: FileStatuses;
  onDelete: (id: string) => void;
};

const MAX_LENGTH = 14;

const getShortenedFileName = (name: string) => {
  return name.length > MAX_LENGTH ? name.slice(0, MAX_LENGTH - 3) + '...' : name;
};

const titles: Record<
  FileStatuses,
  { title: string; iconSrcActive: string; iconSrcInactive: string }
> = {
  success: {
    title: 'Обработан успешно',
    iconSrcActive: './icons/smile_active.svg',
    iconSrcInactive: './icons/smile_inactive.svg',
  },
  error: {
    title: 'Не удалось обработать',
    iconSrcActive: './icons/sad_active.svg',
    iconSrcInactive: './icons/sad_inactive.svg',
  },
};

export const FileStatusRow = ({
  id,
  fileName,
  date,
  status,
  onDelete,
}: Props) => {
  return (
    <div className={styles.row}>
      <div className={styles.wrapper}>
        <div className={styles.fileName}>
          <img
            src="./icons/akar-icons_file.svg"
            alt="file icon"
            className={styles.icon}
          />
          <p>{getShortenedFileName(fileName)}</p>
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
              src={
                status === type
                  ? titles[type].iconSrcActive
                  : titles[type].iconSrcInactive
              }
              alt={`${type} icon`}
              className={styles.icon}
            />
          </div>
        ))}
      </div>
      <div
        className={styles.deleteBtn}
        onClick={(e) => {
          e.stopPropagation();
          onDelete(id);
        }}
        data-testid="btn-delete"
      >
        <img src="./icons/Trash.svg" alt="trash icon" className={styles.icon} />
      </div>
    </div>
  );
};
