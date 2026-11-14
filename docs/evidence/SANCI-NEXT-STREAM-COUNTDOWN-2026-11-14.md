# SANCI – következő streamig visszaszámláló | 2026-11-14

**Aktív követelmény:** SANCI publikus főoldal / `77.44.7.D` Visual Editor, saját testreszabható countdown komponens. **Állapot:** kóddal és D1 Publish-sel megvalósítva, teljes böngészős acceptance **OPEN / NOT_CERTIFIED**.

## Felfedezett tényleges adat

A read-only Cloudflare D1 preflight szerint `site-default` `schedule_items` táblában a következő későbbi, `scheduled` státuszú esemény:

- `343d3c1f-c77b-4a86-bdba-a3d6120d6d63`, **Forti / Twitch**, `2026-11-14T15:27` Europe/Budapest (CET, `2026-11-14T14:27:00.000Z`). Nem került be adatbázisba fiktív stream; a számláló ehhez és bármely későbbi/korábbi bejegyzéshez igazodik.

## Megvalósítás

- `public/editor-v2/core/schedule-time.js` (és `.d.ts`): naiv magyar falióra és ISO offset/Z időpontból determinisztikus epoch; téli CET/nyári CEST, DST gap/fold kezelése.
- `src/core/schedule-read.ts`: `mode=next` D1 szűrés kibővített lokális időzónaablakkal, a végső szigorú `epoch > now` kiválasztás, legfeljebb 100 jelöltből; a meglévő site-scoping/status guard megmarad, nem történik számlálás régi időpontra.
- `public/editor-v2/core/countdown-content.js`: opcionális `source:'next-stream'`, szigorú Manual ISO szerződés megtartva; önálló Date target nélküli, tényleges API-t lekérő automatikus megjelenítés; 1 mp-es nap/óra/perc/mp frissítés, 60 mp-es háttér-re-fetch, lejárat/üres állapot/API-hiba. Dinamikus cím és magyar dátum csak `textContent`-tel; XSS-kezelés.
- `public/editor-v2/ui/countdown-inspector.js`: szokásos szerkeszthető elemforrás-választó, saját dátum vagy következő Schedule-adás.
- `public/assets/site.css`, `public/editor-v2/element-content.css`: SANCI grafit-vörös 4-cellás, 320–1440px szélességhez méretezett, tabuláris tipográfiájú timer, nem indokolatlan új képes blokk. `public/visual-page.html`, `public/editor-v2/index.html`, `public/editor-v2/app.js`, `public/assets/page-renderer.js` friss asset-verziózott.
- `page-home` v111: **egy** eredeti `countdown` node `sanci-next-stream-countdown-v1`, `countdownVersion=1`, `source=next-stream`, a 2. szekcióban a heti menetrendgomb felett. A többi szerkeszthető elem és a két részből álló főoldal megmaradt.

## Save, Publish, D1 bizonyíték

1. Read-only D1 preflight: v110 legutóbbi Editor és published snapshot egyezett, 2 főoldalszekció, 0 countdown, 3 működő CTA, a menetrendben 2026-11-14 15:27 Forti található, a nav v13 változatlan.
2. **Save külön:** `editor_revisions` v111 + CAS `pages.content_json` + audit `audit-20261114-home-next-stream-save-v111`, 3/3 D1 change=1, published v110 megőrizve.
3. Mentés utáni read-only ellenőrzés: 18 szerkeszthető csomópont, 1 új Countdown node a jó helyen, manuális cél-ISO üres, automatikus menetrend-forrás, 3 CTA és 2 szekció megmaradt, nav v13.
4. **Publish külön:** CAS `published_content_json` + published revision `rev-20261114-home-next-stream-countdown-v111`, audit `audit-20261114-home-next-stream-publish-v111`, 2/2 D1 change=1.
5. Read-only postflight: published v111 = draft v111, az új countown source `next-stream`, a helyes 5. elemnyi teakert sorrend, 2 audit rekord, 2 szekció, a másik **7 publikus oldal változatlan**, `site_navigation` v13.

## Tesztek és kiadás

