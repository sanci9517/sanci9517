# SANCI9517 — publikus weboldal: kreatív brief, dizájnrendszer és teljes tartalomterv

**Dokumentum típusa:** belső, végrehajtható creator-webhely brief; NEM második platform-MASTER.  
**Verzió:** 1.0 (tervezés) • **Dátum:** 2026-11-09 • **Státusz:** DESIGN SPEC / NOT IMPLEMENTED.  
**Repository / ág:** sanci9517/sanci9517 → v2/foundation.  
**Kanonikus termékterv:** docs/SANCI9517-CREATOR-PLATFORM-PLAN.md.  
**Végrehajtási szabály:** AGENTS.md; ez a brief nem írhatja felül a MASTER-t, a release-gate-eket, a Save/Publish szétválasztását vagy a domainadatok tulajdonosát.  
**Költség:** 0 Ft új költés; bármely fizetős komponenshez előzetes tulajdonosi döntés kell.  
**Feladat:** SANCI9517 saját nyilvános, egyedi, többoldalas streamer/creator márkawebhelyének professzionális kialakítása a meglévő Editor v2 és a kanonikus publikus renderer felhasználásával. **Nem** a Creator Platform általános marketing-weboldala és **nem** egyetlen hosszú „Rólam” oldal.

> A dokumentumban a tervezett szövegek publikálható copy-tervezetek, de a külső csatornaadatokat, személyes tényeket, együttműködéseket, élő státuszt és konkrét adásidőpontokat ellenőrzés nélkül nem szabad tényként publikálni.

---

## 1. Döntés: az oldal identitása

**Márkanév:** SANCI9517. Rövid megszólítás: Sanci. A név vizuális használata konzisztens; a 9517 nem apró lábjegyzet.  
**Pozicionálás:** magyar gaming streamer és digitális creator; Fortnite-fókusz, Hearthstone-tanulás, indie/roguelike felfedezés; valódi, közvetlen közösség.  
**Első látogatói kérdés:** „Élőben van? Ha nem, mit nézhetek most? Hol csatlakozhatok?” Az első képernyő ezekre válaszoljon.  
**Márkaígéret:** szórakoztató játék, őszinte reakciók, együtt fejlődés, élő közösségi élmény. Ne állítsunk „Magyarország legnagyobb...” jellegű, alá nem támasztott szuperlatívuszt.  
**Vezérszöveg (javaslat):** „A játék itt kezdődik. A legjobb pillanatok együtt születnek.”  
**Rövid tagline:** „JÁTÉK. PILLANATOK. KÖZÖSSÉG.”  
**Tone of voice:** magyar, közvetlen, vidám, személyes és gamer, de nem infantilis; üzleti oldalon magabiztos, tényszerű. Kerülendő: corporate üresség, kamu követőszám, mesterséges szuperlatívusz, túl sok emoji, mém-viccek minden elemben.  
**Célközönség:** új néző, rendszeres néző, videót kereső, Discord-tag, márka/szponzor; minden persona 1–2 kattintással találja meg a saját célját.

### Elsődleges látogatói célok és sorrend

1. Aktuális adás vagy következő valós időpont megnyitása.
2. Friss minőségi videó, VOD, short vagy klip felfedezése.
3. Hivatalos Twitch/TikTok/YouTube/Kick csatornák elérése.
4. Közösséghez csatlakozás hivatalos, ellenőrzött Discord-meghívóval.
5. Sanci személyének, tartalmainak és kapcsolati lehetőségeinek megismerése.
6. Később merch, kampány, támogatás vagy együttműködés — kizárólag valóban működő funkcióval.

**Kritikus korrekció a korábbi próbához:** a főoldal nem hosszú életrajz. A teljes Rólam történet, felszerelés és FAQ a saját helyére kerül; a főoldal első képernyője live + legjobb néznivaló + közösségi CTA.

---

## 2. Ellenőrzött nemzetközi és magyar inspirációk (2026-11-09)

Csak tervezési megfigyelések, NEM automatikus másolási jogok. Az itt rögzített minták a megnyitott aktuális oldalak nyilvános elemeiből származnak; konkrét képet, logót, brand textet, HTML/CSS-t nem emelünk át.

| Referencia | Ellenőrzött oldal | Használható tanulság | Amit nem veszünk át |
|---|---|---|---|
| TheVR (HU) | https://thevr.hu/ | Világos streamer-identitás, a következő stream és a menetrend látható, tartalmi aloldalak külön (Végigjátszások/HH) | Saját logó, copy, ikonok és konkrét layout lemásolása |
| Zsozeatya (HU) | https://www.zsoze.hu/ | Karakteres személyes márkahang, menetrend, technikai setup, brandek, ajánlott videó, közösségi útvonal | Provokatív hangnem, nem saját számok/szponzorok, túl hosszú főoldal |
| Nessaj (HU) | https://www.forbes.hu/lists/top-creators-influenszerek-tartalomgyartok-lista-2026/nessaj/ | Több jól elkülönülő videós tematikát is lehet egyetlen creator-márka alatt rendszerezni | Ez harmadik fél profilja, nem a saját webhelye; vizuális website-elemzésre nem használható |
| TimTheTatman (US) | https://www.timthetatman.com/ | About, stream, merch, social és community egyetlen nagy márka alá szervezve; erős CTA | Tim tulajdonú assetek, merch-ígéretek |
| Ludwig / Mogul Moves (US) | https://ludwig.gg/ | Önálló, felismerhető creator-brand, minimalizált shop élmény; a platform nem helyettesíti a brandet | Shop-only főoldal: SANCI9517-nél az élő tartalom elsődleges |
| Pokimane (CA/US) | https://pokimane.com/ | Kampány-/drop-központú, kurált termékvitrin és vizuális termékszerkesztés | Kereskedelmi fókusz a meglévő, nem aktivált shop helyett |
| Valkyrae (US) | https://valkyrae.com/ | Szerkesztőségi módon válogatott termékek, erős vizuális identitás | Nem tesszük a termékeket a játékos élmény elé |
| Jacksepticeye / Top of the Mornin' | https://topofthemornincoffee.com/ | Emlékezetes szöveg, kampányhero, vizuális történetmesélés, termékek hierarchiája | Más termékfotója, weboldalának grafikája, állított eredménye |
 
