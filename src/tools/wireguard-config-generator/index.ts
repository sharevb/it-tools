import { Link } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.wireguard-config-generator.title'),
  path: '/wireguard-config-generator',
  description: t('tools.wireguard-config-generator.description'),
  keywords: ['wireguard', 'config', 'generator'],
  component: () => import('./wireguard-config-generator.vue'),
  icon: Link,
  createdAt: new Date('2025-08-15'),
  category: 'Network',
});
