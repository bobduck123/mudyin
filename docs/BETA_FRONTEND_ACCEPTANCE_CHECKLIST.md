# Mudyin Frontend Beta Acceptance Checklist

## 1) Core UX and Branding
- [ ] Calm, grounded healing-centre visual direction across public pages.
- [ ] No literal Aboriginal flag colour coding is used as decorative branding.
- [ ] Base palette in use:
  - warm deep brown / charcoal-brown
  - soft cream / ivory
  - eucalyptus / sage
  - terracotta / clay
  - restrained muted gold accent

## 2) Priority Page Polish
- [ ] Home: storytelling-first hero and clear program entry points.
- [ ] Booking request and enquiry flows are clear and do not imply confirmed bookings.
- [ ] Community, gallery, marketplace, and donations are not first-live top-level routes unless backend support is confirmed.

## 3) Marketplace UX (Frontend-Only)
- [ ] Ported marketplace UI and reskinned to Mudyin.
- [ ] `Add to cart` is primary CTA.
- [ ] Desktop behavior: add-to-cart shows on hover; keyboard focus reveals equivalent control.
- [ ] Demo labeling appears only at submit points (e.g., checkout submit button, save submit button).

## 4) Community Upload UX
- [ ] Post composer supports click-to-upload.
- [ ] Post composer supports drag-and-drop.
- [ ] Alpha caps: max 4 images, max 5MB each.
- [ ] Beta-ready path documented for 10 images, 5MB each.

## 5) Accessibility Mode
- [ ] Floating button at bottom-right, visible for logged-in and logged-out users.
- [ ] Opens compact panel.
- [ ] Preferences persist in `localStorage`.
- [ ] Panel includes checkbox controls for:
  - [ ] Reduced motion
  - [ ] High contrast + stronger borders
  - [ ] Larger type (multi-step sizing)
  - [ ] Simpler layout mode (hides decorative sections)
- [ ] Reduced motion disables non-essential animation.

## 6) Performance and Delivery
- [ ] Image-heavy pages still optimized for fast load.
- [ ] Aggressive lazy-loading beyond first viewport.
- [ ] AVIF/WebP strategy enforced via Next image pipeline.
- [ ] Gallery and marketplace image rendering supports required remote domains.

## 7) Numeric Performance Gates (Beta)
- [ ] Desktop Lighthouse Performance score >= 85 on priority pages.
- [ ] Mobile Lighthouse Performance score >= 75 on priority pages.
- [ ] LCP <= 2.5s (desktop), <= 3.2s (mobile) on 75th percentile test runs.
- [ ] CLS <= 0.1 on all priority pages.
- [ ] INP <= 200ms (desktop), <= 260ms (mobile) on 75th percentile test runs.
- [ ] JS payload budget:
  - [ ] Initial route JS <= 260KB gzip desktop
  - [ ] Initial route JS <= 320KB gzip mobile

## 8) Mobile vs Desktop Acceptance

### Mobile (<= 768px)
- [ ] Controls remain reachable without hover assumptions.
- [ ] Tap targets >= 40px.
- [ ] Hero and gallery imagery remain clear without blocking content.
- [ ] Filters and primary actions remain visible/usable without horizontal scroll.

### Desktop (> 768px)
- [ ] Rich hover treatments and stronger motion cues present.
- [ ] Hover-only commerce reveal patterns include keyboard fallback.
- [ ] Masonry rhythm remains visually coherent at `md/lg/xl` breakpoints.

## 9) QA and Reliability
- [ ] Community programs page no longer relies on fragile self-fetch fallback.
- [ ] E2E tests reflect current real routes and selectors.
- [ ] `npm run build` passes.
