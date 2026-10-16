Warning: truncated output (original token count: 535237)
... 1092370 bytes omitted ...

# SANCI9517 — CREATOR PLATFORM: TERMÉK-, ARCHITEKTÚRA- ÉS FEJLESZTÉSI MASTER-TERV

**Tervazonosító:** S9517-CREATOR-PLATFORM-MASTER  
**Verzió:** 4.3.0 — konszolidált, feltöltésre előkészített fejlesztési MASTER  
**Dátum:** 2026-10-16  
**Állapot:** KANONIKUS TERMÉK- ÉS FEJLESZTÉSI MASTER — a tervezett termékkör rögzítve; F0.2 és F0.3 CLOSED / PASS. Az F1.1 Site Core, többoldalas kezelés és navigáció IN PROGRESS. A tervezési teljesség nem bizonyít sem kész implementációt, sem teljes körű tételes szemantikai audit.
**Aktív tervpontazonosító:** `F1.1-SITE-CORE-MULTIPAGE-NAVIGATION`  
**Aktív tervpont státusza:** IN PROGRESS — Site Core, többoldalas kezelés és navigáció. A 77.10 szerinti F0.3 kiadási kapu lezárult; az F1.1 oldalkezelési acceptance pontjai a 77.11–77.14 szerint részlegesen teljesültek, a canonical navigációs fa és további CRUD/URL ellenőrzések nyitva maradnak.
**Következő közös lépés / AKTUÁLIS FOLYTATÁSI KURZOR:** `F1.1-SITE-CORE-MULTIPAGE-NAVIGATION` — a production WEB-009 kiadás kézi Editor-elfogadása: navigáció betöltése, draft mentés és külön publikálás, majd nested/mobile/keyboard ellenőrzés.
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

Ez a fókusz nem a teljes Creator Platform scope-jának szű…212153 tokens truncated…példány; explicit upgrade | 49.3 design/template domain |
| Site theme | design tokenek, tipográfia, layout primitives, theme módok | globális tokenreferencia; scoped override | Brand Kit |
| Page template | egy oldaltípus szerkezete és alap komponensei | alapból szerkeszthető oldal-példány; dokumentált linked mód | template registry |
| Section preset | kiválasztható hero, cards, CTA, gallery, social/stream/layout minta | gyors beszúrás; lokális stílus és tartalom | template registry |
| Component master | verziózott újrahasznosítható elem propokkal és slotokkal | linkelt példány, explicit override, detach | component registry |
| Content preset | CMS mezők/collection seed és demonstrációs tartalom | új rekordok, duplikáció és ownership kontroll | CMS domain |
| Stream/overlay preset | grafikai és animációs konfiguráció, widget layout | Overlay Studio példány; közös brand token | stream studio registry |
| Automation preset | trigger/condition/action konfiguráció | telepítés alapból *disabled*, csak jóváhagyva aktiválható | automation domain |

**Részletes fejlesztési feladatok (STP-01–STP-24; azonosítók munkacsomag-alpontok, nem a 396 eredeti funkció-ID helyettesítői):**
1. `STP-01` Manifest schema, verzió, owner, címkék, locale, licenc, preview, moduligény.
2. `STP-02` Type-safe token schema és globális/lokális öröklés.
3. `STP-03` Presetválasztó a Site Managerben és releváns Editor-panelben.
4. `STP-04` Sablonkatalógus típus/cél/kompatibilitás szerint kereshető.
5. `STP-05` Kit preview desktop/tablet/mobile mintatartalommal.
6. `STP-06` Install terv: létrejövő oldalak, assetek, CMS-típusok, jogok és modulfüggőségek listája.
7. `STP-07` Dry-run konfliktusvizsgálat meglévő slugokkal, komponens-ID-kkal és tokennevekkel.
8. `STP-08` Atomi, idempotens telepítés, napló és visszaállítható hiba.
9. `STP-09` Kit és page template import/export sémaverzióval.
10. `STP-10` Global header/footer mint linked komponensek.
11. `STP-11` Master/instance propok, slotok, boolean/enum/content változatok.
12. `STP-12` Lokális override és egyértelmű reset-to-master.
13. `STP-13` Detach/fork konfliktus- és adatvesztésellenőrzéssel.
14. `STP-14` Sablonfrissítés diff, scope és érintett oldalak előnézetével.
15. `STP-15` Rollback kompatibilis schema migrációval.
16. `STP-16` Dark/light/high-contrast theme és tokenreferencia.
17. `STP-17` Desktop/tablet/mobile breakpoint és container/grid/flex preset.
18. `STP-18` Mozgás/animáció preset reduced-motion fallbackkal.
19. `STP-19` Ikon/emoji/SVG asset licence + sanitization és méretstílus.
20. `STP-20` Tipográfiai preset fallback, preload, licenc, teljesítmény.
21. `STP-21` Stream alert és live widget preset biztonságos próbaeseménnyel.
22. `STP-22` Tartalom és shop blokkok domainből kötött referencia-adatokkal.
23. `STP-23` Keresés, kedvencek, ajánlott és utoljára használt presetek.
24. `STP-24` Kompatibilitási, keyboard, screen reader, kontraszt és performance tesztkészlet.

**Starter családok:** minimalist creator, purple gaming/streamer, esports team, Twitch-first live, multi-stream hub, YouTube/channel, TikTok/Shorts, VOD archive, podcast, creator blog, link hub, community/fan club, merch store, digital products, membership, sponsor/media kit, launch/campaign, artist/brand basic. Nem mind kész a kezdő kiadásban; minden starterhez referencia UI, tartalmi helyőrzők, lokalizáció és edge-case teszt tartozik.

**Dizájn/preset könyvtár:** palettes; gradient; dark/light/high-contrast; type scale; font pairing; spacing; grid/container; borders/shadows; nav/header/footer; hero; cards; gallery/media; social channel bar; live/countdown; schedule; subscription/shop; alert/overlay; motion/reduced-motion; forms; responsive; SEO/open graph. Nem szabad a presetnek szerkesztőn kívüli, párhuzamos üzleti adatot írnia.

### 73.4. Visual Editor és szerkesztői biztonság — végrehajtás

- Alap: a már létező editor-v2 szerződéseinek felhasználása; az új core cseréje csak mérhető blokkoló indokkal. Specifikációs sorrend: document schema → node registry → property registry → renderer → command/history → persistence/revision → preview/public renderer → design tokens → templates → responsive → advanced UX.
- Canvas: kijelölés, többes kijelölés, bounding box, zoom, pan, rulers, guides, snapping, auto layout, constraints, section height/overflow, resize/move, keyboard alternatives, focus order, zoom-fit és canvas méretezési következetesség.
- Layers: tree reparent, reorder, nesting validation, grouping, hide/lock, breadcrumb, search; a valódi hierarchia mentése és a rétegsorrend determinisztikus renderelése kötelező.
- Inspector: type-safe property per node, token vagy lokális érték, responsive override/inheritance, layout/spacing/typography/background/border/effects/animation/a11y/data binding; unknown property nem törheti meg a régi dokumentumot.
- History: history transactions, undo/redo a releváns mutációkra, save közbeni új változás, dirty flag, leállítható mentés, revision compare, conflict detection, recoverable draft, crash refresh, időközös mentés csak igazolt idempotens működés után.
- Publikálás: draft és published snapshot fizikai/logikai izoláció; publish compare-and-swap/revision precondition, validation, atomic pointer swap, korábbi snapshot megtartása, cache invalidation, rollback és audit. A dokumentumban említett HIGH publish conflict kiadási blokkoló marad addig, amíg célzott E2E nem bizonyítja az ellenkezőjét.
- Data binding: CMS, Schedule, Media, Live, Content, Product, Community, Membership csak ID + query/filter/display props; a szerver a tényleges ownership, entitlement és visibility alapján olvassa.
- Editori workflow: design preview valós mintatartalommal; public preview jogosult preview-tokennel és lejárattal; soha nincs draft véletlen publikus API-ban; publish előtt link/alt/SEO/performance checks.
- Három eszköz: Page Editor, Overlay Editor és idővonalas Video Editor nem ugyanaz a workspace; közös Brand Kit, Asset Library, icon/font registry és jogosultsági szerződés, külön domain lifecycle.
- **Acceptance:** A módosítás B előtt mentett A revízió és közben érkező B revízió nem írhatja felül egymást hangtalanul; publikus oldal snapshotja mindig konzisztens; megszakadó hálózat után a felhasználó helyreállíthatja a munkát.

### 73.5. Provider-integrációk — közös capability és eltérő platformszabályok

A szolgáltatók támogatását **nem egyetlen általános Connected boolean** jelzi. Adatmodell: `provider, accountId, ownerSiteId, tokenRef, scopes, capabilities, health, lastSync, expiresAt, quotaState, webhookSubscriptions, connectionRevision, revokedAt`; titkos érték csak szerveroldali store-ban. Egy adott adat elérhetőségét a `capability + user scopes + platform approval + account eligibility + provider health` együttesen határozza meg.

| Provider | Tervezett képességcsomag | Kötelező negatív próbák |
|---|---|---|
| Twitch | OAuth, channel/live, schedule, EventSub, follow/sub/raid/Channel Points engedély szerint, VOD/clip meta, bot/chat szabályok szerint | lejárt token, hibás state, event duplázás, revoked scope, webhook signature, site-scope |
| YouTube | channel, playlist, videos/Shorts, upload, live, comments, analytics, quota aware jobs | quota exhausted, resumable upload megszakítás, privát/unlisted eltérés, scope tiltás |
| TikTok | profile, publishing, analytics, esetleges live capability csak jóváhagyott termékekkel | nem auditált app/limited visibility, rate limit, unsupported live, user review |
| Discord | bot/app, guild/channel/roles, invites, notifications, entitlement mapping, moderation | permission elvesztése, guild removal, duplikált esemény, rossz role mapping |
| Kick | channel/live, chat/schedule események csak dokumentált elérhető API-val | capability hiány, token expiry, policy change, unsupported action |
| OBS Studio | helyi OBS WebSocket hitelesített bridge/desktop agent vagy tudatosan helyi kapcsolódás | offline OBS, reconnect, eltérő verzió, localhost biztonság, jelenetállapot változás |
| Merch/payment/email/other | adapterek hivatalos API/policy alapján, providerfüggetlen domain mapping | refund, webhook replay, provider outage, token leak, tenant leak |

Az OBS-hez ne tervezzünk a publikus Cloudflare Workerből közvetlenül elérhető felhasználói localhost WebSocketet: böngésző/agent/bridge biztonsági és hálózati architektúrát explicit kell megvalósítani és tesztelni.

### 73.6. Stream Studio, Content Studio és Community/Commerce — a hiánytalan creator munkafolyamat

**Stream Studio:** stream preparation checklist; platform health/live status; scenes/source control és OBS reconnect; overlay library/editor; reusable widget registry; alert event queue és dedup; channel point/redeem és overlay scene mapping; stream deck/hotkey integráció ahol engedélyezett; chatbot parancs/permission/cooldown; polls/games/loyalty; moderation log; live multistream indicators; stream utáni recap, VOD link és továbbfeldolgozás. A stream nem állhat meg csendben hibás külső API miatt.

**Content Studio:** ideas → brief → raw asset/VOD → transcript → highlight/clip candidates → timeline/edit → aspect variants → captions/subtitles → thumbnail → metadata SEO → schedule/approval → provider-specific publish → result/analytics → repurpose. Az AI javasolhat lépéseket, de a vágás és alapfolyamat AI nélkül is működjön. Videó feldolgozásnál job queue, státusz, idő-/tárhely-/költséglimit, chunk/resume, retry, cancel, signed delivery és R2 lifecycle szükséges. Harmadik fél licence és szerzői joga ellenőrzendő.

**Community:** publikus visitor, creator account és fan/member account szerepe külön; privacy/consent, OAuth link, email verification, spam protection, comments, reactions, fan messages, moderation tools, bans/reports/appeal, polls/votes, gamification, points, badges, Discord sync, custom notifications, member-only content és jogosultság lejárat. A platformnak nem szabad automatikusan összemosnia a Twitch/Discord felhasználói azonosítót a saját belépési identitással.

**Commerce:** támogatás/tip, membership tiers/perks, shop/merch, digitális termék, kedvezmény/kupon, donor goal, sponsored landing page, affiliate/referral; provider checkout esetén biztonságos state machine, signed webhook, idempotency és entitlement activation/revocation; termék/media/content kapcsolatok canonical ID-val. Order, fulfillment, refund és chargeback kezelés nem a Page Editorban történik. Jogi és adózási megfelelőség kiadási kapu, nem automatikus állítás.

### 73.7. AI, automatizáció, SaaS és fenntartható üzlet — részletes korlátok

