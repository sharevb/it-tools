import { translate as t } from '@/plugins/i18n.plugin';
import { WorldUpload } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.visual-subnet-calculator.title'),
  path: '/visual-subnet-calculator',
  description: t('tools.visual-subnet-calculator.description'),
  keywords: ['visual', 'subnet', 'network', 'calculator'],
  component: () => import('./visual-subnet-calculator.vue'),
  icon: WorldUpload,
  createdAt: new Date('2026-03-15'),
  category: 'Network',
});
