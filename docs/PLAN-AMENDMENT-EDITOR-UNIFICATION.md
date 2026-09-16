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

## 5. Legacy oldalak átállítása

A valódi legacy oldalakhoz egyszeri migrációs folyamat készül:

1. Eredeti oldal tartalmának biztonsági megőrzése.
2. HTML/CSS szerkezet elemzése.
3. A felismerhető tartalom Page Model elemekre bontása.
4. Section/container/hierarchy felépítése.
5. Képek, linkek, gombok, címek, szövegek és Sanci-specifikus komponensek leképezése.
6. Nem felismerhető részek biztonságos fallbackként való megőrzése.
7. Migrált dokumentum mentése D1-be.
8. Editorban megnyitás és kézi ellenőrzés.
9. Preview ellenőrzés.
10. Publish ellenőrzés.
11. Publikus oldal összehasonlítása a megőrzött eredeti állapottal.
12. Csak sikeres ellenőrzés után tekinthető az oldal migráltnak.

## 6. Új Editor oldalak

Az új Editor által létrehozott oldalak lesznek a referencia-implementációk.

Kötelező:

- létrehozás
- elem hozzáadás
- elem szerkesztés
- hierarchy
- layer kezelés
- mentés D1-be
- refresh utáni visszatöltés
- draft
- preview
- publish
- publikus render
- ismételt szerkesztés

Csak ezek stabil működése után kezdődik a valódi Brand-oldalak migrációja.

## 7. Egységes design

A végleges Brand-oldalak közös design rendszerre épülnek:

- közös design tokenek
- közös spacing rendszer
- közös typography
- közös gombok és kártyák
- közös navigáció
- közös mobil/desktop viselkedés
- közös Sanci Brand komponensek

Az oldalankénti eltérés csak tudatos tartalmi és layout-döntés lehet, nem külön technikai oldalrendszer eredménye.

## 8. Renderer szabály

A publikus renderernek nem kell tudnia, hogy egy oldal eredetileg legacy volt-e vagy újonnan készült.

A renderer kizárólag a végleges Page Modelt kapja.

`D1 Page Model → Public Renderer → Sanci Brand oldal`

## 9. Editor és AI kapcsolata

A későbbi AI kizárólag a stabil Page Modelt használja.

Az AI nem módosít közvetlenül HTML/CSS/JS fájlokat.

`AI → validated Page Model operation → D1 → renderer`

Ez biztosítja, hogy a későbbi AI-szerkesztés ugyanazokat az oldalakat tudja kezelni, amelyeket a kézi Editor.

## 10. Új fejlesztési sorrend

### A — Editor core stabilizálása
- [ ] új Editor oldal létrehozás
- [ ] elemkezelés
- [ ] hierarchy
- [ ] properties
- [ ] mentés
- [ ] refresh
- [ ] preview
- [ ] publish
- [ ] public render
- [ ] ismételt szerkesztés

### B — Editor parity
- [ ] régi Editorból hasznos funkciók felmérése
- [ ] szükséges funkciók új Page Modelre átültetése
- [ ] felesleges/hibás régi működés elhagyása
- [ ] stabil UX

### C — Valódi Sanci oldalak migrációja
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

### D — Tesztoldalak takarítása
- [ ] régi editor tesztoldalak azonosítása
- [ ] szükséges mentés/export
- [ ] törlés
- [ ] D1 ellenőrzés
- [ ] Editor page-list ellenőrzés

### E — Brand finomhangolás
- [ ] egységes Sanci Brand design
- [ ] responsive
- [ ] SEO
- [ ] accessibility
- [ ] performance

### F — későbbi AI platform
- [ ] AI page operations
- [ ] stream analysis
- [ ] contextual live assistance
- [ ] streamer profile/memory
- [ ] learning/evaluation
- [ ] clip/short automation

## 11. Kötelező tesztkapu

Egyetlen valódi oldal sem törölhető vagy cserélhető véglegesen addig, amíg:

`Editor → Save → D1 → Reload → Preview → Publish → Public page`

lánc minden lépése ellenőrzött és a felhasználó vissza nem igazolta.

## 12. Döntés

A projekt nem a régi Editor életben tartására épül. A régi Editorból csak a valóban hasznos funkciókat vesszük át.

A végleges cél:

**egy Sanci Brand + egy Page Model + egy Editor + egy Renderer + egy szerveroldali tartalomlánc.**
