const $ = id => document.getElementById(id);
const inbox = $("inbox");
const formSelect = $("formSelect");
const searchInput = $("searchInput");
const list = $("submissions");
const status = $("status");
const pageStatus = $("pageStatus");
const previousButton = $("previousPage");
const nextButton = $("nextPage");
const refreshButton = $("refreshButton");
const STATUS_LABELS = { new: "Új", reviewed: "Átnézve", archived: "Archivált" };
const STATUS_ORDER = ["new", "reviewed", "archived"];
let forms = [];
let fieldLabels = new Map();
let cursors = [null];
let nextCursor = null;
let requestSequence = 0;
let searchTimer = 0;
let pending = false;

function message(text, kind = "info") {
  status.textContent = text;
  status.dataset.kind = kind;
}

async function request(url, options = {}) {
  const response = await fetch(url, {
    cache: "no-store",
    credentials: "same-origin",
    headers: { Accept: "application/json", ...(options.body ? { "Content-Type": "application/json" } : {}) },
    ...options
  });
  let body = {};
  try { body = await response.json(); } catch { /* a non-JSON error is handled below */ }
  if (!response.ok || body?.ok !== true) {
    const errorValue = body?.error?.message || body?.error?.code || body?.error || `HTTP ${response.status}`;
    throw new Error(typeof errorValue === "string" ? errorValue : JSON.stringify(errorValue));
  }
  return body.data;
}

function setBusy(value) {
  pending = value;
  inbox.setAttribute("aria-busy", String(value));
  list.setAttribute("aria-busy", String(value));
  formSelect.disabled = value || forms.length === 0;
  searchInput.disabled = value || !formSelect.value;
  refreshButton.disabled = value || !formSelect.value;
  previousButton.disabled = value || cursors.length < 2;
  nextButton.disabled = value || !nextCursor;
  for (const control of list.querySelectorAll(".row-actions select, .row-actions button")) control.disabled = value;
}

function option(label, value) {
  const item = document.createElement("option");
  item.value = value;
  item.textContent = label;
  return item;
}

