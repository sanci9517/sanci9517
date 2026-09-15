# Sanci9517 — VÉGLEGES FEJLESZTÉSI ROADMAP

> **Ez a dokumentum a Sanci9517 projekt végleges fejlesztési iránytűje.** A fejlesztést ebből a roadmapből, szigorú sorrendben végezzük. A korábbi `docs/DEVELOPMENT-PLAN.md` a részletes történeti/master checklist; ez a dokumentum rögzíti a végleges stratégiai sorrendet és az AI végleges célarchitektúráját.
>
> **Fő szabály:** először a teljes weboldal készül el és kerül stabil, tesztelt állapotba. **Valódi AI-fejlesztés csak ezután kezdődik.**
>
> **Módszer:** tervpont → kód → GitHub → Cloudflare deploy → API/D1 ellenőrzés → böngészőteszt → felhasználói visszaigazolás → `[x]` → következő pont.
>
> `[x]` = ténylegesen ellenőrzött és a felhasználó által visszaigazolt. `[~]` = részleges. `[!]` = blokkoló. `[ ]` = nincs kész.

---

# 1. VÉGLEGES CÉL

A Sanci9517 projekt végső rendszere:

**Streamer weboldal → Admin/CMS → Visual Editor → Cloudflare/GitHub → AI Engineer → QA AI → Memory → Learning → Stream Vision → Stream Assistant → Content Engine → Analytics → Research Agent → Controlled Autonomy**

Nem egyszerű chatbotot építünk, hanem egy több-agentből és több modellből álló, kontrollált AI-platformot.

---

# 2. FEJLESZTÉSI SORREND

## FÁZIS A — TELJES WEBOLDAL

- [ ] Core architektúra véglegesítése
- [ ] Cloudflare Worker stabilizálása
- [ ] D1/R2/KV architektúra
- [ ] API réteg
- [ ] Auth/RBAC
- [ ] Admin/CMS
- [ ] Visual Editor
- [ ] valódi parent/child hierarchy
- [ ] layout engine
- [ ] Flex
- [ ] Grid
- [ ] responsive rendszer
- [ ] typography
- [ ] appearance/CSS engine
- [ ] interaction/state
- [ ] animation
- [ ] page management
- [ ] draft/publish
- [ ] versioning
- [ ] rollback
- [ ] autosave
- [ ] backup/restore
- [ ] media/R2
- [ ] schedule
- [ ] Twitch
- [ ] YouTube
- [ ] TikTok
- [ ] Discord/community
- [ ] VOD/clip/Shorts
- [ ] public pages
- [ ] design system
- [ ] SEO
- [ ] accessibility
- [ ] analytics
- [ ] monitoring
- [ ] security
- [ ] performance
- [ ] import/export
- [ ] forms
- [ ] sponsor/business hub
- [ ] localization architecture
- [ ] privacy/legal

## FÁZIS B — TELJES WEBOLDAL TESZT

- [ ] Unit
- [ ] Integration
- [ ] E2E
- [ ] Smoke
- [ ] Security
- [ ] Accessibility
- [ ] Performance
- [ ] Mobile regression
- [ ] Desktop regression
- [ ] Cloudflare production verification
- [ ] Backup/restore drill
- [ ] Disaster recovery drill
- [ ] Full regression

## FÁZIS C — AI-READY ZÁRÁS

AI még nem fut, de a weboldal struktúrája már AI-kompatibilis:

- [ ] strukturált page model
- [ ] strukturált component model
- [ ] stabil page/section/component/element ID-k
- [ ] stabil action ID-k
- [ ] géppel olvasható schema
- [ ] validálható műveletek
- [ ] preview-before-apply
- [ ] audit log
- [ ] versioning
- [ ] rollback
- [ ] permission model
- [ ] API/service boundaries dokumentálva
- [ ] GitHub integrációs pontok
- [ ] Cloudflare integrációs pontok
- [ ] browser automation/test pontok
- [ ] Visual Editor AI-hookok

**Gate:** csak akkor indul AI-fejlesztés, ha a weboldal teljes elfogadási tesztje sikeres.

---

# 3. AI-1 — AI CORE

## Orchestrator

