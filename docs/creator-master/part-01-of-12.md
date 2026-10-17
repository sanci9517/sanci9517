# SANCI9517 — CREATOR PLATFORM: TERMÉK-, ARCHITEKTÚRA- ÉS FEJLESZTÉSI MASTER-TERV

**Tervazonosító:** S9517-CREATOR-PLATFORM-MASTER  
**Verzió:** 4.3.0 — konszolidált, feltöltésre előkészített fejlesztési MASTER  
**Dátum:** 2026-10-16  
**Állapot:** KANONIKUS TERMÉK- ÉS FEJLESZTÉSI MASTER — a tervezett termékkör rögzítve; F0.2 és F0.3 CLOSED / PASS. Az F1.1 Site Core, többoldalas kezelés és navigáció IN PROGRESS. A tervezési teljesség nem bizonyít sem kész implementációt, sem teljes körű tételes szemantikai audit.
**Aktív tervpontazonosító:** `F1.1-SITE-CORE-MULTIPAGE-NAVIGATION`  
**Aktív tervpont státusza:** IN PROGRESS — Site Core, többoldalas kezelés és navigáció. F0.3 CLOSED / PASS; WEB-003 user-accepted CLOSED / PASS a 77.25 szerint. A szülőoldal-alap telefonos PASS; a teljes slug/redirect-életciklus, a WEB-011 fennmaradó mobilnézeti és a több-site acceptance továbbra is nyitott.
**Következő közös lépés / AKTUÁLIS FOLYTATÁSI KURZOR:** `F1.1-SITE-CORE-MULTIPAGE-NAVIGATION` — WEB-003 lezárva (77.25); az oldallista draft/LIVE jelzésének #35 PR-je egyesítve, CI és production build PASS, a felhasználó az érintett státuszt és külön mentés/publikálást ellenőrizte (77.27). A #36 WEB-002 szülőoldal-alapja a #37 PR-ben a `v2/foundation` ágba került; CI és Cloudflare Production build PASS, éles asset/HTTP smoke PASS (77.27). A #36 szülőoldal-alap telefonos tesztje a felhasználó szerint PASS. A #39 WEB-002/WEB-013 publikált slug-előzmény és biztonságos átirányítás szelete a #40 PR-ben egyesült; CI és Cloudflare Production build PASS, éles HTTP/asset smoke PASS (77.28). A telefonos redirect-elfogadás, a broken-link riport, a teljes URL/SEO-életciklus és F1.1 nyitott. A #42 Editor UX/no-overlap javítása (77.29) a #44 PR-ben egyesült; CI és Cloudflare Production build PASS, az új felület PC-s felhasználói elfogadása még nyitott. A #39 URL-telefonos teszt és WEB-013 további funkciói ezt követik.
**Repository:** `sanci9517/sanci9517`, `v2/foundation`  
**Termékcél:** világszintű, önálló márka- és weboldalépítő, streamelési, tartalomgyártási, közösségi, kereskedelmi, analitikai, automatizációs és AI-rendszer egyetlen logikusan tagolt Creator & Brand Operating Platformon. Elsődleges célcsoport: streamerek és digitális tartalomkészítők, akik egyedi publikus brandoldalukat és teljes tevékenységüket innen kezelik. A többfelhasználós, önkiszolgáló, előfizetéses SaaS és a működés/AI-költség fenntartható finanszírozása a teljes termékcél lényegi része; a funkciókat függőség szerint, fokozatosan építjük meg. Más célcsoportok támogatása későbbi bővíthetőség, nem az elsődleges piac.

---

## 0. A terv használata

Ez az egyetlen irányadó termék- és fejlesztési terv. Tartalmazza az ellenőrzött műszaki alapokat, a teljes termékcélt, a 396 stabil funkcióazonosítót, a 22 felhasználói főmodult, a megvalósítási fázisokat és a bizonyítékhoz kötött átadási szabályokat. A dokumentum szerkezeti teljessége és egy funkció futó implementációjának minősítése **két külön kapu**; egyik sem jelent automatikus PASS-t a másiknál.

- **Egyetlen aktuális terv:** `docs/SANCI9517-CREATOR-PLATFORM-PLAN.md`.
- A régi tervek, checkpointok és auditanyagok nem törlődnek a Git-előzményekből vagy az archívumból, de nem irányítják a jelenlegi terméktervezést.
- A termékfunkciók nem vesznek el pusztán azért, mert még nincsenek implementálva. A későbbi képességeket a megfelelő termékmodul és fejlesztési fázis alatt tartjuk nyilván.
- Minden funkciónál külön kell kezelni: **megvalósított**, **folyamatban**, **tervezett**, **külső szolgáltatóra vár**, illetve **felhasználói/éles ellenőrzésre vár**.
- Egy funkció tervben szereplése nem bizonyítja, hogy elkészült. Késznek csak működő implementáció, releváns tesztek és szükséges éles/felhasználói ellenőrzés alapján nevezhető.
- Nincs külön második termékterv vagy párhuzamos, új auditprojekt.
- A felhasználói élmény az első: a creator az Adminban a feladatának megfelelő, jól elkülönített modult találja meg; a közös adatok és műveletek minden érintett felületen következetesen frissülnek.
- **Modulhatár-alapelv:** a funkciók főmodul → funkciócsoport → alfunkció → elfogadási feltétel hierarchiában szerepelnek. Egy modul nem válhat minden más funkció gyűjtőhelyévé. Minden üzleti képességnek egy kanonikus tulajdonosmodulja van; más modulok csak szabályozott kapcsolódási ponton keresztül használhatják.
- A kézi alapfolyamatok AI nélkül is használhatók. Az AI bővíti és gyorsítja a platformot, de nem rejtheti el a működés állapotát, és nem végezhet korlátlan, jóváhagyás nélküli műveleteket.

### 0.1. Termékkategóriák
1. **Meglévő technikai alap:** a repositoryban és a futó rendszerben már meglevő Worker/D1/R2, ownership, Page Model, Editor és integrációs szerződések; csak igazolt állapot jelölhető késznek.
2. **A következő fejlesztési fókusz:** a meglévő Admin–Visual Editor–mentés/előnézet/publikálás–publikus weboldal folyamat teljes, megbízható lezárása.
3. **A teljes Creator Platform:** integrációk, tartalomgyártás, közösség, commerce, OBS/streaming eszközök, analitika, automatizáció és SANCI AI fokozatos megvalósítása.
4. **Későbbi platformosodás:** több creator/site, csapatmunka, billing, marketplace és kiterjesztések; ezek a végső terv részei, de nem előzik meg a stabil alapokat.

### 0.2. Változtatási szabály
Új funkció a megfelelő modulba kerül. Meglévő képesség módosításakor meg kell őrizni az adatkapcsolatokat, jogosultságokat, hibaállapotokat és a korábbi használati eseteket. Funkciót csak kifejezett termékdöntéssel lehet kivezetni; a későbbre ütemezés nem törlést jelent.

### 0.3. Kötelező fejlesztési és tervezési alapelvek

Ezek az alapelvek a teljes projektre, minden fázisra, modulra, integrációra és kódmódosításra érvényesek. Egy későbbi fejezet vagy régi terv csak akkor írhatja felül őket, ha a MASTER-ben kifejezett, indokolt döntés rögzíti a kivételt.

1. **Előbb vizsgálat, utána kód.** Minden feladat előtt meg kell vizsgálni az aktuális repositoryt, a tényleges belépési pontokat, a domain- és adatmodell-szerződéseket, a már létező komponenseket, az útvonalakat, a migrációkat, a teszteket és a kapcsolódó Git-előzményeket. A terv vagy egy korábbi beszélgetés önmagában nem bizonyítja, hogy a kód jelenleg is úgy működik.
2. **A működő megoldást használjuk újra.** Ha a szükséges képesség már létezik és megfelel a követelménynek, azt kell felhasználni vagy célzottan javítani. Nem készítünk második komponenst, domaint, API-t, tárolót vagy párhuzamos folyamatot pusztán azért, mert egyszerűbbnek tűnik újraírni. Új implementáció csak dokumentált hiány, hibás működés, fenntarthatatlan szerződés vagy igazolt biztonsági/UX-probléma esetén indokolt.
3. **Nincs kitalált implementáció vagy hamis készültség.** Nem szabad kódot, API-képességet, provider-támogatást, adatot, teszteredményt vagy éles működést feltételezésből kész tényként kezelni. Ismeretlen állapotot ellenőrizni kell, vagy nyíltan ismeretlenként kell jelölni. A tervezett, implementált, tesztelt, CI-ben ellenőrzött, böngészőben kipróbált és éles környezetben igazolt állapot külön státusz.
4. **A MASTER az egyetlen termék- és fejlesztési igazságforrás.** A megbeszélésekből származó döntéseket, alapelveket, funkciókat, kizárásokat és későbbi célokat ebben az egy dokumentumban kell rendezni. Nem készül párhuzamos főterv vagy külön funkciókatalógus, amely eltérő igazságforrássá válhat. A régi források megőrzendő tartalma a megfelelő aktuális modulhoz és fázishoz kerül; a kivezetés vagy összevonás döntését nyomon követhetően kell rögzíteni.
5. **A termékfeladat határozza meg a modult, nem a meglévő kódelrendezés.** A felhasználó az adott feladatot ott végzi el, ahol azt logikusan várja. Az Editor nem válhat általános Adminná. Az arculat, integrációk, adásrend, média/tartalom, OBS, közösség, bevétel, analitika, automatizáció és AI saját, világos felelősségi modulban marad. A közös képességek megosztott szerződést használnak, nem másolatokat.
6. **Senior mérnöki döntések: egyszerűség, bizonyíték és fenntarthatóság.** A változtatás a legkisebb biztonságos, a meglévő architektúrával összhangban álló megoldást válassza. Kerülendő a szükségtelen absztrakció, a korai túltervezés, az ismétlődő logika, a rejtett mellékhatás és a csak látványos, de nem működő UI. A technikai adósságot és a kompromisszumokat kifejezetten dokumentálni kell.
7. **A webdizájn és a UX elsőrendű követelmény.** A felület legyen következetes, áttekinthető, mobilon is használható, akadálymentes és hibáiban is érthető. A funkciókat feladat, gyakoriság és felhasználói mentális modell szerint kell elhelyezni; a ritka és haladó lehetőségek nem zsúfolhatják tele az alapnézetet. A vizuális minőség nem helyettesítheti a működést, a működés pedig nem mentség a rossz használhatóságra.
8. **Egyetlen adatgazda, több következetes felület.** Minden domainnek egy kanonikus tulajdonosa és adatforrása van. Más modulok dashboard-kártyán, gyorsműveleten, Editor-blokkon vagy összefoglalón keresztül használhatják, de nem vezethetnek be eltérő üzleti logikát vagy szinkronizálatlan másolatot. A módosításoknak a jogosultságok és cache/szinkron szabályok betartásával kell megjelenniük minden érintett felületen.
9. **A változtatás előtt és után ellenőrizni kell a hatókört.** Fel kell mérni a függő modulokat, API-szerződéseket, migrációkat, jogosultságokat, adatvesztési kockázatot, responsive nézeteket és regressziós eseteket. A módosítást arányos typecheckkel, célzott tesztekkel és szükség szerint teljes tesztkészlettel, CI-vel, böngészős smoke/E2E és éles ellenőrzéssel kell igazolni. Csak ténylegesen lefutott ellenőrzés jelölhető késznek.
10. **Kis, visszakövethető lépésekben haladunk.** Egy lépésnek legyen világos célja, hatóköre, elfogadási feltétele és bizonyítéka. Előbb a függőségeket és a működő alapfolyamatot kell stabilizálni, majd erre építeni. A tervben szereplő későbbi funkció nem kerül automatikusan a jelenlegi fejlesztési scope-ba.
11. **A felhasználói adatok és a biztonság nem másodlagosak.** Site/owner-scope, szerveroldali jogosultság, titokkezelés, OAuth/state, inputvalidáció, naplózás, helyreállítás és adatvesztés elleni védelem minden érintett funkció elfogadási feltétele. Biztonságos működés nem helyettesíthető csak frontend-ellenőrzéssel.
12. **A külső rendszerek korlátait tiszteletben tartjuk.** Provider API, OAuth scope, rate limit, platformszabály, licenc és felhasználói jóváhagyás alapján állítható, mit tud ténylegesen a rendszer. Hiányzó engedélyt vagy nem elérhető API-t nem szimulálunk sikeres funkcióként; egyértelmű státuszt és helyreállítási utat adunk.
13. **A teljes termékcél nem veszhet el a fázisok miatt.** A fázisok az építés sorrendjét határozzák meg, nem a végső vízió szűkítését. Ha egy képesség későbbre kerül, a megfelelő modulban, függőségekkel és elfogadási elvárással meg kell maradnia.
14. **Az asszisztens szerepe szakmai partner, nem feltételezésgyártó.** Senior szoftvermérnöki és webdizájn-szemlélettel kell elemezni, alternatívákat mérlegelni, meglévő megoldásokat megőrizni, a kockázatokat kimondani, a hibákat kijavítani és a bizonyítékokat rögzíteni. Nem állítható, hogy a teljes géphez, minden archívumhoz vagy futó környezethez hozzáférés történt, ha ezt a tényleges eszközhozzáférés nem támasztja alá.

### 0.4. Kötelező munkamenet minden fejlesztési feladatnál

1. **Követelmény és cél:** a MASTER aktuális moduljából és a rögzített döntésekből megállapítani a kívánt felhasználói eredményt, a határokat és az elfogadási feltételeket.
2. **Meglévő megoldás feltérképezése:** keresés a repositoryban, útvonalak, komponensek, domain service-ek, adatbázis/migráció, tesztek és Git-előzmények áttekintése. A működő részeket azonosítani kell.
3. **Hiány és kockázat megállapítása:** csak a bizonyított hiányt vagy hibát módosítani; a hatókört, függőségeket és visszafelé kompatibilitást előre meghatározni.
4. **Legkisebb megfelelő módosítás:** a meglévő mintákat és kanonikus szerződéseket használni; párhuzamos rendszert csak kifejezett, indokolt architekturális döntéssel létrehozni.
5. **Ellenőrzés:** célzott tesztek és kapcsolódó regressziós ellenőrzések futtatása; szükség szerint typecheck, CI, böngészős folyamat és éles ellenőrzés. Ha valamelyik nem futott le, ezt nyíltan rögzíteni.
6. **Bizonyíték és tervfrissítés:** a tényleges változás, teszt, fennmaradó kockázat és következő függőség rögzítése ugyanebben a MASTER-ben. Csak a bizonyított állapot léphet tovább.
7. **UX-ellenőrzés:** ellenőrizni, hogy a funkció a felhasználó által várt modulban van-e, világos-e az elnevezés, az üres/hiba/töltési állapot, a mobilnézet, az akadálymentesség és a kapcsolódó felületek viselkedése.

E munkamenet nem jelent minden feladatnál felesleges adminisztrációt: a dokumentálás és tesztelés mélysége a változtatás kockázatához igazodik, de a meglévő megoldás megvizsgálása és az állítások bizonyíthatósága nem hagyható ki.

---

### 0.5. Aktív tervpont és a továbblépés rendje

- **Kanonikus aktív pont:** `F1.1-SITE-CORE-MULTIPAGE-NAVIGATION`, a dokumentum fejlécével és a 77.6, 77.10. fejezet aktuális bizonyítékaival összhangban. F0.3 lezárt kapu, nem aktív kurzor. A régi 63.x/termék-review kurzorok történeti jegyzetek, nem munkautasítások.
- **Termékirány:** univerzális brandwebhely, választható streamer/creator/commerce/szolgáltatói és egyéb modulok. A 22 főmenü és 396 stabil ID megőrzött korábbi alap; a 64–71. fejezet részletei kötelező kiegészítések, nem külön termékterv.
- **Specifikációs státusz:** integrált célarchitektúra rögzítve; specifikációs teljesség nem jelent minden külső API, jogi előírás vagy üzleti igény végleges jóváhagyását.
- **Implementációs státusz:** F0.3 CLOSED / PASS a 77.10 bizonyítékával; F1.1 IN PROGRESS. Minden további pont csak repository-, teszt-, böngésző- és szükség szerinti éles bizonyítékkal léptethető.
- **Review-elv:** nem ismétlődő történeti audit; új funkció vagy bizonyított hiány a saját moduljába kerül, anélkül, hogy a fejlesztést teljes tervújraírás előzné meg.

### 0.6. Felhasználóbarát funkcióelhelyezés és bővítési szerződés

**Kötelező termékdöntés:** a teljes funkciókészlet megőrzendő, és új képességekkel bővíthető; az Admin, a publikus weboldal és a Visual Editor azonban nem válhat egyetlen zsúfolt felületté. A funkciók számának növekedése nem jelenthet navigációs vagy kezelési bonyolultságot. A jelen fejezet a már meglévő katalógust kiegészíti, egyetlen korábbi képességet sem vezet ki.

1. **Admin = feladatvégzés.** Az Admin kezdőlapja áttekintést és kontextusos gyorsműveleteket ad, nem teljes funkciólistát. A gyakori feladatok jól megnevezett főmodulokból, azon belül logikus aloldalakról érhetők el. A 49. fejezet marad a kanonikus navigációs forrás; új menüpontot csak indokolt felhasználói feladat és dokumentált modulhatár esetén szabad felvenni.
2. **Publikus oldal = látogatói élmény.** A látogató tartalmat, streamet, adásrendet, közösségi és kereskedelmi lehetőségeket lát, kizárólag publikált, jogosult és releváns adatokkal. Adminisztrációs beállítások, OAuth-műveletek, belső diagnosztika és titkok nem jelenhetnek meg.
3. **Visual Editor = oldalszerkesztés.** Vászon, oldalszerkezet, layout, responsive nézetek, vizuális komponensek, stílus, kötött dinamikus blokkok és előnézet/publikálás tartozik ide. Az Editorban egy tartalom, esemény, termék vagy kapcsolat kiválasztható és megjeleníthető, de annak teljes üzleti életciklusát a saját Admin-modulja kezeli.
4. **Egy adatgazda, több belépési pont.** A gyorsszerkesztés, kártya, blokk, keresés vagy kontextusmenü ugyanazt a domain API-t, jogosultságot, validációt és auditot használja. Ha egy objektum több helyen módosítható, a változás a cache-invalidation, verziókezelés és konfliktusjelzés szabályai szerint minden érintett nézetben megjelenik.
5. **Fokozatos felfedés.** Alapfeladatok elsődlegesek; ritka, haladó és veszélyes műveletek külön szekcióba kerülnek. Keresés, morzsamenü, következetes elnevezés, visszalépés, üres/töltés/hiba/siker állapot és művelet utáni visszajelzés kötelező. Nem helyettesíthető a navigáció kizárólag ikonokkal.
6. **Reszponzív és akadálymentes működés.** Mobilon és tableten valódi feladatalapú elrendezés, billentyűzetes kezelés, látható fókusz, képernyőolvasó-támogatás, kontraszt, reduced-motion és hibák szöveges magyarázata szükséges. A drag-and-drop műveletekhez elérhető alternatíva kell.
7. **Bővítés előtti döntési lap a MASTER-en belül.** Minden új képességnél rögzíteni kell: felhasználói cél; kanonikus tulajdonos; Admin-aloldal; publikus megjelenés (ha van); Editor-kapcsolódás (ha van); közös adatmodell és API; jogosultság; külső függőség; fázis; pozitív, negatív, mobil és regressziós elfogadási tesztek. Nem keletkezhet külön párhuzamos roadmap.
8. **Újrahasznosítási döntési sorrend.** (a) meglévő saját működő kód, (b) karbantartott, biztonságos és licencben kompatibilis nyílt forrású komponens, (c) megfelelő külső szolgáltatás, (d) indokolt saját implementáció. Az alternatívákhoz karbantartási állapotot, licencet, költséget, adatvédelmet, függőségi kockázatot és kilépési lehetőséget kell vizsgálni; külső kód átvétele nem automatikus.
9. **Nem törlés, hanem nyomon követhető besorolás.** Régi, tervezett vagy későbbi funkció csak explicit, indokolt döntéssel vonható össze vagy vezethető ki. Azonos képesség több megjelenési helye nem jelent több implementációt. A funkciókatalógus és a 49. fejezet közötti eltérés javítandó, nem újabb önálló listával elfedendő.
10. **Bővítési kapu.** Új modul vagy nagyobb funkció csak akkor léphet implementációba, ha a tulajdonos, felhasználói út, adat- és jogosultsági szerződés, tesztek és függőségek tisztázottak. A jelenlegi tervteljességi kapu IN PROGRESS marad a teljes keresztellenőrzésig.

### 0.7. Külső termékekből átvett, ellenőrizendő UX- és architektúraminták (2026-10-14)

Az alábbi minták **terméktervezési jelöltek**, nem kész implementációk és nem bizonyított hiányok. A meglévő 49., 53–59. fejezeteket kiegészítik; a bevezetés előtt a kapcsolódó funkcióazonosítóval és tényleges kóddal egyeztetni kell. Nem hozható létre duplikált modul vagy adatforrás.

**WordPress Site Editor / Patterns — közös megjelenés és újrafelhasználás.** Források: https://wordpress.org/documentation/article/site-editor/ ; https://wordpress.org/documentation/article/comparing-patterns-template-parts-and-reusable-blocks/
- A 49.3 Márka és designrendszer / 49.2 Weboldal területén legyen kifejezetten elkülönítve a **globális sablonrész** (fejléc/lábléc), a **szinkronizált újrafelhasználható komponens** (minden példány együtt frissül) és a **független kiinduló minta** (másolatként testre szabható). A három típus megkülönböztetése legyen látható a UI-ban.
- A Visual Editor kínáljon hierarchikus réteg/listanézetet, komponenskeresést, navigálható beszúrópanelt, gyorsparancsot, oldal- és eszközméret-előnézetet, valamint könnyen visszavonható műveleteket; a globális módosítás előtt jelenjen meg az érintett példányok hatóköre.
- A sablon és komponens import/export esetén sémaverzió, biztonságos validáció, függőség-ellenőrzés és kompatibilitási figyelmeztetés szükséges. A harmadik féltől származó sablon nem kaphat automatikusan script- vagy titokhozzáférést.

**Webflow lokalizált CMS — nyelvi tartalom nem pusztán felületfordítás.** Forrás: https://help.webflow.com/hc/en-us/articles/33961252209171-Localize-Collection-content
- A 49.2 Weboldal és 49.8 Tartalomstúdió között közös, lokalizálható tartalommodell kell: nyelvenkénti cím, slug, SEO, média-alt, tartalommezők, fallback és publikálási állapot. A locale-specifikus tartalom nem jelent külön CMS-t.
- Későbbi többnyelvű ütemezésnél nyelvenkénti előnézet, hiányzó fordítás jelzése, hreflang/canonical ellenőrzés és publikálás előtti validáció szerepeljen; a magyar-first működés maradjon elsőrangú.

