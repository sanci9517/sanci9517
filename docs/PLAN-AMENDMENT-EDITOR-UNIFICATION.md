# Sanci9517 V2 — TERVMÓDOSÍTÁS: EGYSÉGES PAGE MODEL ÉS SÁNCI BRAND EDITOR

> Ez a dokumentum a `docs/DEVELOPMENT-PLAN.md` és `docs/V2-BLUEPRINT.md` kiegészítése. Az itt szereplő döntések az Editor és a publikus oldalak tekintetében elsőbbséget élveznek a korábbi, egymással ütköző editor/legacy átmeneti megoldásokkal szemben.

## 1. Végleges cél

A projekt végső célja egy egységes **Sanci9517 Brand platform**, amelyben a publikus oldalak és az új Visual Editor ugyanarra a Page Modelre épülnek.

Nem maradhat két külön oldalrendszer:

- régi HTML/legacy oldalrendszer
- új Page Model/editor oldalrendszer

A végleges állapotban minden valódi Sanci oldal ugyanazzal az Editorral, ugyanazzal a Page Modellel, ugyanazzal a rendererrel és ugyanazzal a szerveroldali mentési lánccal működik.

## 2. Megőrzendő valódi oldalak

Az alábbi jelenlegi Brand-oldalak tartalma és megjelenése nem veszhet el az átállás során:

- Főoldal
- Twitch
- YouTube
- TikTok
- Menetrend
- VOD
- Közösség
- Rólam
- Kapcsolat
- Támogatás, ha jelen van
- további valódi Sanci Brand oldalak

Ezeket nem egyszerűen újraírjuk és nem töröljük. Először biztonságos Page Model alapra kerülnek, majd ellenőrzés után lesznek teljesen szerkeszthetők.

## 3. Régi editor tesztoldalak

A korábbi editorokkal létrehozott tesztoldalak nem képezik a végleges tartalom alapját.

- Nem kell őket kompatibilissé tenni az új Editorral.
- Nem kell a régi editor architektúráját továbbvinni.
- A régi tesztoldalak a végső takarítási lépésben törölhetők.
- Törlés csak azonosítás és ellenőrzés után történhet.

## 4. Egyetlen szerkesztési modell

Minden végleges oldal ilyen irányba kerül:

`Page → Section/Container → Element → Properties → Page Model → D1 → Renderer`

Az Editor nem HTML-szöveget szerkeszt elsődleges tartalomként, hanem strukturált elemeket.

Az ismeretlen vagy még nem migrálható részek átmenetileg biztonságos custom/HTML fallbackként megőrizhetők, de ez nem tekinthető végleges strukturált szerkesztésnek.

## 5. Régi valódi oldalak átállítása

A valódi legacy oldalakhoz egyszeri migrációs folyamat készül. A migráció **nem kezdődik el az Editor core stabilizálása előtt**.

Migrálandó valódi oldalak:

1. Főoldal
2. Twitch
3. YouTube
4. TikTok
5. Menetrend
6. VOD
7. Közösség
8. Rólam
9. Kapcsolat
10. Támogatás / további valódi Brand oldalak, ha vannak

A migráció minden oldalon külön ellenőrzési kapuval történik:

1. Eredeti oldal tartalmának biztonsági megőrzése.
2. HTML/CSS szerkezet elemzése.
3. A felismerhető tartalom Page Model elemekre bontása.
4. Section/container/hierarchy felépítése.
5. Képek, linkek, gombok, címek, szövegek és Sanci-specifikus komponensek leképezése.
6. Dinamikus részek külön komponensre/strukturált elemre leképezése, ahol szükséges.
7. Nem felismerhető részek biztonságos fallbackként való megőrzése.
8. Migrált dokumentum mentése D1-be.
9. Editorban megnyitás és kézi ellenőrzés.
10. Mentés → D1 ellenőrzés → újratöltés ellenőrzése.
11. Preview ellenőrzés.
12. Publish ellenőrzés.
13. Publikus oldal összehasonlítása a megőrzött eredeti állapottal.
14. Csak sikeres ellenőrzés után tekinthető az adott oldal migráltnak.

A kilenc jelenlegi fő Brand-oldal **nem egyszerre** kerül át. Egy oldal teljes migrációja és tesztje után jön a következő.

## 6. Új Editor oldalak — migráció előtti kötelező alap

Az új Editor által létrehozott oldalak lesznek a referencia-implementációk.

Kötelező:

- létrehozás
- oldal törlés
- oldal duplikálás
- elem hozzáadás
- elem kiválasztás
- elem szerkesztés
- hierarchy
- layer kezelés
- mozgatás
- átméretezés
- grouping/nesting
- properties és responsive beállítások
- mentés D1-be
- refresh utáni visszatöltés
- draft
- preview
- publish
- publikus render
- ismételt szerkesztés
- undo/redo

A működést nem az dönti el, hogy a gomb vagy UI elem látható-e, hanem a teljes lánc:

`művelet → mentés → D1 → újratöltés → eredmény megmarad`

Csak ezek stabil működése után kezdődik a valódi Brand-oldalak migrációja.

## 7. Aktuális végrehajtási pont

**Jelenleg az Editor core stabilizálási és tesztelési szakaszban vagyunk.**

A következő munkafázis sorrendje:

### 7.1 Editor funkcióaudit
- [ ] jelenlegi Editor funkcióinak tényleges ellenőrzése
- [ ] hiányzó core funkciók azonosítása
- [ ] UI-ban létező, de ténylegesen nem működő funkciók azonosítása
- [ ] mentés/visszatöltés ellenőrzése minden releváns műveletnél

