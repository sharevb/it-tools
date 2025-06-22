import { Binary } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.hex-converter.title'),
  path: '/hex-converter',
  description: translate('tools.hex-converter.description'),
  keywords: ['hex', 'encode', 'decode', 'endianess', 'float', 'bits', 'hex', 'struct'],
  component: () => import('./hex-converter.vue'),
  icon: Binary,
  createdAt: new Date('2025-02-09'),
  category: 'Forensic',
});
