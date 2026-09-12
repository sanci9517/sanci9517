# Sanci9517 V2 — FOLYAMATOS PROJEKTKONTEXTUS

> Ez a dokumentum a projekt élő állapot- és döntési naplója. A célja, hogy a fejlesztés során ne vesszen el egyetlen fontos követelmény, döntés, hiba, teszt vagy felhasználói visszajelzés sem.
>
> **Központi vízió:** `docs/SANCI-MASTER-PLAN.md`
> **Részletes fejlesztési checklist:** `docs/DEVELOPMENT-PLAN.md`
> **Aktuális állapot / döntések / tesztek / változások:** ez a dokumentum.

## 1. Kötelező munkaszabály

- Egyszerre csak **egy konkrét fejlesztési vagy tesztlépés** fut.
- A következő lépés csak akkor indul, ha az előzőt a felhasználó ténylegesen ellenőrizte és azt mondta, hogy működik.
- Az asszisztens nem tekinthet egy funkciót késznek pusztán azért, mert a kód elkészült.
- `[x]` csak felhasználó által ellenőrzött funkció lehet.
- `[~]` részben kész vagy további ellenőrzést igényel.
- `[ ]` még nincs kész.
- `[!]` hibás, blokkolt vagy újratervezendő.
- Minden lényeges módosítás után: kód → commit → deploy → konkrét teszt → felhasználói visszajelzés → állapotfrissítés.
- Ha a teszt sikertelen, nem lépünk tovább; előbb a hibát javítjuk és ugyanazt a tesztet ismételjük.

## 2. A projekt célja

A Sanci9517 nem egyszerű statikus streamer-linkoldal. A végső rendszer egy professzionális streamer-brand platform:

1. Publikus, modern Sanci9517 weboldal.
2. Biztonságos admin felület.
3. Visual Editor, amellyel programozás nélkül is szerkeszthető a weboldal.
4. Cloudflare Worker + D1 szerveroldali adatkezelés.
5. Később R2 média és integrációs réteg.
6. Később Twitch/YouTube/TikTok/Discord integrációk.
7. Hosszú távon Sanci Stream Assistant AI, amely az adást elemzi, segít a streamernek, technikai hibákat jelez, ötleteket ad, jó pillanatokat felismer és kontrollált jogosultságokkal a weboldalt is tudja kezelni.

## 3. Nem változtatható alapelvek

- A publikus oldal magyar nyelvű.
- A technikai/developer megjegyzések nem kerülhetnek a nézői felületre.
- Mobil és desktop ugyanazon designrendszer responsive nézete legyen.
- A jelenleg jó mobilos működést nem rontjuk el desktop javítás közben.
- A desktop navigáció a mobilon bevált menülogikát kövesse.
- A főoldalt jelenleg nem kell teljesen újratervezni; a részletes tartalom külön oldalakon legyen.
- A rendszer ne egyetlen nagy Worker fájl legyen; a kód legyen moduláris, külön route/core/component rétegekkel.
- A szerveroldali tárolás már az alapoktól része a rendszernek.
- A jövőbeli módosításokat úgy kell tervezni, hogy ne legyen szükség későbbi teljes újraépítésre.
- A Sanci Buttons központi komponensrendszerként működjön, ne szétszórt HTML-ként és ne hard-coded emoji-ként.
- A pontosan kiválasztott jelenlegi ikonokat nem szabad találomra lecserélni; referencia alapján kell visszaállítani.
- AI később csak engedélyezett eszközökön és auditált műveleteken keresztül írhat a rendszerbe.

## 4. Infrastrukturális állapot

- Repository: `sanci9517/sanci9517`
- Aktív fejlesztési branch: `v2/foundation`
- Cloudflare Worker: `sanci9517-streamer-brand`
- Cloudflare D1 létrehozva.
- GitHub → Cloudflare kapcsolat létrehozva.
- Deploy parancs: `npx wrangler deploy --assets ./public/`
- Projekt gyökér: `/`
- Build watch paths korábban konfigurálva.
- A GitHub és Cloudflare kapcsolatot minden új nagyobb backend változásnál ellenőrizni kell.

