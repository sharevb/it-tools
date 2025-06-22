import { Id } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.snowflake-id-extractor.title'),
  path: '/snowflake-id-extractor',
  description: translate('tools.snowflake-id-extractor.description'),
  keywords: ['snowflake', 'id', 'extractor'],
  component: () => import('./snowflake-id-extractor.vue'),
  icon: Id,
  createdAt: new Date('2024-07-22'),
  category: 'Forensic',
});
