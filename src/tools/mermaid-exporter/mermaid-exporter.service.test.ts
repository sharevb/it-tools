import { describe, expect, it } from 'vitest';
import {
  centerTransform,
  clampZoom,
  exceedsRefitThreshold,
  fitTransform,
  wheelZoomFactor,
  zoomAround,
} from './mermaid-exporter.service';

const MIN = 0.05;
const MAX = 10;

describe('mermaid-exporter service', () => {
  describe('clampZoom', () => {
    it('leaves a value inside the range untouched', () => {
      expect(clampZoom(1.5, MIN, MAX)).toBe(1.5);
    });

    it('clamps to the bounds', () => {
      expect(clampZoom(0.001, MIN, MAX)).toBe(MIN);
      expect(clampZoom(1000, MIN, MAX)).toBe(MAX);
    });

    it('clamps a non-finite value to the maximum', () => {
      expect(clampZoom(Number.POSITIVE_INFINITY, MIN, MAX)).toBe(MAX);
    });
  });

  describe('zoomAround', () => {
    it('keeps the anchor point fixed', () => {
      const before = { zoom: 1, x: 0, y: 0 };
      const after = zoomAround(before, 2, 100, 50, MIN, MAX);

      // the content point under the anchor must not move: at zoom z the point
      // is at (anchor - pan) / z in content space
      expect((100 - before.x) / before.zoom).toBeCloseTo((100 - after.x) / after.zoom, 6);
      expect((50 - before.y) / before.zoom).toBeCloseTo((50 - after.y) / after.zoom, 6);
      expect(after.zoom).toBe(2);
    });

    it('does not drift the view once the zoom is clamped', () => {
      const atMax = { zoom: MAX, x: -120, y: -80 };
      expect(zoomAround(atMax, 4, 200, 100, MIN, MAX)).toEqual(atMax);

      const atMin = { zoom: MIN, x: 10, y: 20 };
      expect(zoomAround(atMin, 0.1, 200, 100, MIN, MAX)).toEqual(atMin);
    });
  });

  describe('fitTransform', () => {
    it('scales a large diagram down and centres it', () => {
      const view = fitTransform({ width: 500, height: 400 }, { width: 4000, height: 2000 }, 20, MIN, MAX);

      // width is the binding constraint: (500 - 20) / 4000
      expect(view.zoom).toBeCloseTo(0.12, 6);
      expect(view.x).toBeCloseTo((500 - 4000 * 0.12) / 2, 6);
      expect(view.y).toBeCloseTo((400 - 2000 * 0.12) / 2, 6);
    });

    it('never scales a small diagram above 1:1', () => {
      const view = fitTransform({ width: 800, height: 600 }, { width: 100, height: 50 }, 20, MIN, MAX);

      expect(view.zoom).toBe(1);
      expect(view.x).toBe(350);
      expect(view.y).toBe(275);
    });

    it('honours the minimum zoom for a diagram that cannot fit', () => {
      const view = fitTransform({ width: 200, height: 200 }, { width: 100000, height: 100 }, 20, MIN, MAX);

      expect(view.zoom).toBe(MIN);
    });
  });

  describe('centerTransform', () => {
    it('centres the scaled content', () => {
      expect(centerTransform({ width: 600, height: 400 }, { width: 200, height: 100 }, 2)).toEqual({
        zoom: 2,
        x: 100,
        y: 100,
      });
    });
  });

  describe('wheelZoomFactor', () => {
    it('zooms in on a negative delta and out on a positive one', () => {
      expect(wheelZoomFactor(-100, 0, 0.0015)).toBeGreaterThan(1);
      expect(wheelZoomFactor(100, 0, 0.0015)).toBeLessThan(1);
    });

    it('gives a line-mode notch the same weight as a pixel-mode one', () => {
      // Firefox reports ~3 lines where Chrome reports ~100 pixels
      const chrome = wheelZoomFactor(-100, 0, 0.0015);
      const firefox = wheelZoomFactor(-3, 1, 0.0015);

      expect(firefox).toBeCloseTo(chrome, 1);
      expect(firefox).toBeGreaterThan(1.1);
    });

    it('scales page-mode deltas up as well', () => {
      expect(wheelZoomFactor(-1, 2, 0.0015)).toBeGreaterThan(wheelZoomFactor(-1, 0, 0.0015));
    });
  });

  describe('exceedsRefitThreshold', () => {
    it('ignores a change under the threshold', () => {
      expect(exceedsRefitThreshold({ width: 1000, height: 500 }, { width: 1010, height: 505 }, 0.02)).toBe(false);
    });

    it('reports a change over the threshold in either dimension', () => {
      expect(exceedsRefitThreshold({ width: 1000, height: 500 }, { width: 1100, height: 500 }, 0.02)).toBe(true);
      expect(exceedsRefitThreshold({ width: 1000, height: 500 }, { width: 1000, height: 600 }, 0.02)).toBe(true);
    });

    it('treats the first render, measured against a zero size, as a change', () => {
      expect(exceedsRefitThreshold({ width: 0, height: 0 }, { width: 300, height: 200 }, 0.02)).toBe(true);
    });

    it('accumulates: small edits measured against the fitted size eventually refit', () => {
      const fitted = { width: 1000, height: 500 };
      // ten 1.5% edits never trip the threshold against the previous render,
      // but together they are 15% away from the size the view was fitted to
      expect(exceedsRefitThreshold(fitted, { width: 1150, height: 500 }, 0.02)).toBe(true);
    });
  });
});
