import { defineConfig } from 'oxfmt';

export default defineConfig({
  printWidth: 120,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
  arrowParens: 'always',
  endOfLine: 'lf',
  ignorePatterns: [
    'src/libs/**',
    'dist/**',
    'coverage/**',
    'auto-imports.d.ts',
    'components.d.ts',
    'pnpm-lock.yaml',
  ],
});
