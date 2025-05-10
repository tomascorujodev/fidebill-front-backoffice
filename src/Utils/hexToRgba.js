export function hexToRgba(hex) {
  hex = hex.replace(/^#/, "");

  if (hex.length !== 6 && hex.length !== 8) {
    throw new Error("Formato de color inválido. Usa #RRGGBB o #RRGGBBAA.");
  }

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const a = hex.length === 8 ? parseInt(hex.substring(6, 8), 16) / 255 : 1;

  return { r, g, b, a };
}