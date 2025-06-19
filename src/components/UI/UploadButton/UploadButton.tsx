import { useEffect, useRef } from 'react';
import styles from './UploadButton.module.css';
import { DeleteIconButton } from '../DeleteIconButton/DeleteIconButton';
import type { UploadButtonStatuses } from '../../../store/store';
import { Loader } from '../Loader/Loader';

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

  useEffect(() => {
    if (status === 'general' && inputRef.current) {
      inputRef.current.value = '';
    }
  }, [status]);

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
          {status === 'parcing' && <Loader />}
          {status !== 'parcing' && (fileName || 'Загрузить файл')}
        </label>

        {fileName && <DeleteIconButton onDelete={onClear} />}
      </div>

      <p
        className={`${styles.subtitle} ${status === 'error' ? styles.errorTitle : ''}`}
      >
        {subtitles[status]}
      </p>
    </div>
  );
};
