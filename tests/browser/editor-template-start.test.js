import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { chromium } from 'playwright';
import { createDocument } from '../../public/editor-v2/core/schema.js';
import { assertValidEditorDocument } from '../../public/editor-v2/core/validation.js';

test('EDT-041 previews and cancels safely, then creates a remapped draft without publishing', async t => {
  const original = createDocument();
  const originalId = original.activePageId;
  const originalPage = original.pages[originalId];
  originalPage.slug = 'existing-home'; originalPage.name = 'Meglévő oldal'; originalPage.status = 'published';
  const originalPublishedBytes = JSON.stringify(original);
  const documents = new Map([[originalId, original]]);
  const pages = new Map([[originalId, { id: originalId, slug: 'existing-home', title: 'Meglévő oldal', revision: 1, isPublished: true, publishedRevisionVersion: 1 }]]);
  const pageCreates = [], pageDeletes = [], editorWrites = [];
  const root = resolve(import.meta.dirname, '../../public');
  const server = createServer(async (req, res) => {
    const url = new URL(req.url, 'http://localhost');
    const json = (data, status = 200) => { res.writeHead(status, { 'content-type': 'application/json' }); res.end(JSON.stringify(data)); };
    if (url.pathname === '/api/admin/pages' && req.method === 'GET') {
      return json({ ok: true, data: url.searchParams.get('archived') === '1' ? [] : [...pages.values()] });
    }
    if (url.pathname === '/api/admin/pages' && req.method === 'POST') {
      let raw = ''; for await (const chunk of req) raw += chunk;
      const body = JSON.parse(raw); pageCreates.push(body);
      if ([...pages.values()].some(page => page.slug === body.slug)) return json({ ok: false, error: { code: 'SLUG_EXISTS', message: 'Slug already exists' } }, 409);
      assert.doesNotThrow(() => assertValidEditorDocument(body.document));
      const page = body.document.pages[body.id];
      documents.set(body.id, structuredClone(body.document));
      pages.set(body.id, { id: body.id, slug: body.slug, title: body.title, revision: 1, isPublished: false, publishedRevisionVersion: 0 });
      return json({ ok: true, data: { id: body.id, slug: body.slug, title: body.title, content: body.document, isPublished: false, version: 1 } });
    }
    if (url.pathname === '/api/admin/pages' && req.method === 'DELETE') {
      let raw = ''; for await (const chunk of req) raw += chunk;
      const body = JSON.parse(raw); pageDeletes.push(body.id); pages.delete(body.id); documents.delete(body.id);
      return json({ ok: true, data: { id: body.id, deleted: true } });
    }
    if (url.pathname === '/api/admin/editor' && req.method === 'GET') {
      const id = url.searchParams.get('pageId'), document = documents.get(id);
      return document ? json({ ok: true, data: { page: { id, document, publishedRevisionId: id === originalId ? 'published-1' : null }, revisions: [{ id: 'revision-1', version: 1 }] } }) : json({ ok: false, error: { message: 'Page not found' } }, 404);
    }
    if (url.pathname === '/api/admin/editor' && req.method === 'POST') {
      let raw = ''; for await (const chunk of req) raw += chunk;
      editorWrites.push(JSON.parse(raw));
      return json({ ok: true, data: { pageId: originalId, version: 2, revisionId: 'revision-2' } });
    }
    if (url.pathname.startsWith('/api/')) return json({ ok: true, data: { items: [], tokens: {}, siteName: 'Test' } });
    const path = url.pathname.startsWith('/p/') ? '/visual-page.html' : url.pathname;
    const file = resolve(root, `.${path}`);
    if (!file.startsWith(`${root}/`)) return res.writeHead(403).end();
    try { res.setHeader('content-type', { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' }[extname(file)] || 'application/octet-stream'); res.end(await readFile(file)); }
    catch { res.writeHead(404).end(); }
  });
  await new Promise(done => server.listen(0, '127.0.0.1', done));
  const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_PATH || (process.env.CI ? undefined : '/usr/bin/chromium'), args: ['--no-sandbox'] });
  t.after(async () => { await browser.close(); await new Promise(done => server.close(done)); });
  const base = `http://127.0.0.1:${server.address().port}`;
  const editor = await browser.newPage(), errors = [];
  editor.on('pageerror', error => errors.push(error.message));
  editor.setDefaultTimeout(10000);
  await editor.goto(`${base}/editor-v2/index.html`);
  await editor.waitForFunction(() => document.querySelector('#saveStatus')?.textContent === 'Mentve');
  const dialog = editor.locator('#newPageDialog');
  await editor.locator('#newPage').click();
  assert.equal(await dialog.evaluate(element => element.open), true);
  assert.equal(await editor.locator('#newPageTemplates [role="radio"][aria-checked="true"]').getAttribute('data-template-id'), 'blank-page');
  await editor.locator('#cancelNewPage').click();
  assert.equal(pageCreates.length, 0, 'cancel performs no write');
  assert.equal(JSON.stringify(documents.get(originalId)), originalPublishedBytes, 'cancel leaves the current page and published bytes untouched');

  await editor.locator('#newPage').click();
  await editor.locator('[data-template-id="creator-home"]').click();
  assert.equal(await editor.locator('#newPagePreviewTitle').textContent(), 'Creator bemutatkozás');
  assert.match(await editor.locator('#newPagePreviewContent').innerText(), /Játék\. Kikapcsolódás\. Közösség\./);
  await editor.locator('#newPageName').fill('SANCI9517 bemutatkozás');
  assert.equal(await editor.locator('#newPageSlug').inputValue(), 'sanci9517-bemutatkozas', 'the suggested slug follows the edited title');
  await editor.locator('#newPageSlug').fill('existing-home');
  await editor.locator('#createNewPage').click();
  await editor.locator('#newPageError').waitFor({ state: 'visible' });
  assert.equal(await dialog.evaluate(element => element.open), true, 'slug conflict does not close the flow or discard the preview');
  assert.match(await editor.locator('#newPageError').textContent(), /Slug already exists/);
  assert.equal(await editor.locator('#newPageTemplates [aria-checked="true"]').getAttribute('data-template-id'), 'creator-home');
  assert.equal(JSON.stringify(documents.get(originalId)), originalPublishedBytes, 'a rejected slug does not touch existing live content');
  await editor.locator('#newPageSlug').fill('creator-kezdolap');
  await editor.locator('#createNewPage').click();
  await editor.waitForFunction(() => document.querySelector('#saveStatus')?.textContent.includes('Új piszkozat megnyitva'));
  assert.equal(pageCreates.length, 2, 'one rejected attempt and one explicit retry are issued');
  const body = pageCreates[1], page = body.document.pages[body.id], nodes = Object.values(page.nodes), nodeIds = nodes.map(node => node.id);
  assert.equal(body.slug, 'creator-kezdolap');
  assert.equal(body.document.activePageId, body.id);
  assert.equal(new Set(nodeIds).size, nodeIds.length);
  assert.equal(page.status, 'draft');
  assert.equal(body.isPublished, undefined, 'create API defaults new pages to draft; UI does not request publication');
  assert.equal(pages.get(body.id).isPublished, false);
  assert.equal(editorWrites.length, 0, 'creating a template draft does not call Save or Publish');
  assert.equal(JSON.stringify(documents.get(originalId)), originalPublishedBytes, 'the existing live page was not changed');
  assert.ok(nodes.some(node => node.props?.text === 'Játék. Kikapcsolódás. Közösség.'), 'the selected template is in the active canvas document');
  await editor.locator('#editorMenu').click();
  await editor.locator('#leftPanelPages').waitFor({ state: 'visible' });
  editor.once('dialog', prompt => prompt.accept());
  await editor.locator('.page-row').filter({ hasText: 'SANCI9517 bemutatkozás' }).locator('.page-delete').click();
  await editor.waitForFunction(() => document.querySelectorAll('#pageSelect option').length === 1);
  assert.deepEqual(pageDeletes, [body.id], 'the created draft can be rolled back through the existing explicit delete confirmation');
  assert.equal(pages.has(body.id), false);
  assert.equal(JSON.stringify(documents.get(originalId)), originalPublishedBytes, 'rollback preserves the pre-existing published page byte-for-byte');
  assert.equal(editorWrites.length, 0, 'rollback and new-page creation do not merge Save or Publish');
  assert.deepEqual(errors, [], `no browser errors: ${errors.join('; ')}`);
});
