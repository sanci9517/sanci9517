# Sanci9517 — EGYSÉGES MASTER FEJLESZTÉSI, TESZTELÉSI ÉS FUNKCIÓBŐVÍTÉSI TERV

**Verzió:** MASTER-2.39.57  
**Dátum:** 2026-09-22  
**Repository:** `sanci9517/sanci9517`  
**Aktív branch:** `v2/foundation`  
**Projekt:** Sanci9517 Streamer Brand Platform  
**Állapot:** ez az egyetlen aktív fejlesztési terv.

**Legutóbbi igazolt PASS:** 2026-09-22 — a 40.69.4 revision-konfliktus javítás után a Mentés és Publish működik; a rollback UI elkészült és a felhasználói élő rollback teszt is PASS.


## 00/B — ÚJ BESZÉLGETÉS / CHECKPOINT VÉDELMI ZÁR — 2026-09-22

**Ez a blokk kötelező boot-ellenőrzés új beszélgetés indításakor.**

Ha bármilyen régi checkpoint, összefoglaló, korábbi üzenet vagy történeti fejezet az alábbiak bármelyikét állítja, az **ELAVULT**, és nem szabad folytatási pontként használni:
- „40.68 – pageOrder teljes tesztelése”
- „Most következő pont: 40.68”
- „deploy után kezdjük a mobilos pageOrder tesztet”
- „40.67 → 40.68 pageOrder teszt”
- bármely olyan állapot, amely 40.67-et vagy 40.68-at aktív/pending fejlesztési pontként jelöl.

**Hivatalos aktuális állapot:**
- 40.67 — `[x]` LEZÁRVA.
- 40.68 — `[x]` LEZÁRVA.
- 40.69.1 — `[x]` AUDIT PASS — teljes kód- és adatfolyam-audit lezárva.
- 40.69.2 — `[~]` AZ EGYETLEN AKTÍV PONT.
- Aktív feladat: **canonical revision contract + D1 persistence boundary megtervezése és minimális séma/code módosítás előkészítése**.
- A pageOrder mobil élő tesztje nem aktuális feladat; a 40.67 teljes mobil tesztje már lezárt.
- A korábban csak mobilon tesztelt funkciók PC/Desktop visszatesztje későbbi tesztkapu, és csak a felhasználó külön kérésére indul.

**Boot-szabály:** új beszélgetésben a modellnek először ezt a 00/B blokkot, majd közvetlenül a 00/A indexet kell figyelembe vennie. Ha bármely régi checkpoint ettől eltér, a régi checkpointot kell figyelmen kívül hagyni, nem az aktuális MASTER állapotot.

**Egyetlen aktuális folytatási mondat:**
> „Folytassuk a Sanci9517 MASTER tervet a 40.69.5 pontnál: rollback + published snapshot + unpublish teljes regressziós teszt.”

> **Ez a dokumentum az egyetlen végrehajtási igazságforrás.** A korábbi blueprint-ek, roadmap-ek, editor-tervek, AI-tervek és státuszfájlok archivált tudásanyagként maradnak meg. Új beszélgetésben, akár hónapok múlva is, ezt a fájlt kell először elolvasni, majd kizárólag a **00/A MASTER VÉGREHAJTÁSI INDEX egyetlen aktív pontjából** folytatni. Más fejezet `[ ]`, `[~]` vagy régebbi „következő lépés” szövege nem jelent aktuális folytatási pontot.

---

# 00 — A MASTER TERV SZABÁLYAI

## 00.1 Státuszjelölések
- `[x]` = implementálva, végigtesztelve és a felhasználó visszaigazolta.
- `[~]` = részleges, folyamatban vagy újratesztelendő.
- `[ ]` = még nincs kész.
- `[!]` = blokkoló hiba.
- `[D]` = dokumentálandó döntési pont.

**Kód jelenléte önmagában soha nem jelent `[x]` státuszt.**

## 00.2 Egyetlen MASTER terv + egyetlen aktív munkapont
Ez a projekt **egyetlen aktív MASTER tervet és pontosan egy aktív végrehajtási pontot** használ.

- Soha nincs két párhuzamos fejlesztési munkasáv.
- PC/Desktop és Mobile/Touch **nem külön munkasáv**, csak ugyanazon funkció külön tesztfelülete.
- A közös canonical State, Page Model, Command API, selection, hierarchy, history és renderer csak egyszer létezhet.
- Minden további funkció csak backlogként létezhet, amíg az aktuális aktív pont le nincs zárva.
- Új beszélgetésben kizárólag a **00/A MASTER VÉGREHAJTÁSI INDEX** alapján szabad folytatni.
- Régi fejezetekben található `[~]`, `[ ]` vagy régebbi „következő lépés” szöveg nem aktiválható önállóan.

**KÖTELEZŐ ÁLLAPOTMENTÉS MINDEN LÉPÉS UTÁN:** minden fejlesztési, javítási, tesztelési vagy döntési lépés lezárásakor frissíteni kell ezt a MASTER fájlt. Az indexnek mindig az utolsó ténylegesen lezárt lépést és az egyetlen következő aktív pontot kell mutatnia.

## 00.2a Platformfelületek: fejlesztés közös, tesztelés felületenként
A fejlesztés során az Editor v2-t **PC/Desktop és Mobile/Touch felületre is fejlesztjük**, de ezek nem külön fejlesztési ágak. Ugyanazt a canonical funkciót, State-et, Page Modelt, Command API-t, History-t és Renderert használják.

**Kötelező visszatérési szabály a teszteknél:**
- Ha egy funkciót valamelyik élő tesztben csak mobilon ellenőriztünk, az attól még **nem tekinthető PC/Desktop oldalon teljesen teszteltnek**.
- Az ilyen pontokat a MASTER-ben **PC/Desktop live test PENDING / visszatérő tesztként** kell megőrizni.
- Később, amikor a felhasználó PC/Desktop tesztet kér, az összes korábban csak mobilon ellenőrzött releváns funkcióhoz vissza kell térni.
- Ez **nem nyit új fejlesztési ágat**: a PC/Desktop ellenőrzés ugyanazon lezárt funkció utólagos tesztkapuja.
- Egy funkció csak akkor jelölhető teljes platformtesztként lezártnak, ha a szükséges PC/Desktop, tablet és mobile ellenőrzési státusza egyértelműen dokumentált.
- A PC/Desktop live teszt továbbra sem indul automatikusan; csak a felhasználó külön kérésére.

## 00.3 Kötelező MASTER-állapotfrissítés minden lépés után
Minden egyes lépés után, még a következő lépés megkezdése előtt:
1. rögzíteni kell, mit végeztünk el;
2. rögzíteni kell a teszt eredményét;
3. rögzíteni kell, mi maradt hátra vagy mi blokkol;
4. rögzíteni kell az **egyetlen aktuális folytatási pontot**;
5. szükség esetén rögzíteni kell a commit/HEAD állapotot;
6. a MASTER fájlt GitHubon frissíteni kell.

**Tilos** több fejlesztési lépést úgy végrehajtani, hogy közben a MASTER ne tükrözze az aktuális állapotot. Ha a beszélgetés bármikor megszakad, az utolsó MASTER-frissítés legyen a hivatalos folytatási pont.

## 00.4 Kötelező munkaciklus
Minden aktív pont:

`MASTER pont → teljes érintett kód audit → adatfolyam audit → minimális módosítás → érintett fájl visszaolvasása → GitHub commit → branch/HEAD ellenőrzés → Cloudflare build → deploy → API ellenőrzés → D1/R2/KV ellenőrzés → admin teszt → public teszt → desktop/tablet/mobile teszt → regresszió → felhasználói teszt → felhasználói visszaigazolás → MASTER frissítése`

Sikertelen tesztnél **nem lépünk tovább**.

## 00.4a Folyamatos funkcióbővítés
A cél nem egy egyszer elkészített minimális editor. A Visual Editor és a teljes platform **folyamatosan bővülő rendszer**.

Ha a fejlesztés során:
- hiányzó funkciót találunk;
- jobb iparági megoldást találunk;
- új felhasználói igény merül fel;
- egy funkció más funkciótól függ;
- biztonsági, accessibility, performance vagy AI-kompatibilitási követelmény jelenik meg;
- a jelenlegi tervből kimaradt, de a lehető legrészletesebb editorhoz szükséges képesség azonosítható;

akkor **először ezt a MASTER tervet frissítjük**, megfelelő helyre soroljuk és csak utána implementáljuk.

A terv ezért élő dokumentum: nem rövidíteni kell, hanem új funkciókkal és pontos státuszokkal folyamatosan bővíteni.

## 00.5 Preset + manuális beállítás szabály
Ahol a felhasználó gyakran ismétlődő értékeket állít, ott a manuális mező mellett értelmes presetek is legyenek.

Példák:
- width: Auto / Fill / Fit / gyakori méretek;
- height: Auto / Fit / gyakori méretek;
- spacing: előre definiált lépések;
- typography: token/preset;
- radius/shadow: token/preset;
- breakpoint/device: presetek;
- zoom: 25/50/75/100/150/200% és Fit;
- layout: gyakori Flex/Grid/Stack beállítások.

A preset nem külön kerülőút: ugyanazon `Command → Validation → Page Model → History → Canvas → Persistence` láncon működik, mint a manuális szerkesztés. Minden preset legyen responsive-context aware, ha az adott tulajdonság responsive.

## 00.6 Forrás- és benchmark szabály
A Visual Editor specifikációját több dokumentált rendszer mintái alapján bővítjük. Vizsgálható többek között Builder Visual Editor, Elementor, Webflow, Pinegrow, GrapesJS, Craft.js és Puck. A vizsgált mintákat nem másoljuk; csak a hasznos, bizonyítható funkciókat építjük be saját Page Modelbe.

## 00.7 Architektúra elsőbbsége
Nem vezetünk be második selection-, hierarchy-, state-, renderer- vagy command-rendszert. Az új funkciók a kanonikus rendszert bővítik.


# 00/A — MASTER VÉGREHAJTÁSI INDEX — EZ AZ EGYETLEN AKTÍV SORREND

> **KÖTELEZŐ:** A dokumentum bármely más fejezetében szereplő `[ ]`, `[~]` vagy régebbi „következő lépés” szöveg **történeti dokumentáció vagy backlog**, és **nem végrehajtási utasítás**. Az egyetlen végrehajtási forrás az alábbi index **EGYETLEN AKTÍV PONT** sora. A történeti fejezetek státuszai nem írhatják felül az indexet, és nem nyithatnak új munkasávot.

### Kész, lezárt fő blokkok
- [x] **40.69.4 — Revision conflict második gyökérok + LIVE Save/Publish regresszió**
- [x] **40.62–40.63 — Canonical standard oldalak + dinamikus publikus menü**
- [x] **40.64–40.66 — Oldal slug/meta lifecycle**
- [x] **40.67 — Canonikus oldalsorrend: Editor = publikus menü**
- [x] **40.68 — Draft / Preview / Publish hardening**
  - [x] Draft mentés
  - [x] Preview
  - [x] Publish → LIVE
  - [x] Published snapshot / publikus route
  - [x] Unpublish
  - [x] Draft megmaradás
  - [x] Republish
  - [x] Invalid Page Model publish-védelem
  - [x] Publish/Unpublish audit
  - [x] Mobil UI regresszió
  - [x] Diagnosztika 0 hiba
  - [x] Core CI 24/24

### 🔵 EGYETLEN AKTÍV PONT
**40.69.5 — Revision persistence regression: rollback + published snapshot + unpublish teljes regressziós teszt**

**Státusz:** `[~]` — Save/Publish live PASS; a rollback UI implementáció elkészült és statikus/CI ellenőrzés alatt; a következő egyetlen aktív felhasználói kapu a rollback élő teszt.

**Aktív munkasáv száma:** **1**

**Nem aktív:** PC/Desktop, Mobile/Touch, Rich Text, Group/Ungroup, Page CRUD, 40.68 és minden más régebbi vagy későbbi fejezet. Ezek csak történeti dokumentáció, lezárt tesztek vagy későbbi backlogok. A PC és Mobile nem külön fejlesztési sáv, hanem ugyanazon funkció tesztfelülete.

### 40.69.5.B — ROLLBACK LIVE SMOKE TEST — 2026-09-22

**Állapot:** [x] PASS — felhasználói élő teszt: **„Működik”**.

- [x] Revision előzmények panel betölt.
- [x] Korábbi revision kiválasztható és visszaállítható.
- [x] Rollback megerősítés működött.
- [x] A draft visszaállt a kiválasztott korábbi állapotra.
- [x] A rollback új revisionként jött létre.
- [x] Újratöltés után a visszaállított draft megmaradt.
- [x] A felhasználói live teszt eredménye: **Működik**.
- [x] A rollback nem tekintendő automatikus publishnak; a published snapshot külön tesztkapu.

**Következő egyetlen aktív tesztlépés:** published snapshot + unpublish regressziós teszt.

### 40.69.5.C — PUBLISHED SNAPSHOT REGRESSZIÓ: PRE-PUBLISH JAVÍTVA, POST-PUBLISH HIBA — 2026-09-22

**Állapot:** [~] BLOKKOLVA — felhasználói teszt alapján a módosított draft normál publikus oldalon már nem jelenik meg publikálás előtt, viszont publikálás után sem jelenik meg a publikus oldalon.

**Elvégzett audit:**
- [x] `src/routes/public/pages.ts`: normál publikus kérés többé nem szolgál ki automatikusan editor draftot; draft csak explicit, jogosított `?preview=1` esetén használható.
- [x] `src/routes/admin/editor.ts`: Publish ugyanabban a D1 batch-ben frissíti a `content_json`, `editor_revisions`, `published_content_json`, `published_revision_id` és `is_published` mezőket.
- [x] `public/assets/page-renderer.js`: normál `/p/<slug>` oldal `/api/public/pages?slug=...` végpontot hív `preview` nélkül, `cache: no-store` mellett.
- [x] A publikus route normál módban `WHERE is_published=1` feltételt használ és `published_content_json` snapshotból renderel.
- [ ] Meg kell határozni, miért nem látszik a frissen publikált snapshot a tényleges live publikus útvonalon.
- [ ] Következő egyetlen aktív lépés: live API/D1 állapot ellenőrzés ugyanazon pageId/slug mellett: `is_published`, `published_revision_id`, `published_content_json`, valamint `/api/public/pages?slug=...` válasz összevetése.
- [ ] Ezután csak a bizonyított gyökérok minimális javítása és újraépítés/deploy következhet.

**Fontos:** a pre-publish draft leak javítását nem tekintjük kész regressziónak, amíg a Publish → LIVE útvonal ugyanazon teszten nem igazolt.


### 40.69.5.C — PUBLISHED SNAPSHOT REGRESSZIÓ: PUBLISH UI GYÖKÉROK AZONOSÍTVA — 2026-09-22

**Állapot:** [~] BLOKKOLÓ GYÖKÉROK AZONOSÍTVA; KÓDJAVÍTÁS ELŐTT.

A live D1/API audit bizonyította:
- [x] is_published=1.
- [x] published_revision_id pontosan a LIVE revisionre mutat.
- [x] published_content_json byte-pontosan megegyezik a published revision document_json értékével.
- [x] A publikus API normál módban ezt a published snapshotot adja vissza.
- [x] v10 publikált dokumentum a korábbi, üres root állapot.
- [x] v11 draft már tartalmazza az új Section/Stack/Row node-hierarchiát.
- [x] A jelenlegi v11 mentés után a Publish UI nem indít új publish revisiont.

**Bizonyított kliens oldali gyökérok:**
A public/editor-v2/app.js syncPublishControls() függvénye a Publish gombot feltétel nélkül letiltja, ha az oldal már publikált: publish.disabled=published.
Ez azt jelenti, hogy ha egy már LIVE oldalon új draft módosítás történik, a jelenlegi UI nem engedi ugyanazt a módosított draftot újra publikálni. A szerveroldali save(true) útvonal viszont erre képes lenne.

**Következő egyetlen aktív lépés:**
1. csak a Publish UI állapotlogikáját javítjuk úgy, hogy már publikált, de dirty draft esetén a Publish/Re-publish művelet engedélyezett legyen;
2. ugyanazt a meglévő save(true) → POST /api/admin/editor útvonalat használjuk;
3. nem készül második publish state vagy API;
4. reread + CI/build + deploy;
5. élő teszt: v11 draft → Publish → új published revision → published_content_json = új revision → public API már az új node-hierarchiát adja.

**PC/Desktop live teszt:** továbbra is PENDING, nem indul.

### Kötelező folytatási szabály
1. Csak a kék **EGYETLEN AKTÍV PONT** dolgozható fel.
2. Egy ponton belül is csak **egy következő lépés** lehet kijelölve.
3. A következő pontot csak akkor írjuk át aktívra, ha az előző pont implementációja + szükséges tesztje + user PASS + MASTER frissítése megtörtént.
4. Minden lépés után a MASTER tetején lévő indexet azonnal frissíteni kell.
5. Ha új funkció merül fel, először backlogba kerül; **nem nyithat második aktív sávot**.
6. PC/Desktop live teszt csak külön felhasználói kérésre indítható; ettől nem jön létre külön munkasáv. A korábban csak mobilon élőben ellenőrzött funkciók PC/Desktop tesztje későbbi visszatérő tesztkapu marad.
7. Új beszélgetés mindig ezt az indexet olvassa először. A folytatás automatikusan a kék aktív pontról indul.

### Új beszélgetés checkpoint
**„Folytassuk a Sanci9517 MASTER tervet. Először olvasd el a 00/A MASTER VÉGREHAJTÁSI INDEXET, és csak az ott megjelölt egyetlen aktív pontot folytasd. A régi fejezetek státuszait ne tekintsd aktív feladatnak.”**

---

# 01 — VÉGLEGES CÉLKÉP

## 01/A Publikus Sanci9517 platform
- prémium streamer/creator weboldal;
- magyar publikus felület;
- közös Sanci Brand design;
- desktop/tablet/mobile;
- Twitch, TikTok, YouTube, Discord;
- Home, Rólam, Adásrend, Twitch, YouTube, TikTok, VOD, Shorts, Közösség, Kapcsolat, Támogatás, Sponsor/Business, Press Kit;
- később Merch, Blog/News, Events, Community Hub és további oldalak;
- élő/offline állapot;
- következő stream countdown;
- dinamikus szerveroldali adatok;
- SEO, analytics, accessibility, performance.

## 01/B Admin/CMS
- biztonságos login/session;
- RBAC;
- dashboard;
- pages;
- Visual Editor;
- Layers/Navigator;
- Inspector;
- Components;
- Templates;
- Design System;
- Media/R2;
- Schedule;
- Social;
- VOD/Clips/Shorts;
- SEO;
- Analytics;
- Integrations;
- Settings;
- Audit;
- Draft/Preview/Publish;
- Versioning/Rollback;
- Backup/Restore;
- Import/Export;
- később AI/Automation.

## 01/C SANCI AI
Nem egyszerű chatbot. Hosszú távú, jogosultságokkal, action-validációval, preview-val, approval-lel, auditálással és rollbackkel működő platform:
- Editor AI;
- tartalomjavaslat;
- oldal- és komponensmódosítás;
- streamer-profil és memória;
- stream megfigyelés;
- beszéd/csend figyelése;
- chat/context elemzés;
- technikai problémajelzés;
- stream setup ellenőrzés;
- ötletadás;
- jó pillanatok felismerése;
- klip/Short előkészítés és később automatizálás;
- stream utáni elemzés;
- tanulási/értékelési ciklus;
- analytics/research/content intelligence.

---

# 02 — KANONIKUS ARCHITEKTÚRA

## 02/A Adatforrások
- D1 = strukturált tartalom/configuration elsődleges igazságforrás;
- R2 = média elsődleges tároló;
- KV = cache és nem kritikus gyors állapot;
- GitHub = forráskód + migráció + dokumentáció;
- Cloudflare Worker = web/API belépési pont;
- frontend = nem ír közvetlenül D1/R2/KV-be.

## 02/B Rétegek
`Public Renderer → Worker Router → API/Service → Domain/Data → D1/R2/KV`

`Admin UI → API → Service → Repository → storage`

`AI/Automation → Permission → Action → Validation → State → History/Version → Persistence → Verify → Audit`

## 02/C Page Model
`Site → Page → Root → Section → Container → Component/Element`

Node minimum:
- stable id;
- type;
- name;
- parentId;
- children/order;
- props/content;
- style/layout;
- responsive;
- visibility;
- locked;
- metadata;
- accessibility;
- dataBindings;
- interactions;
- validation state;
- capabilities;
- schema version.

A DOM nem source of truth. HTML import nem lehet az editor működésének feltétele.

## 02/D Stabil ID-k
siteId, pageId, sectionId, containerId, componentId, elementId, actionId, versionId, mediaId, scheduleId, auditId, assetId, templateId, tokenId, dataSourceId, automationId, taskId, agentId.

## 02/E State rétegek
Külön:
- persisted server state;
- published state;
- working/editor state;
- local recovery;
- UI-only state;
- history;
- preview;
- integration cache.
## 02/F Konfliktus/recovery
- revision/ETag/equivalent check;
- több tab érzékelés;
- konfliktus nem írhat csendben felül;
- reload/merge/overwrite megfelelő jogosultsággal;
- audit;
- autosave/recovery;
- save queue/retry/timeout;
- browser/tab crash recovery;
- recovery törlése sikeres mentés után.

## 02/G D1 canonicalization blocker
A jelenlegi Editor canonical documentje `sanci-page-document`, schemaVersion 1, miközben korábbi migrationben eltérő `sanci-document`/schemaVersion 2 örökség is található. Ezt nem workarounddal fedjük el: a végleges D1 Page Model canonicalizálás külön architekturális feladat és tesztkapu.

