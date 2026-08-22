**XPath** navigates an XML or HTML document as a tree. Every step has the form `axis::node-test[predicate]`, and most of it has a short form: `//div[@class="card"]/a/@href` reads "the `href` of every `a` inside any `div` with class `card`".

> ⚠️ Browsers, Selenium and most scrapers implement **XPath 1.0**. `ends-with()`, `matches()`, `lower-case()` and `replace()` are 2.0+ and only work in tools like `xmllint`, Saxon or `lxml` with an XSLT 2.0 processor. Workarounds for 1.0 are given below.

## 🧭 Path Syntax

| XPath      | Selects                                     |
|------------|---------------------------------------------|
| `/`        | From the document root — an absolute path   |
| `//`       | Anywhere in the document, at any depth      |
| `.`        | The current (context) node                  |
| `..`       | The parent of the context node              |
| `@attr`    | An attribute                                |
| `*`        | Any element                                 |
| `@*`       | Any attribute                               |
| `text()`   | The text nodes of an element                |
| `node()`   | Any node at all, text and comments included |
| `[n]`      | The nth match — **1-based**, not 0-based    |
| `[last()]` | The last match                              |
| `a \| b`   | The union of two expressions                |

```xpath
/html/body            (: absolute: the body of the page :)
//text()              (: every text node :)
./div/b               (: relative to the context node :)
(//p)[2]              (: the second p in the whole document :)
//p[2]                (: every p that is the second p of its parent :)
```

## 🏷 Elements & Attributes

| XPath                                         | Description                               | CSS            |
|-----------------------------------------------|-------------------------------------------|----------------|
| `//E`                                         | Every `<E>` element                       | `E`            |
| `(//E)[2]`                                    | The second `<E>` in the document          | —              |
| `//E[@A]`                                     | `<E>` carrying attribute `A`              | `E[A]`         |
| `//E[@A="t"]`                                 | `<E>` where `A` is exactly `t`            | `E[A='t']`     |
| `//E[contains(@A,"t")]`                       | `<E>` where `A` contains `t`              | `E[A*='t']`    |
| `//E[starts-with(@A,"t")]`                    | `<E>` where `A` starts with `t`           | `E[A^='t']`    |
| `//E[substring(@A, string-length(@A)-2)="t"]` | `<E>` where `A` ends with `t` (1.0 trick) | `E[A$='t']`    |
| `//E[ends-with(@A,"t")]`                      | The same, XPath 2.0+ only                 | `E[A$='t']`    |
| `//E[matches(@A,"r")]`                        | `A` matches regex `r` (2.0+)              | —              |
| `//E/@A`                                      | The value of attribute `A`                | —              |
| `//*/@A`                                      | Attribute `A` of any element              | —              |
| `//E[@A2="t"]/@A1`                            | `A1` where `A2` is `t`                    | —              |
| `//E1[@id="I1"] \| //E2[@id="I2"]`            | Either element                            | `E1#I1, E2#I2` |
| `//E[@id="I1" or @id="I2"]`                   | `<E>` with either id                      | `E#I1, E#I2`   |

## 🆔 Id, Name, Class & Language

| XPath                                                             | Description                                               | CSS                     |
|-------------------------------------------------------------------|-----------------------------------------------------------|-------------------------|
| `//*[@id="I"]`                                                    | The element with id `I`                                   | `#I`                    |
| `//E[@id="I"]`                                                    | `<E>` with id `I`                                         | `E#I`                   |
| `//*[@name="N"]`                                                  | Any element named `N`                                     | `[name='N']`            |
| `//*[@name="N"][@value="v"]`                                      | Named `N` with value `v`                                  | `[name='N'][value='v']` |
| `//*[contains(concat(" ", normalize-space(@class), " "), " C ")]` | Element with class `C` — the padding avoids matching `C2` | `.C`                    |
| `//E[contains(concat(" ", normalize-space(@class), " "), " C ")]` | `<E>` with class `C`                                      | `E.C`                   |
| `//E[@lang="L" or starts-with(@lang, concat("L","-"))]`           | `<E>` in language `L` or a subcode                        | `E[lang\|='L']`         |

## 📝 Text & Links

| XPath                             | Description                                          | CSS                |
|-----------------------------------|------------------------------------------------------|--------------------|
| `//*[.="t"]`                      | Element whose whole text is exactly `t`              | —                  |
| `//E[contains(text(),"t")]`       | `<E>` with a text node containing `t`                | —                  |
| `//E[contains(.,"t")]`            | `<E>` whose text, descendants included, contains `t` | —                  |
| `//E[normalize-space()="t"]`      | Exact text, ignoring surrounding whitespace          | —                  |
| `//a`                             | Every link                                           | `a`                |
| `//a[.="t"]`                      | The link labelled exactly `t`                        | —                  |
| `//a[@href="url"]`                | The link pointing at `url`                           | `a[href='url']`    |
| `//a[.="t"]/@href`                | The URL behind the label `t`                         | —                  |
| `//a[starts-with(@href,"https")]` | Secure links only                                    | `a[href^='https']` |

