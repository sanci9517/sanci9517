# SANCI9517 fejlesztési munkaidőmérés (v1)

A mérőprogram kizárólag fejlesztési munkameneteket naplóz, **nem** a weboldal runtime része. Nincs új függőség, hálózati hívás, GitHub Actions futtatás, D1/R2 művelet vagy Worker-deploy. A Visual Editor aktuális terve és a `77.44.6.1.C` OPEN állapota változatlan.

## Használat minden Codex-fejlesztési blokkban

A kötelező `AGENTS.md`, a teljes kanonikus MASTER és a munkafa/branch állapotának ellenőrzése után:

```sh
node tests/dev-metrics.mjs start --task=77.44.6.1.C --trigger=scheduled
```

A válaszban szereplő `id` a munkamenet azonosítója. Kézi fejlesztésnél `--trigger=manual`. Ha az ügynök valóban félreteszi a munkát vagy felhasználói döntésre vár, használhatja:

```sh
node tests/dev-metrics.mjs pause --id=RUN_ID
node tests/dev-metrics.mjs resume --id=RUN_ID
```

Ha a korábbi futás félbeszakadt, és a lezárás időpontja már nem rekonstruálható, nem szabad utólag munkának számolni. Az ügynök explicit **interrupted** naplóként archiválhatja a nyitott állapotot, és új mérést kezdhet:

```sh
node tests/dev-metrics.mjs abandon --id=RUN_ID --reason="cloud run megszakadt"
```

Ez az `interrupted/` mappába ment, `measured_seconds: null` értékkel. A `report` külön mutatja az ilyen futások számát, **nem** számolja őket a mért órák közé.

A munka végén, **valós** eredménnyel és konkrét ellenőrzéssel:

```sh
node tests/dev-metrics.mjs finish --id=RUN_ID --status=pass --kind=code --summary="Dock javítás tesztelve" --evidence=tests/editor-workspace-appearance.test.js:PASS --checks="Chromium PASS"
```

Ha nem sikerült az elfogadás: `--status=partial`, `blocked` vagy `failed`. A `--kind` értékei: `code`, `test`, `docs`, `mixed`, `none`. Sikeres kód-/tesztmunkához legalább egy konkrét bizonyítékhivatkozás kötelező. Nem igazolt PASS-t, meg nem történt commitot/tesztet vagy élesítést **tilos** rögzíteni. A script a referencia valódiságát nem ellenőrzi; a fejlesztő ellenőrzési kötelessége megmarad.

A lezárás után egy önálló, kis méretű JSON készül a `docs/evidence/dev-metrics/runs/YYYY-MM-DD/RUN_ID.json` helyen. A még futó munkamenet kizárólag a helyi `.git/sanci-dev-metrics/pending/` területen található, nem kerül a repositoryba. A pontos lokális Git-szerkezet eltérhet linked worktree esetén.

## Tartós mentés és költségvédelem

- A futás-JSON-t a **már engedélyezett**, megfelelően ellenőrzött fejlesztési commit/PR részeként mentsd. Docs-only/futásnapló-only commitban `[skip ci]` használandó. A futásnapló **nem indokol** külön Worker-deployt vagy drága CI-rerunt.
- Ha ugyanabban a commitban futáskód is változik, ne használd a `[skip ci]` jelölést a szükséges runtime CI megkerülésére.
- Ha a 0 Ft-os quota, network vagy egyéb kapu akadályozza a pusht, a JSON a helyi munkafában marad; jelentsd **NOT PUSHED / UNVERIFIED** állapottal. Helyi adat csak akkor válik több környezetben tartóssá, ha megőrzött munkafában marad vagy biztonságos push történik.
- Ne írj naplóba tokent, jelszót, személyes tartalmat vagy felesleges nyers parancskimenetet. Ne hozz létre külön automatizációt csak a mérés miatt.
- Ha hiányzik a `start` vagy `finish`, a hiányzó múltbeli időt **ne becsüld ki** commitokból. A félbeszakadt `pending` nem lezárt munkamenet.

## Riport és elkészülési becslés

```sh
node tests/dev-metrics.mjs report --days=7 --remaining-hours=300
node tests/dev-metrics.mjs report --days=7 --remaining-hours=300 --json=true
node --test tests/dev-metrics.test.mjs
```

A kimenet külön méri a naplózott teljes futásidőt, és az olyan kód-/tesztfutások idejét, amelyhez az ügynök `PASS` állapotot és bizonyítékot rendelt. A szám **falióra szerinti eltelt idő**, az explicit szünet nélkül; nem mért CPU-/token-/szigorúan aktív Codex-idő, és nem önmagában teljesítmény. Egyhetes ablak és legalább öt lezárt futás nélkül a dátum `null` marad. A 300 óra egy korábbi **becslés**, nem a tervből automatikusan kimért backlog; a tényleges hátralévő időt csak a lezárt tervpontok és minőségkapuk alapján lehet felülvizsgálni.

A mérés a jelenlegi óránkénti fejlesztési automatizációhoz az `AGENTS.md` kötelező munkaindítási szabályán keresztül csatlakozik. Az automatizáció csak akkor gyűjt új adatot, ha ténylegesen végrehajtja a shell-parancsokat; pusztán az ütemezés engedélyezése nem garantál futásnaplót.
