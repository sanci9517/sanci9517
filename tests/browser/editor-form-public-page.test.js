import assert from 'node:assert/strict';
import test from 'node:test';
import { createServer } from 'node:http';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { extname, resolve } from 'node:path';
import { chromium } from 'playwright';
import { createDocument } from '../../public/editor-v2/core/schema.js';
import { createEditorState, activePage } from '../../public/editor-v2/core/state.js';
import { execute } from '../../public/editor-v2/core/commands.js';

const formId = '11111111-1111-4111-8111-111111111111';
const formDefinition = {
  schemaVersion: 1, name: 'Kapcsolat',
  fields: [
    { id: 'email', type: 'email', label: 'E-mail', required: true, maxLength: 254 },
    { id: 'message', type: 'textarea', label: 'Üzenet', required: true, maxLength: 2000 },
    { id: 'topic', type: 'select', label: 'Téma', required: true, options: ['Együttműködés', 'Egyéb'] },
    { id: 'updates', type: 'checkbox', label: 'Kérek híreket', required: false }
  ],
  consent: { text: 'Elfogadom az adatkezelési <szabályokat>.', version: 'privacy-v1', privacyUrl: 'https://creator.test/privacy' },
  successMessage: 'Köszönöm a megkeresést.', retentionDays: 30
};

async function fixture(t) {
  const document = createDocument();
  const generatedPageId = document.activePageId;
  const pageId = crypto.randomUUID();
  document.pages[pageId] = { ...document.pages[generatedPageId], id: pageId };
  delete document.pages[generatedPageId];
  document.activePageId = pageId;
  const model = createEditorState(document);
  const rootId = activePage(model).rootId;
  execute(model, { type: 'element.add', payload: { type: 'form', parentId: rootId, name: 'Kapcsolatfelvétel', authored: true, props: { formId, formBindingVersion: 1, ariaLabel: 'Írj a Sanci9517-nek' } } });
  const publishedPage = structuredClone(activePage(model));
  const draftPage = structuredClone(publishedPage);
  let formGetCount = 0;
  const submissions = [];
  const publicRoot = resolve(import.meta.dirname, '../../public');
  const server = createServer(async (request, response) => {
    const url = new URL(request.url, 'http://localhost');
    const json = data => { response.setHeader('content-type', 'application/json; charset=utf-8'); response.end(JSON.stringify(data)); };
    if (url.pathname === '/api/public/pages') {
      const content = url.searchParams.get('preview') === '1' ? draftPage : publishedPage;
      return json({ ok: true, data: { id: pageId, slug: 'forms-test', title: 'Tesztoldal', description: '', content } });
    }
    if (url.pathname === '/api/public/navigation') return json({ ok: true, data: { items: [] } });
    if (url.pathname === '/api/public/presentation') return json({ ok: true, data: { tokens: {} } });
    if (url.pathname === '/api/public/forms') {
      if (request.method === 'GET') { formGetCount++; return json({ ok: true, data: { id: formId, name: formDefinition.name, version: 1, definition: formDefinition } }); }
      if (request.method === 'POST') {
        let body = ''; for await (const chunk of request) body += chunk;
        submissions.push(JSON.parse(body));
        return json({ ok: true, data: { submitted: true, message: formDefinition.successMessage } });
      }
    }
    if (url.pathname.startsWith('/api/')) return json({ ok: true, data: {} });
    const assetPath = url.pathname === '/p/forms-test' ? '/visual-page.html' : url.pathname;
    const file = resolve(publicRoot, '.' + assetPath);
    if (!file.startsWith(publicRoot + '/')) return response.writeHead(403).end();
    try {
      response.setHeader('content-type', ({ '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8' })[extname(file)] || 'application/octet-stream');
      response.end(await readFile(file));
    } catch { response.writeHead(404).end(); }
  });
  await new Promise(done => server.listen(0, '127.0.0.1', done));
  const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_PATH || (existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined), args: ['--no-sandbox'] });
  t.after(async () => { await browser.close(); await new Promise(done => server.close(done)); });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  page.setDefaultTimeout(8000);
  page.on('pageerror', error => { throw error; });
  return { page, base: `http://127.0.0.1:${server.address().port}`, submissions, getFormReads: () => formGetCount };
}

test('public form renders only data, enforces browser consent and submits first-party values', async t => {
  const f = await fixture(t);
  await f.page.goto(f.base + '/p/forms-test');
  const region = f.page.getByRole('region', { name: 'Írj a Sanci9517-nek' });
  await region.waitFor();
  await f.page.getByLabel('E-mail', { exact: true }).fill('creator@example.test');
  await f.page.getByLabel('Üzenet', { exact: true }).fill('Szia, együttműködnék.');
  await f.page.getByLabel('Téma', { exact: true }).selectOption('Együttműködés');
  await f.page.getByLabel('Kérek híreket', { exact: true }).check();
  assert.equal(await region.locator('img,script,b').count(), 0, 'form copy is rendered as text, not interpreted markup');
  assert.equal(await region.locator('.creator-form-consent a').count(), 0, 'privacy link is not nested in the checkbox label');
  assert.equal(await region.getByRole('link', { name: 'Adatkezelési tájékoztató' }).getAttribute('href'), 'https://creator.test/privacy');
  await region.getByRole('button', { name: 'Küldés' }).click();
  assert.equal(f.submissions.length, 0, 'required consent blocks a public submit');
  await region.getByLabel('Elfogadom az adatkezelési <szabályokat>.').check();
  await region.getByRole('button', { name: 'Küldés' }).click();
  await region.getByRole('status').filter({ hasText: 'Köszönöm a megkeresést.' }).waitFor();
  assert.equal(f.submissions.length, 1);
  assert.deepEqual(f.submissions[0], {
    values: { email: 'creator@example.test', message: 'Szia, együttműködnék.', topic: 'Együttműködés', updates: true },
    consentAccepted: true,
    website: ''
  });
  assert.equal(f.getFormReads(), 1);
});

test('draft preview displays an inert form notice and never reads or submits the public form API', async t => {
  const f = await fixture(t);
  await f.page.goto(f.base + '/p/forms-test?preview=1&embed=1');
  await f.page.getByRole('note').filter({ hasText: 'beküldése előnézetben ki van kapcsolva' }).waitFor();
  assert.equal(f.getFormReads(), 0);
  assert.equal(await f.page.locator('.creator-public-form form').count(), 0);
  assert.equal(await f.submissions.length, 0);
});
