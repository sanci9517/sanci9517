import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';

const siteScript = readFileSync(new URL('../public/assets/site.js', import.meta.url), 'utf8');
const visualPage = readFileSync(new URL('../public/visual-page.html', import.meta.url), 'utf8');

function bootNavigation() {
  const listeners = new Map();
  const attributes = new Map();
  const classes = new Set();
  const documentListeners = new Map();
  const menuButton = {
    innerHTML: '',
    setAttribute(name, value) { attributes.set(name, value); },
    addEventListener(name, callback) { listeners.set(name, callback); },
    focus() { document.activeElement = this; }
  };
  const menuLinks = Array.from({ length: 3 }, (_, index) => ({
    insideMenu: true,
    href: `/page-${index + 1}`,
    focus() { document.activeElement = this; }
  }));
  const menuPanel = {
    classList: {
      contains(name) { return classes.has(name); },
      toggle(name, force) {
        const enabled = force ?? !classes.has(name);
        if (enabled) classes.add(name); else classes.delete(name);
        return enabled;
      }
    },
    querySelector() { return { replaceChildren() {} }; },
    querySelectorAll(selector) { return selector === 'a[href]' ? menuLinks : []; },
    addEventListener() {},
    contains(node) { return node?.insideMenu === true; }
  };
  const document = {
    activeElement: null,
    querySelector(selector) {
      if (selector === '[data-menu-button]') return menuButton;
      if (selector === '[data-menu-panel]') return menuPanel;
      return null;
    },
    querySelectorAll() { return []; },
    addEventListener(name, callback) { documentListeners.set(name, callback); }
  };
  vm.runInNewContext(siteScript, {
    document,
    fetch: () => Promise.reject(new Error('No network in unit test')),
    Date,
    Set,
    Map,
    String
  });
  return { document, menuButton, menuPanel, menuLinks, attributes, listeners, documentListeners };
}

test('Escape closes the public navigation and restores focus to its toggle', () => {
  const fixture = bootNavigation();
  fixture.listeners.get('click')({ preventDefault() {}, stopPropagation() {} });
  assert.equal(fixture.attributes.get('aria-expanded'), 'true');
  assert.equal(fixture.menuPanel.classList.contains('open'), true);

  fixture.document.activeElement = { insideMenu: true };
  fixture.documentListeners.get('keydown')({ key: 'Escape' });

  assert.equal(fixture.attributes.get('aria-expanded'), 'false');
  assert.equal(fixture.menuPanel.classList.contains('open'), false);
  assert.equal(fixture.document.activeElement, fixture.menuButton);
});

test('outside click restores focus only when it was inside the open navigation', () => {
  const fixture = bootNavigation();
  fixture.listeners.get('click')({ preventDefault() {}, stopPropagation() {} });
  fixture.document.activeElement = { insideMenu: true };
  fixture.documentListeners.get('click')();

  assert.equal(fixture.attributes.get('aria-expanded'), 'false');
  assert.equal(fixture.document.activeElement, fixture.menuButton);

  fixture.listeners.get('click')({ preventDefault() {}, stopPropagation() {} });
  const outsideFocus = { insideMenu: false };
  fixture.document.activeElement = outsideFocus;
  fixture.documentListeners.get('click')();
  assert.equal(fixture.document.activeElement, outsideFocus);
});

test('public menu toggle exposes the controlled navigation panel to assistive technology', () => {
  assert.match(visualPage, /data-menu-button[^>]*aria-controls="public-menu"/);
  assert.match(visualPage, /<nav[^>]*id="public-menu"[^>]*data-menu-panel/);
  assert.match(visualPage, /<script src="\/assets\/site\.js\?v=20261016-4"><\/script>/);
  assert.match(readFileSync(new URL('../public/assets/site.css', import.meta.url), 'utf8'), /\.menu-link:focus-visible/);
});

test('opening the public menu sends focus to its first link', () => {
  const fixture = bootNavigation();
  fixture.listeners.get('click')({ preventDefault() {}, stopPropagation() {} });
  assert.equal(fixture.document.activeElement, fixture.menuLinks[0]);
});

test('arrow keys and Home/End move through public menu links without scrolling the page', () => {
  const fixture = bootNavigation();
  fixture.listeners.get('click')({ preventDefault() {}, stopPropagation() {} });
  let prevented = 0;
  const press = key => fixture.documentListeners.get('keydown')({ key, preventDefault() { prevented += 1; } });

  press('ArrowDown');
  assert.equal(fixture.document.activeElement, fixture.menuLinks[1]);
  press('ArrowUp');
  assert.equal(fixture.document.activeElement, fixture.menuLinks[0]);
  press('End');
  assert.equal(fixture.document.activeElement, fixture.menuLinks[2]);
  press('Home');
  assert.equal(fixture.document.activeElement, fixture.menuLinks[0]);
  assert.equal(prevented, 4);
});
