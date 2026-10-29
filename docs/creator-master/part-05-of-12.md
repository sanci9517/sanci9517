### 63.43. Funkciókártyák — EDT-015–020 (palette, layout nodes, content nodes, resources, advanced components, domain blocks)

**Forrásalap:** public/editor-v2/app.js, core/schema.js, core/property-registry.js, core/validation.js, core/commands.js, public/assets/page-renderer.js és a jelenlegi public renderer. A node-típus létezése a schema-ban vagy palettában nem bizonyít teljes Inspector-, public renderer- vagy accessibility-paritást.

#### EDT-015 — Node palette / elemkatalógus
- **Felhasználói eredmény:** a felhasználó megtalálja és hozzáadja a megfelelő oldalelemeket.
- **Belépési pont / műveletek:** Editor v2 Elements panel; kategóriabontás, szöveges szűrés, elem hozzáadása, súgóleírás.
- **Kanonikus owner / adatforrás:** EDITOR / schema NODE_TYPES és app.js palette groups; a paletta nem üzleti adatgazda.
- **Séma / invariánsok:** minden megjelenített elemhez létező, támogatott node type és canContain-szabály kell.
- **Jogosultság:** csak az aktív, szerkeszthető oldal; provider-backed elemek a saját domain permissionjét követik.
- **API/command:** palette action → element.add canonical command; a kategória/type registry egységesítése nyitott.
- **Függőségek:** EDT-001–003/006/016–020/021–022.
- **UI-állapotok:** loading, kategória zárt/nyitott, keresési találat/nincs találat, unsupported capability, add error.
- **Biztonság/adatvédelem:** a palette leírás és label biztonságos textként jelenjen meg; unsupported elem ne hozzon létre hibás node-ot.
- **Tesztcsomag:** core.test.js browser module parse és schema alap; minden palette entry/type coverage nincs bizonyítva.
- **Elfogadás:** minden palettaelem hozzáadása → valid Page Model node → save/reload → preview/public renderer támogatás vagy egyértelmű unsupported jelzés.
- **Bizonyíték:** app.js renderPalette/typeForElement, schema.js NODE_TYPES, core.test.js; teljes coverage riport nincs rögzítve.
- **Visszaállítás:** element.add undo; hozzáadási hiba nem hagyhat részleges node-ot.
- **Státusz / ismert probléma / következő lépés:** IN PROGRESS / UNVERIFIED; teljes type↔palette↔Inspector↔renderer registry összevetés, keresés/favorite döntés.

#### EDT-016 — Layout/container nodes
- **Felhasználói eredmény:** szekciók, konténerek, sorok, oszlopok, grid és csoportok segítségével rendezett oldal építhető.
- **Belépési pont / műveletek:** palette, canvas, layer tree és Inspector; add/nest/reorder/reparent/layout edit.
- **Kanonikus owner / adatforrás:** EDITOR / Page Model node tree és style/layout properties.
- **Séma / invariánsok:** canContain és leaf/container szabályok; nested layout, gap/columns, responsive override és overflow szabályok teljes szemantikája nyitott.
- **Jogosultság:** Editor/page permission; layout node nem kerülhet át más site/page adatába.
- **API/command:** element.add/update és hierarchy commands; type-specific layout schema/validation egységesítendő.
- **Függőségek:** EDT-001–014/021–026/034.
- **UI-állapotok:** empty container, nested content, invalid drop, breakpoint switch, overflow/validation error.
- **Biztonság/adatvédelem:** depth/node-count limit és malformed nesting elutasítása; renderer ne dolgozzon fel korlátlan rekurziót.
- **Tesztcsomag:** schema/commands core tests; teljes layout geometry és browser responsive suite nincs bizonyítva.
- **Elfogadás:** section/row/grid nested layout → breakpoint override → save/reload → Editor preview és public renderer azonos hierarchiát és elrendezést ad.
- **Bizonyíték:** schema.js, commands.js, responsive.js és public renderer; teljes node-level parity report nincs.
- **Visszaállítás:** hierarchy/layout command undo/redo; invalid batch atomic rollback.
- **Státusz / ismert probléma / következő lépés:** IN PROGRESS / UNVERIFIED; layout semantics, nested constraints és public parity.

#### EDT-017 — Alap tartalmi node-ok
- **Felhasználói eredmény:** szöveg, címsor, gomb/link, ikon, divider és spacer szerkeszthető.
- **Belépési pont / műveletek:** palette + Inspector + canvas; content/style/link/icon edit és preview.
- **Kanonikus owner / adatforrás:** EDITOR / Page Model content/style; icon definitions az egyetlen canonical Icon Registryből jönnek.
- **Séma / invariánsok:** type-specific content schema, heading level, valid URL, accessible name/semantics és style property validation.
- **Jogosultság:** public output csak published Page Modelből; editor-only adatok nem kerülhetnek ki.
- **API/command:** element.update és Rich Text command; type-specific Inspector command coverage nyitott.
- **Függőségek:** EDT-001–003/015/021–024/034/037/043, RES/DSN ikon- és design-szolgáltatások.
- **UI-állapotok:** empty content, invalid URL, missing icon, validation, preview/public mismatch.
- **Biztonság/adatvédelem:** safe URL, text escaping, link rel/target policy, no unsafe HTML injection.
- **Tesztcsomag:** Rich Text/schema alaptesztek vannak; minden alap node control, keyboard/ARIA és link safety suite nem bizonyított.
- **Elfogadás:** minden node saját mezői → valid/invalid érték → save/reload → keyboard/accessibility és public output ellenőrzés.
- **Bizonyíték:** schema.js, app.js, commands.js és page-renderer.js; node-by-node acceptance nincs rögzítve.
- **Visszaállítás:** command undo/redo és revision restore; icon rename/deletion referenciakezelése nyitott.
- **Státusz / ismert probléma / következő lépés:** IN PROGRESS / UNVERIFIED; type-specific Inspector és accessibility/public parity.

#### EDT-018 — Resource-backed nodes: image, video, embed, gallery, card, badge
- **Felhasználói eredmény:** média és újrafelhasználható tartalmi blokkok biztonságosan elhelyezhetők az oldalon.
- **Belépési pont / műveletek:** Editor palette/Inspector; asset kiválasztás, alt text, poster/fallback, embed konfiguráció.
- **Kanonikus owner / adatforrás:** EDITOR a Page Model referencia tulajdonosa; RESOURCE a média/asset metadata és R2 object tulajdonosa.
- **Séma / invariánsok:** stabil asset ID/object reference, MIME/variant, alt text, public/private visibility; URL-string másolása nem helyettesítheti a canonical asset reference-et.
- **Jogosultság:** media picker és asset read site-scoped; private/paid asset public rendererben nem szivároghat ki.
- **API/command:** Editor node config fogyasztja a RESOURCE API-t; a teljes media picker/upload/usage-map API nincs bizonyítva.
- **Függőségek:** EDT-001/015/017/021–022/034, RES-001–016, DSN-001–018.
- **UI-állapotok:** no asset, uploading/processing, ready, missing/deleted asset, private/unauthorized, embed blocked, fallback.
- **Biztonság/adatvédelem:** safe embed allowlist/CSP, MIME validation, SVG safety, authorized download és alt text; mind nyitott acceptance.
- **Tesztcsomag:** teljes media API/renderer suite nem látható a vizsgált tesztfában.
- **Elfogadás:** asset kiválasztás → render → delete/reference warning → public/private access check → save/reload és broken-reference recovery.
- **Bizonyíték:** Page Model/media metadata/R2 alap és renderer safeUrl; teljes registry/picker evidence nincs.
- **Visszaállítás:** Page Model revision restore; asset törlés csak usage-map és safe-delete kapu után.
- **Státusz / ismert probléma / következő lépés:** IN PROGRESS / UNVERIFIED; canonical Media API, picker, safe embed és node renderer parity.

#### EDT-019 — Interaktív/összetett komponensek: table, accordion, tabs, form és társai
- **Felhasználói eredmény:** összetett komponensek használhatók, billentyűzettel és mobilon is.
- **Belépési pont / műveletek:** palette/Inspector/public component; content/config edit, tabs/accordion interaction, form submit.
- **Kanonikus owner / adatforrás:** EDITOR a megjelenítési konfigurációt birtokolja; form submission és tárolás külön FORM domain, komponenskönyvtár a DESIGN SYSTEM.
- **Séma / invariánsok:** component-specific schema, interaction state, form field validation, submit endpoint, keyboard/ARIA semantics.
- **Jogosultság:** form submission endpoint szerveroldali permission/consent/rate limit; a public renderer nem írhat közvetlenül privát táblába.
- **API/command:** Page Model component config; form submit csak canonical FORM API-n keresztül. A teljes contract nem bizonyított.
- **Függőségek:** EDT-001/015/017/021–022/034/037, DSN registry, FORM domain és SEC.
- **UI-állapotok:** closed/open, active tab, validation, submitting/success/failure/retry, keyboard focus.
- **Biztonság/adatvédelem:** CSRF/spam/rate limit, PII consent/retention, safe submission, XSS és ARIA; acceptance nyitott.
- **Tesztcsomag:** teljes interaktív component/form browser suite nem látható.
- **Elfogadás:** keyboard-only és touch interakció → invalid/valid form submit → server-side result → safe error/success → retention/delete policy ellenőrzése.
- **Bizonyíték:** node schema/palette részleges; teljes component runtime/API/test evidence nincs rögzítve.
- **Visszaállítás:** Editor config undo/revision restore; beküldött formot nem szabad hamisan „undo”-zhatónak mutatni.
- **Státusz / ismert probléma / következő lépés:** OPEN / UNVERIFIED; component-specific schema, accessibility és canonical FORM API szükséges.

#### EDT-020 — Domain-owned blocks: schedule és SANCI/provider blokkok
- **Felhasználói eredmény:** a publikus oldalon élő domainadat jeleníthető meg a saját modulokból, duplikált üzleti adat nélkül.
- **Belépési pont / műveletek:** Editor palette/Inspector; domain block hozzáadása, source/config beállítása, preview.
- **Kanonikus owner / adatforrás:** EDITOR csak block placement/config; SCHEDULE, LIVE, CONTENT és INT a saját adataik és API-juk gazdái.
- **Séma / invariánsok:** block type → explicit domain/API contract; published-only public projection, type validation, loading/empty/error/stale state.
- **Jogosultság:** provider tokens csak backendben; public block kizárólag public-safe mezőt olvashat.
- **API/command:** schedule block config/read projection alap létezik; több SANCI/provider block placeholder, általános block source registry nincs bizonyítva.
- **Függőségek:** EDT-001/015/021–024/034, SCH-010–011, LIV, CNT, INT, SEC.
- **UI-állapotok:** loading/empty/live/stale/provider unavailable/permission denied/fallback.
- **Biztonság/adatvédelem:** secret redaction, published-only, rate/quota, provider error és cache freshness.
- **Tesztcsomag:** schedule-source/core tesztalap létezik; minden domain blockra contract/test matrix nincs.
- **Elfogadás:** owning domain adatának módosítása → Editor preview frissül → publish/public output egyezik; provider failure esetén nincs mock siker vagy secret leakage.
- **Bizonyíték:** schedule schema/preview/source tests és page-renderer; minden provider block runtime evidence nincs.
- **Visszaállítás:** Page Model revision rollback; provider state-ot nem másoljuk Page Modelbe eikä nem rollbackoljuk a külső szolgáltatást.
- **Státusz / ismert probléma / következő lépés:** IN PROGRESS / UNVERIFIED; blockonkénti owner/API/state/permission/parity acceptance.

**Szeletzárás:** EDT-015–020 kártyái a mezőket kitöltik, de az összetett komponensek, media API és provider blocks implementációja nem tekinthető késznek. Következő lépés: a 63.43 kártyáinak mező- és dependency-ellenőrzése, majd EDT-021–026.

### 63.44. Funkciókártyák — EDT-021–026 (Property Registry, Inspector, responsive values, preview)

**Forrásalap:** public/editor-v2/core/property-registry.js, core/responsive.js, core/commands.js, app.js és tests/core.test.js. A registryben felsorolt csoport önmagában nem jelent implementált propertyt vagy UI-controlt; ezt a korlátot a kártyák külön rögzítik.

#### EDT-021 — Property Registry
- **Felhasználói eredmény:** az elemtípusok tulajdonságai egységes, ellenőrizhető szerződés szerint jelennek meg.
- **Belépési pont / műveletek:** Inspector/property definitions; node type, property group, type, responsive support és validation metadata.
- **Kanonikus owner / adatforrás:** EDITOR / core/property-registry.js; Page Model és command engine marad az értékek adatforrása.
- **Séma / invariánsok:** minden deklarált propertyhez konkrét node/type, value schema, default, responsive flag és command mapping kell.
- **Jogosultság:** property metadata nem jogosultság; a mutáció csak aktív Editor/page scope-ban engedélyezett.
- **API/command:** registry → Inspector renderer → canonical update command; teljes coverage nincs bizonyítva.
- **Függőségek:** EDT-001–003/015–020/022–026/034/039–040/044.
- **UI-állapotok:** supported/unsupported, empty/default/inherited/overridden/invalid, disabled.
- **Biztonság/adatvédelem:** ismeretlen property ne legyen vakon elfogadva; style/content patch allowlist és validáció.
- **Tesztcsomag:** core.test.js teszteli a registry csoportokat/properties létezését; teljes property↔control↔command↔renderer matrix hiányzik.
- **Elfogadás:** minden registry entryhez control + schema validation + command + public renderer mapping vagy explicit unsupported státusz; invalid érték elutasítva.
- **Bizonyíték:** property-registry.js, app.js, commands.js, core.test.js; teljes coverage report nincs rögzítve.
- **Visszaállítás:** property change undo/redo; registry/schema verzióváltás migrációs szabálya nyitott.
- **Státusz / ismert probléma / következő lépés:** IN PROGRESS / UNVERIFIED; üres csoportok és hiányzó property definíciók tételes feltárása.

#### EDT-022 — Type-specific Inspector controls és validation
- **Felhasználói eredmény:** a felhasználó a property típusának megfelelő, érthető vezérlővel szerkeszt.
- **Belépési pont / műveletek:** Inspector tabs/groups; input/select és type-specific box/font/color/asset/shadow controls.
- **Kanonikus owner / adatforrás:** EDITOR / Property Registry + Page Model property schema.
- **Séma / invariánsok:** input control típusa egyezzen a schema-val; box ne plain textként, asset ne szabad URL-ként, color/font/shadow ne validálatlan stringként legyen kezelve.
- **Jogosultság:** Inspector nem kerülheti meg a domain owner permissionjét resource-backed vagy domain-block propertynél.
- **API/command:** control input → schema validation → canonical command; a vizsgált generikus renderer a selecten kívül általános text inputot használ.
- **Függőségek:** EDT-001–003/017–021/023–026/034.
- **UI-állapotok:** valid/invalid, empty/default, disabled, inherited, saving/conflict, unsupported control.
- **Biztonság/adatvédelem:** safe URL, allowed value enums, input bounds és injection prevention.
- **Tesztcsomag:** registry teszt létezik, de type-specific controls és invalid-input UX teljes suite nem bizonyított.
- **Elfogadás:** minden deklarált típus a megfelelő controlt mutatja; valid érték save/reload/render round-tripet teljesít; invalid érték nem módosítja a modellt.
- **Bizonyíték:** property-registry.js és app.js; a hiányzó specialized controlok kódban ellenőrizendők, külön browser evidence nincs.
- **Visszaállítás:** canonical command undo/redo; invalid inputnál előző érték marad.
- **Státusz / ismert probléma / következő lépés:** IN PROGRESS / UNVERIFIED; specialized controlok és field-level validation szükséges.

#### EDT-023 — Responsive value resolver és inheritance
- **Felhasználói eredmény:** az elem tulajdonsága a kiválasztott breakpointon a megfelelő örökölt vagy felülírt értéket használja.
- **Belépési pont / műveletek:** Inspector és responsive preview; base value, override, inherited value megtekintése/szerkesztése.
- **Kanonikus owner / adatforrás:** EDITOR / core/responsive.js + Page Model node responsive/style state.
- **Séma / invariánsok:** breakpoint precedence, fallback és explicit override determinisztikus; nem létező viewport/property nem okozhat eltérő implicit értéket.
- **Jogosultság:** lokális Page Model szerkesztés; backend scope gate mentésnél kötelező.
- **API/command:** resolveResponsiveValue és responsive commands; minden Inspector property ténylegesen resolved értéket mutasson.
- **Függőségek:** EDT-001/021–022/024–026/034.
- **UI-állapotok:** base/inherited/overridden, breakpoint change, missing override, invalid value.
- **Biztonság/adatvédelem:** invalid responsive object elutasítása; excessive nesting/property count limit nyitott.
- **Tesztcsomag:** core.test.js inheritance/override/reset tesztet tartalmaz; minden property és public renderer parity nem bizonyított.
- **Elfogadás:** base value → tablet override → mobile inheritance/override → reset → save/reload; Inspector jelzi, honnan jön az érték.
- **Bizonyíték:** responsive.js és core.test.js; UI field-by-field evidence nincs.
- **Visszaállítás:** override/reset command undo/redo; explicit base érték nem veszhet el.
- **Státusz / ismert probléma / következő lépés:** IN PROGRESS / UNVERIFIED; resolved/inherited indication és minden property parity.

#### EDT-024 — Responsive override, inherit és reset
- **Felhasználói eredmény:** breakpoint-specifikus változtatás biztonságosan beállítható, örökölhető vagy törölhető.
- **Belépési pont / műveletek:** Inspector responsive control; override létrehozás, inherit és reset.
- **Kanonikus owner / adatforrás:** EDITOR / Page Model responsive values és core/responsive.js.
- **Séma / invariánsok:** override törlése nem állíthat be véletlen null/zero értéket; explicit érték és örökölt fallback megkülönböztetendő.
- **Jogosultság:** Editor/page permission.
- **API/command:** responsive override/reset command; minden property UI-ján való használat nyitott.
- **Függőségek:** EDT-021–023/025–026/034/044.
- **UI-állapotok:** inherited/overridden/reset confirmation/invalid breakpoint.
- **Biztonság/adatvédelem:** malformed override és unsupported breakpoint elutasítása.
- **Tesztcsomag:** helper tesztelt; teljes Inspector control coverage és save/reload nem bizonyított.
- **Elfogadás:** override → reset/inherit → viewport switch → save/reload → ugyanaz a fallback és public output.
- **Bizonyíték:** responsive.js és core.test.js; minden node/property UI evidence nincs.
- **Visszaállítás:** override/reset undo/redo.
- **Státusz / ismert probléma / következő lépés:** IN PROGRESS / UNVERIFIED; property-level reset/inherit UI és persistence teszt.

#### EDT-025 — Responsive preview és breakpoint switch
- **Felhasználói eredmény:** desktop/tablet/mobile elrendezés külön-külön előnézhető, valósághű méretekkel.
- **Belépési pont / műveletek:** Editor viewport controls; breakpoint switch, viewport dimension, zoom és preview.
- **Kanonikus owner / adatforrás:** EDITOR / viewport state + responsive resolver; public renderer a megjelenítési parity referenciája.
- **Séma / invariánsok:** breakpoint méretek és CSS/media query szabályok egyeznek; viewport váltás nem írhatja át véletlenül a base data-t.
- **Jogosultság:** preview draft hozzáférése authenticated; public preview csak engedélyezett draft token/route útján.
- **API/command:** lokális viewport selection; user preference persistence EDT-044-től függ.
- **Függőségek:** EDT-007/021–024/026/034–036/044.
- **UI-állapotok:** desktop/tablet/mobile, custom viewport, zoom, resize, draft/public preview.
- **Biztonság/adatvédelem:** preview route authorization és noindex; viewport önmagában nem módosíthat publikált állapotot.
- **Tesztcsomag:** core responsive helper tesztek léteznek; valódi browser/device visual regression nincs bizonyítva.
- **Elfogadás:** ugyanaz a Page Model három breakpointon → viewport váltás → csak explicit override változik → public output összevetés.
- **Bizonyíték:** responsive.js, app.js, mobile CSS; browser/device screenshot/visual regression evidence nincs rögzítve.
- **Visszaállítás:** viewport reset; Page Model csak explicit property editkor változhat.
- **Státusz / ismert probléma / következő lépés:** IN PROGRESS / UNVERIFIED; viewport/preview parity és device E2E.

#### EDT-026 — Responsive visibility/order/layout parity
- **Felhasználói eredmény:** elem láthatósága és layoutja breakpointonként kiszámíthatóan működik.
- **Belépési pont / műveletek:** Inspector responsive controls, layer tree, Editor preview és public renderer.
- **Kanonikus owner / adatforrás:** EDITOR / Page Model responsive schema; PUBLIC_RENDERER csak megjeleníti a resolved modellt.
- **Séma / invariánsok:** visibility/order/columns/gap/size breakpoint policy explicit; hide state nem keverhető a lock state-tel.
- **Jogosultság:** public render csak publikált és public-safe tartalmat jelenít meg.
- **API/command:** responsive property commands és public renderer resolver; teljes property mapping nem bizonyított.
- **Függőségek:** EDT-021–025/034/037/040, RES/DSN ahol releváns.
- **UI-állapotok:** visible/hidden, reordered, inherited/overridden, breakpoint switch, unsupported property.
- **Biztonság/adatvédelem:** hidden UI nem jelent titkosítást vagy authorizationt; sensitive data soha nem kerülhet Page Model public outputba.
- **Tesztcsomag:** responsive helper teszt van; visibility/order public renderer parity és mobile browser acceptance nincs.
- **Elfogadás:** breakpointonként layout/visibility beállítása → save/reload → Editor preview és publikus output azonos; hidden private data nem kerül a HTML-be.
- **Bizonyíték:** responsive.js, app.js, page-renderer.js; teljes parity suite nincs rögzítve.
- **Visszaállítás:** responsive property undo/redo és revision restore.
- **Státusz / ismert probléma / következő lépés:** IN PROGRESS / UNVERIFIED; responsive visibility/order resolver, public renderer parity és mobile E2E.

**Szeletzárás:** EDT-021–026 kártyái rögzítik a registry/Inspector/responsive hiányokat; nem jelentenek működő teljes property-rendszert. Következő lépés: a 63.44 mező- és dependency-ellenőrzése, majd EDT-027–033 mentés/publikálás/revision.

### 63.45. Funkciókártyák — EDT-027–033 (save, reload, concurrency, recovery, preview, publish)

**Forrásalap:** public/editor-v2/app.js, src/routes/admin/editor.ts, src/routes/admin/pages.ts, src/core/editor-validation.ts és public/editor-v2/tests/core.test.js. A save conflict recovery alap és publish validator létezik; a szerveroldali expectedVersion több útvonalon opcionális, a pages create pedig isPublished=true esetén nem hívja a publish validátort. Ezek nyitott szerveroldali kapuk, nem UI-val lezárható hiányok.

#### EDT-027 — Draft save és dirty state
- **Felhasználói eredmény:** a felhasználó megbízhatóan mentheti a draftot anélkül, hogy azt véletlenül publikálná.
- **Belépési pont / műveletek:** Editor v2 Save/keyboard shortcut; document snapshot, POST save, dirty/saved state.
- **Kanonikus owner / adatforrás:** EDITOR/PAGE API; pages.content_json + editor_revisions, a publikus snapshot külön.
- **Séma / invariánsok:** mentés a beküldött snapshotot rögzíti; későbbi lokális edit nem jelölhető tévesen mentettnek; save nem egyenlő publish.
- **Jogosultság:** authenticated page/site ownership; minden write endpointon szerveroldali scope.
- **API/command:** POST /api/admin/editor pageId/document/publish/expectedVersion; expectedVersion szerveroldali kötelezővé tétele nyitott.
- **Függőségek:** EDT-001–006/028–031, WEB-004/006/007, SEC.
- **UI-állapotok:** dirty/saving/saved/error/conflict, edit-during-save.
- **Biztonság/adatvédelem:** dokumentumméret-limit és invalid schema rejection; conflict nem írhat felül csendben másik verziót.
- **Tesztcsomag:** core.test.js save/reload/conflict source-level teszteket tartalmaz; teljes API concurrency E2E nyitott.
- **Elfogadás:** edit → save → reload → adat egyezik; save közben új edit → csak beküldött snapshot jelölt mentettnek.
- **Bizonyíték:** app.js save() és admin/editor.ts revision persistence; külön CI/runtime run nincs a kártyához csatolva.
- **Visszaállítás:** editor_revisions és draft export; mentési hiba esetén local draft megmarad.
- **Státusz / ismert probléma / következő lépés:** IN PROGRESS / UNVERIFIED; expectedVersion kötelező server-side contract és concurrency teszt.

