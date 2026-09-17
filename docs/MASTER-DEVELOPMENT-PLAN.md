# Sanci9517 — EGYETLEN MASTER FEJLESZTÉSI TERV

**Branch:** `v2/foundation`
**Állapot:** folyamatosan frissítendő végrehajtási terv
**Ez az egyetlen hivatalos fejlesztési terv.**

## 0. Kötelező szabályok

1. Egy időben pontosan **egy végrehajtási ponton** dolgozunk.
2. Minden pontot külön megvalósítunk, deployolunk és tesztelünk.
3. A következő pontra csak akkor lépünk, ha az előzőt a felhasználó működőnek visszaigazolta.
4. `[x]` csak akkor használható, ha a funkció ténylegesen létezik, végig működik és tesztelve lett.
5. Régi tervből átvett `[x]` önmagában nem bizonyíték. Ha a jelenlegi rendszerben nincs meg a funkció, **úgy kezeljük, mintha soha nem készült volna el**.
6. `[~]` részben meglévő / javítandó / nem teljesen tesztelt funkció.
7. `[ ]` még nem elkészült funkció.
8. D1 a szerveroldali forrás; az Editor Page Model a szerkesztés canonical modellje.
9. Nem építünk workaround-architektúrát. Hibás alapot előbb kijavítunk.
10. Új beszélgetésben ezt a fájlt kell használni a folytatási ponthoz. A terv végén mindig szerepel az **AKTUÁLIS KÖVETKEZŐ LÉPÉS**.
11. A `docs/CHANGELOG.md` a változások történetét tartja nyilván, nem külön fejlesztési terv.
12. A régi tervek tartalma csak akkor számít követelménynek, ha ebbe az egyetlen tervbe bekerült.

## 1. STÁTUSZJELENTÉS

- `[x]` kész + tesztelt + felhasználó visszaigazolta
- `[~]` részben kész / javítandó / tesztelendő
- `[ ]` nincs kész

**Fontos:** a terv státusza nem a fájl meglétét jelenti. A funkció teljes működését jelenti.

---

# 2. ALAPRENDSZER ÉS ADATMODELL

- [x] 01 — GitHub + Cloudflare alapstruktúra működő branch/deploy útja
- [~] 02 — D1 séma és canonical oldalmodell teljes auditja
- [~] 03 — Legacy → canonical migráció véglegesítése és ellenőrzése
- [ ] 04 — Legacy HTML teljes leválasztása és archiválása
- [ ] 05 — Canonical Page Model kizárólagos aktív használata
- [ ] 06 — D1 draft / published snapshot / revision modell teljes validálása
- [ ] 07 — Revision rollback teljes tesztje
- [ ] 08 — Audit log teljes ellenőrzése
- [ ] 09 — Autosave
- [ ] 10 — Backup / restore

# 3. AUTH + ADMIN + CMS

- [x] 11 — Auth / session alap
- [x] 12 — Editor jogosultság / RBAC alap
- [~] 13 — Oldallista D1-ből
- [~] 14 — Egyedi oldal megnyitása D1-ből
- [~] 15 — Oldal létrehozása
- [~] 16 — Oldal átnevezése
- [~] 17 — Oldal törlése
- [ ] 18 — Slug kezelés és ütközéskezelés teljes UI teszttel
- [ ] 19 — CMS teljes regressziós teszt

# 4. VISUAL EDITOR — CANONICAL CORE

- [x] 20 — Editor betöltés / boot diagnostics
- [x] 21 — Canonical Page Model betöltése
- [x] 22 — Node ID / parent / children modell
- [x] 23 — Selection alap
- [x] 24 — Layer tree alap
- [x] 25 — Command API alap
- [x] 26 — Undo / redo alap
- [x] 27 — Element update / add / delete / duplicate commandok alapja
- [x] 28 — Hierarchy reparent / reorder command alapja
- [~] 29 — Canvas Engine foundation
- [~] 30 — Responsive engine foundation
- [~] 31 — Property Registry foundation

