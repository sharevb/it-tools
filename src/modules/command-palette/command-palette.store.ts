import { defineStore } from 'pinia';
import * as _ from 'es-toolkit/compat';
import type { PaletteOption } from './command-palette.types';
import { useToolStore } from '@/tools/tools.store';
import { useStyleStore } from '@/stores/style.store';

import SunIcon from '~icons/mdi/white-balance-sunny';
import GithubIcon from '~icons/mdi/github';
import BugIcon from '~icons/mdi/bug-outline';
import DiceIcon from '~icons/mdi/dice-5';
import InfoIcon from '~icons/mdi/information-outline';
import { useFlexSearch } from '@/composable/flexSearch';

import { translate as t } from '@/plugins/i18n.plugin';

const maxSearchResultsPerCategory = import.meta.env.VITE_MAX_SEARCH_RESULT || 25;

export const useCommandPaletteStore = (locale: string) =>
  defineStore(`command-palette-${locale}`, () => {
    const toolStore = useToolStore();
    const styleStore = useStyleStore();
    const router = useRouter();
    const searchPrompt = ref('');

    const toolsOptions = toolStore.tools.map((tool) => ({
      ...tool,
      to: tool.path,
      toolCategory: tool.category,
      category: t('tools.command-palette.store.texts.tools'),
    }));

    const searchOptions: PaletteOption[] = [
      ...toolsOptions,
      {
        name: t('tools.command-palette.store.texts.random-tool'),
        description: t('tools.command-palette.store.texts.get-a-random-tool-from-the-list'),
        action: () => {
          const { path } = _.sample(toolStore.tools)!;
          router.push(path);
        },
        icon: DiceIcon,
        category: t('tools.command-palette.store.texts.tools-0'),
        keywords: ['random', 'tool', 'pick', 'choose', 'select'],
        closeOnSelect: true,
      },
      {
        name: t('tools.command-palette.store.texts.toggle-dark-mode'),
        description: t('tools.command-palette.store.texts.toggle-dark-mode-on-or-off'),
        action: () => styleStore.toggleDark(),
        icon: SunIcon,
        category: t('tools.command-palette.store.texts.actions'),
        keywords: ['dark', 'theme', 'toggle', 'mode', 'light', 'system'],
      },
      {
        name: t('tools.command-palette.store.texts.github-repository'),
        href: 'https://github.com/sharevb/it-tools',
        category: t('tools.command-palette.store.texts.external'),
        description: t('tools.command-palette.store.texts.view-the-source-code-of-it-tools-on-github'),
        keywords: ['github', 'repo', 'repository', 'source', 'code'],
        icon: GithubIcon,
      },
      {
        name: t('tools.command-palette.store.texts.report-a-bug-or-an-issue'),
        description: t('tools.command-palette.store.texts.report-a-bug-or-an-issue-to-help-improve-it-tools'),
        href: 'https://github.com/sharevb/it-tools/issues/new/choose',
        category: t('tools.command-palette.store.texts.actions-0'),
        keywords: ['report', 'issue', 'bug', 'problem', 'error'],
        icon: BugIcon,
      },
      {
        name: t('tools.pomodoro-timer.PomodoroApp.text.about'),
        description: t('tools.command-palette.store.texts.learn-more-about-it-tools'),
        to: '/about',
        category: t('tools.command-palette.store.texts.pages'),
        keywords: ['about', 'learn', 'more', 'info', 'information'],
        icon: InfoIcon,
      },
    ];

    const { searchResult } = useFlexSearch({
      search: searchPrompt,
      data: searchOptions,
      options: {
        keys: [{ name: 'name', weight: 2 }, 'description', 'keywords', 'category'],
      },
    });

    const filteredSearchResult = computed(() =>
      _.mapValues(
        _.groupBy(searchResult.value, (option) => option.category),
        (categoryOptions) => categoryOptions.slice(0, maxSearchResultsPerCategory),
      ),
    );

    return {
      filteredSearchResult,
      searchPrompt,
    };
  })();
