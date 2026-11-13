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
