import { Marked, type Token } from 'marked';
import { type ConverterStrategy, PlainRenderer, getMarkdownExtensions } from './ConverterStrategy';

class StackOverflowRenderer extends PlainRenderer {
  // SO uses standard markdown close to GFM
}

export class StackOverflowStrategy implements ConverterStrategy {
  id = 'stackoverflow';
  name = 'StackOverflow';

  getRenderer() {
    return new StackOverflowRenderer();
  }

  lex(input: string): Token[] {
    const markedInstance = new Marked();
    markedInstance.use({
      extensions: getMarkdownExtensions(this),
      gfm: true,
      breaks: true,
    });
    return markedInstance.lexer(input);
  }

  renderWikilink(target: string, text: string): string {
    return `[${text}](${target})`;
  }

  renderCallout(type: string, title: string, content: string): string {
    // StackOverflow doesn't have alert styling, so format as standard blockquote with bold header
    const header = title ? `**[${type.toUpperCase()}] ${title}**\n` : `**[${type.toUpperCase()}]**\n`;
    const fullText = `${header}${content}`;
    return `\n${fullText
      .trim()
      .split('\n')
      .map((l) => `> ${l}`)
      .join('\n')}\n`;
  }
}
