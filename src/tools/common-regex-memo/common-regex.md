Patterns you reach for again and again, written for the **JavaScript/PCRE** flavour. Drop the surrounding anchors (`^`…`$`) when you want to *find* matches inside a longer text instead of validating a whole string.

> ⚠️ Validation by regex is always an approximation. For emails, phone numbers, URLs and credit cards, a regex is a cheap first filter — the real check is a library, or sending the confirmation.

## 🔢 Numbers

```regex
# whole number
^\d+$

# decimal number
^\d*\.\d+$

# whole or decimal
^\d*(\.\d+)?$

# optional sign, whole or decimal
^[+-]?\d*(\.\d+)?$

# thousands separators: 1,234,567.89
^\d{1,3}(,\d{3})*(\.\d+)?$

# percentage, 0–100 with optional decimals
^(100(\.0+)?|\d{1,2}(\.\d+)?)%?$

# hexadecimal number
^(0[xX])?[0-9a-fA-F]+$

# currency amount: $1,234.56
^\$?\d{1,3}(,?\d{3})*(\.\d{2})?$
```

## 🔤 Text & Identifiers

```regex
# alphanumeric, no spaces
^[a-zA-Z0-9]+$

# alphanumeric with spaces
^[a-zA-Z0-9 ]+$

# username: 3–16 chars, letters, digits, underscore, dash
^[a-z0-9_-]{3,16}$

# slug: lowercase words joined by single dashes
^[a-z0-9]+(?:-[a-z0-9]+)*$

# hex colour, 3 or 6 digits
^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$

# UUID v4
^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$

# semantic version (major.minor.patch with optional pre-release and build)
^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?(\+[0-9A-Za-z.-]+)?$

# leading and trailing whitespace
^\s+|\s+$

# blank or whitespace-only line
^\s*$
```

## 📧 Email

```regex
# pragmatic: good enough for a form field
^[^\s@]+@[^\s@]+\.[^\s@]+$

# stricter on the allowed characters
^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$

# find addresses inside a body of text
[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}
```

## 🔗 URLs

```regex
# http(s) URL
^https?:\/\/[^\s/$.?#].[^\s]*$

# protocol optional
^(https?:\/\/)?([\w-]+\.)+[a-z]{2,}(\/[^\s]*)?$

# domain name only
^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$

# extract every link from text
https?:\/\/[^\s<>"']+

# capture the parts: protocol, host, path
^(https?):\/\/([^\/\s:]+)(?::(\d+))?(\/[^\s?#]*)?
```

## 🌐 Network

```regex
# IPv4 address
^((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$

# IPv4 with CIDR prefix
^((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\/(3[0-2]|[12]?\d)$

# IPv6, full or compressed
^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:(:[0-9a-fA-F]{1,4}){1,6}|:((:[0-9a-fA-F]{1,4}){1,7}|:))$

# MAC address, colon- or dash-separated
^([0-9A-Fa-f]{2}[:-]){5}[0-9A-Fa-f]{2}$

# port number, 0–65535
^([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$
```

## 📅 Dates & Times

```regex
# ISO 8601 date: 2026-08-22
^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$

# ISO 8601 date and time with optional zone
^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:?\d{2})?$

# day-first with - . or / as separator
^(0?[1-9]|[12]\d|3[01])([-./])(0?[1-9]|1[0-2])\2\d{4}$

# 24-hour time, optional seconds
^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$

# 12-hour time with meridiem
^(0?[1-9]|1[0-2]):[0-5]\d\s?([AaPp][Mm])$

# duration in ISO 8601: P1DT2H30M
^P(?!$)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+S)?)?$
```

> ℹ️ These check the *shape*, not the calendar — `2026-02-31` passes. Parse the value if the date has to be real.

## 🔐 Password Rules

Each requirement is a lookahead; combine only the ones you actually need.

```regex
# at least 8 characters, one lower, one upper, one digit
^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$

# the same, plus one special character
^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$

# at least 12 characters, no other rules (the modern recommendation)
^.{12,}$

# individual checks, to report which rule failed
[a-z]        # has a lower-case letter
[A-Z]        # has an upper-case letter
\d           # has a digit
[^\w\s]      # has a symbol
```

## ☎️ Phone Numbers

```regex
# E.164, the format to store numbers in
^\+[1-9]\d{1,14}$

# lenient international, allowing spaces, dashes, dots and parentheses
^\+?[\d\s().-]{7,20}$

# North American number, with or without country code
^(\+?1[-. ]?)?\(?\d{3}\)?[-. ]?\d{3}[-. ]?\d{4}$
```

> 💡 Use a library (libphonenumber and its ports) for anything beyond a smoke test — numbering plans change, and regex cannot know which prefixes exist.

## 📄 Files & Paths

```regex
# file name with an extension
^[\w,\s-]+\.[A-Za-z0-9]+$

# capture the name and the extension separately
^(.+?)\.([A-Za-z0-9]+)$

# extension only
\.[0-9a-z]+$

# absolute Unix path
^(\/[^\/\0]+)+\/?$

# Windows path
^[a-zA-Z]:\\(?:[^\\/:*?"<>|\r\n]+\\)*[^\\/:*?"<>|\r\n]*$

# image file
\.(jpe?g|png|gif|webp|avif|svg)$
```

## 🏷 Markup & Logs

```regex
# any HTML tag
<\/?[a-zA-Z][\w-]*(\s[^>]*)?>

# HTML comment
<!--[\s\S]*?-->

# inline JavaScript handler: onclick=, onload=, ...
\bon\w+\s*=\s*["'][^"']*["']

# content between double quotes (non-greedy)
"([^"\\]*(\\.[^"\\]*)*)"

# an @mention or #hashtag
[@#][\w-]+

# common log line: IP, timestamp, method, path, status
^(\S+) \S+ \S+ \[([^\]]+)\] "(\w+) ([^"]*)" (\d{3})
```

## 🧰 Handy Tricks

```regex
# a word repeated later in the same text
(\b\w+\b)(?=.*\b\1\b)

# two consecutive identical words
\b(\w+)\s+\1\b

# a line that does NOT contain a word
^(?!.*forbidden).*$

# everything between two markers, non-greedy
BEGIN([\s\S]*?)END

# strip ANSI colour codes
\x1B\[[0-9;]*[A-Za-z]

# split CSV, respecting quoted fields
("([^"]|"")*"|[^,]*)(,|$)
```

## ⚠️ Notes

- **Postal codes have no universal pattern** — every country differs. Look up the one you need.
- **Credit cards**: check the shape, then verify with the Luhn algorithm; brand prefixes are documented at [regular-expressions.info](https://www.regular-expressions.info/creditcard.html).
- **National identifiers** (SSN, passport, tax numbers) carry checksums and legal edge cases a regex cannot express.
- **Watch out for catastrophic backtracking** in patterns with nested quantifiers — test any user-facing regex against long, nearly-matching input.

## 📚 Resources

- [regex101 — test and explain](https://regex101.com)
- [Regular-Expressions.info](https://www.regular-expressions.info/)
- [RegExHub — common patterns](https://projects.lukehaas.me/regexhub/)
- [MDN — regular expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions)
