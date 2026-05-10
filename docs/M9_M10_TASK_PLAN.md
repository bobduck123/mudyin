# M9–M10 Task Plan (White-Label Foundation + Anu Tenant)

## Scope
Concrete execution plan for:
- **M9** White-label foundation
- **M10** Anu tenant rollout

Each task includes target files, implementation output, dependencies, estimate, and verification.

---

## M9-S01 — Tenant Resolution Layer

### M9-S01-T01 — Define tenant core types
- **Estimate:** 0.5 day
- **Files:**
  - `src/lib/tenants/types.ts` (new)
- **Deliverables:**
  - `TenantId` union (`'mudyin' | 'anu'`)
  - `ResolvedTenant` type
  - `TenantConfig` interface (base shape only; full content in M9-S02)
- **Depends on:** none
- **Verify:** `npm run build`

### M9-S01-T02 — Implement host resolver
- **Estimate:** 0.75 day
- **Files:**
  - `src/lib/tenants/resolve-tenant.ts` (new)
- **Deliverables:**
  - `normalizeHost(host)` helper
  - `resolveTenantByHost(host)` with localhost/port handling
  - unknown-host fallback semantics (`isKnownHost=false`)
- **Depends on:** T01
- **Verify:** `npm run build`

### M9-S01-T03 — Server-side tenant accessor
- **Estimate:** 0.5 day
- **Files:**
  - `src/lib/tenants/request-tenant.ts` (new)
- **Deliverables:**
  - `getCurrentTenant()` using `headers()` + resolver
  - safe fallback on missing host
- **Depends on:** T02
- **Verify:** `npm run build`

### M9-S01-T04 — Resolver unit tests
- **Estimate:** 0.75 day
- **Files:**
  - `src/lib/tenants/__tests__/resolve-tenant.test.ts` (new)
- **Deliverables:**
  - test matrix: known hosts, localhost, unknown host, host with port
- **Depends on:** T02
- **Verify:** `npm test -- resolve-tenant.test.ts`

---

## M9-S02 — Brand Configuration System

### M9-S02-T01 — Create tenant config registry
- **Estimate:** 1 day
- **Files:**
  - `src/lib/tenants/config.ts` (new)
- **Deliverables:**
  - typed `TENANT_CONFIG`
  - full Mudyin config entry
  - placeholder Anu config entry (minimal, completed in M10-S01)
- **Depends on:** M9-S01-T01
- **Verify:** `npm run build`

### M9-S02-T02 — Config accessor utilities
- **Estimate:** 0.5 day
- **Files:**
  - `src/lib/tenants/get-tenant-config.ts` (new)
- **Deliverables:**
  - `getTenantConfig(id)`
  - `getCurrentTenantConfig()`
- **Depends on:** T01 + M9-S01-T03
- **Verify:** `npm run build`

### M9-S02-T03 — Replace global hardcoded site identity source
- **Estimate:** 1 day
- **Files:**
  - `src/lib/data.ts`
- **Deliverables:**
  - move `siteConfig` identity values behind tenant-aware accessor or adapter
  - retain backward-compatible API for existing callsites
- **Depends on:** T02
- **Verify:** `npm run lint && npm run build`

### M9-S02-T04 — Config validation tests
- **Estimate:** 0.5 day
- **Files:**
  - `src/lib/tenants/__tests__/config.test.ts` (new)
- **Deliverables:**
  - assert required keys per tenant
  - assert domain uniqueness
- **Depends on:** T01
- **Verify:** `npm test -- config.test.ts`

---

## M9-S03 — Tenant-Aware Platform Surfaces

### M9-S03-T01 — Tenant-aware app metadata/layout
- **Estimate:** 1 day
- **Files:**
  - `src/app/layout.tsx`
- **Deliverables:**
  - metadata built from current tenant config
  - `metadataBase`, title template, OG, publisher/creator tenant-aware
- **Depends on:** M9-S02-T02
- **Verify:** `npm run build`

