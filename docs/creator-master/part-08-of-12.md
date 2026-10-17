### 63.50.81. Nyolc szemantikai GAP cél-ID definícióval ellenőrizve — release-gate nyitott (2026-10-15)

**Módszer:** a 63.50.79–80 forráshű történeti mezők, a 63.50.77–78 célzott GAP döntések és a jelen terv **49. fejezetének tényleges stable capability sorai** közötti tételes egyeztetés. Az alábbi cél-ID-khez létező képességdefiníciót ellenőriztem, nem pusztán ID-formátumot. Az archív `phase/scope` elsőbbséget élvez a csoportos modern fázissablonnal szemben; **nincs automatikus Stage→F fázis-egyenlőség**.

| H-ID | Ellenőrzött modern cél-ID | A jelenlegi stable capability definíciók tényleges tartalma | Pozitív elfogadási irány | Negatív / security acceptance | Bizonyíték |
| --- | --- | --- | --- | --- | --- |
| H19.16 | RES-002, RES-014, SEC-008 | RES-002: R2 binary storage and D1 metadata.; RES-014: File download authorization/expiry.; SEC-008: Secret storage/redaction/rotation. | R2 site-bound object key and signed access; prevent cross-site object access and token leaks | private asset cross-site fetch denied; expired signature denied | OPEN / no CI or runtime evidence |
| H21.13 | INT-013, ANL-004, ANL-001 | INT-013: YouTube channel/video/live adapter.; ANL-004: Content/platform analytics.; ANL-001: Analytics event taxonomy/naming/schema governance for measurement and reporting; excludes workflow trigger execution. | YouTube authorized metrics ingestion and canonical metric unit/source; taxonomy alone insufficient | quota/consent/revoked scope does not fabricate metric | OPEN / no CI or runtime evidence |
| H21.22 | INT-019, INT-001, SEC-008 | INT-019: Integration secret redaction and audit.; INT-001: Shared external-provider adapter contract; domain modules such as Store implement their specific workflows through this contract.; SEC-008: Secret storage/redaction/rotation. | Cloudflare Secrets lifecycle, normalized server adapter and audit redaction | no secret appears in client bundle, errors, logs or diagnostics | OPEN / no CI or runtime evidence |
| H22.16 | CNT-010, CNT-011, AI-013 | CNT-010: Ideas/drafts/scripts/briefs.; CNT-011: Platform-specific title/description/tag variants.; AI-013: Content title/script/description/thumbnail brief. | Editable draft title/description/hashtag proposals with per-platform limits and human approval | AI output cannot directly publish or bypass permissions | OPEN / no CI or runtime evidence |
| H22.19 | ANL-004, CNT-016, ANL-001 | ANL-004: Content/platform analytics.; CNT-016: Campaign linkage and content attribution.; ANL-001: Analytics event taxonomy/naming/schema governance for measurement and reporting; excludes workflow trigger execution. | Content ID based analytics and measured feedback loop with freshness and attribution | stale/unattributed data cannot be represented as verified uplift | OPEN / no CI or runtime evidence |
| H28.14 | RES-003, SEC-006 | RES-003: Upload validation/progress/cancel/retry.; SEC-006: SSRF/open redirect/injection defenses. | Server-side upload MIME/magic-byte/size policy plus injection/SSRF defense | spoofed MIME, malicious filename and remote/private URL blocked | OPEN / no CI or runtime evidence |
| H32.18 | ANL-004, AI-004, AI-013 | ANL-004: Content/platform analytics.; AI-004: Context selection and privacy filter.; AI-013: Content title/script/description/thumbnail brief. | Measured platform analytics, privacy-filtered AI context and editable suggestion | missing metrics, revoked consent or prompt injection cannot create asserted facts | OPEN / no CI or runtime evidence |
| H34.21 | DEV-001, QA-002, QA-008 | DEV-001: Public API reference, versioning, schema and deprecation policy.; QA-002: Domain/API/integration tests.; QA-008: End-to-end creator journey. | Implementation and API version/schema lifecycle backed by domain/integration and E2E tests | docs-only change cannot satisfy implemented feature gate | OPEN / no CI or runtime evidence |

**Határ- és ownership-döntések:**
- H19.16: Resource object ownership + Security secret/access policy; `SEC-009` webhook signature nem helyettesíti a site-bound R2 object-key védelmet.
- H21.13 és H22.19: `ANL-001` egység/forrás taxonomy önmagában nem metrikagyűjtés vagy visszacsatolás; `ANL-004` és domain Content kapcsolódás szükséges.
- H21.22: integrációs adapter/secret lifecycle architektúra, nem Editor-beállítás vagy puszta webhook-teszt.
- H22.16 és H32.18: AI javaslat marad, a kanonikus Content adatot és a publikálási jogosultságot nem írhatja felül.
- H28.14: `SEC-006` általános outbound/injection védelem; a konkrét feltöltésvalidáció `RES-003` ownernél kötelező.
- H34.21: `DEV-001` API lifecycle + `QA-002/QA-008` evidence; az archív H34 governance folyamatlépés, nem önállóan elkészült feature.

**Release-kapu függőség:** `63.50.46 PUBLICATION CONTRACT CONFLICT / HIGH / NOT FIXED` változatlan; a draft módosítás nem módosíthatja a publikált snapshotot, slugot vagy SEO metadata-t explicit publish nélkül. A 8 sor **8/8 cél-definíció összevetve / 0/8 runtime PASS igazolva**. A 271 történeti követelmény egészére teljes cél-ID/fázis/acceptance mélyaudit még nem állítható. `00/A` és `00.9–00.9.6.B` **SOURCE NOT RECOVERED / OPEN**.

**Következő kurzor:** `63.50.82` — 1.0 publikus SEO/Publish és Security/Resource release-gate sorok pozitív-negatív szerződésének mélyellenőrzése, majd a fennmaradó stable-ID célok csoportonkénti forrásalapú összevetése. **GLOBAL NOT PASS; implementation freeze stays.**


### 63.50.82. 1.0 Publish/SEO/Resource/Security release-gate szerződés — 12 célzott ellenőrzési csomag (2026-10-15)

**Bemenet:** 63.50.46 forráskód-audit, 63.50.79–81 archív mezőproveniencia és szemantikai GAP, valamint a 49. fejezet stable capability definíciói. **12 ellenőrzési csomag dokumentálva**, nem 12 futtatott teszt. Az eredeti 00/A és 00.9.6.B hiányzó forrásait nem helyettesíti. A publikus útvonal/SEO/Resource/security 1.0 gate a feature-lista bármely fázisától függetlenül kötelező.

| Gate | Stable capability | Canonical owner/surface | Kötelező adat- és állapotszerződés | Pozitív tesztirány | Negatív tesztirány | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| PUBLISH-DRAFT | WEB-004, EDT-027, EDT-033 | Draft Save / Admin Pages PATCH | published_content_json, published_revision_id, public title/slug/description remain unchanged | PATCH title/slug/content on already published page; public response still last published version | no implicit published snapshot update, no draft slug leakage; reject unauthorized revision/site | SPECIFIED / SOURCE RUNTIME NOT RECHECKED |
| PUBLISH-ATOMIC | WEB-002, WEB-006, WEB-007 | Explicit publish command | validated draft revision, published snapshot, published slug and metadata commit as one logical transaction | valid publish v2 atomically switches public route+SEO+snapshot | failed validation/permission/DB transaction leaves v1 entirely public | SPECIFIED / SOURCE RUNTIME NOT RECHECKED |
| PUBLISH-ROLLBACK | WEB-007, EDT-027 | Rollback command | revision history retained; rollback modifies draft until explicit republish | rollback v2→v1 draft while public stays v2 | rollback must not rewrite published snapshot or revision ID | SPECIFIED / SOURCE RUNTIME NOT RECHECKED |
| ROUTE-REDIRECT | WEB-002, WEB-013, SEC-006 | Public router and URL change | published slug source, redirect registry, normalized path, no open redirect | old published slug redirects to new published URL after publish | draft-only slug never redirects or appears in sitemap; malicious redirect target rejected | SPECIFIED / SOURCE RUNTIME NOT RECHECKED |
| HTTP-404 | WEB-013, WEB-004 | Public route resolver | unpublished/nonexistent routes have genuine HTTP 404; no hidden draft render | unknown or unpublished slug returns 404 status | must not return 200 shell for missing content; no cross-site slug collision | SPECIFIED / SOURCE RUNTIME NOT RECHECKED |
| SEO-METADATA | SEO-001, WEB-004 | Public HTML metadata | published title/description/canonical/robots; preview is noindex and access controlled | public v1 metadata stays v1 through draft edits; publish v2 updates together | preview/draft/private metadata not indexed, canonical not built from untrusted host | SPECIFIED / SOURCE RUNTIME NOT RECHECKED |
| SEO-SITEMAP | SEO-004, WEB-013 | Sitemap/robots generation | published-only URL set, redirect exclusion, cache invalidation after explicit publish | publish/unpublish/slug-change reflected in sitemap with cache invalidation | draft-only URL, private page and stale redirected slug absent | SPECIFIED / SOURCE RUNTIME NOT RECHECKED |
| MEDIA-UPLOAD | RES-001, RES-002, RES-003, SEC-002, SEC-003 | Resource Manager + upload API + Editor picker | D1 asset ID/meta + R2 bytes, site ownership, MIME/magic-byte/size checks | authorized upload creates referencable asset after complete R2/D1 success | spoofed MIME, oversized file, cross-site ID and partial R2 failure cannot create ready asset | SPECIFIED / SOURCE RUNTIME NOT RECHECKED |
| MEDIA-ACCESS | RES-002, RES-014, SEC-002, SEC-003, SEC-008 | Asset serving / signed download | private/public distinction, scoped key, expiring signed access, no secret exposure | authorized signed download only for owned asset within TTL | expired token, cross-site object key, revoked access and path traversal denied | SPECIFIED / SOURCE RUNTIME NOT RECHECKED |
| SEC-ROLES | SEC-002, SEC-003 | Every Admin/Editor/Resource route | server-side role+site check for read and write; no UI-only guard | editor with correct site scope can edit draft within assigned permission | viewer publish denied; editor cross-site mutation denied; unauthenticated read of private draft denied | SPECIFIED / SOURCE RUNTIME NOT RECHECKED |
| SEC-OUTBOUND | SEC-006, SEC-008 | External fetch/provider adapter | allowlisted URLs, DNS/IP/redirect checks, Cloudflare Secrets and log redaction | approved provider adapter uses secret server-side only | private IP/metadata endpoint and redirected SSRF blocked; secret never in error/HTML/log | SPECIFIED / SOURCE RUNTIME NOT RECHECKED |
| SEC-WEBHOOK | SEC-009, SEC-008 | Webhook ingestion | signature validation, timestamp/replay protection, idempotent processing | valid signed event accepted once and audit logged | unsigned, expired, replayed and cross-site forged events rejected | SPECIFIED / SOURCE RUNTIME NOT RECHECKED |

**Atomi publikálási adatmodell döntési követelménye:** a `pages` jelenlegi közös `title/slug/description` mezői és a `published_content_json` eltérő élettartama a 63.50.46 szerint bizonyított konfliktus. Implementáció előtt meg kell határozni a draft metaadat + publikált metaadat/slug külön forrását, a revision ID és snapshot tranzakciós együttmozgását, a redirect tárolását, az unpublish és a régi URL kezelését, a cache/SEO invalidációt, valamint a visszagörgethető D1 migrációt. **A jelenlegi PATCH publikálási mellékhatását nem szabad pusztán SQL-sor törlésével „megoldottnak” minősíteni.**

**Kötelező végrehajtási bizonyítéksorrend:** (1) terv- és történeti gate lezárása; (2) read-only D1/route inventory és rollback/migrációs terv; (3) célzott forráskódjavítás; (4) pozitív és negatív domain/API tesztek, CI; (5) böngésző és public HTTP/SEO ellenőrzés; (6) felhasználói acceptance. A csomagoknál **runtime/CI/production/user evidence UNRUN** ebben az auditkörben; a 63.50.46 `PUBLICATION CONTRACT CONFLICT / HIGH / NOT FIXED` marad.

**H19–H34 visszacsatolás:** H19.01/.14/.15/.16 a MEDIA gate-ekhez; H20.01/.18 a draft/published binding+schema-hoz; H23.01–.03 az Editor event és public renderer határához; H25 SEO sorok a PUBLISH/SEO gate-ekhez; H28 security sorok a SEC gate-ekhez kapcsolódnak. Ezek cross-reference-ek, **nem automatikus semantic PASS**.

**Következő kurzor:** `63.50.83` — a fennmaradó H19–H34 stable cél-ID-k forrásdefiníció és archív fázis összevetése, valamint a `00/A` és `00.9–00.9.6.B` eredeti forrás további keresése. **GLOBAL NOT PASS / FEATURE IMPLEMENTATION FROZEN.**


### 63.50.83. H19–H34 271/271 történeti sor stable cél-ID definícióellenőrzése (2026-10-15)

**Forrás:** a 63.52–63.53 tételes canonical crosswalk (az ott rögzített 63.52.1/63.53.1 javításokkal), a 49. fejezet tényleges `ID | képesség | ...` definíciói, a 63.50.79–80 eredeti archív owner/surface/phase/dependency/acceptance kivonatai. A 271 egyedi történeti H-ID-hez **436 cél-ID hivatkozást** oldottam fel a dokumentum létező stable capability definíciójára; **hiányzó stable cél-ID: 0**. Ez definíciólétezési és szó szerinti capability-összeolvasási bizonyíték, **nem** a 436 kapcsolat teljes szemantikai PASS-a vagy az implementáció igazolása.

#### H19 — 20 sor, stable cél-definíciók ellenőrzése

| H-ID | Történeti képesség | Stable cél-ID(k) | A 49. fejezet tényleges capability definíciói |
| --- | --- | --- | --- |
| H19.01 | upload | RES-003, RES-001, RES-002 | RES-003: Upload validation/progress/cancel/retry.; RES-001: Canonical asset registry and IDs.; RES-002: R2 binary storage and D1 metadata. |
| H19.02 | folders | RES-006 | RES-006: Asset-library collections/tags/folders; excludes content and product taxonomies. |
| H19.03 | search | RES-005 | RES-005: Search/filter/sort/pagination over the canonical asset registry only. |
| H19.04 | filter | RES-005 | RES-005: Search/filter/sort/pagination over the canonical asset registry only. |
| H19.05 | preview | RES-004 | RES-004: Image preview/thumbnail/variant, crop/resize and optimization pipeline. |
| H19.06 | metadata | RES-007 | RES-007: Alt text/caption/license/source metadata. |
| H19.07 | alt text | RES-007 | RES-007: Alt text/caption/license/source metadata. |
| H19.08 | crop | RES-004 | RES-004: Image preview/thumbnail/variant, crop/resize and optimization pipeline. |
| H19.09 | resize | RES-004 | RES-004: Image preview/thumbnail/variant, crop/resize and optimization pipeline. |
| H19.10 | replace | RES-009 | RES-009: Replace/archive/delete/restore safety. |
| H19.11 | archive/delete | RES-009 | RES-009: Replace/archive/delete/restore safety. |
| H19.12 | usage tracking | RES-008 | RES-008: Asset usage/reference map. |
| H19.13 | unused media detection | RES-008, RES-015 | RES-008: Asset usage/reference map.; RES-015: Media diagnostics and broken asset scan. |
| H19.14 | MIME validation | RES-003 | RES-003: Upload validation/progress/cancel/retry. |
| H19.15 | file-size limits | RES-003 | RES-003: Upload validation/progress/cancel/retry. |
| H19.16 | secure object keys | RES-002, RES-014, SEC-008 | RES-002: R2 binary storage and D1 metadata.; RES-014: File download authorization/expiry.; SEC-008: Secret storage/redaction/rotation. |
| H19.17 | image optimization | RES-004 | RES-004: Image preview/thumbnail/variant, crop/resize and optimization pipeline. |
| H19.18 | video/audio | RES-002, RES-004 | RES-002: R2 binary storage and D1 metadata.; RES-004: Image preview/thumbnail/variant, crop/resize and optimization pipeline. |
| H19.19 | clip/Short assets | RES-001, CNT-003 | RES-001: Canonical asset registry and IDs.; CNT-003: Clip/highlight/Short management. |
| H19.20 | cache policy | RES-004, DYN-006, WEB-030 | RES-004: Image preview/thumbnail/variant, crop/resize and optimization pipeline.; DYN-006: Cache policy, freshness, invalidation és stale fallback.; WEB-030: Cache és invalidáció |

#### H20 — 18 sor, stable cél-definíciók ellenőrzése

| H-ID | Történeti képesség | Stable cél-ID(k) | A 49. fejezet tényleges capability definíciói |
| --- | --- | --- | --- |
| H20.01 | D1 binding | DYN-001, DYN-002 | DYN-001: Canonical data source registry és provider/domain adapter.; DYN-002: Binding schema, type validation és resource/field compatibility. |
| H20.02 | site settings | DYN-001, SET-001 | DYN-001: Canonical data source registry és provider/domain adapter.; SET-001: Canonical site settings schema és CRUD lifecycle. |
| H20.03 | schedule | DYN-001, SCH-010, SCH-011 | DYN-001: Canonical data source registry és provider/domain adapter.; SCH-010: Canonical public schedule data projection/rendering contract consumed by WEB-016 and Editor schedule blocks.; SCH-011: Editor block binding/configuration for the canonical schedule projection; schedule data and lifecycle remain owned by SCH-001–010. |
| H20.04 | Twitch | DYN-001, INT-011, LIV-001 | DYN-001: Canonical data source registry és provider/domain adapter.; INT-011: Twitch live/schedule data.; LIV-001: Normalized live/offline state. |
| H20.05 | YouTube | DYN-001, INT-013 | DYN-001: Canonical data source registry és provider/domain adapter.; INT-013: YouTube channel/video/live adapter. |
| H20.06 | TikTok | DYN-001, INT-014 | DYN-001: Canonical data source registry és provider/domain adapter.; INT-014: TikTok capability-gated adapter. |
| H20.07 | Discord | DYN-001, INT-015 | DYN-001: Canonical data source registry és provider/domain adapter.; INT-015: Discord bot/guild/channel/role integration. |
| H20.08 | VOD | DYN-001, CNT-020 | DYN-001: Canonical data source registry és provider/domain adapter.; CNT-020: Canonical published-content public feed/projection and query contract; WEB-017 owns the public page route/shell. |
| H20.09 | collections | DYN-001, CNT-005 | DYN-001: Canonical data source registry és provider/domain adapter.; CNT-005: Content-library tags/categories/collections/playlists; excludes product-catalog taxonomy and asset-library folders. |
| H20.10 | API data source | DYN-001, DYN-002 | DYN-001: Canonical data source registry és provider/domain adapter.; DYN-002: Binding schema, type validation és resource/field compatibility. |
| H20.11 | loading state | DYN-005 | DYN-005: Runtime state machine for dynamic data bindings (loading/empty/error/partial/stale); shared visual presentation may use ADM-008. |
| H20.12 | empty state | DYN-005 | DYN-005: Runtime state machine for dynamic data bindings (loading/empty/error/partial/stale); shared visual presentation may use ADM-008. |
| H20.13 | error state | DYN-005 | DYN-005: Runtime state machine for dynamic data bindings (loading/empty/error/partial/stale); shared visual presentation may use ADM-008. |
| H20.14 | conditional rendering | DYN-004 | DYN-004: Feltételes rendering és adatfüggő visibility. |
| H20.15 | data transforms | DYN-003 | DYN-003: Whitelisted filter/sort/transform/limit/pagination for bound data queries; not a replacement for module-specific library search. |
| H20.16 | caching | DYN-006 | DYN-006: Cache policy, freshness, invalidation és stale fallback. |
| H20.17 | stale-data handling | DYN-005, DYN-006 | DYN-005: Runtime state machine for dynamic data bindings (loading/empty/error/partial/stale); shared visual presentation may use ADM-008.; DYN-006: Cache policy, freshness, invalidation és stale fallback. |
| H20.18 | binding validation | DYN-002, DYN-008 | DYN-002: Binding schema, type validation és resource/field compatibility.; DYN-008: Binding diagnostics, preview, invalid-reference report és recovery. |

