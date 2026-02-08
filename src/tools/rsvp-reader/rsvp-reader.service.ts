import ePub from 'epubjs';
import type Section from 'epubjs/types/section';
import type { SpineItem } from 'epubjs/types/section';
import * as pdfjsLib from 'pdfjs-dist';
import pdfJSWorkerURL from 'pdfjs-dist/build/pdf.worker?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfJSWorkerURL;

export async function extractTextFromPDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  let text = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map((item: any) => item.str).join(' ');
    text += `${pageText}\n\n`;
  }

  return text;
}

interface SpineItems {
  items: SpineItem[]
  get(href: string | undefined): Section
}
export async function extractTextFromEPUB(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const book = ePub(arrayBuffer);

  // Wait for the book to be ready
  await book.ready;

  // Ensure spine is loaded
  const spine = await ((book.loaded.spine as unknown) as Promise<SpineItems>);

  let text = '';

  // Iterate through spine items
  for (const spineItem of spine.items) {
    // Load the item (returns XHTML)
    const section = spine.get(spineItem.href);
    const content = await ((section.load(book.load.bind(book)) as unknown) as Promise<HTMLElement>);

    text += `${content.ownerDocument?.body?.textContent}\n\n`;

    section.unload();
  }

  return text.trim();
}
