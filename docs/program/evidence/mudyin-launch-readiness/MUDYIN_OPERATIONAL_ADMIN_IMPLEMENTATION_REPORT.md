# Mudyin Operational Admin Implementation Report

Date: 2026-05-10

## Executive Summary

Status: partially ready for first-live public operation.

Recommended first-live mode: hybrid launch - public frontend live with simplified general enquiries and booking requests, local durable inquiry storage, admin review, and no live booking confirmation.

Readiness estimate: 82%.

## Source Material Evidence Gap

The named foundation documents and operations starter kit files were not present under `C:\Dev` or the Mudyin repository during implementation. The operational model was implemented from the explicit requirements in the prompt:

- MUDYIN PTY LTD as parent operating entity.
- Mudyin Women's Business, Aaliyah's Dreaming, and Mirabella's Dreaming as sub-program streams.
- First-live request/enquiry language only.
- Controlled admin creation through bootstrap super admin.
- Governance, document control, consent, incident, complaints, risk, spending, and partnership awareness.

## Implemented Frontend Readiness

- Public IA now promotes Home, About, Program Streams, Governance, and Contact.
- Program streams are represented as sub-programs under MUDYIN PTY LTD.
- Mudyin Women's Business is open for first-live enquiries.
- Aaliyah's Dreaming and Mirabella's Dreaming are clearly future-phase.
- Homepage and program copy no longer relies on old YSMP/Thrive/Healing Centre impact claims as first-live public positioning.
- Booking request language says request only, not confirmed booking.
- Literal flag-colour decorative styling check passes.

## Implemented Admin Readiness

- Admin login: `/admin/login`.
- First-login password rotation: `/admin/first-login`.
- Admin dashboard: `/admin`.
- Enquiry review: `/admin/enquiries`.
- Program stream review: `/admin/programs`.
- Document control index: `/admin/documents`.
- Admin user creation: `/admin/users`.

Roles:

- `super_admin`: full control, including creating admin/editor accounts after password rotation.
- `admin`: enquiry/program/document access, not admin-user creation.
- `editor`: role reserved for content-only future use.

## Data Model Changes

Prisma models added:

- `AdminProfile`
- `ProgramStream`
- `SitePage`
- `Inquiry`

Existing `User` is reused for credentials. Admin access is only granted through `AdminProfile`; public registration does not create this profile.

## Security Notes

- No admin self-signup route was added.
- Public `/api/auth/register` remains non-admin and was verified not to grant admin access.
- Admin creation is blocked until bootstrap super admin rotates the temporary password.
- Routine admin creation cannot mint another `super_admin`.
- Bootstrap credentials are written only to `.local/mudyin-bootstrap-admin.txt`, which is ignored by git.
- Verification artifacts are written only to `.local/mudyin-admin-verification.txt`, which is ignored by git.

## Verification Evidence

Commands run:

```bash
cmd /c npx prisma generate
cmd /c npx prisma migrate reset --force --skip-seed
cmd /c npm run seed:mudyin-admin
cmd /c npm run dev -- --port 3000
node scripts\verify-mudyin-admin-http-flow.mjs
cmd /c npm run typecheck
cmd /c npm test -- --runInBand
cmd /c npm run lint
cmd /c npm run check:mudyin-theme
cmd /c npm run build
cmd /c npx prisma migrate deploy
python scripts\mudyin_launch_readiness_smoke.py
npm audit --audit-level=high
```

HTTP admin flow verified against `http://localhost:3000`:

- Bootstrap admin login passed.
- Bootstrap first-login password reset enforcement passed.
- Admin creation before password reset blocked.
- Bootstrap password rotation endpoint passed.
- Second admin creation passed.
- Second admin login passed.
- Second admin blocked from super-admin-only user management.
- Public user registration/login did not grant admin access.
- Public enquiry was captured and visible in admin.

Local verification file:

- `.local/mudyin-admin-verification.txt`

## Test Results

- Typecheck: passed.
- Jest: passed, 77 tests.
- Lint: passed with one existing warning in `src/components/community/CreatePostForm.tsx`.
- Theme check: passed.
- Build: passed.
- Prisma migrate deploy: passed after correcting migration to a full UTF-8 baseline.
- Hosted smoke: backend health/CORS/tenant checks passed; live frontend intake checks returned 307 redirect and are unknown until the updated deployment is live.
- `npm audit --audit-level=high`: failed due dependency advisories, including Next.js advisories requiring an out-of-range update to `next@16.2.6`.

## Remaining Gaps

Critical blockers: none for local first-live review.

Launch blockers:

- Deploy the updated frontend before treating hosted intake checks as passing.
- Configure production `DATABASE_URL`, `NEXTAUTH_URL`, and `NEXTAUTH_SECRET` in Vercel.
- Run migrations and seed bootstrap admin against the production database.

Hardening:

- Add rate limiting on public intake and admin login.
- Replace local first-live inquiry storage/log fallback with approved email/CRM/backend flow when ready.
- Resolve `npm audit` advisories through a controlled dependency update.
- Move `middleware.ts` to the Next.js `proxy.ts` convention.

Future:

- Full document register with uploaded approved source documents.
- Content editing UI for `SitePage`.
- Formal admin invitation flow if direct creation becomes too permissive.
