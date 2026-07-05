declare module 'esm-potrace-wasm' {
export function potrace(
  imageBitmapSource: ImageBitmapSource,
  options: Object
): Promise<string>;
export function init(): Promise<void>;
}