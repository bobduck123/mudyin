# Security Audit Guide - Mudyin Platform

**Version**: 1.0
**Last Updated**: February 2026
**Status**: Pre-Launch Security Review

---

## Executive Summary

**Security Goals**:
- ✅ Protect user data (especially minors)
- ✅ Prevent unauthorized access
- ✅ Block injection attacks
- ✅ Enforce rate limiting
- ✅ Validate all input
- ✅ Secure authentication
- ✅ Audit all actions
- ✅ Respond to incidents

**OWASP Top 10 Coverage**:
All top 10 vulnerabilities addressed

---

## 1. Input Validation & Sanitization

### All User Input Must Be Validated

**Points of Entry**:
- Form submissions
- API requests
- URL parameters
- File uploads
- Headers

### Zod Validation (Already Implemented)

```typescript
// src/lib/validators.ts
import { z } from 'zod'

// Registration
export const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8).regex(/[A-Z]/).regex(/[0-9]/).regex(/[!@#$%^&*]/),
  name: z.string().min(2).max(100),
  dateOfBirth: z.string().refine((date) => {
    const age = calculateAge(new Date(date))
    return age >= 13
  }, 'Must be at least 13 years old'),
})

// Post creation
export const createPostSchema = z.object({
  content: z.string().min(1).max(5000),
  tags: z.array(z.string()).max(10),
  visibility: z.enum(['public', 'members_only']),
  images: z.array(z.string().url()).optional(),
})

// All validation happens at route entry point
export async function POST(request: NextRequest) {
  const body = await request.json()
  const validation = createPostSchema.safeParse(body)

  if (!validation.success) {
    return NextResponse.json(
      { error: 'Invalid input', issues: validation.error.issues },
      { status: 400 }
    )
  }

  const data = validation.data
  // Process validated data
}
```

**Validation Checklist**:
- [ ] All form inputs validated
- [ ] API payloads validated
- [ ] File uploads validated (type + size)
- [ ] URL parameters validated
- [ ] Headers validated (auth, CORS)
- [ ] Database queries parameterized
- [ ] Error messages don't leak info

### File Upload Validation

```typescript
// Validate file type and size
export async function handleFileUpload(file: File) {
  // Type validation
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
  ]

  if (!allowedTypes.includes(file.type)) {
    throw new Error('Only images (JPEG, PNG, WebP, GIF) allowed')
  }

  // Size validation
  const maxSize = 10 * 1024 * 1024 // 10MB
  if (file.size > maxSize) {
    throw new Error('File too large (max 10MB)')
  }

  // Virus scan (optional, for production)
  await scanForViruses(file)

  // Upload to Cloudinary
  return await uploadToCloudinary(file)
}
```

---

## 2. SQL Injection Prevention

### Prisma Prevents SQL Injection

**Prisma uses parameterized queries**:
```typescript
// ✅ Safe - parameterized
const user = await prisma.user.findUnique({
  where: { email: userEmail },
})

// ✅ Safe - query builders
const posts = await prisma.communityPost.findMany({
  where: {
    program: selectedProgram,
    createdAt: {
      gte: startDate,
    },
  },
})

// ❌ NEVER do this - vulnerable
const query = `SELECT * FROM user WHERE email = '${userEmail}'`
// Don't use string concatenation with database queries!
```

**Best Practices**:
- Always use Prisma methods (never raw SQL)
- Use type-safe queries
- Trust Prisma's escaping

---

## 3. Cross-Site Scripting (XSS) Prevention

### React Escapes by Default

```jsx
// ✅ Safe - React escapes HTML by default
<div>{userProvidedText}</div>

// Even if userProvidedText contains <script>alert('xss')</script>
// React renders it as text, not executable code
```

### dangerouslySetInnerHTML - NEVER Use

```jsx
// ❌ DANGEROUS - Don't do this!
<div dangerouslySetInnerHTML={{ __html: userContent }} />
// This executes scripts!

// ✅ Safe - use React's default escaping
<div>{userContent}</div>
```

### URLs Need Sanitization

```jsx
// ❌ Vulnerable - user can inject javascript:
<a href={userProvidedUrl}>Click</a>

// ✅ Safe - validate URL
function isSafeUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    // Only allow http/https
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

<a href={isSafeUrl(url) ? url : '#'}>Click</a>
```

