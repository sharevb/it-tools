/**
 * Calculates viewport dimensions bounded by max width and height.
 */
export function getViewportDimensions(
  ratio: number,
  maxWidth: number = 450,
  maxHeight: number = 450,
): { width: number; height: number } {
  if (ratio >= 1) {
    return {
      width: maxWidth,
      height: maxWidth / ratio,
    };
  }
  else {
    return {
      width: maxHeight * ratio,
      height: maxHeight,
    };
  }
}

/**
 * Calculates base dimensions of the image when fit to cover the viewport.
 */
export function getBaseDimensions(
  vW: number,
  vH: number,
  naturalWidth: number,
  naturalHeight: number,
): { width: number; height: number } {
  if (!naturalWidth || !naturalHeight) {
    return { width: vW, height: vH };
  }
  const vRatio = vW / vH;
  const iRatio = naturalWidth / naturalHeight;

  if (iRatio > vRatio) {
    // Landscape relative to viewport
    return {
      width: vH * iRatio,
      height: vH,
    };
  }
  else {
    // Portrait relative to viewport
    return {
      width: vW,
      height: vW / iRatio,
    };
  }
}
