# Production D1 ledger-rendezés — végrehajtási javaslat

Állapot: **előkészítve; production ledgerírás NEM történt; külön jóváhagyás szükséges**.
Alap: `v2/foundation` / `caf91bf91ca4937805c7bbf527de944893c11f78`.
Account: `64bbd6a12ac732ed2cac4ca25d8bfa7e`; DB: `sanci9517-db` / `5a4a5e96-fdad-421a-a33c-143daaf33e98`.

## Rögzített bizonyíték

A [read-only API-snapshot](evidence/d1-ledger-preflight.json) ideje 2026-10-23 11:36:40 Europe/Budapest (09:36:40 UTC).
Nem tartalmaz felhasználói rekordokat, credentialt vagy HTTP-fejléceket: kizárólag DDL, ledger, aggregált seed-ellenőrzések és D1 metadatok.
Minden lekérdezés `rows_written=0`, `changed_db=false`.

A négy kézi migráció sorrendben, egy teljesen új SQLite-adatbázison, a `migrations/` 0024-ig tartó lánca után lefutott.
Az így felépített séma és a production séma **40 releváns objektuma egyezik**:

| Terület | Vizsgált szerkezet / seed | Eredmény |
|---|---|---|
| 0025 | `pages`, `editor_revisions`, `page_slug_redirects`, `site_domains`; minden oszlop/default/PK/FK/CHECK/UNIQUE; site-scoped slug és részleges published-slug index; a teljes guard-trigger készlet | PASS |
| 0025 seed | kizárólag a megadott Worker-hosthoz megkövetelt default-site verified mapping, verification method és nem NULL verified_at | 1 megfelelő rekord |
| 0026 | `site_memberships`, összetett PK, role/status CHECK, FK delete action, user/status/site index | PASS |
| 0026 seed | aktív default-site userhez megfelelő aktív, azonos szerepű membership hiánya | 0 |
| 0027 | `site_scoped_settings`, PK/site FK, key és JSON CHECK | PASS |
| 0027 seed | legacy default-site `site` beállítástól eltérő/hiányzó JSON-copy | 0 |
| 0028 | `media.archived_at TEXT DEFAULT NULL`, összetett archive index, három media-reference guard trigger | PASS |
| Összesen | 7 tábla, 16 explicit index, 17 trigger; az implicit autoindexek feltételeit a CREATE TABLE PK/UNIQUE definíciók tartalmazzák | 40/40 |
| Integritás | `foreign_key_check`, `quick_check`, maradék `__web013_*` snapshot/guard táblák | üres / `ok` / 0 |

A teljes releváns CREATE SQL normalizált összevetése a megszorításokat és triggerfeltételeket is ellenőrzi, nem pusztán az objektumneveket.
A jóváhagyandó SQL ennél szigorúbb: a snapshot **pontos** CREATE SQL-jére és objektumszámára is guardot tesz.
Az eredeti seedek történeti beszúrási időpontját nem lehet a jelenlegi állapotból bizonyítani. A jelenlegi kompatibilitási feltételeket ellenőriztük;
a seedek újrafuttatása, jogosultságok újbóli kiosztása és beállítások felülírása tilos.
A lokális fixture a production teljes DDL-jét, de szintetikus üzleti adatokat használ; ez nem production adatmásolat vagy backup.

## Wrangler működés és későbbi konzisztencia

A telepített és `package.json`-ban rögzített Wrangler **4.130.0** forrásában:
`getListAppliedMigrationsQuery` az `id` szerint olvas; `getUnappliedMigrations` / `getUnappliedMigrationNames` pontos **fájlnév** alapján szűr;
`buildMigrationQuery` az SQL után `INSERT INTO d1_migrations(name)` utasítást fűz.
A ledgerben nincs SQL-checksum. Az automatikus számozás a migrációs könyvtár fájljaiból számít, nem a production ledgerből.
A két korai történeti név (`0001_initial.sql`, `0002_twitch_oauth.sql`) megmarad; nem írjuk át őket a mai fájlnevekre.

Ezért a megoldás nem négy önmagában álló INSERT:

