import type { Metadata } from 'next'
import { ProgramStreamPublicPage } from '@/components/programs/ProgramStreamPublicPage'
import { mudyinProgramStreams } from '@/lib/mudyin-operational-model'

const stream = mudyinProgramStreams.find((item) => item.slug === 'mirabellas-dreaming')!

export const metadata: Metadata = {
  title: stream.name,
  description: stream.summary,
}

export default function MirabellasDreamingPage() {
  return <ProgramStreamPublicPage stream={stream} />
}