- Automatizációs DSL/workflow: trigger, condition, action, delay, branch, human approval, dedupe, idempotency, dry run, audit, retry/backoff, dead-letter, run cancellation, rate limits, loop/cycle defense, secret isolation, feature gating. Adás közbeni veszélyes eseményekhez circuit breaker.
- SANCI AI: szerkesztési javaslat, blog/SEO/thumbnail/text, brand guidance, voice/transcript, VOD analysis, clip candidate, repurpose, moderation assist, creator growth insights, stream feedback, knowledge base. RAG forrás- és jogosultsági ellenőrzéssel; model provider adapter, prompt injection izolálása; strukturált tool action, diff/draft és human approval; quota, redaction, deletion/export, költség és napló.
- SaaS: self-service signup → verification → workspace/site → starter kit → plan/trial → domain/publish → optional integrations → billing/usage → upgrade/downgrade/cancel → data export/delete. Multi-tenant access checked per DB query/asset key/cache/job/analytics/event; separate platform staff access logs, support impersonation only explicit audited consent.
- Billing: plan catalog, subscriptions, trials, limits, seats, included quota, metered overage, fair-use, past due, grace, pause, cancellation, billing disputes, invoice/tax provider, refund webhooks, entitlement state, exact usage provenance. Platform saját pénzügyi kockázatát explicit modellezni kell.
- **Egységköltség-szerződés:** mért havi aktív creator, fizető workspace, átlagos tárhely GB, kimenő forgalom GB, Workers/D1 műveletek, videó perc és transzkódolás, AI token/perc, email, support, fizetési díjak. Szenáriók: light, active, power creator, AI-heavy; unit contribution margin = nettó árbevétel – változó közvetlen költség; pricing csak konkrét provider árak és terhelés ismeretében végleges.
- Üzleti funkciók: onboarding funnel, activation rate (publikált site), D7/D30 retention, paid conversion, churn, MRR/ARR, ARPA, churn reasons, cost per workspace, gross margin, AI attach/cost, reliability és support SLA; személyes adatot érintő mérés consent/minimization szabály szerint.

### 73.8. UX, vizuális színvonal és termékbevezetés

- UI: egységes, személyre szabható de nem túlzsúfolt Creator Center; modulonként világos home/list/detail/create/preview/settings, globális keresés, gyorsművelet, breadcrumb, offline/error/empty/success, mobil/asztali, keyboard, screen reader, reduced motion, skeleton és retry.
- Inspirációs döntés: **Webflow** — component definition/instance property; **Shopify** — szekció/blokk/JSON template/preset; **WordPress** — globális vs nem szinkronizált patterns; **StreamElements/Streamer.bot** — események, alerts és biztonságos actions. Ezek tervezési minták, nem licenc nélkül átvehető kódok.
- Marketing/launch: értékajánlat, positioning, feature pages, demo gallery, creator starter showcase, product tour, onboarding emails/consent, docs/tutorial, changelog, feedback/bug form, public status, support tickets, creator case study (saját Sanci9517), referral/affiliate később, közösségi launch és mérhető aktivációs célok. Nem építünk belső teljes e-mail marketing szolgáltatást addig, amíg megbízható integráció elég.
- International: Hungarian-first, English supported when tested, timezone/number/currency/date formatting, translated content/SEO/hreflang, accessible legal/help pages, regional privacy/payment requirements. A marketingállítás különböztessen tervezett és ténylegesen működő képességet.

### 73.9. Kiadási minimumok és felhasználói elfogadás

**Belső Alpha — saját SANCI9517 használat:** auth/site ownership; stabil admin+editor+publish; működő brand/weboldal; Brand Kit + alap sablon/preset + média; Twitch/integrációs kapcsolódás; schedule/live public blokkok; audit/backup; hibátlan regressziós tesztek. A VOD/OBS/Shop/AI akkor kerüljön éles alpha körbe, ha külön tesztelve működik.

**Creator Beta — meghívott alkotók:** önkiszolgáló vagy kontrollált onboarding, több tenant izolációs próbák, több starter sablon, alap CMS, responsive site, provider reconnect, a kiválasztott creator munkafolyamatok, usage reporting, support; onboarding completion és első publish megfigyelés.

**Public SaaS GA:** billing/plan/quotas, subscription lifecycle, consent/privacy, kapacitás/monitoring/backup, üzleti szimulációk, incident runbook, opt-in AI pricing, platform policy approvals és support folyamatok ellenőrzése; csak a ténylegesen elérhető modulok marketingezhetők késznek. A teljes Creator OS funkciókészlet további érett kiadásokban bővíthető.

**Kapu-invariánsok:** egy funkcionalitást nem zárunk PASS-ra implementáció, typecheck, releváns unit/integration/E2E, jogosultsági negatív teszt, szükség esetén valós provider/production ellenőrzés nélkül. A terv elfogadása után nincs kötelező újabb teljes történeti audit: új funkció és kódmódosítás a kanonikus modulhoz és aktív fejlesztési ponthoz kötődik.

### 73.10. Következő konkrét munka — F0.1 / F0.2 / F0.3

| ID | Munka | Bizonyíték és PASS | Blokkolók |
|---|---|---|---|
| F0.1.01 | aktuális HEAD és branch, aktuális files/migrations környezet | commit/ref bizonyíték, tiszta kódalap, ismert eltérések | nem igazolt repo baseline |
| F0.1.02 | router /admin és /admin/editor, auth/session, editor asset hozzáférés | hitelesített és nem hitelesített próbák; nincs alternatív bypass | auth/access control |
| F0.1.03 | site ownership D1 + API surface inventory csak az aktív útvonalakon | cross-site negatív próbák, schema version | tenant leak |
| F0.1.04 | npm scripts és typecheck, editor/admin/domain tests futtatása | valós output és CI státusz mentve | failing test |
| F0.1.05 | draft/preview/publish jelenlegi API/data path trace | tényleges handler/db/renderer/response lépések, mismatch lista | publish conflict nyitott |
| F0.2.01 | editor save/reload, dirty/undo/redo, network abort | tesztek és browser flow | adatvesztés |
| F0.2.02 | konkurens editor/revision mentések | 409/ETag/precondition + conflict recovery teszt | silent overwrite |
| F0.3.01 | preview jog és titkos draft kizárása publikus renderből | anon/auth/draft teszt | draft leak |
| F0.3.02 | atomic publish pointer és rollback | két szerkesztő, interrupted publish, old/new snapshot teszt | HIGH publish conflict |
| F0.3.03 | cache invalidation és publikus smoke | public oldalak, mobil, SEO, links, old publish rollback | stale publikus adat |

**Fejlesztési méretezés:** minden sor szükség szerint apróbb API/DB/UI/test szeletre bontható. A végrehajtási sorrendből a dokumentumbeli összes platformképesség változatlanul megmarad. Ha a repo bizonyítja, hogy egy szelet már kész, nem írjuk újra; a hiányzót javítjuk.

### 73.11. Külső referenciaforrások, érvényesség, ellenőrzési rend

- Webflow component properties: https://help.webflow.com/hc/en-us/articles/33961219350547-Component-properties — instance props, egyedi tartalom és shared structure.
- Webflow localization: https://developers.webflow.com/data/docs/working-with-localization/localize-components — definíció és példány localizálhatóság.
- Shopify sections/blocks: https://shopify.dev/docs/storefronts/themes/architecture/sections — dinamika és editorban rendezhető blokkstruktúra.
- Shopify JSON templates: https://shopify.dev/docs/storefronts/themes/architecture/templates/json-templates — deklaratív page structure, schema és preset elv.
- Twitch API/EventSub: https://dev.twitch.tv/docs/eventsub/ — provider-driven event subscription, hitelesítés és életciklus.
- YouTube Data API: https://developers.google.com/youtube/v3 — aktuális quota/scope/upload feltételek implementációkor ellenőrizendők.
- TikTok Content Posting: https://developers.tiktok.com/doc/content-posting-api-get-started — engedélyezés/audit és láthatósági feltételek implementációkor ellenőrizendők.
- Discord Developer docs: https://discord.com/developers/docs — bot, OAuth, permission és event szabályok.
- OBS WebSocket protocol: https://github.com/obsproject/obs-websocket/blob/master/docs/generated/protocol.md — kapcsolat és request/event modellek.
- Cloudflare Workers/D1/R2/Queues: https://developers.cloudflare.com/ — a konkrét limit/ár/kompatibilitás implementáció és árazás előtt újraellenőrzendő.

A külső példák nem igazolják a SANCI9517 kód meglétét, licencét vagy működését. Minden képességet repository és futó teszt bizonyít.

## 74. FEJLESZTÉSI IRÁNYÍTÓ — EGYETLEN AKTÍV KURZOR ÉS ARCHÍV FELÜLÍRÁSI TILALOM

1. Az aktuális, egyetlen terv útvonala `docs/SANCI9517-CREATOR-PLATFORM-PLAN.md` a `v2/foundation` ágon. A korábbi checkpointok, legacy fájlok és 63.x történeti sorok forrás- és provenienciaanyagok, nem új fejlesztési kapuk.
2. **Termékkör nem szűkíthető F0-ra:** Twitch, OBS, TikTok, YouTube, Discord, shop/merch, tagság, közösség, SANCI AI és SaaS a *teljes termékcél* része. Csak az implementáció kapui fázisoltak.
3. A termékterv az egyetlen irányító; GitHub commit és teszt eredmény állapotbizonyíték. Külön párhuzamos aktív tervet, funkciókatalógust, roadmapet vagy auditnaplót nem készítünk.
4. **Aktív pont:** `F0.1-VERIFIED-BASELINE` — nem előzetes igazolt PASS, hanem következő megvalósítási/ellenőrzési feladat. HIGH publish conflict blokkoló az F0.3 kapunál; nem felejtjük el és nem szimuláljuk lezártnak.
5. A következő pont csak akkor léphet aktív státuszba, ha az előző működő kódja, tesztje, megfelelő szerepkörös és negatív tesztje bizonyított. A verziózható státuszbejegyzés ugyanebben a MASTER-ben frissül.
6. A teljes produktum *nyitott a későbbi bővítésre*, de nem nyitunk új teljes tervprojektet pusztán ötletek miatt. Új követelmény a megfelelő meglévő owner/modul/ID-szerződéshez kerül.
7. A feltöltendő fájl neve a GitHubon **pontosan** `SANCI9517-CREATOR-PLATFORM-PLAN.md`, útvonala `docs/`. A letöltött helyi fájl nem helyettesíti a GitHub frissítését; feltöltés után hash/diff/commit és HEAD ellenőrzendő.


---

## 75. Stream Studio, overlayek és makrók — részletes végrehajtási szerződés

**Státusz:** TERMÉKSPECIFIKÁCIÓ; nem implementáció- vagy teszt-PASS. Ez a 49.6, 49.14, 53.2, 54.7, OBS-001–OBS-009 és AUT-funkciók részletezése, nem külön rendszer vagy új kanonikus adatgazda. **Elsődleges felhasználó:** streamer/tartalomkészítő; a brand, media, integrációs és jogosultsági szolgáltatások közösek. Az itt szereplő alazonosítók a meglévő stabil ID-khez kapcsolódnak.

### 75.1. Overlay Studio — OBS-001, OBS-002, OBS-005, OBS-006
1. Overlay projektek: 16:9, 9:16, 1:1 és egyedi felbontás; több jelenet, safe area, rács, snap, zoom, kijelölés, rétegek, csoportok, zárás, igazítás, undo/redo.
2. Elemkönyvtár: kép, szöveg, videó, hang, kamera-keret, alsó sáv, live-státusz, aktuális játék, chat, event list, follower/sub counter, adománycél, countdown, poll, timer, alert és custom widget; csak valósan elérhető adatot mutathat.
3. Külön overlay sablon és preset: starting soon, BRB, intermission, gameplay, just chatting, ending, vertical live, webcam, sponsor, chat és event alert; minden sablon variánsai a Brand Kit tokenjeit használják.
4. Animáció: megjelenés/eltűnés, duration, delay, easing, trigger, motion-reduction, priority, overlap policy és audió ducking; GPU/CPU/bitráta/streamteljesítmény keretek.
5. Browser-source URL titkosított/rotálható hozzáféréssel, lejárat/revokáció és streaming módú cache-szabályok; nem tesz hozzáférhetővé Admin API-t vagy tokent.
6. Tesztüzem: mock event, sample names, preview mode, platformfüggetlen safe demo, hibás kapcsolati állapot, próbaalert; éles esemény nem keveredhet teszttel.
7. Publikálási életciklus: draft → preview → activate; verzió, snapshot, rollback, scene-hez kötés; a módosítás nem írhatja felül élő adás közben automatikusan az aktív konfigurációt.
8. Akadálymentesség és tartalomvédelem: villogás/motion limit, hangszint, szövegkontraszt, képernyőméret, közönség által beküldött tartalom szűrése.

### 75.2. Alert Engine és event queue — OBS-006, AUT-001–AUT-004
1. Eseménykatalógus provider capability szerint: follow, sub/resub, gift, cheer, raid, tip, member, donation, milestone, reward, chat command, poll, giveaway, saját webes esemény; hiányzó provider esemény nem jelenhet meg támogatottként.
2. Variánsok: platform, eseménytípus, összeg/szint, role, idő, kampány és véletlen súly alapján; előnézet, fallback, override és determinisztikus prioritás.
3. Queue: sorrend, priority, max backlog, deduplikáció, replay korlát, cooldown, coalesce, pause/resume, skip, expire, manual replay és cancellation; eltérő hang/vizuál csatornák kezelése.
4. Adatbiztonság: webhook signature, idempotency, privacy/redaction, szövegszűrés, XSS-védelem, érzékeny nevek és összegek opcionális maszkolása.
5. Hibakezelés: offline browser source, stale event, provider outage, dupla esemény, audio missing, sikertelen animáció; érthető állapot és részletes futási diagnosztika.
6. Acceptance: két egyidejű esemény sorrendhelyesen fut; deduplikált webhook nem jelenik meg kétszer; tesztriasztás nem növeli az éles statisztikát; éles beállítás visszaállítható.

