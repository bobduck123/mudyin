# Performance Optimization & Lighthouse Audit Guide

**Version**: 1.0
**Last Updated**: February 2026
**Target**: Lighthouse scores >90 across all categories

---

## Executive Summary

**Performance Goals**:
- ✅ Lighthouse Performance: >90
- ✅ Lighthouse Accessibility: >95
- ✅ Lighthouse Best Practices: >95
- ✅ Lighthouse SEO: >90
- ✅ First Contentful Paint (FCP): <1.5s
- ✅ Largest Contentful Paint (LCP): <2.5s
- ✅ Cumulative Layout Shift (CLS): <0.1
- ✅ Time to Interactive (TTI): <3.5s

**Current Baseline** (to be measured):
- Dev server: Running, TypeScript ✅ 0 errors
- DB connection: Pending (affects actual performance)

---

## 1. Image Optimization

### Strategy: Cloudinary Integration

**Configuration** (`next.config.ts`):
```javascript
remotePatterns: [
  {
    protocol: 'https',
    hostname: 'res.cloudinary.com',
  }
]
```

**In Components**:
```jsx
import Image from 'next/image'

// Gallery photos
<Image
  src="https://res.cloudinary.com/.../photo.jpg"
  alt="User-provided alt text"
  width={800}
  height={600}
  priority={false}
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
  loading="lazy"
/>

// Community avatars
<Image
  src="https://res.cloudinary.com/.../avatar.jpg"
  alt={userName}
  width={40}
  height={40}
  priority={false}
/>
```

### Cloudinary Transform URLs

```
// Responsive gallery photos
https://res.cloudinary.com/[cloud]/image/upload/
  w_800,h_600,c_fill,f_auto,q_auto/photo.jpg

// Mobile thumbnail
https://res.cloudinary.com/[cloud]/image/upload/
  w_300,h_225,c_fill,f_auto,q_auto/photo.jpg

// Avatar (low-res, small)
https://res.cloudinary.com/[cloud]/image/upload/
  w_100,h_100,c_fill,r_max/avatar.jpg

// Lazy load with quality reduction
https://res.cloudinary.com/[cloud]/image/upload/
  w_800,f_auto,q_50/large-photo.jpg
```

### Next.js Image Optimization

**Next.js automatically**:
- Detects device width
- Serves optimal format (AVIF, WebP, JPEG)
- Lazy loads below-fold images
- Provides blur placeholder
- Responsive sizes

**No additional setup needed** - Next.js handles it

### Best Practices

✅ **Always use alt text**:
```jsx
<Image alt="Photo from YSMP open day event" ... />
```

✅ **Set explicit dimensions**:
```jsx
<Image width={800} height={600} ... />
```

✅ **Use placeholder for slow connection**:
```jsx
<Image placeholder="blur" blurDataURL="..." ... />
```

✅ **Lazy load off-screen images**:
```jsx
<Image loading="lazy" ... /> // Default, don't need to specify
```

✅ **Priority for above-fold**:
```jsx
<Image priority ... /> // Hero image only
```

---

## 2. Code Splitting & Dynamic Imports

### Route-Based Splitting (Automatic)

Next.js automatically code-splits at each route:
```
/community/feed → feed.chunk.js (~50kb)
/community/create → create.chunk.js (~40kb)
/community/members → members.chunk.js (~30kb)
```

**No extra work needed** - it's automatic

### Component-Level Splitting

**Lazy load heavy components**:
```typescript
import dynamic from 'next/dynamic'

// For modals (opened on demand)
const ReportForm = dynamic(() => import('@/components/moderation/ReportForm'), {
  loading: () => <Spinner />,
  ssr: false, // Don't server-render modals
})

// For rich editors (only needed on post creation page)
const RichTextEditor = dynamic(() => import('@/components/editor/RichTextEditor'), {
  loading: () => <Skeleton />,
})

// Usage
<Suspense fallback={<Spinner />}>
  <ReportForm />
</Suspense>
```

### Current Candidates for Splitting

**High Priority** (use dynamic import):
- `ModerationQueue.tsx` (~250 lines) - admin only
- `StoryCreator.tsx` (~500 lines) - used on one page
- `CreatePostForm.tsx` (~400 lines) - lazy load until needed

**Medium Priority**:
- `CommentThread.tsx` (~350 lines) - initially collapsed
- `ProgramMembers.tsx` (~300 lines) - on members page only

---

## 3. Caching Strategy

### HTTP Caching Headers

**Next.js automatically sets optimal headers**. Verify in production:

```
# API responses (data changes)
Cache-Control: public, max-age=60

# Static assets (rarely change)
Cache-Control: public, max-age=31536000, immutable

# HTML pages (can change)
Cache-Control: public, max-age=3600
```