### M9-S03-T02 — Tenant-aware robots/sitemap
- **Estimate:** 0.5 day
- **Files:**
  - `src/app/robots.ts`
  - `src/app/sitemap.ts`
- **Deliverables:**
  - host/base URL resolved from tenant config
- **Depends on:** T01
- **Verify:** `npm run build`

### M9-S03-T03 — Tenant-aware contact API routing
- **Estimate:** 0.75 day
- **Files:**
  - `src/app/api/contact/route.ts`
- **Deliverables:**
  - per-tenant email route map
  - no hardcoded `@mudyin.org.au` fallback in shared path
- **Depends on:** M9-S02-T02
- **Verify:** `npm run lint && npm run build`

### M9-S03-T04 — Tenant-aware navigation/footer identity
- **Estimate:** 0.75 day
- **Files:**
  - `src/components/layout/Navigation.tsx`
  - `src/components/layout/Footer.tsx`
- **Deliverables:**
  - name/email/social links from tenant config
- **Depends on:** M9-S02-T03
- **Verify:** `npm run lint && npm run build`

### M9-S03-T05 — Tenant-aware legal/contact pages
- **Estimate:** 1.5 days
- **Files (minimum):**
  - `src/app/terms/page.tsx`
  - `src/app/privacy/page.tsx`
  - `src/app/accessibility/page.tsx`
  - `src/app/about/child-safety/page.tsx`
  - `src/app/contact/page.tsx`
- **Deliverables:**
  - hardcoded org/domain/contact values replaced with tenant config
- **Depends on:** M9-S02-T02
- **Verify:** `npm run build`

### M9-S03-T06 — Tenant surface E2E spec
- **Estimate:** 1 day
- **Files:**
  - `e2e/tenant-surface.spec.ts` (new)
- **Deliverables:**
  - assert metadata/contact/robots/sitemap values differ by tenant host
- **Depends on:** T01–T05
- **Verify:** `npm run test:e2e -- tenant-surface.spec.ts`

---

## M9-S04 — Theme & Asset Segmentation

### M9-S04-T01 — Tenant theme schema + assets
- **Estimate:** 0.75 day
- **Files:**
  - `src/lib/tenants/config.ts`
  - `public/tenants/mudyin/*` (new/relocated)
  - `public/tenants/anu/*` (placeholder assets)
- **Deliverables:**
  - theme asset fields in tenant config (logo, favicon, OG)
- **Depends on:** M9-S02-T01
- **Verify:** `npm run build`

### M9-S04-T02 — Data-tenant driven token override model
- **Estimate:** 1 day
- **Files:**
  - `src/app/layout.tsx`
  - `src/app/globals.css`
- **Deliverables:**
  - `<html data-tenant="...">`
  - tenant token override sections in CSS
- **Depends on:** M9-S03-T01
- **Verify:** `npm run build`

### M9-S04-T03 — Wire brand assets in UI shell
- **Estimate:** 0.75 day
- **Files:**
  - `src/components/layout/Navigation.tsx`
  - `src/components/layout/Footer.tsx`
  - optionally `src/app/page.tsx` (if hero logo/brand used)
- **Deliverables:**
  - logos/brand images resolve from tenant config
- **Depends on:** T01
- **Verify:** `npm run lint && npm run build`

### M9-S04-T04 — Visual regression smoke for tenant shell
- **Estimate:** 0.75 day
- **Files:**
  - `e2e/tenant-surface.spec.ts`
  - `docs/M9_VALIDATION_NOTES.md` (new)
- **Deliverables:**
  - screenshots/assertions for nav/footer/home metadata under both tenants
- **Depends on:** T02 + T03
- **Verify:** `npm run test:e2e -- tenant-surface.spec.ts`

---

## M10-S01 — Anu Tenant Pack

### M10-S01-T01 — Finalize Anu config data
- **Estimate:** 1 day
- **Files:**
  - `src/lib/tenants/config.ts`
- **Deliverables:**
  - complete Anu values: domain, org name, metadata copy, contacts, socials, legal links
