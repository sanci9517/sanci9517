# Sanci9517 V2 — VÉGLEGES MASTER FEJLESZTÉSI TERV

> Ez a dokumentum a Sanci9517 projekt végleges, hosszú távú iránytűje. A korábbi részletes `docs/DEVELOPMENT-PLAN.md` minden meglévő pontja, ellenőrzött státusza és tesztelési eredménye megmarad. Ez a dokumentum azokat nem törli és nem helyettesíti, hanem egységes végső célrendszerbe rendezi és kiegészíti.

## 0. Legfontosabb szabályok

1. A már elkészült és ellenőrzött funkciót nem építjük újra csak azért, mert a végleges terv bővült.
2. A meglévő tervpontok és státuszok megmaradnak.
3. Új követelmény csak kiegészítésként kerül be, és a meglévő rendszerhez illesztjük.
4. A weboldalnak AI nélkül is teljes értékű, önállóan használható streamer platformnak kell lennie.
5. Az AI nem egy később ráragasztott chatbot lesz: a végső cél egy AI-val integrált Sanci9517 platform.
6. Az AI-fejlesztés csak a teljes weboldal, CMS, Visual Editor, biztonság, adatkezelés és tesztelés stabil lezárása után indul.
7. Már az első fázistól AI-ready adat- és műveleti modellt építünk.
8. Minden érdemi fejlesztésnél: terv → kód → GitHub → Cloudflare deploy → API/D1 → böngészőteszt → felhasználói visszaigazolás → státuszfrissítés.
9. Sikertelen teszt esetén nincs továbblépés.
10. `[x]` kizárólag ténylegesen ellenőrzött és a felhasználó által visszaigazolt pont.

---

# 1. VÉGLEGES CÉL

**Sanci9517 = teljes értékű streamer weboldal + saját CMS + teljes Visual Editor + adat/integrációs platform + későbbi AI platform.**

A végső lánc:

`Public Website → Admin/CMS → Visual Editor → Structured Page Model → Cloudflare/D1/R2/KV → Integrations → AI Orchestrator → Agents → Memory → Learning → Stream Vision → Stream Assistant → Content Engine → Analytics → Research → Controlled Autonomy`

A rendszer AI nélkül is teljes értékű. Az AI később ugyanazokat a strukturált adatokat, API-kat és biztonságos műveleteket használja, amelyeket a felhasználó és az admin már használ.

---

# 2. MEGLÉVŐ ÁLLAPOT MEGŐRZÉSE

A részletes master checklist hivatalos forrása továbbra is:

`docs/DEVELOPMENT-PLAN.md`

Megőrzendő meglévő területek többek között:

- projekt- és Cloudflare alapok
- GitHub/branch/deploy
- D1
- szerveroldali tárolás
- auth/RBAC/session
- admin/CMS
- oldalkézelés
- schedule
- public API-k
- Visual Editor core
- elemkezelés
- selection
- X/Y
- width/height
- delete/duplicate
- multi-select
- group/ungroup
- drag/drop alap
- snap/guides
- overlap
- layer order
- lock/hide/rename
- undo/redo
- canvas/zoom/grid
- inspector
- nested hierarchy fejlesztési pontjai
- layout engine
- responsive rendszer
- typography
- appearance
- interaction
- animation
- media
- draft/publish
- versioning
- rollback
- autosave
- backup/restore
- audit log
- public pages
- social integrations
- VOD/Shorts
- SEO
- accessibility
- performance
- security
- teljes tesztelési rendszer
- későbbi AI-rendszer minden korábbi pontja

**Semmilyen meglévő részletes pontot nem törlünk vagy cserélünk le pusztán a végső terv frissítése miatt.**

---

# 3. FÁZIS A — TELJES, AI NÉLKÜL IS HASZNÁLHATÓ WEBOLDAL

## 3.1 Publikus alap

- Főoldal
- Twitch oldal
- YouTube oldal
- TikTok oldal
- Adásrend
- Következő adás
- visszaszámláló
- Élő/Offline állapot
- VOD
- Shorts/Clips
- Rólam
- Közösség
- Discord
- Kapcsolat
- Támogatás
- Szponzor/üzleti oldal
- Média/Press Kit
- dinamikus aloldalak
- 404 oldal
- hibaállapotok
- üres állapotok
- betöltési állapotok

