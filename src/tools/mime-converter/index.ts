import { Mail } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.mime-converter.title'),
  path: '/mime-converter',
  description: translate('tools.mime-converter.description'),
  keywords: ['mime', 'converter', 'subject', 'rfc2047', 'rfc1341', 'rfc2045'],
  component: () => import('./mime-converter.vue'),
  icon: Mail,
  createdAt: new Date('2024-03-09'),
  category: 'Forensic',
});
