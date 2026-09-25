# Sanci9517 — EGYSÉGES MASTER FEJLESZTÉSI, TESZTELÉSI ÉS FUNKCIÓBŐVÍTÉSI TERV

**Verzió:** MASTER-2.40.19  
**Dátum:** 2026-09-25  
**Repository:** `sanci9517/sanci9517`  
**Aktív branch:** `v2/foundation`  
**Projekt:** Sanci9517 Streamer Brand Platform  
**Állapot:** ez az egyetlen aktív fejlesztési terv.

**Legutóbbi igazolt állapot:** 2026-09-25 — a Twitch/Schedule regressziós láncban a `test:editor` 30/30 és a `test:schedule` 8/8 PASS. A kibővített Twitch Integration Check #91 azonban a közvetlen `tests/twitch-oauth.test.js` futtatásnál Node 24 ESM `ERR_MODULE_NOT_FOUND` hibát talált, mert a `twitch-oauth.ts` → `twitch-crypto` import extensionless volt. Ezt a `739bb3a5b026f24bbf305a3d87692bffd5b09b03` commitban `.ts` importokra javítottuk; a Twitch Integration Check #92 és Editor Core #716 az új commiton még fut. Közben auditáltuk a Twitch connection státusz modellt is: a `revocation_pending` runtime állapothoz hiányzott a DB CHECK-engedélyezés, ezért elkészült az `0014_twitch_connection_status.sql` migration. A Twitch authorization most a Schedule Builder későbbi írási műveleteihez szükséges `channel:manage:schedule` scope-ot is kéri. A teljes C.5.1 kapu és a production újratelepítés még nincs lezárva.


## 00/B — ÚJ BESZÉLGETÉS / CHECKPOINT VÉDELMI ZÁR — 2026-09-22

**Ez a blokk kötelező boot-ellenőrzés új beszélgetés indításakor.**

Ha bármilyen régi checkpoint, összefoglaló, korábbi üzenet vagy történeti fejezet az alábbiak bármelyikét állítja, az **ELAVULT**, és nem szabad folytatási pontként használni:
- „40.68 – pageOrder teljes tesztelése”
- „Most következő pont: 40.68”
- „deploy után kezdjük a mobilos pageOrder tesztet”
- „40.67 → 40.68 pageOrder teszt”
- bármely olyan állapot, amely 40.67-et vagy 40.68-at aktív/pending fejlesztési pontként jelöl.

**Hivatalos aktuális állapot:**
- 40.67 — `[x]` LEZÁRVA.
- 40.68 — `[x]` LEZÁRVA.
- 40.69.1 — `[x]` AUDIT PASS — teljes kód- és adatfolyam-audit lezárva.
- 40.69.2 — `[x]` LEZÁRVA.
- 40.69.5 — `[x]` LEZÁRVA — rollback + republish live regresszió PASS.
- 40.69.7 — `[x]` LEZÁRVA — célzott live page.update + audit_log együttállás PASS.
- A pageOrder mobil élő tesztje nem aktuális feladat; a 40.67 teljes mobil tesztje már lezárt.
- A korábban csak mobilon tesztelt funkciók PC/Desktop visszatesztje későbbi tesztkapu, és csak a felhasználó külön kérésére indul.

**Boot-szabály:** új beszélgetésben a modellnek először ezt a 00/B blokkot, majd közvetlenül a 00/A indexet kell figyelembe vennie. Ha bármely régi checkpoint ettől eltér, a régi checkpointot kell figyelmen kívül hagyni, nem az aktuális MASTER állapotot.

**Egyetlen aktuális folytatási mondat:**
> „Folytassuk a Sanci9517 MASTER tervet a 40.69.13 Twitch-integrációs alap és az új, első osztályú Adásrend/Schedule Builder teljes auditjával; először Twitch API/OAuth/EventSub + Schedule domain szerződés, majd csak ennek lezárása után Builder/Inspector kódolás.”

> **Ez a dokumentum az egyetlen végrehajtási igazságforrás.** A korábbi blueprint-ek, roadmap-ek, editor-tervek, AI-tervek és státuszfájlok archivált tudásanyagként maradnak meg. Új beszélgetésben, akár hónapok múlva is, ezt a fájlt kell először elolvasni, majd kizárólag a **00/A MASTER VÉGREHAJTÁSI INDEX egyetlen aktív pontjából** folytatni. Más fejezet `[ ]`, `[~]` vagy régebbi „következő lépés” szövege nem jelent aktuális folytatási pontot.

---

# 00 — A MASTER TERV SZABÁLYAI

## 00.1 Státuszjelölések
- `[x]` = implementálva, végigtesztelve és a felhasználó visszaigazolta.
- `[~]` = részleges, folyamatban vagy újratesztelendő.
- `[ ]` = még nincs kész.
- `[!]` = blokkoló hiba.
- `[D]` = dokumentálandó döntési pont.

**Kód jelenléte önmagában soha nem jelent `[x]` státuszt.**

## 00.2 Egyetlen MASTER terv + egyetlen aktív munkapont
Ez a projekt **egyetlen aktív MASTER tervet és pontosan egy aktív végrehajtási pontot** használ.

- Soha nincs két párhuzamos fejlesztési munkasáv.
- PC/Desktop és Mobile/Touch **nem külön munkasáv**, csak ugyanazon funkció külön tesztfelülete.
- A közös canonical State, Page Model, Command API, selection, hierarchy, history és renderer csak egyszer létezhet.
- Minden további funkció csak backlogként létezhet, amíg az aktuális aktív pont le nincs zárva.
- Új beszélgetésben kizárólag a **00/A MASTER VÉGREHAJTÁSI INDEX** alapján szabad folytatni.
- Régi fejezetekben található `[~]`, `[ ]` vagy régebbi „következő lépés” szöveg nem aktiválható önállóan.

**KÖTELEZŐ ÁLLAPOTMENTÉS MINDEN LÉPÉS UTÁN:** minden fejlesztési, javítási, tesztelési vagy döntési lépés lezárásakor frissíteni kell ezt a MASTER fájlt. Az indexnek mindig az utolsó ténylegesen lezárt lépést és az egyetlen következő aktív pontot kell mutatnia.

## 00.2a Platformfelületek: fejlesztés közös, tesztelés felületenként
A fejlesztés során az Editor v2-t **PC/Desktop és Mobile/Touch felületre is fejlesztjük**, de ezek nem külön fejlesztési ágak. Ugyanazt a canonical funkciót, State-et, Page Modelt, Command API-t, History-t és Renderert használják.

**Kötelező visszatérési szabály a teszteknél:**
- Ha egy funkciót valamelyik élő tesztben csak mobilon ellenőriztünk, az attól még **nem tekinthető PC/Desktop oldalon teljesen teszteltnek**.
- Az ilyen pontokat a MASTER-ben **PC/Desktop live test PENDING / visszatérő tesztként** kell megőrizni.
- Később, amikor a felhasználó PC/Desktop tesztet kér, az összes korábban csak mobilon ellenőrzött releváns funkcióhoz vissza kell térni.
- Ez **nem nyit új fejlesztési ágat**: a PC/Desktop ellenőrzés ugyanazon lezárt funkció utólagos tesztkapuja.
- Egy funkció csak akkor jelölhető teljes platformtesztként lezártnak, ha a szükséges PC/Desktop, tablet és mobile ellenőrzési státusza egyértelműen dokumentált.
- A PC/Desktop live teszt továbbra sem indul automatikusan; csak a felhasználó külön kérésére.

## 00.3 Kötelező MASTER-állapotfrissítés minden lépés után
Minden egyes lépés után, még a következő lépés megkezdése előtt:
1. rögzíteni kell, mit végeztünk el;
2. rögzíteni kell a teszt eredményét;
3. rögzíteni kell, mi maradt hátra vagy mi blokkol;
4. rögzíteni kell az **egyetlen aktuális folytatási pontot**;
5. szükség esetén rögzíteni kell a commit/HEAD állapotot;
6. a MASTER fájlt GitHubon frissíteni kell.

**Tilos** több fejlesztési lépést úgy végrehajtani, hogy közben a MASTER ne tükrözze az aktuális állapotot. Ha a beszélgetés bármikor megszakad, az utolsó MASTER-frissítés legyen a hivatalos folytatási pont.

## 00.4 Kötelező munkaciklus
Minden aktív pont:

`MASTER pont → teljes érintett kód audit → adatfolyam audit → minimális módosítás → érintett fájl visszaolvasása → GitHub commit → branch/HEAD ellenőrzés → Cloudflare build → deploy → API ellenőrzés → D1/R2/KV ellenőrzés → admin teszt → public teszt → desktop/tablet/mobile teszt → regresszió → felhasználói teszt → felhasználói visszaigazolás → MASTER frissítése`

Sikertelen tesztnél **nem lépünk tovább**.

## 00.4a Folyamatos funkcióbővítés
A cél nem egy egyszer elkészített minimális editor. A Visual Editor és a teljes platform **folyamatosan bővülő rendszer**.

Ha a fejlesztés során:
- hiányzó funkciót találunk;
- jobb iparági megoldást találunk;
- új felhasználói igény merül fel;
- egy funkció más funkciótól függ;
- biztonsági, accessibility, performance vagy AI-kompatibilitási követelmény jelenik meg;
- a jelenlegi tervből kimaradt, de a lehető legrészletesebb editorhoz szükséges képesség azonosítható;

akkor **először ezt a MASTER tervet frissítjük**, megfelelő helyre soroljuk és csak utána implementáljuk.

A terv ezért élő dokumentum: nem rövidíteni kell, hanem új funkciókkal és pontos státuszokkal folyamatosan bővíteni.

## 00.4b — GLOBAL LOCALIZATION-READY ALAP — 1.0 ELŐTT KÖTELEZŐ

A platform hosszú távú célja globálisan használható streamer platform, ezért a teljes többnyelvű rendszer nem kerül 1.0 előtt teljes implementálásra, de az 1.0-ig elkészülő architektúra kötelezően localization-ready lesz.

**1.0 scope döntés:**
- [x] 1.0 elsődleges és teljesen támogatott tartalmi nyelve: **magyar (hu-HU)**.
- [ ] 1.0 előtt teljes többnyelvű UI/content rendszer implementációja: **nem cél**.
- [ ] 1.0 előtt minden nyelvhez teljes fordítás: **nem cél**.
- [x] 1.0 előtt tilos olyan Page Model, routing, D1 schema, editor, renderer vagy domain contract döntést hozni, amely később szükségtelen újraépítést kényszerítene ki a lokalizáció miatt.

**Kötelező alapok 1.0 előtt:**
- locale fogalom és canonical locale azonosításának szerződése;
- platform UI stringek és streamer által létrehozott tartalom szétválasztásának architekturális szabálya;
- Page Model localization-safe kialakítása;
- domain adatok és lokalizálható megjelenítési szövegek szétválasztása;
- Schedule és egyéb dinamikus domain adatok localization-safe modellje;
- locale-aware dátum/idő/szám megjelenítésre előkészített adatfolyam;
- fallback stratégia helyének és működési szerződésének meghatározása;
- localized routing/SEO későbbi bevezethetőségének biztosítása;
- Unicode és RTL kompatibilitás megőrzése;
- Editor és renderer úgy épüljön, hogy a lokalizáció később ne igényeljen második editort, renderert, Page Modelt vagy command rendszert;
- migration strategy a későbbi locale-bővítéshez.

**Fontos:** 1.0 előtt csak a szükséges **alap/szerződés** készül el. Nem készítünk félkész HU/EN rendszert, nem másoljuk le az oldalakat nyelvenként, és nem vezetünk be párhuzamos lokalizációs adatutat.

**1.0 után külön fő szakasz:** Global Localization Architecture & Implementation.
Ennek teljes auditja és implementációja külön MASTER munkapont lesz, többek között: locale registry, region/language kezelés, fallback, platform UI localization, Page/content localization, component/editor localization, dynamic data localization, localized routing/SEO, translation state/versioning, per-locale publish, missing-translation detection, locale-aware formatting, RTL, localization testing és későbbi AI-assisted translation/human review workflow.

**Definition of Done az 1.0 előtti alaphoz:**
- a fenti localization-safe szerződések auditálva és a MASTER-ben rögzítve;
- a meglévő canonical Page Model, D1, routing, renderer, Editor v2 és domain modellek nem akadályozzák a későbbi többnyelvűséget;
- ahol szükséges, minimális foundation módosítás készül és tesztelve van;
- tényleges többnyelvű UI/content csak a külön 1.0 utáni szakaszban indul.
## 00.5 Preset + manuális beállítás szabály
Ahol a felhasználó gyakran ismétlődő értékeket állít, ott a manuális mező mellett értelmes presetek is legyenek.

Példák:
- width: Auto / Fill / Fit / gyakori méretek;
- height: Auto / Fit / gyakori méretek;
- spacing: előre definiált lépések;
- typography: token/preset;
- radius/shadow: token/preset;
- breakpoint/device: presetek;
- zoom: 25/50/75/100/150/200% és Fit;
- layout: gyakori Flex/Grid/Stack beállítások.

A preset nem külön kerülőút: ugyanazon `Command → Validation → Page Model → History → Canvas → Persistence` láncon működik, mint a manuális szerkesztés. Minden preset legyen responsive-context aware, ha az adott tulajdonság responsive.

## 00.6 Forrás- és benchmark szabály
A Visual Editor specifikációját több dokumentált rendszer mintái alapján bővítjük. Vizsgálható többek között Builder Visual Editor, Elementor, Webflow, Pinegrow, GrapesJS, Craft.js és Puck. A vizsgált mintákat nem másoljuk; csak a hasznos, bizonyítható funkciókat építjük be saját Page Modelbe.

## 00.7 Architektúra elsőbbsége
Nem vezetünk be második selection-, hierarchy-, state-, renderer- vagy command-rendszert. Az új funkciók a kanonikus rendszert bővítik.

## 00.8 — PROFI WEBENGINEERING / EDITOR-ENGINEERING ALAPELV — KÖTELEZŐ
A projektet nem „kódolási feladatként”, hanem professzionális, hosszú távon karbantartható webplatform és vizuális webszerkesztő fejlesztéseként kezeljük. A gondolkodási sorrend mindig: probléma → követelmény → architektúra → adatfolyam → állapot → biztonság → implementáció → automatizált teszt → élő teszt → regresszió → felhasználói visszaigazolás.

Kötelező szakmai szabályok:
- Gyökérok, nem tünet: hibát nem CSS-/JS-patcheléssel fedünk el. Először a valódi gyökérokot keressük az UI → state → command → validation → Page Model → persistence/API → D1 → renderer teljes láncában.
- Egyetlen canonical megoldás: ugyanarra a feladatra nem maradhat párhuzamos, egymást részben helyettesítő kódút. A régi utat auditáljuk, leválasztjuk/archiváljuk, és egyértelmű canonical utat jelölünk ki.
- Audit megelőzi a kódolást: jelentősebb funkció előtt kötelező az érintett fájlok, API-k, adatmodell, állapotátmenetek, meglévő tesztek és legacy rétegek teljes auditja.
- Minimális, de helyes módosítás: nem a legkevesebb kódsor a cél, hanem a legkisebb architekturálisan helyes, tesztelhető és bővíthető változtatás. Ha az alap rossz, előbb refaktorálunk.
- Szerződésalapú fejlesztés: minden domainhez és komponenshez egyértelmű input/output, schema, validation, ownership és lifecycle tartozik. A kliens nem írhatja felül a szerver üzleti szabályait.
- Egyértelmű adat-tulajdonos: minden adatnak pontosan egy canonical source of truth-ja legyen. Cache, preview, derived state és UI state nem válhat véletlenül elsődleges adattárolóvá.
- Perzisztencia és concurrency első osztályú: save, publish, rollback, revision, expectedVersion, audit és hibatűrés a funkció része, nem utólagos extra.
- Security by design: auth, authorization, secret/token kezelés, input validation, URL/HTML sanitization, session/CSRF szempontok, rate limit és abuse protection már tervezéskor szerepel.
- Accessibility by design: billentyűzet, fókusz, kontraszt, szemantikus vezérlők, érthető állapotjelzés, touch célméret és reduced-motion szempontok a funkció részei.
- Responsive by architecture: Desktop, tablet és mobile ugyanazt a canonical rendszert használja. Nem készül külön mobil üzleti logika.
- Performance by default: kerüljük a felesleges újrarenderelést, N+1 lekérést, memóriaszivárgást és indokolatlan hálózati terhelést.
- Megfigyelhetőség: hibákhoz stabil diagnosztikai kód, reprodukálható logika és értelmezhető állapot szükséges. A „nem működik” nem elfogadható diagnosztikai állapot.
- Teszt bizonyíték, nem dísz: unit/contract/integration/live/E2E tesztet az adott kockázat alapján választunk. A kód jelenléte vagy egy zöld unit teszt önmagában nem PASS.
- UX és technikai minőség együtt: egy funkció akkor kész, ha működik, érthető, olvasható, kiszámítható, hibakezelhető és profi használatra alkalmas.
- Benchmarkból tanulunk, nem másolunk: ismert editorokból mintát veszünk, de a saját domainhez és architektúrához igazítjuk.
- Nem overengineerelünk: új absztrakció, tábla, service, cache vagy dependency csak bizonyítható felelősséggel és haszonnal kerül be.
- Visszafelé kompatibilitás tudatos: meglévő adatok és dokumentumok esetén migráció/normalizálás/rollback stratégia nélkül nem törünk szerződést.
- Minden döntés dokumentált: elutasított irányt és okát a MASTER-ben rögzítjük, hogy új beszélgetésben ne térjünk vissza ugyanahhoz a hibás párhuzamos úthoz.
- Nincs bizonytalan PASS: ha egy kapu hibás, részleges vagy nem ellenőrzött, marad [~]/[!]. Nem nevezünk késznek valamit csak azért, hogy haladhassunk.

### 00.8b — GITHUB ↔ VS CODE / LOCAL WORKTREE SZINKRONIZÁCIÓ — KÖTELEZŐ

A projektben a GitHub repository és a Cloudflare deployhoz használt lokális VS Code munkakönyvtár állapota nem térhet el észrevétlenül. A 2026-09-24-i C.5.1 live route ellenőrzés során bizonyítást nyert, hogy a GitHub `v2/foundation` ágon a C.5 admin Twitch Schedule sync route már létezett, miközben a lokális munkakönyvtárból az `src/routes/admin/twitch-schedule-sync.ts` fájl és az `src/index.ts` route-bekötés hiányzott. Emiatt egy sikeres Cloudflare deploy egy régebbi lokális állapotot tett live-ba, amely a route-ra 404-et adott.

**Rögzített canonical fejlesztési szabály:**
- [x] GitHub `v2/foundation` a repository referenciaállapota.
- [x] A VS Code lokális munkakönyvtár a fejlesztési/deploy forrás, ezért annak GitHub branch állapotával szinkronban kell lennie.
- [x] GitHub webes módosítás után a lokális munkakönyvtárat tudatosan Sync/Pull művelettel kell frissíteni, mielőtt további lokális módosítás vagy deploy történik.
- [x] Lokális módosítás után a GitHub branchre Commit + Push szükséges, mielőtt a GitHub állapotot tekintenénk kész/canonical változatnak.
- [x] Cloudflare deploy csak az ellenőrzött, szinkronizált lokális állapotból történhet.
- [x] Automatikus háttérben futó pull/sync nem kötelező és nem kívánatos, mert helyi, még nem mentett munkát felülírhatna; a szinkronizálás legyen explicit és ellenőrizhető.
- [ ] A felhasználó gépén a Git CLI / VS Code Git integráció tényleges beállítása és ellenőrzése még hátra van.
- [ ] A GitHub ↔ VS Code → CI → Cloudflare teljes szinkronizált munkafolyamatát lépésenként kell beállítani és végigtesztelni.

**Kötelező ellenőrzési szabály minden deploy előtt:**
1. lokális branch/HEAD azonosítása;
2. lokális módosítások ellenőrzése;
3. GitHub branch aktuális állapotának ellenőrzése;
4. eltérés esetén Sync/Pull vagy Commit/Push rendezése;
5. typecheck + érintett tesztek;
6. csak ezután Cloudflare deploy;
7. live API ellenőrzés;
8. MASTER frissítése.

**Szigorú tiltás:** GitHub weben létrehozott/javított fájlt nem tekintünk automatikusan lokálisan jelen lévőnek. A lokális fájlrendszer és a GitHub branch közötti eltérést minden deploy előtt ellenőrizni kell.

### 00.8a — Profi fejlesztési döntési sorrend
1. Követelmény és Definition of Done pontosítása.
2. Teljes érintett kód- és adatfolyam-audit.
3. Canonical ownership és szerződések rögzítése.
4. Security, data integrity, concurrency, performance, accessibility, responsive és migration kockázatok felmérése.
5. Implementációs terv a legkisebb helyes változtatással.
6. Implementáció után az érintett fájlak visszaolvasása és diff/audit.
7. Automatizált tesztek.
8. Élő API/D1/Editor/Public teszt, ahol releváns.
9. Regresszió és diagnosztika.
10. Felhasználói ellenőrzés.
11. MASTER frissítés még a következő fejlesztési lépés előtt.

Szigorú tiltás: gyors patch, második renderer, külön mobil hack, legacy UI visszafoltozása vagy szerződés nélküli kódolás csak akkor megengedett, ha az audit bizonyítja, hogy az adott megoldás valóban canonical és architekturálisan indokolt.


# 00/A — MASTER VÉGREHAJTÁSI INDEX — EZ AZ EGYETLEN AKTÍV SORREND

> **KÖTELEZŐ:** A dokumentum bármely más fejezetében szereplő `[ ]`, `[~]` vagy régebbi „következő lépés” szöveg **történeti dokumentáció vagy backlog**, és **nem végrehajtási utasítás**. Az egyetlen végrehajtási forrás az alábbi index **EGYETLEN AKTÍV PONT** sora. A történeti fejezetek státuszai nem írhatják felül az indexet, és nem nyithatnak új munkasávot.

### Kész, lezárt fő blokkok
- [x] **40.69.4 — Revision conflict második gyökérok + LIVE Save/Publish regresszió**
- [x] **40.62–40.63 — Canonical standard oldalak + dinamikus publikus menü**
- [x] **40.64–40.66 — Oldal slug/meta lifecycle**
- [x] **40.67 — Canonikus oldalsorrend: Editor = publikus menü**
- [x] **40.68 — Draft / Preview / Publish hardening**
  - [x] Draft mentés
  - [x] Preview
  - [x] Publish → LIVE
  - [x] Published snapshot / publikus route
  - [x] Unpublish
  - [x] Draft megmaradás
  - [x] Republish
  - [x] Invalid Page Model publish-védelem
  - [x] Publish/Unpublish audit
  - [x] Mobil UI regresszió
  - [x] Diagnosztika 0 hiba
  - [x] Core CI 24/24

### 🔵 EGYETLEN AKTÍV PONT
**40.69.13 — Twitch-integrációs alap + Schedule/Adásrend újratervezés audit**

**Státusz:** [~] AKTÍV — B.4–B.13 és C.1–C.4 lezárva. C.4 runtime contract audit PASS; implementáció még nem történt. A következő egyetlen munkapont: C.5 — canonical source-aware Schedule service/mapper minimális implementáció + contract/regression tesztek. Builder/Inspector továbbra is blokkolt.

### Kötelező sorrend — 40.69.13 aktív munkapont
**Szigorú szabály:** először csak audit és szerződéstervezés történik. OAuth bekötés, Twitch kódolás vagy Schedule Builder UI implementáció csak az audit eredményének MASTER-be rögzítése után indul.

1. **Twitch integráció teljes audit**
   - OAuth / jogosultságok / token-kezelés;
   - Twitch API kliens és szerveroldali service boundary;
   - stream live/offline állapot;
   - csatorna alapadatok;
   - aktuális kategória/játék;
   - Twitch Schedule API és a meglévő `schedule_items` domain kapcsolata;
   - webhook/EventSub lehetőségek;
   - rate limit, cache, token refresh/recovery;
   - audit/security/secret kezelés.
2. **Twitch → Schedule domain szerződés**
   - a saját `schedule_items` marad a weboldal canonical Schedule domainje;
   - Twitch lehet külső forrás/szinkron, de nem veheti át ellenőrizetlenül a Page Model vagy a saját D1 domain igazságforrás szerepét;
   - egyértelmű source/sync állapot kell;
   - kézi saját adás és Twitchből származó adat együtt kezelhető;
   - ütközés esetén ne történjen csendes felülírás.
3. **Adásrend mint első osztályú Editor v2 blokk**
   - belső node type: `schedule`;
   - UI-ban külön „Adásrend/Menetrend” blokk, nem a generic Sanci blokk része;
   - Editor Inspectorból kezelhető adások;
   - ne kelljen minden streamet külön Text/Image node-okból kézzel felépíteni;
   - a vizuális blokk egy adatvezérelt rendszer legyen.
4. **Játékprofil + sablon rendszer**
   - játékprofilok: név, slug, kép/media, opcionális színek/brand adatok;
   - első példák: Fortnite, Hearthstone, Hades, majd korlátlan új játékprofil;
   - vizuális sablonok külön a játékprofiloktól: Minimal, Gaming, Neon, Cards, Timeline, Weekly Grid, Featured Stream stb.;
   - saját sablon menthető legyen;
   - új játékhoz ne kelljen kódot írni.
5. **Adás rekord modell bővítésének auditja**
   - játékprofil referencia;
   - opcionális eseménykép / borító;
   - cím, leírás/jegyzet;
   - kezdés/végzés;
   - platform;
   - stream URL;
   - státusz;
   - timezone kezelési stratégia;
   - későbbi recurring stream támogatás előkészítése;
   - naptár/emlékeztető későbbi bővíthetőség.
6. **Profi Schedule UX**
   - Next Stream / Next 3 / Weekly / Full / Featured nézet;
   - desktopon kártya/grid/timeline lehetőségek;
   - mobilon rendezett stacked/day-card megjelenítés;
   - helyi időzóna megjelenítés;
   - live/next státusz kiemelés;
   - játék artwork;
   - platform és link;
   - később calendar/reminder és export;
   - social/share formátumok későbbi bővíthetősége.
7. **Integrációs jövőkép**
   - Twitch mellett később YouTube/TikTok/Discord/VOD/Clips integrációk;
   - egységes Integration service layer;
   - a Schedule Builder ne legyen Twitch-specifikus hardcoded rendszer.

### Szigorú architekturális döntések
- [x] Nem készül külön második Visual Editor.
- [x] A legacy Admin Schedule UI-t nem élesztjük újra.
- [x] A `schedule_items` D1 domain megmarad.
- [x] A Page Model nem másolja bele az eseményrekordokat.
- [x] A `schedule` node külön canonical Editor v2 blokk.
- [x] Twitch integrációs contract audit PASS; a B.4–B.13 token lifecycle/security hardening, live reauthorization recovery, production/observability query-string leakage és disconnect/reconnect atomicity/state-transition kapuk lezárultak.
- [ ] Játékprofil/sablon adatmodell még nincs véglegesítve.
- [ ] Inspectorból történő Schedule event CRUD még nincs implementálva.
- [ ] Schedule Builder végső UX még nincs implementálva.
- [ ] End-to-end Twitch → Schedule → Editor → Publish → Public teszt még nincs.

