import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.mac-address-lookup.title'),
  path: '/mac-address-lookup',
  description: t('tools.mac-address-lookup.description'),
  keywords: ['mac', 'address', 'lookup', 'vendor', 'parser', 'manufacturer'],
  component: () => import('./mac-address-lookup.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/Devices')),
  createdAt: new Date('2023-04-06'),
  npmPackages: ['oui-data'],
  category: 'Network',
});
