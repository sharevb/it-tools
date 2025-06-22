import { BrandPython } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.json-to-python.title'),
  path: '/json-to-python',
  description: translate('tools.json-to-python.description'),
  keywords: ['json', 'to', 'python'],
  component: () => import('./json-to-python.vue'),
  icon: BrandPython,
  createdAt: new Date('2025-03-09'),
  category: 'JSON',
});
