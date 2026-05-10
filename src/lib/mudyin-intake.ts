import { z } from 'zod'
import { mudyinPublicConfig } from '@/lib/mudyin-public-config'
import { prisma } from '@/lib/db'
import { isDbUnavailableError } from '@/lib/demo-fallback'

const baseIntakeSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your full name').max(120),
  email: z.string().trim().email('Please enter a valid email address').max(180),
  phone: z.string().trim().max(40).optional().or(z.literal('')),
  enquiryType: z.enum([
    'general',
    'program',
    'healing',
    'workshop',
    'partnership',
    'media',
    'volunteer',
    'booking',
  ]),
  preferredService: z.string().trim().max(160).optional().or(z.literal('')),
  preferredDateTime: z.string().trim().max(160).optional().or(z.literal('')),
  message: z.string().trim().min(20, 'Message must be at least 20 characters').max(3000),
  consent: z.literal(true, {
    error: 'Consent is required before submitting this request.',
  }),
  website: z.string().max(0).optional(),
})

export const enquirySchema = baseIntakeSchema
export const bookingRequestSchema = baseIntakeSchema.extend({
  enquiryType: z.enum(['program', 'healing', 'workshop', 'booking']),
})

export type MudyinIntakeKind = 'enquiry' | 'booking_request'
export type MudyinEnquiryInput = z.infer<typeof enquirySchema>
export type MudyinBookingRequestInput = z.infer<typeof bookingRequestSchema>

type IntakePayload = MudyinEnquiryInput | MudyinBookingRequestInput

type IntakeContext = {
  kind: MudyinIntakeKind
  payload: IntakePayload
  request: Request
}

export type IntakeResult = {
  success: boolean
  reference: string
  mode: 'anu-forwarded' | 'local-db' | 'local-db-and-anu' | 'fallback-log'
  message: string
}

const DEFAULT_MESSAGES: Record<MudyinIntakeKind, string> = {
  enquiry: 'Your enquiry has been received. The Mudyin team will be in touch within 1-2 business days.',
  booking_request:
    'Your booking request has been received. This is not a confirmed booking; the Mudyin team will contact you to confirm availability.',
}

function makeReference(kind: MudyinIntakeKind): string {
  const prefix = kind === 'booking_request' ? 'MYN-BR' : 'MYN-ENQ'
  const date = new Date().toISOString().slice(0, 10).replaceAll('-', '')
  const random = globalThis.crypto?.randomUUID?.().slice(0, 8) || Math.random().toString(36).slice(2, 10)
  return `${prefix}-${date}-${random.toUpperCase()}`
}

function endpointForKind(kind: MudyinIntakeKind): string | null {
  if (kind === 'booking_request') {
    return process.env.ANU_PUBLIC_BOOKING_REQUEST_ENDPOINT || null
  }
  return process.env.ANU_PUBLIC_ENQUIRIES_ENDPOINT || null
}

function buildAnuPayload({ kind, payload, request }: IntakeContext, reference: string) {
  return {
    reference,
    kind,
    source: 'mudyin-public-frontend',
    tenantKey: mudyinPublicConfig.tenantKey,
    siteSlug: mudyinPublicConfig.siteSlug,
    publicSiteUrl: mudyinPublicConfig.publicSiteUrl,
    submittedAt: new Date().toISOString(),
    origin: request.headers.get('origin'),
    userAgent: request.headers.get('user-agent'),
    data: payload,
  }
}

async function tryForwardToAnu(context: IntakeContext, reference: string): Promise<boolean> {
  const endpoint = endpointForKind(context.kind)
  if (!endpoint) {
    return false
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 5000)

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-ANU-Site-Slug': mudyinPublicConfig.siteSlug,
        'X-ANU-Site': mudyinPublicConfig.tenantKey,
      },
      body: JSON.stringify(buildAnuPayload(context, reference)),
      signal: controller.signal,
    })

    return response.ok
  } catch (error) {
    console.warn('[Mudyin Intake] ANU forward failed; using first-live fallback.', {
      reference,
      kind: context.kind,
      error: error instanceof Error ? error.message : String(error),
    })
    return false
  } finally {
    clearTimeout(timeout)
  }
}

function logFallback(context: IntakeContext, reference: string) {
  console.info('[Mudyin Intake] First-live fallback captured request.', {
    reference,
    kind: context.kind,
    source: 'mudyin-public-frontend',
    tenantKey: mudyinPublicConfig.tenantKey,
    siteSlug: mudyinPublicConfig.siteSlug,
    publicSiteUrl: mudyinPublicConfig.publicSiteUrl,
    submittedAt: new Date().toISOString(),
    origin: context.request.headers.get('origin'),
    userAgent: context.request.headers.get('user-agent'),
    data: context.payload,
    todo: 'Replace fallback logging with durable storage or email delivery before scaling public traffic.',
  })
}

async function storeLocally(context: IntakeContext, reference: string): Promise<boolean> {
  try {
    await prisma.inquiry.create({
      data: {
        reference,
        kind: context.kind,
        status: 'new',
        tenantKey: mudyinPublicConfig.tenantKey,
        siteSlug: mudyinPublicConfig.siteSlug,
        source: 'mudyin-public-frontend',
        name: context.payload.name,
        email: context.payload.email,
        phone: context.payload.phone || null,
        enquiryType: context.payload.enquiryType,
        preferredService: context.payload.preferredService || null,
        preferredDateTime: context.payload.preferredDateTime || null,
        message: context.payload.message,
        consent: context.payload.consent,
        origin: context.request.headers.get('origin'),
        userAgent: context.request.headers.get('user-agent'),
      },
    })

    return true
  } catch (error) {
    const payload = {
      reference,
      kind: context.kind,
      error: error instanceof Error ? error.message : String(error),
    }

    if (isDbUnavailableError(error)) {
      console.warn('[Mudyin Intake] Local inquiry storage unavailable; using first-live fallback.', payload)
      return false
    }

    console.error('[Mudyin Intake] Local inquiry storage failed; using first-live fallback.', payload)
    return false
  }
}

export async function submitMudyinIntake(context: IntakeContext): Promise<IntakeResult> {
  const reference = makeReference(context.kind)
  const storedLocally = await storeLocally(context, reference)
  const forwarded = await tryForwardToAnu(context, reference)

  if (forwarded) {
    return {
      success: true,
      reference,
      mode: storedLocally ? 'local-db-and-anu' : 'anu-forwarded',
      message: DEFAULT_MESSAGES[context.kind],
    }
  }

  if (storedLocally) {
    return {
      success: true,
      reference,
      mode: 'local-db',
      message: DEFAULT_MESSAGES[context.kind],
    }
  }

  logFallback(context, reference)
  return {
    success: true,
    reference,
    mode: 'fallback-log',
    message: DEFAULT_MESSAGES[context.kind],
  }
}
