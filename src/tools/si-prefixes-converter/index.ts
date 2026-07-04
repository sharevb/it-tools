import { MathSymbols } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.si-prefixes-converter.title'),
  path: '/si-prefixes-converter',
  description: t('tools.si-prefixes-converter.description'),
  keywords: ['si', 'international', 'metric', 'units', 'converter'],
  component: () => import('./si-prefixes-converter.vue'),
  icon: MathSymbols,
  createdAt: new Date('2026-01-11'),
  category: 'Physics',
});
