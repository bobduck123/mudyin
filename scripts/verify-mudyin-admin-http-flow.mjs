import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

const baseUrl = (process.env.MUDYIN_VERIFY_BASE_URL || 'http://localhost:3000').replace(/\/+$/, '')
const bootstrapPath = path.resolve(process.cwd(), '.local', 'mudyin-bootstrap-admin.txt')
const outputPath = path.resolve(process.cwd(), '.local', 'mudyin-admin-verification.txt')

function makePassword() {
  return [
    crypto.randomBytes(9).toString('base64url'),
    crypto.randomBytes(9).toString('base64url'),
    crypto.randomBytes(9).toString('base64url'),
  ].join('-')
}

function readBootstrapCredentials() {
  const text = fs.readFileSync(bootstrapPath, 'utf8')
  const email = text.match(/^Email:\s*(.+)$/m)?.[1]?.trim()
  const password = text.match(/^Temporary password:\s*(.+)$/m)?.[1]?.trim()

  if (!email || !password) {
    throw new Error(`Could not read bootstrap credentials from ${bootstrapPath}`)
  }

  return { email, password }
}

class CookieJar {
  cookies = new Map()

  store(headers) {
    const getSetCookie = headers.getSetCookie?.bind(headers)
    const values = getSetCookie ? getSetCookie() : (headers.get('set-cookie') ? [headers.get('set-cookie')] : [])

    for (const value of values) {
      for (const part of String(value).split(/,(?=[^;,]+=)/)) {
        const pair = part.split(';')[0]
        const index = pair.indexOf('=')
        if (index > 0) {
          this.cookies.set(pair.slice(0, index).trim(), pair.slice(index + 1).trim())
        }
      }
    }
  }

  header() {
    return [...this.cookies.entries()].map(([name, value]) => `${name}=${value}`).join('; ')
  }
}

async function request(pathname, options = {}, jar = new CookieJar()) {
  const headers = new Headers(options.headers || {})
  const cookie = jar.header()
  if (cookie) headers.set('cookie', cookie)

  const response = await fetch(`${baseUrl}${pathname}`, {
    ...options,
    headers,
    redirect: options.redirect || 'follow',
  })

  jar.store(response.headers)
  const text = await response.text()
  let data = null
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = text
  }

  return { response, data, jar }
}

async function login(email, password) {
  const jar = new CookieJar()
  const csrf = await request('/api/auth/csrf', {}, jar)
  if (!csrf.response.ok || !csrf.data?.csrfToken) {
    throw new Error('Could not fetch NextAuth CSRF token.')
  }

  const body = new URLSearchParams({
    csrfToken: csrf.data.csrfToken,
    email,
    password,
    json: 'true',
  })

  const callback = await request(
    '/api/auth/callback/credentials?json=true',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
      redirect: 'manual',
    },
    jar,
  )

  if (![200, 302].includes(callback.response.status)) {
    throw new Error(`Login failed for ${email}: HTTP ${callback.response.status}`)
  }

  const me = await request('/api/admin/me', {}, jar)
  return { jar, me }
}

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

const bootstrap = readBootstrapCredentials()
const verifiedAt = new Date().toISOString()
const secondAdminEmail = `ops.admin+verify-${Date.now()}@mudyin.local`
const publicUserEmail = `public.user+verify-${Date.now()}@mudyin.local`
const rotatedBootstrapPassword = makePassword()

const bootstrapLogin = await login(bootstrap.email, bootstrap.password)
assert(bootstrapLogin.me.response.ok, 'Bootstrap admin could not access /api/admin/me.')
assert(bootstrapLogin.me.data.admin.role === 'super_admin', 'Bootstrap admin is not super_admin.')
assert(bootstrapLogin.me.data.admin.mustChangePassword === true, 'Bootstrap admin was not forced to rotate password.')

const blockedCreate = await request(
  '/api/admin/users',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: secondAdminEmail,
      name: 'Verification Admin',
      role: 'admin',
      scope: ['mudyin'],
    }),
  },
  bootstrapLogin.jar,
)
assert(blockedCreate.response.status === 403, 'Bootstrap admin could create users before password rotation.')

