# Sprint 2: User Profiles - Quick Reference

## What You Can Now Do

### 1. 👤 View Your Profile
- Navigate to `/community/members/[userId]`
- See your avatar, name, program, bio
- View your badges/achievements
- See stats: posts, photos, comments, followers, following
- Join date and days in community displayed

### 2. 🎨 Upload an Avatar
- Click profile menu → "My Profile"
- Drag-and-drop or click to select image
- Preview before uploading
- Auto-saves to profile

### 3. ✏️ Edit Your Profile
- Update bio (max 500 chars)
- Select primary program
- Set privacy level (Public, Members Only, Private)
- All changes saved immediately

### 4. 🫂 Follow Members
- Click "Follow" button on any profile
- Button changes to "Following"
- Build your follower network
- See follower/following counts on profiles

### 5. 📋 Browse All Members
- Go to `/community/members`
- Search by name
- Filter by program
- See member cards with avatars, bios, badges
- Click to view full profile

### 6. 🏆 Unlock Achievements
Earn badges by:
- **100 Days Strong**: Reach 100 days in YSMP
- **YSMP Champion**: Reach 365 days in YSMP
- **Program Graduate**: Complete a program
- **Community Contributor**: 50+ comments or 20+ posts
- **Storyteller**: 5+ photos or 10+ posts
- **Mentor**: Get 100+ followers
- **Cultural Keeper**: Share cultural knowledge

## New Pages

| URL | Purpose |
|-----|---------|
| `/community/members` | Browse all members with search/filter |
| `/community/members/[userId]` | View any member's full profile |
| `/community/members/[userId]/edit` | Edit own profile (future) |

## New API Endpoints

```
GET    /api/community/profiles?search=name&program=YSMP&page=1
GET    /api/community/profiles?userId=xyz
PUT    /api/community/profiles
POST   /api/community/avatars/upload
POST   /api/community/connections
GET    /api/community/connections?userId=xyz&type=followers
```

## Components Built

| Component | Purpose |
|-----------|---------|
| `UserProfileMenu` | Dropdown menu with profile links in nav |
| `AvatarUpload` | Image upload widget |
| `BadgeDisplay` | Render badges with tooltips |
| `ProfileEditForm` | Form to edit bio, program, privacy |
| `FollowButton` | Toggle follow/unfollow state |

## UI Flows

### User Registration → Profile Creation
```
Signup (/auth/register)
  ↓
Email Verification
  ↓
Age Verification Modal
  ↓
Parental Consent (if <13)
  ↓
Auto-created Profile ✨ NEW
  ↓
Can now upload avatar & edit bio
```

### Profile Discovery
```
Member Directory (/community/members)
  ↓
Search by Name / Filter by Program
  ↓
Click Member Card
  ↓
View Full Profile (/community/members/[id])
  ↓
Follow / View Stats / See Badges
```

### Profile Customization
```
Navigation: Click Avatar Icon
  ↓
User Menu Dropdown
  ↓
Click "My Profile"
  ↓
Upload Avatar & Edit Bio
  ↓
Changes Save Instantly
```

## Styling Notes

- **Colors**: Uses existing ochre (#d2a855), sage (#9dc183), charcoal (#141414)
- **Cards**: White background with subtle borders
- **Buttons**: Ochre primary, Sage secondary
- **Responsive**: Mobile 1 col → Tablet 2 cols → Desktop 3 cols
- **Hover Effects**: Scale, color change, shadow

## Database Changes

**No new migrations needed** - Sprint 1 already created:
- User model with followers/following relations
- UserProfile model with bio, avatar, program, badges, privacyLevel

**New data being stored:**
- User avatars (URLs)
- User bios
- User selected program
- Badges array per user
- Follow relationships between users

## Testing Tips

### Create Test Scenario
1. Register 3 test accounts
2. Upload different avatars for each
3. Have Account A follow Accounts B & C
4. Search member directory
5. Check badges (should be empty until program dates reached)

### Check API Responses
```bash
# Search members
curl "http://localhost:3000/api/community/profiles?search=john&page=1"

# Get specific user profile
curl "http://localhost:3000/api/community/profiles?userId=abc123xyz"

# Check followers
curl "http://localhost:3000/api/community/connections?userId=abc123xyz&type=followers"
```

## Common Tasks

### I want to customize my profile
1. Click profile avatar in top-right nav
2. Select "My Profile"
3. Update bio, program, privacy
4. Upload new avatar
5. Changes auto-save ✓

### I want to follow someone
1. Visit their profile page
2. Click "Follow" button
3. Button changes to "Following" ✓

### I want to find members
1. Go to /community/members
2. Use search or program filter
3. Click any member card
4. View their full profile ✓

### I want to see my achievements
1. Go to your profile
2. Scroll to "Achievements" section
3. Hover over badges to see description ✓

## Performance

- Member search: debounced 300ms
- Directory pagination: 20 members per page
- Badge checking: happens on profile view
- Avatar CDN: Cloudinary ready (placeholder for now)

## What's NOT Included Yet

❌ Activity timeline (coming Sprint 5)
❌ Privacy enforcement in views (coming Sprint 5)
❌ Member messaging (coming later)
❌ Profile themes (enhancement)
❌ Member recommendations (enhancement)

## Next: Sprint 3 - Gallery

Sprint 3 will build:
- Photo upload with drag-and-drop
- Gallery grid with masonry layout
- Photo detail pages with lightbox
- Comments on photos
- Like/reaction system
- Search and filtering by program/event
- Collections and albums
