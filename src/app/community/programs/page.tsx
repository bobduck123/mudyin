import { cache, Suspense } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { PageHero } from '@/components/layout/PageHero'
import { prisma } from '@/lib/db'
import { isDbUnavailableError } from '@/lib/demo-fallback'

export const dynamic = 'force-dynamic'

interface ProgramData {
  name: string
  motif: string
  description: string
  memberCount: number
  postCount: number
  accent: string
  recentPost?: {
    content: string
    authorName: string
  }
}

const PROGRAM_CARDS: Array<Pick<ProgramData, 'name' | 'motif' | 'description' | 'accent'>> = [
  {
    name: 'YSMP',
    motif: 'Training Circle',
    description: 'Connect with YSMP members, share your journey, and celebrate milestones together.',
    accent: 'rgba(223,206,214,0.24)',
  },
  {
    name: 'Thrive Tribe',
    motif: 'Wellbeing Circle',
    description: 'A community celebrating resilience, connection, and collective wellness growth.',
    accent: 'rgba(223,206,214,0.24)',
  },
  {
    name: 'Healing Centre',
    motif: 'Healing Circle',
    description: 'A culturally grounded space for wellness, healing, and inner peace.',
    accent: 'rgba(223,206,214,0.24)',
  },
]

const getPrograms = cache(async (): Promise<ProgramData[]> => {
  try {
    return await Promise.all(
      PROGRAM_CARDS.map(async (program) => {
        const [memberCount, postCount, recentPost] = await Promise.all([
          prisma.userProgramEnrollment.count({
            where: { program: program.name },
          }),
          prisma.communityPost.count({
            where: { program: program.name, visibility: 'public' },
          }),
          prisma.communityPost.findFirst({
            where: { program: program.name, visibility: 'public' },
            orderBy: { createdAt: 'desc' },
            select: {
              content: true,
              author: { select: { name: true } },
            },
          }),
        ])

        return {
          ...program,
          memberCount,
          postCount,
          recentPost: recentPost
            ? {
                content: recentPost.content,
                authorName: recentPost.author.name,
              }
            : undefined,
        }
      })
    )
  } catch (error) {
    if (!isDbUnavailableError(error)) throw error
    return PROGRAM_CARDS.map((program, index) => ({
      ...program,
      memberCount: [42, 36, 28][index] || 20,
      postCount: [18, 14, 10][index] || 6,
      recentPost: {
        content: 'Demo mode: sample program update while backend services are offline.',
        authorName: 'Demo Team',
      },
    }))
  }
})

async function ProgramsContent() {
  const programs = await getPrograms()

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {programs.map((program) => (
        <Link
          key={program.name}
          href={`/community/programs/${encodeURIComponent(program.name)}`}
          className="h-full"
        >
          <div
            className="rounded-2xl p-6 transition-all cursor-pointer group h-full flex flex-col grounded-lines"
            style={{
              backgroundColor: 'rgba(2,2,2,0.72)',
              border: `1px solid ${program.accent}`,
            }}
          >
            <div className="mb-4">
              <p className="text-xs uppercase tracking-[0.14em] mb-2" style={{ color: 'rgba(255,255,255,0.56)' }}>
                {program.motif}
              </p>
              <h3 className="text-2xl font-display text-white group-hover:text-ochre-400 transition">
                {program.name}
              </h3>
            </div>

            <p className="text-white/70 text-sm mb-4 flex-1">
              {program.description}
            </p>

            <div className="space-y-2 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-sm">Members</span>
                <span className="text-sage-400 font-bold text-lg">
                  {program.memberCount}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-sm">Posts</span>
                <span className="text-ochre-400 font-bold text-lg">
                  {program.postCount}
                </span>
              </div>
            </div>

            {program.recentPost && (
              <div className="mt-4 p-3 bg-white/5 rounded-lg border-l-2 border-sage-500">
                <p className="text-white/60 text-xs mb-1">Latest</p>
                <p className="text-white/80 text-sm line-clamp-2">
                  {program.recentPost.content}
                </p>
                <p className="text-white/40 text-xs mt-2">
                  by {program.recentPost.authorName}
                </p>
              </div>
            )}

            <span className="btn-primary w-full mt-4 inline-flex items-center justify-center gap-2 text-sm">
              Enter Community <ArrowRight size={14} />
            </span>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default function ProgramsPage() {
  return (
    <>
      <PageHero
        title="Program Communities"
        subtitle="Choose your circle and move in shared rhythm"
        description="Each program community has its own identity and energy while staying connected to one shared core."
        image="/images/community-gathering.jpg"
      />

      <section className="section-spacing section-padding">
        <div className="container-wide">
          <div className="healing-panel rounded-2xl p-6 mb-8">
            <p className="text-xs uppercase tracking-[0.16em] mb-2" style={{ color: 'rgba(255,255,255,0.58)' }}>
              Ritual Interaction: choose your circle
            </p>
            <h2 className="font-display text-3xl">Distinct communities under one shared home</h2>
          </div>

          <Suspense
            fallback={
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="card-dark p-6">
                    <div className="h-10 bg-white/10 rounded w-3/4 mb-4" />
                    <div className="space-y-2 mb-4">
                      <div className="h-3 bg-white/10 rounded w-full" />
                      <div className="h-3 bg-white/10 rounded w-5/6" />
                    </div>
                    <div className="h-10 bg-white/10 rounded" />
                  </div>
                ))}
              </div>
            }
          >
            <ProgramsContent />
          </Suspense>
        </div>
      </section>
    </>
  )
}