### 7.2 Editor core javítás és teszt
- [ ] page create/delete/duplicate
- [ ] element add/select/edit/delete/duplicate
- [ ] text/content
- [ ] image
- [ ] button/link
- [ ] section/container
- [ ] move/resize/order
- [ ] hierarchy/nesting/reparent
- [ ] grouping
- [ ] styles
- [ ] responsive
- [ ] visibility/lock
- [ ] undo/redo
- [ ] preview
- [ ] server save/load
- [ ] publish
- [ ] public render

### 7.3 Migrációs rendszer előkészítése
- [ ] közös legacy → Page Model importáló folyamat
- [ ] eredeti állapot mentése
- [ ] dinamikus Sanci komponensek leképezése
- [ ] fallback csak átmeneti esetekre
- [ ] migrációs ellenőrzőlista

### 7.4 Valódi oldalak egyenkénti migrációja
- [ ] Főoldal
- [ ] Twitch
- [ ] YouTube
- [ ] TikTok
- [ ] Menetrend
- [ ] VOD
- [ ] Közösség
- [ ] Rólam
- [ ] Kapcsolat
- [ ] Támogatás / további Brand oldalak

### 7.5 Migráció utáni ellenőrzés
Minden egyes oldalnál:

`Editor → Save → D1 → Reload → Preview → Publish → Public page`

- [ ] tartalom egyezik
- [ ] design megmarad
- [ ] responsive működik
- [ ] dinamikus funkció működik
- [ ] linkek működnek
- [ ] újraszerkeszthető

### 7.6 Csak ezután
- [ ] legacy fallback végleges kivezetése
- [ ] régi tesztoldalak azonosítása
- [ ] szükséges mentés/export
- [ ] tesztoldalak törlése
- [ ] D1 ellenőrzés
- [ ] Editor page-list ellenőrzés

## 8. Egységes design

A végleges Brand-oldalak közös design rendszerre épülnek:

- közös design tokenek
- közös spacing rendszer
- közös typography
- közös gombok és kártyák
- közös navigáció
- közös mobil/desktop viselkedés
- közös Sanci Brand komponensek

Az oldalankénti eltérés csak tudatos tartalmi és layout-döntés lehet, nem külön technikai oldalrendszer eredménye.

## 9. Renderer szabály

A publikus renderernek nem kell tudnia, hogy egy oldal eredetileg legacy volt-e vagy újonnan készült.

A renderer kizárólag a végleges Page Modelt kapja.

`D1 Page Model → Public Renderer → Sanci Brand oldal`

## 10. Editor és AI kapcsolata

A későbbi AI kizárólag a stabil Page Modelt használja.

Az AI nem módosít közvetlenül HTML/CSS/JS fájlokat.

`AI → validated Page Model operation → D1 → renderer`

Ez biztosítja, hogy a későbbi AI-szerkesztés ugyanazokat az oldalakat tudja kezelni, amelyeket a kézi Editor.

## 11. Új fejlesztési sorrend

### A — Editor core stabilizálása
- [ ] funkcióaudit
- [ ] hiányzó core funkciók javítása
- [ ] page management
- [ ] element management
- [ ] hierarchy/nesting
- [ ] properties/layout
- [ ] mentés
- [ ] refresh
- [ ] preview
- [ ] publish
- [ ] public render
- [ ] ismételt szerkesztés

### B — Editor parity és stabilitás
- [ ] régi Editorból hasznos funkciók felmérése
- [ ] szükséges funkciók új Page Modelre átültetése
- [ ] felesleges/hibás régi működés elhagyása
- [ ] stabil UX
- [ ] teljes Editor tesztkapu

### C — Migrációs rendszer
- [ ] legacy → Page Model import
- [ ] eredeti állapot megőrzése
- [ ] Sanci-specifikus dinamikus elemek leképezése
- [ ] migrációs validáció

### D — Valódi Sanci oldalak migrációja, egyenként
- [ ] Főoldal
- [ ] Twitch
- [ ] YouTube
- [ ] TikTok
- [ ] Menetrend
- [ ] VOD
- [ ] Közösség
- [ ] Rólam
- [ ] Kapcsolat
- [ ] Támogatás / további Brand oldalak

Minden oldal külön ellenőrzési kapuval kerül át.

### E — Tesztoldalak és legacy takarítás
- [ ] régi editor tesztoldalak azonosítása
- [ ] szükséges mentés/export
- [ ] legacy fallback kivezetése
- [ ] tesztoldalak törlése
- [ ] D1 ellenőrzés
- [ ] Editor page-list ellenőrzés

### F — Brand finomhangolás
- [ ] egységes Sanci Brand design
- [ ] responsive
- [ ] SEO
- [ ] accessibility
- [ ] performance

### G — későbbi AI platform
- [ ] AI page operations
- [ ] stream analysis
- [ ] contextual live assistance
- [ ] streamer profile/memory
- [ ] learning/evaluation
- [ ] clip/short automation

## 12. Kötelező tesztkapu

Egyetlen valódi oldal sem törölhető vagy cserélhető véglegesen addig, amíg:

`Editor → Save → D1 → Reload → Preview → Publish → Public page`

lánc minden lépése ellenőrzött és a felhasználó vissza nem igazolta.

Egyetlen migrált valódi oldal sem tekinthető késznek pusztán attól, hogy az Editorban megnyílik. A publikus render, a mentés/visszatöltés, a preview és a publish külön ellenőrzendő.

## 13. Döntés

A projekt nem a régi Editor életben tartására épül. A régi Editorból csak a valóban hasznos funkciókat vesszük át.

A végleges cél:

**egy Sanci Brand + egy Page Model + egy Editor + egy Renderer + egy szerveroldali tartalomlánc.**

A jelenlegi sorrend rögzítve:

**Editor core → Editor teljes teszt → migrációs rendszer → valódi oldalak egyenkénti migrációja → migrált oldalak tesztje → legacy/test takarítás.**