## 3.2 Streamer funkciók

- Twitch státusz
- aktuális játék
- aktuális stream cím
- nézőszám, ahol elérhető
- következő stream
- adásrend kezelése
- múltbeli adások
- VOD lista
- Shorts/clip lista
- kiemelt tartalmak
- közösségi linkek
- Discord belépés
- támogatási lehetőségek
- üzleti/szponzor kapcsolat
- megosztási lehetőségek

## 3.3 Tartalomkezelés

- minden fontos publikus tartalom adminból kezelhető
- szöveg
- kép
- videó
- link
- gomb
- kártya
- lista
- banner
- kiemelés
- CTA
- social link
- SEO metaadat
- Open Graph adatok
- strukturált adatok
- oldal státusz
- draft/publish

## 3.4 Design és UX

- mobil
- tablet
- desktop
- egységes navigáció
- egységes menü
- egységes kártyák
- egységes spacing
- egységes typography
- egységes ikonhasználat
- reszponzív töréspontok
- loading/empty/error állapotok
- accessibility
- keyboard navigation
- kontraszt
- teljesítmény

---

# 4. FÁZIS B — ADMIN + CMS

## 4.1 Admin

- Auth
- session kezelés
- RBAC
- dashboard
- oldalak
- tartalom
- média
- schedule
- social
- VOD
- Shorts
- analytics
- SEO
- settings
- integrations
- system status
- error log
- audit log

## 4.2 Tartalommodell

- pages
- sections
- components
- elements
- media
- schedule items
- social accounts
- stream state
- SEO
- site settings
- versions
- audit records

## 4.3 Adatbiztonság

- autosave
- draft
- publish
- versioning
- undo/redo
- rollback
- backup
- restore
- import/export
- change history
- audit log
- concurrent modification védelem
- hibás mentés elleni védelem

---

# 5. FÁZIS C — TELJES VISUAL EDITOR

A meglévő `DEVELOPMENT-PLAN.md` részletes Visual Editor pontjai mind megmaradnak. A végleges cél az alábbi teljes kép.

## 5.1 Core

- oldal létrehozás
- megnyitás
- mentés
- törlés
- duplikálás
- elem hozzáadás
- elem kiválasztás
- elem szerkesztés
- rétegek
- inspector
- undo/redo
- preview
- draft
- publish

## 5.2 Elemrendszer

- section
- container/box
- columns
- column
- heading
- text
- image
- button
- divider
- spacer
- video/embed
- list
- card
- social
- CTA
- streamer-specifikus blokkok

## 5.3 Hierarchy

- valódi parent/child modell
- root container
- section/container
- nested children
- reparent
- reorder
- layer tree
- breadcrumb
- drop zone
- invalid nesting védelem
- hierarchy persistence
- hierarchy undo/redo

## 5.4 Layout

- sizing
- spacing
- display
- Flex
- Grid
- positioning
- overflow
- alignment
- distribution
- responsive layout
- desktop/tablet/mobile külön szabályok

## 5.5 Editor UX

- canvas
- zoom
- fit screen
- grid
- guides
- snap
- ruler
- safe area
- device frame
- X-Ray
- full page
- focus element
- resizable panels
- command palette
- keyboard shortcuts
- quick actions
- property search

## 5.6 Inspector

- basic
- layout
- appearance
- typography
- responsive
- interaction
- accessibility
- SEO/content
- advanced
- data
- validation
- reset
- property search
- presets/tokens

## 5.7 Reusable rendszer

- reusable components
- templates
- global header
- global navigation
- global footer
- reusable Stream Card
- reusable Schedule Card
- reusable VOD Card
- reusable Social Card
- reusable CTA
- reusable Twitch Live block

---

# 6. FÁZIS D — AI-READY ALAPOK AZ AI ELŐTT

Ez még nem valódi AI-fejlesztés.

## 6.1 Stabil azonosítók

- page ID
- section ID
- component ID
- element ID
- action ID
- version ID
- media ID
- schedule ID

Az azonosítók stabilak maradnak átrendezéskor és szerkesztéskor, amennyiben az elem ugyanaz marad.

