// Assumes vtracer_webapp.js, vtracer_webapp_bg.wasm, and vtracer_webapp.d.ts are in './wasm/'

export interface ColorVTracerOptions {
  wasmPath?: string // custom path to vtracer_webapp_bg.wasm
  potraceOptions?: any // options for Potrace
  // VTracer and Potrace options can be passed through
  [key: string]: any
}

export async function createCanvasFromFile(file: File | Blob): Promise<HTMLCanvasElement> {
  // Convert File → data URL
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  // Load image
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = dataUrl;
  });

  // Create canvas
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Unable to get 2D context');
  }

  // Draw image into canvas
  ctx.drawImage(img, 0, 0);

  return canvas;
}

/**
 * Convert PNG/JPG to SVG using VTracer (color) or Potrace (B/W)
 * @param image File, Blob, or ArrayBuffer
 * @param options SVGit4MeOptions (use 'wasmPath' to customize WASM location for VTracer)
 * @returns SVG string
 */
export async function convertToSVG(
  image: File | Blob,
  options: ColorVTracerOptions = {},
): Promise<string> {
  // Decide which engine to use

  // Use VTracer for color (default)
  let vtracerInit: any;
  let ColorImageConverter: any;
  if (typeof window !== 'undefined' && (window as any).ColorImageConverter) {
    // Loaded globally (e.g. via <Script src="/vtracer_webapp.js" /> in Next.js)
    vtracerInit = (window as any).default || (window as any).vtracerInit;
    ColorImageConverter = (window as any).ColorImageConverter;
  }
  if (options.wasmPath) {
    await vtracerInit(options.wasmPath);
  }
  else {
    await vtracerInit();
  }
  // Create a hidden SVG element in the DOM
  const svgId = options.svg_id || `svgit4me-svg-${Math.random().toString(36).slice(2)}`;
  let svgElem = document.getElementById(svgId) as SVGSVGElement | null;
  if (!svgElem) {
    svgElem = document.createElementNS('http://www.w3.org/2000/svg', 'svg') as SVGSVGElement;
    svgElem.setAttribute('id', svgId);
    svgElem.style.display = 'none';
    document.body.appendChild(svgElem);
  }
  // Add svg_id to options for WASM
  options.svg_id = svgId;

  // Create a hidden SVG element in the DOM
  const canvasId = options.canvas_id || `svgit4me-canvas-${Math.random().toString(36).slice(2)}`;
  let canvasElem = document.getElementById(canvasId) as HTMLCanvasElement | null;
  if (!canvasElem) {
    canvasElem = await createCanvasFromFile(image);
    canvasElem.setAttribute('id', canvasId);
    canvasElem.style.display = 'none';
    document.body.appendChild(canvasElem);
  }
  // Add canvas_id to options for WASM
  options.canvas_id = canvasId;

  options.max_iterations = 10;

  const params = JSON.stringify(options);
  const converter = ColorImageConverter.new_with_string(params);
  converter.init();
  // eslint-disable-next-line no-empty
  while (!converter.tick()) {}
  // Get the SVG string from the DOM
  let svgString = '';
  if (svgElem) {
    svgString = new XMLSerializer().serializeToString(svgElem);
    svgString = svgString.replace(/<svg[^>]*>/,
      `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="${canvasElem.width}" height="${canvasElem.height}" viewBox="0 0 ${canvasElem.width} ${canvasElem.height}" version="1.1">`);
    converter.free();
    svgElem.remove();
    canvasElem.remove();
  }
  return svgString;
}
