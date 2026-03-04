// ─── Static Content Data ─────────────────────────────────────────────────────
// Single source of truth for all site content.
// When Sanity CMS is connected, these objects inform the schema structure.
// ─────────────────────────────────────────────────────────────────────────────

export const siteConfig = {
  name:        'Mudyin Aboriginal Healing Centre',
  shortName:   'Mudyin',
  tagline:     'Two Worlds Strong',
  description: 'Healing, empowering, and connecting Aboriginal communities through the Young Spirit Mentoring Program and culturally grounded healing services.',
  url:         'https://mudyin.org.au',
  email:       'info@mudyin.org.au',
  phone:       '0478 796 298',
  abn:         '00 000 000 000', // Update with correct ABN
  acnc:        'https://www.acnc.gov.au', // Update with ACNC listing
  address: {
    line1:    'Campbelltown Park',
    suburb:   'Campbelltown',
    state:    'NSW',
    postcode: '2560',
    country:  'Australia',
  },
  social: {
    facebook:  'https://facebook.com/mudyin',
    instagram: 'https://instagram.com/mudyin',
    youtube:   'https://youtube.com/@mudyin',
  },
  founders: {
    founder: 'Uncle Dave Bell',
    ceo:     'Kaiyu Bayles',
  },
}

// ─── Stats ───────────────────────────────────────────────────────────────────
export const heroStats = [
  { label: 'Years of Service',       value: 25,   suffix: '+' },
  { label: 'Lives Transformed',      value: 5000, suffix: '+' },
  { label: 'Weekly Participants',    value: 50,   suffix: '+' },
  { label: 'Active Programs',        value: 15,   suffix: '+' },
]

// ─── Programs ────────────────────────────────────────────────────────────────
export type Program = {
  id:               string
  name:             string
  slug:             string
  tagline:          string
  shortDescription: string
  description:      string
  image:            string
  imageAlt:         string
  schedule:         string[]
  location:         string
  targetAudience:   string
  features:         string[]
  outcomes:         string[]
  enrollmentOpen:   boolean
  color:            string
  minAge?:          number
  maxAge?:          number
}

