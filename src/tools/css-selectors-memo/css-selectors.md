**CSS selectors** pick the elements a rule applies to. They are also what `document.querySelectorAll()`, Playwright, Puppeteer and most scrapers use, so the same syntax works far beyond stylesheets.

```css
/* every <a> inside a .card that opens in a new tab */
.card a[target="_blank"] { color: rebeccapurple; }
```

## 🎯 Basic Selectors

| Selector         | Example        | Selects                                    |
|------------------|----------------|--------------------------------------------|
| `*`              | `*`            | Every element                              |
| `element`        | `p`            | Every `<p>` element                        |
| `.class`         | `.intro`       | Every element with `class="intro"`         |
| `#id`            | `#firstname`   | The element with `id="firstname"`          |
| `.class1.class2` | `.name1.name2` | Elements carrying **both** classes         |
| `element.class`  | `p.intro`      | Every `<p>` with `class="intro"`           |
| `a, b`           | `div, p`       | Every `<div>` **and** every `<p>` (a list) |

## 🔗 Combinators

| Selector | Example   | Selects                                                                   |
|----------|-----------|---------------------------------------------------------------------------|
| `a b`    | `div p`   | Every `<p>` anywhere inside a `<div>` (descendant)                        |
| `a > b`  | `div > p` | Every `<p>` whose direct parent is a `<div>` (child)                      |
| `a + b`  | `div + p` | The `<p>` immediately after a `<div>` (adjacent sibling)                  |
| `a ~ b`  | `p ~ ul`  | Every `<ul>` that follows a `<p>` under the same parent (general sibling) |

## 🏷 Attribute Selectors

| Selector           | Example             | Selects                                                            |
|--------------------|---------------------|--------------------------------------------------------------------|
| `[attr]`           | `[target]`          | Elements that have the attribute at all                            |
| `[attr="value"]`   | `[target="_blank"]` | Exact value                                                        |
| `[attr~="value"]`  | `[title~="flower"]` | Value is one of a space-separated list                             |
| `[attr\|="value"]` | `[lang\|="en"]`     | Value is `en` or starts with `en-`                                 |
| `[attr^="value"]`  | `a[href^="https"]`  | Value starts with                                                  |
| `[attr$="value"]`  | `a[href$=".pdf"]`   | Value ends with                                                    |
| `[attr*="value"]`  | `a[href*="docs"]`   | Value contains                                                     |
| `[attr="value" i]` | `[type="TEXT" i]`   | Case-insensitive match (add `s` instead to force case-sensitivity) |

## 🌳 Structural Pseudo-Classes

| Selector               | Example                 | Selects                                                  |
|------------------------|-------------------------|----------------------------------------------------------|
| `:root`                | `:root`                 | The document root — where custom properties usually live |
| `:first-child`         | `p:first-child`         | A `<p>` that is the first child of its parent            |
| `:last-child`          | `p:last-child`          | A `<p>` that is the last child of its parent             |
| `:only-child`          | `p:only-child`          | A `<p>` that is the only child                           |
| `:nth-child(n)`        | `li:nth-child(2)`       | The second child — also `odd`, `even`, `3n+1`            |
| `:nth-last-child(n)`   | `li:nth-last-child(2)`  | Counting from the end                                    |
| `:first-of-type`       | `p:first-of-type`       | The first `<p>` among its siblings                       |
| `:last-of-type`        | `p:last-of-type`        | The last `<p>` among its siblings                        |
| `:only-of-type`        | `p:only-of-type`        | The only `<p>` among its siblings                        |
| `:nth-of-type(n)`      | `p:nth-of-type(2)`      | The second `<p>` among its siblings                      |
| `:nth-last-of-type(n)` | `p:nth-last-of-type(2)` | Same, counting from the end                              |
| `:empty`               | `p:empty`               | No children at all, text included                        |

## 🖱 State & Interaction

| Selector         | Example                | Selects                                                          |
|------------------|------------------------|------------------------------------------------------------------|
| `:link`          | `a:link`               | Unvisited links                                                  |
| `:visited`       | `a:visited`            | Visited links                                                    |
| `:hover`         | `a:hover`              | The element under the pointer                                    |
| `:active`        | `a:active`             | The element being clicked                                        |
| `:focus`         | `input:focus`          | The focused element                                              |
| `:focus-visible` | `button:focus-visible` | Focused *and* the browser thinks a ring belongs there (keyboard) |
| `:focus-within`  | `form:focus-within`    | An element containing the focused element                        |
| `:target`        | `#news:target`         | The element the URL fragment points at                           |
| `:fullscreen`    | `:fullscreen`          | The element displayed full-screen                                |

