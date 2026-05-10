// Badge definitions and logic
export interface Badge {
  id: string
  name: string
  description: string
  icon: string // emoji
  color: string // CSS color
  earnedAt?: Date
}

export const AVAILABLE_BADGES: Record<string, Badge> = {
  // Original badges
  '100_days_ysmp': {
    id: '100_days_ysmp',
    name: '100 Days Strong',
    description: 'Completed 100 days in the Young Spirit Mentoring Program',
    icon: '💪',
    color: 'var(--color-ochre-400)',
  },
  '365_days_ysmp': {
    id: '365_days_ysmp',
    name: 'YSMP Champion',
    description: 'One full year of commitment to YSMP',
    icon: '🏆',
    color: '#c8860a',
  },
  'program_graduate': {
    id: 'program_graduate',
    name: 'Program Graduate',
    description: 'Successfully completed a program',
    icon: '🎓',
    color: '#9dc183',
  },
  'community_contributor': {
    id: 'community_contributor',
    name: 'Community Contributor',
    description: 'Active participant in community activities',
    icon: '🤝',
    color: '#c8a75d',
  },
  'storyteller': {
    id: 'storyteller',
    name: 'Storyteller',
    description: 'Shared meaningful stories with the community',
    icon: '📖',
    color: '#9d5d41',
  },
  'mentor': {
    id: 'mentor',
    name: 'Mentor',
    description: 'Helped guide and support other members',
    icon: '🌟',
    color: '#fbbf24',
  },
  'cultural_keeper': {
    id: 'cultural_keeper',
    name: 'Cultural Keeper',
    description: 'Shared cultural knowledge and practices',
    icon: '🪶',
    color: '#059669',
  },
  // Sprint 6: YSMP milestone badges
  '50_days_ysmp': {
    id: '50_days_ysmp',
    name: '50 Days Strong',
    description: 'Completed 50 days in the Young Spirit Mentoring Program',
    icon: '🌟',
    color: 'var(--color-ochre-400)',
  },
  '1_year_ysmp': {
    id: '1_year_ysmp',
    name: 'One Year Champion',
    description: 'One full year of commitment to YSMP',
    icon: '👑',
    color: '#c8860a',
  },
  // Sprint 6: Thrive Tribe milestone badges
  '50_days_thrive': {
    id: '50_days_thrive',
    name: '50 Days Thriving',
    description: 'Completed 50 days of growth with Thrive Tribe',
    icon: '🌱',
    color: '#9dc183',
  },
  '100_days_thrive': {
    id: '100_days_thrive',
    name: '100 Days Growth',
    description: 'Completed 100 days of growth with Thrive Tribe',
    icon: '🌳',
    color: '#9dc183',
  },
  '1_year_thrive': {
    id: '1_year_thrive',
    name: 'One Year Thriving',
    description: 'One full year of growth with Thrive Tribe',
    icon: '🌲',
    color: '#059669',
  },
  // Sprint 6: Healing Centre milestone badges
  '50_days_healing': {
    id: '50_days_healing',
    name: '50 Days Healing',
    description: 'Completed 50 days of healing journey',
    icon: '💙',
    color: '#c8a75d',
  },
  '100_days_healing': {
    id: '100_days_healing',
    name: '100 Days Strong',
    description: 'Completed 100 days of healing journey',
    icon: '✨',
    color: '#c8a75d',
  },
  '1_year_healing': {
    id: '1_year_healing',
    name: 'One Year Healed',
    description: 'One full year of healing journey',
    icon: '🌈',
    color: '#059669',
  },
}

/**
 * Award badges based on user activity and milestones
 * Called when checking user progress
 */
export function checkBadgeEligibility(
  userStats: {
    daysInProgram: number
    postsCount: number
    photosCount: number
    commentsCount: number
    followersCount: number
    program?: string
  },
  currentBadges: string[]
): string[] {
  const newBadges = [...currentBadges]

  // Check 100 days YSMP
  if (
    userStats.daysInProgram >= 100 &&
    userStats.program === 'YSMP' &&
    !newBadges.includes('100_days_ysmp')
  ) {
    newBadges.push('100_days_ysmp')
  }

  // Check 365 days YSMP
  if (
    userStats.daysInProgram >= 365 &&
    userStats.program === 'YSMP' &&
    !newBadges.includes('365_days_ysmp')
  ) {
    newBadges.push('365_days_ysmp')
  }

  // Check storyteller (10+ photos or posts)
  if (
    (userStats.photosCount >= 5 || userStats.postsCount >= 10) &&
    !newBadges.includes('storyteller')
  ) {
    newBadges.push('storyteller')
  }

  // Check community contributor (50+ comments or 20+ posts)
  if (
    (userStats.commentsCount >= 50 || userStats.postsCount >= 20) &&
    !newBadges.includes('community_contributor')
  ) {
    newBadges.push('community_contributor')
  }

  // Check mentor (100+ followers)
  if (
    userStats.followersCount >= 100 &&
    !newBadges.includes('mentor')
  ) {
    newBadges.push('mentor')
  }

  return newBadges
}

export function getBadgeIcon(badgeId: string): Badge | undefined {
  return AVAILABLE_BADGES[badgeId]
}
