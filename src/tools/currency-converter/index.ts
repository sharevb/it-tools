import { Currency } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.currency-converter.title'),
  path: '/currency-converter',
  description: t('tools.currency-converter.description'),
  keywords: ['currency', 'converter', 'units'],
  component: () => import('./currency-converter.vue'),
  icon: Currency,
  createdAt: new Date('2024-08-15'),
  category: 'Data',
  externAccessDescription: t('tools.currency-converter.externalAccess'),
});
