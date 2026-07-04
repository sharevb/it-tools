import { BrandPhp } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.json-to-php-array.title'),
  path: '/json-to-php-array',
  description: t('tools.json-to-php-array.description'),
  keywords: ['json', 'php', 'array'],
  component: () => import('./json-to-php-array.vue'),
  icon: BrandPhp,
  createdAt: new Date('2024-05-11'),
  category: 'JSON',
});