#### H21 — 22 sor, stable cél-definíciók ellenőrzése

| H-ID | Történeti képesség | Stable cél-ID(k) | A 49. fejezet tényleges capability definíciói |
| --- | --- | --- | --- |
| H21.01 | Twitch OAuth | INT-010, INT-003 | INT-010: Twitch OAuth and channel binding.; INT-003: OAuth state/callback/CSRF protection. |
| H21.02 | Twitch live/offline | INT-011, LIV-001 | INT-011: Twitch live/schedule data.; LIV-001: Normalized live/offline state. |
| H21.03 | Twitch title | LIV-003 | LIV-003: Stream title/category/game/start time. |
| H21.04 | Twitch game | LIV-003 | LIV-003: Stream title/category/game/start time. |
| H21.05 | Twitch viewer statistics | LIV-004 | LIV-004: Viewer/follower/subscriber metrics where permitted. |
| H21.06 | Twitch followers/subscribers where available | LIV-004 | LIV-004: Viewer/follower/subscriber metrics where permitted. |
| H21.07 | Twitch VOD | INT-012, CNT-002 | INT-012: Twitch VOD/clip metadata where allowed.; CNT-002: VOD import and metadata. |
| H21.08 | Twitch clips | INT-012, CNT-003 | INT-012: Twitch VOD/clip metadata where allowed.; CNT-003: Clip/highlight/Short management. |
| H21.09 | Twitch events/webhooks where applicable | INT-017, LIV-006 | INT-017: Provider webhook subscription/delivery lifecycle and integration of signature/replay defenses; shared security requirements are defined by SEC-009.; LIV-006: Stream event normalization. |
| H21.10 | YouTube channel | INT-013 | INT-013: YouTube channel/video/live adapter. |
| H21.11 | YouTube videos | INT-013, CNT-004 | INT-013: YouTube channel/video/live adapter.; CNT-004: YouTube/TikTok video feed. |
| H21.12 | YouTube Shorts | INT-013, CNT-003 | INT-013: YouTube channel/video/live adapter.; CNT-003: Clip/highlight/Short management. |
| H21.13 | YouTube statistics where available | INT-013, ANL-004, ANL-001 | INT-013: YouTube channel/video/live adapter.; ANL-004: Content/platform analytics.; ANL-001: Analytics event taxonomy/naming/schema governance for measurement and reporting; excludes workflow trigger execution. |
| H21.14 | YouTube API quota/error handling | INT-009, INT-020 | INT-009: Rate-limit/quota handling.; INT-020: Integration diagnostics and recovery. |
| H21.15 | TikTok profile | INT-014 | INT-014: TikTok capability-gated adapter. |
| H21.16 | TikTok supported content integration | INT-014, CNT-004 | INT-014: TikTok capability-gated adapter.; CNT-004: YouTube/TikTok video feed. |
| H21.17 | TikTok API capability review | INT-014, INT-018 | INT-014: TikTok capability-gated adapter.; INT-018: External integration/provider capability registry for social, streaming and commerce adapters; excludes AI model/provider configuration. |
| H21.18 | TikTok rate limits/fallback | INT-009, INT-014 | INT-009: Rate-limit/quota handling.; INT-014: TikTok capability-gated adapter. |
| H21.19 | Discord community link | INT-015, WEB-019 | INT-015: Discord bot/guild/channel/role integration.; WEB-019: Közösségi oldal és CTA |
| H21.20 | Discord optional integration | INT-015 | INT-015: Discord bot/guild/channel/role integration. |
| H21.21 | Discord status where justified | INT-015, INT-020 | INT-015: Discord bot/guild/channel/role integration.; INT-020: Integration diagnostics and recovery. |
| H21.22 | Architecture constraint: keep secrets in Cloudflare Secrets; normalize external APIs behind services | INT-019, INT-001, SEC-008 | INT-019: Integration secret redaction and audit.; INT-001: Shared external-provider adapter contract; domain modules such as Store implement their specific workflows through this contract.; SEC-008: Secret storage/redaction/rotation. |

#### H22 — 19 sor, stable cél-definíciók ellenőrzése

| H-ID | Történeti képesség | Stable cél-ID(k) | A 49. fejezet tényleges capability definíciói |
| --- | --- | --- | --- |
| H22.01 | schedule CRUD | SCH-001 | SCH-001: Schedule item CRUD. |
| H22.02 | recurring schedule | SCH-004 | SCH-004: Recurrence and series edit scopes. |
| H22.03 | timezone handling | SCH-003 | SCH-003: Timezone and daylight-saving correctness. |
| H22.04 | next-stream calculation | SCH-009 | SCH-009: Next stream/countdown. |
| H22.05 | countdown | SCH-009 | SCH-009: Next stream/countdown. |
| H22.06 | live state | LIV-001, SCH-005 | LIV-001: Normalized live/offline state.; SCH-005: Postponed/cancelled/completed/live states. |
| H22.07 | game/category | SCH-012, SCH-014 | SCH-012: Game Profile CRUD.; SCH-014: Game/content/schedule relationship. |
| H22.08 | stream type | SCH-001, SCH-005 | SCH-001: Schedule item CRUD.; SCH-005: Postponed/cancelled/completed/live states. |
| H22.09 | VOD ingestion | CNT-002 | CNT-002: VOD import and metadata. |
| H22.10 | VOD categorization | CNT-005 | CNT-005: Content-library tags/categories/collections/playlists; excludes product-catalog taxonomy and asset-library folders. |
| H22.11 | VOD search/filter | CNT-006 | CNT-006: Search/filter/sort/pagination/bulk actions over canonical content records only. |
| H22.12 | Shorts management | CNT-003 | CNT-003: Clip/highlight/Short management. |
| H22.13 | clips management | CNT-003 | CNT-003: Clip/highlight/Short management. |
| H22.14 | content calendar | CNT-009 | CNT-009: Content calendar. |
| H22.15 | platform-specific variants | CNT-011 | CNT-011: Platform-specific title/description/tag variants. |
| H22.16 | title/description/hashtag suggestions | CNT-010, CNT-011, AI-013 | CNT-010: Ideas/drafts/scripts/briefs.; CNT-011: Platform-specific title/description/tag variants.; AI-013: Content title/script/description/thumbnail brief. |
| H22.17 | thumbnail brief | CNT-012, CNT-010 | CNT-012: Thumbnail and media asset workflow.; CNT-010: Ideas/drafts/scripts/briefs. |
| H22.18 | publishing workflow | CNT-013, CNT-014 | CNT-013: Publishing queue and schedule.; CNT-014: Publish status/retry/partial success. |
| H22.19 | performance feedback loop | ANL-004, CNT-016, ANL-001 | ANL-004: Content/platform analytics.; CNT-016: Campaign linkage and content attribution.; ANL-001: Analytics event taxonomy/naming/schema governance for measurement and reporting; excludes workflow trigger execution. |

#### H23 — 20 sor, stable cél-definíciók ellenőrzése

| H-ID | Történeti képesség | Stable cél-ID(k) | A 49. fejezet tényleges capability definíciói |
| --- | --- | --- | --- |
| H23.01 | event model | EDT-039 | EDT-039: Page-level interaction/action schema registry for Editor-configured page behavior; not the automation engine action catalog. |
| H23.02 | click | EDT-039 | EDT-039: Page-level interaction/action schema registry for Editor-configured page behavior; not the automation engine action catalog. |
| H23.03 | hover | EDT-039 | EDT-039: Page-level interaction/action schema registry for Editor-configured page behavior; not the automation engine action catalog. |
| H23.04 | focus | EDT-039, EDT-037 | EDT-039: Page-level interaction/action schema registry for Editor-configured page behavior; not the automation engine action catalog.; EDT-037: Keyboard-accessible canvas alternatives. |
| H23.05 | active | EDT-039 | EDT-039: Page-level interaction/action schema registry for Editor-configured page behavior; not the automation engine action catalog. |
| H23.06 | submit | EDT-039, EDT-019 | EDT-039: Page-level interaction/action schema registry for Editor-configured page behavior; not the automation engine action catalog.; EDT-019: Table/Accordion/Tabs/Form capability. |
| H23.07 | scroll | EDT-039 | EDT-039: Page-level interaction/action schema registry for Editor-configured page behavior; not the automation engine action catalog. |
| H23.08 | load | EDT-039 | EDT-039: Page-level interaction/action schema registry for Editor-configured page behavior; not the automation engine action catalog. |
| H23.09 | timer | EDT-039 | EDT-039: Page-level interaction/action schema registry for Editor-configured page behavior; not the automation engine action catalog. |
| H23.10 | open/close | EDT-039 | EDT-039: Page-level interaction/action schema registry for Editor-configured page behavior; not the automation engine action catalog. |
| H23.11 | navigation | EDT-039, WEB-009 | EDT-039: Page-level interaction/action schema registry for Editor-configured page behavior; not the automation engine action catalog.; WEB-009: Navigációs fa |
| H23.12 | show/hide | EDT-039 | EDT-039: Page-level interaction/action schema registry for Editor-configured page behavior; not the automation engine action catalog. |
| H23.13 | toggle | EDT-039 | EDT-039: Page-level interaction/action schema registry for Editor-configured page behavior; not the automation engine action catalog. |
| H23.14 | state machine | EDT-039 | EDT-039: Page-level interaction/action schema registry for Editor-configured page behavior; not the automation engine action catalog. |
| H23.15 | transition | EDT-040 | EDT-040: Motion/reduced-motion behavior. |
| H23.16 | animation timeline | EDT-040 | EDT-040: Motion/reduced-motion behavior. |
| H23.17 | keyframes | EDT-040 | EDT-040: Motion/reduced-motion behavior. |
| H23.18 | reduced-motion | EDT-040, QA-005 | EDT-040: Motion/reduced-motion behavior.; QA-005: Public SEO/accessibility/performance audit. |
| H23.19 | interaction validation | EDT-039, EDT-022 | EDT-039: Page-level interaction/action schema registry for Editor-configured page behavior; not the automation engine action catalog.; EDT-022: Inspector schema validation and control types. |
| H23.20 | performance safeguards | OPS-008, QA-004 | OPS-008: Performance baseline/cache/query monitoring.; QA-004: Browser/device responsive and visual-regression acceptance. |

#### H24 — 13 sor, stable cél-definíciók ellenőrzése

| H-ID | Történeti képesség | Stable cél-ID(k) | A 49. fejezet tényleges capability definíciói |
| --- | --- | --- | --- |
| H24.01 | semantic HTML | WEB-032, QA-005 | WEB-032: Biztonságos renderer/embed; QA-005: Public SEO/accessibility/performance audit. |
| H24.02 | heading hierarchy | EDT-017, QA-005 | EDT-017: Text/Heading/Link/Button/Icon/Divider/Spacer.; QA-005: Public SEO/accessibility/performance audit. |
| H24.03 | alt text | RES-007, QA-005 | RES-007: Alt text/caption/license/source metadata.; QA-005: Public SEO/accessibility/performance audit. |
| H24.04 | labels | EDT-019, QA-005 | EDT-019: Table/Accordion/Tabs/Form capability.; QA-005: Public SEO/accessibility/performance audit. |
| H24.05 | ARIA | QA-005, EDT-037 | QA-005: Public SEO/accessibility/performance audit.; EDT-037: Keyboard-accessible canvas alternatives. |
| H24.06 | keyboard navigation | EDT-037, QA-004 | EDT-037: Keyboard-accessible canvas alternatives.; QA-004: Browser/device responsive and visual-regression acceptance. |
| H24.07 | focus order | EDT-037, QA-005 | EDT-037: Keyboard-accessible canvas alternatives.; QA-005: Public SEO/accessibility/performance audit. |
| H24.08 | focus visibility | EDT-037, QA-005 | EDT-037: Keyboard-accessible canvas alternatives.; QA-005: Public SEO/accessibility/performance audit. |
| H24.09 | contrast warnings | DSN-002, QA-005 | DSN-002: Token editor and live preview.; QA-005: Public SEO/accessibility/performance audit. |
| H24.10 | screen-reader metadata | WEB-032, QA-005 | WEB-032: Biztonságos renderer/embed; QA-005: Public SEO/accessibility/performance audit. |
| H24.11 | form validation accessibility | EDT-019, QA-005 | EDT-019: Table/Accordion/Tabs/Form capability.; QA-005: Public SEO/accessibility/performance audit. |
| H24.12 | editor accessibility checks | EDT-022, EDT-037 | EDT-022: Inspector schema validation and control types.; EDT-037: Keyboard-accessible canvas alternatives. |
| H24.13 | public accessibility audit | QA-005, QA-009 | QA-005: Public SEO/accessibility/performance audit.; QA-009: User acceptance and evidence log. |

#### H25 — 12 sor, stable cél-definíciók ellenőrzése

| H-ID | Történeti képesség | Stable cél-ID(k) | A 49. fejezet tényleges capability definíciói |
| --- | --- | --- | --- |
| H25.01 | title | SEO-001 | SEO-001: Per-page title, description, canonical URL és robots policy. |
| H25.02 | description | SEO-001 | SEO-001: Per-page title, description, canonical URL és robots policy. |
| H25.03 | canonical | SEO-001, SET-004 | SEO-001: Per-page title, description, canonical URL és robots policy.; SET-004: Custom domain lifecycle, verification, DNS/SSL status, primary-domain transition and canonical URL. |
| H25.04 | Open Graph | SEO-002 | SEO-002: Open Graph, X/Twitter card és social preview/image validation. |
| H25.05 | X/Twitter card | SEO-002 | SEO-002: Open Graph, X/Twitter card és social preview/image validation. |
| H25.06 | structured data | SEO-003 | SEO-003: Validált structured data/schema.org, ahol releváns. |
| H25.07 | sitemap | SEO-004 | SEO-004: Sitemap és robots.txt lifecycle, publish/cache invalidation. |
| H25.08 | robots | SEO-004 | SEO-004: Sitemap és robots.txt lifecycle, publish/cache invalidation. |
| H25.09 | per-page SEO | SEO-001 | SEO-001: Per-page title, description, canonical URL és robots policy. |
| H25.10 | SEO preview | SEO-005 | SEO-005: SEO preview/diagnostics, duplicate/missing metadata és page-level audit. |
| H25.11 | redirects | WEB-013 | WEB-013: Redirect és broken-link |
| H25.12 | broken-link detection | WEB-013, SEO-005 | WEB-013: Redirect és broken-link; SEO-005: SEO preview/diagnostics, duplicate/missing metadata és page-level audit. |

#### H26 — 12 sor, stable cél-definíciók ellenőrzése

| H-ID | Történeti képesség | Stable cél-ID(k) | A 49. fejezet tényleges capability definíciói |
| --- | --- | --- | --- |
| H26.01 | page views | ANL-001, ANL-002 | ANL-001: Analytics event taxonomy/naming/schema governance for measurement and reporting; excludes workflow trigger execution.; ANL-002: Privacy-safe web analytics. |
| H26.02 | button clicks | ANL-001, ANL-002 | ANL-001: Analytics event taxonomy/naming/schema governance for measurement and reporting; excludes workflow trigger execution.; ANL-002: Privacy-safe web analytics. |
| H26.03 | social clicks | ANL-001, ANL-002 | ANL-001: Analytics event taxonomy/naming/schema governance for measurement and reporting; excludes workflow trigger execution.; ANL-002: Privacy-safe web analytics. |
| H26.04 | stream events | ANL-001, ANL-003 | ANL-001: Analytics event taxonomy/naming/schema governance for measurement and reporting; excludes workflow trigger execution.; ANL-003: Stream analytics. |
| H26.05 | conversion events | ANL-001, ANL-005 | ANL-001: Analytics event taxonomy/naming/schema governance for measurement and reporting; excludes workflow trigger execution.; ANL-005: Commerce analytics. |
| H26.06 | privacy-aware analytics | ANL-002, ANL-009 | ANL-002: Privacy-safe web analytics.; ANL-009: Consent/retention/bot filtering. |
| H26.07 | retention policy | ANL-009, SEC-011 | ANL-009: Consent/retention/bot filtering.; SEC-011: Consent/retention/export/delete. |
| H26.08 | admin dashboard | ANL-007, ADM-002 | ANL-007: Date range/comparison/filter/export.; ADM-002: 49.1 / Áttekintés |
| H26.09 | editor/content performance | ANL-004 | ANL-004: Content/platform analytics. |
| H26.10 | content performance | ANL-004 | ANL-004: Content/platform analytics. |
| H26.11 | stream performance | ANL-003 | ANL-003: Stream analytics. |
| H26.12 | anomaly detection later | ANL-010 | ANL-010: Anomaly detection, thresholds and explainable alerts. |

#### H27 — 19 sor, stable cél-definíciók ellenőrzése

| H-ID | Történeti képesség | Stable cél-ID(k) | A 49. fejezet tényleges capability definíciói |
| --- | --- | --- | --- |
| H27.01 | dashboard | ADM-001, ADM-002 | ADM-001: 49.1 / Admin shell; ADM-002: 49.1 / Áttekintés |
| H27.02 | navigation | ADM-001 | ADM-001: 49.1 / Admin shell |
| H27.03 | responsive admin | ADM-010 | ADM-010: 49.1 / Mobil Admin shell |
| H27.04 | diagnostics | OPS-007, ADM-004 | OPS-007: Diagnostics report.; ADM-004: 49.1 / Teendők |
| H27.05 | page list | WEB-001 | WEB-001: Oldallista, létrehozás és szerkesztés |
| H27.06 | content management | CNT-001, CNT-006 | CNT-001: Canonical content item schema.; CNT-006: Search/filter/sort/pagination/bulk actions over canonical content records only. |
| H27.07 | schedule | SCH-001 | SCH-001: Schedule item CRUD. |
| H27.08 | socials | INT-002, ADM-003 | INT-002: Integration overview and health.; ADM-003: 49.1 / Gyorsműveletek |
| H27.09 | VOD | CNT-002 | CNT-002: VOD import and metadata. |
| H27.10 | media | RES-001 | RES-001: Canonical asset registry and IDs. |
| H27.11 | settings | SET-001 | SET-001: Canonical site settings schema és CRUD lifecycle. |
| H27.12 | SEO | SEO-005 | SEO-005: SEO preview/diagnostics, duplicate/missing metadata és page-level audit. |
| H27.13 | analytics | ANL-007 | ANL-007: Date range/comparison/filter/export. |
| H27.14 | integrations | INT-002 | INT-002: Integration overview and health. |
| H27.15 | editor management | EDT-001, WEB-001 | EDT-001: Canonical Page Model schema/version.; WEB-001: Oldallista, létrehozás és szerkesztés |
| H27.16 | preview | EDT-032, WEB-005 | EDT-032: Preview without publishing.; WEB-005: Preview link és hozzáférés |
| H27.17 | recovery | EDT-042, OPS-005 | EDT-042: Editor error recovery and no-data-loss guard.; OPS-005: Operational backup/export/restore capability and runbook; QA-007 only verifies it through tests/evidence. |
| H27.18 | history | WEB-008, EDT-005 | WEB-008: Revízió és diff; EDT-005: Undo/redo history integrity. |
| H27.19 | permissions | SEC-002, ADM-009 | SEC-002: Server-side RBAC and ownership.; ADM-009: 49.1 / Navigáció és műveletek |

#### H28 — 17 sor, stable cél-definíciók ellenőrzése

