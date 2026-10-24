# A beszélgetés közös kiadási csomagja

Ez forrás- és kiadási bizonyítékjegyzék, nem külön fejlesztési terv. A kanonikus tulajdonos a [SANCI9517 Creator Platform terv](SANCI9517-CREATOR-PLATFORM-PLAN.md), aktív blokk 77.44/49.4. Állapot: **MERGED / PRODUCTION CODE+ASSET VERIFICATION PASS**; bejelentkezett UI és fizikai eszközös acceptance még OPEN.

## Határ és pontos alap

Célág: `v2/foundation`, ellenőrzött alap `caf91bf91ca4937805c7bbf527de944893c11f78`. Integrációs ág: `codex/session-release-integration`. A #312 közös Editor-headjére (`7c455ab98d71e169fe15705d96d848c439e49818`) rákerült a #292 teljes öt commitja, a #293 teljes három commitja és a #294 egy commitja. A #293 első read-only panelje szükséges függőség; kizárólag a végső commit átvétele hiányos lett volna.

A korábbi rész-PR-ok történeti források; a #313 merge-je után, változatlan source-head és teljes bekerülés igazolásával supersededként lezárhatók. **Ezt a közös csomagot és a #292–#312 PR-okat nem szabad egymás után duplán integrálni.** A #295–#304 eredeti javításai a #305-ben konfliktusfeloldással átvett megfelelőik révén vannak jelen; a #306–#312 közvetlenül épül egymásra. A jegyzék mindkét commitazonosságot megőrzi.

## Lefedettség

A [gépi forrásjegyzék](evidence/session-release-sources.json) minden PR eredeti headjét, az integrált megfelelőket és a feloldott közös fájlokat rögzíti. A [lefedettségi bizonyíték](evidence/session-release-coverage.json) a történeti összeállítási headet ellenőrzi; az új előkészítő commitot és a végleges CI-headet az integrációs PR mutatja.

