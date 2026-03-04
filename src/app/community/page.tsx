import Link from 'next/link'
import { PageHero } from '@/components/layout/PageHero'
import { MessageCircle, Users, Share2, Heart } from 'lucide-react'

export const metadata = {
  title: 'Community | Mudyin',
  description: 'A place to gather, share, and keep momentum together.',
}

const communityActions = [
  {
    href: '/community/feed',
    title: 'Community Feed',
    description: 'Follow yarns, celebrations, and updates from across mob.',
    icon: MessageCircle,
    accent: 'rgba(219,22,47,0.45)',
  },
  {
    href: '/community/create',
    title: 'Share a Story',
    description: 'Post moments, reflections, and actions that move community forward.',
    icon: Share2,
    accent: 'rgba(243,222,44,0.45)',
  },
  {
    href: '/community/members',
    title: 'Find Your People',
    description: 'Connect with members, mentors, and program communities.',
    icon: Users,
    accent: 'rgba(195,121,32,0.45)',
  },
  {
    href: '/gallery',
    title: 'Photo Stories',
    description: 'See community moments and visual memory from events on Country.',
    icon: Heart,
    accent: 'rgba(223,206,214,0.4)',
  },
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

export default function CommunityPage() {
  return (
    <>
      <PageHero
        title="Community Hub"
        subtitle="Pride in our momentum, safe in our warmth"
        description="Welcome home. No matter your mob, you are on Country here. Share stories, celebrate growth, and keep each other strong."
      />

      <section className="section-spacing section-padding container-wide country-lines">
        <div className="max-w-6xl mx-auto">
          <div className="engraved-panel rounded-2xl p-6 mb-8">
            <p style={{ color: 'rgba(255,255,255,0.82)' }}>
              This is a shared space for belonging and forward movement. Start with community actions, then join your program circle.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5 mb-10">
            {communityActions.map((action) => {
              const Icon = action.icon
              return (
                <Link key={action.href} href={action.href} className="rounded-2xl p-6 transition-transform hover:-translate-y-1" style={{ backgroundColor: 'rgba(2,2,2,0.74)', border: `1px solid ${action.accent}` }}>
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.06)', border: `1px solid ${action.accent}` }}>
                      <Icon size={20} style={{ color: 'var(--color-flag-yellow)' }} />
                    </div>
                    <div>
                      <h3 className="font-display text-2xl mb-1">{action.title}</h3>
                      <p className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>{action.description}</p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>

          <div className="rounded-2xl p-6 mb-10" style={{ backgroundColor: 'rgba(2,2,2,0.72)', border: '1px solid rgba(223,206,214,0.24)' }}>
            <p className="text-xs uppercase tracking-[0.16em] mb-3" style={{ color: 'rgba(255,255,255,0.56)' }}>
              Ritual Interaction: choose your circle
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              {programCommunities.map((program, idx) => (
                <Link
                  key={program.href}
                  href={program.href}
                  className="rounded-xl p-5 block story-trail transition-transform hover:-translate-y-1"
                  style={{
                    border: idx === 2 ? '1px solid rgba(2,2,2,0.66)' : '1px solid rgba(223,206,214,0.23)',
                    backgroundColor: idx === 2 ? 'rgba(223,206,214,0.92)' : 'rgba(255,255,255,0.02)',
                  }}
                >
                  <h3 className="font-display text-xl mb-2" style={{ color: idx === 2 ? 'var(--color-flag-black)' : 'var(--color-foreground)' }}>
                    {program.title}
                  </h3>
                  <p className="text-sm" style={{ color: idx === 2 ? 'rgba(2,2,2,0.78)' : 'rgba(255,255,255,0.68)' }}>
                    {program.copy}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          <div className="py-8 px-6 rounded-2xl" style={{ backgroundColor: 'rgba(2,2,2,0.7)', border: '1px solid rgba(223,206,214,0.24)' }}>
            <h2 className="section-label mb-4">Community Ways</h2>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Respect First</h4>
                <p style={{ color: 'rgba(255,255,255,0.64)' }}>Speak with care. Listen deeply. Keep each other safe.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Hold Privacy</h4>
                <p style={{ color: 'rgba(255,255,255,0.64)' }}>Share responsibly and protect personal stories.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Lift Momentum</h4>
                <p style={{ color: 'rgba(255,255,255,0.64)' }}>Celebrate effort and growth as collective progress.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