**In API routes** (example):
```typescript
export async function GET(request: NextRequest) {
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, max-age=300', // 5 minutes
    },
  })
}
```

### Database Query Caching

**Prisma with cache**:
```typescript
import { prisma } from '@/lib/db'

// For frequently accessed data (programs, hotlines)
const getCrisisResources = async (region: string) => {
  const cacheKey = `crisis-resources-${region}`

  // Check cache
  const cached = await redis.get(cacheKey)
  if (cached) return cached

  // Query DB
  const resources = await prisma.crisisResource.findMany({
    where: { region, isActive: true },
  })

  // Cache for 1 hour
  await redis.set(cacheKey, resources, { ex: 3600 })
  return resources
}
```

**Without Redis** (use in-memory):
```typescript
const CACHE = new Map()

const getCrisisResources = async (region: string) => {
  const cacheKey = `crisis-resources-${region}`

  // Check in-memory cache
  if (CACHE.has(cacheKey)) {
    return CACHE.get(cacheKey)
  }

  // Query DB
  const resources = await prisma.crisisResource.findMany({
    where: { region, isActive: true },
  })

  // Cache with expiry (1 hour)
  CACHE.set(cacheKey, resources)
  setTimeout(() => CACHE.delete(cacheKey), 3600000)

  return resources
}
```

### What to Cache

| Data | TTL | Strategy |
|------|-----|----------|
| Crisis hotlines | 1 hour | DB query cache |
| Programs list | 1 hour | API response cache |
| User profile | 5 min | Redis/in-memory |
| Feed posts | 30 sec | Pagination + fresh |
| Gallery photos | 1 hour | DB query cache |
| Badges/ICIP metadata | 1 day | Cloudinary + CDN |

---

## 4. Database Query Optimization

### Use Prisma Efficiently

**Bad** (N+1 queries):
```typescript
const users = await prisma.user.findMany()
for (const user of users) {
  // Makes separate query for each user!
  const posts = await prisma.communityPost.findMany({
    where: { authorId: user.id },
  })
}
```

**Good** (single optimized query):
```typescript
const users = await prisma.user.findMany({
  include: {
    posts: {
      take: 5,
      select: { id: true, content: true, createdAt: true },
    },
  },
})
```

### Query Patterns Applied

**Gallery photos with engagement**:
```typescript
const photos = await prisma.galleryPhoto.findMany({
  take: 20,
  skip: (page - 1) * 20,
  include: {
    uploader: {
      select: { id: true, name: true, avatar: true },
    },
    _count: {
      select: { likes: true, comments: true },
    },
  },
  orderBy: { createdAt: 'desc' },
})
```

**Community feed with trending**:
```typescript
const posts = await prisma.communityPost.findMany({
  take: 20,
  skip: (page - 1) * 20,
  include: {
    author: { select: { id: true, name: true, avatar: true } },
    _count: { select: { likes: true, comments: true } },
  },
  orderBy:
    sort === 'trending'
      ? [
          { likes: { _count: 'desc' } },
          { comments: { _count: 'desc' } },
        ]
      : { createdAt: 'desc' },
})
```

### Database Indexes

**Already defined** (see prisma/schema.prisma):
```prisma
// User profiles
@@index([userId])

// Community posts
@@index([authorId])
@@index([program])
@@index([createdAt])

// Gallery photos
@@index([uploaderId])
@@index([program])

// Comments and likes
@@index([postId])
@@index([photoId])
@@index([authorId])
@@index([userId, postId]) // Unique constraint
```

**No additional indexes needed** for current queries

---

## 5. Bundle Size Reduction

### Current Dependencies

**Core** (necessary):
- next: ~50kb (gzipped)
- react: ~40kb
- @prisma/client: ~30kb

