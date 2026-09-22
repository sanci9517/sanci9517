# Sanci9517 — EGYSÉGES MASTER FEJLESZTÉSI, TESZTELÉSI ÉS FUNKCIÓBŐVÍTÉSI TERV

**Verzió:** MASTER-2.39.70  
**Dátum:** 2026-09-22  
**Repository:** `sanci9517/sanci9517`  
**Aktív branch:** `v2/foundation`  
**Projekt:** Sanci9517 Streamer Brand Platform  
**Állapot:** ez az egyetlen aktív fejlesztési terv.

**Legutóbbi igazolt PASS:** 2026-09-22 — 40.69.9 legacy Editor/Admin/System Page működési útvonal archiválása PASS; canonical Editor v2 maradt az egyetlen aktív vizuális szerkesztő.


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
- 40.69.2 — `[x]` LEZÁRVA.
- 40.69.5 — `[x]` LEZÁRVA — rollback + republish live regresszió PASS.
- 40.69.7 — `[x]` LEZÁRVA — célzott live page.update + audit_log együttállás PASS.
- A pageOrder mobil élő tesztje nem aktuális feladat; a 40.67 teljes mobil tesztje már lezárt.
- A korábban csak mobilon tesztelt funkciók PC/Desktop visszatesztje későbbi tesztkapu, és csak a felhasználó külön kérésére indul.

**Boot-szabály:** új beszélgetésben a modellnek először ezt a 00/B blokkot, majd közvetlenül a 00/A indexet kell figyelembe vennie. Ha bármely régi checkpoint ettől eltér, a régi checkpointot kell figyelmen kívül hagyni, nem az aktuális MASTER állapotot.

**Egyetlen aktuális folytatási mondat:**
> „Folytassuk a Sanci9517 MASTER tervet a 40.69.9 canonical Pages / Visual Editor / Schedule architektúra auditjával: először legacy-rétegek feltérképezése és archiválási terv, kódmódosítás csak az audit után.”

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
**40.69.12.B — Schedule binding + read service**

**Státusz:** [!] BLOKKOLVA — a read service CI PASS, az üres élő endpoint PASS, de a meglévő legacy Schedule UI nem kompatibilis a canonical admin API-val, ezért a tényleges D1 rekord létrehozási live teszt még nem zárható.

- [x] Schedule node canonical binding: `dataBindings.schedule = { source: "schedule_items", version: 1 }`.
- [x] Új szerveroldali canonical read service: `src/core/schedule-read.ts`.
- [x] A read service kizárólag a canonical Schedule domainből olvas; nem enged tetszőleges endpointot vagy SQL-t a Page Modelből.
- [x] Támogatott módok: `upcoming`, `all`, `next`.
- [x] Limit 1–50; `next` automatikusan 1 elemre korlátoz.
- [x] Státuszok whitelistelve: `scheduled`, `live`, `completed`; `cancelled` kizárt.
- [x] Platformszűrés maximum 20 értékkel, értékenként maximum 40 karakterrel.
- [x] Sorrend csak `asc` / `desc`.
- [x] Az `upcoming/next` lekérdezés D1 `datetime('now')` alapján szűr, így kompatibilis a meglévő SQLite timestamp formátummal.
- [x] `/api/public/schedule` most a canonical read service-t használja, és biztonságos query paraméterekkel képes a node-konfiguráció szűrési szerződését kiszolgálni.
- [x] A route továbbra sem fogad tetszőleges SQL-t vagy endpointot.
- [x] Unit teszt a Schedule bindingra és a read-config normalizálásra.

**Érintett commitok:**
- `67d0e970b0c9ba99747704983e92c28f48db803` — canonical Schedule read service.
- `b5ab599fc2d6948a17fb9262caf964b667a93994` — Schedule node canonical binding.
- `2fff994360ba453644f06b0c9b7220dfcd964612` — public Schedule route canonical read service.
- `0ff1a61362e66d643a90abbaabd4f141280cb0ff` — route request forwarding.
- `9c07b700813f081ffb713dc8d1f7471364121604` — D1 timestamp comparison hardening.
- `be2f81890168220b12d1ddd338794b238396ef9e` — binding test.
- `8bfd384752aead962756b18b23ecd118c6cb9793` — read-config test.