## 6.2 Strukturált page model

A weboldal ne csak HTML legyen, hanem géppel értelmezhető modell:

`page → sections → components → elements → properties → actions`

## 6.3 Action model

A későbbi AI ugyanazokat a műveleteket használja, mint a Visual Editor:

- CREATE_PAGE
- DELETE_PAGE
- ADD_SECTION
- DELETE_SECTION
- ADD_COMPONENT
- DELETE_COMPONENT
- ADD_ELEMENT
- DELETE_ELEMENT
- MOVE_ELEMENT
- REPARENT_ELEMENT
- RESIZE_ELEMENT
- CHANGE_TEXT
- CHANGE_STYLE
- CHANGE_LAYOUT
- CHANGE_RESPONSIVE_RULE
- DUPLICATE_ELEMENT
- HIDE_ELEMENT
- SHOW_ELEMENT
- LOCK_ELEMENT
- UNLOCK_ELEMENT
- SAVE_DRAFT
- PREVIEW
- PUBLISH_PAGE
- ROLLBACK

## 6.4 Biztonság

- schema validation
- input validation
- permission validation
- operation validation
- preview-before-apply
- audit
- versioning
- rollback
- rate limiting ahol szükséges
- veszélyes műveletek jóváhagyása

---

# 7. FÁZIS E — TELJES TESZT ÉS STABILIZÁLÁS

## 7.1 Tesztkategóriák

- unit
- integration
- API
- D1
- E2E
- smoke
- regression
- security
- accessibility
- performance
- mobile
- tablet
- desktop
- Cloudflare production
- backup/restore
- disaster recovery

## 7.2 Teljes elfogadási feltétel

A weboldal csak akkor tekinthető késznek, ha:

- működik
- ment
- újratöltés után megmarad
- D1/R2/KV megfelelően működik
- public oldalon megjelenik
- adminból kezelhető
- preview működik
- publish működik
- rollback működik
- hibás input nem töri el
- jogosultságok működnek
- mobil működik
- tablet működik
- desktop működik
- security tesztelt
- accessibility tesztelt
- performance tesztelt
- backup/restore tesztelt
- regresszió tesztelt

**Ezt követően nyílik meg a valódi AI-fejlesztési kapu.**

---

# 8. FÁZIS F — AI CORE

- AI Orchestrator
- Agent Registry
- Tool Registry
- Model Registry
- Task Planner
- Context Selector
- Permission Checker
- Approval Flow
- Execution Engine
- Result Evaluator
- Error Recovery
- Audit
- Cost/Token Tracking
- Model Fallback

Működési ciklus:

**Observe → Understand → Plan → Ask/Approve → Execute → Test → Verify → Report → Learn**

---

# 9. FÁZIS G — MULTI-MODEL

- OpenAI
- Anthropic/Claude
- Google Gemini
- open-source modellek
- local modellek, ahol indokolt

Model Router:

- feladat
- minőség
- sebesség
- költség
- korábbi eredmény
- hibaarány
- fallback
- A/B összehasonlítás

Nincs kötelező végleges modelllista; a rendszer vendorfüggetlen marad.

---

# 10. FÁZIS H — SPECIALIZÁLT AGENTEK

- Web Engineer Agent
- Visual Editor Agent
- QA Agent
- Cloudflare Engineer Agent
- GitHub Engineer Agent
- Stream Agent
- Content Agent
- Research Agent
- Analytics Agent

Mindegyik saját permission boundary-val rendelkezik.

---

# 11. FÁZIS I — AI WEB ENGINEER

- repository feltérképezése
- architektúra megértése
- issue felismerés
- terv készítése
- kódmódosítás
- build
- teszt
- browser ellenőrzés
- screenshot
- diff
- jelentés
- approval
- publish
- rollback

Az AI nem kap korlátlan production jogosultságot.

---

# 12. FÁZIS J — GITHUB + CLOUDFLARE AI ENGINEER

## GitHub

- repository olvasás
- branch
- diff
- commit
- PR
- review
- controlled merge
- rollback

## Cloudflare

- Worker
- D1
- R2
- KV
- Durable Objects, ha szükséges
- bindings
- migrations
- deployment
- logs
- metrics
- health

