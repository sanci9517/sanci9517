# TÖRTÉNETI TERVARCHÍVUM — NEM AKTÍV

> FIGYELEM: az itt található dokumentumok kizárólag forrásbizonyítékok. Egyik sem aktuális fejlesztési terv, státuszforrás vagy következő munkapont.

## Egyetlen irányadó terv

**[SANCI9517-CREATOR-PLATFORM-PLAN.md](../../SANCI9517-CREATOR-PLATFORM-PLAN.md)** a `v2/foundation` ágon.

Minden új beszélgetésben, auditban és fejlesztési feladatban először ennek az aktuális ágán szereplő dokumentumnak az elején lévő aktív pontot és státuszt kell ellenőrizni. Korábbi chatüzenet, archív terv, régi commit vagy checkpoint nem írhatja felül.

## Archívum használata

- Régi dokumentumból csak történeti követelményt, eredeti elfogadási feltételt, függőséget vagy döntést szabad visszakeresni.
- Az archívum `ACTIVE`, `NEXT`, `PASS`, határidő és fázis megjelölései történeti állapotok, nem aktuális utasítások.
- A korábbi követelményeket a kanonikus tervhez szemantikailag kell megfeleltetni: funkció, domain-owner, adatforrás, UI-felületek, jogosultság, függőségek, pozitív/negatív tesztek és elfogadási feltételek szerint.
- Bizonytalan megfeleltetést nem szabad automatikusan lezárni. A lezárás és a fejlesztéskészültség külön állapot.
- Egy képességnek egy kanonikus domain- és adatforrása lehet; több UI ugyanazt a szerződést használja, nem épülhet párhuzamos rendszer.
- Régi dokumentumot nem szabad újra aktív tervként a gyökérbe vagy a docs/ mappába visszaemelni.
- A történeti források megőrzendők; eltávolítás vagy összevonás csak bizonyított nyomkövetés és explicit döntés után történhet.

Ez az archívum-jelölés önmagában **nem igazolja**, hogy minden régi funkció átvezetése kész. A nyitott ellenőrzések kizárólag a kanonikus tervben követendők.
