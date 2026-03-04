# Sprint 4 Testing Guide: Gallery Polish

## Overview
This document outlines comprehensive testing for Sprint 4 features including trending algorithms, performance optimizations, notifications, and gallery polish.

## Features Implemented in Sprint 4

### 1. Trending Algorithm (`src/lib/trending.ts`)
- **Engagement scoring**: likes * 1.0 + comments * 2.0
- **Recency weighting**: 1.0 for <7 days, 0.75 for 8-14, 0.5 for 15-30, 0.25 for >30
- **API endpoints**: `/api/gallery/trending` with program filtering

### 2. Collections System (`src/app/api/gallery/collections/route.ts`)
- **GET**: Fetch paginated collections (20 per page)
- **POST**: Create new collections
- **Include**: Photo counts and sample images

### 3. Tag Autocomplete (`src/components/gallery/TagAutocomplete.tsx`)
- **Component**: Dropdown with keyboard navigation
- **Features**: Debounced API calls (300ms), prevents duplicates, max 10 tags
- **API**: `/api/gallery/tags` returns top 10 matching tags

### 4. Before-After Slider (`src/components/gallery/BeforeAfterSlider.tsx`)
- **Interactive**: Draggable handle with mouse/touch support
- **Display**: Before image on left, after on right, labels in corners
- **Smooth**: CSS transitions and responsive positioning

### 5. Notification System
- **Database**: Notification model with user relations
- **API endpoints**:
  - `GET /api/notifications` - Fetch with pagination
  - `POST /api/notifications` - Create notification
  - `PATCH /api/notifications/[id]` - Mark as read
  - `DELETE /api/notifications/[id]` - Delete
- **UI**: NotificationBell component in navigation

### 6. Performance Optimizations
- **Database indexes**:
  - GalleryPhoto: uploaderId, program, event, createdAt, flaggedForReview
  - CommunityPost: authorId, program, createdAt, isPinned, isFeatured
  - Notification: userId + createdAt, userId + isRead
- **Caching**: In-memory cache with TTL (5 min for trending, 1 hr for profiles)
- **Query optimization**: Select only needed fields, eager loading where needed

### 7. Trending Section
- **Component**: TrendingCarousel at top of gallery
- **Features**: 5-photo carousel, engagement stats, photographer info
- **API**: `/api/gallery/trending` with caching

### 8. My Uploads Page
- **UI**: Photo grid with sort/filter options
- **Actions**: View, edit, delete photos
- **Stats**: Engagement metrics per photo
- **API**: `/api/gallery/my-uploads`

---

## Unit Testing Checklist

### Trending Algorithm
- [ ] Calculate score correctly for photos with 10 likes, 5 comments
- [ ] Apply recency multiplier: 1.0 for 3 days old, 0.75 for 10 days, etc.
- [ ] Handle edge cases: 0 likes/comments, very old photos
- [ ] Sort photos by descending score

### Tag Autocomplete
- [ ] API returns empty array for search < 2 chars
- [ ] API returns top 10 tags sorted by frequency
- [ ] Component prevents duplicate tags
- [ ] Component enforces max 10 tag limit
- [ ] Keyboard navigation: ArrowDown, ArrowUp, Enter, Escape, Backspace
- [ ] Debounce works (300ms delay before API call)

### Notifications
- [ ] Create notification with all required fields
- [ ] Fetch unread notifications (isRead=false)
- [ ] Mark notification as read (update isRead, set readAt)
- [ ] Delete notification
- [ ] Count unread notifications correctly
- [ ] Notifications ordered by createdAt descending

### Database Indexes
- [ ] Indexes created on all specified columns
- [ ] Query plans use indexes (analyze with EXPLAIN)
- [ ] Index on compound key (userId, isRead) speeds up unread fetch

### Cache
- [ ] Set and get values with TTL
- [ ] Expired entries return null
- [ ] Manual delete works
- [ ] Cleanup removes expired entries
- [ ] Cache keys generated correctly

---

## Integration Testing Checklist

### End-to-End Gallery Flows

#### Upload & View Photo
- [ ] User uploads photo with title, description, alt text, tags
- [ ] Photo appears in gallery grid within 1 second
- [ ] Photo clickable → detail page loads
- [ ] Can see uploader info, like count, comment count
- [ ] Tags clickable and filter gallery

