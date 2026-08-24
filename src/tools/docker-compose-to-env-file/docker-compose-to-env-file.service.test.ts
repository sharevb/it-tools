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
    expect(result).to.deep.eq({
      dotenv: `# web
PORT=3000
DEBUG=true

# db
POSTGRES_USER=admin
POSTGRES_PASSWORD=secret
`,
      updatedCompose: `services:
  web:
    environment:
      - PORT=\${PORT}
      - DEBUG=\${DEBUG}
  db:
    environment:
      - POSTGRES_USER=\${POSTGRES_USER}
      - POSTGRES_PASSWORD=\${POSTGRES_PASSWORD}
`,
    });
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
    expect(result).to.deep.eq({
      dotenv: `# api
NODE_ENV=production
API_KEY=abc123
`,
      updatedCompose: `services:
  api:
    environment:
      - NODE_ENV=\${NODE_ENV}
      - API_KEY=\${API_KEY}
`,
    });
  });

  it('handles with already existing environment variables', () => {
    const yaml = `
services:
  api:
    environment:
      NODE_ENV: \${NODE_ENV}
      API_KEY: abc123
`;
    const result = extractEnvFromCompose(yaml);
    expect(result).to.deep.eq({
      dotenv: `# api
API_KEY=abc123
`,
      updatedCompose: `services:
  api:
    environment:
      - NODE_ENV=\${NODE_ENV}
      - API_KEY=\${API_KEY}
`,
    });
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
    expect(result).to.deep.eq({
      dotenv: `# mixed
FOO=bar
EMPTY=
FOO3=null

# obj
BAR=baz
FOO2=
`,
      updatedCompose: `services:
  mixed:
    environment:
      - FOO=\${FOO}
      - EMPTY=\${EMPTY}
      - FOO3=\${FOO3}
  obj:
    environment:
      - BAR=\${BAR}
      - FOO2=\${FOO2}
`,
    });
  });

  it('returns empty string if no env vars', () => {
    const yaml = `
services:
  noenv:
    image: nginx
`;
    const result = extractEnvFromCompose(yaml);
    expect(result).to.deep.eq({
      dotenv: '',
      updatedCompose: `services:
  noenv:
    image: nginx
`,
    });
  });

  it('handles empty input gracefully', () => {
    const result = extractEnvFromCompose('');
    expect(result).to.deep.eq({
      dotenv: '',
      updatedCompose: '',
    });
  });
});
