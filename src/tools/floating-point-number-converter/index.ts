import { ArrowsLeftRight } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.floating-point-converter.title'),
  path: '/floating-point-converter',
  description: t('tools.floating-point-converter.description'),
  keywords: ['converter', 'floating', 'point', 'number', 'converter', 'binary', 'decimal'],
  component: () => import('./floating-point-number-converter.vue'),
  icon: ArrowsLeftRight,
  createdAt: new Date('2024-10-12'),
  category: 'Forensic',
});