- [ ] Sanci AI Orchestrator
- [ ] agent registry
- [ ] tool registry
- [ ] model registry
- [ ] task planner
- [ ] context selector
- [ ] permission checker
- [ ] approval flow
- [ ] execution engine
- [ ] result evaluator
- [ ] error recovery
- [ ] audit
- [ ] cost/token tracking
- [ ] model fallback

## Működési ciklus

**Observe → Understand → Plan → Ask/Approve → Execute → Test → Verify → Report → Learn**

---

# 4. AI-2 — MULTI-MODEL RENDSZER

Nem kötjük a rendszert egyetlen modellhez.

## Modellek

- [ ] OpenAI
- [ ] Anthropic/Claude
- [ ] Google Gemini
- [ ] open-source modellek
- [ ] local modellek, ahol értelmes

## Model Router

- [ ] feladat alapján választás
- [ ] minőség alapján választás
- [ ] sebesség alapján választás
- [ ] költség alapján választás
- [ ] korábbi eredmények alapján választás
- [ ] fallback
- [ ] A/B összehasonlítás
- [ ] model performance memory

**A konkrét modelllista később cserélhető; az architektúra nem függhet egyetlen szolgáltatótól.**

---

# 5. AI-3 — AGENT RENDSZER

## Web Engineer Agent

- [ ] HTML/CSS/JS/TS
- [ ] API
- [ ] Worker
- [ ] SQL
- [ ] hibakeresés
- [ ] refaktor
- [ ] build
- [ ] teszt

## Visual Editor Agent

- [ ] page model értelmezése
- [ ] component model értelmezése
- [ ] layout módosítás
- [ ] styling módosítás
- [ ] responsive módosítás
- [ ] preview
- [ ] rollback

## QA Agent

- [ ] browser teszt
- [ ] screenshot
- [ ] console ellenőrzés
- [ ] regression
- [ ] bug reprodukció
- [ ] bug fix ellenőrzés

## Cloudflare Engineer Agent

- [ ] Worker
- [ ] D1
- [ ] R2
- [ ] KV
- [ ] Durable Objects
- [ ] bindings
- [ ] migration
- [ ] deployment
- [ ] logs

## GitHub Engineer Agent

- [ ] repository megértés
- [ ] branch
- [ ] diff
- [ ] commit
- [ ] PR
- [ ] review
- [ ] rollback

---

# 6. AI-4 — AI WEB ENGINEER

Az első valódi nagy AI-képesség a weboldal mérnöki kezelése.

- [ ] repository teljes feltérképezése
- [ ] kód megértése
- [ ] architektúra megértése
- [ ] issue felismerése
- [ ] módosítási terv
- [ ] kódmódosítás
- [ ] build
- [ ] teszt
- [ ] browser ellenőrzés
- [ ] screenshot
- [ ] diff
- [ ] jelentés
- [ ] human approval
- [ ] publish
- [ ] rollback

Az AI nem manipulálhat véletlenszerű DOM/CSS részleteket; strukturált műveleteket használ.

Példák:

`CHANGE_TEXT(element_id, value)`

`MOVE_ELEMENT(element_id, parent_id, index)`

`RESIZE_ELEMENT(element_id, width, height)`

`CHANGE_STYLE(element_id, property, value)`

`ADD_SECTION(page_id, component_type)`

`DELETE_ELEMENT(element_id)`

`PUBLISH_PAGE(page_id)`

`ROLLBACK(version_id)`

---

# 7. AI-5 — GITHUB + CLOUDFLARE ENGINEER

Az AI kontrollált hozzáférést kap:

### GitHub

- [ ] read repository
- [ ] branch kezelés
- [ ] diff
- [ ] commit
- [ ] PR
- [ ] merge approval
- [ ] rollback

### Cloudflare

- [ ] Worker
- [ ] D1
- [ ] R2
- [ ] KV
- [ ] Durable Objects
- [ ] deploy
- [ ] logs
- [ ] metrics
- [ ] health

**Production módosítás csak permission/approval után.**

---

# 8. AI-6 — BROWSER + QA

## Eszközök

- [ ] Playwright mint determinisztikus browser/E2E tesztmotor
- [ ] Browser Use mint AI browser-agent réteg, ha a feladat ezt indokolja
- [ ] screenshot/tracing
- [ ] console/network ellenőrzés

