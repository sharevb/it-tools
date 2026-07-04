import { Mail } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.outlook-parser.title'),
  path: '/outlook-parser',
  description: t('tools.outlook-parser.description'),
  keywords: ['outlook', 'email', 'msg', 'parser'],
  component: () => import('./outlook-parser.vue'),
  icon: Mail,
  createdAt: new Date('2024-08-15'),
  category: 'Forensic',
});
