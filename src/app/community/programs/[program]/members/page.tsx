'use client'

import { useParams } from 'next/navigation'
import { PageHero } from '@/components/layout/PageHero'
import { ProgramMembers } from '@/components/community/ProgramMembers'

export default function ProgramMembersPage() {
  const params = useParams()
  const program = decodeURIComponent(params.program as string)

  return (
    <>
      <PageHero
        title={`${program} Members`}
        subtitle="Connect with community members on a shared journey"
        image="/images/members-hero.jpg"
      />

      <section className="py-12">
        <div className="container mx-auto px-4">
          <ProgramMembers program={program} />
        </div>
      </section>
    </>
  )
}