**Strapi Content Manager / Review Workflows — tartalomszerkesztés és jóváhagyás külön.** Források: https://docs.strapi.io/cms/features/content-type-builder ; https://docs.strapi.io/cms/features/review-workflows
- A 49.8 Tartalomstúdió tulajdonolja a strukturált tartalomtípusok kezelését és az írási munkafolyamatot. Későbbi csapatfázisban külön jogosultsággal: szerző, szerkesztő, jóváhagyó; review-státusz, felelős, megjegyzés, változatelőzmény és publikálási kapu.
- Az Editor csak a tartalom megjelenítését és kötését kezeli, nem másolja le a tartalmi jóváhagyási folyamatot. A Strapi vállalati funkciói összehasonlítási minták, nem automatikusan ingyenesen átvehető kódok.

**Streamer.bot — esemény, trigger és művelet szétválasztása.** Forrás: https://docs.streamer.bot/get-started/introduction/ ; https://docs.streamer.bot/guide/core/actions
- A 49.14 Automatizációk alatt külön, érthető képernyők: eseményforrások, triggerek, feltételek, műveletek, sorrend/queue, változók, próbafuttatás, futási napló, hiba/újrapróbálás és import/export.
- A 49.7 Kapcsolatok adja az integrációs jogosultságot; a 49.6 OBS és stream eszközök a végrehajtható eszközműveleteket; a 49.14 csak szabályozott szerződésen keresztül kapcsolja össze őket. Éles adás közben veszélyes művelethez explicit engedély és biztonságos alapállapot kell.
- A későbbi SANCI AI ugyanazt az engedélyezett action-rendszert használhatja, de nem kerülheti meg a jóváhagyást, auditot vagy jogosultságot.

**Közös, minden mintára érvényes elfogadási kapu:** egyértelmű owner és Admin-belépési pont; valódi használati eset; működő/tervezett állapot megkülönböztetése; mobil, billentyűzet, hiba- és üres állapot; jogosultság és adatvédelem; pozitív/negatív teszt; migráció és visszaállítás; meglévő funkcióazonosítóhoz kapcsolás. Ha már létezik azonos képesség, annak szerződését kell bővíteni, nem másodikat létrehozni.

### 0.8. Tartós bővíthetőség — új funkciók felvétele a kész MASTER-be

**Alapelv:** a terv elfogadása nem zárja le a termék bővítését. A MASTER az egyetlen élő, verziózott forrás; minden későbbi funkció ugyanitt kap stabil azonosítót, felelőst, helyet és ellenőrizhető fejlesztési pontot. Nem szükséges a 22 főmodult vagy az architektúrát újrakezdeni egy új ötlet miatt.

**Kötelező felvételi eljárás (FEATURE-INTAKE):**
1. **Igény és érték:** ki használja, milyen konkrét feladatot old meg, milyen publikus/Admin/Editor felületen találkozik vele; kötelező-e, opcionális vagy későbbi fázisú.
2. **Duplikációellenőrzés:** a 24. és 54. fejezet stabil ID-i, a 49. menütérkép, a történeti mapping és a tényleges repo-kód ellenőrzése. Ha már van megfelelő capability, azt bővítjük; azonos domainhez nem építünk párhuzamos CRUD-ot vagy tárolót.
3. **Elhelyezés:** meglévő 49.x főmodul → feladat szerinti aloldal → kontextusos művelet. Új főmodul csak akkor indokolt, ha a felhasználói cél és az önálló domain-owner valóban különbözik, és az egyszerűbb aloldal nem elég. A publikus felület és a Visual Editor csak a saját felelősségi körét kapja.
4. **Egyetlen domain-szerződés:** kanonikus tulajdonos, objektum-életciklus, D1/R2/egyéb adattárolási döntés, API/action/event, cache és szinkron, jogosultság, site/workspace-scope, audit, export/törlés, migráció és visszaállítás.
5. **Újrahasznosítás és külső kutatás:** saját kód, releváns létező projekt, nyílt forrású komponens és szolgáltatás összevetése; licenc, biztonság, karbantartás, teljesítmény, akadálymentesség, adatvédelem, Cloudflare-kompatibilitás és teljes birtoklási költség dokumentálása. Az összehasonlítás nem jelent automatikus függőségbeemelést.
6. **UX-szerződés:** elsődleges feladatút és visszatérési pont, kereshetőség, jogosultságfüggő láthatóság, mobil/tablet/asztali kezelés, billentyűzet és képernyőolvasó, üres/töltés/hiba/siker állapot, súgó és biztonságos alapbeállítás.
7. **Szállítási szeletek:** egy nagy képesség több önálló, tesztelhető alpontra bontható: adatmodell → backend → Admin-kezelés → szükség szerinti Editor-integráció → publikus megjelenés → integrációk → tesztek → üzemeltetés. Nem kell minden részét egyetlen Visual Editor-feladatba sűríteni.
8. **Két külön státusz:** tervbeli specifikációs állapot és tényleges implementációs/teszt/éles működési bizonyíték. A dokumentáció készültsége soha nem jelent automatikusan működő funkciót.
9. **Változáskezelés:** stabil ID-kat nem számozunk át; átnevezésnél alias, összevonásnál előd–utód hivatkozás, kivezetésnél indok és migráció. A funkciólista, menütérkép, tulajdonosi szerződés, függőségek, tesztek és aktív pont ugyanabban a commitban vagy bizonyítottan összekapcsolt lépésekben frissül.
10. **Egyetlen aktív végrehajtási pont:** új ötlet a backlogba kerülhet bármikor, de nem szakítja meg automatikusan az aktuális kaput. Sürgős biztonsági/üzemi kivételhez dokumentált döntés és visszatérési pont szükséges.

**Felvételi rekord minimális sablonja a megfelelő meglévő fejezetben** (nem új tervfájl): `ID | felhasználói cél | owner | Admin-modul/aloldal | publikus szerep | Editor-szerep | adat/API | jogosultság | függőségek | fázis | acceptance | tesztbizonyíték | státusz`.

**Minőségvédő szabály:** a katalógus bővülése önmagában nem javítja a terméket. Minden új elemnek meg kell őriznie az egyszerű navigációt, a közös adatgazdát, a biztonságot és a mérhető felhasználói értéket. A még nyitott 63. fejezetbeli történeti és szemantikai kapukat ez a bővítési eljárás nem zárja le.

### 0.9. Kötelező termékidentitás — univerzális Brand & Creator Platform

**Alapdöntés:** a SANCI9517 elsőrendű terméke egy tetszőleges célra használható, saját márkájú, nyilvános weboldal és az azt működtető moduláris Admin. A streamer/creator képességcsomag opcionális, és nem azonos a webhely alapmodelljével. A felhasználó Twitch-, OBS- vagy bármilyen közösségi fiók nélkül létrehozhat és publikálhat teljes weboldalt. A meglévő 396 funkcióazonosító és 22 navigációs főmodul megmarad; az alábbiak pontosítják és kiegészítik őket, nem indítanak párhuzamos katalógust.

#### 0.9.1. Célcsoportok és induló profilok
- **Streamer/gamer:** Live, adásrend, játékprofil, videók, Twitch, OBS, támogatás.
- **Videós/social creator:** videók, csatornák, tartalomnaptár, social feed, media kit.
- **Művész/fotós/designer:** portfólió, galéria, projektek, esettanulmányok, megkeresés.
- **Zenész/előadó:** művek, kiadványok, események, sajtóanyagok, jegylinkek.
- **Podcaster/író/oktató:** epizódok, blog, RSS, kurzus-/anyagbemutató, feliratkozás.
- **Freelancer/szolgáltató:** szolgáltatások, csomagok, referenciák, árajánlat-/foglalási integráció.
- **Kisvállalkozás/márka:** termékek, szolgáltatások, üzletinformációk, nyitvatartás, kapcsolat, SEO.
- **Közösség/csapat/szervezet:** bemutatkozás, tagok, események, dokumentumok, tagság.
- **Nonprofit/kampány/esemény:** célok, program, támogatás, jelentkezés, átláthatóság.

Az induló profil nem adatbázis-tenanttípus és nem kizáró választás: bármelyik profil moduljai kombinálhatók, a profil később megváltoztatható tartalomvesztés nélkül.

#### 0.9.2. Streamingtől független alapwebhely
1. Brand/workspace/site létrehozás: név, slug, elsődleges nyelv, időzóna, tulajdonos, adatizoláció.
2. Sablonböngésző: kategória, keresés, előnézet, reszponzív demó, szükséges modulok, hozzáférhetőségi jelzések, verzió és licenc.
3. Többoldalas webhely: oldalfa, fejléc/lábléc, menük, mobilnavigáció, 404, keresési és jogi oldalak.
4. Általános CMS: cikk, projekt, profil, galéria, esemény, szolgáltatás, termék és felhasználó által konfigurált tartalomtípus; egyedi mezők, kapcsolatok, draft/published állapot.
5. Webes űrlapok: kapcsolat, ajánlatkérés, feliratkozási kérelmek; mezővalidáció, spamvédelem, consent, biztonságos tárolás, értesítések, export és törlés.
6. Brand Kit, Médiatár, globális tokenek, komponensek és lokalizált tartalom; egyetlen kanonikus asset-/content registry.
7. Draft, Preview, Publish, Rollback; domain/DNS/HTTPS, SEO, OG, sitemap, robots, hreflang, structured data, átirányítások.
8. Mobile-first publikus renderelés és használható mobil Admin; akadálymentesség, performance budget, analytics és privacy alapértékek.
9. Opcionális modul engedélyezése/letiltása; a letiltás nem törli automatikusan az adatot vagy az éles publikus oldalt.

#### 0.9.3. Modulaktiválás és modulok nélküli állapot
- A Site, Workspace és Identity minden site-nál létező alap entitás. A StreamerProfile, ArtistProfile és BusinessProfile kompozíciós beállítások, nem külön site engine-ek.
- A modul-katalógus minden eleménél kötelező: ID, verzió, owner, entitlement/plan, függőségek, szükséges provider-scope-ok, állapot, menükapcsolat, Editor-blokkok, publikus komponensek, default konfiguráció és migráció.
- Modul életciklus: available → enabled → configured → active / degraded → suspended → disabled; adatvisszaállítás és biztonságos újraengedélyezés.
- Modul nélküli üres állapotban a nem releváns menüelemek rejtettek vagy ajánlott hozzáadási lehetőségként jelennek meg, de a keresés/súgó és a funkciók felfedezése megmarad.
- Leállításkor függőségi vizsgálat: az érintett komponensek kontrollált fallbackot kapnak; aktív fizetés, tagság, időzítés vagy függő automatizáció nem szűnik meg csendben.
- Engedélyezett modul nem jelent automatikusan jogosultságot vagy külső szolgáltatóhoz csatlakozást.

#### 0.9.4. Sablonrendszer — teljes hierarchia és életciklus
- **Site kit → oldal → layout → szekció → blokk/komponens → megjelenítő és tartalomminta → Brand Kit/design token**.
- Minden sablonhoz: stabil ID, szemantikus verzió, schema-verzió, típus, szerző, licenc, kategória, célprofil, preview, locale, függő modulok, minimális platformverzió, hozzáférhetőségi státusz.
- Telepítés: manifest- és adatvalidáció, jogosultsági előnézet, szükséges modulok felajánlása, asset-/token-mapping, demo tartalom egyértelmű megjelölése, atomikus létrehozás vagy visszaállítható hiba.
- A sablonból létrehozott oldal önálló példány; csak az explicit linkelt/globális komponens frissül minden példányon. Lokális override, detach, diff és rollback kötelező.
- Globális fejléc/lábléc, szinkronizált komponens és egyszeri beszúrásra szánt minta a felületen is megkülönböztetendő.
- Import/export és későbbi marketplace: sémafrissítés, kompatibilitás, aláírás/ellenőrzés, jogosultság, függőségek, verziókonfliktus, licenc; idegen sablon nem kap automatikusan script/token/private-data hozzáférést.
- Állapotok: draft, published, deprecated, archived. Frissítési előnézet és függőségi impact report nélkül éles sabloncsere nincs.

#### 0.9.5. Általános brand-oldalhoz szükséges önálló domének
- **Services/Offerings:** szolgáltatáskatalógus, szolgáltatáscsomag, megkeresés, díjazási tájékoztatás; foglalás csak ellenőrzött adapteren át.
- **Forms/Leads:** űrlapséma, submission, spam/consent, címzetti értesítés, export, retention és hozzáférési szabályok.
- **Public Profiles/Portfolios:** projektek, munkák, referenciák, ügyfélhozzájárulás, galéria, kapcsolat.
- **Events:** általános esemény és regisztráció; streamer adásrend nem második általános eseménytár.
- **Newsletter/Email:** feliratkozási hozzájárulás, kettős megerősítés ahol szükséges, leiratkozás, külső küldő integráció, audit.
- **Search/Discovery:** webhelykereső, kategóriák, címkék, szűrés, hivatkozások, strukturált tartalom.
- Ezek meglévő Weboldal/CMS, Tartalomstúdió, Kapcsolatok, Commerce vagy Közösség modulok alatt jelenjenek meg; új főmenüpont csak dokumentáltan önálló domain és felhasználói cél esetén indokolt.

#### 0.9.6. Kötelező elfogadási próbák
- Új felhasználó → portfólió kit → három oldal → kapcsolatfelvételi űrlap → preview → publish: Twitch-kapcsolat nélkül működik.
- Ugyanaz a site később bekapcsolja a Live modult; a navigáció és a publikus komponensek hozzáadhatók az eredeti oldalak és URL-ek megőrzésével.
- Streamer kit → streaming modul kikapcsolás → a tárolt schedule és connection nem törlődik; a publikus live blokk fallback állapotot mutat.
- Globális komponens frissítése minden hivatkozó oldalon látszik; leválasztott példány nem változik.
- Két külön tulajdonos webhelyei, sablonjai, médiaobjektumai, űrlap-submissionjei és integrációs titkai nem olvashatók át keresztben.
- Sablonverzió-váltásnál diff, kompatibilitási figyelmeztetés, megszakítás és visszaállítás működik.
- Hibás hálózat, félbeszakadó publikálás, sikertelen provider-szinkron, mobilnézet és billentyűzetes kezelés külön teszteset.
- F0 első implementációs szelet: meglévő Admin → Editor → save/reload → preview → publish → public működés igazolása; majd univerzális Site + Template + CMS + Form minimum, csak ezután választható streammodulok bővítése.

#### 0.9.7. Fejlesztési sorvezető és státuszok
A teljes vizionált képességlista a MASTER része, de az egyidejű implementáció tilos. Minden fejlesztési feladat: `ID | cél | owner | Admin helye | publikus felület | Editor kapcsolat | canonical domain/adat | API | permission | függőségek | fázis | hibák | acceptance | tesztek | rollback | bizonyított készültség`. A specifikációs review és a futó kód tesztstátusza külön mező. A jelenlegi dokumentum 396 stabil ID-ját nem szabad átírni vagy átszámozni.


---

## 1. Végső termékvízió

A Sanci9517 nem pusztán streamer-oldal, linkgyűjtő vagy vizuális szerkesztő. A végső termék egy saját márkára szabható Creator Operating Platform, ahol a creator a weboldalát, élő jelenlétét, adásrendjét, tartalmait, közösségét, bevételi lehetőségeit, automatizációit és később az AI-t egyetlen következetes rendszerből kezeli.

### 1.1. Fő eredmények
1. Saját márkájú, gyors, akadálymentes, mobilon elsőrangú publikus weboldal.
2. Közérthető Creator Center/Admin, külön feladatmodulokkal.
3. Megbízható vizuális weboldalépítő adatvesztés nélkül.
4. Egyetlen Page Model, mentési/publikálási folyamat, schedule domain és media/resource rendszer.
5. Twitch, YouTube, TikTok, Discord, Kick és későbbi platformok integrációs központja.
6. Live állapot, adásrend, game profile, VOD, clip, short és tartalmi központ.
7. Közösség, támogatás, tagság, webshop, digitális termékek és üzleti eszközök.
8. Analitika, eseményvezérelt automatizáció és később biztonságos AI-asszisztens.
9. Exportálhatóság, helyreállíthatóság, auditálhatóság, adatvédelem és fenntartható üzemeltetés.
10. Későbbi több site-os, többfelhasználós, csapatos, előfizetéses és bővíthető SaaS-képesség.

### 1.2. Sikerfeltételek
- A napi feladatok elvégezhetők az adatbázis ismerete nélkül.
- Ugyanaz az adat minden felületen ugyanabból a domainből származik.
- A publikus oldal csak validált és publikált állapotot mutat.
- Külső API-hiba, lejárt token, lassú hálózat vagy revision conflict nem okoz csendes adatvesztést.
- A mobil Admin/Editor használható, nem csupán összenyomott desktop.
- A kézi alapfolyamatok AI nélkül is teljesek.
- A terv megőrzi a végső képességkatalógust; a korai scope nem töröl jövőbeli funkciót.

---

---

## 2. Felülethatárok és közös működés

### 2.1. Publikus oldal
A publikus oldal megjelenít, tájékoztat, navigál, tartalmat szolgáltat, közösséghez vezet, és az elérhető kereskedelmi modulokkal vásárlást/támogatást tesz lehetővé. Nem kezel adminisztratív adatokat és nem fed fel privát integrációs vagy üzleti állapotot.

### 2.2. Creator Center/Admin
Az Admin külön modulokban kezeli az oldalt, kapcsolatokat, adásrendet, tartalmat, médiát, közösséget, bevételt, analitikát, automatizációt és beállításokat. Közös shell, navigáció, státuszok, hibakezelés és jogosultság tartozik hozzá.

### 2.3. Visual Editor
Az Editor a weboldal felépítését, elrendezését, vizuális megjelenését, dinamikus blokkjainak konfigurációját és publikálási folyamatát kezeli. Nem lesz belőle webshop-admin, Twitch-kapcsolatkezelő, teljes schedule manager, analytics dashboard vagy általános adatbázis-szerkesztő.

### 2.4. Egy domain, több felület
- Twitch-kapcsolat a Kapcsolatok modulban jön létre. Dashboard, Live, Schedule és Editor blokk ugyanazt az integrációs állapotot olvassa.
- Adásrend az Adásrend modulban szerkeszthető. Dashboard, Editor blokk és publikus naptár ugyanazt a schedule domaint használja.
- Termék a Bolt modulban jön létre. Termékoldal és Editor termékblokk ugyanazt a termékdomaint olvassa.
- Média minden használati helyen ugyanarra az asset ID-ra mutat.
- Globális design token változása minden hivatkozó komponensben érvényesül; lokális override explicit eltérés.
- A több felületen elérhető művelet nem hozhat létre második adatforrást vagy eltérő jogosultsági logikát.

### 2.5. Tiltott duplikációk
- Második Editor core/Page Model/schedule adatforrás.
- Második OAuth/token-tároló ugyanahhoz a platformhoz.
- Eltérő média-nyilvántartás ugyanarra az assetre.
- Azonos termék/tartalom/esemény szinkronizálatlan másolata csak azért, mert másik felületen jelenik meg.
- Inspectorból közvetlen adatbázis-módosítás a domain command útvonal megkerülésével.
- Kliensoldali jogosultság-ellenőrzés szerveroldali ellenőrzés helyett.
- Draft mentésből automatikus publikálás.
- Tokenek, személyes adatok vagy payment secret naplózása.

---

---

## 3. Részletes Admin-domainok és tételes funkciók

A 3.1–3.18 alfejezetek **felelősségi/domain-katalógusok, nem külön főmenüpontok**. A kanonikus fő navigációt kizárólag a 49. fejezet határozza meg; a 46. fejezet csak a navigációs UX és elrendezés szabályait rögzíti. A 49. fejezet jelenleg 22 külön főmodult tartalmaz. Az alábbi megfeleltetés rögzíti a felelősséget, hogy az azonos funkciók ne kapjanak külön menüben külön implementációt:

- 3.1 Dashboard → 49.1 Kezdőlap és napi áttekintés.
- 3.2 Weboldal → 49.2 Weboldal; a design/template tulajdonosa 49.3, a média/asset registry tulajdonosa 49.4.
- 3.3 Kapcsolatok → 49.7 Kapcsolatok és integrációk.
- 3.4 Live és Stream + 3.5 Adásrend → 49.5 Élő adás és Stream Studio; az OBS/overlay eszközök 49.6.
- 3.6 Tartalom → 49.8 Tartalomstúdió; 3.7 Média és erőforráskönyvtár → külön 49.4 Média- és erőforráskönyvtár.
- 3.8 Közösség → 49.9 Közösség és rajongók; a fan identity saját domain-szerződés alatt marad.
- 3.9 Bolt és kereskedelem → 49.10 Bolt és kereskedelem; 3.10 Támogatás és tagság → külön 49.11.
- 3.11 Analytics → 49.13 Analitika és növekedés.
- 3.12 Tartalomtervező: tartalomnaptár/publikálási queue → 49.8; kampánytervezés és eredmény → 49.12.
- 3.13 Automatizáció → 49.14 Automatizációk.
- 3.14 SANCI AI → 49.15 SANCI AI.
- Globális keresés/parancspaletta → 49.16; értesítési központ → külön 49.17; súgó/onboarding → külön 49.18.
- 3.15 Szponzoráció és üzleti központ → 49.12 Szponzoráció és üzleti központ.
- 3.16 Beállítások és hozzáférés + 3.18 Rendszerdiagnosztika → 49.19; érzékeny diagnosztika korlátozott jogosultságú.
- Fejlesztői eszközök/API → 49.20; bővítmények/piactér → külön 49.21; 3.17 Csapat és munkaterület → 49.22.

A több helyen megjelenő gyorsművelet csak a kanonikus modulba navigál vagy annak közös domain commandját hívja; nem hozhat létre második tulajdonost, adatforrást vagy jogosultsági útvonalat.

### 3.1. Dashboard — Áttekintés
**Cél:** egyetlen kezdőképernyő, amely megmutatja a rendszer valós állapotát és a következő hasznos feladatot.

Funkciók:
- Weboldal publikálási állapota, live/offline, következő stream, legfrissebb tartalom, kapcsolatok és szinkronok állapota.
- Gyorsműveletek: új oldal, Editor, adásrend, médiafeltöltés, kapcsolat, tartalom.
- Teendők: sikertelen sync, lejáró engedély, draft publikálásra vár, hiányzó alt text, domainhiba.
- Legutóbbi aktivitás: mentés, publikálás, kapcsolatváltozás, ütemezett tartalom, hibák.
- Statisztikák csak valós, frissességgel jelölt adatból.
- Loading, empty, partial, stale, error és retry állapot.
- Minden kártya a canonical moduljába vezet; a Dashboard nem másolja az üzleti logikát.