**Összegzés:** a TheVR tartalmi logikája + Zsozeatya emberközeli karaktere + TimTheTatman community-first CTA-ja + nemzetközi brandek vizuális fegyelme. Nem tematikus klón: saját SANCI9517 „streaming command center” karakter szükséges.

**Benchmark ellenőrzési szempontok Worknek:** első 5 másodperces üzenet, live státusz, navigációs mélység, hero minőség, mobilkezdőképernyő, videók felfedezhetősége, üres állapotok, teljesítmény és konverziós útvonal. Referencia-implementációkat nem másolunk engedély nélkül.

---

## 3. Kreatív art direction — „SANCI SIGNAL”

### 3.1 Alapkarakter

**Világ:** prémium, filmes-gaming, sötét stúdióhatás; nem sablonos gamer neonerdő. Finom műszerfal-/broadcast-motívumok, rétegelt sötét felületek, fénycsíkok, visszafogott glow, editorial videókártyák. Nagy typográfia és tudatos üres tér, ritmikus változatosság.  
**Kulcsmotívum:** vékony, szegmenselt „signal line” — az adás/live pillanatok környékén életre kel, offline állapotban statikus.  
**Hős-vizuál:** saját, felhasználásra jogosított portré vagy a Sanci csatorna saját grafikája előnyben. Ennek hiányában eredeti, absztrakt, brandelt broadcast kompozíció; nem más streamer arca vagy véletlen stock-fotó.  
**Logó:** SANCI9517 tiszta wordmark; opcionális saját monogram terv. Ne állítsuk, hogy végleges logó/asset már rendelkezésre áll, amíg ellenőrizetlen.  
**Téma:** elsődlegesen dark; light/high-contrast opcionális későbbi fejlesztés, ahol a Brand Kit és renderer támogatja.

### 3.2 Javasolt paletta

| Szerep | HEX | Használat |
|---|---|---|
| Háttér alap | #090C13 | site background |
| Sötét másodlagos | #111724 | váltakozó szekciók |
| Card | #192131 | video / info cards |
| Erős szöveg | #F7F9FC | H1 / H2 / fő content |
| Másodlagos szöveg | #B7C3D6 | leírások |
| Signal cyan | #49D9F5 | elsődleges CTA, fókusz |
| Accent violet | #A88BFF | glow, kiegészítő badge |
| Live | #FF5269 | csak ténylegesen LIVE állapot / figyelmeztető külön szemantika |
| Border | #334155 | 1 px csendes elválasztás |

A színek **tervezési célértékek**, nem azt állítjuk, hogy minden fentit központi tokenként támogat a jelenlegi Brand Kit. A központilag létező tokenek: primary/text/surface/border, font/bodySize/headingSize/lineHeight, spacing, radius és árnyék; a többi csak validált page/node style vagy további kanonikus termékfejlesztés után kerülhet be. A light/dark különbeállítás megvalósítottságát ellenőrizni kell.

### 3.3 Tipográfia és mérhető ritmus

- Betűk: induláskor system-ui / Arial fallback; nem függünk külső fizetős fonttól. Egyedi display font csak igazolt szabad licenccel és kompatibilis fontkezeléssel.
- H1: desktop 64–84 px cél, tablet 48–64 px, mobil 38–48 px. H2: 40–52 / 34–42 / 28–34 px; törzsszöveg 17–18 / 17 / 16 px. Az Editor által ténylegesen elfogadott egységekre kell leképezni.
- Content max width: 1240–1320 px; nyugodt olvashatósághoz 62–72 karakter széles szövegoszlop.
- 12 oszlop desktop; 8 tablet; 4 mobil mint vizuális tervezési rács, nem feltételezett kész Grid preset.
- Space scale: 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 px. Hero és fontos szekciók között több tér, de ne legyen üres végtelen görgetés.
- Border radius: card 18–24 px, gomb 12–14 px; ne minden legyen egyforma.
- Használható képarányok: 16:9 videók, 9:16 shortok, 1:1 játék-kártyák; minőségi forrásképekkel.

### 3.4 Mozgás és interakció

- Finom hover emelkedés és fény; opcionális rövid 150–250 ms átmenet; scroll belépő animáció csak akkor, ha a valós Editor/runtime támogatja és a reduced-motion is biztosított.
- Tilos automatikus hang, autoplay videó, villódzó/nehezen olvasható effektek; tartalom ne legyen animáció nélkül elrejtve.
- Live pill: kizárólag hiteles aktuális státusz esetén piros; offline állapot semleges.
- Loading skeleton csak valós aszinkron kéréshez; a hiányzó tartalmat nem „szépen” hamisítjuk.

---

## 4. Globális navigáció és teljes információarchitektúra

**Desktop fejléc:** bal: SANCI9517 wordmark; közép: Főoldal · Élő adás · Videók · Menetrend · Közösség · Rólam; jobb: valódi LIVE státusz (ha hiteles), „Nézd a streamet” CTA; a Partner/Kapcsolat a footerben és Rólam környezetében. Sticky header háttér-elmosással csak akkor, ha kontraszt és teljesítmény rendben.  
**Tablet:** rövidebb topnav, szükség esetén „Továbbiak” legördülő.  
**Mobil:** logo + visszafogott valódi státusz + menügomb; egyetlen logikus drawer; erős, felhasználói szándék szerinti CTA és legfeljebb néhány látható elsődleges elem. Nincs vízszintes menütúltöltés.  
**Footer:** tartalmak / közösség / információ / jogi / hitelesített hivatalos platformlinkek / copyright. Ne kerüljön bele belső admin link vagy fejlesztői komment.  
**Oldalfa / tervezett útvonalak:** az alábbi slugok *javaslatok*, Worknek ellenőriznie kell az aktuálisan már publikált URL-eket és redirect-kontraktust, és nem szabad törni őket.