### Tesztkapu
Az aktív pont csak akkor zárható, ha:
- [ ] teljes Twitch kód/adatfolyam audit;
- [ ] token/security/rate-limit stratégia ellenőrizve;
- [ ] Twitch API szerződés és D1 Schedule mapping rögzítve;
- [ ] szükséges migration/data-model terv rögzítve;
- [ ] CI/typecheck;
- [ ] Twitch API integration smoke test;
- [ ] Schedule domain regression;
- [x] no-secret/no-token leakage ellenőrzés — B.12 PASS;
- [ ] MASTER frissítve;
- [ ] felhasználói PASS.

**PC Editor live olvashatósági teszt:** későbbi visszatérő tesztkapu, nem külön aktív fejlesztési ág.

### 40.69.12.B — Live audit megállapítás: legacy Schedule UI / canonical API eltérés

- [x] `src/routes/admin/schedule.ts` teljes létrehozási validáció auditálva.
- [x] A canonical POST body mezői: `title`, `platform`, `startsAt`, `endsAt`, `status`, `url`, `notes`.
- [x] A backend a kezdés/befejezés értékeket `Date.parse()` alapján validálja.
- [x] A meglévő `public/admin.html` Schedule UI nem a canonical kontraktust használja: `startAt` és `endAt` mezőket küld, miközben a backend `startsAt` és `endsAt` mezőket vár.
- [x] A legacy UI ráadásul `/api/admin/schedule/:id` URL-struktúrát használ, miközben a jelenlegi canonical route body-alapú `id` mezőt használ ugyanazon `/api/admin/schedule` végponton.
- [x] Ez magyarázza az `INVALID_SCHEDULE_ITEM` létrehozási hibát; a dátumválasztó önmagában nem bizonyult hibásnak.
- [x] Döntés: a legacy Schedule UI-t nem javítjuk vissza aktív rendszerként, mert a 40.69.9 szerint archivált réteg.
- [!] A live D1 read teszt csak akkor zárható, ha a canonical Schedule domainhez készül egy nem-legacy létrehozási útvonal / tesztadat, vagy a D1-ben kontrollált tesztrekord jön létre.

**40.69.12.B — LIVE LEZÁRÁS — 2026-09-22**
- [x] Canonical POST → D1 rekord létrehozás PASS.
- [x] Public read PASS.
- [x] `next` PASS.
- [x] Platform filter PASS.
- [x] Status filter PASS.
- [x] A legacy Schedule UI nem lett újraaktiválva.
- [x] Felhasználói tesztkapu lezárva.

**Következő egyetlen aktív pont:** **40.69.12.C — Editor preview renderer.**

**Következő aktív pont a kapu után:** 40.69.12.C — Editor preview renderer.
## 40.69.9 — CANONICAL PAGES / VISUAL EDITOR / SCHEDULE ARCHITEKTÚRA TELJES AUDIT — 2026-09-22

**Állapot:** [~] AUDIT FOLYAMATBAN — ebben a lépésben nincs kódmódosítás.

### Audit eredmény
- [x] A jelenlegi aktív Visual Editor a `public/editor-v2/` rendszer: közös state, command, schema, validation, canvas, property registry, responsive, rich-text, diagnostics és core tesztek.
- [x] `/admin/editor` közvetlenül az Editor v2 felületre nyit; nem a régi `public/editor/` rendszert használja.
- [x] A canonical oldal-életciklus: `/api/admin/pages` + `/api/admin/editor` + `editor_revisions` + draft/published snapshot + rollback/audit.
- [x] A régi `public/assets/system-page-editor.js` fix 9 rendszeroldalas modellt és külön `/api/admin/system-pages` GET/PUT rendszert használ; create/delete nincs.
- [x] A régi `public/assets/system-page-runtime.js` külön `system_page_content` adatmodellt renderel, tehát nem a canonical Page Modelt.
- [x] A repositoryban külön `public/editor/` legacy editor-kódbázis is van; ez nem lehet az új fejlesztések alapja.
- [x] `public/admin.html` legacy admin UI; tartalomkezelési API-szerződése eltér a canonical pages API-tól, ezért nem lehet a jövőbeli Visual Editor forrása.
- [x] Az Adásrend D1 CRUD backendje már működik; a 40.69.8 live create/update/delete teszt PASS.
- [x] Döntés: az Adásrend adat-domainje marad külön D1-ben, de a vizuális Adásrend oldal canonical `pages` + Editor v2 dokumentum lesz.
- [x] Döntés: nem készül külön Schedule Editor és nem marad fenn második Visual Editor.

### Hol van a weboldal szerkesztő a MASTER-ben?
A weboldal-szerkesztő **már elkészült alapként**: ez az Editor v2. A MASTER további editor-pontjai ennek a canonical rendszernek a folyamatos bővítései. Az Adásrend-készítő ennek egy domain-specifikus felhasználási rétege lesz, nem új szerkesztő.

### 40.69.9 — LEGACY ARCHITEKTÚRA ARCHIVÁLÁSA — [x] PASS

A teljes audit után a régi rendszer működési útvonalait leválasztottuk a canonical rendszerről.

- [x] `/admin` és `/admin.html` többé nem nyitja meg a legacy admin UI-t; authenticated felhasználót az `/admin/editor` canonical Editor v2-re irányít.
- [x] `/api/admin/system-pages` route-regisztráció megszüntetve.
- [x] `/api/public/system-pages` route-regisztráció megszüntetve.
- [x] `system-page-runtime.js` automatikus HTML-injektálása megszüntetve.
- [x] A régi Editor/Admin/System Page fájlokat nem töröltük véglegesen; dokumentált legacy archív rétegként megmaradnak visszaállítási lehetőséggel.
- [x] Archiválási dokumentum: `docs/ARCHIVE-LEGACY-LAYERS.md`.
- [x] A `system_page_content` D1 adatot ebben a lépésben nem töröltük; cleanup/migráció külön kapu lesz.
- [x] A canonical rendszer egyetlen aktív Visual Editorja továbbra is `public/editor-v2/`.

**Implementációs commitok:**
- `3a8c9afbe52429e84d2c2d7272215ae52e558b95` — legacy route/runtime leválasztás
- `c5ad2b870a11b394d07903ca1e35c4c9425f6bd5` — legacy archívum dokumentálása

**Fontos:** a régi fájlok fizikai törlése/migrációja nem része ennek a kapunak. Előbb az új canonical Schedule/Page rendszert kell felépíteni és validálni; utána külön cleanup kapuban lehet véglegesíteni a régi adatot/fájlokat.

### Következő egyetlen aktív pont
**40.69.10 — Canonical Schedule Builder szerződés:** az Adásrend D1 domain-adat és a canonical Pages + Editor v2 dokumentum közötti kapcsolat teljes auditja, majd az új builder implementációs terv. Kódmódosítás csak az audit lezárása után.


**40.69.7 lezárás:**
- [x] CI/typecheck/editor-core PASS.
- [x] Cloudflare deploy zöld.
- [x] Célzott live `page.update` + `audit_log` együttállás PASS.
- [x] MASTER-2.39.63-ban a 40.69.7 lezárása dokumentálva.

**40.69.8 audit szabály:** először csak teljes érintett kód- és adatfolyam-audit; kódmódosítás kizárólag bizonyított hiányosság esetén. A vizsgálat fókusza: page create/update/delete/rename, save/publish/unpublish/rollback, valamint minden további admin state mutation audit lefedettsége. Nem indítunk új UI- vagy platformfunkciót.

**Aktív munkasáv száma:** **1**

**Nem aktív:** PC/Desktop, Mobile/Touch, Rich Text, Group/Ungroup, Page CRUD, 40.68 és minden más régebbi vagy későbbi fejezet. Ezek csak történeti dokumentáció, lezárt tesztek vagy későbbi backlogok. A PC és Mobile nem külön fejlesztési sáv, hanem ugyanazon funkció tesztfelülete.

### 40.69.5.B — ROLLBACK LIVE SMOKE TEST — 2026-09-22

**Állapot:** [x] PASS — felhasználói élő teszt: **„Működik”**.

- [x] Revision előzmények panel betölt.
- [x] Korábbi revision kiválasztható és visszaállítható.
- [x] Rollback megerősítés működött.
- [x] A draft visszaállt a kiválasztott korábbi állapotra.
- [x] A rollback új revisionként jött létre.
- [x] Újratöltés után a visszaállított draft megmaradt.
- [x] A felhasználói live teszt eredménye: **Működik**.
- [x] A rollback nem tekintendő automatikus publishnak; a published snapshot külön tesztkapu.

**Következő egyetlen aktív tesztlépés:** published snapshot + unpublish regressziós teszt.

### 40.69.5.C — PUBLISHED SNAPSHOT REGRESSZIÓ: PRE-PUBLISH JAVÍTVA, POST-PUBLISH HIBA — 2026-09-22

**Állapot:** [~] BLOKKOLVA — felhasználói teszt alapján a módosított draft normál publikus oldalon már nem jelenik meg publikálás előtt, viszont publikálás után sem jelenik meg a publikus oldalon.

**Elvégzett audit:**
- [x] `src/routes/public/pages.ts`: normál publikus kérés többé nem szolgál ki automatikusan editor draftot; draft csak explicit, jogosított `?preview=1` esetén használható.
- [x] `src/routes/admin/editor.ts`: Publish ugyanabban a D1 batch-ben frissíti a `content_json`, `editor_revisions`, `published_content_json`, `published_revision_id` és `is_published` mezőket.
- [x] `public/assets/page-renderer.js`: normál `/p/<slug>` oldal `/api/public/pages?slug=...` végpontot hív `preview` nélkül, `cache: no-store` mellett.
- [x] A publikus route normál módban `WHERE is_published=1` feltételt használ és `published_content_json` snapshotból renderel.
- [ ] Meg kell határozni, miért nem látszik a frissen publikált snapshot a tényleges live publikus útvonalon.
- [ ] Következő egyetlen aktív lépés: live API/D1 állapot ellenőrzés ugyanazon pageId/slug mellett: `is_published`, `published_revision_id`, `published_content_json`, valamint `/api/public/pages?slug=...` válasz összevetése.
- [ ] Ezután csak a bizonyított gyökérok minimális javítása és újraépítés/deploy következhet.

**Fontos:** a pre-publish draft leak javítását nem tekintjük kész regressziónak, amíg a Publish → LIVE útvonal ugyanazon teszten nem igazolt.


### 40.69.5.C — PUBLISHED SNAPSHOT REGRESSZIÓ: PUBLISH UI GYÖKÉROK AZONOSÍTVA — 2026-09-22

**Állapot:** [~] BLOKKOLÓ GYÖKÉROK AZONOSÍTVA; KÓDJAVÍTÁS ELŐTT.

A live D1/API audit bizonyította:
- [x] is_published=1.
- [x] published_revision_id pontosan a LIVE revisionre mutat.
- [x] published_content_json byte-pontosan megegyezik a published revision document_json értékével.
- [x] A publikus API normál módban ezt a published snapshotot adja vissza.
- [x] v10 publikált dokumentum a korábbi, üres root állapot.
- [x] v11 draft már tartalmazza az új Section/Stack/Row node-hierarchiát.
- [x] A jelenlegi v11 mentés után a Publish UI nem indít új publish revisiont.

**Bizonyított kliens oldali gyökérok:**
A public/editor-v2/app.js syncPublishControls() függvénye a Publish gombot feltétel nélkül letiltja, ha az oldal már publikált: publish.disabled=published.
Ez azt jelenti, hogy ha egy már LIVE oldalon új draft módosítás történik, a jelenlegi UI nem engedi ugyanazt a módosított draftot újra publikálni. A szerveroldali save(true) útvonal viszont erre képes lenne.

**Következő egyetlen aktív lépés:**
1. csak a Publish UI állapotlogikáját javítjuk úgy, hogy már publikált, de dirty draft esetén a Publish/Re-publish művelet engedélyezett legyen;
2. ugyanazt a meglévő save(true) → POST /api/admin/editor útvonalat használjuk;
3. nem készül második publish state vagy API;
4. reread + CI/build + deploy;
5. élő teszt: v11 draft → Publish → új published revision → published_content_json = új revision → public API már az új node-hierarchiát adja.

**PC/Desktop live teszt:** továbbra is PENDING, nem indul.

### 40.69.5.D — REPUBLISH LIVE SMOKE TEST — 2026-09-22

**Állapot:** [x] PASS — felhasználói élő teszt: **„Működik”**.

- [x] Már publikált, de módosított draft esetén a Publish vezérlő újrapublikálható állapotba kerül.
- [x] A gomb felirata dirty állapotban **„Újrapublikálás”**.
- [x] A meglévő save(true) → POST /api/admin/editor útvonal maradt az egyetlen publish útvonal.
- [x] Nem került be második publish state vagy párhuzamos API.
- [x] A felhasználói live teszt eredménye: **Működik**.
- [x] A korábbi hibát okozó publish.disabled=published UI-logika javítva lett.
- [x] Javító commit: c3740fb910042ddab707212abe55eb291983a71d — fix: allow republish for dirty published drafts.

**40.69.5 regressziós kapu lezárása:** a rollback és az újrapublikálás felhasználói élő tesztje PASS. A PC/Desktop live teszt továbbra is PENDING és nem indul automatikusan.

**Következő egyetlen aktív lépés:** 40.69.6 teljes revision/persistence audit; csak audit alapján készülhet új kódmódosítás.


### 40.69.6 — REVISION PERSISTENCE TELJES AUDIT — 2026-09-22

**Állapot:** [x] AUDIT PASS — új kódmódosítás nem szükséges ebben a lépésben.

**Áttekintett fő útvonalak:**
- `src/routes/admin/editor.ts`: Save, Publish, Rollback, Unpublish, expectedVersion, revision numbering.
- `src/routes/admin/pages.ts`: page list revision source, metadata/slug revision, published linkage, page-create + initial revision batch.
- `src/routes/public/pages.ts`: normal public route kizárólag published snapshotból dolgozik; explicit preview külön auth-gated.
- `src/core/page-model.ts`: canonical `sanci-page-document` normalizálás.
- `src/core/editor-validation.ts`: Publish előtti hierarchy/Page Model validation.
- `migrations/0010_canonical_revision_contract.sql`: published revision linkage és meglévő snapshotok visszakötése.
- `public/editor-v2/app.js`: egyetlen `save(true)` publish útvonal és a republish UI állapot.
- `.github/workflows/editor-core-test.yml`: Node 24 + install + typecheck + editor core teszt.

**Audit eredmények:**
- [x] `pages.content_json` továbbra is a draft snapshot.
- [x] `pages.published_content_json` továbbra is a LIVE snapshot.
- [x] `pages.published_revision_id` a LIVE snapshot konkrét revisionjére mutat.
- [x] Save/Publish/rollback revision számozása az `editor_revisions` MAX(version) értékéhez igazodik.
- [x] `expectedVersion` védelem nincs megkerülve.
- [x] Rollback draft-only marad; nem publikál automatikusan.
- [x] Publish egy D1 batchben írja a draftot, revisiont és LIVE snapshotot.
- [x] Page create + initial revision egy D1 batch.
- [x] Normál public route nem szolgál ki draftot.
- [x] Republish nem hozott létre második publish-rendszert.
- [x] A vizsgált canonical state/persistence útvonalban nem találtunk olyan hibát, amely most új kódmódosítást indokolna.

**Megállapított következő audit-téma:** az üzleti state-módosítások és az `audit_log` írása jelenleg több helyen külön lépés. Például Publish/Save/rollback/unpublish után az audit insert külön történik. Ez nem rontotta el a mostani live regressziós tesztet, de hiba esetén az üzleti művelet és az audit esemény eltérhet.

**Következő egyetlen aktív lépés:** 40.69.7 — audit-log atomicity és persistence-boundary hardening célzott audit.


### 40.69.7 — AUDIT-LOG ATOMICITY HARDENING — 2026-09-22

**Állapot:** [x] PASS — implementálva, CI/typecheck/editor-core PASS, Cloudflare deploy zöld, célzott live audit PASS.

**Elvégzett módosítás:**
- [x] Létrejött a közös `src/core/audit.ts` `auditStatement()` helper.
- [x] Editor Save/Publish/Unpublish/Rollback audit statementek a state-módosítással azonos D1 batch-ben futnak.
- [x] Page create/delete/update audit statementek a megfelelő state-módosító batch részei.
- [x] Megszűnt a különálló `await audit(...)` persistence-lépés az érintett Editor/Page admin útvonalakon.
- [x] Nem készült második audit-rendszer.

**Módosító commitok:**
- `3e424605a5599f32f7e94f546c4eeaa3ad76e00f` — audit helper
- `e7389f87102227155f9b9998d9114c5a0f51ca48` — editor atomic audit
- `95fb08738c69b5c47710efd6fbd8ebb674005ed1` — page update atomic audit

**CI / typecheck / Editor Core teszt — 2026-09-22:**
- [x] CI zöld.
- [x] Typecheck PASS.
- [x] Editor Core Test PASS.
- [x] A 40.69.7 tesztkapu kódoldali/CI része lezárható.
- [x] Deploy ellenőrzés — a felhasználó visszaigazolta, hogy az utolsó Cloudflare állapot zöld.
- [x] Célzott live audit — az `uj-oldal` cím módosítása `Új oldal` → `Új oldal test` sikeresen létrejött a `pages` táblában, és ugyanahhoz a pageId-hoz `page.update` audit rekord jött létre.
- [x] Audit metadata ellenőrzés: `version=15`, `revisionId=924b38b0-8d7f-4fac-acbb-4696dc7e421e` rögzült az audit rekordban.
- [x] Az audit rekord időpontja közvetlenül a state-módosítás előtt/azzal összhangban jelent meg; a live smoke teszt bizonyította, hogy a canonical admin update útvonal az auditot is létrehozza.

**Live teszt eredmény:** PASS — a state-módosítás és a megfelelő `audit_log` esemény együtt igazolva.

**Következő egyetlen lépés:** 40.69.7 lezárva; a következő egyetlen aktív pont kijelölése a MASTER index alapján, külön audit után.

**Fontos:** a kódot a módosítás után újraolvastuk; a CI/typecheck/editor-core tesztkapu zöld. PC/Desktop live teszt továbbra is PENDING.


### Kötelező folytatási szabály
1. Csak a kék **EGYETLEN AKTÍV PONT** dolgozható fel.
2. Egy ponton belül is csak **egy következő lépés** lehet kijelölve.
3. A következő pontot csak akkor írjuk át aktívra, ha az előző pont implementációja + szükséges tesztje + user PASS + MASTER frissítése megtörtént.
4. Minden lépés után a MASTER tetején lévő indexet azonnal frissíteni kell.
5. Ha új funkció merül fel, először backlogba kerül; **nem nyithat második aktív sávot**.
6. PC/Desktop live teszt csak külön felhasználói kérésre indítható; ettől nem jön létre külön munkasáv. A korábban csak mobilon élőben ellenőrzött funkciók PC/Desktop tesztje későbbi visszatérő tesztkapu marad.
7. Új beszélgetés mindig ezt az indexet olvassa először. A folytatás automatikusan a kék aktív pontról indul.

### Új beszélgetés checkpoint
**„Folytassuk a Sanci9517 MASTER tervet. Először olvasd el a 00/A MASTER VÉGREHAJTÁSI INDEXET, és csak az ott megjelölt egyetlen aktív pontot folytasd. A régi fejezetek státuszait ne tekintsd aktív feladatnak.”**

---

# 01 — VÉGLEGES CÉLKÉP

## 01/A Publikus Sanci9517 platform
- prémium streamer/creator weboldal;
- magyar publikus felület;
- közös Sanci Brand design;
- desktop/tablet/mobile;
- Twitch, TikTok, YouTube, Discord;
- Home, Rólam, Adásrend, Twitch, YouTube, TikTok, VOD, Shorts, Közösség, Kapcsolat, Támogatás, Sponsor/Business, Press Kit;
- később Merch, Blog/News, Events, Community Hub és további oldalak;
- élő/offline állapot;
- következő stream countdown;
- dinamikus szerveroldali adatok;
- SEO, analytics, accessibility, performance.

## 01/B Admin/CMS
- biztonságos login/session;
- RBAC;
- dashboard;
- pages;
- Visual Editor;
- Layers/Navigator;
- Inspector;
- Components;
- Templates;
- Design System;
- Media/R2;
- Schedule;
- Social;
- VOD/Clips/Shorts;
- SEO;
- Analytics;
- Integrations;
- Settings;
- Audit;
- Draft/Preview/Publish;
- Versioning/Rollback;
- Backup/Restore;
- Import/Export;
- később AI/Automation.

## 01/C SANCI AI
Nem egyszerű chatbot. Hosszú távú, jogosultságokkal, action-validációval, preview-val, approval-lel, auditálással és rollbackkel működő platform:
- Editor AI;
- tartalomjavaslat;
- oldal- és komponensmódosítás;
- streamer-profil és memória;
- stream megfigyelés;
- beszéd/csend figyelése;
- chat/context elemzés;
- technikai problémajelzés;
- stream setup ellenőrzés;
- ötletadás;
- jó pillanatok felismerése;
- klip/Short előkészítés és később automatizálás;
- stream utáni elemzés;
- tanulási/értékelési ciklus;
- analytics/research/content intelligence.

---

# 02 — KANONIKUS ARCHITEKTÚRA

## 02/A Adatforrások
- D1 = strukturált tartalom/configuration elsődleges igazságforrás;
- R2 = média elsődleges tároló;
- KV = cache és nem kritikus gyors állapot;
- GitHub = forráskód + migráció + dokumentáció;
- Cloudflare Worker = web/API belépési pont;
- frontend = nem ír közvetlenül D1/R2/KV-be.

## 02/B Rétegek
`Public Renderer → Worker Router → API/Service → Domain/Data → D1/R2/KV`

`Admin UI → API → Service → Repository → storage`

`AI/Automation → Permission → Action → Validation → State → History/Version → Persistence → Verify → Audit`

## 02/C Page Model
`Site → Page → Root → Section → Container → Component/Element`

Node minimum:
- stable id;
- type;
- name;
- parentId;
- children/order;
- props/content;
- style/layout;
- responsive;
- visibility;
- locked;
- metadata;
- accessibility;
- dataBindings;
- interactions;
- validation state;
- capabilities;
- schema version.

A DOM nem source of truth. HTML import nem lehet az editor működésének feltétele.

## 02/D Stabil ID-k
siteId, pageId, sectionId, containerId, componentId, elementId, actionId, versionId, mediaId, scheduleId, auditId, assetId, templateId, tokenId, dataSourceId, automationId, taskId, agentId.

## 02/E State rétegek
Külön:
- persisted server state;
- published state;
- working/editor state;
- local recovery;
- UI-only state;
- history;
- preview;
- integration cache.
## 02/F Konfliktus/recovery
- revision/ETag/equivalent check;
- több tab érzékelés;
- konfliktus nem írhat csendben felül;
- reload/merge/overwrite megfelelő jogosultsággal;
- audit;
- autosave/recovery;
- save queue/retry/timeout;
- browser/tab crash recovery;
- recovery törlése sikeres mentés után.

## 02/G D1 canonicalization blocker
A jelenlegi Editor canonical documentje `sanci-page-document`, schemaVersion 1, miközben korábbi migrationben eltérő `sanci-document`/schemaVersion 2 örökség is található. Ezt nem workarounddal fedjük el: a végleges D1 Page Model canonicalizálás külön architekturális feladat és tesztkapu.

---

# 03 — TESZTELÉSI ÉS MINŐSÉGI KAPUK

Minden nagy funkció ellenőrzése:
1. cél;
2. adatmodell;
3. API;
4. jogosultság;
5. validation;
6. command/action;
7. state;
8. history;
9. save;
10. reload;
11. preview;
12. publish;
13. error handling;
14. recovery;
15. responsive;
16. accessibility;
17. performance;
18. AI compatibility;
19. rollback;
20. regression.

Tesztkategóriák:
- unit;
- integration;
- API;
- D1/R2/KV;
- E2E/browser;
- smoke/regression;
- visual regression;
- responsive;
- accessibility;
- security;
- performance;
- migration;
- backup/restore;
- concurrency;
- AI action validation/rollback;
- production deploy.

---

# 04 — ALAPRENDSZER / FOUNDATION

## 4.1 Canonical routing
- [x] `/` canonical renderer
- [x] `/p/<slug>` canonical renderer
- [x] legacy URL redirect alap
- [x] Worker routing
- [x] D1 published snapshot alap

## 4.2 Legacy archive
- [x] régi publikus HTML archiválva
- [x] `archive/pre-canonical-public-2026-09-16`
- [x] aktív renderer nem függ a legacy HTML-től
- [x] régi editor archive: `archive/pre-editor-rebuild-2026-09-16`

## 4.3 Foundation teljes újrateszt
- [x] `/`, `/p/home`, `/p/community` + canonical renderer
- [x] legacy redirectek
- [x] health/API
- [x] D1 pages
- [x] auth/session
- [x] GitHub branch/HEAD
- [x] Cloudflare deploy/build gate — felhasználói visszaigazolással
- [x] nincs véletlen törlés
- [x] renderer hibamentes

**04.3 állapot:** [x] TELJESEN LEZÁRVA — 2026-09-21.

---

# 05 — EDITOR CORE / STATE / COMMAND

## 5.1 Core
- [x] document creation
- [x] selection alap
- [x] element add/update/content
- [x] style/layout/responsive mutation
- [x] visibility/lock
- [x] delete/duplicate
- [x] hierarchy reparent/reorder
- [x] undo/redo
- [x] transaction/batch history
- [x] validation
- [x] unknown command corruption protection
- [x] E2: 12/12 core test
- [x] user E2 confirmation

## 5.2 Command API teljesítési szabály
Alap actionök:
`create, update, delete, duplicate, move, resize, reparent, reorder, group, ungroup, select, style.set, layout.set, responsive.set, content.set, visibility.set, lock.set, page.create/delete/rename/duplicate, component.*, template.*, media.attach/detach, save, preview, publish, rollback, restore`.

Minden mutáció validation + history + ahol szükséges audit + rollback kompatibilitással készüljön.

**Audit állapot:** a jelenlegi `commands.js` stabilan lefedi és teszteli az element CRUD/hierarchy/selection/style/responsive/content/lock, Rich Text, undo/redo és transaction/batch alapokat. A 5.2 teljes action-katalógusa viszont még nem teljes: különösen a `move`, `resize`, `group`, `ungroup`, page-level és component/template/media/persistence actionök további kanonikus Command réteget igényelnek. Ezeket nem szabad UI-specifikus kerülőútként megvalósítani.

## 5.3 — Command API coverage audit — LEZÁRVA
**Cél:** a 5.2-ben felsorolt action-katalógust összevetni a tényleges implementációval, tesztekkel és Page Model-lel, majd a hiányzó actionöket függőségi sorrendben, egyetlen kanonikus command-rendszerben megvalósítani.

Első aktív részfeladat: **`move` + `resize` Command szerződés és meglévő geometry útvonal auditja.**
Követelmények:
1. ne legyen második geometry state;
2. a meglévő `style.set` / responsive útvonal ne törjön;
3. desktop/tablet/mobile context legyen egyértelmű;
4. validation + history + undo/redo maradjon központi;
5. Canvas Engine továbbra is csak rendereljen;
6. a jelenlegi Geometry Inspector működése ne regresszáljon;
7. unit/integration teszt készüljön az actionökre és edge case-ekre;
8. user browser test csak a statikus/CI kapu után.