Elfogadás: nincs hamis zöld állapot, nincs kitalált adat, minden gyorsművelet a saját modulhoz vezet.

### 3.2. Weboldal
**Kanonikus felelősség:** oldalak, navigáció, CMS/Page Model, Visual Editor, SEO, publikálás és weboldal-/domainbeállítások. A fő navigációban a Brand Kit/designrendszer és a sablon-/komponenskönyvtár külön, a 49.3. modulban található; a médiafájlok és asset-regiszter a 49.4. modulhoz tartoznak. A Weboldal modulból ezek közvetlenül elérhetők lehetnek, de a gyorselérés nem változtatja meg az adat- és funkciótulajdonost.
**Weboldal-almenük:** Oldalak; Navigáció; Visual Editor; CMS/tartalommodellek; SEO és publikálás; Domain és weboldalbeállítások.
**Külön modulhoz vezető gyorselérések:** Brand Kit és Design Studio (49.3); Média és erőforráskönyvtár (49.4). Ezek nem a Visual Editor belső almenüi és nem külön Editor-adatforrások.

**Oldalak**
- Lista: cím, slug, státusz, módosítás ideje, draft/published eltérés.
- Create/edit/duplicate/rename/slug change/archive/delete.
- Hierarchia, szülőoldal, URL-struktúra, sablonból létrehozás.
- Draft, preview, publish, unpublish, revision restore.
- SEO mezők, canonical URL, social preview, indexelési beállítás.
- Slugütközés, redirect, 404 és törlés előtti hivatkozásvizsgálat.
- Státuszok: draft, published, scheduled, archived, validation error.

**Navigáció**
- Főmenü, lábléc, mobilmenü és későbbi egyedi navigációk.
- Link hozzáadás, sorrend, címke, belső oldal/külső URL, dropdown/nested menü.
- Aktív állapot, billentyűzet, fókusz, screen-reader label.
- Törölt céloldal vagy hibás URL jelzése.
- Minden felület ugyanazt a navigation domaint használja.

**Weboldal szerkesztő**
- Egyetlen canonical Editor runtime.
- Element library, canvas, Layers/Outline, Inspector/Properties.
- Section, container/box, row/column/grid, text, heading, image, video/embed, button, link, divider, spacer, icon, list, card, form és dinamikus Sanci blokkok.
- Kijelölés, mozgatás, méretezés, reorder, duplicate, delete, drag/drop, alignment guide, zoom, pan, fit.
- Undo/redo, tranzakció, history integrity, revision conflict recovery.
- Inspector a Property Registryből: typography, color, background, size, spacing, layout, border, radius, shadow, position, visibility, responsive override, accessibility.
- Desktop/tablet/mobile viewport, breakpoint override és inheritance.
- Preview, save, revision és publish külön.
- Unsaved state, mentés közbeni további változtatás megőrzése, network error recovery.
- Dinamikus blokk csak konfigurációt/hivatkozást tárol; nem másolja a mögöttes üzleti rekordot a Page Modelbe.

**Megjelenés és design rendszer**
- Globális színek, typography scale, font, spacing, radius, shadow, border, layout token.
- Site-wide header/footer, reusable sections és globális elemek.
- Site/page/section/component template, reusable symbol és variant fogalmak külön.
- Token usage map, függő komponensek előnézete, diff és rollback.
- Master component/instance, explicit override/detach.
- Nincs láthatatlan, váratlan globális változás.

**Sablonok és komponensek**
- Sablon létrehozása, mentése, elnevezése, kategória, preview, duplicate, update, archive.
- Site template, page template, section template, component template és symbol külön életciklus.
- Sablonból létrehozott oldal önálló, kivéve explicit linked component.
- Verziózás, kompatibilitás, migrációs preview, rollback.
- Későbbi marketplace: licenc, verzió, értékelés, ellenőrzött telepítés.

**SEO és publikálás**
- Title, description, canonical URL, robots, Open Graph, social image.
- Sitemap, robots.txt, structured data/schema.org ahol releváns.
- Redirect, 404, slugváltozás, duplikált meta figyelmeztetés.
- Preview link, publish validation, publikálási összefoglaló, restore.
- Draft mentés nem írja át a published snapshotot.
- Publikálás előtti link, metadata, media, alt text, route és data-binding ellenőrzés.
- SEO/AEO eszközök nem garantálnak rangsorolást; indexelési státusz csak valós forrásból jelezhető.

**Domain/site beállítások**
- Site cím, brand, logo, favicon, locale, timezone, domain, preview domain.
- Domain verification, DNS útmutató, HTTPS/TLS állapot.
- Default SEO/social image, publikus/coming-soon/maintenance státusz.
- Minden beállítás site-scoped; nincs véletlen cross-site szivárgás.

### 3.3. Kapcsolatok
**Almenük:** Áttekintés; Twitch; YouTube; TikTok; Discord; Kick; További szolgáltatók; Webhookok és API-k; Szinkronnapló.

Közös funkciók:
- Státusz: connected, disconnected, expired, limited, error, syncing.
- OAuth connect/callback/state/CSRF, token titkos tárolás, refresh és revoke.
- Connection tulajdonos és site binding ellenőrzés.
- Scope-ok emberi nyelvű magyarázata.
- Reconnect, disconnect, revocation, health check, last success, next sync.
- API quota, retry, provider error normalization és audit log.
- Provider adapter szerződés: connect, refresh, disconnect, health, sync, normalize, capabilities.
- Funkció csak akkor aktív, ha a provider API és a megadott scope valóban támogatja.
- Token nem kerül logba, frontend bundle-be vagy API response-ba.
- Dashboard, Live, Schedule, Content és Editor block ugyanazt az integration state-et használja.
- **Első működő szállítás:** a meglévő Twitch-kapcsolat stabil, teljesen kezelhető Admin modulja. A YouTube, TikTok, Discord, Kick és további provider-adapterek a teljes termékcél részei, külön, függőség szerint ütemezett fázisban. Az Editor nem lesz második connection manager; minden providernek külön capability/scope/policy ellenőrzése van.

**Twitch:** OAuth; broadcaster azonosítás; live/offline, cím, kategória/játék, kezdés, nézőszám ha elérhető; schedule sync; EventSub/webhook ahol indokolt; VOD/clip metadata a scope és policy szerint.

**YouTube:** OAuth/API, csatornaazonosítás, video/live/feed/playlist/thumbnail/analytics a hozzáférés szerint; upload/publish külön scope és policy ellenőrzéssel.

**TikTok:** kapcsolat, feed, analytics, publishing és live külön capability; csak az aktuálisan engedélyezett API termékek szerint.

**Discord:** bot/app, guild/server, channel és role mapping; webhook/értesítés; membership role sync; engedély, reconnect és disconnect.

**Kick és későbbi platformok:** provider capability audit; külön adapter; nem támogatott API-képességet nem szabad működőként szimulálni.

### 3.4. Live és Stream
**Almenük:** Live állapot; Stream áttekintés; Stream események; Stream eszközök; Alert/overlay kapcsolatok.

- Kapcsolt platformok live/offline összefoglalója, platformonkénti adatfrissesség.
- Játék/kategória, stream cím, kezdés, nézőszám és elérhető metrikák.
- Player/embed, külső platformra ugrás, offline fallback.
- Stream started/stopped, raid/follow/sub/donation csak megbízható provider eventből.
- Stream key soha nem jelenhet meg kliensoldali API-ban vagy logban.
- OBS kapcsolat későbbi külön modul.
- Elavult API adatnál „utolsó frissítés” és stale státusz; nincs hamis live állapot.

### 3.5. Adásrend
**Almenük:** Naptár; Adások; Ismétlődések; Események; Játékprofilok; Szinkron és előzmények.

- Egyetlen canonical schedule domain.
- Esemény create/edit/duplicate/delete/archive.
- Kezdés/vége, timezone, recurrence, cím, játék, leírás, platform és státusz.
- Draft, scheduled, confirmed, postponed, cancelled, completed.
- Időzóna/nyári időszámítás/ütközés kezelése.
- Ismétlődésnél csak ezt / ezt és jövőbelieket / teljes sorozatot.
- Twitch sync, manual override és konfliktusfeloldás.
- Sync iránya és prioritása explicit; nincs csendes oda-vissza felülírás.
- Publikus naptár, következő stream, countdown, később iCal export.
- Game profile: cím, platform, kép, leírás, linkek, tags, kapcsolódó content.
- Dashboard, Editor block és publikus naptár ugyanazt a schedule API-t olvassa.
- Módosításkor cache invalidation és a kapcsolódó felületek frissítése.

### 3.6. Tartalom
**Almenük:** Tartalomkönyvtár; VOD; Klipek; Highlightok; Videók és Shorts; Közösségi posztok; Tartalomnaptár; Gyűjtemények; Content Studio.

- Canonical content item modell, normalizált provider metaadatokkal.
- Create/import/edit/tag/category/archive/publish state.
- VOD, clip, highlight, YouTube video, short, TikTok video, replay, text/image post, campaign asset.
- Cím, leírás, thumbnail, duration, publish date, URL, platform ID, visibility, tags/category.
- Search/filter/sort/pagination/bulk action.
- Collections, playlists, related content, featured content.
- Duplicate detection provider ID/canonical URL alapján.
- Idea, draft, ready, scheduled, publishing, published, failed, archived státusz.
- Többplatformos content calendar, platformonkénti permission/capability.
- Kézi és automatikus import közti konfliktuskezelés.
- Publishing queue idempotens, auditált műveletekkel.
- Editor Content Feed ugyanebből a domainből olvas, nem másolja a tartalomrekordot a Page Modelbe.

### 3.7. Média és erőforráskönyvtár
**Almenük:** Minden média; Képek; Videók; Ikonok; Fontok; Fájlok; Gyűjtemények; Használati helyek; Feltöltési napló.

- Egyetlen asset registry és asset ID.
- R2 bináris; D1 metadata, owner, site, MIME, size, dimensions, checksum, object key, status.
- Upload, drag/drop, batch upload, progress, cancel, retry, failed upload recovery.
- MIME/size validation, thumbnail/process pipeline és file safety ahol indokolt.
- Search/filter/tag/collection, alt text, title, description, licence/source, crop/focal point.
- Usage locations, delete warning, archive előnyben ha hivatkozás létezik.
- Icon library: search, category, style, license, preview, size/color.
- Font library: family, weight, style, fallback, license és load performance.
- Metadata módosítása minden felületen látszik.
- Bináris adat soha nem kerül D1 JSON mezőbe.

### 3.8. Közösség
**Almenük:** Áttekintés; Discord; Posztok; Szavazások; Események; Tagok; Moderáció; Jelentések; Értesítések.

- Kezdetben külső közösségi platformok kapcsolata és public CTA.
- Saját post, poll, event, clip submission csak a hozzá tartozó domainnel és permissionnel.
- Később tagprofil, follow, comment, reaction, post, poll, event, notification, report, ban, role, badge, reputation/points és challenge.
- Moderációs események, audit, report és appeal status.
- Spam/rate limit, jelentés és biztonságos content rendering.
- Discord role sync csak canonical entitlementből.
- Public/member-only/private hozzáférési szint külön.
- Moderáció nem működhet kizárólag kliensoldali szűréssel.

### 3.9. Bolt és kereskedelem
**Almenük:** Termékek; Kategóriák; Kollekciók; Rendelések; Digitális termékek; Kuponok és kampányok; Készlet és teljesítés; Vásárlók; Bolt beállítások.

- Product CRUD, duplicate, archive, draft/active/hidden/out-of-stock.
- Physical, digital, bundle, limited drop, preorder, később membership-linked product.
- Variants, SKU, price/currency, media, category, collection, tags, SEO, publish date.
- Inventory, fulfillment provider, shipping/tax abstraction.
- Product listing/detail/search/filter/cart/checkout integration/order confirmation.
- Order list/detail, payment/fulfillment state, cancel/refund/tracking.
- Kupon, ajándékkártya, bundle, árpromóció és lejárat; a B2B kampány és affiliate-attribúció a 3.12/3.15 üzleti kampányfolyamataival kapcsolódik össze, de nem a Store tulajdonolja.
- Purchase → entitlement → secure digital delivery/download.
- Külső fulfillment adapter; provider és saját készlet nem írhatja felül egymást tisztázatlan szabállyal.
- Pénzügyi művelet idempotens és auditált.
- Adó, számlázás, fogyasztóvédelem, GDPR és payment provider követelményét implementáció előtt fel kell mérni; megfelelőségi állítást nem találunk ki.
- Editor csak product blockot konfigurál; termék a Bolt modulban kezelhető.

### 3.10. Támogatás és tagság
**Almenük:** Támogatás; Tip/Donation; Tagsági szintek; Tagok; Perkek; Támogatói célok; Előzmények; Beállítások.

- Külső tip/donation link és provider adapter.
- Support goal, progress, campaign, supporter message, thank-you page.
- Membership tiers, price, billing period, perk, access level, renewal/cancel state.
- Member-only page/post/video/download/event.
- Entitlement domain dönti el a hozzáférést; UI nem.
- Webhook signature, idempotency, refund/chargeback.
- Member history, cancellation, failed payment, access revoke.
- Discord role sync canonical entitlementből.
- Kezdetben külső szolgáltató használható; saját payment processor csak indokkal.

### 3.11. Analytics
**Almenük:** Áttekintés; Weboldal; Stream; Tartalom; Közönség; Bolt; Kampányok; Exportok.

- Dátumtartomány, összehasonlítás, idősor, breakdown, filter, export.
- Web: views, sessions, referrer, device, performance, conversion privacy-safe módon.
- Stream: elérhető stream metrics, duration, category, engagement.
- Content: views, publish, platform, format, engagement és trend, provider API szerint.
- Store: sales, revenue, order state, conversion, average order value, product performance.
- Community: active members/participation/retention csak megbízható forrásból.
- Canonical metrics: source, unit, timezone, window, freshness, quality, provider.
- Unknown/absent adat nem jelenhet meg hamis nullaként.
- Privacy-safe analytics, consent, retention.
- Analytics olvasó/aggregáló réteg, nem ír üzleti adatot.

### 3.12. Tartalomtervező és kampányok
**Almenük:** Tartalomnaptár; Ötletek; Kampányok; Publikálási sor; Jóváhagyások; Kampányeredmények.

- Idea, brief, draft, asset, platform variant, deadline, owner, status.
- Campaign kapcsolja össze a weboldalt, contentet, schedule-t, linket, kupont és sponsor deliverable-t.
- Platform-specifikus title/caption/thumbnail variáns.
- Scheduled publishing, queue, retry, provider limits és human approval.
- Canonical entity ID-s kapcsolatok, nem duplikált tartalomrekord.
- Failed publish nem jelölhető successfulnak; partial result külön státusz.

### 3.13. Automatizáció
**Almenük:** Automatizációk; Sablonok; Események; Futási előzmények; Hibák és retry.

- Trigger → Condition → Action → Delay/Schedule → Result → Verify → Audit.
- Trigger: live start/stop, schedule change, new content, publish result, order paid, membership change, asset ready, webhook.
- Condition/filter/delay/retry/dead-letter/recovery.
- Action: notification, webhook, Discord message, tag, draft, analytics event, publishing job.
- Veszélyes, publikus vagy költséges akcióhoz preview/dry-run és jóváhagyás.
- Run ID, idempotency key, redacted log, result, rollback/compensation ahol lehetséges.
- Rate limit és loop detection.
- Queue/Workflow/Durable Object csak valós szükség alapján.
- Nincs arbitrary code execution vagy jogosultságot megkerülő admin útvonal.

### 3.14. SANCI AI
**Almenük:** AI áttekintés; Weboldal-asszisztens; Tartalom-asszisztens; Stream Intelligence; AI munkafolyamatok; Biztonsági napló.

Az AI későbbi réteg; a kézi és determinisztikus alapfolyamatok előbb készülnek el.
- Page outline, szöveg, SEO leírás, alt text, title, content idea és campaign brief javaslat.
- Page Model módosítás csak strukturált művelettel, nem tetszőleges HTML/JS közvetlen produkciós írásával.
- Intent → schema validation → permission/ownership check → diff/preview → draft revision → human approval → publish külön lépés.
- Nincs secret/private user data/tenant data kiszivárogtatás.
- Prompt injection és untrusted external content izolálása.
- Minden javaslat visszanézhető és visszavonható; public mutation emberi jóváhagyáshoz kötött.
- Cost/usage/quota/timeout/provider failure/redaction.
- AI-generated code nem futtatható közvetlenül a Workerben.
- Stream intelligence: transcript, chapter, clip/highlight candidate, title/description; csak engedélyezett media és reális feldolgozási kapacitás mellett.
- Automated publish alapértelmezetten kikapcsolt.

### 3.15. Szponzoráció és üzleti központ
**Almenük:** Media kit; Márkák és leadek; Megállapodások; Deliverable-ek; Határidők; Kampányok; Üzleti riportok.

- Creator profile és publikusan vállalható statisztikák.
- Media kit template/export/link/frissítés ideje.
- Brand lead/contact/status/deal/rate card/brief/deliverable/deadline.
- Campaign content, landing page, links and analytics.
- Private documents role/access control.
- Reminder/status/export.
- AI javaslatot adhat; árat, szerződést vagy vállalást ember hagy jóvá.

### 3.16. Beállítások és hozzáférés
**Almenük:** Fiók; Site; Nyelv és időzóna; Biztonság; Értesítések; Hozzáférések; Auditnapló; Adatkezelés; Export és helyreállítás; későbbi számlázás.

- Profile, email, avatar, identity provider, session, logout.
- Site name, locale, timezone, domain, default SEO, public status.
- Session expiry, sensitive action reauth, invalidation.
- RBAC és később granuláris permission.
- Audit: actor, timestamp, resource, action, result.
- Export: structured data, media manifest, importable config.
- Backup/restore, recovery, migration report, integrity check.
- Retention, consent, data export/delete request.
- Notification preferences/delivery status.
- Workspace/team/billing/tenant később.
- Destructive action confirmation és audit.

### 3.17. Csapat és munkaterület — későbbi
- Workspace, multi-site, invite, role, permission.
- Owner, admin, editor, designer, content manager, moderator, analyst, store manager, finance.
- Site/module/resource access.
- Invite expiry/revoke/accept, leave, owner transfer.
- Review/approval/comment/lock/conflict később.
- Tenant isolation API, asset, cache és analytics útvonalon.

### 3.18. Rendszerdiagnosztika — korlátozott hozzáférés
- Health, dependency, last sync, queue/workflow failure, runtime error.
- Structured log, correlation ID, redaction.
- Migration/schema version, integrity check, deploy version.
- Export/restore dry-run és recovery runbook.
- Developer API/webhook secret management admin jogosultsággal.
- Debug info nem jelenhet meg publikus oldalon.

---

---

## 4. Publikus weboldal — teljes funkciókatalógus

### 4.1. Főoldal
Hero/brand, creator profile, CTA, live/offline, current game, next stream, countdown, featured VOD/clip, YouTube/TikTok content, product, support, Discord/community, social hub, latest content, campaign, email signup megfelelő consenttel. Minden blokk Editorban konfigurálható; hiányzó adatnál fallback.

### 4.2. Stream oldal
Live player/embed, status, title, game/category, start time, next stream, support, community links. Offline fallback, mobil playback, external link, loading/error state. Chat/embed csak támogatott és privacy-safe esetben.

### 4.3. Adásrend oldal
Week/month/list view, timezone, next event, recurring/special events, postponed/cancelled, game profile, event link, később iCal/notification. Nincs külön publikus schedule database.

### 4.4. Tartalomközpont
VOD/clip/highlight/YouTube/TikTok/Shorts/category/tag/playlist/collection, search/filter/sort/pagination/related content. Private/deleted external item esetén fallback.

### 4.5. About/Creator profil
Bio, career, games, setup, FAQ, social, sponsor/media kit. Private contact data nem publikálható véletlenül.

### 4.6. Link Hub
Socials, CTA, schedule, latest content, Discord, merch, campaign, email signup. Mobile-first, link scheduling/UTM/click analytics később privacy-safe módon.

### 4.7. Közösség
Discord, events, posts, polls, clip submission; később profiles, comments, reactions, member-only content, moderation, spam controls.

### 4.8. Bolt és támogatás
Product list/detail, price/variant/stock, checkout provider, digital entitlement, tips, membership, supporter goal. Order/access status csak canonical backend domainből.

### 4.9. Public quality
- Responsive: kis/nagy mobil, tablet, laptop, desktop.
- Keyboard navigation, focus, semantic headings, alt text, contrast, reduced motion.
- Gyors first render, cache, optimized images, layout shift control.
- Per-page title/description/canonical/OG és link health.
- 404/500/maintenance navigálható, emberi nyelvű állapot.
- Consent/privacy ott, ahol analytics vagy embed igényli.
- Public oldal nem hívhat admin-only API-t és nem fedhet fel privát mezőt.

---

---

## 5. Kanonikus domain- és adatforrás-térkép

