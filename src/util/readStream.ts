export async function* readStream<T>(
  stream: ReadableStream<Uint8Array>
): AsyncGenerator<T> {
  const textStream = stream.pipeThrough(new TextDecoderStream());
  const reader = textStream.getReader();
  let buffer = '';

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += value;
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      if (line) yield JSON.parse(line) as T;
    }
  }

  if (buffer.trim()) yield JSON.parse(buffer) as T;
}
