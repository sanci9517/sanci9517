export function setLoading(root, message = 'Betöltés…') {
  if (!root) return;
  root.setAttribute('aria-busy', 'true');
  root.dataset.loadingMessage = message;
}

export function clearLoading(root) {
  if (!root) return;
  root.removeAttribute('aria-busy');
  delete root.dataset.loadingMessage;
}

export function showError(root, message = 'Valami hiba történt.') {
  if (!root) return;
  root.innerHTML = `
    <section class="state state-error" role="alert">
      <h1>Hiba történt</h1>
      <p>${escapeHtml(message)}</p>
      <button class="button button-primary" type="button" data-retry>Újrapróbálás</button>
    </section>
  `;
}

export function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
