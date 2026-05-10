export type ProgramStreamStatus = 'active_enquiry' | 'future_phase' | 'paused'

export type ProgramStreamDefinition = {
  slug: string
  name: string
  parentEntity: string
  status: ProgramStreamStatus
  phase: string
  summary: string
  description: string
  culturalNote: string
  enquiryEnabled: boolean
  publicEnabled: boolean
  sortOrder: number
}

export const mudyinOperatingEntity = {
  publicName: 'Mudyin',
  legalName: 'MUDYIN PTY LTD',
  structure: 'Parent operating entity with sub-program streams',
  publicSiteUrl: 'https://www.mudyin.com',
  contactEmail: 'info@mudyin.com',
  abnStatus: 'To be confirmed by operator before public display',
}

export const mudyinProgramStreams: ProgramStreamDefinition[] = [
  {
    slug: 'womens-business',
    name: "Mudyin Women's Business",
    parentEntity: mudyinOperatingEntity.legalName,
    status: 'active_enquiry',
    phase: 'First-live intake and enquiry pathway',
    summary:
      "A culturally grounded women's wellbeing stream under MUDYIN PTY LTD, opening through careful enquiry and relationship-led intake.",
    description:
      "Mudyin Women's Business is the first-live stream for women seeking culturally safe connection, healing-centred support, and respectful pathways into Mudyin activities. The public site accepts enquiries and booking requests, then the team confirms suitability, availability, consent requirements, and next steps before any session is treated as confirmed.",
    culturalNote:
      'Cultural material is represented carefully. Public content stays general unless approved by Mudyin leadership and appropriate knowledge holders.',
    enquiryEnabled: true,
    publicEnabled: true,
    sortOrder: 1,
  },
  {
    slug: 'aaliyahs-dreaming',
    name: "Aaliyah's Dreaming",
    parentEntity: mudyinOperatingEntity.legalName,
    status: 'future_phase',
    phase: 'Future stream - not yet open for public delivery',
    summary:
      'A future Mudyin sub-program stream being prepared through governance, program approval, consent, and risk controls before public launch.',
    description:
      "Aaliyah's Dreaming is presented as a future-stage stream, not a separate live operating entity. Mudyin may collect general expressions of interest while operational documents, delivery scope, safeguarding requirements, and approvals are confirmed.",
    culturalNote:
      'No public claim is made that this stream is currently delivering services, transport, child programs, or clinical support.',
    enquiryEnabled: true,
    publicEnabled: true,
    sortOrder: 2,
  },
  {
    slug: 'mirabellas-dreaming',
    name: "Mirabella's Dreaming",
    parentEntity: mudyinOperatingEntity.legalName,
    status: 'future_phase',
    phase: 'Future stream - not yet open for public delivery',
    summary:
      'A future Mudyin sub-program stream held under the parent operating entity until its rollout requirements are approved.',
    description:
      "Mirabella's Dreaming is part of the staged Mudyin program model. It should remain in future-phase public language until leadership confirms delivery model, safeguards, approvals, and resourcing.",
    culturalNote:
      'The site can receive enquiries, but it does not describe this stream as a confirmed active service.',
    enquiryEnabled: true,
    publicEnabled: true,
    sortOrder: 3,
  },
]

export const mudyinGovernanceControls = [
  {
    title: 'Director decisions and minutes',
    summary:
      'Key governance decisions should be recorded through director minutes and resolutions before public claims, commitments, or new program delivery are made.',
  },
  {
    title: 'Document control',
    summary:
      'Policies, templates, consent forms, incident forms, complaints forms, program approvals, and risk assessments should have owners, versions, and review dates.',
  },
  {
    title: 'Conflicts, spending, and partnerships',
    summary:
      'Conflicts, delegated spending authority, and partner relationships should be recorded before commitments are made on behalf of Mudyin.',
  },
  {
    title: 'Consent, incidents, complaints, and risk',
    summary:
      'Operational pathways should require consent, incident reporting, complaints handling, program approval, and risk assessment where relevant.',
  },
]

export const mudyinOperationsDocuments = [
  'Director Meeting Minutes Template',
  'Director Resolution Template',
  'Conflicts Register Template',
  'Document Register Template',
  'Spending Delegation Matrix Template',
  'Consent Form Template',
  'Incident Report Form Template',
  'Complaints Form Template',
  'Volunteer Agreement Template',
  'Program Approval Form Template',
  'Risk Assessment Template',
  'Partnership Register Template',
  'Folder Structure and Naming Convention',
]

export function statusLabel(status: ProgramStreamStatus): string {
  if (status === 'active_enquiry') return 'Open for enquiries'
  if (status === 'paused') return 'Paused'
  return 'Future phase'
}
