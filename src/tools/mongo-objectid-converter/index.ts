import { translate as t } from '@/plugins/i18n.plugin';
import { IconBrandMongodb } from '@tabler/icons-vue';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.mongo-objectid-converter.title'),
  path: '/mongo-objectid-converter',
  description: t('tools.mongo-objectid-converter.description'),
  keywords: ['mongo', 'objectid', 'converter', 'timestamp'],
  component: () => import('./mongo-objectid-converter.vue'),
  icon: IconBrandMongodb,
  createdAt: new Date('2024-08-15'),
  category: 'Forensic',
});
