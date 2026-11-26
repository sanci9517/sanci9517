import assert from 'node:assert/strict';
import test from 'node:test';
import { initContentInteractions } from '../core/authored-content.js';

function timerFixture() {
  const callbacks = [];
  const panels = [0, 1].map(index => ({ id: `tabs-panel-${index}`, hidden: index !== 0 }));
  const tabs = [0, 1].map(index => {
    const attributes = { 'aria-controls': panels[index].id, 'aria-selected': String(index === 0) };
    return {
      tabIndex: index === 0 ? 0 : -1,
      closest: selector => selector === '.creator-tabs' ? group : null,
      setAttribute: (name, value) => { attributes[name] = value; },
      getAttribute: name => attributes[name]
    };
  });
  const group = {
    querySelectorAll: selector => selector === '[role="tab"]' ? tabs : [],
    querySelector: selector => panels.find(panel => selector === `[id="${panel.id}"]`) ?? null
  };
  const target = {
    dataset: { pageNodeId: 'tabs_target' },
    querySelectorAll: selector => selector === '.creator-tabs [role="tab"]' ? tabs : [],
    querySelector: selector => selector === '.creator-tabs' ? group : null
  };
  const trigger = {
    isConnected: true,
    dataset: {
      pageAction: 'select-tab',
      pageActionEvent: 'timer',
      pageActionTarget: 'tabs_target',
      pageActionIndex: '1',
      pageActionDelayMs: '3000'
    }
  };
  const document = {
    hidden: false,
    addEventListener() {}
  };
  const view = {
    document,
    location: { href: 'https://example.test/p/home' },
    addEventListener() {},
    clearTimeout() {},
    setTimeout(callback, delay) { callbacks.push({ callback, delay }); return callbacks.length; }
  };
  let triggerInRoot = true;
  const root = {
    dataset: {},
    isConnected: true,
    ownerDocument: { defaultView: view },
    closest: () => null,
    contains: element => element === trigger ? triggerInRoot : element === target,
    addEventListener() {},
    querySelector: selector => selector === '[data-page-node-id="tabs_target"]' ? target : null,
    querySelectorAll: selector => {
      if (selector === '[data-page-node-id]') return [target];
      if (selector === '[data-page-action-event="load"]') return [];
      if (selector === '[data-page-action-event="timer"]') return [trigger];
      return [];
    }
  };
  return { root, trigger, tabs, panels, callbacks, detachTrigger: () => { triggerInRoot = false; trigger.isConnected = false; } };
}

test('EDT-039 pending timer is revoked when its authored trigger is detached', () => {
  const fixture = timerFixture();
  initContentInteractions(fixture.root);
  assert.equal(fixture.callbacks.length, 1);
  assert.equal(fixture.callbacks[0].delay, 3000);
  assert.equal(fixture.tabs[0].getAttribute('aria-selected'), 'true');
  assert.equal(fixture.tabs[1].getAttribute('aria-selected'), 'false');

  fixture.detachTrigger();
  fixture.callbacks[0].callback();

  assert.equal(fixture.tabs[0].getAttribute('aria-selected'), 'true', 'a stale timer cannot act through a detached button');
  assert.equal(fixture.tabs[1].getAttribute('aria-selected'), 'false');
  assert.equal(fixture.panels[0].hidden, false);
  assert.equal(fixture.panels[1].hidden, true);
});

test('EDT-039 timer still applies while its authored trigger remains in the page', () => {
  const fixture = timerFixture();
  initContentInteractions(fixture.root);
  fixture.callbacks[0].callback();
  assert.equal(fixture.tabs[0].getAttribute('aria-selected'), 'false');
  assert.equal(fixture.tabs[1].getAttribute('aria-selected'), 'true');
  assert.equal(fixture.panels[0].hidden, true);
  assert.equal(fixture.panels[1].hidden, false);
});
