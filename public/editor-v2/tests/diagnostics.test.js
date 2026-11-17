import test from 'node:test';
import assert from 'node:assert/strict';
import { diagnostics } from '../diagnostics.js';

test('diagnostics redact secrets, URL queries and common identifiers before retaining entries', () => {
  diagnostics.clear();
  const error = Object.assign(new Error('Request failed: https://api.example.invalid/callback?code=oauth-code&state=oauth-state token=opaque Bearer bearer-secret email person@example.com phone +36 30 123 4567'), {
    apiKey: 'private-key',
    response: { authorization: 'Bearer response-secret' }
  });
  const entry = diagnostics.add({
    source: 'api',
    message: error.message,
    context: 'https://api.example.invalid/api/admin/pages?siteId=private-site&access_token=private-token',
    file: '/home/streamer/private/project/app.js?email=person@example.com',
    line: -1,
    column: 1.5,
    error
  });

  assert.equal(entry.code, 'SANCI-API-E001');
  assert.equal(entry.context, '/api/admin/pages?[redacted]');
  assert.equal(entry.file, 'project/app.js?[redacted]');
  assert.equal(entry.line, 0);
  assert.equal(entry.column, 0);
  assert.equal(Object.hasOwn(entry, 'error'), false, 'raw Error objects and their custom fields are never retained');
  const serialized = JSON.stringify(entry);
  for (const secret of ['oauth-code', 'oauth-state', 'opaque', 'bearer-secret', 'private-site', 'private-token', 'private-key', 'response-secret', 'person@example.com', '+36 30 123 4567']) {
    assert.equal(serialized.includes(secret), false, `diagnostic record redacts ${secret}`);
  }
  assert.match(entry.message, /\[redacted\]/);
  assert.match(entry.message, /\[redacted-email\]/);
  assert.match(entry.message, /\[redacted-phone\]/);
});

test('diagnostic codes stay stable while entry IDs remain unique and the buffer is bounded', () => {
  diagnostics.clear();
  const one = diagnostics.add({ source: 'api', message: 'Első hiba' });
  const two = diagnostics.add({ source: 'api', message: 'Második hiba' });
  assert.equal(one.code, two.code);
  assert.notEqual(one.id, two.id);
  for (let index = 0; index < 105; index += 1) diagnostics.add({ source: 'unknown', severity: 'fatal', message: `runtime ${index}` });
  assert.equal(diagnostics.entries.length, 100);
  assert.ok(diagnostics.entries.every(entry => entry.source === 'runtime' && entry.severity === 'error'));
});

test('verify reports a stable safe diagnostic without a stack trace', () => {
  diagnostics.clear();
  assert.equal(diagnostics.verify(false, { message: 'Ellenőrizd a mentést', context: '/api/admin/editor?pageId=private-page' }), false);
  const [entry] = diagnostics.entries;
  assert.equal(entry.code, 'SANCI-VERIFY-E001');
  assert.equal(entry.context, '/api/admin/editor?[redacted]');
  assert.equal(JSON.stringify(entry).includes('stack'), false);
});
