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

  function safeReason(reason) {
    let text = 'A hibaüzenet nem olvasható.';
    try {
      if (reason instanceof Error && typeof reason.message === 'string') text = reason.message;
      else if (reason && typeof reason === 'object') {
        const message = reason.message;
        if (typeof message === 'string') text = message;
      } else if (reason != null) text = String(reason);
      else text = 'Ismeretlen hiba';
    } catch {}
    return text
      .replace(/[\u0000-\u001f\u007f-\u009f]+/g, ' ')
      .replace(/\bBearer\s+[A-Za-z0-9._~+/-]+=*/gi, 'Bearer [redacted]')
      .replace(/\b((?:access|refresh|id)?[_-]?(?:token|secret|password|authorization|cookie|csrf|api[_-]?key|client[_-]?secret))\b\s*[:=]\s*["']?[^&\s"'<>]+/gi, '$1=[redacted]')
      .replace(/([?&](?:code|state|token|secret|key|email|password|signature|sig)=)[^&#\s]+/gi, '$1[redacted]')
      .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, '[redacted-email]')
      .replace(/\b(?:\+?\d[\d .()/-]{7,}\d)\b/g, '[redacted-phone]');
  }

  function fail(message, detail = null) {
    const record = { source: 'boot', code: 'SANCI-BOOT-E001', message, file: detail?.filename || '', line: detail?.lineno || 0, column: detail?.colno || 0, error: detail };
    window.__sanciEditorEarlyErrors = window.__sanciEditorEarlyErrors || [];
    window.__sanciEditorEarlyErrors.push(record);
    window.__sanciEditorDiagnostics?.add(record);
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
    if (window.__sanciEditorDiagnostics) return;
    if (event.target instanceof HTMLScriptElement || event instanceof ErrorEvent) {
      fail(describeError(event), event.error || event.target);
    }
  }, true);

  window.addEventListener('unhandledrejection', (event) => {
    if (window.__sanciEditorDiagnostics) return;
    fail(`Nem kezelt Promise hiba: ${safeReason(event.reason)}`);
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
