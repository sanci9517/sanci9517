### 63.50.112. SEC/OPS/LOC/TEAM/MKT/QA/SET/DYN/SEO/DEV/SEARCH/NTF/HELP 88 stabil ID tételes routing (2026-10-15)

**88/88 ROW-LEVEL ROUTING COMPLETED / SEMANTIC ACCEPTANCE OPEN.** A 24. fejezetből 12 SEC, 11 OPS, 6 LOC, 7 TEAM, 5 MKT, 10 QA, 4 SET, 8 DYN, 5 SEO, 6 DEV, 5 SEARCH, 5 NTF és 4 HELP stabil képességet külön-külön a primary owner, surface, dependency és minimum acceptance szerződéshez rendeltük. Az értékek specifikációs célok, nem megvalósítási vagy teszt-PASS állítások.

| Stabil ID és registry-képesség | Canonical owner | Felület | Függőség | Minimum acceptance |
| --- | --- | --- | --- | --- |
| SEC-001 — Authentication/session lifecycle. | Security/Identity policy domain | Security settings + cross-module server middleware | site/role/permission + session/secret policy | cross-site denial, revoked session, injection, audit redaction |
| SEC-002 — Server-side RBAC and ownership. | Security/Identity policy domain | Security settings + cross-module server middleware | site/role/permission + session/secret policy | cross-site denial, revoked session, injection, audit redaction |
| SEC-003 — Cross-domain server-side site/workspace/tenant isolation invariant; TEAM-001/TEAM-005 provide workspace selection and multi-site workflows but do not replace authorization. | Security policy domain (TEAM UI consumer) | All API routes + workspace switcher | SEC-002/003 tenant guard + TEAM-001/005 | cross-site ID denied even if UI switched |
| SEC-004 — OAuth/CSRF/session security. | Security/Identity policy domain | Security settings + cross-module server middleware | site/role/permission + session/secret policy | cross-site denial, revoked session, injection, audit redaction |
| SEC-005 — XSS/sanitization/safe embeds. | Security/Identity policy domain | Security settings + cross-module server middleware | site/role/permission + session/secret policy | cross-site denial, revoked session, injection, audit redaction |
| SEC-006 — SSRF/open redirect/injection defenses. | Security/Identity policy domain | Security settings + cross-module server middleware | site/role/permission + session/secret policy | cross-site denial, revoked session, injection, audit redaction |
| SEC-007 — Rate limiting and abuse protection. | Security/Identity policy domain | Security settings + cross-module server middleware | site/role/permission + session/secret policy | cross-site denial, revoked session, injection, audit redaction |
| SEC-008 — Secret storage/redaction/rotation. | Security/Identity policy domain | Security settings + cross-module server middleware | site/role/permission + session/secret policy | cross-site denial, revoked session, injection, audit redaction |
| SEC-009 — Cross-domain webhook signature/replay security requirement and negative-test contract; provider-specific implementation is owned by INT-017. | Security webhook verification policy; INT-017 implements adapter | Integration/webhook middleware | signed payload + replay store | invalid signature and duplicate event denied |
| SEC-010 — Cross-domain security/privacy audit events and redaction/retention controls; workflow execution detail remains in AUT-008. | Security/privacy audit domain; AUT-008 separate execution logs | Audit Center + protected APIs | redaction/retention + immutable event identity | no secrets/PII leak; audit replay |
| SEC-011 — Consent/retention/export/delete. | Security/Identity policy domain | Security settings + cross-module server middleware | site/role/permission + session/secret policy | cross-site denial, revoked session, injection, audit redaction |
| SEC-012 — MFA/2FA and future SSO lifecycle, recovery and suspicious-authentication controls. | Security/Identity policy domain | Security settings + cross-module server middleware | site/role/permission + session/secret policy | cross-site denial, revoked session, injection, audit redaction |
| OPS-001 — Health/deploy version. | Operations/Infrastructure domain | Operations & Diagnostics | Cloudflare Worker/D1/R2 + CI/backup/runbook | health, integrity, restore, incident recovery, measurable monitoring |
| OPS-002 — Structured logs/correlation IDs. | Operations/Infrastructure domain | Operations & Diagnostics | Cloudflare Worker/D1/R2 + CI/backup/runbook | health, integrity, restore, incident recovery, measurable monitoring |
| OPS-003 — Error tracking/alerting. | Operations/Infrastructure domain | Operations & Diagnostics | Cloudflare Worker/D1/R2 + CI/backup/runbook | health, integrity, restore, incident recovery, measurable monitoring |
| OPS-004 — Migration preflight/integrity. | Operations/Infrastructure domain | Operations & Diagnostics | Cloudflare Worker/D1/R2 + CI/backup/runbook | health, integrity, restore, incident recovery, measurable monitoring |
| OPS-005 — Operational backup/export/restore capability and runbook; QA-007 only verifies it through tests/evidence. | Operations backup owner; QA-007 evidence gate | Operations / Backups | D1/R2 backup/export + restore runbook | restore integrity, encrypted export, disaster recovery |
| OPS-006 — Recovery drill and runbook. | Operations/Infrastructure domain | Operations & Diagnostics | Cloudflare Worker/D1/R2 + CI/backup/runbook | health, integrity, restore, incident recovery, measurable monitoring |
| OPS-007 — Diagnostics report. | Operations/Infrastructure domain | Operations & Diagnostics | Cloudflare Worker/D1/R2 + CI/backup/runbook | health, integrity, restore, incident recovery, measurable monitoring |
| OPS-008 — Performance baseline/cache/query monitoring. | Operations/Infrastructure domain | Operations & Diagnostics | Cloudflare Worker/D1/R2 + CI/backup/runbook | health, integrity, restore, incident recovery, measurable monitoring |
| OPS-009 — Rollback and incident procedure. | Operations/Infrastructure domain | Operations & Diagnostics | Cloudflare Worker/D1/R2 + CI/backup/runbook | health, integrity, restore, incident recovery, measurable monitoring |
| OPS-010 — Dependency/license/CVE review. | Operations/Infrastructure domain | Operations & Diagnostics | Cloudflare Worker/D1/R2 + CI/backup/runbook | health, integrity, restore, incident recovery, measurable monitoring |
| OPS-011 — Background-job/realtime runtime selection and lifecycle, only where justified. | Operations/Infrastructure domain | Operations & Diagnostics | Cloudflare Worker/D1/R2 + CI/backup/runbook | health, integrity, restore, incident recovery, measurable monitoring |
| LOC-001 — Translation key/fallback. | Localization domain | Localization & Translations; public locale routes | translation registry + Page/Content locale projections | fallback, locale-safe publish, hreflang, DST/currency |
| LOC-002 — Locale-aware dates/numbers/currency/timezone. | Localization domain | Localization & Translations; public locale routes | translation registry + Page/Content locale projections | fallback, locale-safe publish, hreflang, DST/currency |
| LOC-003 — Page/content/navigation translation. | Localization domain | Localization & Translations; public locale routes | translation registry + Page/Content locale projections | fallback, locale-safe publish, hreflang, DST/currency |
| LOC-004 — Localized SEO/hreflang/canonical. | Localization domain | Localization & Translations; public locale routes | translation registry + Page/Content locale projections | fallback, locale-safe publish, hreflang, DST/currency |
| LOC-005 — Translation completeness status, locale preview and safe publish policy. | Localization domain | Localization & Translations; public locale routes | translation registry + Page/Content locale projections | fallback, locale-safe publish, hreflang, DST/currency |
| LOC-006 — AI-assisted translation workflow with explicit human review/approval and audit. | Localization domain | Localization & Translations; public locale routes | translation registry + Page/Content locale projections | fallback, locale-safe publish, hreflang, DST/currency |
| TEAM-001 — Workspace/site switcher UI and active-scope selection; server-side isolation and authorization remain owned by SEC-002–003. | Team/workspace UI; SEC enforces isolation | Workspace switcher | SEC-003 authorization + active site | switch cannot bypass server-side scope |
| TEAM-002 — Invite/accept/revoke. | Workspace/Team domain; SEC owns isolation | Workspace switcher + Team/Agency settings | site membership + SEC-002/003 + billing entitlement | revoked invitation, role change, tenant isolation, quota |
| TEAM-003 — Roles and granular permissions. | Workspace/Team domain; SEC owns isolation | Workspace switcher + Team/Agency settings | site membership + SEC-002/003 + billing entitlement | revoked invitation, role change, tenant isolation, quota |
| TEAM-004 — Approval/review/activity feed. | Workspace/Team domain; SEC owns isolation | Workspace switcher + Team/Agency settings | site membership + SEC-002/003 + billing entitlement | revoked invitation, role change, tenant isolation, quota |
| TEAM-005 — Multi-site workspace/product workflows; isolation enforcement is a security invariant owned by SEC-003. | Workspace/Team domain; SEC owns isolation | Workspace switcher + Team/Agency settings | site membership + SEC-002/003 + billing entitlement | revoked invitation, role change, tenant isolation, quota |
| TEAM-006 — SaaS billing/plan entitlements/quota. | Workspace/Team domain; SEC owns isolation | Workspace switcher + Team/Agency settings | site membership + SEC-002/003 + billing entitlement | revoked invitation, role change, tenant isolation, quota |
| TEAM-007 — Agency/studio client workspaces, shared templates, client-scoped brand and approval workflow. | Workspace/Team domain; SEC owns isolation | Workspace switcher + Team/Agency settings | site membership + SEC-002/003 + billing entitlement | revoked invitation, role change, tenant isolation, quota |
| MKT-001 — Extension manifest/permissions. | Extension/Marketplace governance | Marketplace & Developer Center | manifest sandbox + permission/version/license + provider payment gate | unsafe extension denied, migration rollback, license and legal checks |
| MKT-002 — Extension install/update/uninstall/migration. | Extension/Marketplace governance | Marketplace & Developer Center | manifest sandbox + permission/version/license + provider payment gate | unsafe extension denied, migration rollback, license and legal checks |
| MKT-003 — Theme/block/template/overlay marketplace. | Extension/Marketplace governance | Marketplace & Developer Center | manifest sandbox + permission/version/license + provider payment gate | unsafe extension denied, migration rollback, license and legal checks |
| MKT-004 — License/attribution/version/review. | Extension/Marketplace governance | Marketplace & Developer Center | manifest sandbox + permission/version/license + provider payment gate | unsafe extension denied, migration rollback, license and legal checks |
| MKT-005 — Marketplace payment/revenue-share after legal review. | Extension/Marketplace governance | Marketplace & Developer Center | manifest sandbox + permission/version/license + provider payment gate | unsafe extension denied, migration rollback, license and legal checks |
| QA-001 — Typecheck/build/CI gates. | Quality/Evidence governance | CI/QA dashboard + release gates | domain tests + runtime smoke + OPS restore evidence | positive/negative tests, device/browser, user acceptance proof |
| QA-002 — Domain/API/integration tests. | Quality/Evidence governance | CI/QA dashboard + release gates | domain tests + runtime smoke + OPS restore evidence | positive/negative tests, device/browser, user acceptance proof |
| QA-003 — Ownership/security negative tests. | Quality/Evidence governance | CI/QA dashboard + release gates | domain tests + runtime smoke + OPS restore evidence | positive/negative tests, device/browser, user acceptance proof |
| QA-004 — Browser/device responsive and visual-regression acceptance. | Quality/Evidence governance | CI/QA dashboard + release gates | domain tests + runtime smoke + OPS restore evidence | positive/negative tests, device/browser, user acceptance proof |
| QA-005 — Public SEO/accessibility/performance audit. | Quality/Evidence governance | CI/QA dashboard + release gates | domain tests + runtime smoke + OPS restore evidence | positive/negative tests, device/browser, user acceptance proof |
| QA-006 — Production smoke and runtime verification. | Quality/Evidence governance | CI/QA dashboard + release gates | domain tests + runtime smoke + OPS restore evidence | positive/negative tests, device/browser, user acceptance proof |
| QA-007 — Test/acceptance gate and evidence for backup/restore/rollback; does not implement backup operations. | QA acceptance owner; OPS-005 implementation | QA / Release gate | OPS backup/restore evidence | repeatable restore/rollback test proof |
| QA-008 — End-to-end creator journey. | Quality/Evidence governance | CI/QA dashboard + release gates | domain tests + runtime smoke + OPS restore evidence | positive/negative tests, device/browser, user acceptance proof |
| QA-009 — User acceptance and evidence log. | Quality/Evidence governance | CI/QA dashboard + release gates | domain tests + runtime smoke + OPS restore evidence | positive/negative tests, device/browser, user acceptance proof |
| QA-010 — Continuous benchmark and feature-discovery review. | Quality/Evidence governance | CI/QA dashboard + release gates | domain tests + runtime smoke + OPS restore evidence | positive/negative tests, device/browser, user acceptance proof |
| SET-001 — Canonical site settings schema és CRUD lifecycle. | Site Settings domain | Settings / Sites & Domains | site ownership + domain DNS/SSL + public-safe projection | secret exclusion, domain takeover denial, canonical switch |
| SET-002 — Site ownership/scope és multi-site kompatibilitás. | Site Settings domain | Settings / Sites & Domains | site ownership + domain DNS/SSL + public-safe projection | secret exclusion, domain takeover denial, canonical switch |
| SET-003 — Public-safe settings projection és secret/private mezők kizárása. | Site Settings domain | Settings / Sites & Domains | site ownership + domain DNS/SSL + public-safe projection | secret exclusion, domain takeover denial, canonical switch |
| SET-004 — Custom domain lifecycle, verification, DNS/SSL status, primary-domain transition and canonical URL. | Site Settings domain | Settings / Sites & Domains | site ownership + domain DNS/SSL + public-safe projection | secret exclusion, domain takeover denial, canonical switch |
| DYN-001 — Canonical data source registry és provider/domain adapter. | Dynamic Data binding contract | Data Sources + Editor binding inspector | canonical domain projections + type schema + SEC permissions | no private/draft leak, invalid binding recovery, stale fallback |
| DYN-002 — Binding schema, type validation és resource/field compatibility. | Dynamic Data binding contract | Data Sources + Editor binding inspector | canonical domain projections + type schema + SEC permissions | no private/draft leak, invalid binding recovery, stale fallback |
| DYN-003 — Whitelisted filter/sort/transform/limit/pagination for bound data queries; not a replacement for module-specific library search. | Dynamic Data binding contract | Data Sources + Editor binding inspector | canonical domain projections + type schema + SEC permissions | no private/draft leak, invalid binding recovery, stale fallback |
| DYN-004 — Feltételes rendering és adatfüggő visibility. | Dynamic Data binding contract | Data Sources + Editor binding inspector | canonical domain projections + type schema + SEC permissions | no private/draft leak, invalid binding recovery, stale fallback |
| DYN-005 — Runtime state machine for dynamic data bindings (loading/empty/error/partial/stale); shared visual presentation may use ADM-008. | Dynamic Data binding contract | Data Sources + Editor binding inspector | canonical domain projections + type schema + SEC permissions | no private/draft leak, invalid binding recovery, stale fallback |
| DYN-006 — Cache policy, freshness, invalidation és stale fallback. | Dynamic Data binding contract | Data Sources + Editor binding inspector | canonical domain projections + type schema + SEC permissions | no private/draft leak, invalid binding recovery, stale fallback |
| DYN-007 — Permission, site scope és published-only data boundary. | Dynamic binding enforcement; SEC policy owner | Editor/public binding resolver | published-only projection + site permissions | anonymous cannot access draft/private data |
| DYN-008 — Binding diagnostics, preview, invalid-reference report és recovery. | Dynamic Data binding contract | Data Sources + Editor binding inspector | canonical domain projections + type schema + SEC permissions | no private/draft leak, invalid binding recovery, stale fallback |
| SEO-001 — Per-page title, description, canonical URL és robots policy. | SEO metadata and delivery contract | Weboldal / SEO + public HTML/robots/sitemap | published Page projection + canonical URL + cache | HTML head and HTTP status, noindex preview, sitemap published-only |
| SEO-002 — Open Graph, X/Twitter card és social preview/image validation. | SEO metadata and delivery contract | Weboldal / SEO + public HTML/robots/sitemap | published Page projection + canonical URL + cache | HTML head and HTTP status, noindex preview, sitemap published-only |
| SEO-003 — Validált structured data/schema.org, ahol releváns. | SEO metadata and delivery contract | Weboldal / SEO + public HTML/robots/sitemap | published Page projection + canonical URL + cache | HTML head and HTTP status, noindex preview, sitemap published-only |
| SEO-004 — Sitemap és robots.txt lifecycle, publish/cache invalidation. | SEO delivery owner; Publishing event source | Public /robots.txt /sitemap.xml | published URLs + cache invalidation | sitemap excludes draft; robots route correct |
| SEO-005 — SEO preview/diagnostics, duplicate/missing metadata és page-level audit. | SEO metadata and delivery contract | Weboldal / SEO + public HTML/robots/sitemap | published Page projection + canonical URL + cache | HTML head and HTTP status, noindex preview, sitemap published-only |
| DEV-001 — Public API reference, versioning, schema and deprecation policy. | Developer Platform/API governance | Developer Center / API & Webhooks | SEC API keys + INT webhooks + versioned contracts | scoped key rotation, signature/replay, quotas, sandbox |
| DEV-002 — API key creation, scoped permissions, one-time display, rotation, expiry and revocation. | Developer Platform/API governance | Developer Center / API & Webhooks | SEC API keys + INT webhooks + versioned contracts | scoped key rotation, signature/replay, quotas, sandbox |
| DEV-003 — Webhook registry/tester, delivery log, signature validation and replay/retry diagnostics. | Developer webhook tooling; SEC-009 and INT-017 contracts | Developer Center / Webhooks | signature validation + delivery lifecycle | replay rejected, retry bounded |
| DEV-004 — Sandbox workspace and safe test fixtures/events. | Developer Platform/API governance | Developer Center / API & Webhooks | SEC API keys + INT webhooks + versioned contracts | scoped key rotation, signature/replay, quotas, sandbox |
| DEV-005 — SDK/client libraries, integration examples and version compatibility. | Developer Platform/API governance | Developer Center / API & Webhooks | SEC API keys + INT webhooks + versioned contracts | scoped key rotation, signature/replay, quotas, sandbox |
| DEV-006 — Developer quotas, rate-limit visibility and API usage diagnostics. | Developer Platform/API governance | Developer Center / API & Webhooks | SEC API keys + INT webhooks + versioned contracts | scoped key rotation, signature/replay, quotas, sandbox |
| SEARCH-001 — Permission-aware global search over canonical domain projections. | Search read projection only; source domains own records | Admin global search | SEC tenant/permission + canonical search index | no cross-tenant or private result |
| SEARCH-002 — Command palette and quick-action routing to canonical module commands. | Global Search/Command routing domain | Admin global search + module search | permission-scoped canonical read projections + freshness | cross-site result exclusion, deletion invalidation, safe snippets |
| SEARCH-003 — Saved views, favorites, recent items and per-user list preferences. | Global Search/Command routing domain | Admin global search + module search | permission-scoped canonical read projections + freshness | cross-site result exclusion, deletion invalidation, safe snippets |
| SEARCH-004 — Index freshness, permission/site invalidation and deletion propagation. | Global Search/Command routing domain | Admin global search + module search | permission-scoped canonical read projections + freshness | cross-site result exclusion, deletion invalidation, safe snippets |
| SEARCH-005 — Module-scoped search filters and safe result snippets. | Global Search/Command routing domain | Admin global search + module search | permission-scoped canonical read projections + freshness | cross-site result exclusion, deletion invalidation, safe snippets |
| NTF-001 — In-app notification center, read/unread and source-module navigation. | Notification domain | Notification Center + user preferences | canonical events + channel adapters + consent | idempotent delivery, quiet hours, unsubscribe, redacted payload |
| NTF-002 — Delivery channel adapters and truthful sent/delivered/failed states. | Notification domain | Notification Center + user preferences | canonical events + channel adapters + consent | idempotent delivery, quiet hours, unsubscribe, redacted payload |
| NTF-003 — User preferences, digest, quiet hours and channel opt-in/out. | Notification domain | Notification Center + user preferences | canonical events + channel adapters + consent | idempotent delivery, quiet hours, unsubscribe, redacted payload |
| NTF-004 — Idempotent event-to-notification mapping, deduplication and bounded retry. | Notification event mapping; AUT separate workflows | Notification Center | domain events + dedup + consent | duplicate event single notification |
| NTF-005 — Unsubscribe, retention and privacy-safe notification payload. | Notification domain | Notification Center + user preferences | canonical events + channel adapters + consent | idempotent delivery, quiet hours, unsubscribe, redacted payload |
| HELP-001 — Contextual help mapping to module/field and current feature limitations. | Help Center/Onboarding domain | Contextual help + Help Center | versioned docs + user progress + module anchors | role/site scope, outdated help warning, redacted diagnostics |
| HELP-002 — Interactive onboarding progress, skip/restart and role/site-scoped steps. | Help Center/Onboarding domain | Contextual help + Help Center | versioned docs + user progress + module anchors | role/site scope, outdated help warning, redacted diagnostics |
| HELP-003 — Searchable glossary, versioned documentation and canonical feature references. | Help Center/Onboarding domain | Contextual help + Help Center | versioned docs + user progress + module anchors | role/site scope, outdated help warning, redacted diagnostics |
| HELP-004 — Troubleshooting/feedback flow with diagnostic IDs and automatic sensitive-data redaction. | Help Center/Onboarding domain | Contextual help + Help Center | versioned docs + user progress + module anchors | role/site scope, outdated help warning, redacted diagnostics |

