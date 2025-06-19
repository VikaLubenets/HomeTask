import { useAnalyticsStore } from '../../store/useAnalyticsStore';
import { transformDate } from '../../util/transformDate';
import { Row } from '../UI/Row/Row';
import styles from './HighlightsSection.module.css';

const fmt = (v: unknown) => (v === undefined || v === null ? '—' : String(v));

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

  const rows = [
    {
      subtitle: 'общие расходы в галактических кредитах',
      title: fmt(data.total_spend_galactic),
    },
    {
      subtitle: 'количество обработанных записей',
      title: fmt(data.rows_affected),
    },
    {
      subtitle: 'день года с минимальными расходами',
      title: fmt(transformDate(data.less_spent_at)),
    },
    {
      subtitle: 'цивилизация с максимальными расходами',
      title: fmt(data.big_spent_civ),
    },
    {
      subtitle: 'цивилизация с минимальными расходами',
      title: fmt(data.less_spent_civ),
    },
    {
      subtitle: 'день года с максимальными расходами',
      title: fmt(transformDate(data.big_spent_at)),
    },
    {
      subtitle: 'максимальная сумма расходов за день',
      title: fmt(data.big_spent_value),
    },
    {
      subtitle: 'средние расходы в галактических кредитах',
      title: fmt(data.average_spend_galactic),
    },
  ];

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
