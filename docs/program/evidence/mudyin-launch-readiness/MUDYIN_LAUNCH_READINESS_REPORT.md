# Mudyin Launch Readiness Report

Checked: 2026-05-11

## Executive summary

Status: partially ready.

Recommended first-live mode: hybrid launch - public frontend live on Vercel with simplified enquiries and booking requests. Full ANU-backed live booking should remain disabled.

Current live readiness estimate: 78%.

Repo readiness after redeploy and email-provider environment setup: 90%.

ANU full-backed booking/enquiry readiness estimate: 55%.

## SSL and domain security

Live SSL warning status: not reproduced from this environment.

Verified live results:

- `https://www.mudyin.com` returns 200 over HTTPS.
- `http://mudyin.com` redirects to `https://mudyin.com/`, then `https://www.mudyin.com/`.
- `http://www.mudyin.com` redirects to `https://www.mudyin.com/`.
- `https://mudyin.com` redirects to `https://www.mudyin.com/`.
- No final redirect target is `http://`.
- No final redirect target is `mudyin-live.vercel.app`.
- Initial homepage HTML contains no `http://` asset URLs.
- `mudyin.com` certificate covers `mudyin.com` and expires `2026-08-08T23:12:11+00:00`.
- `www.mudyin.com` certificate covers `www.mudyin.com` and expires `2026-08-08T23:14:40+00:00`.
- Live responses include `Server: Vercel` and `x-anu-domain-resolution: matched`.

DNS observed:

- `mudyin.com`: Vercel anycast A records observed as `216.198.79.1` and `64.29.17.1`.
- `www.mudyin.com`: Vercel anycast A records observed as `216.198.79.65` and `64.29.17.65`.

Root cause assessment:

- The earlier browser warning is not caused by the current certificate, redirect chain, or mixed content in the checked live HTML.
- The earlier `Site unavailable` response is also not reproduced; the current live site resolves the host as matched.
- If the warning still appears for a user, check for browser cache/HSTS cache, DNS propagation, Cloudflare proxy mode, or a stale Vercel domain binding in another project.

External dashboard actions if warning persists:

- Confirm both `mudyin.com` and `www.mudyin.com` are attached only to the intended Mudyin Vercel project.
- Confirm Vercel certificates are issued for both domains.
- Confirm Cloudflare DNS records match Vercel's required apex and `www` records.
- Prefer DNS-only Cloudflare records for first-live Vercel routing unless proxying has been deliberately tested.

## Program content

Included in repo:

- Thrive Tribe: yes, `/programs/thrive-tribe`.
- Young Spirit Mentoring: yes, `/programs/young-spirit-mentoring`.
- Culture Country: yes, `/programs/culture-country`.

Copy source:

- Existing repository references to Thrive Tribe and Young Spirit Mentoring.
- The launch brief's cautious first-live wording for the three original program streams.
- Operational model language from the Mudyin governance/admin implementation pass.

Copy still requiring operator confirmation:

- Detailed eligibility.
- Dates and locations.
- Pricing/funding.
- Transport.
- Child-safeguarding operational details.
- Clinical or therapeutic scope.
- Published event/intake capacity.

## Intake routing

Target recipient: `yaama@mudyin.com`.

Implemented behaviour:

- `MUDYIN_INTAKE_EMAIL` defaults to `yaama@mudyin.com`.
- Server-side Resend delivery is used when `RESEND_API_KEY` is configured.
- `EMAIL_FROM` controls the verified sender address.
- Subjects distinguish general enquiries, booking requests, and program enquiries.
- Email body includes request type, selected program, name, email, phone, preferred date/time, message, consent, host, timestamp, tenant key, and site slug.
- Browser code does not receive email provider credentials.
- If email is not configured or fails, the request is still recorded through local DB storage when available, then first-live server fallback logging with a reference number.

Live delivery status:

- Current live smoke returned successful intake responses in `fallback-log` mode.
- Real email delivery to `yaama@mudyin.com` is not active/proven until `RESEND_API_KEY`, `EMAIL_FROM`, and `MUDYIN_INTAKE_EMAIL=yaama@mudyin.com` are set in Vercel and a live delivery test is run.

## Backend readiness

ANU backend health:

- `/health`: pass, returned 200.

CORS:

- `https://mudyin.com`: pass.
- `https://www.mudyin.com`: pass.
- `https://mudyin-live.vercel.app`: pass.

Tenant/domain:

- Tenant manifest lookup for `mudyin` and `www.mudyin.com`: pass.
- Manifest response still includes a fallback note that no active tenant node is provisioned yet.

Security:

- Public frontend intake routes validate payloads and do not expose secrets.
- Booking copy remains request-only and does not confirm bookings.
- Unauthenticated control-plane check to `/api/control/sites/mudyin/domain-bindings` returned `503 control_plane_not_configured`, not privileged data.
- Admin pages now declare `noindex,nofollow`.

## Launch bugs fixed

