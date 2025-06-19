import { useState } from 'react';
import { aggregateData, type AggregateResult } from '../api/CsvApi';

export type UploadButtonStatuses =
  | 'general'
  | 'upload'
  | 'parcing'
  | 'ready'
  | 'error';

export function useCsvUpload(rows = 100) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<UploadButtonStatuses>('general');
  const [result, setResult] = useState<AggregateResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectFile = (f: File) => {
    setFile(f);
    setStatus('upload');
    setError(null);
  };

  const clear = () => {
    setFile(null);
    setStatus('general');
    setResult(null);
    setError(null);
  };

  const send = async () => {
    if (!file) return;
    try {
      setStatus('parcing');
      const fd = new FormData();
      fd.append('file', file);
      const data = await aggregateData({ rows, file: fd });
      setResult(data);
      setStatus('ready');
    } catch (e) {
      setError((e as Error).message);
      setStatus('error');
    }
  };

  return { file, status, result, error, selectFile, clear, send };
}