## Tesztek

- [ ] desktop
- [ ] tablet
- [ ] mobile
- [ ] menü
- [ ] gombok
- [ ] formok
- [ ] navigation
- [ ] editor
- [ ] preview
- [ ] publish
- [ ] regression

---

# 9. AI-7 — VISUAL EDITOR AI

- [ ] természetes nyelvű módosítás
- [ ] page structure megértése
- [ ] element identification
- [ ] structured action plan
- [ ] preview
- [ ] desktop test
- [ ] mobile test
- [ ] diff
- [ ] user approval
- [ ] apply
- [ ] rollback

Példa:

> „Tedd a következő stream kártyát középre, legyen nagyobb, mobilon pedig jelenjenek meg egymás alatt.”

Az AI ezt tervvé, strukturált műveletekké és tesztelhető változássá alakítja.

---

# 10. AI-8 — MEMORY

Nem csak chat history.

- [ ] project memory
- [ ] technical memory
- [ ] decision memory
- [ ] error memory
- [ ] solution memory
- [ ] Sanci preference memory
- [ ] stream memory
- [ ] content memory
- [ ] experience memory
- [ ] memory retrieval
- [ ] memory relevance scoring
- [ ] memory correction
- [ ] memory deletion

A cél: **mit próbáltunk → mi történt → mi működött → mi nem → mit tanultunk.**

---

# 11. AI-9 — LIVE STREAM VISION

## Bemenetek

- [ ] video
- [ ] audio
- [ ] Twitch chat
- [ ] OBS state
- [ ] stream telemetry

## Elemzés

- [ ] gameplay
- [ ] fontos esemény
- [ ] reakció
- [ ] csend
- [ ] hangerő
- [ ] mikrofon
- [ ] chat aktivitás
- [ ] chat téma
- [ ] érdekes pillanat
- [ ] highlight

A vision stackben mindig az aktuálisan legjobb, licencileg és technikailag megfelelő modell kerül kiválasztásra; JoyAI-VL-Interaction jellegű realtime vision rendszerek referenciaértékűek, nem kötelező végleges komponensek.

---

# 12. AI-10 — STREAM ASSISTANT

- [ ] csend felismerése
- [ ] túl halk beszéd
- [ ] mikrofonhiba
- [ ] játékhanghiba
- [ ] OBS probléma
- [ ] chat elemzés
- [ ] témaváltási javaslat
- [ ] beszédtéma javaslat
- [ ] stream ötlet
- [ ] jó pillanat felismerés
- [ ] clip marker
- [ ] highlight lista
- [ ] stream összefoglaló
- [ ] stream utáni elemzés
- [ ] teljesítményjavaslat

Az AI nem zavarja folyamatosan a streamet; cooldown, fontosság és személyes preferencia alapján dönt a jelzésről.

---

# 13. AI-11 — OBS CONTROL

- [ ] OBS WebSocket
- [ ] scene lista
- [ ] scene váltás
- [ ] mic mute/unmute
- [ ] source visibility
- [ ] recording state
- [ ] streaming state
- [ ] safe action confirmation
- [ ] action log
- [ ] emergency stop

Minden veszélyes vagy visszafordíthatatlan művelet explicit jogosultsághoz kötött.

---

# 14. AI-12 — CONTENT ENGINE

- [ ] clip detection
- [ ] highlight detection
- [ ] video extraction
- [ ] vertical crop
- [ ] facecam handling
- [ ] captions
- [ ] title
- [ ] hook
- [ ] description
- [ ] hashtags
- [ ] multiple variants
- [ ] preview
- [ ] performance evaluation
- [ ] local save
- [ ] R2 save
- [ ] manual approval
- [ ] későbbi controlled auto-publish

---

# 15. AI-13 — STREAM ANALYTICS

- [ ] viewers
- [ ] average viewers
- [ ] peak viewers
- [ ] chat rate
- [ ] follower gain
- [ ] subscriber gain where available
- [ ] game/category
- [ ] title
- [ ] start/end
- [ ] silent periods
- [ ] engagement periods
- [ ] highlights
- [ ] clip conversion
- [ ] TikTok performance
- [ ] YouTube performance
- [ ] cross-platform comparison
- [ ] weekly report
- [ ] monthly report
- [ ] trend detection
- [ ] recommendations

