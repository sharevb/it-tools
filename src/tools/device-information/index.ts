import { DeviceDesktop } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.device-information.title'),
  path: '/device-information',
  description: t('tools.device-information.description'),
  keywords: [
    'device',
    'information',
    'screen',
    'pixel',
    'ratio',
    'status',
    'data',
    'computer',
    'size',
    'user',
    'agent',
  ],
  component: () => import('./device-information.vue'),
  icon: DeviceDesktop,
  category: 'Web',
});
