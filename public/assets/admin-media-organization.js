const labels = { folder: "Mappa", tag: "Címke", collection: "Gyűjtemény" };

function makeSelect(labelText, multiple = false) {
  const label = document.createElement("label");
  label.className = "media-organization-field";
  label.append(document.createTextNode(labelText));
  const select = document.createElement("select");
  select.multiple = multiple;
  select.setAttribute("aria-label", labelText);
  label.append(select);
  return { label, select };
}

function option(value, text, selected = false) {
  const item = document.createElement("option");
  item.value = value;
  item.textContent = text;
  item.selected = selected;
  return item;
}

export function mountMediaOrganization({ api, onChanged }) {
  const panel = document.getElementById("mediaOrganization");
  const folderFilter = document.getElementById("mediaFolderFilter");
  const tagFilter = document.getElementById("mediaTagFilter");
  const collectionFilter = document.getElementById("mediaCollectionFilter");
  const form = document.getElementById("mediaOrganizationForm");
  const itemsList = document.getElementById("mediaOrganizationItems");
  const status = document.getElementById("mediaOrganizationStatus");
  const state = { folders: [], tags: [], collections: [] };
  let loading = false;

  function fill(select, items, emptyLabel, selected = "") {
    const options = [option("", emptyLabel, !selected), ...items.map(item => option(item.id, item.name, item.id === selected))];
    select.replaceChildren(...options);
  }

  function updateFilters() {
    fill(folderFilter, state.folders, "Minden mappa");
    folderFilter.add(option("root", "Gyökér · mappa nélkül"));
    fill(tagFilter, state.tags, "Minden címke");
    fill(collectionFilter, state.collections, "Minden gyűjtemény");
  }

  function renderItems() {
    const rows = [];
    for (const kind of Object.keys(labels)) for (const item of state[kind + "s"]) {
      const row = document.createElement("li"); row.className = "media-organization-item";
      const title = document.createElement("span");
      title.textContent = `${labels[kind]} · ${item.name} · ${item.asset_count || 0} médiafájl`;
      const rename = document.createElement("button"); rename.type = "button"; rename.textContent = "Átnevezés";
      rename.setAttribute("aria-label", `${labels[kind]} átnevezése: ${item.name}`);
      const remove = document.createElement("button"); remove.type = "button"; remove.textContent = "Törlés";
      remove.setAttribute("aria-label", `${labels[kind]} törlése: ${item.name}`);
      rename.addEventListener("click", () => {
        const editor = document.createElement("form");
        const name = document.createElement("input"); name.maxLength = 80; name.required = true; name.value = item.name;
        name.setAttribute("aria-label", `${labels[kind]} új neve: ${item.name}`);
        const save = document.createElement("button"); save.type = "submit"; save.textContent = "Név mentése";
        const cancel = document.createElement("button"); cancel.type = "button"; cancel.textContent = "Mégse";
        cancel.addEventListener("click", () => renderItems());
        editor.addEventListener("submit", async event => {
          event.preventDefault(); save.disabled = true;
          try {
            await api("/api/admin/media?organization=1", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kind, id: item.id, name: name.value }) });
            await reload(); await onChanged();
            status.textContent = `${labels[kind]} átnevezve.`; status.dataset.kind = "ok";
          } catch (error) { status.textContent = error instanceof Error ? error.message : "Az átnevezés sikertelen."; status.dataset.kind = "error"; save.disabled = false; }
        });
        editor.append(name, save, cancel); row.replaceChildren(editor); name.focus();
      });
      let armed = false;
      remove.addEventListener("click", async () => {
        if (!armed) {
          armed = true; remove.textContent = "Törlés megerősítése"; remove.dataset.confirm = "true";
          const warning = document.createElement("p"); warning.className = "media-organization-warning";
          warning.textContent = kind === "folder" ? "A fájlok a gyökérmappába kerülnek; az R2-ben lévő fájlok megmaradnak." : "Csak a címke/gyűjtemény-tagság törlődik; az R2-ben lévő fájlok megmaradnak.";
          row.append(warning); remove.focus(); return;
        }
        remove.disabled = true;
        const query = new URLSearchParams({ organization: "1", kind, id: item.id });
        try {
          await api("/api/admin/media?" + query, { method: "DELETE" });
          await reload(); await onChanged();
          status.textContent = `${labels[kind]} törölve; a fájlok megmaradtak.`; status.dataset.kind = "ok";
        } catch (error) { status.textContent = error instanceof Error ? error.message : "A törlés sikertelen."; status.dataset.kind = "error"; remove.disabled = false; }
      });
      row.append(title, rename, remove); rows.push(row);
    }
    itemsList.replaceChildren(...rows);
  }

  async function reload({ preserveFilters = true } = {}) {
    if (loading) return;
    loading = true;
    const selected = preserveFilters ? [folderFilter.value, tagFilter.value, collectionFilter.value] : ["", "", ""];
    try {
      const result = await api("/api/admin/media?organization=1");
      for (const key of Object.keys(state)) state[key] = Array.isArray(result[key]) ? result[key] : [];
      updateFilters();
      renderItems();
      [folderFilter, tagFilter, collectionFilter].forEach((control, index) => {
        if (selected[index] && [...control.options].some(item => item.value === selected[index])) control.value = selected[index];
      });
      status.textContent = "Mappák, címkék és gyűjtemények betöltve.";
      status.dataset.kind = "ok";
    } catch (error) {
      status.textContent = error instanceof Error ? error.message : "A médiatár rendezési adatai nem tölthetők be.";
      status.dataset.kind = "error";
      throw error;
    } finally {
      loading = false;
    }
  }

  for (const filter of [folderFilter, tagFilter, collectionFilter]) filter.addEventListener("change", onChanged);
  form.addEventListener("submit", async event => {
    event.preventDefault();
    const kind = form.elements.namedItem("kind").value;
    const name = form.elements.namedItem("name").value;
    const button = form.querySelector("button[type=submit]");
    button.disabled = true;
    try {
      await api("/api/admin/media?organization=1", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kind, name })
      });
      form.reset();
      await reload();
      status.textContent = `${labels[kind]} létrehozva.`;
      status.dataset.kind = "ok";
      onChanged();
    } catch (error) {
      status.textContent = error instanceof Error ? error.message : "A rendezési elem létrehozása sikertelen.";
      status.dataset.kind = "error";
    } finally { button.disabled = false; }
  });

  return {
    state,
    reload,
    filters() {
      return { folderId: folderFilter.value, tagId: tagFilter.value, collectionId: collectionFilter.value };
    }
  };
}

