import { type ConverterStrategy, PlainRenderer } from './ConverterStrategy';

class ObsidianRenderer extends PlainRenderer {
  // Mostly standard GFM
}

export class ObsidianStrategy implements ConverterStrategy {
  id = 'obsidian';
  name = 'Obsidian';

  getRenderer() {
    return new ObsidianRenderer();
  }

  renderWikilink(target: string, text: string): string {
    if (text === target) {
      return `[[${target}]]`;
    }
    return `[[${target}|${text}]]`;
  }

  renderCallout(type: string, title: string, content: string): string {
    const typeLabel = `[!${type.toLowerCase()}]`;
    const titleText = title ? ` ${title}` : '';
    const bodyLines = content
      .trim()
      .split('\n')
      .map((line) => `> ${line}`)
      .join('\n');

    return `\n> ${typeLabel}${titleText}\n${bodyLines}\n`;
  }
}
