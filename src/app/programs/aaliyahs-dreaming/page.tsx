import type { Metadata } from 'next'
import { ProgramStreamPublicPage } from '@/components/programs/ProgramStreamPublicPage'
import { mudyinProgramStreams } from '@/lib/mudyin-operational-model'

const stream = mudyinProgramStreams.find((item) => item.slug === 'aaliyahs-dreaming')!

export const metadata: Metadata = {
  title: stream.name,
  description: stream.summary,
}

export default function AaliyahsDreamingPage() {
  return <ProgramStreamPublicPage stream={stream} />
}
