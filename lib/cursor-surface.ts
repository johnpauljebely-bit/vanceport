function parseRgba(value: string): [number, number, number, number] | null {
  const m = value.match(/rgba?\(([^)]+)\)/);
  if (!m) return null;
  const parts = m[1].split(",").map((s) => parseFloat(s));
  const [r, g, b, a = 1] = parts;
  if ([r, g, b].some((n) => Number.isNaN(n))) return null;
  return [r, g, b, a];
}

function luminance(r: number, g: number, b: number) {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

const imageCanvasCache = new Map<string, CanvasRenderingContext2D | null>();

function getImageContext(img: HTMLImageElement): CanvasRenderingContext2D | null {
  if (!img.complete || img.naturalWidth === 0) return null;

  const cached = imageCanvasCache.get(img.src);
  if (cached !== undefined) return cached;

  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) {
    imageCanvasCache.set(img.src, null);
    return null;
  }
  try {
    ctx.drawImage(img, 0, 0);
  } catch {
    imageCanvasCache.set(img.src, null);
    return null;
  }
  imageCanvasCache.set(img.src, ctx);
  return ctx;
}

/** Maps a viewport point to source-image pixel coordinates, accounting for object-fit. */
function mapToImagePixel(
  img: HTMLImageElement,
  clientX: number,
  clientY: number
): { x: number; y: number } | null {
  const rect = img.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return null;
  const nw = img.naturalWidth;
  const nh = img.naturalHeight;
  if (!nw || !nh) return null;

  const fit = getComputedStyle(img).objectFit;
  const boxRatio = rect.width / rect.height;
  const imgRatio = nw / nh;

  let drawW = rect.width;
  let drawH = rect.height;
  let offX = 0;
  let offY = 0;

  if (fit === "contain") {
    if (imgRatio > boxRatio) {
      drawW = rect.width;
      drawH = rect.width / imgRatio;
      offY = (rect.height - drawH) / 2;
    } else {
      drawH = rect.height;
      drawW = rect.height * imgRatio;
      offX = (rect.width - drawW) / 2;
    }
  } else if (fit === "cover") {
    if (imgRatio > boxRatio) {
      drawH = rect.height;
      drawW = rect.height * imgRatio;
      offX = (rect.width - drawW) / 2;
    } else {
      drawW = rect.width;
      drawH = rect.width / imgRatio;
      offY = (rect.height - drawH) / 2;
    }
  }

  const localX = clientX - rect.left - offX;
  const localY = clientY - rect.top - offY;
  if (localX < 0 || localY < 0 || localX > drawW || localY > drawH) return null;

  return { x: localX * (nw / drawW), y: localY * (nh / drawH) };
}

function sampleImagePixel(img: HTMLImageElement, clientX: number, clientY: number): [number, number, number] | null {
  const ctx = getImageContext(img);
  if (!ctx) return null;
  const point = mapToImagePixel(img, clientX, clientY);
  if (!point) return null;
  const px = Math.max(0, Math.min(ctx.canvas.width - 1, Math.round(point.x)));
  const py = Math.max(0, Math.min(ctx.canvas.height - 1, Math.round(point.y)));
  try {
    const data = ctx.getImageData(px, py, 1, 1).data;
    if (data[3] < 40) return null; // transparent pixel, no usable color
    return [data[0], data[1], data[2]];
  } catch {
    return null;
  }
}

/**
 * Walks up from the point under the cursor to find the nearest resolvable
 * surface color and returns whether it reads as "dark". Checks, in order:
 * an explicit data-cursor-surface tag, the actual pixel of an <img> at that
 * point (real image content, e.g. logos/photos), or an opaque
 * background-color. Background gradients/CSS images with no readable pixel
 * source fall through to whichever ancestor resolves next.
 */
export function isDarkSurfaceAt(x: number, y: number): boolean {
  let el = document.elementFromPoint(x, y) as HTMLElement | null;

  while (el) {
    const explicit = el.getAttribute("data-cursor-surface");
    if (explicit === "dark") return true;
    if (explicit === "light") return false;

    if (el instanceof HTMLImageElement) {
      const pixel = sampleImagePixel(el, x, y);
      if (pixel) return luminance(pixel[0], pixel[1], pixel[2]) < 140;
    }

    const bg = getComputedStyle(el).backgroundColor;
    const parsed = bg ? parseRgba(bg) : null;
    if (parsed && parsed[3] > 0.5) {
      return luminance(parsed[0], parsed[1], parsed[2]) < 140;
    }

    el = el.parentElement;
  }

  return false;
}
