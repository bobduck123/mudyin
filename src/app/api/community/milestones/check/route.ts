import { NextRequest, NextResponse } from 'next/server'
import { checkCelebrationMilestones } from '@/lib/celebrations'

export async function POST(request: NextRequest) {
  try {
    // Get user ID from session or request body
    const body = await request.json()
    const userId = body.userId

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Check for new milestones
    const result = await checkCelebrationMilestones(userId)

    return NextResponse.json(
      {
        reachedMilestones: result.reachedMilestones,
        newBadges: result.newBadges,
        hasNewMilestones: result.reachedMilestones.length > 0,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Milestone check error:', error)
    return NextResponse.json(
      { error: 'Failed to check milestones' },
      { status: 500 }
    )
  }
}
