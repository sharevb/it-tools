import { World } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.my-ip.title'),
  path: '/my-ip',
  description: t('tools.my-ip.description'),
  keywords: ['my', 'client', 'ip'],
  component: () => import('./my-ip.vue'),
  icon: World,
  createdAt: new Date('2025-01-01'),
  category: 'Network',
  externAccessDescription: t('tools.my-ip.externalAccess'),
});