#### EDT-028 — Save/reload teljes Page Model round-trip
- **Felhasználói eredmény:** a teljes szerkesztett dokumentum mentés után változatlanul visszatölthető.
- **Belépési pont / műveletek:** Editor loadPage/save; admin pages/editor API és D1 revision.
- **Kanonikus owner / adatforrás:** PAGE/EDITOR; content_json, editor_revisions.document_json és Page Model.
- **Séma / invariánsok:** pageId/activePageId/root/node properties/responsive/rich text/domain blocks/revision round-trip; normalize nem dobhat el érvényes mezőt.
- **Jogosultság:** minden SELECT/UPDATE page ID és site_id alapján; cross-site negatív teszt kötelező.
- **API/command:** GET /api/admin/editor?pageId=... és POST mentés; minden property/node teljes round-trip coverage nyitott.
- **Függőségek:** EDT-001–027/029–034, WEB-004–008, RES/DSN/DYN.
- **UI-állapotok:** load/empty/invalid document/saving/reload/conflict/partial API error.
- **Biztonság/adatvédelem:** draft tartalom csak authorized Editor/preview útvonalon; méretlimit és schema validation.
- **Tesztcsomag:** core.test.js save/reload source checks; D1-integrációs teljes node/property round-trip nincs bizonyítva.
- **Elfogadás:** minden támogatott node/property mentése → unload/reload → mély strukturális egyezés → preview/public render egyezés.
- **Bizonyíték:** app.js loadPage/save, admin/editor.ts, admin/pages.ts; teljes DB-backed round-trip CI evidence nincs.
- **Visszaállítás:** revision restore új revisionként; sérült dokumentum esetén export és korábbi revision.
- **Státusz / ismert probléma / következő lépés:** IN PROGRESS / UNVERIFIED; teljes D1 round-trip és renderer paritás.

#### EDT-029 — expectedVersion és concurrency conflict
- **Felhasználói eredmény:** két szerkesztő vagy több tab nem írja felül csendben egymás módosítását.
- **Belépési pont / műveletek:** save, page metadata PATCH és revision rollback.
- **Kanonikus owner / adatforrás:** PAGE/REVISION API; editor_revisions max(version) és expectedVersion.
- **Séma / invariánsok:** a kliens által várt verzió egyezzen a szerver aktuális verziójával; mismatch 409, nincs write.
- **Jogosultság:** page/site ownership az összehasonlítás előtt; a conflict válasz nem fedhet fel más site adatot.
- **API/command:** POST editor és pages PATCH ellenőrzi, ha expectedVersion jelen van; hiányzó expectedVersion jelenleg elfogadott, ezért a concurrency gate nem teljes.
- **Függőségek:** EDT-027–028/030–031, WEB-002/007/008, SEC.
- **UI-állapotok:** current/conflict/local draft/export/reload/retry.
- **Biztonság/adatvédelem:** lost update megelőzése; minden write pathnál kötelező version precondition.
- **Tesztcsomag:** conflict source-level test van; két párhuzamos klienssel és hiányzó expectedVersionnel API negatív teszt kell.
- **Elfogadás:** kliens A és B ugyanarról a verzióról indul → A ment → B mentése 409, nincs overwrite; missing expectedVersion elutasítva.
- **Bizonyíték:** admin/editor.ts és pages.ts opcionális checkjei, core.test.js conflict test; endpoint matrix nincs lezárva.
- **Visszaállítás:** conflict draft export, reload latest, revision restore.
- **Státusz / ismert probléma / következő lépés:** BLOCKED / NOT PASS; server-side required expectedVersion és race tests szükségesek.

#### EDT-030 — In-flight save snapshot és race safety
- **Felhasználói eredmény:** mentés közben végzett új módosítás nem vész el és nem kap hamis saved állapotot.
- **Belépési pont / műveletek:** Editor save; submitted snapshot és current state összevetése.
- **Kanonikus owner / adatforrás:** EDITOR state.persistence + Page Model; szerver a snapshot revisionjét tárolja.
- **Séma / invariánsok:** csak unchanged snapshot jelölhető cleannek; későbbi edit dirty marad és következő mentést igényel.
- **Jogosultság:** normál page/site save permission.
- **API/command:** save() külön submittedDocument/submittedJson snapshotot tart; response-order és multi-save viselkedés teljesen nem bizonyított.
- **Függőségek:** EDT-027–029/031.
- **UI-állapotok:** saving + continued editing, duplicate submit, reordered responses, conflict.
- **Biztonság/adatvédelem:** nincs silent data loss; duplicate request és concurrency policy explicit.
- **Tesztcsomag:** source test ellenőrzi a snapshotkezelést; deferred/race response test nincs bizonyítva.
- **Elfogadás:** save A indul → user edit B → A válasza megérkezik → B dirty marad → második save után B reloadolható.
- **Bizonyíték:** app.js save() snapshot comparison; browser/network race evidence nincs.
- **Visszaállítás:** local state és conflict export; hibás response nem jelölheti cleannek.
- **Státusz / ismert probléma / következő lépés:** IN PROGRESS / UNVERIFIED; race/in-flight save E2E és duplicate-submit policy.

#### EDT-031 — Network recovery és local draft retention
- **Felhasználói eredmény:** hálózati hiba vagy verzióütközés esetén a helyi munka visszanyerhető.
- **Belépési pont / műveletek:** Editor save error/conflict panel; draft JSON export, explicit reload latest, retry.
- **Kanonikus owner / adatforrás:** EDITOR local state és server revision; a conflict draft export nem canonical page record.
- **Séma / invariánsok:** local draft export tartalmazza a page ID/slug/revision/document azonosítókat; reload latest csak kifejezett megerősítéssel írhatja felül a memóriabeli state-et.
- **Jogosultság:** export csak az aktuálisan authorized user saját draftját tartalmazza; letöltött fájl érzékeny tartalmú lehet.
- **API/command:** exportConflictDraft és reloadLatestAfterConflict; automatikus offline local persistence és retry policy nem bizonyított.
- **Függőségek:** EDT-027–030/032, SEC, OPS.
- **UI-állapotok:** network error, timeout, 409 conflict, export started/failed, reload confirm/failure.
- **Biztonság/adatvédelem:** ne logoljon vagy küldjön draftot külső szolgáltatásba; figyelmeztetés az export fájl bizalmas tartalmáról.
- **Tesztcsomag:** core.test.js ellenőrzi a conflict export és explicit reload forrásútját; valódi offline/browser download teszt nyitott.
- **Elfogadás:** offline/409 → local draft megmarad → export → latest betöltése csak megerősítés után → nincs silent overwrite.
- **Bizonyíték:** app.js exportConflictDraft/reloadLatestAfterConflict, core.test.js source checks.
- **Visszaállítás:** JSON draft export + korábbi revision; automatikus crash recovery nyitott.
- **Státusz / ismert probléma / következő lépés:** IN PROGRESS / UNVERIFIED; offline/retry/browser download és crash recovery policy.

#### EDT-032 — Draft preview authorization és revision binding
- **Felhasználói eredmény:** a szerkesztő ellenőrizheti a draftot publikálás előtt, de illetéktelen nem láthatja.
- **Belépési pont / műveletek:** Editor preview/public page shell; draft preview, current revision és noindex.
- **Kanonikus owner / adatforrás:** PAGE/PREVIEW API és canonical Page Model; draft nem olvasható nyilvános endpointból.
- **Séma / invariánsok:** preview konkrét page/site/revisionhez kötött; expiry, noindex és unauthorized/cross-site viselkedés explicit.
- **Jogosultság:** server-side auth + role + site ownership; preview URL önmagában nem adhat hozzáférést, kivéve explicit lejáró token policy esetén.
- **API/command:** admin editor route auth-gated; minden preview link/token lifecycle és revision binding nincs bizonyítva.
- **Függőségek:** EDT-027–031/033–034, WEB-005/012/031, SEC.
- **UI-állapotok:** authorized draft, expired, unauthorized, not found, stale revision, noindex.
- **Biztonság/adatvédelem:** noindex, no-store where needed, token redaction, cross-site negative test.
- **Tesztcsomag:** route auth alap látható; expiry/token/real crawler/browser suite nincs bizonyítva.
- **Elfogadás:** draft preview → unauthorized session/cross-site/expired token elutasítva → public visitor csak published snapshotot lát.
- **Bizonyíték:** admin/editor.ts és public pages route; preview-token E2E nincs rögzítve.
- **Visszaállítás:** preview access visszavonása/lejárata; published snapshot változatlan.
- **Státusz / ismert probléma / következő lépés:** IN PROGRESS / UNVERIFIED; token/revision/noindex/browser acceptance.

#### EDT-033 — Publish/unpublish/rollback workflow
- **Felhasználói eredmény:** validált draft publikálható, visszavonható és korábbi revisionból biztonságosan helyreállítható.
- **Belépési pont / műveletek:** Editor Publish/Unpublish, revision panel restore; page create/update API.
- **Kanonikus owner / adatforrás:** PAGE/PUBLISH/REVISION; content_json draft, published_content_json snapshot, published_revision_id és editor_revisions.
- **Séma / invariánsok:** save ≠ publish; publish validálja a Page Modelt; unpublish leállítja a public readet; rollback új revisionként történik.
- **Jogosultság:** szerveroldali page/site scope + publish role policy; minden entrypoint ugyanazt a validationt használja.
- **API/command:** editor POST publish és az `isPublished=true` pages create is `validatePublishDocument`-et futtat, a közzétett média assetjeit pedig közös site/MIME ellenőrzés védi (`src/core/editor-publication.ts`). Az invalid create 409-cel, page/revision/audit írás nélkül utasítódik el; draft create továbbra is engedi a javítható, még nem publikálható tartalmat. A pages PATCH és editor/rollback `expectedVersion`-szerződése külön concurrency nyitott pont.
- **Függőségek:** EDT-027–032, WEB-004/006–008/012/031, SEC/OPS.
- **UI-állapotok:** draft/published/dirty/draft-ahead, validation failure, conflict, unpublish confirm, rollback confirmation.
- **Biztonság/adatvédelem:** invalid Page Model nem kerülhet publikus snapshotba; create/publish bypass és race condition szerveroldalon blokkolandó.
- **Tesztcsomag:** editor-validation és core.test.js publish validator tests; API entrypoint matrixban invalid create/foreign-media, valid initial publish, draft-only create és no-write elutasítás **11/11 WEB-013 tesztben PASS**; a metadata PATCH és minden mutation kötelező version/CAS negatív tesztje még nyitott.
- **Elfogadás:** invalid draft minden publish entrypointon elutasítva → valid draft publish → public snapshot ellenőrzés → unpublish → rollback új revision → public state egyezés.
- **Bizonyíték:** admin/editor.ts, admin/pages.ts, editor-validation.ts, core.test.js; teljes endpoint E2E evidence nincs.
- **Visszaállítás:** published revision snapshot, unpublish és rollback-as-new-revision; minden művelet audit eventtel.
- **Státusz / ismert probléma / következő lépés:** BLOCKED / NOT PASS. Az initial create publish megkerülés lezárva tesztelt kódban; az EDT-033 teljes elfogadása nyitott a Pages PATCH és valamennyi mutation kötelező expectedVersion/CAS egységesítése, publikus endpoint matrix, race tesztek, jogosultsági és publikus snapshot E2E miatt.

**Szeletzárás:** EDT-027–033 kártyák dokumentálják a meglévő save/revision alapot és a konkrét szerveroldali blokkolókat. Ezeket a dokumentációs audit nem javította ki. Következő lépés: 63.45 mező-/dependency-ellenőrzés, majd EDT-034–044 renderer, mobil, accessibility és recovery.

### 63.46. Funkciókártyák — EDT-034–044 (renderer, mobile, accessibility, clipboard, interaction, motion, onboarding, recovery, Rich Text, preferences)

**Forrásalap:** public/assets/page-renderer.js, public/editor-v2/app.js, editor-v2 core/UI/CSS/tests, src/core/editor-validation.ts, editor_preferences migration. Ezek a kártyák a meglevő alapokat és a nem bizonyított végponttól végpontig viselkedést választják szét.

#### EDT-034 — Editor preview és public renderer paritás
- **Felhasználói eredmény:** a szerkesztőben látott publikálható oldal a nyilvános oldalon is ugyanúgy jelenik meg.
- **Belépési pont / műveletek:** Editor canvas/preview és public page renderer; minden node/property megjelenítése.
- **Kanonikus owner / adatforrás:** PAGE/EDITOR a Page Model tulajdonosa; PUBLIC_RENDERER csak megjelenít és owning domain projectiont olvas.
- **Séma / invariánsok:** node/property/responsive/resource/data-binding mapping explicit; unsupported node nem tűnhet el csendben.
- **Jogosultság:** preview draft authenticated; public output csak published snapshot és public-safe projection.
- **API/command:** public/assets/page-renderer.js a public pages API-ból olvas; teljes node-level mapping nincs bizonyítva.
- **Függőségek:** EDT-001–033, WEB-004–032, RES/DSN/DYN/SEO/SEC.
- **UI-állapotok:** loading/empty/error/stale/unsupported node/missing asset/provider unavailable.
- **Biztonság/adatvédelem:** HTML escaping, safe URL/embed allowlist, published-only, no secret leakage.
- **Tesztcsomag:** teljes renderer parity/visual regression suite nincs bizonyítva.
- **Elfogadás:** minden támogatott node és property preview → publish → real HTTP public route; strukturális és vizuális egyezés desktop/tablet/mobile.
- **Bizonyíték:** page-renderer.js, visual-page shell, Editor app.js; teljes parity report nincs rögzítve.
- **Visszaállítás:** published revision rollback; renderer hiba esetén safe fallback, nem mock success.
- **Státusz / ismert probléma / következő lépés:** BLOCKED / NOT PASS; node-by-node parity és real HTTP/browser acceptance.

#### EDT-035 — Mobil Editor shell
- **Felhasználói eredmény:** a szerkesztő telefonon is használható, a vezérlők nem lógnak ki és nem takarják a canvas lényegét.
- **Belépési pont / műveletek:** mobile Editor shell, toolbar/action bar, viewport, canvas gestures.
- **Kanonikus owner / adatforrás:** EDITOR UI/CSS; Page Modeltől különálló viewport state.
- **Séma / invariánsok:** safe-area, viewport height, virtual keyboard és zoom policy; mobilon sem lehet más Page Model mutáció.
- **Jogosultság:** ugyanaz az authenticated Editor/page scope.
- **API/command:** ugyanaz a canonical command/state API, mint desktopon.
- **Függőségek:** EDT-007–014/025/026/035–037/044.
- **UI-állapotok:** portrait/landscape, keyboard open, safe-area, scrolling, canvas pan/zoom, offline/conflict.
- **Biztonság/adatvédelem:** mobil UI nem rejthet el permission/error állapotot; auth/session behavior változatlan.
- **Tesztcsomag:** mobile CSS/UI alap vizsgálandó; valódi device browser E2E nincs bizonyítva.
- **Elfogadás:** kis viewporton minden fő action elérhető → keyboard fel/le → canvas/panel használható → save/conflict/recovery.
- **Bizonyíték:** mobile-editor.css, editor.css, app.js; device matrix evidence nincs.
- **Visszaállítás:** viewport/panel reset; dokumentum csak canonical commandokon változik.
- **Státusz / ismert probléma / következő lépés:** IN PROGRESS / UNVERIFIED; safe-area, virtual keyboard és device E2E.

#### EDT-036 — Mobil Layers/Inspector panelek
- **Felhasználói eredmény:** layers és Inspector kis képernyőn váltható, a fókusz és kijelölés elvesztése nélkül.
- **Belépési pont / műveletek:** mobile panel switch, back/Escape, selected-node Inspector.
- **Kanonikus owner / adatforrás:** EDITOR / state.selection és UI panel state.
- **Séma / invariánsok:** panelváltás nem változtathatja meg a selectiont vagy a Page Modelt.
- **Jogosultság:** az aktív page/site scope.
- **API/command:** panel state lokális; node mutation a canonical commandon át.
- **Függőségek:** EDT-006/012–014/035/037/044.
- **UI-állapotok:** layers open, Inspector open, panel closed, selection restored, Escape/back.
- **Biztonság/adatvédelem:** focus trap és keyboard route ne engedjen nem látható/tiltott műveletet.
- **Tesztcsomag:** mobil panel CSS/UI alap; focus restore és back/Escape browser teszt nem bizonyított.
- **Elfogadás:** node kiválasztása → Layers↔Inspector váltás → ugyanaz a selection és input focus helyreáll → save.
- **Bizonyíték:** app.js, mobile-editor.css és editor.css; browser/device evidence nincs.
- **Visszaállítás:** panel state reset; document history változatlan marad.
- **Státusz / ismert probléma / következő lépés:** IN PROGRESS / UNVERIFIED; panel/focus/touch acceptance.

#### EDT-037 — Editor accessibility és keyboard operation
- **Felhasználói eredmény:** a canvas fő műveletei egér nélkül, billentyűzettel és képernyőolvasóval is használhatók.
- **Belépési pont / műveletek:** toolbar, palette, layer tree, Inspector, canvas selection/move/resize/group.
- **Kanonikus owner / adatforrás:** EDITOR UI accessibility contract; közös state/commands.
- **Séma / invariánsok:** minden műveletnek legyen keyboard alternatívája, látható focus, megfelelő role/name/state és screen-reader announcement.
- **Jogosultság:** accessibility nem változtatja meg authorizationt.
- **API/command:** ugyanazok a canonical commands, amelyeket pointer/touch is használ.
- **Függőségek:** EDT-006–026/035–036/038–040, SEC.
- **UI-állapotok:** focus order, selected/locked/disabled, error announcement, dialog/panel focus return.
- **Biztonság/adatvédelem:** accessible error message ne fedjen fel secret/PII adatot.
- **Tesztcsomag:** teljes keyboard-only, screen-reader és automated accessibility suite nincs bizonyítva.
- **Elfogadás:** teljes Editor workflow keyboard-only → focus order/announce ellenőrzés → screen-reader teszt → reduced-motion.
- **Bizonyíték:** semantic buttons/labels részben jelen vannak az app.js-ben; teljes WCAG audit nincs.
- **Visszaállítás:** keyboard undo/redo; accessibility regresszió kiadásblokkoló.
- **Státusz / ismert probléma / következő lépés:** BLOCKED / NOT PASS; keyboard canvas alternative, focus management és screen-reader E2E.

#### EDT-038 — Multi-select, duplicate és clipboard
- **Felhasználói eredmény:** több elem együtt kijelölhető, csoportosan kezelhető és biztonságosan másolható.
- **Belépési pont / műveletek:** canvas/layer tree, mobile multi-select bar, duplicate/copy/paste.
- **Kanonikus owner / adatforrás:** EDITOR / selection.ids + Page Model subtree; clipboard nem lehet második dokumentum-adatforrás.
- **Séma / invariánsok:** subtree paste új node ID-kat és parent/child mappinget kap; multi-select batch sorrendje és parent-szabálya explicit.
- **Jogosultság:** csak aktív page/site scope; cross-page paste policy explicit és asset permissionnel egyezik.
- **API/command:** element.duplicate és hierarchy.group létezik; clipboard copy/paste UI/handler nem bizonyított.
- **Függőségek:** EDT-001–006/011–014/021–024/035–037.
- **UI-állapotok:** none/single/multiple, clipboard empty/ready, invalid paste target, locked selection.
- **Biztonság/adatvédelem:** pasted URL/asset references újraellenőrzendők; cross-site reference nem vihető át engedély nélkül.
- **Tesztcsomag:** multi-select/duplicate core alap; clipboard/ID remap/cross-page E2E hiányzik.
- **Elfogadás:** nested subtree copy/paste → új ID-k → asset refs validálása → undo/redo → save/reload.
- **Bizonyíték:** commands.js duplicate/group és app.js selection; clipboard route/UI evidence nincs.
- **Visszaállítás:** egy batch undo; sikertelen paste atomic rollback.
- **Státusz / ismert probléma / következő lépés:** IN PROGRESS / UNVERIFIED; copy/paste scope és UI implementációs döntés.

#### EDT-039 — Page-local interaction schema
- **Felhasználói eredmény:** a page komponensek biztonságos, korlátozott interakciót konfigurálhatnak.
- **Belépési pont / műveletek:** Inspector interaction group; allowed action, target, trigger és validation.
- **Kanonikus owner / adatforrás:** EDITOR a page-local interaction schema tulajdonosa; AUT automation action registry külön domain.
- **Séma / invariánsok:** allowlisted trigger/action schema, no arbitrary JS/eval, URL/form safety, explicit target scope.
- **Jogosultság:** public runtime csak validált, publikált interactiont futtathat.
- **API/command:** Property Registry group említése mellett teljes property/runtime nem bizonyított.
- **Függőségek:** EDT-021/022/034/037/040, SEC, AUT külön adapterkapu.
- **UI-állapotok:** configured/invalid/unsupported/preview/runtime failure.
- **Biztonság/adatvédelem:** arbitrary code tiltott; CSP, safe URL, event abuse és permission boundary kötelező.
- **Tesztcsomag:** interaction schema/runtime acceptance nincs bizonyítva.
- **Elfogadás:** valid allowlisted action preview/publish/runtime; arbitrary script, invalid target és unsafe URL elutasítva.
- **Bizonyíték:** jelenlegi registry group nem bizonyít működő runtime-ot; teljes implementation evidence nincs.
- **Visszaállítás:** config undo/revision restore; runtime side effect csak idempotens/safe policy szerint.
- **Státusz / ismert probléma / következő lépés:** OPEN / UNVERIFIED; interaction schema és runtime security contract.

#### EDT-040 — Motion és reduced-motion
- **Felhasználói eredmény:** az animációk kontrollálhatók, és a csökkentett mozgást kérő felhasználók megfelelő élményt kapnak.
- **Belépési pont / műveletek:** Inspector motion controls és public renderer.
- **Kanonikus owner / adatforrás:** EDITOR a page-local motion configot kezeli; public renderer a preference-aware viselkedést.
- **Séma / invariánsok:** duration/easing/action allowlist, motion defaults és prefers-reduced-motion policy.
- **Jogosultság:** motion config nem fér hozzá domain permissionökhöz.
- **API/command:** registryben motion/accessibility csoport említett, konkrét property/runtime nem bizonyított.
- **Függőségek:** EDT-021/022/034/037/039, LOC, SEC.
- **UI-állapotok:** default/reduced/disabled/unsupported.
- **Biztonság/adatvédelem:** ne legyen autoplay/flashing vagy vestibularis kockázat; user preference legyen tiszteletben tartva.
- **Tesztcsomag:** prefers-reduced-motion runtime teszt nincs bizonyítva.
- **Elfogadás:** motion beállítása → normal/reduced preference mellett public render → animáció kikapcsolt vagy csökkentett, tartalom hozzáférhető.
- **Bizonyíték:** property group említés; működő motion implementation evidence nincs.
- **Visszaállítás:** motion config undo/revision restore.
- **Státusz / ismert probléma / következő lépés:** OPEN / UNVERIFIED; reduced-motion policy és browser tests.

#### EDT-041 — Editor onboarding és template start
- **Felhasználói eredmény:** új oldal kész sablonból vagy segített üres állapotból indulhat, meglévő munka elvesztése nélkül.
- **Belépési pont / műveletek:** create page/onboarding/template chooser; apply/preview/cancel.
- **Kanonikus owner / adatforrás:** EDITOR onboarding UX; a template catalog a DESIGN SYSTEM domain tulajdona.
- **Séma / invariánsok:** template version/compatibility, safe merge/replace policy és sample content cleanup.
- **Jogosultság:** csak jogosult site editor; template install a scope-hoz kötött.
- **API/command:** template-start UI és teljes template registry/apply API nem bizonyított.
- **Függőségek:** EDT-001–005/015–020/027–034, DSN, SITE/SEC.
- **UI-állapotok:** empty/new, template loading/preview, apply confirmation, incompatible template, failure.
- **Biztonság/adatvédelem:** destructive overwrite előtt explicit confirm; sample secrets/private data tilos.
- **Tesztcsomag:** teljes onboarding/template E2E nincs bizonyítva.
- **Elfogadás:** template preview → new page apply → all node IDs remapped → undo/rollback → sample content removed.
- **Bizonyíték:** template UI/registry teljes evidence nincs rögzítve.
- **Visszaállítás:** transaction undo és page revision; destructive replace nélkül preview/confirm.
- **Státusz / ismert probléma / következő lépés:** OPEN / UNVERIFIED; template owner/API és onboarding UX.

