import { Currency } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.currency-converter.title'),
  path: '/currency-converter',
  description: t('tools.currency-converter.description'),
  keywords: ['currency', 'converter'],
  component: () => import('./currency-converter.vue'),
  icon: Currency,
  createdAt: new Date('2024-08-15'),
  category: 'Data',
});
