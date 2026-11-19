import assert from 'node:assert/strict';
import test from 'node:test';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { chromium } from 'playwright';
import { createEditorState } from '../../public/editor-v2/core/state.js';
import { createDocument, NODE_TYPES } from '../../public/editor-v2/core/schema.js';
import { execute } from '../../public/editor-v2/core/commands.js';

test('preboot errors redact messages, source URLs, raw Error details and embedded source payloads', async t => {
  const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_PATH || (process.env.CI ? undefined : '/usr/bin/chromium'), args: ['--no-sandbox'] });
  t.after(() => browser.close());
  const page = await browser.newPage();
  const consoleArgs = [];
  page.on('console', async message => {
    if (message.type() !== 'error' || !message.text().includes('Sanci9517 Editor Boot')) return;
    consoleArgs.push(await Promise.all(message.args().map(argument => argument.jsonValue().catch(() => null))));
  });
  await page.setContent('<!doctype html><html><body><output id="saveStatus"></output></body></html>');
  await page.addScriptTag({ path: resolve(import.meta.dirname, '../../public/editor-v2/boot.js') });
  await page.evaluate(() => {
    const error = new Error('Bearer raw-bearer token=raw-token user@example.com');
    error.apiKey = 'raw-object-secret';
    window.dispatchEvent(new ErrorEvent('error', {
      message: 'Request failed https://api.example.invalid/load?state=raw-state&access_token=query-secret user@example.com',
      filename: 'https://cdn.example.invalid/editor/chunk.js?access_token=file-secret&siteId=private-site',
      lineno: 9,
      colno: 12,
      error
    }));
    window.dispatchEvent(new ErrorEvent('error', {
      message: 'Inline script failed',
      filename: 'data:text/javascript,raw-data-source-secret'
    }));
    window.dispatchEvent(new ErrorEvent('error', {
      message: 'Blob script failed',
      filename: 'blob:https://cdn.example.invalid/raw-blob-source-secret'
    }));
  });

  const result = await page.evaluate(() => ({
    records: window.__sanciEditorEarlyErrors,
    status: document.querySelector('#saveStatus').textContent,
    bootState: document.documentElement.dataset.editorBoot
  }));
  const serialized = JSON.stringify({ records: result.records, status: result.status, consoleArgs });
  for (const secret of ['raw-bearer', 'raw-token', 'raw-state', 'query-secret', 'file-secret', 'private-site', 'user@example.com', 'raw-object-secret', 'raw-data-source-secret', 'raw-blob-source-secret']) {
    assert.equal(serialized.includes(secret), false, `preboot diagnostics must not retain or log ${secret}`);
  }
  assert.equal(result.records.length, 3);
  assert.equal(result.records[0].code, 'SANCI-BOOT-E001');
  assert.match(result.records[0].message, /\[redacted\]/);
  assert.equal(result.records[0].file, 'editor/chunk.js');
  assert.doesNotMatch(result.records[0].file, /[?#]|https?:/i, 'source details retain only a path, never a query or origin');
  assert.equal(result.records[0].line, 9);
  assert.equal(result.records[0].column, 12);
  assert.equal(Object.hasOwn(result.records[0], 'error'), false, 'raw Error instances are never queued for later diagnostics initialization');
  assert.ok(result.records[0].message.length <= 320);
  assert.equal(result.records[1].file, 'data:[redacted]');
  assert.equal(result.records[2].file, 'blob:[redacted]');
  assert.equal(result.bootState, 'error');
  assert.match(result.status, /^Editor betöltési hiba:/);
});

test('preboot error queue is bounded and diagnostics text is capped', async t => {
  const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_PATH || (process.env.CI ? undefined : '/usr/bin/chromium'), args: ['--no-sandbox'] });
  t.after(() => browser.close());
  const page = await browser.newPage();
  await page.setContent('<!doctype html><html><body><output id="saveStatus"></output></body></html>');
  await page.addScriptTag({ path: resolve(import.meta.dirname, '../../public/editor-v2/boot.js') });
  const result = await page.evaluate(() => {
    for (let index = 0; index < 105; index += 1) {
      window.dispatchEvent(new ErrorEvent('error', { message: `hiba-${index}-` + 'x'.repeat(500) }));
    }
    return window.__sanciEditorEarlyErrors;
  });
  assert.equal(result.length, 100, 'preboot diagnostics retain only the newest bounded entries');
  assert.match(result[0].message, /^hiba-5-/);
  assert.match(result.at(-1).message, /^hiba-104-/);
  assert.ok(result.every(entry => entry.message.length <= 320));
});

