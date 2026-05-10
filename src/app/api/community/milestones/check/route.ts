import { NextResponse } from 'next/server'
import { checkCelebrationMilestones } from '@/lib/celebrations'
import { requireSessionUser } from '@/lib/api-auth'

export async function POST() {
  try {
    const auth = await requireSessionUser()
    if (!auth.ok) return auth.response
    const userId = auth.userId

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