- Közvetlen V8 célzott, éles GitHub forrásszövegen végzett tesztek: **10/10 PASS** (CET/CEST/DST, kézi mód kompatibilitás, target nélküli automatikus mód); további **15/15 PASS** forrásszintaxis és UI/stílus/route-kapcsolat ellenőrzés.
- Az összefüggő Node regressziók a repóban: `tests/countdown-next-stream.test.js`, `public/editor-v2/tests/schedule-source.test.js`, `tests/browser/editor-countdown.test.js`, `tests/browser/home-next-stream-countdown.test.js`; a `package.json` `test:countdown`, `test:schedule` és `test:countdown:browser` parancsokhoz rendelve.
- **A `node --test` és a valódi Playwright teljes futtatása itt NOT RUN**: nincs a chat környezetben reprodukálható helyi teljes GitHub checkout/node_modules; a GitHub Actions fizetős/quota korlát miatt nem lett kézzel elindítva.
- Cloudflare deployments API legutóbbi postflight: `0ccd6644-18b8-4c47-8fdc-aa66bd44ff2e`, Worker verzió `659bca7f-feac-42e3-97d9-833c41b1b442`, **100%** forgalom, created `2026-11-13T23:30:46Z`, az összes runtime-kódcommit időpontja után. **Pontosan azonosított Worker source-SHA és statikus asset-hash NINCS bizonyítva**, nem állítjuk hogy teljes release kapu PASS.
- A Workers.dev HTTP URL a web eszközből nem elérhető; hitelesített mobilos előnézet, 320/390/768/1440px valódi Chrome vizuális megjelenítés és teljes Editor elfogadás **OPEN / NOT_CERTIFIED**. Nem volt D1 migráció, R2 törlés, külön teszt Worker, fizetős szolgáltatás vagy GitHub Actions dispatch.

## Továbbra nyitott

Valós honlap HTTP smoke, Countdown API GET és tényleges 320/390/768/1440px mobil render QA, exact asset hash, teljes `npm run typecheck`, `npm run test:schedule`, `npm run test:countdown:browser`, `npm run deploy:safe` lánc objektív validálása. Ha bármelyik hibázik, visszaállítható a v110 oldal, mert a régi `editor_revisions` nem lett törölve. A heti menetrend és az Editor további fejlesztése az egyetlen MASTER terv szerinti következő munka.

## Utólagos működési próba – 2026-11-14

A legfrissebb GitHub `countdown-content.js` és `schedule-time.js` kódot V8-ban, kontrollált DOM/API helyettesítőkkel ténylegesen végrehajtottuk: **6/6 PASS**. A pozitív, jövőbeli `scheduled` API-válasz négy numerikus cellát, a valós eseménycím/platform mezőt és ISO `<time datetime>` attribútumot eredményezett; üres API-válasznál „Még nincs meghirdetett adás.”, hálózati hiba esetén „Az időpont most nem érhető el.” szerepelt, mindkettő megtévesztő számlálás nélkül. Egyetlen időzítő indult egy elemhez. A teszt nem azonos a teljes Chromium/valódi webes végpont tesztjével.

A produkciós D1-en a kód által használt `mode=next` SELECT-szűrés `e.starts_at >= datetime('now','-3 hours')`, `site-default` és `status=scheduled` feltételekkel **egy jövőbeli „Forti”, 2026-11-14T15:27 Europe/Budapest** rekordot adott, a média JOIN működött. A D1 SELECT `changes=0`, további streamidőpont adatírás nem történt.

A Worker továbbra 100%-os forgalmon: `659bca7f-feac-42e3-97d9-833c41b1b442`. **Éles Workers.dev HTTP / teljes Chromium és pontos statikus asset hash továbbra NOT VERIFIED**; nem soroljuk ide a V8 DOM-helyettesítő sikerét.


## 2026-11-14 08:33–08:45 Europe/Budapest – folytatás: precíz időpont és képernyőolvasó QA

A tulajdonos a már éles `page-home` v111 visszaszámlálójának finomítását kérte: a meglévő egyetlen SANCI terv és Editor-komponens mentén haladtunk. **Nem történt új főoldali D1-írás:** az utolsó read-only előellenőrzésnél a `page-home` továbbra is publikált v111, az `audit` és a v13 navigáció érintetlen. A `schedule_items` tábla négy `scheduled` rekordjából egy jövőbeli adás: **Forti / Twitch, 2026-11-14 15:27 Europe/Budapest**; nem készítettünk fiktív időpontot.

