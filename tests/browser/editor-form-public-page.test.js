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
    { id: 'updates', type: 'checkbox', label: 'Kérek híreket', required: false },
    { id: 'contact', type: 'radio', label: 'Kapcsolat módja', required: true, options: ['E-mail', 'Telefon'] },
    { id: 'event-date', type: 'date', label: 'Időpont', required: true },
    { id: 'phone', type: 'tel', label: 'Telefonszám', required: false, maxLength: 40 },
    { id: 'viewers', type: 'number', label: 'Nézőszám', required: false },
    { id: 'website', type: 'url', label: 'Weboldal', required: false, maxLength: 2048 }
  ],
  consent: { text: 'Elfogadom az adatkezelési <szabályokat>.', version: 'privacy-v1', privacyUrl: 'https://creator.test/privacy' },
  successMessage: 'Köszönöm a megkeresést.', retentionDays: 30
};

async function fixture(t, { withSubmitInteraction = false } = {}) {
  const document = createDocument();
  const generatedPageId = document.activePageId;
  const pageId = crypto.randomUUID();
  document.pages[pageId] = { ...document.pages[generatedPageId], id: pageId };
  delete document.pages[generatedPageId];
  document.activePageId = pageId;
  const model = createEditorState(document);
  const rootId = activePage(model).rootId;
  execute(model, { type: 'element.add', payload: { type: 'form', parentId: rootId, name: 'Kapcsolatfelvétel', authored: true, props: { formId, formBindingVersion: 1, ariaLabel: 'Írj a Sanci9517-nek' } } });
  const formNodeId = model.selection.primaryId;
  let tabsId = null;
  if (withSubmitInteraction) {
    execute(model, { type: 'element.add', payload: { type: 'tabs', parentId: rootId, name: 'Következő lépés' } });
    tabsId = model.selection.primaryId;
    execute(model, { type: 'content.properties.set', payload: { nodeId: tabsId, patch: { ariaLabel: 'Következő lépés', items: [{ title: 'Első', text: 'Első lépés' }, { title: 'Második', text: 'Második lépés' }] } } });
    activePage(model).nodes[formNodeId].interactions = [{ schemaVersion: 1, event: 'submit', action: 'select-tab', targetId: tabsId, itemIndex: 1 }];
  }
  const publishedPage = structuredClone(activePage(model));
  const draftPage = structuredClone(publishedPage);
  let formGetCount = 0;
  const submissions = [];
  let submissionOutcome = 'success';
  const publicRoot = resolve(import.meta.dirname, '../../public');
  const server = createServer(async (request, response) => {
    const url = new URL(request.url, 'http://localhost');
    const json = (data, status = 200) => { response.statusCode = status; response.setHeader('content-type', 'application/json; charset=utf-8'); response.end(JSON.stringify(data)); };
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
        if (submissionOutcome !== 'success') return json({ ok: false, error: { message: 'A beküldés most nem sikerült.' } }, 503);
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
  return { page, base: `http://127.0.0.1:${server.address().port}`, submissions, getFormReads: () => formGetCount, tabsId, setSubmissionOutcome: outcome => { submissionOutcome = outcome; } };
}

test('public form renders only data, enforces browser consent and submits first-party values', async t => {
  const f = await fixture(t);
  await f.page.goto(f.base + '/p/forms-test');
  const region = f.page.getByRole('region', { name: 'Írj a Sanci9517-nek' });
  await region.waitFor();
  await region.getByRole('textbox', { name: 'E-mail', exact: true }).fill('creator@example.test');
  await f.page.getByLabel('Üzenet', { exact: true }).fill('Szia, együttműködnék.');
  await f.page.getByLabel('Téma', { exact: true }).selectOption('Együttműködés');
  await f.page.getByLabel('Kérek híreket', { exact: true }).check();
  assert.equal(await region.getByRole('group', { name: 'Kapcsolat módja' }).count(), 1, 'radio choices expose an accessible group name');
  await region.getByLabel('Telefon', { exact: true }).check();
  const eventDate = region.getByLabel('Időpont', { exact: true });
  assert.equal(await eventDate.getAttribute('type'), 'date', 'date fields use the native date input');
  await eventDate.fill('2024-02-29');
  const phone = region.getByLabel('Telefonszám', { exact: true });
  assert.equal(await phone.getAttribute('type'), 'tel', 'phone fields use the native telephone input');
  assert.equal(await phone.getAttribute('autocomplete'), 'tel', 'phone fields opt into the browser telephone autofill');
  assert.equal(await phone.getAttribute('maxlength'), '40', 'phone fields preserve the server-side bounded length');
  await phone.fill('+36 (30) 123-4567');
  const viewers = region.getByLabel('Nézőszám', { exact: true });
  assert.equal(await viewers.getAttribute('type'), 'number', 'number fields use the native numeric input');
  assert.equal(await viewers.getAttribute('step'), 'any', 'number fields accept decimal values without an implicit integer-only constraint');
  await viewers.fill('125.5');
  const website = region.getByLabel('Weboldal', { exact: true });
  assert.equal(await website.getAttribute('type'), 'url', 'URL fields use native browser URL validation');
  assert.equal(await website.getAttribute('maxlength'), '2048');
  await website.fill('https://creator.test/portfolio');
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
    values: { email: 'creator@example.test', message: 'Szia, együttműködnék.', topic: 'Együttműködés', updates: true, contact: 'Telefon', 'event-date': '2024-02-29', phone: '+36 (30) 123-4567', viewers: '125.5', website: 'https://creator.test/portfolio' },
    consentAccepted: true,
    website: ''
  });
  assert.equal(f.getFormReads(), 1);
});

