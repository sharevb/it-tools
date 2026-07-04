import { FileCertificate } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.certificate-key-parser.title'),
  path: '/certificate-key-parser',
  description: t('tools.certificate-key-parser.description'),
  keywords: ['certificate', 'key', 'parser'],
  component: () => import('./certificate-key-parser.vue'),
  icon: FileCertificate,
  createdAt: new Date('2024-02-22'),
  category: 'Crypto',
});