- **Depends on:** M9 complete
- **Verify:** `npm run build`

### M10-S01-T02 — Add Anu asset bundle
- **Estimate:** 0.5 day
- **Files:**
  - `public/tenants/anu/*`
- **Deliverables:**
  - production-ready logos/favicon/OG assets
- **Depends on:** T01
- **Verify:** browser smoke + `npm run build`

### M10-S01-T03 — Tenant content override module
- **Estimate:** 1 day
- **Files:**
  - `src/lib/tenants/content.ts` (new)
  - selective page callsites (home/about/contact as needed)
- **Deliverables:**
  - structured copy overrides for tenant-specific hero/legal snippets
- **Depends on:** T01
- **Verify:** `npm run build`

---

## M10-S02 — Anu UI/Content QA

### M10-S02-T01 — Anu E2E suite
- **Estimate:** 1 day
- **Files:**
  - `e2e/anu-tenant.spec.ts` (new)
  - `playwright.config.ts` (tenant test project/env config)
- **Deliverables:**
  - critical-path tests under Anu host
- **Depends on:** M10-S01 complete
- **Verify:** `npm run test:e2e -- anu-tenant.spec.ts`

### M10-S02-T02 — Accessibility + responsive pass
- **Estimate:** 1 day
- **Files:**
  - `docs/ANU_QA_REPORT.md` (new)
- **Deliverables:**
  - documented pass/fail and fixes for keyboard, contrast, mobile breakpoints
- **Depends on:** T01
- **Verify:** checklist evidence + targeted manual/browser assertions

### M10-S02-T03 — Leakage audit (Mudyin strings on Anu)
- **Estimate:** 0.5 day
- **Files:**
  - codebase + QA report updates
- **Deliverables:**
  - zero unintended `mudyin.org.au` and `@mudyin.org.au` references when serving Anu tenant routes
- **Depends on:** T01
- **Verify:** `rg` scan + E2E text assertions

---

## M10-S03 — Anu Launch Readiness

### M10-S03-T01 — Anu launch checklist
- **Estimate:** 0.5 day
- **Files:**
  - `docs/ANU_LAUNCH_CHECKLIST.md` (new)
- **Deliverables:**
  - DNS/SSL/env/monitoring/legal/support checklist
- **Depends on:** M10-S02 complete
- **Verify:** checklist completion review

### M10-S03-T02 — Rollback and kill-switch procedure
- **Estimate:** 0.5 day
- **Files:**
  - `docs/ANU_ROLLBACK_PLAN.md` (new)
  - optional config gate in tenant resolver/config
- **Deliverables:**
  - tested rollback decision tree and execution steps
- **Depends on:** T01
- **Verify:** staging dry-run

### M10-S03-T03 — Final release gate run
- **Estimate:** 0.75 day
- **Files:**
  - `docs/ANU_RELEASE_SIGNOFF.md` (new)
- **Deliverables:**
  - recorded outputs:
    - `npm run lint`
    - `npm test`
    - `npm run build`
    - `npm run test:e2e`
  - explicit go/hold decision
- **Depends on:** T01 + T02
- **Verify:** all commands pass and signoff file complete

---

## Critical Path
1. M9-S01-T01 → T04
2. M9-S02-T01 → T04
3. M9-S03-T01 → T06
4. M9-S04-T01 → T04
5. M10-S01-T01 → T03
6. M10-S02-T01 → T03
7. M10-S03-T01 → T03

---

## Command Gate (per task completion)
Minimum command gate to close any task touching app/runtime:
- `npm run lint`
- `npm test -- --watch=false`
- `npm run build`

For tasks touching tenant behavior/UI:
- `npm run test:e2e` (or targeted spec during slice, full run at slice close)

---

## Estimated Effort Summary
- **M9 total:** ~11.5 to 13 days
- **M10 total:** ~6.25 to 7 days
- **Combined:** ~18 to 20 days (single engineer, sequential execution)
