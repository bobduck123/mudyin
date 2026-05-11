import { mudyinPublicConfig } from '@/lib/mudyin-public-config'
import type { MudyinIntakeKind, MudyinEnquiryInput, MudyinBookingRequestInput } from '@/lib/mudyin-intake'

type IntakePayload = MudyinEnquiryInput | MudyinBookingRequestInput

export type IntakeEmailContext = {
  reference: string
  kind: MudyinIntakeKind
  payload: IntakePayload
  request: Request
}

export type IntakeEmailResult =
  | { attempted: false; delivered: false; recipient: string; reason: 'missing-provider' }
  | { attempted: true; delivered: true; recipient: string; provider: 'resend' }
  | { attempted: true; delivered: false; recipient: string; provider: 'resend'; error: string }

export function getMudyinIntakeRecipient() {
  return process.env.MUDYIN_INTAKE_EMAIL || 'yaama@mudyin.com'
}

function subjectFor(context: IntakeEmailContext) {
  const program = context.payload.preferredService?.trim()

  if (program) {
    return `[Mudyin] Program enquiry  ${program}  ${context.payload.name}`
  }

  if (context.kind === 'booking_request') {
    return `[Mudyin] New booking request  ${context.payload.name}`
  }

  return `[Mudyin] New enquiry  ${context.payload.name}`
}

function buildTextBody(context: IntakeEmailContext) {
  const submittedAt = new Date().toISOString()
  const host = context.request.headers.get('host') || context.request.headers.get('origin') || 'unknown'

  return [
    `Reference: ${context.reference}`,
    `Request type: ${context.kind}`,
    `Enquiry type: ${context.payload.enquiryType}`,
    `Program selected: ${context.payload.preferredService || 'Not supplied'}`,
    `Name: ${context.payload.name}`,
    `Email: ${context.payload.email}`,
    `Phone: ${context.payload.phone || 'Not supplied'}`,
    `Preferred date/time: ${context.payload.preferredDateTime || 'Not supplied'}`,
    `Consent: ${context.payload.consent ? 'yes' : 'no'}`,
    `Submitted domain/host: ${host}`,
    `Submitted timestamp: ${submittedAt}`,
    `Tenant key: ${mudyinPublicConfig.tenantKey}`,
    `Site slug: ${mudyinPublicConfig.siteSlug}`,
    '',
    'Message:',
    context.payload.message,
  ].join('\n')
}

export async function sendMudyinIntakeEmail(context: IntakeEmailContext): Promise<IntakeEmailResult> {
  const recipient = getMudyinIntakeRecipient()
  const resendApiKey = process.env.RESEND_API_KEY

  if (!resendApiKey) {
    return {
      attempted: false,
      delivered: false,
      recipient,
      reason: 'missing-provider',
    }
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || 'Mudyin <noreply@mudyin.com>',
        to: [recipient],
        reply_to: context.payload.email,
        subject: subjectFor(context),
        text: buildTextBody(context),
      }),
    })

    if (!response.ok) {
      const body = await response.text().catch(() => '')
      return {
        attempted: true,
        delivered: false,
        recipient,
        provider: 'resend',
        error: body || `Resend returned HTTP ${response.status}`,
      }
    }

    return {
      attempted: true,
      delivered: true,
      recipient,
      provider: 'resend',
    }
  } catch (error) {
    return {
      attempted: true,
      delivered: false,
      recipient,
      provider: 'resend',
      error: error instanceof Error ? error.message : String(error),
    }
  }
}
