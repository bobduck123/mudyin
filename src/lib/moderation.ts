import { prisma } from './db'
import { demoId, isDbUnavailableError } from './demo-fallback'

// ─── Banned Keywords & Triggers ──────────────────────────────────────────────
// Keywords that automatically flag content for review or removal
// Organized by severity level
export const BANNED_KEYWORDS = {
  critical: [
    // Self-harm and suicide triggers
    'suicide',
    'kill myself',
    'take my life',
    'end it all',
    'cut myself',
    'self harm',
    'self-harm',
    'overdose',
    'hang myself',
    'slit wrist',
  ],
  high: [
    // Abuse and violence
    'kill yourself',
    'bastard',
    'domestic violence',
    'rape',
    'sexual assault',
    'child abuse',
    'sexual abuse',
    'death threat',
    'murder',
    'stalking',
    'harassment',
    'bullying',
  ],
  medium: [
    // Hate speech and discrimination
    'hate speech',
    'racism',
    'racist',
    'sexism',
    'sexist',
    'homophobic',
    'transphobic',
    'slur',
    'ethnic cleansing',
    'white supremacy',
    'thieves',
    'spam',
  ],
  low: [
    // Spam and misleading content
    'buy now',
    'click here',
    'limited offer',
    'too good to be true',
    'nigerian prince',
    'click bait',
  ],
}

// ─── Crisis Resources ───────────────────────────────────────────────────────
export const CRISIS_HOTLINES = [
  {
    name: 'Lifeline Australia',
    description: '24/7 crisis support and suicide prevention',
    phone: '13 11 14',
    sms: '0477 13 11 14',
    web: 'https://www.lifeline.org.au',
    region: 'Australia',
    supportTypes: ['suicide', 'self-harm', 'mental-health', 'crisis'],
  },
  {
    name: 'Kids Helpline',
    description: 'Confidential support for young people aged 5-25',
    phone: '1800 55 1800',
    web: 'https://www.kidshelpline.com.au',
    region: 'Australia',
    supportTypes: ['youth', 'mental-health', 'abuse', 'bullying'],
  },
  {
    name: 'beyondblue',
    description: 'Information and support for depression, anxiety and related disorders',
    phone: '1300 224 636',
    web: 'https://www.beyondblue.org.au',
    region: 'Australia',
    supportTypes: ['mental-health', 'depression', 'anxiety'],
  },
  {
    name: '1800RESPECT',
    description: 'National sexual assault, domestic and family violence counselling service',
    phone: '1800 737 732',
    web: 'https://www.1800respect.org.au',
    region: 'Australia',
    supportTypes: ['domestic-violence', 'sexual-assault', 'abuse'],
  },
  {
    name: 'Aboriginal and Torres Strait Islander Crisis Line',
    description: 'Crisis support for Indigenous Australians',
    phone: '1300 112 471',
    web: 'https://www.qld.gov.au',
    region: 'Australia',
    supportTypes: ['crisis', 'cultural-support', 'mental-health'],
  },
]

// ─── Severity Scoring ───────────────────────────────────────────────────────

export interface ContentAnalysis {
  flagged: boolean
  severity: number // 0-100
  priority: 'low' | 'medium' | 'high' | 'critical'
  reason: string
  triggers: string[]
  suggestedAction: 'none' | 'warn' | 'flag' | 'remove' | 'remove_and_notify' | 'ban'
  crisisResources: typeof CRISIS_HOTLINES[0][]
}

/**
 * Analyze content for policy violations
 * Returns severity score and suggested action
 */
