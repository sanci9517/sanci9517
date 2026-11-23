import { retentionLabels as labels, uuid, cancellable, actionButton, checkedCancellation, parseRetentionDate } from "./admin-media-retention-actions.js";
const invalid = "Az adatmegőrzési kérelmek adatai nem ellenőrizhetők. Próbáld újra.";
const dateFormat = new Intl.DateTimeFormat("hu-HU", {
  year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", timeZoneName: "short"
});
function parseDate(value) { return parseRetentionDate(value, invalid); }
function checkedRequests(data) {
  if (data?.migrationActive !== true || data.permanentDeletionAuthorized !== false ||
      typeof data.complete !== "boolean" || !Array.isArray(data.requests) || data.requests.length > 100 ||
      (!data.complete && data.requests.length !== 100) ||
      (data.complete ? data.nextCursor !== null : typeof data.nextCursor !== "string" || !uuid.test(data.nextCursor))) throw new Error(invalid);
  const ids = new Set();
  const rows = data.requests.map(row => {
    if (!row || typeof row.id !== "string" || typeof row.assetId !== "string" || !uuid.test(row.id) || !uuid.test(row.assetId) || ids.has(row.id) ||
        !Object.hasOwn(labels, row.state) || row.permanentDeletionAuthorized !== false ||
        !Number.isSafeInteger(row.attemptCount) || row.attemptCount < 0) throw new Error(invalid);
    ids.add(row.id);
    return { ...row, requested: parseDate(row.requestedAt), due: parseDate(row.notBefore), updated: parseDate(row.updatedAt) };
  });
  if (!data.complete && data.nextCursor !== rows.at(-1)?.id) throw new Error(invalid);
  return rows;
}
function requestCard(row, cancelRequest) {
  const card = document.createElement("li");
  card.className = "retention-card";
  card.dataset.requestId = row.id;
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
  if (cancelRequest && cancellable.has(row.state)) {
    const cancel = actionButton("Kérelem visszavonása");
    const controls = document.createElement("div"); controls.className = "retention-controls";
    cancel.onclick = () => {
      cancel.disabled = true;
      const message = document.createElement("p"); message.textContent = "Visszavonod ezt a kérelmet? A médiafájl archivált marad, a tárhelyhasználat nem változik.";
      const confirm = actionButton("Visszavonás megerősítése");
      const abort = actionButton("Mégse");
      controls.replaceChildren(message, confirm, abort); confirm.focus({ preventScroll: true });
      abort.onclick = () => { controls.replaceChildren(); cancel.disabled = false; cancel.focus({ preventScroll: true }); };
      confirm.onclick = () => { void cancelRequest(row); };
    };
    card.append(cancel, controls);
  }
  return card;
}

