**`sed`** is the stream editor: it reads input line by line into the *pattern space*, applies a script to each line, and prints the result. It never needs the whole file in memory, so it happily edits gigabytes.

```bash
sed [options] 'script' [file...]
```

> ℹ️ Examples here use **GNU sed** (Linux). BSD/macOS differs on `-i`, `-E` and the `a`/`i`/`c` commands — see the callouts. `brew install gnu-sed` gives you `gsed` on macOS.

## ⚙️ Options

| Option         | Description                                                        |
|----------------|--------------------------------------------------------------------|
| `-n`           | Do not print automatically — pair it with `p`                      |
| `-e <script>`  | Add a script; repeat for several                                   |
| `-f <file>`    | Read the script from a file                                        |
| `-i[SUFFIX]`   | Edit files in place, optionally keeping a backup                   |
| `-E` (or `-r`) | Extended regular expressions — no backslashes before `(`, `+`, `?` |
| `-s`           | Treat each file separately instead of one long stream              |
| `-z`           | Split on NUL instead of newline (pairs with `find -print0`)        |
| `--debug`      | Show how sed executes the script (GNU 4.6+)                        |

## 📍 Addressing

An address decides *which* lines a command applies to. Without one, the command applies to every line.

| Address         | Matches                                             |
|-----------------|-----------------------------------------------------|
| `5`             | Line 5                                              |
| `$`             | The last line                                       |
| `/regex/`       | Every line matching the pattern                     |
| `\%regex%`      | Same, with `%` as the delimiter (handy for paths)   |
| `2,7`           | Lines 2 to 7                                        |
| `2,$`           | Line 2 to the end                                   |
| `/start/,/end/` | From the first `start` to the next `end`, inclusive |
| `2,+3`          | Line 2 and the three lines after it                 |
| `0~3`           | Every third line (GNU)                              |
| `2~5`           | Line 2, then every fifth line (GNU)                 |
| `/regex/!`      | Invert — every line that does **not** match         |

```bash
# print line 5
sed -n '5p' file

# print lines 3 to 5
sed -n '3,5p' file

# print everything between two markers
sed -n '/BEGIN/,/END/p' file

# delete every line except the ones matching
sed -n '/keep/p' file
sed '/keep/!d' file

# count the lines (like wc -l)
sed -n '$=' file
```

## 🔁 Substitution

```bash
sed 's/pattern/replacement/flags' file
```

| Flag   | Effect                                               |
|--------|------------------------------------------------------|
| *none* | Replace the first match on each line                 |
| `g`    | Replace every match on the line                      |
| `i`    | Case-insensitive matching                            |
| `p`    | Print the line when a replacement happened           |
| `2`    | Replace only the second match — any number works     |
| `2g`   | Replace from the second match to the end of the line |
| `w f`  | Write the changed lines to file `f`                  |
| `e`    | Run the result as a shell command (GNU)              |

```bash
# first match on each line
sed 's/foo/bar/' file

# every match on the line
sed 's/foo/bar/g' file

# only the second match
sed 's/foo/bar/2' file

# every match, ignoring case
sed 's/foo/bar/gI' file

# & stands for the whole match — wrap every number in brackets
sed 's/[0-9]\+/[&]/g' file

# capture groups: \( \) in basic regex, ( ) with -E
sed 's/\(foo\)bar/\1baz/' file
sed -E 's/(\w+)@(\w+)/\2 at \1/' file

# any character can be the delimiter — pick one that is not in the text
sed 's|/usr/bin|/usr/local/bin|' file
sed 's#http://#https://#' file

# GNU case conversion: upper-case the first word
sed 's/\w\+/\U&/' file

# ...and lower-case a whole line
sed -E 's/(.*)/\L\1/' file

# only substitute on lines that match an address
sed '/^deb /s/http:/https:/' sources.list
```

## ✂️ Command Reference