test('invalid public form exposes a focused accessible error summary and field associations without submitting', async t => {
  const f = await fixture(t);
  await f.page.goto(f.base + '/p/forms-test');
  const region = f.page.getByRole('region', { name: 'Írj a Sanci9517-nek' });
  await region.waitFor();
  await region.getByRole('button', { name: 'Küldés' }).click();

  const summary = region.getByRole('alert');
  await summary.waitFor();
  assert.match(await summary.innerText(), /E-mail:.*kitöltése kötelező/);
  assert.match(await summary.innerText(), /Üzenet:.*kitöltése kötelező/);
  assert.match(await summary.innerText(), /Adatkezelési hozzájárulás:.*el kell fogadnod/);
  assert.equal(f.submissions.length, 0, 'client validation prevents a request');

  const email = region.getByRole('textbox', { name: 'E-mail', exact: true });
  assert.equal(await email.getAttribute('aria-invalid'), 'true');
  const describedBy = (await email.getAttribute('aria-describedby')).split(/\s+/);
  const errorId = describedBy.find(id => id.endsWith('-error'));
  assert.ok(errorId, 'the inline error is referenced by the invalid field');
  assert.equal(await region.locator(`#${errorId}`).innerText(), 'A(z) „E-mail” mező kitöltése kötelező.');

  await summary.getByRole('link', { name: /^E-mail:/ }).click();
  assert.equal(await email.evaluate(element => document.activeElement === element), true, 'summary navigation focuses the corresponding field');

  await email.fill('not-an-email');
  await summary.getByRole('link', { name: /adj meg érvényes e-mail címet/ }).waitFor();
  assert.equal(await email.getAttribute('aria-invalid'), 'true');
  await email.fill('creator@example.test');
  await summary.getByRole('link', { name: /^E-mail:/ }).waitFor({ state: 'detached' });
  assert.equal(await email.getAttribute('aria-invalid'), null, 'corrected fields clear their inline and ARIA error state');
  assert.equal(f.submissions.length, 0, 'validation announcements do not submit the form');
});

test('EDT-039 Form actions run only after an accepted public submission', async t => {
  const f = await fixture(t, { withSubmitInteraction: true });
  await f.page.goto(f.base + '/p/forms-test');
  const region = f.page.getByRole('region', { name: 'Írj a Sanci9517-nek' });
  const tabs = f.page.locator(`[data-page-node-id="${f.tabsId}"]`);
  const tab = index => tabs.getByRole('tab').nth(index);
  await region.waitFor();
  assert.equal(await tab(0).getAttribute('aria-selected'), 'true');
  await region.getByRole('button', { name: 'Küldés' }).click();
  assert.equal(f.submissions.length, 0, 'invalid native values never reach the service or action runner');
  assert.equal(await tab(0).getAttribute('aria-selected'), 'true');

  await region.getByRole('textbox', { name: 'E-mail', exact: true }).fill('creator@example.test');
  await region.getByLabel('Üzenet', { exact: true }).fill('Szia');
  await region.getByLabel('Téma', { exact: true }).selectOption('Együttműködés');
  await region.getByLabel('Telefon', { exact: true }).check();
  await region.getByLabel('Időpont', { exact: true }).fill('2024-02-29');
  await region.getByLabel('Elfogadom az adatkezelési <szabályokat>.').check();

  f.setSubmissionOutcome('failure');
  await region.getByRole('button', { name: 'Küldés' }).click();
  await region.getByRole('status').filter({ hasText: 'nem tudtuk fogadni' }).waitFor();
  assert.equal(f.submissions.length, 1);
  assert.equal(await tab(0).getAttribute('aria-selected'), 'true', 'a rejected service response does not run the configured action');

  f.setSubmissionOutcome('success');
  await region.getByRole('button', { name: 'Küldés' }).click();
  await region.getByRole('status').filter({ hasText: 'Köszönöm a megkeresést.' }).waitFor();
  await tab(1).waitFor({ state: 'visible' });
  assert.equal(await tab(1).getAttribute('aria-selected'), 'true', 'the existing safe same-page action runs after the accepted response');
  assert.equal(f.submissions.length, 2);
});

test('draft preview displays an inert form notice and never reads or submits the public form API', async t => {
  const f = await fixture(t);
  await f.page.goto(f.base + '/p/forms-test?preview=1&embed=1');
  await f.page.getByRole('note').filter({ hasText: 'beküldése előnézetben ki van kapcsolva' }).waitFor();
  assert.equal(f.getFormReads(), 0);
  assert.equal(await f.page.locator('.creator-public-form form').count(), 0);
  assert.equal(await f.submissions.length, 0);
});
