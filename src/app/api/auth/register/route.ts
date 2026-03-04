import { NextRequest, NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/db'
import { signupSchema } from '@/lib/validators'
import { randomBytes } from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validation = signupSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.issues },
        { status: 400 }
      )
    }

    const { email, password, name, dateOfBirth, ageGroup } = validation.data
    const resolvedAgeGroup = ageGroup ?? '13-17'

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await hash(password, 10)

    // Create user and verification record in a transaction
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        dateOfBirth: new Date(dateOfBirth),
        ageGroup: resolvedAgeGroup,
        verification: {
          create: {
            verificationToken: randomBytes(32).toString('hex'),
            verificationTokenExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
            verificationStatus: resolvedAgeGroup === '<13' ? 'pending_parental' : 'pending',
          },
        },
        profile: {
          create: {},
        },
      },
      include: {
        verification: true,
      },
    })

    // TODO: Send verification email
    // const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${user.verification?.verificationToken}`
    // await sendVerificationEmail(email, name, verificationUrl)

    // For development: return the verification token
    if (process.env.NODE_ENV === 'development') {
      console.log(
        `[DEV] Verification token for ${email}: ${user.verification?.verificationToken}`
      )
    }

    return NextResponse.json(
      {
        message: 'User created successfully',
        userId: user.id,
        email: user.email,
        requiresParentalConsent: resolvedAgeGroup === '<13',
        verificationToken:
          process.env.NODE_ENV === 'development'
            ? user.verification?.verificationToken
            : undefined,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    )
  }
}
