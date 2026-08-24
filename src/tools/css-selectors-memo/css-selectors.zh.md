| 选择器                | 示例                    | 示例说明                                                                                                 |
|-----------------------|-------------------------|----------------------------------------------------------------------------------------------------------|
| `.class`              | `.intro`                | 选择所有 class="intro" 的元素                                                                             |
| `.class1.class2`      | `.name1.name2`          | 选择 class 属性中同时设置了 name1 和 name2 的所有元素                                                      |
| `.class1   .class2`   | `.name1 .name2`         | 选择所有 name2 元素，且这些元素是 name1 元素的后代                                                          |
| `#id`                 | `#firstname`            | 选择 id="firstname" 的元素                                                                                |
| `*`                   | `*`                     | 选择所有元素                                                                                              |
| `element`             | `p`                     | 选择所有 \<p\> 元素                                                                                        |
| `element.class`       | `p.intro`               | 选择所有 class="intro" 的 \<p\> 元素                                                                       |
| `element,element`     | `div, p`                | 选择所有 \<div\> 元素和所有 \<p\> 元素                                                                      |
| `element element`     | `div p`                 | 选择 \<div\> 元素内的所有 \<p\> 元素                                                                        |
| `element>element`     | `div > p`               | 选择父元素为 \<div\> 的所有 \<p\> 元素                                                                       |
| `element+element`     | `div + p`               | 选择紧接在 \<div\> 元素之后的第一个 \<p\> 元素                                                                |
| `element1~element2`   | `p ~ ul`                | 选择前面有 \<p\> 元素的每个 \<ul\> 元素                                                                      |
| `[attribute]`         | `[target]`              | 选择所有带有 target 属性的元素                                                                             |
| `[attribute=value]`   | `[target="_blank"]`     | 选择所有 target="_blank" 的元素                                                                            |
| `[attribute~=value]`  | `[title~="flower"]`     | 选择所有 title 属性包含 "flower" 一词的元素                                                                 |
| `[attribute\|=value]` | `[lang\|="en"]`         | 选择所有 lang 属性值等于 "en" 或以 "en-" 开头的元素                                                          |
| `[attribute^=value]`  | `a[href^="https"]`      | 选择 href 属性值以 "https" 开头的每个 \<a\> 元素                                                              |
| `[attribute$=value]`  | `a[href$=".pdf"]`       | 选择 href 属性值以 ".pdf" 结尾的每个 \<a\> 元素                                                               |
| `[attribute*=value]`  | `a[href*="w3schools"]`  | 选择 href 属性值包含子串 "w3schools" 的每个 \<a\> 元素                                                        |
| `:active`             | `a:active`              | 选择激活状态的链接                                                                                        |
| `::after`             | `p::after`              | 在每个 \<p\> 元素的内容之后插入内容                                                                          |
| `::before`            | `p::before`             | 在每个 \<p\> 元素的内容之前插入内容                                                                          |
| `:checked`            | `input:checked`         | 选择每个被选中的 \<input\> 元素                                                                              |
| `:default`            | `input:default`         | 选择默认的 \<input\> 元素                                                                                   |
| `:disabled`           | `input:disabled`        | 选择每个被禁用的 \<input\> 元素                                                                              |
| `:empty`              | `p:empty`               | 选择每个没有子元素（包括文本节点）的 \<p\> 元素                                                                |
| `:enabled`            | `input:enabled`         | 选择每个可用的 \<input\> 元素                                                                                |
| `:first-child`        | `p:first-child`         | 选择每个作为其父元素第一个子元素的 \<p\> 元素                                                                  |
| `::first-letter`      | `p::first-letter`       | 选择每个 \<p\> 元素的第一个字母                                                                              |
| `::first-line`        | `p::first-line`         | 选择每个 \<p\> 元素的第一行                                                                                  |
| `:first-of-type`      | `p:first-of-type`       | 选择每个作为其父元素第一个 \<p\> 元素的 \<p\> 元素                                                             |
| `:focus`              | `input:focus`           | 选择获得焦点的 input 元素                                                                                   |
| `:fullscreen`         | `:fullscreen`           | 选择处于全屏模式的元素                                                                                      |
| `:has()`              | `h2:has(+p)`            | 选择紧跟着 p 元素的 h2 元素，并将样式应用于 h2                                                                |
| `:hover`              | `a:hover`               | 选择鼠标悬停时的链接                                                                                        |
| `:in-range`           | `input:in-range`        | 选择值在特定范围内的 input 元素                                                                              |
| `:indeterminate`      | `input:indeterminate`   | 选择处于不确定状态的 input 元素                                                                              |
| `:invalid`            | `input:invalid`         | 选择所有值无效的 input 元素                                                                                 |
| `:lang()`             | `p:lang(it)`            | 选择每个 lang 属性等于 "it"（意大利语）的 \<p\> 元素                                                           |
| `:last-child`         | `p:last-child`          | 选择每个作为其父元素最后一个子元素的 \<p\> 元素                                                                |
| `:last-of-type`       | `p:last-of-type`        | 选择每个作为其父元素最后一个 \<p\> 元素的 \<p\> 元素                                                           |
| `:link`               | `a:link`                | 选择所有未访问的链接                                                                                        |
| `::marker`            | `::marker`              | 选择列表项的标记                                                                                            |
| `:not()`              | `:not(p)`               | 选择每个不是 \<p\> 元素的元素                                                                                |
| `:nth-child()`        | `p:nth-child(2)`        | 选择每个作为其父元素第二个子元素的 \<p\> 元素                                                                  |
| `:nth-last-child()`   | `p:nth-last-child(2)`   | 选择每个作为其父元素第二个子元素的 \<p\> 元素，从最后一个子元素开始计数                                          |
| `:nth-last-of-type()` | `p:nth-last-of-type(2)` | 选择每个作为其父元素第二个 \<p\> 元素的 \<p\> 元素，从最后一个子元素开始计数                                      |
| `:nth-of-type()`      | `p:nth-of-type(2)`      | 选择每个作为其父元素第二个 \<p\> 元素的 \<p\> 元素                                                              |
| `:only-of-type`       | `p:only-of-type`        | 选择每个作为其父元素唯一 \<p\> 元素的 \<p\> 元素                                                               |
| `:only-child`         | `p:only-child`          | 选择每个作为其父元素唯一子元素的 \<p\> 元素                                                                    |
| `:optional`           | `input:optional`        | 选择没有 "required" 属性的 input 元素                                                                        |
| `:out-of-range`       | `input:out-of-range`    | 选择值超出特定范围的 input 元素                                                                              |
| `::placeholder`       | `input::placeholder`    | 选择指定了 "placeholder" 属性的 input 元素                                                                    |
| `:read-only`          | `input:read-only`       | 选择指定了 "readonly" 属性的 input 元素                                                                       |
| `:read-write`         | `input:read-write`      | 选择未指定 "readonly" 属性的 input 元素                                                                       |
| `:required`           | `input:required`        | 选择指定了 "required" 属性的 input 元素                                                                       |
| `:root`               | `:root`                 | 选择文档的根元素                                                                                            |
| `::selection`         | `::selection`           | 选择用户选中的元素部分                                                                                      |
| `:target`             | `#news:target`          | 选择当前激活的 #news 元素（点击了包含该锚点名称的 URL）                                                       |
| `:valid`              | `input:valid`           | 选择所有值有效的 input 元素                                                                                 |
| `:visited`            | `a:visited`             | 选择所有已访问的链接                                                                                        |
