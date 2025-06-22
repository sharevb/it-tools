import { EqualNot } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.math-formats-converter.title'),
  path: '/math-formats-converter',
  description: translate('tools.math-formats-converter.description'),
  keywords: ['math', 'formats', 'converter', 'latex', 'mathml', 'asciimath', 'omml', 'html'],
  component: () => import('./math-formats-converter.vue'),
  icon: EqualNot,
  createdAt: new Date('2024-05-11'),
  category: 'Maths',
});
