import { mountRetentionStatus } from "./admin-media-retention.js";
import { mountRetentionRequest } from "./admin-media-retention-actions.js";
import { mountMediaIntegrity } from "./admin-media-integrity.js";
let retentionStatus;

const form = document.getElementById("uploadForm");
const input = document.getElementById("imageInput");
const button = document.getElementById("uploadButton");
const status = document.getElementById("uploadStatus");
const gallery = document.getElementById("gallery");
const search = document.getElementById("mediaSearch");
const searchClear = document.getElementById("mediaSearchClear");
const mediaState = document.getElementById("mediaState");
const mediaLoadMore = document.getElementById("mediaLoadMore");
const mediaListStatus = document.getElementById("mediaListStatus");
let currentListRequest = 0;
let nextMediaCursor = null;
let shownMediaCount = 0;
const quotaSummary = document.getElementById("mediaQuotaSummary");
const quotaDetails = document.getElementById("mediaQuotaDetails");
const quotaProgress = document.getElementById("mediaQuotaProgress");
const sizeFormat = new Intl.NumberFormat("hu-HU", { maximumFractionDigits: 1 });
function readableBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes < 0) return "ismeretlen";
  return sizeFormat.format(bytes / (1024 * 1024)) + " MiB";
}
function renderQuota(data) {
  const quota = data?.quota;
  const limit = data?.siteQuotaBytes;
  if (!quota || !Number.isSafeInteger(limit) || limit <= 0 ||
      !["usedBytes","activeBytes","archivedBytes","remainingBytes"].every(key =>
        Number.isSafeInteger(quota[key]) && quota[key] >= 0)) {
    quotaSummary.textContent = "A tárhelyadatok nem érhetők el.";
    quotaDetails.textContent = "";
    quotaProgress.hidden = true;
    return;
  }
  quotaSummary.textContent = "Felhasznált: " + readableBytes(quota.usedBytes) +
    " / " + readableBytes(limit);
  quotaDetails.textContent = "Aktív: " + readableBytes(quota.activeBytes) +
    " · Archivált: " + readableBytes(quota.archivedBytes) +
    " · Szabad: " + readableBytes(quota.remainingBytes) +
    ". Az archivált médiafájlok is foglalják a tárhelyet.";
  // Reject internally inconsistent responses rather than displaying a false
  // reassuring figure when the database/API is partially unavailable.
  if (quota.activeBytes + quota.archivedBytes !== quota.usedBytes ||
      quota.remainingBytes !== Math.max(0, limit - quota.usedBytes)) {
    quotaSummary.textContent = "A tárhelyadatok nem egyeznek. Frissítsd az oldalt.";
    quotaDetails.textContent = "";
    quotaProgress.hidden = true;
    return;
  }
  quotaProgress.value = Math.min(100, 100 * quota.usedBytes / limit);
  quotaProgress.hidden = false;
}
const supported = new Set(["image/png", "image/jpeg", "image/gif", "image/webp", "audio/mpeg", "audio/ogg", "audio/wav", "video/webm"]);
const maxBytes = 4 * 1024 * 1024;
const progress = document.getElementById("uploadProgress");
const cancel = document.getElementById("uploadCancel");
const retry = document.getElementById("uploadRetry");
let activeUpload = null;

