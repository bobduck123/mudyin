import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { reportContentSchema } from '@/lib/validators'
import { flagContentForReview } from '@/lib/moderation'
import { demoId, isDbUnavailableError } from '@/lib/demo-fallback'

/**
 * User reports content for moderation review
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validation = reportContentSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid report data', issues: validation.error.issues },
        { status: 400 }
      )
    }

    const { contentType, contentId, reason, description } = validation.data

    // Get reporter info from headers or make it anonymous
    const userAgent = request.headers.get('user-agent') || 'unknown'
    const ip = request.headers.get('x-forwarded-for') || 'unknown'

    // Flag the content
    const flagged = await flagContentForReview(
      contentType,
      contentId,
      reason,
      description,
      'user-report'
    )

    if (!flagged) {
      return NextResponse.json(
        { error: 'Failed to file report' },
        { status: 500 }
      )
    }

    try {
      await prisma.auditLog.create({
        data: {
          action: 'user_report_content',
          details: {
            contentType,
            contentId,
            reason,
          },
          ipAddress: ip,
          userAgent,
        },
      })
    } catch (auditError) {
      if (!isDbUnavailableError(auditError)) {
        throw auditError
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you for your report. Our moderation team will review it shortly.',
        reportId: flagged.id,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Report submission error:', error)
    if (isDbUnavailableError(error)) {
      return NextResponse.json(
        {
          success: true,
          message: 'Report received in demo mode and queued for review.',
          reportId: demoId('report'),
          demoMode: true,
        },
        { status: 201 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to process report' },
      { status: 500 }
    )
  }
}
