import { Mail } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.mime-converter.title'),
  path: '/mime-converter',
  description: t('tools.mime-converter.description'),
  keywords: ['mime', 'converter', 'subject', 'rfc2047', 'rfc1341', 'rfc2045'],
  component: () => import('./mime-converter.vue'),
  icon: Mail,
  createdAt: new Date('2024-03-09'),
  category: 'Forensic',
});
