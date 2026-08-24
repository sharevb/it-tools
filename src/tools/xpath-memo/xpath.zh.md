> 致谢原作者: https://gist.github.com/jmaccabee/550a0b9fcfdc7e6b170cd34c6ec7bc56

## 0. XPath 示例

> 更多内容: http://xpath.alephzarro.com/content/cheatsheet.html


| XPath          | 描述 |
| -------------- | ----------- |
| `//hr[@class="edge" and position()=1]`                | 每个 'edge' 类的第一个 hr
| `//table[count(tr)=1 and count(tr/td)=2]`             | 所有 1 行 2 列的表格
| `//div/form/parent::*`                                | 所有包含 form 的 div
| `./div/b`                                             | 相对路径
| `//table[parent::div[@class="pad"] and not(@id)]//a`  | 无 id 且位于 "pad" 类 div 中的表格里的任意锚链接
| `/html/body/div/*[preceding-sibling::h4]`             | h4 之后的所有内容
| `//tr/td[font[@class="head" and text()="TRACK"]]`     | 所有包含 "head" 类且文本为 "TRACK" 的 font 的 td
| `./table/tr[last()]`                                  | 表格的最后一行
| `//rdf:Seq/rdf:li/em:id`                              | 使用命名空间
| `//a/@href`                                           | 所有锚链接的 href
| `//*[count(*)=3]`                                     | 所有拥有 3 个子节点的节点
| `//var\|//acronym`                                     | 所有的 var 和 acronym


## 1. 通用


| XPath          | 描述 |
| -------------- | ----------- |
| `/html`                     | 整个网页（CSS: html）
| `/html/body`                | 整个网页主体（CSS: body）
| `//text()`                  | 网页中的所有文本节点
| `/html/body/.../.../.../E`  | 通过绝对路径引用的元素 \<E\>（CSS: body > … > … > … > E）


## 2. 标签


| XPath          | 描述 |
| -------------- | ----------- |
| `//E`                                        | 通过相对路径引用的元素 \<E\>（CSS: E）
| `(//E)[2]`                                   | 页面中第二个 \<E\> 元素
| `//img`                                      | 图片元素（CSS: img）
| `//E[@A]`                                    | 具有属性 A 的元素 \<E\>（CSS: E[A]）
| `//E[@A="t"]`                                | 属性 A 精确包含文本 't' 的元素 \<E\>（CSS: E[A='t']）
| `//E[contains(@A,"t")]`                      | 属性 A 包含文本 't' 的元素 \<E\>（CSS: E[A*='t']）
| `//E[starts-with(@A, "t")]`                  | 属性 A 以 't' 开头的元素 \<E\>（CSS: E[A^='t']）
| `//E[ends-with(@A, "t")]`                    | 属性 A 以 't' 结尾的元素 \<E\>（CSS: E[A$='t']）
| `//E[contains(concat(" ", @A, " "), " w ")`  | 属性 A 包含单词 'w' 的元素 \<E\>（CSS: E[A~='w']）
| `//E[matches(@A, "r")]`                      | 属性 A 匹配正则表达式 'r' 的元素 \<E\>
| `//E1[@id=I1] \| //E2[@id=I2]`                | id 为 I1 的元素 \<E1\> 或 id 为 I2 的元素 \<E2\>（CSS: E1#I1, E2#I2）
| `//E1[@id=I1 or @id=I2]`                     | id 为 I1 或 I2 的元素 \<E1\>（CSS: E1#I1, E1#I2）


## 3. 属性


| XPath          | 描述 |
| -------------- | ----------- |
| `//E/@A`                    | 元素 \<E\> 的属性 A（CSS: E@A）
| `//*/@A`                    | 任意元素的属性 A（CSS: *@A）
| `//E[@A2="t"]/@A1`          | 属性 A2 精确为 't' 的元素 \<E\> 的属性 A1（CSS: E[A2='t']@A1）
| `//E[contains(@A,"t")]/@A`  | 属性 A 包含 't' 的元素 \<E\> 的属性 A（CSS: E[A*='t']@A）


## 4. ID 和 Name


| XPath          | 描述 |
| -------------- | ----------- |
| `//*[@id="I"]`                | id 为 I 的元素（CSS: #I）
| `//E[@id="I"]`                | id 为 I 的元素 \<E\>（CSS: E#I）
| `//*[@name="N"]`              | 具有指定 name 的元素（CSS: [name='N']）
| `//E[@name="N"]`              | 具有指定 name 的元素 \<E\>（CSS: E[name='N']）
| `//*[@id="X" or @name="X"]`   | id 为 X 或 name 为 X 的元素
| `//*[@name="N"][v+1]`         | name 为 N 且指定从 0 开始的索引 'v' 的元素（CSS: [name='N']:nth-child(v+1)）
| `//*[@name="N"][@value="v"]`  | name 为 N 且值为 'v' 的元素（CSS: *[name='N'][value='v']）


## 5. 语言和类


