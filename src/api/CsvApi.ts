const BASE_URL = 'http://127.0.0.1:3000';

interface GetParamsI {
  size: number;
  withErrors?: string;
  maxSpend?: string;
}

export const getCsvReport = async ({
  size,
  withErrors = 'off',
  maxSpend = '1000',
}: GetParamsI): Promise<string> => {
  const url = new URL(`${BASE_URL}/report`);
  url.searchParams.set('size', size.toString());
  url.searchParams.set('withErrors', withErrors);
  url.searchParams.set('maxSpend', maxSpend);

  const res = await fetch(url.toString(), {
    method: 'GET',
  });

  if (!res.ok) throw new Error('Failed to fetch CSV report');

  const csvText = await res.text();
  return csvText;
};

interface AggregateParamsI {
  rows: number;
  file: FormData;
}

export type AggregateResult = {
  title: string;
  subtitle: string;
}[];

export const aggregateData = async ({
  rows,
  file,
}: AggregateParamsI): Promise<AggregateResult> => {
  const url = new URL(`${BASE_URL}/aggregate`);
  url.searchParams.set('rows', rows.toString());

  const res = await fetch(url.toString(), {
    method: 'POST',
    body: file,
  });

  if (!res.ok) throw new Error('Failed to aggregate CSV report');

  const json = await res.json();
  return json;
};
