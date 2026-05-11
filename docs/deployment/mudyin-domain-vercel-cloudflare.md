# Mudyin Domain, Vercel, and Cloudflare Launch Notes

## Hosting model

- Cloudflare keeps DNS authority for `mudyin.com`.
- Vercel hosts the Mudyin public frontend.
- ANU provides backend services only where endpoints are proven ready.
- The Mudyin frontend should use `https://www.mudyin.com` as the canonical public site URL.

## Vercel project domains

Add both domains to the Mudyin frontend Vercel project:

- `www.mudyin.com`
- `mudyin.com`

Choose one canonical domain in Vercel. Current frontend config expects:

- Canonical: `https://www.mudyin.com`
- Redirect alias: `https://mudyin.com`

## Cloudflare DNS

Use the DNS records Vercel provides after the domains are added to the Vercel project. Cloudflare should generally be set to **DNS only** for Vercel records at launch unless there is an intentional and tested reason to proxy through Cloudflare.

Typical shape:

- `www` CNAME -> Vercel target
- apex `mudyin.com` -> Vercel-provided apex record

Do not require Cloudflare API access unless DNS infrastructure-as-code already exists.

## Required frontend environment variables

Set these in Vercel Production and Preview environments:

```bash
NEXT_PUBLIC_SITE_SLUG=mudyin
NEXT_PUBLIC_TENANT_KEY=mudyin
NEXT_PUBLIC_API_BASE_URL=https://anu-back-end.vercel.app
NEXT_PUBLIC_PUBLIC_SITE_URL=https://www.mudyin.com
MUDYIN_INTAKE_EMAIL=yaama@mudyin.com
```

Optional email delivery and ANU intake forwarding:

```bash
RESEND_API_KEY=
EMAIL_FROM="Mudyin <noreply@mudyin.com>"
ANU_PUBLIC_ENQUIRIES_ENDPOINT=
ANU_PUBLIC_BOOKING_REQUEST_ENDPOINT=
```

Leave the optional ANU endpoint variables empty until ANU has stable public intake endpoints. If `RESEND_API_KEY` is set, public enquiries and booking requests are emailed server-side to `MUDYIN_INTAKE_EMAIL`. If no email provider is configured, the frontend uses local durable storage where available, then first-live server-side fallback logging, and it does not expose secrets to the browser.

## First-live mode

Current recommended mode is hybrid launch:

- frontend live on Vercel
- general enquiries enabled
- booking requests enabled
- live booking confirmation disabled
- donations disabled
- community, gallery, marketplace, and member features not promoted as first-live public routes

Booking request copy must say request only. It must not imply a confirmed booking, appointment, or program place.
