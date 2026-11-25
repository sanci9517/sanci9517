const FIELD_TYPES = Object.freeze([
  ["text", "Rövid szöveg"], ["email", "E-mail"], ["textarea", "Hosszú szöveg"],
  ["select", "Legördülő választás"], ["checkbox", "Jelölőnégyzet"]
]);
const clone = value => structuredClone(value);
const defaultDefinition = () => ({
  schemaVersion: 1, name: "Kapcsolat", fields: [
    { id: "email", type: "email", label: "E-mail-cím", required: true, maxLength: 254 },
    { id: "message", type: "textarea", label: "Üzenet", required: true, maxLength: 2_000 }
  ],
  consent: { text: "Az üzenet elküldésével hozzájárulok a megkeresésem kezeléséhez.", version: "privacy-v1" },
  successMessage: "Köszönöm, az üzenet megérkezett.", retentionDays: 30
});

async function requestJson(url, options = {}) {
  const response = await fetch(url, { credentials: "same-origin", cache: "no-store", ...options });
  const payload = await response.json().catch(() => null);
  if (!response.ok || payload?.ok !== true) throw new Error(payload?.error?.message || "Az űrlapkezelő most nem érhető el.");
  return payload.data;
}

function control(tag, label, value, { type = "text", maxLength = 240 } = {}) {
  const wrapper = document.createElement("label");
  wrapper.className = "form-inspector-field";
  const caption = document.createElement("span"); caption.textContent = label;
  const input = document.createElement(tag);
  input.setAttribute("aria-label", label);
  if (tag === "input") { input.type = type; input.maxLength = maxLength; }
  input.value = String(value ?? ""); wrapper.append(caption, input);
  return { wrapper, input };
}

