import { Ad } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.utm-url-generator.title'),
  path: '/utm-url-generator',
  description: translate('tools.utm-url-generator.description'),
  keywords: ['utm', 'url', 'generator'],
  component: () => import('./utm-url-generator.vue'),
  icon: Ad,
  createdAt: new Date('2024-03-15'),
  category: 'Web',
});
