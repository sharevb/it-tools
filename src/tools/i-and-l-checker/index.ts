import { LettersCase } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.i-and-l-checker.title'),
  path: '/i-and-l-checker',
  description: t('tools.i-and-l-checker.description'),
  keywords: ['ambiguous', 'text', 'letters', 'password', 'checker'],
  component: () => import('./i-and-l-checker.vue'),
  icon: LettersCase,
  createdAt: new Date('2025-11-08'),
  category: 'Text',
});
