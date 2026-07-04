import { SpeedFilled } from '@vicons/material';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.mttdl-calculator.title'),
  path: '/mttdl-calculator',
  description: t('tools.mttdl-calculator.description'),
  keywords: ['mttdl', 'raid', 'reliability', 'calculator'],
  component: () => import('./mttdl-calculator.vue'),
  icon: SpeedFilled,
  createdAt: new Date('2025-08-15'),
  category: 'Network',
});