### 75.3. Makró- és akciószerkesztő — OBS-004, OBS-009, AUT-002–AUT-014
1. Vizualizált trigger → feltétel → műveletek/alműveletek → várakozás → eredmény folyamat; akciócsoportok, újrahasznosítható rutinok, verzió, címkék, keresés, klónozás és sablon.
2. Triggerek: Stream Deck/Macro Deck/hotkey/MIDI/hitelesített webhook/chat command/reward/OBS state/scene switch/timer/schedule/live start/stop; triggerhez permission és adatforrás-frissesség.
3. Feltételek: élő státusz, jogosultság, napszak, rate limit, állapotváltozó, platform, futó sor, jelenet, értékhatár, és/vagy/nem csoportok; séma alapján típusellenőrzés.
4. Akciók: OBS scene/source/visibility/audio mute, overlay kapcsolás, alert test, chatüzenet, timer, counter, Discord notification, approved webhook és content draft; veszélyes és költséges akció alapértelmezésben jóváhagyásköteles.
5. Változók: workspace/site, makró-, futás- és esemény-scope; erős típus, alapérték, helyettesítés, titok maszkolása, input/output validáció; titok nem tárolható egyszerű makró-JSON-ben.
6. Vezérlési szerkezetek: if/else, switch, sequential/parallel, delay, timeout, retry/backoff, loop limit, subflow, cancel, manual pause, concurrency és lock; rekurzió/ciklusdetektálás.
7. Sorok: külön blocking/nonblocking prioritás, max concurrency, pause/resume, prioritás, vészleállítás, futásazonosító, idempotency és napló megőrzési szabályok.
8. Helyi végrehajtás: felhő Worker nem vezérelhet automatikusan helyi OBS-t; erre felhasználó által telepített, hitelesített és explicit párosított helyi bridge/agent szükséges, biztonságos outbound kommunikációval és revoke lehetőséggel. A bridge offline állapota külön kezelendő.
9. Presetcsomagok: starting soon → live, BRB, return, end stream, scene switch + audio fade, raid reaction, new subscriber, goal milestone, sponsor scene, emergency mute és stream end checklist.
10. Acceptance: dry-run side effect nélkül; OBS kapcsolat elvesztésekor nincs hamis siker; hibás trigger/rossz permission tiltva; rate-limit alatt ismételt akció nem floodol; cancel és emergency stop után nem marad futó veszélyes művelet.

### 75.4. Chatbot, interakciók és közösségi stream-eszközök — OBS-007, OBS-008
1. Parancs CRUD, alias, role, platform, template változók, válaszmód, cooldown globális/felhasználói, csatornaszabályok, teszt, napló és import/export.
2. Chat moderation: spam/link/caps/repeat szabályok, allowlist, ban/timeout kizárólag jóváhagyott provider capability szerint; moderációs napló és appeal-kapcsolat.
3. Loyalty: viewer points, earn/spend, anti-fraud, reset policy, leaderboards, redemption és későbbi entitlement kapcsolatok.
4. Játékos eszközök: szavazás, jóváhagyott giveaway, queue, counter, quote, challenge, shoutout, song request csak a platformszabályok szerint; résztvevők adatvédelme.
5. Nem kötelező saját chatbot: már használt Streamer.bot/StreamElements megoldás adapterrel kapcsolható, ha csökkenti a fejlesztési és migrációs terhet; ne fusson véletlenül két párhuzamos válaszoló bot.

### 75.5. Streaming vezérlő és biztonsági ellenőrzőlista — OBS-003, OBS-004, OPS
1. Live dashboard: platform- és OBS-kapcsolat, stream/record állapot, mikrofon/némítás, scenes, dropped-frame, bitrate, reconnect és adatfrissesség, kizárólag ha technikailag elérhetők.
2. Go-live checklist: cím, kategória, adásrend, overlay, bot, alert, hang, kamera, recording, hálózat, szponzor/brand, privát információ megjelenésének ellenőrzése.
3. Emergency controls: lokálisan párosított agenten keresztüli mute/scene-fallback/alert pause; jogosultság, explicit felhasználói művelet, audit és no-op fallback.
4. Többplatformos stream és vertical output: capability, platform policy, OBS profilok és valós teljesítmény alapján; a cloud app nem ígér transzkódolást vagy multistreamet működő szolgáltató/kapacitás nélkül.
5. Acceptance: teljes offline módban a publikus oldal működik; nincs téves live státusz; reconnect után nem duplázódnak makrók vagy alert-ek; csak engedélyezett kezelő változtathat OBS-állapotot.

### 75.6. Fejlesztési függőségek és végrehajtási sorrend
- STREAM-TOOLS-PLAN.01: Közös STREAM_TOOLS adatkontraktus és permissions; integrációs EventBus határ.
- STREAM-TOOLS-PLAN.02: Lokális OBS bridge és biztonságos pairing (csak felhasználói opt-in), fake és valódi OBS teszt.
- STREAM-TOOLS-PLAN.03: Overlay render/browser-source + demo widget + preview/version/rollback.
- STREAM-TOOLS-PLAN.04: Provider események + alert queue + variánsok + tesztmód.
- STREAM-TOOLS-PLAN.05: Macro runtime/queue/trigger/condition/action engine + dry-run + manual stop.
- STREAM-TOOLS-PLAN.06: Chatbot/interactive tools + provider capability + moderáció.
- STREAM-TOOLS-PLAN.07: Template/preset csomagok + megosztás/import + biztonságos frissítés.
- STREAM-TOOLS-PLAN.08: Live Control Center + observability + teljes E2E/failure/permission/load tesztek.

**Kötelező külső ellenőrzés fejlesztés előtt:** OBS WebSocket hivatalos protokoll/séma, Streamer.bot action/queue minták, StreamElements overlay/browser-source/alert biztonsági minták, provider API scope/kvóta/policy. Ezek nem jelentenek kötelező függőséget vagy átvett forráskódot.

**Forrásminták (funkciókutatás):** https://docs.streamer.bot/guide/core/actions ; https://docs.streamelements.com/overlays ; https://docs.streamelements.com/selive/guides/overlays-and-alerts .


---

## 76. TELJES MODULONKÉNTI VÉGREHAJTÁSI SPECIFIKÁCIÓ — KÖTELEZŐ TERMÉKSZERZŐDÉSEK
**Státusz:** részletes termékkövetelmény, nem kész implementáció. A 3., 24., 49., 54., 56–75. fejezet meglévő ID-it és kanonikus tulajdonosait részletezi. Nem hoz létre új Editor core-t, adatgazdát vagy külön tervet. A streamer/creator/brand teljes kör, OBS, YouTube, TikTok, Discord, shop, monetizáció, AI és SaaS mind a céltermék része, a fázisok csak az építési sorrendet adják.

### 76.0. Egységes definíció minden egyes alfunkcióhoz
Az alábbi modulonkénti sorok teljesítése **minden** önálló feladatra külön-külön kötelező: stabil feature ID / szülő ID; felhasználói probléma és sikeres út; tulajdonos domain; Admin / Editor / public belépési pont; adatmodell és migráció; szerveroldali API és esemény; hitelesítés és site/workspace-scope; hiba-, várakozó-, üres-, retry- és disabled állapot; mobil, billentyűzet és képernyőolvasó; provider capability és licence ahol van; adatvédelmi/retention szabály; feature flag, rollback és költségplafon; unit/integration/E2E/negatív teszt. Nem létező vagy nem tesztelt funkció nem jelölhető késznek.
**Specifikációs példányosítás:** a következő minden sorból a fejlesztéskor külön DB/API/UI/test részfeladat keletkezik. A szerződések nem jogosítanak fel egyszerre történő implementációra; az aktív pont F0.1 marad.

### 76.01. Platformmag és site ownership
**Kanonikus owner:** Platform Core. **Elsődleges folyamat és bontandó képességek:** workspace/site/owner és kanonikus erőforrás-határok; aktív site választása; több site előkészítés.
**Adat/API/esemény szerződés:** site-azonosító minden D1 üzleti sorban; domain action API; audit és idempotencia.
**Elfogadási minimum / negatív próbák:** tenant izoláció; migráció rollback; két site kereszthozzáférés tiltása.
**Kötelező építési szeletek:** (1) létező kód és stabil ID ellenőrzése; (2) adat-/esemény-/jogosultsági szerződés; (3) API/domain command; (4) Admin kezelőfelület; (5) Editor/publikus kapcsolódás csak szükség esetén; (6) loading/empty/error/retry/mobil/a11y; (7) unit, integration, cross-site és E2E; (8) dokumentált rollback és telemetria.

### 76.02. Creator onboarding és márkaindítás
**Kanonikus owner:** Admin. **Elsődleges folyamat és bontandó képességek:** regisztráció / belépés → creator profil → brand → site → starter kit → preview → publikálás; megszakított onboarding folytatása.
**Adat/API/esemény szerződés:** site-profil, onboarding-progress, modulválasztás, starter kit manifest.
**Elfogadási minimum / negatív próbák:** új creator Twitch nélkül publikál; elhagyott varázsló adatot nem veszít.
**Kötelező építési szeletek:** (1) létező kód és stabil ID ellenőrzése; (2) adat-/esemény-/jogosultsági szerződés; (3) API/domain command; (4) Admin kezelőfelület; (5) Editor/publikus kapcsolódás csak szükség esetén; (6) loading/empty/error/retry/mobil/a11y; (7) unit, integration, cross-site és E2E; (8) dokumentált rollback és telemetria.

### 76.03. Admin shell és feladatközpont
**Kanonikus owner:** Admin. **Elsődleges folyamat és bontandó képességek:** modulcsoportok, keresés, parancspaletta, gyorsműveletek, üres/hiba/stale állapot, értesítés.
**Adat/API/esemény szerződés:** kanonikus modul-regiszter, capability-aware menü, jogosultság-szűrés.
**Elfogadási minimum / negatív próbák:** mobil navigáció, billentyűzet, screen reader, jogosulatlan link tiltva.
**Kötelező építési szeletek:** (1) létező kód és stabil ID ellenőrzése; (2) adat-/esemény-/jogosultsági szerződés; (3) API/domain command; (4) Admin kezelőfelület; (5) Editor/publikus kapcsolódás csak szükség esetén; (6) loading/empty/error/retry/mobil/a11y; (7) unit, integration, cross-site és E2E; (8) dokumentált rollback és telemetria.

### 76.04. Identitás, jogosultság és biztonság
**Kanonikus owner:** Identity. **Elsődleges folyamat és bontandó képességek:** account recovery, MFA, session revoke, meghívók, site szerepkörök, sensitive action reauth.
**Adat/API/esemény szerződés:** szerveroldali RBAC/ABAC; audit, authz minden mutationnél; titokkezelés.
**Elfogadási minimum / negatív próbák:** cross-site API 403, expirált session, CSRF, role escalation negatív teszt.
**Kötelező építési szeletek:** (1) létező kód és stabil ID ellenőrzése; (2) adat-/esemény-/jogosultsági szerződés; (3) API/domain command; (4) Admin kezelőfelület; (5) Editor/publikus kapcsolódás csak szükség esetén; (6) loading/empty/error/retry/mobil/a11y; (7) unit, integration, cross-site és E2E; (8) dokumentált rollback és telemetria.

### 76.05. Webhely- és domainkezelés
**Kanonikus owner:** Website. **Elsődleges folyamat és bontandó képességek:** site alapadat, slug, navigáció, domain, DNS-ellenőrzés, HTTPS, előnézeti domain.
**Adat/API/esemény szerződés:** site settings, route registry, redirects, domain ownership verification.
**Elfogadási minimum / negatív próbák:** slug collision, domain takeover, canonical redirect, 404, preview leak teszt.
**Kötelező építési szeletek:** (1) létező kód és stabil ID ellenőrzése; (2) adat-/esemény-/jogosultsági szerződés; (3) API/domain command; (4) Admin kezelőfelület; (5) Editor/publikus kapcsolódás csak szükség esetén; (6) loading/empty/error/retry/mobil/a11y; (7) unit, integration, cross-site és E2E; (8) dokumentált rollback és telemetria.

### 76.06. Page Model és Visual Editor
**Kanonikus owner:** Website/Editor. **Elsődleges folyamat és bontandó képességek:** oldalfa, canvas, layer tree, Inspector, grid/flex, drag/resize, snap, zoom, history, responsive, accessibility.
**Adat/API/esemény szerződés:** strukturált Page Model, operation schema, revision/version lock, property registry.
**Elfogadási minimum / negatív próbák:** undo/redo konzisztens; offline/409 mentési hiba után nincs adatvesztés.
**Kötelező építési szeletek:** (1) létező kód és stabil ID ellenőrzése; (2) adat-/esemény-/jogosultsági szerződés; (3) API/domain command; (4) Admin kezelőfelület; (5) Editor/publikus kapcsolódás csak szükség esetén; (6) loading/empty/error/retry/mobil/a11y; (7) unit, integration, cross-site és E2E; (8) dokumentált rollback és telemetria.

### 76.07. Publikálás és release kezelés
**Kanonikus owner:** Publishing. **Elsődleges folyamat és bontandó képességek:** draft mentés, preview, validation, approval, publish, schedule, unpublish, rollback, cache purge.
**Adat/API/esemény szerződés:** külön immutable published snapshot + atomic pointer, optimistic revision control.
**Elfogadási minimum / negatív próbák:** konkurens publish, félbeszakadt művelet, anonymous draft leak, rollback és stale cache teszt.
**Kötelező építési szeletek:** (1) létező kód és stabil ID ellenőrzése; (2) adat-/esemény-/jogosultsági szerződés; (3) API/domain command; (4) Admin kezelőfelület; (5) Editor/publikus kapcsolódás csak szükség esetén; (6) loading/empty/error/retry/mobil/a11y; (7) unit, integration, cross-site és E2E; (8) dokumentált rollback és telemetria.