**Fontos audit-megjegyzés:**
- [!] A szerveroldali `validatePublishDocument()` jelenleg még nem végzi el a Schedule config teljes Schedule-schema validációját; ezt külön hardeningként a publish/render kapu előtt rendezni kell. Nem tekintjük ezt megoldottnak pusztán a kliensoldali schema miatt.

**Tesztkapu:**
- [x] GitHub Editor Core CI PASS — Editor Core Test #585 / commit `ae7fe4c` zöld.
- [x] Üres élő `/api/public/schedule` válasz: `{"ok":true,"data":[]}`.
- [!] Tényleges D1 rekorddal végzett read teszt blokkolva: a legacy `public/admin.html` Schedule UI nem a canonical admin API szerződését használja.
- [ ] Tényleges D1 Schedule rekord létrehozása canonical API-n keresztül.
- [ ] Rekord visszaolvasása `/api/public/schedule` útvonalon.
- [ ] `next`, platform- és status-szűrés live ellenőrzése.
- [ ] MASTER lezárás.

### 40.69.12.B — Live audit megállapítás: legacy Schedule UI / canonical API eltérés

- [x] `src/routes/admin/schedule.ts` teljes létrehozási validáció auditálva.
- [x] A canonical POST body mezői: `title`, `platform`, `startsAt`, `endsAt`, `status`, `url`, `notes`.
- [x] A backend a kezdés/befejezés értékeket `Date.parse()` alapján validálja.
- [x] A meglévő `public/admin.html` Schedule UI nem a canonical kontraktust használja: `startAt` és `endAt` mezőket küld, miközben a backend `startsAt` és `endsAt` mezőket vár.
- [x] A legacy UI ráadásul `/api/admin/schedule/:id` URL-struktúrát használ, miközben a jelenlegi canonical route body-alapú `id` mezőt használ ugyanazon `/api/admin/schedule` végponton.
- [x] Ez magyarázza az `INVALID_SCHEDULE_ITEM` létrehozási hibát; a dátumválasztó önmagában nem bizonyult hibásnak.
- [x] Döntés: a legacy Schedule UI-t nem javítjuk vissza aktív rendszerként, mert a 40.69.9 szerint archivált réteg.
- [!] A live D1 read teszt csak akkor zárható, ha a canonical Schedule domainhez készül egy nem-legacy létrehozási útvonal / tesztadat, vagy a D1-ben kontrollált tesztrekord jön létre.

**Következő egyetlen aktív pont:** 40.69.12.B — canonical D1 Schedule tesztadat létrehozása legacy UI visszakapcsolása nélkül, majd public read/szűrés live teszt.

**Következő aktív pont a kapu után:** 40.69.12.C — Editor preview renderer.
## 40.69.9 — CANONICAL PAGES / VISUAL EDITOR / SCHEDULE ARCHITEKTÚRA TELJES AUDIT — 2026-09-22

**Állapot:** [~] AUDIT FOLYAMATBAN — ebben a lépésben nincs kódmódosítás.

### Audit eredmény
- [x] A jelenlegi aktív Visual Editor a `public/editor-v2/` rendszer: közös state, command, schema, validation, canvas, property registry, responsive, rich-text, diagnostics és core tesztek.
- [x] `/admin/editor` közvetlenül az Editor v2 felületre nyit; nem a régi `public/editor/` rendszert használja.
- [x] A canonical oldal-életciklus: `/api/admin/pages` + `/api/admin/editor` + `editor_revisions` + draft/published snapshot + rollback/audit.
- [x] A régi `public/assets/system-page-editor.js` fix 9 rendszeroldalas modellt és külön `/api/admin/system-pages` GET/PUT rendszert használ; create/delete nincs.
- [x] A régi `public/assets/system-page-runtime.js` külön `system_page_content` adatmodellt renderel, tehát nem a canonical Page Modelt.
- [x] A repositoryban külön `public/editor/` legacy editor-kódbázis is van; ez nem lehet az új fejlesztések alapja.
- [x] `public/admin.html` legacy admin UI; tartalomkezelési API-szerződése eltér a canonical pages API-tól, ezért nem lehet a jövőbeli Visual Editor forrása.
- [x] Az Adásrend D1 CRUD backendje már működik; a 40.69.8 live create/update/delete teszt PASS.
- [x] Döntés: az Adásrend adat-domainje marad külön D1-ben, de a vizuális Adásrend oldal canonical `pages` + Editor v2 dokumentum lesz.
- [x] Döntés: nem készül külön Schedule Editor és nem marad fenn második Visual Editor.