export const programs: Program[] = [
  {
    id:               'ysmp',
    name:             'Young Spirit Mentoring Program',
    slug:             'ysmp',
    tagline:          'YSMP',
    shortDescription: 'Multicultural fitness, breakfast, and mentorship sessions building strength, community, and cultural pride in Aboriginal youth.',
    description:      `The Young Spirit Mentoring Program (YSMP) is Mudyin's flagship initiative — 25 years in the making. Every Monday, Wednesday, and Friday morning, Aboriginal youth gather at Campbelltown Park for more than a workout. They gather for community.\n\nThrough early morning fitness sessions, shared breakfast, and structured mentorship, YSMP builds the physical, emotional, and cultural foundations that young people need to thrive. School engagement check-ins, cultural learning, and consistent adult relationships form the backbone of a program that has transformed thousands of lives.`,
    image:            '/images/ysmp-fitness.jpg',
    imageAlt:         'YSMP participants completing a morning fitness session at Campbelltown Park',
    schedule:         ['Monday 6:00 AM – 7:00 AM', 'Wednesday 6:00 AM – 7:00 AM', 'Friday 6:00 AM – 7:00 AM'],
    location:         'Campbelltown Park, NSW',
    targetAudience:   'Aboriginal youth aged 12–25',
    features: [
      'Morning fitness & conditioning',
      'Shared communal breakfast',
      'One-on-one mentorship',
      'School attendance support',
      'Cultural learning activities',
      'Leadership development',
    ],
    outcomes: [
      'Improved physical health and fitness',
      'Stronger cultural identity and pride',
      'Better school attendance and engagement',
      'Positive peer relationships and community belonging',
      'Pathways to employment and further education',
    ],
    enrollmentOpen: true,
    color:          '#d2a855',
    minAge:         12,
    maxAge:         25,
  },
  {
    id:               'thrive-tribe',
    name:             'Thrive Tribe',
    slug:             'thrive-tribe',
    tagline:          'Fitness & Wellness',
    shortDescription: 'A holistic 9-day wellness program combining fitness, nutrition, and cultural healing for Aboriginal community members of all ages.',
    description:      `Thrive Tribe is Mudyin's expanding wellness initiative — a 9-day intensive program that meets people where they are and walks with them toward wholeness. More than fitness, it's a holistic journey that weaves together physical conditioning, nutritional education, mental health support, and cultural healing practices.\n\nNow expanding into Queensland with new sessions on North Stradbroke Island, Thrive Tribe is growing its reach to ensure more communities can access culturally grounded health and wellbeing support.`,
    image:            '/images/thrive-tribe.jpg',
    imageAlt:         'Thrive Tribe participants in a group wellness session, smiling and supporting each other',
    schedule:         ['9-day intensive program — enquire for next intake dates'],
    location:         'Campbelltown NSW & North Stradbroke Island QLD',
    targetAudience:   'Aboriginal community members, all ages welcome',
    features: [
      '9-day structured wellness program',
      'Holistic fitness and nutrition',
      'Mental health and emotional wellbeing',
      'Cultural healing practices',
      'Group support and accountability',
      'On-country connection activities',
    ],
    outcomes: [
      'Improved overall health markers',
      'Sustainable healthy habits',
      'Stronger community connections',
      'Reduced isolation and improved mental health',
      'Cultural reconnection and healing',
    ],
    enrollmentOpen: true,
    color:          '#9DC183',
  },
  {
    id:               'healing-centre',
    name:             'Healing Centre Services',
    slug:             'healing-centre',
    tagline:          'Healing Services',
    shortDescription: 'Culturally safe healing and counselling services, delivered by Aboriginal practitioners who understand your community, your Country, and your story.',
    description:      `The Mudyin Aboriginal Healing Centre offers a safe, confidential, and culturally grounded space for healing. Our practitioners — many of whom are Aboriginal community members themselves — deliver a range of therapeutic and support services that honour both contemporary clinical best practice and traditional healing wisdom.\n\nFrom individual counselling to cultural healing sessions, group therapy, and Elder consultation, our Healing Centre walks alongside people on their journey toward wellbeing. No matter where you are on that journey, you are welcome here.`,
    image:            '/images/healing-services.jpg',
    imageAlt:         'A calm, welcoming healing centre space with natural elements and warm lighting',
    schedule:         ['Monday – Friday: 9:00 AM – 5:00 PM', 'After-hours available by appointment'],
    location:         'Campbelltown, NSW',
    targetAudience:   'Aboriginal community members seeking healing and support',
    features: [
      'Individual counselling and therapy',
      'Cultural healing sessions',
      'Group therapy and support circles',
      'Elder consultation and guidance',
      'Family support services',
      'Crisis support referrals',
    ],
    outcomes: [
      'Improved mental health and emotional wellbeing',
      'Cultural healing and reconnection',
      'Stronger family and community relationships',
      'Access to appropriate referral pathways',
      'Empowerment and self-determination',
    ],
    enrollmentOpen: true,
    color:          '#8B2500',
  },
]

// ─── Impact Metrics ───────────────────────────────────────────────────────────
export const impactMetrics = [
  {
    label:       'Youth Empowerment',
    stat:        '5,000+',
    description: 'Young Aboriginal lives transformed through mentoring, fitness, and cultural connection.',
    image:       '/images/youth-empowerment.jpg',
    imageAlt:    'Aboriginal youth celebrating together at a YSMP program session',
  },
  {
    label:       'Community Gatherings',
    stat:        '200+',
    description: 'Cultural and community events bringing families together to heal, celebrate, and connect on Country.',
    image:       '/images/community-gathering.jpg',
    imageAlt:    'Mudyin community gathering with families participating in cultural activities',
  },
  {
    label:       'Healing & Wellbeing',
    stat:        '1,000+',
    description: 'Counselling and healing sessions delivered in a culturally safe environment by Aboriginal practitioners.',
    image:       '/images/healing-services.jpg',
    imageAlt:    'Healing centre practitioner providing culturally safe support to a community member',
  },
]

// ─── Timeline ─────────────────────────────────────────────────────────────────
export const timeline = [
  { year: '2001', title: 'Father & Sons Program', description: 'Uncle Dave Bell establishes the Father & Sons Program — the seed of what would become Mudyin.' },
  { year: '2005', title: 'Community Expansion',   description: 'Program grows as more families seek culturally grounded support. Partnerships with local services established.' },
  { year: '2010', title: 'YSMP Launched',         description: 'The Young Spirit Mentoring Program formally launches, providing structured mentoring and fitness for Aboriginal youth.' },
  { year: '2015', title: 'Thrive Tribe Begins',   description: 'Thrive Tribe wellness program launches, expanding Mudyin\'s reach to holistic health and community wellbeing.' },
  { year: '2020', title: 'Mudyin Opens',           description: 'The Mudyin Aboriginal Healing Centre opens its doors, unifying all programs under one culturally grounded home.' },
  { year: '2026', title: 'Growing Our Reach',     description: 'Expanding to Queensland, launching this digital platform, and reaching more communities than ever before.' },
]

