## 34. Végső cél: teljes Brand & Creator Platform SANCI AI-val

Ez a terv nem pusztán streamer-weboldal vagy egy 1.0-s bemutatkozó oldal terve. A végső termék egy egységes, bővíthető **Brand & Creator Platform**, amely a személyes márkát, a publikus jelenlétet, a közönséget, a tartalomgyártást, a live működést, a bevételi modelleket és az AI-alapú munkafolyamatokat egy összefüggő rendszerbe szervezi.

### 34.1. A végső platform kötelező képességcsoportjai

- **Brand Identity & Brand OS:** márkanév, profilok, arculati tokenek, színek, tipográfia, logó- és médiakészlet, hangnem, márkairányelvek, kampányazonosítók, egységes márkamegjelenés minden csatornán és felületen.
- **Creator Website Platform:** vizuális weboldalépítő, oldalak, navigáció, rétegek és inspector, reszponzív nézetek, sablonok, újrafelhasználható komponensek, blokkok, CMS/tartalomtípusok, publikálás, domain/SEO/AEO, űrlapok, keresés, link hub és kampányoldalak.
  - **Publikus oldalhéj és bővíthető oldalsó zónák:** egyetlen közös oldalgörgetés és a fő tartalomnak elsőbbséget adó középső oszlop; két desktop háttérzóna kezdetben teljesen üres, átlátszó. Mobilon eltűnnek, nem szűkítik a tartalmat. A későbbi widget-/támogatói-/szponzor-/reklámhelyek külön konfigurálható, biztonságosan renderelt és jogosultsághoz kötött slotok legyenek, közös Site/Brand Kit szín- és tipográfiai tokenekkel, stabil méretekkel (CLS), hozzáférhető elnevezéssel, világos hirdetésjelöléssel és szükség esetén consenttel. Az oldalsó helyek nem képeznek külön weboldalt vagy önálló görgetősávot. A megjelenítés a Visual Editor preview/publish működésével legyen paritásban.
- **Creator Control Center:** egységes Dashboard és külön Connections-központ; jogosultságok, állapotok, naplók, értesítések, hibák, szolgáltatói limitek és visszaállítási műveletek.
- **Creator Content Factory:** ötlet- és szerkesztőségi naptár, hosszú és rövid tartalom, VOD/clip/shorts munkafolyamatok, metaadatok, médiatár, verziók, jóváhagyás, időzítés, újrahasznosítás, publikálási állapot és csatornánkénti eredmények.
- **Live & Stream Operating System:** Twitch és további támogatott platformok, élő státusz, streamdiagnosztika, stream események, overlayek, alert, chat- és közösségi widgetek, botok, timer, poll, giveaway, loyalty, TTS és moderációs kapcsolódási pontok; OBS és ahol indokolt Stream Deck/egyéb vezérlőintegráció.
- **Community & Audience OS:** közösségi funkciók, audience identity, hozzájárulás és adatkezelés, támogatók, tagságok, szerepkörök, Discord-kapcsolatok, kampányok, védett tartalom és közösségi aktivitás.
- **Commerce & Creator Business:** digitális termékek, támogatás, tagság, előfizetés, merchandise-szolgáltató integráció, kuponok/kampányok, rendelési és entitlement-életciklus, szponzorációs pipeline, affiliate/kampánylinkek és pénzügyi események. A külső fizetési szolgáltatók csak külön biztonsági, jogi, díj- és megbízhatósági kapu után választhatók ki.
- **Analytics & Intelligence:** látogatottság, források, elköteleződés, tartalom- és streameredmények, konverzió, kampány, közösség és bevételi mutatók; magyarázható jelentések, export és adatmegőrzési szabályok.
- **Automation & Event System:** eseménybusz, triggerek, feltételek, műveletek, időzítések, webhookok, integrációs események, értesítések, hibakezelés, retry/idempotencia, jóváhagyás, szüneteltetés és vészleállítás.
- **SANCI AI / Creator Intelligence:** AI-copilot, specialista agentek, modell- és eszközregiszter, feladat- és kontextusválasztás, weboldal/komponens/tartalom generálása, szövegírás, SEO/AEO, alt text, fordítás, kampány- és streamtervezés, tartalom-újrahasznosítás, analitikaértelmezés, automatizációs munkafolyamatok és hibakeresés.
- **Platform & Ecosystem:** export/import, mentés/visszaállítás, multi-site/multi-brand, csapat és szerepkörök, entitlement/billing, bővítmények/marketplace, szolgáltatói adapterek, API/webhookok és későbbi SaaS-üzemeltetés.

### 34.2. AI biztonsági és működési szerződés

- Az AI javasolhat, tervezhet és előkészíthet, de az éles módosításoknak ugyanazon canonical command, permission, validation, persistence, revision/history és audit útvonalon kell haladniuk, mint a kézi műveleteknek.
- Az AI nem írhat közvetlenül D1-be vagy R2-be, nem kerülheti meg a jogosultságokat, nem tehet közzé automatikusan kockázatos műveletet külön engedélyezés nélkül, és nem kezelhet titkot promptként vagy naplózott szövegként.
- Különbséget kell tenni javaslat, előnézet, jóváhagyásra váró változtatás, végrehajtott művelet és ellenőrzött eredmény között.
- Legyen költségkeret, kvóta, rate limit, timeout, megszakítás, modell-/szolgáltató-váltás, visszavonás ahol lehetséges, auditnyom, prompt-injection elleni védelem, adatminimalizálás és felhasználói kontroll.
- A több lépéses agentfeladatnak explicit tervet, eszközengedélyeket, ellenőrzési pontokat, hibakezelést és eredmény-összefoglalót kell adnia. Magas kockázatú művelethez emberi jóváhagyás kötelező.
- Az AI nem lehet a platform egyetlen működési útja: minden kritikus funkciónak legyen manuális vagy szabályalapú alternatívája, és AI-kieséskor a core platform maradjon használható.

### 34.3. Márka és creator-élmény egységessége

- A márkaidentitás ne csak a publikus weboldalon jelenjen meg: a Dashboard, Editor, media library, tartalomtervező, stream overlayek, kampányok és AI-kimenetek is közös design tokeneket és brand-kontextust használjanak.
- A brand-kontextus verziózott és felhasználó által módosítható legyen; az AI által javasolt változás előnézhető és jóváhagyható.
- A platformnak támogatnia kell a magyar nyelvű elsődleges élményt, a későbbi többnyelvű bővítést, a lokalizált dátum-/idő-/pénznem-formátumokat, az akadálymentességet és a mobilon is végrehajtható fő feladatokat.
- A funkciók külön modulok, de közös domain-szerződések, design system, jogosultság, audit, hibakezelés és navigáció alatt működjenek; nem jöhet létre egymástól független, duplikált miniappok halmaza.

---

## 35. Felhasználói élmény alapelvei

- **Feladat szerint szervezett Admin:** a felhasználó azt a modult nyissa meg, ahol az adott feladat természetesen elvégezhető.
- **Valódi Visual Editor:** a vásznon látható elemek vizuálisan szerkeszthetők; a Layers, Inspector, responsive nézetek, előnézet és publikálás összefüggően működnek.
- **Egy változtatás mindenhol következetes:** közös adatot nem kell kétszer szerkeszteni; a kapcsolódó blokkok és publikus oldalak a kanonikus domainből frissülnek.
- **Különálló, de integrált munkaterületek:** a webshopot, integrációt, ütemezést vagy moderációt nem zsúfoljuk az Editor Inspectorába.
- **Átlátható állapotok:** loading, empty, error, stale, permission-denied, saving, saved, draft és published különbözik.
- **Mobilon is használható:** nem elegendő a desktop UI összenyomása.
- **AI-val vagy AI nélkül:** minden kritikus kézi folyamat érthető marad; AI-javaslat elfogadható, szerkeszthető és visszavonható.
- **Nincs hamis siker:** külső API-, publikálási, fizetési vagy küldési művelet csak a tényleges visszaigazolás után jelezhet sikert.

---

## 36. Kész és fejlesztendő funkciók szétválasztása

A tervben a teljes termékvízió és a fejlesztési sorrend szerepel; a tényleges készültség külön, valós bizonyíték alapján jelenik meg.

- **Meglévő alap:** a repositoryban megvalósított és korábban ellenőrzött technikai szerződés.
- **Elfogadásra vár:** a kód már létezik, de a teljes valós böngészős/éles/felhasználói folyamat nincs még lezárva.
- **Aktív fejlesztés:** a következő kijelölt implementációs pont.
- **Tervezett:** specifikált képesség, amely még nem tekinthető megvalósítottnak.
- **Külső függőség:** provider API, engedély, policy, költség vagy jogi feltétel miatt külön ellenőrzés szükséges.

A státusz nem lehet pusztán dokumentációból következtetett. Ha nincs aktuális bizonyíték, a funkció nem jelölhető késznek.

---

## 37. Integrációs központ és provider-képességek

Az Integrációk/Admin-központ egy helyen mutatja az összes csatlakoztatott platformot, jogosultságokat, egészségi állapotot, utolsó szinkront, hibákat, újracsatlakozást és leválasztást. Minden provider adapter egységes szerződést követ, de csak a szolgáltató által ténylegesen engedélyezett műveleteket teszi elérhetővé.

### 37.1. Elsődleges platformok
- **Twitch:** OAuth, live/offline, streamcím/kategória, chat és moderációs események a rendelkezésre álló scope szerint, VOD/clip/event adatok, követők/feliratkozók csak akkor, ha az API és jogosultság lehetővé teszi.
- **YouTube:** csatorna, videók/Shorts, streamütemezés és publikálás a támogatott API-műveletek szerint, analitika és quota-kezelés.
- **TikTok:** profil- és tartalomkapcsolatok, LIVE és publikálási funkciók kizárólag a fiókhoz és régióhoz elérhető hivatalos API-képesség szerint.
- **Discord:** szerverkapcsolat, bot, szerepkörök, értesítések, közösségi CTA-k és tagsági jogosultság-szinkron, a botengedélyek és szerverkonfiguráció szerint.
- **OBS Studio:** biztonságos pairing és WebSocket-alapú vezérlés, kapcsolatállapot, scene/source állapot, browser source, overlay, felvétel és stream műveletek csak explicit engedéllyel.
- **Későbbi provider adapterek:** Kick, Instagram, X, Patreon és más platformok csak a termékérték, API, policy, költség és karbantartási igény ellenőrzése után.

### 37.2. Egységes kapcsolati UX
Minden kapcsolatnál: csatlakozás, scope magyarázat, státusz, utolsó sikeres művelet, hiba és következő lépés, újracsatlakozás, biztonságos leválasztás, sync retry, provider-quota és részleges jogosultság jelzése. A provider hibája nem törölheti a kézi adatokat.

### 37.3. Többplatformos működés
Ahol hivatalosan támogatott, legyen közös chat/üzenetkezelés, streamcélok kezelése, tartalomnaptár, platformvariánsok, analitika és publikálási queue. A funkciók platformonként külön képességmátrixot használnak; a közös felület nem állíthatja, hogy egy művelet mindenhol elérhető, ha nem az.

---

## 38. Részletes Visual Editor képességkatalógus

**Szerepe:** kizárólag a WEB modulhoz tartozó Visual Editor (EDT) részletes képesség- és tesztkatalógusa. Nem jelenti azt, hogy az Editor a teljes platformot magába foglalja; a Brand Kit, erőforrások, kapcsolatok, adásrend, analitika, commerce, automatizáció és AI a saját kanonikus moduljuk tulajdonában marad. A felsorolás a végleges platform követelményét rögzíti, nem a runtime készültségét. Minden elem a közös Page Model, command/history/validation/persistence és jogosultsági szerződésen keresztül működik.

### 38.1 — Benchmark és képességbővítési szabály

A szerkesztői UX-et rendszeresen össze kell hasonlítani a Webflow, Wix Studio, Elementor, WordPress Site Editor/Gutenberg és Framer nyilvános funkcióival. Vizsgálandó: komponenskönyvtárak, breakpoints, canvas, design tokenek, templates/patterns, CMS, localization, SEO, redirect és publishing. A benchmark tanulságait át kell venni, nem a zárt kódot lemásolni. Ez reprezentatív kezdőlista, nem a teljes piac lefedettségének állítása.

### 38.2 — Preset-, template- és reusable-rendszer: kötelező fogalmi szétválasztás

A „preset” nem egyetlen funkció, hanem több külön, jól meghatározott művelet. Mindegyiknél látható legyen, hogy csak a kiválasztott elemre, az aktuális oldalra vagy globálisan hat-e.

1. **Property preset:** egy vagy több property-csoport előre mentett értékei, pl. árnyék, border, radius, typography, spacing, button state.
2. **Style preset:** egy elem teljes vizuális beállításcsomagja, tartalom nélkül vagy tartalommal jelölten.
3. **Layout preset:** flex/grid/stack/columns, gap, alignment, sizing és flow konfiguráció.
4. **Responsive preset:** breakpointokhoz és responsive behaviorhöz tartozó induló beállítások.
5. **Component variant preset:** egy reusable component hivatalos variánsa (size, density, color, layout, state).
6. **Element preset:** konfigurált, tovább szerkeszthető egyedi elem vagy elemcsoport.
7. **Section preset:** teljes, reszponzív, tovább szerkeszthető szekció.
8. **Page preset/template:** egy teljes oldal szerkezete és konfigurációja.
9. **Site starter/template:** oldalstruktúra, navigáció, header/footer, theme, tokens, component library és SEO-defaultok kiinduló csomagja.
10. **Theme/design-system preset:** színek, betűstílusok, spacing scale, radii, shadows, widths, breakpoints, motion és komponens-alapstílusok.
11. **Content/CMS preset:** tartalomstruktúra, collection mezők, mezősorrend, content blockok és alapértelmezett üres/hiba állapotok.
12. **Streamer preset:** creator-site szekciók, Twitch/stream állapotok, schedule, game/profile, social links és support megjelenítési változatok.
13. **Editor workspace preset:** panel-láthatóság, canvas elrendezés, zoom, segédvonalak, snapping és szerkesztői preferenciák; ez nem public-site adat.
14. **Importált/gyári preset és felhasználói preset:** az eredeti gyári elem védett marad; szerkesztéskor a felhasználó saját példányt/forkot készíthet.

Minden presethez, ahol értelmezhető, kötelező:
- stabil ID, név, leírás, kategória, címkék, preview/thumbnail, version és owner/site scope;
- keresés, szűrés, rendezés, kedvencek, legutóbb használt és kategóriák;
- alkalmazás előtt preview; alkalmazás után Undo; megerősítés romboló/globalis művelet előtt;
- **Apply / Replace / Merge / Reset / Save as new / Duplicate / Rename / Archive / Restore** művelet, ahol a preset típusa alapján értelmezhető;
- a felhasználói tartalom és resource reference-ek megtartásának világos szabálya;
- preset frissítésekor meglévő instance-ok változásának explicit jelzése; nincs rejtett, váratlan tömeges átírás;
- gyári, site-local, user-library és későbbi shared-library scope megkülönböztetése;
- schema/version migráció és érvénytelen preset hibakezelése;
- jogosultság, audit, export/backup és törlés előtti használatellenőrzés.

**Fontos:** a template másolható/forkolható kiindulási állapot; a reusable component/symbol közös definíció; a preset értékcsomag. Ezek nem helyettesítik egymást, és egyetlen canonical registry/reference-modellre épülnek.

### 38.3 — Canvas és szerkesztési interakciók

- Canvas automatikus szélesség/magasság, content-aware minimum size, hosszú oldal kezelése, scroll/zoom közbeni stabil geometria.
- Zoom in/out, fit page, fit selection, 100%, pan/space-drag, minimap vagy overview, canvas reset.
- Rács, baseline/grid, rulers, guides, smart guides, snapping to grid/edges/centers/spacing, snap toggle és snap threshold.
- Kijelölőkeret, resize handles, rotation handle ahol támogatott, bounding box, anchor/origin és transform preview.
- Egyszeres/többszörös kijelölés, Shift/Ctrl módosítás, marquee selection, parent/child kiválasztás, breadcrumb és „select parent/child”.
- Drag-and-drop insert, reorder, reparent, drop-target preview, insertion marker és invalid-drop tiltás.
- Billentyűzetes mozgatás, finom/nagy lépés, duplikálás, delete, undo/redo, copy/paste, duplicate, nudge, bring forward/back, bring to front/back.
- Copy/paste style, paste properties, reset property, reset to inherited, clear override.
- Kontextusmenü, command palette/quick actions, kereshető Add panel, recent/favorite elements, parancsok billentyűparancsai.
- Drag/resize alatt élő Page Model/command állapot, pointer-capture, cancel/escape, pointer loss, scroll-container és zoom-korrekció kezelése.
- Vászon overlay és editor selection decoration nem kerülhet a public renderer outputjába.
- Canvas render és selection hit-testing ne a DOM-ot tegye source of truth-szá; a canonical Page Model a mérvadó.

### 38.3.A — Visual Editor egységes adaptív UI-dizájn döntés (2026-10-22; SPEC, nem implementált)

**Választott irány:** Figma-szerű ikoncentrikus eszköz- és Layers kezelés + Webflow-szerű logikusan csoportosított tulajdonságpanel + Framer-szerű letisztult, vászonközpontú és responsive munkatér. Saját koherens komponens-, ikon-, spacing-, szín- és tipográfiai rendszer; nem három külön UI másolata. A meglévő aktív editorfejlesztési cursor és Save ≠ Publish kapuk változatlanok.

**Nem átfedő dockolt panelek — kötelező:** normál szerkesztésben a bal és jobb oldali kinyitható/dockolt panelek NEM lebeghetnek rá a vászonra; nyitás, zárás, átméretezés, viewport- és készülékváltás esetén a középső munkaterület újraosztja a rendelkezésre álló helyet, a canvas zoom/fit és pan anchor stabil, az aktív kiválasztás és szerkesztési fókusz nem vész el. A publikus viewport szerkesztett szélessége külön fogalom a canvas külső rendelkezésre álló terétől: NE tördelje át észrevétlenül a cél-oldalt csak azért, mert panel nyílt; szükség esetén a megjelenítés skálázódik vagy finoman pan-elhető, egyértelmű viewport méret- és zoom-kijelzéssel. Előre definiált minimum vászonszélességnél automatikusan egy panel marad nyitva, vagy kompakt módra vált; soha ne legyen vízszintes teljes oldal-overflow. Panel mozgatásnál a vászon körüli editor chrome alakítható, de a dokumentum geometria és drag/resize hit-testing ugyanazon stabil koordinátarendszeren marad. Csak explicit felhasználói „floating/overlay panel” alternatív mód (ha később egyáltalán létezik) lehet felülúszó, alapértelmezésben tiltva.

**Desktop szerkezet:** kompakt felső global toolbar: oldal/mentési állapot, undo/redo, breakpoints desktop/tablet/mobile, zoom, előnézet, külön Mentés és Publikálás. Bal oldalt keskeny ikonrail: Insert, Layers, Components, Templates, Assets, optional AI; a választott eszköz kontextuális panelje külön dockolt szélességet kap, a váltás nem halmozza fel a panelokat. Jobb oldalt kijelölésfüggő, kereshető Inspector: Tartalom, Elrendezés, Stílus, Animáció, Interakció, Haladó/Accessibility; az értelmes alegységek accordionok, compact field grid, contextual controls, unit dropdown és keverhető slider/direct input. Csak releváns beállítás látszik, advanced opció igény szerint kinyitható; többszörös kijelölésnél csak kompatibilis common property-k. Középen maximális vászon és szerkesztési eszközök (rulers/guides/selection), reszponzív preview/fit, optional fullscreen focus mode. Dock szélesség változtatható és felhasználónként/szerkesztői eszközönként megjegyezhető, nem Page Model adat.

**Ikon és segítség szabály:** ahol egyértelmű, ikon az elsődleges navigációs forma; azonos ikonrendszer, optikailag következetes méret és active/hover/focus/disabled állapot. Egér-hover tooltip: rövid funkciónév + egymondatos haszon + shortcut ahol van; keyboard focus-ra ugyanilyen tooltip; mobilon touch/long-press, szükség esetén egyszerű, olvasható címkék. Kritikus/destruktív műveletek, állapot, hiba és Mentés/Publikálás NEM kizárólag ikonból vagy hoverből érthető: elérhető label/confirmation/status; screen reader accessible names. Ne legyen minden beállításnál külön, helyfoglaló információs szöveg vagy ikon: inline helper csak hibánál, első bevezetésnél vagy valóban összetett vezérlőnél; magyarázat egyébként kontextuális tooltip/popover. Tooltip ne mozdítsa a dock/canvas layoutot, legyen elérhető hover/focus esetén és ne fedje el tartósan az aktív inputot.

**Ikon- és méretarány-elv (2026-10-22 kiegészítés):** ikon-first, de nem ikon-only: közismert és egyértelmű műveletek önálló ikont használhatnak; ritka, kétértelmű, veszélyes vagy fontos állapotjelző műveletnél rövid szövegcímke is szükséges. Nincs kötelező globális, egyforma ikon-, gomb-, panel-, szöveg- vagy mezőméret: szerepalapú, optikailag kiegyensúlyozott méretskála (például kompakt secondary ikonok, kiemelt primary action, tartalomnak megfelelő panel/csoport szélesség és sűrűség), reszponzív és helyzetfüggő változatokkal. Az ikon vizuális mérete és a kattintható/érinthető célterület külön kezelendő; mobilon nagyobb hit-area, billentyűzetes fókusz, hozzáférhető név, tooltip/focus súgó és indokolt címke kötelező. Nem cél a mindent ugyanakkorára kényszerítő uniform UI: a hierarchia, csoporton belüli következetesség és az érthetőség fontosabb; a tartós feliratok csökkenthetők, de a Mentés/Publikálás és fontos hibák/állapotok felismerhetőségét védeni kell. A komponensrendszer méretvariánsokat (xs/sm/md/lg/adaptive), tartalomhoz illeszkedést és egyedileg finomhangolható dock méreteket támogat; ne legyen véletlenszerű, széteső méretezés.

**Témák és testreszabás:** editor UI light/dark/system, sűrűség compact/comfortable, opcionális icon-label megjelenítés, panel-layout presetek (minimal, balanced, advanced), személyes shortcut/keymap és panel állapot visszaállítás; az Editor UI Theme független a publikus oldal Brand Kit theme-től. Presets/Assets keresés, kedvencek, recents, kategóriák, drag insert, shortcut/command palette. Szerkesztői preferencia site/user scope-ban, explicit reset és sensible defaults.

**Mobil és keskeny ablak:** nem a háromoszlopos desktop összenyomása. Vászon + kontextuális alsó sheet (closed/half/full), alul ikon-navigation és toolbar safe-area-aware; sheet megnyitásakor a látható canvas viewport igazodjon az elérhető helyhez, a kijelölt elem lehetőleg látható maradjon, ne legyen fókusz/IME szövegkijelölés elvesztés vagy teljes oldal újratöltés. Az érintős UI-n nincs hover-előfeltevés; hosszan nyomás és kiegészítő címke/segítség. Egyidejűleg csak indokolt fő panel aktív. Hardveres billentyűzettel focus kezelés és Escape/Back logikus.

**Elfogadás/teszt:** desktop nagy és kis szélesség, tablet álló/fekvő, mobil és 200% zoom; bal/job panel külön és egyszerre nyitás/zárás/resize; viewport-breakpoint nem változik véletlenül, nincs overlay a vászonon, nincs vízszintes clipping/scroll, kiválasztott elem és input/IME fókusz megtartás, drag/resize helyes geometriával, Layers->Canvas->Inspector parity. Tooltip egér/focus/érintés, akadálymentes nevekkel, megfelelő kontraszt és screen reader; Save/Publish külön; UI theme független webhelytémától. Jelenleg TERV; nem jelölhető implementáltként. A pontos méretek, ikonválasztás, panel-dűlő viselkedés és részletdesign az elfogadott alapirányon belül tovább finomítható.

### 38.3.B — Bal eszköztár, jobb Inspector és workspace részletes UX-szerződés (2026-10-22; SPEC / IMPLEMENTÁCIÓ NYITOTT)

**Designcél és források:** egységes Creator Editor, nem Figma/Webflow/Framer-klón. Figma: kompakt ikonrail, kiválasztott tab alapján dinamikus bal panel, panel-átméretezés és rétegfa; Webflow: kereshető, hierarchikus Navigator, releváns tulajdonságcsoportok és fókuszmód; Framer: vászon elsőbbsége és eszközkrom visszafogottsága. Referencia: https://help.figma.com/hc/en-us/articles/360039831974-Explore-the-navigation-bar-and-left-sidebar ; https://help.webflow.com/hc/en-us/articles/33961320786451-Navigator ; https://help.webflow.com/hc/en-us/articles/33961362040723-Style-panel-overview . Ezek inspirációk, nem függőségek.

**1. Workspace régiók, hierarchia és rugalmas méretek.**
- Felső keret: vissza az Adminba, oldalválasztó + draft/dirty státusz, Undo/Redo, viewport/breakpoint és zoom, Preview, külön és közérthető **Mentés** / **Publikálás**. A státuszok szövegesen is kiolvashatók, veszélyes/mélységi műveletek nem ikon-only.
- Bal ikonrail (javasolt optikai keret 44–60 CSS px, érintési cél méret preferált minimum 44×44 px) és tőle jobbra csak EGY aktív tartalompanel (tipikus 250–360 px, átméretezhető; nem fix kötelező méret). Panelek szélességét és induló állapotát workspace preference őrzi.
- Középső canvas flexibilis 1fr; panelnyitás/csukás/drag resize a rendelkezésre álló helyet osztja újra, **nem** borít rá a canvason kijelölt objektumra. A választott weboldal viewportja és layout breakpointja változatlan marad; szükség esetén fit/zoom vagy a munkatér *belső* pan/scroll segít, a publikus oldal külön, egységes document-scroll szerződése érintetlen.
- Jobb Inspector alapból kontextuális, szélessége példaként 300–420 px, átméretezhető / összehúzható, nem kell a bal panelével azonosnak lennie. Kezelőinek mérete tartalom- és műveletfüggő. Keskeny desktopnál kompakt rail, egy aktív panel, canvas-minimumot védő responsive workspace switch; nincs ráúszó panel standard módban.
- Alsó kisméretű canvas status strip opcionálisan: kijelölés/elemútvonal, snap, zoom, segédvonalak. Ne duplikálja a felső mentés/publikálás részt.
- Semleges, jól olvasható chrome és visszafogott kiemelőszín; adaptív light/dark/system, méret/density opciók; publikus Brand Kit teljesen független az editor UI témától.

**2. Bal oldali ikonrail sorrend és csoportok.**
- **Építés:** + Elemek (keresés, struktúra/layout, szöveg, média, gomb/CTA, interaktív, űrlap, creator, dinamikus tartalom), Layers/Rétegek (fa, collapse, keresés, lock/visibility, reparent/drag), Components (szimbólumok és instance-ok), Templates & Sections (gyári és saját).
- **Erőforrások:** Media/Assets (R2 Asset Registry), Brand Kit/Styles (tokenek, színek, tipográfia), opcionális Data/CMS (csak amikor támogatott); elérhetőség/hiányzó provider állapot jelölve.
- **Eszközök:** AI-asszisztens külön tudatos nyitás/jóváhagyási határral; oldalszintű settings, shortcuts/help az alsó ritkább csoportban. Shop, Twitch/integráció, OBS és kampány adminisztratív kezelés **nem** épül bele külön panelként a Visual Editorba; csak a már regisztrált weboldal-komponenseik jelenhetnek meg Elemek közt.
- Rail alapállapot: egyértelmű ikonok, active mark, hover/focus tooltip név+egymondatos magyarázat+shortcut, dedikált shortcut help; nincs szöveges sáv minden ikon mellett. Kétértelmű ikonhoz rövid címke/kiegészítő popover. Felhasználó választhatja a címkézett/kezdő módot.
- Panelen belül kontextusfüggő search, kategóriachipek, Favorites/Recent, vizuális thumbnail és compact list/grid kapcsoló. Add flow: kattintással beszúrás a kiválasztott konténerbe vagy drag preview a canvasra, invalid drop állapot magyarázattal.
- Rétegpanelen hover a canvas megfelelő elemét emeli ki és fordítva; selection nem módosul hoverre; click/tap választ, keyboard nyilak és Enter navigálnak; lock/visibility külön az éles weboldal beállításától.

**3. Jobb oldali Inspector információarchitektúra.**
- Fejléc: elemikon + szerkeszthető elemnév + breadcrumb, device override/mixed-state, lock/visibility/duplicate/more; selection hiányában page-level gyorsbeállítások. Többszörös kijelölés esetén közös kompatibilis mezők, mixed érték és egy Undo egység.
- Fő tabok ikon-first (tooltip/focus segítséggel, aktív cím szükség szerint): **Tartalom** (text/media/links), **Elrendezés** (display, flex/grid, size, position, spacing), **Stílus** (typography, colors, backgrounds, borders, effects), **Animáció** (trigger/presets/timeline), **Interakciók** (states/actions), **Haladó** (accessibility, SEO where relevant, binding, debug). Ha egy elemnek nincs adott képessége, tab rejtett vagy egyértelműen disabled magyarázattal; tab-sorrend konzisztens. Search minden elérhető csoportban, rendezett találatokkal.
- Az aktív tabon belül 2. szintű logikus accordion-csoportok, alapértelmezésben a gyakori nyitva; Focus mode: egyszerre egy rész nyitva. Nem legyen 20 azonos vizuális súlyú nagy blokk. Csoportokban 2-oszlopos kompakt mezők, ha elegendő hely; megmaradó mezők teljes szélességűek. A spacing/flex/grid/transform konfigurációknál kicsi, vizuális kontroll (box model, 3×3 alignment, axis/anchor), érték és mértékegység külön.
- Számbeviteli UX: numeric + stepper/drag scrub where safe; unit chooser (px, %, rem, em, vw/vh, auto, etc. csak releváns esetben), reset inherited és breakpoint indicator. Egérrel görgetés csak explicit fókusz/intent mellett változtathat értéket; beírt mező fókusza/caret/IME kijelölése render során stabil. Inputs validáció nem blokkolhat normál gépelést.
- Megszokott műveletek egyetlen, gyors elérési útvonalon; ritkább haladó property-k nincsenek eldobva, csak kereséssel vagy Haladó módban elérhetők. „?” ikonok halmozása helyett igény szerinti tooltip/popover, bonyolult helyzetekben példával; no auto-open modal.
- Hover/focus tartalom: felirat, rövid leírás, billentyűparancs, figyelmeztetés/következmény; tooltipek nem váltják ki az aria-labelt, fókuszláthatóságot, hibaszöveget és mobilos hozzáférést. Tooltip késleltetés mérsékelt, ne vibráljon a sűrű ikonsávban.
- Animáció tab: kontextusfüggő presets, Play/Stop Preview, trigger, timing, priority; a Motion Studio részletes timeline-ja szükség esetén szerkesztésre használható külön dockolt nagyobb panelként úgy, hogy a canvas ne legyen kitakarva.

