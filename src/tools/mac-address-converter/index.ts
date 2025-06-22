import { Devices } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.mac-address-converter.title'),
  path: '/mac-address-converter',
  description: translate('tools.mac-address-converter.description'),
  keywords: [
    'converter',
    'mac',
    'address',
    'format',
    'link-local',
    'ipv6',
    'eui-48',
    'eui-64',
  ],
  component: () => import('./mac-address-converter.vue'),
  icon: Devices,
  category: 'Network',
});
