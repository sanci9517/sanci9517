/** Keep intentionally out-of-artboard nodes inside the scrollable workspace. */
export function measureCanvasWorkspace(nodes, pageWidth, pageHeight, zoom = 1) {
  const scale = Number.isFinite(zoom) && zoom > 0 ? zoom : 1;
  const width = Number.isFinite(pageWidth) && pageWidth > 0 ? pageWidth : 1;
  const height = Number.isFinite(pageHeight) && pageHeight > 0 ? pageHeight : 1;
  const bounds = Array.isArray(nodes) ? nodes : [];
  const left = bounds.reduce((min, item) => Number.isFinite(item?.left) ? Math.min(min, item.left / scale) : min, 0);
  const top = bounds.reduce((min, item) => Number.isFinite(item?.top) ? Math.min(min, item.top / scale) : min, 0);
  const right = bounds.reduce((max, item) => Number.isFinite(item?.right) ? Math.max(max, item.right / scale) : max, width);
  const bottom = bounds.reduce((max, item) => Number.isFinite(item?.bottom) ? Math.max(max, item.bottom / scale) : max, height);
  return Object.freeze({
    left: Math.ceil(Math.max(0, -left)),
    top: Math.ceil(Math.max(0, -top)),
    right: Math.ceil(Math.max(0, right - width)),
    bottom: Math.ceil(Math.max(0, bottom - height))
  });
}
