import { FileCertificate } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.certificate-key-parser.title'),
  path: '/certificate-key-parser',
  description: translate('tools.certificate-key-parser.description'),
  keywords: ['certificate', 'key', 'parser'],
  component: () => import('./certificate-key-parser.vue'),
  icon: FileCertificate,
  createdAt: new Date('2024-02-22'),
  category: 'Crypto',
});
