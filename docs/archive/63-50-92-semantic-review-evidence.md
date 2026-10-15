# 63.50.92 — Szemantikai ellenőrzési munkalap (bizonyíték, nem második terv)

**Forrás:** `docs/SANCI9517-CREATOR-PLATFORM-PLAN.md`, `v2/foundation`, 54.x követelmények, 63.50.91 lexikai triage. **Állapot:** OPEN / NOT PASS. Ez a fájl az audit forrásjegyzete; a kanonikus terv fejlécének kurzorát és státuszát nem módosítja.

## Az első tíz NO LEXICAL EVIDENCE sor — kézi domainhatár-besorolás

| Forrás-ID | Követelmény | Kanonikus tulajdonos (javaslat, ellenőrizendő) | Többi felület szerepe | Hiányzó bizonyíték |
|---|---|---|---|---|
| 54.3.01 | Logóvariáns, szín, font, ikonstílus, vizuális szabály | Brand Kit / design system | Visual Editor fogyasztja a tokeneket | 24. fejezet megfelelő ID és teljes contract |
| 54.3.05 | SVG/PNG/WebP export és méretek | Brand Kit export szolgáltatás; Asset registry az elkészült fájl gazdája | Editor / publikus web csak használja | Export méretek, transzformáció, licenc, R2/D1 kapcsolat |
| 54.4.02 | Kép, videó, hang, ikon, font, dokumentum, thumbnail, export | Assets / egyetlen resource registry | Content Studio és Editor ID alapján hivatkozik | MIME, biztonság, verzió, tárolás és referenciaéletciklus |
| 54.4.06 | Használati helyek, függőség és biztonságos törlés | Assets / resource dependency graph | Minden fogyasztó referenciát regisztrál | Törlés/archiválás blokkoló és visszaállítási teszt |
| 54.4.07 | Metaadatváltozás minden hivatkozási helyen | Assets / canonical metadata | Felületek ugyanazt az ID-t oldják fel | Cache invalidation, stale/permission tesztek |
| 54.5.06 | Szinkronnapló, utolsó siker/hiba, resync, konfliktus | Integrations / provider sync service | Admin dashboard állapotot olvas | Retry, idempotencia, ownership, hibakezelés |
| 54.5.08 | Nem támogatott funkció és alternatív út | Integrations / provider capability registry | Content/OBS/Automation képesség szerint tilt vagy alternatívát mutat | Provider policy, fallback, jogosultság és UI acceptance |
| 54.6.02 | Streamcím, játék, kezdés, nézőszám és metrikák | Live / provider state; Schedule csak a saját eseményrekordját birtokolja | Public live block és Analytics csak olvas | Provider-freshness, manuális override, ownership |
| 54.6.04 | Egyetlen adásrend: esemény, ismétlődés, időzóna, ütközés | Schedule / schedule_items canonical domain | Editor schedule node csak megjelenít | Recurrence, DST, conflict, CRUD, több felület konzisztencia |
| 54.7.01 | OBS párosítás, auth, reconnect, diagnosztika | Stream Studio / OBS connection service | Integrations menü kapcsolódási pont; nem második OBS-állapot | Credential kezelés, reconnect, támogatott API, negatív tesztek |

**Döntési szabály:** a fenti tulajdonosok előzetes architekturális besorolások, nem igazolt stabil ID-megfeleltetések. Egyetlen sor sem kap PASS-t, amíg a 24., 49., 54. és 63.x releváns forrásmezői, a függőségek és az elfogadási feltételek egyenként össze nem lettek vetve.

## Következő ellenőrzés

A további 31 NO LEXICAL EVIDENCE és 47 AMBIGUOUS CANDIDATES sor ugyanígy ellenőrzendő. Az eltérő részfunkciókat nem szabad egyetlen homályos ID alá elrejteni; ha nincs teljes megfelelőjük, explicit új alfunkció vagy nyitott GAP kerül a **kanonikus** tervbe. A hiányzó 00/A és 00.9.6.B források továbbra is OPEN. A 63.50.46 HIGH publish conflict változatlanul NOT FIXED. Nincs implementációs vagy tervlezárási PASS.

## További 31 NO LEXICAL EVIDENCE sor — előzetes tulajdonosi besorolás