## 👪 Parents & Children

| XPath                                                            | Description                                            | CSS                     |
|------------------------------------------------------------------|--------------------------------------------------------|-------------------------|
| `//E/*[1]`                                                       | First child of `<E>`                                   | `E > *:first-child`     |
| `//E/*[last()]`                                                  | Last child of `<E>`                                    | `E > *:last-child`      |
| `//E[1]`                                                         | Each `<E>` that is the first of its type in its parent | `E:first-of-type`       |
| `//E[last()]`                                                    | Last `<E>` of its type                                 | `E:last-of-type`        |
| `//E[2]`                                                         | Second `<E>` of its type                               | `E:nth-of-type(2)`      |
| `//*[2][name()="E"]`                                             | Second child, if it is an `<E>`                        | `E:nth-child(2)`        |
| `//E[last()-1]`                                                  | Second-to-last `<E>` of its type                       | `E:nth-last-of-type(2)` |
| `//E/..`                                                         | The parent of `<E>`                                    | —                       |
| `//div/form/parent::*`                                           | Every element that has a form child                    | `div:has(> form)`       |
| `//*[@id="I"]//E`                                                | `<E>` anywhere under id `I`                            | `#I E`                  |
| `//E[count(*)=0]`                                                | `<E>` with no element children                         | `E:empty`               |
| `//E[count(*)=1]`                                                | `<E>` with exactly one child                           | —                       |
| `//E[count(preceding-sibling::*)+count(following-sibling::*)=0]` | `<E>` that is an only child                            | `E:only-child`          |
| `//E[count(../E)=1]`                                             | `<E>` with no `<E>` siblings                           | `E:only-of-type`        |
| `//E1[E2 and not(*[not(self::E2)])]`                             | `<E1>` whose only children are `<E2>`                  | —                       |
| `//E[position() mod N = M + 1]`                                  | Every Nth element, offset by M                         | `E:nth-child(Nn+M)`     |

## 👥 Siblings

| XPath                                       | Description                          | CSS           |
|---------------------------------------------|--------------------------------------|---------------|
| `//E2/following-sibling::E1`                | Every `<E1>` after a sibling `<E2>`  | `E2 ~ E1`     |
| `//E2/following-sibling::*[1][name()="E1"]` | `<E1>` immediately after `<E2>`      | `E2 + E1`     |
| `//E2/following-sibling::*[2][name()="E1"]` | `<E1>` two siblings after `<E2>`     | `E2 + * + E1` |
| `//E/following-sibling::*[1]`               | Whatever follows `<E>` directly      | `E + *`       |
| `//E2/preceding-sibling::E1`                | Every `<E1>` before a sibling `<E2>` | —             |
| `//E2/preceding-sibling::*[1][name()="E1"]` | `<E1>` immediately before `<E2>`     | —             |
| `//E/preceding-sibling::*[1]`               | Whatever precedes `<E>` directly     | —             |

## 📊 Tables & Form State

| XPath                                          | Description                              | CSS                                  |
|------------------------------------------------|------------------------------------------|--------------------------------------|
| `//*[@id="T"]//tr[3]//td[2]`                   | Third row, second cell                   | `#T tr:nth-child(3) td:nth-child(2)` |
| `//td[preceding-sibling::td="t"]`              | The cell right after the one reading `t` | —                                    |
| `//td[preceding-sibling::td[contains(.,"t")]]` | Cells following one containing `t`       | `td:has(~ td)`                       |
| `//table[count(tr)=1 and count(tr/td)=2]`      | Tables with one row and two columns      | —                                    |
| `//table/tr[last()]`                           | The last row of a table                  | `table tr:last-child`                |
| `//E[@disabled]`                               | A disabled control                       | `E:disabled`                         |
| `//E[not(@disabled)]`                          | A control that is not disabled           | `E:enabled`                          |
| `//*[@checked]`                                | A checked checkbox or radio              | `:checked`                           |

## 🧮 Functions

### Strings

| Function                             | Returns                                                  |
|--------------------------------------|----------------------------------------------------------|
| `contains(haystack, needle)`         | True when the first string contains the second           |
| `starts-with(haystack, needle)`      | True when it starts with it                              |
| `concat(s1, s2, …)`                  | The strings joined together                              |
| `normalize-space(s)`                 | The string with runs of whitespace collapsed and trimmed |
| `string-length(s)`                   | The number of characters                                 |
| `substring(s, start [, length])`     | A slice — **1-based**                                    |
| `substring-before(haystack, needle)` | Everything before the first occurrence                   |
| `substring-after(haystack, needle)`  | Everything after it                                      |
| `translate(s, from, to)`             | Characters mapped one by one — the 1.0 way to fold case  |

