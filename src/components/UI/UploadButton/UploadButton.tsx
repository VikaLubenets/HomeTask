import { useEffect, useRef } from 'react';
import styles from './UploadButton.module.css';
import { DeleteIconButton } from '../DeleteIconButton/DeleteIconButton';
import type { UploadButtonStatuses } from '../../../store/useAnalyticsStore';
import { Loader } from '../Loader/Loader';

type Props = {
  status: UploadButtonStatuses;
  onFileSelect?: (file: File) => void;
  onClear?: () => void;
  title?: string;
  subtitle?: string;
  onClick?: () => void;
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
  title,
  subtitle,
  onClick,
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (status === 'general' && inputRef.current) {
      inputRef.current.value = '';
    }
  }, [status]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'text/csv') {
      onFileSelect?.(file);
    } else {
      onClear?.();
    }
  };

  const isUploadMode = !!onFileSelect;

  return (
    <div className={styles.wrapper}>
      <div className={styles.firstRow}>
        {isUploadMode ? (
          <label
            className={`${styles.input} ${styles[status]}`}
            style={{ cursor: 'pointer' }}
          >
            <input
              type="file"
              accept=".csv"
              ref={inputRef}
              onChange={handleChange}
              style={{ display: 'none' }}
            />
            {status === 'parcing' && <Loader />}
            {status !== 'parcing' && (title || 'Загрузить файл')}
          </label>
        ) : (
          <button
            className={`${styles.input} ${styles[status]}`}
            type="button"
            onClick={onClick}
          >
            {status === 'parcing' && <Loader />}
            {status !== 'parcing' && (title || 'Кнопка')}
          </button>
        )}

        {onClear && <DeleteIconButton onDelete={onClear} />}
      </div>

      <p
        className={`${styles.subtitle} ${
          status === 'error' ? styles.errorTitle : ''
        }`}
      >
        {subtitle ?? subtitles[status]}
      </p>
    </div>
  );
};
