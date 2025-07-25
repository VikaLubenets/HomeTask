import type { AggregateResult } from '../api/aggregateCsvReport';
import { transformDate } from './transformDate';

const fmt = <T>(v: T) => (v === undefined || v === null ? '—' : String(v));

export const transformDataForRows = (data: AggregateResult) => {
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

  return rows;
};
