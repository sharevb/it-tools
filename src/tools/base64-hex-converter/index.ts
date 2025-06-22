import { FileDigit } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.base64-hex-converter.title'),
  path: '/base64-hex-converter',
  description: translate('tools.base64-hex-converter.description'),
  keywords: ['base64', 'converter', 'conversion', 'web', 'data', 'format', 'atob', 'btoa', 'hex'],
  component: () => import('./base64-hex-converter.vue'),
  icon: FileDigit,
  createdAt: new Date('2025-02-09'),
  category: 'Converters',
});
