import { BuildingLighthouse } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.ies-lighting-guidelines.title'),
  path: '/ies-lighting-guidelines',
  description: t('tools.ies-lighting-guidelines.description'),
  keywords: ['ies', 'illuminance', 'lighting', 'guideline'],
  component: () => import('./ies-lighting-guidelines.vue'),
  icon: BuildingLighthouse,
  createdAt: new Date('2025-02-09'),
  category: 'Data',
});
