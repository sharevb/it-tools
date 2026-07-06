import antfu from '@antfu/eslint-config';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import autoImportGlobals from './.eslintrc-auto-import.json' with { type: 'json' };

const antfuConfig = antfu(
  {
    unocss: true,
    vue: true,
    typescript: true,
    markdown: false,
    ignores: ['src/libs/*'],
  },
  {
    linterOptions: {
      // TODO: re-enable when all eslint-disable comments updated to new rule names
      reportUnusedDisableDirectives: 'off',
    },
    languageOptions: {
      globals: Object.fromEntries(
        Object.keys(autoImportGlobals.globals).map(k => [k, 'readonly']),
      ),
    },
    rules: {
      'curly': ['error', 'all'],
      'style/semi': ['error', 'always'],
      'no-use-before-define': 'off',
      '@typescript-eslint/no-use-before-define': ['error', { allowNamedExports: true, functions: false }],
      'vue/no-empty-component-block': ['error'],
      'import/order': 'off',
      // TODO: enable import/export sorting and formatting gradually in a dedicated PR
      'perfectionist/sort-imports': 'off',
      'perfectionist/sort-named-imports': 'off',
      'perfectionist/sort-named-exports': 'off',
      'import/consistent-type-specifier-style': 'off',
      'antfu/consistent-list-newline': 'off',
      'style/indent-binary-ops': 'off',
      'style/member-delimiter-style': 'off',
      'no-restricted-imports': ['error', {
        paths: [{
          name: '@vueuse/core',
          importNames: ['useClipboard'],
          message: 'Please use local useCopy from src/composable/copy.ts instead of useClipboard.',
        }],
      }],
      // TODO: gradually enable these rules in follow-up PRs once existing
      // violations are fixed — they were newly introduced by @antfu/eslint-config v9
      'regexp/no-unused-capturing-group': 'off',
      'regexp/no-super-linear-backtracking': 'off',
      'regexp/no-misleading-capturing-group': 'off',
      'regexp/optimal-quantifier-concatenation': 'off',
      'regexp/no-useless-assertions': 'off',
      'regexp/no-potentially-useless-backreference': 'off',
      'regexp/no-obscure-range': 'off',
      'regexp/strict': 'off',
      'regexp/no-useless-flag': 'off',
      'regexp/no-empty-lookarounds-assertion': 'off',
      'regexp/no-empty-group': 'off',
      'regexp/no-empty-alternative': 'off',
      'regexp/negation': 'off',
      'regexp/no-dupe-characters-character-class': 'off',
      'regexp/no-trivially-nested-quantifier': 'off',
      'regexp/no-useless-character-class': 'off',
      'regexp/no-useless-escape': 'off',
      'regexp/no-useless-lazy': 'off',
      'regexp/no-useless-non-capturing-group': 'off',
      'regexp/prefer-character-class': 'off',
      'regexp/prefer-d': 'off',
      'regexp/prefer-range': 'off',
      'regexp/prefer-w': 'off',
      'regexp/sort-flags': 'off',
      'regexp/use-ignore-case': 'off',
      'unicorn/prefer-dom-node-text-content': 'off',
      'unicorn/new-for-builtins': 'off',
      'antfu/no-top-level-await': 'off',
      'node/prefer-global/buffer': 'off',
      'ts/method-signature-style': 'off',
      'ts/no-unused-expressions': 'off',
      'ts/no-namespace': 'off',
      'ts/ban-ts-comment': 'off',
      'jsonc/no-dupe-keys': 'off',
      'vue/no-required-prop-with-default': 'off',
      'vue/no-side-effects-in-computed-properties': 'off',
      'vue/return-in-computed-property': 'off',
      '@typescript-eslint/naming-convention': 'off',
      '@typescript-eslint/prefer-ts-expect-error': 'off',
      '@typescript-eslint/no-namespace': 'off',
      'test/no-identical-title': 'off',
      'test/consistent-test-it': 'off',
      'test/prefer-lowercase-title': 'off',
      'no-irregular-whitespace': 'off',
      'style/max-statements-per-line': 'off',
      'style/no-trailing-spaces': 'off',
      'style/type-annotation-spacing': 'off',
      'style/indent': 'off',
      'style/no-tabs': 'off',
      'style/eol-last': 'off',
      'style/quotes': 'off',
      'style/comma-dangle': 'off',
      'style/comma-spacing': 'off',
      'style/key-spacing': 'off',
      'style/object-curly-spacing': 'off',
      'style/space-before-blocks': 'off',
      'style/space-before-function-paren': 'off',
      'style/no-extra-parens': 'off',
      'style/no-multi-spaces': 'off',
      'style/operator-linebreak': 'off',
      'style/quote-props': 'off',
      'style/semi-spacing': 'off',
      'style/generator-star-spacing': 'off',
      'style/jsx-curly-brace-presence': 'off',
      'style/jsx-one-expression-per-line': 'off',
      'style/type-generic-spacing': 'off',
      'jsonc/indent': 'off',
      'jsonc/object-curly-newline': 'off',
      'jsonc/object-curly-spacing': 'off',
      'ts/consistent-type-definitions': 'off',
      'ts/no-import-type-side-effects': 'off',
      'ts/no-wrapper-object-types': 'off',
      'ts/prefer-namespace-keyword': 'off',
      'e18e/prefer-array-some': 'off',
      'e18e/prefer-date-now': 'off',
      'e18e/prefer-nullish-coalescing': 'off',
      'e18e/prefer-object-has-own': 'off',
      'e18e/prefer-regex-test': 'off',
      'antfu/consistent-chaining': 'off',
      'import/newline-after-import': 'off',
      'vue/no-ref-as-operand': 'off',
      'unused-imports/no-unused-vars': ['warn', {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
        caughtErrors: 'none',
      }],
    },
  },
  {
    // Shim .d.ts files use no-semicolon style — don't enforce semi there
    // TODO: align these files to project style in a follow-up PR
    files: ['**/*.d.ts'],
    rules: {
      'style/semi': 'off',
    },
  },
);

// Re-register @typescript-eslint plugin under its legacy name as a standalone
// config entry so inline eslint-disable comments using the old name don't
// produce "Definition not found" errors after @antfu/eslint-config v9 renamed
// the plugin to 'ts/'.
// TODO: migrate all eslint-disable comments in source files to use 'ts/' prefix
export default [
  { plugins: { '@typescript-eslint': tsPlugin } },
  ...await antfuConfig,
];
