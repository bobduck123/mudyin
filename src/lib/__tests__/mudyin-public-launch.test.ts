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
    info.mockRestore()
  })
})