| Prioritás | Publikus oldal | Preferált útvonal | Feladat |
|---|---|---|---|
| P0 | Főoldal | / | élő státusz, tartalomfelfedezés, CTA, közösség |
| P0 | Élő adás | /elo | élő nézet / offline fallback és következő adás |
| P0 | Videók | /videok | kiemelt videók, VOD, klipek, shorts; szerkesztett gyűjtő |
| P0 | Menetrend | /menetrend | valós adásrend és állapotok |
| P0 | Közösség | /kozosseg | csatlakozás, szabályok, közösségi érték |
| P0 | Rólam | /rolam | személyes történet, játékok, setup teaser |
| P0 | Kapcsolat | /kapcsolat | üzleti és nézői kapcsolat elválasztva |
| P0 | TikTok | /tiktok | short-form csatorna-landing, nem üres linkoldal |
| P0 | YouTube | /youtube | csatorna/VOD-landing, nem üres linkoldal |
| P1 | Klipek / rövid videók | /videok/klipek | kereshető válogatás, ha az adatok és oldalmodell engedik |
| P1 | VOD / visszanézés | /videok/vod | hosszabb adások, ha az adatok és oldalmodell engedik |
| P1 | Setup és játékok | /felszereles | ténylegesen használt gamer/streaming eszközök |
| P1 | Partnerek / médiaajánlat | /partnerek | hiteles márkaajánlat és űrlap vagy kapcsolatút |
| P1 (feltételes) | Merch | /shop | CSAK működő kínálat/checkout vagy igazolt külső bolt esetén |
| Rendszer | 404 / 500 / adatvédelem | meglévő site-kontraktus szerint | nem zsákutcás rendszeroldalak |

**Migráció:** korábbi létrehozott nyolc oldal: Főoldal, Rólam, Adásrend, Élő adás, TikTok, YouTube, Kapcsolat, Közösség (korábbi beszélgetés állítása, jelenleg az élő D1 állapot nincs megerősítve). Minden oldalt előbb listázni és ugyanazon oldalt szerkeszteni, nem vakon duplikálni. Amennyiben az aktuális /élőadás stb. útvonal más, megőrizni/308 redirectet a kanonikus URL-kontraktussal, validálni.

**Tilos:** tucatnyi üres vagy „hamarosan” menüpont; navigációból elérhető kizárólag éles és értelmes oldal. P1 oldalak rejtve lehetnek, amíg tartalmuk és funkcióik nem készek; ettől a teljes terv nem szűkül.

---

## 5. Teljes tartalmi és UX specifikáció — oldalanként

### 5.1 Főoldal — / — „a SANCI9517 műsor főbejárata”

**Első képernyő desktop:** 60/40 split: baloldalon kicsi eybrow „SANCI9517 / GAMING CREATOR”, erős 2–3 soros H1, 2 mondatos értékajánlat, LIVE/stream CTA és Videók CTA. Jobboldalt eredeti cover art, csatornakép vagy kattintásra aktiválható élő videó előnézet; háttérben visszafogott signal line. A két CTA első pillantásra egyértelmű.  
**Mobil első képernyő:** sorrend: LIVE pill (ha tényleg live) → nagy H1 → 2 CTA → szép, de nem túl magas media thumbnail; az első tartalom már az első-két scrollban látszódjon.  
**Szekciók pontos sorrendben:**
1. Top ribbon: live esetén „MOST ÉLŐBEN” + stream címe; offline esetén „LEGÚJABB VIDEÓ” vagy „KÖVETKEZŐ ADÁS” csak valós adattal.
2. Hero, CTA: „Nézd élőben” vagy offline „Irány a videók”, secondary „Csatlakozz a közösséghez”.
3. „Most a SANCI világában” — 3 kurált tartalomkártya: legjobb videó, friss klip, következő igazolt adás; tartalom hiányában legfeljebb 2 jó kártya, nem üres keretek.
4. „Mi pörög most?” — valódi játék/témakártyák: Fortnite, Hearthstone, indie/roguelike; mutasson a kapcsolódó tartalmakra.
5. Széles editorial featured video (16:9), valós cover, időtartam, platform, játék; kattintáskor valódi cél.
6. „Következő közös játék” — menetrendből, ha létezik megbízható event; eltérő adatforrásból nem duplikálható.
7. „A közösség része vagy?” — Discord/community blokkon és platformonkénti hivatalos CTA; nincs kitalált tagszám.
8. „A rövid pillanatok” — legfeljebb 3–4 valódi TikTok/Short, gyors linkkel.
9. „Ismerj meg” — csupán 2 mondat és egy kiemelt saját kép/képzőművészeti kompozíció; CTA „Bővebben rólam”.
10. Szponzorsáv **csak** jóváhagyott aktív partnerlogókkal, különben ne renderelődjön.
11. Rövid záró CTA: „A következő jó pillanatnál találkozunk.” + platformlinkek.
12. Közös footer. Nem reklámtornyot és nem végtelen home scrollt építünk.

