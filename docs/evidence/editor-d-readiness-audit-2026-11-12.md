# 77.44.7.D — Tételes készültségi pillanatkép (2026-11-12)

> **Állapot:** AUDIT / BECSLÉS, **nem** külön roadmap és **nem** D acceptance PASS. A kizárólagos terv: [SANCI9517-CREATOR-PLATFORM-PLAN.md](../SANCI9517-CREATOR-PLATFORM-PLAN.md). Ez az olvasási pillanatkép a `v2/foundation` `189f371d50f7f6663939c3d9f09c5994e32b2a9b` SHA-hoz és a 2026-11-12-i forráshoz kötött. Nem módosítja a terv aktuális `77.44.7.D OPEN / NOT_CERTIFIED` állapotát, sorrendjét, jóváhagyási kapuit vagy a 0 Ft-os korlátot.

## Mit lehet tényszerűen megállapítani?

- A teljes Editor `schema.js` fájlja **79 deklarált elemtípust** tartalmaz. A `core/capability-matrix.js` szerződés szerint **45 PARTIAL és 34 PLANNED**, **0 teljesen CERTIFIED**. Ez **nem** a D szakasz önálló nevezője és **nem** 45/79 készültség.
- A D szakasznak a kanonikus tervben **6 fő képességcsoportja van**, nem hat külön lezárt atomikus tervpontja: (1) kép/galéria/videó; (2) CTA; (3) ikon; (4) táblázat/lista; (5) UI-komponensek; (6) ismétlődő adattípusok, közös Média/Brand Kit kapcsolattal. A forrásban `image`, `gallery`, `carousel`, `video`, `audio`, `button`, `link`, `icon`, `list`, `table`, `tabs`, `accordion`, `dropdown`, `card`, `badge`, `quote`, `divider`, `spacer`, `tooltip` mind PARTIAL; egyetlen PARTIAL önmagában nem elfogadás.
- A D célzott, 8 böngészőfájlos média/tartalom Chromium-regressziója korábban **14/14 PASS**; a kép/galéria crop útvonala **4/4 PASS**. A 2026-11-12-i `b3ad7ca44b21` runtime commit GitHub exact-SHA kötelező öt workflow-ja **5/5 SUCCESS**; a Worker `a65c11f2-6799-44b1-8d88-8aa70e348b65` éles, 100% forgalmi és közvetlen health/assethash-bizonyítékkal a kanonikus terv szerint. Ezek **részkapuk**, nem D PASS.
- A következő, korrupt `backgroundAssetId`-t javító **PR #318** `dba6a9423f33` fejjel a vizsgálatkor **OPEN / DRAFT / NOT MERGED**. Az exact-head Worker dry-run, F0 és Twitch PASS, de az exact-head Editor Core még IN_PROGRESS; **nem élesített**. [PR #318](https://github.com/sanci9517/sanci9517/pull/318).

## D munkatételek — implementáció és hiányok

A következő hét sor **ellenőrzési munkacsomag**, nem új kanonikus feladat-ID. Mindegyikhez van már részleges forrás; a `RÉSZLEGES` **nem** jelent teljes D elfogadást. A munkaórák **előzetes, jövőre vonatkozó mérnöki becslések**, nem mért Codex-órák. A sorok úgy vannak felosztva, hogy az átfogó tesztelés és a kategória-specifikus javítások ideje ne szerepeljen kétszer.

