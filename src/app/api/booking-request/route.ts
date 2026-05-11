import { NextRequest, NextResponse } from 'next/server'
import { bookingRequestSchema, submitMudyinIntake } from '@/lib/mudyin-intake'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (body.website) {
      return NextResponse.json({
        success: true,
        message: 'Your booking request has been received.',
      })
    }

    const parsed = bookingRequestSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Please check the highlighted fields and try again.',
          details: parsed.error.flatten(),
        },
        { status: 400 },
      )
    }

    const result = await submitMudyinIntake({
      kind: 'booking_request',
      payload: parsed.data,
      request,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('[Mudyin Booking Request API] Error:', error)
    return NextResponse.json(
      { success: false, error: 'We could not send your booking request. Please try again or email yaama@mudyin.com.' },
      { status: 500 },
    )
  }
}