**Kész magyar hero-copy:**  
Eyebrow: „SANCI9517 • JÁTÉK / STREAM / KÖZÖSSÉG”  
H1: „A JÁTÉK ITT KEZDŐDIK. A LEGJOBB PILLANATOK EGYÜTT SZÜLETNEK.”  
Lead: „Szia, Sanci vagyok! Fortnite, Hearthstone és különleges indie játékok, őszinte reakciók és közös élmények. Nézd élőben, vagy találd meg a következő kedvenc pillanatodat.”  
CTA live: „Nézd az élő adást” • CTA offline: „Mutasd a videókat” • CTA közösség: „Találkozzunk a közösségben”.  
Section 1 heading: „Amit most érdemes megnézned”  
Section 2 heading: „Fortnite. Hearthstone. És ami még meglep.”  
Section 3 heading: „Nem csak nézők. Közösség.”  
Community lead: „Játék, beszélgetés, közös pillanatok — kapcsolódj be ott, ahol neked a legjobb.”  
CTA close: „Jössz a következő körre?”

**State matrix:** Live / Offline / Unknown / provider-error / no-featured-video / no-schedule / no-Discord-invite / reduced-motion / mobile narrow. Ismeretlen állapotból nincs piros élő badge.

### 5.2 Élő adás — /elo

**Fő érték:** egyetlen helyen megtudni és elérni, mikor/honnan streamel Sanci.
- Live esetén hiteles státusz és cím (ha lekérhető), nagy lejátszó vagy click-to-load Twitch embed, elsődleges „Megnyitás Twitchen” külső CTA. A beágyazás platform-, parent domain-, privacy- és eszközszabályait tartani.
- Offline esetén személyes, nem hibás állapot: „Most nincs élő közvetítés. Addig nézd vissza az egyik legjobb pillanatot!” és két releváns, létező videó link.
- Következő alkalom csak a Schedule domainből; ismeretlen esetben „Az új időpontokat a menetrendben találod”, hamis visszaszámláló nélkül.
- Mobilon szélesebb player minimális méretig, különben kanonikus külső link. Chat csak ha biztonságosan és ténylegesen támogatott; mobilon nem a fő videó alá bezsúfolva.
- Közösségi CTA nem fedheti el a lejátszót; nincs autostart audio.
**Copy:** H1 „ÉLŐBEN SANCIVAL” / offline H1 „A KÖVETKEZŐ STREAMIG...” / bekezdés „Amikor megy az adás, itt találod. Ha most offline vagyok, a legjobb pillanatok továbbra is várnak.”
**Meta title javaslat:** Élő adás | SANCI9517.

### 5.3 Videók — /videok

**Editorial library, nem linkhalmaz:** nagy featured videó, utána világos szűrés: „Összes”, „Fortnite”, „Hearthstone”, „Indie”, „Klipek”, „Hosszabb adások” — csak valós, jól címkézett elemekhez; UI nem hirdet hamis dinamikus keresést.  
**Card contract:** saját/engedélyezett thumbnail, 16:9 vagy 9:16, cím (max 2–3 sor), játék, típus, platform, dátum csak ha ismert, külső/belső útvonal.  
**UX:** 3 desktop / 2 tablet / 1–2 mobil oszlop; külső platformok sose rejtett modalban kényszerítve. Keresés/pagináció kizárólag működő backend vagy helyes kisméretű helyi szűrés alapján; planned keresőt ne imitáljuk.
**Copy:** H1 „A LEGJOBB PILLANATOK EGY HELYEN.” Lead „Klipek, teljes adások, rövid videók és váratlan fordulatok. Találd meg, ami most érdekel.”  
**Üres tartalom:** „Még nincs videó ebben a kategóriában. Nézz körül a többi tartalom között.”

### 5.4 Menetrend — /menetrend

**UX:** a következő igazolt alkalom kiemelve; a hét napjainak kártyái desktopon, mobilon egymás alatt; timezone egyértelműen „Magyarországi idő (Europe/Budapest)”. Ismétlődő, elmaradt, áthelyezett, rendkívüli alkalmak saját állapottal.  
**Valódi személyes helyzet:** heti kb. 3 stream a cél, de váltott műszak mellett **semmilyen fix hétfő/péntek 20:00 időpont nem publikálható feltételezésből**. A Schedule domain aktuális bejegyzése az igazságforrás.  
**Copy:** H1 „MIKOR TALÁLKOZUNK?” Lead „Itt találod a következő élő adásokat. Ha változik a terv, itt frissül az időpont.”  
**Empty state:** „Most nincs közzétett következő adás. Kövesd a hivatalos csatornáimat a friss hírekért.” Ne legyen „minden hétköznap stream” állítás.

### 5.5 Közösség — /kozosseg

**Hero:** csoport-, nem csak platformfókusz: „NE CSAK NÉZD. LÉGY A RÉSZE.” / „A stream a találkozóhely, a közösség viszi tovább a beszélgetést.”  
**Struktúra:** közösségi értékek 3 kisebb cardban (beszélgetés, közös játék, segítség egymásnak); Discord CTA kizárólag ellenőrzött invite esetén; Twitch chat / TikTok / YouTube pontos szerepe; rövid, pozitív alapszabályok (tisztelet, spoiler jelölése, spam nélkül); eseménykártya csak valós eseményhez.
**Fallback:** ha Discord invite nem ismert, Twitch/TikTok/YouTube linkekkel működő közösségi oldal; nincs kitalált „Csatlakozz a Discordhoz” gomb.

### 5.6 Rólam — /rolam

