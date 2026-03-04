import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(_request: NextRequest) {
  try {
    const programsList = ['YSMP', 'Thrive Tribe', 'Healing Centre']

    const programs = await Promise.all(
      programsList.map(async (program) => {
        const [memberCount, postCount, recentPost] = await Promise.all([
          prisma.userProgramEnrollment.count({
            where: { program },
          }),
          prisma.communityPost.count({
            where: { program, visibility: 'public' },
          }),
          prisma.communityPost.findFirst({
            where: { program, visibility: 'public' },
            orderBy: { createdAt: 'desc' },
            select: {
              id: true,
              content: true,
              createdAt: true,
              author: {
                select: { name: true, profile: { select: { avatar: true } } },
              },
            },
          }),
        ])

        return {
          name: program,
          memberCount,
          postCount,
          recentPost: recentPost
            ? {
                id: recentPost.id,
                content: recentPost.content.substring(0, 100),
                authorName: recentPost.author.name,
                authorAvatar: recentPost.author.profile?.avatar,
                createdAt: recentPost.createdAt,
              }
            : null,
          description: getProgramDescription(program),
          emoji: getProgramEmoji(program),
        }
      })
    )

    return NextResponse.json(
      {
        programs,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Programs fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch programs' },
      { status: 500 }
    )
  }
}

function getProgramDescription(program: string): string {
  const descriptions: Record<string, string> = {
    YSMP: 'Young Spirit Mentoring Program - Dedicated support for young people on their personal growth journey.',
    'Thrive Tribe': 'Community-focused program celebrating resilience, connection, and collective growth.',
    'Healing Centre': 'Culturally-grounded space for wellness, healing, and inner peace.',
  }
  return descriptions[program] || ''
}

function getProgramEmoji(program: string): string {
  const emojis: Record<string, string> = {
    YSMP: '🌟',
    'Thrive Tribe': '🌱',
    'Healing Centre': '💚',
  }
  return emojis[program] || '📍'
}
