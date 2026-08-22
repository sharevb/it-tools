**JSONPath** is a query language for JSON, the way XPath is for XML. An expression walks the document from the root and returns every value that matches.

> ℹ️ Expressions normally start with `$`, the root element. Some clients let you drop the leading `$.`. Implementations differ in the details — [RFC 9535](https://www.rfc-editor.org/rfc/rfc9535.html) standardised the syntax in 2024, but older libraries predate it.

## 🧭 Syntax

| Syntax                           | Description                                              |
|----------------------------------|----------------------------------------------------------|
| `$`                              | The root element                                         |
| `@`                              | The element currently being filtered                     |
| `$.store.book[0].title`          | Dot notation                                             |
| `store.book[0].title`            | With the `$.` implied                                    |
| `$['store']['book'][0]['title']` | Bracket notation — needed for keys with spaces or dashes |
| `..`                             | Recursive descent, at any depth                          |
| `*`                              | Wildcard: every element or member                        |
| `[]`                             | Subscript: index, slice, union or filter                 |

## 🌳 Tree Traversal

| Syntax                         | Description                                                              |
|--------------------------------|--------------------------------------------------------------------------|
| `$.parentNode.childNode.field` | XPath `/parentNode/childNode/@field` — the field of every matching child |
| `$..anyChildNode`              | XPath `//anyChildNode` — every node with that name, at any depth         |
| `$.parentNode.*`               | XPath `/parentNode/*` — every child of the node                          |
| `$..*`                         | Every value in the document                                              |
| `$..book[*].author`            | The author of every book, however deeply nested                          |

## 🔢 Array Access

| Syntax            | Description                             |
|-------------------|-----------------------------------------|
| `$.myList[0]`     | First element                           |
| `$.myList[-1]`    | Last element                            |
| `$.myList[*]`     | Every element                           |
| `$.myList[2:4]`   | Slice — index 2 up to, not including, 4 |
| `$.myList[:3]`    | The first three                         |
| `$.myList[-2:]`   | The last two                            |
| `$.myList[::2]`   | Every second element                    |
| `$.myList[0,4,5]` | A union of specific indexes             |

## 🔎 Filtering

Filters are written `[?(...)]` — `[?...]` in RFC 9535 — and keep the elements for which the expression is true.

| Syntax                                  | Description                                        |
|-----------------------------------------|----------------------------------------------------|
| `$.customer[?(@.car)]`                  | Customers that have a `car` field at all           |
| `$.customer[?(@.car == 'Ford Fiesta')]` | Customers with a Ford Fiesta                       |
| `$.customer[?(@.age > 18)]`             | Adults only                                        |
| `$.customer[?(@.age != 18)]`            | Everyone but the 18-year-olds                      |
| `$.book[?(@.price <= 10)]`              | Also `<`, `>=`, `==`                               |
| `$.book[?(@.title =~ /^The/)]`          | Regular expression match (implementation-specific) |

### Combining conditions

| Syntax                                                  | Description |
|---------------------------------------------------------|-------------|
| `$.customer[?(@.age > 18 \|\| @.car == 'Ford Fiesta')]` | Logical or  |
| `$.customer[?(@.age < 18 && @.hobby == 'Biking')]`      | Logical and |
| `$.customer[?(!@.car)]`                                 | Logical not |

## 🧮 Functions

Available in RFC 9535 and in most modern implementations:

| Function   | Example                               | Returns                                |
|------------|---------------------------------------|----------------------------------------|
| `length()` | `$.book[?(length(@.tags) > 2)]`       | Length of a string, array or object    |
| `count()`  | `$.book[?(count(@.authors.*) > 1)]`   | Number of nodes a query matched        |
| `match()`  | `$.book[?(match(@.isbn, "\\d{13}"))]` | True when the **whole** string matches |
| `search()` | `$.book[?(search(@.title, "Moon"))]`  | True when the pattern occurs anywhere  |
| `value()`  | `$.book[?(value(@.price) > 10)]`      | The value of a single-node query       |

Older Jayway-style implementations instead offer `.length()`, `.min()`, `.max()`, `.avg()` and `.sum()` at the end of a path — `$.book[*].price.sum()`.

## 📄 Worked Example

```json
{
  "store": {
    "book": [
      { "title": "Sayings of the Century", "author": "Nigel Rees", "price": 8.95 },
      { "title": "Moby Dick", "author": "Herman Melville", "price": 8.99 },
      { "title": "The Lord of the Rings", "author": "J. R. R. Tolkien", "price": 22.99 }
    ],
    "bicycle": { "color": "red", "price": 19.95 }
  }
}
```

| Expression                          | Result                                |
|-------------------------------------|---------------------------------------|
| `$.store.book[*].author`            | All three authors                     |
| `$..price`                          | `8.95`, `8.99`, `22.99`, `19.95`      |
| `$.store.book[?(@.price < 10)]`     | The two cheap books                   |
| `$.store.book[-1].title`            | `"The Lord of the Rings"`             |
| `$..book[?(@.author =~ /Tolkien/)]` | The Tolkien entry                     |
| `$.store.*`                         | The book array and the bicycle object |

## 🗺 Output Mapping

| Syntax                                               | Description                                                                               |
|------------------------------------------------------|-------------------------------------------------------------------------------------------|
| `$.[].{Name:name, Age:age, Hobbies:details.hobbies}` | Map fields and nested fields into a new object (JMESPath-style, not supported everywhere) |

## 🧰 Where You'll Meet It

- `kubectl get pods -o jsonpath='{.items[*].metadata.name}'`
- Jayway JSONPath in Java, REST Assured assertions
- Karate, Postman and Newman test scripts
- Nginx, Grafana and Prometheus JSON scrapers

> 💡 For heavier transformation on the command line, `jq` is usually the better tool — JSONPath selects, `jq` selects *and* reshapes.

## 📚 Resources

- [RFC 9535 — JSONPath](https://www.rfc-editor.org/rfc/rfc9535.html)
- [Try expressions online (jsonpath.com)](https://jsonpath.com)
- [Comparison of implementations](https://cburgmer.github.io/json-path-comparison/)

Original author: https://gist.github.com/mackoj/5786f8b95da0a82e8e003f444c4295bf
