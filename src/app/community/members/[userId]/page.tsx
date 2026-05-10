import Image from 'next/image'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { BadgeDisplay } from '@/components/community/BadgeDisplay'
import { FollowButton } from '@/components/community/FollowButton'
import { CalendarDays, Users } from 'lucide-react'

interface ProfilePageProps {
  params: Promise<{
    userId: string
  }>
}

export const metadata = {
  title: 'Member Profile | Mudyin Community',
  description: 'View member profile and connect with community members.',
}

export default async function MemberProfilePage({
  params,
}: ProfilePageProps) {
  const { userId } = await params
  // Fetch user profile
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: true,
      _count: {
        select: {
          posts: true,
          photos: true,
          comments: true,
          followers: true,
          following: true,
        },
      },
    },
  })

  if (!user) {
    notFound()
  }

  // Calculate days in community
  const now = new Date()
  const daysInCommunity = Math.floor(
    (now.getTime() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24)
  )

  // Format date
  const joinDate = new Intl.DateTimeFormat('en-AU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(user.createdAt)

  // Get avatar or initials fallback
  const avatar = user.profile?.avatar
  const initials = user.name
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()

  const ageGroupLabel: Record<string, string> = {
    '<13': 'Under 13',
    '13-17': '13-17 years',
    '18-25': '18-25 years',
    '26+': '26+ years',
  }

  return (
    <>
      {/* Profile Header Background */}
      <div
        className="h-32 w-full"
        style={{
          background: 'linear-gradient(135deg, rgba(210,168,85,0.1) 0%, rgba(157,193,131,0.1) 100%)',
        }}
      />

      <section className="section-spacing container-wide">
        <div className="max-w-4xl mx-auto">
          {/* Profile Card */}
          <div
            className="rounded-xl p-8 -mt-16 relative z-10 shadow-lg"
            style={{ backgroundColor: 'white' }}
          >
            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between mb-8">
              {/* Left: Avatar + Basic Info */}
              <div className="flex gap-6 items-start">
                {/* Avatar */}
                {avatar ? (
                  <Image
                    src={avatar}
                    alt={user.name}
                    width={96}
                    height={96}
                    className="h-24 w-24 rounded-full object-cover"
                  />
                ) : (
                  <div
                    className="h-24 w-24 rounded-full flex items-center justify-center font-bold text-2xl text-white"
                    style={{ backgroundColor: 'var(--color-ochre-400)' }}
                  >
                    {initials}
                  </div>
                )}

                {/* Info */}
                <div>
                  <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
                  {user.profile?.program && (
                    <p
                      className="text-sm font-semibold uppercase tracking-widest px-3 py-1 rounded-full inline-block mb-3"
                      style={{
                        backgroundColor: 'rgba(157, 193, 131, 0.2)',
                        color: 'var(--color-sage-500)',
                      }}
                    >
                      {user.profile.program}
                    </p>
                  )}
                  <p className="text-gray-600 text-sm">
                    {ageGroupLabel[user.ageGroup] || user.ageGroup}
                  </p>
                </div>
              </div>

              {/* Right: Follow Button */}
              <FollowButton userId={userId} />
            </div>

            {/* Bio */}
            {user.profile?.bio && (
              <div className="mb-8 pb-8 border-b border-gray-200">
                <p className="text-gray-700 leading-relaxed">
                  {user.profile.bio}
                </p>
              </div>
            )}

            {/* Badges */}
            {user.profile?.badges && user.profile.badges.length > 0 && (
              <div className="mb-8 pb-8 border-b border-gray-200">
                <h2 className="text-sm font-semibold uppercase tracking-widest mb-4">
                  Achievements
                </h2>
                <BadgeDisplay
                  badges={user.profile.badges}
                  size="md"
                  showLabels={false}
                />
              </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8 pb-8 border-b border-gray-200">
              {[
                {
                  label: 'Posts',
                  value: user._count.posts,
                },
                {
                  label: 'Photos',
                  value: user._count.photos,
                },
                {
                  label: 'Comments',
                  value: user._count.comments,
                },
                {
                  label: 'Followers',
                  value: user._count.followers,
                },
                {
                  label: 'Following',
                  value: user._count.following,
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="text-center p-3 rounded-lg"
                  style={{ backgroundColor: 'rgba(210, 168, 85, 0.05)' }}
                >
                  <p className="text-2xl font-bold" style={{ color: 'var(--color-ochre-400)' }}>
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-600 uppercase tracking-widest">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Member Info */}
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-center gap-3">
                <CalendarDays size={16} />
                <span>Joined {joinDate}</span>
              </div>
              <div className="flex items-center gap-3">
                <Users size={16} />
                <span>Member for {daysInCommunity} days</span>
              </div>
            </div>
          </div>

          {/* Additional Sections - Coming Soon */}
          <div className="mt-12">
            <h2 className="section-label mb-6">Activity Timeline</h2>
            <div
              className="p-8 rounded-lg text-center text-gray-600"
              style={{ backgroundColor: 'rgba(210, 168, 85, 0.05)' }}
            >
              <p>Activity timeline coming soon</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
