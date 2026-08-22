**Vim** is a modal editor: keys mean different things depending on the mode you are in. Most commands compose as **count + operator + motion** — `3dw` deletes three words, `d$` deletes to the end of the line — so learning a new motion instantly upgrades every operator you already know.

> 💡 New to Vim? Run `vimtutor` in a terminal — 30 minutes, and the rest of this sheet starts making sense.

## 🚦 Modes

| Mode         | Enter with              | Leave with       | For                         |
|--------------|-------------------------|------------------|-----------------------------|
| Normal       | `Esc` (or `Ctrl-[`)     | —                | Moving and running commands |
| Insert       | `i` `a` `o` `I` `A` `O` | `Esc`            | Typing text                 |
| Visual       | `v` `V` `Ctrl-v`        | `Esc`            | Selecting text              |
| Command-line | `:` `/` `?`             | `Enter` or `Esc` | Ex commands and searches    |
| Replace      | `R`                     | `Esc`            | Overtyping                  |

## 🧭 Cursor Movement

| Key                   | Moves to                                                          |
|-----------------------|-------------------------------------------------------------------|
| `h` `j` `k` `l`       | Left, down, up, right                                             |
| `w` / `W`             | Start of the next word / WORD (WORD ignores punctuation)          |
| `e` / `E`             | End of the next word / WORD                                       |
| `b` / `B`             | Start of the previous word / WORD                                 |
| `ge` / `gE`           | End of the previous word / WORD                                   |
| `0`                   | First column of the line                                          |
| `^`                   | First non-blank character                                         |
| `$`                   | End of the line                                                   |
| `g_`                  | Last non-blank character                                          |
| `f<char>` / `F<char>` | Next / previous occurrence of a character on the line             |
| `t<char>` / `T<char>` | Just before the next / after the previous occurrence              |
| `;` / `,`             | Repeat the last `f`/`t` forwards / backwards                      |
| `}` / `{`             | Next / previous paragraph                                         |
| `)` / `(`             | Next / previous sentence                                          |
| `gg` / `G`            | First / last line of the file                                     |
| `<n>G` or `:<n>`      | Line `n`                                                          |
| `H` `M` `L`           | Top, middle, bottom of the screen                                 |
| `Ctrl-d` / `Ctrl-u`   | Half a page down / up                                             |
| `Ctrl-f` / `Ctrl-b`   | A full page down / up                                             |
| `zz` `zt` `zb`        | Scroll so the cursor line is centred / at the top / at the bottom |
| `%`                   | The matching bracket, brace or parenthesis                        |
| `Ctrl-o` / `Ctrl-i`   | Back / forward through the jump list                              |
| `g;` / `g,`           | Back / forward through the change list                            |
| `''` / ` `` `         | Back to where the last jump started                               |

## ✏️ Entering Insert Mode

| Key       | Starts typing                                        |
|-----------|------------------------------------------------------|
| `i` / `I` | Before the cursor / at the first non-blank character |
| `a` / `A` | After the cursor / at the end of the line            |
| `o` / `O` | On a new line below / above                          |
| `s` / `S` | Deleting the character / the whole line first        |
| `cc`      | Replacing the whole line                             |
| `C`       | Replacing from the cursor to the end of the line     |
| `gi`      | Where you last left insert mode                      |
| `Ctrl-o`  | Run one normal-mode command, then return to insert   |

## 🔧 Operators & Text Objects

An operator waits for a motion or a text object. Doubling the operator (`dd`, `yy`, `>>`) applies it to the whole line.

| Operator           | Does                                  |
|--------------------|---------------------------------------|
| `d`                | Delete (into a register)              |
| `c`                | Change — delete, then insert          |
| `y`                | Yank (copy)                           |
| `>` / `<`          | Indent / unindent                     |
| `=`                | Re-indent                             |
| `gu` / `gU` / `g~` | Lower-case / upper-case / toggle case |
| `gq`               | Reformat to `textwidth`               |

| Text object | Selects                                              |
|-------------|------------------------------------------------------|
| `iw` / `aw` | Inner word / a word plus its trailing space          |
| `is` / `as` | Sentence                                             |
| `ip` / `ap` | Paragraph                                            |
| `i"` `a"`   | Inside / including the double quotes                 |
| `i'` `a'`   | Inside / including the single quotes                 |
| `i(` `a(`   | Inside / including the parentheses (also `ib`, `ab`) |
| `i{` `a{`   | Inside / including the braces (also `iB`, `aB`)      |
| `i[` `a[`   | Inside / including the brackets                      |
| `i<` `a<`   | Inside / including the angle brackets                |
| `it` / `at` | Inside / including an HTML or XML tag                |

```text
ciw     change the word under the cursor
ci"     change everything inside the quotes
da(     delete the parentheses and their contents
yi{     yank the body of a block
2dd     delete two lines
d3w     delete three words
>ap     indent the whole paragraph
```

## ✂️ Editing