export function renderFormsInspector(node, { onSelect = () => {} } = {}) {
  const root = document.createElement("section"); root.className = "forms-inspector";
  const heading = document.createElement("h3"); heading.textContent = "Űrlap és beküldések";
  const explanation = document.createElement("p");
  explanation.className = "content-field-help";
  explanation.textContent = "Az űrlap piszkozatának mentése és publikálása külön történik az oldal Save/Publish műveleteitől.";
  const status = document.createElement("p"); status.className = "form-inspector-status";
  status.setAttribute("role", "status"); status.setAttribute("aria-live", "polite");
  const selectorLabel = document.createElement("label"); selectorLabel.className = "form-inspector-field";
  const selectorCaption = document.createElement("span"); selectorCaption.textContent = "Hozzárendelt űrlap";
  const selector = document.createElement("select"); selector.setAttribute("aria-label", "Hozzárendelt űrlap");
  selectorLabel.append(selectorCaption, selector);
  const create = document.createElement("button"); create.type = "button"; create.textContent = "Új űrlap létrehozása";
  const editor = document.createElement("div"); editor.className = "form-inspector-editor";
  root.append(heading, explanation, selectorLabel, create, status, editor);

  let items = [];
  let selected = null;
  let expectedVersion = 0;
  let dirty = false;

  const announce = text => { status.textContent = text; };
  const jsonCall = (action, definition) => requestJson("/api/admin/forms", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, formId: selected.id, expectedVersion, definition })
  });
  const markDirty = () => { dirty = true; saveButton.disabled = !selected || selected.status === "archived"; publishButton.disabled = true; };
  const saveButton = document.createElement("button"); saveButton.type = "button"; saveButton.textContent = "Űrlap piszkozat mentése"; saveButton.disabled = true;
  const publishButton = document.createElement("button"); publishButton.type = "button"; publishButton.textContent = "Űrlap publikálása"; publishButton.disabled = true;
  const archiveButton = document.createElement("button"); archiveButton.type = "button"; archiveButton.textContent = "Űrlap archiválása"; archiveButton.disabled = true;

  function renderEditor() {
    editor.replaceChildren();
    saveButton.disabled = !selected || selected.status === "archived" || !dirty;
    publishButton.disabled = !selected || selected.status === "archived" || dirty || selected.publishedVersion === expectedVersion || !selected.definition.consent.privacyUrl;
    archiveButton.disabled = !selected || selected.status === "archived";
    if (!selected) {
      const hint = document.createElement("p"); hint.textContent = "Hozz létre új űrlapot, vagy válassz a listából. A Page Modelbe csak az űrlapazonosító kerül.";
      editor.append(hint); return;
    }
    const definition = selected.definition;
    const name = control("input", "Űrlap neve", definition.name, { maxLength: 100 });
    name.input.oninput = () => { definition.name = name.input.value; markDirty(); };
    editor.append(name.wrapper);
    const stateLine = document.createElement("p"); stateLine.textContent = `Állapot: ${selected.status} · piszkozat v${expectedVersion}` +
      (selected.publishedVersion ? ` · élő v${selected.publishedVersion}` : " · még nincs publikálva");
    editor.append(stateLine);
    const fieldHeading = document.createElement("h4"); fieldHeading.textContent = "Mezők"; editor.append(fieldHeading);
    definition.fields.forEach((field, index) => {
      const card = document.createElement("fieldset"); card.className = "form-inspector-field-card";
      const legend = document.createElement("legend"); legend.textContent = `Mező ${index + 1}`; card.append(legend);
      const idInput = control("input", "Belső mezőazonosító", field.id, { maxLength: 40 });
      idInput.input.onchange = () => { field.id = idInput.input.value.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "-").replace(/^[^a-z]+/, "field-").slice(0, 40); idInput.input.value = field.id; markDirty(); };
      const labelInput = control("input", "Mezőcímke", field.label, { maxLength: 120 });
      labelInput.input.oninput = () => { field.label = labelInput.input.value; markDirty(); };
      const typeLabel = document.createElement("label"); typeLabel.className = "form-inspector-field";
      const typeCaption = document.createElement("span"); typeCaption.textContent = "Mezőtípus";
      const type = document.createElement("select"); type.setAttribute("aria-label", "Mezőtípus");
      for (const [value, title] of FIELD_TYPES) { const option = document.createElement("option"); option.value = value; option.textContent = title; type.append(option); }
      type.value = field.type;
      type.onchange = () => { field.type = type.value; if (field.type === "select" && !field.options?.length) field.options = ["Első választás"]; if (field.type !== "select") delete field.options; renderEditor(); markDirty(); };
      typeLabel.append(typeCaption, type);
      const requiredLabel = document.createElement("label"); requiredLabel.className = "form-inspector-checkbox";
      const required = document.createElement("input"); required.type = "checkbox"; required.checked = field.required; required.setAttribute("aria-label", "Kötelező mező");
      required.onchange = () => { field.required = required.checked; markDirty(); };
      requiredLabel.append(required, document.createTextNode("Kötelező"));
      const helpInput = control("input", "Súgó a mezőhöz", field.helpText || "", { maxLength: 240 });
      helpInput.input.oninput = () => { field.helpText = helpInput.input.value; markDirty(); };
      const lengthInput = control("input", "Maximális karakterszám", field.maxLength ?? (field.type === "textarea" ? 2_000 : 500), { type: "number", maxLength: 4 });
      lengthInput.input.min = "1"; lengthInput.input.max = "4000";
      lengthInput.input.onchange = () => { field.maxLength = Math.max(1, Math.min(4_000, Number(lengthInput.input.value) || 500)); markDirty(); };
      card.append(idInput.wrapper, labelInput.wrapper, typeLabel, requiredLabel, helpInput.wrapper);
      if (field.type !== "checkbox" && field.type !== "select") card.append(lengthInput.wrapper);
      if (field.type === "select") {
        const optionsInput = control("textarea", "Választások (soronként egy)", (field.options || []).join("\n"), { maxLength: 2_400 });
        optionsInput.input.rows = 4;
        optionsInput.input.oninput = () => { field.options = optionsInput.input.value.split("\n").map(value => value.trim()).filter(Boolean).slice(0, 20); markDirty(); };
        card.append(optionsInput.wrapper);
      }
      const remove = document.createElement("button"); remove.type = "button"; remove.textContent = "Mező törlése"; remove.setAttribute("aria-label", `Mező törlése: ${field.label}`);
      remove.disabled = definition.fields.length <= 1;
      remove.onclick = () => { definition.fields.splice(index, 1); markDirty(); renderEditor(); };
      card.append(remove); editor.append(card);
    });
    const addField = document.createElement("button"); addField.type = "button"; addField.textContent = "Mező hozzáadása";
    addField.disabled = definition.fields.length >= 24;
    addField.onclick = () => { definition.fields.push({ id: `field-${definition.fields.length + 1}`, type: "text", label: "Új mező", required: false, maxLength: 500 }); markDirty(); renderEditor(); };
    editor.append(addField);
    const consent = control("textarea", "Adatkezelési hozzájárulás szövege", definition.consent.text, { maxLength: 2_000 });
    consent.input.rows = 4; consent.input.oninput = () => { definition.consent.text = consent.input.value; markDirty(); };
    const consentVersion = control("input", "Adatkezelési tájékoztató verziója", definition.consent.version, { maxLength: 64 });
    consentVersion.input.oninput = () => { definition.consent.version = consentVersion.input.value; markDirty(); };
    const privacyUrl = control("input", "Adatkezelési tájékoztató HTTPS hivatkozása", definition.consent.privacyUrl || "", { maxLength: 2_048 });
    privacyUrl.input.type = "url"; privacyUrl.input.oninput = () => { definition.consent.privacyUrl = privacyUrl.input.value; markDirty(); };
    if (!definition.consent.privacyUrl) {
      const privacyRequired = document.createElement("p"); privacyRequired.className = "form-inspector-status";
      privacyRequired.textContent = "Publikáláshoz add meg az adatkezelési tájékoztató HTTPS hivatkozását.";
      editor.append(privacyRequired);
    }
    const success = control("input", "Sikeres beküldés üzenete", definition.successMessage, { maxLength: 240 });
    success.input.oninput = () => { definition.successMessage = success.input.value; markDirty(); };
    const retention = control("input", "Beküldések megőrzése (nap)", definition.retentionDays, { type: "number", maxLength: 3 });
    retention.input.min = "1"; retention.input.max = "365";
    retention.input.onchange = () => { definition.retentionDays = Math.max(1, Math.min(365, Number(retention.input.value) || 30)); markDirty(); };
    const inbox = document.createElement("details"); inbox.className = "form-inspector-inbox";
    const inboxSummary = document.createElement("summary"); inboxSummary.textContent = "Beküldések kezelése";
    const inboxHelp = document.createElement("p"); inboxHelp.textContent = selected.publishedVersion
      ? "Csak a még megőrzött beküldések láthatók. A keresés és az állapotváltozás a webhely jogosultságai szerint történik."
      : "A beküldési lista csak az űrlap első publikálása után érhető el.";
    const inboxSearch = document.createElement("input"); inboxSearch.type = "search";
    inboxSearch.setAttribute("aria-label", "Beküldések keresése"); inboxSearch.maxLength = 100;
    const inboxSearchButton = document.createElement("button"); inboxSearchButton.type = "button"; inboxSearchButton.textContent = "Keresés";
    const inboxStatus = document.createElement("p"); inboxStatus.setAttribute("role", "status"); inboxStatus.setAttribute("aria-live", "polite");
    const inboxItems = document.createElement("div"); inboxItems.className = "form-inspector-inbox-items";
    const inboxMore = document.createElement("button"); inboxMore.type = "button"; inboxMore.textContent = "További beküldések"; inboxMore.hidden = true;
    let inboxCursor = null;
    let inboxBusy = false;
    const loadInbox = async (reset = true) => {
      if (!selected || !selected.publishedVersion || inboxBusy) return;
      inboxBusy = true; inboxSearchButton.disabled = true; inboxMore.disabled = true;
      inboxStatus.textContent = "Beküldések betöltése…";
      if (reset) { inboxCursor = null; inboxItems.replaceChildren(); }
      const params = new URLSearchParams({ submissions: selected.id, limit: "50" });
      if (inboxSearch.value.trim()) params.set("q", inboxSearch.value.trim());
      if (!reset && inboxCursor) params.set("before", inboxCursor);
      try {
        const result = await requestJson(`/api/admin/forms?${params}`);
        const entries = Array.isArray(result.items) ? result.items : [];
        for (const submission of entries) {
          const card = document.createElement("article"); card.className = "form-inspector-submission";
          const heading = document.createElement("h5");
          heading.textContent = `Beküldés · ${new Date(submission.receivedAt).toLocaleString("hu-HU")}`; card.append(heading);
          const values = submission.values && typeof submission.values === "object" ? submission.values : {};
          const list = document.createElement("dl");
          for (const field of definition.fields) {
            if (!Object.hasOwn(values, field.id)) continue;
            const term = document.createElement("dt"); term.textContent = field.label;
            const value = document.createElement("dd"); value.textContent = typeof values[field.id] === "boolean" ? (values[field.id] ? "Igen" : "Nem") : String(values[field.id] ?? "");
            list.append(term, value);
          }
          card.append(list);
          const consentText = document.createElement("p"); consentText.textContent = `Hozzájárulás rögzítve: ${submission.consentVersion} · ${new Date(submission.consentAcceptedAt).toLocaleString("hu-HU")}`; card.append(consentText);
          const statusLabel = document.createElement("label"); statusLabel.textContent = "Állapot";
          const statusSelect = document.createElement("select"); statusSelect.setAttribute("aria-label", "Beküldés állapota");
          for (const [value, label] of [["new", "Új"], ["reviewed", "Átnézve"], ["archived", "Archiválva"]]) {
            const option = document.createElement("option"); option.value = value; option.textContent = label; statusSelect.append(option);
          }
          statusSelect.value = submission.status;
          const statusSave = document.createElement("button"); statusSave.type = "button"; statusSave.textContent = "Állapot mentése";
          statusSave.disabled = submission.status === "archived";
          statusSave.onclick = async () => {
            statusSave.disabled = true;
            try {
              await requestJson("/api/admin/forms", { method: "PATCH", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ formId: selected.id, submissionId: submission.id, status: statusSelect.value }) });
              inboxStatus.textContent = "A beküldés állapota frissült."; await loadInbox();
            } catch (error) { inboxStatus.textContent = error.message; statusSave.disabled = false; }
          };
          statusLabel.append(statusSelect); card.append(statusLabel, statusSave); inboxItems.append(card);
        }
        inboxCursor = result.nextCursor || null;
        inboxMore.hidden = !inboxCursor;
        inboxStatus.textContent = entries.length ? `${entries.length} beküldés betöltve.` : "Nincs megjeleníthető beküldés.";
      } catch (error) { inboxStatus.textContent = error.message; }
      finally { inboxBusy = false; inboxSearchButton.disabled = !selected?.publishedVersion; inboxMore.disabled = !inboxCursor; }
    };
    inboxSearchButton.disabled = !selected.publishedVersion;
    inboxMore.hidden = true;
    inboxSearchButton.onclick = () => loadInbox(true);
    inboxSearch.onkeydown = event => { if (event.key === "Enter") { event.preventDefault(); loadInbox(true); } };
    inboxMore.onclick = () => loadInbox(false);
    inbox.append(inboxSummary, inboxHelp, inboxSearch, inboxSearchButton, inboxStatus, inboxItems, inboxMore);
    editor.append(consent.wrapper, consentVersion.wrapper, privacyUrl.wrapper, success.wrapper, retention.wrapper, saveButton, publishButton, archiveButton, inbox);
  }

  async function loadList(selectId = node.props?.formId || "") {
    const result = await requestJson("/api/admin/forms");
    items = Array.isArray(result) ? result : [];
    selector.replaceChildren();
    const empty = document.createElement("option"); empty.value = ""; empty.textContent = "Válassz űrlapot…"; selector.append(empty);
    for (const item of items) {
      const option = document.createElement("option"); option.value = item.id;
      option.textContent = `${item.name} · ${item.status}`;
      option.disabled = item.status === "archived";
      selector.append(option);
    }
    selector.value = items.some(item => item.id === selectId && item.status !== "archived") ? selectId : "";
    if (selector.value) await selectForm(selector.value);
    else { selected = null; renderEditor(); }
  }

  async function selectForm(id) {
    if (dirty && !confirm("Elveted a nem mentett űrlapmódosításokat?")) {
      selector.value = selected?.id || "";
      return;
    }
    if (!id) { selected = null; expectedVersion = 0; dirty = false; onSelect(""); renderEditor(); return; }
    const value = await requestJson(`/api/admin/forms?formId=${encodeURIComponent(id)}`);
    selected = { ...value, definition: clone(value.definition) };
    expectedVersion = Number(value.currentVersion);
    dirty = false;
    onSelect(id);
    renderEditor();
  }

  selector.onchange = () => selectForm(selector.value).catch(error => announce(error.message));
  create.onclick = async () => {
    if (dirty && !confirm("Elveted a nem mentett űrlapmódosításokat az új űrlap létrehozása előtt?")) return;
    create.disabled = true;
    try {
      const created = await requestJson("/api/admin/forms", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create", definition: defaultDefinition() }) });
      announce("Az űrlap piszkozatként létrejött. Az oldal külön mentése szükséges a hozzárendeléshez.");
      await loadList(created.id);
    } catch (error) { announce(error.message); }
    finally { create.disabled = false; }
  };
  saveButton.onclick = async () => {
    if (!selected || !dirty) return;
    saveButton.disabled = true;
    try {
      const saved = await jsonCall("save", selected.definition);
      expectedVersion = Number(saved.currentVersion); selected.currentVersion = expectedVersion; selected.status = saved.status; dirty = false;
      await loadList(selected.id);
      announce(`Űrlap piszkozat mentve: v${expectedVersion}. Az oldal Save és Publish továbbra külön művelet.`);
    } catch (error) { announce(error.message); saveButton.disabled = false; }
  };
  publishButton.onclick = async () => {
    if (!selected || dirty) return;
    if (!selected.definition.consent.privacyUrl) {
      announce("Publikálás előtt add meg az adatkezelési tájékoztató HTTPS hivatkozását."); return;
    }
    publishButton.disabled = true;
    try {
      const published = await requestJson("/api/admin/forms", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "publish", formId: selected.id, expectedVersion }) });
      selected.status = "published"; selected.publishedVersion = published.publishedVersion;
      announce(`Űrlap v${published.publishedVersion} publikálva. Az oldal saját Publish művelete még szükséges.`);
      await loadList(selected.id);
    } catch (error) { announce(error.message); publishButton.disabled = false; }
  };
  archiveButton.onclick = async () => {
    if (!selected || dirty || !confirm("Archiválod ezt az űrlapot? A publikált oldalak beküldése leáll.")) return;
    archiveButton.disabled = true;
    try {
      await requestJson("/api/admin/forms", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "archive", formId: selected.id, expectedVersion }) });
      announce("Az űrlap archiválva; új beküldés nem fogadható."); selected = null; await loadList("");
    } catch (error) { announce(error.message); archiveButton.disabled = false; }
  };

  renderEditor();
  loadList().catch(error => announce(error.message));
  return root;
}