| H-ID | Történeti képesség | Stable cél-ID(k) | A 49. fejezet tényleges capability definíciói |
| --- | --- | --- | --- |
| H28.01 | HttpOnly | SEC-001 | SEC-001: Authentication/session lifecycle. |
| H28.02 | Secure cookie | SEC-001 | SEC-001: Authentication/session lifecycle. |
| H28.03 | SameSite | SEC-001 | SEC-001: Authentication/session lifecycle. |
| H28.04 | password hash | SEC-001 | SEC-001: Authentication/session lifecycle. |
| H28.05 | CSRF | SEC-004 | SEC-004: OAuth/CSRF/session security. |
| H28.06 | rate limiting | SEC-007 | SEC-007: Rate limiting and abuse protection. |
| H28.07 | RBAC | SEC-002 | SEC-002: Server-side RBAC and ownership. |
| H28.08 | API authorization | SEC-002, SEC-003 | SEC-002: Server-side RBAC and ownership.; SEC-003: Cross-domain server-side site/workspace/tenant isolation invariant; TEAM-001/TEAM-005 provide workspace selection and multi-site workflows but do not replace authorization. |
| H28.09 | public/admin separation | SEC-002, WEB-031 | SEC-002: Server-side RBAC and ownership.; WEB-031: Published-only enforcement |
| H28.10 | Cloudflare Secrets | SEC-008 | SEC-008: Secret storage/redaction/rotation. |
| H28.11 | audit log | SEC-010 | SEC-010: Cross-domain security/privacy audit events and redaction/retention controls; workflow execution detail remains in AUT-008. |
| H28.12 | input validation | SEC-006, SEC-005 | SEC-006: SSRF/open redirect/injection defenses.; SEC-005: XSS/sanitization/safe embeds. |
| H28.13 | output validation | SEC-005 | SEC-005: XSS/sanitization/safe embeds. |
| H28.14 | file validation | RES-003, SEC-006 | RES-003: Upload validation/progress/cancel/retry.; SEC-006: SSRF/open redirect/injection defenses. |
| H28.15 | replay protection where applicable | SEC-009 | SEC-009: Cross-domain webhook signature/replay security requirement and negative-test contract; provider-specific implementation is owned by INT-017. |
| H28.16 | action permission 'can()' checks | SEC-002, AUT-004 | SEC-002: Server-side RBAC and ownership.; AUT-004: Automation action catalog and server-side permission checks for workflow execution; page interaction schemas remain in EDT-039. |
| H28.17 | AI permission boundary | AI-006, AI-019 | AI-006: Permission/ownership checker.; AI-019: Human approval for public/destructive/financial action. |

#### H29 — 10 sor, stable cél-definíciók ellenőrzése

| H-ID | Történeti képesség | Stable cél-ID(k) | A 49. fejezet tényleges capability definíciói |
| --- | --- | --- | --- |
| H29.01 | full backup | OPS-005 | OPS-005: Operational backup/export/restore capability and runbook; QA-007 only verifies it through tests/evidence. |
| H29.02 | page backup | OPS-005, WEB-007 | OPS-005: Operational backup/export/restore capability and runbook; QA-007 only verifies it through tests/evidence.; WEB-007: Publish/unpublish/rollback |
| H29.03 | revision backup | OPS-005, WEB-008 | OPS-005: Operational backup/export/restore capability and runbook; QA-007 only verifies it through tests/evidence.; WEB-008: Revízió és diff |
| H29.04 | media references | OPS-005, RES-008 | OPS-005: Operational backup/export/restore capability and runbook; QA-007 only verifies it through tests/evidence.; RES-008: Asset usage/reference map. |
| H29.05 | restore validation | OPS-006, QA-007 | OPS-006: Recovery drill and runbook.; QA-007: Test/acceptance gate and evidence for backup/restore/rollback; does not implement backup operations. |
| H29.06 | rollback | OPS-009, QA-007 | OPS-009: Rollback and incident procedure.; QA-007: Test/acceptance gate and evidence for backup/restore/rollback; does not implement backup operations. |
| H29.07 | import/export JSON | OPS-005 | OPS-005: Operational backup/export/restore capability and runbook; QA-007 only verifies it through tests/evidence. |
| H29.08 | migration compatibility | OPS-004 | OPS-004: Migration preflight/integrity. |
| H29.09 | backup integrity check | OPS-005, QA-007 | OPS-005: Operational backup/export/restore capability and runbook; QA-007 only verifies it through tests/evidence.; QA-007: Test/acceptance gate and evidence for backup/restore/rollback; does not implement backup operations. |
| H29.10 | recovery drill | OPS-006, QA-007 | OPS-006: Recovery drill and runbook.; QA-007: Test/acceptance gate and evidence for backup/restore/rollback; does not implement backup operations. |

#### H30 — 14 sor, stable cél-definíciók ellenőrzése

| H-ID | Történeti képesség | Stable cél-ID(k) | A 49. fejezet tényleges capability definíciói |
| --- | --- | --- | --- |
| H30.01 | bundle review | OPS-008 | OPS-008: Performance baseline/cache/query monitoring. |
| H30.02 | lazy loading | OPS-008, WEB-032 | OPS-008: Performance baseline/cache/query monitoring.; WEB-032: Biztonságos renderer/embed |
| H30.03 | image optimization | RES-004 | RES-004: Image preview/thumbnail/variant, crop/resize and optimization pipeline. |
| H30.04 | caching | WEB-030, OPS-008 | WEB-030: Cache és invalidáció; OPS-008: Performance baseline/cache/query monitoring. |
| H30.05 | cache invalidation | WEB-030, DYN-006 | WEB-030: Cache és invalidáció; DYN-006: Cache policy, freshness, invalidation és stale fallback. |
| H30.06 | Core Web Vitals | OPS-008, QA-005 | OPS-008: Performance baseline/cache/query monitoring.; QA-005: Public SEO/accessibility/performance audit. |
| H30.07 | rendering performance | OPS-008, QA-004 | OPS-008: Performance baseline/cache/query monitoring.; QA-004: Browser/device responsive and visual-regression acceptance. |
| H30.08 | large-page performance | OPS-008, QA-004 | OPS-008: Performance baseline/cache/query monitoring.; QA-004: Browser/device responsive and visual-regression acceptance. |
| H30.09 | large-tree editor performance | OPS-008, EDT-012 | OPS-008: Performance baseline/cache/query monitoring.; EDT-012: Layers tree expand/collapse. |
| H30.10 | history memory limits | EDT-005, OPS-008 | EDT-005: Undo/redo history integrity.; OPS-008: Performance baseline/cache/query monitoring. |
| H30.11 | autosave efficiency | EDT-030, OPS-008 | EDT-030: In-flight edit preservation during save.; OPS-008: Performance baseline/cache/query monitoring. |
| H30.12 | API latency monitoring | OPS-008 | OPS-008: Performance baseline/cache/query monitoring. |
| H30.13 | production smoke test | QA-006 | QA-006: Production smoke and runtime verification. |
| H30.14 | visual regression baseline | QA-004 | QA-004: Browser/device responsive and visual-regression acceptance. |

#### H31 — 14 sor, stable cél-definíciók ellenőrzése

| H-ID | Történeti képesség | Stable cél-ID(k) | A 49. fejezet tényleges capability definíciói |
| --- | --- | --- | --- |
| H31.00 | AI editor must use the same canonical action system as manual Editor; pipeline: Intent -> Plan -> Actions -> Permission -> Validation -> Preview/Diff -> Approval -> Execute -> Verify -> Audit -> Version | AI-003, AI-005, AI-006, AI-007, AI-008, AI-009 | AI-003: Intent and task planner.; AI-005: Structured action schema.; AI-006: Permission/ownership checker.; AI-007: Diff/preview/approval workflow.; AI-008: Execute through canonical API/commands.; AI-009: Verification/audit/version/rollback. |
| H31.01 | AI page operations | AI-011 | AI-011: Website structure/content assistant. |
| H31.02 | AI element operations | AI-011, AI-008 | AI-011: Website structure/content assistant.; AI-008: Execute through canonical API/commands. |
| H31.03 | AI style/layout operations | AI-011, AI-008 | AI-011: Website structure/content assistant.; AI-008: Execute through canonical API/commands. |
| H31.04 | AI responsive operations | AI-011, EDT-024 | AI-011: Website structure/content assistant.; EDT-024: Responsive override/inheritance/reset. |
| H31.05 | AI content generation | AI-011, AI-013 | AI-011: Website structure/content assistant.; AI-013: Content title/script/description/thumbnail brief. |
| H31.06 | AI SEO assistance | AI-012 | AI-012: SEO/accessibility/localization suggestions. |
| H31.07 | AI accessibility QA | AI-012 | AI-012: SEO/accessibility/localization suggestions. |
| H31.08 | AI visual QA | AI-012, QA-004 | AI-012: SEO/accessibility/localization suggestions.; QA-004: Browser/device responsive and visual-regression acceptance. |
| H31.09 | action permissions | AI-006 | AI-006: Permission/ownership checker. |
| H31.10 | approval rules | AI-007, AI-019 | AI-007: Diff/preview/approval workflow.; AI-019: Human approval for public/destructive/financial action. |
| H31.11 | rollback | AI-009 | AI-009: Verification/audit/version/rollback. |
| H31.12 | audit | AI-009, SEC-010 | AI-009: Verification/audit/version/rollback.; SEC-010: Cross-domain security/privacy audit events and redaction/retention controls; workflow execution detail remains in AUT-008. |
| H31.13 | rate/cost controls | AI-010 | AI-010: Cost/quota/usage/error tracking. |

#### H32 — 25 sor, stable cél-definíciók ellenőrzése

| H-ID | Történeti képesség | Stable cél-ID(k) | A 49. fejezet tényleges capability definíciói |
| --- | --- | --- | --- |
| H32.01 | live stream monitoring | AI-015 | AI-015: Stream diagnostics/summary where supported. |
| H32.02 | silence/speech detection | AI-015 | AI-015: Stream diagnostics/summary where supported. |
| H32.03 | chat activity analysis | AI-015 | AI-015: Stream diagnostics/summary where supported. |
| H32.04 | technical issue detection | AI-015 | AI-015: Stream diagnostics/summary where supported. |
| H32.05 | audio problem detection | AI-015 | AI-015: Stream diagnostics/summary where supported. |
| H32.06 | stream quality checks | AI-015 | AI-015: Stream diagnostics/summary where supported. |
| H32.07 | scene suggestions | AI-015, OBS-003 | AI-015: Stream diagnostics/summary where supported.; OBS-003: Scene/stream/recording state where supported. |
| H32.08 | context-aware ideas | AI-015, AI-013 | AI-015: Stream diagnostics/summary where supported.; AI-013: Content title/script/description/thumbnail brief. |
| H32.09 | interesting moment detection | AI-014, AI-015 | AI-014: AI-generated transcript/chapter/highlight/clip candidates with source timestamps and confidence; does not own canonical content records or rights metadata.; AI-015: Stream diagnostics/summary where supported. |
| H32.10 | post-stream summary | AI-015 | AI-015: Stream diagnostics/summary where supported. |
| H32.11 | VOD analysis | AI-014, CNT-018 | AI-014: AI-generated transcript/chapter/highlight/clip candidates with source timestamps and confidence; does not own canonical content records or rights metadata.; CNT-018: Content-domain transcript/chapter/highlight artifact metadata and review lifecycle; AI suggestions originate in AI-014 and are stored through the content API. |
| H32.12 | clip candidates | AI-014 | AI-014: AI-generated transcript/chapter/highlight/clip candidates with source timestamps and confidence; does not own canonical content records or rights metadata. |
| H32.13 | Short candidates | AI-014, CNT-003 | AI-014: AI-generated transcript/chapter/highlight/clip candidates with source timestamps and confidence; does not own canonical content records or rights metadata.; CNT-003: Clip/highlight/Short management. |
| H32.14 | title/description suggestions | AI-013 | AI-013: Content title/script/description/thumbnail brief. |
| H32.15 | platform variants | AI-013, CNT-011 | AI-013: Content title/script/description/thumbnail brief.; CNT-011: Platform-specific title/description/tag variants. |
| H32.16 | thumbnail briefs | AI-013 | AI-013: Content title/script/description/thumbnail brief. |
| H32.17 | publishing recommendations | AI-013, CNT-013 | AI-013: Content title/script/description/thumbnail brief.; CNT-013: Publishing queue and schedule. |
| H32.18 | content performance analysis | ANL-004, AI-004, AI-013 | ANL-004: Content/platform analytics.; AI-004: Context selection and privacy filter.; AI-013: Content title/script/description/thumbnail brief. |
| H32.19 | streamer profile | AI-004 | AI-004: Context selection and privacy filter. |
| H32.20 | long-term memory | AI-004 | AI-004: Context selection and privacy filter. |
| H32.21 | preferences | AI-004 | AI-004: Context selection and privacy filter. |
| H32.22 | historical outcomes | AI-004, ANL-007 | AI-004: Context selection and privacy filter.; ANL-007: Date range/comparison/filter/export. |
| H32.23 | experiment tracking | AI-002, ANL-007 | AI-002: AI prompt/instruction template versioning and evaluation; excludes visual design and page-template lifecycle in DSN-014.; ANL-007: Date range/comparison/filter/export. |
| H32.24 | evaluation cycle | AI-002 | AI-002: AI prompt/instruction template versioning and evaluation; excludes visual design and page-template lifecycle in DSN-014. |
| H32.25 | feedback loop | AI-002, AI-017 | AI-002: AI prompt/instruction template versioning and evaluation; excludes visual design and page-template lifecycle in DSN-014.; AI-017: AI Control Center and approval queue. |

#### H33 — 13 sor, stable cél-definíciók ellenőrzése

| H-ID | Történeti képesség | Stable cél-ID(k) | A 49. fejezet tényleges capability definíciói |
| --- | --- | --- | --- |
| H33.00 | Automation lifecycle contract: Trigger -> Condition -> Action -> Result -> Verify -> Audit | AUT-001, AUT-002, AUT-003, AUT-004, AUT-008 | AUT-001: Automation trigger-event catalog and event-to-workflow routing contract; consumes domain events and does not define analytics measurement taxonomy.; AUT-002: Trigger catalogue.; AUT-003: Condition/filter rules.; AUT-004: Automation action catalog and server-side permission checks for workflow execution; page interaction schemas remain in EDT-039.; AUT-008: Automation execution/run history and workflow-specific diagnostics; security/privacy audit events are owned by SEC-010. |
| H33.01 | scheduled automations | AUT-005 | AUT-005: Delay/schedule and timezone. |
| H33.02 | event automations | AUT-001, AUT-002 | AUT-001: Automation trigger-event catalog and event-to-workflow routing contract; consumes domain events and does not define analytics measurement taxonomy.; AUT-002: Trigger catalogue. |
| H33.03 | content workflows | AUT-014, CNT-013 | AUT-014: Safe cross-domain actions.; CNT-013: Publishing queue and schedule. |
| H33.04 | media workflows | AUT-014, RES-001 | AUT-014: Safe cross-domain actions.; RES-001: Canonical asset registry and IDs. |
| H33.05 | stream workflows | AUT-014, LIV-006 | AUT-014: Safe cross-domain actions.; LIV-006: Stream event normalization. |
| H33.06 | notification workflows | AUT-014, NTF-004 | AUT-014: Safe cross-domain actions.; NTF-004: Idempotent event-to-notification mapping, deduplication and bounded retry. |
| H33.07 | retry policy | AUT-007 | AUT-007: Retry/backoff/dead-letter. |
| H33.08 | idempotency | AUT-006 | AUT-006: Idempotency/deduplication. |
| H33.09 | failure handling | AUT-007, AUT-012 | AUT-007: Retry/backoff/dead-letter.; AUT-012: Provider outage and recovery. |
| H33.10 | permissions | AUT-004, SEC-002 | AUT-004: Automation action catalog and server-side permission checks for workflow execution; page interaction schemas remain in EDT-039.; SEC-002: Server-side RBAC and ownership. |
| H33.11 | audit | AUT-008, SEC-010 | AUT-008: Automation execution/run history and workflow-specific diagnostics; security/privacy audit events are owned by SEC-010.; SEC-010: Cross-domain security/privacy audit events and redaction/retention controls; workflow execution detail remains in AUT-008. |
| H33.12 | Queues/Durable Objects only when justified by a real background-task or realtime requirement | OPS-011 | OPS-011: Background-job/realtime runtime selection and lifecycle, only where justified. |

#### H34 — 23 sor, stable cél-definíciók ellenőrzése

| H-ID | Történeti képesség | Stable cél-ID(k) | A 49. fejezet tényleges capability definíciói |
| --- | --- | --- | --- |
| H34.00 | Continuous feature discovery is never permanently closed; repeat the review before every significant Editor/platform extension | QA-010 | QA-010: Continuous benchmark and feature-discovery review. |
| H34.01 | modern visual builder minták; | QA-010, EDT-021 | QA-010: Continuous benchmark and feature-discovery review.; EDT-021: Inspector Property Registry. |
| H34.02 | GrapesJS / Craft.js / Puck architekturális minták; | QA-010, OPS-010 | QA-010: Continuous benchmark and feature-discovery review.; OPS-010: Dependency/license/CVE review. |
| H34.03 | új responsive/layout megoldások; | EDT-023, EDT-026, QA-010 | EDT-023: Inspector resolved viewport value.; EDT-026: Responsive visibility/order/column changes.; QA-010: Continuous benchmark and feature-discovery review. |
| H34.04 | accessibility; | QA-005, QA-010 | QA-005: Public SEO/accessibility/performance audit.; QA-010: Continuous benchmark and feature-discovery review. |
| H34.05 | performance; | OPS-008, QA-010 | OPS-008: Performance baseline/cache/query monitoring.; QA-010: Continuous benchmark and feature-discovery review. |
| H34.06 | reusable components; | DSN-012, QA-010 | DSN-012: Reusable component/symbol master-instance.; QA-010: Continuous benchmark and feature-discovery review. |
| H34.07 | design systems; | DSN-001, QA-010 | DSN-001: Global design token schema.; QA-010: Continuous benchmark and feature-discovery review. |
| H34.08 | collaboration/conflict; | TEAM-004, EDT-029, QA-010 | TEAM-004: Approval/review/activity feed.; EDT-029: Revision conflict recovery.; QA-010: Continuous benchmark and feature-discovery review. |
| H34.09 | backup/recovery; | OPS-005, QA-007 | OPS-005: Operational backup/export/restore capability and runbook; QA-007 only verifies it through tests/evidence.; QA-007: Test/acceptance gate and evidence for backup/restore/rollback; does not implement backup operations. |
| H34.10 | AI action safety; | AI-018, QA-010 | AI-018: Prompt injection and untrusted content tests.; QA-010: Continuous benchmark and feature-discovery review. |
| H34.11 | stream/content intelligence. | AI-015, QA-010 | AI-015: Stream diagnostics/summary where supported.; QA-010: Continuous benchmark and feature-discovery review. |
| H34.12 | azonosítás; | QA-010 | QA-010: Continuous benchmark and feature-discovery review. |
| H34.13 | cél és felhasználási eset; | QA-010 | QA-010: Continuous benchmark and feature-discovery review. |
| H34.14 | függőségek; | QA-010 | QA-010: Continuous benchmark and feature-discovery review. |
| H34.15 | Page Model/adatmodell; | EDT-001, QA-010 | EDT-001: Canonical Page Model schema/version.; QA-010: Continuous benchmark and feature-discovery review. |
| H34.16 | Command/Action; | EDT-003, QA-010 | EDT-003: Command mutation pipeline.; QA-010: Continuous benchmark and feature-discovery review. |
| H34.17 | Inspector/Canvas/UI; | EDT-021, QA-010 | EDT-021: Inspector Property Registry.; QA-010: Continuous benchmark and feature-discovery review. |
| H34.18 | persistence; | EDT-028, QA-010 | EDT-028: Save/reload round-trip.; QA-010: Continuous benchmark and feature-discovery review. |
| H34.19 | teszt; | QA-001, QA-002 | QA-001: Typecheck/build/CI gates.; QA-002: Domain/API/integration tests. |
| H34.20 | MASTER-be felvétel; | QA-010 | QA-010: Continuous benchmark and feature-discovery review. |
| H34.21 | implementáció; | DEV-001, QA-002, QA-008 | DEV-001: Public API reference, versioning, schema and deprecation policy.; QA-002: Domain/API/integration tests.; QA-008: End-to-end creator journey. |
| H34.22 | felhasználói validáció. | QA-009 | QA-009: User acceptance and evidence log. |

