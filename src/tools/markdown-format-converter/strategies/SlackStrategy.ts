import { Marked, type Token } from 'marked';
import { type ConverterStrategy, PlainRenderer, getMarkdownExtensions } from './ConverterStrategy';

function slackToMarkdown(input: string): string {
  let output = input;

  // Convert links: <http://example.com|Example> -> [Example](http://example.com)
  output = output.replace(/<([^>|]+)\|([^>]+)>/g, '[$2]($1)');

  // Convert links without text: <http://example.com> -> [http://example.com](http://example.com)
  output = output.replace(/<([^>]+)>/g, '[$1]($1)');

  // Headings: Slack uses bold lines as headings
  output = output.replace(/^(?:[ \t]*)\*([^*]+)\*(?:[ \t]*)$/gm, '# $1');

  // Bold: Slack *bold* -> GFM **bold**
  output = output.replace(/(?<=^|\s|[.,;:!?])\*([^*]+)\*(?=$|\s|[.,;:!?])/g, '**$1**');

  // Strikethrough: Slack ~strike~ -> GFM ~~strike~~
  output = output.replace(/(?<=^|\s|[.,;:!?])~([^~]+)~(?=$|\s|[.,;:!?])/g, '~~$1~~');

  // Italics: Slack _italic_ -> GFM *italic*
  output = output.replace(/(?<=^|\s|[.,;:!?])_([^_]+)_(?=$|\s|[.,;:!?])/g, '*$1*');

  return output;
}

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

  override list(body: string, ordered: boolean, start: number): string {
    if (ordered) {
      let index = start;
      const lines = body.split('\n');
      const formattedLines = lines.map(line => {
        if (line.startsWith('• ')) {
          return line.replace(/^• /, `${index++}. `);
        }
        const match = line.match(/^(\s+)•\s+(.*)$/);
        if (match) {
          return `${match[1]}${index++}. ${match[2]}`;
        }
        return line;
      });
      return `\n${formattedLines.join('\n')}`;
    }
    return `\n${body}`;
  }

  override listitem(text: string, task: boolean, checked: boolean): string {
    let prefix = '• ';
    if (task) {
      prefix = checked ? '✓ ' : '☐ ';
    }

    const lines = text.trim().split('\n').filter(line => line.trim() !== '');
    const firstLine = lines[0].trim();
    const otherLines = lines
      .slice(1)
      .map(line => `    ${line}`)
      .join('\n');

    const formatted = otherLines ? `${firstLine}\n${otherLines}` : firstLine;
    return `${prefix}${formatted}\n`;
  }
}

export class SlackStrategy implements ConverterStrategy {
  id = 'slack';
  name = 'Slack';

  getRenderer() {
    return new SlackRenderer();
  }

  lex(input: string): Token[] {
    const markdown = slackToMarkdown(input);
    const markedInstance = new Marked();
    markedInstance.use({
      extensions: getMarkdownExtensions(this),
      gfm: true,
      breaks: true,
    });
    return markedInstance.lexer(markdown);
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
