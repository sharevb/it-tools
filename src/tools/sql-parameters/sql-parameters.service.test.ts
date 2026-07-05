import { describe, expect, it } from 'vitest';
import { detectTypeAndEscape, generateSQLFromTemplate } from './sql-parameters.service';

describe('detectTypeAndEscape', () => {
  it('should return NULL for null-like values', () => {
    expect(detectTypeAndEscape(null)).toBe('NULL');
    expect(detectTypeAndEscape(undefined)).toBe('NULL');
    expect(detectTypeAndEscape('null')).toBe('NULL');
  });

  it('should detect and return numbers', () => {
    expect(detectTypeAndEscape('42')).toBe(42);
    expect(detectTypeAndEscape('3.14')).toBe(3.14);
  });

  it('should escape and wrap strings in quotes', () => {
    expect(detectTypeAndEscape('O\'Reilly')).toBe('\'O\'\'Reilly\'');
    expect(detectTypeAndEscape('hello')).toBe('\'hello\'');
  });
});

describe('generateSQLFromTemplate', () => {
  it('should replace named parameters correctly', () => {
    const template = 'SELECT * FROM users WHERE name = :name AND age = @age';
    const params = [
      { key: 'name', value: 'O\'Reilly' },
      { key: 'age', value: '42' },
    ];
    const { sql, error } = generateSQLFromTemplate(template, params);
    expect(sql).toBe('SELECT * FROM users WHERE name = \'O\'\'Reilly\' AND age = 42');
    expect(error).toBeNull();
  });

  it('should replace positional parameters correctly', () => {
    const template = 'INSERT INTO products VALUES (?, ?, ?)';
    const params = [
      { key: '0', value: 'Book' },
      { key: '1', value: '19.99' },
      { key: '2', value: 'null' },
    ];
    const { sql, error } = generateSQLFromTemplate(template, params);
    expect(sql).toBe('INSERT INTO products VALUES (\'Book\', 19.99, NULL)');
    expect(error).toBeNull();
  });

  it('should handle escaped question marks', () => {
    const template = 'SELECT * FROM faq WHERE question LIKE \'\\?\' OR answer = ?';
    const params = [{ key: '0', value: '42' }];
    const { sql, error } = generateSQLFromTemplate(template, params);
    expect(sql).toBe('SELECT * FROM faq WHERE question LIKE \'?\' OR answer = 42');
    expect(error).toBeNull();
  });

  it('should return error for missing named parameter', () => {
    const template = 'SELECT * FROM users WHERE name = :name';
    const params: Array<{ key: string; value: string }> = [];
    const { sql, error } = generateSQLFromTemplate(template, params);
    expect(sql).toBe('');
    expect(error).toContain('Missing value for named parameter');
  });

  it('should return error for missing positional parameter', () => {
    const template = 'SELECT * FROM items WHERE id = ? AND price = ?';
    const params = [{ key: '0', value: '1' }];
    const { sql, error } = generateSQLFromTemplate(template, params);
    expect(sql).toBe('');
    expect(error).toContain('Missing value for positional parameter');
  });
});
