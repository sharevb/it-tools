import { describe, expect, it } from 'vitest';
import { extractEnvFromCompose } from './docker-compose-to-env-file.service';

describe('extractEnvFromCompose', () => {
  it('handles array format', () => {
    const yaml = `
services:
  web:
    environment:
      - PORT=3000
      - DEBUG=true
  db:
    environment:
      - POSTGRES_USER=admin
      - POSTGRES_PASSWORD=secret
`;
    const result = extractEnvFromCompose(yaml);
    expect(result).toContain('# web');
    expect(result).toContain('PORT=3000');
    expect(result).toContain('DEBUG=true');
    expect(result).toContain('# db');
    expect(result).toContain('POSTGRES_USER=admin');
    expect(result).toContain('POSTGRES_PASSWORD=secret');
  });

  it('handles object format', () => {
    const yaml = `
services:
  api:
    environment:
      NODE_ENV: production
      API_KEY: abc123
`;
    const result = extractEnvFromCompose(yaml);
    expect(result).toContain('# api');
    expect(result).toContain('NODE_ENV=production');
    expect(result).toContain('API_KEY=abc123');
  });

  it('handles mixed formats and null values', () => {
    const yaml = `
services:
  mixed:
    environment:
      - FOO=bar
      - EMPTY=
      - FOO3=null
  obj:
    environment:
      BAR: baz
      FOO2: null
`;
    const result = extractEnvFromCompose(yaml);
    expect(result).toContain('# mixed');
    expect(result).toContain('FOO=bar');
    expect(result).toContain('EMPTY=');
    expect(result).toContain('# obj');
    expect(result).toContain('BAR=baz');
    expect(result).toContain('FOO2=');
    expect(result).toContain('FOO3=');
  });

  it('returns empty string if no env vars', () => {
    const yaml = `
services:
  noenv:
    image: nginx
`;
    const result = extractEnvFromCompose(yaml);
    expect(result).toBe('');
  });

  it('handles empty input gracefully', () => {
    const result = extractEnvFromCompose('');
    expect(result).toBe('');
  });
});
