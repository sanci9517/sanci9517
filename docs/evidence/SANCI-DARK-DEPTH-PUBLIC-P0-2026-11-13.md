# SANCI DARK DEPTH — publikus P0 oldalak: ChatGPT / D1 piszkozat bizonyíték

Dátum: 2026-11-13 (Europe/Budapest). Státusz: **DRAFT SAVED / NOT PUBLISHED / VISUAL QA OPEN**.

Ez a fájl kizárólag végrehajtási bizonyíték a `docs/SANCI9517-CREATOR-PLATFORM-PLAN.md` kanonikus tervhez és a `docs/SANCI9517-PUBLIC-SITE-BRIEF.md` alárendelt briefhez; nem második terv. Nem módosítja a Visual Editor ütemezését vagy a teljes Editor végső kézi elfogadási kapuját.

## Az elvégzett, ellenőrzött munka

2026-11-13-án a felhasználó a korábbi, látható és működő ChatGPT/D1 próba alapján kifejezetten kérte a teljes SANCI publikus márkawebhely megépítését ezzel a módszerrel, megőrizve az Editor szerkeszthetőséget. A Cloudflare D1 read-only preflight (oldalazonosítók, aktív állapot, publikált snapshotok, revíziók, médiarekordok és navigáció) után kilenc elsődleges oldalt a jelenlegi `sanci-page-document` / `schemaVersion=1` formátumban, Editor-kompatibilis, különálló piszkozatként mentettünk.

| Page ID | Draft slug | Új draft-verzió | Node |
|---|---|---:|---:|
| `page-home` | home (a / főoldal) | 102 | 55 |
| `page-twitch` | twitch | 4 | 35 |
| `page-schedule` | schedule | 9 | 31 |
| `page-sanci-videok` | videok (új oldal) | 1 | 50 |
| `legacy-community` | community | 30 | 43 |
| `page-about` | about | 77 | 42 |
| `page-tiktok` | tiktok | 11 | 37 |
| `page-youtube` | youtube | 16 | 34 |
| `page-contact` | contact | 7 | 30 |
| **Összesen** | **9 oldal** | | **357 node** |

A navigáció egy új, csak **piszkozat** 12-es verzióra került; a 11-es publikált navigáció változatlan. Új főcsoportok: Főoldal, Élő adás, Videók (TikTok és YouTube gyerekoldalakkal), Menetrend, Közösség, Rólam (Alkotások gyerekoldallal), Kapcsolat. A korábban létező `Alkotások` oldalt nem töröltük vagy írtuk át.

Az Editorban megtalálható meglévő SANCI DARK DEPTH hero R2-médiarekordját és logó-képet hivatkoztuk; nem használtunk külső streamerek jogvédett asseteit. A képelemek a helyi Asset Registry ID-kra mutatnak. A csak régi, 2026. szeptemberi Schedule-adatokat nem állítottuk be jövőbeli közvetítésnek. A dinamikus schedule-csomópontok a meglévő `schedule_items` adatokból dolgoznak, hiteles következő alkalom hiányában üres állapotot jeleznek.

## Piszkozat-ellenőrzés

Cloudflare D1 újbóli SELECT-es visszaolvasás eredménye: **9/9 dokumentum** a megfelelő `activePageId`-t és oldalt tartalmazza; **357/357 node** gráfja gyökértől elérhető, nincsen ciklus/árva vagy hibás szülő-gyermek hivatkozás; minden oldalnak saját új `editor_revisions` rekordja és audit-bejegyzése van; legfrissebb revíziószám egyezik a dokumentum verziójával. **9/9 oldalnál** a publikált snapshot változatlan maradt. Az új `videok` oldal `is_published=0`; a többi régebben publikált oldal éles snapshotja érintetlen.

Külön, teljes `validatePublishDocument` szerverfuttatás, élő böngészős render, mobil/tablet/desktop képi elfogadás, végponti linkteszt és Publish/smoke **NOT RUN / UNVERIFIED**. Az adatbázisos konzisztenciateszt **nem** helyettesíti a Visual Editor teljes kézi elfogadását, és nem bizonyítja a vizuális világ színvonalát. A publikus header/footer jelenlegi statikus S-helyettesítő logója, hibás vagy nem létező fallback slugjai, illetve üres social linkjei külön runtime javítást igényelnek ellenőrzött git/CI/deploy kapukkal. A live/unknown státusz, tényleges videók/thumbnailok, YouTube handle, Discord invite és üzleti elérhetőség kizárólag ellenőrzött adatból kerülhetnek ki.

## Kiadás és költség

- GitHub runtime-commit: **nincs** ebben a blokkban.
- Worker deployment: **nincs** ebben a blokkban.
- D1-migráció és R2 törlés: **nincs**.
- Publikus Publish: **nem történt**, Save/Publish külön maradt.
- GitHub Actions workflow: **nem indítottunk**; 0 Ft új jóváhagyott kiadás.
- Dev-metrics: nem Codex CLI-futás, ezért nem rögzítettünk kitalált aktív fejlesztési órát.

## Következő, tervszerinti kapu