**Audit eredmény — 2026-09-21:**
- A jelenlegi geometry source of truth a Page Model node `style` + `responsive[device]`.
- A Canvas Engine csak feloldja és rendereli a `x/y/width/height` értékeket; nem mutál state-et.
- A Geometry Inspector jelenleg közvetlenül a kanonikus `responsive.set` commandot hívja X/Y/width/height módosítására.
- Külön `move` és `resize` command jelenleg nincs.
- Ez nem jelent második geometry rendszert, de a 5.2 action-katalógus és a tényleges Command API között coverage-hiány van.
- A `position.x` / `position.y` és `size.width` / `size.height` property-k már ugyanarra a responsive style adatra mutatnak.
- Jelenleg nincs külön canvas drag/resize interakciós adatfolyam az `app.js`-ben; ezért most nem szabad UI-szintű drag/resize kódot hozzáadni.
- Következtetés: a következő kódolási lépésben a `move` és `resize` legyen kanonikus command-alias/contract a meglévő responsive geometry útvonal fölött, ne új state és ne új renderer.

**Audit állapot:** [x] 05.3 audit kész, kódmódosítás nélkül.

**Korrekció a korábbi command-tervhez — 2026-09-21:** a `move` és `resize` külön commandként történő bevezetése nem indokolt. A teljes geometry útvonal már canonical `responsive.set` commandon működik, és a külön alias command csak párhuzamos mutation API-t hozna létre. A 5.2 action-katalógusban ezért a `move`/`resize` fogalmakat capabilityként kezeljük, nem kötelező külön command-névként.

**Command fejlesztési szabály:** minden új command csak akkor készülhet, ha valóban új domain-műveletet képvisel. Az implementáció sorrendje:
1. canonical adatmodell és határ meghatározása;
2. command contract (payload + validation + precondition + error);
3. egyetlen mutation útvonal a Page Modelhez;
4. history snapshot / transaction kompatibilitás;
5. rollback/error safety;
6. audit/persistence integráció, ha szerveroldali művelet;
7. unit/integration teszt;
8. CI;
9. csak ezután UI és browser teszt.

**Külön szabály:** page-level persistence commandok (`page.create/delete/rename/duplicate`, `save`, `publish`, `rollback`, `restore`) nem kezelhetők egyszerű node-mutationként. Ezeknél a D1 API a persistence boundary, az Editor Core history pedig csak a lokális dokumentumra vonatkozik. A szerveroldali művelet sikerét/hibáját külön kell kezelni.

**Következő hiányzó command-terület:** a jelenlegi aktív `page.delete` funkció lezárása után a 5.2 katalógusból a valóban új, kanonikus domain-műveletek auditja következik; elsőként `group/ungroup`, majd component/template/media/persistence területek.

---

# 06 — AKTUÁLIS EDITOR UI / INSPECTOR STABILIZÁLÁS

## 6.1 Geometry Inspector — kézi értékek
- [x] X
- [x] Y
- [x] width
- [x] height
- [x] position
- [x] responsive context használata
- [x] Command API-n át történő módosítás
- [x] Canvas Engine render
- [x] user browser test: **Működik**

## 6.2 Geometry Inspector presets
**Lezárt pont; nem ez az aktuális folytatási pont.**

Cél: a geometry kézi mezői mellett gyors, értelmes presetek legyenek, anélkül hogy más adatfolyam jönne létre.

### Width presetek
- Auto;
- Fill / 100%;
- Fit-content / Fit;
- gyakori fix méretek csak akkor, ha az adott elemnél értelmesek;
- Manual továbbra is elérhető.

### Height presetek
- Auto;
- Fit-content / Fit;
- gyakori fix méretek csak akkor, ha értelmesek;
- Manual továbbra is elérhető.

### Position presetek
- Static;
- Relative;
- Absolute;
- Fixed/Sticky csak akkor jelenjen meg, ha a jelenlegi layout-engine már biztonságosan támogatja;
- a szükséges X/Y/inset mezők a választott módtól függően jelenjenek meg.

### Kötelező technikai szabályok
- preset → ugyanaz a Command API;
- ugyanaz a Page Model;
- ugyanaz a responsive context;
- undo/redo működjön;
- reset/inheritance működjön;
- reload után megmaradjon;
- invalid preset ne okozzon dokumentum-korrupciót;
- Inspector registry felé illeszthető legyen;
- ne legyen második style state.

### Tesztkapu
1. desktop preset;
2. tablet preset;3. mobile preset;
4. manual → preset;
5. preset → manual;
6. preset → reset/inherit;
7. undo/redo;
8. reload;
9. canvas render;
10. invalid/edge case;
11. user confirmation.

**[x] User browser test: mind az 5 kötelező 6.2 teszt PASS; felhasználói visszaigazolás: „Mind az 5 jó”.**

---

# 07 — EDITOR SHELL ÉS CANVAS UX

## 7.1 Editor Shell — későbbi tesztkapuk, jelenleg NEM aktív
A 7.1 pont nem az aktuális folytatási pont. Az itt maradt feladatok későbbi tesztkapuk.
- [~] top toolbar

- [x] Elements panel — felhasználói tesztekkel lezárva
- [ ] Layers/Navigator — későbbi
- [ ] Canvas — későbbi
- [ ] Inspector — későbbi
- [ ] status/save bar — későbbi
- [x] panel open/close — felhasználói teszttel lezárva
- [x] collapse — felhasználói teszttel lezárva
- [x] panel width min/max — felhasználói teszttel lezárva
- [x] state persistence — UI-only localStorage; panel open/close, left tab és dock width visszaáll refresh után; user test: „Működik”
- [ ] mobile editor UX — későbbi
- [ ] egységes dark Sanci design — későbbi

## 7.2 Toolbar
- [ ] page name
- [ ] save status
- [ ] undo/redo
- [ ] preview
- [ ] publish preparation
- [ ] desktop/tablet/mobile
- [ ] zoom
- [ ] fit
- [ ] editor menu
- [ ] command palette később

## 7.3 Canvas
- [ ] centered workspace
- [ ] viewport frame
- [ ] grid
- [ ] pan
- [ ] zoom presets: 25/50/75/100/150/200 + Fit
- [ ] device preview
- [ ] scroll preservation
- [ ] empty state
- [ ] background
- [ ] selection outline
- [ ] hover/parent outline
- [ ] spacing visualizer
- [ ] ruler
- [ ] safe area
- [ ] guides
- [ ] snap
- [ ] snap strength
- [ ] breakpoint indicator
- [ ] focus selected
- [ ] preview overlay

---

# 08 — CANVAS ENGINE / HIERARCHY / MANIPULATION

## 8.1 Render mapping
- [x] Page Model → DOM alap
- [x] DOM node → stable element ID mapping
- [x] responsive style resolution alap
- [x] geometry style mapping

## 8.2 Selection
- [x] click alap
- [ ] hover
- [ ] selected outline
- [ ] parent highlight
- [~] multi-select — PC implementálva, browser/CI teszt pending; mobil/touch külön párhuzamos sáv
- [ ] keyboard navigation
- [ ] escape/parent navigation
- [~] tree/canvas sync — közös selection helper implementálva, teljes teszt pending

## 8.3 Drag/drop és manipulation
- [ ] drag
- [ ] drop zones
- [ ] invalid drop prevention
- [ ] reparent
- [ ] reorder
- [ ] resize handles
- [ ] move guides
- [ ] smart guides
- [ ] snap to grid
- [ ] snap to sibling/parent
- [ ] distance indicators
- [ ] alignment tools
- [ ] match width/height
- [ ] distribute

## 8.4 Layers/Navigator
- [ ] complete tree
- [ ] expand/collapse
- [ ] reorder/reparent
- [ ] hide/lock
- [ ] rename
- [ ] duplicate/delete
- [ ] search
- [ ] expand-to-selection
- [ ] breadcrumbs
- [ ] subtree rules

---

# 09 — ELEMENT LIBRARY

## 9.1 Basic
- [ ] Root
- [ ] Section
- [ ] Container/Box
- [ ] Div
- [ ] Stack
- [ ] Group
- [ ] Spacer
- [ ] Heading H1-H6
- [ ] Text/Paragraph
- [ ] Rich Text
- [ ] Link
- [ ] Button
- [ ] Icon
- [ ] Divider
- [ ] Badge/Tag
- [ ] Quote
- [ ] List

## 9.2 Layout
- [ ] Flex
- [ ] Grid
- [ ] Row
- [ ] Columns
- [ ] Panel
- [ ] Overlay
- [ ] Absolute
- [ ] Sticky
- [ ] responsive stack

## 9.3 Media
- [ ] Image
- [ ] Gallery
- [ ] Video
- [ ] Audio
- [ ] Embed
- [ ] iframe
- [ ] media placeholder
- [ ] lazy-loading metadata

## 9.4 Interactive
- [ ] Accordion
- [ ] Tabs
- [ ] Modal
- [ ] Tooltip
- [ ] Dropdown
- [ ] Carousel
- [ ] Form
- [ ] Input
- [ ] Select
- [ ] Checkbox
- [ ] Radio
- [ ] Textarea
- [ ] validation messages

## 9.5 Sanci blocks
- [ ] Twitch Live/Offline
- [ ] Twitch player
- [ ] Countdown
- [ ] Next Stream
- [ ] Schedule
- [ ] YouTube
- [ ] TikTok
- [ ] Discord
- [ ] VOD
- [ ] Shorts
- [ ] Community
- [ ] Support
- [ ] Stream Stats
- [ ] Game Card/List
- [ ] Social Links
- [ ] Sponsor
- [ ] Business Contact
- [ ] About Me
- [ ] Sanci Button

---

# 10 — INSPECTOR TELJES RENDSZER

A Geometry pont után az Inspector fokozatosan, szekciónként készül.

## 10.0 Inspector kapcsolat — történeti, lezárt tesztállapot
- [x] kijelölt elem adatai megjelennek az Inspectorban
- [x] szövegtartalom módosítása → Canvas frissül
- [x] X/Y pozíció módosítása
- [x] szélesség/magasság módosítása
- [x] geometry preset működése
- [x] Inspector módosítások visszakijelölés után megmaradnak
- [!] Inspectorból elem törlése jelenleg nem érhető el UI-gombbal
- [x] a kanonikus `element.delete` command már létezik és validált history-láncon működik

## 10.0.1 Inspector törlés UI — LEZÁRVA
Cél: a meglévő `element.delete` commandhoz biztonságos Inspector műveletet adni.

Követelmények:
- törlés csak kijelölt elemnél;
- root elem ne legyen törölhető;
- locked elem törlését a command réteg blokkolja;
- törlés után selection frissüljön;
- Canvas és Layers/Navigator állapota frissüljön;
- undo/redo működjön;
- dirty state és revision frissüljön;
- nincs második mutation/state rendszer;
- felhasználói teszt nélkül nem lesz [x].

## 10.0.2 Tesztkapu
**[~] Részleges felhasználói teszt: az alap törlés + Canvas/Layers + Undo működését a felhasználó visszaigazolta („Működik”). A teljes kapuhoz az alábbi edge-case tesztek még hátravannak.**

1. Inspectorban a törlés művelet látható.
2. Nem-root elem törlése működik.
3. Törlés után az elem eltűnik a Canvasról.
4. Kijelölés megszűnik vagy értelmes szomszédos kijelölés marad.
5. Layers/Navigator frissül.
6. Undo visszahozza.
7. Redo újra törli.8. Root törlése védett.
9. Locked elem törlése védett.
10. User confirmation.

## 10.1.0 — Rich Text inline formázás elvetése — 2026-09-21

**[D] VÉGLEGES DÖNTÉS:** a jelenlegi B/I inline formázási implementációt nem támogatjuk tovább és teljesen eltávolítottuk.

A korábbi B/I próbálkozások több runtime hibát és párhuzamos logikai útvonalat eredményeztek. Nem foltozzuk tovább és nem vezetünk be újabb párhuzamos Rich Text motort.

A jelenlegi támogatott Rich Text mag:
- canonical strukturált dokumentum;
- plain text szerkesztés;
- blokk típusok: paragraph, heading, quote, code;
- link adatok;
- canonical `richtext.content.set` command;
- validation + Page Model + History/Undo/Redo;
- egyetlen render/serialize útvonal.

A jelenlegi schema inline mark készlete üres. A B/I későbbi visszaépítése külön architekturális feladat és külön tesztkapu lesz.

**Fontos audit-megjegyzés:** a blokk-séma már ismeri a listákat, de a jelenlegi Rich Text renderer és Inspector UI még nem teljes listakezelésű. Ezt külön Content/Rich Text feladatként kezeljük, nem rejtett részfunkcióként.

## 10.1 Content
- [x] plain text
- [~] rich text — plain-text canonical szerkesztés és blokk/alap link kezelés megvan; B/I inline formázás elvetve és eltávolítva. Teljes lista/UI/haladó Rich Text funkciók még hátra.
- [ ] links
- [ ] media selection
- [ ] alt/title
- [ ] dynamic content

## 10.2 Layout
- [ ] display
- [ ] width/height
- [ ] min/max
- [ ] auto/fit/fill
- [ ] block/inline/stack
- [ ] flex
- [ ] grid
- [ ] alignment
- [ ] distribution
- [ ] wrap
- [ ] gap
- [ ] aspect ratio
- [ ] overflow

## 10.3 Spacing / box model
- [ ] margin all/sides
- [ ] padding all/sides
- [ ] gap
- [ ] linked/unlinked sides
- [ ] shorthand
- [ ] negative margin rules
- [ ] visual box model
- [ ] responsive spacing
- [ ] spacing presets

## 10.4 Position
- [x] position/X/Y alap
- [ ] top/right/bottom/left
- [ ] inset
- [ ] z-index
- [ ] containing block
- [ ] stacking context
- [ ] conflict validation
- [ ] position presets

## 10.5 Typography
- [ ] font family
- [ ] font size
- [ ] weight
- [ ] line-height
- [ ] letter spacing
- [ ] word spacing
- [ ] text transform
- [ ] decoration
- [ ] alignment
- [ ] text color
- [ ] typography presets/tokens
- [ ] responsive typography

## 10.6 Appearance
- [ ] background color
- [ ] gradient
- [ ] image background
- [ ] border
- [ ] radius
- [ ] shadow
- [ ] opacity
- [ ] filter
- [ ] blend
- [ ] appearance presets/tokens

## 10.7 Transform / Animation
- [ ] translate
- [ ] rotate
- [ ] scale
- [ ] skew
- [ ] transform origin
- [ ] transition
- [ ] animation
- [ ] keyframe model
- [ ] trigger
- [ ] reduced-motion compatibility

## 10.8 Interaction
- [ ] click
- [ ] hover
- [ ] focus
- [ ] active
- [ ] submit
- [ ] scroll
- [ ] load
- [ ] timer
- [ ] open/close
- [ ] navigate
- [ ] show/hide
- [ ] toggle
- [ ] state variants

## 10.9 Advanced Inspector UX
- [ ] central property registry used by UI
- [ ] property search
- [ ] reset
- [ ] inherited value indicator
- [ ] override indicator
- [ ] invalid indicator
- [ ] unit selector
- [ ] color picker
- [ ] token selector
- [ ] multi-selection editing
- [ ] Beginner/Advanced/Pro progressive disclosure
- [ ] context-sensitive property visibility

---

# 11 — RESPONSIVE ENGINE

- [x] desktop/tablet/mobile viewport model alap
- [x] responsive inheritance alap
- [x] per-device responsive state alap
- [ ] device presets
- [ ] custom breakpoints
- [ ] orientation
- [ ] min/max breakpoint constraints
- [ ] breakpoint management UI
- [ ] property-by-device editing
- [ ] visibility per device
- [ ] typography per device
- [ ] spacing per device
- [ ] layout per device
- [ ] responsive presets
- [ ] inheritance reset
- [ ] override indicator
- [ ] responsive validation
- [ ] visual breakpoint indicator

Inheritance default:
`mobile → tablet → desktop`, `tablet → desktop`, `desktop → base`.

---

# 12 — DESIGN SYSTEM / TOKENS / PRESETS

- [ ] color tokens
- [ ] typography tokens
- [ ] spacing tokens
- [ ] radius tokens
- [ ] shadow tokens
- [ ] breakpoint tokens
- [ ] animation tokens
- [ ] CSS variables
- [ ] Sanci brand tokens
- [ ] themes
- [ ] token override
- [ ] usage search
- [ ] global/local scope
- [ ] token validation
- [ ] preset registry
- [ ] preset versioning
- [ ] preset preview
- [ ] preset apply/reset

Presets mindenhol csak ott jelenjenek meg, ahol ténylegesen gyorsítják a szerkesztést; a manual control mindig megmaradjon.

---

# 13 — COMPONENTS / VARIANTS / TEMPLATES

- [ ] reusable component
- [ ] component schema
- [ ] component instance
- [ ] master/instance relationship
- [ ] local override
- [ ] variants
- [ ] state variants
- [ ] reusable sections
- [ ] header/footer
- [ ] cards
- [ ] CTA
- [ ] global component
- [ ] component permissions
- [ ] component validation
- [ ] dependency/usage tracking
- [ ] component versioning

Templates:
- [ ] blank
- [ ] streamer home
- [ ] schedule
- [ ] about
- [ ] contact
- [ ] community
- [ ] VOD
- [ ] support
- [ ] custom
- [ ] reusable page templates

---
# 14 — CLIPBOARD / IMPORT / EXPORT / KEYBOARD

- [ ] copy
- [ ] cut
- [ ] paste
- [ ] duplicate
- [ ] multi-copy
- [ ] cross-page paste
- [ ] paste structure
- [ ] paste style only
- [ ] JSON export
- [ ] JSON import
- [ ] schema validation import
- [ ] context menu
- [ ] keyboard shortcuts
- [ ] shortcut customization later
- [ ] command palette
- [ ] quick action search

---

# 15 — HISTORY / AUTOSAVE / RECOVERY / CONFLICT

## History
- [x] core undo/redo
- [ ] UI history panel
- [ ] grouped history
- [ ] drag/resize grouping
- [ ] typing grouping
- [ ] named versions
- [ ] restore
- [ ] history preview
- [ ] diff
- [ ] server-side versions
- [ ] history retention policy

## Autosave/recovery
- [ ] debounce
- [ ] save queue
- [ ] retry
- [ ] timeout
- [ ] dirty state
- [ ] local recovery
- [ ] crash recovery
- [ ] unsaved navigation protection
- [ ] browser close recovery

## Conflict- [ ] revision/ETag
- [ ] multi-tab detection
- [ ] conflict screen
- [ ] reload
- [ ] merge
- [ ] overwrite with permission
- [ ] conflict audit

---

# 16 — PAGE MANAGEMENT / D1 / CANONICALIZATION

## Page CRUD
- [ ] create
- [ ] rename
- [ ] edit
- [ ] duplicate
- [x] delete — Editor v2-ben implementálva és felhasználó által élőben tesztelve
- [ ] slug
- [ ] title
- [ ] metadata
- [ ] canonical
- [ ] status
- [ ] template
- [ ] permissions

## D1 canonical Page Model
- [ ] egyetlen canonical schema rögzítése
- [ ] régi `sanci-document` örökség feltérképezése
- [ ] migration mapping
- [ ] canonical write
- [ ] canonical read
- [ ] validation
- [ ] rollback
- [ ] legacy migration teszt
- [ ] D1 schema audit

---

# 17 — DRAFT / PREVIEW / PUBLISH / VERSION / ROLLBACK

- [ ] draft state
- [ ] preview state
- [ ] preview URL/token
- [ ] publish validation
- [ ] publish
- [ ] unpublish
- [ ] republish
- [ ] published snapshot
- [ ] version ID
- [ ] timestamp
- [ ] atomic publish
- [ ] rollback
- [ ] diff
- [ ] cache invalidation
- [ ] preview-only state
- [ ] publish audit

---

# 18 — REAL SANSI OLDALAK / MIGRÁCIÓ

Megőrzendő valódi oldalak:
- [ ] Home
- [ ] Twitch
- [ ] YouTube
- [ ] TikTok
- [ ] Menetrend
- [ ] VOD
- [ ] Közösség
- [ ] Rólam
- [ ] Kapcsolat
- [ ] Támogatás
- [ ] Shorts
- [ ] Sponsor/Business
- [ ] Press Kit
- [ ] további valódi Sanci oldalak

Migráció sorrendje oldalanként:
`eredeti backup → HTML/CSS audit → Page Model mapping → hierarchy → dynamic mapping → fallback ahol szükséges → D1 save → editor check → reload → preview → publish → public compare → responsive → user confirmation`.

Egyetlen valódi oldal sem törölhető/cserélhető véglegesen a lánc sikeres tesztje előtt.

Régi tesztoldalak csak a valódi oldalak biztonságos migrációja után:
- [ ] azonosítás
- [ ] backup/export ha szükséges
- [ ] törlés
- [ ] D1 ellenőrzés
- [ ] page-list ellenőrzés

---

# 19 — MEDIA / R2

- [ ] upload
- [ ] folders
- [ ] search
- [ ] filter
- [ ] preview
- [ ] metadata
- [ ] alt text
- [ ] crop
- [ ] resize
- [ ] replace
- [ ] archive/delete
- [ ] usage tracking
- [ ] unused media detection
- [ ] MIME validation
- [ ] file-size limits
- [ ] secure object keys
- [ ] image optimization
- [ ] video/audio
- [ ] clip/short assets
- [ ] cache policy

---

# 20 — DYNAMIC DATA / BINDINGS

- [ ] D1 binding
- [ ] site settings
- [ ] schedule
- [ ] Twitch
- [ ] YouTube
- [ ] TikTok
- [ ] Discord
- [ ] VOD
- [ ] collections
- [ ] API data source
- [ ] loading state
- [ ] empty state
- [ ] error state
- [ ] conditional rendering
- [ ] data transforms
- [ ] caching
- [ ] stale-data handling
- [ ] binding validation

---

# 21 — STREAMER INTEGRATIONS

## Twitch
- [ ] OAuth
- [ ] live/offline
- [ ] title
- [ ] game
- [ ] viewer statistics
- [ ] followers/subscribers where available
- [ ] VOD
- [ ] clips
- [ ] events/webhooks where applicable

## YouTube
- [ ] channel
- [ ] videos
- [ ] Shorts
- [ ] statistics where available
- [ ] API quota/error handling

## TikTok
- [ ] profile
- [ ] supported content integration
- [ ] API capability review
- [ ] rate limits/fallback

## Discord
- [ ] community link
- [ ] optional integration
- [ ] status where justified

Secrets remain Cloudflare Secrets; external APIs are normalized behind services.

---

# 22 — SCHEDULE / VOD / SHORTS / CONTENT ENGINE

- [ ] schedule CRUD
- [ ] recurring schedule
- [ ] timezone handling
- [ ] next-stream calculation
- [ ] countdown
- [ ] live state
- [ ] game/category
- [ ] stream type
- [ ] VOD ingestion
- [ ] VOD categorization
- [ ] search/filter
- [ ] Shorts management
- [ ] clips management
- [ ] content calendar
- [ ] platform-specific variants
- [ ] title/description/hashtag suggestions
- [ ] thumbnail brief
- [ ] publishing workflow
- [ ] performance feedback loop

---

# 23 — INTERACTIONS / ANIMATION

- [ ] event model
- [ ] click
- [ ] hover
- [ ] focus
- [ ] active
- [ ] submit
- [ ] scroll
- [ ] load
- [ ] timer
- [ ] open/close
- [ ] navigation
- [ ] show/hide
- [ ] toggle
- [ ] state machine
- [ ] transition
- [ ] animation timeline
- [ ] keyframes
- [ ] reduced-motion
- [ ] interaction validation
- [ ] performance safeguards

---

# 24 — ACCESSIBILITY

- [ ] semantic HTML
- [ ] heading hierarchy
- [ ] alt text
- [ ] labels
- [ ] ARIA
- [ ] keyboard navigation
- [ ] focus order
- [ ] focus visibility
- [ ] contrast warnings
- [ ] screen-reader metadata
- [ ] form validation accessibility
- [ ] editor accessibility checks
- [ ] public accessibility audit

---

# 25 — SEO

- [ ] title
- [ ] description
- [ ] canonical
- [ ] Open Graph
- [ ] X/Twitter card
- [ ] structured data
- [ ] sitemap
- [ ] robots
- [ ] per-page SEO
- [ ] SEO preview
- [ ] redirects
- [ ] broken-link detection

---

# 26 — ANALYTICS / INSIGHTS

- [ ] page views
- [ ] button clicks
- [ ] social clicks
- [ ] stream events
- [ ] conversion events
- [ ] privacy-aware analytics
- [ ] retention policy
- [ ] admin dashboard
- [ ] editor/content performance
- [ ] content performance
- [ ] stream performance
- [ ] anomaly detection later

---

# 27 — ADMIN PLATFORM

- [ ] dashboard
- [ ] navigation
- [ ] responsive admin
- [ ] diagnostics
- [ ] page list
- [ ] content management
- [ ] schedule
- [ ] socials
- [ ] VOD
- [ ] media
- [ ] settings
- [ ] SEO
- [ ] analytics
- [ ] integrations
- [ ] editor management
- [ ] preview
- [ ] recovery
- [ ] history
- [ ] permissions

---

# 28 — SECURITY / AUDIT / PERMISSIONS

- [ ] HttpOnly
- [ ] Secure cookie
- [ ] SameSite
- [ ] password hash
- [ ] CSRF
- [ ] rate limiting
- [ ] RBAC
- [ ] API authorization
- [ ] public/admin separation
- [ ] Cloudflare Secrets
- [ ] audit log
- [ ] input validation
- [ ] output validation
- [ ] file validation
- [ ] replay protection where applicable
- [ ] action permission `can()` checks
- [ ] AI permission boundary

---

# 29 — BACKUP / RESTORE / IMPORT / EXPORT

- [ ] full backup
- [ ] page backup
- [ ] revision backup
- [ ] media references
- [ ] restore validation
- [ ] rollback
- [ ] import/export JSON
- [ ] migration compatibility
- [ ] backup integrity check
- [ ] recovery drill

---

# 30 — PERFORMANCE / PRODUCTION

- [ ] bundle review
- [ ] lazy loading
- [ ] image optimization
- [ ] caching
- [ ] cache invalidation
- [ ] Core Web Vitals
- [ ] rendering performance
- [ ] large-page performance
- [ ] large-tree editor performance
- [ ] history memory limits
- [ ] autosave efficiency
- [ ] API latency monitoring
- [ ] production smoke test
- [ ] visual regression baseline

---

# 31 — AI EDITOR / AUTOMATION

AI ugyanazt az action rendszert használja, mint a kézi Editor.

Pipeline:
`Intent → Plan → Actions → Permission → Validation → Preview/Diff → Approval → Execute → Verify → Audit → Version`

- [ ] AI page operations
- [ ] AI element operations
- [ ] AI style/layout operations
- [ ] AI responsive operations
- [ ] AI content generation
- [ ] AI SEO assistance
- [ ] AI accessibility QA
- [ ] AI visual QA
- [ ] action permissions
- [ ] approval rules
- [ ] rollback
- [ ] audit
- [ ] rate/cost controls

---

# 32 — SANCI STREAM ASSISTANT / INTELLIGENCE