**4. Kontextuális eszközök és műveleti prioritás.**
- Vászonon kijelölt elem mellett csak néhány, közvetlen szerkesztéshez kapcsolódó kisméretű quick action (edit text, duplicate, move, layout, more) jelenjen meg; ne takarjon fontos tartalmat. Teljes eszközkatalógus továbbra is az Inspectorban.
- Kattintás / jobb kattintás menük a selectiont és a node parent útvonalat követik. Command palette: kategorizált keresés, diszkrét shortcut javaslat, discoverability, tiltott akció disabled.
- Panel open/close / layout switch soha nem jelent implicit Save/Publish műveletet; navigáció közbeni unsaved changes védelem változatlan.

**5. Mobil/tablet UX.**
- Tablet fekvő nézetben a panelek adott szélességnél dockolhatók; tablet álló/mobil esetén egy aktív alsó sheet (closed/half/full) és kompakt bottom nav. Sheet nyitásakor a canvas rendelkezésre álló látható tere csökken és skálázható, de az authored viewport nem törik át implicit.
- Mobilon tooltip helyett long-press vagy tap-to-help / kontextuscímke; minden fontos fő funkció stabilan megnyitható. Safe area, virtuális keyboard és visszalépés nem veszti el kijelölés/fókusz/IME kompozíció állapotát; mentés/publikálás elérhető, de egymástól világosan elkülönül.

**6. Elfogadási kapuk és végrehajtás.**
- Először UI tokenek, ikonregiszter, panelek/dock layout + state persistance; majd bal Add/Layers/Assets/Components; jobb Inspector tabok/group registry; unit controls/tooltip/keyboard; tablet/mobil sheet; animáció integráció. Ezek a meglévő F0/F2/77.44 szerződéshez tartoznak, NEM új párhuzamos roadmap.
- Chromium e2e: panelek külön/együtt nyitás/zárás és resize, világos/sötét téma, 1280/1440/1920 desktop, tablet/mobil portrait és landscape, 200% zoom, canvas hit testing és scroll anchor, layers selection sync, inspector search és focus/caret, drag/drop, tooltip hover/focus, keyboard+touch, reduced motion, Undo/Redo/Save ≠ Publish és publikus paritás. Összecsukott és extrém keskeny nézetben nincs vízszintes document overflow, nincs panel-vászon ütközés.
- A pontos méretek ajánlott kiindulópontok, nem törvényi állandók; finomítás után kézi PC/Android elfogadás kell. 2026-10-22: **csak specifikáció, implementation/CI/deploy/unified manual acceptance OPEN**.

### 38.4 — Oldalmodell, Layers és struktúra

- Page → template/section → container/layout → element hierarchia, stabil node ID-val.
- Layers fa: keresés, név, ikon/típus, collapse/expand, drag reorder, reparent, rename, duplicate, delete, hide, lock, unlock, multi-select.
- Layer visibility és lock állapota külön kezelendő a public visibility/conditional rendering szabálytól.
- Csoportosítás/felbontás; wrapper létrehozása; groupból kiemelés; több node együttes igazítása és elosztása.
- Parent/child breadcrumb; hierarchy outline; node típus és megengedett gyermekek; invalid nesting és circular parent tiltása.
- Üres container, section és page drop-target; üres állapotból elem hozzáadása.
- Copy/cut/paste azonos oldalon és később oldalak között, ID-regenerálással és resource/binding reference-ek biztonságos rendezésével.
- Node állapotok: selected, focused, hovered, locked, hidden-in-editor, hidden-on-breakpoint, inherited, overridden, invalid, data-bound.
- Több node property-szerkesztése csak közös, kompatibilis property-kre; eltérő értékek mixed-state megjelenítése.
- Reusable component instance és belső child szerkesztésének egyértelmű módja; instance override vs. main definition.

### 38.5 — Layout, geometry és CSS-szintű vizuális tulajdonságok

- Display: block/inline/inline-block/flex/grid/none és a támogatott semantic layout primitive-ek.
- Sizing: width/height/min/max, auto, fit-content, min-content, max-content, aspect ratio, intrinsic sizing.
- Units: px, %, rem/em, vw/vh, svh/lvh/dvh és támogatott CSS clamp/min/max/calc-szerű értékek validált, UI-barát kezelése.
- Position: static/relative/absolute/fixed/sticky; inset/top/right/bottom/left; z-index; containing block és stacking context jelzése.
- Flex: direction, wrap, justify, align, gap, order, grow/shrink/basis, align-self.
- Grid: template columns/rows, auto-fit/auto-fill, minmax, gap, alignment, placement, span, auto-flow és named areas ahol támogatott.
- Stack/row/column, nested containers, responsive reorder és content flow.
- Spacing: margin, padding, gap, logical properties, linked/unlinked sides, negative margin csak validált és indokolt esetben.
- Overflow: visible/hidden/clip/auto/scroll; scroll container; sticky/overflow konfliktus diagnosztika.
- Alignment/distribution: left/center/right, top/middle/bottom, space-between/around/evenly, equal-size, align-to-selection.
- Box sizing, border, radius, outline, shadow, opacity, blend mode, background color/image/gradient/video (video háttér csak performance/accessibility korláttal).
- Transform: translate/rotate/scale/skew, transform origin, 2D/3D csak biztonságos és tesztelt scope-ban.
- Aspect ratio, object-fit/object-position, image focal point, crop/cover/contain.
- Container width, full-bleed, boxed layout, content max-width, section inner width, viewport-aware spacing.
- Inspectorben pontos értékbeírás és vásznon drag; mindkettő ugyanazt a command/property-registry útvonalat használja.
- Computed/inherited/overridden értékek megkülönböztetése; invalid CSS vagy nem támogatott érték nem menthető csendben.

### 38.6 — Typography, colors és design tokens

- Font family, font loading, fallback, size, weight, style, line-height, letter/word spacing, text transform, decoration, alignment, wrapping, hyphenation és text balance.
- Heading level (H1–H6) a vizuális stílustól külön; link, emphasis, inline code, quote és rich-text struktúra.
- Global color palette, semantic tokens (primary/surface/text/border/success/warning/error), gradients, transparency és contrast preview.
- Global typography roles (display/headings/body/caption/label/code) és user-defined text styles.
- Spacing scale, container widths, breakpoints, radius, border, shadow, z-index layers, motion duration/easing token.
- Token létrehozás/átnevezés/használatkeresés/átállítás/törlés előtti dependency check.
- Token vs. literal value: jelölés, „convert to token”, „detach from token”, token reset és site-wide impact preview.
- Theme/style variations, light/dark/high-contrast theme előkészítés; a tényleges váltás csak explicit theme supporttal.
- Font asset/license metadata, font display/performance és unavailable-font fallback.
- Site-wide global style change előtt érintett oldalak/komponensek előnézete és undo/rollback.

### 38.7 — Inspector és Property Registry

- Inspector kategóriák: Content, Layout, Size, Position, Spacing, Typography, Appearance, Background, Border/Shadow, Effects, Responsive, Interactions, Accessibility, SEO, Data/Bindings, Advanced.
- Kontextusfüggő property-k csak az adott node type által támogatottan jelenhetnek meg.
- Property search, kategóriafilter, recent properties, favorites, tooltip/help, default/inherited/override jelzés.
- Reset property, reset group, reset to breakpoint parent, reset element to preset, copy/paste property group.
- Input validation, unit validation, min/max, enum, required fields, invalid value, dependency/compatibility warnings.
- Property change → command → validation → history → dirty state → save/reload round-trip.
- Batch edit, mixed values, apply to all selected compatible nodes.
- Property registry schema version, deprecation notice és migráció; új UI nem tarthat fenn második property store-t.
- Advanced CSS/custom attributes csak későbbi, explicit sandbox/security contracttal; arbitrary script nem futtatható a szerkesztői jogosultság miatt.

### 38.8 — Elementek és tartalmi komponenskatalógus

Az Add/Insert katalógus kereshető, kategorizált, preview-val és preset-változatokkal. Legalább az alábbi elemtípusok képességeit kell megőrizni a megfelelő phase-ben:

- Structure: Section, Container, Row, Column, Stack, Flex, Grid, Spacer, Divider, Separator.
- Content: Text, Heading, Rich Text, Quote, List, Numbered List, Table, Code, Badge, Icon, Image, Gallery, Video, Audio, Embed.
- Navigation: Header, Footer, Navbar, Menu, Breadcrumbs, Tabs, Anchor, Pagination, Back-to-top.
- Action: Button, Link, CTA, Icon Button, Download, Share.
- Cards/collections: Card, Feature Card, Profile Card, Game Card, Stream Card, Product Card, List/Grid/Carousel/Slider.
- Interactive: Accordion, Tabs, Modal/Dialog, Tooltip, Popover, Toggle, Disclosure, Search, Filter, Sort.
- Form: Form shell, text/email/url/number/date/select/checkbox/radio/textarea fields, validation/help/success/error state; secure submit handler külön canonical domain.
- Media: image/video/audio embeds, responsive source, poster, captions/transcript, aspect ratio, lazy loading.
- Social/creator: Twitch live/status/player/chat where permitted, schedule, countdown, channel link, VOD/clip link, social icon row, community invite, support CTA.
- CMS/data: collection list, item template, dynamic field, reference/relationship, empty/loading/error state, conditional block, pagination/filter.
- Commerce future: product/collection/price/stock/CTA and external checkout boundary; order/payment state nem lehet egyszerű Page Model tartalom.
- Future app slots/widgets: explicit capability and security boundary, not arbitrary injected code.
- Minden elementhez type-specific schema, defaults, accessible output, responsive behavior, Inspector mapping, validation, preview, tests and public renderer support kell.

### 38.9 — Responsive design és device preview

- Desktop/tablet/mobile előre definiált nézetek, egyedi breakpoints és custom viewport width/height.
- Breakpointok egymás melletti preview-ja, single-breakpoint mode, rotate/portrait-landscape preview.
- Resize drag handle és pontos viewport mező; common device presets, custom device preset.
- Cascading/inherited style model: nagyobb breakpoint értékei öröklődnek; kisebb breakpoint override nem írhatja felül észrevétlenül a nagyobbat.
- Property-level breakpoint overrides; reset inherited; copy breakpoint settings; clear all overrides with confirmation.
- Responsive behavior: fluid, scale, fixed, min/max, wrap, stack, reorder, hide/show, overflow strategy, typography scaling.
- Breakpoint-specifikus layout és visibility; tartalmi/strukturális változás közös modellben marad, ha nem indokolt valódi külön node.
- Oldal-, section- és komponensszintű breakpointok összehangolása; konfliktus és nem használt breakpoint jelzése.
- Minimum width/overflow/overlap/viewport clipping diagnostics; szélső méretek és zoom tesztek.
- Canvas height és scroll extent újraszámítása drag/resize/content growth közben, zoommal és transformmal korrigálva.
- Responsive preview nem külön mobil Page Model és nem külön save route.
- Device presets nem helyettesítik a valódi browser/device tesztet.

### 38.10 — Motion, interaction és állapotok

- Hover, focus, active, disabled, selected, expanded/collapsed, loading, success, error és empty states.
- Link/action target, anchor, external/internal navigation, download, open-in-new-tab, safe rel policy.
- Hover/focus transitions, entrance/exit, scroll-triggered motion és component interaction presets.
- Duration/easing/delay, trigger, target, replay, reduced-motion alternative, animation conflict warning.
- Interakciók explicit trigger/action modelben; preview-ban szimulálhatók, de szerkesztői műveletet nem hajthatnak végre.
- Form success/error, media load failure, empty CMS collection, offline/unavailable integration állapotok.
- Tab/focus order, keyboard operation, escape/cancel és focus return.
- Motion és third-party embeds csak performance/privacy/accessibility guardrail mellett.

### 38.10.A — Egységes vizuális animációs rendszer és Motion Studio (2026-10-22, TERV / NINCS IMPLEMENTÁLVA)

**Tulajdonos és routing:** EDT-040 (Page Model, Animation/Interaction registry, Editor Inspector/Canvas/Public parity), 38.10, P02/F2 motion; Brand Kit az animációs tokenek/presetek gazdája, Asset Registry/R2 az animált állományoké, CAM a szponzorkampányoké, OBS az élő overlay animé, ANALYTICS a mért kampánymutatóké. Egyetlen schema és runtime, nem egymással versengő animációmotorok vagy külön Visual Editor. A meglévő 77.44 feladat végrehajtását nem szakítja meg.

**Animációk és tartalom:** (1) entrance/exit: fade, slide, zoom, blur-reveal, rotate, flip, fold, mask/clip reveal, stagger, text word/line/character reveal; (2) attention: pulse, float, bounce, wiggle, shake, glow, gradient motion, color/opacity, hover tilt, 3D transform/perspective, button microinteraction; (3) scroll: in-view, scroll-linked, parallax, pinned/sticky storytelling, progress, horizontal section, depth/layer; (4) state/layout: accordion/tab/card flip, modal, shared element, list reorder, tabs, page/View Transitions (fallback); (5) timelines: multi-track/keyframe editor, offsets, labels, sequencing, looping/yoyo, playback direction, speed, spring/bezier/easing, event chaining, scrub and seek; (6) SVG paths, line draw, morphing (only validated compatible shapes), Lottie/.lottie and Rive state machines subject to verified runtime/licensing; (7) carousels: continuous seamless marquee, ticker, sponsor-logo rail, card/image/product/testimonial carousel, autoplay/swipe/snap/drag, pause-on-hover/focus, accessible manual controls; (8) future advanced media: controlled canvas/WebGL/3D only with isolation, device capability gate and static fallback.

**Visual Editor UX:** minden elem Animáció panelje kereshető, kategorizált live preset gallery-val és preview/play/pause/restart; no-code trigger->target->action editor; timeline/keyframes, visual easing curve/spring, transform origin, perspective, delay/duration/iteration, multiple effects and conflict warnings; copy/paste/save custom presets, site/section/symbol-level shared tokens; desktop/tablet/mobile override & device preview; bulk animation on multi-select and stagger groups; responsive context overrides; Undo/Redo, Draft Save ≠ Publish, revision diff/rollback. Drag/resize közben az animáció vizuális transformja nem ronthatja az Inspector geometriai mérését. Inspector/Canvas/Preview/Public ugyanazt a validált sémát és állapotot használja. Szerkesztéskor csak explicit Preview indíthat animációt, hogy ne akadályozza a kijelölést.

**Végtelen szponzorsáv (sponsor marquee) első kiemelt preset:** tetszőleges, sorba rendezhető logó/kártya, alt-szöveg, megnevezés, cél-URL, opcionális kampány/partner kapcsolat; teljes szélességű oldal-/section-elem, később opcionális oldalsó slot vagy OBS-variáns ugyanazon médiaforrással; bal/jobb irány, sebesség, spacing, responsive item width, gradient mask, logo monochrome/color, hover effect, drag/swipe, szünet egér/fókusz/touch-interakció és oldal háttérbe kerülésekor, valóban hézagmentes ciklus klónozott vizuális elemekkel úgy, hogy a képernyőolvasó ne olvassa a duplikátumokat; kevés elemnél nem kötelező a kényszerített loop. Szponzorált tartalom látható jelölése, biztonságos linkek, kontraszt és billentyűzetes használat; jövőbeli kampányadat csak CAM jóváhagyott, site-scoped nézetéből, sosem automatikusan publikált privát deal.

**Implementációs döntés / könyvtárértékelés:** CSS + natív Web Animations API az egyszerű állapotokhoz; Motion for JavaScript vagy GSAP a komplex keyframe/scroll/timeline esetekre — választás előtt valódi csomagméret, framework-kompatibilitás, licenc, Cloudflare Workers/SSR, karbantarthatóság, biztonság, teljesítmény és Canvas/Public-paritás spike; Embla csak valódi carousel funkcióhoz, saját kiszámítható marquee megoldás vagy validált carousel extension folyamatos futáshoz. dotLottie opcionális animált média, Rive csak explicit interaktív asset-típusként, külön import és state-machine validáció. Ne húzzuk be automatikusan az összes motort a fő bundle-be; feature-gated lazy-loading és verziópinnel. Felhasználói CSS/JS futtatás nem engedélyezett, asset/URL-protokoll allowlist és CSP érvényes.

**Minőség, accessibility, security:** alapvetően transform/opacity és compositor-barát animáció, layout thrash és nagy blur/shadow kerülendő; IntersectionObserver, visibility pause, erőforrás- és számosság-limit, low-end mobile/stream browser source performance budget; `prefers-reduced-motion` és felhasználói pause/disable, statikus fallback és olvasható tartalom JS/asset failure esetén; soha nincs veszélyes villogás, autoplay focus-steal, scroll-jacking vagy navigációt blokkoló hosszú effekt. WCAG, keyboard/focus/ARIA, pointer/touch és RTL vizsgálat, CSP/XSS és külső asset adatvédelmi követelmények. SEO/SSR: érdemi szöveg és link ne csak animáció után létezzen.

**Teszt- és elfogadási kapu:** schema migration/backcompat, sérült konfigurációval safe fallback, page model revision és multi-tenant izoláció; Playwright Chromium + mobil breakpoint + Firefox/WebKit, valós kézi Android/desktop; trigger, replay, loop seam (nincs villanás), resume/pause, keyboard, reduced-motion, hidden-tab, resize, 200% zoom; Inspector-Canvas-Public screenshot/geometry, Save/Publish/Undo/Redo/rollback; CLS, Long Tasks, FPS/jank, bundle budget, low-end fallback; kampány privatizálás és R2 asset auth. Csak bizonyított CI, Production SHA és külön kézi elfogadás után PASS.

**Fázisok:** M0: engine-adapter + sémák + egyszerű entrance/hover; M1: marquee/carousel + preview és alap presetek; M2: timeline/keyframe/scroll/text/stagger; M3: SVG/Lottie/Rive/advanced transitions; M4: CAM/OBS cross-module reuse és analitika. A funkcionalitás előbb biztonságos és szerkeszthető, utána gazdagodik; nincs automatikus éles publish.

**Kutatási források (2026-10-22):** https://motion.dev/docs ; https://gsap.com/docs/v3/Plugins/ScrollTrigger/ ; https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API ; https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API ; https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion ; https://www.embla-carousel.com/docs/v8/api/options ; https://docs.lottiefiles.com/en/runtimes/distributions/js .

### 38.10.B — Általános animálhatósági szerződés: minden értelmezhető elemre (2026-10-22, SPEC ONLY)

**Alapelv:** az animáció nem szponzorsávhoz kötött funkció; a Visual Editor bármely, értelmesen animálható node-ja, rész-eleme, állapota vagy komponenscsoportja az egységes EDT-040 Motion Studio rendszerrel animálható. A szponzormarquee csak egy gyári preset. Nem készül típusonként párhuzamos animációmotor. Új elem bevezetésének kötelező része az animálhatósági manifest (támogatott tulajdonságok, triggerek, reduced-motion és fallback), vagy dokumentált indok, amiért az adott elem nem mozgatható.

**Lefedettség:** page/hero/section/container/flex/grid/stack/column, háttérréteg és shape; heading/text/richtext/spans, karakter/szó/sor csoportok; kép, videóborító, SVG, ikon, galéria, slideshow és média-kártya; gomb/link/CTA, badge, divider, card, stat/progress, countdown; navigáció/menu, tab, accordion, tooltip, dropdown, dialog; form input/label/hiba/siker állapotok; CMS-lista, dinamikus kártyák, filter és rendezés; shop termék, community és schedule blokkok; embed körüli wrapper (külső iframe tartalmát nem animáljuk/vezéreljük); szponzor, logo carousel/ticker; overlay/OBS csak az OBS domain erre engedélyezett adapterével. Lehet animálni egyedi elemet, kijelöléscsoportot, komponensszimbólumot és egymás után/stagger elrendezett gyermekelemeket. Sem tiltott fókusz-, olvashatósági, sem fizetési/biztonsági interakció nem változhat pusztán vizuális animáció miatt.

**Egységes vezérlés:** megjelenés/eltűnés, hover/focus/active/checked/expanded/selected/loading/success/error, viewport enter/leave, scroll progress, klik/tap, időzítés, szerkesztőben explicit preview; property keyframes, transform/opacity/clip/color (ha biztonságos), origin/easing/spring, delay/duration/iterations/direction, loop, timeline, sequence és állapotátmenetek; trigger priority/conflict handling, inherited és breakpoint-specifikus override. Lehet egy tulajdonságot külön vagy több animációt összehangoltan módosítani. Nem minden animáció való minden elemhez: context-aware Inspector kizárja a nem támogatott effektet, magyarázza a korlátozást, és szükség esetén a wrapperre ad biztonságos alternatívát.

**Következetesség:** a szerkesztő előnézet, Canvas, Preview, mentett draft, publikált renderer, másolt sablon és későbbi AI page-creation ugyanazt a Motion Schema/Animation Registry szerződést használja. Az AI csak validált animációkonfigurációt javasolhat, diff/preview/jóváhagyás után írhat, automatikus publikálás nélkül. Save ≠ Publish, Undo/Redo, breakpoint és korábbi tartalom továbbra is megmarad. Animált transform csak megjelenítési réteg; ne módosítsa véletlenül a drag/resize alapgeometriáját vagy fókuszsorrendet.

**Kötelező UX és teljesítmény:** minden mozgáshoz reduced-motion statikus vagy lényegesen csökkentett alternatíva; pause/resume a loopokra, rejtett lap felfüggesztése, billentyűzetes és érintéses működés, képernyőolvasó-duplikációk elrejtése, 200% zoom és reszponzív ellenőrzés. GPU-barát mód, elem- és egyidejű animációszám-korlát, warning túlzó effekt/kumulált mozgás/CLS/flicker esetén; alacsony teljesítményű eszközre fallback. Központi presetek, global motion tokenek, motion intensity alapbeállítás, site-level animációk kikapcsolása.

**Elfogadás:** reprezentatív strukturális, szöveg, média, interaktív, dinamikus, komponens és kereskedelmi elem + sponsor marquee mind ugyanabból a registryből tesztelve; nem támogatott animáció biztonságos visszautasítása; többszörös kijelölés, stagger, nested transform, breakpoint, reduced motion, form focus és gépelés, lazy media, Save/Undo/Redo/Publish/rollback; Inspector–Canvas–Public és mobil/desktop paritás. A teljes elemlefedettséget automatizált registry-teszt tartja fenn, hogy új elem ne maradjon véletlenül animáció nélkül. Fejlesztés/CI/éles kézi elfogadás OPEN; nem jelent kész funkciót.

### 38.11 — Oldalak, site shell és navigáció vizuális kezelése

- Oldallista: create, rename, duplicate, archive, delete, restore, search, filter, reorder, parent/child, draft/published state.
- Slug/URL, canonical URL, trailing slash policy, redirects, duplicate slug detection, 404 handling.
- Page type/template assignment: standard, landing, about, schedule, game/profile, blog/article, directory, contact, support, future commerce.
- Site shell: global header/footer, announcement bar, sidebar, Navbar, mobile menu, shared navigation and reusable site sections.
- Navigation tree, nested menus, active state, external links, accessibility labels, mobile collapse behavior.
- Site-wide edit vs. page-local edit világos jelölése; shared template change impact list.
- System pages: 404, search, archive/list/detail, privacy/terms, maintenance/offline and unavailable content states.
- Page duplication/import must regenerate identifiers where required and preserve only valid canonical references.
- Public renderer kizárólag published canonical Page Modelt használ; draft/preview route protected és noindex.

### 38.12 — CMS, dynamic content és data binding

- Collection/schema designer: text, rich text, number, boolean, date/time/timezone, URL, image/file, enum, reference/relation, list, JSON with validation.
- Field labels, help, required, default, validation, unique, search/filter/sort, display format and migration.
- Static vs. dynamic property/binding indicator; choose source, field, transform/format and fallback.
- Canonical sources: site settings, schedule domain, Twitch adapter, Resource metadata, CMS collections and future platform adapters.
- Loading/empty/error/stale states; timeout, retry, caching, invalid/stale binding and deleted source handling.
- Conditional visibility based on safe typed values, integration status or content presence; no arbitrary code evaluation.
- Collection list/grid/repeater, item template, pagination, sorting, filtering and URL/query state where permitted.
- Data preview with sample/real data toggle; secret fields and private data must never leak to public preview.
- D1 domain records remain domain-owned; Page Model stores binding/reference/config only and does not duplicate schedule or integration data.

### 38.13 — Resource, media, icons, fonts és asset picker

- Központi Resource Manager és Editor picker ugyanazon registryt használja.
- Upload/drop, multi-upload, progress, cancel/retry, duplicate detection, type/size validation, safe object keys and ownership checks.
- Search/filter by type/tag/usage/date/dimensions/owner; sort, folders/collections, favorites and recent.
- Preview, metadata, alt text/caption/credit, crop/focal point, resize/replace, derivatives, optimization and thumbnail.
- Usage references across pages/components/templates; before-delete impact list; unused asset detection; archive/restore.
- SVG sanitization, allowed MIME validation, font file constraints, video/audio duration/poster/caption and file-download policy.
- Image variants/responsive sources and cache invalidation; preserve old references safely when replacing.
- Icon registry: searchable icons, categories, style/weight/size/color, custom approved SVG upload, icon accessibility mode.
- Font library: family/weight/style metadata, fallback and license notes.
- R2 stores binary data; D1 stores metadata/reference/ownership. No separate media/icon/font storage owner.

### 38.14 — Preview, saving, publishing, versioning és recovery

- Explicit saved/dirty/saving/saved/error/offline/conflict state; no decorative save indicators.
- Autosave with debounce, retry/backoff, cancellation safety and dirty state reconciliation.
- Manual save, save status, save/reload round-trip, recovery after refresh/tab close where safe.
- Preview draft, preview at viewport/breakpoint, preview as public visitor, protected preview token/route and noindex.
- Publish/unpublish/republish, published snapshot, publish validation, changed-page summary and confirmation.
- Revision timeline, author/time/reason, diff/compare, restore/rollback, conflict handling and optimistic concurrency.
- Recovery after API/network failure; avoid lost changes, duplicate commands or stale overwrite.
- Bulk publish only with explicit preview and permission; public renderer must never expose unpublished data.
- Import/export/backup/restore schemas include versioning, validation, resource references, migration and rollback policy.
- Save, preview, publish, revision and rollback use existing canonical persistence/command contracts, not separate Editor-specific persistence.

### 38.15 — SEO, social preview, discoverability és public quality

- Per-site/page SEO title, meta description, canonical URL, index/follow controls, robots rules, sitemap and robots.txt.
- Open Graph/Twitter/social image preview, title/description, fallback image and per-page override.
- Structured data/schema where valid; canonical language/locale, hreflang where multilingual.
- Heading structure, semantic landmarks, alt text, link purpose, descriptive labels and empty-alt handling.
- Redirect manager and broken-link/404 diagnostics; duplicate title/description and missing metadata reports.
- Public preview cards for social shares; validate image dimensions and external URL behavior.
- AEO/search discoverability metadata is additive and must not generate misleading structured data.
- SEO panel distinguishes warning from blocking error and reports the exact affected page/element.

### 38.16 — Accessibility, privacy, security és consent

- Keyboard-only editor operation; visible focus; screen-reader labels; focus trap/return in modal UI.
- Public semantic HTML, heading hierarchy, alt/caption/transcript, contrast checks, reduced motion and responsive zoom.
- Forms have labels, instructions, error summary, validation announcements and accessible success state.
- Embed/iframe allowlist, sandbox and permissions policy; CSP/URL validation; no arbitrary script execution in Editor.
- External links, uploads, SVG, custom CSS and custom attributes require validation and safe output encoding.
- Consent/privacy controls for analytics, embeds, cookies and future marketing integrations; no secrets in Page Model/client output.
- Role/permission checks server-side for editing, publishing, resource access and global changes.
- Every destructive/global mutation has confirmation as needed, audit evidence and recovery path.
- Accessibility/security findings are testable; no compliance claim without automated plus manual evidence.

### 38.17 — Editor workspace, usability és power-user funkciók

- Resizable/collapsible side panels, left/right panel state, canvas workspace, fullscreen/focus mode.
- Quick Add, searchable command palette, keyboard shortcut map, shortcut conflict handling.
- Selection breadcrumb, recent nodes, favorites, recent assets/templates and contextual actions.
- Inspector pinning/favorites, property search, panel state persistence per user.
- Inline text editing with clear exit/commit/cancel behavior and no accidental selection loss.
- Empty-state onboarding, contextual help, non-blocking diagnostics, actionable error messages.
- Editor preferences are separate from site content: zoom, panel layout, grid visibility and default viewport.
- Tablet/touch support is separately acceptance-tested; tablet login remains a separate deferred item and is not silently conflated with Editor touch UX.
- Localization-ready editor strings and accessible error/status announcements.

### 38.18 — Integrations and streamer-site block catalog

- Twitch: connection status, live/offline, title/game/channel link, permitted live/player/embed, schedule binding, error/stale state and safe disconnect/reconnect UX.
- YouTube/TikTok/Discord: 1.0 static link/basic embed only where explicitly scoped; API-backed integrations remain in their roadmap phases.
- Schedule: domain-owned events, timezone, start/end, recurrence where approved, status, platform, game, artwork, URL, filters, views and sync provenance; no Page Model duplicate schedule records.
- Stream content: VOD/clip/Short/highlight link/embed baseline; canonical media workflows in their planned phase.
- Creator profile/game profiles, social links, community invite, support/funding/press kit blocks.
- Future overlay/widget/alert/OBS browser-source blocks use a separate Stream Studio contract, not arbitrary Editor nodes that bypass it.
- Integration block exposes connection/permission/availability states; secrets and tokens never become editable public properties.
- Every provider block uses the canonical integration adapter and consistent loading/empty/error/offline handling.

