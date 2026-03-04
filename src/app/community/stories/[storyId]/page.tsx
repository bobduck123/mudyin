'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { StoryCarousel } from '@/components/community/StoryCarousel'

interface StoryFrame {
  id: string
  imageUrl: string
  caption?: string
  duration: number
  frameOrder: number
}

interface Story {
  id: string
  content: string
  author: {
    id: string
    name: string
    profile?: {
      avatar?: string
      bio?: string
      badges?: string[]
    }
  }
  storyFrames: StoryFrame[]
  likeCount: number
  commentCount: number
  createdAt: string
}

export default function StoryPage() {
  const params = useParams()
  const storyId = params.storyId as string
  const [story, setStory] = useState<Story | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadStory() {
      try {
        const response = await fetch(`/api/community/stories/${storyId}`)

        if (!response.ok) {
          throw new Error('Failed to load story')
        }

        const data = await response.json()
        setStory(data.story)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load story')
      } finally {
        setLoading(false)
      }
    }

    loadStory()
  }, [storyId])

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-charcoal">
        <Loader2 className="animate-spin text-sage-500" size={48} />
      </div>
    )
  }

  if (error || !story) {
    return (
      <div className="h-screen flex items-center justify-center bg-charcoal">
        <div className="text-center">
          <p className="text-white/60 mb-4">{error || 'Story not found'}</p>
          <a href="/community" className="btn-primary">
            Back to Community
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex items-center justify-center bg-charcoal">
      <StoryCarousel
        story={{
          id: story.id,
          title: story.content,
          frames: story.storyFrames,
          author: {
            name: story.author.name,
            avatar: story.author.profile?.avatar,
          },
          createdAt: story.createdAt,
        }}
        onClose={() => window.history.back()}
        autoPlay={true}
      />
    </div>
  )
}
