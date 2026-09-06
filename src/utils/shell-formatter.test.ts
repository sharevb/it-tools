import { describe, expect, it } from 'vitest';
import { collapseBackslashLines, formatShellCommand } from './shell-formatter';

describe('collapseBackslashLines', () => {
  it('collapses lines ending with backslash', () => {
    const input = `
echo hello \\
  world
`;
    expect(collapseBackslashLines(input)).toBe(
      `
echo hello world
`.trim(),
    );
  });

  it('keeps comments untouched', () => {
    const input = `
# comment
echo test
`;
    expect(collapseBackslashLines(input)).toBe(
      `
# comment
echo test
`.trim(),
    );
  });

  it('keeps unrelated lines as-is', () => {
    const input = `
line1
line2
`;
    expect(collapseBackslashLines(input)).toBe(
      `
line1
line2
`.trim(),
    );
  });

  it('collapses multiple continuation lines', () => {
    const input = `
cmd a \\
  b \\
  c
`;
    expect(collapseBackslashLines(input)).toBe('cmd a b c');
  });

  it('handles mixed comments and commands', () => {
    const input = `
# before
cmd a \\
  b
# after
`;
    expect(collapseBackslashLines(input)).toBe(
      `
# before
cmd a b
# after
`.trim(),
    );
  });
});

describe('formatShellCommand', () => {
  it('returns empty string for empty input', () => {
    expect(formatShellCommand('')).toBe('');
  });

  it('groups arguments with values when groupArgs=true', () => {
    const cmd = 'docker run -d --name mycontainer -p 8080:80 myimage';
    const result = formatShellCommand(cmd);

    expect(result).toBe(
      ['docker run \\', '  -d \\', '  --name mycontainer \\', '  -p 8080:80 \\', '  myimage'].join('\n'),
    );
  });

  it('respects custom indentation', () => {
    const cmd = 'docker run -d --name mycontainer -p 8080:80 myimage';
    const result = formatShellCommand(cmd, 4);

    expect(result).toBe(
      ['docker run \\', '    -d \\', '    --name mycontainer \\', '    -p 8080:80 \\', '    myimage'].join('\n'),
    );
  });

  it('handles quoted arguments correctly', () => {
    const cmd = 'docker run --label "some label with spaces" myimage';
    const result = formatShellCommand(cmd);

    expect(result).toBe(['docker run \\', '  --label "some label with spaces" \\', '  myimage'].join('\n'));
  });

  it('handles base command with no args', () => {
    const cmd = 'echo hello';
    const result = formatShellCommand(cmd);

    expect(result).toBe('echo hello');
  });
});
