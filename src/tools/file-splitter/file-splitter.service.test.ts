import { describe, expect, it } from 'vitest';
import { splitContent } from './file-splitter.service';

describe('splitContent - lines mode', () => {
  const content = 'a\nb\nc\nd\ne';

  it('splits by maxSize', () => {
    const result = splitContent(content, 'lines', 6, 'maxSize');
    expect(result).toEqual(['a\nb\nc', 'd\ne']);
  });

  it('splits by fixedCount', () => {
    const result = splitContent(content, 'lines', 2, 'fixedCount');
    expect(result).toEqual(['a\nb', 'c\nd', 'e']);
  });

  it('splits by chunkCount', () => {
    const result = splitContent(content, 'lines', 2, 'chunkCount');
    expect(result).toEqual(['a\nb\nc', 'd\ne']);
  });
});

describe('splitContent - nodes mode with JSON array', () => {
  const jsonArray = JSON.stringify([1, 2, 3, 4, 5]);

  it('splits by maxSize', () => {
    const result = splitContent(jsonArray, 'nodes', 6, 'maxSize');
    expect(result).toEqual(['[1,2]', '[3,4]', '[5]']);
  });

  it('splits by fixedCount', () => {
    const result = splitContent(jsonArray, 'nodes', 3, 'fixedCount');
    expect(result).toEqual(['[1,2,3]', '[4,5]']);
  });

  it('splits by chunkCount', () => {
    const result = splitContent(jsonArray, 'nodes', 4, 'chunkCount');
    expect(result).toEqual(['[1,2]', '[3,4]', '[5]']);
  });
});

describe('splitContent - nodes mode with JSON object', () => {
  const jsonObject = JSON.stringify({ a: 1, b: 2, c: 3, d: 4 });

  it('splits by maxSize', () => {
    const result = splitContent(jsonObject, 'nodes', 14, 'maxSize');
    expect(result).toEqual([
      '{"a":1}',
      '{"b":2}',
      '{"c":3}',
      '{"d":4}',
    ]);
  });

  it('splits by fixedCount', () => {
    const result = splitContent(jsonObject, 'nodes', 3, 'fixedCount');
    expect(result).toEqual(['{"a":1,"b":2,"c":3}', '{"d":4}']);
  });

  it('splits by chunkCount', () => {
    const result = splitContent(jsonObject, 'nodes', 2, 'chunkCount');
    expect(result).toEqual(['{"a":1,"b":2}', '{"c":3,"d":4}']);
  });
});

describe('splitContent - nodes mode with XML', () => {
  const xml = '<root><a>1</a><b>2</b><c>3</c><d>4</d></root>';

  it('splits by maxSize', () => {
    const result = splitContent(xml, 'nodes', 30, 'maxSize');
    expect(result).toEqual([
      '<root><a>1</a><b>2</b></root>',
      '<root><c>3</c><d>4</d></root>',
    ]);
  });

  it('splits by fixedCount', () => {
    const result = splitContent(xml, 'nodes', 3, 'fixedCount');
    expect(result).toEqual([
      '<root><a>1</a><b>2</b><c>3</c></root>',
      '<root><d>4</d></root>',
    ]);
  });

  it('splits by chunkCount', () => {
    const result = splitContent(xml, 'nodes', 4, 'chunkCount');
    expect(result).toEqual([
      '<root><a>1</a></root>',
      '<root><b>2</b></root>',
      '<root><c>3</c></root>',
      '<root><d>4</d></root>',
    ]);
  });
});
