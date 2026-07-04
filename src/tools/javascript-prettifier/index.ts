import { BrandJavascript } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.javascript-prettifier.title'),
  path: '/javascript-prettifier',
  description: t('tools.javascript-prettifier.description'),
  keywords: ['javascript', 'prettifier', 'beautify', 'prettier', 'format'],
  component: () => import('./javascript-prettifier.vue'),
  icon: BrandJavascript,
  createdAt: new Date('2024-03-15'),
  category: 'Development',
});
