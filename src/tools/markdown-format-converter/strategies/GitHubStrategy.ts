import { Marked, type Token } from 'marked';
import { type ConverterStrategy, PlainRenderer, getMarkdownExtensions } from './ConverterStrategy';

class GitHubRenderer extends PlainRenderer {
  // Matches standard GitHub Flavored Markdown (GFM)
}

export class GitHubStrategy implements ConverterStrategy {
  id = 'github';
  name = 'GitHub';

  getRenderer() {
    return new GitHubRenderer();
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
    // Converts WikiLinks to standard GFM markdown links
    // Sluggify target to be URL-friendly (e.g. "Some Page" -> "some-page" or "some-page.md")
    const href = target.toLowerCase().replace(/\s+/g, '-');
    return `[${text}](${href})`;
  }

  renderCallout(type: string, title: string, content: string): string {
    // GitHub supports native alert blockquotes: > [!NOTE], > [!TIP], > [!IMPORTANT], > [!WARNING], > [!CAUTION]
    const validTypes = ['NOTE', 'TIP', 'IMPORTANT', 'WARNING', 'CAUTION'];
    let alertType = type.toUpperCase();
    if (!validTypes.includes(alertType)) {
      if (alertType === 'DANGER') {
        alertType = 'CAUTION';
      } else {
        alertType = 'NOTE';
      }
    }

    const headerLine = `> [!${alertType}]`;
    const titleLine = title ? ` > **${title}**` : '';
    const bodyLines = content
      .trim()
      .split('\n')
      .map((line) => `> ${line}`)
      .join('\n');

    return `\n${headerLine}${titleLine}\n${bodyLines}\n`;
  }
}
