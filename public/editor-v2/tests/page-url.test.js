import assert from 'node:assert/strict';
import test from 'node:test';
import { initialPageId, rememberPageId, requestedPageId } from '../core/page-url.js';

const pages=[{id:'home'},{id:'youtube'}];

test('selected page id is read from the editor URL', () => {
  assert.equal(requestedPageId(new URL('https://example.test/admin/editor?pageId=youtube')),'youtube');
  assert.equal(requestedPageId(new URL('https://example.test/admin/editor')) ,null);
  assert.equal(requestedPageId(new URL('https://example.test/admin/editor?pageId=%20')),null);
});

test('editor startup restores a requested page and safely falls back when missing', () => {
  assert.equal(initialPageId('youtube',pages),'youtube');
  assert.equal(initialPageId('deleted-page',pages),'home');
  assert.equal(initialPageId(null,[]),null);
});

test('page selection updates only pageId and preserves other URL state', () => {
  const calls=[];
  const windowRef={location:new URL('https://example.test/admin/editor?tab=pages#canvas'),history:{state:{scroll:2},replaceState(...args){calls.push(args)}}};
  rememberPageId('youtube-page',windowRef);
  assert.deepEqual(calls[0],[{scroll:2},'','/admin/editor?tab=pages&pageId=youtube-page#canvas']);
  assert.equal(requestedPageId(new URL(`https://example.test${calls[0][2]}`)),'youtube-page');
});

test('clearing selected page removes only pageId', () => {
  const calls=[];
  const windowRef={location:new URL('https://example.test/admin/editor?pageId=old&tab=pages'),history:{state:null,replaceState(...args){calls.push(args)}}};
  rememberPageId(null,windowRef);
  assert.equal(calls[0][2],'/admin/editor?tab=pages');
});
