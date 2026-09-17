/* Sanci9517 Editor v2 — geometry preset controls.
 * Presets intentionally drive the existing Inspector inputs so the canonical
 * Command -> Page Model -> Canvas -> History path remains the only mutation path.
 */

const PRESETS = Object.freeze({
  width: [
    ['Auto', 'auto'],
    ['25%', '25%'],
    ['50%', '50%'],
    ['75%', '75%'],
    ['100%', '100%'],
    ['Fit', 'fit-content']
  ],
  height: [
    ['Auto', 'auto'],
    ['100', '100px'],
    ['200', '200px'],
    ['300', '300px'],
    ['Fit', 'fit-content']
  ]
});

const STYLE_ID = 'sanci-geometry-presets-style';

function installStyle() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    .geometry-presets-wrap{margin:2px 0 10px;padding:8px 0 2px;border-top:1px solid rgba(255,255,255,.08)}
    .geometry-presets-label{display:block;margin:0 0 6px;color:rgba(255,255,255,.55);font-size:10px;text-transform:uppercase;letter-spacing:.06em}
    .geometry-presets{display:flex;flex-wrap:wrap;gap:5px}
    .geometry-presets button{min-width:38px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.045);color:inherit;border-radius:6px;padding:5px 8px;font:inherit;font-size:11px;cursor:pointer}
    .geometry-presets button:hover{background:rgba(255,255,255,.09)}
    .geometry-presets button.active{border-color:rgba(255,255,255,.3);background:rgba(255,255,255,.12)}
  `;
  document.head.append(style);
}

function findField(group, labelText) {
  return [...group.querySelectorAll('.field')].find((field) =>
    field.querySelector('span')?.textContent?.trim() === labelText
  );
}

function addPresets(group, labelText, values, input) {
  const field = findField(group, labelText);
  if (!field || !input || field.previousElementSibling?.classList.contains('geometry-presets-wrap')) return;

  const wrap = document.createElement('div');
  wrap.className = 'geometry-presets-wrap';

  const label = document.createElement('span');
  label.className = 'geometry-presets-label';
  label.textContent = `${labelText} gyorsbeállítások`;

  const presets = document.createElement('div');
  presets.className = 'geometry-presets';
  presets.setAttribute('aria-label', `${labelText} gyorsbeállítások`);

  for (const [labelTextValue, value] of values) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = labelTextValue;
    button.dataset.value = value;
    button.onclick = () => {
      input.value = value;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    };
    presets.append(button);
  }

  wrap.append(label, presets);
  field.before(wrap);
}

function enhance() {
  installStyle();
  const inspector = document.querySelector('#inspectorBody');
  if (!inspector) return;
  const group = [...inspector.querySelectorAll('.inspector-group')].find((item) =>
    item.querySelector('.inspector-group-title strong')?.textContent?.trim() === 'Geometria'
  );
  if (!group) return;

  addPresets(group, 'Szélesség', PRESETS.width, findField(group, 'Szélesség')?.querySelector('input'));
  addPresets(group, 'Magasság', PRESETS.height, findField(group, 'Magasság')?.querySelector('input'));
}

const observer = new MutationObserver(enhance);
observer.observe(document.documentElement, { childList: true, subtree: true });
document.addEventListener('DOMContentLoaded', enhance);