**Kritikus ellenőrzési korlát:** a cél-definíció megléte nem bizonyítja, hogy az eredeti történeti követelmény minden edge case-e, surface-e, dependency-je és release phase-e lefedett. A 63.50.77–78 `GAP/UNPROVEN/REPHASED` besorolások érvényben maradnak. A H34.21 governance „implementáció” sor például a `DEV-001` API lifecycle + `QA-002/008` tesztekhez kötött, **nem önálló implementált feature**; a H21.22 secrets/adapter architektúra nem pusztán integrációs UI. A H25 SEO/publish crosswalk nem oldja fel a 63.50.46 HIGH publikálási konfliktust.

**Mérési pont:** `271/271 HISTORICAL ROWS HAVE EXISTING STABLE TARGET DEFINITIONS`; `436/436 TARGET REFERENCES RESOLVED`; `0 MISSING TARGET ID`; `0 RUNTIME TESTS RUN IN THIS AUDIT`. **A fázis/owner/acceptance teljes szemantikai egyenértékűsége továbbra is NOT PASS**, és a 00/A, 00.9–00.9.6.B forráshiány nyitott. Következő kurzor: `63.50.84` — explicit 1.0 vs 1.x+ archív fáziskülönbségek és GAP/UNPROVEN sorok célzott bizonyíték-kapui, valamint hiányzó forráskeresés. **GLOBAL NOT PASS / FEATURE IMPLEMENTATION FROZEN.**


### 63.50.84. H19–H34 271/271 eredeti fázismező szerinti 1.0 / 1.x+ / governance kapu-besorolás (2026-10-15)

**Forrás:** a 63.50.79–80 fejezetben az eredeti archív táblából forráshűen átemelt 271 `Phase / scope` mező. Az alábbi besorolás **szabályalapú első körös triage** az eredeti szöveg alapján; nem állítja, hogy az új F0–F11 fázis és az archív Stage számok szemantikailag azonosak, vagy hogy az összes per-ID acceptance megvan. A `SPLIT BASELINE / ADVANCED` azt jelenti, hogy az eredeti szövegben egyszerre szerepelhet 1.0 alap és későbbi bővítés; **nem** jelenti a teljes sor 1.0 vállalását.

| H-ID | Eredeti archív phase/scope | Első körös release-besorolás | Kötelező döntés |
| --- | --- | --- | --- |
| H19.01 | 1.0 foundation for required media; advanced media workflows 1.x+ | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H19.02 | 1.0 foundation for required media; advanced media workflows 1.x+ | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H19.03 | 1.0 foundation for required media; advanced media workflows 1.x+ | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H19.04 | 1.0 foundation for required media; advanced media workflows 1.x+ | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H19.05 | 1.0 foundation for required media; advanced media workflows 1.x+ | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H19.06 | 1.0 foundation for required media; advanced media workflows 1.x+ | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H19.07 | 1.0 foundation for required media; advanced media workflows 1.x+ | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H19.08 | 1.0 foundation for required media; advanced media workflows 1.x+ | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H19.09 | 1.0 foundation for required media; advanced media workflows 1.x+ | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H19.10 | 1.0 foundation for required media; advanced media workflows 1.x+ | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H19.11 | 1.0 foundation for required media; advanced media workflows 1.x+ | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H19.12 | 1.0 foundation for required media; advanced media workflows 1.x+ | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H19.13 | 1.0 foundation for required media; advanced media workflows 1.x+ | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H19.14 | 1.0 foundation for required media; advanced media workflows 1.x+ | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H19.15 | 1.0 foundation for required media; advanced media workflows 1.x+ | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H19.16 | 1.0 foundation for required media; advanced media workflows 1.x+ | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H19.17 | 1.0 foundation for required media; advanced media workflows 1.x+ | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H19.18 | 1.0 foundation for required media; advanced media workflows 1.x+ | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H19.19 | 1.0 foundation for required media; advanced media workflows 1.x+ | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H19.20 | 1.0 foundation for required media; advanced media workflows 1.x+ | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H20.01 | 1.0 foundation for required site/schedule bindings; broader CMS/platform bindings 1.x+ | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H20.02 | 1.0 foundation for required site/schedule bindings; broader CMS/platform bindings 1.x+ | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H20.03 | 1.0 foundation for required site/schedule bindings; broader CMS/platform bindings 1.x+ | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H20.04 | 1.0 foundation for required site/schedule bindings; broader CMS/platform bindings 1.x+ | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H20.05 | 1.0 foundation for required site/schedule bindings; broader CMS/platform bindings 1.x+ | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H20.06 | 1.0 foundation for required site/schedule bindings; broader CMS/platform bindings 1.x+ | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H20.07 | 1.0 foundation for required site/schedule bindings; broader CMS/platform bindings 1.x+ | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H20.08 | 1.0 foundation for required site/schedule bindings; broader CMS/platform bindings 1.x+ | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H20.09 | 1.0 foundation for required site/schedule bindings; broader CMS/platform bindings 1.x+ | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H20.10 | 1.0 foundation for required site/schedule bindings; broader CMS/platform bindings 1.x+ | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H20.11 | 1.0 foundation for required site/schedule bindings; broader CMS/platform bindings 1.x+ | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H20.12 | 1.0 foundation for required site/schedule bindings; broader CMS/platform bindings 1.x+ | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H20.13 | 1.0 foundation for required site/schedule bindings; broader CMS/platform bindings 1.x+ | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H20.14 | 1.0 foundation for required site/schedule bindings; broader CMS/platform bindings 1.x+ | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H20.15 | 1.0 foundation for required site/schedule bindings; broader CMS/platform bindings 1.x+ | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H20.16 | 1.0 foundation for required site/schedule bindings; broader CMS/platform bindings 1.x+ | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H20.17 | 1.0 foundation for required site/schedule bindings; broader CMS/platform bindings 1.x+ | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H20.18 | 1.0 foundation for required site/schedule bindings; broader CMS/platform bindings 1.x+ | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H21.01 | Twitch in 1.0 where specified; YouTube/TikTok/Discord and extended capabilities staged by D roadmap | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H21.02 | Twitch in 1.0 where specified; YouTube/TikTok/Discord and extended capabilities staged by D roadmap | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H21.03 | Twitch in 1.0 where specified; YouTube/TikTok/Discord and extended capabilities staged by D roadmap | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H21.04 | Twitch in 1.0 where specified; YouTube/TikTok/Discord and extended capabilities staged by D roadmap | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H21.05 | Twitch in 1.0 where specified; YouTube/TikTok/Discord and extended capabilities staged by D roadmap | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H21.06 | Twitch in 1.0 where specified; YouTube/TikTok/Discord and extended capabilities staged by D roadmap | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H21.07 | Twitch in 1.0 where specified; YouTube/TikTok/Discord and extended capabilities staged by D roadmap | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H21.08 | Twitch in 1.0 where specified; YouTube/TikTok/Discord and extended capabilities staged by D roadmap | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H21.09 | Twitch in 1.0 where specified; YouTube/TikTok/Discord and extended capabilities staged by D roadmap | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H21.10 | Twitch in 1.0 where specified; YouTube/TikTok/Discord and extended capabilities staged by D roadmap | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H21.11 | Twitch in 1.0 where specified; YouTube/TikTok/Discord and extended capabilities staged by D roadmap | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H21.12 | Twitch in 1.0 where specified; YouTube/TikTok/Discord and extended capabilities staged by D roadmap | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H21.13 | Twitch in 1.0 where specified; YouTube/TikTok/Discord and extended capabilities staged by D roadmap | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H21.14 | Twitch in 1.0 where specified; YouTube/TikTok/Discord and extended capabilities staged by D roadmap | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H21.15 | Twitch in 1.0 where specified; YouTube/TikTok/Discord and extended capabilities staged by D roadmap | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H21.16 | Twitch in 1.0 where specified; YouTube/TikTok/Discord and extended capabilities staged by D roadmap | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H21.17 | Twitch in 1.0 where specified; YouTube/TikTok/Discord and extended capabilities staged by D roadmap | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H21.18 | Twitch in 1.0 where specified; YouTube/TikTok/Discord and extended capabilities staged by D roadmap | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H21.19 | Twitch in 1.0 where specified; YouTube/TikTok/Discord and extended capabilities staged by D roadmap | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H21.20 | Discord integration staged by D roadmap unless explicitly approved for 1.0 | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H21.21 | Only where a concrete user-facing status use case justifies it; phase per D roadmap | SCOPE DECISION / NO AUTO-PHASE | Owner and roadmap approval required before phase commitment |
| H21.22 | Cross-cutting architecture constraint; apply whenever external integrations are implemented | CROSS-CUTTING INVARIANT | Enforce in every affected implementation |
| H22.01 | Schedule core and public next/live states 1.0; broader VOD/Shorts/content automation staged per D roadmap | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H22.02 | Schedule core and public next/live states 1.0; broader VOD/Shorts/content automation staged per D roadmap | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H22.03 | Schedule core and public next/live states 1.0; broader VOD/Shorts/content automation staged per D roadmap | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H22.04 | Schedule core and public next/live states 1.0; broader VOD/Shorts/content automation staged per D roadmap | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H22.05 | Schedule core and public next/live states 1.0; broader VOD/Shorts/content automation staged per D roadmap | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H22.06 | Schedule core and public next/live states 1.0; broader VOD/Shorts/content automation staged per D roadmap | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H22.07 | Schedule core and public next/live states 1.0; broader VOD/Shorts/content automation staged per D roadmap | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H22.08 | Schedule core and public next/live states 1.0; broader VOD/Shorts/content automation staged per D roadmap | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H22.09 | Schedule core and public next/live states 1.0; broader VOD/Shorts/content automation staged per D roadmap | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H22.10 | Schedule core and public next/live states 1.0; broader VOD/Shorts/content automation staged per D roadmap | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H22.11 | Schedule core and public next/live states 1.0; broader VOD/Shorts/content automation staged per D roadmap | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H22.12 | Schedule core and public next/live states 1.0; broader VOD/Shorts/content automation staged per D roadmap | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H22.13 | Schedule core and public next/live states 1.0; broader VOD/Shorts/content automation staged per D roadmap | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H22.14 | Schedule core and public next/live states 1.0; broader VOD/Shorts/content automation staged per D roadmap | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H22.15 | Schedule core and public next/live states 1.0; broader VOD/Shorts/content automation staged per D roadmap | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H22.16 | Schedule core and public next/live states 1.0; broader VOD/Shorts/content automation staged per D roadmap | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H22.17 | Schedule core and public next/live states 1.0; broader VOD/Shorts/content automation staged per D roadmap | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H22.18 | Schedule core and public next/live states 1.0; broader VOD/Shorts/content automation staged per D roadmap | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H22.19 | Schedule core and public next/live states 1.0; broader VOD/Shorts/content automation staged per D roadmap | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H23.01 | Basic interaction validation and safe navigation: 1.0 baseline; advanced state machines/timelines/keyframes: 1.x+ | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H23.02 | Basic interaction validation and safe navigation: 1.0 baseline; advanced state machines/timelines/keyframes: 1.x+ | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H23.03 | Basic interaction validation and safe navigation: 1.0 baseline; advanced state machines/timelines/keyframes: 1.x+ | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H23.04 | Basic interaction validation and safe navigation: 1.0 baseline; advanced state machines/timelines/keyframes: 1.x+ | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H23.05 | Basic interaction validation and safe navigation: 1.0 baseline; advanced state machines/timelines/keyframes: 1.x+ | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H23.06 | Basic interaction validation and safe navigation: 1.0 baseline; advanced state machines/timelines/keyframes: 1.x+ | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H23.07 | Basic interaction validation and safe navigation: 1.0 baseline; advanced state machines/timelines/keyframes: 1.x+ | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H23.08 | Basic interaction validation and safe navigation: 1.0 baseline; advanced state machines/timelines/keyframes: 1.x+ | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H23.09 | Basic interaction validation and safe navigation: 1.0 baseline; advanced state machines/timelines/keyframes: 1.x+ | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H23.10 | Basic interaction validation and safe navigation: 1.0 baseline; advanced state machines/timelines/keyframes: 1.x+ | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H23.11 | Basic interaction validation and safe navigation: 1.0 baseline; advanced state machines/timelines/keyframes: 1.x+ | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H23.12 | Basic interaction validation and safe navigation: 1.0 baseline; advanced state machines/timelines/keyframes: 1.x+ | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H23.13 | Basic interaction validation and safe navigation: 1.0 baseline; advanced state machines/timelines/keyframes: 1.x+ | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H23.14 | Basic interaction validation and safe navigation: 1.0 baseline; advanced state machines/timelines/keyframes: 1.x+ | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H23.15 | Basic interaction validation and safe navigation: 1.0 baseline; advanced state machines/timelines/keyframes: 1.x+ | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H23.16 | Basic interaction validation and safe navigation: 1.0 baseline; advanced state machines/timelines/keyframes: 1.x+ | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H23.17 | Basic interaction validation and safe navigation: 1.0 baseline; advanced state machines/timelines/keyframes: 1.x+ | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H23.18 | Basic interaction validation and safe navigation: 1.0 baseline; advanced state machines/timelines/keyframes: 1.x+ | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H23.19 | Basic interaction validation and safe navigation: 1.0 baseline; advanced state machines/timelines/keyframes: 1.x+ | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H23.20 | Basic interaction validation and safe navigation: 1.0 baseline; advanced state machines/timelines/keyframes: 1.x+ | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H24.01 | Semantic structure, labels, keyboard/focus and public baseline: 1.0 release gate; advanced audit tooling: staged | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H24.02 | Semantic structure, labels, keyboard/focus and public baseline: 1.0 release gate; advanced audit tooling: staged | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H24.03 | Semantic structure, labels, keyboard/focus and public baseline: 1.0 release gate; advanced audit tooling: staged | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H24.04 | Semantic structure, labels, keyboard/focus and public baseline: 1.0 release gate; advanced audit tooling: staged | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H24.05 | Semantic structure, labels, keyboard/focus and public baseline: 1.0 release gate; advanced audit tooling: staged | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H24.06 | Semantic structure, labels, keyboard/focus and public baseline: 1.0 release gate; advanced audit tooling: staged | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H24.07 | Semantic structure, labels, keyboard/focus and public baseline: 1.0 release gate; advanced audit tooling: staged | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H24.08 | Semantic structure, labels, keyboard/focus and public baseline: 1.0 release gate; advanced audit tooling: staged | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H24.09 | Semantic structure, labels, keyboard/focus and public baseline: 1.0 release gate; advanced audit tooling: staged | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H24.10 | Semantic structure, labels, keyboard/focus and public baseline: 1.0 release gate; advanced audit tooling: staged | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H24.11 | Semantic structure, labels, keyboard/focus and public baseline: 1.0 release gate; advanced audit tooling: staged | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H24.12 | Semantic structure, labels, keyboard/focus and public baseline: 1.0 release gate; advanced audit tooling: staged | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H24.13 | Semantic structure, labels, keyboard/focus and public baseline: 1.0 release gate; advanced audit tooling: staged | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H25.01 | Title/description/social metadata and crawl baseline: 1.0; advanced redirect/broken-link tooling: scope decision | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H25.02 | Title/description/social metadata and crawl baseline: 1.0; advanced redirect/broken-link tooling: scope decision | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H25.03 | Title/description/social metadata and crawl baseline: 1.0; advanced redirect/broken-link tooling: scope decision | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H25.04 | Title/description/social metadata and crawl baseline: 1.0; advanced redirect/broken-link tooling: scope decision | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H25.05 | Title/description/social metadata and crawl baseline: 1.0; advanced redirect/broken-link tooling: scope decision | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H25.06 | Title/description/social metadata and crawl baseline: 1.0; advanced redirect/broken-link tooling: scope decision | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H25.07 | Title/description/social metadata and crawl baseline: 1.0; advanced redirect/broken-link tooling: scope decision | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H25.08 | Title/description/social metadata and crawl baseline: 1.0; advanced redirect/broken-link tooling: scope decision | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H25.09 | Title/description/social metadata and crawl baseline: 1.0; advanced redirect/broken-link tooling: scope decision | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H25.10 | Title/description/social metadata and crawl baseline: 1.0; advanced redirect/broken-link tooling: scope decision | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H25.11 | Title/description/social metadata and crawl baseline: 1.0; advanced redirect/broken-link tooling: scope decision | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H25.12 | Title/description/social metadata and crawl baseline: 1.0; advanced redirect/broken-link tooling: scope decision | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H26.01 | Privacy/retention contract and minimum useful analytics: scope decision for 1.0; anomaly detection explicitly later | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H26.02 | Privacy/retention contract and minimum useful analytics: scope decision for 1.0; anomaly detection explicitly later | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H26.03 | Privacy/retention contract and minimum useful analytics: scope decision for 1.0; anomaly detection explicitly later | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H26.04 | Privacy/retention contract and minimum useful analytics: scope decision for 1.0; anomaly detection explicitly later | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H26.05 | Privacy/retention contract and minimum useful analytics: scope decision for 1.0; anomaly detection explicitly later | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H26.06 | Privacy/retention contract and minimum useful analytics: scope decision for 1.0; anomaly detection explicitly later | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H26.07 | Privacy/retention contract and minimum useful analytics: scope decision for 1.0; anomaly detection explicitly later | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H26.08 | Privacy/retention contract and minimum useful analytics: scope decision for 1.0; anomaly detection explicitly later | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H26.09 | Privacy/retention contract and minimum useful analytics: scope decision for 1.0; anomaly detection explicitly later | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H26.10 | Privacy/retention contract and minimum useful analytics: scope decision for 1.0; anomaly detection explicitly later | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H26.11 | Privacy/retention contract and minimum useful analytics: scope decision for 1.0; anomaly detection explicitly later | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H26.12 | Privacy/retention contract and minimum useful analytics: scope decision for 1.0; anomaly detection explicitly later | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H27.01 | Only workflows required for 1.0; advanced admin domains staged by roadmap | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H27.02 | Only workflows required for 1.0; advanced admin domains staged by roadmap | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H27.03 | Only workflows required for 1.0; advanced admin domains staged by roadmap | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H27.04 | Only workflows required for 1.0; advanced admin domains staged by roadmap | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H27.05 | Only workflows required for 1.0; advanced admin domains staged by roadmap | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H27.06 | Only workflows required for 1.0; advanced admin domains staged by roadmap | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H27.07 | Only workflows required for 1.0; advanced admin domains staged by roadmap | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H27.08 | Only workflows required for 1.0; advanced admin domains staged by roadmap | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H27.09 | Only workflows required for 1.0; advanced admin domains staged by roadmap | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H27.10 | Only workflows required for 1.0; advanced admin domains staged by roadmap | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H27.11 | Only workflows required for 1.0; advanced admin domains staged by roadmap | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H27.12 | Only workflows required for 1.0; advanced admin domains staged by roadmap | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H27.13 | Only workflows required for 1.0; advanced admin domains staged by roadmap | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H27.14 | Only workflows required for 1.0; advanced admin domains staged by roadmap | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H27.15 | Only workflows required for 1.0; advanced admin domains staged by roadmap | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H27.16 | Only workflows required for 1.0; advanced admin domains staged by roadmap | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H27.17 | Only workflows required for 1.0; advanced admin domains staged by roadmap | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H27.18 | Only workflows required for 1.0; advanced admin domains staged by roadmap | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H27.19 | Only workflows required for 1.0; advanced admin domains staged by roadmap | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H28.01 | Security controls required for 1.0 are release gates; AI-specific boundary applies when AI execution is introduced | 1.0 RELEASE GATE | Block release until targeted positive/negative evidence |
| H28.02 | Security controls required for 1.0 are release gates; AI-specific boundary applies when AI execution is introduced | 1.0 RELEASE GATE | Block release until targeted positive/negative evidence |
| H28.03 | Security controls required for 1.0 are release gates; AI-specific boundary applies when AI execution is introduced | 1.0 RELEASE GATE | Block release until targeted positive/negative evidence |
| H28.04 | Security controls required for 1.0 are release gates; AI-specific boundary applies when AI execution is introduced | 1.0 RELEASE GATE | Block release until targeted positive/negative evidence |
| H28.05 | Security controls required for 1.0 are release gates; AI-specific boundary applies when AI execution is introduced | 1.0 RELEASE GATE | Block release until targeted positive/negative evidence |
| H28.06 | Security controls required for 1.0 are release gates; AI-specific boundary applies when AI execution is introduced | 1.0 RELEASE GATE | Block release until targeted positive/negative evidence |
| H28.07 | Security controls required for 1.0 are release gates; AI-specific boundary applies when AI execution is introduced | 1.0 RELEASE GATE | Block release until targeted positive/negative evidence |
| H28.08 | Security controls required for 1.0 are release gates; AI-specific boundary applies when AI execution is introduced | 1.0 RELEASE GATE | Block release until targeted positive/negative evidence |
| H28.09 | Security controls required for 1.0 are release gates; AI-specific boundary applies when AI execution is introduced | 1.0 RELEASE GATE | Block release until targeted positive/negative evidence |
| H28.10 | Security controls required for 1.0 are release gates; AI-specific boundary applies when AI execution is introduced | 1.0 RELEASE GATE | Block release until targeted positive/negative evidence |
| H28.11 | Security controls required for 1.0 are release gates; AI-specific boundary applies when AI execution is introduced | 1.0 RELEASE GATE | Block release until targeted positive/negative evidence |
| H28.12 | Security controls required for 1.0 are release gates; AI-specific boundary applies when AI execution is introduced | 1.0 RELEASE GATE | Block release until targeted positive/negative evidence |
| H28.13 | Security controls required for 1.0 are release gates; AI-specific boundary applies when AI execution is introduced | 1.0 RELEASE GATE | Block release until targeted positive/negative evidence |
| H28.14 | Security controls required for 1.0 are release gates; AI-specific boundary applies when AI execution is introduced | 1.0 RELEASE GATE | Block release until targeted positive/negative evidence |
| H28.15 | Security controls required for 1.0 are release gates; AI-specific boundary applies when AI execution is introduced | 1.0 RELEASE GATE | Block release until targeted positive/negative evidence |
| H28.16 | Security controls required for 1.0 are release gates; AI-specific boundary applies when AI execution is introduced | 1.0 RELEASE GATE | Block release until targeted positive/negative evidence |
| H28.17 | Security controls required for 1.0 are release gates; AI-specific boundary applies when AI execution is introduced | 1.0 RELEASE GATE | Block release until targeted positive/negative evidence |
| H29.01 | Reliable rollback and minimum recoverability: 1.0 gate; broader backup/export workflows staged only by explicit scope | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H29.02 | Reliable rollback and minimum recoverability: 1.0 gate; broader backup/export workflows staged only by explicit scope | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H29.03 | Reliable rollback and minimum recoverability: 1.0 gate; broader backup/export workflows staged only by explicit scope | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H29.04 | Reliable rollback and minimum recoverability: 1.0 gate; broader backup/export workflows staged only by explicit scope | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H29.05 | Reliable rollback and minimum recoverability: 1.0 gate; broader backup/export workflows staged only by explicit scope | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H29.06 | Reliable rollback and minimum recoverability: 1.0 gate; broader backup/export workflows staged only by explicit scope | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H29.07 | Reliable rollback and minimum recoverability: 1.0 gate; broader backup/export workflows staged only by explicit scope | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H29.08 | Reliable rollback and minimum recoverability: 1.0 gate; broader backup/export workflows staged only by explicit scope | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H29.09 | Reliable rollback and minimum recoverability: 1.0 gate; broader backup/export workflows staged only by explicit scope | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H29.10 | Reliable rollback and minimum recoverability: 1.0 gate; broader backup/export workflows staged only by explicit scope | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H30.01 | Production smoke, critical rendering and autosave performance: 1.0 gates; advanced monitoring/tooling staged | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H30.02 | Production smoke, critical rendering and autosave performance: 1.0 gates; advanced monitoring/tooling staged | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H30.03 | Production smoke, critical rendering and autosave performance: 1.0 gates; advanced monitoring/tooling staged | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H30.04 | Production smoke, critical rendering and autosave performance: 1.0 gates; advanced monitoring/tooling staged | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H30.05 | Production smoke, critical rendering and autosave performance: 1.0 gates; advanced monitoring/tooling staged | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H30.06 | Production smoke, critical rendering and autosave performance: 1.0 gates; advanced monitoring/tooling staged | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H30.07 | Production smoke, critical rendering and autosave performance: 1.0 gates; advanced monitoring/tooling staged | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H30.08 | Production smoke, critical rendering and autosave performance: 1.0 gates; advanced monitoring/tooling staged | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H30.09 | Production smoke, critical rendering and autosave performance: 1.0 gates; advanced monitoring/tooling staged | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H30.10 | Production smoke, critical rendering and autosave performance: 1.0 gates; advanced monitoring/tooling staged | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H30.11 | Production smoke, critical rendering and autosave performance: 1.0 gates; advanced monitoring/tooling staged | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H30.12 | Production smoke, critical rendering and autosave performance: 1.0 gates; advanced monitoring/tooling staged | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H30.13 | Production smoke, critical rendering and autosave performance: 1.0 gates; advanced monitoring/tooling staged | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H30.14 | Production smoke, critical rendering and autosave performance: 1.0 gates; advanced monitoring/tooling staged | SPLIT BASELINE / ADVANCED | Explicitly separate 1.0 minimal acceptance from 1.x+ capabilities |
| H31.00 | Post-1.0 unless explicitly re-scoped by roadmap gate | POST-1.0 / SCOPE GATE | Owner and roadmap approval required before phase commitment |
| H31.01 | Post-1.0 unless explicitly re-scoped by roadmap gate | POST-1.0 / SCOPE GATE | Owner and roadmap approval required before phase commitment |
| H31.02 | Post-1.0 unless explicitly re-scoped by roadmap gate | POST-1.0 / SCOPE GATE | Owner and roadmap approval required before phase commitment |
| H31.03 | Post-1.0 unless explicitly re-scoped by roadmap gate | POST-1.0 / SCOPE GATE | Owner and roadmap approval required before phase commitment |
| H31.04 | Post-1.0 unless explicitly re-scoped by roadmap gate | POST-1.0 / SCOPE GATE | Owner and roadmap approval required before phase commitment |
| H31.05 | Post-1.0 unless explicitly re-scoped by roadmap gate | POST-1.0 / SCOPE GATE | Owner and roadmap approval required before phase commitment |
| H31.06 | Post-1.0 unless explicitly re-scoped by roadmap gate | POST-1.0 / SCOPE GATE | Owner and roadmap approval required before phase commitment |
| H31.07 | Post-1.0 unless explicitly re-scoped by roadmap gate | POST-1.0 / SCOPE GATE | Owner and roadmap approval required before phase commitment |
| H31.08 | Post-1.0 unless explicitly re-scoped by roadmap gate | POST-1.0 / SCOPE GATE | Owner and roadmap approval required before phase commitment |
| H31.09 | Post-1.0 unless explicitly re-scoped by roadmap gate | POST-1.0 / SCOPE GATE | Owner and roadmap approval required before phase commitment |
| H31.10 | Post-1.0 unless explicitly re-scoped by roadmap gate | POST-1.0 / SCOPE GATE | Owner and roadmap approval required before phase commitment |
| H31.11 | Post-1.0 unless explicitly re-scoped by roadmap gate | POST-1.0 / SCOPE GATE | Owner and roadmap approval required before phase commitment |
| H31.12 | Post-1.0 unless explicitly re-scoped by roadmap gate | POST-1.0 / SCOPE GATE | Owner and roadmap approval required before phase commitment |
| H31.13 | Post-1.0 unless explicitly re-scoped by roadmap gate | POST-1.0 / SCOPE GATE | Owner and roadmap approval required before phase commitment |
| H32.01 | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | POST-1.0 / SCOPE GATE | Owner and roadmap approval required before phase commitment |
| H32.02 | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | POST-1.0 / SCOPE GATE | Owner and roadmap approval required before phase commitment |
| H32.03 | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | POST-1.0 / SCOPE GATE | Owner and roadmap approval required before phase commitment |
| H32.04 | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | POST-1.0 / SCOPE GATE | Owner and roadmap approval required before phase commitment |
| H32.05 | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | POST-1.0 / SCOPE GATE | Owner and roadmap approval required before phase commitment |
| H32.06 | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | POST-1.0 / SCOPE GATE | Owner and roadmap approval required before phase commitment |
| H32.07 | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | POST-1.0 / SCOPE GATE | Owner and roadmap approval required before phase commitment |
| H32.08 | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | POST-1.0 / SCOPE GATE | Owner and roadmap approval required before phase commitment |
| H32.09 | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | POST-1.0 / SCOPE GATE | Owner and roadmap approval required before phase commitment |
| H32.10 | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | POST-1.0 / SCOPE GATE | Owner and roadmap approval required before phase commitment |
| H32.11 | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | POST-1.0 / SCOPE GATE | Owner and roadmap approval required before phase commitment |
| H32.12 | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | POST-1.0 / SCOPE GATE | Owner and roadmap approval required before phase commitment |
| H32.13 | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | POST-1.0 / SCOPE GATE | Owner and roadmap approval required before phase commitment |
| H32.14 | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | POST-1.0 / SCOPE GATE | Owner and roadmap approval required before phase commitment |
| H32.15 | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | POST-1.0 / SCOPE GATE | Owner and roadmap approval required before phase commitment |
| H32.16 | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | POST-1.0 / SCOPE GATE | Owner and roadmap approval required before phase commitment |
| H32.17 | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | POST-1.0 / SCOPE GATE | Owner and roadmap approval required before phase commitment |
| H32.18 | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | POST-1.0 / SCOPE GATE | Owner and roadmap approval required before phase commitment |
| H32.19 | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | POST-1.0 / SCOPE GATE | Owner and roadmap approval required before phase commitment |
| H32.20 | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | POST-1.0 / SCOPE GATE | Owner and roadmap approval required before phase commitment |
| H32.21 | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | POST-1.0 / SCOPE GATE | Owner and roadmap approval required before phase commitment |
| H32.22 | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | POST-1.0 / SCOPE GATE | Owner and roadmap approval required before phase commitment |
| H32.23 | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | POST-1.0 / SCOPE GATE | Owner and roadmap approval required before phase commitment |
| H32.24 | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | POST-1.0 / SCOPE GATE | Owner and roadmap approval required before phase commitment |
| H32.25 | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | POST-1.0 / SCOPE GATE | Owner and roadmap approval required before phase commitment |
| H33.00 | Post-1.0 unless a specific 1.0 workflow is explicitly approved | POST-1.0 / SCOPE GATE | Owner and roadmap approval required before phase commitment |
| H33.01 | Post-1.0 unless a specific 1.0 workflow is explicitly approved | POST-1.0 / SCOPE GATE | Owner and roadmap approval required before phase commitment |
| H33.02 | Post-1.0 unless a specific 1.0 workflow is explicitly approved | POST-1.0 / SCOPE GATE | Owner and roadmap approval required before phase commitment |
| H33.03 | Post-1.0 unless a specific 1.0 workflow is explicitly approved | POST-1.0 / SCOPE GATE | Owner and roadmap approval required before phase commitment |
| H33.04 | Post-1.0 unless a specific 1.0 workflow is explicitly approved | POST-1.0 / SCOPE GATE | Owner and roadmap approval required before phase commitment |
| H33.05 | Post-1.0 unless a specific 1.0 workflow is explicitly approved | POST-1.0 / SCOPE GATE | Owner and roadmap approval required before phase commitment |
| H33.06 | Post-1.0 unless a specific 1.0 workflow is explicitly approved | POST-1.0 / SCOPE GATE | Owner and roadmap approval required before phase commitment |
| H33.07 | Post-1.0 unless a specific 1.0 workflow is explicitly approved | POST-1.0 / SCOPE GATE | Owner and roadmap approval required before phase commitment |
| H33.08 | Post-1.0 unless a specific 1.0 workflow is explicitly approved | POST-1.0 / SCOPE GATE | Owner and roadmap approval required before phase commitment |
| H33.09 | Post-1.0 unless a specific 1.0 workflow is explicitly approved | POST-1.0 / SCOPE GATE | Owner and roadmap approval required before phase commitment |
| H33.10 | Post-1.0 unless a specific 1.0 workflow is explicitly approved | POST-1.0 / SCOPE GATE | Owner and roadmap approval required before phase commitment |
| H33.11 | Post-1.0 unless a specific 1.0 workflow is explicitly approved | POST-1.0 / SCOPE GATE | Owner and roadmap approval required before phase commitment |
| H33.12 | Post-1.0 unless a specific 1.0 workflow is explicitly approved | POST-1.0 / SCOPE GATE | Owner and roadmap approval required before phase commitment |
| H34.00 | Always-on governance rule; not a finite feature or permanently closable milestone | PROCESS / NOT A FEATURE | Do not assign independent product PASS |
| H34.01 | Review topic; the canonical owner and D roadmap determine the phase; not a standalone milestone | PROCESS / NOT A FEATURE | Do not assign independent product PASS |
| H34.02 | Benchmark topic; no independent phase or copied third-party implementation | SCOPE DECISION / NO AUTO-PHASE | Owner and roadmap approval required before phase commitment |
| H34.03 | Review topic; scope is determined by the existing responsive/layout owners and D roadmap | PROCESS / NOT A FEATURE | Do not assign independent product PASS |
| H34.04 | Review topic; follow the canonical accessibility scope and D roadmap | PROCESS / NOT A FEATURE | Do not assign independent product PASS |
| H34.05 | Review topic; follow the canonical performance scope and D roadmap | PROCESS / NOT A FEATURE | Do not assign independent product PASS |
| H34.06 | Review topic; canonical Component Registry ownership and D roadmap determine the phase | PROCESS / NOT A FEATURE | Do not assign independent product PASS |
| H34.07 | Review topic; canonical Theme/Design System ownership and D roadmap determine the phase | PROCESS / NOT A FEATURE | Do not assign independent product PASS |
| H34.08 | Review topic; phase depends on the canonical collaboration scope in the D roadmap | PROCESS / NOT A FEATURE | Do not assign independent product PASS |
| H34.09 | Review topic; follow the canonical backup/recovery scope and D roadmap | PROCESS / NOT A FEATURE | Do not assign independent product PASS |
| H34.10 | Review topic; follow the canonical security and AI/automation scope in the D roadmap | PROCESS / NOT A FEATURE | Do not assign independent product PASS |
| H34.11 | Review topic; individual capabilities follow their canonical phase in the D roadmap | PROCESS / NOT A FEATURE | Do not assign independent product PASS |
| H34.12 | Identification step under H34.00; not an independent feature or milestone | PROCESS / NOT A FEATURE | Do not assign independent product PASS |
| H34.13 | Goal/use-case definition step under H34.00; not an independent feature or milestone | PROCESS / NOT A FEATURE | Do not assign independent product PASS |
| H34.14 | Dependency mapping step under H34.00; not an independent feature or milestone | PROCESS / NOT A FEATURE | Do not assign independent product PASS |
| H34.15 | Page Model/data-model review step under H34.00; not an independent feature or milestone | PROCESS / NOT A FEATURE | Do not assign independent product PASS |
| H34.16 | Command/Action contract review step under H34.00; not an independent feature or milestone | PROCESS / NOT A FEATURE | Do not assign independent product PASS |
| H34.17 | Inspector/Canvas/UI review step under H34.00; not an independent feature or milestone | PROCESS / NOT A FEATURE | Do not assign independent product PASS |
| H34.18 | Persistence review step under H34.00; not an independent feature or milestone | PROCESS / NOT A FEATURE | Do not assign independent product PASS |
| H34.19 | Test-planning and test-evidence step under H34.00; not an independent feature or milestone | PROCESS / NOT A FEATURE | Do not assign independent product PASS |
| H34.20 | MASTER recording step under H34.00; not an independent feature or milestone | PROCESS / NOT A FEATURE | Do not assign independent product PASS |
| H34.21 | Implementation step for an approved, separately scoped extension; not a standalone milestone | SCOPE DECISION / NO AUTO-PHASE | Owner and roadmap approval required before phase commitment |
| H34.22 | User-validation step under H34.00; not an independent feature or milestone | PROCESS / NOT A FEATURE | Do not assign independent product PASS |

