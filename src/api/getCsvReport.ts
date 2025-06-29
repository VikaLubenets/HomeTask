import { BASE_URL } from '.';

interface GetParamsI {
  size: number;
  withErrors?: string;
  maxSpend?: string;
}

export const getCsvReport = async ({
  size,
  withErrors = 'on',
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
