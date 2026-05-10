# M-Series Upgrade Rollout Plan (M6 → M10)

## Purpose
Add the white-label rollout path for Anu into the existing M-series upgrades, with explicit implementation slices and launch gates.

## Current Baseline (as of latest checks)
- Build: ✅ pass (`npm run build`)
- Unit tests: ✅ pass (`67/67`)
- Lint: ⚠️ warnings only (`0 errors`)
- E2E: ❌ not fully green (`4/40` failed due to strict selector ambiguity)
- White-label architecture: ❌ not implemented (single-tenant, Mudyin values hardcoded across metadata/content/routes)

---

## Milestone Sequence

## M6 — Test/Quality Hardening (Required)
**Goal:** stabilize core platform before tenant work.

### Slices
- **M6-S01: E2E Stability Fixes**
  - Fix ambiguous Playwright selectors (`Community Feed` strict locator conflict)
  - Harden Playwright webServer execution context to avoid `tailwindcss` resolution drift
  - Ensure deterministic local run (`npm run test:e2e`) and CI run
- **M6-S02: Frontend Runtime Cleanups**
  - Remove noisy runtime error paths (unauthenticated notification fetch behavior)
  - Ensure DB-unavailable demo fallback behavior is consistent and non-spammy in logs

### Exit Criteria
- `npm run test:e2e`: 100% pass on target browsers
- No recurring server crash during smoke runs
- No blocker-level console/runtime errors on priority pages

---

## M7 — Safety/Operations Hardening (Required)
**Goal:** production-safe moderation and observability behavior.

### Slices
- **M7-S01: Moderation Reliability**
  - Verify report/queue workflows with DB available and unavailable
  - Ensure predictable status codes/messages for moderation APIs
- **M7-S02: Operational Readiness**
  - Alerting/logging signal cleanup for release confidence
  - Backup/restore runbook checks for moderation and community data

### Exit Criteria
- Moderation critical-path tests pass
- Escalation/fallback paths verified with evidence

---

## M8 — Compliance + Launch Gate (Required)
**Goal:** complete launch controls before multi-tenant expansion.

### Slices
- **M8-S01: Checklist Closure**
  - Complete `docs/DEPLOYMENT_CHECKLIST.md` release-critical items
  - Confirm accessibility, performance, legal/comms handoff items are signed
- **M8-S02: Pre-Prod Verification**
  - Staging validation across priority journeys
  - Release decision (go/hold) with recorded risks

### Exit Criteria
- Deployment checklist release-critical items closed
- Formal go/hold decision documented

---

## M9 — White-Label Foundation (New, Required)
**Goal:** convert from single-tenant Mudyin to tenant-aware platform architecture.

### Slices
- **M9-S01: Tenant Resolution Layer**
  - Add host/domain → tenant resolution (middleware or request resolver)
  - Add safe default tenant and unknown-host handling
- **M9-S02: Brand Configuration System**
  - Extract hardcoded brand values into typed tenant config
  - Include: metadata, domain/base URL, legal contacts, social links, site copy anchors
- **M9-S03: Tenant-Aware Platform Surfaces**
  - Make `layout` metadata, robots, sitemap, contact routing, and legal pages tenant-aware
  - Keep existing Mudyin outputs unchanged under Mudyin domain
- **M9-S04: Theme & Asset Segmentation**
  - Tokenize brand theming and map per tenant
  - Support tenant logos/OG assets without code duplication

### Exit Criteria
- Platform runs at least 2 tenants from same codebase
- Domain/host switches branding + metadata + legal/contact surfaces correctly
- Mudyin behavior unchanged on its domain (backward compatibility)

---

## M10 — Anu Tenant Rollout (New, Required)
**Goal:** onboard Anu as first white-label tenant and certify go-live readiness.

### Slices
- **M10-S01: Anu Tenant Pack**
  - Create `anu` tenant config (name, domain, legal metadata, contact matrix, social, assets)
  - Validate copy and policy links for Anu context
- **M10-S02: Anu UI/Content QA**
  - Cross-device QA and accessibility checks under Anu tenant host
  - Verify all critical user journeys render Anu branding and links only
- **M10-S03: Anu Launch Readiness**
  - Tenant-specific smoke + E2E run
  - Rollback plan and launch checklist sign-off

### Exit Criteria
- Anu tenant passes release checklist and QA gates
- No Mudyin regression from tenantization changes

---

## Dependencies and Order
1. **M6 → M7 → M8** must complete first (stability/compliance baseline)
2. **M9** depends on M6-M8 completion
3. **M10** depends on M9 completion

---

## Risk Notes
- Tenant extraction touches global surfaces (metadata, routing, legal pages): regression risk is high without E2E coverage.
- Keep Mudyin as reference tenant during migration; verify parity after each M9 slice.
- Avoid mixing feature additions with tenant extraction in same slice.

---

## Execution Plan Reference
For task-level execution detail (tasks, files, dependencies, estimates, verification), use:
- `docs/M9_M10_TASK_PLAN.md`

## Rollout Decision Rule
**Anu is white-label ready only when:**
- M6, M7, M8 exit criteria are met, and
- M9 (white-label foundation) exit criteria are met, and
- M10 (Anu tenant) exit criteria are met.
