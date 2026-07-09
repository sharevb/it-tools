import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.ip-geo-location.title'),
  path: '/ip-geo-location',
  description: t('tools.ip-geo-location.description'),
  keywords: ['ip', 'domain', 'geo', 'location'],
  component: () => import('./ip-geo-location.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/World')),
  createdAt: new Date('2024-01-17'),
  category: 'Network',
  externAccessDescription: t('tools.ip-geo-location.externalAccess'),
});