| ID | Követelmény | Javasolt kanonikus tulajdonos | Más modulok kapcsolata | Kötelező ellenőrzés |
|---|---|---|---|---|
| 54.7.11 | OBS plugin/widget registry | Stream Studio / extension registry | Integrations provider credentials; Marketplace discovery only | Manifest, permission, signature, version migration and uninstall |
| 54.7.12 | Natív OBS plugin / desktop companion | Stream Studio / companion lifecycle | Integrations connects, Security audits | Threat model, signed builds, local secrets and revocation |
| 54.8.09 | Platformonkénti publikálási metadata | Content Studio / content publication variants | Integrations supplies provider capability, Web embeds content | Provider-specific schema, draft/export, status reconciliation |
| 54.8.11 | Zene-/videójog és hozzájárulás | Content Studio / rights registry | Assets links source; Publishing enforces rights | Expiration, takedown, consent proof and negative publishing tests |
| 54.9.02 | Közösségi poszt/komment/poll/beküldés | Community / engagement records | Web displays; Moderation governs | Role, abuse, delete/export and audit trail |
| 54.9.03 | Követés, jelvény, kihívás, jutalom | Community / engagement and entitlement | Commerce grants entitlements; Web renders | Eligibility, duplicate reward, fraud and revocation |
| 54.9.07 | AI moderációs javaslat | Community moderation; AI suggestion provider | Moderator approves; AI no silent write | False positive, appeal, audit and opt-out |
| 54.9.09 | Közösségi szabályzat és korhatár | Community policy + Security/privacy governance | Public consent and moderation enforce | Consent version, age gate, retention |
| 54.10.07 | Egyszeri/visszatérő támogatás | Commerce / support payments | OBS alert and Web goal display | Provider settlement, refund, idempotency and permissions |
| 54.10.11 | Bevételi riport, díj, refund, export | Commerce ledger/reporting | Analytics consumes aggregates | Reconciliation, currencies, fees, exports |
| 54.10.12 | Fizetés/adó/számlázás/GDPR megfelelés | Commerce + Security policy | Legal/accounting integrations as approved | Jurisdiction, provider, retention and consumer-rights review |
| 54.11.01 | Platformmetrikák | Analytics / metrics ingest | Integrations source adapters | Permission, unavailable metric, provenance and freshness |
| 54.11.02 | Tartalom- és csatorna-összehasonlítás | Analytics / reporting | Content Studio links content ID | Comparable definitions, periods and missing data |
| 54.11.03 | Adatfrissesség és becsült/valós jelölés | Analytics / metric provenance | Dashboard renders metadata | Timestamp, stale, partial, estimates |
| 54.11.04 | Webanalitika, UTM, SEO, konverzió | Analytics / web events | Web injects permitted tracking | Consent, attribution, bot filtering and privacy |
| 54.11.05 | Thumbnail/cím/időzítés kísérlet | Analytics / experiments | Content Studio configures variants | Sample size, assignment, no false uplift |
| 54.11.07 | AI-elemzés hipotézisekkel | Analytics / insights; AI inference service | Dashboard reviews | Sources, uncertainty, reproducibility |
| 54.12.03 | Automation actions | Automation / action executor | Each domain exposes authorized commands | Idempotency, permissions, dry-run, rollback |
| 54.12.04 | Workflow sablon/verzió/aktiválás | Automation / workflow registry | Marketplace may distribute templates | Version pinning, RBAC, deactivate behavior |
| 54.12.06 | Automation failure/quarantine/recovery | Automation / run state | Ops dashboard observes | Retry, dead-letter, compensation, audit |
| 54.13.02 | Jogosult brand/projekt AI kontextus | SANCI AI / context gateway | Brand Kit and Assets source data | ACL, redaction, citations, retention |
| 54.13.07 | AI Business Analyst | SANCI AI / analysis assistant | Analytics owns metrics | Hypotheses, tests, confidence and approval |
| 54.13.09 | AI kép/hang/videógenerálás | SANCI AI / generation orchestration | Assets stores approved outputs | License, model costs, moderation and consent |
| 54.13.11 | Generált tartalom provenance | SANCI AI / generation metadata | Content Studio displays label | Source, uncertainty, export metadata |
| 54.13.12 | Manuális AI nélküli út | Cross-cutting product requirement | All functional domains provide manual UX | AI outage E2E tests and parity |
| 54.14.02 | Magyar elsődleges és további nyelvek | Localization / locale policy | Admin and Public consume locales | Fallback, coverage and no mixed-language regressions |
| 54.14.05 | Dátum/idő/pénznem lokalizáció | Localization / formatting service | Schedule retains canonical timezone semantics | DST, currency rounding, locale tests |
| 54.14.07 | Fordítási memória/szószedet | Localization / translation registry | AI proposes, editor approves | Version, review, rollback and terminology |
| 54.14.08 | Nyelvváltó és választás megőrzése | Localization / user preference | Admin and Public have separate policy | Consent, persistence, fallback |
| 54.15.11 | WCAG 2.2 AA / reduced motion | Cross-cutting accessibility governance | Every UI surface implements | Keyboard, screen reader, contrast, focus, touch |
| 54.15.12 | Responsive, weak network, offline state | Cross-cutting UX reliability | Editor, Admin, Public individually implement | No data loss, loading/retry, device matrix |