### 38.19 — Site-wide tools and bulk operations

- Find/replace content with preview and undo; page/node/resource search; usage/reference search.
- Bulk apply style/token/preset to selected compatible nodes, with mixed-state handling and change summary.
- Find broken links, missing images, orphaned assets, duplicate IDs/slugs, missing alt text and unsupported bindings.
- Site health panel for unpublished changes, broken bindings, missing required fields, page-level warnings and failed integrations.
- Bulk archive/restore/delete/publish only with permission, impact preview and recoverability.
- Global change impact map: pages, shared components, templates, tokens and presets affected.
- Page compare, revision compare, template diff and resource replacement impact preview.
- Search and command operations are site-scoped and permission-aware.

### 38.20 — Extensibility, custom code and future AI

- Canonical extension points: component schema/renderer, property registry, command API, resource type registry, template registry, integration adapter and diagnostics.
- Future custom CSS, HTML/embed and third-party component support only through reviewed, sandboxed, permissioned contracts.
- No direct client mutation of D1/R2 and no arbitrary privileged JavaScript.
- AI may propose edits to Page Model/commands, generate content, map responsive layouts or suggest presets, but must use shared Action API.
- AI changes require preview-before-apply, diff, validation, explicit approval where destructive/global, undo and audit.
- AI must not silently publish, change auth/secrets, overwrite user content or execute arbitrary external code.
- Future marketplace/shared libraries require license/source metadata, compatibility/version constraints, dependency inventory, safe import, sandbox and rollback.
- Export/import packages need schema version, dependency manifest, media references and validation before applying.

### 38.21 — Quality, observability and acceptance matrix

Every capability must define, where applicable:
- unit tests for pure layout/geometry/preset/schema helpers;
- command/history/undo/redo and Page Model round-trip tests;
- property validation, invalid nesting and malformed import tests;
- breakpoint inheritance/override/reset tests;
- canvas geometry tests at zoom levels, long pages, negative/large Y movement and content growth;
- preset apply/merge/replace/reset/fork/undo and shared-instance impact tests;
- component/template/token migration and broken-reference tests;
- save/reload, revision conflict, publish isolation and rollback tests;
- keyboard/touch/browser accessibility tests;
- public renderer, SEO, performance, reduced-motion and privacy tests;
- production runtime acceptance for any behavior whose correctness cannot be established by unit tests alone.

**Release labels:** IMPLEMENTED + TESTED, PLANNED / PHASE-X, DEFERRED, NOT APPLICABLE WITH REASON, BLOCKED. A checklist row must never be marked complete solely because a schema, UI placeholder, API route or documentation line exists.

### 38.22 — Phase assignment and no-loss rules

- Canvas drag/resize acceptance csak friss teszt és böngészős ellenőrzés alapján jelölhető PASS-nak; a már igazolt működéshez tartozó implementációt és regressziós teszteket meg kell őrizni.
- A Layers, Inspector és responsive működés a meglévő Page Modelt, command/history/validation láncot és Property Registryt használja.
- Foundational Editor interactions and the smallest useful set of element types are implemented before expanding the full component catalog.
- Presets, tokens, templates and reusable components must be architecturally reserved now, but are implemented only when their canonical registries/contracts and dependency order are ready.
- A legfelső szintű kiadási fázisok kanonikus sorrendjét a 41.2. fejezet határozza meg; a 39. fejezet összefoglaló. Az első kiadásból kimaradó képesség későbbi, explicit fázisban marad; nem törölhető.
- Do not build every advanced feature before the basic editor is reliable. Prefer a complete, testable capability inventory and a single dependency-ordered implementation path over rushed parallel work.
- This appendix adds no second editor, no second Page Model, no second Property Registry, no second Resource store, no second Schedule domain and no alternate save/publish route.

---

## 39. Teljes Brand & Creator Platform — végrehajtási életciklus

Ez a fejezet a teljes termék fejlesztési függőségeit rendezi sorba. A termékcél végig a teljes Creator Platform; a fázisok a biztonságos és tesztelhető szállítás sorrendjét jelölik, nem a funkciók végleges kizárását. A konkrét következő pontot a 41. fejezet és a repository aktuális állapota határozza meg.

### 39.1. F0 — Meglévő technikai alap és core workflow
Cloudflare Worker, D1/R2, auth/session, site ownership, domain validation, canonical Page Model, Editor command/history, draft/revision/publish, a core folyamathoz szükséges Resource/Media Registry-alapok és Twitch ownership szerződések megőrzése. A meglévő Admin → Editor → save/reload → preview/publish → public oldal folyamat hibáinak lezárása. A teljes erőforrás-könyvtár, bővített Brand Kit és sablonregiszter az F2-ben készül.

### 39.2. F1 — Közös Admin és modulhatárok
Egységes app shell, menürendszer, routing, permission-aware navigation, közös UI állapotok, domain API/command szerződések, szerveroldali jogosultság és diagnosztika. Minden modul külön feladatot kezel, de közös infrastruktúrát használ.

### 39.3. F2 — Brand Kit, Resource Registry és sablonrendszer
Kanonikus brand identity, design tokens, média/ikon/font library, site/page/section/component/theme template-ek, reusable component/symbol, preview/diff/version/rollback. A változtatások hatása követhető és visszavonható.

### 39.4. F3 — Publikus weboldal, CMS és a Visual Editor bővítése
Az F0-ban stabilizált kanonikus Visual Editor továbbfejlesztése a teljes oldalépítési élményhez: oldalak, navigáció, dinamikus blokkok, CMS/data binding, SEO, accessibility, custom domain és publikált renderer. Az F3 nem hoz létre második Editort, Page Modelt, mentési vagy publikálási útvonalat; a canvas/Layers/Inspector core az F0-ban marad, a designrendszer és reusable komponensek az F2-re épülnek.

### 39.5. F4 — Creator account, workspace és onboarding
Külön tervezett creator-regisztráció, email/identity verification, recovery, workspace/site setup, szerepkörök és permissionök. A jelenlegi admin-auth nem válik nyílt regisztrációvá addig, amíg a tenant/site izoláció és account lifecycle tesztelt. Fan account és membership külön publikus felhasználói réteg.

### 39.6. F5 — Integrációs központ és provider adapterek
Twitch meglévő kapcsolatának stabilizálása, majd YouTube, TikTok, Discord, Kick és további integrációk. Providerenként OAuth/scope, capability matrix, quota, token lifecycle, webhook verification, sync, error/retry, reconnect/disconnect és valós provider acceptance.

### 39.7. F6 — Stream Studio és OBS
Overlayek, alerts, widgets, stream scene/source állapot, biztonságos OBS pairing, browser source, stream eventek, stream vezérlés és permission-vezérelt automatizáció. Minden template ugyanazt a Brand Kitet és asset registryt használja.

### 39.8. F7 — Content Studio és többplatformos publikálás
VOD, clip, highlight, Shorts, transcript, thumbnail, platformvariáns, content calendar, edit/export pipeline, queue, jóváhagyás és provider státusz. A publikálás a hivatalos API, account scope, consent és policy korlátai szerint működik.

### 39.9. F8 — Közösség, támogatás, tagság és commerce
Fan account, publikus közösségi funkciók, Discord role sync, támogatás, merch/shop, digitális termékek, tagsági szintek, kupon, checkout, order/payment/fulfillment lifecycle, entitlement és vásárlói támogatás. Fizetési/adózási/fulfillment szolgáltatók külön üzleti és jogi ellenőrzésen mennek át.

### 39.10. F9 — Analitika, kampány és automatizáció
Forrás- és frissességjelölt analitika, stream/content/shop/web teljesítmény, kampányok, szponzoráció, workflow builder, event triggers, retry, dry-run, approval és recovery.

### 39.11. F10 — SANCI AI és multimodális Creator Intelligence
AI Control Center, model/provider registry, weboldal/Admin-asszisztens, élő stream coach, stream/VOD-elemzés, klip- és videógyártás, feliratozás, content strategy, moderációs javaslatok és specialist orchestration. Minden AI-művelet ugyanazt a permission/validation/command/history/approval útvonalat használja, mint a kézi művelet.

### 39.12. F11 — Platformosodás és bővíthető ökoszisztéma
Több workspace/site, csapat és szerepkör, előfizetés/usage, lokalizáció, theme/component/overlay/automation/AI workflow marketplace, külső extension manifest és biztonságos install/update/uninstall/migration/rollback.

### 39.13. Fázisok közötti megőrzési szabály
A későbbi fázisba ütemezés nem törlést jelent. Minden képesség a saját moduljában és stabil funkcióazonosítóval marad a tervben. Egy fázis csak a saját acceptance feltételei után tekinthető késznek. Új funkció nem kerülhet be párhuzamos miniappként, második storage-ként vagy külön jogosultsági rendszerként.

---

## 40. SANCI AI — teljes Creator Intelligence rendszer

A SANCI AI célja nem egy egyszerű chatablak. Egy, a creator teljes munkafolyamatát támogató, több specialista szerepből és multimodális feldolgozási folyamatból álló rendszer: előkészít, figyel, értelmez, visszajelez, tartalmat készít, automatizálási javaslatot ad és mérhető eredményekből tanul. A kézi vezérlés és a felhasználó döntési joga minden esetben megmarad.

### 40.1. AI Control Center
- Modell- és szolgáltató-regiszter, feladattípusonkénti modellválasztás, fallback és verziókövetés.
- Creator által szabályozható jogosultságok, adatforrások, élő megfigyelés, felvételek feldolgozása, tárolási idő, memória, költségkeret és értesítések.
- Feladatlista, feldolgozási állapot, várakozó jóváhagyások, költség/kvóta, hiba és újrapróbálás.
- A creator bármikor szüneteltetheti vagy kikapcsolhatja az AI-t, törölheti a memóriáját, és szabályozhatja, mi használható kontextusként.
- A rendszer feladatonként választhat beszéd-/audio-, video-, képi, nyelvi és strukturált adatelemző modelleket; nem szükséges egyetlen modellt minden munkára használni.

### 40.2. Élő stream társ és felügyelet
- Élő állapot, streamminőség, hang/mikrofon, csend vagy hangkimaradás, scene/source állapot, OBS- és provider-hibák jelzése, amennyiben az adott jel elérhető.
- Chattempó, visszatérő kérdések, hangulatjelzések, közösségi aktivitás és lehetséges moderációs kockázatok összefoglalása.
- Kontextusérzékeny ötletek, kérdések, témaváltási javaslatok, game-event/reakciós pillanatok és emlékeztetők.
- Opcionális AI co-host: előre beállított szerep, hangnem, tiltott témák, válaszkorlátok és látható „AI-javaslat” állapot.
- Stream közben az AI különböztesse meg a tényt, a becslést és a bizonytalanságot; ne állítson diagnózist vagy provider-állapotot nem ellenőrzött jelből.
- Moderációs akciók fokozatosan: először jelzés/javaslat, majd szabályozható automatikus intézkedés csak engedélyezett művelet, küszöbérték, naplózás és visszavonási lehetőség mellett.
- Az élő elemzés csak opt-in módon, a rendelkezésre álló stream-/chat-/OBS-adatok és a szolgáltatói feltételek szerint működik.

### 40.3. Stream utáni intelligencia
- Felvétel/transcript, fejezetek, témák, események, fontos pillanatok és highlight-jelöltek.
- Nézői aktivitás, chat, streamminőség, közönségmegtartás és kilépési pontok összefüggéseinek elemzése, ha a szükséges adat rendelkezésre áll.
- Mi működött / min érdemes változtatni / mi legyen a következő stream kísérlete — indoklással és forrásadatokkal.
- Streamenkénti és hosszabb távú összehasonlítás, célkövetés, preferenciák és felhasználó által kontrollált creator memory.

### 40.4. AI Content Factory
- Automatikus clip/Short/Reel/TikTok/YouTube-videó jelöltek streamből, VOD-ból vagy feltöltött anyagból.
- Szerkesztési folyamat: pillanatválasztás, vágás, 9:16/16:9/1:1 reframing, felirat, beszédátirat, audiojavítás, intro/outro, brand overlay, B-roll vagy egyéb vizuális kiegészítés, ahol jogszerű és támogatott.
- Cím, leírás, hashtag, fejezet, thumbnail brief/variáns, platformonkénti hossz/formátum és publikálási idő javaslata.
- Szerkeszthető timeline és szöveges vezérlés; AI-módosításokhoz diff, undo/restore és kézi finomítás.
- Tartalomnaptár, jóváhagyási queue, ütemezés és közzététel csak a megfelelő provider API, fiókjogosultság és explicit felhasználói szabály szerint.
- Jogvédett zene, személyes adatok, vendégek, chat és más érzékeny anyag esetén ellenőrzés, kizárás vagy jóváhagyás szükséges.

### 40.5. Creator stratégia és növekedés
- Összevont, de forrásonként megkülönböztetett platformanalitika.
- Tartalomötlet-, sorozat-, naptár-, kampány-, szponzorációs és közösségépítési javaslatok.
- A saját célokhoz illeszkedő kísérletek és eredmények követése; ne ígérjen garantált nézettséget vagy növekedést.
- Weboldal, SEO/AEO, link hub, shop/merch, tagság és kampány teljesítményének összekapcsolása a jogosultság és adatminőség figyelembevételével.

### 40.6. AI weboldal- és Admin-asszisztens
- Természetes nyelvű oldal-/szekció-/komponenslétrehozás, layout, theme, design token, responsive, szöveg, SEO és accessibility javaslat.
- Integráció, schedule, content, shop, campaign és automation draftok készítése.
- Minden módosítás a kanonikus API/command pipeline-on keresztül fut; nincs közvetlen DB-, DOM- vagy publikus éles módosítás a validáció megkerülésével.
- Preview/diff → engedélyellenőrzés → jóváhagyás (a kockázatnak megfelelően) → végrehajtás → ellenőrzés → visszaállítható verzió.
- Kockázatos művelethez — publikálás, fizetés, moderáció, külső üzenet, törlés, jogosultságváltoztatás, deploy — külön szabály és szükség esetén explicit megerősítés kell.

#### 40.6.A. Teljes, utólag szabadon szerkeszthető oldalak és webhelyek generálása — AI-011 (2026-10-21; SPEC / OPEN)

**Felhasználói cél:** az alkotó vagy a fejlesztő természetes nyelvű utasításból, meglévő sablonból és feltöltött, használatra jogosult tartalmakból egyetlen oldalt vagy teljes, többoldalas brand-/creator-webhelyet állíthasson össze. Ez a **meglévő AI-011 Website Designer részletes elfogadási szerződése**, nem külön új AI feature ID és nem új weboldalépítő vagy Page Model.

- **Egyetlen szerkeszthető kimenet:** oldalstruktúra, szekciók, elemek, reszponzív breakpointok, színek, betűk, Brand Kit tokenek, ikonok, médiareferenciák, űrlap-/domain-binding konfigurációk és SEO-metaadatok kizárólag a meglévő, verziózott és validált kanonikus Page Model / WEB / EDT / DSN / RES szerződésen át jönnek létre. Nem készül csak képként, screenshotként, egybefüggő HTML-ként vagy külön generált, nem szerkeszthető sablonként tárolt oldal; nincs párhuzamos HTML/CSS/JS- vagy AI-specifikus publikus renderer. A támogatott elemek mindegyike a Visual Editor vásznán, Layers és Inspector felületén szerkeszthető, menthető, visszavonható és újranyitható. Nem támogatott elem esetén világos capability/compatibility hiba, nem néma lapítás.
- **Teljes webhely és feltöltött tartalom:** tetszőleges számú, azonos site-hoz tartozó oldal létrehozása a WEB oldallétrehozási API-val; site-scoped slug/hierarchia, belső hivatkozások és navigáció a kanonikus Navigation ownerrel; kezdőlap, aloldalak, fejléc/lábléc és sablonok a közös designrendszerrel. A felhasználó saját szövege, képei, logója és más támogatott média a meglévő RES/R2 + D1 médiatárba, eredet/licenc/alt adatokkal kerül; a Page Model csak jogosult asset ID-t és konfigurációt hivatkozik. A generátor nem talál ki jogokat, nem másol másik tenant anyagaiból, és nem hoz létre új feltöltő API-t.
- **Belépési pontok és owner:** a SANCI AI > Weboldal-asszisztens természetes nyelvű tervezést/előállítást kezdeményez; a Weboldal > Oldalak ugyanazon draft létrehozási/importálási domain műveleteit kínálja AI nélkül is; a Visual Editor a létrejött oldal natív szerkesztője. A fejlesztői vagy külső automatizált import ugyanazon hitelesített, sémavalidált action/API-n át történik. A kimenet tulajdonosa WEB/EDT, a média RES, a sablon DSN, az AI csak javaslatot és engedélyezett műveleti tervet ad.
- **Biztonságos munkafolyamat:** kérés és hely-/site-választás → források/jogosultságok ellenőrzése → oldal- és tartalomterv → típusos műveletek/asset-függőségi manifest → teljes oldalcsomag validációja → többoldalas draft előnézet és strukturált diff → kifejezett alkalmazás/jóváhagyás → kanonikus mentés/revision → külön, felhasználó által indított Publish. A mentés sohasem publikál; meglévő oldal felülírása, törlés, globális komponensmódosítás vagy publikálás külön, kockázatarányos jóváhagyáshoz kötött. Hálózati/kvóta/provider hiba, hibás asset, slugütközés és félbemaradt többoldalas import esetén nincs részlegesen publikált állapot; idempotens újrapróbálás, kompenzáció vagy visszaállítás.
- **Minőség és költség:** desktop/tablet/mobil nézetek, magyar és engedélyezett további locale-ok, olvashatóság, billentyűzetes és képernyőolvasós navigáció, WCAG-célok, SEO és Open Graph ellenőrzése. AI futási állapot, becsült és tényleges providerköltség, használati korlát, napló, visszavonás és emberi finomítás; AI nélkül a kézi oldal- és sablonkészítés változatlanul működik.
- **Elfogadási teszt (OPEN):** AI-val és ugyanazon API-n keresztüli programozott importtal létrehozott, több aloldalas és feltöltött képeket is tartalmazó teljes tesztwebhely minden eleme kijelölhető/módosítható az Editorban; Save + újratöltés + Undo/Redo + revision restore megőrzi a strukturált tartalmat; Save után a publikus változat változatlan; csak külön Publish után frissül; canvas/preview/publikus renderer vizuálisan és szemantikusan konzisztens 390/768/1366 px-en. Negatív teszt: tiltott asset, idegen site, érvénytelen schema, külső injektált HTML/JS, ütköző slug, hiányos média és összeomlott AI-/importfutás nem szivárogtat adatot és nem ír át éles oldalt.
- **Függőségi sorrend:** a jelenlegi 77.44 Visual Editor, WEB oldalak/navigáció, 49.4 Médiatár, DSN sablon/Brand Kit és a **76.06.A AI-tól független, validált Page Model create/import action** stabil működése után az AI-011 megvalósítási blokkban; az aktív Editor kurzort nem változtatja meg. **Státusz: követelmény rögzítve, implementáció és E2E kézi elfogadás nincs igazolva.**

### 40.7. Specialisták és közös orchestration
A specialisták megosztott kontextus- és action pipeline-t használnak, de külön feladatuk van:
- **Live Coach:** élő stream visszajelzés és technikai figyelés.
- **Moderator Assistant:** chat összegzés, szabályjavaslatok, spam/abuse jelzések és engedélyezett moderáció.
- **Clip & Video Producer:** highlightok, vágás, felirat, formátumok és export.
- **Content Strategist:** ötlet, naptár, platformvariáns és teljesítmény-visszacsatolás.
- **Website/Brand Designer:** Visual Editor, design system, SEO, accessibility és brand consistency.
- **Community & Business Assistant:** Discord, kampányok, shop, membership, támogatás és szponzoráció.
- **Automation Builder:** eseményvezérelt munkafolyamatok, dry-run, jóváhagyás és helyreállítás.
- **Analytics Analyst:** összevont, de forrás- és frissességjelölt elemzés.

### 40.8. Biztonság, minőség és technikai realitás
- AI-adatkezelés opt-in és minimális adatgyűjtés; retention/export/delete és érzékeny adatok redakciója.
- Provider scope, copyright, consent, rate limit, model/API-költség, queue, retry, timeout, idempotency és background-job monitoring.
- Prompt injection és nem megbízható tartalom kezelése; a stream chat vagy felirat nem utasíthatja felül a rendszer jogosultsági szabályait.
- Minden automatikus műveletnek legyen naplója, eredménye, hibakezelése és ahol lehetséges rollbackje.
- A rendszer a legjobb elérhető modelleket/adapterszolgáltatásokat használhatja; saját alapmodell tanítása nem feltétele a teljes AI-terméknek. A saját értéket a creator-context, a workflow, a biztonságos action layer, a multimodális feldolgozás és a visszacsatolási rendszer adja.
- Az AI nem találhat ki hiányzó analitikát, nem állíthat biztos okot bizonytalan jelből, és nem publikálhat automatikusan a felhasználó beállításainak megkerülésével.

### 40.9. AI megvalósítási sorrend
1. AI Control Center, provider abstraction, permission/action pipeline és költség-/adatkezelés.
2. AI weboldal-/Admin-asszisztens diff/preview/jóváhagyás mellett.
3. VOD/stream utóelemzés, transcript, fejezetek és highlight-jelöltek.
4. Clip/Short videógyártás, felirat, reframing, brand template és szerkesztői finomítás.
5. Élő streamdiagnosztika és Live Coach, valós idejű adatút/OBS-integrációval.
6. Moderációs asszisztens és szabályozott automatizáció.
7. Creator memory, stratégiai analitika és mérhető, személyre szabott visszajelzés.
8. Többspecialistás orchestration, fejlettebb multimodális munkafolyamatok és marketplace-bővíthetőség.

A későbbi fázis nem jelenti a funkció kihagyását; a biztonságos és megbízható alapokra épülő megvalósítás sorrendjét jelöli.

---

## 41. Aktuális termékállapot és következő lépések

### 41.1. Meglévő, megőrzendő technikai alapok
- Cloudflare Worker + TypeScript runtime, D1 strukturált adatokhoz és R2 bináris objektumokhoz.
- Kanonikus Visual Editor v2 és Page Model; egyetlen draft/save/publish architektúra.
- Site ownership és a kapcsolódó adatbázis-integritási szerződések.
- Schedule domain és `schedule_items` kanonikus forrás.
- Twitch OAuth és site-hoz kötött integrációs alap.
- A már létező domain-, Editor- és integrációs tesztek megőrzése.

Ezek a meglévő alapok nem jelentik azt, hogy minden kapcsolódó felhasználói folyamat teljesen kész. A valós státuszt a kód, tesztek, runtime és felhasználói elfogadás együtt határozza meg.

### 41.2. Következő megvalósítási sorrend

**Fontos státuszkülönbség:** az alábbi F0–F11 lista a kanonikus végrehajtási sorrend, nem az aktuálisan futó munka állapotjelentése. Jelenleg a 0.5. fejezet szerinti `PLAN-CAPABILITY-COMPLETENESS-AND-CONSISTENCY` aktív; F0 csak a MASTER lezárási feltételeinek teljesülése után válhat aktívvá.

1. **F0 — Core megbízhatóság:** Admin → Visual Editor → mentés/újratöltés → preview → publish → publikus oldal; a meglévő runtime- és acceptance-hibák tényleges lezárása.
2. **F1 — Alaprendszer és modulhatárok:** közös Admin shell, navigáció, routing, permission model, egységes loading/empty/error/stale state, szerveroldali domain-szerződések és közös API/command útvonal.
3. **F2 — Brand, design system, Resource Registry és sablonok:** brand kit, tokenek, reusable komponensek, page/section/component/site template, assetek, verziózás, preview és rollback.
4. **F3 — Publikus site builder és CMS:** oldalak, navigáció, dinamikus adatblokkok, SEO, accessibility, publikálás, domainbeállítás és mobilos végponttól végpontig elfogadás.
5. **F4 — Creator-fiók és onboarding alapjai:** a jelenlegi admin-auth megőrzése mellett külön megtervezett creator registration, workspace/site létrehozás, onboarding, szerepkörök és account recovery; csak a tenant-scope és biztonsági modell jóváhagyása után élesítve.
6. **F5 — Integrációs központ:** Twitch meglévő alapjának stabilizálása, majd YouTube, TikTok, Discord, Kick és további adapterek; providerenként külön képességmátrix, scope és éles engedély.
7. **F6 — Stream Studio és OBS:** overlay/alert/widget template-ek, OBS pairing, browser source, stream események, scene/source vezérlés és engedélyezett automatizációk.
8. **F7 — Content Studio:** VOD, klipek, highlightok, Shorts, metaadatok, többplatformos naptár, media processing, queue és publikálás provider-korlátokkal.
9. **F8 — Közösség és bevétel:** fan account/membership, támogatás, merch/shop, digitális termék, kupon, rendelés, fulfillment és jogosultságalapú közösségi funkciók.
10. **F9 — Analitika, kampány és automatizáció:** forrásmegjelölt metrikák, szponzoráció, kampányok, workflow builder, események, retry és dry-run.
11. **F10 — SANCI AI:** a 40. fejezet szerinti AI Control Center, admin/brand-asszisztens, VOD/clip factory, live coach és biztonságos specialist orchestration.
12. **F11 — Platformosodás:** csapatok, több site, billing/usage, localization, theme/component/overlay marketplace, külső extension API és tenant-onboarding.

A fázisok között kötelező függőségek vannak; a számok nem ígérnek határidőt. A teljes végső funkcióscope minden fázisban megmarad. Egy későbbi modul nem épülhet úgy, hogy saját, párhuzamos storage-t, jogosultsági rendszert vagy duplikált üzleti logikát hoz létre.

### 41.3. Mi számít késznek?
Egy funkció csak akkor kész, ha a megadott felhasználói cél a valós alkalmazásban végigvihető; az adatok helyesek és konzisztensen jelennek meg minden érintett felületen; a jogosultságok és hibás állapotok kezeltek; a releváns tesztek és szükséges valós böngészős/éles ellenőrzések sikeresek. A dokumentáció frissítése a megvalósítást követi, nem helyettesíti azt.

**Ez a fejezet az aktuális termékfejlesztés irányát rögzíti; a teljes Creator Platform célja és későbbi képességei változatlanul a terv részei.**

---

## 42. Brand Kit és vizuális identitásrendszer

A platform nem pusztán weboldal-sablonokat ad: a creator márkája minden kapcsolódó felület közös, verziózott rendszeréből épül fel.

### 42.1. Kanonikus Brand Kit
- Brand profil: név, leírás, hangnem, nyelvek, célközönség, közösségi linkek, kapcsolat és press/business információ.
- Logo family: primary, compact, monochrome, icon/mark, light/dark változat, clear-space és minimális méret.
- Színpaletták és szemantikus design tokenek: primary/secondary/accent, background/surface, text, border, success/warning/error, contrast metadata.
- Typography system: display, headings, body, caption, UI, font fallback, licenc és betöltési stratégia.
- Spacing, grid, container, breakpoint, radius, shadow, border, z-index, motion és accessibility tokenek.
- Brand assetek: avatar, banner, offline image, thumbnail, emote/badge, panel, favicon, social preview, watermark csak az adott platform szabályai szerint.
- Brand voice: megengedett hangnemek, preferált kifejezések, névírás, tiltott állítások és nyelvi stílus.
- Brand kit verziózás, változásnapló, preview, dependency map és rollback.

### 42.2. Egyszeri változtatás, közös hatás
A brand-adat nem másolható minden modul saját beállításaiba. A publikus weboldal, Visual Editor, Stream Studio, overlayek, Content Studio, thumbnail presetek, AI-generált szövegek és shop ugyanazokat a Brand Kit referenciákat használják. Modul-specifikus eltérés csak explicit override lehet, látható scope-pal és reset/restore művelettel.

A központi brand-változás előtt a rendszer megmutatja az érintett oldalakat, sablonokat, komponenseket és generálási preseteket. A változtatás nem írja át észrevétlenül a már publikált tartalmakat vagy a felhasználó által jóváhagyott kész videókat.

## 43. Sablonok, témák és újrahasznosítható blokkok

### 43.1. Sablonrétegek
- **Starter/site template:** teljes kezdő weboldal és kezdeti konfiguráció.
- **Page template:** Home, About, Live, Schedule, Games, Videos, Clips, Community, Support, Shop, Membership, Contact, Press Kit, Legal és egyedi landing.
- **Section template:** hero, live banner, next stream, schedule, featured video, social grid, community CTA, merch spotlight, membership CTA, sponsor strip, FAQ, footer.
- **Component template:** gombok, kártyák, stream állapot, játékprofil, videólista, termékkártya, CTA és adatállapotok.
- **Design/theme preset:** színek, tipográfia, spacing, shape, motion, háttér és vizuális stílus.
- **Stream overlay template:** gameplay, Just Chatting, starting soon, BRB, ending, vertical stream, alertbox, goals, chat, lower-third, webcam frame.
- **Content template:** thumbnail, Shorts/Reels/TikTok frame, caption style, title/description, intro/outro és export preset.
- **Automation template:** stream-start, stream-end, új videó, új tagság, merch order és hibaértesítés.
- **AI workflow template:** VOD analysis, clip selection, subtitles, weekly review, stream prep és brand-aware copy.

### 43.2. Sablon-életciklus
Minden sablonnak van stabil azonosítója, típusa, verziója, schema-verziója, preview, kompatibilitási feltétele, asset-/token-függősége, jogosultsága, szerzője/forrása és státusza. Műveletek: create, duplicate, preview, apply, save as, update, deprecate, archive, export/import és rollback.

Sablon alkalmazása alapértelmezetten független példányt hoz létre; csak az explicit reusable/linked component marad közösen hivatkozott. Frissítés előtt diff és impact preview szükséges. Schema-migráció nem változtathat meg csendben meglévő oldalakat. A marketplace későbbi fázis, de a belső sablonrendszert már eleve verziózhatóra kell tervezni.

### 43.3. Bővíthető komponenskönyvtár
A komponens egységes szerződése tartalmazza a type ID-t, schema-t, defaultokat, property registryt, editor renderer-t, public renderer-t, validációt, accessibility követelményeket, adatbindingokat, permissionöket, teszteket és migrációt. Új komponens hozzáadása nem igényelhet minden modulban külön, kézzel írt eltérő implementációt.