**Tulajdonosi határok:** SEC-003 az összes tenant/site API-szintű izoláció tulajdonosa; TEAM-001/005 csak workspace workflow és UI. SEC-009 közös webhook security policy, INT-017 provider adapter, DEV-003 developer tester. SEC-010 audit privacy event, AUT-008 automation execution history. OPS-005 backup/restore implementáció, QA-007 annak elfogadási bizonyítéka. SET-004 custom domain DNS/SSL ownership, SEO-001/004 canonical/robots/sitemap published-only fogyasztók. DYN-007 published-only data boundary, SEARCH-001 permission-aware projection, NTF-004 dedup notification, HELP-004 redacted diagnostics. Ezeket nem szabad a Visual Editorba vagy Admin dashboardba duplikált domain adatként beépíteni.

**Kötelező negatív acceptance:** cross-tenant URL/ID, revoked token, unsafe API key, webhook replay, restore data mismatch, wrong locale canonical, DNS takeover, draft in sitemap, private binding result, stale search after permission revoke, notification after unsubscribe, prompt-injected help/diagnostic payload, inaccessible keyboard-only flow. Minden teszt OPEN amíg tényleges evidence nincs.

**Következő kurzor 63.50.113:** a 63.50.109–112 négy táblájának determinisztikus 396/396 halmaz/duplikáció és family coverage auditja, 24/49/54/63 crosswalk és történeti 271 H-ID követelménymezők szemantikai eltéréseinek priorizálása. 63.50.46 HIGH publish conflict és 00/A/00.9.6.B source gap OPEN; PLAN IN PROGRESS / NOT PASS.

### 63.50.113. Összevont routing és történeti ID integritása (2026-10-15)

**DETERMINISTIC STRUCTURAL PASS / SEMANTIC REVIEW OPEN.** A jelenlegi `v2/foundation` kanonikus MASTER teljes szövegén a 24. fejezet `- PREFIX-NNN:` registry-sorait és a 63.50.109–112 négy tételes routing táblájának első oszlopát külön feldolgozva:

| Vizsgálat | Mért eredmény | Státusz |
| --- | --- | --- |
| 24. fejezet egyedi stabil ID | 396 sor / 396 külön ID, 30 család | STRUCTURAL PASS |
| 63.50.109 ADM/WEB/EDT routing | 89 sor | STRUCTURAL PASS |
| 63.50.110 DSN/RES/INT/LIV/OBS/SCH routing | 90 sor | STRUCTURAL PASS |
| 63.50.111 CNT/COM/STO/SUP/ANL/CAM/AUT/AI routing | 129 sor | STRUCTURAL PASS |
| 63.50.112 SEC/OPS/LOC/TEAM/MKT/QA/SET/DYN/SEO/DEV/SEARCH/NTF/HELP routing | 88 sor | STRUCTURAL PASS |
| Négy routing tábla összesen | 396 sor / 396 külön ID; 0 duplikált, 0 hiányzó és 0 idegen ID | STRUCTURAL PASS |
| Routing tábla kötelező 5 oszlopa | 396/396 kitöltött, 0 üres mező | FORMAT PASS; NOT SEMANTIC PASS |
| Minimum acceptance szövegek | 55 különböző szöveg a 396 sorban | FAMILY-LEVEL TEMPLATE REUSE; PER-ID PROOF OPEN |
| 63.52 H19–H22 történeti ledger | 79 sor / 79 egyedi H-ID | STRUCTURAL PASS |
| 63.53 H23–H34 történeti ledger | 192 sor / 192 egyedi H-ID | STRUCTURAL PASS |
| Történeti ledger összesen | 271 sor / 271 külön H-ID, 0 duplikáció; minden sor legalább egy létező 24. fejezetbeli ID-ra mutat | STRUCTURAL PASS |

**Fontos korlát:** az oszlopok kitöltése és az 55 ismétlődő acceptance-sablon nem igazolja a 396 egyedi képesség pozitív/negatív tesztjét, runtime állapotát vagy történeti szemantikai azonosságát. A 22 Admin-főmodul és az egyetlen MASTER megmarad; sem a Visual Editor, sem a Dashboard nem válik második domain-adatgazdává.

**Tételesen azonosított, célzott szemantikai bizonyításra váró csoportok (nem új funkció-ID-k):**
1. `H23.18` reduced-motion és `H24.06–08` keyboard/focus: Editor canvas és publikus renderer külön pozitív/negatív accessibility acceptance; `EDT-037/040` + `QA-004/005` nem helyettesítik a browser-evidence-et.
2. `H25.01–12` SEO: `SEO-001–005`, `WEB-013`, `SET-004` között egyetlen canonical URL és published-only sitemap/robots szerződés, locale/staging/noindex/redirect negatív teszttel. A `63.50.46` HIGH publish konfliktus miatt OPEN.
3. `H29.01–10` backup/recovery: `OPS-005/006/009` implementációs owner és `QA-007` bizonyíték külön; D1/R2/revision/site-scope konzisztencia és tényleges recovery drill OPEN.
4. `H32.02–06` AI live diagnostics: `AI-015` cél-ID megvan, de silence/speech, chat, audio, quality források, provider-jogok, késleltetés és retention még nem bizonyított.
5. `H34.20–22` continuous discovery → terv → implementáció → user validation: `QA-010` folyamat, `DEV-001` API governance és `QA-002/008/009` bizonyíték nem helyettesíti az adott új feature konkrét domain-ownerét és release gate-jét.
6. `H31.00` AI canonical action pipeline és `H33.00` automation lifecycle: több cél-ID megengedett, de végrehajtás csak közös permission/approval/audit/rollback szerződésen keresztül; negatív authorization és replay evidence OPEN.

**Külön blokkolók:** `63.50.46` HIGH publish/metadata storage konfliktus **OPEN / NOT FIXED**; a történeti `00/A` és `00.9–00.9.6.B` **SOURCE NOT RECOVERED / OPEN**. A 271/271 ID-lefedettség nem bizonyítja az eredeti forrásszöveg teljes visszanyerését. Nincs funkcióimplementáció, migráció, deploy vagy runtime PASS.

**Következő aktív alpont: `63.50.114`** — a fenti szemantikai kockázati csoportok konkrét feature-contract/acceptance hiányainak soronkénti rögzítése, majd `63.50.46` publish döntés és hiányzó történeti források lezárási szabályainak vizsgálata. A közös 22-modulos funkciólista-review csak bizonyított tervkapu után következhet. **PLAN IN PROGRESS / NOT PASS.**

### 63.50.114. Szemantikai bizonyítási kapuk és publikálási döntés kerete (2026-10-15)

**DESIGN GATE CLARIFIED / NO RUNTIME FIX / NOT PASS.** A 63.50.113 igazolta a 396/396 registry-routing és a 271/271 történeti cél-ID halmazegyezést. A további auditban nem keverhető össze a strukturális megfeleltetés, a specifikációs döntés és a futó kód igazolása. A jelen fejezet **nem** zárja le a 63.50.46 HIGH konfliktust és nem pótolja a hiányzó történeti forrásokat.

**A 63.50.46/98–106 alapján a publikálás minimális elfogadási szerződése:**
1. A draft Page Model és a published projection elkülönül: Admin Pages PATCH, Editor Save és rollback nem írhat published snapshotot, published title/description/slug/canonical adatot vagy publikált revision pointert; kizárólag az explicit Publish jogosult erre, ugyanazon canonical Publishing commandon át.
2. Az explicit Publish permission/site-scope/revision precondition és teljes dokumentumvalidáció után atomi, idempotens snapshot + published metadata + URL state változást hoz létre. Hibánál nincs részleges publish, stale revision esetén konfliktusválasz és megőrzött draft.
3. A Public renderer, route resolver, redirects, sitemap, robots, OG/canonical és cache **kizárólag** a published projectiont fogyasztják; a preview authorization-kötött, noindex és sosem szivárog publikus sitemapbe vagy shared cache-be.
4. Slug-váltásnál az előző publikus URL megtartott redirect/history rekordot kap, nincs cross-site slug collision, redirect-loop vagy draft URL leak. Ismeretlen URL valódi HTTP 404, nem csak 200-as hibaképernyő.
5. Unpublish/restore/rollback külön, verziózott state transition; a draft-only restore nem publikál automatikusan. Migráció előtt read-only D1 preflight, backup/restore bizonyíték és a `pages ↔ editor_revisions` FK-ciklus dry-run kötelező.
6. Pozitív és negatív acceptance: published v1 → draft v2 → PATCH meta → public továbbra is v1; explicit publish → public v2; jogosulatlan/rossz site/replay/stale revision elutasítás; redirect, canonical, sitemap, robots, OG, cache és rollback böngésző + HTTP teszt. **Mindez tesztterv, nem futtatott PASS.**

**Storage döntési állapot:** a 63.50.106-ban javasolt **B — published revisionhez kötött immutable published metadata/URL projection** a tervezési preferencia, nem jóváhagyott migráció. A végleges választás feltétele a tényleges remote D1 schema/adatprofil, FK/unique index, URL-history és rollback bizonyíték. A/B/C alternatíva nem válhat párhuzamos implementációvá; a választásig minden érintett `WEB-002/004/006/007/013`, `EDT-027/033`, `SEO-001/002/004`, `SET-004`, `DYN-007` acceptance OPEN.

**Történeti követelmény-kapu:** 271/271 H19–H34 sorhoz létező stabil ID tartozik; 145 sor több domain/funkció ID-t érint, ami **nem** jogosít második adatgazdára. A több-ID-s esetekben primary writer, read-only consumer, provider adapter és QA-only acceptance szerepet külön kell rögzíteni. A korábban kiemelt `H23.18`, `H24.06–08`, `H25.01–12`, `H29.01–10`, `H31.00`, `H32.02–06`, `H33.00`, `H34.20–22` csoportok egyedi negatív acceptance és runtime/provider bizonyítéka OPEN.

**00/A és 00.9–00.9.6.B:** `SOURCE NOT RECOVERED / OPEN`; nem írható át `SEMANTIC PASS`-ra pusztán azzal, hogy a 271 elérhető történeti sor megtalálható. A lezárás feltétele dokumentált, kellően széles történeti Git/PR/archív keresés és a fel nem kutatható eredeti forrás explicit no-loss kockázati döntése; eredeti tartalom kitalálása tilos.

**Következő alpont: `63.50.115`** — a 145 több-ID-s történeti sor primary owner/consumer/QA szerepének részletes, kockázatalapú egyeztetése és a hiányzó források további bizonyítékkeresése. Ezután dönthető el a tervkapu és a közös funkciólista-review időpontja. **PLAN IN PROGRESS / NOT PASS; implementation freeze remains.**

### 63.50.115. Több-ID-s történeti követelmények ownership-szétválasztása (2026-10-15)

**CROSSWALK ROLE AUDIT / SEMANTIC EVIDENCE OPEN.** A 63.52 és 63.53 elsődleges H-ledger sorainak újraszámolása: **271 történeti sor**, ebből **145 több stabil ID-ra mutat**, **126 egy ID-ra**. A 145 több-ID-s sorból **45 ugyanazon ID-családon belüli**, **100 több családot érintő**. Ez fontosabb, mint az ID-k puszta megléte: az egymás mellé írt cél-ID-k nem jelentenek közös írási jogot vagy azonos lifecycle-t.

| Történeti képesség és cél-ID | Kanonikus író / primary owner | Másodlagos fogyasztó, adapter vagy bizonyíték | Kötelező negatív acceptance |
| --- | --- | --- | --- |
| H19.01 upload — RES-003/001/002 | RES asset registry és upload workflow; R2 bináris, D1 metadata | RES-003 validation, RES-002 storage adapter | Hibás MIME/magic bytes, másik site asset ID, megszakadt upload, orphan R2 objektum |
| H19.16 secure object keys — RES-002/014, SEC-008 | RES tárolási/object key és letöltési hozzáférés | SEC-008 secret lifecycle közös szabály; nem asset registry | Másik site objektumkulcs, lejárt signed URL, véletlen publikus hozzáférés |
| H19.19 clip/Short assets — RES-001, CNT-003 | RES asset azonosító/bináris; CNT a clip/Short tartalom rekord gazdája | CNT csak asset reference-t tárol, nem duplikálja az R2 objektumot | Asset törlés/lejárat mellett hibás clip referencia és permission leak |
| H20.03 schedule — DYN-001, SCH-010/011 | SCH események és publikált schedule projection | DYN csak datasource adapter; Editor schedule blokk csak binding | Draft schedule kiszivárgása, nem friss projection, cross-site binding |
| H20.04 Twitch — DYN-001, INT-011, LIV-001 | INT Twitch provider auth/adat adapter; LIV normalized live state | DYN datasource és public read projection | Lejárt OAuth, offline állapot, hibás provider quota, másik site kapcsolat |
| H21.13 YouTube statistics — INT-013, ANL-004/001 | ANL metrika/taxonómia és attribúció; INT provider ingestion | Dashboard és Content csak aggregált olvasó | Hiányzó scope, késő metrika, dupla event, jogosulatlan statisztika |
| H22.16 title/description/hashtag — CNT-010/011, AI-013 | CNT szerkesztett brief és platformvariáns | AI javaslat, kizárólag emberi jóváhagyással menthető/publikálható | AI output automatikus publikálása, platformkorlát megsértése |
| H23.18/H24.06–08 reduced motion és keyboard/focus — EDT/QA | EDT Editor canvas interakció, WEB publikus renderer külön runtime owner | QA audit és browser evidence, nem accessibility implementáció | Keyboard trap, láthatatlan fókusz, reduced-motion figyelmen kívül hagyása |
| H25.03 canonical — SEO-001, SET-004 | Publishing published URL projection; SET custom domain állapot | SEO canonical published-only consumer | Draft canonical, staging indexelés, domain takeover, hibás locale URL |
| H27.19 permissions — SEC-002, ADM-009 | SEC szerveroldali authorization | ADM csak jogosultságfüggő láthatóság | UI elrejtés mellett közvetlen API-n végrehajtható tiltott művelet |
| H28.14 file validation — RES-003, SEC-006 | RES upload validation pipeline | SEC közös injection/SSRF védelmi szabály | Átnevezett végrehajtható fájl, rosszindulatú URL fetch |
| H29.02–10 backup/restore — OPS/WEB/RES/QA | OPS backup/restore/recovery; WEB revisions és RES references saját domain | QA-007 kizárólag bizonyíték és drill acceptance | Hiányos D1/R2 restore, FK hiba, cross-site adatkeveredés |
| H30.04–05 cache — WEB-030, DYN-006, OPS-008 | WEB published HTTP cache; DYN datasource cache a saját határán | OPS teljesítménymérés/observability | Publish után régi URL/metadata, permission revoke után stale private response |
| H31.00 AI action pipeline — AI-003/005/006/007/008/009 | AI orchestration és action planner; tényleges írás csak az érintett domain canonical commandján | Approval/permission/audit közös kötelező gate | Prompt injection, approval nélküli action, rollback nélkül részleges írás |
| H32.18 content performance — ANL-004, AI-004/013 | ANL hiteles metrika és időbélyeg | AI privát kontextus és javaslat, nem második metrika store | Másik site adat, stale insight, AI által kitalált metrika |
| H33.00 automation lifecycle — AUT-001/002/003/004/008 | AUT workflow orchestration és run history; tényleges üzleti írás a domain API-n | SEC authorization, audit event és idempotency | Replay/duplikált végrehajtás, permission revoke, recursion loop |
| H34.21 implementáció — DEV-001, QA-002/008 | Az adott feature domain ownerét **minden új work itemnél külön kell kijelölni** | DEV API contract, QA tesztkapu; önmagukban nem feature implementáció | Owner nélküli release vagy teszt nélküli publikus feature |