## Live stream intelligence
- [ ] live stream monitoring
- [ ] silence/speech detection
- [ ] chat activity analysis
- [ ] technical issue detection
- [ ] audio problem detection
- [ ] stream quality checks
- [ ] scene suggestions
- [ ] context-aware ideas
- [ ] interesting moment detection
- [ ] post-stream summary

## Content intelligence
- [ ] VOD analysis
- [ ] clip candidates
- [ ] Short candidates
- [ ] title/description suggestions
- [ ] platform variants
- [ ] thumbnail briefs
- [ ] publishing recommendations
- [ ] content performance analysis

## Streamer memory / learning
- [ ] streamer profile
- [ ] long-term memory
- [ ] preferences
- [ ] historical outcomes
- [ ] experiment tracking
- [ ] evaluation cycle
- [ ] feedback loop

---

# 33 — AUTOMATION PLATFORM

`Trigger → Condition → Action → Result → Verify → Audit`

- [ ] scheduled automations
- [ ] event automations
- [ ] content workflows
- [ ] media workflows
- [ ] stream workflows
- [ ] notification workflows
- [ ] retry policy
- [ ] idempotency
- [ ] failure handling
- [ ] permissions
- [ ] audit

Queues/Durable Objects csak akkor, ha valós háttérfeladat vagy realtime követelmény indokolja.

---

# 34 — FOLYAMATOS FUNKCIÓFELFEDEZÉS

Ez a szakasz **nem lezárható egyszer és mindenkorra**.

Minden jelentős editor/platform bővítés előtt ellenőrizni kell:
- modern visual builder minták;
- GrapesJS / Craft.js / Puck architekturális minták;
- új responsive/layout megoldások;
- accessibility;
- performance;
- reusable components;
- design systems;
- collaboration/conflict;
- backup/recovery;
- AI action safety;
- stream/content intelligence.

Új funkció esetén:
1. azonosítás;
2. cél és felhasználási eset;
3. függőségek;
4. Page Model/adatmodell;
5. Command/Action;
6. Inspector/Canvas/UI;
7. persistence;
8. teszt;
9. MASTER-be felvétel;
10. implementáció;
11. felhasználói validáció.

---

# 35 — AKTUÁLIS ÁLLAPOT ÉS FOLYTATÁSI SZERZŐDÉS

## Lezárt, felhasználó által ellenőrzött jelenlegi pontok
- [x] E2 Core command/state tesztkapu: 12/12 PASS.
- [x] Geometry Inspector X/Y/width/height/position kézi szerkesztése.
- [x] Geometry változások Command API → Page Model → Canvas Engine lánca.
- [x] Geometry browser teszt: felhasználó visszajelzése: **„Működik”**.
- [x] 6.2 Geometry Inspector presets: mind az 5 felhasználói teszt PASS.
- [x] Elements panel alapfunkciók és kijelölés tesztelve.
- [x] Shell state persistence: felhasználói teszt PASS.
- [x] Panel collapse/reopen: felhasználói teszt PASS.
- [x] Panel width min/max: felhasználói teszt PASS.
- [x] Inspector kapcsolat 8.1–8.6: felhasználói tesztek PASS.

## JELENLEGI AKTÍV MUNKASÁVOK — A MASTER EGYETLEN FOLYTATÁSI IGAZSÁGA

A korábbi, már lezárt Rich Text B/I és Elements-palette tesztpontok nem lehetnek aktív folytatási pontok. A jelenlegi MASTER állapotot a 40.34 és az alábbi két párhuzamos munkasáv határozza meg.

### A — PC/Desktop multi-select
- [x] canonical multi-select interaction implementáció
- [ ] teljes browser teszt
- [ ] Editor Core/CI kapu
- [ ] regresszióteszt
- [ ] felhasználói PASS

### B — Mobile/Touch multi-select
- [ ] teljes touch interaction audit
- [ ] long-press → multi-select mód
- [ ] további tap → add/remove
- [ ] látható multi-select mód és kijelölt elemszám
- [ ] Kész / Mégse működés
- [ ] Canvas + Layers közös selection
- [ ] touch edge case-ek: scroll vs long-press, accidental tap, locked/root, nested nodes
- [ ] mobile browser teszt- [ ] regresszió + felhasználói PASS

### Függőségi kapu
**Group/Ungroup implementáció csak az A és B multi-select kapu PASS állapota után indulhat.**

### Következő végrehajtási sorrend
1. A PC multi-select élő tesztje külön lezárható.
2. B mobil/touch audit és implementáció párhuzamosan haladhat.
3. Mindkét sáv PASS után Group/Ungroup contract → command → unit/integration → CI → browser.
4. Ezután a Command API következő valódi domain-gapjei: page lifecycle (rename/duplicate teljes Editor v2 integráció), component/template, media, persistence.
5. A roadmap többi [ ] pontja nem veszik el; a 40.x szakasz minden újonnan azonosított hiányt pontosít.

### 9.1.0 — Elements palette javítás — syntax/runtime előellenőrzés
A frissítés után a böngésző az `app.js` betöltésekor syntax error-t jelzett: `app.js?v=20260918-8:10:492`.

A teljes érintett `app.js`-t újra átnéztük. A hiba oka a frissen hozzáadott `ELEMENT_DESCRIPTIONS` objektum néhány idézőjel nélküli, szóközt vagy `/` jelet tartalmazó kulcsa volt (pl. `Rich Text`, `Social Links`, `Badge/Tag`, `Business Contact`, `About Me`, `Sanci Button`). Emellett a fájlban egy literal `\\n` került a `const groups` elé.

Javítás:
- az érintett leírás-kulcsok érvényes string kulcsokká lettek alakítva;
- a hibás literal sortörés normalizálva lett;
- csak az `app.js` módosult, a működési logika nem lett újraépítve.

Javító commit:
- app: `0536aedc45d3963bc7ebcf9f8d3581d2958755ca`
- app content SHA: `bb35e394cca4edb9f13ee2e3719f72c02bfb7855`

A user által jelzett hiba alapján az előző változat **nem tekinthető teszteltnek**. A jelenlegi változatnál először a böngészős betöltést és az Elements panel megjelenését kell ellenőrizni.

### 9.1.0 — Elements palette második syntax hiba javítva
A felhasználó újabb betöltési hibát jelzett: `app.js?v=20260918-8:10:1702`.

A teljes aktuális `app.js` 10. sorát újraellenőrizve a hiba oka az `ELEMENT_DESCRIPTIONS` objektumban maradt, szóközt tartalmazó, idézőjel nélküli kulcsok voltak, többek között `Élő állapot`, `Stream számláló`, `Játékkártya`, `Játéklista`, `Egyedi elem` és hasonló kulcsok. Ezek JavaScript objektumkulcsként így syntax error-t okoztak.
Javítás:
- minden érintett, szóközt tartalmazó kulcs érvényes string kulccsá alakítva;
- működési logika nem változott;
- app.js frissített tartalma visszaolvasva: a leírásobjektum szintaktikailag konzisztens.

Javító commit:
- app: `487cee39dd89e2eb1ece26304294dce49d64770b`
- app content SHA: `40f8180d727d4d6ca70b3614cb5644511f17043b`

A következő lépés előtt a böngészős betöltés és az Elements panel runtime ellenőrzése szükséges. A korábbi syntax hiba miatt a palette funkció még nem tekinthető felhasználó által lezártnak.

### Egyetlen aktuális teszt
1. frissítsd az editor oldalt teljes újratöltéssel;
2. ellenőrizd, hogy az `app.js` már nem ad syntax error-t;
3. nyisd meg az **Elemek** panelt: a kategóriafejlécek látszanak, alapból csukva;
4. nyiss ki egy kategóriát: az elemek jelenjenek meg;
5. az elemgombok mellett legyen kis **i** ikon;
6. az **i** megnyomása leírást mutasson, és ne adjon hozzá elemet;
7. az elemgomb továbbra is adjon hozzá elemet;
8. jelezd, hogy működik-e. **Más tesztre addig nem lépünk tovább.**


### 9.1.0 — Elements palette: üres lista javítása
A felhasználó jelezte, hogy az editor már betölt, de az Elemek listában nem jelentek meg elemek.

Újraellenőrzés alapján a palette renderelését robusztusabbá tettem:
- a meglévő `groups` típusértéket közvetlenül használja, nem csak a név alapján történő visszakeresést;
- hiányzó típus esetén továbbra is használható a `typeForElement()` fallback;
- az `#elementList` hiányát külön `SANCI-UI-E002` hibakóddal jelzi;
- ha egyetlen érvényes elem sem kerül a listába, `SANCI-UI-E003` diagnosztikai hibát ad;
- az elemek kategóriánként továbbra is csukva indulnak;
- az i súgó és az elem hozzáadása logikája változatlan.

Javító commit:
- app: `b02e05a5309cb4f7d1321f9655bfe1e8ba27f30a`
- content SHA: `570d586fd4d17f2d059749757f87737df6502689`

A következő egyetlen aktív pont továbbra is a runtime ellenőrzés.

### 9.1.0 — Rich Text elem hozzáadásának javítása

A felhasználói teszt során az Elements palette többi eleme hozzáadható volt, de a **Rich Text** elem nem. A teljes Command/Schema lánc ellenőrzése alapján a konkrét ok:

- az `element.add` generic `createNode()` útvonalon hozta létre a Rich Text node-ot;
- a Rich Text node így nem kapott `props.richText` canonical dokumentumot;
- a 10.1.2.2-ben bevezetett Rich Text validation ezt helyesen elutasította;
- tehát nem a palette típusa vagy a szülőválasztás volt hibás, hanem a Rich Text node létrehozása nem követte az új canonical adatmodellt.

Javítás:
- `commands.js`: az `element.add` Rich Text esetén automatikusan létrehozza a `createEmptyRichText()` canonical dokumentumot;
- a művelet továbbra is ugyanazon `Command → Validation → Page Model → History → Canvas → Persistence` láncot használja;
- a többi elem hozzáadási útvonala változatlan;
- editor cache frissítve.

Javító commitok:
- commands: `23faaf85a32cc8add77f4fc1158202c862850656`
- commands content SHA: `637f43440e6c036acce26aeb83ea7c61b40e2a50`
- cache/index: `a54aa07a29e4b7f7c6e880db04428a4bc8422aa1`
- index content SHA: `8c4e5217d666beadace0e29c3905282395d244f4`

Statikus visszaolvasás: PASS.
Felhasználói/runtime teszt még hátra.

### 9.1.0 — Elements palette „elem hozzáadása” — LEZÁRVA
**Felhasználói teszt:** PASS — a felhasználó visszajelzése: **„Működik”**.

Ellenőrzött:
- Elements kategóriák megjelenése;
- kategóriák csukott alapállapota;
- elemek hozzáadása;
- Rich Text hozzáadása;
- Rich Text automatikus canonical üres dokumentuma;
- elem kijelölése hozzáadás után.

A Rich Text hozzáadási hibát a `element.add` Command javításával oldottuk meg: Rich Text node létrehozásakor automatikusan létrejön a `createEmptyRichText()` dokumentum.

Kapcsolódó javító commitok:
- commands: `23faaf85a32cc8add77f4fc1158202c862850656`
- cache/index: `a54aa07a29e4b7f7c6e880db04428a4bc8422aa1`

**Státusz:** `[x]`.

### KÖVETKEZŐ EGYETLEN AKTÍV PONT — 10.1.2.2 Rich Text strukturált Command + Validation runtime teszt
Most már visszatérünk a Rich Text rendszer integrációs tesztjéhez. UI-t még nem építünk.

Tesztelendő sorrend:
1. létrehozott Rich Text node canonical modellje;
2. strukturált Rich Text tartalom beállítása;
3. valid modell elfogadása;
4. invalid modell elutasítása;
5. rollback;
6. Undo;
7. Redo;
8. mentés/reload;
9. Canvas render;
10. user confirmation.

**Más fejlesztési pontra addig nem lépünk tovább, amíg ez a tesztkapu nincs lezárva.**


### 9.1.2 — Diagnostics műveleti eredményellenőrző réteg — LEZÁRVA

Cél: a Diagnostics ne csak tényleges JavaScript/Command/API/UI hibákat jelezzen, hanem az olyan „csendes” hibákat is, amikor egy felhasználói művelet lefutónak tűnik, de a várt eredmény nem jön létre.

Alapelv:
- a Diagnostics továbbra is csak megfigyelő/ellenőrző réteg;
- nem hoz létre második state-, Page Model-, selection-, history- vagy command-rendszert;
- az ellenőrzés a meglévő Command → Validation → Page Model → History → Canvas → Persistence lánc eredményét vizsgálja;
- a hibák egyedi `SANCI-VERIFY-E...` kódot kapnak.

Első célzott művelet: **Elem hozzáadása**.

Implementáció:
- `diagnostics.verify()` ellenőrző primitive elkészült;
- az `element.add` művelet ellenőrzése bekötve;
- a létrejött node Page Model-helye és a Canvas-megjelenés ellenőrzése megtörténik;
- eltérés esetén `SANCI-VERIFY-E001/E002` kerül a Diagnosticsba;
- a megoldás nem vezet be második state-, selection-, history- vagy command-rendszert.

Implementációs commitok:
- diagnostics verification primitive: `b7549eeddacb9f91f805c178f0d17673f8168bf0`
- Elem hozzáadása eredményellenőrzés: `3750944f90e559640a3827fd93f76e5723701b39`

### Runtime teszt eredménye — PASS
A felhasználó normál elem hozzáadását ellenőrizte.

Ellenőrzött:
- az elem hozzáadása sikeresen lefutott;
- az elem megjelent a Canvason;
- az elem kijelölődött;
- a Diagnostics nem jelzett hibát: `✓ 0 hiba`.

**Felhasználói visszaigazolás:** „Jó”.

A normál `element.add` műveleti eredményellenőrzés így lezárható. A szándékosan hibás/hiányos eredmény szimulációja továbbra is későbbi verification-regressziós tesztként marad, nem blokkolja a következő Rich Text tesztkaput.

**Státusz:** [x].

**KÖVETKEZŐ ÉS EGYETLEN AKTÍV PONT:** **10.1.2.2 — Rich Text strukturált Command + Validation runtime/integrációs teszt**, pontosan onnan folytatva, ahol a Diagnostics kiegészítése előtt abbahagytuk. UI-t még nem építünk.

### 9.1.1 — Editor Diagnostics / automatikus hibakereső — LEZÁRVA
A felhasználó kérésére elkészült az Editor v2 első automatikus hibakereső rendszere.

Cél: ha az editorban JavaScript, Promise, Command, API vagy UI hiba történik, azonnal legyen látható egy egyedi hibakód és részletes technikai információ.

Architektúra:
- a Diagnostics csak megfigyelő/reporting réteg;
- nem hoz létre második Page Model-, selection-, history- vagy command-rendszert;
- az adatok átmeneti, böngészőben élő diagnostics listában vannak;
- a canonical editor state továbbra is változatlan marad.

Elkészült:
- `public/editor-v2/diagnostics.js`: strukturált hibarekordok, kódok, forrás, üzenet, fájl/sor/oszlop, technikai részletek;
- automatikus JavaScript runtime error és unhandled Promise rejection figyelés;
- látható `✓ 0 hiba` / `🔴 N hiba` jelző;
- részletes hibapanel;
- technikai részletek lenyitható nézetben;
- Másolás és Törlés művelet;
- Command hibák jelentése: `SANCI-CMD-E001`;
- API hibák jelentése: `SANCI-API-E001/E002`;
- UI hibák jelentése: `SANCI-UI-E001`;
- korai boot/module hibák továbbítása a diagnostics rendszerbe: `SANCI-BOOT-E001`;
- `boot.js` korai hibapuffert is használ, így az app modul elindulása előtti hibák sem vesznek el;
- diagnostics UI desktop és mobile nézetre is kapott saját CSS-t;
- app/index cache verzió frissítve.

Commitok:
- diagnostics: `2106b7f8d0a2b386bc1bdd519c63db3feb6b2eca`
- boot: `edf97107b27b7968092ed6c08f4307500d318b20`
- app: `f533d718138da5f65dd86b12427cfb88b2504b4e`
- CSS: `70833b8e46b8f19bb0585eebad06d6e384fde8d5`
- cache/index: `bbfc000aaab310db1596f07232266604400159b1`

Statikus visszaolvasás: PASS.
- diagnostics modul: PASS;
- boot error bridge: PASS;
- app Command/API/UI diagnostics bekötés: PASS;
- diagnostics CSS: PASS;
- app cache: PASS.

Runtime teszt: PASS. A felhasználó visszaigazolta a működést.

**Felhasználói/runtime teszt eredménye:** PASS.
- `✓ 0 hiba` állapot megjelenik;
- a diagnosztikai panel megnyitható;
- a kontrollált teszthiba `SANCI-TEST-E001` hibakóddal megjelent;
- a hibaszámláló `🔴 1 hiba` állapotra váltott;

**Egyetlen aktuális folytatási pont:** 04.3 — Foundation további ellenőrzése: véletlen törlés elleni ellenőrzés + renderer hibamentesség, majd a teljes 04.3 kapu lezárása vagy a talált hiba javítása.

## 40.24 — Foundation teljes újrateszt: véletlen törlés + renderer hibamentesség — 2026-09-21

**Állapot:** [x] PASS — felhasználói élő teszttel lezárva.

A 04.3 Foundation teljes újrateszt utolsó ellenőrzési pontja lezárva.

Ellenőrzött:
1. locked elem törlésének védelme;
2. normál elem törlése;
3. root elem törlésének védelme;
4. canonical `/` renderer hibamentes működése;
5. canonical `/p/home` renderer hibamentes működése;
6. canonical `/p/community` renderer hibamentes működése;
7. Diagnostics / renderer ellenőrzés.

**Felhasználói visszaigazolás:** „Ezek jók”.

A teljes 04.3 Foundation újrateszt lezárható: routing, legacy redirectek, Worker health, D1, public pages, auth/session, GitHub/Cloudflare build-deploy kapu, törlésvédelem és canonical renderer ellenőrzések PASS állapotban vannak. Új kódmódosítás nem történt.

**Egyetlen aktuális folytatási pont:** 05.3 — `move` + `resize` audit lezárva; a következő lépés csak a teljes 5.2 action-katalógus következő valóban hiányzó elemének auditja, kódolás előtt.


## 40.25 — `move` + `resize` geometry audit korrekció — 2026-09-21

**Állapot:** [x] AUDIT PASS — nincs szükség új geometry commandra.

A felhasználói visszajelzés alapján tisztáztuk, hogy az Editor v2 jelenleg ténylegesen biztosítja:
- X pozíció módosítását;
- Y pozíció módosítását;
- szélesség módosítását;
- magasság módosítását;
- responsive desktop/tablet/mobile környezetet;
- meglévő Canvas viewport méretpreseteket.

A teljes érintett kód auditja ezt megerősítette:
1. A Geometry Inspector X/Y/width/height módosításai a meglévő `responsive.set` Command API-n keresztül írják a Page Model `responsive[device]` állapotát.
2. A `canvas-engine.js` ugyanebből a Page Model + responsive állapotból számolja és rendereli a geometriát.
3. A `property-registry.js` az X/Y/width/height tulajdonságokat responsive propertyként kezeli.
4. Nincs második geometry state, nincs párhuzamos `move` vagy `resize` renderer/mutációs rendszer.
5. Az Editor jelenlegi kódjában nincs külön canvas drag/resize interaction path; a tényleges geometry szerkesztés jelenleg az Inspectorból történik.
6. A `move` és `resize` külön Command névként való bevezetése önmagában nem adna új felhasználói funkciót, viszont párhuzamos command-logikát hozna létre.

**Döntés:** nem építünk csak a Command-katalógus miatt mesterséges `move`/`resize` wrapper commandokat. A meglévő geometry útvonal marad a canonical megoldás.

**Fontos pontosítás:** a jelenlegi `sizes={desktop:1440, tablet:768, mobile:390}` a Canvas viewport preseteket jelenti; ez külön fogalom az elem X/Y/width/height szerkesztésétől. Az audit során külön elem-méret preset commandot nem találtunk.

**Kódmódosítás:** nem történt.

**Következő egyetlen aktív pont:** az 5.2 Command API katalógus következő valóban hiányzó actionjének teljes auditja. Nem vezetünk be új commandot addig, amíg a meglévő funkció nem bizonyul ténylegesen elégtelennek.


## 40.26 — Command API következő hiányzó terület: Page lifecycle audit — 2026-09-21

**Állapot:** [~] AUDIT FOLYAMATBAN — kódmódosítás még nem történt.

A teljes következő action-terület vizsgálata alapján:
- `page.create` funkcióként már létezik az Editor v2 UI-ban és az `/api/admin/pages` POST API-ban;
- `page.delete` szerveroldali API-műveletként már létezik, utolsó oldal törlését védi és audit logot ír;
- `page.rename` szerveroldali PATCH API-műveletként már létezik és audit logot ír;
- `page.duplicate` jelenleg nem került elő sem az Editor v2 command engine-ben, sem az admin pages API-ban;
- az Editor v2 `commands.js` jelenleg nem tartalmaz `page.*` commandokat;
- a page létrehozása jelenleg közvetlen API-hívással történik az `app.js`-ből, nem a központi command engine-en keresztül.

**Fontos döntés:** nem kezdünk azonnal `page.*` commandok építésébe. Először azt kell meghatározni, hogy a page lifecycle commandoknak milyen canonical határa legyen az Editor lokális Page Modelje, a D1 persistence API és a history/undo rendszer között. Különösen a törlés és duplikálás esetén nem szabad olyan lokális history-t készíteni, amely nincs összhangban a szerveroldali perzisztenciával.

**Kódmódosítás:** nem történt.

**Következő egyetlen aktív pont:** `page.create/delete/rename/duplicate` adatfolyam és history/persistence szerződésének teljes auditja.


## 40.27 — Page lifecycle teljes kód-audit és MASTER-korrekció — 2026-09-21

**Állapot:** [x] AUDIT PASS — a page létrehozás meglévő funkció; a valódi Editor v2 hiány a page törlése.

A releváns teljes adatfolyamot összevetettük: Editor v2 `app.js` → Editor Core → admin pages API → D1 → Page Model → history/persistence, valamint a jelenlegi admin tartalomkezelő felületet.

### Megállapítások
- **Oldal létrehozás:** működő Editor v2 funkció. Az `app.js` `createNew()` canonical Editor v2 Page Model dokumentumot készít és POST-olja az `/api/admin/pages` endpointot.
- **Oldal törlés:** az Editor v2 oldallistájában jelenleg nincs törlés gomb/művelet. Ez a tényleges felhasználói hiány.
- **Szerveroldali törlés:** az `/api/admin/pages` route már tartalmaz DELETE kezelést, body-ban `id` alapján, és védi az utolsó oldalt. Audit logot is ír.
- **Page rename:** a backendben már van PATCH alapú névváltoztatás, de az Editor v2 jelenlegi page-list UI-ja nem használja.
- **Page duplicate:** nincs jelenlegi Editor Core/API/UI megoldás; ezt most nem építjük be, mert a felhasználó konkrét hiánya a törlés.
- **Editor history:** a jelenlegi `history.undo/redo` kizárólag az aktuális Page Model dokumentum snapshotjait kezeli. D1-oldal törlését nem szabad úgy hozzáadni, mintha az egyszerű node-művelet lenne.
- **Admin legacy/content UI eltérés:** a `public/admin.html` jelenlegi REST-hívásai (`/api/admin/pages/:id`, `PUT`, `content`, `published`) nem egyeznek a jelenlegi `src/routes/admin/pages.ts` szerződésével (`DELETE` body-id, `PATCH` title, POST canonical document). Ezt külön technikai adósságként rögzítjük; nem keverjük össze az Editor v2 page-delete implementációval.

### Következtetés
A MASTER korábbi `page.create/delete/rename/duplicate` megfogalmazása túl tág volt. A jelenlegi fejlesztési feladatot a tényleges felhasználói hiányra szűkítjük: **Editor v2-ben legyen biztonságos, szerveroldalilag perzisztált oldal-törlés, utolsó oldal védelemmel, sikeres törlés után lista/állapot frissítéssel és hibakezeléssel.**

**Kódmódosítás ebben az auditlépésben:** nem történt.

**Következő egyetlen aktív pont:** `page.delete` Editor v2 implementáció → unit/integration teszt → GitHub CI → élő browser teszt → MASTER lezárás.


## 40.28 — Command API fejlesztési szabályok és sorrend összehangolása — 2026-09-21

**Állapot:** [x] AUDIT / TERV PASS — kódmódosítás még nem történt.

A 05.2/05.3 Command API tervet összevetettük a tényleges `commands.js`, Page Model, history, responsive geometry és tesztstruktúrával. A tervet korrigáltuk, hogy ne követeljen mesterséges `move`/`resize` commandokat, miközben a funkciók már működnek a canonical `responsive.set` útvonalon.

### Kötelező command-fejlesztési lánc
- contract → validation/precondition → canonical Page Model mutation → history/transaction → rollback/error safety → szükség esetén D1/audit persistence → unit/integration test → CI → UI/browser test.

### Canonical határok
- **Element command:** lokális Page Model mutation, központi history-val.
- **Page lifecycle command:** szerveroldali D1 persistence boundary; nem szabad egyszerű node historyként kezelni.
- **Canvas:** csak renderel, nem kap külön mutation state-et.
- **Inspector/UI:** commandot hív, nem közvetlenül módosítja a Page Modelt.

### Jelenlegi command coverage
Már stabil: element add/update/content, richtext content, style, responsive, visibility, lock, duplicate/delete, hierarchy reparent/reorder, selection, undo/redo, transaction/batch.
Még valódi domain-gap: group/ungroup, component/template/media műveletek és page lifecycle/persistence műveletek teljes Editor v2 integrációja.

**Következő egyetlen aktív kódpont továbbra is:** `page.delete` Editor v2 bekötése a már meglévő backend DELETE API-ra, majd annak tesztkapuja. Ezután folytatjuk a command-katalógust függőségi sorrendben.


## 40.29 — Editor v2 Page Delete implementáció — 2026-09-21

**Állapot:** [x] PASS — felhasználói élő böngészős teszttel lezárva.

A 40.28 szerinti következő egyetlen aktív pont, az Editor v2 biztonságos oldal-törlésének bekötése elkészült.

### Implementáció
- Az Editor v2 **Oldalak** listájában minden oldal kapott külön törlés gombot.
- A törlés külön gomb, nem a teljes oldalsor kattintása, így nem ütközik az oldal kiválasztásával.
- Törlés előtt egyértelmű böngészős megerősítés jelenik meg.
- A UI a már meglévő canonical backend szerződést használja: `DELETE /api/admin/pages` + `{id}` body.
- A backend meglévő utolsó-oldal védelme változatlan maradt; az Editor nem hozott létre párhuzamos törlési szabályt.
- Sikeres törlés után az oldallista újratöltődik.
- Ha az aktuális oldal törlődött, az Editor automatikusan kiválaszt egy megmaradt oldalt.
- Ha nem az aktuális oldal törlődött, az aktuális Editor state megmarad.
- API hiba esetén a meglévő Diagnostics/API hibakezelési útvonal fut.
- A page lifecycle törlés nem került bele a node-level `history.undo/redo` rendszerbe; a D1 persistence marad a page lifecycle canonical határa.

### Kódmódosítások
- `public/editor-v2/app.js` — `deletePage()` + oldallistáska törlésvezérlő + sikeres törlés utáni állapotkezelés.
  - commit: `26c35cc32e6077c6b78fac0975fd1a3a657f3ce1`