### Content Security Policy (CSP)

**Next.js Headers** (`next.config.ts`):
```typescript
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        {
          key: 'Content-Security-Policy',
          value:
            "default-src 'self'; " +
            "script-src 'self' 'unsafe-inline' *.vercel.app; " +
            "style-src 'self' 'unsafe-inline'; " +
            "img-src 'self' https: data:; " +
            "font-src 'self' data:",
        },
      ],
    },
  ]
}
```

---

## 4. Cross-Site Request Forgery (CSRF) Prevention

### NextAuth Handles CSRF

**NextAuth automatically**:
- Creates CSRF tokens
- Validates on POST requests
- Validates on state-changing operations

**No extra setup needed** - it's built in

### Best Practices

```typescript
// ✅ Good - use method="POST" for state changes
<form method="POST" action="/api/community/posts">
  {/* NextAuth injects CSRF token automatically */}
  <input type="hidden" name="csrfToken" value={csrfToken} />
  <textarea name="content"></textarea>
  <button type="submit">Post</button>
</form>

// ✅ Good - fetch with CSRF token
const response = await fetch('/api/community/posts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-csrf-token': csrfToken,
  },
  body: JSON.stringify(postData),
})

// ❌ Bad - GET request for state change
<a href="/api/community/posts/delete?postId=123">Delete</a>
// Should be POST, not GET
```

---

## 5. Authentication & Session Security

### NextAuth Configuration

**src/lib/auth.ts**:
```typescript
import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        // Validate email/password
        const user = await validateCredentials(
          credentials.email,
          credentials.password
        )

        if (!user) {
          throw new Error('Invalid credentials')
        }

        // Check if verified
        if (!user.emailVerified) {
          throw new Error('Please verify your email first')
        }

        // Check if banned
        const isBanned = await checkIfBanned(user.id)
        if (isBanned) {
          throw new Error('Your account has been suspended')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          program: user.profile?.program,
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.id
      return session
    },
  },

  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  secret: process.env.NEXTAUTH_SECRET,
}
```

### Password Security

```typescript
import bcrypt from 'bcryptjs'

// Hash password (10 rounds - secure + reasonable speed)
const hashedPassword = await bcrypt.hash(password, 10)

// Verify password
const isValid = await bcrypt.compare(plainPassword, hashedPassword)

// ✅ Password requirements
export function validatePassword(password: string): {
  valid: boolean
  errors: string[]
} {
  const errors = []

  if (password.length < 8) {
    errors.push('Must be at least 8 characters')
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Must contain uppercase letter')
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Must contain lowercase letter')
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Must contain number')
  }
  if (!/[!@#$%^&*]/.test(password)) {
    errors.push('Must contain special character (!@#$%^&*)')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}
```

### Session Validation

```typescript
// Always check session in protected routes
export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions)

  if (!session) {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false,
      },
    }
  }

  // Check if user is banned
  const isBanned = await checkIfBanned(session.user.id)
  if (isBanned) {
    return {
      redirect: {
        destination: '/banned',
        permanent: true,
      },
    }
  }

  return { props: { session } }
}
```

---

## 6. Rate Limiting

### Prevent Brute Force Attacks

```typescript
import rateLimit from 'express-rate-limit'

// Implement rate limiting middleware
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: 'Too many login attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
})

export const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute
})

// Apply to routes
export async function POST(request: NextRequest) {
  // Rate limit check
  const ip = request.ip || request.headers.get('x-forwarded-for')
  const isAllowed = await checkRateLimit(ip, 'login')

  if (!isAllowed) {
    return NextResponse.json(
      { error: 'Too many attempts' },
      { status: 429 } // Too Many Requests
    )
  }

  // Process request...
}
```

### API Rate Limiting

```typescript
// src/lib/rateLimit.ts
const RATE_LIMITS = {
  createPost: { perMinute: 10, perHour: 100 },
  like: { perMinute: 60, perHour: 1000 },
  comment: { perMinute: 30, perHour: 300 },
  login: { perMinute: 5, perHour: 20 },
  register: { perMinute: 3, perHour: 10 },
}

export async function checkRateLimit(
  userId: string,
  action: string,
  ipAddress: string
): Promise<boolean> {
  const limit = RATE_LIMITS[action]
  if (!limit) return true

  // Check database for recent actions
  const recentCount = await prisma.auditLog.count({
    where: {
      userId,
      action,
      createdAt: {
        gte: new Date(Date.now() - 60000), // Last minute
      },
    },
  })

  return recentCount < limit.perMinute
}
```