**Auditkorlát:** a fenti táblázat célzott, kockázatalapú ownership-felbontás a 100 cross-family sor jellemző és korábban problémás mintáiból; **nem** állítja, hogy mind a 145 sorhoz külön bizonyított runtime API/owner/acceptance tartozik. A 45 same-family több-ID-s esetben is szükséges canonical writer vs supporting capability különbségtétel az implementációs feature-contractban. A 24. fejezet és a 63.50.109–112 owner mezői nem írhatják felül a domain tényleges ownership szerződését.

**Következő aktív alpont: `63.50.116`** — a fennmaradó több-ID-s H-sorok célzott ownership review-ja, valamint `00/A` és `00.9–00.9.6.B` történeti források célzott Git/PR keresése. A `63.50.46` HIGH publish conflict és a source gate **OPEN**; PLAN **IN PROGRESS / NOT PASS**.

### 63.50.116. Több-ID-s szemantikai ütközések: további célzott döntések (2026-10-15)

**RISK-BASED ROLE REVIEW / NO IMPLEMENTATION PASS.** A 63.50.115-ben mért 145 több-ID-s történeti sor (100 cross-family, 45 same-family) megőrzött. Az alábbi soroknál a 24. fejezet tényleges capability-szövege alapján különválasztjuk a valódi üzleti adatgazdát, az adaptert, a megjelenítést és a QA bizonyítékot; ez **nem** a 145/145 runtime auditja.

| Történeti sorok | Egyetlen írási/üzleti határ | Megengedett további szerep | Nyitott bizonyítás |
| --- | --- | --- | --- |
| H24.04–11 accessibility | EDT form/canvas + WEB public renderer + DSN tokens saját komponensükben | QA-004/005 browser/axe/manual verification, nem runtime implementáció | Screen reader, form label, focus trap, contrast, keyboard-only és reduced-motion negatív eset |
| H26.07–08 analytics retention/dashboard | ANL metrika, retention és aggregation; SEC consent/deletion policy | ADM read-only dashboard projection | Opt-out után tracking tiltás, site/role leak, stale dashboard |
| H27.15–19 Editor management/history/permissions | WEB Page CRUD/published revisions; EDT draft canvas undo és preview; SEC authorization | ADM route/visibility; OPS backup/recovery | Editor undo nem ír published state-et; UI elrejtés nem elég a deny API-hoz |
| H30.02–08 performance/cache | WEB public renderer/cache; DYN datasource cache; OPS monitoring | QA-004/005 load, Web Vitals és regression evidence | Draft cache leak, stale published URL, nagy oldal performance és budget |
| H31.08/10/12 AI QA/approval/audit | AI suggestion/action orchestration; az érintett domain canonical write command | QA vizuális bizonyíték; SEC privacy/security audit | Approval nélküli destruktív művelet, audit nélküli execute, cross-site suggestion |
| H32.07–18 live/content AI | LIV/OBS élő állapot, CNT tartalomrekord, ANL hiteles metrika | AI diagnosztika/javaslat, nem második live/content/metric store | Provider scope, latency, provenance, consent, human review, no hallucinated analytics |
| H32.22–25 historical outcomes/experiments | ANL történeti metrika; AI prompt/eval verzió és feedback | AI Control Center megjelenítés és döntés | Hiányzó source timestamp, privacy leak, téves kísérlet-attribúció |
| H33.02–11 automations | AUT trigger/condition/run lifecycle; üzleti írás a CNT/RES/LIV/NTF canonical domain API-ján | SEC RBAC/security audit, NTF dedup delivery | Retry/idempotency, dead-letter, provider outage, permission revoke, recursive event |
| H34.01–19 benchmarking és fejlesztési módszertan | QA-010 feature discovery process; EDT/DSN/OPS/TEAM/AI a tényleges saját képességeik gazdái | OPS-010 license/CVE review, QA evidence | Külső kód licenc és karbantartás ellenőrzése, no duplicate visual editor, feature owner/phase gate |
| H34.20–22 master/implementation/validation | QA-010 proposal-to-MASTER; egyedi feature domain owner végrehajtás; QA-009 user acceptance | DEV-001 csak API verziózás, QA-002/008 tesztkapu | Owner és acceptance nélküli release, téves „QA implementálja” besorolás |

**Újonnan kiemelt tervezési kockázat:** `H31.08` AI visual QA jelenlegi `AI-012` célja „SEO/accessibility/localization suggestions”, `QA-004` browser visual regression; a generatív vizuális minőségellenőrzés teljes, bizonyítható lefedése **nem következik automatikusan** e kettőből. `H32.23` experiment tracking esetén `AI-002` prompt/template evaluation és `ANL-007` date-range analytics nem feltétlenül teljes kísérlet-hozzárendelési modell. Ezeket **SEMANTIC SPEC GAP / OPEN** jelöléssel kell kezelni a megfelelő AI/Analytics feature contractban, nem új párhuzamos rendszert építeni.

**Forrás-visszakeresési állapot:** a repository commitkeresés `00/A` és `00.9.6.B` szó szerinti keresése nem adott találatot; a releváns korábbi PR #29/#30 leírása megőrzött archívumot és egyetlen MASTER-irányítást támaszt alá, nem adja vissza az eredeti hiányzó fejezeteket. A negatív keresés nem teljes bizonyíték a Git összes törölt fájljára vagy PR-kommentjére. **SOURCE NOT RECOVERED / OPEN**.

**Következő aktív alpont: `63.50.117`** — a két most megnevezett semantic spec gap pontos acceptance-szerződésének rögzítése, a fennmaradó H crosswalk magas kockázatú sorainak ellenőrzése és az eredeti források további célzott keresése. A `63.50.46` HIGH publish conflict **OPEN**; nincs F0 vagy runtime PASS.

### 63.50.117. AI vizuális QA és kísérletkövetés — hiányzó acceptance szerződések (2026-10-15)

**FEATURE-CONTRACT GAP RESOLUTION AT PLAN LEVEL / RUNTIME OPEN.** A `H31.08` és `H32.23` eredeti történeti képesség megőrzött. A 24. fejezet stabil ID-it nem szaporítjuk pusztán a crosswalk kedvéért; az alábbi szerződések a megfelelő kanonikus domain feature-contractjához tartoznak.

**H31.08 — AI visual QA (`AI-012` javaslat + `QA-004` bizonyíték, `EDT-032` preview, `AI-007/019` approval):**
- Bemenet: explicit site/page/revision, viewport/device, publikus vagy autorizált preview screenshot, design token és accessibility policy verzió. A kép és a modell válasza nem megbízható utasításforrás.
- Kimenet: típusozott, visszakereshető megfigyelés (probléma kategória, severity, bounding region/element reference, reprodukciós viewport, confidence, evidence link); javaslat és bizonyíték külön mező.
- Írási határ: AI csak ajánlást ad; Editor változtatás kizárólag canonical EDT command → permission → preview/diff → explicit approval → version/audit útvonalon. QA-004 az összehasonlító teszt bizonyítéka, nem új Page Model.
- Pozitív acceptance: reszponzív törés, overflow, kontraszt/fókusz vagy design token eltérés reprodukálható jelzése; ugyanaz a revision és viewport újrafuttatva összehasonlítható.
- Negatív acceptance: másik site preview, privát asset, prompt injection a képen, hallucinated selector, téves pozitív találat, AI nélkül működő manuális vizuális QA, jóváhagyás nélküli módosítás elutasítása.
- Fázis: AI funkció élesítésekor kötelező contract és provider/evaluation evidence; a jelenlegi audit nem jelent működő AI visual QA-t.

**H32.23 — experiment tracking (`AI-002` prompt/evaluation + `ANL-007` report; szükség esetén `ANL-001/004` event/provenance):**
- Egyedi experiment ID, site/owner, cél és hipotézis, variant assignment, mérési időablak, metrikadefiníció és forrás, attribution/consent, verziózott AI prompt/model vagy content variant, kontroll és kísérleti csoport.
- ANL az események, mérési eredmények, időszeletek és hozzárendelés adatgazdája; AI-002 az AI prompt/evaluation változat és értékelés gazdája; CNT/WEB az érintett tartalom/oldal kanonikus gazdája. Egyetlen experiment workflow, nem párhuzamos AI és Analytics kísérleti adatbázis.
- Pozitív acceptance: kontroll és variáns összehasonlítása azonos mérési definícióval; sample size, hiányzó adatok, időzóna, késő event és bizonytalanság látható; exportból ugyanaz az eredmény újraszámolható.
- Negatív acceptance: cross-site cohort leak, consent nélküli követés, variáns-váltás miatti duplaszámolás, stale/hiányzó provider metrika, kitalált uplift vagy nem igazolt statisztikai szignifikancia; rollback és opt-out kezelése.
- Fázis: az Analytics/AI experiment workflow tervezésekor egyértelmű canonical storage/API és jogosultság döntés szükséges; jelenleg `DESIGN REQUIREMENT RECORDED / NOT IMPLEMENTED OR TESTED`.

**Közös no-duplication döntés:** `AI-012` nem lesz második Visual Editor; `QA-004` nem lesz AI business logic owner; `ANL-007` nem helyettesíti az experiment assignment modellt; `AI-002` nem birtokolhat önálló platform-metrika adatot. A részletes API/storage/permission/retention megvalósítás a megfelelő fejlesztési fázis előtti 10. fejezet szerinti feature-contractban kötelező.

**Következő aktív alpont: `63.50.118`** — hiányzó történeti források és publikálási döntés fennmaradó blokkolóinak ellenőrzése, majd a terv-review kapu pontos szétválasztása a runtime feature-PASS-tól. **PLAN IN PROGRESS / NOT PASS; HIGH publish conflict OPEN.**

### 63.50.118. Forrásproveniencia, tervkapu és fejlesztésindítási határ (2026-10-15)

**EVIDENCE REVIEW / HISTORICAL SOURCE STILL PARTIAL / PLAN NOT PASS.** A repository `v2/foundation` Git-tree leltára **200 bejegyzés, `truncated=false`**; a `docs/archive/MASTER-DEVELOPMENT-PLAN-2026-10-13.md` fájl SHA `bcd8b3d9dc1ef424c7e05ced2623e29eebf5543b`, tehát a történeti archívum ténylegesen jelen van. Az archívum teljes szövegében öt szó szerinti `00/A` vagy `00.9.6.B` említés volt. **Új, konkrét részleges forrásbizonyíték:** az archívum 36. sora alatt `## HISTORICAL / QUEUED — 00/A.2.2 — F — SCHEDULE CRUD + INSPECTOR / DOMAIN-DRIVEN EDITOR — DEFINITION OF DONE` fejezet kezdődik, megőrzött szabályokkal: egyetlen `public/editor-v2/` canonical Editor, Schedule D1 domainadat, Page Model csak presentation, Inspector nem külön state, site-scope és közös command/history/validation/persistence. Ez a **00/A.2.2 részleges, hitelesen megőrzött szövege**, nem az eredeti teljes `00/A` vagy `00.9.6.B` visszanyerése. Az archívum külön állítja, hogy a korábbi címek teljes formában nem találhatók meg.

**PR/commit vizsgálat:** a `00/A` és `00.9.6.B` GitHub commit-szövegkeresése 0 találat; a #29 és #30 PR közös issue/review/inline kommentfolyama PR-enként 1 elemet adott, egyik sem tartalmazza e két címke szövegét. A PR #29 az új terv és archívum létrehozását, #30 az egyetlen aktív terv elsőbbségét rögzíti. A keresés negatív eredménye **nem** bizonyítja a teljes Git history minden blobja vagy törölt fájlja hiányát.

**Lényeges történeti döntés:** a 2026-10-13-i archív MASTER kifejezetten `M0 CLOSED BY USER PRODUCT DECISION — nem PASS` állapotot és azt az elvet tartalmazza, hogy a fennmaradó történeti traceability tételek a releváns **implementációs feature-DoD-be** kerüljenek, ne végtelen, önálló auditmunkává váljanak. Ez történeti termékdöntés, **nem** írhatja felül az aktuális MASTER mostani `PLAN IN PROGRESS / NOT PASS` státuszát. Ugyanakkor a jelenlegi terv lezárásának értelmezésekor kötelező elkerülni a hibát, hogy minden jövőbeli AI/OBS/provider képesség runtime bizonyítékát **a fejlesztés megkezdése előtt** követeljük.

**Két, különböző kapu — végrehajtási javaslat:**
- **PLAN READY FOR USER FEATURE REVIEW:** a 396/396 ID és 271/271 H-ID strukturális integritás igazolt; a 22 modul és ownership-szabályok ellenőrzöttek; minden ismert high-risk konfliktus, hiányzó történeti forrás és szemantikai bizonytalanság explicit kockázat/owner/fázis/feature-DoD döntést kap. A teljes történeti `00/A` és `00.9.6.B` hiányát nem szabad hamis `SOURCE RECOVERED`-ként kezelni, de dokumentált **source gap / risk accepted for planning only** döntés mellett a funkciólista közös áttekintése elindítható. Ez nem feature runtime PASS.
- **FEATURE IMPLEMENTATION / RELEASE PASS:** minden konkrét fejlesztési pont saját permission, D1/R2, migration, rollback, browser/CI, provider, negative tests és user acceptance bizonyítékot kap. A `63.50.46` HIGH publish konfliktus **nem blokkolhatja az összes független UI/spec munkát**, de **blokkolja az érintett publish/metadata/URL író útvonalak release-ét**, amíg a canonical publishing contract és a szükséges migráció tesztjei nem PASS-ok.

**Jelenlegi szigorú állapot:** a fenti kapuszétválasztás **javasolt értelmezés**, nem felhasználói jóváhagyás és nem automatikus terv-PASS. A teljes eredeti 00/A és 00.9.6.B forrás `PARTIALLY RECOVERED / REMAINDER OPEN`; `00/A.2.2` archív részlet igazolt. A HIGH publish conflict `SOURCE CONFIRMED / NOT FIXED`. Nem futott migráció, runtime teszt vagy deploy.

**Következő aktív alpont: `63.50.119`** — a fennmaradó kritikus szemantikai és source-gap sorok lezárási döntési mátrixa, 22 modulos funkciólista-review előkészítése, a valóban blokkoló és feature-fázisba vihető tételek szétválasztása. **PLAN IN PROGRESS / NOT PASS.**

### 63.50.119. Terv-review előkészítés és kockázatalapú lezárási mátrix (2026-10-15)

**PLANNING REVIEW PREPARATION / NO AUTOMATIC PASS.** A 396/396 stabil capability ID, 271/271 történeti H-ID, 22 Admin-modul és a 63.50.109–112 teljes routing strukturálisan egyezik. A 63.50.118 új bizonyítéka a történeti `00/A.2.2` részleges szövege; a teljes eredeti `00/A` és `00.9.6.B` továbbra is hiányos. A tervezési és futó implementációs kapu elválasztása az alábbi konkrét döntési mátrixot igényli.

| Tétel | Terv-review előtt | Konkrét feature megvalósítás előtt | Runtime/release előtt |
| --- | --- | --- | --- |
| 396 ID / 22 modul / 271 H mapping | Strukturális PASS; szemantikai eltérések explicit kockázat/owner | Érintett feature teljes 10. fejezet szerinti contract | Funkciónkénti pozitív/negatív acceptance |
| Hiányzó 00/A és 00.9.6.B | Részleges `00/A.2.2` bizonyíték; maradék `SOURCE GAP` döntés felülvizsgálatra, **nem forrás-PASS** | Ha új bizonyíték előkerül, csak a releváns feature DoD módosul | Semmi nem tekinthető automatikusan implementáltnak |
| 63.50.46 HIGH publish konfliktus | Megoldási opciók és preferált B modell dokumentált; kockázat nyíltan látható | Remote D1 read-only preflight, B/A választás, migration/rollback, URL/history/SEO szerződés | Draft/published isolation, permission/site, redirect/cache/SEO regresszió PASS |
| AI visual QA / experiments | H31.08 és H32.23 acceptance tervezési szinten rögzítve | AI/ANL storage, API, evaluation, consent és human approval | Provider/evaluation/browser és negatív tesztek |
| Cross-domain ownership | 145 multi-ID (100 cross-family); fő veszélyes szerepek rögzítve | Feature primary writer, adapter, read-only consumer, QA role | API deny, site isolation, no duplicate writes |
| Biztonság/backup/restore | SEC/OPS/QA külön ownership és release dependency | Migration és restore runbook | Valódi recovery drill, integrity/authorization teszt |

