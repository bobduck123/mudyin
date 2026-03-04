'use client'

import Link from 'next/link'

interface HashtagLinkProps {
  tag: string
  className?: string
}

export function HashtagLink({ tag, className = '' }: HashtagLinkProps) {
  return (
    <Link
      href={`/community/hashtags/${encodeURIComponent(tag)}`}
      className={`hover:opacity-80 transition-opacity ${className}`}
      style={{ color: 'var(--color-ochre-400)' }}
    >
      #{tag}
    </Link>
  )
}
