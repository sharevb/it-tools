**tmux** is a terminal multiplexer: it keeps shell sessions alive on the server, splits one terminal into windows and panes, and lets you detach and reattach without losing anything.

> ℹ️ Almost every shortcut starts with the **prefix**, `Ctrl+b` by default: press the prefix, release it, then press the key. In the tables below `Ctrl+b c` means "prefix, then `c`".

## 🚀 Sessions from the Shell

```bash
# start a session
tmux

# start a named session
tmux new -s <name>

# start a named session in the background
tmux new -s <name> -d

# attach if the session exists, create it otherwise
tmux new-session -A -s <name>

# list sessions
tmux ls

# attach to the most recent session
tmux attach

# attach to a named session
tmux attach -t <name>

# attach and detach any other client (steal the session)
tmux attach -d -t <name>

# rename a session
tmux rename-session -t <old> <new>

# kill one session
tmux kill-session -t <name>

# kill the server and every session on it
tmux kill-server
```

## ⌨️ Sessions

| Keys       | Action                           |
|------------|----------------------------------|
| `Ctrl+b d` | Detach from the session          |
| `Ctrl+b s` | Interactive session list         |
| `Ctrl+b $` | Rename the current session       |
| `Ctrl+b (` | Previous session                 |
| `Ctrl+b )` | Next session                     |
| `Ctrl+b w` | Tree of every session and window |

## 📂 Windows (tabs)

| Keys         | Action                           |
|--------------|----------------------------------|
| `Ctrl+b c`   | Create a window                  |
| `Ctrl+b ,`   | Rename the current window        |
| `Ctrl+b n`   | Next window                      |
| `Ctrl+b p`   | Previous window                  |
| `Ctrl+b l`   | Last (previously used) window    |
| `Ctrl+b 0…9` | Jump to a window by number       |
| `Ctrl+b w`   | Choose a window from a list      |
| `Ctrl+b f`   | Find a window by name            |
| `Ctrl+b .`   | Move the window to another index |
| `Ctrl+b &`   | Kill the current window          |

## 🪟 Panes (splits)

| Keys              | Action                                     |
|-------------------|--------------------------------------------|
| `Ctrl+b %`        | Split into left / right panes              |
| `Ctrl+b "`        | Split into top / bottom panes              |
| `Ctrl+b ←↑↓→`     | Move the focus in that direction           |
| `Ctrl+b o`        | Cycle through the panes                    |
| `Ctrl+b ;`        | Jump to the previously focused pane        |
| `Ctrl+b q`        | Show pane numbers (press one to jump)      |
| `Ctrl+b z`        | Zoom the pane to full screen, and back     |
| `Ctrl+b x`        | Kill the current pane                      |
| `Ctrl+b {` / `}`  | Swap the pane with the previous / next one |
| `Ctrl+b space`    | Cycle through the preset layouts           |
| `Ctrl+b !`        | Break the pane out into its own window     |
| `Ctrl+b Alt+←↑↓→` | Resize the pane in that direction          |

## 📋 Copy Mode & Scrollback

| Keys        | Action                                        |
|-------------|-----------------------------------------------|
| `Ctrl+b [`  | Enter copy mode (scroll with the arrows/PgUp) |
| `space`     | Start the selection                           |
| `Enter`     | Copy the selection and leave copy mode        |
| `Ctrl+b ]`  | Paste the buffer                              |
| `/` and `?` | Search forward / backward (vi mode)           |
| `q`         | Leave copy mode                               |

> 💡 `setw -g mode-keys vi` gives you vi navigation in copy mode; `v` then starts the selection and `y` yanks it.

## ⚙️ Configuration

```bash
# reload the configuration without restarting
tmux source-file ~/.tmux.conf

# every key binding currently active
tmux list-keys

# every option and its value
tmux show-options -g
```

A reasonable `~/.tmux.conf` starting point:

```bash
# use Ctrl+a as the prefix, like GNU Screen
set -g prefix C-a
unbind C-b
bind C-a send-prefix

# number windows from 1 and close the gaps
set -g base-index 1
set -g renumber-windows on

# mouse: focus panes, resize splits, scroll
set -g mouse on

# vi keys in copy mode, and a longer scrollback
setw -g mode-keys vi
set -g history-limit 10000

# reload with prefix + r
bind r source-file ~/.tmux.conf \; display "Config reloaded"
```

## 🧭 Scripting & Automation

```bash
# run a command in a target pane
tmux send-keys -t <session>:<window>.<pane> "make test" Enter

# print the contents of a pane
tmux capture-pane -p -t <session>:<window>

# open the command prompt inside tmux (prefix + :)
tmux command-prompt

# build a session non-interactively
tmux new -d -s dev -n editor
tmux split-window -t dev -h
tmux attach -t dev
```

## 📄 Example Workflow

```bash
# 1. start a named session
tmux new -s dev

# 2. split the window: prefix % (left/right), prefix " (top/bottom)
# 3. add another window with prefix c
# 4. detach with prefix d — everything keeps running

# 5. come back later
tmux attach -t dev
```

## 📚 Resources

- [tmux wiki and getting-started guide](https://github.com/tmux/tmux/wiki)
- [Manual page](https://man7.org/linux/man-pages/man1/tmux.1.html)
- Built-in help: `Ctrl+b ?` lists every active binding