**Összesítés:** a 41 lexikai nulla sor mindegyikéhez elkészült az elsődleges domainhatár-hipotézis. Ez nem bizonyítja, hogy a 396 stabil ID valamelyike teljes egészében lefedi az adott követelményt; egyetlen sor sem PASS. A 47 többértelmű sor következő körben külön, a jelölt ID-k forrásszövegével együtt vizsgálandó.

## 47 AMBIGUOUS CANDIDATES — kézi domainhatár- és acceptance-hipotézis

Az alábbi jelölt ID-k a 63.50.91 táblából származnak. Nem igazolt szemantikai találatok: a részfunkciók szétválasztása és a negatív tesztek még kötelezők.

| Forrás-ID | Lexikai jelölt ID-k | Kanonikus tulajdonosi hipotézis | Feloldandó szemantikai kérdés |
|---|---|---|---|
| 54.1.03 | ADM-003, ADM-005 | Admin dashboard/activity owner; quick actions invoke domain APIs | Quick actions and recent activity are distinct subcontracts; audit freshness and permissions |
| 54.1.08 | ADM-008, ADM-013 | Admin dashboard data-state orchestration | Loading, empty, error, stale and partial all require separate acceptance |
| 54.2.01 | WEB-002, WEB-003, WEB-001 | Pages/CMS canonical page lifecycle | CRUD, hierarchy, slug, archive, restore and deletion cannot be inferred from one candidate |
| 54.2.02 | WEB-005, WEB-009, WEB-010 | Navigation canonical tree | Desktop, mobile, footer, nested menus and external links need one data model |
| 54.2.07 | WEB-015, WEB-016, WEB-019 | Page composition binds external domain resources | Live/Schedule/Content/Commerce retain their own canonical records |
| 54.2.13 | WEB-028, DYN-001 | Site settings and domain/SSL operations | DNS/HTTPS status and branding/maintenance are separate responsibilities |
| 54.2.14 | WEB-006, WEB-030 | Forms/submissions domain | Spam protection, consent, validation and retention require independent tests |
| 54.2.15 | WEB-030, DYN-005, DYN-006 | Public web delivery/performance | Core Web Vitals, lazy loading, cache invalidation and image transforms need measured evidence |
| 54.3.03 | DSN-005, RES-009, RES-012 | Brand Kit design tokens and contrast rules | Asset registry stores files; Editor consumes design tokens |
| 54.3.06 | RES-001, RES-005, RES-006 | Brand Kit policy plus Asset provenance | Licensing and usage references need canonical asset ID and delete safeguards |
| 54.4.01 | RES-001, RES-005, RES-006 | Assets canonical registry: D1 metadata / R2 binary | No second media registry; check reference graph and ownership |
| 54.4.05 | RES-004, RES-007 | Assets metadata and search | Alt, license, crop/focal point and collection each need explicit field and test |
| 54.5.01 | INT-010, INT-011, INT-012 | Integrations provider registry | Twitch, YouTube, TikTok, Discord and Kick need capability-by-provider contracts |
| 54.5.03 | INT-003, INT-005, INT-004 | Integrations OAuth/secret lifecycle | Refresh, revoke, CSRF/state, encrypted storage and site ownership separately |
| 54.5.05 | INT-017, SEC-009, INT-008 | Integrations webhook ingestion; Security policy | Signature, replay, dedupe, retry and dead-letter independently validated |
| 54.5.07 | INT-021, SEC-008 | Integrations future adapter framework | Email/calendar/payment/CRM/storage remain planned, not claimed supported |
| 54.6.07 | LIV-010, SCH-009, SCH-010 | Schedule owns events; Games owns profiles | Calendar, countdown, related content and iCal are read-only consumers/adapters |
| 54.6.08 | LIV-003, LIV-006, LIV-007 | Live preparation workflow | Checklist, tech test, notes, markers, highlights are distinct data entities |
| 54.7.02 | OBS-001, OBS-003, OBS-005 | Stream Studio OBS control adapter | Scene/source, visibility, mute and volume gated by OBS capability and auth |
| 54.7.03 | OBS-001, OBS-005, OBS-003 | Overlay Studio owns overlay composition | Browser source rendering separate from general Visual Editor |
| 54.7.04 | OBS-006, COM-006 | Alerts domain / Stream Studio overlay rendering | Follow/sub/gift/cheer/raid/tip/purchase availability differs by provider |
| 54.7.09 | COM-012, COM-013, COM-018 | Community moderation policy | Provider chat commands conditional on permissions and platform support |
| 54.8.02 | RES-004, RES-006, CNT-001 | Content Studio canonical content record | Assets owns binaries; provider IDs, rights and publish states belong to content |
| 54.8.05 | CNT-017, CNT-018, CNT-021 | Content Studio transcripts/subtitles | SRT/VTT, translation, speakers and timestamps are separately accepted |
| 54.8.10 | CNT-017, CNT-021 | Content publishing adapter | Provider API permission vs manual export fallback explicitly distinguished |
| 54.8.12 | CNT-019, CNT-020, RES-001 | Content Studio canonical feed; Web/Analytics consumers | Same content ID, no duplicated publishing state |
| 54.9.01 | COM-006, COM-019 | Community fan identity | Admin account/session must not silently equal public fan account |
| 54.9.05 | COM-002, COM-009, COM-013 | Community entitlement mapping; Discord adapter | Role sync/revoke and provider outage need tests |
| 54.9.08 | COM-013, COM-018, COM-006 | Security authorization policy + Community entitlements | Server-side deny-by-default, not client-only hiding |
| 54.11.06 | ANL-007, CAM-004 | Analytics reports with Campaign ownership | CSV/JSON, sponsorship period and data provenance |
| 54.12.01 | AUT-001, AUT-002, AUT-003 | Automation workflow graph | Trigger, condition, action and branch each need typed contract |
| 54.12.07 | AUT-001, AUT-004, AUT-008 | Automation approval lifecycle; AI only proposes | Draft/simulation/diff, explicit activation, rollback |
| 54.13.01 | AI-001, AI-017, AI-021 | SANCI AI Control Center | Provider/model, spend, quota, retention, data sources and stop switch |
| 54.13.03 | AI-011, AI-012 | SANCI AI design assistant | Suggestions cannot mutate Editor/Page without review |
| 54.13.04 | AI-001, AI-015 | SANCI AI Live Coach | Opt-in, real-time latency, consent and stream/chat access |
| 54.13.08 | AUT-001, AUT-004, AUT-008 | AI draft authoring; Automation owns execution | Natural language to typed draft, simulation, human approval |
| 54.13.10 | AUT-001, AUT-009, AUT-014 | SANCI AI permission gateway + domain APIs | Preview, risk tier, audit, explicit approval and undo |
| 54.14.01 | WEB-012, WEB-029 | Localization preferences | Admin and public locales independent |
| 54.14.03 | WEB-001, WEB-011, WEB-015 | Localization CMS variants | Locale page, navigation, media alt and OG/SEO separately |
| 54.14.06 | WEB-010, WEB-011, LOC-001 | Localization layout policy | RTL, keyboard, font fallback and long-copy QA |
| 54.15.02 | SEC-002, QA-003, SET-002 | Security RBAC canonical policy | Owner/admin/editor/moderator/analyst/commerce permissions separately |
| 54.15.04 | SEC-007, SEC-008, SEC-001 | Security session and identity lifecycle | 2FA/SSO planned; secret rotation, rate limiting, anomaly audit |
| 54.15.08 | SEC-009, SEC-010, OPS-001 | Operations observability | Health, queue, webhook, quota, error/audit logs separate |
| 54.15.10 | OPS-005, QA-007 | Revision/history domain per resource | Undo/redo, diff, restore and dependency-aware deletion |
| 54.15.13 | SEC-003, QA-002, SEC-009 | Quality engineering test matrix | Unit/integration/auth/migration/UI/a11y/responsive/E2E/smoke |
| 54.16.02 | TEAM-003, DEV-001, DEV-002 | Extension platform manifest registry | Schema, permission, version, compatibility, signed distribution |
| 54.16.05 | SEC-003, TEAM-001, TEAM-005 | Workspace/tenant and team membership | Site switch, invite, roles, isolation and authorization |