| Domain ID | Tulajdonos | Adat | Megjelenési felületek |
|---|---|---|---|
| IDENTITY | Auth/Identity | user, session | Admin, Settings |
| WORKSPACE | Workspace service, később | workspace, membership | Dashboard, Settings, Team |
| SITE | Site service | site config, ownership, locale | Admin, Website, public |
| PAGE | Page service/Page Model | page, draft, published snapshot | Pages, Editor, renderer |
| REVISION | Revision service | immutable revision/version/author | Editor, history, audit |
| NAVIGATION | Navigation service | menu tree/link target | Website, Editor, public |
| DESIGN_SYSTEM | Theme/token service | tokens/theme/components | Website, Editor, public |
| RESOURCE | Asset registry | asset metadata/reference | Media, Editor, public |
| INTEGRATION | Integration service | provider, connection, scopes, token ref, health | Connections, Dashboard, Live, blocks |
| LIVE_STATE | Live-state normalization service; cache is derived | normalized live/offline/stream state and freshness metadata | Dashboard, Live, public blocks |
| SCHEDULE | Schedule domain | events, recurrence, overrides | Schedule, Dashboard, Editor, public |
| GAME_PROFILE | Game/profile domain | game metadata/links/related content | Schedule, Content, public |
| CONTENT | Content domain | VOD/clip/post/video metadata | Content, Calendar, Editor, public |
| PUBLISHING | Publishing service | queue, attempts, provider results | Content Studio, Automation |
| COMMUNITY | Community domain; external provider adapters remain in INTEGRATION | posts, events, moderation, reports and community visibility policy | Community, public |
| PRODUCT | Commerce catalog | product, variant, collection, price | Store, Editor, public |
| ORDER | Order domain with payment/fulfillment provider adapters | order lifecycle, payment and fulfillment state | Store, Dashboard, Analytics |
| ENTITLEMENT | Access service | member access, digital delivery | Membership, Content, Store, public |
| SUPPORT | Support domain; payment/support provider adapters remain in INTEGRATION | tip, goal, support link and provider-confirmed support state | Support, Dashboard, public |
| ANALYTICS | Metrics pipeline | normalized events/aggregates | Analytics, Dashboard |
| CAMPAIGN | Campaign domain | campaign, links, assets, goals | Content Studio, Business, public |
| AUTOMATION | Workflow engine | rules, runs, retries, audit | Automation, system events |
| AI_OPERATION | AI orchestration | structured proposal, approval, usage | SANCI AI, Editor, Content Studio |
| SPONSORSHIP | Business domain | lead, deal, deliverable, media kit | Business, Campaigns |
| LOCALIZATION | Localization service | translation keys, locale-specific content, glossary, completeness status | Website, Settings, Content Studio, public |
| SEO_PUBLICATION | SEO/publication metadata service | per-page metadata, canonical/robots policy, redirects, sitemap jobs | Website, Editor, public renderer |
| FORM_SUBMISSION | Form/submission service | form schema, submissions, consent evidence, spam/review state | Website, Settings, Community/marketing where enabled |
| NOTIFICATION | Notification service | notification, delivery attempts, preferences, digest/silent-period policy | Notification center, Dashboard, Settings |
| HELP_CENTER | Help/onboarding service | help articles, glossary, onboarding progress, troubleshooting and feedback | Help center, Admin modules |
| SEARCH | Permission-aware search/index service | derived searchable projections, index version and freshness | Admin global search, domain lists |
| FAN_IDENTITY | Fan identity/community account service | fan profile, preferences, consent, export/delete lifecycle | Community, public/member areas |
| STREAM_TOOLS | OBS/overlay service | pairing reference, overlay/widget config and version, authorized command history | OBS, Live Studio |
| DEVELOPER_API | Developer platform/API service | API key metadata/scopes, API version/quotas, creator-defined outbound webhook registry/delivery | Developer platform |
| EXTENSION | Extension registry/sandbox service | manifest, signature/provenance, permission, install/version lifecycle | Extensions/Marketplace, OBS/widget modules |
| BILLING_PLAN | SaaS billing/plan service | subscription, plan entitlement, usage/quota, invoice state | Team/SaaS, Settings |
| SETTINGS | Scoped settings service | locale preference, notification preferences, privacy settings | Settings, modules |
| AUDIT | Audit service | actor, operation, resource, result | Settings, Diagnostics |
| BACKUP | Export/recovery service | manifest, snapshots, restore jobs | Settings, Diagnostics |

Kötelező domain szabályok:
1. D1 tárolja a strukturált relációs adatot/állapotot; R2 a nagy bináris objektumot.
2. Minden üzleti lekérdezés site/workspace ownership kontextusban fut; a kliens által küldött site ID nem jogosultság.
3. Mutáció csak validált domain operation/command útvonalon.
4. Provider adapter normalizál; külső ID megőrződik, de nem helyettesíti a belső canonical ID-t.
5. Cache származtatott, lejáró vagy invalidálható; nem válhat végleges igazságforrássá.
6. Page Model dinamikus blokk konfigurációt/hivatkozást tárolhat, teljes üzleti rekordot nem másol.
7. Ownership ellenőrzés szerveroldali minden kapcsolatnál, adatnál, médiánál és műveletnél.
8. Domain változásakor minden olvasófelület konzisztens frissítést kap; stale állapot látható.
9. A globális kereső és a dashboard csak permission-aware, származtatott nézet; nem hoz létre második domain-adatforrást.
10. Az Admin/creator identity és a publikus fan identity külön életciklusú; összevezetésük csak explicit biztonsági és adatvédelmi döntéssel lehetséges.
11. API key, OAuth token és webhook secret titkos kezelést kap; a domain-adatbázisban csak szükséges metadata/secret reference tárolható, plaintext secret nem.
12. Minden új modulhoz meg kell nevezni a domain ownerét, a tartós adatforrást, a parancs/API határt, a jogosultsági scope-ot és a restore/törlési viselkedést.
13. Külső provider inbound webhook (INT-017) és a creator által konfigurált outbound webhook (DEV-003) külön irányú szerződés, secret- és retry-életciklus; egyik sem helyettesíti a másikat.

---

---

## 6. Technológiai és architekturális elvek

### 6.1. Meglévő stack
- Cloudflare Workers + TypeScript/JavaScript + D1 + R2 a jelenlegi alap.
- React vagy más nagy frontend framework nem vezethető be pusztán kényelmi okból; szükséges a bizonyított indok és külön döntés.
- Új dependency csak maintenance, license, security advisories, bundle size, compatibility, testability és alternatives review után.
- Először a meglévő platform és megbízható open-source lehetőségek felmérése; saját implementáció csak indokolt esetben.

### 6.2. API-first és domain ownership
- Minden API-nak egyértelmű request/response, error code, auth, ownership és idempotency szerződés.
- Route handler vékony; üzleti szabály domain/service rétegben.
- Szerveroldali schema validation; kliensvalidáció csak UX.
- Provider timeout, rate limit, retry/backoff és error normalization.
- Mutation correlation ID és audit, ahol indokolt.

### 6.3. Database és migration
- Minden schema változás verziózott migration.
- Előzetes schema/data audit, backfill, dry-run, rollback/recovery.
- Foreign key, unique, index, not-null és check constraint indok szerint.
- Site ownership adatbázis- és szerveroldalon.
- Migration előtt read-only/preflight és mentési terv.
- Row/null/FK counts és postcondition ellenőrzés.
- D1-ben nincs nagy médiafájl.
- Queue/Workflow/Durable Object csak konkrét indokkal.

### 6.4. Auth és security
- Server-side authn/authz minden védett útvonalon.
- User → workspace membership → site access → resource ownership → operation permission.
- OAuth state/CSRF, token titkos tárolás, refresh/revocation.
- XSS, CSRF, SSRF, injection, open redirect, IDOR, mass assignment, rate-limit/abuse védelem.
- Safe embed, sanitization, security headers, HTTPS, secure cookies, session rotation/expiry.
- Secret nem kerülhet logba, response-ba, bundle-be vagy commitba.
- Audit log redacted.
- Dependency és API policy rendszeres review.
- Public/admin és tenant/site adatizoláció.

### 6.5. UI/UX
- Közös design tokenek és következetes komponensállapotok.
- Minden data screen: loading/empty/error/success/stale/disabled/unsaved/retry.
- Save és publish külön.
- Veszélyes művelet megerősítés + eredmény + audit.
- Undo csak biztonságosan visszafordítható műveletre.
- Mobilon safe-area, keyboard/scroll és hüvelykujj-elérhető kontrollok.
- Keyboard navigation, focus, reduced motion, screen-reader labels.
- Állapot nem csak színnel jelölhető.
- Navigáció a felhasználói feladatot követi, nem a DB struktúrát.
- Placeholder egyértelmű; nincs dead UI.

### 6.6. Performance és operations
- Performance baseline, latency, bundle size, cache hit/miss, error rate.
- Responsive images, lazy loading, layout shift control.
- Public/private cache elkülönítése, explicit invalidation.
- Indexek, pagination, query plan review, N+1 elkerülése.
- Rate/quota-aware sync.
- Structured logs, correlation IDs, health, error tracking, deploy version.
- Backup/restore/export és recovery runbook.
- Deploy után smoke test; successful deploy önmagában nem user acceptance.

---

---

## 7. Kötelező fejlesztési elvek

1. Egy aktív pont, nincs párhuzamos product feature.
2. Függőség előbb: security/data/domain/API/UI/integration/acceptance.
3. Kicsi, ellenőrizhető változtatás.
4. No silent loss: adat, revision és unsaved edit nem veszhet el csendben.
5. No duplicate source: egy canonical domain tulajdonos.
6. Explicit status; kód, CI, live és user acceptance külön bizonyíték.
7. Test before close; acceptance nélkül nincs PASS.
8. Production evidence szükséges, ha runtime/DB/provider/deploy érintett.
9. UI munkafolyamatnál user acceptance, ha a pont ezt előírja.
10. Regression tests minden érintett korábbi útvonalra.
11. Migration safety: preflight, backup/recovery, postcondition.
12. Accessibility by default, nem utólagos javítás.
13. Privacy by design és adatminimalizálás.
14. AI bounded and last: strukturált, validált, jóváhagyásos.
15. Open-source-first, dependency/license/security review.
16. Evidence over assumption.
17. Recovery dokumentálása minden kritikus adatúthoz.
18. Nincs premature rewrite; bizonyíték, migration és regression szükséges.
19. No dead UI.
20. Continuous benchmark, de csak a célhoz, költséghez és architektúrához illő tanulságot alkalmazzuk.

---

---

## 8. Külső benchmark és kutatás

A benchmark célja a problémák és jó minták azonosítása, nem másolás. Minden megállapításhoz kell forrás, dátum, funkció/UX minta, creator-probléma, alkalmazhatóság, kockázat, döntés és acceptance-hatás.

### 8.1. Vizsgálandó kategóriák
- Visual website builders: Framer, Webflow, Wix, Squarespace.
- CMS/design systems: WordPress/Gutenberg, Webflow CMS, Figma workflows.
- Editor frameworks: GrapesJS, Craft.js, Puck, ha a jelenlegi Editorhoz relevánsak.
- Creator home/link hub: Beacons és hasonló platformok.
- Creator commerce/membership: Fourthwall, Patreon, Ko-fi, Shopify.
- Streamer tools: Twitch Creator Dashboard, Streamlabs, StreamElements, OBS.
- Integrációk: Discord, YouTube, TikTok, Kick hivatalos API-dokumentációi.
- AI/content repurposing: transcript, highlight, clip, caption, workflow.
- Webminőség: W3C/WCAG, Core Web Vitals, web security, privacy és SEO.

### 8.2. Kutatási szabályok
- Hivatalos docs/product/API/policy/release notes előnyben.
- Árazás, API-képesség, scope, provider policy változhat; implementáció előtt friss ellenőrzés.
- Nem másolunk védett UI-t, márkát, kódot, nem nyilvános adatot vagy működést.
- Nem építünk olyan funkciót, amit az API/policy nem enged.
- Benchmark nem helyettesíti a user testet és security review-t.
- Open-source library értékelése: licence, maintenance, CVE, community, bundle size, accessibility, integration cost.

### 8.3. Benchmark kimenet
1. Forráslista és ellenőrzési dátum.
2. Funkció- és UX-minták.
3. Releváns creator-probléma.
4. Adopt/modify/reject döntés és indok.
5. Domain/UI hatás.
6. Teszt és acceptance követelmény.
7. Következő felülvizsgálat.

---

## 9. Részletes fejlesztési munkacsomagok és elfogadási szerződések

**A kanonikus, legfelső szintű fejlesztési sorrend a 41.2. fejezet F0–F11 listája.** A 9. fejezet P1–P22 pontjai részletes munkacsomagok és elfogadási területek, nem egy második, párhuzamos roadmap. A munkacsomagok a megfelelő F-fázisokba kerülnek a 63.5. fejezet leképezése szerint. A 39. fejezet a fázisok rövid áttekintése; nem írhatja felül a 41.2. fejezet sorrendjét.

A fejlesztés függőségi sorrendben halad. A teljes termékcél végig megmarad; egyszerre a következő, a meglévő alapokra építhető és ellenőrizhető fejlesztési pont készül el. Történeti terv-összehasonlítás nem előfeltétele a termékfejlesztésnek.

### F0 — A meglévő core workflow megbízható lezárása
- Admin bejelentkezés és jogosultságok.
- Kanonikus Page Model és Visual Editor v2.
- Canvas, Layers, Inspector, responsive értékek és command/history.
- Draft mentés, reload, revision conflict és hálózati helyreállítás.
- Preview és publish külön életciklusa; a publikált snapshot ellenőrzése.
- A core workflow-hoz szükséges Resource/Media Registry-hivatkozások, R2 objektumok és D1 metaadatok konzisztenciája; a teljes asset-könyvtár, keresés, gyűjtemények, licenc- és használati térkép az F2/P4 megfelelő részében készül.
- Publikus renderer, cache invalidation és valós oldalellenőrzés.
- Telefonos/tabletes Admin és Editor alapvető használhatósága.
- A már lezárt site ownership, D1 integrity és Twitch ownership szerződések megőrzése; csak regresszió esetén nyílnak újra.
- **F0 kimenet:** a teljes alapfolyamat végigvihető, nincs csendes adatvesztés, a hibák helyreállíthatók, a draft nem publikálódik véletlenül.

### P1 — Platformbaseline
**P1.1 Repository/build:** branch, HEAD, working tree, scripts, typecheck, domain/editor/integration tests, CI checks, Worker entrypoint.  
**P1.2 Route inventory:** admin/public/API routes, auth, ownership, validation, legacy disposition, 401/403/404/405/409/429/500 behavior.  
**P1.3 Database/storage:** D1 schema/migrations, FK/quick_check/ownership, R2 metadata/object key, migration dry-run/rollback.  
**P1.4 Auth/session/ownership:** auth tests, cross-site negative tests, expiry/logout/invalidation, CSRF/OAuth state.  
**P1.5 Observability:** structured logs/redaction, health/version, backup/restore runbook, pre/post deploy smoke and rollback.

### P2 — Admin shell
**P2.1 Shell:** top bar, sidebar/adaptive navigation, breadcrumbs, profile, public site shortcut, session/logout; desktop/tablet/mobile.  
**P2.2 Navigation:** full menu map, permission visibility, explicit placeholder status, keyboard/mobile navigation.  
**P2.3 Shared UI states:** loading/empty/error/success/stale/disabled/dirty/saving, retry/recovery, unsaved guard, dialogs, forms, tables, filters, pagination.  
**P2.4 Dashboard:** real data, canonical links, stale/error states, mobile/keyboard acceptance.

### P3 — Editor core
**P3.1 Page Model:** canonical schema/version, stable IDs, parent-child invariant, validation, serialization round-trip, migration.  
**P3.2 Command/history:** every mutation via command, undo/redo, transaction/rollback, selection/history integrity.  
**P3.3 Save/revision:** draft save separate from publish, revision validation, save/reload round-trip, stale conflict recovery, in-flight edits remain dirty, network recovery.  
**P3.4 Canvas:** selection, drag/drop, resize, reorder, alignment, zoom/pan/fit, keyboard alternative.  
**P3.5 Layers:** tree, expand/collapse, sync with canvas/Inspector, reorder/rename/duplicate/hide/lock, hierarchy after reload.  
**P3.6 Inspector:** Property Registry, resolved viewport value, responsive override/reset, unit/min/max/enum/default, command/history/persistence.  
**P3.7 Responsive:** desktop/tablet/mobile, inheritance, viewport switching without data loss, real-browser acceptance.  
**P3.8 Mobile Editor:** fixed action bar/safe-area/keyboard/scroll, panel switch, save/preview/publish/undo, real Android Chrome phone/tablet smoke; tablet-login issue remains separately tracked.

### P4 — Resource/media
**P4.1 Registry:** asset ID/ownership/metadata, D1/R2 boundary, checksum, references, cross-site denial.  
**P4.2 Upload/download:** validation, progress, retry/cancel, R2 lifecycle, safe URL, expiry, large/mobile upload.  
**P4.3 Library UI:** search/filter/collection/tag/preview/alt text/usage map/delete warning; Editor picker shares registry.  
**P4.4 Icons/fonts:** category/search/license/SVG sanitization/font fallback/weight/load performance.

### P5 — Design system
**P5.1 Tokens:** typed schema, token editor, usage map, preview/diff/rollback.  
**P5.2 Theme:** colors/type/spacing/layout, responsive defaults, reduced motion, renderer/Editor consistency, contrast.  
**P5.3 Templates:** site/page/section/component distinct types, save/preview/apply/version/compatibility/rollback.  
**P5.4 Reusable symbols:** master/instance, explicit override/detach, global update preview, usage map, undo/reload consistency.

### P6 — Pages and renderer
**P6.1 Lifecycle:** CRUD/slug/hierarchy/draft/published/archive/revisions/duplicate/delete reference checks.  
**P6.2 Publish:** preview permission, validation, immutable published snapshot, cache invalidation, rollback, production acceptance.  
**P6.3 Renderer/blocks:** component registry/schema/fallback/safe rendering/data binding/performance; preview matches public.  
**P6.4 Navigation/header/footer:** canonical navigation, mobile menu, link validation, 404/redirect/canonical.  
**P6.5 SEO/public quality:** title/description/OG/sitemap/robots/structured data/link/alt audit, accessibility/performance/production domain smoke.

### P7 — Integrations
**P7.1 Contract:** provider adapter, secret/token storage, scopes, health, sync, errors, retries, audit, mock tests.  
**P7.2 Twitch:** OAuth/state/callback, token lifecycle, site binding, reconnect/disconnect, scope, production callback and cross-site negative tests.  
**P7.3 Live state:** normalize live/offline, poll/webhook, quota, stale state, Dashboard/Live/public consistency, outage test.  
**P7.4 Schedule sync:** conflict/manual override, timezone/recurrence, all surfaces share API, idempotent sync.  
**P7.5 YouTube/TikTok/Discord/Kick:** current capability/policy review, adapter, permission-specific activation, partial/revoked access, publish only when supported.

### P8 — Creator profile, schedule and blocks
**P8.1 Profile/game profile:** public/private fields, image/links/tags, schedule/content relationships.  
**P8.2 Dynamic block catalogue:** live, next stream, schedule, countdown, VOD/content feed, platform feed, Discord CTA, support, social hub, later product/collection; schema/source/fallback/error/permission for every block.  
**P8.3 Public site:** home/stream/schedule/about/content/link hub/community/support/store as enabled, responsive, accessible, fast, SEO and embed privacy.

### P9 — Content and publishing
**P9.1 Content model:** type/status/platform/source ID/metadata/tags/collections/ownership/visibility, duplicate detection.  
**P9.2 Library:** CRUD/import/archive/search/filter/sort/pagination, VOD/clip/highlight/short/video/post, related content and thumbnails.  
**P9.3 Calendar/queue:** status lifecycle, provider permission, idempotency, retry, approval, partial success.  
**P9.4 Studio:** ideas/brief/script/title/description/tag/thumbnail, platform variants, campaign, approval, export and schedule.

### P10 — Community/audience
**P10.1 External:** Discord server/bot/permissions, CTA, event/notification hooks, reconnect.  
**P10.2 Own community:** profile/follow/post/comment/reaction/poll/event, report/moderation/ban/role/audit, spam/rate limit/privacy.  
**P10.3 Email/audience:** signup/consent/double opt-in if required, subscriber list/segment/export/unsubscribe, newsletter vs transactional, bounce/complaint, retention/delete.

### P11 — Commerce/support/membership
**P11.1 Provider strategy:** fees, EU/HU payment, taxes, fulfillment, API, refund, portability, merchant-of-record decision, legal review.  
**P11.2 Catalog:** product/variant/collection/category/price/media, physical/digital/bundle/preorder, inventory/fulfillment, public pages.  
**P11.3 Orders:** checkout adapter, order/payment/fulfillment, signed webhook/idempotency, refund/cancel/tracking, test and production acceptance.  
**P11.4 Digital delivery:** purchase→entitlement→secure access, signed expiring links, refund revocation, no public R2 exposure.  
**P11.5 Support/membership:** tips/goals/tiers/perks/access, canonical entitlement, Discord role sync, cancellation/refund/failed payment.

### P12 — Analytics
**P12.1 Event taxonomy:** canonical event schema, source, timestamp, consent, dedup/late event, retention.  
**P12.2 Web analytics:** views/sessions/referrer/device/performance, privacy/consent/bot filtering.  
**P12.3 Creator/content analytics:** provider metrics with unit/source/freshness, per-stream/content comparisons, no fabricated values.  
**P12.4 Commerce/community analytics:** canonical order metrics, campaign attribution, permission, export/retention.

### P13 — Campaign/sponsorship
**P13.1 Campaigns:** goals/dates/links/assets/products/content/performance, templates, attribution.  
**P13.2 Sponsorship:** media kit, public metrics, leads/brands/deals/rate card/deliverables/deadlines, private docs, reminders/export.

### P14 — Automation
**P14.1 Event registry:** stable schema, authenticated source, dedup/order, retention.  
**P14.2 Engine:** trigger/condition/action/delay/result, run ID, idempotency, retry/timeout/cancel, cycle detection, dry-run/approval, recovery.  
**P14.3 Builder:** rules/templates/active/paused/version, preview/permissions/test run/audit; no arbitrary code.

### P15 — Stream Studio/Overlay/OBS
**P15.1 Assets:** overlay/scene/browser-source config, dimensions/safe area/version/preview/export.  
**P15.2 OBS connector:** explicit secure pairing, state/commands/permissions, disconnect/reconnect, no exposed secrets.  
**P15.3 Stream tools:** alerts/overlays/timers/commands/loyalty/giveaway/poll/moderation per provider capability, test mode/rate limit/audit.

### P16 — Backup/portability/diagnostics
**P16.1 Export:** site/pages/revisions as supported/design/navigation/metadata/asset manifest, version/checksum, secret exclusion.  
**P16.2 Backup/restore:** scope/retention/encryption, dry-run, D1/R2 consistency, RPO/RTO, restore test.  
**P16.3 Diagnostics:** broken links/assets/invalid blocks/stale integration/failed job, redacted report and remediation.

### P17 — Security/accessibility/performance/reliability
**P17.1 Security:** auth/permission/IDOR, OAuth/CSRF/session, XSS/embed, SSRF/redirect/injection, rate limit, webhook signature, secret/dependency audit.  
**P17.2 Accessibility:** keyboard, semantic structure, focus, screen reader, contrast, reduced motion, zoom, forms/dialogs/tables/canvas alternatives, automated and manual review.  
**P17.3 Performance:** Core Web Vitals, asset compression, query/API latency, pagination/cache, Editor large documents, bundle/dependency review, slow network.  
**P17.4 Reliability:** provider outage, retry/backoff, D1/R2 recovery, idempotent webhook/publish, alert thresholds, rollback/restore drill.

### P18 — Localization
**P18.1 Locale foundation:** Hungarian primary, translation keys/fallback, dates/numbers/currency/timezone, content locale vs UI locale, missing-key tests.  
**P18.2 Multi-language public site:** locale routes, hreflang, translated pages/SEO/content, fallback/navigation, canonical/indexing rules.

### P19 — Multi-site/team/SaaS
**P19.1 Workspace/site:** ownership model, switcher/context, resource/integration scope, cross-site denial, config isolation.  
**P19.2 Team:** invites/roles/permissions/review/approval/audit/notifications/conflict/owner transfer.  
**P19.3 Billing:** cost-based plans/entitlements/feature gates/subscription lifecycle/usage metering/quotas/export/deletion; no pricing promise before cost review.

