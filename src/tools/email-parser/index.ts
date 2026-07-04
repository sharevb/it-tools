import { Mail } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.email-parser.title'),
  path: '/email-parser',
  description: t('tools.email-parser.description'),
  keywords: ['email', 'parser', 'header', 'rfc2822', 'rfc5322', 'rfc822'],
  component: () => import('./email-parser.vue'),
  icon: Mail,
  createdAt: new Date('2024-08-15'),
  category: 'Forensic',
});