## 5. Jelenlegi Visual Editor állapot — FELHASZNÁLÓ ÁLTAL ELLENŐRIZVE

- [x] Editor megnyílik.
- [x] Elem kiválasztása működik.
- [x] H1 szöveg módosítása működik.
- [x] Bekezdés módosítása működik.
- [x] Gomb módosítása működik.
- [x] Elem pozíció módosítása működik.
- [x] Elem méretezése működik.
- [x] Több elem együttes kezelése működik.
- [x] Elem törlése működik.
- [x] D1 mentés működik.
- [x] Mentett állapot visszatöltése működik.
- [x] Teljes böngészőfrissítés után az állapot megmarad.
- [x] Új oldal létrehozása működik.
- [x] Új oldal mentése és visszatöltése működik.
- [x] Új oldal tartalma Preview-ban megjelenik.
- [x] Új elem a valódi publikus oldalon megjelenik.
- [x] Border preset működik.
- [x] Preview PC mód működik.
- [x] Preview Mobile mód működik.
- [x] Preview Mobile stacking javítás ellenőrizve.
- [x] Publikus új oldal mobilon egyoszlopos alapelrendezése működik.

## 6. Jelenlegi Visual Editor — még hátralévő területek

### Oldalkezelés
- [x] Új oldal.
- [ ] Oldal átnevezése.
- [ ] Slug kezelés.
- [ ] Oldal törlése — jelenleg nincs ilyen funkció; korábban tévesen tesztelendőként lett említve, ezt nem szabad késznek tekinteni.
- [ ] Oldal duplikálása.

### Elemkezelés
- [x] Létrehozás / módosítás / pozíció / méret / törlés.
- [ ] Duplikálás.
- [ ] Multi-select fejlesztése.
- [ ] Csoportosítás.
- [ ] Lock / unlock.
- [ ] Hide / show.
- [ ] Layer ordering.
- [ ] Copy / paste.

### History
- [ ] Undo.
- [ ] Redo.
- [ ] Mentési előzmények.

### Megjelenés
- [ ] Szín teljes körű ellenőrzése.
- [ ] Háttér teljes körű ellenőrzése.
- [x] Font size preset.
- [x] Font weight preset.
- [x] Border preset.
- [x] Radius preset.
- [x] Opacity preset.
- [ ] Shadow.
- [ ] Typography rendszer.

### Layout
- [x] X/Y.
- [x] Width/height.
- [x] Position preset.
- [x] Display preset.
- [x] Gap preset.
- [x] Padding preset.
- [ ] Z-index.
- [ ] Flex részletes vezérlés.
- [ ] Grid részletes vezérlés.
- [ ] Container/section rendszer.

### Responsive
- [x] Preview PC.
- [x] Preview Mobile.
- [x] Mobile stacking javítás.
- [ ] Tablet Preview.
- [ ] Desktop/tablet/mobile külön override-ok teljes rendszere.
- [ ] Hide/show breakpointenként.
- [ ] Responsive editor stabilizálása.

## 7. Preview / Save / Publish állapot

- [x] Editor state Preview-ban megjelenik.
- [x] Preview PC működik.
- [x] Preview Mobile működik.
- [x] Preview mobile stacking működik.
- [x] Mentés D1-be működik.
- [x] Mentett állapot visszatöltése működik.
- [ ] Preview → Publish teljes folyamat.
- [ ] Published revision kezelése.
- [ ] Unpublished változások izolálása.
- [ ] Republish.
- [ ] Revision history.
- [ ] Restore.
- [ ] Cache invalidation.

## 8. Sanci Button — fontos architekturális döntés

A Sanci Button önálló, központilag kezelt komponens lesz.

Adatmodell tervezett mezői:

- stabil `id`
- név
- leírás
- ikonazonosító
- action/link típus
- cél URL vagy belső route
- láthatóság
- sorrend
- állapotok
- globális konfiguráció
- oldalszintű override

