'use client'

import { useEffect, useState } from 'react'
import { CelebrationMilestone, getProgramMilestones, getDaysUntilNextMilestone } from '@/lib/celebrations'

interface MilestoneTrackerProps {
  userId: string
  program: string
  earnedBadges: string[]
}

interface NextMilestone {
  currentDays: number
  nextMilestoneDays: number
  daysUntil: number
  milestone: CelebrationMilestone
}

export function MilestoneTracker({
  userId,
  program,
  earnedBadges,
}: MilestoneTrackerProps) {
  const [nextMilestone, setNextMilestone] = useState<NextMilestone | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadMilestoneProgress() {
      try {
        // This would be called from an API in a real implementation
        // For now, we'll calculate client-side for demonstration
        const milestones = getProgramMilestones(program)

        // Find the next milestone not yet earned
        const nextUnearned = milestones.find((m) => !earnedBadges.includes(m.badgeId))

        if (nextUnearned) {
          const result = await getDaysUntilNextMilestone(userId, program)
          if (result) {
            setNextMilestone(result)
          }
        }
      } catch (error) {
        console.error('Error loading milestone progress:', error)
      } finally {
        setLoading(false)
      }
    }

    loadMilestoneProgress()
  }, [userId, program, earnedBadges])

  if (loading) {
    return (
      <div className="card-dark p-4 animate-pulse">
        <div className="h-6 bg-white/10 rounded w-3/4 mb-4" />
        <div className="space-y-2">
          <div className="h-4 bg-white/10 rounded w-full" />
          <div className="h-4 bg-white/10 rounded w-5/6" />
        </div>
      </div>
    )
  }

  if (!nextMilestone) {
    return (
      <div className="card-dark p-4 text-center">
        <p className="text-sage-500 font-medium">🏆 All Milestones Unlocked!</p>
        <p className="text-white/60 text-sm mt-2">
          You&apos;ve achieved all milestones in {program}
        </p>
      </div>
    )
  }

  const progressPercent = (nextMilestone.currentDays / nextMilestone.nextMilestoneDays) * 100

  return (
    <div className="card-dark p-6 border-l-4" style={{ borderColor: 'var(--color-sage-500)' }}>
      <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
        <span>🎯</span>
        <span>Next Milestone</span>
      </h3>

      <div className="mb-4">
        <p className="text-ochre-400 font-medium mb-1">
          {nextMilestone.milestone.celebrationTitle}
        </p>
        <p className="text-white/70 text-sm">
          {nextMilestone.nextMilestoneDays} days total
        </p>
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="bg-white/10 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-sage-500 to-ochre-400 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(progressPercent, 100)}%` }}
          />
        </div>
      </div>

      {/* Progress text */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-white/60">
          {nextMilestone.currentDays} / {nextMilestone.nextMilestoneDays} days
        </span>
        <span className="text-sage-400 font-semibold">
          {nextMilestone.daysUntil} days to go
        </span>
      </div>

      {/* Milestone visualization */}
      <div className="mt-6 grid grid-cols-3 gap-2">
        {getProgramMilestones(program).map((m, idx) => (
          <div
            key={m.badgeId}
            className={`text-center p-3 rounded-lg transition ${
              earnedBadges.includes(m.badgeId)
                ? 'bg-sage-500/20 border border-sage-500'
                : idx < getProgramMilestones(program).indexOf(nextMilestone.milestone)
                  ? 'bg-ochre-400/20 border border-ochre-400'
                  : 'bg-white/5 border border-white/10'
            }`}
          >
            <p className="text-sm font-medium text-white">{m.daysRequired}d</p>
            <p className="text-xs text-white/60 mt-1">
              {earnedBadges.includes(m.badgeId) ? '✓ Unlocked' : 'Locked'}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
