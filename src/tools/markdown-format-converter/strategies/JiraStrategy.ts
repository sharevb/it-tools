import { type ConverterStrategy, PlainRenderer } from './ConverterStrategy';

class JiraRenderer extends PlainRenderer {
  override strong(text: string): string {
    return `*${text}*`;
  }

  override em(text: string): string {
    return `_${text}_`;
  }

  override del(text: string): string {
    return `-${text}-`;
  }

  override codespan(text: string): string {
    return `{{${text}}}`;
  }

  override code(code: string, infostring: string | undefined): string {
    const lang = (infostring || '').match(/^\S*/)?.[0] || '';
    const langOption = lang ? `:${lang}` : '';
    return `\n{code${langOption}}\n${code}\n{code}\n`;
  }

  override blockquote(quote: string): string {
    return `\n{quote}\n${quote.trim()}\n{quote}\n`;
  }

  override heading(text: string, level: number): string {
    // Jira uses h1., h2. etc.
    const cappedLevel = Math.min(Math.max(level, 1), 6);
    return `\nh${cappedLevel}. ${text}\n`;
  }

  override hr(): string {
    return '\n----\n';
  }

  override list(body: string, ordered: boolean, start: number): string {
    if (ordered) {
      const lines = body.split('\n');
      const formattedLines = lines.map(line => {
        if (line.startsWith('* ')) {
          return line.replace(/^\* /, '# ');
        }
        return line;
      });
      return `\n${formattedLines.join('\n')}`;
    }
    return `\n${body}`;
  }

  override listitem(text: string, task: boolean, checked: boolean): string {
    // Jira list items use * or #. Nested is handles by ** or ##.
    // For single level, return standard bullet:
    const prefix = task ? (checked ? '(/) ' : '(x) ') : '';
    return `* ${prefix}${text.trim()}\n`;
  }

  override link(href: string, title: string | null | undefined, text: string): string {
    if (text && text !== href) {
      return `[${text}|${href}]`;
    }
    return `[${href}]`;
  }

  override image(href: string, title: string | null | undefined, text: string): string {
    return `!${href}!`;
  }
}

export class JiraStrategy implements ConverterStrategy {
  id = 'jira';
  name = 'Jira';

  getRenderer() {
    return new JiraRenderer();
  }

  renderWikilink(target: string, text: string): string {
    return `[${text}|${target}]`;
  }

  renderCallout(type: string, title: string, content: string): string {
    // Jira has panel macro for callout panel:
    // {panel:title=Title|borderStyle=dashed|borderColor=#ccc|titleBGColor=#F7F7F7|bgColor=#FFF}
    const colorMap: Record<string, { border: string; bg: string; titleBg: string }> = {
      info: { border: '#3572b0', bg: '#e0f0ff', titleBg: '#cbe3ff' },
      note: { border: '#cccccc', bg: '#f7f7f7', titleBg: '#eeeeee' },
      tip: { border: '#148214', bg: '#e0ffe0', titleBg: '#cbebc6' },
      warning: { border: '#d04437', bg: '#fff0f0', titleBg: '#ffd0d0' },
      danger: { border: '#d04437', bg: '#fff0f0', titleBg: '#ffd0d0' },
    };
    const colors = colorMap[type.toLowerCase()] || colorMap.note;
    const titleAttr = title ? `title=${title}|` : `title=${type.toUpperCase()}|`;
    return `\n{panel:${titleAttr}borderStyle=solid|borderColor=${colors.border}|titleBGColor=${colors.titleBg}|bgColor=${colors.bg}}\n${content.trim()}\n{panel}\n`;
  }
}
