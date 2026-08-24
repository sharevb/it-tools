import { Marked, type Token } from 'marked';
import { type ConverterStrategy, PlainRenderer, getMarkdownExtensions } from './ConverterStrategy';

function logseqToMarkdown(input: string): string {
  const lines = input.split('\n');
  const processedLines: string[] = [];

  const blockMetadata = lines.map((line, index) => {
    const match = line.match(/^(\s*)-\s+(.*)$/);
    const isProperty = line.trim().includes('::');
    return {
      line,
      index,
      isBlock: !!match && !isProperty,
      indent: match ? match[1].length : 0,
      content: match ? match[2] : line,
      isProperty,
      isOrdered: false,
    };
  });

  // Mark blocks as ordered if they are followed by logseq.order-list-type:: number
  for (let i = 0; i < blockMetadata.length; i++) {
    if (blockMetadata[i].isProperty && blockMetadata[i].line.includes('logseq.order-list-type:: number')) {
      for (let j = i - 1; j >= 0; j--) {
        if (blockMetadata[j].isBlock) {
          blockMetadata[j].isOrdered = true;
          break;
        }
      }
    }
  }

  const listCounters: Record<number, number> = {};

  for (let i = 0; i < blockMetadata.length; i++) {
    const meta = blockMetadata[i];

    if (meta.isProperty) {
      continue;
    }

    if (!meta.isBlock) {
      processedLines.push(meta.line);
      continue;
    }

    let hasChildren = false;
    for (let j = i + 1; j < blockMetadata.length; j++) {
      const nextMeta = blockMetadata[j];
      if (nextMeta.isBlock) {
        if (nextMeta.indent > meta.indent) {
          hasChildren = true;
        }
        break;
      }
    }

    const indentStr = ' '.repeat(meta.indent);

    if (meta.isOrdered) {
      if (!listCounters[meta.indent]) {
        listCounters[meta.indent] = 1;
      }
      const num = listCounters[meta.indent]++;
      processedLines.push(`${indentStr}${num}. ${meta.content}`);
    } else {
      listCounters[meta.indent] = 0;

      if (meta.indent > 0) {
        processedLines.push(`${indentStr}- ${meta.content}`);
      } else {
        if (meta.content.trim().startsWith('#')) {
          processedLines.push(meta.content);
        } else if (meta.content.trim().startsWith('>')) {
          processedLines.push(meta.content);
        } else if (hasChildren) {
          processedLines.push(`- ${meta.content}`);
        } else {
          processedLines.push(meta.content);
        }
      }
    }
  }

  return processedLines.join('\n');
}

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
      return `\n${formattedLines.join('\n')}`;
    }
    return `\n${body}`;
  }
}

export class LogseqStrategy implements ConverterStrategy {
  id = 'logseq';
  name = 'Logseq';

  getRenderer() {
    return new LogseqRenderer();
  }

  lex(input: string): Token[] {
    const markdown = logseqToMarkdown(input);
    const markedInstance = new Marked();
    markedInstance.use({
      extensions: getMarkdownExtensions(this),
      gfm: true,
      breaks: true,
    });
    return markedInstance.lexer(markdown);
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
