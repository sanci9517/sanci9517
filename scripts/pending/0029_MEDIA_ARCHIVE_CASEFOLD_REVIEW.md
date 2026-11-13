# 77.44.7.D / D-06 — 0029 archivált média triggerjeinek kis-/nagybetűs javítása (REVIEW ONLY)

**Állapot: ELŐKÉSZÍTETT, NEM JÓVÁHAGYOTT, NEM FUTTATOTT ÉLES MIGRÁCIÓ.** A kizárólagos fejlesztési terv a `docs/SANCI9517-CREATOR-PLATFORM-PLAN.md`. Ez nem második roadmap.

## Miért kell?

Az éles, alkalmazott `0028_media_archive.sql` három immutable triggerje pontos kisbetűs UUID-stringet keres `instr(COALESCE(...),m.id)`-vel. Ugyanaz a média-ID nagybetűs JSON-ban és verziózott draft/published/revision rekordban is szerepelhet. A használati index és a renderer már ezeket normalizálja, de a régebbi SQL guard megkerülhető. A `scripts/pending/0029_media_archive_casefold_guards.sql` kizárólag a három archivált média guardot tervezi lecserélni; nincsenek R2-műveletek, nem módosul az Editor Page Model, Save vagy Publish.

## Igazolt offline alap

A jelen pending SQL- és Node-próba helyi Node.js v22.16.0 `node:sqlite` izolált memóriabeli adatbázisában **3/3 PASS**: 0028 hiányzó ledger precondition elutasítja a módosítást; nagybetűs draft, published, update és revision referenciák 409-nek megfelelő `ARCHIVED_MEDIA_REFERENCE` hibát adnak, idegen site továbbra engedélyezett; szimulált, **egy tranzakcióba csomagolt** késői hiba után az eredeti 0028 triggerdefiníciók visszaállnak. Ez **nem** jelenti a Cloudflare D1 produkciós migráció tanúsítását. A programteszt futtatásakor a csomagokat nem telepítettük újra és nem keletkezett éles írás.

## Biztonságos kiadás előfeltételei — még NYITVA

1. Konkrét tulajdonosi engedély éles D1-sémaváltoztatásra, annak határaira és visszaállítási eljárására; a „folytasd” nem ilyen engedély.
2. Friss SELECT-only D1 preflight: a 0028 ledger pontosan egyszer szerepel; mindhárom trigger létezik, az eredeti definíciót és más, esetleges operátori módosításokat egyeztesd; a 0029 marker nincs bejegyezve; a kapcsolódó táblák és site-ownership épek. Biztonsági mentés és izolált restore-képesség külön ellenőrizendő.
3. **Valóban atomikus Cloudflare D1 migráció:** a Cloudflare hivatalosan garantálja a Worker Binding `D1Database.batch([...])` teljes visszagörgetését hibánál (https://developers.cloudflare.com/d1/worker-api/d1-database/). A REST `/query` több SQL-ből álló `batch` vagy pontosvesszős hívásának ugyanezen garanciája önmagában nincs itt igazolva; ezért ezt a pending szkriptet **ne** küldd el REST-ként vagy soronként; később tesztelt, jóváhagyott tranzakcionális telepítő útvonal és explicit postflight kell. SQLite `BEGIN`-teszt nem bizonyít D1 REST atomicitást. Nem használható `npm run deploy` vagy rutin automatikus migráció.
4. A megengedett migráció alkalmazása után minden három trigger forrását read-only `sqlite_master` ellenőrzéssel vizsgáld; igazold az új casefoldot és az immutábilis 0028 ledger tisztaságát; csak valóban jóváhagyott, ellenőrzött migrációhoz rögzíts új ledger-bejegyzést. Éles rollback/Time Travel csak külön engedéllyel.
5. A végén publikációs média 200/404/409, site-scope és archívum guard regressziókat igazold. A teljes D-01..D-07 lezárása független, a Visual Editor kézi/fizikai elfogadás a teljes Editor végső kapujánál lesz.

**Tilos:** éles D1-migráció, production adatírás, trigger DROP, R2-törlés, új költség vagy a 0 Ft-os korlát felülbírálása a külön jóváhagyásig. A pending fájl és teszt branchre mentése nem ilyen művelet.

## 2026-11-13 — Kiegészített atomikus ledger és idempotencia

A szigorított, továbbra kizárólag felülvizsgálatra szánt SQL elutasítja a már meglévő 0029 markerrel vagy nem eredeti 0028 trigger-szerződéssel induló végrehajtást. Az új verzió a 0029 migrációs ledger-bejegyzést a három trigger cseréjével azonos atomikus egységben rögzíti. Az offline teszt ellenőrzi az ismételt futás tiltását és hogy a késői hibát követő rollback a ledgert is visszaállítja. Csak a Cloudflare Worker D1Database.batch([...]) valóban atomikus, elkülönített és ellenőrzött adminisztrációs útvonala lehet alkalmas a végrehajtásra; a REST /query batch atomikusságát nem igazoltuk. Production D1 migration ezen PR keretében nem fut.
