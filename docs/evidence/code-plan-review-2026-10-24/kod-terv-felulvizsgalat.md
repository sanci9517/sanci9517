# Kód–terv állapotfelülvizsgálat — 2026-10-24

Ez ellenőrzési pillanatkép, nem új fejlesztési terv. Egyetlen irányadó terv: `docs/SANCI9517-CREATOR-PLATFORM-PLAN.md` és annak 12 fejezetfájlja.

## Eredmény és kijelölt sorrend

A tényleges aktív főblokk **77.44 / WEB-011: a Visual Editor és Inspector funkcionális befejezése**, OPEN. A legkorábbi nem lezárt végrehajtási blokk **77.44.7.A — Inspector foundation**, a 77.44.1–2 capability/property szerződésével. Nem térünk vissza az oldalarchiválás vagy a slug/hierarchia újraimplementálásához, és nem ugrunk át későbbi teljes termékmodulokra.

A–F sorrend: A Inspector-alap és pontos capability/property szerződés → B Rich Text/link → C design/responsive → D elemtartalom/média → E interakció/dinamikus elemek → F teljes Editor elfogadás. A meglévő B/C/D javításokat megőrizzük; ez a sorrend a fennmaradó hiányok lezárására érvényes, nem visszafejlesztésre vagy újraírásra. A terv enged összefüggő blokkokat együtt kezelni, de a kapukat nem engedi bizonyíték nélkül lezárni.

**Egyetlen következő fejlesztési feladat:** a 77.44.7.A capability/property nyilvántartásának a meglévő kódhoz igazított teljessé tétele: típusonként minimális adat, Inspector-szekciók, command, Canvas/public leképezés és szervervalidáció kapcsolata; meglévő tesztek hozzárendelése a kötelező lifecycle-kapukhoz. A 68 mező implicit adapter/default/reset viselkedését is rögzíteni kell. Csak ebből igazolt hiányra következhet célzott implementáció. Nem hozunk létre második schema/renderer/registry rendszert. A blokk addig OPEN, amíg a kötelező szerződés és releváns bizonyíték nincs meg.

## Hatókör és korlát

- Git-alap: helyi `dd1569b3ef66a910b2419323bebe717e63643695`, távoli kiadási ág `5b8669364b749691d1e685f9a84a71a8d126e9a6`. A helyi előny kizárólag a korábbi kiadási dokumentáció. `work` ág változatlan, reset/ágváltás nincs; meglévő scratch `work/` megmaradt.
- A teljes tracked szöveges forrásleltár: **352 fájl / 35 775 sor** (57 src, 146 public, 95 tests, 18 scripts, 28 migrations, 5 workflow + configok). Minden leltározott fájl beolvasva és hash-elve; importok, függvénynevek, tervfejezetek kinyerve.
- A kanonikus terv: **13 fájl / 15 587 sor** a felülvizsgálat kezdetén. Az összes rész tartalom/index szinten feldolgozva; az aktív kapuk, modulhatárok és történeti átmenetek célzottan összevetve a runtime belépésekkel, modellekkel, jogosultságokkal, Editor-registryval, rendererekkel, release- és tesztszerződésekkel.
- Ez átfogó szerkezeti és célzott szemantikai felülvizsgálat, **nem minden sorra kiterjedő hibamentességi/biztonsági tanúsítás**, nem az összes 396 funkció új elfogadási tesztje. Statikus fájl- vagy tesztnév-találat nem funkció-PASS. Production adatok teljes vizsgálata és bejelentkezett kézi teszt nem történt.

## Megállapítások, fontossági sorrendben

