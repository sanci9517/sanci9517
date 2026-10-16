export function requestedPageId(location = window.location) {
  return new URLSearchParams(location.search).get('pageId')?.trim() || null;
}

export function initialPageId(requestedId, pages) {
  return pages.find(page => page.id === requestedId)?.id || pages[0]?.id || null;
}

export function rememberPageId(pageId, windowRef = window) {
  const url = new URL(windowRef.location.href);
  if (pageId) url.searchParams.set('pageId', pageId);
  else url.searchParams.delete('pageId');
  windowRef.history.replaceState(windowRef.history.state, '', `${url.pathname}${url.search}${url.hash}`);
}
