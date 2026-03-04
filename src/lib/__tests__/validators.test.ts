import {
  registerSchema,
  loginSchema,
  createPostSchema,
  createCommentSchema,
  createStorySchema,
  reportContentSchema,
} from '../validators'

describe('Form Validators - Zod Schemas', () => {
  describe('registerSchema', () => {
    it('should validate correct registration data', () => {
      const data = {
        email: 'user@example.com',
        password: 'SecurePass123!',
        confirmPassword: 'SecurePass123!',
        name: 'John Doe',
        dateOfBirth: '2010-01-15',
        agreeToTerms: true,
      }
      const result = registerSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should reject invalid email', () => {
      const data = {
        email: 'not-an-email',
        password: 'SecurePass123!',
        confirmPassword: 'SecurePass123!',
        name: 'John Doe',
        dateOfBirth: '2010-01-15',
        agreeToTerms: true,
      }
      const result = registerSchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('should reject weak password', () => {
      const data = {
        email: 'user@example.com',
        password: 'weak',
        confirmPassword: 'weak',
        name: 'John Doe',
        dateOfBirth: '2010-01-15',
        agreeToTerms: true,
      }
      const result = registerSchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('should reject mismatched passwords', () => {
      const data = {
        email: 'user@example.com',
        password: 'SecurePass123!',
        confirmPassword: 'DifferentPass123!',
        name: 'John Doe',
        dateOfBirth: '2010-01-15',
        agreeToTerms: true,
      }
      const result = registerSchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('should require terms agreement', () => {
      const data = {
        email: 'user@example.com',
        password: 'SecurePass123!',
        confirmPassword: 'SecurePass123!',
        name: 'John Doe',
        dateOfBirth: '2010-01-15',
        agreeToTerms: false,
      }
      const result = registerSchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('should reject invalid date of birth', () => {
      const data = {
        email: 'user@example.com',
        password: 'SecurePass123!',
        confirmPassword: 'SecurePass123!',
        name: 'John Doe',
        dateOfBirth: 'not-a-date',
        agreeToTerms: true,
      }
      const result = registerSchema.safeParse(data)
      expect(result.success).toBe(false)
    })
  })

  describe('createPostSchema', () => {
    it('should validate post with text content', () => {
      const data = {
        content: 'This is a great post about my journey in YSMP!',
        images: [],
        tags: ['YSMP', 'journey'],
        visibility: 'public',
      }
      const result = createPostSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should validate post with images', () => {
      const data = {
        content: 'Check out these photos!',
        images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
        tags: ['photos'],
        visibility: 'members_only',
      }
      const result = createPostSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should reject empty content', () => {
      const data = {
        content: '',
        images: [],
        tags: [],
        visibility: 'public',
      }
      const result = createPostSchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('should reject content exceeding max length', () => {
      const data = {
        content: 'a'.repeat(5001),
        images: [],
        tags: [],
        visibility: 'public',
      }
      const result = createPostSchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('should enforce max 10 tags', () => {
      const data = {
        content: 'Valid content',
        images: [],
        tags: Array(11).fill('tag'),
        visibility: 'public',
      }
      const result = createPostSchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('should accept valid visibility values', () => {
      const publicPost = createPostSchema.safeParse({
        content: 'Public post',
        images: [],
        tags: [],
        visibility: 'public',
      })
      const membersPost = createPostSchema.safeParse({
        content: 'Members only',
        images: [],
        tags: [],
        visibility: 'members_only',
      })
      expect(publicPost.success).toBe(true)
      expect(membersPost.success).toBe(true)
    })
  })

  describe('createCommentSchema', () => {
    it('should validate simple comment', () => {
      const data = {
        content: 'Great post!',
      }
      const result = createCommentSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should reject empty comment', () => {
      const data = {
        content: '',
      }
      const result = createCommentSchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('should reject comment exceeding max length', () => {
      const data = {
        content: 'a'.repeat(5001),
      }
      const result = createCommentSchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('should trim whitespace', () => {
      const data = {
        content: '   Great post!   ',
      }
      const result = createCommentSchema.safeParse(data)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.content).toBe('Great post!')
      }
    })
  })

  describe('createStorySchema', () => {
    it('should validate story with valid frames', () => {
      const data = {
        title: 'My Journey',
        description: 'A story about my transformation',
        frames: [
          {
            imageUrl: 'https://example.com/frame1.jpg',
            caption: 'Day 1',
            duration: 3,
          },
          {
            imageUrl: 'https://example.com/frame2.jpg',
            caption: 'Day 50',
            duration: 5,
          },
        ],
        tags: ['journey', 'transformation'],
        visibility: 'public',
      }
      const result = createStorySchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should reject story with no frames', () => {
      const data = {
        title: 'My Journey',
        description: 'A story about my transformation',
        frames: [],
        tags: ['journey'],
        visibility: 'public',
      }
      const result = createStorySchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('should reject frame with invalid duration', () => {
      const data = {
        title: 'My Journey',
        description: 'A story',
        frames: [
          {
            imageUrl: 'https://example.com/frame1.jpg',
            caption: 'Frame 1',
            duration: 15, // Max is 10
          },
        ],
        tags: [],
        visibility: 'public',
      }
      const result = createStorySchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('should enforce max 50 frames', () => {
      const frames = Array(51)
        .fill(null)
        .map((_, i) => ({
          imageUrl: `https://example.com/frame${i}.jpg`,
          caption: `Frame ${i}`,
          duration: 3,
        }))

      const data = {
        title: 'Long Story',
        description: 'Too many frames',
        frames,
        tags: [],
        visibility: 'public',
      }
      const result = createStorySchema.safeParse(data)
      expect(result.success).toBe(false)
    })
  })

  describe('reportContentSchema', () => {
    it('should validate content report', () => {
      const data = {
        contentType: 'post',
        contentId: '123',
        reason: 'inappropriate',
        description: 'This content violates community guidelines',
      }
      const result = reportContentSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should accept different content types', () => {
      const types = ['post', 'comment', 'photo']
      types.forEach((type) => {
        const data = {
          contentType: type,
          contentId: '123',
          reason: 'spam',
          description: 'Spam content',
        }
        const result = reportContentSchema.safeParse(data)
        expect(result.success).toBe(true)
      })
    })

    it('should accept different report reasons', () => {
      const reasons = [
        'inappropriate',
        'harmful',
        'copyright',
        'spam',
        'abuse',
        'other',
      ]
      reasons.forEach((reason) => {
        const data = {
          contentType: 'post',
          contentId: '123',
          reason,
          description: 'Report reason',
        }
        const result = reportContentSchema.safeParse(data)
        expect(result.success).toBe(true)
      })
    })

    it('should require contentType', () => {
      const data = {
        contentId: '123',
        reason: 'spam',
        description: 'Spam content',
      }
      const result = reportContentSchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('should require contentId', () => {
      const data = {
        contentType: 'post',
        reason: 'spam',
        description: 'Spam content',
      }
      const result = reportContentSchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('should require reason', () => {
      const data = {
        contentType: 'post',
        contentId: '123',
        description: 'Spam content',
      }
      const result = reportContentSchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('should allow optional description', () => {
      const data = {
        contentType: 'post',
        contentId: '123',
        reason: 'spam',
      }
      const result = reportContentSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should reject description exceeding max length', () => {
      const data = {
        contentType: 'post',
        contentId: '123',
        reason: 'spam',
        description: 'a'.repeat(501),
      }
      const result = reportContentSchema.safeParse(data)
      expect(result.success).toBe(false)
    })
  })
})