1. **Magas: több, eltérő korú folytatási jelölés maradt aktívnak látszó szövegként.** A régi részfejezet F1.1-et és korábbi mezőszámot ír; az aktuális belépési pont 77.44-et és hosszú checkpoint-sorozatot. A 39. fejezet és a későbbi 77.3 fázisnevei sem mindenütt azonosak (például integrációk F5/F4). Folytatáshoz a későbbi 77.3/77.44 szerződés az irányadó; a régebbi táblák történeti források. A korábbi archiválás/hierarchia/redirect hiányállításokat a későbbi kód már felülírja.
2. **Magas: a zöld source-audit nem aktuális aktívpont-ellenőrzés.** `scripts/audit-active-plan-point.py` fixen `63.50.92`-t keres, a workflow is ezt nevezi meg. Nem vizsgálja a teljes 12 fejezetet, és nem igazolja az aktuális 77.44.A lezárását. A canonical-plan checker csak fájl/név/README jelenlétet ellenőriz; nem készültségi kapu. Ezek eredményét nem szabad a teljes terv szerinti haladás bizonyítékaként használni.
3. **Magas: a capability-registry részleges a saját tervszerződéséhez képest.** 79 NODE_TYPES → 45 PARTIAL + 34 PLANNED. A registry státusz/canvas/inspector/public mezőt tartalmaz, de nem ad típusonkénti lifecycle-bizonyítékot és teljes adat/validációs leképezést. Az alap `partial` készletből származó közös státusz nem jelenti minden egyes típus azonos tesztlefedettségét. A teljes Editor nem minősíthető késznek.
4. **Közepes: a property-k száma és metaadatai nincsenek egységesen visszavezetve.** Ténylegesen 68 property / 22 csoport, nem a régi 26. Mind a 68-nak van ID/label/type/command, 65 responsive; explicit registry-help 14 mezőn, explicit `default` 0 mezőn. Ez nem bizonyítja a help/default működés hiányát: `describeProperty`, schema és normalizálók pótolhatják. Viszont a 77.44.2 által megkívánt központi szerződés nincs mindegyiknél explicit leírva. Az öt nulla registry-property-s csoportot sem nevezzük automatikusan hibának: accessibility és responsive külön UI-adapterben is működik.
5. **Közepes: a funkcióstátuszok és a kiadási bizonyíték eltérő dolgok.** A #313 közös csomag és a későbbi IME/URL/többes validációs kód kiadva; a root/part-12 régi „PR alatt/UNVERIFIED” jegyzetei ettől történetivé váltak. A fizikai PC/telefon/IME és teljes típusonkénti Editor acceptance viszont ettől nem lett PASS. A felhasználó korábbi médiafeltöltés/diagnosztika/archiválás elfogadását megőrizzük, nem kérjük ugyanazt újra automatikusan.
6. **Közepes: a teljes SaaS és a média végleges törlése nincs kész.** A nemdefault Admin ingress 403 határa szándékos, a media retention `deleted` átmenet `DELETION_NOT_IMPLEMENTED`. Ez tervezett korlát, nem engedély a megkerülésére. A domain típusdefiníció vagy Editor-placeholder nem teljes üzleti modul.

## Modulonkénti kód–terv térkép

A táblázat runtime/forrás-hozzárendelés; a „nem igazolt” nem állítja minden lehetséges külső rendszer hiányát, csak a vizsgált repositoryban nem talált teljes implementációt.

| Terv | Modul | Tényleges helyzet | Fő források |
|---|---|---|---|
| 49.1 | Kezdőlap | Meglévő Admin shell és belépési folyamat; nem teljes operatív dashboard | public/admin-home.html; src/index.ts; tests/admin-home-contract.test.js |
| 49.2 | Weboldal / Editor | Oldal CRUD, duplicate/archive/restore, szülőkapcsolat, navigáció, külön Save/Publish, redirect/SEO megvan; a teljes 77.44 OPEN | src/routes/admin/{pages,editor,navigation}.ts; public/editor-v2; public/assets/page-renderer.js |
| 49.3 | Márka / design | Site-scoped presentation draft/publish, tokenek, helyi undo és Editor tokenhivatkozások megvannak; teljes Brand Kit/sablonrendszer nincs lezárva | src/core/site-presentation.ts; src/routes/admin/presentation.ts; public/assets/admin-design.js; tests/site-presentation.test.js |
| 49.4 | Média | R2/D1 feltöltés, lapozás, asset picker, használat, archive/restore, quota, retention-kérelem és read-only diagnosztika megvan. Teljes modul OPEN; végleges törlés nincs implementálva | src/routes/admin/media.ts; src/core/media-retention-*.js; public/assets/admin-media*.js; tests/media-*.test.js |
| 49.5 | Live / Stream Studio | Adásrend és Twitch-sync részimplementáció; teljes Stream Studio nem igazolt | src/core/schedule; src/routes/admin/{schedule,twitch-schedule-sync}.ts |
| 49.6 | OBS / stream eszközök | Céltermék/specifikáció; teljes működő OBS/bridge/overlay admin nem igazolt | A Workerben nincs ennek megfelelő teljes route-család |
| 49.7 | Integrációk | Twitch OAuth/token/sync tényleges implementáció; többprovideres központ nem kész | src/routes/integrations/twitch.ts; src/core/twitch-*.ts; tests/twitch-*.test.js |
| 49.8 | Tartalomstúdió | Editor-tartalom nem azonos Content Studio/publikáló pipeline-nal; teljes modul nem igazolt | Nincs teljes önálló Content Studio API-család a Workerben |
| 49.9 | Közösség | Tervezett teljes üzleti modul | Nincs teljes fan account/moderáció backend |
| 49.10 | Bolt | Tervezett teljes üzleti modul | Nincs teljes order/payment/fulfillment API-család |
| 49.11 | Támogatás / tagság | Tervezett teljes üzleti modul | Nincs teljes entitlement/billing/webhook rendszer |
| 49.12 | Szponzoráció / üzlet | Tervezett teljes üzleti modul; Editor-kártya nem üzleti workflow | Nincs teljes üzleti backend |
| 49.13 | Analitika | Teljes riport/consent/provenance modul nem igazolt | Observability config önmagában nem termékanalitika |
| 49.14 | Automatizáció | Tervezett teljes workflow-modul | Nincs teljes rule/trigger/action végrehajtómotor |
| 49.15 | SANCI AI | Tervezett; teljes tool/approval/quota rendszer nem igazolt | Nincs önálló agent/AI backend a jelen Workerben |
| 49.16 | Globális keresés | Editor-keresők léteznek; globális keresőszolgáltatás nem igazolt | public/editor-v2/app.js keresői lokális funkciók |
| 49.17 | Értesítések | Teljes termékmodul nem igazolt | Lokális status/alert nem értesítési központ |
| 49.18 | Súgó / onboarding | Mezőmagyarázatok és UI-help léteznek; teljes onboarding nem igazolt | public/editor-v2/ui/property-controls.js |
| 49.19 | Beállítások / biztonság | Login/session/roles/membership/site-scope, audit és DB-runbook részrendszerek megvannak; teljes modul nincs lezárva | src/core/auth; src/routes/auth; src/routes/admin/settings.ts; scripts/d1 |
| 49.20 | Fejlesztői platform | Későbbi platformfázis | A saját REST route-ok nem teljes fejlesztői platform |
| 49.21 | Marketplace / bővítmények | Későbbi platformfázis | Nincs teljes extension lifecycle/marketplace backend |
| 49.22 | Csapat / multi-site / SaaS | Host/site és membership biztonsági alap megvan; nemdefault site Admin központilag tiltott; self-service SaaS/billing nem kész | src/core/{site-domain,auth/site-access}.ts; src/index.ts nondefault Admin 403 |