**Összesítés (271 történeti sor, diszjunkt első körös kategóriák):** `SPLIT BASELINE / ADVANCED` 177; `SCOPE DECISION / NO AUTO-PHASE` 3; `CROSS-CUTTING INVARIANT` 1; `1.0 RELEASE GATE` 17; `POST-1.0 / SCOPE GATE` 52; `PROCESS / NOT A FEATURE` 21. Az automatikus kategorizálásból eredő téves besorolásokat a következő fázisban **forrás + owner + D roadmap** alapján egyedileg kell ellenőrizni; ezek nem lezárt fázis-döntések.

**Nem feloldható rövidítéssel:** H19 média és H20 binding 1.0 minimumát külön kell választani az advanced workflows-tól; H21 Twitch 1.0 kötelezettség nem emeli automatikusan YouTube/TikTok/Discord összes API-ját 1.0-ra; H22 Schedule alap nem teszi automatikusan 1.0-s kötelezettséggé a VOD/Shorts/content automation egészét. H23 alap interakció és H25 publikus SEO/slug/publish kritikus 1.0 gate; H28 security, H29 rollback/recovery és H30 smoke/critical performance külön release-gate. H31–H33 AI/automation és a H34 folyamatos governance nem kap hamis implementációs PASS-t.

**Kritikus blokkolók:** `63.50.46 PUBLICATION CONTRACT CONFLICT / HIGH / NOT FIXED`; `00/A` és `00.9–00.9.6.B` forráshiány; a teljes 271 sor cél-ID/fázis/acceptance szemantikai megfelelésének tesztbizonyítéka hiányzik. Következő aktív kurzor: `63.50.85` — a split/ambiguous phase sorok owner és D roadmap szerinti célzott mélyellenőrzése, valamint történeti forráskeresés. **GLOBAL NOT PASS / FEATURE IMPLEMENTATION FROZEN.**


### 63.50.85. Termékdöntés: az 1.0 mint kötelező célkiadás megszűnik; teljes függőségi fejlesztési sorrend (2026-10-15)

**Felhasználói döntés, elsőbbségi szabály:** a legfrissebb Creator Platform MASTER-ben **nem cél egy külön kötelező „1.0” kiadás**. A cél a **teljes, logikusan főpontokra és alpontokra bontott Creator Platform**, amelyet a függőségek szerinti helyes sorrendben lehet megvalósítani, minden korábbi és újonnan indokolt funkció megőrzésével. A korábbi `1.0`, `1.x+`, `F0` és archív Stage jelölések **történeti fáziscímkék, nem automatikus határidők, kötelező kiadások vagy elhagyási indokok**. Az előző 63.50.84 fázistriage változatlanul megmarad proveniencia céljára, de **nem irányítja a fejlesztési sorrendet**.

**Új kötelező struktúra minden fejlesztési ponthoz:** `Főpont → alpont → konkrét képesség → owner/domain → Admin/Editor/Public surface → kanonikus adat → függőségek → meglévő kód vagy újrahasználható megoldás vizsgálata → implementáció → pozitív/negatív tesztek → elfogadási bizonyíték → következő feloldott pont`. Egy főpont addig nem PASS, amíg a kötelező alpontjai és integrációs határai nincsenek ellenőrizve. Több UI ugyanazt a domain szolgáltatást használja, nem több eltérő állapotot. A Visual Editor csak vizuális szerkesztést birtokol; Resource, Schedule, Integrations, Content, Analytics, AI stb. külön kanonikus modul.

**Függőségi sorrend, nem kiadási verziók:**

