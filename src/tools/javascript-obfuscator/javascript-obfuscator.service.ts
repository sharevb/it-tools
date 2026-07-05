import { get } from '@vueuse/core';
import JavaScriptObfuscator from 'javascript-obfuscator';
import { type MaybeRef, computed } from 'vue';

export { obfuscateJavascript, useObfuscateJavascript };

function base64Encode(str: string) {
  // encode UTF-8 to base64
  return btoa(unescape(encodeURIComponent(str)));
}

function rot13Encode(str: string) {
  return str.replace(/[A-Za-z]/g, c => String.fromCharCode((c <= 'Z' ? 65 : 97) + ((c.charCodeAt(0) - (c <= 'Z' ? 65 : 97) + 13) % 26)));
}

function obfuscateJavascript(code: string, method: 'base64' | 'rot13' | 'obfuscator.io' = 'base64'): string {
  if (!code) {
    return '';
  }

  try {
    if (method === 'obfuscator.io') {
      return JavaScriptObfuscator.obfuscate(code,
        {
          compact: false,
          controlFlowFlattening: true,
          controlFlowFlatteningThreshold: 1,
          numbersToExpressions: true,
          simplify: true,
          stringArrayShuffle: true,
          splitStrings: true,
          stringArrayThreshold: 1,
        },
      ).getObfuscatedCode();
    }

    if (method === 'base64') {
      const b = base64Encode(code);
      return `(function(){eval(atob('${b}'));})();`;
    }

    const r = rot13Encode(code);
    return `(function(s){function r(u){return u.replace(/[A-Za-z]/g,c=>String.fromCharCode((c<='Z'?65:97)+((c.charCodeAt(0)-(c<='Z'?65:97)+13)%26)))};eval(r(s))})('${r}');`;
  }
  catch (e: any) {
    return `/* ERROR: ${e.toString()} */`;
  }
}

function useObfuscateJavascript(code: MaybeRef<string>, method?: MaybeRef<'base64' | 'rot13' | 'obfuscator.io'>) {
  return computed(() => obfuscateJavascript(get(code), get(method) || 'base64'));
}