# 5. VISUAL EDITOR — E4 GEOMETRY ÉS CANVAS

- [ ] 32 — Canvas Engine tényleges bekötése az Editor rendererbe
  - A Page Model legyen a renderelt canvas kizárólagos forrása.
  - A `canvas-engine.js` ténylegesen vegyen részt a renderelésben.
  - A device viewport ugyanazt a Page Modelt használja.

- [ ] 33 — Stabil DOM ↔ Page Model node binding
  - Minden canvas elem egyértelmű `nodeId` kapcsolatot kap.
  - Selection, inspector és canvas ugyanarra a node-ra mutasson.

- [ ] 34 — Geometry Inspector
  - X
  - Y
  - Width
  - Height
  - Minden módosítás a Command API-n keresztül történjen.

- [ ] 35 — Responsive geometry
  - Desktop
  - Tablet
  - Mobile
  - Egy Page Model, responsive override-okkal.
  - Ne legyen külön oldal/dokumentum viewportonként.

- [ ] 36 — Drag
  - Canvas drag → Command API → Page Model → render.
  - Undo/redo kompatibilis.

- [ ] 37 — Resize
  - Canvas resize → Command API → Page Model → render.
  - Undo/redo kompatibilis.

- [ ] 38 — Snap / guides / alignment
  - Alap snap
  - Guide
  - Alignment
  - Nem módosíthatják közvetlenül a canonical modellt.

- [ ] 39 — Layer / lock / hide / rename teljes editor UX

- [ ] 40 — Multi-select / group / ungroup

- [ ] 41 — Canvas zoom / fit / grid / viewport UX

# 6. VISUAL EDITOR — HIERARCHY ÉS LAYOUT

- [ ] 42 — Nested hierarchy teljes működése
- [ ] 43 — Invalid nesting védelem
- [ ] 44 — Section / container / row / columns / flex / grid / stack
- [ ] 45 — Layout sizing / spacing / alignment / distribution
- [ ] 46 — Positioning / overflow
- [ ] 47 — Responsive layout szabályok
- [ ] 48 — Typography Inspector
- [ ] 49 — Appearance Inspector
- [ ] 50 — Interaction / accessibility / advanced properties
- [ ] 51 — Property search / reset / validation

# 7. EDITOR UX ÉS TARTALMI ELEMEK

- [ ] 52 — Text / rich text
- [ ] 53 — Image / video / embed
- [ ] 54 — Button / link / CTA
- [ ] 55 — Card / list / table / accordion / tabs
- [ ] 56 — Social és streamer blokkok
- [ ] 57 — Twitch / YouTube / TikTok / Discord blokkok
- [ ] 58 — Schedule / Live / Countdown / VOD blokkok
- [ ] 59 — Form / contact blokkok
- [ ] 60 — Media library / R2

# 8. PAGE LIFECYCLE

- [ ] 61 — Draft
- [ ] 62 — Preview
- [ ] 63 — Publish
- [ ] 64 — Public renderer canonical published documentből
- [ ] 65 — Public / draft izoláció
- [ ] 66 — Revision history UI
- [ ] 67 — Rollback UI
- [ ] 68 — Import / export

# 9. PUBLIC STREAMER WEBSITE

- [ ] 69 — Főoldal
- [ ] 70 — Twitch
- [ ] 71 — YouTube
- [ ] 72 — TikTok
- [ ] 73 — Adásrend
- [ ] 74 — Következő adás / countdown
- [ ] 75 — Élő / offline állapot
- [ ] 76 — VOD / Shorts / Clips
- [ ] 77 — Rólam
- [ ] 78 — Közösség / Discord
- [ ] 79 — Kapcsolat
- [ ] 80 — Támogatás
- [ ] 81 — Szponzor / üzleti / Press Kit
- [ ] 82 — 404 / loading / empty / error állapotok
- [ ] 83 — Egységes mobil / tablet / desktop UX
- [ ] 84 — SEO / Open Graph / structured data
- [ ] 85 — Accessibility
- [ ] 86 — Performance / caching