#### EDT-042 — Editor error recovery és diagnostics
- **Felhasználói eredmény:** hiba esetén a felhasználó érthető magyarázatot és adatvesztés nélküli következő lépést kap.
- **Belépési pont / műveletek:** Editor diagnostics, save/conflict/error panels, retry/export/reload.
- **Kanonikus owner / adatforrás:** EDITOR recovery UX; server errors és diagnostics source moduljukban maradnak.
- **Séma / invariánsok:** stable error code, redacted context, local draft retention, recovery action and telemetry correlation.
- **Jogosultság:** diagnosztika nem tartalmazhat secretet, tokeneket vagy szükségtelen PII-t.
- **API/command:** conflict export/reload és diagnostics alap létezik; minden hibaállapot/telemetry contract nincs bizonyítva.
- **Függőségek:** EDT-027–033, SEC, OPS, QA.
- **UI-állapotok:** validation/network/conflict/permission/renderer/malformed document/retry.
- **Biztonság/adatvédelem:** redaction és safe logging kötelező; JSON draft export érzékenységét jelezni kell.
- **Tesztcsomag:** conflict recovery source test van; malformed document és teljes error matrix hiányzik.
- **Elfogadás:** szándékosan kiváltott hiba → diagnosztikai ID és biztonságos üzenet → retry/export/restore → nincs silent data loss.
- **Bizonyíték:** app.js conflict functions, diagnostics module, core.test.js source test.
- **Visszaállítás:** export, reload latest, revision restore; recovery action auditálandó.
- **Státusz / ismert probléma / következő lépés:** IN PROGRESS / UNVERIFIED; teljes error taxonomy és recovery E2E.

#### EDT-043 — Rich Text editing
- **Felhasználói eredmény:** formázott szöveg, listák, idézetek és linkek strukturált, biztonságos tartalomként szerkeszthetők.
- **Belépési pont / műveletek:** Rich Text Inspector/editor toolbar; input, normalize, save, undo/redo, render.
- **Kanonikus owner / adatforrás:** EDITOR / Rich Text schema/commands; Page Model strukturált Rich Text dokumentum.
- **Séma / invariánsok:** schemaVersion, block/inline allowlist, mark/link safety, normalize és unsupported version reject.
- **Jogosultság:** authenticated draft editing; public output csak published rich text.
- **API/command:** richtext.content.set + normalizeRichText; teljes toolbar/paste sanitizer/public renderer parity nyitott.
- **Függőségek:** EDT-001–005/017/021–022/027–034/037, SEC.
- **UI-állapotok:** empty/editing/invalid/paste sanitized/saving/conflict.
- **Biztonság/adatvédelem:** paste sanitization, unsafe URL rejection, no raw HTML execution.
- **Tesztcsomag:** schema, valid/invalid Rich Text és undo/redo tesztek léteznek; keyboard/paste/browser suite nincs bizonyítva.
- **Elfogadás:** format/list/link/paste → sanitize → save/reload → public render/accessibility parity; unsupported schema elutasítva.
- **Bizonyíték:** schema.js, commands.js, richtext engine és core.test.js.
- **Visszaállítás:** undo/redo és revision restore.
- **Státusz / ismert probléma / következő lépés:** IN PROGRESS / UNVERIFIED; toolbar, paste sanitizer, a11y és renderer parity.

#### EDT-044 — Per-user Editor preferences
- **Felhasználói eredmény:** a szerkesztő személyes UI-beállításai visszatérnek, de nem módosítják az oldal tartalmát.
- **Belépési pont / műveletek:** Editor preferences; viewport/panel/default controls/favorites, reset.
- **Kanonikus owner / adatforrás:** IDENTITY/USER preference domain; editor_preferences tábla user-scope; Page Modeltől elkülönül.
- **Séma / invariánsok:** user/site scope explicit, defaults/version migration és schema allowlist; secret/domain data nem kerül preference mezőbe.
- **Jogosultság:** csak az aktuális user saját preference-e olvasható/írható.
- **API/command:** schema létezik, dedikált route/UI használat nem bizonyított.
- **Függőségek:** EDT-007/010/012/015/025/035–036, IDENTITY/SEC, TEAM/SITE scope.
- **UI-állapotok:** default/saved/reset/error, stale preference schema.
- **Biztonság/adatvédelem:** user isolation, size limit, no secret storage, logout/account deletion lifecycle.
- **Tesztcsomag:** preference API/UI/authorization/migration teszt nincs bizonyítva.
- **Elfogadás:** preference módosítása → reload/login → visszaáll; más user nem olvashatja; Page Model JSON változatlan.
- **Bizonyíték:** editor_preferences migration/schema; route/UI runtime evidence nincs rögzítve.
- **Visszaállítás:** reset defaults és preference schema migration rollback.
- **Státusz / ismert probléma / következő lépés:** OPEN / UNVERIFIED; owner/scope/API és preference lifecycle döntés.

**Szeletzárás:** EDT-034–044 mezőszintű szerződései elkészültek, de több acceptance blokkoló maradt, különösen public renderer parity, keyboard/accessibility, page-local interaction, reduced motion, templates és preferences. Következő lépés: a 63.46 mező-/dependency-ellenőrzése, majd az EDT modul teljes kártyáinak konszolidált állapotellenőrzése; ezután térünk át a WEB modulra.

### 63.47. EDT-001–044 kártyaminőségi ellenőrzés — bővített vázlat, nem teljes kártya

A 63.41–63.46 fejezetekben elkészült 44 Editor-kártyán gépi ellenőrzés futott. Minden kártyán megvan a felhasználói eredmény, belépési pont/művelet, owner/adatforrás, schema/invariants, permission, API/command, dependencies, UI state, security/privacy, tests, acceptance, evidence, rollback és status/issue/next action összefoglaló. Az ID-hivatkozások feloldhatók a 396-os kanonikus ID-jegyzékben.

**Ez azonban még nem teljes 25/26.1 megfelelés.** A kártyák több mezőt összevont címke alatt tartalmaznak, ezért az alábbiak nem minden ID-nál külön, strukturált mezőként vannak kitöltve:

- A 25. fejezetből: **Phase/priority, Menu/surface, Implementation point, Negative tests, Live/user acceptance, Known issues**.
- A 26.1-ből: **ID és név** külön kártyamezőként; **Belépési pont** és **Műveletek** külön; **Domain owner** és **Kanonikus adatforrás** külön; továbbá a különálló státusz, ismert probléma és következő lépés.
- A negatív teszt és a live/user acceptance nem helyettesíthető az általános elfogadási forgatókönyvvel. Ha nincs bizonyíték, az érték explicit **UNVERIFIED / OPEN** legyen, ne üres és ne feltételezett PASS.

| Minőségellenőrzés | Eredmény | Döntés |
|---|---|---|
| EDT-001–044 részletes vázlat létezik | 44/44 | A vázlatok megtartandók, nem kell újraírni őket a semmiből. |
| Alap mezőcsoportok és ID-hivatkozások | 44/44 gépileg ellenőrzött | Nincs feloldatlan funkció-ID hivatkozás a vizsgált kártyákban. |
| 25. fejezet összes státuszmezője külön kitöltve | NEM IGAZOLT | Teljes mezőnormalizálás szükséges. |
| 26.1 összes mezője külön kitöltve | NEM IGAZOLT | A mezőket szét kell választani és ID-nként explicit módon rögzíteni. |
| Teljes funkciókártya PASS | 0/44 bizonyított | Minden kártya IN PROGRESS / UNVERIFIED marad a szükséges evidence-ig. |

**Kötelező következő lépés:** előbb normalizálni kell a meglévő 44 EDT-kártyát a teljes, külön mezős sablonra, és csak utána bővíteni a WEB modult. Ez elkerüli, hogy 396 funkción keresztül ugyanazt a mezőhiányt másoljuk tovább. A kanonikus aktív pont továbbra is PLAN-CAPABILITY-COMPLETENESS-AND-CONSISTENCY; F0 implementációs kapu nem nyílt meg.

### 63.48. Teljes mezős normalizálás — EDT-001–006 első szelet

Ez a szakasz a 63.41 kártyáit kiegészíti a 25. fejezet hiányzó, különálló mezőivel. Az itt megadott mezők az adott ID kártyájának normatív kiegészítései; a korábbi összevont címkék nem jelentenek külön, teljes mezőt. A fázis azonos a 63.38 szerinti F0 core besorolással; külön priority érték nincs bizonyítva, ezért azt nem találom ki.

#### EDT-001 — külön mezők
- **ID és név:** EDT-001 — Verziózott Page Model / document schema.
- **Belépési pont:** Editor v2 document lifecycle.
- **Műveletek:** létrehozás, validálás, szerkesztés, save, reload és schema-version reject.
- **Domain owner:** EDITOR / Page Model.
- **Kanonikus adatforrás:** Page Model document + pages.content_json/editor_revisions; API round-trip még nyitott.
- **Phase/priority:** F0 core; priority külön kiosztása OPEN.
- **Menu/surface:** Admin → Editor v2; backend page/revision API.
- **Implementation point:** public/editor-v2/core/schema.js; src/core/page-model.ts; src/routes/admin/editor.ts.
- **Negative tests:** unsupported schema version, invalid root, orphan/cycle, cross-site page ID, oversized document.
- **Live/user acceptance:** UNVERIFIED — valódi mentés/reload és böngészős acceptance nincs rögzítve.
- **Known issues:** schema migration/backward compatibility és teljes DB-backed round-trip nincs bizonyítva.
- **Next action:** teljes persistence round-trip és schema compatibility tesztek specifikálása.

#### EDT-002 — külön mezők
- **ID és név:** EDT-002 — Page Model hierarchia és szerkezeti invariánsok.
- **Belépési pont:** Editor v2 canvas, Layers és schema validation.
- **Műveletek:** node add, group/ungroup, duplicate, reparent, reorder, delete és validálás.
- **Domain owner:** EDITOR / Page Model validation.
- **Kanonikus adatforrás:** Page Model rootId/nodes/parentId/children.
- **Phase/priority:** F0 core; priority külön kiosztása OPEN.
- **Menu/surface:** Admin → Editor v2 canvas/Layers; save/publish API boundary.
- **Implementation point:** public/editor-v2/core/schema.js; core/validation.js; core/commands.js.
- **Negative tests:** duplicate ID, orphan, missing child, parent mismatch, cycle, invalid container, root delete/reparent, cross-site page.
- **Live/user acceptance:** UNVERIFIED — a core tesztek nem fedik le az összes UI/API negatív utat.
- **Known issues:** teljes negatív mátrix és server-side save/publish validation parity nincs lezárva.
- **Next action:** invariánsok minden save/publish belépési ponton és a teljes negatív tesztmátrix.

#### EDT-003 — külön mezők
- **ID és név:** EDT-003 — Canonical command-only mutation.
- **Belépési pont:** Editor v2 canvas, Inspector, Layers és toolbar actions.
- **Műveletek:** dokumentummódosítások command registry-n keresztül, validálás, history és dirty-state frissítés.
- **Domain owner:** EDITOR / command engine.
- **Kanonikus adatforrás:** Editor state + Page Model; UI nem birtokol külön dokumentummodellt.
- **Phase/priority:** F0 core; priority külön kiosztása OPEN.
- **Menu/surface:** Admin → Editor v2; public renderer csak olvas.
- **Implementation point:** public/editor-v2/core/commands.js; core/state.js; app.js.
- **Negative tests:** direct mutation megkerülése, tiltott ID/parent/children patch, invalid command payload, locked node, failure utáni állapoteltérés.
- **Live/user acceptance:** UNVERIFIED — minden UI write-handler command coverage nincs bizonyítva.
- **Known issues:** teljes UI handler→command térkép hiányzik.
- **Next action:** direct mutation audit és handlerenkénti command coverage.

#### EDT-004 — külön mezők
- **ID és név:** EDT-004 — Atomic batch és history transaction.
- **Belépési pont:** Editor v2 composite actions/command engine.
- **Műveletek:** batch indítás, atomic/non-atomic végrehajtás, commit és rollback.
- **Domain owner:** EDITOR / transaction + history engine.
- **Kanonikus adatforrás:** Page Model snapshot, selection, history és persistence state.
- **Phase/priority:** F0 core; priority külön kiosztása OPEN.
- **Menu/surface:** Editor v2 belső command layer; UI-ból összetett műveletek.
- **Implementation point:** public/editor-v2/core/commands.js; tests/core.test.js.
- **Negative tests:** középső batch lépés hibája, nested transaction, rollback selection/history/persistence eltérés, túl nagy batch.
- **Live/user acceptance:** UNVERIFIED — composite UI workflow acceptance nincs rögzítve.
- **Known issues:** minden összetett UI művelet atomic policy-ja nincs dokumentálva.
- **Next action:** composite action lista és atomic/non-atomic failure tests.

#### EDT-005 — külön mezők
- **ID és név:** EDT-005 — Undo/redo history.
- **Belépési pont:** Editor v2 history controls és keyboard shortcuts.
- **Műveletek:** undo, redo, history limit, selection snapshot restore.
- **Domain owner:** EDITOR / history state.
- **Kanonikus adatforrás:** state.history + Page Model before/after snapshots.
- **Phase/priority:** F0 core; priority külön kiosztása OPEN.
- **Menu/surface:** Editor v2 canvas/toolbar/keyboard.
- **Implementation point:** public/editor-v2/core/state.js; core/commands.js; tests/core.test.js.
- **Negative tests:** üres history, limit túllépése, invalid transaction, redo ág törlése új mutation után, nagy dokumentum.
- **Live/user acceptance:** UNVERIFIED — toolbar/keyboard és browser acceptance nincs rögzítve.
- **Known issues:** memóriahasználat, save/reload history policy és minden inputútvonal paritása nyitott.
- **Next action:** history edge-case matrix és UI/keyboard tests.

#### EDT-006 — külön mezők
- **ID és név:** EDT-006 — Selection state és fókuszszinkron.
- **Belépési pont:** Editor v2 canvas, Layers, Inspector és keyboard/touch controls.
- **Műveletek:** set/clear selection, multi-select, panelváltás, delete/undo utáni helyreállítás.
- **Domain owner:** EDITOR / selection state.
- **Kanonikus adatforrás:** state.selection ids/primaryId és selectedNodes().
- **Phase/priority:** F0 core; priority külön kiosztása OPEN.
- **Menu/surface:** Editor v2 canvas/Layers/Inspector; mobile action bar.
- **Implementation point:** public/editor-v2/core/state.js; core/commands.js; app.js.
- **Negative tests:** stale/deleted node, primaryId nincs az ids listában, cross-page selection, locked/root selection edge cases.
- **Live/user acceptance:** UNVERIFIED — canvas↔Layers↔Inspector/touch/keyboard E2E nincs rögzítve.
- **Known issues:** panel fókusz-visszaállítás és minden inputmód selection parity nem bizonyított.
- **Next action:** teljes selection/focus E2E matrix keyboard, pointer és touch esetekkel.

**Az eredeti ellenőrzés pillanatképe:** EDT-001–006 kiegészítő státuszmezői elkészültek, de a 26.1 szerinti 17 mező nem volt teljesen lefedve. Azóta EDT-007 teljes kártyája a 63.49-ben, EDT-008 teljes kártyája a 63.50-ben szerepel; runtime acceptance továbbra is nyitott. A további kártyamunka csak az adott aktív, implementálandó funkció 63.21 szerinti B kapujához kötelező, nem a teljes termékscope előzetes újraírása. A 44 kártya egyike sem tekinthető automatikusan PASS-nak a dokumentálás miatt.

### 63.49. Teljes mezős normalizálás — EDT-007

**Hatókör:** egyetlen funkciókártya, EDT-007. Ez a lépés a 26.1 szerinti 17 külön mezőt rögzíti; a forráskód-olvasásból nem következtet böngészős PASS-ra.

#### EDT-007 — külön mezők

- **ID és név:** EDT-007 — Canvas viewport, zoom, pan és content extent.
- **Felhasználói eredmény:** a felhasználó nagyíthatja, mozgathatja és a teljes tartalomhoz igazíthatja a vásznat úgy, hogy az oldal szerkeszthető részei ne váljanak elérhetetlenné.
- **Belépési pont:** Admin → Editor v2 → canvas viewport; zoom/pan/fit vezérlők és viewport-resize események.
- **Műveletek:** zoom növelése/csökkentése, pan, fit-to-content, viewport átméretezése, üres/rövid/hosszú dokumentum megjelenítése. A vezérlők pontos billentyűparancsai és érintéses gesztusai még ellenőrizendők.
- **Domain owner:** EDITOR / viewport és canvas interaction; a Page Model szerkezeti adatainak kanonikus gazdája továbbra is az Editor Page Model.
- **Kanonikus adatforrás:** Editor v2 lokális viewport state; content extent a Page Modelből számított tartomány. A viewport állapot dokumentumba mentése nem feltételezhető, amíg külön nincs igazolva.
- **Séma és invariánsok:** a zoom véges és pozitív; a pan/extent számítás nem eredményezhet NaN/Infinity értéket; a content extent vegye figyelembe a dokumentum tartalmát és a szükséges paddinget. Nagy dokumentum és extrém zoom erőforráskorlátja nyitott.
- **Jogosultság:** az Editor csak az aktuális, jogosult oldal kontextusát jelenítheti meg; a viewport állítása nem kerülheti meg a page/site ownership ellenőrzést.
- **API/command szerződés:** a vizsgált forrásban a `computeCanvasMinHeight` és a canvas extent/viewport logika található; a fit/pan/zoom teljes command-szerződése, persistence és hiba-visszajelzés nincs teljesen igazolva. Nincs külön backend mutation elvárás pusztán a viewport mozgatásához.
- **Függőségek:** EDT-001 (Page Model), EDT-006 (selection/fókusz), EDT-025 (preview/viewport kapcsolat), EDT-035–036 (billentyűzet és mobil/accessibility); blokkolóként a viewport geometry stabilitása, nem blokkolóként a személyre szabott viewport-preferencia.
- **UI-állapotok:** kezdeti betöltés, üres oldal, rövid és magas tartalom, zoomolt nézet, pan folyamatban, viewport resize, mobil safe-area, hibás/extreme geometry és visszaállítás/fit. A loading/error state külön UI-jelzése ellenőrizendő.
- **Biztonsági és adatvédelmi határ:** nincs önálló PII/secret domain; a szélsőséges zoom, túl nagy node-szám és koordináta-tartomány ellenőrzése stabilitási követelmény. A viewport nem hozhat létre backend oldali hozzáférést.
- **Tesztcsomag:** meglévő `public/editor-v2/core/canvas-extent.js` és kapcsolódó `tests/core.test.js` vizsgálata alapján van unit tesztalap; teljes browser/responsive, pointer/touch/keyboard és production smoke eredmény ehhez a kártyához nincs rögzítve.
- **Elfogadási forgatókönyv:** üres, normál és hosszú oldal megnyitása → zoom/pan/fit → viewport átméretezése → kiválasztott elem elérhetőségének és koordináta-helyességének ellenőrzése → billentyűzetes és érintéses útvonal → oldal újranyitása. Elvárt: nincs eltűnő/elérhetetlen tartalom, hibás geometria vagy téves sikerjelzés.
- **Bizonyíték:** forrásvizsgálat: `public/editor-v2/app.js`, `public/editor-v2/core/canvas-engine.js`, `public/editor-v2/core/canvas-extent.js`, `public/editor-v2/core/state.js`, `tests/core.test.js`. A jelen kártyához konkrét CI-run, böngészős E2E vagy felhasználói elfogadás nincs hozzárendelve; ezért PASS nem állítható.
- **Visszaállítás:** viewport-fit/reset a helyreállítási út; ha a viewport lokális state, nincs dokumentummódosítás, amit undo-val kellene visszavonni. A viewport-preferencia mentése esetén reset/default fallback és hibás preference recovery külön acceptance-t igényel.
- **Státusz és következő lépés:** **IN PROGRESS / UNVERIFIED**. Következő lépés: a kártyához tartozó browser/device acceptance-mátrix pontosítása és bizonyíték rögzítése; utána EDT-008 normalizálása ugyanilyen 17 mezővel.

**Szeletállapot:** EDT-007 kártyája mezőszinten részletezve; a funkció runtime acceptance-e nyitott. Ez nem zárja le az EDT-007-et, az EDT modult vagy a tervlezárási kaput.

### 63.50. Teljes mezős normalizálás — EDT-008

**Hatókör:** kizárólag az EDT-008 funkciókártya. A leírás az EDT-007 17 mezős formáját követi. A forráskód jelenléte nem jelent böngészős acceptance PASS-t, és nem indít implementációt.

#### EDT-008 — külön mezők

