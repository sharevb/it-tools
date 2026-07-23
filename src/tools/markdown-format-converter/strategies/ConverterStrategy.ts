import { Renderer, type Token } from 'marked';

export interface ConverterStrategy {
  id: string;
  name: string;
  getRenderer(): Renderer;
  lex(input: string): Token[];
  renderWikilink?(target: string, text: string): string;
  renderCallout?(type: string, title: string, content: string): string;
}

/**
 * Global extensions to parse custom dialects (Obsidian/Logseq)
 */
export function getMarkdownExtensions(strategy: ConverterStrategy) {
  return [
    {
      name: 'wikilink',
      level: 'inline' as const,
      start(src: string) { return src.indexOf('[['); },
      tokenizer(src: string) {
        const rule = /^\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/;
        const match = rule.exec(src);
        if (match) {
          return {
            type: 'wikilink',
            raw: match[0],
            target: match[1].trim(),
            text: (match[2] || match[1]).trim(),
          };
        }
      },
      renderer(token: any) {
        if (strategy.renderWikilink) {
          return strategy.renderWikilink(token.target, token.text);
        }
        // Default standard markdown fallback (converts wikilink to standard markdown link)
        return `[${token.text}](${token.target})`;
      },
    },
    {
      name: 'callout',
      level: 'block' as const,
      start(src: string) { return src.indexOf('>'); },
      tokenizer(src: string) {
        const rule = /^> \[!([a-zA-Z-]+)\]([^\n]*)\n?((?:>.*\n?)*)/;
        const match = rule.exec(src);
        if (match) {
          const calloutType = match[1].trim();
          const title = match[2].trim();
          const content = match[3]
            .split('\n')
            .map(line => line.replace(/^>\s?/, ''))
            .join('\n');
          return {
            type: 'callout',
            raw: match[0],
            calloutType,
            title,
            content,
          };
        }
      },
      renderer(token: any) {
        if (strategy.renderCallout) {
          return strategy.renderCallout(token.calloutType, token.title, token.content);
        }
        // Default fallback (renders as standard blockquote with type header)
        const header = token.title
          ? `**[${token.calloutType.toUpperCase()}] ${token.title}**\n`
          : `**[${token.calloutType.toUpperCase()}]**\n`;
        const text = `${header}${token.content}`;
        const lines = text.trim().split('\n').map(line => `> ${line}`).join('\n');
        return `\n${lines}\n`;
      },
    },
  ];
}

/**
 * A Base Renderer that outputs standard Markdown instead of HTML.
 * Other specific strategies (Slack, Jira, Discord, etc.) will extend this
 * and override only the elements they need to format differently.
 */
export class PlainRenderer extends Renderer {
  constructor() {
    super();

    // Walk the entire prototype chain and copy/bind methods to the instance as direct own properties.
    // This is CRITICAL for marked.use() which uses Object.assign/spread, completely ignoring
    // inherited prototype methods of classes.
    let currentProto = Object.getPrototypeOf(this);
    const boundKeys = new Set<string>();

    while (currentProto && currentProto !== Object.prototype) {
      for (const key of Object.getOwnPropertyNames(currentProto)) {
        if (key !== 'constructor' && !boundKeys.has(key)) {
          const value = (this as any)[key];
          if (typeof value === 'function') {
            (this as any)[key] = value.bind(this);
            boundKeys.add(key);
          }
        }
      }
      currentProto = Object.getPrototypeOf(currentProto);
    }
  }

  override code(code: string, infostring: string | undefined, escaped: boolean): string {
    const lang = (infostring || '').match(/^\S*/)?.[0] || '';
    return `\n\`\`\`${lang}\n${code}\n\`\`\`\n`;
  }

  override blockquote(quote: string): string {
    const lines = quote
      .trim()
      .split('\n')
      .map(line => `> ${line}`)
      .join('\n');
    return `\n${lines}\n`;
  }

  override html(html: string, block?: boolean): string {
    return html;
  }

  override heading(text: string, level: number, raw: string): string {
    return `\n${'#'.repeat(level)} ${text}\n`;
  }

  override hr(): string {
    return '\n---\n';
  }

  override list(body: string, ordered: boolean, start: number): string {
    if (ordered) {
      let index = start;
      const lines = body.split('\n');
      const formattedLines = lines.map(line => {
        // Only convert lines that start with our custom item bullet prefix directly
        if (line.startsWith('- ')) {
          return line.replace(/^- /, `${index++}. `);
        }
        return line;
      });
      return `\n${formattedLines.join('\n')}`;
    }
    return `\n${body}`;
  }

  override listitem(text: string, task: boolean, checked: boolean): string {
    let prefix = '- ';
    if (task) {
      prefix = checked ? '- [x] ' : '- [ ] ';
    }

    const lines = text.trim().split('\n').filter(line => line.trim() !== '');
    const firstLine = lines[0].trim();
    const otherLines = lines
      .slice(1)
      .map(line => `  ${line}`)
      .join('\n');

    const formatted = otherLines ? `${firstLine}\n${otherLines}` : firstLine;
    return `${prefix}${formatted}\n`;
  }

  override checkbox(checked: boolean): string {
    return '';
  }

  override paragraph(text: string): string {
    return `\n${text}\n`;
  }

  override table(header: string, body: string): string {
    return `\n${header}${body}\n`;
  }

  override tablerow(content: string): string {
    return `| ${content}\n`;
  }

  override tablecell(content: string, flags: { header: boolean; align: 'center' | 'left' | 'right' | null }): string {
    return `${content} |`;
  }

  override strong(text: string): string {
    return `**${text}**`;
  }

  override em(text: string): string {
    return `*${text}*`;
  }

  override codespan(text: string): string {
    return `\`${text}\``;
  }

  override br(): string {
    return '\n';
  }

  override del(text: string): string {
    return `~~${text}~~`;
  }

  override link(href: string, title: string | null | undefined, text: string): string {
    return `[${text}](${href})`;
  }

  override image(href: string, title: string | null | undefined, text: string): string {
    const titleAttr = title ? ` "${title}"` : '';
    return `![${text}](${href}${titleAttr})`;
  }

  override text(text: string): string {
    return text;
  }
}
