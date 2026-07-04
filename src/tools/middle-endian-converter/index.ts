import { Binary } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.middle-endian-converter.title'),
  path: '/middle-endian-converter',
  description: t('tools.middle-endian-converter.description'),
  keywords: ['middle', 'endian', 'converter'],
  component: () => import('./middle-endian-converter.vue'),
  icon: Binary,
  createdAt: new Date('2025-08-15'),
  category: 'Forensic',
});
