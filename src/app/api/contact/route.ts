import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const contactSchema = z.object({
  name:        z.string().min(2).max(100),
  email:       z.string().email(),
  phone:       z.string().optional(),
  inquiryType: z.enum(['general', 'program', 'partnership', 'media', 'volunteer']),
  message:     z.string().min(20).max(2000),
  website:     z.string().max(0).optional(), // honeypot
})

// Routing map: inquiry type → recipient email
const ROUTING: Record<string, string> = {
  program:     'programs@mudyin.org.au',
  media:       'ceo@mudyin.org.au',
  partnership: 'partnerships@mudyin.org.au',
  general:     'info@mudyin.org.au',
  volunteer:   'info@mudyin.org.au',
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Honeypot check
    if (body.website) {
      // Return success to confuse bots
      return NextResponse.json({ success: true })
    }

    // Validate
    const data = contactSchema.safeParse(body)
    if (!data.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid form data', details: data.error.flatten() },
        { status: 400 },
      )
    }

    const { name, email, phone, inquiryType, message } = data.data
    const recipient = ROUTING[inquiryType] ?? 'info@mudyin.org.au'

    // In production: send email via Resend
    // const resend = new Resend(process.env.RESEND_API_KEY)
    // await resend.emails.send({
    //   from:    'Mudyin Website <noreply@mudyin.org.au>',
    //   to:      recipient,
    //   replyTo: email,
    //   subject: `[${inquiryType.toUpperCase()}] New enquiry from ${name}`,
    //   text:    `Name: ${name}\nEmail: ${email}\nPhone: ${phone || 'Not provided'}\n\nMessage:\n${message}`,
    // })

    // Development: log to console
    console.info('[Contact API] New enquiry:', {
      name,
      email,
      phone: phone || 'not provided',
      inquiryType,
      recipient,
      messagePreview: message.slice(0, 80) + (message.length > 80 ? '…' : ''),
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      message: 'Your message has been received. We will be in touch within 1–2 business days.',
    })
  } catch (error) {
    console.error('[Contact API] Error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 },
    )
  }
}

// Rate limiting headers helper (production: use Vercel Rate Limiting or Upstash)
export const runtime = 'edge'
