import { describe, it, expect, vi, beforeEach } from 'vitest';
import { aggregateCsvReport } from '../api';
import { readStream } from '../util/readStream';
import { LStorage } from './storage';
import type { AggregateResult } from '../api/aggregateCsvReport';
import { sendAnalytics } from './sendAnalitics';

vi.mock('../api', () => ({
  aggregateCsvReport: vi.fn(),
}));

vi.mock('../util/readStream', () => ({
  readStream: vi.fn(),
}));

vi.mock('./storage', () => ({
  LStorage: {
    get: vi.fn(),
    set: vi.fn(),
  },
}));

describe('sendAnalytics', () => {
  const mockFile = new File(['test'], 'report.csv', { type: 'text/csv' });

  const mockChunk: AggregateResult = {
    total_spend_galactic: 100,
    rows_affected: 2,
    less_spent_at: 1,
    big_spent_at: 2,
    less_spent_value: 10,
    big_spent_value: 20,
    average_spend_galactic: 50,
    big_spent_civ: 'monsters',
    less_spent_civ: 'humans',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (LStorage.get as ReturnType<typeof vi.fn>).mockReturnValue([]);
  });

  it('should call onChunk and store result in localStorage on success', async () => {
    const onChunk = vi.fn();

    const mockStream = {};
    (aggregateCsvReport as ReturnType<typeof vi.fn>).mockResolvedValue(mockStream);

    (readStream as ReturnType<typeof vi.fn>).mockReturnValue((async function* () {
      yield mockChunk;
    })());

    const result = await sendAnalytics(mockFile, 10000, onChunk);

    expect(onChunk).toHaveBeenCalledWith(mockChunk);

    expect(LStorage.set).toHaveBeenCalledWith(
      'analitics_history',
      expect.arrayContaining([
        expect.objectContaining({
          fileName: 'report.csv',
          status: 'success',
          result: mockChunk,
        }),
      ])
    );

    expect(result).toEqual({ status: 'success', result: mockChunk });
  });

  it('should throw error if stream is null', async () => {
    (aggregateCsvReport as ReturnType<typeof vi.fn>).mockResolvedValue(null);

    await expect(sendAnalytics(mockFile)).rejects.toThrow('Поток aggregateCsvReport пустой');

    expect(LStorage.set).toHaveBeenCalledWith(
      'analitics_history',
      expect.arrayContaining([
        expect.objectContaining({
          status: 'error',
        }),
      ])
    );
  });
});