export function appendAssetOrganization(details, asset, groups, api, onChanged) {
  const section = document.createElement("section");
  section.className = "media-organization-controls";
  section.setAttribute("aria-label", asset.name + " rendezése");
  const folder = makeSelect(asset.name + " mappája");
  folder.select.append(option("", "Gyökér", !asset.folderId), ...groups.folders.map(item => option(item.id, item.name, item.id === asset.folderId)));
  folder.select.addEventListener("change", async () => {
    folder.select.disabled = true;
    try { await api("/api/admin/media?id=" + encodeURIComponent(asset.id), { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ folderId: folder.select.value || null }) }); onChanged(); }
    catch (error) { folder.select.value = asset.folderId || ""; sectionStatus.textContent = error.message; sectionStatus.dataset.kind = "error"; }
    finally { folder.select.disabled = false; }
  });

  const tags = makeSelect(asset.name + " címkéi", true);
  tags.select.size = Math.min(4, Math.max(2, groups.tags.length));
  tags.select.append(...groups.tags.map(item => option(item.id, item.name, (asset.tagIds || []).includes(item.id))));
  const saveTags = document.createElement("button"); saveTags.type = "button"; saveTags.textContent = "Címkék mentése";
  saveTags.addEventListener("click", () => saveSet(tags.select, "tagIds", saveTags));

  const collections = makeSelect(asset.name + " gyűjteményei", true);
  collections.select.size = Math.min(4, Math.max(2, groups.collections.length));
  collections.select.append(...groups.collections.map(item => option(item.id, item.name, (asset.collectionIds || []).includes(item.id))));
  const saveCollections = document.createElement("button"); saveCollections.type = "button"; saveCollections.textContent = "Gyűjtemények mentése";
  saveCollections.addEventListener("click", () => saveSet(collections.select, "collectionIds", saveCollections));

  const sectionStatus = document.createElement("small"); sectionStatus.setAttribute("role", "status");
  async function saveSet(select, field, button) {
    button.disabled = true;
    try { await api("/api/admin/media?id=" + encodeURIComponent(asset.id), { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ [field]: [...select.selectedOptions].map(item => item.value) }) }); sectionStatus.textContent = "Mentve."; sectionStatus.dataset.kind = "ok"; onChanged(); }
    catch (error) { sectionStatus.textContent = error instanceof Error ? error.message : "A módosítás mentése sikertelen."; sectionStatus.dataset.kind = "error"; }
    finally { button.disabled = false; }
  }
  section.append(folder.label, tags.label, saveTags, collections.label, saveCollections, sectionStatus);
  details.append(section);
}