Követelmények:

- [ ] Registry.
- [ ] Icon registry.
- [ ] Jelenlegi kiválasztott ikonok pontos visszaállítása referencia alapján.
- [ ] Globális módosítás.
- [ ] Oldalszintű override.
- [ ] Új Sanci Button típus hozzáadása meglévő oldalak törése nélkül.
- [ ] Hover/active/disabled állapotok.
- [ ] AI-jogosultság később.

## 9. Publikus oldal célstruktúrája

Alap oldalak:

- Főoldal
- Twitch
- TikTok
- YouTube
- Menetrend
- VOD / videók
- Bemutatkozás
- Közösség / Discord
- Támogatás
- Kapcsolat

Későbbi bővítések:

- Partners
- Merch
- Blog / hírek
- Events
- Community Hub
- Creator Resources
- Clips / Shorts

## 10. Közös design követelmények

- Modern streamer-brand megjelenés.
- Sötét alapkarakter.
- Egységes kártyaméretek.
- Egységes spacing.
- Egységes typography.
- Egységes ikonrendszer.
- Egységes gombok.
- Egységes animációk.
- Responsive komponensek.
- Mobil és desktop közös logika.
- Bal oldali menüvezérlő.
- Sanci név a menü mellett.
- Twitch Live jelző jobb oldalon.

## 11. Következő tesztelési sorrend

A teszteket nem egyszerre kell elvégezni. Mindig csak az első még nyitott tesztet végezzük.

1. Oldal átnevezése.
2. Elem duplikálása.
3. Multi-select.
4. Layer ordering.
5. Lock/unlock.
6. Hide/show.
7. Copy/paste.
8. Undo.
9. Redo.
10. Styling regressziótesztek.
11. Layout részletes tesztek.
12. Tablet Preview.
13. Responsive override tesztek.
14. Ismételt D1 mentés.
15. Hibás/üres adatok mentési tesztje.
16. Preview → Publish.
17. Published oldal ellenőrzése.
18. Unpublished változás izoláció.
19. Republish.
20. Admin → Editor útvonal.
21. Hibás page ID.
22. Hiányzó oldal.
23. Üres dokumentum.
24. API/D1 hibakezelés.
25. Admin védelem.
26. Public/admin API szétválasztás.
27. Teljes end-to-end regresszió.

## 12. Minden új kérés feldolgozási szabálya

Amikor a felhasználó új ötletet, módosítást vagy hibát jelez:

1. Azonosítani kell, melyik modulhoz tartozik.
2. Ellenőrizni kell, hogy van-e már ilyen követelmény a MASTER PLAN-ben vagy ebben a dokumentumban.
3. Ha új követelmény, be kell írni a tervbe.
4. Ha meglévő követelményt módosít, a régi döntést frissíteni kell, nem duplikálni.
5. Ellenőrizni kell az architekturális hatást.
6. Ha a változtatás más modult érint, azt is rögzíteni kell.
7. Csak ezután szabad implementálni.
8. Implementáció után commit/deploy.
9. Egy konkrét teszt.
10. Felhasználói visszajelzés után státuszfrissítés.

## 13. Automatikus tervkarbantartás

A tervet a fejlesztés során **nem csak akkor frissítjük, ha a felhasználó külön kéri**.

Frissítendő minden olyan eseménynél, amely a projekt állapotát vagy döntéseit érinti:

- új funkció ötlete
- új követelmény
- hibajelzés
- javítás
- sikeres felhasználói teszt
- sikertelen teszt
- új architekturális döntés
- új Cloudflare/D1 komponens
- új GitHub fájlstruktúra
- új API
- új adatmodell
- új integráció
- design döntés
- UX döntés
- biztonsági döntés
- AI funkció
- jogosultsági döntés
- változtatás egy korábbi terven

Minden ilyen változás után a megfelelő dokumentumot frissíteni kell. A felhasználónak nem kell külön kérnie a terv frissítését.