**22 modulos közös felhasználói funkció-review sorrend (49. fejezet, nem második terv):** 49.1 Kezdőlap; 49.2 Weboldal; 49.3 Márka/design; 49.4 Média; 49.5 Live; 49.6 OBS; 49.7 Integrációk; 49.8 Tartalom; 49.9 Közösség; 49.10 Bolt; 49.11 Támogatás; 49.12 Szponzoráció; 49.13 Analitika; 49.14 Automatizációk; 49.15 SANCI AI; 49.16 Keresés; 49.17 Értesítések; 49.18 Súgó; 49.19 Beállítások/biztonság; 49.20 Fejlesztői API; 49.21 Bővítmények; 49.22 Csapat/SaaS. A közös review során minden modulban ellenőrzendő: hiányzó funkció, helyes menühely, canonical owner, több felületen közös adat, integráció, prioritás és UX. Új ötlet a megfelelő meglévő modul/ID feature-contractjába kerül, nem új tervbe.

**Tervkapu döntés:** a dokumentációban azonosított hiányokból nem következik, hogy a teljes projekt minden független fejlesztése tiltott örökre; ugyanakkor a jelenlegi `PLAN IN PROGRESS / NOT PASS` státuszt nem lehet pusztán a fenti táblázattól PASS-ra állítani. A 22 modulos felhasználói review megkezdhető mint **terméktervezési ellenőrzés**, a `63.50.46` érintett runtime író útvonalak release-ének tiltása megmarad. A hiányzó történeti források `PARTIAL / REMAINDER OPEN` státusza megmarad; a review sem helyettesíti őket.

**Következő aktív alpont: `63.50.120`** — a felhasználói 22 modulos funkció-review előtti automatikus hivatkozás-/modullefedettségi ellenőrzés és a fennmaradó magas kockázatú owner/acceptance eltérések végső triage-ja. A közös review az előkészítés után külön termékdöntési kapu, nem runtime PASS. **PLAN IN PROGRESS / NOT PASS.**

### 63.50.120. Felhasználói valóságellenőrzés — kezdetleges runtime és célarchitektúra elkülönítése (2026-10-15)

**USER-CONFIRMED PRODUCT BASELINE / NO FEATURE COMPLETION INFERRED.** A felhasználó egyértelmű helyzetjelentése: a jelenlegi termék **kezdetleges**; a szerveroldali kapcsolat/alapok, a Twitch kapcsolat és egy kezdetleges Admin főoldal áll rendelkezésre. A Visual Editort **érdemben újra kell építeni**. A jelenlegi kódban a Twitch és sok más kezelés az Editorhoz kötődik; **ez nem elfogadott célarchitektúra**, hanem rendezendő örökölt állapot. A korábbi kódszintű E4/E5/E6 és egyedi Editor teszt-PASS nem jelent teljes Creator Center, Visual Editor vagy Twitch-integráció **termékfunkció PASS-t**.

| Terület | Jelenlegi, felhasználó által megerősített helyzet | Kötelező célhely / fejlesztési megközelítés |
| --- | --- | --- |
| Cloudflare Worker/D1/R2/auth/site-ownership alap | Részben működő szerveroldali alap; részletek csak forrás/runtime teszttel igazolhatók | Közös platform infrastruktúra, site-scoped canonical API; újrahasznosítás csak kódaudit és teszt után |
| Twitch kapcsolat | Kapcsolat létezik, de kezelése a kezdetleges Editorhoz keveredik | **49.7 Integrációk**: OAuth, kapcsolat, scope, token lifecycle, szinkron, hibák; **49.5 Live**: live/offline állapot és stream-műveletek; **49.1 Dashboard**: csak státuszkártya/gyorslink; **49.2 Editor**: kizárólag read-only adatbinding/blokk konfiguráció |
| Admin főoldal | Kezdetleges shell/dashboard | **49.1** jól használható kezdőlap, jogosultságfüggő navigáció, állapotkártyák és külön főmodulok; nem minden funkció gyűjtőhelye |
| Visual Editor | Kezdetleges; érdemi újratervezés és újraépítés szükséges | **49.2 Weboldal / Visual Editor**: Page Model, vászon, layers, inspector, responsive, komponensek, undo/redo, preview, save/reload; domainadat kezelés a saját modulban |
| Schedule, média, brand, content, analytics, AI, OBS, store stb. | A teljes funkciókészültség **nem igazolt**; nem szabad „késznek” számítani a tervbeli létezésből | A **49. fejezet 22 önálló, logikus főmodulja** és a megfelelő stabil ID/phase szerinti fejlesztés; mindenhol egy canonical writer és közös megjelenítés |

**Végrehajtási elvek:**
1. **A célterv az elsődleges, nem a meglévő UI.** A jelenlegi Editorból a rossz helyre került funkciók a helyes főmodulba kerülnek; csak a tesztelt, hasznos API/domain/command/persistence részek maradnak. A hibás UI szerkezetet nem őrizzük meg pusztán a kód újrahasznosítása miatt.
2. **Nincs második Editor, Twitch kapcsolat, médiaregiszter vagy Schedule adatmodell.** Több belépési pont megengedett, de azonos domain state és API; változás minden fogyasztóban konzisztensen jelenik meg.
3. **Előbb logikus modulhatárok és navigáció, utána fokozatos megvalósítás.** Első fejlesztési szelet: infrastruktúra és jogosultságok ellenőrzése → 22 modulos Admin IA/shell → integrációk/Twitch canonical kezelőnézet → Page Model/Editor core újraépítés → published/draft szerződés HIGH konfliktusának javítása és tesztje. Az egyes függőségek és release-kapuk a részletes fázisterv szerint felülvizsgálandók; a felsorolás nem helyettesíti a teljes sorrendet.
4. **A 396 ID megőrzendő célkatalógus, nem 396 kész funkció.** Státuszok csak bizonyítékkal emelhetők. A felhasználóval történő 22 modulos funkciólista-review a termékcél pontosítását szolgálja, nem jelenti a runtime készültséget.
5. **Kritikus blokk:** a `63.50.46` HIGH published/draft konfliktus nem kerülhet az új Editorba vagy az Admin Page UI-ba. Az érintett publish/metadata/URL műveletek csak a `63.50.114` szerződés és saját tesztjeik teljesülésével élesíthetők.

**Terv-review előtti modul- és ID-lefedettség:** a 49. fejezet `49.1–49.22` címei **22/22 egyediek**; a 24. fejezet **396 egyedi ID**, a 63.50.109–112 **396/396 routing**, a 63.52–53 **271/271 H-ID** ellenőrzése megőrzött. Ez strukturális, nem implementációs PASS.

**Következő aktív alpont: `63.50.121`** — a 22 modul konkrét menü- és funkciófelosztásának review-ready leltára, a jelenlegi Editorban rossz helyre tett domain funkciók migrációs sorrendje, és a korai fejlesztési szeletek elfogadási feltételei. **PLAN IN PROGRESS / NOT PASS.**

### 63.50.121. Creator Center IA és megvalósítási szeletek — senior tervezői kiegészítés (2026-10-15)

**TARGET ARCHITECTURE / REVIEW-READY DRAFT / NOT IMPLEMENTED.** A felhasználó jóváhagyta a fő elvet: az aktuális szerver/Twitch/Admin/Editor kezdetleges kódja nem diktálja a termékstruktúrát; az egyetlen MASTER teljes Creator Platformot céloz, 22 logikus modullal. A 49. fejezet **22/22 egyedi főmodult** tartalmaz, közülük **21 modulban legalább 4 explicit funkciócsoport** szerepel; a 49.22 több-site/SaaS modul későbbi, részletes alábontása most következik. A 396 stabil capability ID és 271 történeti H-ID továbbra is strukturálisan nyomon követett, nem runtime készültség.

**UX/navigációs szerződés (nem 22 állandó felső szintű menüpont):** elsődleges navigáció funkciócsoportokra bontható: **Alapmunka** (Kezdőlap, Weboldal, Márka, Média), **Creator Studio** (Live, OBS, Integrációk, Tartalom, Közösség), **Üzlet és növekedés** (Bolt, Támogatás, Szponzoráció, Analitika), **Munkafolyamatok** (Automatizációk, SANCI AI), **Platform** (Keresés, Értesítések, Súgó, Beállítások; később API, Bővítmények, Csapat/SaaS). A ritka és még nem kész modulok nem terhelik a napi navigációt: feature flag/permission/lifecycle alapján jelennek meg, de a teljes cél a 49. fejezetben megmarad. Desktopon oldalsáv + breadcrumb + gyorskeresés; mobilon/táblagépen reszponzív, billentyűzet- és képernyőolvasó-barát menü, egyértelmű aktív állapot.

**49.22 Csapat / több-site / SaaS későbbi almodulok (részletezés, nem új párhuzamos domain):**
- **Munkaterületek és site-ok:** workspace/site választó, tulajdonos, alapértelmezett site, archiválás, átadás, domainhez kötött public URL.
- **Csapattagok:** meghívás, szerepkörök, egyedi jogosultság, lejárat, visszavonás, aktivitásnapló, hozzáférés-felülvizsgálat.
- **Közös munka:** szerkesztési jelenlét, revision conflict, review/approval, feladatok, értesítések, audit.
- **Csomagok és korlátok:** entitlement, usage meter, kvóta, fair-use, billing webhook és fizetési állapot; egyetlen számlázási domain.
- **Tenant isolation:** site-scoped API, R2 objektumkulcs, D1 FK, background job, export/restore, cache és webhook; idegen site adataihoz sem direkt, sem kereséses hozzáférés.
- **SaaS üzemeltetés:** onboarding, trial, upgrade/downgrade, felfüggesztés, adat-export, törlés, support/admin impersonation csak kifejezett auditált kontrollal.
- **Kötelező tesztek:** másik site ID, role revoke, lejárt meghívás, kvótatúllépés, billing replay, cross-tenant cache leak, sikertelen site transfer és rollback.

**Editor-ból kivezetendő üzleti funkciók — canonical target:**
| Jelenlegi Editorba keverhető funkció | Célmodul | Editorban maradó funkció |
| --- | --- | --- |
| Twitch OAuth, token, sync, connection | 49.7 Integrációk | Twitch/live blokk adatforrás kiválasztása, preview |
| Live státusz, stream esemény | 49.5 Live | Live widget megjelenés/binding |
| Adásrend események CRUD | 49.5 Live/Adásrend domain, SCH canonical | Schedule blokk stílus és read-only data binding |
| Fájl feltöltés/asset életciklus | 49.4 Média | Asset picker és image/video blokk layout |
| Témák, ikonok, globális design token | 49.3 Márka/design | Token alkalmazás, komponens property |
| Tartalomgyártás/VOD/Shorts queue | 49.8 Tartalomstúdió | Content collection blokk és preview |
| Analytics, követő/metrika, export | 49.13 Analitika | Mérési komponens konfiguráció, nem analytics store |
| OBS scene, stream control | 49.6 OBS | Overlay/widget vizuális layout |
| AI agent/workflow/approval | 49.15 SANCI AI / 49.14 Automatizációk | AI javaslat alkalmazása csak diff + jóváhagyás után |
| Fizetés, tagság, bolt, támogatás | 49.10–12 saját üzleti modulok | Kártya/CTA/blokk megjelenés és canonical checkout link |

**Javasolt korai fejlesztési dependency-szeletek, a meglévő P/F fázistervvel összehangolandók:**
1. **Baseline és szerződés:** branch, CI, Worker/D1/R2/auth, site ownership, jelenlegi API/Editor/Twitch runtime leltár; keep/refactor/archive döntés; semmilyen kezdetleges funkciót nem minősítünk automatikusan PASS-nak.
2. **Creator Center shell:** egységes `/admin` canonical routing, 22 modul csoportosított IA, role/feature gating, állapot- és hibajelzések, reszponzív UI, működő modulnavigáció. Nem késznek látszó üres panelek.
3. **Integrációk/Twitch:** canonical OAuth connection/settings/sync/health a 49.7-ben; 49.1 dashboard és 49.5 Live csak API consumer; Editorból domain CRUD kivezetése, regression teszt.
4. **Weboldal alap és Editor v2 újraépítés:** Page Model és command/history/validation contract; canvas/layers/inspector, layout, responsive, undo/redo, save/reload, media picker, theme binding; nincs második Editor vagy saját domainadat.
5. **Publishing HIGH fix:** 63.50.46/106/114 D1 read-only preflight → storage döntés → migráció/rollback → explicit atomic publish → URL/SEO/cache/redirect és negatív acceptance; **a publish release előtt blokkoló**.
6. **Közös design/média és public UX:** 49.3/49.4 központi registry, design token, icon/template/component, responsive/a11y, public page, forms/CMS/SEO a saját domainnel.
7. **Creator munkafolyamatok:** Schedule, Content, Live, OBS, Community, analytics és integrations egymás függősége szerint, majd Commerce/Support/Sponsorship.
8. **Bővítés:** Automation, SANCI AI, search/notifications, developer API, plugin marketplace, team/multisite/SaaS, csak az alap security/observability/recovery gate után.

**Minden szelet Definition of Done:** (a) canonical owner és storage, (b) permission/site scope, (c) pozitív és negatív unit/integration, (d) browser/responsive/accessibility, (e) migráció/rollback/backup ahol érintett, (f) dokumentált UX acceptance, (g) éles user smoke ahol szükséges. A korai szeletek **terv**, nem végrehajtott munka.

**Következő aktív alpont: `63.50.122`** — a 49.22 almodulok 49. fejezetbe integrálása, korai fázisok és jelenlegi P/F függőségek ütközésellenőrzése, majd a 22 modul részletes felhasználói review-ja. **PLAN IN PROGRESS / NOT PASS.**

### 63.50.122. SaaS modul integrálása és fejlesztési fázisok ütközésellenőrzése (2026-10-15)

**INTEGRATED PLAN / REVIEW PREPARATION / NO RUNTIME CLAIM.** A 63.50.121 részletes 49.22 csapat/site/SaaS almoduljai **a kanonikus 49.22 menüfejezetbe is bekerültek**, nem csak auditjegyzetben szerepelnek. A 22 főmodul címe és sorszáma változatlan, új párhuzamos modul nem keletkezett.

**Fázis- és függőségi döntés:** a 63.50.121 nyolc korai szelete **ajánlott függőségi csoport**, nem írja felül a 9., 39. és 48. fejezet végrehajtási munkacsomagjait vagy a 19. fejezet egyetlen aktív munkapont szabályát. Az első valódi fejlesztési pont megnyitásakor ezekhez kell rendelni a konkrét P/F azonosítót, feature owner-t, kódútvonalat, tesztet és DoD-t. Az Admin shell és Integrációk/Twitch UI önmagában előkészíthető a HIGH publish konfliktustól függetlenül; a Page publish/metadata/URL író műveletek viszont csak a publishing szerződés és migrációs kapu után release-elhetők.

**Kritikus ellentmondások elkerülése:**
- A 49.2 Editor „újraépítés” **nem** jelenti a tesztelt auth/site ownership/Worker/D1 API eldobását. Megőrzés vagy kivezetés minden érintett komponensnél bizonyíték alapján.
- A Twitch kezelőfelületet át kell helyezni a 49.7 modulba; a kapcsolat rekordja, OAuth flow és provider token kezelése **nem duplikálható**. A 49.1/49.5/49.2 csak consumer.
- A 49.22 SaaS/tenant funkciók későbbi fázisúak, de a korai domain API-kat már most site-scoped módon kell kialakítani. A későbbi SaaS nem lehet ürügy a jelenlegi site-isolation megkerülésére.
- A 49.3 Brand Kit és a 49.4 Media registry külön owner; Editor csak közös picker/binding, nem saját ikon-/theme-/asset-adatbázis.
- Az egyes domainok működő funkcióinak elfogadása nem következik a 396/396 routing vagy a 22/22 menücím strukturális ellenőrzéséből.

### 63.50.123. Termékfunkció-review és fejlesztési alapállapot — 2026-10-15

**Felhasználói döntés:** kizárólag ez a MASTER a jelenlegi terv. A korábbi tervek archív bizonyítékok, nem kötelező újraolvasandó vagy újraauditálandó specifikációk. A történeti 00/A, 00.9.6.B és H19–H34 megfeleltetések lezáratlansága **nem önálló fejlesztési stop**. Ha egy mai funkciónál konkrét, releváns hiány vagy ütközés derül ki, azt a jelenlegi 49./24./54. fejezet megfelelő helyén javítjuk; nem indítunk új történeti auditciklust. A régi jegyzetek nem írhatják felül ezt a döntést.

**A 22 modul közös áttekintési sorrendje és határa:** az alábbi lista a 49. fejezetre mutató, felhasználóbarát review-index; **nem párhuzamos funkciókatalógus**. A részletes elfogadott scope kizárólag a 49. és 54. fejezetben, az azonosítók a 24. fejezetben élnek.