---

# 03 — TESZTELÉSI ÉS MINŐSÉGI KAPUK

Minden nagy funkció ellenőrzése:
1. cél;
2. adatmodell;
3. API;
4. jogosultság;
5. validation;
6. command/action;
7. state;
8. history;
9. save;
10. reload;
11. preview;
12. publish;
13. error handling;
14. recovery;
15. responsive;
16. accessibility;
17. performance;
18. AI compatibility;
19. rollback;
20. regression.

Tesztkategóriák:
- unit;
- integration;
- API;
- D1/R2/KV;
- E2E/browser;
- smoke/regression;
- visual regression;
- responsive;
- accessibility;
- security;
- performance;
- migration;
- backup/restore;
- concurrency;
- AI action validation/rollback;
- production deploy.

---

# 04 — ALAPRENDSZER / FOUNDATION

## 4.1 Canonical routing
- [x] `/` canonical renderer
- [x] `/p/<slug>` canonical renderer
- [x] legacy URL redirect alap
- [x] Worker routing
- [x] D1 published snapshot alap

## 4.2 Legacy archive
- [x] régi publikus HTML archiválva
- [x] `archive/pre-canonical-public-2026-09-16`
- [x] aktív renderer nem függ a legacy HTML-től
- [x] régi editor archive: `archive/pre-editor-rebuild-2026-09-16`

## 4.3 Foundation teljes újrateszt
- [x] `/`, `/p/home`, `/p/community` + canonical renderer
- [x] legacy redirectek
- [x] health/API
- [x] D1 pages
- [x] auth/session
- [x] GitHub branch/HEAD
- [x] Cloudflare deploy/build gate — felhasználói visszaigazolással
- [x] nincs véletlen törlés
- [x] renderer hibamentes

**04.3 állapot:** [x] TELJESEN LEZÁRVA — 2026-09-21.

---

# 05 — EDITOR CORE / STATE / COMMAND

## 5.1 Core
- [x] document creation
- [x] selection alap
- [x] element add/update/content
- [x] style/layout/responsive mutation
- [x] visibility/lock
- [x] delete/duplicate
- [x] hierarchy reparent/reorder
- [x] undo/redo
- [x] transaction/batch history
- [x] validation
- [x] unknown command corruption protection
- [x] E2: 12/12 core test
- [x] user E2 confirmation

## 5.2 Command API teljesítési szabály
Alap actionök:
`create, update, delete, duplicate, move, resize, reparent, reorder, group, ungroup, select, style.set, layout.set, responsive.set, content.set, visibility.set, lock.set, page.create/delete/rename/duplicate, component.*, template.*, media.attach/detach, save, preview, publish, rollback, restore`.

Minden mutáció validation + history + ahol szükséges audit + rollback kompatibilitással készüljön.

**Audit állapot:** a jelenlegi `commands.js` stabilan lefedi és teszteli az element CRUD/hierarchy/selection/style/responsive/content/lock, Rich Text, undo/redo és transaction/batch alapokat. A 5.2 teljes action-katalógusa viszont még nem teljes: különösen a `move`, `resize`, `group`, `ungroup`, page-level és component/template/media/persistence actionök további kanonikus Command réteget igényelnek. Ezeket nem szabad UI-specifikus kerülőútként megvalósítani.

## 5.3 — Command API coverage audit — LEZÁRVA
**Cél:** a 5.2-ben felsorolt action-katalógust összevetni a tényleges implementációval, tesztekkel és Page Model-lel, majd a hiányzó actionöket függőségi sorrendben, egyetlen kanonikus command-rendszerben megvalósítani.

Első aktív részfeladat: **`move` + `resize` Command szerződés és meglévő geometry útvonal auditja.**
Követelmények:
1. ne legyen második geometry state;
2. a meglévő `style.set` / responsive útvonal ne törjön;
3. desktop/tablet/mobile context legyen egyértelmű;
4. validation + history + undo/redo maradjon központi;
5. Canvas Engine továbbra is csak rendereljen;
6. a jelenlegi Geometry Inspector működése ne regresszáljon;
7. unit/integration teszt készüljön az actionökre és edge case-ekre;
8. user browser test csak a statikus/CI kapu után.

**Audit eredmény — 2026-09-21:**
- A jelenlegi geometry source of truth a Page Model node `style` + `responsive[device]`.
- A Canvas Engine csak feloldja és rendereli a `x/y/width/height` értékeket; nem mutál state-et.
- A Geometry Inspector jelenleg közvetlenül a kanonikus `responsive.set` commandot hívja X/Y/width/height módosítására.
- Külön `move` és `resize` command jelenleg nincs.
- Ez nem jelent második geometry rendszert, de a 5.2 action-katalógus és a tényleges Command API között coverage-hiány van.
- A `position.x` / `position.y` és `size.width` / `size.height` property-k már ugyanarra a responsive style adatra mutatnak.
- Jelenleg nincs külön canvas drag/resize interakciós adatfolyam az `app.js`-ben; ezért most nem szabad UI-szintű drag/resize kódot hozzáadni.
- Következtetés: a következő kódolási lépésben a `move` és `resize` legyen kanonikus command-alias/contract a meglévő responsive geometry útvonal fölött, ne új state és ne új renderer.

**Audit állapot:** [x] 05.3 audit kész, kódmódosítás nélkül.

**Korrekció a korábbi command-tervhez — 2026-09-21:** a `move` és `resize` külön commandként történő bevezetése nem indokolt. A teljes geometry útvonal már canonical `responsive.set` commandon működik, és a külön alias command csak párhuzamos mutation API-t hozna létre. A 5.2 action-katalógusban ezért a `move`/`resize` fogalmakat capabilityként kezeljük, nem kötelező külön command-névként.

**Command fejlesztési szabály:** minden új command csak akkor készülhet, ha valóban új domain-műveletet képvisel. Az implementáció sorrendje:
1. canonical adatmodell és határ meghatározása;
2. command contract (payload + validation + precondition + error);
3. egyetlen mutation útvonal a Page Modelhez;
4. history snapshot / transaction kompatibilitás;
5. rollback/error safety;
6. audit/persistence integráció, ha szerveroldali művelet;
7. unit/integration teszt;
8. CI;
9. csak ezután UI és browser teszt.

**Külön szabály:** page-level persistence commandok (`page.create/delete/rename/duplicate`, `save`, `publish`, `rollback`, `restore`) nem kezelhetők egyszerű node-mutationként. Ezeknél a D1 API a persistence boundary, az Editor Core history pedig csak a lokális dokumentumra vonatkozik. A szerveroldali művelet sikerét/hibáját külön kell kezelni.

**Következő hiányzó command-terület:** a jelenlegi aktív `page.delete` funkció lezárása után a 5.2 katalógusból a valóban új, kanonikus domain-műveletek auditja következik; elsőként `group/ungroup`, majd component/template/media/persistence területek.

---

# 06 — AKTUÁLIS EDITOR UI / INSPECTOR STABILIZÁLÁS

## 6.1 Geometry Inspector — kézi értékek
- [x] X
- [x] Y
- [x] width
- [x] height
- [x] position
- [x] responsive context használata
- [x] Command API-n át történő módosítás
- [x] Canvas Engine render
- [x] user browser test: **Működik**

## 6.2 Geometry Inspector presets
**Lezárt pont; nem ez az aktuális folytatási pont.**

Cél: a geometry kézi mezői mellett gyors, értelmes presetek legyenek, anélkül hogy más adatfolyam jönne létre.

### Width presetek
- Auto;
- Fill / 100%;
- Fit-content / Fit;
- gyakori fix méretek csak akkor, ha az adott elemnél értelmesek;
- Manual továbbra is elérhető.

### Height presetek
- Auto;
- Fit-content / Fit;
- gyakori fix méretek csak akkor, ha értelmesek;
- Manual továbbra is elérhető.

### Position presetek
- Static;
- Relative;
- Absolute;
- Fixed/Sticky csak akkor jelenjen meg, ha a jelenlegi layout-engine már biztonságosan támogatja;
- a szükséges X/Y/inset mezők a választott módtól függően jelenjenek meg.

### Kötelező technikai szabályok
- preset → ugyanaz a Command API;
- ugyanaz a Page Model;
- ugyanaz a responsive context;
- undo/redo működjön;
- reset/inheritance működjön;
- reload után megmaradjon;
- invalid preset ne okozzon dokumentum-korrupciót;
- Inspector registry felé illeszthető legyen;
- ne legyen második style state.

### Tesztkapu
1. desktop preset;
2. tablet preset;3. mobile preset;
4. manual → preset;
5. preset → manual;
6. preset → reset/inherit;
7. undo/redo;
8. reload;
9. canvas render;
10. invalid/edge case;
11. user confirmation.

**[x] User browser test: mind az 5 kötelező 6.2 teszt PASS; felhasználói visszaigazolás: „Mind az 5 jó”.**

---

# 07 — EDITOR SHELL ÉS CANVAS UX

## 7.1 Editor Shell — későbbi tesztkapuk, jelenleg NEM aktív
A 7.1 pont nem az aktuális folytatási pont. Az itt maradt feladatok későbbi tesztkapuk.
- [~] top toolbar

- [x] Elements panel — felhasználói tesztekkel lezárva
- [ ] Layers/Navigator — későbbi
- [ ] Canvas — későbbi
- [ ] Inspector — későbbi
- [ ] status/save bar — későbbi
- [x] panel open/close — felhasználói teszttel lezárva
- [x] collapse — felhasználói teszttel lezárva
- [x] panel width min/max — felhasználói teszttel lezárva
- [x] state persistence — UI-only localStorage; panel open/close, left tab és dock width visszaáll refresh után; user test: „Működik”
- [ ] mobile editor UX — későbbi
- [ ] egységes dark Sanci design — későbbi

## 7.2 Toolbar
- [ ] page name
- [ ] save status
- [ ] undo/redo
- [ ] preview
- [ ] publish preparation
- [ ] desktop/tablet/mobile
- [ ] zoom
- [ ] fit
- [ ] editor menu
- [ ] command palette később

## 7.3 Canvas
- [ ] centered workspace
- [ ] viewport frame
- [ ] grid
- [ ] pan
- [ ] zoom presets: 25/50/75/100/150/200 + Fit
- [ ] device preview
- [ ] scroll preservation
- [ ] empty state
- [ ] background
- [ ] selection outline
- [ ] hover/parent outline
- [ ] spacing visualizer
- [ ] ruler
- [ ] safe area
- [ ] guides
- [ ] snap
- [ ] snap strength
- [ ] breakpoint indicator
- [ ] focus selected
- [ ] preview overlay

---

# 08 — CANVAS ENGINE / HIERARCHY / MANIPULATION

## 8.1 Render mapping
- [x] Page Model → DOM alap
- [x] DOM node → stable element ID mapping
- [x] responsive style resolution alap
- [x] geometry style mapping

## 8.2 Selection
- [x] click alap
- [ ] hover
- [ ] selected outline
- [ ] parent highlight
- [~] multi-select — PC implementálva, browser/CI teszt pending; mobil/touch külön párhuzamos sáv
- [ ] keyboard navigation
- [ ] escape/parent navigation
- [~] tree/canvas sync — közös selection helper implementálva, teljes teszt pending

## 8.3 Drag/drop és manipulation
- [ ] drag
- [ ] drop zones
- [ ] invalid drop prevention
- [ ] reparent
- [ ] reorder
- [ ] resize handles
- [ ] move guides
- [ ] smart guides
- [ ] snap to grid
- [ ] snap to sibling/parent
- [ ] distance indicators
- [ ] alignment tools
- [ ] match width/height
- [ ] distribute

## 8.4 Layers/Navigator
- [ ] complete tree
- [ ] expand/collapse
- [ ] reorder/reparent
- [ ] hide/lock
- [ ] rename
- [ ] duplicate/delete
- [ ] search
- [ ] expand-to-selection
- [ ] breadcrumbs
- [ ] subtree rules

---

# 09 — ELEMENT LIBRARY

## 9.1 Basic
- [ ] Root
- [ ] Section
- [ ] Container/Box
- [ ] Div
- [ ] Stack
- [ ] Group
- [ ] Spacer
- [ ] Heading H1-H6
- [ ] Text/Paragraph
- [ ] Rich Text
- [ ] Link
- [ ] Button
- [ ] Icon
- [ ] Divider
- [ ] Badge/Tag
- [ ] Quote
- [ ] List

## 9.2 Layout
- [ ] Flex
- [ ] Grid
- [ ] Row
- [ ] Columns
- [ ] Panel
- [ ] Overlay
- [ ] Absolute
- [ ] Sticky
- [ ] responsive stack

## 9.3 Media
- [ ] Image
- [ ] Gallery
- [ ] Video
- [ ] Audio
- [ ] Embed
- [ ] iframe
- [ ] media placeholder
- [ ] lazy-loading metadata

## 9.4 Interactive
- [ ] Accordion
- [ ] Tabs
- [ ] Modal
- [ ] Tooltip
- [ ] Dropdown
- [ ] Carousel
- [ ] Form
- [ ] Input
- [ ] Select
- [ ] Checkbox
- [ ] Radio
- [ ] Textarea
- [ ] validation messages

## 9.5 Sanci blocks
- [ ] Twitch Live/Offline
- [ ] Twitch player
- [ ] Countdown
- [ ] Next Stream
- [ ] Schedule
- [ ] YouTube
- [ ] TikTok
- [ ] Discord
- [ ] VOD
- [ ] Shorts
- [ ] Community
- [ ] Support
- [ ] Stream Stats
- [ ] Game Card/List
- [ ] Social Links
- [ ] Sponsor
- [ ] Business Contact
- [ ] About Me
- [ ] Sanci Button

---

# 10 — INSPECTOR TELJES RENDSZER

A Geometry pont után az Inspector fokozatosan, szekciónként készül.

## 10.0 Inspector kapcsolat — történeti, lezárt tesztállapot
- [x] kijelölt elem adatai megjelennek az Inspectorban
- [x] szövegtartalom módosítása → Canvas frissül
- [x] X/Y pozíció módosítása
- [x] szélesség/magasság módosítása
- [x] geometry preset működése
- [x] Inspector módosítások visszakijelölés után megmaradnak
- [!] Inspectorból elem törlése jelenleg nem érhető el UI-gombbal
- [x] a kanonikus `element.delete` command már létezik és validált history-láncon működik

## 10.0.1 Inspector törlés UI — LEZÁRVA
Cél: a meglévő `element.delete` commandhoz biztonságos Inspector műveletet adni.

Követelmények:
- törlés csak kijelölt elemnél;
- root elem ne legyen törölhető;
- locked elem törlését a command réteg blokkolja;
- törlés után selection frissüljön;
- Canvas és Layers/Navigator állapota frissüljön;
- undo/redo működjön;
- dirty state és revision frissüljön;
- nincs második mutation/state rendszer;
- felhasználói teszt nélkül nem lesz [x].

## 10.0.2 Tesztkapu
**[~] Részleges felhasználói teszt: az alap törlés + Canvas/Layers + Undo működését a felhasználó visszaigazolta („Működik”). A teljes kapuhoz az alábbi edge-case tesztek még hátravannak.**

1. Inspectorban a törlés művelet látható.
2. Nem-root elem törlése működik.
3. Törlés után az elem eltűnik a Canvasról.
4. Kijelölés megszűnik vagy értelmes szomszédos kijelölés marad.
5. Layers/Navigator frissül.
6. Undo visszahozza.
7. Redo újra törli.8. Root törlése védett.
9. Locked elem törlése védett.
10. User confirmation.

## 10.1.0 — Rich Text inline formázás elvetése — 2026-09-21

**[D] VÉGLEGES DÖNTÉS:** a jelenlegi B/I inline formázási implementációt nem támogatjuk tovább és teljesen eltávolítottuk.

A korábbi B/I próbálkozások több runtime hibát és párhuzamos logikai útvonalat eredményeztek. Nem foltozzuk tovább és nem vezetünk be újabb párhuzamos Rich Text motort.

A jelenlegi támogatott Rich Text mag:
- canonical strukturált dokumentum;
- plain text szerkesztés;
- blokk típusok: paragraph, heading, quote, code;
- link adatok;
- canonical `richtext.content.set` command;
- validation + Page Model + History/Undo/Redo;
- egyetlen render/serialize útvonal.

A jelenlegi schema inline mark készlete üres. A B/I későbbi visszaépítése külön architekturális feladat és külön tesztkapu lesz.

**Fontos audit-megjegyzés:** a blokk-séma már ismeri a listákat, de a jelenlegi Rich Text renderer és Inspector UI még nem teljes listakezelésű. Ezt külön Content/Rich Text feladatként kezeljük, nem rejtett részfunkcióként.

## 10.1 Content
- [x] plain text
- [~] rich text — plain-text canonical szerkesztés és blokk/alap link kezelés megvan; B/I inline formázás elvetve és eltávolítva. Teljes lista/UI/haladó Rich Text funkciók még hátra.
- [ ] links
- [ ] media selection
- [ ] alt/title
- [ ] dynamic content

## 10.2 Layout
- [ ] display
- [ ] width/height
- [ ] min/max
- [ ] auto/fit/fill
- [ ] block/inline/stack
- [ ] flex
- [ ] grid
- [ ] alignment
- [ ] distribution
- [ ] wrap
- [ ] gap
- [ ] aspect ratio
- [ ] overflow

## 10.3 Spacing / box model
- [ ] margin all/sides
- [ ] padding all/sides
- [ ] gap
- [ ] linked/unlinked sides
- [ ] shorthand
- [ ] negative margin rules
- [ ] visual box model
- [ ] responsive spacing
- [ ] spacing presets

## 10.4 Position
- [x] position/X/Y alap
- [ ] top/right/bottom/left
- [ ] inset
- [ ] z-index
- [ ] containing block
- [ ] stacking context
- [ ] conflict validation
- [ ] position presets

## 10.5 Typography
- [ ] font family
- [ ] font size
- [ ] weight
- [ ] line-height
- [ ] letter spacing
- [ ] word spacing
- [ ] text transform
- [ ] decoration
- [ ] alignment
- [ ] text color
- [ ] typography presets/tokens
- [ ] responsive typography

## 10.6 Appearance
- [ ] background color
- [ ] gradient
- [ ] image background
- [ ] border
- [ ] radius
- [ ] shadow
- [ ] opacity
- [ ] filter
- [ ] blend
- [ ] appearance presets/tokens

## 10.7 Transform / Animation
- [ ] translate
- [ ] rotate
- [ ] scale
- [ ] skew
- [ ] transform origin
- [ ] transition
- [ ] animation
- [ ] keyframe model
- [ ] trigger
- [ ] reduced-motion compatibility

## 10.8 Interaction
- [ ] click
- [ ] hover
- [ ] focus
- [ ] active
- [ ] submit
- [ ] scroll
- [ ] load
- [ ] timer
- [ ] open/close
- [ ] navigate
- [ ] show/hide
- [ ] toggle
- [ ] state variants

## 10.9 Advanced Inspector UX
- [ ] central property registry used by UI
- [ ] property search
- [ ] reset
- [ ] inherited value indicator
- [ ] override indicator
- [ ] invalid indicator
- [ ] unit selector
- [ ] color picker
- [ ] token selector
- [ ] multi-selection editing
- [ ] Beginner/Advanced/Pro progressive disclosure
- [ ] context-sensitive property visibility

---

# 11 — RESPONSIVE ENGINE

- [x] desktop/tablet/mobile viewport model alap
- [x] responsive inheritance alap
- [x] per-device responsive state alap
- [ ] device presets
- [ ] custom breakpoints
- [ ] orientation
- [ ] min/max breakpoint constraints
- [ ] breakpoint management UI
- [ ] property-by-device editing
- [ ] visibility per device
- [ ] typography per device
- [ ] spacing per device
- [ ] layout per device
- [ ] responsive presets
- [ ] inheritance reset
- [ ] override indicator
- [ ] responsive validation
- [ ] visual breakpoint indicator

Inheritance default:
`mobile → tablet → desktop`, `tablet → desktop`, `desktop → base`.

---

# 12 — DESIGN SYSTEM / TOKENS / PRESETS

- [ ] color tokens
- [ ] typography tokens
- [ ] spacing tokens
- [ ] radius tokens
- [ ] shadow tokens
- [ ] breakpoint tokens
- [ ] animation tokens
- [ ] CSS variables
- [ ] Sanci brand tokens
- [ ] themes
- [ ] token override
- [ ] usage search
- [ ] global/local scope
- [ ] token validation
- [ ] preset registry
- [ ] preset versioning
- [ ] preset preview
- [ ] preset apply/reset

Presets mindenhol csak ott jelenjenek meg, ahol ténylegesen gyorsítják a szerkesztést; a manual control mindig megmaradjon.

---

# 13 — COMPONENTS / VARIANTS / TEMPLATES

- [ ] reusable component
- [ ] component schema
- [ ] component instance
- [ ] master/instance relationship
- [ ] local override
- [ ] variants
- [ ] state variants
- [ ] reusable sections
- [ ] header/footer
- [ ] cards
- [ ] CTA
- [ ] global component
- [ ] component permissions
- [ ] component validation
- [ ] dependency/usage tracking
- [ ] component versioning

Templates:
- [ ] blank
- [ ] streamer home
- [ ] schedule
- [ ] about
- [ ] contact
- [ ] community
- [ ] VOD
- [ ] support
- [ ] custom
- [ ] reusable page templates

---
# 14 — CLIPBOARD / IMPORT / EXPORT / KEYBOARD