1. Editor draft-visszatöltés és minden P0 oldal renderje, képi és link QA (320–1440 px, billentyűzet, reduced motion); hiányzó központi header/footer problémák javítása a git release workflow-ban.
2. Ellenőrzött valódi csatornaadatok: YouTube/VOD URL és videók, Discord invite, kapcsolat-email, csak valós aktualizált Schedule és LIVE státusz.
3. Csak a sikeres teljes szerver/QA validáció után külön Publish és publikált navigation, HTTP/SEO/canonical/sitemap/assets smoke. Nincs történő vagy igazolatlan éles kiadás.


## További, 2026-11-13-i tényleges kivitelezés – Visual Art Pass A + Editorial B

A tulajdonos jelezte, hogy az első 357-node-os verzió nem éri el az elfogadott SANCI DARK DEPTH szintjét, és átadta a hivatalos VOD YouTube-csatorna URL-jét, a Discord-meghívót és a publikus kapcsolati e-mailt. Ezeket a megfelelő oldalakon felhasználói forrásadatként felvettük; a YouTube-videóazonosítókat, Discord-meghívó tényleges érvényességét és a felület működését külső források nem igazolták.

**Art Pass A – 9 oldal, Editor v2 D1 piszkozat:**
- `page-home` v103, `page-twitch` v5, `page-schedule` v10, `page-sanci-videok` v3, `legacy-community` v31, `page-about` v78, `page-tiktok` v12, `page-youtube` v17, `page-contact` v8.
- A hero, a responsive kétoszlopos layout, a sötét kártyák, a tipográfiai hierarchia, a CTA-állapotok és a duplikált belső láblécek módosultak a szerkeszthető Page Modelben.
- A felhasználó által megadott hivatalos YouTube `https://www.youtube.com/@sanci9517vod`, Discord `https://discord.gg/RWBCYNMqy` és `mailto:` kapcsolat a releváns oldalakon szerepel. A korábbi hibás placeholder szövegeket ezeken az oldalakon lecseréltük.

**Editorial Pass B – kiemelt oldalak:**
- `page-home` v104: a három generikus játékkártya helyett két szerkeszthető, képes YouTube VOD/TikTok Shorts belépő; a főoldalról a közösségi Discord-CTA is elérhető.
- `page-sanci-videok` v4: külön tipográfiai és asset hangsúly a rövid és hosszú videóknak; nem jelenítünk meg kitalált YouTube videóazonosítót vagy hamis statisztikát.
- `page-youtube` v18 és `page-tiktok` v13: saját SANCI-embléma, erősebb editorial kiemelések.

**Read-only D1 QA:** az új oldalverziók visszaolvasva, a dokumentumok/gyökerek/parent-child gráfok a helyi D1 lekérdezés alapján rendben voltak, a friss linkek a megfelelő oldalakban szerepelnek, az új asset-azonosítók léteznek. A teljes szerver `validatePublishDocument` futtatás és képernyőképes böngészős teszt **NOT RUN**, az Editor teljes manuális elfogadása **DEFERRED**.

**Fontos concurrent publish állapot:** `page-sanci-videok` 2-es verzióját az Editoron keresztül **2026-11-13 18:11:36 UTC** időpontban közzétették (`page.publish` audit). Ez a ChatGPT art pass előtti dokumentum; az új v3 és v4 *piszkozat*, nem élő. A ChatGPT ebben a blokkban **nem hajtott végre Publish-t**. A többi korábban közzétett P0 oldalra vonatkozó új dokumentumok is piszkozatok. A publikus navigation változatlan 11, a draft 12.

**Nyitott és nem eltagadható hiányok:** a jelenlegi közös `public/visual-page.html` és `public/assets/site.css` statikus fejléc/lábléc még S-helyettesítő márkajellel és ellenőrizetlen/broken linkekkel működik; nem teljesen Editor-szerkeszthető. Ezt később önálló runtime-fejlesztéssel és AGENTS.md szerint tesztelt Worker release-szel kell javítani. Továbbá konkrét YouTube/TikTok videók, engedélyezett thumbnailek, LIVE/OFFLINE integráció, működő sponsor strip valódi partnerekkel, elrejthető videós nézetek, reszponzív/akadálymentességi és szerver Publish QA szükséges. A tervezett mozgó sponsorsávhoz partneradattal és reduced-motion fallbackkel tényleges Editor-komponens szükséges. Ne állítsuk, hogy a webhely világszínvonalú, amíg a vizuális és funkcionális kapuk teljesülését nem igazoltuk.

**GitHub Worker code / deploy:** ebben a második kivitelezési részben nem módosult; D1 draft és ez az evidence változott. A GitHub Actions futtatását nem kértük, új fizetős erőforrás nem került bevezetésre.


## 2026-11-13: CTA hover/focus és végső, read-only D1 QA

Új, Editor-kontraktus szerinti `metadata.stateVersion=1` állapotstílusok mind a **55 szerkeszthető CTA gombon**: visszafogott bordó hover és látható focus-visible, 180 ms átmenet. A meglévő site CSS `prefers-reduced-motion` fallbackje tiltja az animált átmenetet az erre érzékeny böngészőkben. A Page Model Save nem Publish.

Legutóbbi D1 revíziók: `page-home` 105, `page-twitch` 6, `page-schedule` 11, `page-sanci-videok` 5, `legacy-community` 32, `page-about` 79, `page-tiktok` 14, `page-youtube` 19, `page-contact` 9. Visszaolvasás: **9/9 szerkezeti ellenőrzés PASS**, **337 node**, **55 hover/focus CTA**. Minden oldal új piszkozat-revíziója a jelenlegi közzétett változat felett van; egyik új revíziót sem publikáltuk. A Videók oldal közzétett állapota továbbra is a külön Editorból létrejött v2, a megújított v5 csak piszkozat. Az 11-es közzétett és a 12-es draft navigáció külön maradt.

