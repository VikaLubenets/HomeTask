import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { getCsvReport } from './getCsvReport';
import { BASE_URL } from '.';

describe('getCsvReport api request', () => {
  let mockFetch: ReturnType<typeof vi.fn>;
  const testSize = 100;
  beforeAll(() => {
    mockFetch = vi.fn();
    global.fetch = mockFetch;
  });

  afterAll(() => {
    vi.clearAllMocks();
  });

  it('calls fetch with correct URL and query params', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve('csv content'),
    });
    await getCsvReport({ size: testSize });

    const expectedUrl = `${BASE_URL}/report?size=100&withErrors=on&maxSpend=1000`;
    expect(mockFetch).toHaveBeenCalledWith(expectedUrl, { method: 'GET' });
  });

  it('throws error when fetch fails', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Error'));
    await expect(getCsvReport({ size: testSize })).rejects.toThrow(
      'Сервер недоступен. Попробуйте позже.'
    );
  });

  it('throws error when response is not ok', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      text: () => Promise.resolve('Internal Server Error'),
      status: 500,
    });

    await expect(getCsvReport({ size: testSize })).rejects.toThrow(
      'Ошибка сервера: 500 Internal Server Error'
    );
  });

  it('returns csv text when request is successful', async () => {
    const testText = 'Hello,world';
    mockFetch.mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve(testText),
    });

    const result = await getCsvReport({ size: testSize });
    expect(result).toBe(testText);
  });
});
