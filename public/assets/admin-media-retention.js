const labels = Object.freeze({
  requested: "Kérelem rögzítve",
  quarantined: "Várakozási idő",
  revalidated: "Újraellenőrizve",
  cancelled: "Visszavonva",
  deleted: "Törölve",
  blocked: "Elakadt"
});
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const invalid = "Az adatmegőrzési kérelmek adatai nem ellenőrizhetők. Próbáld újra.";
const dateFormat = new Intl.DateTimeFormat("hu-HU", {
  year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", timeZoneName: "short"
});
function parseDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})?$/.test(value)) throw new Error(invalid);
  // SQLite CURRENT_TIMESTAMP is UTC even though its text has no zone suffix.
  const calendar = new Date(value.slice(0, 10) + "T00:00:00Z");
  if (!Number.isFinite(calendar.getTime()) || calendar.toISOString().slice(0, 10) !== value.slice(0, 10)) throw new Error(invalid);
  const iso = value.replace(" ", "T") + (/(Z|[+-]\d{2}:\d{2})$/.test(value) ? "" : "Z");
  const date = new Date(iso);
  if (!Number.isFinite(date.getTime())) throw new Error(invalid);
  return date;
}
function checkedRequests(data) {
  if (data?.migrationActive !== true || data.permanentDeletionAuthorized !== false ||
      typeof data.complete !== "boolean" || !Array.isArray(data.requests) || data.requests.length > 100 ||
      (!data.complete && data.requests.length !== 100)) throw new Error(invalid);
  const ids = new Set();
  return data.requests.map(row => {
    if (!row || typeof row.id !== "string" || typeof row.assetId !== "string" || !uuid.test(row.id) || !uuid.test(row.assetId) || ids.has(row.id) ||
        !Object.hasOwn(labels, row.state) || row.permanentDeletionAuthorized !== false ||
        !Number.isSafeInteger(row.attemptCount) || row.attemptCount < 0) throw new Error(invalid);
    ids.add(row.id);
    return { ...row, requested: parseDate(row.requestedAt), due: parseDate(row.notBefore), updated: parseDate(row.updatedAt) };
  });
}
function requestCard(row) {
  const card = document.createElement("li");
  card.className = "retention-card";
  const title = document.createElement("strong");
  title.textContent = labels[row.state];
  const asset = document.createElement("p");
  asset.className = "retention-asset";
  asset.textContent = "Médiafájl azonosítója: " + row.assetId;
  const fields = document.createElement("dl");
  fields.className = "retention-fields";
  for (const [label, date] of [["Kérelem ideje", row.requested], ["Várakozás vége", row.due], ["Utolsó változás", row.updated]]) {
    const term = document.createElement("dt"); term.textContent = label;
    const detail = document.createElement("dd");
    const time = document.createElement("time"); time.dateTime = date.toISOString(); time.textContent = dateFormat.format(date);
    detail.append(time); fields.append(term, detail);
  }
  card.append(title, asset, fields);
  if (row.state === "blocked") {
    const help = document.createElement("p"); help.className = "muted";
    help.textContent = "A kérelem további ellenőrzést igényel."; card.append(help);
  }
  return card;
}

/** Read-only status view. The loader must only perform the existing GET. */
export function mountRetentionStatus(panel, loadStatus) {
  const button = panel.querySelector("button");
  const status = panel.querySelector("[role=status]");
  const list = panel.querySelector("ul");
  const notice = panel.querySelector(".retention-notice");
  let request = 0;
  async function refresh() {
    const current = ++request;
    const hadFocus = document.activeElement === button;
    button.disabled = true;
    panel.setAttribute("aria-busy", "true");
    panel.dataset.state = "loading";
    status.textContent = "Adatmegőrzési kérelmek betöltése…";
    list.replaceChildren(); list.hidden = true;
    notice.textContent = ""; notice.hidden = true;
    try {
      const data = await loadStatus();
      if (current !== request) return;
      const rows = checkedRequests(data);
      list.replaceChildren(...rows.map(requestCard)); list.hidden = rows.length === 0;
      status.textContent = rows.length ? `${rows.length} adatmegőrzési kérelem látható.` : "Nincs adatmegőrzési kérelem.";
      if (!data.complete) {
        notice.textContent = "Az első 100 kérelem látható; a lista nem teljes.";
        notice.hidden = false;
      }
      panel.dataset.state = rows.length ? "ready" : "empty";
    } catch (error) {
      if (current !== request) return;
      list.replaceChildren(); list.hidden = true;
      panel.dataset.state = "error";
      status.textContent = error instanceof TypeError ? "A kérelmek nem tölthetők be. Ellenőrizd a kapcsolatot, majd próbáld újra." : error instanceof Error ? error.message : "A kérelmek nem tölthetők be. Próbáld újra.";
    } finally {
      if (current === request) {
        panel.setAttribute("aria-busy", "false"); button.disabled = false;
        if (hadFocus && document.activeElement === document.body) button.focus({ preventScroll: true });
      }
    }
  }
  button.addEventListener("click", () => { void refresh(); });
  void refresh();
  return { refresh };
}
