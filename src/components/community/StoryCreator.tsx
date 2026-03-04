'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Upload, X, Plus, Loader2, ChevronUp, ChevronDown } from 'lucide-react'

interface StoryFrame {
  imageUrl: string
  caption: string
  duration: number
}

interface StoryCreatorProps {
  userId: string
  program?: string
}

export function StoryCreator({ userId, program }: StoryCreatorProps) {
  const router = useRouter()
  const [step, setStep] = useState<'info' | 'frames' | 'settings'>('info')
  const [formData, setFormData] = useState({
    content: '',
    program: program || 'YSMP',
    tags: [] as string[],
    visibility: 'public' as 'public' | 'members_only',
  })
  const [frames, setFrames] = useState<StoryFrame[]>([])
  const [currentTag, setCurrentTag] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAddFrame = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // In real app, upload to Cloudinary
    // For now, create a data URL
    const reader = new FileReader()
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string
      setFrames([
        ...frames,
        {
          imageUrl,
          caption: '',
          duration: 5,
        },
      ])
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveFrame = (index: number) => {
    setFrames(frames.filter((_, i) => i !== index))
  }

  const handleUpdateFrame = (index: number, field: keyof StoryFrame, value: string | number) => {
    const updatedFrames = [...frames]
    updatedFrames[index] = {
      ...updatedFrames[index],
      [field]: value,
    }
    setFrames(updatedFrames)
  }

  const handleMoveFrame = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === frames.length - 1) return

    const newFrames = [...frames]
    const swap = direction === 'up' ? index - 1 : index + 1
    ;[newFrames[index], newFrames[swap]] = [newFrames[swap], newFrames[index]]
    setFrames(newFrames)
  }

  const handleAddTag = () => {
    if (currentTag && !formData.tags.includes(currentTag) && formData.tags.length < 10) {
      setFormData({
        ...formData,
        tags: [...formData.tags, currentTag],
      })
      setCurrentTag('')
    }
  }

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t) => t !== tag),
    })
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      setError('')

      if (!formData.content) {
        setError('Story description is required')
        return
      }

      if (frames.length === 0) {
        setError('Story must have at least one frame')
        return
      }

      const response = await fetch('/api/community/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          content: formData.content,
          program: formData.program,
          tags: formData.tags,
          visibility: formData.visibility,
          storyFrames: frames.map((f, i) => ({
            imageUrl: f.imageUrl,
            caption: f.caption,
            duration: f.duration,
            frameOrder: i + 1,
          })),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create story')
      }

      const data = await response.json()
      router.push(`/community/stories/${data.story.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create story')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {['info', 'frames', 'settings'].map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition ${
                step === s
                  ? 'bg-sage-500 text-white'
                  : ['info', 'frames', 'settings'].indexOf(step) > i
                    ? 'bg-ochre-400 text-white'
                    : 'bg-white/10 text-white/60'
              }`}
            >
              {i + 1}
            </div>
            <span className="text-white/60 text-sm hidden sm:inline">
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </span>
            {i < 2 && <div className="flex-1 h-px bg-white/10" />}
          </div>
        ))}
      </div>

      {/* Error message */}
      {error && (
        <div className="card-dark bg-red-500/20 border border-red-500/50 p-4 mb-6 rounded-lg">
          <p className="text-red-200">{error}</p>
        </div>
      )}

      {/* Step 1: Story Info */}
      {step === 'info' && (
        <div className="card-dark p-6 space-y-4">
          <h3 className="text-xl font-bold text-white">Story Details</h3>

          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Story Description
            </label>
            <textarea
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              placeholder="What's this story about?"
              maxLength={500}
              rows={4}
              className="w-full bg-white/10 text-white placeholder-white/40 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-sage-500"
            />
            <p className="text-white/40 text-xs mt-1">
              {formData.content.length} / 500 characters
            </p>
          </div>

          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Program
            </label>
            <select
              value={formData.program}
              onChange={(e) =>
                setFormData({ ...formData, program: e.target.value })
              }
              className="w-full bg-white/10 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-sage-500"
            >
              <option value="YSMP">YSMP</option>
              <option value="Thrive Tribe">Thrive Tribe</option>
              <option value="Healing Centre">Healing Centre</option>
            </select>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep('frames')}
              className="btn-primary flex-1"
            >
              Next: Add Frames
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Frames */}
      {step === 'frames' && (
        <div className="card-dark p-6 space-y-4">
          <h3 className="text-xl font-bold text-white">Story Frames</h3>

          {/* Upload area */}
          <label className="border-2 border-dashed border-sage-500/50 rounded-lg p-8 text-center cursor-pointer hover:border-sage-500 hover:bg-sage-500/5 transition">
            <Upload className="mx-auto mb-2 text-sage-500" size={32} />
            <p className="text-white font-medium">Click to upload frame</p>
            <p className="text-white/60 text-sm">PNG, JPG up to 10MB</p>
            <input
              type="file"
              accept="image/*"
              onChange={handleAddFrame}
              className="hidden"
            />
          </label>

          {/* Frames list */}
          <div className="space-y-3">
            {frames.length === 0 ? (
              <p className="text-white/60 text-center py-4">No frames yet</p>
            ) : (
              frames.map((frame, i) => (
                <div key={i} className="bg-white/5 p-4 rounded-lg space-y-2">
                  <div className="flex items-center gap-3 justify-between">
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">Frame {i + 1}</p>
                      <div className="relative w-full h-24 bg-white/10 rounded mt-2 overflow-hidden">
                        <Image
                          src={frame.imageUrl}
                          alt={`Frame ${i + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>

                    <div className="flex gap-1">
                      <button
                        onClick={() => handleMoveFrame(i, 'up')}
                        disabled={i === 0}
                        className="p-2 hover:bg-white/10 disabled:opacity-30 rounded"
                      >
                        <ChevronUp size={18} className="text-white/60" />
                      </button>
                      <button
                        onClick={() => handleMoveFrame(i, 'down')}
                        disabled={i === frames.length - 1}
                        className="p-2 hover:bg-white/10 disabled:opacity-30 rounded"
                      >
                        <ChevronDown size={18} className="text-white/60" />
                      </button>
                      <button
                        onClick={() => handleRemoveFrame(i)}
                        className="p-2 hover:bg-red-500/20 rounded"
                      >
                        <X size={18} className="text-red-400" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-white/60 text-xs">Duration (s)</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={frame.duration}
                        onChange={(e) =>
                          handleUpdateFrame(i, 'duration', parseInt(e.target.value))
                        }
                        className="w-full bg-white/10 text-white text-sm rounded p-2"
                      />
                    </div>
                    <div>
                      <label className="text-white/60 text-xs">Caption</label>
                      <input
                        type="text"
                        value={frame.caption}
                        onChange={(e) =>
                          handleUpdateFrame(i, 'caption', e.target.value)
                        }
                        placeholder="Optional"
                        maxLength={100}
                        className="w-full bg-white/10 text-white text-sm rounded p-2"
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep('info')} className="btn-ghost flex-1">
              Back
            </button>
            <button
              onClick={() => setStep('settings')}
              disabled={frames.length === 0}
              className="btn-primary flex-1 disabled:opacity-50"
            >
              Next: Settings
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Settings */}
      {step === 'settings' && (
        <div className="card-dark p-6 space-y-4">
          <h3 className="text-xl font-bold text-white">Story Settings</h3>

          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Visibility
            </label>
            <div className="space-y-2">
              {(['public', 'members_only'] as const).map((vis) => (
                <label key={vis} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="visibility"
                    value={vis}
                    checked={formData.visibility === vis}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        visibility: e.target.value as 'public' | 'members_only',
                      })
                    }
                    className="w-4 h-4"
                  />
                  <span className="text-white text-sm capitalize">{vis.replace('_', ' ')}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Tags (max 10)
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                placeholder="Add tag..."
                maxLength={20}
                className="flex-1 bg-white/10 text-white placeholder-white/40 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-sage-500"
              />
              <button
                onClick={handleAddTag}
                className="btn-ghost px-3 py-2 flex items-center gap-1"
              >
                <Plus size={16} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <div
                  key={tag}
                  className="bg-sage-500/30 text-sage-200 text-sm px-3 py-1 rounded-full flex items-center gap-2"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-sage-100"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button onClick={() => setStep('frames')} className="btn-ghost flex-1">
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Publishing...
                </>
              ) : (
                'Publish Story'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
