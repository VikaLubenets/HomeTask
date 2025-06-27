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

  let res: Response;
  try {
    res = await fetch(url.toString(), {
      method: 'GET',
    });
  } catch (err) {
    throw new Error('Сервер недоступен. Попробуйте позже.');
  }

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`Ошибка сервера: ${res.status} ${msg}`);
  }

  const csvText = await res.text();
  return csvText;
};
