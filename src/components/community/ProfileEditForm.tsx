'use client'

import { useState } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { updateProfileSchema, type UpdateProfileInput } from '@/lib/validators'
import { AvatarUpload } from './AvatarUpload'
import { CheckCircle, AlertCircle } from 'lucide-react'

interface ProfileEditFormProps {
  initialData?: {
    bio?: string
    program?: string
    privacyLevel?: string
    avatar?: string
  }
  userName?: string
  onSuccess?: (data: Record<string, unknown>) => void
}

export function ProfileEditForm({
  initialData,
  userName = 'User',
  onSuccess,
}: ProfileEditFormProps) {
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null
    message: string
  }>({ type: null, message: '' })

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      bio: initialData?.bio || '',
      program: (initialData?.program as UpdateProfileInput['program']) ?? undefined,
      privacyLevel: (initialData?.privacyLevel as UpdateProfileInput['privacyLevel']) ?? 'public',
    },
  })

  const bioValue = watch('bio')
  const charCount = bioValue?.length || 0

  const onSubmit: SubmitHandler<UpdateProfileInput> = async (data) => {
    try {
      setSubmitStatus({ type: null, message: '' })

      const response = await fetch('/api/community/profiles', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      const result = await response.json()
      setSubmitStatus({
        type: 'success',
        message: 'Profile updated successfully!',
      })

      if (onSuccess) {
        onSuccess(result.profile)
      }

      // Reset form to new values
      reset(data)
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to update profile',
      })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Status Messages */}
      {submitStatus.type && (
        <div
          className="p-4 rounded-lg flex items-start gap-3"
          style={{
            backgroundColor:
              submitStatus.type === 'success'
                ? 'rgba(157, 193, 131, 0.1)'
                : 'rgba(239, 68, 68, 0.1)',
            borderLeft: `4px solid ${
              submitStatus.type === 'success'
                ? 'var(--color-sage-500)'
                : '#ef4444'
            }`,
          }}
        >
          {submitStatus.type === 'success' ? (
            <CheckCircle size={20} style={{ color: 'var(--color-sage-500)' }} />
          ) : (
            <AlertCircle size={20} style={{ color: '#ef4444' }} />
          )}
          <p className="text-sm">{submitStatus.message}</p>
        </div>
      )}

      {/* Avatar Upload */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold uppercase tracking-widest">
          Profile Picture
        </label>
        <AvatarUpload
          currentAvatar={initialData?.avatar}
          userName={userName}
          onUploadSuccess={(_url) => {
            // Avatar is updated immediately on upload
          }}
        />
      </div>

      {/* Bio */}
      <div className="space-y-2">
        <label
          htmlFor="bio"
          className="block text-sm font-semibold uppercase tracking-widest"
        >
          About You
        </label>
        <textarea
          id="bio"
          {...register('bio')}
          placeholder="Tell the community about yourself... (max 500 characters)"
          rows={4}
          maxLength={500}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-ochre-400 resize-none"
          style={{
            backgroundColor: 'white',
          }}
        />
        <div className="flex justify-between text-xs text-gray-600">
          <div>
            {errors.bio && (
              <p className="text-red-600">{errors.bio.message}</p>
            )}
          </div>
          <span>
            {charCount}/500
          </span>
        </div>
      </div>

      {/* Program */}
      <div className="space-y-2">
        <label
          htmlFor="program"
          className="block text-sm font-semibold uppercase tracking-widest"
        >
          Primary Program
        </label>
        <select
          id="program"
          {...register('program')}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2"
          style={{
            backgroundColor: 'white',
          }}
        >
          <option value="">Select a program (optional)</option>
          <option value="YSMP">Young Spirit Mentoring Program</option>
          <option value="Thrive Tribe">Thrive Tribe</option>
          <option value="Healing Centre">Healing Centre</option>
        </select>
        {errors.program && (
          <p className="text-red-600 text-sm">{errors.program.message}</p>
        )}
      </div>

      {/* Privacy Level */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold uppercase tracking-widest">
          Profile Privacy
        </label>
        <div className="space-y-2">
          {[
            {
              value: 'public',
              label: 'Public',
              description: 'Everyone can see your profile',
            },
            {
              value: 'members_only',
              label: 'Members Only',
              description: 'Only Mudyin members can see your profile',
            },
            {
              value: 'private',
              label: 'Private',
              description: 'Only you can see your profile',
            },
          ].map((option) => (
            <label
              key={option.value}
              className="flex items-start gap-3 p-3 rounded-lg border border-gray-300 cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <input
                type="radio"
                {...register('privacyLevel')}
                value={option.value}
                className="mt-1"
              />
              <div>
                <p className="font-medium">{option.label}</p>
                <p className="text-sm text-gray-600">{option.description}</p>
              </div>
            </label>
          ))}
        </div>
        {errors.privacyLevel && (
          <p className="text-red-600 text-sm">
            {errors.privacyLevel.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-6 py-3 rounded-lg font-semibold text-white transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ backgroundColor: 'var(--color-ochre-400)' }}
      >
        {isSubmitting ? 'Saving...' : 'Save Profile'}
      </button>
    </form>
  )
}
