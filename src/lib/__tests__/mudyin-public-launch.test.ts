import { bookingRequestSchema, enquirySchema, submitMudyinIntake } from '../mudyin-intake'
import { mudyinPublicConfig } from '../mudyin-public-config'
import { getDefaultSite } from '../white-label/site-registry'

const validBase = {
  name: 'Jordan Smith',
  email: 'jordan@example.com',
  phone: '0478 796 298',
  enquiryType: 'program' as const,
  preferredService: "Mudyin Women's Business",
  preferredDateTime: 'Future intake window',
  message: 'I would like to speak with the team about the right program pathway.',
  consent: true as const,
  website: '',
}

function mockRequest(origin = 'https://www.mudyin.com') {
  return {
    headers: {
      get(name: string) {
        if (name.toLowerCase() === 'origin') return origin
        if (name.toLowerCase() === 'user-agent') return 'jest'
        return null
      },
    },
  } as unknown as Request
}

beforeEach(() => {
  delete process.env.ANU_PUBLIC_ENQUIRIES_ENDPOINT
  delete process.env.ANU_PUBLIC_BOOKING_REQUEST_ENDPOINT
  delete process.env.RESEND_API_KEY
  delete process.env.MUDYIN_INTAKE_EMAIL
  delete process.env.EMAIL_FROM
  jest.restoreAllMocks()
  delete (global as unknown as { fetch?: unknown }).fetch
})

describe('Mudyin first-live public launch config', () => {
  it('resolves the Mudyin tenant and public domain defaults', () => {
    expect(mudyinPublicConfig.siteSlug).toBe('mudyin')
    expect(mudyinPublicConfig.tenantKey).toBe('mudyin')
    expect(mudyinPublicConfig.publicSiteUrl).toBe('https://www.mudyin.com')
    expect(mudyinPublicConfig.apiBaseUrl).toBe('https://anu-back-end.vercel.app')
  })

  it('keeps live bookings and donations disabled for first launch', () => {
    expect(mudyinPublicConfig.features.enquiries).toBe(true)
    expect(mudyinPublicConfig.features.bookingRequests).toBe(true)
    expect(mudyinPublicConfig.features.liveBookings).toBe(false)
    expect(mudyinPublicConfig.features.donations).toBe(false)
    expect(getDefaultSite().featureFlags.programEnrollment).toBe(false)
  })
})

describe('Mudyin intake validation', () => {
  it('accepts a valid general enquiry', () => {
    expect(enquirySchema.safeParse(validBase).success).toBe(true)
  })

  it('requires consent for enquiries', () => {
    expect(enquirySchema.safeParse({ ...validBase, consent: false }).success).toBe(false)
  })

  it('accepts a valid booking request without confirming a live booking', () => {
    const result = bookingRequestSchema.safeParse({
      ...validBase,
      enquiryType: 'booking',
      message: 'Please contact me to discuss availability for a healing centre appointment.',
    })

    expect(result.success).toBe(true)
  })

  it('rejects booking requests that are too thin to action', () => {
    expect(bookingRequestSchema.safeParse({ ...validBase, message: 'Hi' }).success).toBe(false)
  })

  it('submits enquiries in first-live local or fallback mode when no ANU endpoint is configured', async () => {
    const info = jest.spyOn(console, 'info').mockImplementation(() => undefined)
    const result = await submitMudyinIntake({
      kind: 'enquiry',
      payload: validBase,
      request: mockRequest(),
    })

    expect(result.success).toBe(true)
    expect(['local-db', 'fallback-log']).toContain(result.mode)
    expect(result.reference).toMatch(/^MYN-ENQ-/)
    info.mockRestore()
  })

  it('submits booking requests in first-live local or fallback mode when no ANU endpoint is configured', async () => {
    const info = jest.spyOn(console, 'info').mockImplementation(() => undefined)
    const result = await submitMudyinIntake({
      kind: 'booking_request',
      payload: { ...validBase, enquiryType: 'booking' },
      request: mockRequest(),
    })

    expect(result.success).toBe(true)
    expect(['local-db', 'fallback-log']).toContain(result.mode)
    expect(result.message).toContain('not a confirmed booking')
  })

  it('sends or queues enquiries to yaama@mudyin.com when Resend is configured', async () => {
    process.env.RESEND_API_KEY = 'test_resend_key'
    process.env.MUDYIN_INTAKE_EMAIL = 'yaama@mudyin.com'
    process.env.EMAIL_FROM = 'Mudyin <noreply@mudyin.com>'
    const fetchSpy = jest.fn().mockResolvedValue({ ok: true, status: 200, text: async () => '{}' })
    ;(global as unknown as { fetch: typeof fetchSpy }).fetch = fetchSpy

    const result = await submitMudyinIntake({
      kind: 'enquiry',
      payload: { ...validBase, preferredService: 'Thrive Tribe' },
      request: mockRequest(),
    })

    expect(result.success).toBe(true)
    expect(['email-sent', 'local-db-and-email']).toContain(result.mode)
    expect(fetchSpy).toHaveBeenCalledWith(
      'https://api.resend.com/emails',
      expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('yaama@mudyin.com'),
      }),
    )
    expect(String(fetchSpy.mock.calls[0][1]?.body)).toContain('[Mudyin] Program enquiry  Thrive Tribe')
  })

  it('sends or queues booking requests to yaama@mudyin.com when Resend is configured', async () => {
    process.env.RESEND_API_KEY = 'test_resend_key'
    process.env.MUDYIN_INTAKE_EMAIL = 'yaama@mudyin.com'
    const fetchSpy = jest.fn().mockResolvedValue({ ok: true, status: 200, text: async () => '{}' })
    ;(global as unknown as { fetch: typeof fetchSpy }).fetch = fetchSpy

    const result = await submitMudyinIntake({
      kind: 'booking_request',
      payload: { ...validBase, enquiryType: 'booking', preferredService: 'Culture Country' },
      request: mockRequest(),
    })

    expect(result.success).toBe(true)
    expect(['email-sent', 'local-db-and-email']).toContain(result.mode)
    expect(String(fetchSpy.mock.calls[0][1]?.body)).toContain('Culture Country')
    expect(String(fetchSpy.mock.calls[0][1]?.body)).toContain('yaama@mudyin.com')
  })

  it('falls back safely when the email provider fails', async () => {
    process.env.RESEND_API_KEY = 'test_resend_key'
    process.env.MUDYIN_INTAKE_EMAIL = 'yaama@mudyin.com'
    ;(global as unknown as { fetch: jest.Mock }).fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      text: async () => 'provider unavailable',
    })

    const result = await submitMudyinIntake({
      kind: 'enquiry',
      payload: { ...validBase, preferredService: 'Young Spirit Mentoring' },
      request: mockRequest(),
    })

    expect(result.success).toBe(true)
    expect(['local-db', 'fallback-log']).toContain(result.mode)
  })

  it('keeps the honeypot field invalid for direct schema submissions', () => {
    expect(enquirySchema.safeParse({ ...validBase, website: 'bot-filled' }).success).toBe(false)
  })
})
