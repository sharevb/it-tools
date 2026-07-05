/**
 * Formats a shell command by splitting dash arguments onto new lines,
 * with optional grouping and line wrapping.
 */
export function formatShellCommand(
  commands: string,
  indentSize: number = 2,
): string {
  const indent = ' '.repeat(indentSize);

  return collapseBackslashLines(commands).split(/\r?\n/).map((command) => {
    if (!command?.trim() || command.trimStart().startsWith('#')) {
      return command;
    }

    // Split by whitespace while respecting quoted strings
    const args = command.match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g) || [];
    if (args.length === 0) {
      return command;
    }

    const formatted: string[] = [];

    let hadArgument = false;
    for (let i = 0; i < args.length; i++) {
      const arg = args[i];

      if (arg.startsWith('-')) {
        if (!hadArgument && formatted.length) {
          formatted[formatted.length - 1] += ' \\';
        }
        hadArgument = true;
        if (i + 1 < args.length && !args[i + 1].startsWith('-')) {
          formatted.push(`${indent}${arg} ${args[i + 1]} \\`);
          i++;
        }
        else {
          formatted.push(`${indent}${arg} \\`);
        }
      }
      else if (hadArgument) {
        formatted.push(`${indent}${arg}`);
      }
      else {
        if (formatted.length) {
          formatted[0] = `${formatted[0]} ${arg}`;
        }
        else {
          formatted.push(arg);
        }
      }
    }

    return formatted.join('\n');
  }).join('\n');
}

export function collapseBackslashLines(input: string): string {
  const lines = input.trim().split(/\r?\n/);

  const out: string[] = [];
  let buffer: string[] = [];

  const flush = () => {
    if (buffer.length > 0) {
      out.push(buffer.join(' ').trim());
      buffer = [];
    }
  };

  for (const raw of lines) {
    const line = raw.trimEnd();

    if (line.endsWith('\\')) {
      // Remove trailing backslash and continue accumulating
      buffer.push(line.slice(0, -1).trim());
    }
    else {
      if (buffer.length > 0) {
        buffer.push(line.trim());
        flush();
      }
      else {
        out.push(line);
      }
    }
  }

  flush();
  return out.join('\n');
}