- `public/editor-v2/editor.css` — oldal törlés gomb és oldalsor layout.
  - commit: `516f1ce8b2040d5653d4993801fa1669ce70512d`

**Fontos:** backend `src/routes/admin/pages.ts` nem módosult, mert a szükséges DELETE API már canonical és működő volt.

### Következő egyetlen aktív tesztpont
1. Editor teljes újratöltése.
2. Oldalak panel megnyitása.
3. Ellenőrizni, hogy minden oldalnál látható a `×` törlés gomb.
4. Nem aktuális oldal törlése → lista frissül, aktuális oldal marad.
5. Aktuális oldal törlése → automatikusan másik oldal töltődik be.
6. Törlés megszakítása → semmi nem törlődik.
7. Utolsó oldal törlésének próbája → backend elutasítja, oldal megmarad.
8. Diagnostics → 0 hiba normál esetben.
9. Ezután GitHub CI ellenőrzés, majd MASTER lezárás.


## 40.30 — Editor v2 Page Delete élő teszt PASS — 2026-09-21

**Állapot:** [x] PASS — felhasználói visszaigazolással lezárva.

A 40.29-ben elkészült oldal-törlés teljes élő böngészős tesztje a felhasználó visszajelzése alapján működik.

Ellenőrzött terület: oldal törlés UI, megerősítés, lista frissülés, aktuális oldal kezelése, utolsó oldal védelme és hibamentes működés.

**Következő egyetlen aktív pont:** a Command API következő valódi domain-hiánya, az **Editor v2 group / ungroup** teljes kód-auditja és szerződésének megtervezése; csak az audit után következhet kódmódosítás.


## 40.36 — PC/DESKTOP MULTI-SELECT TESZT ELŐAUDIT — 2026-09-21

**Állapot:** [x] KÓDAUDIT PASS — új kódmódosítás nélkül; a tényleges browser teszt a következő felhasználói tesztkapu.

Ellenőrizve a jelenlegi `app.js`, `state.js`, `commands.js`, `core.test.js` és Editor Core workflow alapján:
- [x] egyetlen közös `selectNodeInteraction()` kezeli a Canvas + Layers kijelölést;
- [x] normál kattintás → egyetlen kijelölés;
- [x] Ctrl/Cmd + kattintás → add/remove toggle;
- [x] Shift + kattintás → azonos parent alatti determinisztikus sibling-range;
- [x] root elem → mindig egyetlen kijelölés;
- [x] eltérő parent esetén a Shift fallback egyetlen célpont kijelölés;
- [x] `state.selection.ids` + `primaryId` marad az egyetlen canonical selection state;
- [x] Canvas és Layers ugyanazt a selection helper-t használja;
- [x] üres Canvas-kattintás továbbra is selection clear;
- [x] Inspector több kijelölt elem esetén nem mutat hamis „közös” értéket: jelenleg az első kijelölt node adatait használja — ezt későbbi explicit multi-edit UX pontként kell kezelni;
- [x] Editor Core workflow Node 24-et használ és a core tesztparancsot futtatja;
- [ ] browser: normál kattintás;
- [ ] browser: Ctrl/Cmd toggle add;
- [ ] browser: Ctrl/Cmd toggle remove;
- [ ] browser: Shift range előre;
- [ ] browser: Shift range visszafelé;
- [ ] browser: Canvas ↔ Layers szinkron;
- [ ] browser: selection visuals;
- [ ] browser: root/locked edge case;
- [ ] browser: undo/redo regresszió;
- [ ] browser: diagnostics 0 hiba;
- [ ] user PASS.

**Következő teszt:** PC browser multi-select élő teszt. Group/Ungroup továbbra is blokkolva marad mindaddig, amíg a PC és mobil multi-select kapu egyaránt PASS.

## 40.35 — TELJES MASTER HIÁNYOSSÁGI AUDIT — 2026-09-21

**Állapot:** [x] AUDIT PASS — a MASTER szerkezete átvizsgálva; státusz- és lefedettségi pontosítások rögzítve, azonosított architekturális hiányterületek felvéve.

### 1. Státuszkonzisztencia
- A 35. fejezet korábbi Rich Text B/I aktív pontja elavult volt; lecserélve a tényleges 40.34-es PC + mobil multi-select munkasávokra.
- A 05.3 korábbi „AKTÍV” jelölése lezártra korrigálva.
- A 08.2 multi-select státusza a tényleges implementációhoz igazítva: [~].
- A Page CRUD törlés státusza a tényleges Editor v2 + élő teszt állapothoz igazítva.

## 40.69.10 — Canonical Schedule Builder contract audit — 2026-09-22

**Állapot:** [x] AUDIT PASS — kódmódosítás nem történt.

A teljes releváns Schedule → Page Model → Editor v2 → public render adatfolyamot auditáltuk a 40.69.9 legacy rendszer-archiválás után.

### Canonical határ rögzítve

A Schedule két külön, de összekapcsolt réteg marad:

1. **Schedule domain data — D1**
   - a `schedule_items` tábla tartalmazza a tényleges stream eseményadatot;
   - mezők: id, title, platform, startsAt, endsAt, status, url, notes;
   - az admin Schedule API már működő POST/PUT/DELETE/GET CRUD;
   - létrehozás, módosítás és törlés canonical `auditStatement()` + D1 batch útvonalon történik;
   - ez a domain adat, nem Editor-vászon state.

2. **Schedule page — canonical Pages + Editor v2**
   - a menetrend oldal egy normál canonical `pages` rekord;
   - tartalma `sanci-page-document`, schemaVersion 1, Editor v2 Page Model;
   - a vizuális elrendezés, stílus, responsive állapot és komponenshierarchia a Page Model része;
   - draft/live revision, preview, publish, rollback és audit ugyanazt a canonical pages/editor lifecycle-t használja;
   - nem készül külön Schedule Editor és nem készül második Page Model.

### Kritikus audit-megállapítás

Az Editor v2 schema már tartalmazza a `schedule` node típust, de a jelenlegi editor command/schema rétegben nincs még kész, canonical Schedule-domain binding/rendering szerződés.

A jelenlegi `src/routes/public/schedule.ts` külön domain API-t ad vissza, miközben a canonical public Page útvonal a `pages.published_content_json` snapshotból renderelhető Page Modelt szolgáltatja.

Ezért **nem** kötjük a Schedule node-ot közvetlenül egy konkrét HTML oldalhoz, és **nem** másoljuk be a schedule_items adatokat a Page Model snapshotba. A Page Model csak a Schedule blokk konfigurációját és megjelenítési struktúráját tárolja; az aktuális eseményadat runtime-ban a Schedule domain API-ból érkezik.

### Tervezett canonical Schedule node szerződés

A következő implementációs kapu előtt rögzítendő minimum:

- node type: `schedule`;
- stabil domain azonosítás: a Schedule blokk konfigurációja ne tartalmazzon másolatot az eseményekről;
- konfigurációs mezők: megjelenítési mód, darabszám, státuszszűrés, platformszűrés, sorrend és szükség esetén cím/üres állapot;
- runtime adatforrás: canonical public Schedule API;
- editor preview: determinisztikus minta/preview adat vagy ugyanazon read-only domain adatforrás, de soha nem írható közvetlenül a Page Modelből;
- publish: csak a Page Model konfigurációja kerül a published revisionbe;
- schedule item CRUD: továbbra is D1 domain művelet, saját audit-tal;
- oldal publish/rollback: kizárólag a Page Model/revision lifecycle-t kezeli;
- Schedule item változás ne hozzon létre automatikusan Page revisiont, ha csak domain adat változott;
- Page design változás ne írja át a Schedule domain rekordokat.

### Audit eredmény

- [x] `schedule_items` domain tábla és index létezik.
- [x] Admin Schedule CRUD létezik és auditált.
- [x] Public Schedule read API létezik.
- [x] Canonical Pages + Editor v2 lifecycle létezik.
- [x] Editor v2-ben a `schedule` node type már definiált.
- [ ] Schedule node runtime renderer/binding contract még nincs lezárva.
- [ ] Schedule Inspector konfiguráció még nincs lezárva.
- [ ] Schedule preview renderer még nincs lezárva.
- [ ] Schedule node → public renderer integráció még nincs implementálva.
- [ ] Élő Schedule Builder teszt még nincs.

### Döntés

A régi System Page / `system_page_content` útvonalhoz nem térünk vissza. A következő kódpont kizárólag a **canonical Schedule node contract + renderer/binding terv** kidolgozása, majd ennek unit/integration tesztje. Csak ezután jöhet a Schedule Builder UI.

**Következő egyetlen aktív pont:** **40.69.11 — Schedule node contract és runtime binding teljes audit/tervezés**, kódmódosítás nélkül.

## 40.69.11 — Schedule node contract + runtime binding audit/terv — 2026-09-22

**Állapot:** [x] AUDIT/TERV PASS — kódmódosítás még nem történt.

A Schedule node jelenlegi állapotát összevetettük az Editor v2 Page Modellel és a D1 Schedule domain API-val.

### Megállapítások

- A `schedule` node type már része a canonical `NODE_TYPES` listának.
- A node alapból rendelkezik `props`, `style`, `responsive`, `dataBindings`, `metadata` mezőkkel.
- A Schedule node jelenleg nincs leaf-ként definiálva, ezért önálló blokk lehet, de nincs még specializált domain-logikája.
- A Page Model validáció jelenleg általános; Schedule-specifikus validáció nincs.
- Az admin Schedule API és public Schedule API már működik.
- A public API jelenleg maximum 50, nem cancelled elemet ad vissza `starts_at ASC` sorrendben.
- A domain API a Schedule események forrása; a Page Model nem tárolhatja ezeket az eseményeket.

### Canonical Schedule node contract v1

A Schedule node `props.schedule` alatt kizárólag konfigurációt tárol:

```text
props.schedule = {
  version: 1,
  mode: "upcoming" | "all" | "next",
  limit: number,
  statuses: string[],
  platforms: string[],
  order: "asc" | "desc",
  showTitle: boolean,
  showPlatform: boolean,
  showTime: boolean,
  showEndTime: boolean,
  showStatus: boolean,
  showNotes: boolean,
  showLink: boolean,
  emptyText: string
}
```

Alapértelmezett cél: `mode=upcoming`, `limit=10`, `statuses=["scheduled","live"]`, `platforms=[]`, `order="asc"`.

**Fontos:** eseménylista vagy egyedi `schedule_item` rekordok nem kerülnek a Page Modelbe.

### Binding contract

A runtime binding egyetlen canonical domainforrásra mutat:

```text
dataBindings = {
  schedule: {
    source: "schedule_items",
    version: 1
  }
}
```

A binding nem tartalmaz URL-t, auth tokent vagy konkrét eseményadatot. A public runtime saját belső API-rétegen keresztül olvassa a Schedule domain adatot.

### Preview contract

Editor previewban a Schedule node nem ír D1 adatot.

Első implementációs verzióban:
- ha van read-only Schedule adatforrás, azt használja;
- ha nincs elérhető adat, determinisztikus preview fixture jelenik meg;
- a fixture kizárólag megjelenítési célú, nem menthető domain adat;
- az Inspector mindig a konfigurációt szerkeszti, nem az eseményeket.

### Runtime/public contract

A publikált Page Model renderelésekor:
1. a renderer felismeri a `schedule` node-ot;
2. validálja/normalizálja a Schedule konfigurációt;
3. lekéri a Schedule domain adatot;
4. a konfiguráció alapján szűr/rendez/limitál;
5. biztonságosan rendereli a kártyákat;
6. ha nincs adat, az `emptyText` jelenik meg.

A domain adatok változása önmagában nem módosítja a Page revisiont.

### Biztonsági és adatkonzisztencia szabályok

- A Page Modelből nem lehet közvetlen SQL-lekérdezést indítani.
- A node konfiguráció nem adhat tetszőleges endpointot.
- A runtime nem bízhat a kliens által küldött nyers HTML-ben.
- URL-eket és szövegeket escaped/safe DOM renderinggel kell kezelni.
- A Schedule API saját státusz/platform szabályai maradnak az elsődleges domain validáció.
- A Schedule node konfigurációját külön schema/normalizer fogja védeni.

### Következő implementációs bontás

**40.69.12.A — Schedule schema + defaults + normalizer**
- canonical config schema;
- defaultok;
- invalid értékek normalizálása/elutasítása;
- unit tesztek.

**40.69.12.B — Schedule binding + read service**
- belső canonical read service;
- konfiguráció → domain query leképezés;
- publikus API-val kompatibilis eredmény;
- unit/integration tesztek.

**40.69.12.C — Editor preview renderer**
- Schedule node preview;
- fixture/read-only adat;
- mobil/desktop alaprender.

**40.69.12.D — Public page renderer**
- published Page Model → Schedule runtime;
- safe rendering;
- empty state;
- runtime teszt.

**40.69.12.E — Schedule Inspector / Builder UI**
- megjelenítési mód;
- limit;
- státusz/platform filter;
- sorrend;
- megjelenítési kapcsolók;
- üres állapot szövege.

**40.69.12.F — Élő end-to-end teszt**
- Schedule item CRUD;
- Schedule node konfiguráció mentése;
- preview;
- publish;
- public oldal;
- domain item módosítás → oldal újratöltve friss adat;
- rollback;
- audit.

### Döntés

Nem kezdjük el még a teljes Builder UI-t. Előbb a **Schedule schema + normalizer + read/binding réteg** készül el, mert ez akadályozza meg, hogy az Inspector, preview és public renderer három külön logikát használjon.

**Következő egyetlen aktív pont:** **40.69.12.A — Schedule schema + defaults + normalizer.**


## 40.69.12.A — Schedule schema + defaults + normalizer — 2026-09-22

**Állapot:** [x] PASS — felhasználói tesztkapu: PIPA.

### Elkészült

- Új canonical modul: `public/editor-v2/core/schedule-schema.js`.
- Rögzített Schedule schema version: `1`.
- Rögzített módok: `upcoming`, `all`, `next`.
- Rögzített sorrend: `asc`, `desc`.
- A publikus megjelenítéshez engedélyezett státuszok: `scheduled`, `live`, `completed`; a `cancelled` státusz nem kerülhet a Page Model Schedule konfigurációjába.
- Limit: 1–50.
- Platformlista: trimelt, egyedi értékek, maximum 20 platform, platformnév maximum 40 karakter.
- Megjelenítési kapcsolók szigorúan boolean értékek.
- `emptyText` trimelve, nem lehet üres, maximum 200 karakter.
- Default konfiguráció:
  - `mode=upcoming`
  - `limit=10`
  - `statuses=['scheduled','live']`
  - `platforms=[]`
  - `order=asc`
  - cím/platform/idő/link megjelenítés alapból aktív;
  - end time/status/notes alapból rejtett;
  - `emptyText='Nincs tervezett stream.'`.
- `createNode('schedule')` automatikusan canonical Schedule default konfigurációt kap.
- A Page Model `validatePage()` Schedule-specifikusan ellenőrzi a konfigurációt.
- A normalizer a whitespace-t trimeli és az ismétlődő státusz/platform értékeket deduplikálja.
- Ismeretlen mód/státusz, hibás limit, hibás boolean, üres platform/státuszlista vagy üres `emptyText` elutasításra kerül.
- Készült unit teszt a defaultokra, valid normalizálásra, invalid értékek elutasítására és Page Model validációra.

### Kódmódosítások

- `ed24df33e731e8c86939d35528ec5522829da435` — canonical Schedule schema module.
- `40d7206d06f59e81a0669234c5cdbfa3522151dc` — Page Model Schedule validation.
- `da236d1c955c8231f2a118ebe01b1b0b66f818e9` — Schedule node default initialization.
- `4a47cb20653e60fff646c51fe3ebcc0fe713b7b2` — Schedule schema tests.
- `daf09c0cd3cafa26cddc5ba1e5a6aad9bb5f599c` — Schedule node default test.

### Tesztkapu

- [x] Felhasználói tesztkapu: PIPA.
- [x] Schedule schema/default/normalizer működése visszaigazolva.
- [x] MASTER állapotfrissítve.

**Következő aktív lépés:** 40.69.12.B — Schedule binding + read service.


## 40.69.12.C — Editor preview renderer — 2026-09-22

**Állapot:** [~] IMPLEMENTÁLVA — CI és élő Editor browser tesztkapu folyamatban.

### Audit
- [x] Az Editor v2 központi canvas renderer útvonala: `public/editor-v2/app.js` → `renderCanvas()` → `renderNode()`.
- [x] A `schedule` node eddig csak általános node-ként jelent meg; Schedule-specifikus preview renderer nem volt.
- [x] A Schedule config és domain binding canonical Page Model szerződésben már rögzített.
- [x] A preview nem ír D1-be és nem módosít Schedule domain adatot.
- [x] Az első preview determinisztikus, read-only fixture adatot használ; nem függ admin D1 sessiontől.
- [x] A preview configot a meglévő canonical `normalizeScheduleConfig()` validálja.
- [x] Szöveg és URL biztonságos DOM API-val kerül renderelésre; nyers HTML nem kerül a fixtureből a DOM-ba.

### Implementáció
- [x] Új `public/editor-v2/core/schedule-preview.js`.
- [x] Schedule node branch bekötve az Editor v2 `renderNode()` útvonalába.
- [x] Preview támogatja a canonical `mode`, `limit`, `statuses`, `platforms`, `order` konfigurációt.
- [x] Megjelenítési kapcsolók: title/platform/time/endTime/status/notes/link.
- [x] Üres állapot: canonical `emptyText`.
- [x] Preview stylesheet: `public/editor-v2/schedule-preview.css`.
- [x] Preview unit teszt hozzáadva a `public/editor-v2/tests/core.test.js` fájlhoz.

**Implementációs commitok:**
- `5fcb826b377774dfe375aa208ef8258be034f192` — Schedule preview renderer.
- `3d28a92516cf9e911736143e0214c88e4024bff4` — Editor canvas integration.
- `6ee4131d44755b1a1132d04048153c70a68286dd` — preview styling.
- `69358449d398ef1aa05ddd7616a7b4e3ee3ae7f2` — stylesheet integration.
- `3c87794da3e58671f160b25fb48edc9b5fb16b0a` — preview tests.

### Fontos hardening
- [!] A szerveroldali `src/core/editor-validation.ts` még nem ellenőrzi teljesen a Schedule configot; ezt a public publish/render hardening előtt kötelező rendezni.
- [ ] A preview fixture jelenleg szándékosan nem domain adat; a D1 read-only preview bekötése csak akkor jöhet, ha az Editor preview adatfolyama erre külön, biztonságos szerződést kap.

### Tesztkapu
- [ ] GitHub Editor Core CI PASS az új commitláncra.
- [ ] Typecheck/build PASS.
- [ ] Élő Editor browser teszt: Schedule node hozzáadása → preview kártyák megjelennek.
- [ ] Mode/filter/display toggle regresszió.
- [ ] Diagnostics 0 hiba.
- [ ] MASTER lezárás.

**40.69.12.C — PC Editor UI olvashatósági köztes javítás — 2026-09-22**
- [x] Desktop-only CSS override hozzáadva a túl kicsi Editor UI feliratokhoz.
- [x] Mobil layouthoz nem nyúltunk.
- [x] Canvas tartalomméretezéshez nem nyúltunk; csak az Editor kezelőfelületének olvashatósága nőtt.
- [ ] Felhasználói PC teszt.

**Következő egyetlen aktív pont:** 40.69.12.C — PC UI betűméret live ellenőrzés, majd Schedule preview teszt.

### 40.69.12.C — PC Editor UI olvashatóság 2. pass — 2026-09-22
- [x] A felhasználói visszajelzés alapján az első desktop font-emelés nem hozott elég látható különbséget.
- [x] Második, erősebb desktop-only tipográfiai pass készült: fő kezelőfelületi szövegek jellemzően 12–14px, címek 15–17px, inputok 14px, elemgombok 14px.
- [x] Az elemgombok minimális magassága is nőtt a jobb olvashatóság érdekében.
- [x] Mobil CSS változatlan maradt.
- [x] A vászon tartalmának tényleges méretezését nem módosítottuk.
- Commit: `7f4c7b7a02d2970768184887c76bb3cd09d5489e` — `style: increase desktop editor readability further`.
- [ ] Felhasználói PC live teszt még szükséges.

**Aktív kapu továbbra is:** 40.69.12.C — PC Editor UI olvashatóság live ellenőrzés. A Schedule preview teszt csak akkor indul, ha a PC-s kezelőfelület kényelmesen olvasható.


### 40.69.12.C — PC Editor UI egységes tipográfiai rendszer — 2026-09-22

**Állapot:** [~] IMPLEMENTÁLVA — felhasználói PC live teszt még szükséges.

A két korábbi, egymásra rakódó desktop font-override helyett egyetlen canonical desktop tipográfiai blokk készült. A cél nem az, hogy minden szöveg szó szerint azonos méretű legyen, hanem hogy az Editorban kevés, következetes méretszint legyen, világos hierarchiával és kényelmes hosszú távú használattal.

- [x] A korábbi két desktop readability override megszüntetve; nincs további egymásra rakódó font-patch.
- [x] Egyetlen desktop typography system használ CSS változókat: fő UI 14px, másodlagos 12px, cím 16px, brand 17px.
- [x] A középső canvas toolbar, device/zoom/info elemek bekerültek ugyanabba a rendszerbe.
- [x] A bal oldali oldalak, elemlista, layer/hierarchy terület egységesebb méretszinteket kapott.
- [x] A jobb oldali Inspector, mezők, kapcsolók és műveleti gombok ugyanazt a tipográfiai rendszert használják.
- [x] A Revision panel különösen javítva: cím 16px, fő információ 14px, meta 12px, Restore gomb 12px.
- [x] A Diagnostics panel és alsó státuszsáv nem maradt 7–10px-es mikroszöveg.
- [x] A Rich Text toolbar is a canonical desktop UI méretszintekhez igazodik.
- [x] Line-height értékek is rendezve lettek; a hosszabb szövegek nem csak nagyobbak, hanem levegősebbek is.
- [x] Mobil CSS-t nem módosítottuk.
- [x] Canvas tartalom tényleges méretét nem módosítottuk.
- [x] A kód szerkezete most egyetlen desktop tipográfiai felülírási pontot használ, így későbbi fejlesztésnél kisebb az ütközés és a regresszió kockázata.

**Benchmark-alapelv:** a professzionális vizuális szerkesztőkben a következetes typography system és a kevés, jól meghatározott méretszint fontosabb, mint az, hogy minden felirat azonos pixelméretű legyen. A Figma és Webflow dokumentációja is a text style/type system, következetes hierarchia és spacing használatát hangsúlyozza. citeturn0search6turn0search2

**Implementációs commit:**
- `0fa4c8f4e7b6e4a7d66b867f88055c98bbc49495` — `style: unify desktop editor typography system`

**Felhasználói tesztkapu:**
- [ ] Ctrl+F5 / teljes frissítés.
- [ ] Hosszabb munkánál ellenőrizni: felső sáv → középső toolbar → bal panel → canvas → jobb Inspector → Revision → Diagnostics.
- [ ] Ellenőrizni, hogy nincs kiugróan apró, nehezen olvasható felirat.
- [ ] Ellenőrizni, hogy a méretek hierarchikusak, nem túlzsúfoltak.
- [ ] Diagnostics: 0 hiba.
- [ ] Felhasználói PC PASS.
- [ ] Ezután lehet továbbmenni a Schedule preview live tesztre.

**Egyetlen aktuális folytatási pont:** 40.69.12.C — PC Editor UI hosszú munkamenetes olvashatósági live teszt.


### 40.69.12.C — Schedule publish-validation hardening — 2026-09-22

**Állapot:** [~] AKTÍV — fejlesztési hardening elkészült, PC live UI teszt továbbra is későbbre halasztva.

A korábbi auditban azonosított szerveroldali hiányosságot most megszüntettük: a publish-validáció már nem csak az általános Page Model struktúrát ellenőrzi, hanem a `schedule` node canonical konfigurációját is.

- [x] `src/core/editor-validation.ts` Schedule-specifikus validációt kapott.
- [x] Schema version csak `1`.
- [x] Mode csak `upcoming | all | next`.
- [x] Limit csak egész szám, 1–50.
- [x] Status whitelist: `scheduled | live | completed`; `cancelled` tiltott.
- [x] Platformlista maximum 20 elem, értékenként maximum 40 karakter, üres érték tiltva.
- [x] Order csak `asc | desc`.
- [x] Minden megjelenítési kapcsoló szigorúan boolean.
- [x] `emptyText` kötelező, trim után nem lehet üres, maximum 200 karakter.
- [x] Hibás Schedule konfiguráció publishkor `INVALID_SCHEDULE_CONFIG` hibával elutasítható.
- [x] A kliensoldali Schedule schema és a szerveroldali publish-kapu ugyanazt a canonical szerződést követi.
- [x] Nem készült második Schedule runtime vagy második Page Model.

**Commit:**
- `a97c1916621f1b497a57254de33d8c39603da5c7` — `fix: enforce schedule config at publish validation`

**Fontos:** ez implementációs hardening, nem felhasználói PASS. A PC Editor olvashatósági tesztet a felhasználó későbbre halasztotta; ez nem blokkolja a további fejlesztést.

**Következő fejlesztési lépés:** 40.69.12.C Schedule preview tesztelhető/finomítható rétegeinek teljes kód-auditja, majd a következő szükséges canonical renderer-réteg. A PC UI live teszt külön későbbi visszatérő tesztkapu.


### 40.69.12.D — Public Schedule renderer — 2026-09-22

**Állapot:** [~] IMPLEMENTÁLVA — CI és élő publikus oldal tesztkapu még hátra van.

A canonical `pages` Page Model Schedule node most már a publikus `/p/*` rendererben is saját runtime ágat kapott.

- [x] `public/assets/page-renderer.js` felismeri a `schedule` node típust.
- [x] A node saját canonical Schedule konfigurációját szigorúan ellenőrzi.
- [x] A publikus renderer kizárólag a fix `/api/public/schedule` API-n keresztül kér adatot.
- [x] A Page Model nem adhat meg tetszőleges endpointot vagy SQL-forrást.
- [x] A query a canonical mode/limit/status/platform/order konfigurációból épül.
- [x] Az API válasza cache-elt konfigurációnként, egy oldalon belül.
- [x] Cím, platform, időpont, végidő, státusz, jegyzet és link a canonical display kapcsolók szerint jelenik meg.
- [x] URL csak `http:` / `https:` sémával kerülhet linkként a DOM-ba.
- [x] Szöveg HTML helyett escaped outputtal kerül renderelésre.
- [x] Üres eredménynél a canonical `emptyText` jelenik meg.
- [x] Nincs D1 írás a publikus render során.
- [x] A Schedule domain adata nem kerül bemásolásra a Page Modelbe.

**Commit:**
- `ebb665f9738caec83735222122902ab10b9e6e42` — `feat: render canonical schedule nodes on public pages`

**Következő tesztkapu:**
- [ ] GitHub Editor Core CI PASS
- [ ] typecheck PASS
- [ ] publikus Schedule oldal élő teszt
- [ ] mode/filter/display kapcsolók ellenőrzése
- [ ] üres Schedule állapot ellenőrzése
- [ ] diagnostics / console hiba ellenőrzése
- [ ] csak ezután 40.69.12.D lezárás

