export interface ViewTransform { zoom: number; x: number; y: number }
export interface Size { width: number; height: number }

/**
 * Keeps a zoom factor inside the supported range.
 */
export function clampZoom(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Zooms by `factor` while keeping the content point under (originX, originY) —
 * viewport coordinates, typically the cursor — anchored in place.
 */
export function zoomAround(
  view: ViewTransform,
  factor: number,
  originX: number,
  originY: number,
  min: number,
  max: number,
): ViewTransform {
  const zoom = clampZoom(view.zoom * factor, min, max);
  const ratio = zoom / view.zoom;

  return {
    zoom,
    x: originX - (originX - view.x) * ratio,
    y: originY - (originY - view.y) * ratio,
  };
}

/**
 * Scales the content down to fit entirely inside the viewport (never up past
 * 1:1) and centres it, leaving `padding` pixels of margin.
 */
export function fitTransform(viewport: Size, content: Size, padding: number, min: number, max: number): ViewTransform {
  const zoom = clampZoom(
    Math.min(
      (viewport.width - padding) / content.width,
      (viewport.height - padding) / content.height,
      1,
    ),
    min,
    max,
  );

  return centerTransform(viewport, content, zoom);
}

/**
 * Centres the content in the viewport at the given zoom.
 */
export function centerTransform(viewport: Size, content: Size, zoom: number): ViewTransform {
  return {
    zoom,
    x: (viewport.width - content.width * zoom) / 2,
    y: (viewport.height - content.height * zoom) / 2,
  };
}

/**
 * Converts a wheel event delta into a zoom factor. `deltaY` is normalised
 * because browsers report wheel notches in different units — Firefox in lines,
 * Chrome in pixels — which would otherwise make one of them barely zoom.
 */
export function wheelZoomFactor(deltaY: number, deltaMode: number, sensitivity: number): number {
  const LINE_HEIGHT = 33;
  const PAGE_HEIGHT = 400;
  const unit = deltaMode === 1 ? LINE_HEIGHT : deltaMode === 2 ? PAGE_HEIGHT : 1;

  return Math.exp(-deltaY * unit * sensitivity);
}

/**
 * Whether a newly rendered diagram differs enough from the one the view was
 * last fitted to that the view should be re-fitted. Comparing against the
 * fitted size rather than the previous render keeps a series of small edits
 * from drifting the diagram out of frame without ever crossing the threshold.
 */
export function exceedsRefitThreshold(fitted: Size, rendered: Size, ratio: number): boolean {
  const changed = (from: number, to: number) => Math.abs(to - from) / (from || 1) > ratio;

  return changed(fitted.width, rendered.width) || changed(fitted.height, rendered.height);
}
