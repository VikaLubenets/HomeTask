import { create } from 'zustand';
import { aggregateCsvReport } from '../api';
import { readStream } from '../util/readStream';
import { LStorage } from '../services/storage';
import type {
  AggregateResult,
  AggregateState,
} from '../api/aggregateCsvReport';
import { sendAnalytics } from '../services/sendAnalitics';

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
  result?: AggregateState;
}

export interface AnalyticsState {
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

  send: async (rows = 10000) => {
    const { file, status } = get();
    if (!file || status === 'parcing') return;
  
    try {
      set({ status: 'parcing', result: null });
      const { result } = await sendAnalytics(file, rows, (chunk) => {
        set(() => ({ result: chunk }));
      });
      set({ status: 'ready', result });
    } catch (e) {
      set({ error: (e as Error).message, status: 'error' });
    }
  }
  
}));
