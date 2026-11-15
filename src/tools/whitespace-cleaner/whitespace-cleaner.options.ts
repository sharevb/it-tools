import type { CleanerOptions } from './whitespace-cleaner.service';

import { translate as t } from '@/plugins/i18n.plugin';

export interface OptionDefinition {
  key: keyof CleanerOptions;
  label: string;
  hint: string;
  defaultValue: boolean;
}

// The chips appear in this order. The cleaner core runs its steps in its own fixed order.
export const OPTION_DEFINITIONS: readonly OptionDefinition[] = [
  {
    key: 'stripLineNumbers',
    label: t('tools.whitespace-cleaner.options.texts.line-numbers'),
    hint: t('tools.whitespace-cleaner.options.texts.strip-1-2-1-t-prefixes'),
    defaultValue: true,
  },
  {
    key: 'removeAnsi',
    label: t('tools.whitespace-cleaner.options.texts.ansi-codes'),
    hint: t('tools.whitespace-cleaner.options.texts.strip-color-escape-sequences'),
    defaultValue: true,
  },
  {
    key: 'stripBoxDrawing',
    label: t('tools.whitespace-cleaner.options.texts.box-drawing'),
    hint: t('tools.whitespace-cleaner.options.texts.remove-characters'),
    defaultValue: true,
  },
  {
    key: 'stripBulletMarkers',
    label: t('tools.whitespace-cleaner.options.texts.bullet-markers'),
    hint: t('tools.whitespace-cleaner.options.texts.strip-prefixes'),
    defaultValue: true,
  },
  {
    key: 'trimTrailing',
    label: t('tools.whitespace-cleaner.options.texts.trailing-space'),
    hint: t('tools.whitespace-cleaner.options.texts.remove-end-of-line-whitespace'),
    defaultValue: true,
  },
  {
    key: 'collapseBlankLines',
    label: t('tools.whitespace-cleaner.options.texts.blank-lines'),
    hint: t('tools.whitespace-cleaner.options.texts.collapse-2-blank-lines-into-1'),
    defaultValue: true,
  },
  {
    key: 'normalizeIndent',
    label: t('tools.whitespace-cleaner.options.texts.indent'),
    hint: t('tools.whitespace-cleaner.options.texts.remove-common-leading-indent'),
    defaultValue: true,
  },
  {
    key: 'removeDiffMarkers',
    label: t('tools.whitespace-cleaner.options.texts.diff-markers'),
    hint: t('tools.whitespace-cleaner.options.texts.strip-from-patches'),
    defaultValue: false,
  },
  {
    key: 'smartUnwrap',
    label: t('tools.whitespace-cleaner.options.texts.smart-unwrap'),
    hint: t('tools.whitespace-cleaner.options.texts.join-soft-wrapped-paragraphs'),
    defaultValue: false,
  },
  {
    key: 'markdownMode',
    label: t('tools.whitespace-cleaner.options.texts.markdown-reddit'),
    hint: t('tools.whitespace-cleaner.options.texts.left-trim-lines-and-rejoin-paragraphs-for-reddit-discord-slack'),
    defaultValue: false,
  },
  {
    key: 'unifyLineEndings',
    label: t('tools.whitespace-cleaner.options.texts.lf-endings'),
    hint: t('tools.whitespace-cleaner.options.texts.convert-crlf-lf'),
    defaultValue: true,
  },
];

export const OPTIONS_STORAGE_KEY = 'whitespace-cleaner.options.v1';

export function getDefaultOptions(): CleanerOptions {
  return Object.fromEntries(
    OPTION_DEFINITIONS.map(({ key, defaultValue }) => [key, defaultValue]),
  ) as unknown as CleanerOptions;
}

// Merges the saved options over the defaults.
// Unknown keys and non-boolean values are ignored. Missing keys keep their default.
export function loadOptions(storage: Pick<Storage, 'getItem'> | undefined): CleanerOptions {
  const options = getDefaultOptions();

  try {
    const raw = storage?.getItem(OPTIONS_STORAGE_KEY);
    if (!raw) {
      return options;
    }

    const saved: unknown = JSON.parse(raw);
    if (typeof saved !== 'object' || saved === null || Array.isArray(saved)) {
      return options;
    }

    for (const { key } of OPTION_DEFINITIONS) {
      const value = (saved as Record<string, unknown>)[key];
      if (typeof value === 'boolean') {
        options[key] = value;
      }
    }

    return options;
  } catch {
    return getDefaultOptions();
  }
}

export function saveOptions(storage: Pick<Storage, 'setItem'> | undefined, options: CleanerOptions): void {
  try {
    storage?.setItem(OPTIONS_STORAGE_KEY, JSON.stringify(options));
  } catch {
    // A failed write only loses the saved options. The cleaner keeps working.
  }
}

// Reading `window.localStorage` throws when the browser blocks site data.
export function getBrowserStorage(): Storage | undefined {
  try {
    return window.localStorage;
  } catch {
    return undefined;
  }
}