### 76.08. Brand Kit és témák
**Kanonikus owner:** Design System. **Elsődleges folyamat és bontandó képességek:** logó, favicon, tipográfia, színskála, spacing, dark/light, font, motion, token variáns.
**Adat/API/esemény szerződés:** globális token registry, lokális override, token usage graph.
**Elfogadási minimum / negatív próbák:** token változás minden hivatkozó helyen látszik; leválasztott elem változatlan.
**Kötelező építési szeletek:** (1) létező kód és stabil ID ellenőrzése; (2) adat-/esemény-/jogosultsági szerződés; (3) API/domain command; (4) Admin kezelőfelület; (5) Editor/publikus kapcsolódás csak szükség esetén; (6) loading/empty/error/retry/mobil/a11y; (7) unit, integration, cross-site és E2E; (8) dokumentált rollback és telemetria.

### 76.09. Sablonok, presetek, komponensek
**Kanonikus owner:** Templates. **Elsődleges folyamat és bontandó képességek:** site kit, page, section, layout, synced symbol, detached preset, template galéria, import/export.
**Adat/API/esemény szerződés:** versioned manifest, prop schema, dependency resolver, semver migráció, preview/diff/rollback.
**Elfogadási minimum / negatív próbák:** frissítés nem írja felül saját tartalmat; inkompatibilis template blokkolva.
**Kötelező építési szeletek:** (1) létező kód és stabil ID ellenőrzése; (2) adat-/esemény-/jogosultsági szerződés; (3) API/domain command; (4) Admin kezelőfelület; (5) Editor/publikus kapcsolódás csak szükség esetén; (6) loading/empty/error/retry/mobil/a11y; (7) unit, integration, cross-site és E2E; (8) dokumentált rollback és telemetria.

### 76.10. CMS és dinamikus tartalom
**Kanonikus owner:** Content. **Elsődleges folyamat és bontandó képességek:** tartalomtípus, mező, collection, referenciák, kategóriák, filterek, workflow és locale.
**Adat/API/esemény szerződés:** typed content schema, validation, localization, draft/published binding.
**Elfogadási minimum / negatív próbák:** törölt referencia fallback; verzióütközés; nyelvspecifikus publish teszt.
**Kötelező építési szeletek:** (1) létező kód és stabil ID ellenőrzése; (2) adat-/esemény-/jogosultsági szerződés; (3) API/domain command; (4) Admin kezelőfelület; (5) Editor/publikus kapcsolódás csak szükség esetén; (6) loading/empty/error/retry/mobil/a11y; (7) unit, integration, cross-site és E2E; (8) dokumentált rollback és telemetria.

### 76.11. Médiatár és asset pipeline
**Kanonikus owner:** Media. **Elsődleges folyamat és bontandó képességek:** feltöltés, chunk/retry, képszerkesztés, thumbnail, alt text, font és ikon, licenc, használati térkép.
**Adat/API/esemény szerződés:** D1 metadata + R2 binary, checksum/dedupe, signed reads/uploads, lifecycle.
**Elfogadási minimum / negatív próbák:** nem megengedett MIME, idegen tenant asset, félbeszakadt feltöltés, függő törlés tiltva.
**Kötelező építési szeletek:** (1) létező kód és stabil ID ellenőrzése; (2) adat-/esemény-/jogosultsági szerződés; (3) API/domain command; (4) Admin kezelőfelület; (5) Editor/publikus kapcsolódás csak szükség esetén; (6) loading/empty/error/retry/mobil/a11y; (7) unit, integration, cross-site és E2E; (8) dokumentált rollback és telemetria.

### 76.12. Űrlap, lead, hírlevél
**Kanonikus owner:** Website/Content. **Elsődleges folyamat és bontandó képességek:** kapcsolat, ajánlatkérés, feliratkozás, inputvalidáció, honeypot/rate limit, értesítés, export.
**Adat/API/esemény szerződés:** form schema, submission encryption/redaction, consent log, retention, provider adapter.
**Elfogadási minimum / negatív próbák:** spam, XSS, CSRF, double-submit, opt-out, jogosulatlan beküldés-listázás tiltva.
**Kötelező építési szeletek:** (1) létező kód és stabil ID ellenőrzése; (2) adat-/esemény-/jogosultsági szerződés; (3) API/domain command; (4) Admin kezelőfelület; (5) Editor/publikus kapcsolódás csak szükség esetén; (6) loading/empty/error/retry/mobil/a11y; (7) unit, integration, cross-site és E2E; (8) dokumentált rollback és telemetria.

### 76.13. SEO, keresés, lokalizáció
**Kanonikus owner:** Website. **Elsődleges folyamat és bontandó képességek:** sitemap, robots, OG, canonical, structured data, redirects, hreflang, keresési index.
**Adat/API/esemény szerződés:** per-locale meta, slug és canonical rules, build/publish validation.
**Elfogadási minimum / negatív próbák:** duplikált canonical, broken links, hiányzó fordítás fallback, noindex tesztek.
**Kötelező építési szeletek:** (1) létező kód és stabil ID ellenőrzése; (2) adat-/esemény-/jogosultsági szerződés; (3) API/domain command; (4) Admin kezelőfelület; (5) Editor/publikus kapcsolódás csak szükség esetén; (6) loading/empty/error/retry/mobil/a11y; (7) unit, integration, cross-site és E2E; (8) dokumentált rollback és telemetria.

### 76.14. Integrációk és fiókkapcsolatok
**Kanonikus owner:** Integrations. **Elsődleges folyamat és bontandó képességek:** OAuth connect/reconnect/revoke, provider capability list, scope magyarázat, sync és quotas.
**Adat/API/esemény szerződés:** provider adapter, token vault, EventSub/webhook signature, subscription lifecycle.
**Elfogadási minimum / negatív próbák:** lejárt token, scope hiány, több site összekötési tiltás, idempotens webhook.
**Kötelező építési szeletek:** (1) létező kód és stabil ID ellenőrzése; (2) adat-/esemény-/jogosultsági szerződés; (3) API/domain command; (4) Admin kezelőfelület; (5) Editor/publikus kapcsolódás csak szükség esetén; (6) loading/empty/error/retry/mobil/a11y; (7) unit, integration, cross-site és E2E; (8) dokumentált rollback és telemetria.

### 76.15. Twitch, YouTube, TikTok, Kick, Discord
**Kanonikus owner:** Integrations. **Elsődleges folyamat és bontandó képességek:** platformonként csatorna, live/video/social capability, upload/sync, közösségi értesítés.
**Adat/API/esemény szerződés:** feature matrix provider verzió és engedély szerint; webhooks; policy gates.
**Elfogadási minimum / negatív próbák:** engedély nélküli publish tiltva; quota és részleges hiba látható.
**Kötelező építési szeletek:** (1) létező kód és stabil ID ellenőrzése; (2) adat-/esemény-/jogosultsági szerződés; (3) API/domain command; (4) Admin kezelőfelület; (5) Editor/publikus kapcsolódás csak szükség esetén; (6) loading/empty/error/retry/mobil/a11y; (7) unit, integration, cross-site és E2E; (8) dokumentált rollback és telemetria.

### 76.16. Stream Studio és OBS
**Kanonikus owner:** Stream Studio. **Elsődleges folyamat és bontandó képességek:** live dashboard, health, OBS-bridge, scene/source/mixer, előadási profil, go-live checklist.
**Adat/API/esemény szerződés:** paired local agent/bridge, outbound secured channel, state/event contract.
**Elfogadási minimum / negatív próbák:** helyi OBS offline nem zöld; jogosulatlan stream action tiltva.
**Kötelező építési szeletek:** (1) létező kód és stabil ID ellenőrzése; (2) adat-/esemény-/jogosultsági szerződés; (3) API/domain command; (4) Admin kezelőfelület; (5) Editor/publikus kapcsolódás csak szükség esetén; (6) loading/empty/error/retry/mobil/a11y; (7) unit, integration, cross-site és E2E; (8) dokumentált rollback és telemetria.

### 76.17. Overlay Studio és widgetek
**Kanonikus owner:** Overlay Studio. **Elsődleges folyamat és bontandó képességek:** canvas, browser source, event list, alerts, chat, stream goal, countdown, scene preset.
**Adat/API/esemény szerződés:** overlay version/snapshot, signed session access, render sandbox, theme tokens.
**Elfogadási minimum / negatív próbák:** anon admin API elérés tiltva; test event nem éles adat; active overlay rollback.
**Kötelező építési szeletek:** (1) létező kód és stabil ID ellenőrzése; (2) adat-/esemény-/jogosultsági szerződés; (3) API/domain command; (4) Admin kezelőfelület; (5) Editor/publikus kapcsolódás csak szükség esetén; (6) loading/empty/error/retry/mobil/a11y; (7) unit, integration, cross-site és E2E; (8) dokumentált rollback és telemetria.

### 76.18. Makrók és automatizált akciók
**Kanonikus owner:** Automation. **Elsődleges folyamat és bontandó képességek:** macro deck, hotkey, MIDI, Stream Deck, action graph, subflow, variables, retries, concurrency.
**Adat/API/esemény szerződés:** trigger-condition-action DAG, permission typed args, job execution log, kill-switch.
**Elfogadási minimum / negatív próbák:** végtelen ciklus kizárva; dry run side effect nélkül; retry idempotens.
**Kötelező építési szeletek:** (1) létező kód és stabil ID ellenőrzése; (2) adat-/esemény-/jogosultsági szerződés; (3) API/domain command; (4) Admin kezelőfelület; (5) Editor/publikus kapcsolódás csak szükség esetén; (6) loading/empty/error/retry/mobil/a11y; (7) unit, integration, cross-site és E2E; (8) dokumentált rollback és telemetria.

### 76.19. Chatbot és közönséginterakció
**Kanonikus owner:** Community/Stream. **Elsődleges folyamat és bontandó képességek:** chatparancs, moderáció, loyalty, queue, poll, giveaway, channel points, shoutout.
**Adat/API/esemény szerződés:** provider capability + normalized event + consent + abuse protection.
**Elfogadási minimum / negatív próbák:** dupla jutalom nincs; role check, cooldown és anti-spam; provider fallback.
**Kötelező építési szeletek:** (1) létező kód és stabil ID ellenőrzése; (2) adat-/esemény-/jogosultsági szerződés; (3) API/domain command; (4) Admin kezelőfelület; (5) Editor/publikus kapcsolódás csak szükség esetén; (6) loading/empty/error/retry/mobil/a11y; (7) unit, integration, cross-site és E2E; (8) dokumentált rollback és telemetria.

### 76.20. Adásrend, játékprofilok, események
**Kanonikus owner:** Schedule. **Elsődleges folyamat és bontandó képességek:** naptár, recurrence, timezone/DST, játékprofil, Twitch-szinkron, manual override.
**Adat/API/esemény szerződés:** kanonikus schedule_items, provider sync checkpoint, conflict policy.
**Elfogadási minimum / negatív próbák:** DST és recurring exception, kétirányú sync conflict, publikus render konzisztens.
**Kötelező építési szeletek:** (1) létező kód és stabil ID ellenőrzése; (2) adat-/esemény-/jogosultsági szerződés; (3) API/domain command; (4) Admin kezelőfelület; (5) Editor/publikus kapcsolódás csak szükség esetén; (6) loading/empty/error/retry/mobil/a11y; (7) unit, integration, cross-site és E2E; (8) dokumentált rollback és telemetria.

### 76.21. Content Studio és kampánynaptár
**Kanonikus owner:** Content. **Elsődleges folyamat és bontandó képességek:** ötletek, briefek, státuszok, együttműködés, content variants, publikálási queue.
**Adat/API/esemény szerződés:** content item/variant/asset kapcsolat, review workflow, publication jobs.
**Elfogadási minimum / negatív próbák:** részleges publikálás nem zöld; ismételt queue futás nem duplikál.
**Kötelező építési szeletek:** (1) létező kód és stabil ID ellenőrzése; (2) adat-/esemény-/jogosultsági szerződés; (3) API/domain command; (4) Admin kezelőfelület; (5) Editor/publikus kapcsolódás csak szükség esetén; (6) loading/empty/error/retry/mobil/a11y; (7) unit, integration, cross-site és E2E; (8) dokumentált rollback és telemetria.

### 76.22. VOD, klip, Shorts és videó workflow
**Kanonikus owner:** Video. **Elsődleges folyamat és bontandó képességek:** import, transzkripció, fejezetek, clip range, felirat, thumbnail, vertical crop, encode, export.
**Adat/API/esemény szerződés:** asset/job/transcode pipeline, media rights, storage lifecycle, result validation.
**Elfogadási minimum / negatív próbák:** félbeszakadt transcode resume; nincs public publish jóváhagyás nélkül.
**Kötelező építési szeletek:** (1) létező kód és stabil ID ellenőrzése; (2) adat-/esemény-/jogosultsági szerződés; (3) API/domain command; (4) Admin kezelőfelület; (5) Editor/publikus kapcsolódás csak szükség esetén; (6) loading/empty/error/retry/mobil/a11y; (7) unit, integration, cross-site és E2E; (8) dokumentált rollback és telemetria.