## 14. Változásnapló szabály

Minden jelentős változásnál rögzítendő:

- dátum
- mi változott
- miért változott
- melyik fájl/modul érintett
- commit SHA, ha ismert
- deploy állapot
- teszt
- felhasználói eredmény
- következő lépés

## 15. Aktuális munkamenet

**Aktív állapot:** Visual Editor stabilizálása.

**Legutóbbi lezárt teszt:** Preview Mobile stacking javítása.

**Legutóbbi releváns commit:** `dfa5faf462496e2d3617810dafc28e72c540ee70`.

**Következő kijelölt teszt:** oldal átnevezése, amennyiben a jelenlegi editorban elérhető; ha nincs ilyen funkció, azt `[ ]` állapotban kell rögzíteni és nem szabad úgy tenni, mintha létezne.

**Fontos:** Page delete jelenleg nincs implementálva.

## 16. Dokumentumok szerepe

### `docs/SANCI-MASTER-PLAN.md`
A teljes jövőkép: milyen weboldalt, editort, admin rendszert, infrastruktúrát, integrációkat és AI rendszert akarunk.

### `docs/DEVELOPMENT-PLAN.md`
A részletes fejlesztési checklist és végrehajtási sorrend.

### `docs/SANCI-CONTINUOUS-CONTEXT.md`
Az élő állapot: mi működik ténylegesen, mi nincs kész, milyen döntések születtek, mit tesztelt a felhasználó, mi a következő teszt és milyen változás történt.

## 17. Információvesztés elleni szabály

Nem szabad kizárólag beszélgetési memóriára támaszkodni egy korábbi döntésnél. Ha egy döntés fontos a kód vagy architektúra szempontjából, azt ebben a dokumentumban vagy a megfelelő tervben is rögzíteni kell.

Ha egy korábbi állapot és egy új felhasználói kérés ellentmond egymásnak, az új kérést tekintjük új döntési inputnak, és a tervben frissítjük az érintett részt.

## 18. Definition of Done

Egy funkció csak akkor tekinthető késznek, ha:

- a kód elkészült,
- a megfelelő szerveroldali réteg elkészült, ha szükséges,
- deploy megtörtént,
- a konkrét tesztet a felhasználó lefuttatta,
- a felhasználó megerősítette, hogy működik,
- a checklist `[x]` állapotra került,
- a változásnapló frissült,
- és nincs ismert regresszió az érintett funkcióban.

## 19. Hosszú távú AI Stream Assistant — rögzített cél

A későbbi AI rendszer nem egyszerű chatbot.

Tervezett képességek:

- élő adás figyelése
- beszédaktivitás elemzése
- hosszú csend jelzése
- chat aktivitás elemzése
- ötletadás
- technikai hibák felismerése
- mikrofon/audio ellenőrzés
- OBS állapot ellenőrzése
- jelenetek ellenőrzése
- streamminőség figyelése
- jó pillanatok felismerése
- stream utáni elemzés
- jó/gyenge részek azonosítása
- clip indítása gombnyomásra
- clip mentése
- short előkészítése
- felirat/hook/cím javaslat
- weboldal módosításának előkészítése
- minden írási művelet auditálása
- veszélyes műveletekhez felhasználói jóváhagyás
- rollback

Ez a rendszer csak az alap weboldal/editor stabilizálása után következik.

## 20. Frissítési kötelezettség

**A dokumentum élő dokumentum.**

A projektben végzett további munkánál az asszisztens feladata, hogy a megfelelő státuszokat és döntéseket folyamatosan karbantartsa. A felhasználónak nem kell külön azt mondania, hogy „frissítsd a tervet”.

A fejlesztés folytatásakor elsődleges állapotforrás:

1. GitHub aktuális branch és kód,
2. `SANCI-MASTER-PLAN.md`,
3. `DEVELOPMENT-PLAN.md`,
4. `SANCI-CONTINUOUS-CONTEXT.md`,
5. a felhasználó legutóbbi tényleges teszteredménye.
