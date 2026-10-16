import assert from 'node:assert/strict';
import test from 'node:test';
import worker from '../src/index.ts';
import { hashSessionToken } from '../src/core/auth/session.ts';

function envWithPublishedSlug(publishedSlug = 'youtube', authenticated = false) {
  const assetRequests = [];
  const lookupSlugs = [];
  const sessionHashes = [];
  const document = JSON.stringify({
    type: 'sanci-page-document',
    schemaVersion: 1,
    activePageId: 'youtube-page',
    pages: {
      'youtube-page': {
        id: 'youtube-page',
        rootId: 'root',
        nodes: { root: { id: 'root', type: 'root', children: [], props: {} } }
      }
    }
  });
  return {
    assetRequests,
    lookupSlugs,
    sessionHashes,
    env: {
      DB: {
        prepare(sql) {
          return {
            bind(siteId, slug) {
              if (sql.includes('FROM sessions')) {
                sessionHashes.push(siteId);
                return this;
              }
              assert.equal(siteId, 'site-default');
              if (!sql.includes('FROM page_slug_redirects')) lookupSlugs.push(slug);
              return this;
            },
            async first() {
              if (sql.includes('FROM sessions')) {
                return authenticated && sessionHashes.at(-1) === await hashSessionToken('editor-token')
                  ? { id: 'editor', email: 'editor@example.test', displayName: 'Editor', role: 'editor' }
                  : null;
              }
              if (sql.includes('FROM page_slug_redirects')) return null;
              if (lookupSlugs.at(-1) !== publishedSlug && !(authenticated && lookupSlugs.at(-1) === 'youtube-draft')) return null;
              return {
                id: 'youtube-page', slug: 'youtube-draft', title: 'YouTube', description: 'Channel',
                content_json: document, published_content_json: document, published_slug: publishedSlug,
                published_title: 'YouTube', published_description: 'Channel', sort_order: 1,
                updated_at: '2026-10-16T00:00:00.000Z', published_at: '2026-10-16T00:00:00.000Z'
              };
            }
          };
        }
      },
      ASSETS: {
        async fetch(request) {
          assetRequests.push(request);
          return new Response('<!doctype html><title>Site</title>', {
            status: 200,
            headers: { 'Content-Type': 'text/html; charset=utf-8' }
          });
        }
      }
    }
  };
}

test('published page route serves the app shell and preserves its requested URL', async () => {
  const fixture = envWithPublishedSlug();
  const response = await worker.fetch(new Request('https://example.test/p/youtube?ref=nav'), fixture.env, {});

  assert.equal(response.status, 200);
  assert.match(await response.text(), /<title>Site<\/title>/);
  assert.deepEqual(fixture.lookupSlugs, ['youtube']);
  assert.equal(new URL(fixture.assetRequests[0].url).pathname, '/visual-page.html');
  assert.equal(new URL(fixture.assetRequests[0].url).search, '?ref=nav');
});

test('unknown and unpublished pages return an HTTP 404 instead of a soft 404', async () => {
  const fixture = envWithPublishedSlug('youtube');

  const unknown = await worker.fetch(new Request('https://example.test/p/missing'), fixture.env, {});
  const unpublished = await worker.fetch(new Request('https://example.test/p/draft-only'), fixture.env, {});

  assert.equal(unknown.status, 404);
  assert.equal(unpublished.status, 404);
  assert.equal(unknown.headers.get('Cache-Control'), 'no-store');
  assert.deepEqual(fixture.lookupSlugs, ['missing', 'draft-only']);
});

test('invalid or nested page paths return 404 without querying D1', async () => {
  const fixture = envWithPublishedSlug();

  const malformed = await worker.fetch(new Request('https://example.test/p/%E0%A4%A'), fixture.env, {});
  const nested = await worker.fetch(new Request('https://example.test/p/youtube/extra'), fixture.env, {});

  assert.equal(malformed.status, 404);
  assert.equal(nested.status, 404);
  assert.deepEqual(fixture.lookupSlugs, []);
});

test('authenticated preview can open an unpublished draft slug', async () => {
  const fixture = envWithPublishedSlug('youtube', true);
  const request = new Request('https://example.test/p/youtube-draft?preview=1', {
    headers: { Cookie: 'sanci9517_session=editor-token' }
  });

  const response = await worker.fetch(request, fixture.env, {});

  assert.equal(response.status, 200);
  assert.deepEqual(fixture.lookupSlugs, ['youtube-draft']);
});

test('unauthenticated preview keeps the 401 status and does not query draft content', async () => {
  const fixture = envWithPublishedSlug();

  const response = await worker.fetch(new Request('https://example.test/p/youtube-draft?preview=1'), fixture.env, {});

  assert.equal(response.status, 401);
  assert.deepEqual(fixture.lookupSlugs, []);
  assert.equal(fixture.sessionHashes.length, 0);
});
