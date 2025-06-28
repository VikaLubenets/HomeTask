import { aggregateCsvReport } from '../api';
import type { AggregateResult, AggregateState } from '../api/aggregateCsvReport';
import { LS_KEY, type HistoryEntry } from '../store/useAnalyticsStore';
import { readStream } from '../util/readStream';
import { LStorage } from './storage';

export async function sendAnalytics(
    file: File,
    rows = 10000,
    onChunk?: (chunk: AggregateResult) => void
  ): Promise<{
    status: 'success' | 'error';
    result: AggregateState;
  }> {
    let hadError = false;
    let result: AggregateState = null;
  
    try {
      const stream = await aggregateCsvReport({ rows, file });
      if (!stream) throw new Error('Поток aggregateCsvReport пустой');
  
      for await (const chunk of readStream<AggregateResult>(stream)) {
        if (!chunk || typeof chunk !== 'object') continue;
  
        result = chunk;
        onChunk?.(chunk);
      }
  
      hadError = false;
    } catch (e) {
      hadError = true;
      throw e;
    } finally {
      const history = LStorage.get<HistoryEntry[]>(LS_KEY) ?? [];
  
      const newRecord: HistoryEntry = {
        id: `${Date.now()}`,
        fileName: file.name,
        date: new Date().toISOString(),
        status: hadError ? 'error' : 'success',
        result,
      };
  
      LStorage.set(LS_KEY, [...history, newRecord]);
    }
  
    return { status: hadError ? 'error' : 'success', result };
  }
  