/** Loading/refreshing only reads; cancellation requires a separate confirmation. */
export function mountRetentionStatus(panel, loadStatus, { cancelRequest } = {}) {
  const button = panel.querySelector("button");
  const nextButton = panel.querySelector(".retention-next");
  const status = panel.querySelector("[role=status]");
  const list = panel.querySelector("ul");
  const notice = panel.querySelector(".retention-notice");
  let request = 0;
  let mutation = false;
  let nextCursor = null;
  async function cancel(row) {
    if (mutation || !panel.isConnected) return;
    mutation = true;
    ++request; // Invalidate an older status read before changing metadata.
    panel.dataset.state = "updating";
    panel.querySelectorAll("button").forEach(control => { control.disabled = true; });
    panel.setAttribute("aria-busy", "true");
    status.textContent = "Kérelem visszavonása…";
    let outcome;
    try {
      checkedCancellation(await cancelRequest(row.id), row.id);
      outcome = "A kérelem visszavonva. A médiafájl megmaradt.";
    } catch (error) {
      outcome = (error instanceof TypeError ? "Kapcsolati hiba." : error.message || "A visszavonás nem igazolható.") +
        " Ellenőrizd a friss állapotot. A kérés nem ismétlődik meg automatikusan.";
    } finally {
      mutation = false;
      await refresh();
      status.textContent = outcome + " " + status.textContent;
      button.focus({ preventScroll: true });
    }
  }
  async function refresh() {
    if (mutation) return;
    const current = ++request;
    const hadFocus = document.activeElement === button;
    button.disabled = true;
    nextButton.disabled = false;
    panel.setAttribute("aria-busy", "true");
    panel.dataset.state = "loading";
    status.textContent = "Adatmegőrzési kérelmek betöltése…";
    list.replaceChildren(); list.hidden = true;
    notice.textContent = ""; notice.hidden = true;
    try {
      const data = await loadStatus();
      if (current !== request) return;
      const rows = checkedRequests(data);
      list.replaceChildren(...rows.map(row => requestCard(row, cancelRequest ? cancel : null))); list.hidden = rows.length === 0;
      nextCursor = data.nextCursor;
      nextButton.hidden = nextCursor === null;
      status.textContent = rows.length ? `${rows.length} adatmegőrzési kérelem látható.` : "Nincs adatmegőrzési kérelem.";
      if (!data.complete) {
        notice.textContent = "További kérelmek is vannak. A következő 100 betöltésével folytathatod.";
        notice.hidden = false;
      }
      panel.dataset.state = rows.length ? "ready" : "empty";
    } catch (error) {
      if (current !== request) return;
      list.replaceChildren(); list.hidden = true;
      nextCursor = null; nextButton.hidden = true;
      panel.dataset.state = "error";
      status.textContent = error instanceof TypeError ? "A kérelmek nem tölthetők be. Ellenőrizd a kapcsolatot, majd próbáld újra." : error instanceof Error ? error.message : "A kérelmek nem tölthetők be. Próbáld újra.";
    } finally {
      if (current === request) {
        panel.setAttribute("aria-busy", "false"); button.disabled = false;
        if (hadFocus && document.activeElement === document.body) button.focus({ preventScroll: true });
      }
    }
  }
  async function loadNext() {
    if (mutation || !nextCursor) return;
    const current = ++request;
    const cursor = nextCursor;
    const hadFocus = document.activeElement === nextButton;
    nextButton.disabled = true;
    panel.setAttribute("aria-busy", "true");
    panel.dataset.state = "loading-more";
    status.textContent = "A következő 100 kérelem betöltése…";
    try {
      const data = await loadStatus(cursor);
      if (current !== request) return;
      const rows = checkedRequests(data);
      const existingIds = new Set([...list.querySelectorAll(".retention-card")].map(card => card.dataset.requestId));
      if (rows.some(row => existingIds.has(row.id))) throw new Error(invalid);
      list.append(...rows.map(row => requestCard(row, cancelRequest ? cancel : null)));
      list.hidden = list.childElementCount === 0;
      nextCursor = data.nextCursor;
      nextButton.hidden = nextCursor === null;
      panel.dataset.state = "ready";
      status.textContent = `${list.childElementCount} adatmegőrzési kérelem látható.`;
      notice.textContent = data.complete ? "Az összes kérelem betöltve." : "További kérelmek is vannak. A következő 100 betöltésével folytathatod.";
      notice.hidden = false;
      if (hadFocus && nextButton.hidden) button.focus({ preventScroll: true });
    } catch (error) {
      if (current !== request) return;
      panel.dataset.state = "error";
      status.textContent = error instanceof TypeError ? "A következő részlet nem tölthető be. Ellenőrizd a kapcsolatot, majd próbáld újra." : error instanceof Error ? error.message : invalid;
    } finally {
      if (current === request) {
        panel.setAttribute("aria-busy", "false");
        nextButton.disabled = false;
      }
    }
  }
  button.addEventListener("click", () => { void refresh(); });
  nextButton.addEventListener("click", () => { void loadNext(); });
  void refresh();
  return { refresh };
}
