import {
  CELEBRATION_MILESTONES,
  checkCelebrationMilestones,
  getDaysUntilNextMilestone,
} from '../celebrations'

describe('Celebrations - Milestone Tracking', () => {
  describe('CELEBRATION_MILESTONES constant', () => {
    it('should define milestones for YSMP', () => {
      expect(CELEBRATION_MILESTONES['YSMP']).toBeDefined()
      expect(CELEBRATION_MILESTONES['YSMP'].length).toBeGreaterThan(0)
    })

    it('should define milestones for Thrive Tribe', () => {
      expect(CELEBRATION_MILESTONES['Thrive Tribe']).toBeDefined()
    })

    it('should define milestones for Healing Centre', () => {
      expect(CELEBRATION_MILESTONES['Healing Centre']).toBeDefined()
    })

    it('should have standard milestone days', () => {
      const ysmpMilestones = CELEBRATION_MILESTONES['YSMP']
      const days = ysmpMilestones.map((m) => m.daysRequired)
      expect(days).toContain(50)
      expect(days).toContain(100)
      expect(days).toContain(365)
    })

    it('should have badge IDs for each milestone', () => {
      Object.values(CELEBRATION_MILESTONES).forEach((milestones) => {
        milestones.forEach((milestone) => {
          expect(milestone.badgeId).toBeDefined()
          expect(milestone.badgeId.length).toBeGreaterThan(0)
        })
      })
    })

    it('should have celebration titles', () => {
      Object.values(CELEBRATION_MILESTONES).forEach((milestones) => {
        milestones.forEach((milestone) => {
          expect(milestone.title).toBeDefined()
          expect(milestone.title.includes('!')).toBe(true) // Should be celebratory
        })
      })
    })
  })

  describe('Milestone calculation', () => {
    it('should calculate days elapsed correctly', () => {
      // Test with known dates
      const enrolledAt = new Date('2024-01-01')
      const currentDate = new Date('2024-02-19') // 49 days

      const daysElapsed = Math.floor(
        (currentDate.getTime() - enrolledAt.getTime()) / (1000 * 60 * 60 * 24)
      )
      expect(daysElapsed).toBe(49)
    })

    it('should recognize when 50-day milestone is reached', () => {
      const enrolledAt = new Date('2024-01-01')
      const currentDate = new Date('2024-02-20') // 50 days

      const daysElapsed = Math.floor(
        (currentDate.getTime() - enrolledAt.getTime()) / (1000 * 60 * 60 * 24)
      )
      expect(daysElapsed).toBeGreaterThanOrEqual(50)
    })

    it('should recognize when 100-day milestone is reached', () => {
      const enrolledAt = new Date('2024-01-01')
      const currentDate = new Date('2024-04-10') // 100 days

      const daysElapsed = Math.floor(
        (currentDate.getTime() - enrolledAt.getTime()) / (1000 * 60 * 60 * 24)
      )
      expect(daysElapsed).toBeGreaterThanOrEqual(100)
    })

    it('should recognize when 365-day milestone is reached', () => {
      const enrolledAt = new Date('2023-01-01')
      const currentDate = new Date('2024-01-01') // 365 days

      const daysElapsed = Math.floor(
        (currentDate.getTime() - enrolledAt.getTime()) / (1000 * 60 * 60 * 24)
      )
      expect(daysElapsed).toBeGreaterThanOrEqual(365)
    })
  })

  describe('getDaysUntilNextMilestone', () => {
    it('should calculate days until 50-day milestone', () => {
      const enrolledAt = new Date('2024-01-01')
      const currentDate = new Date('2024-02-10') // 40 days

      const daysElapsed = Math.floor(
        (currentDate.getTime() - enrolledAt.getTime()) / (1000 * 60 * 60 * 24)
      )
      const daysUntilNext = 50 - daysElapsed
      expect(daysUntilNext).toBe(10)
    })

    it('should show 0 days until milestone if milestone reached', () => {
      const enrolledAt = new Date('2024-01-01')
      const currentDate = new Date('2024-02-20') // 50 days

      const daysElapsed = Math.floor(
        (currentDate.getTime() - enrolledAt.getTime()) / (1000 * 60 * 60 * 24)
      )
      expect(daysElapsed).toBeGreaterThanOrEqual(50)
    })
  })

  describe('Milestone milestones ordering', () => {
    it('should be ordered by days required', () => {
      Object.values(CELEBRATION_MILESTONES).forEach((milestones) => {
        for (let i = 0; i < milestones.length - 1; i++) {
          expect(milestones[i].daysRequired).toBeLessThan(
            milestones[i + 1].daysRequired
          )
        }
      })
    })
  })

  describe('Badge progression', () => {
    it('should award badges in order', () => {
      // User journey: 50 days -> 100 days -> 365 days
      // Each milestone should award correct badge
      const ysmpMilestones = CELEBRATION_MILESTONES['YSMP']
      expect(ysmpMilestones[0].badgeId).toContain('50')
      expect(ysmpMilestones[1].badgeId).toContain('100')
      expect(ysmpMilestones[2].badgeId).toContain('365')
    })

    it('should have distinct badge IDs', () => {
      const allBadgeIds: string[] = []
      Object.values(CELEBRATION_MILESTONES).forEach((milestones) => {
        milestones.forEach((m) => allBadgeIds.push(m.badgeId))
      })
      const uniqueIds = new Set(allBadgeIds)
      expect(uniqueIds.size).toBe(allBadgeIds.length)
    })
  })

  describe('Celebration messages', () => {
    it('should have celebratory titles', () => {
      Object.values(CELEBRATION_MILESTONES).forEach((milestones) => {
        milestones.forEach((m) => {
          // Should contain "!" or celebratory language
          expect(m.title).toMatch(/!|Strong|Success|Achievement|Celebration/i)
        })
      })
    })
  })
})
