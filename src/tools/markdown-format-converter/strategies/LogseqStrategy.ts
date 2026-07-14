import { type ConverterStrategy, PlainRenderer } from './ConverterStrategy';

class LogseqRenderer extends PlainRenderer {
  override heading(text: string, level: number): string {
    // Logseq headings must be prefixed with a bullet point
    return `- ${'#'.repeat(level)} ${text}\n`;
  }

  override paragraph(text: string): string {
    // Every paragraph/block in Logseq is natively a bullet point
    return `- ${text}\n`;
  }

  override code(code: string, infostring: string | undefined): string {
    const lang = (infostring || '').match(/^\S*/)?.[0] || '';
    return `- \`\`\`${lang}\n${code.trim()}\n\`\`\`\n`;
  }

  override blockquote(quote: string): string {
    // Render blockquote nested inside a bullet point
    const lines = quote
      .trim()
      .split('\n')
      .map(line => line.replace(/^>\s?/, '').trim());
    return `- > ${lines.join('\n> ')}\n`;
  }

  override hr(): string {
    return `- ---\n`;
  }

  override list(body: string, ordered: boolean, start: number): string {
    if (ordered) {
      let index = start;
      const lines = body.split('\n');
      const formattedLines = lines.map(line => {
        // Convert the bullet list items to manual numbered list items nested in bullets
        if (line.startsWith('- ')) {
          return line.replace(/^- /, `- ${index++}. `);
        }
        return line;
      });
      return formattedLines.join('\n');
    }
    return body;
  }
}

export class LogseqStrategy implements ConverterStrategy {
  id = 'logseq';
  name = 'Logseq';

  getRenderer() {
    return new LogseqRenderer();
  }

  renderWikilink(target: string, text: string): string {
    // Logseq uses double brackets for pages, but supports text links too
    if (text === target) {
      return `[[${target}]]`;
    }
    return `[${text}](${target})`;
  }

  renderCallout(type: string, title: string, content: string): string {
    // Logseq doesn't have callouts natively, we format as a bullet with a blockquote
    const header = title ? `**[${type.toUpperCase()}] ${title}**\n` : `**[${type.toUpperCase()}]**\n`;
    const fullText = `${header}${content}`;
    const lines = fullText
      .trim()
      .split('\n')
      .map(l => `> ${l}`)
      .join('\n');
    return `- ${lines}\n`;
  }
}
