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
  isDisabled?: boolean;
  setIsChoosing?: (v: boolean) => void;
};

const defaultSubtitles: Record<UploadButtonStatuses, string> = {
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
  isDisabled = false,
  setIsChoosing,
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (status === 'general' && inputRef.current) {
      inputRef.current.value = '';
    }
  }, [status]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isDisabled) return;
    const file = e.target.files?.[0];
    if (!file) return;

    const isCsv = file.type === 'text/csv' || file.name.endsWith('.csv');
    
    if (isCsv) {
      onFileSelect?.(file);
    } else {
      onClear?.();
      alert('Пожалуйста, загрузите файл в формате CSV');
    }
    
    setIsChoosing?.(false);
  };

  const isUploadMode = !!onFileSelect;

  return (
    <div className={styles.wrapper}>
      <div className={styles.firstRow}>
        {isUploadMode ? (
          <label
            className={`${styles.input} ${styles[status]} ${isDisabled ? styles.disabled : ''}`}
            onClick={() => {
              if (status === 'general') {
                setIsChoosing?.(true);
              }
            }}
          >
            <input
              type="file"
              accept=".csv"
              ref={inputRef}
              onChange={handleChange}
              disabled={isDisabled}
              style={{ display: 'none' }}
            />
            {status === 'parcing' && <Loader />}
            {status !== 'parcing' && (title || 'Загрузить файл')}
          </label>
        ) : (
          <button
            className={`${styles.input} ${styles[status]} ${isDisabled ? styles.disabled : ''}`}
            type="button"
            onClick={onClick}
            disabled={isDisabled}
          >
            {status === 'parcing' && <Loader />}
            {status !== 'parcing' && (title || 'Кнопка')}
          </button>
        )}

        {onClear && (status === 'error' || status === 'ready' || status === 'upload' ) && (
          <DeleteIconButton
            onDelete={() => {
              setIsChoosing?.(false);
              onClear();
            }}
          />
        )}
      </div>

      <p
        className={`${styles.subtitle} ${
          status === 'error' ? styles.errorTitle : ''
        }`}
      >
        {subtitle ?? defaultSubtitles[status]}
      </p>
    </div>
  );
};