| Főpont | Kötelező alpontok és megvalósítási sorrend | Feloldási feltétel |
| --- | --- | --- |
| P00 — Egyetlen terv és történeti teljesség | P00.1 396 stable ID és 271 archív H-ID; P00.2 00/A és 00.9.6.B forrásbizonyíték vagy nyílt hiány; P00.3 domain/surface/owner mátrix; P00.4 54.x katalógus és közös review; P00.5 függőségi gráf és acceptance | Hiány nem törölhető, döntések auditálhatók |
| P01 — Core platform és biztonság | P01.1 site/workspace/role; P01.2 D1/R2 és migráció; P01.3 audit/secret/privacy; P01.4 API/error/event contract; P01.5 teszt/CI/recovery alap | Cross-site, unauthorized és rollback negatív tesztek |
| P02 — Kanonikus erőforrások és design foundation | P02.1 Asset/Resource Manager; P02.2 közös ikon- és tokenrendszer; P02.3 Theme/Brand Kit; P02.4 Template/Component Registry; P02.5 verziózott erőforrás-referenciák | Minden felület ugyanazt az asset/theme/component ID-t használja |
| P03 — Weboldalmodell és vizuális szerkesztés | P03.1 Page Model, navigation, responsive; P03.2 Editor Canvas/Layers/Inspector; P03.3 reusable blocks és binding; P03.4 draft/preview; P03.5 explicit publish, rollback, slug/redirect/SEO; P03.6 publikus renderer | A 63.50.46 HIGH publish konfliktus kijavítva és tesztelve |
| P04 — Streamer és integrációs központ | P04.1 provider registry/secrets; P04.2 Twitch; P04.3 YouTube; P04.4 TikTok; P04.5 Discord; P04.6 provider capability/quota/retry/webhook; P04.7 status/widget data | Provider-specifikus határ és jogosultságok ellenőrzöttek |
| P05 — Schedule, tartalom és médiafolyamatok | P05.1 Schedule/game profiles/timezone; P05.2 VOD/Clips/Shorts; P05.3 Content Factory és platformvariánsok; P05.4 content calendar/approval; P05.5 publikálás és mérés | Egyetlen kanonikus Schedule/Content adatfolyam |
| P06 — OBS, overlay és community | P06.1 OBS connection/control; P06.2 Overlay Studio/widgets; P06.3 alerts/chatbot/moderation; P06.4 közösségi interakciók; P06.5 jogosultság, replay és fallback | Élő parancsok dry-run/role/connection teszttel védettek |
| P07 — Növekedés és üzleti rendszer | P07.1 analytics és attribution; P07.2 campaign/sponsor; P07.3 shop/merch/commerce; P07.4 monetization és payments; P07.5 CRM/marketing | Consent, pénzügyi és adathatár szerződések |
| P08 — Automatizáció és SANCI AI | P08.1 workflow/event engine; P08.2 provider/model/prompt registry; P08.3 context/privacy/permissions; P08.4 creator agents; P08.5 human approval/publish gate; P08.6 AI eval és cost controls | AI nem írhat át kanonikus állapotot vagy publikálhat engedély nélkül |
| P09 — Developer platform, csapat és globális működés | P09.1 public API/SDK/webhooks; P09.2 plugin registry; P09.3 team/collaboration; P09.4 multi-workspace és packages; P09.5 localization/a11y/performance; P09.6 operations/backup | API verziózás, tenant isolation és accessibility bizonyított |
| P10 — Teljes termékellenőrzés | P10.1 domain tesztek; P10.2 cross-module E2E; P10.3 browser/mobile/accessibility; P10.4 production smoke/security/recovery; P10.5 felhasználói funkció-review és elfogadás | Valós evidence; a hiányzó alpontok visszakerülnek a saját ownerhez |

**Nem kizárólag lineáris végrehajtás:** a P01–P09 pontoknál az alpontok konkrét dependency-je számít; pl. a P03 publikus weboldal nem vár a P08 AI-ra, míg a P08 tartalomgenerálás P05 Content és P01 Security szerződésére épül. Az azonos modult használó funkciókat nem duplikáljuk. A részletes végrehajtási soronkénti backlogot a 396 stable ID, 54.x és a történeti crosswalk alapján **még fel kell tölteni**: a fenti táblázat **struktúra- és sorrenddöntés, nem teljes 396 soros végrehajtási bizonyíték**.

**Audit és fejlesztés elkülönítése:** a régi 1.0 kiadási kapuk nem kötelező release-célok; ugyanakkor a security, adatkonzisztencia, explicit publish, recovery és teszt **nem halasztható el ott, ahol az adott funkció működésének feltétele**. A 63.50.46 HIGH publikálási hiba változatlanul `NOT FIXED`. A 00/A és 00.9.6.B hiány változatlanul `OPEN`. Az aktuális auditpont után következő: `63.50.86` — a 396 stable ID részletes P00–P10 fő-/alpont- és dependency-leképezése, a régi 1.0 kényszer nélkül. **PLAN AUDIT IN PROGRESS / NOT PASS.**


### 63.50.86. Mind a 396 stable capability végrehajtási fő-/alpont-leképezése — első teljes dependency registry (2026-10-15)

**Felhasználói döntés alapján:** nincs kötelező 1.0 kiadási cél. A P00–P10 pontok **fejlesztési munkacsomagok**, nem kiadási verziók. A 49. fejezet stable capability tábláinak első, egyedi `ID | képesség` sorait felhasználva **396/396 ID** kapott fő-/alpontot, elsődleges domain-owner munkacsomagot és előfeltételt. A `HTTP-404` tesztgate-címke nem stable feature ID, ezért nem része a 396-nak. A 63.50.85 felhasználói döntés az összes régi 1.0/1.x+ címkét felülírja végrehajtási sorrendként.

**Sorrendi szabály:** előbb az adott capability központi adatgazdája és hozzáférésvédelme, majd a kanonikus szolgáltatás, végül az Admin/Editor/Public többfelületes integrációja és tesztje. A QA és Security keresztmodulú követelményeket **az érintett fejlesztés közben** kell teljesíteni, nem kizárólag P10 végén. Az alábbi csoportos dependency első körös útvonal, a per-ID részletes szerződés még szükséges. A 49. fejezet továbbra is az egyetlen navigációs/owner térkép; ez **nem új Admin menü**.