| Command              | Does                                                            |
|----------------------|-----------------------------------------------------------------|
| `p`                  | Print the pattern space                                         |
| `d`                  | Delete it and start the next cycle                              |
| `s`                  | Substitute                                                      |
| `y`                  | Transliterate characters, like `tr`                             |
| `a text`             | Append a line after the current one                             |
| `i text`             | Insert a line before the current one                            |
| `c text`             | Replace the matched line(s)                                     |
| `q`                  | Quit — `q5` also sets the exit status                           |
| `Q`                  | Quit without printing the current line                          |
| `r file`             | Read a file in after the current line                           |
| `w file`             | Write the pattern space to a file                               |
| `=`                  | Print the current line number                                   |
| `n` / `N`            | Load the next line, replacing / appending to the pattern space  |
| `D` / `P`            | Delete / print up to the first newline of the pattern space     |
| `h` `H`              | Copy / append the pattern space into the hold space             |
| `g` `G`              | Copy / append the hold space into the pattern space             |
| `x`                  | Swap the pattern and hold spaces                                |
| `b` `t` `T` `:label` | Branching — jump, jump if a substitution happened, jump if none |

## 🗑 Deleting & Printing

```bash
# by line number
sed '2d' file
sed '5,10d' file
sed '$d' file

# lines containing a word
sed '/error/d' file

# blank lines
sed '/^$/d' file

# comment lines
sed '/^#/d' file

# blank or whitespace-only lines
sed '/^\s*$/d' file

# strip comments and blank lines from a config
sed -e '/^#/d' -e '/^$/d' /etc/ssh/sshd_config

# from the top up to the first match
sed '1,/pattern/d' file

# everything between two markers
sed '/start/,/end/d' file

# keep only what matches
sed -n '/pattern/p' file
```

## 🧵 Insert, Append & Change

```bash
# GNU one-line form
sed '/pattern/a appended line' file
sed '/pattern/i inserted line' file
sed '/pattern/c replacement line' file

# portable form (works on BSD/macOS too)
sed '/pattern/a\
appended line' file

# add a line at the very top or bottom
sed '1i #!/bin/bash' file
sed '$a # end of file' file

# insert the contents of another file after a marker
sed '/INCLUDE HERE/r snippet.txt' file
```

## 🧠 Multi-line & Hold Space

The hold space is a second buffer that survives between lines — that is what makes sed more than a line-at-a-time filter.

```bash
# join every pair of lines
sed 'N;s/\n/ /' file

# reverse the file (what tac does)
sed -n '1!G;h;$p' file

# print the line before each match
sed -n '/pattern/{x;p;x};h' file

# print the line after each match
sed -n '/pattern/{n;p}' file

# squeeze runs of blank lines into one
sed '/^$/{N;/^\n$/D}' file

# delete the last two lines
sed 'N;$!P;$!D;$d' file
```

## 🧨 In-Place Editing

```bash
# GNU: edit in place
sed -i 's/foo/bar/g' file

# keep a backup as file.bak
sed -i.bak 's/foo/bar/g' file

# several files at once
sed -i 's/foo/bar/g' *.conf

# every matching file in a tree
find . -name '*.py' -exec sed -i 's/old_api/new_api/g' {} +
```

> ⚠️ **BSD/macOS `sed` requires an argument to `-i`.** `sed -i '' 's/foo/bar/' file` edits without a backup there, while the same command on GNU sed reads `''` as the script. Write `sed -i.bak` for something that works on both, or use `gsed`.
>
> 💡 Always run the command without `-i` first and read the output. `-i` has no undo.

## 🧰 Recipes

```bash
# trim leading and trailing whitespace
sed 's/^[[:space:]]*//; s/[[:space:]]*$//' file

# collapse repeated spaces
sed 's/  */ /g' file

# tabs to four spaces
sed 's/\t/    /g' file

# strip Windows carriage returns
sed 's/\r$//' file

# strip HTML tags
sed -e 's/<[^>]*>//g' page.html

# number the lines
sed = file | sed 'N;s/\n/\t/'

# print a specific line and quit early (fast on huge files)
sed -n '1000{p;q}' file

# extract the value of a key from a config file
sed -n 's/^Port[[:space:]]*//p' /etc/ssh/sshd_config

# replace only in lines between two markers
sed '/BEGIN/,/END/ s/old/new/g' file

# change a value only on the first match, then stop
sed '0,/version:/s//version: 2/' file

# comment out a line
sed '/^ExecStart/s/^/#/' unit.service

# uncomment a line
sed '/^#ExecStart/s/^#//' unit.service
```

## 📚 Resources

- [GNU sed manual](https://www.gnu.org/software/sed/manual/sed.html)
- [One-liners, annotated (sed1line)](https://sed.sourceforge.io/sed1line.txt)
- Manual page: `man 1 sed`
