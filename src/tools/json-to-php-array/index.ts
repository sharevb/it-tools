import { BrandPhp } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.json-to-php-array.title'),
  path: '/json-to-php-array',
  description: translate('tools.json-to-php-array.description'),
  keywords: ['json', 'php', 'array'],
  component: () => import('./json-to-php-array.vue'),
  icon: BrandPhp,
  createdAt: new Date('2024-05-11'),
  category: 'JSON',
});
