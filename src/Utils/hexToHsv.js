import { hexToRgba } from "./hexToRgba";

export function hexToHsv(hex) {
  const { r, g, b, a } = hexToRgba(hex);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  let h = 0;
  let s = max === 0 ? 0 : delta / max;
  let v = max / 255;

  if (delta !== 0) {
    if (max === r) {
      h = (g - b) / delta;
    } else if (max === g) {
      h = (b - r) / delta + 2;
    } else {
      h = (r - g) / delta + 4;
    }
    h = (h * 60 + 360) % 360;
  }

  return { h, s, v, a };
};
