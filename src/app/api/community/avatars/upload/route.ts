import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireSessionUser } from '@/lib/api-auth'

// POST - Upload avatar
export async function POST(request: NextRequest) {
  try {
    const auth = await requireSessionUser()
    if (!auth.ok) return auth.response
    const userId = auth.userId

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      )
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large (max 5MB)' },
        { status: 400 }
      )
    }

    // TODO: Upload to Cloudinary
    // For now, we'll store a placeholder URL
    // In production, integrate with Cloudinary API

    // Placeholder avatar URL (will be replaced with actual Cloudinary URL)
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
      `User ${userId}`
    )}&background=c8a75d&color=fff`

    // Update user profile with avatar
    const profile = await prisma.userProfile.upsert({
      where: { userId },
      update: {
        avatar: avatarUrl,
      },
      create: {
        userId,
        avatar: avatarUrl,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'upload_avatar',
        details: {
          filename: file.name,
          size: file.size,
        },
      },
    })

    if (process.env.NODE_ENV === 'development') {
      console.log(
        `[DEV] Avatar uploaded for user ${userId}: ${avatarUrl}`
      )
    }

    return NextResponse.json(
      {
        message: 'Avatar uploaded successfully',
        avatarUrl: profile.avatar,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Avatar upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload avatar' },
      { status: 500 }
    )
  }
}
