import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { chromium } from 'playwright';
import { createDocument } from '../../public/editor-v2/core/schema.js';
import { createEditorState, activePage } from '../../public/editor-v2/core/state.js';
import { execute } from '../../public/editor-v2/core/commands.js';

test('EDT-040 motion controls are visible, typed, allowlisted and reduced-motion safe', async t => {
  const state = createEditorState(createDocument());
  const pageId = state.document.activePageId;
  execute(state, { type: 'element.add', payload: { type: 'heading', parentId: activePage(state).rootId, name: 'Motion heading' } });
  const headingId = state.selection.primaryId;
  execute(state, { type: 'content.properties.set', payload: { nodeId: headingId, patch: { text: 'Readable motion content', level: '2' } } });
  const draft = structuredClone(state.document);
  let revision = 1;
  const root = resolve(import.meta.dirname, '../../public');
  const server = createServer(async (req, res) => {
    const url = new URL(req.url, 'http://localhost');
    const json = data => { res.setHeader('content-type', 'application/json'); res.end(JSON.stringify(data)); };
    if (url.pathname === '/api/admin/editor') {
      if (req.method === 'GET') return json({ ok: true, data: { page: { id: pageId, document: draft, publishedRevisionId: 'published' }, revisions: [{ id: `revision-${revision}`, version: revision }] } });
      let body = '';
      for await (const chunk of req) body += chunk;
      const payload = JSON.parse(body);
      Object.assign(draft, payload.document);
      revision += 1;
      return json({ ok: true, data: { pageId, version: revision, revisionId: `revision-${revision}` } });
    }
    if (url.pathname === '/api/admin/pages') return json({ ok: true, data: [{ id: pageId, slug: 'motion', title: 'Motion', revision, isPublished: true }] });
    if (url.pathname.startsWith('/api/')) return json({ ok: true, data: {} });
    const path = url.pathname.startsWith('/p/') ? '/visual-page.html' : url.pathname;
    const file = resolve(root, `.${path}`);
    if (!file.startsWith(root + '/')) return res.writeHead(403).end();
    try {
      res.setHeader('content-type', { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' }[extname(file)] || 'application/octet-stream');
      res.end(await readFile(file));
    } catch { res.writeHead(404).end(); }
  });
  await new Promise(done => server.listen(0, '127.0.0.1', done));
  const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_PATH || (process.env.CI ? undefined : '/usr/bin/chromium'), args: ['--no-sandbox'] });
  t.after(async () => { await browser.close(); await new Promise(done => server.close(done)); });

  const page = await browser.newPage();
  page.setDefaultTimeout(10000);
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(`http://127.0.0.1:${server.address().port}/editor-v2/index.html`);
  const heading = page.locator(`.node[data-node-id="${headingId}"]`);
  await heading.waitFor({ state: 'attached' });
  await heading.evaluate(el => el.click());
  if (await page.locator('#rightDock').evaluate(el => el.classList.contains('closed'))) await page.locator('#openInspector').click();
  await page.locator('.inspector-tabs button').first().click();
  const group = page.locator('.inspector-group-title').filter({ has: page.getByText('Animáció', { exact: true }) });
  await page.waitForFunction(() => [...document.querySelectorAll('#inspectorBody .inspector-group-title')].some(el => el.querySelector('strong')?.textContent === 'Animáció'));
  if (await group.getAttribute('aria-expanded') === 'false') await group.click();

  const entry = page.locator('[data-property-id="motion.entry"] select');
  const duration = page.locator('[data-property-id="motion.duration"] select');
  const easing = page.locator('[data-property-id="motion.easing"] select');
  assert.equal(await entry.inputValue(), 'none', 'motion defaults to disabled');
  assert.equal(await duration.inputValue(), '280ms', 'duration is bounded to the safe default');
  assert.equal(await easing.inputValue(), 'ease-out', 'easing defaults to a supported timing function');
  assert.equal(await entry.isVisible(), true, 'the control remains reachable in the Inspector');

  await entry.selectOption('sanci-entry-rise');
  await duration.selectOption('420ms');
  await easing.selectOption('cubic-bezier(0.22,1,0.36,1)');
  assert.deepEqual(await heading.evaluate(el => ({
    name: getComputedStyle(el).animationName,
    duration: getComputedStyle(el).animationDuration,
    easing: getComputedStyle(el).animationTimingFunction,
  })), { name: 'sanci-entry-rise', duration: '0.42s', easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });

  await page.emulateMedia({ reducedMotion: 'reduce' });
  assert.deepEqual(await heading.evaluate(el => ({
    name: getComputedStyle(el).animationName,
    opacity: getComputedStyle(el).opacity,
    transform: getComputedStyle(el).transform,
    active: el.getAnimations().filter(animation => animation.animationName.startsWith('sanci-entry-')).length,
  })), { name: 'none', opacity: '1', transform: 'none', active: 0 }, 'reduced-motion never hides or displaces the authored content');

  await page.locator('#save').click();
  await page.waitForFunction(() => document.querySelector('#saveStatus')?.textContent.startsWith('Mentve'));
  await page.reload();
  const reloadedHeading = page.locator(`.node[data-node-id="${headingId}"]`);
  await reloadedHeading.waitFor({ state: 'attached' });
  await reloadedHeading.evaluate(el => el.click());
  await page.waitForFunction(() => document.querySelector('[data-property-id="motion.entry"] select'));
  assert.deepEqual(await page.evaluate(() => Object.fromEntries(['motion.entry', 'motion.duration', 'motion.easing'].map(id => [id, document.querySelector(`[data-property-id="${id}"] select`)?.value]))), {
    'motion.entry': 'sanci-entry-rise',
    'motion.duration': '420ms',
    'motion.easing': 'cubic-bezier(0.22,1,0.36,1)',
  }, 'Save/reload preserves the authored motion choices in the Inspector');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  assert.deepEqual(await reloadedHeading.evaluate(el => ({
    name: getComputedStyle(el).animationName,
    opacity: getComputedStyle(el).opacity,
    transform: getComputedStyle(el).transform,
    active: el.getAnimations().filter(animation => animation.animationName.startsWith('sanci-entry-')).length,
  })), { name: 'none', opacity: '1', transform: 'none', active: 0 }, 'saved motion remains disabled when the visitor requests reduced motion');
  assert.deepEqual(errors, [], 'motion Inspector interaction emits no runtime errors');
});

