import { Binary } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.hex-converter.title'),
  path: '/hex-converter',
  description: t('tools.hex-converter.description'),
  keywords: ['hex', 'encode', 'decode', 'endianess', 'float', 'bits', 'hex', 'struct'],
  component: () => import('./hex-converter.vue'),
  icon: Binary,
  createdAt: new Date('2025-02-09'),
  category: 'Forensic',
});
