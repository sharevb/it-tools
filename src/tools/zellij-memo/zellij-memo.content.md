**Zellij** is a terminal workspace and multiplexer with panes, tabs, layouts, session persistence and WebAssembly plugins. It is modal: a `Ctrl` chord enters a mode, then single keys act inside it.

> ℹ️ Press `Ctrl+p` for **pane** mode, `Ctrl+t` for **tab** mode, `Ctrl+n` for **resize**, `Ctrl+h` for **move**, `Ctrl+s` for **search/scroll**, `Ctrl+o` for **session**. `Esc` or `Ctrl+c` returns to normal mode.

## 📦 Installation

```bash
# from crates.io
cargo install --locked zellij

# from a package manager
brew install zellij

# try it without installing anything
bash <(curl -L https://zellij.dev/launch)
```

## 🚀 Sessions

```bash
# start a session
zellij

# start a named session
zellij --session <name>

# attach to a session
zellij attach <name>

# attach, creating the session if it does not exist
zellij attach --create <name>

# list sessions
zellij list-sessions

# kill a session (it stays resurrectable)
zellij kill-session <name>

# kill every session
zellij kill-all-sessions

# delete a session for good
zellij delete-session <name>
```

## 🪟 Pane Mode — `Ctrl+p`

| Key             | Action                                          |
|-----------------|-------------------------------------------------|
| `n`             | New pane                                        |
| `d`             | Split down (new pane below)                     |
| `r`             | Split right (new pane to the right)             |
| `x`             | Close the focused pane                          |
| `f`             | Toggle fullscreen for the focused pane          |
| `w`             | Toggle a floating pane                          |
| `e`             | Embed a floating pane, or float an embedded one |
| `c`             | Rename the pane                                 |
| `z`             | Toggle the pane frames                          |
| `←↑↓→` / `hjkl` | Move the focus                                  |

## 📑 Tab Mode — `Ctrl+t`

| Key          | Action                                      |
|--------------|---------------------------------------------|
| `n`          | New tab                                     |
| `x`          | Close the tab                               |
| `r`          | Rename the tab                              |
| `s`          | Toggle sync — type into every pane at once  |
| `b`          | Break the focused pane out into its own tab |
| `[` / `]`    | Move the pane to the previous / next tab    |
| `←→` / `1…9` | Switch tabs                                 |

## 📐 Resize & Move

| Mode              | Keys            | Action                          |
|-------------------|-----------------|---------------------------------|
| Resize — `Ctrl+n` | `←↑↓→` / `hjkl` | Grow the pane in that direction |
| Resize — `Ctrl+n` | `+` / `-`       | Grow or shrink the pane         |
| Move — `Ctrl+h`   | `←↑↓→` / `hjkl` | Move the pane in the layout     |

## 🔍 Search & Scrollback — `Ctrl+s`

| Key             | Action                                |
|-----------------|---------------------------------------|
| `s`             | Search the scrollback                 |
| `e`             | Open the scrollback in your `$EDITOR` |
| `PgUp` / `PgDn` | Scroll a page at a time               |
| `n` / `p`       | Next / previous search hit            |
| `c`             | Clear the search                      |

## 🗄 Session Mode — `Ctrl+o`

| Key | Action                                      |
|-----|---------------------------------------------|
| `d` | Detach — the session keeps running          |
| `w` | Session manager (switch, resurrect, delete) |
| `p` | Plugin manager                              |
| `c` | Configuration                               |

> 💡 `Ctrl+g` locks the interface so every key goes straight to the program in the pane (useful when the app wants `Ctrl+p`). Press `Ctrl+g` again to unlock. `Ctrl+q` quits Zellij.

## ⚡ Shortcuts Without a Mode

| Keys                    | Action                    |
|-------------------------|---------------------------|
| `Alt+n`                 | New pane                  |
| `Alt+←↑↓→` / `Alt+hjkl` | Move the focus            |
| `Alt+=` / `Alt+-`       | Resize the focused pane   |
| `Alt+[` / `Alt+]`       | Cycle through the layouts |
| `Alt+f`                 | Toggle a floating pane    |
| `Alt+i` / `Alt+o`       | Move the tab left / right |

## 🛠 Layouts

Layouts are KDL files that describe the panes and tabs a session starts with.

```bash
# start with a layout
zellij --layout <path>/layout.kdl

# dump the built-in default to start from
zellij setup --dump-layout default > layout.kdl
```

```kdl
layout {
  tab name="editor" {
    pane split_direction="vertical" {
      pane
      pane command="cargo" {
        args "watch" "-x" "test"
      }
    }
  }
}
```

## ⚙️ Configuration

The config file is `~/.config/zellij/config.kdl`.

```bash
# write the default configuration out to edit it
zellij setup --dump-config > ~/.config/zellij/config.kdl

# check where zellij looks for its files
zellij setup --check
```

```kdl
theme "gruvbox-dark"
default_shell "fish"
pane_frames false

keybinds {
  normal {
    bind "Ctrl g" { SwitchToMode "locked"; }
  }
}
```

## 🔌 Running Commands & Plugins

```bash
# open a new pane running a command
zellij run -- htop

# open a file in a new pane, in your editor
zellij edit <file>

# drive a running session from a script
zellij action new-tab --name deploy
zellij action write-chars "make deploy"

# load a WebAssembly plugin
zellij --plugin <path>/plugin.wasm
```

## 📚 Resources

- [Documentation](https://zellij.dev/documentation/)
- [Layouts reference](https://zellij.dev/documentation/layouts)
- [Configuration reference](https://zellij.dev/documentation/configuration)
