import { Braces } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.css-xpath-converter.title'),
  path: '/css-xpath-converter',
  description: translate('tools.css-xpath-converter.description'),
  keywords: ['css', 'xpath', 'converter'],
  component: () => import('./css-xpath-converter.vue'),
  icon: Braces,
  createdAt: new Date('2024-08-15'),
  category: 'Web',
});
