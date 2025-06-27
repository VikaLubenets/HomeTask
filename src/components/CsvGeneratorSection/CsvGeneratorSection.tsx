import { useEffect } from 'react';
import { useCsvGeneratorStore } from '../../store/useGeneratorStore';
import { Button } from '../UI/Button/Button';
import { UploadButton } from '../UI/UploadButton/UploadButton';
import styles from './CsvGeneratorSection.module.css';

export const CsvGeneratorSection = () => {
  const { status, generate, fileUrl, clear } = useCsvGeneratorStore();

  const handleClick = () => {
    if (status === 'idle') {
      generate({ size: 0.1 });
    }
  };

  useEffect(() => {
    if (status === 'success' && fileUrl) {
      const a = document.createElement('a');
      a.href = fileUrl;
      a.download = 'report.csv';
      a.click();
    }
  }, [status, fileUrl]);

  const statusMap = {
    idle: (
      <Button styleType="GREEN" onClick={handleClick} data-testid="idle-btn">
        Начать генерацию
      </Button>
    ),
    loading: (
      <UploadButton
        status="parcing"
        subtitle="идёт процесс генерации"
        isDisabled={true}
        data-testid="loading-btn"
      />
    ),
    success: (
      <UploadButton
        status="ready"
        subtitle="файл сгенерирован!"
        title="Done!"
        isDisabled={true}
        onClear={clear}
        data-testid="success-btn"
      />
    ),
    error: (
      <UploadButton
        status="error"
        title="Ошибка"
        onClear={clear}
        isDisabled={true}
        data-testid="error-btn"
      />
    ),
  };

  return (
    <section className={styles.section}>
      <p className={styles.text}>
        Сгенерируйте готовый csv-файл нажатием одной кнопки
      </p>

      {statusMap[status]}
    </section>
  );
};