export function analyzeContent(
  content: string,
  contentType: 'post' | 'comment' | 'profile' = 'post'
): ContentAnalysis {
  const triggers: string[] = []
  let maxSeverity = 0
  const lowerContent = content.toLowerCase()
  const normalizedContent = lowerContent.replace(/[^a-z0-9\s]/g, '')

  // Check banned keywords
  for (const [level, keywords] of Object.entries(BANNED_KEYWORDS)) {
    const levelSeverity = getSeverityValue(level)

    for (const keyword of keywords) {
      if (lowerContent.includes(keyword.toLowerCase())) {
        triggers.push(keyword)
        maxSeverity = Math.max(maxSeverity, levelSeverity)
        continue
      }

      const normalizedKeyword = keyword.toLowerCase().replace(/[^a-z0-9\s]/g, '')
      if (normalizedKeyword && normalizedContent.includes(normalizedKeyword)) {
        triggers.push(keyword)
        maxSeverity = Math.max(maxSeverity, levelSeverity)
        continue
      }

      if (containsObfuscatedMatch(lowerContent, keyword.toLowerCase())) {
        triggers.push(keyword)
        maxSeverity = Math.max(maxSeverity, levelSeverity)
      }
    }
  }

  // Additional heuristics
  if (hasExcessiveCaps(content)) {
    maxSeverity = Math.max(maxSeverity, 20)
    triggers.push('excessive_caps')
  }

  if (hasExcessiveSymbols(content)) {
    maxSeverity = Math.max(maxSeverity, 15)
    triggers.push('excessive_symbols')
  }

  // Determine priority and action
  const priority = getSeverityPriority(maxSeverity)
  const suggestedAction = getSuggestedAction(maxSeverity, contentType)
  const crisisResources =
    maxSeverity >= 80 ? getCrisisResourcesForSeverity(triggers) : []

  return {
    flagged: maxSeverity > 30,
    severity: maxSeverity,
    priority,
    reason: triggers.length > 0 ? `Contains: ${triggers.join(', ')}` : 'Automated review triggered',
    triggers: [...new Set(triggers)],
    suggestedAction,
    crisisResources,
  }
}

export function getSeverityValue(level: string): number {
  const severityMap: Record<string, number> = {
    critical: 90,
    high: 70,
    medium: 50,
    low: 20,
  }
  return severityMap[level] || 0
}

export function getSeverityPriority(
  severity: number
): 'low' | 'medium' | 'high' | 'critical' {
  if (severity >= 80) return 'critical'
  if (severity >= 60) return 'high'
  if (severity >= 40) return 'medium'
  return 'low'
}

function getSuggestedAction(
  severity: number,
  _contentType: string
): 'none' | 'warn' | 'flag' | 'remove' | 'remove_and_notify' | 'ban' {
  if (severity >= 85) return 'remove_and_notify'
  if (severity >= 70) return 'remove'
  if (severity >= 40) return 'warn'
  return 'none'
}

function hasExcessiveCaps(content: string): boolean {
  const capsCount = (content.match(/[A-Z]/g) || []).length
  const totalLetters = (content.match(/[a-zA-Z]/g) || []).length
  return totalLetters > 10 && capsCount / totalLetters > 0.5
}