## 40.69.13 — TWITCH-FIRST ADÁSREND / SCHEDULE BUILDER ÚJRATERVEZÉS — 2026-09-22

**Állapot:** [~] AKTÍV — döntés rögzítve; kódolás előtt teljes Twitch + Schedule adatfolyam audit szükséges.

### Felhasználói cél
Az Adásrend az oldal egyik kiemelt része lesz, ezért nem egyszerű admin CRUD listaként kezeljük. A cél egy profi, streamer-központú, adatvezérelt Schedule rendszer, amely Twitchből is képes hiteles adatot kapni, miközben a saját weboldal továbbra is kontrollálható marad.

### Benchmarkból átvett funkcióirányok
A korábbi iparági audit alapján a modern streamer schedule oldalaknál visszatérő minták:
- következő adás kiemelése;
- heti és teljes menetrend;
- játék/kategória megjelenítése;
- helyi időzóna;
- platform és stream link;
- egyedi és ismétlődő események;
- vizuális game artwork;
- többféle kártya/timeline/grid elrendezés;
- megosztható/public schedule oldal;
- később emlékeztető/naptár és social export.

Ezeket saját Sanci9517 rendszerben, nem másolt UI-ként valósítjuk meg.

### Twitch-integrációs cél
A Twitch bekötése **megelőzi a végleges Schedule Buildert**, mert így az Adásrend már a valódi platformadatokra épülhet.

Tervezett Twitch funkciók:
- OAuth és biztonságos token lifecycle;
- csatornaazonosítás;
- live/offline állapot;
- aktuális stream/category/game adatok;
- Twitch Schedule API integráció;
- később EventSub/webhook események;
- cache/rate-limit kezelés;
- token refresh/recovery;
- explicit sync állapot;
- hiba esetén a saját Schedule domain marad használható.

### Canonical adatfolyam
```
Twitch API / EventSub
        ↓
Twitch Integration Service
        ↓
Sync / Validation / Conflict handling
        ↓
schedule_items + game profiles
        ↓
Editor v2 Schedule node
        ↓
Page Model (csak konfiguráció)
        ↓
Published Page
        ↓
Public Schedule renderer
```

**Fontos:** a Page Model nem tárolja a Twitch eseményeket. A Schedule node csak megjelenítési/configuration adatot tartalmaz. A domain események D1-ben maradnak.

### Schedule Builder végleges iránya
Az Editor v2-ben külön **Adásrend/Menetrend blokk** lesz.

Az Inspectorból később:
- új adás létrehozása;
- meglévő adás szerkesztése;
- adás törlése;
- játék kiválasztása;
- időpont/platform/link;
- kép/game artwork;
- leírás;
- státusz;
- megjelenítési mód;
- sablon kiválasztása;
- játékprofil kiválasztása.

A felhasználónak nem kell egy streamhez külön Heading + Image + Text + Button elemeket létrehoznia.

### Játékprofilok
Külön domain/preset réteg:
- game name;
- slug;
- artwork/media;
- opcionális brand/accent adatok;
- Twitch game/category azonosító;
- későbbi YouTube/egyéb platform mapping lehetősége.

Első használati profilok lehetnek Fortnite, Hearthstone, Hades, majd tetszőleges új játékok.

### Sablonrendszer
A játékprofil és a vizuális sablon **két külön fogalom**.

Példák:
- Minimal;
- Gaming Cards;
- Neon;
- Timeline;
- Weekly Grid;
- Featured Stream;
- Compact List;
- saját mentett sablon.

A sablon a Schedule node konfigurációját és vizuális elrendezését kezeli; nem másolja az eseményeket.

### Tervezett Schedule nézetek
- Next Stream;
- Next 3;
- Weekly Schedule;
- Full Schedule;
- Featured Stream.

A Schedule blokk egyetlen adatvezérelt komponens marad, amely több layouttal tud megjelenni. Nem hozunk létre eseményenként külön Page Model node-okat.

### Későbbi bővítési lehetőségek
- recurring streams;
- több időzóna;
- calendar/reminder;
- export;
- social schedule image/export;
- Twitch/YouTube/TikTok/Discord egységes platformréteg;
- VOD/Clips összekapcsolása egy stream eseménnyel;
- live állapot automatikus kiemelése;
- stream utáni státusz és archive/VOD link.

### Mi marad külön?
- Schedule domain CRUD = D1/domain service;
- Twitch integration = külön integration service;
- Editor v2 = egyetlen vizuális szerkesztő;
- Schedule node = a vizuális komponens;
- Page Model = csak konfiguráció/layout;
- Public renderer = domain adatot olvasó runtime.

### Aktív megvalósítási sorrend
**40.69.13.A** — meglévő Twitch/Social/integration kód teljes audit + Twitch API/OAuth szerződés.

**40.69.13.B** — Twitch account/channel connection + token lifecycle + security.

**40.69.13.C** — Twitch channel/live/game/schedule read service.

**40.69.13.D** — Twitch → `schedule_items` sync/conflict/source model.

**40.69.13.E** — game profile adatmodell + media kapcsolat.

**40.69.13.F** — Schedule event CRUD az Editor v2 Inspectorból.

**40.69.13.G** — Schedule template system + professional layouts.

**40.69.13.H** — Editor preview + public renderer teljes integráció.

**40.69.13.I** — teljes E2E: Twitch → D1 → Editor → Save → Publish → Public → live update → audit → rollback/regression.

**40.69.13.J** — legacy Schedule UI végleges archive/cleanup, csak az új rendszer PASS után.

### Definition of Done
- Twitch kapcsolat biztonságosan működik;
- nincs token/secret kliensoldali leakage;
- Twitch adat és saját Schedule adat között egyértelmű source/sync szabály van;
- Editor v2-ből kezelhető az Adásrend;
- game artwork támogatott;
- sablonok működnek;
- desktop/mobile responsive;
- public page és preview ugyanazt a canonical configot használja;
- live/offline és schedule adatok frissülnek;
- audit/revision/publish szabályok nem sérülnek;
- CI/typecheck/E2E/live tesztek PASS;
- felhasználói PASS;
- MASTER lezárva.

### 40.69.13.A — TELJES TWITCH / SOCIAL / INTEGRATION AUDIT — 2026-09-22

**Audit státusz:** [x] AUDIT PASS — kódolási kapu lezárva; a következő egyetlen pont a 40.69.13.B szerinti Twitch account/channel connection + token lifecycle + security. Ebben a pontban alkalmazáskódot nem módosítottunk.

#### A.1 Meglévő Twitch / Integration állapot
- `src/types/env.ts` már deklarál opcionális `TWITCH_CLIENT_ID` és `TWITCH_CLIENT_SECRET` környezeti változókat.
- `wrangler.jsonc` jelenleg D1 + Assets + Observability konfigurációt tartalmaz; Twitch binding/service/route nincs definiálva.
- Nincs canonical Twitch OAuth route vagy OAuth callback.
- Nincs Twitch token persistence modell/tábla.
- Nincs Twitch API client/service vagy Helix wrapper.
- Nincs EventSub webhook/WebSocket/Conduit integration.
- Nincs Twitch account/channel connection state vagy canonical broadcaster ID tárolás.
- Nincs token refresh/recovery service.
- Nincs Twitch-specific rate-limit/cache policy implementation.
- A Twitch említések jelenleg főként legacy/public placeholder és generic Sanci blokkok; ezek nem jelentenek valódi API-integrációt.

**Következtetés:** a Twitch integráció technikailag még nincs megépítve; az env változók csak előkészítésnek számítanak.

#### A.2 Meglévő Social réteg
A D1 schema tartalmaz `social_accounts` táblát (`platform`, `handle`, `url`, `is_visible`, `sort_order`), de ez statikus social-link rekordmodell, nem OAuth/integration connection modell.

**Döntés:** a `social_accounts` táblát nem használjuk Twitch tokenek vagy integration state tárolására. A későbbi unified integration réteg külön ownershipet és adatmodellt kap.

#### A.3 Meglévő Schedule domain
A canonical `schedule_items` jelenleg `id`, `title`, `platform`, `starts_at`, `ends_at`, `status`, `url`, `notes`, `created_at`, `updated_at` mezőkből áll. A domain CRUD authenticated editor útvonalon működik, audit-log batch-cel.

Hiányzó Twitch/sync képességek:
- source (`manual` / `twitch` / későbbi platform);
- external source ID;
- sync state / last sync;
- game/category reference;
- Twitch category/game ID;
- canonical UTC/timezone stratégia;
- recurring/external recurrence metadata;
- optional artwork/media reference;
- conflict/override state.

**Döntés:** Twitch adat nem kerül közvetlenül a Page Modelbe, és a Page Model nem lesz sync cache.

#### A.4 Twitch API szerződés — audit eredménye
- OAuth 2.0 user és app access token létezik; access token, refresh token és client secret titkos adatként kezelendő. citeturn0search3turn2search3
- Channel Information app vagy user tokennel olvasható, és többek között broadcaster/game/title adatokat ad. citeturn1search0
- Channel Stream Schedule app vagy user tokennel olvasható; a schedule UTC RFC3339 időket, címet, kategóriát és recurring információt adhat, paginációval. citeturn1search0
- Schedule módosításához user token + `channel:manage:schedule` kell; ezt nem kérjük az első connectionnél, amíg nincs rá bizonyított szükség. citeturn1search0turn0search4
- Authorization Code Grant user tokenje refresh tokennel frissíthető; refreshkor új refresh token is érkezhet, ezért rotationt kezelni kell. citeturn2search2
- EventSub webhook esetén app access token kell; a webhook callback challenge és HMAC-SHA256 signature ellenőrzést igényel. citeturn0search0turn0search5
- A Helix rate limit 429 esetén `Ratelimit-Reset` alapján kezelendő. citeturn2search0

#### A.5 Canonical Twitch connection döntés
1. Egyetlen server-side Twitch Integration Service.
2. Authorization Code Grant alapú broadcaster connection.
3. A browser csak az OAuth folyamatot indítja és a callback eredményét kapja; access/refresh token nem kerül Page Modelbe vagy kliens state-be.
4. Külön integration connection adatmodell szükséges.
5. Tokenek secret-managed/titkosított módon tárolandók; plaintext token logolása tilos.
6. Minimális scope elv: csak bizonyítottan szükséges jogosultságok.
7. Token recovery reaktív 401-kezeléssel és refresh-token rotationnel.
8. Twitch broadcaster ID az external account canonical kulcsa.
9. Minden Twitch API hívás egyetlen service boundaryn keresztül menjen.
10. EventSub csak bizonyított callback + signature + subscription lifecycle után aktiválható.

#### A.6 Schedule sync szerződés — audit eredménye
A Twitch schedule nem másolható veszteség nélkül a jelenlegi `schedule_items` modellbe. A B/C/D pontok előtt adatmodellt kell bővíteni vagy külön external mapping réteget létrehozni.

Kötelezően megőrzendő külső adatok:
- Twitch broadcaster ID;
- Twitch schedule segment ID;
- UTC start/end;
- Twitch title;
- Twitch category/game ID + name;
- recurring flag / recurrence metadata, amennyiben a forrás ezt adja;
- source és sync state.

**Conflict szabály:** manual rekordot nem írunk felül csendben Twitch sync-kel. External rekordnál source identity és sync ownership explicit.

**Timezone döntés:** a D1 canonical időformátumot UTC/RFC3339 irányba kell vinni; a jelenlegi `starts_at`/`ends_at` élő adatformátumát migráció előtt külön auditálni kell.

#### A.7 Audit eredmény
**PASS:** az aktív irány technikailag tiszta, de a Twitch integration teljesen hiányzik, ezért új integration réteg szükséges. A `social_accounts` nem megfelelő erre, a `schedule_items` pedig domain alapként megtartható.

**Ebben a pontban nem implementáltuk:** OAuth, token storage, Twitch API client, EventSub, Twitch connection UI, game profile, Schedule Inspector és template system.

**Következő egyetlen pont:** 40.69.13.B — Twitch account/channel connection + token lifecycle + security.

**EGYETLEN AKTÍV VÉGREHAJTÁSI PONT:** **40.69.13.B — Twitch account/channel connection + token lifecycle + security — B.4d UI bekötés blokkoló pont.**


### 40.69.13.B — TWITCH ACCOUNT/CHANNEL CONNECTION + TOKEN LIFECYCLE — 2026-09-22

**Státusz:** [~] IMPLEMENTÁLÁS + HARDENING FOLYAMATBAN; a refresh concurrency és token validation lifecycle gyökérokai azonosítva és a canonical megoldás implementálva. CI/typecheck, `0012` remote D1 migration és Cloudflare Worker deploy PASS; a production secret/redirect ellenőrzés és a live OAuth/refresh/validation/security tesztek még hátra vannak.

#### B.1 Canonical döntések
- A Twitch kapcsolat kizárólag az authenticated admin sessionből indítható.
- OAuth flow: Twitch Authorization Code Grant, server-side confidential client.
- OAuth state: kriptográfiailag véletlen, hash-elve D1-ben tárolt, 10 perces, egyszer használható és a kezdeményező Sanci session useréhez kötött.
- Redirect URI canonical útja: `/api/integrations/twitch/callback`, az aktuális request originből képezve.
- Twitch access/refresh token nem kerül Page Modelbe, Editor state-be vagy API response-ba.
- Tokenek AES-GCM titkosítással kerülnek D1-be; a titkosítás kulcsa külön `TWITCH_TOKEN_ENCRYPTION_KEY` secret.
- Broadcaster ID a Twitch connection canonical external identity kulcsa.
- `social_accounts` továbbra is statikus social-link domain; nem használható OAuth connection storage-ra.
- Disconnect Twitch revoke endpointet használ, majd a lokális kapcsolat státuszát `revoked` értékre állítja.
- Refreshkor az új refresh token kötelezően mentésre kerül.
- Twitch token validáció a `/oauth2/validate` endpointon történik; a validáció eredménye a connection canonical állapotát frissíti.
- Minimális scope elv: csak bizonyítottan szükséges jogosultságokat kérünk. A Schedule Builder tényleges Twitch schedule-kezeléséhez a canonical OAuth flow `channel:manage:schedule` scope-ot kér; a scope-változás után a meglévő kapcsolatot újra kell autorizálni.

#### B.2 Implementált alap + jelenlegi hardening
- `migrations/0011_twitch_integration.sql`
  - `twitch_connections`
  - `twitch_oauth_states`
- `migrations/0012_twitch_refresh_lock.sql`
  - `refresh_lock_token`
  - `refresh_lock_until`
- `src/core/twitch-crypto.ts`
  - AES-GCM token encryption/decryption
  - OAuth state hashing
- `src/core/twitch-oauth.ts`
  - authorization URL
  - authorization-code exchange
  - token validation
  - refresh
  - revoke
  - canonical valid-token accessor
  - refresh concurrency lease
- `src/routes/integrations/twitch.ts`
  - connect
  - callback
  - connection status
  - disconnect
- `src/types/env.ts`
  - `TWITCH_TOKEN_ENCRYPTION_KEY`
- `src/index.ts`
  - Twitch integration routes registered.

#### B.3 Audit megállapítások és javítások
**Az audit során talált valódi hibák:**

1. **Refresh concurrency**
   - A korábbi refresh útvonal ugyanazt a refresh tokent párhuzamosan több Worker requestből is elküldhette.
   - Twitch a refresh tokenek rotációját és a párhuzamos refresh kockázatát külön kezeli; ezért egyetlen connectionhöz server-side lock szükséges. 
   - Canonical javítás: D1-alapú rövid lease lock ugyanazon `twitch_connections` rekordon.
   - A lock atomikus `UPDATE ... WHERE lock szabad/lejárt` művelettel szerezhető meg.
   - A lock tulajdonosa a Twitch refresh HTTP hívást a lock alatt végzi, majd siker/failure esetén felszabadítja.
   - A várakozó requestek rövid pollinggal megvárják az első refresh eredményét.
   - Ha egy másik request már frissítette a connectiont, az új request a friss access tokent használja, és nem indít második refresh-t.
   - Lock timeout esetén explicit `TWITCH_REFRESH_CONCURRENCY_TIMEOUT` hiba keletkezik.

2. **Token validation lifecycle**
   - A korábbi `validateAccessToken()` csak az OAuth callbackben futott; a későbbi Twitch API használathoz nem volt canonical valid-token lifecycle.
   - Létrejött a `getValidTwitchAccessToken()` canonical service boundary.
   - A token csak akkor kerül újra validálásra, ha a lokális validációs ablak lejárt, vagy az access token lejárathoz közel van.
   - Érvénytelen access token esetén a rendszer reaktívan refresh-el, majd az új tokent újra validálja.
   - A validation ellenőrzi a client ID és broadcaster/user ID egyezését.
   - Sikeres validation frissíti a `last_validated_at`, scope és expiry állapotot.
   - A validation lifecycle nem adja vissza a tokeneket kliensoldali route response-ban.

3. **OAuth state expiry / replay**
   - Az audit során észleltük, hogy az ISO `T` formátumú expiry érték és a SQLite `CURRENT_TIMESTAMP` közvetlen szöveges összehasonlítása nem volt elég biztonságos/egyértelmű.
   - A cleanup és validáció most `julianday(...)` alapú időösszehasonlítást használ.
   - Az OAuth state a token exchange előtt egyszer használatosként atomikusan claimelődik; párhuzamos callback nem használhatja fel ugyanazt az állapotot kétszer.

4. **Token secret handling**
   - A token továbbra is csak server-side plaintextként létezik a szükséges HTTP hívás idejére.
   - D1-ben AES-GCM ciphertext + IV tárolódik.
   - Token nem kerül API response-ba, Page Modelbe vagy Editor state-be.
   - Plaintext token logolása nem megengedett.

#### B.4 Biztonsági / lifecycle állapot
**PASS implementációs szinten:**
- [x] OAuth state hash + user binding + TTL.
- [x] OAuth state egyszer használatos atomic claim.
- [x] Tokenek titkosított D1 storage-ban.
- [x] Refresh token rotation mentése.
- [x] Refresh concurrency lease.
- [x] 401 → refresh → revalidate lifecycle.
- [x] Client ID + broadcaster ID identity ellenőrzés.
- [x] Tokenek nem kerülnek kliensválaszba.

**PENDING tesztkapuk:**
- [x] Typecheck / GitHub CI — Twitch Integration Check #1 PASS + Editor Core Test #625 PASS az `a2bdcea2de44c3f3fd66cebe6533966e2eeb5909` commiton; futás: 21–23 mp.
- [x] D1 migration `0012` remote apply — PASS; `refresh_lock_token` és `refresh_lock_until` oszlopok létrejöttek, az `idx_twitch_connections_refresh_lock` index jelen van.
- [x] Cloudflare Worker deploy — PASS; `sanci9517-streamer-brand` sikeresen deployolva, version ID: `dc69ff9d-e9fb-486e-928d-8a9454eb661e`.
- [x] Cloudflare secret `TWITCH_TOKEN_ENCRYPTION_KEY` jelenléte — `wrangler secret list` production Workeren igazolta a secret nevet; ezt követően `wrangler secret put TWITCH_TOKEN_ENCRYPTION_KEY` sikeresen feltöltötte.
- [ ] Production redirect URI egyezés.
- [ ] Live OAuth connect.
- [ ] Live connection status.
- [ ] Live token validation.
- [ ] Controlled refresh concurrency test.
- [ ] Invalid/revoked token → reauthorization flow.
- [ ] No-secret/no-token leakage audit live logokban.
- [ ] Connect/disconnect audit atomicity célzott teszt.
- [x] `revocation_pending` állapot runtime használatának schema auditja: az `0011` CHECK-je eredetileg nem engedte ezt az állapotot.
- [x] Javítás: `0014_twitch_connection_status.sql` létrehozva, amely a connection táblát a `revocation_pending` státusszal együtt canonicalizálja.
- [ ] `0014_twitch_connection_status.sql` remote D1 apply + schema ellenőrzés.

#### B.4a — CI/typecheck kapu — 2026-09-22

**PASS:**
- [x] `Twitch Integration Check` #1 — completed successfully, 21s.
- [x] `Editor Core Test` #625 — completed successfully, 23s.
- [x] Node.js 24 + `npm install --no-audit --no-fund` + `npm run typecheck` + `npm run test:editor` teljes CI lánc PASS.
- [x] Nincs CI/typecheck blokk.

**Bizonyíték:**
- commit: `a2bdcea2de44c3f3fd66cebe6533966e2eeb5909` — `test: add Twitch integration CI typecheck gate`.
- Twitch Integration Check run: `35771532887`.
- Editor Core Test run: `35771532842`.

**Következő egyetlen tesztkapu:** Twitch production redirect URI egyezés ellenőrzése, majd live OAuth connection lifecycle.

#### B.4b — Production Twitch encryption secret — 2026-09-22

**PASS:**
- [x] Production `TWITCH_TOKEN_ENCRYPTION_KEY` secret jelenléte ellenőrizve.
- [x] A secret értéke nem került chatbe, logba vagy MASTER dokumentumba.
- [x] `wrangler secret put TWITCH_TOKEN_ENCRYPTION_KEY` sikeresen lefutott a `sanci9517-streamer-brand` Workerre.

**Bizonyíték:**
- `wrangler secret list` kezdeti kimenete csak `ADMIN_BOOTSTRAP_TOKEN` secretet mutatott.
- A secret feltöltése után a Wrangler ezt jelezte: `Success! Uploaded secret TWITCH_TOKEN_ENCRYPTION_KEY`.

**Státusz:** `[x]`.

**Következő egyetlen aktív tesztkapu:** Twitch production redirect URI egyezés ellenőrzése. Ezután indulhat a live OAuth connect → connection status → token validation → refresh/reauthorization security tesztlánc.



#### B.4c — Production Twitch redirect URI egyezés — 2026-09-23

**PASS:**
- [x] A Twitch Developer Console OAuth Redirect URLs listájához hozzá lett adva a canonical production callback:
  `https://sanci9517-streamer-brand.sandor-bogadi95.workers.dev/api/integrations/twitch/callback`.
- [x] A kód és a production Twitch OAuth redirect URI most ugyanazt a callback útvonalat használja.
- [x] A korábbi `sanci9517-api.sandor-bogadi95.workers.dev/callback` redirectet egyelőre nem töröltük, hogy a live átállás előtt ne okozzunk felesleges kompatibilitási kockázatot.

**Státusz:** `[x]`.

**Következő egyetlen aktív tesztkapu:** live Twitch OAuth connect → connection status → token validation.

#### B.4d — Live OAuth connect UI audit — 2026-09-23

**Státusz:** [!] BLOKKOLVA — a live OAuth teszt nem indítható az Editor v2 jelenlegi UI-jából, mert a canonical Twitch connect route ugyan létezik backend oldalon, de nincs hozzá bekötött frontend „Twitch csatlakoztatása” indítófelület.

**Audit eredmény:**
- [x] `src/routes/integrations/twitch.ts` tartalmazza a canonical connect route-ot.
- [x] `src/index.ts` regisztrálja a `/api/integrations/twitch/connect` útvonalat.
- [x] Az Editor v2 `public/editor-v2/app.js` jelenlegi UI-kódjában nincs Twitch OAuth connect gomb vagy a `/api/integrations/twitch/connect` route-ra mutató indítás.
- [x] Emiatt a felhasználó nem találhatta meg a csatlakoztatási funkciót; ez UI-integrációs hiány, nem felhasználói kezelési hiba.
- [ ] Canonical admin/editor Twitch connection UI létrehozása és a meglévő backend connect route-ra kötése.
- [ ] UI state: nincs kapcsolat / kapcsolódás / kapcsolódva / hiba.
- [ ] Ezután live OAuth connect teszt.

**Architekturális döntés:** nem hozunk létre külön második Twitch OAuth flow-t. A frontend kizárólag a meglévő canonical `/api/integrations/twitch/connect` route-ot indíthatja; tokenkezelés továbbra is server-side marad.

**Egyetlen következő aktív pont:** live Twitch OAuth callback diagnosztikai teszt a friss CI PASS után. Builder/Inspector fejlesztés továbbra is blokkolt.

#### B.4e — Canonical Twitch connection UI bekötés — 2026-09-23

**Státusz:** [x] PRODUCTION DEPLOY PASS; LIVE OAUTH TESZT PENDING.

**Audit + implementáció:**
- [x] A meglévő `/api/integrations/twitch/connect` route maradt az egyetlen OAuth indító útvonal.
- [x] Az Editor v2 topbar kapott egyetlen canonical Twitch connection vezérlőt.
- [x] A UI induláskor a `/api/integrations/twitch/connection` státusz endpointot hívja.
- [x] Kapcsolat nélkül a vezérlő a canonical OAuth connect route-ra navigál.
- [x] Kapcsolat esetén a broadcaster login látható, és ugyanaz a vezérlő indítja a disconnect műveletet.
- [x] Disconnect továbbra is a meglévő POST `/api/integrations/twitch/disconnect` route-on történik; token nem kerül kliensoldalra.
- [x] Nincs második Twitch OAuth flow vagy külön connection state rendszer bevezetve.
- [x] GitHub CI PASS az új UI commiton — Editor Core Test #634 és Twitch Integration Check #10 sikeres.
- [x] Production Worker deploy az új UI-val — Wrangler 4.130.0, Worker version `75168241-a5ab-4124-bc80-22b2971ca44b`.
- [x] Deploy sikeresen lezárult; a Worker production URL aktív.
- [ ] Élő Editor teszt: Twitch gomb → Twitch engedélyezési oldal → callback → connected állapot.

**Módosító commitok:**
- `13300a7896e1cf1f3c3e0cf2dd48ba229d591f05` — Editor v2 Twitch connection UI
- `9eea32f28126d0de0846769c34a5955b8e56acf8` — canonical Twitch connection lifecycle wiring

**Egyetlen következő aktív lépés:** élő production Editor v2 teszt: Twitch connection gomb → Twitch authorization → callback → connected állapot. Builder/Inspector fejlesztés továbbra is blokkolt, amíg ez a live lifecycle kapu nincs lezárva.

#### B.4f — Twitch runtime konfiguráció diagnosztika — 2026-09-23

**Státusz:** [x] DIAGNOSZTIKAI IMPLEMENTÁCIÓ + CI PASS; PRODUCTION DEPLOY PENDING.

**Indok:**
- [x] A hitelesített production `/api/integrations/twitch/connect` kérés bizonyítottan 503-at ad.
- [x] A Cloudflare production secret list mindhárom szükséges secret nevét tartalmazza.
- [x] Emiatt célzott, ideiglenes runtime diagnosztikai endpoint készült, amely kizárólag boolean jelenlétet ad vissza, secret értéket soha.
- [x] Endpoint: authenticated GET `/api/integrations/twitch/diagnostic`.
- [x] Diagnosztizált értékek: `TWITCH_CLIENT_ID`, `TWITCH_CLIENT_SECRET`, `TWITCH_TOKEN_ENCRYPTION_KEY`.
- [x] A diagnosztikai endpoint nem módosít Twitch OAuth logikát és nem ad ki secretet.
- [x] GitHub CI PASS: Twitch Integration Check #15, Editor Core Test #639.
- [x] Implementációs commitok: `d49a7aa54e28ac19d3315f29ccd9c849b70dabb4` és `195edeb8e0f847260ab47a6e8102d2091a85b71f`.

