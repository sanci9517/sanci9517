# Sanci9517 — MASTER ADDENDUM 1.2

**Dátum:** 2026-09-17  
**Repository:** `sanci9517/sanci9517`  
**Branch:** `v2/foundation`  
**Kapcsolódó terv:** `docs/MASTER-DEVELOPMENT-PLAN.md` + `docs/MASTER-FINAL-ROADMAP.md`

## 1. Cél

A Visual Editor E3 shelljét úgy építjük tovább, hogy a későbbi dizájn, Inspector, Layout és Responsive fejlesztések ne kényszerítsenek új editor-adatmodellt vagy újratervezést.

Ez az addendum kötelező architekturális kiegészítés. Nem írja felül a MASTER sorrendet; az E3–E11 pontok végrehajtásakor ezeket a szabályokat kell alkalmazni.

## 2. Responsive alapelv — külön megjelenés minden viewporthoz

A `desktop`, `tablet` és `mobile` nem pusztán méretezett előnézetek.

A Page Modelben minden szerkeszthető vizuális tulajdonság támogat:

- base/desktop értéket;
- tablet override-ot;
- mobile override-ot;
- később opcionális custom breakpointot.

A feloldási szabály:

`mobile override → tablet override → desktop/base`

Ha egy érték nincs felülírva az adott viewporton, örököl a következő elérhető szintről.

A rendszernek külön kell kezelnie:
- érték megléte;
- örökölt érték;
- explicit override;
- reset/inherit;
- invalid érték.

## 3. Responsive property szerződés

A responsive értékeket nem szétszórt CSS-kulcsokkal és nem UI-specifikus hackekkel tároljuk.

Logikai forma:

```text
property
├── base
├── tablet?
└── mobile?
```

Példa:

```text
width:
  base: 1200px
  tablet: 90%
  mobile: 100%
```

A későbbi Inspector ugyanebből a struktúrából dolgozik. A renderer és az editor nem tarthat külön, egymással versengő responsive állapotot.

## 4. Property Registry — kötelező bővíthetőség

Az Inspector nem lehet egyetlen nagy, hardcoded `if/else` blokk.

Központi Property Registry szükséges, amely minden propertyhez legalább ezt írja le:

- `id`
- `group`
- `label`
- `type`
- `units`, ha releváns
- `responsive`, ha releváns
- `default`
- `validator`
- `appliesTo`
- `command`
- `reset`
- `tokenSupport`, ha releváns
- `visibility/condition`, ha releváns

Új tulajdonság hozzáadása így új registry-bejegyzés legyen, ne meglévő editorfájl újraírása.

## 5. Inspector Registry

A panelek és Inspector-szekciók is registry-alapúak legyenek.

Tervezett csoportok:

1. Content
2. Layout
3. Size
4. Spacing
5. Flex
6. Grid
7. Position
8. Typography
9. Background
10. Border
11. Radius
12. Shadow
13. Opacity
14. Transform
15. Filter
16. Animation
17. Interaction
18. Responsive
19. Accessibility
20. SEO
21. Data
22. Advanced

A csoportok alapból összecsukhatók. Az E3 shellben a struktúra és nyithatóság készül, a teljes property-készlet később E7/E8/E9 alatt kerül implementálásra.

## 6. Command API szabály

Az Inspector, Canvas, Layers és későbbi SANCI AI ugyanazt a Command API-t használja.

Példák:

- `element.update`
- `style.set`
- `responsive.set`
- `hierarchy.reparent`
- `hierarchy.reorder`
- később `dataBinding.set`, `interaction.set`, `component.set`

A UI nem módosíthatja közvetlenül a Page Modelt megkerülő módon.

## 7. Page Model bővíthetőség

A node-oknak a jelenlegi alapokon túl hosszú távon támogatniuk kell:

- `props`
- `style`
- `responsive`
- `visibility`
- `locked`
- `dataBindings`
- `interactions`
- `accessibility`
- `metadata`
- `schemaVersion`

Új mező csak kompatibilis, additive módon adható hozzá.

## 8. E3 új védőkapu — Architecture Lock

E3 nem tekinthető késznek, amíg az alábbi architekturális feltételek nincsenek biztosítva:

- [ ] Property Registry létrejött
- [ ] Responsive Property feloldási szabály rögzítve és tesztelve
- [ ] Inspector Registry létrejött
- [ ] Editor viewport state és Page Model responsive state szétválasztva
- [ ] új property hozzáadható az Inspector core átírása nélkül
- [ ] desktop/tablet/mobile külön szerkeszthető állapotként kezelhető
- [ ] nincs legacy editor listener vagy párhuzamos property state
- [ ] Core Command API marad az egyetlen mutation út

## 9. E3 vizuális cél

A végleges E3 shell:

- középen nagy, fehér page canvas;
- körülötte sötét editor workspace;
- bal oldalon tartós rail: Oldalak / Elemek / Rétegek;
- bal oldali panelek nyithatók/zárhatók;
- jobb oldali Inspector nyitható/zárható;
- felül oldal, viewport, mentés, preview, publish vezérlés;
- alul canvas select/pan/zoom/fit vezérlés;
- mobilon nem zsúfolt desktop editor, hanem használható responsive preview/editor élmény.

## 10. E3 utáni sorrend

Az architecture lock nem változtatja meg a roadmapet:

`E3 → E4 Canvas → E5 Layers → E6 Elements → E7 Inspector → E8 Layout → E9 Responsive → E10 Design System → E11 Components`

Viszont E4/E6/E7/E8/E9 megvalósításakor kötelező a Registry + Command + Page Model szerződés megtartása.

## 11. Aktuális állapot

- E2: `[x]` — felhasználó által ellenőrzött.
- E3: `[~]` — folyamatban, nem kész.
- E3 következő részfeladat: **E3.0 Architecture Lock**, majd E3.1 Shell finomítás.
- E4 és az utána következő pontok: `[ ]`.

## 12. Kötelező teszt

Minden E3.0 architekturális módosítás után:

`typecheck/test → GitHub commit → Cloudflare build → deploy → editor betöltés → page load → viewport váltás → mentés → reload → user verification`

Sikertelen teszt esetén nem lépünk tovább.
