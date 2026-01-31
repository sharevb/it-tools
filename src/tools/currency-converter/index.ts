import { Currency } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.currency-converter.title'),
  path: '/currency-converter',
  description: t('tools.currency-converter.description'),
  keywords: ['currency', 'converter', 'units'],
  component: () => import('./currency-converter.vue'),
  icon: Currency,
  createdAt: new Date('2024-08-15'),
  category: 'Data',
  externAccessDescription: 'This tool downloads fresh currency data from https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api',
});
