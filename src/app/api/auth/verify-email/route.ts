import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { error: 'Verification token is required' },
        { status: 400 }
      )
    }

    // Find the verification record
    const verification = await prisma.memberVerification.findUnique({
      where: { verificationToken: token },
      include: { user: true },
    })

    if (!verification) {
      return NextResponse.json(
        { error: 'Invalid or expired verification token' },
        { status: 400 }
      )
    }

    // Check if token has expired
    if (
      verification.verificationTokenExpiresAt &&
      new Date() > verification.verificationTokenExpiresAt
    ) {
      return NextResponse.json(
        { error: 'Verification token has expired' },
        { status: 400 }
      )
    }

    // Check if already verified
    if (verification.verificationStatus === 'verified') {
      return NextResponse.json(
        { message: 'Email already verified' },
        { status: 200 }
      )
    }

    // Update verification status
    await prisma.memberVerification.update({
      where: { id: verification.id },
      data: {
        verificationStatus:
          verification.user.ageGroup === '<13'
            ? 'pending_parental'
            : 'verified',
        verificationToken: null,
        verificationTokenExpiresAt: null,
        verifiedAt: new Date(),
      },
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: verification.userId,
        action: 'verify_email',
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      },
    })

    return NextResponse.json(
      {
        message: 'Email verified successfully',
        status: verification.user.ageGroup === '<13' ? 'pending_parental' : 'verified',
        userId: verification.userId,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.json(
      { error: 'Email verification failed' },
      { status: 500 }
    )
  }
}
