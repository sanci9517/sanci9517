# Legacy rétegek archívuma

A jelenlegi aktív rendszer nem használja ezeket a régi rétegeket.

## Archivált rétegek
- `public/editor/` — korábbi, külön weboldal-szerkesztő; az aktív belépési pont az `/admin/editor` → `public/editor-v2/`.
- `public/admin.html` — korábbi admin felület, nem canonical route. **Aktuális route-szerződés (2026-10-13, ellenőrzött `src/index.ts` és `tests/admin-home-contract.test.js` alapján):** `/admin` az autentikált `public/admin-home.html` Dashboardot szolgálja ki; `/admin/editor` az autentikált `public/editor-v2/index.html` Visual Editor v2-t szolgálja ki; `/admin/home`, `/admin-home.html` és `/admin.html` kompatibilitási redirectként `/admin`-ra irányít. A régi `public/admin.html` fájl nem a canonical Admin belépési pont.
- `public/assets/system-page-editor.js` — régi fix rendszeroldal-szerkesztő.
- `public/assets/system-page-runtime.js` — régi `system_page_content` alapú publikus runtime.
- `src/routes/admin/system-pages.ts` — régi fix rendszeroldal API; route-regisztráció megszüntetve.
- `src/routes/public/system-pages.ts` — régi rendszeroldal API; route-regisztráció megszüntetve.

## Adatbázis
A régi `system_page_content` adatokat és migrációs előzményeket ebben a lépésben nem töröljük. Ezek későbbi, külön adat-migrációs/cleanup kapuban kezelendők, hogy visszaállítási lehetőség maradjon.

## Canonical rendszer
Az új fejlesztések kizárólag:

`D1 domain data → canonical pages → Editor v2 → draft → preview → publish → rollback → audit`

A Schedule builder is erre a rendszerre épül; nem készül második editor.