| # | Modul | Ellenőrizendő felhasználói képességek | Fő határ |
| --- | --- | --- | --- |
| 1 | Kezdőlap | állapot, feladatok, figyelmeztetések, gyorsműveletek, dashboard | csak összesített nézet |
| 2 | Weboldal | oldalak, navigáció, Visual Editor, CMS, SEO, lokalizáció, űrlapok, publikálás | oldal- és megjelenítési szerkesztés |
| 3 | Márka és designrendszer | Brand Kit, témák, tokenek, ikonok, sablonok, komponensek | design-definíciók |
| 4 | Média- és erőforráskönyvtár | upload, asset registry, keresés, variánsok, licencek, használati helyek | egyetlen médiatár |
| 5 | Élő adás és Stream Studio | műsor, naptár, live control, multistream, chat, checklist, markerek | adás/session |
| 6 | OBS és streameszközök | OBS, scene, overlay, widget, chatbot, makró, plugin adapter | eszköz- és overlay-runtime |
| 7 | Kapcsolatok és integrációk | OAuth, scope, provider capability, webhook, reconnect, napló | egyetlen provider-kapcsolatgazda |
| 8 | Tartalomstúdió | VOD, clip, Shorts, timeline, felirat, thumbnail, naptár, közzététel | médiaprodukció |
| 9 | Közösség és rajongók | fan profil, interakciók, moderáció, jutalmak, Discord szerepek | közösségi műveletek |
| 10 | Bolt és kereskedelem | termékek, checkout, rendelések, digitális delivery, refund | kereskedelmi rekordok |
| 11 | Támogatás és tagság | tip, tagság, perks, megújítás, entitlement | támogatási/tagsági jog |
| 12 | Szponzoráció és üzleti központ | partner, kampány, affiliate, deliverable | B2B üzleti folyamat |
| 13 | Analitika és növekedés | események, dashboard, riport, attribúció, insight | mérési/aggregált modell |
| 14 | Automatizációk | trigger, feltétel, action, workflow, retry, napló | workflow orchestration |
| 15 | SANCI AI | asszisztens, multimodális javaslat, memória, költség, jóváhagyás | AI nem önálló domain-író |
| 16 | Globális keresés | keresés, szűrők, parancspaletta | jogosultságszűrt index |
| 17 | Értesítési központ | inbox, preferenciák, csatornák, kézbesítés | értesítési életciklus |
| 18 | Súgó és onboarding | útmutató, kontextuális segítség, első lépések | súgó és haladás |
| 19 | Beállítások, biztonság és adat | fiók, hozzáférés, adatvédelem, audit, konfiguráció | identitás és policy |
| 20 | Fejlesztői platform és API | API, SDK, kulcsok, kvóták, dokumentáció | külső fejlesztői contract |
| 21 | Bővítmények és piactér | extension, widget, telepítés, permission, kompatibilitás | extension lifecycle |
| 22 | Csapat, több site és SaaS | workspace, szerepkör, meghívás, tenant, csomag | szervezeti hozzáférés |

**Közös review protokoll:** minden modulnál felhasználói szavakkal áttekintjük a funkciókat, az elvárt működést, a fontos hiányokat és a modulhatárt. Az elfogadott módosítást azonnal a 49. fejezetbe és szükség esetén a 24./54./fázisfejezetbe vezetjük át. Nem kérünk újra teljes történeti egyeztetést. A review akkor kész, ha a felhasználó mind a 22 modult jóváhagyta vagy a konkrét módosításokat rögzítettük; ezt előre nem állítjuk.

**Kódalaphoz kötött végrehajtás:** a jelenlegi repositoryban vannak Worker/D1 migrációk, Admin felületek, Twitch-alapok, Editor v2 és tesztek. A fájl jelenléte **nem** működési PASS. A review után az egyes funkciókat `WORKING + VERIFIED`, `PARTIAL/REBUILD`, `MISSING`, `BLOCKED BY PROVIDER` állapotba soroljuk; bizonyíték: konkrét fájl/route, automatizált teszt, böngészős viselkedés, szükség szerint éles ellenőrzés. Elsőként auth/site-isolation, Admin navigáció, WEB draft/published snapshot és Editor mentési alapok; majd Brand Kit/Media/Integrations/Stream és a többi függőség szerint. Új tesztbaseline megengedett; a bizonyítottan jó kódot megtartjuk, a hibásat célzottan javítjuk, a duplikált legacy felületet kontrolláltan archiváljuk.

**Kiadási szabály:** a történeti audit nem blokkoló; **valós** security, adatvesztés, site-scope, publish/rollback konfliktus vagy provider-jogosultsági hiba viszont az érintett funkció fejlesztési/élesítési kapuján kötelezően javítandó. Különösen a 49.2 published snapshot HIGH konfliktus **OPEN**, nem minősül megoldottnak. A későbbi AI/SaaS/marketplace részletek a megfelelő fázisban konkretizálhatók, a termékképességek nem vesznek el.

**Következő aktív alpont: `63.50.125`** — részletes modul-review és futtatott kódalap-tesztek, majd tesztvezérelt fejlesztés. Nem újabb teljes történeti audit.



### 63.50.124. Jelenlegi kódalap első bizonyított térképe — 2026-10-15

**Vizsgálati módszer:** az aktuális `v2/foundation` ág fájlfája és az alábbi konkrét fájlok forrásának olvasása. Ez **statikus forráskód-felmérés**, nem lefuttatott teszt és nem production PASS. A Cloudflare-fiókban a `sanci9517-streamer-brand` Worker és `sanci9517-db` D1 erőforrás olvasással azonosítva; ez nem bizonyítja a telepített verziót vagy az üzleti működést.

| Termékterület | Bizonyított forráshely | Első besorolás | Következő kötelező ellenőrzés |
| --- | --- | --- | --- |
| Worker és route shell | `src/index.ts`, `src/core/router.ts`, `wrangler.jsonc` | EXISTS / RUNTIME UNVERIFIED | health, auth, route-konfliktus és hibakezelés |
| Auth/Admin belépés | `src/routes/auth/*`, `src/core/auth/*`, `src/index.ts` | EXISTS / SECURITY TEST NEEDED | session, role, site isolation, redirect és negatív teszt |
| Admin kezdőlap | `public/admin-home.html`, `src/index.ts` | EXISTS / UX REVIEW NEEDED | valós menü, jogosultság, mobil, nem működő gombok |
| Weboldal/Page Model | `src/routes/admin/pages.ts`, `src/routes/public/pages.ts`, `src/core/page-model.ts` | EXISTS / HIGH PUBLISH RISK OPEN | draft/published slug, snapshot, redirect, rollback |
| Visual Editor v2 | `public/editor-v2/*`, `src/routes/admin/editor.ts` | PARTIAL / REBUILD DECISION PENDING | boot, canvas extent, inspector, save, undo/redo, responsive |
| Legacy Editor | `public/editor/*`, `public/assets/page-builder.js` | LEGACY CANDIDATE / DO NOT DELETE | referencia-funkciók leltára és kanonikus route kizárás |
| Twitch / Integrations | `src/routes/integrations/twitch.ts`, `src/core/twitch-*.ts` | PARTIAL / PROVIDER LIVE CHECK NEEDED | OAuth, token refresh, scope, reconnect, site ownership |
| Schedule | `src/routes/admin/schedule.ts`, `src/routes/public/schedule.ts`, `src/core/schedule/*` | EXISTS / DOMAIN TEST NEEDED | source sync, timezone, edit, published read |
| D1/migrációk | `migrations/0001*–0017*`, `wrangler.jsonc` | SCHEMA EXISTS / REMOTE DATA UNTOUCHED | read-only schema és migration state; mentés előtt nincs írás |
| Automata tesztek | `package.json`, `tests/*`, `public/editor-v2/tests/*` | TEST FILES EXIST / NOT EXECUTED HERE | tiszta check: typecheck, editor, schedule, domain, auth, admin |

**A többi 49. fejezetbeli modulnál** a fájlfában nem talált dedikált, igazolt end-to-end implementációt ebben a körben; állapotuk `NOT YET VERIFIED`, nem önkényesen `MISSING` vagy `DONE`. A 396 funkció-ID megőrzött scope, nem 396 elkészült funkció.

**Fejlesztésindítási sorrend (bizonyítékvezérelt):** (1) nem destruktív read-only runtime/DB és tesztbaseline; (2) admin shell + jogosultság; (3) HIGH WEB publish snapshot és slug elkülönítés; (4) Editor v2 használható minimuma; (5) külön Brand Kit / Media / Integrations / Schedule domainok; (6) további 49. fejezetbeli modulok függőség szerint. Az első körben nincs production deploy, D1 írás vagy régi kód törlése.

**Funkció-review:** a 63.50.123 táblája a 22 modulos áttekintési index. Az összes részletes funkciót a 49./54. fejezetből, modulonként kell közösen jóváhagyni; hiány esetén ugyanott kiegészíteni. A felhasználó jóváhagyását és a futó implementáció bizonyítékát nem helyettesíti a jelen bejegyzés.

**Következő alpont:** `63.50.125` — első modulok részletes termék-review-ja, majd a fenti tesztbaseline konkrét eredményeinek rögzítése. A régi terv-audit nem tér vissza automatikus kapuként.

### 63.51. Végső terv használati rendje — egyetlen MASTER, nincs második audit-roadmap

**Ez a rész a korábbi 63.x auditnapló egészének aktuális értelmezése; nem második terv és nem új funkciókatalógus.**

1. **Mit tekintünk egyetlen irányadó helynek?** Termékvízió: 1.; felhasználói főmodul és menü: 49.; domain és adatgazda: 5. és 63.20; funkció-ID és név: 24.; feature contract: 10., 25.–26. és az ID egyedi mátrixa (63.26–63.37); teljes review checklist: 54.; F0–F11 sorrend: 41.2 és 63.38; aktuális munka: a dokumentum fejlécében szereplő egyetlen aktív pont. Az archívum nem alternatív irányító dokumentum.
2. **Mit jelent az „elkészült terv”?** Végleges, teljes termékscope és stabil modul-/adatgazda-határok; minden megőrzendő követelmény megtalálható az ID-katalógusban vagy önálló, indokolt nyitott tételként. Ez **nem** jelenti a teljes Creator Platform elkészültét, a provider-hozzáférések létét, sem 396 futó feature PASS-át.
3. **Miért nem gyártunk 396 feltételezett API-kártyát most?** A fázisok későbbi technikai döntései (SaaS, AI, marketplace, fizetés, provider-permission) csak az adott munka aktiválásakor, a friss kód/externális feltételek alapján specifikálhatók pontosan. A termékcél, acceptance-feltétel, domain-owner, sorrend és dependency addig is kötelezően megmarad a MASTER-ben. A részletes 17 mezős kártyát nem lehet megkerülni: **egyenként, a tényleges implementáció előtt** kerül teljesítésre.
4. **Felhasználói működés:** logikus, feladatközpontú Admin-modulok; a Visual Editor kizárólag oldal-megjelenítést és összerakást szerkeszt, az Integrations/Brand Kit/Assets/Schedule/Content/OBS/Commerce/Analytics/Automation/AI saját domainje egyetlen adatforrásként működik. Ugyanaz a domain több nézetből vezérelhető, de a változás minden felületen ugyanarra a kanonikus állapotra hat.
5. **Technikai döntés:** mindig aktuális repo, migráció, route, teszt és production evidence alapján döntünk: előbb REUSE, szükség esetén ADAPT, BUILD csak igazolt hiányra; nincs második Visual Editor, második media registry, második schedule CRUD, rejtett AI write, vagy önkényes DB-domén tulajdonosváltás.
6. **Minőségi és kockázati korlát:** ownership/auth, revision/concurrency, hibás hálózat, undo/rollback, accessibility, mobil, i18n, privacy/security, deployment/restore, provider limits és költség csak releváns, igazolt acceptance-tel PASS. A dokumentációs ellenőrzés soha nem futtatott teszt.
7. **Nyitott blokkoló:** a történeti forrásmegfeleltetés (különösen a korábban jelzett 00/A és 00.9–00.9.6.B hiány) **nincs ebben a jelenlegi MASTER-ben forrásonként bizonyítva**; visszanyerés vagy explicit nem-visszanyerhető, hatáskörrel és megőrzési döntéssel rögzített átvezetés szükséges. Nem tekintjük automatikusan lezártnak attól, hogy 396 aktuális ID létezik. Emellett a 63.1–63.2 szemantikai konfliktusai és a felhasználóval történő végső funkció-review nyitott.
8. **Jelenlegi egyetlen aktív pont:** `PLAN-PRODUCT-REVIEW-AND-IMPLEMENTATION-BASELINE` — `IN PROGRESS`. **Következő ellenőrizhető lépés:** a 63.50.123 szerinti 22 modul közös funkció-review-ja és konkrét hiányainak átvezetése a 49./24./54. fejezetekbe; utána a jelenlegi kód működési baseline-ja és tesztvezérelt fejlesztése. Történeti forráskeresés nem automatikus fejlesztési kapu; tényleges security/publish hibát az érintett release előtt javítani kell.

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

---

## 64. Univerzális Brand Platform — véglegesített termékszerződés és példaprofilok

**Döntés:** a termék nem egy streamerre szabott oldal, hanem egy vizuálisan teljesen szerkeszthető, moduláris nyilvános webhely- és brand-üzemeltető rendszer. A 0.9, 3, 49, 56 és 57 fejezetek az irányadók; ez a fejezet a még szükséges implementációs specifikációkat teszi explicitté, nem vezet be második modulregisztert. **Státusz:** jóváhagyásra javasolt termékkövetelmények; nem implementációs PASS.

### 64.1. Kötelező személyek és használati útvonalak

| Profil | Elsődleges cél | Kezdőoldalak | Ajánlott modulok | NEM előfeltétel |
|---|---|---|---|---|
| Streamer | Live jelenlét és közösség | Home, Live, Schedule, About, Clips | Twitch, Schedule, Stream Studio, Media | Shop, SaaS, AI |
| Videós / social creator | Tartalom és csatornák | Home, Videos, Projects, Contact | Content Studio, Social, Analytics | OBS, live |
| Fotós / designer / művész | Referenciák és ajánlatkérés | Home, Portfolio, Project detail, About, Contact | CMS, Media, Forms, SEO | Twitch, OBS |
| Zenész / zenekar | Megjelenések és fellépések | Home, Music, Events, Press, Contact | Media, Events, Content | Shop, streaming |
| Podcaster / író | Epizód és hírlevél | Home, Episodes/Blog, About, Subscribe | CMS, RSS, Email | Video editor |
| Freelancer / ügynökség | Ajánlat és ügyfélszerzés | Home, Services, Cases, FAQ, Contact | Forms, Leads, Services | Membership |
| Kisvállalkozás / helyi brand | Bemutatkozás és konverzió | Home, Services/Products, Team, Contact, Policy | CMS, SEO, Local business | Live |
| Oktató / szerző | Tudásanyagok | Home, Courses/Resources, About, Contact | CMS, Digital products, Membership | Twitch |
| Nonprofit / közösség | Esemény és támogatás | Home, Mission, Events, Support, Contact | Events, Forms, Donations | Commerce |
| Rendezvény / kampány | Informálás és regisztráció | Landing, Agenda, Speakers, Register, FAQ | Events, Forms, Analytics | Hosszú távú CMS |
| Általános / üres | Szabad építkezés | Empty starter vagy minimal landing | Site Core, Templates, Editor | Bármely provider |

**Keresztprofil-elfogadás:** az induló profil csak sablon- és modulajánlás; később profilváltás, vegyes használat, oldalak átrendezése és modulbővítés adatvesztés nélkül lehetséges. Egyetlen publikus domain/site engine létezik.

### 64.2. Felhasználói kezdővarázsló (Onboarding) részfeladatai

1. `BRAND-ONB-01` Fiók és workspace: meghívás/regisztráció módja, tulajdonos és jogosultság; létrehozás tranzakcionális, hiba után újrapróbálható.
2. `BRAND-ONB-02` Márkaprofil: elnevezés, slug, cél, nyelv, időzóna, tárgykör, vállalkozási/alkotói adatok opcionálisan.
3. `BRAND-ONB-03` Starter választó: célcsoport, stílus, előnézet, elérhető modulok, licenc és erőforrásigény.
4. `BRAND-ONB-04` Arculat: logó, színek, tipográfia, képek; brand preset előnézet és reset.
5. `BRAND-ONB-05` Tartalmi vázlat: oldalfa, navigáció, demo tartalom, hiányzó mezők és publikusítás előtti ellenőrzőlista.
6. `BRAND-ONB-06` Modulajánlás: enable/skip, függőségek, provider kapcsolatok külön beleegyezéssel.
7. `BRAND-ONB-07` Webcím: ingyenes aldomain vagy validált egyéni domain, DNS és TLS status; domain korlátok csomagfüggők.
8. `BRAND-ONB-08` Preview, hozzáférhetőség/SEO és publikusító kapu; soha nem automatikus publikálás.
9. `BRAND-ONB-09` A varázsló állapota menthető, lépés kihagyható; hibás állapotból adatvesztés nélkül visszaléphető.
10. `BRAND-ONB-10` Empty project: teljes értékű választás, nem kötelező semmilyen template vagy provider.

A `BRAND-*` jelölések **új, ideiglenes tervezési alazonosítók** a meglévő 396 stabil ID mellé; implementálás előtt a 24/54. fejezetbe illesztendők, és nem módosítják a régi ID-kat.

### 64.3. Általános publikus webhely kötelező elemei

- `BRAND-SITE-01` Oldal CRUD, draft/published állapot, route, slug, hierarchia, canonical URL, menük, fejléc, lábléc, 404/410 és átirányítások.
- `BRAND-SITE-02` Responsive, szemantikusan helyes oldalrender, statikus/dinamikus blokkok, alt text, billentyűzet, screen reader, reduced motion.
- `BRAND-SITE-03` Meta title/description, OG/Twitter card, favicon, sitemap, robots, structured data, hreflang, láthatósági beállítás és validáció.
- `BRAND-SITE-04` Domain, subdomain, TLS, publish és rollback; route-ütközések, hostname ownership és cross-site szivárgás tilalma.
- `BRAND-SITE-05` SEO-barát CMS collection page / item detail / listing / paging / taxonomy / filtering / internal search.
- `BRAND-SITE-06` Kapcsolatfelvételi űrlap, spamvédelem, consent, rate limit, siker-/hibaállapot, értesítés és retention.
- `BRAND-SITE-07` Social profile, link, contact, location és business-info blokk; külső API nélküli statikus megjelenítés is működik.
- `BRAND-SITE-08` Esemény-, szolgáltatás-, projekt-, csapattag-, gyakori kérdés- és tesztimoniál tartalomminta, a közös CMS típusokra építve.
- `BRAND-SITE-09` Nyilvános keresés, kategória/címke, empty result, pagination és többnyelvű fallback.
- `BRAND-SITE-10` Privacy, cookie/consent preference, retention és adatvédelmi export/törlés a tényleges alkalmazási kötelezettségek szerint.
- `BRAND-SITE-11` Látogatóbarát layoutok: landing, portfolio, blog, publication, service, profile, directory, event, shop és community; mindenki személyre szabhatja.
- `BRAND-SITE-12` Performance: kép/srcset, lazy loading, font loading, caching, invalidation, megfigyelhető Core Web Vitals; mérési eredmények nélkül nincs PASS.

