import { WorldUpload } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'TCP/UDP Port Tester',
  path: '/tcp-udp-port-tester',
  description: 'Allows to test TCP/UDP (using a websocket proxy on server side)',
  keywords: ['tcp', 'udp', 'port', 'tester'],
  component: () => import('./tcp-udp-port-tester.vue'),
  icon: WorldUpload,
  createdAt: new Date('2026-01-25'),
  category: 'Network',
  externAccessDescription: 'This tool needs a server side WebSocket server (https://github.com/sharevb/ws-tcp-udp-bridge)',
});
