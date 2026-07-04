import { BrandJavascript } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

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