**Státusz:** 47/47 AMBIGUOUS sor tulajdonosi/acceptance-hipotézise dokumentálva; 0/47 szemantikai PASS. A 24. fejezet stabil ID-definícióinak, a 49. fejezet modulhatárainak és az eredeti történeti acceptance/owner/surface mezőknek a teljes összevetése hiányzik. Nincs automatikus összevonás vagy követelménytörlés.


## Első forrásszöveg-összevetés: 24. fejezet vs. 54.x (2026-10-15)

Az alábbi megállapítások a **tényleges** kanonikus terv 24. fejezetének stabil ID-definícióin alapulnak, nem kizárólag a lexikai pontszámon. A státusz csak a vizsgált *jelöltpárokra* vonatkozik, nem az egész követelmény hiányára vagy készültségére.

| 54.x | Jelölt(ek) tényleges 24. fejezetbeli jelentése | Bizonyítékalapú megállapítás | Következő feladat |
|---|---|---|---|
| 54.1.03 | ADM-003 gyorsművelet; ADM-005 legutóbbi aktivitás/audit olvasónézet | **SPLIT / PARTIAL**: a két jelölt külön részfunkció, nem egymás helyettesítője | Két külön acceptance és jogosultság/frissesség teszt |
| 54.1.08 | ADM-008 shared loading/empty/error/stale/success UI; ADM-013 dashboard adatfrissesség/stale/partial | **SPLIT / PARTIAL**: UI állapot és domain-adatfrissesség külön szerződés | Error, empty, stale, partial és adatforrás státusz külön negatív teszt |
| 54.2.01 | WEB-001 Page CRUD; WEB-002 slug/hierarchy/URL; WEB-003 duplicate/archive/delete | **SPLIT / PARTIAL**: három külön, releváns alfunkció | Restore, deletion dependencies, permissions és slug konfliktusok ellenőrzése |
| 54.2.02 | WEB-005 preview authorization; WEB-009 canonical navigation tree; WEB-010 header/footer/global layout | **WRONG CANDIDATE + PARTIAL**: WEB-005 nem navigáció; WEB-009/010 releváns, de a mobilmenü/keyboard a WEB-011 szerződésben szerepel | WEB-005 jelölt elutasítása; WEB-009/010/011 és linktípusok ellenőrzése |
| 54.2.14 | WEB-006 publish validation/report; WEB-030 public cache/invalidation | **WRONG CANDIDATES**: egyik sem webes űrlap, spamvédelem, consent vagy submission lifecycle | A WEB-020 Contact form mellett külön általános Forms-domain/ID lefedés keresése; GAP, ha nincs |
| 54.3.03 | DSN-005 theme/brand presets; RES-009 asset delete safety; RES-012 SVG sanitization | **WRONG CANDIDATES + PARTIAL**: RES-009/012 nem kontraszt vagy font; DSN-005 csak részleges brand kapcsolódás | DSN-001/002, DSN-007, RES-013 és accessibility contract keresése |
| 54.4.01 | RES-001 canonical asset registry; RES-005 search/filter; RES-006 collection/tags | **WRONG CANDIDATES + PARTIAL**: RES-005/006 nem D1/R2 tárolási szerződés; RES-002 kifejezetten R2 binary + D1 metadata | RES-001 + RES-002; ID ownership és reference graph negatív teszt |
| 54.5.01 | INT-010 Twitch OAuth; INT-011 Twitch live/schedule; INT-012 Twitch VOD/clip | **WRONG SCOPE**: mindhárom Twitch-specifikus; nem bizonyítják a YouTube/TikTok/Discord/Kick provider registryt | Provider-mátrix és külön integration hub/adapter ID keresése |
| 54.5.03 | INT-003 OAuth state/CSRF; INT-005 site binding; INT-004 token lifecycle | **SPLIT / PARTIAL**: három külön releváns szerződés; titkos tárolás önálló ellenőrzés | Security secret storage, revoke, rotation, negative auth tests |
| 54.5.05 | INT-017 provider webhook lifecycle; SEC-009 shared signature/replay negative tests; INT-008 sync history/retry/provider errors | **SPLIT / PARTIAL**: INT-017 és SEC-009 releváns; INT-008 sync history nem bizonyít webhook dedupe/dead-letter viselkedést | Signature, replay, dedupe, retry, DLQ és idempotencia per-provider |

