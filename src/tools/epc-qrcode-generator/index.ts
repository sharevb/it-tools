import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'EPC QRCode Generator',
  path: '/epc-qrcode-generator',
  description: 'Generate an European Payments Council (EPC) QR Code for initiating a SEPA credit transfer',
  keywords: ['epc', 'sepa', 'qrcode', 'generator'],
  component: () => import('./epc-qrcode-generator.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/ReportMoney')),
  createdAt: new Date('2026-09-06'),
  category: 'Barcodes',
});