---

# 16. AI-14 — LEARNING ENGINE

A központi tanulási ciklus:

**OBSERVE → DECIDE → ACT → MEASURE → EVALUATE → REMEMBER → IMPROVE**

- [ ] outcome tracking
- [ ] action/result párok
- [ ] strategy memory
- [ ] skill memory
- [ ] success/failure classification
- [ ] reward/evaluation signals
- [ ] strategy comparison
- [ ] confidence
- [ ] regression detection
- [ ] learning reports

Az AI nem módosíthatja korlátlanul saját core rendszerét. A tanulás elsősorban memória, konfiguráció, skill és stratégia szinten történik.

---

# 17. AI-15 — RESEARCH AGENT

- [ ] új AI modellek figyelése
- [ ] open-source projektek figyelése
- [ ] vision/video modellek
- [ ] coding agentek
- [ ] browser agentek
- [ ] memory rendszerek
- [ ] agent frameworkök
- [ ] licencek
- [ ] dependency-k
- [ ] költség
- [ ] biztonság
- [ ] teljesítmény
- [ ] cserejavaslat

**Automatikus integráció nincs.** A Research Agent jelentést készít, a beépítés kontrollált döntés.

---

# 18. AI-16 — LICENC ÉS JOGI SZŰRÉS

Minden külső komponensnél külön ellenőrizzük:

- [ ] source code license
- [ ] model license
- [ ] model weights
- [ ] dataset license
- [ ] dependency licenses
- [ ] API/service terms
- [ ] commercial use
- [ ] attribution
- [ ] notice requirements
- [ ] egyéb korlátozások

**Repository license ≠ model license ≠ dataset license.**

---

# 19. AI-17 — BIZTONSÁG ÉS JOGOSULTSÁG

### Level 0 — Observe
Csak figyel.

### Level 1 — Analyze
Elemez.

### Level 2 — Suggest
Javasol.

### Level 3 — Execute with approval
Jóváhagyással végrehajt.

### Level 4 — Controlled execution
Előre engedélyezett műveleteket önállóan végrehajt.

### Level 5 — Production automation
Csak szűk, biztonságos műveletekre.

**TILTOTT:** korlátlan core önmódosítás, titkos jogosultság-emelés, kontroll nélküli production publish, audit nélküli művelet.

---

# 20. AI-18 — CONTROLLED AUTONOMY

Végső működés:

**Observe → Analyze → Plan → Ask/Approve → Execute → Test → Verify → Report → Learn**

Példa hibajavításra:

1. AI észreveszi a hibát.
2. Reprodukálja.
3. Megkeresi az okot.
4. Tervet készít.
5. Tesztkörnyezetben módosít.
6. Buildel.
7. Desktop/mobile tesztet futtat.
8. Diffet és eredményt mutat.
9. Jóváhagyás után deployol.
10. Production smoke test.
11. Szükség esetén rollback.
12. Az eredményt elmenti a memóriába.

---

# 21. AI-19 — SAJÁT SPECIALIZÁCIÓ

Csak elegendő valós adat és tapasztalat után:

- [ ] Sanci Web Engineer specializáció
- [ ] Sanci Stream Assistant specializáció
- [ ] Sanci Content specializáció
- [ ] Sanci Experience/Strategy specializáció

**Nem saját ChatGPT-t építünk első lépésként.** A meglévő modelleket használjuk, majd a valódi Sanci-adatok alapján specializálunk.

---

# 22. VÉGLEGES ESZKÖZSTRATÉGIA