**Elv:** a korábbi főoldalra került életrajz erre az oldalra tartozik. Prémium editorial profil: saját portré/illusztráció, címsor, három személyes fejezet, játékpreferenciák, felszerelés teaser, FAQ, kontakt CTA.
**Publikálható első személyű copy-tervezet (személyes részletek tulajdonosi ellenőrzéssel):**  
H1: „SZIA, SANCI VAGYOK.”  
Bevezető: „A játékok nálam sosem csak a győzelemről szólnak. Szeretem azokat a pillanatokat, amiket együtt élünk át — amikor valami váratlan történik, tanulunk egy hibából, vagy egyszerűen csak jókat nevetünk.”  
„A streamjeimen a Fortnite pörgése, a Hearthstone taktikája és az indie játékok felfedezése találkozik. Nem akarok mindent tökéletesnek mutatni: a fejlődés, a reakciók és a közösség is része az élménynek.”  
„Ha most jársz itt először, nézz bele egy adásba vagy videóba. Ha pedig már ismerős a hangulat: örülök, hogy újra itt vagy.”  
**Strukturált fejezetcímek:** „Honnan indult?”, „Miért ezeket a játékokat?”, „Mitől más a közösség?”, „A kamera mögött”, „Gyakori kérdések”. Ha nem ismert valós élettörténet, a „Honnan indult?” rész ne inventáljon évszámot, várost vagy eredményt.
**CTA:** „Nézd meg, mit alkotok” → /videok. „Üzleti megkeresés” → /kapcsolat.
**Privát:** munkahelyi műszakbeosztás, pontos lakhely, családi adatok nem kerülnek automatikusan nyilvánosságra.

### 5.7 TikTok — /tiktok

**Önálló mobil-first landing** teljes képernyőnyi üres hero nélkül: 9:16 video-cover grid, kiemelt valós shortok, platformlink, kapcsolódó hosszú videó, közösségi CTA. Nem engedély nélküli TikTok scraping/API és nem automatikus harmadik fél tracking.
**Copy:** H1 „GYORS PILLANATOK. NAGY REAKCIÓK.” Lead „Ha rövidebben néznéd a legjobb jeleneteket, itt indulj.”
**CTA:** „Nézz TikTokon” → igazolt https://www.tiktok.com/@sanci9517 (publish előtt ellenőrizni).

### 5.8 YouTube — /youtube

**Oldal:** külön YouTube/VOD-világ a márka alatt; featured 16:9 videó, VOD és rövid videó szekció, csatorna-CTA, videókörkép. A konkrét YouTube csatornaazonosító/URL a valódi integrációból, nem találgatásból.
**Copy:** H1 „VISSZANÉZHETŐ MINDEN JÓ PILLANAT.” Lead „Ha lemaradtál az élőről, itt folytatódhat a történet. Válassz egy videót, és indulhat a következő kör.”
**CTA:** „Megnyitás YouTube-on” csak validált csatorna URL-re.

### 5.9 Kapcsolat — /kapcsolat

**Split 2 persona:** „Nézőként keresel?” → hivatalos community/social útvonal; „Együttműködést ajánlanál?” → konkrét, ellenőrzött üzleti kapcsolati csatorna. Nincs kitalált e-mail cím, eredménygarancia vagy működésképtelen contact form.  
**Copy:** H1 „BESZÉLJÜNK!” Lead „Kérdésed van, együttműködnél, vagy csak szeretnéd felvenni a kapcsolatot? Válaszd ki, amiért érkeztél.”  
**Űrlap:** csak meglévő FORM_SUBMISSION szerveroldali validáció, spamvédelem, adatkezelési tájékoztatás és siker/hiba után; addig működő, igazolt mailto/contact cél, vagy form nélkül social link. Publikus személyes adatot nem teszünk közzé.

### 5.10 P1 — Klipek / VOD / Felszerelés / Partnerek

**Klipek:** szűrhető rövid csúcspillanatok, mobil kártyaközpontú layout; tartalom hiányában ne külön publikus oldalként jelenjen meg.  
**VOD:** a hosszabb, ellenőrzött videók archívuma; játék szerinti gyűjtemény; törölt/privát platformvideónál fallback.  
**Felszerelés:** csak hitelesített jelenleg használt eszköz. A streamhez történetileg használt Lenovo LOQ 83JC00KBHV (RTX 3050), illetve MSI GL65 (RTX 2060) **csak tulajdonosi megerősítés után** kaphat aktuális setup címkét; hardverpromóció és affiliate link egyértelmű jelöléssel, ha lesz.  
**Partnerek:** hero „ALKOSSUNK VALAMI EMLÉKEZETEST.”, 3 együttműködési típus (gaming kampány, livestream megjelenés, rövid videós kreatív), márkakompatibilitás, elérhetőség, médiakit **csak valós, engedélyezett statisztikákkal**. Szponzorlogó helyett jól látható előnyök és referenciák csak tényleges partnerséggel.  
**Merch/shop:** tervezett, de csak ellenőrzött termékek, ár, készlet, fizetés és vásárlói feltételek esetén kerül főmenübe. Nincs hamis „rendeld meg”, üres checkout vagy „sold out” katalógus.

### 5.11 Rendszer-, jogi és speciális oldalak

A 404 oldal saját, játékos, világos CTA-val: „Ez a pálya most nem található.” → Főoldal / Videók. Helyes HTTP 404, canonical/robots contract. 500/karbantartás emberi üzenettel, admin adat/stack trace nélkül. Adatvédelem, cookie/consent és szükséges jogi oldalak a tényleges szolgáltatásokra szabva; nem helyettesíthetők sablonos kitalált jogi szöveggel. Hreflang csak valóban publikált, megfelelő fordításoknál.

---

## 6. Részletes responsive komponensspecifikáció

| Komponens | Desktop (≥1200) | Tablet (768–1199) | Mobil (≤767) |
|---|---|---|---|
| Header | 1 sor, linkek + CTA | rövidített, esetleg drawer | logo + státusz + drawer; nagy tap target |
| Hero | szöveg 7/12, média 5/12, 68–84 px H1 | 6/12 + 6/12 vagy 1 oszlop | szöveg, CTA-k, 16:9 borító egymás alatt |
| Live | nagy player + oldalsó infók | player majd időpont | player vagy külső gomb; nincs 400px alatti Twitch player erőltetés |
| Video grid | 3 card / sor | 2 / sor | 1 / sor; keskeny short esetén 2, ha olvasható |
| Shorts | 4 portrait card | 3 | 2 vagy 1 scroll-tilalom nélkül |
| Menetrend | 7 nap áttekintés vagy tömb | 2–3 oszlop | napkártyák függőlegesen |
| Közösség | nagykép + 3 benefit | 2+1 | 1 oszlop, CTA az elején |
| Rólam | editorial váltakozó kép/szöveg | kiegyensúlyozott split | szöveg-először, nincs többszintes overlay |
| Szponzorsáv | vékony horizontális sor max 6 logó | wrap/flex | görgetés nélküli adaptív sor, aktív partner híján rejtve |
| Footer | 4 oszlop | 2 oszlop | accordion csak működő és accessible; alapból 1 oszlop |