- **ID és név:** EDT-008 — Canvas drag/drop mozgatás.
- **Felhasználói eredmény:** a felhasználó a vásznon kijelölt, mozgatható elemet egérrel vagy támogatott érintéses/beviteli móddal a kívánt helyre mozgathatja, és az új pozíció a kanonikus Page Modelben marad mentés és újranyitás után is.
- **Belépési pont:** Admin → Editor v2 → canvas → kiválasztó eszköz aktív állapotában egy nem root és nem zárolt node mozgatása.
- **Műveletek:** pointerdown → pointer capture → pointermove → pointerup; mozgási küszöb kezelése; zoommal korrigált koordinátaszámítás; ideiglenes vizuális pozíciófrissítés; végleges pozíció responsive.set commandon keresztüli rögzítése; megszakított művelet elvetése és renderből történő helyreállítás.
- **Domain owner:** EDITOR / canvas interaction. A szerkezeti és responsive pozícióadat tulajdonosa továbbra is az Editor Page Model és a canonical command réteg; a canvas DOM nem lehet önálló adattároló.
- **Kanonikus adatforrás:** az aktuális Page Model node-ja és az aktív state.viewport.device responsive rétege. A drag közbeni DOM left/top csak ideiglenes preview; sikeres befejezéskor a responsive.set parancsnak kell rögzítenie az x/y értéket. A böngésző újrarenderelésekor a modellből kell visszaállnia.
- **Séma és invariánsok:** root node nem mozgatható; zárolt node nem mozgatható; a művelet csak az aktív oldal és viewport kontextusában futhat; a zoommal korrigált delta véges koordinátákat adjon; a drag nem módosíthatja észrevétlenül a nem aktív breakpointot. A jelenlegi kódban a snap 8 px-es lépésre kerekít, ennek termékdöntése és a pontos pozíciómegőrzés viselkedése nyitott.
- **Jogosultság:** csak már hitelesített és az adott oldal/site szerkesztésére jogosult Editor-munkamenet végezheti a műveletet; a kliensoldali drag önmagában nem adhat jogosultságot mentéshez. A page/site ownership és expected-version ellenőrzés a szerveroldali mentési útvonal feladata.
- **API/command szerződés:** a vizsgált public/editor-v2/app.js beginCanvasDrag, moveCanvasDrag és finishCanvasDrag útvonalat tartalmaz; a véglegesítés command('responsive.set', { nodeId, device, patch: { x, y } }) hívást használ. A pointer közbeni ideiglenes DOM-módosítás nem helyettesíti a commandot. A touch útvonal jelenleg külön mobil selection/long-press kezelést használ; a teljes érintéses drag nincs igazolva. A parent/container drop és valódi drag-and-drop reparent szerződés külön hierarchiaművelet, nem következtethető ki az egyszerű pozíciómozgatásból.
- **Függőségek:** EDT-001 (Page Model), EDT-003 (canonical command-only mutation), EDT-006 (selection), EDT-007 (viewport/zoom), EDT-009 (geometry/resize), EDT-013 (selection sync), EDT-014 (lock), EDT-023–026 (responsive property és breakpoint), EDT-028 (save/reload). Blokkoló a canonical position update és a pointer-cancel adatvesztésmentes viselkedése; a touch drag és keyboard move acceptance külön nyitott.
- **UI-állapotok:** nincs kiválasztott node; root node; locked node; kiválasztó eszköz inaktív; drag indulás előtti küszöb; aktív drag; pointer capture elvesztése/cancel; node törlése vagy selection-váltás közbeni művelet; command-hiba; viewport/zoom változás; aktív breakpoint; mentés folyamatban; mobil touch/long-press; sikeres véglegesítés és megszakítás utáni visszaállítás.
- **Biztonsági és adatvédelmi határ:** a drag nem férhet hozzá másik site/page adataihoz, és nem írhat közvetlenül D1-be vagy más domain táblába. A koordináták és a DOM input nem megbízhatóak; a Page Model schema/command validációt meg kell tartani. Nem lehet a vizuális sikerjelzés a szerveroldali mentés sikerének bizonyítéka.
- **Tesztcsomag:** a vizsgált public/editor-v2/app.js pointer handler alapot mutat, a public/editor-v2/core/commands.js canonical command végrehajtást és lock ellenőrzést tartalmaz. A teljes drag-specifikus browser E2E, touch drag, pointercancel recovery, zoom-mátrix, responsive breakpoint isolation, nested/ancestor-lock és save/reload acceptance eredménye nincs ehhez a kártyához csatolva. A meglévő forrás önmagában nem tesztfutási bizonyíték.
- **Elfogadási forgatókönyv:** ugyanazt a nem zárolt node-ot mozgasd meg 100%, 50% és nagyított nézetben; ellenőrizd az egérrel végzett dragot, a pointercancel miatti megszakítást, a locked/root node tiltását, a desktop/tablet/mobile responsive pozíciók elkülönülését, majd mentsd, töltsd újra az oldalt, és ellenőrizd a pozíciót a canvasban és a Page Modelben. Külön negatív eset: parancshiba esetén a DOM ne mutasson hamis végleges pozíciót. Touch drag és keyboard move csak akkor fogadható el, ha külön igazolt működő útvonal van hozzá.
- **Bizonyíték:** forrásvizsgálat: public/editor-v2/app.js (pointer handlers, drag state, responsive.set), public/editor-v2/core/canvas-engine.js (responsive style/geometry feloldás), public/editor-v2/core/commands.js (canonical mutation és locked-node guard). A kártyához konkrét CI-run, böngészős E2E artifact vagy felhasználói acceptance log nincs rögzítve; ezért PASS nem állítható.
- **Visszaállítás:** pointercancel vagy command-hiba esetén a műveletet megszakítottnak kell tekinteni, a canvas DOM-ot a kanonikus Page Modelből újra kell renderelni, és nem szabad sikert jelezni. Ha a command már sikeresen commitolta az új pozíciót, a visszavonás a canonical history undo útján történjen; a DOM közvetlen visszaírása nem lehet külön rollback-adatforrás.
- **Státusz és következő lépés:** **IN PROGRESS / UNVERIFIED**. Következő lépés: a drag acceptance-mátrix rögzítése pointer/mouse, touch, zoom, breakpoint, lock, cancel és save/reload dimenziókra; a hiányzó touch/keyboard útvonalat explicit gapként meg kell tartani. Ezután következhet EDT-009 teljes mezős normalizálása.

**Szeletállapot:** EDT-008 17 külön mezője dokumentálva és a jelenlegi kódhoz kötve; runtime acceptance nyitott. Ez nem zárja le az EDT-008-at, az Editor modult vagy a teljes tervlezárási kaput.

### 63.50.1. Kanonikus Schedule szerződés — SCH-001, SCH-007–011, WEB-016, EDT-020

**Státusz: SPECIFICATION DRAFT / NOT PASS.** Ez a kártya a 10. fejezet 22 mezőjét alkalmazza egy többfelületű, különösen hibaveszélyes domainhatárra. A konkrét route-, D1-séma- és provider-válaszmezőket csak forráskód-vizsgálat után szabad véglegesíteni; itt nem állítunk ellenőrzött implementációt.

1. **ID és név:** `SCH-001` Schedule CRUD, `SCH-007` Twitch sync/manual override, `SCH-008` sync status/retry/audit, `SCH-009` next-stream/countdown, `SCH-010` canonical public projection, `SCH-011` Editor block binding, `WEB-016` public route, `EDT-020` dynamic block configuration.
2. **Felhasználói cél:** a creator egy helyen szerkeszti az adásrendet; a Dashboard, a publikus oldal és az Editor ugyanazt az érvényes, site-hoz kötött adatot jeleníti meg.
3. **Belépési hely:** Creator Center → Stream Studio → Adásrend; Website → Visual Editor → Schedule block; publikus schedule oldal. Az Editor csak blokkbeállítást kezel.
4. **Működés és eredmény:** create/update/cancel/delete → kanonikus domain validáció → D1 tranzakció → publikus projekció és cache frissítése; provider import → deduplikáció és konfliktus/override döntés → audit; next-stream csak a megfelelő állapotú és időzónában normalizált rekordokból.
5. **Kanonikus tulajdonos:** `SCH` a schedule események és életciklus gazdája; `INT` az OAuth/provider adapter és scope; `WEB` az oldal shell; `EDT` a blokk konfiguráció; `DYN` a megengedett adatbinding; `SEC` a cross-site jogosultsági invariáns.
6. **Adatforrás:** `schedule_items` kanonikus D1 eseménytábla; a provider adat külső, nem második szerkeszthető adatbázis; a publikus/cache adat csak származtatott, érvényességi jelzővel ellátott projekció. A pontos oszloplista **CODE VERIFICATION REQUIRED**.
7. **Olvasó/író felületek:** író kizárólag az engedélyezett SCH domain API és ellenőrzött INT sync adapter; olvasó Admin naptár, Dashboard, WEB-016 és Editor preview a kanonikus projekción keresztül. Az Editor nem ír közvetlenül `schedule_items` rekordot.
8. **Jogosultság/scope/ownership:** minden módosító és privát lekérdezés hitelesített, szerepkör- és site-scope-ellenőrzött; a publikus projekció csak publikálható mezőket és rekordokat ad; kliensoldali `site_id` nem bizalmi forrás.
9. **Request/response/schema/status/error contract:** javasolt domainműveletek `list/get/create/update/cancel/delete/previewProjection/syncStatus/retrySync`; kötelező `site`, `id`, időzóna, start/end, lifecycle, expected-version és provider-link validáció; 400 schema, 401 unauthenticated, 403 forbidden, 404 not found vagy maszkolt cross-site, 409 revision/provider conflict, 429 throttled, 5xx retryable outage. **Ezek logikai szerződéscélok, nem ellenőrzött HTTP endpointok.**
10. **Függőségek:** `SCH-002–006` listák/DST/recurrence/state/conflict, `INT-010–011` Twitch kapcsolat, `SEC-002–003` ownership, `DYN-005–007` runtime és published-only, `WEB-016`, `EDT-020`, `OPS-002` auditkorreláció.
11. **Hibamódok:** provider outage, stale sync, duplikált provider event, lejárt token, DST gap/fold, ismétlődő esemény egyedi módosítása, párhuzamos szerkesztés, törölt game reference, cache-invalidation késése.
12. **Security/privacy/secret/retention:** provider token csak secret/INT tárolóban; publikus output allowlist; privát creator-metaadat nem publikálható; audit retention és provider payload-redaction külön döntendő.
13. **UI-állapotok:** loading/empty/error/stale/offline/partial sync, pending edit, conflict, cancelled/postponed/live/completed, permission denied, save succeeded but projection refreshing; minden állapotnak szöveges visszajelzés kell.
14. **Automatizált pozitív tesztek:** site-scope CRUD, időzóna/DST, recurrence edit scope, next-stream számítás, kézi override és provider update, publikus projection parity, Editor block config és read-only data boundary.
15. **Negatív tesztek:** idegen site rekord olvasás/írás, tokenhiány, lejárt scope, duplikált webhook, 409 stale version, provider retry utáni duplikáció, DST-ambiguitás, draft/private mezőszivárgás, Editor közvetlen eseményírás, cache stale fallback félrevezető státusz.
16. **Live acceptance:** staging/production D1 migration és FK/ownership preflight; Twitch sandbox/valós capability; mentés→frissítés→publikus projekció ellenőrzése; éles adatot érintő teszt csak megfelelő védelemmel.
17. **User acceptance:** Creator Centerben esemény létrehozása/módosítása → Editor blokkba kötés → előnézet → publikus megjelenítés; telefon/tablet, billentyűzet, timezone és hibaüzenetek külön ellenőrzése.
18. **Rollback/recovery:** migrációs rollback/restore terv; import auditból ismételhető idempotens sync; cache visszaállítás/invalidation; mentés előtti revízió visszaállítása adatvesztés nélkül.
19. **Státusz:** `SPECIFICATION DRAFT / NOT PASS`; a teljes feature-család futó implementációját nem igazoltuk.
20. **Bizonyíték:** a 24., 49., 63.0.6 és jelen 63.50.1 fejezet követelményei dokumentáltak; **nincs ide csatolt konkrét route-, DB-, CI-, browser-, runtime- vagy provider-bizonyíték**.
21. **Tervfrissítés és next point:** forráskód alapján rögzítendő a tényleges `schedule_items` séma, route, provider sync/override precedence, fázis és feature-specifikus tesztazonosító; eltérés esetén ugyanitt javítandó, nem külön roadmapben.
22. **Regressziós hatás:** Admin schedule, Dashboard live/next-stream, publikus schedule, Editor block, Twitch sync, localization/timezone, permissions, cache és SEO/indexing.

**Nyitott döntések:** (a) Twitch kézi override mezőnkénti precedence; (b) recurrence exceptions és DST normalizálás konkrét sémája; (c) expected-version/ETag mechanizmus; (d) publikus projection mező-allowlist; (e) soft delete/retention; (f) provider capability hiányának fallbackje. Ezeket bizonyíték nélkül nem jelöljük megoldottnak.

### 63.50.2. Schedule szerződés ↔ GitHub-forráskód — bizonyított eltérésjegyzék (2026-10-14)

**Vizsgálati határ:** a `v2/foundation` ágon ténylegesen megnyitott `src/index.ts`, `src/routes/admin/schedule.ts`, `src/routes/admin/twitch-schedule-sync.ts`, `src/routes/public/schedule.ts`, `src/core/schedule-read.ts`, `src/core/schedule/twitch-sync.ts`, `src/core/site-context.ts`, `src/core/domain/contracts.ts` fájlok. **Ez statikus kódolvasás, nem futtatott CI/browser/production teszt.** A nem megnyitott fájlokról nem állítunk sem hiányt, sem működést.

| Funkció / határ | Kódban igazolt tény | Tervkövetelményhez viszonyított eltérés / ellenőrzés |
| --- | --- | --- |
| `SCH-001` Admin CRUD | `/api/admin/schedule` GET/POST/PUT/DELETE; a műveletek `schedule_items` rekordot olvasnak/írnak; `site_id` feltétel; `editor` szerepkör; create/update/delete audit statement | A PUT előtt van `id + site_id` lookup, de nincs megfigyelt `expected-version` vagy compare-and-swap; párhuzamos írás elvesztésének negatív tesztje és megoldása **OPEN** |
| `SCH-001/003/005` validáció | cím/platform/időpont/status/url/notes ellenőrzés; megengedett státuszok: scheduled/live/completed/cancelled; Date.parse start/end és end>start | A jelenlegi Admin request nem fogad külön IANA időzónát, recurrence exceptiont vagy postponed státuszt; `SCH-003–005` teljes körű implementációja **NOT VERIFIED** |
| `SCH-007/008` Twitch sync | `/api/admin/twitch/schedule-sync` POST; connectionId/startAt/endAt; hitelesítés+editor role; `syncTwitchSchedule` a `twitch_connections` rekordot `id,user_id,site_id` alapján ellenőrzi; hibakódok 409/404/401/429/502 és `source_empty` válasz | A provider sync magja a `src/core/schedule/sync.ts` és adapter fájlokban van; azok részletes konfliktus/override/idempotencia bizonyítéka **még külön ellenőrzendő** |
| `SCH-010` publikus projekció | `/api/public/schedule` → `readPublicSchedule`; site-filter, status-filter, platform-filter, order, 1–50 limit, upcoming/all/next; cancelled kizárás; response id/title/platform/start/end/status/url/notes | A publikus allowlist jelenleg `notes` mezőt is visszaad. **Adatvédelmi termékdöntés szükséges:** a notes publikus mező vagy belső szerkesztői megjegyzés? Amíg nincs eldöntve, a publikus adatminimalizálás **OPEN** |
| `SCH-009` következő stream | `mode=next` limit=1, alapértelmezésben scheduled/live és `starts_at >= datetime('now')` | A már elkezdődött `live` esemény a múltbeli start miatt kimaradhat a next/upcoming lekérdezésből. Külön live-first/ongoing időablak acceptance és teszt **szükséges** |
| `SEC-003/TEAM` site context | `getCanonicalSiteContext()` jelenleg a `DEFAULT_SITE_ID = "site-default"` konstansra épül; az Admin és public schedule ezt használja | Ez **single-site alap**, nem bizonyított dinamikus workspace/tenant választás. Multi-site izolációra külön szerveroldali identity→site authorization szükséges; kliens által beküldött site ID nem elfogadható |
| `SCH` domain contract | `ScheduleEvent` típus tartalmaz `gameProfileId`, `source`, `sourcePresence`, recurrence jelzőt és sync-metaadatot; `normalizeScheduleEvent` dátumot normalizál | A publikus/Admin route által kezelt mezők ennél szűkebbek; a típusszerződés **nem bizonyítja**, hogy a UI/API minden domaintulajdonságot írni és olvasni tud |
| `WEB-016/EDT-020/SCH-011` felületek | Az API-projekció létezik, a Worker `/p/*` oldalshellt szolgál ki | A konkrét Schedule Editor block runtime és Admin→Editor→public E2E útvonal **nem volt ebben a kódkörben megnyitva**, ezért nem PASS |

**Elsődleges, végrehajtás előtti tervdöntések:** (1) publikus `notes` jelentése és adatminimalizálás; (2) folyamatban lévő live események elsőbbsége a next/upcoming nézetben; (3) optimista konkurenciavédelem és 409; (4) timezone/recurrence modellezés; (5) single-site → multi-site átmenet hitelesítési szerződése. Mindegyik az eredeti `SCH`/`SEC`/`WEB`/`EDT` azonosítók alá tartozik, **nem új párhuzamos funkció**.

**Következő forrásellenőrzés:** `src/core/schedule/sync.ts`, `src/core/schedule/twitch-adapter.ts`, releváns `migrations/*.sql`, a tényleges Editor schedule blokk és a schedule-specifikus tesztek. A meglévő kódot előbb értékelni kell, nem szabad automatikusan újraírni. A jelen kapu **IN PROGRESS / NOT PASS**; nincs implementációs módosítás vagy deploy.

### 63.50.3. Twitch schedule sync, adatmodell és migráció — második kódellenőrzési köteg (2026-10-14)

**Ellenőrzött konkrét fájlok:** `src/core/schedule/sync.ts`, `twitch-adapter.ts`, `mapper.ts`, `types.ts`, `migrations/0013_schedule_source_sync.sql`, `migrations/0015_site_ownership_foundation.sql`. Ez **statikus forrásbizonyíték**, nem éles működés vagy tesztfutás.

| Kapcsolódó ID | Kód alapján bizonyított működés | Kockázat, eltérés, kötelező további acceptance |
| --- | --- | --- |
| `SCH-007/008` sync lock | `beginSync` a `schedule_sync_state` rekordot `running` állapotba teszi csak ha még nem running; ütközésnél `SCHEDULE_SYNC_ALREADY_RUNNING`; `finishSync` állapotot, számosságot és hibakódot rögzít | A látható locknak nincs lejárata/lease-e; megszakadt Worker után a `running` beragadhat. Timeout/recovery és párhuzamos próbák tesztje szükséges |
| `SCH-007` import idempotencia | `idx_schedule_source_identity` UNIQUE (`source,source_account_id,source_id`); `ON CONFLICT` upsert | Ugyanazt a rekordot nem duplikálja normál esetben; de a konfliktusfrissítés `title/platform/starts_at/ends_at/status/url` mezőket felülírja. **Kézi override elsőbbség nincs bizonyítva**; a provider és kézi változtatások tulajdonosi szabályát explicit rögzíteni kell |
| `SCH-007/008` részleges sync | A `syncCanonicalTwitchSchedule` egyenként upsertel, majd missing reconciliationt végez; a provider-felvétel után hiba esetén `failed` státusz kerülhet a sync state-be | A teljes import+reconcile nem egyetlen atomikus tranzakció; részleges import maradhat. Retry/idempotencia, checkpoint és részleges állapot UI acceptance kell |
| `SCH-007/008` hiányzó provider event | `reconcileMissing` az adott site/account/window jelen lévő, de a snapshotból hiányzó source ID-kat `source_presence='missing'`-re jelöli, nem törli | A publikus `readPublicSchedule` lekérdezésben nincs `source_presence` szűrő. A missing jelölésű, de scheduled státuszú esemény továbbra is megjelenhet; kötelező termékdöntés és negatív teszt |
| `INT-011/SCH-007` provider adapter | Helix schedule API, token+Client-Id, lapozás 25-ös mérettel, maxPages korlát, időablakra szűrés, input parse és HTTP hibamapping | `parseSegment` a `canceled_until`, `category`, `is_recurring` mezőket a jelenlegi formában típusellenőrzi; a hiányzó opcionális mezők `undefined` értéke elutasítást okozhat. Valós provider fixture és optional-field contract teszt szükséges |
| `SCH-004` recurrence | A mapper és D1 `is_recurring` jelzőt megőriz; a Twitch `canceled_until` alapján cancelled státuszt képez | A recurrence sorozat/exception, „csak ez az alkalom” vs „teljes sorozat” szerkesztés **nem igazolt** a jelzőtől; nem PASS |
| `SEC-003/SCH-001` site identity | A 0015 migráció `site_id` mezőt ad és `site-default` backfillt végez; a sync identity ellenőrzés site-hoz kötött | A 0013 UNIQUE kulcsa nem tartalmaz `site_id`-t, a `schedule_sync_state` sem site-scoped oszlopot használ. Multi-site bevezetés előtt source account ownership/uniqueness invariánst és migrációs tervet bizonyítani kell; nem állítjuk, hogy jelenleg cross-site exploit bizonyított |
| `SCH-008` sync állapot | 0013 migration `schedule_sync_state` státusz, window, timestamps, seen count, error fields tárolását létrehozza | A `source_empty` kivétel ágon a sync state rögzíti a státuszt, de a hiányzó események kezelése nem ugyanaz, mint a sikeres üres snapshot. Empty vs provider error biztonságos döntés és UI visszajelzés külön tesztelendő |

**Kötelező következő döntési sorrend a meglévő ID-k alatt:** (1) publikus `source_presence` és `notes` szabály; (2) live-first `next` lekérdezés; (3) manual/provider mező-override policy; (4) lease és részleges import recovery; (5) recurrence és DST; (6) multi-site source identity; (7) provider optional-field fixture tesztek. Minden esetben a már működő kód javítása/bővítése az első lehetőség; nincs második schedule rendszer, nincs implementáció a nyitott tervkapu alatt.

**Bizonyítékhiány:** CI/test/browser/live/production ellenőrzés nem futott ebben a körben; a migrációs fájlok létezése nem bizonyítja az éles D1 sémát. A 63.50.1 specifikáció **SPECIFICATION DRAFT / NOT PASS** marad, a teljes tervkapu **IN PROGRESS / NOT PASS**.

### 63.50.4. Website / Editor v2 / publish: második domainhatár forrásaudit (2026-10-14)

**Statikus forrásbizonyíték:** `src/routes/admin/editor.ts`, `src/routes/admin/pages.ts`, `src/routes/public/pages.ts`, `src/index.ts`. A dokumentált tények nem jelentenek runtime/CI/browser PASS-t.

| Érintett domain | Bizonyított meglévő alap | Konkrét eltérés / regressziós követelmény |
| --- | --- | --- |
| `WEB` oldalak | `/api/admin/pages` list/create/metadata update/delete; site-scope, editor role, slug validáció; utolsó oldal törlésének védelme; audit | A `PATCH` sort-order csere csak a legközelebbi szomszédot keresi, nem általános tetszőleges pozícióra mozgatást; sorrend invariáns, párhuzamos módosítás és UI expectation tesztelendő |
| `EDT` Editor v2 | `/api/admin/editor` GET/POST/PUT, kanonikus Page Model validáció, revíziók és rollback; `/admin/editor` v2 asset | A revízióütközés ellenőrzése opcionális `expectedVersion` paraméterhez kötött. Ha hiányzik, nincs látható 409 védelem; kötelező vagy explicit legacy-compatible write policy és konkurenciateszt szükséges |
| `EDT/WEB` mentés–publikálás | Editor POST menti `content_json` draftot; `publish=true` esetén `published_content_json` snapshotot és revision ID-t ír; `unpublish` külön akció | `pages.ts PATCH` metadata változtatáskor a már publikált oldal `published_content_json` snapshotját is frissíti. A „publikált snapshot csak explicit publish után változik” invariánssal ez **ütközhet**; dönteni kell, mely metadata változás publikálódhat automatikusan |
| `WEB` publikus read | `/api/public/pages` publikált oldalt alapból `published_content_json` alapján olvas, `preview=1` editor-auth mellett draftot | A response `title/slug/description` mezői a `pages` aktuális sorából származnak, miközben a `content` a publikált snapshotból jön. Draft metadata változás esetén publikus meta/content eltérés lehetséges; publikált metaadat projekció és regressziós teszt szükséges |
| `EDT` restore | Editor PUT a régi revízióból új revíziót készít, auditál és a draft `content_json` mezőt módosítja | A restore nem módosítja automatikusan a publikált snapshotot: ez **helyes draft/publish határ lehet**, de UI-ban és acceptance-ben explicit megkülönböztetés kell |
| `WEB/EDT` ownership | Oldal és Editor route-ok a `getCanonicalSiteContext()` fix `site-default` site azonosítót használják; DB-lekérdezéseknél site-filter van | Multi-site tenant selection és jogosultsági mapping nem bizonyított; `editor_revisions` olvasás page ID-hez kötött, előtte site-scoped oldalellenőrzéssel; site-identity tervkapu marad nyitott |
| `WEB` publikus URL | Worker `/p/*` oldalshell és régi `*.html` útvonalak redirectje; `/admin/home` → `/admin`; `/admin/editor` a v2 UI | A tényleges canonical/redirect, sitemap, robots és SEO teljes elfogadása külön browser/HTTP evidence-et igényel, a routerkód önmagában nem elég |

**Kötelező termékdöntés a végső tervhez:** egyetlen kanonikus page domain maradjon. A `page` draft és a `published` projekció elkülönítése legyen következetes **a metaadatokra is** (title, slug, description, SEO, navigation). A Visual Editor kizárólag a vizuális Page Modelt és megengedett komponensbeállításokat kezelje; a globális brand, média, adásrend és integráció saját tulajdonosmoduljában maradjon. A másik UI belépési pont ugyanarra a kanonikus resource-ra mutasson.

**Konkrét nyitott acceptance:** (1) draft cím/slug/description változás nem szivárog-e a publikált oldalra; (2) metadata PATCH és Editor POST között revízióütközés; (3) rollback nem publikál véletlenül; (4) oldalsorrend tetszőleges mozgatása; (5) publikált snapshot és publikus meta konzisztencia; (6) régi URL-ek 301/302 és canonical; (7) cross-site negatív tesztek. A forráskódot meg kell őrizni és szükség esetén célzottan bővíteni; **a terv auditja nem jogosít automatikus kód-átírásra**.

**Állapot:** `WEB/EDT` részletes statikus forrásellenőrzés elkészült e fájlokra; runtime és végleges szemantikai kapu **NOT PASS**.

### 63.50.5. Site Settings, public settings és Schedule Editor blokk — harmadik forrásaudit (2026-10-14)

