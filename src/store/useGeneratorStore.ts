import { create } from 'zustand';
import { getCsvReport } from '../api/CsvApi';

export type GenStatus = 'idle' | 'loading' | 'success' | 'error';
type CsvGeneratorState = {
  status: GenStatus;
  fileUrl: string | null;
  error: string | null;
  generate: (params: { size: number }) => Promise<void>;
  clear: () => void;
};

export const useCsvGeneratorStore = create<CsvGeneratorState>((set, get) => ({
  status: 'idle',
  fileUrl: null,
  error: null,

  async generate({ size }) {
    try {
      set({ status: 'loading', error: null });

      const csvText = await getCsvReport({ size });
      const blob = new Blob([csvText], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);

      set({ fileUrl: url, status: 'success' });
    } catch (e) {
      set({
        error: (e as Error).message,
        status: 'error',
        fileUrl: null,
      });
    }
  },

  clear() {
    const { fileUrl } = get();
    if (fileUrl) {
      URL.revokeObjectURL(fileUrl);
    }
    set({ fileUrl: null, status: 'idle', error: null });
  },
}));
