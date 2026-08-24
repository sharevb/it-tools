import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.translator.title'),
  path: '/translator',
  description: t('tools.translator.description'),
  keywords: ['translate', 'language'],
  component: () => import('./translator.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/Language')),
  createdAt: new Date('2025-08-15'),
  category: 'Text',
  externAccessDescription: t('tools.translator.externalAccess'),
});