### 76.23. Social publikálás és cross-post
**Kanonikus owner:** Content/Social. **Elsődleges folyamat és bontandó képességek:** YouTube/TikTok/Discord/egyéb posztok előkészítése, preview, ütemezés, státusz.
**Adat/API/esemény szerződés:** provider-specific capability, approval, idempotent posting, retry with backoff.
**Elfogadási minimum / negatív próbák:** platform policy, OAuth scope, quota, nem támogatott mód megfelelő jelzés.
**Kötelező építési szeletek:** (1) létező kód és stabil ID ellenőrzése; (2) adat-/esemény-/jogosultsági szerződés; (3) API/domain command; (4) Admin kezelőfelület; (5) Editor/publikus kapcsolódás csak szükség esetén; (6) loading/empty/error/retry/mobil/a11y; (7) unit, integration, cross-site és E2E; (8) dokumentált rollback és telemetria.

### 76.24. Közösség, rajongók és moderáció
**Kanonikus owner:** Community. **Elsődleges folyamat és bontandó képességek:** fan accounts, comments, posts, reactions, notifications, reporting, community events.
**Adat/API/esemény szerződés:** public/private/member scopes, moderation queues, abuse controls, role mapping.
**Elfogadási minimum / negatív próbák:** cross-tenant fan-data tiltva; moderation appeals; deletion privacy.
**Kötelező építési szeletek:** (1) létező kód és stabil ID ellenőrzése; (2) adat-/esemény-/jogosultsági szerződés; (3) API/domain command; (4) Admin kezelőfelület; (5) Editor/publikus kapcsolódás csak szükség esetén; (6) loading/empty/error/retry/mobil/a11y; (7) unit, integration, cross-site és E2E; (8) dokumentált rollback és telemetria.

### 76.25. Tagság és támogatások
**Kanonikus owner:** Membership. **Elsődleges folyamat és bontandó képességek:** tier, perks, access, renewal, cancel, failed payments, tips, goals, Discord roles.
**Adat/API/esemény szerződés:** entitlement source-of-truth, signed provider webhook, chargeback state.
**Elfogadási minimum / negatív próbák:** refunded purchase access revoked; webhook replay nem növel kétszer.
**Kötelező építési szeletek:** (1) létező kód és stabil ID ellenőrzése; (2) adat-/esemény-/jogosultsági szerződés; (3) API/domain command; (4) Admin kezelőfelület; (5) Editor/publikus kapcsolódás csak szükség esetén; (6) loading/empty/error/retry/mobil/a11y; (7) unit, integration, cross-site és E2E; (8) dokumentált rollback és telemetria.

### 76.26. Merch, webshop, digitális termék
**Kanonikus owner:** Commerce. **Elsődleges folyamat és bontandó képességek:** products, variants, cart, checkout provider, orders, coupons, shipping, fulfillment, digital delivery.
**Adat/API/esemény szerződés:** order/payments state machine, inventory reservation, accounting hooks.
**Elfogadási minimum / negatív próbák:** dupla payment nem dupláz rendelést; downloads jogosultsággal.
**Kötelező építési szeletek:** (1) létező kód és stabil ID ellenőrzése; (2) adat-/esemény-/jogosultsági szerződés; (3) API/domain command; (4) Admin kezelőfelület; (5) Editor/publikus kapcsolódás csak szükség esetén; (6) loading/empty/error/retry/mobil/a11y; (7) unit, integration, cross-site és E2E; (8) dokumentált rollback és telemetria.

### 76.27. Szponzoráció, media kit, lead pipeline
**Kanonikus owner:** Business. **Elsődleges folyamat és bontandó képességek:** media kit, deal pipeline, kampányok, deliverable-ek, rate card, deadline, report.
**Adat/API/esemény szerződés:** deal/campaign contracts, private data ACL, link attribution, reports.
**Elfogadási minimum / negatív próbák:** nem nyilvános tárgyalás nem látható public site-on.
**Kötelező építési szeletek:** (1) létező kód és stabil ID ellenőrzése; (2) adat-/esemény-/jogosultsági szerződés; (3) API/domain command; (4) Admin kezelőfelület; (5) Editor/publikus kapcsolódás csak szükség esetén; (6) loading/empty/error/retry/mobil/a11y; (7) unit, integration, cross-site és E2E; (8) dokumentált rollback és telemetria.

### 76.28. Analitika, mérés és növekedés
**Kanonikus owner:** Analytics. **Elsődleges folyamat és bontandó képességek:** web, stream, content, kampány, conversion, membership és shop dashboard; privacy.
**Adat/API/esemény szerződés:** metric schema source+freshness+consent+window, aggregation, export.
**Elfogadási minimum / negatív próbák:** hiányzó adat nem nulla; consent/offline/cross-tenant teszt.
**Kötelező építési szeletek:** (1) létező kód és stabil ID ellenőrzése; (2) adat-/esemény-/jogosultsági szerződés; (3) API/domain command; (4) Admin kezelőfelület; (5) Editor/publikus kapcsolódás csak szükség esetén; (6) loading/empty/error/retry/mobil/a11y; (7) unit, integration, cross-site és E2E; (8) dokumentált rollback és telemetria.

### 76.29. SANCI AI és intelligens segédek
**Kanonikus owner:** AI. **Elsődleges folyamat és bontandó képességek:** brand, page, content, stream, VOD, caption, clip, moderation javaslat; emberi kontroll.
**Adat/API/esemény szerződés:** model/provider adapter, RAG tenant scope, cost meter, approval ledger, structured mutations.
**Elfogadási minimum / negatív próbák:** prompt injection, private data leak, runaway cost és auto-publish tiltva.
**Kötelező építési szeletek:** (1) létező kód és stabil ID ellenőrzése; (2) adat-/esemény-/jogosultsági szerződés; (3) API/domain command; (4) Admin kezelőfelület; (5) Editor/publikus kapcsolódás csak szükség esetén; (6) loading/empty/error/retry/mobil/a11y; (7) unit, integration, cross-site és E2E; (8) dokumentált rollback és telemetria.

### 76.30. Értesítések és háttérmunkák
**Kanonikus owner:** Operations. **Elsődleges folyamat és bontandó képességek:** in-app/email/push (opt-in), scheduled job, retry, dead-letter, support alert.
**Adat/API/esemény szerződés:** events/jobs, idempotency, audit, delivery preferences.
**Elfogadási minimum / negatív próbák:** dupla esemény nem kétszer küld; hibás job visszakövethető.
**Kötelező építési szeletek:** (1) létező kód és stabil ID ellenőrzése; (2) adat-/esemény-/jogosultsági szerződés; (3) API/domain command; (4) Admin kezelőfelület; (5) Editor/publikus kapcsolódás csak szükség esetén; (6) loading/empty/error/retry/mobil/a11y; (7) unit, integration, cross-site és E2E; (8) dokumentált rollback és telemetria.

### 76.31. SaaS, billing és workspace-ek
**Kanonikus owner:** SaaS. **Elsődleges folyamat és bontandó képességek:** self-service signup, plans, trial, entitlements, usage/metering, upgrade/downgrade, cancellation.
**Adat/API/esemény szerződés:** multi-tenant isolation, subscription state, billing adapter, quota guards, costs.
**Elfogadási minimum / negatív próbák:** nem fizető nem kap premium actiont; downgrade adatvesztés nélkül.
**Kötelező építési szeletek:** (1) létező kód és stabil ID ellenőrzése; (2) adat-/esemény-/jogosultsági szerződés; (3) API/domain command; (4) Admin kezelőfelület; (5) Editor/publikus kapcsolódás csak szükség esetén; (6) loading/empty/error/retry/mobil/a11y; (7) unit, integration, cross-site és E2E; (8) dokumentált rollback és telemetria.

### 76.32. Marketplace, API és kiterjesztések
**Kanonikus owner:** Developer. **Elsődleges folyamat és bontandó képességek:** template/widget/plugin install, version, marketplace review, API keys, webhook tester.
**Adat/API/esemény szerződés:** signed manifest, sandbox, permission scopes, trust review, API versioning.
**Elfogadási minimum / negatív próbák:** rosszindulatú plugin nem kaphat secretet; uninstall recovery.
**Kötelező építési szeletek:** (1) létező kód és stabil ID ellenőrzése; (2) adat-/esemény-/jogosultsági szerződés; (3) API/domain command; (4) Admin kezelőfelület; (5) Editor/publikus kapcsolódás csak szükség esetén; (6) loading/empty/error/retry/mobil/a11y; (7) unit, integration, cross-site és E2E; (8) dokumentált rollback és telemetria.

### 76.33. Üzemeltetés, hozzáférhetőség, adatvédelem
**Kanonikus owner:** Quality. **Elsődleges folyamat és bontandó képességek:** monitoring, backup restore, WCAG, mobile, i18n, incident, logging, support, deletion.
**Adat/API/esemény szerződés:** SLO, test pyramid, release gates, privacy retention, disaster recovery.
**Elfogadási minimum / negatív próbák:** restore drill; keyboard coverage; secret redaction; incident rollback.
**Kötelező építési szeletek:** (1) létező kód és stabil ID ellenőrzése; (2) adat-/esemény-/jogosultsági szerződés; (3) API/domain command; (4) Admin kezelőfelület; (5) Editor/publikus kapcsolódás csak szükség esetén; (6) loading/empty/error/retry/mobil/a11y; (7) unit, integration, cross-site és E2E; (8) dokumentált rollback és telemetria.

### 76.34. Keresztmodulú végponttól végpontig acceptance forgatókönyvek
1. **Streamer:** brand site kit → Twitch csatlakozás → schedule → játékprofil → dinamikus weboldal widget → preview → publish → live event → OBS overlay → alert/makró → VOD/klip → YouTube/TikTok publikálási előkészítés. Sikertelen provider esetén részleges, megmagyarázott állapot, adatvesztés nélkül.
2. **Creator:** saját brand → oldalsablon → videógyűjtemény → YouTube + TikTok → tartalomnaptár → időzítés → publikálás → analitika → közösségi CTA; provider-engedély hiánya blokkolja az adott akciót, nem a teljes brand-oldalt.
3. **Monetizáció:** látogató → shop/membership → provider checkout → verified webhook → rendelés/entitlement → letöltés/Discord role → refund/revoke; ismételt webhook idempotens.
4. **AI:** szerkesztő prompt → hozzáférésellenőrzött javaslat → schema validáció → diff → draft → felhasználói jóváhagyás → publikus publish; AI semmilyen titokhoz vagy idegen site-hoz nem fér.
5. **SaaS:** új tenant → saját site → sablon → publikálás → tervcsomag és kvóta → usage metering → downgrade → export/delete; más tenant beállításai és objektumai nem elérhetők.
6. **Recovery:** két tab revision conflict → egyértelmű merge/restore; deploy közbeni publish megszakítás → utolsó konzisztens snapshot; R2 megszakított feltöltés → retry/dedupe; expired OAuth → helyes reconnect.

### 76.35. Átadásra alkalmas fázis- és függőségi lánc
**F0** aktuális kód/repo baseline, jogosultság, Admin és Page Model; F0.2 save-reload+revision; F0.3 preview-publish atomicity és rollback. **F1** Site Manager + Visual Editor alap, navigáció, responsive, SEO. **F2** Brand Kit + Media + template + preset + reusable component + CMS. **F3** Twitch/YouTube/TikTok/Discord/Kick provider adapter alapok és adásrend; a konkrét képesség az aktuális provider policytól függ. **F4** OBS local bridge, Overlay Studio, chat, macro, alert, Stream Studio. **F5** Content Studio, VOD/clip/shorts, publishing pipeline. **F6** közösség, támogatás, tagság, merch/shop, szponzoráció. **F7** analitika, automatizáció, kampányok. **F8** SANCI AI és multimodális feldolgozás költség- és jóváhagyásvédelemmel. **F9** önkiszolgáló multi-tenant SaaS, billing, marketplace; az F0-tól már minden adat site-scope-ot és jövőbeni kvóta/metering csatlakozási pontot követ. A fázis nem egyenlő kihagyott funkcióval.
**Fáziskapu:** minden kiadásra számszerű vagy eldönthető PASS/FAIL teszt; a függő API/domain/core/migráció PASS-ja előtt UI nem jelölhető késznek; a marketing nem állíthat többet a tesztelt éles képességnél.

### 76.36. Kiegészítő, könnyen kihagyható minőségi és üzleti követelmények
- Támogatott böngészők, reszponzív minimumok, képernyőolvasó és csökkentett mozgás; nyílt forrás és fontikon licencek; képek, videók és zenék felhasználási jogai.
- Privacy: cookie/consent, adatportabilitás, törlés, felhasználói export, megőrzési idők, űrlap spam és moderáció; EU adatkezelési vizsgálat külön release gate.
- Árazás: R2/streaming egress, D1 tárolás/lekérdezés, Workers CPU, queues/AI token/video transcode, email, payment díjak; csomagonként soft/hard quota és abuse védelem.
- Támogatás: in-app help, státuszoldal, belső issue azonosító, self-service recovery, visszaállítási gyakorlat, SLA/SLO és üzleti kritikus hibák eszkalációja.
- Accessibility/SEO/performance közös release gate; adatforrás-frissesség és félkész modulok korrekt feliratozása.
- Nem építünk párhuzamos admin CRUD-ot, második oldalmodellt, második integrációs tokenboltot vagy független template rendszert.