- A [manifest](../scripts/d1/manual-migrations.json) rögzíti a négy eredeti nevet, útvonalat és SHA-256 hash-t.
- A safety gate ellenőrzi a manifestet; a **0025–0028 számok minden alternatív automatikus fájlneve is tiltott**.
- Az eredeti SQL-ek `scripts/pending/` alatt maradnak, változatlanul. Nem készülnek üres vagy feltételesnek álcázott automatikus migrációk.
- A bootstrap a `0001–0024` automatikus láncot, majd a manifest `0025–0028` láncát, majd az esetleges **0029+** automatikus fájlokat használja. Minden pontos fájlnevet nyilvántart.
- Új migráció első szabad száma **0029**. A `wrangler d1 migrations create` jelenlegi 0025 javaslatát nem szabad elfogadni; az új fájlt tudatosan 0029+ névvel kell létrehozni, és a gate-et futtatni.
- Új adatbázishoz a szokásos `migrations apply` önmagában nem teljes bootstrap. A runbook alábbi üres-adatbázis útvonala kötelező; CI teszteli.
- A retention SQL ettől külön, manuális és inert marad; ebben a PR-ban nem foglalunk neki automatikus migrációs számot.

## Pontos production változtatás (még NEM végrehajtott)

A teljes, ellenőrizhető SQL: [`scripts/d1/reconcile-0025-0028.sql`](../scripts/d1/reconcile-0025-0028.sql).
A generátor offline működik, hálózati és production-írási képesség nélkül.

A SQL átmeneti `__ledger_reconcile_guard` CHECK-táblával ugyanabban a tranzakcióban ellenőrzi a releváns DDL-t,
ledger baseline-t, ismeretlen/NULL ledgernevek hiányát, seedek jelenlegi kompatibilitását, FK-integritást és snapshotmaradékok hiányát.
Ezután négy `INSERT ... SELECT ... WHERE NOT EXISTS` következik, majd a guardtábla megszűnik.

| `d1_migrations.name` | Várható új ID a rögzített állapotban |
|---|---:|
| `0025_site_domains_and_site_slug.sql` | 31 |
| `0026_site_memberships.sql` | 32 |
| `0027_site_scoped_settings.sql` | 33 |
| `0028_media_archive.sql` | 34 |

Az ID-t nem adjuk meg kézzel: AUTOINCREMENT osztja; a helyességet a név és a korábbi rekordok megőrzése igazolja.
`applied_at` a **ledger-rendezés aktuális időpontját** jelenti, nem kitalált történeti migrációs időpontot.
A négy hiányzó rekord mellett az SQLite belső `sqlite_sequence` számlálója frissül; az átmeneti guardtábla létrejön és megszűnik.
Meglévő business rekord, jogosultság, seed, R2-objektum és Worker nem változik. A régi 30 ledgerrekord ID-ja/neve/időbélyege megmarad.
Ismétléskor vagy részben már rendezett állapotban csak a hiányzó nevek kerülnek be; teljes rendezés után 0 új ledgerrekord keletkezik.
Sémaeltérés vagy idegen ledgernév CHECK-hibával megállítja a tranzakciót.

## Lokális bizonyíték és reprodukció

```bash
python3 tests/d1-ledger-reconciliation.test.py
node tests/d1-ledger-miniflare.mjs
npm run typecheck
npm run test:web013
npm run test:media
python3 scripts/check-canonical-plan.py
python3 scripts/d1/ledger-reconciliation.py check
python3 scripts/d1/ledger-reconciliation.py bootstrap --output /tmp/new-review.sqlite
python3 scripts/d1/ledger-reconciliation.py bootstrap-sql --output /tmp/new-review.sql
npx --no-install wrangler d1 execute sanci9517-db --local --persist-to /tmp/new-review-d1 --file /tmp/new-review.sql
npx --no-install wrangler d1 migrations list sanci9517-db --local --persist-to /tmp/new-review-d1
```

A `/tmp/new-review*` útvonalaknak újnak kell lenniük. A Python bootstrap nem nyit meglévő adatbázist;
a D1 bootstrap SQL külön CHECK-guarddal is visszautasít minden már létező business objektumot. A provider `_cf_*` objektumai kivételek.
A bootstrap export minden táblát az INSERT-ek előtt hoz létre, a ciklikus FK-kat tranzakció végéig halasztja, a triggerek az adatok után jönnek létre.

