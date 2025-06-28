import { describe, it, expect } from 'vitest';
import { transformDataForRows } from './transformDataForRows';
import type { AggregateResult } from '../api/aggregateCsvReport';

const fullMockData: AggregateResult = {
  total_spend_galactic: 1220977430.5,
  rows_affected: 2440000,
  less_spent_at: 311,
  big_spent_at: 158,
  less_spent_value: 3150113.5,
  big_spent_value: 3469937,
  average_spend_galactic: 500.40058627049183,
  big_spent_civ: 'monsters',
  less_spent_civ: 'humans',
};

describe('transformDataForRows', () => {
  it('transforms full data from server in accordance with business logic correctly', () => {
    const result = transformDataForRows(fullMockData);

    expect(result).toEqual([
      {
        subtitle: 'общие расходы в галактических кредитах',
        title: '1220977431',
      },
      { subtitle: 'количество обработанных записей', title: '2440000' },
      { subtitle: 'день года с минимальными расходами', title: '7 ноября' },
      { subtitle: 'цивилизация с максимальными расходами', title: 'monsters' },
      { subtitle: 'цивилизация с минимальными расходами', title: 'humans' },
      { subtitle: 'день года с максимальными расходами', title: '7 июня' },
      { subtitle: 'максимальная сумма расходов за день', title: '3469937' },
      { subtitle: 'средние расходы в галактических кредитах', title: '500' },
    ]);
  });

  it('handles missing fields gracefully', () => {
    const partialData = {
      total_spend_galactic: null,
      rows_affected: undefined,
      less_spent_at: null,
      big_spent_at: undefined,
      less_spent_value: null,
      big_spent_value: undefined,
      average_spend_galactic: null,
      big_spent_civ: null,
      less_spent_civ: undefined,
    } as unknown as AggregateResult;

    const result = transformDataForRows(partialData);

    expect(result).toEqual([
      { subtitle: 'общие расходы в галактических кредитах', title: '—' },
      { subtitle: 'количество обработанных записей', title: '—' },
      { subtitle: 'день года с минимальными расходами', title: '—' },
      { subtitle: 'цивилизация с максимальными расходами', title: '—' },
      { subtitle: 'цивилизация с минимальными расходами', title: '—' },
      { subtitle: 'день года с максимальными расходами', title: '—' },
      { subtitle: 'максимальная сумма расходов за день', title: '—' },
      { subtitle: 'средние расходы в галактических кредитах', title: '—' },
    ]);
  });

  it('transforms numeric values to string properly', () => {
    const data: AggregateResult = {
      ...fullMockData,
      total_spend_galactic: 0,
      big_spent_value: 999.9999999,
    };

    const result = transformDataForRows(data);

    expect(result[0].title).toBe('0');
    expect(result[6].title).toBe('1000');
  });
});
