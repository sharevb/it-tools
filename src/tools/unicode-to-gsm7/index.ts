import { DeviceMobileMessage } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.unicode-to-gsm7.title'),
  path: '/unicode-to-gsm7',
  description: t('tools.unicode-to-gsm7.description'),
  keywords: ['unicode', 'segment', 'sms', 'gsm7'],
  component: () => import('./unicode-to-gsm7.vue'),
  icon: DeviceMobileMessage,
  createdAt: new Date('2025-08-15'),
  category: 'Text',
});
