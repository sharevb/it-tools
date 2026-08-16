import { defineConfig } from 'oxlint';

export default defineConfig({
  plugins: ['eslint', 'typescript', 'oxc', 'unicorn', 'import', 'promise', 'vue', 'vitest'],
  categories: {
    correctness: 'error',
  },
  // Type-aware rules run through oxlint-tsgolint, which ships its own checker
  // binary, so this does not depend on the project's TypeScript version.
  // Note it only analyses .ts files -- .vue script blocks are covered by
  // `pnpm typecheck` (vue-tsc) instead.
  options: {
    typeAware: true,
  },
  env: {
    browser: true,
    es2026: true,
  },
  globals: {
    process: 'readonly',
  },
  ignorePatterns: [
    'src/libs/**',
    'dist/**',
    'coverage/**',
    'auto-imports.d.ts',
    'components.d.ts',
  ],
  rules: {
    'eslint/curly': ['error', 'all'],
    'typescript/no-use-before-define': [
      'error',
      { allowNamedExports: true, functions: false },
    ],
    'eslint/no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: '@vueuse/core',
            importNames: ['useClipboard'],
            message: 'Please use local useCopy from src/composable/copy.ts instead of useClipboard.',
          },
        ],
      },
    ],
    'no-undef': 'off',
    'eslint/no-unused-vars': [
      'error',
      { caughtErrors: 'none', varsIgnorePattern: '^_', argsIgnorePattern: '^_' },
    ],
    'eslint/no-useless-escape': 'off',

    // Staged as warnings while the existing findings are worked through, so
    // they surface without failing the build. Promote to "error" per rule as
    // each one reaches zero.
    'typescript/await-thenable': 'warn',
    'typescript/no-base-to-string': 'warn',
    'typescript/no-duplicate-type-constituents': 'warn',
    'typescript/no-floating-promises': 'warn',
    'typescript/no-for-in-array': 'warn',
    'typescript/no-misused-spread': 'warn',
    'typescript/no-redundant-type-constituents': 'warn',
    'typescript/no-useless-default-assignment': 'warn',
    'typescript/restrict-template-expressions': 'warn',
    'typescript/unbound-method': 'warn',

    'import/default': 'off',
    'vue/no-dupe-keys': 'off',
    'vitest/valid-expect': 'off',
    'vitest/expect-expect': 'off',
    'vitest/require-to-throw-message': 'off',
  },
  overrides: [
    {
      files: ['**/*.test.ts', '**/*.spec.ts', '**/*.e2e.spec.ts'],
      env: { vitest: true },
    },
    {
      files: ['**/calendar-converter/calendar-converter.service.ts'],
      rules: {
        'eslint/no-unused-vars': 'off',
        'oxc/erasing-op': 'off',
      },
    },
  ],
});
