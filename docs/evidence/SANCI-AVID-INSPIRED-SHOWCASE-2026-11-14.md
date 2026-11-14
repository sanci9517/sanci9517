# SANCI DARK DEPTH v2 — AvidIsOdd-inspiráció, saját eredeti szignó

**Dátum:** 2026-11-14 · **Aktív tervpont:** SANCI publikus Brand/Site UX és 77.44.7.D · **Státusz:** adatoldali publikálás PASS, teljes Production UI / Visual Editor acceptance OPEN / NOT_CERTIFIED.

## Forrás és tulajdonosi döntés

A tulajdonos az `https://avidisodd.hu/` egészének hangulatát és a nyitóoldali aláírás motívumát kérte, azzal a feltétellel, hogy a SANCI ne legyen másolat. A SANCI 32.4.1 briefben korábban **négy felhasználói mobil-képernyőkép** alapján rögzítve: látványos platform-pill gombok, következő stream kiemelés, Shortok/VOD kapcsoló, heti kártyás menetrend, partnercsík, webshop. A referenciaoldal jelenleg a webes lekérdezésben `Cache miss` / nem hozzáférhető; ezért nem állítunk eredeti forráskód- vagy mozgáselemzést. Semmilyen Avid-brandet, kódot, képet, logót vagy signature-grafikát nem vettünk át.

## Ténylegesen elkészített kód

- `public/assets/sanci-showcase.js`: SANCI-only DOM presentation enhancement a teljesen meglévő Editor Node Model elemein, felismeri a hero háttérképet és benne az aláírás-elemet, a platformgombokat és az automatikus menetrend-visszaszámlálót. A meglévő repo projekt-szintű, konstans SVG ikonjaiból valódi Twitch/YouTube/TikTok/Discord jelölés a cél URL alapján, nem hamis LIVE státusz. Független tenantokon letiltott. Ugyanarra az elemre másodszor futtatva nem duplikál ikonokat. A hozzáadott DOM-díszítés nem módosítja a mentett Editor dokumentumot.
- `public/assets/sanci-showcase.css`: egységes, filmszerű réteges hero, rubinvörös fénysáv és kékes ezüst tartalomkontraszt, tipográfiai fókusz és minimum 48px gombok; külön oldal-specifikus, **nem duplikált** szín-akcentus az ÉLŐ (Twitch), YouTube, TikTok, Menetrend, Közösség, Rólam, Kapcsolat és Főoldal szakaszokon. Óra/kártyák, footer és finom jelenlét-animáció. `prefers-reduced-motion:reduce` statikus, nem követel meg külső fontot, képet, JS-frameworköt vagy új infrastruktúrát.
- `public/assets/page-renderer.js`: a dekoráció aktiválása kizárólag canonical SANCI és létező, `sanciEditorialVersion/heroOverlayVersion=1` Editor dokumentum esetén. A public renderer az Editor-dokumentumot dolgozza fel, az eredeti Save/Publish, media, schedule, Twitch embed tovább működik.
- `public/visual-page.html`: új SANCI stíluslap és verziózott renderer betöltése; a CSS szigorúan `body.sanci-editorial-page[data-sanci-showcase="depth-v2"]` alatt él.
- `tests/sanci-showcase.test.js`, `tests/browser/sanci-showcase.test.js`, `package.json` `test:showcase` és `test:showcase:browser`: URL-azonosítás, izoláció, idempotens ikongenerálás, szerkeszthető szignó, mobil 320/390/768/1440px overflow és csökkentett mozgás regresszió.

## Eredeti SANCI-aláírás: tényleges D1 Save és külön Publish

