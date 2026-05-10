'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createPostSchema } from '@/lib/validators'
import { CheckCircle, AlertCircle, X, ImagePlus, UploadCloud } from 'lucide-react'

interface CreatePostFormProps {
  userId: string
}

type CreatePostFormValues = z.input<typeof createPostSchema>

const MAX_FILES = 4
const MAX_FILE_SIZE_MB = 5
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('Failed to read image file'))
    reader.readAsDataURL(file)
  })
}

export function CreatePostForm({ userId }: CreatePostFormProps) {
  const router = useRouter()
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null
    message: string
  }>({ type: null, message: '' })
  const [currentStep, setCurrentStep] = useState<'content' | 'media' | 'settings'>('content')
  const [tagInput, setTagInput] = useState('')
  const [isProcessingImages, setIsProcessingImages] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [isDragActive, setIsDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<CreatePostFormValues>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      content: '',
      images: [],
      tags: [],
      program: undefined,
      visibility: 'public',
    },
  })

  const content = watch('content')
  const tags = watch('tags') || []
  const images = watch('images') || []
  const contentLength = content?.length || 0

  const handleAddTag = () => {
    const trimmed = tagInput.trim().replace(/^#/, '')
    if (trimmed && !tags.includes(trimmed) && tags.length < 10) {
      setValue('tags', [...tags, trimmed], { shouldValidate: true })
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setValue('tags', tags.filter((t) => t !== tagToRemove), { shouldValidate: true })
  }

  const handleRemoveImage = (indexToRemove: number) => {
    setValue(
      'images',
      images.filter((_, index) => index !== indexToRemove),
      { shouldValidate: true }
    )
  }

  const processFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return

    const incomingFiles = Array.from(fileList)
    const slotsLeft = MAX_FILES - images.length

    if (slotsLeft <= 0) {
      setUploadError(`You can upload up to ${MAX_FILES} images per post.`)
      return
    }

    const filesToProcess = incomingFiles.slice(0, slotsLeft)
    setUploadError(null)
    setIsProcessingImages(true)

    try {
      const validated = filesToProcess.filter((file) => {
        if (!ACCEPTED_TYPES.includes(file.type)) {
          setUploadError('Only JPG, PNG, WEBP, and GIF files are supported.')
          return false
        }
        if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
          setUploadError(`Each image must be ${MAX_FILE_SIZE_MB}MB or smaller.`)
          return false
        }
        return true
      })

      const imageData = await Promise.all(validated.map(fileToDataUrl))
      setValue('images', [...images, ...imageData], { shouldValidate: true })
    } catch {
      setUploadError('Could not process one or more images. Please try again.')
    } finally {
      setIsProcessingImages(false)
    }
  }

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }

  const onDrop = async (event: React.DragEvent<HTMLButtonElement>) => {
    event.preventDefault()
    setIsDragActive(false)
    await processFiles(event.dataTransfer.files)
  }

  const onSubmit: SubmitHandler<CreatePostFormValues> = async (data) => {
    try {
      setSubmitStatus({ type: null, message: '' })

      const response = await fetch('/api/community/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errData = await response.json()
        throw new Error(errData.error || 'Failed to create post')
      }

      const result = await response.json()

      setSubmitStatus({
        type: 'success',
        message: 'Post published successfully! Redirecting...',
      })

      setTimeout(() => {
        router.push(`/community/posts/${result.post.id}`)
      }, 1200)
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to create post',
      })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {submitStatus.type && (
        <div
          className="p-4 rounded-lg flex items-center gap-3"
          style={{
            backgroundColor:
              submitStatus.type === 'success'
                ? 'rgba(157, 193, 131, 0.2)'
                : 'rgba(220, 38, 38, 0.2)',
            color:
              submitStatus.type === 'success'
                ? 'var(--color-sage-500)'
                : '#ff6b6b',
          }}
        >
          {submitStatus.type === 'success' ? (
            <CheckCircle size={20} />
          ) : (
            <AlertCircle size={20} />
          )}
          <span className="text-sm">{submitStatus.message}</span>
        </div>
      )}

      <div className="flex gap-2">
        {(['content', 'media', 'settings'] as const).map((step) => (
          <button
            key={step}
            type="button"
            onClick={() => setCurrentStep(step)}
            className="flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all capitalize"
            style={{
              backgroundColor:
                currentStep === step
                  ? 'var(--color-ochre-400)'
                  : 'rgba(255, 255, 255, 0.05)',
              color:
                currentStep === step
                  ? 'var(--color-charcoal-950)'
                  : 'rgba(255, 255, 255, 0.6)',
            }}
          >
            {step}
          </button>
        ))}
      </div>

      {currentStep === 'content' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-200">
              What&apos;s on your mind?
            </label>
            <textarea
              {...register('content')}
              placeholder="Share your thoughts, stories, or experiences..."
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-ochre-400 focus:ring-1 focus:ring-ochre-400 resize-none"
              rows={6}
            />
            <div className="flex justify-between items-center mt-1">
              <p className="text-xs text-gray-500">
                {contentLength} / 5000 characters
              </p>
              {errors.content && (
                <p className="text-xs text-red-400">{errors.content.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/5 transition-colors text-gray-300"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep('media')}
              className="px-4 py-2 rounded-lg transition-all font-medium"
              style={{ backgroundColor: 'var(--color-ochre-400)', color: 'var(--color-charcoal-950)' }}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {currentStep === 'media' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-200">
              Add Images (Optional)
            </label>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              multiple
              className="hidden"
              onChange={(event) => {
                processFiles(event.target.files)
                event.currentTarget.value = ''
              }}
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full rounded-2xl p-8 border-2 border-dashed transition-colors text-left"
              style={{
                borderColor: isDragActive
                  ? 'rgba(223, 206, 214, 0.68)'
                  : 'rgba(210, 168, 85, 0.35)',
                backgroundColor: 'rgba(20, 20, 20, 0.55)',
                boxShadow: isDragActive ? '0 0 0 1px rgba(2,2,2,0.68), 0 0 14px rgba(2,2,2,0.45)' : undefined,
              }}
              onDragOver={(event) => {
                event.preventDefault()
                setIsDragActive(true)
              }}
              onDragLeave={() => setIsDragActive(false)}
              onDrop={onDrop}
            >
              <div className="flex items-center gap-3 mb-2">
                <UploadCloud size={20} style={{ color: 'var(--color-ochre-400)' }} />
                <p className="text-sm font-medium text-white">
                  Upload up to {MAX_FILES} images
                </p>
              </div>
              <p className="text-xs text-gray-400">
                Drag and drop, or click to select. JPG, PNG, WEBP, GIF up to {MAX_FILE_SIZE_MB}MB each.
              </p>
            </button>
          </div>

          {isProcessingImages && (
            <p className="text-xs" style={{ color: 'var(--color-ochre-400)' }}>
              Processing images...
            </p>
          )}

          {uploadError && (
            <p className="text-xs text-red-400">{uploadError}</p>
          )}

          {images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {images.map((image, index) => (
                <div key={index} className="relative rounded-xl overflow-hidden border border-white/10">
                  <Image
                    src={image}
                    alt={`Selected upload ${index + 1}`}
                    width={240}
                    height={112}
                    className="w-full h-28 object-cover"
                    unoptimized
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', color: 'white' }}
                    aria-label={`Remove image ${index + 1}`}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div
            className="rounded-xl p-3 flex items-center gap-2 text-xs"
            style={{
              backgroundColor: 'rgba(157,193,131,0.08)',
              border: '1px solid rgba(157,193,131,0.2)',
              color: 'rgba(255,255,255,0.75)',
            }}
          >
            <ImagePlus size={14} style={{ color: 'var(--color-sage-500)' }} />
            {images.length === 0
              ? 'No images selected yet.'
              : `${images.length} of ${MAX_FILES} images selected.`}
          </div>

          {errors.images && (
            <p className="text-xs text-red-400">{errors.images.message}</p>
          )}

          <div className="flex justify-between gap-3">
            <button
              type="button"
              onClick={() => setCurrentStep('content')}
              className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/5 transition-colors text-gray-300"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep('settings')}
              className="px-4 py-2 rounded-lg transition-all font-medium"
              style={{ backgroundColor: 'var(--color-ochre-400)', color: 'var(--color-charcoal-950)' }}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {currentStep === 'settings' && (
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-200">
              Program (Optional)
            </label>
            <select
              {...register('program')}
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-ochre-400"
            >
              <option value="">No program</option>
              <option value="YSMP">YSMP</option>
              <option value="Thrive Tribe">Thrive Tribe</option>
              <option value="Healing Centre">Healing Centre</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-200">
              Tags ({tags.length}/10)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="Type a tag and press Enter..."
                className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-ochre-400"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3 py-2 rounded-lg text-sm font-medium"
                style={{ backgroundColor: 'rgba(210, 168, 85, 0.2)', color: 'var(--color-ochre-400)' }}
              >
                Add
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm"
                    style={{ backgroundColor: 'rgba(210, 168, 85, 0.2)', color: 'var(--color-ochre-400)' }}
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:opacity-70 ml-1"
                      aria-label={`Remove tag ${tag}`}
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            )}
            {errors.tags && (
              <p className="text-xs text-red-400 mt-1">{errors.tags.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-200">
              Who can see this post?
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
                <input
                  type="radio"
                  {...register('visibility')}
                  value="public"
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-200">Everyone</span>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
                <input
                  type="radio"
                  {...register('visibility')}
                  value="members_only"
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-200">Members only</span>
              </label>
            </div>
            {errors.visibility && (
              <p className="text-xs text-red-400 mt-1">{errors.visibility.message}</p>
            )}
          </div>

          <div className="flex justify-between gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => setCurrentStep('media')}
              className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/5 transition-colors text-gray-300"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isProcessingImages}
              className="px-6 py-2 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: 'var(--color-ochre-400)', color: 'var(--color-charcoal-950)' }}
            >
              {isSubmitting ? 'Publishing...' : 'Publish Post'}
            </button>
          </div>
        </div>
      )}
    </form>
  )
}