### P20 — Extension marketplace
**P20.1 Contract:** manifest/permissions/version/compatibility/review, safe execution, install/update/uninstall/migration, supply-chain security/rollback.  
**P20.2 Marketplace:** themes/blocks/templates/overlays/OBS scenes/assets, license/attribution/version/rating/support, entitlement/payment only after legal review, moderation/malicious package scan.

### P21 — AI and creator intelligence
**P21.1 Governance:** provider/data policy, structured operations, schema/permission/ownership checks, diff/preview/approval/rollback, cost/quota/log/redaction, prompt-injection tests.  
**P21.2 Website/content AI:** page/design/text/SEO/accessibility/translation suggestions, human edit/approval, no direct production mutation.  
**P21.3 Stream intelligence:** transcript/chapter/highlight/clip candidate, short-form reuse, copyright/privacy/retention, publish only via separate explicit policy.

### P22 — End-to-end acceptance and continuous evolution
**P22.1 Full journey:** Admin login→connect Twitch→schedule→create page→blocks→preview→draft save→reload→publish→public verification; cross-surface consistency; asset flow; content hub; enabled commerce; recovery tests; mobile/desktop.  
**P22.2 Release readiness:** active gates PASS, no critical/high security defect, restore/rollback verified, accessibility/performance/SEO within budgets, help/error messages, production smoke/user acceptance, release notes/known issues.  
**P22.3 Continuous discovery:** benchmark refresh, user feedback, API/policy review, proposal with impact/dependency/cost/security, no capability silently removed.

---

### A részletes munkacsomagok határa
- A P1–P22 munkacsomagok a kanonikus F0–F11 fázisokon belül vagy azokat keresztmetszetben szolgálják ki; önmagukban nem hoznak létre külön, párhuzamos ütemtervet.
- A SANCI AI részletes képességeinek kanonikus termékfejezete a 40. fejezet, végrehajtási fázisa az F10.
- A multi-site/team/SaaS/marketplace részletes képességeinek kanonikus termékfejezete a 61. fejezet, végrehajtási fázisa az F11.
- **Fázisszabály:** a fázis nem töröl funkciót a termékcélból. A tényleges provider/API-képességet, költséget, jogi feltételeket és jogosultságokat az adott integráció aktiválásakor ellenőrizzük.

---

## 10. Minden funkció kötelező specifikációja

Minden egyedi funkció-ID alatt kötelező:
1. ID és név.
2. Felhasználói cél.
3. Belépési hely: Admin menü, public route, Editor panel vagy automation.
4. Pontos működés és eredmény.
5. Canonical domain owner.
6. Adatforrás: D1/R2/provider/cache.
7. Olvasó és író felületek.
8. Permission, scope, ownership és operation.
9. Request/response/schema/status/error contract.
10. Függőségek.
11. Hibamódok: timeout, stale, outage, conflict, invalid input.
12. Security/privacy/secret/retention.
13. UI states.
14. Automated tests.
15. Negative tests.
16. Live acceptance ha runtime/DB/provider/deploy érintett.
17. User acceptance ha UI/workflow érintett.
18. Rollback/recovery.
19. Státusz.
20. Bizonyíték: commit/CI/test/runtime, titok nélkül.
21. Tervfrissítés és next point.
22. Regressziós hatás.

### 10.1. Kötelező negatív tesztek
- Másik site resource ID-ja.
- Hiányzó/lejárt session.
- Hiányzó scope vagy visszavont provider engedély.
- Hibás schema/túl nagy input.
- Duplikált webhook/publish/automation event.
- Stale revision és párhuzamos mentés.
- Hálózati timeout mentés közben.
- Használatban lévő asset törlése.
- Kliens által manipulált role/permission/site ID.
- Hiányzó/hibás provider data.
- Cache stale/invalidation.
- Public route privát adatot kér.
- Retry dupla tranzakciót vagy contentet okoz.
- Restore inkompatibilis manifestből.
- AI javaslat jogosulatlan műveletet tartalmaz.

---

---

## 11. Megvalósítási állapotok

A terv és a tényleges készültség mindig különbözik. Csak az alábbi státuszok használhatók:

- **IMPLEMENTED / VERIFIED:** a kód és a szükséges teszt/runtime bizonyíték igazolja.
- **IMPLEMENTED / ACCEPTANCE OPEN:** a funkció kódban jelen van, de éles, böngészős, eszközös vagy felhasználói elfogadás még hiányzik.
- **IN PROGRESS:** aktív fejlesztés folyik.
- **PLANNED:** termékspecifikáció megvan, implementáció még nincs vagy nem igazolt.
- **PROVIDER-DEPENDENT:** a végleges viselkedés az adott platform API-jától, scope-jától vagy policy-jától függ.
- **BLOCKED:** konkrét külső vagy technikai akadály áll fenn, amelyhez megoldási lépés tartozik.

A „tervben szerepel”, „UI megjelenik” vagy „API válaszol” önmagában nem jelent teljes készültséget. A lezárás az adott funkcióra vonatkozóan ellenőrzi a sikeres és hibás útvonalat, jogosultságot, adatkonzisztenciát és helyreállítást.

---

## 12. Kiadási és prioritási stratégia

Nincs kötelező 1.0/2.0 számozás, amely mesterségesen korlátozza a fejlesztést. A teljes termékkatalógus mindig érvényes; a tényleges release a függőségek szerint áll össze:

1. Biztonságos alap: build/auth/ownership/data/revision/storage/recovery.
2. Első teljes napi workflow: Admin→connection→schedule→page/editor→save→preview→publish→public renderer.
3. Publikus minőség: pages/navigation/theme/media/SEO/accessibility/responsive.
4. Creator működés: live/schedule/game profile/content/integrations.
5. Növekedés: content studio/link hub/audience/community/analytics.
6. Bevétel: support/membership/commerce/digital products/sponsorship.
7. Operáció: automation/alerts/OBS/diagnostics/backup.
8. Platformosodás: multi-site/team/permissions/billing/marketplace.
9. AI: strukturált, jóváhagyásos segítség, majd stream intelligence.
10. Folyamatos security/performance/accessibility/benchmark.

Korábbi release scope csak akkor bővíthető, ha dependency PASS, érték egyértelmű, költség/kockázat vállalható és quality gate nem gyengül. A katalógusból funkciót nem törlünk pusztán azért, mert későbbre kerül.

---

---

## 13. Minőségi és üzemeltetési kapuk

**PR előtt:** diff/scope review, typecheck, releváns tesztek, diff-check, security/dependency review, migration/API contract review, aktív pont/acceptance ellenőrzése.

**Deploy előtt:** branch/commit/working tree, secret/binding/migration preflight, rollback plan, API/data tests, deploy diff/version.

**Deploy után:** health, auth/permission, érintett API/DB, public renderer/cache, Editor save/reload/publish ha érintett, browser/device ha UI érintett, log/error review, PASS/FAIL rögzítése.

**Release blocker:** adatvesztés/revision corruption, tenant data leak, secret leak, auth bypass, draft/published összekeverés, payment/entitlement hiba, csendes sync felülírás, kritikus broken public route/asset, kritikus accessibility/mobil hiba a release scope-ban, nem helyreállítható migration/restore.

---

---

## 14. Stabil funkcióazonosító-rendszer

Az ID a menücímke változásakor sem változik:
- ADM — Admin shell/Dashboard
- WEB — website/pages/navigation/SEO/publish
- EDT — Visual Editor
- DSN — design system/themes/templates/components
- RES — resources/media/assets/icons/fonts
- INT — integrations/connections
- LIV — live/stream
- SCH — schedule/calendar/game profiles
- CNT — content/studio/publishing
- COM — community/moderation
- STO — store/products/orders/fulfillment
- SUP — support/membership/entitlements
- ANL — analytics/metrics
- CAM — campaigns/sponsorship/business
- AUT — automation/workflows
- OBS — OBS/overlay/stream studio
- AI — AI orchestration/creator intelligence
- SEC — security/privacy/permissions
- OPS — observability/deploy/backup/recovery
- LOC — localization
- TEAM — workspace/team/roles
- MKT — marketplace/extensions
- QA — quality/release/acceptance

Példák: INT-TWITCH-OAUTH, SCH-RECURRING-EVENT, EDT-RESPONSIVE-RESET, WEB-PUBLISH-SNAPSHOT. A menücímke és a belső ID külön fogalom.

---

---

## 15. Folyamatos ellenőrzőlisták

**Termék:** minden Admin művelet/public route; egy canonical domain owner; közös adat több felületen; provider capability matrix; commerce/entitlement; AI approval/rollback; minden modulhoz dependency/acceptance.

**Technika:** auth/RBAC/ownership/tenant isolation; validation/API errors/idempotency; migration/index/FK/integrity; D1/R2 boundary; cache invalidation; redacted logs/monitoring; backup/export/restore; performance/accessibility/SEO/privacy; dependency/license/security; browser/device/production acceptance.

**Felhasználói minőség:** feladatot nevező menük; egyértelmű eredmény; save és publish külön; érthető hiba/következő lépés; unsaved changes védelem; mobilhasználhatóság; közös adatok konzisztenciája; nincs hamis adat/success.

---

## 16. Döntési napló és változáskezelés

Minden döntéshez: dátum, ID, probléma, alternatívák, döntés/indok, érintett domain/menu/ID, data/API/migration/security/privacy/performance hatás, teszt/acceptance, rollback.

Tervmódosításkor a korábbi követelmény státusza és indoka megmarad. Új követelmény egyedi ID-t, domain ownert és DoD-t kap. Funkció nem nevezhető át úgy, hogy elveszítse korábbi jelentését; nem távolítható el csendben.

---

---

## 17. Aktív fejlesztési pont sablon

Minden konkrét fejlesztési pont rögzíti:
- az elérni kívánt felhasználói eredményt;
- a pontos scope-ot és a nem célzott változtatásokat;
- az érintett felületeket, domaineket, API-kat és adatforrásokat;
- az előfeltételeket és a függőségeket;
- a lépéseket és az érintett fájlokat;
- a valós repositoryban létező tesztparancsokat;
- a pozitív és negatív teszteket;
- az éles/böngészős ellenőrzést, ha releváns;
- a hibakezelést, visszaállítást és elfogadási feltételeket;
- az elkészült eredményt és a következő, függőség szerint esedékes fejlesztési pontot.

A pont célja működő termékfunkció szállítása, nem dokumentum-audit végrehajtása.

---

## 18. Ismert core acceptance-feladatok

Ezek meglévő termékfunkciókhoz tartozó ellenőrzési feladatok:
- **EDT-SAVE-RELOAD:** mentés és újratöltés utáni teljes round-trip.
- **EDT-PUBLISH-SNAPSHOT:** save → reload → publish → publikus render.
- **EDT-MOBILE-ACTION-BAR:** valódi mobilböngészős ellenőrzés.
- **EDT-LAYERS-INSPECTOR-RESPONSIVE:** Canvas/Layers/Inspector/responsive konzisztencia.
- **ADM-TABLET-LOGIN:** ismert, külön kezelendő tabletes belépési hiba.
- **INT-TWITCH:** a lezárt ownership/integration szerződés megőrzése és regressziótesztelése.

Az egyes tételek státusza csak az adott ellenőrzés tényleges lefutása után módosítható.

---

## 19. Következő fejlesztési pont

**Következő implementációs fókusz a tervlezárás UTÁN: F0 — Admin → Visual Editor → mentés → előnézet → publikálás → publikus weboldal.** A jelenlegi aktív munka nem F0 implementáció, hanem a MASTER teljességének, belső konzisztenciájának és fejlesztéskövetési szabályainak lezárása. F0 nem indulhat el a 63. fejezet lezárási feltételeinek teljesülése előtt.

**Következő konkrét ellenőrzési pont: EDT-SAVE-RELOAD → EDT-PUBLISH-SNAPSHOT.** A repositoryban lévő Editor-tesztek között a mentési útvonal több ellenőrzése forrásszöveg-szerződést (statikus mintákat) vizsgál; ez önmagában nem bizonyít valódi böngészős, D1-es mentés/újratöltés/publikálás round-tripet. Először a meglévő teszteket és futó környezetet kell ellenőrizni, majd valódi draft mentés → újratöltés → preview → explicit publish → publikus oldal ellenőrzést végigvinni, a hibákat reprodukálhatóvá tenni és csak ezután módosítani a kódot. Új, nagyobb termékmodul nem kerülhet e core ellenőrzés elé.

Ez a fókusz nem a teljes Creator Platform scope-jának szűkítése: csak a végrehajtás sorrendjét határozza meg. A statikus teszt, a valódi runtime/böngészős ellenőrzés és a felhasználói elfogadás külön bizonyítéktípus; egyik nem helyettesíti automatikusan a másikat.

---

## 20. A termék végső állapota

A Sanci9517 akkor éri el a teljes Creator Operating Platform célját, ha:
- egyetlen Editorral szerkeszthető a weboldal;
- Admin és public ugyanazon canonical Page/Content/Resource/Schedule/Integration domainekből dolgozik;
- kapcsolatok, live state, schedule és content megbízhatóan szinkronizál;
- media, design system, templates és reusable components konzisztens;
- content több platformra tervezhető/jóváhagyható/publikálható a tényleges provider képesség szerint;
- community, support, membership, store és sponsorship külön, érthető modul;
- analytics pontos, privacy-safe és forrással/freshness-szel jelölt;
- automation auditált, idempotens és helyreállítható;
- AI csak validált, engedélyezett, előnézhető és jóváhagyott műveletet végez;
- backup/export/restore ténylegesen tesztelt;
- multi-site/team/SaaS nem követel teljes újraírást;
- minden funkcióhoz domain owner, teszt, acceptance és recovery tartozik;
- a rendszer mobilon és desktopon gyors, hozzáférhető, biztonságos és megbízható.

**Végső szabály:** nem attól kész a termék, hogy a tervben minden sor szerepel, és nem attól teljes, hogy sok menüpont látható. Akkor kész, ha a funkció valós adatokkal, jogosultságokkal, hibakezeléssel, tesztekkel és acceptance-szel működik. A teljes terv megőrzi az összes képességet; a végrehajtás egyesével, függőség szerint halad.

---

## 21. Kiegészítő, kötelezően megőrzendő képességek

### 21.1. Publikus tartalomtípusok és Creator Resources
Home, About/Profile, Live, Schedule, VOD/Content, Clips/Shorts, Community, Contact, Creator Resources, Link Hub, Support, Press/Sponsor; később Store, Membership, Events, Blog/News, Digital Products. Resource types: guide, download, setup-lista, ajánlott eszköz, disclosed affiliate link, tutorial, FAQ, preset, külső erőforrás. Mezők: title/slug/description/cover/category/tags/file-or-link/version/date/visibility/SEO/related content. Canonical CMS/Page, responsive/SEO/error/publish acceptance és entitlement-védelem.

### 21.2. Sanci Button és action registry
Stabil ID, name/description/icon/action type/target/permission/visibility/order/status; route, validated external URL, anchor, dialog, form submit, safe toggle, domain action. Arbitrary JavaScript tilos. Icon/text modes, accessible label, hover/focus/active/disabled/loading, keyboard/reduced-motion, search/category/order/duplicate/preview/delete-impact, global style preview/rollback, explicit local override, open-redirect/external-link policy.

### 21.3. Forms
Text/email/URL/textarea/select/checkbox/radio/date-time/file fields; help/required/default/validation/min-max/options/consent/conditional fields. Server validation, rate/request-size limits, spam protection, approved backend actions only, consent version/time/source, unsubscribe/withdrawal/retention, PII minimization, access/export/delete/audit, idempotent submit, truthful success; upload file policy and R2 lifecycle.

### 21.4. Search, SEO/AEO
Search only published/allowed pages/resources/content/products; normalized query, pagination, relevance, no-results, canonical URLs, publish invalidation, no private/draft leakage. Sitemap/robots, redirects, broken links, valid structured data, OG/social preview/image validation; warnings separate from blocking errors.

### 21.5. Domain lifecycle
Add/verify domain, DNS instructions/status/errors, primary/alias/redirect, HTTPS/TLS, detach/restore, truthful pending state, canonical URL/redirect/sitemap/social/cache checks, destructive confirmation/audit; verify platform capability/cost first.

### 21.6. Game Profiles
Canonical game ID/name/platform/artwork/description/genre/category/official URL/tags/notes and related content/schedule; CRUD/archive/search/usage references; schedule/content/pages share one ID; provider/license policy for imports; Resource Registry artwork; archive rather than break used references.

### 21.7. Link Hub
Canonical title/destination/icon/description/visibility/order/active window/campaign/locale/status; internal/external/schedule/content/product/support/Discord/newsletter/event links; validation/health/expiry/UTM, privacy-safe click analytics, safe QR/short-link contract, mobile/accessibility/brand acceptance.

### 21.8. Audience és Founding Supporters
Email consent/source/time/version/language/status/suppression/unsubscribe, export/delete/retention; no marketing after unsubscribe without new consent. Newsletter/transactional/automation mail have separate policies; provider bounce/complaint/retry/idempotency. Public supporter names require explicit revocable opt-in.

### 21.9. Stream diagnostics
Opt-in live/offline, connection/audio/mic, silence/speech, chat and OBS scene/recording diagnostics only when source/permission exist. Show source/freshness/confidence; don't state unverified causes as facts. Post-stream summary, VOD chapters, highlight/clip candidates and scripts are editable suggestions; publication needs approval; privacy/retention/consent/provider policy apply.

### 21.10. AI orchestrator
Intent → plan → context → structured actions → permission/schema validation → diff/preview → approval → canonical API/command → verify → audit/version. Model/provider registry, prompt version, task queue, cost/quota, timeout/retry, approval queue and AI Control Center. Specialist roles share permission pipeline; no unauthorized commit/deploy/secret change.

### 21.11. Interactions/motion
Validated click/hover/focus/active/submit/scroll/load/timer/open-close/navigation/show-hide/toggle; duration/easing/delay/trigger/reduced-motion/performance controls. Timeline/keyframes/scroll-driven animation are later scoped. Preview cannot mutate canonical data; keyboard/touch alternatives or explicit decorative status required.

### 21.12. Export/import/portability
Versioned manifest/schema/checksum/assets; no secret/token export; providers reconnect after restore. Dry-run validates missing assets, duplicate IDs, schema/owner/permission/reference/migration. No half-published partial failure. Restore verifies Page Model/revisions/themes/navigation/media/public render; export/restore drills mandatory.

---

## 22. Benchmark alapvonal és forrásnapló

Research: visual builder/responsive/CMS/publishing; provider health/integration UX; creator link hub; merch/digital products/membership/support; audience ownership; content feeds; analytics/campaign tracking; accessibility/performance; AI structured proposals/approval.

Kezdőpontok: https://www.framer.com/solutions/website-builder/ ; https://webflow.com/platform ; https://www.wix.com/ ; https://help.twitch.tv/s/article/creator-dashboard?language=en_US ; https://fourthwall.com/features ; https://beacons.ai/ ; https://ko-fi.com/features ; https://www.patreon.com/product/digital-products ; https://www.w3.org/WAI/ ; https://web.dev/vitals/ ; https://owasp.org/www-project-top-ten/.

Provider API, ár, scope, licenc és policy aktuális állapotát implementáció előtt újra ellenőrizni kell.

---

---

## 23. A platform készültségének termékdefiníciója

A platform nem attól teljes, hogy az Adminban sok menüpont látszik. Egy modul akkor használható, ha a creator a saját célját végig tudja vinni, a rendszer a valós adatokat és jogosultságokat kezeli, az állapotok érthetők, a hibákból helyre lehet állni, és a publikus/kapcsolódó felületek ugyanazt a kanonikus adatot használják.

A teljes terméknek ki kell terjednie a weboldalra és Visual Editorra, integrációkra, stream- és tartalomkezelésre, közösségre, bevételre, analitikára, kampányokra, automatizációra, OBS-re, SANCI AI-ra, adatvédelemre, biztonságra, helyreállításra, lokalizációra, csapatokra és későbbi bővíthetőségre. A teljes funkciókatalógus a végső cél része, de a készültséget minden modulnál külön kell igazolni.

---

## 24. Teljes funkcióazonosító-jegyzék

**Szerepe:** stabil, egyedi funkcióazonosítók és munkapontok nyilvántartása; ez a fejezet nem külön navigáció és nem második termékkatalógus. A modulhelyet a 49. fejezet, a domain/adatgazdát az 5. fejezet, a funkció részletes szerződését a 10. és 26. fejezet határozza meg. A státusz minden ID-nál külön vezetendő; az, hogy egy képesség szerepel a tervben, nem jelenti a megvalósítását. Az egyes ID-k csak a 10. fejezet szerinti feature contracttal és saját acceptance-szel zárhatók le.

### 24.1. Dashboard és Admin shell — ADM
- ADM-001: Admin shell és globális navigáció.
- ADM-002: Dashboard állapotkártyák.
- ADM-003: Gyorsműveletek és canonical route-ok.
- ADM-004: Dashboard teendő-/hibaösszesítő és navigáció a forrásmodulhoz; nem saját workflow- vagy notification-adatgazda.
- ADM-005: Legutóbbi aktivitás és audit összefoglaló olvasási nézete; a canonical audit események tulajdonosa az AUDIT domain.
- ADM-006: Admin shell belépési pont a globális keresőhöz és command palette-hez; a keresési index és találat a SEARCH domain tulajdona.
- ADM-007: Profil/session/logout UI-belépési pont; identitás, session és authorization a canonical IDENTITY/SEC szerződés alatt.
- ADM-008: Shared Admin UI components for loading/empty/error/stale/success states; does not own domain-specific data-binding state machines.
- ADM-009: Permission-alapú menü-/action-visibility UX; nem helyettesíti a szerveroldali authorizationt.
- ADM-010: Mobil/tablet Admin shell.
- ADM-011: Kontextuális súgó/onboarding belépési pont; a cikkek és onboarding progress a HELP_CENTER domain tulajdona.
- ADM-012: Dashboard értesítési összesítő és Notification Center belépési pont; delivery/preference lifecycle az NTF domain tulajdona.
- ADM-013: Dashboard- és Admin-adatok frissessége, stale/partial jelzés és adatforrás-státusz.

