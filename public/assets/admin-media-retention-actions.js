// Only explicit confirmations send metadata requests. No file-delete API is used.
export const retentionLabels = Object.freeze({
  requested: "Kérelem rögzítve", quarantined: "Várakozási idő", revalidated: "Újraellenőrizve",
  cancelled: "Visszavonva", deleted: "Törölve", blocked: "Elakadt"
});
export const cancellable = new Set(["requested", "quarantined", "revalidated", "blocked"]);
export const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const invalid = "A szerver válasza nem ellenőrizhető.";
const reasons = {
  USAGE_INCOMPLETE: "A használati helyek ellenőrzése nem teljes. Nézd meg a Használati helyeket.",
  ASSET_IN_USE: "Oldal vagy korábbi verzió hivatkozik a fájlra. Nézd meg a Használati helyeket.",
  ASSET_NOT_ARCHIVED: "A fájl már nincs archiválva. Frissítsd a médiatárat.",
  OBJECT_UNAVAILABLE: "A tárolt fájl nem érhető el. A kérelem nem indítható.",
  INVALID_REQUEST: "A kérelem előfeltételei nem teljesülnek."
};
export function parseRetentionDate(value, message = invalid) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}[T ](?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:\.\d{1,3})?(?:Z|[+-](?:[01]\d|2[0-3]):[0-5]\d)?$/.test(value)) throw new Error(message);
  const calendar = new Date(value.slice(0, 10) + "T00:00:00Z");
  if (!Number.isFinite(calendar.getTime()) || calendar.toISOString().slice(0, 10) !== value.slice(0, 10)) throw new Error(message);
  // SQLite CURRENT_TIMESTAMP is UTC even without a zone suffix.
  const date = new Date(value.replace(" ", "T") + (/(Z|[+-]\d{2}:\d{2})$/.test(value) ? "" : "Z"));
  if (!Number.isFinite(date.getTime())) throw new Error(message);
  return date;
}
export function actionButton(text) {
  const button = document.createElement("button"); button.type = "button"; button.textContent = text; return button;
}
export function checkedCancellation(data, id) {
  if (data?.id !== id || data.state !== "cancelled" || typeof data.changed !== "boolean" || data.permanentDeletionAuthorized !== false) throw new Error(invalid);
}
function checkPreview(data, assetId) {
  if (data?.assetId !== assetId || data.permanentDeletionAuthorized !== false ||
      !["archived", "objectPresent", "usageComplete", "eligibleForRetention", "retentionMigrationActive", "retentionRequestAvailable"].every(key => typeof data[key] === "boolean") ||
      !Number.isSafeInteger(data.references) || data.references < 0) throw new Error(invalid);
  const existing = data.existingRetentionRequest;
  if (existing !== null && (!existing || !uuid.test(existing.id) || !Object.hasOwn(retentionLabels, existing.state))) throw new Error(invalid);
  if (!data.retentionMigrationActive) return "Az adatmegőrzési kérelmek jelenleg nem érhetők el. Próbáld újra később.";
  if (existing) return "Ehhez a fájlhoz már tartozik kérelem: " + retentionLabels[existing.state] + ". Új kérelem nem jön létre.";
  if (!data.retentionRequestAvailable) return reasons[data.retentionPreviewReason] || "A kérelem nem indítható. Futtass új előellenőrzést.";
  const preview = data.retentionPreview;
  if (!data.archived || !data.objectPresent || !data.usageComplete || data.references !== 0 || !data.eligibleForRetention ||
      data.retentionPreviewReason !== null || preview?.assetId !== assetId || preview.state !== "requested" || preview.finalDeletionAuthorized !== false ||
      typeof preview.notBefore !== "string" || !/^\d{4}-\d{2}-\d{2}T.*Z$/.test(preview.notBefore) || !Number.isFinite(Date.parse(preview.notBefore))) throw new Error(invalid);
  parseRetentionDate(preview.notBefore);
  return null;
}

