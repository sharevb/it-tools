import { UnfoldMoreOutlined } from '@vicons/material';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.ip-include-exclude.title'),
  path: '/ip-include-exclude',
  description: t('tools.ip-include-exclude.description'),
  keywords: ['ip', 'allowed', 'disallowed', 'include', 'exclude', 'subnet', 'cidr'],
  component: () => import('./ip-include-exclude.vue'),
  icon: UnfoldMoreOutlined,
  createdAt: new Date('2024-08-15'),
  category: 'Network',
});
