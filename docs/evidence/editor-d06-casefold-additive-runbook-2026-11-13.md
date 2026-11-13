# 77.44.7.D / D-06 — Casefold archiválási triggerek, additív kézi kiadási ellenőrzés

**Egyetlen irányadó MASTER-terv:** `docs/SANCI9517-CREATOR-PLATFORM-PLAN.md`. Ez kiadási runbook, nem második terv. **Állapot: REVIEW ONLY / NOT APPLIED IN PRODUCTION.**

## Miért változott a módszer?

A korábbi, megőrzött `draft/77-44-7-d-archive-trigger-casefold-manual-20261112` ág a 0028 régi triggerjeinek DROP/CREATE cseréjét javasolja, amely csak bizonyítottan atomikus D1 végrehajtással engedhető. A biztonságosabb 0029 megoldás ehelyett **három új, más nevű trigger hozzáadása**. Az eredeti három 0028 trigger megmarad, a jelenleg támogatott kisbetűs ID-ket részleges végrehajtás közben is őrzi. A régi draft SQL NEM futtatható párhuzamosan ezzel.

## Kiadási kapu (minden lépéshez külön gépi bizonyíték)

1. A teljes exact-head CI, SQLite/Node `tests/media-archive-additive-casefold.test.js`, szintaxis, plan, D1 read-only leltár és tulajdonosi engedély tanúsítása. A `scripts/pending/0029_media_archive_casefold_additive_guards.sql` **soha ne kerüljön** az automata `migrations/` könyvtárba vagy a rutin `npm run deploy` útvonalra.
2. A produkciós D1-ben kizárólag SELECT/PRAGMA: 0028 marker pontosan egyszer; az eredeti három trigger teljes SQL-je megegyezik a lementett, immutábilis 0028 definícióval; 0029 marker még nincs; **egyik új casefold trigger sem létezik**; DB `quick_check=ok` és nincs FK-hiba. A D1 adatbázis verziója `production`, Time Travel bookmark aktuálisan kiolvasható. Friss bookmark rögzítése a végrehajtás előtt, a mentés és restore lehetőségének dokumentált ellenőrzése. Restore nem automatikus: in-place adatvesztést okozhat, külön mérlegelendő.
3. Védett írási ablakban az új SQL pontosan három `CREATE TRIGGER` utasítását **külön-külön**, az aktuális sémát visszaolvasva alkalmazd. **Tilos DROP TRIGGER vagy meglévő 0028 módosítása.** Ha bármelyik lépés hibázik: STOP és read-only leltár; az eredeti 0028 védelem megmarad, és nem szabad 0029 ledger sorral késznek jelölni.
4. Ha mindhárom új trigger **pontosan az elvárt SQL-lel** megjelent, a három eredeti változatlan, az adatbázis ép, és nincs alkalmazás-oldali hiba, a manuális ledger-bejegyzéshez külön ellenőrzött `INSERT INTO d1_migrations(name) VALUES('0029_media_archive_casefold_additive_guards.sql')` használható. Előtte a migration marker hiányát ismét igazold; utána egyszeriséget és 6/6 trigger-meglétet ellenőrizz.
5. A pozitív/negatív endpoint viselkedésre külön, izolált vagy jóváhagyott célrendszeren ellenőrizd: nagybetűs draft/published/revision hivatkozás 409/ARCHIVED_MEDIA_REFERENCE; más site nem érintett; régi valid média és Save/Publish viselkedés változatlan. Produkcióban **ne** hozz létre teszt/archivált assetet csak bizonyítás kedvéért.

## Helyi izolált bizonyíték

A javasolt pontos SQL a Node `node:sqlite` fixture-rel 3/3 PASS: minden eredeti trigger definíciója változatlan marad, a teljes additív védelem mindhárom írási útvonalat és a site-scope-ot fedi; 1/3 és 2/3 részleges alkalmazás sem gyengít; egy tranzakcióban szimulált késői hiba után eredeti séma áll vissza. Kiegészítő SQLite 4/4 offline próba is PASS. **Ez még nem éles D1 végrehajtási bizonyíték.**

## Korlátok

A 0 Ft-os költségelv, Save külön a Publish-től, változatlan 0028, semmilyen produkciós R2 törlés és a teljes D-01–D-07 OPEN / NOT_CERTIFIED változatlan. A 0029 sikeres éles alkalmazása sem azonos a teljes Editor vagy D-06 média-életciklus elfogadásával.
