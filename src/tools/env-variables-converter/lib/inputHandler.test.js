import { describe, expect, it } from 'vitest';
import { Formats } from './formats';
import inputHandler from './inputHandler';

describe('inputHandler', () => {
  it('simplifies input', () => {
    const input = `            - name: SPRING_CACHE_TYPE 
    value: redis
  - name: SPRING_REDIS_SSL
    value: true`;
    expect(inputHandler(Formats.KUBERNETES, input)).toStrictEqual({
      SPRING_CACHE_TYPE: 'redis',
      SPRING_REDIS_SSL: 'true',
    });
  });

  // https://stackoverflow.com/a/21699210/1098564
  it('simplifies input quotations', () => {
    const input = `
  - name: SPRING_CACHE_TYPE 
    value: redis
  - name: >-
      SPRING_REDIS_SSL
    value: don't
  - name: >-
      SPRING_REDIS_SSL1
    value: "don't"
  - name: >-
      SPRING_REDIS_SSL2
    value: >-
      don't
      - name: >-
      SPRING_REDIS_SSL3
    value: 'redis'`;

    expect(inputHandler(Formats.KUBERNETES, input)).toStrictEqual({
      SPRING_CACHE_TYPE: 'redis',
      SPRING_REDIS_SSL: "don't",
      SPRING_REDIS_SSL1: "don't",
      SPRING_REDIS_SSL2: "don't",
      SPRING_REDIS_SSL3: 'redis',
    });
  });

  it('simplifies input properties quotes', () => {
    const input = `foo-bar.baz[0]=value1
foo-bar.baz[1]=value2
foo-bar.enabled=true
abcDef=value3
`;
    expect(inputHandler(Formats.PROPERTIES, input)).toStrictEqual({
      abcDef: 'value3',
      'foo-bar': { baz: ['value1', 'value2'], enabled: 'true' },
    });
  });
});