## 44. Regisztráció, creator workspace és közösségi felhasználók

A jelenlegi, meglévő admin-hitelesítés nem alakítható át észrevétlenül nyílt regisztrációvá. A regisztráció külön, biztonságosan megtervezett termékfunkció.

### 44.1. Creator regisztráció és első beállítás
- Email-/jelszó vagy jóváhagyott identity provider, email-ellenőrzés, biztonságos bejelentkezés és kijelentkezés.
- Elfelejtett jelszó, session kezelés, fiókzárás, fiók-helyreállítás és szükséges biztonsági értesítések.
- Creator workspace létrehozása, site/brand alapadatok, időzóna, locale, kezdeti template választás, domain és első publikálási útmutató.
- Lépésenkénti onboarding checklist, kihagyható és később folytatható lépésekkel.
- Integrációk csatlakoztatása külön, opcionális lépésként; a platform alapfunkciói nem feltételezhetnek minden szolgáltatóhoz adott engedélyt.
- Seed/demo tartalom egyértelműen jelölt, teljesen eltávolítható és soha nem keverhető össze valódi adatokkal.

### 44.2. Szerepkörök és workspace
- Tulajdonos, admin, editor/designer, content manager, moderator, analyst, shop manager és read-only szerepkörök a termékfázisnak megfelelően.
- Least-privilege, domain/action-szintű permissionök, server-side enforcement és workspace/site scope.
- Meghívás, elfogadás, visszavonás, szerepkörváltás, kiléptetés és tulajdonosváltás naplózott műveletekkel.
- Egy creator több workspace/site-ot is kezelhessen, ha a több-site fázis elkészült; az adat, token, media és domain izoláció kötelező.
- A publikus weboldal látogatói, regisztrált fanok, fizető tagok és creator-admin felhasználók eltérő identitás- és jogosultsági réteget alkotnak.

### 44.3. Fan account és tagság
- Opcionális regisztráció a creator publikus oldalán; a nyilvános tartalom megtekintéséhez ne legyen automatikusan kötelező account.
- Profil, preferenciák, értesítések, kedvencek/követés, komment/poll/event interakciók a megfelelő modulokban.
- Ingyenes és fizetős tagsági szintek, entitlement, lejárat, lemondás, számlázási állapot és hozzáférés-visszavonás.
- A fizetési adatokat és kártyaadatokat jóváhagyott fizetési szolgáltató kezeli; saját rendszer csak a szükséges provider reference és állapot tárolását végzi.
- Adatletöltés/törlés, hozzájárulások, adatmegőrzés és értesítési beállítások.
- Creator által konfigurálható, hogy mely nyilvános interakciók igényelnek regisztrációt, tagságot vagy moderátori jóváhagyást.

## 45. Közös adat-, erőforrás- és eseményarchitektúra

### 45.1. Kanonikus domain és közös storage
A „közös storage” nem egyetlen óriási, strukturálatlan JSON és nem egy közös tábla mindenhez. Közös platform-infrastruktúrát jelent, külön tulajdonolt, típusos domain-adatokkal.

- D1: strukturált rekordok, kapcsolatok, állapotok, jogosultságok, konfigurációk és indexelt metaadatok.
- R2: médiafájlok, generált videók, thumbnail-ek, exportok és nagy objektumok.
- Resource Registry: egységes asset ID, ownership, site/workspace scope, metadata, storage key, checksum, lifecycle és használati hivatkozások.
- Page Model: elrendezés, tartalomkonfiguráció és kanonikus domain rekordokra mutató referenciák; nem tárolhat másolatot a schedule, termék, rendelés, integration vagy membership rekordról.
- Domain-owned storage: Schedule, Content, Product/Order, Membership, Integration, Analytics, Automation és AI job külön szerződés szerint, közös auth/validation/observability infrastruktúrával.
- Secret/token storage: külön védett szerveroldali szerződés, soha nem public Page Modelben, resource metadata-ban vagy kliensoldali konfigurációban.
- Search index, cache és analytics projection újraépíthető származtatott adat; nem válhat a kanonikus adatforrás helyettesítőjévé.

### 45.2. Közös esemény- és szinkronmodell
- Domain event envelope: event ID, tenant/site scope, event type/version, occurred-at, actor/source, correlation ID és idempotency key.
- Retry/backoff, deduplication, dead-letter/failed state, reprocess, sync watermark és last-success jelzés.
- Külső webhook aláírásellenőrzés, replay protection és provider event ID deduplikáció.
- A kapcsolódó modulok eseményre vagy kanonikus API-ra támaszkodnak; nem írnak egymás tábláiba közvetlenül.
- A cache és search index invalidálása explicit; sikertelen feldolgozás látható és újrapróbálható.
- A felhasználói művelet státusza megkülönbözteti a kérés elfogadását a külső szolgáltató által visszaigazolt eredménytől.

### 45.3. Bővíthetőségi szerződések
Új funkció a megfelelő registryn keresztül illeszkedik be: domain/API, admin navigation, permission, event, resource type, template/component, editor property, provider adapter, automation action vagy AI tool. Egy extension nem kap automatikusan korlátlan DB-, hálózati vagy fájlrendszer-hozzáférést. Az extension manifest deklarálja a szükséges capabilityket, schema-verziót, scope-okat, migrációt, költséget, UI-entrypointot és eltávolítási/rollback viselkedést.

## 46. Admin információs architektúra és felhasználói élmény

### 46.1. Navigációs hierarchia és főmodulok forrása

A kanonikus modulnevek, modulhatárok és felhasználói főmenüpontok kizárólag a **49. fejezetben** szerepelnek. Ez az alfejezet nem tart fenn második, párhuzamos menülistát; itt csak a felület elrendezési szabályai vannak meghatározva.

- A 49. fejezet 22 főmodulja nem azonos súlyú: a gyakori alapfeladatok kerülnek előre, a ritkább és későbbi platformfunkciók kereshető/összecsukható csoportokba.
- A modul megjelenítése szerepkör, server-side permission, használati gyakoriság és kezdő/haladó mód szerint változhat; a UI nem helyettesíti az authorizationt.
- A modulok saját kanonikus domain parancsát/API-ját használják. A Dashboard, Editor, kereső, értesítés vagy AI csak belépési pont, nem második üzleti logika.
- A Weboldal/Visual Editor, Brand Kit, Média/Asset Registry, Integrációk, Live/Stream, OBS, Content Studio, Community, Store, Support/Membership, Sponsorship/Campaign, Analytics, Automation, AI, Search/Help, Settings, Developer API, Extensions/Marketplace és Team/SaaS határait a 49. fejezet és az 5. fejezet domain-térképe együtt rögzíti.
- Mobilon csoportosított, összecsukható navigáció, egyértelmű aktív hely, breadcrumbs és kereshető almenük szükségesek; egyetlen modul sem lehet „minden egyéb” gyűjtőhely.

### 46.2. Több helyen látható művelet, egyetlen üzleti logika
Ugyanaz a művelet megjelenhet Dashboardon, Editorban, tartalomkártyán vagy AI-javaslatként, de minden entrypoint ugyanazt a domain command/API-t hívja. A közös action meghatározza a jogosultságot, validációt, státuszátmenetet, idempotenciát, naplózást és hibakezelést. Az entrypoint csak a kontextust és a felhasználói felületet adja.

### 46.3. Könnyű kezelhetőség
- Kezdő és haladó útvonal; alapértelmezett értékek és fokozatosan felfedett haladó beállítások.
- Kereshető menü/command palette, globális keresés, breadcrumbs és következetes elnevezések.
- Kontextusfüggő súgó, minták, preview, undo, visszaállítás és megerősítés kockázatos műveleteknél.
- Egyértelmű empty state „mit tegyek most?” útmutatóval; nincs üres, magyarázat nélküli modul.
- Billentyűzet, screen reader, touch/tablet, reszponzív layout és lokalizáció.
- A Dashboard összefoglalhat, de a domain funkciót mindig a saját modul kezeli.

## 47. Meglévő kód és nyílt forrású komponensek újrahasználata

A gyors fejlesztés elsődleges módja a már működő saját kód, bevált szerződések és megfelelően licencelt, karbantartott nyílt forrású csomagok újrahasználata. Nem írunk újra olyat, ami a projektben már megbízhatóan működik, és nem építünk be csomagot csak azért, mert népszerű.

### 47.1. Kötelező reuse döntés minden új funkciónál
1. Először ellenőrizni kell a meglévő route-okat, domain helper-eket, DB migrationöket, UI-komponenseket, editor commandokat, teszteket és adaptereket.
2. A meglévő implementációt bővítsük, ha a felelőssége helyes és a szerződése tesztelhető.
3. Nyílt forrású csomag csak akkor kerül be, ha érdemi előnyt ad, kompatibilis a Cloudflare Workers/TypeScript környezettel, aktívan karbantartott, megfelelő licencű, méretben és függőségekben elfogadható, és van rá tesztelhető adapter.
4. Új dependency előtt rövid döntés: saját kód / meglévő csomag / új csomag / külső szolgáltatás, indoklás, licenc, biztonság, runtime kompatibilitás, lockfile és frissítési felelősség.
5. Nem másolunk be teljes másik terméket vagy nagy UI-rendszert pusztán a fejlesztés gyorsítása miatt; csak a szükséges, licencelt, elszigetelt és karbantartható részeket használjuk.
6. Külső mintakódot a saját auth, tenant-scope, domain validation, logging és tesztek megkerülése nélkül integrálunk.

### 47.2. Első technikai realitás
A jelenlegi `package.json` minimális függőségi felületet mutat, és a frontend jelentős része natív HTML/CSS/JavaScript; ezért nem feltételezünk automatikusan már telepített nagy frontend frameworköt vagy UI libraryt. A valós kódbázis és bundle-korlátok vizsgálata után modulonként döntünk arról, hogy a meglévő mintát bővítjük vagy célzott könyvtárat vezetünk be. A már működő Worker, D1, R2, Editor command/history és tesztstruktúra megőrzendő.

### 47.3. Benchmark-tanulságok
- StreamElements: vizuális overlay builder, alerts, chatbot/moderáció, custom widget és stream event alapú működés — hivatalos dokumentáció: https://docs.streamelements.com/overlays és https://docs.streamelements.com/chatbot/modules.
- Fourthwall: brandelt shop, merch, tagság, digitális termék, kupon és külső platform-integrációk — https://fourthwall.com/features és https://fourthwall.com/memberships.
- OBS Studio: az OBS WebSocket a 28-as verziótól beépített; távoli vezérlésnél jelszavas védelem kötelező — https://obsproject.com/kb/remote-control-guide.
- TikTok Content Posting API: app approval, scope, creator consent, content preview, posting status és korlátozások szükségesek; nem tekinthető univerzális automatikus publikálási API-nak — https://developers.tiktok.com/docs/en/content-posting-api-get-started és https://developers.tiktok.com/docs/en/content-sharing-guidelines.
- Discord: OAuth scope és bot permission külön kezelendő; botot nem szabad felhasználói önműködő fiókkal helyettesíteni — https://discord.com/developers/docs/topics/oauth2.

Ezekből a termékekből képességmintát és bevált UX-t tanulunk, nem teljes rendszert másolunk. A SANCI9517 saját előnye a közös Brand Kit, a canonical domain/storage, az Editor, a provider-adapterek, a Stream Studio, a shop/community és a SANCI AI összekapcsolása.

## 48. Fejlesztési pontok kiválasztásának szabálya

A következő munka mindig a repository tényleges állapotából indul:
1. Megnézzük az érintett route-ot, domain-szerződést, adatmodellt, UI-t, migrationt és tesztet.
2. Megállapítjuk, mi működik már és mit lehet közvetlenül újrahasználni.
3. Egyetlen, kicsi, felhasználói eredményt célzó fejlesztési pontot választunk.
4. Megírjuk a változtatást és a szükséges teszteket; nem csak dokumentációt frissítünk.
5. Lefuttatjuk a valós repositoryban elérhető releváns teszteket, typechecket és szükséges runtime/acceptance ellenőrzést.
6. Rögzítjük a tényleges eredményt, a még nyitott hibát és a következő függő fejlesztési pontot.
7. Nem állítunk PASS-t vagy készültséget futtatás/ellenőrzés nélkül.

A terv célja az, hogy a fejlesztés végre lépésenként, egyetlen irányadó sorrend szerint haladjon, miközben a teljes bővíthető Creator Platform célja megmarad.

---

## 49. Teljes Creator Center menütérkép — felhasználói funkciók szerint

**Ez a terv egyetlen kanonikus felhasználói főmodul-/navigációs térképe.** A modulok és almodulok helyét itt kell meghatározni; a 3. fejezet domain-katalógusa, a 24. fejezet ID-jegyzéke és az 54. fejezet lefedettségi ellenőrzőlistája ezt nem írhatja felül. A menü csoportosítható, kereshető és szerepkör szerint szűrhető; a ritkán használt funkciók nem zsúfolják tele az alapnézetet. A menüpontok ugyanazokat a kanonikus domain szolgáltatásokat használják, nem külön miniappok.

### 49.1. Kezdőlap és napi áttekintés
**Tulajdonosi határ:** Az Admin kezdőlap csak összesített, jogosultságszűrt nézet és gyorsműveleti belépési pont; nem hoz létre saját adás-, tartalom-, értesítés-, bevétel- vagy feladatrekordokat. Minden kártya a kanonikus forrásmodulhoz vezet.
- **Áttekintés:** élő állapot, következő adás, feladatok, publikálási queue, figyelmeztetések, bevételi és közösségi összefoglaló.
- **Gyors műveletek:** stream indítás előtti ellenőrzőlista, új tartalom, új oldal, új kampány, overlay teszt.
- **Teendők:** sikertelen szinkronok, lejárt kapcsolatok, jóváhagyásra váró AI-módosítások, sikertelen publikálások.
- **Személyre szabás:** átrendezhető dashboard-kártyák, szerepkör szerinti nézetek, widget-beállítások.

### 49.2. Weboldal
**Tulajdonosi határ:** ez a modul a weboldal oldalstruktúráját, tartalmi modelljét, szerkesztését, SEO-ját és publikálását kezeli. Nem a teljes Creator Center funkcióinak gyűjtőhelye.
- **Oldalak:** létrehozás, másolás, archiválás, útvonal/slug, státusz, verzió, hozzáférés, átirányítás.
- **Navigáció:** menük, almenük, mobil menü, footer, breadcrumbs, külső és belső hivatkozások.
- **Visual Editor:** vászon, rétegek, komponensek, inspector, responsive preview, undo/redo, billentyűparancsok, keresés. Az Editor az oldal szerkezetét és a blokkok megjelenítési konfigurációját szerkeszti; nem veszi át a kapcsolatok, adásrend, média, bevétel vagy analitika üzleti kezelését.
- **Tartalom/CMS:** kollekciók, mezők, referenciák, szűrők, keresés, rendezés, ütemezett publikálás, draft/preview.
- **SEO és megosztás:** meta cím/leírás, canonical URL, sitemap, robots, Open Graph, social preview, strukturált adatok, redirectek.
- **Lokalizáció:** nyelvek, fordítási státusz, locale-öröklés és felülírás, lokalizált slug/meta/kép/alt text, RTL, nyelvváltó.
- **Űrlapok és interakciók:** kapcsolat, feliratkozás, leadek, spamvédelem, siker/hiba állapotok, hozzájárulás.
  - **49.2.Forms — űrlap-életciklus (P03.1/P03.2/P03.5; 54.2.14):** külön kezelhető űrlapok, verziózott mezőséma és validáció, consent-szöveg/verzió, szerveroldali spam/rate-limit, beküldés státusz, admin inbox/keresés, retention és törlés. Public űrlapblokk és Editor form-binding ugyanazt a Forms submission service-t használja; a Visual Editor nem kezel önálló beküldés-adatbázist. Owner: WEB public route + elkülönített FORMS submission domain-szerződés (végleges stabil ID döntés nyitott). Negatív acceptance: consent nélküli vagy idegen site-ból olvasott beküldés tiltott.
- **Publikálás:** preview, staging, diff, jóváhagyás, publish/unpublish, verzió és rollback, domain és DNS állapot.
  - **49.2.Published snapshot safety (HIGH; 63.50.46):** a public URL/slug/meta és content snapshot csak explicit, validált publish művelettel válhat láthatóvá; admin metadata PATCH és draft rollback nem változtathatja meg a published revisiont vagy public URL-t. Published/draft slug külön állapot és redirect/404/SEO migrációs terv szükséges. WEB-002/004/006/007/013, EDT-027/033, SEO-001/004; kódjavítás és teszt bizonyítás előtt NOT FIXED.
- **Külön modulokból elérhető közös képességek:** Brand Kit, témák, design tokenek, ikonok, sablonok, blokkkönyvtár és presetek → **49.3. Márka és designrendszer**; feltöltés, asset-regiszter, média-metaadatok és használati helyek → **49.4. Média- és erőforráskönyvtár**. Az Editor ezek kiválasztására/használatára adhat felületet, de a kanonikus kezelésük nem ide tartozik.

### 49.3. Márka és designrendszer
**Tulajdonosi határ:** a Brand Kit, vizuális identitás, design tokenek, témák, újrahasznosítható sablonok, presetek és komponensváltozatok központi szerződésének gazdája. A fájlok bináris tárolása és asset-életciklusa a 49.4 modulé; a 49.3 az asset ID-kat és a brandhasználat szabályait kezeli. A Visual Editor a közös elemeket alkalmazza, nem tart fenn külön Brand Kitet.
- **Témák és variánsok:** light/dark, platform- és kampányvariáns, publikált verzió, kompatibilitás, előnézet és visszaállítás.
- **Komponens- és mintakönyvtár:** globálisan szinkronizált komponens, globális sablonrész és önállóan testreszabható minta külön kezelése; hatókör és függőségek megjelenítése.
- **Ikonok és presetek:** egységes ikonregiszter, stílusváltozatok, hozzáférhetőség, keresés és komponensszintű presetek.
- **Brand Kit:** logóváltozatok, színek, betűk, ikonok, grafikai elemek, hangnem, írásmód, tiltott/előnyben részesített megoldások.
- **Brand assetek:** stream overlay, thumbnail, intro/outro, social post, merch design, watermark, email sablon.
- **Közös design tokenek:** globális és komponensszintű értékek, theme-variánsok, kontrasztellenőrzés, sötét/világos mód.
- **Brand consistency:** automatikus ellenőrzés és javítási javaslat weboldalon, videón, képen, poszton és overlayen.
- **Export:** SVG/PNG/WebP és más támogatott formátumok, szín-/méretváltozatok, licenc- és eredetadatok.

### 49.4. Média- és erőforráskönyvtár
**Tulajdonosi határ:** ez a modul a fájlok, médiatartalmak, ikonok, fontok, asset-metaadatok, feldolgozási állapotok, használati hivatkozások és törlési/archiválási életciklus kanonikus gazdája. A bináris tartalom R2-ben, a kereshető metaadat és asset ID D1-ben marad; más modulok az asset registryt hivatkozzák, nem saját médiatárat építenek.
- **Asset registry:** stabil asset ID, site/workspace scope, tulajdonos, típus, méret, MIME, checksum, verzió, feldolgozási és biztonsági státusz.
- **Könyvtár és megtalálhatóság:** képek, videók, hangok, ikonok, fontok, dokumentumok, thumbnailök és exportok; keresés, szűrés, rendezés, címkék, gyűjtemények és lapozás.
- **Feltöltés és feldolgozás:** egyenkénti/tömeges feltöltés, progress, cancel, retry, megszakadt feltöltés helyreállítása, preview, thumbnail, variánsok és optimalizálás.
- **Metaadat és jogok:** alt text, caption, crop/focal point, forrás, licenc, hozzájárulás, lejárat és privát asset-hozzáférés.
- **Használati helyek:** oldalak, blokkok, tartalmak, overlayek, brand elemek és termékek asset-referenciáinak visszakeresése; módosítási propagáció és függőségi figyelmeztetés.
- **Biztonságos életciklus:** MIME-/méretellenőrzés, SVG-szűrés, letöltési jogosultság/lejárat, archiválás, restore, törlés előtti függőségvizsgálat és hibás hivatkozások diagnosztikája.
- **Közös felhasználás:** Visual Editor, Brand Kit, Content Studio, OBS/overlay, Store és AI az asset pickert és kanonikus asset ID-t használja; a saját moduljukban csak a használatukhoz tartozó beállítások élnek.

**2026-10-19 — R2 infrastruktúra (PASS, kizárólag tárolási alap):** Cloudflare R2 aktiválva; `sanci9517-media` bucket létrehozva (Standard, EEUR, alapértelmezett jurisdiction), `r2.dev` nyilvános domain kikapcsolva. A `v2/foundation` `wrangler.jsonc` fájlban a `MEDIA` binding létrehozva (`463e7014faee28aebbaf94cd052502d6b9256bb9`), a Cloudflare Production Worker beállításaiban az `r2_bucket / MEDIA / sanci9517-media` kapcsolat élőben igazolva. A kapcsolódó dokumentációs commitok: `6aad374997e60a5ab6f0982bea3aceaa8931cf14` és `5deb1039ec1ff43e9412b07a1fa97b7cfc3bce91`. Utóbbi commit **mind a hat GitHub-ellenőrzése PASS**, köztük `Workers Builds: sanci9517-streamer-brand`, `editor-core`, `canonical-plan`, `verify`, `source-audit`, `twitch-integration`. A bucket és binding PASS nem azonos a kész feltöltő-API, asset registry vagy Inspector/Picker elfogadásával.

**Következő megvalósítás a 49.4 gazdánál (RES-001, RES-002, RES-003, RES-007, RES-010; az Editor 77.44.7.D fogyasztója):**
1. **Asset alap és adatvédelem (OPEN):** meglévő `media` D1 séma/ownership és `Env.MEDIA` ellenőrzése; stabil site/workspace-szűrt asset ID + véletlenszerű, tenant-scope-olt R2 object key, feltöltési állapot, méret/MIME, biztonságos alt/caption; az adatmegőrzéshez szükséges új D1-migráció csak bizonyított hiánynál, külön migrációs kapuval.
2. **Biztonságos feltöltő és olvasás (OPEN):** szerveroldali authentikáció/jogosultság, allowlistelt és tartalom alapján ellenőrzött MIME, képfájl-kezdetű implementáció, kis fájlméretkorlát, maximális darabszám és rate limit; streaming vagy körülhatárolt upload, hiba/duplikáció/árva R2 objektum helyreállítás, audit; privát fájlok hitelesített olvasása, publikus oldalon csak explicit publikált asset biztonságos Worker-kiszolgálása. Közvetlen nyilvános bucket, közvetlen kliensoldali D1/R2-módosítás és fölösleges R2 API-kulcs tilos.
3. **0 Ft költségcél (OPEN / nem számlázási garancia):** Standard-only, célként **5 GB alkalmazásszintű kvóta** (site összesített tárolás, feltöltés előtti atomikusnak tervezett foglalás, feltöltés utáni korrekció); fájlméret/darabszám és A/B műveletszám figyelése, túlzott műveletek fékezése, dashboard-számlázás rendszeres ellenőrzése. Az R2 ingyenes Standard kerete 10 GB-hónap tárhely, havi 1M Class A és 10M Class B művelet; túllépés számlázható, a bucket nem ad automatikus kemény költségplafont. Nagy videófájlok/automatikus videófeldolgozás későbbi, külön költségkapu.
4. **Egyetlen közös Médiatár és Editor Picker (OPEN):** listázás, keresés, feltöltési progress/hiba/újrapróbálkozás, előnézet, alt/metaadat, kiválasztás asset ID-val; a 77.44 Visual Editor ugyanazon API-ból használ képet/hátteret/galériát és ugyanazon módon rendereli piszkozatban és a publikált oldalon. Nem épül második Editor-fájltár; Save és Publish elkülönítése változatlan.
5. **Elfogadás (OPEN):** jogosult feltöltés → D1 + R2 konzisztens asset → Picker → oldalba illesztés → Save → Preview → Publish → publikus kép; negatív tesztek jogosulatlan/idegen site, hibás MIME és méret, kvóta, árva objektum, törött asset link, privát asset szivárgás; egység-, integrációs-, mobil/desktop-böngészős és Production smoke. Amíg ez nincs végig igazolva, 49.4/RES és a teljes Visual Editor **OPEN** marad.



**2026-10-19 — RES-001/002/003 első R2–D1 képfeltöltő blokk (KÓD KÉSZ / RÉSZLEGES ELFOGADÁS):**
- **Backend:** `src/routes/admin/media.ts`, `/api/admin/media` route; admin `editor` site-jogosultság és same-origin POST; PNG/JPEG/GIF/WebP fájlfejléc-ellenőrzés, maximum 4 MiB/kép, privát R2 objektum, meglévő `media` tábla és `site_id` szerinti keresés; a legfrissebb 50 fájl listája és hitelesített képkérés. Feltöltésnél D1-ben egyetlen feltételes INSERT-tel érvényesített 5 GB/site méretkvóta; sikertelen metaadat-mentéskor kompenzáló R2-törlés. **Nincs új migráció, nincs kliensnek kiadott R2 kulcs, nincs publikus bucket.**
- **Admin UI (első, korlátozott verzió):** `/admin/media` autentikált oldal, reszponzív képfeltöltő + privát galéria, külön menüpont a Creator Control Centerben; a nyers `/admin-media.html` nem hozzáférési útvonal (410). A médiatár beta jelölésű, és nem állítja, hogy működik már a publikus asset-kiszolgálás.
- **Tesztelés:** `tests/media-api.test.js` (feltöltés, listázás, csak jogosult hozzáférés, másik webhely, origin-védelem, érvénytelen MIME/méret, quota, R2 hiba). `npm run test:media` bekerült a kötelező Editor Core workflow-ba; a mediakódot tartalmazó első GitHub Actions körben e tesztlépés PASS, a későbbi Admin UI-változások teljes CI-je és élő manuális elfogadása külön ellenőrzendő. Más ellenőrzési eredmény csak tényleges CI PASS után tekinthető elfogadottnak.
- **Még OPEN / következő logikus csomag:** teljes Editor Asset Picker, D1 asset ID használata az Editor-médiatulajdonságokban, biztonságos **publikált** képkiszolgálás csak oldalhoz kapcsolt/engedélyezett assetből, preview/Save≠Publish paritás, alt/metaadat-szerkesztés, törlés/restore/árva-objektum diagnosztika, feltöltési progress/retry, teljes kvóta és Class A/B műveletfigyelés, mobil+PC éles kézi elfogadás. A 49.4 és teljes WEB-011 **OPEN** marad.

