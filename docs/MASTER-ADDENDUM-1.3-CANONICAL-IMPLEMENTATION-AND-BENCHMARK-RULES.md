# Sanci9517 — MASTER ADDENDUM 1.3

**Dátum:** 2026-09-17  
**Repository:** `sanci9517/sanci9517`  
**Branch:** `v2/foundation`  
**Kapcsolódó tervek:** `docs/MASTER-DEVELOPMENT-PLAN.md` + `docs/MASTER-FINAL-ROADMAP.md`

## 1. Canonical implementation — kötelező projektelv

A projektben nem használunk kerülő-, hack-, ideiglenes vagy párhuzamos megoldást csak azért, hogy egy aktuális hibát gyorsan elfedjünk.

Minden funkciót a projekt meglévő canonical architektúrájába kell beépíteni:

`Page Model → Command API → domain/API → D1/R2/KV → renderer/editor`

A pontos réteg minden funkciónál az aktuális architekturális felelősség alapján határozandó meg.

### Tilos
- ugyanazon adat két külön state-ben való tárolása;
- külön mobil/desktop logika ugyanazon szerkesztési adat kezelésére;
- UI-ból közvetlen Page Model mutáció a Command API megkerülésével;
- második, párhuzamos event/listener rendszer létrehozása egy meglévő helyett;
- CSS/JS workarounddal egy architekturális hiba elfedése;
- átmeneti megoldás végleges runtime-részévé tétele dokumentált migráció nélkül.

### Kötelező
Ha egy funkció nem illeszkedik tisztán a jelenlegi architektúrába:
1. először az okot és a hiányzó architekturális réteget kell azonosítani;
2. a megfelelő canonical réteget kell bővíteni;
3. a meglévő rendszert és függőségeit ellenőrizni kell;
4. csak ezután készülhet implementáció;
5. a teljes érintett működést regressziósan tesztelni kell.

## 2. Egyetlen igazságforrás

Minden funkciónál előre meg kell határozni:
- melyik adat a source of truth;
- melyik state csak UI-state;
- melyik state cache/recovery;
- melyik Command/API felel a módosításért;
- hogyan mentődik és töltődik vissza;
- hogyan működik desktop/tablet/mobile alatt;
- hogyan kapcsolódik a későbbi AI action-rendszerhez.

Ha már létezik megfelelő rendszer, új párhuzamos rendszert nem hozunk létre.

## 3. Pontos szerkesztési vezérlés

A vizuális manipuláció és a pontos numerikus szerkesztés ugyanazt a canonical property/command rendszert használja.

Példák:
- Canvas drag → position command;
- resize handle → size command;
- Inspector X/Y → ugyanaz a position command;
- Inspector width/height → ugyanaz a size command;
- későbbi keyboard/AI művelet → ugyanaz a Command API.

Így a gyors vizuális és a pontos numerikus szerkesztés nem hoz létre külön állapotot.

## 4. Folyamatos benchmark és külső megoldásvizsgálat

A fejlesztés során folyamatosan vizsgáljuk a Sanci9517 projekthez hasonló, működő weboldalak, page builderek, visual editorok és releváns nyílt forrású projektek megoldásait.

A vizsgálat célja nem klónozás és nem kódmásolás, hanem bizonyítottan működő minták megismerése és összevetése a saját architektúránkkal.

Vizsgálható források:
- hasonló streamer/creator weboldalak;
- modern visual editorok/page builderek;
- releváns open-source komponensek és könyvtárak;
- hivatalos technikai dokumentációk;
- konkrét funkcióhoz tartozó, jól dokumentált implementációk.

### Minden benchmarknál vizsgáljuk
1. hogyan oldják meg a funkciót;
2. milyen adatmodellt használnak;
3. hogyan kezelik a responsive állapotot;
4. hogyan működik a selection/drag/resize;
5. hogyan működik a property/Inspector rendszer;
6. hogyan kezelik a history/undo/redo-t;
7. hogyan mentik és töltik vissza az állapotot;
8. milyen hibakezelést és recoveryt alkalmaznak;
9. milyen mobil/desktop különbségek vannak;
10. melyik megoldás illeszthető a Sanci9517 Page Model + Command API architektúrájába.

### Átvételi szabály
Külső mintát csak akkor használunk fel, ha:
- a működési elve érthető;
- az architektúránkkal összeegyeztethető;
- nem hoz létre párhuzamos source of truth-t;
- nem sérti a meglévő Command/Property/Responsive szerződést;
- a szükséges licenc/felhasználási feltételek ellenőrizhetők;
- teszttel igazolható, hogy nem okoz regressziót.

A külső megoldás nem írhatja felül a Sanci9517 canonical architektúrát. Ha több jó megoldás létezik, azokat összehasonlítjuk, majd a saját rendszerhez legjobban illeszkedő architekturális mintát választjuk — nem gyorsaság alapján.

## 5. Kötelező fejlesztési ciklus kiegészítése

Az általános MASTER ciklus előtt, amikor releváns:

`funkció → benchmark/külső megoldásvizsgálat → saját architektúra audit → implementáció → teszt → regresszió → user verification`

A benchmark nem kötelező minden triviális változtatásnál, de kötelezően mérlegelendő minden új, összetett vagy architekturálisan fontos funkciónál.

## 6. Érintett roadmap pontok

Ez az addendum különösen kötelező:
- E3 Editor Shell;
- E4 Canvas Engine;
- E5 Layers;
- E6 Element Library;
- E7 Inspector;
- E8 Layout Engine;
- E9 Responsive;
- E10 Design System;
- E11 Components;
- E12–E14 szerkesztési műveletek, history, recovery;
- E19–E21 integrációk;
- AI Editor és későbbi SANCI AI action-rendszer.

## 7. Státusz

- [x] szabály dokumentálva
- [x] a meglévő MASTER terv kiegészítéseként kezelendő
- [x] nem írja felül a korábbi pontokat vagy státuszokat
- [ ] minden új fejlesztésnél alkalmazás ellenőrzése
