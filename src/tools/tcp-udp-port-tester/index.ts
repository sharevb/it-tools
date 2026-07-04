import { translate as t } from '@/plugins/i18n.plugin';
import { WorldUpload } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.tcp-udp-port-tester.title'),
  path: '/tcp-udp-port-tester',
  description: t('tools.tcp-udp-port-tester.description'),
  keywords: ['tcp', 'udp', 'port', 'tester'],
  component: () => import('./tcp-udp-port-tester.vue'),
  icon: WorldUpload,
  createdAt: new Date('2026-01-25'),
  category: 'Network',
  externAccessDescription: t('tools.tcp-udp-port-tester.externalAccess'),
});
