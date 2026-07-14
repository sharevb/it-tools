import { type ConverterStrategy, PlainRenderer } from './ConverterStrategy';

class SlackRenderer extends PlainRenderer {
  override strong(text: string): string {
    return `*${text}*`;
  }

  override em(text: string): string {
    return `_${text}_`;
  }

  override del(text: string): string {
    return `~${text}~`;
  }

  override link(href: string, title: string | null | undefined, text: string): string {
    return `<${href}|${text}>`;
  }

  override image(href: string, title: string | null | undefined, text: string): string {
    return `<${href}|${text || 'Image'}>`;
  }

  override heading(text: string, level: number): string {
    // Slack has no native headings, so we format as strong text with double newlines
    return `\n*${text}*\n`;
  }

  override code(code: string): string {
    // Slack does not support language formatting on block backticks
    return `\n\`\`\`\n${code}\n\`\`\`\n`;
  }
}

export class SlackStrategy implements ConverterStrategy {
  id = 'slack';
  name = 'Slack';

  getRenderer() {
    return new SlackRenderer();
  }

  renderWikilink(target: string, text: string): string {
    return `*${text}*`;
  }

  renderCallout(type: string, title: string, content: string): string {
    const header = title ? `*[${type.toUpperCase()}] ${title}*\n` : `*[${type.toUpperCase()}]*\n`;
    const fullText = `${header}${content}`;
    return `\n${fullText
      .trim()
      .split('\n')
      .map((l) => `> ${l}`)
      .join('\n')}\n`;
  }
}