| Key                          | Does                                                  |
|------------------------------|-------------------------------------------------------|
| `x` / `X`                    | Delete the character under / before the cursor        |
| `r<char>`                    | Replace one character, staying in normal mode         |
| `R`                          | Overtype until `Esc`                                  |
| `~`                          | Toggle the case of one character                      |
| `J` / `gJ`                   | Join the next line, with / without a space            |
| `u` / `Ctrl-r`               | Undo / redo                                           |
| `U`                          | Undo every change on the current line                 |
| `.`                          | Repeat the last change — the most valuable key in Vim |
| `Ctrl-a` / `Ctrl-x`          | Increment / decrement the number under the cursor     |
| `>>` / `<<`                  | Indent / unindent the line                            |
| `==`                         | Re-indent the line                                    |
| `:earlier 10m` / `:later 5m` | Move through the undo tree by time                    |

## 📋 Copy, Paste & Registers

| Key            | Does                                                   |
|----------------|--------------------------------------------------------|
| `yy` (or `Y`)  | Yank the line                                          |
| `y<motion>`    | Yank what the motion covers                            |
| `p` / `P`      | Paste after / before the cursor                        |
| `]p`           | Paste and match the current indentation                |
| `dd` / `D`     | Delete the line / to the end of the line               |
| `"ayy` / `"ap` | Yank into and paste from register `a`                  |
| `"+y` / `"+p`  | Yank to and paste from the system clipboard            |
| `"0p`          | Paste the last **yank** (never overwritten by deletes) |
| `:registers`   | Show every register                                    |
| `xp` / `ddp`   | Swap two characters / two lines                        |

> ⚠️ In Vim, deleting also *yanks* — `dd` overwrites the unnamed register. Use `"0p` to paste what you last copied, or yank into a named register first.

## 🔍 Search & Replace

| Command                 | Does                                                       |
|-------------------------|------------------------------------------------------------|
| `/pattern` / `?pattern` | Search forwards / backwards                                |
| `n` / `N`               | Next / previous match                                      |
| `*` / `#`               | Search for the word under the cursor, forwards / backwards |
| `:noh`                  | Clear the search highlighting                              |
| `:s/old/new/`           | Replace the first match on the line                        |
| `:s/old/new/g`          | Replace every match on the line                            |
| `:%s/old/new/g`         | Replace throughout the file                                |
| `:%s/old/new/gc`        | ...asking for confirmation on each                         |
| `:%s/old/new/gi`        | ...ignoring case                                           |
| `:'<,'>s/old/new/g`     | Only inside the visual selection                           |
| `:%s/\<word\>/new/g`    | Whole words only                                           |
| `&`                     | Repeat the last substitution on this line                  |

### The global command

`:g` runs an Ex command on every line matching a pattern — the power tool of Vim.

```text
:g/TODO/d           delete every line containing TODO
:v/keep/d           delete every line NOT containing 'keep' (:v is :g!)
:g/^$/d             delete all blank lines
:g/error/normal A;  append a semicolon to every matching line
:g/pattern/t$       copy matching lines to the end of the file
:g/pattern/m0       move matching lines to the top (reverses their order)
```

## 🎨 Visual Mode

| Key             | Does                                   |
|-----------------|----------------------------------------|
| `v`             | Character-wise selection               |
| `V`             | Line-wise selection                    |
| `Ctrl-v`        | Block (column) selection               |
| `gv`            | Reselect the previous selection        |
| `o`             | Jump to the other end of the selection |
| `d` / `y` / `c` | Delete, yank or change the selection   |
| `>` / `<`       | Indent / unindent the selection        |
| `u` / `U` / `~` | Lower-case, upper-case, toggle         |
| `:'<,'>`        | Run an Ex command over the selection   |

```text
Ctrl-v, select lines, I, type, Esc     insert the same text on every line
Ctrl-v, select lines, $, A, type, Esc  append at the end of every line
Ctrl-v, select, d                      delete a rectangular block
```

## 🔖 Marks & Jumps

