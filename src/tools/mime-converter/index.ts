import { Mail } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

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
