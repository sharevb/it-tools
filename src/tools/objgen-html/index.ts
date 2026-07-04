import { translate as t } from '@/plugins/i18n.plugin';
import { Brackets } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.objgen-html.title'),
  path: '/objgen-html',
  description: t('tools.objgen-html.description'),
  keywords: ['objgen', 'html', 'toml'],
  component: () => import('./objgen-html.vue'),
  icon: Brackets,
  createdAt: new Date('2026-02-14'),
  category: 'XML',
});