**Következő egyetlen aktív lépés:** a runtime secret újra-put után az authenticated diagnostic endpoint mindhárom secretet `true` értékkel adta vissza; a secret/runtime blokk lezárva. A live OAuth indítás ezt követően `editor?twitch=error` állapotba tért vissza. A `/api/integrations/twitch/connect` kézi fetch redirect-manual teszt `status:0, location:null, body:''` eredményt adott, ami böngészős opaque redirectként értelmezhető.

#### B.4g — OAuth callback hiba diagnosztika + live OAuth connection — 2026-09-23

**Státusz:** [x] PASS.

**Megállapítás és bizonyíték:**
- [x] A production runtime secret diagnosztika mindhárom szükséges secretet jelenlévőnek mutatta.
- [x] A Twitch validation során feltárt `scopes:null` válaszformátum gyökérokát azonosítottuk és javítottuk.
- [x] A javító commit: `9e024d6a3c143d4ededaa4d4d6fea23aa3a90d8d` — `fix: normalize Twitch validation scopes`.
- [x] A helyi Git clone frissítve lett erre a commitra.
- [x] Production deploy sikeres: Cloudflare Worker version `36172775-b47a-4036-94b9-522095683e92`.
- [x] Live Twitch OAuth teszt sikeres: a callback az editorba `?twitch=connected` állapottal tért vissza.
- [x] Ez igazolja, hogy a Twitch authorization → callback → authorization-code exchange → token validation → encrypted connection persistence lánc élő production környezetben végigfutott.
- [x] A Twitch access/refresh token továbbra sem kerül kliensválaszba vagy Page Modelbe.

**Korábbi diagnosztikai módosítás:**
- [x] A `338fc8e8a2d2562278fa06fb7ed9e52507fe02ab` callback diagnosztikai commit segítségével feltártuk a validation shape hibát.
- [x] A végleges javítás után a diagnosztikai `code` query használata már nem szükséges; a végleges takarítás külön lépés.

**B.7 lezárva:** live `/api/integrations/twitch/connection` connection status PASS. **Következő egyetlen aktív lépés:** 40.69.13.B.8.A — a célzott authenticated Twitch API/test endpoint szerződésének rögzítése és minimális implementációs terv.
#### B.5 Módosító commitok
- `974221e93d896b6b861212b2501dd4608cbdee38` — `fix: add Twitch refresh concurrency lease`
- `7ae8af57ce5b86b92e915de838b40b6b8b4a79ae` — `fix: harden Twitch token lifecycle and refresh concurrency`
- `9e024d6a3c143d4ededaa4d4d6fea23aa3a90d8d` — `fix: normalize Twitch validation scopes`

Korábbi kapcsolódó B commitok a történeti auditban maradnak.

#### B.6 Külső szerződés
A Twitch dokumentáció szerint third-party app esetén az OAuth access tokent induláskor és óránként validálni kell; érvénytelen tokennél a Twitch 401-et ad, a refresh token pedig rotálódhat, ezért a refresh lifecycle-nek ezt kezelnie kell. A párhuzamos refresh kockázatát a Twitch külön dokumentálja.

#### B.7 — Live Twitch connection status — 2026-09-23

**Státusz:** [x] PASS.

**Bizonyíték:** production authenticated endpoint:
`/api/integrations/twitch/connection`

Visszaadott állapot:
- `ok: true`
- `connected: true`
- `status: "connected"`
- broadcaster: `sanci9517`
- `scopes: []`
- `accessTokenExpiresAt` kitöltve
- `lastValidatedAt` kitöltve

Ez igazolja, hogy a létrejött Twitch OAuth kapcsolat production környezetben az authenticated connection status endpointen is elérhető és connected állapotú.

**Következő egyetlen aktív tesztkapu:** 40.69.13.B.8 — live Twitch token validation lifecycle teszt.

#### B.8 — Live Twitch token validation lifecycle — 2026-09-23

**Státusz:** [x] PASS — PRODUCTION LIVE VALIDATION BIZONYÍTVA.

**Cél:** bizonyítani, hogy a canonical `getValidTwitchAccessToken()` lifecycle nem csak a D1-ben tárolt connection státuszt olvassa, hanem a token érvényességét megfelelően validálja, és szükség esetén a refresh/revalidation útvonalat használja.

**Audit + live bizonyíték:**
- [x] `getValidTwitchAccessToken()` canonical service boundary létezik a `src/core/twitch-oauth.ts` fájlban.
- [x] A token validáció → identity ellenőrzés → `updateValidation()` lánc implementálva van.
- [x] 401 esetén a canonical refresh → újra-validálás → identity ellenőrzés lánc implementálva van.
- [x] Célzott, authenticated, token-visszaadás nélküli canonical endpoint: `GET /api/integrations/twitch/validation`.
- [x] Az endpoint kizárólag a `getValidTwitchAccessToken()` canonical service boundaryt használja, `forceValidation:true` móddal.
- [x] A token nem kerül route response-ba.
- [x] `getValidTwitchAccessToken()` explicit `forceValidation` opcióval rendelkezik, így a live teszt nem függ a lokális validation TTL-től.
- [x] GitHub CI PASS.
- [x] Production deploy PASS; Worker version: `f263ecee-9d2e-4af0-9c19-1e30f0afb812`.
- [x] Authenticated production live validation endpoint PASS.
- [x] Live válasz: `ok:true`, `valid:true`, `status:"connected"`, broadcaster `sanci9517`.
- [x] Live válaszban az `accessTokenExpiresAt` és `lastValidatedAt` mezők kitöltve érkeztek.
- [x] A live `lastValidatedAt` érték `2026-09-23 17:56:26`, ami igazolja a validation lifecycle futását és a canonical connection állapot frissítését.
- [x] A route nem ad vissza access/refresh tokent.

**Teszt sorrend:**
1. [x] a célzott endpoint a canonical `getValidTwitchAccessToken()` service boundaryn keresztül fut;
2. [x] CI/typecheck PASS;
3. [x] production deploy PASS;
4. [x] authenticated live `GET /api/integrations/twitch/validation` PASS;
5. [x] validation eredmény + `lastValidatedAt` live bizonyítva;
6. [x] B.8 lezárva PASS.

**B.9 — CONTROLLED REFRESH CONCURRENCY AUTOMATED TEST — 2026-09-23**

**Státusz:** [x] PASS — automatizált concurrency teszt sikeres.

**Cél:** bizonyítani, hogy ugyanahhoz a Twitch connectionhöz érkező párhuzamos refresh műveletek közül csak egy Worker kér új tokent a Twitchtől, miközben a többi kérés a már frissített connection állapotát használja.

**Tesztbizonyíték:**
- [x] Létrejött a külön `tests/twitch-oauth.test.js` Node 24 `node:test` teszt.
- [x] A teszt a meglévő `twitch-crypto.ts` AES-GCM encryption/decryption útvonalát használja; nincs második token-kriptográfiai implementáció.
- [x] A teszt két párhuzamos `refreshTwitchConnection()` hívást indít ugyanarra a connectionre.
- [x] A fake Twitch token endpoint ellenőrizte, hogy pontosan **1** refresh HTTP kérés történik.
- [x] Mindkét párhuzamos hívás `REFRESHED_ACCESS_TOKEN` értékkel tért vissza.
- [x] Az új access és refresh tokenek titkosítva kerültek a connection rekordba, majd visszafejtve a várt értéket adták.
- [x] A `refresh_lock_token` és `refresh_lock_until` a teszt végén `NULL` állapotba került.
- [x] A teszt eredménye: **1 test, 1 pass, 0 fail**.
- [x] Futtatási környezet: Node `v24.21.0`.
- [x] A közvetlen Node ESM futtatás extension nélküli TypeScript importja miatt külön, csak tesztfuttatásra használt `tests/ts-extension-loader.mjs` loader szükséges; production `src/` importokat nem módosítottuk.

**Commit:** `793b9cb79e0991ecbd4258833e0c8f834a8f6237` — `tests: add Twitch refresh concurrency test`.

**Fontos korlát:** ez a teszt a D1 refresh lock + refresh művelet concurrency primitívét bizonyítja. Nem helyettesíti a teljes `401 → getValidTwitchAccessToken() → refresh → revalidate` live lifecycle tesztet.

**Következő egyetlen aktív tesztkapu:** B.10 — invalid/revoked token → reauthorization recovery és no-secret/no-token leakage célzott ellenőrzése. Builder/Inspector fejlesztés továbbra is blokkolt.



**B.10 — INVALID/REVOKED TOKEN → REAUTHORIZATION RECOVERY + NO-SECRET/NO-TOKEN LEAKAGE — 2026-09-23**

**Státusz:** [x] PASS — célzott automatizált recovery/security teszt sikeres.

**Cél:** bizonyítani, hogy egy Twitch validation 401 után a canonical service refresh útvonalat indít, sikertelen refresh esetén a connection `reauthorization_required` állapotba kerül, a refresh lock felszabadul, és a belső hiba nem tartalmaz tokent vagy client secretet.

**Tesztbizonyíték:**
- [x] A meglévő `tests/twitch-oauth.test.js` D1 fake rétegét használtuk; nem készült második párhuzamos fake/adatkezelési út.
- [x] A Twitch validation fake endpoint 401 választ adott.
- [x] A canonical `getValidTwitchAccessToken(..., { forceValidation: true })` ezután a Twitch refresh endpointot hívta.
- [x] A fake refresh endpoint 400 `invalid_grant` választ adott.
- [x] A canonical refresh hiba `TWITCH_REFRESH_FAILED` lett.
- [x] A D1 connection státusza `reauthorization_required` lett.
- [x] A refresh lock a hibás refresh után is felszabadult.
- [x] A hibaüzenetben nem szerepelt az access token, refresh token vagy client secret.
- [x] A teszt pontosan két HTTP hívást igazolt: validation → refresh.
- [x] Futtatás: Node `v24.21.0`, `node --loader ./tests/ts-extension-loader.mjs --test ./tests/twitch-oauth.test.js`.
- [x] Eredmény: **2 test, 2 pass, 0 fail**.
- [x] A `tests/ts-extension-loader.mjs` bekerült a repositoryba, kizárólag tesztfuttatási infrastruktúraként; production `src/` importokat nem módosít.

**Korlát:** ez a teszt a service-layer recovery + leakage tulajdonságokat bizonyítja. A route-szintű `TWITCH_REAUTHORIZATION_REQUIRED` HTTP 401 mapping és a production/live revoked-token recovery külön kapu marad.

**Következő egyetlen aktív tesztkapu:** 40.69.13.B.11 — production/live revoked-token recovery + no-secret/no-token leakage ellenőrzés. Builder/Inspector fejlesztés továbbra is blokkolt.


**B.10.a — ROUTE-LEVEL REAUTHORIZATION MAPPING + NO-TOKEN RESPONSE VERIFICATION — 2026-09-23**

**Státusz:** [x] PASS — célzott route-level automatizált teszt sikeres.

**Cél:** bizonyítani, hogy a valódi twitchValidationRoute() a valódi authentication és response contracton keresztül egy invalid access token → sikertelen refresh helyzetet biztonságosan HTTP 401 + TWITCH_REAUTHORIZATION_REQUIRED válaszra képez, tokenek vagy client secret nélkül.

**Tesztbizonyíték:**
- [x] A valódi twitchValidationRoute() került meghívásra; nem készült külön route-mock.
- [x] A valódi requireAuthenticatedUser() futott le a sanci9517_session cookie-val és a valódi SHA-256 session-token hash útvonalon.
- [x] A meglévő D1 fake ugyanazt a canonical auth + Twitch connection lekérdezési utat kezelte; nem készült második auth/D1 fake rendszer.
- [x] A Twitch validation fake endpoint 401 választ adott.
- [x] A refresh fake endpoint 400 invalid_grant választ adott.
- [x] A route HTTP státusza pontosan 401 lett.
- [x] A route body pontosan TWITCH_REAUTHORIZATION_REQUIRED hibakódot adott.
- [x] A válasz body nem tartalmazta az access tokent, refresh tokent vagy client secretet.
- [x] A teszt pontosan két Twitch HTTP hívást igazolt: validation → refresh.
- [x] A D1 connection státusza reauthorization_required lett.
- [x] A refresh lock a hibás refresh után is felszabadult.
- [x] Futtatás: Node v24.21.0, node --loader ./tests/ts-extension-loader.mjs --test ./tests/twitch-oauth.test.js.
- [x] Eredmény: 3 test, 3 pass, 0 fail.
- [x] A korábbi B.10 két service-layer tesztje regresszió nélkül továbbra is PASS.

**Korlát:** ez a kapu a route mappinget és a válasz-leakage védelmet bizonyítja. Nem bizonyít production/live revoked-token recoveryt; ez külön B.11 kapu.

**Következő egyetlen aktív tesztkapu:** 40.69.13.B.11 — production/live revoked-token recovery + no-secret/no-token leakage. Builder/Inspector fejlesztés továbbra is blokkolt.
**B.11 — PRODUCTION/LIVE REVOKED-TOKEN RECOVERY + REAUTHORIZATION RECOVERY — 2026-09-23**

**Státusz:** [x] PASS — production/live recovery és reauthorization lifecycle igazolva.

**Cél:** bizonyítani, hogy a Twitch-fiókban külsőleg visszavont authorization után a production canonical validation route nem hagyja tévesen connected állapotban a kapcsolatot, a D1-ben reauthorization_required állapot jön létre, majd a canonical OAuth újraengedélyezés után a kapcsolat ismét connected állapotba kerül.

**Élő teszt bizonyíték:**
- [x] A Twitch Connections felületén a Sanci9517 alkalmazás hozzáférését külsőleg visszavontuk; nem a saját disconnect route-ot használtuk.
- [x] Az authenticated production `GET /api/integrations/twitch/validation` válasza pontosan `TWITCH_REAUTHORIZATION_REQUIRED` lett.
- [x] A production connection endpoint ezt követően `connected:false`, `status:"reauthorization_required"` állapotot adott.
- [x] A broadcaster azonosító és login a hibás állapotban is konzisztens maradt.
- [x] A validation route válaszában nem jelent meg access token, refresh token vagy client secret.
- [x] A canonical `/api/integrations/twitch/connect` OAuth flow-val újraengedélyeztük a kapcsolatot.
- [x] Az új authorization után a production connection endpoint ismét `connected:true`, `status:"connected"` állapotot adott.
- [x] Az új kapcsolat új `accessTokenExpiresAt` és `lastValidatedAt` értékekkel állt helyre.
- [x] Nem készült külön recovery flow vagy párhuzamos tokenkezelés; ugyanaz a canonical OAuth/token lifecycle állt helyre.

**Twitch külső szerződésének megerősítése:** a Twitch dokumentáció szerint a felhasználó a Connections oldalon visszavonhatja az alkalmazás authorizationét; az ilyen token érvénytelenné válhat, és a refresh token is invalidálódhat, ilyenkor új authorization szükséges. A Twitch a harmadik fél alkalmazások számára a token validation használatát is előírja. 

**Korlát:** a live Worker/observability logok külön no-secret/no-token auditja még nincs lezárva; ezt nem tekintjük B.11 bizonyítékának.

**B.13 lezárva:** disconnect/reconnect atomicity + state transition audit PASS.

**B.13 — DISCONNECT/RECONNECT ATOMICITY + STATE TRANSITION AUDIT — 2026-09-23**

**Státusz:** [x] PASS — failure-safe revocation state machine, automatizált regresszió és CI igazolva.

**Cél:** bizonyítani, hogy a Twitch külső revoke művelete és a saját D1 állapotátmenete között fellépő hiba nem hagyhatja a kapcsolatot tévesen `connected` állapotban, és a disconnect/reconnect lifecycle állapotai egyértelműek maradnak.

**Bizonyíték:**
- [x] A kezdeti teszt reprodukálta a valódi atomicitási rést: sikeres Twitch revoke után D1 update hiba esetén a korábbi logika tévesen `connected` állapotot hagyhatott volna.
- [x] A production javítás a külső revoke előtt `revocation_pending` állapotot ír D1-be.
- [x] Ha a `revocation_pending` előkészítő D1 update hibázik, a külső Twitch revoke nem indul el.
- [x] Sikeres Twitch revoke után a végső D1 átmenet csak `revocation_pending` → `revoked` irányban történhet.
- [x] Post-revoke D1 hiba esetén a kapcsolat nem térhet vissza tévesen `connected` állapotba; a failure-safe `revocation_pending` állapot marad a recovery alapja.
- [x] A célzott B.13 teszt erre a tulajdonságra lett módosítva: a post-revoke D1 failure soha nem hagyhatja a connectiont hamisan connected állapotban.
- [x] GitHub CI: a B.13 javítás és teszt sikeresen lefutott; a kapcsolódó Editor Core / Twitch Integration ellenőrzések PASS.
- [x] A korábbi B.4–B.12 lifecycle, recovery, security és observability kapuk regresszió nélkül lezártak.
- [x] B.13 lezárható PASS; Builder/Inspector fejlesztés a következő domain-contract kapuig továbbra is blokkolt.

**Módosító commitok:**
- `cd9f4cef54f496a3a5f6be26f9ac6d66aea6f82d` — production failure-safe `revocation_pending` state transition
- `aec520be0da3623e8953487d57a518099fc3b8f4` — B.13 post-revoke D1 failure regression test

**Következő egyetlen aktív tesztkapu:** 40.69.13.C.1 — Twitch → Schedule domain contract teljes audit és canonical mapping rögzítése. Builder/Inspector fejlesztés továbbra is blokkolt.

#### C.1 — TWITCH → SCHEDULE DOMAIN CONTRACT + CANONICAL MAPPING AUDIT — 2026-09-24

**Státusz:** [x] PASS — szerződés és edge-case audit lezárva; kódmódosítás ebben a lépésben nem történt.

**Audit scope:**
- [x] Meglévő canonical D1 domain: `schedule_items`.
- [x] Meglévő public read contract: `src/core/schedule-read.ts`.
- [x] Meglévő admin Schedule CRUD: `src/routes/admin/schedule.ts`.
- [x] Twitch OAuth/token boundary: `src/core/twitch-oauth.ts`; a Schedule service ezt használja majd, nem kezel külön access/refresh tokent.
- [x] Twitch Schedule API és Streams API hivatalos szerződés ellenőrizve.

**Canonical ownership döntés:**
- [x] A Sanci Schedule domain marad a saját D1 canonical source of truth.
- [x] Twitch csak külső `source`/sync forrás; nem írhat közvetlenül Page Modelbe.
- [x] A Page Model / `schedule` node csak a canonical Schedule domainből olvas.
- [x] Manual és Twitch eredetű rekord együtt élhet.
- [x] Nincs csendes cross-source felülírás.
- [x] A Sanci saját `id` megmarad domain-owned ID-ként; Twitch `segment.id` kizárólag külső `sourceId`.

**Canonical source mapping — rögzített:**
- `source` = `manual` | `twitch` | későbbi integráció.
- `sourceId` = Twitch `segment.id` egy adott schedule occurrence-hoz.
- `sourceAccountId` = Twitch `broadcaster_id`.
- `title` ← Twitch `title`.
- `startsAt` ← Twitch `start_time` (UTC RFC3339 → canonical instant).
- `endsAt` ← Twitch `end_time` (UTC RFC3339 → canonical instant).
- `platform` = `twitch` Twitch-forrású rekordnál.
- `url` = canonical Twitch channel URL / későbbi explicit source URL stratégia; nem generálunk URL-t nem validált külső inputból.
- `status` = `cancelled`, ha `canceled_until != null`; egyébként schedule state-ből `scheduled`/`completed`, míg tényleges `live` állapotot a Twitch Streams API külön live presence-ként felülrétegzi.
- `isRecurring` = Twitch `is_recurring`.
- `game/category` adatait külön canonical játékprofil-referenciaként kezeljük; a Twitch category név/id nem írja felül automatikusan a saját játékprofilt.

**Edge-case döntések:**
1. **Recurring segment:** minden API-ban kapott occurrence külön canonical schedule occurrence rekord; `sourceId` az adott Twitch occurrence ID. Nem próbálunk nem dokumentált recurrence-master ID-t kitalálni.
2. **`canceled_until`:** nem töröljük a rekordot. A forrásállapotot `cancelled`-ként őrizzük, hogy auditálható és ütközéskezelhető maradjon.
3. **Twitch schedule 404 / üres:** 404 azt jelenti, hogy a broadcasternek nincs létrehozott Twitch schedule-je; ez nem jogosít fel a teljes saját Sanci Schedule törlésére. A sync eredmény legyen `source_empty`/no-source-data jellegű állapot, és a manual rekordok érintetlenek maradnak.
4. **Twitch live + schedule egyszerre:** a live állapot nem módosítja vissza a schedule rekord kezdés/végzés adatait. A `live` megjelenítési állapot derived/live presence, nem tartós forrásadat-felülírás.
5. **Twitchen módosított rekord:** ugyanazon `source + sourceAccountId + sourceId` kulcson idempotens upsert történik; a Twitch által birtokolt mezők frissülnek.
6. **Twitchen törölt rekord:** a következő teljes sync során a korábban látott, de már nem visszakapott Twitch rekordot nem hard-delete-eljük azonnal. `source_missing`/sync metadata jelzéssel kezeljük; a végleges cleanup külön lifecycle szabály lesz.
7. **Duplikált Twitch segment:** ugyanazon external key mellett egy canonical rekord; duplicate input nem hoz létre második Sanci rekordot.
8. **Lejárt/érvénytelen Twitch token:** kizárólag a meglévő canonical `getValidTwitchAccessToken()` lifecycle használható. `reauthorization_required` esetén sync nem hamisít üres schedule-t és nem töröl adatot.
9. **Több platform:** a domain nem Twitch-specifikus; `platform` továbbra is domainmező, későbbi YouTube/TikTok/manual source külön adapterrel jöhet.
10. **Manual/Twitch collision:** külön source ownership; nincs automatikus merge csak hasonló cím/idő alapján. A felhasználói manual rekordot a Twitch sync nem írhatja felül.
11. **Timezone/UTC:** a storage canonical instantként UTC/RFC3339; UI conversion későbbi display concern. Twitch read schedule UTC időt ad vissza; a Twitch create API IANA timezone-ja nem kerül át a canonical read modelbe automatikusan.
12. **Pagination:** Twitch schedule forward cursoros; a syncnek a `pagination.cursor` alapján minden releváns oldalt le kell olvasnia, bounded/safety limit mellett. Nem csak az első 25 rekordot szabad canonicalnak tekinteni.

**Live-state döntés:**
- [x] `/helix/streams?user_id=<broadcaster_id>` az élő állapot külön source-ja.
- [x] Ha van live stream: UI-derived status = `live`.
- [x] Ha nincs live stream: a persisted schedule status nem lesz automatikusan `completed` pusztán egy üres Streams válasz miatt; a schedule időablak és sync policy alapján történik.
- [x] Twitch Streams API válaszai önmagukban nem írják át a schedule event címét, idejét vagy source identity-jét.

**Scope/security döntés:**
- [x] Schedule olvasáshoz Twitch app vagy user access token elegendő; `channel:manage:schedule` csak schedule-módosító endpointokhoz szükséges, ezért read-only sync miatt nem kérünk indokolatlan manage scope-ot.
- [x] A sync service a canonical OAuth/token boundaryt használja; tokenek nem kerülnek D1 schedule rekordba, Page Modelbe vagy kliens response-ba.
- [x] 401/revocation esetén a meglévő reauthorization lifecycle marad az egyetlen recovery út.

**Elutasított irányok:**
- [x] Twitch `segment.id` nem válik Sanci primary key-vé.
- [x] Twitch schedule nem válik a weboldal közvetlen source of truth-jává.
- [x] Live status nem írja át tartósan a schedule időpontját.
- [x] 404 miatt nem töröljük a manual/canonical schedule teljes tartalmát.
- [x] Nem készül külön Twitch Schedule Builder vagy második editor.
- [x] Nem vezetünk be most EventSub-alapú schedule truth-t; a Schedule sync első canonical változata pull/sync alapú lesz. EventSub későbbi freshness-optimalizálás lehet.

**Hivatalos Twitch szerződés bizonyítéka:** a Twitch `Get Channel Stream Schedule` 200-as válasza occurrence-alapú `id/start_time/end_time/title/canceled_until/category/is_recurring` adatokat és cursoros paginationt ad; 404 azt jelenti, hogy nincs létrehozott streaming schedule. A `Get Streams` user_id alapján adja a live presence-t. A Twitch dokumentáció szerint a schedule olvasása app/user tokennel működik, míg a `channel:manage:schedule` scope a módosító műveletekhez kell. citeturn0search0turn1search0turn2search0turn2search1



#### C.3 — SCHEDULE SOURCE/SYNC MIGRATION IMPLEMENTÁCIÓ — 2026-09-24

**Státusz:** [x] PASS — migration runtime/schema/integrity verification lezárva — 2026-09-24.

**Implementáció:**
- [x] Új migration létrejött: `migrations/0013_schedule_source_sync.sql`.
- [x] A meglévő `schedule_items` táblához hozzáadva: `source`, `source_id`, `source_account_id`, `source_presence`, `source_synced_at`, `source_missing_at`, `is_recurring`, `source_category_id`, `source_category_name`.
- [x] Meglévő rekordok kompatibilitása biztosított: `source='manual'`, `source_presence='present'`, `is_recurring=0` defaulttal.
- [x] External identityhez külön UNIQUE index készült: `(source, source_account_id, source_id)`.
- [x] Source/account/start lookup index elkészült.
- [x] Source/account/presence/start reconciliation index elkészült.
- [x] `schedule_sync_state` canonical sync-state tábla létrejön a C.2-ben rögzített állapotokkal.
- [x] Sync-state státusz- és updated indexek elkészülnek.
- [x] A migration nem írja át és nem rebuildeli a meglévő `schedule_items` táblát.
- [x] A Twitch refresh-lock migration (`0012`) változatlan maradt.

**Migration technikai ellenőrzés:**
- [x] A migration fájlt GitHubon visszaolvastuk a `v2/foundation` branchen.
- [x] A SQLite stratégia megfelel a korábban rögzített C.2 döntésnek: az ADD COLUMN nem kap UNIQUE/PRIMARY KEY constraintet; az external identity külön UNIQUE indexként készül. SQLite ezt támogatja, és a NULL értékeket UNIQUE indexben különbözőnek tekinti. citeturn0search1turn0search3
- [x] Remote D1 `schedule_items` schema ellenőrzés PASS: source/sync mezők jelen vannak a canonical migration szerint.
- [x] Remote D1 index ellenőrzés PASS: external identity UNIQUE, source/account/start és source/account/presence/start indexek jelen vannak.
- [x] Remote D1 `schedule_sync_state` tábla és oszlopai ellenőrizve.
- [x] Remote D1 `PRAGMA quick_check` → `ok`.
- [x] Remote D1 migration state: `npx wrangler d1 migrations list sanci9517-db --remote` → `No migrations to apply!`.
- [x] Repository provenance ellenőrizve: `migrations/0013_schedule_source_sync.sql` pontosan lefedi a remote schema-változásokat; új migration nem szükséges.
- [x] Korábbi SQLite migration/integrity regression PASS továbbra is érvényes.
- [D] A C.3 célzott remote runtime/schema kapu lezárva; további adatbázis-módosítás csak új, indokolt migrationnel történhet.

**Commit:**
- `79a4ef776400c891900adf44c56fd87154a6460f` — `feat(schedule): add canonical source and sync schema`

