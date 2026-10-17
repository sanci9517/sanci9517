(() => {
  const button = document.getElementById("refreshLinkReport");
  const status = document.getElementById("linkReportStatus");
  const list = document.getElementById("linkReportFindings");
  if (!button || !status || !list) return;
  const reasons = {
    PAGE_NOT_FOUND: "Az oldal nem található",
    PAGE_ARCHIVED: "Az oldal archiválva van",
    PAGE_NOT_PUBLISHED: "Az oldal nincs publikálva"
  };
  button.addEventListener("click", async () => {
    button.disabled = true;
    status.textContent = "Navigáció ellenőrzése…";
    list.replaceChildren();
    try {
      const response = await fetch("/api/admin/link-report", { credentials: "same-origin", cache: "no-store" });
      if (response.status === 401) {
        status.textContent = "A munkamenet lejárt. Jelentkezz be újra.";
        return;
      }
      if (!response.ok) throw new Error("HTTP " + response.status);
      const payload = await response.json();
      const data = payload.data || payload;
      if (!Array.isArray(data.findings)) throw new Error("Érvénytelen válasz");
      status.textContent = data.findings.length
        ? data.findings.length + " hibás hivatkozás a publikált navigációban (" + data.checked + " ellenőrzött elem)."
        : "Nem található hibás oldalhivatkozás a publikált navigációban (" + data.checked + " ellenőrzött elem).";
      for (const finding of data.findings) {
        const item = document.createElement("li");
        item.textContent = (finding.label || finding.itemId || finding.pageId || "Ismeretlen menüpont") + " — " + (reasons[finding.reason] || finding.reason);
        list.appendChild(item);
      }
      if (Array.isArray(data.contentFindings)) {
        status.textContent += " Tartalmi linkhibák: " + data.contentFindings.length + " (" + (data.checkedContentLinks || 0) + " ellenőrzött belső link).";
        for (const finding of data.contentFindings) {
          const item = document.createElement("li");
          item.textContent = "Oldal: " + finding.sourcePageId + " · Elem: " + finding.nodeId + " · Hibás cél: " + finding.href;
          list.appendChild(item);
        }
        if (data.contentTruncated) status.textContent += " A tartalmi ellenőrzés 2000 linknél korlátozott.";
      }
      if (Array.isArray(data.redirectedContentLinks) && data.redirectedContentLinks.length) {
        status.textContent += " Érvényes, átirányított belső linkek: " + data.redirectedContentLinks.length + ".";
        for (const finding of data.redirectedContentLinks) {
          const item = document.createElement("li");
          item.textContent = "Átirányítás · Oldal: " + finding.sourcePageId + " · Elem: " + finding.nodeId + " · Régi cím: " + finding.href;
          list.appendChild(item);
        }
      }
      if (data.unparseablePublishedPages || data.unsupportedPublishedDocuments) {
        status.textContent += " Figyelem: " + (data.unparseablePublishedPages || 0) + " sérült és " + (data.unsupportedPublishedDocuments || 0) + " nem támogatott szerkezetű publikált oldal tartalma kimaradt a vizsgálatból.";
      }
      if (data.truncated) status.textContent += " A jelentés 2000 elemnél korlátozott.";
    } catch {
      status.textContent = "Az ellenőrzés nem sikerült. Próbáld újra később.";
    } finally {
      button.disabled = false;
    }
  });
})();