### 76.37. A MASTER feltöltési és folytatási szabálya
Az egyetlen feltöltendő fájl a repository `v2/foundation` ágán: `docs/SANCI9517-CREATOR-PLATFORM-PLAN.md`. Az 0–75. fejezethez hozzáadott 76. fejezet a korábbi stabil követelményeket nem helyettesíti. **Aktív végrehajtási pont: `F0.1-VERIFIED-BASELINE`**. A tervezési bejegyzés PASS-ja nem implementációs vagy production PASS. A régi audit nem automatikus fejlesztési blokkoló, a HIGH publish conflict viszont marad, amíg a konkrét negatív tesztek nem igazolják a javítást.


---

## 77. VÉGLEGES ÁTADÁSI SZERZŐDÉS — EGY TERV, EGY AKTÍV PONT, VALÓS FEJLESZTÉS

### 77.1. Termékcél és korlát
A platform elsődleges piaca: **streamerek és digitális tartalomkészítők**, akik egyedi publikus brandwebhelyet, videókat, közösséget, élő közvetítést, kapcsolataikat, támogatást, webshopot, merchöt és üzleti folyamataikat egyetlen, feladatalapú Adminból kezelik. A Twitch, YouTube, TikTok, Discord, Kick, OBS, chat, alert, overlay, makró, Stream Studio, Content Studio, VOD, Shorts, média, SEO, sablon/preset/Brand Kit, community, shop, membership, analytics, AI, automation, SaaS, billing és marketplace **mind a teljes céltermék részei**. A saját brandwebhely streaming nélkül is használható. Általános fotós-, éttermi, szállás- és vállalkozói iparágspecifikus verticalok nem kötelező első kiadási scope-ok; később a közös site/CMS/template magot bővíthetik. A fázisolás kizárólag szállítási sorrend, nem funkciótörlés.

### 77.2. Egyetlen irányadó modulrendszer
A 49. fejezet 22 felhasználói főmodulja az Admin kanonikus navigációja. A 24. fejezet 396 stabil funkcióazonosítója a megőrzendő elsődleges index. Az 54., 56–57., 64–76. fejezetek *ugyanazon képességek* részletei és kibővített szerződései, nem párhuzamos új termék- vagy domainmodellek. Egy funkció tulajdonosa egy domain; több felületen megjelenő gyorsműveletek és komponensek ugyanarra az API-ra mutatnak. A Page, Overlay és Video Editor külön feladatszerkesztők; közös Brand Kit, Media Library, Design Tokens és jogosultsági szerződés használható.

### 77.3. Kiadási sorrend és kötelező PASS-kapuk
| Lépés | Felhasználói eredmény | Előfeltétel és elfogadás |
|---|---|---|
| F0.1 | Aktuális GitHub/Worker/D1/Admin/Auth/Page/Editor baseline ismert | HEAD, route-ok, D1 migrációk, permission és `npm run typecheck`, érintett unit/contract tesztek tényleges futtatási jegyzéke; ismeretlen státusz `UNVERIFIED` |
| F0.2 | Admin → Editor → mentés → újratöltés adatvesztés nélkül | Revision conflict, hálózati hiba, két fül, history/undo és jogosultság negatív teszt |
| F0.3 | Draft → preview → publish → public és rollback | Atomic published snapshot, HIGH publish conflict feloldás valós teszttel, publikus és illetéktelen szerepkör teszt |
| F1 | Site Manager, több oldal, navigáció, valódi reszponzív Page Editor | Üres/hiba/mobil/billentyűzetes állapot, stabil Page Model |
| F2 | Brand Kit, design tokenek, sablon/preset/ikon/komponens, Médiatár | Global vs detached instance, manifest/migration/preview, R2/D1 ownership és használati hivatkozás |
| F3 | CMS, SEO, domain, lokalizáció és publikálható brandwebhely | Típusos dinamikus kötés, slug/canonical/sitemap, preview, restore, privacy/consent |
| F4 | Integrációk + Twitch/YouTube/TikTok/Discord/Kick + adásrend/játékprofil | Provider capability/scope, tokenkezelés, limit/reconnect/sync, nem támogatott akció jelzése |
| F5 | Stream Studio, OBS, overlayek, alert-ek, chatbot, makrók, Stream Deck | Élő biztonság, trigger/condition/action, retry/idempotencia, kill switch, helyi bridge threat model |
| F6 | Content Studio, VOD, klip, Short, social publikálás | Médiafeldolgozó queue, platformvariáns, review, retry, jogok és kimeneti ellenőrzés |
| F7 | Rajongók, moderáció, tagság, támogatás, shop, merch, digitális termék | Verified provider webhook, entitlement, order/fulfillment, refund és cross-tenant isolation |
| F8 | Analitika, kampány, szponzoráció és creator business | Provenance, freshness, consent, KPI/revenue definíció, export, nem kitalált metrikák |
| F9 | Automatizáció és SANCI AI munkafolyamatok | Human approval, schema-validált action, redaction, idempotencia, usage/money quota, audit |
| F10 | Önkiszolgáló Creator SaaS, csapat, multi-site, billing és kvóták | Tenantizoláció, support/export, upgrade/downgrade, metering és költségvédelmi leállítás |
| F11 | Marketplace, bővítmények, skálázás és nemzetközi terjeszkedés | Security/licence review, kompatibilitás, moderation, szolgáltatási SLO és visszaállíthatóság |

A fázisokon belüli meglévő részfeladat-ID-k és a 71/73/75/76. fejezet acceptance szerződései érvényesek. Egy fázis csak az előző ténylegesen releváns, igazolt függőségeire épülhet. A tervezett funkciók az elfogadott teljes scope-ban maradnak akkor is, ha még nem aktívak.

### 77.4. Sablonok, presetek és közös szerkesztői szabályok — kiadástól független invariánsok
1. Template: **site-kit / page / layout / section / component / synced symbol / overlay / widget / video project**; preset: **theme / typography / color / spacing / effect / animation / responsive / alert / scene / macro**. A preset tulajdonságokat állít be, és nem vezet be második mentési vagy adatmodellt.
2. Template manifest: stabil ID, verzió, séma, cél, szerző/licenc, locale, függő modulok/provider-képességek, kapcsolódó assetek, jogosultsági hatás, preview, migráció/rollback. Komponensfrissítésnél diff és érintett példányok megjelenítése.
3. Globális, szinkronizált elem csak explicit linkeléssel változtat más példányokat; detached másolat, helyi override és revert külön kezelendő. A gyári induló tartalom soha nem tűnhet valódi felhasználói adatnak.
4. Overlay/alert/makró élő felhasználásnál elkülönített staging és live verzió, tesztgomb, queue/prioritás, rate limit, abort/kill switch, eszköz offline-fallback, audio licenc és módosítási audit szükséges.
5. API-k és események: site/workspace scope, role/permission, server-side validation, idempotent command, schema version, ownership, privacy, test, rollback. Csatlakozóproviderre épülő funkció nem ígérhet nem engedélyezett publikálást vagy streamvezérlést.

### 77.5. Minden fejlesztési feladat minimális kártyája
`ID | modul/owner | felhasználói eredmény | UI/hely | domain objektum + lifecycle | D1/R2/secret | API/event contract | jogosultság/site-scope | függőségek | responsive/a11y | hiba/fallback | pozitív+negatív+regressziós teszt | publish/rollback | provider/licenc | státusz és bizonyíték`.
A már részletezett 24/49/54/56/64–76. fejezet tartalmát **nem kell másodszor újralistázni**; a fejlesztéskor az adott funkcióhoz a kapcsolódó szerződéseket együtt kell alkalmazni.

### 77.6. Tényleges állapot és nyitott kockázatok

- **Fejlesztési környezet stratégia (felhasználói döntés, 2026-10-15):** A Creator Platform funkcióit és weboldalait alapértelmezetten közvetlenül a meglévő éles Cloudflare Worker/D1 környezetben fejlesztjük és ellenőrizzük. Külön teszt-/stagingkörnyezetet most nem hozunk létre; csak konkrét műszaki, adatvédelmi vagy biztonsági indok esetén vezetünk be. A jelenlegi oldalak tesztoldalak, végleges tartalom nélkül. Az automatizált regressziós tesztek, CI, jogosultsági és adatkonzisztencia-ellenőrzések ettől továbbra is kötelezőek; veszélyes vagy visszafordíthatatlan műveletek előtt külön óvatosság szükséges.


- **Jelenlegi oldalak tesztállapota (felhasználói megerősítés, 2026-10-15):** a jelenleg létrehozott publikus oldalak kizárólag tesztoldalak; nincs rajtuk végleges éles tartalom, és az eddigi szerkesztések tesztelési célt szolgáltak. Ez lehetővé teszi a meglévő tesztoldalak használatát F0.3 publish/rollback és konkurencia-elfogadási tesztekhez, külön tesztkörnyezet létrehozása nélkül. A tesztek előtt az érintett oldal azonosítóját és aktuális draft/published verzióját rögzíteni kell; az adatvesztés, más site adatainak érintése, jogosultságok megkerülése, séma- vagy éles migráció és nem visszaállítható műveletek továbbra sem megengedettek automatikusan. A teszteredményeket külön bizonyíték alapján kell PASS-nak jelölni.

- **Lezárt kapuk:** F0.1 és F0.2 CLOSED / PASS a korábban rögzített bizonyítékokkal. F0.3 CLOSED / PASS (2026-10-16): automatizált route-integráció 8/8, teljes F0 baseline 94/94, Node 22 GitHub CI sikeres, valamint a felhasználó visszaigazolta a kétfüles éles preview/publish/conflict/rollback eljárás sikeres végigfutását.
- **HIGH publish conflict:** RESOLVED a célzott route/SQLite-konkurenciatesztekkel és a felhasználó éles kétfüles stale-revision elfogadásával. A nyertes publikáció maradt publikus, az elavult publikáció konfliktusba futott, az eredeti tartalom vissza lett állítva a felhasználói visszajelzés szerint.
- **Egyetlen aktív pont:** `F1.1-SITE-CORE-MULTIPAGE-NAVIGATION`, következő végrehajtásra READY. A következő munkában először a jelenlegi Site/Page/Navigation API, adatmodell, UI, route/slug viselkedés és tesztek leltározása történik, azután a bizonyított hiány kerül fejlesztésre. F0.3 lezárása nem igazolja az F1 funkciók készültségét.
- Régi 63.x és PLAN-... aktív jelölések kizárólag dátumozott történeti pillanatképek, és **nem indítanak új auditprojektet**. Ha régi fejezet ellentmond a 77. fejezet aktív kurzorának, a fejléc és jelen fejezet az irányadó.
- A tervbe foglalás nem igazolja a kód készültségét. Tesztet/CI-t/éles hozzáférést csak tényleges ellenőrzés után lehet PASS-ra állítani.
- Nem garantálható, hogy soha nem merül fel új követelmény; új funkció ugyanebbe a tervbe kerül az owner és stabil azonosító megtartásával, nem második terméktervként.

### 77.7. Lokális GitHub-szinkron és első fejlesztési indítás
1. **Előbb a branch védett szinkronja:** tiszta helyi munkafa ellenőrzés, `git switch v2/foundation`, `git fetch origin`, `git pull --ff-only origin v2/foundation`.
2. Az itt jóváhagyott MASTER-fájlt a `docs/SANCI9517-CREATOR-PLATFORM-PLAN.md` útvonalra másolni, **a friss GitHub-fájllal való diff után**. Ha közben más fejlesztő módosította ugyanezt a kanonikus dokumentumot, előbb az eltérést össze kell vezetni, tilos vakon felülírni.
3. `git diff --check`, `git diff --stat`, kritikus fejezetszám-/ID-check, majd csak a dokumentum stagingje, commit, `git push origin v2/foundation`.
4. Push után remote commit és nyers tervfájl ellenőrzés. **Csak ezután** F0.1: kód-, migráció-, Auth-, ownership- és testbaseline; F0.2–F0.3 csak a kapuk szerinti bizonyíték után.
5. Az éles telepítés és a D1 migráció külön kockázatos művelet; a puszta dokumentumfeltöltés sem deployt, sem migrációt nem indítson el tudatos jóváhagyás nélkül.

### 77.8. F0.3 tényleges route-integráció és éles olvasásos ellenőrzés — 2026-10-15

**Kiinduló GitHub HEAD:** `dbab7e73f6272700101e50fd8cf49879eea59c85`, `v2/foundation`. **Aktív pont változatlan:** `F0.3-PREVIEW-PUBLISH-PUBLIC`, **IN PROGRESS / NOT YET PASS**. A HIGH publish conflict éles E2E bizonyítékig OPEN.

**Igazolt hiány és változtatás:** a korábbi statikus contract- és külön bemásolt SQL-tesztek nem futtatták a tényleges TypeScript route-okat. Az új `tests/f0-3-route-integration.test.js` a production `adminEditorRoute` és `publicPagesRoute`, valamint a valódi session-hash/jogosultságkezelés kódját hívja, SQLite-adapterrel. A batch adapter tranzakciót használ; a versenyhelyzet determinisztikusan a route előellenőrzése és batch végrehajtása közé illeszti a másik valódi route-hívást. Ez automatizált teszt, nem külön telepített tesztkörnyezet. Runtime kód-, séma-, migráció- és éles adatváltoztatás ebben a lépésben nem történt.

