/* Sanci9517 Editor v2 — collapsible Inspector groups.
 * UI-only behavior: no Page Model or mutation state is introduced here.
 * All Inspector sections start collapsed so the panel stays compact as it grows.
 * Open/closed state survives Inspector re-renders caused by editing.
 */

const STYLE_ID = 'sanci-inspector-groups-style';
const processed = new WeakSet();
const openGroups = new Map();

function installStyle() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    .inspector-group{overflow:hidden}
    .inspector-group-title{display:flex;align-items:center;justify-content:space-between;gap:10px;min-height:36px;padding:8px 10px;cursor:pointer;user-select:none}
    .inspector-group-title::before{content:'›';display:grid;place-items:center;width:18px;height:18px;border-radius:5px;background:rgba(255,255,255,.055);font-size:15px;line-height:1;transition:transform .16s ease}
    .inspector-group.is-open .inspector-group-title::before{transform:rotate(90deg)}
    .inspector-group-title strong{flex:1}
    .inspector-group-content{display:none;padding:0 10px 10px}
    .inspector-group.is-open .inspector-group-content{display:block}
  `;
  document.head.append(style);
}

function groupKey(group, title) {
  return title.querySelector('strong')?.textContent?.trim() || '';
}

function enhanceGroup(group) {
  if (!group || processed.has(group)) return;
  const title = group.querySelector(':scope > .inspector-group-title');
  if (!title) return;
  processed.add(group);

  const key = groupKey(group, title);
  const content = document.createElement('div');
  content.className = 'inspector-group-content';
  [...group.children].filter((child) => child !== title).forEach((child) => content.append(child));
  group.append(content);

  const initiallyOpen = openGroups.get(key) === true;
  group.classList.toggle('is-open', initiallyOpen);
  title.setAttribute('role', 'button');
  title.setAttribute('tabindex', '0');
  title.setAttribute('aria-expanded', String(initiallyOpen));

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

function enhance() {
  installStyle();
  document.querySelectorAll('#inspectorBody .inspector-group').forEach(enhanceGroup);
}

const observer = new MutationObserver(enhance);
observer.observe(document.documentElement, { childList: true, subtree: true });
document.addEventListener('DOMContentLoaded', enhance);