**Tesztnézetek:** 320, 360, 390, 430, 768, 1024, 1280, 1440, 1920 px; Chrome/Firefox és releváns mobilböngésző; portrait/landscape, 200% zoom, billentyűzet és screen reader útvonalak. A mobil nem a desktop összenyomása; vizuális hierarchia külön is változhat, de a lényegi tartalom nem maradhat el.

---

## 7. Szöveg és tartalomirányítás

### 7.1 Tartalmi slotok, forrás és fallback

| Slot | Source of truth | Hiány esetén |
|---|---|---|
| live státusz és stream cím | hiteles integráció/live domain | semleges „Nincs megerősített élő adás”; Twitch link |
| következő műsor | Schedule domain | menetrend link, dátum nélküli szöveg |
| videók és borítóik | engedélyezett Content/Media vagy kurált igazolt link | modul elrejtése, minimális valódi link |
| Twitch csatorna | https://www.twitch.tv/sanci9517 ellenőrizve | link kikapcsolva, amíg nem ellenőrzött |
| TikTok | https://www.tiktok.com/@sanci9517 ellenőrizve | link kikapcsolva, amíg nem ellenőrzött |
| YouTube/VOD | hitelesített pontos channel URL | no fabricated handle / channel ID |
| Discord | a tulajdonos érvényes meghívója | Discord CTA ne jelenjen meg |
| Kick | tulajdonos által igazolt csatorna / integráció | opcionális, nem ígérjük az aktív Kick streamet |
| követőszám, streamszám, nézettség | hiteles provider / jóváhagyott médiaadat | NEM jelenik meg nullás / kitalált metrika |
| sponsor/partner | engedélyezett aktív partner rekord | teljes blokk elrejtve |
| merch | hitelesített valós termékek / külső checkout | shop ne legyen publikusan promotálva |

### 7.2 Szerkesztési és marketing szabályok

- Minden oldalnak egy H1-e, rövid egyértelmű leadje, elsődleges és másodlagos CTA-ja, konzisztens belső linkútja legyen.
- A platformokkal kapcsolatos copy a látogatói haszonról szóljon; ne csak a feliratkozásra kérjen.
- Ne legyen kitalált vélemény, testimonial, követőszám, díj, partner vagy adásidő.
- Jelenleg elsődleges nyelv magyar. Angol, német és ukrán nyelv a platform célja, de csak ellenőrzött teljes fordítás, locale és URL-létezés után publikus; ne legyen fél-angol interface.
- Személyes fotók, ikonok és videók mind jogosult assetként a meglévő Média/Asset Registryben; alt-text minden tartalmi képhez. Dekoratív kép üres alt.
- Forrásvideókhoz előnézet/thumbnail/creator jognak megfelelő felhasználás és platformlink. Ne töltsünk le jogvédett más creator-médiát.

---

## 8. SEO / metadata terv

**Főoldal:** Title „SANCI9517 | Élő gaming, Fortnite, Hearthstone és közösség” • Description „SANCI9517 hivatalos oldala: élő adások, Fortnite, Hearthstone, indie játékok, friss videók, adásrend és közösségi linkek.”  
**Élő:** „Élő adás | SANCI9517” • „Nézd meg, van-e élő közvetítés, vagy találj új videót és következő adásidőpontot.”  
**Videók:** „Gaming videók, klipek és VOD-ok | SANCI9517”.  
**Menetrend:** „Adásrend és következő streamek | SANCI9517”.  
**Közösség:** „SANCI9517 közösség | Csatlakozz hozzánk”.  
**Rólam:** „Rólam | SANCI9517 gaming creator”.  
**Kapcsolat:** „Kapcsolat és együttműködés | SANCI9517”.  
**TikTok:** „TikTok videók és rövid pillanatok | SANCI9517”.  
**YouTube:** „YouTube és VOD | SANCI9517”.

**Technikai minőség:** minden indexelhető published oldal saját title/description/canonical/OG; előnézeti/draft és 404 oldal nincs canonical / index tiltva a meglévő szerződés szerint; érvényes sitemap, értelmes heading hierarchy, VideoObject/Event structured data csak hiteles metaadatból; og:image saját 1200×630 jogtiszta kép; jó favicon. A slug/redirect 308 és site-scoped link checker megsértése tilos.

---

## 9. A Visual Editor jelenlegi valós képességei és határai

**2026-11-09-i kódellenőrzésből:** a public/editor-v2/core/schema.js felsorol sok tervezett node típust, DE a public/editor-v2/core/capability-matrix.js a tényleges komponenstípusokat PARTIAL vagy PLANNED státusszal kezeli; acceptance NOT_CERTIFIED. Node típus puszta létezése nem jelent kész, publikálható blokkot.

**A briefhez először vizsgálandó létező elemek:** section, container, row/columns/flex/grid/stack, heading/text/richtext, link/button, image/video/audio, card, gallery, divider/spacer, social, schedule, countdown, embed, code snippet. Szigorúan csak a tényleges, tesztelt Inspector/Canvas/public renderer útvonalon használandók.