## 65. Sablonok, presetek és design rendszer — végrehajtható technikai szerződés

**Kanonikus owner:** 49.3 Márka és designrendszer, 56/57 design registry; a Weboldal, Editor, Stream Studio és Tartalomstúdió csak domain API/action útján használhatja. **Nincs második template engine.**

### 65.1. Fogalmak és szabályozott élettartam

| Objektum | Mit tárol | Példányosítás | Követő frissítés | Saját adat? |
|---|---|---|---|---|
| Site kit | webhelystruktúra + konfigurációs függőségek | új site vagy új kit alkalmazás | explicit diff/merge | demóadat elkülönül |
| Page template | oldalszerkezet és kötési helyek | új oldal | explicit verziómigráció | nincs élő üzleti rekord-másolat |
| Section pattern | többkomponenses minta | független copy | alapból nem | nincs |
| Synced component | közös megjelenés- és property szerződés | linkelt instance | igen, scope szerint | nincs |
| Component instance | property-k, slotok, override-ok | oldal/overlay helye | forrásöröklés + override | csak ref |
| Theme | design tokenértékek és variánsok | site scope | verziózott változás | nincs |
| Brand Kit | logó/asset/ikon/font/tone guide | workspace/site scope | explicit | asset ID referenciák |
| Preset | paraméterezett értékcsomag adott funkcióhoz | copy/apply | csak explicit | nincs token/secret |
| Workflow template | trigger/action gráf | disabled draft | explicit migration | secret placeholders |
| Content type template | CMS mezőséma és view mapping | séma létrehozás | biztonságos schema migration | nem automatikus publikus rekord |

### 65.2. Registry-k és minimális adatmodell

- `template_registry`: `id, owner_workspace_id nullable, owner_site_id nullable, type, stable_key, version, schema_version, origin, visibility, title, locale, category, tags, manifest, preview_asset_id, license, status, created_at, updated_at`.
- `template_dependencies`: `template_version_id, required_module_id, min_version, asset_id nullable, token_ref nullable, permission_scope nullable, optional`.
- `template_installations`: `id, source_template_id, version, target_site_id, actor_id, status, install_manifest_hash, applied_revision_id, installed_at`; telepítés idempotencia kulccsal.
- `template_instance_links`: `instance_id, source_template_version_id, site_id, detach_state, overrides, last_merge_base, parent_instance_id nullable`; a globális komponens külön publish/rollout szabályokkal.
- `theme_registry` és `theme_versions`: token-séma, mode, scope, inheritance, override map, preview, rollback.
- `brand_kits`: asset ID-k, logóvariánsok, font licencek, ikonkészlet, tone guide; titkos kulcsot nem tartalmaz.
- `preset_registry`: `preset_type, target_contract_version, params_schema, param_values, scope, compatibility, preview, status`; import/export validált, verziózott manifesttel.
- `asset_registry` továbbra is a 49.4 média domainé; sem a sablon, sem a Brand Kit nem lesz második bináris tárhely.
- A táblanevek **tervezett logikai sémák**, nem ellenőrzött meglévő migrációk; tényleges D1 modell csak a repo és migrációk felmérése után készül.

### 65.3. Template manifest szerződés

```json
{
  "schemaVersion": 1,
  "id": "site.portfolio.minimal",
  "version": "1.0.0",
  "kind": "site-kit",
  "label": "Minimal Portfolio",
  "locale": "hu-HU",
  "entryPages": ["home", "portfolio", "about", "contact"],
  "requiredModules": ["site-core", "cms", "forms"],
  "optionalModules": ["analytics"],
  "brandTokens": ["color.primary", "font.heading"],
  "assetRefs": [],
  "permissionsRequested": [],
  "minimumPlatformVersion": "0.0.0",
  "license": "explicit-license-required"
}
```

Példa, nem produkciós végleges séma: az importált JSON-ra külön szerveroldali JSON Schema / domain validáció és kompatibilitási ellenőrzés kell. Nincs tetszőleges JS, HTML script, credential, remote loader vagy SQL a manifestben.

### 65.4. Sablon szerkesztés, frissítés, megosztás — elfogadási checklist

- [ ] A sablon kereshető cél, stílus, ágazat, modul, nyelv, licenc, layout, változatszám és kompatibilitás szerint.
- [ ] Desktop/tablet/mobile előnézet valós renderelővel, nem marketing mockuppal.
- [ ] Sablonból létrehozás nem tesz közzé semmit automatikusan, és nem másol titkos vagy privát adatot.
- [ ] Független pattern vs linkelt global component vs theme token öröklés a UI-ban megkülönböztetett.
- [ ] Saját másolat létrehozása, version snapshot, változásdiff, háromutas merge vagy világos manuális konfliktuskezelés.
- [ ] Globális elem módosításakor impact count/lista, preview és visszaállítás.
- [ ] Paraméteres preset alkalmazás előtti preview; no-op és hibás paraméter kezelése; batch részleges hiba helyreállítása.
- [ ] Import/export csomag verzió, licenc, szükséges modulok, asset manifest, checksum és kontrollált méretkorlát.
- [ ] Nem kompatibilis verzió, hiányzó modul, hiányzó ikon/font, rosszindulatú SVG és hiányzó asset esetén biztonságos fallback.
- [ ] Draft, review, publish, archive, deprecated; rollback és teljes terjesztési előzmény.
- [ ] Marketplace feltöltőnek nincs automatikus futtatható kód- vagy titokhozzáférése.

### 65.5. Preset családok — minimum katalógus

| Preset típus | Kötelező kezdeti változatok | Beállítások |
|---|---|---|
| Brand | minimal, bold, editorial, corporate, creator, gaming | paletta, font, spacing, radius, icon tone |
| Oldal/layout | hero, split hero, gallery, editorial, landing, directory | column, gap, alignment, responsive |
| Gomb/CTA | solid, outline, ghost, icon, destructive | state, size, focus, hover, disabled |
| Header/navbar | centered, split, sidebar, overlay, compact | nav mode, sticky, mobile, a11y |
| CMS listing | grid, cards, masonry, timeline, list | pagination, filter, sort, empty |
| Portfolio | image-first, case-study, project cards | gallery, metadata, categories |
| Forms | contact, inquiry, newsletter, RSVP | fields, validation, consent, spam |
| SEO | social sharing, local business, article, portfolio | title rules, OG, structured data |
| Stream overlay | chat, event ticker, starting soon, BRB, ending | canvas size, animation, safe zone |
| Alerts | follow/sub/donation/raid | sound, duration, queue, fallback |
| Content/thumbnail | video landscape, short vertical, square social | aspect ratio, caption safe zones |
| Video export | landscape 16:9, vertical 9:16, square 1:1 | dimensions, bitrate, subtitle |
| Analytics dashboard | starter, campaign, stream, commerce | widget definitions, date range |
| Automation | stream start notice, new content post, contact lead | triggers, permissions, dry-run |
| Accessibility | high contrast, reduced motion, larger text | WCAG-compatible properties |
| Localization | hu first, multi-locale, fallback | locale, slug, translation state |

Minden preset csak a maga jogosult paramétereit módosíthatja, változáslista alapján. Preset neve nem bizonyít kompatibilitást; konkrét célobjektum/verzió ellenőrzés szükséges.

## 66. Vizuális szerkesztők — részletes tulajdonosi és komponenshatárok

### 66.1. Egy közös vizuális infrastruktúra, külön cél-UI

- `Page Editor` a 49.2 Weboldalé: page model, layout, DOM/szemantika, responsive, data binding, revisions, preview.
- `Overlay Editor` a 49.6 Stream eszközöké: scene canvas, broadcast dimensions, safe zones, OBS Browser Source, event widgets, animations, overlay preview.
- `Video/Thumbnail Editor` a 49.8 Tartalomstúdióé: timeline, cut, aspect ratio, captions, export job, media link, thumbnails.
- Közös rész: color/typography/icon pickers, asset manager, selection patterns, keyboard semantics, undo transaction primitive, Brand Kit és registry UI.
- Tiltott: második Page Model; OBS payload közvetlenül Page Modelbe; videó bináris a D1-be; független ikon/asset/brand nyilvántartás.

### 66.2. Page Editor részfeladatok

1. `EDITOR-BASE-01` Canvas és közös renderer: layout/rétegfán alapuló render, canvas pan/zoom/fit, selection hit targets.
2. `EDITOR-BASE-02` Komponens beszúró: böngésző, keresés, kedvencek, kategóriák, adatforrásfüggő blokkok.
3. `EDITOR-BASE-03` Layers: reorder, nesting constraints, tree keyboard navigation, csoportosítás, kontextusmenü, locked/hidden.
4. `EDITOR-BASE-04` Inspector: property schema, validáció, inheriting/overridden érték jelölése, responsive mode.
5. `EDITOR-BASE-05` Elhelyezés: grid/flex/stack, resize, snapping, spacing, min/max, align, safe overflow; vászon követi a tartalom méretét.
6. `EDITOR-BASE-06` Interakciók: links, hover/focus/active/disabled, anchors, animation transitions, reduced motion.
7. `EDITOR-BASE-07` Adatkapcsolat: CMS fields, media assets, schedule, products, live state, integration-supported widgets; source error/fallback.
8. `EDITOR-BASE-08` Történet: grouped undo/redo, transactions, dirty state, autosave-policy, save conflict, recovery draft.
9. `EDITOR-BASE-09` Responsive: desktop/tablet/mobile preview, breakpoint inheritance, per-viewport override, overflow checks.
10. `EDITOR-BASE-10` Preview/publish: validation, access control, revision compare, preview link expiry, snapshot, rollback.
11. `EDITOR-BASE-11` Accessibility: semantic headings, form labels, focus order, keyboard drag alternative, alt and contrast checks.
12. `EDITOR-BASE-12` Tesztmátrix: mouse/touch/keyboard × narrow/standard/wide × saved/draft/conflict × public/private.

### 66.3. Shared component property contract

`componentId, version, displayName, allowedParents, allowedChildren, slots, propsSchema, defaultProps, responsiveProps, tokenRefs, dataBindings, actions, accessibleNamePolicy, styleScope, events, migrationStrategy`.

- A property editor nem ír közvetlenül a domain business táblákba; csak validált szerkesztői commandokat küld.
- Dynamic block csak ID/ref és display options értéket tárol; a backend olvasáskor jogosultságot és publish scope-ot érvényesít.
- Komponens visszamenőleges inkompatibilitásnál schema migration vagy stabil readonly fallback.

## 67. Közös szolgáltatások, jogosultságok és integrációk — megvalósítási részletek

### 67.1. Entitlement, module és ownership

- `MODULE-01` moduldefiníció és verzió; bekapcsolás nem azonos fizetős jogosultsággal.
- `MODULE-02` feature capability státusz: available/limited/unsupported/permission-required/disabled; platformonként és site-onként.
- `MODULE-03` owner/workspace/site/resource ellenőrzés minden API-útvonalon; public rendering csak published resource.
- `MODULE-04` provider connection külön objektum, engedélyállapot, lejárat, last verified, throttling, revoke és audit.
- `MODULE-05` modul kikapcsoláskor dependency impact és biztonságos fallback, retention-policy és újraaktiválás.
- `MODULE-06` plan limits és quota mérhető, szerveroldalon érvényesített, magyarázott; upgrade nem törli a korábbi adatot.

### 67.2. Form, CMS és dinamikus tartalom

- Form schema: mezőtípus, required, length, format, honeypot, server validation, consent, retention, success action, notifications.
- Submission: site-scope, encrypted where appropriate, IP retention policy, spam flags, rate-limit, export, deletion, audit.
- CMS type: stable id, field schema, locale, relationship constraints, validation, revisions, publish state, slug uniqueness.
- Read API pagination/filter/sort és access; public query nem ad draft/private mezőket.
- Függőség: navigáció, templating, SEO, form inbox és marketing csak azonos domain-recordra hivatkozik.

### 67.3. Cross-module esemény szerződés

`eventId, eventType, schemaVersion, sourceDomain, workspaceId, siteId, resourceId, occurredAt, correlationId, idempotencyKey, privacyClass, payload`.

- Producer teszteli validációt, consumer idempotens; esemény újraküldés nem dupláz vásárlást, értesítést vagy publikálást.
- Queue failure/retry, poison message, dead-letter, redaction és audit; publikálási mellékhatáshoz kompenzáció ahol lehetséges.
- Event schema verzióváltás consumer compatibility és migrációs stratégia nélkül nem élesíthető.

### 67.4. Általános integráció adapter

`connect, capabilityCheck, health, refresh, revoke, sync, rateLimit, normalizeError, normalizedEvent, permissionManifest`.

- Felhasználó képes connectiont leválasztani; webhook aláírás és lejáró token tesztelt.
- API-scope hiánya nem „siker”; a UI külön unsupported, disconnected, permission-limited, stale, error állapotot mutat.
- Másik site nem örökli automatikusan a kapcsolatot és a tokent.
- Provider-alapú publikálás előtt preview, explicit platformjog, rate/quota és idempotencia szükséges.

## 68. AI, videó, automatizáció és SaaS — kötelező későbbi szerződések

### 68.1. SANCI AI biztonságos rétege

- Modell/provider adapter, verzió, prompting policy, input/output schema, usage/cost/quota, audit és retention.
- Knowledge scope: felhasználó/workspace/site, kapcsolt forrás hozzáférés, titokmaszkolás; más tenant adata soha nem retrieval input.
- Végrehajtás: ajánlat → strukturált diff → validáció → permission → preview → emberi jóváhagyás → draft művelet; publish csak külön policy szerint.
- Stream insight és clip candidate csak engedélyezett audio/video inputból, ismert késleltetéssel és jogszerű megőrzéssel.
- Nem kötelező AI: minden alapművelet kézi UI-ban teljes értékű.

### 68.2. Media/VOD feldolgozási pipeline

`upload/import → scan/validate → metadata → normalize/transcode → preview → edit/timeline → captions → export → review → provider publish → metrics`.

- Job lifecycle idempotens és lekérdezhető; megszakítás, retry, refund/cost cap, provider failure és letöltési engedély világos.
- R2 bináris, D1 metadata; hosszú munka queue/workflow; videóencoding szolgáltatás külön kapacitás- és költségdöntés után.
- VOD-tulajdon, zene/jogdíj, feliratnyelv, accessibility és platformfeltöltési policy mint kötelező acceptance.

### 68.3. SaaS indulás előtti gate

- Teljes tenantizoláció: DB query, R2 key, cache key, logs, analytics, search, export, template sharing, support access.
- Billing: plan entitlement, usage meter, subscription lifecycle, invoice/tax integration, failed payment, grace period, cancellation, data retention.
- Sablonpiactér: szerző, licenc, moderáció, verzió, kifizetés, visszatérítés és copyright complaint; auditált install.
- SLA/incident, recovery test, support flows, legal/privacy és abuse management; mind mérhető, nem marketing-állítás.

## 69. Végleges fejlesztési függőségi útvonal — a nagy cél kisebb, lezárható lépésekben

**Egyszerre egy aktív fejlesztési szelet.** A fázisok nem funkciótörlések. A konkrét státusz a repo, teszt és szükséges böngészős/éles bizonyíték alapján frissül.

| Sorrend | Deliverable | Kötelező bemenet | Kapu / ellenőrzés |
|---|---|---|---|
| F0.1 | Auth + site ownership + egységes Admin route baseline | jelenlegi Worker/D1 | 401/403, cross-site negatív teszt, login |
| F0.2 | Editor–Save–Reload megbízható folyamat | Page Model, revision | dirty state, konfliktus, hálózati hiba, undo |
| F0.3 | Preview–Publish–Public | publish snapshot, public renderer | draft nem live; stale revision konfliktus; rollback |
| F1.1 | Site Core + többszintű oldalak/navigáció | F0 | oldal CRUD, 404/redirect, site scope |
| F1.2 | Globális Brand Kit és design tokenek | F1.1 | token cascade és override, a11y |
| F1.3 | Asset/Icon/Font Registry | F1.1 | upload, ownership, usage, license, retry |
| F1.4 | Komponenskönyvtár + property registry | F0, F1.2–1.3 | template instance, inspector, responsive |
| F1.5 | Site/Page/Section template registry | F1.4 | preview, install, update, rollback |
| F1.6 | Preset registry + onboarding starter kit | F1.5 | profile independent, diff, reset |
| F2.1 | Strukturált CMS + dinamikus oldalak | F1 | content type, collection, public/draft |
| F2.2 | Forms + leads + consent + spam | F2.1 | validáció, notification, data export |
| F2.3 | SEO / internationalization / domains | F1–2.2 | metadata, sitemap, HTTPS, hreflang |
| F3.1 | Provider Hub, Twitch connection | F0–F2 | scope, reconnect, separation |
| F3.2 | Live + Schedule + Games | F3.1 | timezone, sync, public fallback |
| F3.3 | OBS + overlay + widget/alert | F3.1–3.2 | safe socket, preview, streaming latency |
| F4.1 | Content Studio + social publishing | F2, F3 | calendar, queue, provider restrictions |
| F4.2 | VOD/video/shorts pipeline | F4.1, R2/queue | jobs, export, consent, review |
| F5.1 | Community + membership | F2, auth/identity | moderation, entitlement, revoke |
| F5.2 | Commerce + donations + sponsors | F5.1, provider | financial idempotency, privacy |
| F6.1 | Analytics and campaign measurement | F2–F5 | freshness, attribution, no fake metrics |
| F6.2 | Automation engine | event bus + perms | dry-run, retry, audit, loop guard |
| F7.1 | SANCI AI assistant and tools | F0–F6 | permission, approval, quota, AI-off flows |
| F8.1 | Multi-workspace SaaS and marketplace | site/tenant isolation | billing, exports, support, legal |