**Megnyitott források:** `src/routes/admin/settings.ts`, `src/routes/public/site-settings.ts`, `src/core/editor-validation.ts`, továbbá a korábban ellenőrzött `src/core/schedule-read.ts` és `src/routes/public/schedule.ts`. Az alábbi megállapítások kizárólag statikus kódolvasással bizonyítottak.

| ID és határ | Ellenőrzött tény | Követelmény / további teendő |
| --- | --- | --- |
| `SET/TEAM/SEC` beállítások | Admin GET/PUT `site_settings` táblából `key='site'` alapján, admin szerepkörrel; `siteName` és `tagline` validáció, audit | A route nem használ `site_id`-t; a 0015 migráció is legacy/global site_settings szerződést jelez. A több-site modellhez **nem szabad** a jelenlegi globális rekordot változtatás nélkül tenant-specifikusnak tekinteni. Kanonikus site-scoped settings migration/readers/writers audit szükséges |
| `WEB/SET` publikus beállítás | `/api/public/site-settings` a `site` rekordból siteName/tagline allowlistet ad, `Cache-Control: no-store`; hibás JSON esetén alapérték | Az Admin hibás JSON-nál 500-at, a publikus útvonal fallbacket ad: a hiba/diagnosztika/monitoring eltérő viselkedését dokumentálni és tesztelni kell |
| `EDT-020/SCH-011` schedule block publish | `validatePublishDocument` a `schedule` node `props.schedule` configját ellenőrzi: `version=1`, upcoming/all/next, 1–50 limit, status/platform/order, showTitle/showPlatform/showTime/showEndTime/showStatus/showNotes/showLink, emptyText | Ez **konkrét Schedule Editor blokk konfigurációs szerződés**: a korábbi 63.50.2 „Editor runtime nem ellenőrzött” megállapítás mellett immár a publikálási validátor bizonyított. A tényleges DOM/runtime rendering és API-hívás még külön nyitott |
| `SCH/WEB/SEC` notes láthatóság | A schedule config tartalmaz `showNotes` kapcsolót, de a publikus schedule API válaszában a `notes` mező ettől függetlenül szerepel | A megjelenítési kapcsoló **nem adatvédelmi jogosultság**. A notes domain-osztályozását és szerveroldali public allowlistet külön el kell dönteni és negatív tesztelni |
| `EDT/QA` publish validáció | A validátor ellenőrzi a Page Model root/node/parent-child gráfot, elérhetőséget és a schedule konfiguráció alakját | Nem bizonyít teljes hozzáférhetőségi, biztonsági, embed-sanitization, WCAG vagy minden blokktípus szemantikai megfelelőséget; a `QA-005` és `SEC` kapuk külön nyitottak |

**Rögzített architektúradöntés:** a `site_settings` jövőbeli site-scoped változata is **egyetlen** beállítási erőforrás legyen, nem új párhuzamos globális/tenant adatforrás. A migráció előtt a meglévő fogyasztókat, fallbackeket, cache-t, authot és publish-hatást fel kell térképezni. Az Editor Schedule blokk csak megjelenítési konfigurációt tárol; nem kap külön esemény-CRUD tulajdonjogot.

**Nyitott acceptance:** site-váltás és tenant-izoláció; hibás JSON és recovery; publikus site meta frissülése; showNotes=false mellett API-szintű adatminimalizálás döntése; schedule blokk előnézet/publish parity; invalid config negatív tesztek. **IN PROGRESS / NOT PASS**, nincs kódmódosítás.

### 63.50.6. Tesztbizonyíték és tenant-jogosultság — negyedik forrásaudit (2026-10-14)

**Ellenőrzött fájlok:** `tests/site-ownership-contract.test.js`, `tests/domain-contracts.test.js`, `src/core/auth/require-auth.ts`, `src/core/twitch-site-ownership.ts`. **Csak a tesztek forrását olvastuk; futtatott PASS nincs ebből a körből.**

| Terület | Konkrét forrásbizonyíték | Bizonyíték korlátja / kötelező következő kapu |
| --- | --- | --- |
| `SEC/TEAM` auth | A session query a `sessions` és `users` táblából aktív, nem lejárt tokent és aktív felhasználót ellenőriz; szerepkörök: viewer/editor/admin, hierarchikus `hasRole` | A visszaadott `AuthUser` nem tartalmaz site/workspace membershipet; a `getCanonicalSiteContext` fix `site-default` alap. Több tenant esetén session→membership→site policy és negatív cross-tenant teszt nélkül **NOT PASS** |
| `SEC/INT` Twitch kapcsolat | `assertTwitchConnectionOwnership` konkrét connection ID + user ID + site ID alapján ellenőriz; `getOwnedTwitchConnection` user+site szerint legfrissebb kapcsolatot olvas | A kapcsolatellenőrzés ténylegesen létezik, nem kell új adaptert kitalálni. Több fiók, scope/role és cross-site elutasítás route-szinten is tesztelendő |
| `QA/SEC` site ownership teszt | Öt forrásszintű teszt: publikus page lista és lookup site-filter, OAuth state site ID írás, `validateSiteId` invalid input, Twitch Schedule connection identity site+user filter | Mockolt DB-hívásokat és SQL-stringet ellenőriznek, nem valós D1 isolationt, teljes Admin mutációt, browser flow-t vagy production működést. A meglévő teszteket meg kell tartani és integrációs/negatív tesztekkel bővíteni |
| `QA/DYN/SCH/RES` domain contract teszt | Öt teszt asset ID hivatkozás, site-scoped game profile, ScheduleEvent game profile reference, érvénytelen időintervallum és site-scoped presentation revision | A TypeScript domain contract megléte nem egyenlő a runtime route/DB/API teljes megfelelésével. Hiányzó adatbinding, resource referential integrity és tenant negatív tesztek továbbra is nyitottak |
| `QA` bizonyíték minősítés | A megnyitott tesztek `node:test` és `assert` alapján ellenőriznek konkrét invariánsokat | **TEST SOURCE REVIEWED ≠ TEST EXECUTED ≠ LIVE PASS.** Minden jövőbeli gate-nél commit SHA, parancs, futtatási eredmény, D1-migrációs állapot, browser bizonyíték és negatív eset kell |

**Kötelező tenant-átmeneti szerződés:** `site_id` nem jöhet pusztán kliensinputból; hitelesített user, engedélyezett site membership, role és resource owner együtt határozza meg a szerveroldali kontextust. Minden privát olvasó/író és provider adapter ugyanazt a kanonikus site resolutiont használja. A jelenlegi single-site megoldás megtartható a korai fázisban, de nem címkézhető kész multi-site SaaS-ként.

**Következő ellenőrzés:** tesztfuttatási evidencia; route-onkénti RBAC/ownership mátrix; publikus projection adatminimalizálás; migration FK/UNIQUE/NULL; Admin→Editor→Public browser út. Nincs új jogosultsági rendszer vagy feature implementáció ebben a tervkörben. **IN PROGRESS / NOT PASS**.

### 63.50.7. Legacy system pages és Twitch integrációs UX — ötödik forrásaudit (2026-10-14)

**Forrás:** `src/routes/admin/system-pages.ts`, `src/routes/integrations/twitch.ts`, `src/core/router.ts`. Statikus kódolvasás; nincs CI/live/browser PASS.

| Domain | Meglévő kód / bizonyíték | Szükséges tervbeli rendezés |
| --- | --- | --- |
| `WEB/EDT` system pages | `/api/admin/system-pages` külön `system_page_content` táblába ír `path,content_json` értékeket; csak kilenc fix útvonal engedélyezett, max. 100k JSON, editor role és audit | **Két eltérő oldal-content erőforrás létezik:** a kanonikus `pages` + `editor_revisions` Page Model és a legacy `system_page_content`. A cél egyetlen kanonikus Page Model; az összes fogyasztót, publikus renderert és régi útvonalat fel kell térképezni, migrációs/redirect döntéssel. A legacy route-ot bizonyíték nélkül nem szabad törölni vagy kanonikusnak nyilvánítani |
| `WEB/SEC` system page ownership | A `system_page_content` lekérdezések `path` szerint működnek, látható `site_id` nélkül | A single-site legacy tárolót multi-site környezetben nem szabad tenant-izoláltnak tekinteni; migration/authorization terv és cross-site teszt kell |
| `INT/ADM` Twitch connect UX | OAuth connect/callback és token status/validate/disconnect végpontok léteznek; a callback és hibastátusz `/admin/editor?twitch=...` címre irányít | **UX-tulajdonosi eltérés:** az integráció kezelése nem a Visual Editor felelőssége. Kanonikus belépési hely: Creator Center → Integrációk → Twitch; az Editor csak kapcsolati státuszt és releváns beágyazási konfigurációt mutathat. A redirectet és korábbi deep linkeket kompatibilis módon kell átvezetni |
| `INT/SEC` Twitch OAuth ownership | Callback ellenőrzi a state hash + user + site + expiry + unused feltételeket; token exchange után explicit connection ownership; connection/validation/disconnect user+site scoped | A meglévő OAuth/ownership védelmek megőrzendők. A connect route hitelesített usert ellenőriz, de explicit editor/admin role gate nem látható; Integrations write-policy és szerepkörteszt szükséges |
| `INT/SEC` konfigurációs diagnosztika | Authenticated `twitchConfigDiagnosticRoute` a secret környezeti változók **létezését** jelzi boolean értékekkel, nem adja vissza a titkokat | Diagnosztikai hozzáférés jogosultsági és rate-limit szabálya, biztonságos redaction és naplózás a `SEC/OPS` acceptance része; ne kerüljön Editorba |
| `INT` többfiókos jövő | `getOwnedTwitchConnection` a user+site szerint legfrissebb kapcsolatot adja, a route-ok ezt használják | A jövőbeli több Twitch-csatorna/fiók választás és site-hoz rendelés explicit `connectionId` alapján legyen kezelhető; a „legfrissebb” nem kanonikus multi-account selection |

**Kötelező konvergencia-döntések:** (1) legacy `system_page_content` fogyasztóinak és tartalmának auditja, átvezetés a Page Modelre veszteség nélkül; (2) régi `*.html` route-ok canonical/redirect szabálya; (3) Twitch OAuth visszairányítás Integrációk modulba, Editor-beli használat csak közös API-referenciával; (4) Integrations connect/disconnect RBAC és explicit account selection; (5) minden legacy storage site ownership lezárása. **Nem készül második Visual Editor, külön Twitch settings adatforrás vagy párhuzamos Page Model.**

**Bizonyítékhiány:** a legacy system page publikus fogyasztói, konkrét UI assetek és redirect E2E, valamint a Twitch provider live capability ebben a körben nem lettek tesztelve. `PLAN-CAPABILITY-COMPLETENESS-AND-CONSISTENCY`: **IN PROGRESS / NOT PASS**.

### 63.50.8. Legacy system pages tényleges route-reachability — pontosított bizonyíték (2026-10-14)

**Kiegészítő forrásvizsgálat:** `src/index.ts`, `public/visual-page.html`, `public/admin-home.html`, `src/routes/admin/system-pages.ts`. Ez a bejegyzés **pontosítja a 63.50.7 megfogalmazását**: a két tárolási modell forráskódban létezik, de **nem bizonyított, hogy két aktív, elérhető oldalkezelő működik**.

| Ellenőrzés | Bizonyított forrástény | Következmény |
| --- | --- | --- |
| Worker route registry | `src/index.ts` nem importálja és nem regisztrálja az `adminSystemPagesRoute` handlert, és nincs `/api/admin/system-pages` dispatch | A megnyitott Worker belépési pontból ez a legacy API **nem érhető el**; önmagában a route-fájl létezése nem aktív szolgáltatás |
| Kanonikus page útvonalak | `/api/admin/pages`, `/api/admin/editor`, `/api/public/pages` regisztráltak; `/p/*` a `visual-page.html` assetet szolgálja | A jelenlegi kanonikus weboldal-útvonal a `pages` + Editor Page Model köré épül |
| Régi URL-ek | `about/community/contact/schedule/tiktok/twitch/vod/youtube.html` → megfelelő `/p/slug` 301 redirect; `/admin/home`, `/admin-home.html`, `/admin.html` → `/admin` 302 redirect | A redirect logika létezik, de HTTP/browser és SEO canonical/sitemap eredmény külön tesztelendő |
| Aktuális Admin shell | `public/admin-home.html` látható API-hivatkozásai között `/api/admin/pages`, `/api/admin/schedule`, `/api/admin/settings`, Twitch connection szerepel; `/api/admin/system-pages` nem | Az ellenőrzött shell nem bizonyít aktív legacy system-page szerkesztőt |
| Legacy adat | A `system_page_content` handler továbbra is a forrásfában van, de nincs ebben a körben éles D1 sor-/fogyasztó-/migrációbizonyíték | **DEPRECATED / UNREACHABLE FROM CURRENT WORKER ROUTER (STATIC)** címke; ne töröljük addig, amíg az esetleges történeti tartalom exportja és hivatkozáskeresése nincs lezárva |

**Kötelező lezárási sorrend:** (1) repository-wide import/reference keresés és migration schema audit; (2) éles/staging D1 `system_page_content` sor- és tartalomtípus leltár megfelelő adatvédelmi korlátokkal; (3) ha vannak megőrzendő rekordok, Page Model migráció + preview + visszaállítás; (4) legacy route és storage eltávolítás csak bizonyított nulla fogyasztó és visszaállítható migráció után. A már kanonikus oldalak és redirectek nem helyettesíthetők egy második Editorral.

**Bizonyíték státusza:** route-level statikus besorolás elvégezve; teljes repository dependency scan, D1 tartalom, runtime és migration PASS **OPEN**. A 63.50.7-ben jelzett kettős *storage* nem jelenti bizonyított kettős aktív UI-t. `PLAN-CAPABILITY-COMPLETENESS-AND-CONSISTENCY` továbbra is **IN PROGRESS / NOT PASS**.

### 63.50.9. Első tényleges legacy kódarchiválás — ellenőrzött végrehajtás (2026-10-14)

**Felhasználói döntés:** a bizonyítottan használaton kívüli kód archiválható; történeti kód és adat nem veszhet el. Ez a döntés **nem** jogosít automatikus adatbázis-tábla/migráció törlésre vagy a még nem bizonyított fogyasztók eltávolítására.

**Végrehajtott forrásművelet:**
1. A `src/routes/admin/system-pages.ts` eredeti tartalmát megőriztük `archive/legacy-code/system-pages.ts` alatt, eredeti útvonallal és archív státuszfejléccel. Commit: `b44fc0e9696b5488865d25b733cbfb6ea1ce30bd`.
2. Az archív példányból újraolvasással ellenőriztük az `adminSystemPagesRoute` függvény megőrzését.
3. Az eredeti, a `src/index.ts` által nem importált/nem regisztrált route-fájlt eltávolítottuk az aktív `src/routes/admin` alól. Commit: `c51e8474ff89a26c683640cb5f02a9cc02449595`.
4. **Nem történt** D1 `system_page_content` rekord/tábla törlés, migration átírás, deploy, CI vagy éles böngészőteszt.

**Értelmezés:** a régi handler aktív belépési pontból elérhetetlen volt; archiválása a duplikált *kód* csökkentése, **nem** a régi adatmodell teljes migrációjának PASS-a. Az archív fájl történeti forrás; relatív importjai az archív helyen nem futtathatók közvetlenül. Visszaállítás a Git történetből vagy az archív másolat alapján lehetséges.

**Következő archívum-gate:** minden további fájl esetén (a) teljes aktuális import/route/build hivatkozásellenőrzés, (b) történeti funkció/asset/adatmegőrzés, (c) archivált példány ellenőrzése, (d) célzott typecheck/teszt és regressziós ellenőrzés, (e) csak ezután aktív forrásból törlés. A mostani művelet utáni typecheck/teszt **NOT RUN**, ezért a kódarchiválás utóellenőrzése nyitott.

**Állapot:** egy legacy route archiválva, a kanonikus oldalkezelés és a 396 capability ID megőrizve. A teljes tervkapu **IN PROGRESS / NOT PASS**.

### 63.50.10. Archívum utóellenőrzés — teszt- és migrációs leltár (2026-10-14)

A `tsconfig.json` csak a `src/**/*.ts` és `src/**/*.d.ts` forrásokat veszi fel; az `archive/legacy-code/system-pages.ts` ezen kívül található. A `package.json` külön typecheck, Editor, Schedule, Domain és Admin tesztparancsokat definiál. A Schedule tesztfájl 10, az Admin főoldal tesztfájl 18 tesztesetet tartalmaz. A tesztek forrásának ellenőrzése nem egyenlő a futtatott PASS-szal.

A `0004_system_page_content.sql` történeti táblát hoz létre, míg a `0005_canonical_page_storage.sql` a `pages` draft és published snapshot modelljét vezeti be. A migrációk és az esetleges régi rekordok megőrzendők.

**Nyitott ellenőrzések:** typecheck, Editor/Schedule/Domain/Admin tesztek, site-ownership tesztek és Worker dry-run build; ezek eredménye ebben a körben nem ismert. **NOT PASS.**

### 63.50.11. Régi Editor-assetek és az aktív Editor v2 szétválasztása (2026-10-14)

**Ellenőrzött:** `src/index.ts`, `public/editor-v2/index.html`, `public/editor-v2/boot.js`, `public/editor/preview.html`, `public/editor/` és `public/editor-v2/` könyvtárlista. Statikus audit, nincs böngésző/CI bizonyíték.

- Az aktív, hitelesített `/admin/editor` route `/editor-v2/index.html` assetet szolgálja. A v2 shell saját `editor.css`, `schedule-preview.css`, `mobile-editor.css` fájlokat használ, és rendelkezik oldal-, elem-, réteg-, adásrend-, mentés-, publikálás- és verzióütközés-UI-val.
- A régi `public/editor/` könyvtárban több külön régi Editor modul és `preview.html` maradt. A megnyitott legacy preview `/admin-editor-v2.html` visszalinket és saját, korábbi renderelési logikát tartalmaz; ez nem a kanonikus v2 shell.
- A Worker fallbackje `env.ASSETS.fetch(request)`; ezért a régi statikus assetek **közvetlen URL-en még elérhetők lehetnek**, akkor is, ha az Admin nem linkel rájuk. A route-regisztráció hiánya önmagában nem elegendő a teljes `public/editor/` könyvtár azonnali archiválásához.
- **Következő bizonyítékkapu:** a teljes v2 modulimport-gráf, legacy assetekre mutató hivatkozások, publikus URL/asset manifest, esetleges felhasználói adat/export kompatibilitás, tesztek és böngésző regresszió ellenőrzése. Utána a bizonyítottan nem használt régi fájlok archiválhatók, a v2 egyetlen szerkesztő marad.
- **Termékhatár:** a v2 Editorban látható adásrend és Twitch kapcsolati UI jelenléte nem teszi a Visual Editort az adásrend vagy integráció domain tulajdonosává; ezek a Creator Center külön moduljaiban kezelendők, közös API-val.

**Státusz:** a régi Editor assetek besorolása **LEGACY / ARCHIVE CANDIDATE, NOT YET SAFE TO REMOVE**. A 396 funkcióazonosító és a kanonikus terv változatlan. Teljes kapu **IN PROGRESS / NOT PASS**.

### 63.50.12. Editor v2 statikus importgráf és Admin navigációs eltérések (2026-10-14)

**Forrás:** `v2/foundation` aktuális Editor v2 belépési pontok, core/ui modulok, tesztimportok, `src/index.ts`, `public/admin-home.html`. Ez statikus forrásvizsgálat; nem runtime-, böngésző- vagy CI-PASS.

- A `/admin/editor` Worker route a `/editor-v2/index.html` shellt szolgálja. A shell külön `boot.js`, `app.js`, `ui/shell.js`, `ui/canvas-pan.js`, `ui/geometry-presets.js`, `ui/inspector-groups.js` belépési pontokat és három v2 CSS-fájlt tölt be.
- Az `app.js` közvetlen importjai a v2 `core/` és `diagnostics.js` alatt maradnak; az ellenőrzött `core/` és `ui/` modulok importjai szintén v2-n belül maradnak. **Ellenőrzött részgráfban nincs `public/editor/` legacy import.** A teljes alkalmazás valamennyi szöveges/dinamikus hivatkozásának kizárása még nincs bizonyítva.
- A v2 tesztek `src/core/editor-validation.ts` és `src/core/schedule-*` szerveroldali szerződéseket is érintenek: ezek a közös szerződések megőrzendők; a régi assetek archiválása nem érintheti őket.
- Az Admin `public/admin-home.html` több külön feladatot (weboldal szerkesztése, oldalak/tartalom, adásrend) ugyanarra a `/admin/editor` URL-re irányít. Ez **UX/termékmodul-határ eltérés**, nem bizonyíték három elkészült külön munkaterületre. Kanonikus adat- és API-tulajdonos megtartásával külön, feladatalapú Admin belépési pontokat kell specifikálni és implementálni.
- Az Admin képességtérképének „24 munkaterület” felirata és a MASTER 22 főmodulja eltérő taxonómiai szint lehet; kötelező a 24→22 megfeleltetés vagy a felirat helyesbítése, mielőtt egyezőnek minősítjük.
- A `public/editor/preview.html` saját legacy rendererrel és `/admin-editor-v2.html` visszalinkkel rendelkezik: **LEGACY / ARCHIVE CANDIDATE**, de a publikus közvetlen URL-ek, visszahivatkozások, export/preview kompatibilitás és regresszióvizsgálat előtt nem törölhető.

**Nyitott kapu:** teljes repo-hivatkozáskeresés, dinamikus import/URL-ellenőrzés, asset-manifest és közvetlen URL audit, typecheck + Editor/Admin/Schedule tesztek, böngésző- és publikálási regresszió. **IN PROGRESS / NOT PASS**. Nincs implementációs vagy archiválási engedély ebből a statikus vizsgálatból.

### 63.50.13. Legacy Editor hivatkozáskeresés — aktív belépési pontok (2026-10-14)

**Vizsgált:** `v2/foundation` `0b3c38c` fa (194 bejegyzés), `src/index.ts`, `public/admin-home.html`, `public/visual-page.html`, `public/assets/{page-builder,system-page-editor,site,page-renderer,system-page-runtime}.js`, `package.json`, `tests/admin-home-contract.test.js` és a korábbi 63.50.12 Editor v2 import-részgráf. **Mintavételes, célzott szöveges ellenőrzés**, nem teljes repo-szintű, minden bájtra kiterjedő keresés.

- Az ellenőrzött Worker-route `/admin/editor` → `/editor-v2/index.html`; a `tests/admin-home-contract.test.js` ezt forrásszöveg-szinten ellenőrzi, de ebben a körben nem futott.
- A `package.json` `test:editor` és `test:schedule` parancsai v2 tesztfájlokra mutatnak; nem bizonyítanak böngésző-regressziót.
- A célzottan megvizsgált nem-legacy aktív forrásokban nem azonosítottunk `/editor/`, `admin-editor-v2` vagy legacy `preview.html` függést. Ez **nem** bizonyítja, hogy minden repo-fájl, történeti bookmark, mentett adat vagy dinamikus hivatkozás mentes ezektől.
- A `public/editor/preview.html` továbbra is saját legacy renderert és régi visszalinket tartalmaz; a teljes `public/editor/` könyvtár archiválása **nem engedélyezett** további függőségi, publikus URL-, kompatibilitási és futó regressziós bizonyíték nélkül.
- A `public/assets/page-builder.js`, `system-page-editor.js` és kapcsolódó assetek külön osztályozást igényelnek: pusztán a legacy Editor útvonalra mutató direkt hivatkozás hiánya nem teszi őket használaton kívülivé.

**Következő kapu:** teljes szöveges/AST referenciaindex a repository összes aktív forrásán, közvetlen statikus URL-ek és kompatibilitás ellenőrzése, typecheck, tesztek, Worker build, böngészőben draft/preview/publish/rollback és Schedule regresszió. **IN PROGRESS / NOT PASS; sem törlés, sem runtime-módosítás nem történt.**

### 63.50.14. Publikus Page Model és korábbi Builder assetek elkülönítése (2026-10-14)

**Ellenőrzött `e910f50` refen:** repository fa (194 bejegyzés); `src/index.ts`, `public/visual-page.html`, `public/admin-home.html`, `public/admin-login.html`, `public/editor-v2/index.html`, `public/assets/page-builder.js`, `system-page-editor.js`, `page-renderer.js`, `system-page-runtime.js`, `site.js`, `src/routes/public/pages.ts`, `src/routes/public/system-pages.ts`. Statikus, célzott vizsgálat, tesztfuttatás nélkül.

