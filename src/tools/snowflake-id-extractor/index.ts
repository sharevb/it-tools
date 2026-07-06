import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.snowflake-id-extractor.title'),
  path: '/snowflake-id-extractor',
  description: t('tools.snowflake-id-extractor.description'),
  keywords: ['snowflake', 'id', 'extractor'],
  component: () => import('./snowflake-id-extractor.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/Id')),
  createdAt: new Date('2024-07-22'),
  category: 'Forensic',
});
