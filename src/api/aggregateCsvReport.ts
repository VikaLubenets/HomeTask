import { BASE_URL } from '.';

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

  let res: Response;
  try {
    res = await fetch(url.toString(), {
      method: 'POST',
      body: fd,
    });
  } catch (err) {
    throw new Error('Сервер недоступен. Попробуйте позже.');
  }

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`Ошибка сервера: ${res.status} ${msg}`);
  }

  if (!res.body) {
    throw new Error('Ответ от сервера не содержит данных');
  }

  return res.body;
}