| Stable ID | Funkció (49. fejezet) | Elsődleges végrehajtási alpont | Munkacsomag / kanonikus owner | Előfeltétel-csoport | Állapot |
| --- | --- | --- | --- | --- | --- |
| ADM-001 | 49.1 / Admin shell | P01.6 | Admin shell, dashboard és navigáció | P01.1, P01.2 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| ADM-002 | 49.1 / Áttekintés | P01.6 | Admin shell, dashboard és navigáció | P01.1, P01.2 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| ADM-003 | 49.1 / Gyorsműveletek | P01.6 | Admin shell, dashboard és navigáció | P01.1, P01.2 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| ADM-004 | 49.1 / Teendők | P01.6 | Admin shell, dashboard és navigáció | P01.1, P01.2 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| ADM-005 | 49.1 / Aktivitás | P01.6 | Admin shell, dashboard és navigáció | P01.1, P01.2 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| ADM-006 | 49.1 / Fejléc keresés | P01.6 | Admin shell, dashboard és navigáció | P01.1, P01.2 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| ADM-007 | 49.1 / Profil és kijelentkezés | P01.6 | Admin shell, dashboard és navigáció | P01.1, P01.2 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| ADM-008 | 49.1 / Közös UI állapotok | P01.6 | Admin shell, dashboard és navigáció | P01.1, P01.2 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| ADM-009 | 49.1 / Navigáció és műveletek | P01.6 | Admin shell, dashboard és navigáció | P01.1, P01.2 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| ADM-010 | 49.1 / Mobil Admin shell | P01.6 | Admin shell, dashboard és navigáció | P01.1, P01.2 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| ADM-011 | 49.1 / Kontextuális súgó | P01.6 | Admin shell, dashboard és navigáció | P01.1, P01.2 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| ADM-012 | 49.1 / Értesítés belépési pont | P01.6 | Admin shell, dashboard és navigáció | P01.1, P01.2 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| ADM-013 | 49.1 / Adatfrissesség | P01.6 | Admin shell, dashboard és navigáció | P01.1, P01.2 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| WEB-001 | Oldallista, létrehozás és szerkesztés | P03.1 | Weboldalmodell, útvonalak és publikus renderer | P01.1, P02.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| WEB-002 | Slug, hierarchia, URL-változás | P03.5 | Weboldalmodell, útvonalak és publikus renderer | P03.4, P03.1, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| WEB-003 | Másolás, archiválás és törlés | P03.1 | Weboldalmodell, útvonalak és publikus renderer | P01.1, P02.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| WEB-004 | Draft/published snapshot | P03.4 | Weboldalmodell, útvonalak és publikus renderer | P01.1, P02.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| WEB-005 | Preview link és hozzáférés | P03.1 | Weboldalmodell, útvonalak és publikus renderer | P01.1, P02.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| WEB-006 | Publikálás előtti validáció | P03.5 | Weboldalmodell, útvonalak és publikus renderer | P03.4, P03.1, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| WEB-007 | Publish/unpublish/rollback | P03.5 | Weboldalmodell, útvonalak és publikus renderer | P03.4, P03.1, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| WEB-008 | Revízió és diff | P03.1 | Weboldalmodell, útvonalak és publikus renderer | P01.1, P02.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| WEB-009 | Navigációs fa | P03.1 | Weboldalmodell, útvonalak és publikus renderer | P01.1, P02.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| WEB-010 | Header/footer globális layout | P03.1 | Weboldalmodell, útvonalak és publikus renderer | P01.1, P02.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| WEB-011 | Mobil menü és billentyűzet | P03.1 | Weboldalmodell, útvonalak és publikus renderer | P01.1, P02.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| WEB-012 | Publikus route és 404 | P03.1 | Weboldalmodell, útvonalak és publikus renderer | P01.1, P02.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| WEB-013 | Redirect és broken-link | P03.5 | Weboldalmodell, útvonalak és publikus renderer | P03.4, P03.1, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| WEB-014 | Nyilvános kezdőlap | P03.1 | Weboldalmodell, útvonalak és publikus renderer | P01.1, P02.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| WEB-015 | Nyilvános live oldal | P03.1 | Weboldalmodell, útvonalak és publikus renderer | P01.1, P02.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| WEB-016 | Nyilvános adásrend | P03.1 | Weboldalmodell, útvonalak és publikus renderer | P01.1, P02.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| WEB-017 | Nyilvános VOD hub | P03.1 | Weboldalmodell, útvonalak és publikus renderer | P01.1, P02.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| WEB-018 | Creator bemutatkozás | P03.1 | Weboldalmodell, útvonalak és publikus renderer | P01.1, P02.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| WEB-019 | Közösségi oldal és CTA | P03.1 | Weboldalmodell, útvonalak és publikus renderer | P01.1, P02.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| WEB-020 | Kapcsolat és űrlap | P03.1 | Weboldalmodell, útvonalak és publikus renderer | P01.1, P02.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| WEB-021 | Creator Resources oldal | P03.1 | Weboldalmodell, útvonalak és publikus renderer | P01.1, P02.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| WEB-022 | Link Hub | P03.1 | Weboldalmodell, útvonalak és publikus renderer | P01.1, P02.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| WEB-023 | Támogatási oldal | P03.1 | Weboldalmodell, útvonalak és publikus renderer | P01.1, P02.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| WEB-024 | Szponzor/Press Kit | P03.1 | Weboldalmodell, útvonalak és publikus renderer | P01.1, P02.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| WEB-025 | Bolt/termékoldalak | P03.1 | Weboldalmodell, útvonalak és publikus renderer | P01.1, P02.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| WEB-026 | Tagsági felület | P03.1 | Weboldalmodell, útvonalak és publikus renderer | P01.1, P02.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| WEB-027 | Esemény/blog/hírek/digitális termék | P03.1 | Weboldalmodell, útvonalak és publikus renderer | P01.1, P02.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| WEB-028 | Hiba/maintenance/offline | P03.1 | Weboldalmodell, útvonalak és publikus renderer | P01.1, P02.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| WEB-029 | Publikus keresés | P03.1 | Weboldalmodell, útvonalak és publikus renderer | P01.1, P02.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| WEB-030 | Cache és invalidáció | P03.1 | Weboldalmodell, útvonalak és publikus renderer | P01.1, P02.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| WEB-031 | Published-only enforcement | P03.1 | Weboldalmodell, útvonalak és publikus renderer | P01.1, P02.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| WEB-032 | Biztonságos renderer/embed | P03.1 | Weboldalmodell, útvonalak és publikus renderer | P01.1, P02.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| EDT-001 | Canonical Page Model schema/version. | P03.2 | Visual Editor Canvas, Layers, Inspector, preview | P03.1, P02.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| EDT-002 | Node IDs and parent/child invariants. | P03.2 | Visual Editor Canvas, Layers, Inspector, preview | P03.1, P02.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| EDT-003 | Command mutation pipeline. | P03.2 | Visual Editor Canvas, Layers, Inspector, preview | P03.1, P02.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| EDT-004 | Transaction/batch/rollback semantics. | P03.2 | Visual Editor Canvas, Layers, Inspector, preview | P03.1, P02.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| EDT-005 | Undo/redo history integrity. | P03.2 | Visual Editor Canvas, Layers, Inspector, preview | P03.1, P02.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| EDT-006 | Selection state synchronization. | P03.2 | Visual Editor Canvas, Layers, Inspector, preview | P03.1, P02.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| EDT-007 | Canvas viewport, zoom, pan and fit. | P03.2 | Visual Editor Canvas, Layers, Inspector, preview | P03.1, P02.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| EDT-008 | Canvas drag/drop. | P03.2 | Visual Editor Canvas, Layers, Inspector, preview | P03.1, P02.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| EDT-009 | Canvas resize/geometry constraints. | P03.2 | Visual Editor Canvas, Layers, Inspector, preview | P03.1, P02.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| EDT-010 | Alignment guides/snap/grid. | P03.2 | Visual Editor Canvas, Layers, Inspector, preview | P03.1, P02.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| EDT-011 | Reorder/reparent/duplicate/delete. | P03.2 | Visual Editor Canvas, Layers, Inspector, preview | P03.1, P02.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| EDT-012 | Layers tree expand/collapse. | P03.2 | Visual Editor Canvas, Layers, Inspector, preview | P03.1, P02.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| EDT-013 | Layers/canvas/Inspector selection sync. | P03.2 | Visual Editor Canvas, Layers, Inspector, preview | P03.1, P02.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| EDT-014 | Layer rename/hide/lock and hierarchy. | P03.2 | Visual Editor Canvas, Layers, Inspector, preview | P03.1, P02.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| EDT-015 | Element/Block Library and search. | P03.2 | Visual Editor Canvas, Layers, Inspector, preview | P03.1, P02.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| EDT-016 | Section/Container/Stack/Row/Columns/Grid. | P03.2 | Visual Editor Canvas, Layers, Inspector, preview | P03.1, P02.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| EDT-017 | Text/Heading/Link/Button/Icon/Divider/Spacer. | P03.2 | Visual Editor Canvas, Layers, Inspector, preview | P03.1, P02.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| EDT-018 | Image/Video/Embed/List/Card/Badge. | P03.2 | Visual Editor Canvas, Layers, Inspector, preview | P03.1, P02.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| EDT-019 | Table/Accordion/Tabs/Form capability. | P03.2 | Visual Editor Canvas, Layers, Inspector, preview | P03.1, P02.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| EDT-020 | Dynamic Sanci block configuration. | P03.2 | Visual Editor Canvas, Layers, Inspector, preview | P03.1, P02.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| EDT-021 | Inspector Property Registry. | P03.2 | Visual Editor Canvas, Layers, Inspector, preview | P03.1, P02.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| EDT-022 | Inspector schema validation and control types. | P03.2 | Visual Editor Canvas, Layers, Inspector, preview | P03.1, P02.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| EDT-023 | Inspector resolved viewport value. | P03.2 | Visual Editor Canvas, Layers, Inspector, preview | P03.1, P02.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| EDT-024 | Responsive override/inheritance/reset. | P03.2 | Visual Editor Canvas, Layers, Inspector, preview | P03.1, P02.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| EDT-025 | Responsive desktop/tablet/mobile preview. | P03.2 | Visual Editor Canvas, Layers, Inspector, preview | P03.1, P02.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| EDT-026 | Responsive visibility/order/column changes. | P03.2 | Visual Editor Canvas, Layers, Inspector, preview | P03.1, P02.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| EDT-027 | Dirty state and explicit Save Draft. | P03.4 | Visual Editor Canvas, Layers, Inspector, preview | P03.1, P02.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| EDT-028 | Save/reload round-trip. | P03.2 | Visual Editor Canvas, Layers, Inspector, preview | P03.1, P02.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| EDT-029 | Revision conflict recovery. | P03.2 | Visual Editor Canvas, Layers, Inspector, preview | P03.1, P02.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| EDT-030 | In-flight edit preservation during save. | P03.2 | Visual Editor Canvas, Layers, Inspector, preview | P03.1, P02.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| EDT-031 | Network failure/retry/local recovery. | P03.2 | Visual Editor Canvas, Layers, Inspector, preview | P03.1, P02.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| EDT-032 | Preview without publishing. | P03.2 | Visual Editor Canvas, Layers, Inspector, preview | P03.1, P02.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| EDT-033 | Explicit publish separate from save. | P03.5 | Visual Editor Canvas, Layers, Inspector, preview | P03.4, P03.1, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| EDT-034 | Public renderer parity with Editor preview. | P03.2 | Visual Editor Canvas, Layers, Inspector, preview | P03.1, P02.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| EDT-035 | Mobile Editor action bar/safe area. | P03.2 | Visual Editor Canvas, Layers, Inspector, preview | P03.1, P02.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| EDT-036 | Mobile Layers/Inspector panel switching. | P03.2 | Visual Editor Canvas, Layers, Inspector, preview | P03.1, P02.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| EDT-037 | Keyboard-accessible canvas alternatives. | P03.2 | Visual Editor Canvas, Layers, Inspector, preview | P03.1, P02.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| EDT-038 | Copy/paste and multi-select where enabled. | P03.2 | Visual Editor Canvas, Layers, Inspector, preview | P03.1, P02.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| EDT-039 | Page-level interaction/action schema registry for Editor-configured page behavior; not the automation engine action catalog. | P03.2 | Visual Editor Canvas, Layers, Inspector, preview | P03.1, P02.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| EDT-040 | Motion/reduced-motion behavior. | P03.2 | Visual Editor Canvas, Layers, Inspector, preview | P03.1, P02.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| EDT-041 | Empty-project onboarding and template start. | P03.2 | Visual Editor Canvas, Layers, Inspector, preview | P03.1, P02.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| EDT-042 | Editor error recovery and no-data-loss guard. | P03.2 | Visual Editor Canvas, Layers, Inspector, preview | P03.1, P02.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| EDT-043 | Advanced Rich Text editor and structured inline/block content; planned after the 1.0 plain-text baseline, gated by schema, safe renderer, accessibility and round-trip tests. | P03.2 | Visual Editor Canvas, Layers, Inspector, preview | P03.1, P02.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| EDT-044 | Per-user Editor workspace preferences (viewport, panel layout, grid and favorites) stored outside the site Page Model. | P03.2 | Visual Editor Canvas, Layers, Inspector, preview | P03.1, P02.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| DSN-001 | Global design token schema. | P02.3 | Design system, themes, templates, components | P02.1, P02.2 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| DSN-002 | Token editor and live preview. | P02.3 | Design system, themes, templates, components | P02.1, P02.2 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| DSN-003 | Token usage/dependency map. | P02.3 | Design system, themes, templates, components | P02.1, P02.2 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| DSN-004 | Global change diff and rollback. | P02.3 | Design system, themes, templates, components | P02.1, P02.2 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| DSN-005 | Theme and brand presets. | P02.3 | Design system, themes, templates, components | P02.1, P02.2 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| DSN-006 | Responsive defaults and breakpoint tokens. | P02.3 | Design system, themes, templates, components | P02.1, P02.2 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| DSN-007 | Typography/font registry. | P02.3 | Design system, themes, templates, components | P02.1, P02.2 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| DSN-008 | Site template library. | P02.3 | Design system, themes, templates, components | P02.1, P02.2 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| DSN-009 | Page template library. | P02.3 | Design system, themes, templates, components | P02.1, P02.2 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| DSN-010 | Section template library. | P02.3 | Design system, themes, templates, components | P02.1, P02.2 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| DSN-011 | Component template library. | P02.3 | Design system, themes, templates, components | P02.1, P02.2 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| DSN-012 | Reusable component/symbol master-instance. | P02.3 | Design system, themes, templates, components | P02.1, P02.2 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| DSN-013 | Variants, slots and explicit overrides. | P02.3 | Design system, themes, templates, components | P02.1, P02.2 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| DSN-014 | Design/template/component versioning, compatibility and migration; excludes AI prompt/template versioning. | P02.3 | Design system, themes, templates, components | P02.1, P02.2 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| DSN-015 | Template import/export. | P02.3 | Design system, themes, templates, components | P02.1, P02.2 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| DSN-016 | Button Registry and global button styles. | P02.3 | Design system, themes, templates, components | P02.1, P02.2 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| DSN-017 | Icon/action registry linkage. | P02.3 | Design system, themes, templates, components | P02.1, P02.2 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| DSN-018 | Future community/marketplace templates. | P02.3 | Design system, themes, templates, components | P02.1, P02.2 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| RES-001 | Canonical asset registry and IDs. | P02.1 | Kanonikus Resource/Asset és média | P01.1, P01.2 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| RES-002 | R2 binary storage and D1 metadata. | P02.1 | Kanonikus Resource/Asset és média | P01.1, P01.2 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| RES-003 | Upload validation/progress/cancel/retry. | P02.1 | Kanonikus Resource/Asset és média | P01.1, P01.2 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| RES-004 | Image preview/thumbnail/variant, crop/resize and optimization pipeline. | P02.1 | Kanonikus Resource/Asset és média | P01.1, P01.2 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| RES-005 | Search/filter/sort/pagination over the canonical asset registry only. | P02.1 | Kanonikus Resource/Asset és média | P01.1, P01.2 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| RES-006 | Asset-library collections/tags/folders; excludes content and product taxonomies. | P02.1 | Kanonikus Resource/Asset és média | P01.1, P01.2 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| RES-007 | Alt text/caption/license/source metadata. | P02.1 | Kanonikus Resource/Asset és média | P01.1, P01.2 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| RES-008 | Asset usage/reference map. | P02.1 | Kanonikus Resource/Asset és média | P01.1, P01.2 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| RES-009 | Replace/archive/delete/restore safety. | P02.1 | Kanonikus Resource/Asset és média | P01.1, P01.2 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| RES-010 | Editor asset picker. | P02.1 | Kanonikus Resource/Asset és média | P01.1, P01.2 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| RES-011 | Icon registry/search/category/preview. | P02.1 | Kanonikus Resource/Asset és média | P01.1, P01.2 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| RES-012 | SVG safety and sanitization. | P02.1 | Kanonikus Resource/Asset és média | P01.1, P01.2 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| RES-013 | Font registry/weight/style/fallback. | P02.1 | Kanonikus Resource/Asset és média | P01.1, P01.2 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| RES-014 | File download authorization/expiry. | P02.1 | Kanonikus Resource/Asset és média | P01.1, P01.2 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| RES-015 | Media diagnostics and broken asset scan. | P02.1 | Kanonikus Resource/Asset és média | P01.1, P01.2 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| RES-016 | Paid/private asset access integration. | P02.1 | Kanonikus Resource/Asset és média | P01.1, P01.2 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| INT-001 | Shared external-provider adapter contract; domain modules such as Store implement their specific workflows through this contract. | P04.1 | Provider registry és adapterek | P01.3, P01.4 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| INT-002 | Integration overview and health. | P04.1 | Provider registry és adapterek | P01.3, P01.4 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| INT-003 | OAuth state/callback/CSRF protection. | P04.1 | Provider registry és adapterek | P01.3, P01.4 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| INT-004 | Token lifecycle/refresh/revoke. | P04.1 | Provider registry és adapterek | P01.3, P01.4 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| INT-005 | Site ownership and connection binding. | P04.1 | Provider registry és adapterek | P01.3, P01.4 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| INT-006 | Scope/permission visibility. | P04.1 | Provider registry és adapterek | P01.3, P01.4 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| INT-007 | Connect/reconnect/disconnect flow. | P04.1 | Provider registry és adapterek | P01.3, P01.4 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| INT-008 | Sync history, retry and provider errors. | P04.1 | Provider registry és adapterek | P01.3, P01.4 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| INT-009 | Rate-limit/quota handling. | P04.1 | Provider registry és adapterek | P01.3, P01.4 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| INT-010 | Twitch OAuth and channel binding. | P04.2 | Provider registry és adapterek | P01.3, P01.4 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| INT-011 | Twitch live/schedule data. | P04.1 | Provider registry és adapterek | P01.3, P01.4 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| INT-012 | Twitch VOD/clip metadata where allowed. | P04.1 | Provider registry és adapterek | P01.3, P01.4 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| INT-013 | YouTube channel/video/live adapter. | P04.3 | Provider registry és adapterek | P01.3, P01.4 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| INT-014 | TikTok capability-gated adapter. | P04.4 | Provider registry és adapterek | P01.3, P01.4 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| INT-015 | Discord bot/guild/channel/role integration. | P04.5 | Provider registry és adapterek | P01.3, P01.4 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| INT-016 | Kick capability-gated adapter. | P04.1 | Provider registry és adapterek | P01.3, P01.4 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| INT-017 | Provider webhook subscription/delivery lifecycle and integration of signature/replay defenses; shared security requirements are defined by SEC-009. | P04.1 | Provider registry és adapterek | P01.3, P01.4 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| INT-018 | External integration/provider capability registry for social, streaming and commerce adapters; excludes AI model/provider configuration. | P04.1 | Provider registry és adapterek | P01.3, P01.4 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| INT-019 | Integration secret redaction and audit. | P04.1 | Provider registry és adapterek | P01.3, P01.4 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| INT-020 | Integration diagnostics and recovery. | P04.1 | Provider registry és adapterek | P01.3, P01.4 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| INT-021 | Future payment/email/commerce adapters. | P04.1 | Provider registry és adapterek | P01.3, P01.4 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| LIV-001 | Normalized live/offline state. | P04.2 | Streamer live-state és provider állapot | P04.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| LIV-002 | Live data freshness/stale indicator. | P04.2 | Streamer live-state és provider állapot | P04.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| LIV-003 | Stream title/category/game/start time. | P04.2 | Streamer live-state és provider állapot | P04.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| LIV-004 | Viewer/follower/subscriber metrics where permitted. | P04.2 | Streamer live-state és provider állapot | P04.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| LIV-005 | Player/embed and offline fallback. | P04.2 | Streamer live-state és provider állapot | P04.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| LIV-006 | Stream event normalization. | P04.2 | Streamer live-state és provider állapot | P04.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| LIV-007 | Stream status in Dashboard and public blocks. | P04.2 | Streamer live-state és provider állapot | P04.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| LIV-008 | Capability-gated multistream destinations and per-provider metadata. | P04.2 | Streamer live-state és provider állapot | P04.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| LIV-009 | Unified Chat read/send permissions, provider labels, moderation state and partial-failure handling. | P04.2 | Streamer live-state és provider állapot | P04.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| LIV-010 | Recording/replay/backup status and retention/cost policy, only where technically supported. | P04.2 | Streamer live-state és provider állapot | P04.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| OBS-001 | Overlay asset and scene metadata. | P06.1 | OBS, overlay és stream-vezérlés | P04.1, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| OBS-002 | OBS secure pairing/connection. | P06.1 | OBS, overlay és stream-vezérlés | P04.1, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| OBS-003 | Scene/stream/recording state where supported. | P06.1 | OBS, overlay és stream-vezérlés | P04.1, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| OBS-004 | Authorized commands and stream markers. | P06.1 | OBS, overlay és stream-vezérlés | P04.1, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| OBS-005 | Browser source configuration. | P06.1 | OBS, overlay és stream-vezérlés | P04.1, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| OBS-006 | Alerts for provider-supported events. | P06.1 | OBS, overlay és stream-vezérlés | P04.1, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| OBS-007 | Chatbot/commands/timers/loyalty/giveaways. | P06.1 | OBS, overlay és stream-vezérlés | P04.1, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| OBS-008 | Test mode, event replay and rate limit. | P06.1 | OBS, overlay és stream-vezérlés | P04.1, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| OBS-009 | Macro Deck or external control adapter. | P06.1 | OBS, overlay és stream-vezérlés | P04.1, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| OBS-010 | Overlay preview/export/version. | P06.1 | OBS, overlay és stream-vezérlés | P04.1, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| SCH-001 | Schedule item CRUD. | P05.1 | Schedule, timezone, game profiles | P01.2, P04.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| SCH-002 | Calendar/list/upcoming/past views with site-scoped search/filter/sort/pagination. | P05.1 | Schedule, timezone, game profiles | P01.2, P04.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| SCH-003 | Timezone and daylight-saving correctness. | P05.1 | Schedule, timezone, game profiles | P01.2, P04.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| SCH-004 | Recurrence and series edit scopes. | P05.1 | Schedule, timezone, game profiles | P01.2, P04.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| SCH-005 | Postponed/cancelled/completed/live states. | P05.1 | Schedule, timezone, game profiles | P01.2, P04.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| SCH-006 | Schedule conflict detection. | P05.1 | Schedule, timezone, game profiles | P01.2, P04.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| SCH-007 | Twitch schedule sync/manual override. | P05.1 | Schedule, timezone, game profiles | P01.2, P04.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| SCH-008 | Sync status/retry/audit. | P05.1 | Schedule, timezone, game profiles | P01.2, P04.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| SCH-009 | Next stream/countdown. | P05.1 | Schedule, timezone, game profiles | P01.2, P04.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| SCH-010 | Canonical public schedule data projection/rendering contract consumed by WEB-016 and Editor schedule blocks. | P05.1 | Schedule, timezone, game profiles | P01.2, P04.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| SCH-011 | Editor block binding/configuration for the canonical schedule projection; schedule data and lifecycle remain owned by SCH-001–010. | P05.1 | Schedule, timezone, game profiles | P01.2, P04.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| SCH-012 | Game Profile CRUD. | P05.1 | Schedule, timezone, game profiles | P01.2, P04.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| SCH-013 | Game artwork/resource linkage. | P05.1 | Schedule, timezone, game profiles | P01.2, P04.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| SCH-014 | Game/content/schedule relationship. | P05.1 | Schedule, timezone, game profiles | P01.2, P04.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| SCH-015 | iCal/export and later notifications. | P05.1 | Schedule, timezone, game profiles | P01.2, P04.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| CNT-001 | Canonical content item schema. | P05.2 | Content Factory, VOD/Shorts és publishing | P02.1, P05.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| CNT-002 | VOD import and metadata. | P05.2 | Content Factory, VOD/Shorts és publishing | P02.1, P05.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| CNT-003 | Clip/highlight/Short management. | P05.2 | Content Factory, VOD/Shorts és publishing | P02.1, P05.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| CNT-004 | YouTube/TikTok video feed. | P05.2 | Content Factory, VOD/Shorts és publishing | P02.1, P05.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| CNT-005 | Content-library tags/categories/collections/playlists; excludes product-catalog taxonomy and asset-library folders. | P05.2 | Content Factory, VOD/Shorts és publishing | P02.1, P05.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| CNT-006 | Search/filter/sort/pagination/bulk actions over canonical content records only. | P05.2 | Content Factory, VOD/Shorts és publishing | P02.1, P05.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| CNT-007 | Duplicate detection and external IDs. | P05.2 | Content Factory, VOD/Shorts és publishing | P02.1, P05.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| CNT-008 | Featured/related content. | P05.2 | Content Factory, VOD/Shorts és publishing | P02.1, P05.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| CNT-009 | Content calendar. | P05.2 | Content Factory, VOD/Shorts és publishing | P02.1, P05.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| CNT-010 | Ideas/drafts/scripts/briefs. | P05.2 | Content Factory, VOD/Shorts és publishing | P02.1, P05.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| CNT-011 | Platform-specific title/description/tag variants. | P05.2 | Content Factory, VOD/Shorts és publishing | P02.1, P05.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| CNT-012 | Thumbnail and media asset workflow. | P05.2 | Content Factory, VOD/Shorts és publishing | P02.1, P05.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| CNT-013 | Publishing queue and schedule. | P05.2 | Content Factory, VOD/Shorts és publishing | P02.1, P05.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| CNT-014 | Publish status/retry/partial success. | P05.2 | Content Factory, VOD/Shorts és publishing | P02.1, P05.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| CNT-015 | Approval workflow and public publish gate. | P05.2 | Content Factory, VOD/Shorts és publishing | P02.1, P05.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| CNT-016 | Campaign linkage and content attribution. | P05.2 | Content Factory, VOD/Shorts és publishing | P02.1, P05.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| CNT-017 | Short-form export preparation. | P05.2 | Content Factory, VOD/Shorts és publishing | P02.1, P05.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| CNT-018 | Content-domain transcript/chapter/highlight artifact metadata and review lifecycle; AI suggestions originate in AI-014 and are stored through the content API. | P05.2 | Content Factory, VOD/Shorts és publishing | P02.1, P05.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| CNT-019 | Editor block binding/configuration for the canonical content feed; content records and publishing lifecycle remain owned by CNT-001–018/020–022. | P05.2 | Content Factory, VOD/Shorts és publishing | P02.1, P05.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| CNT-020 | Canonical published-content public feed/projection and query contract; WEB-017 owns the public page route/shell. | P05.2 | Content Factory, VOD/Shorts és publishing | P02.1, P05.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| CNT-021 | Timeline-based content editing/render pipeline: trim/split/crop/reframe, aspect ratio, audio, captions, transitions, brand overlay and export. | P05.2 | Content Factory, VOD/Shorts és publishing | P02.1, P05.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| CNT-022 | Content rights/consent/expiry/takedown lifecycle for music, video, guests and third-party assets. | P05.2 | Content Factory, VOD/Shorts és publishing | P02.1, P05.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| COM-001 | External community links. | P06.3 | Community, moderáció, audience | P04.1, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| COM-002 | Discord community entry point. | P06.3 | Community, moderáció, audience | P04.1, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| COM-003 | Community posts. | P06.3 | Community, moderáció, audience | P04.1, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| COM-004 | Polls and voting. | P06.3 | Community, moderáció, audience | P04.1, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| COM-005 | Events and RSVP. | P06.3 | Community, moderáció, audience | P04.1, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| COM-006 | Member profiles and follows later. | P06.3 | Community, moderáció, audience | P04.1, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| COM-007 | Comments/reactions later. | P06.3 | Community, moderáció, audience | P04.1, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| COM-008 | Clip submission. | P06.3 | Community, moderáció, audience | P04.1, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| COM-009 | Moderation/report/ban/role. | P06.3 | Community, moderáció, audience | P04.1, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| COM-010 | Badges/reputation/challenges later. | P06.3 | Community, moderáció, audience | P04.1, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| COM-011 | Notifications and delivery status. | P06.3 | Community, moderáció, audience | P04.1, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| COM-012 | Abuse/spam/rate-limit controls. | P06.3 | Community, moderáció, audience | P04.1, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| COM-013 | Community/public-surface member-only visibility gate; consumes entitlement decisions owned by SUP-006. | P06.3 | Community, moderáció, audience | P04.1, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| COM-014 | Founding Supporters opt-in listing. | P06.3 | Community, moderáció, audience | P04.1, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| COM-015 | Email signup/consent/subscriber list. | P06.3 | Community, moderáció, audience | P04.1, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| COM-016 | Segmentation/newsletter/automation. | P06.3 | Community, moderáció, audience | P04.1, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| COM-017 | Unsubscribe/suppression/export/delete. | P06.3 | Community, moderáció, audience | P04.1, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| COM-018 | Public/member/private visibility policy. | P06.3 | Community, moderáció, audience | P04.1, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| COM-019 | Fan account identity, profile/preferences and account export/delete lifecycle. | P06.3 | Community, moderáció, audience | P04.1, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| COM-020 | Community rules, age/content policy and enforcement lifecycle. | P06.3 | Community, moderáció, audience | P04.1, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| STO-001 | Product catalog. | P07.3 | Store, merch, rendelés és fizetés | P01.3, P02.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| STO-002 | Product variants/SKU/price/currency. | P07.3 | Store, merch, rendelés és fizetés | P01.3, P02.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| STO-003 | Product-catalog categories/collections/tags; excludes content-library and asset-library taxonomies. | P07.3 | Store, merch, rendelés és fizetés | P01.3, P02.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| STO-004 | Product media and SEO. | P07.3 | Store, merch, rendelés és fizetés | P01.3, P02.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| STO-005 | Physical/digital/bundle/preorder/limited drop. | P07.3 | Store, merch, rendelés és fizetés | P01.3, P02.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| STO-006 | Inventory/fulfillment abstraction. | P07.3 | Store, merch, rendelés és fizetés | P01.3, P02.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| STO-007 | Storefront listing/detail/search/filter. | P07.3 | Store, merch, rendelés és fizetés | P01.3, P02.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| STO-008 | Store-specific cart/checkout provider adapter; owns checkout workflow integration, while generic provider lifecycle is defined by INT-001. | P07.3 | Store, merch, rendelés és fizetés | P01.3, P02.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| STO-009 | Order lifecycle/payment status. | P07.3 | Store, merch, rendelés és fizetés | P01.3, P02.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| STO-010 | Fulfillment/tracking/cancellation/refund. | P07.3 | Store, merch, rendelés és fizetés | P01.3, P02.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| STO-011 | Coupons/promotions/gift cards. | P07.3 | Store, merch, rendelés és fizetés | P01.3, P02.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| STO-012 | Digital purchase entitlement. | P07.3 | Store, merch, rendelés és fizetés | P01.3, P02.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| STO-013 | Secure download/access delivery. | P07.3 | Store, merch, rendelés és fizetés | P01.3, P02.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| STO-014 | Tax/shipping/VAT/invoice integration review. | P07.3 | Store, merch, rendelés és fizetés | P01.3, P02.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| STO-015 | Customer account/history where needed. | P07.3 | Store, merch, rendelés és fizetés | P01.3, P02.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| STO-016 | Abandoned cart later. | P07.3 | Store, merch, rendelés és fizetés | P01.3, P02.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| STO-017 | Product/collection Editor blocks. | P07.3 | Store, merch, rendelés és fizetés | P01.3, P02.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| STO-018 | Provider webhook idempotency and audit. | P07.3 | Store, merch, rendelés és fizetés | P01.3, P02.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| STO-019 | Merchant-of-record/provider decision. | P07.3 | Store, merch, rendelés és fizetés | P01.3, P02.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| STO-020 | Store analytics. | P07.3 | Store, merch, rendelés és fizetés | P01.3, P02.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| STO-021 | Payment/tax/VAT/invoicing/consumer-rights compliance decision and provider integration gate. | P07.3 | Store, merch, rendelés és fizetés | P01.3, P02.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| SUP-001 | Support/tip links and provider. | P07.4 | Support és membership | P07.3, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| SUP-002 | Donation/tip state where available. | P07.4 | Support és membership | P07.3, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| SUP-003 | Supporter goals and progress. | P07.4 | Support és membership | P07.3, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| SUP-004 | Membership tiers and billing period. | P07.4 | Support és membership | P07.3, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| SUP-005 | Membership perk/entitlement definition; community and public surfaces enforce access through COM-013/COM-018. | P07.4 | Support és membership | P07.3, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| SUP-006 | Entitlement lifecycle. | P07.4 | Support és membership | P07.3, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| SUP-007 | Membership renewal/cancel/failed payment. | P07.4 | Support és membership | P07.3, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| SUP-008 | Refund/chargeback entitlement handling. | P07.4 | Support és membership | P07.3, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| SUP-009 | Discord role sync from entitlement. | P07.4 | Support és membership | P07.3, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| SUP-010 | Supporter history and opt-in public listing. | P07.4 | Support és membership | P07.3, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| SUP-011 | Membership entitlement rules for content/events; COM and WEB surfaces consume these rules without duplicating entitlement state. | P07.4 | Support és membership | P07.3, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| SUP-012 | Member discount/exclusive drop. | P07.4 | Support és membership | P07.3, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| ANL-001 | Analytics event taxonomy/naming/schema governance for measurement and reporting; excludes workflow trigger execution. | P07.1 | Analytics, mérési adat és attribution | P01.2, P04.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| ANL-002 | Privacy-safe web analytics. | P07.1 | Analytics, mérési adat és attribution | P01.2, P04.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| ANL-003 | Stream analytics. | P07.1 | Analytics, mérési adat és attribution | P01.2, P04.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| ANL-004 | Content/platform analytics. | P07.1 | Analytics, mérési adat és attribution | P01.2, P04.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| ANL-005 | Commerce analytics. | P07.1 | Analytics, mérési adat és attribution | P01.2, P04.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| ANL-006 | Community analytics. | P07.1 | Analytics, mérési adat és attribution | P01.2, P04.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| ANL-007 | Date range/comparison/filter/export. | P07.1 | Analytics, mérési adat és attribution | P01.2, P04.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| ANL-008 | Freshness/source/unit/missing-data state. | P07.1 | Analytics, mérési adat és attribution | P01.2, P04.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| ANL-009 | Consent/retention/bot filtering. | P07.1 | Analytics, mérési adat és attribution | P01.2, P04.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| ANL-010 | Anomaly detection, thresholds and explainable alerts. | P07.1 | Analytics, mérési adat és attribution | P01.2, P04.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| CAM-001 | Campaign CRUD/status/goals. | P07.2 | Kampány és sponsor | P07.1, P05.2 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| CAM-002 | Campaign links/UTM/attribution. | P07.2 | Kampány és sponsor | P07.1, P05.2 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| CAM-003 | Campaign asset/content/product relationships. | P07.2 | Kampány és sponsor | P07.1, P05.2 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| CAM-004 | Media kit generation/export. | P07.2 | Kampány és sponsor | P07.1, P05.2 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| CAM-005 | Brand lead/deal/rate card. | P07.2 | Kampány és sponsor | P07.1, P05.2 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| CAM-006 | Deliverables/deadlines/reminders. | P07.2 | Kampány és sponsor | P07.1, P05.2 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| CAM-007 | Sponsor campaign analytics. | P07.2 | Kampány és sponsor | P07.1, P05.2 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| CAM-008 | Private business documents and permission. | P07.2 | Kampány és sponsor | P07.1, P05.2 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| CAM-009 | Invoice/payment status only after business/legal review. | P07.2 | Kampány és sponsor | P07.1, P05.2 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| AUT-001 | Automation trigger-event catalog and event-to-workflow routing contract; consumes domain events and does not define analytics measurement taxonomy. | P08.1 | Workflow engine, trigger és action | P01.4, P04.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| AUT-002 | Trigger catalogue. | P08.1 | Workflow engine, trigger és action | P01.4, P04.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| AUT-003 | Condition/filter rules. | P08.1 | Workflow engine, trigger és action | P01.4, P04.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| AUT-004 | Automation action catalog and server-side permission checks for workflow execution; page interaction schemas remain in EDT-039. | P08.1 | Workflow engine, trigger és action | P01.4, P04.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| AUT-005 | Delay/schedule and timezone. | P08.1 | Workflow engine, trigger és action | P01.4, P04.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| AUT-006 | Idempotency/deduplication. | P08.1 | Workflow engine, trigger és action | P01.4, P04.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| AUT-007 | Retry/backoff/dead-letter. | P08.1 | Workflow engine, trigger és action | P01.4, P04.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| AUT-008 | Automation execution/run history and workflow-specific diagnostics; security/privacy audit events are owned by SEC-010. | P08.1 | Workflow engine, trigger és action | P01.4, P04.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| AUT-009 | Dry-run/preview/approval. | P08.1 | Workflow engine, trigger és action | P01.4, P04.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| AUT-010 | Enable/pause/version/clone. | P08.1 | Workflow engine, trigger és action | P01.4, P04.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| AUT-011 | Cycle detection and rate limits. | P08.1 | Workflow engine, trigger és action | P01.4, P04.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| AUT-012 | Provider outage and recovery. | P08.1 | Workflow engine, trigger és action | P01.4, P04.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| AUT-013 | Automation templates. | P08.1 | Workflow engine, trigger és action | P01.4, P04.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| AUT-014 | Safe cross-domain actions. | P08.1 | Workflow engine, trigger és action | P01.4, P04.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| AI-001 | AI model/provider registry, model capabilities and lifecycle; excludes external social/streaming integration capabilities in INT-018. | P08.2 | SANCI AI model, context és agents | P08.1, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| AI-002 | AI prompt/instruction template versioning and evaluation; excludes visual design and page-template lifecycle in DSN-014. | P08.2 | SANCI AI model, context és agents | P08.1, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| AI-003 | Intent and task planner. | P08.2 | SANCI AI model, context és agents | P08.1, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| AI-004 | Context selection and privacy filter. | P08.3 | SANCI AI model, context és agents | P08.1, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| AI-005 | Structured action schema. | P08.2 | SANCI AI model, context és agents | P08.1, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| AI-006 | Permission/ownership checker. | P08.2 | SANCI AI model, context és agents | P08.1, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| AI-007 | Diff/preview/approval workflow. | P08.2 | SANCI AI model, context és agents | P08.1, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| AI-008 | Execute through canonical API/commands. | P08.2 | SANCI AI model, context és agents | P08.1, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| AI-009 | Verification/audit/version/rollback. | P08.2 | SANCI AI model, context és agents | P08.1, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| AI-010 | Cost/quota/usage/error tracking. | P08.2 | SANCI AI model, context és agents | P08.1, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| AI-011 | Website structure/content assistant. | P08.2 | SANCI AI model, context és agents | P08.1, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| AI-012 | SEO/accessibility/localization suggestions. | P08.2 | SANCI AI model, context és agents | P08.1, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| AI-013 | Content title/script/description/thumbnail brief. | P08.4 | SANCI AI model, context és agents | P08.1, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| AI-014 | AI-generated transcript/chapter/highlight/clip candidates with source timestamps and confidence; does not own canonical content records or rights metadata. | P08.2 | SANCI AI model, context és agents | P08.1, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| AI-015 | Stream diagnostics/summary where supported. | P08.2 | SANCI AI model, context és agents | P08.1, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| AI-016 | Specialist agent roles under shared permissions. | P08.2 | SANCI AI model, context és agents | P08.1, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| AI-017 | AI Control Center and approval queue. | P08.2 | SANCI AI model, context és agents | P08.1, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| AI-018 | Prompt injection and untrusted content tests. | P08.2 | SANCI AI model, context és agents | P08.1, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| AI-019 | Human approval for public/destructive/financial action. | P08.5 | SANCI AI model, context és agents | P08.1, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| AI-020 | AI-free fallback for all critical manual workflows. | P08.2 | SANCI AI model, context és agents | P08.1, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| AI-021 | Multimodal image/audio/video generation provider adapters, rights/safety checks, cost controls and human review. | P08.2 | SANCI AI model, context és agents | P08.1, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| SEC-001 | Authentication/session lifecycle. | P01.3 | Security, privacy, RBAC és secrets | P01.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| SEC-002 | Server-side RBAC and ownership. | P01.3 | Security, privacy, RBAC és secrets | P01.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| SEC-003 | Cross-domain server-side site/workspace/tenant isolation invariant; TEAM-001/TEAM-005 provide workspace selection and multi-site workflows but do not replace authorization. | P01.3 | Security, privacy, RBAC és secrets | P01.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| SEC-004 | OAuth/CSRF/session security. | P01.3 | Security, privacy, RBAC és secrets | P01.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| SEC-005 | XSS/sanitization/safe embeds. | P01.3 | Security, privacy, RBAC és secrets | P01.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| SEC-006 | SSRF/open redirect/injection defenses. | P01.3 | Security, privacy, RBAC és secrets | P01.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| SEC-007 | Rate limiting and abuse protection. | P01.3 | Security, privacy, RBAC és secrets | P01.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| SEC-008 | Secret storage/redaction/rotation. | P01.3 | Security, privacy, RBAC és secrets | P01.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| SEC-009 | Cross-domain webhook signature/replay security requirement and negative-test contract; provider-specific implementation is owned by INT-017. | P01.3 | Security, privacy, RBAC és secrets | P01.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| SEC-010 | Cross-domain security/privacy audit events and redaction/retention controls; workflow execution detail remains in AUT-008. | P01.3 | Security, privacy, RBAC és secrets | P01.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| SEC-011 | Consent/retention/export/delete. | P01.3 | Security, privacy, RBAC és secrets | P01.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| SEC-012 | MFA/2FA and future SSO lifecycle, recovery and suspicious-authentication controls. | P01.3 | Security, privacy, RBAC és secrets | P01.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| OPS-001 | Health/deploy version. | P01.5 | Operations, backup, recovery | P01.2, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| OPS-002 | Structured logs/correlation IDs. | P01.5 | Operations, backup, recovery | P01.2, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| OPS-003 | Error tracking/alerting. | P01.5 | Operations, backup, recovery | P01.2, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| OPS-004 | Migration preflight/integrity. | P01.5 | Operations, backup, recovery | P01.2, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| OPS-005 | Operational backup/export/restore capability and runbook; QA-007 only verifies it through tests/evidence. | P01.5 | Operations, backup, recovery | P01.2, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| OPS-006 | Recovery drill and runbook. | P01.5 | Operations, backup, recovery | P01.2, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| OPS-007 | Diagnostics report. | P01.5 | Operations, backup, recovery | P01.2, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| OPS-008 | Performance baseline/cache/query monitoring. | P01.5 | Operations, backup, recovery | P01.2, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| OPS-009 | Rollback and incident procedure. | P01.5 | Operations, backup, recovery | P01.2, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| OPS-010 | Dependency/license/CVE review. | P01.5 | Operations, backup, recovery | P01.2, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| OPS-011 | Background-job/realtime runtime selection and lifecycle, only where justified. | P01.5 | Operations, backup, recovery | P01.2, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| LOC-001 | Translation key/fallback. | P09.5 | Lokalizáció és hozzáférhetőség | P03.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| LOC-002 | Locale-aware dates/numbers/currency/timezone. | P09.5 | Lokalizáció és hozzáférhetőség | P03.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| LOC-003 | Page/content/navigation translation. | P09.5 | Lokalizáció és hozzáférhetőség | P03.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| LOC-004 | Localized SEO/hreflang/canonical. | P09.5 | Lokalizáció és hozzáférhetőség | P03.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| LOC-005 | Translation completeness status, locale preview and safe publish policy. | P09.5 | Lokalizáció és hozzáférhetőség | P03.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| LOC-006 | AI-assisted translation workflow with explicit human review/approval and audit. | P09.5 | Lokalizáció és hozzáférhetőség | P03.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| TEAM-001 | Workspace/site switcher UI and active-scope selection; server-side isolation and authorization remain owned by SEC-002–003. | P09.3 | Csapat, collaboration és tenant | P01.1, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| TEAM-002 | Invite/accept/revoke. | P09.3 | Csapat, collaboration és tenant | P01.1, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| TEAM-003 | Roles and granular permissions. | P09.3 | Csapat, collaboration és tenant | P01.1, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| TEAM-004 | Approval/review/activity feed. | P09.3 | Csapat, collaboration és tenant | P01.1, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| TEAM-005 | Multi-site workspace/product workflows; isolation enforcement is a security invariant owned by SEC-003. | P09.3 | Csapat, collaboration és tenant | P01.1, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| TEAM-006 | SaaS billing/plan entitlements/quota. | P09.3 | Csapat, collaboration és tenant | P01.1, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| TEAM-007 | Agency/studio client workspaces, shared templates, client-scoped brand and approval workflow. | P09.3 | Csapat, collaboration és tenant | P01.1, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| MKT-001 | Extension manifest/permissions. | P07.5 | Marketing és növekedés | P07.1, P05.2 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| MKT-002 | Extension install/update/uninstall/migration. | P07.5 | Marketing és növekedés | P07.1, P05.2 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| MKT-003 | Theme/block/template/overlay marketplace. | P07.5 | Marketing és növekedés | P07.1, P05.2 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| MKT-004 | License/attribution/version/review. | P07.5 | Marketing és növekedés | P07.1, P05.2 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| MKT-005 | Marketplace payment/revenue-share after legal review. | P07.5 | Marketing és növekedés | P07.1, P05.2 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| QA-001 | Typecheck/build/CI gates. | P10.1 | Teszt és evidence gates (keresztmodul) | P01.5 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| QA-002 | Domain/API/integration tests. | P10.1 | Teszt és evidence gates (keresztmodul) | P01.5 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| QA-003 | Ownership/security negative tests. | P10.1 | Teszt és evidence gates (keresztmodul) | P01.5 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| QA-004 | Browser/device responsive and visual-regression acceptance. | P10.1 | Teszt és evidence gates (keresztmodul) | P01.5 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| QA-005 | Public SEO/accessibility/performance audit. | P10.1 | Teszt és evidence gates (keresztmodul) | P01.5 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| QA-006 | Production smoke and runtime verification. | P10.1 | Teszt és evidence gates (keresztmodul) | P01.5 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| QA-007 | Test/acceptance gate and evidence for backup/restore/rollback; does not implement backup operations. | P10.1 | Teszt és evidence gates (keresztmodul) | P01.5 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| QA-008 | End-to-end creator journey. | P10.2 | Teszt és evidence gates (keresztmodul) | P01.5 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| QA-009 | User acceptance and evidence log. | P10.5 | Teszt és evidence gates (keresztmodul) | P01.5 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| QA-010 | Continuous benchmark and feature-discovery review. | P10.1 | Teszt és evidence gates (keresztmodul) | P01.5 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| SET-001 | Canonical site settings schema és CRUD lifecycle. | P01.1 | Workspace/site settings és alapadat | P01.2 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| SET-002 | Site ownership/scope és multi-site kompatibilitás. | P01.1 | Workspace/site settings és alapadat | P01.2 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| SET-003 | Public-safe settings projection és secret/private mezők kizárása. | P01.1 | Workspace/site settings és alapadat | P01.2 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| SET-004 | Custom domain lifecycle, verification, DNS/SSL status, primary-domain transition and canonical URL. | P01.1 | Workspace/site settings és alapadat | P01.2 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| DYN-001 | Canonical data source registry és provider/domain adapter. | P03.3 | Dinamikus binding és cache | P03.1, P05.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| DYN-002 | Binding schema, type validation és resource/field compatibility. | P03.3 | Dinamikus binding és cache | P03.1, P05.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| DYN-003 | Whitelisted filter/sort/transform/limit/pagination for bound data queries; not a replacement for module-specific library search. | P03.3 | Dinamikus binding és cache | P03.1, P05.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| DYN-004 | Feltételes rendering és adatfüggő visibility. | P03.3 | Dinamikus binding és cache | P03.1, P05.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| DYN-005 | Runtime state machine for dynamic data bindings (loading/empty/error/partial/stale); shared visual presentation may use ADM-008. | P03.3 | Dinamikus binding és cache | P03.1, P05.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| DYN-006 | Cache policy, freshness, invalidation és stale fallback. | P03.3 | Dinamikus binding és cache | P03.1, P05.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| DYN-007 | Permission, site scope és published-only data boundary. | P03.3 | Dinamikus binding és cache | P03.1, P05.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| DYN-008 | Binding diagnostics, preview, invalid-reference report és recovery. | P03.3 | Dinamikus binding és cache | P03.1, P05.1 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| SEO-001 | Per-page title, description, canonical URL és robots policy. | P03.5 | SEO, canonical, sitemap, robots | P03.4, P03.1, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| SEO-002 | Open Graph, X/Twitter card és social preview/image validation. | P03.5 | SEO, canonical, sitemap, robots | P03.4, P03.1, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| SEO-003 | Validált structured data/schema.org, ahol releváns. | P03.5 | SEO, canonical, sitemap, robots | P03.4, P03.1, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| SEO-004 | Sitemap és robots.txt lifecycle, publish/cache invalidation. | P03.5 | SEO, canonical, sitemap, robots | P03.4, P03.1, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| SEO-005 | SEO preview/diagnostics, duplicate/missing metadata és page-level audit. | P03.5 | SEO, canonical, sitemap, robots | P03.4, P03.1, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| DEV-001 | Public API reference, versioning, schema and deprecation policy. | P09.1 | Developer API, schema, webhook | P01.4, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| DEV-002 | API key creation, scoped permissions, one-time display, rotation, expiry and revocation. | P09.1 | Developer API, schema, webhook | P01.4, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| DEV-003 | Webhook registry/tester, delivery log, signature validation and replay/retry diagnostics. | P09.1 | Developer API, schema, webhook | P01.4, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| DEV-004 | Sandbox workspace and safe test fixtures/events. | P09.1 | Developer API, schema, webhook | P01.4, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| DEV-005 | SDK/client libraries, integration examples and version compatibility. | P09.1 | Developer API, schema, webhook | P01.4, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| DEV-006 | Developer quotas, rate-limit visibility and API usage diagnostics. | P09.1 | Developer API, schema, webhook | P01.4, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| SEARCH-001 | Permission-aware global search over canonical domain projections. | P09.6 | Globális keresés és index | P01.2, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| SEARCH-002 | Command palette and quick-action routing to canonical module commands. | P09.6 | Globális keresés és index | P01.2, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| SEARCH-003 | Saved views, favorites, recent items and per-user list preferences. | P09.6 | Globális keresés és index | P01.2, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| SEARCH-004 | Index freshness, permission/site invalidation and deletion propagation. | P09.6 | Globális keresés és index | P01.2, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| SEARCH-005 | Module-scoped search filters and safe result snippets. | P09.6 | Globális keresés és index | P01.2, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| NTF-001 | In-app notification center, read/unread and source-module navigation. | P09.7 | Értesítés és feladatjelzés | P01.4, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| NTF-002 | Delivery channel adapters and truthful sent/delivered/failed states. | P09.7 | Értesítés és feladatjelzés | P01.4, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| NTF-003 | User preferences, digest, quiet hours and channel opt-in/out. | P09.7 | Értesítés és feladatjelzés | P01.4, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| NTF-004 | Idempotent event-to-notification mapping, deduplication and bounded retry. | P09.7 | Értesítés és feladatjelzés | P01.4, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| NTF-005 | Unsubscribe, retention and privacy-safe notification payload. | P09.7 | Értesítés és feladatjelzés | P01.4, P01.3 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| HELP-001 | Contextual help mapping to module/field and current feature limitations. | P09.8 | Onboarding és súgó | P01.6 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| HELP-002 | Interactive onboarding progress, skip/restart and role/site-scoped steps. | P09.8 | Onboarding és súgó | P01.6 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| HELP-003 | Searchable glossary, versioned documentation and canonical feature references. | P09.8 | Onboarding és súgó | P01.6 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |
| HELP-004 | Troubleshooting/feedback flow with diagnostic IDs and automatic sensitive-data redaction. | P09.8 | Onboarding és súgó | P01.6 | SPEC/IMPLEMENTATION/TEST evidence OPEN — check per ID |

