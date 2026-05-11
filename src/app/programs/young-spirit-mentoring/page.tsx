import type { Metadata } from 'next'
import { ProgramStreamPublicPage } from '@/components/programs/ProgramStreamPublicPage'
import { mudyinProgramStreams } from '@/lib/mudyin-operational-model'

const stream = mudyinProgramStreams.find((item) => item.slug === 'young-spirit-mentoring')!

export const metadata: Metadata = {
  title: stream.name,
  description: stream.summary,
}

export default function YoungSpiritMentoringPage() {
  return <ProgramStreamPublicPage stream={stream} />
}
