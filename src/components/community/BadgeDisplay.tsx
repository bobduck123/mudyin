'use client'

import { getBadgeIcon } from '@/lib/badges'

interface BadgeDisplayProps {
  badges: string[]
  size?: 'sm' | 'md' | 'lg'
  showLabels?: boolean
  maxDisplay?: number
}

export function BadgeDisplay({
  badges,
  size = 'md',
  showLabels = false,
  maxDisplay = 8,
}: BadgeDisplayProps) {
  if (!badges || badges.length === 0) {
    return null
  }

  const displayedBadges = badges.slice(0, maxDisplay)
  const remainingCount = badges.length - maxDisplay

  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-12 h-12 text-lg',
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {displayedBadges.map((badgeId) => {
          const badge = getBadgeIcon(badgeId)
          if (!badge) return null

          return (
            <div
              key={badgeId}
              className={`${sizeClasses[size]} flex items-center justify-center rounded-full border-2 transition-transform hover:scale-110 cursor-default`}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderColor: badge.color,
              }}
              title={`${badge.name}: ${badge.description}`}
            >
              <span>{badge.icon}</span>
            </div>
          )
        })}

        {remainingCount > 0 && (
          <div
            className={`${sizeClasses[size]} flex items-center justify-center rounded-full border-2 font-semibold`}
            style={{
              backgroundColor: 'rgba(210, 168, 85, 0.1)',
              borderColor: 'var(--color-ochre-400)',
              color: 'var(--color-ochre-400)',
            }}
            title={`${remainingCount} more badges`}
          >
            +{remainingCount}
          </div>
        )}
      </div>

      {showLabels && (
        <div className="text-xs space-y-1">
          {displayedBadges.map((badgeId) => {
            const badge = getBadgeIcon(badgeId)
            if (!badge) return null

            return (
              <div
                key={badgeId}
                className="flex items-start gap-2"
              >
                <span>{badge.icon}</span>
                <div>
                  <p className="font-semibold">{badge.name}</p>
                  <p className="text-gray-600">{badge.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