**Kritikus külön alpontok:** P03.4 draft/preview, P03.5 explicit publish/slug/SEO, P03.6 public renderer; a `63.50.46` HIGH publikálási konfliktus kijavítása P03.5 tényleges implementációs blokkolója. A P04.2–P04.5 provider-specifikus integrációk, P08.3 privacy és P08.5 human approval, P10.2 cross-module E2E és P10.5 felhasználói acceptance elkülönülnek a gyűjtőmoduloktól. A Visual Editor nem válik más domainek adatgazdájává.

**Minőségkapu:** `396/396 PRIMARY WORK PACKAGE ASSIGNED`, `0 UNMAPPED STABLE IDs`. Ez **strukturális mapping**, nem 396 darab implementációs PASS. A 271 történeti H-ID forráshű mezői és 436 target linkje továbbra is a 63.50.79–84/63.50.83 alatt ellenőrizhető. A `00/A`, `00.9–00.9.6.B` eredeti források hiánya és a `63.50.46` HIGH konfliktus továbbra is OPEN.

**Következő kurzor:** `63.50.87` — a gyűjtő alpontok finom bontása és minden ID konkrét pozitív/negatív acceptance + függőségi gráfja, a 54.x katalógus és H19–H34 egyeztetésével. **PLAN IN PROGRESS / NOT PASS.**


