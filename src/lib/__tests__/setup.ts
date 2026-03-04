// Test setup and utilities
export const TEST_USERS = {
  VERIFIED_USER: {
    id: 'test-verified-123',
    email: 'verified@example.com',
    name: 'Test Verified User',
    verified: true,
    program: 'YSMP',
  },
  UNVERIFIED_USER: {
    id: 'test-unverified-123',
    email: 'unverified@example.com',
    name: 'Test Unverified User',
    verified: false,
  },
  UNDER_13_USER: {
    id: 'test-under13-123',
    email: 'under13@example.com',
    name: 'Young User',
    verified: true,
    ageGroup: '<13',
    parentalConsentVerified: true,
  },
  ADMIN_USER: {
    id: 'test-admin-123',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin',
  },
  MODERATOR_USER: {
    id: 'test-moderator-123',
    email: 'moderator@example.com',
    name: 'Moderator User',
    role: 'moderator',
  },
}

export const TEST_DATA = {
  VALID_POST: {
    content: 'This is a great post about my journey in YSMP!',
    tags: ['YSMP', 'journey'],
    visibility: 'public',
  },
  HARMFUL_POST: {
    content: 'I want to kill myself tonight',
    tags: [],
    visibility: 'public',
  },
  SPAM_POST: {
    content: 'spam spam spam spam spam',
    tags: [],
    visibility: 'public',
  },
  VALID_COMMENT: {
    content: 'Great post! Really inspiring.',
  },
  VALID_STORY: {
    title: 'My 100-Day Journey',
    description: 'A story about my transformation',
    frames: [
      {
        imageUrl: 'https://example.com/frame1.jpg',
        caption: 'Day 1',
        duration: 3,
      },
      {
        imageUrl: 'https://example.com/frame2.jpg',
        caption: 'Day 100',
        duration: 5,
      },
    ],
    visibility: 'public',
  },
  VALID_REPORT: {
    contentType: 'post',
    contentId: 'post-123',
    reason: 'inappropriate',
    description: 'This content violates community guidelines',
  },
}

export const TEST_PASSWORDS = {
  VALID: 'SecurePass123!',
  WEAK: 'weak',
  NO_UPPERCASE: 'securepass123!',
  NO_NUMBER: 'SecurePass!',
  TOO_SHORT: 'Pass1!',
}

export const TEST_EMAILS = {
  VALID: 'test@example.com',
  INVALID_FORMAT: 'not-an-email',
  EMPTY: '',
  NO_DOMAIN: 'test@',
  SPECIAL_CHARS: 'test+tag@example.com',
}

export const TEST_DATES = {
  ADULT: new Date('1990-01-15').toISOString().split('T')[0], // 34 years old
  TEEN: new Date('2010-01-15').toISOString().split('T')[0], // 14 years old
  CHILD: new Date('2015-01-15').toISOString().split('T')[0], // 9 years old
}

// Mock crisis resources
export const MOCK_CRISIS_RESOURCES = [
  {
    id: 'lifeline',
    name: 'Lifeline',
    description: '24/7 crisis support',
    phone: '13 11 14',
    region: 'Australia',
    supportTypes: ['suicide', 'crisis'],
  },
  {
    id: 'kids-helpline',
    name: 'Kids Helpline',
    description: 'For children and young people',
    phone: '1800 55 1800',
    region: 'Australia',
    supportTypes: ['youth', 'crisis'],
  },
]

// Mock moderation keywords
export const MOCK_KEYWORDS = {
  CRITICAL: ['suicide', 'kill myself', 'self-harm'],
  HIGH: ['abuse', 'racist', 'hate'],
  MEDIUM: ['spam', 'misleading'],
}

// Helper functions
export function generateTestEmail(): string {
  return `test-${Date.now()}@example.com`
}

export function generateTestId(): string {
  return `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export function createTestPost(overrides = {}) {
  return {
    ...TEST_DATA.VALID_POST,
    ...overrides,
  }
}

export function createTestComment(overrides = {}) {
  return {
    ...TEST_DATA.VALID_COMMENT,
    ...overrides,
  }
}

export function createTestStory(overrides = {}) {
  return {
    ...TEST_DATA.VALID_STORY,
    ...overrides,
  }
}

export function createTestReport(overrides = {}) {
  return {
    ...TEST_DATA.VALID_REPORT,
    ...overrides,
  }
}

export function createTestUser(overrides = {}) {
  return {
    ...TEST_USERS.VERIFIED_USER,
    id: generateTestId(),
    email: generateTestEmail(),
    ...overrides,
  }
}

// Assertion helpers
export function expectValidEmail(email: string): void {
  expect(email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
}

export function expectValidPassword(password: string): void {
  expect(password.length).toBeGreaterThanOrEqual(8)
  expect(password).toMatch(/[A-Z]/)
  expect(password).toMatch(/[0-9]/)
  expect(password).toMatch(/[!@#$%^&*]/)
}

export function expectValidUrl(url: string): void {
  expect(() => new URL(url)).not.toThrow()
}

export function expectValidDate(dateStr: string): void {
  const date = new Date(dateStr)
  expect(date.getTime()).not.toBeNaN()
}

// Mock fetch for API tests
export function mockFetch(
  response: unknown,
  status: number = 200
): jest.Mock {
  return jest.fn(() =>
    Promise.resolve({
      ok: status >= 200 && status < 300,
      status,
      json: () => Promise.resolve(response),
      text: () => Promise.resolve(JSON.stringify(response)),
    })
  ) as jest.Mock
}

// Suppress console for tests
export function suppressConsole(): () => void {
  const originalError = console.error
  const originalWarn = console.warn

  beforeEach(() => {
    console.error = jest.fn()
    console.warn = jest.fn()
  })

  afterEach(() => {
    console.error = originalError
    console.warn = originalWarn
  })

  return () => {
    console.error = originalError
    console.warn = originalWarn
  }
}