test('EDT-040 public renderer ignores malformed persisted motion without hiding content', async t => {
  const state = createEditorState(createDocument());
  const pageId = state.document.activePageId;
  const page = activePage(state);
  execute(state, { type: 'element.add', payload: { type: 'heading', parentId: page.rootId, name: 'Legacy motion' } });
  const headingId = state.selection.primaryId;
  execute(state, { type: 'content.properties.set', payload: { nodeId: headingId, patch: { text: 'Readable legacy heading', level: '2' } } });
  const published = structuredClone(activePage(state));
  Object.assign(published.nodes[headingId].responsive.desktop, {
    animationName: 'sanci-entry-rise;display:none',
    animationDuration: '12s !important',
    animationTimingFunction: 'steps(9,end)',
  });

  const root = resolve(import.meta.dirname, '../../public');
  const server = createServer(async (req, res) => {
    const url = new URL(req.url, 'http://localhost');
    const json = data => { res.setHeader('content-type', 'application/json'); res.end(JSON.stringify(data)); };
    if (url.pathname === '/api/public/pages') return json({ ok: true, data: { id: pageId, slug: 'legacy-motion', title: 'Legacy motion', content: published } });
    if (url.pathname === '/api/public/presentation') return json({ ok: true, data: { tokens: {} } });
    if (url.pathname.startsWith('/api/')) return json({ ok: true, data: {} });
    const path = url.pathname.startsWith('/p/') ? '/visual-page.html' : url.pathname;
    const file = resolve(root, `.${path}`);
    if (!file.startsWith(root + '/')) return res.writeHead(403).end();
    try {
      res.setHeader('content-type', { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' }[extname(file)] || 'application/octet-stream');
      res.end(await readFile(file));
    } catch { res.writeHead(404).end(); }
  });
  await new Promise(done => server.listen(0, '127.0.0.1', done));
  const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_PATH || (process.env.CI ? undefined : '/usr/bin/chromium'), args: ['--no-sandbox'] });
  t.after(async () => { await browser.close(); await new Promise(done => server.close(done)); });

  const pageView = await browser.newPage();
  const errors = [];
  pageView.setDefaultTimeout(10000);
  pageView.on('pageerror', error => errors.push(error.message));
  await pageView.goto(`http://127.0.0.1:${server.address().port}/p/legacy-motion`);
  const heading = pageView.locator(`.creator-node[data-node-id="${headingId}"]`);
  await heading.waitFor({ state: 'attached' });
  const output = await heading.evaluate(el => ({
    text: el.textContent,
    inlineStyle: el.getAttribute('style') || '',
    animationName: getComputedStyle(el).animationName,
    display: getComputedStyle(el).display,
  }));
  assert.match(output.text, /Readable legacy heading/, 'malformed motion never removes the authored content');
  assert.doesNotMatch(output.inlineStyle, /animation-name|animation-duration|animation-timing-function|display\s*:\s*none/i, 'untrusted motion values and injected declarations are omitted');
  assert.equal(output.animationName, 'none', 'an unsupported saved animation does not execute');
  assert.notEqual(output.display, 'none', 'an unsupported saved animation cannot hide the element');
  assert.deepEqual(errors, [], 'malformed persisted motion does not throw during public rendering');
});