const passwordReset = await request(
  '/api/admin/password',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      currentPassword: bootstrap.password,
      newPassword: rotatedBootstrapPassword,
    }),
  },
  bootstrapLogin.jar,
)
assert(passwordReset.response.ok && passwordReset.data.success, 'Bootstrap password rotation failed.')

const createAdmin = await request(
  '/api/admin/users',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: secondAdminEmail,
      name: 'Verification Admin',
      role: 'admin',
      scope: ['mudyin'],
    }),
  },
  bootstrapLogin.jar,
)
assert(createAdmin.response.ok && createAdmin.data.success, `Second admin creation failed: ${createAdmin.data?.error || createAdmin.response.status}`)
assert(createAdmin.data.adminProfile.role === 'admin', 'Second account was not created as admin.')
assert(createAdmin.data.adminProfile.mustChangePassword === true, 'Second admin is not forced to rotate password.')

const secondAdminLogin = await login(secondAdminEmail, createAdmin.data.temporaryPassword)
assert(secondAdminLogin.me.response.ok, 'Second admin could not log in.')
assert(secondAdminLogin.me.data.admin.role === 'admin', 'Second admin role mismatch.')

const forbiddenUsers = await request('/api/admin/users', {}, secondAdminLogin.jar)
assert(forbiddenUsers.response.status === 403, 'Second admin could access super_admin-only user management.')

const publicRegistrationPassword = `Public${crypto.randomInt(100000, 999999)}Account`
const publicRegister = await request('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: publicUserEmail,
    password: publicRegistrationPassword,
    confirmPassword: publicRegistrationPassword,
    name: 'Public Verification User',
    dateOfBirth: '1998-01-01',
    ageGroup: '26+',
    agreeToTerms: true,
  }),
})
assert(publicRegister.response.status === 201, `Public registration failed: ${publicRegister.response.status}`)

const publicLogin = await login(publicUserEmail, publicRegistrationPassword)
assert(publicLogin.me.response.status === 401, 'Public user gained admin access.')

const enquiry = await request('/api/enquiries', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Launch Verification Enquiry',
    email: 'launch.verify@mudyin.local',
    phone: '0400000000',
    enquiryType: 'general',
    preferredService: "Mudyin Women's Business",
    preferredDateTime: 'Next available intake',
    message: 'This is a verification enquiry to confirm local first-live inquiry persistence is working.',
    consent: true,
  }),
})
assert(enquiry.response.ok && enquiry.data.success, `Enquiry submit failed: ${enquiry.data?.error || enquiry.response.status}`)

const adminEnquiries = await request('/api/admin/enquiries', {}, bootstrapLogin.jar)
assert(adminEnquiries.response.ok, 'Admin could not list enquiries.')
assert(
  adminEnquiries.data.enquiries.some((item) => item.reference === enquiry.data.reference),
  'Submitted enquiry was not visible in admin enquiry review.',
)

const report = [
  'Mudyin admin HTTP verification',
  `Verified at: ${verifiedAt}`,
  `Base URL: ${baseUrl}`,
  `Bootstrap email: ${bootstrap.email}`,
  'Bootstrap login: passed',
  'Bootstrap first-login password reset enforced: passed',
  'Admin creation before password rotation blocked: passed',
  'Bootstrap password rotation endpoint: passed',
  `Second admin created: ${secondAdminEmail}`,
  'Second admin login: passed',
  'Second admin blocked from super_admin user management: passed',
  `Public user created without admin privileges: ${publicUserEmail}`,
  `Enquiry captured and visible in admin: ${enquiry.data.reference}`,
  `Second admin temporary password: ${createAdmin.data.temporaryPassword}`,
  '',
].join('\n')

fs.mkdirSync(path.dirname(outputPath), { recursive: true })
fs.writeFileSync(outputPath, report, 'utf8')

console.log(JSON.stringify({
  ok: true,
  baseUrl,
  bootstrapEmail: bootstrap.email,
  firstLoginResetEnforced: true,
  secondAdminEmail,
  publicUserEmail,
  enquiryReference: enquiry.data.reference,
  outputPath,
}, null, 2))
