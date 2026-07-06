declare module 'heic-convert/browser' {
  interface ConversionOptions {
    /**
     * the HEIC file buffer
     */
    buffer: ArrayBufferLike | Uint8Array;
    /**
     * output format
     */
    format: 'JPEG' | 'PNG';
    /**
     * the JPEG compression quality, between 0 and 1
     * @default 0.92
     */
    quality?: number;
  }

  interface Convertible {
    convert(): Promise<ArrayBuffer>;
  }

  /** @async */
  function convert(image: ConversionOptions): Promise<ArrayBuffer>;
  namespace convert {
    /** @async */
    function all(image: ConversionOptions): Promise<Convertible[]>;
  }

  export default convert;
}
