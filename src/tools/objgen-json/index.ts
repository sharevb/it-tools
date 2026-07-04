import { translate as t } from '@/plugins/i18n.plugin';
import { Braces } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.objgen-json.title'),
  path: '/objgen-json',
  description: t('tools.objgen-json.description'),
  keywords: ['objgen', 'json', 'toml'],
  component: () => import('./objgen-json.vue'),
  icon: Braces,
  createdAt: new Date('2026-02-14'),
  category: 'JSON',
});