function formatDate(value) {
  const raw = String(value || "");
  const date = new Date(raw.includes("T") ? raw : `${raw.replace(" ", "T")}Z`);
  return Number.isNaN(date.getTime()) ? raw : new Intl.DateTimeFormat("hu-HU", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function readable(value) {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  try { return JSON.stringify(value, null, 2); } catch { return "—"; }
}

function appendValue(container, key, value) {
  const item = document.createElement("div");
  item.className = "value";
  const label = document.createElement("dt");
  label.textContent = fieldLabels.get(key) || key;
  const content = document.createElement("dd");
  content.textContent = readable(value);
  item.append(label, content);
  container.append(item);
}

function createSubmission(item) {
  const article = document.createElement("article");
  article.className = "submission";
  article.dataset.submissionId = String(item.id || "");

  const header = document.createElement("div");
  header.className = "submission-head";
  const heading = document.createElement("h2");
  heading.textContent = `${fieldLabels.get("email") || "Beküldés"} · ${formatDate(item.receivedAt)}`;
  const actions = document.createElement("div");
  actions.className = "row-actions";

  const statusLabel = document.createElement("label");
  const statusId = `submission-status-${String(item.id).replace(/[^a-zA-Z0-9_-]/g, "")}`;
  statusLabel.htmlFor = statusId;
  statusLabel.textContent = "Állapot";
  const select = document.createElement("select");
  select.id = statusId;
  select.setAttribute("aria-label", `Beküldés állapota – ${formatDate(item.receivedAt)}`);
  for (const value of STATUS_ORDER) select.append(option(STATUS_LABELS[value], value));
  select.value = STATUS_LABELS[item.status] ? item.status : "new";
  select.addEventListener("change", () => updateStatus(item, select));

  const remove = document.createElement("button");
  remove.type = "button";
  remove.className = "button danger";
  remove.textContent = "Beküldés törlése";
  remove.setAttribute("aria-label", `Beküldés törlése – ${formatDate(item.receivedAt)}`);
  remove.addEventListener("click", () => deleteSubmission(item));
  actions.append(statusLabel, select, remove);
  header.append(heading, actions);
  article.append(header);

  const meta = document.createElement("div");
  meta.className = "meta";
  const version = document.createElement("span");
  version.textContent = `Séma: v${Number(item.formVersion) || 1}`;
  const page = document.createElement("span");
  page.textContent = `Állapot: ${STATUS_LABELS[item.status] || "Új"}`;
  meta.append(version, page);
  article.append(meta);

  const values = document.createElement("dl");
  values.className = "values";
  const entries = item.values && typeof item.values === "object" && !Array.isArray(item.values) ? Object.entries(item.values) : [];
  if (entries.length) for (const [key, value] of entries) appendValue(values, key, value);
  else appendValue(values, "Beküldött adatok", "Az adatok nem jeleníthetők meg.");
  article.append(values);

  if (item.consentAcceptedAt || item.consentText) {
    const details = document.createElement("details");
    details.className = "consent";
    const summary = document.createElement("summary");
    summary.textContent = `Hozzájárulás · v${Number(item.consentVersion) || 1}`;
    const consent = document.createElement("p");
    consent.textContent = item.consentText || "A hozzájárulási szöveg nem érhető el.";
    const accepted = document.createElement("p");
    accepted.textContent = `Elfogadva: ${formatDate(item.consentAcceptedAt)}`;
    details.append(summary, consent, accepted);
    article.append(details);
  }
  return article;
}

function renderItems(items) {
  list.replaceChildren();
  if (!items.length) {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = searchInput.value.trim() ? "Nincs a keresésnek megfelelő beküldés." : "Ehhez az űrlaphoz még nem érkezett beküldés.";
    list.append(empty);
    return;
  }
  for (const item of items) list.append(createSubmission(item));
}

async function loadForms() {
  setBusy(true);
  message("Űrlapok betöltése…");
  try {
    forms = await request("/api/admin/forms");
    forms = Array.isArray(forms) ? forms : [];
    formSelect.replaceChildren(option(forms.length ? "Válassz űrlapot" : "Nincs elérhető űrlap", ""));
    for (const form of forms) formSelect.append(option(`${form.name || "Névtelen űrlap"} · ${form.status === "published" ? "publikált" : form.status === "archived" ? "archivált" : "piszkozat"}`, form.id));
    formSelect.disabled = forms.length === 0;
    if (forms.length) {
      formSelect.value = forms[0].id;
      await loadFormDefinition(forms[0].id);
      await loadSubmissions(null);
    } else {
      message("Nincs elérhető űrlap.");
      renderItems([]);
    }
  } catch (cause) {
    forms = [];
    message(`Az űrlaplista nem tölthető be: ${cause.message}`, "error");
    renderItems([]);
  } finally {
    setBusy(false);
  }
}

async function loadFormDefinition(formId) {
  fieldLabels = new Map();
  const form = await request(`/api/admin/forms?formId=${encodeURIComponent(formId)}`);
  for (const field of form?.definition?.fields || []) {
    if (typeof field?.id === "string" && typeof field?.label === "string") fieldLabels.set(field.id, field.label);
  }
}

async function loadSubmissions(cursor) {
  if (!formSelect.value) return;
  const sequence = ++requestSequence;
  setBusy(true);
  message("Beküldések betöltése…");
  pageStatus.textContent = "";
  try {
    const params = new URLSearchParams({ submissions: formSelect.value, limit: "50" });
    const query = searchInput.value.trim();
    if (query) params.set("q", query);
    if (cursor) params.set("before", cursor);
    const data = await request(`/api/admin/forms?${params}`);
    if (sequence !== requestSequence) return;
    const items = Array.isArray(data?.items) ? data.items : [];
    nextCursor = typeof data?.nextCursor === "string" ? data.nextCursor : null;
    renderItems(items);
    message(items.length ? `${items.length} beküldés betöltve.` : "Nincs megjeleníthető beküldés.");
    pageStatus.textContent = `${cursors.length}. oldal · időrendben, legújabb elöl`;
  } catch (cause) {
    if (sequence !== requestSequence) return;
    renderItems([]);
    nextCursor = null;
    message(`A beküldések nem tölthetők be: ${cause.message}`, "error");
  } finally {
    if (sequence === requestSequence) setBusy(false);
  }
}

async function updateStatus(item, select) {
  if (pending) return;
  const oldStatus = item.status;
  const nextStatus = select.value;
  setBusy(true);
  try {
    await request("/api/admin/forms", { method: "PATCH", body: JSON.stringify({ formId: formSelect.value, submissionId: item.id, status: nextStatus }) });
    item.status = nextStatus;
    const article = select.closest(".submission");
    const statusValue = article?.querySelector(".meta span:last-child");
    if (statusValue) statusValue.textContent = `Állapot: ${STATUS_LABELS[nextStatus]}`;
    message("A beküldés állapota frissült.", "success");
  } catch (cause) {
    select.value = oldStatus;
    message(`Az állapot nem menthető: ${cause.message}`, "error");
  } finally {
    setBusy(false);
  }
}

async function deleteSubmission(item) {
  if (pending || !window.confirm("Biztosan végleg törlöd ezt az űrlapbeküldést? A művelet nem vonható vissza.")) return;
  setBusy(true);
  try {
    await request("/api/admin/forms", { method: "DELETE", body: JSON.stringify({ formId: formSelect.value, submissionId: item.id }) });
    if (cursors.length > 1 && list.querySelectorAll(".submission").length === 1) cursors.pop();
    await loadSubmissions(cursors.at(-1));
    message("A beküldés törölve.", "success");
  } catch (cause) {
    const reason = /FORBIDDEN|Admin role required/i.test(cause.message)
      ? "A beküldés törléséhez Admin jogosultság szükséges. Az üzenet változatlanul megmaradt."
      : `A beküldés nem törölhető: ${cause.message}`;
    message(reason, "error");
  } finally {
    setBusy(false);
  }
}

formSelect.addEventListener("change", async () => {
  if (!formSelect.value) return;
  cursors = [null];
  nextCursor = null;
  pageStatus.textContent = "";
  renderItems([]);
  setBusy(true);
  try {
    await loadFormDefinition(formSelect.value);
    await loadSubmissions(null);
  } catch (cause) {
    message(`Az űrlap adatai nem tölthetők be: ${cause.message}`, "error");
    setBusy(false);
  }
});
searchInput.addEventListener("input", () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => { cursors = [null]; nextCursor = null; loadSubmissions(null); }, 250);
});
refreshButton.addEventListener("click", () => loadSubmissions(cursors.at(-1)));
previousButton.addEventListener("click", () => {
  if (cursors.length < 2 || pending) return;
  cursors.pop();
  loadSubmissions(cursors.at(-1));
});
nextButton.addEventListener("click", () => {
  if (!nextCursor || pending) return;
  cursors.push(nextCursor);
  loadSubmissions(nextCursor);
});

loadForms();