---

## 7. Age Verification & Parental Consent

### Verify Age on Registration

```typescript
export async function validateAge(dateOfBirth: string): Promise<{
  ageInYears: number
  isEligible: boolean
  requiresParentalConsent: boolean
}> {
  const birthDate = new Date(dateOfBirth)
  const today = new Date()

  const ageInYears = today.getFullYear() - birthDate.getFullYear()
  const hasHadBirthday =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() >= birthDate.getDate())

  const actualAge = hasHadBirthday ? ageInYears : ageInYears - 1

  return {
    ageInYears: actualAge,
    isEligible: actualAge >= 13,
    requiresParentalConsent: actualAge < 13,
  }
}
```

### Store Parental Consent

```typescript
// Verify parent email and store consent
export async function createParentalConsent(
  childId: string,
  parentEmail: string,
  parentName: string
) {
  // Generate token
  const token = generateSecureToken(32)
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

  // Store in database
  await prisma.parentalConsent.create({
    data: {
      childId,
      parentEmail,
      parentName,
      token,
      expiresAt: expires,
      verifiedAt: null,
    },
  })

  // Send verification email
  await sendParentalConsentEmail(parentEmail, token)
}

// Verify parent consent
export async function verifyParentalConsent(
  childId: string,
  token: string
): Promise<boolean> {
  const consent = await prisma.parentalConsent.findUnique({
    where: { childId_token: { childId, token } },
  })

  if (!consent) {
    return false
  }

  if (consent.expiresAt < new Date()) {
    return false // Token expired
  }

  // Mark as verified
  await prisma.parentalConsent.update({
    where: { id: consent.id },
    data: { verifiedAt: new Date() },
  })

  return true
}
```

---

## 8. Ban & Content Removal Enforcement

### Prevent Banned Users from Accessing

```typescript
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Get user ID from session
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const userId = session.user.id

  // Check if user is banned
  const ban = await prisma.bannedUser.findUnique({
    where: { userId },
  })

  if (ban) {
    // Check if ban expired
    if (ban.unbanAt && ban.unbanAt > new Date()) {
      return NextResponse.json(
        { error: 'Your account is temporarily suspended' },
        { status: 403 }
      )
    }

    if (!ban.unbanAt) {
      // Permanent ban
      return NextResponse.json(
        { error: 'Your account has been permanently suspended' },
        { status: 403 }
      )
    }

    // Ban expired, remove it
    await prisma.bannedUser.delete({
      where: { userId },
    })
  }

  // Continue with normal processing
  // ...
}
```

### Remove Banned User Content

```typescript
export async function banUser(
  userId: string,
  reason: string,
  durationDays: number | null,
  bannedBy: string
) {
  // Create ban record
  const ban = await prisma.bannedUser.create({
    data: {
      userId,
      reason,
      severity: calculateSeverity(reason),
      unbanAt: durationDays ? new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000) : null,
      bannedBy,
    },
  })

  // Option 1: Remove all their content (strict)
  await prisma.communityPost.deleteMany({
    where: { authorId: userId },
  })

  await prisma.galleryPhoto.deleteMany({
    where: { uploaderId: userId },
  })

  // Option 2: Keep content but hide author (moderate)
  // await prisma.communityPost.updateMany({
  //   where: { authorId: userId },
  //   data: { authorId: null } // Or set to 'deleted-user'
  // })

  // Log action
  await prisma.auditLog.create({
    data: {
      userId: bannedBy,
      action: 'ban_user',
      details: {
        targetUserId: userId,
        reason,
        duration: durationDays,
      },
    },
  })

  return ban
}
```

---

## 9. Data Privacy & Protection

### Encrypt Sensitive Data

