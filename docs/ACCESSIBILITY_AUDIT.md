# Accessibility Audit Guide - WCAG 2.1 Level AA Compliance

**Target**: WCAG 2.1 Level AA compliance
**Version**: 1.0
**Last Updated**: February 2026

---

## Executive Summary

**Compliance Target**: WCAG 2.1 Level AA (internationally recognized accessibility standard)

**What This Means**:
- Accessible to users with disabilities
- Works without mouse (keyboard-only)
- Works with screen readers
- Readable color contrast
- Understandable language
- Predictable navigation
- Error prevention and recovery

**Why This Matters for Mudyin**:
- Users with disabilities need access too
- Legal requirement in Australia (Disability Discrimination Act)
- Improves usability for everyone
- Better search engine ranking

---

## WCAG 2.1 Structure

### Three Levels
- **A**: Minimum
- **AA**: Standard (Mudyin target) ⭐
- **AAA**: Enhanced

### Four Principles
1. **Perceivable**: Users can see/hear content
2. **Operable**: Users can navigate and interact
3. **Understandable**: Users comprehend content
4. **Robust**: Works with assistive tech

---

## 1. PERCEIVABLE - Content Can Be Seen/Heard

### 1.1 Text Alternatives (Images)

**Requirement**: All non-text content has text alternative

**Images That Require Alt Text**:
```jsx
// ✅ Good - descriptive alt text
<Image
  src="/photo.jpg"
  alt="Group of participants celebrating 100-day milestone at YSMP event"
/>

// ❌ Bad - no alt text
<Image src="/photo.jpg" />

// ❌ Bad - vague alt text
<Image src="/photo.jpg" alt="photo" />
```

**Alt Text Guidelines**:
- Describe PURPOSE, not "image of"
- Be concise (125 characters max)
- Don't start with "Image of"
- Include relevant context
- For photos with text, include text

**Examples**:
```
✅ "Jane's face lighting up as she receives her 100-day badge"
✅ "Before/after side-by-side of participant's journal pages"
❌ "Image of girl smiling"
❌ "Photo"
❌ "IMG_2024.JPG"
```

**Decorative Images**:
```jsx
// If purely decorative, use empty alt text
<Image
  src="/decorative-border.png"
  alt=""
  aria-hidden="true"
/>
```

### 1.2 Multimedia

**Requirement**: Videos and audio have captions/transcripts

**Video Content**:
- ✅ Add captions/subtitles to all videos
- ✅ Provide transcript in text
- ✅ Audio description for critical visuals
- ✅ Not auto-playing (or muted by default)

**Audio Content**:
- ✅ Provide transcript
- ✅ Text alternative of speech

**Current App Status**: No video support yet (future feature)

### 1.3 Adaptable

**Requirement**: Content adapts to different screen sizes/zoom

**Testing**:
```
Test Cases:
1. Zoom to 200%: Can still read and navigate?
2. Zoom to 400%: Can still read (single column)?
3. Mobile (320px): All features accessible?
4. Tablet (768px): Proper layout?
5. Desktop (1024px+): Full layout?
```

**Responsive Design**:
```css
/* ✅ Good - responsive */
.card {
  width: 100%;
  max-width: 800px;
  padding: 1rem;
}

@media (min-width: 768px) {
  .card {
    padding: 2rem;
  }
}

/* ❌ Bad - fixed width */
.card {
  width: 800px;
}
```

**Reflow**: Content should adapt to viewport (no horizontal scroll at 200% zoom)

### 1.4 Distinguishable

**Requirement**: Content is easy to see/read

**Color Contrast**:
- Normal text: 4.5:1 ratio minimum
- Large text (18pt+): 3:1 ratio minimum
- Non-text (UI): 3:1 ratio minimum

**Test Color Contrast**:
```bash
# Use WebAIM contrast checker
# https://webaim.org/resources/contrastchecker/

# Or in terminal
npm install -g pa11y
pa11y http://localhost:3000/community
```

