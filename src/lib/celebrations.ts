import { prisma } from './db'
import { createNotification } from './notifications'

export interface CelebrationMilestone {
  daysRequired: number
  badgeId: string
  title?: string
  celebrationTitle: string
  celebrationTemplate: string
}

/**
 * Define celebration milestones for each program
 * Triggers at 50, 100, and 365 days
 */
export const CELEBRATION_MILESTONES: Record<string, CelebrationMilestone[]> = {
  YSMP: [
    {
      daysRequired: 50,
      badgeId: '50_days_ysmp',
      title: '50 Days Strong!',
      celebrationTitle: '50 Days Strong!',
      celebrationTemplate:
        "🌟 {name} has been committed to YSMP for 50 days! That's 50 days of growth, resilience, and positive change. Keep pushing forward! 💪",
    },
    {
      daysRequired: 100,
      badgeId: '100_days_ysmp',
      title: '100 Days Unstoppable!',
      celebrationTitle: '100 Days Unstoppable!',
      celebrationTemplate:
        "🏆 {name} has reached 100 days in YSMP! This is a massive milestone - a full journey of transformation, support, and community. You're unstoppable! 🔥",
    },
    {
      daysRequired: 365,
      badgeId: '365_days_ysmp',
      title: 'One Year Celebration!',
      celebrationTitle: 'One Year Celebration! 🎉',
      celebrationTemplate:
        "👑 ONE YEAR! {name} has been part of YSMP for a full year! This incredible journey is a testament to your commitment, strength, and dedication to your growth. You're a true champion! 🌈",
    },
  ],
  'Thrive Tribe': [
    {
      daysRequired: 50,
      badgeId: '50_days_thrive',
      title: 'Thriving for 50 Days!',
      celebrationTitle: 'Thriving for 50 Days!',
      celebrationTemplate:
        "🌱 {name} has been thriving with Thrive Tribe for 50 days! 50 days of community support, personal growth, and positive vibes. You're thriving! 🌿",
    },
    {
      daysRequired: 100,
      badgeId: '100_days_thrive',
      title: '100 Days of Growth!',
      celebrationTitle: '100 Days of Growth!',
      celebrationTemplate:
        "🌳 {name} has reached 100 days of growth with Thrive Tribe! This milestone celebrates the transformation, connections, and positive energy you've brought to our community. Keep growing! 💚",
    },
    {
      daysRequired: 365,
      badgeId: '365_days_thrive',
      title: 'One Year with Thrive Tribe!',
      celebrationTitle: 'One Year with Thrive Tribe! 🎊',
      celebrationTemplate:
        "🌟 A full year of thriving! {name} has been part of Thrive Tribe for 365 days, cultivating growth and community. Your dedication inspires us all! 🌸",
    },
  ],
  'Healing Centre': [
    {
      daysRequired: 50,
      badgeId: '50_days_healing',
      title: '50 Days of Healing!',
      celebrationTitle: '50 Days of Healing!',
      celebrationTemplate:
        "💙 {name} has been on their healing journey for 50 days! 50 days of courage, self-discovery, and support. Your healing matters. 🕊️",
    },
    {
      daysRequired: 100,
      badgeId: '100_days_healing',
      title: '100 Days of Transformation!',
      celebrationTitle: '100 Days of Transformation!',
      celebrationTemplate:
        "✨ {name} has reached 100 days at the Healing Centre! This is 100 days of brave steps toward wellness, hope, and inner peace. You've got this! 🌸",
    },
    {
      daysRequired: 365,
      badgeId: '365_days_healing',
      title: 'One Year of Healing!',
      celebrationTitle: 'One Year of Healing! 🌈',
      celebrationTemplate:
        "💫 A full year of healing and growth! {name} has been part of the Healing Centre journey for 365 days. Your resilience and commitment to wellness inspire us all. Welcome home! 💚",
    },
  ],
}

export interface MilestoneCheckResult {
  reachedMilestones: CelebrationMilestone[]
  newBadges: string[]
}

/**
 * Check if user has reached any celebration milestones
 * Called when user's profile is viewed or session is checked
 */
