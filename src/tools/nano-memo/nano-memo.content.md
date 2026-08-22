**GNU nano** is a small, modeless terminal editor: you start typing straight away, and every command is a control or meta chord shown along the bottom of the screen.

> ℹ️ nano's own help writes `^X` for `Ctrl+X` and `M-X` for `Alt+X` (Meta). This sheet spells them out. On macOS, `Alt` is usually `Esc` pressed first, or `Option` with "Use Option as Meta" enabled.

## 🚀 Starting nano

```bash
# open a file (created on save if it does not exist)
nano <file>

# jump straight to a line, or a line and column
nano +42 <file>
nano +42,8 <file>

# show line numbers
nano -l <file>

# enable mouse support
nano -m <file>

# keep the indentation of the previous line
nano -i <file>

# convert typed tabs to spaces, 4 wide
nano -ET4 <file>

# do not wrap long lines
nano -w <file>

# keep a backup of the original as file~
nano -B <file>

# read-only view mode
nano -v <file>

# open at the position you left last time
nano -P <file>
```

## 💾 File Handling

| Shortcut | Action                            |
|----------|-----------------------------------|
| `Ctrl+S` | Save the current file             |
| `Ctrl+O` | Write to a named file ("save as") |
| `Ctrl+R` | Insert another file into this one |
| `Ctrl+X` | Close the buffer and leave nano   |
| `Alt+<`  | Switch to the previous buffer     |
| `Alt+>`  | Switch to the next buffer         |

## ✏️ Editing

| Shortcut            | Action                                       |
|---------------------|----------------------------------------------|
| `Ctrl+K`            | Cut the current line into the cutbuffer      |
| `Alt+6`             | Copy the current line into the cutbuffer     |
| `Ctrl+U`            | Paste the cutbuffer                          |
| `Alt+T`             | Cut from the cursor to the end of the buffer |
| `Alt+U`             | Undo the last action                         |
| `Alt+E`             | Redo the last undone action                  |
| `Alt+3`             | Comment or uncomment the line or selection   |
| `Ctrl+]`            | Complete the current word                    |
| `Alt+A`             | Set the mark — move to select                |
| `Tab` / `Shift+Tab` | Indent / unindent the selection              |

## 🔎 Search & Replace

| Shortcut | Action                      |
|----------|-----------------------------|
| `Ctrl+W` | Search forward ("where is") |
| `Ctrl+Q` | Search backward             |
| `Alt+W`  | Repeat the search forward   |
| `Alt+Q`  | Repeat the search backward  |
| `Alt+R`  | Search and replace          |

> 💡 At the search prompt, `Alt+C` toggles case sensitivity, `Alt+R` switches to regular expressions and `Alt+B` limits the search to the selection.

## ⌫ Deletion

| Shortcut   | Action                                |
|------------|---------------------------------------|
| `Ctrl+H`   | Delete the character to the left      |
| `Ctrl+D`   | Delete the character under the cursor |
| `Alt+Bksp` | Delete the word to the left           |
| `Ctrl+Del` | Delete the word to the right          |
| `Alt+Del`  | Delete the whole line                 |

## 🧭 Moving Around

| Shortcut            | Action                                    |
|---------------------|-------------------------------------------|
| `Ctrl+B` / `Ctrl+F` | One character left / right                |
| `Ctrl+←` / `Ctrl+→` | One word left / right                     |
| `Ctrl+A` / `Ctrl+E` | Start / end of the line                   |
| `Ctrl+P` / `Ctrl+N` | One line up / down                        |
| `Ctrl+↑` / `Ctrl+↓` | Previous / next block                     |
| `Ctrl+Y` / `Ctrl+V` | One page up / down                        |
| `Alt+\` / `Alt+/`   | Top / bottom of the buffer                |
| `Alt+G`             | Go to a line number                       |
| `Alt+]`             | Jump to the matching bracket              |
| `Alt+↑` / `Alt+↓`   | Scroll the view without moving the cursor |

## 🔧 Operations

| Shortcut | Action                                       |
|----------|----------------------------------------------|
| `Ctrl+T` | Run a command, or pipe the buffer through it |
| `Ctrl+J` | Justify the paragraph or selection           |
| `Alt+J`  | Justify the whole buffer                     |
| `Alt+B`  | Run a syntax check (linter)                  |
| `Alt+F`  | Run a formatter                              |
| `Alt+:`  | Start or stop recording a macro              |
| `Alt+;`  | Replay the macro                             |

## ℹ️ Information & Display

| Shortcut | Action                             |
|----------|------------------------------------|
| `Ctrl+G` | Open the help text                 |
| `Ctrl+C` | Report the cursor position         |
| `Alt+D`  | Count lines, words and characters  |
| `Alt+N`  | Toggle line numbers                |
| `Alt+P`  | Toggle visible whitespace          |
| `Alt+X`  | Hide or show the shortcut bar      |
| `Alt+V`  | Insert the next keystroke verbatim |
| `Ctrl+L` | Redraw the screen                  |

## ⚙️ Configuration

Persistent settings live in `~/.nanorc` (system-wide: `/etc/nanorc`).

```bash
set linenumbers
set mouse
set tabsize 4
set tabstospaces
set autoindent
set constantshow
set softwrap
set positionlog

# syntax highlighting definitions shipped with nano
include /usr/share/nano/*.nanorc
```

## 📚 Resources

- [Official documentation](https://www.nano-editor.org/docs.php)
- [Manual page](https://man7.org/linux/man-pages/man1/nano.1.html)
- Built-in help: `Ctrl+G`
