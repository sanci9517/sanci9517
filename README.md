# Sanci9517

## Egyetlen fejlesztési terv

**Minden fejlesztési és auditfeladat egyetlen irányadó dokumentumból indul:**

- [MASTER-DEVELOPMENT-PLAN.md](docs/MASTER-DEVELOPMENT-PLAN.md) — aktuális termékterv, architektúra, funkciókatalógus, auditnapló, végrehajtási sorrend és acceptance-kapuk.

**Aktív munkapont:** `P0.2 — ARCHIVE RECONCILIATION AND BIDIRECTIONAL FEATURE TRACEABILITY`  
**Állapot:** `IN PROGRESS` — nincs PASS bizonyíték nélkül; párhuzamos feature-fejlesztés nincs engedélyezve.

### Új beszélgetésben innen folytasd

1. Nyisd meg a [MASTER tervet](docs/MASTER-DEVELOPMENT-PLAN.md) a `v2/foundation` ágon.
2. Olvasd el a 0.0–0.2, 37.3, 37.9–37.32, 41. fejezeteket, különösen a 41.3.5 tételes forrás-bullet ledgert.
3. Folytasd a C.23, F.1–F.13, a régi 00/A és 00.9–00.9.6.B források reconciliációját, majd mind a 359 stabil funkció-ID kétirányú ellenőrzését.
4. A P0.2 marad `IN PROGRESS`, amíg minden forrástételhez igazolt mapping/disposition, canonical owner, fázis, permission boundary, dependency, teszt és elfogadási bizonyíték nem tartozik.
5. Ne használj más archív vagy checkpoint dokumentumot aktív tervként, ne indíts párhuzamos feature-fejlesztést, és ne kérd a végső funkciólista közös ellenőrzését az audit befejezése előtt.

### Archívumkezelési szabály

A `docs/archive/**` és `docs/archive/plans/**` történeti forrásokat, régi döntéseket és bizonyítékokat tartalmaznak. Nem alternatív fejlesztési tervek. A régi követelmények nem veszhetnek el: a canonical MASTER-ben kell őket megőrizni, leképezni vagy indokoltan superseded/duplicate/deferred döntéssel ellátni.

A forrásban szereplő tervezett funkció nem bizonyítja, hogy a runtime implementáció elkészült. PASS kizárólag a kapuhoz előírt tesztek, futási/éles ellenőrzések és elfogadási bizonyítékok alapján adható.
