import { FileText } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.charset-detector.title'),
  path: '/charset-detector',
  description: t('tools.charset-detector.description'),
  keywords: ['charset', 'ascii', 'iso', 'utf8', 'unicode', 'encoding', 'decode', 'text', 'detector'],
  component: () => import('./charset-detector.vue'),
  icon: FileText,
  createdAt: new Date('2025-03-09'),
  category: 'Forensic',
});
