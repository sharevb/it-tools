/**
 * Shared @huggingface/transformers setup for the tools that run models in the browser (translator,
 * remove-background, math-ocr). Import it for its side effects before calling `pipeline()`.
 *
 * - The ONNX runtime (the WASM binary and its JS glue, used by both the WASM and the WebGPU backends) is shipped with
 *   the app instead of being fetched from cdn.jsdelivr.net, which is what transformers.js defaults to.
 * - Models still come from the Hugging Face Hub, unless tools-settings.json points
 *   `{ "transformers": { "models-url": "..." } }` at a mirror. The mirror must keep the Hub's layout,
 *   `<models-url>/<org>/<model>/resolve/main/<file>` (e.g. `Xenova/opus-mt-en-fr/resolve/main/config.json`),
 *   so a plain copy of the huggingface.co repositories works. A relative value is resolved against the app's base URL.
 */
import { env } from '@huggingface/transformers';
// The same files transformers.js would load from the CDN (`dist/` of the exact package version). The aliased path
// (see vite.config.ts) gets around the package's `exports`, which don't list them.
import ortWasmModuleUrl from '@huggingface/transformers/dist/ort-wasm-simd-threaded.jsep.mjs?url';
import ortWasmBinaryUrl from '@huggingface/transformers/dist/ort-wasm-simd-threaded.jsep.wasm?url';
import { getToolsSettingString, toolsSettings } from '@/tools-settings';

// Per-file paths rather than a directory prefix: the build hashes both file names.
env.backends.onnx.wasm!.wasmPaths = { mjs: ortWasmModuleUrl, wasm: ortWasmBinaryUrl };

const modelsUrl = getToolsSettingString(toolsSettings, 'transformers', 'models-url');
if (modelsUrl) {
  env.remoteHost = new URL(modelsUrl, document.baseURI).href;
}
