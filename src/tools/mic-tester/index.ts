import { Microphone } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.mic-tester.title'),
  path: '/mic-tester',
  description: t('tools.mic-tester.description'),
  keywords: ['mic', 'microphone', 'test', 'check', 'troubleshoot', 'sound'],
  component: () => import('./mic-tester.vue'),
  icon: Microphone,
  category: 'Network',
});
