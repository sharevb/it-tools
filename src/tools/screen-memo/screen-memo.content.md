**GNU Screen** is a terminal multiplexer: it runs several shell sessions inside one terminal, keeps them alive after you disconnect, and lets you reattach later from anywhere.

> ℹ️ Every shortcut starts with the **prefix**, `Ctrl+a` by default: press the prefix, release it, then press the key. In the tables below `Ctrl+a c` means "prefix, then `c`".

## 🚀 Sessions from the Shell

```bash
# start a session
screen

# start a named session
screen -S <name>

# list running sessions
screen -ls

# reattach to a session
screen -r <name>

# reattach, detaching whoever else is attached
screen -d -r <name>

# reattach if possible, otherwise create the session
screen -R <name>

# attach in parallel with another client (shared screen)
screen -x <name>

# start a detached session running a command
screen -dmS <name> <command>

# run a command inside an existing session
screen -S <name> -X stuff "make test\n"

# quit a session from outside
screen -X -S <name> quit

# clean up dead sessions
screen -wipe
```

## ⌨️ Windows

| Keys            | Action                              |
|-----------------|-------------------------------------|
| `Ctrl+a c`      | Create a window                     |
| `Ctrl+a A`      | Rename the current window           |
| `Ctrl+a n`      | Next window                         |
| `Ctrl+a p`      | Previous window                     |
| `Ctrl+a Ctrl+a` | Toggle between the last two windows |
| `Ctrl+a 0…9`    | Jump to a window by number          |
| `Ctrl+a "`      | Choose a window from a list         |
| `Ctrl+a w`      | Show the window bar                 |
| `Ctrl+a k`      | Kill the current window             |

## 🪟 Split Regions

| Keys         | Action                                    |
|--------------|-------------------------------------------|
| `Ctrl+a S`   | Split into top / bottom regions           |
| `Ctrl+a \|`  | Split into left / right regions           |
| `Ctrl+a Tab` | Move the focus to the next region         |
| `Ctrl+a X`   | Close the focused region                  |
| `Ctrl+a Q`   | Close every region except the focused one |

> 💡 A new region starts empty — press `Ctrl+a c` to open a shell in it, or `Ctrl+a "` to move an existing window there.

## 🔌 Session Control

| Keys         | Action                                   |
|--------------|------------------------------------------|
| `Ctrl+a d`   | Detach and leave everything running      |
| `Ctrl+a D D` | Detach and log out                       |
| `Ctrl+a x`   | Lock the terminal (password required)    |
| `Ctrl+a :`   | Command prompt (`:quit`, `:sessionname`) |
| `Ctrl+a ?`   | List every key binding                   |
| `Ctrl+a \`   | Kill every window and quit screen        |
| `Ctrl+a a`   | Send a literal `Ctrl+a` (nested screens) |

## 📋 Copy Mode & Scrollback

| Keys        | Action                                          |
|-------------|-------------------------------------------------|
| `Ctrl+a [`  | Enter copy/scrollback mode                      |
| `space`     | Start the selection, then `space` again to copy |
| `Ctrl+a ]`  | Paste the buffer                                |
| `/` and `?` | Search forward / backward                       |
| `Ctrl+a >`  | Write the buffer to a file                      |
| `Esc`       | Leave copy mode                                 |

## 📝 Logging & Monitoring

| Keys       | Action                                        |
|------------|-----------------------------------------------|
| `Ctrl+a H` | Toggle logging of the window to `screenlog.n` |
| `Ctrl+a M` | Notify me when this window shows activity     |
| `Ctrl+a _` | Notify me when this window goes quiet         |
| `Ctrl+a C` | Clear the window                              |

```bash
# start a session with logging enabled
screen -L -S <name>

# keep 5000 lines of scrollback
screen -h 5000
```

## ⚙️ Configuration

Settings live in `~/.screenrc`:

```bash
# no splash screen, plenty of scrollback
startup_message off
defscrollback 10000

# a status line with the window list and the hostname
hardstatus alwayslastline
hardstatus string '%{= kG}[%H] %{= kw}%?%-Lw%?%{= kR}%n*%f %t%?(%u)%?%{= kw}%?%+Lw%?'

# use Ctrl+z as the prefix instead of Ctrl+a
# escape ^z^z

# turn on mouse-wheel scrolling in the scrollback
termcapinfo xterm* ti@:te@
```

## 🧠 Tips

- Name your sessions (`screen -S deploy`) — `screen -ls` is unreadable once you have three sessions called `12345.pts-0.host`.
- Over SSH, start work inside screen: the job survives a dropped connection, and `screen -d -r` picks it back up.
- Nested screens (local + remote): press `Ctrl+a a` to send the prefix through to the inner session.
- `screen -x` attaches several clients to the same session — handy for pair debugging.

## 📚 Resources

- [GNU Screen manual](https://www.gnu.org/software/screen/manual/screen.html)
- [Manual page](https://man7.org/linux/man-pages/man1/screen.1.html)
- Built-in help: `Ctrl+a ?`