| # | Ellenőrzési munkacsomag | Jelenlegi bizonyíték / működő rész | Nyitott elfogadási minimum | Állapot | Hátralévő hatékony óra (becslés) |
|---|---|---|---|---|---:|
| D-01 | Kép, galéria, carousel, videó/hang és poster | Site-scoped Media Picker, crop/focal, alt/caption, legacy + authored source, böngészős körök és a 2026-11-12-i médiaforrás-biztonsági javítások | Minden használatban lévő médiaformátum, hibás/archivált/privát forrás és responsive preview/published paritás lezárása | RÉSZLEGES | 10–16 |
| D-02 | CTA, gomb, link, ikon, badge, quote | Authored mezők, elérhetőségi címkék, linkvalidálás, célzott Editor/browser útvonalak | Végigfuttatott szerkesztés→Undo→Save/reload→Publish és negatív/akadálymentes viselkedés minden D-releváns típusra | RÉSZLEGES | 3–6 |
| D-03 | Táblázat és lista | `element-content.js`, `structured-inspector.js`, meglévő repeater és célzott lifecycle-tesztek | Sor-/elem-szerkesztés, érvénytelen és legacy soradat, kereszt-nézet és publikált megjelenítés | RÉSZLEGES | 4–7 |
| D-04 | Statikus UI-komponensek (fülek, accordion, dropdown, Card, dekoratív panelek) | Strukturált modellek, Card Inspector, célzott browser és public-renderer regressziók | Komponensenkénti Inspector/Canvas/public, keyboard/fókusz és többméretes életciklus; E szakasz dinamikus widgetjei nem számítanak ide | RÉSZLEGES | 6–10 |
| D-05 | Ismétlődő tartalmak és elem-műveletek | Lista, táblázat, galéria, carousel és accordion ismétlődő adattárolása/szerkesztése | Insert/reorder/delete, rossz/hiányzó/túl hosszú értékek, mentési és kiadási paritás **a már meglévő** D-repeatereken | RÉSZLEGES | 4–7 |
| D-06 | Közös Média/Brand Kit kötés és asset-használati index | D1/R2 referenciavédelem, site/MIME/visibility, archiválási 409, publikált route, read-only ellenőrzések, több 2026-11-10–12 javítás | Background/asset ID és usage-index teljes paritás, nagy/rossz/árva/archivált R2 állapotok, Design/Media asset-ID binding, cross-tenant és újrafelhasználás. A teljes site-global Brand Kit DSN feladat külön is nyitott lehet | RÉSZLEGES | 12–19 |
| D-07 | Keresztmetszeti D-képességmátrix, CI és lezárás | `capability-matrix.js` részleges szerződései, Inspector/CSS/render/Save/Publish tesztcsomagok; pontos CI és production bizonyíték `b3ad7ca4`-hez | A D-scope teljes típus × mező × desktop/mobil × valid/invalid útvonalai; PR #318 teljes exact-head CI, merge/release ellenőrzése; minden feltétel után kanonikus D PASS | NYITOTT KAPU | 8–14 |
| **Összesen** | | | | **D OPEN** | **47–79 óra** |

## Százalék és idő — helyes értelmezés

- **Tanúsított D-főcsoport:** **0/6 teljes egészében PASS**. Ez nem azt jelenti, hogy nincs működő funkció: mind a hat csoportnak vannak implementált és tesztelt részei.
- **Nem létezik hiteles, automatikusan számítható D-készültségi százalék** a jelenlegi repositoryban. A `45 PARTIAL / 34 PLANNED` teljes Editor-kategória, a `docs/evidence/feature-traceability.json` pedig `source-traceability-not-acceptance`, `NOT_RECERTIFIED` sorokkal.
- **Csak tervezési tájékozódási érték** a D implementációs előrehaladására: kb. **55–65%**, a meglevő sok működő rész és a nyitott cross-type/production/Brand Kit elfogadás alapján. **Nem auditált mérési százalék**, nem válhat automatikusan projekt-státusszá.
- **Hátralévő munka becslése:** **47–79 hatékony mérnöki óra**, középérték ~**63 óra** a jelenleg ismert D-scope lezárására. Ez felülírható feltárt hibáknál/új indokolt követelményeknél. Nem azonos naptári/automata-futásidővel vagy ChatGPT/Codex tokenköltséggel.
- A teljes Visual Editor **77.44.7.E**, **77.44.7.F**, végső **77.44.8** és a SANCI DARK DEPTH további kiegészítései **nem** részei ennek a 47–79 órának. A teljes Editorra korábban mondott ~300 óra nem összegezhető automatikusan ezzel külön.

## Változáskezelési/elfogadási szabály

Az egyes sorokat csak akkor szabad PASS-ra állítani, ha a konkrét elemtípus, Inspector-műveletek, Canvas, Undo/Redo, draft Save/reload, **külön Publish**, valós publikus renderer, negatív/site-scope és releváns desktop/mobil automatizált tesztek ellenőrizve vannak. A teljes Editor kézi/physical-device acceptance a `77.44.7.F/77.44.8` végső kapuig **DEFERRED**.

Dokumentáció-only pillanatkép, új runtime vagy dependency nincs; **nem szükséges Worker deployment, D1-migráció vagy Actions futás**. Nincs 0 Ft-on felüli költési felhatalmazás.

## Források

- [Egyetlen kanonikus terv](../SANCI9517-CREATOR-PLATFORM-PLAN.md), különösen a `77.44.7` sorrend és a 2026-11-12-i `77.44.7.D` release/evidence bejegyzések
- [D-képességszerződés](../../public/editor-v2/core/capability-matrix.js), [elemtípusok](../../public/editor-v2/core/schema.js), [tartalomprofilok](../../public/editor-v2/core/content-profiles.js), [structured content](../../public/editor-v2/core/element-content.js), [authored mezők](../../public/editor-v2/core/authored-content.js)
- [Traceability forrás-index](feature-traceability.json) — **nem készültségigazolás**
- [PR #318](https://github.com/sanci9517/sanci9517/pull/318)
