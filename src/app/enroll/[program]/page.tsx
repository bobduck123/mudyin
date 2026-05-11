import { redirect } from 'next/navigation'

const legacyProgramMap: Record<string, string> = {
  ysmp: 'young-spirit-mentoring',
  'young-spirit-mentoring': 'young-spirit-mentoring',
  'thrive-tribe': 'thrive-tribe',
  'culture-country': 'culture-country',
  'culture-and-country': 'culture-country',
  'womens-business': 'womens-business',
}

type Props = {
  params: Promise<{ program: string }>
}

export default async function EnrollProgramPage({ params }: Props) {
  const { program } = await params
  const programSlug = legacyProgramMap[program]
  const query = programSlug ? `?program=${programSlug}` : ''

  redirect(`/contact${query}#booking-request`)
}