**Helyi eredmények:**
- Új route-integráció: **8/8 PASS**. Anon/viewer preview és írás tiltása; draft–publish–rollback–újrapublish izoláció; konkurens publish nyertes/409; audit SQL-hibánál teljes batch visszagörgetés; unpublish/publish verseny és idempotens unpublish audit; idegen site olvasás/írás kizárása; rollback/publish verseny; hiányzó/elavult revision és hibás hierarchia elutasítása mutáció nélkül.
- Meglévő F0 baseline: **94/94 PASS** (Admin home/access, domain, Editor core, schedule, SQLite-konkurencia és F0.3 contract tesztek).
- `npm run typecheck`: **PASS**. `python3 scripts/check-canonical-plan.py`: **PASS**.
- Az új integrációs teszt bekerült a `.github/workflows/f0-baseline.yml` folyamatba. Helyi futtatás: `node --experimental-loader ./tests/ts-extension-loader.mjs --test tests/f0-3-route-integration.test.js`. A helyi Node verzió 24.19.0; a CI Node 22-t használ, ezért a helyi PASS önmagában nem CI PASS.
- D1 batch-szerződés ellenőrzött forrása: https://developers.cloudflare.com/d1/worker-api/d1-database/#batch — a batch hibájára az egész műveletsor visszagörgetendő. A SQLite-adapter ezt modellezi; nem bizonyítja a telepített Worker/D1 futását.

**Éles, kizárólag olvasásos HTTP-ellenőrzés:** a meglévő `sanci9517-streamer-brand.sandor-bogadi95.workers.dev` környezet `/api/health` végpontja **200**, `ok:true`; `/api/public/pages?preview=1` bejelentkezés nélkül **401 UNAUTHORIZED**; `/api/public/pages` **200**, `ok:true`, 9 oldal. A két public API-válaszban `Cache-Control: private, no-store, max-age=0` és `Vary: Cookie` szerepelt. Ez a hozzáférési/cache-fejléc smoke eredménye, nem teljes vizuális vagy éles konkurencia-elfogadás, és a health verziószáma nem bizonyít telepített commitazonosságot.

**Következő szükséges bizonyíték:** hitelesített éles Editor/D1 E2E ugyanazon tesztoldalon: oldal-ID, draft revision és published pointer rögzítése; két azonos revisionből induló publish közül pontosan egy siker és egy 409; egyetlen új revision/audit; a nyertes publikus snapshot és metadata; rollback után változatlan public, majd explicit újrapublish után visszaállított public. A tesztoldal tartalma szabadon cserélhető, de az előállapotot rögzíteni kell. Ebben a munkamenetben hitelesített éles felhasználói session nem állt rendelkezésre; auth megkerülés vagy új session létrehozása nem történt. E bizonyíték nélkül F1 nem aktiválható.

