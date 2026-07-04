import { Code } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.html-entities.title'),
  path: '/html-entities',
  description: t('tools.html-entities.description'),
  keywords: ['html', 'entities', 'escape', 'unescape', 'special', 'characters', 'tags'],
  component: () => import('./html-entities.vue'),
  icon: Code,
  category: 'Web',
});
