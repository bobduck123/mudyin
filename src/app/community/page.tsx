import Link from 'next/link'
import { ArrowRight, Flame, MessageCircle, Share2, Users, Heart, ShieldCheck, HandHeart } from 'lucide-react'
import { PageHero } from '@/components/layout/PageHero'

export const metadata = {
  title: 'Community | Mudyin',
  description: 'A place to gather, share, and keep momentum together.',
}

const heroActions = [
  { href: '/community/feed', label: 'Community Feed', icon: MessageCircle },
  { href: '/community/create', label: 'Spin a Yarn', icon: Share2 },
  { href: '/community/members', label: 'Find Your Mob', icon: Users },
]

const communityActions = [
  {
    href: '/community/feed',
    title: 'Community Feed',
    description: 'Follow yarns, celebrations, and updates from across mob.',
    icon: MessageCircle,
  },
  {
    href: '/community/create',
    title: 'Share a Story',
    description: 'Post moments, reflections, and actions that move community forward.',
    icon: Share2,
  },
  {
    href: '/community/members',
    title: 'Find Your People',
    description: 'Connect with members, mentors, and program communities.',
    icon: Users,
  },
  {
    href: '/gallery',
    title: 'Photo Stories',
    description: 'See visual memory from gatherings, ceremonies, and growth moments.',
    icon: Heart,
  },
]

const ritualSteps = [
  'Arrive and listen',
  'Share your yarn',
  'Join your circle',
  'Carry momentum together',
]

const programCommunities = [
  {
    href: '/community/programs/YSMP',
    title: 'Young Spirit Mentoring Program',
    copy: 'Training, pride, and discipline shared in daily practice.',
  },
  {
    href: '/community/programs/Thrive%20Tribe',
    title: 'Thrive Tribe',
    copy: 'Wellbeing and resilience built through community rhythm.',
  },
  {
    href: '/community/programs/Healing%20Centre',
    title: 'Healing Centre',
    copy: 'Culturally grounded support for mind, body, and spirit.',
  },
]

const communityWays = [
  {
    title: 'Respect First',
    copy: 'Speak with care. Listen deeply. Keep each other safe.',
    icon: ShieldCheck,
  },
  {
    title: 'Hold Privacy',
    copy: 'Share responsibly and protect personal stories.',
    icon: HandHeart,
  },
  {
    title: 'Lift Momentum',
    copy: 'Celebrate growth as collective progress, not individual status.',
    icon: Flame,
  },
]

export default function CommunityPage() {
  return (
    <>
      <PageHero
        title="Community Hub"
        subtitle="Pride in our momentum, safe in our warmth"
        description="Welcome home. Families, young people, and mentors gather here to share stories, celebrate growth, and keep each other strong."
        image="/images/ysmp-fitness.jpg"
        imageAlt="Program in action with community participants"
      />

      <section className="section-spacing section-padding">
        <div className="container-wide space-y-10">
          <div className="healing-panel grounded-lines rounded-2xl p-6 lg:p-8 healing-border">
            <div className="grid lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-7">
                <p className="text-xs uppercase tracking-[0.18em] mb-3" style={{ color: 'rgba(255,255,255,0.56)' }}>
                  Campfire Entry
                </p>
                <h2 className="font-display text-3xl lg:text-4xl mb-4">
                  Spin a yarn, then move through the story trails
                </h2>
                <p className="max-w-3xl leading-relaxed" style={{ color: 'rgba(255,255,255,0.74)' }}>
                  This is a shared place for belonging and forward movement. Start with people in action,
                  then step into your circle and carry momentum with community.
                </p>

                <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <Link
                    href="/community/feed"
                    className="btn-clay-glass px-7 py-3.5 inline-flex items-center gap-2 text-sm uppercase tracking-[0.12em]"
                  >
                    Aye you mob
                    <ArrowRight size={14} />
                  </Link>
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>welcome home</p>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {heroActions.map((action) => {
                    const Icon = action.icon
                    return (
                      <Link key={action.href} href={action.href} className="healing-chip inline-flex items-center gap-1.5">
                        <Icon size={13} />
                        {action.label}
                      </Link>
                    )
                  })}
                </div>
              </div>

              <div className="lg:col-span-5 rounded-xl p-4 soft-border healing-border" style={{ backgroundColor: 'rgba(255,255,255,0.025)' }}>
                <p className="text-xs uppercase tracking-[0.15em] mb-3" style={{ color: 'rgba(255,255,255,0.52)' }}>
                  Ritual Interaction
                </p>
                <ol className="space-y-2 text-sm">
                  {ritualSteps.map((step, idx) => (
                    <li key={step} className="care-trail">
                      <span style={{ color: 'rgba(255,255,255,0.78)' }}>
                        {idx + 1}. {step}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>

          <div className="grounded-divider" />

          <div className="grid md:grid-cols-2 gap-5">
            {communityActions.map((action) => {
              const Icon = action.icon
              return (
                <Link
                  key={action.href}
                  href={action.href}
                  className="group rounded-2xl p-6 transition-transform hover:-translate-y-1 grounded-lines healing-panel healing-border"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center healing-border"
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.03)',
                      }}
                    >
                      <Icon size={20} style={{ color: 'rgba(255,255,255,0.9)' }} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display text-2xl mb-1">{action.title}</h3>
                      <p className="text-sm" style={{ color: 'rgba(255,255,255,0.72)' }}>{action.description}</p>
                      <span className="inline-flex items-center gap-1 text-xs mt-3" style={{ color: 'rgba(255,255,255,0.6)' }}>
                        Open Trail <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>

          <div className="grid lg:grid-cols-12 gap-6 items-stretch">
            <div
              className="lg:col-span-8 rounded-2xl p-6 lg:p-7 grounded-lines healing-panel healing-border"
            >
              <p className="text-xs uppercase tracking-[0.16em] mb-3" style={{ color: 'rgba(255,255,255,0.56)' }}>
                Program Circles
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                {programCommunities.map((program, idx) => (
                  <Link
                    key={program.href}
                    href={program.href}
                    className="rounded-xl p-5 block transition-transform hover:-translate-y-1 healing-panel healing-border"
                    style={{
                      backgroundColor: idx === 2 ? 'rgba(223,206,214,0.86)' : 'rgba(2,2,2,0.62)',
                    }}
                  >
                    <h3
                      className="font-display text-xl mb-2"
                      style={{ color: idx === 2 ? 'var(--color-charcoal-950)' : 'var(--color-foreground)' }}
                    >
                      {program.title}
                    </h3>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: idx === 2 ? 'rgba(2,2,2,0.76)' : 'rgba(255,255,255,0.68)' }}
                    >
                      {program.copy}
                    </p>
                  </Link>
                ))}
              </div>
            </div>

            <aside
              className="lg:col-span-4 rounded-2xl p-6 healing-panel healing-border"
            >
              <h2 className="section-label mb-4">Community Ways</h2>
              <div className="space-y-4 text-sm">
                {communityWays.map((item) => {
                  const Icon = item.icon
                  return (
                    <div key={item.title} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center healing-border" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
                        <Icon size={15} style={{ color: 'rgba(255,255,255,0.92)' }} />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">{item.title}</h4>
                        <p style={{ color: 'rgba(255,255,255,0.66)' }}>{item.copy}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  )
}
