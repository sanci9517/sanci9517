// Manual, bounded GET diagnostics. Findings never authorize repair or deletion.
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const opaqueCursor = /^[A-Za-z0-9_+/=:-]{1,1024}$/;
const invalid = "A vizsgálat válasza nem ellenőrizhető. Indíts új vizsgálatot.";
const messages = {
  UNAUTHORIZED: "A munkamenet lejárt. Jelentkezz be újra.",
  FORBIDDEN: "A vizsgálathoz szerkesztői jogosultság szükséges.",
  SITE_ACCESS_DENIED: "Ehhez a webhelyhez nincs hozzáférésed.",
  MEDIA_STORAGE_UNAVAILABLE: "A médiatároló jelenleg nem érhető el.",
  MEDIA_STORAGE_FAILED: "A fájlok ellenőrzése nem sikerült. Próbáld újra később.",
  MEDIA_METADATA_FAILED: "A nyilvántartás nem érhető el. Próbáld újra később.",
  INVALID_MEDIA_CURSOR: "A lapozási állapot érvénytelen. Indíts új vizsgálatot."
};
async function readAudit(url) {
  const response = await fetch(url, { method: "GET", credentials: "same-origin", cache: "no-store" });
  let payload;
  try { payload = await response.json(); } catch { throw new Error(invalid); }
  if (!response.ok || payload?.ok !== true) throw new Error(Object.hasOwn(messages, payload?.error?.code) ? messages[payload.error.code] : "A vizsgálat nem sikerült. Próbáld újra.");
  return payload.data;
}
function checkedReport(data, mode, cursors) {
  if (data?.mode !== "read-only" || !Number.isSafeInteger(data.checked) || data.checked < 0 || data.checked > 100 || typeof data.complete !== "boolean") throw new Error(invalid);
  if (data.complete ? data.nextCursor !== null : typeof data.nextCursor !== "string" || !data.nextCursor || cursors.has(data.nextCursor)) throw new Error(invalid);
  if (!data.complete && !(mode === "missing" ? uuid : opaqueCursor).test(data.nextCursor)) throw new Error(invalid);
  const unique = new Set();
  if (mode === "missing") {
    if (data.repairAuthorized !== false || !Array.isArray(data.missing) || data.missing.length > data.checked || (!data.complete && data.checked !== 100)) throw new Error(invalid);
    for (const row of data.missing) {
      if (!row || typeof row.id !== "string" || !uuid.test(row.id) || unique.has(row.id) || typeof row.name !== "string" || row.name.length > 1024 || typeof row.archived !== "boolean") throw new Error(invalid);
      unique.add(row.id);
    }
    return data.missing;
  }
  if (data.deletionAuthorized !== false || typeof data.siteId !== "string" || !data.siteId || data.siteId.length > 128 ||
      !Array.isArray(data.unregisteredCandidates) || !Number.isSafeInteger(data.registeredCount) || data.registeredCount < 0 ||
      data.unregisteredCandidates.length + data.registeredCount !== data.checked) throw new Error(invalid);
  const prefix = "sites/" + encodeURIComponent(data.siteId) + "/media/";
  for (const key of data.unregisteredCandidates) {
    if (typeof key !== "string" || key.length > 1024 || !key.startsWith(prefix) || key.length <= prefix.length || unique.has(key)) throw new Error(invalid);
    unique.add(key);
  }
  return data.unregisteredCandidates;
}
function finding(row, mode) {
  const item = document.createElement("li");
  const title = document.createElement("strong");
  const detail = document.createElement("p");
  if (mode === "missing") {
    title.textContent = row.name || "Névtelen médiafájl";
    detail.textContent = "Azonosító: " + row.id + " · " + (row.archived ? "Archivált" : "Aktív");
  } else {
    title.textContent = "Nem nyilvántartott fájljelölt";
    detail.textContent = "Tárolt fájl azonosítója: " + row;
  }
  item.append(title, detail);
  return item;
}

export function mountMediaIntegrity(root) {
  for (const panel of root.querySelectorAll("[data-audit-mode]")) {
    const mode = panel.dataset.auditMode;
    if (mode !== "missing" && mode !== "orphan") continue;
    const start = panel.querySelector("[data-audit-start]");
    const next = panel.querySelector("[data-audit-next]");
    const retry = panel.querySelector("[data-audit-retry]");
    const status = panel.querySelector("[role=status]");
    const list = panel.querySelector("ul");
    let busy = false, page = 0, request = 0, nextCursor = null, attemptedCursor = null;
    const cursors = new Set();
    async function load(cursor, restart = false) {
      if (busy || !panel.isConnected) return;
      const current = ++request;
      busy = true; attemptedCursor = cursor;
      if (restart) { cursors.clear(); page = 0; }
      const restoreFocus = panel.contains(document.activeElement);
      start.disabled = next.disabled = retry.disabled = true;
      next.hidden = retry.hidden = true;
      panel.dataset.state = "loading"; panel.setAttribute("aria-busy", "true");
      status.textContent = "Legfeljebb 100 fájl ellenőrzése…";
      list.replaceChildren(); list.hidden = true;
      try {
        const url = new URL("/api/admin/media", location.origin);
        url.searchParams.set(mode === "missing" ? "missingAudit" : "orphanAudit", "1");
        if (cursor !== null) url.searchParams.set(mode === "missing" ? "before" : "cursor", cursor);
        cursors.add(cursor);
        const data = await readAudit(url);
        if (current !== request || !panel.isConnected) return;
        const rows = checkedReport(data, mode, cursors);
        page++;
        list.replaceChildren(...rows.map(row => finding(row, mode))); list.hidden = rows.length === 0;
        status.textContent = `${page}. részlet: ${data.checked} fájl ellenőrizve; ${rows.length} ${mode === "missing" ? "hiányzó fájl" : "nem nyilvántartott jelölt"}. ` +
          (data.complete ? "Nincs további részlet ebben a vizsgálatban." : "A vizsgálat még nem teljes. A következő részlet külön indítható.");
        panel.dataset.state = rows.length ? "findings" : "empty";
        nextCursor = data.nextCursor; next.hidden = data.complete;
        start.textContent = "Vizsgálat újrakezdése";
      } catch (error) {
        if (current !== request || !panel.isConnected) return;
        panel.dataset.state = "error";
        status.textContent = error instanceof TypeError ? "Kapcsolati hiba. Ellenőrizd a kapcsolatot, majd próbáld újra ezt a részletet." : error.message || invalid;
        nextCursor = null; retry.hidden = false;
      } finally {
        busy = false;
        panel.setAttribute("aria-busy", "false");
        start.disabled = next.disabled = retry.disabled = false;
        if (panel.isConnected && restoreFocus && (document.activeElement === document.body || panel.contains(document.activeElement)))
          (panel.dataset.state === "error" ? retry : next.hidden ? start : next).focus({ preventScroll: true });
      }
    }
    start.addEventListener("click", () => { void load(null, true); });
    next.addEventListener("click", () => { if (nextCursor !== null) void load(nextCursor); });
    retry.addEventListener("click", () => { void load(attemptedCursor); });
  }
}
