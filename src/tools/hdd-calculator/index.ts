import { DeviceDesktop } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.hdd-calculator.title'),
  path: '/hdd-calculator',
  description: t('tools.hdd-calculator.description'),
  keywords: ['hdd', 'calculator', 'size', 'conversion', 'binary', 'decimal',
    'gb', 'mb', 'tb',
    'gigabyte', 'gibibyte', 'megabyte', 'mebibyte', 'terabyte', 'tebibyte'],
  component: () => import('./hdd-calculator.vue'),
  icon: DeviceDesktop,
  createdAt: new Date('2024-04-07'),
  category: 'Network',
});