### Hol van a weboldal szerkesztő a MASTER-ben?
A weboldal-szerkesztő **már elkészült alapként**: ez az Editor v2. A MASTER további editor-pontjai ennek a canonical rendszernek a folyamatos bővítései. Az Adásrend-készítő ennek egy domain-specifikus felhasználási rétege lesz, nem új szerkesztő.

### 40.69.9 — LEGACY ARCHITEKTÚRA ARCHIVÁLÁSA — [x] PASS

A teljes audit után a régi rendszer működési útvonalait leválasztottuk a canonical rendszerről.

- [x] `/admin` és `/admin.html` többé nem nyitja meg a legacy admin UI-t; authenticated felhasználót az `/admin/editor` canonical Editor v2-re irányít.
- [x] `/api/admin/system-pages` route-regisztráció megszüntetve.
- [x] `/api/public/system-pages` route-regisztráció megszüntetve.
- [x] `system-page-runtime.js` automatikus HTML-injektálása megszüntetve.
- [x] A régi Editor/Admin/System Page fájlokat nem töröltük véglegesen; dokumentált legacy archív rétegként megmaradnak visszaállítási lehetőséggel.
- [x] Archiválási dokumentum: `docs/ARCHIVE-LEGACY-LAYERS.md`.
- [x] A `system_page_content` D1 adatot ebben a lépésben nem töröltük; cleanup/migráció külön kapu lesz.
- [x] A canonical rendszer egyetlen aktív Visual Editorja továbbra is `public/editor-v2/`.

**Implementációs commitok:**
- `3a8c9afbe52429e84d2c2d7272215ae52e558b95` — legacy route/runtime leválasztás
- `c5ad2b870a11b394d07903ca1e35c4c9425f6bd5` — legacy archívum dokumentálása

**Fontos:** a régi fájlok fizikai törlése/migrációja nem része ennek a kapunak. Előbb az új canonical Schedule/Page rendszert kell felépíteni és validálni; utána külön cleanup kapuban lehet véglegesíteni a régi adatot/fájlokat.

### Következő egyetlen aktív pont
**40.69.10 — Canonical Schedule Builder szerződés:** az Adásrend D1 domain-adat és a canonical Pages + Editor v2 dokumentum közötti kapcsolat teljes auditja, majd az új builder implementációs terv. Kódmódosítás csak az audit lezárása után.


**40.69.7 lezárás:**
- [x] CI/typecheck/editor-core PASS.
- [x] Cloudflare deploy zöld.
- [x] Célzott live `page.update` + `audit_log` együttállás PASS.
- [x] MASTER-2.39.63-ban a 40.69.7 lezárása dokumentálva.

**40.69.8 audit szabály:** először csak teljes érintett kód- és adatfolyam-audit; kódmódosítás kizárólag bizonyított hiányosság esetén. A vizsgálat fókusza: page create/update/delete/rename, save/publish/unpublish/rollback, valamint minden további admin state mutation audit lefedettsége. Nem indítunk új UI- vagy platformfunkciót.

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

### 40.69.5.D — REPUBLISH LIVE SMOKE TEST — 2026-09-22

**Állapot:** [x] PASS — felhasználói élő teszt: **„Működik”**.

- [x] Már publikált, de módosított draft esetén a Publish vezérlő újrapublikálható állapotba kerül.
- [x] A gomb felirata dirty állapotban **„Újrapublikálás”**.
- [x] A meglévő save(true) → POST /api/admin/editor útvonal maradt az egyetlen publish útvonal.
- [x] Nem került be második publish state vagy párhuzamos API.
- [x] A felhasználói live teszt eredménye: **Működik**.
- [x] A korábbi hibát okozó publish.disabled=published UI-logika javítva lett.
- [x] Javító commit: c3740fb910042ddab707212abe55eb291983a71d — fix: allow republish for dirty published drafts.

**40.69.5 regressziós kapu lezárása:** a rollback és az újrapublikálás felhasználói élő tesztje PASS. A PC/Desktop live teszt továbbra is PENDING és nem indul automatikusan.