export function mountRetentionRequest(container, asset, { api, onChanged, setLifecycleBusy }) {
  if (!asset.archivedAt || typeof asset.id !== "string" || !uuid.test(asset.id)) return;
  const root = document.createElement("div"); root.className = "retention-action";
  root.setAttribute("role", "group"); root.setAttribute("aria-label", asset.name + " adatmegőrzése");
  const check = actionButton("Adatmegőrzés előellenőrzése");
  const status = document.createElement("p"); status.setAttribute("role", "status"); status.setAttribute("aria-live", "polite");
  const controls = document.createElement("div"); controls.className = "retention-controls";
  root.append(check, status, controls); container.append(root);
  let busy = false;
  function reset() {
    const restoreFocus = root.contains(document.activeElement) || document.activeElement === document.body;
    controls.replaceChildren(); check.disabled = false; busy = false; setLifecycleBusy(false);
    if (root.isConnected && restoreFocus) check.focus({ preventScroll: true });
  }
  check.onclick = async () => {
    if (busy || !root.isConnected) return;
    busy = true; check.disabled = true; controls.replaceChildren(); setLifecycleBusy(true);
    status.textContent = "Használati helyek, fájl és kérelmi állapot ellenőrzése…";
    try {
      const data = await api("/api/admin/media?deletePreflight=1&id=" + encodeURIComponent(asset.id));
      if (!root.isConnected) return;
      const blocked = checkPreview(data, asset.id);
      if (blocked) { status.textContent = blocked; reset(); return; }
      const due = new Intl.DateTimeFormat("hu-HU", { dateStyle: "medium", timeStyle: "short" }).format(new Date(data.retentionPreview.notBefore));
      status.textContent = "Nincs hivatkozás; a fájl archivált és elérhető. Várakozási idő vége legkorábban: " + due +
        ". A megerősítés csak kérelmet rögzít. A fájl megmarad és továbbra is foglalja a tárhelyet; automatikus törlés nem indul.";
      const confirm = actionButton("Kérelem rögzítésének megerősítése");
      const abort = actionButton("Mégse");
      controls.append(confirm, abort); confirm.focus({ preventScroll: true });
      abort.onclick = () => { status.textContent = "Nem indult kérelem."; reset(); check.focus({ preventScroll: true }); };
      let submitting = false;
      confirm.onclick = async () => {
        if (submitting || !root.isConnected) return;
        submitting = true; confirm.disabled = true; abort.disabled = true;
        status.textContent = "Kérelem rögzítése és a feltételek újbóli ellenőrzése…";
        try {
          const saved = await api("/api/admin/media?retentionRequest=1&id=" + encodeURIComponent(asset.id), { method: "POST" });
          if (!saved || typeof saved.id !== "string" || !uuid.test(saved.id) || saved.assetId !== asset.id ||
              !Object.hasOwn(retentionLabels, saved.state) || typeof saved.created !== "boolean" || saved.permanentDeletionAuthorized !== false ||
              typeof saved.notBefore !== "string" || (saved.created && saved.state !== "requested")) throw new Error(invalid);
          parseRetentionDate(saved.notBefore);
          status.textContent = (saved.created ? "Kérelem rögzítve." : "Meglévő kérelem: " + retentionLabels[saved.state] + ".") + " A fájl változatlanul megmaradt.";
        } catch (error) {
          status.textContent = (error instanceof TypeError ? "Kapcsolati hiba." : error.message || invalid) +
            " A művelet eredménye bizonytalan lehet. Ellenőrizd a kérelmek listáját; új próbához új előellenőrzés szükséges.";
        } finally {
          reset();
          await onChanged(); // Only a GET, including after a lost mutation response. Never retry a write.
          if (root.isConnected && (document.activeElement === document.body || root.contains(document.activeElement))) check.focus({ preventScroll: true });
        }
      };
    } catch (error) {
      if (root.isConnected) status.textContent = error instanceof TypeError ? "Az előellenőrzés nem sikerült. Ellenőrizd a kapcsolatot, majd próbáld újra." : error.message || invalid;
      reset();
    }
  };
}