**Fázisok közötti invariáns:** security, privacy, a11y, locale, mobile, observability és backup acceptance minden szeletnél vizsgálandó. Egy önmagában nem releváns future-feature hiánya nem blokkolhatja az aktuális kisebb szeletet.

### 69.1. Első tényleges fejlesztési slice specifikációja

**F0.2–F0.3 összefüggő kritikus út:** bejelentkezés → Admin → Editor → oldal kiválasztás → módosítás → save → reload → draft preview → publish permission → published snapshot → publikus GET → rollback. Külön negatív tesztek: rossz site ID; jogosulatlan role; elavult revision; konkurens publikálás; eltűnő internet; mentés utáni további változtatás; asset 404; iframe/script injection; mobil szélesség; hard refresh és cache invalidation. A `HIGH publish conflict` **OPEN marad bizonyított regressziós javításig**.

## 70. A MASTER véglegesítésének és fenntartásának egyértelmű rendje

1. **Egyetlen aktuális tervfájl:** `docs/SANCI9517-CREATOR-PLATFORM-PLAN.md` a `v2/foundation` ágon. Más fájlok README-k, implementációs dokumentációk vagy archívumok; nem versengő MASTER-ek.
2. **Funkciószintű review:** a 22 adminmodul és 396 eredeti stabil ID mellett a 64–69. fejezetek új termékszerződéseinek megfeleltetése. Nincs automatikus 396→növelt készültség; az új `BRAND-*`, `MODULE-*`, `EDITOR-BASE-*` azonosítók előbb ID-gazdát kapnak a jelenlegi 24/54. fejezeten belül.
3. **Nincs végtelen történeti audit:** a korábbi forráshiány megmaradhat provenance-jegyzetként, de önmagában nem indokolja a modern termékterv örökös újranyitását. Biztonsági, adatvesztési és publish-konfliktus valós release gate-ként kezelendő.
4. **Tervezési lezárási kapu:** a funkcióknak owner, Admin hely, publikus/Editor szerep, adat/API, permission, dependencies, fázis, pozitív és negatív acceptance kell; a hiányzó ágazati sablonokat a 64.1 profilok ellenőrzik.
5. **Fejlesztési lezárási kapu:** tested, browser-verified, deployed-verified külön státusz. Tervezett képességet nem nevezünk késznek.
6. **Változáskezelés:** minden új funkció először a megfelelő meglévő modulba kerül; régi ID-t nem törlünk/újraszámozunk. Minden módosítás egyetlen aktív pontot és egy következő végrehajtható lépést rögzít.
7. **A jelen dokumentumban fennmaradt régi `63.x` auditkurzorok nem írhatják felül a dokumentum elején és itt rögzített modern termékirányt.** A jelenlegi tervreview készültsége nem egyenlő a futó platform kiadáskészségével.

**Következő termék-review:** egyesével, de nagy összefüggő csoportokban végigellenőrizni a 64.1 célcsoportokat és a 65.5 presetcsaládokat; elfogadni/kiegészíteni a kifejezetten üzletileg választott képességeket; ezután 69.1 F0 lezárható implementációs szeleteivel indulhat a fejlesztés.



## 71. Végrehajtási irányító: funkciók, sabloncsaládok, kiadási kapuk és konkrét tesztmátrix

**Ez a fejezet normatív kiegészítés a 0–70. fejezetekhez.** Nem második roadmap, nem írja felül a 49. kanonikus navigációját, az 56–57. közös design szerződését vagy a 65. sablon-/preset-registry-t. Keresztkapcsoló és megvalósítási szerződés: az itt jelölt funkciókat ugyanazoknak a kanonikus domain-tulajdonosoknak kell teljesíteniük. A fejléc az egyetlen aktuális kurzor, az archív 63.x státuszok nem utasítások.

### 71.1. Felhasználói döntések és nem-negociálható termékeredmények

- **Általános Site Core mindenkinek:** account/workspace/site, webhely, CMS, média, sablonok, Brand Kit, űrlapok, SEO, domain, preview/publish. Twitch/YouTube/OBS-kapcsolat nélkül teljesen használható.
- **Szabad kombinálhatóság:** streamer + merch; freelancer + videó; nonprofit + esemény és adomány; zenész + shop; portfólió + booking; vállalkozás + hírlevél. Profilváltás nem töröl adatot.
- **Publikus oldal egyedi alakíthatósága:** márkaszínek, fontok, ikonok, strukturált tartalom, szekciók, komponensek, responsive layout, animációs intenzitás, többnyelvű tartalom és saját domain.
- **Alapfunkciók használata külső platform nélkül:** statikus/saját CMS tartalom, kapcsolatfelvétel, galéria, szolgáltatások, referenciák, navigáció és analitika választott, adatvédelmi szempontból megfelelő formában.
- **Minden választható modulnak van deaktivált/hibás/nem csatlakoztatott állapota.** A webhely működő alaprészei ilyenkor is elérhetők.

### 71.2. Site kit és sabloncsalád: felhasználói cél → kiinduló oldalak → ajánlott modulok

| Célprofil / site kit | Javasolt oldalak, CMS-sémák | Ajánlott modul; streaming kötelező? | Készségpróba |
|---|---|---|---|
| Universal Brand | Főoldal, Rólunk, Kapcsolat, Jogi oldalak, általános CTA | Site/CMS/Forms; nem | Nulla külső kapcsolat mellett publikálható |
| Streamer | Live, Adásrend, Játékok, Videók, Közösség, Támogatás | Live/Schedule/Integrations opcionális; nem a site-létesítéshez | Offline fallback és újraengedélyezés |
| Video Creator | Portfólió/videók, csatornák, márkapartnerek, tartalomjegyzék | Content/Social/Analytics opcionális | Nem publikálható provider nélkül hamis sikerként |
| Fotós / Designer | Galéria, Munkák, Esettanulmány, Díjszabás, Kapcsolat | CMS/Media/Leads; nem | képhasználat és projektkapcsolatok |
| Zenész / Zenekar | Zene, Kiadványok, Koncertek, Sajtó, Merch | Events/Media/Commerce; nem | esemény és zenei linkek fallback |
| Podcast / Író | Epizódok, Cikkek, Archívum, Feliratkozás | CMS/Feed/Newsletter; nem | keresés és RSS kompatibilitás |
| Freelancer / Szolgáltató | Szolgáltatások, Csomagok, Referenciák, Ajánlatkérés | Forms/Leads/Booking adapter; nem | lead jogosultság és spam |
| KKV / Üzlet | Termék/szolgáltatás, Rólunk, Nyitvatartás, Helyszín | Commerce/Local SEO; nem | eltérő shop és információs mód |
| Oktató / Kurzus | Bemutatkozás, Kurzusok, Anyagok, FAQ, Kapcsolat | CMS/Member Access; nem | privát tartalom szerveroldali védelem |
| Közösség / Csapat | Tagok, Hírek, Programok, Csatlakozás | Events/Community; nem | moderáció és csapatszerepek |
| Nonprofit / Esemény | Küldetés, Program, Támogatás, Jelentkezés | Events/Forms/Donations; nem | consent és támogatási státusz |
| Egyedi / Blank | Üres vászon + minimális hozzáférhető navigáció | Minden modul választás szerint; nem | üres projektből teljes site |

**Követelmény:** a starter kit telepítése nem ad automatikus provider-engedélyt, demo személyes adatot vagy működő kereskedelmi/payment státuszt. A telepítés ismétlése idempotens vagy világos célválasztást kér, nem duplikál végtelenül oldalakat.

### 71.3. Preset-családok egységes kompatibilitási szabálya

A 65.5 családlistája az elsődleges registry. Minden presetnek `targetKind`, `targetSchemaVersion`, `tokens`, `params`, `responsive`, `accessibility`, `dependsOn`, `license`, `preview`, `migration`, `rollback` szerződése van. Minden kategóriára követelmény: hozzáférhető alapérték, desktop/tablet/mobile minta, dark/light ahol releváns, hibás paraméter és missing asset fallback.

| Család | Minimum konfigurálható dimenziók | Pozitív és negatív teszt |
|---|---|---|
| Tipográfia | címskála, szöveg, line-height, fontfallback, hosszú magyar szöveg | fallback betűkészlet mellett sem törik |
| Szín/téma | semantic surface/text/accent/status, kontrast, módváltás | elégtelen kontraszt jelzés |
| Layout/grid | container, max-width, breakpoints, gap, columns, order | 320px szélesség, túlfolyás nélkül |
| Header/footer/menu | sticky, drawer, dropdown, breadcrumbs, aktív ág | csak billentyűzettel navigálható |
| Kártya/gallery/listing | dinamikus CMS, pagination, placeholder, sort/filter | null/üres/hibás feed |
| Forms/CTA | mező, required, validation, consent, siker/hiba | spam, duplikált beküldés, hiba |
| Portfolio/services | referencia, ármegjelenítés, CTA, projektkötés | nem létező hivatkozás kezelve |
| SEO/social | locale title/meta/schema, OG, canonical, robots | nem indexelt draft nem kerül sitemapbe |
| Motion/interaction | hover, transitions, reveal, focus, reduced-motion | reduced-motion megtartja funkcionalitást |
| Live/overlay/alert | safe area, timeout, queue, sound, fallback | provider hiány és browser source reconnect |
| Content/video | képarány, felirat safe-zone, thumbnail, exportpreset | hibás formátum és job failure |
| Commerce/member | termékkártya, tier, paywall preview, entitlement | unauthorized hozzáférés 403 |
| Mail/notification | brand email, locale, opt-in és unsubscribe | leiratkozás idempotens |
| AI workflow | output schema, approval, költség, limit, undo | modelhiba nem publikál automatikusan |

### 71.4. A következő fejlesztési szeletek — konkrét sorrend és elfogadás

| Pont | Implementálandó eredmény | Minimális automata ellenőrzés | Kézi/éles kapu |
|---|---|---|---|
| F0.1 | Kanonikus Admin/Auth/Site ownership baseline és kódleltár | typecheck; Auth 401/403; site-scope; régi route redirect | login, admin/editor URL böngészőben |
| F0.2 | Editor változáskövetés; save/reload; conflict-safe revision | dirty state, undo/redo, stale revision, lost network | desktop/mobile mentési próba |
| F0.3 | Preview/Publish/Public atomikus sorrend, visszaállítás | draft izoláció, publikus snapshot, concurrent conflict, cache | éles publikálás ellenőrzés; HIGH conflict lezárása |
| F1.1 | Site létrehozás, oldal/navigáció, layout és rendszeroldalak | tulajdonos, slug ütközés, 404/redirect | blank site-ból publikált oldal |
| F1.2 | Brand Kit, theme, token scope és usage-map | override/cascade, kontrast, rollback | globális módosítás hatása több oldalon |
| F1.3 | Közös média/ikon/font registry | MIME, upload retry, asset scope, referenciák | képfeltöltés és élő oldalon megjelenés |
| F1.4 | Kanonikus komponens/property rendszer | prop-schema, invalid state, responsive | egy komponens több oldalon |
| F1.5 | Template registry, telepítő, preview, verzió | manifest/deps, idempotencia, rollback | site-kit install böngészőben |
| F1.6 | Preset registry, starter kit onboarding | param validation, no-secret import, preview diff | különböző célprofilok indulása |
| F2 | CMS, Forms/Leads, SEO, domain, i18n | data binding, form security, hreflang, 404 | streamer nélkül működő vállalkozói site |
| F3 | opcionális Integrations/Twitch, Live/Schedule, OBS | provider status, token lifecycle, timezone, websocket | csatlakozás/leválasztás és offline fallback |
| F4 | Content/Social/VOD videófeldolgozás | publish queue, idempotencia, job-retry, media ACL | engedélyezett platform teszt |
| F5 | Community/Membership/Commerce/Sponsors | entitlement, webhooks, refund, tenant ACL | valós pénzügyi folyamat csak külön jóváhagyással |
| F6 | Analytics, automation, kampánymérés | freshness, trigger loop, retry, audit | metrikák forrása ellenőrzött |
| F7 | SANCI AI felügyelettel | tool permission, prompt injection, schema, quota | javaslat → diff → kézi jóváhagyás |
| F8 | Multi-workspace SaaS, marketplace | tenant isolation, billing entitlements, package security | külön felhasználók izolációs E2E |

### 71.5. Kötelező közös Definition of Done (minden slice-nál)

1. Feature ID és owner modul; érintett Admin/Public/Editor felület megadva.
2. Adatmodell és API action contract; owner/site/workspace scope; szerveroldali szerepkör és inputvalidáció.
3. Értelmezhető loading/empty/error/stale/success/denied UI és mobilbillentyűzet, képernyőolvasó, reduced-motion ellenőrzés.
4. Pozitív/negatív/security/regressziós teszt; typecheck; tényleges futásból származó eredmény; CI és éles ellenőrzés külön.
5. Migráció előtti/utáni kompatibilitás, adatvesztés- és rollback-terv; nincs második domain repository.
6. Provider: scope/quota/policy, hibafallback, tokentitok nem kliensoldali; privacy és adatmegőrzés.
7. Valós kapacitás/költség/üzemeltetési nyomkövethetőség; napló redaction; működési riasztások.
8. Csak a kész funkció kap PASS státuszt. A még nem futtatott teszt `NOT RUN`, a nem ellenőrzött implementáció `UNKNOWN`.

### 71.6. Külön termékdöntést igénylő változó területek (nem blokkolják F0–F1 alapokat)

Fizetési szolgáltató, országonkénti számlázás/adó, foglalási provider, email küldő, videó-átkódoló infrastruktúra, alkalmazásbolt-terjesztés, Kick/TikTok API képesítések, AI-szolgáltató és tárolási költséglimitek mind konkrét, aktuális szolgáltatói/licenc/jogi ellenőrzést igényelnek az érintett fázis előtt. Ezekre a MASTER külön kaput ír elő, nem állít bizonyítatlanul kész implementációt.

### 71.7. Egyetlen aktív kurzor — 2026-10-15

- **Termékspecifikáció:** `S9517-CREATOR-PLATFORM-MASTER`, verzió `3.2.0`; 0–71. fejezet együtt érvényes, régi 63.x auditkurzorok nem irányítják a fejlesztést. További funkciók a megfelelő tulajdonoshoz kerülnek, nem új MASTER-be.
- **Aktív végrehajtási pont:** `F0.1-VERIFIED-BASELINE`. Nem állítjuk, hogy ez már tesztelve lett. Az első lépés a tényleges aktuális repo route, Auth, permission, DB migration és teszt állapotának ellenőrzése.
- **Következő:** ha F0.1 bizonyítottan PASS, F0.2; utána F0.3, külön HIGH publish conflict regressziós bizonyítékkal.
- **GitHub-szinkronizáció:** a teljes fájlt a `v2/foundation` ág `docs/SANCI9517-CREATOR-PLATFORM-PLAN.md` útvonalára kell visszaírni, a branch legfrissebb változatával való összevetést követően. Ugyanennek a dokumentumnak a kanonikus státuszát használjuk a későbbi beszélgetésekben.

---

## 72. KANONIKUS TERMÉKHATÁR ÉS KIADÁSI SORREND — TELJES CREATOR & BRAND PLATFORM (2026-10-15)

### 72.0. Termékhatár és alapvető döntés

**Ez a teljes termék, nem csupán egy MVP-funkciólista.** A SANCI9517 professzionális, magyarul induló, globálisan használható Creator & Brand Operating Platform. Elsődlegesen **streamereknek és digitális tartalomkészítőknek** épül, beleértve azokat, akik egyszerre streamelnek, videókat, rövid tartalmakat, posztokat, közösséget és saját brandet építenek. A felhasználó saját, szabadon alakítható, nyilvános és saját domaint használó weboldalt hozhat létre, a teljes alkotói működéséhez tartozó modulokat pedig egy jól strukturált Adminból használja. A Twitch és az OBS **nem kötelező**, a YouTube/TikTok/Discord vagy bármely szolgáltató csak a konkrét felhasználói célhoz szükséges esetben kapcsolódik.

**Kötelező teljes célképességek:** egyedi weboldal; Visual Editor; Brand Kit, sablonok, presetek, ikonok és komponensek; média/CMS; publikálás és SEO; Twitch, YouTube, TikTok, Discord, Kick és bővíthető integrációk; élő stream/OBS/overlay/alert/chat/interakció; adásrend/játékprofilok; VOD/clip/Shorts/video/content/social publishing; közösség/fan identity/moderáció; támogatás, tagság, shop, merch és digitális termékek; analitika, szponzoráció, kampányok; automatizáció; SANCI AI; csapatok, jogosultságok, több site, több tenant, csomagok, számlázás, kvóták, marketplace és bővítmények. A provider-képességek feltételesek a hivatalos API-, scope- és policy-korlátok szerint, de a tervből nem törölhetők.

**Elsődleges célcsoport:** streamer, gamer, videókészítő, YouTuber, TikToker, podcaster, közösségi tartalomkészítő, online alkotó és ezek kombinációi. **Másodlagos, későbbi célcsoportok:** fotós, helyi vállalkozás, klasszikus ügynökség, foglalásközpontú szolgáltató és általános iparági portál. Az alaprendszer nem akadályozza őket; külön iparági mélységük azonban nem előzi meg a creator terméket. Nem készül külön streamer-engine és külön brand-engine.

