import ePub from 'epubjs';
import type Section from 'epubjs/types/section';
import type { SpineItem } from 'epubjs/types/section';
import TurndownService from 'turndown';
import { gfm as addGFM } from '@guyplusplus/turndown-plugin-gfm';

function escapeMarkdown(text: string) {
  return text
    .replace(/\\/g, '\\\\') // escape backslash first
    .replace(/([*_#>|`])/g, '\\$1') // escape common markdown symbols
    .replace(/([\[\]\(\)])/g, '\\$1') // escape brackets and parentheses
    .replace(/\|/g, '\\|'); // escape table pipes
}

interface SpineItems {
  items: SpineItem[]
  get(href: string | undefined): Section
}
export async function extractTextAndMetaFromEPUB(file: File, format: 'text' | 'markdown') {
  let turndownService: TurndownService;
  if (format === 'markdown') {
    turndownService = new TurndownService();
    turndownService.addRule('escapeText', {
      filter(node) {
        return node.nodeType === 3; // text nodes
      },
      replacement(content) {
        return escapeMarkdown(content);
      },
    });
    addGFM(turndownService);
    turndownService.addRule('normalizedHeading', {
      filter: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
      replacement(content, node) {
        const level = Number.parseInt(node.nodeName.charAt(1));

        // Normalize spacing
        const text = content.trim().replace(/\s+/g, ' ');

        // Default hash style
        return `\n${'#'.repeat(level)} ${text}\n\n`;
      },
    });
  }

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

    if (format === 'markdown') {
      text += `${turndownService!.turndown(content.ownerDocument?.body?.innerHTML)}\n\n`;
    }
    else {
      text += `${content.ownerDocument?.body?.textContent}\n\n`;
    }

    section.unload();
  }

  const meta = book.packaging.metadata;
  return {
    content: text.trim(),
    metadata: {
      title: meta.title,
      creator: meta.creator,
      language: meta.language,
      publisher: meta.publisher,
      description: meta.description,
      rights: meta.rights,
      identifier: meta.identifier,
    },
  };
}
