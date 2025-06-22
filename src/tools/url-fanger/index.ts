import { EyeOff } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.url-fanger.title'),
  path: '/url-fanger',
  description: translate('tools.url-fanger.description'),
  keywords: ['url', 'fanger', 'fange', 'defang', 'refang'],
  component: () => import('./url-fanger.vue'),
  icon: EyeOff,
  createdAt: new Date('2024-03-09'),
  category: 'Web',
});