| PR | Kiadási tartalom | Hozzájárulások |
| --- | --- | --- |
| [#292](https://github.com/sanci9517/sanci9517/pull/292) | D1 ledger/backup/restore biztonsági eszközök és korábbi végrehajtási bizonyítékok | 5 |
| [#293](https://github.com/sanci9517/sanci9517/pull/293) | Médiatár retention állapot, megerősített kérelem és visszavonás | 3 |
| [#294](https://github.com/sanci9517/sanci9517/pull/294) | Kézzel indított, read-only média-integritásdiagnosztika | 1 |
| [#295](https://github.com/sanci9517/sanci9517/pull/295) | Sérült legacy média Inspector típusvédelme | 1 |
| [#296](https://github.com/sanci9517/sanci9517/pull/296) | Kártya képforrásváltás | 1 |
| [#297](https://github.com/sanci9517/sanci9517/pull/297) | Authored kép/galéria/carousel/borító atomi forrásváltás | 1 |
| [#298](https://github.com/sanci9517/sanci9517/pull/298) | Social sorok billentyűzetfókusza | 1 |
| [#299](https://github.com/sanci9517/sanci9517/pull/299) | Galéria/carousel kivágási preset paritás | 1 |
| [#300](https://github.com/sanci9517/sanci9517/pull/300) | Beágyazott lejátszó aktiválási fókusza | 1 |
| [#301](https://github.com/sanci9517/sanci9517/pull/301) | Countdown pontos helyi idő és DST | 1 |
| [#302](https://github.com/sanci9517/sanci9517/pull/302) | Countdown szigorú naptárvalidáció | 1 |
| [#303](https://github.com/sanci9517/sanci9517/pull/303) | Code Inspector IME és mentési kapu | 1 |
| [#304](https://github.com/sanci9517/sanci9517/pull/304) | Social/Embed IME és friss soradat | 1 |
| [#305](https://github.com/sanci9517/sanci9517/pull/305) | A tíz külön Editor-javítás közös integrációja | 1 |
| [#306](https://github.com/sanci9517/sanci9517/pull/306) | Kártya hat szövegmezőjének IME-védelme | 1 |
| [#307](https://github.com/sanci9517/sanci9517/pull/307) | Countdown közös szöveg/dátum kapu | 1 |
| [#308](https://github.com/sanci9517/sanci9517/pull/308) | Legacy média IME és Picker-nézet | 1 |
| [#309](https://github.com/sanci9517/sanci9517/pull/309) | Címke/idézet/ikon IME és publikus értékek | 1 |
| [#310](https://github.com/sanci9517/sanci9517/pull/310) | Hat strukturált típus IME és friss soradat | 1 |
| [#311](https://github.com/sanci9517/sanci9517/pull/311) | Strukturált sor/oszlop műveletek utáni fókusz | 1 |
| [#312](https://github.com/sanci9517/sanci9517/pull/312) | Akadálymentességi IME, alias/Undo és publikus attribútumok | 2 |

**21 PR, 28 egyedi fejlesztési hozzájárulás, 57 byte-azonosan megőrzött forrásfájl.** Az Editor forrása, a D1 script/fixture/bizonyítékok és a három új Média-modul hash-sel ellenőrzöttek. A közös Admin HTML/JS, média API tesztek, package tesztlista, workflow és tervfejezetek kézi konfliktusfeloldással egyesültek. Mindkét Média-panel külön szekció, mindkét mount és minden teszt megmaradt. A D1 kötési határ javítása és a retention előellenőrzés egyszerre szerepel a backendben.

A D1 eszközök főként biztonsági/fejlesztői eredmények, nem új webes gombok. A #293/#294 az Admin Médiatárban látható funkciókat ad, a többi az Editor használatát és publikus kimenetét javítja. A kód jelenléte önmagában nem jelenti, hogy az éles Worker már ezt futtatja.

## Ellenőrzés és használat

Teljes helyi közös Chromium **78/78 PASS**, core **127/127 PASS**, Média API/policy **43/43 PASS**, TypeScript/canonical-plan/diff PASS. D1 SQLite ledger/bootstrap **11/11**, export-order **5/5 PASS**, mindkét szintetikus Miniflare-kör PASS. A két Média-panel együttélését is ellenőrző célzott integritásfájl **10/10 PASS** (390/1366px, retention-frissítés nem indít vizsgálatot és nem törli az eredményeket); a végleges head CI-eredményét az integrációs PR rögzíti. Ezek helyi/CI bizonyítékok, nem production elfogadások.

A lefedettség ellenőrzése a teljes Git-előzménnyel rendelkező **integrációs ágon, merge előtt**:

```sh
python3 scripts/verify-session-release.py --head HEAD --json
```

Az ellenőrző nem ér el Cloudflare-t és nem módosít Git-et/adatot. A #292–#312 teljes készletét, minden hozzájárulás integrált előzményét, a rögzített fájlhash-eket és a `migrations/`/`scripts/pending/` SQL változatlanságát vizsgálja. A #312 Editor-only head negatív kontrollként FAIL, mert hiányzik a D1 és a Média. A jelentés **pre-merge** eredetigazolás; squash merge utáni commitokra nem történeti őrként szolgál.

## Kiadási sorrend és még szükséges lépések

1. A közös csomag pontos headjén minden kötelező CI PASS; az aktuális célághoz képest a diff és a lefedettség újraellenőrzött. Célágváltozás vagy új fejlesztés után a releváns közös kapukat újra kell igazolni.
2. A konkrét közös PR review-ja és **a felhasználó által már engedélyezett merge-je** a `v2/foundation` ágba. Az eredeti rész-PR-ok csak a megfelelő bekerülés igazolása után zárhatók/supersedálhatók. A #313 merge-je megtörtént (`19cd5e4`); a rész-PR-ok aktuális állapotát a GitHub mutatja.
3. A tényleges merge-head és annak CI-je rögzítendő. Squash esetén az új SHA-t kell használni, nem a korábbi draftét; a végső kiadási forrásnak pontosan az elfogadott kódot kell tartalmaznia.
4. Éles kiadás előtt a D1 ledger/séma és a Wrangler által tervezett migrációk friss, **read-only** ellenőrzése szükséges. A korábbi ledger- és retention-végrehajtás bizonyítékai a #292 runbookban vannak; ez a blokk nem ellenőrizte őket újra. **A már alkalmazott 0025–0028 vagy retention SQL nem futtatható újra.** Nincs új D1-migráció ebben a csomagban. Eltérő vagy új migrációs igénynél meg kell állni; íráshoz a D1-runbook backup/PITR előfeltételei és konkrét, indokolt migrációs feladat szükséges.
5. A felhasználó által már engedélyezett deploy után ellenőrizhető a Worker tényleges source-SHA-ja és az éles láthatóság. Először csak olvasó health/API és bejelentkezett Admin ellenőrzés: mindkét Média-panel, Editor javítások, nyilvános attribútumok, korábbi adatok. Save/Publish elfogadás csak erre engedélyezett tesztoldalon végezhető.
6. Az éles megjelenést és a fizikai PC/telefon/IME elfogadást tényleges eredménnyel kell visszavezetni a kanonikus tervbe. A teljes Editor/49.4 és a hátralevő fejlesztési pontok ettől a csomagtól nem zárulnak le automatikusan; a további munka erre a közös alapra épül.

**Aktuális felhatalmazás:** a felhasználó 2026-10-24-én kifejezetten feloldotta a korábbi tiltásokat. Merge/deploy végrehajtható sikeres előellenőrzések után; ez nem indokol migrációismétlést vagy szükségtelen adattörlést. A korábbi Worker API hozzáférési hiba a credential frissítése után megszűnt; a közös kódcsomag éles kiadása megtörtént. A retention kérelem UI nem ad végleges törlési jogosultságot; az integritásdiagnosztika kézi, csak olvasó művelet. A védett teljes production backup nincs a repositoryban és nem módosult.

## Friss kiadási előellenőrzés — 2026-10-24

A változatlan `de81ff2` jelölt 5/5 GitHub checkje és a forráslefedettség PASS. A közvetlen D1 API és a Wrangler SELECT PASS, 34 ledgerbejegyzés, retention-tábla jelen, quick_check=ok, nincs FK-hiba vagy alkalmazandó Wrangler-migráció; 0 production írás. A `wrangler deployments list --json` a cél Worker deployments végpontján `No access to the specified resource.` hibát adott. A HTTP-státuszt a CLI nem közölte. Worker kiadási előfeltétel hiányában nincs merge vagy deploy; a korábbi CI nem bizonyít éles megjelenést. A teljes tesztkört nem indítottuk újra. A token Workers Scripts Read/Edit célfiók-hozzáférésének rendezése után a telepítés lekérdezését kell ismételni, majd a fenti kiadási sorrendet folytatni. [Gépi bizonyíték](evidence/session-release-preflight-2026-10-24.json).

## Éles kiadás és eredmény — 2026-10-24

A korábbi blokkolt checkpointot felülírja: a #313 merge-headje `19cd5e409aa6588a3201acf0736ca81359183ee7`, a teljes jelölttel egyező fával és mind a 6 merge utáni check PASS eredményével. A meglévő Cloudflare Workers Builds kapcsolat a merge után automatikusan élesített; külön manuális deploy nem indult. A 100%-os aktív Worker verzió `6eaf2a91-e961-463e-9999-e02f7a89033a`, deployment `06d18145-1130-4ab0-bfa2-65c96fcc17ae`, időpont `2026-10-24T08:29:08.756421Z`. A Cloudflare API-ról visszaolvasott `index.js` SHA-256-ja egyezik a merge-head lokális Wrangler buildjével: `47e43002fc1b2f5c19853db37b86e0c7838dcb176b69bd62cd611a74dd256496`.

Valódi Chromiumból mind a 28 módosított, nem HTML statikus fájl 200 és byte-azonos a kiadási forrással. A health és D1-health API 200/ok, az anonim retention-status API helyesen 401. Az egyszerű Python kliens 403/1010 válasza böngészőből nem jelentkezik; hálózati vagy biztonsági szabályt nem módosítottunk. A D1 kiadás utáni quick_check=ok, foreign_key_check üres, teljes séma és mind a 34 ledgerrekord változatlan. Nem indítottunk új migrációt, ledgerírást, R2-törlést vagy cleanupot. Az ellenőrzés nem állít minden üzleti rekordra kiterjedő adattartalom-összehasonlítást.

A bejelentkezett Admin Médiatár két paneljének interaktív elfogadása és a fizikai PC/telefon/IME/provider ellenőrzés továbbra is nyitott; ehhez nem hoztunk létre production sessiont vagy tesztadatot. A funkcionális kód és statikus fájlok éles jelenléte igazolt; a teljes 77.44/49.4 modul nem készül el automatikusan a kiadástól. [Részletes gépi bizonyíték](evidence/session-release-production-2026-10-24.json). A korábbi előellenőrzési hibajelentés történeti bizonyítékként megmarad.

## Későbbi felületi elfogadás — 2026-10-24

A felhasználó képei igazolják a két panel éles, bejelentkezett láthatóságát és mindkét read-only diagnosztika befejezését üres médiatárral (0 ellenőrzött fájl, 0 eltérés, nincs további részlet vagy látható hiba). Ez a konkrét üres eseti kapu lezárt; a korábbi nyitott UI-állapot erre az esetre már nem érvényes. Az új `npm run test:media:storage` a tényleges Workert normál belépéssel, Chromium-feltöltéssel, natív lokális D1/R2-vel, nem üres tiszta és szándékosan hibás fixture-állapotokkal is ellenőrzi. Production adminsession hiányában éles képfeltöltést nem hajtottunk végre; a nem üres production elfogadás és a további fizikai/Editor-vizsgálatok nyitottak. [Részletes bizonyíték](evidence/media-nonempty-acceptance-2026-10-24.json).
