import { describe, expect, it } from 'vitest';
import yaml from 'yaml';
import type { ExportFormat } from './objectarray.export';
import { objectArrayToData } from './objectarray.export';

describe('objectArrayToData', () => {
  const sampleData = [
    { id: 1, name: 'Alice', age: 25 },
    { id: 2, name: 'Bob', age: 30 },
  ];
  const sampleNestedData = [
    { 'id': 1, 'info.name': 'Alice', 'info.age': 25 },
    { 'id': 2, 'info.name': 'Bob', 'info.age': 30 },
  ];
  const tableName = 'users';

  it('should export JSON format correctly', () => {
    const result = objectArrayToData(sampleData, 'json', { tableName });
    expect(result).toBe(JSON.stringify(sampleData, null, 2));
  });

  it('should export YAML format correctly', () => {
    const result = objectArrayToData(sampleData, 'yaml', { tableName });
    expect(result).toBe(yaml.stringify(sampleData));
  });

  it('should export SQL format correctly', () => {
    const result = objectArrayToData(sampleData, 'sql', { tableName });
    expect(result).toBe(`INSERT INTO users (id, name, age) VALUES (1, 'Alice', 25);
INSERT INTO users (id, name, age) VALUES (2, 'Bob', 30);`);
  });

  it('should export XML format correctly', () => {
    const result = objectArrayToData(sampleData, 'xml', { tableName });
    expect(result).toBe('<root><id>1</id><name>Alice</name><age>25</age></root><root><id>2</id><name>Bob</name><age>30</age></root>');
  });

  it('should export CSV format correctly', () => {
    const result = objectArrayToData(sampleData, 'csv', { tableName });
    expect(result).toContain('"id","name","age"');
    expect(result).toContain('"1","Alice","25"');
    expect(result).toContain('"2","Bob","30"');
  });

  it('should export Markdown format correctly', () => {
    const result = objectArrayToData(sampleData, 'markdown', { tableName });
    expect(result).toContain('| id | name | age |');
    expect(result).toContain('| --- | --- | --- |');
    expect(result).toContain('| 1 | Alice | 25 |');
    expect(result).toContain('| 2 | Bob | 30 |');
  });

  it('should export nested JSON format correctly', () => {
    const result = objectArrayToData(sampleNestedData, 'json', { tableName, nestify: true });
    expect(result).toBe(`[
  {
    \"id\": 1,
    \"info\": {
      \"name\": \"Alice\",
      \"age\": 25
    }
  },
  {
    \"id\": 2,
    \"info\": {
      \"name\": \"Bob\",
      \"age\": 30
    }
  }
]`);
  });

  it('should export nested YAML format correctly', () => {
    const result = objectArrayToData(sampleNestedData, 'yaml', { tableName, nestify: true });
    expect(result).toBe(`- id: 1
  info:
    name: Alice
    age: 25
- id: 2
  info:
    name: Bob
    age: 30
`);
  });

  it('should return empty string for unknown format', () => {
    const result = objectArrayToData(sampleData, 'unknown' as ExportFormat, { tableName });
    expect(result).toBe('');
  });
});
