import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PhotoUploadForm } from '@/components/gallery/PhotoUploadForm'

export const metadata = {
  title: 'Upload Photo | Gallery | Mudyin',
  description: 'Share your photos from Mudyin programs and events',
}

export default async function GalleryUploadPage() {
  // Verify user is authenticated
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/auth/signin')
  }

  return (
    <>
      {/* Page Hero */}
      <section
        className="section-spacing container-wide"
        style={{
          background: 'linear-gradient(135deg, rgba(210,168,85,0.1) 0%, rgba(157,193,131,0.1) 100%)',
        }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-display text-5xl font-bold mb-4">
            Share Your Moment
          </h1>
          <p className="text-lg text-gray-600">
            Upload a photo from a Mudyin event or program
          </p>
        </div>
      </section>

      {/* Upload Form */}
      <section className="section-spacing container-wide">
        <div className="max-w-2xl mx-auto">
          <PhotoUploadForm />
        </div>
      </section>
    </>
  )
}