- [ ] copy
- [ ] cut
- [ ] paste
- [ ] duplicate
- [ ] multi-copy
- [ ] cross-page paste
- [ ] paste structure
- [ ] paste style only
- [ ] JSON export
- [ ] JSON import
- [ ] schema validation import
- [ ] context menu
- [ ] keyboard shortcuts
- [ ] shortcut customization later
- [ ] command palette
- [ ] quick action search

---

# 15 — HISTORY / AUTOSAVE / RECOVERY / CONFLICT

## History
- [x] core undo/redo
- [ ] UI history panel
- [ ] grouped history
- [ ] drag/resize grouping
- [ ] typing grouping
- [ ] named versions
- [ ] restore
- [ ] history preview
- [ ] diff
- [ ] server-side versions
- [ ] history retention policy

## Autosave/recovery
- [ ] debounce
- [ ] save queue
- [ ] retry
- [ ] timeout
- [ ] dirty state
- [ ] local recovery
- [ ] crash recovery
- [ ] unsaved navigation protection
- [ ] browser close recovery

## Conflict- [ ] revision/ETag
- [ ] multi-tab detection
- [ ] conflict screen
- [ ] reload
- [ ] merge
- [ ] overwrite with permission
- [ ] conflict audit

---

# 16 — PAGE MANAGEMENT / D1 / CANONICALIZATION

## Page CRUD
- [ ] create
- [ ] rename
- [ ] edit
- [ ] duplicate
- [x] delete — Editor v2-ben implementálva és felhasználó által élőben tesztelve
- [ ] slug
- [ ] title
- [ ] metadata
- [ ] canonical
- [ ] status
- [ ] template
- [ ] permissions

## D1 canonical Page Model
- [ ] egyetlen canonical schema rögzítése
- [ ] régi `sanci-document` örökség feltérképezése
- [ ] migration mapping
- [ ] canonical write
- [ ] canonical read
- [ ] validation
- [ ] rollback
- [ ] legacy migration teszt
- [ ] D1 schema audit

---

# 17 — DRAFT / PREVIEW / PUBLISH / VERSION / ROLLBACK

- [ ] draft state
- [ ] preview state
- [ ] preview URL/token
- [ ] publish validation
- [ ] publish
- [ ] unpublish
- [ ] republish
- [ ] published snapshot
- [ ] version ID
- [ ] timestamp
- [ ] atomic publish
- [ ] rollback
- [ ] diff
- [ ] cache invalidation
- [ ] preview-only state
- [ ] publish audit

---

# 18 — REAL SANSI OLDALAK / MIGRÁCIÓ

Megőrzendő valódi oldalak:
- [ ] Home
- [ ] Twitch
- [ ] YouTube
- [ ] TikTok
- [ ] Menetrend
- [ ] VOD
- [ ] Közösség
- [ ] Rólam
- [ ] Kapcsolat
- [ ] Támogatás
- [ ] Shorts
- [ ] Sponsor/Business
- [ ] Press Kit
- [ ] további valódi Sanci oldalak

Migráció sorrendje oldalanként:
`eredeti backup → HTML/CSS audit → Page Model mapping → hierarchy → dynamic mapping → fallback ahol szükséges → D1 save → editor check → reload → preview → publish → public compare → responsive → user confirmation`.

Egyetlen valódi oldal sem törölhető/cserélhető véglegesen a lánc sikeres tesztje előtt.

Régi tesztoldalak csak a valódi oldalak biztonságos migrációja után:
- [ ] azonosítás
- [ ] backup/export ha szükséges
- [ ] törlés
- [ ] D1 ellenőrzés
- [ ] page-list ellenőrzés

---

# 19 — MEDIA / R2

- [ ] upload
- [ ] folders
- [ ] search
- [ ] filter
- [ ] preview
- [ ] metadata
- [ ] alt text
- [ ] crop
- [ ] resize
- [ ] replace
- [ ] archive/delete
- [ ] usage tracking
- [ ] unused media detection
- [ ] MIME validation
- [ ] file-size limits
- [ ] secure object keys
- [ ] image optimization
- [ ] video/audio
- [ ] clip/short assets
- [ ] cache policy

---

# 20 — DYNAMIC DATA / BINDINGS

- [ ] D1 binding
- [ ] site settings
- [ ] schedule
- [ ] Twitch
- [ ] YouTube
- [ ] TikTok
- [ ] Discord
- [ ] VOD
- [ ] collections
- [ ] API data source
- [ ] loading state
- [ ] empty state
- [ ] error state
- [ ] conditional rendering
- [ ] data transforms
- [ ] caching
- [ ] stale-data handling
- [ ] binding validation

---

# 21 — STREAMER INTEGRATIONS

## Twitch
- [ ] OAuth
- [ ] live/offline
- [ ] title
- [ ] game
- [ ] viewer statistics
- [ ] followers/subscribers where available
- [ ] VOD
- [ ] clips
- [ ] events/webhooks where applicable

## YouTube
- [ ] channel
- [ ] videos
- [ ] Shorts
- [ ] statistics where available
- [ ] API quota/error handling

## TikTok
- [ ] profile
- [ ] supported content integration
- [ ] API capability review
- [ ] rate limits/fallback

## Discord
- [ ] community link
- [ ] optional integration
- [ ] status where justified

Secrets remain Cloudflare Secrets; external APIs are normalized behind services.

---

# 22 — SCHEDULE / VOD / SHORTS / CONTENT ENGINE

- [ ] schedule CRUD
- [ ] recurring schedule
- [ ] timezone handling
- [ ] next-stream calculation
- [ ] countdown
- [ ] live state
- [ ] game/category
- [ ] stream type
- [ ] VOD ingestion
- [ ] VOD categorization
- [ ] search/filter
- [ ] Shorts management
- [ ] clips management
- [ ] content calendar
- [ ] platform-specific variants
- [ ] title/description/hashtag suggestions
- [ ] thumbnail brief
- [ ] publishing workflow
- [ ] performance feedback loop

---

# 23 — INTERACTIONS / ANIMATION

- [ ] event model
- [ ] click
- [ ] hover
- [ ] focus
- [ ] active
- [ ] submit
- [ ] scroll
- [ ] load
- [ ] timer
- [ ] open/close
- [ ] navigation
- [ ] show/hide
- [ ] toggle
- [ ] state machine
- [ ] transition
- [ ] animation timeline
- [ ] keyframes
- [ ] reduced-motion
- [ ] interaction validation
- [ ] performance safeguards

---

# 24 — ACCESSIBILITY

- [ ] semantic HTML
- [ ] heading hierarchy
- [ ] alt text
- [ ] labels
- [ ] ARIA
- [ ] keyboard navigation
- [ ] focus order
- [ ] focus visibility
- [ ] contrast warnings
- [ ] screen-reader metadata
- [ ] form validation accessibility
- [ ] editor accessibility checks
- [ ] public accessibility audit

---

# 25 — SEO

- [ ] title
- [ ] description
- [ ] canonical
- [ ] Open Graph
- [ ] X/Twitter card
- [ ] structured data
- [ ] sitemap
- [ ] robots
- [ ] per-page SEO
- [ ] SEO preview
- [ ] redirects
- [ ] broken-link detection

---

# 26 — ANALYTICS / INSIGHTS

- [ ] page views
- [ ] button clicks
- [ ] social clicks
- [ ] stream events
- [ ] conversion events
- [ ] privacy-aware analytics
- [ ] retention policy
- [ ] admin dashboard
- [ ] editor/content performance
- [ ] content performance
- [ ] stream performance
- [ ] anomaly detection later

---

# 27 — ADMIN PLATFORM

- [ ] dashboard
- [ ] navigation
- [ ] responsive admin
- [ ] diagnostics
- [ ] page list
- [ ] content management
- [ ] schedule
- [ ] socials
- [ ] VOD
- [ ] media
- [ ] settings
- [ ] SEO
- [ ] analytics
- [ ] integrations
- [ ] editor management
- [ ] preview
- [ ] recovery
- [ ] history
- [ ] permissions

---

# 28 — SECURITY / AUDIT / PERMISSIONS

- [ ] HttpOnly
- [ ] Secure cookie
- [ ] SameSite
- [ ] password hash
- [ ] CSRF
- [ ] rate limiting
- [ ] RBAC
- [ ] API authorization
- [ ] public/admin separation
- [ ] Cloudflare Secrets
- [ ] audit log
- [ ] input validation
- [ ] output validation
- [ ] file validation
- [ ] replay protection where applicable
- [ ] action permission `can()` checks
- [ ] AI permission boundary

---

# 29 — BACKUP / RESTORE / IMPORT / EXPORT

- [ ] full backup
- [ ] page backup
- [ ] revision backup
- [ ] media references
- [ ] restore validation
- [ ] rollback
- [ ] import/export JSON
- [ ] migration compatibility
- [ ] backup integrity check
- [ ] recovery drill

---

# 30 — PERFORMANCE / PRODUCTION

- [ ] bundle review
- [ ] lazy loading
- [ ] image optimization
- [ ] caching
- [ ] cache invalidation
- [ ] Core Web Vitals
- [ ] rendering performance
- [ ] large-page performance
- [ ] large-tree editor performance
- [ ] history memory limits
- [ ] autosave efficiency
- [ ] API latency monitoring
- [ ] production smoke test
- [ ] visual regression baseline

---

# 31 — AI EDITOR / AUTOMATION

AI ugyanazt az action rendszert használja, mint a kézi Editor.

Pipeline:
`Intent → Plan → Actions → Permission → Validation → Preview/Diff → Approval → Execute → Verify → Audit → Version`

- [ ] AI page operations
- [ ] AI element operations
- [ ] AI style/layout operations
- [ ] AI responsive operations
- [ ] AI content generation
- [ ] AI SEO assistance
- [ ] AI accessibility QA
- [ ] AI visual QA
- [ ] action permissions
- [ ] approval rules
- [ ] rollback
- [ ] audit
- [ ] rate/cost controls

---

# 32 — SANCI STREAM ASSISTANT / INTELLIGENCE

## Live stream intelligence
- [ ] live stream monitoring
- [ ] silence/speech detection
- [ ] chat activity analysis
- [ ] technical issue detection
- [ ] audio problem detection
- [ ] stream quality checks
- [ ] scene suggestions
- [ ] context-aware ideas
- [ ] interesting moment detection
- [ ] post-stream summary

## Content intelligence
- [ ] VOD analysis
- [ ] clip candidates
- [ ] Short candidates
- [ ] title/description suggestions
- [ ] platform variants
- [ ] thumbnail briefs
- [ ] publishing recommendations
- [ ] content performance analysis

## Streamer memory / learning
- [ ] streamer profile
- [ ] long-term memory
- [ ] preferences
- [ ] historical outcomes
- [ ] experiment tracking
- [ ] evaluation cycle
- [ ] feedback loop

---

# 33 — AUTOMATION PLATFORM

`Trigger → Condition → Action → Result → Verify → Audit`

- [ ] scheduled automations
- [ ] event automations
- [ ] content workflows
- [ ] media workflows
- [ ] stream workflows
- [ ] notification workflows
- [ ] retry policy
- [ ] idempotency
- [ ] failure handling
- [ ] permissions
- [ ] audit

Queues/Durable Objects csak akkor, ha valós háttérfeladat vagy realtime követelmény indokolja.

---

# 34 — FOLYAMATOS FUNKCIÓFELFEDEZÉS

Ez a szakasz **nem lezárható egyszer és mindenkorra**.

Minden jelentős editor/platform bővítés előtt ellenőrizni kell:
- modern visual builder minták;
- GrapesJS / Craft.js / Puck architekturális minták;
- új responsive/layout megoldások;
- accessibility;
- performance;
- reusable components;
- design systems;
- collaboration/conflict;
- backup/recovery;
- AI action safety;
- stream/content intelligence.

Új funkció esetén:
1. azonosítás;
2. cél és felhasználási eset;
3. függőségek;
4. Page Model/adatmodell;
5. Command/Action;
6. Inspector/Canvas/UI;
7. persistence;
8. teszt;
9. MASTER-be felvétel;
10. implementáció;
11. felhasználói validáció.

---

# 35 — AKTUÁLIS ÁLLAPOT ÉS FOLYTATÁSI SZERZŐDÉS

## Lezárt, felhasználó által ellenőrzött jelenlegi pontok
- [x] E2 Core command/state tesztkapu: 12/12 PASS.
- [x] Geometry Inspector X/Y/width/height/position kézi szerkesztése.
- [x] Geometry változások Command API → Page Model → Canvas Engine lánca.
- [x] Geometry browser teszt: felhasználó visszajelzése: **„Működik”**.
- [x] 6.2 Geometry Inspector presets: mind az 5 felhasználói teszt PASS.
- [x] Elements panel alapfunkciók és kijelölés tesztelve.
- [x] Shell state persistence: felhasználói teszt PASS.
- [x] Panel collapse/reopen: felhasználói teszt PASS.
- [x] Panel width min/max: felhasználói teszt PASS.
- [x] Inspector kapcsolat 8.1–8.6: felhasználói tesztek PASS.

## JELENLEGI AKTÍV MUNKASÁVOK — A MASTER EGYETLEN FOLYTATÁSI IGAZSÁGA

A korábbi, már lezárt Rich Text B/I és Elements-palette tesztpontok nem lehetnek aktív folytatási pontok. A jelenlegi MASTER állapotot a 40.34 és az alábbi két párhuzamos munkasáv határozza meg.

### A — PC/Desktop multi-select
- [x] canonical multi-select interaction implementáció
- [ ] teljes browser teszt
- [ ] Editor Core/CI kapu
- [ ] regresszióteszt
- [ ] felhasználói PASS

### B — Mobile/Touch multi-select
- [ ] teljes touch interaction audit
- [ ] long-press → multi-select mód
- [ ] további tap → add/remove
- [ ] látható multi-select mód és kijelölt elemszám
- [ ] Kész / Mégse működés
- [ ] Canvas + Layers közös selection
- [ ] touch edge case-ek: scroll vs long-press, accidental tap, locked/root, nested nodes
- [ ] mobile browser teszt- [ ] regresszió + felhasználói PASS

### Függőségi kapu
**Group/Ungroup implementáció csak az A és B multi-select kapu PASS állapota után indulhat.**

### Következő végrehajtási sorrend
1. A PC multi-select élő tesztje külön lezárható.
2. B mobil/touch audit és implementáció párhuzamosan haladhat.
3. Mindkét sáv PASS után Group/Ungroup contract → command → unit/integration → CI → browser.
4. Ezután a Command API következő valódi domain-gapjei: page lifecycle (rename/duplicate teljes Editor v2 integráció), component/template, media, persistence.
5. A roadmap többi [ ] pontja nem veszik el; a 40.x szakasz minden újonnan azonosított hiányt pontosít.

### 9.1.0 — Elements palette javítás — syntax/runtime előellenőrzés
A frissítés után a böngésző az `app.js` betöltésekor syntax error-t jelzett: `app.js?v=20260918-8:10:492`.

A teljes érintett `app.js`-t újra átnéztük. A hiba oka a frissen hozzáadott `ELEMENT_DESCRIPTIONS` objektum néhány idézőjel nélküli, szóközt vagy `/` jelet tartalmazó kulcsa volt (pl. `Rich Text`, `Social Links`, `Badge/Tag`, `Business Contact`, `About Me`, `Sanci Button`). Emellett a fájlban egy literal `\\n` került a `const groups` elé.

Javítás:
- az érintett leírás-kulcsok érvényes string kulcsokká lettek alakítva;
- a hibás literal sortörés normalizálva lett;
- csak az `app.js` módosult, a működési logika nem lett újraépítve.

Javító commit:
- app: `0536aedc45d3963bc7ebcf9f8d3581d2958755ca`
- app content SHA: `bb35e394cca4edb9f13ee2e3719f72c02bfb7855`

A user által jelzett hiba alapján az előző változat **nem tekinthető teszteltnek**. A jelenlegi változatnál először a böngészős betöltést és az Elements panel megjelenését kell ellenőrizni.

### 9.1.0 — Elements palette második syntax hiba javítva
A felhasználó újabb betöltési hibát jelzett: `app.js?v=20260918-8:10:1702`.

A teljes aktuális `app.js` 10. sorát újraellenőrizve a hiba oka az `ELEMENT_DESCRIPTIONS` objektumban maradt, szóközt tartalmazó, idézőjel nélküli kulcsok voltak, többek között `Élő állapot`, `Stream számláló`, `Játékkártya`, `Játéklista`, `Egyedi elem` és hasonló kulcsok. Ezek JavaScript objektumkulcsként így syntax error-t okoztak.
Javítás:
- minden érintett, szóközt tartalmazó kulcs érvényes string kulccsá alakítva;
- működési logika nem változott;
- app.js frissített tartalma visszaolvasva: a leírásobjektum szintaktikailag konzisztens.

Javító commit:
- app: `487cee39dd89e2eb1ece26304294dce49d64770b`
- app content SHA: `40f8180d727d4d6ca70b3614cb5644511f17043b`

A következő lépés előtt a böngészős betöltés és az Elements panel runtime ellenőrzése szükséges. A korábbi syntax hiba miatt a palette funkció még nem tekinthető felhasználó által lezártnak.

### Egyetlen aktuális teszt
1. frissítsd az editor oldalt teljes újratöltéssel;
2. ellenőrizd, hogy az `app.js` már nem ad syntax error-t;
3. nyisd meg az **Elemek** panelt: a kategóriafejlécek látszanak, alapból csukva;
4. nyiss ki egy kategóriát: az elemek jelenjenek meg;
5. az elemgombok mellett legyen kis **i** ikon;
6. az **i** megnyomása leírást mutasson, és ne adjon hozzá elemet;
7. az elemgomb továbbra is adjon hozzá elemet;
8. jelezd, hogy működik-e. **Más tesztre addig nem lépünk tovább.**


### 9.1.0 — Elements palette: üres lista javítása
A felhasználó jelezte, hogy az editor már betölt, de az Elemek listában nem jelentek meg elemek.

Újraellenőrzés alapján a palette renderelését robusztusabbá tettem:
- a meglévő `groups` típusértéket közvetlenül használja, nem csak a név alapján történő visszakeresést;
- hiányzó típus esetén továbbra is használható a `typeForElement()` fallback;
- az `#elementList` hiányát külön `SANCI-UI-E002` hibakóddal jelzi;
- ha egyetlen érvényes elem sem kerül a listába, `SANCI-UI-E003` diagnosztikai hibát ad;
- az elemek kategóriánként továbbra is csukva indulnak;
- az i súgó és az elem hozzáadása logikája változatlan.

Javító commit:
- app: `b02e05a5309cb4f7d1321f9655bfe1e8ba27f30a`
- content SHA: `570d586fd4d17f2d059749757f87737df6502689`

A következő egyetlen aktív pont továbbra is a runtime ellenőrzés.

### 9.1.0 — Rich Text elem hozzáadásának javítása

A felhasználói teszt során az Elements palette többi eleme hozzáadható volt, de a **Rich Text** elem nem. A teljes Command/Schema lánc ellenőrzése alapján a konkrét ok:

- az `element.add` generic `createNode()` útvonalon hozta létre a Rich Text node-ot;
- a Rich Text node így nem kapott `props.richText` canonical dokumentumot;
- a 10.1.2.2-ben bevezetett Rich Text validation ezt helyesen elutasította;
- tehát nem a palette típusa vagy a szülőválasztás volt hibás, hanem a Rich Text node létrehozása nem követte az új canonical adatmodellt.

Javítás:
- `commands.js`: az `element.add` Rich Text esetén automatikusan létrehozza a `createEmptyRichText()` canonical dokumentumot;
- a művelet továbbra is ugyanazon `Command → Validation → Page Model → History → Canvas → Persistence` láncot használja;
- a többi elem hozzáadási útvonala változatlan;
- editor cache frissítve.

Javító commitok:
- commands: `23faaf85a32cc8add77f4fc1158202c862850656`
- commands content SHA: `637f43440e6c036acce26aeb83ea7c61b40e2a50`
- cache/index: `a54aa07a29e4b7f7c6e880db04428a4bc8422aa1`
- index content SHA: `8c4e5217d666beadace0e29c3905282395d244f4`

Statikus visszaolvasás: PASS.
Felhasználói/runtime teszt még hátra.

### 9.1.0 — Elements palette „elem hozzáadása” — LEZÁRVA
**Felhasználói teszt:** PASS — a felhasználó visszajelzése: **„Működik”**.

Ellenőrzött:
- Elements kategóriák megjelenése;
- kategóriák csukott alapállapota;
- elemek hozzáadása;
- Rich Text hozzáadása;
- Rich Text automatikus canonical üres dokumentuma;
- elem kijelölése hozzáadás után.

A Rich Text hozzáadási hibát a `element.add` Command javításával oldottuk meg: Rich Text node létrehozásakor automatikusan létrejön a `createEmptyRichText()` dokumentum.

Kapcsolódó javító commitok:
- commands: `23faaf85a32cc8add77f4fc1158202c862850656`
- cache/index: `a54aa07a29e4b7f7c6e880db04428a4bc8422aa1`

**Státusz:** `[x]`.

### KÖVETKEZŐ EGYETLEN AKTÍV PONT — 10.1.2.2 Rich Text strukturált Command + Validation runtime teszt
Most már visszatérünk a Rich Text rendszer integrációs tesztjéhez. UI-t még nem építünk.

Tesztelendő sorrend:
1. létrehozott Rich Text node canonical modellje;
2. strukturált Rich Text tartalom beállítása;
3. valid modell elfogadása;
4. invalid modell elutasítása;
5. rollback;
6. Undo;
7. Redo;
8. mentés/reload;
9. Canvas render;
10. user confirmation.

**Más fejlesztési pontra addig nem lépünk tovább, amíg ez a tesztkapu nincs lezárva.**