function hasExcessiveSymbols(content: string): boolean {
  const symbolCount = (content.match(/[!@#$%^&*]/g) || []).length
  return symbolCount > content.length / 5
}

function containsObfuscatedMatch(content: string, keyword: string): boolean {
  if (keyword.length < 5) return false
  const compact = content.replace(/[^a-z0-9]/g, '')
  if (compact.includes(keyword)) return true

  const prefix = keyword.slice(0, 3)
  const suffix = keyword.slice(-2)
  const prefixIndex = compact.indexOf(prefix)
  const suffixIndex = compact.indexOf(suffix, Math.max(prefixIndex, 0) + prefix.length)
  return prefixIndex >= 0 && suffixIndex > prefixIndex
}

/**
 * Get crisis resources relevant to the severity triggers
 */
export function getCrisisResourcesForSeverity(triggers: string[]): typeof CRISIS_HOTLINES[0][] {
  const resourceTypes = new Set<string>()

  if (
    triggers.some(
      (t) =>
        t === 'suicide' ||
        t === 'kill myself' ||
        t === 'take my life' ||
        t === 'end it all'
    )
  ) {
    resourceTypes.add('suicide')
  }

  if (triggers.some((t) => t === 'cut myself' || t === 'self harm' || t === 'self-harm')) {
    resourceTypes.add('self-harm')
  }

  if (triggers.some((t) => t.includes('abuse') || t === 'rape')) {
    resourceTypes.add('sexual-assault')
    resourceTypes.add('abuse')
  }

  if (triggers.some((t) => t === 'domestic violence')) {
    resourceTypes.add('domestic-violence')
  }

  return CRISIS_HOTLINES.filter(
    (resource) =>
      resource.supportTypes &&
      resource.supportTypes.some((type) => resourceTypes.has(type))
  )
}

/**
 * Flag content for moderation review
 */
export async function flagContentForReview(
  contentType: string,
  contentId: string,
  reason: string,
  description?: string,
  flaggedBy?: string
) {
  try {
    const analysis = analyzeContent(description || '', contentType as 'post' | 'comment')

    const flaggedContent = await prisma.flaggedContent.create({
      data: {
        contentType,
        contentId,
        reason,
        description,
        flaggedBy: flaggedBy || 'system',
        status: 'pending',
        priority: analysis.priority,
        severity: analysis.severity,
      },
    })

    return flaggedContent
  } catch (error) {
    if (isDbUnavailableError(error)) {
      return {
        id: demoId('flag'),
        contentType,
        contentId,
        reason,
        description,
        flaggedBy: flaggedBy || 'system',
        status: 'pending',
      }
    }
    console.error('Error flagging content:', error)
    return null
  }
}

/**
 * Check if user is banned
 */
export async function isUserBanned(userId: string): Promise<boolean> {
  try {
    const banned = await prisma.bannedUser.findUnique({
      where: { userId },
    })

    if (!banned) return false

    // Check if temporary ban has expired
    if (banned.unbanAt && banned.unbanAt < new Date()) {
      // Ban has expired - remove it
      await prisma.bannedUser.delete({
        where: { userId },
      })
      return false
    }

    return true
  } catch (error) {
    console.error('Error checking ban status:', error)
    return false
  }
}

/**
 * Get ban details for a user
 */
export async function getBanDetails(userId: string) {
  try {
    const ban = await prisma.bannedUser.findUnique({
      where: { userId },
    })

    if (!ban) return null

    // Check if ban has expired
    if (ban.unbanAt && ban.unbanAt < new Date()) {
      await prisma.bannedUser.delete({
        where: { userId },
      })
      return null
    }

    return {
      reason: ban.reason,
      bannedAt: ban.bannedAt,
      unbanAt: ban.unbanAt,
      isPermanent: !ban.unbanAt,
      canAppeal: ban.severity !== 'permanent' && !ban.appealedAt,
    }
  } catch (error) {
    console.error('Error getting ban details:', error)
    return null
  }
}

/**
 * Ban a user temporarily or permanently
 */
export async function banUser(
  userId: string,
  reason: string,
  durationDays?: number,
  bannedBy?: string
) {
  try {
    const unbanAt = durationDays
      ? new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000)
      : null

    const ban = await prisma.bannedUser.upsert({
      where: { userId },
      update: {
        reason,
        unbanAt,
        severity: durationDays ? 'temporary' : 'permanent',
        bannedAt: new Date(),
      },
      create: {
        userId,
        reason,
        unbanAt,
        severity: durationDays ? 'temporary' : 'permanent',
        bannedBy,
      },
    })

    // Log the action
    await prisma.auditLog.create({
      data: {
        userId: bannedBy,
        action: 'ban_user',
        details: {
          targetUserId: userId,
          reason,
          duration: durationDays || 'permanent',
        },
      },
    })

    return ban
  } catch (error) {
    console.error('Error banning user:', error)
    return null
  }
}

/**
 * Appeal a ban
 */
export async function appealBan(userId: string, appealNotes: string) {
  try {
    const ban = await prisma.bannedUser.update({
      where: { userId },
      data: {
        appealedAt: new Date(),
        appealStatus: 'pending',
        appealNotes,
      },
    })

    return ban
  } catch (error) {
    console.error('Error appealing ban:', error)
    return null
  }
}

/**
 * Check if user has moderator role
 */
export async function isModerator(userId: string): Promise<boolean> {
  try {
    const role = await prisma.moderatorRole.findUnique({
      where: { userId },
    })

    return !!role && !role.revokedAt
  } catch (error) {
    console.error('Error checking moderator status:', error)
    return false
  }
}

/**
 * Get moderator permissions
 */
export async function getModeratorPermissions(userId: string): Promise<string[]> {
  try {
    const role = await prisma.moderatorRole.findUnique({
      where: { userId },
    })

    return role?.permissions || []
  } catch (error) {
    console.error('Error getting moderator permissions:', error)
    return []
  }
}
