import { Wifi } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.wpa-psk-generator.title'),
  path: '/wpa-psk-generator',
  description: translate('tools.wpa-psk-generator.description'),
  keywords: ['wpa', 'psk', 'pre', 'shared', 'key', 'ssid', 'passphrase', 'generator'],
  component: () => import('./wpa-psk-generator.vue'),
  icon: Wifi,
  createdAt: new Date('2024-08-15'),
  category: 'Network',
});
