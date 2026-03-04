'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { uploadPhotoSchema, type UploadPhotoInput } from '@/lib/validators'
import { Upload, ChevronRight, ChevronLeft, CheckCircle, AlertCircle, X } from 'lucide-react'

interface PhotoUploadFormProps {
  onSuccess?: (photoId: string) => void
}

export function PhotoUploadForm({ onSuccess }: PhotoUploadFormProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const [currentStep, setCurrentStep] = useState(1)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null
    message: string
  }>({ type: null, message: '' })

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<UploadPhotoInput>({
    resolver: zodResolver(uploadPhotoSchema),
    mode: 'onChange',
  })

  const [title, description, imageAlt, tags, program, permissions] = watch([
    'title',
    'description',
    'imageAlt',
    'tags',
    'program',
    'permissions',
  ])

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setSubmitStatus({
        type: 'error',
        message: 'Please select an image file',
      })
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setSubmitStatus({
        type: 'error',
        message: 'File must be less than 10MB',
      })
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string)
      setImageFile(file)
      setSubmitStatus({ type: null, message: '' })
    }
    reader.readAsDataURL(file)
  }

  const handleDragDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) {
      const input = document.createElement('input')
      input.type = 'file'
      const dataTransfer = new DataTransfer()
      dataTransfer.items.add(file)
      input.files = dataTransfer.files
      handleImageSelect({ target: input } as React.ChangeEvent<HTMLInputElement>)
    }
  }

  const onSubmit = async (data: UploadPhotoInput) => {
    if (!imageFile || !imagePreview) {
      setSubmitStatus({
        type: 'error',
        message: 'Please select an image first',
      })
      return
    }

    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: '' })

    try {
      // For now, submit just metadata (image would go to Cloudinary)
      const response = await fetch('/api/gallery/photos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.user?.id ? { 'x-user-id': session.user.id } : {}),
        },
        body: JSON.stringify({
          ...data,
          imageUrl: imagePreview, // This would be Cloudinary URL in production
        }),
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const result = await response.json()
      setSubmitStatus({
        type: 'success',
        message: 'Photo uploaded successfully!',
      })

      // Reset form
      setImagePreview(null)
      setImageFile(null)
      setCurrentStep(1)

      if (onSuccess) {
        onSuccess(result.photo.id)
      } else {
        router.push(`/gallery/${result.photo.id}`)
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Upload failed',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const steps = [
    { number: 1, title: 'Upload Photo' },
    { number: 2, title: 'Details' },
    { number: 3, title: 'Tags & Program' },
    { number: 4, title: 'Permissions' },
    { number: 5, title: 'Confirm' },
  ]

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

      {/* Step Indicator */}
      <div className="flex justify-between mb-8">
        {steps.map((step) => (
          <div key={step.number} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                currentStep >= step.number
                  ? 'text-white'
                  : 'text-gray-500'
              }`}
              style={{
                backgroundColor:
                  currentStep >= step.number
                    ? 'var(--color-ochre-400)'
                    : 'rgba(210, 168, 85, 0.2)',
              }}
            >
              {step.number}
            </div>
            {step.number < steps.length && (
              <div
                className="flex-1 h-1 mx-2"
                style={{
                  backgroundColor:
                    currentStep > step.number
                      ? 'var(--color-ochre-400)'
                      : 'rgba(210, 168, 85, 0.2)',
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      {currentStep === 1 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Upload Your Photo</h2>
          <div
            className="border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all hover:border-opacity-100"
            style={{
              borderColor: imagePreview ? 'var(--color-sage-500)' : 'rgba(210, 168, 85, 0.5)',
              backgroundColor: imagePreview ? 'rgba(157, 193, 131, 0.05)' : 'rgba(210, 168, 85, 0.02)',
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDragDrop}
            onClick={() => document.getElementById('image-input')?.click()}
          >
            {imagePreview ? (
              <div className="space-y-4">
                <img src={imagePreview} alt="Preview" className="max-h-64 mx-auto rounded-lg" />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setImagePreview(null)
                    setImageFile(null)
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium"
                  style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    color: '#ef4444',
                  }}
                >
                  <X size={16} />
                  Remove
                </button>
              </div>
            ) : (
              <>
                <Upload size={48} className="mx-auto mb-4" style={{ color: 'var(--color-ochre-400)' }} />
                <p className="text-lg font-semibold mb-2">Drag & drop your photo here</p>
                <p className="text-gray-600 text-sm">or click to browse (JPG, PNG, GIF, max 10MB)</p>
              </>
            )}
          </div>
          <input
            id="image-input"
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />
        </div>
      )}

      {currentStep === 2 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Photo Details</h2>

          {/* Title */}
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-semibold uppercase tracking-widest">
              Title *
            </label>
            <input
              id="title"
              {...register('title')}
              placeholder="Give your photo a title..."
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2"
            />
            {errors.title && <p className="text-red-600 text-sm">{errors.title.message}</p>}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-semibold uppercase tracking-widest">
              Description (optional)
            </label>
            <textarea
              id="description"
              {...register('description')}
              placeholder="Tell the story behind this photo..."
              rows={4}
              maxLength={2000}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 resize-none"
            />
            {errors.description && <p className="text-red-600 text-sm">{errors.description.message}</p>}
          </div>

          {/* Alt Text */}
          <div className="space-y-2">
            <label htmlFor="imageAlt" className="block text-sm font-semibold uppercase tracking-widest">
              Alt Text (for accessibility) *
            </label>
            <input
              id="imageAlt"
              {...register('imageAlt')}
              placeholder="Describe what's in this photo for visually impaired users..."
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2"
            />
            {errors.imageAlt && <p className="text-red-600 text-sm">{errors.imageAlt.message}</p>}
            <p className="text-xs text-gray-600">
              Help describe the image so everyone can understand it
            </p>
          </div>
        </div>
      )}

      {currentStep === 3 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Tags & Program</h2>

          {/* Tags */}
          <div className="space-y-2">
            <label htmlFor="tags" className="block text-sm font-semibold uppercase tracking-widest">
              Tags (optional)
            </label>
            <input
              id="tags"
              placeholder="E.g. celebration, nature, portrait (comma separated, max 10)"
              defaultValue={tags?.join(',')}
              onChange={(e) => {
                const tagArray = e.target.value
                  .split(',')
                  .map(t => t.trim())
                  .filter(t => t)
                  .slice(0, 10)
                setValue('tags', tagArray)
              }}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2"
            />
          </div>

          {/* Program */}
          <div className="space-y-2">
            <label htmlFor="program" className="block text-sm font-semibold uppercase tracking-widest">
              Program (optional)
            </label>
            <select
              id="program"
              {...register('program')}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2"
            >
              <option value="">Select a program</option>
              <option value="YSMP">Young Spirit Mentoring Program</option>
              <option value="Thrive Tribe">Thrive Tribe</option>
              <option value="Healing Centre">Healing Centre</option>
            </select>
          </div>

          {/* Event */}
          <div className="space-y-2">
            <label htmlFor="event" className="block text-sm font-semibold uppercase tracking-widest">
              Event (optional)
            </label>
            <input
              id="event"
              {...register('event')}
              placeholder="E.g. YSMP Open Day 2026"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2"
            />
          </div>
        </div>
      )}

      {currentStep === 4 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Photo Permissions</h2>

          <div className="space-y-3">
            {[
              {
                value: 'public',
                label: 'Public',
                description: 'Everyone can see this photo',
              },
              {
                value: 'members_only',
                label: 'Members Only',
                description: 'Only Mudyin members can see this photo',
              },
              {
                value: 'verified_members_only',
                label: 'Verified Members Only',
                description: 'Only verified members can see this photo',
              },
            ].map((option) => (
              <label
                key={option.value}
                className="flex items-start gap-3 p-3 rounded-lg border border-gray-300 cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <input
                  type="radio"
                  {...register('permissions')}
                  value={option.value}
                  defaultChecked={permissions === option.value}
                  className="mt-1"
                />
                <div>
                  <p className="font-medium">{option.label}</p>
                  <p className="text-sm text-gray-600">{option.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {currentStep === 5 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Review & Confirm</h2>

          <div
            className="p-6 rounded-lg space-y-4"
            style={{ backgroundColor: 'rgba(210, 168, 85, 0.05)' }}
          >
            {imagePreview && (
              <img src={imagePreview} alt="Upload preview" className="max-h-48 mx-auto rounded-lg" />
            )}

            <div className="space-y-2 text-sm">
              <p><strong>Title:</strong> {title}</p>
              {description && <p><strong>Description:</strong> {description}</p>}
              <p><strong>Alt Text:</strong> {imageAlt}</p>
              {tags && tags.length > 0 && <p><strong>Tags:</strong> {tags.join(', ')}</p>}
              {program && <p><strong>Program:</strong> {program}</p>}
              <p><strong>Privacy:</strong> {permissions === 'public' ? 'Public' : permissions === 'members_only' ? 'Members Only' : 'Verified Members Only'}</p>
            </div>

            <label className="flex items-start gap-3 p-3 rounded-lg border border-gray-300">
              <input
                type="checkbox"
                {...register('hasCopyright')}
                className="mt-1"
              />
              <div>
                <p className="font-medium text-sm">I own or have permission to share this photo</p>
                <p className="text-xs text-gray-600">
                  By uploading, you confirm this photo respects copyright and ICIP protocols
                </p>
              </div>
            </label>
            {errors.hasCopyright && <p className="text-red-600 text-sm">{errors.hasCopyright.message}</p>}
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between gap-4 pt-8">
        <button
          type="button"
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
          className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: 'rgba(210, 168, 85, 0.1)',
            color: 'var(--color-ochre-400)',
            border: '1px solid var(--color-ochre-400)',
          }}
        >
          <ChevronLeft size={16} />
          Back
        </button>

        {currentStep < 5 ? (
          <button
            type="button"
            onClick={() => setCurrentStep(currentStep + 1)}
            className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'var(--color-ochre-400)' }}
          >
            Next
            <ChevronRight size={16} />
          </button>
        ) : (
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: 'var(--color-ochre-400)' }}
          >
            {isSubmitting ? 'Uploading...' : 'Upload Photo'}
          </button>
        )}
      </div>
    </form>
  )
}
