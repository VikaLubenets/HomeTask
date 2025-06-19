import { useCsvGenerator } from '../../hooks/useCsvGenerator';
import { Button } from '../UI/Button/Button';
import styles from './CsvGeneratorSection.module.css';

export const CsvGeneratorSection = () => {
  const { ui, generate, fileUrl } = useCsvGenerator();

  const handleClick = () => {
    if (ui.title === 'Скачать CSV' && fileUrl) {
      const a = document.createElement('a');
      a.href = fileUrl;
      a.download = 'report.csv';
      a.click();
    } else {
      generate({ size: 50 });
    }
  };

  return (
    <section className={styles.section}>
      <p className={styles.text}>Сгенерируйте готовый csv-файл нажатием одной кнопки</p>

      <Button
        styleType={ui.style}
        disabled={ui.disabled}
        onClick={handleClick}
      >
        {ui.title}
      </Button>
    </section>
  );
};
