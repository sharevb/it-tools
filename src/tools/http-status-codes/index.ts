import { defineTool } from '../tool';

import { codesByCategories } from './http-status-codes.constants';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.http-status-codes.title'),
  path: '/http-status-codes',
  description: t('tools.http-status-codes.description'),
  keywords: [
    'http',
    'status',
    'codes',
    ...codesByCategories.flatMap(({ codes }) => codes.flatMap(({ code, name }) => [String(code), name])),
  ],
  component: () => import('./http-status-codes.vue'),
  icon: defineAsyncComponent(() => import('@vicons/material/es/HttpRound')),
  createdAt: new Date('2023-04-13'),
  category: 'Web',
});
