import { BrandJavascript } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.json-to-typescript.title'),
  path: '/json-to-typescript',
  description: translate('tools.json-to-typescript.description'),
  keywords: ['json', 'typescript'],
  component: () => import('./json-to-typescript.vue'),
  icon: BrandJavascript,
  createdAt: new Date('2025-05-01'),
  category: 'Development',
});