Tényleges lokális eredmény: Python **11/11** teszt PASS; valódi Miniflare/D1 batchben a teljes production-sémafixture-ről induló rendezés,
ismétlés, késői UNIQUE-hibánál mind a négy INSERT rollbackje és sémaeltérésnél fail-closed működés PASS.
A provider-belső `_cf_KV` nem hozható létre felhasználói D1 SQL-lel, ezért a Miniflare-fixture ennek újralétrehozását kihagyja; a 40 releváns objektum teljes.
Fresh bootstrap után a valódi Wrangler `No migrations to apply!` választ adott, ledger 32 rekord (28 mai automatikus + 4 kézi név), FK-check üres, quick-check `ok`.
A production ledger 30 történeti rekordjából kettő csak történeti név; ezért rendezés után productionben 34, új DB-ben 32 az elvárt darabszám.
Typecheck, WEB-013 11 tesztfájl, Média/retention 5 tesztfájl, migration gate és canonical-plan PASS. CI külön ellenőrzendő a PR-on.

## Backup/PITR, végrehajtási és hibakezelési terv

**Csak külön production-jóváhagyás után**, kontrollált write freeze-ben, automatikus build/push/deploy nélkül:

1. Rögzítsük az aktuális Git SHA-t, a manifest/hash-eket és a cél account/database ID-t. Szerezzünk friss read-only bizonyítékot:
   `python3 scripts/d1/capture-preflight.py --output /tmp/d1-preflight-current.json`.
   Futtassuk a `ledger-reconciliation.py check --evidence /tmp/d1-preflight-current.json` parancsot.
   Ha eltérés van, STOP; nem seedelünk, nem építünk újra táblát és nem írunk ledgerbe.
2. Exportáljuk a teljes D1-t **védett, nem gitelt** helyre (`wrangler d1 export sanci9517-db --remote --output <protected-backup.sql>`).
   A backup személyes adatot/credential ciphertextet tartalmazhat; ne kerüljön PR-ba vagy logba.
   Rögzítsük a fájl SHA-256-át és méretét; importáljuk izolált lokális D1-be, ellenőrizzük az FK/quick-checket és a ledger/adatszámokat.
   A sémafixture nem helyettesíti ezt a backupot. Az első teljes export közvetlen importja sorrendhibával megállt; az alábbi célzott javítással a teljes SQLite- és D1/Miniflare-visszaállítás már PASS. Friss export esetén a hash-t és restore-próbát újra rögzíteni kell, a régi backup nem bizonyítja későbbi írások mentését.
3. Közvetlenül írás előtt `wrangler d1 time-travel info sanci9517-db --json` segítségével rögzítsünk új bookmarkot és pontos időt.
   A mostani read-only próba PASS bookmarkja: `00000769-00000000-0000510d-5ab489994ee1dc6c9c6e30c737e5e83d`.
   Ez nem örök érvényű backup: a fiókhoz tartozó tényleges megőrzési időt, restore-jogot és szükséges elérési utat is ellenőrizni kell.
   Az éles restore-próba nem engedélyezett; a restore parancsot és felelős operátort előre rögzítsük.
4. Generáljuk a friss bizonyítékból a jelölt SQL-t:
   `python3 scripts/d1/ledger-reconciliation.py sql --evidence /tmp/d1-preflight-current.json --output /tmp/reconcile-reviewed.sql`.
   Hasonlítsuk össze a PR-ban jóváhagyott SQL-lel; eltérés új review-t igényel. Ne használjunk Python `-O`-t.
5. A már jóváhagyott fájlt **egyetlen** `wrangler d1 execute sanci9517-db --remote --file /tmp/reconcile-reviewed.sql` műveletben alkalmazzuk,
   `CLOUDFLARE_ACCOUNT_ID=64bbd6a12ac732ed2cac4ca25d8bfa7e` mellett. A fájlt ne bontsuk több kérésre, ne futtassuk soronként.
   A Wrangler remote file-import protokollja tranzakciós visszaállítást jelez hiba esetére, és átmeneti DB-elérhetetlenségre figyelmeztet;
   emiatt a write freeze és az ellenőrzött backup kötelező. Ez a production importútvonal még nem futott le.
