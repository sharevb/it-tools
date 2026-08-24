import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.gzip-converter.title'),
  path: '/gzip-converter',
  description: t('tools.gzip-converter.description'),
  keywords: ['gzip', 'deflate', 'converter'],
  component: () => import('./gzip-converter.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/FileZip')),
  createdAt: new Date('2024-03-09'),
  category: 'Forensic',
});
