import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PhotoUploadForm } from '@/components/gallery/PhotoUploadForm'
import { PageHero } from '@/components/layout/PageHero'

export const metadata = {
  title: 'Upload Photo | Gallery | Mudyin',
  description: 'Share your photos from Mudyin programs and events',
}

export default async function GalleryUploadPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/auth/signin')
  }

  return (
    <>
      <PageHero
        title="Share Your Moment"
        subtitle="Community upload studio"
        description="Upload up to 10 photos per submission in beta mode. Maximum 5 MB per image."
        compact
      />

      <section className="section-spacing section-padding">
        <div className="container-mid">
          <PhotoUploadForm />
        </div>
      </section>
    </>
  )
}
