Zellij is a **terminal workspace and multiplexer** with panes, tabs, layouts, and plugin support.

## 📦 Installation

```bash
# Install via Cargo
cargo install --locked zellij

# Try without installing
bash <(curl -L https://zellij.dev/launch)
```

## 🚀 Starting & Managing Sessions

```bash
# Start a new Zellij session
zellij

# Start with a specific session name
zellij --session mysession

# Attach to an existing session
zellij attach mysession

# List all sessions
zellij list-sessions

# Kill a session
zellij kill-session mysession
```

## 🪟 Pane Management

| Action | Command / Shortcut |
|--------|--------------------|
| Split vertically | `Ctrl + p` → `v` |
| Split horizontally | `Ctrl + p` → `h` |
| Close pane | `Ctrl + p` → `x` |
| Move focus | `Ctrl + p` → Arrow keys |
| Resize pane | `Ctrl + p` → `r` then arrows |
| Toggle floating pane | `Ctrl + p` → `f` |
| Toggle stacked panes | `Ctrl + p` → `s` |

## 📑 Tab Management

| Action | Command / Shortcut |
|--------|--------------------|
| New tab | `Ctrl + p` → `t` |
| Close tab | `Ctrl + p` → `q` |
| Rename tab | `Ctrl + p` → `n` |
| Move between tabs | `Ctrl + p` → Left/Right arrows |

## 🛠️ Layouts

```bash
# Start with a predefined layout
zellij --layout path/to/layout.kdl

# Example layout file (KDL format)
layout {
  tab {
    pane split_direction="vertical" {
      pane
      pane
    }
  }
}
```

## ⚙️ Configuration

- Config file: `~/.config/zellij/config.kdl`
- Common options:
  ```kdl
  keybinds {
    normal {
      bind "Ctrl g" { SwitchToMode "locked"; }
    }
  }
  ```

## 🔌 Plugins

- Zellij supports **WebAssembly plugins**.
- Example usage:
  ```bash
  zellij --plugin path/to/plugin.wasm
  ```

## 🧭 Useful Flags

```bash
--session <name>     # Name the session
--layout <file>      # Use a layout file
--help               # Show help
--version            # Show version
```

## 🗂️ Quick Reference

- **Session** → `zellij`, `attach`, `list-sessions`, `kill-session`
- **Pane** → split, move, resize, float, stack
- **Tab** → new, close, rename, switch
- **Layout** → `--layout file.kdl`
- **Config** → `~/.config/zellij/config.kdl`
- **Plugins** → `.wasm` modules
