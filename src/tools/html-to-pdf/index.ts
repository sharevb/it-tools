import { Printer } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'HTML to PDF',
  path: '/html-to-pdf',
  description: 'Generate PDF from HTML content or URL with format selection and auto hide cookie banners',
  keywords: ['html', 'url', 'pdf'],
  component: () => import('./html-to-pdf.vue'),
  icon: Printer,
  createdAt: new Date('2026-04-07'),
  category: 'PDF',
  externAccessDescription: 'This tool sends URLs and HTML content to the *self hosted* Puppeteer webservice configured.',
});