### 24.2. Weboldal és publikus renderer — WEB
- WEB-001: Page CRUD és listanézet.
- WEB-002: Slug, hierarchy és URL lifecycle.
- WEB-003: Page duplicate/archive/delete és usage warning.
- WEB-004: Draft/published state és published snapshot.
- WEB-005: Preview link és preview authorization.
- WEB-006: Publish validation és publish report.
- WEB-007: Page publish/unpublish/restore/rollback operations and state transitions; QA-007 is the separate test gate.
- WEB-008: Revision history és diff.
- WEB-009: Canonical navigation tree.
- WEB-010: Header/footer és global layout.
- WEB-011: Mobile navigation és keyboard behavior.
- WEB-012: Public route registry és 404.
- WEB-013: Redirect manager és broken-link report.
- WEB-014: Public Home/Creator-home.
- WEB-015: Public Live/Stream page.
- WEB-016: Public schedule route/page shell; consumes the canonical schedule projection owned by SCH-010.
- WEB-017: Public VOD/Content Hub route and page shell; consumes the published content projection owned by CNT-020.
- WEB-018: Public About/Creator profile.
- WEB-019: Public Community page/CTA.
- WEB-020: Public Contact page/form.
- WEB-021: Public Creator Resources page.
- WEB-022: Public Link Hub.
- WEB-023: Public Support page.
- WEB-024: Public Sponsor/Press Kit.
- WEB-025: Public Store/Product pages.
- WEB-026: Public Membership/Member area.
- WEB-027: Public Events/Blog/News/Digital Products routes.
- WEB-028: Public error/maintenance/offline states.
- WEB-029: Public search index and query.
- WEB-030: Public cache/invalidation.
- WEB-031: Published-only data visibility enforcement.
- WEB-032: Public content rendering security and safe embeds.

### 24.3. Visual Editor — EDT
- EDT-001: Canonical Page Model schema/version.
- EDT-002: Node IDs and parent/child invariants.
- EDT-003: Command mutation pipeline.
- EDT-004: Transaction/batch/rollback semantics.
- EDT-005: Undo/redo history integrity.
- EDT-006: Selection state synchronization.
- EDT-007: Canvas viewport, zoom, pan and fit.
- EDT-008: Canvas drag/drop.
- EDT-009: Canvas resize/geometry constraints.
- EDT-010: Alignment guides/snap/grid.
- EDT-011: Reorder/reparent/duplicate/delete.
- EDT-012: Layers tree expand/collapse.
- EDT-013: Layers/canvas/Inspector selection sync.
- EDT-014: Layer rename/hide/lock and hierarchy.
- EDT-015: Element/Block Library and search.
- EDT-016: Section/Container/Stack/Row/Columns/Grid.
- EDT-017: Text/Heading/Link/Button/Icon/Divider/Spacer.
- EDT-018: Image/Video/Embed/List/Card/Badge.
- EDT-019: Table/Accordion/Tabs/Form capability.
- EDT-020: Dynamic Sanci block configuration.
- EDT-021: Inspector Property Registry.
- EDT-022: Inspector schema validation and control types.
- EDT-023: Inspector resolved viewport value.
- EDT-024: Responsive override/inheritance/reset.
- EDT-025: Responsive desktop/tablet/mobile preview.
- EDT-026: Responsive visibility/order/column changes.
- EDT-027: Dirty state and explicit Save Draft.
- EDT-028: Save/reload round-trip.
- EDT-029: Revision conflict recovery.
- EDT-030: In-flight edit preservation during save.
- EDT-031: Network failure/retry/local recovery.
- EDT-032: Preview without publishing.
- EDT-033: Explicit publish separate from save.
- EDT-034: Public renderer parity with Editor preview.
- EDT-035: Mobile Editor action bar/safe area.
- EDT-036: Mobile Layers/Inspector panel switching.
- EDT-037: Keyboard-accessible canvas alternatives.
- EDT-038: Copy/paste and multi-select where enabled.
- EDT-039: Page-level interaction/action schema registry for Editor-configured page behavior; not the automation engine action catalog.
- EDT-040: Motion/reduced-motion behavior.
- EDT-041: Empty-project onboarding and template start.
- EDT-042: Editor error recovery and no-data-loss guard.
- EDT-043: Advanced Rich Text editor and structured inline/block content; planned after the 1.0 plain-text baseline, gated by schema, safe renderer, accessibility and round-trip tests.
- EDT-044: Per-user Editor workspace preferences (viewport, panel layout, grid and favorites) stored outside the site Page Model.

### 24.4. Design system, templates and components — DSN
- DSN-001: Global design token schema.
- DSN-002: Token editor and live preview.
- DSN-003: Token usage/dependency map.
- DSN-004: Global change diff and rollback.
- DSN-005: Theme and brand presets.
- DSN-006: Responsive defaults and breakpoint tokens.
- DSN-007: Typography/font registry.
- DSN-008: Site template library.
- DSN-009: Page template library.
- DSN-010: Section template library.
- DSN-011: Component template library.
- DSN-012: Reusable component/symbol master-instance.
- DSN-013: Variants, slots and explicit overrides.
- DSN-014: Design/template/component versioning, compatibility and migration; excludes AI prompt/template versioning.
- DSN-015: Template import/export.
- DSN-016: Button Registry and global button styles.
- DSN-017: Icon/action registry linkage.
- DSN-018: Future community/marketplace templates.

### 24.5. Resource/media/icons/fonts — RES
- RES-001: Canonical asset registry and IDs.
- RES-002: R2 binary storage and D1 metadata.
- RES-003: Upload validation/progress/cancel/retry.
- RES-004: Image preview/thumbnail/variant, crop/resize and optimization pipeline.
- RES-005: Search/filter/sort/pagination over the canonical asset registry only.
- RES-006: Asset-library collections/tags/folders; excludes content and product taxonomies.
- RES-007: Alt text/caption/license/source metadata.
- RES-008: Asset usage/reference map.
- RES-009: Replace/archive/delete/restore safety.
- RES-010: Editor asset picker.
- RES-011: Icon registry/search/category/preview.
- RES-012: SVG safety and sanitization.
- RES-013: Font registry/weight/style/fallback.
- RES-014: File download authorization/expiry.
- RES-015: Media diagnostics and broken asset scan.
- RES-016: Paid/private asset access integration.

### 24.6. Connections/integrations — INT
- INT-001: Shared external-provider adapter contract; domain modules such as Store implement their specific workflows through this contract.
- INT-002: Integration overview and health.
- INT-003: OAuth state/callback/CSRF protection.
- INT-004: Token lifecycle/refresh/revoke.
- INT-005: Site ownership and connection binding.
- INT-006: Scope/permission visibility.
- INT-007: Connect/reconnect/disconnect flow.
- INT-008: Sync history, retry and provider errors.
- INT-009: Rate-limit/quota handling.
- INT-010: Twitch OAuth and channel binding.
- INT-011: Twitch live/schedule data.
- INT-012: Twitch VOD/clip metadata where allowed.
- INT-013: YouTube channel/video/live adapter.
- INT-014: TikTok capability-gated adapter.
- INT-015: Discord bot/guild/channel/role integration.
- INT-016: Kick capability-gated adapter.
- INT-017: Provider webhook subscription/delivery lifecycle and integration of signature/replay defenses; shared security requirements are defined by SEC-009.
- INT-018: External integration/provider capability registry for social, streaming and commerce adapters; excludes AI model/provider configuration.
- INT-019: Integration secret redaction and audit.
- INT-020: Integration diagnostics and recovery.
- INT-021: Future payment/email/commerce adapters.

### 24.7. Live state and Stream Studio — LIV / OBS
#### 24.7.1. Live domain — LIV
- LIV-001: Normalized live/offline state.
- LIV-002: Live data freshness/stale indicator.
- LIV-003: Stream title/category/game/start time.
- LIV-004: Viewer/follower/subscriber metrics where permitted.
- LIV-005: Player/embed and offline fallback.
- LIV-006: Stream event normalization.
- LIV-007: Stream status in Dashboard and public blocks.
- LIV-008: Capability-gated multistream destinations and per-provider metadata.
- LIV-009: Unified Chat read/send permissions, provider labels, moderation state and partial-failure handling.
- LIV-010: Recording/replay/backup status and retention/cost policy, only where technically supported.
#### 24.7.2. OBS, overlays and stream tools — OBS
- OBS-001: Overlay asset and scene metadata.
- OBS-002: OBS secure pairing/connection.
- OBS-003: Scene/stream/recording state where supported.
- OBS-004: Authorized commands and stream markers.
- OBS-005: Browser source configuration.
- OBS-006: Alerts for provider-supported events.
- OBS-007: Chatbot/commands/timers/loyalty/giveaways.
- OBS-008: Test mode, event replay and rate limit.
- OBS-009: Macro Deck or external control adapter.
- OBS-010: Overlay preview/export/version.

### 24.8. Schedule/game profiles — SCH
- SCH-001: Schedule item CRUD.
- SCH-002: Calendar/list/upcoming/past views with site-scoped search/filter/sort/pagination.
- SCH-003: Timezone and daylight-saving correctness.
- SCH-004: Recurrence and series edit scopes.
- SCH-005: Postponed/cancelled/completed/live states.
- SCH-006: Schedule conflict detection.
- SCH-007: Twitch schedule sync/manual override.
- SCH-008: Sync status/retry/audit.
- SCH-009: Next stream/countdown.
- SCH-010: Canonical public schedule data projection/rendering contract consumed by WEB-016 and Editor schedule blocks.
- SCH-011: Editor block binding/configuration for the canonical schedule projection; schedule data and lifecycle remain owned by SCH-001–010.
- SCH-012: Game Profile CRUD.
- SCH-013: Game artwork/resource linkage.
- SCH-014: Game/content/schedule relationship.
- SCH-015: iCal/export and later notifications.

### 24.9. Content/Content Studio — CNT
- CNT-001: Canonical content item schema.
- CNT-002: VOD import and metadata.
- CNT-003: Clip/highlight/Short management.
- CNT-004: YouTube/TikTok video feed.
- CNT-005: Content-library tags/categories/collections/playlists; excludes product-catalog taxonomy and asset-library folders.
- CNT-006: Search/filter/sort/pagination/bulk actions over canonical content records only.
- CNT-007: Duplicate detection and external IDs.
- CNT-008: Featured/related content.
- CNT-009: Content calendar.
- CNT-010: Ideas/drafts/scripts/briefs.
- CNT-011: Platform-specific title/description/tag variants.
- CNT-012: Thumbnail and media asset workflow.
- CNT-013: Publishing queue and schedule.
- CNT-014: Publish status/retry/partial success.
- CNT-015: Approval workflow and public publish gate.
- CNT-016: Campaign linkage and content attribution.
- CNT-017: Short-form export preparation.
- CNT-018: Content-domain transcript/chapter/highlight artifact metadata and review lifecycle; AI suggestions originate in AI-014 and are stored through the content API.
- CNT-019: Editor block binding/configuration for the canonical content feed; content records and publishing lifecycle remain owned by CNT-001–018/020–022.
- CNT-020: Canonical published-content public feed/projection and query contract; WEB-017 owns the public page route/shell.
- CNT-021: Timeline-based content editing/render pipeline: trim/split/crop/reframe, aspect ratio, audio, captions, transitions, brand overlay and export.
- CNT-022: Content rights/consent/expiry/takedown lifecycle for music, video, guests and third-party assets.

### 24.10. Community/audience — COM
- COM-001: External community links.
- COM-002: Discord community entry point.
- COM-003: Community posts.
- COM-004: Polls and voting.
- COM-005: Events and RSVP.
- COM-006: Member profiles and follows later.
- COM-007: Comments/reactions later.
- COM-008: Clip submission.
- COM-009: Moderation/report/ban/role.
- COM-010: Badges/reputation/challenges later.
- COM-011: Notifications and delivery status.
- COM-012: Abuse/spam/rate-limit controls.
- COM-013: Community/public-surface member-only visibility gate; consumes entitlement decisions owned by SUP-006.
- COM-014: Founding Supporters opt-in listing.
- COM-015: Email signup/consent/subscriber list.
- COM-016: Segmentation/newsletter/automation.
- COM-017: Unsubscribe/suppression/export/delete.
- COM-018: Public/member/private visibility policy.
- COM-019: Fan account identity, profile/preferences and account export/delete lifecycle.
- COM-020: Community rules, age/content policy and enforcement lifecycle.

### 24.11. Store/commerce — STO
- STO-001: Product catalog.
- STO-002: Product variants/SKU/price/currency.
- STO-003: Product-catalog categories/collections/tags; excludes content-library and asset-library taxonomies.
- STO-004: Product media and SEO.
- STO-005: Physical/digital/bundle/preorder/limited drop.
- STO-006: Inventory/fulfillment abstraction.
- STO-007: Storefront listing/detail/search/filter.
- STO-008: Store-specific cart/checkout provider adapter; owns checkout workflow integration, while generic provider lifecycle is defined by INT-001.
- STO-009: Order lifecycle/payment status.
- STO-010: Fulfillment/tracking/cancellation/refund.
- STO-011: Coupons/promotions/gift cards.
- STO-012: Digital purchase entitlement.
- STO-013: Secure download/access delivery.
- STO-014: Tax/shipping/VAT/invoice integration review.
- STO-015: Customer account/history where needed.
- STO-016: Abandoned cart later.
- STO-017: Product/collection Editor blocks.
- STO-018: Provider webhook idempotency and audit.
- STO-019: Merchant-of-record/provider decision.
- STO-020: Store analytics.
- STO-021: Payment/tax/VAT/invoicing/consumer-rights compliance decision and provider integration gate.

### 24.12. Support/membership — SUP
- SUP-001: Support/tip links and provider.
- SUP-002: Donation/tip state where available.
- SUP-003: Supporter goals and progress.
- SUP-004: Membership tiers and billing period.
- SUP-005: Membership perk/entitlement definition; community and public surfaces enforce access through COM-013/COM-018.
- SUP-006: Entitlement lifecycle.
- SUP-007: Membership renewal/cancel/failed payment.
- SUP-008: Refund/chargeback entitlement handling.
- SUP-009: Discord role sync from entitlement.
- SUP-010: Supporter history and opt-in public listing.
- SUP-011: Membership entitlement rules for content/events; COM and WEB surfaces consume these rules without duplicating entitlement state.
- SUP-012: Member discount/exclusive drop.

### 24.13. Analytics and business campaigns
#### 24.13.1. Analytics — ANL
- ANL-001: Analytics event taxonomy/naming/schema governance for measurement and reporting; excludes workflow trigger execution.
- ANL-002: Privacy-safe web analytics.
- ANL-003: Stream analytics.
- ANL-004: Content/platform analytics.
- ANL-005: Commerce analytics.
- ANL-006: Community analytics.
- ANL-007: Date range/comparison/filter/export.
- ANL-008: Freshness/source/unit/missing-data state.
- ANL-009: Consent/retention/bot filtering.
- ANL-010: Anomaly detection, thresholds and explainable alerts.
#### 24.13.2. Campaign and sponsorship business — CAM
- CAM-001: Campaign CRUD/status/goals.
- CAM-002: Campaign links/UTM/attribution.
- CAM-003: Campaign asset/content/product relationships.
- CAM-004: Media kit generation/export.
- CAM-005: Brand lead/deal/rate card.
- CAM-006: Deliverables/deadlines/reminders.
- CAM-007: Sponsor campaign analytics.
- CAM-008: Private business documents and permission.
- CAM-009: Invoice/payment status only after business/legal review.

### 24.14. Automation — AUT
- AUT-001: Automation trigger-event catalog and event-to-workflow routing contract; consumes domain events and does not define analytics measurement taxonomy.
- AUT-002: Trigger catalogue.
- AUT-003: Condition/filter rules.
- AUT-004: Automation action catalog and server-side permission checks for workflow execution; page interaction schemas remain in EDT-039.
- AUT-005: Delay/schedule and timezone.
- AUT-006: Idempotency/deduplication.
- AUT-007: Retry/backoff/dead-letter.
- AUT-008: Automation execution/run history and workflow-specific diagnostics; security/privacy audit events are owned by SEC-010.
- AUT-009: Dry-run/preview/approval.
- AUT-010: Enable/pause/version/clone.
- AUT-011: Cycle detection and rate limits.
- AUT-012: Provider outage and recovery.
- AUT-013: Automation templates.
- AUT-014: Safe cross-domain actions.

### 24.15. SANCI AI — AI
- AI-001: AI model/provider registry, model capabilities and lifecycle; excludes external social/streaming integration capabilities in INT-018.
- AI-002: AI prompt/instruction template versioning and evaluation; excludes visual design and page-template lifecycle in DSN-014.
- AI-003: Intent and task planner.
- AI-004: Context selection and privacy filter.
- AI-005: Structured action schema.
- AI-006: Permission/ownership checker.
- AI-007: Diff/preview/approval workflow.
- AI-008: Execute through canonical API/commands.
- AI-009: Verification/audit/version/rollback.
- AI-010: Cost/quota/usage/error tracking.
- AI-011: Website structure/content assistant.
- AI-012: SEO/accessibility/localization suggestions.
- AI-013: Content title/script/description/thumbnail brief.
- AI-014: AI-generated transcript/chapter/highlight/clip candidates with source timestamps and confidence; does not own canonical content records or rights metadata.
- AI-015: Stream diagnostics/summary where supported.
- AI-016: Specialist agent roles under shared permissions.
- AI-017: AI Control Center and approval queue.
- AI-018: Prompt injection and untrusted content tests.
- AI-019: Human approval for public/destructive/financial action.
- AI-020: AI-free fallback for all critical manual workflows.
- AI-021: Multimodal image/audio/video generation provider adapters, rights/safety checks, cost controls and human review.

### 24.16. Security and operations — SEC / OPS
#### 24.16.1. Security and authorization — SEC
- SEC-001: Authentication/session lifecycle.
- SEC-002: Server-side RBAC and ownership.
- SEC-003: Cross-domain server-side site/workspace/tenant isolation invariant; TEAM-001/TEAM-005 provide workspace selection and multi-site workflows but do not replace authorization.
- SEC-004: OAuth/CSRF/session security.
- SEC-005: XSS/sanitization/safe embeds.
- SEC-006: SSRF/open redirect/injection defenses.
- SEC-007: Rate limiting and abuse protection.
- SEC-008: Secret storage/redaction/rotation.
- SEC-009: Cross-domain webhook signature/replay security requirement and negative-test contract; provider-specific implementation is owned by INT-017.
- SEC-010: Cross-domain security/privacy audit events and redaction/retention controls; workflow execution detail remains in AUT-008.
- SEC-011: Consent/retention/export/delete.
- SEC-012: MFA/2FA and future SSO lifecycle, recovery and suspicious-authentication controls.
#### 24.16.2. Operations and reliability — OPS
- OPS-001: Health/deploy version.
- OPS-002: Structured logs/correlation IDs.
- OPS-003: Error tracking/alerting.
- OPS-004: Migration preflight/integrity.
- OPS-005: Operational backup/export/restore capability and runbook; QA-007 only verifies it through tests/evidence.
- OPS-006: Recovery drill and runbook.
- OPS-007: Diagnostics report.
- OPS-008: Performance baseline/cache/query monitoring.
- OPS-009: Rollback and incident procedure.
- OPS-010: Dependency/license/CVE review.
- OPS-011: Background-job/realtime runtime selection and lifecycle, only where justified.

### 24.17. Kiegészítő modulok és minőség — LOC / TEAM / MKT / QA
#### 24.17.1. Localization — LOC
- LOC-001: Translation key/fallback.
- LOC-002: Locale-aware dates/numbers/currency/timezone.
- LOC-003: Page/content/navigation translation.
- LOC-004: Localized SEO/hreflang/canonical.
- LOC-005: Translation completeness status, locale preview and safe publish policy.
- LOC-006: AI-assisted translation workflow with explicit human review/approval and audit.
#### 24.17.2. Team and workspace — TEAM
- TEAM-001: Workspace/site switcher UI and active-scope selection; server-side isolation and authorization remain owned by SEC-002–003.
- TEAM-002: Invite/accept/revoke.
- TEAM-003: Roles and granular permissions.
- TEAM-004: Approval/review/activity feed.
- TEAM-005: Multi-site workspace/product workflows; isolation enforcement is a security invariant owned by SEC-003.
- TEAM-006: SaaS billing/plan entitlements/quota.
- TEAM-007: Agency/studio client workspaces, shared templates, client-scoped brand and approval workflow.
#### 24.17.3. Extensions and marketplace — MKT
- MKT-001: Extension manifest/permissions.
- MKT-002: Extension install/update/uninstall/migration.
- MKT-003: Theme/block/template/overlay marketplace.
- MKT-004: License/attribution/version/review.
- MKT-005: Marketplace payment/revenue-share after legal review.
#### 24.17.4. Quality and acceptance — QA
- QA-001: Typecheck/build/CI gates.
- QA-002: Domain/API/integration tests.
- QA-003: Ownership/security negative tests.
- QA-004: Browser/device responsive and visual-regression acceptance.
- QA-005: Public SEO/accessibility/performance audit.
- QA-006: Production smoke and runtime verification.
- QA-007: Test/acceptance gate and evidence for backup/restore/rollback; does not implement backup operations.
- QA-008: End-to-end creator journey.
- QA-009: User acceptance and evidence log.
- QA-010: Continuous benchmark and feature-discovery review.

---


### 24.18. Site settings, dinamikus adatbinding és SEO — SET / DYN / SEO

Ezek a stabil ID-k azért szükségesek, mert a korábbi követelménykatalógus külön site settings, data source, binding-state és SEO-meta képességeket tartalmaz, amelyeket a korábbi WEB/EDT/INT ID-k nem fedtek le kellő pontossággal. Az ID-k a követelmény-nyilvántartás célpontjai; a létük nem jelent implementációs státuszt.

#### 24.18.1. Site settings — SET
- SET-001: Canonical site settings schema és CRUD lifecycle.
- SET-002: Site ownership/scope és multi-site kompatibilitás.
- SET-003: Public-safe settings projection és secret/private mezők kizárása.
- SET-004: Custom domain lifecycle, verification, DNS/SSL status, primary-domain transition and canonical URL.

#### 24.18.2. Dinamikus adatforrás és binding — DYN
- DYN-001: Canonical data source registry és provider/domain adapter.
- DYN-002: Binding schema, type validation és resource/field compatibility.
- DYN-003: Whitelisted filter/sort/transform/limit/pagination for bound data queries; not a replacement for module-specific library search.
- DYN-004: Feltételes rendering és adatfüggő visibility.
- DYN-005: Runtime state machine for dynamic data bindings (loading/empty/error/partial/stale); shared visual presentation may use ADM-008.
- DYN-006: Cache policy, freshness, invalidation és stale fallback.
- DYN-007: Permission, site scope és published-only data boundary.
- DYN-008: Binding diagnostics, preview, invalid-reference report és recovery.

#### 24.18.3. SEO és social metadata — SEO
- SEO-001: Per-page title, description, canonical URL és robots policy.
- SEO-002: Open Graph, X/Twitter card és social preview/image validation.
- SEO-003: Validált structured data/schema.org, ahol releváns.
- SEO-004: Sitemap és robots.txt lifecycle, publish/cache invalidation.
- SEO-005: SEO preview/diagnostics, duplicate/missing metadata és page-level audit.

