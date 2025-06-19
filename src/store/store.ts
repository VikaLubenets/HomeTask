import { create } from 'zustand';
import {
  aggregateCsvReport,
  type AggregateResult,
  type AggregateState,
} from '../api/CsvApi';
import { readStream } from '../util/readStream';
import { LStorage } from '../services/storage';

export type UploadButtonStatuses =
  | 'general'
  | 'upload'
  | 'parcing'
  | 'ready'
  | 'error';

type HistoryStatus = 'success' | 'error';

export interface HistoryEntry {
  id: string;
  fileName: string;
  date: string;
  status: HistoryStatus;
}

interface AnalyticsState {
  file: File | null;
  status: UploadButtonStatuses;
  result: AggregateState;
  error: string | null;
  selectFile: (file: File) => void;
  clear: () => void;
  send: (rows?: number) => Promise<void>;
}

export const LS_KEY = 'analitics_history';

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

    let hadError = false;

    try {
      set({ status: 'parcing', result: null });

      const stream = await aggregateCsvReport({ rows, file });
      if (!stream) throw new Error('Поток aggregateCsvReport пустой');

      for await (const chunk of readStream<AggregateResult>(stream)) {
        if (!chunk || typeof chunk !== 'object') {
          console.log('Некорректный чанк', chunk);
          continue;
        }
        set(() => ({ result: chunk }));
      }

      set({ status: 'ready' });
    } catch (e) {
      hadError = true;
      console.error('send() упал в useAnalyticsStore:', e);
      set({ error: (e as Error).message, status: 'error' });
    } finally {
      const history = LStorage.get<HistoryEntry[]>(LS_KEY) ?? [];

      const newRecord = {
        id: `${Date.now()}`,
        fileName: file.name,
        date: new Date().toISOString(),
        status: hadError ? 'error' : 'success',
      };

      LStorage.set(LS_KEY, [...history, newRecord]);
    }
  },
}));
