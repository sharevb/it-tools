declare module 'esm-potrace-wasm' {
  export function potrace(imageBitmapSource: ImageBitmapSource, options: object): Promise<string>;
  export function init(): Promise<void>;
}
