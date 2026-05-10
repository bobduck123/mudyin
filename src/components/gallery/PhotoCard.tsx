'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Heart, MessageCircle } from 'lucide-react'

interface PhotoCardProps {
  id: string
  imageUrl: string
  title: string
  photographerName: string
  photographerAvatar?: string
  likeCount: number
  commentCount: number
}

export function PhotoCard({
  id,
  imageUrl,
  title,
  photographerName,
  photographerAvatar,
  likeCount,
  commentCount,
}: PhotoCardProps) {
  return (
    <Link href={`/gallery/${id}`}>
      <div
        className="rounded-2xl overflow-hidden transition-all group cursor-pointer grounded-lines"
        style={{
          backgroundColor: 'rgba(2,2,2,0.86)',
          boxShadow: '0 12px 24px rgba(0,0,0,0.3)',
        }}
      >
        {/* Image Container */}
        <div className="relative overflow-hidden aspect-square">
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Overlay on Hover */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end"
            style={{
              background: 'linear-gradient(to top, rgba(20,20,20,0.8), transparent)',
            }}
          >
            <div className="w-full p-3">
              <p className="text-white text-sm font-semibold line-clamp-2">
                {title}
              </p>
            </div>
          </div>
        </div>

        {/* Card Footer */}
        <div className="p-4 space-y-3">
          <p className="text-[11px] uppercase tracking-[0.14em]" style={{ color: 'rgba(255,255,255,0.46)' }}>
            Story Frame
          </p>
          {/* Photographer Info */}
          <div className="flex items-center gap-2">
            {photographerAvatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photographerAvatar}
                alt={photographerName}
                className="w-6 h-6 rounded-full object-cover"
                width={24}
                height={24}
              />
            ) : (
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs text-white"
                style={{ backgroundColor: 'var(--color-ochre-400)' }}
              >
                {photographerName.charAt(0)}
              </div>
            )}
            <p className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.78)' }}>
              {photographerName}
            </p>
          </div>

          {/* Title */}
          <h3
            className="font-semibold text-sm line-clamp-2 group-hover:text-ochre-400 transition-colors"
            style={{ color: 'rgba(255,255,255,0.9)' }}
          >
            {title}
          </h3>

          {/* Stats */}
          <div className="flex items-center gap-4 text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>
            <div className="flex items-center gap-1">
              <Heart size={14} />
              <span>{likeCount} likes</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle size={14} />
              <span>{commentCount} comments</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
