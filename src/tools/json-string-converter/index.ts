import { IconBraces } from '@tabler/icons-vue';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.json-string-converter.title'),
  path: '/json-string-converter',
  description: '',
  keywords: ['json', 'string', 'converter'],
  component: () => import('./json-string-converter.vue'),
  icon: IconBraces,
  createdAt: new Date('2024-10-17'),
  category: 'JSON',
});