**Következő egyetlen aktív lépés:** 40.69.6 teljes revision/persistence audit; csak audit alapján készülhet új kódmódosítás.


### 40.69.6 — REVISION PERSISTENCE TELJES AUDIT — 2026-09-22

**Állapot:** [x] AUDIT PASS — új kódmódosítás nem szükséges ebben a lépésben.

**Áttekintett fő útvonalak:**
- `src/routes/admin/editor.ts`: Save, Publish, Rollback, Unpublish, expectedVersion, revision numbering.
- `src/routes/admin/pages.ts`: page list revision source, metadata/slug revision, published linkage, page-create + initial revision batch.
- `src/routes/public/pages.ts`: normal public route kizárólag published snapshotból dolgozik; explicit preview külön auth-gated.
- `src/core/page-model.ts`: canonical `sanci-page-document` normalizálás.
- `src/core/editor-validation.ts`: Publish előtti hierarchy/Page Model validation.
- `migrations/0010_canonical_revision_contract.sql`: published revision linkage és meglévő snapshotok visszakötése.
- `public/editor-v2/app.js`: egyetlen `save(true)` publish útvonal és a republish UI állapot.
- `.github/workflows/editor-core-test.yml`: Node 24 + install + typecheck + editor core teszt.

**Audit eredmények:**
- [x] `pages.content_json` továbbra is a draft snapshot.
- [x] `pages.published_content_json` továbbra is a LIVE snapshot.
- [x] `pages.published_revision_id` a LIVE snapshot konkrét revisionjére mutat.
- [x] Save/Publish/rollback revision számozása az `editor_revisions` MAX(version) értékéhez igazodik.
- [x] `expectedVersion` védelem nincs megkerülve.
- [x] Rollback draft-only marad; nem publikál automatikusan.
- [x] Publish egy D1 batchben írja a draftot, revisiont és LIVE snapshotot.
- [x] Page create + initial revision egy D1 batch.
- [x] Normál public route nem szolgál ki draftot.
- [x] Republish nem hozott létre második publish-rendszert.
- [x] A vizsgált canonical state/persistence útvonalban nem találtunk olyan hibát, amely most új kódmódosítást indokolna.

**Megállapított következő audit-téma:** az üzleti state-módosítások és az `audit_log` írása jelenleg több helyen külön lépés. Például Publish/Save/rollback/unpublish után az audit insert külön történik. Ez nem rontotta el a mostani live regressziós tesztet, de hiba esetén az üzleti művelet és az audit esemény eltérhet.

**Következő egyetlen aktív lépés:** 40.69.7 — audit-log atomicity és persistence-boundary hardening célzott audit.


### 40.69.7 — AUDIT-LOG ATOMICITY HARDENING — 2026-09-22

**Állapot:** [x] PASS — implementálva, CI/typecheck/editor-core PASS, Cloudflare deploy zöld, célzott live audit PASS.

**Elvégzett módosítás:**
- [x] Létrejött a közös `src/core/audit.ts` `auditStatement()` helper.
- [x] Editor Save/Publish/Unpublish/Rollback audit statementek a state-módosítással azonos D1 batch-ben futnak.
- [x] Page create/delete/update audit statementek a megfelelő state-módosító batch részei.
- [x] Megszűnt a különálló `await audit(...)` persistence-lépés az érintett Editor/Page admin útvonalakon.
- [x] Nem készült második audit-rendszer.

**Módosító commitok:**
- `3e424605a5599f32f7e94f546c4eeaa3ad76e00f` — audit helper
- `e7389f87102227155f9b9998d9114c5a0f51ca48` — editor atomic audit
- `95fb08738c69b5c47710efd6fbd8ebb674005ed1` — page update atomic audit

**CI / typecheck / Editor Core teszt — 2026-09-22:**
- [x] CI zöld.
- [x] Typecheck PASS.
- [x] Editor Core Test PASS.
- [x] A 40.69.7 tesztkapu kódoldali/CI része lezárható.
- [x] Deploy ellenőrzés — a felhasználó visszaigazolta, hogy az utolsó Cloudflare állapot zöld.
- [x] Célzott live audit — az `uj-oldal` cím módosítása `Új oldal` → `Új oldal test` sikeresen létrejött a `pages` táblában, és ugyanahhoz a pageId-hoz `page.update` audit rekord jött létre.
- [x] Audit metadata ellenőrzés: `version=15`, `revisionId=924b38b0-8d7f-4fac-acbb-4696dc7e421e` rögzült az audit rekordban.
- [x] Az audit rekord időpontja közvetlenül a state-módosítás előtt/azzal összhangban jelent meg; a live smoke teszt bizonyította, hogy a canonical admin update útvonal az auditot is létrehozza.

