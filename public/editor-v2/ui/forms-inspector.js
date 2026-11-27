const FIELD_TYPES = Object.freeze([
  ["text", "Rövid szöveg"], ["email", "E-mail"], ["tel", "Telefonszám"], ["url", "Webcím"], ["number", "Szám"], ["textarea", "Hosszú szöveg"],
  ["select", "Legördülő választás"], ["radio", "Választógombok"], ["date", "Dátum"], ["checkbox", "Jelölőnégyzet"], ["slider", "Csúszka"]
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
  const preview = document.createElement("section"); preview.className = "form-inspector-preview"; preview.hidden = true;
  root.append(heading, explanation, selectorLabel, create, status, editor, preview);

  let items = [];
  let selected = null;
  let expectedVersion = 0;
  let dirty = false;

  const announce = text => { status.textContent = text; };
  const jsonCall = (action, definition) => requestJson("/api/admin/forms", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, formId: selected.id, expectedVersion, definition })
  });
  const markDirty = () => { dirty = true; saveButton.disabled = !selected || selected.status === "archived"; publishButton.disabled = true; renderPreview(); };
  const saveButton = document.createElement("button"); saveButton.type = "button"; saveButton.textContent = "Űrlap piszkozat mentése"; saveButton.disabled = true;
  const publishButton = document.createElement("button"); publishButton.type = "button"; publishButton.textContent = "Űrlap publikálása"; publishButton.disabled = true;
  const archiveButton = document.createElement("button"); archiveButton.type = "button"; archiveButton.textContent = "Űrlap archiválása"; archiveButton.disabled = true;

  function renderEditor() {
    editor.replaceChildren();
    renderPreview();
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
    const focusFieldControl = (fieldId, controlName) => {
      const card = Array.from(editor.querySelectorAll("fieldset[data-form-field-id]"))
        .find(candidate => candidate.dataset.formFieldId === fieldId);
      const target = Array.from(card?.querySelectorAll("[aria-label]") || [])
        .find(control => control.getAttribute("aria-label") === controlName);
      target?.focus();
    };
    const conditionValueInputs = new Map();
    const refreshConditionValueOptions = sourceId => {
      const source = definition.fields.find(candidate => candidate.id === sourceId);
      if (!source) return;
      for (const target of definition.fields) {
        if (target.condition?.fieldId !== sourceId) continue;
        const input = conditionValueInputs.get(target.id);
        if (!input) continue;
        const previous = target.condition.equals;
        input.replaceChildren();
        const choices = source.type === "checkbox" ? [["true", "Bejelölve"], ["false", "Nincs bejelölve"]] :
          (source.options || []).map(value => [value, value]);
        for (const [value, label] of choices) {
          const option = document.createElement("option"); option.value = value; option.textContent = label; input.append(option);
        }
        if (!choices.some(([value]) => String(value) === String(previous))) {
          const invalid = document.createElement("option"); invalid.value = String(previous); invalid.textContent = "Korábbi választás — válassz érvényes értéket"; input.append(invalid);
        }
        input.value = String(previous);
      }
    };
    definition.fields.forEach((field, index) => {
      const card = document.createElement("fieldset"); card.className = "form-inspector-field-card";
      card.dataset.formFieldId = field.id;
      const legend = document.createElement("legend"); legend.textContent = `Mező ${index + 1}`; card.append(legend);
      const idInput = control("input", "Belső mezőazonosító", field.id, { maxLength: 40 });
      idInput.input.onchange = () => {
        const previousId = field.id;
        field.id = idInput.input.value.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "-").replace(/^[^a-z]+/, "field-").slice(0, 40);
        idInput.input.value = field.id; card.dataset.formFieldId = field.id;
        for (const candidate of definition.fields) if (candidate.condition?.fieldId === previousId) candidate.condition.fieldId = field.id;
        markDirty();
      };
      const labelInput = control("input", "Mezőcímke", field.label, { maxLength: 120 });
      labelInput.input.oninput = () => { field.label = labelInput.input.value; markDirty(); };
      const typeLabel = document.createElement("label"); typeLabel.className = "form-inspector-field";
      const typeCaption = document.createElement("span"); typeCaption.textContent = "Mezőtípus";
      const type = document.createElement("select"); type.setAttribute("aria-label", "Mezőtípus");
      for (const [value, title] of FIELD_TYPES) { const option = document.createElement("option"); option.value = value; option.textContent = title; type.append(option); }
      type.value = field.type;
      type.onchange = () => {
        const focusFieldId = field.id;
        const previousType = field.type;
        field.type = type.value;
        if (field.type === "slider") {
          definition.schemaVersion = 3;
          field.min ??= 0; field.max ??= 100; field.step ??= 1;
        } else if (previousType === "slider") {
          delete field.min; delete field.max; delete field.step;
        }
        if (previousType !== field.type) {
          const dependent = definition.fields.filter(candidate => candidate.condition?.fieldId === field.id);
          for (const candidate of dependent) delete candidate.condition;
          if (dependent.length) announce("A feltétel forrásának típusa megváltozott; az érintett mezők feltételeit újra be kell állítani.");
        }
        if ((field.type === "select" || field.type === "radio") && !field.options?.length) field.options = ["Első választás"];
        if (field.type !== "select" && field.type !== "radio") delete field.options;
        if (["text", "email", "tel", "url", "textarea"].includes(field.type)) {
          const limit = field.type === "url" ? 2_048 : field.type === "tel" ? 40 : 4_000;
          const fallback = field.type === "url" ? 2_048 : field.type === "textarea" ? 2_000 : field.type === "email" ? 254 : field.type === "tel" ? 40 : 500;
          field.maxLength = Math.max(1, Math.min(limit, field.maxLength ?? fallback));
        } else delete field.maxLength;
        renderEditor(); markDirty(); focusFieldControl(focusFieldId, "Mezőtípus");
      };
      typeLabel.append(typeCaption, type);
      const requiredLabel = document.createElement("label"); requiredLabel.className = "form-inspector-checkbox";
      const required = document.createElement("input"); required.type = "checkbox"; required.checked = field.required; required.setAttribute("aria-label", "Kötelező mező");
      required.onchange = () => { field.required = required.checked; markDirty(); };
      requiredLabel.append(required, document.createTextNode("Kötelező"));
      const helpInput = control("input", "Súgó a mezőhöz", field.helpText || "", { maxLength: 240 });
      helpInput.input.oninput = () => { field.helpText = helpInput.input.value; markDirty(); };
      const lengthInput = control("input", "Maximális karakterszám", field.maxLength ?? (field.type === "textarea" ? 2_000 : field.type === "url" ? 2_048 : field.type === "tel" ? 40 : 500), { type: "number", maxLength: 4 });
      lengthInput.input.min = "1"; lengthInput.input.max = field.type === "url" ? "2048" : field.type === "tel" ? "40" : "4000";
      lengthInput.input.onchange = () => { const limit = field.type === "url" ? 2_048 : field.type === "tel" ? 40 : 4_000; field.maxLength = Math.max(1, Math.min(limit, Number(lengthInput.input.value) || 500)); markDirty(); };
      card.append(idInput.wrapper, labelInput.wrapper, typeLabel, requiredLabel, helpInput.wrapper);
      if (["text", "email", "tel", "url", "textarea"].includes(field.type)) card.append(lengthInput.wrapper);
      if (field.type === "select" || field.type === "radio") {
        const optionsInput = control("textarea", "Választások (soronként egy)", (field.options || []).join("\n"), { maxLength: 2_400 });
        optionsInput.input.rows = 4;
        optionsInput.input.oninput = () => { field.options = optionsInput.input.value.split("\n").map(value => value.trim()).filter(Boolean).slice(0, 20); refreshConditionValueOptions(field.id); markDirty(); };
        card.append(optionsInput.wrapper);
      }
      if (field.type === "slider") {
        const minInput = control("input", "Csúszka minimumértéke", field.min ?? 0, { type: "number", maxLength: 16 });
        const maxInput = control("input", "Csúszka maximumértéke", field.max ?? 100, { type: "number", maxLength: 16 });
        const stepInput = control("input", "Csúszka lépésköze", field.step ?? 1, { type: "number", maxLength: 16 });
        for (const input of [minInput.input, maxInput.input, stepInput.input]) input.step = "any";
        minInput.input.onchange = () => { field.min = Number(minInput.input.value); markDirty(); };
        maxInput.input.onchange = () => { field.max = Number(maxInput.input.value); markDirty(); };
        stepInput.input.onchange = () => { field.step = Number(stepInput.input.value); markDirty(); };
        card.append(minInput.wrapper, maxInput.wrapper, stepInput.wrapper);
      }
      const conditionLabel = document.createElement("label"); conditionLabel.className = "form-inspector-field";
      const conditionCaption = document.createElement("span"); conditionCaption.textContent = "Feltételes megjelenítés";
      const conditionSource = document.createElement("select"); conditionSource.setAttribute("aria-label", "Feltétel forrása");
      const noCondition = document.createElement("option"); noCondition.value = ""; noCondition.textContent = "Mindig látható"; conditionSource.append(noCondition);
      const conditionSources = definition.fields.filter(candidate => candidate.id !== field.id && !candidate.condition && ["select", "radio", "checkbox"].includes(candidate.type));
      for (const candidate of conditionSources) {
        const option = document.createElement("option"); option.value = candidate.id; option.textContent = `${candidate.label} (${candidate.id})`; conditionSource.append(option);
      }
      if (field.condition && !conditionSources.some(candidate => candidate.id === field.condition.fieldId)) {
        const invalid = document.createElement("option"); invalid.value = field.condition.fieldId; invalid.textContent = "Érvénytelen forrás — válassz újat"; conditionSource.append(invalid);
      }
      conditionSource.value = field.condition?.fieldId || "";
      const conditionValue = document.createElement("select"); conditionValue.setAttribute("aria-label", "Feltétel értéke");
      const renderConditionValue = () => {
        conditionValue.replaceChildren();
        const source = definition.fields.find(candidate => candidate.id === conditionSource.value);
        if (!source) { conditionValue.disabled = true; return; }
        conditionValue.disabled = false;
        const choices = source.type === "checkbox" ? [["true", "Bejelölve"], ["false", "Nincs bejelölve"]] :
          (source.options || []).map(value => [value, value]);
        for (const [value, label] of choices) {
          const option = document.createElement("option"); option.value = value; option.textContent = label; conditionValue.append(option);
        }
        const current = field.condition?.fieldId === source.id ? field.condition.equals : (source.type === "checkbox" ? true : source.options?.[0]);
        if (current !== undefined && !choices.some(([value]) => String(value) === String(current))) {
          const invalid = document.createElement("option"); invalid.value = String(current); invalid.textContent = "Korábbi választás — válassz érvényes értéket"; conditionValue.append(invalid);
        }
        if (current !== undefined) conditionValue.value = String(current);
      };
      conditionValueInputs.set(field.id, conditionValue);
      conditionSource.onchange = () => {
        if (!conditionSource.value) delete field.condition;
        else {
          const source = definition.fields.find(candidate => candidate.id === conditionSource.value);
          if (source) {
            if (definition.schemaVersion < 2) definition.schemaVersion = 2;
            field.condition = { fieldId: source.id, equals: source.type === "checkbox" ? true : (source.options?.[0] || "") };
          }
        }
        markDirty(); renderEditor(); focusFieldControl(field.id, "Feltétel forrása");
      };
      conditionValue.onchange = () => {
        const source = definition.fields.find(candidate => candidate.id === conditionSource.value);
        if (!source) return;
        field.condition = { fieldId: source.id, equals: source.type === "checkbox" ? conditionValue.value === "true" : conditionValue.value };
        if (definition.schemaVersion < 2) definition.schemaVersion = 2; markDirty();
      };
      renderConditionValue();
      conditionLabel.append(conditionCaption, conditionSource, conditionValue);
      const conditionHelp = document.createElement("small"); conditionHelp.className = "form-inspector-preview-notice";
      conditionHelp.textContent = "Csak a saját űrlap egy nem feltételes választó- vagy jelölőmezője lehet forrás. A rejtett mező értéke nem küldhető be.";
      card.append(conditionLabel, conditionHelp);
      const remove = document.createElement("button"); remove.type = "button"; remove.textContent = "Mező törlése"; remove.setAttribute("aria-label", `Mező törlése: ${field.label}`);
      remove.disabled = definition.fields.length <= 1;
      const orderActions = document.createElement("div"); orderActions.className = "form-inspector-field-order-actions";
      const moveUp = document.createElement("button"); moveUp.type = "button"; moveUp.textContent = "↑";
      moveUp.setAttribute("aria-label", `Mező feljebb: ${field.label}`); moveUp.title = "Mező feljebb"; moveUp.disabled = index === 0;
      moveUp.onclick = () => {
        const from = definition.fields.indexOf(field);
        if (from <= 0) return;
        definition.fields.splice(from - 1, 0, definition.fields.splice(from, 1)[0]);
        markDirty(); renderEditor(); focusFieldControl(field.id, from === 1 ? `Mező lejjebb: ${field.label}` : `Mező feljebb: ${field.label}`);
      };
      const moveDown = document.createElement("button"); moveDown.type = "button"; moveDown.textContent = "↓";
      moveDown.setAttribute("aria-label", `Mező lejjebb: ${field.label}`); moveDown.title = "Mező lejjebb"; moveDown.disabled = index === definition.fields.length - 1;
      moveDown.onclick = () => {
        const from = definition.fields.indexOf(field);
        if (from < 0 || from >= definition.fields.length - 1) return;
        definition.fields.splice(from + 1, 0, definition.fields.splice(from, 1)[0]);
        markDirty(); renderEditor(); focusFieldControl(field.id, from === definition.fields.length - 2 ? `Mező feljebb: ${field.label}` : `Mező lejjebb: ${field.label}`);
      };
      orderActions.append(moveUp, moveDown);
      remove.onclick = () => {
        const dependent = definition.fields.filter(candidate => candidate.condition?.fieldId === field.id);
        for (const candidate of dependent) delete candidate.condition;
        definition.fields.splice(index, 1); markDirty(); renderEditor();
        if (dependent.length) announce("A törölt feltételforrás miatt az érintett feltételes mezők feltételei törlődtek.");
        const focusTarget = definition.fields[Math.min(index, definition.fields.length - 1)];
        if (focusTarget) focusFieldControl(focusTarget.id, "Mezőcímke");
      };
      card.append(orderActions, remove); editor.append(card);
    });
    const addField = document.createElement("button"); addField.type = "button"; addField.textContent = "Mező hozzáadása";
    addField.disabled = definition.fields.length >= 24;
    addField.onclick = () => {
      const existingIds = new Set(definition.fields.map(field => field.id));
      let suffix = definition.fields.length + 1;
      while (existingIds.has(`field-${suffix}`)) suffix += 1;
      const field = { id: `field-${suffix}`, type: "text", label: "Új mező", required: false, maxLength: 500 };
      definition.fields.push(field); markDirty(); renderEditor(); focusFieldControl(field.id, "Mezőcímke");
    };
    editor.append(addField);
    renderPreview();
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

  function renderPreview() {
    preview.replaceChildren();
    preview.hidden = !selected;
    if (!selected) return;

    const title = document.createElement("h4"); title.textContent = "Űrlap előnézete";
    const notice = document.createElement("p");
    notice.className = "form-inspector-preview-notice";
    notice.textContent = "Csak megjelenítés. Az előnézet nem küld adatot és nem publikál.";
    const name = document.createElement("p");
    name.className = "form-inspector-preview-name";
    name.textContent = String(selected.definition?.name || "Űrlap");
    const fields = document.createElement("fieldset");
    fields.className = "form-inspector-preview-fields";
    fields.disabled = true;
    const legend = document.createElement("legend"); legend.textContent = "Mezők"; fields.append(legend);

    const previewFields = Array.isArray(selected.definition?.fields) ? selected.definition.fields.slice(0, 24) : [];
    for (const [index, field] of previewFields.entries()) {
      if (!field || typeof field !== "object" || Array.isArray(field)) continue;
      const label = String(field.label || "Mező");
      const wrapper = document.createElement("div"); wrapper.className = "form-inspector-preview-field";
    const conditionSource = field.condition ? previewFields.find(candidate => candidate?.id === field.condition.fieldId) : null;
    const conditionLabel = field.condition ? ` · Csak akkor jelenik meg: ${String(conditionSource?.label || field.condition.fieldId)} = ${String(field.condition.equals)}` : "";
    const caption = document.createElement("span"); caption.textContent = `${label}${field.required === true ? " · Kötelező" : ""}${conditionLabel}`;
      wrapper.append(caption);
      const type = String(field.type || "text");
      const maxLength = Number.isInteger(field.maxLength) ? Math.max(1, Math.min(4000, field.maxLength)) : 500;
      if (type === "textarea") {
        const control = document.createElement("textarea"); control.rows = 3; control.maxLength = maxLength;
        control.setAttribute("aria-label", label); control.placeholder = label; wrapper.append(control);
      } else if (type === "select") {
        const control = document.createElement("select"); control.setAttribute("aria-label", label);
        const placeholder = document.createElement("option"); placeholder.value = ""; placeholder.textContent = "Válassz…"; control.append(placeholder);
        for (const [optionIndex, value] of (Array.isArray(field.options) ? field.options : []).slice(0, 20).entries()) {
          const option = document.createElement("option"); option.value = String(optionIndex); option.textContent = String(value); control.append(option);
        }
        wrapper.append(control);
      } else if (type === "radio") {
        const choices = document.createElement("fieldset"); choices.className = "form-inspector-preview-choices";
        const choiceLegend = document.createElement("legend"); choiceLegend.textContent = label; choices.append(choiceLegend);
        for (const [optionIndex, value] of (Array.isArray(field.options) ? field.options : []).slice(0, 20).entries()) {
          const choiceLabel = document.createElement("label");
          const control = document.createElement("input"); control.type = "radio"; control.name = `form-preview-${index}`; control.value = String(optionIndex);
          control.setAttribute("aria-label", `${label}: ${String(value)}`);
          choiceLabel.append(control, document.createTextNode(String(value))); choices.append(choiceLabel);
        }
        wrapper.append(choices);
      } else {
        const control = document.createElement("input");
        control.type = ({ email: "email", tel: "tel", url: "url", number: "number", date: "date", checkbox: "checkbox", slider: "range" })[type] || "text";
        control.setAttribute("aria-label", label);
        if (type === "slider") {
          control.min = String(field.min ?? 0); control.max = String(field.max ?? 100); control.step = String(field.step ?? 1);
          control.value = String((Number(field.min ?? 0) + Number(field.max ?? 100)) / 2);
        }
        if (control.type !== "checkbox" && type !== "slider") { control.maxLength = maxLength; control.placeholder = label; }
        wrapper.append(control);
      }
      if (field.helpText) { const help = document.createElement("small"); help.textContent = String(field.helpText); wrapper.append(help); }
      fields.append(wrapper);
    }

    const consent = document.createElement("p"); consent.className = "form-inspector-preview-consent";
    consent.textContent = String(selected.definition?.consent?.text || "");
    const submit = document.createElement("button"); submit.type = "button"; submit.disabled = true; submit.textContent = "Beküldés (inaktív előnézet)";
    preview.append(title, notice, name, fields);
    if (consent.textContent) preview.append(consent);
    preview.append(submit);
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
