import { FileZip } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.gzip-converter.title'),
  path: '/gzip-converter',
  description: translate('tools.gzip-converter.description'),
  keywords: ['gzip', 'deflate', 'converter'],
  component: () => import('./gzip-converter.vue'),
  icon: FileZip,
  createdAt: new Date('2024-03-09'),
  category: 'Forensic',
});