## 📝 Form Pseudo-Classes

| Selector             | Example                   | Selects                                         |
|----------------------|---------------------------|-------------------------------------------------|
| `:checked`           | `input:checked`           | Checked checkboxes, radios and selected options |
| `:default`           | `input:default`           | The default control in a form                   |
| `:disabled`          | `input:disabled`          | Disabled controls                               |
| `:enabled`           | `input:enabled`           | Controls that are not disabled                  |
| `:required`          | `input:required`          | Controls carrying `required`                    |
| `:optional`          | `input:optional`          | Controls without `required`                     |
| `:valid`             | `input:valid`             | Controls whose value passes validation          |
| `:invalid`           | `input:invalid`           | Controls whose value fails validation           |
| `:user-valid`        | `input:user-valid`        | Valid, but only after the user has interacted   |
| `:user-invalid`      | `input:user-invalid`      | Invalid, but only after the user has interacted |
| `:in-range`          | `input:in-range`          | Value inside `min`/`max`                        |
| `:out-of-range`      | `input:out-of-range`      | Value outside `min`/`max`                       |
| `:indeterminate`     | `input:indeterminate`     | Neither checked nor unchecked                   |
| `:read-only`         | `input:read-only`         | Not editable by the user                        |
| `:read-write`        | `input:read-write`        | Editable by the user                            |
| `:placeholder-shown` | `input:placeholder-shown` | The placeholder is currently visible            |

## 🧩 Functional Pseudo-Classes

| Selector                | Example                        | Selects                                                                 |
|-------------------------|--------------------------------|-------------------------------------------------------------------------|
| `:is()`                 | `:is(h1, h2, h3) > code`       | Any of the listed selectors — takes the highest specificity of the list |
| `:where()`              | `:where(h1, h2) a`             | Same matching as `:is()`, but contributes **zero** specificity          |
| `:not()`                | `li:not(.done, .hidden)`       | Elements that match none of the listed selectors                        |
| `:has()`                | `article:has(> img)`           | A parent that contains a match — the "parent selector"                  |
| `:lang()`               | `p:lang(it)`                   | Elements in a given language                                            |
| `:nth-child(An+B of S)` | `li:nth-child(2n of .visible)` | Counts only the siblings matching `S`                                   |

## ✨ Pseudo-Elements

Pseudo-elements use `::` (double colon) and target a *part* of an element rather than the element itself.

| Selector                 | Example                       | Targets                                         |
|--------------------------|-------------------------------|-------------------------------------------------|
| `::before`               | `p::before`                   | Generated content in front of the content       |
| `::after`                | `p::after`                    | Generated content after the content             |
| `::first-letter`         | `p::first-letter`             | The first letter                                |
| `::first-line`           | `p::first-line`               | The first rendered line                         |
| `::marker`               | `li::marker`                  | The bullet or number of a list item             |
| `::selection`            | `::selection`                 | The part the user has selected                  |
| `::placeholder`          | `input::placeholder`          | The placeholder text                            |
| `::backdrop`             | `dialog::backdrop`            | The layer behind a modal or full-screen element |
| `::file-selector-button` | `input::file-selector-button` | The button of a file input                      |

> ℹ️ `::before` and `::after` need a `content` property — even `content: ""` — before they render.

## 📊 Specificity

Specificity is compared as three numbers, **ID – class – type**, highest wins; a later rule only wins against an equal score.

| Selector kind                  | Weight                     | Example                     |
|--------------------------------|----------------------------|-----------------------------|
| Inline `style` attribute       | overrides everything below | `style="…"`                 |
| ID                             | `1-0-0`                    | `#header`                   |
| Class, attribute, pseudo-class | `0-1-0`                    | `.card`, `[href]`, `:hover` |
| Element, pseudo-element        | `0-0-1`                    | `p`, `::before`             |
| `*`, combinators, `:where()`   | `0-0-0`                    | `*`, `>`, `:where(.a)`      |

```css
#nav .item a      /* 1-1-1 */
.menu .item a     /* 0-2-1 — loses to the line above */
:where(#nav) a    /* 0-0-1 — :where() zeroes out what is inside it */
```

> 💡 Reach for `:where()` in library or reset styles so consumers can override them without an `!important` arms race.

## 📚 Resources

- [MDN — CSS selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_selectors)
- [MDN — specificity](https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity)
- [Selectors Level 4 specification](https://www.w3.org/TR/selectors-4/)
