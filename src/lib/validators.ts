import { z } from 'zod'

// ─── Authentication Validators ──────────────────────────────────────────────
export const signupSchema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .toLowerCase(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  dateOfBirth: z.coerce.date(),
  ageGroup: z.enum(['<13', '13-17', '18-25', '26+']).optional(),
  confirmPassword: z.string().optional(),
  agreeToTerms: z.literal(true, {
    message: 'You must agree to the terms',
  }),
}).superRefine((data, ctx) => {
  if (data.confirmPassword && data.password !== data.confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Passwords must match',
      path: ['confirmPassword'],
    })
  }
})

export const signinSchema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .toLowerCase(),
  password: z.string().min(1, 'Password is required'),
})

export const ageVerificationSchema = z.object({
  ageGroup: z.enum(['13-17', '18-25', '26+', '<13']),
  confirmAge: z.literal(true, {
    message: 'You must confirm your age',
  }),
})

export const parentalConsentSchema = z.object({
  parentEmail: z.string().email('Invalid parent/guardian email'),
  childName: z.string().min(2, 'Child name is required'),
})

// ─── Gallery Validators ────────────────────────────────────────────────────
export const uploadPhotoSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must be less than 200 characters'),
  description: z
    .string()
    .max(2000, 'Description must be less than 2000 characters')
    .optional(),
  imageAlt: z
    .string()
    .min(10, 'Alt text must be at least 10 characters (for accessibility)')
    .max(500, 'Alt text must be less than 500 characters'),
  tags: z
    .array(z.string())
    .max(10, 'You can add up to 10 tags'),
  program: z.enum(['YSMP', 'Thrive Tribe', 'Healing Centre']).optional(),
  event: z.string().optional(),
  permissions: z.enum(['public', 'members_only', 'verified_members_only']),
  hasCopyright: z.literal(true, {
    message: 'You must confirm copyright ownership',
  }),
})

// ─── Community Validators ──────────────────────────────────────────────────
export const createPostSchema = z.object({
  content: z
    .string()
    .min(1, 'Post content is required')
    .max(5000, 'Post must be less than 5000 characters'),
  images: z
    .array(
      z.string().refine(
        (value) =>
          value.startsWith('data:image/') ||
          value.startsWith('http://') ||
          value.startsWith('https://'),
        'Image must be a valid data URL or http(s) URL'
      )
    )
    .max(4, 'You can add up to 4 images')
    .default([]),
  tags: z
    .array(z.string())
    .max(10, 'You can add up to 10 tags'),
  program: z.enum(['YSMP', 'Thrive Tribe', 'Healing Centre']).optional(),
  visibility: z.enum(['public', 'members_only']),
})

export const createCommentSchema = z.object({
  content: z
    .string()
    .transform((value) => value.trim())
    .pipe(
      z
    .string()
    .min(1, 'Comment cannot be empty')
    .max(2000, 'Comment must be less than 2000 characters')
    ),
})

export const updateProfileSchema = z.object({
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  program: z.enum(['YSMP', 'Thrive Tribe', 'Healing Centre']).optional(),
  privacyLevel: z.enum(['public', 'members_only', 'private']),
})

// ─── Moderation Validators ─────────────────────────────────────────────────
export const reportContentSchema = z.object({
  contentType: z.enum(['photo', 'post', 'comment']),
  contentId: z.string().min(1, 'Invalid content ID'),
  reason: z.enum([
    'inappropriate',
    'harmful',
    'copyright',
    'spam',
    'abuse',
    'other',
  ]),
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
})

// ─── Story Validators (Sprint 6) ────────────────────────────────────────────
export const storyFrameSchema = z.object({
  imageUrl: z.string().url('Invalid image URL'),
  caption: z.string().max(100, 'Caption must be less than 100 characters').optional(),
  duration: z.number().min(1, 'Duration must be at least 1 second').max(10, 'Duration cannot exceed 10 seconds'),
})

export const createStorySchema = z.object({
  title: z.string().min(1).max(120).optional(),
  description: z.string().min(1).max(500).optional(),
  content: z
    .string()
    .min(1, 'Story description is required')
    .max(500, 'Description must be less than 500 characters')
    .optional(),
  program: z.enum(['YSMP', 'Thrive Tribe', 'Healing Centre']).optional(),
  tags: z
    .array(z.string())
    .max(10, 'You can add up to 10 tags'),
  visibility: z.enum(['public', 'members_only']).default('public'),
  storyFrames: z
    .array(storyFrameSchema)
    .min(1, 'Story must have at least one frame')
    .max(50, 'Story cannot have more than 50 frames')
    .optional(),
  frames: z
    .array(storyFrameSchema)
    .min(1, 'Story must have at least one frame')
    .max(50, 'Story cannot have more than 50 frames')
    .optional(),
}).superRefine((data, ctx) => {
  const hasText = Boolean(data.content || data.description)
  const hasFrames = Boolean(data.storyFrames?.length || data.frames?.length)

  if (!hasText) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Story description is required',
      path: ['content'],
    })
  }
  if (!hasFrames) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Story must have at least one frame',
      path: ['storyFrames'],
    })
  }
})

// Backward-compatible aliases for test and older call sites.
export const registerSchema = signupSchema
export const loginSchema = signinSchema

// ─── Type Exports ──────────────────────────────────────────────────────────
export type SignupInput = z.infer<typeof signupSchema>
export type SigninInput = z.infer<typeof signinSchema>
export type AgeVerificationInput = z.infer<typeof ageVerificationSchema>
export type ParentalConsentInput = z.infer<typeof parentalConsentSchema>
export type UploadPhotoInput = z.infer<typeof uploadPhotoSchema>
export type CreatePostInput = z.infer<typeof createPostSchema>
export type CreateCommentInput = z.infer<typeof createCommentSchema>
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
export type ReportContentInput = z.infer<typeof reportContentSchema>
export type StoryFrameInput = z.infer<typeof storyFrameSchema>
export type CreateStoryInput = z.infer<typeof createStorySchema>