### 9.1.2 — Diagnostics műveleti eredményellenőrző réteg — LEZÁRVA

Cél: a Diagnostics ne csak tényleges JavaScript/Command/API/UI hibákat jelezzen, hanem az olyan „csendes” hibákat is, amikor egy felhasználói művelet lefutónak tűnik, de a várt eredmény nem jön létre.

Alapelv:
- a Diagnostics továbbra is csak megfigyelő/ellenőrző réteg;
- nem hoz létre második state-, Page Model-, selection-, history- vagy command-rendszert;
- az ellenőrzés a meglévő Command → Validation → Page Model → History → Canvas → Persistence lánc eredményét vizsgálja;
- a hibák egyedi `SANCI-VERIFY-E...` kódot kapnak.

Első célzott művelet: **Elem hozzáadása**.

Implementáció:
- `diagnostics.verify()` ellenőrző primitive elkészült;
- az `element.add` művelet ellenőrzése bekötve;
- a létrejött node Page Model-helye és a Canvas-megjelenés ellenőrzése megtörténik;
- eltérés esetén `SANCI-VERIFY-E001/E002` kerül a Diagnosticsba;
- a megoldás nem vezet be második state-, selection-, history- vagy command-rendszert.

Implementációs commitok:
- diagnostics verification primitive: `b7549eeddacb9f91f805c178f0d17673f8168bf0`
- Elem hozzáadása eredményellenőrzés: `3750944f90e559640a3827fd93f76e5723701b39`

### Runtime teszt eredménye — PASS
A felhasználó normál elem hozzáadását ellenőrizte.

Ellenőrzött:
- az elem hozzáadása sikeresen lefutott;
- az elem megjelent a Canvason;
- az elem kijelölődött;
- a Diagnostics nem jelzett hibát: `✓ 0 hiba`.

**Felhasználói visszaigazolás:** „Jó”.

A normál `element.add` műveleti eredményellenőrzés így lezárható. A szándékosan hibás/hiányos eredmény szimulációja továbbra is későbbi verification-regressziós tesztként marad, nem blokkolja a következő Rich Text tesztkaput.

**Státusz:** [x].

**KÖVETKEZŐ ÉS EGYETLEN AKTÍV PONT:** **10.1.2.2 — Rich Text strukturált Command + Validation runtime/integrációs teszt**, pontosan onnan folytatva, ahol a Diagnostics kiegészítése előtt abbahagytuk. UI-t még nem építünk.

### 9.1.1 — Editor Diagnostics / automatikus hibakereső — LEZÁRVA
A felhasználó kérésére elkészült az Editor v2 első automatikus hibakereső rendszere.

Cél: ha az editorban JavaScript, Promise, Command, API vagy UI hiba történik, azonnal legyen látható egy egyedi hibakód és részletes technikai információ.

Architektúra:
- a Diagnostics csak megfigyelő/reporting réteg;
- nem hoz létre második Page Model-, selection-, history- vagy command-rendszert;
- az adatok átmeneti, böngészőben élő diagnostics listában vannak;
- a canonical editor state továbbra is változatlan marad.

Elkészült:
- `public/editor-v2/diagnostics.js`: strukturált hibarekordok, kódok, forrás, üzenet, fájl/sor/oszlop, technikai részletek;
- automatikus JavaScript runtime error és unhandled Promise rejection figyelés;
- látható `✓ 0 hiba` / `🔴 N hiba` jelző;
- részletes hibapanel;
- technikai részletek lenyitható nézetben;
- Másolás és Törlés művelet;
- Command hibák jelentése: `SANCI-CMD-E001`;
- API hibák jelentése: `SANCI-API-E001/E002`;
- UI hibák jelentése: `SANCI-UI-E001`;
- korai boot/module hibák továbbítása a diagnostics rendszerbe: `SANCI-BOOT-E001`;
- `boot.js` korai hibapuffert is használ, így az app modul elindulása előtti hibák sem vesznek el;
- diagnostics UI desktop és mobile nézetre is kapott saját CSS-t;
- app/index cache verzió frissítve.

Commitok:
- diagnostics: `2106b7f8d0a2b386bc1bdd519c63db3feb6b2eca`
- boot: `edf97107b27b7968092ed6c08f4307500d318b20`
- app: `f533d718138da5f65dd86b12427cfb88b2504b4e`
- CSS: `70833b8e46b8f19bb0585eebad06d6e384fde8d5`
- cache/index: `bbfc000aaab310db1596f07232266604400159b1`

Statikus visszaolvasás: PASS.
- diagnostics modul: PASS;
- boot error bridge: PASS;
- app Command/API/UI diagnostics bekötés: PASS;
- diagnostics CSS: PASS;
- app cache: PASS.

Runtime teszt: PASS. A felhasználó visszaigazolta a működést.

**Felhasználói/runtime teszt eredménye:** PASS.
- `✓ 0 hiba` állapot megjelenik;
- a diagnosztikai panel megnyitható;
- a kontrollált teszthiba `SANCI-TEST-E001` hibakóddal megjelent;
- a hibaszámláló `🔴 1 hiba` állapotra váltott;

**Egyetlen aktuális folytatási pont:** 04.3 — Foundation további ellenőrzése: véletlen törlés elleni ellenőrzés + renderer hibamentesség, majd a teljes 04.3 kapu lezárása vagy a talált hiba javítása.

## 40.24 — Foundation teljes újrateszt: véletlen törlés + renderer hibamentesség — 2026-09-21

**Állapot:** [x] PASS — felhasználói élő teszttel lezárva.

A 04.3 Foundation teljes újrateszt utolsó ellenőrzési pontja lezárva.

Ellenőrzött:
1. locked elem törlésének védelme;
2. normál elem törlése;
3. root elem törlésének védelme;
4. canonical `/` renderer hibamentes működése;
5. canonical `/p/home` renderer hibamentes működése;
6. canonical `/p/community` renderer hibamentes működése;
7. Diagnostics / renderer ellenőrzés.

**Felhasználói visszaigazolás:** „Ezek jók”.

A teljes 04.3 Foundation újrateszt lezárható: routing, legacy redirectek, Worker health, D1, public pages, auth/session, GitHub/Cloudflare build-deploy kapu, törlésvédelem és canonical renderer ellenőrzések PASS állapotban vannak. Új kódmódosítás nem történt.

**Egyetlen aktuális folytatási pont:** 05.3 — `move` + `resize` audit lezárva; a következő lépés csak a teljes 5.2 action-katalógus következő valóban hiányzó elemének auditja, kódolás előtt.


## 40.25 — `move` + `resize` geometry audit korrekció — 2026-09-21

**Állapot:** [x] AUDIT PASS — nincs szükség új geometry commandra.

A felhasználói visszajelzés alapján tisztáztuk, hogy az Editor v2 jelenleg ténylegesen biztosítja:
- X pozíció módosítását;
- Y pozíció módosítását;
- szélesség módosítását;
- magasság módosítását;
- responsive desktop/tablet/mobile környezetet;
- meglévő Canvas viewport méretpreseteket.

A teljes érintett kód auditja ezt megerősítette:
1. A Geometry Inspector X/Y/width/height módosításai a meglévő `responsive.set` Command API-n keresztül írják a Page Model `responsive[device]` állapotát.
2. A `canvas-engine.js` ugyanebből a Page Model + responsive állapotból számolja és rendereli a geometriát.
3. A `property-registry.js` az X/Y/width/height tulajdonságokat responsive propertyként kezeli.
4. Nincs második geometry state, nincs párhuzamos `move` vagy `resize` renderer/mutációs rendszer.
5. Az Editor jelenlegi kódjában nincs külön canvas drag/resize interaction path; a tényleges geometry szerkesztés jelenleg az Inspectorból történik.
6. A `move` és `resize` külön Command névként való bevezetése önmagában nem adna új felhasználói funkciót, viszont párhuzamos command-logikát hozna létre.

**Döntés:** nem építünk csak a Command-katalógus miatt mesterséges `move`/`resize` wrapper commandokat. A meglévő geometry útvonal marad a canonical megoldás.

**Fontos pontosítás:** a jelenlegi `sizes={desktop:1440, tablet:768, mobile:390}` a Canvas viewport preseteket jelenti; ez külön fogalom az elem X/Y/width/height szerkesztésétől. Az audit során külön elem-méret preset commandot nem találtunk.

**Kódmódosítás:** nem történt.

**Következő egyetlen aktív pont:** az 5.2 Command API katalógus következő valóban hiányzó actionjének teljes auditja. Nem vezetünk be új commandot addig, amíg a meglévő funkció nem bizonyul ténylegesen elégtelennek.


## 40.26 — Command API következő hiányzó terület: Page lifecycle audit — 2026-09-21

**Állapot:** [~] AUDIT FOLYAMATBAN — kódmódosítás még nem történt.

A teljes következő action-terület vizsgálata alapján:
- `page.create` funkcióként már létezik az Editor v2 UI-ban és az `/api/admin/pages` POST API-ban;
- `page.delete` szerveroldali API-műveletként már létezik, utolsó oldal törlését védi és audit logot ír;
- `page.rename` szerveroldali PATCH API-műveletként már létezik és audit logot ír;
- `page.duplicate` jelenleg nem került elő sem az Editor v2 command engine-ben, sem az admin pages API-ban;
- az Editor v2 `commands.js` jelenleg nem tartalmaz `page.*` commandokat;
- a page létrehozása jelenleg közvetlen API-hívással történik az `app.js`-ből, nem a központi command engine-en keresztül.

**Fontos döntés:** nem kezdünk azonnal `page.*` commandok építésébe. Először azt kell meghatározni, hogy a page lifecycle commandoknak milyen canonical határa legyen az Editor lokális Page Modelje, a D1 persistence API és a history/undo rendszer között. Különösen a törlés és duplikálás esetén nem szabad olyan lokális history-t készíteni, amely nincs összhangban a szerveroldali perzisztenciával.

**Kódmódosítás:** nem történt.

**Következő egyetlen aktív pont:** `page.create/delete/rename/duplicate` adatfolyam és history/persistence szerződésének teljes auditja.


## 40.27 — Page lifecycle teljes kód-audit és MASTER-korrekció — 2026-09-21

**Állapot:** [x] AUDIT PASS — a page létrehozás meglévő funkció; a valódi Editor v2 hiány a page törlése.

A releváns teljes adatfolyamot összevetettük: Editor v2 `app.js` → Editor Core → admin pages API → D1 → Page Model → history/persistence, valamint a jelenlegi admin tartalomkezelő felületet.

### Megállapítások
- **Oldal létrehozás:** működő Editor v2 funkció. Az `app.js` `createNew()` canonical Editor v2 Page Model dokumentumot készít és POST-olja az `/api/admin/pages` endpointot.
- **Oldal törlés:** az Editor v2 oldallistájában jelenleg nincs törlés gomb/művelet. Ez a tényleges felhasználói hiány.
- **Szerveroldali törlés:** az `/api/admin/pages` route már tartalmaz DELETE kezelést, body-ban `id` alapján, és védi az utolsó oldalt. Audit logot is ír.
- **Page rename:** a backendben már van PATCH alapú névváltoztatás, de az Editor v2 jelenlegi page-list UI-ja nem használja.
- **Page duplicate:** nincs jelenlegi Editor Core/API/UI megoldás; ezt most nem építjük be, mert a felhasználó konkrét hiánya a törlés.
- **Editor history:** a jelenlegi `history.undo/redo` kizárólag az aktuális Page Model dokumentum snapshotjait kezeli. D1-oldal törlését nem szabad úgy hozzáadni, mintha az egyszerű node-művelet lenne.
- **Admin legacy/content UI eltérés:** a `public/admin.html` jelenlegi REST-hívásai (`/api/admin/pages/:id`, `PUT`, `content`, `published`) nem egyeznek a jelenlegi `src/routes/admin/pages.ts` szerződésével (`DELETE` body-id, `PATCH` title, POST canonical document). Ezt külön technikai adósságként rögzítjük; nem keverjük össze az Editor v2 page-delete implementációval.

### Következtetés
A MASTER korábbi `page.create/delete/rename/duplicate` megfogalmazása túl tág volt. A jelenlegi fejlesztési feladatot a tényleges felhasználói hiányra szűkítjük: **Editor v2-ben legyen biztonságos, szerveroldalilag perzisztált oldal-törlés, utolsó oldal védelemmel, sikeres törlés után lista/állapot frissítéssel és hibakezeléssel.**

**Kódmódosítás ebben az auditlépésben:** nem történt.

**Következő egyetlen aktív pont:** `page.delete` Editor v2 implementáció → unit/integration teszt → GitHub CI → élő browser teszt → MASTER lezárás.


## 40.28 — Command API fejlesztési szabályok és sorrend összehangolása — 2026-09-21

**Állapot:** [x] AUDIT / TERV PASS — kódmódosítás még nem történt.

A 05.2/05.3 Command API tervet összevetettük a tényleges `commands.js`, Page Model, history, responsive geometry és tesztstruktúrával. A tervet korrigáltuk, hogy ne követeljen mesterséges `move`/`resize` commandokat, miközben a funkciók már működnek a canonical `responsive.set` útvonalon.

### Kötelező command-fejlesztési lánc
- contract → validation/precondition → canonical Page Model mutation → history/transaction → rollback/error safety → szükség esetén D1/audit persistence → unit/integration test → CI → UI/browser test.

### Canonical határok
- **Element command:** lokális Page Model mutation, központi history-val.
- **Page lifecycle command:** szerveroldali D1 persistence boundary; nem szabad egyszerű node historyként kezelni.
- **Canvas:** csak renderel, nem kap külön mutation state-et.
- **Inspector/UI:** commandot hív, nem közvetlenül módosítja a Page Modelt.

### Jelenlegi command coverage
Már stabil: element add/update/content, richtext content, style, responsive, visibility, lock, duplicate/delete, hierarchy reparent/reorder, selection, undo/redo, transaction/batch.
Még valódi domain-gap: group/ungroup, component/template/media műveletek és page lifecycle/persistence műveletek teljes Editor v2 integrációja.

**Következő egyetlen aktív kódpont továbbra is:** `page.delete` Editor v2 bekötése a már meglévő backend DELETE API-ra, majd annak tesztkapuja. Ezután folytatjuk a command-katalógust függőségi sorrendben.


## 40.29 — Editor v2 Page Delete implementáció — 2026-09-21

**Állapot:** [x] PASS — felhasználói élő böngészős teszttel lezárva.

A 40.28 szerinti következő egyetlen aktív pont, az Editor v2 biztonságos oldal-törlésének bekötése elkészült.

### Implementáció
- Az Editor v2 **Oldalak** listájában minden oldal kapott külön törlés gombot.
- A törlés külön gomb, nem a teljes oldalsor kattintása, így nem ütközik az oldal kiválasztásával.
- Törlés előtt egyértelmű böngészős megerősítés jelenik meg.
- A UI a már meglévő canonical backend szerződést használja: `DELETE /api/admin/pages` + `{id}` body.
- A backend meglévő utolsó-oldal védelme változatlan maradt; az Editor nem hozott létre párhuzamos törlési szabályt.
- Sikeres törlés után az oldallista újratöltődik.
- Ha az aktuális oldal törlődött, az Editor automatikusan kiválaszt egy megmaradt oldalt.
- Ha nem az aktuális oldal törlődött, az aktuális Editor state megmarad.
- API hiba esetén a meglévő Diagnostics/API hibakezelési útvonal fut.
- A page lifecycle törlés nem került bele a node-level `history.undo/redo` rendszerbe; a D1 persistence marad a page lifecycle canonical határa.

### Kódmódosítások
- `public/editor-v2/app.js` — `deletePage()` + oldallistáska törlésvezérlő + sikeres törlés utáni állapotkezelés.
  - commit: `26c35cc32e6077c6b78fac0975fd1a3a657f3ce1`
- `public/editor-v2/editor.css` — oldal törlés gomb és oldalsor layout.
  - commit: `516f1ce8b2040d5653d4993801fa1669ce70512d`

**Fontos:** backend `src/routes/admin/pages.ts` nem módosult, mert a szükséges DELETE API már canonical és működő volt.

### Következő egyetlen aktív tesztpont
1. Editor teljes újratöltése.
2. Oldalak panel megnyitása.
3. Ellenőrizni, hogy minden oldalnál látható a `×` törlés gomb.
4. Nem aktuális oldal törlése → lista frissül, aktuális oldal marad.
5. Aktuális oldal törlése → automatikusan másik oldal töltődik be.
6. Törlés megszakítása → semmi nem törlődik.
7. Utolsó oldal törlésének próbája → backend elutasítja, oldal megmarad.
8. Diagnostics → 0 hiba normál esetben.
9. Ezután GitHub CI ellenőrzés, majd MASTER lezárás.


## 40.30 — Editor v2 Page Delete élő teszt PASS — 2026-09-21

**Állapot:** [x] PASS — felhasználói visszaigazolással lezárva.

A 40.29-ben elkészült oldal-törlés teljes élő böngészős tesztje a felhasználó visszajelzése alapján működik.

Ellenőrzött terület: oldal törlés UI, megerősítés, lista frissülés, aktuális oldal kezelése, utolsó oldal védelme és hibamentes működés.

**Következő egyetlen aktív pont:** a Command API következő valódi domain-hiánya, az **Editor v2 group / ungroup** teljes kód-auditja és szerződésének megtervezése; csak az audit után következhet kódmódosítás.


## 40.36 — PC/DESKTOP MULTI-SELECT TESZT ELŐAUDIT — 2026-09-21

**Állapot:** [x] KÓDAUDIT PASS — új kódmódosítás nélkül; a tényleges browser teszt a következő felhasználói tesztkapu.

Ellenőrizve a jelenlegi `app.js`, `state.js`, `commands.js`, `core.test.js` és Editor Core workflow alapján:
- [x] egyetlen közös `selectNodeInteraction()` kezeli a Canvas + Layers kijelölést;
- [x] normál kattintás → egyetlen kijelölés;
- [x] Ctrl/Cmd + kattintás → add/remove toggle;
- [x] Shift + kattintás → azonos parent alatti determinisztikus sibling-range;
- [x] root elem → mindig egyetlen kijelölés;
- [x] eltérő parent esetén a Shift fallback egyetlen célpont kijelölés;
- [x] `state.selection.ids` + `primaryId` marad az egyetlen canonical selection state;
- [x] Canvas és Layers ugyanazt a selection helper-t használja;
- [x] üres Canvas-kattintás továbbra is selection clear;
- [x] Inspector több kijelölt elem esetén nem mutat hamis „közös” értéket: jelenleg az első kijelölt node adatait használja — ezt későbbi explicit multi-edit UX pontként kell kezelni;
- [x] Editor Core workflow Node 24-et használ és a core tesztparancsot futtatja;
- [ ] browser: normál kattintás;
- [ ] browser: Ctrl/Cmd toggle add;
- [ ] browser: Ctrl/Cmd toggle remove;
- [ ] browser: Shift range előre;
- [ ] browser: Shift range visszafelé;
- [ ] browser: Canvas ↔ Layers szinkron;
- [ ] browser: selection visuals;
- [ ] browser: root/locked edge case;
- [ ] browser: undo/redo regresszió;
- [ ] browser: diagnostics 0 hiba;
- [ ] user PASS.

**Következő teszt:** PC browser multi-select élő teszt. Group/Ungroup továbbra is blokkolva marad mindaddig, amíg a PC és mobil multi-select kapu egyaránt PASS.

## 40.35 — TELJES MASTER HIÁNYOSSÁGI AUDIT — 2026-09-21

**Állapot:** [x] AUDIT PASS — a MASTER szerkezete átvizsgálva; státusz- és lefedettségi pontosítások rögzítve, azonosított architekturális hiányterületek felvéve.

### 1. Státuszkonzisztencia
- A 35. fejezet korábbi Rich Text B/I aktív pontja elavult volt; lecserélve a tényleges 40.34-es PC + mobil multi-select munkasávokra.
- A 05.3 korábbi „AKTÍV” jelölése lezártra korrigálva.
- A 08.2 multi-select státusza a tényleges implementációhoz igazítva: [~].
- A Page CRUD törlés státusza a tényleges Editor v2 + élő teszt állapothoz igazítva.
- A 40.x történeti bejegyzések megmaradnak, de nem írhatják felül a jelenlegi 35. fejezetet.

### 2. Kötelezően felvett / pontosított hiányterületek

**A. Mobil/touch teljes editor**
- [ ] touch selection, long-press, multi-select mode
- [ ] drag/drop touch
- [ ] resize handles touch
- [ ] pan/zoom gesture
- [ ] touch target méretek
- [ ] scroll-vs-drag konfliktus
- [ ] keyboard nélküli alternatívák
- [ ] mobile toolbar/sheet/bottom-sheet UX
- [ ] mobile Inspector
- [ ] orientation/safe-area
- [ ] iOS/Android browser regression

**B. Collaboration / concurrency**
- [ ] multi-user presence
- [ ] locking/ownership
- [ ] realtime collaboration, ha indokolt
- [ ] optimistic concurrency
- [ ] conflict resolution
- [ ] merge/diff
- [ ] operation ordering
- [ ] offline queue
- [ ] reconnect
- [ ] collaboration audit

**C. Forms + data actions**
- [ ] form schema
- [ ] field validation
- [ ] submit action
- [ ] success/error/loading state
- [ ] spam/rate protection
- [ ] server action/API binding
- [ ] email/notification integration
- [ ] data privacy/retention
- [ ] secure secrets boundary

**D. Custom code / Embed biztonság**
- [ ] HTML/embed sandbox policy
- [ ] iframe allowlist
- [ ] script execution policy
- [ ] CSP
- [ ] third-party isolation
- [ ] unsafe HTML sanitization
- [ ] custom CSS scope
- [ ] custom JS explicit permission
- [ ] preview/publish security validation

