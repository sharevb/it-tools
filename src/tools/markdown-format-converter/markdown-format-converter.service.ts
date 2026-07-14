import { Marked } from 'marked';
import { getMarkdownExtensions, type ConverterStrategy } from './strategies/ConverterStrategy';
import { SlackStrategy } from './strategies/SlackStrategy';
import { DiscordStrategy } from './strategies/DiscordStrategy';
import { JiraStrategy } from './strategies/JiraStrategy';
import { GitHubStrategy } from './strategies/GitHubStrategy';
import { StackOverflowStrategy } from './strategies/StackOverflowStrategy';
import { ObsidianStrategy } from './strategies/ObsidianStrategy';
import { LogseqStrategy } from './strategies/LogseqStrategy';

export const strategies: ConverterStrategy[] = [
  new SlackStrategy(),
  new DiscordStrategy(),
  new JiraStrategy(),
  new GitHubStrategy(),
  new StackOverflowStrategy(),
  new ObsidianStrategy(),
  new LogseqStrategy(),
];

function unescapeHtml(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

export function convertMarkdown(input: string, strategyId: string): string {
  if (!input) {
    return '';
  }

  const strategy = strategies.find((s) => s.id === strategyId) || strategies[0];
  const markedInstance = new Marked();

  // Configure marked instance with strategy and its extensions
  markedInstance.use({
    extensions: getMarkdownExtensions(strategy),
    renderer: strategy.getRenderer(),
    // Standard option overrides
    gfm: true,
    breaks: true,
  });

  try {
    const parsed = markedInstance.parse(input) as string;
    // Post-process the result to trim any redundant multiple newlines from marked's parsing
    return unescapeHtml(parsed.trim());
  } catch (err) {
    console.error('Failed to parse and convert markdown:', err);
    return input;
  }
}
