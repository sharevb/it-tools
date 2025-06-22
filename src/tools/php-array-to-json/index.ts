import { BrandPhp } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.php-array-to-json.title'),
  path: '/php-array-to-json',
  description: translate('tools.php-array-to-json.description'),
  keywords: ['php', 'array', 'json'],
  component: () => import('./php-array-to-json.vue'),
  icon: BrandPhp,
  createdAt: new Date('2024-05-11'),
  category: 'JSON',
});