**E. Localization / i18n**
- [ ] UI language architecture
- [ ] content language
- [ ] locale-aware dates/numbers
- [ ] timezone
- [ ] translation fallback
- [ ] per-page/per-content locale
- [ ] SEO hreflang where needed

**F. Legal / privacy / consent**
- [ ] privacy policy/content surface
- [ ] cookie/consent model where legally required
- [ ] analytics consent
- [ ] external embed consent where needed
- [ ] data export/delete
- [ ] retention/deletion policy
- [ ] audit access controls

**G. Deployment / release engineering**
- [ ] branch promotion strategy
- [ ] preview deployments
- [ ] migration gating
- [ ] deploy rollback
- [ ] feature flags- [ ] environment separation
- [ ] release notes
- [ ] production smoke automation
- [ ] CI required checks
- [ ] cache/version invalidation strategy

**H. Observability**
- [ ] structured logs
- [ ] request correlation IDs
- [ ] error aggregation
- [ ] performance metrics
- [ ] API latency/error dashboards
- [ ] D1 query monitoring
- [ ] R2/media failure monitoring
- [ ] alert thresholds
- [ ] privacy-safe logging

**I. Editor schema/version migration**
- [ ] schema version registry
- [ ] document migration runner
- [ ] backward compatibility policy
- [ ] migration preview
- [ ] migration rollback
- [ ] fixture corpus
- [ ] corrupted-document recovery

**J. Testing infrastructure**
- [ ] deterministic fixture set
- [ ] visual regression baseline
- [ ] responsive screenshot tests
- [ ] accessibility automated checks
- [ ] performance budgets
- [ ] browser matrix
- [ ] mobile device matrix
- [ ] migration tests
- [ ] backup/restore drill
- [ ] concurrency tests
- [ ] security regression suite

**K. Editor UX alapfunkciók, amelyek még explicit kaput igényelnek**
- [ ] hover/selection visuals
- [ ] keyboard navigation
- [ ] parent navigation / Escape
- [ ] drag/reorder/reparent
- [ ] resize handles
- [ ] guides/snap/alignment/distribute
- [ ] complete Layers/Navigator
- [ ] complete Inspector
- [ ] toolbar/save/preview/publish UX
- [ ] zoom/pan
- [ ] clipboard/context menu
- [ ] command palette
- [ ] complete mobile shell

**L. Content/editor feature completeness**
- [ ] typography
- [ ] spacing/box model
- [ ] flex/grid
- [ ] appearance
- [ ] transform/animation
- [ ] interactions
- [ ] media workflow
- [ ] dynamic bindings
- [ ] components/variants/templates
- [ ] Rich Text advanced features; a korábbi B/I elvetése nem jelenti a teljes Rich Text domain lezárását
- [ ] lists and structured content
- [ ] links/media embedding
- [ ] accessibility metadata

### 3. Kritikus függőségi sorrend
A hiányosságok nem egyszerre kerülnek kódolásra. A MASTER sorrendje:

**canonical schema → selection/hierarchy → group/ungroup → layout/manipulation → Inspector → responsive → components/templates → media → bindings/forms → page lifecycle → draft/preview/publish → version/rollback → backup/restore → security/accessibility/performance → AI/automation → production hardening.**

### 4. Új szabály
Egy roadmap [ ] pont csak akkor válhat [x]-re, ha implementáció, megfelelő unit/integration/CI, szükséges browser/production teszt, regresszió és felhasználói visszaigazolás is PASS, és a MASTER ugyanebben a lépésben frissült.

### 5. Következő aktív pont
**A + B multi-select munkasáv folytatása. Group/Ungroup csak a két multi-select kapu PASS után.**

## 40.31 — Group / Ungroup teljes kód-audit — 2026-09-21

**Állapot:** [x] AUDIT PASS — kódmódosítás még nem történt.

A Command API következő valódi domain-hiányát, a group / ungroup területet összevetettük a teljes Editor Core jelenlegi állapotával.

### Megállapítások
- A schema már tartalmaz `NODE_TYPES.GROUP` típust.
- A `canContain()` a group node-ot jelenleg normál containerként kezeli; külön group-invariáns nincs.
- A `element.add`, `element.delete`, `element.duplicate`, `hierarchy.reparent` és `hierarchy.reorder` már képesek a group típusú node-okra általános hierarchy műveleteket végrehajtani.
- Nincs `group` vagy `ungroup` Command a `commands.js`-ben.
- A selection state technikailag tömbös (`selection.ids`), de az aktuális UI fő útvonala továbbra is egy elsődleges node kijelölésére épül; külön multi-select interaction contractot nem találtunk.
- Nincs olyan canonical művelet, amely több kijelölt node-ból új GROUP node-ot hozna létre, a kijelöltek sorrendjét és közös parentjét kezeli, majd a children/parent kapcsolatokat atomikusan átépíti.
- Nincs olyan canonical művelet, amely egy GROUP node-ot biztonságosan felbont úgy, hogy a gyermekek a group eredeti parentjébe kerüljenek vissza, sorrendjük megmaradjon, majd a group eltűnjön.
- A jelenlegi transaction/batch/history infrastruktúra alkalmas lehet a group/ungroup műveletek atomikus kezelésére, ezért új history-rendszerre nincs szükség.
- A Page Model maradhat a canonical source of truth; Canvas csak renderel.

### Kötelező contract a későbbi implementációhoz
**group:**
1. legalább két kijelölt node szükséges;
2. azonos közvetlen parent szükséges, vagy explicit szabály kell a vegyes parent kezelésére — az első implementációban azonos parent legyen kötelező;
3. root nem csoportosítható;
4. locked node ne legyen csoportosítható, vagy a szabályt explicit módon definiálni kell — a meglévő lock-védelemhez igazodva első körben blokkoljuk;
5. a kiválasztott node-ok sibling sorrendje maradjon determinisztikus;
6. új GROUP node ugyanazon parent alá kerüljön, a kijelölés első elemének pozíciójába;
7. minden kijelölt node parentId-ja az új group ID legyen;
8. a group children sorrendje kövesse az eredeti sibling sorrendet;
9. egyetlen command + history entry legyen az egész művelet;
10. rollback és schema validation legyen kötelező.

**ungroup:**
1. csak GROUP node-on legyen engedélyezett;
2. locked group ne legyen bontható;
3. a group children kerüljenek a group eredeti parentjébe;
4. a gyermekek eredeti sorrendje maradjon meg;
5. a group helyén jelenjenek meg a gyermekek;
6. a group törlődjön;
7. selection determinisztikusan a felszabadított gyermekekre kerüljön;
8. egyetlen command + history entry legyen az egész művelet;
9. rollback és schema validation legyen kötelező.

### Fontos döntés
Nem építünk most rögtön kódot. Előbb a multi-select UX és a group/ungroup command contract együtt kell végleges legyen, mert a group command bemenete több node ID. Nem vezetünk be párhuzamos selection rendszert.

**Következő egyetlen aktív pont:** multi-select teljes adatfolyam auditja (Canvas + Layers + keyboard/pointer + selection state + history interaction), majd ebből közvetlenül a group command implementáció következik.


## 40.32 — Multi-select teljes adatfolyam audit — 2026-09-21

**Állapot:** [x] AUDIT PASS — kódmódosítás még nem történt.

A Group/ungroup előfeltételét, a multi-select teljes jelenlegi adatfolyamát ellenőriztük: State → Canvas → Layers → keyboard → Inspector → History.

### Megállapítások

- A canonical selection state már eleve több ID-t képes tárolni:
  - `state.selection.ids`
  - `state.selection.primaryId`
- A `setSelection()` deduplikálja az ID-kat és csak létező node-okat enged a selectionbe.
- A `selectedNodes()` a canonical Page Modelből állítja elő a kiválasztott node-okat.
- A Canvas render már az összes `selection.ids` elemet `selected` állapottal jelölheti.
- **A Canvas kattintás jelenleg nem multi-select:** a node click mindig `setSelection(state,[id])`, tehát egyetlen elemet cserél.
- **A Layers kattintás jelenleg nem multi-select:** a layer click szintén mindig `setSelection(state,[id])`.
- A jelenlegi `app.js`-ben nincs Ctrl/Cmd/Shift alapú selection toggle/range logika.
- A globális keyboard handler jelenleg Ctrl/Cmd+S és Ctrl/Cmd+Z/Shift+Z kezelésére szolgál; selection billentyűparancs nincs.
- A selection módosítása nem kerül history-be, ami helyes: a selection UI/editor state, nem Page Model mutation.
- A Geometry/Inspector jelenleg csak `selectedNodes()[0]` alapján szerkeszt, ezért több kijelölés esetén nincs definiált közös inspector-művelet.
- A meglévő history rendszer dokumentum snapshotokat kezel, ezért a későbbi Group/Ungroup egyetlen mutationként kezelhető és Undo/Redo-kompatibilis lehet.
- A Group node már canonical `NODE_TYPES.GROUP`, nincs szükség új node/state modellre.
- A group/ungroup művelethez a multi-selectnek nem kell külön history-rendszer; a selection state maradhat history-n kívül.

### Következtetés

A multi-select **adatmodell már készen áll**, de a felhasználói interaction layer hiányzik. Nem szabad új selection state-et létrehozni.

A következő implementáció kizárólag a meglévő canonical selection API-ra épüljön:

1. normál kattintás → egyetlen kijelölés;
2. Ctrl/Cmd + kattintás → kijelölés hozzáadása/eltávolítása;
3. Shift + kattintás → determinisztikus sibling-range kijelölés ugyanazon parenten;
4. Canvas és Layers ugyanazt a selection logikát használja;
5. primaryId determinisztikus marad;
6. root külön szabály szerint kezelendő;
7. üres Canvas kattintás továbbra is selection.clear;
8. a selection vizuális állapota Canvas + Layers oldalon azonnal szinkronizált;
9. Undo/Redo nem módosítja külön a selectiont; a Group/Ungroup command saját eredmény-selectiont explicit módon állítja.

### Fontos döntés

**Nem építünk még Group/Ungroup commandot.** Először a multi-select interaction kerül be a meglévő `setSelection()` / `selectedNodes()` canonical útra, utána unit + browser teszt, majd ebből következik a Group command.

**Kódmódosítás:** ebben az auditlépésben nem történt.

## 40.33 — Multi-select interaction implementáció — 2026-09-21

**Állapot:** [x] IMPLEMENTÁCIÓ PASS — kódmódosítás elkészült, élő böngészős teszt még hátra van.

A 40.32 audit alapján a multi-select interaction a meglévő canonical `state.selection` / `setSelection()` útvonalra került, új selection state nélkül.

### Implementáció
- Egyetlen közös `selectNodeInteraction(id,event)` helper kezeli a Canvas és Layers kijelölését.
- Normál kattintás → egyetlen node kijelölése.
- Ctrl/Cmd + kattintás → node hozzáadása vagy eltávolítása a kijelölésből.
- Shift + kattintás → az aktuális `primaryId` és a célpont közötti sibling-range kijelölése, az eredeti sibling sorrend alapján.
- Shift csak azonos közvetlen parent esetén alkalmaz range-et; más esetben biztonságosan single-select történik.
- A root node modifieres kijelölése is egyetlen root kijelölésre normalizálódik.
- A `primaryId` determinisztikusan a legutóbb kattintott/tartomány célpontja.
- Canvas és Layers ugyanazt a helper útvonalat használja.
- Az üres Canvas kattintás továbbra is `selection.clear`.
- Undo/Redo rendszerhez nem került külön selection history.
- Párhuzamos selection state vagy második mutációs út nem készült.

### Kód
- `public/editor-v2/app.js`
- commit: `c8444029629f18eea5363b5c24b68e9d74a020da`

### Következő egyetlen aktív tesztpont
1. Editor újratöltése.
2. Canvas normál single-select.
3. Canvas Ctrl/Cmd toggle: hozzáadás + eltávolítás.
4. Layers Ctrl/Cmd toggle: ugyanaz a selection.
5. Shift sibling-range kijelölés Canvasról.
6. Shift sibling-range kijelölés Layersből.
7. Canvas + Layers vizuális szinkron.
8. Root és eltérő parent edge case.
9. Diagnostics: 0 hiba.
10. Ezután CI, majd MASTER lezárás.

**Következő aktív párhuzamos munkasávok:**
- **A — PC/desktop multi-select:** a 40.33 implementáció élő browser tesztje, majd CI és lezárás.
- **B — Mobil/touch multi-select:** külön touch interaction audit + implementáció + mobil browser teszt, ugyanarra a canonical selection API-ra építve.

**Függőségi kapu:** a Group/Ungroup command csak akkor indulhat, amikor az A és B multi-select sáv is PASS állapotban van.


## 40.34 — PC + mobil párhuzamos multi-select fejlesztési modell — 2026-09-21

**Állapot:** [x] TERV / ARCHITEKTÚRA DÖNTÉS — kódmódosítás ebben a lépésben nem történt.

A felhasználói kérés alapján rögzítve: a fejlesztést nem kell sorban kizárólag PC → mobil irányban végezni. A **PC/desktop és mobil/touch multi-select párhuzamos munkasávként** halad, miközben továbbra is pontosan **egy MASTER terv** marad.

### Kötelező párhuzamos működési szabály
1. PC és mobil külön interaction/test track lehet.
2. Közös canonical selection state marad: state.selection.ids + primaryId.
3. Közös selection helper/API marad; nem készül platformonként második selection state.
4. A Page Model, Command API, history és renderer nem duplikálható PC és mobil között.
5. Minden egyes lépés után a **MASTER-DEVELOPMENT-PLAN.md** frissül, még akkor is, ha csak az egyik munkasáv haladt.
6. A MASTER mindig tartalmazza mindkét sáv legutolsó állapotát, teszteredményét, commitját és következő lépését.
7. Új beszélgetésben a MASTER az egyetlen folytatási igazságforrás; a párhuzamos `[~]` sávokból lehet folytatni.
8. Group/Ungroup csak akkor léphet tovább implementációra, ha a PC és mobil multi-select tesztkapuja is PASS.

### Aktuális sávállapot
- **A — PC/desktop:** 40.33 implementáció kész; browser teszt pending.
- **B — Mobil/touch:** interaction audit/implementáció pending; normál tap, long-press multi-select, további tap toggle, Kész/Mégse és Canvas/Layers szinkron a tervezett viselkedés.

**Következő lépés:** a két sáv párhuzamosan folytatható; először a mobil touch interaction teljes kód-auditja és implementációja, miközben a PC 40.33 browser tesztkapuja külön lezárható.


## 40.37 — MOBIL/TOUCH MULTI-SELECT IMPLEMENTÁCIÓ — 2026-09-22

**Állapot:** [x] IMPLEMENTÁCIÓ KÉSZ — élő mobil böngészős teszt még hátra van.

