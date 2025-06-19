import { UploadButton } from '../UI/UploadButton/UploadButton';
import { Button } from '../UI/Button/Button';
import styles from './FileUploadsSection.module.css';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';

export const FileUploadSection = () => {
  const { file, status, selectFile, clear, send } = useAnalyticsStore();

  return (
    <section className={styles.section}>
      <p className={styles.text}>
        Загрузите <strong>csv</strong> файл и получите{' '}
        <strong>полную информацию</strong> о нём за сверхнизкое время
      </p>

      <div
        className={`${styles.background} ${status === 'upload' ? styles.green : styles.pink}`}
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
