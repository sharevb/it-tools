import { World } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.dmarc-report-analyzer.title'),
  path: '/dmarc-report-analyzer',
  description: translate('tools.dmarc-report-analyzer.description'),
  keywords: ['dmarc', 'report', 'analyzer'],
  component: () => import('./dmarc-report-analyzer.vue'),
  icon: World,
  createdAt: new Date('2025-03-09'),
  category: 'Forensic',
});