Production művelet csak megfelelő permission/approval után.

---

# 13. FÁZIS K — BROWSER + QA AI

- Playwright determinisztikus tesztmotor
- AI browser layer szükség esetén
- screenshot
- tracing
- console
- network
- desktop
- tablet
- mobile
- navigation
- form
- editor
- preview
- publish
- regression

---

# 14. FÁZIS L — VISUAL EDITOR AI

Természetes nyelvű kérésből:

`request → interpretation → structured plan → preview → desktop test → mobile test → diff → approval → apply → rollback if needed`

Példa:

„Tedd a következő stream kártyát középre, legyen nagyobb, mobilon pedig legyenek egymás alatt.”

Az AI nem közvetlenül véletlenszerű CSS-t ír át, hanem a strukturált page modelt módosítja.

---

# 15. FÁZIS M — MEMORY

- project memory
- technical memory
- decision memory
- error memory
- solution memory
- preference memory
- stream memory
- content memory
- experience memory
- retrieval
- relevance
- correction
- deletion

Cél:

**mit próbáltunk → mi történt → mi működött → mi nem → mit tanultunk**

---

# 16. FÁZIS N — LIVE STREAM VISION

Bemenetek:

- video
- audio
- Twitch chat
- OBS state
- stream telemetry

Elemzés:

- gameplay
- fontos esemény
- reakció
- csend
- hangerő
- mikrofon
- chat aktivitás
- chat téma
- érdekes pillanat
- highlight

A modell mindig a technikailag, minőségileg és licencileg megfelelő aktuális megoldás lesz.

---

# 17. FÁZIS O — STREAM ASSISTANT

- csend felismerése
- halk beszéd
- mikrofonhiba
- játékhanghiba
- OBS probléma
- chat elemzés
- témaváltási javaslat
- beszédtéma
- stream ötlet
- jó pillanat
- clip marker
- highlight lista
- stream összefoglaló
- stream utáni elemzés
- teljesítményjavaslat

Nem zavarja folyamatosan a streamet; prioritás, cooldown és felhasználói beállítás alapján jelez.

---

# 18. FÁZIS P — OBS CONTROL

- OBS WebSocket
- scene lista
- scene váltás
- mic mute/unmute
- source visibility
- recording state
- streaming state
- action log
- emergency stop
- safe confirmation

Veszélyes vagy visszafordíthatatlan művelet explicit engedélyhez kötött.

---

# 19. FÁZIS Q — CONTENT ENGINE

- clip detection
- highlight detection
- video extraction
- vertical crop
- facecam handling
- captions
- title
- hook
- description
- hashtags
- variants
- preview
- performance evaluation
- local save
- R2 save
- manual approval
- későbbi controlled auto-publish

---

# 20. FÁZIS R — STREAM ANALYTICS

- viewers
- average viewers
- peak viewers
- chat rate
- follower gain
- subscriber gain, ahol elérhető
- game/category
- title
- start/end
- silent periods
- engagement periods
- highlights
- clip conversion
- TikTok performance
- YouTube performance
- cross-platform comparison
- weekly report
- monthly report
- trend detection
- recommendations

---

# 21. FÁZIS S — LEARNING ENGINE

**OBSERVE → DECIDE → ACT → MEASURE → EVALUATE → REMEMBER → IMPROVE**

- outcome tracking
- action/result párok
- strategy memory
- skill memory
- success/failure classification
- evaluation signals
- strategy comparison
- confidence
- regression detection
- learning reports

Az AI nem módosíthatja korlátlanul saját core rendszerét.

---

# 22. FÁZIS T — RESEARCH AGENT

Figyeli:

- új AI modellek
- vision/video modellek
- coding agentek
- browser agentek
- memory rendszerek
- agent frameworkök
- open-source projektek
- licencek
- dependency-k
- költség
- biztonság
- teljesítmény

Automatikus integráció nincs. A Research Agent jelentést készít; a beépítés kontrollált döntés.

---

# 23. FÁZIS U — LICENC / JOGI TISZTASÁG

Minden külső komponensnél külön vizsgálat:

