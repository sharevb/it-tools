function chunkByFixedCount<T>(arr: T[], count: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += count) {
    result.push(arr.slice(i, i + count));
  }
  return result;
}

function chunkByChunkCount<T>(arr: T[], chunks: number): T[][] {
  const result: T[][] = [];
  const chunkSize = Math.ceil(arr.length / chunks);
  for (let i = 0; i < arr.length; i += chunkSize) {
    result.push(arr.slice(i, i + chunkSize));
  }
  return result;
}

export function splitContent(
  content: string,
  mode: 'lines' | 'nodes',
  count: number,
  strategy: 'maxSize' | 'fixedCount' | 'chunkCount' = 'maxSize',
): string[] {
  const getChunks = <T>(arr: T[]): T[][] => {
    if (strategy === 'fixedCount') {
      return chunkByFixedCount(arr, count);
    }
    if (strategy === 'chunkCount') {
      return chunkByChunkCount(arr, count);
    }
    return []; // handled separately for maxSize
  };

  if (mode === 'lines') {
    const lines = content.split(/\r?\n/);

    if (strategy === 'maxSize') {
      const result: string[] = [];
      let chunk: string[] = [];
      let size = 0;

      for (const line of lines) {
        const lineSize = line.length + 1;
        if (size + lineSize > count && chunk.length > 0) {
          result.push(chunk.join('\n'));
          chunk = [];
          size = 0;
        }
        chunk.push(line);
        size += lineSize;
      }

      if (chunk.length > 0) {
        result.push(chunk.join('\n'));
      }
      return result;
    }

    return getChunks(lines).map(group => group.join('\n'));
  }

  try {
    const parsed = JSON.parse(content);

    if (Array.isArray(parsed)) {
      if (strategy === 'maxSize') {
        const result: string[] = [];
        let chunk: any[] = [];
        let size = 0;

        for (const item of parsed) {
          const itemStr = JSON.stringify(item);
          const itemSize = itemStr.length + 2;
          if (size + itemSize > count && chunk.length > 0) {
            result.push(JSON.stringify(chunk));
            chunk = [];
            size = 0;
          }
          chunk.push(item);
          size += itemSize;
        }

        if (chunk.length > 0) {
          result.push(JSON.stringify(chunk));
        }
        return result;
      }

      return getChunks(parsed).map(chunk => JSON.stringify(chunk));
    }

    if (typeof parsed === 'object') {
      const entries = Object.entries(parsed);

      if (strategy === 'maxSize') {
        const result: string[] = [];
        let chunk: [string, any][] = [];
        let size = 0;

        for (const [key, value] of entries) {
          const entryStr = JSON.stringify({ [key]: value });
          const entrySize = entryStr.length + 2;
          if (size + entrySize > count && chunk.length > 0) {
            result.push(JSON.stringify(Object.fromEntries(chunk)));
            chunk = [];
            size = 0;
          }
          chunk.push([key, value]);
          size += entrySize;
        }

        if (chunk.length > 0) {
          result.push(JSON.stringify(Object.fromEntries(chunk)));
        }
        return result;
      }

      return getChunks(entries).map(chunk =>
        JSON.stringify(Object.fromEntries(chunk)),
      );
    }
  }
  catch {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(content, 'application/xml');
    const root = xmlDoc.documentElement;
    const children = Array.from(root.children);

    if (strategy === 'maxSize') {
      const result: string[] = [];
      let chunk: Element[] = [];

      for (const child of children) {
        const tempDoc = document.implementation.createDocument('', root.tagName, null);
        chunk.forEach(c => tempDoc.documentElement.appendChild(c.cloneNode(true)));
        tempDoc.documentElement.appendChild(child.cloneNode(true));
        const serialized = new XMLSerializer().serializeToString(tempDoc);
        const chunkSize = serialized.length;

        if (chunkSize > count && chunk.length > 0) {
          const frag = document.implementation.createDocument('', root.tagName, null);
          chunk.forEach(c => frag.documentElement.appendChild(c.cloneNode(true)));
          result.push(new XMLSerializer().serializeToString(frag));
          chunk = [];
        }

        chunk.push(child);
      }

      if (chunk.length > 0) {
        const frag = document.implementation.createDocument('', root.tagName, null);
        chunk.forEach(c => frag.documentElement.appendChild(c.cloneNode(true)));
        result.push(new XMLSerializer().serializeToString(frag));
      }

      return result;
    }

    return getChunks(children).map((group) => {
      const frag = document.implementation.createDocument('', root.tagName, null);
      group.forEach(child => frag.documentElement.appendChild(child.cloneNode(true)));
      return new XMLSerializer().serializeToString(frag);
    });
  }

  throw new Error('Unsupported format or invalid content');
}
