import { LetterX } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.roman-numeral-converter.title'),
  path: '/roman-numeral-converter',
  description: t('tools.roman-numeral-converter.description'),
  keywords: ['roman', 'arabic', 'converter', 'X', 'I', 'V', 'L', 'C', 'D', 'M'],
  component: () => import('./roman-numeral-converter.vue'),
  icon: LetterX,
  category: 'Converters',
});
