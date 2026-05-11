export type ProgramStreamStatus = 'active_enquiry' | 'future_phase' | 'paused'

export type ProgramStreamDefinition = {
  slug: string
  name: string
  parentEntity: string
  status: ProgramStreamStatus
  phase: string
  summary: string
  description: string
  audience: string
  enquiryTopics: string[]
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
  contactEmail: 'yaama@mudyin.com',
  intakeEmail: 'yaama@mudyin.com',
  abnStatus: 'To be confirmed by operator before public display',
}

export const mudyinProgramStreams: ProgramStreamDefinition[] = [
  {
    slug: 'thrive-tribe',
    name: 'Thrive Tribe',
    parentEntity: mudyinOperatingEntity.legalName,
    status: 'active_enquiry',
    phase: 'First-live enquiries and conversation requests',
    summary:
      'A community wellbeing and support program focused on connection, resilience, healing, and practical pathways for people seeking culturally grounded support.',
    description:
      'Thrive Tribe is included as an original Mudyin program stream for people seeking culturally grounded wellbeing support, connection, resilience, and practical next steps. First-live public requests are handled as enquiries or booking conversations; Mudyin will confirm suitability, availability, and next steps before anything is treated as booked.',
    audience:
      'Community members seeking culturally grounded wellbeing support, connection, and practical guidance.',
    enquiryTopics: [
      'Whether Thrive Tribe is the right pathway',
      'Program conversation or intake timing',
      'Group, workshop, or support options that are currently safe to discuss',
    ],
    culturalNote:
      'Public copy stays general until Mudyin confirms approved program details, dates, eligibility, and delivery scope.',
    enquiryEnabled: true,
    publicEnabled: true,
    sortOrder: 1,
  },
  {
    slug: 'young-spirit-mentoring',
    name: 'Young Spirit Mentoring',
    parentEntity: mudyinOperatingEntity.legalName,
    status: 'active_enquiry',
    phase: 'First-live enquiries and guidance requests',
    summary:
      'A youth mentoring and guidance program supporting young people through identity, confidence, cultural connection, personal growth, and positive future pathways.',
    description:
      'Young Spirit Mentoring is included as an original Mudyin program stream for young people, families, and supporters seeking mentoring, guidance, cultural connection, confidence, and positive future pathways. First-live public requests are reviewed by Mudyin before any participation, session, or activity is confirmed.',
    audience:
      'Young people, families, carers, and community supporters seeking a mentoring conversation or pathway guidance.',
    enquiryTopics: [
      'Youth mentoring conversations',
      'Family or carer enquiries',
      'Cultural connection and positive future pathway support',
    ],
    culturalNote:
      'The site does not publish unsupported eligibility, transport, dates, or child-program claims; those details must be confirmed directly by Mudyin.',
    enquiryEnabled: true,
    publicEnabled: true,
    sortOrder: 2,
  },
  {
    slug: 'culture-country',
    name: 'Culture Country',
    parentEntity: mudyinOperatingEntity.legalName,
    status: 'active_enquiry',
    phase: 'First-live enquiries and cultural learning requests',
    summary:
      'A cultural learning and Country-centred program focused on connection to culture, place, story, knowledge, and community responsibility.',
    description:
      'Culture Country is included as an original Mudyin program stream for people seeking culturally grounded learning, connection to place, story, knowledge, and community responsibility. Public requests are handled carefully and reviewed before any cultural activity, workshop, or gathering is discussed as available.',
    audience:
      'People and groups seeking an appropriate conversation about culture, Country, learning, and community connection.',
    enquiryTopics: [
      'Cultural learning enquiries',
      'Country-centred group or workshop conversations',
      'Appropriate next steps for cultural material and knowledge-sharing',
    ],
    culturalNote:
      'Cultural knowledge is not treated as generic content. Specific cultural material requires Mudyin approval and appropriate cultural authority.',
    enquiryEnabled: true,
    publicEnabled: true,
    sortOrder: 3,
  },
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
    audience:
      'Women seeking culturally safe connection, healing-centred support, and a respectful first conversation.',
    enquiryTopics: [
      "Women's Business enquiries",
      'Booking request conversations',
      'Consent, suitability, and next-step questions',
    ],
    culturalNote:
      'Cultural material is represented carefully. Public content stays general unless approved by Mudyin leadership and appropriate knowledge holders.',
    enquiryEnabled: true,
    publicEnabled: true,
    sortOrder: 4,
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
    audience:
      'People seeking future updates or a careful expression-of-interest conversation.',
    enquiryTopics: [
      'Future-stage expressions of interest',
      'Program readiness updates',
      'Questions for Mudyin before public delivery is confirmed',
    ],
    culturalNote:
      'No public claim is made that this stream is currently delivering services, transport, child programs, or clinical support.',
    enquiryEnabled: true,
    publicEnabled: true,
    sortOrder: 5,
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
    audience:
      'People seeking future updates or a careful expression-of-interest conversation.',
    enquiryTopics: [
      'Future-stage expressions of interest',
      'Program readiness updates',
      'Questions for Mudyin before public delivery is confirmed',
    ],
    culturalNote:
      'The site can receive enquiries, but it does not describe this stream as a confirmed active service.',
    enquiryEnabled: true,
    publicEnabled: true,
    sortOrder: 6,
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
