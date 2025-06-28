import { describe, it, expect } from 'vitest';
import { readStream } from './readStream';

function createStream(lines: string[]): ReadableStream<Uint8Array> {
  const encoded = lines.map((l) => new TextEncoder().encode(l));
  return createChunkStream(encoded);
}

function createChunkStream(chunks: Uint8Array[]): ReadableStream<Uint8Array> {
  return new ReadableStream({
    start(ctrl) {
      chunks.forEach((c) => ctrl.enqueue(c));
      ctrl.close();
    },
  });
}

describe('readStream', () => {
  it('parses JSON correctly from stream', async () => {
    const stream = createStream([
      JSON.stringify({ a: 1 }) + '\n',
      JSON.stringify({ b: 2 }) + '\n',
      JSON.stringify({ c: 3 }) + '\n',
    ]);

    const result: Record<string, number>[] = [];
    for await (const item of readStream<Record<string, number>>(stream)) {
      result.push(item);
    }

    expect(result).toEqual([{ a: 1 }, { b: 2 }, { c: 3 }]);
  });

  it('handles partial JSON across chunks', async () => {
    const stream = createChunkStream([
      new TextEncoder().encode('{"a":1}\n{"b":'),
      new TextEncoder().encode('2}\n{"c":3}\n'),
    ]);

    const result: Record<string, number>[] = [];
    for await (const item of readStream<Record<string, number>>(stream)) {
      result.push(item);
    }

    expect(result).toEqual([{ a: 1 }, { b: 2 }, { c: 3 }]);
  });

  it('returns no items for empty stream', async () => {
    const stream = createStream([]);
    const result: unknown[] = [];

    for await (const item of readStream(stream)) {
      result.push(item);
    }

    expect(result).toEqual([]);
  });

  it('skips empty lines', async () => {
    const stream = createStream([
      '\n',
      JSON.stringify({ a: 1 }) + '\n',
      '\n\n',
      JSON.stringify({ b: 2 }) + '\n',
      '\n',
    ]);

    const result: unknown[] = [];
    for await (const item of readStream(stream)) {
      result.push(item);
    }

    expect(result).toEqual([{ a: 1 }, { b: 2 }]);
  });

  it('throws on invalid JSON line', async () => {
    const stream = createStream(['{"valid":true}\n', '{not valid: JSON}\n']);
    const result: unknown[] = [];
    const readAll = async () => {
      for await (const item of readStream(stream)) {
        result.push(item);
      }
    };

    await expect(readAll()).rejects.toThrow(SyntaxError);
  });
});
