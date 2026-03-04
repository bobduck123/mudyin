// Simple in-memory cache with TTL for performance optimization
interface CacheEntry<T> {
  value: T
  expiresAt: number
}

class Cache {
  private store: Map<string, CacheEntry<unknown>> = new Map()
  private cleanupInterval: NodeJS.Timeout | null = null

  constructor() {
    // Cleanup expired entries every 5 minutes
    if (typeof window === 'undefined') {
      // Server-side only
      this.cleanupInterval = setInterval(() => {
        this.cleanup()
      }, 5 * 60 * 1000)
    }
  }

  set<T>(key: string, value: T, ttlSeconds: number = 300) {
    const expiresAt = Date.now() + ttlSeconds * 1000
    this.store.set(key, { value, expiresAt })
  }

  get<T>(key: string): T | null {
    const entry = this.store.get(key)
    if (!entry) return null

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key)
      return null
    }

    return entry.value as T
  }

  delete(key: string) {
    this.store.delete(key)
  }

  clear() {
    this.store.clear()
  }

  private cleanup() {
    const now = Date.now()
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.expiresAt) {
        this.store.delete(key)
      }
    }
  }

  destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
    }
    this.clear()
  }
}

// Singleton instance
export const cache = new Cache()

// Cache key generators
export const cacheKeys = {
  trendingPhotos: (timeWindow: string) => `trending_photos_${timeWindow}`,
  trendingPhotosByProgram: (program: string, timeWindow: string) =>
    `trending_photos_${program}_${timeWindow}`,
  galleryPhotos: (page: number, limit: number) =>
    `gallery_photos_p${page}_l${limit}`,
  galleryPhotoDetail: (photoId: string) => `gallery_photo_${photoId}`,
  userProfile: (userId: string) => `user_profile_${userId}`,
  communityFeed: (userId: string, page: number) =>
    `community_feed_${userId}_p${page}`,
  memberDirectory: (page: number, program?: string) =>
    `member_dir_p${page}_${program || 'all'}`,
  tagSuggestions: (search: string) => `tag_suggestions_${search}`,
  notifications: (userId: string) => `notifications_${userId}`,
}

// Cache duration presets (in seconds)
export const cacheDuration = {
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 3600, // 1 hour
  VERYLONG: 86400, // 24 hours
}
