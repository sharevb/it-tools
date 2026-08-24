## 语法

根据所使用的客户端不同，JSONPath 表达式可以以 `$.` 开头表示根元素。
有些客户端会省略开头的 `$.`。

| 语法 | 描述 |
| ------ | :--------- |
| `$.store.book[0].title` | |              
| `store.book[0].title` | 隐式的 `$.` |
| `$['store']['book'][0]['title']` | 类似脚本语言的替代记法 |

## 树遍历

| 语法 | 描述 |
| ------ | :--------- |
| `$.parentNode.childNode.field`       | XPath: `/parentNode/childNode/@field`（"parentNode" 下所有 "childNode" 的 "field" 内容） |
| `$..anyChildNode`                    | XPath: `//anyChildNode`（任意深度下所有名为 "anyChildNode" 的子节点） |
| `$.parentNode.*`                     | XPath: `/parentNode/*`（所有下级子节点） |

## 数组访问

| 语法 | 描述 |
| ------ | :--------- |
| `$.myList[0]` | 第一个元素 |
| `$.myList[-1]` | 最后一个元素 |
| `$.myList[2:3]` | 范围 |
| `$.myList[0,4,5]` | 选择 |

## 过滤

| 语法 | 描述 |
| ------ | :--------- |
| `$.customer[?(@.car)]` |                       仅包含拥有 "car" 属性的 "customer" |
| `$.customer[?(@.car == 'Ford Fiesta')]` |      仅包含拥有 "Ford Fiesta" 的 "customer" |
| `$.customer[?(@.age > 18)]` |                  仅包含成年人 |

## 复杂条件

| 语法 | 描述 |
| ------ | :--------- |
| `$.customer[?(@.age > 18 \|\| @.car == 'Ford Fiesta')]` |     逻辑或 |
| `$.customer[?(@.age < 18 && @.hobby == 'Biking' )]` |       逻辑与 |

## 输出映射

| 语法 | 描述 |
| ------ | :--------- |
| `$.[].{Name:name, Age:age, Hobbies:details.hobbies}` | 将字段/嵌套字段映射到新集合 |

## 致谢

原作者：https://gist.github.com/mackoj/5786f8b95da0a82e8e003f444c4295bf