**Live teszt eredmény:** PASS — a state-módosítás és a megfelelő `audit_log` esemény együtt igazolva.

**Következő egyetlen lépés:** 40.69.7 lezárva; a következő egyetlen aktív pont kijelölése a MASTER index alapján, külön audit után.

**Fontos:** a kódot a módosítás után újraolvastuk; a CI/typecheck/editor-core tesztkapu zöld. PC/Desktop live teszt továbbra is PENDING.


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

## 40.69.10 — Canonical Schedule Builder contract audit — 2026-09-22

**Állapot:** [x] AUDIT PASS — kódmódosítás nem történt.

A teljes releváns Schedule → Page Model → Editor v2 → public render adatfolyamot auditáltuk a 40.69.9 legacy rendszer-archiválás után.

### Canonical határ rögzítve

A Schedule két külön, de összekapcsolt réteg marad:

1. **Schedule domain data — D1**
   - a `schedule_items` tábla tartalmazza a tényleges stream eseményadatot;
   - mezők: id, title, platform, startsAt, endsAt, status, url, notes;
   - az admin Schedule API már működő POST/PUT/DELETE/GET CRUD;
   - létrehozás, módosítás és törlés canonical `auditStatement()` + D1 batch útvonalon történik;
   - ez a domain adat, nem Editor-vászon state.

2. **Schedule page — canonical Pages + Editor v2**
   - a menetrend oldal egy normál canonical `pages` rekord;
   - tartalma `sanci-page-document`, schemaVersion 1, Editor v2 Page Model;
   - a vizuális elrendezés, stílus, responsive állapot és komponenshierarchia a Page Model része;
   - draft/live revision, preview, publish, rollback és audit ugyanazt a canonical pages/editor lifecycle-t használja;
   - nem készül külön Schedule Editor és nem készül második Page Model.

### Kritikus audit-megállapítás

Az Editor v2 schema már tartalmazza a `schedule` node típust, de a jelenlegi editor command/schema rétegben nincs még kész, canonical Schedule-domain binding/rendering szerződés.

A jelenlegi `src/routes/public/schedule.ts` külön domain API-t ad vissza, miközben a canonical public Page útvonal a `pages.published_content_json` snapshotból renderelhető Page Modelt szolgáltatja.

Ezért **nem** kötjük a Schedule node-ot közvetlenül egy konkrét HTML oldalhoz, és **nem** másoljuk be a schedule_items adatokat a Page Model snapshotba. A Page Model csak a Schedule blokk konfigurációját és megjelenítési struktúráját tárolja; az aktuális eseményadat runtime-ban a Schedule domain API-ból érkezik.

### Tervezett canonical Schedule node szerződés

A következő implementációs kapu előtt rögzítendő minimum:

- node type: `schedule`;
- stabil domain azonosítás: a Schedule blokk konfigurációja ne tartalmazzon másolatot az eseményekről;
- konfigurációs mezők: megjelenítési mód, darabszám, státuszszűrés, platformszűrés, sorrend és szükség esetén cím/üres állapot;
- runtime adatforrás: canonical public Schedule API;
- editor preview: determinisztikus minta/preview adat vagy ugyanazon read-only domain adatforrás, de soha nem írható közvetlenül a Page Modelből;
- publish: csak a Page Model konfigurációja kerül a published revisionbe;
- schedule item CRUD: továbbra is D1 domain művelet, saját audit-tal;
- oldal publish/rollback: kizárólag a Page Model/revision lifecycle-t kezeli;
- Schedule item változás ne hozzon létre automatikusan Page revisiont, ha csak domain adat változott;
- Page design változás ne írja át a Schedule domain rekordokat.

### Audit eredmény

