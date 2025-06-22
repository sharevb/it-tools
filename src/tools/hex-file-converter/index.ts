import { FileDigit } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.hex-file-converter.title'),
  path: '/hex-file-converter',
  description: translate('tools.hex-file-converter.description'),
  keywords: ['hex', 'file', 'converter'],
  component: () => import('./hex-file-converter.vue'),
  icon: FileDigit,
  createdAt: new Date('2024-08-15'),
  category: 'Development',
});