| XPath          | 描述 |
| -------------- | ----------- |
| `//E[@lang="L" or starts-with(@lang, concat("L", "-"))]`  | 显式使用语言 L 或其子代码的元素 \<E\>（CSS: E[lang\|=L]）
| `//*[contains(concat(" ", @class, " "), " C ")]`          | 拥有类 C 的元素（CSS: .C）
| `//E[contains(concat(" ", @class, " "), " C ")]`          | 拥有类 C 的元素 \<E\>（CSS: E.C）


## 6. 文本和链接


| XPath          | 描述 |
| -------------- | ----------- |
| `//*[.="t"]`                  | 精确包含文本 't' 的元素
| `//E[contains(text(), "t")]`  | 包含文本 't' 的元素 \<E\>（CSS: E:contains('t')）
| `//a`                         | 链接元素（CSS: a）
| `//a[.="t"]`                  | 精确包含文本 't' 的元素 \<a\>
| `//a[contains(text(), "t")]`  | 包含文本 't' 的元素 \<a\>（CSS: a:contains('t')）
| `//a[@href="url"]`            | 目标链接为 'url' 的 \<a\>（CSS: a[href='url']）
| `//a[.="t"]/@href`            | 文本精确为 't' 的链接 URL


## 7. 父级和子级


| XPath          | 描述 |
| -------------- | ----------- |
| `//E/*[1]`                                                        | 元素 \<E\> 的第一个子元素（CSS: E > *:first-child）
| `//E[1]`                                                          | 第一个 \<E\> 子元素（CSS: E:first-of-type）
| `//E/*[last()]`                                                   | 元素 E 的最后一个子元素（CSS: E *:last-child）
| `//E[last()]`                                                     | 最后一个 \<E\> 子元素（CSS: E:last-of-type）
| `//E[2]`                                                          | 第二个 \<E\> 子元素（CSS: E:nth-of-type(2)）
| `//*[2][name()="E"]`                                              | 是 \<E\> 元素的第二个子元素（CSS: E:nth-child(2)）
| `//E[last()-1]`                                                   | 倒数第二个 \<E\> 子元素（CSS: E:nth-last-of-type(2)）
| `//*[last()-1][name()="E"]`                                       | 倒数第二个是 \<E\> 元素的子元素（CSS: E:nth-last-child(2)）
| `//E1/[E2 and not( *[not(self::E2)])]`                            | 仅含 \<E2\> 子元素的 \<E1\> 元素
| `//E/..`                                                          | 元素 \<E\> 的父元素
| `//*[@id="I"]/.../.../.../E`                                      | 使用指定路径的 id 为 I 的元素的后代 \<E\>（CSS: #I > … > … > … > E）
| `//*[@id="I"]//E`                                                 | 使用未指定路径的 id 为 I 的元素的后代 \<E\>（CSS: #I E）
| `//E[count(*)=0]`                                                 | 无子元素的元素 \<E\>（E:empty）
| `//E[count(*)=1]`                                                 | 只有一个子元素的元素 \<E\>
| `//E[count(preceding-sibling::*)+count(following-sibling::*)=0]`  | 作为唯一子元素的元素 \<E\>（CSS: E:only-child）
| `//E[count(../E) = 1]`                                            | 无 \<E\> 兄弟元素的元素 \<E\>（CSS: E:only-of-type）
| `//E[position() mod N = M + 1]`                                   | 从第 (M+1) 个开始的每第 N 个元素（CSS: E:nth-child(Nn+M)）


## 8. 兄弟节点


| XPath          | 描述 |
| -------------- | ----------- |
| `//E2/following-sibling::E1`                 | 跟在某个兄弟节点 \<E2\> 之后的元素 \<E1\>（CSS: E2 ~ E1）
| `//E2/following-sibling::*[1][name()="E1"]`  | 紧跟在兄弟节点 \<E2\> 之后的元素 \<E1\>（CSS: E2 + E1）
| `//E2/following-sibling::*[2][name()="E1"]`  | 跟在兄弟节点 \<E2\> 之后且中间间隔一个元素的元素 \<E1\>（CSS: E2 + * + E1）
| `//E/following-sibling::*`                   | 紧跟在 \<E\> 之后的兄弟元素（CSS: E + *）
| `//E2/preceding-sibling::E1`                 | 在某个兄弟节点 \<E2\> 之前的元素 \<E1\>
| `//E2/preceding-sibling::*[1][name()="E1"]`  | 紧邻兄弟节点 \<E2\> 之前的元素 \<E1\>
| `//E2/preceding-sibling::*[2][name()="E1"]`  | 在兄弟节点 \<E2\> 之前且中间间隔一个元素的元素 \<E1\>
| `//E/preceding-sibling::*[1]`                | 紧邻 \<E\> 之前的兄弟元素


## 9. 表格单元格


| XPath          | 描述 |
| -------------- | ----------- |
| `//*[@id="TestTable"]//tr[3]//td[2]`          | 按行和列定位的单元格（如第 3 行第 2 列）（CSS: #TestTable tr:nth-child(3) td:nth-child(2)）
| `//td[preceding-sibling::td="t"]`             | 紧跟在精确包含 't' 的单元格之后的单元格
| `td[preceding-sibling::td[contains(.,"t")]]`  | 紧跟在包含 't' 的单元格之后的单元格（CSS: td:contains('t') ~ td）