6. Új read-only snapshot: pontosan a négy név egyszer, előző 30 rekord változatlan, guardtábla nincs,
   releváns business DDL változatlan, FK-check üres, quick-check `ok`, seedösszesítők PASS.
   A backuphoz viszonyított business tábladigests/adatszámok egyezzenek (write freeze mellett); a ledger és a sqlite_sequence kivétel.
   A `migrations list --remote` az ismert Wranglerben `CREATE TABLE IF NOT EXISTS` inicializálást is futtat, ezért ez **nem tisztán olvasási próba**;
   csak a már jóváhagyott írási ablakban használható. A pusztán olvasási ellenőrzéshez a fájlneveket offline vessük össze a ledgerrel.
7. Auth/network/SQL/importhiba, timeout vagy ismeretlen kimenetel esetén STOP. Először olvassuk vissza a ledger/séma/guard állapotát;
   ne induljon automatikus retry, újramigrálás, ledger DELETE vagy kézi business-adatjavítás. A lokális idempotencia nem indok vak retry-ra.
   Inkonzisztens állapotnál a backup/PITR visszaállítás egész adatbázist érint, ezért külön incidensdöntés és jóváhagyás kell;
   későbbi legitim írásokat elveszíthet. Ne állítsunk automatikusan vissza.
8. Csak a ledger-rendezés ellenőrzött lezárása után következhet a korábban jóváhagyott, additív retention SQL saját előellenőrzéssel.
   Itt sem retention-migráció, sem R2-objektumtörlés, sem automatikus cleanup, sem Worker deploy nem történik.

A PR merge/push a `v2/foundation` ágra production buildet indíthat; a mostani feladat kizárólag review-PR-t enged, merge-et és release-t nem végez.

## 2026-10-23 — teljes backup/restore sorrendhiba javítása

