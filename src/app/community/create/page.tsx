import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { CreatePostForm } from '@/components/community/CreatePostForm'

export const metadata = {
  title: 'Create Post - Mudyin Community',
}

export default async function CreatePostPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/auth/signin')
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-charcoal)' }}>
      {/* Hero Section */}
      <div className="px-4 py-8 md:py-12 border-b" style={{ borderColor: 'rgba(210, 168, 85, 0.2)' }}>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: 'var(--color-ochre-400)' }}>
            Share Your Story
          </h1>
          <p className="text-gray-400">
            Connect with the community and celebrate your journey
          </p>
        </div>
      </div>

      {/* Form Container */}
      <div className="px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div
            className="rounded-lg p-6 md:p-8"
            style={{
              backgroundColor: 'rgba(20, 20, 20, 0.95)',
              border: '1px solid rgba(210, 168, 85, 0.2)',
            }}
          >
            {/* CreatePostForm handles its own navigation via useRouter */}
            <CreatePostForm userId={session.user.id} />
          </div>
        </div>
      </div>
    </div>
  )
}
