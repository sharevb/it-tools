import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';
import FileCertIcon from '~icons/mdi/file-certificate-outline';

export const tool = defineTool({
  name: t('tools.pdf-signature-checker.title'),
  path: '/pdf-signature-checker',
  description: t('tools.pdf-signature-checker.description'),
  keywords: ['pdf', 'signature', 'checker', 'verify', 'validate', 'sign'],
  component: () => import('./pdf-signature-checker.vue'),
  icon: FileCertIcon,
  createdAt: new Date('2023-12-09'),
  npmPackages: ['pdf-signature-reader'],
  category: 'PDF',
});
