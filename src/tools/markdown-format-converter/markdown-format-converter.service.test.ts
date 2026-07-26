import { describe, expect, it } from 'vitest';
import { convertMarkdown } from './markdown-format-converter.service';

describe('markdown-format-converter', () => {
  describe('Standard elements conversion (from GitHub/Standard Markdown)', () => {
    const input =
      '# Heading 1\nThis is **bold** and *italic* and ~~strikethrough~~.\nHere is `inline code`.\n\n[Google](https://google.com)';

    it('should convert standard elements to Slack format', () => {
      const output = convertMarkdown(input, 'github', 'slack');
      expect(output).toContain('*Heading 1*');
      expect(output).toContain('*bold*');
      expect(output).toContain('_italic_');
      expect(output).toContain('~strikethrough~');
      expect(output).toContain('<https://google.com|Google>');
    });

    it('should convert standard elements to Discord format', () => {
      const output = convertMarkdown(input, 'github', 'discord');
      expect(output).toContain('# Heading 1');
      expect(output).toContain('**bold**');
      expect(output).toContain('*italic*');
      expect(output).toContain('~~strikethrough~~');
      expect(output).toContain('[Google](https://google.com)');
    });

    it('should convert standard elements to Jira format', () => {
      const output = convertMarkdown(input, 'github', 'jira');
      expect(output).toContain('h1. Heading 1');
      expect(output).toContain('*bold*');
      expect(output).toContain('_italic_');
      expect(output).toContain('-strikethrough-');
      expect(output).toContain('[Google|https://google.com]');
    });

    it('should convert standard elements to GitHub format', () => {
      const output = convertMarkdown(input, 'github', 'github');
      expect(output).toContain('# Heading 1');
      expect(output).toContain('**bold**');
      expect(output).toContain('*italic*');
      expect(output).toContain('~~strikethrough~~');
      expect(output).toContain('[Google](https://google.com)');
    });
  });

  describe('Wikilink conversion', () => {
    const input1 = 'Check [[My Page]] for info.';
    const input2 = 'Check [[My Page|Alternate Text]] for info.';

    it('should convert wikilink with Slack format', () => {
      expect(convertMarkdown(input1, 'github', 'slack')).toContain('*My Page*');
      expect(convertMarkdown(input2, 'github', 'slack')).toContain('*Alternate Text*');
    });

    it('should convert wikilink with Jira format', () => {
      expect(convertMarkdown(input1, 'github', 'jira')).toContain('[My Page|My Page]');
      expect(convertMarkdown(input2, 'github', 'jira')).toContain('[Alternate Text|My Page]');
    });

    it('should convert wikilink with GitHub format', () => {
      expect(convertMarkdown(input1, 'github', 'github')).toContain('[My Page](my-page)');
      expect(convertMarkdown(input2, 'github', 'github')).toContain('[Alternate Text](my-page)');
    });

    it('should convert wikilink with Obsidian format', () => {
      expect(convertMarkdown(input1, 'github', 'obsidian')).toContain('[[My Page]]');
      expect(convertMarkdown(input2, 'github', 'obsidian')).toContain('[[My Page|Alternate Text]]');
    });
  });

  describe('Callout conversion', () => {
    const input = '> [!info] Tip of the day\n> This is some callout body content.\n> Line 2 of callout.';

    it('should convert callout to Slack blockquotes', () => {
      const output = convertMarkdown(input, 'github', 'slack');
      expect(output).toContain('> *[INFO] Tip of the day*');
      expect(output).toContain('> This is some callout body content.');
    });

    it('should convert callout to Jira panel macro', () => {
      const output = convertMarkdown(input, 'github', 'jira');
      expect(output).toContain(
        '{panel:title=Tip of the day|borderStyle=solid|borderColor=#3572b0|titleBGColor=#cbe3ff|bgColor=#e0f0ff}',
      );
      expect(output).toContain('This is some callout body content.');
      expect(output).toContain('{panel}');
    });

    it('should convert callout to GitHub native alerts', () => {
      const output = convertMarkdown(input, 'github', 'github');
      expect(output).toContain('> [!NOTE] > **Tip of the day**');
      expect(output).toContain('> This is some callout body content.');
    });

    it('should preserve callout in Obsidian strategy', () => {
      const output = convertMarkdown(input, 'github', 'obsidian');
      expect(output).toContain('> [!info] Tip of the day');
      expect(output).toContain('> This is some callout body content.');
    });
  });

  describe('Lists conversion', () => {
    it('should convert ordered lists correctly in standard formats', () => {
      const input = '1. First item\n2. Second item\n3. Third item';
      
      const githubOutput = convertMarkdown(input, 'github', 'github');
      expect(githubOutput).toContain('1. First item');
      expect(githubOutput).toContain('2. Second item');
      expect(githubOutput).toContain('3. Third item');

      const jiraOutput = convertMarkdown(input, 'github', 'jira');
      expect(jiraOutput).toContain('# First item');
      expect(jiraOutput).toContain('# Second item');
      expect(jiraOutput).toContain('# Third item');
    });

    it('should convert nested lists with correct indentation', () => {
      const input = '- Parent item\n  - Child item 1\n  - Child item 2';
      const output = convertMarkdown(input, 'github', 'github');
      expect(output).toContain('- Parent item');
      expect(output).toContain('  - Child item 1');
      expect(output).toContain('  - Child item 2');
    });

    it('should convert standard elements to Logseq outliner format', () => {
      const input = '# Heading 1\nThis is a paragraph.\n1. Item 1\n2. Item 2';
      const output = convertMarkdown(input, 'github', 'logseq');
      expect(output).toContain('- # Heading 1');
      expect(output).toContain('- This is a paragraph.');
      expect(output).toContain('- 1. Item 1');
      expect(output).toContain('- 2. Item 2');
    });

    it('should convert nested lists with correct separate line formatting in Logseq outliner format', () => {
      const input = '- ordered list\n  1. item 1\n  2. item 2';
      const output = convertMarkdown(input, 'github', 'logseq');
      expect(output).toContain('- ordered list\n  - 1. item 1\n  - 2. item 2');
    });

    it('should convert loose ordered lists correctly without shifting the content to the next line', () => {
      const input = `1. **Item 1**\n   - Detail 1\n\n2. **Item 2**\n   - Detail 2`;
      const output = convertMarkdown(input, 'github', 'github');
      expect(output).toContain('1. **Item 1**\n  - Detail 1');
      expect(output).toContain('2. **Item 2**\n  - Detail 2');
    });

    it('should unescape special characters like single quotes in the final output', () => {
      const input = "Jira's native prefix";
      const output = convertMarkdown(input, 'github', 'jira');
      expect(output).toContain("Jira's");
    });
  });

  describe('Cross-format parsing and conversion', () => {
    it('should convert Jira input to Slack output', () => {
      const input = 'h1. Title\nThis is *bold* and _italic_ and {{inline code}}.\n{code:javascript}\nconst x = 5;\n{code}\n[Google|https://google.com]';
      const output = convertMarkdown(input, 'jira', 'slack');
      expect(output).toContain('*Title*');
      expect(output).toContain('*bold*');
      expect(output).toContain('_italic_');
      expect(output).toContain('`inline code`');
      expect(output).toContain('```\nconst x = 5;\n```');
      expect(output).toContain('<https://google.com|Google>');
    });

    it('should convert Slack input to Jira output', () => {
      const input = '*Title*\nThis is *bold* and _italic_ and ~strike~.\n<https://google.com|Google>';
      const output = convertMarkdown(input, 'slack', 'jira');
      expect(output).toContain('h1. Title');
      expect(output).toContain('*bold*');
      expect(output).toContain('_italic_');
      expect(output).toContain('-strike-');
      expect(output).toContain('[Google|https://google.com]');
    });

    it('should convert Logseq outliner input to standard Markdown output', () => {
      const input = '- # Heading 1\n- Normal paragraph.\n- Bullet parent\n  - Bullet child\n- > blockquote';
      const output = convertMarkdown(input, 'logseq', 'github');
      expect(output).toContain('# Heading 1');
      expect(output).toContain('Normal paragraph.');
      expect(output).toContain('- Bullet parent\n  - Bullet child');
      expect(output).toContain('> blockquote');
    });

    it('should convert Logseq ordered lists properties correctly to standard GFM ordered list', () => {
      const input = '- item 1\n  logseq.order-list-type:: number\n- item 2\n  logseq.order-list-type:: number';
      const output = convertMarkdown(input, 'logseq', 'github');
      expect(output).toContain('1. item 1');
      expect(output).toContain('2. item 2');
    });

    it('should convert standard markdown lists and task lists correctly to Slack format with proper bullets, checkboxes, and 4-space nested indentation', () => {
      const input = '- [x] implement feature\n- [ ] merge PR\n- ordered list\n  1. item 1\n  2. item 2';
      const output = convertMarkdown(input, 'github', 'slack');
      expect(output).toContain('✓ implement feature');
      expect(output).not.toContain('✓ [x]');
      expect(output).toContain('☐ merge PR');
      expect(output).not.toContain('☐ [ ]');
      expect(output).toContain('• ordered list\n    1. item 1\n    2. item 2');
    });
  });

  describe('49-Combination Test Matrix for Standard Elements', () => {
    const strategies = ['github', 'slack', 'discord', 'jira', 'stackoverflow', 'obsidian', 'logseq'];

    const fixtures: Record<string, Record<string, { input: string; output: string }>> = {
      bold: {
        github: { input: 'This is **bold text**.', output: 'This is **bold text**.' },
        slack: { input: 'This is *bold text*.', output: 'This is *bold text*.' },
        discord: { input: 'This is **bold text**.', output: 'This is **bold text**.' },
        jira: { input: 'This is *bold text*.', output: 'This is *bold text*.' },
        stackoverflow: { input: 'This is **bold text**.', output: 'This is **bold text**.' },
        obsidian: { input: 'This is **bold text**.', output: 'This is **bold text**.' },
        logseq: { input: '- This is **bold text**.', output: '- This is **bold text**.' },
      },
      italic: {
        github: { input: 'This is *italic text*.', output: 'This is *italic text*.' },
        slack: { input: 'This is _italic text_.', output: 'This is _italic text_.' },
        discord: { input: 'This is *italic text*.', output: 'This is *italic text*.' },
        jira: { input: 'This is _italic text_.', output: 'This is _italic text_.' },
        stackoverflow: { input: 'This is *italic text*.', output: 'This is *italic text*.' },
        obsidian: { input: 'This is *italic text*.', output: 'This is *italic text*.' },
        logseq: { input: '- This is *italic text*.', output: '- This is *italic text*.' },
      },
      strikethrough: {
        github: { input: 'This is ~~strikethrough text~~.', output: 'This is ~~strikethrough text~~.' },
        slack: { input: 'This is ~strikethrough text~.', output: 'This is ~strikethrough text~.' },
        discord: { input: 'This is ~~strikethrough text~~.', output: 'This is ~~strikethrough text~~.' },
        jira: { input: 'This is -strikethrough text-.', output: 'This is -strikethrough text-.' },
        stackoverflow: { input: 'This is ~~strikethrough text~~.', output: 'This is ~~strikethrough text~~.' },
        obsidian: { input: 'This is ~~strikethrough text~~.', output: 'This is ~~strikethrough text~~.' },
        logseq: { input: '- This is ~~strikethrough text~~.', output: '- This is ~~strikethrough text~~.' },
      },
      code: {
        github: { input: 'This is `inline code`.', output: 'This is `inline code`.' },
        slack: { input: 'This is `inline code`.', output: 'This is `inline code`.' },
        discord: { input: 'This is `inline code`.', output: 'This is `inline code`.' },
        jira: { input: 'This is {{inline code}}.', output: 'This is {{inline code}}.' },
        stackoverflow: { input: 'This is `inline code`.', output: 'This is `inline code`.' },
        obsidian: { input: 'This is `inline code`.', output: 'This is `inline code`.' },
        logseq: { input: '- This is `inline code`.', output: '- This is `inline code`.' },
      },
      link: {
        github: { input: 'Check [Google](https://google.com).', output: 'Check [Google](https://google.com).' },
        slack: { input: 'Check <https://google.com|Google>.', output: 'Check <https://google.com|Google>.' },
        discord: { input: 'Check [Google](https://google.com).', output: 'Check [Google](https://google.com).' },
        jira: { input: 'Check [Google|https://google.com].', output: 'Check [Google|https://google.com].' },
        stackoverflow: { input: 'Check [Google](https://google.com).', output: 'Check [Google](https://google.com).' },
        obsidian: { input: 'Check [Google](https://google.com).', output: 'Check [Google](https://google.com).' },
        logseq: { input: '- Check [Google](https://google.com).', output: '- Check [Google](https://google.com).' },
      },
      heading1: {
        github: { input: '# Heading 1', output: '# Heading 1' },
        slack: { input: '*Heading 1*', output: '*Heading 1*' },
        discord: { input: '# Heading 1', output: '# Heading 1' },
        jira: { input: 'h1. Heading 1', output: 'h1. Heading 1' },
        stackoverflow: { input: '# Heading 1', output: '# Heading 1' },
        obsidian: { input: '# Heading 1', output: '# Heading 1' },
        logseq: { input: '- # Heading 1', output: '- # Heading 1' },
      },
    };

    for (const source of strategies) {
      for (const target of strategies) {
        it(`should convert standard elements from ${source} to ${target}`, () => {
          for (const [elementName, elementMap] of Object.entries(fixtures)) {
            const sourceFixture = elementMap[source];
            const targetFixture = elementMap[target];

            const output = convertMarkdown(sourceFixture.input, source, target);
            expect(output).toContain(targetFixture.output);
          }
        });
      }
    }
  });
});
