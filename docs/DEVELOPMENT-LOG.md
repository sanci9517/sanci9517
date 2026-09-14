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

## 2026-09-13 — Csoportosítás, csoport feloldása és csoporttulajdonságok ellenőrizve

- Aktív ág: `v2/foundation`
- A több elem kijelölése után a csoportosítás és a csoport feloldása felhasználói teszten sikeres.
- A csoporttulajdonságok külön inspectorban jelennek meg, amikor valódi csoport van kijelölve.
- A csoporttulajdonságok az egy elem inspector logikájához igazodnak, és a módosítások egységesen alkalmazhatók a csoport tagjaira.
- A csoport színéhez és hátteréhez vizuális színválasztó került be.
- A bal/jobb panelek összecsukása és visszanyitása működik, a vezérlők nem takarják a panel szövegét.
- A középső fehér canvas terület középre igazított elrendezést kapott.
- A felhasználói ellenőrzés eredménye: **MŰKÖDIK**.
- Érintett fő modulok:
  - `public/editor/group-properties.js`
  - `public/editor/toolbar-fix.js`
  - `public/editor/app.js`
- Következő lépés: csak a terv szerinti következő funkció tesztelése, új párhuzamos funkcióteszt nélkül.

## 2026-09-14 — Lock / Unlock ellenőrizve

- Aktív ág: `v2/foundation`
- Az elem zárolása és feloldása felhasználói teszten sikeres.
- Zárolt elem nem mozgatható és nem méretezhető.
- Feloldás után az elem ismét szerkeszthető.
- Csoportos elemkezelésnél a zárolás csoportszinten is kezelhető.
- A felhasználói ellenőrzés eredménye: **MŰKÖDIK**.
- Következő lépés: **Hide / Show**.