**Kiemelt bizonyított szerződések:**
- public/editor-v2/core/creator-embed.js: YouTube, Twitch Live/VOD és Vimeo típus; HTTPS validáció, click-to-load, Twitch minimum 400 px környezetben külső link fallback, parent domain ellenőrzés.
- public/editor-v2/core/social-links.js: Twitch/YouTube/TikTok/Discord/Instagram/Kick stb. URL-validált, több variánsú statikus social link; ez önmagában **nem** igazolja a platform integrációját vagy aktív kapcsolatát.
- public/editor-v2/core/design-tokens.js: jelenleg korlátozott központi tokenregiszter, szabályozott értékek. Nem szabad általános tetszőleges token API-ként kezelni.
- src/core/site-presentation.ts: draft/published stíluskészlet külön, revízióhoz kötött módosítás; csak ellenőrzött és jóváhagyott publish után éles.
- Page Model / Site Core: a publikáció és navigáció egyetlen kanonikus útvonalon, nem közvetlen D1-ben összerakott alternatív HTML.

**Fontos sorrend:** (1) ami az aktuális Editorral biztonságosan megvalósítható, azt minőségi konfigurációval felépíteni; (2) ha hiányzik komponens/nézet/interakció, pontos gapet az egyetlen MASTER megfelelő EDT/WEB/DSN tervpontjához kötni; (3) a hiányt nem pótolhatja biztonságot megkerülő beágyazás vagy külön nem szerkeszthető hardcoded oldal. A jelenlegi teljes Editor kézi elfogadási kapuját nem hozzuk előre.

---

## 10. Work végrehajtási forgatókönyv és kiadási kapuk

**Work feladata:** nem pusztán tervismertetés, hanem a már meglévő site tökéletesítése a fenti brief alapján, majd tényleges, dokumentált, biztonságosan ellenőrzött publikálás — amikor ehhez minden jogosultság, teszt és jóváhagyás rendelkezésre áll.

### W0 — read-only felmérés és tartalmi leltár

1. Olvasd el teljes AGENTS.md, a **teljes** aktuális MASTER, ezt a briefet és az alkalmazandó útmutatókat; ellenőrizd HEAD-et, branch-et és nem commitolt módosításokat.
2. Nézd meg a tényleges webhelyet desktop/tablet/mobilon; olvasd ki read-only módban a Site/Page/Navigation/Published állapotot. Készíts megőrzési jegyzéket: oldalazonosítók, slugs, revíziók, publikált szerkesztések, képek, tartalom, menü. Ne írj felül korábbi munkát.
3. Mérd fel a valós Editor képességeket az aktuális repo+tesztek alapján. Azonosítsd a meglévő nyolc oldal esetleges csupasz/ismétlődő blokkjait. Ne állíts PASS-t mérés nélkül.
4. Ellenőrizd a SANCI9517 social linkeket és jóváhagyott médiaasseteket; nem ismert személyes, számszerű és partneradatot hagyj ki. A tulajdonost csak a valóban elkerülhetetlen saját tény / kapcsolattartó / logó / portré / Discord-invite ügyében kérdezd.

### W1 — brand shell és design system

1. A központi Brand Kit jelenlegi szerződésében a palettát, typót, spacinget és radiuszt érvényes értékekre képezd le, vizuális screenshot-kontrollal; ne módosíts rendszer-sémát csak egy site kedvéért.
2. Egységes globális header/footer, social útvonal, 404, CTA, navigáció; a webhely responsive felülete ne egyetlen görgetett landing legyen.
3. Minőségi, engedélyezett asset pipeline (thumbnail, borító, optimizálás, alt); feliratos demo és kitalált logó helyett jóváhagyott saját forrás. Ha nincs portré, eredeti grafikai kompozíció.

### W2 — teljes P0 tartalom, helyes oldalsorrend

1. Főoldal külön: hero/live/featured video/next event/community; életrajzot áthelyezni Rólamra.
2. Élő adás, Videók, Menetrend; a live/offline/unknown és empty/error szövegek működjenek.
3. Közösség és Rólam; oldalonként eredeti copy, képi világ és megfelelő CTA.
4. TikTok és YouTube: ne csak csupasz linkek, hanem saját kurált tartalom + hivatalos platformra vezető CTA.
5. Kapcsolat: ne legyen üres űrlap vagy kitalált cím.
6. Minden meglévő menü és slug belső linket / 308 redirectet ellenőrizni; a P1 oldalak fokozatosan akkor menjenek LIVE-ba, ha valódi tartalmuk van.

### W3 — mobil/tablet/desktop minőségi pass

1. Minden kiemelt oldalon ellenőrzött 320/390/768/1024/1440 nézet, legfontosabb régiókról screenshot.
2. Tilos horizontális scroll, takart szöveg, kilógó videó, nem bezárható mobilmenü, túl kicsi touch target.
3. Tablet layout legyen tervezett, ne csak desktop vagy telefon; eltérő képsorrend lehetséges és indokolt.
4. Keyboard focus, reduced-motion, WCAG 2.2 AA cél, szöveg/CTA kontraszt, meaningful alt.
5. Nem szükséges autonóm screenshot artefaktumot a repóba commitolni; csak kis, indokolt bizonyíték, ahogy AGENTS.md előírja.

### W4 — tesztelés, publikálás és visszaellenőrzés

1. Előbb egyesével Save → reload → preview → ellenőrzés; **Save nem Publish**.
2. Dokumentációs/publikus szöveges változás és runtime-kódmódosítás eltérő release gate. Runtime változáskor minden AGENTS preflight, D1 read-only SELECT, dry-run, tesztek, branch push, Worker rollout és health/asset smoke követendő.
3. Produkciós D1-mutációt/migrációt és R2 törlést nem szabad előzetes read-only preflight + külön explicit jóváhagyás nélkül csinálni; az Editoron keresztüli éles tartalmi írást/Publish-t is az alkalmazandó jogosultsági/előellenőrzési kapu szerint kezelni.
4. CI-billing/kvóta 0 Ft korlát: drága workflow nem indítható vakon; hiányzó CI „NOT RUN/BLOCKED”, nem PASS.
5. Mérhető ellenőrzés: minden publikus URL HTTP, belső linkek, robots/canonical/OG, assetek, 404, többnyelvű fallback, navigáció, valamint 0 regresszió a régi mentett oldalakban.
6. Dokumentáld a valós commitot, a megváltoztatott oldalak azonosítóit, teszteket és deploy állapotot a kanonikus terv bizonyítékfejezetében. Kizárólag bizonyított munkát nevezz késznek.