function feedback(message, kind = "") {
  status.textContent = message;
  status.dataset.kind = kind;
}
function explain(code) {
  const messages = {
    UNAUTHORIZED: "A munkamenet lejárt. Jelentkezz be újra.",
    SITE_ACCESS_DENIED: "Nincs jogosultságod a médiatárhoz.",
    FORBIDDEN: "A feltöltés szerkesztői jogosultságot igényel.",
    MEDIA_TYPE_UNSUPPORTED: "Ez a fájlformátum nem támogatott.",
    MEDIA_TYPE_MISMATCH: "A fájl tartalma nem egyezik a megadott típussal.",
    MEDIA_SIZE_INVALID: "A médiafájl túl nagy vagy üres.",
    MEDIA_QUOTA_EXCEEDED: "A webhely 5 GB-os médiakerete megtelt.",
    MEDIA_STORAGE_FAILED: "A tárhely jelenleg nem elérhető.",
    MEDIA_METADATA_FAILED: "A fájl adatainak mentése nem sikerült.",
    MEDIA_STORAGE_UNAVAILABLE: "A médiatároló nincs bekötve.",
    MEDIA_ARCHIVED_EXISTS: "Ez a médiafájl már archiválva van. Az Archivált nézetben állíthatod vissza.",
    MEDIA_ASSET_IN_USE: "A médiafájlra oldal vagy korábbi verzió hivatkozik. Nézd meg a Használati helyeket.",
    MEDIA_USAGE_INCOMPLETE: "A használati helyek ellenőrzése nem teljes, az archiválás biztonságból leállt.",
    MEDIA_ARCHIVE_CONFLICT: "A médiafájl állapota megváltozott. Frissítsd a listát.",
    MEDIA_OBJECT_MISSING: "A tárolt médiafájl hiányzik. Nem lehet visszaállítani.",
    RETENTION_MIGRATION_NOT_ACTIVE: "Az adatmegőrzési kérelmek jelenleg nem érhetők el. Próbáld újra később.",
    RETENTION_PRECONDITION_CHANGED: "Az előfeltételek megváltoztak. Friss ellenőrzés szükséges.",
    RETENTION_STATE_CONFLICT: "A kérelem állapota megváltozott. Frissítsd az állapotot.",
    RETENTION_REQUEST_NOT_FOUND: "A kérelem már nem érhető el ezen a webhelyen.",
    INVALID_TRANSITION: "Ez a kérelem ebben az állapotban nem vonható vissza.",
    INVALID_ORIGIN: "A művelet csak az eredeti adminoldalról indítható. Frissítsd az oldalt.",
    ASSET_IN_USE: "Oldal vagy korábbi verzió hivatkozik a fájlra. Nézd meg a Használati helyeket.",
    ASSET_NOT_ARCHIVED: "A fájl már nincs archiválva. Frissítsd a médiatárat.",
    USAGE_INCOMPLETE: "A használati helyek ellenőrzése nem teljes. Új ellenőrzés szükséges.",
    OBJECT_UNAVAILABLE: "A tárolt fájl nem érhető el.",
    INVALID_MEDIA_STATE: "Érvénytelen Médiatár nézet."
  };
  return messages[code] || "A kérés sikertelen. Próbáld újra.";
}
async function api(url, options = {}) {
  const response = await fetch(url, { credentials: "same-origin", cache: "no-store", ...options });
  let payload;
  try { payload = await response.json(); } catch { throw new Error("A szerver nem megfelelő választ adott."); }
  if (!response.ok || !payload.ok) throw new Error(explain(payload?.error?.code));
  return payload.data;
}
function empty(message) {
  const placeholder = document.createElement("p");
  placeholder.className = "empty";
  placeholder.textContent = message;
  gallery.replaceChildren(placeholder);
}
async function refresh(query = "", append = false) {
  if (append && !nextMediaCursor) return;
  const request = ++currentListRequest;
  const before = append ? nextMediaCursor : null;
  if (append) {
    mediaLoadMore.disabled = true;
    mediaListStatus.textContent = "További médiafájlok betöltése…";
  } else {
    nextMediaCursor = null;
    shownMediaCount = 0;
    mediaLoadMore.hidden = true;
    mediaLoadMore.disabled = false;
    mediaListStatus.textContent = "Médiafájlok betöltése…";
  }
  try {
    const url = new URL("/api/admin/media", location.origin); if (query) url.searchParams.set("q", query);
    url.searchParams.set("state",mediaState.value);
    url.searchParams.set("limit", "50");
    if (before) url.searchParams.set("before", before);
    const data = await api(url.toString());
    if (request !== currentListRequest) return;
    renderQuota(data);
    const assets = Array.isArray(data.assets) ? data.assets : [];
    if (!assets.length && !append) {
      empty(mediaState.value === "archived" ? "Nincs archivált médiafájl." : "Még nincs feltöltött médiafájl.");
    }
    const tiles = assets.map(asset => {
      const card = document.createElement("article"); card.className = "tile";
      const link = document.createElement("a");
      link.href = "/api/admin/media?id=" + encodeURIComponent(asset.id);
      link.target = "_blank"; link.rel = "noopener noreferrer";
      link.setAttribute("aria-label", asset.name + " megtekintése");
      if (!asset.mimeType || asset.mimeType.startsWith("image/")) {
        const img = document.createElement("img");
        img.src = link.href; img.alt = asset.altText || asset.name; img.loading = "lazy"; link.append(img);
      } else {
        const icon = document.createElement("span"); icon.className = "media-icon";
        icon.textContent = asset.mimeType?.startsWith("video/") ? "🎬" : "🔊";
        icon.setAttribute("aria-label", asset.mimeType?.startsWith("video/") ? "Videófájl" : "Hangfájl"); link.append(icon);
      }
      const details = document.createElement("div"); details.className = "details";
      const name = document.createElement("span"); name.className = "name";
      name.textContent = asset.name;
      const size = document.createElement("small");
      size.textContent = (asset.sizeBytes / 1024).toFixed(1) + " KiB";
      const alt = document.createElement("input"); alt.type = "text"; alt.maxLength = 500; alt.value = asset.altText || ""; alt.placeholder = "Leírás vagy alternatív képleírás"; alt.setAttribute("aria-label", asset.name + " leírása");
      const saveAlt = document.createElement("button"); saveAlt.type = "button"; saveAlt.textContent = "Leírás mentése";
      const feedback = document.createElement("small"); feedback.setAttribute("role", "status");
      saveAlt.onclick = async () => { saveAlt.disabled = true; try { await api("/api/admin/media?id=" + encodeURIComponent(asset.id), { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ altText: alt.value }) }); feedback.textContent = "Mentve"; feedback.dataset.kind = "ok"; } catch (error) { feedback.textContent = error.message; feedback.dataset.kind = "error"; } finally { saveAlt.disabled = false; } };
      const usageButton = document.createElement("button"); usageButton.type = "button"; usageButton.textContent = "Használati helyek"; usageButton.setAttribute("aria-expanded", "false");
      const usage = document.createElement("div"); usage.className = "media-usage"; usage.hidden = true; usage.setAttribute("role", "status");
      usageButton.onclick = async () => {
        if (!usage.hidden) { usage.hidden = true; usageButton.setAttribute("aria-expanded", "false"); return; }
        usage.hidden = false; usageButton.setAttribute("aria-expanded", "true"); usage.textContent = "Használati helyek betöltése…"; usageButton.disabled = true;
        try {
          const data = await api("/api/admin/media?usage=" + encodeURIComponent(asset.id));
          usage.replaceChildren();
          if (!data.complete) { const warning = document.createElement("p"); warning.textContent = "A vizsgálat nem teljes. Az asset használatban lehet; eltávolítás előtt további ellenőrzés szükséges."; usage.append(warning); }
          if (!data.references.length) { const empty = document.createElement("p"); empty.textContent = data.complete ? "Nincs hivatkozás az oldalakban vagy korábbi verziókban." : "Nem található biztos hivatkozás."; usage.append(empty); }
          else {
            const list = document.createElement("ul");
            for (const ref of data.references) {
              const item = document.createElement("li");
              const source = {draft:"Piszkozat",published:"Publikált",revision:"Korábbi verzió"}[ref.source] || ref.source;
              const label = `${source}${ref.version ? ` v${ref.version}` : ""}${ref.archived ? " · archivált" : ""}: ${ref.pageTitle || ref.slug || ref.pageId} / ${ref.nodeName} / ${ref.path}`;
              if (ref.archived) item.textContent = label;
              else { const target = document.createElement("a"); target.href = "/editor-v2/index.html?pageId=" + encodeURIComponent(ref.pageId); target.textContent = label; item.append(target); }
              list.append(item);
            }
            usage.append(list);
          }
        } catch (error) { usage.textContent = error.message || "A használati helyek nem tölthetők be."; }
        finally { usageButton.disabled = false; }
      };
      const lifecycle=document.createElement("button");lifecycle.type="button";
      const lifecycleStatus=document.createElement("small");lifecycleStatus.className="archive-status";lifecycleStatus.setAttribute("role","status");
      const isArchived=Boolean(asset.archivedAt);
      lifecycle.textContent=isArchived?"Médiafájl visszaállítása":"Médiafájl archiválása";
      let armed=false;
      lifecycle.onclick=async()=>{
        if(!isArchived&&!armed){
          armed=true;lifecycle.textContent="Archiválás megerősítése";
          lifecycle.classList.add("archive-confirm");
          lifecycleStatus.textContent="Csak nem használt médiafájlt archiválhatsz. A fájl az R2-ben megmarad.";
          lifecycle.focus();return;
        }
        lifecycle.disabled=true;
        lifecycleStatus.textContent=isArchived?"Visszaállítás…":"Használat ellenőrzése és archiválás…";
        try{
          await api("/api/admin/media?id="+encodeURIComponent(asset.id),{
            method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({archived:!isArchived})
          });
          await refresh(search.value.trim());
        }catch(error){
          lifecycleStatus.textContent=error instanceof Error?error.message:"A művelet sikertelen.";
          lifecycleStatus.dataset.kind="error";
          if(!isArchived&&/hivatkozik|ellenőrzése nem teljes/.test(lifecycleStatus.textContent)&&usage.hidden)usageButton.click();
          armed=false;lifecycle.textContent=isArchived?"Médiafájl visszaállítása":"Médiafájl archiválása";
          lifecycle.classList.remove("archive-confirm");
          lifecycle.disabled=false;
        }
      };
      details.append(name,size,alt,saveAlt,feedback,usageButton,usage,lifecycle,lifecycleStatus);
      mountRetentionRequest(details, asset, {
        api, onChanged: () => retentionStatus?.refresh(),
        setLifecycleBusy: busy => { lifecycle.disabled = busy; }
      });
      card.append(link,details);return card;
    });
    if (append) gallery.append(...tiles);
    else if (assets.length) gallery.replaceChildren(...tiles);
    shownMediaCount += assets.length;
    nextMediaCursor = typeof data.nextCursor === "string" && data.nextCursor ? data.nextCursor : null;
    mediaLoadMore.hidden = !nextMediaCursor;
    mediaLoadMore.disabled = false;
    mediaListStatus.textContent = shownMediaCount
      ? shownMediaCount + " médiafájl betöltve" + (nextMediaCursor ? " · további médiafájlok elérhetők." : " · az összes találat betöltve.")
      : "Nincs találat.";
    // Appended cards precede the load-more button in the DOM. Restore
    // keyboard focus to the first new image link, including the last page.
    if (append) (tiles[0]?.querySelector("a") || mediaLoadMore).focus({preventScroll:false});
  } catch (e) {
    if (request !== currentListRequest) return;
    if (append) {
      mediaLoadMore.hidden = false;
      mediaLoadMore.disabled = false;
      mediaLoadMore.focus({preventScroll:true});
      mediaListStatus.textContent = e instanceof Error ? e.message : "A további képek nem tölthetők be.";
    } else {
      renderQuota(null);
      empty(e instanceof Error ? e.message : "A képek nem tölthetők be.");
      mediaListStatus.textContent = "A képek betöltése sikertelen.";
    }
  }
}
mediaLoadMore.addEventListener("click",()=>refresh(search.value.trim(),true));
mediaState.addEventListener("change",()=>refresh(search.value.trim()));
let searchTimer;search?.addEventListener("input",()=>{
  // Invalidate pending responses immediately rather than after debounce.
  currentListRequest++;
  nextMediaCursor = null;
  mediaLoadMore.hidden = true;
  clearTimeout(searchTimer);
  mediaListStatus.textContent = "Keresés…";
  searchTimer=setTimeout(()=>refresh(search.value.trim()),220);
});
searchClear?.addEventListener("click",()=>{search.value="";clearTimeout(searchTimer);refresh()});
function uploadMedia(file) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    let settled = false;
    const finish = (error, data) => { if (settled) return; settled = true; error ? reject(error) : resolve(data); };
    xhr.open("POST", "/api/admin/media?name=" + encodeURIComponent(file.name));
    xhr.responseType = "json";
    xhr.setRequestHeader("Content-Type", file.type);
    xhr.timeout = 120000;
    // Bytes sent are not the same as bytes persisted in D1/R2.
    xhr.upload.onprogress = event => {
      if (activeUpload !== xhr || !event.lengthComputable || !event.total) return;
      if (event.loaded >= event.total) {
        progress.value = 99;
        feedback("Médiafájl elküldve; tárhely- és adatbázismentés ellenőrzése…");
      } else {
        const value = Math.min(99, Math.floor(event.loaded / event.total * 100));
        progress.value = value;
        if (value >= (xhr.lastAnnounced || 0) + 10) {
          xhr.lastAnnounced = value;
          feedback("Médiafájl küldése: " + value + "%");
        }
      }
    };
    xhr.onload = () => {
      const payload = xhr.response && typeof xhr.response === "object" ? xhr.response : null;
      if (xhr.status >= 200 && xhr.status < 300 && payload?.ok === true) {
        progress.value = 100;
        finish(null, payload.data);
      } else {
        const error = new Error(payload?.error?.code ? explain(payload.error.code) : "A szerver nem megfelelő választ adott.");
        error.canRetry = ![400,401,403,409,413,415].includes(xhr.status);
        finish(error);
      }
    };
    xhr.onerror = () => {
      const error = new Error("Hálózati hiba. Ellenőrizd a médiatárat újrapróbálás előtt: lehet, hogy a fájl már megérkezett.");
      error.canRetry = true;
      finish(error);
    };
    xhr.ontimeout = () => {
      const error = new Error("A feltöltés időtúllépés miatt megszakadt. Ellenőrizd a médiatárat újrapróbálás előtt.");
      error.canRetry = true;
      finish(error);
    };
    xhr.onabort = () => {
      const error = new Error("A feltöltést megszakítottad. Ha a fájl már megérkezett a szerverre, megjelenhet a médiatárban.");
      error.cancelled = true;
      finish(error);
    };
    activeUpload = xhr;
    button.disabled = true;
    input.disabled = true;
    cancel.hidden = false;
    retry.hidden = true;
    progress.hidden = false;
    progress.value = 0;
    feedback("Feltöltés indítása…");
    try { xhr.send(file); } catch (error) { finish(error); }
  });
}
async function startUpload(file) {
  if (activeUpload) return;
  if (!file) return feedback("Válassz ki egy médiafájlt.", "error");
  if (!supported.has(file.type) || !file.size || file.size > maxBytes) {
    return feedback("PNG, JPG, GIF, WebP, MP3, OGG, WAV vagy WebM fájlt válassz, legfeljebb 4 MiB méretben.", "error");
  }
  try {
    const saved = await uploadMedia(file);
    form.reset();
    feedback(saved?.duplicate ? "Ez a médiafájl már szerepel a Médiatárban. A meglévő fájlt használjuk, nem készült új másolat." : "A médiafájl sikeresen bekerült a privát médiatárba.", "ok");
    await refresh(search.value.trim());
  } catch (error) {
    feedback(error instanceof Error ? error.message : "Nem sikerült feltölteni a médiafájlt.", "error");
    // No silent retries: a lost response might still have persisted the image.
    retry.hidden = !error?.canRetry || Boolean(error?.cancelled);
  } finally {
    activeUpload = null;
    button.disabled = false;
    input.disabled = false;
    cancel.hidden = true;
  }
}
cancel.addEventListener("click", () => { if (activeUpload) activeUpload.abort(); });
retry.addEventListener("click", () => { if (!activeUpload) startUpload(input.files?.[0]); });
input.addEventListener("change", () => {
  if (activeUpload) return;
  retry.hidden = true;
  progress.hidden = true;
  progress.value = 0;
  feedback(input.files?.[0] ? "A médiafájl feltöltésre kész." : "Válassz ki egy médiafájlt.");
});
form.addEventListener("submit", event => {
  event.preventDefault();
  if (!activeUpload) startUpload(input.files?.[0]);
});
const retentionPanel = document.getElementById("mediaRetentionPanel");
if (retentionPanel) retentionStatus = mountRetentionStatus(retentionPanel, () => api("/api/admin/media?retentionStatus=1"), {
  cancelRequest: id => api("/api/admin/media?retentionRequest=1&requestId=" + encodeURIComponent(id), { method: "DELETE" })
});
const integrityPanel = document.getElementById("mediaIntegrityPanel");
if (integrityPanel) mountMediaIntegrity(integrityPanel);
await refresh();
