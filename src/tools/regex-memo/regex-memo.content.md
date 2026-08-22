**Regular expressions** describe a pattern that text either matches or does not. The syntax below is the JavaScript flavour; PCRE, Python, Go and Java agree on almost all of it — the differences are called out where they bite.

```js
/^\d{4}-\d{2}-\d{2}$/.test('2026-08-22')   // true
'a1b2'.replace(/\d/g, '#')                 // 'a#b#'
```

## 🔡 Character Classes

| Expression             | Matches                                                       |
|------------------------|---------------------------------------------------------------|
| `.`                    | Any character except a newline (any at all with the `s` flag) |
| `[A-Za-z]`             | A letter                                                      |
| `[a-z]` / `[A-Z]`      | A lower-case / upper-case letter                              |
| `\d` or `[0-9]`        | A digit                                                       |
| `\D` or `[^0-9]`       | Anything but a digit                                          |
| `\w` or `[A-Za-z0-9_]` | A letter, digit or underscore                                 |
| `\W`                   | The inverse of `\w`                                           |
| `\s`                   | Whitespace: space, tab, newline, carriage return              |
| `\S`                   | The inverse of `\s`                                           |
| `\p{L}` / `\p{Nd}`     | Any Unicode letter / decimal digit (needs the `u` flag)       |
| `\x41` / `\u00E9`      | A character by hex code, or by Unicode code point             |

## ␣ Whitespace

| Expression | Matches                 |
|------------|-------------------------|
| ` `        | A literal space         |
| `\t`       | Tab                     |
| `\n`       | Newline                 |
| `\r`       | Carriage return         |
| `\f` `\v`  | Form feed, vertical tab |
| `\s`       | Any of the above        |

## 🎯 Character Sets

| Expression  | Matches                                   |
|-------------|-------------------------------------------|
| `[xyz]`     | `x`, `y` or `z`                           |
| `[^xyz]`    | Anything except `x`, `y`, `z`             |
| `[1-3]`     | `1`, `2` or `3`                           |
| `[^1-3]`    | Anything except `1`, `2`, `3`             |
| `[a-z0-9_]` | Ranges and single characters can be mixed |

- A set is an **or** over single characters — `[abc]` matches one character, not the string `abc`.
- `^` right after the opening `[` negates the set.
- Inside a set, most metacharacters lose their meaning: `.` is a literal period, `+` a literal plus.

## 🔒 Escaping

Outside a character set, these need a backslash to be taken literally:

| Escape | Character                              | Escape | Character           |
|--------|----------------------------------------|--------|---------------------|
| `\.`   | Period                                 | `\(`   | Opening parenthesis |
| `\^`   | Caret                                  | `\)`   | Closing parenthesis |
| `\$`   | Dollar sign                            | `\[`   | Opening bracket     |
| `\\|`  | Pipe                                   | `\]`   | Closing bracket     |
| `\\`   | Backslash                              | `\{`   | Opening brace       |
| `\/`   | Forward slash (only in `/…/` literals) | `\}`   | Closing brace       |

Inside a character set only `\\` and `\]` always need escaping. A `^` needs it only immediately after `[`, and a `-` only between two other characters.

## 🔢 Quantifiers

| Expression              | Repeats the preceding item                            |
|-------------------------|-------------------------------------------------------|
| `{2}`                   | Exactly twice                                         |
| `{2,}`                  | Two or more times                                     |
| `{2,7}`                 | Between two and seven times                           |
| `*`                     | Zero or more                                          |
| `+`                     | One or more                                           |
| `?`                     | Zero or once                                          |
| `*?` `+?` `??` `{2,7}?` | The lazy form — match as *few* characters as possible |

```js
'<b>bold</b>'.match(/<.+>/)[0]    // '<b>bold</b>'  — greedy
'<b>bold</b>'.match(/<.+?>/)[0]   // '<b>'          — lazy
```

## 📍 Anchors & Boundaries

| Expression | Matches at                                                              |
|------------|-------------------------------------------------------------------------|
| `^`        | Start of the string (start of a line with the `m` flag)                 |
| `$`        | End of the string (end of a line with the `m` flag)                     |
| `\b`       | A word boundary                                                         |
| `\B`       | Anywhere that is *not* a word boundary                                  |
| `\A` `\z`  | Start / end of the string in PCRE, Python, Java — **not** in JavaScript |

