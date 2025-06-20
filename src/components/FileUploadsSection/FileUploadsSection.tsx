import { useState } from 'react';
import { UploadButton } from '../UI/UploadButton/UploadButton';
import { Button } from '../UI/Button/Button';
import styles from './FileUploadsSection.module.css';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';

export const FileUploadSection = () => {
  const { file, status, selectFile, clear, send } = useAnalyticsStore();
  const [dragActive, setDragActive] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      selectFile(droppedFile);
    }
  };

  const backgroundClass =
    dragActive || status === 'upload' ? styles.green : styles.pink;

  return (
    <section className={styles.section}>
      <p className={styles.text}>
        Загрузите <strong>csv</strong> файл и получите{' '}
        <strong>полную информацию</strong> о нём за сверхнизкое время
      </p>

      <div
        className={`${styles.background} ${backgroundClass}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <UploadButton
          status={status}
          title={file?.name}
          onFileSelect={selectFile}
          onClear={clear}
        />
      </div>

      {(status === 'general' || status === 'upload') && (
        <Button
          type="button"
          styleType={status === 'upload' ? 'GREEN' : 'INACTIVE'}
          disabled={status !== 'upload'}
          onClick={() => send()}
        >
          Отправить
        </Button>
      )}
    </section>
  );
};