// ─── Testimonials ─────────────────────────────────────────────────────────────
export const testimonials = [
  {
    id:      '1',
    name:    'Sarah M.',
    role:    'YSMP Parent',
    quote:   "YSMP transformed my son. He's up at 5:30 AM without complaint — something I never thought I'd see. More than the fitness, it's the sense of belonging he's found. He talks about his mentors like family.",
    program: 'YSMP',
    rating:  5,
    consent: true,
  },
  {
    id:      '2',
    name:    'Marcus T.',
    role:    'YSMP Participant',
    quote:   "The mentors really care about us — not just showing up, but who we are and where we're going. I've got goals now. I'm thinking about my future in a way I never was before.",
    program: 'YSMP',
    rating:  5,
    consent: true,
  },
  {
    id:      '3',
    name:    'Aunty June',
    role:    'Community Elder',
    quote:   "What Mudyin does for our young people is deadly. They're not just keeping our kids off the streets — they're building warriors. Strong in body, strong in culture, strong in spirit.",
    program: 'Community',
    rating:  5,
    consent: true,
  },
]

// ─── News Articles ────────────────────────────────────────────────────────────
export type NewsArticle = {
  id:          string
  title:       string
  slug:        string
  excerpt:     string
  content:     string
  category:    string
  publishedAt: string
  image:       string
  imageAlt:    string
  author:      string
}

export const newsArticles: NewsArticle[] = [
  {
    id:          '1',
    title:       'YSMP Celebrates 25 Years of Transforming Lives',
    slug:        'ysmp-25-year-anniversary',
    excerpt:     'Twenty-five years ago, a father saw his son and other young men drifting without direction. What he started then — with nothing but community belief and early morning light — is today the Young Spirit Mentoring Program.',
    content:     `Twenty-five years ago, Uncle Dave Bell watched Aboriginal youth in his community struggle to find direction and belonging. With the deep knowledge that community, culture, and connection were the answer, he began what would become the Young Spirit Mentoring Program.\n\nToday, YSMP has touched more than 5,000 lives. Young people who once had no reason to get up early are now rising before dawn — to exercise, to share breakfast, to be with their mob.\n\n"The goal was always simple," Uncle Dave says. "Get them up, get them moving, get them together. The rest follows."\n\nAs we mark 25 years, we celebrate not just what has been built, but everyone who built it — the mentors, the families, the Elders, the community.`,
    category:    'Milestone',
    publishedAt: '2026-02-10',
    image:       '/images/community-gathering.jpg',
    imageAlt:    'YSMP community celebration marking 25 years of the program',
    author:      'Mudyin Communications',
  },
  {
    id:          '2',
    title:       'Thrive Tribe Expands to Queensland',
    slug:        'thrive-tribe-expands-queensland',
    excerpt:     'Mudyin\'s Thrive Tribe wellness program is growing its reach — bringing holistic, culturally grounded health support to communities on North Stradbroke Island, QLD.',
    content:     `The success of Thrive Tribe in NSW has opened doors. Mudyin is proud to announce the expansion of the program to North Stradbroke Island (Minjerribah), Queensland, bringing its unique blend of fitness, nutrition, cultural healing, and community to a new mob.\n\n"Health doesn't look the same for everyone, and it shouldn't," says CEO Kaiyu Bayles. "Thrive Tribe meets people where they are. That approach works — and it works even better on Country."\n\nThe Queensland intake will begin in the coming months. Enquire via our contact page to express interest.`,
    category:    'Programs',
    publishedAt: '2026-01-28',
    image:       '/images/thrive-tribe.jpg',
    imageAlt:    'Thrive Tribe participants on North Stradbroke Island, Queensland',
    author:      'Mudyin Communications',
  },
  {
    id:          '3',
    title:       'Cultural Camp Connects Youth to Country',
    slug:        'cultural-camp-country-connection',
    excerpt:     'Forty young YSMP participants recently returned from a three-day cultural camp — an on-Country experience of traditional dance, language, land management, and Elder storytelling.',
    content:     `Forty YSMP participants recently spent three days on Country for Mudyin's first major cultural camp of 2026. Guided by Elders and cultural practitioners, the young people engaged in traditional dance, language sessions, land management activities, and evening storytelling circles.\n\n"Seeing these kids on Country — you can't put it into words," said one mentor. "Something shifts in them. They stand differently. They breathe differently. They remember who they are."\n\nCultural connection is not a supplement to Mudyin's work — it is the foundation of everything we do.`,
    category:    'Culture',
    publishedAt: '2026-01-15',
    image:       '/images/culture-country.jpg',
    imageAlt:    'YSMP youth participating in a traditional cultural activity on Country with an Elder guide',
    author:      'Mudyin Communications',
  },
  {
    id:          '4',
    title:       'Leadership Pathways Program Launches',
    slug:        'leadership-pathways-program-launch',
    excerpt:     'Mudyin introduces Leadership Pathways — a new stream within YSMP connecting Aboriginal youth with employment, education, and leadership opportunities.',
    content:     `Mudyin has launched Leadership Pathways, a new stream within YSMP designed to bridge the gap between youth engagement and long-term opportunity. The program connects participants with traineeships, further education, mentored work experience, and structured leadership development.\n\n"We've always known our young people have what it takes," says Kaiyu Bayles. "Leadership Pathways just makes sure the doors are open when they're ready to walk through them."\n\nApplications for the first cohort are now open. Contact us to find out more.`,
    category:    'Programs',
    publishedAt: '2025-12-20',
    image:       '/images/youth-empowerment.jpg',
    imageAlt:    'Young Aboriginal leader presenting to peers in a Leadership Pathways workshop session',
    author:      'Mudyin Communications',
  },
]

