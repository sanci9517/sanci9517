/* UI-only accordion state; edits still flow through the Page Model commands. */
const processed = new WeakSet();
const openGroups = new Map();
let contentIdSequence = 0;

function groupKey(group, title) {
  return title.querySelector('strong')?.textContent?.trim() || '';
}

function setGroupOpen(group, title, open) {
  group.classList.toggle('is-open', open);
  title.setAttribute('aria-expanded', String(open));
}

function enhanceGroup(group) {
  if (!group || processed.has(group)) return;
  const title = group.querySelector(':scope > .inspector-group-title');
  if (!title) return;
  processed.add(group);

  const key = groupKey(group, title);
  const content = document.createElement('div');
  content.className = 'inspector-group-content';
  content.id = `inspector-group-content-${contentIdSequence++}`;
  [...group.children].filter((child) => child !== title).forEach((child) => content.append(child));
  group.append(content);

  const initiallyOpen = openGroups.get(key) ?? false;
  setGroupOpen(group, title, initiallyOpen);
  title.setAttribute('role', 'button');
  title.setAttribute('tabindex', '0');
  title.setAttribute('aria-expanded', String(initiallyOpen));
  title.setAttribute('aria-controls', content.id);

  const toggle = () => {
    const open = group.classList.toggle('is-open');
    openGroups.set(key, open);
    title.setAttribute('aria-expanded', String(open));
  };
  title.addEventListener('click', toggle);
  title.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggle();
    }
  });
}

function syncSearchExpansion(active) {
  document.querySelectorAll('#inspectorBody .inspector-group').forEach((group) => {
    enhanceGroup(group);
    const title = group.querySelector(':scope > .inspector-group-title');
    if (!title) return;
    const open = active && !group.hidden ? true : openGroups.get(groupKey(group, title)) ?? false;
    setGroupOpen(group, title, open);
  });
}

function enhance() {
  document.querySelectorAll('#inspectorBody .inspector-group').forEach(enhanceGroup);
}

document.addEventListener('editor-inspector-search-change', (event) => {
  syncSearchExpansion(Boolean(event.detail?.active));
});

const observer = new MutationObserver(enhance);
observer.observe(document.documentElement, { childList: true, subtree: true });
document.addEventListener('DOMContentLoaded', enhance);
