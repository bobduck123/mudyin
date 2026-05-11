import type { Metadata } from 'next'
import { ProgramStreamPublicPage } from '@/components/programs/ProgramStreamPublicPage'
import { mudyinProgramStreams } from '@/lib/mudyin-operational-model'

const stream = mudyinProgramStreams.find((item) => item.slug === 'culture-country')!

export const metadata: Metadata = {
  title: stream.name,
  description: stream.summary,
}

export default function CultureCountryPage() {
  return <ProgramStreamPublicPage stream={stream} />
}
