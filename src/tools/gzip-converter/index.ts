import { FileZip } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.gzip-converter.title'),
  path: '/gzip-converter',
  description: t('tools.gzip-converter.description'),
  keywords: ['gzip', 'deflate', 'converter'],
  component: () => import('./gzip-converter.vue'),
  icon: FileZip,
  createdAt: new Date('2024-03-09'),
  category: 'Forensic',
});
