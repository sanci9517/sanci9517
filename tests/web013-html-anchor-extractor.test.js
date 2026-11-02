import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { Miniflare, convertV4MiniflareOptions } from 'miniflare';
import ts from 'typescript';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = readFileSync(resolve(root, 'src/core/html-hrefs.ts'), 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;
const script = `${compiled}\nexport default { async fetch(request) {\n  const { html, limit } = await request.json();\n  return Response.json(await scanHtmlAnchorHrefs(html, limit));\n} };`;

test('WEB-013 legacy href extraction uses the actual Workers HTML parser', { timeout: 30000 }, async t => {
  const mf = new Miniflare(convertV4MiniflareOptions({ modules: true, script }));
  t.after(() => mf.dispose());
  const html = [
    '<!-- <a href="/p/comment-only">not a link</a> -->',
    '<script>const fake = "<a href=/p/script-only>";</script>',
    '<style>.fake::after { content: "<a href=/p/style-only>" }</style>',
    '<textarea><a href=/p/textarea-only></textarea>',
    '<a data-href="/p/not-a-target">not a link</a>',
    '<a href="/p/first&amp;second" title="contains > safely">first</a>',
    "<a class='cta' href='/p/second'>second</a>",
    '<a href=/p/third>third</a>',
  ].join('');
  const response = await mf.dispatchFetch('http://fixture.test/extract', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ html, limit: 2 }),
  });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    hrefs: ['/p/first&amp;second', '/p/second'],
    truncated: true,
  });
});
