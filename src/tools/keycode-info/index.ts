import { Keyboard } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.keycode-info.title'),
  path: '/keycode-info',
  description: t('tools.keycode-info.description'),
  keywords: [
    'keycode',
    'info',
    'code',
    'javascript',
    'scancode',
    'event',
    'keycodes',
    'which',
    'keyboard',
    'press',
    'modifier',
    'alt',
    'ctrl',
    'meta',
    'shift',
  ],
  component: () => import('./keycode-info.vue'),
  icon: Keyboard,
  category: 'Forensic',
});