- A Worker `/`, `/index.html` és `/p/*` kéréseket a `/visual-page.html` assetre irányítja. A HTML tényleges scriptjei `/assets/site.js` és `/assets/page-renderer.js`; az utóbbi fejlécében kanonikus publikus Page Model renderernek, Editor v2-kompatibilisnek jelölt. **KEEP / PUBLIC RUNTIME**, tényleges kompatibilitás regressziós teszttel még igazolandó.
- A vizsgált `visual-page.html` és `editor-v2/index.html` HTML assethivatkozásai nem töltik be a `/assets/page-builder.js`, `/assets/system-page-editor.js` vagy a `/editor/` régi szerkesztő fájlokat. Ez csak a vizsgált HTML belépési pontokra bizonyított negatív állítás.
- A `page-builder.js` és `system-page-editor.js` önálló szerkesztőlogikát tartalmaz: **LEGACY / REUSE-REVIEW / ARCHIVE CANDIDATE**, nem bizonyítottan elhagyható. A `system-page-runtime.js` szintén külön runtime-kompatibilitási vizsgálatot igényel. Nem vonható össze a publikus `page-renderer.js` fájllal pusztán elnevezés alapján.
- A `public/admin-home.html` továbbra is több külön üzleti művelethez ugyanazt a `/admin/editor` címet kínálja. A 22 főmodulhoz rendelt feladatalapú Admin navigációs szerződés szükséges, külön adatforrások duplikálása nélkül.

**Nyitott bizonyítás:** minden aktív forrás, generált/inline URL és dinamikus hivatkozás teljes keresése; API- és mentettadat-kompatibilitás; asset közvetlen elérhetősége; typecheck/CI, Editor/Admin/Schedule tesztek; böngésző és éles publikálási regresszió. **IN PROGRESS / NOT PASS**. Nem történt kódtörlés vagy runtime-módosítás.

### 63.50.15. Legacy Builder API-függőségek és archiválási határ (2026-10-14)

**Forrás:** `2b47dd5` fa; célzott statikus keresés a `public/assets/page-builder.js`, `system-page-editor.js`, `system-page-runtime.js`, `page-renderer.js`, `site.js`, `public/visual-page.html`, `src/index.ts`, `src/routes/admin/editor.ts`, `src/routes/public/system-pages.ts`, `public/editor-v2/app.js` fájlokban. A teljes, 85 aktív forrásfájlra tervezett tömeges keresés eszközkorlát miatt **nem fejeződött be**, így teljes-repo negatív bizonyíték nincs.

- `page-builder.js` a `/api/admin/pages` és `/api/auth/session` végpontokat hívja: a UI archiválása nem jelenti a Page/CMS API vagy mentett adatok eltávolítását.
- `system-page-editor.js` a `/api/admin/system-pages` végpontot hívja; `system-page-runtime.js` a `/api/public/system-pages` végpontot hívja. **Külön szerkesztő- és runtime-kompatibilitási szerződés** szükséges. Nem szabad összekeverni a v2 Editor és a kanonikus publikus `page-renderer.js` életciklusával.
- `page-renderer.js` a `/api/public/pages` és `/api/public/schedule` adatokat olvassa; `site.js` a publikus oldalak/beállítások API-ját is használja. **KEEP / PUBLIC RUNTIME**, regressziós bizonyítékig.
- Az `editor-v2/app.js` saját Editor/Page API-k mellett Twitch integrációs API-hívásokat is tartalmaz. Ez **tényleges, ellenőrzött határátlépés** a külön Integrációk munkaterület jövőbeni kialakításához: a közös Twitch szolgáltatást meg kell őrizni, a felhasználói kezelés helyét a modulhatár-terv szerint kell rendezni, párhuzamos integrációs állapot nélkül.
- A fenti célzott forrásokban nem találtunk közvetlen `/editor/` vagy `admin-editor-v2` hivatkozást. Ez nem teljes-repo bizonyíték, és nem igazolja a régi assetek közvetlen URL-elérhetetlenségét.

**Döntés:** a legacy Editor/Builder UI továbbra is **ARCHIVE CANDIDATE / NOT SAFE TO REMOVE**; a kanonikus Page, Schedule, Twitch és publikus renderelési API-k megőrzendők. **Nyitott:** fennmaradó aktív fájlok hivatkozásai, közvetlen URL-ek, import/export/mentett adat kompatibilitás, futtatott CI/tesztek, böngésző és publikálási regresszió. **IN PROGRESS / NOT PASS**.

### 63.50.16. Szerveroldali legacy hivatkozások és Twitch OAuth visszatérés (2026-10-14)

**Ellenőrzött ref:** `8c1ee7a`. Célzott statikus keresés: `src/routes/admin/{pages,schedule,settings,twitch-schedule-sync}.ts`, `src/routes/public/{pages,schedule,site-settings,system-pages}.ts`, `src/routes/integrations/twitch.ts`, `src/core/{page-model,router,editor-validation}.ts`, `src/index.ts`, `public/editor-v2/app.js`, `public/editor/preview.html`. Keresett legacy minták: `/editor/`, `admin-editor-v2`, Builder/System Page assetnevek; aktív Editor belépési pont: `/admin/editor`.

- A vizsgált oldalkezelési, adásrend-, beállítási és publikus szerveroldali útvonalakban nem azonosítottunk direkt legacy Editor-asset hivatkozást. **Ez csak a felsorolt fájlokra vonatkozó negatív bizonyíték.**
- **Konkrét, aktív integrációs függés:** `src/routes/integrations/twitch.ts` két helyen `new URL("/admin/editor", request.url)` visszatérési célt használ. A Twitch OAuth callback és hibakezelési navigáció áttervezése az Integrációk modul saját munkaterületére kötelező; a jelenlegi működő visszatérést nem szabad előzetes regressziós bizonyítás nélkül átírni.
- A `public/editor-v2/app.js` az `/api/admin/editor` végponton mentési, publikálási, visszavonási és revíziókezelési műveleteket végez; ezek nem azonosak a régi `public/editor/` assetekkel, és archiváláskor megőrzendők.
- A `public/editor/preview.html` régi `/admin-editor-v2.html` visszalinkje továbbra is valós legacy hivatkozás, de az ellenőrzött aktív szerveroldali útvonalak nem mutatnak rá. Közvetlen statikus URL és mentett könyvjelző kompatibilitás továbbra is OPEN.

**Döntés:** Twitch OAuth navigáció = **KEEP NOW / MOVE WITH CONTRACT LATER**; legacy Editor UI = **ARCHIVE CANDIDATE / NOT SAFE TO REMOVE**. A teljes repo- és runtime-regressziós kapu **IN PROGRESS / NOT PASS**; sem futtatott teszt, sem kódmódosítás nem történt ebben a körben.

### 63.50.17. CI-futásbizonyíték és kliensoldali belépési pontok (2026-10-14)

