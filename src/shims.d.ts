declare module '*.vue' {
  import type {  ComponentOptions } from 'vue';
  const Component: ComponentOptions;
  export default Component;
}

declare module '*.md' {
  import type {  ComponentOptions } from 'vue';
  const Component: ComponentOptions;
  export default Component;
}

declare module 'emojilib' {
  const lib: Record<string, string[]>;
  export default lib;
}

declare module 'unicode-emoji-json' {
  const emoji: Record<string, {
    name: string;
    slug: string;
    group: string;
    emoji_version: string;
    unicode_version: string;
    skin_tone_support: boolean;
    skin_tone_support_unicode_version: string;
  }>;
  
  export default emoji;
}

declare module 'pdf-signature-reader' {
  const verifySignature: (pdf: ArrayBuffer) => ({signatures: SignatureInfo[]});

  export default verifySignature;
}

declare module 'vite-plugin-splash-screen/runtime' {
  export function hideSplashScreen();
}

interface BigInt {
  toJSON: () => string;
}

interface JSON {
  parseBigInt: (jsonStr: string, options?: { minDigits?: number; }) => any;
  parseBigNum: (jsonStr: string) => any;
  rawJSON(value: string): any;
}

interface Navigator {
  gpu?: any;
}

interface FontFaceSet {
  add(fontFace: FontFace)
}

// TODO remove once https://github.com/microsoft/TypeScript/issues/60608 is resolved
// eslint-disable-next-line @typescript-eslint/no-namespace
namespace Intl {
  class DurationFormat {
    constructor(locale?: Intl.LocalesArgument, options?: { style?: 'long' });
    format(duration: { seconds?: number; milliseconds?: number }): string;
  }
}
