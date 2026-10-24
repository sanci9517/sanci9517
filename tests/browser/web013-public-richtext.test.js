import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve, extname } from 'node:path';
import test from 'node:test';
import { chromium } from 'playwright';

const root = resolve(import.meta.dirname, '../..', 'public');
const richText = { schemaVersion: 1, type: 'richtext-document', blocks: [
  { type: 'heading', level: 2, children: [{ type: 'text', text: 'Published <heading>', marks: [] }] },
  { type: 'paragraph', children: [
    { type: 'text', text: 'Current page', marks: ['bold','underline'], link: { href: '/p/target' } },
    { type: 'text', text: 'Unsafe <script>window.__xss=1</script>', marks: [], link: { href: 'javascript:alert(1)' } },
    { type: 'text', text: 'External', marks: [], link: { href: 'https://example.org/', target: '_blank', title: 'External link' } }
  ] },
  { type: 'bulleted-list', items: [[
    { type: 'text', text: 'Historical URL', marks: [], link: { href: '/p/old' } }
  ]] },
  { type: 'paragraph', children: [
    { type: 'text', text: 'Emphasis', marks: ['strikethrough','superscript'], styles: { color: '#ff3366', backgroundColor: '#ffee99', fontFamily:'Georgia', fontSize:'24px' } }
  ] },
  { type: 'table', rows: [
    { cells: [{header:true,children:[{type:'text',text:'Metric',marks:[]}]},{header:true,children:[{type:'text',text:'Value',marks:[]}]}] },
    { cells: [{header:false,children:[{type:'text',text:'Revenue',marks:[]}]},{header:false,children:[{type:'text',text:'100',marks:[]}]}] }
  ] }
] };
const page = { ok: true, data: { id: 'sample', slug: 'sample', title: 'Sample', description: 'Published',
  content: { rootId: 'root', nodes: {
    root: { id: 'root', type: 'root', children: ['rich','grid'], props: {} },
    rich: { id: 'rich', type: 'richtext', children: [], props: { richText },
      responsive: { desktop: { backgroundColor: '#123456', fontSize: '22px', width: '320px' }, mobile: { backgroundColor: '#abcdef', fontSize: '18px', width: '85%' } } },
    grid: { id: 'grid', type: 'grid', name: 'Grid', children: [], props: {}, style: { display: 'grid' },
      responsive: { desktop: { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }, mobile: { gridTemplateColumns: '1fr' } } }
  } } } };

test('published structured Rich Text renders safe clickable links in the real public shell', async t => {
  const server = createServer(async (request, response) => {
    const pathname = new URL(request.url, 'http://localhost').pathname;
    if (pathname.startsWith('/api/')) {
      response.setHeader('Content-Type', 'application/json');
      response.end(JSON.stringify(pathname === '/api/public/pages' ? page :
        pathname === '/api/public/navigation' ? { ok: true, data: { items: [] } } :
        { siteName: 'Sanci9517', tagline: '' }));
      return;
    }
    const asset = pathname.startsWith('/p/') ? '/visual-page.html' : pathname;
    const file = resolve(root, '.' + asset);
    if (!file.startsWith(root + '/')) { response.writeHead(403).end(); return; }
    try {
      response.setHeader('Content-Type', { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' }[extname(file)] || 'application/octet-stream');
      response.end(await readFile(file));
    } catch { response.writeHead(404).end(); }
  });
  await new Promise(resolveListen => server.listen(0, '127.0.0.1', resolveListen));
  const browser = await chromium.launch({ headless: true,
    executablePath: process.env.CHROMIUM_PATH || (existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined),
    args: ['--no-sandbox'] });
  t.after(async () => { await browser.close(); await new Promise(resolveClose => server.close(resolveClose)); });
  const pageTab = await browser.newPage({ viewport: { width: 390, height: 800 } });
  await pageTab.goto(`http://127.0.0.1:${server.address().port}/p/sample`, { waitUntil: 'load' });
  await pageTab.getByRole('link', { name: 'Current page' }).waitFor();
  assert.equal(await pageTab.locator('.visual-text h2').textContent(), 'Published <heading>');
  assert.match(await pageTab.getByRole('link', { name: 'Current page' }).getAttribute('href'), /\/p\/target$/);
  assert.equal(await pageTab.locator('.visual-text a u strong').textContent(), 'Current page');
  assert.match(await pageTab.getByRole('link', { name: 'Historical URL' }).getAttribute('href'), /\/p\/old$/);
  assert.equal(await pageTab.locator('.visual-text a').count(), 3);
  assert.equal(await pageTab.locator('.visual-text s').textContent(), 'Emphasis');
  assert.equal(await pageTab.locator('.visual-text sup').textContent(), 'Emphasis');
  assert.equal(await pageTab.locator('.visual-text span[style*="background-color"]').evaluate(el=>getComputedStyle(el).color), 'rgb(255, 51, 102)');
  assert.equal(await pageTab.locator('.visual-text span[style*="font-family"]').evaluate(el=>getComputedStyle(el).fontSize), '24px');
  assert.match(await pageTab.locator('.visual-text span[style*="font-family"]').evaluate(el=>getComputedStyle(el).fontFamily), /Georgia/);
  assert.equal(await pageTab.locator('.visual-richtext-table th').count(), 2);
  assert.equal(await pageTab.locator('.visual-richtext-table td').nth(1).textContent(), '100');
  assert.equal(await pageTab.getByRole('link', { name: 'External' }).getAttribute('rel'), 'noopener noreferrer');
  assert.equal(await pageTab.locator('.visual-text script').count(), 0);
  assert.equal(await pageTab.evaluate(() => window.__xss), undefined);
  assert.match(await pageTab.locator('.visual-text').textContent(), /Unsafe <script>window\.__xss=1<\/script>/);
  assert.equal(await pageTab.locator('.visual-text').evaluate(el => getComputedStyle(el).backgroundColor), 'rgb(171, 205, 239)');
  assert.equal(await pageTab.locator('.visual-text').evaluate(el => el.style.getPropertyValue('--editor-mobile-width')), '85%');
  assert.equal(await pageTab.locator('.visual-card').evaluate(el => getComputedStyle(el).gridTemplateColumns.split(' ').length), 1);
  await pageTab.setViewportSize({ width: 1366, height: 800 });
  await pageTab.waitForFunction(() => getComputedStyle(document.querySelector('.visual-text')).backgroundColor === 'rgb(18, 52, 86)');
  assert.equal(await pageTab.locator('.visual-text').evaluate(el => getComputedStyle(el).fontSize), '22px');
  assert.equal(await pageTab.locator('.visual-card').evaluate(el => getComputedStyle(el).gridTemplateColumns.split(' ').length), 2);
});
