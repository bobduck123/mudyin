'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { uploadPhotoSchema, type UploadPhotoInput } from '@/lib/validators'
import { Upload, ChevronRight, ChevronLeft, CheckCircle, AlertCircle, X, Sparkles } from 'lucide-react'

interface PhotoUploadFormProps {
  onSuccess?: (photoId: string) => void
}

const MAX_FILES = 10
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024

function toDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export function PhotoUploadForm({ onSuccess }: PhotoUploadFormProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [tagsInput, setTagsInput] = useState('')
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
    trigger,
  } = useForm<UploadPhotoInput>({
    resolver: zodResolver(uploadPhotoSchema),
    mode: 'onChange',
    defaultValues: {
      tags: [],
      permissions: 'public',
    },
  })

  const [title, description, imageAlt, tags, program, permissions] = watch([
    'title',
    'description',
    'imageAlt',
    'tags',
    'program',
    'permissions',
  ])

  const steps = useMemo(() => [
    { number: 1, title: 'Upload' },
    { number: 2, title: 'Details' },
    { number: 3, title: 'Tags' },
    { number: 4, title: 'Permissions' },
    { number: 5, title: 'Confirm' },
  ], [])

  const loadFiles = async (incomingFiles: File[]) => {
    if (!incomingFiles.length) return

    const availableSlots = MAX_FILES - imageFiles.length
    const candidate = incomingFiles.slice(0, Math.max(availableSlots, 0))

    if (availableSlots <= 0) {
      setSubmitStatus({
        type: 'error',
        message: `Maximum ${MAX_FILES} photos per upload.`,
      })
      return
    }

    const valid: File[] = []
    for (const file of candidate) {
      if (!file.type.startsWith('image/')) {
        setSubmitStatus({ type: 'error', message: 'Only image files are allowed.' })
        continue
      }
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setSubmitStatus({
          type: 'error',
          message: 'Each image must be 5 MB or smaller.',
        })
        continue
      }
      valid.push(file)
    }

    if (!valid.length) return

    const nextFiles = [...imageFiles, ...valid].slice(0, MAX_FILES)
    const previews = await Promise.all(nextFiles.map((file) => toDataUrl(file)))
    setImageFiles(nextFiles)
    setImagePreviews(previews)
    setSubmitStatus({ type: null, message: '' })
  }

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const incoming = Array.from(e.target.files || [])
    await loadFiles(incoming)
    e.target.value = ''
  }

  const handleDragDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const incoming = Array.from(e.dataTransfer.files || [])
    await loadFiles(incoming)
  }

  const removeImage = (index: number) => {
    const nextFiles = imageFiles.filter((_, i) => i !== index)
    const nextPreviews = imagePreviews.filter((_, i) => i !== index)
    setImageFiles(nextFiles)
    setImagePreviews(nextPreviews)
  }

  const onNext = async () => {
    if (currentStep === 1 && imageFiles.length === 0) {
      setSubmitStatus({ type: 'error', message: 'Add at least one image to continue.' })
      return
    }

    if (currentStep === 2) {
      const ok = await trigger(['title', 'imageAlt'])
      if (!ok) return
    }

    if (currentStep === 4) {
      const ok = await trigger(['permissions'])
      if (!ok) return
    }

    setSubmitStatus({ type: null, message: '' })
    setCurrentStep((prev) => Math.min(5, prev + 1))
  }

  const onSubmit = async (data: UploadPhotoInput) => {
    if (!imageFiles.length) {
      setSubmitStatus({ type: 'error', message: 'Please add at least one photo.' })
      return
    }

    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: '' })

    let successCount = 0
    let firstPhotoId = ''

    try {
      for (let index = 0; index < imageFiles.length; index += 1) {
        const suffix = imageFiles.length > 1 ? ` (${index + 1}/${imageFiles.length})` : ''
        const payload = {
          ...data,
          title: `${data.title}${suffix}`,
          imageAlt:
            imageFiles.length > 1
              ? `${data.imageAlt} - image ${index + 1} of ${imageFiles.length}`
              : data.imageAlt,
          tags: data.tags || [],
          permissions: data.permissions || 'public',
        }

        const response = await fetch('/api/gallery/photos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        })

        if (!response.ok) {
          continue
        }

        const result = await response.json()
        successCount += 1
        if (!firstPhotoId) {
          firstPhotoId = result.photo.id
        }
      }

      if (!successCount) {
        throw new Error('Upload failed. Please try again.')
      }

      setSubmitStatus({
        type: 'success',
        message: `${successCount} photo${successCount > 1 ? 's' : ''} uploaded successfully.`,
      })

      setImageFiles([])
      setImagePreviews([])
      setTagsInput('')
      setCurrentStep(1)

      if (onSuccess && firstPhotoId) {
        onSuccess(firstPhotoId)
      } else {
        router.push('/gallery/my-uploads')
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {submitStatus.type && (
        <div
          className="p-4 rounded-xl flex items-start gap-3 soft-border"
          style={{
            backgroundColor:
              submitStatus.type === 'success'
                ? 'rgba(157,193,131,0.12)'
                : 'rgba(239,68,68,0.1)',
          }}
        >
          {submitStatus.type === 'success' ? (
            <CheckCircle size={20} style={{ color: 'var(--color-sage-400)' }} />
          ) : (
            <AlertCircle size={20} style={{ color: '#f87171' }} />
          )}
          <p className="text-sm">{submitStatus.message}</p>
        </div>
      )}

      <div className="healing-panel rounded-2xl p-4 md:p-6 healing-border">
        <div className="flex justify-between gap-2 flex-wrap">
          {steps.map((step) => (
            <div key={step.number} className="flex items-center gap-2 min-w-[56px]">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold"
                style={{
                  backgroundColor:
                    currentStep >= step.number
                      ? 'rgba(255,255,255,0.86)'
                      : 'rgba(255,255,255,0.12)',
                  color: currentStep >= step.number ? 'var(--color-charcoal-950)' : 'rgba(255,255,255,0.65)',
                }}
              >
                {step.number}
              </div>
              <span className="text-xs uppercase tracking-[0.14em]" style={{ color: 'rgba(255,255,255,0.55)' }}>
                {step.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {currentStep === 1 && (
        <div className="healing-panel rounded-2xl p-6 md:p-7 space-y-4 healing-border">
          <h2 className="font-display text-3xl">Upload Photos</h2>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.68)' }}>
            Drag and drop or browse files. Beta limit: {MAX_FILES} photos, 5 MB each.
          </p>

          <div
            className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all"
            style={{
              borderColor: imagePreviews.length ? 'rgba(157,193,131,0.6)' : 'rgba(210,168,85,0.45)',
              backgroundColor: imagePreviews.length ? 'rgba(157,193,131,0.08)' : 'rgba(255,255,255,0.02)',
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDragDrop}
            onClick={() => document.getElementById('image-input')?.click()}
          >
            <Upload size={44} className="mx-auto mb-4" style={{ color: 'var(--color-ochre-400)' }} />
            <p className="font-semibold mb-1">Drag and drop your photos here</p>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.62)' }}>
              JPG, PNG, GIF, WEBP
            </p>
          </div>

          <input
            id="image-input"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageSelect}
            className="hidden"
          />

          {imagePreviews.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs uppercase tracking-[0.14em]" style={{ color: 'rgba(255,255,255,0.56)' }}>
                  Selected ({imagePreviews.length}/{MAX_FILES})
                </p>
                <button
                  type="button"
                  className="text-xs hover:underline"
                  onClick={() => {
                    setImageFiles([])
                    setImagePreviews([])
                  }}
                  style={{ color: 'rgba(255,255,255,0.64)' }}
                >
                  Clear all
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {imagePreviews.map((preview, index) => (
                  <div key={`${preview}-${index}`} className="rounded-xl overflow-hidden relative soft-border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={preview} alt={`Upload preview ${index + 1}`} className="w-full h-28 object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/65 flex items-center justify-center"
                    >
                      <X size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {currentStep === 2 && (
        <div className="healing-panel rounded-2xl p-6 md:p-7 space-y-4 healing-border">
          <h2 className="font-display text-3xl">Photo Details</h2>

          <div className="space-y-2">
            <label htmlFor="title" className="text-xs uppercase tracking-[0.14em]" style={{ color: 'rgba(255,255,255,0.65)' }}>
              Title
            </label>
            <input id="title" {...register('title')} placeholder="Give this upload set a title..." className="input-dark" />
            {errors.title && <p className="text-red-300 text-sm">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-xs uppercase tracking-[0.14em]" style={{ color: 'rgba(255,255,255,0.65)' }}>
              Description
            </label>
            <textarea
              id="description"
              {...register('description')}
              placeholder="Share the context of these photos..."
              rows={4}
              maxLength={2000}
              className="input-dark resize-none"
            />
            {errors.description && <p className="text-red-300 text-sm">{errors.description.message}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="imageAlt" className="text-xs uppercase tracking-[0.14em]" style={{ color: 'rgba(255,255,255,0.65)' }}>
              Alt text
            </label>
            <input
              id="imageAlt"
              {...register('imageAlt')}
              placeholder="Describe the images so everyone can access the story..."
              className="input-dark"
            />
            {errors.imageAlt && <p className="text-red-300 text-sm">{errors.imageAlt.message}</p>}
          </div>
        </div>
      )}

      {currentStep === 3 && (
        <div className="healing-panel rounded-2xl p-6 md:p-7 space-y-4 healing-border">
          <h2 className="font-display text-3xl">Tags and Program</h2>

          <div className="space-y-2">
            <label htmlFor="tags" className="text-xs uppercase tracking-[0.14em]" style={{ color: 'rgba(255,255,255,0.65)' }}>
              Tags
            </label>
            <input
              id="tags"
              value={tagsInput}
              onChange={(e) => {
                const value = e.target.value
                setTagsInput(value)
                const tagArray = value
                  .split(',')
                  .map((t) => t.trim())
                  .filter((t) => t.length > 0)
                  .slice(0, 10)
                setValue('tags', tagArray, { shouldValidate: true })
              }}
              placeholder="culture, gathering, youth"
              className="input-dark"
            />
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.54)' }}>
              Up to 10 tags.
            </p>
          </div>

          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span key={tag} className="healing-chip">{tag}</span>
              ))}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="program" className="text-xs uppercase tracking-[0.14em]" style={{ color: 'rgba(255,255,255,0.65)' }}>
              Program
            </label>
            <select
              id="program"
              {...register('program', { setValueAs: (value) => (value ? value : undefined) })}
              className="input-dark"
            >
              <option value="">Select a program</option>
              <option value="YSMP">Young Spirit Mentoring Program</option>
              <option value="Thrive Tribe">Thrive Tribe</option>
              <option value="Healing Centre">Healing Centre</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="event" className="text-xs uppercase tracking-[0.14em]" style={{ color: 'rgba(255,255,255,0.65)' }}>
              Event
            </label>
            <input
              id="event"
              {...register('event', { setValueAs: (value) => (value ? value : undefined) })}
              placeholder="YSMP Open Day 2026"
              className="input-dark"
            />
          </div>
        </div>
      )}

      {currentStep === 4 && (
        <div className="healing-panel rounded-2xl p-6 md:p-7 space-y-4 healing-border">
          <h2 className="font-display text-3xl">Permissions</h2>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.68)' }}>
            Choose who can see this upload.
          </p>

          <div className="space-y-3">
            {[
              {
                value: 'public',
                label: 'Public',
                description: 'Visible to everyone.',
              },
              {
                value: 'members_only',
                label: 'Members Only',
                description: 'Visible to signed-in community members.',
              },
              {
                value: 'verified_members_only',
                label: 'Verified Members Only',
                description: 'Visible to verified members only.',
              },
            ].map((option) => (
              <label
                key={option.value}
                className="flex items-start gap-3 p-3 rounded-xl soft-border cursor-pointer"
                style={{
                  backgroundColor:
                    permissions === option.value ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.02)',
                }}
              >
                <input
                  type="radio"
                  {...register('permissions')}
                  value={option.value}
                  className="mt-1"
                />
                <div>
                  <p className="font-medium">{option.label}</p>
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.62)' }}>{option.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {currentStep === 5 && (
        <div className="healing-panel rounded-2xl p-6 md:p-7 space-y-4 healing-border">
          <h2 className="font-display text-3xl">Review and Confirm</h2>

          <div className="rounded-xl p-4 soft-border" style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
            <div className="grid md:grid-cols-2 gap-4 items-start">
              <div className="grid grid-cols-3 gap-2">
                {imagePreviews.slice(0, 6).map((preview, index) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={`${preview}-${index}`} src={preview} alt={`Selected ${index + 1}`} className="w-full h-20 object-cover rounded-lg" />
                ))}
              </div>
              <div className="space-y-2 text-sm">
                <p><strong>Title:</strong> {title}</p>
                {description && <p><strong>Description:</strong> {description}</p>}
                <p><strong>Alt Text:</strong> {imageAlt}</p>
                {tags && tags.length > 0 && <p><strong>Tags:</strong> {tags.join(', ')}</p>}
                {program && <p><strong>Program:</strong> {program}</p>}
                <p><strong>Privacy:</strong> {permissions}</p>
                <p><strong>Files:</strong> {imageFiles.length}</p>
              </div>
            </div>
          </div>

          <label className="flex items-start gap-3 p-3 rounded-xl soft-border">
            <input type="checkbox" {...register('hasCopyright')} className="mt-1" />
            <div>
              <p className="font-medium text-sm">I own or have permission to share these photos.</p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.62)' }}>
                Upload confirms copyright and ICIP protocol compliance.
              </p>
            </div>
          </label>
          {errors.hasCopyright && <p className="text-red-300 text-sm">{errors.hasCopyright.message}</p>}

          <p className="text-xs inline-flex items-center gap-1.5" style={{ color: 'rgba(255,255,255,0.56)' }}>
            <Sparkles size={12} />
            Upload runs in beta demo mode.
          </p>
        </div>
      )}

      <div className="flex justify-between gap-4 pt-2">
        <button
          type="button"
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1 || isSubmitting}
          className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={16} />
          Back
        </button>

        {currentStep < 5 ? (
          <button
            type="button"
            onClick={onNext}
            disabled={isSubmitting}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight size={16} />
          </button>
        ) : (
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Uploading...' : 'Upload Photos'}
          </button>
        )}
      </div>
    </form>
  )
}
