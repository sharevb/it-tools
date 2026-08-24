Zellij 是一款**终端工作区和多路复用器**，支持窗格、标签页、布局和插件。

## 📦 安装

```bash
# 通过 Cargo 安装
cargo install --locked zellij

# 无需安装即可试用
bash <(curl -L https://zellij.dev/launch)
```

## 🚀 启动与管理会话

```bash
# 启动新的 Zellij 会话
zellij

# 以指定会话名称启动
zellij --session mysession

# 连接到已有会话
zellij attach mysession

# 列出所有会话
zellij list-sessions

# 终止会话
zellij kill-session mysession
```

## 🪟 窗格管理

| 操作 | 命令 / 快捷键 |
|--------|--------------------|
| 垂直分割 | `Ctrl + p` → `v` |
| 水平分割 | `Ctrl + p` → `h` |
| 关闭窗格 | `Ctrl + p` → `x` |
| 移动焦点 | `Ctrl + p` → 方向键 |
| 调整窗格大小 | `Ctrl + p` → `r` 然后方向键 |
| 切换浮动窗格 | `Ctrl + p` → `f` |
| 切换堆叠窗格 | `Ctrl + p` → `s` |

## 📑 标签页管理

| 操作 | 命令 / 快捷键 |
|--------|--------------------|
| 新建标签页 | `Ctrl + p` → `t` |
| 关闭标签页 | `Ctrl + p` → `q` |
| 重命名标签页 | `Ctrl + p` → `n` |
| 在标签页间移动 | `Ctrl + p` → 左/右方向键 |

## 🛠️ 布局

```bash
# 以预定义布局启动
zellij --layout path/to/layout.kdl

# 布局文件示例（KDL 格式）
layout {
  tab {
    pane split_direction="vertical" {
      pane
      pane
    }
  }
}
```

## ⚙️ 配置

- 配置文件：`~/.config/zellij/config.kdl`
- 常用选项：
  ```kdl
  keybinds {
    normal {
      bind "Ctrl g" { SwitchToMode "locked"; }
    }
  }
  ```

## 🔌 插件

- Zellij 支持 **WebAssembly 插件**。
- 使用示例：
  ```bash
  zellij --plugin path/to/plugin.wasm
  ```

## 🧭 实用参数

```bash
--session <name>     # 命名会话
--layout <file>      # 使用布局文件
--help               # 显示帮助
--version            # 显示版本
```

## 🗂️ 快速参考

- **会话** → `zellij`, `attach`, `list-sessions`, `kill-session`
- **窗格** → 分割、移动、调整大小、浮动、堆叠
- **标签页** → 新建、关闭、重命名、切换
- **布局** → `--layout file.kdl`
- **配置** → `~/.config/zellij/config.kdl`
- **插件** → `.wasm` 模块
