import type { InitInput } from '@resvg/resvg-wasm';
import { Resvg, initWasm } from '@resvg/resvg-wasm';
import { Base64 } from 'js-base64';
import { normal as robotoBase64 } from 'roboto-base64';
import resvgWasmUrl from '@resvg/resvg-wasm/index_bg.wasm?url';

type WasmLoader = () => Promise<InitInput> | InitInput;

const defaultWasmLoader: WasmLoader = () => fetch(resvgWasmUrl);

let initialization: Promise<void> | undefined;

/**
 * `initWasm` throws when called more than once, so the very first call wins and every later one
 * awaits it. The loader is injectable so tests can feed the binary without going through the network.
 */
export function initializeSvgRenderer(loadWasm: WasmLoader = defaultWasmLoader) {
  initialization ??= Promise.resolve(loadWasm())
    .then(input => initWasm(input))
    .catch((error) => {
      // a failed download must not be memoized, otherwise a single network hiccup would leave the
      // tool broken until the page is reloaded
      initialization = undefined;
      throw error;
    });

  return initialization;
}

export async function convertSvgToPng({ svg, scale }: { svg: string; scale: number }) {
  await initializeSvgRenderer();

  const renderer = new Resvg(svg, {
    fitTo: { mode: 'zoom', value: scale },
    // Roboto is the only font embedded in the app, so it also has to be the fallback family:
    // resvg defaults to a family that is not loaded, which would drop every text node.
    font: {
      fontBuffers: [Base64.toUint8Array(robotoBase64)],
      defaultFontFamily: 'Roboto',
    },
  });

  try {
    const rendered = renderer.render();

    try {
      return rendered.asPng();
    }
    finally {
      rendered.free();
    }
  }
  finally {
    renderer.free();
  }
}
