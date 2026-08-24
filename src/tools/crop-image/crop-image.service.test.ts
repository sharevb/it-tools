import { describe, expect, it } from 'vitest';
import { getBaseDimensions, getViewportDimensions } from './crop-image.service';

describe('crop-image service utilities', () => {
  describe('getViewportDimensions', () => {
    it('calculates landscape/square ratios correctly', () => {
      // 1:1 ratio
      const sq = getViewportDimensions(1, 400, 400);
      expect(sq).toEqual({ width: 400, height: 400 });

      // 2:1 ratio (landscape)
      const ls = getViewportDimensions(2, 400, 400);
      expect(ls).toEqual({ width: 400, height: 200 });
    });

    it('calculates portrait ratios correctly', () => {
      // 1:2 ratio (portrait)
      const pt = getViewportDimensions(0.5, 400, 400);
      expect(pt).toEqual({ width: 200, height: 400 });
    });
  });

  describe('getBaseDimensions', () => {
    it('returns viewport dimensions when natural dimensions are zero or missing', () => {
      const fallback = getBaseDimensions(300, 200, 0, 0);
      expect(fallback).toEqual({ width: 300, height: 200 });
    });

    it('calculates cover dimensions for landscape image in portrait viewport', () => {
      // Image: 800x600 (4:3 landscape, ratio 1.33)
      // Viewport: 300x400 (3:4 portrait, ratio 0.75)
      // Image should fit to height (400) and scale width to 400 * 1.3333 = 533.33
      const cover = getBaseDimensions(300, 400, 800, 600);
      expect(cover.height).toBe(400);
      expect(cover.width).toBeCloseTo(533.33, 1);
    });

    it('calculates cover dimensions for portrait image in landscape viewport', () => {
      // Image: 600x800 (3:4 portrait, ratio 0.75)
      // Viewport: 400x300 (4:3 landscape, ratio 1.33)
      // Image should fit to width (400) and scale height to 400 / 0.75 = 533.33
      const cover = getBaseDimensions(400, 300, 600, 800);
      expect(cover.width).toBe(400);
      expect(cover.height).toBeCloseTo(533.33, 1);
    });
  });
});
