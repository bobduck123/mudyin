'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { UserPlus, UserCheck } from 'lucide-react'

interface FollowButtonProps {
  userId: string
  isFollowing?: boolean
  onFollowChange?: (isFollowing: boolean) => void
}

export function FollowButton({
  userId,
  isFollowing = false,
  onFollowChange,
}: FollowButtonProps) {
  const { data: session } = useSession()
  const currentUserId = session?.user?.id

  const [following, setFollowing] = useState(isFollowing)
  const [isLoading, setIsLoading] = useState(false)

  // Don't render button for own profile
  if (currentUserId === userId) return null

  const handleToggle = async () => {
    if (!currentUserId) return
    setIsLoading(true)

    const newFollowingState = !following
    setFollowing(newFollowingState) // Optimistic

    try {
      const response = await fetch('/api/community/connections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUserId,
        },
        body: JSON.stringify({
          targetUserId: userId,
          action: following ? 'unfollow' : 'follow',
        }),
      })

      if (!response.ok) {
        setFollowing(!newFollowingState) // Revert
        throw new Error('Failed to toggle follow')
      }

      if (onFollowChange) {
        onFollowChange(newFollowingState)
      }
    } catch (error) {
      console.error('Follow toggle error:', error)
      setFollowing(!newFollowingState) // Revert on error
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading || !currentUserId}
      title={!currentUserId ? 'Sign in to follow' : undefined}
      className="flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      style={
        following
          ? {
              backgroundColor: 'rgba(157, 193, 131, 0.1)',
              color: 'var(--color-sage-500)',
              border: '1px solid var(--color-sage-500)',
            }
          : {
              backgroundColor: 'var(--color-ochre-400)',
              color: 'white',
            }
      }
    >
      {following ? (
        <>
          <UserCheck size={16} />
          Following
        </>
      ) : (
        <>
          <UserPlus size={16} />
          Follow
        </>
      )}
    </button>
  )
}