export async function checkCelebrationMilestones(
  userId: string,
  program?: string
): Promise<MilestoneCheckResult> {
  try {
    const result: MilestoneCheckResult = {
      reachedMilestones: [],
      newBadges: [],
    }

    // Get user's program enrollments
    const enrollments = await prisma.userProgramEnrollment.findMany({
      where: program ? { userId, program } : { userId },
    })

    if (enrollments.length === 0) {
      return result
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    })

    if (!user) {
      return result
    }

    const currentBadges = user.profile?.badges || []
    const updatedBadges = [...currentBadges]

    // For each program enrollment, check milestones
    for (const enrollment of enrollments) {
      const programMilestones = CELEBRATION_MILESTONES[enrollment.program]

      if (!programMilestones) continue

      const daysInProgram = Math.floor(
        (Date.now() - enrollment.enrolledAt.getTime()) / (1000 * 60 * 60 * 24)
      )

      // Check each milestone for this program
      for (const milestone of programMilestones) {
        // Check if user has reached this milestone AND doesn't have the badge yet
        if (daysInProgram >= milestone.daysRequired && !currentBadges.includes(milestone.badgeId)) {
          result.reachedMilestones.push(milestone)

          if (!updatedBadges.includes(milestone.badgeId)) {
            updatedBadges.push(milestone.badgeId)
          }

          // Create celebration post for this milestone
          await createCelebrationPost(userId, milestone, enrollment.program, daysInProgram)

          // Create notification
          await createNotification({
            userId,
            type: 'milestone',
            title: `🎉 ${milestone.celebrationTitle}`,
            message: milestone.celebrationTemplate.replace('{name}', user.name).replace('{program}', enrollment.program).replace('{days}', String(daysInProgram)),
          })
        }
      }
    }

    // Update user badges if any new ones earned
    if (updatedBadges.length > currentBadges.length) {
      result.newBadges = updatedBadges.filter((b) => !currentBadges.includes(b))

      if (user.profile) {
        await prisma.userProfile.update({
          where: { userId },
          data: { badges: updatedBadges },
        })
      }
    }

    return result
  } catch (error) {
    console.error('Error checking celebration milestones:', error)
    return {
      reachedMilestones: [],
      newBadges: [],
    }
  }
}

/**
 * Create an auto-generated celebration post for a milestone
 */
export async function createCelebrationPost(
  userId: string,
  milestone: CelebrationMilestone,
  program: string,
  daysInProgram: number
) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true },
    })

    if (!user) return null

    const celebrationMessage = milestone.celebrationTemplate
      .replace('{name}', user.name)
      .replace('{program}', program)
      .replace('{days}', String(daysInProgram))

    // Create celebration post
    const post = await prisma.communityPost.create({
      data: {
        authorId: userId,
        content: celebrationMessage,
        program,
        tags: ['milestone', 'celebration', program.toLowerCase().replace(' ', '-')],
        visibility: 'public',
        isFeatured: true, // Feature celebration posts
      },
    })

    // Link this post to the milestone celebration
    await prisma.celebrationPost.create({
      data: {
        postId: post.id,
        userId,
        milestoneId: milestone.badgeId,
        isAutoGenerated: true,
      },
    })

    return post
  } catch (error) {
    console.error('Error creating celebration post:', error)
    return null
  }
}

/**
 * Get celebration milestones for a specific program
 */
export function getProgramMilestones(program: string): CelebrationMilestone[] {
  return CELEBRATION_MILESTONES[program] || []
}

/**
 * Calculate days until next milestone for user
 */
export async function getDaysUntilNextMilestone(userId: string, program: string) {
  try {
    const enrollment = await prisma.userProgramEnrollment.findUnique({
      where: {
        userId_program: {
          userId,
          program,
        },
      },
    })

    if (!enrollment) return null

    const daysInProgram = Math.floor(
      (Date.now() - enrollment.enrolledAt.getTime()) / (1000 * 60 * 60 * 24)
    )

    const milestones = getProgramMilestones(program)
    const nextMilestone = milestones.find((m) => m.daysRequired > daysInProgram)

    if (!nextMilestone) return null

    return {
      currentDays: daysInProgram,
      nextMilestoneDays: nextMilestone.daysRequired,
      daysUntil: nextMilestone.daysRequired - daysInProgram,
      milestone: nextMilestone,
    }
  } catch (error) {
    console.error('Error calculating days to next milestone:', error)
    return null
  }
}
