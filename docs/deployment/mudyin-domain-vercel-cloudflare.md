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
```

Optional ANU intake forwarding:

```bash
ANU_PUBLIC_ENQUIRIES_ENDPOINT=
ANU_PUBLIC_BOOKING_REQUEST_ENDPOINT=
```

Leave the optional endpoint variables empty until ANU has stable public intake endpoints. The frontend will then use first-live server-side fallback logging and will not expose secrets to the browser.

## First-live mode

Current recommended mode is hybrid launch:

- frontend live on Vercel
- general enquiries enabled
- booking requests enabled
- live booking confirmation disabled
- donations disabled
- community, gallery, marketplace, and member features not promoted as first-live public routes

Booking request copy must say request only. It must not imply a confirmed booking, appointment, or program place.
