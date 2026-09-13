# Sanci9517 V2 — Fejlesztési napló

## 2026-09-13 — Több elem kijelölése ellenőrizve

- Aktív ág: `v2/foundation`
- A Visual Editor többes kijelölése a core editor selection modellbe került.
- Ctrl/Cmd + kattintással több elem kijelölhető.
- A felhasználói ellenőrzés eredménye: **MŰKÖDIK**.
- A régi, különálló `multi-select.js` overlay eltávolításra került, hogy ne ütközzön a core kijelöléssel.
- A következő fejlesztési lépés előtt nem végzünk más funkciótesztet.

## 2026-09-13 — Oldal átnevezése

- Aktív ág: `v2/foundation`
- Az editorban új `Átnevezés` művelet került be.
- A művelet a szerveroldali `/api/admin/pages` `PUT` végpontot használja, ezért az oldal neve D1-ben kerül módosításra.
- Az oldal slugja nem változik.
- A módosítás auditálása a meglévő `page.update` audit eseményen keresztül történik.
- Ha nem mentett editor-módosítás van, az átnevezés blokkolva van, hogy ne írja felül a még el nem mentett tartalmat.
- Az átnevezés után az editor újratöltődik, így a módosított névnek a szerverről kell visszaérkeznie.
- Érintett fájlok:
  - `public/editor/page-rename.js`
  - `public/admin-editor-v2.html`
- Tesztállapot: **MŰKÖDIK**.