### Numbers, logic & nodes

| Function                                    | Returns                                                   |
|---------------------------------------------|-----------------------------------------------------------|
| `count(node-set)`                           | How many nodes matched                                    |
| `sum(node-set)`                             | The sum of their numeric values                           |
| `position()`                                | The index of the context node within its step             |
| `last()`                                    | The size of the context — so `[last()]` is the final node |
| `name([node-set])`                          | The qualified name of the first node                      |
| `namespace-uri([node-set])`                 | Its namespace URI                                         |
| `lang(s)`                                   | True when the node is in that language                    |
| `not(expr)`                                 | The negation                                              |
| `true()` / `false()`                        | Boolean constants                                         |
| `boolean(expr)` / `string(o)` / `number(o)` | Type conversions                                          |
| `ceiling(n)` / `floor(n)` / `round(n)`      | Rounding                                                  |

> 💡 Case-insensitive matching in XPath 1.0:
> `//E[contains(translate(@A,"ABCDEFGHIJKLMNOPQRSTUVWXYZ","abcdefghijklmnopqrstuvwxyz"), "t")]`

## 🧭 Axes

| Axis                 | Short form  | Selects                                                         |
|----------------------|-------------|-----------------------------------------------------------------|
| `child`              | *(default)* | The direct children of the context node                         |
| `descendant`         | `//`        | Every node below the context node                               |
| `descendant-or-self` | `//`        | The context node and everything below it                        |
| `parent`             | `..`        | The single parent node                                          |
| `ancestor`           | —           | Parent, grandparent, up to the root                             |
| `ancestor-or-self`   | —           | The same, including the context node                            |
| `following`          | —           | Everything after the node in document order, except descendants |
| `following-sibling`  | —           | Later siblings under the same parent                            |
| `preceding`          | —           | Everything before it, except its ancestors                      |
| `preceding-sibling`  | —           | Earlier siblings under the same parent                          |
| `attribute`          | `@`         | The attributes of the node                                      |
| `self`               | `.`         | The context node itself                                         |

```xpath
//td[.="Total"]/ancestor::table          (: the table a cell belongs to :)
//h2[.="Specs"]/following-sibling::ul[1] (: the list after a heading :)
//input[@name="q"]/ancestor-or-self::form (: the form wrapping a field :)
```

## 🧠 Worked Examples

```xpath
//hr[@class="edge" and position()=1]
(: the first hr of class 'edge' under each parent :)

//table[parent::div[@class="pad"] and not(@id)]//a
(: links in unnamed tables inside a padded div :)

/html/body/div/*[preceding-sibling::h4]
(: whatever comes after an h4 :)

//tr/td[font[@class="head" and text()="TRACK"]]
(: cells whose font child says TRACK :)

//*[count(*)=3]
(: elements with exactly three children :)

//rdf:Seq/rdf:li/em:id
(: namespaced elements — the prefixes must be bound by the host tool :)

//var | //acronym
(: a union of two node sets :)
```

## 🛠 Running XPath

```javascript
// browser devtools console
$x('//a[contains(@href, "docs")]')

// plain DOM API
document.evaluate('//h1', document, null, XPathResult.ANY_TYPE, null).iterateNext()
```

```bash
# from the shell, over XML or HTML
xmllint --xpath '//book/title/text()' catalog.xml
xmllint --html --xpath '//a/@href' page.html 2>/dev/null
```

```python
from lxml import html
tree = html.parse('page.html')
tree.xpath('//div[@class="card"]/a/@href')
```

```python
# Selenium and Playwright both accept XPath locators
driver.find_element(By.XPATH, '//button[normalize-space()="Save"]')
page.locator('xpath=//button[normalize-space()="Save"]').click()
```

## ⚠️ Notes

- **Indexes start at 1.** `[0]` never matches anything.
- **`//E[1]` is per-parent**, `(//E)[1]` is document-wide — the single most common XPath bug.
- **Namespaced documents** need prefixes registered with the host library; in XPath 1.0 a common workaround is `//*[local-name()="title"]`.
- **`//` is expensive** on large documents; anchor the path when you can.
- **Prefer text matching with `normalize-space()`** — HTML is full of stray whitespace and line breaks.

## 📚 Resources

- [MDN — XPath](https://developer.mozilla.org/en-US/docs/Web/XML/XPath)
- [MDN — XPath functions](https://developer.mozilla.org/en-US/docs/Web/XML/XPath/Reference/Functions)
- [XPath 1.0 specification](https://www.w3.org/TR/xpath-10/)
- [XPath cheat sheet (alephzarro)](http://xpath.alephzarro.com/content/cheatsheet.html)

Credit to the original author: https://gist.github.com/jmaccabee/550a0b9fcfdc7e6b170cd34c6ec7bc56
