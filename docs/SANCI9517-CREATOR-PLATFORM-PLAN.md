# SANCI9517 — CREATOR PLATFORM: TERMÉK-, ARCHITEKTÚRA- ÉS FEJLESZTÉSI MASTER-TERV

**Tervazonosító:** S9517-CREATOR-PLATFORM-MASTER  
**Verzió:** 4.3.0 — konszolidált, feltöltésre előkészített fejlesztési MASTER  
**Dátum:** 2026-10-16  
**Állapot:** KANONIKUS TERMÉK- ÉS FEJLESZTÉSI MASTER — a tervezett termékkör rögzítve; F0.2 és F0.3 CLOSED / PASS. Az F1.1 Site Core, többoldalas kezelés és navigáció IN PROGRESS. A tervezési teljesség nem bizonyít sem kész implementációt, sem teljes körű tételes szemantikai audit.
**Aktív tervpontazonosító:** `F1.1-SITE-CORE-MULTIPAGE-NAVIGATION`  
**Aktív tervpont státusza:** IN PROGRESS — Site Core, többoldalas kezelés és navigáció. A 77.10 szerinti F0.3 kiadási kapu lezárult; az F1.1 oldalkezelési acceptance pontjai a 77.11–77.14 szerint részlegesen teljesültek, a canonical navigációs fa és további CRUD/URL ellenőrzések nyitva maradnak.
**Következő közös lépés / AKTUÁLIS FOLYTATÁSI KURZOR:** `F1.1-SITE-CORE-MULTIPAGE-NAVIGATION` — a publikus menü billentyűzetes fókusz- és léptetésjavításának kézi éles ellenőrzése; ezután nested és mobil acceptance.
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
3. **Visual Editor = oldalszerkesztés.** Vászon, oldalszerkezet, layout, responsive nézetek, vizuális komponensek, stílus, kötött dinamikus blokkok és előnézet/publikálás tartozik ide. Az Editorban egy tartalom, esemény, termék vagy kapcsolat kiválasztható és megjeleníthető, de annak teljes üzleti életciklusát a saját Admin-modulja kez