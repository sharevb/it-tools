import { FileDigit } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.pin-code-generator.title'),
  path: '/pin-code-generator',
  description: t('tools.pin-code-generator.description'),
  keywords: ['pin', 'code', 'digits', 'generator'],
  component: () => import('./pin-code-generator.vue'),
  icon: FileDigit,
  createdAt: new Date('2024-08-15'),
  category: 'Generators',
});
