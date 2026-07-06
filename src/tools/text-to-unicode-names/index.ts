import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.text-to-unicode-names.title'),
  path: '/text-to-unicode-names',
  description: t('tools.text-to-unicode-names.description'),
  keywords: ['text', 'unicode', 'name', 'hexa', 'char', 'code'],
  component: () => import('./text-to-unicode-names.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/LanguageHiragana')),
  createdAt: new Date('2024-06-10'),
  category: 'Text',
});