// ─── Team Members ─────────────────────────────────────────────────────────────
export const teamMembers = [
  {
    id:               'uncle-dave',
    name:             'Uncle Dave Bell',
    role:             'Founder',
    category:         'leadership',
    bio:              'Uncle Dave Bell founded the Father & Sons Program in 2001 — the seed that became Mudyin. For 25 years, he has dedicated his life to ensuring Aboriginal youth in his community have the mentorship, cultural grounding, and community belonging they need to thrive.',
    quote:            'The goal is to establish a routine — get them up, get them moving, get them together. Everything else grows from there.',
    image:            '/images/founder-photo.jpg',
    imageAlt:         'Uncle Dave Bell, Founder of Mudyin Aboriginal Healing Centre',
    culturalAuthority: 'Campbelltown Region',
  },
  {
    id:               'kaiyu',
    name:             'Kaiyu Bayles',
    role:             'Chief Executive Officer',
    category:         'leadership',
    bio:              'Kaiyu Bayles leads Mudyin with a deep commitment to Indigenous self-determination and community-led healing. Under her leadership, Mudyin has grown from a local program into a regional service with national reach.',
    quote:            "If we want our children to have any kind of life, we have to invest in them now — with culture, with community, and with everything we've got.",
    image:            '/images/founder-photo.jpg',
    imageAlt:         'Kaiyu Bayles, CEO of Mudyin Aboriginal Healing Centre',
    culturalAuthority: undefined,
  },
]

// ─── Donors & Partners ───────────────────────────────────────────────────────
export const donationAmounts = [25, 50, 100, 250, 500]

export const impactMessages: Record<number, string> = {
  25:  'provides breakfast for 5 YSMP participants for a week',
  50:  'funds 2 mentoring sessions for an Aboriginal youth',
  100: 'covers transport costs for a cultural camp day trip',
  250: "supports a young person's full month in the YSMP program",
  500: 'funds a week of daily programming for the entire YSMP cohort',
}

// ─── Navigation ───────────────────────────────────────────────────────────────
export const navLinks = [
  {
    label: 'About',
    href:  '/about/our-story',
    children: [
      { label: 'Our Story',  href: '/about/our-story' },
      { label: 'Our Team',   href: '/about/team' },
      { label: 'Partners',   href: '/about/partners' },
    ],
  },
  {
    label: 'Programs',
    href:  '/programs',
    children: [
      { label: 'Young Spirit Mentoring (YSMP)', href: '/programs/ysmp' },
      { label: 'Thrive Tribe',                  href: '/programs/thrive-tribe' },
      { label: 'Healing Centre',                href: '/programs/healing-centre' },
    ],
  },
  { label: 'Impact',     href: '/impact' },
  { label: 'News',       href: '/news' },
  { label: 'Gallery',    href: '/gallery' },
  {
    label: 'Community',
    href:  '/community',
    children: [
      { label: 'Community Hub',   href: '/community' },
      { label: 'Program Communities', href: '/community/programs' },
      { label: 'Member Directory', href: '/community/members' },
      { label: 'Create Post',      href: '/community/create' },
    ],
  },
  {
    label: 'Marketplace',
    href: '/marketplace',
    children: [
      { label: 'Browse Marketplace', href: '/marketplace' },
      { label: 'Merchant Dashboard', href: '/marketplace/merchant' },
      { label: 'Order History', href: '/marketplace/orders' },
    ],
  },
  { label: 'Resources',  href: '/resources' },
  { label: 'Contact',    href: '/contact' },
]