## Meglévő alapfolyamatok, amelyeket nem fejlesztünk újra

- Worker belépés, hostname/site feloldás, Auth/session/site membership és külön Admin-tenant gate.
- Canonical Editor dokumentum, revision conflict, draft/published snapshot, atomi save/publish/rollback, navigációs és asset-hivatkozási védelem.
- Page duplicate/archive/restore, oldal-szülő és URL/redirect előzmény; publikált URL csak explicit publish után változik.
- Külön Admin Médiatár és Brand Kit/presentation; a Visual Editor ezek közös szolgáltatásait használja.
- Structured/authored tartalmak, Rich Text, reszponzív propertyk, typed kontrollok, többes kijelölés; a teljes funkciónkénti acceptance még nincs lezárva.

## Ellenőrzések és pontos bizonyítási határ

- Friss teljes JS parse: **213/213 fájl PASS** (`node --check`, kód végrehajtása nélkül).
- Friss `npm run typecheck`: PASS. Friss canonical-plan checker: PASS a saját szűk fájl/név-scope-jában.
- Friss repository migration-safety gate: PASS; nem végzett production SQL-t. A már alkalmazott manuális 0025–0028/retention SQL nem játszható újra.
- A változatlan runtime korábbi helyi route/Editor tesztje: **377/377 PASS**; a közös mezővalidáció 2 browser + kapcsolódó 4 browser PASS. Ezeket e felülvizsgálatban nem állítjuk újrafuttatottnak.
- A `5b866936` commiton a felülvizsgálat végső GitHub-lekérdezése szerint mind a hat check completed/success: Workers Builds, editor-core, verify, twitch-integration, canonical-plan és source-audit. Ez a CI saját tesztscope-jának sikere, nem a teljes terv elfogadása.
- A `5b866936` production build success, Worker `139c1f98-bf85-4cdb-9b9b-d900bd6f0c14` 100%; JS/CSS byte-egyezés és health/D1-health a korábbi munkamenetben ellenőrzött. Ez nem az összes backend-modul új production tesztje.
- E felülvizsgálat nem módosít runtime kódot, nem pushol, nem indít deployt, nem migrál vagy töröl D1/R2-adatot.

## Hogyan követjük innentől

Minden következő változásnak legyen egyetlen tervpontja, pontos hiánya, meglévő implementációs helye, elfogadási feltétele és bizonyítéka. A blokk státuszát egy helyen vezetjük a MASTER tetején; a checkpointok történeti bizonyítékok. A következő blokkra lépéshez a jelenlegi kapu lezárása vagy a MASTER-ben kifejezetten indokolt függőségi döntés kell. Az eddigi két apró javítás a 77.44 alapblokkjához kapcsolódik, de nem jelentett A/B/C/D blokklezárást; az előző URL-szeletet nem lett volna szabad önálló „következő főlépésként” kiválasztani a teljes állapot összerendezése nélkül.

Mellékletek: `kod-es-terv-leltar.json` teljes tracked szöveg/hash/import/függvény/fejezetindex; `editor-elemtipusok.csv` mind a 79 registry-státusz; `inspector-mezok.csv` mind a 68 property. Ezek bizonyítékpillanatképek, nem párhuzamos roadmapek.
