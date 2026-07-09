import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Powershell Cheatsheet',
  path: '/powershell-memo',
  description: 'Powershell is a powerful scripting language and command-line shell designed for system administration and automation. It provides a wide range of cmdlets and features that allow users to manage and automate tasks on Windows systems efficiently.',
  keywords: ['powershell', 'memo', 'cheatsheet', 'shell'],
  component: () => import('./powershell-memo.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/Command')),
  createdAt: new Date('2026-05-11'),
  category: 'Cheatsheets',
});
