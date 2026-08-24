# 🖥️ GNU Screen 命令速查表

GNU Screen 是一款终端多路复用器，让你可以在单个终端窗口中运行多个 shell 会话，可以脱离会话并在稍后重新连接。

## 📦 启动与管理 Screen 会话

- **启动新会话**
  ```bash
  screen
  ```
- **以指定名称启动会话**
  ```bash
  screen -S session_name
  ```
- **列出正在运行的会话**
  ```bash
  screen -ls
  ```
- **连接到会话**
  ```bash
  screen -r session_name
  ```
- **连接到上一个脱离的会话**
  ```bash
  screen -r
  ```
- **终止会话**
  ```bash
  screen -X -S session_name quit
  ```

## ⌨️ 基本按键绑定

> 默认前缀键：`Ctrl-a`（在其他按键之前按下）

| 按键绑定 | 操作 |
|-|--|
| `Ctrl-a c`  | 创建新窗口 |
| `Ctrl-a n`  | 下一个窗口 |
| `Ctrl-a p`  | 上一个窗口 |
| `Ctrl-a "`  | 列出所有窗口 |
| `Ctrl-a 0..9` | 按编号切换到窗口 |
| `Ctrl-a A`  | 重命名当前窗口 |
| `Ctrl-a d`  | 脱离会话 |
| `Ctrl-a ?`  | 帮助（显示按键绑定） |
| `Ctrl-a k`  | 关闭当前窗口 |
| `Ctrl-a \`  | 关闭所有窗口并退出 screen |
| `Ctrl-a x`  | 锁定屏幕 |
| `Ctrl-a S`  | 水平分割屏幕 |
| `Ctrl-a |`  | 垂直分割屏幕 |
| `Ctrl-a tab` | 在区域间切换焦点 |
| `Ctrl-a Q`  | 关闭除当前区域外的所有区域 |

## 🔀 窗口与区域管理

- **水平分割**
  ```bash
  Ctrl-a S
  ```
- **垂直分割**
  ```bash
  Ctrl-a |
  ```
- **切换区域焦点**
  ```bash
  Ctrl-a tab
  ```
- **移除除当前区域外的所有分割**
  ```bash
  Ctrl-a Q
  ```

## 📂 会话持久化

- **脱离会话（保持在后台运行）**
  ```bash
  Ctrl-a d
  ```
- **重新连接会话**
  ```bash
  screen -r session_name
  ```

## ⚙️ 配置

- **默认配置文件：** `~/.screenrc`
- 示例 `.screenrc`：
  ```bash
  # 启动时关闭启动信息
  startup_message off
  defscrollback 5000
  hardstatus alwayslastline
  hardstatus string '%{= kG}[%H] %{= kw}%?%-Lw%?%{= kR}%n*%f %t%?(%u)%?%{= kw}%?%+Lw%? %{= kG}[%H]'
  ```

## 🛠️ 实用选项

- **设置回滚缓冲区大小**
  ```bash
  screen -h 5000
  ```
- **在新 screen 中执行命令**
  ```bash
  screen -dmS session_name command
  ```
- **记录输出**
  ```bash
  Ctrl-a H
  ```
  （在当前窗口中切换日志记录）

## 🚪 退出 Screen

- **关闭当前窗口**
  ```bash
  Ctrl-a k
  ```
- **关闭所有窗口并退出**
  ```bash
  Ctrl-a \
  ```
- **正常退出**
  - 关闭窗口中的所有程序，然后输入 `exit`。

## 🧠 提示

- 使用**命名会话**（`screen -S`）以避免混淆。
- 结合 **SSH** 使用，可在断开连接后保持远程任务运行。
- 使用 `.screenrc` 自定义行为和状态栏。