**Korlát:** a jelöltpárok valódi definícióinak ellenőrzése nem teljes 17 mezős feature-contract audit. A fenti WRONG CANDIDATE nem jelenti, hogy a képesség a MASTER más pontjában biztosan hiányzik. Nem jár szemantikai PASS, amíg minden részfunkció és acceptance nincs tételesen igazolva. A kanonikus terv továbbra is IN PROGRESS / NOT PASS.

## Tényleges 24. fejezetbeli ID-definíciók összevetése — további 33 többértelmű sor

Az alábbi soroknál a lexikai jelöltek **valódi, a kanonikus 24. fejezetben szereplő meghatározásait** olvastuk el. A PARTIAL és WRONG minősítés kizárólag a jelöltpárra vonatkozik, nem a teljes platform képességhiányára.

| 54.x | A jelölt ID-k tényleges jelentése | Eltérés / kötelező további ellenőrzés |
|---|---|---|
| 54.4.05 | RES-004 image variants; RES-007 alt/license | PARTIAL: search/collection not covered by these IDs |
| 54.5.07 | INT-021 future payment/email/commerce; SEC-008 secret storage | PARTIAL: calendar/CRM/cloud storage not demonstrated |
| 54.6.07 | LIV-010 recording retention; SCH-009 countdown; SCH-010 public schedule projection | WRONG+PARTIAL: LIV-010 not game profiles; SCH IDs only calendar/countdown |
| 54.6.08 | LIV-003 stream metadata; LIV-006 event normalization; LIV-007 status display | WRONG: none establishes preparation checklist, markers or technical test |
| 54.7.02 | OBS-001 overlay metadata; OBS-003 scene/stream state; OBS-005 browser source | PARTIAL: scene commands/mute/volume not established |
| 54.7.03 | OBS-001 overlay metadata; OBS-005 browser source; OBS-003 scene state | PARTIAL: overlay editing canvas, safe area, variants not established |
| 54.7.04 | OBS-006 provider-supported alerts; COM-006 member profiles/follows | WRONG+PARTIAL: COM-006 not event alert lifecycle |
| 54.7.09 | COM-012 abuse/spam; COM-013 membership gate; COM-018 visibility policy | WRONG+PARTIAL: member visibility not provider chat moderation |
| 54.8.02 | RES-004 image pipeline; RES-006 asset taxonomy; CNT-001 canonical content schema | WRONG+PARTIAL: content metadata belongs CNT-001; RES-006 excludes content taxonomy |
| 54.8.05 | CNT-017 short-form export; CNT-018 transcript/chapter metadata; CNT-021 timeline editing | PARTIAL: transcript review metadata yes; SRT/VTT/speaker translation export not proven |
| 54.8.10 | CNT-017 short-form export; CNT-021 timeline editing | WRONG: neither is provider publishing API or manual release guidance |
| 54.8.12 | CNT-019 editor feed binding; CNT-020 public feed projection; RES-001 asset registry | PARTIAL: RES-001 is binary assets, not social post publishing/analytics |
| 54.9.01 | COM-006 member profile/follows; COM-019 fan account identity/export/delete | PARTIAL: COM-019 relevant; login/auth lifecycle still requires verification |
| 54.9.05 | COM-002 Discord entry; COM-009 moderation/role; COM-013 membership visibility | PARTIAL: entitlement-to-Discord role mapping/revocation not demonstrated |
| 54.9.08 | COM-013 member visibility; COM-018 visibility policy; COM-006 profiles | PARTIAL: COM-006 irrelevant; server-side auth needs SEC |
| 54.11.06 | ANL-007 date/filter/export; CAM-004 media kit export | WRONG+PARTIAL: CAM-004 not sponsor reporting |
| 54.12.01 | AUT-001 trigger routing; AUT-002 trigger catalogue; AUT-003 condition rules | PARTIAL: action/branch/visual graph not covered by these three |
| 54.12.07 | AUT-001 trigger; AUT-004 action; AUT-008 run history | WRONG: AI-generated draft approval/simulation not proven; AUT-009 approval candidate |
| 54.13.01 | AI-001 model registry; AI-017 Control Center/approval; AI-021 generation costs | PARTIAL: retention/stop switch/quotas need separate verification |
| 54.13.03 | AI-011 website assistant; AI-012 SEO/a11y/localization suggestions | PARTIAL: component/responsive proposal approval remains unproven |
| 54.13.04 | AI-001 model registry; AI-015 stream diagnostics/summary | PARTIAL: opt-in and live markers not established |
| 54.13.08 | AUT-001 trigger; AUT-004 action; AUT-008 run history | WRONG: no natural-language draft/typed diff in these definitions |
| 54.13.10 | AUT-001 trigger; AUT-009 dry-run/preview/approval; AUT-014 safe cross-domain actions | PARTIAL: AI risk tier, audit and undo not proven |
| 54.14.01 | WEB-012 public routes/404; WEB-029 public search | WRONG: neither is Admin/public locale preference |
| 54.14.03 | WEB-001 page CRUD; WEB-011 mobile navigation; WEB-015 public live page | WRONG: none specifies locale-specific content/OG/alt variants |
| 54.14.06 | WEB-010 header/footer; WEB-011 mobile keyboard; LOC-001 translation fallback | PARTIAL: RTL/font fallback/long copy not proven |
| 54.15.02 | SEC-002 server RBAC; QA-003 negative tests; SET-002 site scope | PARTIAL: role matrix/modular grants need separate acceptance |
| 54.15.04 | SEC-007 rate limit; SEC-008 secrets; SEC-001 session | PARTIAL: 2FA/SSO planned; anomaly detection not demonstrated |
| 54.15.08 | SEC-009 webhook security; SEC-010 security audit; OPS-001 health | PARTIAL: queues, quota, error logs not established |
| 54.15.10 | OPS-005 operational backup/restore; QA-007 evidence gate | WRONG: undo/redo and revision diff are not backup/restore |
| 54.15.13 | SEC-003 tenant isolation; QA-002 domain/API tests; SEC-009 webhook security | WRONG+PARTIAL: SEC-003/009 not generic test-suite catalog |
| 54.16.02 | TEAM-003 role grants; DEV-001 API docs; DEV-002 API keys | WRONG: no extension/widget manifest lifecycle |
| 54.16.05 | SEC-003 isolation; TEAM-001 switcher; TEAM-005 multi-site workflows | PARTIAL: invitations and role lifecycle require distinct proof |

**Eredmény:** 43/47 AMBIGUOUS CANDIDATES sor lexikai jelöltjeinek első, 24. fejezetbeli definíció-alapú összevetése dokumentált (10 korábban + 33 itt). **0 teljes szemantikai PASS**: a 49. fejezet, feature contractok, eredeti történeti owner/surface/phase/dependency/acceptance és negatív tesztek tételes ellenőrzése még nyitott. WRONG jelölteket nem szabad automatikusan átvezetni vagy törölni. A következő fázis a hibás jelöltek helyett tényleges stabil ID-k keresése és az igazolt GAP-ek kanonikus tervbe vezetése.