**Függőségi szabály:** SET/DYN/SEO csak a canonical Page Model, Resource, domain ownership és publish contracton keresztül működhet. Ezek nem adhatnak alternatív persistence vagy publikálási útvonalat. A korábbi ID-k megmaradnak; a crosswalk az eredeti követelményt a legpontosabb új vagy meglévő ID-hoz rendeli.

### 24.19. Developer platform és API — DEV

A Developer Platform az API-felhasználás, kulcsok, sandbox és creator által definiált outbound webhookok gazdája. A külső provider inbound webhook és OAuth integráció továbbra is az INT modulban marad.

- DEV-001: Public API reference, versioning, schema and deprecation policy.
- DEV-002: API key creation, scoped permissions, one-time display, rotation, expiry and revocation.
- DEV-003: Webhook registry/tester, delivery log, signature validation and replay/retry diagnostics.
- DEV-004: Sandbox workspace and safe test fixtures/events.
- DEV-005: SDK/client libraries, integration examples and version compatibility.
- DEV-006: Developer quotas, rate-limit visibility and API usage diagnostics.

### 24.20. Globális keresés — SEARCH
- SEARCH-001: Permission-aware global search over canonical domain projections.
- SEARCH-002: Command palette and quick-action routing to canonical module commands.
- SEARCH-003: Saved views, favorites, recent items and per-user list preferences.
- SEARCH-004: Index freshness, permission/site invalidation and deletion propagation.
- SEARCH-005: Module-scoped search filters and safe result snippets.

### 24.21. Értesítési központ — NTF
- NTF-001: In-app notification center, read/unread and source-module navigation.
- NTF-002: Delivery channel adapters and truthful sent/delivered/failed states.
- NTF-003: User preferences, digest, quiet hours and channel opt-in/out.
- NTF-004: Idempotent event-to-notification mapping, deduplication and bounded retry.
- NTF-005: Unsubscribe, retention and privacy-safe notification payload.

### 24.22. Súgó és onboarding — HELP
- HELP-001: Contextual help mapping to module/field and current feature limitations.
- HELP-002: Interactive onboarding progress, skip/restart and role/site-scoped steps.
- HELP-003: Searchable glossary, versioned documentation and canonical feature references.
- HELP-004: Troubleshooting/feedback flow with diagnostic IDs and automatic sensitive-data redaction.

---

## 25. Kötelező státuszmezők a funkciójegyzékben

Minden ID-hoz az alábbi mezők tartoznak a terv karbantartásakor:
- Status;
- Phase/priority;
- Menu/surface;
- Canonical domain owner;
- Data source;
- Permission;
- Dependencies;
- Implementation point;
- Tests;
- Negative tests;
- Live/user acceptance;
- Evidence;
- Known issues;
- Next action.

A státuszt nem szabad pusztán a kód jelenléte alapján átállítani. Ha egy funkció több részre bontható, az al-ID-k saját DoD-t kapnak, és a szülő csak akkor PASS, ha minden kötelező al-ID PASS vagy az elhagyás explicit, indokolt és dokumentált scope döntés.

---

## 26. Funkciószintű végrehajtási szerződés

Ez a fejezet a menü- és funkciójegyzéket végrehajtható specifikációvá teszi. A katalógusban felsorolt minden stabil ID csak akkor aktiválható implementációra, ha az alábbi szerződés minden mezője kitöltött. A hiányzó adat nem feltételezhető: az implementáció előtt a repositoryból kell feltárni, vagy nyitott döntésként kell megjelölni.

### 26.1. Kötelező funkciókártya

Minden funkcióhoz egy önálló kártya tartozik:
1. **ID és név:** stabil, egyedi ID; megjelenített magyar név; esetleges belső technikai név.
2. **Felhasználói eredmény:** mit tud a felhasználó elvégezni, és miért.
3. **Belépési pont:** Admin menü/almenü, public route, Editor panel vagy rendszerfolyamat.
4. **Műveletek:** listázás, részletezés, létrehozás, módosítás, archiválás/törlés, keresés, szűrés, export, visszaállítás; csak az értelmes műveletek.
5. **Domain owner:** egyetlen szerveroldali üzleti domain, amely az adatot és a szabályokat birtokolja.
6. **Kanonikus adatforrás:** D1 táblák/repository/API vagy R2 object reference; a tényleges implementációs vizsgálat után pontosítandó.
7. **Séma és invariánsok:** kötelező mezők, validáció, egyediség, kapcsolatok, lifecycle, törlési/archiválási szabály.
8. **Jogosultság:** anonim, tulajdonos, szerkesztő, moderátor, pénzügyi/admin szerep vagy rendszer; szerveroldali ellenőrzés és site ownership.
9. **API/command szerződés:** request/response schema, hibakódok, idempotency, concurrency/revision policy, audit esemény.
10. **Függőségek:** előfeltétel-ID-k; blokkoló és nem blokkoló függőség külön.
11. **UI-állapotok:** loading, empty, partial, stale, validation, saving, success, error, retry, conflict, offline/permission denied.
12. **Biztonsági és adatvédelmi határ:** PII, secret, consent, retention, export/delete, injection, abuse, rate limit.
13. **Tesztcsomag:** unit/domain, API/integration, DB migration/integrity, authorization negative, browser/responsive, production smoke és user acceptance, ahol releváns.
14. **Elfogadási forgatókönyv:** kiinduló állapot → művelet → elvárt adatváltozás → reload/re-entry → minden megjelenítési hely ellenőrzése → hibaút.
15. **Bizonyíték:** commit, CI run, teszteredmény, runtime URL/ellenőrzés és felhasználói visszaigazolás; titkot nem tartalmazhat.
16. **Visszaállítás:** rollback, revision restore, kompenzáló művelet vagy egyértelműen indokolt irreverzibilis állapot.
17. **Státusz és következő lépés:** a 11. fejezet státuszaiból; egy aktív subpoint és explicit next point.

### 26.2. CRUD nem elég — életciklus és állapotátmenetek

A domainenkénti funkciók nem kezelhetők pusztán CRUD-ként. A funkciókártya sorolja fel a megengedett állapotátmeneteket, például:
- Page: draft → previewed → published; published → draft/unpublished; revision → restored draft.
- Connection: disconnected → authorization pending → connected → degraded/expired → reconnecting → connected; revoke/disconnect.
- Scheduled content: draft → scheduled → publishing → published/failed/cancelled; retry idempotensen.
- Product/order: draft → active/archived; order state csak a payment/order provider igazolt eseményéből változhat.
- Membership/entitlement: pending → active → past due/cancelled/expired/revoked, provider webhook és helyi policy alapján.
- Automation: draft → validated → enabled → paused/failed; minden run külön futási rekordot kap.
- AI action: proposed → schema validated → approval pending → approved → executing → verified/failed/rolled back.
- Asset: upload pending → validated/scanned → ready → referenced/archived/deleted; publikus URL csak kész, engedélyezett assetre mutathat.

Érvénytelen állapotátmenetnél a szerver utasítsa el a műveletet, és az UI ne mutasson sikeres állapotot.

### 26.3. Domainenkénti műveleti szerződések

Az alábbi szerződések a funkciójegyzék logikai modulhatárait követik. A közös infrastruktúra (auth, site scope, validation, logging, retry, test harness) újrahasználható; ettől az üzleti adatgazdák nem olvadnak össze.

#### ADM — Dashboard és Admin shell
- Művelet: valós domainállapotok összesítése, gyorslinkek, teendők, friss aktivitás és modulonkénti notification summary.
- Adatforrás: saját domain read API-k vagy permission-aware read model; nem külön, kézzel szerkeszthető másolat.
- Jogosultság/teszt: site scope, unauthorized, stale sync, hiányzó schedule, részleges API-hiba, mobil viewport.
- PASS feltétel: minden kártya forrása és frissessége megállapítható; hibás alrendszer nem zöld; gyorsművelet a kanonikus modulhoz visz.

#### WEB — Oldalak, navigáció és publikus renderer
- Művelet: page CRUD, slug/hierarchy, navigation, preview, publish/unpublish, revision restore és publikus route lifecycle.
- Adatforrás: canonical Page Model, navigation model, draft revision, published snapshot; dinamikus üzleti rekord nem másolható a Page Modelbe.
- Jogosultság/teszt: server-side site ownership, published-only public read, draft preview auth, invalid slug, deleted reference, cross-site ID.
- PASS feltétel: draft mentés nem publikál; publish explicit; a public renderer canonical URL/metadata policyt alkalmaz; biztonságos fallback hibás/deleted referenciánál.

#### EDT — Visual Editor
- Művelet: canvas selection/move/resize, layers, Inspector, responsive viewport, undo/redo, clipboard, preview, save/reload és publish handoff.
- Adatforrás: canonical Page Model és command/validation/history/persistence API; Inspector a Property Registry metadata-t használja.
- Jogosultság/teszt: page edit permission, ownership, invalid property, round-trip, revision conflict, viewport inheritance/reset, keyboard/touch és mobil.
- PASS feltétel: minden Editor-felület ugyanazt a page state-et módosítja; nincs elveszett mentés vagy automatikus publish; Editor nem veszi át a média/brand/integráció/commerce domain adatait.

#### DSN — Brand Kit, design system és template
- Művelet: token/theme/font/breakpoint, component definition/variant, template create/preview/apply/version/rollback.
- Adatforrás: canonical Design System/Template/Component registry; page-local override explicit; bináris asset a RESOURCE-ban.
- Teszt: token update több oldalon, instance refresh, override megőrzése, template preview, rollback, invalid token/reference és kontraszt.
- PASS feltétel: globális módosítás minden hivatkozó instance-ra hat; override precedence dokumentált; nincs duplikált token-master.

#### RES — Média-, asset-, ikon- és font-registry
- Művelet: upload/validation/preview/search/filter/tag/metadata/alt text/replace/reference lookup/archive/delete/safe download.
- Adatforrás: D1 asset metadata + R2 object; stable asset ID; object key nem user által tetszőlegesen megadott path.
- Jogosultság/teszt: site ownership, MIME/size rejection, malformed file, duplicate, replace, referenced delete, R2 failure, unauthorized download, SVG/font safety.
- PASS feltétel: metadata és bináris objektum konzisztens; törlés előtt reference check; privát fájl nem érhető el publikus URL-lel; más modul nem tart fenn saját asset-registryt.

#### INT — Külső integrációk és provider adapterek
- Művelet: connect/callback/status/scope/reconnect/revoke/disconnect/sync/retry, provider capability és inbound webhook.
- Adatforrás: canonical connection record/provider adapter; secret store/secret reference; site-scoped ownership.
- Jogosultság/teszt: egyszer használatos, lejáró OAuth state; mismatched site, denied scopes, token refresh, provider outage, disconnect, retry és webhook replay.
- PASS feltétel: kapcsolódás nem az Editorban történik; más modulok ugyanazt a státuszt olvassák; secret nem kerül kliensre vagy logba; nem támogatott provider action nem jelenik meg működőként.

#### LIV — Live state és Stream Studio
- Művelet: normalized live status, provider/channel info, freshness, stream setup, multistream/unified chat csak igazolt capabilityvel, stream marker és checklist.
- Adatforrás: INTEGRATION connection + normalizált live state; cache származtatott, frissességjelölt.
- Teszt: offline/online/stale, missing scope, provider partial failure, send permission denied, multistream capability hiánya.
- PASS feltétel: régi adat nem jelenik meg frissként; Unified Chat olvasás/küldés külön engedélyezett; recording/replay nem ígérhető runtime bizonyíték nélkül.

#### OBS — OBS kapcsolat, overlay és stream tools
- Művelet: secure pairing, scene/source állapot, authorized commands, overlay/widget config, preview/version/rollback, event replay és external-control adapter.
- Adatforrás: STREAM_TOOLS overlay/widget config + INTEGRATION kapcsolat és engedélyezett OBS adapter; nincs böngészőből feltételezett natív hozzáférés.
- Jogosultság/teszt: pairing/reconnect, OBS unavailable, command allowlist, invalid overlay, dry-run, event replay, external adapter timeout.
- PASS feltétel: nincs nyílt vezérlővégpont vagy secret a logban; minden művelet explicit permission/allowlist szerint fut; manuális fallback elérhető.

#### SCH — Adásrend és Game Profile
- Művelet: event CRUD/archive, timezone, recurrence, conflict detection, game selection, public display/countdown/export.
- Adatforrás: canonical schedule domain és stable game profile ID; timezone explicit, UTC tárolás és locale display policy.
- Teszt: DST, timezone change, recurrence edit-one/edit-series, overlap, past event, archived game reference, public cache invalidation.
- PASS feltétel: Admin, Dashboard, Editor block és public schedule ugyanazt az eventet mutatja; Page Model nem másolja az event rekordot.

#### CNT — Tartalom és Content Studio
- Művelet: content item create/edit/organize, metadata/platform variant, calendar, review/publish queue, transcript/clip/edit/export lifecycle.
- Adatforrás: canonical content item + publishing job + external provider IDs; bináris media a RESOURCE-ban, rights/consent a content lifecycle policy szerint.
- Jogosultság/teszt: unsupported capability, expired auth, duplicate publish, retry, media missing, invalid platform length, cancel scheduled publish, rights expiry/takedown.
- PASS feltétel: retry nem dupláz; provider siker/hiba tényszerű; nincs állított publikálás provider confirmation nélkül; content feed ugyanazt a canonical ID-t olvassa.

#### COM — Közösség és moderáció
- Művelet: community posts/polls/events/submissions/comments/reports/moderation/appeal/visibility policy.
- Adatforrás: COMMUNITY domain; fan account identity és membership entitlement külön domain.
- Jogosultság/teszt: consent absent, abuse/rate limit, moderator vs admin, private member data, report/appeal, export/delete és unsafe content.
- PASS feltétel: opt-in bizonyítható; moderation auditált; publikus supporter/fan adat külön hozzájárulás nélkül nem jelenik meg.

#### FAN_IDENTITY — Publikus rajongói fiók
- Művelet: regisztráció/bejelentkezés, profil/preferences, consent, export/delete és account security.
- Adatforrás: fan identity store; creator/Admin identitytől elkülönített lifecycle.
- Jogosultság/teszt: cross-account/site access, session expiry, duplicate signup, account export/delete, consent withdrawal.
- PASS feltétel: nincs Admin-sessionnel való hallgatólagos összevonás, cross-account adatkiolvasás vagy nyom nélküli privacy request.

#### STO — Bolt és kereskedelem
- Művelet: product catalog/variants/price, cart/checkout, order lifecycle, fulfillment/refund, coupon/promotion és digital delivery.
- Adatforrás: PRODUCT + ORDER; payment provider adapter az INTEGRATION szerződését használja; entitlement döntés külön domainben.
- Jogosultság/teszt: duplicate webhook, pending/failed/refund, unauthorized download, cancellation, provider outage, VAT/merchant-of-record döntés.
- PASS feltétel: nincs kézzel kitalált payment state; webhook idempotens; digitális hozzáférés visszavonható; a Store nem birtokol membership entitlementet.

#### SUP/ENTITLEMENT — Támogatás, tagság és hozzáférési jogosultság
- Művelet: tip/support state, membership tiers, perks, renewal/cancel/failed payment, entitlement grant/revoke és Discord role sync.
- Adatforrás: SUPPORT provider-confirmed state + ENTITLEMENT canonical access decisions; Discord role az entitlementből származik.
- Jogosultság/teszt: duplicate event, failed payment, refund/chargeback, expiry, role-sync retry, member-only content access.
- PASS feltétel: UI nem adhat hozzáférést saját döntésből; entitlement csak valós, idempotens domain eseményből változik.

#### CAM/SPONSORSHIP — Szponzoráció és üzleti kampányok
- Művelet: campaign, lead/deal, media kit, deliverable/deadline, UTM/affiliate, private business documents és sponsor reporting.
- Adatforrás: CAMPAIGN + SPONSORSHIP; landing page a WEB domainben, content a CNT domainben, metrika az ANALYTICS domainben.
- Jogosultság/teszt: private-document authorization, consent/attribution, missing metric, deal approval, export scope.
- PASS feltétel: üzleti dokumentum nem szivárog publikus felületre; AI nem vállal árat/szerződést; campaign nem másolja a content/order/analytics rekordokat.

#### ANL — Analytics és növekedés
- Művelet: date range/compare/filter/export, normalized event metrics, anomaly alerts és source/freshness/quality display.
- Adatforrás: ANALYTICS read model, canonical event taxonomy és provider analytics; forrás-domain rekordot nem módosít.
- Teszt: missing metrics, timezone boundaries, duplicate events, bot traffic, consent denied, provider API change, export authorization.
- PASS feltétel: becsült/mért adat külön; hiányzó adat nem hamis nulla; metrika forrása/unit/window/freshness jelölt.

#### AUT — Automatizáció
- Művelet: trigger/condition/action builder, dry-run/approval, enable/pause/version, run history, retry/dead-letter/recovery.
- Adatforrás: automation trigger catalog, action registry, durable job/run log; domainmódosítás csak canonical command/API-n keresztül.
- Teszt: duplicate event, cycle, permission removed, provider outage, timeout, retry exhaustion, timezone boundary, partial failure.
- PASS feltétel: explicit allowlist, idempotency key, bounded retry/backoff; pause megállítja a következő futást; run logból hiba diagnosztizálható.

#### AI — SANCI AI
- Művelet: plan/proposal, context selection, preview diff, structured action, approve/reject, execute/verify/rollback.
- Adatforrás: permission-filtered context és domain read APIs; mutáció canonical command/API útvonalon.
- Jogosultság/teszt: prompt injection, invalid schema, wrong site, stale context, quota, provider unavailable, partial failure, rollback.
- PASS feltétel: AI nem adhat magának permissiont; nincs arbitrary code execution vagy secret access; public/destructive/financial action explicit approvalt igényel; AI nélkül a core manuális folyamatok működnek.

#### SEC — Biztonság, identitás és adatvédelem
- Művelet: auth/session, RBAC/ownership, tenant isolation, CSRF/OAuth, XSS/SSRF/injection, secret lifecycle, audit/privacy/consent.
- Adatforrás: IDENTITY/SITE/SETTINGS/AUDIT és secret store; fan identity külön policy.
- Teszt: unauthorized, cross-site, session expiry/revocation, rate limit, log redaction, webhook replay, export/delete.
- PASS feltétel: least privilege, fail closed, server-side authorization minden domainműveletnél, titok nem kerül kliensre/logba.

#### OPS/BACKUP — Üzemeltetés, diagnosztika és recovery
- Művelet: health/version, structured logs/correlation, alerting, migration preflight, backup/restore, incident/rollback, dependency review.
- Adatforrás: OPS telemetry, migration ledger és BACKUP manifest/snapshots/restore jobs.
- Teszt: migration integrity, failed job, restore drill, rollback, secret redaction, performance/query baseline.
- PASS feltétel: backup visszaállítható és próbált; hiba látható; incident/recovery runbook és rollback bizonyított.

#### LOC — Lokalizáció
- Művelet: translation keys/fallback, locale-specific page/content/navigation, glossary, completeness, AI-assisted translation review.
- Adatforrás: LOCALIZATION service + PAGE/CONTENT locale variants; Admin UI locale külön a public content locale-tól.
- Teszt: missing translation, fallback, localized slug/SEO, RTL, long strings, DST/currency formats.
- PASS feltétel: nincs nyelvkeveredés; hiányos fordítás nem jelölhető késznek; AI fordítás draft és emberi review szükséges.

#### SET/SEO/FORM — Site settings, SEO/publication és form submission
- Művelet: scoped settings, custom domain, SEO metadata/redirect/sitemap, form schema/submission/consent/spam review.
- Adatforrás: SITE/SETTINGS/SEO_PUBLICATION/FORM_SUBMISSION; public-safe projection külön a privát mezőktől.
- Teszt: invalid domain, canonical/robots conflict, sitemap invalidation, form spam, consent absent, submission export/delete.
- PASS feltétel: secret/private mező nem kerül public outputba; SEO csak validált publikált állapotot követ; form submission site-scoped és consent-aware.

#### DYN — Dinamikus adatbinding
- Művelet: source registry, binding schema, type/field validation, whitelist transforms, conditional visibility, state machine and diagnostics.
- Adatforrás: canonical domain read APIs; binding csak referenciát és megjelenítési konfigurációt tárol.
- Teszt: invalid reference, wrong field type, unauthorized source, stale/partial data, missing source, cache invalidation.
- PASS feltétel: nincs arbitrary query/code execution; published-only/permission boundary szerveroldali; source hiba látható.

#### SEARCH/NOTIFICATION — Keresés és értesítések
- Művelet: permission-aware global search, module search, in-app/email/push notification, preferences, digest/silent period and delivery retry.
- Adatforrás: SEARCH derived index + NOTIFICATION delivery/preference state; canonical domain record az eredeti forrás marad.
- Teszt: permission revoke, stale index, hidden private record, duplicate event, delivery failure, unsubscribe/silent period.
- PASS feltétel: nincs jogosulatlan találat vagy snippet; az értesítés nem jelez kézbesítést provider confirmation nélkül; duplikált event deduplikált.

#### DEV — Developer platform/API
- Művelet: API docs/versioning, scoped key lifecycle, creator-defined outbound webhook registry/tester, sandbox, SDK and quota.
- Adatforrás: DEVELOPER_API; secrets one-time display/secret store; outbound webhooks külön az INT inbound provider webhooktól.
- Teszt: key rotation/revoke, scope escalation, tenant crossing, signature failure, replay, retry exhaustion and quota.
- PASS feltétel: nincs secret leak, scope escalation vagy nem auditált delivery; csak dokumentált API-version és scope használható.

#### EXTENSION/MKT — Bővítmények és piactér
- Művelet: manifest/permission review, install/update/uninstall/migration, signature/provenance, sandbox, compatibility and marketplace listing.
- Adatforrás: EXTENSION registry és versioned manifest; bővítmény nem írhat közvetlenül idegen domain táblába.
- Teszt: over-permission, unsigned package, failed update, migration rollback, orphaned hook/data, revoked permission.
- PASS feltétel: minimum privilege, reviewed origin, reversible install lifecycle; uninstall után nincs executable hook vagy árva jogosultság.

#### TEAM/WORKSPACE/BILLING_PLAN — Csapat, több site és SaaS
- Művelet: workspace/site switch, invite/revoke, roles, client workspace, plan/usage/quota/billing lifecycle.
- Adatforrás: WORKSPACE + BILLING_PLAN; Store ORDER és fan ENTITLEMENT külön marad.
- Teszt: invite expiry/revoke, active-scope switch, cross-site negative test, quota exceeded, plan downgrade, export/migration.
- PASS feltétel: minden kérés aktív server-side scope-ban fut; nincs tenant data mixing; billing/plan állapot nem állítható kliensből.