**Kimenet:** minden P0 oldal tartalommal kitöltve és vizuálisan kész, megmarad a szerkeszthetőség; minden device számára jó használat; P1 függőségek és hiányzó assetek külön, rövid blokkolólistán; semmilyen hamis LIVE/partner/videó/statisztika.

---

## 11. Kötelező elfogadási mátrix

| ID | Minőségi kapu | PASS bizonyíték |
|---|---|---|
| SITE-UX-01 | A főoldal első képernyője valóban streaming/creator fókuszú, nem Rólam | desktop + 390px screenshot és valódi CTA |
| SITE-UX-02 | Legalább a kilenc P0 útvonal létezik, de nincs duplikált régi oldal | page ID / slug inventory és publikus HTTP |
| SITE-UX-03 | Élő / offline / unknown külön biztonságos állapot | integrációs/renderer teszt, valós viselkedés |
| SITE-UX-04 | Valódi videó CTA/thumbnail; nincs hamis klipek, dátumok, adatok | publikált tartalomlista forrásokkal |
| SITE-UX-05 | Menetrend időzóna és hiányos adat kezelése helyes | Schedule szerződés teszt + mobil |
| SITE-UX-06 | Desktop/tablet/mobil hierarchia külön ellenőrzött | 320/390/768/1024/1440 UI |
| SITE-UX-07 | Jól működő, billentyűzetes nav / focus / mobile menu | E2E + manual acceptance az aktuális kapun |
| SITE-UX-08 | A márka eredeti: nincs más streamer logója, képe, szövege | asset provenance / licenc ellenőrzés |
| SITE-UX-09 | SEO title, description, OG, canonical és 404 helyes | link/SEO automatizált teszt |
| SITE-UX-10 | Save/Publish külön és mentés-visszatöltés adatvesztés nélkül | Editor/publish regressziós teszt |
| SITE-UX-11 | Nyers form/checkout/szponzor nincs kiajánlva működés nélkül | 0 broken CTA / 0 faux metrics |
| SITE-UX-12 | Ingyenes költség, live release nem állítható teszt nélkül | tételes feladatjelentés, költséggate |

**Minőségi cél, nem ígéret:** Core Web Vitals 75. percentilis: LCP ≤2,5 s, CLS ≤0,1, INP ≤200 ms; WCAG 2.2 AA, Lighthouse mobile ≥90 Performance/Accessibility/Best Practices/SEO jó célérték. Ezek **célok**, nem jelenlegi audit-eredmények és nem garantálhatók mérés nélkül.

---

## 12. A következő Work-feladat indítóutasítása

„Dolgozz senior designer, UX researcher, marketingstratéga és frontend/Editor-integrációs mérnök szerepében a sanci9517/sanci9517 repository v2/foundation ágán. Elsőként olvasd el a teljes AGENTS.md-t és a teljes docs/SANCI9517-CREATOR-PLATFORM-PLAN.md-t, majd a docs/SANCI9517-PUBLIC-SITE-BRIEF.md fájlt. Ez az egyetlen részletes tartalom- és art-direction brief a SANCI9517 saját publikus webhelyéhez, de a MASTER minden esetben elsőbbséget élvez. Mérd fel a jelenlegi élő és szerkesztői oldalakat, ne törölj vagy duplikálj meglévő munkát, és a ténylegesen működő Visual Editor és publikus renderer alapján építsd át az összes P0 oldalt. A főoldal élő/tartalomközpontú legyen; az életrajz a Rólam oldalra kerüljön. Valós, ellenőrzött tartalmat, eredeti vizuális világot és reszponzív mobil/tablet/PC dizájnt használj. A teljesítmény, accessibility, linkek, SEO és Save/Publish megfelelően ellenőrzöttek legyenek; hiányzó adatot ne találj ki, és 0 Ft új költségből dolgozz. Nagy, összefüggő munkablokkokban haladj, tesztelj és javíts; végül a tényleges változásokról és minden fennmaradt blokkolóról adj bizonyítékalapú magyar jelentést.”

---

## 13. Nyitott, kizárólag valós adatot igénylő pontok

- Aktuális jóváhagyott SANCI9517 portré/logó/brand vizuál és licence.
- Hiteles, aktív YouTube csatorna URL és VOD lista; validált TikTok/Twitch/Kick profilok.
- Aktuális Discord meghívó, kapcsolati e-mail vagy működő FORM_SUBMISSION.
- Aktuális heti menetrend a Schedule domainből.
- Kiemelhető 6–12 tényleges videó/klip és hozzájuk tartozó biztonságosan használható thumbnail.
- Vállalható nyilvános bemutatkozó személyes tények; felszerelés „aktuális” státusza.
- Valós aktív szponzorok, shop/támogatási módok, csak ha vannak.

Ezek nem akadályozhatják a **tényszerű statikus** elemek minőségi megvalósítását; a hitelesítést igénylő szekciók átmenetileg rejtve vagy őszinte fallbackkal működjenek.

**Dokumentum státusza:** csak kreatív és tartalmi brief, nem kész runtime funkció, nem éles publikálás, nem elfogadott Editor-kapu. A tényleges végrehajtás eredménye kizárólag ellenőrzött commit/teszt/éles bizonyíték alapján frissíthető.