**UI** (Radix + Tailwind):
- @radix-ui/*: ~25kb total
- tailwindcss: tree-shaken in production

**Utilities** (lightweight):
- zod: ~15kb (validation)
- date-fns: ~10kb (dates, used)
- bcryptjs: ~20kb (hashing)
- lucide-react: ~5kb (individual icons)

**Total Current**: ~195kb gzipped (reasonable for a full-featured app)

### Reduction Strategies

**Remove unused dependencies**:
- `stripe` - if not using payments
- `embla-carousel-react` - if using CSS-only
- Unused @radix-ui components

**Optimize used dependencies**:
- Only import needed date-fns functions:
  ```typescript
  import { formatDistanceToNow } from 'date-fns' // Not entire library
  ```
- Tree-shake unused validators (Zod is good at this)
- Use Lucide icons (light) not Font Awesome (heavy)

---

## 6. Rendering Optimization

### Static Generation

**Pre-render at build time**:
```typescript
// src/app/community/page.tsx
export const revalidate = 3600 // Revalidate every hour

export default async function CommunityHub() {
  const programs = await getPrograms() // Fetched at build time
  return <CommunityLayout programs={programs} />
}
```

### Incremental Static Regeneration (ISR)

```typescript
// /src/app/community/members/[userId]/page.tsx
export const revalidate = 300 // Revalidate every 5 minutes

export async function generateStaticParams() {
  // Generate paths for popular members
  const members = await prisma.user.findMany({
    take: 100,
    orderBy: { followers: { _count: 'desc' } },
  })
  return members.map(m => ({ userId: m.id }))
}
```

### Dynamic Routes (On-Demand)

```typescript
// /api/community/posts/[id]/route.ts
// Dynamic - generated on first request, cached
// No pre-rendering needed
```

### What Pages Can Be Static

✅ **Static** (build-time):
- `/community` (hub)
- `/community/programs` (program list)
- `/gallery` (grid, but updates with ISR)

✅ **ISR** (rebuild periodically):
- `/community/programs/[program]` - 5 min
- `/community/members` - 1 hour
- `/gallery/albums/[albumId]` - 30 min

✅ **Dynamic** (on-demand):
- `/community/feed` - always fresh
- `/community/posts/[id]` - comments change
- `/community/members/[userId]` - profile updates

---

## 7. Core Web Vitals

### Metrics & Targets

**Largest Contentful Paint (LCP)** < 2.5s
- When largest visible element loads
- Most important for user perception

**First Input Delay (FID) / Interaction to Next Paint (INP)** < 100ms
- Response speed to user interaction
- Click button → register click

**Cumulative Layout Shift (CLS)** < 0.1
- Unexpected layout changes
- Don't shift content while loading

### Optimization by Metric

**For LCP**:
- Optimize hero images (lazy load below-fold)
- Cache API responses
- Don't block on large JS files
- Use dynamic imports for non-critical code

**For INP**:
- Debounce expensive operations
- Break long tasks into chunks
- Use requestIdleCallback for non-urgent work
- Avoid layout thrashing

**For CLS**:
- Reserve space for images (use width/height)
- Avoid inserting ads/floating elements
- Use transform instead of top/left changes
- Font-display: swap (load fast, swap when ready)

### Monitoring

**Add monitoring to track real-user performance**:
```typescript
// src/lib/web-vitals.ts
export function reportWebVitals(metric: any) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag.event(metric.name, {
      event_category: 'web_vitals',
      value: Math.round(metric.value),
      event_label: metric.id,
    })
  }
}

// pages/_app.tsx
import { reportWebVitals } from '@/lib/web-vitals'
// Automatically called by Next.js
```

---

## 8. Accessibility Performance

### WCAG 2.1 AA Compliance

**Already implemented**:
- ✅ Alt text on all images (required)
- ✅ Semantic HTML (nav, main, article)
- ✅ ARIA labels on interactive elements
- ✅ Keyboard navigation support
- ✅ Color contrast (4.5:1 for text)
- ✅ Focus visible (2px outline)

**Need to verify**:
- Screen reader testing (NVDA on Windows)
- VoiceOver on macOS
- Mobile accessibility (iOS VoiceOver)
- Reduced motion support (CSS media queries)

### Performance Impact

Accessibility improves performance:
- Semantic HTML faster to parse
- Alt text means images load without blocking
- ARIA labels prevent re-layouts
- Keyboard nav faster than click

---

## 9. Lighthouse Audit Checklist

### Pre-Audit Setup

```bash
# Install Lighthouse CLI
npm install -g @lighthouse-ci/cli

# Create config
cat > lighthouserc.json << 'EOF'
{
  "ci": {
    "collect": {
      "url": ["http://localhost:3000/community"],
      "numberOfRuns": 3,
      "settings": {
        "onlyCategories": ["performance", "accessibility", "best-practices", "seo"],
        "chromeFlags": ["--disable-gpu"]
      }
    }
  }
}
EOF
```

### Running Audits

```bash
# One-time audit (desktop)
npx lighthouse http://localhost:3000/community --output-path=./lighthouse-report.html

# Mobile audit
npx lighthouse http://localhost:3000/community --emulated-form-factor=mobile

# CI/CD audit
lhci autorun

# Multiple pages
npx lighthouse http://localhost:3000/community/feed
npx lighthouse http://localhost:3000/gallery
npx lighthouse http://localhost:3000/community/members
```

### Pages to Audit (Priority Order)

| Page | Type | Target Score |
|------|------|--------------|
| `/community/feed` | Dynamic | 85+ |
| `/gallery` | Grid | 90+ |
| `/community/programs/YSMP` | Feed | 85+ |
| `/community/members` | Directory | 80+ |
| `/community` | Hub | 90+ |

### Target Scores by Category

| Category | Desktop | Mobile |
|----------|---------|--------|
| Performance | 90+ | 85+ |
| Accessibility | 95+ | 95+ |
| Best Practices | 95+ | 95+ |
| SEO | 90+ | 85+ |

### Common Lighthouse Warnings

| Warning | Fix |
|---------|-----|
| Unused JavaScript | Use code splitting (dynamic imports) |
| Unused CSS | Tailwind tree-shaking handles this |
| Large images | Use Cloudinary transforms |
| Missing alt text | Add alt to every Image component |
| Slow server response | Add caching, optimize DB queries |
| Layout shift | Reserve space with width/height |
| Unoptimized font | Use next/font auto-optimization |

---

## 10. Performance Monitoring

### Real User Monitoring (RUM)

**Track actual user experience**:
```typescript
// src/app/layout.tsx
import { reportWebVitals } from 'next/web-vitals'

export function reportWebVitals(metric) {
  if (process.env.NEXT_PUBLIC_ANALYTICS) {
    // Send to analytics service
    fetch('/api/analytics/metrics', {
      method: 'POST',
      body: JSON.stringify(metric),
    })
  }
}
```

### Synthetic Monitoring

```bash
# Schedule recurring Lighthouse audits
# GitHub Actions workflow (.github/workflows/lighthouse.yml)

name: Lighthouse CI
on:
  schedule:
    - cron: '0 8 * * 0' # Weekly Sunday 8am

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: nodejs/setup-node@v2
      - run: npm ci && npm run build
      - run: npx lhci autorun
```

### Error Tracking

```typescript
// Catch and report errors
try {
  await fetchCommunityFeed()
} catch (error) {
  console.error('Feed load failed:', error)
  // Send to error tracking service
  reportError(error, {
    page: 'community-feed',
    user: session?.user?.id,
  })
}
```

---

## 11. Production Deployment Optimization

### Environment Variables

```.env.production
# Enable optimizations
NODE_ENV=production
NEXT_PUBLIC_ANALYTICS=true

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=mudyin
```

### Build Output

```bash
# Verify build is optimized
npm run build

# Check bundle size
npx next-bundle-analyzer

# Output should show:
# - All routes code-split
# - Images optimized
# - CSS tree-shaken
```

### Vercel Deployment

If using Vercel (recommended for Next.js):
- Automatic global CDN
- Automatic image optimization
- Automatic code splitting
- Automatic caching
- Web Vitals monitoring included

```bash
# Deploy to Vercel
npm install -g vercel
vercel
```

---

## 12. Load Testing

### Target: 1000 Concurrent Users

```bash
# Install Apache Bench or similar
# Test feed endpoint
ab -n 10000 -c 100 http://localhost:3000/api/community/posts

# Test gallery endpoint
ab -n 5000 -c 50 http://localhost:3000/api/gallery/photos
```

### What to Monitor

- Response time: < 500ms (99th percentile)
- Error rate: < 0.1%
- CPU usage: < 80%
- Memory: < 2GB
- Database connections: < 20

### Tools

- **Apache Bench**: Simple, built-in
- **wrk**: Performance testing
- **Artillery**: Load testing with scenarios
- **k6**: Load testing by Grafana

---

## Checklist for Launch

- [ ] Lighthouse scores all >90 (or documented exceptions)
- [ ] Core Web Vitals meet targets (LCP <2.5s, CLS <0.1)
- [ ] All images using Image component or Cloudinary
- [ ] Database queries optimized (no N+1 queries)
- [ ] Heavy components lazy-loaded (dynamic imports)
- [ ] Static content pre-rendered where possible
- [ ] Cache headers set on API responses
- [ ] Bundle size < 250kb gzipped
- [ ] Mobile responsive and tested
- [ ] Accessibility audit passed (WCAG 2.1 AA)
- [ ] Performance monitored in production
- [ ] Error tracking enabled
- [ ] Load testing passed (1000 concurrent users)

---

## Resources

- [Lighthouse Documentation](https://developers.google.com/web/tools/lighthouse)
- [Web.dev Performance Guide](https://web.dev/performance/)
- [Next.js Image Optimization](https://nextjs.org/docs/api-reference/next/image)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Core Web Vitals Guide](https://web.dev/vitals/)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)

---

**Version**: 1.0
**Last Updated**: February 2026
**Next Review**: After first production deployment
