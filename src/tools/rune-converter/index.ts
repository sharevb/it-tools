import { FileText } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.rune-converter.title'),
  path: '/rune-converter',
  description: t('tools.rune-converter.description'),
  keywords: ['rune', 'converter', 'ElderFuthark', 'Futhorc', 'MedievalFuthork', 'YoungerFuthark'],
  component: () => import('./rune-converter.vue'),
  icon: FileText,
  createdAt: new Date('2024-11-13'),
  category: 'Text',
});
