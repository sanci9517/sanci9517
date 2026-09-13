# Sanci9517 V2 — Fejlesztési napló

## 2026-09-13 — Oldal átnevezése előkészítve

- Aktív ág: `v2/foundation`
- Következő kötelező teszt: **Oldal átnevezése**.
- Az editorban új `Átnevezés` művelet került be.
- A művelet a szerveroldali `/api/admin/pages` `PUT` végpontot használja, ezért az oldal neve D1-ben kerül módosításra.
- Az oldal slugja nem változik.
- A módosítás auditálása a meglévő `page.update` audit eseményen keresztül történik.
- Ha nem mentett editor-módosítás van, az átnevezés blokkolva van, hogy ne írja felül a még el nem mentett tartalmat.
- Az átnevezés után az editor újratöltődik, így a módosított névnek a szerverről kell visszaérkeznie.
- Érintett fájlok:
  - `public/editor/page-rename.js`
  - `public/admin-editor-v2.html`
- Commitok:
  - `17c16e03889fc912a5a9ac93b2ecdf69029e77fd` — rename action
  - `fada027a93f9eeec2a6a544e1dca75c0053fe298` — editor script bekötése
- Tesztállapot: **[ ] felhasználói ellenőrzésre vár**.
- Továbbhaladás csak akkor, ha a felhasználó az átnevezést működőnek és D1-ben megmaradónak ellenőrizte.