#### Engagement
- [ ] Like button toggles (heart fills/unfills)
- [ ] Like count increments/decrements
- [ ] Comment form submits and appears below photo
- [ ] Comments have author avatar, name, timestamp
- [ ] Can delete own comments with confirmation
- [ ] Delete removes comment from UI

#### My Uploads
- [ ] Navigate to /gallery/my-uploads
- [ ] See all uploaded photos
- [ ] Sort by newest/oldest/liked works
- [ ] Filter by public/members-only works
- [ ] Hover shows View/Edit/Delete buttons
- [ ] Delete opens confirmation modal
- [ ] Confirmed delete removes photo

#### Trending
- [ ] Trending carousel loads with 5 photos
- [ ] Carousel shows correct data: title, photographer, engagement stats
- [ ] Previous/Next buttons work
- [ ] Dot indicators show current slide
- [ ] Can click dots to jump to slide
- [ ] Photos sorted by trending score (highest first)
- [ ] Cache prevents repeated API calls (check Network tab)

#### Notifications
- [ ] Notification bell appears in navigation
- [ ] Unread count badge shows correct number
- [ ] Click bell opens dropdown with notifications
- [ ] Notifications show title, message, icon, timestamp
- [ ] Click notification marks as read (badge count decreases)
- [ ] Delete button removes notification
- [ ] Dropdown closes on outside click
- [ ] "View all" link goes to notifications page

### Performance Integration
- [ ] Gallery loads in < 2 seconds on first load
- [ ] Masonry grid renders 30+ photos without lag
- [ ] Trending carousel loads within 500ms
- [ ] Notifications dropdown opens within 200ms
- [ ] Search results return in < 1 second
- [ ] Infinite scroll loads next page smoothly

---

## UI/UX Testing Checklist

### Visual Design
- [ ] TrendingCarousel uses correct color palette (Ochre, Charcoal, Sage)
- [ ] Cards have consistent spacing and shadows
- [ ] Tags display with Sage background color
- [ ] Buttons use Ochre for primary actions
- [ ] Icons align properly in components
- [ ] Responsive design works on mobile (375px), tablet (768px), desktop (1024px+)

### Accessibility
- [ ] Notification bell has aria-label
- [ ] Trending carousel has keyboard navigation (arrow keys)
- [ ] Delete confirmations have proper focus management
- [ ] Buttons have :focus-visible styles
- [ ] Color contrast meets WCAG AA (4.5:1 for text)
- [ ] Alt text provided for all images
- [ ] Screen reader announces notification count

### User Experience
- [ ] Upload flow returns to gallery after success
- [ ] Delete confirmation prevents accidental deletes
- [ ] Loading states show for async operations
- [ ] Empty states have CTA buttons
- [ ] Error messages are clear and actionable
- [ ] Success notifications appear after actions

---

## API Testing Checklist

### Trending Endpoint (`/api/gallery/trending`)
```
GET /api/gallery/trending?limit=5&timeWindow=week&program=YSMP
Response:
{
  "photos": [...],
  "cached": true/false
}
```
- [ ] Limit parameter works (1-100)
- [ ] timeWindow parameter: 'week' or 'month'
- [ ] program parameter filters correctly
- [ ] Returns photos sorted by score
- [ ] Includes uploader info and engagement counts
- [ ] Cache hits return `cached: true`

### Notifications Endpoint (`/api/notifications`)
```
GET /api/notifications?limit=20&offset=0&unread=true
Response:
{
  "notifications": [...],
  "total": number,
  "unreadCount": number
}
```
- [ ] Pagination works correctly
- [ ] unread filter works
- [ ] Returns correct count of unread
- [ ] Requires x-user-id header
- [ ] Returns 401 without authentication

### My Uploads Endpoint (`/api/gallery/my-uploads`)
```
GET /api/gallery/my-uploads?page=1
Response:
{
  "photos": [...],
  "total": number,
  "hasMore": boolean
}
```
- [ ] Returns only authenticated user's photos
- [ ] Pagination works (page=1, page=2, etc.)
- [ ] Includes engagement counts
- [ ] Returns 401 without authentication