```typescript
import crypto from 'crypto'

const algorithm = 'aes-256-cbc'
const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex')
const iv = crypto.randomBytes(16)

export function encryptData(data: string): string {
  const cipher = crypto.createCipheriv(algorithm, key, iv)
  let encrypted = cipher.update(data, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  return iv.toString('hex') + ':' + encrypted
}

export function decryptData(data: string): string {
  const parts = data.split(':')
  const iv = Buffer.from(parts[0], 'hex')
  const encrypted = parts[1]

  const decipher = crypto.createDecipheriv(algorithm, key, iv)
  let decrypted = decipher.update(encrypted, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  return decrypted
}
```

### Audit Log Sensitive Operations

```typescript
export async function logSensitiveAction(
  userId: string,
  action: string,
  details: any,
  request: NextRequest
) {
  await prisma.auditLog.create({
    data: {
      userId,
      action,
      details,
      ipAddress: request.ip || request.headers.get('x-forwarded-for'),
      userAgent: request.headers.get('user-agent'),
    },
  })
}

// Use in critical operations
await logSensitiveAction(
  userId,
  'delete_account',
  { accountId: userAccount.id },
  request
)
```

---

## 10. Dependency Security

### Keep Dependencies Updated

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Check for outdated packages
npm outdated

# Update packages safely
npm update
```

### Supply Chain Security

```json
// package.json - pin critical versions
{
  "dependencies": {
    "bcryptjs": "2.4.3",
    "next-auth": "4.24.13",
    "jsonwebtoken": "9.0.3"
  }
}
```

---

## Security Checklist

### Authentication
- [ ] Passwords hashed with bcrypt (10+ rounds)
- [ ] Sessions checked on all protected routes
- [ ] Session expiration set (30 days)
- [ ] CSRF tokens on all POST requests
- [ ] Secure cookie flags (httpOnly, secure, sameSite)

### Input Validation
- [ ] All form inputs validated with Zod
- [ ] File uploads validated (type, size, content)
- [ ] URL parameters validated
- [ ] Database queries parameterized (Prisma)
- [ ] No dangerous innerHTML usage

### Output Encoding
- [ ] HTML properly escaped (React default)
- [ ] URLs validated before rendering
- [ ] JSON responses properly typed
- [ ] No sensitive data in error messages

### Access Control
- [ ] Age verification enforced
- [ ] Parental consent required for <13
- [ ] Ban checks on all operations
- [ ] Role-based permissions for moderation
- [ ] User can only modify their own content

### Rate Limiting
- [ ] Login attempts limited (5/15min)
- [ ] API calls limited (30/min)
- [ ] Registration limited (3/min)
- [ ] Content creation limited (10/min)

### Logging & Monitoring
- [ ] All sensitive actions logged
- [ ] Audit log includes IP and user agent
- [ ] Ban events logged
- [ ] Content removal logged
- [ ] Error tracking enabled

### Infrastructure
- [ ] HTTPS only (no HTTP)
- [ ] Security headers set (CSP, X-Frame-Options)
- [ ] Database credentials in environment variables
- [ ] Secrets not in source code
- [ ] Regular security updates

### Data Protection
- [ ] Encryption at rest (if storing sensitive data)
- [ ] Encryption in transit (HTTPS)
- [ ] Data retention policies
- [ ] User can request data deletion
- [ ] GDPR compliance for EU users

---

## Incident Response

### If Data Breach Occurs

1. **Assess Scope**
   - What data was accessed?
   - How many users affected?
   - How long was it exposed?

2. **Contain**
   - Shut down affected service
   - Change database credentials
   - Review logs for other access

3. **Notify Users**
   - Email within 24 hours
   - Explain what happened
   - Offer password reset
   - Provide credit monitoring (if applicable)

4. **Fix Root Cause**
   - Patch vulnerability
   - Deploy fix
   - Test extensively
   - Monitor for reoccurrence

5. **Report**
   - Document incident
   - Notify relevant authorities
   - Update security procedures

---

## External Security Audits

**Recommended**: Third-party security audit before production

- Code review by security experts
- Penetration testing
- Vulnerability scanning
- Compliance verification

**Cost**: $5,000-$25,000 depending on scope

---

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Cheat Sheet](https://cheatsheetseries.owasp.org/)
- [CWE Top 25](https://cwe.mitre.org/top25/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Zod Validation](https://zod.dev/)

---

**Version**: 1.0
**Last Updated**: February 2026
**Next Review**: Before production launch
