import { beforeAll, describe, expect, it } from 'vitest';
// the repo aliases `node:fs` to an empty stub, so the binary is inlined by vite instead of read from disk
import wasmDataUrl from '@resvg/resvg-wasm/index_bg.wasm?url&inline';
import { convertSvgToPng, initializeSvgRenderer } from './image-converter.service';

const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="50"><rect width="100" height="50" fill="#18a058"/></svg>';

function readPngSize(png: Uint8Array) {
  const view = new DataView(png.buffer, png.byteOffset, png.byteLength);

  // width and height are the first two fields of the IHDR chunk, which always comes first
  return { width: view.getUint32(16), height: view.getUint32(20) };
}

function isPng(bytes: Uint8Array) {
  return [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A].every((byte, index) => bytes[index] === byte);
}

describe('image-converter', () => {
  const loadWasm = async () => new Uint8Array(await (await fetch(wasmDataUrl)).arrayBuffer());
  let firstAttemptError: unknown;

  beforeAll(async () => {
    // a failed download must not be memoized: this first attempt fails, and the next one still has
    // to initialize the renderer for the rest of the suite
    await initializeSvgRenderer(() => Promise.reject(new Error('network is down'))).catch((error) => {
      firstAttemptError = error;
    });

    await initializeSvgRenderer(loadWasm);
  });

  describe('convertSvgToPng', () => {
    it('rasterizes an svg to a png', async () => {
      const png = await convertSvgToPng({ svg, scale: 1 });

      expect(isPng(png)).toBe(true);
      expect(readPngSize(png)).toEqual({ width: 100, height: 50 });
    });

    it('scales the output', async () => {
      expect(readPngSize(await convertSvgToPng({ svg, scale: 2 }))).toEqual({ width: 200, height: 100 });
      expect(readPngSize(await convertSvgToPng({ svg, scale: 4 }))).toEqual({ width: 400, height: 200 });
      expect(readPngSize(await convertSvgToPng({ svg, scale: 0.5 }))).toEqual({ width: 50, height: 25 });
    });

    it.each<[string, string]>([
      ['the default family', '<text x="10" y="30" font-size="20">it-tools</text>'],
      ['an explicit roboto family', '<text x="10" y="30" font-size="20" font-family="Roboto">it-tools</text>'],
    ])('draws text using %s', async (_, text) => {
      const canvas = (content: string) =>
        `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="50">${content}</svg>`;

      const blank = await convertSvgToPng({ svg: canvas(''), scale: 1 });
      const png = await convertSvgToPng({ svg: canvas(text), scale: 1 });

      expect(isPng(png)).toBe(true);
      expect(readPngSize(png)).toEqual({ width: 200, height: 50 });
      // something was actually drawn: svg2png-wasm used to return an empty canvas for the second case
      expect(png).not.toEqual(blank);
    });

    it('rejects content that is not an svg', async () => {
      await expect(convertSvgToPng({ svg: 'not an svg at all', scale: 1 })).rejects.toThrow();
    });
  });

  describe('initializeSvgRenderer', () => {
    it('surfaces a failed download without memoizing it', () => {
      // the whole suite renders fine afterwards, which is what proves the retry actually happened
      expect(firstAttemptError).toEqual(new Error('network is down'));
    });

    it('only initializes the wasm module once, as a second call would throw', async () => {
      await expect(initializeSvgRenderer(() => {
        throw new Error('should not be called again');
      })).resolves.toBeUndefined();
    });
  });
});
