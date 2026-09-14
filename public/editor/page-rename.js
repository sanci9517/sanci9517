(() => {
  const select = document.getElementById('pageSelect');
  const newPage = document.getElementById('newPage');
  if (!select || !newPage) return;

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'btn';
  button.id = 'renamePage';
  button.textContent = 'Átnevezés';
  button.title = 'A kiválasztott oldal átnevezése';
  newPage.insertAdjacentElement('afterend', button);

  const status = text => {
    const el = document.getElementById('status');
    if (el) el.textContent = text;
  };

  const toast = text => {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = text;
    el.classList.add('show');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => el.classList.remove('show'), 2600);
  };

  button.addEventListener('click', async () => {
    const id = select.value;
    if (!id) {
      toast('Nincs kiválasztott oldal');
      return;
    }

    const saveState = document.getElementById('saveState')?.textContent || '';
    if (saveState.includes('Nem mentett')) {
      toast('Előbb mentsd a módosításokat, majd nevezd át az oldalt');
      return;
    }

    const currentLabel = select.options[select.selectedIndex]?.textContent?.trim() || '';
    const title = prompt('Az oldal új neve:', currentLabel);
    if (title === null) return;
    const nextTitle = title.trim();
    if (!nextTitle) {
      toast('Az oldal neve nem lehet üres');
      return;
    }
    if (nextTitle.length > 160) {
      toast('Az oldal neve legfeljebb 160 karakter lehet');
      return;
    }

    button.disabled = true;
    status('Átnevezés…');
    try {
      const res = await fetch('/api/admin/pages', {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id, title: nextTitle })
      });
      const result = await res.json();
      if (!res.ok || !result.ok) throw Error(result.error?.message || 'Átnevezési hiba');

      toast('Az oldal neve elmentve D1-be');
      status('Átnevezve');
      setTimeout(() => window.location.reload(), 350);
    } catch (error) {
      status('Átnevezési hiba');
      toast(error?.message || 'Átnevezési hiba');
    } finally {
      button.disabled = false;
    }
  });
})();