A PC/Desktop multi-select élő tesztjét a felhasználó későbbre halasztotta; a párhuzamos mobil munkasáv most továbbment. A mobil interaction ugyanarra a canonical \`state.selection.ids + primaryId\` és a meglévő \`setSelection()\` API-ra épül, külön selection state nélkül.

### Mobil interaction contract
- [x] normál rövid tap → single-select a meglévő Canvas/Layers click útvonalon;
- [x] long-press (~450 ms) → multi-select mód aktiválása és a célpont kijelölése;
- [x] multi-select módban további tap → add/remove toggle;
- [x] látható mobil action bar: kijelölt elemszám + \`Mégse\` + \`Kész\`;
- [x] \`Mégse\` → a long-press előtti selection visszaállítása;
- [x] \`Kész\` → a jelenlegi canonical selection megtartása és multi-select mód lezárása;
- [x] Escape → multi-select mód megszakítása;
- [x] Canvas és Layers ugyanazt a touch interaction logikát használja;
- [x] rövid elmozdulás (<~10 px) nem indítja el a long-press-t, így a scroll-vs-drag konfliktus alapvédelme megvan;
- [x] root node long-press esetén nem lép multi-select módba;
- [x] selection nem kerül history-be;
- [x] nincs második mobil selection state.

### Módosított fájlok
- \`public/editor-v2/app.js\`
  - touch pointer lifecycle, long-press, toggle, Kész/Mégse, Escape;
  - Canvas + Layers közös touch útvonal.
  - commit: \`6d61adb12ee8b862208089f0dc0d54ca51b24927\` + \`a93622076bee6abc7d3903c6d3bc7dd4215555db\` + \`ab1b071a894e03098d866657ac7b1d51c9129d60\`;
- \`public/editor-v2/index.html\`
  - mobil multi-select action bar.
  - commit: \`ee5d19b4c7be239b630348741d920fd176f899c0\`;
- \`public/editor-v2/mobile-editor.css\`
  - mobil action bar + touch interaction alapstílus.
  - commit: \`4bba011cd5cdae38ce309b277916adf5a20f6be7\`.

### Fontos: még nincs PASS
Az implementáció kódszinten elkészült, de nem jelöljük teszt-PASS-nak. Következő mobil tesztkapu:
1. normál tap → single-select;
2. long-press → multi-select mód + 1 kijelölés;
3. második tap → 2 kijelölés;
4. harmadik tap → 3 kijelölés;
5. már kijelölt elem tap → remove;
6. Kész → selection megmarad, mód bezár;
7. Mégse → eredeti selection visszaáll;
8. Canvas ↔ Layers touch szinkron;
9. rövid húzás/scroll nem indít multi-select-et;
10. root/locked/nested edge case;
11. diagnostics 0 hiba;
12. mobil browser regresszió.

**Párhuzamos állapot:**
- A — PC/Desktop multi-select: browser teszt továbbra is pending.
- B — Mobile/Touch multi-select: implementáció kész, browser teszt pending.
- Group/Ungroup: továbbra is blokkolva, amíg A és B multi-select kapu nem PASS.

**Következő aktív pont:** B mobil élő browser teszt; közben A PC teszt külön lezárható.


## 40.38 — MOBIL TOUCH MULTI-SELECT IMPLEMENTÁCIÓ UTÓAUDIT/FIX — 2026-09-22

**Állapot:** [x] KÓDAUDIT/FIX PASS — browser teszt továbbra is pending.

Az implementáció rövid kódszintű utóauditja során két UX-biztonsági részletet korrigáltunk a mobil munkasávban:
- a \`Mégse\` most az eredeti \`ids + primaryId\` állapotot állítja vissza, nem csak az ID-listát;
- a touch click-suppression időzítése védettebb lett, és a megszakítás törli az esetleges futó long-press timert.

Módosítás:
- \`public/editor-v2/app.js\`
- commit: \`f2e6ca07e78901a43905bef0a6bd54e9ee9e9dc7\`.

**Tesztkapu változatlanul:** élő mobil browser teszt szükséges; csak utána lehet B sávot PASS-ra zárni. A Group/Ungroup továbbra is blokkolt A+B multi-select PASS-ig.


## 40.39 — MOBIL/TOUCH MULTI-SELECT ÉLŐ TESZT — 2026-09-22

**Állapot:** [x] PASS — felhasználói élő teszt: **Működik**.

A mobil/touch multi-select browser teszt a felhasználó visszajelzése alapján működőképes. A mobil munkasáv lezárható PASS-ként.

**B — Mobile/Touch multi-select:** PASS.

A tesztelési kapu teljesüléséhez az implementáció + kódaudit + élő felhasználói teszt együtt PASS. A következő blokkoló feltétel továbbra is az A — PC/Desktop multi-select élő tesztje; Group/Ungroup csak A és B együttes PASS után indulhat.

**Következő aktív pont:** A — PC/Desktop multi-select élő browser teszt lezárása, amikor a felhasználó teszteli.


## 40.40 — KÖVETKEZŐ LÉPÉS ÚJRATERELÉSE — 2026-09-22

**Állapot:** [x] MASTER döntési kapu ellenőrizve.

A felhasználó kérésére folytatjuk a fejlesztést, de az előre rögzített biztonsági függőségi szabályt nem ugrunk át: **Group/Ungroup implementáció csak az A — PC/Desktop multi-select élő PASS és a már teljesített B — Mobile/Touch PASS után indulhat.**

B állapot: PASS. A állapot: élő teszt pending, mert a felhasználó ezt későbbre halasztotta.

Ezért ebben a lépésben nem készül párhuzamos Group/Ungroup kód, nem kerül be második selection rendszer és nem jelöljük A-t PASS-nak teszt nélkül. A következő fejlesztési kapu az A PC/Desktop multi-select élő tesztjének lezárása; annak PASS-a után közvetlenül indul a Group/Ungroup canonical command + unit test + UI + browser regression munkasor.


## 40.41 — PC/DESKTOP MULTI-SELECT ÉLŐ TESZT — 2026-09-22

**Állapot:** [x] PASS — felhasználói élő teszt: **Működik**.

A PC/Desktop multi-select élő böngészős tesztje a felhasználó visszajelzése alapján PASS. Ezzel az A munkasáv is lezárható.

**A — PC/Desktop multi-select:** PASS.
**B — Mobile/Touch multi-select:** PASS.

A két multi-select platformkapu egyaránt PASS, ezért a korábban blokkolt következő domain most megnyitható: **Group/Ungroup canonical command**.

### Következő aktív pont
1. Group command teljes kód-audit és pontos invariánsok rögzítése.
2. Ungroup command teljes kód-audit és pontos invariánsok rögzítése.
3. Canonical group / ungroup command implementáció a meglévő transaction/history/validation rendszerre.
4. Core unit tesztek: normál, sorrend, azonos parent, locked/root/hibás input, rollback, undo/redo.
5. Ezután UI-integráció és PC + mobile browser regresszió.

**Továbbra is kötelező:** egyetlen canonical Page Model + selection state + Command API; platformonként nem készül külön group/selection logika.


## 40.42 — GROUP / UNGROUP IMPLEMENTÁCIÓ ELŐAUDIT — 2026-09-22

**Állapot:** [x] AUDIT PASS — implementáció előtt.

A két multi-select kapu PASS után újra ellenőriztük a canonical Page Model, validation, selection és Command API kapcsolatát. Az audit alapján a Group/Ungroup megvalósítható a meglévő infrastruktúrával, új state/history rendszer nélkül.

### Group contract véglegesítve
- legalább 2 kijelölt node;
- minden kijelölt node ugyanazon közvetlen parent alatt legyen;
- root nem csoportosítható;
- locked node esetén a művelet teljesen blokkolódik;
- a kijelöltek sibling sorrendje a Page Model parent.children sorrendje alapján marad determinisztikus;
- az új GROUP az első kijelölt node eredeti sibling pozíciójára kerül;
- a kijelölt node-ok parentId-ja az új GROUP ID lesz;
- GROUP children sorrendje az eredeti sibling sorrendet követi;
- az egész művelet egyetlen canonical command + egy history entry;
- minden hiba rollbacket és változatlan dokumentumot eredményez;
- siker után selection az új GROUP-ra áll.

### Ungroup contract véglegesítve
- pontosan egy GROUP legyen az elsődleges kijelölés, és csak GROUP node bontható;
- locked GROUP blokkolja a műveletet;
- root GROUP nem lehet;
- a gyermekek a GROUP eredeti parentjébe kerülnek;
- a gyermekek sorrendje megmarad;
- a GROUP helyén, azonos sorrendi blokkban jelennek meg a gyermekek;
- a GROUP törlődik;
- siker után selection a felszabadított gyermekekre kerül, primaryId az utolsó felszabadított gyermek;
- egyetlen canonical command + history entry;
- minden hiba rollbacket eredményez.

### Architektúra-döntés
Nem módosítjuk a Page Model sémát, mert a GROUP node type már létezik. Nem készül külön group state, platform-specifikus command vagy külön history út. A meglévő commit(), validation, snapshot és setSelection() infrastruktúra lesz a canonical alap.

**Következő aktív lépés:** a `group` és `ungroup` commandok implementációja a `commands.js`-ben, majd azonnali Core unit tesztbővítés. UI csak a command + unit tesztek PASS után készül.


## 40.43 — GROUP / UNGROUP CANONICAL COMMAND + CORE TESZTEK — 2026-09-22

**Állapot:** [~] IMPLEMENTÁCIÓ KÉSZ; Core CI fut.

A 40.42 contract alapján elkészült a canonical Group/Ungroup command a meglévő Command API-ban. Nem készült új selection state, Page Model vagy history rendszer.

### Implementáció
- `hierarchy.group`: minimum 2 node, azonos közvetlen parent, root/locked védelem, determinisztikus sibling sorrend, új GROUP az első elem pozícióján, children parentId átállítás, egy commit/history entry, rollback + validation.
- `hierarchy.ungroup`: GROUP ellenőrzés, locked group/locked child védelem, eredeti parent és pozíció visszaállítása, child sorrend megtartása, GROUP törlés, felszabadított children kijelölése, egy commit/history entry, rollback + validation.
- Group siker után a GROUP lesz a selection.
- Ungroup siker után a felszabadított gyermekek lesznek a selection.

### Kód
- `public/editor-v2/core/commands.js`
- commit: `508dd7c4e03dafdd2bab7d56d1f2b9be17ebcd14`
- Editor Core workflow ezen a commiton: **success**.

### Unit tesztek
Bekerült:
- normál deterministic group;
- mixed parent / root / locked rollback;
- ungroup sorrend és pozíció;
- non-group / locked group / locked child rollback;
- egy history entry + undo/redo exact document snapshot.

- `public/editor-v2/tests/core.test.js`
- commit: `cbdd57f9355a11eb89cdab58f325918f3ce0a01b`
- Editor Core workflow #411: jelenleg **in_progress**.

**Következő kapu:** a #411 CI eredményének megvárása. Ha PASS, jön a Group/Ungroup UI-integráció; ha FAIL, először csak a hibát javítjuk és újra futtatjuk a Core tesztet.


## 40.44 — GROUP/UNGROUP CORE CI HIBA AZONOSÍTVA — 2026-09-22

**Állapot:** [x] HIBA AZONOSÍTVA — command működés rendben, teszt-specifikus hiba.

A Core CI #411 22/23 tesztje PASS. Az egyetlen FAIL nem a canonical `hierarchy.ungroup` implementáció hibája: a teszt a non-GROUP edge case-nél közvetlenül meghívta a hibát dobó commandot, de nem `assert.throws()`-szal ellenőrizte. Emiatt a teszt futása megszakadt.

A log alapján:
- 22 PASS
- 1 FAIL
- hiba: `Ungroup requires a GROUP node`
- érintett teszt: `ungroup rejects non-group, locked group and locked child with exact rollback`

**Javítási szabály:** csak a hibás unit teszt assertionét javítjuk; a production command logikáját nem változtatjuk meg, mert a jelenlegi hiba a kívánt védelmi viselkedés.

**Következő aktív lépés:** a teszt assertion javítása, új Core CI futtatás.


## 40.45 — GROUP/UNGROUP CORE TEST ASSERTION JAVÍTVA — 2026-09-22

**Állapot:** [~] JAVÍTÁS KÉSZ; új Core CI fut.

A 40.44-ben azonosított egyetlen teszt-specifikus hibát javítottuk: a non-GROUP ungroup edge case most `assert.throws()`-szal ellenőrzi a kívánt blokkolást és rollbacket.

- `public/editor-v2/tests/core.test.js`
- commit: `9d5e2be4345abd01168bf3481b133a71ef458b43`
- production `commands.js` nem változott.

**Következő kapu:** az új Core CI eredménye. PASS esetén a Group/Ungroup Core domain lezárható, és indulhat az UI-integráció.


## 40.46 — GROUP / UNGROUP UI-INTEGRÁCIÓ — 2026-09-22

**Állapot:** [~] UI implementáció kész; browser/live regression még hátra.

A Core CI #414 PASS után elkészült a Group/Ungroup editor UI-integráció.

### Canonical UI
- Rétegek panelen megjelent a **Csoport** és **Bontás** művelet.
- A gombok állapota a canonical selection + Page Model alapján frissül.
- Csoport csak legalább 2, azonos parentű, nem root és nem locked kijelölésnél aktív.
- Bontás csak nem locked GROUP primary selection esetén aktív.
- A műveletek kizárólag a canonical `hierarchy.group` / `hierarchy.ungroup` commandokat hívják.
- Mobil multi-select módban ugyanaz a két command külön mobil gombbal elérhető.
- Nem készült platform-specifikus Group/Ungroup logika.

### Commitok
- index: `44be21b60a533afb5dc2b3b5b77a44f9a67dc27c`
- app.js: `28a07fc2c00a1e3a068580166ae5c3dffffacb52`
- editor.css: `b5c25afd65e64275f8d25bb1a276e36cf8109bb6`

**Következő kapu:** PC/Desktop és Mobile/Touch browser regression: Group, nested Group, Ungroup, lock/root edge cases, undo/redo, diagnostics 0 error. Csak user PASS után zárható a Group/Ungroup domain.

## 40.47 — GROUP / UNGROUP TELJES BÖNGÉSZŐS REGRESSZIÓ — 2026-09-22

**Állapot:** [x] PASS — mind a 10 kötelező felhasználói élő teszt pipa.

A Group/Ungroup UI-integráció PC/Desktop és Mobile/Touch környezetben végigtesztelve. A felhasználó visszaigazolása alapján mind a 10 teszt PASS:

1. [x] PC/Desktop Group
2. [x] PC/Desktop Ungroup
3. [x] Nested Group
4. [x] Locked element védelem
5. [x] Locked Group védelem
6. [x] Root protection
7. [x] Undo/Redo
8. [x] Mobile/Touch Group
9. [x] Mobile/Touch Ungroup
10. [x] Diagnostics: 0 hiba

**Domain státusz:** Group/Ungroup implementáció + Core CI + UI-integráció + PC/Mobile élő regresszió PASS.

**Következő aktív folytatási pont:** a MASTER-ben kijelölt következő hiányzó kanonikus editor-domain audit/implementáció; Group/Ungroup nem marad nyitott blocker.

## 40.48 — LAYOUT / MANIPULATION: DRAG-REORDER-REPARENT ELŐAUDIT — 2026-09-22

**Állapot:** [x] AUDIT PASS — kódmódosítás ebben a lépésben nem történt.

A Group/Ungroup lezárása után a MASTER kritikus függőségi sorrendje szerint a következő domain a **layout/manipulation**. Első részterületként a meglévő hierarchy mutation útvonalat auditáltuk, mielőtt UI-szintű drag/drop kerülne be.
### Audit eredmény
- A Page Model canonical hierarchy adatforrása a `parentId + children[]`.
- A canonical `hierarchy.reorder` command már létezik és history-kompatibilis.
- A canonical `hierarchy.reparent` command már létezik és ellenőrzi: érvényes parent; `canContain()` kompatibilitást; root-védelmet; saját descendant alá reparent tiltását.
- Az `execute()` → `commit()` útvonal biztosítja az egyetlen mutation/history adatfolyamot.
- A jelenlegi `app.js`-ben nincs desktop Canvas drag/drop UI.
- A jelenlegi Layers/Navigator UI-ban nincs drag/reorder/reparent interaction.
- Mobilon nincs touch drag/reparent interaction; a jelenlegi touch rendszer selection/multi-select célú.
- Külön drag state vagy második hierarchy state jelenleg nincs.
- A Canvas Engine nem mutál hierarchy-t, ami helyes és megmarad.
- A Group/Ungroup után a következő biztonságos fejlesztési lépés nem új command, hanem a meglévő `hierarchy.reorder` + `hierarchy.reparent` UI interaction rétegének megtervezése.

### Következő implementációs contract
1. Desktop Layers drag → sibling reorder.
2. Desktop Layers drag → másik container/group alá reparent.
3. Canvas drag első körben nem készül párhuzamosan; előbb a Layers hierarchy interaction stabilizálása.
4. Root nem mozgatható.
5. Saját descendant alá reparent tiltott.
6. Locked node mozgatása tiltott.
7. Invalid target esetén nincs dokumentumváltozás.
8. Egy felhasználói drag művelet egy history entry legyen.
9. Undo/Redo pontosan állítsa vissza az előző hierarchy snapshotot.
10. Mobile/touch drag csak a desktop Layers interaction stabilizálása után, ugyanarra a command API-ra építve.
11. Nem készül külön drag/reparent command vagy platform-specifikus hierarchy state.

**Következő aktív lépés:** Desktop Layers drag/reorder/reparent minimális UI implementáció a meglévő `hierarchy.reorder` / `hierarchy.reparent` commandokra építve, majd Core + browser teszt.

## 40.49 — LAYERS DRAG / REORDER / REPARENT UI IMPLEMENTÁCIÓ — 2026-09-22

**Állapot:** [~] IMPLEMENTÁCIÓ KÉSZ; CI és élő browser teszt még hátra.

A 40.48 audit alapján elkészült a minimális desktop Layers hierarchy interaction a már meglévő canonical commandokra építve.

### Implementáció
- Layers node-ok desktopon natív drag source-ként működnek.
- Siblingre dobás → canonical `hierarchy.reorder`.
- Container/Group kompatibilis node-ra dobás → canonical `hierarchy.reparent`, a cél children listájának végére.
- Root nem dragelhető.
- Locked source nem dragelhető.
- Locked target nem fogad dropot.
- Saját descendant alá történő reparent UI-szinten blokkolt, a command-szintű védelem továbbra is megmarad.
- Invalid target esetén nincs mutation.
- Egy drop egyetlen canonical commandot hajt végre, ezért egy history entry.
- Drag vizuális visszajelzés bekerült.
- Canvas drag és mobile touch drag ebben a lépésben szándékosan nem készült; nincs párhuzamos hierarchy adatfolyam.

### Módosítások
- `public/editor-v2/app.js`
  - commit: `974156f76422b3f4991b2eb80923a395698a884e`
- `public/editor-v2/editor.css`
  - commit: `c3a272ed953a44ca2c07182d11684fc932358fda`

### Következő kapu
1. Core CI / syntax ellenőrzés.
2. Desktop Layers reorder live test.
3. Desktop Layers reparent live test.
4. locked/root/descendant protection.
5. Undo/Redo.
6. Save/reload.
7. Diagnostics 0 hiba.
8. User PASS.

Sikertelen tesztnél nem lépünk tovább; mobile/touch drag csak a desktop hierarchy interaction lezárása után indul.

## 40.50 — LAYERS DRAG / REORDER / REPARENT CORE CI — 2026-09-22

**Állapot:** [x] CI PASS — a 40.49 implementáció syntax/Core kapuja hibamentesen lefutott.

- Editor Core workflow: **#423**
- head: `c3a272ed953a44ca2c07182d11684fc932358fda`
- conclusion: **success**
- A Group/Ungroup korábbi Core 23/23 PASS állapota változatlan.
- Production command API ebben a CI-lépésben nem módosult.

**Következő egyetlen aktív tesztkapu:** desktop Layers élő browser teszt a drag/reorder/reparent interactionre.

## 40.51 — PÁRHUZAMOS PC + MOBIL FEJLESZTÉSI MÓD RÖGZÍTÉSE — 2026-09-22

**Állapot:** [D] FEJLESZTÉSI DÖNTÉS RÖGZÍTVE.

A felhasználó kérése alapján a fejlesztést mostantól **párhuzamos PC/Desktop + Mobile/Touch munkasávokban folytatjuk**, és nem várunk arra, hogy az egyik platform teljes élő tesztje lezáruljon a másik fejlesztése előtt.

### Kötelező párhuzamos fejlesztési szabály

- PC/Desktop és Mobile/Touch funkciók párhuzamosan fejleszthetők.
- Mindkét platform ugyanazt a canonical Page Modelt, State-et, Selectiont, Command API-t, Historyt és validációt használja.
- Platformonként csak az input/render/UI interaction réteg térhet el.
- Nem vezetünk be platform-specifikus második mutation/state/hierarchy rendszert.
- Minden implementációs lépést, CI-eredményt, commitot, hibát, javítást és döntést ebbe az egy MASTER-be kell rögzíteni.
- A felhasználói élő tesztelés nem blokkolja a párhuzamos fejlesztést, **ha a kód és a CI-kapu már ellenőrzött**.
- A végleges domain-lezárás továbbra is csak a szükséges PC + Mobile élő regressziók és felhasználói PASS után történhet.
- Ha egy funkció mobilon működik, azt **nem tekintjük automatikusan PC PASS-nak**. A közös canonical command/data út miatt ez erős architekturális bizonyíték, de a külön desktop input/UI útvonalat később külön validáljuk.
- Fordítva ugyanez érvényes: PC működése nem bizonyítja automatikusan a mobil touch működését.

### Tesztelési stratégia

A felhasználó jelenleg elsősorban mobilon tud élő tesztet végezni. Ezért:
1. a mobilon elvégezhető kész funkciókat most tesztelhetjük és rögzíthetjük;
2. a PC-only teszteket **PENDING** állapotban megtartjuk;
3. közben a PC és mobil következő funkcióit tovább implementáljuk párhuzamosan;
4. amikor a felhasználó kéri a teljes tesztelési kört, végigmegyünk az összes korábban rögzített PC + Mobile + regression ponton;
5. egyetlen tesztpontot sem jelölünk PASS-nak felhasználói visszaigazolás nélkül, ha az élő browser teszt előírt kapu.

### 40.51 aktuális munkasávok

**A — PC/Desktop**
- 40.49 Layers drag/reorder/reparent implementáció: kész.
- 40.50 Core CI: PASS.
- Live browser: **PENDING**.
- Következő fejlesztési cél: desktop manipulation további részei párhuzamosan.

**B — Mobile/Touch**
- Multi-select: PASS.
- Group/Ungroup: PASS.
- Layers drag/reorder/reparent touch implementáció: még nincs kész.
- Következő fejlesztési cél: mobile/touch hierarchy manipulation ugyanarra a canonical hierarchy.reorder / hierarchy.reparent commandokra.

**C — Közös Core**
- Canonical Page Model: aktív.
- Canonical Command API: aktív.
- Selection/History/Validation: közös.
- Core CI: PASS.
- Új platform-specifikus state vagy command nem engedélyezett.

### Következő fejlesztési sorrend

1. Mobil Layers drag/reorder/reparent interaction megtervezése és implementációja.
2. Mobil touch edge case-ek: scroll-vs-drag, long-press konfliktus, locked/root/descendant, invalid target.
3. Közös hierarchy regression/CI bővítés.
4. Desktop hierarchy interaction további képességei párhuzamosan.
5. Később teljes PC + Mobile élő regressziócsomag egyben.

**Hivatalos folytatási pont:** a párhuzamos Mobile/Touch hierarchy manipulation implementáció, miközben a Desktop Layers live teszt PENDING állapotban marad.



## 40.54 — MOBILE LAYERS SIBLING REORDER LIVE TESZT — 2026-09-22

**Állapot:** [x] PASS — felhasználói élő teszt: **Jó**.

A Mobile/Touch Layers fogantyús drag funkció sibling reorder útvonala sikeresen működött.

- [x] Long-press drag aktiválás.
- [x] Azonos szintű elemre dobás.
- [x] Sibling sorrend tényleges módosítása.
- [x] Nem jelentkezett teszt közben jelzett hiba.

**Következő egyetlen aktív tesztpont:** Mobile Layers drag → Container/Group reparent.

## 40.53 — MOBILE LAYERS HIERARCHY UI ELŐTESZT — 2026-09-22

**Állapot:** [x] PASS — felhasználói élő teszt: **Működik**.

A Mobile/Touch Layers hierarchy manipulation teljes funkcionális tesztje előtt az első UI-előteszt sikeresen lezárult.

- Layers panel megnyitható.
- A mozgatható elemeknél látható a `⠿` drag handle.
- A Layers UI nem jelez hibát.
- A touch hierarchy drag további funkcionális tesztje folytatható.

**Következő egyetlen aktív tesztpont:** Mobile Layers drag → sibling reorder.

## 40.52 — PC + MOBIL LAYERS HIERARCHY MANIPULATION PÁRHUZAMOS IMPLEMENTÁCIÓ — 2026-09-22

**Állapot:** [~] IMPLEMENTÁCIÓ KÉSZ; élő browser teszt és teljes CI-kapu még hátra.

A 40.51 döntés alapján nem állítottuk meg a fejlesztést a PC-s élő teszt hiánya miatt. A meglévő desktop Layers drag/reorder/reparent útvonal mellé elkészült a **Mobile/Touch Layers hierarchy manipulation** ugyanarra a canonical hierarchy command rétegre.

### PC/Desktop
- A 40.49-ben elkészült Layers drag/reorder/reparent továbbra is aktív.
- Sibling cél → `hierarchy.reorder`.
- Container/Group cél → `hierarchy.reparent`.
- Root/locked/descendant/invalid cél védelem megmarad.
- A PC live browser teszt továbbra is PENDING; ettől a fejlesztési sáv nem áll le.

### Mobile/Touch
- A Layers sorhoz külön **mozgató fogantyú** került, így a hierarchy drag nem ütközik a már lezárt mobile multi-select long-press interactionnel.
- A fogantyú hosszú érintése után aktiválódik a touch drag.
- Mozgatás közben a cél Layers sor vizuálisan jelölődik.
- A drop ugyanazt a `resolveLayerDrop()` döntési logikát használja, mint a desktop.
- Sibling reorder és Container/Group reparent ugyanarra a canonical `hierarchy.reorder` / `hierarchy.reparent` commandokra kerül.
- Root, locked source/target, saját descendant és invalid target mobilon is blokkolt.
- Rövid elmozdulás a long-press aktiválása előtt megszakítja a draget, hogy a Layers scroll ne váljon véletlen mozgatássá.
- A touch drag eseményei izoláltak a meglévő multi-select pointer lifecycle-től.
- Nem készült mobil-specifikus hierarchy state vagy command.

### Módosított fájlok
- `public/editor-v2/app.js`
  - touch hierarchy drag state, handle, drop resolution és event isolation.
  - commit: `2a2876d1bb64127a9b7545a694abd1d1549bbf53`
  - event isolation fix: `22b3375e908072228993c361f22149f12d3d1adc`
- `public/editor-v2/editor.css`
  - touch drag handle és drop feedback.
  - commit: `a9b7b80523b1892a7597d2653584d936104ac26a`

### Fontos tesztállapot
Ezeket **nem** jelöljük még PASS-nak:
1. Mobile Layers drag → sibling reorder.
2. Mobile Layers drag → Container/Group reparent.
3. Mobile invalid target / descendant protection.
4. Mobile locked/root protection.
5. Mobile scroll-vs-drag.
6. Mobile Undo/Redo.
7. Mobile Save/Reload.
8. Mobile diagnostics 0 hiba.
9. Desktop teljes 40.49 browser regression.

### Következő párhuzamos fejlesztési irány
- PC: Layers hierarchy interaction továbbfejlesztése és a következő manipulation capability-k auditja.
- Mobile: Layers touch hierarchy edge case-ek és interaction polish.
- Közös: hierarchy regression tesztek bővítése.
- Később: teljes PC + Mobile browser regressziós kör egyben.

**Hivatalos folytatási pont:** PC + Mobile hierarchy manipulation közös stabilizálása; a felhasználói tesztelés akkor indul teljes körben, amikor a felhasználó gépnél/mobilnál rendelkezésre áll.


## 40.55 — MOBILE LAYERS CONTAINER/GROUP REPARENT LIVE TESZT — 2026-09-22

**Állapot:** [x] PASS — felhasználói élő teszt: **Jó**.

A Mobile/Touch Layers Container/Group alá történő reparent élő tesztje sikeresen lezárult.

- [x] Long-press drag aktiválás a mozgató fogantyúról.
- [x] Container/Group célra történő drop működött.
- [x] Az elem ténylegesen a cél Container/Group gyermekévé vált.
- [x] A Layers hierarchiában a gyermekkapcsolat/behúzás megjelent.
- [x] Nem jelentkezett teszt közben jelzett hiba.

**Következő egyetlen aktív tesztpont:** Mobile Layers invalid target / saját descendant alá történő reparent védelem.


## 40.56 — MOBILE LAYERS INVALID TARGET / DESCENDANT VÉDELEM LIVE TESZT — 2026-09-22

**Állapot:** [x] PASS — felhasználói élő teszt: **Jó**.

A Mobile/Touch Layers hierarchy invalid target és saját descendant alá történő reparent védelme élő teszten sikeresen működött.

- [x] Érvénytelen célra történő drop nem módosította a dokumentumot.
- [x] Saját descendant alá történő reparent blokkolva maradt.
- [x] Nem történt hibás hierarchy-módosítás.
- [x] Nem jelentkezett teszt közben jelzett hiba.

**Következő egyetlen aktív tesztpont:** Mobile Layers locked/root protection.


## 40.57 — MOBILE LAYERS LOCKED/ROOT VÉDELEM LIVE TESZT — 2026-09-22

**Állapot:** [x] PASS — felhasználói élő teszt: **Jó**.

A Mobile/Touch Layers locked/root protection élő tesztje sikeresen lezárult.

- [x] Locked elem mozgatása a `⠿` fogantyúról blokkolva maradt.
- [x] Root elem mozgatása blokkolva maradt.
- [x] Nem történt hibás hierarchy-módosítás.
- [x] Nem jelentkezett teszt közben jelzett hiba.

**Következő egyetlen aktív tesztpont:** Mobile Layers scroll-vs-drag edge case.


## 40.58 — MOBILE LAYERS SCROLL-VS-DRAG LIVE TESZT — 2026-09-22

**Állapot:** [x] PASS — felhasználói élő teszt: **Jó**.

A Mobile/Touch Layers scroll-vs-drag edge case élő tesztje sikeresen lezárult.

- [x] Normál Layers lista-görgetés működött.
- [x] Görgetés közben nem indult véletlen hierarchy drag.
- [x] A `⠿` fogantyúról a hosszú nyomásos drag továbbra is működik.
- [x] Rövid érintés/mozdítás nem okozott véletlen mozgatást.
- [x] Nem történt hibás hierarchy-módosítás.

**Következő egyetlen aktív tesztpont:** Mobile Layers Undo/Redo.


## 40.59 — MOBILE LAYERS UNDO/REDO LIVE TESZT — 2026-09-22

**Állapot:** [x] PASS — felhasználói élő teszt: **Jó**.

A Mobile/Touch Layers hierarchy Undo/Redo élő tesztje sikeresen lezárult.

- [x] Hierarchy-módosítás után Undo pontosan visszaállította az eredeti helyet.
- [x] Redo pontosan visszaállította az új helyet.
- [x] A Layers hierarchia mindkét állapotban helyes maradt.
- [x] Nem jelentkezett teszt közben jelzett hiba.

**Következő egyetlen aktív tesztpont:** Mobile Layers Save/Reload.


## 40.60 — MOBILE LAYERS SAVE/RELOAD LIVE TESZT — 2026-09-22

**Állapot:** [x] PASS — felhasználói élő teszt: **Jó**.

A Mobile/Touch Layers hierarchy mentés és újratöltés élő tesztje sikeresen lezárult.

- [x] Hierarchy-módosítás mentésre került.
- [x] Editor/oldal újratöltése után a módosított Layers-hierarchia megmaradt.
- [x] A mentett parent/order állapot helyesen töltődött vissza.
- [x] Nem jelentkezett teszt közben jelzett hiba.

**Következő egyetlen aktív tesztpont:** Mobile Layers diagnostics — 0 hiba.


## 40.61 — MOBILE LAYERS DIAGNOSTICS LIVE TESZT — 2026-09-22

**Állapot:** [x] PASS — felhasználói élő teszt: **Jó**.

A Mobile/Touch Layers hierarchy teljes diagnosztikai ellenőrzése sikeresen lezárult.

- [x] A Layers műveletek után a debugger/diagnosztika 0 hibát jelzett.
- [x] Nem jelentkezett új runtime vagy hierarchy hiba.
- [x] A korábbi Mobile Layers tesztek eredményei változatlanul érvényesek.

**Mobile Layers hierarchy tesztblokk lezárva.**

**Következő aktív terület:** Desktop/PC Layers teljes élő regression — az implementáció korábban elkészült, most külön desktop élő validáció szükséges.


## 40.62 — CANONIKUS OLDALSZERKEZET DÖNTÉS — 2026-09-22

**Állapot:** [D] FEJLESZTÉSI DÖNTÉS RÖGZÍTVE.

A felhasználó törlési tesztje után egyértelműsítettük az oldallifecycle végleges szabályát:

- Egy webhelyoldal = egyetlen **Editor v2 Page Model** oldal a `pages` táblában.
- Nem állítunk vissza régi statikus HTML-oldalakat külön tartalomrendszerként.
- Nem készül második/duplikált „alapstruktúrájú” oldalrendszer.
- A hiányzó standard oldalak tartalmát most nem kell visszaállítani; üres, szerkesztőben létrehozott canonical dokumentummal térnek vissza.
- A közösségi oldal(ak) meglévő canonical rekordját nem duplikáljuk.
- A főoldal megmarad canonical Editor v2 oldalnak, és a publikus főoldalon az **Admin belépés** megmarad.
- A publikus menü nem tarthat fenn olyan statikus linket, amelynek nincs valódi `pages` rekordja; a menü a canonical publikus oldallistából épül fel, így törölt oldal nem marad 404-et okozó menüpontként.
- A `/p/<slug>` útvonal kizárólag a canonical `pages` rekordot szolgálja ki.
- A standard oldalak strukturális visszaállítása egyszeri, idempotens adatbázis-migrációval történik; nem alkalmazunk legacy HTML-t vagy külön rendszeroldal-tartalmat az editoros oldalak helyett.
- A PC/Desktop élő teszteket a felhasználó külön kéréséig **PENDING** állapotban tartjuk; a mostani strukturális javítás nem indít automatikus PC regression kört.

**Következő implementáció:** canonical üres standard oldalak egyszeri visszaállítása + publikus menü canonical `pages` listára kötése, majd CI/strukturális ellenőrzés és MASTER-frissítés.


## 40.63 — CANONIKUS STANDARD OLDALAK + DINAMIKUS MENÜ IMPLEMENTÁCIÓ — 2026-09-22

**Állapot:** [~] IMPLEMENTÁCIÓ KÉSZ; deploy/D1 migration és élő publikus ellenőrzés még hátra.

A 40.62 döntés alapján a 404-es menüpont problémát nem régi HTML-oldalak visszahozásával és nem duplikált oldalszerkezettel oldottuk meg.

### Elkészült
- Új, idempotens D1 migration: `migrations/0008_restore_canonical_standard_pages.sql`.
- A migration csak hiányzó standard oldalakat hoz létre, és nem ír felül meglévő rekordot.
- A visszaállított oldalak közvetlenül **Editor v2 canonical Page Model** dokumentumok: `sanci-page-document`, `schemaVersion: 1`, saját root node-dal és üres children listával.
- Visszaállított standard slugok: `home`, `twitch`, `schedule`, `youtube`, `tiktok`, `about`, `contact`.
- A `community` rekordhoz nem nyúltunk, ezért nincs duplikáció.
- Minden visszaállított oldal publikált, de üres tartalmú; a tényleges tartalom később az Editor v2-ben kerül feltöltésre.
- A publikus menü mostantól a `/api/public/pages` canonical oldallistájából épül fel, ezért törölt oldal nem marad bent statikus 404-es menüpontként.
- A régi statikus menülinkek kikerültek a `visual-page.html`-ból.
- A főoldal publikus sablonjában az **Admin belépés** továbbra is megmaradt.
- A `/p/<slug>` útvonal továbbra is kizárólag a canonical `pages` rekordot szolgálja ki.

### Módosított fájlok
- `migrations/0008_restore_canonical_standard_pages.sql`
  - commit: `20dc5a87150244166ac864a9d948ff5875b32b99`
- `public/assets/site.js`
  - commit: `cdb03a1d08ed9cbf5efb67104720a9d5ab6858b9`
- `public/visual-page.html`
  - commit: `a089665e6ee9b1264bb9f5e925ef727c75d8d818`

### Tesztállapot
- [ ] D1 migration futtatása/deploy.
- [ ] Publikus menü élő ellenőrzése: nincs 404-es standard menüpont.
- [ ] `/` főoldal betöltése és Admin belépés jelenléte.
- [ ] `/p/home`, `/p/twitch`, `/p/schedule`, `/p/youtube`, `/p/tiktok`, `/p/community`, `/p/about`, `/p/contact` élő ellenőrzése.
- [ ] Editor v2 oldalválasztóban az oldalak megjelenése és szerkeszthetősége.
- [ ] Diagnosztika 0 hiba.
- [ ] PC/Desktop élő teszt továbbra is **PENDING**, és csak a felhasználó külön kérésére futtatjuk.

**Következő aktív lépés:** deploy/D1 migration után mobilról strukturális élő ellenőrzés; PC tesztet nem indítunk automatikusan.


## 40.64 — KÖVETKEZŐ DOMAIN: OLDAL ÉLETCIKLUS / SLUG KEZELÉS — 2026-09-22

**Állapot:** [D] KÖVETKEZŐ FEJLESZTÉSI LÉPÉS RÖGZÍTVE.

A 40.63 strukturális oldaljavítás felhasználói PASS után a következő fejlesztési lépés az Editor v2 **oldal lifecycle** hiányzó részeinek lezárása. A PC/Desktop élő tesztek továbbra sem indulnak automatikusan.

Első részfeladat: a már létező oldal-átnevezés mellé a **slug kezelés és ütközéskezelés** canonical megvalósítása.

Követelmények:
- slug módosítása kizárólag az egyetlen canonical `pages` rekordot módosíthatja;
- a hozzá tartozó Editor v2 Page Model page.slug mező is ugyanabban a műveletben frissüljön;
- meglévő slug ütközés determinisztikusan `SLUG_EXISTS` hibával blokkolódjon;
- slug formátuma maradjon kisbetűs, URL-biztos `[a-z0-9]+(?:-[a-z0-9]+)*`;
- audit log készüljön;
- ne legyen második oldal vagy legacy tartalomrendszer;
- a publikus `/p/<slug>` útvonal az új sluggal szolgálja ki az oldalt;
- UI-ban a művelet egyértelmű legyen és ne módosítsa a dokumentum tartalmát.

**Utána:** unit/integration ellenőrzés → szükséges mobil élő teszt felhasználói kérésre; PC teszt továbbra is PENDING.


## 40.65 — OLDAL SLUG / META LIFECYCLE IMPLEMENTÁCIÓ — 2026-09-22

**Állapot:** [~] IMPLEMENTÁCIÓ KÉSZ; live teszt és CI ellenőrzés még hátra.

A 40.64 alapján elkészült az Editor v2 canonical oldal metaadat/slug kezelése.

### Elkészült
- Admin page PATCH most már támogatja a címet és a slugot.
- Slug validáció: csak kisbetűs URL-biztos `[a-z0-9]+(?:-[a-z0-9]+)*`, maximum 80 karakter.
- Slug ütközés `SLUG_EXISTS` 409 hibával blokkolódik.
- A DB `pages.slug` és az ugyanahhoz az oldalhoz tartozó Editor v2 `pages[id].slug` egyetlen műveletben frissül.
- Az Editor v2 Page Model cím/metaadatai is szinkronban maradnak.
- Publikált oldalnál a publikált canonical snapshot is frissül a slug/meta változással, így a publikus útvonal nem válik inkonzisztenssé.
- Audit log készül a régi és új cím/slug értékkel.
- Editor v2 Oldalak panelen megjelent az oldal metaadat-szerkesztő művelet (✎).
- A művelet után az aktuális oldal canonical dokumentuma újratöltődik, tartalmi módosítás nélkül.
- Nincs új oldal, nincs legacy rendszer, nincs duplikáció.

### Módosítások
- `src/routes/admin/pages.ts` — `fd8fd9c5c6da68e60e82f80d213d2e709f010819`
- `public/editor-v2/app.js` — `843d1ef4d94f0513011bc6edbe2d9028033adbc7`
- `public/editor-v2/editor.css` — `ea2e2f5a9842f3d4d2ed62bcbbcb1ce084fb39ae`

### Még nincs PASS
- [ ] cím módosítása
- [ ] slug módosítása
- [ ] slug ütközés blokkolása
- [ ] új sluggal publikus `/p/<slug>` útvonal
- [ ] Editor v2 Page Model slug egyezése
- [ ] mentés/újratöltés után metaadat megmaradása
- [ ] diagnosztika 0 hiba
- [ ] szükséges regresszió/CI
- [ ] PC/Desktop élő teszt — továbbra is csak külön felhasználói kérésre

**Következő aktív lépés:** az oldal slug/meta lifecycle kódellenőrzése és a hozzá tartozó CI/tesztkapu; utána a felhasználói mobil teszt kérésre.


## 40.66 — OLDAL SLUG / META KÓD- ÉS TESZTKAPU ELLENŐRZÉS — 2026-09-22

**Állapot:** [~] KÓD ELLENŐRZÉS PASS; FELHASZNÁLÓI ÉLŐ TESZT MÉG HÁTRA.

A 40.65 implementációját ellenőriztük:
- az admin page PATCH egyetlen canonical `pages` rekordot módosít;
- a DB slug és az Editor v2 Page Model slug együtt frissül;
- a slug validáció és a `SLUG_EXISTS` ütközéskezelés jelen van;
- a publikált snapshot frissítése megmarad az oldal metaadat-változásakor;
- audit log készül;
- az Editor v2-ben egyetlen ✎ metaadat-művelet kezeli a címet és slugot;
- nincs második oldal- vagy tartalomrendszer;
- PC/Desktop élő teszt továbbra is csak külön kérésre.

**Következő kötelező felhasználói teszt:**
1. Editor v2 → Oldalak → ✎ egy oldalnál.
2. Cím megváltoztatása → mentés.
3. Slug megváltoztatása szabályos értékre.
4. Az új `/p/<slug>` oldal megnyitása.
5. Régi slug ne legyen aktív útvonal.
6. Próbálj egy már létező slugot megadni → `SLUG_EXISTS` / ütközési hiba.
7. Editor újratöltés után a cím és slug maradjon meg.
8. Diagnosztika: 0 hiba.

A teljes 40.65 blokk csak ezen élő ellenőrzés után kaphat [x] PASS státuszt.


## 40.67 — CANONIKUS OLDALSORREND: EDITOR = PUBLIKUS MENÜ — 2026-09-22

**Állapot:** [x] PASS — implementáció, D1/deploy és a teljes mobil élő tesztcsomag a felhasználó visszaigazolása szerint hibamentesen működik.

A felhasználó kérésére az oldal sorrendje mostantól nem lehet külön frontend-logika kérdése. Bevezetésre került az egyetlen canonical `pages.sort_order`, amelyet az Editor v2 és a publikus menü ugyanúgy használ.

### Elkészült
- Új migration: `migrations/0009_page_sort_order.sql`.
- A meglévő oldalak sorrendje a migrationben determinisztikusan a jelenlegi Editor-oldalsorrend alapján inicializálódik.
- Admin oldallistázás: `ORDER BY sort_order ASC`.
- Publikus oldallistázás: ugyanaz a `sort_order ASC`.
- Az Editor v2 Oldalak panel megjeleníti az aktuális sorrendet.
- Az Editor v2-ben minden oldalnál **↑ / ↓** sorrendmódosító gomb került be.
- A sorrendváltás ugyanazt a canonical `pages` rekordot módosítja; nincs külön menülista.
- A publikus menü automatikusan követi az Editor v2-ben beállított sorrendet.
- Új oldal automatikusan a lista végére kerül.
- A sorrend nem függ a címtől vagy az utolsó módosítás idejétől.
- Nincs második oldal- vagy menürendszer.

### Módosítások
- `migrations/0009_page_sort_order.sql` — `b2dce938d8aa0f57d9dc6970a7484584f2858c5d`
- `src/routes/admin/pages.ts` — canonical sort order + order swap API.
- `src/routes/public/pages.ts` — canonical sort order használata.
- `public/editor-v2/app.js` — Editor oldalsorrend vezérlők.
- `public/editor-v2/editor.css` — order gombok mobil/desktop stílusa.

### Tesztállapot
- [x] D1 0009 migration futtatása/deploy.
- [x] Editor v2 oldalak sorrendjének ellenőrzése.
- [x] ↑ gombbal oldal feljebb mozgatása.
- [x] ↓ gombbal oldal lejjebb mozgatása.
- [x] Editor újratöltés után sorrend megmarad.
- [x] Publikus menü ugyanebben a sorrendben jelenik meg.
- [x] Új oldal a lista végére kerül.
- [x] Törlés után a fennmaradó sorrend helyes marad.
- [x] Mobilon az order gombok használhatók és nem takarják ki egymást.
- [x] Diagnosztika: 0 hiba.
- [ ] PC/Desktop live teszt továbbra is csak külön felhasználói kérésre.
**Következő aktív lépés:** deploy után mobilon a fenti sorrendteszt végrehajtása.


### 40.67.1 — BETÖLTÉSI HIBA JAVÍTÁS — 2026-09-22

**Állapot:** [~] JAVÍTVA; élő újrateszt még hátra.

Az oldalsorrend funkció első deploy/élő betöltésekor az Editor v2 `app.js` fájlban szintaktikai hiba jelent meg: `Uncaught SyntaxError: Invalid or unexpected token` a `movePage` és `editPageMeta` közötti részen. A kódban egy véletlenül literal `\\n` token került JavaScript-forrásként a sorba, ezért a böngésző nem tudta parse-olni az egész `app.js` fájlt.

**Javítás:** a hibás literal token valódi sorvége karakterre lett cserélve.

- Fájl: `public/editor-v2/app.js`
- Javító commit: `7541e5dd5cf52b69323bb97726fbfd67e5009404`
- A javítás nem módosítja az oldalsorrend logikáját, csak a betöltést blokkoló syntax errort szünteti meg.

**Kötelező következő ellenőrzés:**
1. Deploy után Editor v2 betöltése.
2. Ellenőrizni, hogy az `app.js` már syntax error nélkül betöltődik.
3. Diagnosztika / betöltés működik.
4. Ezután folytatni a 40.67 oldalsorrend mobil élő tesztjeit.
5. PC/Desktop live teszt továbbra is csak külön felhasználói kérésre.


## 40.68 — DRAFT / PREVIEW / PUBLISH HARDENING — 2026-09-22

**Állapot:** [x] LEZÁRVA — a 40.68 lifecycle korábban teljes funkcionális, CI és mobil teszttel lezárult.

---

## 40.69.1 — EDITOR_REVISIONS + DRAFT/PUBLISH PERSISTENCE TELJES KÓD- ÉS D1-SÉMAAUDIT — 2026-09-22

**Állapot:** [x] AUDIT PASS — kódmódosítás ebben a lépésben nem történt.

### Auditált források
- `src/routes/admin/editor.ts`
- `src/routes/admin/pages.ts`
- `migrations/0001_initial_schema.sql`
- `migrations/0002_editor_revisions.sql`
- `migrations/0008_restore_canonical_standard_pages.sql`
- `migrations/0009_page_sort_order.sql`
- `docs/MASTER-DEVELOPMENT-PLAN.md`

### 1. Canonical draft állapot
- `pages.content_json` = aktuális Editor v2 draft dokumentum.
- Normál Editor mentéskor ugyanaz a dokumentum kerül a `pages.content_json` mezőbe.
- A mentéssel együtt új `editor_revisions` rekord készül.
- A revision dokumentuma a mentett JSON teljes snapshotja, nem diff.
- Ez jelenleg egyértelmű és használható canonical alap.

### 2. editor_revisions D1-séma
A `migrations/0002_editor_revisions.sql` alapján:
- `id TEXT PRIMARY KEY`
- `page_id TEXT NOT NULL`
- `version INTEGER NOT NULL`
- `document_json TEXT NOT NULL`
- `created_by TEXT`
- `note TEXT NOT NULL DEFAULT ''`
- `created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP`
- `UNIQUE(page_id, version)`
- `FOREIGN KEY(page_id) REFERENCES pages(id) ON DELETE CASCADE`
- `FOREIGN KEY(created_by) REFERENCES users(id) ON DELETE SET NULL`
- index: `(page_id, version DESC)`
- index: `created_at`

**Megállapítás:** a page-onkénti verzió-egyediség canonical szinten már létezik. Külön globális version sequence nem szükséges.

### 3. Publish snapshot
- `pages.published_content_json` a publikált snapshot.
- Publishkor a `content_json` és az új `editor_revisions` rekord létrehozása egy D1 `batch()` műveletben történik, majd ugyanabban a batchben a published snapshot is frissül.
- A snapshot jelenleg **nem tartalmaz explicit revision-ID hivatkozást**.
- Következmény: a published snapshot és az `editor_revisions` között jelenleg tartalmi egyezés van, de nincs közvetlen adatbázis-szintű „ezt a revisiont publikáltuk” kapcsolat.

### 4. Version-generálás / atomicitás
A jelenlegi útvonal:
1. `MAX(version)` lekérdezés.
2. `+1`.
3. revision INSERT.
4. szükség esetén publish snapshot update.

A 3–4. lépések batchben atomikusak, **de a version kiosztás a batch előtt történik**.

**Audit finding:** konkurens mentéseknél két kérés ugyanazt a következő verziószámot láthatja; ezt a `UNIQUE(page_id, version)` constraint végül megakadályozhatja, de a kliens determinisztikus concurrency-kezelése még nincs kialakítva. Ezt nem tekintjük lezárt concurrency contractnak.

### 5. Rollback
A `PUT /api/admin/editor` jelenlegi rollback útvonala:
- kiválasztja a `page_id + version` revisiont;
- validálható Editor v2 dokumentummá normalizálja;
- a legnagyobb verzió után új verziót hoz létre;
- `pages.content_json`-ba visszaírja a kiválasztott dokumentumot;
- az új revision note-ja `Rollback from vX`.

**Fontos:** a rollback jelenleg **draft rollback**, nem automatikus publish.
- `published_content_json` nem változik.
- `is_published` nem változik.
- külön Publish szükséges, ha a rollbackelt draftot LIVE állapotba akarjuk vinni.
- Ez jó canonical irány, de ezt a contractot explicit módon rögzíteni kell.

**Audit finding:** rollback jelenleg nem ír `audit_log` eseményt.

### 6. Unpublish
- Az unpublish csak `is_published=0` állapotot ír.
- Draft és published snapshot megmarad.
- Már unpublished állapotban idempotens választ ad.
- `page.unpublish` audit esemény készül.
- Unpublish nem hoz létre új editor revisiont, ami a jelenlegi jelentése mellett indokolható: nem dokumentumváltozás, hanem publication-state változás.

### 7. Page metadata / slug módosítás
A `src/routes/admin/pages.ts` PATCH útvonal:
- a canonical `pages` rekordot módosítja;
- a Page Model page metaadatait is frissíti;
- publikált oldalnál a published snapshotot is frissíti.

**Audit finding:** a title/slug/metadata változás jelenleg **nem hoz létre `editor_revisions` rekordot**. Emiatt a revision history dokumentum-snapshotként működik, de nem teljes oldal-életciklus-történet.

Ez különösen fontos, mert a slug/meta változás publikált snapshotot is módosíthat anélkül, hogy a revision historyban megjelenne.

### 8. Page creation
Az új oldal létrehozásakor:
- `pages` INSERT történik;
- ezután külön `editor_revisions` INSERT készül v1-ként.

**Audit finding:** a page létrehozása és az első revision létrehozása jelenleg nem egy közös D1 batch/transaction boundaryban történik. Hiba esetén elméletileg létrejöhet page revision nélkül.

### 9. Auth boundary
Mind az Editor, mind a Pages admin route elején:
- authentication ellenőrzés történik;
- `editor` szerepkör szükséges.

A revision write tehát nem publikus API-útvonalon történik.

### 10. Corrupted revision / Page Model
- Rollback előtt a revision dokumentuma `normalizeEditorDocument()` útvonalon kerül feldolgozásra.
- Publish előtt a tényleges `validatePublishDocument()` fut.
- A jelenlegi validációs védelem nem engedi, hogy hibás canonical hierarchy publikálódjon.
- Revisionek teljes történeti korruptsági auditja és helyreállítási policy még nincs lezárva.

### 11. Cache / diff / retention / stale revision
Jelenlegi állapot:
- explicit revision diff nincs;
- retention policy nincs;
- cache invalidation contract nincs külön revision-szinten;
- stale revision / optimistic concurrency contract nincs;
- multi-tab / multi-user konfliktuskezelés nincs.

Ezek nem kerülnek most külön párhuzamos munkasávba; a canonical revision contract részeként kell őket megoldani.

### 12. Canonical audit conclusion
**A jelenlegi rendszer alapja használható, de a revision/publish kapcsolat még nem tekinthető teljesen lezártnak.**

A következő minimális canonical javítási csomag szükséges:
1. explicit published-revision kapcsolat;
2. determinisztikus version/concurrency contract;
3. rollback audit esemény;
4. metadata/slug revision-stratégia;
5. page-create + initial-revision atomicity;
6. tesztelt persistence boundary;
7. később retention/diff/cache/conflict policy ugyanebben a canonical revision rendszerben.

**Kódmódosítás ebben a pontban:** nincs.

### Következő egyetlen aktív pont
**40.69.2 — canonical revision contract + D1 persistence boundary megtervezése és minimális implementációja.**

**PC/Desktop live teszt:** továbbra is PENDING, és csak külön felhasználói kérésre indítható.


---

## 40.69.2 — CANONICAL REVISION CONTRACT + D1 PERSISTENCE BOUNDARY — 2026-09-22

### 40.69.2 CI VALIDÁCIÓS JAVÍTÁS — 2026-09-22
- A revision-contract implementáció első Core CI futása TypeScript hibával állt meg.
- Javítva: `src/routes/admin/pages.ts` metadata spread csak objektum-típusra történhet.
- A GitHub által jelzett `.ts` importhibák az érintett jelenlegi fájlokban már nem reprodukálhatók; a következő CI futás döntő ellenőrzés.
- Node 20 deprecation és Ubuntu 26 migration csak warning/notice, nem a build törési oka.
- PC/Desktop live teszt továbbra sem indul.


**Állapot:** [~] IMPLEMENTÁCIÓ KÉSZ; VALIDÁCIÓ FOLYAMATBAN.

### Canonical contract
- `editor_revisions` marad az egyetlen szerveroldali dokumentum-snapshot történet.
- `pages.content_json` = aktuális draft.
- `pages.published_content_json` = LIVE snapshot.
- `pages.published_revision_id` = a LIVE snapshothoz tartozó pontos revision.
- A document `revision` mezője a page-en belüli revision verziószámot követi.
- Save / rollback / metadata változás új revisiont hoz létre, ha a dokumentum/meta ténylegesen változik.
- Unpublish nem készít document revisiont; a korábbi published revision hivatkozás megmarad a legutóbbi LIVE snapshot azonosítására.
- Rollback továbbra is csak draft rollback; publish külön művelet.
- Publish a draft revisiont és a published snapshotot ugyanazon D1 batchben írja.
- Page létrehozásakor a page + első revision egyetlen D1 batchben jön létre.
- Revision ütközés ellen `expectedVersion` optimistic-concurrency ellenőrzés került be.
- Rollback audit eseménye: `page.rollback`.
- Publikálás auditja tartalmazza a revision ID-t.
- Published metadata/slug módosítás revisiont hoz létre és az új revision lesz a LIVE revision.

### Implementált változások
- `migrations/0010_canonical_revision_contract.sql`
  - `pages.published_revision_id`
  - meglévő published snapshotok best-effort revision-link visszaállítása
  - index
- `src/routes/admin/editor.ts`
  - expectedVersion konfliktusvédelem
  - szerveroldali revision számmal mentett document
  - published revision linkage
  - rollback revision ID + audit
- `src/routes/admin/pages.ts`
  - page list revision/publishedRevisionId
  - metadata/slug/description revision
  - expectedVersion
  - page create + initial revision atomic batch
  - published metadata revision linkage
- `public/editor-v2/app.js`
  - mentéskor expectedVersion küldése
  - persisted revision követése
  - metadata módosításnál expectedVersion
  - reloadkor revision felvétele

### Jelenlegi tesztállapot
- Canonical revision contract implementálva.
- Első CI futás a pages.ts szintaktikai hibáját jelezte; javítva.
- Második CI futás már eljutott a typecheckig, ahol a workflow dependency-install hiánya miatt `@cloudflare/workers-types` nem volt elérhető.
- Javítás: `.github/workflows/editor-core-test.yml` most `npm install --no-audit --no-fund` lépést futtat typecheck előtt.
- CI újrafuttatás: **PENDING**.
- Remote D1 migration: **PENDING**.
- API persistence regression: **PENDING**.
- Mobil live teszt: **PENDING**.
- PC/Desktop live teszt: **PENDING**, és továbbra is csak külön felhasználói kérésre.

### Következő egyetlen aktív ellenőrzési lépés
**40.69.2 részeként: a canonical D1 migration branchbe emelése után CI ellenőrzés, majd a remote D1 migration alkalmazása és API persistence regression teszt.**

### 40.69.2 — MIGRATION GAP AZONOSÍTVA ÉS JAVÍTVA — 2026-09-22

**Állapot:** [~] MIGRATION A BRANCHBEN PÓTOLVA; REMOTE D1 + API LIVE TESZT MÉG HÁTRA.

A live Editor v2 `API hiba (500)` problémájának auditja során kiderült egy konkrét persistence-gap: a `v2/foundation` branch `migrations/` könyvtárában a kód által már használt `pages.published_revision_id` oszlophoz tartozó `0010_canonical_revision_contract.sql` migration nem szerepelt, miközben a `src/routes/admin/pages.ts` és `src/routes/admin/editor.ts` már erre az oszlopra támaszkodik.

**Bizonyított állapot:**
- `migrations/0009_page_sort_order.sql` volt a branch utolsó migrationje.
- A `0010_canonical_revision_contract.sql` a `main` ágon létezett, de `v2/foundation` alatt hiányzott.
- A Cloudflare Worker ezért a canonical revision contract új DB oszlopát csak kódból várhatta; a remote D1 migráció külön alkalmazása továbbra is szükséges.
- A migration tartalma: `published_revision_id` hozzáadása, meglévő published snapshotok best-effort revision-link visszaállítása, index létrehozása.

**Javítás:**
- új fájl: `migrations/0010_canonical_revision_contract.sql`
- commit: `eb9d89dc35db854c6b0de6368ba38fe577853a4c`
- CI ellenőrzés: **PASS — Editor Core Test #525** (`eb9d89dc35db854c6b0de6368ba38fe577853a4c`).

**Fontos:** a 500-as live hibát ezzel még nem tekintjük automatikusan lezártnak. A migration már branchben van és a Core CI PASS. A következő lépés kötelezően a remote D1 migration alkalmazása → `/api/admin/pages` live ellenőrzés → Editor v2 betöltés. Csak az exact API eredmény alapján léphetünk tovább.


**Továbbra sem indul PC/Desktop live teszt.**

## 40.69.2.1 — EDITOR V2 BETÖLTÉSI SYNTAX HIBA — 2026-09-22

**Állapot:** [~] JAVÍTVA; élő újrateszt még hátra.

A felhasználói élő ellenőrzés során az Editor v2 betöltése ezt a böngészőhibát jelezte:
- `Uncaught SyntaxError: Unexpected token 'async'`
- `public/editor-v2/app.js`
- a deployolt fájlban a `editPageMeta()` deklaráció hibásan `async async function` formában szerepelt.

### Gyökérok
A hiba tisztán JavaScript parse-hiba volt: az `async` kulcsszó kétszer szerepelt a függvény deklarációjában. Emiatt az egész `app.js` modul parse-olása megszakadt, tehát az Editor runtime egyáltalán nem tudott elindulni.

### Javítás
- csak a hibás deklaráció javult: `async async function editPageMeta(...)` → `async function editPageMeta(...)`;
- más Editor Core, Page Model, hierarchy vagy persistence logika nem változott;
- teljes fájlszintű kereséssel ellenőrizve: **1** hibás `async async` előfordulás volt, és az javítva lett.
- Javító commit: `55b3346435a93eab76b5e70109add1f2290c6689`.

### Tesztállapot
- [x] A konkrét syntax hiba azonosítva.
- [x] A konkrét syntax hiba javítva.
- [ ] GitHub Actions új CI futás a javító commitra.
- [ ] Cloudflare deploy után Editor v2 teljes betöltés.
- [ ] Diagnostics: 0 hiba.
- [ ] Oldalak panel és canvas betöltés.
- [ ] 40.69.2 persistence tesztfolytatás.

**Következő egyetlen aktív ellenőrzés:** a canonical D1 migration branch/CI ellenőrzése, majd remote D1 apply és az Editor v2 `/api/admin/pages` live API ellenőrzése. PC/Desktop live teszt továbbra is PENDING.


### 40.69.2 — CORE CI PASS / REMOTE D1 KAPU — 2026-09-22

**Állapot:** [~] CORE CI PASS; REMOTE D1 MIGRATION ÉS LIVE API TESZT BLOKKOLÓ KAPU.

- migrations/0010_canonical_revision_contract.sql branchben jelen van.
- Editor Core Test #525: **SUCCESS**.
- A dokumentációs checkpoint #526 szintén **SUCCESS**.
- A kód + migration statikus/TypeScript/editor-core ellenőrzése jelenleg zöld.
- A production/remote D1 séma állapota még nincs ellenőrizve ezen a ponton.
- Az Editor v2 korábbi live API hiba (500) ezért továbbra is nyitott; nem tekintjük javítottnak addig, amíg a remote D1 migration után az /api/admin/pages ténylegesen 200-at nem ad.

**Egyetlen következő lépés:**
1. remote D1 migration alkalmazása a v2/foundation aktuális HEAD-re;
2. /api/admin/pages live API ellenőrzés;
3. Editor v2 teljes betöltés;
4. csak PASS után persistence regression folytatás.

**PC/Desktop live teszt:** továbbra is PENDING, nem indul.


## 40.69.3 — REVISION_CONFLICT GYÖKÉROK: DOCUMENT/PAGE REVISION SZÉTCSÚZÁS — 2026-09-22

**Állapot:** [~] GYÖKÉROK AZONOSÍTVA ÉS KÓDBAN JAVÍTVA; LIVE MENTÉS/PUBLISH ÚJRATESZT MÉG HÁTRA.

A felhasználói live teszt során az Editor v2 betöltött, de **Mentés** és **Publish** közben folyamatosan ezt jelezte:

> „Az oldal időközben módosult. Töltsd újra az oldalt a legfrissebb verzióval.”

### Gyökérok

A canonical Page Model két revision mezőt tart:
- dokumentumszintű `document.revision`;
- oldalszintű `document.pages[pageId].revision`.

A korábbi persistence implementáció mentéskor csak a dokumentumszintű revisiont frissítette. Emiatt:
1. az `editor_revisions` szerveroldali verziószáma növekedett;
2. a `document.revision` növekedett;
3. a `pages[pageId].revision` régi értéken maradt;
4. az `/api/admin/pages` válasz ezt követően régi revisiont adhatott vissza;
5. a kliens következő Mentés/Publish kérésében hibás `expectedVersion` ment ki;
6. a szerver helyesen `REVISION_CONFLICT` hibával blokkolta a műveletet.

Ez tehát **nem valódi másik felhasználó által okozott módosítás**, hanem a saját canonical revision állapotunk szétszinkronizálása.

### Javítás

- `src/routes/admin/pages.ts`
  - az oldallistázás revision értéke a canonical document revisionből, szükség esetén a page revisionből kerül meghatározásra;
  - metadata/slug revision esetén a `document.revision` és `document.pages[pageId].revision` együtt frissül;
  - új oldal létrehozásakor mindkét revision mező `1`.

- `src/routes/admin/editor.ts`
  - normál Save/Publish esetén a document- és page-level revision együtt frissül;
  - Rollback esetén ugyanígy együtt frissül a következő revision.

- `public/editor-v2/app.js`
  - a kliens továbbra is a szerver által visszaadott canonical revisiont használja az `expectedVersion` értékéhez; külön második revision-logika nem került be.

### Fontos döntés

Nem kerül be „force save”, „ignore conflict” vagy automatikus konfliktusmegkerülés.

A `REVISION_CONFLICT` védelem marad aktív, mert ez védi a valódi multi-tab/multi-user stale mentéseket. A javítás a revision canonical szinkronizációját teszi helyessé.

### Érintett commitok

- `src/routes/admin/pages.ts` — `9a796e5ab020c2de24fe2354ad59b9cf641ee1ef`
- `src/routes/admin/editor.ts` — `1a95fda5d8ef8fbb2a1022975302b18421c3eb5a`

### Következő egyetlen aktív tesztkapu

Deploy után ugyanazon az oldalon:

1. Editor v2 betöltés.
2. Egy elem tartalmának módosítása.
3. **Mentés** → nem lehet `REVISION_CONFLICT`.
4. Oldal újratöltése.
5. Módosítás megmaradása.
6. Revision növekedése.
7. Második módosítás → **Mentés**.
8. **Publish** → nem lehet `REVISION_CONFLICT`.
9. Publikus oldal ellenőrzése.
10. Diagnostics: 0 hiba.

**Ha ez PASS, akkor folytatjuk a rollback + publish snapshot + unpublish regresszióval.**

**PC/Desktop live teszt:** továbbra is PENDING és nem indul, amíg külön nem kérjük.


## 40.69.4 — REVISION_CONFLICT MÁSODIK GYÖKÉROK: MEGLÉVŐ OLDALAK REVISION FORRÁSA — 2026-09-22

**Állapot:** [x] LEZÁRVA — LIVE SAVE + PUBLISH PASS, 2026-09-22.

A javítás után is fennálló `REVISION_CONFLICT` auditja megmutatta, hogy nem elég a Page Model revision mezőire támaszkodni. A már létező oldalaknál a `editor_revisions` táblában lehet a tényleges legfrissebb revision, miközben a régi `content_json` dokumentumban a revision mező elavult.

### Gyökérok
A GET `/api/admin/pages` korábban közvetlenül a documentből számolta a kliensnek küldött revisiont. Így egy régi page-document revision érték kimehetett a kliensnek akkor is, ha az `editor_revisions` már magasabb verzión állt. A kliens ezt küldte vissza `expectedVersion` néven, a szerver pedig helyesen elutasította.

### Javítás
- `src/routes/admin/pages.ts`
  - az oldallistázás revision forrása most az adott oldal `editor_revisions` rekordjainak `MAX(version)` értéke;
  - ha nincs revision rekord, fallbackként a document/page revision marad;
  - a kliens így ugyanazt a canonical server revisiont kapja, amit a konfliktusellenőrzés használ.

**Javító commit:** `d14400a33bd4097bf7eb87cf6ded8341e021eb92`

### Következő egyetlen aktív tesztkapu
Deploy után:
1. Editor v2 betölt.
2. Mentés egy kis módosítással.
3. **PASS esetén** ugyanaz az oldal újratölt.
4. Második mentés.
5. Publish.
6. Publikus oldal ellenőrzése.

Ha továbbra is `REVISION_CONFLICT` jelenik meg, nem módosítunk találomra: a konkrét API response + Network request `expectedVersion` és a szerver `currentVersion` értékét kell összevetni.

### 40.69.4 LIVE TESZT EREDMÉNY — 2026-09-22
- [x] Editor v2 betölt.
- [x] Mentés egy kis módosítással — PASS.
- [x] Oldal újratöltése után a módosítás megmaradt.
- [x] Második mentés — PASS.
- [x] Publish — PASS.
- [x] A felhasználói visszajelzés szerint a teljes Save/Publish folyamat működik.
- [x] A `REVISION_CONFLICT` hiba megszűnt.
- [ ] Rollback + published snapshot + unpublish regresszió — következő aktív tesztkapu.

**PC/Desktop live teszt:** továbbra is PENDING.


## 40.69.5.A — ROLLBACK UI IMPLEMENTÁCIÓ — 2026-09-22

**Állapot:** [x] IMPLEMENTÁLVA; a felhasználói live rollback teszt PASS.

A rollback szerveroldali útvonal már létezett, de az Editor v2 kliensben nem volt hozzá UI. Ezt az aktív 40.69.5 tesztkapu előtt pótoltuk.

### Implementáció
- `public/editor-v2/app.js`
  - az Editor oldal betöltése most lekéri az adott oldal revision historyját a canonical `GET /api/admin/editor?pageId=...` végpontról;
  - revision lista megjelenítése;
  - korábbi revision kiválasztható;
  - megerősítés után a meglévő `PUT /api/admin/editor` rollback útvonalat használja;
  - `expectedVersion` kötelezően a legfrissebb ismert revisionből kerül elküldésre;
  - sikeres rollback után friss Editor dokumentum és revision history töltődik be;
  - nincs force-save és nincs második rollback/state rendszer.
- `public/editor-v2/index.html`
  - Revision előzmények panel került az Oldalak panel alá;
  - verzió, megjegyzés és időpont látható;
  - aktuális revision nem állítható vissza önmagára.
- `public/editor-v2/editor.css`
  - desktop és mobile kompatibilis revision-lista/stílus.

### Git / CI
- Aktuális branch HEAD: `a493debc3a0cb469b6d1aa7802d0367113420501`
- Commit: `a493debc3a0cb469b6d1aa7802d0367113420501` — `style: add revision rollback panel`
- Editor Core Test #537: **queued** az állapotmentés pillanatában.

### 40.69.5.B — ROLLBACK LIVE SMOKE TEST — 2026-09-22

**Állapot:** [x] PASS — felhasználói élő teszt: **„Működik”**.

- [x] Revision előzmények panel betölt.
- [x] Korábbi revision kiválasztható és visszaállítható.
- [x] Rollback megerősítés működött.
- [x] A draft visszaállt a kiválasztott korábbi állapotra.
- [x] A rollback új revisionként jött létre.
- [x] Újratöltés után a visszaállított draft megmaradt.
- [x] A rollback nem publikált automatikusan.

**Következő egyetlen tesztlépés:** published snapshot + unpublish regressziós teszt.

**Fontos:** a rollback önmagában nem publikál. A `published_content_json` / LIVE állapot változatlanságát a következő 40.69.5 regressziós lépésben külön ellenőrizzük.

**PC/Desktop live teszt:** továbbra is PENDING, nem indul automatikusan.