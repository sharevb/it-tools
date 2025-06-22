import { FileText } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.rune-converter.title'),
  path: '/rune-converter',
  description: translate('tools.rune-converter.description'),
  keywords: ['rune', 'converter', 'ElderFuthark', 'Futhorc', 'MedievalFuthork', 'YoungerFuthark'],
  component: () => import('./rune-converter.vue'),
  icon: FileText,
  createdAt: new Date('2024-11-13'),
  category: 'Text',
});