**GitHub Actions, `bdcffa5d1768eff08b5ee84a228617352ec8ab61`:** [Editor Core Test — SUCCESS](https://github.com/sanci9517/sanci9517/actions/runs/38637849271); [Twitch Integration Check — SUCCESS](https://github.com/sanci9517/sanci9517/actions/runs/38637849143). Mindkét run `completed / success` a GitHub API szerint; ez a commit a dokumentációs audit előző állapota, nem az alábbi új dokumentációs commit.

- Az Editor Core workflow `npm run typecheck`, `npm run test:editor`, `npm run test:schedule`, `npm run test:domain`, `npm run test:admin-home` lépéseket definiál. A Twitch Integration workflow typechecket, Editor/Schedule teszteket, `tests/twitch-oauth.test.js` és site ownership szerződést futtat. A SUCCESS a definiált jobok sikeres lefutására bizonyíték, nem minden lehetséges runtime forgatókönyvre.
- A vizsgált kliens belépési pontok: `public/editor-v2/index.html`, `boot.js`, `ui/{shell,canvas-pan,geometry-presets,inspector-groups}.js`, `public/visual-page.html`, `public/admin-home.html`. Az ellenőrzött v2 shell assetei `/editor-v2/` útvonalon maradnak; ezekben a célzott fájlokban nem azonosítottunk `/editor/` vagy `admin-editor-v2` direkt hivatkozást.
- A `package.json` `test:editor` és `test:schedule` a v2 tesztjeire mutat. A sikeres CI **nem** tartalmaz dokumentált teljes böngészős draft/preview/publish/rollback tesztet vagy régi statikus URL 404/redirect szerződést.

**Részleges bizonyítás:** `TYPECHECK + EDITOR/SCHEDULE/DOMAIN/ADMIN/TWITCH/OWNERSHIP CI — PASS` a fenti SHA-n. **Archiválási és böngésző-kapu — IN PROGRESS / NOT PASS.** Régi Editor/Builder assetet továbbra sem szabad eltávolítani pusztán a CI zöld állapota miatt. A teljes aktív forráskészlet hivatkozásainak indexelése és a közvetlen URL-ek ellenőrzése továbbra is nyitott.

### 63.50.18. Legacy statikus URL útvonal-kapu — forrásból igazolt, élő HTTP még nyitott (2026-10-14)

**Forrás:** `7c29894` ref, `src/index.ts`, `wrangler.jsonc`, `public/editor/preview.html`, `public/editor-v2/index.html`. A production `/editor/preview.html`, `/admin-editor-v2.html`, `/admin/editor` URL-ek HTTP-ellenőrzési kísérlete a rendelkezésre álló webes hozzáféréssel nem adott elérhető választ; **sem 200, sem 404, sem redirect státusz nem bizonyított**. Böngészős interakció sem történt.

- Az aktív Worker explicit autentikált `/admin/editor` útvonala a `/editor-v2/index.html` assetet szolgálja ki; az autentikálatlan felhasználót `/admin/login` címre irányítja (302).
- Az explicit `LEGACY_REDIRECTS` csak a régi publikus tartalmi `.html` útvonalakat kezeli (`about`, `community`, `contact`, `schedule`, `tiktok`, `twitch`, `vod`, `youtube`). **Nincs explicit `/editor/preview.html` vagy `/admin-editor-v2.html` átirányítás.**
- Az ismeretlen útvonalak `env.ASSETS.fetch(request)` fallbackra kerülnek, az assets könyvtár `./public`. A `public/editor/preview.html` ténylegesen szerepel a forrásfában, így az asset-kiszolgálási konfiguráció alapján potenciálisan közvetlenül elérhető; ezt éles HTTP-válasz és jogosultsági vizsgálat nélkül nem szabad bizonyított tényként kezelni.
- A legacy preview visszalinkje `/admin-editor-v2.html`, amelyre a Worker nem definiál külön útvonalat; a tényleges 404/redirect viselkedés **OPEN**. Az Editor v2 saját assetjeinek `/editor-v2/` közvetlen URL-elérése és a hitelesítés határa külön security/UX tesztet igényel.

**Döntés:** ne töröljük a legacy fájlokat, ne adjunk vakon redirectet az összes legacy URL-re, és ne jelöljük a runtime/böngésző-kaput PASS-nak. Szükséges: éles GET/HEAD státusz + redirect + auth ellenőrzés, legacy preview mentett `pageId` és adatkompatibilitás, Editor v2 böngészős draft/preview/publish/rollback, közvetlen statikus asset biztonsági szerződés. **URL/BROWSER GATE: IN PROGRESS / NOT PASS.**

### 63.50.19. Asset-hitelesítési határ és éles URL-próba diagnózisa (2026-10-14)

**Ellenőrzött ref:** `0b7bf83`. Statikus forrásvizsgálat: `src/index.ts`, `src/core/auth/require-auth.ts`, `src/routes/admin/editor.ts`, `public/editor/preview.html`, `public/editor-v2/index.html`, `public/admin-home.html`, `wrangler.jsonc`. Külön HTTP-próba: `/api/health`, `/admin/editor`, `/editor/preview.html`, `/admin-editor-v2.html`, `/editor-v2/index.html`, `/assets/page-builder.js` a Worker production hoston.

- Az összes éles HTTP-próba `curl` **000 / Could not resolve host** eredménnyel végződött; **DNS-feloldási hiba** miatt egyik kérés sem jutott HTTP-státuszig. Ez nem 404, nem 401, nem üzemzavar- vagy sérülékenységbizonyíték. A környezet hálózati korlátja miatt élő útvonal-bizonyíték **UNVERIFIED**.
- `src/index.ts` az explicit `/admin/editor` útvonalon `getAuthenticatedUser` ellenőrzést végez és csak utána szolgálja ki az Editor v2 HTML-t; autentikálatlan kérésnél `/admin/login` 302. `src/routes/admin/editor.ts` külön ellenőrzi a hitelesítést és a szerepkört az API-kéréseken.
- A `public/editor-v2/index.html` a `/editor-v2/*.js` és CSS asseteket közvetlen statikus URL-ekről tölti; `wrangler.jsonc` az egész `./public` könyvtárat assets-ként konfigurálja, és a Worker ismeretlen útvonalakon `env.ASSETS.fetch(request)` fallbackot használ. **A HTML route auth-védelme nem bizonyítja, hogy a közvetlen asset URL-ek is auth-védettek.** Az assetek esetleges publikus elérhetősége önmagában nem bizonyít adat-hozzáférési hibát; a tényleges API-határ és érzékeny adat kiszivárgásának vizsgálata külön kötelező.
- A régi `public/editor/preview.html` a `/api/admin/editor` API-t `credentials: 'include'` és `cache: 'no-store'` beállítással hívja. Az asset közvetlen kiszolgálása és az API-val történő sikeres adatelérés két külön teszteset.

**Kötelező elfogadási mátrix:** anonim/authentikált GET és redirect a `/admin/editor`, `/editor-v2/index.html`, `/editor/preview.html`, `/admin-editor-v2.html` URL-eken; anonim API GET/POST/PUT 401/403, jogosult Editor műveletek, role-változatok; publikus assetek érzékeny tartalmának ellenőrzése; preview mentett adatok és visszalinkek; draft/publish/rollback böngészőteszt; cache- és jogosultságváltási regresszió. **SECURITY/URL/BROWSER GATE: IN PROGRESS / NOT PASS.** Nem történt runtime-kód módosítás.

### 63.50.20. Editor API jogosultsági és revíziós invariánsok (2026-10-14)

**Ellenőrzött ref:** `ac312b0`. Statikus forrásellenőrzés: `src/routes/admin/editor.ts`, `src/routes/admin/pages.ts`, `src/core/auth/require-auth.ts`, `src/core/response.ts`, `src/routes/auth/session.ts`. Futtatott új API-integrációs teszt nincs; az előző, külön azonosított GitHub Actions CI-PASS változatlanul csak a lefedett tesztekre érvényes.

- **Auth/role:** mindkét Admin Editor/Page API `getAuthenticatedUser` ellenőrzést és legalább `editor` szerepkört követel: hiányzó session → 401, elégtelen szerepkör → 403. A `hasRole` rangsort használ (`viewer`, `editor`, `admin`); a `/api/auth/session` publikus állapotválasza nem helyettesíti a szerveroldali jogosultságellenőrzést.
- **Cache:** a közös `ok/error` válaszgyártó `Cache-Control: no-store` fejlécet ad az API-válaszokhoz. Ez a szerkesztő HTML és a statikus JS assetek cache-szabályát **nem** bizonyítja.
- **Site ownership:** az Editor és Pages műveletek a kanonikus `siteId` alapján keresnek/módosítanak `pages` sorokat. A visszaállításnál az oldal előzetes `site_id` ellenőrzése külön megvan; a revízió lekérdezés `page_id` alapján történik, az oldal ownership előellenőrzése után.
- **Mentés:** az Editor POST kanonikus `sanci-page-document` sémát követel, méretkorlátot alkalmaz, új revíziót rögzít, opcionális `expectedVersion` konfliktusnál 409-et ad; publikáláskor további dokumentumvalidáció és `published_content_json` snapshot-frissítés történik. `unpublish` külön POST-művelet.
- **Rollback:** a PUT egy korábbi revízió dokumentumából **új revíziót** hoz létre, nem írja felül a történetet. A forrásban a rollback a `content_json` draftot frissíti; a `published_content_json` közvetlen módosítása nem szerepel ebben az ágban. A felhasználói UX-nek világosan külön kell kezelnie a draft visszaállítását és a publikált állapotot.

**Nyitott tesztkapuk:** anonim/viewer/editor/admin GET/POST/PUT szerepkörmátrix; különböző site-hoz tartozó pageId; hibás vagy ütköző `expectedVersion`; rollback utáni publikus snapshot változatlansága; publish/unpublish idempotencia; cache; böngészős regresszió. **AUTH/API CONTRACT: STATICALLY VERIFIED / RUNTIME NOT PASS**. Nem történt kód- vagy adatbázis-módosítás.

### 63.50.21. Publikus snapshot és Admin metaadat-frissítés: kiemelt szerződésütközés (2026-10-14)

**Forrásref:** `8588fc9`; `src/routes/public/pages.ts`, `src/routes/admin/pages.ts`, `src/routes/admin/editor.ts`, `src/core/page-model.ts`, `public/assets/page-renderer.js`. Forráskód alapján igazolt ágak, futtatott új integrációs teszt nélkül.

- **Publikus vs preview:** `/api/public/pages` alaphelyzetben `is_published=1` rekordok `published_content_json` pillanatképét adja. `preview=1` esetén `content_json` draftot olvas, előtte sessiont és legalább `editor` szerepkört ellenőriz (401/403). A publikus `page-renderer.js` a `preview=1` queryt továbbítja az API felé; az API dönt a hozzáférésről.
- **Kiemelt eltérés:** a `src/routes/admin/pages.ts` metaadat-frissítési ágában `contentChanged` (cím/slug/leírás) esetén új revízió készül, és **ha `existing.is_published`**, az SQL `UPDATE pages SET published_content_json=?,published_revision_id=?` automatikusan az aktuális, módosított **draft** dokumentumot teszi publikált snapshotnak. Ez az Editor v2 POST draft mentési / explicit publish modelljétől eltérő publikálási út.
- **Kockázati forgatókönyv:** publikált oldal + még nem publikált vászonmódosítás a `content_json` mezőben → cím/slug/leírás módosítása a Pages API-n → a teljes draft `published_content_json` mezőbe másolódhat. A korábban nem publikált vászontartalom így explicit Editor Publish nélkül válhat publikussá. **A kódból levezethető kockázat, éles reprodukció még nem történt.**
- **Kanonikus adatmodell:** a `normalizeEditorDocument` a v2 `sanci-page-document` sémát elfogadja, a legacy `sanci-document` típust szükség esetén konvertálja. A régi adatok törlése vagy az átalakító eltávolítása kompatibilitási bizonyítás nélkül tilos.

**Javasolt végleges szerződés (döntés és teszt előtt nem implementálandó):** Admin CMS metaadat-szerkesztés draft-only legyen alapértelmezésben; a publikus SEO/canonical/slug megváltoztatása explicit publikálási tranzakcióhoz és URL-redirect szerződéshez kötődjön. Külön kezelendő a listázási metaadat és a publikált dokumentum metaadata, hogy ne keletkezzen vegyes állapot. **Kötelező regresszió:** published v1 + draft v2 + CMS cím/slug/leírás változtatás → a publikus snapshot és publikus URL maradjon változatlan explicit publishig; preview v2 mutassa a draftot; publish után váltson a snapshot és a redirect. Vizsgálni kell a korábbi szerződések és UI elvárások esetleges szándékos eltérését.

**Prioritás: HIGH / CONTRACT DECISION REQUIRED / NOT PASS.** Ez a bizonyíték nem igazol runtime hibát, de az archiválási és publikálási kaput blokkolja. Ebben a körben csak a MASTER módosult; működő kódhoz és adathoz nem nyúltunk.

### 63.50.22. Publikált URL és snapshot szerződés: migrációs forrásbizonyíték (2026-10-14)

**Ellenőrzött ref:** `771f193`. Források: `migrations/0005_canonical_page_storage.sql`, `migrations/0009_page_sort_order.sql`, `src/routes/admin/pages.ts`, `src/routes/public/pages.ts`, `src/index.ts`, `public/assets/page-renderer.js`, `public/assets/site.js`, `public/visual-page.html`. Új tesztfuttatás nem történt.

- **Kifejezett történeti szerződés:** `0005_canonical_page_storage.sql` megjegyzése szerint `pages.content_json` az aktuális draft/kanonikus dokumentum, `pages.published_content_json` az **utoljára kifejezetten publikált** pillanatkép. A migráció kezdeti backfillje az akkor már publikált oldalakhoz a korábbi `content_json` értéket használta; ez adatátvezetés, nem általános felhatalmazás későbbi automatikus publikálásra.
- **Ellenőrzött eltérés megerősítve:** `src/routes/admin/pages.ts` PATCH ága `contentChanged && existing.is_published` esetén a teljes módosított draft dokumentumot a `published_content_json` mezőbe másolja és a `published_revision_id` értékét átállítja. Ez ütközik a `0005` dokumentált „last explicitly published snapshot” szerződésével. **HIGH PRIORITY CONTRACT DEFECT CANDIDATE**, még nem futtatott regresszió.
- **URL-szerződés:** a publikus `/p/<slug>` route ugyanazt a `visual-page.html` shellt szolgálja ki, a `/api/public/pages?slug=...` pedig az aktuális `pages.slug` mezővel keres. A CMS PATCH `slug` átírása ezért azonnal megváltoztathatja a publikus feloldást, még ha a tartalom pillanatképe később draft-only modellre áll is át. A `src/index.ts` explicit redirectjei csak a nyolc korábbi fix `.html` útvonalat kezelik; tetszőleges régi `/p/<slug>` címekhez a vizsgált kódban nincs történeti alias/redirect szerződés.
- **Adatmodell- és UX-következmény:** a draft `slug/title/description` és a publikált URL/metaadat **nem lehet azonos, azonnal átírt egyetlen állapot** úgy, hogy közben explicit publish és stabil régi linkek az elvárás. A tervben külön publikált URL-feloldási forrás, redirect history és SEO canonical/sitemap kezelés megtervezése szükséges; konkrét adatbázis-séma és migráció csak döntés/tesztek után.

**Kötelező elfogadási tesztek:** published v1 + draft v2 + PATCH metaadat → publikus v1 és korábbi URL változatlan; preview v2; explicit publish → v2 publikus és régi URL szabályozott 301/308; slug ütközés; unpublish → publikus hozzáférés megszűnik; rollback → csak draft változik; sitemap/canonical/OG egyezés; site-ownership és jogosultság; cache. **STATUS: CONTRACT CONFLICT CONFIRMED IN SOURCE / RUNTIME AND DESIGN CLOSURE NOT PASS.** Nem történt kódmódosítás vagy adatbázis-migráció.

### 63.50.23. Publikus SEO/404 és előnézeti indexelés szerződésaudit (2026-10-14)

**Forrásref:** `c94c944`; `public/visual-page.html`, `public/assets/page-renderer.js`, `public/assets/site.js`, `src/routes/public/pages.ts`, `src/routes/admin/pages.ts`, `src/core/page-model.ts`. Statikus kódaudit, élő HTTP vagy keresőrobot ellenőrzés nélkül.

- **Kliensoldali tartalomfeloldás:** a Worker a `/p/<slug>` URL-re a közös `visual-page.html` shellt adja; a `page-renderer.js` a pathname alapján számított sluggal `/api/public/pages?slug=...` API-t hív. A publikus API hiányzó oldalra 404-et ad, de a renderer ezt a kliensoldalon egy „404” hibaüzenetté alakítja a már betöltött HTML shellen belül. **Potenciális SEO/HTTP-státusz eltérés:** az oldal URL-jének tényleges HTTP 404 státusza nincs igazolva, és a Worker forrásából a shell kiszolgálása következik. Külön HTTP-integrációs teszt szükséges.
- **Statikus metaadat:** a közös HTML shell kezdő `<title>` értéke `Sanci9517`, a `robots` meta `index,follow`. A renderer az API válasza után kliensoldalon állítja a `document.title` értékét, de a vizsgált `loadPage` ág nem hoz létre oldalankénti canonical, meta description, Open Graph vagy robots szabályt. A `page-model.ts` sémájában lévő `metadata.canonical` és `metadata.openGraph` értékek létezése nem bizonyítja azok publikus HTML-kimenetét.
- **Preview:** `?preview=1` ugyanazon `visual-page.html` shellben fut, és a renderer a queryt továbbítja a jogosultságvédett publikus API felé. A shell `index,follow` metaadata mellett nincs a vizsgált belépési ponton bizonyított `noindex` preview-szabály. **SEO/indexelési kockázat**; a tényleges keresőindexelés nem bizonyított.
- **URL/404 szerződés:** az explicit publish, átnevezés, unpublish és törlés után a `/p/<slug>` HTTP-státusz, canonical, redirect, sitemap és metaadatok konzisztens, szerveroldalon tesztelhető viselkedése szükséges. A kliensoldali „404” felirat nem helyettesíti a HTTP 404-et.

**Javasolt elfogadási feltételek:** publikált oldal → HTTP 200 + helyes cím/leírás/canonical/OG; nem publikált/nem létező oldal → valódi 404 és noindex; jogosult preview → draft, noindex/no-store; anonim preview → nincs draft-adat; slug változás → szabályozott 301/308 és canonical; sitemap csak publikus URL-ekkel, robots.txt és meta robots összehangolva; SSR/Worker/meta-kimenet architektúrája a meglévő asset-routinggal kompatibilisen kiválasztandó. **SEO/HTTP CONTRACT: IN PROGRESS / NOT PASS.** Kódot nem módosítottunk.

### 63.50.24. Site settings tenant-scope és rendszerszintű oldalútvonal audit (2026-10-14)

**Ellenőrzött ref:** `bb0897b`. Források: `src/core/site-context.ts`, `src/routes/public/site-settings.ts`, `src/routes/admin/settings.ts`, `src/routes/public/system-pages.ts`, `src/routes/public/schedule.ts`, `src/routes/admin/schedule.ts`, `src/index.ts`. Statikus forrásvizsgálat; új runtime-teszt nem történt.

- **Jelenlegi single-site alap:** a `getCanonicalSiteContext()` konstans `site-default` azonosítót ad vissza. A publikus és Admin schedule útvonalak a `schedule_items.site_id` alapján szűrnek; ez megőrzendő ownership minta a későbbi multi-tenant platformhoz.
- **Settings scope eltérés:** az Admin settings és a publikus site settings jelenleg kizárólag `site_settings.key = 'site'` szerint olvas/ír, nem a `site_id` szerint. Ez a jelenlegi egyoldalas modellben lehet tudatos globális beállítás, de a Creator Platform több különálló creator/site támogatására **nem tekinthető bizonyított tenant-szeparációnak**. Nem állítunk jelenlegi adatkiáramlást; a multi-tenant szerződés és migráció szükségessége OPEN.
- **System pages legacy út:** a `publicSystemPagesRoute` külön `system_page_content` tárból, `path` alapján olvas, szintén explicit site-scope nélkül. A `src/index.ts` vizsgált routingja nem regisztrálja a `/api/public/system-pages` útvonalat, bár a route-modul létezik. Ez potenciálisan elárvult/legacy API; eltávolítás előtt teljes hivatkozás- és adatinventár kötelező.
- **Felhasználói felület:** az Admin settings legalább `admin` szerepkört kér, a schedule szerkesztés legalább `editor` szerepkört; a publikus site settings anonim olvasható. Ezek a jogosultsági különbségek a moduláris Admin navigációban is megőrzendők.

**Döntési/tesztkapuk:** global vs site-scoped vs account-scoped settings kulcsok tulajdonosi mátrixa; siteId-hoz kötött settings és system-page adatok migrációs tervvel, nem vak adatátírással; API és frontend fogyasztói hivatkozások tételes felderítése; 2 külön site fixture és kereszt-tenant negatív teszt; schedule/site-settings/sitemap/SEO consistency. **TENANT OWNERSHIP / LEGACY API: IN PROGRESS / NOT PASS.** A single-site működésből nem következtetünk működő multi-tenancyre. Nem történt runtime-kód módosítás.

### 63.50.25. Admin navigáció és legacy system-page fogyasztói hivatkozások (2026-10-14)

**Forrásref:** `46e8a4f`; `public/admin-home.html`, `public/assets/system-page-editor.js`, `public/assets/system-page-runtime.js`, `public/assets/site.js`, `public/editor-v2/app.js`, `src/index.ts`, `tests/admin-home-contract.test.js`. Forrásbeli fogyasztói hivatkozások és útvonalregisztráció összevetése; böngészős/futó teszt ebben a körben nem volt.

- **Valós Admin fogyasztók:** az `admin-home.html` lekéri a `/api/auth/session`, `/api/admin/settings`, `/api/admin/pages?meta=1`, `/api/admin/schedule`, `/api/integrations/twitch/connection` adatokat. Ezek a dashboard élő adatkapcsolatai; modulokra bontáskor a dashboard aggregáló szerepét meg kell őrizni.
- **Kanonikus UI kontra tervezett modulok:** a dashboardon a „Weboldal szerkesztése”, „Adásrend” és „Oldalak és tartalom” navigációs linkek ugyanarra a `/admin/editor` címre mutatnak. A gyorsműveletek és több képességkártya szintén az Editorba vezet. A `24 munkaterület` felirat és a MASTER 22 felső szintű modulja között fogalmi egyeztetés szükséges; nem szabad automatikusan azonos számosságot feltételezni.
- **Tesztbe kódolt átmeneti szerződés:** a `tests/admin-home-contract.test.js` jelenleg explicit elvárja a `/admin/editor` linket, és a sidebar aktív céljait `/admin`, `/admin/editor` címekre korlátozza. Ez **nem** a végső moduláris IA bizonyítéka; új, jogosultságvédett kanonikus modul-útvonalak bevezetésekor a tesztet a terv szerinti navigációs szerződéssel együtt kell módosítani, nem pusztán kikapcsolni.
- **Legacy API-fogyasztók:** a `public/assets/system-page-editor.js` GET/PUT `/api/admin/system-pages` útvonalat használ; a `public/assets/system-page-runtime.js` a `/api/public/system-pages` útvonalat hívja. A vizsgált `src/index.ts` nem regisztrálja ezeket. A `public/assets/site.js` ezzel szemben a tényleges `/api/public/pages` és `/api/public/site-settings` végpontokra támaszkodik. A két legacy fájl **archiválási jelölt**, de script-tag/import hivatkozás és adatreferencia teljes felderítéséig nem törölhető.
- **Editor v2 aktív szerződés:** a `public/editor-v2/app.js` közvetlenül használja a `/api/admin/pages` PATCH/POST/DELETE/GET és `/api/admin/editor` GET/POST/PUT végpontokat. Oldalsorrend, név/slug, mentés, publikálás, rollback és törlés áthelyezésekor ugyanazokat a kanonikus adatokat és revíziószabályokat kell megosztani; nem épülhet második független Editor vagy adatbázis.

**Következő kötelező audit:** minden HTML/script-tag/import és CSS asset fogyasztó tételes keresése; `system_page_content` adatok és migrációk; dashboard 24 képességkártya vs 22 domain taxonómia; navigációs route+role mátrix; meglévő CI szerződés frissítési terve. **ADMIN IA / LEGACY DEPENDENCIES: IN PROGRESS / NOT PASS.** Nem történt kódváltozás vagy archívumba mozgatás.

### 63.50.26. HTML asset-fogyasztók és dashboard 24 képességkártya tételes leltára (2026-10-14)

**Forrásref:** `148d7fd`; `public/admin-home.html`, `public/admin-login.html`, `public/editor-v2/index.html`, `public/visual-page.html`, `public/editor-v2/boot.js`, `public/editor-v2/ui/shell.js`, `public/assets/page-builder.js`, `public/assets/system-page-editor.js`, `public/assets/system-page-runtime.js`. A GitHub fa teljes `public/` JS/HTML útvonalait listáztuk; a tartalmi betöltések e körben a felsorolt aktív belépési pontokra korlátozódtak, tehát ez **nem** teljes repós importgráf.

**Aktív HTML asset-útvonalak (statikus):**
- `public/editor-v2/index.html` betölti az `editor.css`, `schedule-preview.css`, `mobile-editor.css`, `boot.js`, `app.js`, `ui/shell.js`, `ui/canvas-pan.js`, `ui/geometry-presets.js`, `ui/inspector-groups.js` fájlokat. A `ui/shell.js` további `./events.js` és `./registry.js` importot tartalmaz. Ezeket nem szabad legacyként archiválni.
- `public/visual-page.html` betölti a `/assets/site.css`, `/assets/site.js`, `/assets/page-renderer.js` fájlokat; ezek az aktív publikus shell függőségei.
- A vizsgált `admin-home.html` inline `<script>` blokkot használ; a vizsgált `admin-login.html` nem tartalmaz külső JS script taget. A fenti aktív HTML-fájlokban **nem találtunk** közvetlen `system-page-editor.js`, `system-page-runtime.js`, `page-builder.js` betöltést. Ez önmagában nem zárja ki más importáló/HTML vagy közvetlen URL fogyasztók létezését.

**A dashboard tényleges 24 képességkártyájának neve, forrássorrendben:**
1. Weboldal és CMS; 2. Visual Editor v2; 3. Design Studio; 4. Média- és erőforráskönyvtár; 5. Adásrend és játékprofilok; 6. Stream Studio és OBS; 7. VOD, klipek és Shorts; 8. Publikálási központ.
9. Twitch-integráció; 10. YouTube, TikTok és Discord; 11. Közösségi központ; 12. Közönség és e-mail; 13. Analitika és riportok; 14. AI Creator Copilot; 15. Webshop, merch és tagság; 16. Automatizálás és workflow.
17. Csapatok és több webhely; 18. Biztonság és helyreállítás; 19. Nyelvek, SEO és hozzáférhetőség; 20. Fejlesztői eszközök és piactér; 21. Dinamikus adatok és adatbinding; 22. Űrlapok és interakciók; 23. Publikálás és verziókezelés; 24. Tartalommodellek és bővíthető blokkok.

**Taxonómiai értelmezés:** a 24 dashboardkártya **képességbemutató egység**, nem bizonyítottan 24 önálló felső szintű modul; a MASTER 22 főmoduljával való eltérés ezért nem önmagában hiba. Különösen a `Publikálási központ` vs `Publikálás és verziókezelés`, `Weboldal és CMS` vs `Tartalommodellek`, `Design Studio` vs `Dinamikus adatok` és `Twitch-integráció` vs többi platformadapter esetén **tulajdonos + elsődleges menühely + megosztott felület** szerződés kell. Nem szabad pusztán a 24-es számot 22-re kozmetikázni vagy két külön backend képességet létrehozni.

**Következő kapu:** 24→22 tételes domain- és surface-crosswalk, aktív HTML/import gráf teljesítése a többi `public/` és `src/` fogyasztóra, `system_page_content` történeti adatséma ellenőrzése, kanonikus/legacy/archive döntések negatív tesztekkel. **ASSET/IA AUDIT: PARTIAL EVIDENCE / NOT PASS.** Nincs törlés, runtime-módosítás vagy teszt-PASS állítás.

### 63.50.27. Dashboard 24 képesség → kanonikus 49.1–49.22 modul megfeleltetés (2026-10-14)

**Forrás:** `public/admin-home.html` 24 `<article class="capability-card">` elemének sorrendi címkéi; MASTER §3.2, §46.1–46.2, §49, §63.19–63.20. Ez **tervbeli IA/ownership megfeleltetés**, nem annak bizonyítása, hogy a tervezett menü/route már működik. A dashboard 24 bemutató kártyája nem azonos a 22 kanonikus főmenüvel.

| # | Dashboard képesség | Elsődleges 49.x főmodul | Domain-adatgazda | UX / ownership határ |
|---:|---|---|---|---|
| 1 | Weboldal és CMS | 49.2 | SITE/PAGE/NAVIGATION | Oldalak, CMS, SEO; Editor csak almenü |
| 2 | Visual Editor v2 | 49.2 | PAGE/REVISION | Vizuális vászon, Inspector; önálló Editor belépés |
| 3 | Design Studio | 49.3 | DESIGN_SYSTEM | Brand Kit, token, sablon, komponens |
| 4 | Média- és erőforráskönyvtár | 49.4 | RESOURCE | Közös D1/R2 asset registry |
| 5 | Adásrend és játékprofilok | 49.5 | SCHEDULE/GAME_PROFILE | Külön Live almenü, Editor schedule blokk csak fogyasztó |
| 6 | Stream Studio és OBS | 49.5 + 49.6 | LIVE_STATE / STREAM_TOOLS | Live irányítás és OBS külön tulajdonos |
| 7 | VOD, klipek és Shorts | 49.8 | CONTENT/PUBLISHING | Média bináris 49.4, videótartalom 49.8 |
| 8 | Publikálási központ | 49.8 | PUBLISHING | Cross-platform tartalom queue; nem weboldal-revízió |
| 9 | Twitch-integráció | 49.7 | INTEGRATION | Twitch provider adapter; Live csak fogyasztó |
| 10 | YouTube, TikTok és Discord | 49.7 | INTEGRATION | Provider adapterek, community funkció 49.9 |
| 11 | Közösségi központ | 49.9 | COMMUNITY/FAN_IDENTITY | Moderáció és rajongói identitás külön |
| 12 | Közönség és e-mail | 49.9 + 49.8 | FAN_IDENTITY / CONTENT | Audience/consent és kampányüzenet ownership külön tisztázandó |
| 13 | Analitika és riportok | 49.13 | ANALYTICS | Csak aggregált olvasási modellek |
| 14 | AI Creator Copilot | 49.15 | AI_OPERATION | Jóváhagyott domain commandokat hív |
| 15 | Webshop, merch és tagság | 49.10 + 49.11 | PRODUCT/ORDER / ENTITLEMENT | Bolt és tagsági hozzáférés külön |
| 16 | Automatizálás és workflow | 49.14 | AUTOMATION | Domain command és permission kötelező |
| 17 | Csapatok és több webhely | 49.22 | WORKSPACE/BILLING_PLAN | Tenant és SaaS külön domain |
| 18 | Biztonság és helyreállítás | 49.19 | IDENTITY/AUDIT/BACKUP | Keresztmetszeti SEC/OPS |
| 19 | Nyelvek, SEO és hozzáférhetőség | 49.19 + 49.2 | LOCALIZATION / SEO_PUBLICATION | Lokalizációs beállítás vs weboldal SEO; A11Y minden felületen |
| 20 | Fejlesztői eszközök és piactér | 49.20 + 49.21 | DEVELOPER_API / EXTENSION | API kulcs/webhook és extension sandbox külön |
| 21 | Dinamikus adatok és adatbinding | 49.2 + domainforrások | PAGE / source-domain | Editor kötés, forrásrekordot nem másol |
| 22 | Űrlapok és interakciók | 49.2 | FORM_SUBMISSION/PAGE | Beküldés külön domain; UI Editor node |
| 23 | Publikálás és verziókezelés | 49.2 | REVISION/SEO_PUBLICATION | Weboldal explicit publish; nem 49.8 cross-platform queue |
| 24 | Tartalommodellek és bővíthető blokkok | 49.2 | PAGE/CMS | Tartalommodellek külön Weboldal almenü |

**Kiemelt ütközések és kötelező döntések:**
- A `Publikálási központ` (49.8 platformközi content queue) és a `Publikálás és verziókezelés` (49.2 weboldal REVISION/SEO_PUBLICATION) külön lifecycle; azonos „publikálás” szó nem indokol összevont táblát.
- A `Stream Studio és OBS` kártya **két** kanonikus főmodult takar: 49.5 Live és 49.6 OBS; a kártya navigációja külön célokat/kontextuális választást kapjon.
- A `Webshop, merch és tagság` szintén két külön tulajdonos: 49.10 kereskedelem és 49.11 támogatás/tagság. A `Fejlesztői eszközök és piactér` 49.20/49.21 kettős határát is meg kell tartani.
- `Közönség és e-mail` konkrét consent, fan identity, email delivery és kampánytartalom tulajdonosi bontása még **OPEN**; nem szabad egyetlen „misc” adattáblába kényszeríteni.
- A 49.1 Dashboard, 49.12 szponzoráció, 49.16 globális keresés, 49.17 értesítés és 49.18 súgó **nem kapnak önálló bemutatókártyát** a 24-es listában, ettől még a kanonikus menüben és termékscope-ban megmaradnak.

**Következő elfogadási kapu:** minden kártyához egyértelmű elsődleges navigációs cél + jogosultság + planned/active státusz; a 22 főmodul menüjének felhasználói jóváhagyása; a régi Admin tesztek frissítése; domain-adatgazdák és 396 funkció-ID szemantikai ellenőrzése. **CROSSWALK: DOCUMENTED / NOT YET APPROVED OR IMPLEMENTED.** A működő kód változatlan.

### 63.50.28. Admin RBAC és kanonikus modulútvonalak: tényleges API-szerződés (2026-10-14)

**Forrásref:** `795d79a`; `src/core/auth/require-auth.ts`, `src/index.ts`, `src/routes/admin/editor.ts`, `src/routes/admin/pages.ts`, `src/routes/admin/schedule.ts`, `src/routes/admin/settings.ts`, `src/routes/admin/twitch-schedule-sync.ts`, `src/routes/integrations/twitch.ts`, `src/routes/auth/session.ts`. Statikus kódolvasás, új role-mátrix runtime-teszt nélkül.

**Jelenleg ellenőrzött szerephierarchia:** `viewer=1 < editor=2 < admin=3`, `hasRole(user, minimumRole)` rang-összehasonlítással. `getAuthenticatedUser` a nem lejárt session tokenhez kapcsolt, aktív felhasználót olvassa. Ez **minimum-role RBAC**, nem granular capability/scope permission és nem tenant tagság bizonyítéka.

| Művelet / útvonal | Forrás szerinti hozzáférés | HTTP / szerződés | Moduláris következmény |
|---|---|---|---|
| `/admin` | bármely bejelentkezett viewer/editor/admin | nincs session → 302 login | Dashboard 49.1; kártyák action-jogosultsága külön kezelendő |
| `/admin/editor` | bármely bejelentkezett viewer/editor/admin a HTML shellhez | nincs session → 302 login | **Eltérés:** editor API minimum editor; viewer shellhez hozzáfér, de API-tól 403-at kap; UI-ban read-only/tiltás tisztázandó |
| `/api/admin/editor` | editor vagy admin | GET/POST/PUT ágon auth/role check | 49.2 Editor: a shell nem jelent írásjogot |
| `/api/admin/pages` | editor vagy admin | GET/POST/PATCH/DELETE auth/role check | 49.2 CMS, külön oldalak belépési ponttal |
| `/api/admin/schedule` | editor vagy admin | GET/POST/PUT/DELETE auth/role check | 49.5 Adásrend; külön menüpont, közös schedule domain |
| `/api/admin/twitch/schedule-sync` | editor vagy admin | POST auth/role check | 49.5/49.7 közös domainparancs, nem Editor tulajdon |
| `/api/admin/settings` | csak admin | GET/PUT auth/role check | 49.19; editor/viewer számára nem aktív szerkesztő link |
| `/api/auth/session` | session függő | szerepkört is visszaad | UI jogosultságalapú állapota ebből származhat, de szerveroldali check kötelező |

**Routing tény:** a `src/index.ts` jelenleg csak `/admin` és `/admin/editor` HTML-workspace belépési pontokat szolgál ki. Az Admin settings/schedule/pages API létezik, **önálló `/admin/settings`, `/admin/schedule`, `/admin/pages` HTML route még nincs regisztrálva**. A Twitch OAuth flow-ban két `/admin/editor` célhivatkozás található; a 49.7 Integrációk saját munkaterületére átvezetéskor ezeket is át kell vizsgálni, és az OAuth callback/hiba állapotát megőrizni.

**Tervezett RBAC/UX kapu:** 22 főmodul × viewer/editor/admin × olvasás/írás/publish/connection/admin beállítás műveleti mátrix; külön 401/403, stale session, cross-site, direct URL és re-auth negatív tesztek; a Viewer Editor shell helyes read-only vagy tiltott viselkedésének termékdöntése; később workspace/site tagság és granular permission a rang fölött. **RBAC NAVIGATION: SOURCE-VERIFIED BASELINE / NOT PASS FOR FINAL MODULE IA.** Nem történt jogosultságmódosítás.

### 63.50.29. Twitch integráció RBAC és OAuth-visszatérési útvonal: műveleti határ (2026-10-14)

**Forrásref:** `03c13b2`; `src/routes/integrations/twitch.ts`, `src/routes/admin/twitch-schedule-sync.ts`, `src/core/twitch-site-ownership.ts`, `src/core/auth/require-auth.ts`, `src/index.ts`. Statikus forrásbizonyíték, nem futtatott exploit/HTTP teszt.

| Twitch művelet | Jelenlegi minimum | Meglévő ownership / egyéb védelem | Tervezési kérdés |
|---|---|---|---|
| `GET /api/integrations/twitch/connect` | bejelentkezett viewer/editor/admin | OAuth state userId + canonical siteId | Ki indíthat új provider kapcsolatot? |
| `GET /api/integrations/twitch/callback` | bejelentkezett viewer/editor/admin | hash-elt state, user_id, site_id, expiry, unused, kapcsolat ownership | OAuth-folyamat megszakítása/hiba/role-változás kezelése |
| `GET /api/integrations/twitch/connection` | bejelentkezett viewer/editor/admin | owned userId + siteId connection | A kapcsolat metaadata kinek látható? |
| `GET /api/integrations/twitch/validation` | bejelentkezett viewer/editor/admin | owned userId + siteId; token validation/refresh | A validálás provider-mellékhatása és rate-limitje |
| `POST /api/integrations/twitch/disconnect` | bejelentkezett viewer/editor/admin | owned userId + siteId; revoke + audit | **Kiemelt RBAC rés:** viewer is leválaszthatja a saját kapcsolatát; a kívánt szerepkör nincs rögzítve |
| `POST /api/admin/twitch/schedule-sync` | editor/admin | canonical siteId + connectionId, domain sync | Live/Integrációk közös action, nem Visual Editor API |
| `GET /api/integrations/twitch/diagnostic` | bejelentkezett viewer/editor/admin | csak konfigurációs booleanok | Diagnosztika láthatósága admin/ops határ szerint |

**Biztonsági értelmezés:** a felhasználó- és site-ownership ellenőrzése valós és megőrzendő, de **nem egyenértékű** a provider-account műveletek granular jogosultságával. A `viewer` leválasztási lehetősége forrásból igazolt policy-gap **jelölt**, nem bizonyított jogosulatlan hozzáférés vagy production incidens; jelenleg a kapcsolat a bejelentkezett felhasználóhoz kötött. Multi-user/team esetén külön `integration.view/connect/manage/disconnect` capability és workspace membership szerződés kell.

**OAuth UX kötés:** a siker/denied/invalid/error callback `303` redirectje és a hiba `code` query paramétere a `/admin/editor?twitch=...` címre mutat. A kanonikus 49.7 Kapcsolatok és integrációk modulra történő átvezetéskor az összes siker-, megszakítás-, expired/used state-, refresh- és owner-mismatch állapotnak láthatóan meg kell maradnia; a `code` paraméterben nem kerülhet érzékeny token. Az Editor maradhat kontextuális gyorselérés, de nem lehet provider-connection owner.

**Elfogadási kapu:** viewer/editor/admin × own/shared/site/workspace connection mátrix; OAuth start/callback/replay/expired/session-switch/role-change negatív tesztek; disconnect CSRF és confirmation vizsgálat; provider-revoke retry és audit; a live schedule sync és connect elkülönített permission; diagnosztikai láthatóság. **TWITCH RBAC/OAUTH: OPEN / NOT PASS.** Nem történt kód-, jogosultság- vagy provider-kapcsolat módosítás.

### 63.50.30. Történeti system-page adatmodell és kanonikus Page Model ütközés (2026-10-14)

**Forrásref:** `936115a`; `migrations/0004_system_page_content.sql`, `0005_canonical_page_storage.sql`, `0006_canonicalize_legacy_pages.sql`, `0008_restore_canonical_standard_pages.sql`, `src/routes/public/system-pages.ts`, `public/assets/page-builder.js`, korábbi §63.50.25–26 HTML/API hivatkozási bizonyíték. Csak forrásolvasás; **nem** D1 adatlekérdezés, runtime teszt vagy bizonyított adatüresség.

**Két eltérő, történetileg létező tárolási szerződés:**
- A `0004_system_page_content.sql` létrehozza a `system_page_content(path PRIMARY KEY, content_json, updated_at)` táblát. **Nincs `site_id` és nincs draft/published revision szétválasztás**. A `publicSystemPagesRoute` kilenc whitelisted útvonalat kezel és ebből olvas, de a korábbi `src/index.ts` regisztrációs auditban nincs `/api/public/system-pages` útvonal; a jelenlegi publikus oldal a kanonikus `/api/public/pages` Page Modelt használja.
- A `0005_canonical_page_storage.sql` kifejezetten különválasztja a `pages.content_json` aktuális draftot és a `pages.published_content_json` explicit publikált snapshotot. Ez a megtartandó 49.2 PAGE/REVISION szerződés; a §63.50.22 PATCH-publish jelölt eltérését továbbra is külön tesztelni kell.
- A `0006_canonicalize_legacy_pages.sql` `legacy-%` azonosítójú `pages` rekordokat alakít át `sanci-document` struktúrára és publikált snapshotra, míg a `0008_restore_canonical_standard_pages.sql` `INSERT OR IGNORE` elven hét alapoldalt állít vissza `sanci-page-document` szerkezettel. A két történeti séma/verzió **nem** bizonyít egységes, migráció utáni runtime-állapotot; meglévő rekordokat a `0008` nem ír felül.
- A `public/assets/page-builder.js` külön `SYSTEM` útvonallistát tartalmaz kilenc régi `.html` és gyökér URL-lel; ez a legacy URL-kompatibilitás vizsgálatánál releváns, **nem** bizonyít aktív betöltést.

**Megőrzési/archiválási döntés: BLOCKED, amíg nincs adatbizonyíték.** A `system_page_content` tábla és a régi JS fájlok nem törölhetők pusztán azért, mert jelenleg nincs regisztrált API/fogyasztó: előbb helyi és remote D1 sor-, path- és tartalomleltár, esetleges eltérő oldaltartalom összevetése a kanonikus `pages` rekordokkal, ownership/migration/rollback terv, backup és negatív tesztek szükségesek. Külön vizsgálandó a `/twitch.html` → `/p/twitch` stb. redirect és az oldalslug változásainak SEO-kompatibilitása.

**Következő kapu:** `system_page_content` és `pages` valós adatok összehasonlítása csak biztonságos read-only lekérdezéssel, valamint a 0006/0008 migrációk idempotencia és schema-version kompatibilitás tesztje; 9 régi URL → kanonikus cél tételes crosswalk. **LEGACY DATA RECONCILIATION: OPEN / NOT PASS.** Nem történt adat- vagy runtime-módosítás.

### 63.50.31. Kilenc történeti URL és hét helyreállított alapoldal: migrációs lefedettség (2026-10-14)

**Forrásref:** `92a4247`; `src/index.ts`, `migrations/0003_legacy_pages.sql`, `0006_canonicalize_legacy_pages.sql`, `0007_sync_published_canonical_pages.sql`, `0008_restore_canonical_standard_pages.sql`, `0010_canonical_revision_contract.sql`, `src/routes/public/pages.ts`. Statikus forrásaudit, remote D1 tartalom nem ellenőrzött.

| Történeti URL | Canonical slug | 0003 legacy seed | 0008 repair alapoldal | Worker útvonal |
|---|---|---|---|---|
| `/index.html` és `/` | `home` | `legacy-home` | `page-home` | `/` publikus shell; `/index.html` ugyanaz |
| `/about.html` | `about` | `legacy-about` | `page-about` | 301 → `/p/about` |
| `/community.html` | `community` | `legacy-community` | **nincs** | 301 → `/p/community` |
| `/contact.html` | `contact` | `legacy-contact` | `page-contact` | 301 → `/p/contact` |
| `/schedule.html` | `schedule` | `legacy-schedule` | `page-schedule` | 301 → `/p/schedule` |
| `/tiktok.html` | `tiktok` | `legacy-tiktok` | `page-tiktok` | 301 → `/p/tiktok` |
| `/twitch.html` | `twitch` | `legacy-twitch` | `page-twitch` | 301 → `/p/twitch` |
| `/vod.html` | `vod` | `legacy-vod` | **nincs** | 301 → `/p/vod` |
| `/youtube.html` | `youtube` | `legacy-youtube` | `page-youtube` | 301 → `/p/youtube` |

**Lényegi eredmény:** a `0003` kilenc történeti `legacy-*` oldalrekordot vet fel; a `0008` hét `page-*` alapoldalt tartalmaz, a `community` és `vod` nélkül. A `0008` `INSERT OR IGNORE`, így az elhagyott kettőből **nem következik automatikus törlés**, viszont a tényleges sor-/slug-/published-state megőrzés csak D1 lekérdezéssel igazolható. A `0006` `legacy-%` dokumentumkonverziót, a `0007` az `sanci-document` típusú oldalak published snapshot szinkronját célozza; a `0008` már `sanci-page-document` alakú alapdokumentumot készít. A `0010` csak akkor köti a published revision ID-t, ha azonos snapshotú editor revision létezik. Eltérő verziók és esetleges hiányzó revíziólinkek ellenőrzendők.

**Public runtime ellenőrzési határ:** a `src/routes/public/pages.ts` `site_id` és `is_published` szerint szűr, `normalizeEditorDocument` segítségével olvas; hibás kanonikus dokumentumra 409 API választ ad. A `/p/<slug>` Worker HTML-shell és a 301 redirect **nem bizonyítja**, hogy az adott slughoz létezik érvényes publikált oldal vagy hogy a HTML-válasz valódi 404. Külön 9 útvonalas 301→200/404, canonical/meta/robots és unpublished teszt kell.

**Következő bizonyítékkapu:** read-only `SELECT id,slug,site_id,is_published,published_revision_id,json_extract(content_json,'$.type'),json_extract(published_content_json,'$.type') FROM pages WHERE slug IN (...)` helyi+remote környezetben; egyediség, duplikált legacy/page ID, 9 URL, community/vod, snapshot/revision összevetés; DB backup és visszaállítás előfeltétel bármely adatmigráció előtt. **LEGACY URL/PAGE DATA: STATIC CROSSWALK COMPLETE / RUNTIME NOT PASS.** Nincs adatírás, archíválás vagy redirect módosítás.

### 63.50.32. Legacy Page Model normalizálás és explicit publikálás: forrásalapú regressziós szerződés (2026-10-14)

**Forrásref:** `8610086`; `src/core/page-model.ts`, `src/routes/public/pages.ts`, `src/routes/admin/pages.ts`, `src/routes/admin/editor.ts`, `migrations/0006_canonicalize_legacy_pages.sql`, `0008_restore_canonical_standard_pages.sql`. Csak statikus kódvizsgálat, nem élő adat- vagy teszt-PASS.

**Normalizálás – két támogatott történeti dokumentumforma:**
- A `normalizeEditorDocument` a `sanci-page-document` / `schemaVersion:1` formát csak akkor adja vissza, ha a kért `pages[pageId]` rekord, `rootId` és `nodes` megtalálható. A `sanci-document` / `pages:[]` formát runtime memóriában átalakítja, a root gyermekeket lapos `nodes` térképpé alakítja, a régi `layout` mezőt `metadata.legacyLayout` alatt őrzi meg. Ez **read-time compatibility**, nem perzisztens, tételes migráció.
- `convertLegacyNode` hiányzó node ID esetén `crypto.randomUUID()` értéket készít. Ha történeti dokumentumban hiányzik ID, két egymást követő olvasás eltérő node ID-kat adhat; a hiányzó ID-val rendelkező legacy oldalakat külön determinisztikus normalizációs tesztnek kell alávetni. Nem állítható, hogy az összes valós rekord érintett.
- A `publicPagesRoute` `mapPage` is normalizál, de nem ír vissza. A `/p/<slug>` shell HTTP-státusz és az API 404/409 közti eltérés külön §63.50.23, §63.50.31 nyitott feladat.

**Publikálás – bizonyított kódútvonal-konfliktus:**
- A `src/routes/admin/editor.ts` POST ágában a `publish===true` kapcsoló indít `validatePublishDocument` ellenőrzést és `published_content_json` + `published_revision_id` + `is_published=1` módosítást. A sima mentés csak draftot és új revíziót ír; a PUT rollback is draft-only. Ez a kívánt explicit publish alapminta.
- **Ezzel ellentétben** a `src/routes/admin/pages.ts` PATCH ága cím/slug/leírás változásakor a jelenlegi `content_json` draftból új revíziót képez, és ha `existing.is_published`, `published_content_json` + `published_revision_id` mezőket is átírja. Így egy **már publikált, de közben módosított draft** oldalon egy egyszerű metaadat-PATCH publikálhatja a draft vászonváltozásait az Editor explicit publish ellenőrzése nélkül. Ez forrásból alátámasztott **kritikus regressziós jelölt**, reprodukció/teszt még nincs.
- Ugyanezen PATCH közvetlenül módosítja a `pages.slug` mezőt, amelyből a publikus API feloldja az URL-t; a régi slug redirect/alias szerződés nincs igazolva. Külön draft vs published metadata/slug életciklus kell, mielőtt javítás történik.

**Kötelező tesztkészlet a fejlesztési fagyasztás feloldása után:** (1) publish A, draft B, metaadat PATCH → publikus A marad és published revision ID változatlan; (2) draft B explicit publish → publikus B; (3) rollback B→A csak draftot változtat; (4) slug draft módosítás nem teszi elérhetetlenné a published URL-t; (5) legacy normalizálás idempotens, stabil node ID-val, a vizuális layout megőrzésével; (6) hibás JSON/hiányzó oldal/rossz site/role/expectedVersion negatív tesztek. Az adatjavítás előtt remote read-only D1 leltár és backup kell.

**Döntés:** a canonical `pages` és `editor_revisions` adatmodell **KEEP/REPAIR**; a legacy normalizáló **KEEP TEMPORARILY / VERIFY**, nem szabad archíválni bizonyíték nélkül. **PUBLICATION INTEGRITY: SOURCE-IDENTIFIED CONFLICT / NOT PASS.** A runtime kód és az adat változatlan.

### 63.50.33. Publikus oldalmetaadat, slug és draft/published szerződés: pontosított határok (2026-10-14)

**Forrásref:** `e6f365c`; `src/routes/admin/pages.ts`, `src/routes/admin/editor.ts`, `src/routes/public/pages.ts`, `src/index.ts`, `src/core/editor-validation.ts`. Statikus audit, runtime reprodukció nélkül.

**A jelenlegi séma négy, egymástól függetlenül viselkedő adatkört használ:** (1) `pages.content_json` szerkesztési draft; (2) `pages.published_content_json` éles snapshot; (3) `pages.published_revision_id` éles revízióhivatkozás; (4) `pages.slug/title/description` **közös**, nem verziózott oszlopok. A publikus API az éles tartalmat olvassa, de az oldalcímet, leírást és slugot a közös oszlopokból adja vissza; ezért az éles tartalom és az éles metaadatok nem atomi, verzióhoz kötött egységet alkotnak.

**PATCH konkrét mellékhatásai:** `src/routes/admin/pages.ts` módosítja a draft `page.name/slug/metadata` mezőit, revíziót hoz létre, és **már publikált oldalnál** a teljes frissített draftot `published_content_json` mezőbe is másolja. Nem hívja a `validatePublishDocument` ellenőrzést, miközben `src/routes/admin/editor.ts` explicit `publish===true` útja igen. A sortOrder-only PATCH nem másol teljes draftot, de a public listában a `sort_order` változás azonnal látható; ennek termékszerződése külön meghatározandó.

**Slug és URL:** a `src/routes/public/pages.ts` kizárólag az aktuális `pages.slug` értékből oldja fel a publikus oldalt. A `src/index.ts` csak a nyolc rögzített történeti `.html` útvonalhoz ad 301 redirectet, **nem** kezeli a később átnevezett `/p/old-slug` aliasokat. Ezért a metaadat-PATCH azonnal elmozdíthatja az élő URL-t, akár az explicit publish előtt; SEO/link kompatibilitás kockázat. A Worker `/p/*` útvonala statikus shellt szolgál ki, nem végez slug-validációt az asset fetch előtt.

**Javasolt kanonikus szerződés (nem megvalósított döntési terv):** `draft_metadata` vs `published_metadata` és `draft_slug` vs `published_slug`, explicit publish tranzakció, stabil page ID és site-scoped `page_slug_aliases` (source slug → canonical page ID, redirect status, timestamps) történet; az admin sortOrder draft/instant-live döntést dokumentálni kell. Egyetlen Page Model/Revision owner marad; nem hozunk létre második Editor backendet. Külön migrációs előfeltétel: meglévő published snapshotok, metaadatok és aliasok read-only leltára, backup, site isolation és unique index ellenőrzés.

**Kötelező regressziós tesztek:** (A) publish v1 → draft v2 → metadata PATCH → public v1 változatlan; (B) invalid draft + metadata PATCH → semmi nem kerül élesbe; (C) draft slug módosítás → korábbi public URL él; (D) explicit publish slugváltással → régi URL 301/308 új kanonikusra, query megőrzés és loop-tiltás; (E) unpublished/missing slug valódi HTTP 404; (F) public meta, canonical, OG, sitemap, robots és cache a published snapshotot követi; (G) expectedVersion ütközés, több-site azonos slug, sortOrder és rollback. **PUBLISH/METADATA CONTRACT: SOURCE-CONFLICT CONFIRMED / TEST AND DESIGN NOT PASS.** Runtime kód és DB nem változott.

### 63.50.34. Teljes H19–H34 cél-ID referenciaintegritás ellenőrzése (2026-10-14)

**Vizsgálat:** a jelenlegi `v2/foundation` kanonikus MASTER `24.` fejezetéből reguláris kifejezéssel kigyűjtött `[A-Z]{2,6}-NNN` capability ID-k halmazát összevetettük a `63.52–63.53` fejezet elsődleges, pontosan három oszlopos `HNN.NN | történeti funkció | cél-ID(k)` tábláinak minden sorával. Ez a **teljes strukturális cél-ID halmazellenőrzése**, nem a leírások szemantikai vagy runtime bizonyítása.

| Ellenőrzési mérőszám | Eredmény |
| --- | --- |
| Egyedi kanonikus ID a 24. fejezetben | **396** |
| Elsődleges H19–H34 történeti mapping sor | **271** |
| H19–H34 cél-ID hivatkozás, amely nincs a 24. fejezetben | **0** |
| Történeti azonosító ismétlés az elsődleges mapping sorok között | **0** |
| Ugyanazon H-ID ismétlése későbbi javítási táblákban | **8**, tudatos korrekciós/indoklási sor: H19.16, H21.13, H21.22, H22.16, H22.19, H28.14, H32.18, H34.21 |

**Döntés:** a `271 → 396` célazonosító-hivatkozások **REFERENTIAL INTEGRITY / STRUCTURAL PASS** részkapuja lezárható; nem állítható, hogy mind a 271 követelmény szemantikailag helyes helyen van, minden részfunkció lefedett, vagy a 396 képesség implementált. A nyolc későbbi korrekciós sor nem nyolc új funkció, és nem írhatja felül észrevétlenül az eredeti forrást; a végső review-ban a javított cél-ID a döntés, az eredeti sor a provenance.

**Továbbra is OPEN:** a `00/A` és `00.9–00.9.6.B` történeti források visszakeresése / bizonyítékos nem-visszanyerhetőség kezelése; H19–H34 egyedi acceptance és domain owner szemantikai validálása; 49. modul és 54. review szerződés egyeztetése; felhasználói végső feature-review. **A teljes aktív PLAN-CAPABILITY-COMPLETENESS-AND-CONSISTENCY kapu IN PROGRESS / NOT PASS marad.**

### 63.50.35. Kétirányú történeti ID-lefedettség: új platformképességek nem tévesztendők össze hiánnyal (2026-10-14)

A `63.50.34` ellenőrzés **fordított irányú** kiegészítése: a 24. fejezet 396 egyedi ID-jából **172** szerepel legalább egy H19–H34 elsődleges mapping céljaként, **224** nem szerepel ezekben a céloszlopokban. A 224 nem automatikusan elveszett, hibás vagy fölösleges: az aktuális Creator Platform-scope történeti H19–H34-en túli új, kibővített vagy más forrásból megőrzött képességeit is tartalmazza. A 271 történeti sor több cél-ID-t is hivatkozhat; ezért a 271, 172 és 396 számok nem összeadandók.

**Példák a 24. fejezet teljes prefix-csoportjaiból (összes ID / H19–H34 által hivatkozott ID):** `EDT 44/19`, `WEB 32/10`, `DSN 18/3`, `OBS 10/1`, `COM 20/0`, `SUP 12/0`, `STO 21/0`, `LOC 6/0`, `SEARCH 5/0`, `HELP 4/0`, `AI 21/17`, `SEO 5/5`. A nulla történeti hivatkozás **nem** kivezetési engedély, és **nem** bizonyítja, hogy a modul újonnan kitalált vagy értéktelen.

**Következő szemantikai review szabály:** minden kanonikus ID-t a saját termékigényével, 49. moduljával, 54. ellenőrzőlistájával és fázisával kell igazolni; történeti H19–H34 kapcsolat csak akkor kötelező, ha valóban abból származik. A hiányzó `00/A` és `00.9.6.B` miatt a 224 ID történeti eredetét nem szabad önkényesen teljesnek vagy hiányzónak minősíteni. **REVERSE COVERAGE COUNT: VERIFIED / PROVENANCE SEMANTICS OPEN.** A teljes tervkapu NOT PASS.

### 63.50.36. Három kanonikus nézet strukturális számlálása: 24. / 49. / 54. (2026-10-14)

**Ellenőrzött hatókör:** a `v2/foundation` MASTER jelenlegi 24., 49. és 54. fejezeteinek teljes szöveges, formai leltára. A 24. fejezetben a `- PREFIX-NNN:` formájú definíciókat, a 49. fejezetben a `### 49.N.` főmodulokat, az 54. fejezetben a `- [ ]` review-elemeket számoltuk. **Eredmény:** 396/396 egyedi capability-definíció, duplikált definíciós ID **0**; **22/22** kanonikus főmodul; **156** checklist sor az 54. fejezetben. A 156 checklist nem 156 új ID, hanem összetett felhasználói ellenőrzési eset; a sorok automatikus 1:1 ID-megfeleltetése tilos.

**396 ID megoszlása, a 24. fejezet definíciói alapján:** ADM 13, WEB 32, EDT 44, DSN 18, RES 16, INT 21, LIV 10, OBS 10, SCH 15, CNT 22, COM 20, STO 21, SUP 12, ANL 10, CAM 9, AUT 14, AI 21, SEC 12, OPS 11, LOC 6, TEAM 7, MKT 5, QA 10, SET 4, DYN 8, SEO 5, DEV 6, SEARCH 5, NTF 5, HELP 4. Összeg: **396**.

**Főmodul–képességcsalád kanonikus UX-owner, nem külön adattár:** 49.1 ADM; 49.2 WEB+EDT+SEO+DYN; 49.3 DSN; 49.4 RES; 49.5 LIV+SCH; 49.6 OBS; 49.7 INT; 49.8 CNT; 49.9 COM; 49.10 STO; 49.11 SUP; 49.12 CAM; 49.13 ANL; 49.14 AUT; 49.15 AI; 49.16 SEARCH; 49.17 NTF; 49.18 HELP; 49.19 SEC+OPS+SET+LOC; 49.20 DEV; 49.21 MKT; 49.22 TEAM. QA az összes modulon átívelő bizonyítási funkciócsalád, nem 23. Admin-főmodul. A 63.20 domain/adatgazda mátrix az egyetlen owner-szerződés; az itt megadott prefix-kapcsolat navigációs besorolás.

**Nyitott szemantikai kapu:** az 54. fejezet mind a 156 összetett ellenőrzési sorának tartalmi lefedése a megfelelő 24. ID-val, 49. modullal, pozitív/negatív acceptance-szel és fázissal **még nem bizonyított**. A strukturális számlálás **PASS**, a teljes tartalmi kapu **IN PROGRESS / NOT PASS**.

### 63.50.37. Domain-lefedettség és 54. review → 24. ID hivatkozási hiány (2026-10-14)

**Teljes dokumentumon belüli leltár:** az 5. fejezet kanonikus domain-táblájában **38 egyedi domain ID** szerepel; mind a 38 neve megtalálható a 63.20 főmodul → domain/adatgazda keresztmátrixban, tehát **38/38 név szerinti strukturális lefedettség**. Ez nem bizonyítja a tárolási, permission- vagy runtime-kapcsolatok helyességét. Az 54. fejezet **156** review-checkboxából **0** tartalmaz szó szerinti `PREFIX-NNN` capability ID-t; a 49. fejezet menütérképe szintén **0** ilyen explicit ID-t tartalmaz. A három fejezet közti megfelelést jelenleg a fogalmi leírás és a 63.20 domain-térkép hordozza, nem géppel ellenőrizhető, checklist-soronkénti ID-link.

**Kockázat:** a 396/22/156 strukturális PASS nem elegendő annak kimondásához, hogy az 54. fejezet minden összetett felhasználói igényének megvan a konkrét capability owner, dependency és negatív acceptance. A következő review-nak az 54.1–54.16 összes sorát a 24. fejezet legalább egy meglévő ID-jához, a 49. fejezet pontos tulajdonosmoduljához és a 63.20 domainhez kell rendelnie. Ha egy sor több domainből áll, a kanonikus owner és fogyasztókat külön kell megadni; **nem** kell minden checklist sorból új feature-ID-t létrehozni. Hiány csak szemantikai bizonyíték alapján minősíthető.

**Kapustátusz:** `38/38 DOMAIN NAME COVERAGE — STRUCTURAL PASS`; `156/156 CHECKLIST ITEM-TO-ID TRACEABILITY — OPEN`; a teljes aktív tervkapu továbbra is `IN PROGRESS / NOT PASS`.

### 63.50.38. Az 54. review 156 sorának modulonkénti ellenőrzési kapui (2026-10-14)

A teljes 54. fejezet checkbox-sorainak **fejezetenkénti** számlálása: `54.1 8`, `54.2 15`, `54.3 7`, `54.4 7`, `54.5 8`, `54.6 11`, `54.7 12`, `54.8 12`, `54.9 9`, `54.10 12`, `54.11 7`, `54.12 7`, `54.13 12`, `54.14 8`, `54.15 13`, `54.16 8` = **156**. Ez a számlálás minden fejezetet lefed; nem azonos a sorok egyenkénti szemantikai megfeleltetésével.

**Elsődleges review routing, a 49. kanonikus moduljai szerint:** 54.1 → 49.1 (keresés 49.16, notification 49.17, help 49.18); 54.2 → 49.2 (Editor belépési pont, design 49.3, resource 49.4); 54.3 → 49.3; 54.4 → 49.4; 54.5 → 49.7; 54.6 → 49.5 (connection 49.7); 54.7 → 49.6 (integration 49.7, automation 49.14); 54.8 → 49.8; 54.9 → 49.9 (entitlement 49.11); 54.10 → 49.10/49.11/49.12 (commerce, support, sponsorship **külön owner**, nincs közös pénzügyi CRUD); 54.11 → 49.13 (kampány 49.12); 54.12 → 49.14; 54.13 → 49.15; 54.14 → 49.19 lokalizáció, 49.2 locale-specifikus publikálás; 54.15 → 49.19 (cross-cutting security/ops); 54.16 → 49.20/49.21/49.22 (developer, extension, team külön owner).

**Végrehajtandó tételes bizonyítás:** minden 54.x checkbox kapjon `54.x#N → 24.PREFIX-NNN → 49.N → 5.DOMAIN → F-phase → acceptance` láncot; az átfedéseknél primary vs consumer és a többmodulos jogosultsági határ legyen egyértelmű. A 54.10 és 54.16 egy-egy checklist-sorát tilos teljes egészében egyetlen tetszőleges modulhoz besorolni, ha külön commerce/support/sponsorship vagy developer/extension/team domaint érint. **REVIEW ROUTING / SECTION LEVEL DOCUMENTED; ITEM LEVEL NOT PASS.**