**Következő egyetlen aktív munkapont:** **40.69.13.C.5 — canonical source-aware Schedule service/mapper minimális implementáció + contract/regression tesztek.**

#### C.4 — CANONICAL SOURCE-AWARE SCHEDULE SERVICE / MAPPER RUNTIME CONTRACT — KÖVETKEZŐ AKTÍV MUNKAPONT

**Státusz:** [x] PASS — canonical Schedule service/mapper runtime contract audit lezárva — 2026-09-24. Ebben a lépésben runtime kódmódosítás nem történt.

**Cél:** a már lezárt D1 source/sync adatmodell fölé egyetlen canonical Schedule service + mapper adatfolyamot kialakítani, amely a Twitch adapterből érkező validált DTO-t a schedule_items és schedule_sync_state domainbe vezeti, miközben a manual rekordok és a public read contract sértetlenek maradnak.

**Kötelező audit sorrend:**
1. Meglévő schedule CRUD, read service, route-ok és repository/data-access réteg teljes visszaolvasása.
2. Meglévő Twitch OAuth/token service és Twitch API kliens boundary teljes auditja.
3. Canonical external DTO → Schedule mapper input/output szerződés rögzítése.
4. Ownership szabályok véglegesítése: Twitch-owned mezők, manual-owned mezők, source metadata és derived live state.
5. Idempotent upsert, duplicate protection, missing reconciliation és sync-state transition runtime szerződésének rögzítése.
6. 401 / reauthorization, 404/source_empty, rate-limit, partial pagination és transient failure viselkedésének rögzítése.
7. Concurrency/lock stratégia összevetése a meglévő Twitch refresh-lock és Schedule sync state modellel.
8. Public read compatibility ellenőrzése: a source/sync belső mezők nem kerülhetnek ki indokolatlanul a public contractba.
9. Csak az audit PASS után következhet a minimális service/mapper implementáció.

**Audit eredmény — C.4:**
- [x] src/core/schedule-read.ts teljes audit: a public read csak canonical public mezőket ad vissza; source/sync belső mezők nem kerülnek ki. A query kizárólag a schedule_items canonical domainből olvas.
- [x] src/routes/public/schedule.ts audit: a public endpoint a canonical read service egyetlen útját használja; nincs külön source-aware public adatút.
- [x] src/routes/admin/schedule.ts audit: manual CRUD közvetlenül a schedule_items domainen dolgozik; az új 0013 defaultokkal a manual rekordok source='manual', source_presence='present', is_recurring=0 értékeket kapnak. A Twitch sync nem használhatja ezt a route-ot adapterként.
- [x] src/core/twitch-oauth.ts audit: a canonical getValidTwitchAccessToken() marad az egyetlen Twitch access-token boundary; a Schedule service nem tárolhat/dekódolhat külön tokent és nem kezelhet saját refresh lifecycle-t. A meglévő refresh lock külön felelősség.
- [x] src/routes/integrations/twitch.ts audit: OAuth/connect/validation/disconnect route-ok nem keverhetők a Schedule sync domainnel; a sync service szerveroldali domain/service réteg marad.
- [x] src/index.ts audit: jelenleg nincs Twitch Schedule sync endpoint; C.5-ben egy canonical internal/admin sync belépési pont készülhet, de nem hozható létre második public Schedule adatút.
- [x] Repository history audit: a C.3 migration után nem található meglévő canonical Schedule sync/mapper/service implementáció; ezért C.5-ben egyetlen új canonical service/mapper réteg készül, nem meglévő párhuzamos megoldást foltozunk.
- [x] Canonical runtime flow: Twitch OAuth/token service → Twitch Schedule adapter → validált external DTO → canonical Schedule mapper → D1 schedule_items + schedule_sync_state → existing readPublicSchedule() → későbbi schedule Editor node.
- [x] External ownership: Twitch-owned title/startsAt/endsAt/platform/source identity/isRecurring/source category metadata csak source='twitch' rekordot frissíthet; manual rekordot source sync nem módosíthat.
- [x] Derived live state külön marad: Streams API live presence nem írja át tartósan a Schedule rekord idő- vagy identity mezőit.
- [x] Idempotency: (source, source_account_id, source_id) az egyetlen external identity; upsert ezen történik. Duplicate external input nem hozhat létre második canonical rekordot.
- [x] Missing reconciliation: csak teljes, sikeres, explicit window sync után engedélyezett; 404, 401, rate-limit vagy részleges pagination esetén nincs destructive missing reconciliation.
- [x] Sync-state transition matrix: idle → running → success/source_empty/rate_limited/reauthorization_required/failed; running alatt konkurens második sync nem indulhat.
- [x] Concurrency: a Twitch token refresh lock és a Schedule sync lock/state két külön lock-domain; egyik nem használható a másik helyettesítésére.
- [x] Error policy: 401/invalid token → canonical reauthorization lifecycle; 404/no schedule → source_empty, manual rekordok változatlanok; rate-limit → rate_limited; partial/transient failure → failed; egyik eset sem jogosít automatikus delete-re.
- [x] Pagination: a Twitch Schedule adapternek a teljes releváns cursoros oldalsort le kell olvasnia bounded safety limit mellett; az első oldal önmagában nem canonical teljes eredmény.
- [x] Public compatibility: source/sync state csak belső persistence metadata; a jelenlegi public DTO nem bővül automatikusan ezekkel.
- [x] C.5 boundary: adapter + mapper + sync service külön felelősségek, de egy canonical Schedule adatút; nem készül második repository vagy Schedule table.
- [x] Contract/regression test scope: manual isolation, idempotent upsert, duplicate identity, missing reconciliation guard, 404/source_empty, 401/reauthorization, rate-limit, pagination, sync-state transitions, public DTO leakage és concurrency.
- [x] Builder/Inspector továbbra is blokkolt a C.5 implementáció és tesztkapu lezárásáig.

**C.4 döntés:** a runtime audit alapján nincs szükség schema-módosításra. A következő módosítás kizárólag a canonical adapter/mapper/sync service implementáció lehet, a C.5-ben rögzített contract szerint.

**Definition of Done:**
- [ ] minden érintett runtime fájl és adatfolyam auditálva;
- [ ] canonical service/mapper ownership és input/output contract rögzítve;
- [ ] error/state transition matrix rögzítve;
- [ ] concurrency/idempotency stratégia auditálva;
- [ ] public read backward compatibility igazolva;
- [ ] implementáció csak egy canonical adatúton történik;
- [ ] automatizált/contract tesztterv rögzítve;
- [ ] MASTER frissítve az audit eredményével, mielőtt Builder/Inspector fejlesztés indul.

**Szigorú blokkolás:** Schedule Builder/Inspector UI, Twitch Schedule write endpoint vagy második Schedule adatút nem indulhat el a C.4 audit lezárása előtt.

**Státusz:** [x] PASS — adatmodell és migration stratégia lezárva; ebben a lépésben nincs kódmódosítás.

**Megvizsgált jelenlegi állapot:**
- [x] `schedule_items` jelenleg source identity nélkül működik.
- [x] Meglévő manual rekordokat meg kell őrizni.
- [x] Twitch OAuth connection külön canonical domain; a Schedule rekordokba token vagy secret semmilyen formában nem kerülhet.
- [x] A Twitch refresh-lock külön migrationben (`0012_twitch_refresh_lock.sql`) él; ezt nem keverjük a Schedule migrationnel.
- [x] A public read jelenlegi contractját csak a source-aware backend elkészülte után módosítjuk, nem előre.

**Rögzített canonical Schedule rekordmodell:**
```
schedule_items
  id                  Sanci-owned primary key
  source              manual | twitch | későbbi integration
  source_id           external occurrence/record ID, nullable manualnál
  source_account_id   external account/broadcaster ID, nullable manualnál
  source_presence     present | missing, default present
  source_synced_at    utolsó sikeres source-observation timestamp
  source_missing_at   mikor vált source_missing állapotúvá, nullable
  is_recurring        0/1, default 0
  source_category_id  nullable external category/game ID
  source_category_name nullable external category/game display name
  title
  platform
  starts_at
  ends_at
  status
  url
  notes
  created_at
  updated_at
```

**Fontos ownership szabály:**
- [x] `source` + `source_id` + `source_account_id` az external identity; Twitch sync ezen a kulcson idempotens.
- [x] Sanci `id` soha nem lesz external ID.
- [x] `source_category_*` kizárólag source metadata; saját játékprofil-rendszer később külön domain lesz.
- [x] `source_presence='missing'` nem jelent hard delete-et.
- [x] Manual rekordok `source='manual'` értékkel kerülnek backfillre.
- [x] Meglévő rekordok tartalma nem változik a migration során, csak az új source mezők kapnak biztonságos defaultot.

**Canonical sync-state tábla:**
```
schedule_sync_state
  id
  source
  source_account_id
  status
  window_start_at
  window_end_at
  last_started_at
  last_succeeded_at
  last_completed_at
  last_seen_count
  last_error_code
  last_error_at
  updated_at
  UNIQUE(source, source_account_id)
```

Engedélyezett sync-state értékek:
- `idle`
- `running`
- `success`
- `source_empty`
- `reauthorization_required`
- `rate_limited`
- `failed`

**Sync window / reconciliation stratégia:**
- [x] Nem használjuk a Twitch alapértelmezett „mostantól” lekérést teljes reconciliation truth-ként.
- [x] A sync explicit `start_time`-mal dolgozik, hogy a teljes vizsgált időablak determinisztikus legyen.
- [x] Első canonical verzióban a window a sync policy konfigurációja; a migration nem éget fix nap-számot a domainbe.
- [x] Egy successful full sync után csak a ténylegesen lefedett window korábban látott Twitch rekordjai jelölhetők `missing` állapotúra.
- [x] 404 esetén nincs destructive reconciliation; a sync-state `source_empty`, a manual és korábbi canonical rekordok megmaradnak.
- [x] Részleges/failed/rate-limited sync esetén **tilos** missing reconciliationt futtatni.
- [x] `reauthorization_required` esetén **tilos** üres schedule-ként kezelni a forrást.

**Migration stratégia:**
- [x] Új migration külön fájlban, az aktuális utolsó migration után készül; meglévő migrationt nem írunk át.
- [x] A `schedule_items` új mezői nullable/defaultolt formában kerülnek hozzáadásra, majd kontrollált backfill történik.
- [x] Mivel SQLite ALTER TABLE korlátozott, új UNIQUE identity indexet külön `CREATE UNIQUE INDEX` formában készítünk; az existing manual NULL source identityk nem ütköznek. SQLite a NULL értékeket UNIQUE alatt különbözőnek tekinti. citeturn2search0turn2search2
- [x] A migration nem végez destructive table rebuildet.
- [x] Existing schedule data rollbackja csak külön backup/rollback migrationnel történhet; implicit adatvesztés nem megengedett.
- [x] Migration után schema/integrity és canonical Schedule regression kötelező.

**Indexek:**
- [x] unique external identity: `(source, source_account_id, source_id)`
- [x] lookup: `(source, source_account_id, starts_at)`
- [x] public read továbbra is `starts_at/status/platform` szerint optimalizálható.
- [x] sync reconciliationhez `source/source_account_id/source_presence/starts_at` kombináció szükséges.

**Data-flow ownership:**
```
Twitch OAuth connection
        ↓
canonical token service
        ↓
Twitch Schedule adapter
        ↓
validated external DTO
        ↓
canonical Schedule mapper
        ↓
D1 schedule_items + schedule_sync_state
        ↓
public Schedule read
        ↓
Editor schedule node
        ↓
Page publish/render
```
A Page Model nem tárolja a schedule rekordokat.

**Concurrency / idempotency:**
- [x] Egy source-account alatt egyszerre futó sync-et DB state/lock stratégia védi.
- [x] Ugyanaz az external identity ismételt importja ugyanazt a Sanci rekordot frissíti.
- [x] Missing reconciliation csak teljes, sikeres window sync után futhat.
- [x] A sync-state nem kerül a public API response-ba.
- [x] User-facing CRUD és source-sync ownership külön marad; Twitch sync nem írhat manual rekordot.

**Elutasított irányok:**
- [x] Nem duplikáljuk a teljes Twitch payloadot egy korlátlan `metadata_json` mezőben.
- [x] Nem tesszük a Twitch ID-t primary key-vé.
- [x] Nem hozzuk létre a Schedule rekordokat Page Model JSON-ban.
- [x] Nem használunk implicit „404 = delete all” logikát.
- [x] Nem készítünk külön Twitch Schedule táblát a canonical `schedule_items` helyett.
- [x] Nem kérünk Schedule manage scope-ot read-only sync miatt.

**C.2 Definition of Done:**
- [x] canonical source-aware schema rögzítve;
- [x] external identity rögzítve;
- [x] sync-state rögzítve;
- [x] reconciliation/missing szabály rögzítve;
- [x] migration/backward compatibility stratégia rögzítve;
- [x] concurrency/idempotency stratégia rögzítve;
- [x] Builder/Inspector továbbra is blokkolt.

**Következő egyetlen aktív munkapont:** **40.69.13.C.4 — canonical source-aware Schedule service/mapper runtime contract audit + implementáció előkészítés.** Builder/Inspector implementáció továbbra is blokkolt.




**B.12 — PRODUCTION/OBSERVABILITY NO-SECRET/NO-TOKEN LEAKAGE AUDIT — 2026-09-23**

**Státusz:** [x] PASS — production Observability query-string leakage megszüntetése és live OAuth callback ellenőrzése igazolva.

**Cél:** bizonyítani, hogy a production Worker Observability request URL-jei nem rögzítik a Twitch OAuth callback query stringjét, így az authorization code, OAuth state és scope nem kerül logolt request URL-be.

**Implementáció és deploy bizonyíték:**
- [x] A kezdeti nested `observability.logs.redact_query_string` konfigurációt a Cloudflare build warningja miatt elvetettük; az nem volt érvényes Wrangler 4.130.0 konfiguráció.
- [x] A canonical konfiguráció a top-level `observability.redact_query_string: true` beállításra lett javítva.
- [x] A javított konfiguráció commitja: `69c3ce1e73f624e82134a6fc643686be4fbbf50e`.
- [x] Production deploy sikeres, Worker version: `a1f4bda7-4981-4a15-8abe-4fa67057c641`.
- [x] A deploy során a typecheck PASS volt.
- [x] A deploy során nem jelent meg az előző `Unexpected fields found in observability field` warning.
- [x] D1 migration állapot: `No migrations to apply!`.

**Live Observability bizonyíték:**
- [x] A production OAuth újracsatlakoztatási folyamatot a javított deploy után lefuttattuk.
- [x] Az új Twitch callback esemény időpontja: `2026-09-23 20:57:45.666 CEST`.
- [x] Az új callback Observability üzenete kizárólag a callback útvonalat mutatta: `GET .../api/integrations/twitch/callback`.
- [x] Az új callback URL-jében nem jelent meg `code`, `state` vagy `scope` query paraméter.
- [x] A régi, 20:37-es callback query stringje csak a korábbi deploy eseményében látszott; ezt nem tekintjük az új konfiguráció működésének cáfolatának.
- [x] A kapcsolódó 20:57-es production Twitch connect/disconnect/connection események sikeresen lefutottak, 0 Errors mellett.
- [x] A logban access token, refresh token vagy client secret nem jelent meg.

**Biztonsági következtetés:**
- [x] Az OAuth authorization code request-URL leakage probléma a production Observabilityben a javított deploy után megszűnt.
- [x] A `redact_query_string` beállítás a request URL query stringjének logolását maszkolja; a secret/token értékek server-side kezelése továbbra is canonical maradt.
- [x] A B.12 live teszt bizonyítéka a 20:57-es új callback esemény; korábbi logbejegyzések történeti események.

**Korlát:** ez a kapu a Cloudflare Worker request URL / Observability leakage felületét ellenőrizte. Nem minősíti a Cloudflare platform belső, szolgáltatói logkezelését, és nem helyettesíti az alkalmazás response-body / exception-message leakage tesztjeit, amelyeket B.10/B.10.a már célzottan ellenőriztek.

**Következő egyetlen aktív tesztkapu:** 40.69.13.B.13 — disconnect/reconnect atomicity + state transition audit. Builder/Inspector fejlesztés továbbra is blokkolt.


#### C.5 — CANONICAL TWITCH SCHEDULE ADAPTER / MAPPER / SYNC CORE + CONTRACT TEST GATE — 2026-09-24

**Státusz:** [x] IMPLEMENTATION + CI CONTRACT TEST PASS — 2026-09-24. A C.5 első runtime implementációs kapuja lezárva; a teljes remote D1 sync/runtime tesztkapu a következő C.5 al-lépés.

**Implementáció:**
- [x] src/core/schedule/types.ts — canonical Schedule sync/domain DTO-k és determinisztikus UTC window-normalizálás.
- [x] src/core/schedule/mapper.ts — Twitch external segment → canonical schedule_items input mapper.
- [x] src/core/schedule/twitch-adapter.ts — Twitch Get Channel Stream Schedule adapter.
- [x] src/core/schedule/sync.ts — canonical upsert, sync-state transition, concurrency guard és successful-window missing reconciliation.
- [x] public/editor-v2/tests/schedule-source.test.js — window/mapper contract regression tesztek.
- [x] package.json — test:schedule CI parancs.
- [x] .github/workflows/editor-core-test.yml — canonical Schedule contract teszt bekerült a CI kapuba.

**Twitch API contract ellenőrzés:**
- [x] A hivatalos Twitch dokumentáció alapján a Get Channel Stream Schedule app access tokennel vagy user access tokennel olvasható; ehhez a read endpointhez nem kell külön schedule-read scope. A channel:manage:schedule scope a módosító műveletekhez tartozik. citeturn4view0turn0search2
- [x] A schedule response segmentenként external id, start_time, end_time, title, canceled_until, category és is_recurring mezőket ad; cursoros pagination használható, a page size maximuma 25. citeturn0search0
- [x] A canonical external identity továbbra is (source, source_account_id, source_id), ahol Twitchnél source_id a Twitch schedule segment ID, source_account_id a broadcaster ID.

**Ownership / safety:**
- [x] Twitch sync csak source='twitch' rekordot kezel.
- [x] Manual rekordot a Twitch upsert nem ír felül.
- [x] Twitch segment ID nem válik Sanci primary key-vé.
- [x] A live presence nem kerül tartós Schedule status-logikába; a mapper csak scheduled/cancelled állapotot állít elő a Twitch occurrence adataiból.
- [x] Missing reconciliation csak sikeres, teljesen bejárt explicit window után fut.
- [x] Adapter 401/404/429/5xx hibái külön canonical hibakódokra fordulnak; ezek nem indítanak destructive reconciliationt.
- [x] Pagination bounded: alapértelmezett 100 oldal, oldalanként legfeljebb 25 Twitch segment.
- [x] Token kezelés továbbra is a meglévő getValidTwitchAccessToken() canonical boundaryn történik; az adapter nem tárol tokent.

**CI bizonyíték:**
- [x] TypeScript typecheck PASS.
- [x] Existing Editor Core regression tests PASS.
- [x] Új canonical Schedule contract tests PASS.
- [x] Twitch Integration Check PASS.
- [x] Editor Core Test PASS a canonical schedule tests lépéssel.
- [x] PASS futások a v2/foundation branch aktuális C.5 kódjára: Editor Core Test run 36032375136, Twitch Integration Check run 36032375168.

**Korlát / következő C.5 kapu:**
- [ ] Remote D1 integrációs teszt: idempotent upsert + duplicate external identity.
- [ ] Manual isolation regresszió remote/test D1-en.
- [ ] Missing reconciliation guard és source_presence lifecycle remote/test D1-en.
- [ ] Concurrent running sync rejection remote/test D1-en.
- [ ] schedule_sync_state teljes transition matrix runtime ellenőrzése.
- [ ] Adapter 404/401/429 viselkedés integrációs ellenőrzése.
- [ ] Public Schedule DTO leakage regression a source/sync mezőkre.

**Következő egyetlen aktív munkapont:** **40.69.13.C.5.1 — remote/test D1 canonical Schedule sync integration + regression gate.**

**Builder/Inspector blokkolás:** továbbra is aktív; a Schedule Builder/Inspector UI csak a C.5 teljes runtime/integrációs tesztkapu PASS után indulhat.


**C.5.1 deployment/sync diagnosztika — 2026-09-24:**
- [x] A friss Worker deploy sikeresen lefutott; aktuális production Worker version: `d0bcdada-a660-422c-98bc-83471b90f811`.
- [x] `/api/health` live 200 OK: általános Worker deployment/URL működés igazolva.
- [x] `POST /api/admin/twitch/schedule-sync` unauthenticated hívás 401 `UNAUTHORIZED`: auth boundary működik.
- [x] Live login sikeres; admin userrel létrejött authenticated session.
- [x] Authenticated schedule sync trigger sikeres: `status=source_empty`, `seenCount=0`, `upsertedCount=0`, `missingCount=0`.
- [x] A korábbi live 404 okának feltárása lezárva: GitHub/local sync után az admin route és az `src/index.ts` bekötése a deployált állapot része lett.
- [x] GitHub `v2/foundation` és lokális VS Code repository állapot szinkronban van a vizsgált C.5 route/source állapottal.
- [x] TypeScript typecheck PASS.
- [x] Editor Core regression: 30/30 PASS.
- [x] Schedule contract regression: 5/5 PASS.
- [x] A korábbi remote D1 inspection SQL-hiba csak tesztlekérdezési schema-mismatch volt (`is_deleted` oszlop nem létezik); adatbázis-módosítás nem történt.

**C.5.1 remote D1 runtime verification — 2026-09-24:**
- [x] Remote schema tényleges ellenőrzése: `schedule_items.source_presence`, `source_synced_at`, `source_missing_at` és a canonical `schedule_sync_state` mezők igazolva.
- [x] Manual isolation PASS: `schedule_items` állapot jelenleg `manual / present / 3`; a Twitch sync nem módosította a meglévő 3 manual rekordot.
- [x] Twitch sync-state rekord létrejött a broadcasterhez; `status=source_empty`, `last_seen_count=0`, `last_started_at`, `last_succeeded_at` és `last_completed_at` kitöltve.
- [x] A source-empty futás `last_error_code=TWITCH_SCHEDULE_SOURCE_EMPTY` értéket rögzített; ez nem destructive reconciliation.
- [x] Remote D1 `PRAGMA quick_check` = `ok`.
- [x] A remote D1 inspection kizárólag SELECT/PRAGMA parancsokat használt; adatot nem módosított.
- [x] Idempotent upsert + duplicate external identity remote D1 regression PASS: ugyanazon `(source, source_account_id, source_id)` identity mellett 2 upsert után pontosan 1 rekord maradt, a második upsert adatai (`C5.1 TEST B`) érvényesültek; a tesztadat a futás végén törölve lett.
- [x] Missing reconciliation guard + `source_presence` lifecycle remote D1 regression PASS: `present → missing` kitöltött `source_missing_at` értékkel, majd `missing → present` esetén `source_missing_at=NULL` és `source_synced_at` frissült; már `missing` rekordot a `source_presence='present'` guard miatt az ismételt reconciliation UPDATE nem módosította.
- [x] Concurrent running sync rejection tényleges production runtime regression PASS: remote D1 `status='running'` előállítása után az authenticated `POST /api/admin/twitch/schedule-sync` válasza 409 `SCHEDULE_SYNC_ALREADY_RUNNING` lett.
- [x] A concurrency teszt cleanup után a Twitch sync-state visszaállt `idle` állapotra, `last_error_code=NULL` értékkel.
- [x] Sync-state transition matrix remote D1 runtime regression PASS: `idle → running → success` útvonal és running alatti második indítás elutasítása igazolva; a `last_started_at`, `last_succeeded_at`, `last_completed_at`, `last_seen_count` és `last_error_code` mezők viselkedése megfelelt a contractnak.
- [x] Adapter HTTP 401/404/429 canonical mapping unit/contract regresszió: 8/8 schedule-source teszt PASS.
- [x] Public Schedule DTO source/sync mező leakage regression: 8/8 schedule-source tesztben PASS.
- [ ] Adapter 401/404/429 tényleges production/integration runtime teszt még nincs lezárva.
- [ ] Public Schedule DTO production endpoint élő leakage teszt még nincs lezárva.
- [ ] Twitch OAuth teljes regressziós teszt CI-ban még nincs lezárva; a #91 extensionless import hibája javítva, #92 folyamatban.

- [x] Live API concurrency regression PASS: a remote D1-ben előállított `running` sync-state mellett authenticated `POST /api/admin/twitch/schedule-sync` hívás canonical `409 SCHEDULE_SYNC_ALREADY_RUNNING` hibával tért vissza.
- [x] A PowerShell `Invoke-WebRequest` a 409-es HTTP választ exceptionként jelezte, ezért a `$runningTest.StatusCode` / `$runningTest.Content` változók nem töltődtek fel; ez kliensoldali viselkedés, nem API-hiba. A response body közvetlenül a PowerShell hibakimenetben igazolható volt.
- [x] Concurrency regression cleanup PASS: a teszt végén a Twitch `schedule_sync_state` rekord `status=idle`, `last_error_code=NULL`.
- [x] A schedule contract regression aktuális futása: 5/5 PASS.

**C.5.1 aktuális egyetlen aktív lépés — 2026-09-25:**
- **Twitch runtime hardening + teljes regressziós gate.**
- [x] Node 24 ESM importlánc hibája azonosítva és `src/core/twitch-oauth.ts`-ban javítva.
- [x] CI workflow kibővítve `test:schedule` + `tests/twitch-oauth.test.js` futtatással; ez már nem engedi, hogy a Twitch OAuth regresszió rejtve maradjon.
- [x] `revocation_pending` schema mismatch gyökérok azonosítva és `0014_twitch_connection_status.sql` migration létrehozva.
- [x] Twitch OAuth scope frissítve `channel:manage:schedule` értékre a későbbi Schedule Builder kezelési műveleteihez.
- [ ] Twitch Integration Check #92 PASS.
- [ ] Editor Core #716 PASS.
- [ ] `0014` remote D1 apply + schema/quick_check.
- [ ] Szinkronizált local worktree ellenőrzés után Cloudflare production deploy.
- [ ] Live Twitch connection → validation → schedule sync újrateszt.
- [ ] Adapter 401/404/429 live/integration bizonyítás.
- [ ] Public Schedule DTO production leakage ellenőrzés.
- [ ] Csak ezek után C.5.1 lezárás.
- **Builder/Inspector továbbra is blokkolt a teljes C.5.1 gate PASS-ig.**

### 2026-09-25 OAuth CI hibafeltárás
- Twitch Integration Check #93 logja alapján a typecheck PASS, Editor Core 30/30 PASS, Schedule source 8/8 PASS.
- A tényleges egyetlen hiba a tests/twitch-oauth.test.js B.13 tesztje: „Missing expected rejection” a 307. sornál.
- Gyökérok: a revokeTwitchConnection() a Twitch revoke sikeres válasza után nem ellenőrizte, hogy a revocation_pending → revoked D1 UPDATE ténylegesen módosított-e egy sort; ezért a tesztben szimulált D1 állapotfrissítési hiba nem jutott vissza a hívóhoz.
- Javítás elkészült: e7a04baa683caf35252bec721ed1fa362c9bc660 — fix: verify Twitch revocation state transition.
- A javítás után CI ellenőrzés még nincs PASS-szal igazolva. Következő kapu: az új Twitch Integration futás eredménye.
