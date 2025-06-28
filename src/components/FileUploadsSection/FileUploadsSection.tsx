import { useRef, useState } from 'react';
import { UploadButton } from '../UI/UploadButton/UploadButton';
import { Button } from '../UI/Button/Button';
import styles from './FileUploadsSection.module.css';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';

export const FileUploadSection = () => {
  const { file, status, selectFile, clear, send } = useAnalyticsStore();
  const [dragActive, setDragActive] = useState(false);
  const [isChoosing, setIsChoosing] = useState(false);

  const dropRef = useRef<HTMLDivElement>(null);

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

    const related = e.relatedTarget as Node | null;
    if (!dropRef.current?.contains(related)) {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    const isCsv =
      file && (file.type === 'text/csv' || file.name.endsWith('.csv'));

    if (isCsv) {
      selectFile(file);
    } else {
      clear();
      alert('Пожалуйста, загрузите файл в формате .csv');
    }
  };

  const backgroundClass =
    dragActive || isChoosing
      ? styles.green
      : status === 'general'
        ? styles.pink
        : status === 'error'
          ? styles.error
          : styles.ready;

  return (
    <section className={styles.section}>
      <p className={styles.text}>
        Загрузите <strong>csv</strong> файл и получите{' '}
        <strong>полную информацию</strong> о нём за сверхнизкое время
      </p>

      <div
        data-testid="drop-area"
        ref={dropRef}
        className={`${styles.background} ${backgroundClass}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <UploadButton
          isDisabled={status !== 'general'}
          status={status}
          title={file?.name}
          onFileSelect={selectFile}
          onClear={clear}
          setIsChoosing={setIsChoosing}
          data-testid="upload-input"
        />
      </div>

      {(status === 'general' || status === 'upload') && (
        <Button
          data-testid="send-btn"
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
