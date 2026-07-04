import { FileInvoice } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.chmod-calculator.title'),
  path: '/chmod-calculator',
  description: t('tools.chmod-calculator.description'),
  keywords: [
    'chmod',
    'calculator',
    'file',
    'permission',
    'files',
    'directory',
    'folder',
    'recursive',
    'generator',
    'octal',
    'umask',
  ],
  component: () => import('./chmod-calculator.vue'),
  icon: FileInvoice,
  category: 'Network',
});