**Üzleti cél:** a platform a tulajdonos számára is napi használatú termék, később mások önkiszolgálóan regisztrálhatnak és építhetnek brandet. A SaaS-bevétel hosszú távon legalább a hosting, médiafeldolgozás, sávszélesség, AI, support, billing és üzemeltetés valós költségeit fenntarthatóan fedezze; a nyereség nem garantált. Az árazás, csomagok, ingyenes próba, kvóták, egységköltség, fedezet, számlázás és lemondás külön, tesztelt domain. Az alapot már korán tenantbiztosra tervezni kell, de a nyilvános SaaS-launchhoz önálló kiadási kapu kell.

### 72.1. Felhasználói utak — teljes termék

1. **Én, mint streamer és creator:** saját brand kiválasztása → site kit/preset → oldalak, design és tartalom → Twitch/YouTube/TikTok/Discord csatlakoztatása → adásrend/live/OBS/widgetek → VOD/klipek/social → közösség/merch/támogatás → analitika/automatizáció/AI → verziózott publikálás.
2. **Másik alkotó:** önkiszolgáló regisztráció → workspace/site → neki megfelelő creator starter → csak a szükséges modulok bekapcsolása → domén → saját tartalom és integrációk → publikálás → igény szerinti csomagváltás.
3. **Rajongó/látogató:** creator saját domainje → gyors, mobilbarát webhely → tartalom/élő adás/követés → szavazás/tagi tartalom/támogatás/shop → adatvédelemmel és biztonságos fizetéssel.
4. **Creator csapata:** meghívó → szerepkörök → tartalom/jóváhagyás → közös médiatár → jóváhagyott publikálás; tenantok között nincs hozzáférés.
5. **Üzemeltető:** tenant-, kvóta-, költség-, incidens-, support- és abuse-kezelés; titkok és személyes adatok nem látszanak indokolatlanul.

### 72.2. Termékfunkciók és kanonikus tulajdonosok

A korábbi 3., 24., 49., 54–59. és 64–71. fejezetek részletes funkcióleírásai és 396 stabil azonosítója **változatlanul teljes hatállyal megmaradnak**. Ez a fejezet a prioritást és az átadási függőségeket pontosítja, nem duplikált funkcióregiszter. Az üzleti objektumot a saját domainje kezeli, az Editor csak megjelenítési konfigurációt és ID-hivatkozásokat tárol.

- **Weboldal:** Site, Page, Navigation, CMS, Preview/Publish, domain, SEO, többnyelvűség; publikálásnál draft/published izoláció és konfliktuskezelés.
- **Márka és Design:** Brand Kit/tokens, témák, presetek, ikonok, tipográfia, komponens/sablon-registry és verziózott instanciák.
- **Média és tartalom:** egyetlen asset registry (D1 meta/R2 bináris), tartalomrekord, médiafeldolgozás, VOD/clip/short, posztváltozat, ütemezett publishing queue.
- **Integrációk:** provider OAuth/scopes, állapot, token refresh/revoke, EventSub/webhook, rate limits, kapcsolati napló, capability matrix; Twitch/YouTube/TikTok/Discord/Kick külön adapterek.
- **Live/Stream Studio:** stream állapot, játék/schedule, OBS-kapcsolat, overlay-editor, alert-engine, chat/interakció és live dashboard. A Page Editor, Overlay Editor és videós idővonal külön felhasználói eszköz, de megosztott Brand Kitet és média-erőforrásokat használ.
- **Közösség, tagság és kereskedelem:** fan profile, consent, moderáció, role entitlement, támogatás, shop/merch/digitális termék, payment/fulfillment provider, refund/chargeback; semmilyen payment secret kliensoldalon.
- **Növekedés és intelligencia:** web/live/content/store analitika, szponzoráció, kampány, trigger/condition/action automatizáció, SANCI AI előnézet/jóváhagyás/költséglimit.
- **SaaS:** workspace/site/tenant isolation, onboarding, csapat, role, domain, előfizetés, metered usage, quotas, billing, support, platform admin, marketplace és plugin SDK.

### 72.3. Sablon- és presetmotor — nem dekoráció, hanem termékpillér

**Sablonszintek:** site kit → page template → layout/section → component/symbol → widget és tartalomtípus → theme/design token. **Startercsaládok:** streamer home, gamer brand, live schedule, creator portfolio, video/channel hub, YouTube creator, TikTok/Shorts creator, podcast, link-in-bio, community hub, merch launch, membership, media kit/sponsorship, event/campaign és minimalist personal brand. Nem minden starter indul egyszerre, de mind tervben marad.

**Presetcsaládok:** teljes téma, színpaletta, tipográfia, spacing, container/grid/flex, header/footer/menu, gomb/kártya, galéria/média, video/stream embed, live/offline/countdown, schedule, alert/overlay, motion és reduced-motion, mobil/responsive, accessibility, SEO/social preview. Az Editoron kívüli widget is ugyanazt a tokenrendszert használja.

**Erőforrás-szerződés:** `id, kind, owner/workspace/site, status, schemaVersion, revision, name, category, tags, thumbnail, author, license, supportedModules, requiredCapabilities, dependencies, assetRefs, tokenRefs, localization, compatibleVersion, createdAt, updatedAt`. Telepítésnél manifest-validáció, szükséges modulok és scope-ok előnézete, draft transaction, idempotencia, hiba-visszaállítás; upgrade-nél diff/impact, globális vs lokális override, detach, rollback. Nem adható automatikus titok-, admin- vagy futtatható-script hozzáférés külső template-nek. Szerzői jogi és licencfeltételek külön ellenőrzendők.

### 72.4. Logikus Admin UX és modulok bekapcsolása

A 49. fejezet a kanonikus navigáció. Kezdőképernyő: áttekintés és valódi teendők, nem 22 állandó menüpont. Fő feladatterületek: **Weboldal; Márka és design; Médiatár; Integrációk; Élő adás/OBS; Adásrend; Tartalom és videó; Közösség; Bolt és tagság; Növekedés/Analitika; Automatizálás és AI; Beállítások**. Kontextusos gyorselérés megengedett, azonos domain/API alatt. Kereső, parancspaletta, role szerint szűrt menü, desktop/mobil, állapotjelzés, visszavonás, akadálymentesség, feladatonkénti súgó kötelező.

Modulaktiválás: `available → enabled → configured → active/degraded → paused/disabled`. A modul letiltása nem töröl automatikusan adatot, fizetési kötelezettséget, videó-, oldal- vagy tagság-rekordot. Dependenciák, kapcsolódó komponensek és automatizációk előnézete szükséges. A felhasználó streammodul nélkül is készíthet creator brand-oldalt.

### 72.5. Végrehajtás — minden képesség a célban, csak az építési sorrend fázisolt

| Kapu | Fejlesztési csomag | Elkészült állapot csak akkor, ha… |
|---|---|---|
| F0.1 | Valós kód- és tesztbaseline, auth/ownership/migrations, single canonical routes | célzott tesztek futtak, állapotok és kockázatok rögzítve |
| F0.2 | Editor Page Model, undo/redo, autosave/manual save, draft/reload és revízióütközés | hálózati és konkurens módosítás nem okoz csendes adatvesztést |
| F0.3 | Preview/publish/snapshot/cache/rollback + HIGH publish conflict | nyilvános draft kizárt; több szerkesztős conflict és rollback igazolt |
| F1 | Site Manager, Brand Kit, média, responsive Editor, template/preset, CMS, SEO, creator starter | nulláról létrehozható és publikálható egyedi, többoldalas brand-site |
| F2 | Twitch, YouTube, TikTok, Discord, Kick adapter-szerződés; elsőként ténylegesen támogatott képességek; adásrend/game/live | provider-scope, OAuth, no-cross-site, offline/failure tesztek |
| F3 | OBS/overlay/alert/chat/widget, közös stream- és vizuális események | OBS reconnect, alert preview, live fallback és biztonság igazolt |
| F4 | Content Studio, VOD/clip/Shorts, videó pipeline, social publishing | jogosult provider feltöltés, retry/idempotencia, tartalomverziózás igazolt |
| F5 | Közösség, fan account, entitlement, támogatás, tagság, shop, merch/digitális commerce | permission, payment/refund, moderation, fulfillment és privacy igazolt |
| F6 | Analitika, growth, campaigns, sponsor/brand deals, affiliate | forrás/frissesség, consent, pontos metrikák és export igazolt |
| F7 | Automatizáció, event/action engine, SANCI AI multimodális pipeline | approval, sandbox, cost quota, abuse, loop prevention, rollback igazolt |
| F8 | Self-service SaaS: signup, workspace/site, multi-tenant, plans, billing, usage/AI credits, support, tenant security | izoláció E2E, billing, lemondás, díjazás/fedezet és support kapuk igazoltak |
| F9 | Marketplace, partner/plugin ökoszisztéma, globális skálázás | manifest security, monetizáció/elszámolás, licenc és platform compliance igazolt |

Egy nagy kapu alatti megvalósítás továbbra is apró, tesztelhető feladatokra bontható a meglévő ID-rendszerrel. **Nem jelent halasztást vagy törlést**, ha F5–F9 funkció még nincs bevezetve; ezek a teljes céltermék követelményei. A SaaS-hoz fontos tenant-safe ownership, usage metering és audit alapelveket már a korai fázisokban be kell tartani. Indokolatlanul nem építünk előre teljes számlázást, közösségi hálót vagy AI videógyártást.

### 72.6. SaaS pénzügyi és AI fenntarthatósági szerződés

- **Termékkínálat:** különálló creator workspace, saját weboldal, opcionális kapcsolatok/modulok, csomaghoz kötött erőforráskeretek. Free/trial/paid tier, add-on és vállalati kivétel későbbi árazási döntés.
- **Mérés:** workspace/site, request, storage, bandwidth, videófeldolgozás percei, render-job, AI token/perc/GPU, API/provider költség, email/számlázási költség, support műveletek.
- **Korlátok:** hard/soft quota, előrejelzés, túlhasználat figyelmeztetés, per-site és per-team költség, abuse protection; a creator lássa a fogyasztását.
- **Pénzügyi modell:** árbevétel - fizetési díj - infrastruktúra - AI - támogatás - marketing - adó/egyéb működési költségek; fedezeti cél és megtérülés validálása valódi árazással. Nem ígérünk hasznot előre.
- **Billing lifecycle:** trial → active → past_due/grace → canceled/suspended; proration, refund, számla/adózási integráció, webhook idempotencia, ügyfélszolgálat, export és törlés.
- **AI:** provider-agnosztikus adapter, modellrouting, engedélyezett tartalom, jóváhagyás, prompt injection védelem, audit, költségbecslés és leállíthatóság; automatikus éles publikálás alapértelmezetten tiltott.

### 72.7. Teljes termék elfogadási mátrixa és üzemeltetési alapelvek

1. Streamer site: brand/preset → Twitch/live/schedule → OBS overlay → VOD/Shorts → támogatás/merch → publikálás, mobilon és desktopon.
2. YouTube/TikTok creator: csatornaintegráció → tartalomnaptár → videóvariáns → platformfüggő publikálás/hiba → analitika, stream nélkül is.
3. Közösség: Discord + saját profil/tagi jogosultság → private tartalom → moderáció/előfizetés megszűnése → hozzáférés visszavonás.
4. Brand: sablonválasztás → saját stílus és komponensek → több oldal → SEO → saját domain → publikálás; globális módosítás és lokális override tesztelve.
5. SaaS: két különböző fizető/ingyenes tenant → sem média, draft, OAuth, secret, fan vagy order nem szivároghat át; csomaglimitek érvényesülnek.
6. AI: jóváhagyás nélküli publikálási/pénzügyi parancs elutasítva; használati költség mérve; visszavonható draft.
7. Negatív próbák: provider rate limit, token revocation, elveszett hálózat, duplicate webhook, sikertelen fizetés, videó job timeout, korrupt sablon, rollback.
8. Keresztmetszeti kapuk: WCAG-releváns hozzáférhetőség, localizáció, SEO, privacy, secure-by-default, load/performance, D1/R2 consistency, backup/restore, observability és CI.

### 72.8. Egyetlen aktuális állapot és lezárási szabály

- A **teljes termékterv** nem egy kiadásra szűkül; F0–F9 összes képessége a célban marad, amíg kifejezett termékdöntés azt nem módosítja.
- Az egyetlen aktív fejlesztési kurzor: **`F0.1-VERIFIED-BASELINE`**. `NOT RUN`, amíg a repository és a releváns tesztek ténylegesen ellenőrizve nincsenek. Utána a fenti dependency sorrendben haladunk.
- A régi `63.x` checkpointok és korábbi termék-review státuszok történeti fejezetben maradnak, nem alternatív aktív tervpontok. Történeti tervauditot nem nyitunk automatikusan újra.
- A HIGH publish conflict az F0.3 ténylegesen javítandó, nyitott kockázata, nem adminisztratív auditfeladat.
- E dokumentum az egyetlen kanonikus termék- és fejlesztési terv. Módosításnál a tényleges új döntés és implementáció bizonyítéka kerül bele, nem második roadmap.


---

## 73. VÉGLEGES TERMÉKDÖNTÉSEK ÉS IMPLEMENTÁCIÓS SZERZŐDÉSEK — CREATOR-FIRST, BRAND-NATIVE, SAAS-READY

**Érvényesség:** ez a fejezet a 0–72. fejezetek *értelmezési és végrehajtási szabálya*, nem külön katalógus. A 24., 49., 54., 56–57., 64–72. fejezetek képességei megmaradnak. Eltérésnél a tényleges termékirány, a biztonsági szabályok, a kanonikus domain-owner és a jelen fejezet konkrétabb elfogadása irányadó. A 63. fejezet történeti kurzorai nem indítanak újra régi auditot. Az aktív implementációs kurzor kizárólag a dokumentum elején rögzített F0.1; lezárása után a következő, nem megvalósított legkisebb függő szelet lesz aktív.

### 73.1. Pontosan kinek és milyen értékajánlattal építünk?

1. **Elsődleges fizető ügyfél:** önálló streamer vagy digitális tartalomkészítő, aki Twitch/YouTube/TikTok/Discord/Kick és más platformok között dolgozik, és egy egyedi brand-webhelyről szeretné irányítani a tevékenységét.
2. **Másodlagos ügyfél:** alkotói csapat, menedzser, kisebb creator-stúdió, közösséget és merchöt működtető brand, több csatornával. Más alkotók is tudják használni streaming nélkül.
3. **Első valós referencia:** a SANCI9517 saját site-ja; egyetlen streamerhez nem kötődő domain- és jogosultsági modellel készül, külön teszt-tenanttal.
4. **Látogatói érték:** saját domain, márkás és gyors megjelenés; követés, tartalom, esemény, közösség, támogatás, vásárlás és tagsági előnyök egy koherens élményben.
5. **Vásárlói ígéret:** nem kell saját kód, több külön weboldal vagy tucatnyi szinkronizálatlan dashboard a márka üzemeltetéséhez; a külső platformokat ahol lehet, hivatalos és engedélyezett integrációval kezeljük. Ami provider-korlát miatt nem vezérelhető, annak státuszát és külső átvezetését tisztán mutatjuk.
6. **Nem vállalt kezdeti piac:** generikus ügynökségi weboldalépítő, éttermi/POS, foglalás-ERP, stock-fotó piactér, általános CRM/ERP. Az alap weboldalmotor rugalmas, de ezek külön iparági mélységét nem építjük a creator főfolyamatok elé.
7. **Nem funkciómentes MVP:** az összes felsorolt képesség a teljes termék-roadmap része; a fejlesztés vertikális szeletekre bontott, a hiányzó későbbi modult nem nevezhetjük késznek.

### 73.2. A publikus brand-webhely kötelező oldaltípusai és blokkjai

- Oldalak: kezdőlap, rólam/brand, stream/live, adásrend, játékok, videók, klipek, csatornák, közösség, támogatás, tagság, shop, termék részletező, médiakit, partner/szponzor, kapcsolat, blog/hírek, esemény, kampánylanding, keresési eredmények, 404, jogi/adatvédelmi és egyéni oldal.
- Gyakori blokkok: hero, headline, rich text, CTA, banner, nav, breadcrumb, avatar, közösségi link, channel cards, live státusz, játékprofil, schedule, countdown, videógaléria, VOD-playlist, Shorts grid, tagság/benefit, donations goal, merchandise, termékkártya, hírlevél, kapcsolatűrlap, szponzorlogó, social feed, FAQ, cookie/consent, kereső, CTA sticky/mobile.
- A blokkok bemenete vagy szerkesztett megjelenítési adat, vagy kanonikus business-objektum referenciája. A `page_document` kizárólag prezentációt, elrendezést, stílust, kötésazonosítót és konfigurációt tárolhat; fizetést, OAuth-tokent, üzleti rendelésadatot nem.
- Kötelező site-wide funkciók: több szintű navigáció, mobilmenü, globális fejléc/lábléc, SEO canonical, robots/sitemap/OG, localizált útvonal, consent, akadálymentesség, 404/redirect, gyorsítótár és publikált tartalom következetessége.
- Szabad elrendezés nem írhatja felül a biztonsági modellt. Új embed/HTML/script csak kifejezett biztonsági megkötésekkel és jogosultsággal; harmadik fél scriptje önmagában nem kaphat első félnek szóló sessiont.
- **Acceptance:** egy streaminget nem használó videós teljes, többoldalas brand-webhelyet publikálhat; egy streamer ugyanarra az alaprendszerre live és merch modulokat aktivál; a két site egymás adatait nem éri el.

### 73.3. Sablon, preset, kit, komponens — fogalmak és viselkedés

| Fogalom | Tartalom | Példányosítás/frissítés | Tulajdonos |
|---|---|---|---|
| Starter/site kit | oldalak, navigáció, Brand Kit és opcionális modulkonfiguráció előre megadott összeállítása | telepítéskor saját site-példány; explicit upgrade | 49.3 design/template domain |
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

