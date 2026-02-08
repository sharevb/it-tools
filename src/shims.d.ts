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

declare module 'units-converter' {
  interface ITo{
    to(unit: string): { value: number }
  }
  interface IFrom{
    from(unit: string): ITo
  }
  export function frequency(value: number): IFrom;
  export function volumeFlowRate(value: number): IFrom;
  export function acceleration(value: number): IFrom;
  export function speed(value: number): IFrom;
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

declare module '@vueuse/integrations/useIDBKeyval' {
  interface Serializer<T> {
    read: (raw: unknown) => T
    write: (value: T) => unknown
  }
  export interface UseIDBOptions<T> extends ConfigurableFlush {
    /**
     * Watch for deep changes
     *
     * @default true
     */
    deep?: boolean
    /**
     * On error callback
     *
     * Default log error to `console.error`
     */
    onError?: (error: unknown) => void
    /**
     * Use shallow ref as reference
     *
     * @default false
     */
    shallow?: boolean
    /**
     * Write the default value to the storage when it does not exist
     *
     * @default true
     */
    writeDefaults?: boolean
    /**
     * Custom data serialization
     */
    serializer?: Serializer<T>
  }
  export interface UseIDBKeyvalReturn<T> {
    data: RemovableRef<T>
    isFinished: ShallowRef<boolean>
    set: (value: T) => Promise<void>
  }
  /**
   *
   * @param key
   * @param initialValue
   * @param options
   */
  export declare function useIDBKeyval<T>(
    key: IDBValidKey,
    initialValue: MaybeRefOrGetter<T>,
    options?: UseIDBOptions<T>,
  ): UseIDBKeyvalReturn<T>
}
