import { Replace } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.uuid-converter.title'),
  path: '/uuid-converter',
  description: t('tools.uuid-converter.description'),
  keywords: ['uuid', 'converter', 'guid', 'sql'],
  component: () => import('./uuid-converter.vue'),
  icon: Replace,
  createdAt: new Date('2023-11-08'),
  category: 'Generators',
});
