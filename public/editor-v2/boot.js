/*
 * Sanci9517 Visual Editor v2 — canonical boot diagnostics.
 * This file intentionally has no imports so it can report failures in the module graph.
 */
(function () {
  const startedAt = Date.now();
  let appStarted = false;
  let appReady = false;
  let timeoutId = null;

  function status(text) {
    const el = document.querySelector('#saveStatus');
    if (el) el.textContent = text;
  }

  function describeError(event) {
    if (event instanceof ErrorEvent) {
      const source = event.filename ? ` — ${event.filename}:${event.lineno || 0}:${event.colno || 0}` : '';
      return `${event.message || 'Ismeretlen JavaScript hiba'}${source}`;
    }
    const target = event?.target;
    if (target?.src) return `Erőforrás betöltési hiba — ${target.src}`;
    return 'Ismeretlen erőforrás-betöltési hiba';
  }

  function fail(message, detail = null) {
    const text = `Editor betöltési hiba: ${message}`;
    status(text);
    console.error('[Sanci9517 Editor Boot]', text, detail || '');
    document.documentElement.dataset.editorBoot = 'error';
  }

  window.__sanciEditorBoot = Object.freeze({
    started() {
      appStarted = true;
      status('Editor indítása…');
      document.documentElement.dataset.editorBoot = 'started';
    },
    ready() {
      appReady = true;
      if (timeoutId) clearTimeout(timeoutId);
      status('Mentve');
      document.documentElement.dataset.editorBoot = 'ready';
      console.info('[Sanci9517 Editor Boot] ready', `${Date.now() - startedAt}ms`);
    },
    fail
  });

  window.addEventListener('error', (event) => {
    if (event.target instanceof HTMLScriptElement || event instanceof ErrorEvent) {
      fail(describeError(event), event.error || event.target);
    }
  }, true);

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason instanceof Error ? event.reason.message : String(event.reason);
    fail(`Nem kezelt Promise hiba: ${reason}`, event.reason);
  });

  timeoutId = window.setTimeout(() => {
    if (appReady) return;
    if (!appStarted) {
      fail('A fő editor modul nem indult el. Ellenőrizd a modulbetöltést és a böngésző konzolját.');
      return;
    }
    fail('Az editor nem jutott el a kész állapotig 15 másodpercen belül.');
  }, 15000);
})();
