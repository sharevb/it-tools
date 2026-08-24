# 使用 jq 处理 JSON

jq 是一款实用的工具，用于对结构化 JSON 数据进行切片、过滤、映射和转换。

## 安装 jq

### 在 Mac OS 上

`brew install jq`

### 在 AWS Linux 上

当前 AMI 上无法通过 yum 安装，但最新的 AMI 应该支持：https://aws.amazon.com/amazon-linux-ami/2015.09-release-notes/

从源码安装较为复杂。

## 实用参数

运行 jq 时，以下参数可能很有用：

| 参数        |  描述  |
| ------ | :--------- |
| `--version`| 输出版本号并以零状态退出。 |
| `--sort-keys` | 按排序后的键顺序输出每个对象的字段。|

## 基本概念

jq 的语法非常一致：

| 语法  |  描述  |
| ------ | :--------- |
| , | 以逗号分隔的过滤器会产生多个独立的输出 |
| ? | 当类型不符合预期时将忽略错误 |
| [] | 数组构造 |
| {} | 对象构造 |
| + | 拼接或加法 |
| - | 集合差集或减法 |
| length | 选中元素的大小 |
| &#124; | 管道符，用于以类似 bash 的方式串联命令 |


## 处理 JSON 对象

| 描述 | 命令 |
| ------ | :--------- |
| 显示所有键 | `jq 'keys'` |
| 对所有元素加 1 | `jq 'map_values(.+1)'` |
| 删除一个键 | `jq 'del(.foo)'` |
| 将对象转换为数组 | `to_entries &#124; map([.key, .value])` |

## 处理字段

| 描述 | 命令 |
| ------ | :--------- |
| 拼接两个字段 | `fieldNew=.field1+' '+.field2` |


## 处理 JSON 数组

### 切片与过滤

| 描述 | 命令 |
| ------ | :--------- |
| 全部 | `jq .[]` |
| 第一个 |	`jq '.[0]'` |
| 范围 | `jq '.[2:4]'` |
| 前 3 个 | `jq '.[:3]'` |
| 后 2 个 | `jq '.[-2:]'` |
| 倒数第二个 | `jq '.[-2]'`|
| 按值筛选整数数组 | `jq 'map(select(. >= 2))'` |
| 按值筛选对象数组 | `jq '.[] &#124; select(.id == "second")'` |
| 按类型筛选 | `jq '.[] &#124; numbers'` 类型包括 arrays, objects, iterables, booleans, numbers, normals, finites, strings, nulls, values, scalars |

### 映射与转换

| 描述 | 命令 |
| ------ | :--------- |
| 对所有元素加 1 | `jq 'map(.+1)'` |
| 删除 2 个元素 | `jq 'del(.[1, 2])'` |
| 拼接数组 | `jq 'add'` |
| 展平数组 | `jq 'flatten'` |
| 创建数字范围 | `jq '[range(2;4)]'` |
| 显示每个元素的类型 | `jq 'map(type)'` |
| 对基本类型数组排序 | `jq 'sort'` |
| 对对象数组排序 | `jq 'sort_by(.foo)'` |
| 按键分组 - 与展平相反 | `jq 'group_by(.foo)'` |
| 数组的最小值 | `jq 'min'` 。另请参阅 min, max, min_by(path_exp), max_by(path_exp) |
| 去除重复项 | `jq 'unique'` 或 `jq 'unique_by(.foo)'` 或 `jq 'unique_by(length)'` |
| 反转数组 | `jq 'reverse'` |