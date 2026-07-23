import { Marked, type Token } from 'marked';
import { type ConverterStrategy, PlainRenderer, getMarkdownExtensions } from './ConverterStrategy';

function jiraToMarkdown(input: string): string {
  let output = input;

  // Code blocks: {code:lang}content{code} or {code}content{code}
  output = output.replace(/\{code(?::([a-zA-Z0-9+-]+))?\}([\s\S]*?)\{code\}/g, (_, lang, content) => {
    const l = lang ? lang.trim() : '';
    return `\n\`\`\`${l}\n${content.trim()}\n\`\`\`\n`;
  });

  // Blockquotes: {quote}content{quote}
  output = output.replace(/\{quote\}([\s\S]*?)\{quote\}/g, (_, content) => {
    const lines = content.trim().split('\n').map((line: string) => `> ${line}`).join('\n');
    return `\n${lines}\n`;
  });

  // Jira Lists (Do this before Heading/Bold replacement so `#` list bullets aren't mistaken for markdown headings)
  const lines = output.split('\n');
  const convertedLines = lines.map(line => {
    // Unordered nested
    const unorderedMatch = line.match(/^(\*+)\s+(.+)$/);
    if (unorderedMatch) {
      const depth = unorderedMatch[1].length;
      return `${'  '.repeat(depth - 1)}* ${unorderedMatch[2]}`;
    }

    // Ordered nested
    const orderedMatch = line.match(/^(#+)\s+(.+)$/);
    if (orderedMatch) {
      const depth = orderedMatch[1].length;
      return `${'  '.repeat(depth - 1)}1. ${orderedMatch[2]}`;
    }

    return line;
  });
  output = convertedLines.join('\n');

  // Headings: h1. Text -> # Text
  output = output.replace(/^(?:[ \t]*)h([1-6])\.\s*(.+)$/gm, (_, level, text) => {
    return `${'#'.repeat(parseInt(level, 10))} ${text}`;
  });

  // Links: [Text|URL] -> [Text](URL)
  output = output.replace(/\[([^\]|]+)\|([^\]|]+)\]/g, '[$1]($2)');
  // Links without text: [URL] (negative lookahead to ensure we don't match standard markdown links like [Text](URL))
  output = output.replace(/\[([^\]|]+)\](?!\()/g, '[$1]($1)');

  // Images: !URL! -> ![](URL)
  output = output.replace(/!([^!\s]+)!/g, '![]($1)');

  // Bold: *bold* -> **bold** (excluding lines starting with asterisk list bullets)
  output = output.replace(/(?<!^\s*)\*([^*]+)\*(?!\s*\*)/gm, '**$1**');

  // Italics: _italic_ -> *italic*
  output = output.replace(/(?<=^|\s|[.,;:!?])_([^_]+)_(?=$|\s|[.,;:!?])/g, '*$1*');

  // Strikethrough: -del- -> ~~del~~
  output = output.replace(/(?<=^|\s|[.,;:!?])-([^-]+)-(?=$|\s|[.,;:!?])/g, '~~$1~~');

  // Inline code: {{code}} -> `code`
  output = output.replace(/\{\{([^}]+)\}\}/g, '`$1`');

  return output;
}

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

  lex(input: string): Token[] {
    const markdown = jiraToMarkdown(input);
    const markedInstance = new Marked();
    markedInstance.use({
      extensions: getMarkdownExtensions(this),
      gfm: true,
      breaks: true,
    });
    return markedInstance.lexer(markdown);
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
