'use client'

import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { PageHero } from '@/components/layout/PageHero'
import { ProgramFeed } from '@/components/community/ProgramFeed'

export default function ProgramPage() {
  const params = useParams()
  const { data: session } = useSession()

  const program = decodeURIComponent(params.program as string)
  const userId = (session?.user as { id?: string })?.id
  const userBadges = (session?.user as { profile?: { badges?: string[] } })?.profile?.badges || []

  return (
    <>
      <PageHero
        title={program}
        subtitle={getProgramSubtitle(program)}
        image={getProgramBackgroundImage(program)}
      />

      <section className="py-12">
        <div className="container mx-auto px-4">
          <ProgramFeed
            program={program}
            userId={userId}
            userBadges={userBadges}
          />
        </div>
      </section>
    </>
  )
}

function getProgramSubtitle(program: string): string {
  const subtitles: Record<string, string> = {
    YSMP: 'Young Spirit Mentoring Program - Supporting young people on their growth journey',
    'Thrive Tribe': 'Community-focused program celebrating resilience and collective strength',
    'Healing Centre': 'Cultural space for wellness, healing, and inner peace',
  }
  return subtitles[program] || 'Join our community'
}

function getProgramBackgroundImage(program: string): string {
  const images: Record<string, string> = {
    YSMP: '/images/ysmp-hero.jpg',
    'Thrive Tribe': '/images/thrive-hero.jpg',
    'Healing Centre': '/images/healing-hero.jpg',
  }
  return images[program] || '/images/programs-hero.jpg'
}