Nincs screenshot-alapú vizuális QA, nincs teljes `validatePublishDocument` futtatás, nincs Worker-asset módosítás vagy deploy. Kiadás és „világszínvonalú” minősítés: **OPEN / NOT CERTIFIED**.


## 2026-11-13 — SANCI heti menetrend fejlesztési blokk (tulajdonosi engedéllyel)

**Tulajdonosi kérés:** a médiatárba feltöltött teljes SANCI csomag ellenőrzése után a Menetrend oldal valódi, áttekinthető hétfő–vasárnap heti naptárnézetet kapjon. A tulajdonos külön engedélyezte a teljesebb menetrend fejlesztését.

**Kód a \`v2/foundation\` ágon:**
- \`public/editor-v2/core/schedule-week.js\` — önálló, 0 új dependencyvel működő magyar heti naptár; Budapest-idő, DST, 7 dátum, napi csoportok, biztonságos HTML, gombok;
- \`src/core/schedule-read.ts\` — új \`mode=week\`, kötelező érvényes hétfő \`weekStart=YYYY-MM-DD\`, szűkített SQL-előszűrés, majd Budapest-nap szerinti szűrés (UTC-határ átlépés); végső 50 rekord;
- \`src/routes/public/schedule.ts\` — a \`weekStart\` query mező továbbítása;
- \`public/editor-v2/core/schedule-schema.js\` — \`week\` a meglévő Schedule-v1 dokumentum szerződésében, opcionális \`cancelled\` státusz;
- \`public/editor-v2/app.js\` — magyar \`Heti naptár\` Inspector-mód, váltáskor teljes, max. 50-es nézet és státuszok/megfigyelések megjelenítése;
- \`public/editor-v2/core/schedule-preview.js\`, \`public/editor-v2/schedule-preview.css\` — 7-napos Editor szerkezeti előnézet **kitalált adás nélkül**;
- \`public/assets/page-renderer.js\`, \`public/assets/site.css\` — hétléptetés kliensoldalon, aktuális hét, 7-oszlopos desktop / 4, 2, végül 1 oszlopos mobil képernyő, focus-visible és üres nap;
- \`public/visual-page.html\`, \`public/editor-v2/index.html\` — asset verziófrissítés a cache miatt;
- \`public/editor-v2/tests/schedule-week.test.js\`, \`public/editor-v2/tests/schedule-source.test.js\`, \`package.json\` — a 6 új UI egységteszt és új API-határtesztek a szokásos \`test:schedule\` részei.

**D1 alapú, visszaolvasott P0 draft:** \`page-schedule\`, \`site-default\`, **v12**, \`mode=week\`, max. 50 rekord, négy állapot (\`scheduled/live/completed/cancelled\`), hétfő–vasárnap, valós Twitch és Discord CTA. Az eredetileg 28-node-os hero/kártya tömeg helyett **10-node-os naptárcentrikus layout**, a régi piszkozatok és revíziók megmaradtak. A D1 visszaolvasott root/parent-child ellenőrzése **PASS**, auditbejegyzés **PASS**, a publikált oldal **v8**, **változatlan**. Save és Publish külön; a v12 **nem publikált**.

**Médiatár:** a tulajdonos által feltöltött új \`sanci_home_hero.webp\`, \`sanci_live_studio.webp\`, \`sanci_schedule_forest.webp\`, \`sanci_community_forest.webp\`, \`sanci_video_gallery.webp\` és társaik metaadatai D1-ben láthatók. Az új Menetrend képcentrikus helyett naptárközpontú lett, ezért nem terheltük újabb óriási hero képpel.

**Teszt / kiadás bizonyíték:**
- Helyben egy külön átvett, reprodukálható Schedule Week helperen \`node --test /mnt/data/sanci-schedule-week/schedule-week.test.mjs\`: **6/6 PASS** (date/DST/HTML/üres napok); a GitHubon levő tényleges helper kód V8 futtatott öt releváns ellenőrzése: **5/5 PASS**; a \`page-renderer.js\`, \`app.js\`, \`schedule-preview.js\` JavaScript-szintaxis ellenőrzése: **PASS**.
- A teljes repository checkout és \`npm run test:schedule\`, \`npm run typecheck\`, \`wrangler deploy --dry-run\`, valódi böngészős mobil screenshot és release 100%-os **verifikációja NEM FUTOTT** a jelen chat eszközkörnyezetében. Nem állítunk teljes CI- vagy browser PASS-t.
- A Cloudflare deployment listáján 2026-11-13 19:54 UTC-kor volt 100%-os Worker deployment, de **nem bizonyított**, hogy annak csomagja pontosan a fenti utolsó GitHub SHA-kat tartalmazza. Az éles weekly API működése ezért **UNVERIFIED**.
- GitHub Actions futtatás nem indult; új fizetős szolgáltatást nem használtunk.
- A jelenlegi adatokban csak szeptemberi múltbeli teszt-adások vannak, nem gyártottunk aktuális jövőbeni menetrendet. A jelenlegi hét a valós jövőbeli bejegyzésig **üres állapotot** mutathat.

**Kapuk:** a teljes \`test:schedule\`/TypeScript/build + \`wrangler deploy --dry-run\`/read-only D1 preflight/100%-os deployment és valódi API+mobile smoke elvégzendő. Ezután külön a \`page-schedule\` draft **Publish**. A teljes Visual Editor fizikai elfogadási kapuja változatlanul a MASTER későbbi, egyetlen kapuján marad. A megoldás nem második menetrendmotor és nem új master-terv.

### Heti Schedule későbbi korrekciók (2026-11-13, ugyanaz a blokk)

A szerveroldali `src/core/editor-validation.ts` Publish-kapu korábban csak a három régi módot és három státuszt engedte; javítva `week` és az opcionális `cancelled` elfogadására. A `tests/editor-content-initial-publication-contract.test.js` új regressziós tesztet tartalmaz az érvényes v1 heti dokumentum és a hibás mód elutasításához. **Ezeket a full-repo teszteket a chatben nem futtattuk végig.**

A `page-schedule` P0 heti piszkozatot egy szerkeszthető keret/padding korrekcióval **v13**-ra emeltük, D1 batch 3/3 sikeres, auditban szerepel, Publish nem történt. A korábbi **v8 publikált változat** és az Editor revision history megmaradt. A régebbi, v12-es piszkozat az előző pont szerinti részlépés, nem a legfrissebb verzió.

**Fontos:** a Cloudflare legutóbb látott deployment 2026-11-13T19:54:39Z időpontú és 100% forgalmú volt, de nem igazolt teljes forrás-SHA paritást vagy a `week` API HTTP-smoke-ját; a fejlesztés kiadási/Browser QA státusza továbbra is **UNVERIFIED / OPEN**. Új adatbázis-migráció nincs.


## SANCI DARK DEPTH — 2026-11-13, teljes P0 editorial újjáépítés (következő munkablokk)

**Kérelem:** a tulajdonos engedélyezte a világszínvonalú SANCI márkawebhelyhez szükséges hiányzó funkciók fejlesztését. Az új dizájn nem a kilenc korábbi, túlzottan ismétlődő oldal kártyáinak kiszínezése. Shroud watch-first, Pokimane brand/campaign, TimTheTatman creator/community hierarchia mintáiból inspirálódva egyetlen SANCI DARK DEPTH arculatot alkalmaz, de egymástól eltérő, feladatspecifikus oldalkompozícióval. A referencia-webhelyek tulajdonosi képei és kódjai NEM kerültek átvételre.

### GitHub forráskód és működési határok

Ág: \`v2/foundation\`. Valós, normál GitHub update_file commitok (nincs force-push).

- \`public/visual-page.html\`: a helyettesítő S-mark, hibás /p/kozosseg /p/rolam /p/menetrend, üres href="#" linkek és kitalált public live-jelölés kivezetve; valós platformlinkek, tiszta footer, látható asztali elsődleges navigáció, SANCI-slot a helyes médiatári logóhoz. Footerben nincsen hamis Kick/merch/sponsor és belső admin link.
- \`src/index.ts\`: a kanonikus, site-scoped SANCI logó server-side slot feloldása (\`/media/67045b51-9df7-45b0-a426-6b015ab985f1\`); a független többi tenant NEM kap SANCI-branded navot, footert, logót vagy csatornákat. SiteId az oldal- és 404 render útvonalakon is átadásra kerül. Az összes új SANCI HTML/CSS feltétele továbbra is ugyanaz az egy Editor/renderer modell.
- \`public/assets/site.css\`: SANCI DARK DEPTH célzott cinematikus, grafit-szürke/vörös shell, responsive desktop top-nav, kisebb viewports-on a működő drawer, fókusz, reduced-motion, prémium, takarékos lábléc. Csak \`body[data-sanci-shell="1"]\` megjelenése módosul.
- \`public/assets/site.js\`: desktop/drawer aktív link jelzés a már meglévő billentyűzettel használható menü megőrzésével.
- \`public/assets/page-renderer.js\`: csak az új \`sanciEditorialVersion:1\` Page Model oldalakon a külön vizuális H1-et tartalmazó generikus content-hero shell rejtve; publikálatlan média az autentikált Editor preview-ban \`/api/admin/media?id=\` útvonalról (nem nyilvánosan), továbbra is az eredeti kanonikus rendererből.
- \`src/routes/admin/media.ts\`: kizárólag a kanonikus SANCI site egyetlen jóváhagyott \`image/png\` fejléc-logó ID-jának explicit, site-scoped publikus elérése, **nem** általános médiatár-public fallback. Minden más média ugyanazon oldal-published asset-reference ellenőrzésen halad át, mint korábban.
- \`tests/sanci-brand-shell-contract.test.js\` és \`package.json\` \`test:brand\`: fókuszált shell / tenant izoláció / valós csatornák / draft média / akadálymentes nav regressziós szerződések.

**D1 Editor v2 rebuild — 9/9 P0 oldal sikeres piszkozat** (a mostani, 2026-11-13-i visszaolvasás szerint; a Twitch csatornaazonosító mentése és a Menetrend H1 korrekció külön revíziót kapott):

| Page ID | Slug | Utolsó mentett draft | Editor-node-ok | Oldalspecifikus forma |
|---|---|---:|---:|---|
| \`page-home\` | home | 106 | 36 | Filmiskola-szerű kapucnis/sötét erdős hero, élő/film és közösségi editorial fejezetek |
| \`page-twitch\` | twitch | **8** | 26 | Egy valódi, click-to-load Twitch-embed (\`sanci9517\` csatornaazonosító), menetrend és offline fallback |
| \`page-sanci-videok\` | videok | 6 | 26 | 16:9 VOD vs 9:16 Shorts külön felfedezői formátumok |
| \`page-schedule\` | schedule | **14** | 10 | Egy teljes heti naptár, igazolt időpontok, külön szerkeszthető H1 és Twitch/Discord CTA |
| \`legacy-community\` | community | 33 | 19 | Eredeti erdei brand scene, Discord és alapelvek |
| \`page-about\` | about | 80 | 21 | Magazinszerű bemutatkozás és kapucnis alak |
| \`page-tiktok\` | tiktok | 15 | 17 | Álló, mobilbarát short-form landing |
| \`page-youtube\` | youtube | 20 | 20 | 16:9 VOD-csatorna és szerkesztett storytelling |
| \`page-contact\` | contact | 10 | 22 | Külön közösségi és márkakapcsolati útvonal |
| **Összesen** | | | **197** | **Nem identikus komponensfák** |

**D1 QA SELECT:** a 8 közvetlen újjáépítés egyenként egy H1, fa-ciklus/árva mentes, a médiatári UUID-k léteznek, a belső hivatkozások a tényleges meglévő slugokra, a külsők a tulajdonos csatornáira mutatnak, dokumentum \`revision\` = revision ledger; **8/8 célzott ellenőrzés PASS**. A \`page-schedule\` v14 külön CAS 3/3 és audit PASS, week mode megmaradt. A régi publikált snapshotok és korábbi \`editor_revisions\` változatlanok. Navigáció \`draft_revision=12\`, \`published_revision=11\`; az új oldalak, menü és képek Publish-je NEM történt meg, kivéve a korábban külön publikált régi videóoldal v2-jét (nem ez az új v6 draft). Nincs oldaltörlés, D1 migráció vagy R2 törlés.

**Külső média tartalom:** a feltöltött SANCI média D1 rekordjai alapján ellenőrizve, a logó képi elfogadása és a vizuális jelenetek *fizikai screenshot review* továbbra is nyitott. A kreatív háttérképek nem hamis videók/thumbnailok: **nincsen ellenőrzött egyedi YouTube/TikTok videóazonosító**, ezért egyelőre a tényleges hivatalos csatorna- és VOD-URL-ek a működő CTA-k. Nincs kitalált LIVE, streamidőpont, támogató, követőszám, shop vagy üzleti állítás.

**Ellenőrzési státusz és nyitott release gate:** a GitHubról frissen visszaolvasott \`page-renderer.js\` és \`site.js\` JavaScript syntax V8 **PASS**, a \`visual-page.html\` fallback shell két SANCI-logo slotot, meglévő route-okat és 0 hamis href="#" linket tartalmaz, az új média- és tenant-guards forráskódból ellenőrizve. Az egységteszt *forrása létrejött*, de **\`npm run test:brand\` / TypeScript typecheck / \`wrangler deploy --dry-run\` / exact-source 100% Worker deploy / authenticated browser 320–1440px screenshot / full publish-server validation NOT RUN / UNVERIFIED**: itt nem áll rendelkezésre bejelentkezett remote build-shell, a konténerből GitHub DNS nem elérhető, a Work-keret fogyasztását nem indítottuk. A User full Editor kézi elfogadása a MASTER későbbi kapuja. Az aktuális screenshot nélküli elrendezést **NEM** nevezzük világszínvonalúként elfogadottnak.

**Release elv és költség:** az összes Editor-módosítás \`Save\` / piszkozat. A repo forrás-commitok nem bizonyítják a teljes Workers éles kiadást. **Új fizetős szolgáltatás, GitHub Actions dispatch, R2 deletion vagy költséget igénylő infrastruktúra: nincs.** A további lépések a jelenlegi egyetlen MASTER és annak meglévő briefje szerint: konzisztenst/tenant biztonságos build és \`test:brand\`/CI kapu; tényleges Worker 100%-os deploy forrás-SHA + /media/{logo} + /api/public/pages preview/public Smoke; reszponzív keyboard / vizuális QA; hiányzó valódi videók metaadatai, majd külön, tudatos Publish. Ez a fájl bizonyíték, nem új terv.


### Utóellenőrzés — 2026-11-13

- A \`page-twitch\` click-to-load embed bemenete az első átépítéskor teljes URL volt. A jelenlegi provider szerződésben a **közvetlen \`sanci9517\` Twitch-csatornaazonosító** natívan támogatott, ezért v8 draftként erre javítottuk; CAS 3/3, audit rögzítve, nincs Publish.
- A közös fejléc / lábléc és a SANCI logó tenant izolációja ismét ellenőrzött GitHub forrásból. A \`public/assets/page-renderer.js\` és \`public/assets/site.js\` JS szintaktikai próbája **PASS**; **34/34** célzott forráskontraktus-ellenőrzés: helyettesítő-S hiánya, 0 \`href="#"\`, valós oldalslugok és platformlinkek, média whitelist csak SANCI+PNG, nem-SANCI tenant tisztítás, click-to-load JS és draft médiaút, CSS hero-duplikáció/reduced motion **PASS**. A tesztek normál \`npm run test:brand\` Node környezetben való futtatása **NOT RUN**; ezek nem bizonyítanak képi minőséget vagy végponti működést.
- A 9. \`page-schedule\` Editor-oldal v14-re módosult: naptár a tartalmi fókusz és a szerkesztett H1 külön validálható; a korábbi publikált v8 továbbra is külön snapshot.
- A Cloudflare deployment API legutóbbi visszaolvasásakor a 2026-11-13T20:37:14Z deploy \`540f84c3-f124-45df-a01a-3d3cc82dcb47\` / Worker verzió \`fda40b18-5805-4cd7-ae20-377a4f23144c\` **100%** forgalmat kapott. Ez **nem igazolt exact GitHub-SHA, asset hash vagy képernyőn mért teljesítmény**; a legfrissebb dokumentációs és tesztcommitok ennél későbbiek is lehetnek. Az éles publikus webhely dokumentumai továbbra is a régebbi published snapshotok.
- Valódi tartalomrendszerezéshez a YouTube/TikTok egyedi, publikusan elérhető videóazonosítói még hiányoznak. Külső kereséssel sem áll rendelkezésre biztos saját videó-ID; nincs hamis videókártya. Shop/merch és sponsor sáv hiteles adat hiányában nincs kiemelve.
- **Állapot:** UX-P0 OPEN, publish QA OPEN, brand visual acceptance OPEN. Nem nevezhető kész vagy nemzetközi szinten igazolt site-nak, amíg a teljes browser/Editor/heti schedule tesztek és biztonságos Publish/SEO/asset verifikáció nem dokumentált.


## 2026-11-13 — Felhasználói mobil screenshot regresszió, teljes editorial éles publikálás, heti képes menetrend

**Tulajdonosi kérés:** a feltöltött 393 px körüli mobil screenshoton az új SANCI fejléc alatt régi lila/gombos tartalom és nagy fekete üres zóna maradt; a lábléc ©/szlogen sor összefolyt; az Admin főoldal nehezen volt megtalálható; a menetrendhez önállóan hozzáadható/módosítható adások és médiatári képek kellenek. A tulajdonos kérte az összes új oldal publikálását és finomítását.

**Gyökérok az előző dokumentumokban:** a \`page-home\` publikus snapshot továbbra is a korábbi, 6 csomópontos legacy oldal (v101) volt; a legújabb 36-node-os SANCI hero csak draft (v106). A screenshoton egyszerre jelent meg a legújabb header/footer és a régi publikált tartalom; a publikus footer több ellentmondó mobil media-query szabálya miatt a © és a szlogen összefolyt. \`/admin\` Worker route és a \`public/admin-home.html\` 99 KB-os kódja végig létezett; csak a felhasználó számára látható visszavezető publikus link hiányzott.

### GitHub runtime fejlesztések

- \`public/visual-page.html\` + \`public/assets/site.js\`: SANCI láblécben új \`/admin\` shortcut; alapból \`hidden\`, csak igazolt \`/api/auth/session\` bejelentkezés esetén válik láthatóvá. Nem teszünk nyilvános admin megnyitó gombot anonim látogatóknak.
- \`public/assets/site.css\`: mobil footer-grid 480px alatt 1 oszlop, a © és a szlogen külön flex-sorokban; a harmadik oszlop sem árvul. Cél a screenshoton látható összeolvadó copyright sor és töredezett lábléc megszüntetése.
- \`src/index.ts\`: \`/admin/schedule\` új hitelesített frontend útvonal; \`/api/admin/schedule/media\` role/editor + origin ellenőrzéssel; direkt \`/admin-schedule.html\` asset megnyitás tiltva, nincs második Admin főoldal.
- \`public/admin-home.html\`: az Adásrend navigáció és a Következő adás panel az új kezelőfelületre visz.
- \`public/admin-schedule.html\`, \`public/assets/admin-schedule.js\`: hétfő–vasárnap profi, mobilon egyoszlopos Admin heti kezelő; előző/következő hét, teljes adáslista, felvétel/szerkesztés/törlés, indulás/vég, platform, állapot (tervezett/élő/lezajlott/elmaradt), URL, megjegyzés, **a médiatár aktív, azonos site-hoz tartozó képeinek kiválasztása**. A teljes oldalkompozíció továbbra is a Visual Editorban marad szerkeszthető.
- \`src/core/schedule-artwork.ts\`, \`src/routes/admin/schedule-media.ts\`: \`site_settings\` előtagolású (site+event UUID) kép-hozzárendelés **új D1 migráció nélkül**; médiamime/site/archive ellenőrzés; audit, Origin+role ellenőrzés. A menetrend esemény törlése eltávolítja a képkapcsolatot, de nem törli a felhasználó R2 médiáját.
- \`src/core/schedule-read.ts\`, \`src/routes/admin/schedule.ts\`: read-only left join a schedule domain és a képkapcsolat között; \`imageAssetId\` visszaadása; meglévő CRUD endpoint az új Admin UI számára azonos originű JSON védelmet kapott.
- \`src/routes/admin/media.ts\`: a **valós site-hoz tartozó** élő menetrend esemény borítója ugyanazon médiatári assetet használhatja a /media/ útvonalon; a mediaUsage védett referenciái most schedule-event használatot is rögzítenek, ezért az ilyen aktív képet nem lehet simán „árvának” tekinteni.
- \`public/editor-v2/core/schedule-schema.js\`, \`public/editor-v2/app.js\`, \`src/core/editor-validation.ts\`: \`showArtwork\` kapcsoló a Schedule Inspectorban, link az Admin adáskezelőhöz, szerveroldali Publish-validátor is elfogadja.
- \`public/editor-v2/core/schedule-week.js\`, \`public/assets/page-renderer.js\`, \`public/assets/site.css\`: a publikus heti naptár valódi esemény borítókat mutat, kizárólag valid UUID \`/media/\` forrásból; mobilon is adaptív, képes kártya, default \`showArtwork:true\`.
- Tesztfájlok: \`public/editor-v2/tests/schedule-week.test.js\`, \`public/editor-v2/tests/schedule-source.test.js\`, \`tests/schedule-artwork-contract.test.js\`, \`tests/admin-asset-access-contract.test.js\`, \`tests/sanci-brand-shell-contract.test.js\`. A \`package.json\` \`test:schedule\` ezeket a schedule-ellenőrzéseket felveszi.

**Bizonyított ellenőrzések:** 6 érintett publikus/editor JS forrás V8 parser **PASS** (source fetch + \`new Function\`, nem Node teljes tesztsor); a valós Cloudflare D1-hez SELECT-only JOIN a három, 2026. szeptemberi adáson **PASS** (3/3, jelenleg nincs hozzájuk beállított borító); a 9 Editor-piszkozatot újra ellenőrző külön read-only preflight **9/9 PASS** (kanonikus dokumentum, revízió, nem ciklikus parent/child, 1 H1, létező képi asset, route, heti mód, Twitch click-to-load). A frontend/biztonság forrása GitHubon pusholva, de \`npm run test:schedule\`, \`npm run test:brand\`, \`npm run typecheck\`, \`wrangler deploy --dry-run\`, autentikált Admin HTTP smoke, CSS/320/390/768/1440 screenshot és R2 HEAD **NOT RUN** a chat eszközkörnyezetében.

### A kilenc oldal tulajdonos által kért tényleges publikálása

A dokumentumok összes saját szerkezetét és R2 médiarekordjait kiadás előtt read-only SELECT-tel újraellenőriztük, majd az **engedélyezett SANCI production site egyetlen oldal-/navigáció-tartalmi publikálási műveletét** CAS-vezérelt D1 batchben végeztük. A művelet a dolgozó Editor-csatorna UI-ra nem épülő, auditált adminisztratív adatírás, de nem új Editor API, és nem azt állítjuk, hogy a teljes rendes \`POST /api/admin/editor\` publish pipeline tesztje lefutott. A Save/Publish két külön lépése és a régi \`editor_revisions\` megmaradt.

| Oldal | Új közzétett Editor revízió | Korábbi revízió auditban, visszaállítható |
|---|---:|---|
| Főoldal \`page-home\` | 106 | régi v101 |
| Élő \`page-twitch\` | 8 | régi v3 |
| Videók \`page-sanci-videok\` | 6 | régi v2 |
| Menetrend \`page-schedule\` | 14 | régi v8 |
| Közösség \`legacy-community\` | 33 | régi v29 |
| Rólam \`page-about\` | 80 | régi v76 |
| TikTok \`page-tiktok\` | 15 | régi v10 |
| YouTube \`page-youtube\` | 20 | régi v15 |
| Kapcsolat \`page-contact\` | 10 | régi v6 |

- D1 batch: **18/18 változás** (9 page snapshot + 9 audit). Külön navigation publish a \`site_navigation\` 12-es szerkesztett verziója alapján **2/2 változás** (snapshot és audit), régi 11-es megőrizhető a korábbi adatbázis/revíziótörténet alapján.
- Postflight külön read-only D1 SELECT: **9/9** \`is_published=1\`, \`published_content_json=content_json\`, \`published_revision_id\` a legutóbbi Editor revízióhoz kötött, \`sanciEditorialVersion=1\`, mindegyik published slug rendben; \`site_navigation\` \`published_revision=12\`, \`draft_json=published_json\`; **9 publikálási auditbejegyzés**. A tulajdonosi próbapiszkozat \`page-chatgpt-proba-20261113\` nem lett publikálva.
- Minden más Admin/R2/media és migráció adat változatlan; **nincs manuálisan beírt hamis jövőbeli menetrend vagy hamis LIVE**. A három régi szeptemberi tesztesemény megmaradt, ezért a mai heti kártyák üresek, amíg a tulajdonos valós időpontot nem vesz fel.
- Cloudflare Worker deployment GET a legutóbbi vizsgálatkor \`770ce4e2-defc-4e99-bad6-4d86727797bd\`, Worker verzió \`c6072f74-e8f7-4b47-a2cb-0cd42aa8bf5c\` (2026-11-13T21:02:10Z, 100% forgalom), **nem** bizonyított exact Git SHA, statikus file hash vagy jóváhagyott teljes CI gate. Éles domain HTTP smoke ebből a tool-futtatásból nem elérhető. Ebből **nem** vezethető le, hogy az új /admin/schedule script már renderelhető.

**Nyitott:** valódi böngészős QA/akadálymentesség/média GET, a teljes hivatalos Editor Publish API regressziós PASS, a Schedule repeat/move és Twitch-synced recurring UX, az Admin saját tenant-scoping jövőbeli multiuser változata; a nemzetközi vizuális színvonal elfogadása és minden hozzá tartozó végleges tartalom még **OPEN / NOT_CERTIFIED**. Költség: új fizetős szolgáltatás/Actions dispatch nincs.


## 2026-11-13 21:23–21:27 UTC — UX-P0: mobil teljes rácsösszeomlás, felhasználói screenshot alapján

**Regresszió / tényleges gyökérok:** az új SANCI közös \`site.css\` szabálya \`body[data-sanci-shell="1"] .public-page-layout{grid-template-columns:minmax(0,1fr) minmax(0,1320px) minmax(0,1fr)}\` magasabb CSS-specificityvel **minden viewporton** megmaradt. A \`public/visual-page.html\` helyesebb, de gyengébb \`@media(max-width:700px){.public-page-layout{grid-template-columns:minmax(0,1fr)}}\` szabályát felülírta. A 393 px-es saját telefonos screenshoton ezért a schedule H1 balra lógott, a bevezető szöveg betűnként egy keskeny oszlopba tört, és indokolatlanul hosszú lett az oldal. A közös szerkezet miatt 9/9 editorial SANCI-oldal veszélyeztetett.

**Javítás:**
- \`public/assets/site.css\`: a kanonikus SANCI háromoszlopos shell 1360 px és kisebb szélességnél **display:block, 1 tartalmi oszlop**, a két üres oldalsáv elrejtve; a tartalmi oszlop explicit width+auto margin+min-width:0; 700 px és alatta 24 px vízszintes összes oldalmargó, a Canvas és gyermekcsomópontok méretbiztonsága. 1360 px felett az eredeti háromoszlopos design marad; a nem SANCI tenantokhoz a szabály nem nyúl. Első lépésben nincs egyetlen D1 tartalommódosítás sem.
- \`public/visual-page.html\`: CSS URL v5 cache bust (\`?v=20261113-sanci-mobile-grid-v5\`), hogy a mobil ne tartsa meg a korábbi v4 hibás layoutját.
- \`tests/browser/sanci-public-mobile-grid.test.js\`: 9 editor-alapú oldal-szerű renderelt fixture, teljes real Chromium DOM-méret mérés a canonical HTML / Page Model renderer / CSS útvonalon (320, 390, 768, 1024, 1440 px), ellenőrzi a .content-page, belső .visual-text szélességét, vízszintes túlfolyás és JS pageerror hiányát. \`package.json\` új \`test:brand:browser\`; \`tests/sanci-brand-shell-contract.test.js\` forrás regresszió.
- GitHub commitok a \`v2/foundation\` ágon: runtime CSS \`f1b7b88bc120aee54d60af9e6251963656d47c39\`, runtime HTML cache bust \`2285c5081fecfb372e526b82dac3c8624f8b6d25\`, browser fixture \`65498a3ebad0b5e4cde29ad0a2e3b871c60ff078\`, viewport assertion fix \`ee33701577442510872098457bccacea43b12928\`, package script \`bf6d66aaccd7bec50f66486eccd45f6a0adb0aa1\`, test contract \`e8b6fe288c15eaef8622960893ac8b05c6660e4c\`.

**Valódi böngészős részleges validálás:** helyi /usr/bin/chromium + Python Playwright alatt *ugyanazon css-selectorokkal és oldalelrendezési törzs-elemekkel épített minimális, kontrollált reprodukció* (nem a teljes oldal letöltése) mérés:
| Szélesség | Előtte .content-page szélesség | Javítva | Body scrollWidth |
|---:|---:|---:|---:|
| 320 px | 0 px | **296 px** | 320 px |
| 390 px | 0 px | **366 px** | 390 px |
| 430 px | 0 px | **406 px** | 430 px |
| 768 px | 732 px | 732 px | 768 px |
| 1024 px | 988 px | 988 px | 1024 px |
| 1366 px | 1284 px | 1284 px | 1366 px |
| 1440 px | 1284 px | 1284 px | 1440 px |

A minimal repro bizonyítja a gyökérokot és a CSS-javítás geometriáját, de **NEM** a valódi bejelentkezett éles mobil screenshotot vagy a teljes 9-oldalas Chromium teszt PASS-t. A browser testet GitHubon felvettük, de \`npm run test:brand:browser\`, \`typecheck\`, \`deploy --dry-run\` és konkrét Worker asset hash összevetés nem futott a hálózatmentes chat-konténerből. A Cloudflare API GET egy 2026-11-13T21:25:17Z, 100%-os forgalmú Worker deploymentet jelzett, de az pontos forrás-SHA egyezése és az éles CSS/HTML tartalma nem igazolt; nem állítunk forrás-egyezős release PASS-t.

**Státusz:** UX-P0 MOBIL GRID CODE FIX PUSHED / MANUAL BROWSER ACCEPTANCE OPEN / FULL RELEASE GATE UNVERIFIED. A 9/9 korábban publikált új oldaldokumentum és az Admin, a Save/Publish, a tulajdonosi médiaérvényesség, a szerkesztő UI, a D1 és R2 adatok ez alatt nem változtak. Következő lépés: a fenti 320/390/768/1024/1440 pixel teljes repo-browser-teszt, deploy source-SHA és asset hash, valódi Android screenshot, végül a komponensszintű responsive QA. Nincs új fizetős szolgáltatás vagy GitHub Actions dispatch.
