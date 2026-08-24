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
          for (const [_elementName, elementMap] of Object.entries(fixtures)) {
            const sourceFixture = elementMap[source];
            const targetFixture = elementMap[target];

            const output = convertMarkdown(sourceFixture.input, source, target);
            expect(output).toContain(targetFixture.output);
          }
        });
      }
    }
  });

  describe('Targeted Strategy-Specific Edge Cases', () => {
    describe('Discord Specifics', () => {
      it('should map callout alerts to correct Discord emojis and bold titles', () => {
        const input = '> [!tip] Check this out\n> Some useful tip content.';
        const output = convertMarkdown(input, 'github', 'discord');
        expect(output).toContain('> **💡 [TIP] Check this out**');
        expect(output).toContain('> Some useful tip content.');

        const inputWarning = '> [!warning] Alert\n> Be careful.';
        const outputWarning = convertMarkdown(inputWarning, 'github', 'discord');
        expect(outputWarning).toContain('> **⚠️ [WARNING] Alert**');
      });

      it('should format wikilinks as standard markdown links', () => {
        const input = 'Check [[My Page]]';
        const output = convertMarkdown(input, 'github', 'discord');
        expect(output).toContain('[My Page](My Page)');
      });
    });

    describe('StackOverflow Specifics', () => {
      it('should fallback callouts to standard blockquotes with bold headers', () => {
        const input = '> [!info] Some title\n> Info content here.';
        const output = convertMarkdown(input, 'github', 'stackoverflow');
        expect(output).toContain('> **[INFO] Some title**');
        expect(output).toContain('> Info content here.');
      });

      it('should convert wikilinks to standard markdown links', () => {
        const input = 'Check [[Page Name|Custom Label]]';
        const output = convertMarkdown(input, 'github', 'stackoverflow');
        expect(output).toContain('[Custom Label](Page Name)');
      });
    });

    describe('Jira Specifics', () => {
      it('should convert code blocks with languages between GFM and Jira formats', () => {
        const gfmInput = '```javascript\nconst x = 42;\n```';
        const jiraOutput = convertMarkdown(gfmInput, 'github', 'jira');
        expect(jiraOutput).toContain('{code:javascript}\nconst x = 42;\n{code}');

        const jiraInput = '{code:typescript}\nconst y = "test";\n{code}';
        const gfmOutput = convertMarkdown(jiraInput, 'jira', 'github');
        expect(gfmOutput).toContain('```typescript\nconst y = "test";\n```');
      });

      it('should convert nested list structures correctly', () => {
        const gfmInput = '- Item 1\n  - Nested Item 1a\n    - Nested Item 1a.1';
        const jiraOutput = convertMarkdown(gfmInput, 'github', 'jira');
        expect(jiraOutput).toContain('* Item 1\n* Nested Item 1a\n* Nested Item 1a.1');

        const jiraInput = '# Ordered 1\n## Ordered 1.1\n### Ordered 1.1.1';
        const gfmOutput = convertMarkdown(jiraInput, 'jira', 'github');
        expect(gfmOutput).toContain('1. Ordered 1\n2. Ordered 1.1\n  1. Ordered 1.1.1');
      });

      it('should convert images back and forth correctly', () => {
        const gfmInput = '![Alt Text](https://example.com/image.png)';
        const jiraOutput = convertMarkdown(gfmInput, 'github', 'jira');
        expect(jiraOutput).toContain('!https://example.com/image.png!');

        const jiraInput = '!https://example.com/test.png!';
        const gfmOutput = convertMarkdown(jiraInput, 'jira', 'github');
        expect(gfmOutput).toContain('![](https://example.com/test.png)');
      });
    });

    describe('Slack Specifics', () => {
      it('should auto-link bare links and Slack style link targets', () => {
        const slackInput = '<https://google.com>';
        const gfmOutput = convertMarkdown(slackInput, 'slack', 'github');
        expect(gfmOutput).toContain('[https://google.com](https://google.com)');
      });

      it('should format standard markdown images into Slack link syntax with fallbacks', () => {
        const gfmInput = '![An image](https://example.com/img.jpg)';
        const slackOutput = convertMarkdown(gfmInput, 'github', 'slack');
        expect(slackOutput).toContain('<https://example.com/img.jpg|An image>');
      });

      it('should retain nested bullet formatting and proper Slack indentation', () => {
        const gfmInput = '- Bullet A\n  - Bullet B';
        const slackOutput = convertMarkdown(gfmInput, 'github', 'slack');
        expect(slackOutput).toContain('• Bullet A\n    • Bullet B');
      });
    });

    describe('Logseq Specifics', () => {
      it('should strip Logseq block properties from parsed outputs', () => {
        const logseqInput = '- Some block item\n  id:: 65161c16-86d1-41fb-992a-fa1fef9013e8\n  collapsed:: true';
        const gfmOutput = convertMarkdown(logseqInput, 'logseq', 'github');
        expect(gfmOutput).toEqual('Some block item');
      });

      it('should wrap blockquotes inside a bullet point block natively', () => {
        const gfmInput = '> This is a quote';
        const logseqOutput = convertMarkdown(gfmInput, 'github', 'logseq');
        expect(logseqOutput).toContain('- > - This is a quote');
      });
    });

    describe('Obsidian Specifics', () => {
      it('should parse and format multi-line custom Obsidian callouts', () => {
        const obsidianInput = '> [!info] Tip of the day\n> This is line 1.\n> This is line 2.';
        const gfmOutput = convertMarkdown(obsidianInput, 'obsidian', 'github');
        expect(gfmOutput).toContain('> [!NOTE] > **Tip of the day**');
        expect(gfmOutput).toContain('> This is line 1.');
        expect(gfmOutput).toContain('> This is line 2.');
      });

      it('should preserve and render internal Obsidian wikilinks with alias targets', () => {
        const inputWithAlias = '[[Target Page|Alias Text]]';
        const obsidianOutput = convertMarkdown(inputWithAlias, 'github', 'obsidian');
        expect(obsidianOutput).toContain('[[Target Page|Alias Text]]');

        const inputWithoutAlias = '[[Target Page]]';
        const obsidianOutputNoAlias = convertMarkdown(inputWithoutAlias, 'github', 'obsidian');
        expect(obsidianOutputNoAlias).toContain('[[Target Page]]');
      });
    });
  });
});
