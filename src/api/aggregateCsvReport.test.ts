import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { aggregateCsvReport } from './aggregateCsvReport';
import { BASE_URL } from '.';

describe('aggregateCsvReport api request', () => {
  const mockStream = {} as ReadableStream<Uint8Array>;

  const mockFile = new File(['hello,world,and,shri'], 'test.csv', {
    type: 'text/csv',
  });

  const testRows = 100;

  let mockFetch: ReturnType<typeof vi.fn>;

  beforeAll(() => {
    mockFetch = vi.fn();
    global.fetch = mockFetch;
  });

  afterAll(() => {
    vi.clearAllMocks();
  });

  it('calls fetch with correct URL, params and body', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      body: mockStream,
    });

    await aggregateCsvReport({ rows: testRows, file: mockFile });

    const expectedUrl = `${BASE_URL}/aggregate?rows=${testRows}`;

    const [calledUrl, calledOptions] = mockFetch.mock.calls[0];
    expect(calledUrl).toBe(expectedUrl);
    expect(calledOptions?.method).toBe('POST');

    const formData = calledOptions?.body as FormData;
    expect(formData).toBeInstanceOf(FormData);
    expect(formData.get('file')).toStrictEqual(mockFile);
  });

  it('throws error when fetch fails', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Error'));

    await expect(
      aggregateCsvReport({ rows: testRows, file: mockFile })
    ).rejects.toThrow('Сервер недоступен. Попробуйте позже.');
  });

  it('throws error when response is not ok', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      text: () => Promise.resolve('Internal Server Error'),
    });

    await expect(
      aggregateCsvReport({ rows: testRows, file: mockFile })
    ).rejects.toThrow('Ошибка сервера: 500 Internal Server Error');
  });

  it('throws error if response body is null', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      body: null,
    });

    await expect(
      aggregateCsvReport({ rows: testRows, file: mockFile })
    ).rejects.toThrow('Ответ от сервера не содержит данных');
  });

  it('returns a readable stream when request is successful', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      body: mockStream,
    });

    const result = await aggregateCsvReport({ rows: testRows, file: mockFile });
    expect(result).toBe(mockStream);
  });
});