// ─── FAQs ─────────────────────────────────────────────────────────────────────
export const faqs = [
  {
    category: 'Programs',
    question: 'Who can participate in YSMP?',
    answer:   'YSMP is open to Aboriginal and Torres Strait Islander youth aged 12–25. We welcome all young people regardless of background or fitness level.',
  },
  {
    category: 'Programs',
    question: 'Is YSMP free to join?',
    answer:   'Yes. YSMP is free for eligible participants. The program is community-funded and supported by donations and government grants.',
  },
  {
    category: 'Programs',
    question: 'What do participants need to bring?',
    answer:   'Just themselves and a willingness to show up! Comfortable exercise clothes and runners are helpful. Breakfast is provided.',
  },
  {
    category: 'Enrollment',
    question: 'How long does enrollment take?',
    answer:   'Our online enrollment form takes about 10–15 minutes to complete. Once submitted, our team reviews applications within 2–3 business days.',
  },
  {
    category: 'Enrollment',
    question: 'Is parental consent required for under-18s?',
    answer:   'Yes. Participants under 18 require a parent or guardian to complete the consent section of the enrollment form. A digital signature is accepted.',
  },
  {
    category: 'Donations',
    question: 'Are donations tax-deductible?',
    answer:   'Mudyin holds Deductible Gift Recipient (DGR) status. All donations of $2 or more are tax-deductible. You will receive an official receipt automatically.',
  },
  {
    category: 'Donations',
    question: 'Can I set up a recurring donation?',
    answer:   'Yes. You can choose to make a monthly recurring donation from our Donate page. You can cancel or change your giving amount at any time.',
  },
  {
    category: 'Cultural',
    question: 'How does Mudyin respect cultural protocols?',
    answer:   'All program content is developed with community Elders and reflects Aboriginal cultural values. Our ICIP (Indigenous Cultural and Intellectual Property) page outlines our protocols in full.',
  },
]

// ─── Events ───────────────────────────────────────────────────────────────────
export const events = [
  {
    id:          'e1',
    title:       'YSMP Morning Session — Open Day',
    date:        '2026-03-02',
    time:        '6:00 AM – 7:30 AM',
    location:    'Campbelltown Park, NSW',
    description: 'Come and experience a YSMP morning session. Open to all — no experience needed. Just bring yourself.',
    category:    'YSMP',
    capacity:    50,
    spotsLeft:   23,
  },
  {
    id:          'e2',
    title:       'Thrive Tribe Intake — Queensland Cohort',
    date:        '2026-03-15',
    time:        '8:00 AM',
    location:    'North Stradbroke Island, QLD',
    description: '9-day Thrive Tribe wellness program begins. Registration required.',
    category:    'Thrive Tribe',
    capacity:    20,
    spotsLeft:   8,
  },
  {
    id:          'e3',
    title:       'Cultural Camp — On Country',
    date:        '2026-04-10',
    time:        '3 days — commencing Friday',
    location:    'To be confirmed',
    description: 'Annual cultural camp for YSMP participants. Traditional dance, language, land management, and Elder storytelling.',
    category:    'Cultural',
    capacity:    40,
    spotsLeft:   12,
  },
]

// ─── Resources ────────────────────────────────────────────────────────────────
export const resources = [
  {
    id:          'r1',
    title:       'YSMP Program Information Pack',
    description: 'Everything families and young people need to know about YSMP — schedule, eligibility, what to bring, and how to enroll.',
    category:    'Programs',
    fileType:    'PDF',
    accessLevel: 'public',
    slug:        'ysmp-info-pack',
  },
  {
    id:          'r2',
    title:       'Thrive Tribe Wellness Guide',
    description: 'An overview of the Thrive Tribe 9-day program, with nutrition tips, what to expect, and preparation advice.',
    category:    'Programs',
    fileType:    'PDF',
    accessLevel: 'public',
    slug:        'thrive-tribe-guide',
  },
  {
    id:          'r3',
    title:       'ICIP Cultural Protocols — Community Guide',
    description: 'A plain-language guide to Mudyin\'s Indigenous Cultural and Intellectual Property protocols.',
    category:    'Cultural',
    fileType:    'PDF',
    accessLevel: 'public',
    slug:        'icip-community-guide',
  },
]
