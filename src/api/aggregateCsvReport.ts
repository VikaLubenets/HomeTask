import { BASE_URL } from ".";

interface AggregateParamsI {
    rows: number;
    file: File;
  }
  
  export type AggregateResult = {
    total_spend_galactic: number;
    rows_affected: number;
    less_spent_at: number;
    big_spent_at: number;
    less_spent_value: number;
    big_spent_value: number;
    average_spend_galactic: number;
    big_spent_civ: string;
    less_spent_civ: string;
  };
  
  export type AggregateState = AggregateResult | null;
  
  export async function aggregateCsvReport({
    rows,
    file,
  }: AggregateParamsI): Promise<ReadableStream<Uint8Array>> {
    const url = new URL(`${BASE_URL}/aggregate`);
    url.searchParams.set('rows', rows.toString());
  
    const fd = new FormData();
    fd.append('file', file, file.name);
  
    const res = await fetch(url.toString(), {
      method: 'POST',
      body: fd,
    });
  
    if (!res.ok) {
      throw new Error('Failed to aggregate CSV report');
    }
  
    if (!res.body) {
      throw new Error('Body is null');
    }
  
    return res.body;
  }
  