**49.4 / RES-001–003 + WEB-011 77.44.7.D közös Asset Picker és publikált képkiszolgálás (2026-10-19, PR #134 MERGED):**
- A meglévő `/api/admin/media` listája site-scoped fájlnév/alt text keresést, MIME-szűrőt és 1–100 közötti limitet támogat. Ugyanez az API fogadja a hitelesített, same-origin `PATCH` alt szöveg mentést. Az `/admin/media` meglévő felületén kereső és külön menthető alt-leírás mező készült; nincs külön adatgazda vagy tároló.
- Az Inspector a képelem, galéria- és carousel-kép repeater számára a közös Médiatár-választóból UUID asset azonosítót ment a Page Modelbe. A vászon hitelesített `/api/admin/media?id=…` előnézetet használ. A publikált render `/media/{id}` útvonalat állít elő; a Worker csak ugyanazon, domainnel feloldott site aktív `published_content_json` dokumentumának pontos asset ID hivatkozása esetén szolgálja ki. A draft Save és a Publish továbbra is külön művelet. Publish szerveroldalon ellenőrzi, hogy minden asset ID a dokumentum site-jához tartozik.
- Nincs séma-/D1-migráció, R2 törlés, secretmódosítás, közvetlen nyilvános bucket vagy éles adatmódosítás. A publikus keresés a publikált dokumentumot ellenőrzi, nem ad általános listázó végpontot; a nyilvános cache legfeljebb 300 másodperc.
- **Ellenőrzés és kiadás:** PR #134 (`https://github.com/sanci9517/sanci9517/pull/134`) merge commit `d8b80c098b0f6516a8300b36cc8e90ec22a7198c`; minden PR és merge utáni GitHub check PASS. `npm run test:media` 6/6, `npm run test:editor` 96/96, `npm run test:web013` 58/58, `npm run test:editor:layout` 19/19 (Chromium, mobil/desktop), Admin home 16/16, Admin access 2/2, TypeScript, migration gate és `git diff --check` PASS. Wrangler dry-run a DB/MEDIA bindingeket felismerte. Cloudflare Workers Production build-check `c29b8771-985e-41ec-8523-186f8505691c` success. Éles Worker version lekérdezése Wrangler CLI-n keresztül `CLOUDFLARE_API_TOKEN` hiánya miatt meghiúsult; ezért aktív production version/rollout, fizikai éles R2 feltöltés/publikálás és Admin PC/telefon elfogadás **UNVERIFIED**, nem PASS.
- **Még OPEN:** videó/hang eszközök és háttérkép-választó; R2 metadata esetén alt auto-fill/szinkron; asset usage index, hivatkozás-helyek, archiválás/törlés/restore és árva-objektum helyreállítás; feltöltési előrehaladás/megszakítás/újrapróbálás; API műveletszám/rate protection és szolgáltatói költségfigyelés; tényleges Production worker version és a picker/admin UI bejelentkezett PC+telefon acceptance. Következő 49.4 blokk a használati index és biztonságos eltávolítás előfeltétele, mellette a `77.44.7.A/C` Inspector/background/media parity. A 49.4 és WEB-011 továbbra is **OPEN**.

**49.4 / WEB-011 77.44.7.D — háttérkép Asset Picker, PR #136 MERGED (2026-10-19):** A meglévő közös Picker az Inspector dekoratív háttérkép mezőjét is kiszolgálja; a Page Model nézetenként `backgroundAssetId` hivatkozást tárol, külön kép-/átmenet-/méret-/pozíció-/ismétlési beállítással. A vászon hitelesített, a publikus renderer csak publikált, site-scoped assetet használ. A publikus médiaútvonal a pontos, aktív publikált oldal dokumentumát vizsgálja; a benne véletlenül tárolt másik piszkozatoldal asset ID-ja nem jogosít fájlkiadásra. Publish az idegen site vagy hibás képazonosító ellen véd; Save külön művelet. A mobilon örökölt kép explicit kikapcsolható, majd az öröklés visszaállítható. Helyi TypeScript, Editor Core **96/96**, Média API **6/6**, WEB-013/tenant **58/58**, Chromium Editor **19/19**, kanonikus terv, diff-ellenőrzés és Wrangler dry-run **PASS**. [PR #136](https://github.com/sanci9517/sanci9517/pull/136) minden checkje és a merge utáni hat GitHub-check PASS; squash commit `93e69928b9288351f1ff4b6d5af5b048592e5901`, merge utáni Workers Production build-check `6dba3c65-7c7c-4410-b1ec-3b608715d96b` success. Az aktív Worker verziója, a fizikai Production R2 és a felhasználói PC/telefon acceptance **UNVERIFIED**. Nincs D1/R2/secrets módosítás. A használati index, biztonságos eltávolítás, árva-helyreállítás, feltöltési UX/költségfigyelés és videó/hang **OPEN**.

**49.4 / RES — használati helyek és eltávolítási előfeltétel, helyi ellenőrzés PASS (2026-10-19):** A már létező asset registryhez hitelesített, site-scoped, `no-store` használati hely lekérdezés készült. A jelenlegi piszkozat, aktív publikált snapshot, archivált oldal és korábbi Editor-revízió külön látszik, pontos node/mező hivatkozással. Sérült dokumentum vagy mennyiségi korlát esetén az eredmény `complete=false`, így nem használható végleges „nem használt” bizonyítékként. A publikus képútvonal csak látható, a publikált fa gyökeréből elérhető és ténylegesen renderelt képmezőhöz tartozó hivatkozást enged; idegen vagy levált node nem jogosít képkérésre. Az Admin Médiatárban az eredmény mobilon is elérhető; új törlés, R2 módosítás és adatbázismigráció nincs. Helyi TypeScript, Média API **7/7**, Editor Core **96/96**, WEB-013 **58/58**, Chromium Editor **19/19** és diff-ellenőrzés PASS. [PR #137](https://github.com/sanci9517/sanci9517/pull/137) minden PR-check után MERGED `79662e84d6bb5b5fd73e490360808917551c1a5b`; a merge utáni hat GitHub-check PASS, Cloudflare Workers Production build ID `bce89d4e-bea2-4699-be6a-2db073c02b94` success. Az aktív Worker-version/rollout **UNVERIFIED**. A biztonságos archiválás/törlés/restore, az árva R2 objektumok helyreállítása és a többi 49.4 követelmény továbbra is **OPEN**.

**49.4 / RES upload UX — Feltöltési progress, megszakítás és kézi retry (2026-10-19; PR #145 MERGED `5ef040a149cbaa964a0cb01f8db78327d4f591e4`, PR CI PASS).** A meglévő Admin Médiatár `/api/admin/media` végpontjára épülő, egyképes feltöltő tényleges elküldött bájtokra épülő folyamatjelzőt, az elküldés után külön szerveroldali feldolgozásjelzést, megszakítás gombot és feltételes, kizárólag felhasználó által kezdeményezett újrapróbálkozást kap. Hibánál a kiválasztott fájl megmarad; hálózati hibánál az ismeretlen szerveroldali eredmény miatt a képtár ellenőrzésére figyelmeztet, nem végez csendes auto-retryt. Nem változik a 4 MiB fájlkorlát, 5 GB célkvóta, site-ownership vagy a D1/R2 tárolási szerződés; nincs migráció, R2-adatmódosítás, direkt klienshozzáférés vagy új feltöltőszolgáltatás. Valós Chromium desktop/mobil pozitív, negatív MIME, manuális retry és cancel regresszió, TypeScript, Média API, canonical-plan, verify, Twitch és Workers Production build **PR CI PASS**; a #145 funkció `v2/foundation` ágba MERGED. A merge utáni `editor-core`, `canonical-plan`, `verify`, `source-audit`, `twitch-integration` és Cloudflare Workers Production build-check **PASS** (build ID `515440f1-b1b2-4d9e-be2b-78b52925275a`). Valós Production R2 feltöltés, felhasználói PC/telefon kézi elfogadás továbbra is **UNVERIFIED**; a 49.4 teljes életciklusa OPEN. Következő: asset-duplikátumkezelés/idempotencia, életciklus és kvótamérés külön kis blokkokban.

**49.4 / RES — Site-scoped képtartalom-duplikációvédelem (2026-10-19; PR #147 MERGED `9aeb9f42ac48fd6bd6e46cf1530d460c768df186`, PR CI PASS).** A képfeltöltő szerveroldalon a `siteId` és a validált képbájtok SHA-256 lenyomatából UUIDv4 alakú, determinisztikus asset ID-t képez az **új feltöltéseknél**; így a sikeres korábbi feltöltés ismétlése (más fájlnévvel vagy elveszett kliensválasz után is) a már meglevő képet adja vissza HTTP 200 és `duplicate:true` jelzéssel. Eredeti név, alt szöveg és korábbi Editor-hivatkozások változatlanok; új bináris tartalom HTTP 201 és új assetet kap. A párhuzamos kérések külön véletlen R2 object key-vel dolgoznak: a D1 egyedi asset-ID ütközés után csak a vesztes kérelem saját R2-objektuma törölhető; sikeres/elhagyott D1-válasz esetén a már tárolt kép védett. A duplikált találat bájttartalma szerveroldalon visszaellenőrzött; a hiányzó/hibás tárgyat nem jelzi sikeres újrahasználatnak. A kliens külön üzenetben jelzi az újrafelhasznált képet. **Korlát:** a korábbi véletlenszerű ID-jú, migráció előtti assetek nincsenek visszamenőlegesen lenyomatozva/összevonva; nincs tömeges R2/D1 adatátírás, nincs D1 migráció. SHA-256 lenyomat 122 bites UUIDv4 formára rövidített (kriptográfiailag nagyon kis, de nem abszolút nulla ütközési valószínűség); eltérő tartalomra a duplikált ID-t nem adja ki. Core/média-API, mobil Chromium UI, cross-site, konkurens kérés, elveszett D1 visszaigazolás és megőrzött metaadat tesztek a [#147 PR-ben](https://github.com/sanci9517/sanci9517/pull/147) **PASS**; `canonical-plan`, `verify`, `editor-core`, `twitch-integration`, Cloudflare Workers Production build PR CI **PASS**, a funkció `v2/foundation` ágba egyesült. A merge utáni `editor-core`, `canonical-plan`, `verify`, `source-audit`, `twitch-integration` és Cloudflare Workers Production build-check **PASS** (build `28075b48-fcfe-46a5-bbdd-9dd677bb06e5`). A valódi bejelentkezett Production R2 feltöltési és PC/telefon felhasználói elfogadás továbbra is **UNVERIFIED**. A teljes Médiatár/Visual Editor, fizikai Production R2 E2E és PC/telefon kézi elfogadás OPEN.

**49.4 / RES-archívum (2026-10-19; PR #149 MERGED `769ddae5962fc9ea0203186591fbb4abbb294ff8`, PR és merge utáni CI PASS, D1 Production 0028 PASS):** külön aktív/archivált képlista, kétszeri megerősítésű soft-archiválás és eredeti asset ID/alt/metaadat megőrzésével történő visszaállítás. **Éles D1 bizonyíték:** Production D1 0028 migration applied and verified 2026-10-19: five SQL statements successful; archived_at, site index and all three guards present; PRAGMA foreign_key_check empty; media row count zero; Wrangler ledger intentionally remains 0024 because 0025-0028 are manually staged; no R2 object write/delete. PR #149 végső CI és merge utáni `editor-core`, `verify`, `canonical-plan`, `source-audit`, `twitch-integration` és Cloudflare Workers Production build **PASS**; merge SHA `769ddae5962fc9ea0203186591fbb4abbb294ff8`. Cloudflare Deployments API: aktív verzió `5bbb944c-6296-431d-ba98-eba95b7edd3a`, 100% forgalom (2026-10-19T12:19:23Z); az API nem társít ehhez egyértelmű GitHub SHA-t. Real authenticated Media UI upload/archive/restore and PC/mobile acceptance remain OPEN. 

A `scripts/pending/0028_media_archive.sql` új, nullable `media.archived_at` mezőt/indexet és D1 INSERT/UPDATE triggerekből álló jogosultsági-védelmi réteget vezet be: új piszkozat, publikált snapshot vagy Editor-verzió nem hivatkozhat archivált képre (konkurens publish esetén sem). Archiválás előtt a teljes, jogosult webhelyhez tartozó használati riportnak befejezettnek és referencia-mentesnek kell lennie; ezt D1 atomikus, konzervatív SQL predikátum is megerősíti. Archivált képet az Editor Picker nem listáz, a publikus `/media/{id}` nem szolgál ki, újrafeltöltéskor nem történik rejtett visszaállítás; visszaállításhoz a privát R2-objektum létezése szükséges. R2-objektumot nem törlünk; az archivált kép változatlanul beleszámít az 5 GB alkalmazásszintű célkvótába. Szerepkör, webhely-ownership, cross-origin, hibás schema, használati referencia, sérült snapshot, versenyhelyzet, mobil/desktop UI, restore és missing R2 ellenőrzések a PR-ben. **Kiadási kapu PASS:** a korábbi éles, kézi 0025–0027 láncot követő `scripts/pending/0028_media_archive.sql` alkalmazva és visszaellenőrizve, *az automatikus Wrangler-ledger szándékosan 0024-en marad*. A Worker PR és merge utáni tesztjei sikeresek. A valódi, bejelentkezett felhasználói Production R2 archiválás/visszaállítás és a PC/telefon kézi elfogadás **UNVERIFIED**, ezért a teljes 49.4/WEB-011 OPEN marad. Nincs R2-törlés vagy permanens asset-delete ebben a blokkban.

**49.4 / 77.44.7.D publikus asset-jogosultság szigorítása (2026-10-19, PR #151 MERGED):** A már létező site-scoped Asset Registry és `/media/{id}` útvonal a publikált oldal tényleges renderelési fáját és látható eszköznézeteit ellenőrzi. Levált node, gyermekeket nem renderelő szülő, rejtett szülő, minden nézetben hatástalan reszponzív háttér, nem renderelt gyökér-tartalom, hibás Card, érvénytelen videóforrás vagy a galéria/carousel első 40 elemén kívüli hivatkozás nem ad publikus hozzáférést. A használati riport változatlanul a piszkozatokat, publikált/archivált oldalakat és revíziókat is vizsgálja; az archiválás adatvédelmi előfeltétele nem lazult. Helyi média-API **15/15**, TypeScript és WEB-013 **58/58** PASS; [#151 PR](https://github.com/sanci9517/sanci9517/pull/151) és a merge utáni hat GitHub-check, köztük Cloudflare Workers Production build `5cf986c5-943f-4051-970b-cadd228f0f27`, **PASS** (`58ff974a5af60a01e2bdbe264e978e2dfd357ed8`). Az aktív Worker-verzió/source-SHA és a valódi éles R2-folyamat **UNVERIFIED**. Nincs D1-migráció, R2-írás vagy kézi éles adatváltoztatás. A fizikai Production R2 és a bejelentkezett felhasználói ellenőrzés **UNVERIFIED**; teljes 49.4 **OPEN**.

### 49.5. Élő adás és Stream Studio
**Tulajdonosi határ:** A Stream Studio a műsor/adásrend, stream-session, live vezérlőnézet és adáshoz kötött események felhasználói munkaterülete. Provider-hitelesítés a 49.7, OBS-eszközművelet a 49.6, VOD-utómunka a 49.8, workflow a 49.14 modulban marad; az élő nézet ezek állapotát olvassa és engedélyezett actionöket indít.
- **Stream Planner:** adásrend, ismétlődő események, game/kategória, cím, leírás, vendégek, emlékeztetők.
- **Live Control Room:** stream állapot, platformonkénti státusz, késleltetett/elavult adat jelzése, eseményfolyam.
- **Multistream:** több célplatform, platformonkénti cím/leírás/kategória, capability-mátrix, előzetes ellenőrzés.
- **Unified Chat:** támogatott platformok üzeneteinek egy nézetben olvasása, válasz, platformonkénti küldési korlát, export.
- **Stream Checklist:** mikrofon/kamera/scene/bitrate/kapcsolat/overlay/alert ellenőrzések, tesztmód és adás előtti próba.
- **Stream notes/markers:** időbélyegek, highlight-jelöltek, jegyzetek, fontos események és későbbi vágási pontok.
- **Stream replay/backup:** rögzítési állapot, lokális felvétel állapota, támogatott tartalék stream, hibaértesítés; a platform/API korlátai szerint.

### 49.6. OBS és stream eszközök
**Tulajdonosi határ:** Ez a modul a stream-eszközök, OBS-kapcsolat működtetésének és overlay-runtime konfigurációjának kezelőfelülete. A külső fiókok OAuth-/provider-kapcsolatának központi nyilvántartása a 49.7-ben, az eseményautomatizálás a 49.14-ben, az overlayben felhasznált assetek a 49.4-ben maradnak.
- **OBS kapcsolat:** párosítás, hitelesítés, kapcsolat állapota, engedélyek, reconnect, hibakeresés; jelszó és token soha nem jelenhet meg logban.
- **Scene/source áttekintés:** scene-váltás, source státusz, source visibility, audio mute/volume és egyéb csak támogatott API-műveletek.
- **Overlay Studio:** browser source URL, méret, safe area, canvas, scene-enkénti variáns, teszt/preview, verzió és rollback.
- **Overlay/widget könyvtár:** alert box, event list, chat box, goal/progress bar, timer, countdown, now-playing, recent events, sponsor panel, QR/link panel.
- **Interakciók:** follow/sub/donation/cheer/raid/redeem események, media share, szavazás, wheel, giveaway, loyalty/points, csak megfelelő platform- és szolgáltatói jogosultsággal.
- **Chatbot:** parancsok, aliasok, változók, időzítők, spam- és linkvédelem, moderációs szabályok, shoutout, FAQ és jogosultsági szintek.
- **Automatizált scene/macro:** hotkey, stream deck / Macro Deck / MIDI / HTTP webhook / külső vezérlő adapterek, dry-run, visszajelzés és engedélyezett parancslista.
- **Audio/video segédletek:** hangszint-figyelés, némítás- és clipping-jelzés, scene/source checklist, virtuális kamera/portrait output integráció, ahol elérhető.
- **Plugin- és widget-központ:** telepített/engedélyezett bővítmények, kompatibilitás, verzió, permission scope, aláírás/eredet, frissítés, eltávolítás és sandbox.
- **Fontos határ:** a webes platform nem feltételezi, hogy minden OBS plugin böngészőből vezérelhető. Elsődleges a dokumentált OBS WebSocket/browser source; natív plugin vagy desktop companion külön, biztonsági és telepítési döntéssel készül.

### 49.7. Kapcsolatok és integrációk
**Tulajdonosi határ:** A 49.7 birtokolja a külső szolgáltatói kapcsolatok, tokenek, scope-ok, webhook-állapotok és adapter-képességek kanonikus életciklusát. A szolgáltató által elérhető üzleti funkciók a saját moduljukban maradnak (adás 49.5, tartalom 49.8, közösség 49.9, analitika 49.13); kapcsolati állapotuk ide vezet vissza.
- **Kapcsolatok:** Twitch, YouTube, TikTok, Discord, Kick és további provider-adapterek.
- **Fiókállapot:** connect/disconnect, scope, lejárat, újracsatlakozás, account/channel választás, jogosultságok.
- **Provider-képességek:** olvasás/írás/publikálás/chat/analitika külön jelölése; nem támogatott műveletet a UI nem ígérhet.
- **Webhookok és események:** aláírás-ellenőrzés, replay-védelem, deduplikáció, retry, dead-letter és diagnosztika.
- **Integrációs napló:** utolsó siker, utolsó hiba, rate limit, API-kvóta, szinkron és helyreállítás.
- **Későbbi bővítések:** email, naptár, felhőtárhely, fizetés, affiliate, CRM, streaming hardware és automatizációs szolgáltatók.

### 49.8. Tartalomstúdió
**Tulajdonosi határ:** A Tartalomstúdió a creator médiaprodukciós munkafolyamatainak, szerkesztési projektjeinek, tartalomnaptárának, csatornavariánsainak és közzétételi feladatainak gazdája. A bináris asset-regiszter a 49.4, a weboldal oldal-/navigációmodellje a 49.2, a provider-credential a 49.7 modulban marad. A 49.2-ben szereplő webes CMS-kollekciók strukturált webtartalmi modellje a WEB/DYN szerződéshez tartozik; a 49.8-ból kapcsolódó tartalom csak referenciával jelenhet meg az oldalon.
- **Tartalomkönyvtár:** videó, VOD, clip, Short/Reel, kép, hang, podcast, stream replay, szöveg és kampányanyag.
- **Szerkesztés:** timeline, vágás, trim, crop, aspect ratio, reframing, scene, B-roll, átmenet, hang, szín és brand overlay.
- **Felirat és transcript:** beszédfelismerés, speaker/fejezet, időzítés, felirat-stílus, fordítás, SRT/VTT és szerkeszthető szöveg.
- **AI clip finder:** highlight-javaslatok, kontextus és időbélyeg, chat/stream események összekapcsolása, manuális kiválasztás.
- **Thumbnail és grafika:** sablonok, variánsok, cím-/képkombinációk, platformonkénti méretek és preview.
- **Platformverziók:** hossz, képarány, cím, leírás, hashtag, thumbnail és CTA csatornánként.
- **Tartalomnaptár:** ötlet → draft → review → scheduled → published/failed, kampány és ismétlődő sorozat.
- **Közzététel:** közvetlen API-publikálás, ha engedélyezett; különben export és kézi publikálási útmutató.
- **Média- és jogkezelés:** felhasználási jog, zene, vendég-hozzájárulás, lejárat, forrás és eltávolítási kérés.

### 49.9. Közösség és rajongók
**Tulajdonosi határ:** A közösségi interakciók, moderációs ügyek és rajongói profilok felhasználói kezelőfelülete. A közös identitás és hitelesítés a 49.19 szerződését használja, a tagsági entitlement a 49.11-ből érkezik, a provider-összeköttetés a 49.7-ben marad; egyik sem másolható külön közösségi adattárolóba.
- **Fan account:** regisztráció, bejelentkezés, profil, preferenciák, adatletöltés/törlés és biztonsági beállítások.
- **Közösségi aktivitás:** kommentek, reakciók, szavazások, kérdések, beküldések, közösségi posztok.
- **Tagsági közösségi nézet:** a szintek, jogosultságok és entitlement a **49.11. Támogatás és tagság** modulból érkezik; itt a közösségi megjelenítés és hozzáférés-ellenőrzés marad.
- **Közösségi jutalmak:** jelvények, mérföldkövek, hűségpontok, kihívások és giveaway-szabályok.
- **Discord összekötés:** szerepkiosztás és visszavonás tagsági státusz alapján, botengedélyekkel és naplóval.
- **Moderáció:** szabályok, report queue, tiltás/korlátozás, fellebbezés, spamvédelem, AI-javaslat és emberi felülvizsgálat.

### 49.10. Bolt és kereskedelem
**Tulajdonosi határ:** ez a modul a creator saját termékkatalógusának, checkoutjának, rendelésének és digitális termékdeliveryjének gazdája. Tagság/előfizetés a 49.11, szponzoráció/affiliate üzleti folyamat a 49.12, összesített metrika a 49.13 modulhoz tartozik.
- **Termékkatalógus:** fizikai termék, merch, digitális letöltés, bundle, variáns, készlet, ár, adó- és szállítási szabályok.
- **Rendelések:** checkout, fizetési státusz, teljesítés, szállítás, visszatérítés, lemondás és rendeléshez kötött ügyfélszolgálat.
- **Promóciók:** kupon, ajándékkártya, árengedmény, termékcsomag és lejárat.
- **Digitális termékdelivery:** biztonságos letöltés, vásárlási entitlement és hozzáférés-visszavonás refund/chargeback esetén.
- **Termékoldalak:** lista, keresés, termékadat, média, SEO és Editor blokk; a termékadat a Store domainben marad.
- **Kereskedelmi megfelelőség:** payment/tax/VAT/invoicing/consumer-rights ellenőrzés a provider és jogi felülvizsgálat szerint.

### 49.11. Támogatás és tagság
**Tulajdonosi határ:** ez a modul a tip/support provider státusz, tagsági szintek, megújítás, perks és entitlement szabályok kanonikus gazdája. A Store termékrendelése és a Community felületi megjelenítése külön marad.
- **Támogatás:** egyszeri és visszatérő támogatás, célok, kampányhoz kötött support CTA, köszönőoldal/üzenet, provider-státusz.
- **Tagság:** szintek, billing period, előnyök, megújítás, lemondás, failed payment, refund/chargeback és entitlement lifecycle.
- **Member-only hozzáférés:** exkluzív tartalom/esemény és digitális hozzáférés; a COM/WEB felületek a kanonikus entitlementet fogyasztják.
- **Discord szerepszinkron:** tagsági entitlement alapján kiosztás/visszavonás, botengedélyekkel, retryval és auditnaplóval.
- **Supporter history:** privát támogatási előzmény, opt-in publikus felsorolás és adatvédelmi beállítások.

### 49.12. Szponzoráció és üzleti központ
**Tulajdonosi határ:** ez a modul a creator B2B üzleti kapcsolatainak, kampányainak, affiliate attribúciójának és szponzorációs deliverable-jeinek gazdája. Nem a Store rendelési adatforrása és nem az Analytics metrikatárolója.
- **Media kit és ajánlat:** exportálható press/media kit, rate card, üzleti dokumentum és ajánlat.
- **Kampánykezelés:** campaign cél, státusz, partner, deliverable, határidő, link/kód, jóváhagyás és eredményriport.
- **Affiliate:** partnerlink/kód, jutalék és konverzió kizárólag mérhető és jogszerű keretben.
- **Szponzori eszközök:** brand-safe assetek, kampányhoz rendelt tartalom/termék, linkek, UTM és riport.
- **Üzleti adatvédelem:** lead/deal dokumentumok külön jogosultsággal, hozzáférésnaplóval és retention policyvel.

### 49.13. Analitika és növekedés
**Tulajdonosi határ:** Az Analytics a mérési események, riportok, attribúció és aggregált olvasási modellek tulajdonosa; az eredeti rendelés, adás, tartalom, támogatás és kampány rekordja a saját domainjében marad. Nem elérhető vagy nem összehasonlítható provider-metrikából nem számolható tényként megjelenített összesítés.
- **Összesített dashboard:** platformonkénti nézettség, követők, engagement, streamidő, tartalomtípus és bevétel.
- **Adatminőség:** forrás, utolsó frissítés, becslés/valós adat, hiányzó és nem összehasonlítható metrikák jelzése.
- **Tartalomelemzés:** videó/clip összehasonlítás, megtartás és elérhető watch-time, publikálási idők, tesztelt variánsok.
- **Célok és kísérletek:** célkitűzés, mérföldkő, kísérlet, eredmény és következő javaslat.
- **SEO/AEO és webanalitika:** SEO teljesítménymutatók, keresési láthatóság, oldalmegtekintés, konverzió és kampány-UTM; canonical/robots/redirect metadata a WEB/SEO_PUBLICATION domain tulajdona.
- **Export és jelentés:** CSV/JSON, időszakos riport, forrásmegjelölés és csapatnak megosztható összefoglaló.

### 49.14. Automatizációk
**Tulajdonosi határ:** Az Automatizációk a workflow-definíció, trigger–feltétel–művelet kapcsolás, futási állapot és napló gazdája. Nem birtokolja az OBS-eszközt, külső accountot, tartalmat vagy rendelést; csak verziózott, jogosultságellenőrzött domain-actionökön keresztül működhet.
- **Workflow builder:** trigger → feltétel → művelet → eredmény/hibaág; vizuális építés és sablonok.
- **Triggerek:** stream online/offline, új follower/sub/event, tartalom státusz, időpont, rendelés, tagság, webhook és kézi indítás.
- **Akciók:** értesítés, draft készítés, címke, export, engedélyezett overlay/OBS művelet, publikálási előkészítés.
- **Biztonsági korlátok:** dry-run, idempotency, rate limit, jóváhagyás, retry, rollback és futási napló.
- **Hibakezelés:** időtúllépés, leállítás, újrapróbálás, hibás workflow karantén, értesítés és manuális helyreállítás.

### 49.15. SANCI AI
**Tulajdonosi határ:** A SANCI AI a modellkonfiguráció, költségkeret, memória-/adatengedély, javaslat, jóváhagyás és AI-futás kezelőfelülete. Az AI nem válik a weboldal, média, integráció, stream vagy kereskedelem párhuzamos adatgazdájává; az elfogadott műveletek ugyanazon domain API-kon és auditon mennek át.
- **AI Control Center:** modell/provider, költségkeret, kvóta, adatforrás, retention, memória, engedélyek és leállító kapcsoló.
- **AI chat és projektkontextus:** weboldal, brand, stream, tartalom, közösség és célok kontextusa jogosultság szerint.
- **Website Designer:** oldal/szekció/komponens létrehozás, design és responsive javítás, SEO/accessibility ellenőrzés.
- **Live Coach:** opt-in stream-/chat-/OBS-adatokból technikai figyelés, pillanatjelölés, javaslat és bizonytalanság jelzése.
- **Content Producer:** transcript, clip, vágás, felirat, fordítás, thumbnail, leírás, platformvariáns és export.
- **Community Assistant:** kérdések összegzése, moderációs javaslat, FAQ és tagsági/Discord művelet-előkészítés.
- **Business Analyst:** tartalom- és kampányteljesítmény, trendek, hipotézisek és mérhető kísérletek.
- **Automation Builder:** természetes nyelvből workflow draft, szimuláció, diff és jóváhagyás.
- **Multi-agent feladatok:** specialista feladatok összehangolása közös kontextussal, költségkorláttal és nyomon követhető eredménnyel.
- **Action safety:** az AI minden változtatást a domain API-n keresztül készít elő; kockázat szerint preview, diff, jóváhagyás, végrehajtás és rollback.

### 49.16. Globális keresés és parancspaletta
**Tulajdonosi határ:** a SEARCH domain a jogosultság- és site-scope szerint szűrt keresési index gazdája; a találat mindig a kanonikus domainrekordra navigál.
- **Globális kereső:** oldalak, assetek, tartalmak, termékek, kapcsolatok, workflow-k és beállítások keresése a felhasználó engedélyei szerint.
- **Command palette:** billentyűzetes műveletindítás és gyors navigáció; minden parancs a célmodul kanonikus műveletét hívja.
- **Mentett keresési/listanézetek:** szűrők, oszlopok, kedvencek és legutóbbi elemek; dashboard elrendezési preferenciái a SETTINGS domainben maradnak.
- **Indexfrissesség:** permission/site-váltás, törlés és domainmódosítás után index/cache invalidálás; stale állapot látható.

### 49.17. Értesítési központ
**Tulajdonosi határ:** a NOTIFICATION domain birtokolja az értesítést, kézbesítési próbálkozást és preferenciákat; a Dashboard csak összefoglalót jelenít meg.
- **Központ:** in-app/email/push kategóriák, prioritás, olvasott/olvasatlan állapot és forrásmodulra mutató link.
- **Preferenciák:** csatornánkénti opt-in/out, digest, csendes időszak, leiratkozás és adatvédelmi retention.
- **Delivery lifecycle:** queued/sent/delivered/failed ahol igazolható, retry, deduplikáció, rate limit és kézbesítési diagnosztika.
- **Domainkapcsolat:** stream, content, integration, automation, support és store eseményekből készül; nem saját üzleti eseményt talál ki.

### 49.18. Súgó és onboarding
**Tulajdonosi határ:** a HELP_CENTER domain birtokolja a súgócikkeket, fogalomtárat, onboarding progresszt és visszajelzést; az ADM shell kontextuális belépési pontot biztosít.
- **Kontextuális súgó:** az aktuális modulhoz/mezőhöz illeszkedő rövid útmutató és dokumentált korlátok.
- **Interaktív onboarding:** lépések, teljesítési állapot, kihagyás/újrakezdés és szerepkör/site-scope szerinti útvonal.
- **Fogalomtár és dokumentáció:** kereshető, verziózott leírások és hivatkozás a kapcsolódó funkciószerződésre.
- **Hibaelhárítás és technikai feedback:** emberi nyelvű magyarázat, diagnosztikai azonosító, hibajelentés/terméktámogatási kérés; ez nem a 49.11 fan-támogatási/tagsági pénzügyi domainje. Érzékeny adatot automatikusan redaktálni kell.

### 49.19. Beállítások, biztonság és adat
**Tulajdonosi határ:** A Beállítások a személyes és site-szintű konfiguráció, biztonsági policy, adatkezelési műveletek és naplók felülete. A csapatmeghívás/workspace-életciklus a 49.22, provider OAuth a 49.7, AI adat-/modellpreferenciák szakmai kezelése a 49.15 modulhoz tartozik, egységes jogosultsági ellenőrzéssel.
- **Profil és személyes preferenciák:** nyelv, időzóna, dátum/pénznem, accessibility és privacy preferenciák; aktív workspace/csapatkezelés a 49.22 modulhoz tartozik.
  - **49.19.Locale preferences (P09.5; 54.14.01):** Admin UI nyelve felhasználóhoz kötött preference, publikus oldal alapértelmezett és engedélyezett nyelve site-scoped; kérés-/látogatóválasztás felülírásának és fallback sorrendjét explicit szerződés szabályozza. LOC-001/003/004 csak fordítási és SEO-fogyasztó; nyelvváltás nem írhatja át a canonical tartalmat vagy a másik felület nyelvét. Negatív acceptance: Admin locale változás nem módosíthat public locale-t.
- **Jogosultsági policy és audit:** szerep-/műveletjogok szerveroldali szabályai; csapattag-meghívás és szerepkiosztás a 49.22 modulban történik.
- **Biztonság:** session, eszközök, jelszó/SSO későbbi támogatása, 2FA, rate limiting, secret rotation és gyanús aktivitás.
- **Adatkezelés:** export, törlés, retention, consent, cookie/adatvédelmi beállítások, adatfeldolgozók.
- **Biztonsági mentés:** konfiguráció és tartalom export, visszaállítási próba, verziózott backup és disaster recovery.
- **Állapot és naplók:** health, background job, queue, API-kvóta, hibák, események, auditálható adminműveletek.
- **SaaS csomag és használat:** csak összefoglaló/hivatkozás; a plan, usage, quota, billing és számla lifecycle kanonikus tulajdonosa a 49.22 modul.

### 49.20. Fejlesztői platform és API — későbbi platformfázis
**Tulajdonosi határ:** A fejlesztői platform a publikus fejlesztői API/SDK, kulcsok, kvóták és kompatibilitási szerződések gazdája. Nem váltja ki a belső domain API-kat; a provider-összeköttetések a 49.7, a külső bővítmények életciklusa a 49.21 modulban marad.
- **Dokumentált API:** verziózott endpointok, schema, hibakódok, auth és deprecation policy.
- **Integrációs SDK:** OAuth adapterek, webhook/event contractok, klienskönyvtár és példakód.
- **API key lifecycle:** létrehozás, scope, megjelenítés egyszer, rotáció, lejárat, visszavonás és audit.
- **Webhook registry/tester:** aláírás, retry, replay/delivery napló, tesztesemények és dead-letter diagnosztika.
- **Sandbox és developer tools:** elkülönített workspace, tesztadat, eseménynapló, API-kvóta és dokumentáció.
- **Külső integrációk:** rate limit, tenant/site scope, minimum jogosultság és biztonsági felülvizsgálat.

### 49.21. Bővítmények, widgetek és piactér — későbbi platformfázis
**Tulajdonosi határ:** A piactér és bővítménykezelő a harmadik féltől származó extension-manifest, telepítés, engedély, kompatibilitás és eltávolítás gazdája. A telepített kiegészítő nem hozhat létre jogosulatlan, párhuzamos tartalom-/fiók-/asset-tárolót; az eredeti domain- és API-szerződésekhez kapcsolódik.
- **Extension registry:** manifest, verzió, scope, permission, kompatibilitás, aláírás/eredet, frissítés és eltávolítás.
  - **49.21.Extension lifecycle (P06.1/P06.3/P09.1/P09.3; 54.7.11/54.16.02):** egyetlen közös manifest schema és provenance/signature ellenőrzés, install → activation → update/rollback → revoke/remove állapotgép, explicit capability/permission prompt, sandbox és kompatibilitási ellenőrzés. OBS/widget és Editor csak engedélyezett extensiont fogyaszt; provider OAuth marad 49.7-ben, API/SDK szerződés 49.20-ban. Negatív acceptance: manipulált manifest, revoked signer, jogosultság-eszkaláció, inkompatibilis verzió tiltása; stabil ID gap ellenőrzendő.
- **Widget/overlay SDK:** saját komponensek, konfigurációs séma, preview, események és verziózás.
- **Template/component marketplace:** sablonok, komponensek, overlayek és workflow-k; licenc, szerző, értékelés, frissítés és visszavonás.
- **Biztonságos bővítmény-életciklus:** permission review, izolált futtatás/sandbox, kompatibilitási teszt, supply-chain ellenőrzés, rollback és hozzáférés-visszavonás.
- **Marketplace üzleti modell:** díjazás/revenue-share és szerzői jogi/licencfeltételek csak külön jogi és pénzügyi felülvizsgálat után.

### 49.22. Csapat, több site és SaaS — későbbi fázis
**Tulajdonosi határ:** A csapat és SaaS modul a workspace/site, tagság, meghívás, tenant-elválasztás, csomag és szervezeti jogosultság életciklusának gazdája. A felhasználói identitás, session és alapbiztonsági policy a 49.19-ben marad; a modul csak az ezekhez kötött workspace-hozzáférést kezeli.
- Több creator/site/workspace kezelése egy fiókból, egyértelmű aktív workspace választással.
- Meghívás, csapattagok, szerepek, projekt- és ügyfélhozzáférés, jóváhagyási folyamat.
- Agency/studio mód több creatorhoz, közös sablonok és ügyfél-specifikus brand.
- Előfizetés, csomagok, usage/kvóta, billing, számlázás, lemondás és adat-export.
- Tenant-izoláció, migráció, adatrezidencia és skálázási stratégia; csak az egyfelhasználós alapok stabilizálása után.
- **Munkaterület- és site-életciklus:** workspace/site választó, tulajdonos, alapértelmezett site, archiválás, átadás, domainhez kötött public URL és visszaállítás.
- **Csapattagság és biztonság:** meghívó lejárat/visszavonás, szerepkör és egyedi hozzáférés, aktivitásnapló, időszakos permission review; a session/auth továbbra is a 49.19 biztonsági szolgáltatása.
- **Kollaboráció:** revision conflict, szerkesztési jelenlét, review/approval, feladatok és értesítések ugyanazon Page Model és workflow domain fölött.
- **SaaS-csomagok:** entitlement, usage meter, quota, fair-use, billing webhook idempotencia, trial, upgrade/downgrade, szüneteltetés, lemondás, export és törlés; nincs második fizetési ledger.
- **Tenant isolation és support:** site-scoped D1/R2/cache/background job/webhook/export/restore, auditált és időben korlátozott support hozzáférés, adatrezidencia és migrációs stratégia.
- **Negatív acceptance:** cross-tenant ID/cache leak, role revoke, lejárt invite, billing replay, quota bypass, hibás site transfer, hiányos restore és audit nélküli admin hozzáférés.


---

## 50. Keresztmodulú, kötelező termékképességek

Ezek nem különálló menük: minden érintett modul közös követelményei.

1. **Többnyelvűség és nemzetköziesítés:** Admin és publikus web külön nyelve; locale-aware tartalom, dátum/időzóna/pénznem/számformátum; RTL; fordítási memória/szószedet; AI-fordítás emberi felülvizsgálattal; lokalizált SEO, Open Graph, alt text és URL; nyelvenkénti fallback.
2. **Akadálymentesség:** WCAG 2.2 AA cél; billentyűzet, fókusz, screen reader, kontraszt, reduced motion, felirat/átirat, érthető hibák, nagyítás és touch célterület.
3. **Reszponzivitás:** mobil, tablet, desktop, széles canvas és portrait/landscape; valódi mobil szerkesztési folyamat, nem csak összenyomott desktop.
4. **Megbízhatóság:** autosave státusz, offline/gyenge kapcsolat jelzése, konfliktusfeloldás, idempotens műveletek, retry, background job státusz és adatvesztés elleni védelem.
5. **Visszaállíthatóság:** undo/redo, verzióelőzmény, diff, restore, export/backup és törlés előtti függőségi ellenőrzés.
6. **Adat- és jogosultsági konzisztencia:** közös domain command, szerveroldali authorization, tenant/site scope, érzékeny adatok redakciója és követhető műveletnapló.
7. **Kereshetőség és felfedezhetőség:** globális keresés, modulon belüli keresés, szűrés, rendezés, címkék, kedvencek, recent items és üres állapotokból induló útmutatás.
8. **Értesítések:** egységes notification center, kategória, súlyosság, preferencia, digest és csendes időszak; ne legyen duplikált vagy félrevezető értesítés.
9. **Adatvédelem és tartalmi jogok:** consent, retention, export/delete, vendég-hozzájárulás, copyright, zenei licencek, személyes adatok és AI-feldolgozás szabályai.
10. **Teljesítmény és üzemeltetés:** Core Web Vitals, cache, image optimization, queue/worker limitek, observability, költség- és kvótafigyelés, backup/restore próba.
11. **Import/export és hordozhatóság:** oldal/content/media/brand/workflow export, CSV/JSON és támogatott szabványos formátumok; külső szolgáltatóhoz kötöttség csökkentése.
12. **Tesztelhetőség:** domain unit/integration, API authorization, migration, UI interaction, responsive/accessibility, end-to-end és éles smoke tesztek.
13. **AI átláthatóság:** generált tartalom jelölése, forrás és bizonytalanság, modell- és költséginformáció, jóváhagyás, módosítási diff és felhasználói visszajelzés.
14. **Felhasználóbarát hibaállapotok:** emberi nyelvű magyarázat, teendő, újrapróbálás és support/export lehetőség; technikai részletek a diagnosztikában maradnak.

---

## 51. Külső termékekből vizsgálandó funkcióminták

Az alábbiak kutatási alapok, nem automatikus implementációs döntések. A fejlesztés előtt az aktuális hivatalos dokumentációt, licenceket, API-korlátokat, biztonságot és kompatibilitást ellenőrizni kell.

- **OBS Studio:** scenes/sources, frontend API, plugin API, Python/Lua scripting, browser sources és WebSocket-vezérlés. Forrás: https://docs.obsproject.com/ és https://obsproject.com/kb/remote-control-guide.
- **Streamlabs:** alert box, chat box, event list, goals, tip jar, loyalty, media share, hotkeys, collab/dual output és widget témák. Forrás: https://support.streamlabs.com/hc/en-us/articles/14698267028379-New-to-Streamlabs-Start-Here és https://streamlabs.com/stream-widgets.
- **StreamElements:** overlay builder, custom widgets, alerts, chatbot commands/variables/timers/spam filters. Forrás: https://docs.streamelements.com/.
- **Restream:** többplatformos stream, unified chat, platformonkénti capability, analytics, replay/transcript és tartalék stream. Forrás: https://restream.io/live/multistreaming és https://support.restream.io/en/articles/2379624-what-is-restream-chat.
- **Webflow:** vizuális canvas, shared components/libraries, CMS, interakciók, staging/publishing, locale-onkénti tartalom és SEO. Forrás: https://webflow.com/feature/cms és https://help.webflow.com/hc/en-us/articles/33961240752147-Webflow-Localize-overview.
- **Framer:** AI segítségével létrehozott CMS-collectionök, draft/publish, lokalizáció, locale-onkénti meta és RTL. Forrás: https://www.framer.com/cms/ és https://www.framer.com/help/localization/.
- **Elementor:** kereshető widget-panel, globális widgetek, responsive beállítások, globális brand settings és theme builder. Forrás: https://developers.elementor.com/docs/editor/widgets-panel.html és https://elementor.com/products/website-builder/.
- **Descript:** transcript-alapú vágás, filler-word eltávolítás, zajjavítás, felirat, AI co-editor, remote recording és klipkészítés. Forrás: https://www.descript.com/features.
- **Fourthwall:** saját márkájú shop, tagsági szintek, digitális tartalom, tagsági analitika, Discord-integráció, kuponok és merchandise. Forrás: https://fourthwall.com/features és https://fourthwall.com/memberships.
- **Twitch Developer Platform:** EventSub, chat, extensions, API, authentication és platformonkénti engedélyek. Forrás: https://dev.twitch.tv/docs/ és https://dev.twitch.tv/docs/eventsub/.
- **W3C/WCAG:** akadálymentességi kritériumok és lokalizáció. Forrás: https://www.w3.org/WAI/standards-guidelines/wcag/.

### 51.1. A SANCI platform megkülönböztető értéke
Nem az a cél, hogy minden külső termék teljes másolata készüljön el. A cél az, hogy a creator egy közös Brand Kit, kanonikus adatok, Visual Editor, OBS/Stream Studio, tartalomgyártás, integrációk, közösség, commerce, automatizáció és AI segítségével egy összefüggő munkafolyamatot kapjon. A külső termékben talált jó funkció csak akkor kerül át, ha valódi felhasználói problémát old meg, jogszerűen megvalósítható és fenntartható.

---

## 52. Menütérkép felülvizsgálata a felhasználóval

A 49. fejezet a teljes javasolt menütérkép és funkciókatalógus. Ez az áttekintés nem lezárás: a felhasználói visszajelzés alapján új funkciót a megfelelő menüpont alá kell illeszteni, majd a kanonikus domain-, adat-, jogosultság-, teszt- és fázisleírást is frissíteni kell. Azonos képességet nem szabad párhuzamos menüben másik implementációként létrehozni.

A visszajelzés feldolgozási szabályai:
- **Kell:** bekerül a megfelelő menübe és a részletes funkciókatalógusba.
- **Máshova kell:** a felelősség szerinti modulba kerül, az eredeti helyről hivatkozással.
- **Nem kell:** csak explicit termékdöntéssel hagyható el; meg kell vizsgálni, érint-e más funkciót.
- **Később kell:** a teljes termékcél része marad, függőségekkel és fázissal.
- **Nem megvalósítható közvetlenül:** adapter, exportos alternatíva vagy korlátozás dokumentálása szükséges.
- A menü nem azonos a fázissal: egy későbbi fázis funkciója már most is szerepelhet a végleges menütérképen.



---

## 53. Külső platformok összehasonlító elemzése és SANCI-döntések

**Cél:** a külső szolgáltatások ismert képességeiből követelményeket vezetünk le. Ez funkcionális benchmark, nem teljes körű jogi, biztonsági vagy API-audit, és nem állítja, hogy bármely felsorolt képesség már megvalósult a SANCI rendszerben.

### 53.1. Weboldalépítők: Webflow, Framer, Elementor

**Megfigyelt minták**
- Vizuális canvas, drag-and-drop, elem-/widget-könyvtár, rétegek/navigátor és kontextusfüggő tulajdonságok.
- Újrahasználható komponensek, globális stílusok/tokens, sablonok, dinamikus CMS-gyűjtemények és mezőkapcsolatok.
- Reszponzív breakpointok, előnézet, draft/staging és külön publikálás.
- Lokalizált tartalom, képek/alt szövegek, locale-specifikus SEO és közösségi metaadatok.
- AI-segítség a létrehozásban, de a szerkesztőnek továbbra is átlátható, kézzel javítható struktúrát kell adnia.

**SANCI-követelmény**
- Valódi Visual Editor: Element Library + Canvas + Layers/Outline + Inspector + breakpoint-váltó + preview.
- Egy Property Registry és egy Page Model; nincs párhuzamos régi szerkesztő.
- Külön fogalom legyen a site template, page template, section template, reusable component, symbol/instance és design token.
- A globális változtatás előtt mutassuk meg az érintett komponenseket; legyen diff és visszaállítás.
- A CMS/dinamikus blokkok kanonikus domainrekordokat jelenítsenek meg, ne másolják azokat a Page Modelbe.
- Lokalizáció locale-onkénti tartalom-, kép-, alt-text-, slug-, SEO- és Open Graph-értékekkel.

**Ne másoljuk át:** egy teljes külső builder belső architektúráját vagy annak licencelt komponenseit. A funkcionális mintát és a használhatósági elvet vesszük át.

### 53.2. OBS, Streamlabs, StreamElements és Stream Deck

**Megfigyelt minták**
- OBS scene/source vezérlés és állapot; WebSocket-alapú külső vezérlés.
- Browser source-ra épülő overlayek és widgetek; alert, event list, chat, célmérő, timer, címke és egyedi widget.
- Chatbot parancsok, változók, időzítők, spamvédelem, moderáció és interaktív modulok.
- Eseményfüggő alert-variánsok, hangeffektek, vizuális témák, hotkeyek és külső vezérlők.

**SANCI-követelmény**
- Külön OBS/Stream Tools modul; párosítás, kapcsolatdiagnosztika, scene/source állapot, csak támogatott vezérlési műveletek.
- Overlay Studio külön vászonnal, safe area-val, méret-/pozíciókezeléssel, browser-source URL-lel, előnézettel és verziózással.
- Widgetkönyvtár: alerts, event list, chat, goals, countdown/timer, now playing, sponsor panel, QR/link panel, poll, giveaway, viewer queue.
- Eseményszabályok: eseménytípus + feltétel + widget/akció + cooldown + teszt + napló.
- Chatbot: parancsok, aliasok, role/permission, változók, timer, spam/link filter, shoutout, FAQ, quote/counter és moderátori kontroll.
- Macro/shortcut/Stream Deck/MIDI/HTTP-webhook adapterek engedélyezett műveletlistával, dry-run-nal és visszajelzéssel.
- A weboldal ne állítsa, hogy közvetlenül irányít bármely OBS plugint. A dokumentált OBS WebSocket és browser source az alap; natív plugin vagy desktop companion külön projekt- és biztonsági döntés.

**Kritikus biztonsági döntés:** az OBS vezérlő ne legyen nyitott internetes végpont. A kapcsolatot hitelesíteni kell, a titkot védeni kell, veszélyes műveleteket pedig jogosultsághoz és explicit jóváhagyáshoz kell kötni.

### 53.3. Multistream és közös chat: Restream és hasonló szolgáltatások

**Megfigyelt minták**
- Több célplatform egy adásból, platformonkénti cím/leírás és célállapot.
- Egyesített chat és közös streamirányító felület.
- Analitika, felvétel/visszajátszás és tartalék stream, ha a szolgáltatás és a csomag támogatja.

**SANCI-követelmény**
- Platformonkénti capability-mátrix: streamelés, chat olvasás/írás, események, publikálás, analitika, jogosultság és limit.
- Multistream csak igazolt technikai útvonalon: külső szolgáltató adapterrel vagy későbbi, külön infrastruktúrával. A Cloudflare Worker önmagában nem videótranszkóder vagy RTMP-relay.
- Unified Chatban minden üzenethez forrásplatform, idő, author, moderációs státusz és küldési lehetőség jelölése.
- A válasz csak akkor küldhető ki, ha a platform és az engedélyezett scope támogatja; platformonkénti hibák és részleges siker látszódjanak.
- A tartalék stream/felvétel legyen opcionális, költség- és adatmegőrzési szabályokkal.

### 53.4. Tartalomgyártás: Descript és Canva

**Megfigyelt minták**
- Transcript-alapú videó-/hangvágás, automatikus átirat és felirat, zajcsökkentés, kiemelés- és klipjavaslat.
- Többrétegű timeline, sablonok, képarány-átalakítás, feliratstílusok, thumbnail/grafika és platformhoz igazított export.
- AI-műveletek természetes nyelvű instrukcióval, de visszavonható vagy ellenőrizhető eredménnyel.

**SANCI-követelmény**
- Tartalomkönyvtár és média-nyilvántartás; VOD/clip/Short/Reel/post/audio/podcast/campaign asset.
- Transcript, időbélyeg, speaker/fejezet, SRT/VTT, fordítás és kézzel javítható felirat.
- Highlight-kereső, amely időbélyeget, okot és forráseseményt ad; az AI-javaslat nem publikál automatikusan.
- Első vágóeszközök: trim, split, crop/reframe, képarány, felirat, hangszint, egyszerű átmenet, brand overlay, export preset.
- Komplex renderelésnél külön feldolgozó infrastruktúra/szolgáltató kell; a Worker nem hosszú videórenderelő.
- Minden generált fájlhoz forrás, licencek, generálási státusz, verzió és felhasználási jogok.

### 53.5. Monetizáció és közösség: Fourthwall, Patreon

**Megfigyelt minták**
- Többféle tagsági szint, havi/éves előfizetés, tagsági előnyök és exkluzív tartalom.
- Fizikai és digitális termékek, kuponok, promóciók, támogatás, termék- és tagsági analitika.
- Rajongói profilok, posztok, kommentek, pollok, csoportos chat/DM és Discord-szerepkapcsolás.

**SANCI-követelmény**
- Saját közösségi/fan fiók elkülönített jogosultsági és adatvédelmi határral.
- Termék-, rendelés-, payment-, entitlement- és tagság-domain külön; a vásárlás/tagság ad jogosultságot, nem a kliens által küldött állapot.
- Fizikai termék, digitális letöltés, bundle, kupon, támogatás, tagsági szint, exkluzív tartalom és Discord-role mapping.
- Fizetéshez külső, erre alkalmas szolgáltató és webhook-ellenőrzés kell; kártyaadatot a SANCI nem tárol.
- Refund, lemondás, sikertelen megújítás és chargeback következetesen frissítse a jogosultságot.
- Rajongói közösség nem válhat az Admin belső felületévé; külön publikus/member UI és moderációs felület szükséges.

### 53.6. Integrációs platformok: Zapier, Buffer és Hootsuite

**Megfigyelt minták**
- Trigger → feltétel → akció workflow, újrapróbálás, futási előzmény és külső webhook.
- Központi tartalomnaptár, csatornánként testreszabott poszt, időzítés, draft/approval és teljesítményadat.
- Közösségi említések/trendek figyelése és riportálás, ahol az API és a szolgáltatási hozzáférés ezt lehetővé teszi.

**SANCI-követelmény**
- Visual Workflow Builder: trigger, condition, action, branch, delay, approval, retry, timeout, dry-run, run log, disable és rollback/compensation ahol lehetséges.
- Triggerként csak hitelesített, deduplikált esemény; minden futás kapjon azonosítót.
- Tartalomnaptár csatornánkénti változattal, időzónával, preview-val, státuszokkal, jóváhagyással és sikertelen publikálás utáni újrapróbálással.
- A közvetlen publikálás szolgáltatónkénti képesség- és app-review-függő; ahol nincs engedély, export/kézi publikálási útvonal szükséges.
- Social listening és trendfigyelés csak jogszerű, ténylegesen elérhető API-adatból; ne ígérjünk teljes internetes megfigyelést.

### 53.7. Platform API-k: Twitch, YouTube, TikTok, Discord és Kick

**Kötelező szabály:** a szolgáltatónevek nem egyenértékű képességeket jelentenek. Minden adapterhez dokumentált capability-nyilvántartás szükséges, amely tartalmazza: olvasás, írás, publikálás, live/chat, analytics, webhook/event, engedély/scope, kvóta, review, region/account restrictions és fallback.

- **Twitch:** OAuth, EventSub, chat, live státusz, adásrend, elérhető videó/clip/analitika. Scope-minimalizálás, tokenvédelem és webhook-/WebSocket-kezelés szükséges.
- **YouTube:** csatorna, videó/playlist, live broadcast, feltöltés, metaadat és elérhető analitika. API-kvóta, OAuth, feltöltési állapot és projekt-ellenőrzési követelmények kezelendők.
- **TikTok:** profil és videó megjelenítése; Content Posting API külön engedélyezési és domain-/app-feltételekkel. A közvetlen publikálást és a draft-feltöltést külön képességként kell kezelni.
- **Discord:** OAuth, bot, guild/channel/role, webhook, események és tagság-jogosultság; minimális botjogosultság és szerveroldali ellenőrzés szükséges.
- **Kick:** csak a mindenkori hivatalos API és hozzáférési feltételek által igazolt funkciók. Hiányzó API-képességet nem szabad szimulálni.

### 53.8. Megkülönböztető SANCI-érték

A platform ereje nem az, hogy mindenből legyen egy gyengébb másolat. A közös munkafolyamat a lényeg:
1. Egy Brand Kit szolgálja a weboldalt, overlayt, thumbnailt, posztot és terméket.
2. Egy tartalomrekord kapcsolja össze a VOD-ot, klipet, publikálási tervet, fordításokat és analitikát.
3. Egy adásrend táplálja a weboldalt, Dashboardot, emlékeztetőt és tartalomtervezést.
4. Egy jogosultsági/entitlement domain kapcsolja össze a vásárlást, tagságot, exkluzív tartalmat és Discord-szerepet.
5. Az automatizáció és az AI ugyanazokat a hitelesített domainműveleteket hívja, mint a kézi Admin.
6. Minden külső adatnál látszik a forrás, frissesség, jogosultság és hiba.
7. Minden kockázatos AI-/automatizációs műveletnél van preview, diff, jóváhagyás és napló.

---

## 54. Teljes, felülvizsgálatra szánt SANCI9517 funkciókatalógus

**Szerepe:** teljes lefedettségi/review checklist, nem önálló modulhierarchia és nem külön, második kanonikus funkciólista. Minden tételét a szemantikai audit során hozzá kell rendelni a 49. fejezet megfelelő tulajdonosmoduljához és — ahol már kiosztott — a 24. fejezet stabil funkcióazonosítójához. Ha itt önállóan szerepel egy képesség, de a kanonikus modulban nincs megfelelője, azt hiányként kell kezelni és a tulajdonosmodul alatt rögzíteni; ha ugyanaz a képesség több helyen szerepel, a többi előfordulás ellenőrző hivatkozás, nem külön implementáció. Nem jelenti, hogy minden elem az első kiadásba kerül, vagy hogy már implementált. A fázis a megvalósítás sorrendjét szabja meg, nem töröl funkciót a végső célból.

### 54.1. Admin alapélmény és Dashboard
- [ ] Egységes Admin shell, oldalsáv, almenük, breadcrumbs, mobil navigáció.
- [ ] Áttekintő kártyák: weboldal, live, adásrend, kapcsolatok, tartalom, feladatok.
- [ ] Gyorsműveletek és legutóbbi aktivitás.
- [ ] Teendők, figyelmeztetések, hibák és elakadt folyamatok.
- [ ] Globális kereső, command palette, kedvencek, legutóbbi elemek.
- [ ] Kontextuális súgó, onboarding, üres állapotok és emberi nyelvű hibák.
- [ ] Értesítési központ, prioritások, digest és csendes időszak.
- [ ] Valós adatfrissesség, loading/empty/error/stale/partial állapot.

### 54.2. Saját weboldal és Visual Editor
- [ ] Oldal CRUD, hierarchia, slug, átnevezés, duplikálás, archiválás és törlés.
- [ ] Navigáció, dropdown/nested menü, footer, mobilmenü, belső/külső link.
- [ ] Egyetlen Visual Editor: elemkönyvtár, canvas, Layers/Outline, Inspector.
- [ ] Drag/drop, kijelölés, átrendezés, csoportosítás, duplicate, törlés, zoom/pan.
- [ ] Undo/redo, mentési állapot, konfliktusfeloldás, revision history és restore.
- [ ] Szöveg, heading, kép, videó/embed, gomb, link, ikon, lista, kártya, űrlap, divider, spacer, grid/flex/section/container.
- [ ] Dinamikus SANCI blokkok: live, következő stream, adásrend, játékprofil, videó/clip feed, social links, termék, tagság, támogatás és közösségi CTA.
- [ ] Desktop/tablet/mobile preview, breakpointonkénti override, öröklés és portrait/landscape.
- [ ] Globális design tokens: színek, fontok, tipográfia, spacing, border, radius, shadow, layout.
- [ ] Site/page/section/component sablonok, reusable komponensek, instance/override/detach, verziózás és rollback.
- [ ] Előnézet, draft, validálás, publikálás, visszavonás és publikált snapshot megőrzése.
- [ ] SEO: title, description, canonical, robots, Open Graph, social image, sitemap, robots.txt, structured data, redirect, 404.
- [ ] Domain/DNS/HTTPS státusz, favicon, brand assets, coming-soon/maintenance.
- [ ] Űrlapok, validáció, spamvédelem, adatkezelési hozzájárulás és beküldés-kezelés.
- [ ] Webes teljesítmény, képméretezés, lazy loading, cache és Core Web Vitals.

### 54.3. Brand Kit és Design Studio
- [ ] Logóvariánsok, színek, betűcsaládok, ikonstílus, vizuális szabályok.
- [ ] Overlay, thumbnail, intro/outro, watermark, social post, merch és email sablonok.
- [ ] Brand-safe színek/fontok és kontrasztellenőrzés.
- [ ] Globális és komponensszintű tokenek, theme-változatok és dark/light.
- [ ] SVG/PNG/WebP és megfelelő exportméretek.
- [ ] Licenc, forrás, tulajdonos, verzió és asset-használati helyek.
- [ ] Brand consistency ellenőrzés, AI-javaslat és kézi jóváhagyás.

### 54.4. Média- és erőforráskönyvtár
- [ ] Egy asset registry és asset ID, R2 bináris tárolással, D1 metaadattal.
- [ ] Képek, videók, hangok, ikonok, fontok, dokumentumok, thumbnailök és exportok.
- [ ] Egyenkénti/tömeges feltöltés, progress, cancel, retry és megszakadt feltöltés helyreállítása.
- [ ] MIME-/méretellenőrzés, feldolgozási státusz, preview/thumbnail és biztonsági ellenőrzés.
- [ ] Címke, keresés, gyűjtemény, alt text, licenc, forrás és crop/focal point.
- [ ] Használati helyek, függőségi figyelmeztetés és biztonságos archiválás/törlés.
- [ ] Metaadatmódosítások megjelenése minden hivatkozási helyen.

### 54.5. Kapcsolatok és integrációk
- [ ] Integrációs központ: Twitch, YouTube, TikTok, Discord, Kick és későbbi szolgáltatók.
- [ ] Connect/disconnect/reconnect, fiók-/csatornaválasztás, scope és lejárat.
- [ ] Tokenfrissítés, revoke, titkos tárolás, CSRF/state és site ownership.
- [ ] Capability/scope mátrix, API-kvóta, provider health és diagnosztika.
- [ ] Webhook aláírásellenőrzés, replay-védelem, deduplikáció, retry és dead-letter.
- [ ] Szinkronnapló, utolsó siker/hiba, kézi újraszinkron és konfliktusfeloldás.
- [ ] Későbbi email, naptár, fizetés, affiliate, CRM és cloud-storage adapterek.
- [ ] Nem támogatott funkció egyértelmű jelölése és alternatív folyamat.

### 54.6. Live, Stream Studio és adásrend
- [ ] Live/offline állapot és adatfrissesség platformonként.
- [ ] Cím, kategória/játék, kezdés, nézőszám és elérhető streammetrikák.
- [ ] Stream player/embed és offline fallback.
- [ ] Egyetlen adásrend-domain: események, ismétlődések, időzóna, ütközések.
- [ ] Draft/scheduled/confirmed/postponed/cancelled/completed állapot.
- [ ] Twitch/YouTube sync, irány/prioritás, konfliktuskezelés és szinkronelőzmény.
- [ ] Játékprofilok, kapcsolódó tartalom, publikus naptár, countdown és későbbi iCal.
- [ ] Stream előtti checklist, technikai próba, jegyzetek, markerek és highlight-pontok.
- [ ] Multistream célok és platformonkénti metadata csak igazolt capability szerint.
- [ ] Unified Chat, platformjelölés, moderációs státusz, küldési engedély és részleges hiba.
- [ ] Felvétel/backup/replay csak tényleges technikai lehetőség és tisztázott tárolási költség mellett.

### 54.7. OBS, overlayek, chatbot és stream-eszközök
- [ ] OBS-párosítás, hitelesítés, kapcsolatstátusz, reconnect és diagnosztika.
- [ ] Scene/source lista, állapot, scene-váltás, visibility, audio mute/volume a támogatott műveletek szerint.
- [ ] Overlay Studio, browser source, canvas, safe area, méret, pozíció, scene-variáns.
- [ ] Alert box és eseményvariánsok follow/sub/gift/cheer/raid/tip/purchase eseményekre, ha elérhetők.
- [ ] Event list, chat box, goal/progress, countdown/timer, now-playing, sponsor/QR/link widget.
- [ ] Poll, giveaway, loyalty/points, viewer queue és media request csak jogosultsággal és szabályokkal.
- [ ] Widgetteszt, preview, verziózás, rollback és megosztható overlay URL.
- [ ] Chatbot parancsok, aliasok, változók, timerek, quote/counter, shoutout és FAQ.
- [ ] Spam/linkvédelem, slow/follower/sub-only policy ahol a platform engedi, moderációs napló.
- [ ] Hotkey, Stream Deck/Macro Deck/MIDI/webhook adapter, allowlist, dry-run és végrehajtási eredmény.
- [ ] Plugin/widget registry, verzió, kompatibilitás, permission, eredet, frissítés és eltávolítás.
- [ ] Natív OBS plugin vagy desktop companion csak külön, dokumentált biztonsági tervvel.

### 54.8. Tartalomkönyvtár és Content Studio
- [ ] VOD, clip, highlight, long-form, Short/Reel, post, image, audio, podcast és replay.
- [ ] Közös content ID, platform ID, cím, leírás, thumbnail, időtartam, URL, státusz és jogadat.
- [ ] Keresés, szűrés, rendezés, bulk action, duplikáció-észlelés és gyűjtemények.
- [ ] Tartalomnaptár és státuszfolyam: idea/draft/review/ready/scheduled/publishing/published/failed.
- [ ] Transcript, időbélyeg, speaker/fejezet, felirat, SRT/VTT, fordítás és export.
- [ ] AI highlight/clip-javaslat forrás-időbélyeggel, indoklással és emberi választással.
- [ ] Videóvágás: trim/split/crop/reframe/aspect ratio, felirat, hang, átmenet és brand overlay.
- [ ] Thumbnail/grafika-sablon, variánsok, platformméretek és preview.
- [ ] Platformonkénti cím, leírás, hashtag, CTA, képarány és publikálási státusz.
- [ ] API-publikálás ahol engedélyezett; egyébként export és kézi közzétételi útmutató.
- [ ] Zene-/videójog, vendéghozzájárulás, lejárat, forrás és eltávolítási kérés.
- [ ] Tartalomból weboldali feed, social poszt és analitika ugyanazon canonical rekord alapján.

### 54.9. Közösség és rajongói fiókok
- [ ] Publikus fan regisztráció/bejelentkezés, profil, preferencia, adatletöltés/törlés.
- [ ] Posztok, kommentek, reakciók, pollok, kérdések, beküldések és események.
- [ ] Követés, értesítés, jelvény, mérföldkő, kihívás és közösségi jutalom.
- [ ] Tagsági szintek, exkluzív poszt/video/audio, member-only stream és archívum.
- [ ] Discord szerver/csatorna/role mapping entitlement alapján.
- [ ] Moderációs queue, report, appeal, korlátozás/tiltás, spamvédelem és audit.
- [ ] AI moderációs javaslat, bizonytalanság és emberi felülvizsgálat.
- [ ] Public/member-only/private hozzáférés szerveroldali ellenőrzése.
- [ ] Közösségi szabályzat, adatvédelmi és korhatár-/tartalmi szabályok.

### 54.10. Bolt, támogatás és bevétel
- [ ] Fizikai termék, merch, digitális termék, bundle, limited drop és preorder.
- [ ] Variánsok, SKU, ár/pénznem, készlet, kategória, kollekció, media és SEO.
- [ ] Terméklista, termékoldal, keresés, kosár, checkout-integráció és rendelés-visszaigazolás.
- [ ] Rendelésállapot, fizetés, teljesítés, tracking, cancel, refund és support.
- [ ] Kupon, ajándékkártya, promóció, kampány, bundle és lejárat.
- [ ] Biztonságos digitális delivery, entitlement és visszavonás refund/chargeback esetén.
- [ ] Egyszeri támogatás, visszatérő támogatás, célmérő és köszönőüzenet.
- [ ] Tagsági előnyök, kedvezmények, termékdrop és tagság–Discord összekapcsolás.
- [ ] Szponzorációs media kit, ajánlat, deliverable, határidő, kampánylink és riport.
- [ ] Affiliate link/kód, jutalék és konverzió csak mérhető/jogszerű keretben.
- [ ] Bevételi források, platformdíjak, refundok és export; nem könyvelési/adótanácsadási helyettesítő.
- [ ] Fizetési, adózási, számlázási, fogyasztóvédelmi és GDPR-követelmények ellenőrzése.

### 54.11. Analitika és növekedés
- [ ] Platformonkénti követő-/nézettség-/engagement-/streamidő-mutatók, ha elérhetők.
- [ ] Tartalom- és csatorna-összehasonlítás, trendek, időszakok és célok.
- [ ] Adatforrás, időbélyeg, frissesség, becsült/valós adat és hiányzó metrika jelzése.
- [ ] Webanalitika, UTM, konverzió, SEO és publikált oldalak teljesítménye.
- [ ] Thumbnail/cím/időzítés kísérletek és mérhető eredmények, ha elég adat áll rendelkezésre.
- [ ] Kampány-/szponzorriport, CSV/JSON export és időszakos jelentés.
- [ ] AI-elemzés hipotézisekkel, forrással és bizonytalansággal; nem garantált növekedési ígéret.

### 54.12. Automatizációk és workflow-k
- [ ] Vizuális trigger → condition → action → branch modell.
- [ ] Triggerek: stream, platformesemény, schedule, tartalom, rendelés, tagság, webhook, időzítés.
- [ ] Akciók: értesítés, draft, címke, export, overlay/OBS parancs, publikálási előkészítés.
- [ ] Sablonok, verziózás, aktiválás/leállítás és jogosultság.
- [ ] Dry-run, preview, jóváhagyás, idempotency, rate limit, retry, timeout és napló.
- [ ] Sikertelen ág, karantén, értesítés, kézi helyreállítás és rollback/kompenzáció.
- [ ] AI-ból létrehozott workflow először draft/szimuláció; csak jóváhagyás után éles.

### 54.13. SANCI AI és multimodális asszisztensek
- [ ] AI Control Center: provider/model, költségkeret, kvóta, retention, adatforrás és stop switch.
- [ ] Projekt-/brandkontextus jogosultsággal és megtekinthető forrásokkal.
- [ ] Website Designer: oldal/komponens/dizájn/responsive/SEO/accessibility javaslat.
- [ ] Live Coach: opt-in technikai jelzések, pillanatjelölés és stream-/chat-összegzés.
- [ ] Content Producer: transcript, clip, felirat, fordítás, thumbnail, cím és platformvariáns.
- [ ] Community Assistant: FAQ, összegzés, moderációs javaslat és tagsági művelet-előkészítés.
- [ ] Business Analyst: tartalom/kampány elemzés, hipotézis, mérhető teszt.
- [ ] Automation Builder: természetes nyelvből workflow-draft, szimuláció és diff.
- [ ] Kép-/grafika-/hang-/videógenerálás megfelelő külső modellel/szolgáltatóval, licenc- és költségkorláttal.
- [ ] AI-művelet domain API-n át; kockázati szint, preview, jóváhagyás, napló és visszaállítás.
- [ ] Generált tartalom jelölése, forrás és bizonytalanság, felhasználói visszajelzés.
- [ ] Manuális, AI nélküli út minden alapvető termékfolyamathoz.

### 54.14. Többnyelvűség és nemzetközi használat
- [ ] Admin és publikus web külön nyelvi beállítással.
- [ ] Magyar elsődleges nyelv, további nyelvek fokozatos bevezetése.
- [ ] Locale-onkénti oldal-/CMS-tartalom, menü, média, alt text, SEO és Open Graph.
- [ ] Lokalizált slug/URL, hreflang/canonical szabályok és nyelvi fallback.
- [ ] Dátum/idő/pénznem/szám lokalizáció, időzóna és nyári időszámítás.
- [ ] RTL layout, billentyűzet, font fallback és hosszabb fordítások tesztje.
- [ ] Fordítási memória/szószedet és AI-fordítás emberi jóváhagyással.
- [ ] Nyelvváltó, automatikus nyelvajánlás és felhasználói választás megőrzése.

### 54.15. Beállítások, biztonság, adatvédelem és megbízhatóság
- [ ] Profil, site/workspace, locale, timezone, dátum/pénznem és preferenciák.
- [ ] Szerepek: owner/admin/editor/moderator/analyst/commerce és modulonkénti engedély.
- [ ] Szerveroldali authorization, site/tenant izoláció és minimális jogosultság.
- [ ] Session, 2FA/SSO később, secret rotation, rate limit és gyanús aktivitás.
- [ ] Titok/token/payment adat redakció; titkosított token storage.
- [ ] Consent, cookie/privacy, retention, export/delete és adatfeldolgozók.
- [ ] Backup, restore próba, verziózott mentés, import/export és disaster recovery.
- [ ] Health, job queue, webhook, API-quota, error log és audit log.
- [ ] Idempotencia, retry, timeout, cache invalidation, stale-data és partial-failure kezelés.
- [ ] Undo/redo, revision diff, restore és törlés előtti függőségi vizsgálat.
- [ ] WCAG 2.2 AA cél, reduced motion, screen reader, kontraszt, fókusz és touch target.
- [ ] Mobil/tablet/desktop, gyenge hálózat, offline-jelzés és adatvesztés elleni védelem.
- [ ] Tesztek: domain, integration, authorization, migration, UI, accessibility, responsive, E2E és smoke.

### 54.16. Fejlesztői platform, bővítmények, csapat és SaaS
- [ ] Dokumentált API, webhook registry, API-key kezelés, tesztelő és sandbox.
- [ ] Extension/widget/overlay manifest, schema, permission, verzió és kompatibilitás.
- [ ] Eredet/licenc/aláírás, sandbox, felülvizsgálat, frissítés, eltávolítás és visszavonás.
- [ ] Template/component/overlay/workflow marketplace későbbi fázisban.
- [ ] Több site/workspace, aktív workspace választó, csapatmeghívás és szerepek.
- [ ] Agency/studio mód, ügyfélhozzáférés, közös sablonok és jóváhagyás.
- [ ] Későbbi SaaS billing, csomag, használati limit, számla, lemondás és adat-export.
- [ ] Tenant izoláció, migráció, skálázás, adatrezidencia és költségfelügyelet.

---

## 55. A teljes funkciólista értékelési szabályai

A felhasználói áttekintéskor minden egyes funkciót az alábbi döntések egyikével kell ellátni:
- **Kell az első használható kiadásba:** szükséges a teljes alapmunkafolyamathoz.
- **Kell, de későbbi fázisban:** a végső termék része, de függősége van.
- **Opcionális/integrációfüggő:** szolgáltatói API, hozzáférés, költség vagy technikai lehetőség határozza meg.
- **Nem kell:** csak explicit döntés után távolítható el a végső célból.
- **Másik modulba tartozik:** a felelősség szerinti egyetlen modulhoz kerül, a többi hely hivatkozik rá.

A megvalósítás sorrendjét a meglévő, működő kód, a felhasználói élmény, a biztonság és a függőségek alapján kell meghatározni. Minden képességhez később hozzá kell rendelni: canonical domain, adatmodell, API/command, jogosultság, UI-hely, külső függőség, teszt, státusz és elfogadási feltétel. A funkcióterv nem helyettesíti a kód és az éles működés igazolását.


---

## 56. Közös sablon-, ikon-, preset- és teljes személyre szabási rendszer

**Alapelv:** a SANCI9517-et a készítője saját brandjével is használhassa, de egy új felhasználó is teljesen a sajátjává alakíthassa. Ne legyen kötelező SANCI-logó, színvilág, előre eldöntött elrendezés vagy egyetlen munkamód. A közös infrastruktúra egységes; a felhasználó által látott megjelenés és a választható munkafolyamat testreszabható.

### 56.1. Közös design system és témarendszer
- [ ] Központi design tokenek: színek, fontok, tipográfiai skála, térközök, rácsok, szélességek, border, radius, shadow, elevation, animáció és fókuszstílus.
- [ ] Több theme-változat: világos, sötét, automatikus rendszerkövető, nagy kontrasztú és felhasználó által létrehozott témák.
- [ ] Teljes theme editor: színpaletta, háttér, felület, szöveg, állapotok, linkek, gombok, mezők, grafikonok és overlay-színek szerkesztése.
- [ ] Témaváltozatok mentése, duplikálása, átnevezése, exportja/importja, előnézete és visszaállítása.
- [ ] Token-szintű öröklés: alap-téma → workspace/site téma → oldal/komponens override; feloldás/override-törlés egyértelmű művelettel.
- [ ] Kontraszt- és olvashatósági ellenőrzés; hibás kombinációra javaslat, de ne írja felül csendben a felhasználó döntését.
- [ ] Fontfeltöltés és fontlicenc nyilvántartás; biztonságos formátum- és fájlméret-ellenőrzés.
- [ ] A téma a weboldalon, Adminban, overlayeken, widgeteken, tartalomsablonokon és későbbi storefronton ott alkalmazható, ahol értelmes; külön felületek külön theme scope-ot kaphatnak.
- [ ] Téma importálásakor verzió-/kompatibilitásellenőrzés, ismeretlen tokenek kezelése és ütközés előnézete.

### 56.2. Saját márka és white-label használat
- [ ] Első indítási Brand Setup Wizard: márkanév, creator-/cégnév, rövid leírás, logó, favicon, profilkép, borítókép, fő színek, fontok, nyelv és időzóna.
- [ ] Saját logó feltöltése több változattal: teljes logó, ikon/jel, világos/sötét háttérhez való variáns, monokróm, favicon és social avatar.
- [ ] Saját domain és aldomain; DNS/HTTPS ellenőrzés és domainenkénti site beállítás, ahol a hosting modell támogatja.
- [ ] Saját márkanevek, szövegek, linkek, közösségi fiókok, CTA-k, footer, email-sablonok és megosztási kép.
- [ ] SANCI-brand megjelenítése konfigurálható legyen ott, ahol technikailag/jogilag eltávolítható; platformos biztonsági, jogi és szolgáltatói jelzéseket nem lehet megtévesztő módon elrejteni.
- [ ] Saját favikon, böngészőcím, metaadat, OG-kép, loading/empty/error állapotok és felhasználói értesítések brandelése.
- [ ] Brand Kit export/import és teljes brand preset, amely a témát, logókat, fontokat, ikonstílust és használati szabályokat együtt viheti át.
- [ ] Több márka/site egy workspace-ben későbbi fázisban, külön brand- és domainhatárokkal.
- [ ] Új felhasználónak semmit nem kell kézzel nulláról építenie: választhat sablont/presetet, majd minden elem módosítható.

### 56.3. Közös ikonrendszer
- [ ] Egyetlen kanonikus Icon Registry és Icon Picker az egész termékben.
- [ ] Kategóriák: navigáció, szerkesztés, média, streaming, platformok, közösség, bevétel, analitika, AI, állapotok, műveletek és akadálymentesség.
- [ ] Egységes ikonméret-, stroke-, kitöltés- és igazítási szabályok; opcionális outline/solid/duotone stílusok, ha az ikonforrás licenc és vizuális minőség szerint támogatja.
- [ ] Keresés név, kulcsszó, kategória és szinonima alapján; billentyűzetes navigáció és akadálymentes címkék.
- [ ] Saját SVG ikon importálása ellenőrzött SVG-szabályokkal; ne engedjünk futtatható/veszélyes SVG-tartalmat.
- [ ] Egyedi ikonok elnevezése, címkézése, cseréje, archiválása, exportja és workspace/site scope-ja.
- [ ] Az ikon választása minden támogatott helyen ugyanazt az Icon Picker komponenst használja: Admin, Visual Editor, gombok, menük, overlayek és widgetek.
- [ ] Ikonfallback és migráció, ha egy régi preset ikonja megszűnik; ne jelenjen meg üres/hibás jelölő.
- [ ] Ikon használati helyeinek keresése és biztonságos cseréje.

### 56.4. Közös sablonrendszer
- [ ] Egy Template Registry, stabil azonosítóval, verzióval, kompatibilitással, kategóriával, címkékkel, előnézeti képpel és licenc/eredet mezővel.
- [ ] Sablontípusok: teljes weboldal, oldal, szekció, komponens, navigáció, dashboard layout, stream overlay, widget, alert, chatbot parancscsomag, workflow, content post, thumbnail, video preset, email, termékoldal, közösségi oldal és Brand Kit.
- [ ] Sablon használat előtti preview és kipróbálás; ne írja felül a meglévő adatokat előzetes diff/figyelmeztetés nélkül.
- [ ] Sablon létrehozása meglévő felhasználói tartalomból, megosztás, duplikálás, átnevezés, export/import, archiválás és verziózás.
- [ ] Sablonfrissítési stratégia: eredeti követése, helyi másolat, kiválasztott módosítások átvétele; ne vesszen el a személyre szabás.
- [ ] Sablonok jelölése: hivatalos, közösségi, saját, importált, ellenőrzött, kompatibilitási problémás.
- [ ] Külső sablonhoz licenc, attribúció és felhasználási feltételek tárolása; más termék sablonjának/assetjének jogosulatlan másolása tilos.
- [ ] Keresés és szűrés cél, stílus, platform, nyelv, képarány, kategória, kompatibilitás és akadálymentesség szerint.
- [ ] Marketplace később; elsőként lokális/saját sablonkönyvtár és biztonságos import/export.

### 56.5. Preset rendszer – ne legyen összekeverve a sablonnal
- [ ] **Preset:** egy adott funkció gyors konfigurációja, pl. overlay méret/színek/animáció, export beállítás, editor layout, chatbot válaszkészlet vagy workflow-induló beállítás.
- [ ] **Template:** teljesebb kiinduló szerkezet/tartalom, amelyet a felhasználó tovább alakít.
- [ ] **Theme:** a vizuális megjelenés tokenjeinek és szabályainak csomagja.
- [ ] **Brand Kit:** a márkaelemek, logók, fontok, assetek és használati szabályok csomagja.
- [ ] **Component:** újrahasználható működő UI-/oldalelem; **icon** egy vizuális jel; **workflow** végrehajtható lépésekből álló folyamat.
- [ ] Preset mentése aktuális beállításból, alkalmazás, duplikálás, diff, visszaállítás, import/export és kompatibilitási jelölés.
- [ ] Preset-könyvtár kategóriánként: Visual Editor, responsive, overlay, alerts, chatbot, streaming, content export, subtitle, thumbnail, analytics, automation, AI, accessibility és performance.
- [ ] Preset paraméterezhető változókkal és validációval; a felhasználó alkalmazás előtt látja, mit fog módosítani.
- [ ] Preset nem tartalmazhat éles titkot, access tokent, privát URL-t vagy más workspace személyes adatát.
- [ ] Preset verzióváltásakor megmaradjon a korábban alkalmazott beállítás; legyen migráció vagy kézi javítási út.

### 56.6. Teljes személyre szabás – a platform legyen mindenkié
- [ ] Modulok és navigáció személyre szabása: sorrend, kedvencek, elrejtés/megmutatás és szerepkör szerinti láthatóság; kritikus biztonsági menük jogosultság alapján maradnak védettek.
- [ ] Dashboard widgetek hozzáadása/eltávolítása/átrendezése, mentett nézetek és több dashboard preset.
- [ ] Szerkesztői layout: panelek mérete, elhelyezése, dock/undock ahol támogatott, billentyűparancsok és compact/comfortable sűrűség.
- [ ] Oldal- és komponensszintű vizuális override-ok, öröklés és „visszaállítás a témára”.
- [ ] Saját gyorsműveletek, kedvencek, parancspaletta és workflow-indítók.
- [ ] Felhasználói preferenciák és workspace/site alapértelmezések külön kezelése.
- [ ] Minden felhasználói override megőrzése frissítéskor; frissítés nem nullázhatja le csendben a beállításokat.
- [ ] Kezdő/haladó mód: az alapélmény ne legyen túlzsúfolt, de a fejlett funkciók ne vesszenek el.
- [ ] Visszafordítható beállítások, élő preview, visszaállítás, exportálható profil és könnyű „reset to defaults”.
- [ ] Mobilon a fontos beállítások kezelhetők legyenek; az összetett szerkesztő reszponzív kezelőfelületet vagy célzott mobilmódot kapjon.

### 56.7. Onboarding és kezdőélmény
- [ ] Célválasztó: streamer, videókészítő, podcaster, közösségépítő, zenész, oktató, kisvállalkozás/brand vagy vegyes használat.
- [ ] A választás csak kezdőajánlásokat módosít; semmilyen funkciót nem töröl a rendszerből.
- [ ] Induló csomag: brand preset + weboldalsablon + dashboard layout + releváns integrációk + ajánlott workflow-k.
- [ ] Importálható saját brand/logó/szín és meglévő tartalom; később platformimport, ahol API engedi.
- [ ] Lépésenkénti ellenőrzőlista, haladásmentés, kihagyás és későbbi folytatás.
- [ ] Demóadatok és safe preview egyértelmű jelöléssel; demó soha ne keveredjen éles adatokkal.
- [ ] Kezdő mód mellett „haladó eszközök megjelenítése” lehetőség.
- [ ] Segítség és dokumentáció kontextushoz kötve; ne csak egy hosszú, egyszeri útmutató legyen.

### 56.8. Megosztás, import/export és biztonság
- [ ] Brand Kit, theme, icon pack, template, preset, editor layout és workflow export/import.
- [ ] Verzió, schema, kompatibilitás, dependency és licencek az exportcsomagban.
- [ ] Import előnézet: létrejövő/módosuló elemek, ütközések, hiányzó assetek és ismeretlen mezők.
- [ ] Import előtt validáció és méretkorlát; sikertelen import ne hagyjon félkész adatot.
- [ ] Megosztáskor a titkok, személyes adatok és privát tartalmak alapértelmezésben kimaradnak.
- [ ] Nyilvános megosztási link visszavonható; jogosultság, lejárat és hozzáférési napló opcionális.
- [ ] Harmadik féltől importált sablon/ikon/widget csak biztonsági, licenc- és kompatibilitási ellenőrzés után aktiválható.

### 56.9. Elfogadási kritériumok
A rendszer akkor tekinthető megfelelően személyre szabhatónak, ha:
1. Új felhasználó választhat teljes induló presetet, majd minden nem biztonságkritikus elemet módosíthat.
2. Saját logót, színeket, fontokat, témát, ikonkészletet és domaint tud beállítani az adott hosting-/csomagképességek szerint.
3. Ugyanaz a téma/brand konzisztensen használható a támogatott webes, szerkesztői és streames felületeken.
4. A sablonok, ikonok és presetek központi regiszterből, verzióval és kompatibilitással működnek.
5. Egy preset vagy sablon alkalmazása előtt látszik a változás, és van helyreállítás.
6. Frissítés nem írja felül csendben a felhasználó saját beállításait.
7. A kezdő egyszerű élményt kap, a haladó felhasználó pedig eléri a mély testreszabást.
8. Az export/import licencet, biztonságot és személyes adatokat figyelembe véve működik.


---

## 57. Személyre szabhatósági architektúra: közös rendszer, saját identitás

Ez a fejezet a 56. fejezet szabályait pontosítja. A személyre szabás nem különálló, egymástól független beállítások gyűjteménye, hanem közös, verziózott és rétegezett konfigurációs rendszer.

### 57.1. Kanonikus erőforrás-típusok és határok
- [ ] **Design tokens/theme:** vizuális alapértékek és téma-variánsok.
- [ ] **Brand Kit:** logó, márkanév, színek, betűk, márkaeszközök és használati szabályok.
- [ ] **Icon Registry/Icon Pack:** ikonazonosítók, kategóriák, keresési címkék, stílusok és licenc.
- [ ] **Component Registry:** működő, újrahasználható UI-/Visual Editor komponensek, sémák, variánsok és instance properties.
- [ ] **Template Registry:** oldalak, szekciók, widget-összeállítások, dashboardok, overlayek, posztok és más tartalmi kiinduló struktúrák.
- [ ] **Preset Registry:** egy funkció beállításcsomagja, például export, overlay, chatbot, workflow vagy editor layout.
- [ ] **Workspace/User Preferences:** személyes munkafelület és preferenciák; nem módosítják automatikusan más felhasználók nézetét.
- [ ] **Site Configuration:** egy adott webhely domainje, publikus arculata, nyelvei és publikálási beállításai.
- [ ] **Extension Registry:** külső bővítmény manifestje, engedélyei, verziója, eredete és kompatibilitása.
- [ ] Az erőforrások stabil ID-t, owner/scope mezőt, verziót, sémát, létrehozási/frissítési adatot és életciklus-státuszt kapnak; a megjelenített név nem azonosító.

### 57.2. Hatókör és öröklési sorrend
- [ ] Legyen egy dokumentált konfigurációs feloldási sorrend, például: rendszer alapértéke → hivatalos preset/theme → workspace/site konfiguráció → oldal/komponens override → személyes UI-preferencia ott, ahol releváns.
- [ ] Az öröklés típusonként szabályozott legyen: a személyes Admin-sűrűség ne írja felül a publikus weboldal témáját; egy site logója ne változtassa meg egy másik site arculatát.
- [ ] Minden beállításnál látszódjon, hogy örökölt, helyileg beállított vagy felülírt érték-e.
- [ ] Legyen egy kattintásos „visszaállítás az örökölt értékre” és „visszaállítás alapértékre”, egyértelmű különbséggel.
- [ ] Több site/workspace esetén minden erőforrás a megfelelő scope-hoz kötődjön; a másik site adata nem szivároghat át.

### 57.3. Sablonfrissítés és felhasználói változtatások megőrzése
- [ ] A sablon/preset alkalmazása hozzon létre változás-előnézetet: új, módosított, eltávolított és ütköző elemek.
- [ ] A felhasználói változtatás és a sablon eredeti értéke külön követhető legyen.
- [ ] Frissítéskor legyen „minden elfogadása”, „kiválasztott módosítások”, „kihagyás” és konfliktusonkénti feloldás, ahol a struktúra ezt lehetővé teszi.
- [ ] Ha automatikus merge nem biztonságos, ne találgasson a rendszer: álljon meg, őrizze meg a meglévő állapotot és kérjen döntést.
- [ ] Törlés vagy schema-váltás előtt függőségi vizsgálat és mentés szükséges.
- [ ] A verzióváltás visszafordítható, naplózott és tesztelhető legyen.

### 57.4. Központi kereső és választó
- [ ] Egy egységes keresési élményben legyenek elérhetők a sablonok, presetek, ikonok, komponensek, témák és Brand Kitek, megfelelő szűrőkkel.
- [ ] Az adott szerkesztési kontextus csak releváns elemeket emeljen ki, de a teljes könyvtár kereshető maradjon.
- [ ] Minden elemhez előnézet, leírás, szerző/eredet, verzió, kompatibilitás, licenc és használati hely tartozzon.
- [ ] Legyen „saját”, „workspace”, „hivatalos” és később „közösségi/marketplace” könyvtár.
- [ ] A könyvtár ne terhelje túl az alapfelületet: kezdő nézetben ajánlott elemek, haladó nézetben részletes metaadatok és paraméterek.

### 57.5. Saját arculat és platformfüggetlen identitás
- [ ] A felhasználó ne legyen rákényszerítve a SANCI márkanévre a saját publikus weboldalán, overlayein, közösségi tartalmain vagy saját exportjain ott, ahol a termékfeltételek ezt megengedik.
- [ ] A SANCI saját belső Admin- és rendszerfelületei, valamint a felhasználó publikus brandje külön konfigurációs scope-ot kapnak.
- [ ] Legyen saját logó-/favicon-/social-avatar készlet, betűk, színpaletta, háttér, mozgásstílus, ikonstílus, gombstílus és hangulatpreset.
- [ ] A rendszernek legyen semleges, minimális márkájú induló megjelenése, amit a felhasználó saját márkájára alakíthat.
- [ ] White-label csak a technikai és üzleti feltételek szerint ígérhető; a szolgáltatói/jogi/security jelölések és harmadik fél kötelező attribúciói nem rejthetők el megtévesztően.

### 57.6. Egyediség a funkciókban, nem csak a színekben
- [ ] A felhasználó választhasson különböző navigációs modellek, oldalelrendezések, widget-kombinációk, tartalmi struktúrák és munkafolyamatok közül.
- [ ] A komponensek ne csak színezhetők legyenek: legyenek szerkeszthető tulajdonságaik, variánsaik, slotjaik és adatkapcsolataik.
- [ ] Legyen „gyors személyre szabás” (logó, színek, font, sablon) és „teljes testreszabás” (komponens-, layout-, adatmegjelenítési és workflow-beállítások).
- [ ] Egyedi CSS/JS vagy külső kód csak későbbi, explicit engedélyezési/sandbox terv mellett; ne kerülje meg a jogosultságokat, CSP-t vagy biztonsági határokat.
- [ ] A teljes személyre szabhatóság nem jelentheti a szerveroldali auth, adatvalidáció, audit, fizetési szabályok vagy adatvédelmi korlátok kikapcsolását.

### 57.7. Validáció és elfogadási tesztek
- [ ] Egy új felhasználó induló sablonból saját logós, saját témájú weboldalt és stream-asseteket tud készíteni anélkül, hogy a rendszer kódját módosítaná.
- [ ] A téma vagy Brand Kit változtatása minden hozzárendelt, támogatott helyen következetesen jelenik meg.
- [ ] A felhasználó által felülírt értékek egy hivatalos sablonfrissítés után megmaradnak.
- [ ] Egy site témájának/logójának módosítása nem érint más site-ot vagy másik felhasználót.
- [ ] Egy importált csomag nem tud titkot/hozzáférési tokent exportálni vagy szerveroldali jogosultságot megváltoztatni.
- [ ] Ismeretlen/hibás ikon vagy komponens helyén értelmes fallback és javítási lehetőség látszik.
- [ ] A teljes könyvtár billentyűzettel, képernyőolvasóval és mobil nézetben is használható a támogatott feladatokhoz.


---

## 58. Biztonság, adatvédelem és jogosultságok alapból

A személyre szabhatóság nem gyengítheti a biztonsági határokat; a platform személyes adatokat, médiát, integrációs tokeneket és később bevételi adatokat is kezelhet.

### 58.1. Identitás és hozzáférés
- [ ] Külön identitás és scope a felhasználói fióknak, workspace-nek, site-nak, publikus látogatónak és szolgáltatói adminnak.
- [ ] Indokolt szerepkörök: tulajdonos, admin, szerkesztő, tartalomkezelő, moderátor, elemző és csak olvasó; csak a szükséges szerepek kerüljenek az adott kiadásba.
- [ ] Szerveroldali jogosultság-ellenőrzés minden műveletnél és erőforrásnál; a rejtett UI-elem nem hozzáférés-védelem.
- [ ] Legkisebb szükséges jogosultság, visszavonható meghívók, lejáró megosztási linkek és biztonságos munkamenet-kezelés.
- [ ] Integrációs tokenek biztonságos tárolása, maszkolása, scope-korlátozása és visszavonása; titok nem kerülhet logba, exportba vagy kliensoldali payloadba.
- [ ] Külső szolgáltatói kapcsolat csak a jóváhagyott engedélyekhez adjon hozzáférést; egy integráció nem jelenthet általános hozzáférést a felhasználó minden adatához.

### 58.2. Audit és biztonsági események
- [ ] Naplózni kell a lényeges bejelentkezési, jogosultsági, integrációs, publikálási, exportálási, törlési és konfigurációs eseményeket.
- [ ] A napló rögzítse, ki, mikor, mely scope-ban, milyen műveletet végzett és mi lett az eredmény; titkokat és szükségtelen személyes adatot ne tároljon.
- [ ] Legyenek korrelálható hibajelzések, rate limit és visszaélésészlelési alapok.
- [ ] A hibaválasz ne fedjen fel belső stack trace-t, tokent, SQL-részletet vagy érzékeny rendszeradatot.
- [ ] A felhasználó számára érthető biztonsági események és aktív integrációk áttekintése legyen elérhető.

### 58.3. Feltöltés, import és bővítmények
- [ ] Fájloknál típus-, tartalom-, méret- és jogosultság-ellenőrzés; a fájlnév és MIME-header önmagában nem megbízható.
- [ ] Importcsomagok és külső bővítmények validálása, méretkorlát, függőségi ellenőrzés és hiba esetén atomikus visszagörgetés.
- [ ] Ismeretlen vagy aktív tartalom ne futhasson automatikusan; egyedi kód csak későbbi sandbox, explicit engedély és szűk képességek mellett.
- [ ] Minden publikus adat és felhasználói bemenet nem megbízható forrás; XSS, CSRF, jogosultság-megkerülés és adatok közötti szivárgás ellen tervezni és tesztelni kell.
- [ ] A biztonsági tesztek a többfelhasználós és több-site-os határokat is vizsgálják.

---

## 59. Megbízhatóság, mentés, visszaállítás és működtetés

A mentés nem tekinthető bizonyítottnak, amíg a visszaállítást nem teszteltük.

### 59.1. Adatok és helyreállítás
- [ ] Külön kezelendő a strukturált adat, a bináris média, a konfiguráció, a titok és a regenerálható gyorsítótár.
- [ ] Dokumentált mentési gyakoriság, megőrzési idő, felelős, valamint a valós képességekhez igazított RPO/RTO-cél.
- [ ] Visszaállítási próba külön környezetben és ellenőrzött adatintegritással; a „backup sikeres” üzenet önmagában nem elég.
- [ ] Felhasználói export és szolgáltatói katasztrófa-helyreállítás külön folyamat.
- [ ] Törlés előtt figyelmeztetés, függőségi áttekintés és ahol indokolt helyreállítási időablak; a jogi/adatvédelmi törlési kötelezettség ettől független.
- [ ] Migrációknál előzetes ellenőrzés, mentés és ahol lehetséges visszagörgetési terv szükséges.

### 59.2. Üzemeltetés és hibakezelés
- [ ] Egységes health/readiness ellenőrzések, strukturált hibák, korrelációs azonosítók és adatvédelmi szempontból biztonságos logolás.
- [ ] Követni kell a kritikus API-k hibaarányát, késleltetését, kvótáit, külső szolgáltatói hibáit és a tárhely-/feldolgozási fogyasztást.
- [ ] Érthető állapotok: mentve, mentés folyamatban, publikálva, szinkronizálás alatt, sikertelen és újrapróbálható.
- [ ] Kezelni kell a hálózati megszakítást, lejárt tokent, kvótakorlátot, duplikált webhookot, részleges importot és sikertelen publikálást.
- [ ] Idempotencia és deduplikáció szükséges ott, ahol az ismétlés dupla posztot, eseményt, fizetést vagy adatot okozhat.
- [ ] Kritikus rendszerekhez üzemeltetési runbook és incidenskezelési eljárás szükséges.

### 59.3. Teljesítmény és költség
- [ ] A publikus weboldal és a Creator Center teljesítménycéljai külön legyenek meghatározva.
- [ ] Médiaoptimalizálás, képméretek, lazy loading, cache-szabályok és mobil hálózat figyelembevétele.
- [ ] Külső API-, AI-, médiafeldolgozási és tárolási költségek mérhetők legyenek; költségkeret és figyelmeztetés nélkül ne induljon végtelen vagy meglepően drága automatizmus.
- [ ] Kvóták, háttérfeladat-sorok, újrapróbálási szabályok és túlterhelés esetén érthető, korlátozott működés.
- [ ] Minden teljesítmény- és költségállítást mérés igazoljon, ne feltételezés.

---

## 60. Hozzáférhetőség, mobilhasználat és lokalizáció

A vizuális szerkesztő és a személyre szabás akkor is használható maradjon, ha valaki billentyűzettel, képernyőolvasóval, nagyítással vagy kis kijelzőn dolgozik.

### 60.1. Hozzáférhetőség
- [ ] Cél a WCAG 2.2 AA követelményeinek figyelembevétele és ellenőrzése; megfelelőség nem állítható tesztelés nélkül.
- [ ] Billentyűzetes navigáció, látható fókusz, megfelelő kontraszt, szemantikus címsorok, címkézett vezérlők és érthető hibaüzenetek.
- [ ] Csökkentett mozgás preferencia; animációk és mozgó effektek kikapcsolása vagy mérséklése.
- [ ] A szín önmagában ne közvetítsen státuszt; ikonokhoz és nem szöveges vezérlőkhöz hozzáférhető név szükséges.
- [ ] Visual Editor: réteglista, fókuszkezelés, drag-and-drop alternatívák és billentyűzetes átrendezés.
- [ ] A publikus oldalakhoz hozzáférhetőségi ellenőrző és javítási javaslat; automatikus tökéletességet nem szabad ígérni.

### 60.2. Mobil és adaptív élmény
- [ ] A publikus weboldalak mobil-first és reszponzív módon készüljenek; különböző töréspontokon előnézet legyen.
- [ ] Az Admin és a Visual Editor összetett műveletei kapjanak célzott mobilkezelést; ne csak az asztali felület zsugorított változata legyen.
- [ ] Érintési célok, görgetés, modális ablakok és keskeny nézetek tesztelése.
- [ ] Lassú hálózat és kisebb teljesítményű eszköz esetén a legfontosabb feladatok maradjanak használhatók.

### 60.3. Nyelv, formátum és tartalom
- [ ] Magyar az elsődleges nyelv, de a felületi szövegek legyenek központilag fordíthatók, ne szétszórt kódliterálok.
- [ ] Külön kezelendő a felület nyelve, a publikus tartalom nyelve, a csatorna nyelve, a fordítás és az AI-kimenet nyelve.
- [ ] Dátum, időzóna, szám, pénznem, többes szám és időpont lokalizált legyen; az ütemezésben a helyi idő és UTC ne keveredjen.
- [ ] Fordítási hiány, fallback nyelv és fordítási státusz legyen felismerhető.
- [ ] Többnyelvű SEO (hreflang, canonical, metaadatok és oldalkapcsolatok) csak ellenőrzött konfigurációval publikálható.

---

## 61. Termékcsomagok, korlátok és későbbi többfelhasználós szolgáltatás

A hosszú távú cél lehet több alkotót kiszolgáló Creator Platform, de ezt fokozatosan, világos csomag- és adat-határokkal kell bevezetni.

### 61.1. Csomagok és funkciókorlátok
- [ ] A későbbi csomagokhoz mérhető korlátok tartozzanak: site-ok, tárhely, médiafeldolgozás, AI-használat, integrációk, csapattagok és automatizmusok.
- [ ] A funkcióelérhetőséget központi capability/entitlement réteg kezelje; ne legyen szétszórt, ellentmondásos csomagellenőrzés.
- [ ] A korlát elérésekor a felhasználó érthető tájékoztatást, fogyasztási adatot és szabályos alternatívát kapjon.
- [ ] Fizetős funkcióknál előre tervezendő a csomagváltás, lemondás, sikertelen fizetés, visszatérítés és adatmegőrzés.
- [ ] Ne kerüljön ki fizetési vagy előfizetési ígéret, amelyet a rendszer még nem tud megbízhatóan teljesíteni.

### 61.2. Workspace, csapat és szolgáltatói admin
- [ ] A személyes fiók, workspace, site, csapat és későbbi előfizetés kapcsolata explicit adatmodellben szerepeljen.
- [ ] A szolgáltatói admin ne kapjon automatikus, korlátlan betekintést a privát tartalmakba; a támogatási hozzáférés legyen indokolt, korlátozott és naplózott.
- [ ] Meghívás, szerepváltozás, tulajdonosváltás, kilépés, fióktörlés és workspace-megszüntetés külön folyamatot kapjon.
- [ ] Egy felhasználó több site-ja csak explicit megosztással használjon közös erőforrásokat.
- [ ] A több-bérlős (multi-tenant) modell előtt külön biztonsági és adatizolációs tesztek szükségesek.

### 61.3. Megvalósítási elv
- [ ] SaaS, piactér, csapatkezelés és fizetős csomagok a teljes célkép részei, de csak a függőségek, üzleti döntések és tesztek teljesülésekor aktiválhatók.
- [ ] Minden funkció kapjon állapotot, függőséget, hatókört és elfogadási feltételt; a „tervben szerepel” nem azonos a „kész” állapottal.
- [ ] Minden új funkció illeszkedjen a közös design-, adat-, jogosultság-, naplózási-, lokalizációs- és tesztelési alapokhoz.


---

## 62. Világszintű termékképességek és minőségi szerződés

Ez a fejezet a teljes termék hosszú távú, nemzetközi szintű képességeit egészíti ki. Nem külön terv és nem új, párhuzamos roadmap: a 54. fejezet funkciókatalógusát, az 50. fejezet keresztmodulú szabályait, valamint az 58–61. fejezet biztonsági, megbízhatósági, hozzáférhetőségi és platform-előfeltételeit egészíti ki. A képességek a függőségi sorrend szerint kerülnek megvalósításra; külső szolgáltatás, jog, költség vagy API-korlát miatt nem ígérhetünk nem igazolt funkciót.

### 62.1. Creator onboarding, tanulás és önkiszolgáló segítség

- [ ] Feladat-alapú első indítás: weboldal indítása, brand beállítása, integráció csatlakoztatása, első tartalom, első stream és publikálás.
- [ ] Opcionális lépésenkénti útmutatók, kipipálható checklisták, kihagyás és későbbi folytatás; a felhasználót nem kényszeríthetjük egyetlen merev onboarding-folyamatba.
- [ ] A felület az aktuális állapotból mutassa a következő hasznos lépést, de ne állítson késznek semmit pusztán azért, mert a checklistát kipipálták.
- [ ] Kontextuális súgó, fogalomtár, kereshető dokumentáció, rövid útmutatók, hibaelhárítás, billentyűparancsok és Visual Editor-tutorialok.
- [ ] Demo/tesztadatok elkülönített módban, egyértelmű megjelöléssel; a demoadatok nem kerülhetnek a valódi publikált oldalra vagy éles analitikába.
- [ ] Súgó és felhasználói visszajelzés nyelv szerint, képernyő-/műveletkontextussal, érzékeny adatok automatikus kitakarásával.
- [ ] A támogatási kérelemhez felhasználó által jóváhagyott diagnosztikai csomag készülhessen; titkok, tokenek, privát tartalom és szükségtelen személyes adatok nem kerülhetnek bele.

### 62.2. Munkafolyamatok, együttműködés és jóváhagyás

- [ ] Draft → review → approved → scheduled/published életciklus a tartalomhoz, oldalakhoz, kampányokhoz, sablonokhoz és automatizmusokhoz, ahol a modul ezt indokolja.
- [ ] Megjegyzések, feladatkiosztás, felelős, határidő, említés és döntési előzmény a későbbi csapatmódban; a személyes, egyfelhasználós működés emiatt nem válhat bonyolultabbá.
- [ ] Jóváhagyási szabályok szerepkör, tartalomtípus, kockázat és külső művelet alapján; a jóváhagyás mindig egy konkrét, verziózott változatra vonatkozzon.
- [ ] Ütközésfeloldás párhuzamos szerkesztésnél, világos jelzés arról, hogy mi változott, ki módosította és mi marad meg; csendes felülírás tilos.
- [ ] Verzió-diff, előnézet, visszaállítás és a publikált verzióhoz kapcsolódó bizonyíték; a restore ne írja át észrevétlenül a történeti auditot.
- [ ] Megosztási linkeknél scope, lejárat, visszavonás, hozzáférési napló és a privát/draft tartalom szivárgásának megakadályozása.

### 62.3. Minőségmérés, kísérletezés és fokozatos bevezetés

- [ ] Központi, típusos feature/capability-flag szerződés a későbbi funkciók fokozatos bevezetéséhez; a flag nem helyettesíti az authorizationt.
- [ ] Környezetenkénti konfiguráció, fokozatos rollout, gyors lekapcsolás és visszaállítási terv kockázatos változtatásokhoz.
- [ ] Kísérletek és A/B-tesztek csak megfelelő forgalom, adatvédelmi jogalap, mérési terv és előre rögzített siker-/leállítási feltétel mellett.
- [ ] A mérési eseményekhez név, cél, adatmezők, adatforrás, megőrzési idő és adatvédelmi besorolás tartozzon; ne gyűjtsünk „majd jó lesz valamire” jellegű adatot.
- [ ] Termékminőségi mutatók: sikeresen befejezett alapfolyamatok, hibaarány, mentési/publikálási sikertelenség, idő a feladat befejezéséig, hozzáférhetőségi hibák és támogatási visszajelzés.
- [ ] Az analitika ne használjon megtévesztő dark patternöket; a felhasználói beleegyezés, adatminimalizálás és kikapcsolási lehetőség megmarad.
- [ ] Minden kísérlet legyen megszüntethető úgy, hogy az adatok, URL-ek és felhasználói tartalmak ne sérüljenek.

### 62.4. Nemzetközi teljesítmény, SEO és tartalomminőség

- [ ] Publikus weboldal teljesítménycéljai mérhetőek legyenek: Core Web Vitals, első tartalom megjelenése, kép-/fontbetöltés, cache-hatékonyság és mobil hálózati használhatóság.
- [ ] CDN/cache invalidáció, domain- és locale-váltás, publikálás utáni frissülés és hiba esetén a legutolsó érvényes publikált állapot kezelése.
- [ ] Képek, videók, fontok és embedek méret-/formátumválasztása, lazy loading, alt text, poster/fallback és költségkorlát.
- [ ] SEO/AEO ellenőrzések: indexelhetőség, canonical, hreflang, structured data, OG-kép, sitemap, robots, redirect-lánc, broken link, duplikált metaadat és nem publikált tartalom kiszivárgása.
- [ ] Tartalomminőségi ellenőrzés: üres címsor, hiányzó alt text, hibás link, lejárt kampány, rossz locale, mobilos overflow, alacsony kontraszt és nem működő CTA.
- [ ] A figyelmeztetés és a publikálást blokkoló hiba legyen külön kezelve; a felhasználó értse, miért blokkol a rendszer és hogyan javíthatja.
- [ ] A nyelvi és régiós megjelenítés ne feltételezzen országot vagy jogi szabályt pusztán az IP-címből; a locale és timezone legyen felhasználó által felülbírálható.

### 62.5. Nyilvános API, webhooks és integrációs fejlesztői élmény

- [ ] Verziózott API-kontraktus, hitelesítés, scope, rate limit, pagination, idempotency key, egységes hibaformátum és deprecation-szabály.
- [ ] Interaktív API-dokumentáció, használható példák, sandbox/test credentials és webhook-eseménykatalógus csak akkor, amikor a nyilvános API valóban megvalósul.
- [ ] Webhook kézbesítési előzmény, aláírás-ellenőrzés, replay-védelem, retry, dead-letter és biztonságos kézi újrajátszás.
- [ ] API-kulcs létrehozás, scope-szűkítés, utolsó használat, rotáció, visszavonás és titok egyszeri megjelenítése.
- [ ] Import/export és integrációs adaptereknél séma-/verzióellenőrzés, előzetes dry-run, hibaösszegzés, részleges siker kezelése és idempotens újrapróbálás.
- [ ] Bővítményeknél képesség-alapú engedély, szűk sandbox, eredet/licenc, aláírás/ellenőrzés, kompatibilitás, felülvizsgálat, gyors visszavonás és a platform core-tól való izoláció.
- [ ] A külső fejlesztői felület nem adhat közvetlen hozzáférést D1/R2-hez, titkokhoz vagy belső admin műveletekhez; a domain API és authorization minden esetben kötelező.

### 62.6. Ügyféltámogatás, visszajelzés és incidenskommunikáció

- [ ] Beépített hibajelzés/visszajelzés, kategória, súlyosság, reprodukciós lépések, opcionális képernyőkép és felhasználói jóváhagyás.
- [ ] Nyomon követhető támogatási esetek, állapot, válasz, kapcsolódó verzió/hibaazonosító és felhasználó által látható következő lépés; személyes adatok megőrzése korlátozott.
- [ ] Szolgáltatói vagy platformszintű incidensnél a rendszer különböztesse meg a helyi konfigurációs hibát, a külső provider kiesését és a platform saját hibáját.
- [ ] Állapotoldal/karbantartási üzenet későbbi szolgáltatási fázisban; a kommunikáció legyen pontos, időbélyegzett és utólag frissíthető.
- [ ] Incidenskezelés: súlyosság, felelős, idővonal, hatókör, mitigáció, helyreállítás, utóelemzés és megelőző intézkedések.
- [ ] A support ne kérjen és ne jelenítsen meg jelszót, OAuth tokent, fizetési adatot vagy teljes privát tartalmat szükségtelenül.
- [ ] Felhasználói javaslatok és hibajegyek csoportosíthatók legyenek, de a népszerűség nem helyettesíti a biztonsági és adatvesztési prioritást.

### 62.7. Nemzetközi adatvédelem, bizalom és hordozhatóság

- [ ] Adatleltár: adatmező, cél, jogalap/hozzájárulás ahol szükséges, adatforrás, címzett, megőrzés, törlés és export.
- [ ] Adatfeldolgozói/provider-regiszter, adatátadási helyek és régiós korlátozások dokumentálása, ahol releváns és ellenőrizhető.
- [ ] Consent-, cookie-, marketing-, analitika- és AI-feldolgozási beállítások külön kezelése; egy általános checkbox nem fedhet le minden eltérő célt.
- [ ] Fiók-/workspace-/site-szintű adatexport és törlés, törlési folyamatállapot, jogszerű kivételek és a kapcsolódó külső szolgáltatók teendői.
- [ ] Adathordozhatósági csomaghoz verziózott manifest, séma, asset-lista, hivatkozás-ellenőrzés, ellenőrzőösszeg és helyreállítási útmutató.
- [ ] Export nem tartalmazhat titkot, sessiont, OAuth tokent vagy más felhasználó adatait; restore után a külső kapcsolatok újrahitelesítést igényelnek.
- [ ] A platform ne ígérjen automatikus jogi megfelelést; a támogatott technikai kontrollok és a felhasználó/szolgáltató felelőssége külön legyen dokumentálva.

### 62.8. SANCI AI minőségértékelés és irányítás

- [ ] Feladattípusonkénti értékelési tesztkészlet a weboldal-, kód-, tartalom-, fordítás-, moderációs és elemzési feladatokhoz.
- [ ] Mérni kell a strukturált kimenet érvényességét, tényhibát, forráskövetést, márkahangot, hozzáférhetőséget, költséget, késleltetést és biztonsági policy-követést.
- [ ] Modell-/prompt-/tool-változás előtt regressziós értékelés; a magas kockázatú feladatoknál tiltott és adversarial tesztek.
- [ ] AI-eredményhez eredetjelölés, verzió, használt források, bizonytalanság és a felhasználó által megtekinthető diff tartozzon, ahol ez értelmezhető.
- [ ] Prompt injection, rosszindulatú dokumentum-/webtartalom, jogosultság-kiterjesztés, adatkilépés és eszközhasználati visszaélés elleni védelem.
- [ ] A memória különíti el a felhasználó által megadott preferenciát, a megfigyelt adatot, a modell következtetését és a lejárt/érvénytelen információt.
- [ ] A felhasználó megtekintheti, javíthatja és törölheti a megőrzött AI-kontextust; az AI nem tanulhat titokból vagy jogosulatlanul elérhető adatokból.
- [ ] AI-kiesés vagy költséglimit esetén legyen világos fallback és a kritikus kézi folyamatok maradjanak működőképesek.

### 62.9. Világszintű kiadási és elfogadási kritériumok

Egy funkció csak a rá vonatkozó kritériumok bizonyítása után jelölhető késznek; a lista nem követeli meg, hogy minden későbbi platformképesség az első kiadás része legyen.

- [ ] Funkció- és adatgazda, célfelhasználó, engedélyezett szerepkörök, állapotok, függőségek és kockázati besorolás dokumentált.
- [ ] A fő sikeres folyamat, üres állapot, betöltés, részleges siker, hiba, újrapróbálás, visszavonás és törlés/archiválás tesztelt.
- [ ] Domain-szintű teszt, integrációs teszt és authorization teszt a kockázatnak megfelelően lefutott.
- [ ] UI-változtatásnál billentyűzet, screen reader-alapok, kontraszt, reduced motion, mobil/touch, keskeny viewport és hibaüzenetek ellenőrizve.
- [ ] Megosztott adatoknál minden érintett felületen ellenőrizve a mentés, újratöltés, előnézet, publikált állapot és cache invalidáció.
- [ ] Migrációnál előzetes állapotfelmérés, mentés, idempotencia, FK/ownership ellenőrzés és helyreállítási terv igazolt.
- [ ] Külső szolgáltatónál scope, quota, timeout, retry, provider outage, revoke/reconnect és policy-korlát ellenőrizve.
- [ ] Naplózás és metrikák hasznosak, de nem szivárogtatnak titkot vagy szükségtelen személyes adatot.
- [ ] Dokumentáció, felhasználói súgó és változásnapló frissítve; ismert korlát és rollback útvonal leírva.
- [ ] Éles/böngészős ellenőrzés csak ott jelölhető késznek, ahol ténylegesen lefutott; a CI nem helyettesíti a valódi felhasználói útvonalat.
- [ ] A lezárás után egyetlen következő aktív pont marad a MASTER-ben; a funkciókatalógus nem válik második roadmap-példánnyá.

### 62.10. A végső cél és a fázisok viszonya

- [ ] A teljes platformcél minden funkcióját megőrizzük, de a korai kiadásba csak a stabil, értékes és függőségekkel alátámasztott részek kerülnek.
- [ ] A nemzetközi szint nem jelent minden szolgáltató minden funkciójának vak utánzását: a termék a valós felhasználói érték, hozzáférhetőség, biztonság, fenntarthatóság és API-képesség alapján választ.
- [ ] A platformnak fokozatosan kell skálázhatóvá válnia; a multi-tenant, marketplace, billing és külső fejlesztői platform csak a szükséges izolációs, jogi, üzemeltetési és támogatási előfeltételek után kapcsolható be.
- [ ] A funkciók bővítése nem vezethet duplikált domainhez, második Visual Editorhoz, párhuzamos integrációs tokenrendszerhez vagy több, egymásnak ellentmondó tervhez.
- [ ] A végső funkciókatalógust a felhasználóval közösen lehet részletesen rangsorolni, de addig sem veszhetnek el a korábban rögzített, még meg nem valósított képességek.


## 63. MASTER-terv lezárási és fejlesztésindítási feltételek

> **2026-10-15, 4.3-as felülírási szabály:** a 63. fejezet ellenőrzési táblái, dátumozott checkpointjai és az ott szereplő korábbi aktív pontok történeti pillanatképek. Egyetlen jelenlegi aktív végrehajtási pont az F0.1, amelyet a fejléc és a 77. fejezet határoz meg. A régi auditkapuk nem akadályozzák a tényleges kódbaseline-t, de a bizonyítottan nyitott biztonsági és publish-conflict problémák az érintett kiadást továbbra is blokkolják.


Ez a fejezet határozza meg, mikor mondható ki, hogy a MASTER-terv elég teljes és egységes a következő fejlesztési pont végrehajtásához. A terv lezárása nem jelenti a teljes termék implementációjának lezárását.

### 63.0. Automatizált szerkezeti pillanatkép — 2026-10-14

A kanonikus `v2/foundation` terv teljes szövegén végzett, a 24. fejezetet forrásként kezelő determinisztikus ellenőrzés eredménye:

- A 24. fejezet `- PREFIX-NNN:` alakú elsődleges sorainak száma **396**, egyedi azonosítóinak száma **396**; a vizsgált sorok között nincs ismétlődő ID.
- A dokumentum egészében előforduló `PREFIX-NNN` alakú hivatkozások között **0 olyan azonosító** található, amely hiányzik a 24. fejezetből. Ez a vizsgálat csak erre a névformátumra és a teljes aktuális szövegre érvényes; más jelölésű történeti ID-ket külön kell ellenőrizni.
- A 49. fejezetben **22 számozott főmodul-cím** található (49.1–49.22). A menücímek száma nem bizonyítja, hogy minden capability megfelelő aloldalra van besorolva.
- A 63.52–63.54 történeti ledgerben jelzett 271/271 H19–H34 strukturális megfeleltetés továbbra is **külön, korábbi ellenőrzés eredménye**, nem jelen pillanatképben újraigazolt szemantikai PASS.

**Következtetés:** a fenti három aktuálisan vizsgált strukturális invariáns teljesül; ez nem helyettesíti a 396 képesség owner/UX/fázis/függőség/acceptance ellenőrzését, a forráshiány rendezését, a repo-kód vizsgálatát vagy a futó teszteket. Az A kapu **IN PROGRESS / NOT PASS** marad.

**Megismételhető ellenőrzési elv:** a 24. fejezet elsődleges sorait a `^- ([A-Z][A-Z0-9_]*-\\d{3}):` mintával számolni, egyediséget ellenőrizni; a teljes dokumentum `\\b[A-Z][A-Z0-9_]*-\\d{3}\\b` hivatkozásait a 24. fejezet halmazához hasonlítani; a 49. fejezet 49.1–49.22 címeit tételesen ellenőrizni. Új ID-k felvételekor ezt az ellenőrzést meg kell ismételni.

### 63.0.1. Funkcióazonosító-családok → kanonikus Admin-modulok — ellenőrzött besorolási alap

A 24. fejezet aktuális **396 egyedi ID-jának mind a 30 prefixcsaládját** a 49. fejezet megfelelő tulajdonosi moduljához vagy indokolt keresztmodulú minőségkapuhoz rendeztük. Ez **prefixcsalád-szintű navigációs besorolás**, nem a 396 egyedi sor szemantikai, fázis-, acceptance- vagy implementációs igazolása.

| ID-család | ID-k száma | Elsődleges Admin-modul / indokolt határ |
| --- | ---: | --- |
| ADM | 13 | 49.1 (Admin shell; keresés 49.16, értesítés 49.17, súgó 49.18 és beállítások 49.19 csak belépési pontként) |
| WEB | 32 | 49.2 |
| EDT | 44 | 49.2 / Visual Editor aloldal |
| DSN | 18 | 49.3 |
| RES | 16 | 49.4 |
| INT | 21 | 49.7 |
| LIV | 10 | 49.5 |
| OBS | 10 | 49.6 |
| SCH | 15 | 49.5 / Stream Planner és adásrend aloldal |
| CNT | 22 | 49.8 |
| COM | 20 | 49.9 |
| STO | 21 | 49.10 |
| SUP | 12 | 49.11 |
| ANL | 10 | 49.13 |
| CAM | 9 | 49.12 |
| AUT | 14 | 49.14 |
| AI | 21 | 49.15 |
| SEC | 12 | 49.19 |
| OPS | 11 | 49.19 / üzemeltetés és diagnosztika, technikai háttérszerződéssel |
| LOC | 6 | 49.19 / nyelvbeállítás; 49.2 és 49.8 lokalizált tartalmi belépési pontok |
| TEAM | 7 | 49.22 |
| MKT | 5 | 49.21 |
| QA | 10 | keresztmodulú minőségkapu, nem önálló Admin-főmodul |
| SET | 4 | 49.19 |
| DYN | 8 | 49.2 / webes CMS és dinamikus adatkapcsolatok |
| SEO | 5 | 49.2 / SEO és publikálás |
| DEV | 6 | 49.20 |
| SEARCH | 5 | 49.16 |
| NTF | 5 | 49.17 |
| HELP | 4 | 49.18 |

**Kötelező ellenőrzendő határok:** `SCH` nem a Visual Editorban, hanem a 49.5 Stream Plannerben szerkeszthető; `DYN` és `SEO` a 49.2 Weboldalhoz tartozik, nem a 49.8 videó-/posztgyártó Tartalomstúdióhoz; `CAM` a 49.12 szponzorációs üzleti munkafolyamat, `ANL` a 49.13 analitika; `LOC` keresztmodulú, nyelvi tartalmak külön tulajdonosi referenciával; `QA` nem külön zsúfoló menüpont, hanem minden releváns modulra érvényes kapu.

**Következő, még nyitott ellenőrzés:** minden egyes ID-hoz konkrét aloldal, owner, adat/API, jogosultság, fázis, függőség, pozitív/negatív teszt és bizonyíték tételes egyeztetése; az eltérő besorolású egyedi kivételek dokumentálása. A 00/A és 00.9.6.B forráshiány továbbra is nyitott; nincs audit-PASS.

