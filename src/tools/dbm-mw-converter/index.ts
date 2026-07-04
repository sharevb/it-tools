import { DeviceAudioTape } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.dbm-mw-converter.title'),
  path: '/dbm-mw-converter',
  description: t('tools.dbm-mw-converter.description'),
  keywords: ['dbm', 'mw', 'converter', 'units'],
  component: () => import('./dbm-mw-converter.vue'),
  icon: DeviceAudioTape,
  createdAt: new Date('2025-10-03'),
  category: 'Converters',
});
