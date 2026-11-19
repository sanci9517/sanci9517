/*
 * Sanci9517 Visual Editor v2 — canonical boot diagnostics.
 * This file intentionally has no imports so it can report failures in the module graph.
 */
(function () {
  const startedAt = Date.now();
  let appStarted = false;
  let appReady = false;
  let timeoutId = null;
  const MAX_EARLY_ERRORS = 100;
  const MAX_ERROR_TEXT = 320;

  function status(text) {
    const el = document.querySelector('#saveStatus');
    if (el) el.textContent = text;
  }

  function describeError(event) {
    if (event instanceof ErrorEvent) {
      const filename = safeLocation(readField(event, 'filename'));
      const source = filename ? ` — ${filename}:${safeCoordinate(readField(event, 'lineno'))}:${safeCoordinate(readField(event, 'colno'))}` : '';
      return safeText(`${readField(event, 'message') || 'Ismeretlen JavaScript hiba'}${source}`);
    }
    const target = event?.target;
    const source = safeLocation(readField(target, 'src'));
    if (source) return safeText(`Erőforrás betöltési hiba — ${source}`);
    return 'Ismeretlen erőforrás-betöltési hiba';
  }

  function readField(value, key) {
    try { return value?.[key]; } catch { return undefined; }
  }

  function safeCoordinate(value) {
    return Number.isInteger(value) && value > 0 ? Math.min(value, 10000000) : 0;
  }

  function safeLocation(value) {
    const text = safeText(value, 512);
    if (!text) return '';
    const absoluteUrl = /^[a-z][a-z\d+.-]*:\/\//i.test(text);
    try {
      const url = new URL(text, globalThis.location?.origin || 'https://editor.invalid');
      const parts = url.pathname.split('/').filter(Boolean);
      const path = (absoluteUrl ? parts.slice(-3) : parts.slice(-2)).join('/');
      return path + (url.search ? '?[redacted]' : '');
    } catch {
      return text.split(/[?#]/, 1)[0].split(/[\\/]/).filter(Boolean).slice(-2).join('/');
    }
  }

  function safeText(value, max = MAX_ERROR_TEXT) {
    let text = 'A hibaüzenet nem olvasható.';
    try { text = String(value ?? ''); } catch {}
    return text.slice(0, 4096)
      .replace(/[\u0000-\u001f\u007f-\u009f]+/g, ' ')
      .replace(/\bBearer\s+[A-Za-z0-9._~+/-]+=*/gi, 'Bearer [redacted]')
      .replace(/\b((?:access|refresh|id)?[_-]?(?:token|secret|password|authorization|cookie|csrf|api[_-]?key|client[_-]?secret))\b\s*[:=]\s*["']?[^&\s"'<>]+/gi, '$1=[redacted]')
      .replace(/([?&](?:code|state|token|secret|key|email|password|signature|sig)=)[^&#\s]+/gi, '$1[redacted]')
      .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, '[redacted-email]')
      .replace(/\b(?:\+?\d[\d .()/-]{7,}\d)\b/g, '[redacted-phone]')
      .slice(0, max);
  }

  function safeReason(reason) {
    const message = readField(reason, 'message');
    if (typeof message === 'string' && message) return safeText(message);
    if (reason == null) return 'Ismeretlen hiba';
    if (['string', 'number', 'boolean', 'bigint', 'symbol'].includes(typeof reason)) return safeText(reason);
    return 'A hibaüzenet nem olvasható.';
  }

  function fail(message, detail = null) {
    const safeMessage = safeText(message);
    const record = {
      source: 'boot',
      code: 'SANCI-BOOT-E001',
      message: safeMessage,
      file: safeLocation(readField(detail, 'filename') || readField(detail, 'src')),
      line: safeCoordinate(readField(detail, 'lineno')),
      column: safeCoordinate(readField(detail, 'colno'))
    };
    window.__sanciEditorEarlyErrors = window.__sanciEditorEarlyErrors || [];
    window.__sanciEditorEarlyErrors.push(record);
    if (window.__sanciEditorEarlyErrors.length > MAX_EARLY_ERRORS) window.__sanciEditorEarlyErrors.splice(0, window.__sanciEditorEarlyErrors.length - MAX_EARLY_ERRORS);
    window.__sanciEditorDiagnostics?.add(record);
    const text = `Editor betöltési hiba: ${safeMessage}`;
    status(text);
    console.error('[Sanci9517 Editor Boot]', { code: record.code, message: safeMessage, file: record.file, line: record.line, column: record.column });
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
      fail(describeError(event), event instanceof ErrorEvent
        ? { filename: readField(event, 'filename'), lineno: readField(event, 'lineno'), colno: readField(event, 'colno') }
        : { src: readField(event.target, 'src') });
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