- [x] `schedule_items` domain tábla és index létezik.
- [x] Admin Schedule CRUD létezik és auditált.
- [x] Public Schedule read API létezik.
- [x] Canonical Pages + Editor v2 lifecycle létezik.
- [x] Editor v2-ben a `schedule` node type már definiált.
- [ ] Schedule node runtime renderer/binding contract még nincs lezárva.
- [ ] Schedule Inspector konfiguráció még nincs lezárva.
- [ ] Schedule preview renderer még nincs lezárva.
- [ ] Schedule node → public renderer integráció még nincs implementálva.
- [ ] Élő Schedule Builder teszt még nincs.

### Döntés

A régi System Page / `system_page_content` útvonalhoz nem térünk vissza. A következő kódpont kizárólag a **canonical Schedule node contract + renderer/binding terv** kidolgozása, majd ennek unit/integration tesztje. Csak ezután jöhet a Schedule Builder UI.

**Következő egyetlen aktív pont:** **40.69.11 — Schedule node contract és runtime binding teljes audit/tervezés**, kódmódosítás nélkül.

## 40.69.11 — Schedule node contract + runtime binding audit/terv — 2026-09-22

**Állapot:** [x] AUDIT/TERV PASS — kódmódosítás még nem történt.

A Schedule node jelenlegi állapotát összevetettük az Editor v2 Page Modellel és a D1 Schedule domain API-val.

### Megállapítások

- A `schedule` node type már része a canonical `NODE_TYPES` listának.
- A node alapból rendelkezik `props`, `style`, `responsive`, `dataBindings`, `metadata` mezőkkel.
- A Schedule node jelenleg nincs leaf-ként definiálva, ezért önálló blokk lehet, de nincs még specializált domain-logikája.
- A Page Model validáció jelenleg általános; Schedule-specifikus validáció nincs.
- Az admin Schedule API és public Schedule API már működik.
- A public API jelenleg maximum 50, nem cancelled elemet ad vissza `starts_at ASC` sorrendben.
- A domain API a Schedule események forrása; a Page Model nem tárolhatja ezeket az eseményeket.

### Canonical Schedule node contract v1

A Schedule node `props.schedule` alatt kizárólag konfigurációt tárol:

```text
props.schedule = {
  version: 1,
  mode: "upcoming" | "all" | "next",
  limit: number,
  statuses: string[],
  platforms: string[],
  order: "asc" | "desc",
  showTitle: boolean,
  showPlatform: boolean,
  showTime: boolean,
  showEndTime: boolean,
  showStatus: boolean,
  showNotes: boolean,
  showLink: boolean,
  emptyText: string
}
```

Alapértelmezett cél: `mode=upcoming`, `limit=10`, `statuses=["scheduled","live"]`, `platforms=[]`, `order="asc"`.

**Fontos:** eseménylista vagy egyedi `schedule_item` rekordok nem kerülnek a Page Modelbe.

### Binding contract

A runtime binding egyetlen canonical domainforrásra mutat:

```text
dataBindings = {
  schedule: {
    source: "schedule_items",
    version: 1
  }
}
```

A binding nem tartalmaz URL-t, auth tokent vagy konkrét eseményadatot. A public runtime saját belső API-rétegen keresztül olvassa a Schedule domain adatot.

### Preview contract

Editor previewban a Schedule node nem ír D1 adatot.

Első implementációs verzióban:
- ha van read-only Schedule adatforrás, azt használja;
- ha nincs elérhető adat, determinisztikus preview fixture jelenik meg;
- a fixture kizárólag megjelenítési célú, nem menthető domain adat;
- az Inspector mindig a konfigurációt szerkeszti, nem az eseményeket.

### Runtime/public contract

A publikált Page Model renderelésekor:
1. a renderer felismeri a `schedule` node-ot;
2. validálja/normalizálja a Schedule konfigurációt;
3. lekéri a Schedule domain adatot;
4. a konfiguráció alapján szűr/rendez/limitál;
5. biztonságosan rendereli a kártyákat;
6. ha nincs adat, az `emptyText` jelenik meg.

A domain adatok változása önmagában nem módosítja a Page revisiont.

### Biztonsági és adatkonzisztencia szabályok

- A Page Modelből nem lehet közvetlen SQL-lekérdezést indítani.
- A node konfiguráció nem adhat tetszőleges endpointot.
- A runtime nem bízhat a kliens által küldött nyers HTML-ben.
- URL-eket és szövegeket escaped/safe DOM renderinggel kell kezelni.
- A Schedule API saját státusz/platform szabályai maradnak az elsődleges domain validáció.
- A Schedule node konfigurációját külön schema/normalizer fogja védeni.