| Terület | Elsődleges irány | Megjegyzés |
|---|---|---|
| AI orchestration | Saját Sanci Orchestrator + megfelelő agent SDK | Szolgáltatófüggetlen architektúra |
| Fő modellek | OpenAI + Claude + Gemini + open/local | Model router választ |
| Agent referencia | Hermes Agent | memória/skill/self-improvement referencia |
| Coding referencia | OpenHands | AI software engineer referencia |
| Browser agent | Browser Use | AI böngésző-agent |
| Browser/E2E | Playwright | determinisztikus teszt |
| AI runtime | Cloudflare Agents / Durable Objects értékelve | állapot/realtime/agent runtime |
| Backend | Cloudflare Workers | végleges web backend |
| Database | D1 | strukturált adat |
| Media | R2 | fájlok/média |
| Cache/state | KV | csak megfelelő célra |
| Realtime state | Durable Objects | ahol indokolt |
| Tool protocol | MCP | kontrollált tool-integráció |
| Visual Editor | Saját Sanci Editor | AI ezt használja |
| Memory | Saját Sanci Memory Layer + bevált komponensek | tapasztalati memória |
| Stream vision | aktuálisan legjobb licencelhető vision stack | JoyAI-VL-Interaction referencia |
| Stream input | OBS + Twitch + audio/video | realtime |
| Content | Saját pipeline + megfelelő modellek | clip/Shorts |
| Research | Saját Research Agent | nincs automatikus integráció |
| Audit | Saját audit rendszer | minden AI action naplózva |
| Security | Saját permission/approval rendszer | core követelmény |

---

# 23. VÉGLEGES „DONE” FELTÉTELEK

## Weboldal kész, ha

- [ ] minden fő oldal működik
- [ ] admin működik
- [ ] editor működik
- [ ] hierarchy működik
- [ ] Flex/Grid működik
- [ ] responsive működik
- [ ] D1 persistence működik
- [ ] R2 működik
- [ ] Auth/RBAC működik
- [ ] Draft/Publish működik
- [ ] Version/Rollback működik
- [ ] Backup/Restore működik
- [ ] Twitch működik
- [ ] YouTube működik
- [ ] TikTok működik
- [ ] Discord működik
- [ ] Schedule működik
- [ ] VOD működik
- [ ] Analytics működik
- [ ] SEO működik
- [ ] Accessibility ellenőrzött
- [ ] Security ellenőrzött
- [ ] Performance ellenőrzött
- [ ] mobile ellenőrzött
- [ ] desktop ellenőrzött
- [ ] full regression passed

## AI indulhat, ha

**minden weboldal DONE feltétel teljesült és a felhasználó ezt visszaigazolta.**

---

# 24. FEJLESZTÉSI FEGYELEM

- [ ] Nem ugrunk át sikertelen pontot.
- [ ] Nem jelölünk késznek ellenőrzés nélkül.
- [ ] Nem módosítunk feleslegesen működő részt.
- [ ] Minden érdemi változás GitHub commit.
- [ ] Minden releváns változás Cloudflare-ben ellenőrzött.
- [ ] Szerveroldali adatot ellenőrizzük.
- [ ] Public oldalt ellenőrizzük.
- [ ] Mobile + desktop ellenőrzés szükséges.
- [ ] A master roadmap állapotát minden mérföldkőnél frissítjük.

---

# 25. AKTUÁLIS INDULÁSI PONT

**Projekt:** `sanci9517/sanci9517`

**Branch:** `v2/foundation`

**Cloudflare Worker:** `sanci9517-streamer-brand`

**Jelenlegi fő fókusz:** Visual Editor → valódi parent/child hierarchy és layout engine.

**AI állapot:** TERvezve, de még NEM fejlesztjük.

**Következő konkrét fejlesztési pont:** a jelenlegi master checklist szerinti következő, user által jóváhagyandó Visual Editor feladat.

**Végső sorrend:**

`WEBOLDAL → TELJES TESZT → AI-READY ZÁRÁS → AI CORE → AI WEB ENGINEER → QA → MEMORY → STREAM VISION → STREAM ASSISTANT → CONTENT → ANALYTICS → LEARNING → RESEARCH → CONTROLLED AUTONOMY → SAJÁT SPECIALIZÁCIÓ`

---

# 26. VÁLTOZTATHATATLANSÁGI SZABÁLY

Ez a roadmap a végleges stratégiai terv. Új technológia vagy modell megjelenésekor **az eszköz cserélhető**, de a cél, a fejlesztési sorrend, a tesztelési fegyelem és a biztonsági elvek nem változnak.

Csak valóban új, előre nem látható követelmény esetén készülhet új tervmódosítás.
