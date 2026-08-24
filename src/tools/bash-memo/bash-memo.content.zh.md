```bash
#!/bin/bash
##############################################################################
# 快捷键和历史记录
##############################################################################

CTRL+A  # 移动到行首
CTRL+B  # 向后移动一个字符
CTRL+C  # 终止当前命令
CTRL+D  # 向后删除一个字符或退出当前会话，类似于 exit
CTRL+E  # 移动到行尾
CTRL+F  # 向前移动一个字符
CTRL+G  # 中止当前编辑命令并敲响终端铃声
CTRL+H  # 删除光标下的一个字符（与 DELETE 相同）
CTRL+J  # 与 RETURN 相同
CTRL+K  # 删除（杀死）到行尾
CTRL+L  # 清除屏幕并重新显示该行
CTRL+M  # 与 RETURN 相同
CTRL+N  # 命令历史中的下一行
CTRL+O  # 与 RETURN 相同，然后显示历史文件中的下一行
CTRL+P  # 命令历史中的上一行
CTRL+Q  # 恢复暂停的 shell 输出
CTRL+R  # 向后搜索
CTRL+S  # 向前搜索或暂停 shell 输出
CTRL+T  # 交换两个字符
CTRL+U  # 从当前位置向后删除到行首
CTRL+V  # 使下一个输入的字符原样显示
CTRL+W  # 删除光标后的单词
CTRL+X  # 列出当前单词的可能文件名补全
CTRL+Y  # 检索（粘贴）最后删除的项目
CTRL+Z  # 停止当前命令，使用 fg 在前台恢复或 bg 在后台恢复

ALT+B   # 向后移动一个单词
ALT+D   # 删除下一个单词
ALT+F   # 向前移动一个单词
ALT+H   # 向后删除一个字符
ALT+T   # 交换两个单词
ALT+.   # 粘贴最后一个命令的最后一个单词。反复按可遍历命令历史记录。
ALT+U   # 将当前光标位置到单词末尾的每个字符大写
ALT+L   # 将当前光标位置到单词末尾的每个字符小写
ALT+C   # 将光标下的字母大写。然后光标移动到单词末尾。
ALT+R   # 恢复从历史记录中提取的命令的任何更改（如果已编辑）。
ALT+?   # 列出已输入内容的可能补全
ALT+^   # 将行扩展到历史记录中最近的匹配项

CTRL+X then (   # 开始录制键盘宏
CTRL+X then )   # 完成录制键盘宏
CTRL+X then E   # 调用最后录制的键盘宏
CTRL+X then CTRL+E   # 在当前命令行上调用文本编辑器（由 $EDITOR 指定），然后将结果作为 shell 命令执行
CTRL+A then D  # 从 screen 中注销但不杀死它，如果有任何命令存在，它将继续

BACKSPACE  # 向后删除一个字符
DELETE     # 删除光标下的一个字符

history   # 显示命令行历史记录
!!        # 重复最后一个命令
!<n>      # 引用命令行 'n'
!<string> # 引用以 'string' 开头的命令
esc :wq   # 退出并保存脚本

exit      # 退出当前会话


##############################################################################
# Bash 基础
##############################################################################

env                 # 显示所有环境变量

echo $SHELL         # 显示您正在使用的 shell
echo $BASH_VERSION  # 显示 bash 版本

bash                # 如果您想使用 bash（输入 exit 返回到之前打开的 shell）
whereis bash        # 定位命令的二进制文件、源代码和手册页
which bash          # 找出哪个程序被执行为 'bash'（默认：/bin/bash，在不同环境中可能会改变）

clear               # 清除窗口内容（隐藏显示的行）


##############################################################################
# FILE COMMANDS
##############################################################################


ls                            # 列出当前目录中的文件，ls <dir> 用于打印特定目录中的文件
ls -l                         # 以'长格式'列出您的文件，包含文件的确切大小、所有者、查看权限以及最后修改时间
ls -a                         # 以'长格式'列出所有文件，包括隐藏文件（名称以 '.' 开头）
ln -s <filename> <link>       # 创建到文件的符号链接
readlink <filename>           # 显示符号链接指向的位置
tree                          # 以易于阅读的文件树显示目录和子目录
mc                            # 终端文件浏览器（ncdu 的替代方案）
touch <filename>              # 创建或更新（编辑）您的文件
mktemp -t <filename>          # 在 /tmp/ 中创建临时文件，下次启动时会被删除（-d 用于创建目录）
cat <filename>                # 显示文件原始内容（不会被解释）
cat -n <filename>             # 显示行数
nl <file.sh>                  # 显示文件中的行数
cat filename1 > filename2     # 将 filename1 复制到 filename2
cat filename1 >> filename2    # 合并两个文件的文本
any_command > <filename>      # '>' 用于执行重定向，它会将 any_command 的 stdout 设置为文件而不是"真实 stdout"（通常是 /dev/stdout）
more <filename>               # 显示文件的第一部分（用空格键移动，输入 q 退出）
head <filename>               # 输出文件的前几行（默认：10 行）
tail <filename>               # 输出文件的最后几行（与 -f 选项配合使用很有用）（默认：10 行）
vim <filename>                # 在 VIM（VI 改进版）文本编辑器中打开文件，如果不存在则创建
mv <filename1> <dest>         # 将文件移动到目标位置，行为会根据 'dest' 类型而变化（目录：文件放置到目录中；文件：文件将替换 dest（提示：对重命名很有用））
cp <filename1> <dest>         # 复制文件
rm <filename>                 # 删除文件
find . -name <name> <type>    # 在当前目录及其所有子目录中按名称搜索文件或目录
diff <filename1> <filename2>  # 比较文件，并显示它们的不同之处
wc <filename>                 # 告诉您文件中有多少行、单词和字符。使用 -lwc（行、单词、字符）只输出其中一个信息
sort <filename>               # 按字母顺序逐行排序文本文件的内容，使用 -n 进行数字排序，使用 -r 进行反向排序
sort -t -k <filename>         # 使用字段分隔符 t，从 1 开始对特定排序关键字字段的内容进行排序
rev                           # 反转字符串字符（hello 变为 olleh）
chmod -options <filename>     # 允许您更改文件的读、写和执行权限（更多信息：SUID、GUID）
gzip <filename>               # 使用 gzip 算法压缩文件
gunzip <filename>             # 解压缩 gzip 压缩的文件
gzcat <filename>              # 允许您查看 gzipped 文件而无需实际解压缩
lpr <filename>                # 打印文件
lpq                           # 检查打印机队列
lprm <jobnumber>              # 从打印机队列中删除某些内容
genscript                     # 将纯文本文件转换为 PostScript 格式用于打印，并提供一些格式化选项
dvips <filename>              # 打印 .dvi 文件（即 LaTeX 生成的文件）
grep <pattern> <filenames>    # 在文件中查找字符串
grep -r <pattern> <dir>       # 在目录中递归搜索模式
head -n file_name | tail +n   # 打印文件的第 n 行
head -y lines.txt | tail +x   # 想要显示从 x 到 y 的所有行。包括第 x 和第 y 行。

sed 's/<pattern>/<replacement>/g' <filename> # 将文件中的模式替换为替换值输出到标准输出，s 后的字符（/）是分隔符
sed -i 's/<pattern>/<replacement>/g' <filename> # 就地替换文件中的模式为替换值
echo "this" | sed 's/is/at/g' # 从输入流中替换模式为替换值

##############################################################################
# DIRECTORY COMMANDS
##############################################################################


mkdir <dirname>               # 创建新目录
rmdir <dirname>               # 删除空目录
rmdir -rf <dirname>           # 删除非空目录
mv <dir1> <dir2>              # 将目录从 <dir1> 重命名为 <dir2>
cd                            # 切换到主目录
cd ..                         # 切换到父目录
cd <dirname>                  # 切换目录
cp -r <dir1> <dir2>           # 将 <dir1> 复制到 <dir2> 包括子目录
pwd                           # 告诉您当前所在的位置
cd ~                          # 切换到主目录。
cd -                          # 切换到上一个工作目录


##############################################################################
# SSH、系统信息和网络命令
##############################################################################


ssh user@host            # 以用户身份连接到主机
ssh -p <port> user@host  # 以用户身份连接到指定端口的主机
ssh-copy-id user@host    # 将您的 ssh 密钥添加到主机用户，以启用密钥或无密码登录

whoami                   # 返回您的用户名
su <user>                # 切换到不同的用户
su -                     # 切换到 root，可能需要 sudo su -
sudo <command>           # 以 root 用户身份执行命令
passwd                   # 允许您更改密码
quota -v                 # 显示您的磁盘配额
date                     # 显示当前日期和时间
cal                      # 显示当月的日历
uptime                   # 显示当前运行时间
w                        # 显示谁在线
finger <user>            # 显示用户的信息
uname -a                 # 显示内核信息
man <command>            # 显示指定命令的手册
info <command>           # 显示特定命令的另一种文档系统
help                     # 显示有关内置命令和函数的文档
df                       # 显示磁盘使用情况
du <filename>            # 显示文件名中文件和目录的磁盘使用情况（du -s 仅给出总数）
resize2fs                # ext2/ext3/ext4 文件系统调整大小工具
last <yourUsername>      # 列出您的最后登录记录
ps -u yourusername       # 列出您的进程
kill <PID>               # 杀死具有给定 ID 的进程
killall <processname>    # 杀死所有具有该名称的进程
top                      # 显示您当前的活动进程
lsof                     # 列出打开的文件
bg                       # 列出已停止或后台作业；在后台恢复已停止的作业
fg                       # 将最近的作业带到前台
fg <job>                 # 将作业带到前台

ping <host>              # ping 主机并输出结果
whois <domain>           # 获取域名的 whois 信息
dig <domain>             # 获取域名的 DNS 信息
dig -x <host>            # 反向查找主机
wget <file>              # 下载文件
netstat                  # 打印网络连接、路由表、接口统计、伪装连接和多播成员资格

time <command>           # 报告命令执行消耗的时间

##############################################################################
# VARIABLES
##############################################################################


varname=value                # 定义一个变量
varname=value command        # 在特定子进程的环境中定义变量
echo $varname                # 检查变量的值
echo $$                      # 打印当前 shell 的进程 ID
echo $!                      # 打印最近调用的后台作业的进程 ID
echo $?                      # 显示最后一个命令的退出状态
read <varname>               # 从输入中读取字符串并将其赋值给变量
read -p "prompt" <varname>   # 与上面相同，但输出提示以要求用户输入值
column -t <filename>         # 以漂亮的列显示信息（通常与管道一起使用）
let <varname> = <equation>   # 使用 +、-、*、/、% 等运算符执行数学计算
export VARNAME=value         # 定义环境变量（将在子进程中可用）
export -f  <funcname>        # 导出函数 'funcname'
export var1="var1 value"     # 在同一语句中导出和赋值
export <varname>             # 复制 Bash 变量
declare -x <varname>         # 复制 Bash 变量

array[0]=valA                # 如何定义数组
array[1]=valB
array[2]=valC
array=([2]=valC [0]=valA [1]=valB)  # 另一种方式
array=(valA valB valC)              # 还有另一种方式

${array[i]}                  # 显示此索引的数组值。如果未提供索引，则默认数组元素 0
${#array[i]}                 # 找出数组中任何元素的长度
${#array[@]}                 # 找出数组中有多少个值

declare -a                   # 将变量视为数组
declare -f                   # 仅使用函数名
declare -F                   # 显示函数名但不带定义
declare -i                   # 将变量视为整数
declare -r                   # 使变量只读
declare -x                   # 标记变量以便通过环境导出
declare -l                   # 变量中的大写值转换为小写
declare -A                   # 使其成为关联数组

${varname:-word}             # 如果 varname 存在且不为 null，返回其值；否则返回 word
${varname:word}              # 如果 varname 存在且不为 null，返回其值；否则返回 word
${varname:=word}             # 如果 varname 存在且不为 null，返回其值；否则设置为 word 然后返回其值
${varname:?message}          # 如果 varname 存在且不为 null，返回其值；否则打印 varname，后跟 message 并中止当前命令或脚本
${varname:+word}             # 如果 varname 存在且不为 null，返回 word；否则返回 null
${varname:offset:length}     # 执行子字符串扩展。返回 $varname 从 offset 开始且长度不超过 length 字符的子字符串

${variable#pattern}          # 如果模式与变量值的开头匹配，删除最短匹配部分并返回其余部分
${variable##pattern}         # 如果模式与变量值的开头匹配，删除最长匹配部分并返回其余部分
${variable%pattern}          # 如果模式与变量值的结尾匹配，删除最短匹配部分并返回其余部分
${variable%%pattern}         # 如果模式与变量值的结尾匹配，删除最长匹配部分并返回其余部分
${variable/pattern/string}   # 变量中与模式最长匹配的部分被 string 替换。仅替换第一个匹配项
${variable//pattern/string}  # 变量中与模式最长匹配的部分被 string 替换。替换所有匹配项

${#varname}                  # 以字符串形式返回变量值的长度

*(patternlist)               # 匹配给定模式的零次或多次出现
+(patternlist)               # 匹配给定模式的一次或多次出现
?(patternlist)               # 匹配给定模式的零次或一次出现
@(patternlist)               # 精确匹配给定模式之一
!(patternlist)               # 匹配除给定模式之一以外的任何内容

$(UNIX command)              # 命令替换：运行命令并返回标准输出

typeset -l <x>                 # 使变量局部化 - <x> 必须是整数


##############################################################################
# 函数
##############################################################################


# 函数通过位置引用传递的参数（就像它们是位置参数一样），即 $1、$2 等。
# $@ 等于 "$1" "$2"... "$N"，其中 N 是位置参数的数量。$# 包含位置参数的数量。


function functname() {
  shell commands
}

unset -f functname  # 删除函数定义
declare -f          # 显示您登录会话中所有已定义的函数

##############################################################################
# FLOW CONTROLS
##############################################################################


statement1 && statement2  # 与运算符
statement1 || statement2  # 或运算符

-a                        # 测试条件表达式内部的与运算符
-o                        # 测试条件表达式内部的或运算符

# 字符串

str1 == str2               # str1 匹配 str2
str1 != str2               # str1 不匹配 str2
str1 < str2                # str1 小于 str2（按字母顺序）
str1 > str2                # str1 大于 str2（按字母顺序）
str1 \> str2               # str1 在 str2 之后排序
str1 \< str2               # str1 在 str2 之前排序
-n str1                    # str1 不为空（长度大于 0）
-z str1                    # str1 为空（长度为 0）

# 文件

-a file                   # 文件存在或其编译成功
-d file                   # 文件存在且是目录
-e file                   # 文件存在；与 -a 相同
-f file                   # 文件存在且是普通文件（即不是目录或其他特殊类型的文件）
-r file                   # 你有读权限
-s file                   # 文件存在且不为空
-w file                   # 你有写权限
-x file                   # 你有文件执行权限，或者目录搜索权限（如果是目录）
-N file                   # 文件自上次读取后已修改
-O file                   # 你拥有该文件
-G file                   # 文件的组 ID 与你的匹配（或你的多个组之一）
file1 -nt file2           # file1 比 file2 新
file1 -ot file2           # file1 比 file2 旧

# 数字

-lt                       # 小于
-le                       # 小于或等于
-eq                       # 等于
-ge                       # 大于或等于
-gt                       # 大于
-ne                       # 不等于

if condition
then
  statements
[elif condition
  then statements...]
[else
  statements]
fi

for x in {1..10}
do
  statements
done

for name [in list]
do
  statements that can use $name
done

for (( initialisation ; ending condition ; update ))
do
  statements...
done

case expression in
  pattern1 )
    statements ;;
  pattern2 )
    statements ;;
esac

select name [in list]
do
  statements that can use $name
done

while condition; do
  statements
done

until condition; do
  statements
done

##############################################################################
# COMMAND-LINE PROCESSING CYCLE
##############################################################################


# 命令查找的默认顺序是函数，然后是内置命令，最后是脚本和可执行文件。
# 有三个内置命令可以用来覆盖这个顺序：`command`、`builtin` 和 `enable`。

command  # 移除别名和函数查找。只执行内置命令和在搜索路径中找到的命令
builtin  # 只查找内置命令，忽略函数和 PATH 中找到的命令
enable   # 启用和禁用 shell 内置命令

eval     # 接受参数并再次运行命令行处理步骤


##############################################################################
# 输入/输出重定向器
##############################################################################


cmd1|cmd2  # 管道；将 cmd1 的标准输出作为 cmd2 的标准输入
< file     # 从文件获取标准输入
> file     # 将标准输出定向到文件
>> file    # 将标准输出定向到文件；如果文件已存在则追加
>|file     # 即使设置了 noclobber，也强制将标准输出定向到文件
n>|file    # 即使设置了 noclobber，也强制将文件描述符 n 的输出定向到文件
<> file    # 将文件用作标准输入和标准输出
n<>file    # 将文件用作文件描述符 n 的输入和输出
n>file     # 将文件描述符 n 定向到文件
n<file     # 从文件获取文件描述符 n
n>>file    # 将文件描述符 n 定向到文件；如果文件已存在则追加
n>&        # 将标准输出复制到文件描述符 n
n<&        # 从文件描述符 n 复制标准输入
n>&m       # 文件描述符 n 成为输出文件描述符的副本
n<&m       # 文件描述符 n 成为输入文件描述符的副本
&>file     # 将标准输出和标准错误定向到文件
<&-        # 关闭标准输入
>&-        # 关闭标准输出
n>&-       # 关闭文件描述符 n 的输出
n<&-       # 关闭文件描述符 n 的输入

|tee <file># 将命令输出到终端和文件（-a 表示追加到文件）


##############################################################################
# 进程处理
##############################################################################


# 要暂停作业，请在运行时按 CTRL+Z。您也可以使用 CTRL+Y 暂停作业。
# 这与 CTRL+Z 略有不同，因为进程只在尝试从终端读取输入时才会停止。
# 当然，要中断作业，请按 CTRL+C。

myCommand &  # 在后台运行作业并提示返回 shell

jobs         # 列出所有作业（使用 -l 查看关联的 PID）

fg           # 将后台作业带到前台
fg %+        # 带来最近调用的后台作业
fg %-        # 带来第二个最近调用的后台作业
fg %N        # 带来作业编号 N
fg %string   # 带来命令以 string 开头的作业
fg %?string  # 带来命令包含 string 的作业

kill -l               # 返回系统上所有信号的列表，包括名称和编号
kill PID              # 终止具有指定 PID 的进程
kill -s SIGKILL 4500  # 发送信号以强制或终止进程
kill -15 913          # 用信号 15（TERM）结束 PID 913 进程
kill %1               # 其中 %1 是从 'jobs' 命令读取的作业编号。

ps           # 打印当前运行的登录 shell 和在其下运行的任何进程的一行信息
ps -a        # 选择所有具有 tty 的进程，会话领导者除外

trap cmd sig1 sig2  # 当脚本收到信号时执行命令
trap "" sig1 sig2   # 忽略这些信号
trap - sig1 sig2    # 将收到信号时的操作重置为默认值

disown <PID|JID>    # 从作业列表中移除进程

wait                # 等待所有后台作业完成
sleep <number>      # 继续前等待 # 秒

pv                  # 为数据处理命令显示进度条。通常与管道一起使用，如 |pv
yes                 # 每次脚本/进程请求输入时都给出 yes 响应


##############################################################################
# TIPS & TRICKS
##############################################################################

# 设置别名
cd; nano .bash_profile
> alias gentlenode='ssh admin@gentlenode.com -p 3404'  # 在 .bash_profile 中添加您的别名

# 快速转到特定目录
cd; nano .bashrc
> shopt -s cdable_vars
> export websites="/Users/mac/Documents/websites"

source .bashrc
cd $websites


##############################################################################
# 调试 Shell 程序
##############################################################################


bash -n scriptname  # 不运行命令；仅检查语法错误
set -o noexec       # 替代方案（在脚本中设置选项）

bash -v scriptname  # 在运行命令前回显命令
set -o verbose      # 替代方案（在脚本中设置选项）

bash -x scriptname  # 在命令行处理后回显命令
set -o xtrace       # 替代方案（在脚本中设置选项）

trap 'echo $varname' EXIT  # 当您想在脚本退出时打印变量值时很有用

function errtrap {
  es=$?
  echo "ERROR line $1: Command exited with status $es."
}

trap 'errtrap $LINENO' ERR  # 每当周围脚本或函数中的命令以非零状态退出时运行

function dbgtrap {
  echo "badvar is $badvar"
}

trap dbgtrap DEBUG  # 使陷阱代码在函数或脚本中的每个语句之前执行
# ...出现问题的代码部分...
trap - DEBUG  # 关闭 DEBUG 陷阱

function returntrap {
  echo "A return occurred"
}

trap returntrap RETURN  # 每当使用 . 或 source 命令执行的 shell 函数或脚本完成执行时运行


##############################################################################
# 颜色和背景
##############################################################################
# 注意：\e 或 \x1B 也可以代替 \033
# 重置
Color_Off='\033[0m' # 文本重置

# 常规颜色
Black='\033[0;30m'  # 黑色
Red='\033[0;31m'    # 红色
Green='\033[0;32m'  # 绿色
Yellow='\033[0;33m' # 黄色
Blue='\033[0;34m'   # 蓝色
Purple='\033[0;35m' # 紫色
Cyan='\033[0;36m'   # 青色
White='\033[0;97m'  # 白色

# 其他颜色
LGrey='\033[0;37m'  # 浅灰色
DGrey='\033[0;90m'  # 深灰色
LRed='\033[0;91m'   # 浅红色
LGreen='\033[0;92m' # 浅绿色
LYellow='\033[0;93m'# 浅黄色
LBlue='\033[0;94m'  # 浅蓝色
LPurple='\033[0;95m'# 浅紫色
LCyan='\033[0;96m'  # 浅青色


# 粗体
BBlack='\033[1;30m' # 黑色
BRed='\033[1;31m'   # 红色
BGreen='\033[1;32m' # 绿色
BYellow='\033[1;33m'# 黄色
BBlue='\033[1;34m'  # 蓝色
BPurple='\033[1;35m'# 紫色
BCyan='\033[1;36m'  # 青色
BWhite='\033[1;37m' # 白色

# 下划线
UBlack='\033[4;30m' # 黑色
URed='\033[4;31m'   # 红色
UGreen='\033[4;32m' # 绿色
UYellow='\033[4;33m'# 黄色
UBlue='\033[4;34m'  # 蓝色
UPurple='\033[4;35m'# 紫色
UCyan='\033[4;36m'  # 青色
UWhite='\033[4;37m' # 白色

# 背景
On_Black='\033[40m' # 黑色
On_Red='\033[41m'   # 红色
On_Green='\033[42m' # 绿色
On_Yellow='\033[43m'# 黄色
On_Blue='\033[44m'  # 蓝色
On_Purple='\033[45m'# 紫色
On_Cyan='\033[46m'  # 青色
On_White='\033[47m' # 白色

# 使用示例
echo -e "${Green}这是绿色文本${Color_Off} 和正常文本"
echo -e "${Red}${On_White}这是白色背景上的红色测试${Color_Off}"
# 选项 -e 是必需的，它启用反斜杠转义解释
printf "${Red} 这是红色的 \n"
```