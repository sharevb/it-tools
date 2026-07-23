import { Marked, type Token } from 'marked';
import { type ConverterStrategy, PlainRenderer, getMarkdownExtensions } from './ConverterStrategy';

class DiscordRenderer extends PlainRenderer {
  // Discord supports standard markdown closely
}

export class DiscordStrategy implements ConverterStrategy {
  id = 'discord';
  name = 'Discord';

  getRenderer() {
    return new DiscordRenderer();
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
    // Discord supports links in some contexts, so standard markdown link is appropriate
    return `[${text}](${target})`;
  }

  renderCallout(type: string, title: string, content: string): string {
    // Discord doesn't have callouts, we can render as a nice blockquote with emoji or type header
    const emojiMap: Record<string, string> = {
      info: 'ℹ️',
      note: '📝',
      tip: '💡',
      warning: '⚠️',
      danger: '🔥',
      todo: '✅',
    };
    const emoji = emojiMap[type.toLowerCase()] || '📝';
    const header = title ? `**${emoji} [${type.toUpperCase()}] ${title}**\n` : `**${emoji} [${type.toUpperCase()}]**\n`;
    const fullText = `${header}${content}`;
    return `\n${fullText
      .trim()
      .split('\n')
      .map((l) => `> ${l}`)
      .join('\n')}\n`;
  }
}