### Collections Endpoint (`/api/gallery/collections`)
```
GET /api/gallery/collections?page=1
Response:
{
  "collections": [...],
  "total": number,
  "hasMore": boolean
}
```
- [ ] GET returns paginated collections
- [ ] Includes photo counts
- [ ] Includes sample image URL
- [ ] POST creates new collection
- [ ] Name validation (min 3 chars)

### Tags Endpoint (`/api/gallery/tags`)
```
GET /api/gallery/tags?search=culture
Response:
{
  "tags": ["cultural", "culture", "cultural_heritage"]
}
```
- [ ] Search parameter required (min 2 chars)
- [ ] Returns matching tags sorted by frequency
- [ ] Returns max 10 results
- [ ] Case-insensitive matching

---

## Performance Testing Checklist

### Lighthouse Audit
- [ ] Performance score > 90
- [ ] Accessibility score > 90
- [ ] Best Practices score > 90
- [ ] SEO score > 90
- [ ] FCP (First Contentful Paint) < 1.8s
- [ ] LCP (Largest Contentful Paint) < 2.5s
- [ ] CLS (Cumulative Layout Shift) < 0.1

### Load Testing
- [ ] Gallery loads with 100 photos: no lag
- [ ] Feed renders with 50 posts: smooth scroll
- [ ] Search with 1000 results: responsive
- [ ] Multiple notifications (100+): dropdown loads quickly

### Database Query Performance
- [ ] Gallery list query (with trending, likes, comments): < 200ms
- [ ] User profile query (with badges, follower count): < 100ms
- [ ] Trending calculation (50 photos): < 500ms
- [ ] Explain plan shows indexes being used

### Memory Usage
- [ ] Cache doesn't grow indefinitely
- [ ] Expired entries cleaned up
- [ ] No memory leaks in components

---

## Browser Compatibility Testing

- [ ] Chrome (latest): All features work
- [ ] Firefox (latest): All features work
- [ ] Safari (latest): All features work
- [ ] Edge (latest): All features work
- [ ] Mobile Safari (iOS 15+): All features work
- [ ] Chrome Android: All features work

---

## Security Testing Checklist

### Authentication
- [ ] Cannot access /gallery/my-uploads without auth
- [ ] Cannot access notifications API without auth
- [ ] x-user-id header required for protected endpoints
- [ ] Cannot delete other users' photos
- [ ] Cannot edit other users' notifications

### XSS Prevention
- [ ] Photo titles sanitized (no script tags)
- [ ] Comments sanitized
- [ ] Tags sanitized
- [ ] User-generated content escaped in JSX

### SQL Injection
- [ ] All queries use Prisma (parameterized)
- [ ] No raw SQL queries
- [ ] Search inputs validated

---

## Bug Fixes During Testing

Document any bugs found and their fixes:

1. **Trending Carousel Image Loading**
   - Issue: Images not loading on first render
   - Fix: Added `priority` flag to first Image, `fill` + `object-cover` for sizing

2. **Notification Dropdown Close**
   - Issue: Dropdown stays open on outside click
   - Fix: Added document.addEventListener for mousedown outside ref

3. **Cache Expiration**
   - Issue: Expired entries not being removed
   - Fix: Added cleanup interval every 5 minutes

---

## Performance Benchmarks

Record baseline performance metrics:

| Metric | Target | Actual |
|--------|--------|--------|
| Gallery load | < 2s | ___ |
| Photo upload | < 5s | ___ |
| Trending carousel | < 500ms | ___ |
| Notification fetch | < 200ms | ___ |
| Comment submit | < 1s | ___ |
| Like toggle | < 300ms | ___ |

---

## Sign-Off

Sprint 4 is complete and ready for production when:

- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] Lighthouse audit > 90 across all categories
- [ ] No critical bugs found
- [ ] Responsive design tested on 3+ breakpoints
- [ ] Accessibility tested with keyboard navigation
- [ ] Performance meets all benchmarks
- [ ] Security tests passed
- [ ] Browser compatibility confirmed
- [ ] Team code review approved

**Tester:** ________________
**Date:** ________________
**Sign-Off:** ✓ Ready for Production / ✗ Needs Work

---

## Next Steps (Sprint 5)

After Sprint 4 completion:
1. Deploy to staging environment
2. Run 48-hour smoke testing
3. Performance monitoring in production
4. Begin Sprint 5: Community Feed implementation
