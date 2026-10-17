import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve, extname } from 'node:path';
import test from 'node:test';
import { chromium } from 'playwright';

const root = resolve(import.meta.dirname, '../..', 'public');
const report = { ok: true, data: {
  checked: 2, findings: [], checkedContentLinks: 2, contentTruncated: false,
  contentFindings: [{ sourcePageId: 'home', nodeId: 'rich-text', href: '/p/' + 'hosszu-hibas-cel-'.repeat(20), reason: 'TARGET_NOT_PUBLISHED' }],
  redirectedContentLinks: [{ sourcePageId: 'home', nodeId: 'rich-text', href: '/p/old', targetPageId: 'target' }]
} };

test('Admin link report remains readable and tappable on phone widths', async t => {
  const server = createServer(async (request, response) => {
    const pathname = new URL(request.url, 'http://localhost').pathname;
    if (pathname === '/api/admin/link-report') {
      response.setHeader('Content-Type', 'application/json');
      response.end(JSON.stringify(report));
      return;
    }
    if (pathname === '/api/auth/session') {
      response.setHeader('Content-Type', 'application/json');
      response.end(JSON.stringify({ ok: true, data: { authenticated: true, user: { displayName: 'Editor', role: 'editor' } } }));
      return;
    }
    if (pathname.startsWith('/api/')) {
      response.setHeader('Content-Type', 'application/json');
      response.end(JSON.stringify({ ok: true, data: {} }));
      return;
    }
    const file = resolve(root, '.' + pathname);
    if (!file.startsWith(root + '/')) { response.writeHead(403).end(); return; }
    try {
      response.setHeader('Content-Type', extname(file) === '.html' ? 'text/html' : 'text/javascript');
      response.end(await readFile(file));
    } catch { response.writeHead(404).end(); }
  });
  await new Promise(resolveListen => server.listen(0, '127.0.0.1', resolveListen));
  const browser = await chromium.launch({ headless: true,
    executablePath: process.env.CHROMIUM_PATH || (existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined),
    args: ['--no-sandbox'] });
  t.after(async () => { await browser.close(); await new Promise(resolveClose => server.close(resolveClose)); });
  const base = `http://127.0.0.1:${server.address().port}/admin-home.html`;
  for (const width of [360, 390, 430, 1280]) {
    const page = await browser.newPage({ viewport: { width, height: 800 } });
    await page.goto(base, { waitUntil: 'load' });
    await page.locator('#refreshLinkReport').click();
    await page.getByText('Tartalmi linkhibák: 1').waitFor();
    assert.equal(await page.locator('#linkReportFindings li').count(), 2);
    assert.equal(await page.locator('#refreshLinkReport').isEnabled(), true);
    const geometry = await page.evaluate(() => {
      const button = document.getElementById('refreshLinkReport').getBoundingClientRect();
      return { viewport: document.documentElement.clientWidth, scrollWidth: document.documentElement.scrollWidth,
        buttonWidth: button.width, buttonHeight: button.height, buttonRight: button.right };
    });
    assert.ok(geometry.scrollWidth <= geometry.viewport + 1, `${width}px horizontal overflow: ${JSON.stringify(geometry)}`);
    assert.ok(geometry.buttonRight <= geometry.viewport + 1, `${width}px report action clipped`);
    if (width <= 430) assert.ok(geometry.buttonHeight >= 44, `${width}px touch target too small`);
    await page.close();
  }
});
