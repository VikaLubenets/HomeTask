import { transformDataForRows } from '../../services/transformDataForRows';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';
import { Row } from '../UI/Row/Row';
import styles from './HighlightsSection.module.css';

export const HighlightsSection = () => {
  const data = useAnalyticsStore((s) => s.result);

  if (!data) {
    return (
      <section className={styles.section}>
        <div className={styles.text}>
          <p>Здесь</p>
          <p>появятся хайлайты</p>
        </div>
      </section>
    );
  }

  const rows = transformDataForRows(data);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {rows.map((row, idx) => (
          <Row key={idx} title={row.title} subtitle={row.subtitle} />
        ))}
      </div>
    </section>
  );
};
