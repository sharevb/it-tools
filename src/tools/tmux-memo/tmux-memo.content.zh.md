# 🖥️ tmux Linux 命令速查表

## 🔑 基础
- **新建会话**：`tmux`
- **新建命名会话**：`tmux new -s <name>`
- **列出会话**：`tmux ls`
- **连接到上一个会话**：`tmux attach`
- **连接到命名会话**：`tmux attach -t <name>`
- **脱离会话**：`Ctrl+b d`
- **终止会话**：`tmux kill-session -t <name>`
- **重命名会话**：`Ctrl+b $`

## 📂 窗口（类似标签页）
- **创建新窗口**：`Ctrl+b c`
- **重命名窗口**：`Ctrl+b ,`
- **下一个窗口**：`Ctrl+b n`
- **上一个窗口**：`Ctrl+b p`
- **列出窗口**：`Ctrl+b w`
- **切换到第 # 个窗口**：`Ctrl+b <0-9>`
- **关闭当前窗口**：`Ctrl+b &`

## 🪟 窗格（分屏）
- **垂直分屏**：`Ctrl+b %`
- **水平分屏**：`Ctrl+b "`
- **在窗格间移动**：`Ctrl+b <方向键>`
- **循环切换窗格**：`Ctrl+b o`
- **切换窗格缩放**：`Ctrl+b z`
- **关闭窗格**：`Ctrl+b x`
- **交换窗格**：`Ctrl+b {`（与前一个交换），`Ctrl+b }`（与后一个交换）

## 📋 复制模式
- **进入复制模式**：`Ctrl+b [`
- **开始选择**：`<Space>`
- **复制选中内容**：`<Enter>`
- **退出复制模式**：`q`
- **粘贴缓冲区内容**：`Ctrl+b ]`

## ⚙️ 配置
- **重新加载配置**：`tmux source-file ~/.tmux.conf`
- **显示选项**：`tmux show-options -g`
- **列出所有快捷键**：`Ctrl+b ?`

## 🧭 实用命令
- **命令提示符**：`Ctrl+b :`
- **列出会话/窗口/窗格**：`tmux info`
- **终止服务器（所有会话）**：`tmux kill-server`

## 📝 备注
- **前缀键**：默认为 `Ctrl+b`。在使用任何快捷键之前先按此键。
- **自定义前缀**：可在 `~/.tmux.conf` 中修改（例如 `set -g prefix C-a`）。

### 示例工作流
1. 新建命名会话：`tmux new -s dev`
2. 分屏：`Ctrl+b %` 和 `Ctrl+b "`
3. 创建多个窗口：`Ctrl+b c`
4. 脱离会话：`Ctrl+b d`
5. 稍后重新连接：`tmux attach -t dev`