- Added live SSL/domain diagnostics script.
- Added missing original program routes for Thrive Tribe, Young Spirit Mentoring, and Culture Country.
- Added program-specific contact prefill via `/contact?program=<slug>#booking-request`.
- Routed intake to `yaama@mudyin.com` via `MUDYIN_INTAKE_EMAIL`.
- Added server-side Resend adapter without exposing provider secrets.
- Changed unsafe legacy `/enroll` pages to redirect into the request flow.
- Replaced old event listings with a first-live holding page because events/intakes are not production-published.
- Removed news/events from sitemap promotion.
- Changed request/place language to booking request wording where found in primary CTAs.
- Added admin `noindex,nofollow` metadata.

## Remaining blockers

Launch blockers:

- Deploy this repo update to Vercel. Current live domain still returns 404 for `/programs/young-spirit-mentoring` and `/programs/culture-country` because this build is not deployed yet.
- Configure live email delivery in Vercel: `MUDYIN_INTAKE_EMAIL=yaama@mudyin.com`, `RESEND_API_KEY`, and a verified `EMAIL_FROM`.
- Run a real delivery test to confirm `yaama@mudyin.com` receives both an enquiry and a booking request.

Hardening:

- Legacy community/gallery/marketplace/news routes still exist in the built app but are not in primary navigation or sitemap promotion. Gate or retire them if they should not be reachable for first-live.
- Existing lint warning remains in `src/components/community/CreatePostForm.tsx` for unused `userId`.
- Next.js reports the `middleware` file convention is deprecated and should eventually move to `proxy`.

Future:

- Provision a full ANU tenant node for Mudyin.
- Promote ANU-backed durable enquiries only after the public intake endpoints are production-ready.
- Keep live bookings disabled until full booking lifecycle, confirmation, cancellation, and admin review are production-ready.

## Commands and results

- `cmd /c npm run check:mudyin-theme`: pass.
- `cmd /c npm run typecheck`: pass.
- `cmd /c npm run lint`: pass with one existing warning in `src/components/community/CreatePostForm.tsx`.
- `cmd /c npm run build`: pass. Warning: Next middleware convention deprecated.
- `cmd /c npm test -- --runInBand`: pass, 5 suites, 81 tests.
- `python scripts\mudyin_launch_diagnostics.py`: live SSL/DNS/redirect/mixed-content pass; failed only on not-yet-deployed program routes for Young Spirit Mentoring and Culture Country.
- `$env:MUDYIN_FRONTEND_URL="https://www.mudyin.com"; $env:MUDYIN_PUBLIC_URL="https://www.mudyin.com"; $env:ANU_BACKEND_URL="https://anu-back-end.vercel.app"; $env:TENANT_KEY="mudyin"; $env:MUDYIN_INTAKE_EMAIL="yaama@mudyin.com"; python scripts\mudyin_launch_readiness_smoke.py`: pass for frontend root/contact/programs/thrive, backend health, CORS, tenant manifest, and intake fallback; failed on not-yet-deployed Young Spirit Mentoring and Culture Country routes.
- `curl.exe -i -s https://www.mudyin.com/api/control/sites/mudyin/domain-bindings`: returned `503 control_plane_not_configured`; no privileged data exposed.

## Files changed

- `docs/deployment/mudyin-domain-vercel-cloudflare.md`
- `docs/program/evidence/mudyin-launch-readiness/MUDYIN_LAUNCH_READINESS_REPORT.md`
- `docs/program/evidence/mudyin-launch-readiness/MUDYIN_OPERATIONAL_ADMIN_IMPLEMENTATION_REPORT.md`
- `scripts/mudyin_launch_diagnostics.py`
- `scripts/mudyin_launch_readiness_smoke.py`
- `scripts/seed-mudyin-operational-admin.mjs`
- `src/app/admin/layout.tsx`
- `src/app/api/booking-request/route.ts`
- `src/app/api/enquiries/route.ts`
- `src/app/contact/ContactPageClient.tsx`
- `src/app/contact/page.tsx`
- `src/app/enroll/[program]/page.tsx`
- `src/app/enroll/page.tsx`
- `src/app/events/page.tsx`
- `src/app/not-found.tsx`
- `src/app/page.tsx`
- `src/app/programs/culture-and-country/page.tsx`
- `src/app/programs/culture-country/page.tsx`
- `src/app/programs/healing-centre/page.tsx`
- `src/app/programs/page.tsx`
- `src/app/programs/thrive-tribe/page.tsx`
- `src/app/programs/young-spirit-mentoring/page.tsx`
- `src/app/programs/ysmp/page.tsx`
- `src/app/sitemap.ts`
- `src/components/forms/BookingRequestForm.tsx`
- `src/components/forms/ContactForm.tsx`
- `src/components/layout/Footer.tsx`
- `src/components/programs/ProgramStreamPublicPage.tsx`
- `src/components/sections/HeroSection.tsx`
- `src/lib/__tests__/mudyin-public-launch.test.ts`
- `src/lib/data.ts`
- `src/lib/demo-fallback.ts`
- `src/lib/mudyin-email.ts`
- `src/lib/mudyin-intake.ts`
- `src/lib/mudyin-operational-model.ts`
- `src/lib/white-label/site-registry.ts`