# 10. STREAMER ADATOK ÉS INTEGRÁCIÓK

- [ ] 87 — Schedule D1 rendszer
- [ ] 88 — Twitch API / live state
- [ ] 89 — YouTube API
- [ ] 90 — TikTok rendszer
- [ ] 91 — VOD rendszer
- [ ] 92 — Community / Discord
- [ ] 93 — Contact / collaboration
- [ ] 94 — Site settings
- [ ] 95 — Analytics

# 11. PLATFORM STABILIZÁLÁS

- [ ] 96 — Unit tesztek
- [ ] 97 — API / integration tesztek
- [ ] 98 — D1 tesztek
- [ ] 99 — E2E / browser tesztek
- [ ] 100 — Regression tesztek
- [ ] 101 — Security hardening
- [ ] 102 — Observability / error reporting
- [ ] 103 — Production backup / recovery teszt
- [ ] 104 — Production release checklist

# 12. AI-READY ALAPOK

- [ ] 105 — Stabil page / node / component / action / revision / media / schedule ID-k
- [ ] 106 — Strukturált page model teljes lezárása
- [ ] 107 — Közös Action API az Editor és későbbi AI számára
- [ ] 108 — Permission / approval / audit réteg
- [ ] 109 — Preview-before-apply / rollback mechanizmus

# 13. AI PLATFORM

- [ ] 110 — AI Orchestrator
- [ ] 111 — Agent / Tool / Model Registry
- [ ] 112 — Task Planner / Context Selector
- [ ] 113 — Permission Checker / Approval Flow
- [ ] 114 — Execution / verification / recovery
- [ ] 115 — Multi-model routing
- [ ] 116 — Web Engineer Agent
- [ ] 117 — Visual Editor Agent
- [ ] 118 — QA Agent
- [ ] 119 — GitHub / Cloudflare Engineer Agent
- [ ] 120 — Browser QA AI
- [ ] 121 — Stream observation
- [ ] 122 — Silence / pacing detection
- [ ] 123 — Chat / context analysis
- [ ] 124 — Contextual live suggestions
- [ ] 125 — Streamer profile / long-term memory
- [ ] 126 — Experience learning / evaluation cycles
- [ ] 127 — One-click clip / Short creation
- [ ] 128 — Stream setup diagnostics assistant
- [ ] 129 — AI control center
- [ ] 130 — End-to-end AI platform test

# 14. VÉGSŐ ELFOGADÁSI TESZT

- [ ] 131 — Teljes public website teszt
- [ ] 132 — Teljes admin / CMS teszt
- [ ] 133 — Teljes Visual Editor teszt
- [ ] 134 — D1 / R2 / integrations teszt
- [ ] 135 — Mobile / tablet / desktop teszt
- [ ] 136 — Security / permissions teszt
- [ ] 137 — Performance / accessibility teszt
- [ ] 138 — Backup / restore / disaster recovery teszt
- [ ] 139 — Regression teszt
- [ ] 140 — Production release jóváhagyás

---

# AKTUÁLIS VÉGREHAJTÁSI ÁLLAPOT

**Aktív fő terület:** Visual Editor v2 / E4 Geometry

**Következő végrehajtandó pont:** **32 — Canvas Engine tényleges bekötése az Editor rendererbe.**

A 32. ponton belül egyetlen feladatot végzünk egyszerre. Utána böngészőteszt következik. Csak felhasználói `jó/működik` visszaigazolás után jelöljük `[x]`-re és lépünk a 33. pontra.

**Új beszélgetés folytatása:** mindig az itt szereplő `AKTUÁLIS VÉGREHAJTÁSI ÁLLAPOT` az elsődleges folytatási pont.
