import { BuildingLighthouse } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.ies-lighting-guidelines.title'),
  path: '/ies-lighting-guidelines',
  description: translate('tools.ies-lighting-guidelines.description'),
  keywords: ['ies', 'illuminance', 'lighting', 'guideline'],
  component: () => import('./ies-lighting-guidelines.vue'),
  icon: BuildingLighthouse,
  createdAt: new Date('2025-02-09'),
  category: 'Data',
});
