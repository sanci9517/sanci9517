/*
 * Sanci9517 Visual Editor v2 — content-aware canvas extent.
 *
 * Inputs are measured client-space bottoms relative to the canvas top. Convert
 * them back to the editor's unscaled coordinate system before sizing the page.
 */
export function computeCanvasMinHeight(nodeBottoms, zoom = 1, minimum = 844, bottomPadding = 80) {
  const scale = Number.isFinite(zoom) && zoom > 0 ? zoom : 1;
  const floor = Number.isFinite(minimum) && minimum > 0 ? minimum : 844;
  const padding = Number.isFinite(bottomPadding) && bottomPadding >= 0 ? bottomPadding : 80;
  const bottoms = Array.isArray(nodeBottoms) ? nodeBottoms : [];
  const contentBottom = bottoms.reduce((maximum, value) => (
    Number.isFinite(value) ? Math.max(maximum, value / scale) : maximum
  ), 0);
  return Math.max(floor, Math.ceil(contentBottom + padding));
}