| Key           | Does                                           |
|---------------|------------------------------------------------|
| `m<a-z>`      | Set a mark in this file                        |
| `m<A-Z>`      | Set a global mark, across files                |
| `` `a ``      | Jump to mark `a`, exact position               |
| `'a`          | Jump to the start of the line holding mark `a` |
| `` `. ``      | Jump to the position of the last edit          |
| `:marks`      | List every mark                                |
| `:delmarks a` | Delete a mark                                  |

## 🎬 Macros

| Key           | Does                             |
|---------------|----------------------------------|
| `q<a-z>`      | Start recording into a register  |
| `q`           | Stop recording                   |
| `@a`          | Play the macro back              |
| `@@`          | Replay the last macro            |
| `10@a`        | Run it ten times                 |
| `:%normal @a` | Run it on every line of the file |

## 📂 Files, Buffers, Windows & Tabs

| Command                      | Does                                                |
|------------------------------|-----------------------------------------------------|
| `:e <file>`                  | Open a file                                         |
| `:e!`                        | Reload, discarding changes                          |
| `:w` / `:w <file>`           | Save / save as                                      |
| `:wa`                        | Save every changed buffer                           |
| `:q` / `:q!`                 | Quit / quit without saving                          |
| `:wq` or `:x` or `ZZ`        | Save and quit                                       |
| `ZQ`                         | Quit without saving                                 |
| `:ls` / `:buffers`           | List the open buffers                               |
| `:b <n>` / `:b <name>`       | Switch to a buffer                                  |
| `:bn` / `:bp` / `:bd`        | Next / previous / delete buffer                     |
| `:sp` / `:vsp`               | Split horizontally / vertically                     |
| `Ctrl-w h j k l`             | Move to the window in that direction                |
| `Ctrl-w w`                   | Cycle through the windows                           |
| `Ctrl-w q` / `Ctrl-w o`      | Close this window / close all the others            |
| `Ctrl-w =`                   | Make all windows the same size                      |
| `Ctrl-w +` / `-` / `<` / `>` | Resize the window                                   |
| `:tabnew <file>`             | Open a new tab                                      |
| `gt` / `gT`                  | Next / previous tab                                 |
| `:tabc` / `:tabo`            | Close this tab / close all the others               |
| `:r <file>` / `:r !cmd`      | Read a file, or a command's output, into the buffer |
| `:!<cmd>`                    | Run a shell command                                 |
| `:%!<cmd>`                   | Filter the whole buffer through a command           |
| `:w !sudo tee %`             | Save a file you opened without permission           |

## 📑 Folding

| Key          | Does                             |
|--------------|----------------------------------|
| `zf<motion>` | Create a fold                    |
| `za` / `zA`  | Toggle this fold / recursively   |
| `zo` / `zc`  | Open / close this fold           |
| `zR` / `zM`  | Open / close every fold          |
| `zj` / `zk`  | Move to the next / previous fold |

## 🧩 Completion & Spelling

| Key                          | Does                                      |
|------------------------------|-------------------------------------------|
| `Ctrl-n` / `Ctrl-p`          | Complete a word from the open buffers     |
| `Ctrl-x Ctrl-f`              | Complete a file path                      |
| `Ctrl-x Ctrl-l`              | Complete a whole line                     |
| `Ctrl-x Ctrl-o`              | Omni-completion (language-aware)          |
| `:set spell spelllang=en_us` | Turn spell checking on                    |
| `]s` / `[s`                  | Next / previous misspelling               |
| `z=`                         | Suggestions for the word under the cursor |
| `zg` / `zw`                  | Add to the dictionary / mark as wrong     |

## 🧵 Quickfix & Diff

| Command                 | Does                                     |
|-------------------------|------------------------------------------|
| `:make` / `:grep <pat>` | Fill the quickfix list                   |
| `:copen` / `:cclose`    | Open / close the quickfix window         |
| `:cn` / `:cp`           | Jump to the next / previous entry        |
| `:cfirst` / `:clast`    | First / last entry                       |
| `vimdiff a b`           | Open two files in diff mode              |
| `]c` / `[c`             | Next / previous difference               |
| `do` / `dp`             | Obtain / put the change under the cursor |
| `:diffupdate`           | Refresh the diff                         |

## ⚙️ Handy `:set` Options

| Option                      | Effect                                     |
|-----------------------------|--------------------------------------------|
| `:set nu` / `:set nonu`     | Show / hide line numbers                   |
| `:set rnu`                  | Relative line numbers — makes `5j` obvious |
| `:set ic` / `:set noic`     | Ignore case when searching                 |
| `:set is` / `:set hls`      | Incremental search / highlight matches     |
| `:set wrap` / `:set nowrap` | Soft-wrap long lines                       |
| `:set list`                 | Show tabs and trailing whitespace          |
| `:set paste`                | Stop auto-indent mangling pasted text      |
| `:set ft=<type>`            | Force a file type                          |
| `:set sw=4 ts=4 et`         | Four-space indentation, spaces not tabs    |
| `:syntax on`                | Syntax highlighting                        |

## 📄 A Starting `~/.vimrc`

```vim
set nocompatible
syntax on
filetype plugin indent on

set number relativenumber
set incsearch hlsearch ignorecase smartcase
set expandtab shiftwidth=2 tabstop=2
set scrolloff=5
set hidden
set undofile
set clipboard=unnamedplus

" a leader key, and a few mappings that pay for themselves
let mapleader = " "
nnoremap <leader>w :w<CR>
nnoremap <leader>/ :nohlsearch<CR>
nnoremap <C-h> <C-w>h
nnoremap <C-j> <C-w>j
nnoremap <C-k> <C-w>k
nnoremap <C-l> <C-w>l
```

> ℹ️ Mappings that start with `<leader>` are **your** configuration, not built-in Vim. If a leader shortcut on someone else's cheat sheet does nothing, that is why.

## 📚 Resources

- `vimtutor` — the built-in 30-minute tutorial
- `:help <topic>` — Vim's own documentation, and it is excellent
- [Vim documentation](https://vimhelp.org/)
- [Vim Adventures — learn by playing](https://vim-adventures.com/)
- [Practical Vim (book)](https://pragprog.com/titles/dnvim2/practical-vim-second-edition/)