Forrás: [workers-sdk #5683, átirányítva developer-platform #41-re](https://github.com/cloudflare/developer-platform/issues/41).
Az export adatot tölt be egy hivatkozott tábla létrehozása előtt; a deferred FK önmagában nem oldja meg a hiányzó tábla feloldását.
A production backup **611. teljes SQL-utasítása `INSERT INTO pages`**, miközben az általa `published_revision_id` FK-n keresztül
hivatkozott `editor_revisions` csak a **619. utasításban** jön létre. Pontos hiba: `no such table: main.editor_revisions: SQLITE_ERROR`.
Érzékeny INSERT-tartalom nem került logba vagy gitbe.

Az eredeti backup változatlanul `/workspace/.private-d1/ledger-292-final/production-full.sql`:
`257ad3234f6746d1512f520e26520bf7188c4fd3e1856e3a69afd67704cbaba5` (806091 bájt).
A külön másolat `/workspace/.private-d1/ledger-292-final/production-restore-ordered.sql`:
`55e093aa370dd6ff05f15f5968d8bce0d728af5fb9c7d9c601ae8dcd814fa03e`.
A fájlok és restore-adatbázisok repo-n kívül, 0700 könyvtárakban és 0600 fájljogokkal maradnak; környezeti munkaterületi mentések,
nem külső/offsite backupok. Érzékeny adatot tartalmazó export vagy digest-lista nem csatolható a PR-hoz.

### Biztonságos helyi restore útvonal

```bash
python3 scripts/d1/restore-order.py \
  --source /workspace/.private-d1/ledger-292-final/production-full.sql \
  --output /workspace/.private-d1/ledger-292-final/NEW-restore-ordered.sql \
  --expected-sha256 257ad3234f6746d1512f520e26520bf7188c4fd3e1856e3a69afd67704cbaba5
npx --no-install wrangler d1 execute sanci9517-db --local \
  --persist-to /workspace/.private-d1/ledger-292-final/NEW-isolated-restore \
  --file /workspace/.private-d1/ledger-292-final/NEW-restore-ordered.sql
```

Az output és a restore-útvonal legyen új. A restore mindig `--local`; itt sem production restore, sem ledger SQL nem fut.
A script kizárólag offline működik és `sqlite3.complete_statement` segítségével **teljes SQL-utasításokat** választ szét,
a triggerbeli belső pontosvesszőket, stringeket és kommenteket is kezelve. Nem rendezi soronként az INSERT-eket.
Az eredeti 857 utasítás mindegyike megmarad, tartalmi átírás nélkül, a következő fázisokban:
1 deferred-FK PRAGMA → 26 CREATE TABLE → 775 adatutasítás (az eredeti relatív sorrendben, a sqlite_sequence kezelésével együtt)
→ 36 index → 19 teljes trigger. A csoportokon belüli sorrend megmarad; a parser az outputot is visszaellenőrzi.
Ismeretlen utasítás, FK-kikapcsolás, hash-eltérés, hiányos SQL vagy már létező output esetén fail-closed.

D1-en az FK enforcement bekapcsolva marad. Minden tábla létrejön az INSERT-ek előtt; a ciklikus pages–revision FK-k
`PRAGMA defer_foreign_keys=TRUE` mellett a D1-batch tranzakció végén ellenőrződnek.
A triggerek adatbetöltés után, de ugyanabban a tranzakcióban kerülnek vissza: nem futnak utólagos mellékhatásokkal az eredeti adatokon.
SQLite-ban explicit BEGIN/COMMIT határolja a javított restore-t. Az eredeti export független referenciája kizárólag lokális,
FK-enforcement nélküli SQLite-on épült fel; ez nem production/D1 beállítás, és utána teljes FK-check igazolta az adatokat.

### Tényleges restore-bizonyíték

- **Friss izolált SQLite és valódi D1/Miniflare: PASS.** quick_check és integrity_check `ok`; foreign_key_check üres.
- **81/81 exportált sémaobjektum teljes CREATE SQL-je egyezik**, minden constraint/index/trigger megmaradt.
  A read-only production snapshot 82. objektuma a provider-belső `_cf_KV`, amelyet a Cloudflare teljes export sem exportál;
  business táblát/objektumot nem hagytunk ki. A production snapshot többi 81 objektuma egyezik az exporttal is.
- **26/26 exportált tábla, 773 rekord** teljes adattartalma és száma egyezik a független eredeti-export referenciával,
  nem csak az összesítő számlálók. `sqlite_sequence` külön, pontosan egyezik. A seed-, membership-, user- és settings-adatok is változatlanok.
- Mind a **30 eredeti ledgerbejegyzés** ID/neve/időbélyege változatlan, és egyezik a production read-only snapshot ledgerével.
- Privát részletes ellenőrzési bizonyíték: `sqlite-verification.json`, `d1-miniflare-verification.json` ugyanabban a védett könyvtárban.
- Új célzott regresszió: Python **5/5 PASS**, a valódi Miniflare-teszt reprodukálja az eredeti hibát,
  majd igazolja a teljes javított restore-t, a constraint és trigger működését. Teljes fejlesztési tesztauditot nem futtattunk újra.

### Végső production előkészítés állapota

A restore utáni read-only preflight ismét PASS: séma és az eredeti 30 ledgerrekord változatlan, seed-összesítők rendben,
FK-check üres és quick_check `ok`. A friss evidence-ből generált ledger SQL bájtpontosan egyezik az eredetileg review-zott #292 változattal:
`cf516293f56fa136d158469490b2fc280cdd2a282706cbfd618323e64cbd903b`.

PITR ellenőrzés: **2026-10-23 12:04:41 Europe/Budapest** (10:04:41 UTC), DB version `production`.
Aktuális bookmark: `0000076d-00000000-0000510d-1df9fbcf29c4f053a1a6c9650d16065e`.
A 2026-10-22 10:04:41 UTC időponthoz történeti bookmark is elérhető:
`0000071f-00000008-0000510c-b1fbd06889f1b6dc8990d88c8ca9e056`.
A restore-parancs és endpoint elérési útja a telepített Wranglerben ellenőrzött:
`wrangler d1 time-travel restore sanci9517-db --bookmark=<jóváhagyott-bookmark>`.
**Ezt a parancsot NEM futtattuk.** A visszaállítás egész production DB-t írná felül; nincs dokumentált read-only restore dry-run.
A jelenlegi és egynapos bookmark olvashatósága igazolt; a pontos csomagszintű megőrzési ablakot a DB-metaadat API nem közölte,
és a tényleges production restore végrehajtási jogosultságát read-only próbával nem bizonyítottuk.
Ezeket nem szabad sikeres éles restore-próbaként jelenteni; a későbbi végrehajtási ablakban friss bookmark és operátori restore-hozzáférés szükséges.

**Production ledgerírás, retention-migráció, R2-törlés, merge és production deploy NEM történt.**
A külön jóváhagyandó ledger SQL továbbra is kizárólag a négy hiányzó migrációnevet szúrná be; az eredeti migrációkat nem játssza újra.
