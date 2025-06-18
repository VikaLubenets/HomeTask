import { useRef } from 'react';
import styles from './UploadButton.module.css';

type UploadButtonStatuses =
  | 'general'
  | 'upload'
  | 'parcing'
  | 'ready'
  | 'error';

type Props = {
  status: UploadButtonStatuses;
  onFileSelect: (file: File) => void;
  onClear: () => void;
  fileName?: string;
};

const subtitles: Record<UploadButtonStatuses, string> = {
  general: 'или перетащите сюда',
  upload: 'файл загружен!',
  parcing: 'идёт парсинг файла',
  ready: 'готово!',
  error: 'упс, не то...',
};

export const UploadButton = ({
  status,
  onFileSelect,
  onClear,
  fileName,
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'text/csv') {
      onFileSelect(file);
    } else {
      onClear();
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.firstRow}>
        <label className={`${styles.input} ${styles[status]}`}>
          <input
            type="file"
            accept=".csv"
            ref={inputRef}
            onChange={handleChange}
            style={{ display: 'none' }}
          />
          {fileName || 'Загрузить файл'}
        </label>

        {fileName && (
          <div className={styles.iconContainer} onClick={onClear}>
            <img
              src="./icons/cancel.svg"
              alt="close icon"
              className={styles.icon}
            />
          </div>
        )}
      </div>

      <p
        className={`${styles.subtitle} ${status === 'error' ? styles.errorTitle : ''}`}
      >
        {subtitles[status]}
      </p>
    </div>
  );
};
