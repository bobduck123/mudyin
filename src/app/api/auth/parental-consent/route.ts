import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { parentalConsentSchema } from '@/lib/validators'
import { randomBytes } from 'crypto'
import { requireSessionUser } from '@/lib/api-auth'

// Send parental consent request
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validation = parentalConsentSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.issues },
        { status: 400 }
      )
    }

    const { parentEmail, childName: _childName } = validation.data

    const auth = await requireSessionUser()
    if (!auth.ok) return auth.response
    const userId = auth.userId

    const verification = await prisma.memberVerification.findUnique({
      where: { userId },
      include: { user: true },
    })

    if (!verification) {
      return NextResponse.json(
        { error: 'User verification not found' },
        { status: 404 }
      )
    }

    // Generate parental consent token
    const consentToken = randomBytes(32).toString('hex')

    // Update verification with parental consent details
    await prisma.memberVerification.update({
      where: { id: verification.id },
      data: {
        parentalConsentEmail: parentEmail,
        parentalConsentToken: consentToken,
        parentalConsentTokenExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    })

    // TODO: Send parental consent email
    // const consentUrl = `${process.env.NEXTAUTH_URL}/auth/verify-parental-consent?token=${consentToken}`
    // await sendParentalConsentEmail(parentEmail, childName, consentUrl)

    if (process.env.NODE_ENV === 'development') {
      console.log(
        `[DEV] Parental consent token for ${parentEmail}: ${consentToken}`
      )
    }

    return NextResponse.json(
      {
        message: 'Parental consent request sent',
        consentToken: process.env.NODE_ENV === 'development' ? consentToken : undefined,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Parental consent error:', error)
    return NextResponse.json(
      { error: 'Failed to send parental consent request' },
      { status: 500 }
    )
  }
}

// Verify parental consent
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { error: 'Consent token is required' },
        { status: 400 }
      )
    }

    // Find the verification record with this consent token
    const verification = await prisma.memberVerification.findUnique({
      where: { parentalConsentToken: token },
      include: { user: true },
    })

    if (!verification) {
      return NextResponse.json(
        { error: 'Invalid or expired consent token' },
        { status: 400 }
      )
    }

    // Check if token has expired
    if (
      verification.parentalConsentTokenExpiresAt &&
      new Date() > verification.parentalConsentTokenExpiresAt
    ) {
      return NextResponse.json(
        { error: 'Consent token has expired' },
        { status: 400 }
      )
    }

    // Check if already verified
    if (verification.parentalConsentVerified) {
      return NextResponse.json(
        { message: 'Parental consent already verified' },
        { status: 200 }
      )
    }

    // Update verification status
    await prisma.memberVerification.update({
      where: { id: verification.id },
      data: {
        parentalConsentVerified: true,
        parentalConsentVerifiedAt: new Date(),
        parentalConsentToken: null,
        parentalConsentTokenExpiresAt: null,
        verificationStatus: 'verified',
      },
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: verification.userId,
        action: 'verify_parental_consent',
        details: {
          parentEmail: verification.parentalConsentEmail,
        },
      },
    })

    return NextResponse.json(
      {
        message: 'Parental consent verified successfully',
        userId: verification.userId,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Parental consent verification error:', error)
    return NextResponse.json(
      { error: 'Parental consent verification failed' },
      { status: 500 }
    )
  }
}
