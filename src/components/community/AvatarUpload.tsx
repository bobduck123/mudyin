'use client'

import Image from 'next/image'
import { useState, useRef } from 'react'
import { Upload, X } from 'lucide-react'

interface AvatarUploadProps {
  currentAvatar?: string
  userName?: string
  onUploadSuccess?: (avatarUrl: string) => void
}

export function AvatarUpload({
  currentAvatar,
  userName = 'User',
  onUploadSuccess,
}: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File must be less than 5MB')
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
      setError(null)
    }
    reader.readAsDataURL(file)
  }

  const handleUpload = async () => {
    if (!preview || !fileInputRef.current?.files?.[0]) {
      setError('No file selected')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', fileInputRef.current.files[0])

      const response = await fetch('/api/community/avatars/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      setPreview(null)
      fileInputRef.current.value = ''

      if (onUploadSuccess) {
        onUploadSuccess(data.avatarUrl)
      }
    } catch (err) {
      setError('Failed to upload avatar')
      console.error('Avatar upload error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClear = () => {
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-4">
      {/* Current Avatar or Preview */}
      <div className="flex items-center gap-4">
        <div className="relative">
          {preview ? (
            <Image
              src={preview}
              alt="Avatar preview"
              width={96}
              height={96}
              className="h-24 w-24 rounded-full object-cover border-2"
              style={{ borderColor: 'var(--color-ochre-400)' }}
              unoptimized
            />
          ) : currentAvatar ? (
            <Image
              src={currentAvatar}
              alt={userName}
              width={96}
              height={96}
              className="h-24 w-24 rounded-full object-cover"
            />
          ) : (
            <div
              className="h-24 w-24 rounded-full flex items-center justify-center text-white font-bold text-lg"
              style={{ backgroundColor: 'var(--color-ochre-400)' }}
            >
              {userName
                .split(' ')
                .map(n => n[0])
                .join('')
                .toUpperCase()}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Profile Picture</p>
          <p className="text-xs text-gray-600">
            JPG, PNG or GIF, max 5MB
          </p>

          {error && (
            <p className="text-xs text-red-600">{error}</p>
          )}
        </div>
      </div>

      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Upload Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: 'rgba(210, 168, 85, 0.1)',
            color: 'var(--color-ochre-400)',
            border: '1px solid var(--color-ochre-400)',
          }}
        >
          <Upload size={16} />
          Choose File
        </button>

        {preview && (
          <>
            <button
              onClick={handleUpload}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: 'var(--color-ochre-400)' }}
            >
              {isLoading ? 'Uploading...' : 'Save Avatar'}
            </button>
            <button
              onClick={handleClear}
              disabled={isLoading}
              className="px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: '#f3f4f6',
                color: '#6b7280',
              }}
            >
              <X size={16} />
            </button>
          </>
        )}
      </div>
    </div>
  )
}
