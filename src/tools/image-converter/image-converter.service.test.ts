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
  beforeAll(async () => {
    await initializeSvgRenderer(async () => new Uint8Array(await (await fetch(wasmDataUrl)).arrayBuffer()));
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

    it('renders text with the embedded roboto font', async () => {
      const png = await convertSvgToPng({
        svg: '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="50"><text x="10" y="30">it-tools</text></svg>',
        scale: 1,
      });

      expect(isPng(png)).toBe(true);
      expect(readPngSize(png)).toEqual({ width: 200, height: 50 });
    });

    it('rejects content that is not an svg', async () => {
      await expect(convertSvgToPng({ svg: 'not an svg at all', scale: 1 })).rejects.toThrow();
    });
  });

  describe('initializeSvgRenderer', () => {
    it('only initializes the wasm module once, as a second call would throw', async () => {
      await expect(initializeSvgRenderer(() => {
        throw new Error('should not be called again');
      })).resolves.toBeUndefined();
    });
  });
});