### Következő implementációs bontás

**40.69.12.A — Schedule schema + defaults + normalizer**
- canonical config schema;
- defaultok;
- invalid értékek normalizálása/elutasítása;
- unit tesztek.

**40.69.12.B — Schedule binding + read service**
- belső canonical read service;
- konfiguráció → domain query leképezés;
- publikus API-val kompatibilis eredmény;
- unit/integration tesztek.

**40.69.12.C — Editor preview renderer**
- Schedule node preview;
- fixture/read-only adat;
- mobil/desktop alaprender.

**40.69.12.D — Public page renderer**
- published Page Model → Schedule runtime;
- safe rendering;
- empty state;
- runtime teszt.

**40.69.12.E — Schedule Inspector / Builder UI**
- megjelenítési mód;
- limit;
- státusz/platform filter;
- sorrend;
- megjelenítési kapcsolók;
- üres állapot szövege.

**40.69.12.F — Élő end-to-end teszt**
- Schedule item CRUD;
- Schedule node konfiguráció mentése;
- preview;
- publish;
- public oldal;
- domain item módosítás → oldal újratöltve friss adat;
- rollback;
- audit.

### Döntés

Nem kezdjük el még a teljes Builder UI-t. Előbb a **Schedule schema + normalizer + read/binding réteg** készül el, mert ez akadályozza meg, hogy az Inspector, preview és public renderer három külön logikát használjon.

**Következő egyetlen aktív pont:** **40.69.12.A — Schedule schema + defaults + normalizer.**


## 40.69.12.A — Schedule schema + defaults + normalizer — 2026-09-22

**Állapot:** [x] PASS — felhasználói tesztkapu: PIPA.

### Elkészült

- Új canonical modul: `public/editor-v2/core/schedule-schema.js`.
- Rögzített Schedule schema version: `1`.
- Rögzített módok: `upcoming`, `all`, `next`.
- Rögzített sorrend: `asc`, `desc`.
- A publikus megjelenítéshez engedélyezett státuszok: `scheduled`, `live`, `completed`; a `cancelled` státusz nem kerülhet a Page Model Schedule konfigurációjába.
- Limit: 1–50.
- Platformlista: trimelt, egyedi értékek, maximum 20 platform, platformnév maximum 40 karakter.
- Megjelenítési kapcsolók szigorúan boolean értékek.
- `emptyText` trimelve, nem lehet üres, maximum 200 karakter.
- Default konfiguráció:
  - `mode=upcoming`
  - `limit=10`
  - `statuses=['scheduled','live']`
  - `platforms=[]`
  - `order=asc`
  - cím/platform/idő/link megjelenítés alapból aktív;
  - end time/status/notes alapból rejtett;
  - `emptyText='Nincs tervezett stream.'`.
- `createNode('schedule')` automatikusan canonical Schedule default konfigurációt kap.
- A Page Model `validatePage()` Schedule-specifikusan ellenőrzi a konfigurációt.
- A normalizer a whitespace-t trimeli és az ismétlődő státusz/platform értékeket deduplikálja.
- Ismeretlen mód/státusz, hibás limit, hibás boolean, üres platform/státuszlista vagy üres `emptyText` elutasításra kerül.
- Készült unit teszt a defaultokra, valid normalizálásra, invalid értékek elutasítására és Page Model validációra.

### Kódmódosítások

- `ed24df33e731e8c86939d35528ec5522829da435` — canonical Schedule schema module.
- `40d7206d06f59e81a0669234c5cdbfa3522151dc` — Page Model Schedule validation.
- `da236d1c955c8231f2a118ebe01b1b0b66f818e9` — Schedule node default initialization.
- `4a47cb20653e60fff646c51fe3ebcc0fe713b7b2` — Schedule schema tests.
- `daf09c0cd3cafa26cddc5ba1e5a6aad9bb5f599c` — Schedule node default test.

### Tesztkapu

- [x] Felhasználói tesztkapu: PIPA.
- [x] Schedule schema/default/normalizer működése visszaigazolva.
- [x] MASTER állapotfrissítve.

**Következő aktív lépés:** 40.69.12.B — Schedule binding + read service.