**Konkrét kódjavítások:**

1. `public/editor-v2/core/schedule-time.js`: explicit `Z`/`±HH:MM` ISO időpontoknál sem fogad el 2026-02-30-hoz hasonló lehetetlen napot vagy hibás offsetet; helyi `.125` milliszekundumot megtartja; téli/nyári magyar idő, DST gap/fold változatlan szerződés szerint. Kizárólag a beépített `Intl` és JS Date kerül felhasználásra, 0 Ft/0 új függőség.
2. `src/core/schedule-read.ts`: `mode=next` SQL előszűrőben `datetime(e.starts_at)` normalizálja a tárolt `YYYY-MM-DDTHH:mm`, `Z` és explicit offsetes formátumokat, a tényleges UTC-epochot utána a meglévő helyi, szigorú `epoch > Date.now()` döntés választja ki. A D1 read-only próba `SELECT datetime('2026-11-14T15:27')` és `datetime('2026-11-14T15:27+01:00')` megfelelt; az új, tényleges site-scoped SELECT a Forti bejegyzést visszaadta, `changes=0`.
3. `public/editor-v2/core/countdown-content.js`: az API üres/törölt/lejárt esetén `<time>` `datetime` **és** elavult `aria-label` attribútuma is törlődik, nem marad képernyőolvasó számára hamis régi hátralévő idő. A pozitív API-eseménynél négy cella és valós title/platform megmarad.
4. `public/editor-v2/ui/countdown-inspector.js`: a menetrendforrást magyarázó egyértelmű rövid szöveg, és kézi módba visszakapcsolva, hiányzó időpontnál külön, `role=status` figyelmeztetés; sem saját dátumot, sem fiktív adást nem választ helyetted.
5. Normál forrás-szerződést lefedő tesztek: `tests/countdown-next-stream.test.js` több hibás ISO és milliszekundum, későbbi API-válasznál elavult `aria-label` törlése; `public/editor-v2/tests/schedule-source.test.js` az új SQL-normalizálás; `tests/browser/editor-countdown.test.js` a kézi→automatikus→kézi Editor/Publish-váltás.

**Futtatott, tényleges ellenőrzések:** az aktuális GitHub-forrásból izolált, végrehajtott V8 próba 18/18 célzott dátum-/kompatibilitási assert PASS; kontrollált in-memory DOM és visszatérő schedule-válasz esetén 6/6 automatikus óra/stale-`datetime`/stale-`aria-label`/üres állapot PASS. A módosított JavaScript-fájlok önálló szintaxisellenőrzése PASS; a `public/editor-v2/tests/schedule-source.test.js` felső szintű ESM `await import` miatt a sima `new Function` parszerben nem ellenőrizhető (nem jelent hibás ESM-szintaxist). Az éles D1 read-only `SELECT` `changed=0`.

**Kiadás állapota:** GitHub `v2/foundation` normál fast-forward commitok, az újabb Cloudflare Worker deployment `c9eca625-2fe2-4c2c-9aff-fd036db79b83`, Worker version `0ac3cd8d-91b2-474d-ba71-983efb6b9e38`, 2026-11-14T07:44:21Z, 100% forgalom; a Worker-version script etag `5b50b323d84730a8ce0283afcd49f5f72dd5556a070d306b24cd461d3df06d87`. A pontos Worker build-forrás SHA, tényleges statikus asset tartalomhash, éles web HTTP és teljes 320/390/768/1440px Chromium render **UNVERIFIED**, mivel a workers.dev URL a webes ellenőrző környezetben nem feloldható és nincs teljes helyi checkout. `npm run typecheck`, `npm run test:schedule`, `npm run test:countdown:browser`, `wrangler deploy --dry-run` továbbra **NOT RUN**, GitHub Actions dispatch **NOT DONE** a felhasználó 0 Ft-os quota korlátja miatt. A `77.44.7.D / D-06` általános acceptance **OPEN / NOT_CERTIFIED**.

**Ár:** 0 Ft új erőforrás, új dependency 0, D1 prod írás 0, migráció 0, R2 törlés 0. A főoldali Save≠Publish különválasztás és az Editor revíziók megmaradtak.
