export function concat(chunks: Uint8Array[]): Uint8Array {
  if (chunks.length === 1) return chunks[0];

  let length = 0;
  for (let chunk of chunks) {
    length += chunk.length;
  }

  let result = new Uint8Array(length);
  let offset = 0;

  for (let chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }

  return result;
}

export function indexOf(
  head: Uint8Array,
  tail: Uint8Array,
  needle: Uint8Array,
  skipTable = computeSkipTable(needle),
): number {
  let totalLength = head.length + tail.length;

  for (let i = 0; i + needle.length <= totalLength; i += skipTable[(i + needle.length < head.length ? head[i + needle.length] : tail[i + needle.length - head.length])]) {
    let p = 0;

    while (p !== needle.length && needle[p] === (i + p < head.length ? head[i + p] : tail[i + p - head.length])) {
      ++p;
    }

    if (p === needle.length) {
      return i;
    }

    if (i + needle.length === totalLength) {
      return -1;
    }
  }

  return -1;
}

export function computeSkipTable(needle: Uint8Array): Uint8Array {
  let table = new Uint8Array(256).fill(needle.length + 1);

  for (let i = 0; i < needle.length; ++i) {
    table[needle[i]] = needle.length - i;
  }

  return table;
}
