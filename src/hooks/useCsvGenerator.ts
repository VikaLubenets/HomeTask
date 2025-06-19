import { useState, useCallback } from 'react';
import { getCsvReport } from '../api/CsvApi';


export type GenStatus = 'idle' | 'loading' | 'success' | 'error';

export function useCsvGenerator() {
  const [status, setStatus] = useState<GenStatus>('idle');
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async (params: { size: number }) => {
    try {
      setStatus('loading');
      setError(null);

      const csvText = await getCsvReport({ ...params, withErrors: 'off' });
      const blob = new Blob([csvText], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);

      setFileUrl(url);
      setStatus('success');
    } catch (e) {
      setError((e as Error).message);
      setStatus('error');
    }
  }, []);

  const ui = (() => {
    switch (status) {
      case 'loading':
        return { style: 'YELLOW' as const, title: 'Генерируем...', disabled: true };
      case 'success':
        return { style: 'GREEN' as const, title: 'Скачать CSV', disabled: false };
      case 'error':
        return { style: 'BLACK' as const, title: 'Повторить', disabled: false };
      default:
        return { style: 'GREEN' as const, title: 'Начать генерацию', disabled: false };
    }
  })();

  return { status, ui, generate, fileUrl, error };
}