#### QA — Minőség és acceptance evidence
- Művelet: typecheck/build/CI, domain/API/integration, authorization negative, migration, browser/responsive/accessibility, E2E and production smoke.
- Adatforrás: test run, CI artifact, commit, runtime evidence and user acceptance log.
- PASS feltétel: csak tényleges futási eredmény jelölhető PASS-nak; a specifikáció vagy a létező tesztfájl önmagában nem bizonyítja a funkciót.
### 26.4. Általános negatív tesztkövetelmény
Minden mutációs domain legalább az alábbi negatív eseteket teszteli:
- hiányzó/hibás mező;
- lejárt vagy elégtelen jogosultság;
- másik site-hoz tartozó ID;
- stale/revision conflict;
- hálózati timeout és provider hiba;
- ismételt kérés/webhook;
- részleges mentési hiba;
- törlés/archiválás hivatkozott rekorddal;
- titok/PII nem kerül a válaszba vagy logba;
- reload után a tényleges állapot egyezik a sikerüzenettel.

---

---

## 27. Felhasználói végponttól végpontig folyamatok

A teljes platform csak akkor koherens, ha a modulok közötti folyamatok is működnek. Az alábbi journey-k külön end-to-end acceptance pontok.

### 27.1. Weboldal készítés és publikálás
1. Admin belépés és megfelelő site kiválasztása.
2. Oldal létrehozása sablonból vagy üresen.
3. Blokkok elhelyezése, rétegek és Inspector használata.
4. Globális design token és lokális override ellenőrzése.
5. Media asset kiválasztása és alt text megadása.
6. Mobil/tablet/desktop viewport ellenőrzés.
7. Undo/redo, mentés, reload, revision visszaállítás.
8. Preview ellenőrzés külön a publikált oldaltól.
9. SEO, canonical URL, Open Graph, internal link és accessibility check.
10. Explicit publish; publikus route és snapshot ellenőrzése.
11. Unpublish/rollback és cache invalidation ellenőrzése.
12. PASS: nincs adatvesztés, draft-szivárgás, hamis siker vagy hibás mobil layout.

### 27.2. Integráció és live státusz
1. Admin Kapcsolatok → provider kiválasztása.
2. Scope/permission magyarázat és OAuth indítás.
3. State/redirect/callback ellenőrzés, token biztonságos tárolása.
4. Kapcsolat állapota, last sync és provider account megjelenítése.
5. Dashboard, Live és Editor live block ugyanazt az állapotot olvassa.
6. Token expiry/provider outage esetén degraded state és reconnect.
7. Disconnect után minden felület azonos állapotot mutat.
8. PASS: nincs duplikált kapcsolat, cross-site bind vagy secret leakage.

### 27.3. Adásrend és játékprofil
1. Game profile kiválasztása vagy létrehozása.
2. Event létrehozása explicit timezone/recurrence beállítással.
3. Ütközés és DST ellenőrzés.
4. Dashboard és public schedule ellenőrzése.
5. Editor schedule block konfigurációja ugyanarra a domainre mutat.
6. Event módosítása után minden felület frissül.
7. PASS: nincs másolt event rekord, időzóna-hiba vagy stale publikus cache.

### 27.4. Tartalomtervezés és publikálás
1. Canonical content item létrehozása.
2. Media asset és platform target hozzárendelése.
3. Provider capability és mezőkorlát validáció.
4. Draft/review/scheduled állapot.
5. Publish job, provider response és external ID tárolása.
6. Retry/cancel/failure handling.
7. Public content center és analytics frissülése.
8. PASS: duplikált publish nincs, nem támogatott platformművelet nincs hamis sikerrel elfogadva.

### 27.5. Digitális termék és entitlement
1. Product draft létrehozása és fájl/asset hozzárendelése.
2. Ár, currency, tax/merchant-of-record és provider képesség döntése.
3. Preview és explicit aktiválás.
4. Teszt purchase/sandbox payment.
5. Provider által megerősített payment event → entitlement grant.
6. Biztonságos, jogosultság-ellenőrzött letöltés.
7. Refund/cancel/chargeback → entitlement policy alkalmazása.
8. PASS: secret nem szivárog; fizetési állapotot nem a kliens állítja; access visszavonható.

### 27.6. Automatizáció és AI
1. Trigger és action kiválasztása az engedélyezett registryből.
2. Dry-run: célrekordok és side effectek megjelenítése.
3. Permission, ownership, quota és cycle check.
4. Approval, ha szükséges.
5. Futtatás idempotencyvel és audit loggal.
6. Result verification, retry vagy rollback.
7. PASS: nincs nem engedélyezett művelet, rejtett side effect vagy meg nem erősített siker.

### 27.7. Média/asset életciklus és biztonságos törlés
1. Jogosult felhasználó kiválasztja az aktív site/workspace-t.
2. Egy vagy több fájl feltöltése; progress/cancel/retry és megszakadt feltöltés helyreállítása.
3. MIME, méret, checksum, fájlbiztonság és feldolgozási státusz ellenőrzése.
4. Preview/thumbnail/variáns elkészül; az asset ID és metadata a kanonikus registrybe kerül.
5. Asset használata a Brand Kitben, Content Studioban, Editorban vagy overlayben referenciával.
6. Metadata módosítás után minden hivatkozási hely ugyanazt a kanonikus assetet mutatja.
7. Törlés előtt usage map, függőségi figyelmeztetés, archive/replace/restore döntés.
8. PASS: nincs site-scope átlépés, orphanolt publikus referencia, plaintext bináris D1-ben vagy engedély nélküli letöltés.

### 27.8. Brand Kit, design token és reusable template
1. Brand owner logó-, font-, szín- és licencelt assetet választ a Resource Registryből.
2. Token/theme-variáns létrehozása, kontraszt- és responsive preview.
3. Template vagy reusable component mentése a megfelelő szinten (site/page/section/component).
4. Egy változtatás diffje és érintett használati helyei megjelennek.
5. Preview és jóváhagyás után a globális token/template verzió frissül.
6. Kompatibilitási figyelmeztetés, rollback vagy korábbi verzió visszaállítása tesztelendő.
7. PASS: nincs duplikált token-master, rejtett breaking change vagy licenc nélküli asset export.

### 27.9. OBS, overlay és stream-eszközök
1. OBS párosítás dokumentált protokollal, biztonságos secret kezeléssel és explicit engedélyekkel.
2. Scene/source/overlay konfiguráció lekérése csak a támogatott API-képességek szerint.
3. Overlay/widget összeállítása a Brand Kit és Resource Registry referenciáival.
4. Browser source URL, canvas/safe area, scene-variáns és verzió előnézete.
5. Tesztmód/event replay/dry-run; külső parancs allowlist és permission check.
6. Aktiválás, verziózott publikálás, rollback, reconnect és hibaállapot ellenőrzése.
7. PASS: nincs nyílt vezérlővégpont, titok a logban vagy nem támogatott OBS-művelet hamis ígérete.

### 27.10. Támogatás, tagság és entitlement
1. Support/membership provider kiválasztása és tényleges capability/terms ellenőrzése.
2. Tip vagy tagsági szint beállítása, ár/perk/access policy és lemondási szabály.
3. Sandbox vagy igazolt tesztfizetés; a kliens nem állíthat sikeres fizetést.
4. Provider-confirmed esemény → idempotens entitlement grant/update.
5. Member-only tartalom/esemény ellenőrzése a public/community felületen szerveroldalon.
6. Discord role sync, retry, revoke és audit a kanonikus entitlementből.
7. Failed payment/refund/chargeback/cancel → policy szerinti hozzáférésfrissítés.
8. PASS: nincs jogosulatlan hozzáférés, kettős entitlement vagy provider által nem igazolt támogatási státusz.

### 27.11. Szponzorációs kampány és üzleti riport
1. Lead/deal létrehozása megfelelő privát hozzáféréssel.
2. Media kit/rate card és kampánycél/deliverable/határidő hozzárendelése.
3. Landing page a Weboldal modulban készül; a kampány csak az oldalra hivatkozik.
4. UTM/link/kód és tartalom/termék kapcsolat beállítása a megfelelő domain ID-k mentésével.
5. Jóváhagyott content/publish feladatok és deliverable státusz követése.
6. Analytics riport csak valós, forrásjelölt metrikából készül; hiányzó adat látható.
7. Deal/dokumentum/ár emberi jóváhagyást igényel; AI csak javaslatot adhat.
8. PASS: nincs B2B deal adat publikus szivárgása, hamis attribution vagy nem bizonyított teljesítményígéret.

### 27.12. Lokalizáció és többnyelvű publikálás
1. Admin UI-locale és a site publikus alapnyelve külön kerül beállításra.
2. Nyelv/locale felvétele, oldal- és CMS-fordítási státusz, fallback és szószedet.
3. Lokalizált slug, alt text, metadata, Open Graph és SEO mezők előnézete.
4. RTL/keyboard/long-string/responsive ellenőrzés az érintett oldalon.
5. AI-fordítás csak draft; emberi review és explicit publish szükséges.
6. Hreflang/canonical/redirect és hiányos fordítás szabályainak validálása.
7. PASS: nincs nyelvkeveredés, hibás canonical/hreflang vagy késznek jelölt hiányos locale.

### 27.13. Fan account, közösség és moderáció
1. Fan regisztráció/bejelentkezés a creator/Admin identitástól elkülönített policy szerint.
2. Profil/preferenciák/consent és community visibility policy ellenőrzése.
3. Poszt/poll/beküldés létrehozása; spam/rate limit és tartalombiztonság.
4. Report → moderation queue → döntés → értesítés; appeal és audit megőrzése.
5. Member-only tartalomhoz az entitlement service szerveroldali döntése szükséges.
6. Export/delete kérelem a retention/consent policy és jogi megőrzési kivételek szerint fut.
7. PASS: nincs cross-account/site hozzáférés, jogosulatlan moderáció vagy adatvédelmi kérés nyom nélküli elvesztése.

### 27.14. Developer API key és webhook
1. Jogosult developer sandboxot választ és dokumentált API-verziót használ.
2. API key létrehozása minimális scope-pal; secret csak egyszer jelenik meg.
3. Key rotáció/lejárat/visszavonás és quota/rate limit viselkedés tesztelése.
4. Creator-defined outbound webhook endpoint létrehozása és tesztesemény küldése.
5. Aláírás, delivery log, idempotency, retry és replay elleni védelem ellenőrzése.
6. API és webhook csak a deklarált scope/site/workspace határon férhet hozzá adathoz.
7. PASS: nincs secret leak, scope escalation, tenant-átlépés vagy nem auditált webhook delivery.

### 27.15. Extension/widget install, update és eltávolítás
1. Extension manifest, eredet/aláírás, licence, version és requested permissions ellenőrzése.
2. Permission review és sandbox/compatibility check az install előtt.
3. Telepítés elkülönített scope-pal; nincs implicit hozzáférés minden domainhez.
4. Update/migration előtti backup vagy kompatibilitási ellenőrzés és diff.
5. Hiba esetén rollback/quarantine; uninstallkor adat- és függőségi hatás látható.
6. Visszavonás után tokenek/permissionök érvénytelenítése és audit.
7. PASS: nincs csendes jogosultságbővítés, unsigned extension vagy adatvesztést okozó eltávolítás.

### 27.16. Csapat, több site és SaaS workspace
1. Owner létrehoz workspace-et/site-ot, és egyértelműen kiválasztja az aktív scope-ot.
2. Meghívás elfogadása, szerep és modul/művelet permission kiosztása.
3. Másik site-ra váltáskor minden lista, keresés, Editor, asset picker és API új scope-ot használ.
4. Cross-site negatív teszt másik site ID-jának közvetlen beküldésével.
5. Plan/usage/quota/billing státusz a BILLING_PLAN domainből érkezik; nem keveredik a Store orderrel.
6. Workspace export/migráció/restore előnézete és auditja.
7. PASS: nincs tenant-adatkeveredés, jogosultság nélküli meghívás vagy rossz workspace-en végrehajtott mutáció.

### 27.17. Backup, export és restore
1. Jogosult owner kiválasztja a scope-ot és az export/backup tartalmát.
2. Manifest, verzió, checksum, asset referencia és kizárt secret mezők validálása.
3. Backup/restore futás állapota, hibája és újrapróbálása megjelenik.
4. Restore izolált célba vagy preview/dry-run környezetbe történik.
5. Restore után ownership, referenciák, migrációk, public visibility és cache/index invalidation ellenőrzése.
6. Recovery drill eredménye, eltérés és rollback út dokumentált.
7. PASS: nincs secret export, sérült hivatkozás vagy igazolatlan restore-siker.

### 27.18. Globális keresés és értesítési központ
1. Keresés a jogosult modulokból származó oldal-, content-, asset-, termék- és beállítási projectionökben.
2. Minden találat a kanonikus domain rekordjára navigál; keresési index nem írható vissza üzleti adatként.
3. Permission/site/workspace változáskor az index és cache invalidálódik.
4. Értesítés domain eventből készül, delivery státusszal, preferenciával és digest/silent-period szabállyal.
5. Sikertelen kézbesítés retry/partial state-et mutat; duplikált eventből nem keletkezik duplikált értesítés.
6. PASS: nincs jogosulatlan találat, elavult sensitive snippet, hamis kézbesítési státusz vagy duplikált értesítés.

---

---

## 28. UI- és hibakezelési standard

Minden képernyő és művelet a következő szabályoknak felel meg:
- **Loading:** a felhasználó látja, hogy a rendszer dolgozik; duplikált submit tiltott.
- **Empty:** magyarázat + releváns első lépés; nem üres fehér panel.
- **Stale:** régi adat frissességi címkével; kritikus művelet előtt frissítés.
- **Partial failure:** működő részek látszanak, hibás részek egyértelműen elkülönülnek.
- **Validation:** mezőhöz kötött, magyarul érthető hiba; a megadott adat nem vész el.
- **Conflict:** megmutatja, hogy a szerveroldali revision eltér; explicit reload/merge választás.
- **Permission denied:** nincs részleges mutáció; megfelelő magyarázat.
- **Offline/timeout:** retry biztonságos és idempotens; a rendszer nem állít sikert.
- **Success:** csak a szerver/domain megerősítése után jelenhet meg.
- **Destructive action:** hatás és célrekord megnevezése, confirmation, audit és recovery policy.
- **Keyboard/touch:** minden fontos művelet fókuszolható, címkézett és elérhető.
- **Reduced motion:** animáció és mozgás a felhasználói preferenciát tiszteletben tartja.
- **Responsive:** kis mobil, nagy mobil, tablet, laptop és nagy desktop; horizontális overflow csak indokolt helyen.
- **Localization:** nyelv, dátum, idő, szám, pénznem és időzóna külön kezelendő.

---

---

## 29. Adatmodell- és lifecycle katalógus

A tényleges táblák neveit és meglévő migrációit az implementáció előtt, az F0 platformbaseline részeként kell ellenőrizni; ez a logikai entitáskatalógus nem engedélyez új, párhuzamos táblák létrehozására.

- **Site/Workspace:** tulajdonos, konfiguráció, domain, locale, status.
- **Identity/Session/Role:** user, session, membership, permission, revocation.
- **Page/PageRevision/PublishedSnapshot:** szerkeszthető állapot, változattörténet, publikus snapshot.
- **Navigation/Menu:** sorrend, hierarchia, cél, visibility, locale.
- **DesignToken/Theme/Font:** globális vizuális szerződés.
- **Component/Template/ComponentInstance:** újrafelhasználható definíció és példány.
- **Asset/Resource:** metadata, R2 key, checksum, dimensions, visibility, references.
- **Integration/ProviderAccount/SyncRun/WebhookEvent:** connection, token reference, provider state, idempotency.
- **ScheduleEvent/GameProfile:** canonical event és game identity.
- **ContentItem/ContentTarget/PublishJob/ExternalContentRef:** tartalom és platformonkénti publikálás.
- **CommunityPost/Audience/Consent/Subscription:** közösségi tartalom és hozzájárulási állapot.
- **Product/Order/PaymentEvent/Entitlement/DownloadGrant:** commerce és hozzáférés.
- **AnalyticsEvent/Aggregate/Campaign/SponsorDeal:** mérés és üzleti folyamat.
- **AutomationDefinition/AutomationRun/ActionAudit:** workflow és futás.
- **AIJob/AIProposal/Approval/ActionResult:** AI javaslat és kontrollált végrehajtás.
- **Notification/EmailDelivery/SupportRequest:** üzenetküldés és delivery state.
- **AuditEvent/BackupManifest/RestoreRun/Incident:** üzemeltetési bizonyíték és helyreállítás.
- **ExtensionManifest/InstalledExtension/WorkspacePlan/UsageQuota:** későbbi bővíthetőség.

Minden entitásnál tisztázandó: owner/site scope, ID, unique constraint, FK, lifecycle, delete/archive policy, PII/secret classification, index, migration, retention, export/restore és audit.

---

---

## 30. Külső szolgáltatók integrációs döntési kapuja

Külső szolgáltató integrációja előtt egy provider kártya készül:
- hivatalos API és OAuth dokumentáció;
- aktuális scopes/permission és review requirements;
- create/read/update/delete/publish/webhook capability matrix;
- rate limits, quota, pagination, token expiry/refresh;
- sandbox/test account elérhetőség;
- data retention, privacy, export/delete;
- API versioning, deprecation és outage policy;
- region, latency, pricing, transaction fees és dependency lock-in;
- licence, branding, attribution és platform policy;
- retry/idempotency/webhook signature contract;
- manual fallback és disconnect behavior;
- acceptance teszt és bizonyíték.

Provider funkciót nem szabad a marketingoldal alapján biztosan megvalósíthatónak tekinteni. A capability matrix csak hivatalos dokumentáció vagy működő teszt után jelölhető VERIFIED. Ha nincs API vagy engedély, a felület csak egyértelmű külső linket vagy manuális folyamatot adhat; nem szimulálhat natív integrációt.

---

---

## 31. Külső benchmark — konkrét tanulságok és korlátok

A benchmark célja nem a konkurensek felületeinek másolása, hanem a felhasználói feladatok, minőségi elvárások és működő termékminták összevetése.

### 31.1. Vizuális weboldalépítők
- Framer mintája: canvas-központú tervezés, responsive layout, CMS, SEO, publikálás előtti ellenőrzés, staging/domain/redirect és lokalizáció.
- Webflow mintája: vizuális felépítés és strukturált CMS összekapcsolása, illetve integrációs ökoszisztéma.
- Átvétel a Sanci9517-ben: a canvas és CMS külön felelősség; reusable component és token; preview/publish gate; SEO/performance/accessibility ellenőrzés.
- Nem vehető át vakon: szolgáltatóhoz kötött hosting, fizetős csomag, CMS limit vagy provider-specifikus API.

### 31.2. Creator platformok és monetizáció
- Beacons mintája: Link Hub, creator storefront, digitális termék, email marketing és media kit/creator analytics.
- Fourthwall mintája: merch fulfillment, saját termék, digitális letöltés, tagság, támogatás és integrált creator homebase.
- Átvétel: külön link/campaign, product, entitlement, membership, audience consent és sponsor/media kit domain; egyértelmű díj- és provider-függőség.
- Nem vehető át vakon: díjszabás, payment flow, fulfillment, membership vagy platform entitlement; ezek jogi, pénzügyi és provider-függő döntések.

### 31.3. Minőség, akadálymentesség és biztonság
- W3C WAI/WCAG irányelvek: a hozzáférhetőség tervezési és tesztelési alap, nem utólagos kozmetika.
- OWASP Top 10:2025: külön figyelmet igényel a broken access control, security misconfiguration, supply-chain, crypto, injection, insecure design, auth, integrity, logging/alerting és exceptional condition handling.
- Átvétel: keyboard/focus/contrast/labels/reduced-motion, server-side authorization, input validation, secret redaction, dependency review, audit és negatív tesztek.
- Minden külső benchmarkot a Sanci9517 céljaira, költségére, stackjére, jogi környezetére és valós API-képességére kell szűrni.

### 31.4. Benchmark forrásnapló
- Framer Website Builder: https://www.framer.com/solutions/website-builder/
- Framer localization: https://www.framer.com/help/localization/
- Webflow CMS: https://eu.webflow.com/feature/cms
- Webflow integrations: https://webflow.com/integrations
- Beacons creator store: https://beacons.bio/i/app-pages/store
- Beacons updates/media kit: https://shop.beacons.ai/i/whats-new
- Fourthwall creator platform: https://fourthwall.com/creators
- Fourthwall memberships: https://fourthwall.com/memberships
- W3C Web Accessibility Initiative: https://www.w3.org/WAI/
- OWASP Top 10:2025: https://owasp.org/www-project-top-ten/

Az oldalakat a pont implementációja előtt újra ellenőrizni kell, mert a termékfunkciók, díjak, API-k és feltételek változhatnak. A benchmark állítása nem jelenti, hogy a funkció már megvalósult vagy jogilag/API szinten megvalósítható.

---

---

## 32. Közös domain- és felületi konzisztencia

- Minden üzleti adatnak egy kanonikus domain tulajdonosa van; az Admin, az Editor, a Dashboard és a publikus weboldal ugyanazt a forrást használja.
- Az integrációk egyetlen token-/OAuth- és provider-adapter útvonalon keresztül működnek.
- A schedule, content, media, product, order, membership és analytics nem másolható szét felületenként eltérő adatforrásokra.
- A Visual Editor az oldalelrendezést és a dinamikus blokkok konfigurációját kezeli; a tényleges schedule, integráció, termék, közösség és analitika a saját Admin-moduljában marad.
- Minden keresztmodulos műveletnél egyértelmű az adatforrás, jogosultság, mentési életciklus, hibajelzés és visszaállítás.
- A provider hiányzó vagy nem támogatott képességét a rendszer nem szimulálhatja sikeresként.

---

## 33. Jelenlegi technikai kiindulópont

A jelenlegi rendszer Cloudflare Workers/TypeScript alapú, D1-et használ strukturált adatokhoz, R2-t bináris objektumokhoz; a Worker neve `sanci9517-streamer-brand`, a kanonikus Visual Editor runtime `public/editor-v2/`.

A korábbi fejlesztésből megőrzendő, már kialakított alapok:
- kanonikus Page Model és szerveroldali validáció;
- site ownership és D1 ownership-integritási szerződések;
- draft/revision és publikált állapot szétválasztására épülő Editor-architektúra;
- Schedule domain és az `schedule_items` kanonikus adatforrás;
- Twitch OAuth/site ownership integrációs alap;
- D1 strukturált metaadat és R2 bináris tároló elkülönítése.

Ezek nem jelentik automatikusan az összes felhasználói workflow teljes készültségét. A következő fejlesztésnek a valós kód- és tesztállapotból kell indulnia; lezárt alapot csak konkrét regresszió esetén nyitunk újra.

---