A word boundary sits between a `\w` and a `\W` (or the edge of the string), so `\bcat\b` matches `cat` in `the cat sat` but not in `concatenate`.

## 🔀 Alternation & Lookaround

| Expression    | Matches                                   |
|---------------|-------------------------------------------|
| `foo\|bar`    | Either `foo` or `bar`                     |
| `foo(?=bar)`  | `foo` only when followed by `bar`         |
| `foo(?!bar)`  | `foo` only when **not** followed by `bar` |
| `(?<=bar)foo` | `foo` only when preceded by `bar`         |
| `(?<!bar)foo` | `foo` only when **not** preceded by `bar` |

Lookaround is *zero-width*: it tests the surroundings without consuming them, so nothing it matches ends up in the result.

## 🎁 Groups & Backreferences

| Expression       | Meaning                                          |
|------------------|--------------------------------------------------|
| `(foo)`          | Capturing group — matches `foo` and remembers it |
| `(?:foo)`        | Non-capturing group — groups without capturing   |
| `(?<year>\d{4})` | Named capturing group                            |
| `\1`             | Backreference to the first group                 |
| `\k<year>`       | Backreference to a named group                   |

```js
// named groups make replacements readable
'2026-08-22'.replace(/(?<y>\d{4})-(?<m>\d{2})-(?<d>\d{2})/, '$<d>/$<m>/$<y>')
// '22/08/2026'

const { groups } = /(?<user>\w+)@(?<host>[\w.]+)/.exec('jane@example.com');
// groups.user === 'jane', groups.host === 'example.com'
```

## 🚩 Flags

| Flag | Name        | Effect                                                    |
|------|-------------|-----------------------------------------------------------|
| `g`  | global      | Find every match, not just the first                      |
| `i`  | ignore case | Case-insensitive matching                                 |
| `m`  | multiline   | `^` and `$` match at line breaks                          |
| `s`  | dotAll      | `.` also matches newlines                                 |
| `u`  | unicode     | Treat the pattern as Unicode code points; enables `\p{…}` |
| `y`  | sticky      | Match only from `lastIndex`, no scanning ahead            |
| `d`  | indices     | Report the start/end index of every group                 |

## 🔁 Replacement Patterns

| Token      | Inserts                     |
|------------|-----------------------------|
| `$&`       | The whole match             |
| `` $` ``   | Everything before the match |
| `$'`       | Everything after the match  |
| `$1`, `$2` | Capture group 1, 2, …       |
| `$<name>`  | A named capture group       |
| `$$`       | A literal dollar sign       |

> ℹ️ Other tools spell these differently: `\1` in `sed`, `\g<1>` in Python, `${1}` in Go.

## 🧪 Where the Groups Show Up (JavaScript)

```js
'2026-08-22'.match(/\d+/g)              // ['2026', '08', '22'] — no groups with /g
[...'a1b2'.matchAll(/([a-z])(\d)/g)]    // every match, with its groups
/(\d+)/.exec('abc 42')                  // ['42', '42', index: 4, ...]
/\d/.test('abc')                        // false
'a1'.replace(/(\w)(\d)/, (m, a, b) => b + a)   // '1a'
'a, b;c'.split(/[,;]\s*/)               // ['a', 'b', 'c']
```

## ⚠️ Gotchas

- **`.` does not match newlines** unless you set the `s` flag — a common surprise on multi-line input.
- **A `/g` regex is stateful.** Reusing the same object across `test()` calls advances `lastIndex` and skips matches; build a fresh one, or reset `lastIndex = 0`.
- **Nested quantifiers backtrack catastrophically.** `(a+)+$` against a long non-matching string can hang the process — avoid overlapping repetition, prefer possessive/atomic groups where the flavour has them.
- **Escape user input** before putting it in a pattern; in JS, `RegExp.escape()` where available, otherwise `s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')`.
- **Don't parse HTML with regex.** Use a parser; regex cannot handle nesting.
- **Backslashes double up in strings**: `new RegExp('\\d+')` is the same pattern as `/\d+/`.

## 📚 Resources

- [MDN — regular expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions)
- [regex101 — build and explain patterns](https://regex101.com)
- [RegExplained](https://leaverou.github.io/regexplained/)
- [Regular-Expressions.info](https://www.regular-expressions.info/)
