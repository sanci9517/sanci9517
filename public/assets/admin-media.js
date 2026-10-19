const form = document.getElementById("uploadForm");
const input = document.getElementById("imageInput");
const button = document.getElementById("uploadButton");
const status = document.getElementById("uploadStatus");
const gallery = document.getElementById("gallery");
const search = document.getElementById("mediaSearch");
const searchClear = document.getElementById("mediaSearchClear");
const supported = new Set(["image/png", "image/jpeg", "image/gif", "image/webp"]);
const maxBytes = 4 * 1024 * 1024;

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
    MEDIA_SIZE_INVALID: "A képfájl túl nagy vagy üres.",
    MEDIA_QUOTA_EXCEEDED: "A webhely 5 GB-os médiakerete megtelt.",
    MEDIA_STORAGE_FAILED: "A tárhely jelenleg nem elérhető.",
    MEDIA_METADATA_FAILED: "A fájl adatainak mentése nem sikerült.",
    MEDIA_STORAGE_UNAVAILABLE: "A médiatároló nincs bekötve."
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
async function refresh(query = "") {
  try {
    const url = new URL("/api/admin/media", location.origin); if (query) url.searchParams.set("q", query);
    const data = await api(url.toString());
    const assets = Array.isArray(data.assets) ? data.assets : [];
    if (!assets.length) { empty("Még nincs feltöltött kép."); return; }
    const tiles = assets.map(asset => {
      const card = document.createElement("article"); card.className = "tile";
      const link = document.createElement("a");
      link.href = "/api/admin/media?id=" + encodeURIComponent(asset.id);
      link.target = "_blank"; link.rel = "noopener noreferrer";
      link.setAttribute("aria-label", asset.name + " megtekintése");
      const img = document.createElement("img");
      img.src = link.href; img.alt = asset.altText || asset.name;
      img.loading = "lazy"; link.append(img);
      const details = document.createElement("div"); details.className = "details";
      const name = document.createElement("span"); name.className = "name";
      name.textContent = asset.name;
      const size = document.createElement("small");
      size.textContent = (asset.sizeBytes / 1024).toFixed(1) + " KiB";
      const alt = document.createElement("input"); alt.type = "text"; alt.maxLength = 500; alt.value = asset.altText || ""; alt.placeholder = "Alternatív képleírás"; alt.setAttribute("aria-label", asset.name + " alternatív képleírása");
      const saveAlt = document.createElement("button"); saveAlt.type = "button"; saveAlt.textContent = "Leírás mentése";
      const feedback = document.createElement("small"); feedback.setAttribute("role", "status");
      saveAlt.onclick = async () => { saveAlt.disabled = true; try { await api("/api/admin/media?id=" + encodeURIComponent(asset.id), { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ altText: alt.value }) }); feedback.textContent = "Mentve"; feedback.dataset.kind = "ok"; } catch (error) { feedback.textContent = error.message; feedback.dataset.kind = "error"; } finally { saveAlt.disabled = false; } };
      details.append(name,size,alt,saveAlt,feedback);card.append(link,details);return card;
    });
    gallery.replaceChildren(...tiles);
  } catch (e) {
    empty(e instanceof Error ? e.message : "A képek nem tölthetők be.");
  }
}
let searchTimer;search?.addEventListener("input",()=>{clearTimeout(searchTimer);searchTimer=setTimeout(()=>refresh(search.value.trim()),220)});searchClear?.addEventListener("click",()=>{search.value="";refresh()});
form.addEventListener("submit", async event => {
  event.preventDefault();
  const file = input.files?.[0];
  if (!file) return feedback("Válassz ki egy képfájlt.", "error");
  if (!supported.has(file.type) || !file.size || file.size > maxBytes) {
    return feedback("PNG, JPG, GIF vagy WebP képet válassz, legfeljebb 4 MiB méretben.", "error");
  }
  button.disabled = true;
  feedback("Feltöltés és biztonsági ellenőrzés…");
  try {
    await api("/api/admin/media?name=" + encodeURIComponent(file.name), {
      method: "POST",
      headers: { "Content-Type": file.type },
      body: file
    });
    form.reset();
    feedback("A kép sikeresen bekerült a privát médiatárba.", "ok");
    await refresh();
  } catch (e) {
    feedback(e instanceof Error ? e.message : "Nem sikerült feltölteni a képet.", "error");
  } finally {
    button.disabled = false;
  }
});
await refresh();
