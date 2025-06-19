import { create } from 'zustand';
import {
  aggregateCsvReport,
  type AggregateResult,
  type AggregateState,
} from '../api/CsvApi';
import { readStream } from '../util/readStream';

export type UploadButtonStatuses =
  | 'general'
  | 'upload'
  | 'parcing'
  | 'ready'
  | 'error';

interface AnalyticsState {
  file: File | null;
  status: UploadButtonStatuses;
  result: AggregateState;
  error: string | null;
  selectFile: (file: File) => void;
  clear: () => void;
  send: (rows?: number) => Promise<void>;
}

export const useAnalyticsStore = create<AnalyticsState>((set, get) => ({
  file: null,
  status: 'general',
  result: null,
  error: null,

  selectFile: (file) => set({ file, status: 'upload', error: null }),

  clear: () =>
    set({ file: null, status: 'general', result: null, error: null }),

  send: async (rows = 1000) => {
    const { file, status } = get();
    if (!file || status === 'parcing') return;

    try {
      set({ status: 'parcing', result: null });

      const stream = await aggregateCsvReport({ rows, file });
      if (!stream) throw new Error('Поток aggregateCsvReport пустой');

      try {
        for await (const chunk of readStream<AggregateResult>(stream)) {
          if (!chunk || typeof chunk !== 'object') {
            console.log('Некорректный чанк', chunk);
            continue;
          }
        }
      } catch (inner) {
        console.log('Ошибка чтения потока', inner);
        throw inner;
      }

      set({ status: 'ready' });
    } catch (e) {
      console.log('send() упал в useAnalyticsStore:', e);
      set({ error: (e as Error).message, status: 'error' });
    }
  },
}));
