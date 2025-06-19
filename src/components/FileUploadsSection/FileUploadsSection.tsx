import { useCsvUpload } from '../../hooks/useCsvUpload';
import { Button } from '../UI/Button/Button';
import { UploadButton } from '../UI/UploadButton/UploadButton';
import styles from './FileUploadsSection.module.css';


export const FileUploadSection = () => {
  const { file, status, selectFile, clear, send } = useCsvUpload(100);

  return (
    <section className={styles.section}>
      <p className={styles.text}>Загрузите <strong>csv</strong> файл и получите <strong>полную информацию</strong> о нём за сверхнизкое время</p>
      <div className={`${styles.background} ${status === 'upload' ? styles.green : styles.pink}`}>
        <UploadButton
            status={status}
            fileName={file?.name}
            onFileSelect={selectFile}
            onClear={clear}
        />
      </div>
      {(status === 'general' || status === 'upload') && (
        <Button
            styleType={status === 'upload' ? 'GREEN' : 'INACTIVE'}
            disabled={status !== 'upload'}
            onClick={send}
            >
                Отправить
        </Button>
      )}
    </section>
  );
};
