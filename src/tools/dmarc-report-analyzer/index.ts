import { World } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.dmarc-report-analyzer.title'),
  path: '/dmarc-report-analyzer',
  description: t('tools.dmarc-report-analyzer.description'),
  keywords: ['dmarc', 'report', 'analyzer'],
  component: () => import('./dmarc-report-analyzer.vue'),
  icon: World,
  createdAt: new Date('2025-03-09'),
  category: 'Forensic',
});