**GitHub CI utóellenőrzés:** a `db756de2e17124fef10a40410e700aaa4ee88ee9` commit mind az öt workflow-ja **completed / success**: F0 baseline checks ([38789842879](https://github.com/sanci9517/sanci9517/actions/runs/38789842879)), Editor Core Test (`38789842875`), Twitch Integration Check (`38789842981`), Canonical Creator Platform Plan (`38789842869`), Canonical Plan Active Point Audit (`38789842933`). Az új 8 route-integrációs tesztet a Node 22-es F0 baseline is sikeresen lefuttatta. Ez az adott tesztcommit igazolása; az éles F0.3 E2E és HIGH kapu állapotát nem változtatja meg.


### 77.9. F0.3 Editor URL és kiválasztott oldal helyreállítása — 2026-10-16

**Felhasználói hiba:** az Editorban kiválasztott YouTube-oldal nem jelent meg az URL-ben; az `/admin/editor` újratöltése mindig a lista első oldalát, a főoldalt nyitotta meg. **Ok a kódban:** `loadPages()` nem olvasott deep-link állapotot, és `loadPage()` sem szinkronizálta az URL-t.

**Módosítás:** az Editor URL `?pageId=<oldal-azonosító>` paramétere az aktuális oldal tartós, megosztható kiválasztása. Az indulás a paraméter alapján választ; hiányzó vagy már nem létező ID esetén biztonságosan a lista első oldalára esik vissza. Minden sikeres oldalbetöltés `history.replaceState` használatával frissíti a `pageId` értéket úgy, hogy más query paramétert és a hash-t megőrizze. A cache-buster frissült. Az új oldalválasztási tesztek a meglévő Editor tesztscriptből futnak.

**Ellenőrzés:** `npm run test:editor` **49/49 PASS**; `npm run typecheck` **PASS**; `git diff --check` **PASS**. Az induló kiválasztás, fallback, URL-paraméter olvasása, más query/hash megőrzése és az oldal kiválasztásának URL-be írása külön tesztet kapott. Éles böngészős frissítési ellenőrzés PASS felhasználói visszajelzés alapján (2026-10-16): a YouTube-oldal választása URL-be került és frissítés után is megmaradt.

**Állapot:** a kódjavítás és CI után a felhasználó megerősítette, hogy a YouTube-oldal kiválasztása bekerül az URL-be, és frissítéskor az oldal megmarad. A részletes kód- és CI-bizonyíték a 77.9 és 77.10 pontban áll. Az F0.3 éles publish/conflict kapu a 77.10 szerinti tesztmegerősítéssel CLOSED / PASS.


### 77.10. F0.3 kézi éles elfogadás és F1.1 aktiválása — 2026-10-16

**Felhasználói kézi tesztmegerősítés:** a felhasználó a teljes előzőleg leírt F0.3 ellenőrzési folyamatot sikeresnek jelezte. Ezt a teljes folyamat user-confirmed PASS eredményeként rögzítjük: azonos YouTube-oldal két Editor fülön; draft módosítás és publikálás; az elavult fül publikálási konfliktusa és helyi vázlatának megőrzése; a nyertes publikus tartalom ellenőrzése; az eredeti oldalverzió visszaállítása és újrapublikálása; az Editor URL/frissítés viselkedésének ellenőrzése. Revision számot, pontos publikus slugot vagy képernyőképet a felhasználó nem adott meg, ezért ezeket nem dokumentáljuk tényként.

**F0.3 elfogadási döntés:** CLOSED / PASS (2026-10-16). Együttes bizonyíték: valós route-okat hívó integrációs teszt 8/8 PASS; meglévő F0 regresszió 94/94 PASS; npm run typecheck PASS; a db756de2e17124fef10a40410e700aaa4ee88ee9 commit mind az öt GitHub Actions workflow-ja SUCCESS; a felhasználó megerősítette a kézi éles teszt sikerét. A HIGH publish conflict blokkoló státusza RESOLVED.

**Egyetlen következő aktív pont:** F1.1-SITE-CORE-MULTIPAGE-NAVIGATION — Site Core, oldal CRUD és navigáció (77.3 fáziskapu; funkciószelet: Site Core + többszintű oldalak/navigáció). Első művelet: a jelenlegi pages/site beállítások, admin oldalkezelő, API route-ok, D1 séma, publikus route/slug és tesztlefedettség vizsgálata; az oldalválasztó deep-link javítás már elérhető alap. Csak bizonyított hiányt implementálunk, majd a releváns CRUD, slug-ütközés, jogosultság, site-scope, 404/redirect, draft/published, mobil és keyboard acceptance szerint fejlesztünk és tesztelünk. F1.1 addig nem nevezhető PASS-nak, amíg a saját elfogadási feltételei nem igazoltak.


### 77.11. F1.1 — publikus oldalak valódi HTTP 404 státusza — 2026-10-16

**Leltározott hiány:** a `src/index.ts` minden `/p/*` útvonalra feltétel nélkül a `visual-page.html` shellt adta vissza 200-as státusszal. A nem létező és nem publikált oldalaknál csak a kliensoldali JavaScript mutatott 404-es üzenetet; crawler, HTTP kliens és státuszfigyelés továbbra is sikeres oldalt látott. A publikus listát és slug-keresést már a `publicPagesRoute` kezeli, ezért az útvonal-ellenőrzés ezt a published-only domain szerződést használja, nem épít második Page lekérdezési modellt.

**Módosítás:** a Worker a `/p/<slug>` kiszolgálása előtt a meglévő publikus Page route-on ellenőrzi, hogy a slug publikált oldalhoz tartozik-e. Publikált oldalnál változatlanul a közös visual-page shell töltődik be; ismeretlen vagy nem publikált slugnál ugyanaz a shell HTTP 404-et és `Cache-Control: no-store` fejlécet kap. Hibás encoding, nem megengedett slug és többszintű útvonal nem kerül D1-hez. A hitelesített `?preview=1` útvonal a cookie-t és preview módot továbbadja a már létező jogosultság-ellenőrzésnek, így a draft preview használható marad, az anonim preview 401-et kap. Adatbázisséma, migráció és éles adat nem változott.

**Automatizált ellenőrzés:** új Worker-szintű útvonalteszt 5/5 PASS: publikált oldal 200 és query megőrzése; ismeretlen és csak piszkozat slug HTTP 404; hibás encoding és nested slug D1 nélkül 404; hitelesített, nem publikált draft slug preview 200; anonim preview 401 draft-lekérdezés nélkül. A teszt bekerült a `F0 baseline checks` workflow-ba. Helyi teljes releváns regresszió: typecheck PASS; Admin home 16/16; Admin access 2/2; domain 5/5; Editor 49/49; F0 editor/publish contract 17/17; F0 route integration 8/8; F1.1 public route 5/5; schedule 9/9; canonical plan checker PASS; `git diff --check` PASS. Eredmény a helyi munkafára vonatkozik, GitHub CI és éles HTTP/böngészős ellenőrzés még nem történt.

**Éles ellenőrzés (2026-10-16):** a GitHub commit `c5ac4ae2c5c9dbb42115a8aca1c714dec5b29129` mind az öt workflow-ja SUCCESS (F0 baseline, Editor Core Test, Twitch Integration Check, Canonical Creator Platform Plan, Canonical Plan Active Point Audit). A Cloudflare API az `sanci9517-streamer-brand` Worker legutóbbi 100%-os deploymentjeként a `16e23b1a-8172-469d-8fd8-d3df0d3ef1e4` verziót mutatta, 2026-10-16 07:49 UTC időbélyeggel (version 2107). Éles böngészőben a `/p/youtube` útvonal a YouTube-oldal tartalmát jelenítette meg; az egyedi ellenőrző slug `/p/sanci9517-404-check-20261016` az „Az oldal nem található / 404” felületet mutatta. A távoli böngészőből a dokumentumnavigáció nyers HTTP-státusza nem volt közvetlenül olvasható. A felhasználó az ezután kért teljes éles ellenőrzőlistára „minden jó” visszajelzést adott (2026-10-16); ezt a `/p/youtube` HTTP 200, az ismeretlen slug HTTP 404 és az Editor hitelesített preview működése **felhasználó által megerősített PASS** eredményként rögzítjük, a nyers státuszkódot saját eszközzel nem mértük. Az automatizált route-teszt ugyanezeket a publikus státuszokat és a preview jogosultságot külön is ellenőrzi.

**Állapot:** ez az F1.1 egy elfogadási szelete, nem az F1.1 lezárása. A Site/Page CRUD, navigációs fa, hierarchia, slug-életciklus, redirect és több-site elfogadási pontjai továbbra is nyitva maradnak.


### 77.12. F1.1 — publikus mobilnavigáció fókusz-visszaállítása — 2026-10-16

**Leltározott hiány:** a canonical publikus `public/visual-page.html` menügombja megnyitotta és bezárta a menüt, Escape-re és külső kattintásra is bezárt, de bezáráskor a fókuszt nem állította vissza a megnyitó gombra. A vezérlő és navigációs panel között nem volt explicit `aria-controls` kapcsolat. Ez a WEB-011 mobil- és billentyűzetes elfogadás egy kis, adatmodell-migráció nélküli szelete; a WEB-009 szerveroldali navigációs fa ettől még nincs implementálva.

**Módosítás:** Escape bezárás után a fókusz a menügombra kerül vissza. Külső kattintás akkor állítja vissza a fókuszt, ha a fókusz a bezárás pillanatában a menün belül volt; egyébként nem rabolja el a külső vezérlő fókuszát. A menülink követése és a már becsukott állapot nem kényszerít fókuszváltást. A gomb `aria-controls="public-menu"` attribútumot, a panel stabil ID-t kapott; az érintett oldal `site.js` hivatkozása cache-bustert kapott. D1-séma, migráció és éles adat nem módosult.

**Helyi ellenőrzés:** új futtatható Node teszt 3/3 PASS: Escape bezárás és fókusz-visszaállítás; menün kívüli kattintás fókuszkezelése nyitott és zárt esetre; ARIA-kapcsolat és cache-buster jelenléte. Releváns helyi regressziók PASS: Admin home 16/16; Admin access 2/2; domain 5/5; Editor 49/49; F0 editor/publish contract 17/17; F0 route integration 8/8; F1.1 publikus route 5/5; schedule 9/9; új publikus navigáció 3/3; `npm run typecheck`; canonical plan checker; `git diff --check`. A teszt bekerült a `F0 baseline checks` GitHub Actions workflow-ba.

**GitHub CI és éles böngészőellenőrzés (2026-10-16, kódcommit `10d5a8d5942b633d968c190f804cf16b1e06ddd6`):** az öt workflow mind `completed / success`: F0 baseline (`38871126080`), Editor Core Test (`38871126132`), Twitch Integration Check (`38871126100`), Canonical Creator Platform Plan (`38871126016`), Canonical Plan Active Point Audit (`38871126188`). Cloudflare Worker `sanci9517-streamer-brand` friss deploymentje `432b4676-f0ee-4f1b-b330-3a5501a82eef`, az aktív version `a37fb1e7-080a-4c64-a793-95f21149c1e0`, 100%-os forgalommal, 2026-10-16 08:03:32 UTC időbélyeggel. Az éles `/p/youtube` böngészőben betöltődött; a publikus menüben 8 link jelent meg, a menügomb és navigációs panel `aria-controls` kapcsolata érvényesült. Az első menülink fókuszában küldött Escape bezárta a menüt és a fókuszt visszahelyezte a menügombra (`aria-expanded=false`, `document.activeElement` a toggle). Nyers viewport/responsive méretet ebben a böngésző-ellenőrzésben nem állítottunk; a mobil töréspont vizuális elfogadása külön még nyitva marad.

**Nyitott F1.1 elemek:** szerveroldali canonical navigációs fa, többszintű menü és page hierarchy, CRUD teljes negatív/site-scope tesztjei, slug/redirect életciklus, több-site elfogadás és a mobil töréspont vizuális elfogadása. A jelen módosítás csak a meglévő publikus disclosure menü keyboard/fókusz hibáját kezeli; nem zárja le a WEB-011-et vagy az F1.1-et.


### 77.13. F1.1 — oldalrendezés célindexének és site-scope-jának javítása — 2026-10-16

**Leltározott hiány:** az `adminPagesRoute` `PATCH sortOrder` eddig csak az aktuális oldal legközelebbi szomszédjával cserélt, bármilyen megadott célindex mellett. Például a 0. indexről 2-re mozgatás után az oldal a 1. sorrendbe kerülhetett, miközben az API-válasz 2-t jelentett. Az egyik csere `UPDATE` SQL-je nem tartalmazott `site_id` feltételt. Az Editor jelenlegi fel/le gombjai szomszédos lépést kérnek, de az API szerződése tetszőleges indexet is elfogadott.

**Módosítás:** sorrendmódosításkor a route az aktuális site oldalait stabil `sort_order,id` sorrendben beolvassa, ellenőrzi a célindexet, áthelyezi az elemet a kért pozícióra, majd batch-ben 0..N−1 folytonos sorrendet ír vissza. Minden írás `id` és `site_id` szerint korlátozott; az egyetlen D1 batch atomi. A negatív és a lista végi/out-of-range célindex 400 `INVALID_PAGE_ORDER`, adatváltozás nélkül. A `page.update` audit most a régi és az új sort ordert is tartalmazza. Sémamódosítás/migráció és publikus tartalom nem érintett.

**Célzott route/SQLite ellenőrzés:** az új `tests/admin-pages-sort.test.js` 3/3 PASS: tetszőleges célindex helyes áthelyezése és folytonos indexek; out-of-range kérés változás nélküli elutasítása; másik site oldalának 404-es elutasítása és változatlan sorrendje. A teszt bekerült a Node 22-es `F0 baseline checks` workflow-ba.

**Helyi regresszió:** `npm run typecheck` PASS; Admin home 16/16; Admin access 2/2; public navigation 3/3; page sort route 3/3; domain 5/5; Editor 49/49; F0 contracts 17/17; F0 route integration 8/8; F1.1 public route 5/5; schedule 9/9; canonical plan checker és `git diff --check` PASS. Node 24.19.0.

**GitHub CI és éles telepítés (2026-10-16, commit `c9202b778bd6812e5602f51add84ae0f7c0747cd`):** mind az öt workflow `completed / success`: F0 baseline (`38871798104`), Editor Core Test (`38871798058`), Twitch Integration Check (`38871798063`), Canonical Creator Platform Plan (`38871798038`), Canonical Plan Active Point Audit (`38871798051`). A Cloudflare Worker `sanci9517-streamer-brand` legfrissebb deploymentje `a8e8e532-e085-40a0-a991-779c7c349d66`, aktív verzió `3a49d450-ecd5-4533-a947-d9bb47b5cdb3`, 100% forgalom, 2026-10-16 08:09:35 UTC időbélyeggel. A kód éles; az új reorder route automatizált, valódi route-kódot SQLite-on futtató tesztjei 3/3 PASS. **Felhasználói kézi ellenőrzés:** az Editor oldallistáján az oldalt feljebb, majd vissza lefelé mozgató kért sorrendtesztet a felhasználó „működik” visszajelzéssel sikeresnek erősítette meg. Nincs rögzített képernyőkép vagy nyers adatbázis-vizsgálat; az éles kézi sorrendelfogadás user-confirmed PASS.

**Nyitott F1.1 elemek változatlanul:** canonical szerveroldali navigációs fa, page hierarchy és nested menu; CRUD/slug/redirect lifecycle teljes acceptance; mobil viewport vizuális elfogadása; több-site viselkedés. Ez a részszállítás nem zárja le F1.1-et.


### 77.14. F1.1 — WEB-009 canonical navigációs fa: következő adatmodell- és migrációs kapu — 2026-10-16

**Bizonyított jelenlegi hiány:** a publikus `public/assets/site.js` a `/api/public/pages` listából építi fel a menüt, és a `home` oldalt kihagyja. Nincs szerkeszthető, hierarchikus, kanonikus menümodell, ezért a menü most a publikált oldalak listájának nézetéből következik. A WEB-009 elvárt negatív feltételei közé tartozik a ciklikus és hiányzó célú menüpont publikálásának megakadályozása; ezekhez a jelenlegi megoldásban nincs menüfa-validáció.

**Éles D1 read-only ellenőrzés (2026-10-16):** az account `64bbd6a12ac732ed2cac4ca25d8bfa7e`, adatbázis `sanci9517-db` (`5a4a5e96-fdad-421a-a33c-143daaf33e98`). A `pages` táblában 9 oldal található az egyetlen `site-default` site alatt. A jelenlegi slugra globális `UNIQUE` megszorítás van; mellette létezik egyedi részleges index a `(site_id,published_slug)` mezőpárra. A más site-ok közti slug-ütközés lekérdezése nem adott találatot, mert jelenleg egyetlen site van. A `sqlite_master` indexek és page-count lekérdezései read-only, `changed_db=false`, `rows_written=0` eredményt adtak. Migráció vagy adatírás nem történt.

**Következő részfeladat:** `F1.1-WEB-009-CANONICAL-NAVIGATION`. A meglévő publikus listaútvonal és Page domain újrahasználásával egyetlen site-scoped menüfa szerződést kell kialakítani, amely támogatja a belső oldalcélt, külső hivatkozást, rendezést és hierarchiát; a draft/published határnak meg kell akadályoznia, hogy nem publikált menüváltozás azonnal megjelenjen. A mentési/publikálási tranzakció, oldal törlés/slug módosítás hatásai, ciklus- és hiányzó cél validáció, jogosultság, publikus renderelés, mobil/keyboard működés és visszaállíthatóság tesztelendő. A 77.4 egy adatgazda szabálya szerint párhuzamos menüadatforrás nem hozható létre.

**Helyi implementációs jelölt (2026-10-16, izolált worktree; nem éles):** a `work/f1.1-navigation` helyi ágon commit `c90f717f60562abaf5cf5ab58884837676f992e8` elkészült a WEB-009 első végigvezetett szelete: `site_navigation` site-scope-olt draft/published snapshot migrációval és jelenlegi publikált oldalakból seedeléssel; authenticated Admin GET/PUT/POST API-val, optimistic revision checkkel, oldalcél- és HTTPS külső URL validációval, publikált cél ellenőrzéssel és audit eseménnyel; publikus API-val, amely belső Page ID-t publikált URL-re old fel és elrejti a hiányzó/nem publikált célt; Editor oldalsó Navigáció panellel, hierarchia/rendezés, külső link, külön draft mentés és publikálás művelettel. A meglévő publikus menü ugyanazt a seeded sorrendet kapja, a Home és a draft oldalak kimaradnak. A migráció nem módosítja a pages táblát vagy a slug egyediségi megszorítást.

**Helyi automatizált ellenőrzés (Node 24.19.0):** új navigation migration/route/UI tesztek 10/10 PASS; meglévő publikus navigation + F1.1 route/reorder tesztek 20/20 PASS; F0.3 szerződéses és publikus navigáció regresszió 20/20 PASS; F0.3 route integration 8/8; F1.1 publikus route 5/5; Admin home 16/16; Admin access 2/2; domain 5/5; Editor 49/49; schedule 9/9; `npm run typecheck`, az érintett JS modulok parse checkje és `git show --check` PASS. A teljes helyi F0 baseline parancskészlet sikeres. A feature commit csak a helyi izolált worktree-ben létezik; a `v2/foundation` feature kódja és a `0020` migráció nem került fel, és nem alkalmazódott élesben. Ugyanakkor a MASTER-only `99dffefc46b07db41155c77d1f18d14ec56342e4` push is automatikusan elindította a Cloudflare `Workers Builds` production folyamatot: build `309ddd33-a216-4afc-a7d6-1d907de02679`, konfigurált parancs `npm run deploy`, amely `db:migrations:apply` és `wrangler deploy` lépéseket futtat. Az ebből létrejött deployment `192fa8a6-b4b8-447a-9b64-1d84b5ceee79`, Worker version `57a46115-008f-4206-9f0c-fc0ff36f6bf4`, 100%, 2026-10-16 08:54:10 UTC. Read-only D1 ellenőrzés szerint az utolsó alkalmazott migráció továbbra is `0019_published_page_timestamp.sql`, `site_navigation` tábla nincs; `rows_written=0`, `changed_db=false`. Ez docs-only push után futó automatikus deployment volt; a navigáció feature kód nem került productionbe. A Böngészős vizuális és autentikált éles acceptance még nem történt. **Üzemeltetési következmény:** a `v2/foundation` bármely push-a production deployt futtat, és a jelenlegi deploy parancs az összes függő D1-migrációt előbb élesben alkalmazza. Ezért a 0020 migrációt tartalmazó branch push/deploy előtt kifejezett felhasználói jóváhagyás szükséges.

**MASTER-re alapozás:** a feature commit újraalapozva a legfrissebb `v2/foundation` ágra; a release-re kerülő feature commit `2ddc30c` (a korábbi lokális jelölt commit utódja).

**Éles kapu:** a felhasználó 2026-10-16-án kifejezetten jóváhagyta az éles migrációt és deployt, ha külön tesztkörnyezet nem indokolt. A 0020 migráció és a feature kód production pushra vár; migráció, Worker deployment és CI csak azok tényleges ellenőrzése után rögzíthető. A WEB-009 és az F1.1 státusza továbbra is IN PROGRESS; ez a bejegyzés nem állít kész vagy PASS állapotot.

### 77.15. F1.1 WEB-009 — éles kiadás és runtime ellenőrzés — 2026-10-16

**Kiadás:** a `v2/foundation` ágra felkerült a WEB-009 canonical navigáció implementációja `85de0377fd311615e3a25181e3279ca21f932728` commitként, a 77.14-ben rögzített felhasználói jóváhagyás alapján. Külön tesztkörnyezet nem indokolt: a migráció kompatibilis, új `site_navigation` táblát hoz létre, a meglévő `pages` és slug korlátozásokhoz nem nyúl.

**Automatizált kapuk:** a GitHub ellenőrzések mind 6/6 sikeresek: Workers Builds, verify, source-audit, editor-core, twitch-integration, canonical-plan. A helyi, Node 24.19.0-s teljes releváns baseline is sikeres: typecheck; admin home 16/16; publikus menü 3/3; page reorder 3/3; új navigáció migráció/API/UI 10/10; admin access 2/2; domain 5/5; Editor 49/49; SQLite regresszió 17/17; F0.3 route integration 8/8; F1.1 public route 5/5; schedule 9/9; canonical plan checker és diff check PASS.

**Éles D1 és Worker:** Cloudflare build `9b20c43f-3bad-49e1-a8e8-d3cc1ddd2367` sikeres; a build `npm run typecheck`, majd a meglévő konfiguráció szerinti `npm run deploy` parancsot futtatta. A `0020_site_navigation_snapshots.sql` migráció 2026-10-16 09:01:12 UTC-kor alkalmazódott. A D1 read-only ellenőrzése szerint a `site-default` rekord létrejött, `revision=1`, `published_revision=1`, 8 publikált menüponttal; az ellenőrző SELECT-ek `rows_written=0`, `changed_db=false` eredménnyel zárultak. Az aktív Worker deployment `d167e289-9665-493f-b052-d193ba9909b0`, verzió `6d86d9db-cde0-41c7-a05c-954cc6bc8517`, forgalmi arány 100%, 2026-10-16 09:01:21 UTC.

**Éles runtime ellenőrzés:** a `https://sanci9517-streamer-brand.sandor-bogadi95.workers.dev/p/youtube` oldalon a menü megnyílt; 8 belső menüpont jelent meg, köztük a YouTube oldalra mutató hivatkozás, a menü a működő publikált sorrendet használja. Az `/admin/editor` első megnyitása a bejelentkezési oldalra irányított; a biztonságos hitelesítés után új böngészőlapon láthatóan betöltött a `Sanci9517 Visual Editor v2` és a `Navigáció` eszköz. A credential-delivery utáni böngészőadat-védelem blokkolta a további automatizált panel-interakciót, így a panel működésének kézi elfogadása még nem történt meg.

**Következő acceptance lépés:** felhasználó ellenőrizze az Admin Editorban a Navigáció panel betöltését, egy menüpont átrendezésének draft mentését (publikálás nélkül a publikus menü ne változzon), majd a draft publikálását, és a publikus menü frissítését. Ezt követően ellenőrizendő a külső HTTPS link, a hierarchikus/nested menü mobilon és billentyűzettel. Addig a WEB-009 és F1.1 státusza IN PROGRESS marad; az éles runtime és az automatizált tesztek PASS állapota nem helyettesíti a hitelesített UI kézi elfogadását.
