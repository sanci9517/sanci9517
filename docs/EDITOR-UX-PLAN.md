# Sanci9517 Visual Editor — UX és használhatósági terv

## 1. Cél

Az editor minden hozzáadható elemét magyar, egyértelmű megnevezéssel kell megjeleníteni. Az angol technikai típusnevek nem jelenhetnek meg zavaró módon a felhasználói felületen.

## 2. Elemkártyák

Minden elemnél legyen:

- magyar megnevezés;
- rövid, érthető funkcióleírás;
- információ ikon (`i`);
- az információs panelből egyértelműen derüljön ki, mire való az elem és mikor érdemes használni.

Példák:

- Gomb — „Műveletet vagy hivatkozást indító gomb.”
- Felugró ablak — „Kattintásra, időzítésre vagy feltételre megjelenő ablak.”
- Menetrend — „A streamidőpontok és következő adások megjelenítése.”
- Twitch élő állapot — „Megmutatja, hogy a Twitch-csatorna élőben van-e.”

## 3. Információs popup

Az `i` ikon megnyit egy kis információs felületet. Ennek későbbi bővítése:

- Mire való?
- Mit jelenít meg?
- Milyen beállításai vannak?
- Milyen adatot igényel?
- Példa használat.
- Sanci9517-specifikus elemeknél milyen külső szolgáltatáshoz kapcsolódik.

A popup nem módosíthatja az elemet és nem zavarhatja az elem hozzáadását.

## 4. Nyelvi szabály

A felhasználó számára látható editor-felület elsődleges nyelve magyar. Technikai azonosítók, API-típusok és belső kódnevek csak ott jelenhetnek meg, ahol fejlesztői vagy haladó beállítás miatt valóban szükségesek.

## 5. Tesztkövetelmény

Az editor funkcióinak tesztelése csak akkor kezdődik, amikor:

1. minden elemkategória látható;
2. az elemnevek érthetők;
3. a kereső magyar nevekre is működik;
4. az információs ikonok működnek;
5. az információs popup nem töri meg az editor működését.

Ezután külön tesztelendő az elem hozzáadása, kijelölése, mozgatása, méretezése, Inspector, Layers, Undo/Redo, mentés D1-be, újratöltés, előnézet és publikálás.

## 6. Következő fejlesztési irány

A jelenlegi információs réteg az első UX alap. Később minden elemhez részletes konfigurációs súgó készül, hogy az editor használatához ne kelljen HTML/CSS/JavaScript ismeret.