- **Read-only preflight:** `site-default`, `page-home` teljes v111 dokumentum, egy képi hero, két főszakasz, három releváns CTA, egy `next-stream` Countdown, `site_navigation` draft=published v13. A többi hét oldal published=draft. Minden meglévő Editor revízió érintetlen.
- **Save v112:** egyetlen, valódi szerkeszthető `text` node `sanci-home-autograph-20261114` `Sanci` tartalommal, a hero-szövegpanel **első** gyermekeként. Szignó-vonal és enyhe forgatás csak site-scoped CSS-ből. `editor_revisions` INSERT + CAS `pages.content_json` + audit, 3/3 sikeres; publikus v111 változatlan.
- **Save v113:** mobil `width:fit-content; maxWidth:100%; minWidth:0` és revíziófrissítés, 3/3 sikeres, még mindig published v111.
- **Readonly gate:** 8 aktív oldal, az új v113 teljes Node-fa hibátlan, 1 H1, 1 valós Countdown, 3 célzott CTA, 2 sections, aktuális média, módosítatlan hét aloldal, `site_navigation` v13, 2/2 save audit.
- **Publish v113 külön:** published_content_json és published_revision_id frissítése rev-20261114-sanci-autograph-mobile-fit-v113 és audit, 2/2 sikeres. v111 és v112 megmaradt szerkesztési előzménynek.
- **Új, read-only D1 postflight:** published v113=draft v113, 19 Editor csomópont, hero elején `Sanci`, 2 szekció, pontosan egy menetrendvezérelt Countdown, 3 CTA, minden másik hét oldal és 13-as nav változatlan. Audit 3/3. **PASS.**

## Ellenőrzött és nyitott kapuk

- A GitHub legfrissebb források JavaScript szintaxisát célzottan ellenőriztük, valamint a helyi izolált V8-szintű `classifySanciDestination` és `decorateSanciShowcase` viselkedést valódi DOM-helyettesítőkkel futtattuk, ideértve a tenant-scope-ot és az idempotens SVG elhelyezést. **PASS**. Több további source-contract predicate 11/11 PASS.
- A rendelkezésre álló Chromium 144 binárissal helyben, elkülönített **vizuális képernyő-mockon** 320, 390, 768 és 1440px-es méretben scrollWidth overflow=0; 390px és 1440px képet megtekintettünk. Ez csak irány-ellenőrzés, **NEM** az aktuális Worker által szolgált valós Editor-render vagy éles site, és **nem** helyettesíti a tényleges repo Playwright regresszióját.
- `node --test tests/sanci-showcase.test.js`, `node --test tests/browser/sanci-showcase.test.js`, `npm run typecheck`, `wrangler deploy --dry-run`, éles HTTP, exact static asset hash és tényleges Android mobilos UI **NOT RUN/UNVERIFIED** a teljes helyi GitHub checkout hiánya és a Worker URL webes feloldási hibája miatt. GitHub Actions billing/quota miatt nem indítottunk kézzel CI-t.
- Cloudflare deployments API legutolsó ellenőrzésekor 2026-11-14T13:17:45Z `1f19be78-a143-4bd8-93f2-295d0e72b426` deployment, `867b0a95-e4d1-4506-b561-044096bed8ce` Worker-verzió **100%** forgalommal. A pontos GitHub commit és Worker build kapcsolata és a publikus assetek egyenértékűsége **NINCS IGAZOLVA**; ezt nem jelentjük éles UI acceptance PASS-nak.

**Költség:** 0 Ft új kiadás; nincs R2 törlés, új D1 migráció vagy fizetős függőség. Nem nyitottunk új oldalt, mert a meglévő nyolc már tiszta célú. A kanonikus 1.55 MiB-os `docs/SANCI9517-CREATOR-PLATFORM-PLAN.md` blobját szándékosan nem írtuk felül; az `AGENTS.md` az ilyen felülírást részleges Contents API esetén kifejezetten tiltja. A specifikáció a meglévő alárendelt `docs/SANCI9517-PUBLIC-SITE-BRIEF.md` v2.8-ba került.

**Következő kapu:** a repo és a Worker deploy pontos build-SHA ellenőrzése, a teljes automated browser test és valódi mobil UI, majd a kanonikus 77.44.7.D összevont Editor manual acceptance. Szponzor- és webshopfunkció csak valós adatokkal és külön acceptance után. Nincs szükség a tulajdonos további döntésére a jelen fejlesztés folytatásához.