- source code license
- model license
- model weights
- dataset license
- dependency licenses
- API/service terms
- commercial use
- attribution
- notices
- egyéb felhasználási korlátozások

Ez mérnöki/licencszűrés, nem jogi tanácsadás.

---

# 24. FÁZIS V — AI PERMISSION MODEL

Szintek:

0. Observe
1. Analyze
2. Suggest
3. Execute with approval
4. Controlled execution
5. Production automation csak szűken meghatározott biztonságos műveletekre

A core rendszer önkényes önmódosítása tiltott.

---

# 25. FÁZIS W — CONTROLLED AUTONOMY

**Observe → Analyze → Plan → Ask/Approve → Execute → Test → Verify → Report → Learn**

Példa:

hiba felismerése → elemzés → izolált javítás → teszt → desktop/mobile ellenőrzés → jóváhagyás → deploy → production teszt → memóriafrissítés.

---

# 26. FÁZIS X — KÉSŐBBI SAJÁT SPECIALIZÁLT MODELLEK

Csak megfelelő mennyiségű saját tapasztalat és adat után:

- Sanci Web Engineer Model
- Sanci Stream Assistant Model
- Sanci Content Model
- Sanci Experience/Strategy Model

Nem cél kezdetben egy általános „saját ChatGPT” létrehozása.

---

# 27. KÖTELEZŐ ARCHITEKTURÁLIS ELV

Minden jelentős funkcióra fel kell tenni ezt a kérdést:

> **Használható teljes értékűen AI nélkül is, és később ugyanaz a funkció vezérelhető strukturáltan AI által is?**

Ha nem, az architektúrát még az AI-fázis előtt javítani kell.

---

# 28. FEJLESZTÉSI ÁLLAPOT ÉS FOLYTATÁSI PONT

Aktív repository:

`sanci9517/sanci9517`

Aktív branch:

`v2/foundation`

A projekt jelenlegi fejlesztési területe továbbra is a **Visual Editor stabilizálása és tesztelése**.

A legutóbbi felhasználói visszaigazolás alapján az **Overlap / átfedés tesztje rendben működött**, és az ehhez tartozó meglévő pont már kipipálható volt; ezt nem kezeljük új fejlesztési feladatként.

A következő munkát a részletes `docs/DEVELOPMENT-PLAN.md` aktuális `[ ]` pontjai közül a ténylegesen következő, még nem tesztelt Visual Editor feladattal folytatjuk.

**Nem kezdjük újra a kész részeket. Nem ugrunk előre AI-ra. Nem hagyjuk el a részletes checklist pontjait.**

---

# 29. STÁTUSZKEZELÉS

- `[x]` kész és felhasználó által ellenőrzött
- `[~]` részben kész / további munka kell
- `[!]` blokkoló hiba
- `[ ]` még nincs kész

A végső terv módosítása önmagában nem változtatja meg egyetlen meglévő pont státuszát sem.

---

# 30. VÉGSŐ DEFINITION OF DONE

A Sanci9517 projekt akkor tekinthető véglegesnek, ha:

1. A publikus weboldal AI nélkül teljes értékűen használható.
2. Az admin/CMS a szükséges tartalmakat kezeli.
3. A Visual Editor valódi, használható weboldal-szerkesztő.
4. A szerveroldali adatkezelés stabil.
5. A mentés, preview, publish, versioning, rollback, backup és restore működik.
6. A weboldal mobilon, tableten és desktopon stabil.
7. A biztonság, accessibility, SEO és performance ellenőrzött.
8. A teljes rendszer regressziótesztelt.
9. A page/component/element/action modell géppel értelmezhető.
10. Az AI biztonságos permission és approval rendszeren keresztül használhatja a platformot.
11. Az AI képes a weboldalt, az editort, a kódot, a tesztelést és később a streamet is támogatni.
12. A memória és tanulás nem puszta chat history, hanem strukturált tapasztalati rendszer.
13. A több modell és több agent használata vendorfüggetlen architektúrában történik.
14. A kontrollált autonómia tesztelhető és visszafordítható.
15. A külső komponensek licencelése és biztonsága ellenőrzött.

**Ez a végső cél. A fejlesztést mindig a meglévő részletes checklist aktuális ellenőrzött állapotából folytatjuk.**