test('failed Editor save redacts diagnostics and preserves the local draft for retry', async t => {
  const state = createEditorState(createDocument());
  const pageId = state.document.activePageId;
  execute(state, { type: 'element.add', payload: { type: NODE_TYPES.TEXT } });
  const nodeId = state.selection.primaryId;
  execute(state, { type: 'element.content.set', payload: { nodeId, content: 'Eredeti biztonságos szöveg' } });
  const draft = structuredClone(state.document), posts = [];
  let saveAttempts = 0;
  const root = resolve(import.meta.dirname, '../../public');
  const server = createServer(async (req, res) => {
    const url = new URL(req.url, 'http://localhost');
    const json = (data, status = 200) => { res.writeHead(status, { 'content-type': 'application/json' }); res.end(JSON.stringify(data)); };
    if (url.pathname === '/api/admin/pages' && req.method === 'GET') return json({ ok: true, data: url.searchParams.get('archived') === '1' ? [] : [{ id: pageId, slug: 'home', title: 'Főoldal', revision: 1, isPublished: true, publishedRevisionVersion: 1 }] });
    if (url.pathname === '/api/admin/editor' && req.method === 'GET') return json({ ok: true, data: { page: { id: pageId, document: draft, publishedRevisionId: 'published-1' }, revisions: [{ id: 'revision-1', version: 1 }] } });
    if (url.pathname === '/api/admin/editor' && req.method === 'POST') {
      let raw = ''; for await (const chunk of req) raw += chunk;
      const body = JSON.parse(raw); posts.push(body); saveAttempts += 1;
      if (saveAttempts === 1) return json({ ok: false, error: { code: 'UPSTREAM_FAILURE', message: 'Request failed token=private-token Bearer private-bearer user@example.com https://api.example.invalid/save?state=private-state' } }, 503);
      Object.assign(draft, structuredClone(body.document));
      return json({ ok: true, data: { pageId, version: 2, revisionId: 'revision-2' } });
    }
    if (url.pathname.startsWith('/api/')) return json({ ok: true, data: { items: [], tokens: {}, siteName: 'Teszt' } });
    const file = resolve(root, `.${url.pathname}`);
    if (!file.startsWith(`${root}/`)) return res.writeHead(403).end();
    try { res.setHeader('content-type', { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' }[extname(file)] || 'application/octet-stream'); res.end(await readFile(file)); }
    catch { res.writeHead(404).end(); }
  });
  await new Promise(done => server.listen(0, '127.0.0.1', done));
  const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_PATH || (process.env.CI ? undefined : '/usr/bin/chromium'), args: ['--no-sandbox'] });
  t.after(async () => { await browser.close(); await new Promise(done => server.close(done)); });
  const page = await browser.newPage();
  const dialogs = [];
  const pageErrors = [];
  await page.addInitScript(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: text => { window.__copiedDiagnostics = text; return Promise.reject(new DOMException('clipboard denied', 'NotAllowedError')); } } }));
  page.on('pageerror', error => pageErrors.push(error.message));
  page.on('dialog', async dialog => { dialogs.push(dialog.message()); await dialog.accept(); });
  page.setDefaultTimeout(10000);
  await page.goto(`http://127.0.0.1:${server.address().port}/editor-v2/index.html`);
  await page.waitForFunction(() => document.querySelector('#saveStatus')?.textContent === 'Mentve');
  await page.locator(`.node[data-node-id="${nodeId}"]`).click();
  if (!await page.locator('#inspectorBody').isVisible()) await page.locator('#openInspector').click();
  await page.locator('.inspector-tabs button').nth(1).click();
  const inspectorText = page.locator(`.plain-text-editor[data-text-node-id="${nodeId}"]`);
  await inspectorText.fill('Nem veszhet el ez a helyi módosítás');
  await page.locator('#save').click();
  await page.waitForFunction(() => document.querySelector('#saveStatus')?.textContent === 'Mentési hiba');
  assert.equal(posts.length, 1);
  assert.equal(posts[0].publish, false);
  assert.equal(await inspectorText.inputValue(), 'Nem veszhet el ez a helyi módosítás', 'the failed save leaves the edited field intact');
  assert.match(await page.locator(`.node[data-node-id="${nodeId}"] > .node-content`).textContent(), /Nem veszhet el ez a helyi módosítás/, 'the current canvas retains the draft');
  assert.equal(await page.locator('#diagnosticsBadge').textContent(), '🔴 1 hiba');
  await page.locator('#diagnosticsBadge').click();
  const diagnosticText = await page.locator('#diagnosticsPanel').innerText();
  for (const secret of ['private-token', 'private-bearer', 'private-state', 'user@example.com']) assert.equal(diagnosticText.includes(secret), false, `diagnostics must not show ${secret}`);
  assert.match(diagnosticText, /\[redacted\]/);
  await page.locator('#diagnosticsCopy').click();
  await page.waitForFunction(() => document.querySelector('#diagnosticsCopyStatus')?.textContent?.includes('vágólap nem érhető el'));
  const copiedDiagnostics = await page.evaluate(() => window.__copiedDiagnostics);
  for (const secret of ['private-token', 'private-bearer', 'private-state', 'user@example.com']) assert.equal(copiedDiagnostics.includes(secret), false, `copied report must not include ${secret}`);
  const [diagnosticsDownload] = await Promise.all([
    page.waitForEvent('download'),
    page.locator('#diagnosticsExport').click()
  ]);
  assert.match(diagnosticsDownload.suggestedFilename(), /^sanci9517-editor-diagnostics-.*\.json$/);
  const exportPath = await diagnosticsDownload.path();
  const exportedDiagnostics = JSON.parse(await readFile(exportPath, 'utf8'));
  assert.equal(exportedDiagnostics.format, 'sanci9517-editor-diagnostics');
  assert.equal(exportedDiagnostics.schemaVersion, 1);
  assert.equal(exportedDiagnostics.entries.length, 1);
  assert.match(exportedDiagnostics.entries[0].id, /^[0-9a-f-]{36}$/i, 'the export retains the safe correlation ID');
  assert.equal(exportedDiagnostics.entries[0].code, 'SANCI-API-E001');
  assert.equal(exportedDiagnostics.entries[0].context, '/api/admin/editor?[redacted]');
  for (const secret of ['private-token', 'private-bearer', 'private-state', 'user@example.com', 'pageId=']) assert.equal(JSON.stringify(exportedDiagnostics).includes(secret), false, `downloaded report must not include ${secret}`);
  assert.match(await page.locator('#diagnosticsCopyStatus').textContent(), /Biztonságos diagnosztikai JSON letöltése/);
  assert.deepEqual(pageErrors, [], 'clipboard denial is recovered locally and does not become an unhandled browser error');
  await page.locator('#save').click();
  await page.waitForFunction(() => document.querySelector('#saveStatus')?.textContent?.startsWith('Mentve'));
  assert.equal(posts.length, 2, 'retry submits the same local work');
  assert.equal(posts[1].publish, false, 'retry remains a Save operation, not a Publish');
  assert.equal(draft.pages[pageId].nodes[nodeId].props.text, 'Nem veszhet el ez a helyi módosítás');
  assert.equal(dialogs.length, 1, 'only the failed Save emitted one recoverable alert');
  const previousDiagnosticCount = await page.evaluate(() => window.__sanciEditorDiagnostics.entries.length);
  await page.evaluate(() => {
    const reason = { [Symbol.toPrimitive]() { throw new Error('diagnostic coercion secret'); } };
    window.dispatchEvent(new PromiseRejectionEvent('unhandledrejection', { reason, promise: Promise.resolve() }));
  });
  assert.equal(await page.evaluate(() => window.__sanciEditorDiagnostics.entries.length), previousDiagnosticCount + 1);
  assert.match(await page.locator('#diagnosticsList').innerText(), /hibaüzenet nem olvasható/i);
  assert.deepEqual(pageErrors, [], 'a malformed rejection value cannot make the diagnostics listener throw');
});