## 10. 动态


| XPath          | 描述 |
| -------------- | ----------- |
| `//E[@disabled]`       | 被禁用的用户界面元素 \<E\>（CSS: E:disabled）
| `//*[not(@disabled)]`  | 被启用的用户界面元素（CSS: E:enabled）
| `//*[@checked]`        | 被选中的复选框（或单选按钮）（CSS: *:checked）


## 11. XPath 函数

> https://developer.mozilla.org/en-US/docs/Web/XPath/Functions


### 11.1. 转换


| XPath          | 描述 |
| -------------- | ----------- |
| `boolean(expression)`  | 对表达式求值并返回 true 或 false。
| `string([object])`     | 将给定参数转换为字符串。
| `number([object])`     | 将对象转换为数字并返回该数字。


### 11.2. 数学


| XPath          | 描述 |
| -------------- | ----------- |
| `ceiling(number)`  | 对小数求值并返回大于或等于该小数的最小整数。
| `floor(number)`    | 对小数求值并返回小于或等于该小数的最大整数。
| `round(decimal)`   | 返回最接近给定数字的整数。
| `sum(node-set)`    | 返回给定节点集中各节点数值的总和。


### 11.3. 逻辑

| XPath          | 描述 |
| -------------- | ----------- |
| `true()`           | 返回布尔值 true。
| `false()`          | 返回布尔值 false。
| `not(expression)`  | 对布尔表达式求值并返回相反的值。


### 11.4. 节点


| XPath          | 描述 |
| -------------- | ----------- |
| `lang(string)`               | 判断上下文节点是否匹配给定语言，返回布尔值 true 或 false。
| `name([node-set])`           | 返回表示给定节点集中第一个节点的 QName 的字符串。
| `namespace-uri([node-set])`  | 返回表示给定节点集中第一个节点的命名空间 URI 的字符串。


### 11.5. 上下文


| XPath          | 描述 |
| -------------- | ----------- |
| `count(node-set)`           | 统计节点集中的节点数量并返回一个整数。
| `function-available(name)`  | 判断给定函数是否可用，返回布尔值 true 或 false。
| `last()`                    | 返回等于表达式求值上下文上下文大小的数字。
| `position()`                | 返回等于表达式求值上下文上下文位置的数字。


### 11.6. 字符串


| XPath          | 描述 |
| -------------- | ----------- |
| `contains(haystack-string, needle-string)`  | 判断第一个参数字符串是否包含第二个参数字符串，返回布尔值 true 或 false。
| `concat(string1, string2 [stringn]*)`       | 拼接两个或多个字符串并返回结果字符串。
| `normalize-space(string)`                   | 去除字符串首尾空白字符，将空白字符序列替换为单个空格，并返回结果字符串。
| `starts-with(haystack, needle)`             | 检查第一个字符串是否以第二个字符串开头，返回 true 或 false。
| `string-length([string])`                   | 返回等于给定字符串中字符数的数字。
| `substring(string, start [length])`         | 返回给定字符串的一部分。
| `substring-after(haystack, needle)`         | 返回给定字符串中指定子字符串之后剩余的字符串。
| `substring-before(haystack, needle)`        | 返回给定字符串中指定子字符串之前剩余的字符串。
| `translate(string, abc, XYZ)`               | 对字符串和一组待转换字符进行求值，返回转换后的字符串。


## 12. XPath 轴

| XPath          | 描述 |
| -------------- | ----------- |
| `ancestor`            | 表示上下文节点的所有祖先，从父节点开始一直到根节点。
| `ancestor-or-self`    | 表示上下文节点及其所有祖先，包括根节点。
| `attribute (@)`       | 表示上下文节点的属性。只有元素才有属性。此轴可用 @ 符号缩写。
| `child (/)`           | 表示上下文节点的子节点。如果 XPath 表达式未指定轴，则默认使用此轴。由于只有根节点或元素节点有子节点，其他用法不会选中任何内容。
| `descendant (//)`     | 表示上下文节点的所有子节点，以及子节点的子节点，依此类推。不包括属性和命名空间节点——属性节点的父节点是元素节点，但属性节点不是其父节点的子节点。
| `descendant-or-self`  | 表示上下文节点及其所有后代。不包括属性和命名空间节点——属性节点的父节点是元素节点，但属性节点不是其父节点的子节点。
| `following`           | 表示上下文节点之后出现的所有节点，不包括后代、属性和命名空间节点。
| `following-sibling`   | 表示与上下文节点具有相同父节点且在源文档中位于上下文节点之后的所有节点。
| `parent(..)`          | 表示作为上下文节点父节点的单个节点。可用两个点 (..) 缩写。
| `preceding`           | 表示文档中位于上下文节点之前的所有节点，不包括祖先、属性和命名空间节点。
| `preceding-sibling`   | 表示与上下文节点具有相同父节点且在源文档中位于上下文节点之前的所有节点。
| `self (.)`            | 表示上下文节点本身。可用单个点 (.) 缩写。