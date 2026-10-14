# SANCI9517 — CREATOR PLATFORM: TERMÉK-, ARCHITEKTÚRA- ÉS FEJLESZTÉSI MASTER-TERV

**Tervazonosító:** S9517-CREATOR-PLATFORM-MASTER  
**Verzió:** 3.0.0  
**Dátum:** 2026-10-14  
**Állapot:** AKTÍV — ez az egyetlen aktuális termék- és fejlesztési terv; a belső konzisztencia és a fejlesztésindítási feltételek ellenőrzése még folyamatban van  
**Aktív tervpontazonosító:** `PLAN-CAPABILITY-COMPLETENESS-AND-CONSISTENCY`  
**Aktív tervpont státusza:** IN PROGRESS / NOT PASS — a 396 funkció-ID és 22 főmodul megőrzött; a korábbi H19–H34 forrásjegyzék 271 tétele a 63.52–63.53 fejezetben tételesen megfeleltetett. A történeti 00/A / 00.9.6.B és a szemantikai lezárás még nyitott; új funkció implementálása nem indulhat pusztán tervbeli felsorolás alapján.  
**Következő közös lépés:** a terv strukturális és történeti teljesség-kapujának lezárása; utána a 396 ID-s teljes katalógus közös termék-review-ja, majd az F0 egyetlen aktív, teljesen specifikált és bizonyított munkapontja. A kód-/runtime-PASS mindig külön bizonyítandó.  
**Repository:** `sanci9517/sanci9517`, `v2/foundation`  
**Termékcél:** teljes, egy Adminból kezelhető Brand & Creator Operating Platform, saját weboldallal, közösségi és streaming integrációkkal, tartalomgyártással, bevételi eszközökkel, OBS-integrációval és multimodális SANCI AI-val.

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

- **Aktív tervpont:** `PLAN-CAPABILITY-COMPLETENESS-AND-CONSISTENCY`.
- **Cél:** a teljes, korábban egyeztetett és a most kibővített képességkészlet egyetlen dokumentumban, logikus modulhatárokkal, egyértelmű függőségekkel és ellenőrizhető elfogadási feltételekkel legyen megőrizve.
- **Jelenlegi státusz:** IN PROGRESS. A szerkezeti ellenőrzés és a modulhatárok javítása nem bizonyítja önmagában a teljes szemantikai megfelelést, ezért a terv nem jelölhető véglegesnek addig, amíg a fennmaradó követelmény- és függőségellentmondások nincsenek feloldva.
- **Nem aktív külön munkafolyamat:** a korábbi P0/P0.2 checkpoint nem kerül vissza külön auditprojektté. A hiányzó történeti források és követelmények megőrzése a jelen terv teljességének része, nem második terv vagy külön roadmap.
- **Következő felhasználói szakasz:** a terv teljességének lezárása után közösen átnézzük a funkciókatalógust; az implementáció csak a jóváhagyott sorrend, a meglévő kód ellenőrzése és az elfogadási tesztek alapján indul.
- **Következő implementációs cél, későbbi kapuként:** az F0 meglévő Admin → Visual Editor → mentés/újratöltés → előnézet/publikálás → publikus oldal folyamatának valós végponttól végpontig ellenőrzése. Ez nem a jelenlegi tervpont helyettesítője, és nem tekinthető PASS-nak előzetes bizonyíték nélkül.

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

## 34. Végső cél: teljes Brand & Creator Platform SANCI AI-val

Ez a terv nem pusztán streamer-weboldal vagy egy 1.0-s bemutatkozó oldal terve. A végső termék egy egységes, bővíthető **Brand & Creator Platform**, amely a személyes márkát, a publikus jelenlétet, a közönséget, a tartalomgyártást, a live működést, a bevételi modelleket és az AI-alapú munkafolyamatokat egy összefüggő rendszerbe szervezi.

### 34.1. A végső platform kötelező képességcsoportjai

- **Brand Identity & Brand OS:** márkanév, profilok, arculati tokenek, színek, tipográfia, logó- és médiakészlet, hangnem, márkairányelvek, kampányazonosítók, egységes márkamegjelenés minden csatornán és felületen.
- **Creator Website Platform:** vizuális weboldalépítő, oldalak, navigáció, rétegek és inspector, reszponzív nézetek, sablonok, újrafelhasználható komponensek, blokkok, CMS/tartalomtípusok, publikálás, domain/SEO/AEO, űrlapok, keresés, link hub és kampányoldalak.
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
- **Publikálás:** preview, staging, diff, jóváhagyás, publish/unpublish, verzió és rollback, domain és DNS állapot.
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

### 63.0.2. Tételes szemantikai audit — első lezárt ellenőrzési köteg: ADM-001–ADM-013

Az alábbi **13/396 ID** leírását a 24.1, 49.1 és kapcsolódó 49.16–49.19 fejezetekkel összevetve rögzítjük az első tételes **tervbeli szerep- és negatívteszt-elvárás** egyeztetését. Ez **nem implementációs PASS**, és nem bizonyítja az egyes ID-k 10. fejezet szerinti teljes feature contractját.

| ID | Konkrét Admin-belépés | Kanonikus tulajdonos | Pozitív elvárás | Kritikus negatív elvárás | Függőség |
| --- | --- | --- | --- | --- | --- |
| ADM-001 | 49.1 / Admin shell | ADM | navigáció jogosultság szerint, kanonikus route | jogosulatlan menü/action szerveroldalon is tiltott | SEC-002, ADM-009 |
| ADM-002 | 49.1 / Áttekintés | ADM olvasási aggregáció | forrásmodulok állapotkártyái és frissessége | hibás/hiányzó forrás részleges állapot, nem kitalált érték | ADM-013 |
| ADM-003 | 49.1 / Gyorsműveletek | ADM navigáció; művelet a cél-domainben | gyorsművelet a megfelelő felületre vagy domain-actionre vezet | nincs párhuzamos CRUD vagy jogosultságkerülés | ADM-001, SEC-002 |
| ADM-004 | 49.1 / Teendők | ADM aggregált olvasási nézet | hibák és teendők a kanonikus forrásukra mutatnak | nem duplikált workflow-/notification-rekord | NTF-001, AUT-008 |
| ADM-005 | 49.1 / Aktivitás | audit-esemény gazdája SEC; ADM csak nézet | auditösszefoglaló idővel és forráshivatkozással | érzékeny auditadat nem látszik jogosulatlannak | SEC-010 |
| ADM-006 | 49.1 / Fejléc keresés | SEARCH | globális kereső/command palette belépési pont | keresési találat nem kerülhet jogosultságon kívülre | SEARCH-001, SEARCH-002 |
| ADM-007 | 49.1 / Profil és kijelentkezés | IDENTITY/SEC | session-profil és logout a kanonikus auth szolgáltatáson | lejárt session és jogosulatlan művelet blokkolt | SEC-001, SEC-002 |
| ADM-008 | 49.1 / Közös UI állapotok | ADM megosztott prezentáció | loading/empty/error/stale/success következetes | hiba nem látszik hamis sikernek; domain-adat nem duplikált | ADM-013 |
| ADM-009 | 49.1 / Navigáció és műveletek | ADM megjelenítés; SEC enforcement | menü/action láthatóság szerep szerint | kliensoldali elrejtés nem jogosít fel API-hívásra | SEC-002 |
| ADM-010 | 49.1 / Mobil Admin shell | ADM | mobil/tablet navigáció és fókuszkezelés használható | keskeny nézetben nincs elveszett főművelet | QA-005 |
| ADM-011 | 49.1 / Kontextuális súgó | HELP | súgó a megfelelő HELP rekordot nyitja | nem készül második onboarding-progress tároló | HELP-001, HELP-002 |
| ADM-012 | 49.1 / Értesítés belépési pont | NTF | összesítőből kanonikus értesítésre navigál | nincs külön Dashboard-értesítés-életciklus | NTF-001, NTF-002 |
| ADM-013 | 49.1 / Adatfrissesség | ADM megjelenítés; forrás domain | adat időbélyege, stale/partial és forrás státusz látható | elavult/hiányzó provideradat nem jelölhető frissnek | ADM-002 |

**Nyitott pontosítások a kötegen belül:**
- Az `ADM-005` leírásában szereplő `AUDIT` domain nem önálló, 24. fejezetbeli `AUDIT-NNN` ID-család; a tényleges audit esemény tulajdonosi szerződését a SEC-010 és az 5. fejezet között kell egyértelműsíteni. Ez **nem automatikusan új Admin-modul**.
- Az `ADM-007` IDENTITY/SEC hivatkozása külön domainnevet használ; a session és a profil egyértelmű forrását a kóddal, tárolóval és 49.19 beállítási felülettel még ellenőrizni kell.
- A 13 ID **fázisa, adat/API sémája, pozitív és negatív automatizált tesztje, runtime bizonyítéka és készültsége nincs tételesen igazolva**. Az ezekhez tartozó bizonyíték hiánya nyitott, nem PASS.
- A következő szemantikai köteg `WEB-001–WEB-032`; a további 383 ID ugyanilyen részletességű auditja hátravan.

### 63.0.3. Tételes szemantikai audit — WEB-001–WEB-032

A 24.2, 49.2 és a kapcsolódó domainhatárok összevetése alapján a **32 webes képesség mindegyikéhez** külön felhasználói eredményt, kanonikus adatgazdát, negatív elfogadási feltételt és ellenőrzendő függőséget rögzítünk. Az alábbi elvárások **tervbeli audit-hipotézisek és szerződésminimumok**; nem állítják, hogy a runtime vagy tesztkód ezeket már teljesíti.

| ID | Konkrét képesség / aloldal | Elsődleges owner | Pozitív elvárás | Kritikus negatív elvárás | Függőség |
| --- | --- | --- | --- | --- | --- |
| WEB-001 | Oldallista, létrehozás és szerkesztés | WEB page repository | oldal létrejön/listázható saját site-on | másik site oldalának módosítása tiltott | EDT-001, SEC-002 |
| WEB-002 | Slug, hierarchia, URL-változás | WEB route registry | ütközésmentes canonical URL | ütköző slug és ciklikus hierarchia elutasítva | WEB-012, WEB-013 |
| WEB-003 | Másolás, archiválás és törlés | WEB page lifecycle | másolat új ID-val, archív visszaállítható | használt oldal törlése függőségfigyelmeztetés nélkül tiltott | WEB-001, WEB-009 |
| WEB-004 | Draft/published snapshot | WEB publication | piszkozat nem módosítja az éles snapshotot | nem publikált tartalom nem kerül publikus válaszba | WEB-031, EDT-033 |
| WEB-005 | Preview link és hozzáférés | WEB preview authorization | jogosult felhasználó látja a draftot | lejárt/kiszivárgott preview link nem nyit privát adatot | SEC-002, WEB-031 |
| WEB-006 | Publikálás előtti validáció | WEB publish pipeline | hibalista és publish report megjelenik | hibás schema/hiányzó asset nem ad hamis sikert | WEB-006, RES-008 |
| WEB-007 | Publish/unpublish/rollback | WEB publication lifecycle | verziózott állapotváltás és visszaállítás | részleges hiba nem hagy inkonzisztens publikus snapshotot | WEB-004, QA-007 |
| WEB-008 | Revízió és diff | WEB revisions | visszakereshető szerző és változás | idegen site revíziója nem olvasható | EDT-029, SEC-002 |
| WEB-009 | Navigációs fa | WEB navigation | egy kanonikus menüfa renderelődik | ciklikus/hiányzó célú menüelem nem publikálható észrevétlenül | WEB-002, WEB-012 |
| WEB-010 | Header/footer globális layout | WEB layout; DSN design token | közös layout minden kijelölt oldalon érvényesül | globális módosítás nem írja felül titokban az oldal override-ot | DSN-001, WEB-010 |
| WEB-011 | Mobil menü és billentyűzet | WEB navigation UI | mobil/keyboard fókusz és menüzárás működik | csak hoverrel elérhető menüpont nem maradhat | QA-005, WEB-009 |
| WEB-012 | Publikus route és 404 | WEB route registry | ismeretlen útvonal valódi 404-et ad | privát/admin útvonal nem jelenik meg publikus oldalként | WEB-002, WEB-031 |
| WEB-013 | Redirect és broken-link | WEB redirect registry | átirányítás és hibás link riport | redirect loop és nyílt átirányítás blokkolt | WEB-012, SEO-001 |
| WEB-014 | Nyilvános kezdőlap | WEB renderer | publikált kezdőlap megjelenik | draft moduladat nem szivárog | WEB-004, WEB-031 |
| WEB-015 | Nyilvános live oldal | WEB renderer; LIV state | live/offline fallback és frissesség jelölve | stale adat nem látszik biztosan élőnek | LIV-001, LIV-002 |
| WEB-016 | Nyilvános adásrend | WEB route; SCH adatgazda | SCH-010 projekcióból események | második schedule adatforrás nem készül | SCH-010, WEB-031 |
| WEB-017 | Nyilvános VOD hub | WEB route; CNT adatgazda | CNT-020 publikált tartalmak megjelennek | draft/privát VOD nem listázódik | CNT-020, WEB-031 |
| WEB-018 | Creator bemutatkozás | WEB renderer; creator profile | publikált profil megjelenik | privát fiók-/profiladat nem szivárog | WEB-031 |
| WEB-019 | Közösségi oldal és CTA | WEB route; COM adatgazda | közösségi belépési pont a megfelelő modulhoz vezet | jogosultság nélküli közösségi tartalom nem látszik | COM-001, WEB-031 |
| WEB-020 | Kapcsolat és űrlap | WEB forms; beküldés domain szerződés tisztázandó | validált beküldés és visszajelzés | spam/CSRF/PII-kiszivárgás blokkolt | SEC-009, WEB-032 |
| WEB-021 | Creator Resources oldal | WEB route; RES asset owner | publikált erőforrások megjelennek | privát/lejárt asset nem tölthető le | RES-014, WEB-031 |
| WEB-022 | Link Hub | WEB route; link registry | érvényes publikus linkek elérhetők | veszélyes javascript URL és open redirect tiltott | WEB-032 |
| WEB-023 | Támogatási oldal | WEB route; SUP adatgazda | támogatási CTA a szolgáltatóhoz vezet | sikertelen fizetés nem jelölhető támogatásnak | SUP-001, INT-018 |
| WEB-024 | Szponzor/Press Kit | WEB route; CAM adatgazda | jóváhagyott media kit publikált | bizalmas deal/rate card nem jelenik meg engedély nélkül | CAM-001, WEB-031 |
| WEB-025 | Bolt/termékoldalak | WEB route; STO adatgazda | publikált termékadat és checkout link | nem elérhető termék vagy hibás ár nem vásárolható meg | STO-001, STO-005 |
| WEB-026 | Tagsági felület | WEB route; SUP entitlement | taghoz kötött hozzáférés ellenőrzött | kliensoldali paywall megkerülése nem engedélyezett | SUP-006, SEC-002 |
| WEB-027 | Esemény/blog/hírek/digitális termék | WEB routes; SCH/CNT/STO adatgazdák | publikált rekordok a saját útvonalon látszanak | nem készül párhuzamos üzleti tároló | SCH-010, CNT-020, STO-001 |
| WEB-028 | Hiba/maintenance/offline | WEB public fallback | használható, biztonságos hibaképernyő | stack trace vagy titok nem kerül a válaszba | OPS-008, SEC-011 |
| WEB-029 | Publikus keresés | WEB public search; SEARCH Admin index külön scope | csak publikus rekord kereshető | privát találat/snippet nem indexelhető | WEB-031, SEARCH-002 |
| WEB-030 | Cache és invalidáció | WEB cache lifecycle | publikálás után friss snapshot szolgálódik ki | unpublish után régi privát snapshot nem marad cache-ben | WEB-004, WEB-031 |
| WEB-031 | Published-only enforcement | WEB authorization/public projection | publikus API kizárólag publikált adatot ad | draft vagy másik site adata nem szivárog | SEC-002, WEB-004 |
| WEB-032 | Biztonságos renderer/embed | WEB renderer security | engedélyezett embed működik | XSS, script URL és nem engedélyezett iframe tiltott | SEC-009, EDT-034 |

**Keresztmodulú ütközések és nyitott döntések:**
- A `WEB-020` űrlapbeküldések szerveroldali gazdája és adatmegőrzési szabálya külön pontosítandó; a 49.2 a webes űrlap-összeállítást, nem automatikusan a CRM-et vagy értesítési kézbesítést birtokolja.
- A `WEB-029` publikus keresőindex és a `SEARCH` család Admin-keresője eltérő jogosultsági határt követel; közös infrastruktúra megengedett, de a privát rekordok publikus indexbe kerülése tiltott.
- A `WEB-025` és `WEB-026` oldalak csak a `STO` és `SUP` domain kanonikus termék-/entitlement-rekordját használhatják; nincs párhuzamos checkout vagy tagsági státusz.
- A `WEB-016` és `WEB-017` a `SCH-010`, illetve `CNT-020` publikált projekcióját fogyasztják; a Visual Editor csak elhelyezést és megjelenítést konfigurálhat.
- A 32 ID tételes **fázisa, pontos request/response schema, teljes jogosultsági mátrixa, teszt- és éles bizonyítéka még nyitott**. További követelmény- és kódvizsgálat szükséges.

**Haladás:** `ADM-001–013` és `WEB-001–032` = **45/396 ID** dokumentált, első körös tételes szemantikai elvárás-egyeztetés. **Nem** teljes feature-contract vagy implementációs PASS; a 351 további ID és a történeti forráshiány változatlanul nyitott.

### 63.0.4. Tételes Editor-audit — EDT-001–EDT-044 (követelmény- és kockázati mátrix)

A 24.3 fejezet **44 egyedi ID-ját** az Editor saját feladatkörei szerint, egyenkénti sorokban és **10 megosztott ellenőrzési szerződéscsaláddal** rendeltük el. A csoportszintű pozitív/negatív feltétel minden hozzátartozó sorra kötelező minimum; az egyes ID-k egyedi, futtatható tesztjét és kódhelyét még külön kell bizonyítani. Ez **nem 44 teljes szemantikai PASS**.

| ID | Megőrzött képesség | Admin-aloldal | Owner / adatgazda | Pozitív szerződésminimum | Kritikus negatív szerződésminimum | Függőség |
| --- | --- | --- | --- | --- | --- | --- |
| EDT-001 | Canonical Page Model schema/version. | Page Model / Commands | EDT Page Model és command pipeline | schema- és verzióhelyes, determinisztikus módosítás/undo | hibás node, ciklus, félbeszakadt batch vagy redo-korrupció nem menthető | EDT-001, EDT-003 |
| EDT-002 | Node IDs and parent/child invariants. | Page Model / Commands | EDT Page Model és command pipeline | schema- és verzióhelyes, determinisztikus módosítás/undo | hibás node, ciklus, félbeszakadt batch vagy redo-korrupció nem menthető | EDT-001, EDT-003 |
| EDT-003 | Command mutation pipeline. | Page Model / Commands | EDT Page Model és command pipeline | schema- és verzióhelyes, determinisztikus módosítás/undo | hibás node, ciklus, félbeszakadt batch vagy redo-korrupció nem menthető | EDT-001, EDT-003 |
| EDT-004 | Transaction/batch/rollback semantics. | Page Model / Commands | EDT Page Model és command pipeline | schema- és verzióhelyes, determinisztikus módosítás/undo | hibás node, ciklus, félbeszakadt batch vagy redo-korrupció nem menthető | EDT-001, EDT-003 |
| EDT-005 | Undo/redo history integrity. | Page Model / Commands | EDT Page Model és command pipeline | schema- és verzióhelyes, determinisztikus módosítás/undo | hibás node, ciklus, félbeszakadt batch vagy redo-korrupció nem menthető | EDT-001, EDT-003 |
| EDT-006 | Selection state synchronization. | Canvas / Layers | EDT UI state; Page Model csak commandon át | kijelölés, geometria és rétegfa konzisztens | zárolt elem, hibás parent vagy viewport-váltás nem sérti a dokumentumot | EDT-002, EDT-003, EDT-021 |
| EDT-007 | Canvas viewport, zoom, pan and fit. | Canvas / Layers | EDT UI state; Page Model csak commandon át | kijelölés, geometria és rétegfa konzisztens | zárolt elem, hibás parent vagy viewport-váltás nem sérti a dokumentumot | EDT-002, EDT-003, EDT-021 |
| EDT-008 | Canvas drag/drop. | Canvas / Layers | EDT UI state; Page Model csak commandon át | kijelölés, geometria és rétegfa konzisztens | zárolt elem, hibás parent vagy viewport-váltás nem sérti a dokumentumot | EDT-002, EDT-003, EDT-021 |
| EDT-009 | Canvas resize/geometry constraints. | Canvas / Layers | EDT UI state; Page Model csak commandon át | kijelölés, geometria és rétegfa konzisztens | zárolt elem, hibás parent vagy viewport-váltás nem sérti a dokumentumot | EDT-002, EDT-003, EDT-021 |
| EDT-010 | Alignment guides/snap/grid. | Canvas / Layers | EDT UI state; Page Model csak commandon át | kijelölés, geometria és rétegfa konzisztens | zárolt elem, hibás parent vagy viewport-váltás nem sérti a dokumentumot | EDT-002, EDT-003, EDT-021 |
| EDT-011 | Reorder/reparent/duplicate/delete. | Canvas / Layers | EDT UI state; Page Model csak commandon át | kijelölés, geometria és rétegfa konzisztens | zárolt elem, hibás parent vagy viewport-váltás nem sérti a dokumentumot | EDT-002, EDT-003, EDT-021 |
| EDT-012 | Layers tree expand/collapse. | Canvas / Layers | EDT UI state; Page Model csak commandon át | kijelölés, geometria és rétegfa konzisztens | zárolt elem, hibás parent vagy viewport-váltás nem sérti a dokumentumot | EDT-002, EDT-003, EDT-021 |
| EDT-013 | Layers/canvas/Inspector selection sync. | Canvas / Layers | EDT UI state; Page Model csak commandon át | kijelölés, geometria és rétegfa konzisztens | zárolt elem, hibás parent vagy viewport-váltás nem sérti a dokumentumot | EDT-002, EDT-003, EDT-021 |
| EDT-014 | Layer rename/hide/lock and hierarchy. | Canvas / Layers | EDT UI state; Page Model csak commandon át | kijelölés, geometria és rétegfa konzisztens | zárolt elem, hibás parent vagy viewport-váltás nem sérti a dokumentumot | EDT-002, EDT-003, EDT-021 |
| EDT-015 | Element/Block Library and search. | Block Library / Canvas | EDT block registry; adatforrás a saját domainben | érvényes komponens beilleszthető és megjeleníthető | ismeretlen blokk vagy privát domainadat nem kerülhet publikálásba | EDT-001, RES-010, WEB-031 |
| EDT-016 | Section/Container/Stack/Row/Columns/Grid. | Block Library / Canvas | EDT block registry; adatforrás a saját domainben | érvényes komponens beilleszthető és megjeleníthető | ismeretlen blokk vagy privát domainadat nem kerülhet publikálásba | EDT-001, RES-010, WEB-031 |
| EDT-017 | Text/Heading/Link/Button/Icon/Divider/Spacer. | Block Library / Canvas | EDT block registry; adatforrás a saját domainben | érvényes komponens beilleszthető és megjeleníthető | ismeretlen blokk vagy privát domainadat nem kerülhet publikálásba | EDT-001, RES-010, WEB-031 |
| EDT-018 | Image/Video/Embed/List/Card/Badge. | Block Library / Canvas | EDT block registry; adatforrás a saját domainben | érvényes komponens beilleszthető és megjeleníthető | ismeretlen blokk vagy privát domainadat nem kerülhet publikálásba | EDT-001, RES-010, WEB-031 |
| EDT-019 | Table/Accordion/Tabs/Form capability. | Block Library / Canvas | EDT block registry; adatforrás a saját domainben | érvényes komponens beilleszthető és megjeleníthető | ismeretlen blokk vagy privát domainadat nem kerülhet publikálásba | EDT-001, RES-010, WEB-031 |
| EDT-020 | Dynamic Sanci block configuration. | Block Library / Canvas | EDT block registry; adatforrás a saját domainben | érvényes komponens beilleszthető és megjeleníthető | ismeretlen blokk vagy privát domainadat nem kerülhet publikálásba | EDT-001, RES-010, WEB-031 |
| EDT-021 | Inspector Property Registry. | Inspector / Responsive | EDT property registry; DSN tokenhivatkozás | feloldott érték és override egyértelmű | érvénytelen property vagy hibás breakpoint-öröklés nem írható | EDT-021, DSN-001 |
| EDT-022 | Inspector schema validation and control types. | Inspector / Responsive | EDT property registry; DSN tokenhivatkozás | feloldott érték és override egyértelmű | érvénytelen property vagy hibás breakpoint-öröklés nem írható | EDT-021, DSN-001 |
| EDT-023 | Inspector resolved viewport value. | Inspector / Responsive | EDT property registry; DSN tokenhivatkozás | feloldott érték és override egyértelmű | érvénytelen property vagy hibás breakpoint-öröklés nem írható | EDT-021, DSN-001 |
| EDT-024 | Responsive override/inheritance/reset. | Inspector / Responsive | EDT property registry; DSN tokenhivatkozás | feloldott érték és override egyértelmű | érvénytelen property vagy hibás breakpoint-öröklés nem írható | EDT-021, DSN-001 |
| EDT-025 | Responsive desktop/tablet/mobile preview. | Inspector / Responsive | EDT property registry; DSN tokenhivatkozás | feloldott érték és override egyértelmű | érvénytelen property vagy hibás breakpoint-öröklés nem írható | EDT-021, DSN-001 |
| EDT-026 | Responsive visibility/order/column changes. | Inspector / Responsive | EDT property registry; DSN tokenhivatkozás | feloldott érték és override egyértelmű | érvénytelen property vagy hibás breakpoint-öröklés nem írható | EDT-021, DSN-001 |
| EDT-027 | Dirty state and explicit Save Draft. | Mentés / Preview / Publish | EDT draft UI és WEB publication lifecycle | draft round-trip, preview és explicit publish elkülönül | stale revision, timeout vagy mentés közbeni edit nem veszhet el és nem publikálódhat véletlenül | WEB-004, WEB-007, EDT-029 |
| EDT-028 | Save/reload round-trip. | Mentés / Preview / Publish | EDT draft UI és WEB publication lifecycle | draft round-trip, preview és explicit publish elkülönül | stale revision, timeout vagy mentés közbeni edit nem veszhet el és nem publikálódhat véletlenül | WEB-004, WEB-007, EDT-029 |
| EDT-029 | Revision conflict recovery. | Mentés / Preview / Publish | EDT draft UI és WEB publication lifecycle | draft round-trip, preview és explicit publish elkülönül | stale revision, timeout vagy mentés közbeni edit nem veszhet el és nem publikálódhat véletlenül | WEB-004, WEB-007, EDT-029 |
| EDT-030 | In-flight edit preservation during save. | Mentés / Preview / Publish | EDT draft UI és WEB publication lifecycle | draft round-trip, preview és explicit publish elkülönül | stale revision, timeout vagy mentés közbeni edit nem veszhet el és nem publikálódhat véletlenül | WEB-004, WEB-007, EDT-029 |
| EDT-031 | Network failure/retry/local recovery. | Mentés / Preview / Publish | EDT draft UI és WEB publication lifecycle | draft round-trip, preview és explicit publish elkülönül | stale revision, timeout vagy mentés közbeni edit nem veszhet el és nem publikálódhat véletlenül | WEB-004, WEB-007, EDT-029 |
| EDT-032 | Preview without publishing. | Mentés / Preview / Publish | EDT draft UI és WEB publication lifecycle | draft round-trip, preview és explicit publish elkülönül | stale revision, timeout vagy mentés közbeni edit nem veszhet el és nem publikálódhat véletlenül | WEB-004, WEB-007, EDT-029 |
| EDT-033 | Explicit publish separate from save. | Mentés / Preview / Publish | EDT draft UI és WEB publication lifecycle | draft round-trip, preview és explicit publish elkülönül | stale revision, timeout vagy mentés közbeni edit nem veszhet el és nem publikálódhat véletlenül | WEB-004, WEB-007, EDT-029 |
| EDT-034 | Public renderer parity with Editor preview. | Mentés / Preview / Publish | EDT draft UI és WEB publication lifecycle | draft round-trip, preview és explicit publish elkülönül | stale revision, timeout vagy mentés közbeni edit nem veszhet el és nem publikálódhat véletlenül | WEB-004, WEB-007, EDT-029 |
| EDT-035 | Mobile Editor action bar/safe area. | Mobil / Accessibility | EDT UI | mobil és billentyűzetes feladatút használható | fókuszvesztés, hozzáférhetetlen művelet és rejtett adatvesztés tiltott | QA-005, EDT-003 |
| EDT-036 | Mobile Layers/Inspector panel switching. | Mobil / Accessibility | EDT UI | mobil és billentyűzetes feladatút használható | fókuszvesztés, hozzáférhetetlen művelet és rejtett adatvesztés tiltott | QA-005, EDT-003 |
| EDT-037 | Keyboard-accessible canvas alternatives. | Mobil / Accessibility | EDT UI | mobil és billentyűzetes feladatút használható | fókuszvesztés, hozzáférhetetlen művelet és rejtett adatvesztés tiltott | QA-005, EDT-003 |
| EDT-038 | Copy/paste and multi-select where enabled. | Mobil / Accessibility | EDT UI | mobil és billentyűzetes feladatút használható | fókuszvesztés, hozzáférhetetlen művelet és rejtett adatvesztés tiltott | QA-005, EDT-003 |
| EDT-039 | Page-level interaction/action schema registry for Editor-configured page behavior; not the automation engine action catalog. | Oldalinterakció / Mozgás | EDT page action schema; AUT workflow külön | engedélyezett oldalinterakció és reduced-motion működik | tiltott script/action vagy kötelező animáció nem futhat | WEB-032, QA-005 |
| EDT-040 | Motion/reduced-motion behavior. | Oldalinterakció / Mozgás | EDT page action schema; AUT workflow külön | engedélyezett oldalinterakció és reduced-motion működik | tiltott script/action vagy kötelező animáció nem futhat | WEB-032, QA-005 |
| EDT-041 | Empty-project onboarding and template start. | Onboarding / Helyreállítás | EDT UI; HELP onboarding tartalom | új és hibás projektből biztonságos folytatás | sablonindítás vagy retry nem írhat felül nem mentett munkát | HELP-002, EDT-031 |
| EDT-042 | Editor error recovery and no-data-loss guard. | Onboarding / Helyreállítás | EDT UI; HELP onboarding tartalom | új és hibás projektből biztonságos folytatás | sablonindítás vagy retry nem írhat felül nem mentett munkát | HELP-002, EDT-031 |
| EDT-043 | Advanced Rich Text editor and structured inline/block content; planned after the 1.0 plain-text baseline, gated by schema, safe renderer, accessibility and round-trip tests. | Rich Text — 1.0 utáni | EDT text schema; WEB safe renderer | strukturált rich text round-trip és akadálymentes render | HTML/XSS vagy inkompatibilis migráció nem fogadható el | EDT-001, WEB-032, QA-005 |
| EDT-044 | Per-user Editor workspace preferences (viewport, panel layout, grid and favorites) stored outside the site Page Model. | Editor személyes munkaterület | felhasználói Editor-preferenciák; nem Page Model | panel/grid/favorites személyenként visszatölt | egy felhasználó preferenciája nem módosíthatja a publikus oldalt | ADM-007, EDT-001 |

**Ellenőrzés során azonosított kiemelt kockázatok:**
- `EDT-003–005`: az undo/redo nem lehet csak vizuális trükk; minden módosítás a kanonikus Page Model command-útján halad.
- `EDT-020`: a dinamikus stream, schedule, content, shop és membership blokk nem másolja a forrásdomain rekordjait.
- `EDT-027–034`: Save Draft, Preview és Publish három külön állapot; race, stale revision és rollback negatív teszt kötelező.
- `EDT-037`, `EDT-040`: billentyűzetes alternatíva és reduced-motion önálló, ellenőrizhető elfogadási feltétel.
- `EDT-039`: az oldalinterakciók schema-regisztere nem azonos a 49.14 automatizációs motorral.
- `EDT-043`: rich text a dokumentált 1.0 plain-text alap után tervezett, nem igazoltan kész.
- `EDT-044`: felhasználói Editor-preferenciák nem kerülhetnek a publikált Page Modelbe.

**Haladás:** első körös, egyedi soros szerep-/kockázati egyeztetés **89/396** (`ADM 13 + WEB 32 + EDT 44`). A 307 további ID, az egyedi request/response/permission/phase/teszt bizonyíték és a hiányzó történeti forrás továbbra is nyitott. **Kapustátusz: IN PROGRESS / NOT PASS.**

### 63.0.5. Tételes besorolás és kockázati szerződés — DSN-001–018, RES-001–016, INT-001–021

A 24.4–24.6 fejezet **55 egyedi ID-ját** a 49.3, 49.4 és 49.7 kanonikus modulokhoz rendeltük. A táblázat minden ID-nál megőrzi az eredeti képességnevet, és rögzíti a minimális pozitív/negatív szerződést, adatgazdát és függőséget. A közös szerződéscsaládok nem helyettesítik az egyedi futtatható tesztet, API-sémát, permission-mátrixot vagy implementációs bizonyítékot.

| ID | Képesség | Admin-belépés | Kanonikus adatgazda | Pozitív minimum | Negatív minimum | Függőség |
| --- | --- | --- | --- | --- | --- | --- |
| DSN-001 | Global design token schema. | 49.3 / Brand Kit és tokenek | DSN design registry; font asset ID a RES-ben | változás preview, verzió és használati hatás alapján látszik | globális token módosítása nem törölhet lokális override-ot vagy használatban lévő fontot | RES-013, EDT-024 |
| DSN-002 | Token editor and live preview. | 49.3 / Brand Kit és tokenek | DSN design registry; font asset ID a RES-ben | változás preview, verzió és használati hatás alapján látszik | globális token módosítása nem törölhet lokális override-ot vagy használatban lévő fontot | RES-013, EDT-024 |
| DSN-003 | Token usage/dependency map. | 49.3 / Brand Kit és tokenek | DSN design registry; font asset ID a RES-ben | változás preview, verzió és használati hatás alapján látszik | globális token módosítása nem törölhet lokális override-ot vagy használatban lévő fontot | RES-013, EDT-024 |
| DSN-004 | Global change diff and rollback. | 49.3 / Brand Kit és tokenek | DSN design registry; font asset ID a RES-ben | változás preview, verzió és használati hatás alapján látszik | globális token módosítása nem törölhet lokális override-ot vagy használatban lévő fontot | RES-013, EDT-024 |
| DSN-005 | Theme and brand presets. | 49.3 / Brand Kit és tokenek | DSN design registry; font asset ID a RES-ben | változás preview, verzió és használati hatás alapján látszik | globális token módosítása nem törölhet lokális override-ot vagy használatban lévő fontot | RES-013, EDT-024 |
| DSN-006 | Responsive defaults and breakpoint tokens. | 49.3 / Brand Kit és tokenek | DSN design registry; font asset ID a RES-ben | változás preview, verzió és használati hatás alapján látszik | globális token módosítása nem törölhet lokális override-ot vagy használatban lévő fontot | RES-013, EDT-024 |
| DSN-007 | Typography/font registry. | 49.3 / Brand Kit és tokenek | DSN design registry; font asset ID a RES-ben | változás preview, verzió és használati hatás alapján látszik | globális token módosítása nem törölhet lokális override-ot vagy használatban lévő fontot | RES-013, EDT-024 |
| DSN-008 | Site template library. | 49.3 / Sablonok és közös komponensek | DSN template/component registry; WEB/EDT fogyasztó | sablon, instance, verzió és export kompatibilisen újrahasznosítható | nem kompatibilis migráció vagy globális felülírás nem okozhat néma adatvesztést | EDT-001, WEB-008 |
| DSN-009 | Page template library. | 49.3 / Sablonok és közös komponensek | DSN template/component registry; WEB/EDT fogyasztó | sablon, instance, verzió és export kompatibilisen újrahasznosítható | nem kompatibilis migráció vagy globális felülírás nem okozhat néma adatvesztést | EDT-001, WEB-008 |
| DSN-010 | Section template library. | 49.3 / Sablonok és közös komponensek | DSN template/component registry; WEB/EDT fogyasztó | sablon, instance, verzió és export kompatibilisen újrahasznosítható | nem kompatibilis migráció vagy globális felülírás nem okozhat néma adatvesztést | EDT-001, WEB-008 |
| DSN-011 | Component template library. | 49.3 / Sablonok és közös komponensek | DSN template/component registry; WEB/EDT fogyasztó | sablon, instance, verzió és export kompatibilisen újrahasznosítható | nem kompatibilis migráció vagy globális felülírás nem okozhat néma adatvesztést | EDT-001, WEB-008 |
| DSN-012 | Reusable component/symbol master-instance. | 49.3 / Sablonok és közös komponensek | DSN template/component registry; WEB/EDT fogyasztó | sablon, instance, verzió és export kompatibilisen újrahasznosítható | nem kompatibilis migráció vagy globális felülírás nem okozhat néma adatvesztést | EDT-001, WEB-008 |
| DSN-013 | Variants, slots and explicit overrides. | 49.3 / Sablonok és közös komponensek | DSN template/component registry; WEB/EDT fogyasztó | sablon, instance, verzió és export kompatibilisen újrahasznosítható | nem kompatibilis migráció vagy globális felülírás nem okozhat néma adatvesztést | EDT-001, WEB-008 |
| DSN-014 | Design/template/component versioning, compatibility and migration; excludes AI prompt/template versioning. | 49.3 / Sablonok és közös komponensek | DSN template/component registry; WEB/EDT fogyasztó | sablon, instance, verzió és export kompatibilisen újrahasznosítható | nem kompatibilis migráció vagy globális felülírás nem okozhat néma adatvesztést | EDT-001, WEB-008 |
| DSN-015 | Template import/export. | 49.3 / Sablonok és közös komponensek | DSN template/component registry; WEB/EDT fogyasztó | sablon, instance, verzió és export kompatibilisen újrahasznosítható | nem kompatibilis migráció vagy globális felülírás nem okozhat néma adatvesztést | EDT-001, WEB-008 |
| DSN-016 | Button Registry and global button styles. | 49.3 / Gombok, ikonok, piactér | DSN stílus és szemantika; RES ikon asset; MKT piactér | egységes registry és hivatkozás működik | ikon-/komponensduplikáció vagy ellenőrizetlen külső sablon nem aktiválódhat | RES-011, MKT-001 |
| DSN-017 | Icon/action registry linkage. | 49.3 / Gombok, ikonok, piactér | DSN stílus és szemantika; RES ikon asset; MKT piactér | egységes registry és hivatkozás működik | ikon-/komponensduplikáció vagy ellenőrizetlen külső sablon nem aktiválódhat | RES-011, MKT-001 |
| DSN-018 | Future community/marketplace templates. | 49.3 / Gombok, ikonok, piactér | DSN stílus és szemantika; RES ikon asset; MKT piactér | egységes registry és hivatkozás működik | ikon-/komponensduplikáció vagy ellenőrizetlen külső sablon nem aktiválódhat | RES-011, MKT-001 |
| RES-001 | Canonical asset registry and IDs. | 49.4 / Asset-regiszter és feltöltés | RES asset ID/meta D1 és bináris R2 | validált feltöltés feldolgozható, visszakereshető | hibás MIME, túlméret, félbeszakadt feltöltés nem ad kész assetet | SEC-002, RES-012 |
| RES-002 | R2 binary storage and D1 metadata. | 49.4 / Asset-regiszter és feltöltés | RES asset ID/meta D1 és bináris R2 | validált feltöltés feldolgozható, visszakereshető | hibás MIME, túlméret, félbeszakadt feltöltés nem ad kész assetet | SEC-002, RES-012 |
| RES-003 | Upload validation/progress/cancel/retry. | 49.4 / Asset-regiszter és feltöltés | RES asset ID/meta D1 és bináris R2 | validált feltöltés feldolgozható, visszakereshető | hibás MIME, túlméret, félbeszakadt feltöltés nem ad kész assetet | SEC-002, RES-012 |
| RES-004 | Image preview/thumbnail/variant, crop/resize and optimization pipeline. | 49.4 / Asset-regiszter és feltöltés | RES asset ID/meta D1 és bináris R2 | validált feltöltés feldolgozható, visszakereshető | hibás MIME, túlméret, félbeszakadt feltöltés nem ad kész assetet | SEC-002, RES-012 |
| RES-005 | Search/filter/sort/pagination over the canonical asset registry only. | 49.4 / Könyvtár, jogok és életciklus | RES metadata, reference graph | keresés, licencek és usage map konzisztens | használt/privát asset nem törölhető vagy listázható jogosulatlanul | RES-001, WEB-031 |
| RES-006 | Asset-library collections/tags/folders; excludes content and product taxonomies. | 49.4 / Könyvtár, jogok és életciklus | RES metadata, reference graph | keresés, licencek és usage map konzisztens | használt/privát asset nem törölhető vagy listázható jogosulatlanul | RES-001, WEB-031 |
| RES-007 | Alt text/caption/license/source metadata. | 49.4 / Könyvtár, jogok és életciklus | RES metadata, reference graph | keresés, licencek és usage map konzisztens | használt/privát asset nem törölhető vagy listázható jogosulatlanul | RES-001, WEB-031 |
| RES-008 | Asset usage/reference map. | 49.4 / Könyvtár, jogok és életciklus | RES metadata, reference graph | keresés, licencek és usage map konzisztens | használt/privát asset nem törölhető vagy listázható jogosulatlanul | RES-001, WEB-031 |
| RES-009 | Replace/archive/delete/restore safety. | 49.4 / Könyvtár, jogok és életciklus | RES metadata, reference graph | keresés, licencek és usage map konzisztens | használt/privát asset nem törölhető vagy listázható jogosulatlanul | RES-001, WEB-031 |
| RES-010 | Editor asset picker. | 49.4 / Picker, ikon és font | RES registry; DSN csak brand/token-hivatkozás | Editor ugyanazt az asset ID-t választja ki | SVG/script, nem engedélyezett font vagy másolat registry nélkül tiltott | EDT-018, DSN-017 |
| RES-011 | Icon registry/search/category/preview. | 49.4 / Picker, ikon és font | RES registry; DSN csak brand/token-hivatkozás | Editor ugyanazt az asset ID-t választja ki | SVG/script, nem engedélyezett font vagy másolat registry nélkül tiltott | EDT-018, DSN-017 |
| RES-012 | SVG safety and sanitization. | 49.4 / Picker, ikon és font | RES registry; DSN csak brand/token-hivatkozás | Editor ugyanazt az asset ID-t választja ki | SVG/script, nem engedélyezett font vagy másolat registry nélkül tiltott | EDT-018, DSN-017 |
| RES-013 | Font registry/weight/style/fallback. | 49.4 / Picker, ikon és font | RES registry; DSN csak brand/token-hivatkozás | Editor ugyanazt az asset ID-t választja ki | SVG/script, nem engedélyezett font vagy másolat registry nélkül tiltott | EDT-018, DSN-017 |
| RES-014 | File download authorization/expiry. | 49.4 / Hozzáférés és diagnosztika | RES access lifecycle; SUP entitlement ellenőrzés | jogosult letöltés és hibás referencia diagnosztika | lejárt link vagy visszavont entitlement nem enged hozzáférést | SUP-006, SEC-002 |
| RES-015 | Media diagnostics and broken asset scan. | 49.4 / Hozzáférés és diagnosztika | RES access lifecycle; SUP entitlement ellenőrzés | jogosult letöltés és hibás referencia diagnosztika | lejárt link vagy visszavont entitlement nem enged hozzáférést | SUP-006, SEC-002 |
| RES-016 | Paid/private asset access integration. | 49.4 / Hozzáférés és diagnosztika | RES access lifecycle; SUP entitlement ellenőrzés | jogosult letöltés és hibás referencia diagnosztika | lejárt link vagy visszavont entitlement nem enged hozzáférést | SUP-006, SEC-002 |
| INT-001 | Shared external-provider adapter contract; domain modules such as Store implement their specific workflows through this contract. | 49.7 / Adapterek és állapot | INT provider contract és connection registry | provider képesség és állapot látható | nem támogatott API-képesség nem jelenhet meg elérhetőként | INT-018 |
| INT-002 | Integration overview and health. | 49.7 / Adapterek és állapot | INT provider contract és connection registry | provider képesség és állapot látható | nem támogatott API-képesség nem jelenhet meg elérhetőként | INT-018 |
| INT-003 | OAuth state/callback/CSRF protection. | 49.7 / Csatlakozás és tokenek | INT OAuth state/token/connection; SEC auth policy | engedélyezett site/account kapcsolat létrejön és visszavonható | CSRF, lejárt token, rossz site vagy scope blokkolt | SEC-002, SEC-009 |
| INT-004 | Token lifecycle/refresh/revoke. | 49.7 / Csatlakozás és tokenek | INT OAuth state/token/connection; SEC auth policy | engedélyezett site/account kapcsolat létrejön és visszavonható | CSRF, lejárt token, rossz site vagy scope blokkolt | SEC-002, SEC-009 |
| INT-005 | Site ownership and connection binding. | 49.7 / Csatlakozás és tokenek | INT OAuth state/token/connection; SEC auth policy | engedélyezett site/account kapcsolat létrejön és visszavonható | CSRF, lejárt token, rossz site vagy scope blokkolt | SEC-002, SEC-009 |
| INT-006 | Scope/permission visibility. | 49.7 / Csatlakozás és tokenek | INT OAuth state/token/connection; SEC auth policy | engedélyezett site/account kapcsolat létrejön és visszavonható | CSRF, lejárt token, rossz site vagy scope blokkolt | SEC-002, SEC-009 |
| INT-007 | Connect/reconnect/disconnect flow. | 49.7 / Csatlakozás és tokenek | INT OAuth state/token/connection; SEC auth policy | engedélyezett site/account kapcsolat létrejön és visszavonható | CSRF, lejárt token, rossz site vagy scope blokkolt | SEC-002, SEC-009 |
| INT-008 | Sync history, retry and provider errors. | 49.7 / Szinkron és Twitch | INT adapter; LIV/SCH/CNT domainadatok külön | szinkron visszakereshető és hibakezelhető | rate limit, duplikált esemény vagy stale adat nem okoz hamis sikerállapotot | SCH-007, LIV-002 |
| INT-009 | Rate-limit/quota handling. | 49.7 / Szinkron és Twitch | INT adapter; LIV/SCH/CNT domainadatok külön | szinkron visszakereshető és hibakezelhető | rate limit, duplikált esemény vagy stale adat nem okoz hamis sikerállapotot | SCH-007, LIV-002 |
| INT-010 | Twitch OAuth and channel binding. | 49.7 / Szinkron és Twitch | INT adapter; LIV/SCH/CNT domainadatok külön | szinkron visszakereshető és hibakezelhető | rate limit, duplikált esemény vagy stale adat nem okoz hamis sikerállapotot | SCH-007, LIV-002 |
| INT-011 | Twitch live/schedule data. | 49.7 / Szinkron és Twitch | INT adapter; LIV/SCH/CNT domainadatok külön | szinkron visszakereshető és hibakezelhető | rate limit, duplikált esemény vagy stale adat nem okoz hamis sikerállapotot | SCH-007, LIV-002 |
| INT-012 | Twitch VOD/clip metadata where allowed. | 49.7 / Szinkron és Twitch | INT adapter; LIV/SCH/CNT domainadatok külön | szinkron visszakereshető és hibakezelhető | rate limit, duplikált esemény vagy stale adat nem okoz hamis sikerállapotot | SCH-007, LIV-002 |
| INT-013 | YouTube channel/video/live adapter. | 49.7 / Platformkapcsolatok | INT provider account; üzleti funkció a célmodulban | capability-gated kapcsolat támogatott API szerint | hiányzó scope vagy tiltott provider funkció nem ígérhető | INT-018, SEC-002 |
| INT-014 | TikTok capability-gated adapter. | 49.7 / Platformkapcsolatok | INT provider account; üzleti funkció a célmodulban | capability-gated kapcsolat támogatott API szerint | hiányzó scope vagy tiltott provider funkció nem ígérhető | INT-018, SEC-002 |
| INT-015 | Discord bot/guild/channel/role integration. | 49.7 / Platformkapcsolatok | INT provider account; üzleti funkció a célmodulban | capability-gated kapcsolat támogatott API szerint | hiányzó scope vagy tiltott provider funkció nem ígérhető | INT-018, SEC-002 |
| INT-016 | Kick capability-gated adapter. | 49.7 / Platformkapcsolatok | INT provider account; üzleti funkció a célmodulban | capability-gated kapcsolat támogatott API szerint | hiányzó scope vagy tiltott provider funkció nem ígérhető | INT-018, SEC-002 |
| INT-017 | Provider webhook subscription/delivery lifecycle and integration of signature/replay defenses; shared security requirements are defined by SEC-009. | 49.7 / Webhook, biztonság, bővítés | INT webhook lifecycle és adapter registry; SEC biztonsági policy | aláírt esemény, retry, diagnosztika és provider bővítés | replay, secret leak, hibás signature és korlát nélküli retry tiltott | SEC-009, OPS-008 |
| INT-018 | External integration/provider capability registry for social, streaming and commerce adapters; excludes AI model/provider configuration. | 49.7 / Webhook, biztonság, bővítés | INT webhook lifecycle és adapter registry; SEC biztonsági policy | aláírt esemény, retry, diagnosztika és provider bővítés | replay, secret leak, hibás signature és korlát nélküli retry tiltott | SEC-009, OPS-008 |
| INT-019 | Integration secret redaction and audit. | 49.7 / Webhook, biztonság, bővítés | INT webhook lifecycle és adapter registry; SEC biztonsági policy | aláírt esemény, retry, diagnosztika és provider bővítés | replay, secret leak, hibás signature és korlát nélküli retry tiltott | SEC-009, OPS-008 |
| INT-020 | Integration diagnostics and recovery. | 49.7 / Webhook, biztonság, bővítés | INT webhook lifecycle és adapter registry; SEC biztonsági policy | aláírt esemény, retry, diagnosztika és provider bővítés | replay, secret leak, hibás signature és korlát nélküli retry tiltott | SEC-009, OPS-008 |
| INT-021 | Future payment/email/commerce adapters. | 49.7 / Webhook, biztonság, bővítés | INT webhook lifecycle és adapter registry; SEC biztonsági policy | aláírt esemény, retry, diagnosztika és provider bővítés | replay, secret leak, hibás signature és korlát nélküli retry tiltott | SEC-009, OPS-008 |

**Szemantikai határok és nyitott bizonyítás:**
- `DSN-007` és `RES-013`: a designrendszer a tipográfiai tokeneket és alkalmazást kezeli; a tényleges fontfájl, licence és asset-életciklus a RES-é.
- `DSN-017` és `RES-011`: egyetlen kanonikus ikonregiszter; DSN-ben brand-/stílushivatkozás, RES-ben asset/keresés. A két funkció nem jogosít két külön ikonadatbázisra.
- `DSN-018`: a jövőbeli marketplace-disztribúció a 49.21 modulon keresztül történik, míg a sablon szerződésének tulajdonosa a 49.3.
- `RES-010`: az Editor asset picker a 49.2-ben megnyitható, de a feltöltés és metadata 49.4-beli kanonikus API-ját használja.
- `INT-011–012`: a Twitch adatátvitel adapterfunkció; a normalizált élő állapot, adásrend és publikált VOD a LIV/SCH/CNT domainben marad.
- `INT-021`: jövőbeli fizetés/email/commerce adapter nem helyettesíti a Store, Support és kampányok üzleti logikáját.
- Az 55 ID egyedi fázisa, schema-ja, jogosultsági művelete, teszt- és runtime-bizonyítéka **még nem igazolt**. A hiányzó 00/A és 00.9.6.B forrás továbbra is nyitott.

**Első körös tételes lefedés:** 144/396 (`ADM 13 + WEB 32 + EDT 44 + DSN 18 + RES 16 + INT 21`). **Nem teljes feature contract / nem implementációs PASS.**

### 63.0.6. Tételes live/OBS/ütemezés-audit — LIV-001–010, OBS-001–010, SCH-001–015

A 24.7–24.8 fejezet **35 egyedi ID-ját** a 49.5 Stream Studio és 49.6 OBS-eszközmodulhoz rendeltük, elkülönítve az INT provider-kapcsolatot, RES assetet, AUT workflow-t, WEB publikus megjelenítést és EDT vizuális konfigurációt. Az egyedi ID-sorokban szereplő pozitív/negatív minimumok csoportszintű követelmények; nem igazolt implementációs tesztek.

| ID | Megőrzött képesség | Admin-belépés | Kanonikus adatgazda | Pozitív minimum | Negatív minimum | Függőség |
| --- | --- | --- | --- | --- | --- | --- |
| LIV-001 | Normalized live/offline state. | 49.5 / Live Control Room és publikus live nézet | LIV normalizált élő projekció; INT provider kapcsolat | valós forrás, frissesség és offline fallback látható | stale vagy hiányzó provider adat nem jelölhető biztosan élőnek | INT-011, WEB-015, ADM-013 |
| LIV-002 | Live data freshness/stale indicator. | 49.5 / Live Control Room és publikus live nézet | LIV normalizált élő projekció; INT provider kapcsolat | valós forrás, frissesség és offline fallback látható | stale vagy hiányzó provider adat nem jelölhető biztosan élőnek | INT-011, WEB-015, ADM-013 |
| LIV-003 | Stream title/category/game/start time. | 49.5 / Live Control Room és publikus live nézet | LIV normalizált élő projekció; INT provider kapcsolat | valós forrás, frissesség és offline fallback látható | stale vagy hiányzó provider adat nem jelölhető biztosan élőnek | INT-011, WEB-015, ADM-013 |
| LIV-004 | Viewer/follower/subscriber metrics where permitted. | 49.5 / Live Control Room és publikus live nézet | LIV normalizált élő projekció; INT provider kapcsolat | valós forrás, frissesség és offline fallback látható | stale vagy hiányzó provider adat nem jelölhető biztosan élőnek | INT-011, WEB-015, ADM-013 |
| LIV-005 | Player/embed and offline fallback. | 49.5 / Live Control Room és publikus live nézet | LIV normalizált élő projekció; INT provider kapcsolat | valós forrás, frissesség és offline fallback látható | stale vagy hiányzó provider adat nem jelölhető biztosan élőnek | INT-011, WEB-015, ADM-013 |
| LIV-006 | Stream event normalization. | 49.5 / Live Control Room és publikus live nézet | LIV normalizált élő projekció; INT provider kapcsolat | valós forrás, frissesség és offline fallback látható | stale vagy hiányzó provider adat nem jelölhető biztosan élőnek | INT-011, WEB-015, ADM-013 |
| LIV-007 | Stream status in Dashboard and public blocks. | 49.5 / Live Control Room és publikus live nézet | LIV normalizált élő projekció; INT provider kapcsolat | valós forrás, frissesség és offline fallback látható | stale vagy hiányzó provider adat nem jelölhető biztosan élőnek | INT-011, WEB-015, ADM-013 |
| LIV-008 | Capability-gated multistream destinations and per-provider metadata. | 49.5 / Multistream, chat és recording | LIV session/capability state; OBS eszköz és INT credential külön | platformonként engedélyezett művelet és részleges állapot látszik | hiányzó scope, unsupported API vagy recording hiánya nem ad hamis sikert | INT-018, OBS-003, SEC-002 |
| LIV-009 | Unified Chat read/send permissions, provider labels, moderation state and partial-failure handling. | 49.5 / Multistream, chat és recording | LIV session/capability state; OBS eszköz és INT credential külön | platformonként engedélyezett művelet és részleges állapot látszik | hiányzó scope, unsupported API vagy recording hiánya nem ad hamis sikert | INT-018, OBS-003, SEC-002 |
| LIV-010 | Recording/replay/backup status and retention/cost policy, only where technically supported. | 49.5 / Multistream, chat és recording | LIV session/capability state; OBS eszköz és INT credential külön | platformonként engedélyezett művelet és részleges állapot látszik | hiányzó scope, unsupported API vagy recording hiánya nem ad hamis sikert | INT-018, OBS-003, SEC-002 |
| OBS-001 | Overlay asset and scene metadata. | 49.6 / OBS kapcsolat, jelenetek és overlay | OBS eszköz- és overlay-konfiguráció; RES asset | párosított eszköz és jogosult parancs visszajelzést ad | nem párosított kliens, hibás token vagy tiltott scene parancs blokkolt | RES-001, INT-001, SEC-002 |
| OBS-002 | OBS secure pairing/connection. | 49.6 / OBS kapcsolat, jelenetek és overlay | OBS eszköz- és overlay-konfiguráció; RES asset | párosított eszköz és jogosult parancs visszajelzést ad | nem párosított kliens, hibás token vagy tiltott scene parancs blokkolt | RES-001, INT-001, SEC-002 |
| OBS-003 | Scene/stream/recording state where supported. | 49.6 / OBS kapcsolat, jelenetek és overlay | OBS eszköz- és overlay-konfiguráció; RES asset | párosított eszköz és jogosult parancs visszajelzést ad | nem párosított kliens, hibás token vagy tiltott scene parancs blokkolt | RES-001, INT-001, SEC-002 |
| OBS-004 | Authorized commands and stream markers. | 49.6 / OBS kapcsolat, jelenetek és overlay | OBS eszköz- és overlay-konfiguráció; RES asset | párosított eszköz és jogosult parancs visszajelzést ad | nem párosított kliens, hibás token vagy tiltott scene parancs blokkolt | RES-001, INT-001, SEC-002 |
| OBS-005 | Browser source configuration. | 49.6 / OBS kapcsolat, jelenetek és overlay | OBS eszköz- és overlay-konfiguráció; RES asset | párosított eszköz és jogosult parancs visszajelzést ad | nem párosított kliens, hibás token vagy tiltott scene parancs blokkolt | RES-001, INT-001, SEC-002 |
| OBS-006 | Alerts for provider-supported events. | 49.6 / Alert, bot, teszt és export | OBS stream-eszközök; AUT workflow és INT provider event külön | tesztelhető, verziózott overlay és rate-limitált eseménykezelés | replay/duplikált event, tiltott botakció vagy hibás export nem okoz éles mellékhatást | AUT-001, INT-017, RES-008 |
| OBS-007 | Chatbot/commands/timers/loyalty/giveaways. | 49.6 / Alert, bot, teszt és export | OBS stream-eszközök; AUT workflow és INT provider event külön | tesztelhető, verziózott overlay és rate-limitált eseménykezelés | replay/duplikált event, tiltott botakció vagy hibás export nem okoz éles mellékhatást | AUT-001, INT-017, RES-008 |
| OBS-008 | Test mode, event replay and rate limit. | 49.6 / Alert, bot, teszt és export | OBS stream-eszközök; AUT workflow és INT provider event külön | tesztelhető, verziózott overlay és rate-limitált eseménykezelés | replay/duplikált event, tiltott botakció vagy hibás export nem okoz éles mellékhatást | AUT-001, INT-017, RES-008 |
| OBS-009 | Macro Deck or external control adapter. | 49.6 / Alert, bot, teszt és export | OBS stream-eszközök; AUT workflow és INT provider event külön | tesztelhető, verziózott overlay és rate-limitált eseménykezelés | replay/duplikált event, tiltott botakció vagy hibás export nem okoz éles mellékhatást | AUT-001, INT-017, RES-008 |
| OBS-010 | Overlay preview/export/version. | 49.6 / Alert, bot, teszt és export | OBS stream-eszközök; AUT workflow és INT provider event külön | tesztelhető, verziózott overlay és rate-limitált eseménykezelés | replay/duplikált event, tiltott botakció vagy hibás export nem okoz éles mellékhatást | AUT-001, INT-017, RES-008 |
| SCH-001 | Schedule item CRUD. | 49.5 / Stream Planner / Adásrend | SCH schedule_items kanonikus állapot | site-scope CRUD, DST, ismétlődés és ütközéskezelés | másik site rekord, DST-ambiguitás vagy ismétlődő sorozat hibás módosítása tiltott | SEC-002, SCH-003, SCH-004 |
| SCH-002 | Calendar/list/upcoming/past views with site-scoped search/filter/sort/pagination. | 49.5 / Stream Planner / Adásrend | SCH schedule_items kanonikus állapot | site-scope CRUD, DST, ismétlődés és ütközéskezelés | másik site rekord, DST-ambiguitás vagy ismétlődő sorozat hibás módosítása tiltott | SEC-002, SCH-003, SCH-004 |
| SCH-003 | Timezone and daylight-saving correctness. | 49.5 / Stream Planner / Adásrend | SCH schedule_items kanonikus állapot | site-scope CRUD, DST, ismétlődés és ütközéskezelés | másik site rekord, DST-ambiguitás vagy ismétlődő sorozat hibás módosítása tiltott | SEC-002, SCH-003, SCH-004 |
| SCH-004 | Recurrence and series edit scopes. | 49.5 / Stream Planner / Adásrend | SCH schedule_items kanonikus állapot | site-scope CRUD, DST, ismétlődés és ütközéskezelés | másik site rekord, DST-ambiguitás vagy ismétlődő sorozat hibás módosítása tiltott | SEC-002, SCH-003, SCH-004 |
| SCH-005 | Postponed/cancelled/completed/live states. | 49.5 / Stream Planner / Adásrend | SCH schedule_items kanonikus állapot | site-scope CRUD, DST, ismétlődés és ütközéskezelés | másik site rekord, DST-ambiguitás vagy ismétlődő sorozat hibás módosítása tiltott | SEC-002, SCH-003, SCH-004 |
| SCH-006 | Schedule conflict detection. | 49.5 / Stream Planner / Adásrend | SCH schedule_items kanonikus állapot | site-scope CRUD, DST, ismétlődés és ütközéskezelés | másik site rekord, DST-ambiguitás vagy ismétlődő sorozat hibás módosítása tiltott | SEC-002, SCH-003, SCH-004 |
| SCH-007 | Twitch schedule sync/manual override. | 49.5 / Sync, következő adás és publikus projekció | SCH adatgazda; INT Twitch adapter; WEB/EDT olvasó | manual override megmarad, publikus blokk ugyanazt a projekciót kapja | provider retry nem duplikál, Editor nem ír közvetlen schedule rekordot | INT-011, WEB-016, EDT-020 |
| SCH-008 | Sync status/retry/audit. | 49.5 / Sync, következő adás és publikus projekció | SCH adatgazda; INT Twitch adapter; WEB/EDT olvasó | manual override megmarad, publikus blokk ugyanazt a projekciót kapja | provider retry nem duplikál, Editor nem ír közvetlen schedule rekordot | INT-011, WEB-016, EDT-020 |
| SCH-009 | Next stream/countdown. | 49.5 / Sync, következő adás és publikus projekció | SCH adatgazda; INT Twitch adapter; WEB/EDT olvasó | manual override megmarad, publikus blokk ugyanazt a projekciót kapja | provider retry nem duplikál, Editor nem ír közvetlen schedule rekordot | INT-011, WEB-016, EDT-020 |
| SCH-010 | Canonical public schedule data projection/rendering contract consumed by WEB-016 and Editor schedule blocks. | 49.5 / Sync, következő adás és publikus projekció | SCH adatgazda; INT Twitch adapter; WEB/EDT olvasó | manual override megmarad, publikus blokk ugyanazt a projekciót kapja | provider retry nem duplikál, Editor nem ír közvetlen schedule rekordot | INT-011, WEB-016, EDT-020 |
| SCH-011 | Editor block binding/configuration for the canonical schedule projection; schedule data and lifecycle remain owned by SCH-001–010. | 49.5 / Sync, következő adás és publikus projekció | SCH adatgazda; INT Twitch adapter; WEB/EDT olvasó | manual override megmarad, publikus blokk ugyanazt a projekciót kapja | provider retry nem duplikál, Editor nem ír közvetlen schedule rekordot | INT-011, WEB-016, EDT-020 |
| SCH-012 | Game Profile CRUD. | 49.5 / Játékprofilok és export | SCH game profile; RES artwork ID; CNT content link | játékprofil, adás és tartalom referenciákkal kapcsolódik | árva asset, idegen site game vagy privát export nem szivároghat | RES-008, CNT-001, SEC-002 |
| SCH-013 | Game artwork/resource linkage. | 49.5 / Játékprofilok és export | SCH game profile; RES artwork ID; CNT content link | játékprofil, adás és tartalom referenciákkal kapcsolódik | árva asset, idegen site game vagy privát export nem szivároghat | RES-008, CNT-001, SEC-002 |
| SCH-014 | Game/content/schedule relationship. | 49.5 / Játékprofilok és export | SCH game profile; RES artwork ID; CNT content link | játékprofil, adás és tartalom referenciákkal kapcsolódik | árva asset, idegen site game vagy privát export nem szivároghat | RES-008, CNT-001, SEC-002 |
| SCH-015 | iCal/export and later notifications. | 49.5 / Játékprofilok és export | SCH game profile; RES artwork ID; CNT content link | játékprofil, adás és tartalom referenciákkal kapcsolódik | árva asset, idegen site game vagy privát export nem szivároghat | RES-008, CNT-001, SEC-002 |

**Különös figyelmet igénylő szerződések:**
- `SCH-001–011`: a `schedule_items` az egyetlen kanonikus eseményforrás; az Editor, a publikus adásrend és a Dashboard projekciót olvas. Nincs külön Editor- vagy legacy Admin-adásrend.
- `SCH-003–004`: időzóna, nyári időszámítás, ismétlődő sorozat és az „egy esemény / ez és a következők / teljes sorozat” módosítás külön negatív teszteket igényel.
- `SCH-007–008`: a Twitch szinkron és kézi módosítás ütközése csak dokumentált ownership-/precedence-szabállyal zárható.
- `LIV-002`, `LIV-008–010`: a provider frissesség, platformonkénti képesség, chat és recording státusz nem következtethető ki pusztán egy csatlakozott fiókból.
- `OBS-002–004`: OBS műveleteknél eszközpárosítás, site scope, szerveroldali jogosultság, parancs-idempotencia és visszajelzés kötelező.
- `OBS-006–009`: provider event, bot, alert és külső vezérlő ugyanazt a jogosultság-/rate-limit-/audit szerződést követi; az AUT workflow külön gazda.
- A 35 ID egyedi fázisa, API- és adat-sémája, pozitív/negatív futtatható tesztje és runtime bizonyítéka **nincs ebben a körben igazolva**.

**Első körös tételes lefedés:** 179/396 (`ADM 13 + WEB 32 + EDT 44 + DSN 18 + RES 16 + INT 21 + LIV 10 + OBS 10 + SCH 15`). A forráshiány és a teljes feature contract továbbra is nyitott; **IN PROGRESS / NOT PASS**.

### 63.0.7. Tételes tartalom/közösség/kereskedelem/tagság-audit — CNT, COM, STO, SUP

A 24.9–24.12 fejezet **75 egyedi ID-ját** a 49.8–49.11 főmodulokhoz rendeztük, minden ID-nál az eredeti képességnévvel, pozitív és negatív szerződésminimummal, kanonikus gazdával és függőséggel. A közös szerződéscsaládokat az egyedi ID-k szerint külön kell tesztelni; ez **nem 75 igazolt implementációs PASS**.

| ID | Megőrzött képesség | Admin-belépés | Kanonikus gazda | Pozitív minimum | Negatív minimum | Függőség |
| --- | --- | --- | --- | --- | --- | --- |
| CNT-001 | Canonical content item schema. | 49.8 / Tartalomkönyvtár | CNT content records; RES binary asset | importált/kanonikus tartalom ID-val és deduplikációval kezelhető | azonos külső ID vagy idegen site tartalom nem duplikálódhat/íródhat | INT-012, RES-001, SEC-002 |
| CNT-002 | VOD import and metadata. | 49.8 / Tartalomkönyvtár | CNT content records; RES binary asset | importált/kanonikus tartalom ID-val és deduplikációval kezelhető | azonos külső ID vagy idegen site tartalom nem duplikálódhat/íródhat | INT-012, RES-001, SEC-002 |
| CNT-003 | Clip/highlight/Short management. | 49.8 / Tartalomkönyvtár | CNT content records; RES binary asset | importált/kanonikus tartalom ID-val és deduplikációval kezelhető | azonos külső ID vagy idegen site tartalom nem duplikálódhat/íródhat | INT-012, RES-001, SEC-002 |
| CNT-004 | YouTube/TikTok video feed. | 49.8 / Tartalomkönyvtár | CNT content records; RES binary asset | importált/kanonikus tartalom ID-val és deduplikációval kezelhető | azonos külső ID vagy idegen site tartalom nem duplikálódhat/íródhat | INT-012, RES-001, SEC-002 |
| CNT-005 | Content-library tags/categories/collections/playlists; excludes product-catalog taxonomy and asset-library folders. | 49.8 / Tartalomkönyvtár | CNT content records; RES binary asset | importált/kanonikus tartalom ID-val és deduplikációval kezelhető | azonos külső ID vagy idegen site tartalom nem duplikálódhat/íródhat | INT-012, RES-001, SEC-002 |
| CNT-006 | Search/filter/sort/pagination/bulk actions over canonical content records only. | 49.8 / Tartalomkönyvtár | CNT content records; RES binary asset | importált/kanonikus tartalom ID-val és deduplikációval kezelhető | azonos külső ID vagy idegen site tartalom nem duplikálódhat/íródhat | INT-012, RES-001, SEC-002 |
| CNT-007 | Duplicate detection and external IDs. | 49.8 / Tartalomkönyvtár | CNT content records; RES binary asset | importált/kanonikus tartalom ID-val és deduplikációval kezelhető | azonos külső ID vagy idegen site tartalom nem duplikálódhat/íródhat | INT-012, RES-001, SEC-002 |
| CNT-008 | Featured/related content. | 49.8 / Tartalomkönyvtár | CNT content records; RES binary asset | importált/kanonikus tartalom ID-val és deduplikációval kezelhető | azonos külső ID vagy idegen site tartalom nem duplikálódhat/íródhat | INT-012, RES-001, SEC-002 |
| CNT-009 | Content calendar. | 49.8 / Naptár és publikálás | CNT content workflow; CAM kampányreferencia | draft→approval→provider publish státusz követhető | lejárt scope, elutasított jóváhagyás vagy partial publish nem jelölhető teljes sikernek | INT-018, CAM-001, SEC-002 |
| CNT-010 | Ideas/drafts/scripts/briefs. | 49.8 / Naptár és publikálás | CNT content workflow; CAM kampányreferencia | draft→approval→provider publish státusz követhető | lejárt scope, elutasított jóváhagyás vagy partial publish nem jelölhető teljes sikernek | INT-018, CAM-001, SEC-002 |
| CNT-011 | Platform-specific title/description/tag variants. | 49.8 / Naptár és publikálás | CNT content workflow; CAM kampányreferencia | draft→approval→provider publish státusz követhető | lejárt scope, elutasított jóváhagyás vagy partial publish nem jelölhető teljes sikernek | INT-018, CAM-001, SEC-002 |
| CNT-012 | Thumbnail and media asset workflow. | 49.8 / Naptár és publikálás | CNT content workflow; CAM kampányreferencia | draft→approval→provider publish státusz követhető | lejárt scope, elutasított jóváhagyás vagy partial publish nem jelölhető teljes sikernek | INT-018, CAM-001, SEC-002 |
| CNT-013 | Publishing queue and schedule. | 49.8 / Naptár és publikálás | CNT content workflow; CAM kampányreferencia | draft→approval→provider publish státusz követhető | lejárt scope, elutasított jóváhagyás vagy partial publish nem jelölhető teljes sikernek | INT-018, CAM-001, SEC-002 |
| CNT-014 | Publish status/retry/partial success. | 49.8 / Naptár és publikálás | CNT content workflow; CAM kampányreferencia | draft→approval→provider publish státusz követhető | lejárt scope, elutasított jóváhagyás vagy partial publish nem jelölhető teljes sikernek | INT-018, CAM-001, SEC-002 |
| CNT-015 | Approval workflow and public publish gate. | 49.8 / Naptár és publikálás | CNT content workflow; CAM kampányreferencia | draft→approval→provider publish státusz követhető | lejárt scope, elutasított jóváhagyás vagy partial publish nem jelölhető teljes sikernek | INT-018, CAM-001, SEC-002 |
| CNT-016 | Campaign linkage and content attribution. | 49.8 / Naptár és publikálás | CNT content workflow; CAM kampányreferencia | draft→approval→provider publish státusz követhető | lejárt scope, elutasított jóváhagyás vagy partial publish nem jelölhető teljes sikernek | INT-018, CAM-001, SEC-002 |
| CNT-017 | Short-form export preparation. | 49.8 / Szerkesztés, feed és jogok | CNT edit/render és rights; AI javaslat külön; WEB csak publikus route | szerkesztett/exportált és jóváhagyott tartalom publikált projekcióban jelenik meg | lejárt jog, privát feed, AI-javaslat vagy hibás export nem kerülhet automatikusan élesbe | AI-014, WEB-017, RES-008 |
| CNT-018 | Content-domain transcript/chapter/highlight artifact metadata and review lifecycle; AI suggestions originate in AI-014 and are stored through the content API. | 49.8 / Szerkesztés, feed és jogok | CNT edit/render és rights; AI javaslat külön; WEB csak publikus route | szerkesztett/exportált és jóváhagyott tartalom publikált projekcióban jelenik meg | lejárt jog, privát feed, AI-javaslat vagy hibás export nem kerülhet automatikusan élesbe | AI-014, WEB-017, RES-008 |
| CNT-019 | Editor block binding/configuration for the canonical content feed; content records and publishing lifecycle remain owned by CNT-001–018/020–022. | 49.8 / Szerkesztés, feed és jogok | CNT edit/render és rights; AI javaslat külön; WEB csak publikus route | szerkesztett/exportált és jóváhagyott tartalom publikált projekcióban jelenik meg | lejárt jog, privát feed, AI-javaslat vagy hibás export nem kerülhet automatikusan élesbe | AI-014, WEB-017, RES-008 |
| CNT-020 | Canonical published-content public feed/projection and query contract; WEB-017 owns the public page route/shell. | 49.8 / Szerkesztés, feed és jogok | CNT edit/render és rights; AI javaslat külön; WEB csak publikus route | szerkesztett/exportált és jóváhagyott tartalom publikált projekcióban jelenik meg | lejárt jog, privát feed, AI-javaslat vagy hibás export nem kerülhet automatikusan élesbe | AI-014, WEB-017, RES-008 |
| CNT-021 | Timeline-based content editing/render pipeline: trim/split/crop/reframe, aspect ratio, audio, captions, transitions, brand overlay and export. | 49.8 / Szerkesztés, feed és jogok | CNT edit/render és rights; AI javaslat külön; WEB csak publikus route | szerkesztett/exportált és jóváhagyott tartalom publikált projekcióban jelenik meg | lejárt jog, privát feed, AI-javaslat vagy hibás export nem kerülhet automatikusan élesbe | AI-014, WEB-017, RES-008 |
| CNT-022 | Content rights/consent/expiry/takedown lifecycle for music, video, guests and third-party assets. | 49.8 / Szerkesztés, feed és jogok | CNT edit/render és rights; AI javaslat külön; WEB csak publikus route | szerkesztett/exportált és jóváhagyott tartalom publikált projekcióban jelenik meg | lejárt jog, privát feed, AI-javaslat vagy hibás export nem kerülhet automatikusan élesbe | AI-014, WEB-017, RES-008 |
| COM-001 | External community links. | 49.9 / Közösségi tartalom és aktivitás | COM interaction; INT Discord connection | bejegyzés, szavazás, esemény és beküldés site-scope szerint működik | másik site, privát tartalom vagy ismételt szavazat nem kerülhet jogosulatlanul be | INT-015, SEC-002 |
| COM-002 | Discord community entry point. | 49.9 / Közösségi tartalom és aktivitás | COM interaction; INT Discord connection | bejegyzés, szavazás, esemény és beküldés site-scope szerint működik | másik site, privát tartalom vagy ismételt szavazat nem kerülhet jogosulatlanul be | INT-015, SEC-002 |
| COM-003 | Community posts. | 49.9 / Közösségi tartalom és aktivitás | COM interaction; INT Discord connection | bejegyzés, szavazás, esemény és beküldés site-scope szerint működik | másik site, privát tartalom vagy ismételt szavazat nem kerülhet jogosulatlanul be | INT-015, SEC-002 |
| COM-004 | Polls and voting. | 49.9 / Közösségi tartalom és aktivitás | COM interaction; INT Discord connection | bejegyzés, szavazás, esemény és beküldés site-scope szerint működik | másik site, privát tartalom vagy ismételt szavazat nem kerülhet jogosulatlanul be | INT-015, SEC-002 |
| COM-005 | Events and RSVP. | 49.9 / Közösségi tartalom és aktivitás | COM interaction; INT Discord connection | bejegyzés, szavazás, esemény és beküldés site-scope szerint működik | másik site, privát tartalom vagy ismételt szavazat nem kerülhet jogosulatlanul be | INT-015, SEC-002 |
| COM-006 | Member profiles and follows later. | 49.9 / Közösségi tartalom és aktivitás | COM interaction; INT Discord connection | bejegyzés, szavazás, esemény és beküldés site-scope szerint működik | másik site, privát tartalom vagy ismételt szavazat nem kerülhet jogosulatlanul be | INT-015, SEC-002 |
| COM-007 | Comments/reactions later. | 49.9 / Közösségi tartalom és aktivitás | COM interaction; INT Discord connection | bejegyzés, szavazás, esemény és beküldés site-scope szerint működik | másik site, privát tartalom vagy ismételt szavazat nem kerülhet jogosulatlanul be | INT-015, SEC-002 |
| COM-008 | Clip submission. | 49.9 / Közösségi tartalom és aktivitás | COM interaction; INT Discord connection | bejegyzés, szavazás, esemény és beküldés site-scope szerint működik | másik site, privát tartalom vagy ismételt szavazat nem kerülhet jogosulatlanul be | INT-015, SEC-002 |
| COM-009 | Moderation/report/ban/role. | 49.9 / Moderáció és hozzáférés | COM moderation; SUP entitlement; NTF delivery | jelentés, szerep, láthatóság és támogatói opt-in érvényesül | tiltott felhasználó, visszavont entitlement vagy opt-out nem kerülheti meg a policy-t | SUP-006, NTF-001, SEC-002 |
| COM-010 | Badges/reputation/challenges later. | 49.9 / Moderáció és hozzáférés | COM moderation; SUP entitlement; NTF delivery | jelentés, szerep, láthatóság és támogatói opt-in érvényesül | tiltott felhasználó, visszavont entitlement vagy opt-out nem kerülheti meg a policy-t | SUP-006, NTF-001, SEC-002 |
| COM-011 | Notifications and delivery status. | 49.9 / Moderáció és hozzáférés | COM moderation; SUP entitlement; NTF delivery | jelentés, szerep, láthatóság és támogatói opt-in érvényesül | tiltott felhasználó, visszavont entitlement vagy opt-out nem kerülheti meg a policy-t | SUP-006, NTF-001, SEC-002 |
| COM-012 | Abuse/spam/rate-limit controls. | 49.9 / Moderáció és hozzáférés | COM moderation; SUP entitlement; NTF delivery | jelentés, szerep, láthatóság és támogatói opt-in érvényesül | tiltott felhasználó, visszavont entitlement vagy opt-out nem kerülheti meg a policy-t | SUP-006, NTF-001, SEC-002 |
| COM-013 | Community/public-surface member-only visibility gate; consumes entitlement decisions owned by SUP-006. | 49.9 / Moderáció és hozzáférés | COM moderation; SUP entitlement; NTF delivery | jelentés, szerep, láthatóság és támogatói opt-in érvényesül | tiltott felhasználó, visszavont entitlement vagy opt-out nem kerülheti meg a policy-t | SUP-006, NTF-001, SEC-002 |
| COM-014 | Founding Supporters opt-in listing. | 49.9 / Moderáció és hozzáférés | COM moderation; SUP entitlement; NTF delivery | jelentés, szerep, láthatóság és támogatói opt-in érvényesül | tiltott felhasználó, visszavont entitlement vagy opt-out nem kerülheti meg a policy-t | SUP-006, NTF-001, SEC-002 |
| COM-015 | Email signup/consent/subscriber list. | 49.9 / Feliratkozók és fan account | COM audience consent/profile; SEC identity és AUT workflow külön | feliratkozás, unsubscribe, export/törlés és policy auditálható | opt-out/suppression vagy hiányzó consent mellett nincs marketingkézbesítés | AUT-001, SEC-001, NTF-002 |
| COM-016 | Segmentation/newsletter/automation. | 49.9 / Feliratkozók és fan account | COM audience consent/profile; SEC identity és AUT workflow külön | feliratkozás, unsubscribe, export/törlés és policy auditálható | opt-out/suppression vagy hiányzó consent mellett nincs marketingkézbesítés | AUT-001, SEC-001, NTF-002 |
| COM-017 | Unsubscribe/suppression/export/delete. | 49.9 / Feliratkozók és fan account | COM audience consent/profile; SEC identity és AUT workflow külön | feliratkozás, unsubscribe, export/törlés és policy auditálható | opt-out/suppression vagy hiányzó consent mellett nincs marketingkézbesítés | AUT-001, SEC-001, NTF-002 |
| COM-018 | Public/member/private visibility policy. | 49.9 / Feliratkozók és fan account | COM audience consent/profile; SEC identity és AUT workflow külön | feliratkozás, unsubscribe, export/törlés és policy auditálható | opt-out/suppression vagy hiányzó consent mellett nincs marketingkézbesítés | AUT-001, SEC-001, NTF-002 |
| COM-019 | Fan account identity, profile/preferences and account export/delete lifecycle. | 49.9 / Feliratkozók és fan account | COM audience consent/profile; SEC identity és AUT workflow külön | feliratkozás, unsubscribe, export/törlés és policy auditálható | opt-out/suppression vagy hiányzó consent mellett nincs marketingkézbesítés | AUT-001, SEC-001, NTF-002 |
| COM-020 | Community rules, age/content policy and enforcement lifecycle. | 49.9 / Feliratkozók és fan account | COM audience consent/profile; SEC identity és AUT workflow külön | feliratkozás, unsubscribe, export/törlés és policy auditálható | opt-out/suppression vagy hiányzó consent mellett nincs marketingkézbesítés | AUT-001, SEC-001, NTF-002 |
| STO-001 | Product catalog. | 49.10 / Katalógus és storefront | STO product/price/inventory; RES media | termékvariáns, készlet és publikus ár egyezik | idegen site SKU, negatív készlet vagy hibás ár nem rendelhető | RES-001, WEB-025, SEC-002 |
| STO-002 | Product variants/SKU/price/currency. | 49.10 / Katalógus és storefront | STO product/price/inventory; RES media | termékvariáns, készlet és publikus ár egyezik | idegen site SKU, negatív készlet vagy hibás ár nem rendelhető | RES-001, WEB-025, SEC-002 |
| STO-003 | Product-catalog categories/collections/tags; excludes content-library and asset-library taxonomies. | 49.10 / Katalógus és storefront | STO product/price/inventory; RES media | termékvariáns, készlet és publikus ár egyezik | idegen site SKU, negatív készlet vagy hibás ár nem rendelhető | RES-001, WEB-025, SEC-002 |
| STO-004 | Product media and SEO. | 49.10 / Katalógus és storefront | STO product/price/inventory; RES media | termékvariáns, készlet és publikus ár egyezik | idegen site SKU, negatív készlet vagy hibás ár nem rendelhető | RES-001, WEB-025, SEC-002 |
| STO-005 | Physical/digital/bundle/preorder/limited drop. | 49.10 / Katalógus és storefront | STO product/price/inventory; RES media | termékvariáns, készlet és publikus ár egyezik | idegen site SKU, negatív készlet vagy hibás ár nem rendelhető | RES-001, WEB-025, SEC-002 |
| STO-006 | Inventory/fulfillment abstraction. | 49.10 / Katalógus és storefront | STO product/price/inventory; RES media | termékvariáns, készlet és publikus ár egyezik | idegen site SKU, negatív készlet vagy hibás ár nem rendelhető | RES-001, WEB-025, SEC-002 |
| STO-007 | Storefront listing/detail/search/filter. | 49.10 / Katalógus és storefront | STO product/price/inventory; RES media | termékvariáns, készlet és publikus ár egyezik | idegen site SKU, negatív készlet vagy hibás ár nem rendelhető | RES-001, WEB-025, SEC-002 |
| STO-008 | Store-specific cart/checkout provider adapter; owns checkout workflow integration, while generic provider lifecycle is defined by INT-001. | 49.10 / Checkout, rendelés és digitális delivery | STO order/payment/digital purchase; INT adapter | fizetésből egyszeri rendelés és jogosult delivery keletkezik | duplikált webhook, sikertelen fizetés vagy visszavont entitlement nem ad letöltést | INT-001, STO-018, SEC-002 |
| STO-009 | Order lifecycle/payment status. | 49.10 / Checkout, rendelés és digitális delivery | STO order/payment/digital purchase; INT adapter | fizetésből egyszeri rendelés és jogosult delivery keletkezik | duplikált webhook, sikertelen fizetés vagy visszavont entitlement nem ad letöltést | INT-001, STO-018, SEC-002 |
| STO-010 | Fulfillment/tracking/cancellation/refund. | 49.10 / Checkout, rendelés és digitális delivery | STO order/payment/digital purchase; INT adapter | fizetésből egyszeri rendelés és jogosult delivery keletkezik | duplikált webhook, sikertelen fizetés vagy visszavont entitlement nem ad letöltést | INT-001, STO-018, SEC-002 |
| STO-011 | Coupons/promotions/gift cards. | 49.10 / Checkout, rendelés és digitális delivery | STO order/payment/digital purchase; INT adapter | fizetésből egyszeri rendelés és jogosult delivery keletkezik | duplikált webhook, sikertelen fizetés vagy visszavont entitlement nem ad letöltést | INT-001, STO-018, SEC-002 |
| STO-012 | Digital purchase entitlement. | 49.10 / Checkout, rendelés és digitális delivery | STO order/payment/digital purchase; INT adapter | fizetésből egyszeri rendelés és jogosult delivery keletkezik | duplikált webhook, sikertelen fizetés vagy visszavont entitlement nem ad letöltést | INT-001, STO-018, SEC-002 |
| STO-013 | Secure download/access delivery. | 49.10 / Checkout, rendelés és digitális delivery | STO order/payment/digital purchase; INT adapter | fizetésből egyszeri rendelés és jogosult delivery keletkezik | duplikált webhook, sikertelen fizetés vagy visszavont entitlement nem ad letöltést | INT-001, STO-018, SEC-002 |
| STO-014 | Tax/shipping/VAT/invoice integration review. | 49.10 / Megfelelőség, riport és provider | STO compliance/merchant workflow; ANL aggregáció külön | szolgáltató, adó/számla, refund és audit szerződés dokumentált | adó-/fogyasztóvédelmi gate nélkül nem indítható éles checkout | INT-021, SEC-010, ANL-001 |
| STO-015 | Customer account/history where needed. | 49.10 / Megfelelőség, riport és provider | STO compliance/merchant workflow; ANL aggregáció külön | szolgáltató, adó/számla, refund és audit szerződés dokumentált | adó-/fogyasztóvédelmi gate nélkül nem indítható éles checkout | INT-021, SEC-010, ANL-001 |
| STO-016 | Abandoned cart later. | 49.10 / Megfelelőség, riport és provider | STO compliance/merchant workflow; ANL aggregáció külön | szolgáltató, adó/számla, refund és audit szerződés dokumentált | adó-/fogyasztóvédelmi gate nélkül nem indítható éles checkout | INT-021, SEC-010, ANL-001 |
| STO-017 | Product/collection Editor blocks. | 49.10 / Megfelelőség, riport és provider | STO compliance/merchant workflow; ANL aggregáció külön | szolgáltató, adó/számla, refund és audit szerződés dokumentált | adó-/fogyasztóvédelmi gate nélkül nem indítható éles checkout | INT-021, SEC-010, ANL-001 |
| STO-018 | Provider webhook idempotency and audit. | 49.10 / Megfelelőség, riport és provider | STO compliance/merchant workflow; ANL aggregáció külön | szolgáltató, adó/számla, refund és audit szerződés dokumentált | adó-/fogyasztóvédelmi gate nélkül nem indítható éles checkout | INT-021, SEC-010, ANL-001 |
| STO-019 | Merchant-of-record/provider decision. | 49.10 / Megfelelőség, riport és provider | STO compliance/merchant workflow; ANL aggregáció külön | szolgáltató, adó/számla, refund és audit szerződés dokumentált | adó-/fogyasztóvédelmi gate nélkül nem indítható éles checkout | INT-021, SEC-010, ANL-001 |
| STO-020 | Store analytics. | 49.10 / Megfelelőség, riport és provider | STO compliance/merchant workflow; ANL aggregáció külön | szolgáltató, adó/számla, refund és audit szerződés dokumentált | adó-/fogyasztóvédelmi gate nélkül nem indítható éles checkout | INT-021, SEC-010, ANL-001 |
| STO-021 | Payment/tax/VAT/invoicing/consumer-rights compliance decision and provider integration gate. | 49.10 / Megfelelőség, riport és provider | STO compliance/merchant workflow; ANL aggregáció külön | szolgáltató, adó/számla, refund és audit szerződés dokumentált | adó-/fogyasztóvédelmi gate nélkül nem indítható éles checkout | INT-021, SEC-010, ANL-001 |
| SUP-001 | Support/tip links and provider. | 49.11 / Támogatás és célok | SUP support/tip provider státusz | provider által igazolt támogatás és célprogress látható | visszavont/függő fizetés nem számítható be teljesített támogatásként | INT-021, WEB-023 |
| SUP-002 | Donation/tip state where available. | 49.11 / Támogatás és célok | SUP support/tip provider státusz | provider által igazolt támogatás és célprogress látható | visszavont/függő fizetés nem számítható be teljesített támogatásként | INT-021, WEB-023 |
| SUP-003 | Supporter goals and progress. | 49.11 / Támogatás és célok | SUP support/tip provider státusz | provider által igazolt támogatás és célprogress látható | visszavont/függő fizetés nem számítható be teljesített támogatásként | INT-021, WEB-023 |
| SUP-004 | Membership tiers and billing period. | 49.11 / Tagság és entitlement | SUP membership billing és entitlement | megújítás/lemondás/refund után hozzáférés konzisztens | lejárt tagság vagy chargeback nem hagyhat aktív hozzáférést | COM-013, WEB-026, SEC-002 |
| SUP-005 | Membership perk/entitlement definition; community and public surfaces enforce access through COM-013/COM-018. | 49.11 / Tagság és entitlement | SUP membership billing és entitlement | megújítás/lemondás/refund után hozzáférés konzisztens | lejárt tagság vagy chargeback nem hagyhat aktív hozzáférést | COM-013, WEB-026, SEC-002 |
| SUP-006 | Entitlement lifecycle. | 49.11 / Tagság és entitlement | SUP membership billing és entitlement | megújítás/lemondás/refund után hozzáférés konzisztens | lejárt tagság vagy chargeback nem hagyhat aktív hozzáférést | COM-013, WEB-026, SEC-002 |
| SUP-007 | Membership renewal/cancel/failed payment. | 49.11 / Tagság és entitlement | SUP membership billing és entitlement | megújítás/lemondás/refund után hozzáférés konzisztens | lejárt tagság vagy chargeback nem hagyhat aktív hozzáférést | COM-013, WEB-026, SEC-002 |
| SUP-008 | Refund/chargeback entitlement handling. | 49.11 / Tagság és entitlement | SUP membership billing és entitlement | megújítás/lemondás/refund után hozzáférés konzisztens | lejárt tagság vagy chargeback nem hagyhat aktív hozzáférést | COM-013, WEB-026, SEC-002 |
| SUP-009 | Discord role sync from entitlement. | 49.11 / Perks és külső szinkron | SUP entitlement; INT Discord adapter; STO discount külön | jogosultság alapján Discord role, lista és kedvezmény szinkronizál | opt-out, hibás role sync vagy visszavont entitlement nem eredményez jogosulatlan perköt | INT-015, STO-011, COM-014 |
| SUP-010 | Supporter history and opt-in public listing. | 49.11 / Perks és külső szinkron | SUP entitlement; INT Discord adapter; STO discount külön | jogosultság alapján Discord role, lista és kedvezmény szinkronizál | opt-out, hibás role sync vagy visszavont entitlement nem eredményez jogosulatlan perköt | INT-015, STO-011, COM-014 |
| SUP-011 | Membership entitlement rules for content/events; COM and WEB surfaces consume these rules without duplicating entitlement state. | 49.11 / Perks és külső szinkron | SUP entitlement; INT Discord adapter; STO discount külön | jogosultság alapján Discord role, lista és kedvezmény szinkronizál | opt-out, hibás role sync vagy visszavont entitlement nem eredményez jogosulatlan perköt | INT-015, STO-011, COM-014 |
| SUP-012 | Member discount/exclusive drop. | 49.11 / Perks és külső szinkron | SUP entitlement; INT Discord adapter; STO discount külön | jogosultság alapján Discord role, lista és kedvezmény szinkronizál | opt-out, hibás role sync vagy visszavont entitlement nem eredményez jogosulatlan perköt | INT-015, STO-011, COM-014 |

**Kritikus keresztmodulú megállapítások:**
- `CNT-001–022` nem azonos a `RES` bináris asset-regiszterrel, és a WEB/Editor tartalomfeed csak publikált CNT-projekciót olvashat.
- `CNT-018` transcript/chapter/highlight metadata a CNT domainben marad; az `AI-014` javaslatot generál, nem írhat ellenőrizetlenül éles tartalmat.
- `COM-015–017` marketing-consent, unsubscribe és suppression kötelező életciklus; az értesítési kézbesítés NTF/AUT rendszerét nem helyettesíti.
- `COM-019` fan-account profil és `SEC` identitás/session közötti adatgazda-határt részletes séma és adatvédelmi teszt alapján kell véglegesíteni.
- `STO-008–010`, `STO-018–021`: checkout, order, refund, adó/számla és fogyasztóvédelmi gate nem tekinthető élesíthetőnek provider- és megfelelőségi bizonyíték nélkül.
- `SUP-005–011`: egyetlen entitlement-lifecycle a 49.11-ben; a WEB/COM/Discord csak ellenőrzött jogosultságot fogyaszt, nem tárol második tagsági igazságot.
- A 75 ID egyedi fázisa, API-/adat-sémája, jogosultsági művelete, futtatható tesztje és éles bizonyítéka **nincs ebben a körben igazolva**. A 00/A és 00.9.6.B forráshiány változatlan.

**Első körös tételes lefedés:** 254/396 (`ADM 13 + WEB 32 + EDT 44 + DSN 18 + RES 16 + INT 21 + LIV 10 + OBS 10 + SCH 15 + CNT 22 + COM 20 + STO 21 + SUP 12`). A kapu továbbra is **IN PROGRESS / NOT PASS**.

### 63.0.8. Tételes analitika/szponzoráció/automatizáció/SANCI AI audit — ANL, CAM, AUT, AI

A 24.13–24.16 fejezet **54 egyedi képességét** a 49.12–49.15 kanonikus Admin-modulokhoz rendeltük. Az alábbi tételes sorok pozitív/negatív követelményminimumokat tartalmaznak **csoportonként közös szerződésmintával**; ez nem bizonyítja az egyedi API-, permission-, runtime- és teszt-PASS-t.

| ID | Megőrzött képesség | Admin-belépés | Kanonikus gazda | Pozitív minimum | Negatív minimum | Függőség |
| --- | --- | --- | --- | --- | --- | --- |
| ANL-001 | Analytics event taxonomy/naming/schema governance for measurement and reporting; excludes workflow trigger execution. | 49.13 / Adatforrások és mérőszámok | ANL mérési séma/aggregáció; forrás üzleti domain | forrás és egység szerint ellenőrizhető metrika | hiányzó consent, botadat vagy kevert mértékegység nem torzíthat jelentést | ANL-009, SEC-002 |
| ANL-002 | Privacy-safe web analytics. | 49.13 / Adatforrások és mérőszámok | ANL mérési séma/aggregáció; forrás üzleti domain | forrás és egység szerint ellenőrizhető metrika | hiányzó consent, botadat vagy kevert mértékegység nem torzíthat jelentést | ANL-009, SEC-002 |
| ANL-003 | Stream analytics. | 49.13 / Adatforrások és mérőszámok | ANL mérési séma/aggregáció; forrás üzleti domain | forrás és egység szerint ellenőrizhető metrika | hiányzó consent, botadat vagy kevert mértékegység nem torzíthat jelentést | ANL-009, SEC-002 |
| ANL-004 | Content/platform analytics. | 49.13 / Adatforrások és mérőszámok | ANL mérési séma/aggregáció; forrás üzleti domain | forrás és egység szerint ellenőrizhető metrika | hiányzó consent, botadat vagy kevert mértékegység nem torzíthat jelentést | ANL-009, SEC-002 |
| ANL-005 | Commerce analytics. | 49.13 / Adatforrások és mérőszámok | ANL mérési séma/aggregáció; forrás üzleti domain | forrás és egység szerint ellenőrizhető metrika | hiányzó consent, botadat vagy kevert mértékegység nem torzíthat jelentést | ANL-009, SEC-002 |
| ANL-006 | Community analytics. | 49.13 / Adatforrások és mérőszámok | ANL mérési séma/aggregáció; forrás üzleti domain | forrás és egység szerint ellenőrizhető metrika | hiányzó consent, botadat vagy kevert mértékegység nem torzíthat jelentést | ANL-009, SEC-002 |
| ANL-007 | Date range/comparison/filter/export. | 49.13 / Riport, minőség és riasztás | ANL report/anomaly; NTF delivery külön | dátumtartomány, frissesség és magyarázható eltérés | stale adatból nem állítható bizonyított trend vagy riasztási ok | NTF-001, ANL-008 |
| ANL-008 | Freshness/source/unit/missing-data state. | 49.13 / Riport, minőség és riasztás | ANL report/anomaly; NTF delivery külön | dátumtartomány, frissesség és magyarázható eltérés | stale adatból nem állítható bizonyított trend vagy riasztási ok | NTF-001, ANL-008 |
| ANL-009 | Consent/retention/bot filtering. | 49.13 / Riport, minőség és riasztás | ANL report/anomaly; NTF delivery külön | dátumtartomány, frissesség és magyarázható eltérés | stale adatból nem állítható bizonyított trend vagy riasztási ok | NTF-001, ANL-008 |
| ANL-010 | Anomaly detection, thresholds and explainable alerts. | 49.13 / Riport, minőség és riasztás | ANL report/anomaly; NTF delivery külön | dátumtartomány, frissesség és magyarázható eltérés | stale adatból nem állítható bizonyított trend vagy riasztási ok | NTF-001, ANL-008 |
| CAM-001 | Campaign CRUD/status/goals. | 49.12 / Kampány és media kit | CAM campaign/attribution; CNT/STO/RES csak referencia | kampánycél, UTM és jóváhagyott media kit összekapcsolható | privát deal vagy félrevezető attribúció nem kerülhet publikus kitbe | CNT-016, RES-001 |
| CAM-002 | Campaign links/UTM/attribution. | 49.12 / Kampány és media kit | CAM campaign/attribution; CNT/STO/RES csak referencia | kampánycél, UTM és jóváhagyott media kit összekapcsolható | privát deal vagy félrevezető attribúció nem kerülhet publikus kitbe | CNT-016, RES-001 |
| CAM-003 | Campaign asset/content/product relationships. | 49.12 / Kampány és media kit | CAM campaign/attribution; CNT/STO/RES csak referencia | kampánycél, UTM és jóváhagyott media kit összekapcsolható | privát deal vagy félrevezető attribúció nem kerülhet publikus kitbe | CNT-016, RES-001 |
| CAM-004 | Media kit generation/export. | 49.12 / Kampány és media kit | CAM campaign/attribution; CNT/STO/RES csak referencia | kampánycél, UTM és jóváhagyott media kit összekapcsolható | privát deal vagy félrevezető attribúció nem kerülhet publikus kitbe | CNT-016, RES-001 |
| CAM-005 | Brand lead/deal/rate card. | 49.12 / Deal, deliverable és üzleti pénzügy | CAM lead/deal; pénzügyi provider külön gate | szerződéses határidő, hozzáférés és jóváhagyott fizetési státusz | jogi/üzleti review nélkül nem keletkezhet éles számla vagy jogosulatlan deal-hozzáférés | SEC-002, STO-021, NTF-001 |
| CAM-006 | Deliverables/deadlines/reminders. | 49.12 / Deal, deliverable és üzleti pénzügy | CAM lead/deal; pénzügyi provider külön gate | szerződéses határidő, hozzáférés és jóváhagyott fizetési státusz | jogi/üzleti review nélkül nem keletkezhet éles számla vagy jogosulatlan deal-hozzáférés | SEC-002, STO-021, NTF-001 |
| CAM-007 | Sponsor campaign analytics. | 49.12 / Deal, deliverable és üzleti pénzügy | CAM lead/deal; pénzügyi provider külön gate | szerződéses határidő, hozzáférés és jóváhagyott fizetési státusz | jogi/üzleti review nélkül nem keletkezhet éles számla vagy jogosulatlan deal-hozzáférés | SEC-002, STO-021, NTF-001 |
| CAM-008 | Private business documents and permission. | 49.12 / Deal, deliverable és üzleti pénzügy | CAM lead/deal; pénzügyi provider külön gate | szerződéses határidő, hozzáférés és jóváhagyott fizetési státusz | jogi/üzleti review nélkül nem keletkezhet éles számla vagy jogosulatlan deal-hozzáférés | SEC-002, STO-021, NTF-001 |
| CAM-009 | Invoice/payment status only after business/legal review. | 49.12 / Deal, deliverable és üzleti pénzügy | CAM lead/deal; pénzügyi provider külön gate | szerződéses határidő, hozzáférés és jóváhagyott fizetési státusz | jogi/üzleti review nélkül nem keletkezhet éles számla vagy jogosulatlan deal-hozzáférés | SEC-002, STO-021, NTF-001 |
| AUT-001 | Automation trigger-event catalog and event-to-workflow routing contract; consumes domain events and does not define analytics measurement taxonomy. | 49.14 / Trigger, szabály és action | AUT workflow engine; domain event producer külön | engedélyezett eseményből determinisztikus szabály és művelet | kliensoldali vagy cross-site jogosulatlan action nem hajtható végre | SEC-002, EDT-039 |
| AUT-002 | Trigger catalogue. | 49.14 / Trigger, szabály és action | AUT workflow engine; domain event producer külön | engedélyezett eseményből determinisztikus szabály és művelet | kliensoldali vagy cross-site jogosulatlan action nem hajtható végre | SEC-002, EDT-039 |
| AUT-003 | Condition/filter rules. | 49.14 / Trigger, szabály és action | AUT workflow engine; domain event producer külön | engedélyezett eseményből determinisztikus szabály és művelet | kliensoldali vagy cross-site jogosulatlan action nem hajtható végre | SEC-002, EDT-039 |
| AUT-004 | Automation action catalog and server-side permission checks for workflow execution; page interaction schemas remain in EDT-039. | 49.14 / Trigger, szabály és action | AUT workflow engine; domain event producer külön | engedélyezett eseményből determinisztikus szabály és művelet | kliensoldali vagy cross-site jogosulatlan action nem hajtható végre | SEC-002, EDT-039 |
| AUT-005 | Delay/schedule and timezone. | 49.14 / Trigger, szabály és action | AUT workflow engine; domain event producer külön | engedélyezett eseményből determinisztikus szabály és művelet | kliensoldali vagy cross-site jogosulatlan action nem hajtható végre | SEC-002, EDT-039 |
| AUT-006 | Idempotency/deduplication. | 49.14 / Futás, idempotencia és recovery | AUT run state/dead-letter; SEC audit külön | újrapróbálható és megfigyelhető workflow | dupla trigger, ciklus, provider outage nem okoz korlátlan mellékhatást | OPS-008, SEC-010 |
| AUT-007 | Retry/backoff/dead-letter. | 49.14 / Futás, idempotencia és recovery | AUT run state/dead-letter; SEC audit külön | újrapróbálható és megfigyelhető workflow | dupla trigger, ciklus, provider outage nem okoz korlátlan mellékhatást | OPS-008, SEC-010 |
| AUT-008 | Automation execution/run history and workflow-specific diagnostics; security/privacy audit events are owned by SEC-010. | 49.14 / Futás, idempotencia és recovery | AUT run state/dead-letter; SEC audit külön | újrapróbálható és megfigyelhető workflow | dupla trigger, ciklus, provider outage nem okoz korlátlan mellékhatást | OPS-008, SEC-010 |
| AUT-009 | Dry-run/preview/approval. | 49.14 / Futás, idempotencia és recovery | AUT run state/dead-letter; SEC audit külön | újrapróbálható és megfigyelhető workflow | dupla trigger, ciklus, provider outage nem okoz korlátlan mellékhatást | OPS-008, SEC-010 |
| AUT-010 | Enable/pause/version/clone. | 49.14 / Futás, idempotencia és recovery | AUT run state/dead-letter; SEC audit külön | újrapróbálható és megfigyelhető workflow | dupla trigger, ciklus, provider outage nem okoz korlátlan mellékhatást | OPS-008, SEC-010 |
| AUT-011 | Cycle detection and rate limits. | 49.14 / Futás, idempotencia és recovery | AUT run state/dead-letter; SEC audit külön | újrapróbálható és megfigyelhető workflow | dupla trigger, ciklus, provider outage nem okoz korlátlan mellékhatást | OPS-008, SEC-010 |
| AUT-012 | Provider outage and recovery. | 49.14 / Futás, idempotencia és recovery | AUT run state/dead-letter; SEC audit külön | újrapróbálható és megfigyelhető workflow | dupla trigger, ciklus, provider outage nem okoz korlátlan mellékhatást | OPS-008, SEC-010 |
| AUT-013 | Automation templates. | 49.14 / Sablon és cross-domain művelet | AUT workflow template/action adapter; cél-domain adatgazda | sablon érvényes actiont hív a kanonikus API-n | nem támogatott action vagy scope-bypass nem telepíthető | INT-001, SEC-002 |
| AUT-014 | Safe cross-domain actions. | 49.14 / Sablon és cross-domain művelet | AUT workflow template/action adapter; cél-domain adatgazda | sablon érvényes actiont hív a kanonikus API-n | nem támogatott action vagy scope-bypass nem telepíthető | INT-001, SEC-002 |
| AI-001 | AI model/provider registry, model capabilities and lifecycle; excludes external social/streaming integration capabilities in INT-018. | 49.15 / Modellek, promptok és tervező | AI provider/prompt registry; INT social registry külön | modellképesség, privacy-szűrés és strukturált feladat | nem megbízható tartalom nem válhat jogosultságot felülíró utasítássá | SEC-002, AI-018 |
| AI-002 | AI prompt/instruction template versioning and evaluation; excludes visual design and page-template lifecycle in DSN-014. | 49.15 / Modellek, promptok és tervező | AI provider/prompt registry; INT social registry külön | modellképesség, privacy-szűrés és strukturált feladat | nem megbízható tartalom nem válhat jogosultságot felülíró utasítássá | SEC-002, AI-018 |
| AI-003 | Intent and task planner. | 49.15 / Modellek, promptok és tervező | AI provider/prompt registry; INT social registry külön | modellképesség, privacy-szűrés és strukturált feladat | nem megbízható tartalom nem válhat jogosultságot felülíró utasítássá | SEC-002, AI-018 |
| AI-004 | Context selection and privacy filter. | 49.15 / Modellek, promptok és tervező | AI provider/prompt registry; INT social registry külön | modellképesség, privacy-szűrés és strukturált feladat | nem megbízható tartalom nem válhat jogosultságot felülíró utasítássá | SEC-002, AI-018 |
| AI-005 | Structured action schema. | 49.15 / Modellek, promptok és tervező | AI provider/prompt registry; INT social registry külön | modellképesség, privacy-szűrés és strukturált feladat | nem megbízható tartalom nem válhat jogosultságot felülíró utasítássá | SEC-002, AI-018 |
| AI-006 | Permission/ownership checker. | 49.15 / Modellek, promptok és tervező | AI provider/prompt registry; INT social registry külön | modellképesség, privacy-szűrés és strukturált feladat | nem megbízható tartalom nem válhat jogosultságot felülíró utasítássá | SEC-002, AI-018 |
| AI-007 | Diff/preview/approval workflow. | 49.15 / Jóváhagyás, végrehajtás és audit | AI approval/action orchestration; cél-domain API tulajdonos | diff→jóváhagyás→canonical API→ellenőrzés/rollback | AI nem hajthat végre közvetlen adatbázis-írást vagy engedély nélküli pénzügyi/destruktív akciót | AI-019, SEC-010 |
| AI-008 | Execute through canonical API/commands. | 49.15 / Jóváhagyás, végrehajtás és audit | AI approval/action orchestration; cél-domain API tulajdonos | diff→jóváhagyás→canonical API→ellenőrzés/rollback | AI nem hajthat végre közvetlen adatbázis-írást vagy engedély nélküli pénzügyi/destruktív akciót | AI-019, SEC-010 |
| AI-009 | Verification/audit/version/rollback. | 49.15 / Jóváhagyás, végrehajtás és audit | AI approval/action orchestration; cél-domain API tulajdonos | diff→jóváhagyás→canonical API→ellenőrzés/rollback | AI nem hajthat végre közvetlen adatbázis-írást vagy engedély nélküli pénzügyi/destruktív akciót | AI-019, SEC-010 |
| AI-010 | Cost/quota/usage/error tracking. | 49.15 / Jóváhagyás, végrehajtás és audit | AI approval/action orchestration; cél-domain API tulajdonos | diff→jóváhagyás→canonical API→ellenőrzés/rollback | AI nem hajthat végre közvetlen adatbázis-írást vagy engedély nélküli pénzügyi/destruktív akciót | AI-019, SEC-010 |
| AI-011 | Website structure/content assistant. | 49.15 / Specializált asszisztensek | AI javaslat; WEB/CNT/SCH kanonikus adatok | forráshoz kötött szerkeszthető javaslat és felhasználói döntés | AI-generált szöveg vagy klip nem publikálódhat automatikusan | CNT-018, WEB-006, AI-019 |
| AI-012 | SEO/accessibility/localization suggestions. | 49.15 / Specializált asszisztensek | AI javaslat; WEB/CNT/SCH kanonikus adatok | forráshoz kötött szerkeszthető javaslat és felhasználói döntés | AI-generált szöveg vagy klip nem publikálódhat automatikusan | CNT-018, WEB-006, AI-019 |
| AI-013 | Content title/script/description/thumbnail brief. | 49.15 / Specializált asszisztensek | AI javaslat; WEB/CNT/SCH kanonikus adatok | forráshoz kötött szerkeszthető javaslat és felhasználói döntés | AI-generált szöveg vagy klip nem publikálódhat automatikusan | CNT-018, WEB-006, AI-019 |
| AI-014 | AI-generated transcript/chapter/highlight/clip candidates with source timestamps and confidence; does not own canonical content records or rights metadata. | 49.15 / Specializált asszisztensek | AI javaslat; WEB/CNT/SCH kanonikus adatok | forráshoz kötött szerkeszthető javaslat és felhasználói döntés | AI-generált szöveg vagy klip nem publikálódhat automatikusan | CNT-018, WEB-006, AI-019 |
| AI-015 | Stream diagnostics/summary where supported. | 49.15 / Specializált asszisztensek | AI javaslat; WEB/CNT/SCH kanonikus adatok | forráshoz kötött szerkeszthető javaslat és felhasználói döntés | AI-generált szöveg vagy klip nem publikálódhat automatikusan | CNT-018, WEB-006, AI-019 |
| AI-016 | Specialist agent roles under shared permissions. | 49.15 / Specializált asszisztensek | AI javaslat; WEB/CNT/SCH kanonikus adatok | forráshoz kötött szerkeszthető javaslat és felhasználói döntés | AI-generált szöveg vagy klip nem publikálódhat automatikusan | CNT-018, WEB-006, AI-019 |
| AI-017 | AI Control Center and approval queue. | 49.15 / AI Control Center és multimodalitás | AI queue/provider/cost policy; RES/CNT kimeneti tárolás | látható jóváhagyás, kvóta, jogellenőrzés és manuális alternatíva | prompt injection, jogsértő asset vagy kvótatúllépés nem kerülhet éles munkafolyamatba | AI-018, AI-020, RES-007 |
| AI-018 | Prompt injection and untrusted content tests. | 49.15 / AI Control Center és multimodalitás | AI queue/provider/cost policy; RES/CNT kimeneti tárolás | látható jóváhagyás, kvóta, jogellenőrzés és manuális alternatíva | prompt injection, jogsértő asset vagy kvótatúllépés nem kerülhet éles munkafolyamatba | AI-018, AI-020, RES-007 |
| AI-019 | Human approval for public/destructive/financial action. | 49.15 / AI Control Center és multimodalitás | AI queue/provider/cost policy; RES/CNT kimeneti tárolás | látható jóváhagyás, kvóta, jogellenőrzés és manuális alternatíva | prompt injection, jogsértő asset vagy kvótatúllépés nem kerülhet éles munkafolyamatba | AI-018, AI-020, RES-007 |
| AI-020 | AI-free fallback for all critical manual workflows. | 49.15 / AI Control Center és multimodalitás | AI queue/provider/cost policy; RES/CNT kimeneti tárolás | látható jóváhagyás, kvóta, jogellenőrzés és manuális alternatíva | prompt injection, jogsértő asset vagy kvótatúllépés nem kerülhet éles munkafolyamatba | AI-018, AI-020, RES-007 |
| AI-021 | Multimodal image/audio/video generation provider adapters, rights/safety checks, cost controls and human review. | 49.15 / AI Control Center és multimodalitás | AI queue/provider/cost policy; RES/CNT kimeneti tárolás | látható jóváhagyás, kvóta, jogellenőrzés és manuális alternatíva | prompt injection, jogsértő asset vagy kvótatúllépés nem kerülhet éles munkafolyamatba | AI-018, AI-020, RES-007 |

**Kritikus domainhatárok és kockázatok:**
- `ANL-001` a mérési események taxonómiáját, `AUT-001` a workflow-trigger útválasztását birtokolja; közös domain event lehet, de a mérési definíció nem trigger-végrehajtási szerződés.
- `CAM-001–009` kampány- és üzleti adatok; a publikus media kit csak jóváhagyott projekciót fogyaszthat, a pénzügyi integráció jogi és provider gate-hez kötött.
- `AUT-004` szerveroldali action-permission, `EDT-039` oldalinterakció-schema; nem szabad egyetlen Visual Editor beállításként összemosni.
- `AUT-006–012`: idempotencia, backoff, dead-letter, ciklusvédelem és provider outage kezelés nélkül éles automatizáció nem minősíthető késznek.
- `AI-001` modellregiszter és `INT-018` külső social/streaming provider-regiszter külön gazda; `AI-002` prompt-sablon nem `DSN-014` vizuális komponens.
- `AI-007–009`, `AI-019`: publikáló, romboló, pénzügyi vagy hozzáférést módosító AI-action emberi jóváhagyás és kanonikus domain API nélkül tiltott.
- `AI-014` csak javaslatot és forráshivatkozást hoz létre; a `CNT-018` a transcript/fejezet/highlight végleges tartalomrekord gazdája.
- `AI-020`: a kritikus funkcióknak AI nélküli kézi használhatósága kötelező.
- Az 54 ID fázisa, egyedi API-/adat-sémája, jogosultsági mátrixa, futtatható tesztje és éles bizonyítéka továbbra is **nyitott**. A hiányzó 00/A és 00.9.6.B forrás sem rendeződött.

**Első körös tételes lefedés:** 308/396. **Kapustátusz: IN PROGRESS / NOT PASS.**

### 63.0.9. Első körös tételes lefedés lezárása — a fennmaradó 88 ID

A 24. fejezetből korábban még nem egyeztetett **88 egyedi képességazonosító** következik. Mindegyikhez külön sorban rögzítjük az eredeti követelményt, a felhasználói belépési pontot vagy keresztmodulú QA-gate-et, a kanonikus gazdát és a pozitív/negatív követelményminimumot. Az egyazon családhoz tartozó sorok azonos **csoportszintű** szerződésmintát kapnak: ez **nem** egyedi, futtatható teszt, és nem teljes 10. fejezet szerinti feature contract.

| ID | Megőrzött képesség | Admin-belépés / kapu | Kanonikus gazda | Pozitív minimum | Negatív minimum | Függőség |
| --- | --- | --- | --- | --- | --- | --- |
| SEC-001 | Authentication/session lifecycle. | 49.19 / Biztonság és hozzáférés | SEC központi authorization és privacy policy | engedélyezett művelet auditálható, site- és szerepkörhatár betartott | cross-site hozzáférés, titokkiszivárgás és visszajátszott webhook blokkolt | SEC-002, SEC-003 |
| SEC-002 | Server-side RBAC and ownership. | 49.19 / Biztonság és hozzáférés | SEC központi authorization és privacy policy | engedélyezett művelet auditálható, site- és szerepkörhatár betartott | cross-site hozzáférés, titokkiszivárgás és visszajátszott webhook blokkolt | SEC-002, SEC-003 |
| SEC-003 | Cross-domain server-side site/workspace/tenant isolation invariant; TEAM-001/TEAM-005 provide workspace selection and multi-site workflows but do not replace authorization. | 49.19 / Biztonság és hozzáférés | SEC központi authorization és privacy policy | engedélyezett művelet auditálható, site- és szerepkörhatár betartott | cross-site hozzáférés, titokkiszivárgás és visszajátszott webhook blokkolt | SEC-002, SEC-003 |
| SEC-004 | OAuth/CSRF/session security. | 49.19 / Biztonság és hozzáférés | SEC központi authorization és privacy policy | engedélyezett művelet auditálható, site- és szerepkörhatár betartott | cross-site hozzáférés, titokkiszivárgás és visszajátszott webhook blokkolt | SEC-002, SEC-003 |
| SEC-005 | XSS/sanitization/safe embeds. | 49.19 / Biztonság és hozzáférés | SEC központi authorization és privacy policy | engedélyezett művelet auditálható, site- és szerepkörhatár betartott | cross-site hozzáférés, titokkiszivárgás és visszajátszott webhook blokkolt | SEC-002, SEC-003 |
| SEC-006 | SSRF/open redirect/injection defenses. | 49.19 / Biztonság és hozzáférés | SEC központi authorization és privacy policy | engedélyezett művelet auditálható, site- és szerepkörhatár betartott | cross-site hozzáférés, titokkiszivárgás és visszajátszott webhook blokkolt | SEC-002, SEC-003 |
| SEC-007 | Rate limiting and abuse protection. | 49.19 / Biztonság és hozzáférés | SEC központi authorization és privacy policy | engedélyezett művelet auditálható, site- és szerepkörhatár betartott | cross-site hozzáférés, titokkiszivárgás és visszajátszott webhook blokkolt | SEC-002, SEC-003 |
| SEC-008 | Secret storage/redaction/rotation. | 49.19 / Biztonság és hozzáférés | SEC központi authorization és privacy policy | engedélyezett művelet auditálható, site- és szerepkörhatár betartott | cross-site hozzáférés, titokkiszivárgás és visszajátszott webhook blokkolt | SEC-002, SEC-003 |
| SEC-009 | Cross-domain webhook signature/replay security requirement and negative-test contract; provider-specific implementation is owned by INT-017. | 49.19 / Biztonság és hozzáférés | SEC központi authorization és privacy policy | engedélyezett művelet auditálható, site- és szerepkörhatár betartott | cross-site hozzáférés, titokkiszivárgás és visszajátszott webhook blokkolt | SEC-002, SEC-003 |
| SEC-010 | Cross-domain security/privacy audit events and redaction/retention controls; workflow execution detail remains in AUT-008. | 49.19 / Biztonság és hozzáférés | SEC központi authorization és privacy policy | engedélyezett művelet auditálható, site- és szerepkörhatár betartott | cross-site hozzáférés, titokkiszivárgás és visszajátszott webhook blokkolt | SEC-002, SEC-003 |
| SEC-011 | Consent/retention/export/delete. | 49.19 / Biztonság és hozzáférés | SEC központi authorization és privacy policy | engedélyezett művelet auditálható, site- és szerepkörhatár betartott | cross-site hozzáférés, titokkiszivárgás és visszajátszott webhook blokkolt | SEC-002, SEC-003 |
| SEC-012 | MFA/2FA and future SSO lifecycle, recovery and suspicious-authentication controls. | 49.19 / Biztonság és hozzáférés | SEC központi authorization és privacy policy | engedélyezett művelet auditálható, site- és szerepkörhatár betartott | cross-site hozzáférés, titokkiszivárgás és visszajátszott webhook blokkolt | SEC-002, SEC-003 |
| OPS-001 | Health/deploy version. | 49.19 / Üzemeltetés és diagnosztika | OPS telemetria, migráció és helyreállítás | health, verzió, diagnosztika és visszaállítás bizonyítható | hibás migráció, nem visszaállítható backup vagy titkot tartalmazó log nem fogadható el | QA-006, QA-007 |
| OPS-002 | Structured logs/correlation IDs. | 49.19 / Üzemeltetés és diagnosztika | OPS telemetria, migráció és helyreállítás | health, verzió, diagnosztika és visszaállítás bizonyítható | hibás migráció, nem visszaállítható backup vagy titkot tartalmazó log nem fogadható el | QA-006, QA-007 |
| OPS-003 | Error tracking/alerting. | 49.19 / Üzemeltetés és diagnosztika | OPS telemetria, migráció és helyreállítás | health, verzió, diagnosztika és visszaállítás bizonyítható | hibás migráció, nem visszaállítható backup vagy titkot tartalmazó log nem fogadható el | QA-006, QA-007 |
| OPS-004 | Migration preflight/integrity. | 49.19 / Üzemeltetés és diagnosztika | OPS telemetria, migráció és helyreállítás | health, verzió, diagnosztika és visszaállítás bizonyítható | hibás migráció, nem visszaállítható backup vagy titkot tartalmazó log nem fogadható el | QA-006, QA-007 |
| OPS-005 | Operational backup/export/restore capability and runbook; QA-007 only verifies it through tests/evidence. | 49.19 / Üzemeltetés és diagnosztika | OPS telemetria, migráció és helyreállítás | health, verzió, diagnosztika és visszaállítás bizonyítható | hibás migráció, nem visszaállítható backup vagy titkot tartalmazó log nem fogadható el | QA-006, QA-007 |
| OPS-006 | Recovery drill and runbook. | 49.19 / Üzemeltetés és diagnosztika | OPS telemetria, migráció és helyreállítás | health, verzió, diagnosztika és visszaállítás bizonyítható | hibás migráció, nem visszaállítható backup vagy titkot tartalmazó log nem fogadható el | QA-006, QA-007 |
| OPS-007 | Diagnostics report. | 49.19 / Üzemeltetés és diagnosztika | OPS telemetria, migráció és helyreállítás | health, verzió, diagnosztika és visszaállítás bizonyítható | hibás migráció, nem visszaállítható backup vagy titkot tartalmazó log nem fogadható el | QA-006, QA-007 |
| OPS-008 | Performance baseline/cache/query monitoring. | 49.19 / Üzemeltetés és diagnosztika | OPS telemetria, migráció és helyreállítás | health, verzió, diagnosztika és visszaállítás bizonyítható | hibás migráció, nem visszaállítható backup vagy titkot tartalmazó log nem fogadható el | QA-006, QA-007 |
| OPS-009 | Rollback and incident procedure. | 49.19 / Üzemeltetés és diagnosztika | OPS telemetria, migráció és helyreállítás | health, verzió, diagnosztika és visszaállítás bizonyítható | hibás migráció, nem visszaállítható backup vagy titkot tartalmazó log nem fogadható el | QA-006, QA-007 |
| OPS-010 | Dependency/license/CVE review. | 49.19 / Üzemeltetés és diagnosztika | OPS telemetria, migráció és helyreállítás | health, verzió, diagnosztika és visszaállítás bizonyítható | hibás migráció, nem visszaállítható backup vagy titkot tartalmazó log nem fogadható el | QA-006, QA-007 |
| OPS-011 | Background-job/realtime runtime selection and lifecycle, only where justified. | 49.19 / Üzemeltetés és diagnosztika | OPS telemetria, migráció és helyreállítás | health, verzió, diagnosztika és visszaállítás bizonyítható | hibás migráció, nem visszaállítható backup vagy titkot tartalmazó log nem fogadható el | QA-006, QA-007 |
| LOC-001 | Translation key/fallback. | 49.19 / Nyelvek; 49.2/49.8 tartalom | LOC locale policy; WEB/CNT lokalizált rekord | fallback, dátum és locale preview helyes | hiányzó fordítás vagy AI-javaslat nem publikálódik ellenőrizetlenül | WEB-004, AI-019 |
| LOC-002 | Locale-aware dates/numbers/currency/timezone. | 49.19 / Nyelvek; 49.2/49.8 tartalom | LOC locale policy; WEB/CNT lokalizált rekord | fallback, dátum és locale preview helyes | hiányzó fordítás vagy AI-javaslat nem publikálódik ellenőrizetlenül | WEB-004, AI-019 |
| LOC-003 | Page/content/navigation translation. | 49.19 / Nyelvek; 49.2/49.8 tartalom | LOC locale policy; WEB/CNT lokalizált rekord | fallback, dátum és locale preview helyes | hiányzó fordítás vagy AI-javaslat nem publikálódik ellenőrizetlenül | WEB-004, AI-019 |
| LOC-004 | Localized SEO/hreflang/canonical. | 49.19 / Nyelvek; 49.2/49.8 tartalom | LOC locale policy; WEB/CNT lokalizált rekord | fallback, dátum és locale preview helyes | hiányzó fordítás vagy AI-javaslat nem publikálódik ellenőrizetlenül | WEB-004, AI-019 |
| LOC-005 | Translation completeness status, locale preview and safe publish policy. | 49.19 / Nyelvek; 49.2/49.8 tartalom | LOC locale policy; WEB/CNT lokalizált rekord | fallback, dátum és locale preview helyes | hiányzó fordítás vagy AI-javaslat nem publikálódik ellenőrizetlenül | WEB-004, AI-019 |
| LOC-006 | AI-assisted translation workflow with explicit human review/approval and audit. | 49.19 / Nyelvek; 49.2/49.8 tartalom | LOC locale policy; WEB/CNT lokalizált rekord | fallback, dátum és locale preview helyes | hiányzó fordítás vagy AI-javaslat nem publikálódik ellenőrizetlenül | WEB-004, AI-019 |
| TEAM-001 | Workspace/site switcher UI and active-scope selection; server-side isolation and authorization remain owned by SEC-002–003. | 49.22 / Csapatok és workspace | TEAM workflow; SEC tenant enforcement | meghívás, role, workspace és billing scope következetes | más tenant erőforrása vagy lejárt meghívó nem elérhető | SEC-003, SEC-002 |
| TEAM-002 | Invite/accept/revoke. | 49.22 / Csapatok és workspace | TEAM workflow; SEC tenant enforcement | meghívás, role, workspace és billing scope következetes | más tenant erőforrása vagy lejárt meghívó nem elérhető | SEC-003, SEC-002 |
| TEAM-003 | Roles and granular permissions. | 49.22 / Csapatok és workspace | TEAM workflow; SEC tenant enforcement | meghívás, role, workspace és billing scope következetes | más tenant erőforrása vagy lejárt meghívó nem elérhető | SEC-003, SEC-002 |
| TEAM-004 | Approval/review/activity feed. | 49.22 / Csapatok és workspace | TEAM workflow; SEC tenant enforcement | meghívás, role, workspace és billing scope következetes | más tenant erőforrása vagy lejárt meghívó nem elérhető | SEC-003, SEC-002 |
| TEAM-005 | Multi-site workspace/product workflows; isolation enforcement is a security invariant owned by SEC-003. | 49.22 / Csapatok és workspace | TEAM workflow; SEC tenant enforcement | meghívás, role, workspace és billing scope következetes | más tenant erőforrása vagy lejárt meghívó nem elérhető | SEC-003, SEC-002 |
| TEAM-006 | SaaS billing/plan entitlements/quota. | 49.22 / Csapatok és workspace | TEAM workflow; SEC tenant enforcement | meghívás, role, workspace és billing scope következetes | más tenant erőforrása vagy lejárt meghívó nem elérhető | SEC-003, SEC-002 |
| TEAM-007 | Agency/studio client workspaces, shared templates, client-scoped brand and approval workflow. | 49.22 / Csapatok és workspace | TEAM workflow; SEC tenant enforcement | meghívás, role, workspace és billing scope következetes | más tenant erőforrása vagy lejárt meghívó nem elérhető | SEC-003, SEC-002 |
| MKT-001 | Extension manifest/permissions. | 49.21 / Marketplace | MKT extension lifecycle; DSN sablon és INT adapter külön | engedélyezett, licencelt bővítmény telepíthető és visszavonható | rosszindulatú manifest vagy jogi review nélküli fizetés nem engedélyezett | SEC-002, OPS-010 |
| MKT-002 | Extension install/update/uninstall/migration. | 49.21 / Marketplace | MKT extension lifecycle; DSN sablon és INT adapter külön | engedélyezett, licencelt bővítmény telepíthető és visszavonható | rosszindulatú manifest vagy jogi review nélküli fizetés nem engedélyezett | SEC-002, OPS-010 |
| MKT-003 | Theme/block/template/overlay marketplace. | 49.21 / Marketplace | MKT extension lifecycle; DSN sablon és INT adapter külön | engedélyezett, licencelt bővítmény telepíthető és visszavonható | rosszindulatú manifest vagy jogi review nélküli fizetés nem engedélyezett | SEC-002, OPS-010 |
| MKT-004 | License/attribution/version/review. | 49.21 / Marketplace | MKT extension lifecycle; DSN sablon és INT adapter külön | engedélyezett, licencelt bővítmény telepíthető és visszavonható | rosszindulatú manifest vagy jogi review nélküli fizetés nem engedélyezett | SEC-002, OPS-010 |
| MKT-005 | Marketplace payment/revenue-share after legal review. | 49.21 / Marketplace | MKT extension lifecycle; DSN sablon és INT adapter külön | engedélyezett, licencelt bővítmény telepíthető és visszavonható | rosszindulatú manifest vagy jogi review nélküli fizetés nem engedélyezett | SEC-002, OPS-010 |
| QA-001 | Typecheck/build/CI gates. | Keresztmodulú minőségkapu, nem külön Admin-főmenü | QA teszt- és evidence gate; implementáció a cél-domainben | CI, browser, smoke, recovery és user acceptance bizonyítékkal zárható | teszt nélküli vagy csak dokumentált képesség nem kap PASS-t | OPS-005, QA-009 |
| QA-002 | Domain/API/integration tests. | Keresztmodulú minőségkapu, nem külön Admin-főmenü | QA teszt- és evidence gate; implementáció a cél-domainben | CI, browser, smoke, recovery és user acceptance bizonyítékkal zárható | teszt nélküli vagy csak dokumentált képesség nem kap PASS-t | OPS-005, QA-009 |
| QA-003 | Ownership/security negative tests. | Keresztmodulú minőségkapu, nem külön Admin-főmenü | QA teszt- és evidence gate; implementáció a cél-domainben | CI, browser, smoke, recovery és user acceptance bizonyítékkal zárható | teszt nélküli vagy csak dokumentált képesség nem kap PASS-t | OPS-005, QA-009 |
| QA-004 | Browser/device responsive and visual-regression acceptance. | Keresztmodulú minőségkapu, nem külön Admin-főmenü | QA teszt- és evidence gate; implementáció a cél-domainben | CI, browser, smoke, recovery és user acceptance bizonyítékkal zárható | teszt nélküli vagy csak dokumentált képesség nem kap PASS-t | OPS-005, QA-009 |
| QA-005 | Public SEO/accessibility/performance audit. | Keresztmodulú minőségkapu, nem külön Admin-főmenü | QA teszt- és evidence gate; implementáció a cél-domainben | CI, browser, smoke, recovery és user acceptance bizonyítékkal zárható | teszt nélküli vagy csak dokumentált képesség nem kap PASS-t | OPS-005, QA-009 |
| QA-006 | Production smoke and runtime verification. | Keresztmodulú minőségkapu, nem külön Admin-főmenü | QA teszt- és evidence gate; implementáció a cél-domainben | CI, browser, smoke, recovery és user acceptance bizonyítékkal zárható | teszt nélküli vagy csak dokumentált képesség nem kap PASS-t | OPS-005, QA-009 |
| QA-007 | Test/acceptance gate and evidence for backup/restore/rollback; does not implement backup operations. | Keresztmodulú minőségkapu, nem külön Admin-főmenü | QA teszt- és evidence gate; implementáció a cél-domainben | CI, browser, smoke, recovery és user acceptance bizonyítékkal zárható | teszt nélküli vagy csak dokumentált képesség nem kap PASS-t | OPS-005, QA-009 |
| QA-008 | End-to-end creator journey. | Keresztmodulú minőségkapu, nem külön Admin-főmenü | QA teszt- és evidence gate; implementáció a cél-domainben | CI, browser, smoke, recovery és user acceptance bizonyítékkal zárható | teszt nélküli vagy csak dokumentált képesség nem kap PASS-t | OPS-005, QA-009 |
| QA-009 | User acceptance and evidence log. | Keresztmodulú minőségkapu, nem külön Admin-főmenü | QA teszt- és evidence gate; implementáció a cél-domainben | CI, browser, smoke, recovery és user acceptance bizonyítékkal zárható | teszt nélküli vagy csak dokumentált képesség nem kap PASS-t | OPS-005, QA-009 |
| QA-010 | Continuous benchmark and feature-discovery review. | Keresztmodulú minőségkapu, nem külön Admin-főmenü | QA teszt- és evidence gate; implementáció a cél-domainben | CI, browser, smoke, recovery és user acceptance bizonyítékkal zárható | teszt nélküli vagy csak dokumentált képesség nem kap PASS-t | OPS-005, QA-009 |
| SET-001 | Canonical site settings schema és CRUD lifecycle. | 49.19 / Site settings | SET canonical site config; SEC secret és WEB publikus projekció | site-scope beállítás és domainellenőrzés konzisztens | privát secret vagy nem verifikált domain nem publikálható | SEC-003, SEO-001 |
| SET-002 | Site ownership/scope és multi-site kompatibilitás. | 49.19 / Site settings | SET canonical site config; SEC secret és WEB publikus projekció | site-scope beállítás és domainellenőrzés konzisztens | privát secret vagy nem verifikált domain nem publikálható | SEC-003, SEO-001 |
| SET-003 | Public-safe settings projection és secret/private mezők kizárása. | 49.19 / Site settings | SET canonical site config; SEC secret és WEB publikus projekció | site-scope beállítás és domainellenőrzés konzisztens | privát secret vagy nem verifikált domain nem publikálható | SEC-003, SEO-001 |
| SET-004 | Custom domain lifecycle, verification, DNS/SSL status, primary-domain transition and canonical URL. | 49.19 / Site settings | SET canonical site config; SEC secret és WEB publikus projekció | site-scope beállítás és domainellenőrzés konzisztens | privát secret vagy nem verifikált domain nem publikálható | SEC-003, SEO-001 |
| DYN-001 | Canonical data source registry és provider/domain adapter. | 49.2 / CMS és dinamikus adatbinding | DYN binding schema; üzleti adat a cél-domainben | típushelyes, publikált és cache-koherens adatmegjelenítés | privát mező, nem whitelistelt lekérdezés vagy stale adat nem szivárog | WEB-031, EDT-020 |
| DYN-002 | Binding schema, type validation és resource/field compatibility. | 49.2 / CMS és dinamikus adatbinding | DYN binding schema; üzleti adat a cél-domainben | típushelyes, publikált és cache-koherens adatmegjelenítés | privát mező, nem whitelistelt lekérdezés vagy stale adat nem szivárog | WEB-031, EDT-020 |
| DYN-003 | Whitelisted filter/sort/transform/limit/pagination for bound data queries; not a replacement for module-specific library search. | 49.2 / CMS és dinamikus adatbinding | DYN binding schema; üzleti adat a cél-domainben | típushelyes, publikált és cache-koherens adatmegjelenítés | privát mező, nem whitelistelt lekérdezés vagy stale adat nem szivárog | WEB-031, EDT-020 |
| DYN-004 | Feltételes rendering és adatfüggő visibility. | 49.2 / CMS és dinamikus adatbinding | DYN binding schema; üzleti adat a cél-domainben | típushelyes, publikált és cache-koherens adatmegjelenítés | privát mező, nem whitelistelt lekérdezés vagy stale adat nem szivárog | WEB-031, EDT-020 |
| DYN-005 | Runtime state machine for dynamic data bindings (loading/empty/error/partial/stale); shared visual presentation may use ADM-008. | 49.2 / CMS és dinamikus adatbinding | DYN binding schema; üzleti adat a cél-domainben | típushelyes, publikált és cache-koherens adatmegjelenítés | privát mező, nem whitelistelt lekérdezés vagy stale adat nem szivárog | WEB-031, EDT-020 |
| DYN-006 | Cache policy, freshness, invalidation és stale fallback. | 49.2 / CMS és dinamikus adatbinding | DYN binding schema; üzleti adat a cél-domainben | típushelyes, publikált és cache-koherens adatmegjelenítés | privát mező, nem whitelistelt lekérdezés vagy stale adat nem szivárog | WEB-031, EDT-020 |
| DYN-007 | Permission, site scope és published-only data boundary. | 49.2 / CMS és dinamikus adatbinding | DYN binding schema; üzleti adat a cél-domainben | típushelyes, publikált és cache-koherens adatmegjelenítés | privát mező, nem whitelistelt lekérdezés vagy stale adat nem szivárog | WEB-031, EDT-020 |
| DYN-008 | Binding diagnostics, preview, invalid-reference report és recovery. | 49.2 / CMS és dinamikus adatbinding | DYN binding schema; üzleti adat a cél-domainben | típushelyes, publikált és cache-koherens adatmegjelenítés | privát mező, nem whitelistelt lekérdezés vagy stale adat nem szivárog | WEB-031, EDT-020 |
| SEO-001 | Per-page title, description, canonical URL és robots policy. | 49.2 / SEO és publikálás | SEO metadata policy; WEB route/publication | canonical, OG, structured data és sitemap publikáláskor frissül | draft URL, duplikált canonical vagy érvénytelen schema nem kerül indexbe | WEB-004, WEB-030 |
| SEO-002 | Open Graph, X/Twitter card és social preview/image validation. | 49.2 / SEO és publikálás | SEO metadata policy; WEB route/publication | canonical, OG, structured data és sitemap publikáláskor frissül | draft URL, duplikált canonical vagy érvénytelen schema nem kerül indexbe | WEB-004, WEB-030 |
| SEO-003 | Validált structured data/schema.org, ahol releváns. | 49.2 / SEO és publikálás | SEO metadata policy; WEB route/publication | canonical, OG, structured data és sitemap publikáláskor frissül | draft URL, duplikált canonical vagy érvénytelen schema nem kerül indexbe | WEB-004, WEB-030 |
| SEO-004 | Sitemap és robots.txt lifecycle, publish/cache invalidation. | 49.2 / SEO és publikálás | SEO metadata policy; WEB route/publication | canonical, OG, structured data és sitemap publikáláskor frissül | draft URL, duplikált canonical vagy érvénytelen schema nem kerül indexbe | WEB-004, WEB-030 |
| SEO-005 | SEO preview/diagnostics, duplicate/missing metadata és page-level audit. | 49.2 / SEO és publikálás | SEO metadata policy; WEB route/publication | canonical, OG, structured data és sitemap publikáláskor frissül | draft URL, duplikált canonical vagy érvénytelen schema nem kerül indexbe | WEB-004, WEB-030 |
| DEV-001 | Public API reference, versioning, schema and deprecation policy. | 49.20 / Developer Platform | DEV public API/key/webhook developer lifecycle; INT provider webhook külön | scope-os kulcs, sandbox és API verzió visszakövethető | visszavont kulcs, replay vagy quota bypass tiltott | SEC-002, SEC-009 |
| DEV-002 | API key creation, scoped permissions, one-time display, rotation, expiry and revocation. | 49.20 / Developer Platform | DEV public API/key/webhook developer lifecycle; INT provider webhook külön | scope-os kulcs, sandbox és API verzió visszakövethető | visszavont kulcs, replay vagy quota bypass tiltott | SEC-002, SEC-009 |
| DEV-003 | Webhook registry/tester, delivery log, signature validation and replay/retry diagnostics. | 49.20 / Developer Platform | DEV public API/key/webhook developer lifecycle; INT provider webhook külön | scope-os kulcs, sandbox és API verzió visszakövethető | visszavont kulcs, replay vagy quota bypass tiltott | SEC-002, SEC-009 |
| DEV-004 | Sandbox workspace and safe test fixtures/events. | 49.20 / Developer Platform | DEV public API/key/webhook developer lifecycle; INT provider webhook külön | scope-os kulcs, sandbox és API verzió visszakövethető | visszavont kulcs, replay vagy quota bypass tiltott | SEC-002, SEC-009 |
| DEV-005 | SDK/client libraries, integration examples and version compatibility. | 49.20 / Developer Platform | DEV public API/key/webhook developer lifecycle; INT provider webhook külön | scope-os kulcs, sandbox és API verzió visszakövethető | visszavont kulcs, replay vagy quota bypass tiltott | SEC-002, SEC-009 |
| DEV-006 | Developer quotas, rate-limit visibility and API usage diagnostics. | 49.20 / Developer Platform | DEV public API/key/webhook developer lifecycle; INT provider webhook külön | scope-os kulcs, sandbox és API verzió visszakövethető | visszavont kulcs, replay vagy quota bypass tiltott | SEC-002, SEC-009 |
| SEARCH-001 | Permission-aware global search over canonical domain projections. | 49.16 / Globális keresés | SEARCH permission-aware index; üzleti domain source | friss, jogosult találat és kanonikus gyorsművelet | törölt/privát rekord snippetje nem kereshető | SEC-003, WEB-029 |
| SEARCH-002 | Command palette and quick-action routing to canonical module commands. | 49.16 / Globális keresés | SEARCH permission-aware index; üzleti domain source | friss, jogosult találat és kanonikus gyorsművelet | törölt/privát rekord snippetje nem kereshető | SEC-003, WEB-029 |
| SEARCH-003 | Saved views, favorites, recent items and per-user list preferences. | 49.16 / Globális keresés | SEARCH permission-aware index; üzleti domain source | friss, jogosult találat és kanonikus gyorsművelet | törölt/privát rekord snippetje nem kereshető | SEC-003, WEB-029 |
| SEARCH-004 | Index freshness, permission/site invalidation and deletion propagation. | 49.16 / Globális keresés | SEARCH permission-aware index; üzleti domain source | friss, jogosult találat és kanonikus gyorsművelet | törölt/privát rekord snippetje nem kereshető | SEC-003, WEB-029 |
| SEARCH-005 | Module-scoped search filters and safe result snippets. | 49.16 / Globális keresés | SEARCH permission-aware index; üzleti domain source | friss, jogosult találat és kanonikus gyorsművelet | törölt/privát rekord snippetje nem kereshető | SEC-003, WEB-029 |
| NTF-001 | In-app notification center, read/unread and source-module navigation. | 49.17 / Értesítési központ | NTF delivery/preference; domain event producer külön | kézbesítési státusz és opt-in/out érvényesül | duplikált, leiratkozott vagy titkot tartalmazó értesítés tiltott | COM-017, AUT-006 |
| NTF-002 | Delivery channel adapters and truthful sent/delivered/failed states. | 49.17 / Értesítési központ | NTF delivery/preference; domain event producer külön | kézbesítési státusz és opt-in/out érvényesül | duplikált, leiratkozott vagy titkot tartalmazó értesítés tiltott | COM-017, AUT-006 |
| NTF-003 | User preferences, digest, quiet hours and channel opt-in/out. | 49.17 / Értesítési központ | NTF delivery/preference; domain event producer külön | kézbesítési státusz és opt-in/out érvényesül | duplikált, leiratkozott vagy titkot tartalmazó értesítés tiltott | COM-017, AUT-006 |
| NTF-004 | Idempotent event-to-notification mapping, deduplication and bounded retry. | 49.17 / Értesítési központ | NTF delivery/preference; domain event producer külön | kézbesítési státusz és opt-in/out érvényesül | duplikált, leiratkozott vagy titkot tartalmazó értesítés tiltott | COM-017, AUT-006 |
| NTF-005 | Unsubscribe, retention and privacy-safe notification payload. | 49.17 / Értesítési központ | NTF delivery/preference; domain event producer külön | kézbesítési státusz és opt-in/out érvényesül | duplikált, leiratkozott vagy titkot tartalmazó értesítés tiltott | COM-017, AUT-006 |
| HELP-001 | Contextual help mapping to module/field and current feature limitations. | 49.18 / Súgó és onboarding | HELP cikkek/progress; ADM csak belépés | kontextuális útmutató és szerepkörös onboarding használható | érzékeny diagnosztika és jogosulatlan admin-lépés nem jelenik meg | ADM-011, SEC-002 |
| HELP-002 | Interactive onboarding progress, skip/restart and role/site-scoped steps. | 49.18 / Súgó és onboarding | HELP cikkek/progress; ADM csak belépés | kontextuális útmutató és szerepkörös onboarding használható | érzékeny diagnosztika és jogosulatlan admin-lépés nem jelenik meg | ADM-011, SEC-002 |
| HELP-003 | Searchable glossary, versioned documentation and canonical feature references. | 49.18 / Súgó és onboarding | HELP cikkek/progress; ADM csak belépés | kontextuális útmutató és szerepkörös onboarding használható | érzékeny diagnosztika és jogosulatlan admin-lépés nem jelenik meg | ADM-011, SEC-002 |
| HELP-004 | Troubleshooting/feedback flow with diagnostic IDs and automatic sensitive-data redaction. | 49.18 / Súgó és onboarding | HELP cikkek/progress; ADM csak belépés | kontextuális útmutató és szerepkörös onboarding használható | érzékeny diagnosztika és jogosulatlan admin-lépés nem jelenik meg | ADM-011, SEC-002 |

**Nyitott, konkrét ellenőrzések:**
- `SEC-003` az összes domain site/workspace izolációjának szerveroldali invariánsa; a `TEAM-001/005` csak kiválasztási és termékworkflow-t birtokol.
- `OPS-005` tényleges backup/restore művelet; `QA-007` csak ennek tesztkapuja. Backup- vagy rollback-PASS-t futtatott recovery drill nélkül tilos állítani.
- `LOC-003–006`: lokalizált WEB/CNT publikálás, hreflang, hiányzó fordítás és AI-javaslat külön acceptance-t igényel.
- `DYN-001–008`: a dinamikus adatbinding nem új üzleti rekordtároló, a publikus lekérdezésekre kötelező a `WEB-031` published-only szabály.
- `DEV-003` fejlesztői webhook szerződés nem azonos az `INT-017` külső szolgáltatói webhook lifecycle-lal; a közös signature/replay policy `SEC-009`.
- `SEARCH-001–005`: az Admin jogosultságos index és a `WEB-029` publikus keresés eltérő adatvédelmi határ, még közös indextechnológia esetén is.
- `NTF-001–005`: opt-out, idempotencia és privacy-safe payload külön ellenőrizendő; `COM-015–017` a marketing consent forrása.
- A `QA` képességek nem bizonyítják önmagukat: konkrét CI-, browser-, production- és user-acceptance evidence szükséges.

**Első körös katalóguslefedés: 396/396 ID** — minden 24. fejezetbeli ID-nak van egyedi soros besorolása a 63.0.2–63.0.9 fejezetekben. **Ez kizárólag az első körös követelmény- és kockázati lefedés teljessége, nem a szemantikai helyesség, az egyedi 22 mezős feature contract, a kódtesztek vagy a történeti források PASS-a.** A következő kapu a kétirányú tételes szemantikai crosswalk, hiányzó források keresése, konkrét ownership/API/permission/fázis/teszt evidence és az eltérések javítása. A tervkapu **IN PROGRESS / NOT PASS** marad.

### 63.1. A terv teljességének ellenőrzése
- [ ] A teljes termékvízió minden képessége a megfelelő modulban szerepel; a régi forrásokból megőrzendő képesség nem tűnhet el pusztán átrendezés vagy fázisváltás miatt.
- [ ] Minden funkció egyértelműen besorolt: core vagy későbbi, felhasználói felület/domain, függőség, státusz, elfogadási feltétel és szükséges teszt.
- [ ] A hasonló vagy ismétlődő leírások össze vannak vetve; egy fogalomnak egy kanonikus definíciója van, a többi helyen hivatkozás vagy következetes összefoglaló szerepel.
- [ ] Az Admin-menü, a modulhatárok, a funkcióazonosítók, a domain/adatforrás-térkép és a fejlesztési fázisok kölcsönösen összhangban vannak.
- [ ] A közös funkciók — Brand Kit, design tokenek, ikonok, sablonok, presetek, erőforrások, jogosultságok, audit, lokalizáció, értesítések és keresés — egyetlen megosztott szerződéshez kötődnek.
- [ ] A külső szolgáltatókhoz kötött képességek megkülönböztetik a terméktervet, az API-technikai lehetőséget, a szükséges engedélyt/policyt és a ténylegesen igazolt működést.
- [ ] Minden felhasználói végponttól végpontig folyamatnak van sikeres útja, hibautakra vonatkozó elvárása, jogosultsági határa és elfogadási kritériuma.
- [ ] A biztonság, adatvédelem, akadálymentesség, mobilhasználat, teljesítmény, költség, mentés/visszaállítás és működtetés nem utólagos feladatként, hanem a megfelelő funkciók részeként szerepel.
- [ ] A későbbi SaaS, csapat, marketplace, billing és AI-szolgáltatások megmaradnak a teljes célképben, de nem előzik meg a szükséges technikai és biztonsági alapokat.
- [ ] A terv nem jelöl implementáltként olyan funkciót, amelyet csak leírtak; a bizonyítékok státusza külön marad a termékspecifikációtól.

### 63.2. Kötelező konzisztencia-ellenőrzések
- [ ] Ismétlődő fejezetek és funkcióleírások egyeztetése, a korábbi részletek elvesztése nélkül.
- [ ] Azonosítók, státuszok, fogalmak, elnevezések, útvonalak és fázishivatkozások ellenőrzése.
- [ ] Függőségi sorrend és blokkoló feltételek ellenőrzése; nincs olyan későbbi funkció, amely nem létező előfeltételre épít.
- [ ] Kanonikus adatforrások és egyetlen üzleti logika ellenőrzése minden többfelületes folyamatnál.
- [ ] A meglévő kódra vonatkozó állítások ellenőrzése repository-, teszt-, runtime- vagy felhasználói bizonyíték alapján; bizonyíték nélkül a státusz nyitott marad.
- [ ] A terv olvashatóságának ellenőrzése: modulonként jól elkülönülő fejezetek, követhető navigáció, fogalomtár és egyértelmű aktív pont.
- [ ] Történeti forrásokból származó követelményeknél az eredet és a megőrzési döntés visszakövethető; hiányzó forrás nem nyilvánítható automatikusan egyeztetettnek.

### 63.3. Fejlesztésindítási feltétel
A következő fejlesztési pont csak akkor indítható, ha:
1. az aktuális aktív pont és annak scope-ja a MASTER-ben egyértelmű;
2. a szükséges függőségek és a tiltott mellékhatások rögzítettek;
3. a változtatás előtt szükséges repository/runtime/DB/provider ellenőrzések elvégezhetők;
4. az elfogadási és regressziós tesztek előre meghatározottak;
5. az adatvesztési, jogosultsági, migrációs és visszaállítási kockázatok kezelési módja dokumentált;
6. a lezárás feltételei objektíven ellenőrizhetők, és a PASS csak a bizonyítékok után adható meg.

### 63.4. Átadás a tervből a megvalósításba
- [ ] Először a MASTER belső egységességét és a szükséges történeti követelmények megőrzését kell ellenőrizni; ez nem külön termékterv és nem párhuzamos auditprojekt.
- [ ] A nyitott tervbeli kérdéseket a megfelelő modulban kell megoldani; a kész specifikációt nem kell minden fázisnál újra feltalálni.
- [ ] A terv lezárási kritériumainak teljesülése után az egyetlen aktív implementációs pont az F0 meglévő core workflow-ja marad, kivéve ha a repository aktuális, ellenőrzött állapota indokolt változtatást követel.
- [ ] F0 után kizárólag az elfogadott függőségi sorrendben haladunk; párhuzamos, egymástól független feature-szálak nem indulnak.
- [ ] Minden lezárt pont után a MASTER státusza, a bizonyíték, az ismert korlát és a következő aktív pont frissül.
- [ ] A terv lezárását és a kód készültségét külön kell kommunikálni: a terv lehet teljes, miközben a termék funkcióinak többsége még fejlesztésre vár.

### 63.5. Kanonikus fázis- és munkacsomag-leképezés
A következő táblázat feloldja a dokumentumban korábban párhuzamosnak tűnő P- és F-számozást. Az F-szám a legfelső szintű végrehajtási sorrend; a P-szám a részletes munkacsomag.

| Részletes munkacsomag | Kanonikus F-fázis | Megjegyzés |
|---|---|---|
| P1 Platformbaseline | F0–F1 | Az aktuális core állapotot és az Admin-shell alapját szolgálja; csak a szükséges baseline feladatokat kell megismételni. |
| P2 Admin shell | F1 | Közös navigáció, állapotok és mobilos Admin. |
| P3 Editor core | F0 | Mentés, history, canvas, layers, inspector és responsive core. |
| P4 Resource/media | F0–F2 | Az F0-ban csak a core workflow-hoz szükséges stabilitás; teljes registry és könyvtár F2. |
| P5 Design system | F2 | Brand Kit, tokenek, témák, ikonok, presetek, sablonok és reusable komponensek. |
| P6 Pages and renderer | F3 | Oldal-életciklus, renderer, navigáció és publikus minőség. |
| P7 Integrations | F5 | Provider-adapterek és engedélyezett kapcsolatok. |
| P8 Creator profile, schedule and blocks | F3–F5 | Publikus blokkok F3; provider- és schedule-függő integrációk F5-höz igazítva. |
| P9 Content and publishing | F7 | Tartalommodell, könyvtár, naptár és provider-publikálás. |
| P10 Community/audience | F8 | Közösség, audience és consent. |
| P11 Commerce/support/membership | F8 | Fizetési szolgáltató, termék, rendelés és entitlement. |
| P12 Analytics | F9 | Forrás- és frissességjelölt analitika. |
| P13 Campaign/sponsorship | F9 | Kampány- és üzleti funkciók. |
| P14 Automation | F9 | Eseményvezérelt, idempotens workflow-k. |
| P15 Stream Studio/Overlay/OBS | F6 | OBS-kapcsolat, overlayek és stream-eszközök. |
| P16 Backup/portability/diagnostics | F0 és F11 | A core mentési/visszaállítási alap F0; felhasználói export és platformos diagnosztika bővítése a függőségek szerint. |
| P17 Security/accessibility/performance/reliability | Keresztmetszeti, minden F-fázis | Nem különálló késői fázis; minden érintett változtatás része. |
| P18 Localization | Keresztmetszeti; többnyelvű site F3, platformos lokalizáció F11 | A magyar elsődleges nyelv már az alapfelületeknél kötelező. |
| P19 Multi-site/team/SaaS | F11 | Csak a tenant-izolációs és biztonsági előfeltételek után. |
| P20 Extension marketplace | F11 | Biztonságos extension-contract és review után. |
| P21 AI and creator intelligence | F10 | A 40. fejezet részletes AI-szerződése szerint. |
| P22 End-to-end acceptance | Keresztmetszeti, minden release előtt | A release elfogadása az érintett fázisok bizonyítékai alapján történik. |

A fenti leképezés nem engedélyezi a függőségek átugrását. Ha egy munkacsomag több fázist érint, csak az adott fázisra eső, bizonyítható rész zárható le; a teljes munkacsomag nem jelölhető késznek ettől.

### 63.6. Roadmap- és státusz-konfliktusok kezelése
- [ ] A 41.2. fejezet F0–F11 listája a legfelső szintű roadmap egyetlen forrása; a 39. fejezet összefoglaló, a 9. fejezet részletes munkacsomag-katalógus.
- [ ] A 19. fejezet F0 fókusza a terv lezárása UTÁNI implementációs cél, nem a jelenlegi aktív pont. Nem bizonyíték arra, hogy F0 minden acceptance-feladata nyitott vagy kész; a konkrét státuszt ellenőrzött teszt/runtime eredmény adja.
- [ ] Korábbi checkpointok vagy elavult állapotjelzések nem írhatják felül automatikusan a jelenlegi termék-roadmapet. Csak az aktuális termékfunkcióhoz szükséges, bizonyítékkal alátámasztott hiány vagy regresszió határozhatja meg a következő munkát.
- [ ] Ha egy státusz vagy roadmap-sorrend más fejezetben eltér, először ezt a kanonikus térképet és a legfrissebb igazolt repository/runtime állapotot kell alkalmazni; az eltérést a MASTER-ben egy helyen kell javítani.
- [ ] A dokumentum végső konzisztencia-ellenőrzése és a 63. fejezet lezárási kapujának PASS állapota UTÁN a következő munka a 19. fejezet szerinti legkorábbi, reprodukálható F0 acceptance-feladat ellenőrzése/implementációja. E feltételek teljesüléséig az aktív pont a terv teljességének és belső összhangjának lezárása.

### 63.7. Az eddigi dokumentumszerkezeti ellenőrzés eredménye — 2026-10-14
Az ellenőrzés a MASTER aktuális repository-változatára vonatkozik; nem jelent teljes szemantikai, runtime- vagy funkcionális PASS-t.

- [x] A számozott főfejezetek 0–63 között folytonosak, hiányzó főfejezetszámot nem találtunk; a 62. fejezet a világszintű termékképességeket és minőségi szerződést egészíti ki.
- [x] Az aktuális dokumentumellenőrzésben nem találtunk azonos című, duplikált Markdown-fejezetcímet.
- [x] A 3. fejezet domain-felelősségeit a 49. fejezet 22 kanonikus főmoduljához rendeltük; a 46.1. alfejezetet második menülista helyett navigációs UX-szabályokra állítottuk át.
- [x] A 9. fejezet P1–P22 munkacsomagjait a 41.2. F0–F11 végrehajtási sorrendhez rendeltük a 63.5. leképezéssel.
- [x] A F0 core media/resource feladat és az F2 teljes Resource Registry/Design System határát különválasztottuk.
- [ ] A teljes termékfunkciók közötti szemantikai duplikáció- és függőségellenőrzés még nem teljes; a szerkezeti ellenőrzés nem helyettesíti.
- [ ] A történeti források minden követelményének megőrzése és a hiányzó források állapotának igazolása nem tekinthető teljesnek pusztán a jelenlegi dokumentum belső ellenőrzése alapján.
- [ ] A valódi F0 mentés–újratöltés–preview–publish–publikus oldal end-to-end ellenőrzés még nincs bizonyítva; ez a MASTER lezárási kapujának PASS állapota UTÁN következő F0 validációs feladat, nem a jelenlegi aktív tervpont.
- [x] A `52b4dc53f98d19bfb79dc06d0d69f8fe5dff21d8` commiton futó GitHub Actions `Editor Core Test` sikeres: TypeScript typecheck, Editor core, canonical schedule, domain contract és Admin home contract tesztek mind PASS. Futás: https://github.com/sanci9517/sanci9517/actions/runs/38602119822.
- [x] Ugyanezen a commiton a `Twitch Integration Check` is sikeres: TypeScript typecheck, Editor core regresszió, schedule source, Twitch OAuth és site ownership contract tesztek mind PASS. Futás: https://github.com/sanci9517/sanci9517/actions/runs/38602119661.
- [ ] Valódi böngészős smoke, éles Worker/D1 mentés–újratöltés–preview–publish–publikus oldal end-to-end ellenőrzés továbbra sincs igazolva; a CI tesztek ezt nem helyettesítik.

**Státusz:** a dokumentumszerkezet és a fő roadmap-ütközések részben rendezettek; a MASTER lezárása még nincs kimondva, és az F0 PASS állapota sincs igazolva. **Aktív tervpont:** `PLAN-CAPABILITY-COMPLETENESS-AND-CONSISTENCY` — a fennmaradó szemantikai, függőségi, forrásmegőrzési és követésbeli ellenőrzések lezárása. A korábbi P0/P0.2 checkpoint nem válik új aktív munkafolyamattá. F0 csak a MASTER lezárási kapujának bizonyított PASS állapota után következhet.

### 63.8. Fejlesztéskövetési szerződés — egyetlen aktív pont

A fejlesztés követése ugyanebben a MASTER-ben történik. Nem hozunk létre második roadmapet, párhuzamos státuszfájlt vagy új auditprojektet.

- **Egyetlen aktív pont:** egyszerre csak egy elsődleges, végrehajtás alatt álló terv-/fejlesztési pont lehet. A következő pont csak az aktuális pont bizonyított lezárása után aktiválható.
- **Kötelező feladatmezők:** stabil azonosító; cél és scope; modul/domain-gazda; függőségek és blokkolók; előzetes repository/runtime/provider ellenőrzés; változtatás és érintett felületek; elfogadási kritériumok; szükséges tesztek; kockázat és helyreállítás; státusz; bizonyíték; ismert korlát; lezárás dátuma/commitja, ha rendelkezésre áll.
- **Egységes státuszok:** `NOT STARTED`, `IN PROGRESS`, `BLOCKED`, `UNVERIFIED`, `PASS`, `FAIL`, `DEFERRED`. A `UNVERIFIED` azt jelenti, hogy az implementációs/runtime bizonyíték nem elegendő a készültség megállapításához; ez nem `PASS`. A `DEFERRED` nem törlést jelent; a funkció a teljes scope része marad, megjelölt függőségekkel. Az `OPEN` probléma-/acceptance-jelző, nem külön készültségi státusz; a `NOT PASS` kapuállapotot jelöl.
- **Bizonyíték szerinti készültség:** a tervbe írás nem implementáció; a forrásszöveg-egyezés nem runtime-bizonyíték; a unit/contract teszt nem helyettesíti az integrációs vagy böngészős tesztet; a CI nem bizonyítja önmagában az éles adatfolyamot vagy a felhasználói elfogadást.
- **Lezárás:** `PASS` csak akkor adható, ha az előre rögzített elfogadási kritériumokhoz a megfelelő bizonyítékok rendelkezésre állnak, a regressziókat ellenőrizték, és az érintett dokumentáció/státusz frissült. Hiányzó bizonyíték esetén a státusz nyitott marad.
- **Minden munkamenet végén:** ugyanebben a fejezetben vagy az aktív munkapontnál frissíteni kell az elvégzett részt, a bizonyítékot, a nyitott blokkolót, a következő konkrét lépést és az aktív pont azonosítóját. Nem állítható folyamatos háttérmunka vagy előrehaladás olyan lépésről, amely ténylegesen nem történt meg.
- **Újrahasználat és kutatás:** a fejlesztés előtt ellenőrizni kell a meglévő saját implementációt és tesztjeit, majd az adott funkcióhoz releváns, működő referenciákat, hivatalos dokumentációt és — ha érdemes — karbantartott nyílt forrású megoldásokat. A döntés lehet `REUSE`, `ADAPT`, `BUILD`, `REJECT` vagy `DEFER`; indoklás, licenc/policy/security/karbantarthatósági ellenőrzés és acceptance-hatás szükséges. Nem másolunk vakon, és nem írunk újra működő saját kódot bizonyított ok nélkül.
- **Felületek közötti követés:** ha egy kanonikus adat vagy művelet több modulban jelenik meg, az elfogadás során minden érintett Admin-, Editor-, API- és publikus útvonalat ellenőrizni kell; a közös változás hatása, cache-frissítés és jogosultság is része a feladatnak.
- **Terv és termékállapot különválasztása:** a MASTER teljességének PASS állapota nem jelenti az összes funkció implementáltságát; egy fejlesztési fázis PASS állapota nem zárja le automatikusan a teljes tervet.

### 63.9. Funkcióhierarchia és modulhatárok — kötelező tervminőségi kapu

A Creator Platformot nem egyetlen nagy szerkesztőbe vagy általános Admin-modulba sűrítjük. A felhasználói élmény egységes lehet, de a funkciók felelőssége, adata, jogosultsága és üzleti logikája külön, érthető modulokban marad.

**Kötelező hierarchia minden képességhez:**
1. **Főmodul:** a felhasználó által érthető, önálló feladatkör (például Weboldal, Brand Kit, Stream Studio, Kapcsolatok, Tartalomstúdió, Közösség, Commerce, Analitika, Automatizáció, SANCI AI, Fiók és biztonság, Platformbeállítások).
2. **Funkciócsoport:** a főmodulon belül egy összetartozó munkafolyamat (például Weboldal → Oldalak; Navigáció; CMS; Visual Editor; SEO; Publikálás).
3. **Alfunkció:** egy konkrét, külön megérthető művelet vagy képesség, saját állapotokkal, jogosultságokkal és hibakezeléssel, ahol szükséges.
4. **Elfogadási feltétel:** ellenőrizhető viselkedés, teszt és bizonyíték, amely megmutatja, mikor tekinthető az alfunkció késznek.

**Egy funkció — egy tulajdonos:**
- Minden üzleti képességhez egyetlen kanonikus tulajdonosmodult és adat-/API-szerződést kell kijelölni. Más modulban megjelenhet gyorselérés, összefoglaló vagy beágyazott vezérlő, de ez nem hozhat létre második adatforrást vagy párhuzamos üzleti logikát.
- A keresztmodulos funkciókapcsolatot explicit módon kell dokumentálni: ki birtokolja az adatot, ki végezheti a műveletet, milyen engedéllyel, milyen API/command vagy esemény útján, és hogyan frissül a többi felület.
- A közös, általános UI-komponensek (például ikonválasztó, média-picker, assetválasztó, dátum/idő választó, színválasztó, megerősítő dialógus) újrahasználhatók; ez nem jelenthet duplikált domain-szolgáltatást.

**A Visual Editor pontos határa:**
- **Ide tartozik:** oldalvászon és struktúra, rétegek, kiválasztás, drag-and-drop, Inspector, reszponzív breakpointok, stílus-/layout-beállítások, oldalkomponensek és blokkok elhelyezése, undo/redo, billentyűparancsok, preview, szerkesztői validáció és a kanonikus mentési/publikálási folyamat használata.
- **Nem ide tartozik tulajdonosként:** Twitch/YouTube/TikTok/Discord fiókok és tokenek; stream-adásrend és provider-szinkron; médiafájlok és R2 assetek kanonikus kezelése; Brand Kit/design tokenek és sablonkönyvtár tulajdonosi kezelése; analitika adattára és riportlogikája; közösség/moderáció; fizetés, shop, számlázás; automatizációs motor; AI-szolgáltató konfigurációja; csapat-/tenant-jogosultságok.
- Az Editor ezekhez kaphat kontextuális választót, adatblokkot, konfigurációs panelt vagy előnézetet, de a beállításokat a saját tulajdonosmodulból és szerződésből olvassa/írja. Az Editor nem másolhatja le ezeket saját, külön adatmodellbe.
- A publikált oldal renderere a Page Model megjelenítéséért felel; nem válhat a külső integrációk, analitika, jogosultságok vagy üzleti folyamatok második backendjévé.

**A terv szerkezeti auditjának ellenőrzőlistája:**
- [ ] Minden funkció a megfelelő főmodul és funkciócsoport alatt szerepel; az általános, túlterhelt gyűjtőfejezetek fel vannak bontva.
- [ ] Minden funkcióhoz egyértelmű kanonikus tulajdonos, adatforrás, felület és kapcsolódási pont tartozik.
- [ ] A Visual Editor, Brand Kit, Media/Asset Library, Integrations, Stream Studio, Analytics, Community, Commerce, Automation és SANCI AI határai külön-külön ellenőrizve vannak.
- [ ] Az Admin-menü, a terv modulhierarchiája, a domain-szerződések és a fázisok közötti megfeleltetés nem mond ellent egymásnak.
- [ ] A közös képességek keresztlinkként vagy közös szolgáltatásként szerepelnek, nem egymástól független másolatokként.
- [ ] Minden alfunkciónak van státusza, függősége, elfogadási feltétele és szükséges tesztje; a tervbeli említés nem számít kész implementációnak.
- [ ] A felhasználói útvonalak végigkövetik a főfolyamatot az Admin/Editor felülettől a backend/adattáron át a publikus kimenetig, ahol releváns.

**Státusz:** IN PROGRESS. A jelen fejezet meghatározza a kötelező struktúrát; a teljes termékfunkció-katalógus tételes ellenőrzése után lehet a kaput PASS-ra állítani. A már létező, logikus modulbontást meg kell őrizni és következetesen alkalmazni; nem kell mindent újraszervezni, ha az audit igazolja, hogy a funkció a megfelelő helyen van.

### 63.10. A funkciófejezetek kanonikus szerepe és feloldási sorrendje

A dokumentum hosszú, mert egyszerre őrzi a felhasználói funkciókat, a részletes műszaki szerződéseket, a tesztelési követelményeket és a végrehajtási sorrendet. Ezek a nézőpontok nem jelenthetnek több, egymással versengő funkcióhierarchiát. Az alábbi szereposztás kötelező:

| Fejezet | Kanonikus szerep | Nem használható erre |
|---|---|---|
| 3. | Domain-felelősségek és Admin-képességek részletezése | Önálló navigációs térkép vagy külön adatgazda létrehozása |
| 4. | Publikus weboldal oldal-/tartalmi felületei és minőségi követelményei | Admin üzleti modulok átvétele |
| 5. | Kanonikus domain- és adatforrás-térkép | UI-menü vagy implementációs sorrend meghatározása |
| 9., 39., 41.2., 63.5. | Munkacsomagok és fázisok: részletezés, összefoglalás és kanonikus végrehajtási sorrend | Új, egymástól független roadmapok |
| 10., 26., 27., 28., 29. | Funkciószerződések, életciklus, E2E folyamatok, UI/hibaállapotok és adatmodell | Új felhasználói főmodulok definiálása a navigációtól függetlenül |
| 14., 25., 26. | Stabil ID-khez tartozó státuszmezők és funkciószintű követés | A funkciók többszörös, külön státuszú megvalósításának engedélyezése |
| 24. | Stabil funkcióazonosító-jegyzék; minden azonosító egyszer szerepel, a modulhelyét a 49. fejezet határozza meg | A felhasználói menü második példányának fenntartása |
| 38. | Visual Editor EDT részletes specifikációja és tesztkatalógusa | A platform minden funkciójának Editorba zsúfolása |
| 46. és 49. | Admin információs architektúra, majd a kanonikus felhasználói modul-/menütérkép | Domain/adatgazda megváltoztatása pusztán a UI elhelyezése miatt |
| 50., 58.–62. | Keresztmodulú minőségi, biztonsági, üzemeltetési és platformkövetelmények | Ugyanazon képesség önálló második implementációja |
| 54. | Teljes termékcél lefedettségi/review checklist | A 49. fejezetet felülíró második modulhierarchia vagy önálló státuszforrás |
| 55. | A funkciók felhasználói prioritási döntési szabályai | Funkció törlése explicit döntés nélkül |
| 63. | A terv lezárási kapuja és az audit eredménye | A termék implementációs készültségének állítása |

**Eltérésfeloldási sorrend:** (1) felhasználói főmodul/hely: 49.; (2) adat- és domaingazda: 5.; (3) stabil funkcióazonosító és státusz: 14./24./25.; (4) részletes működés és elfogadás: 10./26./27. és az adott modul saját részletes specifikációja; (5) végrehajtási sorrend: 41.2., a 63.5. megfeleltetés szerint; (6) a teljes cél lefedettségének ellenőrzése: 54. és a 63.1–63.2. kapu. Ha az audit során eltérés marad, nem választunk hallgatólagosan: a konfliktust nyitottként rögzítjük és a megfelelő kanonikus helyen javítjuk.

**Aktuális auditállapot:** a fejezetek szerepe most rögzítve van, de a teljes tételes keresztmegfeleltetés még `IN PROGRESS`. A 54. fejezet valamennyi checklist-tételének a 49. fejezet szerinti tulajdonosmodulhoz és a 24. fejezet ID-jegyzékéhez rendelése, valamint a valódi hiányok/duplikációk eldöntése továbbra is nyitott lezárási feltétel.

### 63.11. Lefedettségi keresztmegfeleltetés — 54. fejezet → kanonikus modulok

A 54. fejezet 16 témacsoportja a jelenlegi ellenőrzésben 156 checkbox-tételt tartalmaz. Ezek a végső cél lefedettségi ellenőrzőpontjai, nem 156 külön, önálló modult vagy implementációt jelentenek. A tulajdonosmodulok a következők:

| 54. fejezet | Kanonikus tulajdonos a 49. fejezetben | Elsődleges funkció-ID tartomány | Keresztmodulú megjegyzés |
|---|---|---|---|
| 54.1 Admin és Dashboard | 49.1 Kezdőlap és napi áttekintés | ADM, NTF | A Dashboard értesítési összesítőt mutat; a kézbesítés és preferencia a NOTIFICATION domain tulajdona. |
| 54.2 Weboldal és Visual Editor | 49.2 Weboldal | WEB, EDT, SET, DYN, SEO | Az EDT kizárólag weboldalszerkesztési felelősség; design és asset tulajdonlás külön modul. |
| 54.3 Brand Kit és Design Studio | 49.3 Márka és designrendszer | DSN | A többi modul hivatkozik a kanonikus tokenekre/brand assetekre. |
| 54.4 Média és erőforrások | 49.4 Média- és erőforráskönyvtár | RES | A Content Studio és az Editor hivatkozik az asset registryre; nem saját médiatárat kezel. |
| 54.5 Kapcsolatok és integrációk | 49.7 Kapcsolatok és integrációk | INT | Provider token/scope/connection state egyetlen integrációs gazda alatt. |
| 54.6 Live, Stream Studio és adásrend | 49.5 Élő adás és Stream Studio | LIV, SCH | A streamállapot, schedule és game profile kanonikus adatai külön domain-szerződések. |
| 54.7 OBS, overlay, chatbot és stream-eszközök | 49.6 OBS és stream eszközök | OBS, LIV, AUT | A provider/integration auth és automatizációs motor nem másolódik az OBS modulba. |
| 54.8 Tartalom és Content Studio | 49.8 Tartalomstúdió | CNT, RES | A publikálási queue és provider-kapcsolat külön domain-szerződés marad. |
| 54.9 Közösség és rajongói fiókok | 49.9 Közösség és rajongók | COM | Fan identity, moderation és entitlement határát külön kell megőrizni. |
| 54.10 Bolt, támogatás és bevétel | 49.10 Bolt és kereskedelem; 49.11 Támogatás és tagság; 49.12 Szponzoráció és üzleti központ | STO, SUP, CAM | Store order, member entitlement, B2B campaign és analytics külön domaingazda. |
| 54.11 Analitika és növekedés | 49.13 Analitika és növekedés | ANL, CAM | Kampány/szponzoráció kapcsolódik, de nem válik analitikai adattár-másolattá. |
| 54.12 Automatizációk | 49.14 Automatizációk | AUT | Event/rule/run/retry/audit a workflow engine tulajdona. |
| 54.13 SANCI AI | 49.15 SANCI AI | AI | Az AI javasolhat műveletet, de a végrehajtás a domain engedélyezett commandján megy. |
| 54.14 Többnyelvűség és nemzetközi használat | 49.2 Weboldal lokalizált tartalma + 49.19 platformbeállítások | LOC, WEB, SEO, SEC | A site-tartalom locale-ja és az Admin felület nyelve külön, de összehangolt scope. |
| 54.15 Beállítások, biztonság, adatvédelem és megbízhatóság | 49.19 Beállítások, biztonság és adat; értesítési preferenciák: 49.17 | SEC, OPS, QA, NTF | Biztonság, privacy és reliability keresztmetszeti elfogadási feltétel is. |
| 54.16 Fejlesztői platform, bővítmények, csapat és SaaS | 49.20 Fejlesztői platform/API; 49.21 Bővítmények és piactér; 49.22 Csapat/több site/SaaS | DEV, MKT, TEAM, OPS, SEC | Későbbi fázis; tenant isolation, extension security és billing függőségek nem hagyhatók ki. |

**Auditállapot:** a 16 témacsoport tulajdonosmodulhoz rendelése dokumentálva van, és a 63.12–63.15. fejezet a 156 egyedi checklist-tétel mindegyikét stabil funkcióazonosítóhoz rendeli. Ez tervszintű megfeleltetés, nem runtime- vagy acceptance-PASS. A következő auditlépés a megfeleltetések szemantikai pontosságának, a hasonló megfogalmazású képességek tényleges duplikációinak, valamint a modulhatárok és a domain/adatgazdák összhangjának ellenőrzése. Azonos képesség több modulban csak közös szolgáltatásra mutató hivatkozásként szerepelhet; az esetleges eltéréseket nyitottként kell megőrizni a feloldásig.

### 63.12. Tételes checklist-megfeleltetés — 54.1–54.4

Az alábbi táblázat a 54. fejezet első négy témacsoportjának minden checkboxát a 24. fejezet stabil ID-jéhez rendeli. Több ID használata azt jelenti, hogy a követelmény több együttműködő képességet érint; nem engedélyez párhuzamos adatgazdát. A „Hivatkozás” jelölésű domainblokkok az adott modul adatait fogyasztják, nem másolják.

| Forrás | Ellenőrzőpont | Stabil ID / kanonikus modul | Megfeleltetés megjegyzése |
|---|---|---|---|
| 54.1 | Egységes Admin shell, oldalsáv, almenük, breadcrumbs, mobil navigáció | ADM-001, ADM-010 | Navigációs keret és mobil viselkedés. |
| 54.1 | Áttekintő kártyák: weboldal, live, adásrend, kapcsolatok, tartalom, feladatok | ADM-002; LIV-007, SCH-009, INT-002, CNT-013 hivatkozás | Dashboard összesít; az egyes domainállapotok tulajdonosa változatlan. |
| 54.1 | Gyorsműveletek és legutóbbi aktivitás | ADM-003, ADM-005 | A gyorsművelet a kanonikus domain-parancsot hívja. |
| 54.1 | Teendők, figyelmeztetések, hibák és elakadt folyamatok | ADM-004, NTF-001–005, INT-008, AUT-008, OPS-003 hivatkozás | Egységes felszín, forrásonkénti tulajdonos. |
| 54.1 | Globális kereső, command palette, kedvencek, legutóbbi elemek | SEARCH-001–005, ADM-006 | A keresési index nem válhat új domain-adatforrássá. |
| 54.1 | Kontextuális súgó, onboarding, üres állapotok és emberi nyelvű hibák | ADM-008, ADM-011, HELP-001–004 | A hibaállapotot a közös komponens mutatja, a súgó és onboarding tartalma a HELP_CENTER tulajdona. |
| 54.1 | Értesítési központ, prioritások, digest és csendes időszak | NTF-001–005, ADM-012 | Közös értesítési preferenciák és kézbesítési állapot. |
| 54.1 | Valós adatfrissesség, loading/empty/error/stale/partial állapot | ADM-008, ADM-013 | UI-állapot és adatfrissesség külön is látható. |
| 54.2 | Oldal CRUD, hierarchia, slug, átnevezés, duplikálás, archiválás és törlés | WEB-001, WEB-002, WEB-003 | Oldal-életciklus; függőségi figyelmeztetés kötelező. |
| 54.2 | Navigáció, dropdown/nested menü, footer, mobilmenü, belső/külső link | WEB-009, WEB-010, WEB-011 | Kanonikus navigációs fa és globális layout. |
| 54.2 | Egyetlen Visual Editor: elemkönyvtár, canvas, Layers/Outline, Inspector | EDT-015, EDT-007, EDT-012, EDT-013, EDT-021 | Az EDT a weboldal Page Modelt szerkeszti. |
| 54.2 | Drag/drop, kijelölés, átrendezés, csoportosítás, duplicate, törlés, zoom/pan | EDT-006–014, EDT-038 | A command pipeline tartja fenn az invariánsokat; csak támogatott csoportművelet aktiválható. |
| 54.2 | Undo/redo, mentési állapot, konfliktusfeloldás, revision history és restore | EDT-005, EDT-027–031, WEB-007, WEB-008 | Szerkesztési history és publikált verzió együttműködik, de nem ugyanaz az állapot. |
| 54.2 | Szöveg, heading, kép, videó/embed, gomb, link, ikon, lista, kártya, űrlap, divider, spacer, grid/flex/section/container | EDT-016–019; RES-010, RES-011 hivatkozás | Elemkönyvtár és layout-primitive-ok; média/ikon forrása a RES modul. |
| 54.2 | Dinamikus SANCI blokkok: live, következő stream, adásrend, játékprofil, videó/clip feed, social links, termék, tagság, támogatás és közösségi CTA | EDT-020; LIV-007, SCH-009–014, CNT-019, INT-018, STO-017, SUP-005, COM-018 hivatkozás | Az Editor konfigurál és megjelenít; a domainadatok a tulajdonosmodulból jönnek. |
| 54.2 | Desktop/tablet/mobile preview, breakpointonkénti override, öröklés és portrait/landscape | EDT-023–026, EDT-035–036 | A valódi mobil szerkesztési út külön acceptance-t igényel. |
| 54.2 | Globális design tokens: színek, fontok, tipográfia, spacing, border, radius, shadow, layout | DSN-001–007; EDT-021–024 fogyasztói kapcsolat | A tokenek kanonikus gazdája a DSN, nem az Editor. |
| 54.2 | Site/page/section/component sablonok, reusable komponensek, instance/override/detach, verziózás és rollback | DSN-008–015, EDT-041 | A sablonkönyvtár és a komponens master-instance a DSN modul tulajdona. |
| 54.2 | Előnézet, draft, validálás, publikálás, visszavonás és publikált snapshot megőrzése | EDT-027–034, WEB-004–008 | Mentés, preview és publish külön művelet. |
| 54.2 | SEO: title, description, canonical, robots, Open Graph, social image, sitemap, robots.txt, structured data, redirect, 404 | SEO-001–005, WEB-012–013 | A SEO-szerződés a publikus rendererre és útvonalkezelésre is kiterjed. |
| 54.2 | Domain/DNS/HTTPS státusz, favicon, brand assets, coming-soon/maintenance | SET-004, WEB-028; RES-001, DSN-005 hivatkozás | Domain lifecycle a SET, asset és brand a saját moduljában marad. |
| 54.2 | Űrlapok, validáció, spamvédelem, adatkezelési hozzájárulás és beküldés-kezelés | EDT-019, WEB-020, SEC-007, SEC-011, COM-015 ahol feliratkozásról van szó | Az Editor a formot konfigurálja; a submission és consent domainfüggő. |
| 54.2 | Webes teljesítmény, képméretezés, lazy loading, cache és Core Web Vitals | WEB-030, RES-004, QA-005, QA-006 | Publikus render, asset pipeline és mérés együttes acceptance-e. |
| 54.3 | Logóvariánsok, színek, betűcsaládok, ikonstílus, vizuális szabályok | DSN-001, DSN-005, DSN-007, DSN-017; RES-011, RES-013 hivatkozás | A vizuális szabály és a fájl/ikon/font registry külön felelősség. |
| 54.3 | Overlay, thumbnail, intro/outro, watermark, social post, merch és email sablonok | DSN-008–015, DSN-018; RES-001 hivatkozás | Sablon/design master a DSN-ben; asset bináris a RES-ben. |
| 54.3 | Brand-safe színek/fontok és kontrasztellenőrzés | DSN-001, DSN-007, QA-005 | Automatikus ellenőrzés és emberi felülvizsgálat. |
| 54.3 | Globális és komponensszintű tokenek, theme-változatok és dark/light | DSN-001–006, DSN-016 | A tokeneknek és komponensvariánsoknak egyetlen definíciója van. |
| 54.3 | SVG/PNG/WebP és megfelelő exportméretek | DSN-015; RES-004, RES-012 hivatkozás | Exportpresets és biztonságos asset-feldolgozás. |
| 54.3 | Licenc, forrás, tulajdonos, verzió és asset-használati helyek | RES-007–009; DSN-003, DSN-014 | A brand UI összesít, a licenc/usage rekord a RES-ben marad. |
| 54.3 | Brand consistency ellenőrzés, AI-javaslat és kézi jóváhagyás | DSN-003, DSN-005, AI-007, AI-012, AI-019 | Az AI csak javaslatot készít; jóváhagyás és kanonikus végrehajtás szükséges. |
| 54.4 | Egy asset registry és asset ID, R2 bináris tárolással, D1 metaadattal | RES-001, RES-002 | Egyetlen kanonikus asset registry. |
| 54.4 | Képek, videók, hangok, ikonok, fontok, dokumentumok, thumbnailök és exportok | RES-001, RES-004, RES-011–013 | Típusonkénti feldolgozás, közös ID- és metadata-szerződés. |
| 54.4 | Egyenkénti/tömeges feltöltés, progress, cancel, retry és megszakadt feltöltés helyreállítása | RES-003 | Feltöltési életciklus és hibatűrés. |
| 54.4 | MIME-/méretellenőrzés, feldolgozási státusz, preview/thumbnail és biztonsági ellenőrzés | RES-003, RES-004, RES-012, OPS-007 | Nem megbízható fájlok nem kerülhetnek közvetlenül publikált kimenetbe. |
| 54.4 | Címke, keresés, gyűjtemény, alt text, licenc, forrás és crop/focal point | RES-005–007 | Kereshető metadata és jogi/akadálymentességi adatok. |
| 54.4 | Használati helyek, függőségi figyelmeztetés és biztonságos archiválás/törlés | RES-008, RES-009 | Törlés előtt az összes hivatkozás és publikus hatás ellenőrzendő. |
| 54.4 | Metaadatmódosítások megjelenése minden hivatkozási helyen | RES-001, RES-008, RES-015 | Referencia alapján történő feloldás; nincs másolt asset-metaadat-forrás. |

**Állapot:** a 54.1–54.4 ellenőrzőpontjai stabil ID-khez és tulajdonosmodulokhoz vannak rendelve. Ez tervszintű szemantikai megfeleltetés; a hozzá tartozó runtime kód, UI, adatmodell, jogosultság és tesztek meglétét még külön kell bizonyítani. A 54.5–54.16 csoportok tételes megfeleltetése nyitott.

### 63.13. Tételes checklist-megfeleltetés — 54.5–54.8

| Forrás | Ellenőrzőpont | Stabil ID / kanonikus modul | Megfeleltetés megjegyzése |
|---|---|---|---|
| 54.5 | Integrációs központ: Twitch, YouTube, TikTok, Discord, Kick és későbbi szolgáltatók | INT-001, INT-002, INT-010, INT-013–016, INT-021 | Közös adapter- és capability-szerződés; a szolgáltatók tényleges API-jogai korlátozzák a funkciókat. |
| 54.5 | Connect/disconnect/reconnect, fiók-/csatornaválasztás, scope és lejárat | INT-006, INT-007, INT-010, INT-013–016 | Kapcsolat-életciklus, scope és channel identity. |
| 54.5 | Tokenfrissítés, revoke, titkos tárolás, CSRF/state és site ownership | INT-003–005, INT-019; SEC-002–004, SEC-008 | Site-scope és secret kezelés szerveroldali kötelezettség. |
| 54.5 | Capability/scope mátrix, API-kvóta, provider health és diagnosztika | INT-002, INT-006, INT-009, INT-018, INT-020 | Nem támogatott provider-műveletet nem szabad elérhetőként megjeleníteni. |
| 54.5 | Webhook aláírásellenőrzés, replay-védelem, deduplikáció, retry és dead-letter | INT-017, INT-008; AUT-006–008, SEC-009 | Provider esemény beérkezése és workflow-futtatás külön felelősség. |
| 54.5 | Szinkronnapló, utolsó siker/hiba, kézi újraszinkron és konfliktusfeloldás | INT-008, INT-020, OPS-002–003 | A domain-adat forrását és sync irányát naplózni kell. |
| 54.5 | Későbbi email, naptár, fizetés, affiliate, CRM és cloud-storage adapterek | INT-021; MKT-001, MKT-004 ahol bővítményről van szó | Későbbi fázis; adapter-szerződés és jogosultság kell, nem ad hoc integráció. |
| 54.5 | Nem támogatott funkció egyértelmű jelölése és alternatív folyamat | INT-018, INT-020, ADM-008 | Capability-gated UI és érthető fallback. |
| 54.6 | Live/offline állapot és adatfrissesség platformonként | LIV-001, LIV-002, LIV-007; INT-011, INT-013, INT-014, INT-016 | A provider adatát a normalizált Live domain szolgáltatja. |
| 54.6 | Cím, kategória/játék, kezdés, nézőszám és elérhető streammetrikák | LIV-003, LIV-004; SCH-012–014 hivatkozás | Csak az adott provider által engedélyezett és elérhető mezők jelennek meg. |
| 54.6 | Stream player/embed és offline fallback | LIV-005, LIV-007; WEB-015 | A publikus oldal a Live domain és biztonságos embed-szerződés fogyasztója. |
| 54.6 | Egyetlen adásrend-domain: események, ismétlődések, időzóna, ütközések | SCH-001–006 | A schedule_items az egyetlen kanonikus adásrend-forrás. |
| 54.6 | Draft/scheduled/confirmed/postponed/cancelled/completed állapot | SCH-001, SCH-005 | Állapotátmenetek és validáció az adásrend-domainben. |
| 54.6 | Twitch/YouTube sync, irány/prioritás, konfliktuskezelés és szinkronelőzmény | SCH-007, SCH-008; INT-008, INT-011, INT-013 | Provider sync nem hoz létre második helyi schedule rekordforrást. |
| 54.6 | Játékprofilok, kapcsolódó tartalom, publikus naptár, countdown és későbbi iCal | SCH-009–015, WEB-016 | Játékprofil és naptár domainkapcsolat; export a SCH tulajdona. |
| 54.6 | Stream előtti checklist, technikai próba, jegyzetek, markerek és highlight-pontok | LIV-006, OBS-008, CNT-018, CNT-021 | A stream-esemény és a tartalomszerkesztési munkafolyamat összekapcsolódik. |
| 54.6 | Multistream célok és platformonkénti metadata csak igazolt capability szerint | LIV-008, INT-018 | Capability-mátrix nélkül nincs garantált multistream támogatás. |
| 54.6 | Unified Chat, platformjelölés, moderációs státusz, küldési engedély és részleges hiba | LIV-009, INT-006, INT-018, COM-009, OBS-007 | Olvasási/küldési jog és moderációs képesség providerenként eltérhet. |
| 54.6 | Felvétel/backup/replay csak tényleges technikai lehetőség és tisztázott tárolási költség mellett | LIV-010, OBS-003, OPS-005–006 | Nincs olyan rögzítési ígéret, amelyet a runtime nem tud igazolni. |
| 54.7 | OBS-párosítás, hitelesítés, kapcsolatstátusz, reconnect és diagnosztika | OBS-002, INT-003–005, OPS-007 | A kapcsolat- és jogosultsági biztonság külön is tesztelendő. |
| 54.7 | Scene/source lista, állapot, scene-váltás, visibility, audio mute/volume a támogatott műveletek szerint | OBS-003, OBS-004 | Csak dokumentált OBS WebSocket-képességek és engedélyezett parancsok. |
| 54.7 | Overlay Studio, browser source, canvas, safe area, méret, pozíció, scene-variáns | OBS-001, OBS-005, OBS-010, DSN-001–006, RES-001 hivatkozás | Overlay-konfiguráció az OBS modulban; brand és média közös forrásból. |
| 54.7 | Alert box és eseményvariánsok follow/sub/gift/cheer/raid/tip/purchase eseményekre, ha elérhetők | OBS-006, INT-018, AUT-001 | Eseményforrás és művelet csak provider capability szerint. |
| 54.7 | Event list, chat box, goal/progress, countdown/timer, now-playing, sponsor/QR/link widget | OBS-001, OBS-006, OBS-010; SCH-009, CAM-003, RES-001 hivatkozás | Widgetek konfigurációja nem másolja az üzleti adatot. |
| 54.7 | Poll, giveaway, loyalty/points, viewer queue és media request csak jogosultsággal és szabályokkal | OBS-007, COM-004, COM-009, COM-012, SEC-007 | Jogosultság, rate limit, moderáció és szolgáltatói korlát szükséges. |
| 54.7 | Widgetteszt, preview, verziózás, rollback és megosztható overlay URL | OBS-008, OBS-010, WEB-004, WEB-007 | Preview és publikus/OBS-kimenet külön ellenőrzendő. |
| 54.7 | Chatbot parancsok, aliasok, változók, timerek, quote/counter, shoutout és FAQ | OBS-007, AUT-004, AUT-008 | A parancs-regiszter és az automatizációs engine együttműködik, de nem duplikálódik. |
| 54.7 | Spam/linkvédelem, slow/follower/sub-only policy ahol a platform engedi, moderációs napló | OBS-007, COM-009, COM-012, SEC-007 | Csak az adott platformon elérhető policy kapcsolható be. |
| 54.7 | Hotkey, Stream Deck/Macro Deck/MIDI/webhook adapter, allowlist, dry-run és végrehajtási eredmény | OBS-009, AUT-004, AUT-009, AUT-014, SEC-007 | Külső vezérlés csak allowlistelt és naplózott műveleteket indíthat. |
| 54.7 | Plugin/widget registry, verzió, kompatibilitás, permission, eredet, frissítés és eltávolítás | MKT-001–004, OBS-010, SEC-002–008, OPS-010 | Későbbi bővítmény-ökoszisztéma külön sandbox- és supply-chain kapuval. |
| 54.7 | Natív OBS plugin vagy desktop companion csak külön, dokumentált biztonsági tervvel | OBS-002, MKT-001, OPS-009–010, SEC-002–008 | Nincs automatikus feltételezés böngészőből elérhető natív funkciókról. |
| 54.8 | VOD, clip, highlight, long-form, Short/Reel, post, image, audio, podcast és replay | CNT-001–005, CNT-020; RES-001 hivatkozás | Közös content rekord, asset ID-referencia és típusonkénti metadata. |
| 54.8 | Közös content ID, platform ID, cím, leírás, thumbnail, időtartam, URL, státusz és jogadat | CNT-001, CNT-007, CNT-011, CNT-022; RES-007 hivatkozás | Platform ID nem helyettesíti a kanonikus belső content ID-t. |
| 54.8 | Keresés, szűrés, rendezés, bulk action, duplikáció-észlelés és gyűjtemények | CNT-005–007 | Lista és bulk műveletek jogosultság- és site-scope szerint. |
| 54.8 | Tartalomnaptár és státuszfolyam: idea/draft/review/ready/scheduled/publishing/published/failed | CNT-009, CNT-010, CNT-013–015 | Állapotgép és publikálási queue a Content Studio tulajdona. |
| 54.8 | Transcript, időbélyeg, speaker/fejezet, felirat, SRT/VTT, fordítás és export | CNT-018, CNT-021, AI-014, LOC-006 | AI-generált anyag jelölése, forrás és emberi review szükséges. |
| 54.8 | AI highlight/clip-javaslat forrás-időbélyeggel, indoklással és emberi választással | CNT-018, AI-014, AI-007, AI-019 | A modell javasol, a creator választ és hagy jóvá. |
| 54.8 | Videóvágás: trim/split/crop/reframe/aspect ratio, felirat, hang, átmenet és brand overlay | CNT-021, RES-004, DSN-005 | Külön render/export pipeline, verzió és asset-hivatkozás. |
| 54.8 | Thumbnail/grafika-sablon, variánsok, platformméretek és preview | CNT-012, DSN-009–015, RES-004 | A sablon/design a DSN-ben, bináris és variant a RES-ben. |
| 54.8 | Platformonkénti cím, leírás, hashtag, CTA, képarány és publikálási státusz | CNT-011, CNT-013–014, INT-018 | Provider-specifikus mezők capability-gated. |
| 54.8 | API-publikálás ahol engedélyezett; egyébként export és kézi közzétételi útmutató | CNT-013–014, INT-018, INT-020, RES-014 | A fallback a szolgáltató által ténylegesen engedett útra vezet. |
| 54.8 | Zene-/videójog, vendéghozzájárulás, lejárat, forrás és eltávolítási kérés | CNT-022, RES-007, SEC-010–011 | Jogadat és takedown életciklus nyomon követhető. |
| 54.8 | Tartalomból weboldali feed, social poszt és analitika ugyanazon canonical rekord alapján | CNT-001, CNT-016, CNT-019–020, ANL-001, ANL-004 | A feed és analytics ugyanarra a content ID-ra hivatkozik. |

**Állapot:** a 54.5–54.8 tételek stabil ID-khez rendelése tervszinten megtörtént; a runtime meglétét és acceptance-teszteket ez nem igazolja. A 54.9–54.16 tételes megfeleltetése továbbra is nyitott.

### 63.14. Tételes checklist-megfeleltetés — 54.9–54.12

| Forrás | Ellenőrzőpont | Stabil ID / kanonikus modul | Megfeleltetés megjegyzése |
|---|---|---|---|
| 54.9 | Publikus fan regisztráció/bejelentkezés, profil, preferencia, adatletöltés/törlés | COM-019, SEC-001, SEC-011 | Külön fan identity; nem keverhető az Admin/workspace accounttal. |
| 54.9 | Posztok, kommentek, reakciók, pollok, kérdések, beküldések és események | COM-003–005, COM-007–008 | Közösségi tartalomtípusok és publikus láthatóság. |
| 54.9 | Követés, értesítés, jelvény, mérföldkő, kihívás és közösségi jutalom | COM-006, COM-010–011 | A későbbi képességek külön státusszal és consent/notification policyvel. |
| 54.9 | Tagsági szintek, exkluzív poszt/video/audio, member-only stream és archívum | SUP-004–006, SUP-010–011, COM-013, COM-018 | Entitlement az SUP tulajdona; a COM csak a közösségi felületet és hozzáférési policyt használja. |
| 54.9 | Discord szerver/csatorna/role mapping entitlement alapján | SUP-009, INT-015, INT-018 | A tagsági entitlement a forrás; Discord role sync csak engedélyezett provider-képességgel. |
| 54.9 | Moderációs queue, report, appeal, korlátozás/tiltás, spamvédelem és audit | COM-009, COM-012, COM-020, SEC-007, SEC-010 | Moderációs művelet naplózott, jogosultság- és rate-limit-védett. |
| 54.9 | AI moderációs javaslat, bizonytalanság és emberi felülvizsgálat | AI-006, AI-007, AI-016, AI-018–019, COM-009 | AI nem hozhat automatikusan visszafordíthatatlan vagy vitatott szankciót emberi felülvizsgálat nélkül. |
| 54.9 | Public/member-only/private hozzáférés szerveroldali ellenőrzése | COM-013, COM-018, SUP-006, SEC-002–003 | Kliensoldali elrejtés önmagában nem authorization. |
| 54.9 | Közösségi szabályzat, adatvédelmi és korhatár-/tartalmi szabályok | COM-020, COM-012, SEC-010–011 | Közzététel előtt jogi/termékdöntés, jelentési és fellebbezési folyamat. |
| 54.10 | Fizikai termék, merch, digitális termék, bundle, limited drop és preorder | STO-001, STO-005–006 | Terméktípus és fulfillment modell egyértelmű. |
| 54.10 | Variánsok, SKU, ár/pénznem, készlet, kategória, kollekció, media és SEO | STO-002–004, STO-006, RES-001, SEO-001–005 hivatkozás | Termékadat a Store-ban; média és SEO a saját kanonikus szerződését használja. |
| 54.10 | Terméklista, termékoldal, keresés, kosár, checkout-integráció és rendelés-visszaigazolás | STO-007–009, STO-019, INT-021 | Checkout provider adapteren át; a siker csak ellenőrzött provider állapot után állítható. |
| 54.10 | Rendelésállapot, fizetés, teljesítés, tracking, cancel, refund és support | STO-009–010, STO-018, SUP-001, OPS-003 | Webhook idempotens; rendelés és entitlement összehangoltan frissül. |
| 54.10 | Kupon, ajándékkártya, promóció, kampány, bundle és lejárat | STO-003, STO-011, STO-019; CAM-001–003 | Promóciós adat és campaign-attribution összekapcsolódik, de nem duplikálódik. |
| 54.10 | Biztonságos digitális delivery, entitlement és visszavonás refund/chargeback esetén | STO-012–013, STO-018, SUP-006, SUP-008, SEC-002–003 | Minden letöltés jogosultság-ellenőrzött és visszavonható. |
| 54.10 | Egyszeri támogatás, visszatérő támogatás, célmérő és köszönőüzenet | SUP-001–003, SUP-010 | Provider státuszától függő támogatási folyamat; ne állítson nem igazolt fizetést. |
| 54.10 | Tagsági előnyök, kedvezmények, termékdrop és tagság–Discord összekapcsolás | SUP-004–012, STO-011, INT-015 | Entitlement és Discord role sync az SUP/INT domain szerződésein keresztül. |
| 54.10 | Szponzorációs media kit, ajánlat, deliverable, határidő, kampánylink és riport | CAM-004–009 | Kampány- és üzleti dokumentumok külön scope és hozzáférés alatt. |
| 54.10 | Affiliate link/kód, jutalék és konverzió csak mérhető/jogszerű keretben | CAM-002, CAM-007, STO-011, ANL-001, ANL-009 | Attribution és consent szükséges; csak igazolt mérésből készül riport. |
| 54.10 | Bevételi források, platformdíjak, refundok és export; nem könyvelési/adótanácsadási helyettesítő | STO-020, SUP-010, CAM-007–009, ANL-005, OPS-007 | Összesítő riport, nem hivatalos könyvelési főkönyv. |
| 54.10 | Fizetési, adózási, számlázási, fogyasztóvédelmi és GDPR-követelmények ellenőrzése | STO-014, STO-019, STO-021, SEC-010–011, OPS-010 | Integráció és kereskedelmi indulás előtt kötelező jogi/adózási felülvizsgálati kapu. |
| 54.11 | Platformonkénti követő-/nézettség-/engagement-/streamidő-mutatók, ha elérhetők | ANL-001, ANL-003–004, INT-018 | Csak provider által ténylegesen elérhető metrikák; egység és frissesség megjelenítése. |
| 54.11 | Tartalom- és csatorna-összehasonlítás, trendek, időszakok és célok | ANL-004, ANL-007, ANL-010, CAM-007 | Összehasonlítható metrikák; hiányzó vagy eltérő definíciók jelzése. |
| 54.11 | Adatforrás, időbélyeg, frissesség, becsült/valós adat és hiányzó metrika jelzése | ANL-008, ANL-009 | Minden chart/report a forrást és adatminőséget közli. |
| 54.11 | Webanalitika, UTM, konverzió, SEO és publikált oldalak teljesítménye | ANL-002, ANL-007, ANL-009; CAM-002; SEO-005 | Consent és retention policy, plusz SEO- és webes forrásadat. |
| 54.11 | Thumbnail/cím/időzítés kísérletek és mérhető eredmények, ha elég adat áll rendelkezésre | ANL-004, ANL-010, CAM-001–003, CNT-011–012 | A/B teszt csak megfelelő mintánál; bizonytalanságot közölni kell. |
| 54.11 | Kampány-/szponzorriport, CSV/JSON export és időszakos jelentés | CAM-007–009, ANL-007, OPS-007 | Export a forrást, időszakot és definíciót is tartalmazza. |
| 54.11 | AI-elemzés hipotézisekkel, forrással és bizonytalansággal; nem garantált növekedési ígéret | AI-004, AI-012–013, AI-015–016, AI-018; ANL-008 | A javaslat forrásolt és nem garantál üzleti eredményt. |
| 54.12 | Vizuális trigger → condition → action → branch modell | AUT-001–004, AUT-013 | A vizuális builder a workflow engine sémáját szerkeszti, nem saját runtime-ot. |
| 54.12 | Triggerek: stream, platformesemény, schedule, tartalom, rendelés, tagság, webhook, időzítés | AUT-001–002, INT-017, LIV-006, SCH-001, CNT-001, STO-018, SUP-006 | Triggerforrások kanonikus domain eventjeiből; nem polling-másolatokból, ahol elkerülhető. |
| 54.12 | Akciók: értesítés, draft, címke, export, overlay/OBS parancs, publikálási előkészítés | AUT-004, AUT-014, OBS-004, CNT-013, NTF-001–005 | Csak engedélyezett domain-command és scope alapján fut. |
| 54.12 | Sablonok, verziózás, aktiválás/leállítás és jogosultság | AUT-010, AUT-013, SEC-002–003 | Változtatáskor verzió és audit; owner kontrollálja az aktiválást. |
| 54.12 | Dry-run, preview, jóváhagyás, idempotency, rate limit, retry, timeout és napló | AUT-006–009, AUT-011, SEC-007 | Végrehajtás előtt szimuláció és permission check. |
| 54.12 | Sikertelen ág, karantén, értesítés, kézi helyreállítás és rollback/kompenzáció | AUT-007–008, AUT-012, OPS-003, OPS-009 | Helyreállítható és auditált futási életciklus. |
| 54.12 | AI-ból létrehozott workflow először draft/szimuláció; csak jóváhagyás után éles | AI-005–009, AI-019, AUT-009–010 | AI workflow-draftot ad; élesítés külön jóváhagyási pont. |

**Állapot:** a 54.9–54.12 tételek stabil ID-khez vannak rendelve. A hozzájuk tartozó runtime, jogosultsági és acceptance bizonyíték külön ellenőrzendő; a 54.13–54.16 tételes megfeleltetése nyitott.

### 63.15. Tételes checklist-megfeleltetés — 54.13–54.16

| Forrás | Ellenőrzőpont | Stabil ID / kanonikus modul | Megfeleltetés megjegyzése |
|---|---|---|---|
| 54.13 | AI Control Center: provider/model, költségkeret, kvóta, retention, adatforrás és stop switch | AI-001, AI-004, AI-010, AI-017, SEC-008, OPS-007 | Provider, usage és adatkezelési korlátok közös vezérlőfelülete. |
| 54.13 | Projekt-/brandkontextus jogosultsággal és megtekinthető forrásokkal | AI-004, AI-006, AI-018, DSN-003 hivatkozás | Kontextus csak engedélyezett domainből; források és kizárt mezők megtekinthetők. |
| 54.13 | Website Designer: oldal/komponens/dizájn/responsive/SEO/accessibility javaslat | AI-011–012, AI-007–009, EDT-001–026, DSN-001–007 hivatkozás | Az AI a kanonikus Editor/API szerződéseken dolgozik; nem épít második editort. |
| 54.13 | Live Coach: opt-in technikai jelzések, pillanatjelölés és stream-/chat-összegzés | AI-015, AI-004, LIV-006, OBS-003, OBS-008, SEC-011 | Opt-in és adatforrás-korlát; jelölés/javaslat nem egyenlő automatikus végrehajtással. |
| 54.13 | Content Producer: transcript, clip, felirat, fordítás, thumbnail, cím és platformvariáns | AI-013–014, AI-021, CNT-011–012, CNT-018–022, LOC-006 | A Content Studio a tartalom és a renderelt assetek kanonikus gazdája. |
| 54.13 | Community Assistant: FAQ, összegzés, moderációs javaslat és tagsági művelet-előkészítés | AI-016, AI-018–019, COM-009, COM-011, SUP-006 | AI javaslatot készít; moderációs, tagsági és hozzáférési döntés a domain policy szerint. |
| 54.13 | Business Analyst: tartalom/kampány elemzés, hipotézis, mérhető teszt | AI-013, AI-015–016, ANL-004, ANL-007–010, CAM-007 | Forrás, minta, bizonytalanság és mérhető validáció kötelező. |
| 54.13 | Automation Builder: természetes nyelvből workflow-draft, szimuláció és diff | AI-003, AI-005, AI-007–009, AUT-009–010 | Az első eredmény draft; aktiválás külön jóváhagyás. |
| 54.13 | Kép-/grafika-/hang-/videógenerálás megfelelő külső modellel/szolgáltatóval, licenc- és költségkorláttal | AI-001, AI-010, AI-021, RES-007, OPS-010 | Provider capability, licenc, költség, biztonság és eredet ellenőrzendő. |
| 54.13 | AI-művelet domain API-n át; kockázati szint, preview, jóváhagyás, napló és visszaállítás | AI-005–009, AI-019, SEC-002–003, OPS-009 | Nincs közvetlen, ellenőrizetlen adatbázis- vagy UI-módosítás. |
| 54.13 | Generált tartalom jelölése, forrás és bizonytalanság, felhasználói visszajelzés | AI-002, AI-007, AI-010, AI-018, AI-021 | Modell/verzió, forrás és felhasználói feedback rögzítendő. |
| 54.13 | Manuális, AI nélküli út minden alapvető termékfolyamathoz | AI-020, QA-008–009 | Az AI nem lehet kritikus funkció egyetlen elérési útja. |
| 54.14 | Admin és publikus web külön nyelvi beállítással | LOC-001–003, SET-001 | Admin UI-locale és publikus tartalom locale külön konfiguráció. |
| 54.14 | Magyar elsődleges nyelv, további nyelvek fokozatos bevezetése | LOC-001, LOC-003, LOC-005, SET-001 | Magyar az alapértelmezés; további locale nem jelenhet meg késznek hiányos fordítással. |
| 54.14 | Locale-onkénti oldal-/CMS-tartalom, menü, média, alt text, SEO és Open Graph | LOC-003–005, WEB-009, SEO-001–005, RES-007 | Locale-specifikus tartalom és metaadat; hiány esetén explicit fallback. |
| 54.14 | Lokalizált slug/URL, hreflang/canonical szabályok és nyelvi fallback | LOC-004, SEO-001, SEO-004, WEB-002, WEB-013 | URL és SEO-konfliktusok validálása publikálás előtt. |
| 54.14 | Dátum/idő/pénznem/szám lokalizáció, időzóna és nyári időszámítás | LOC-002, SCH-003, STO-002, SET-001 | Domainérték tárolása és locale szerinti megjelenítés nem keverhető. |
| 54.14 | RTL layout, billentyűzet, font fallback és hosszabb fordítások tesztje | LOC-002, LOC-005, QA-004–005, DSN-007 | Valós RTL és hosszú szöveg teszt szükséges, nem csak fordítási string. |
| 54.14 | Fordítási memória/szószedet és AI-fordítás emberi jóváhagyással | LOC-006, AI-007, AI-019 | Automatikus fordítás draft; publikálás előtt review. |
| 54.14 | Nyelvváltó, automatikus nyelvajánlás és felhasználói választás megőrzése | LOC-001, LOC-003, LOC-005, WEB-009 | Választás tiszteletben tartása; automatikus ajánlás nem kényszeríthet nyelvváltást. |
| 54.15 | Profil, site/workspace, locale, timezone, dátum/pénznem és preferenciák | SET-001–002, TEAM-001, LOC-001–002 | User preference és site setting külön scope. |
| 54.15 | Szerepek: owner/admin/editor/moderator/analyst/commerce és modulonkénti engedély | SEC-002–003, TEAM-002–004 | RBAC szerveroldali, modul- és műveletszintű ellenőrzéssel. |
| 54.15 | Szerveroldali authorization, site/tenant izoláció és minimális jogosultság | SEC-002–003, SEC-006–008, QA-003 | Negatív cross-site tesztek kötelezők. |
| 54.15 | Session, 2FA/SSO később, secret rotation, rate limit és gyanús aktivitás | SEC-001, SEC-007–008, SEC-012, OPS-003 | 2FA/SSO státusz és ütemezés külön kezelendő; secret soha nem kerül logba. |
| 54.15 | Titok/token/payment adat redakció; titkosított token storage | INT-004, INT-019, SEC-008, SEC-010 | Secret lifecycle és redaction mind a logban, mind diagnosztikai exportban. |
| 54.15 | Consent, cookie/privacy, retention, export/delete és adatfeldolgozók | SEC-010–011, COM-017, ANL-009, AI-004 | Domainonkénti retention/consent és ellenőrzött export/delete. |
| 54.15 | Backup, restore próba, verziózott mentés, import/export és disaster recovery | OPS-005–006, OPS-009, QA-007 | Restore drill bizonyíték nélkül nincs PASS. |
| 54.15 | Health, job queue, webhook, API-quota, error log és audit log | OPS-001–003, OPS-007, OPS-011, INT-008, AUT-008 | Egységes diagnosztika, korrelációs azonosítók és secret-redaction. |
| 54.15 | Idempotencia, retry, timeout, cache invalidation, stale-data és partial-failure kezelés | AUT-006–008, INT-008–009, DYN-005–006, WEB-030, OPS-011 | Domainonkénti retry és közös megfigyelhetőség; nincs végtelen újrapróbálás. |
| 54.15 | Undo/redo, revision diff, restore és törlés előtti függőségi vizsgálat | EDT-005, EDT-029–031, WEB-007–008, RES-008–009, OPS-005 | A visszaállítás a megfelelő domain saját verziómodelljén fut. |
| 54.15 | WCAG 2.2 AA cél, reduced motion, screen reader, kontraszt, fókusz és touch target | QA-004–005, EDT-037, EDT-040, DSN-003 | Akadálymentességi acceptance minden fő UI-útvonalon. |
| 54.15 | Mobil/tablet/desktop, gyenge hálózat, offline-jelzés és adatvesztés elleni védelem | QA-004, EDT-035–036, EDT-031, EDT-042, ADM-008, OPS-003 | Responsive és hálózati hibateszt külön acceptance. |
| 54.15 | Tesztek: domain, integration, authorization, migration, UI, accessibility, responsive, E2E és smoke | QA-001–009 | A tesztkatalógus nem puszta felsorolás: futási eredmény és evidence szükséges. |
| 54.16 | Dokumentált API, webhook registry, API-key kezelés, tesztelő és sandbox | DEV-001–004, DEV-006, INT-017, SEC-008 | Developer Platform/API modul; scope, expiry, rate limit és audit. |
| 54.16 | Extension/widget/overlay manifest, schema, permission, verzió és kompatibilitás | MKT-001–002, MKT-004, OBS-010, DEV-005 | Extension manifest és SDK külön szerződés; kompatibilitás tesztelendő. |
| 54.16 | Eredet/licenc/aláírás, sandbox, felülvizsgálat, frissítés, eltávolítás és visszavonás | MKT-001–004, OPS-010, SEC-002–008 | Bővítmény és dependency supply-chain kockázat kezelendő. |
| 54.16 | Template/component/overlay/workflow marketplace későbbi fázisban | MKT-003–005, DSN-018, AUT-013 | Marketplace későbbi fázis, jogi/licenc és fizetési kapuval. |
| 54.16 | Több site/workspace, aktív workspace választó, csapatmeghívás és szerepek | TEAM-001–004, TEAM-005, SEC-003 | Aktív scope explicit; minden kérés szerveroldalon ellenőrzött. |
| 54.16 | Agency/studio mód, ügyfélhozzáférés, közös sablonok és jóváhagyás | TEAM-007, TEAM-003–004, DSN-008–015 | Kliensenkénti brand, adat és jóváhagyás izolált. |
| 54.16 | Későbbi SaaS billing, csomag, használati limit, számla, lemondás és adat-export | TEAM-006, STO-021, OPS-007 | Billing és plan entitlement nem keverhető a store-rendelés domainnel. |
| 54.16 | Tenant izoláció, migráció, skálázás, adatrezidencia és költségfelügyelet | SEC-003, OPS-004–006, OPS-008–011, TEAM-005–006 | Későbbi SaaS-kapu; migráció/restore és költségmodell bizonyítékkal. |

**Állapot:** a 54.13–54.16 tételek stabil ID-khez vannak rendelve. A 54.1–54.16 teljes checklistének tervszintű megfeleltetése most elkészült; a következő audit a 156 sorhoz rendelt ID-k létezését, szemantikai pontosságát, valódi duplikációit és a 49. fejezet modulhatáraival való összhangját ellenőrzi. Ez még nem igazolja a runtime implementációt vagy az acceptance-tesztek PASS állapotát.

### 63.16. Tervszintű keresztmegfeleltetési ellenőrzőpont — 2026-10-14

Az ellenőrzés a kanonikus terv aktuális GitHub-változatán futott. Eredmény:
- A 54. fejezetben **156 checklist-tétel** van; a 63.12–63.15 táblázatokban **156/156** tételhez tartozik külön megfeleltetési sor.
- A megfeleltetési sorokban használt stabil ID-k mind megtalálhatók a 24. fejezetben; a jelen ellenőrzésben nincs feloldatlan ID-hivatkozás.
- A 24. fejezetben **396 stabil funkcióazonosító** szerepel, és az azonosítók egyediek.
- A 49. fejezetben **22 egymást követő főmodul** szerepel 49.1–49.22 között; a média/erőforrás, fejlesztői API, bővítmény-piactér és csapat/SaaS külön főmodul.
- A 54. fejezet normalizált, pontos szövegduplikáció-ellenőrzése korábban nem talált ismétlődő checklist-tételt.

**Korlátok és nyitott munka:** ez strukturális/azonosító-keresztellenőrzés, nem bizonyítja, hogy minden hozzárendelés szemantikailag tökéletes, nincs-e két külön szöveg mögött ugyanaz a képesség, minden domain-szerződés teljes-e, vagy a runtime megvalósítja-e a tervet. Következő feladat a szemantikai duplikáció- és tulajdonosmodul-audit, majd a meglévő kód, API-k, adatmodellek, jogosultságok és tesztek összevetése. A fejlesztési fagyasztás és a tervlezárási kapu változatlanul érvényes; ez az ellenőrzőpont önmagában nem engedélyezi az F0 megkezdését.

### 63.17. Szemantikai duplikáció- és határvizsgálat — első kör

A 24. fejezet 396 funkcióleírásán tokenhasonlósági előszűrés futott. Ez nem dönt automatikusan a duplikációról; a hasonló elnevezések kézi tulajdonosmodul-vizsgálatot indítanak. Az első körben az alábbi hasonlóságokat explicit határleírással oldottuk fel a stabil ID-k definíciójában:

- **INT-017 ↔ SEC-009:** provider webhook delivery/integráció vs. keresztmodulú biztonsági követelmény és negatív teszt.
- **WEB-017 ↔ CNT-020; WEB-016 ↔ SCH-010:** publikus oldal/route-shell vs. kanonikus tartalom-/schedule projection.
- **CNT-005 ↔ STO-003 ↔ RES-006:** content taxonómia vs. termékkatalógus taxonómia vs. asset library taxonómia.
- **ADM-008 ↔ DYN-005:** közös Admin UI-állapot komponensek vs. dinamikus binding runtime állapotgép.
- **RES-005 ↔ CNT-006 ↔ DYN-003:** asset könyvtár keresése vs. content könyvtár keresése vs. whitelistelt dinamikus lekérdezési műveletek.
- **INT-018 ↔ AI-001:** külső integrációk provider-capability katalógusa vs. AI modell/provider registry.
- **CNT-018 ↔ AI-014:** content-domain artifact/review lifecycle vs. AI által javasolt jelölt.
- **COM-013 ↔ SUP-005/SUP-011:** közösségi felületi hozzáférés-ellenőrzés vs. tagsági entitlement definíció.
- **AUT-008 ↔ SEC-010:** workflow run history vs. keresztmodulú security/privacy audit.
- **EDT-039 ↔ AUT-004:** oldalelem-interakciós séma vs. automation action catalog és szerveroldali engedélyezés.
- **DSN-014 ↔ AI-002:** vizuális template lifecycle vs. AI prompt-template lifecycle.
- **INT-001 ↔ STO-008:** általános provider adapter contract vs. Store checkout workflow adapter.
- **SCH-011 ↔ CNT-019:** két külön Editor-blokk; az egyik schedule, a másik content feed adatforrását fogyasztja.
- **SEC-003 ↔ TEAM-001/TEAM-005:** security isolation invariant vs. workspace selector/multi-site termékfolyamat.
- **OPS-005 ↔ QA-007; WEB-007 ↔ QA-007:** működési képesség vs. az azt bizonyító tesztkapu.

A hasonló prefixű provider adapterek (például TikTok/Kick), különböző template-típusok, valamint a publikus oldalak különböző route-jai önmagukban nem duplikációk: külön képességek vagy külön domain-típusok. Az explicit határleírások megőrzik a szükséges funkciókat, miközben megakadályozzák a párhuzamos adatgazdák létrehozását.

**Állapot:** az első körös, névszintű hasonlósági jelzések közül a fő modulhatár-ütközések definíciója tisztázva lett. A teljes szemantikai audit továbbra is IN PROGRESS: az ID-k és a 54. fejezet tételes megfeleltetésének véglegesítéséhez a domain-katalógus, API-k, adatmodellek, tényleges UI és tesztek összevetése szükséges.

### 63.18. Hasonlósági előszűrés — fennmaradó külön képességek

A 396 stabil ID leírásának második, név/token alapú előszűrésében fennmaradt magas hasonlóságok kézi osztályozása:

- **RES-006 / CNT-005 / STO-003:** hasonló taxonómiai műveletek, de eltérő kanonikus adattípusok (asset, content, product); az egyes definíciók kifejezetten kizárják a másik domain taxonómiájának birtoklását.
- **DSN-008–DSN-011:** site-, page-, section- és component-template könyvtárak; külön alkalmazási szint, közös design/template infrastruktúra.
- **INT-014 / INT-016:** TikTok- és Kick-adapterek; külön provider és külön capability/engedély.
- **RES-005 / CNT-006:** asset registry vs. content library keresés; közös UI-minta, eltérő domain query.
- **ANL-001 / AUT-001:** analytics eseménynév-/mérési taxonómia vs. workflow trigger-katalógus; az eseményforrás közös lehet, de az analitikai jelentés és a workflow végrehajtás külön szerződés.
- **WEB-016 / WEB-017, WEB-014 / WEB-018, WEB-015 / WEB-023 és a többi publikus route-pár:** külön publikus oldaltípusok; hasonló oldalszerkezet nem jelent azonos tartalmi célt.
- **SCH-011 / CNT-019:** két Editor-blokk, két eltérő domain-adatforrással.
- **DSN-014 / AI-002:** vizuális sablonverziózás vs. AI prompt/instruction verziózás.
- **INT-018 / AI-001:** külső integrációs capability vs. AI modell/provider capability.

Ezeket a párokat nem szabad pusztán szöveghasonlóság miatt összevonni. A tényleges összevonás csak akkor engedhető meg, ha a domainmodell, az adatforrás, a jogosultság, az életciklus és az elfogadási teszt is azonos, és az összevonás nem veszít el képességet.

**Állapot:** a szöveghasonlósági előszűrés és az első körös határmagyarázat elkészült. Ez nem zárja le a teljes szemantikai auditot: a továbbiakban a domain/adatmodell/API/UI/test evidence alapján kell ellenőrizni, hogy a szándékolt határok a terv többi fejezetében is következetesek-e.

### 63.19. Domain-térkép és felhasználói főmodulok egyeztetése

A 49. fejezet felhasználói navigációs moduljai és az 5. fejezet domain/adatforrás-térképe eltérő nézőpontok: egy modul több domain szolgáltatást fogyaszthat, egy domain több felületet kiszolgálhat, de üzleti képességenként egyetlen kanonikus adatgazda marad. Az 5. fejezet ezért kiegészült a lokalizáció, SEO/publikációs metadata, form beküldések, értesítések, permission-aware keresés, fan identity, OBS/overlay, Developer API, extension registry és SaaS billing/plan domainekkel.

Különösen fontos határok:
- **SEARCH / Dashboard:** indexelt és összesített olvasási nézet; soha nem írhatja felül a forrásdomaint.
- **FAN_IDENTITY / IDENTITY:** a creator/Admin session és a publikus rajongói fiók külön biztonsági határ.
- **DEVELOPER_API / EXTENSION:** az API key/webhook/API lifecycle nem azonos a telepített extension manifest/sandbox lifecycle-jával.
- **BILLING_PLAN / ORDER / ENTITLEMENT:** SaaS-előfizetés és platformcsomag nem azonos a creator boltjának rendelésével vagy a fan tagsági hozzáféréssel.
- **STREAM_TOOLS / INTEGRATION / AUTOMATION:** OBS pairing/overlay konfiguráció, külső provider-auth és workflow execution külön domainfelelősség.

**Állapot:** a domain-térkép szerkezeti teljessége bővült, és a provider-adapter, derived cache, creator webhook, fan identity, order és support owner határai egyértelműbbek lettek; a teljes schema/API/runtime egyezés továbbra is kód- és tesztbizonyítékot igényel.

### 63.20. Kanonikus főmodul → domain/adatgazda keresztmátrix

Ez a mátrix összeköti a 49. fejezet felhasználói moduljait az 5. fejezet kanonikus domainjeivel. A modul a felhasználói belépési pont; a domain az üzleti adat és lifecycle gazdája. Ha egy sor több domaint sorol fel, mindegyik külön szerződése megmarad, nem olvad össze egyetlen közös adattárrá.

| Kanonikus főmodul | Elsődleges domain/adatgazda | Határszabály |
|---|---|---|
| 49.1 Kezdőlap és napi áttekintés | ADM UI contract; permission-aware read projections | Aggregál és navigál; nem birtokolja a schedule, content, integration, order vagy analytics rekordokat. |
| 49.2 Weboldal | SITE, PAGE, REVISION, NAVIGATION, SEO_PUBLICATION, FORM_SUBMISSION | Page Model a megjelenítést/configot birtokolja; domainblokkok csak hivatkoznak más domainek adataira. |
| 49.3 Márka és designrendszer | DESIGN_SYSTEM | Tokenek, témák és template-masterek; bináris assetek a RESOURCE-ban. |
| 49.4 Média- és erőforráskönyvtár | RESOURCE | Egy asset registry, asset ID, D1 metadata és R2 bináris; a többi modul csak referenciát használ. |
| 49.5 Élő adás és Stream Studio | LIVE_STATE, SCHEDULE, GAME_PROFILE | Live state, adásrend és játékprofil külön domain; egy felület nem jelent közös rekordmodellt. |
| 49.6 OBS és stream eszközök | STREAM_TOOLS | Overlay/widget/pairing konfiguráció; OBS/provider auth és scope az INTEGRATION szerződését használja. |
| 49.7 Kapcsolatok és integrációk | INTEGRATION | Külső fiók, OAuth/token reference, scope, provider capability és inbound webhook. |
| 49.8 Tartalomstúdió | CONTENT, PUBLISHING | Tartalomrekord és publikálási queue; asset a RESOURCE, kampány a CAMPAIGN, provider connection az INTEGRATION tulajdona. |
| 49.9 Közösség és rajongók | COMMUNITY, FAN_IDENTITY | Community post/moderation és fan identity külön; membership entitlementet az ENTITLEMENT szolgáltatja. |
| 49.10 Bolt és kereskedelem | PRODUCT, ORDER | Termékkatalógus és rendelés külön; payment provider adapter az INTEGRATION-szerződést követi. |
| 49.11 Támogatás és tagság | SUPPORT, ENTITLEMENT | Support provider state és tagsági hozzáférés külön domain; Discord role sync az entitlementből indul. |
| 49.12 Szponzoráció és üzleti központ | CAMPAIGN, SPONSORSHIP | Lead/deal/deliverable és B2B kampány; a riport az ANALYTICS read-modelt fogyasztja. |
| 49.13 Analitika és növekedés | ANALYTICS | Metrikát normalizál/aggregál; nem írja át a forrásdomain üzleti rekordját. |
| 49.14 Automatizációk | AUTOMATION | Workflow/runs/retry; domainmódosítás csak az engedélyezett domain command/API-n keresztül. |
| 49.15 SANCI AI | AI_OPERATION | Javaslat, kontextus, approval és usage; üzleti módosítás a célmodul commandján keresztül. |
| 49.16 Globális keresés és parancspaletta | SEARCH | Permission-aware derived index; a találat a kanonikus domain rekordjára navigál. |
| 49.17 Értesítési központ | NOTIFICATION | Delivery/preference state saját domain; a Dashboard csak összesít. |
| 49.18 Súgó és onboarding | HELP_CENTER | Help content és onboarding progress; ADM csak kontextuális belépési pont. |
| 49.19 Beállítások, biztonság és adat | IDENTITY, SETTINGS, LOCALIZATION, AUDIT, BACKUP; SEC/OPS keresztmetszeti | A globális beállítások nem másolják a domain-specifikus konfigurációt; security policy minden modulra érvényes. |
| 49.20 Fejlesztői platform és API | DEVELOPER_API | Creator által létrehozott API keys/outbound webhooks; provider inbound webhooks az INTEGRATION-ben. |
| 49.21 Bővítmények, widgetek és piactér | EXTENSION | Manifest, install, permission, signature, compatibility és sandbox lifecycle. |
| 49.22 Csapat, több site és SaaS | WORKSPACE, BILLING_PLAN | Workspace/team és SaaS plan/usage külön; nem azonos a Store ORDER vagy fan ENTITLEMENT állapottal. |

**Ellenőrzés:** a jelenlegi 5. fejezet 38 domain-ID-ja mindegyikéhez kijelölhető a fenti főmodulok közül legalább egy kanonikus belépési pont. Ez a dokumentumon belüli felelősségi keresztmátrix; a tényleges kód, adatbázis, API és jogosultsági implementáció egyezését külön auditálni kell.

### 63.21. Termékterv-teljesség és funkcióindítás: két külön bizonyítékkapu

A 24. fejezetben **396 egyedi funkció-ID** szerepel; a 49. fejezet **22 főmodult** definiál. A 54. fejezet 156 elemű felhasználói felülvizsgálati listájának ID-megfeleltetését a 63.12–63.15, a 396 ID egyedi evidenciakiindulását a 63.26–63.37, a fázishoz rendelést a 63.38 tartalmazza. **Ezek együtt a teljes termékterv ellenőrizhető katalógusát alkotják, de nem jelentik, hogy a 396 képesség kész vagy minden implementációs részlet végleges.**

**A kapu — véglegesíthető termékscope / tervkonzisztencia, jelenleg IN PROGRESS:**
- [x] Egyetlen jelenlegi MASTER-fájl, egyetlen aktív tervpont, 396 egyedi ID, 22 főmodul és F0–F11 kanonikus fázisrendszer szerepel.
- [x] A 156 review checklist-elem és a 396 ID előzetes, visszakereshető modul-/fázis-/bizonyítékmátrixba van rendelve (63.12–63.38); ez statikus lefedettség, nem a jelentés teljes helyességének bizonyítása.
- [ ] A korábbi követelmények történeti megőrzése és a hiányzó források kezelése tételesen megvizsgált; „nem sikerült visszanyerni” **nem** egyenlő a „nem volt funkció” állítással.
- [ ] Valamennyi kanonikus modul és cross-module owner, felhasználói belépési pont, közös erőforrás, függőség és fontos negatív journey közötti szemantikai konfliktus feloldva vagy indokolt, lokalizált nyitott döntésként rögzítve.
- [ ] A menü-/modultérkép és a teljes, felhasználóval közösen áttekintett funkciólista jóváhagyott; a későbbi fázisok nem vesznek el a mostani 1.0-scope mögött.
- [ ] A 63.1–63.2 teljes checklisten minden PASS-állításnak konkrét bizonyítéka van; nincs nyitott, release-t blokkoló konzisztenciahiba.

**B kapu — egyetlen munkapont implementációs készsége (26.1 szerinti 17 mező és 25. szerinti státuszmezők):**
- Az adott **következő aktív** funkcióhoz/sub-ID-hoz a 26.1 teljes kártyája kitöltött, a kódolvasásból igazolható tény, az OPEN döntés és a későbbi teszt külön látszik.
- Meglévő route/domain/schema/UI/teszt áttekintése után kötelező a **REUSE / ADAPT / BUILD / DEFER / REJECT** döntés, feltüntetve a megfelelő jogosultságot és a nem kívánt duplikáció elkerülését.
- Pozitív, negatív, authorization, mentés/reload, mobil/accessibility, rollback és provider-failure acceptance csak ott követelhető, ahol releváns; hiányzó bizonyítéknál UNVERIFIED.
- Implementációs PASS csak tényleges teszt/CI/runtime/felhasználói elfogadás alapján. Dokumentációs PASS nem helyettesíti.
- Következő függő munkapont csak az előző lezárása és a MASTER státuszfrissítése után aktív.

**Kritikus különbség:** mind a 396 ID specifikációja, roadmapja és megőrzése a kész *termékterv* része; a 396 ID teljes, különálló végrehajtási kártyájának előzetes, azonos mélységű kidolgozása **nem** teszi automatikusan biztonságosabbá az F0 indulását. A teljes 17 mezős kártya **kötelező az érintett munka aktiválásakor**, nem kell a F10/F11 jövőbeli API-ját úgy előre részletezni, mintha ma ismert lenne. A már meglévő EDT-vázlatok és mély kártyák bizonyítékai megőrzendők, nem törölhetők. A 63.39–63.50 régebbi számadatai és „következő lépései” az adott ellenőrzés történeti pillanatképét jelentik; a **jelenlegi** végrehajtási szabály a 0., 25.–26. és e 63.21 szakasz együttese.

**Állapot:** A kapu IN PROGRESS / NOT PASS (elsősorban történeti forrás- és szemantikai audit); B kapu csak a konkrét aktív funkciónál, külön bizonyítható. F0 még nem aktív. A meglevő kód újraírása tilos igazolt hiány/hiba nélkül.

### 63.22. Meglévő kód újrahasználati audit — első core szelet, 2026-10-14

**Vizsgált ref:** `v2/foundation`. Ez forráskód-olvasási audit; ebben a lépésben nem futtattam tesztet, nem végeztem éles böngészős/Worker ellenőrzést, és nem állítottam runtime PASS-t.

| Terület | Meglévő bizonyíték a repositoryban | Előzetes döntés | Nyitott határ / következő ellenőrzés |
|---|---|---|---|
| Visual Editor v2 — EDT | `public/editor-v2/core/schema.js`, `commands.js`, `state.js`, `validation.js`, `responsive.js`, `property-registry.js`, `app.js`, `tests/core.test.js` | **REUSE + ADAPT** | A Page Model, command/history/transaction, Inspector registry, responsive override és schedule block alapja már létezik. Ne építsünk második Editort. A public renderer paritása, minden node-típus renderelése és a szerveroldali mentési validáció külön ellenőrzendő. |
| Oldalak, mentés és revision — WEB | `src/routes/admin/pages.ts`, `src/routes/admin/editor.ts`, `src/routes/public/pages.ts`, `src/core/page-model.ts` | **REUSE + ADAPT** | Van canonical Page Model normalizálás, D1 page CRUD, revision history, published snapshot, preview authorization és rollback. Az Editor save route alap Page Model alakot ellenőriz; a teljes hierarchia-/schema-validáció csak a publish akción fut, és az expectedVersion mezőt opcionálisként kezeli. Az admin page-create útvonal is engedi az isPublished=true értéket anélkül, hogy a teljes validatePublishDocument ellenőrzést meghívná. A szerveroldali validáció minden mentési/publikálási útvonalon és a revision-konfliktus kötelező kikényszerítése külön kapu. |
| Publikus renderer — WEB/DYN/SEO | `public/visual-page.html`, `public/assets/page-renderer.js`, `src/routes/public/pages.ts`, `src/index.ts` | **ADAPT + BUILD hiányokra** | A renderer csak a node-típusok egy részét kezeli külön; több SANCI provider-blokk ikon/szöveg placeholder. A style() a node.style mezőt olvassa, nem oldja fel a node.responsive értékeket; a currentDevice jelenleg a láthatóságot befolyásolja. A public responsive override/paritás ezért nem bizonyított. A Property Registry csoportlistája tartalmaz animation/interaction/accessibility/SEO/data csoportokat, de a vizsgált properties tömbben ezekhez nincs property definíció, ezért a renderRegistryInspector kihagyja őket. A meglévő box/font/color/asset/shadow típusokhoz sincs külön vezérlő; a select mezőn kívül a generikus text inputot használja. A registryben szereplő csoport vagy típus nem igazolja a teljes, end-to-end szerkesztést és publikus renderelést. A script frissíti a `document.title` és látható cím/leírás értékét, de a vizsgált kódban nincs dinamikus canonical/Open Graph/X-card/structured-data kezelés. A `public/visual-page.html` statikus `robots=index,follow` metaelemet tartalmaz; a repository fa nem tartalmaz `sitemap.xml` vagy `robots.txt` fájlt, és a vizsgált Worker route-regiszterben nem látható ezek generálása. A `/p/:slug` útvonal közös shellt szolgál ki, a kliens rendereli a 404 állapotot; a valódi HTTP státuszt és a crawler viselkedését élő smoke teszttel kell ellenőrizni. |
| Adásrend — SCH | `src/routes/admin/schedule.ts`, `src/core/schedule-read.ts`, `src/routes/public/schedule.ts`, `migrations/0017_site_ownership_not_null.sql` | **REUSE + ADAPT** | A canonical `schedule_items` és site-scoped CRUD/public read létezik. Az admin route által kezelt mezők és validáció jelenleg szűkebbek, mint a végső terv: recurrence, teljes timezone/DST workflow, konfliktusfeloldás és Game Profile CRUD nem tekinthető igazoltnak pusztán a jelenlegi route alapján. |
| Twitch-integráció — INT | `src/routes/integrations/twitch.ts`, `src/core/twitch-oauth.ts`, `src/core/twitch-site-ownership.ts`, `migrations/0015`–`0017`, Twitch/site-ownership tesztek | **REUSE** | A Twitch OAuth, site binding, token-validation/revoke és audit meglévő alap. Az integrációs szerződésből induljunk ki; új provider csak külön adapterrel és igazolt capabilityvel bővíthető. A YouTube/TikTok környezeti változók megléte önmagában nem bizonyít kész adaptert. |
| Média/asset registry — RES | `Env.MEDIA` R2 binding; `media` D1 tábla; `src/core/domain/contracts.ts` MediaAsset és asset-reference normalizálók; `migrations/0017` site ownership | **ADAPT + BUILD hiányokra** | Van tárolási és típusbeli alap: a jelenlegi media rekordban object_key, original_name, mime_type, size_bytes, alt_text, created_at és site_id mezők láthatók. A vizsgált `src/index.ts` route-regiszterben nincs külön admin media API, a repository route-fájllistájában nincs dedikált media route. Licenc/source/usage-map/collection/variant/processing-state és törlés előtti függőségkezelés nincs bizonyítva; a teljes upload/processing/search/usage-map/delete-safe registry ezért hiányzó vagy ellenőrizendő képesség. A meglévő táblát és R2 bindingot kell bővíteni, nem párhuzamos asset rendszert létrehozni. |
| Domain-szerződések — RESOURCE/SCHEDULE/GAME_PROFILE/DESIGN_SYSTEM/SITE | `src/core/domain/contracts.ts`, `migrations/0002_editor_platform.sql` (`design_tokens`, `editor_components`, `editor_preferences`) | **REUSE + ADAPT** | MediaAsset, GameProfile, ScheduleEvent, ThemeTokens és SitePresentation típusok/normalizálók, továbbá token/component/preference táblák léteznek. Ezeket kell auditálni és továbbfejleszteni, mielőtt új párhuzamos schema születne; a típusdefiníció vagy tábla önmagában nem bizonyít teljes service/API-t. A `design_tokens` és `editor_components` sémája nem tartalmaz `site_id`-t, és a vizsgált route-regiszterben nincs hozzájuk dedikált API. |
| Multi-site schema uniqueness — PAGE/SCHEDULE/INT/DESIGN_SYSTEM | `migrations/0013`, `0017`, `0002_editor_platform.sql` | **REVIEW BEFORE MULTI-SITE** | A `pages.slug` globálisan UNIQUE, a schedule source-identity index nem tartalmaz `site_id`-t, a `twitch_connections.broadcaster_id` globálisan UNIQUE, a design_tokens név és editor_components pedig nincs site-scoped. Ezek lehetnek tudatos korlátozások, de multi-site/agency/SaaS előtt explicit döntés és negatív teszt kell; ne módosítsuk vakon a működő egy-site alapot. |
| Site settings — SITE/SETTINGS | `src/routes/admin/settings.ts`, `src/routes/public/site-settings.ts`, `migrations/0015` megjegyzése | **REUSE + ADAPT, migráció csak audit után** | A `site_settings` route a globális `key='site'` rekordot olvassa/írja, és a jelenlegi útvonal nem site-scoped. A migration kommentje ezt tudatosan legacy/global állapotként tartja fenn, amíg a fogyasztók nincsenek auditálva. Az `editor_preferences` user-scope táblaként létezik, de hozzá tartozó API/UI használatát a route-regiszter nem bizonyítja. Nem szabad vakon új site-scoped settings táblát vagy második settings rendszert bevezetni; előbb az összes read/write consumer feltárása szükséges. |
| Canonical Editor entrypoint és legacy UI | `src/index.ts` az `/admin/editor` útvonalat a `/editor-v2/index.html` fájlra irányítja; a régi `public/editor/` könyvtár még jelen van | **REUSE v2 + legacy besorolás** | A működő v2 marad az egyetlen kanonikus Editor. A régi fájlok elérhetőségét, hivatkozásait és eltávolítási/archiválási döntését külön kell bizonyítani; nem készülhet második Editor. |

**Route-regiszter megfigyelés:** a vizsgált `src/index.ts` jelenleg auth/bootstrap/session, Admin pages/editor/schedule/settings, Twitch connection/validation/disconnect és Twitch schedule sync, public pages/schedule/site-settings, health/db-health és a statikus Admin/public shell útvonalakat regisztrálja. A 22 főmodul többségéhez nem látható dedikált route-modul ebben a regiszterben. A jelenlegi tesztfájl-listában Editor core/schedule, Admin home, domain contracts, site ownership és Twitch/OAuth tesztek szerepelnek; külön public-renderer/SEO, média-upload/asset registry, community, commerce, notifications/help, automation, AI, developer API vagy extension acceptance suite nem látható. Ezt hiányzó/ellenőrizendő implementációs és tesztbizonyítékként kezeljük, nem úgy, mintha a tervezett funkciók már működnének.

**Migrációs séma leltár:** a jelenlegi migration fájlok a users/sessions, site_settings, pages/editor_revisions, social_accounts, schedule_items/schedule_sync_state, media, audit_log, editor_preferences/design_tokens/editor_components, system_page_content, Twitch connections/OAuth states és sites köré épülnek. Nem találtam külön kanonikus táblát a Content Studio tartalomrekordjaihoz, termékkatalógus/rendelés, fan identity/community posts, support/membership entitlement, analytics event/read model, automation workflow/run, notification delivery, help content, developer API key/outbound webhook, extension registry vagy SaaS billing plan területéhez. Ezeket tervezett/hiányzó vagy más módon még igazolandó képességként kell kezelni; nem szabad késznek jelölni őket pusztán a feature ID létezése miatt.

**Fontos korlát:** a táblázat csak a felsorolt fájlokban és route-regiszterben látható bizonyítékot rögzíti. Nem bizonyítja, hogy egy funkció élőben hibátlan, és nem zárja ki, hogy egy nem vizsgált fájlban van részleges implementáció. A mentési/renderer boundary-k és az asset/site-settings fogyasztók első mélyebb vizsgálatát a 63.23 rögzíti. A következő audit a fennmaradó modulok route/UI/schema/test leltára, majd a 396 ID-hoz tartozó REUSE/ADAPT/BUILD/REJECT/DEFER döntések bizonyítékokkal való feltöltése.

**Státusz: IN PROGRESS / NOT PASS.**

### 63.23. Core feature ID-kódleltár — REUSE / ADAPT / BUILD döntések, első szelet

Ez a táblázat a 63.22 forráskód-olvasási auditot köti a stabil funkcióazonosítókhoz. A döntés a jelenlegi repositoryban látható implementációs alapra vonatkozik, nem runtime PASS-ra. A „REUSE” azt jelenti, hogy a meglévő alapot meg kell őrizni; a „REUSE + ADAPT” meglévő, de nem teljes képességet jelent; a „BUILD/UNVERIFIED” azt jelenti, hogy a tervezett teljes funkcióhoz nem találtunk elég route/UI/test bizonyítékot.

| Funkció-ID csoport | Forrásbizonyíték | Döntés | Nyitott követelmény |
|---|---|---|---|
| EDT-001–006 | Editor v2 schema, command pipeline, transaction/history/state/selection és core tests | **REUSE** | A meglévő Page Model és command API marad az egyetlen Editor-alap; futási eredmény ebben a lépésben nincs. |
| EDT-007–015 | Canvas engine, drag/resize, layers/selection UI, element palette, app.js | **REUSE + ADAPT** | Alignment/snap/grid, összes drag/reparent/lock és mobil input teljes acceptance-e külön bizonyítandó. |
| EDT-016–020 | NODE_TYPES/element palette, rich text és schedule block/config/preview | **REUSE + ADAPT** | A teljes elemkatalógus és SANCI provider-blokkok publikus adatforrása/renderje nem teljes; több blokk placeholder. |
| EDT-021–026 | Property Registry, responsive.js, canvas-engine és Inspector | **REUSE + ADAPT** | A Registryben lévő group nem bizonyítja minden property UI/render/validation megvalósítását; public responsive paritás hiányzik. |
| EDT-027–033 | Save/reload/revision/conflict recovery, adminEditorRoute, page CRUD/revision routes és core tests | **REUSE + ADAPT** | Draft save full validation, minden publish belépési útvonal validációja és kötelező expectedVersion konfliktusvédelem szükséges. |
| EDT-034–044 | Public renderer, mobile CSS, rich-text, Editor preferences részleges alapok | **ADAPT + BUILD hiányokra** | Full renderer parity, accessibility/reduced motion, minden viewport és per-user preferences külön tesztelendő. |
| WEB-001, WEB-004–005, WEB-007–008 | admin pages/editor/public pages routes, editor_revisions, published snapshot, preview auth és rollback | **REUSE + ADAPT** | Revision lista létezik, de diff, teljes acceptance és HTTP soft-404/crawler viselkedés külön vizsgálandó. |
| WEB-002–003, WEB-006, WEB-009–032 | Page route/renderer részleges; statikus shell és néhány publikus route | **ADAPT + BUILD hiányokra** | Teljes nav tree, duplicate/archive/usage warning, publish validation report, redirects, route 404, SEO metadata/sitemap/robots, minden node render és safe embed nincs bizonyítva. |
| SCH-001 | admin schedule CRUD + site-scoped schedule_items | **REUSE + ADAPT** | Basic CRUD létezik; a teljes mezőmodell és státuszátmenetek acceptance-e nyitott. |
| SCH-007–008 | Twitch schedule sync route, sync adapter, sync state/error mapping és tesztfájl | **REUSE + ADAPT** | Éles provider/API smoke és konfliktus/manual override út teljes tesztje nincs ebben az auditban. |
| SCH-010–011 | public schedule read projection, Editor schedule binding/config/preview | **REUSE + ADAPT** | A public render és Editor preview parity, timezone/freshness/empty/error state acceptance-e nyitott. |
| SCH-002–006, SCH-009, SCH-012–015 | Néhány query/preview helper és schedule schema; teljes admin UI/domain route nem bizonyított | **ADAPT + BUILD hiányokra** | Recurrence, DST, conflict detection, Game Profile CRUD/relations, iCal/export és teljes naptár UI hiányzó/ellenőrizendő. |
| INT-003–010, INT-019–020 | Twitch OAuth/site ownership/token validation, scope/connection route és audit | **REUSE** | A Twitch-adapter alapot újra kell használni; teljes provider matrix, quota/diagnostics és éles ellenőrzés nyitott. |
| INT-011 | Twitch live/schedule kapcsolódó route/adapter és schedule sync | **REUSE + ADAPT** | A normalizált Live domain és publikus live-block teljes viselkedése nem bizonyított. |
| INT-001–002, INT-012–018, INT-021 | Adapter contract részben; route registryben csak Twitch integráció látható | **ADAPT + BUILD hiányokra** | YouTube/TikTok/Discord/Kick, Twitch VOD/clip, provider webhook és későbbi payment/email adapterek külön capability-gated implementációt igényelnek. |
| RES-001–002 | MEDIA R2 binding, media D1 table, MediaAsset type/normalizer és site ownership migration | **REUSE + ADAPT** | Tárolási alap megvan; nincs bizonyított teljes registry/API/upload pipeline. |
| RES-003–016 | Nem találtunk dedikált media route-ot vagy külön asset-registry acceptance suite-ot | **BUILD/UNVERIFIED** | Upload/processing/variants/search/usage map/licence/alt text/SVG safety/authorized download/delete/restore flow szükséges. |
| DSN-001–018 | ThemeTokens/SitePresentation típusok/normalizálók a domain contracts fájlban | **REUSE + ADAPT** | Token editor, theme/template/component registry, instance/override, version/rollback route és UI nincs bizonyítva. |
| SET-001–004 | Admin/public settings route és site_settings tábla; csak siteName/tagline, globális key=site | **REUSE + ADAPT** | Site-scoped settings és custom-domain/DNS/SSL lifecycle előtt minden consumer és migrációs út auditálandó. |
| DYN-001–008 | Editor schedule data binding és schedule read query létezik; általános binding registry nem bizonyított | **ADAPT + BUILD hiányokra** | Whitelistelt source registry, type validation, permission/published-only boundary, state machine, cache/freshness és diagnostics szükséges. |
| SEO-001–005 | Statikus robots meta és kliensoldali document.title/visible title-description update | **BUILD/UNVERIFIED** | Canonical, OG/X cards, structured data, redirects, sitemap/robots, preview/diagnostics és crawler/HTTP acceptance hiányzó. |

**Határ:** a fenti döntések kizárólag az első, core kódszeletet fedik le. Nem osztanak ki kitalált státuszt a többi ID-hoz. Az akkori következő lépést a 63.25 és a 63.26–63.37 fejezetek azóta részletesen feldolgozták; az aktuális következő lépést kizárólag a legutolsó 63.x fejezet rögzíti.

### 63.24. Legacy Editor → canonical Editor v2 képességmegőrzési audit

A régi `public/editor/` modulok külön UX- és javítási kísérleteket tartalmaznak, de eltérő globális API-t/adatmodellt használnak. A `public/editor-v2/index.html` a v2 saját `app.js`/core/UI moduljait tölti be; a legacy scriptek nem részei a canonical v2 runtime-nak. Ezért a működő képességet kell megőrizni, nem a régi scriptet vakon bemásolni.

| Legacy forrás / képesség | V2-ben látható megfelelő | Döntés | Nyitott acceptance |
|---|---|---|---|
| `public/editor/hierarchy.js`: rétegfa, nest/unnest, parent/child szabály | `commands.js` hierarchy.group/ungroup/reparent; v2 layer tree | **REUSE v2** | Container-szabály, locked node, cycle prevention, keyboard/touch reparent E2E. |
| `public/editor/layer-order.js`: rétegsorrend előre/hátra/top/bottom | V2 `resolveLayerDrop` + drag/drop a layer tree-ben, hierarchy.reorder | **REUSE v2; UX gap ellenőrzés** | Drag-drop sorrend, mobile pointer és billentyűzetes alternatíva; ha a gyorsművelet hiányzik, v2 parancsra épülő UI-t adjunk hozzá. |
| `public/editor/multi-select.js`: Ctrl/Cmd többes kijelölés | V2 selection.ids/primaryId és mobil multi-select bar | **REUSE v2** | Kijelölés, csoportosítás, fókusz és Escape minden pointer/touch/keyboard útvonalon. |
| `public/editor/lock.js`: lock/unlock toolbar action | V2 Inspector lock checkbox + `element.lock.set` command; külön layer visibility toggle nem látható | **REUSE v2 + ADAPT** | Locked node nem mozgatható/szerkeszthető/reparentelhető; root/group edge case és hide/show layer state külön acceptance. |
| `EDT-038` / legacy multi-select: clipboard/copy/paste/duplicate | V2 selection state és `element.duplicate` command létezik; a vizsgált app.js/commands.js nem mutat copy/paste clipboard UI/handler útvonalat | **REUSE duplicate + ADAPT / BUILD** | Multi-select és duplicate külön acceptance; clipboard paste-nél ID remap, nested children, assets, permission, undo/redo és cross-page scope tesztelendő. |
| `public/editor/group-properties.js`: több elem közös property/layout szerkesztése | V2 többes kijelölés létezik, de `renderInspector()` jelenleg a kiválasztott `nodes[0]` elemre épül | **ADAPT / BUILD** | Valódi multi-property Inspector hiányzik; legacy UX követelményét meg kell őrizni, v2 `executeBatch`/canonical commands használatával. |
| `public/editor/margin-properties.js`, `minmax-properties.js`: margin és min/max width/height | V2 responsive X/Y/width/height/position controls léteznek; a Property Registry deklarál margin/padding box mezőket, de a generikus Inspector nem ad hozzájuk strukturált négyoldalas vezérlőt, a minWidth/minHeight controls pedig nem találhatók | **ADAPT / BUILD** | Margin/padding és min/max constraint property schema, validation, responsive inheritance, public renderer parity és reset/inherit teszt. |
| `public/editor/page-rename.js`: oldalnév átnevezése a PATCH title útvonalon | V2 `editPageMeta()` már szerkeszti a title/slug mezőt és expectedVersionnel hívja a PATCH route-ot | **REUSE v2 + ADAPT** | A funkció nem hiányzik; a legacy külön rename gombja nem szükséges automatikusan. Ellenőrizendő az unsaved-change guard, slug/SEO/redirect hatás, szerveroldali title/slug validation és konfliktuskezelés. |
| `public/editor/selection-routing.js`: DOM event monkey patch a parent selection megakadályozására | V2 saját node pointer handlers és layer selection routing | **REJECT legacy patch / VERIFY v2** | A globális `Element.prototype.addEventListener` felülírást nem szabad átvenni; nested selection regressziós teszt kell. |
| `public/editor/selection-clear-fix.js`: capture-phase blank-area clear | V2 state/selection/keyboard handlers | **REUSE v2 / VERIFY** | Canvas blank-area click, Escape, Inspector/panel click és touch esetek külön tesztelendők; globális capture hack nem portolható automatikusan. |
| `public/editor/inspector-atomic.js`: atomic Apply, legacy content/layout/style mezőkkel | V2 canonical command engine, validation és `executeBatch` atomic transaction | **REUSE v2 architecture / ADAPT UX** | Ha a felhasználói folyamat explicit Apply-t kíván, v2-ben batch/transaction alapú legyen; régi direct mutation/schema nem használható. |
| `public/editor/editor-stabilizer.js`: régi `s.doc`, `groupId`, window globals, direct mutation/history override | V2 izolált state, Page Model, command engine, revision/persistence | **REJECT direct port / extract requirements only** | Csak konkrét reprodukálható hiba és teszt alapján emeljünk át viselkedést; a legacy state/history nem keverhető a v2 Page Modellel. |

**Kötelező szabály:** a régi script eltávolítása/archiválása csak akkor zárható le, ha a képesség a v2-ben vagy bizonyítottan felesleges explicit döntéssel. Az eltérő adatmodellek, globális event patch-ek és direct mutation miatt a legacy kód nem automatikusan újrahasználható; a működő UX-t és edge case-eket viszont nem szabad bizonyíték nélkül eldobni.

**Státusz: IN PROGRESS / NOT PASS.** A táblázat első összehasonlítás; a v2-ben lévő képességeket interakciós és E2E teszttel kell igazolni, a hiányzó funkciókat a 396 ID feature contractjaiban kell rögzíteni. Az itt kijelölt következő lépések történeti auditjegyzetek; az aktuális következő pontot a legutolsó 63.x fejezet tartalmazza.

### 63.25. Nem-Editor termékmodulok — route/UI/schema/test bizonyíték és megvalósítási határ

**Auditmódszer:** a `v2/foundation` branch aktuális fájlfája alapján áttekintve a `src/routes/`, `src/core/`, `migrations/`, `tests/` és `public/` modulhatárait. Ez forráskód-leltár, nem éles runtime-bizonyíték. Egy domain type, feature ID vagy menüpont önmagában nem jelenti azt, hogy az adott képesség működő UI-val és API-val rendelkezik.

| Funkcióterület / ID-csoport | Jelenlegi bizonyíték | Döntés | Kötelező következő lépés |
|---|---|---|---|
| **IDENTITY / SEC / TEAM** — ADM-007, SEC-001–012, TEAM-001–007 | Auth route-ok: bootstrap/login/logout/session; require-auth/session/password helper és site-context/ownership alap. Külön MFA/SSO, workspace switcher, invite/roles/approval/team billing route és dedicated acceptance suite nem látható a vizsgált fájlfában. | **REUSE alap + ADAPT/BUILD hiányokra** | A működő session/site ownership maradjon canonical; külön capability-ként tervezzük az MFA/SSO, granular RBAC, invitation, workspace selector és tenant isolation negatív teszteket. A tenant isolation szerveroldali invariant, nem csak menüszűrés. |
| **OPS / QA** — OPS-001–011, QA-001–010 | Health/db-health route és domain/editor/Twitch/site-ownership tesztfájlok léteznek. Külön structured logging/correlation, alerting, backup/export/restore, recovery drill, performance budget és teljes browser E2E suite nem bizonyított a fájlfában. | **REUSE + ADAPT / BUILD** | A meglévő health/deploy és tesztparancsokat megtartani; minden további üzemeltetési funkcióhoz implementáció, runbook, teszt és evidence link szükséges. QA-007 csak az OPS-005/006 tényleges működését ellenőrzi, nem helyettesíti. |
| **CONTENT STUDIO** — CNT-001–022, WEB-017 | A jelenlegi route-regiszterben nincs Content Studio/VOD/clip CRUD route; nincs külön content-domain táblacsoport vagy content acceptance suite a vizsgált migráció-/tesztfában. | **BUILD/UNVERIFIED; adaptereknél REUSE** | CNT canonical content schema/service/API, külső ID/dedupe, content asset references, editorial lifecycle, publish queue/retry, rights/takedown és public feed projection. Twitch adaptert csak a támogatott metadata-hoz használjuk; content records nem kerülhetnek a Media Asset registrybe. |
| **COMMUNITY / FAN IDENTITY** — COM-001–020 | Nincs dedikált community/member/profile/post/poll/moderation route, domain schema vagy acceptance suite a vizsgált fájlfában. Twitch OAuth nem helyettesíti a fan account identitást. | **BUILD/UNVERIFIED** | Külön community és fan identity domain, consent/privacy lifecycle, moderation/abuse limits, visibility/entitlement contract. SUP-006 entitlementet fogyasztani kell; nem szabad COM-ban párhuzamos tagsági jogosultságot tárolni. |
| **STORE / SUPPORT / BILLING** — STO-001–021, SUP-001–012, TEAM-006 | Nem látható product/order/payment/membership/billing schema vagy route és commerce acceptance suite. | **BUILD/UNVERIFIED; provider döntési kapu kötelező** | A termékkatalógus, rendelés, checkout/payment, entitlement, fulfillment, refund, tax/VAT/invoice és consumer-rights külön életciklus. Fizetési adatot ne kezeljünk saját, nem auditált tárolóban; előbb merchant-of-record/provider és jogi megfelelőségi döntés. |
| **ANALYTICS / CAMPAIGNS** — ANL-001–010, CAM-001–009 | Nem látható canonical analytics event/read model, campaign/deal/deliverable schema/API vagy külön tesztcsomag. ADM-005 audit összefoglaló nem analytics, audit events maradnak SEC/AUDIT domainben. | **BUILD/UNVERIFIED** | Event taxonomy, privacy/consent/retention, bot filtering, source/freshness/unit és export; kampány/UTM/deal/deliverable pedig külön domain. AUT trigger routing ne legyen összekeverve az ANL mérési eseményekkel. |
| **AUTOMATION / SANCI AI** — AUT-001–014, AI-001–021 | Nincs workflow/run engine, AI provider registry, prompt/version/evaluation, approval queue vagy ezekhez tartozó API/test suite a vizsgált route-/schema-fában. | **BUILD/UNVERIFIED** | Későbbi, elkülönített domain. Automation csak engedélyezett domain actionöket hajthat végre idempotenciával/permissionnel; AI csak canonical API/command útvonalon, diff/preview/approval/audit/rollback mellett. Ne írjon közvetlenül domain táblákba. |
| **DEVELOPER / EXTENSIONS / MARKETPLACE** — DEV-001–006, MKT-001–005 | Nem látható public API/version registry, API key, webhook registry, sandbox, extension manifest/install lifecycle vagy marketplace schema/route. | **BUILD/UNVERIFIED** | Külön developer API és extension trust boundary, scoped keys, quota, signature/replay defense, permission manifest, version/migration/license/review. Marketplace/payment csak a STO/SUP provider és jogi kapu után. |
| **SEARCH / NOTIFICATIONS / HELP** — SEARCH-001–005, NTF-001–005, HELP-001–004, ADM-006/011/012 | A menütérkép meghatározza a belépési pontokat, de a route-/schema-/test-fában nincs külön global search/index, notification delivery/preference vagy help content/progress modul. | **BUILD/UNVERIFIED; ADM shell belépési pont REUSE** | A kereső canonical domain projectionöket olvasson permission- és site-scope ellenőrzéssel; értesítés domain eventből jöjjön idempotensen; help verziózott feature ID-ra hivatkozzon. ADM csak navigál, nem lesz ezek adatgazdája. |
| **LOCALIZATION / DOMAINS / SETTINGS** — LOC-001–006, SET-001–004 | Van globális legacy site_settings és public-safe settings projection; külön locale catalog/translation workflow, hreflang lifecycle és custom-domain verification/DNS/SSL state machine nem bizonyított. | **REUSE settings alap + ADAPT/BUILD** | A meglévő settings fogyasztóit fel kell térképezni, mielőtt site-scoped migráció készül. Localization és domain lifecycle külön domain/API; a canonical URL/SEO kimenethez explicit kapcsolat szükséges. |
| **DESIGN SYSTEM / MEDIA** — DSN-001–018, RES-001–016 | Domain type-ok, R2 binding, media metadata, design_tokens/editor_components táblák léteznek; teljes asset API/pipeline, token editor, template/component registry API és verziózás nincs bizonyítva. | **REUSE + ADAPT / BUILD hiányokra** | A meglévő D1/R2/típusokat bővíteni; site scoping, usage map, safe processing, variants, token/component versioning és rollback kapukat implementálni. Ne hozzunk létre második media/design adatgazdát. |
| **OBS / STREAM STUDIO / LIVE** — OBS-001–010, LIV-001–010 | Twitch kapcsolat és schedule-sync alap látható; OBS pairing/scene control, normalized live service, unified chat, multistream, alert engine, chatbot/loyalty és overlay registry nem bizonyított. | **REUSE Twitch integration; BUILD/UNVERIFIED további modulok** | A Live/Stream Studio legyen saját domain; provider capability matrix és permission scopes határozza meg, mi érhető el. OBS command csak explicit paired/authorized eszközön keresztül, dry-run/test/replay és audit mellett. |
| **PUBLIC WEB / SEO / DYNAMIC DATA** — WEB-001–032, SEO-001–005, DYN-001–008 | Public page/schedule/system-page routes és kliensoldali renderer létezik; több node/provider blokk placeholder, a responsive/property parity nem bizonyított. Dedicated sitemap/robots/OG/canonical/structured-data route és general binding registry nem látható a vizsgált fájlfában. | **REUSE + ADAPT / BUILD hiányokra** | Public renderer marad megjelenítési réteg; canonical domain projectiont fogyaszt. Minden public route-hoz HTTP státusz/404, published-only, SEO metadata, safe embed, cache/freshness és mobil/accessibility acceptance kell. |

**Következtetés:** a repository jelenlegi technikai alapja valós, de főként auth/site ownership, Editor/Page Model, schedule/Twitch és settings köré koncentrálódik. A táblázatban felsorolt további Creator OS domainek célzott, önálló modulok; jelen állapotban nem jelölhetők késznek. Ez nem ok a terv szűkítésére: a helyes megoldás a modulonkénti implementációs szerződés és fázis, nem az összes funkció Editorba vagy egyetlen admin route-ba zsúfolása.

**Státusz: IN PROGRESS / NOT PASS.** A leltár a fájlfán és route-regiszteren alapul. A hiányzó képességek végleges BUILD döntéséhez szükséges a teljes route consumer/search, schema/migration és runtime acceptance kör; az „UNVERIFIED” státusz addig nem alakítható PASS-szá. Az itt kijelölt következő lépések történeti auditjegyzetek; az aktuális következő pontot a legutolsó 63.x fejezet tartalmazza.

### 63.26. EDT-001–044 — funkciónkénti bizonyítékmátrix, első teljes modul-szelet

A 63.23 összesített ID-csoportjait ez a mátrix az EDT minden egyes stabil ID-jára bontja. A „részleges alap” a forráskód/tests fájlokban látható alapot jelenti, nem a teljes acceptance PASS-t. Az egyes fázis/prioritás végleges kiosztása a kanonikus 41.2/63.5 roadmap-keresztezés után zárható; ahol a repository-bizonyíték nem elég, az állapot **UNVERIFIED / OPEN**, nem kitalált státusz.

| ID | Kanonikus owner / forrás | Bizonyíték alapján látható állapot | Nyitott acceptance / függőség |
|---|---|---|---|
| EDT-001 | EDITOR / `core/schema.js`, Page Model | Részleges alap | Verziómigráció, backward compatibility és invalid schema reject E2E. |
| EDT-002 | EDITOR / schema + validation | Részleges alap; core tesztek parent/child invariants-t fednek | Duplicate ID, orphan node, cycle, root és nested container negatív mátrix. |
| EDT-003 | EDITOR / `commands.js` | Részleges alap; mutációs parancsok központosítottak | Minden UI mutation csak commandon át; nincs direct state mutation. |
| EDT-004 | EDITOR / `executeBatch`, transaction API | Részleges alap; atomic/non-atomic tesztek léteznek | Minden összetett UI műveletnél explicit atomic policy és failure recovery. |
| EDT-005 | EDITOR / history undo/redo | Részleges alap; snapshot round-trip teszt van | History limit, nagy dokumentum, selection és failed transaction edge case. |
| EDT-006 | EDITOR / state selection | Részleges alap; history selection restore teszt van | Canvas/layer/Inspector/multi-select fókuszszinkron minden inputmóddal. |
| EDT-007 | EDITOR / canvas engine, pan/extent | Részleges alap | Zoom/pan/fit/resize és viewport state browser/mobile acceptance. |
| EDT-008 | EDITOR / canvas pointer handlers | Részleges UI-alap | Drag/drop, pointer cancel, touch, locked node, nested target és save round-trip E2E. |
| EDT-009 | EDITOR / geometry/resize | Részleges UI-alap | Min/max constraints, aspect ratio, keyboard resize és responsive overrides. |
| EDT-010 | EDITOR / canvas geometry | Nincs teljes snap/grid acceptance bizonyíték | Alignment guides, snap thresholds, grid toggle és keyboard alternative. |
| EDT-011 | EDITOR / commands reorder/reparent/duplicate/delete | Core command/test alap létezik | UI-műveletek, törlés megerősítése/undo, cross-parent rules és subtree edge case. |
| EDT-012 | EDITOR / layer tree | Részleges UI-alap | Expand/collapse persistence, empty container és deep hierarchy. |
| EDT-013 | EDITOR / selection state + canvas/layers | Részleges UI-alap | Canvas↔layer↔Inspector sync, stale selection és deleted node recovery. |
| EDT-014 | EDITOR / lock command + Inspector | Lock command/checkbox alap; hide/show külön nem bizonyított | Layer rename, visibility state, lock behavior, keyboard/touch és renderer visibility parity. |
| EDT-015 | EDITOR / node palette | Részleges elemkatalógus | Keresés/kategória/favorite, unsupported capability label és minden NODE_TYPE coverage. |
| EDT-016 | EDITOR / container/section/row/grid node types | Schema/render alap részleges | Layout semantics, nested constraints, gap/columns, breakpoint change és public parity. |
| EDT-017 | EDITOR / text/heading/button/icon/divider/spacer | Részleges node/render alap | Minden node saját Inspector control, link safety, icon registry és accessible semantics. |
| EDT-018 | EDITOR + RESOURCE / image/video/embed/list/card/badge | Részleges/vegyes | Media picker, authorized asset reference, safe embed, video fallback, alt text és renderer parity. |
| EDT-019 | EDITOR / table/accordion/tabs/form | Teljes implementáció nem bizonyított | Minden komponens interakciós schema, keyboard/ARIA, validation, safe form submission és acceptance. |
| EDT-020 | EDITOR → owning domain blocks | Schedule block alap létezik; több SANCI provider blokk placeholder | Blockonként canonical source, owner/API, loading/empty/error/stale, permission és preview/public parity. |
| EDT-021 | EDITOR / Property Registry | Registry és property csoportok léteznek | Minden tervezett property tényleges definíciója, owner node, type, responsive flag és command. |
| EDT-022 | EDITOR / Inspector controls + validation | Általános input és select alap | Type-specific controls (box/font/color/asset/shadow), min/max, schema validation és invalid input UX. |
| EDT-023 | EDITOR / responsive resolver | Core inheritance/resolve tesztek léteznek | Az Inspector ténylegesen resolved értéket mutat-e minden property-nél; source/inherited jelzés. |
| EDT-024 | EDITOR / responsive helpers | Override/inherit/reset helper tesztelt | Minden property és viewport UI-ja reset/inherit állapotot mentés után is megőriz. |
| EDT-025 | EDITOR / responsive preview | Desktop/tablet/mobile UI-alap létezik | Breakpoint switch, viewport dimensions, zoom és visual regression. |
| EDT-026 | EDITOR / responsive visibility/layout | Visibility state részleges | Order/columns/visibility override minden breakpointon, publikus rendererrel egyezően. |
| EDT-027 | EDITOR / save dirty state | Save/dirty state kód és tesztlétezés | Explicit draft save, beforeunload guard és mentés közbeni további edit. |
| EDT-028 | EDITOR + PAGE API / save/reload | Revision alap és round-trip ellenőrzések részlegesek | Teljes node/property/data binding round-trip D1 → reload → render. |
| EDT-029 | EDITOR + REVISION / expectedVersion | 409 conflict handling és draft export/reload teszt van | expectedVersion szerveroldali kötelezővé tétele minden mutation/save útvonalon. |
| EDT-030 | EDITOR / in-flight save snapshot | Save kód a beküldött snapshotot külön kezeli | Race test: módosítás save közben, válasz sorrendcsere és dirty-state helyesség. |
| EDT-031 | EDITOR / network recovery | Conflict export és explicit reload alap van | Timeout/offline/retry és local draft retention; nincs silent data loss. |
| EDT-032 | EDITOR/PREVIEW / preview authorization | Preview route alap létezik | Draft preview link expiry, unauthorized, noindex, current revision és public shell parity. |
| EDT-033 | EDITOR/PUBLISH / publish flow | Publish action/validation alap létezik | Minden publish entrypoint ugyanazt a server-side validationt futtassa; save ≠ publish. |
| EDT-034 | PUBLIC_RENDERER / `page-renderer.js` | Paritás nem bizonyított; responsive override hiányos | Node-by-node Editor preview/public render parity, SEO/asset/safe embed/accessibility. |
| EDT-035 | EDITOR mobile shell | Mobil CSS és action-bar alap vizsgálandó | Safe-area, viewport keyboard, scroll/zoom és small-screen interaction E2E. |
| EDT-036 | EDITOR mobile panels | Mobil panel CSS/UI részleges | Layers/Inspector váltás, back/escape, focus restore és viewport state. |
| EDT-037 | EDITOR accessibility | Teljes keyboard canvas alternatíva nem bizonyított | Minden canvas művelet keyboard elérhető, focus order és screen-reader announcements. |
| EDT-038 | EDITOR / multi-select + duplicate | Multi-select/duplicate alap létezik; clipboard UI nem bizonyított | Copy/paste, ID remap, multi-selection batch, cross-page rules és undo/redo. |
| EDT-039 | EDITOR / page interaction schema | Property group létezik, teljes interaction property/runtime nem bizonyított | Whitelistelt action schema, URL/form safety, runtime policy; nem AUT action registry. |
| EDT-040 | EDITOR / motion | Reduced-motion csoport említve, property/runtime nem bizonyított | `prefers-reduced-motion`, motion disable policy, keyboard/vestibular-safe defaults. |
| EDT-041 | EDITOR / onboarding/templates | Template-start/onboarding teljes UI nem bizonyított | Empty state, template apply, no destructive overwrite, undo/rollback és sample content cleanup. |
| EDT-042 | EDITOR / error recovery | Conflict recovery alap van | Minden failure state, retry/reload/export, malformed Page Model és recovery telemetry. |
| EDT-043 | EDITOR / Rich Text | Structured Rich Text schema/command/tests léteznek | A funkciótervben plain-text baseline utáni gate; full editor toolbar, paste sanitization, accessibility és renderer parity. |
| EDT-044 | EDITOR / `editor_preferences` table | User-scope schema létezik, route/UI usage nem bizonyított | Per-user preferences API, permission, defaults, migration és Page Modeltől való elkülönítés. |

**EDT-függőségi gerinc (tervezett gate, nem kész státusz):** EDT-001/002 → EDT-003/004/005/006 → EDT-007–020 → EDT-021/022 → EDT-023–026 → EDT-027–033 → EDT-034; az EDT-035–044 hozzáférhetőség, mobil, rich text, interakció és személyes beállítás acceptance-e a kapcsolódó alapok után zárható. Ez a függőségi sorrend nem engedélyez implementációt a teljes terv lezárása előtt.

**Státusz: IN PROGRESS / NOT PASS.** Ez az első teljes, egyedi-ID-s modul-szelet; a fenti nyitott acceptance pontok nem jelentenek automatikus BUILD döntést. A WEB-001–032 mátrixot a 63.27 azóta rögzíti; az aktuális következő pontot a legutolsó 63.x fejezet tartalmazza.

### 63.27. WEB-001–032 — oldalak, publikálás és publikus felület, egyedi-ID-s bizonyítékmátrix

A mátrix a `src/routes/admin/pages.ts`, `src/routes/admin/editor.ts`, `src/routes/public/pages.ts`, `src/core/page-model.ts`, `src/core/editor-validation.ts`, `public/assets/page-renderer.js` és `public/visual-page.html` aktuális forrásolvasására épül. Nem helyettesíti a HTTP/browser smoke tesztet. Ahol a repositoryban nincs bizonyíték, az állapot nyitott marad.

| ID | Owner / forrás | Látható alap | Nyitott acceptance / függőség |
|---|---|---|---|
| WEB-001 | PAGE / admin pages CRUD | Site-scoped list/create/update route; slug/title/description validáció | Keresés/szűrés/pagináció, bulk actions, delete/archive és teljes lifecycle nem bizonyított; create útvonal publikált állapotot is elfogad. |
| WEB-002 | PAGE / slug + schema | Slug validáció és egyediség constraint létezik | Slug change → canonical URL, old link/redirect, internal links, SEO metadata és site-scoped uniqueness viselkedés tesztelendő. |
| WEB-003 | PAGE / page lifecycle | Duplicate/archive/delete/usage-map API nem látható a vizsgált admin route-ban | Reference/usage map, soft-delete/restore és safe delete; másik page/asset/form hivatkozásánál ne legyen árva rekord. |
| WEB-004 | PAGE/REVISION / D1 published snapshot | Draft content, published_content_json, is_published és published_revision_id létezik | Minden write útvonalon draft/published invariants; create-time publish bypass megszüntetése vagy explicit validált policy. |
| WEB-005 | PAGE/PREVIEW / public pages route | Preview query editor auth/role checkkel draftot olvas | Preview token/link expiry, page scope, noindex, unauthorized/cross-site és revision binding E2E. |
| WEB-006 | PAGE/PUBLISH / editor-validation | Publish document validator létezik és Editor publish útvonal hívja | A teljes validációt minden publish belépési pontnak hívnia kell, beleértve pages create; validációs riport mezőnként és UI-szinten hiányzó. |
| WEB-007 | PAGE/PUBLISH / editor route | Publish/unpublish/rollback műveletek és audit események léteznek | Állapotátmenetek, rollback published snapshotra, invalid transition, expectedVersion és idempotens ismétlés tesztelendő. |
| WEB-008 | REVISION / editor route | Legutóbbi 30 revision metadata listázása és restore-to-new-revision létezik | Revision diff/compare UI, megjegyzés/actor/time, régi verzió safe preview és concurrency E2E. |
| WEB-009 | NAVIGATION | Külön canonical navigation CRUD/schema route nem látható | Hierarchikus nav model, page reference validation, ordering, active state és publish atomikusság. |
| WEB-010 | SITE/PAGE / header-footer/global layout | A public shellben statikus header/footer és menu placeholder található | Canonical layout/schema, Brand Kit linkage, page-level override és minden route-on konzisztens render. |
| WEB-011 | NAVIGATION / accessibility | Statikus mobile menu markup és aria-label/expanded attribútum alap | Keyboard/focus/Escape, menu state, touch, reduced motion és real device/browser teszt. |
| WEB-012 | ROUTING / Worker | `/p/:slug` shell és public page API létezik | Nem létezik bizonyított teljes route registry/404/redirect matrix; invalid/unpublished slug tényleges HTTP státusza és crawler viselkedése smoke tesztet igényel. |
| WEB-013 | REDIRECT | Redirect manager/schema/route nem látható | 301/302/410 policy, loop detection, chain report, slug migration és canonical host. |
| WEB-014 | PUBLIC HOME | Statikus shell és dynamic page shell létezik | Canonical Home route/page identity, published-only output, SEO/OG, nav/footer és mobile E2E. |
| WEB-015 | PUBLIC LIVE | Live-state API/normalized live service nem bizonyított; Twitch connection önmagában nem elég | Offline/live/stale, player fallback, stream metadata, permission and provider failure. |
| WEB-016 | PUBLIC SCHEDULE / SCH-010 | Public schedule read projection és schedule renderer létezik | Timezone/DST, cache/freshness, empty/error state, canonical schedule equality és Editor preview parity. |
| WEB-017 | PUBLIC CONTENT HUB / CNT-020 | Content-domain feed/schema nincs bizonyítva | Csak canonical published-content projectionből rendereljen; page route/shell nem válhat content CRUD adatgazdává. |
| WEB-018 | PUBLIC PROFILE | About/profile page CRUD or dedicated schema not proven | Canonical profile fields, public-safe settings, metadata/localization and publish lifecycle. |
| WEB-019 | PUBLIC COMMUNITY / COM | Community domain/schema nincs bizonyítva | Member-only visibility, consent, moderation and entitlement contract. |
| WEB-020 | FORM SUBMISSION | Form schema/submission API/storage/moderation route nem látható | Server-side validation, consent, spam/rate limit, notification integration, retention/export/delete and private-data boundary. |
| WEB-021 | PUBLIC RESOURCES | Resource content/domain not proven | Canonical resource item type, visibility, download permission, asset references and SEO. |
| WEB-022 | LINK HUB | Canonical link-hub model/editor not proven | Shared links registry or page content decision; analytics/redirect policy and link validation. |
| WEB-023 | SUPPORT | Support domain/provider state not proven | External support link vs canonical SUP domain, truthful state, safe external navigation and member entitlement. |
| WEB-024 | SPONSOR/PRESS KIT | CAM/SPONSORSHIP model and export route not proven | Public/private field separation, generated export, asset usage and expiry/version. |
| WEB-025 | STORE/PRODUCT PAGES | Store product/order domain not proven | STO owns product projection; safe pricing/currency/availability and no mock checkout presented as live. |
| WEB-026 | MEMBERSHIP AREA | Fan identity/entitlement/member route not proven | Server-side entitlement checks on every private read, session lifecycle and unauthorized fallback. |
| WEB-027 | EVENTS/BLOG/NEWS/DIGITAL PRODUCTS | Separate event/content/product domain routes not proven | Each route consumes its owning domain projection; do not create one catch-all “page content” table. |
| WEB-028 | PUBLIC ERROR/MAINTENANCE/OFFLINE | Renderer has client-side catch/404 presentation | Real HTTP status, static fallback, outage handling, stale content and no secret/error leakage. |
| WEB-029 | SEARCH | Public search index/query API not proven | Published-only index, permission/consent filter, freshness/invalidation and safe snippets. |
| WEB-030 | CACHE/INVALIDATION | Some requests use no-store; canonical invalidation service not proven | Explicit cache policy for public page/feed/assets, publish/unpublish/rollback invalidation and stale fallback. |
| WEB-031 | PUBLISHED-ONLY BOUNDARY | Public page API filters `is_published=1`; preview is separately authenticated | All public content/feed/asset/form/member routes require explicit published/visibility gate and cross-site negative tests. |
| WEB-032 | RENDER SECURITY / SAFE EMBEDS | Renderer escapes text and applies `safeUrl` to link/image/schedule URLs | Node-by-node sanitization, allowed embed provider/origin, unsafe schemes/HTML, CSP and malformed nested content tests. |

**WEB kritikus kapu:** a public renderer nem lehet a teljes Editor Page Model másolata és nem birtokolhat üzleti adatokat. A publikált Page Modelt és domain-projectionöket biztonságosan kell megjelenítenie. A jelenlegi kód bizonyít néhány fontos alapot (site-scoped page read, preview authorization, revision/publish/unpublish/rollback), de a teljes nav/redirect/SEO/Content/Community/Store/Form route lifecycle nem igazolt.

**Külön szerveroldali korrekciós követelmény, mielőtt WEB/PUBLISH PASS adható:** a vizsgált `admin/pages.ts` create útvonal az `isPublished=true` esetet elfogadja, miközben nem hívja a `validatePublishDocument`-et; az `admin/editor.ts` save/publish és rollback útvonalon az `expectedVersion` jelenleg opcionális. Ezeket nem szabad pusztán UI oldali guarddal lezárni. A változtatás előtt a meglévő teszteket és minden API consumer-t fel kell térképezni; utána valid/invalid create, publish, conflict és concurrent update negatív teszt kell.

**Státusz: IN PROGRESS / NOT PASS.** A SCH-001–015 egyedi-ID-s mátrixot a 63.28 azóta rögzíti; az aktuális következő pontot a legutolsó 63.x fejezet tartalmazza.

### 63.28. SCH-001–015 — schedule és Game Profile, egyedi-ID-s bizonyítékmátrix

A mátrix a `src/routes/admin/schedule.ts`, `src/core/schedule-read.ts`, `src/core/schedule/sync.ts`, `src/core/schedule/twitch-adapter.ts`, `src/routes/admin/twitch-schedule-sync.ts`, `src/routes/public/schedule.ts`, domain contracts és a kapcsolódó tesztek forrásolvasására épül.

| ID | Owner / forrás | Látható alap | Nyitott acceptance / függőség |
|---|---|---|---|
| SCH-001 | SCHEDULE / admin schedule route + `schedule_items` | Site-scoped GET/POST/PUT/DELETE és title/platform/start/end/status/url/notes validáció | UI mezőmodell, archived state, audit completeness, invalid transition, idempotency és safe delete/restore. |
| SCH-002 | SCHEDULE / calendar UI | Admin route listát ad, dedikált naptár/lista UI nem bizonyított | Month/week/list/upcoming/past, keresés/szűrés/sorrend/pagináció és mobile calendar. |
| SCH-003 | SCHEDULE / date contract | ISO timestamp és UTC-alapú összehasonlítás látható | Explicit IANA timezone, DST gaps/folds, creator timezone change, locale display és recurring events. |
| SCH-004 | SCHEDULE / recurrence | Sync domain a Twitch `is_recurring` adatot rögzíti; saját recurrence editor nincs bizonyítva | Canonical recurrence rule, occurrence exceptions, edit-one/edit-series, DST and cancellation semantics. |
| SCH-005 | SCHEDULE / status | scheduled/live/completed/cancelled státuszok vannak; néhány időbeli validáció létezik | Állapotátmenet-mátrix, postpone/cancel reasons, stale live state, past event and restore. |
| SCH-006 | SCHEDULE / conflict detection | Overlap/conflict service/UI nem látható | Same-channel overlap, timezone-normalized intervals, warning vs hard block and override audit. |
| SCH-007 | SCHEDULE + INT / Twitch sync | Twitch adapter, sync endpoint, source mapping és connection identity létezik | Éles API smoke, missing/deleted source handling, partial response, rate-limit, expired auth and retry. |
| SCH-008 | SCHEDULE / sync state | `schedule_sync_state` status/count/error/time mezőkkel és audit route error mappinggel létezik | Admin sync history/diagnostics/retry UI, last successful sync/freshness and alerting. |
| SCH-009 | SCHEDULE / public projection | Public read config támogat next/upcoming/all lekérdezést | Dashboard countdown/live state, timezone correctness, stale/empty/error state and invalidation. |
| SCH-010 | SCHEDULE / `readPublicSchedule` | Site-scoped public projection filters statuses, orders and limits | Published/public policy, stable sort for equal times, pagination/limits and freshness/cache contract. |
| SCH-011 | EDITOR → SCHEDULE projection | Editor schedule config, defaults, preview helper és tests léteznek | Configured preview és public render azonos query/config eredményt adjon; error/empty/stale states. |
| SCH-012 | GAME_PROFILE / domain contracts | `GameProfile` type/normalizer és domain test létezik | Canonical persistence table/service/API, CRUD UI, uniqueness/site scope and lifecycle nem bizonyított. |
| SCH-013 | GAME_PROFILE → RESOURCE | Domain contract támogat asset reference-t | Artwork asset picker/usage map, replacement/delete safety, fallback and public rendering. |
| SCH-014 | SCHEDULE → GAME_PROFILE | ScheduleEvent contract `gameProfileId` referenciát támogat; teszt bizonyítja, hogy nem másolja a game name-et | DB/API foreign-key/ownership validation, archived/deleted profile behavior, relationship UI and migration. |
| SCH-015 | SCHEDULE / export | iCal/export/notification route nem látható | Correct timezone/UID/DTSTAMP/updated/cancelled event behavior, privacy, cache and later notification contract. |

**Kritikus sync-konfliktus:** a jelenlegi `sync.ts` upsertje `ON CONFLICT(source,source_account_id,source_id)` esetén frissíti a címet, platformot, időpontot, státuszt, URL-t és megjegyzést. A vizsgált mezőmodellben nincs külön, bizonyított manual-override mező/policy. Emiatt a „Twitch sync + kézi felülbírálás” teljes viselkedését nem szabad késznek jelölni: explicit mező-/prioritás-szabály és teszt kell arra, hogy mely mezőket birtokolja a provider, melyeket a creator, és hogyan kezeljük a provider által törölt/eltűnt eseményt. A source identity index site scope-ja szintén külön multi-site gate a 63.23-ban.

**Státusz: IN PROGRESS / NOT PASS.** Az INT-001–021 egyedi-ID-s mátrixot a 63.29 azóta rögzíti; az aktuális következő pontot a legutolsó 63.x fejezet tartalmazza.

### 63.29. INT-001–021 — integrációs központ és provider adapterek, egyedi-ID-s bizonyítékmátrix

A mátrix a Twitch OAuth/crypto/site-ownership route-okat, Twitch schedule adaptert, `src/index.ts` route-regisztert és a Twitch/OAuth teszteket vizsgálja. A jelenlegi Twitch alap megőrzendő; a többi provider funkció nem tekinthető késznek pusztán konfigurációs kulcs vagy feature ID alapján.

| ID | Owner / forrás | Látható alap | Nyitott acceptance / függőség |
|---|---|---|---|
| INT-001 | INTEGRATION / provider adapter contract | Twitch-specific adapterek léteznek; általános provider contract teljes végrehajtása nem bizonyított | Közös connect/status/capability/error/retry interface úgy, hogy a provider-specifikus OAuth és adatmodell ne mosódjon össze. |
| INT-002 | INTEGRATION / overview | Twitch status/diagnostic endpoint létezik; általános integrations dashboard nem látható | Provider registry, connection health, stale/expired/permission state, action links and partial failure. |
| INT-003 | INTEGRATION / Twitch OAuth state | Hashelt, rövid életű, user/site scoped, egyszer használatos OAuth state alap és tesztek léteznek | Callback error matrix, replay/expiry/race test, origin/redirect validation és audit. |
| INT-004 | INTEGRATION / Twitch token lifecycle | Token encryption, validation, refresh lock, revoke logic és tests léteznek | Provider-generic lifecycle contract, rotation/revoke proof, concurrent refresh and outage recovery. |
| INT-005 | INTEGRATION / site ownership | Twitch connection explicit user/site scoped; negative tests léteznek | Minden későbbi provider ugyanazt az ownership invariantot és cross-site negative testet alkalmazza. |
| INT-006 | INTEGRATION / scopes | Twitch scopes kiolvasása és megjelenítése létezik | Capability-to-scope matrix, missing scope UX, minimum scope and re-consent flow. |
| INT-007 | INTEGRATION / connect/reconnect/disconnect | Twitch connect/callback/validation/disconnect routes léteznek | Admin UX end-to-end, reconnect, revoke failure, disconnect idempotency and provider status truthfulness. |
| INT-008 | INTEGRATION / sync history | Twitch schedule sync state/error mapping létezik | General provider sync history, retry controls, bounded retry, per-run diagnostics and audit. |
| INT-009 | INTEGRATION / quotas | Explicit generalized quota/rate-limit service nem bizonyított | Provider 429/Retry-After policy, quota budget, backoff and UI freshness state. |
| INT-010 | INTEGRATION / Twitch adapter | Twitch OAuth/channel binding and schedule API integration exists | End-to-end live smoke, scope changes, identity mismatch, rate limits, API schema drift and revoke. |
| INT-011 | INTEGRATION → LIVE_STATE/SCHEDULE | Twitch schedule adapter exists; normalized live-state service not proven | Live/offline state, stream title/category/viewers, stale cache and public block must be a separate LIVE owner. |
| INT-012 | INTEGRATION / Twitch VOD/clip metadata | VOD/clip API adapter/route not visible in route registry | API scopes, content IDs, allowed fields, paging/quota and CNT handoff; do not store canonical content inside INT. |
| INT-013 | INTEGRATION / YouTube | Dedicated YouTube adapter/route/test not visible | OAuth/consent/scopes, live/video metadata, quota, revoke and capability tests. |
| INT-014 | INTEGRATION / TikTok | Dedicated TikTok adapter/route/test not visible | Capability-gated product API availability, review/approval, limited scopes and honest unavailable state. |
| INT-015 | INTEGRATION / Discord | Dedicated Discord bot/guild/role adapter not visible | Bot install, guild scope, role permissions, interaction/webhook verification and retry; role sync consumes SUP entitlement. |
| INT-016 | INTEGRATION / Kick | Dedicated Kick adapter/route/test not visible | Provider API availability/terms, auth and capabilities; unsupported operations hidden/disabled truthfully. |
| INT-017 | INTEGRATION / inbound provider webhook | Provider webhook registry/delivery route not visible | Signature/replay security follows SEC-009; idempotency, delivery log, retry and provider-specific signature tests. |
| INT-018 | INTEGRATION / provider capability registry | General provider registry not proven | Per-provider capability manifest/version/permission/quota; excludes AI model/provider configuration (AI-001). |
| INT-019 | INTEGRATION + SEC/AUDIT | Twitch audit records and encrypted tokens exist; redaction matrix not fully proven | No tokens/state/code in logs; structured secret redaction, retention and negative tests for errors/diagnostics. |
| INT-020 | INTEGRATION / diagnostics | Twitch config diagnostic, connection status and validation endpoints exist | Safe diagnostic report, provider latency/rate-limit/error category, recovery instructions and no secret exposure. |
| INT-021 | INTEGRATION / future payment/email adapters | Generic future intent only; no payment/email adapter route proven | Payment/email remain separate adapters with legal/provider gates; Store owns checkout/order workflow, NTF owns notification delivery. |

**Biztonsági megőrzési szabály:** a meglévő Twitch OAuth state hashing/TTL/single-use, encrypted token storage, refresh lock és site ownership kódot újra kell használni és megőrizni. Ne készüljön párhuzamos token store vagy második OAuth flow. A közös provider adapter a lifecycle/capability határt egységesíti, nem teszi az összes szolgáltató OAuth- és adatmodelljét azonossá.

**Státusz: IN PROGRESS / NOT PASS.** A Twitch alap kód- és tesztbizonyítéka létezik, de ebben a lépésben nem futott teszt és nem történt éles provider smoke. A RES-001–016 mátrixot a 63.30 azóta rögzíti; az aktuális következő pontot a legutolsó 63.x fejezet tartalmazza.

### 63.30. RES-001–016 — canonical Media/Asset/Font/Icon Registry, egyedi-ID-s bizonyítékmátrix

A jelenlegi alap: `Env.MEDIA: R2Bucket`, `media` D1 tábla (id, object_key, original_name, mime_type, size_bytes, alt_text, created_at, site_id), `MediaAsset`/AssetReference type és normalizer a `src/core/domain/contracts.ts` fájlban, valamint Editor node-típusok/palette. A vizsgált Worker route-regiszterben nincs dedikált media API. Ebből a tárolási alap létezése bizonyítható; a teljes asset lifecycle nem.

| ID | Owner / forrás | Látható alap | Nyitott acceptance / függőség |
|---|---|---|---|
| RES-001 | RESOURCE / MediaAsset type + D1 media | Canonical type/ID és metadata table alap létezik | Nincs bizonyított registry service/API, list/detail lifecycle vagy asset uniqueness policy; egyetlen registry legyen. |
| RES-002 | RESOURCE / D1 + R2 binding | D1 metadata és R2 binding létezik | Upload/delete/replace consistency, object-key generation, orphan scan, transaction/compensation and restore. |
| RES-003 | RESOURCE / upload API | Upload/progress/cancel/retry endpoint/UI nem látható | MIME sniffing, size cap, filename normalization, authorization, streaming upload, progress/cancel/retry and partial R2 failure. |
| RES-004 | RESOURCE / image processing | Thumbnail/variant/resize/crop/optimization pipeline nem bizonyított | Processing job/state, original retention, variant references, metadata stripping, dimension caps and retry. |
| RES-005 | RESOURCE / asset query | Registry search/filter/sort/pagination API nem látható | Server-side query over canonical assets only, site scope, stable sort, pagination and permission-aware UI. |
| RES-006 | RESOURCE / collections | Asset collection/tag/folder schema/API nem látható | Asset-only taxonomy, nested folder semantics, bulk move, delete/restore and no overlap with CNT/STORE taxonomy. |
| RES-007 | RESOURCE / metadata | Alt text field exists; license/source/caption/rights metadata not in the observed media schema | Required metadata policy by asset kind, rights/expiry/consent, provenance, accessibility warnings and import path. |
| RES-008 | RESOURCE / usage map | Asset reference normalizer exists; reference scanner/usage map not proven | Index every Page Model/domain reference, update on save/publish/delete, cross-site protection and “in use” report. |
| RES-009 | RESOURCE / safe lifecycle | Safe replace/archive/delete/restore service not visible | Referenced-delete block/replace, soft delete or recoverable tombstone, R2 failure compensation and audit. |
| RES-010 | EDITOR → RESOURCE | Editor has image/video/audio/icon/embed node types | Shared picker must consume the canonical registry and return asset ID/reference; Editor must not own upload metadata. |
| RES-011 | RESOURCE / icon registry | Icon node type exists; canonical icon catalog/search/category/preview not proven | License/provenance, searchable icons, stable ID, size/color semantics, keyboard accessible picker. |
| RES-012 | RESOURCE / SVG security | Sanitizer/upload gate not proven | SVG active-content sanitization, external reference rejection, CSP/content-type and malicious-file negative tests. |
| RES-013 | RESOURCE / font registry | Font node/type category exists; font registry/API/weight/style metadata not proven | Source/license, weight/style variants, fallback stack, preload/performance and public-safe delivery. |
| RES-014 | RESOURCE / private download | Authorized expiring download URL/service not visible | Signed URL expiry, site scope, one-time/limited access if needed, cache headers and no direct private R2 exposure. |
| RES-015 | RESOURCE / diagnostics | Broken-asset/metadata/orphan scan not proven | Scheduled/manual diagnostics, missing object and stale DB record report, repair workflow and safe retry. |
| RES-016 | RESOURCE + ENTITLEMENT | Paid/private asset access policy not implemented/proven | Server-side entitlement/access gate, revocation and expiry; public asset URLs cannot bypass private authorization. |

**Shared UI boundary:** az Editor, Content Studio, Store, Brand Kit és public renderer ugyanazt a canonical Asset ID-t/reference-et fogyasztja. A picker lehet újrahasználható UI, de nem külön media API, külön metadata store vagy második R2 naming system. Font/icon library szintén a RESOURCE domain része, a design token/font usage pedig a DESIGN_SYSTEM domainből hivatkozik rá.

**Státusz: IN PROGRESS / NOT PASS.** A meglévő táblát, bindingot és type-okat meg kell tartani és bővíteni; upload/pipeline/usage-map/safe-delete előtt nincs engedély párhuzamos asset rendszer vagy teljes funkció PASS jelölésére. A DSN-001–018 mátrixot a 63.31 azóta rögzíti; az aktuális következő pontot a legutolsó 63.x fejezet tartalmazza.

### 63.31. DSN-001–018 — Brand Kit, design tokens, template és component registry

A forrásbizonyíték: `ThemeTokens`/ `SitePresentation` domain type-ok és normalizálók; a `migrations/0002_editor_platform.sql` létrehozza a `design_tokens` és `editor_components` táblákat, de egyik sem tartalmaz `site_id`-t. A vizsgált route-regiszterben nincs dedikált design-system/template/component CRUD API, és a canonical Editor UI-ban nem bizonyított teljes token/template szerkesztő.

| ID | Owner / forrás | Látható alap | Nyitott acceptance / függőség |
|---|---|---|---|
| DSN-001 | DESIGN_SYSTEM / ThemeTokens + `design_tokens` | Token type/table alap létezik | Token schema/version, allowed token keys/types, responsive token and site scope. |
| DSN-002 | DESIGN_SYSTEM / token editor | Dedikált token editor/live preview nem bizonyított | CRUD UI/API, token preview across pages, validation and atomic apply. |
| DSN-003 | DESIGN_SYSTEM / dependency map | Token usage/dependency scanner nem látható | Page/component/template reference index, affected-item preview and delete/update guards. |
| DSN-004 | DESIGN_SYSTEM / version/rollback | Token version/diff/rollback route/schema nem látható | Immutable versions, diff, rollback as new version and renderer cache invalidation. |
| DSN-005 | DESIGN_SYSTEM / brand presets | Type-level presentation/token base only | Brand preset create/apply/duplicate/import/export, preview and safe override precedence. |
| DSN-006 | DESIGN_SYSTEM → EDT | Responsive helper exists in Editor | Shared breakpoint tokens and precedence across Editor, templates and public renderer. |
| DSN-007 | RESOURCE ↔ DESIGN_SYSTEM / fonts | Font node/type exists, canonical font registry not proven | Font metadata/license, weights, fallbacks, preload, accessible typography and performance. |
| DSN-008 | DESIGN_SYSTEM / site template | Site template registry/import flow not proven | Template manifest, schema version, asset dependencies, site-level apply/rollback and safe defaults. |
| DSN-009 | DESIGN_SYSTEM / page templates | No page-template registry API/UI proven | Page template CRUD, compatibility, preview, apply-to-new-page and non-destructive update. |
| DSN-010 | DESIGN_SYSTEM / section templates | Section template registry not proven | Reusable sections, responsive variants, token/asset refs and versioned update policy. |
| DSN-011 | DESIGN_SYSTEM / component templates | `editor_components` table exists but has no site scope or dedicated API | Canonical component schema, ownership, variants, slots, permissions and schema migrations. |
| DSN-012 | DESIGN_SYSTEM / master-instance | Master/instance propagation not proven | Stable master ID, instance references, explicit detach/override and dependency map. |
| DSN-013 | DESIGN_SYSTEM / variants/slots | Component variant/slot/override lifecycle not proven | Defined precedence, invalid slot fallback, accessibility and template compatibility. |
| DSN-014 | DESIGN_SYSTEM / versioning | Versioned design/component schema not proven | Version compatibility, migration preview, rollback and separate AI prompt versioning (AI-002). |
| DSN-015 | DESIGN_SYSTEM / import/export | Template import/export route not proven | Signed/validated manifest, asset dependency resolution, safe JSON/schema validation and license attribution. |
| DSN-016 | DESIGN_SYSTEM / Button Registry | Editor has button node and style props; global Button Registry not proven | Shared variants/styles across pages, token references and compatibility without copying domain logic. |
| DSN-017 | DESIGN_SYSTEM ↔ RESOURCE/INT | Icon node and link/button node exist; shared action/icon registry not proven | Icon IDs and action contract, allowlisted targets, safe URLs and no arbitrary page code. |
| DSN-018 | EXTENSION/MKT ↔ DESIGN_SYSTEM | Marketplace is roadmap-only; no marketplace route/schema proven | Review/license/signature/version/compatibility and legal gate; never load untrusted template code directly. |

**Site-scoping decision gate:** `design_tokens.name` is globally UNIQUE and `editor_components` has no `site_id`. These may be legacy single-site constraints; they must not be changed blindly. Before multi-site/agency SaaS, define whether each record is global, workspace-scoped or site-scoped; migrate existing rows safely and add cross-site negative tests. Design-system APIs must reuse one canonical registry, not create a second theme/template database.

**Státusz: IN PROGRESS / NOT PASS.** A DYN/SET/SEO mátrixot a 63.32 azóta rögzíti; az aktuális következő pontot a legutolsó 63.x fejezet tartalmazza.

### 63.32. DYN-001–008, SET-001–004, SEO-001–005 — public data, settings és metadata contract

A forrásbizonyíték: `src/routes/admin/settings.ts` és `src/routes/public/site-settings.ts` a globális `site_settings.key='site'` rekordból csak `siteName`/ `tagline` mezőket kezel; a Page Model normalizer előkészít `canonical` és `openGraph` metadata mezőket, de a publikus renderer csak `document.title` és látható cím/leírás értékét frissíti. Az Editor schedule blockja egy szűk, whitelistelt schedule bindingot használ, általános data-source registry nem bizonyított.

| ID | Owner / forrás | Látható alap | Nyitott acceptance / függőség |
|---|---|---|---|
| DYN-001 | DYNAMIC_DATA / schedule binding | Schedule block binding `source: schedule_items` és public read query létezik | Általános source registry canonical domain API-kon, versioned schemas és permission-aware capability registry. |
| DYN-002 | DYNAMIC_DATA / binding schema | Schedule config normalizer/type validation létezik | Minden source/field type compatibility, nullability, required fields, schema version and invalid-reference errors. |
| DYN-003 | DYNAMIC_DATA / query contract | Schedule read limit/status/platform/order whitelistelt | Általános filter/sort/transform csak allowlistelt AST-n keresztül; arbitrary SQL/JS nem engedélyezett. |
| DYN-004 | DYNAMIC_DATA / conditional rendering | Node visibility mező létezik; adatfeltétel engine nem bizonyított | Typed predicates, safe operators, missing-data fallback and no secret-dependent public leak. |
| DYN-005 | DYNAMIC_DATA + ADM-008 | Schedule read hibát jelez; általános loading/empty/partial/stale/error state machine nincs bizonyítva | Közös UI-state contract, domain-specific data state és accessible retry. |
| DYN-006 | DYNAMIC_DATA / cache | Néhány request no-store, általános cache/freshness/invalidation service nem látható | Source-specific TTL, publish/sync invalidation, stale fallback and race handling. |
| DYN-007 | DYNAMIC_DATA + SEC/PAGE | Public page read szűri a published page-et; preview auth-olt | Source-level server permission, site scope, published-only and member-entitlement boundary. |
| DYN-008 | DYNAMIC_DATA / diagnostics | Általános binding diagnostics nem bizonyított | Missing/invalid reference report, preview trace, safe error details and recovery path. |
| SET-001 | SETTINGS / site_settings | Admin CRUD csak siteName/tagline és global key='site' rekord | Canonical settings schema/version, validation, lifecycle and settings domain split. |
| SET-002 | SETTINGS + SEC / site ownership | Page/schedule/Twitch/media site scope több helyen létezik; settings global | Site-scoped migration csak minden read/write consumer auditja, backfill/rollback és cross-site negative tests után. |
| SET-003 | SETTINGS / public projection | Public endpoint csak siteName/tagline mezőket ad vissza | Public-safe projection mezőlista és secret/private field exclusion tests; nincs full settings object kitéve. |
| SET-004 | SITE_DOMAIN / custom domains | Domain verification/DNS/SSL lifecycle nem bizonyított | Ownership challenge, DNS/SSL state, primary domain switch, redirect/canonical URL and failure recovery. |
| SEO-001 | SEO_PUBLICATION / Page Model | Metadata type előkészíti title/description/canonical mezőket; title/description client-side update | Server-rendered or crawler-compatible per-page metadata, canonical/robots validation and publish snapshot. |
| SEO-002 | SEO_PUBLICATION / OG/X | `openGraph` placeholder van a Page Modelben; OG/X metadata/social preview nincs bizonyítva | og:title/description/image, X card, image validation/crop, preview and crawler acceptance. |
| SEO-003 | SEO_PUBLICATION / structured data | Structured data/schema.org generation nem látható | Typed allowlisted schemas only when applicable, validation, escaping and no invented facts. |
| SEO-004 | SEO_PUBLICATION / sitemap/robots | `visual-page.html` statikus `robots=index,follow`; dedicated sitemap/robots route/file nem látható | Per-site sitemap and robots policy, draft/preview exclusion, redirects, publish/cache invalidation and canonical host. |
| SEO-005 | SEO_PUBLICATION / diagnostics | Dedicated SEO audit/preview not proven | Missing/duplicate metadata, invalid canonical, broken link, indexability and public HTTP status report. |

**Public metadata acceptance:** a kliensoldali `document.title` módosítás nem bizonyítja, hogy a crawler a helyes title/description/OG/canonical adatot kapja. Minden publikált page-hez ellenőrizni kell a nyers HTTP HTML-t, status code-ot, canonical/robots/OG/X/structured data kimenetet és sitemap inclusiont; draft/preview nem indexelhető. Ezt browser/HTTP acceptance nélkül nem lehet PASS-nak jelölni.

**Státusz: IN PROGRESS / NOT PASS.** A CNT/LIV mátrixot a 63.33 azóta rögzíti; az aktuális következő pontot a legutolsó 63.x fejezet tartalmazza.

### 63.33. CNT-001–022 és LIV-001–010 — Content Studio és Live State domainhatár

A jelenlegi route-regiszterben a Twitch adapter és schedule sync látható, de nincs dedikált Content Studio CRUD/publishing route, content-domain migration/schema vagy live-state API. Az Editor node palette tartalmaz media node-típusokat és schedule blokkot; ez nem bizonyít canonical content libraryt vagy live domain-t.

| ID | Owner / forrás | Látható alap | Nyitott acceptance / függőség |
|---|---|---|---|
| CNT-001 | CONTENT / canonical content schema | Content item D1 schema/service nem látható | Canonical ID, provider IDs, type/status/visibility, owner/site, lifecycle and rights references. |
| CNT-002 | CONTENT + INT / VOD import | Twitch VOD adapter/route nem látható | Supported provider import, pagination/quota, dedupe, metadata mapping and manual import fallback. |
| CNT-003 | CONTENT / clips/highlights/Shorts | Clip/Short management route/schema nem látható | Source video/timecode, crop/aspect, provider URL/ID, rights and lifecycle. |
| CNT-004 | CONTENT + INT / YouTube/TikTok feed | Dedicated adapters/routes not proven | Capability-gated read/publish permissions, per-provider limits and truthful unsupported states. |
| CNT-005 | CONTENT / taxonomy | Content tags/categories/collections/playlists schema not proven | Content-specific taxonomy, not shared with Store product taxonomy or RESOURCE folders. |
| CNT-006 | CONTENT / library query | Canonical content query API/UI not proven | Site-scoped search/filter/sort/pagination/bulk action, stable sort and authorization. |
| CNT-007 | CONTENT / dedupe | External IDs in a canonical content model not proven | Unique provider+account+external ID, duplicate merge/review and import idempotency. |
| CNT-008 | CONTENT / featured/related | Relationship model not proven | Stable content references, deleted/unpublished fallback and public projection. |
| CNT-009 | CONTENT / content calendar | Schedule domain exists, content calendar does not | Separate content publishing jobs linked to schedule; do not treat every content post as a stream event. |
| CNT-010 | CONTENT / ideas/drafts/scripts | Draft/brief schema not proven | Draft/review lifecycle, owner/permissions, autosave and version history. |
| CNT-011 | CONTENT / platform variants | Platform-specific metadata schema not proven | Per-provider length/format validation, locale variants and preview. |
| CNT-012 | CONTENT → RESOURCE | Editor image/media nodes and asset reference type exist | Canonical asset ID workflow, thumbnail selection, rights and missing-asset state. |
| CNT-013 | CONTENT / publishing queue | Queue/job schema/worker not proven | Durable scheduled jobs, timezone, cancel/retry, idempotency and provider confirmation. |
| CNT-014 | CONTENT / publish result | Partial-success model not proven | Per-provider result, retry failed destinations only, no false “published” status. |
| CNT-015 | CONTENT / approval | Approval workflow not proven | Author/reviewer role, approval state, immutable reviewed snapshot and publish gate. |
| CNT-016 | CONTENT ↔ CAMPAIGN | Campaign/content relationship not proven | Canonical references and attribution contract; analytics consumes events without owning content. |
| CNT-017 | CONTENT / short export | Export-preparation pipeline not proven | Aspect ratios, crop/reframe, captions/audio, codec/size constraints and progress/retry. |
| CNT-018 | CONTENT / transcript artifacts | AI transcript/chapter/highlight artifact lifecycle not proven | Source timestamps/confidence, human review, rights checks; AI-014 suggests but CONTENT owns approved artifacts. |
| CNT-019 | EDITOR → CONTENT projection | General content-feed block not proven; schedule block exists | Block binds canonical content projection, not copies content records into Page Model. |
| CNT-020 | CONTENT / public feed | Canonical published-content projection not proven | Published-only API, query/filter contract, stable IDs, cache invalidation and WEB-017 route consumption. |
| CNT-021 | CONTENT / timeline editor | Timeline-based video editing/render pipeline not proven | Separate media pipeline/worker feasibility, source asset retention, export status/cost and legal review. |
| CNT-022 | CONTENT / rights and takedown | Rights/consent/expiry schema not proven | Music/video/guest permission, expiry, takedown SLA, propagation to all public feeds and audit. |
| LIV-001 | LIVE_STATE / normalized state | Twitch connection exists; canonical live/offline service not proven | Provider-neutral state machine, online/offline transitions, event time and account binding. |
| LIV-002 | LIVE_STATE / freshness | Twitch connection validation time exists, but live-data freshness model not proven | Last fetched/observed timestamps, TTL, stale fallback and UI stale indicator. |
| LIV-003 | LIVE_STATE / stream metadata | Schedule includes title/platform/time; current live title/category data route not proven | Live stream title/category/game/start time from provider with normalized fields. |
| LIV-004 | LIVE_STATE / metrics | Viewer/follower/subscriber metrics API/read model not proven | Permission and provider availability, units/window/freshness, privacy and quota. |
| LIV-005 | LIVE_STATE / player | Static page shell exists; live player/offline fallback not proven | Safe provider embed, responsive sizing, autoplay policy, offline card and unsupported provider fallback. |
| LIV-006 | LIVE_STATE / event normalization | Normalized live event bus not proven | Start/end/title/category/provider events, dedupe and event time semantics. |
| LIV-007 | LIVE_STATE → ADM/PUBLIC/EDT | Admin and public live-status projection not proven | Dashboard and public blocks consume same normalized read model and truthful stale/error state. |
| LIV-008 | LIVE_STATE + INT / multistream | Multistream destination orchestration not proven | Capability matrix, platform-specific metadata, policy/legal review and per-destination partial failure. |
| LIV-009 | LIVE_STATE / unified chat | Unified chat read/send/moderation service not proven | Per-provider read vs send scopes, provider labels, moderation, rate limits and partial-failure handling. |
| LIV-010 | LIVE_STATE / recording/replay | Recording/replay status/retention/cost lifecycle not proven | Supported provider capabilities, retention/cost policy, authorized access and no unsupported promise. |

**Határszabály:** a `schedule_items` az adásrend kanonikus rekordja, nem a content library. A Twitch adapter connection metadata-t és schedule segmentet adhat; a Content Studio canonical content itemeket birtokolja, a Live State pedig a pillanatnyi stream állapotot. A public page és Editor blokk csak ezeket a read projectionöket fogyasztja. Sem a Page Model, sem az Integrations modul nem válhat content/live catch-all adattárrá.

**Státusz: IN PROGRESS / NOT PASS.** A COM/STO/SUP mátrixot a 63.34 azóta rögzíti; az aktuális következő pontot a legutolsó 63.x fejezet tartalmazza.

### 63.34. COM-001–020, STO-001–021, SUP-001–012 — Community, Store és Support/Entitlement

A route-/schema-leltárban nem látható dedikált Community/Fan Identity, Product/Order/Payment vagy Support/Membership/Entitlement domain route és migration/test suite. Ezeket **nem kész funkcióként**, hanem tervezett domainként kezeljük. A meglévő Twitch auth, Page Model és RESOURCE alapokat csak explicit connectorokon keresztül szabad fogyasztani.

| ID | Owner / forrás | Állapot és kötelező acceptance |
|---|---|---|
| COM-001 | COMMUNITY / external links | Statikus linkek lehetnek, de canonical link registry nem bizonyított; URL safety, visibility és broken-link check kell. |
| COM-002 | COMMUNITY ↔ INT / Discord entry | Discord adapter nem bizonyított; install/guild permissions és honest unavailable state szükséges. |
| COM-003 | COMMUNITY / posts | Canonical post schema/API nincs bizonyítva; draft/publish/edit/archive, author/site scope és moderation audit kell. |
| COM-004 | COMMUNITY / polls | Poll/vote schema nincs bizonyítva; open/close, one-vote policy, rate-limit és tamper-resistant tally kell. |
| COM-005 | COMMUNITY / events & RSVP | Event domain külön a stream schedule-től; RSVP consent/capacity/cancel and timezone handling kell. |
| COM-006 | FAN_IDENTITY / profiles/follows | Fan account lifecycle nincs bizonyítva; profile privacy, block/unfollow, export/delete és account isolation kell. |
| COM-007 | COMMUNITY / comments/reactions | Comment/reaction API nincs bizonyítva; abuse/rate-limit, moderation, delete and permission checks kell. |
| COM-008 | COMMUNITY / clip submission | Content intake workflow nincs bizonyítva; upload asset reference, consent/rights, review and takedown kell. |
| COM-009 | COMMUNITY / moderation | Report/ban/role lifecycle nincs bizonyítva; least privilege, reason, appeal, audit and expiry kell. |
| COM-010 | COMMUNITY / reputation/challenges | Badge/reputation engine nincs bizonyítva; anti-abuse rules, explainable scoring and privacy controls kell. |
| COM-011 | NTF / notifications | Notification delivery domain nincs bizonyítva; community eventből idempotens notification event és truthful delivery state kell. |
| COM-012 | COMMUNITY / abuse | General rate-limit/spam controls nem bizonyítottak; per-account/IP/action limits, abuse reports and fail-safe policy kell. |
| COM-013 | COMMUNITY ↔ ENTITLEMENT | Member-only visibility gate nincs bizonyítva; minden server read ellenőrizze a canonical entitlementet, UI hide nem elég. |
| COM-014 | COMMUNITY / Founding Supporters | Opt-in listing model nincs bizonyítva; consent receipt, revoke, display-name policy and delete propagation kell. |
| COM-015 | FAN_IDENTITY/NTF / email signup | Consent/subscriber API nincs bizonyítva; double opt-in policy, consent timestamp/source and provider contract kell. |
| COM-016 | NTF/AUT / newsletter automation | Segmentation/automation engine nincs bizonyítva; audience consent, suppression, safe trigger and audit kell. |
| COM-017 | FAN_IDENTITY/NTF / unsubscribe | Suppression/export/delete workflow nincs bizonyítva; unsubscribe idempotency, retention and provider propagation kell. |
| COM-018 | COMMUNITY/WEB / visibility | Public/member/private policy nincs bizonyítva; single canonical visibility rule consumed by all surfaces. |
| COM-019 | FAN_IDENTITY / account lifecycle | Fan identity distinct from creator/Admin users; session, preferences, export/delete, consent withdrawal and cross-account negative tests. |
| COM-020 | COMMUNITY / rules and enforcement | Rules/age/content policy engine not proven; versioned rules, acknowledgement, enforcement reason, appeal and legal review. |
| STO-001 | PRODUCT / catalog | Product table/API/UI not visible; canonical product IDs and lifecycle needed. |
| STO-002 | PRODUCT / variants/SKU/price | Variant/SKU/currency schema not proven; currency precision, SKU uniqueness, price history and availability rules needed. |
| STO-003 | PRODUCT / taxonomy | Product categories/collections separate from CNT and RESOURCE taxonomies; relation and migration policy needed. |
| STO-004 | PRODUCT → RESOURCE/SEO | Product media/SEO not proven; canonical asset references, public-safe fields and SEO projection. |
| STO-005 | PRODUCT / type | Physical/digital/bundle/preorder/limited-drop support not proven; type-specific fulfillment and availability rules. |
| STO-006 | PRODUCT/ORDER / inventory | Inventory/fulfillment abstraction not proven; reserve/release, oversell policy and reconciliation. |
| STO-007 | STOREFRONT / listing/search | Public product listing/detail/search/filter not proven; published/active products only and correct currency. |
| STO-008 | ORDER / checkout provider | Checkout workflow/provider not proven; payment provider chosen after security/legal review, no DIY card storage. |
| STO-009 | ORDER / lifecycle | Canonical order/payment status schema not proven; provider-confirmed state transitions and idempotency. |
| STO-010 | ORDER / fulfillment | Shipping/tracking/cancel/refund lifecycle not proven; partial fulfillment and compensation workflow. |
| STO-011 | PRODUCT/ORDER / promotions | Coupon/promo/gift-card engine not proven; expiry, usage caps, stacking and abuse controls. |
| STO-012 | ENTITLEMENT / digital purchase | Purchase entitlement not proven; grant/revoke based on confirmed order/refund state, not UI. |
| STO-013 | RESOURCE/ENTITLEMENT / secure delivery | Secure download access not proven; short-lived signed URL, entitlement re-check and revoke/expiry. |
| STO-014 | ORDER / tax/shipping/VAT | Compliance integration not proven; provider and jurisdiction decision required before launch. |
| STO-015 | FAN_IDENTITY/ORDER / customer history | Customer account/history not proven; private order authorization, export/delete and minimum PII. |
| STO-016 | ORDER/AUT / abandoned cart | Abandoned-cart lifecycle not proven; deferred feature, consent/marketing policy and idempotent reminders. |
| STO-017 | EDITOR → PRODUCT projection | Product block not proven; Editor only configures view/query, PRODUCT owns catalog. |
| STO-018 | INT/ORDER / webhook idempotency | Payment webhook route/registry not proven; SEC-009 signature/replay, dedupe key, retry and audit. |
| STO-019 | PRODUCT/ORDER / merchant of record | Provider/merchant-of-record decision unresolved; explicit legal, tax, refund and consumer-rights gate. |
| STO-020 | ANALYTICS / store metrics | Store analytics read model not proven; derive from canonical order/product events, privacy-safe and source-labelled. |
| STO-021 | ORDER / legal compliance | VAT/invoice/consumer rights gate unresolved; must be decided before real transactions, not after implementation. |
| SUP-001 | SUPPORT / tip links | External links possible but support provider registry/state not proven; canonical URL and privacy/safety check. |
| SUP-002 | SUPPORT / tip status | Provider-confirmed donation/tip state not proven; never fabricate successful payment/receipt. |
| SUP-003 | SUPPORT / goals | Support goal/progress model not proven; event source, currency, date range and public opt-in policy. |
| SUP-004 | SUPPORT / membership tiers | Membership tier/billing period schema not proven; provider mapping and lifecycle. |
| SUP-005 | ENTITLEMENT / perks | Perk definition not proven; access policy separated from community/page UI and billing state. |
| SUP-006 | ENTITLEMENT / canonical access | Entitlement service/schema not proven; canonical grant/revoke/expiry decisions with audit. |
| SUP-007 | SUPPORT/ENTITLEMENT / renewal/cancel | Renewal/failed-payment lifecycle not proven; webhook-confirmed state and grace-period policy. |
| SUP-008 | ENTITLEMENT / refund/chargeback | Refund/chargeback handling not proven; revoke/restore semantics and reconciliation. |
| SUP-009 | ENTITLEMENT → INT/Discord | Discord role sync not proven; role changes derive from entitlement and retry idempotently. |
| SUP-010 | SUPPORT / supporter history | Supporter history/opt-in public listing not proven; consent, retention, export and revoke. |
| SUP-011 | ENTITLEMENT → WEB/COM | Content/event membership entitlement not proven; all surfaces consume same decision and deny by default. |
| SUP-012 | PRODUCT/ENTITLEMENT / member discount | Member discount/exclusive drop not proven; price eligibility server-side, anti-abuse and order snapshot. |

**Kötelező életciklus-szabály:** a Store Order, provider Payment state, Support event és Entitlement nem egyetlen státusz. A payment provider megerősített eseménye frissíti az ORDER állapotot; az ENTITLEMENT policy ebből dönt hozzáférésről; COMMUNITY/WEB/RESOURCE csak ezt olvassa. Refund/chargeback/cancel esetén a hozzáférés változását idempotensen és auditáltan kell végrehajtani. Semmilyen UI vagy AI nem állíthat be közvetlenül fizetési vagy tagsági állapotot.

**Státusz: IN PROGRESS / NOT PASS.** Az ANL/CAM/AUT/AI mátrixot a 63.35 azóta rögzíti; az aktuális következő pontot a legutolsó 63.x fejezet tartalmazza.

### 63.35. ANL-001–010, CAM-001–009, AUT-001–014, AI-001–021 — Analytics, Campaigns, Automation és SANCI AI

A jelenlegi route-/migration-/test-leltárban nem látható dedikált analytics event/read model, campaign/deal, automation workflow/run engine vagy AI provider/action/approval API. Ez a mátrix a tervezett szerződéseket rögzíti, nem állít meglévő implementációt.

| ID | Owner | Státusz és kötelező acceptance |
|---|---|---|
| ANL-001 | ANALYTICS | Event taxonomy/schema registry nem bizonyított; versioned names/units/source/consent és deprecation policy kell, trigger routing AUT-001-től külön. |
| ANL-002 | ANALYTICS | Privacy-safe web analytics nincs bizonyítva; consent, IP/PII minimization, retention, bot filtering and export authorization. |
| ANL-003 | ANALYTICS | Stream analytics read model nincs bizonyítva; provider permissions, metric unit/window/source/freshness and missing-data state. |
| ANL-004 | ANALYTICS | Content analytics nincs bizonyítva; provider metrics join canonical CNT IDs, never mutate content records. |
| ANL-005 | ANALYTICS | Commerce analytics nincs bizonyítva; derive from confirmed order events, refund/currency normalization and privacy policy. |
| ANL-006 | ANALYTICS | Community analytics nincs bizonyítva; aggregate/minimize member data, consent and abuse/bot filtering. |
| ANL-007 | ANALYTICS | Date compare/filter/export API nincs bizonyítva; timezone boundaries, CSV/format safety, scoped exports. |
| ANL-008 | ANALYTICS | Source/freshness/unit/missing state nincs bizonyítva; unknown is not zero, stale/estimated data explicitly labelled. |
| ANL-009 | ANALYTICS + SEC | Consent/retention/bot filtering service nincs bizonyítva; opt-out, deletion propagation and retention enforcement. |
| ANL-010 | ANALYTICS | Anomaly detection/alerts nincs bizonyítva; explainable threshold, false-positive handling and human-readable source. |
| CAM-001 | CAMPAIGN | Campaign CRUD/status/goals schema/API nincs bizonyítva; state machine, owner, dates and permissions. |
| CAM-002 | CAMPAIGN + ANALYTICS | UTM/attribution service nincs bizonyítva; canonical campaign IDs, attribution window and consent policy. |
| CAM-003 | CAMPAIGN | Asset/content/product relationship model nincs bizonyítva; references only, no duplicated domain records. |
| CAM-004 | CAMPAIGN/RESOURCE | Media-kit generator/export nincs bizonyítva; public/private field separation, asset rights, version and expiry. |
| CAM-005 | SPONSORSHIP | Lead/deal/rate-card model nincs bizonyítva; private access, approval and no AI-generated binding offer without review. |
| CAM-006 | SPONSORSHIP | Deliverable/deadline/reminder workflow nincs bizonyítva; timezone, reminder idempotency and completion audit. |
| CAM-007 | ANALYTICS/CAMPAIGN | Sponsor campaign report nincs bizonyítva; source-labelled metrics, access control and export. |
| CAM-008 | SPONSORSHIP/SEC | Private business documents/permission not proven; scoped access, download expiry, audit and deletion. |
| CAM-009 | SPONSORSHIP/ORDER | Invoice/payment status unresolved; only after legal/accounting/provider decision, never as a fabricated local payment state. |
| AUT-001 | AUTOMATION | Trigger-event catalog/routing contract not proven; consume versioned domain events, separate from ANL measurement taxonomy. |
| AUT-002 | AUTOMATION | Trigger catalogue/UI not proven; typed events, source ownership and supported trigger capability. |
| AUT-003 | AUTOMATION | Condition/filter engine not proven; safe typed expression tree, limits and no arbitrary code execution. |
| AUT-004 | AUTOMATION | Action catalog/execution API not proven; allowlisted canonical domain commands, server permission re-check per run. |
| AUT-005 | AUTOMATION | Delay/schedule/timezone engine not proven; durable jobs, DST, cancellation and bounded scheduling horizon. |
| AUT-006 | AUTOMATION | Idempotency/deduplication not proven; stable event/run/action keys and duplicate delivery tests. |
| AUT-007 | AUTOMATION | Retry/backoff/dead-letter not proven; bounded retry, jitter, provider Retry-After, dead-letter review. |
| AUT-008 | AUTOMATION | Run history/diagnostics not proven; input/output redaction, correlation ID and safe recovery; SEC-010 owns security audit events. |
| AUT-009 | AUTOMATION | Dry-run/preview/approval not proven; show exact planned actions/side effects before execution. |
| AUT-010 | AUTOMATION | Enable/pause/version/clone lifecycle not proven; immutable published versions and pause stops future runs. |
| AUT-011 | AUTOMATION | Cycle detection/rate limit not proven; bounded graph traversal, per-tenant quotas and runaway-loop kill switch. |
| AUT-012 | AUTOMATION | Provider outage/recovery not proven; circuit breaker, retry policy, partial failure and manual fallback. |
| AUT-013 | AUTOMATION | Automation template library not proven; versioned template schema, safe import and explicit review. |
| AUT-014 | AUTOMATION/SEC | Safe cross-domain actions not proven; owner API/command only, least privilege, idempotency and audit. |
| AI-001 | AI_OPERATION | AI provider/model registry not proven; capability/region/data handling/cost/lifecycle, separate from INT-018 social providers. |
| AI-002 | AI_OPERATION | Prompt/instruction version/evaluation not proven; versioned prompt, regression corpus, rollback and safety review; separate from DSN-014. |
| AI-003 | AI_OPERATION | Intent/task planner not proven; typed plan, bounded steps, cancellation and transparent uncertainty. |
| AI-004 | AI_OPERATION/SEC | Context selection/privacy filter not proven; minimum required data, site/permission filter and PII redaction. |
| AI-005 | AI_OPERATION | Structured action schema not proven; strict schema validation, allowlisted actions and reject unknown fields. |
| AI-006 | AI_OPERATION/SEC | Permission/ownership checker not proven; server-side authorization re-run immediately before each action. |
| AI-007 | AI_OPERATION | Diff/preview/approval workflow not proven; exact changes, affected pages/records, risks and approve/reject. |
| AI-008 | AI_OPERATION | Canonical API/command execution not proven; never direct-write business tables or bypass domain validation. |
| AI-009 | AI_OPERATION | Verify/audit/version/rollback not proven; read-after-write checks and compensating action when safe. |
| AI-010 | AI_OPERATION | Cost/quota/usage/error tracking not proven; provider/token cost, limits, failure states and user-visible usage. |
| AI-011 | AI_OPERATION → PAGE/CONTENT | Website assistant not proven; suggestions/drafts by default, diff and approval before public changes. |
| AI-012 | AI_OPERATION → SEO/SEC/LOC | SEO/accessibility/localization suggestions not proven; source evidence, no guaranteed ranking claims, human review. |
| AI-013 | AI_OPERATION → CONTENT | Content title/script/description/thumbnail brief not proven; draft artifacts, platform limits and rights review. |
| AI-014 | AI_OPERATION → CONTENT | Transcript/chapter/highlight candidates not proven; timestamps/confidence, human review and content API storage. |
| AI-015 | AI_OPERATION → LIVE_STATE | Stream diagnostics/summary not proven; only supported provider data, source/freshness and privacy controls. |
| AI-016 | AI_OPERATION | Specialist agent roles not proven; shared policy/permission/cost caps, no independent authority escalation. |
| AI-017 | AI_OPERATION | AI Control Center/approval queue not proven; queue state, actor, expiration, approve/reject and audit. |
| AI-018 | AI_OPERATION/SEC | Prompt injection/untrusted-content tests not proven; hostile webpage/chat/content corpus and tool-output isolation. |
| AI-019 | AI_OPERATION/SEC | Human approval policy not proven; public/destructive/financial actions always require explicit approval and revalidation. |
| AI-020 | PRODUCT/QA | AI-free fallback not proven; every critical manual workflow must work with AI disabled/provider outage. |
| AI-021 | AI_OPERATION/RESOURCE | Multimodal generation adapters not proven; provider capability, rights/safety checks, cost limit, asset provenance and human review. |

**Kanonikus végrehajtási lánc:** ANALYTICS mérési eseményt és riportot birtokol; CAMPAIGN üzleti kampányt/dealt birtokol; AUTOMATION eseményből engedélyezett actiont hajt végre; AI tervet/javaslatot készít és jóváhagyott canonical commandokat kér. Ezek között explicit versioned event/API contract legyen. Egy analytics event nem automatikusan workflow trigger, egy AI-javaslat nem domain state, és egy workflow-run nem helyettesíti a security audit logot.

**Státusz: IN PROGRESS / NOT PASS.** A SEC/OPS/QA/LOC/TEAM mátrixot a 63.36 azóta rögzíti; az aktuális következő pontot a legutolsó 63.x fejezet tartalmazza.

### 63.36. SEC-001–012, OPS-001–011, QA-001–010, LOC-001–006, TEAM-001–007 — cross-cutting acceptance contract

A jelenlegi forrásban auth/session/password/require-auth, site-context/ownership, audit helper, health/db-health, migrations és célzott tesztek léteznek. Nem bizonyított teljes MFA/SSO, RBAC permission matrix, backup/restore service, structured observability, locale workflow, workspace/team/billing implementation. A keresztmetszeti szerződések minden modulra kötelezők, de nem helyettesítik az egyes modulok adatgazdáját.

| ID | Owner | Állapot és kötelező acceptance |
|---|---|---|
| SEC-001 | IDENTITY | Login/logout/session/bootstrap route létezik; expiry/revocation/rotation and browser session matrix must be verified. |
| SEC-002 | SECURITY | require-auth/site ownership helpers exist; complete role/action permission matrix and server-side negative tests for every mutating route required. |
| SEC-003 | SECURITY / tenant isolation | Several routes are site-scoped, but global settings/design tables and global unique constraints remain; cross-site negative test for every domain/API and multi-site migration decision required. |
| SEC-004 | SECURITY / OAuth/CSRF | Twitch OAuth state protections exist; global CSRF/session-cookie policy, origin checks and every mutation route need audit. |
| SEC-005 | SECURITY / XSS/sanitization | Renderer escapes text and safeUrl handles some links; complete HTML/URL/embed/SVG/form sanitization and CSP acceptance not proven. |
| SEC-006 | SECURITY / SSRF/open redirect | General outbound URL policy not proven; allowlist outbound fetch, redirect target validation and DNS/IP/private-address defense for any server-side fetch. |
| SEC-007 | SECURITY / rate limit | General API/login/OAuth/submit rate limiter not proven; per-route/IP/account/provider limits, abuse alerts and retry policy. |
| SEC-008 | SECURITY / secret lifecycle | Twitch tokens encrypted and secret env keys used; secret rotation, redaction coverage, incident revoke and non-Twitch secret store not proven. |
| SEC-009 | SECURITY / webhooks | No generic webhook registry/receiver proven; provider signature verification, timestamp/replay defense, idempotency and negative tests. |
| SEC-010 | SECURITY/AUDIT | audit_log and helper exist; redaction/retention/export policy and complete security event coverage not proven. |
| SEC-011 | SECURITY/PRIVACY | Consent/retention/export/delete framework not proven; domain-by-domain PII inventory, consent withdrawal, deletion propagation and legal hold. |
| SEC-012 | IDENTITY/SECURITY | MFA/2FA/SSO/recovery/suspicious-login controls not proven; staged roadmap, recovery codes, session revoke and anti-lockout acceptance. |
| OPS-001 | OPERATIONS | Health and DB-health endpoints exist; deploy version/runtime commit visibility and public/private diagnostics boundary must be verified. |
| OPS-002 | OPERATIONS | Structured logs/correlation IDs not proven; request ID propagation, redaction and traceable API→provider flow. |
| OPS-003 | OPERATIONS | Error tracking/alerting service not proven; alert thresholds, ownership, dedupe and runbook. |
| OPS-004 | OPERATIONS / migrations | Migration directory and migration commands exist; every migration needs preflight, integrity/foreign-key check, backup and rollback plan. |
| OPS-005 | BACKUP | Backup/export/restore service not proven; encrypted backup, manifest, retention, ownership and restore acceptance. |
| OPS-006 | BACKUP/OPS | Recovery drill/runbook not proven; tested RTO/RPO targets, clean restore environment and evidence log. |
| OPS-007 | OPERATIONS | Unified diagnostics report not proven; safe environment/schema/provider/migration status without secrets. |
| OPS-008 | OPERATIONS | Performance/query/cache monitoring not proven; public route budgets, D1 query/index review, payload size and concurrency. |
| OPS-009 | OPERATIONS | Incident/rollback procedure not proven; deployment rollback, migration compatibility, incident roles and data recovery. |
| OPS-010 | OPERATIONS/SEC | Dependency/license/CVE review not proven as automated gate; SBOM/dependency inventory, license compatibility and remediation SLA. |
| OPS-011 | OPERATIONS | Durable background job/realtime runtime not proven; select only when a justified feature needs it, with retry/idempotency/observability. |
| QA-001 | QA/CI | Typecheck/test scripts exist from prior project evidence; current CI workflow and build gate evidence must be rechecked before PASS. |
| QA-002 | QA | Domain/Twitch/Editor tests exist; missing media/public SEO/community/commerce/automation/AI suites remain separate acceptance work. |
| QA-003 | QA/SEC | Site-ownership/Twitch negative tests exist; every endpoint needs unauthorized, cross-site and stale-version negative coverage. |
| QA-004 | QA/UI | Dedicated browser/device visual regression suite not proven; desktop/tablet/mobile, touch, keyboard and real-browser tests required. |
| QA-005 | QA/PUBLIC | SEO/accessibility/performance audit not proven; HTTP HTML metadata, WCAG keyboard/contrast/reduced-motion, performance budgets. |
| QA-006 | QA/RELEASE | Health checks exist; deploy smoke, real provider smoke, route status and production version evidence required. |
| QA-007 | QA/BACKUP | Test/acceptance gate only; actual OPS-005/006 backup and restore operations must exist first. |
| QA-008 | QA/E2E | Full creator journey suite not proven; setup→connect→create→preview→publish→public read→rollback, with failures. |
| QA-009 | QA/PRODUCT | User acceptance/evidence log not proven as complete; record actual test run, result, environment and unresolved issues. |
| QA-010 | QA/PRODUCT | Continuous benchmark/feature discovery not proven as executable workflow; periodic evidence-based review, license/security and decision log. |
| LOC-001 | LOCALIZATION | Translation key/fallback service not proven; no hardcoded critical UI strings in supported locales and missing-key report. |
| LOC-002 | LOCALIZATION | Locale-aware dates/numbers/currency/timezone service not proven; DST/currency/format tests. |
| LOC-003 | LOCALIZATION | Page/content/navigation translation workflow not proven; localized variants, fallback and publish completeness. |
| LOC-004 | SEO/LOCALIZATION | hreflang/canonical localization not proven; localized slug map, reciprocal hreflang, canonical policy and sitemap entries. |
| LOC-005 | LOCALIZATION | Translation completeness/locale preview not proven; status per field/locale and safe publish policy. |
| LOC-006 | AI/LOCALIZATION | AI translation review flow not proven; draft only, human approval, glossary, source/target diff and audit. |
| TEAM-001 | WORKSPACE | Workspace/site switcher not proven; active scope shown clearly, server-side scope independent of client state. |
| TEAM-002 | WORKSPACE/IDENTITY | Invite/accept/revoke route/schema not proven; expiring single-use invitation, scope binding and revoke. |
| TEAM-003 | WORKSPACE/SEC | Granular roles/permissions not proven end-to-end; deny by default and route-level tests. |
| TEAM-004 | WORKSPACE | Approval/review/activity feed not proven; source-domain ownership, reviewer permissions and audit. |
| TEAM-005 | WORKSPACE | Multi-site workspace workflows not proven; scoped resources, cross-site isolation, migration/backfill and negative tests. |
| TEAM-006 | BILLING_PLAN | SaaS billing/plan entitlement/quota not proven; separate from store orders and fan membership, provider-confirmed state. |
| TEAM-007 | WORKSPACE/AGENCY | Agency/client workspaces, shared templates and client approvals not proven; client isolation, scoped brand/template ownership and access revoke. |

**Cross-cutting closure rule:** a shared security/operations feature may provide a reusable helper/service, but each domain still needs to prove it uses that service correctly. For example, the existence of `requireAuth` does not prove every route has the right role check; the existence of `audit_log` does not prove all sensitive actions are audited; the existence of a migration command does not prove backup/restore works.

**Státusz: IN PROGRESS / NOT PASS.** Az ADM/SEARCH/NTF/HELP/DEV/MKT/OBS mátrixot a 63.37, a teljes ID-fázis keresztmegfeleltetést a 63.38 azóta rögzíti; az aktuális következő pontot a legutolsó 63.x fejezet tartalmazza.

### 63.37. ADM-001–013, SEARCH-001–005, NTF-001–005, HELP-001–004, DEV-001–006, MKT-001–005, OBS-001–010

A jelenlegi repositoryban az Admin shell/home, auth és Editor v2 létezik; a dedicated global search, notification delivery, help content/progress, developer API keys/outbound webhooks, extension registry/marketplace és OBS pairing/command API nem bizonyított a route-/schema-/test-leltárban. Az ADM csak felhasználói belépési pont és read projection, nem catch-all domain.

| ID | Owner | Állapot és kötelező acceptance |
|---|---|---|
| ADM-001 | ADMIN SHELL | Admin shell exists; canonical routes, navigation, active scope and access denied states must be consistent. |
| ADM-002 | ADMIN/DASHBOARD | Dashboard shell exists; every status card needs a canonical source, timestamp/freshness and partial-failure state. |
| ADM-003 | ADMIN/DASHBOARD | Quick-action entrypoints exist in concept; each must route to the owning module's canonical action, not duplicate mutation logic. |
| ADM-004 | ADMIN/DASHBOARD | Task/error aggregate is not proven; aggregate only permission-filtered domain items and link to owner module. |
| ADM-005 | ADMIN/AUDIT | audit_log/helper exists; recent activity UI/source filtering, redaction and site scope remain to prove. |
| ADM-006 | SEARCH | Global search/command palette entrypoint in menu map only; canonical search API/index and command routing not proven. |
| ADM-007 | IDENTITY | Login/session/logout routes exist; profile/preferences UI and secure session controls need acceptance. |
| ADM-008 | SHARED UI | Generic loading/empty/error/stale state standard not proven across all modules; presentation may be shared, domain state machine stays with owner. |
| ADM-009 | SEC/ADMIN | Permission-based menu visibility not proven fully; it is UX only and cannot replace server authorization. |
| ADM-010 | ADMIN SHELL | Mobile/tablet shell exists in some markup/CSS; real-device layout, focus, scroll and safe-area tests required. |
| ADM-011 | HELP_CENTER | Contextual help/onboarding entrypoint in menu map; help article/progress service not proven. |
| ADM-012 | NOTIFICATION | Dashboard notification entrypoint in menu map; canonical notification center/delivery/preferences not proven. |
| ADM-013 | ADMIN/OBSERVABILITY | Freshness/stale/partial status aggregate not proven; every card must identify source, updatedAt and error state. |
| SEARCH-001 | SEARCH | Permission-aware global index not proven; derived projection, tenant scope, permission filtering and deletion propagation. |
| SEARCH-002 | SEARCH | Command palette not proven; actions call canonical module commands with permission re-check, never raw arbitrary command strings. |
| SEARCH-003 | SEARCH | Saved views/favorites/recent list not proven; user-scoped preferences, deletion and scope switch behavior. |
| SEARCH-004 | SEARCH | Index freshness/invalidation not proven; publish/update/delete/permission revoke must propagate. |
| SEARCH-005 | SEARCH | Module filters/snippets not proven; snippets must not leak private fields and filters must be type/owner scoped. |
| NTF-001 | NOTIFICATION | In-app notification center/read-unread not proven; source module link, ownership and read-state lifecycle. |
| NTF-002 | NOTIFICATION | Delivery adapters/status not proven; distinguish queued/sent/delivered/failed only when provider evidence supports it. |
| NTF-003 | NOTIFICATION | User preferences/digest/quiet hours/channel opt-in not proven; locale/timezone and consent controls. |
| NTF-004 | NOTIFICATION | Event-to-notification idempotency/retry not proven; dedupe key, bounded retry and dead-letter review. |
| NTF-005 | NOTIFICATION/SEC | Unsubscribe/retention/payload minimization not proven; no sensitive content in push/email preview. |
| HELP-001 | HELP_CENTER | Contextual help map not proven; map by canonical module/feature ID and disclose limitations. |
| HELP-002 | HELP_CENTER | Onboarding progress not proven; role/site scoped, skip/restart and privacy-safe progress. |
| HELP-003 | HELP_CENTER | Versioned searchable docs/glossary not proven; canonical links, feature version and deprecation handling. |
| HELP-004 | HELP_CENTER/SEC | Troubleshooting/feedback diagnostics not proven; diagnostic IDs with automatic secret/PII redaction. |
| DEV-001 | DEVELOPER_API | Public API reference/version/deprecation not proven; generated schema, supported version and examples. |
| DEV-002 | DEVELOPER_API/SEC | Scoped API key lifecycle not proven; one-time display, hash/storage policy, rotation, expiry/revoke and no plaintext logs. |
| DEV-003 | DEVELOPER_API | Creator outbound webhook registry/tester not proven; separate from INT inbound provider webhooks, signature, retries and replay defense. |
| DEV-004 | DEVELOPER_API | Sandbox fixtures/events not proven; isolated test workspace, no production secrets or real payment effects. |
| DEV-005 | DEVELOPER_API | SDK/examples not proven; generated from versioned API schema, compatibility and safe auth handling. |
| DEV-006 | DEVELOPER_API | Quotas/rate-limit visibility not proven; per-key and per-workspace limits, usage telemetry and actionable 429 state. |
| MKT-001 | EXTENSION | Extension manifest/permissions not proven; explicit capabilities, origin, data access and review. |
| MKT-002 | EXTENSION | Install/update/uninstall/migration not proven; staged rollout, rollback and orphan cleanup. |
| MKT-003 | EXTENSION/MARKETPLACE | Theme/block/template/overlay marketplace not proven; signed/versioned artifacts and canonical DESIGN_SYSTEM/RESOURCE references. |
| MKT-004 | EXTENSION/MARKETPLACE | License/attribution/version/review not proven; provenance, vulnerability scan and compatibility review. |
| MKT-005 | EXTENSION/ORDER | Marketplace payment/revenue-share not proven; legal/provider/merchant-of-record gate and auditable settlement. |
| OBS-001 | STREAM_TOOLS | Overlay asset/scene metadata not proven; canonical RESOURCE references and versioned scene manifest. |
| OBS-002 | STREAM_TOOLS/SEC | OBS secure pairing/connection not proven; one-time pairing code, explicit trust, expiry/revoke and secret-safe storage. |
| OBS-003 | STREAM_TOOLS | Scene/stream/recording state adapter not proven; provider-supported capabilities and freshness. |
| OBS-004 | STREAM_TOOLS/SEC | Authorized commands/markers not proven; command allowlist, role/connection checks, confirmation for destructive action. |
| OBS-005 | STREAM_TOOLS | Browser source config not proven; safe URLs, per-overlay secret isolation and preview. |
| OBS-006 | STREAM_TOOLS/NTF | Provider-supported alerts not proven; event source, dedupe, rate limits and test mode. |
| OBS-007 | STREAM_TOOLS | Chatbot/commands/timers/loyalty/giveaways not proven; permissioned event/action engine, moderation and legal/provider constraints. |
| OBS-008 | STREAM_TOOLS | Test/replay/rate limit not proven; dry-run, event fixture replay and no unintended production actions. |
| OBS-009 | STREAM_TOOLS | Macro Deck/external control adapter not proven; scoped pairing, signed commands and disconnect behavior. |
| OBS-010 | STREAM_TOOLS/RESOURCE | Overlay preview/export/version not proven; canonical asset references, compatibility, export manifest and rollback. |

**Module boundary rules:** (1) Dashboard aggregates and navigates; it never owns domain records. (2) Search index is derived, permission-aware and deletable; it is not a second source of truth. (3) Notifications are derived from domain events and own delivery/preferences only. (4) Help references canonical feature IDs. (5) Creator outbound webhooks/API keys belong to DEV; provider inbound webhooks belong to INT. (6) Extension artifacts never gain direct arbitrary D1 access. (7) OBS is a dedicated Stream Tools domain; Editor can place an overlay preview/block but cannot own pairing or commands.

**Státusz: IN PROGRESS / NOT PASS.** Az egyedi-ID-s hiánymátrixok elkészültek, a fázis-keresztmegfeleltetést a 63.38 rögzíti; továbbra is nyitott a funkciókártyák kötelező mezőinek és a végső konzisztencia-gate-ek ellenőrzése. Az aktuális következő pontot a legutolsó 63.x fejezet tartalmazza.

### 63.38. A 396 funkció-ID kanonikus F0–F11 fázis-keresztmegfeleltetése

Ez a mátrix a 24. fejezet stabil ID-jait köti a 41.2/63.5 roadmaphez. **Fázis-hozzárendelés nem készültségi státusz és nem implementációs engedély.** A korai fázisokban csak az ott szükséges core szelet készül; a későbbi funkciók a saját domainjükben megmaradnak. Ha egy ID több fázist érint, az ID-n belüli acceptance-et bontani kell, nem szabad az egész funkciót előrehozni.

| Funkció-ID | Kanonikus fázis | Határ / függőség |
|---|---|---|
| ADM-001, ADM-003, ADM-008–010 | F1 | Közös Admin shell, route/UX és shared state; nem domain-adatgazda. |
| ADM-002, ADM-004–007, ADM-011–013 | F1 alap + az adatforrás tulajdonosának fázisa | Csak olyan kártya jelenjen meg, amelynek canonical source, permission és freshness contractja létezik. |
| WEB-001, WEB-004–008 | F0 core workflow; bővített CMS F3 | F0-ban save/reload/preview/publish/revision megbízhatóság; nav/SEO/CMS kiterjesztés csak F3-ban. |
| WEB-002–003, WEB-009–014, WEB-018–024, WEB-028–032 | F3 | URL/nav/page lifecycle, form, public states, SEO/security és renderer; a F0 core mentési/publikálási contractjára épül. |
| WEB-015 | F3 shell + F5 live provider data | Live page shell korábban készülhet, de valós adat csak LIV/INT capability után. |
| WEB-016 | F0 meglévő schedule stabilitás + F3 public UX | A canonical SCH-010 projection marad egyetlen adatforrás. |
| WEB-017, WEB-025–027 | F3 shell + F7/F8 owning domain | Content route a CNT-020-re, store/member routes a STO/SUP/ENTITLEMENT-re épülnek; nem épülnek másolatként WEB-ben. |
| EDT-001–038, EDT-041–042, EDT-044 | F0 core Editor; közös shell elemek F1 | Page Model/commands/canvas/layers/Inspector/save/history/preview/publish; az existing v2 megőrzése és hibáinak lezárása. |
| EDT-039–040 | F0 schema/accessible baseline + F3 teljes page interaction/motion UX | EDT-039 nem AUT-004; csak page-local allowlisted interaction. Reduced motion keresztmetszeti acceptance. |
| EDT-043 | F3, külön rich-text gate | A jelenlegi structured schema megőrzendő, de a full Rich Text UX a plain-text/core workflow stabilizálása után. |
| DSN-001–018 | F2; DSN-018 F11 marketplace | Token/template/component registry és versioning; site scope döntés F11 előtt. |
| RES-001–002 | F0 minimális stabil asset reference/storage | Csak a core Editor/public flowhoz szükséges minimum, ne épüljön párhuzamos asset store. |
| RES-003–016 | F2; RES-016 a STO/ENTITLEMENT F8 capabilitytől is függ | Teljes asset registry, processing, usage map, safe deletion and paid/private access. |
| INT-001–010, INT-019–020 | F5, a Twitch meglévő alap F0-ban megőrzendő | Provider adapter/health/scope/token/security; a működő Twitch OAuth nem íródik újra. |
| INT-011 | F5 + F6 live/stream surfaces | Normalized live state külön LIV domainben. |
| INT-012–018 | F5; INT-017 security acceptance keresztmetszeti | Providerenként capability/permission/legal gate; nem minden provider ígérhető egyidejűleg. |
| INT-021 | F5 adapter contract; valódi payment/email használat F8/F1 notification dependency szerint | Provider lifecycle contract nem azonos Store vagy Notification workflowval. |
| LIV-001–007 | F5 live integration + F6 Stream Studio UX | Normalized state, freshness, player/blocks, dashboard and public read projection. |
| LIV-008–010 | F6; retention/cost/security gates keresztmetszetiek | Multistream, unified chat, recording/replay csak provider-supported capabilityvel. |
| OBS-001–010 | F6 | Pairing/commands/overlay/widget; RESOURCE és INT connectorok után. |
| SCH-001 | F0 meglévő CRUD stabilitás + F3 bővített lifecycle | A jelenlegi canonical schedule_items megőrzendő. |
| SCH-002–006, SCH-009, SCH-012–015 | F3 | Calendar, timezone/recurrence/conflict, game profile and export; DST correctness is release gate. |
| SCH-007–008 | F5 | Twitch sync/provider error/retry, manual override contract. |
| SCH-010–011 | F0 projection integrity + F3 public/Editor block parity | Egyetlen canonical projection; no duplicate event rows in Page Model. |
| CNT-001–022 | F7 | Content schema/library/publishing/editing/rights; uses RESOURCE/INT and analytics later. |
| COM-001–020 | F8 | Community and fan identity distinct from creator Admin identity; entitlement from SUP. |
| STO-001–021, SUP-001–012 | F8, STO-014/019/021 before real transaction | Product/order/support/entitlement; provider, tax, VAT, legal and consumer-rights gates. |
| ANL-001–010, CAM-001–009, AUT-001–014 | F9 | Event taxonomy, campaigns and automation are separate domains; workflow triggers are not analytics measurements. |
| AI-001–021 | F10 | Must use F0/F1 canonical permission/command/approval/logging foundations; no direct domain writes. |
| SEC-001–011 | Cross-cutting F0–F11 | Security and privacy gates apply to every feature; no late-only security phase. |
| SEC-012 | F4/F11 staged | MFA/recovery for creator accounts and later SSO; don't enable open registration before isolation/recovery tests. |
| OPS-001–004, OPS-007–011 | Cross-cutting F0–F11 | Health, migrations, logs, alerts, performance, dependency, background-job/realtime runtime selection and incident readiness in each release; choose a job runtime only when a justified feature needs it. |
| OPS-005–006, QA-007 | F0 minimum operational recovery + F11 expanded portability | Real restore/rollback drill required; QA-007 verifies it but does not implement it. |
| QA-001–006, QA-008–010 | Cross-cutting each F release | Relevant tests, runtime smoke and user acceptance before each phase closes. |
| LOC-001–002 | Cross-cutting from F0/F1 | Hungarian-first UI, locale-safe date/time/currency from the start. |
| LOC-003–005 | F3 public-site localization | Localized page/content/navigation/SEO and publish completeness. |
| LOC-006 | F10 AI-assisted flow + F3/F11 localization | Draft-only AI translation, human approval and audit. |
| SET-001, SET-003 | F0 legacy settings stability + F1 contract | Public-safe projection; site-scope migration only after consumer audit. |
| SET-002 | F1 ownership contract + F11 full multi-site | Every new endpoint must already use scope; full workspace model later. |
| SET-004 | F3 custom-domain/public canonical URL | DNS/SSL verification, redirect and canonical metadata. |
| DYN-001–008, SEO-001–005 | F3 | Domain read APIs and Page Model baseline first; public renderer/HTTP/crawler acceptance required. |
| TEAM-001–005 | F4 account/workspace foundation, F11 full multi-site/agency | Basic identity/onboarding precedes agency/client workflows; SEC-003 isolation blocks release. |
| TEAM-006–007 | F11 | SaaS billing/quota and agency/studio workflows. |
| SEARCH-001–005 | F1 base navigation/command palette; per-domain index adapters staged with F3/F5/F7/F8/F9 | Derived index only, permission-aware, deletion propagated; don't index unavailable domains as if complete. |
| NTF-001–005 | F1 shared UX contract; channel adapters staged with F5/F7/F8/F9 | Notification state/delivery separate from dashboard and automation. |
| HELP-001–004 | F1 core onboarding/help entrypoint; domain-specific articles follow module delivery | Help references canonical feature IDs and never claims unavailable capabilities. |
| DEV-001–006, MKT-001–005 | F11 | Developer/extension/marketplace trust boundary, license/security and legal gate. |

**Konzisztencia-korlát:** a fázis-hozzárendelés a funkció katalógus minden ID-ját lefedi csoportos vagy egyedi sorral; a tényleges végrehajtás előtt a 25/26. fejezet szerinti kártyán belül meg kell jelölni a pontos al-fázist, blokkoló dependency-t, acceptance-t és bizonyítékot. A táblázat nem állítja, hogy a jelenlegi repo a későbbi fázisokat megvalósítja.

**Státusz: IN PROGRESS / NOT PASS.** Az ID-unikalitás, csoportlefedettség és aktív pont statikus ellenőrzését a 63.39 rögzíti; a végső checklist és feature-card mezőellenőrzés még nyitott. Az aktuális következő pontot a legutolsó 63.x fejezet tartalmazza.

### 63.39. Statikus tervkonzisztencia-ellenőrzés — eredmény és maradó blokkolók

A kanonikus terv legutóbbi GitHub-változatán végzett statikus szöveg-/azonosító-ellenőrzés eredménye:

| Ellenőrzés | Eredmény | Jelentés |
|---|---|---|
| 24. fejezet stabil funkció-ID-k | **396 / 396 egyedi** | Nincs duplikált ID a 24. fejezet jegyzékében. |
| 49. fejezet főmoduljai | **22 / 22** | 49.1–49.22 folyamatos, duplikáció nélkül. |
| 54. fejezet review checklist | **156 tétel** | A 63.12–63.15 mátrixokban **156 / 156** tételhez tartozik megfeleltetési sor. |
| 54. checklist ID-hivatkozások | **nincs feloldatlan hivatkozás** | A korábbi 63.16 ellenőrzés szerint a mapping ID-k a 24. fejezetben léteznek. |
| 24. fejezet ID-k → 63.38 fázis-mátrix | **396 / 396 lefedve** | Az ellenőrzés először két hiányt talált: WEB-019 és OPS-011; a 63.38 táblázat javítva lett, majd az ellenőrzés mind a 396 ID-t lefedettnek találta. |
| Főfejezetek számozása | **64 főfejezet, duplikált szám nélkül** | A főfejezet-címek egyediek. |
| 63. alfejezetek számozása az akkori ellenőrzéskor | **39 alfejezet, duplikált ID nélkül** | Ez történeti pillanatkép; az újabb 63.40+ szakaszok később kerültek hozzá. |
| Aktív tervpont | **egy kanonikus azonosító** | A fő aktív pont minden irányadó helyen PLAN-CAPABILITY-COMPLETENESS-AND-CONSISTENCY; F0 nincs aktívként megjelölve. |

**Mit nem bizonyít ez az ellenőrzés:** nem igazolja a 396 funkció teljes szemantikai specifikációját, az egyes dependency-k technikai helyességét, a teljes történeti források egyeztetését, a valódi böngészős/Worker runtime viselkedést vagy bármelyik funkció PASS állapotát. A 63.38 csoportos fázis-hozzárendelést ad; a 25/26. fejezet szerinti, minden ID-ra kiterjedő kártya mezőszintű kitöltése továbbra sincs kész. A funkciókártyákban külön meg kell adni a pontos al-fázist, blokkoló függőségeket, permission/scope, API/schema, pozitív és negatív teszteket, rollbacket és bizonyítékot.

**Aktuális aktív pont:** PLAN-CAPABILITY-COMPLETENESS-AND-CONSISTENCY.

**Állapot: IN PROGRESS / NOT PASS.** A 63.40 gépi lefedettségi auditja megállapította, hogy a 396/396 ID-s mátrix nem helyettesíti a 26.1 szerinti teljes funkciókártyát. Az EDT-001–044 első bővített kártyavázlatai a 63.41–63.46 fejezetben elkészültek; a 63.47 mezőminőségi audit szerint még nem teljesítik a 25. fejezet minden státuszmezőjét és a 26.1 minden külön mezőjét. Következő lépés: a 44 EDT-kártya teljes mezőnormalizálása, utána azonos eljárás a WEB ID-kkal. Ez dokumentációs munka, nem implementációindítás. A végső PASS csak a teljes történeti és szemantikai audit, a funkciókártya-kapu és a 63.1–63.3 feltételek bizonyítása után adható meg.

### 63.40. Funkciókártya-mezők gépi lefedettségi auditja — 396 ID, 2026-10-14 (történeti pillanatkép)

**Hatókör:** 24. fejezet stabil ID-jegyzéke, 25. fejezet státuszmezői, 26.1 funkciókártya-szerződése és 63.26–63.37 egyedi-ID-s mátrixai. Ez statikus dokumentumellenőrzés, nem kódteszt, runtime- vagy szemantikai PASS.

| Ellenőrzés | Eredmény | Helyes értelmezés |
|---|---:|---|
| Egyedi ID a 24. fejezetben | 396/396 | Stabil azonosító nincs duplikálva. |
| ID szerepel egyedi-ID-s bizonyítékmátrixban | 396/396 | Minden ID-hoz van legalább egy mátrixsor nyitott acceptance-szel vagy kódbizonyítékkal. |
| 26.1 szerinti önálló, teljes kártya az ellenőrzés időpontjában | 0/396 bizonyított | A későbbi 63.49–63.50 már tartalmaz részletes EDT-007 és EDT-008 kártyát; ez a sor korábbi pillanatkép, nem a jelenlegi teljeskártya-darabszám. |
| Státuszmezők ID-nként | NEM LEZÁRT | Status, Phase/priority, Permission, Dependencies, Tests, Negative tests, Live/user acceptance, Evidence, Known issues és Next action nem szerepel egységes, strukturált mezőként minden ID-nál. |
| Funkciószerződés mezői ID-nként | NEM LEZÁRT | Felhasználói eredmény, belépési pont, műveletek, domain owner, adatforrás/séma, API/command, UI-állapotok, security/privacy, teszt, E2E acceptance, evidence, rollback és next action kitöltése hátra van. |

**Következtetés:** a korábbi „396/396 lefedve” ID- és mátrix-/fázislefedettséget jelentett, nem 396 kész implementációs kártyát. Nem szabad üres sablonokat késznek jelölni: tényt kód-/tesztbizonyítékkal, hiányzó adatot explicit UNVERIFIED / OPEN / DECISION REQUIRED jelzéssel kell vezetni. A **termékscope lezárása** és az **adott funkció aktiválásához szükséges teljes kártya** külön kapu a 63.21 szerint. A jelenlegi aktív ellenőrzés nem egy évekig tartó, előzetes 396-kártyás adminisztrációs követelmény; a meglévő EDT-kártya-szeletek a B kapu felhasználható alapjai.

### 63.41. Funkciókártya-pilot — EDT-001–006

Az alábbi rövidített kártyák mindegyike név szerint lefedi a 26.1 kötelező mezőit. A „részleges alap” nem PASS. A forrásfájlok vizsgálata megtörtént, de ebben a dokumentációs lépésben tesztet és runtime-ot nem futtattam.

#### EDT-001 — Verziózott Page Model / document schema
- **Felhasználói eredmény:** az oldal stabil, verziózott modellben szerkeszthető és újratölthető.
- **Belépési pont / műveletek:** Editor v2 document lifecycle; létrehozás, validálás, mentés és reload.
- **Kanonikus owner / adatforrás:** EDITOR / public/editor-v2/core/schema.js, src/core/page-model.ts és canonical page/revision API; a teljes API→schema round-trip nyitott.
- **Séma / invariánsok:** sanci-page-document, schemaVersion=1, page/node ID, root, parent/children; schema migration és backward compatibility nyitott.
- **Jogosultság:** authenticated page API + site ownership; cross-site negatív teszt szükséges.
- **API/command:** Page Model + canonical command/state; request/response és DB mapping nincs teljesen lezárva.
- **Függőségek:** SITE/IDENTITY/SEC, EDT-002/003/027–032, WEB-004–008.
- **UI-állapotok:** loading/new/valid-invalid/saving/conflict/error/reload; teljes acceptance nyitott.
- **Biztonság/adatvédelem:** schema allowlist, malformed/oversized document rejection, site scope; méretlimit nyitott.
- **Tesztcsomag:** public/editor-v2/tests/core.test.js és page-model kapcsolódó tesztek; migration/API round-trip nem bizonyított.
- **Elfogadás:** valid dokumentum módosítása → save → reload → azonos modell; unsupported schema/invalid root elutasítása adatvesztés nélkül.
- **Bizonyíték:** schema.js, page-model.ts, core.test.js; CI/run link nincs rögzítve.
- **Visszaállítás:** revision restore/snapshot alap létezik; schema migration rollback nyitott.
- **Státusz / ismert probléma / következő lépés:** IN PROGRESS / UNVERIFIED; persistence round-trip és schema compatibility bizonyítása szükséges.

#### EDT-002 — Page Model hierarchia és szerkezeti invariánsok
- **Felhasználói eredmény:** a canvas/layer tree csak érvényes node-hierarchiát hoz létre.
- **Belépési pont / műveletek:** Editor v2 schema/validation/commands; add, move, group/ungroup, duplicate, delete.
- **Kanonikus owner / adatforrás:** EDITOR / public/editor-v2/core/schema.js, validation.js, commands.js; rootId/nodes/parentId/children.
- **Séma / invariánsok:** egy root; root parent nélkül; minden más node-nak parent; child-parent egyezés; nincs cycle/orphan/hiányzó child; container type rule.
- **Jogosultság:** a domain invariant nem helyettesíti a szerveroldali auth/site ownershipet.
- **API/command:** validateHierarchy, assertValidEditorDocument, canContain és canonical commands; minden server save/publish útvonalon való lefedettség nyitott.
- **Függőségek:** EDT-001/003/004/008/011–013/016/028–034.
- **UI-állapotok:** invalid drop/reparent/group, locked node, empty container, validation error.
- **Biztonság/adatvédelem:** malformed nested data, cycle és túl mély hierarchia; resource-limit és server parity nyitott.
- **Tesztcsomag:** public/editor-v2/tests/core.test.js; teljes negatív mátrix nem bizonyított.
- **Elfogadás:** nested műveletek → save/reload → invariánsok megmaradnak; cycle/orphan/invalid parent esetén rollback és olvasható hiba.
- **Bizonyíték:** schema.js, validation.js, commands.js, core.test.js; külön CI/runtime evidence nincs rögzítve.
- **Visszaállítás:** command snapshot/undo/atomic transaction alap; minden UI failure rollback nyitott.
- **Státusz / ismert probléma / következő lépés:** IN PROGRESS / UNVERIFIED; negatív invariáns- és API-boundary tesztek szükségesek.

#### EDT-003 — Canonical command-only mutation
- **Felhasználói eredmény:** minden módosítás validált, követhető és visszavonható úton történik.
- **Belépési pont / műveletek:** Editor v2 UI → public/editor-v2/core/commands.js; add/update/delete/duplicate/reparent/reorder/lock.
- **Kanonikus owner / adatforrás:** EDITOR / canonical state + Page Model; nincs második UI dokumentummodell.
- **Séma / invariánsok:** command payload validation, minden mutáció commandon át, document validation/history/dirty consistency.
- **Jogosultság:** a command engine nem auth boundary; backend save/publish saját scope gate-et igényel.
- **API/command:** execute(state, action), commands registry; az összes UI write-path lefedettsége nyitott.
- **Függőségek:** EDT-001/002/004–006/027–031.
- **UI-állapotok:** invalid action, locked/unsupported target, batch failure, dirty/saved/error és undo/redo.
- **Biztonság/adatvédelem:** nincs direct mutation validation/history megkerülésével; tiltott ID/parent/children patch elutasítandó.
- **Tesztcsomag:** core.test.js; teljes UI handler→command coverage nyitott.
- **Elfogadás:** UI-módosítás → command → valid modell → undo → redo → save/reload egyezés.
- **Bizonyíték:** commands.js commit/execute és assertValidEditorDocument; minden handler runtime lefedettsége nincs rögzítve.
- **Visszaállítás:** undo/redo és snapshot; command failure state-egyezés tesztelendő.
- **Státusz / ismert probléma / következő lépés:** IN PROGRESS / UNVERIFIED; direct mutation keresés és teljes UI coverage.

#### EDT-004 — Atomic batch és history transaction
- **Felhasználói eredmény:** összetett szerkesztés egy visszavonható egység, hibánál meghatározott rollbackkel.
- **Belépési pont / műveletek:** Editor v2 composite actions; executeBatch, beginTransaction, commitTransaction, rollbackTransaction.
- **Kanonikus owner / adatforrás:** EDITOR / state.history és Page Model snapshot.
- **Séma / invariánsok:** explicit atomic/non-atomic policy; nested transaction tiltása; atomic failure visszaállítja document/selection/history/persistence state-et.
- **Jogosultság:** lokális tranzakció nem jogosultsági boundary; backend write külön auth/version gate.
- **API/command:** executeBatch(actions,{label,atomic}) és transaction API; minden összetett UI action policy-ja nyitott.
- **Függőségek:** EDT-001–003/005–006/011/038.
- **UI-állapotok:** progress/success/rolled-back/error; nagy batch és megszakítás tesztelendő.
- **Biztonság/adatvédelem:** atomic hiba után nincs észrevétlen részállapot; batch resource limit nyitott.
- **Tesztcsomag:** core.test.js atomic/non-atomic transaction tesztekkel; composite UI workflow coverage nyitott.
- **Elfogadás:** több parancs egy history entry; középső hiba atomic módban teljes rollbacket ad.
- **Bizonyíték:** commands.js executeBatch/transaction implementáció; CI/UI evidence nincs rögzítve.
- **Visszaállítás:** rollbackTransaction és atomic snapshot; interruption/nested edge case nyitott.
- **Státusz / ismert probléma / következő lépés:** IN PROGRESS / UNVERIFIED; minden composite UI művelet policy-ja tesztelendő.

#### EDT-005 — Undo/redo history
- **Felhasználói eredmény:** szerkesztési művelet visszavonható és újraalkalmazható.
- **Belépési pont / műveletek:** Editor v2 history controls/keyboard shortcuts; history.undo/history.redo.
- **Kanonikus owner / adatforrás:** EDITOR / state.history, Page Model snapshot és selection snapshot.
- **Séma / invariánsok:** before/after document + selection; history limit jelenleg 100; új mutation üríti a redo ágat; undo/redo dirty state-et állít.
- **Jogosultság:** lokális history nem helyettesíti a backend save/publish authorizationt vagy revision concurrencyt.
- **API/command:** history.undo/history.redo; toolbar/keyboard paritás nyitott.
- **Függőségek:** EDT-001–004/006/027–031.
- **UI-állapotok:** empty history, undo/redo, unsaved changes, conflict, save/reload history policy.
- **Biztonság/adatvédelem:** history nem keveredhet más page/site adataival; memória/érzékeny snapshot policy nyitott.
- **Tesztcsomag:** core.test.js history/selection round-trip alap; limit/nagy dokumentum/failure/UI coverage nyitott.
- **Elfogadás:** edit→undo→eredeti modell+selection→redo→módosított modell; új mutation törli a redo ágat.
- **Bizonyíték:** state.js, commands.js, core.test.js; CI/run link nincs rögzítve.
- **Visszaállítás:** local undo/redo; szerveroldali rollback külön revision restore.
- **Státusz / ismert probléma / következő lépés:** IN PROGRESS / UNVERIFIED; UI/keyboard parity, memory limit és save/reload policy.

#### EDT-006 — Selection state és fókuszszinkron
- **Felhasználói eredmény:** canvas, layer tree és Inspector ugyanazt a node-ot vagy node-halmazt mutatja.
- **Belépési pont / műveletek:** canvas pointer/touch, layer tree, Inspector, keyboard; set/clear/multi-select/delete recovery.
- **Kanonikus owner / adatforrás:** EDITOR / state.selection (ids, primaryId), selectedNodes(); UI csak ezt fogyasztja.
- **Séma / invariánsok:** selected ID aktív Page Model node-ra mutat; primaryId a selection része; delete/undo/redo után nincs stale selection.
- **Jogosultság:** selection UI-state, nem authorization; page/site permission a backendnél marad.
- **API/command:** selection.set/clear, setSelection/clearSelection; minden UI event routing ugyanazt a state-et használja.
- **Függőségek:** EDT-001–005/008/012–014/035–038.
- **UI-állapotok:** none/single/multiple, stale node, keyboard focus, mobile action bar, panel switch, Escape.
- **Biztonság/adatvédelem:** csak aktuális Page Model node választható; UI selection nem jogosít hozzáférésre.
- **Tesztcsomag:** core.test.js selection/history restore alap; canvas/layer/Inspector/touch/keyboard E2E nincs bizonyítva.
- **Elfogadás:** canvas selection → layer/Inspector egyezés → delete/undo helyes recovery → Escape/blank canvas clear.
- **Bizonyíték:** state.js, commands.js, app.js, core.test.js; browser/device E2E evidence nincs rögzítve.
- **Visszaállítás:** history selection snapshot; törölt node-ra mutató selection és panel state recovery tesztelendő.
- **Státusz / ismert probléma / következő lépés:** IN PROGRESS / UNVERIFIED; teljes canvas↔layer↔Inspector, keyboard/touch E2E.

**Pilot-kapu:** a hat kártya mezőlefedettségét statikusan ellenőriztem; a 63.42 az EDT-007–014 következő szeletét rögzíti. Ez nem jelenti az EDT modul vagy a teljes terv PASS állapotát.

### 63.42. Funkciókártyák — EDT-007–014 (canvas, drag/resize, hierarchy, layers, selection, lock)

**Forrásalap:** public/editor-v2/app.js, core/canvas-engine.js, core/canvas-extent.js, core/commands.js, core/state.js és tests/core.test.js. A forrásban lévő logika és unit teszt nem bizonyítja a teljes browser/device acceptance-t. Minden kártya a 26.1 kötelező mezőit tartalmazza.

#### EDT-007 — Canvas viewport, zoom, pan és content extent
- **Felhasználói eredmény:** az oldal nagyítása, mozgatása és teljes tartalmának áttekintése kényelmesen használható.
- **Belépési pont / műveletek:** Editor canvas viewport; zoom/pan/fit és content extent frissítés.
- **Kanonikus owner / adatforrás:** EDITOR / viewport state, app.js és core/canvas-extent.js; dokumentumtartalom a Page Modelből jön.
- **Séma / invariánsok:** pozitív, véges zoom; canvas extent a tartalom alsó határát és paddinget figyelembe veszi.
- **Jogosultság:** csak authenticated Editor/page context; viewport nem ad hozzáférést más oldalhoz.
- **API/command:** lokális viewport state és computeCanvasMinHeight; fit/pan/zoom teljes interaction contract nyitott.
- **Függőségek:** EDT-001/006/025/035–036.
- **UI-állapotok:** initial viewport, zoomed, panning, empty/tall page, viewport resize, mobile safe-area.
- **Biztonság/adatvédelem:** nincs külön domain adat; extrém zoom/extent és túl nagy dokumentum resource limitje nyitott.
- **Tesztcsomag:** core.test.js canvas extent tesztet tartalmaz; browser zoom/pan/resize és touch acceptance nincs bizonyítva.
- **Elfogadás:** rövid és hosszú oldalon zoom/pan/fit → viewport resize → tartalom nem válik elérhetetlenné, a canvas és selection helyes marad.
- **Bizonyíték:** app.js, canvas-extent.js, canvas-engine.js, core.test.js; CI/browser run nincs ehhez a kártyához rögzítve.
- **Visszaállítás:** viewport reset/fit; viewport state mentésének policy-ja nyitott.
- **Státusz / ismert probléma / következő lépés:** IN PROGRESS / UNVERIFIED; keyboard, touch és valódi mobil viewport teszt.

#### EDT-008 — Canvas drag/drop mozgatás
- **Felhasználói eredmény:** az elem közvetlenül a canvasról pozicionálható.
- **Belépési pont / műveletek:** canvas pointer handlers; select tool, drag, pointer capture és position command.
- **Kanonikus owner / adatforrás:** EDITOR / Page Model node style + command engine.
- **Séma / invariánsok:** root és locked node nem mozgatható; koordináták a zoomhoz igazodnak; csak érvényes node/parent szerkezet menthető.
- **Jogosultság:** backend page/site ownership változatlanul kötelező.
- **API/command:** UI drag state → canonical update command; a teljes drag minden útvonalon command-only-e, auditálandó.
- **Függőségek:** EDT-001–007/009/013/014/023–026/028.
- **UI-állapotok:** idle/dragging/cancelled/locked/invalid target/saving/conflict.
- **Biztonság/adatvédelem:** malformed coordinates, pointer cancellation és invalid target nem okozhat sérült modellt.
- **Tesztcsomag:** core.test.js reparent/reorder teszteket tartalmaz; pointer drag E2E, touch cancel és save round-trip nem bizonyított.
- **Elfogadás:** elem mozgatása különböző zoomnál → pointer cancel és locked elem ellenőrzése → save/reload → ugyanaz a helyzet és modell.
- **Bizonyíték:** app.js canvas drag handlers, canvas-engine.js, commands.js; browser/device run nincs rögzítve.
- **Visszaállítás:** history undo/redo; félbeszakadt drag nem hagyhat részleges mutationt.
- **Státusz / ismert probléma / következő lépés:** IN PROGRESS / UNVERIFIED; drag/pointer/touch és keyboard alternatíva acceptance.

#### EDT-009 — Geometry és resize
- **Felhasználói eredmény:** az elem mérete és pozíciója kiszámíthatóan módosítható.
- **Belépési pont / műveletek:** canvas resize handles és Inspector geometry controls.
- **Kanonikus owner / adatforrás:** EDITOR / node style, responsive resolver és command engine.
- **Séma / invariánsok:** véges X/Y/width/height; pozitív méret; aspect ratio és min/max constraint kezelése még nem teljesen bizonyított.
- **Jogosultság:** page/site ownership a mentési API-ban.
- **API/command:** geometry update a canonical commandon keresztül; minden resize handler command coverage nyitott.
- **Függőségek:** EDT-001/003/007–008/021–026/034.
- **UI-állapotok:** resize start/move/end/cancel, invalid value, responsive override, save conflict.
- **Biztonság/adatvédelem:** extrém vagy NaN/Infinity méretet el kell utasítani; overflow/resource-limit acceptance nyitott.
- **Tesztcsomag:** geometry UI tesztje nem bizonyított; schema/command tesztek csak részleges alapot adnak.
- **Elfogadás:** resize több viewporton → min/max és aspect ratio szabály → undo/redo → save/reload → public renderer parity.
- **Bizonyíték:** app.js, canvas-engine.js, responsive.js, commands.js; külön E2E evidence nincs rögzítve.
- **Visszaállítás:** history snapshot és undo; invalid resize atomic rejection tesztelendő.
- **Státusz / ismert probléma / következő lépés:** IN PROGRESS / UNVERIFIED; min/max schema, keyboard resize és renderer parity.

#### EDT-010 — Alignment guides, snap és grid
- **Felhasználói eredmény:** az elemek egymáshoz és a layout-rácshoz pontosan igazíthatók.
- **Belépési pont / műveletek:** canvas drag/geometry interaction; grid toggle, snap és alignment guide.
- **Kanonikus owner / adatforrás:** EDITOR / canvas interaction state; a teljes snap/grid funkció a vizsgált forrásban nem bizonyított.
- **Séma / invariánsok:** snap threshold, grid spacing, zoomtól független viselkedés és guide priority explicit szabályt igényel.
- **Jogosultság:** Editor/page permission.
- **API/command:** viewport/editor preference + geometry command; a preference persistence és parancsszerződés nyitott.
- **Függőségek:** EDT-007–009/021–025/044.
- **UI-állapotok:** snap on/off, guide visible/hidden, grid on/off, keyboard alternative.
- **Biztonság/adatvédelem:** nincs külön domain adat; nagy node számnál teljesítménybudget szükséges.
- **Tesztcsomag:** dedikált snap/grid acceptance nem található a vizsgált core tesztben.
- **Elfogadás:** snap/grid kapcsolás → drag/resize több zoomnál → guide helyesség → billentyűzetes alternatíva → save/reload.
- **Bizonyíték:** jelenleg csak a canvas geometry alap; teljes implementációs bizonyíték hiányzik.
- **Visszaállítás:** geometry undo/redo; grid preference reset.
- **Státusz / ismert probléma / következő lépés:** OPEN / UNVERIFIED; pontos UX/spec és implementációs döntés szükséges.

#### EDT-011 — Hierarchy operations: duplicate, delete, reorder, reparent
- **Felhasználói eredmény:** az elemek és teljes al-fáik biztonságosan átrendezhetők, másolhatók és törölhetők.
- **Belépési pont / műveletek:** layer tree/canvas context actions; duplicate, delete, reorder, reparent.
- **Kanonikus owner / adatforrás:** EDITOR / commands.js Page Model node tree.
- **Séma / invariánsok:** duplicate minden subtree ID-t újraoszt; root nem törölhető/reparentelhető; cycle és invalid container tiltott.
- **Jogosultság:** UI command nem jogosít backend adatokra; page/site scope mentéskor kötelező.
- **API/command:** element.duplicate/delete, hierarchy.reorder/reparent; UI action coverage és destructive confirmation nyitott.
- **Függőségek:** EDT-001–006/008/012–014/028–031.
- **UI-állapotok:** valid/invalid target, locked/root, delete confirm, undo/redo, save conflict.
- **Biztonság/adatvédelem:** subtree törlés, hivatkozott assetek és invalid nested model; usage map és safe delete külön nyitott.
- **Tesztcsomag:** core.test.js reparent/reorder/duplicate teszteket tartalmaz; UI confirmation és full subtree edge matrix nincs bizonyítva.
- **Elfogadás:** subtree duplicate új ID-kkel → reorder/reparent → delete → undo/redo → save/reload és invariáns ellenőrzés.
- **Bizonyíték:** commands.js és core.test.js; browser/E2E evidence nincs rögzítve.
- **Visszaállítás:** undo/redo snapshot; törlés utáni external asset cleanup nem történhet ellenőrizetlenül.
- **Státusz / ismert probléma / következő lépés:** IN PROGRESS / UNVERIFIED; UI coverage, confirm, lock/cycle/asset-reference edge cases.

#### EDT-012 — Layer tree és hierarchianavigáció
- **Felhasználói eredmény:** a felhasználó áttekintheti a nested elemeket és kiválaszthatja a megfelelő réteget.
- **Belépési pont / műveletek:** Editor v2 layer panel; expand/collapse, select, reorder és reparent.
- **Kanonikus owner / adatforrás:** EDITOR / Page Model tree + canonical selection state.
- **Séma / invariánsok:** a layer tree a nodes/children szerkezet vetülete; nem tarthat saját, eltérő hierarchiát.
- **Jogosultság:** az aktív page/site scope-on belüli node-ok.
- **API/command:** selection.set és hierarchy commands; expand/collapse preference per-user persistence nyitott.
- **Függőségek:** EDT-001–006/011/013/014/035–036/044.
- **UI-állapotok:** empty/deep tree, expanded/collapsed, selected/locked, mobile panel switch.
- **Biztonság/adatvédelem:** mély/nagy hierarchia teljesítmény- és keyboard-accessibility korlátai nyitottak.
- **Tesztcsomag:** külön layer-tree browser acceptance nem bizonyított; core hierarchia teszt nem igazolja a panel UX-et.
- **Elfogadás:** nested tree → canvas selection sync → reorder/reparent → collapse/reopen → undo/reload és tree consistency.
- **Bizonyíték:** app.js layer rendering/commands; külön E2E run nincs rögzítve.
- **Visszaállítás:** document history; tree expand state reset/persistence policy nyitott.
- **Státusz / ismert probléma / következő lépés:** IN PROGRESS / UNVERIFIED; deep hierarchy, keyboard/touch és expand-state acceptance.

#### EDT-013 — Canvas, layers és Inspector selection sync
- **Felhasználói eredmény:** minden szerkesztői felület ugyanazt a kiválasztott elemet vagy csoportot kezeli.
- **Belépési pont / műveletek:** canvas selection, layer tree, Inspector, keyboard/multi-select.
- **Kanonikus owner / adatforrás:** EDITOR / state.selection ids + primaryId; selectedNodes() vetület.
- **Séma / invariánsok:** primary selection a kijelölt ID-k közé tartozik; törölt node nem marad kijelölve; aktív page váltáskor nincs cross-page stale ID.
- **Jogosultság:** selection nem authorization; a backend page/site scope változatlan.
- **API/command:** selection.set/clear és setSelection; minden event path közös state-et használjon.
- **Függőségek:** EDT-001/006/008/012/014/035–038.
- **UI-állapotok:** none/single/multiple, stale selection, keyboard focus, mobile multi-select, panel switch.
- **Biztonság/adatvédelem:** csak az aktív Page Model node-jai; cross-page selection tiltása.
- **Tesztcsomag:** core.test.js state/history selection alap; panel/canvas/touch/keyboard E2E nincs bizonyítva.
- **Elfogadás:** canvas → layer → Inspector ugyanazt jelzi; delete/undo, page switch és Escape után state konzisztens.
- **Bizonyíték:** state.js, app.js, commands.js, core.test.js; device/browser run nincs rögzítve.
- **Visszaállítás:** selection snapshot az undo/redo historyban; stale ID-k tisztítása tesztelendő.
- **Státusz / ismert probléma / következő lépés:** IN PROGRESS / UNVERIFIED; teljes selection/focus E2E.

#### EDT-014 — Lock/unlock és layer visibility
- **Felhasználói eredmény:** egy réteg szerkesztése letiltható, illetve szükség esetén elrejthető.
- **Belépési pont / műveletek:** Inspector lock checkbox és layer controls; lock/unlock, hide/show.
- **Kanonikus owner / adatforrás:** EDITOR / node.locked és Page Model visibility property; a visibility toggle a vizsgált v2-ben nem bizonyított.
- **Séma / invariánsok:** locked node drag/update/reparent/group/ungroup szabálya explicit; visibility állapotnak a preview és public renderer felé is konzisztensnek kell lennie.
- **Jogosultság:** lock csak szerkesztési UX-szabály, nem hozzáférés-védelem.
- **API/command:** element.lock.set létezik; hide/show command/property és renderer parity nincs igazolva.
- **Függőségek:** EDT-001–003/008/011–013/021–026/034.
- **UI-állapotok:** locked/unlocked, hidden/visible, disabled action, group/root edge case.
- **Biztonság/adatvédelem:** locked állapot nem helyettesítheti a backend permissiont; rejtett tartalom public output policy-ja külön rögzítendő.
- **Tesztcsomag:** core.test.js locked-node acceptance teljes mátrixa nem bizonyított; public renderer visibility test hiányzó/ellenőrizendő.
- **Elfogadás:** lock → tiltott mozgatás/módosítás → unlock → működés; hide/show esetén preview és public output egyezése, mentés/reload után is.
- **Bizonyíték:** commands.js element.lock.set és app.js Inspector; visibility implementációs bizonyíték nincs rögzítve.
- **Visszaállítás:** lock/visibility command undo/redo; hidden state publish/rollback policy nyitott.
- **Státusz / ismert probléma / következő lépés:** IN PROGRESS / UNVERIFIED; locked interaction matrix és visibility feature döntés/megvalósítás.

**Szeletzárás:** EDT-007–014 mindegyikéhez kitöltöttem a kártyamezőket, de a forráskód-olvasás nem helyettesíti a böngészős acceptance-t. Következő lépés: a 63.42 kártyák mező- és függőségkonzisztenciájának gépi ellenőrzése; csak ezután jöhet EDT-015–020.

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
- **API/command:** editor POST publish validál; pages create isPublished=true útvonal nem hívja validatePublishDocumentet; expectedVersion editor/rollback útvonalon opcionális.
- **Függőségek:** EDT-027–032, WEB-004/006–008/012/031, SEC/OPS.
- **UI-állapotok:** draft/published/dirty/draft-ahead, validation failure, conflict, unpublish confirm, rollback confirmation.
- **Biztonság/adatvédelem:** invalid Page Model nem kerülhet publikus snapshotba; create/publish bypass és race condition szerveroldalon blokkolandó.
- **Tesztcsomag:** editor-validation és core.test.js publish validator tests; API entrypoint matrix, invalid create publish és concurrency negatív tesztek nyitottak.
- **Elfogadás:** invalid draft minden publish entrypointon elutasítva → valid draft publish → public snapshot ellenőrzés → unpublish → rollback új revision → public state egyezés.
- **Bizonyíték:** admin/editor.ts, admin/pages.ts, editor-validation.ts, core.test.js; teljes endpoint E2E evidence nincs.
- **Visszaállítás:** published revision snapshot, unpublish és rollback-as-new-revision; minden művelet audit eventtel.
- **Státusz / ismert probléma / következő lépés:** BLOCKED / NOT PASS; publish validation minden entrypointra, required expectedVersion és API race tests.

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

### 63.51. Végső terv használati rendje — egyetlen MASTER, nincs második audit-roadmap

**Ez a rész a korábbi 63.x auditnapló egészének aktuális értelmezése; nem második terv és nem új funkciókatalógus.**

1. **Mit tekintünk egyetlen irányadó helynek?** Termékvízió: 1.; felhasználói főmodul és menü: 49.; domain és adatgazda: 5. és 63.20; funkció-ID és név: 24.; feature contract: 10., 25.–26. és az ID egyedi mátrixa (63.26–63.37); teljes review checklist: 54.; F0–F11 sorrend: 41.2 és 63.38; aktuális munka: a dokumentum fejlécében szereplő egyetlen aktív pont. Az archívum nem alternatív irányító dokumentum.
2. **Mit jelent az „elkészült terv”?** Végleges, teljes termékscope és stabil modul-/adatgazda-határok; minden megőrzendő követelmény megtalálható az ID-katalógusban vagy önálló, indokolt nyitott tételként. Ez **nem** jelenti a teljes Creator Platform elkészültét, a provider-hozzáférések létét, sem 396 futó feature PASS-át.
3. **Miért nem gyártunk 396 feltételezett API-kártyát most?** A fázisok későbbi technikai döntései (SaaS, AI, marketplace, fizetés, provider-permission) csak az adott munka aktiválásakor, a friss kód/externális feltételek alapján specifikálhatók pontosan. A termékcél, acceptance-feltétel, domain-owner, sorrend és dependency addig is kötelezően megmarad a MASTER-ben. A részletes 17 mezős kártyát nem lehet megkerülni: **egyenként, a tényleges implementáció előtt** kerül teljesítésre.
4. **Felhasználói működés:** logikus, feladatközpontú Admin-modulok; a Visual Editor kizárólag oldal-megjelenítést és összerakást szerkeszt, az Integrations/Brand Kit/Assets/Schedule/Content/OBS/Commerce/Analytics/Automation/AI saját domainje egyetlen adatforrásként működik. Ugyanaz a domain több nézetből vezérelhető, de a változás minden felületen ugyanarra a kanonikus állapotra hat.
5. **Technikai döntés:** mindig aktuális repo, migráció, route, teszt és production evidence alapján döntünk: előbb REUSE, szükség esetén ADAPT, BUILD csak igazolt hiányra; nincs második Visual Editor, második media registry, második schedule CRUD, rejtett AI write, vagy önkényes DB-domén tulajdonosváltás.
6. **Minőségi és kockázati korlát:** ownership/auth, revision/concurrency, hibás hálózat, undo/rollback, accessibility, mobil, i18n, privacy/security, deployment/restore, provider limits és költség csak releváns, igazolt acceptance-tel PASS. A dokumentációs ellenőrzés soha nem futtatott teszt.
7. **Nyitott blokkoló:** a történeti forrásmegfeleltetés (különösen a korábban jelzett 00/A és 00.9–00.9.6.B hiány) **nincs ebben a jelenlegi MASTER-ben forrásonként bizonyítva**; visszanyerés vagy explicit nem-visszanyerhető, hatáskörrel és megőrzési döntéssel rögzített átvezetés szükséges. Nem tekintjük automatikusan lezártnak attól, hogy 396 aktuális ID létezik. Emellett a 63.1–63.2 szemantikai konfliktusai és a felhasználóval történő végső funkció-review nyitott.
8. **Jelenlegi egyetlen aktív pont:** `PLAN-CAPABILITY-COMPLETENESS-AND-CONSISTENCY` — `IN PROGRESS / NOT PASS`. **Következő ellenőrizhető lépés:** a történeti források és a jelenlegi 396 ID megőrzését bizonyító nyitott tételek konkrét kezelése, majd az 54./49./24. fejezetek szemantikai egyeztetése; **csak** a tervkapu lezárása után az F0 következő legkorábbi hiányának kódbizonyítékos végrehajtása. A meglévő EDT-009-től folytatható kártya-normalizálás az F0 munkaindításakor végezhető, nem helyettesíti a mostani A kaput.

**Megőrzési szabály:** a 396 stabil ID-ból egyetlen funkciót sem töröltünk vagy nyilvánítottunk késznek ebben a szerkezeti tisztázásban. A 63.41–63.50 meglévő kártyái történeti részletes evidenciaként megtartandók. A későbbi felhasználói döntés az adott kanonikus fejezetben frissül, és csak ott; a régebbi auditnapló változatlan bizonyítékláncként olvasható.

### 63.52. Történeti megőrzés, első tételes szelet — H19–H22 → Creator Platform ID

**Forrás:** archivált `docs/archive/MASTER-DEVELOPMENT-PLAN-2026-10-13.md` (2026-10-13), H19–H22 történeti ledger (a korábbi `aedb2ea` revízióból készített kivonat alapján). Ez **bizonyítékforrás**, nem második aktív terv. A forrást nem szabad automatikusan felülírni vagy elveszettként megjelölni; az eredeti 00/A és 00.9.6.B ettől még külön nyitott. Az alábbi sorok a meglévő 396 stabil ID alá sorolják a 79 történeti tételt, tulajdonosi átfedésnél több ID-val. **Nem állítják, hogy a funkció implementált vagy az eredeti forrás szemantikája minden részletében ellenőrzött.**

| Történeti ID | Megőrzendő eredeti képesség | Jelenlegi kanonikus ID(k) |
|---|---|---|
| H19.01 | upload | RES-003, RES-001, RES-002 |
| H19.02 | folders | RES-006 |
| H19.03 | search | RES-005 |
| H19.04 | filter | RES-005 |
| H19.05 | preview | RES-004 |
| H19.06 | metadata | RES-007 |
| H19.07 | alt text | RES-007 |
| H19.08 | crop | RES-004 |
| H19.09 | resize | RES-004 |
| H19.10 | replace | RES-009 |
| H19.11 | archive/delete | RES-009 |
| H19.12 | usage tracking | RES-008 |
| H19.13 | unused media detection | RES-008, RES-015 |
| H19.14 | MIME validation | RES-003 |
| H19.15 | file-size limits | RES-003 |
| H19.16 | secure object keys | RES-002, RES-014, SEC-008 |
| H19.17 | image optimization | RES-004 |
| H19.18 | video/audio | RES-002, RES-004 |
| H19.19 | clip/Short assets | RES-001, CNT-003 |
| H19.20 | cache policy | RES-004, DYN-006, WEB-030 |
| H20.01 | D1 binding | DYN-001, DYN-002 |
| H20.02 | site settings | DYN-001, SET-001 |
| H20.03 | schedule | DYN-001, SCH-010, SCH-011 |
| H20.04 | Twitch | DYN-001, INT-011, LIV-001 |
| H20.05 | YouTube | DYN-001, INT-013 |
| H20.06 | TikTok | DYN-001, INT-014 |
| H20.07 | Discord | DYN-001, INT-015 |
| H20.08 | VOD | DYN-001, CNT-020 |
| H20.09 | collections | DYN-001, CNT-005 |
| H20.10 | API data source | DYN-001, DYN-002 |
| H20.11 | loading state | DYN-005 |
| H20.12 | empty state | DYN-005 |
| H20.13 | error state | DYN-005 |
| H20.14 | conditional rendering | DYN-004 |
| H20.15 | data transforms | DYN-003 |
| H20.16 | caching | DYN-006 |
| H20.17 | stale-data handling | DYN-005, DYN-006 |
| H20.18 | binding validation | DYN-002, DYN-008 |
| H21.01 | Twitch OAuth | INT-010, INT-003 |
| H21.02 | Twitch live/offline | INT-011, LIV-001 |
| H21.03 | Twitch title | LIV-003 |
| H21.04 | Twitch game | LIV-003 |
| H21.05 | Twitch viewer statistics | LIV-004 |
| H21.06 | Twitch followers/subscribers where available | LIV-004 |
| H21.07 | Twitch VOD | INT-012, CNT-002 |
| H21.08 | Twitch clips | INT-012, CNT-003 |
| H21.09 | Twitch events/webhooks where applicable | INT-017, LIV-006 |
| H21.10 | YouTube channel | INT-013 |
| H21.11 | YouTube videos | INT-013, CNT-004 |
| H21.12 | YouTube Shorts | INT-013, CNT-003 |
| H21.13 | YouTube statistics where available | INT-013, ANL-004, ANL-001 |
| H21.14 | YouTube API quota/error handling | INT-009, INT-020 |
| H21.15 | TikTok profile | INT-014 |
| H21.16 | TikTok supported content integration | INT-014, CNT-004 |
| H21.17 | TikTok API capability review | INT-014, INT-018 |
| H21.18 | TikTok rate limits/fallback | INT-009, INT-014 |
| H21.19 | Discord community link | INT-015, WEB-019 |
| H21.20 | Discord optional integration | INT-015 |
| H21.21 | Discord status where justified | INT-015, INT-020 |
| H21.22 | Architecture constraint: keep secrets in Cloudflare Secrets; normalize external APIs behind services | INT-019, INT-001, SEC-008 |
| H22.01 | schedule CRUD | SCH-001 |
| H22.02 | recurring schedule | SCH-004 |
| H22.03 | timezone handling | SCH-003 |
| H22.04 | next-stream calculation | SCH-009 |
| H22.05 | countdown | SCH-009 |
| H22.06 | live state | LIV-001, SCH-005 |
| H22.07 | game/category | SCH-012, SCH-014 |
| H22.08 | stream type | SCH-001, SCH-005 |
| H22.09 | VOD ingestion | CNT-002 |
| H22.10 | VOD categorization | CNT-005 |
| H22.11 | VOD search/filter | CNT-006 |
| H22.12 | Shorts management | CNT-003 |
| H22.13 | clips management | CNT-003 |
| H22.14 | content calendar | CNT-009 |
| H22.15 | platform-specific variants | CNT-011 |
| H22.16 | title/description/hashtag suggestions | CNT-010, CNT-011, AI-013 |
| H22.17 | thumbnail brief | CNT-012, CNT-010 |
| H22.18 | publishing workflow | CNT-013, CNT-014 |
| H22.19 | performance feedback loop | ANL-004, CNT-016, ANL-001 |

**Tételes ellenőrzés:** H19: 20/20, H20: 18/18, H21: 22/22, H22: 19/19; összesen **79/79 forrássorhoz van legalább egy létező 24. fejezetbeli ID**. A tételek nem kerültek törlésre vagy implicit PASS-ra. Ahol a mapping több domainbe mutat (például H19.19 asset/content; H20.03 data binding/schedule; H22.16 content brief/AI), **csak a saját üzleti adatgazda végezhet módosítást**; a másik ID integráció vagy megjelenítés, nem második adatmodell.

**Nyitott elfogadás:** forrásonkénti szemantikai visszaellenőrzés, konkrét domain/API/test és állapot; H23–H34 tételes átvezetése; 00/A és 00.9–00.9.6.B felkutatása, vagy igazolt hiányuk és a megfelelő no-loss döntések rögzítése. **Következő audit-szelet: H23–H34**, a 63.21 A kapujához kapcsolódóan. A terv lezárási státusza változatlanul IN PROGRESS / NOT PASS.


### 63.52.1. H19–H22 cél-ID szemantikai javításai — ellenőrzött első hibaköteg

A 63.52-ben az eredeti történeti címkéket a 24. fejezet **tényleges capability-definícióival** összevetve öt pontatlan célleképezést korrigáltunk, az eredeti H-ID-k és szövegek megőrzésével:

| Történeti sor | Probléma | Javított értelmezés | Kockázat / további bizonyíték |
| --- | --- | --- | --- |
| H19.16 | `SEC-009` webhook signature/replay policy, nem R2 objektumkulcs-kezelés | `RES-002` R2/D1, `RES-014` download auth/expiry, `SEC-008` secret policy | R2 object key path, site-scope, nem publikus letöltés negatív tesztje még szükséges |
| H21.13 | `ANL-001` csak mérési taxonómia, nem platform analytics | `INT-013` YouTube adapter + `ANL-004` platform analytics, `ANL-001` mérési definíció | Provider quota/availability és metrikaforrás még ellenőrizendő |
| H21.22 | `SEC-009` webhook-biztonság, nem secret storage | `INT-019` integrációs redaction + `INT-001` adapter + `SEC-008` secret lifecycle | Cloudflare Secrets deployment/runtime ellenőrzés nyitott |
| H22.16 | `AI-014` transcript/clip-javaslat, nem cím/leírás/hashtag | `CNT-010` brief + `CNT-011` platformváltozat + `AI-013` szövegjavaslat | Hashtag policy, emberi review és célplatform-korlátok nyitottak |
| H22.19 | `ANL-001` taxonomy nem önmagában teljesítmény-visszacsatolás | `ANL-004` tartalom/platform metrikák + `CNT-016` attribúció + `ANL-001` mérési definíció | Dashboard/action feedback loop és freshness tesztje nyitott |

**Auditmódszer:** itt a történeti sor szövege és a 24. fejezet cél-ID leírása közötti **szemantikai célillesztést** javítottuk, nem futó implementációt vagy API-szerződést bizonyítottunk. A 79/79 H19–H22 strukturális lefedés megmaradt. A további H19–H22 és H23–H34 sorok mélyebb review-ja, valamint a hiányzó 00/A és 00.9.6.B forrás továbbra is nyitott. **IN PROGRESS / NOT PASS.**

### 63.53. Történeti megőrzés, második tételes szelet — H23–H34 → Creator Platform ID

**Bizonyítékforrás:** `docs/archive/MASTER-DEVELOPMENT-PLAN-2026-10-13.md`, H23–H34 history ledger (korábbi `aedb2ea` történeti kivonatból). A kód-/runtime-készültség nem vizsgálata ennek a táblának. Egy korábbi tétel több ID-hoz rendelése nem engedélyez második domain-adatgazdát. **H34.01–H34.22 a folyamatos módszertani és minőségi követelmények része, nem ígéret arra, hogy minden új benchmark funkció automatikusan megvalósul.** A H31/H32 jövőbeli AI-képességeket a megfelelő AI/Content/Live modul őrzi meg, nem 1.0 kötelezettségként.

| Történeti ID | Eredeti megőrzendő képesség / szabály | Jelenlegi kanonikus ID(k) |
|---|---|---|
| H23.01 | event model | EDT-039 |
| H23.02 | click | EDT-039 |
| H23.03 | hover | EDT-039 |
| H23.04 | focus | EDT-039, EDT-037 |
| H23.05 | active | EDT-039 |
| H23.06 | submit | EDT-039, EDT-019 |
| H23.07 | scroll | EDT-039 |
| H23.08 | load | EDT-039 |
| H23.09 | timer | EDT-039 |
| H23.10 | open/close | EDT-039 |
| H23.11 | navigation | EDT-039, WEB-009 |
| H23.12 | show/hide | EDT-039 |
| H23.13 | toggle | EDT-039 |
| H23.14 | state machine | EDT-039 |
| H23.15 | transition | EDT-040 |
| H23.16 | animation timeline | EDT-040 |
| H23.17 | keyframes | EDT-040 |
| H23.18 | reduced-motion | EDT-040, QA-005 |
| H23.19 | interaction validation | EDT-039, EDT-022 |
| H23.20 | performance safeguards | OPS-008, QA-004 |
| H24.01 | semantic HTML | WEB-032, QA-005 |
| H24.02 | heading hierarchy | EDT-017, QA-005 |
| H24.03 | alt text | RES-007, QA-005 |
| H24.04 | labels | EDT-019, QA-005 |
| H24.05 | ARIA | QA-005, EDT-037 |
| H24.06 | keyboard navigation | EDT-037, QA-004 |
| H24.07 | focus order | EDT-037, QA-005 |
| H24.08 | focus visibility | EDT-037, QA-005 |
| H24.09 | contrast warnings | DSN-002, QA-005 |
| H24.10 | screen-reader metadata | WEB-032, QA-005 |
| H24.11 | form validation accessibility | EDT-019, QA-005 |
| H24.12 | editor accessibility checks | EDT-022, EDT-037 |
| H24.13 | public accessibility audit | QA-005, QA-009 |
| H25.01 | title | SEO-001 |
| H25.02 | description | SEO-001 |
| H25.03 | canonical | SEO-001, SET-004 |
| H25.04 | Open Graph | SEO-002 |
| H25.05 | X/Twitter card | SEO-002 |
| H25.06 | structured data | SEO-003 |
| H25.07 | sitemap | SEO-004 |
| H25.08 | robots | SEO-004 |
| H25.09 | per-page SEO | SEO-001 |
| H25.10 | SEO preview | SEO-005 |
| H25.11 | redirects | WEB-013 |
| H25.12 | broken-link detection | WEB-013, SEO-005 |
| H26.01 | page views | ANL-001, ANL-002 |
| H26.02 | button clicks | ANL-001, ANL-002 |
| H26.03 | social clicks | ANL-001, ANL-002 |
| H26.04 | stream events | ANL-001, ANL-003 |
| H26.05 | conversion events | ANL-001, ANL-005 |
| H26.06 | privacy-aware analytics | ANL-002, ANL-009 |
| H26.07 | retention policy | ANL-009, SEC-011 |
| H26.08 | admin dashboard | ANL-007, ADM-002 |
| H26.09 | editor/content performance | ANL-004 |
| H26.10 | content performance | ANL-004 |
| H26.11 | stream performance | ANL-003 |
| H26.12 | anomaly detection later | ANL-010 |
| H27.01 | dashboard | ADM-001, ADM-002 |
| H27.02 | navigation | ADM-001 |
| H27.03 | responsive admin | ADM-010 |
| H27.04 | diagnostics | OPS-007, ADM-004 |
| H27.05 | page list | WEB-001 |
| H27.06 | content management | CNT-001, CNT-006 |
| H27.07 | schedule | SCH-001 |
| H27.08 | socials | INT-002, ADM-003 |
| H27.09 | VOD | CNT-002 |
| H27.10 | media | RES-001 |
| H27.11 | settings | SET-001 |
| H27.12 | SEO | SEO-005 |
| H27.13 | analytics | ANL-007 |
| H27.14 | integrations | INT-002 |
| H27.15 | editor management | EDT-001, WEB-001 |
| H27.16 | preview | EDT-032, WEB-005 |
| H27.17 | recovery | EDT-042, OPS-005 |
| H27.18 | history | WEB-008, EDT-005 |
| H27.19 | permissions | SEC-002, ADM-009 |
| H28.01 | HttpOnly | SEC-001 |
| H28.02 | Secure cookie | SEC-001 |
| H28.03 | SameSite | SEC-001 |
| H28.04 | password hash | SEC-001 |
| H28.05 | CSRF | SEC-004 |
| H28.06 | rate limiting | SEC-007 |
| H28.07 | RBAC | SEC-002 |
| H28.08 | API authorization | SEC-002, SEC-003 |
| H28.09 | public/admin separation | SEC-002, WEB-031 |
| H28.10 | Cloudflare Secrets | SEC-008 |
| H28.11 | audit log | SEC-010 |
| H28.12 | input validation | SEC-006, SEC-005 |
| H28.13 | output validation | SEC-005 |
| H28.14 | file validation | RES-003, SEC-006 |
| H28.15 | replay protection where applicable | SEC-009 |
| H28.16 | action permission 'can()' checks | SEC-002, AUT-004 |
| H28.17 | AI permission boundary | AI-006, AI-019 |
| H29.01 | full backup | OPS-005 |
| H29.02 | page backup | OPS-005, WEB-007 |
| H29.03 | revision backup | OPS-005, WEB-008 |
| H29.04 | media references | OPS-005, RES-008 |
| H29.05 | restore validation | OPS-006, QA-007 |
| H29.06 | rollback | OPS-009, QA-007 |
| H29.07 | import/export JSON | OPS-005 |
| H29.08 | migration compatibility | OPS-004 |
| H29.09 | backup integrity check | OPS-005, QA-007 |
| H29.10 | recovery drill | OPS-006, QA-007 |
| H30.01 | bundle review | OPS-008 |
| H30.02 | lazy loading | OPS-008, WEB-032 |
| H30.03 | image optimization | RES-004 |
| H30.04 | caching | WEB-030, OPS-008 |
| H30.05 | cache invalidation | WEB-030, DYN-006 |
| H30.06 | Core Web Vitals | OPS-008, QA-005 |
| H30.07 | rendering performance | OPS-008, QA-004 |
| H30.08 | large-page performance | OPS-008, QA-004 |
| H30.09 | large-tree editor performance | OPS-008, EDT-012 |
| H30.10 | history memory limits | EDT-005, OPS-008 |
| H30.11 | autosave efficiency | EDT-030, OPS-008 |
| H30.12 | API latency monitoring | OPS-008 |
| H30.13 | production smoke test | QA-006 |
| H30.14 | visual regression baseline | QA-004 |
| H31.00 | AI editor must use the same canonical action system as manual Editor; pipeline: Intent -> Plan -> Actions -> Permission -> Validation -> Preview/Diff -> Approval -> Execute -> Verify -> Audit -> Version | AI-003, AI-005, AI-006, AI-007, AI-008, AI-009 |
| H31.01 | AI page operations | AI-011 |
| H31.02 | AI element operations | AI-011, AI-008 |
| H31.03 | AI style/layout operations | AI-011, AI-008 |
| H31.04 | AI responsive operations | AI-011, EDT-024 |
| H31.05 | AI content generation | AI-011, AI-013 |
| H31.06 | AI SEO assistance | AI-012 |
| H31.07 | AI accessibility QA | AI-012 |
| H31.08 | AI visual QA | AI-012, QA-004 |
| H31.09 | action permissions | AI-006 |
| H31.10 | approval rules | AI-007, AI-019 |
| H31.11 | rollback | AI-009 |
| H31.12 | audit | AI-009, SEC-010 |
| H31.13 | rate/cost controls | AI-010 |
| H32.01 | live stream monitoring | AI-015 |
| H32.02 | silence/speech detection | AI-015 |
| H32.03 | chat activity analysis | AI-015 |
| H32.04 | technical issue detection | AI-015 |
| H32.05 | audio problem detection | AI-015 |
| H32.06 | stream quality checks | AI-015 |
| H32.07 | scene suggestions | AI-015, OBS-003 |
| H32.08 | context-aware ideas | AI-015, AI-013 |
| H32.09 | interesting moment detection | AI-014, AI-015 |
| H32.10 | post-stream summary | AI-015 |
| H32.11 | VOD analysis | AI-014, CNT-018 |
| H32.12 | clip candidates | AI-014 |
| H32.13 | Short candidates | AI-014, CNT-003 |
| H32.14 | title/description suggestions | AI-013 |
| H32.15 | platform variants | AI-013, CNT-011 |
| H32.16 | thumbnail briefs | AI-013 |
| H32.17 | publishing recommendations | AI-013, CNT-013 |
| H32.18 | content performance analysis | ANL-004, AI-004, AI-013 |
| H32.19 | streamer profile | AI-004 |
| H32.20 | long-term memory | AI-004 |
| H32.21 | preferences | AI-004 |
| H32.22 | historical outcomes | AI-004, ANL-007 |
| H32.23 | experiment tracking | AI-002, ANL-007 |
| H32.24 | evaluation cycle | AI-002 |
| H32.25 | feedback loop | AI-002, AI-017 |
| H33.00 | Automation lifecycle contract: Trigger -> Condition -> Action -> Result -> Verify -> Audit | AUT-001, AUT-002, AUT-003, AUT-004, AUT-008 |
| H33.01 | scheduled automations | AUT-005 |
| H33.02 | event automations | AUT-001, AUT-002 |
| H33.03 | content workflows | AUT-014, CNT-013 |
| H33.04 | media workflows | AUT-014, RES-001 |
| H33.05 | stream workflows | AUT-014, LIV-006 |
| H33.06 | notification workflows | AUT-014, NTF-004 |
| H33.07 | retry policy | AUT-007 |
| H33.08 | idempotency | AUT-006 |
| H33.09 | failure handling | AUT-007, AUT-012 |
| H33.10 | permissions | AUT-004, SEC-002 |
| H33.11 | audit | AUT-008, SEC-010 |
| H33.12 | Queues/Durable Objects only when justified by a real background-task or realtime requirement | OPS-011 |
| H34.00 | Continuous feature discovery is never permanently closed; repeat the review before every significant Editor/platform extension | QA-010 |
| H34.01 | modern visual builder minták; | QA-010, EDT-021 |
| H34.02 | GrapesJS / Craft.js / Puck architekturális minták; | QA-010, OPS-010 |
| H34.03 | új responsive/layout megoldások; | EDT-023, EDT-026, QA-010 |
| H34.04 | accessibility; | QA-005, QA-010 |
| H34.05 | performance; | OPS-008, QA-010 |
| H34.06 | reusable components; | DSN-012, QA-010 |
| H34.07 | design systems; | DSN-001, QA-010 |
| H34.08 | collaboration/conflict; | TEAM-004, EDT-029, QA-010 |
| H34.09 | backup/recovery; | OPS-005, QA-007 |
| H34.10 | AI action safety; | AI-018, QA-010 |
| H34.11 | stream/content intelligence. | AI-015, QA-010 |
| H34.12 | azonosítás; | QA-010 |
| H34.13 | cél és felhasználási eset; | QA-010 |
| H34.14 | függőségek; | QA-010 |
| H34.15 | Page Model/adatmodell; | EDT-001, QA-010 |
| H34.16 | Command/Action; | EDT-003, QA-010 |
| H34.17 | Inspector/Canvas/UI; | EDT-021, QA-010 |
| H34.18 | persistence; | EDT-028, QA-010 |
| H34.19 | teszt; | QA-001, QA-002 |
| H34.20 | MASTER-be felvétel; | QA-010 |
| H34.21 | implementáció; | DEV-001, QA-002, QA-008 |
| H34.22 | felhasználói validáció. | QA-009 |

**Strukturális ellenőrzés:** a H23–H34 forrásjegyzékből az itt rögzített **192/192 egyedi történeti ID** mindegyikéhez legalább egy létező 24. fejezetbeli cél-ID tartozik. A 63.52 H19–H22 79 tételével együtt **271/271 történeti H19–H34 ID** tételes célja létezik. Ez **strukturális megfeleltetés és no-loss alap**, nem forrásonként validált szemantikai teljesülés, nem kódteszt, nem provider capability, és nem bizonyítja a hiányzó 00/A vagy 00.9–00.9.6.B fejezet tartalmát.

**Kötelező szemantikai review:** (1) az egyes több-ID-s sorok valódi domain ownerének megerősítése; (2) a korábban külön kiemelt részképességek (különösen keyboard/reduced motion, SEO/indexing, AI approval/audit, backup/restore, automation lifecycle és continuous discovery) egyedi negatív acceptance-ének ellenőrzése; (3) a régi forrásjelölések és új fázisok közötti döntések rögzítése; (4) a külön nyitott 00/A / 00.9.6.B forráshiány kezelése. **Állapot: IN PROGRESS / NOT PASS**; a termék- és kód-készültség nem változott automatikusan.

### 63.53.1. H23–H34 cél-ID szemantikai javítások és nyitott képességhiányok

A 63.53 sorait a 24. fejezet stabil definícióival összevetve az alábbi **három cél-ID pontatlanságot** javítottuk. A történeti sorok és az összes eredeti H-ID megmaradt:

| Sor | Probléma | Javított besorolás | Nyitott bizonyíték |
| --- | --- | --- | --- |
| H28.14 | `SEC-005` XSS/sanitization/embeds; a fájlvalidálás támadási felülete inkább `SEC-006` injection defense és `RES-003` MIME/size validation | `RES-003, SEC-006` | magic-byte ellenőrzés, karantén, vírusvizsgálati döntés, rosszindulatú fájl negatív tesztje |
| H32.18 | `AI-015` stream diagnostics/summary, nem tartalomteljesítmény-elemzés | `ANL-004` tartalommetrika, `AI-004` adatvédett kontextus, `AI-013` tartalomjavaslat | magyarázható insight, metrika-frissesség, AI-hallucináció és jogosultság tesztje |
| H34.21 | kizárólag QA-tesztekhez rendelt „implementáció” nem fedi le a fejlesztői/API lifecycle kapcsolódását | `DEV-001` verziózott API-contract + `QA-002/008` ellenőrzés | konkrét feature domain owner és implementációs work item továbbra is egyedileg kijelölendő |

**További, bizonyíték nélkül nem zárható szemantikai rések:**
- `H32.02–H32.06` valós idejű silence/speech, chat-aktivitás, audio/stream quality monitorozás: az `AI-015` általános diagnosztikai leírása nem bizonyítja a bemeneti jelcsatornákat, audiohozzáférést, latency-t, adatmegőrzést és platformjogosultságot. A cél-ID megőrzött, de a képességenkénti technikai megvalósíthatóság **OPEN**.
- `H34.12–H34.22` feature discovery → implementáció → felhasználói validáció: a `QA-010` folyamatgazda és `QA-002/008/009` tesztkapu **nem helyettesíti** az új képesség tényleges domain ownerét, fázisát, API-ját és release-evidence-ét.
- `H23.18` reduced-motion és `H24.06–H24.08` billentyűzet/fókusz: külön accessibility acceptance szükséges az Editor és a publikus nézet számára; a `QA-005` audit nem implementáció.
- `H29.01–H29.10`: az `OPS-005` backup/restore és `QA-007` tesztkapu külön felelősség; nincs recovery-PASS tényleges visszaállítási próba nélkül.
- `H25.01–H25.12`: canonical/redirect/sitemap/indexing pozitív és negatív tesztek, staging/noindex és locale URL-korlátok külön vizsgálandók.

A 192/192 H23–H34 sor **strukturális megfeleltetése** megmaradt. A három javítás nem teljes történeti szemantikai PASS; a hiányzó 00/A és 00.9.6.B forrás továbbra is **SOURCE NOT RECOVERED / OPEN**. A kapu **IN PROGRESS / NOT PASS**.

### 63.54. Történeti forrás-visszakeresési bizonyíték és lezáratlan hiány — 2026-10-14

**Konkrét GitHub-vizsgálat ebben a dokumentációs körben:**
- A `docs/MASTER-DEVELOPMENT-PLAN.md` fájl `aedb2ea` refjén ellenőrzött, **1338 soros** állományában nem fordult elő a szó szerinti `00/A` vagy `00.9.6.B` jelölés. Ez **csak ezt a refet** zárja ki a megnevezett cím forrásaként; nem bizonyítja, hogy a követelmény nem létezett más revízióban vagy más dokumentumban.
- A `docs/archive/MASTER-DEVELOPMENT-PLAN-2026-10-13.md` archivált MASTER tartalmazza a H19–H34 követelmény-ledgert; annak 271 egyedi H-ID-ját a 63.52–63.53 a jelenlegi stabil ID-khez rendeli. Az archívumban ugyanakkor a `00/A` és `00.9.6.B` jelölések **hivatkozásként/nyitott feladatként** szerepelnek, nem bizonyított teljes eredeti fejezetként.
- A `docs/archive/plans/` nyolc meglévő tervfájljának, továbbá a `docs/ARCHIVE-LEGACY-LAYERS.md` és `docs/SANCI-CONTINUOUS-CONTEXT.md` fájl szó szerinti címkeresése nem adott találatot ezekre a jelölésekre. A negatív szövegkeresés nem egyenértékű a teljes Git-előzmény, törölt fájlok, PR-threadek és minden történeti szövegváltozat vizsgálatával.

**Rögzített döntés:** `00/A` és `00.9–00.9.6.B` állapota **SOURCE NOT RECOVERED / OPEN**. Nem találunk ki eredeti szöveget, nem mondjuk ki a C-ről, hogy automatikusan lefedi a B-t, és nem nyilvánítunk minden történeti követelményt szemantikailag egyeztetettnek. A H19–H34 ténylegesen hozzáférhető 271 tételét megőrizzük a jelenlegi kanonikus ID-k alatt, míg a hiányzó forrás célzott Git-előzmény/PR/törölt-útvonal vizsgálata folytatható.

**Tervhasználati következmény:** a termék 396 ID-s scope-ja és a 22 főmodul szerinti felépítése egyetlen dokumentumban rendelkezésre áll; a dokumentum **még nem minősül teljesen bizonyított, hibamentes történeti/specifikációs PASS-nak**. Az A kapu nyitott, F0 nem nyílt meg. Következő aktív ellenőrizhető alpont: a történeti 00/A és 00.9.6.B forrás nyitott állapotának lezárási döntése, valamint a 271 mapping célzott szemantikai eltéréseinek ellenőrzése; csak utána közös funkciólista-review és F0 gate.
