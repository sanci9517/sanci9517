import { retentionLabels as labels, uuid, cancellable, actionButton, checkedCancellation, parseRetentionDate } from "./admin-media-retention-actions.js";
const invalid = "Az adatmegőrzési kérelmek adatai nem ellenőrizhetők. Próbáld újra.";
const dateFormat = new Intl.DateTimeFormat("hu-HU", {
  year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", timeZoneName: "short"
});
function parseDate(value) { return parseRetentionDate(value, invalid); }
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
function requestCard(row, cancelRequest) {
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
  const status = panel.querySelector("[role=status]");
  const list = panel.querySelector("ul");
  const notice = panel.querySelector(".retention-notice");
  let request = 0;
  let mutation = false;
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
