export const lunicode = {
  tools: {

    // Flip/rotate Text by 180°

    flip: {
      init() {
        // invert the map
        for (const i in this.map) {
          this.map[this.map[i]] = i;
        }
      },

      encode(text: string) {
        const ret = [];
        let ch;

        for (let i = 0, len = text.length; i < len; i++) {
          ch = text.charAt(i);

          // combining diacritical marks: combine with previous character for ä,ö,ü,...
          if (i > 0 && (ch === '\u0324'
                        || ch === '\u0317'
                        || ch === '\u0316'
                        || ch === '\u032E')) {
            ch = this.map[text.charAt(i - 1) + ch];
            ret.pop();
          }
          else {
            ch = this.map[ch];
            if (typeof (ch) === 'undefined') {
              ch = text.charAt(i);
            }
          }

          ret.push(ch);
        }

        return ret.reverse().join('');
      },

      // same as encode(), for now...
      decode(text: string) {
        const ret = [];
        let ch;

        for (let i = 0, len = text.length; i < len; i++) {
          ch = text.charAt(i);

          // combining diacritical marks: combine with previous character for ä,ö,ü,...
          if (i > 0 && (ch === '\u0324'
                        || ch === '\u0317'
                        || ch === '\u0316'
                        || ch === '\u032E')) {
            ch = this.map[text.charAt(i - 1) + ch];
            ret.pop();
          }
          else {
            ch = this.map[ch];
            if (typeof (ch) === 'undefined') {
              ch = text.charAt(i);
            }
          }

          ret.push(ch);
        }
        return ret.reverse().join('');
      },

      map: {
        // Thanks to
        // - David Faden: http://www.revfad.com/flip.html
        // - http://en.wikipedia.org/wiki/Transformation_of_text
        'a': '\u0250',
        'b': 'q',
        'c': '\u0254',
        'd': 'p',
        'e': '\u01DD',
        'f': '\u025F',
        'g': '\u0253',
        'h': '\u0265',
        'i': '\u0131',
        'j': '\u027E',
        'k': '\u029E',
        'l': '\u006C',
        'm': '\u026F',
        'n': 'u',
        'r': '\u0279',
        't': '\u0287',
        'v': '\u028C',
        'w': '\u028D',
        'y': '\u028E',
        'A': '\u2200',
        'B': 'ᙠ',
        'C': '\u0186',
        'D': 'ᗡ',
        'E': '\u018E',
        'F': '\u2132',
        'G': '\u2141',
        'J': '\u017F',
        'K': '\u22CA',
        'L': '\u02E5',
        'M': 'W',
        'P': '\u0500',
        'Q': '\u038C',
        'R': '\u1D1A',
        'T': '\u22A5',
        'U': '\u2229',
        'V': '\u039B',
        'Y': '\u2144',
        '1': '\u21C2',
        '2': '\u1105',
        '3': '\u0190',
        '4': '\u3123',
        '5': '\u078E',
        '6': '9',
        '7': '\u3125',
        '&': '\u214B',
        '.': '\u02D9',
        '"': '\u201E',
        ';': '\u061B',
        '[': ']',
        '(': ')',
        '{': '}',
        '?': '\u00BF',
        '!': '\u00A1',
        '\'': ',',
        '<': '>',
        '\u203E': '_',
        '\u00AF': '_',
        '\u203F': '\u2040',
        '\u2045': '\u2046',
        '\u2234': '\u2235',
        '\r': '\n',
        'ß': 'ᙠ',

        '\u0308': '\u0324',
        'ä': 'ɐ' + '\u0324',
        'ö': 'o' + '\u0324',
        'ü': 'n' + '\u0324',
        'Ä': '\u2200' + '\u0324',
        'Ö': 'O' + '\u0324',
        'Ü': '\u2229' + '\u0324',

        '´': ' \u0317',
        'é': '\u01DD' + '\u0317',
        'á': '\u0250' + '\u0317',
        'ó': 'o' + '\u0317',
        'ú': 'n' + '\u0317',
        'É': '\u018E' + '\u0317',
        'Á': '\u2200' + '\u0317',
        'Ó': 'O' + '\u0317',
        'Ú': '\u2229' + '\u0317',

        '`': ' \u0316',
        'è': '\u01DD' + '\u0316',
        'à': '\u0250' + '\u0316',
        'ò': 'o' + '\u0316',
        'ù': 'n' + '\u0316',
        'È': '\u018E' + '\u0316',
        'À': '\u2200' + '\u0316',
        'Ò': 'O' + '\u0316',
        'Ù': '\u2229' + '\u0316',

        '^': ' \u032E',
        'ê': '\u01DD' + '\u032E',
        'â': '\u0250' + '\u032E',
        'ô': 'o' + '\u032E',
        'û': 'n' + '\u032E',
        'Ê': '\u018E' + '\u032E',
        'Â': '\u2200' + '\u032E',
        'Ô': 'O' + '\u032E',
        'Û': '\u2229' + '\u032E',
        // TODO: flip more letters with stuff around them. See http://en.wikipedia.org/wiki/Combining_character

      } as Record<string, string>,
    },

    // Mirror text (flip horizontally)
    mirror: {
      init() {
        // invert the map
        for (const i in this.map) {
          this.map[this.map[i]] = i;
        }
      },

      encode(text: string) {
        let ret = [];
        let ch;
        const newLines = [];

        for (let i = 0, len = text.length; i < len; i++) {
          ch = text.charAt(i);

          // combining diacritical marks: combine with previous character for ä,ö,ü,...
          if (i > 0 && (ch === '\u0308'
                        || ch === '\u0300'
                        || ch === '\u0301'
                        || ch === '\u0302')) {
            ch = this.map[text.charAt(i - 1) + ch];
            ret.pop();
          }
          else {
            ch = this.map[ch];
            if (typeof (ch) === 'undefined') {
              ch = text.charAt(i);
            }
          }

          if (ch === '\n') {
            newLines.push(ret.reverse().join(''));
            ret = [];
          }
          else {
            ret.push(ch);
          }
        }
        newLines.push(ret.reverse().join(''));
        return newLines.join('\n');
      },

      decode(text: string) {
        let ret = [];
        let ch;
        const newLines = [];

        for (let i = 0, len = text.length; i < len; i++) {
          ch = text.charAt(i);

          // combining diacritical marks: combine with previous character for ä,ö,ü,...
          if (i > 0 && (ch === '\u0308'
                        || ch === '\u0300'
                        || ch === '\u0301'
                        || ch === '\u0302')) {
            ch = this.map[text.charAt(i - 1) + ch];
            ret.pop();
          }
          else {
            ch = this.map[ch];
            if (typeof (ch) === 'undefined') {
              ch = text.charAt(i);
            }
          }

          if (ch === '\n') {
            newLines.push(ret.reverse().join(''));
            ret = [];
          }
          else {
            ret.push(ch);
          }
        }

        newLines.push(ret.reverse().join(''));
        return newLines.join('\n');
      },

      // Thanks to http://www.macchiato.com/unicode/mirrored-ascii
      map: {
        'a': 'ɒ',
        'b': 'd',
        'c': 'ɔ',
        'e': 'ɘ',
        'f': 'Ꮈ',
        'g': 'ǫ',
        'h': 'ʜ',
        'j': 'ꞁ',
        'k': 'ʞ',
        'l': '|',
        'n': 'ᴎ',
        'p': 'q',
        'r': 'ɿ',
        's': 'ꙅ',
        't': 'ƚ',
        'y': 'ʏ',
        'z': 'ƹ',
        'B': 'ᙠ',
        'C': 'Ɔ',
        'D': 'ᗡ',
        'E': 'Ǝ',
        'F': 'ꟻ',
        'G': 'Ꭾ',
        'J': 'Ⴑ',
        'K': '⋊',
        'L': '⅃',
        'N': 'Ͷ',
        'P': 'ꟼ',
        'Q': 'Ọ',
        'R': 'Я',
        'S': 'Ꙅ',
        'Z': 'Ƹ',
        '1': '',
        '2': '',
        '3': '',
        '4': '',
        '5': '',
        '6': '',
        '7': '',
        '&': '',
        ';': '',
        '[': ']',
        '(': ')',
        '{': '}',
        '?': '⸮',
        '<': '>',

        'ä': 'ɒ' + '\u0308',
        'ß': 'ᙠ',

        '´': '`',
        'é': 'ɘ' + '\u0300',
        'á': 'ɒ' + '\u0300',
        'ó': 'ò',
        'ú': 'ù',
        'É': 'Ǝ' + '\u0300',
        'Á': 'À',
        'Ó': 'Ò',
        'Ú': 'Ù',

        '`': '´',
        'è': 'ɘ' + '\u0301',
        'à': 'ɒ' + '\u0301',
        'È': 'Ǝ' + '\u0301',

        'ê': 'ɘ' + '\u0302',
        'â': 'ɒ' + '\u0302',
        'Ê': 'Ǝ' + '\u0302',

        'Ø': 'ᴓ',
        'ø': 'ᴓ',

      } as Record<string, string>,
    },

    // Thanks to Michael S. Kaplan: http://blogs.msdn.com/b/michkap/archive/2006/02/17/533929.aspx
    // Creepify.
    creepify: {
      init() {
        // Sort diacritics in top, bottom or middle

        for (let i = 768; i <= 789; i++) {
          this.diacriticsTop.push(String.fromCharCode(i));
        }

        for (let i = 790; i <= 819; i++) {
          if (i !== 794 && i !== 795) {
            this.diacriticsBottom.push(String.fromCharCode(i));
          }
        }
        this.diacriticsTop.push(String.fromCharCode(794));
        this.diacriticsTop.push(String.fromCharCode(795));

        for (let i = 820; i <= 824; i++) {
          this.diacriticsMiddle.push(String.fromCharCode(i));
        }

        for (let i = 825; i <= 828; i++) {
          this.diacriticsBottom.push(String.fromCharCode(i));
        }

        for (let i = 829; i <= 836; i++) {
          this.diacriticsTop.push(String.fromCharCode(i));
        }
        this.diacriticsTop.push(String.fromCharCode(836));
        this.diacriticsBottom.push(String.fromCharCode(837));
        this.diacriticsTop.push(String.fromCharCode(838));
        this.diacriticsBottom.push(String.fromCharCode(839));
        this.diacriticsBottom.push(String.fromCharCode(840));
        this.diacriticsBottom.push(String.fromCharCode(841));
        this.diacriticsTop.push(String.fromCharCode(842));
        this.diacriticsTop.push(String.fromCharCode(843));
        this.diacriticsTop.push(String.fromCharCode(844));
        this.diacriticsBottom.push(String.fromCharCode(845));
        this.diacriticsBottom.push(String.fromCharCode(846));
        // 847 (U+034F) is invisible http://en.wikipedia.org/wiki/Combining_grapheme_joiner
        this.diacriticsTop.push(String.fromCharCode(848));
        this.diacriticsTop.push(String.fromCharCode(849));
        this.diacriticsTop.push(String.fromCharCode(850));
        this.diacriticsBottom.push(String.fromCharCode(851));
        this.diacriticsBottom.push(String.fromCharCode(852));
        this.diacriticsBottom.push(String.fromCharCode(853));
        this.diacriticsBottom.push(String.fromCharCode(854));
        this.diacriticsTop.push(String.fromCharCode(855));
        this.diacriticsTop.push(String.fromCharCode(856));
        this.diacriticsBottom.push(String.fromCharCode(857));
        this.diacriticsBottom.push(String.fromCharCode(858));
        this.diacriticsTop.push(String.fromCharCode(859));
        this.diacriticsBottom.push(String.fromCharCode(860));
        this.diacriticsTop.push(String.fromCharCode(861));
        this.diacriticsTop.push(String.fromCharCode(861));
        this.diacriticsBottom.push(String.fromCharCode(863));
        this.diacriticsTop.push(String.fromCharCode(864));
        this.diacriticsTop.push(String.fromCharCode(865));
      },

      encode(text: string) {
        let newText = '';
        let newChar;
        for (let i = 0; i < text.length; i++) {
          newChar = text[i];

          // Middle
          // Put just one of the middle characters there, or it gets crowded
          if (this.options.middle) {
            newChar += this.diacriticsMiddle[Math.floor(Math.random() * this.diacriticsMiddle.length)];
          }

          // Top
          if (this.options.top) {
            // Put up to this.options.maxHeight random diacritics on top.
            // optionally fluctuate the number via the randomization value (0-100%)
            // randomization 100%: 0 to maxHeight
            //                30%: 70% of maxHeight to maxHeight
            //                 x%: 100-x% of maxHeight to maxHeight
            const diacriticsTopLength = this.diacriticsTop.length - 1;
            for (let count = 0,
              len = this.options.maxHeight - Math.random() * ((this.options.randomization / 100) * this.options.maxHeight); count < len; count++) {
              newChar += this.diacriticsTop[Math.floor(Math.random() * diacriticsTopLength)];
            }
          }

          // Bottom
          if (this.options.bottom) {
            const diacriticsBottomLength = this.diacriticsBottom.length - 1;
            for (let count = 0,
              len = this.options.maxHeight - Math.random() * ((this.options.randomization / 100) * this.options.maxHeight); count < len; count++) {
              newChar += this.diacriticsBottom[Math.floor(Math.random() * diacriticsBottomLength)];
            }
          }

          newText += newChar;
        }
        return newText;
      },

      decode(text: string) {
        let newText = '';
        let charCode;

        for (let i = 0; i < text.length; i++) {
          charCode = text[i].charCodeAt(0);
          if (charCode < 768 || charCode > 865) {
            newText += text[i];
          }
        }
        return newText;
      },

      diacriticsTop: [] as string[],
      diacriticsMiddle: [] as string[],
      diacriticsBottom: [] as string[],

      options: {
        top: true,
        middle: true,
        bottom: true,
        maxHeight: 15, // How many diacritic marks shall we put on top/bottom?
        randomization: 100, // 0-100%. maxHeight 100 and randomization 20%: the height goes from 80 to 100. randomization 70%, height goes from 30 to 100.
      },
    },

    // Circles around Letters. Uses special circle characters for some letters and combining characters for the rest
    // Thanks to
    // - Alan Wood: http://www.alanwood.net/unicode/enclosed_alphanumerics.html
    bubbles: {
      init() {
        // Numbers
        for (let i = 49; i <= 57; i++) {
          this.map[String.fromCharCode(i)] = String.fromCharCode(i + 9263);
        }
        this.map['0'] = '\u24EA';

        // Capital letters
        for (let i = 65; i <= 90; i++) {
          this.map[String.fromCharCode(i)] = String.fromCharCode(i + 9333);
        }

        // Lower letters
        for (let i = 97; i <= 122; i++) {
          this.map[String.fromCharCode(i)] = String.fromCharCode(i + 9327);
        }

        // invert the map
        for (const i in this.map) {
          this.mapInverse[this.map[i]] = i;
        }
      },

      encode(text: string) {
        let ret = '';
        let ch;
        let first = true;

        for (let i = 0; i < text.length; i++) {
          ch = this.map[text[i]];

          // No dedicated circled character available? Use a Combining Diacritical Mark surrounded
          // with non-breaking spaces, so it doesn't overlap
          if ((typeof (ch) === 'undefined')) {
            if (text[i].charCodeAt(0) >= 33) {
              ch = text[i] + String.fromCharCode(8413);
              if (!first) {
                ch = String.fromCharCode(8239) + String.fromCharCode(160) + String.fromCharCode(160) + String.fromCharCode(8239) + ch;
              }
            }
            else {
              ch = text[i];
            }
          }
          ret += ch;
          first = (ch === '\n');
        }
        return ret;
      },

      decode(text: string) {
        let ret = '';
        let ch;
        let newRet = '';

        for (let i = 0; i < text.length; i++) {
          ch = this.mapInverse[text[i]];
          ret += ((typeof (ch) === 'undefined') ? text[i] : ch);
        }

        for (let i = 0; i < ret.length; i++) {
          ch = ret[i].charCodeAt(0);
          if (ch !== 160 && ch !== 8239 && ch !== 8413) {
            newRet += ret[i];
          }
        }

        return newRet;
      },

      map: {} as Record<string, string>,
      mapInverse: {} as Record<string, string>,
    },

    // Puts a Square Combining Character after a letter, thus ensquaring it, squarily.
    squares: {
      init() {},

      encode(text: string) {
        let ret = '';
        let ch;
        let first = true;

        for (let i = 0; i < text.length; i++) {
          if (text[i].charCodeAt(0) >= 33) {
            ch = text[i] + String.fromCharCode(8414);
            if (!first) {
              ch = String.fromCharCode(8239) + String.fromCharCode(160) + String.fromCharCode(160) + String.fromCharCode(8239) + ch;
            }
          }
          else {
            ch = text[i];
          }

          ret += ch;
          first = (ch === '\n');
        }
        return ret;
      },

      decode(text: string) {
        let ret = '';
        let ch;

        for (let i = 0; i < text.length; i++) {
          ch = text[i].charCodeAt(0);
          if (ch !== 160 && ch !== 8239 && ch !== 8414) {
            ret += text[i];
          }
        }

        return ret;
      },
    },

    // Same as squares, just round.
    roundsquares: {
      init() {},

      encode(text: string) {
        let ret = '';
        let ch;
        let first = true;

        for (let i = 0; i < text.length; i++) {
          if (text[i].charCodeAt(0) >= 33) {
            ch = text[i] + String.fromCharCode(8419);
            if (!first) {
              ch = String.fromCharCode(160) + String.fromCharCode(160) + String.fromCharCode(160) + ch;
            }
          }
          else {
            ch = text[i];
          }

          ret += ch;
          first = (ch === '\n');
        }
        return ret;
      },

      decode(text: string) {
        let ret = '';
        let ch;

        for (let i = 0; i < text.length; i++) {
          ch = text[i].charCodeAt(0);
          if (ch !== 160 && ch !== 8239 && ch !== 8419) {
            ret += text[i];
          }
        }

        return ret;
      },
    },

    // Weird looking alternatives to most characters
    bent: {
      init() {
        // invert the map
        for (const i in this.map) {
          this.map[this.map[i]] = i;
        }
      },

      encode(text: string) {
        let ret = '';
        let ch;

        for (let i = 0, len = text.length; i < len; i++) {
          ch = this.map[text.charAt(i)];
          if (typeof (ch) === 'undefined') {
            ch = text.charAt(i);
          }
          ret += ch;
        }

        return ret;
      },

      decode(text: string) {
        let ret = '';
        let ch;

        for (let i = 0, len = text.length; i < len; i++) {
          ch = this.map[text.charAt(i)];
          if (typeof (ch) === 'undefined') {
            ch = text.charAt(i);
          }
          ret += ch;
        }
        return ret;
      },

      // Thanks to Eddie Ringle for most lowercase letters: http://funicode.com
      map: {
        'a': 'ą',
        'b': 'ҍ',
        'c': 'ç',
        'd': 'ժ',
        'e': 'ҽ',
        'f': 'ƒ',
        'g': 'ց',
        'h': 'հ',
        'i': 'ì',
        'j': 'ʝ',
        'k': 'ҟ',
        'l': 'Ӏ',
        'm': 'ʍ',
        'n': 'ղ',
        'o': 'օ',
        'p': 'ք',
        'q': 'զ',
        'r': 'ɾ',
        's': 'ʂ',
        't': 'է',
        'u': 'մ',
        'v': 'ѵ',
        'w': 'ա',
        'x': '×',
        'y': 'վ',
        'z': 'Հ',
        'A': 'Ⱥ',
        'B': 'β',
        'C': '↻',
        'D': 'Ꭰ',
        'E': 'Ɛ',
        'F': 'Ƒ',
        'G': 'Ɠ',
        'H': 'Ƕ',
        'I': 'į',
        'J': 'ل',
        'K': 'Ҡ',
        'L': 'Ꝉ',
        'M': 'Ɱ',
        'N': 'ហ',
        'O': 'ට',
        'P': 'φ',
        'Q': 'Ҩ',
        'R': 'འ',
        'S': 'Ϛ',
        'T': 'Ͳ',
        'U': 'Ա',
        'V': 'Ỽ',
        'W': 'చ',
        'X': 'ჯ',
        'Y': 'Ӌ',
        'Z': 'ɀ',
        '0': '⊘',
        '1': '������',
        '2': 'ϩ',
        '3': 'Ӡ',
        '4': '५',
        '5': 'Ƽ',
        '6': 'Ϭ',
        '7': '7',
        '8': '������',
        '9': '९',
        '&': '⅋',
        '(': '{',
        ')': '}',
        '{': '(',
        '}': ')',

        'ä': 'ą' + '\u0308',
        'ö': 'օ' + '\u0308',
        'ü': 'մ' + '\u0308',
        'Ä': 'Ⱥ' + '\u0308',
        'Ö': 'ට' + '\u0308',
        'Ü': 'Ա' + '\u0308',

        'é': 'ҽ' + '\u0301',
        'á': 'ą' + '\u0301',
        'ó': 'օ' + '\u0301',
        'ú': 'մ' + '\u0301',
        'É': 'Ɛ' + '\u0301',
        'Á': 'Ⱥ' + '\u0301',
        'Ó': 'ට' + '\u0301',
        'Ú': 'Ա' + '\u0301',

        'è': 'ҽ' + '\u0300',
        'à': 'ą' + '\u0300',
        'ò': 'օ' + '\u0300',
        'ù': 'մ' + '\u0300',
        'È': 'Ɛ' + '\u0300',
        'À': 'Ⱥ' + '\u0300',
        'Ò': 'ට' + '\u0300',
        'Ù': 'Ա' + '\u0300',

        'ê': 'ҽ' + '\u0302',
        'â': 'ą' + '\u0302',
        'ô': 'օ' + '\u0302',
        'û': 'մ' + '\u0302',
        'Ê': 'Ɛ' + '\u0302',
        'Â': 'Ⱥ' + '\u0302',
        'Ô': 'ට' + '\u0302',
        'Û': 'Ա' + '\u0302',
      } as Record<string, string>,
    },

    // Tiny Capitals
    tiny: {
      init() {
        // invert the map
        for (const i in this.map) {
          this.map[this.map[i]] = i;
        }
      },

      encode(text: string) {
        let ret = '';
        let ch;
        text = text.toUpperCase();
        for (let i = 0, len = text.length; i < len; i++) {
          ch = this.map[text.charAt(i)];
          if (typeof (ch) === 'undefined') {
            ch = text.charAt(i);
          }
          ret += ch;
        }

        return ret;
      },

      decode(text: string) {
        let ret = '';
        let ch;

        for (let i = 0, len = text.length; i < len; i++) {
          ch = this.map[text.charAt(i)];
          if (typeof (ch) === 'undefined') {
            ch = text.charAt(i);
          }
          ret += ch;
        }
        return ret;
      },

      // TODO: Find small lower case letters
      map: {
        A: 'ᴀ',
        B: 'ʙ',
        C: 'ᴄ',
        D: 'ᴅ',
        E: 'ᴇ',
        F: 'ꜰ',
        G: 'ɢ',
        H: 'ʜ',
        I: 'ɪ',
        J: 'ᴊ',
        K: 'ᴋ',
        L: 'ʟ',
        M: 'ᴍ',
        N: 'ɴ',
        O: 'ᴏ',
        P: 'ᴘ',
        Q: 'Q',
        R: 'ʀ',
        S: 'ꜱ',
        T: 'ᴛ',
        U: 'ᴜ',
        V: 'ᴠ',
        W: 'ᴡ',
        X: 'x',
        Y: 'ʏ',
        Z: 'ᴢ',
      } as Record<string, string>,
    },

  },

  // Encode every character: U+00A0 -> &#x00a0; etc.
  getHTML(text: string) {
    let html = '';
    let ch;
    let lastSpaceWasNonBreaking = true; // for alternating [non-braking] spaces
    let highSurrogate = 0;
    let codepoint = 0;

    for (let i = 0, len = text.length; i < len; i++) {
      ch = text.charCodeAt(i);

      // line break: add <br>\n
      if (ch === 10 || ch === 13) {
        html += '<br>\n';
        lastSpaceWasNonBreaking = true;

      // space: add alternating space and non-breaking space (U+00A0). Otherwise
      // a series of normal spaces       would collapse to one in the browser
      }
      else if (ch === 32) {
        if (lastSpaceWasNonBreaking) {
          html += ' ';
          lastSpaceWasNonBreaking = false;
        }
        else {
          html += '&nbsp;';
          lastSpaceWasNonBreaking = true;
        }

      // Normal character: Decode. Special cases for higher numbers:
      // http://en.wikipedia.org/wiki/Mapping_of_Unicode_characters#Surrogates
      }
      else {
        // Character is high surrogate: Remember and continue
        if (ch >= 0xD800 && ch <= 0xDBFF) {
          highSurrogate = ch;
          codepoint = 0;

        // last character was high surrogate: Combine with low surrogate
        }
        else if (highSurrogate > 0) {
          // If char is low surrogate:
          if (ch >= 0xDC00 && ch <= 0xDFFF) {
            codepoint = (highSurrogate - 0xD800) * 1024 + (ch - 0xDC00) + 0x10000;
          }
          highSurrogate = 0;

        // no surrogates: Just take the character
        }
        else {
          codepoint = ch;
        }

        if (codepoint !== 0) {
          html += `&#x${codepoint.toString(16)};`;
          lastSpaceWasNonBreaking = true;
        }
      }
    }

    return html;
  },
};

Object.values(lunicode.tools).forEach((tool) => {
  tool.init();
});