**Current Colors**:
- Muted gold (#c8a75d) on deep brown (#2f241d): Good contrast for accent text.
- Sage (#9dc183) on charcoal: ✅ Good (~4:1)
- White on charcoal: ✅ Excellent (~15:1)

**Avoid**:
- Gray on white (low contrast)
- Light colors on light backgrounds
- Relying on color alone to convey info

**Font Size**:
- Minimum 14px for body text
- 16px+ recommended
- Increase to 18px for better readability

**Line Height**:
- Minimum 1.5x font size
- Example: 16px text → 24px line height

---

## 2. OPERABLE - Users Can Navigate/Interact

### 2.1 Keyboard Accessible

**Requirement**: All functionality available via keyboard

**Essential Keys**:
- **Tab**: Move to next element
- **Shift+Tab**: Move to previous element
- **Enter**: Activate button
- **Space**: Check checkbox, toggle button
- **Escape**: Close modal/dropdown
- **Arrow Keys**: Navigate menu/tabs

**Testing Keyboard Navigation**:
```
Steps:
1. Disconnect mouse
2. Use only Tab key to navigate
3. Can reach all interactive elements?
4. Can activate buttons/links?
5. Can close modals?
6. Can tab order makes sense? (top-to-bottom, left-to-right)
```

**Keyboard Implementation**:

```jsx
// ✅ Good - keyboard support
<button
  onClick={handleLike}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleLike()
    }
  }}
  tabIndex={0}
>
  Like
</button>

// ✅ Good - custom keyboard for dropdowns
<div
  role="listbox"
  onKeyDown={(e) => {
    if (e.key === 'ArrowDown') {
      moveFocusToNext()
    }
    if (e.key === 'ArrowUp') {
      moveFocusToPrevious()
    }
    if (e.key === 'Enter') {
      selectFocused()
    }
  }}
>
  {options.map((opt) => (
    <div
      key={opt.id}
      role="option"
      tabIndex={-1}
      ref={(el) => (focusableElements.current[index] = el)}
    >
      {opt.name}
    </div>
  ))}
</div>
```

**Tab Order**:
```jsx
// ✅ Natural HTML order (top-to-bottom)
<nav>
  <a href="/">Home</a>
  <a href="/about">About</a>
  <a href="/contact">Contact</a>
</nav>
<main>
  <h1>Welcome</h1>
  <button>Start</button>
</main>

// ❌ Bad - tabindex > 0 creates confusing order
<div tabIndex="1">First in tab order</div>
<div tabIndex="0">Second in tab order</div> {/* Wrong! */}

// ✅ Good - use tabIndex only for 0 or -1
<div tabIndex="0">Keyboard accessible</div> {/* Tab stops here */}
<div tabIndex="-1">Not tabstop but focusable by JS</div>
```

**Skip Links** (jump over navigation):
```jsx
<a href="#main-content" className="sr-only">
  Skip to main content
</a>

<header>Navigation...</header>

<main id="main-content">
  Content...
</main>
```

### 2.2 No Keyboard Traps

**Requirement**: Can always escape using keyboard

**Test**:
```
Tab through page:
- Can you get into modals?
- Can you get OUT of modals (Escape key)?
- Can you exit dropdowns?
- Can you get out of the form?
```

**Implementation**:
```jsx
// ✅ Good - Escape closes modal
export function ReportForm() {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  return (
    <dialog open={isOpen}>
      <form onSubmit={handleSubmit}>
        {/* Form fields */}
        <button type="submit">Submit</button>
      </form>
    </dialog>
  )
}
```

### 2.3 No Seizures

**Requirement**: Content doesn't flash more than 3 times per second

**What's Forbidden**:
- Strobing animations
- Flashing content
- Rapidly changing backgrounds

**Current App**: No flashing content ✅

### 2.4 Navigable

**Requirement**: Users understand where they are and how to navigate

**Page Titles**:
```html
<title>Community Feed - Mudyin</title> <!-- ✅ Good -->
<title>Page</title> <!-- ❌ Bad -->
```

**Heading Hierarchy**:
```jsx
// ✅ Good
<h1>Community Feed</h1>         {/* Main page heading */}
<h2>Recent Posts</h2>            {/* Section heading */}
<h3>Post by Jane</h3>            {/* Sub-section */}
<p>Post content...</p>

// ❌ Bad - skipping levels
<h1>Community Feed</h1>
<h3>Recent Posts</h3>  {/* Should be h2 */}

// ❌ Bad - no h1
<h2>Featured</h2>
<h2>Posts</h2>
```

**Link Text**:
```jsx
// ✅ Good - descriptive
<a href="/community/members/jane">
  View Jane's profile
</a>

// ❌ Bad - vague
<a href="/community/members/jane">
  Click here
</a>

// ❌ Bad - too generic
<a href="/community/members/jane">
  Read more
</a>
```

**Focus Visible**:
```css
/* ✅ Good - visible focus indicator */
button:focus {
  outline: 2px solid var(--color-ochre-400);
  outline-offset: 2px;
}

/* ❌ Bad - invisible focus */
button:focus {
  outline: none;
}
```

---

## 3. UNDERSTANDABLE - Users Comprehend Content

### 3.1 Readable

**Requirement**: Text is readable and understandable

**Language**:
```html
<!-- ✅ Declare language -->
<html lang="en-AU">

<!-- ✅ Specify language changes -->
<p>Welcome to <span lang="nrf">Dharug</span> country</p>
```

**Text Alternatives**:
- Short alt text for images
- Captions for videos
- Definitions for technical terms
- Expanded forms for abbreviations

```jsx
// ✅ Good - abbreviation expanded
<abbr title="Youth Sexual Motivation Program">YSMP</abbr>

// ✅ Good - first use expanded
<p>The <abbr title="Aboriginal Health">AH</abbr> team provides support.</p>
```

**Reading Level**:
- Use simple language
- Short sentences
- Active voice
- Avoid jargon

### 3.2 Predictable

**Requirement**: Things work as expected

**Navigation Consistency**:
- Menu in same place on every page
- Same menu items mean same things
- Logo links to home (always)

**Form Behavior**:
```jsx
// ✅ Good - form behaves predictably
<form onSubmit={handleSubmit}>
  <label htmlFor="content">Post Content</label>
  <textarea id="content" required />
  <button type="submit">Create Post</button>
  {/* Error messages shown, no surprises */}
</form>

// ❌ Bad - unexpected behavior
<form onSubmit={() => window.location.href = '/'}>
  {/* Form submits and navigates away - unexpected */}
</form>
```

**On Focus**:
- Don't change page on focus
- Don't open windows on focus
- Don't submit forms on focus

```jsx
// ✅ Good - no surprise on focus
<input
  onFocus={() => {
    /* Maybe clear field or show hint, but don't navigate */
  }}
/>

// ❌ Bad - surprises user on focus
<input
  onFocus={() => {
    window.location.href = '/surprise'
  }}
/>
```

### 3.3 Input Assistance

**Requirement**: Users get help with forms

**Form Labels**:
```jsx
// ✅ Good - label associated with input
<label htmlFor="email">Email Address</label>
<input id="email" type="email" />

// ❌ Bad - label not associated
<label>Email Address</label>
<input type="email" />

// ❌ Bad - no label
<input type="email" placeholder="Email" />
```

**Error Messages**:
```jsx
// ✅ Good - specific error message
{errors.email && (
  <span role="alert" className="error">
    Email must be in format: user@example.com
  </span>
)}

// ❌ Bad - vague error
{errors.email && <span className="error">Invalid input</span>}
```

**Required Fields**:
```jsx
// ✅ Good - marked as required
<label htmlFor="name">
  Name <span aria-label="required">*</span>
</label>
<input id="name" required aria-required="true" />

// ❌ Bad - unclear
<label htmlFor="name">Name</label>
<input id="name" />
```

---

## 4. ROBUST - Works with Assistive Technology

### 4.1 Semantic HTML

**Use correct HTML elements**:
```jsx
// ✅ Good - semantic HTML
<header>
  <nav>
    <a href="/">Home</a>
    <a href="/about">About</a>
  </nav>
</header>

<main>
  <article>
    <h1>Post Title</h1>
    <p>Post content...</p>
  </article>
</main>

<footer>
  <p>© 2026 Mudyin</p>
</footer>

// ❌ Bad - meaningless divs
<div>
  <div>
    <a href="/">Home</a>
    <a href="/about">About</a>
  </div>
</div>

<div>
  <div>
    <div>Post Title</div>
    <p>Post content...</p>
  </div>
</div>
```

### 4.2 ARIA Roles & Labels

**When to use ARIA**:
- When no semantic HTML element exists
- To enhance native elements
- Never to replace semantic HTML

**Common ARIA Patterns**:

```jsx
// ✅ Modal dialog
<div
  role="dialog"
  aria-labelledby="modal-title"
  aria-modal="true"
>
  <h2 id="modal-title">Confirm Action</h2>
  <p>Are you sure?</p>
  <button>Yes</button>
  <button>No</button>
</div>

// ✅ Live region (announce new content)
<div aria-live="polite" aria-atomic="true">
  {notificationMessage}
</div>

// ✅ Button icon
<button aria-label="Like post">
  <HeartIcon /> {/* Icon has no text */}
</button>

// ✅ Invisible label
<label htmlFor="search" className="sr-only">
  Search community posts
</label>
<input id="search" placeholder="Search" />

// ✅ Alert
<div role="alert" className="error">
  Password must be at least 8 characters
</div>
```

**aria-hidden**:
```jsx
// ✅ Good - hide decorative elements
<span aria-hidden="true">→</span> {/* Decorative arrow */}

// ✅ Good - hide icon-only buttons that have label
<button aria-label="Close">
  <XIcon aria-hidden="true" />
</button>

// ❌ Bad - hiding content users need
<div aria-hidden="true">Important information</div>
```

### 4.3 Testing with Screen Readers

**Screen Readers to Test**:
- **Windows**: NVDA (free), JAWS (paid)
- **Mac**: VoiceOver (built-in)
- **iOS**: VoiceOver (built-in)
- **Android**: TalkBack (built-in)

**Testing Checklist**:
```
With screen reader ENABLED:
□ Can read page heading hierarchy
□ Can navigate to all links/buttons
□ Can read alt text on images
□ Can read form labels
□ Can understand form errors
□ Can identify current page
□ Links have descriptive text
□ Buttons announce their purpose
□ Can access all functionality
□ Skipping to main content works
```

**NVDA Testing** (Windows):
```bash
# Download NVDA
# https://www.nvaccess.org/

# Navigate page with screen reader
# Use numeric keypad to navigate
# Test keyboard-only navigation
```

---

## WCAG 2.1 AA Checklist

### Perceivable (P)
- [ ] All images have alt text
- [ ] Alt text describes purpose/content
- [ ] Color contrast 4.5:1 (normal text)
- [ ] Color contrast 3:1 (large text/UI)
- [ ] Don't rely on color alone
- [ ] Videos have captions
- [ ] Audio has transcript
- [ ] Content reflows at 200% zoom
- [ ] No flashing > 3x per second

### Operable (O)
- [ ] All functionality keyboard accessible
- [ ] Tab order logical (top-to-bottom, left-to-right)
- [ ] Focus visible (2px outline)
- [ ] No keyboard traps
- [ ] Page title descriptive
- [ ] Heading hierarchy correct
- [ ] Link text descriptive
- [ ] Multiple ways to find content (menu, search)

### Understandable (U)
- [ ] Page language declared (en-AU)
- [ ] Form labels associated with inputs
- [ ] Form errors specific and clear
- [ ] Required fields marked
- [ ] Error messages positioned near inputs
- [ ] Navigation consistent across site
- [ ] On-focus doesn't change context
- [ ] On-change doesn't change context

### Robust (R)
- [ ] Semantic HTML used correctly
- [ ] No parsing errors (valid HTML)
- [ ] ARIA used appropriately
- [ ] No duplicate IDs
- [ ] Attributes used correctly
- [ ] Works with screen readers
- [ ] Works with keyboard navigation
- [ ] Works without JavaScript

---

## Automated Testing Tools

### For Development

```bash
# Install axe DevTools
npm install --save-dev @axe-core/react

# Install WebAIM tools
npm install --save-dev jest-axe

# Run automated tests
npm test -- --coverage
```

### Browser Extensions

- **axe DevTools** (Chrome, Firefox, Edge)
- **WAVE** (Chrome, Firefox)
- **Lighthouse** (Chrome DevTools)
- **Pa11y** (Command-line tool)

### Lighthouse Accessibility Score

**Current Status**: To be measured
**Target**: 95+

```bash
# Run Lighthouse audit
npx lighthouse http://localhost:3000/community --output-path=lighthouse.html

# Check accessibility section
# Review any warnings
```

---

## Common Issues & Fixes

### Issue: Missing Alt Text

```jsx
// ❌ Before
<Image src="/photo.jpg" />

// ✅ After
<Image
  src="/photo.jpg"
  alt="Participants celebrating 100-day milestone in YSMP program"
/>
```

### Issue: Low Color Contrast

```css
/* ❌ Before */
.text {
  color: #888;
  background: #fff;
  /* Contrast: 2.4:1 - FAIL */
}

/* ✅ After */
.text {
  color: #444;
  background: #fff;
  /* Contrast: 6.8:1 - PASS */
}
```

### Issue: No Form Labels

```jsx
// ❌ Before
<input type="email" placeholder="Enter email" />

// ✅ After
<label htmlFor="email">Email Address</label>
<input id="email" type="email" />
```

### Issue: Keyboard Trap

```jsx
// ❌ Before - can't escape modal with Tab
<dialog open>
  <input autoFocus />
  {/* Tab cycles within dialog, can't leave */}
</dialog>

// ✅ After - Escape closes modal
<dialog
  open
  onKeyDown={(e) => {
    if (e.key === 'Escape') {
      closeDialog()
    }
  }}
>
  <input autoFocus />
</dialog>
```

### Issue: No Focus Indicator

```css
/* ❌ Before */
button:focus {
  outline: none;
}

/* ✅ After */
button:focus {
  outline: 2px solid var(--color-ochre-400);
  outline-offset: 2px;
}
```

---

## Accessibility For Different User Types

### Blind Users
- ✅ Screen reader compatible
- ✅ Descriptive alt text
- ✅ Semantic HTML
- ✅ Keyboard navigation
- ✅ Focus indicators

### Low Vision Users
- ✅ Large text supported
- ✅ High contrast colors
- ✅ Resizable content
- ✅ Zoom to 200% works
- ✅ No small text

### Deaf Users
- ✅ Video captions
- ✅ Audio transcripts
- ✅ Visual indicators (not sound-only)
- ✅ Form error text (not flash/beep)

### Motor Impairment
- ✅ Keyboard accessible
- ✅ Large click targets (min 44x44px)
- ✅ No time limits
- ✅ Predictable interactions
- ✅ Error recovery

### Cognitive Impairment
- ✅ Clear language
- ✅ Consistent navigation
- ✅ Predictable interactions
- ✅ Helpful error messages
- ✅ Confirmation before major actions

---

## Post-Launch Monitoring

### User Feedback
- Monitor accessibility reports
- Track user complaints
- Survey users with disabilities
- Iterate based on feedback

### Automated Monitoring
```bash
# Monthly accessibility audits
npm run lighthouse:accessibility

# Alert on regressions
if (score < 95) {
  alertDeveloperTeam()
}
```

### Continuous Improvement
- Quarterly accessibility reviews
- User testing with disabled users
- Staff training on accessibility
- Update docs with learnings

---

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Resources](https://webaim.org/)
- [Inclusive Components](https://inclusive-components.design/)
- [Accessibility Auditor Tool](https://wave.webaim.org/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)

---

## Compliance Certification

**Status**: Pending audit completion

**Once completed, Mudyin will be**:
- ✅ WCAG 2.1 Level AA compliant
- ✅ Accessible to users with disabilities
- ✅ Compliant with Australian Disability Discrimination Act
- ✅ Ready for public launch

---

**Version**: 1.0
**Last Updated**: February 2026
**Next Review**: Before production launch
