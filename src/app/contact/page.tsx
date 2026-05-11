import type { Metadata } from 'next'
import { ContactPageClient } from './ContactPageClient'

export const metadata: Metadata = {
  title: 'Contact and Enquiries',
  description:
    'Send Mudyin a general enquiry or booking request. Requests are reviewed before any program, date, place, or session is confirmed.',
}

type ContactPageProps = {
  searchParams: Promise<{ program?: string }>
}

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const params = await searchParams

  return <ContactPageClient programSlug={params.program ?? ''} />
}
