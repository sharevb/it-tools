import { ArrowsLeftRight } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.data-storage-unit-converter.title'),
  path: '/data-storage-unit-converter',
  description: t('tools.data-storage-unit-converter.description'),
  keywords: ['data', 'storage', 'unit', 'conversion',
    'bits', 'bytes', 'bibytes', 'binary',
    'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB',
    'B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB',
    'b', 'Kb', 'Mb', 'Gb', 'Tb', 'Pb', 'Eb', 'Zb', 'Yb',
    'units'],
  component: () => import('./data-storage-unit-converter.vue'),
  icon: ArrowsLeftRight,
  createdAt: new Date('2024-08-15'),
  category: 'Converters',
});
