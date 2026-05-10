import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

const prisma = new PrismaClient()
const { hash } = bcrypt

const bootstrapEmail = process.env.MUDYIN_BOOTSTRAP_ADMIN_EMAIL || 'bootstrap.admin@mudyin.local'
const adminLoginUrl = process.env.MUDYIN_ADMIN_LOGIN_URL || 'http://localhost:3000/admin/login'
const outputPath = path.resolve(process.cwd(), '.local', 'mudyin-bootstrap-admin.txt')

const programStreams = [
  {
    slug: 'womens-business',
    name: "Mudyin Women's Business",
    parentEntity: 'MUDYIN PTY LTD',
    status: 'active_enquiry',
    phase: 'First-live intake and enquiry pathway',
    summary:
      "A culturally grounded women's wellbeing stream under MUDYIN PTY LTD, opening through careful enquiry and relationship-led intake.",
    description:
      "Mudyin Women's Business is the first-live stream for women seeking culturally safe connection, healing-centred support, and respectful pathways into Mudyin activities. Enquiries and booking requests are reviewed before any session is confirmed.",
    culturalNote:
      'Cultural material remains general unless approved by Mudyin leadership and appropriate knowledge holders.',
    enquiryEnabled: true,
    publicEnabled: true,
    sortOrder: 1,
  },
  {
    slug: 'aaliyahs-dreaming',
    name: "Aaliyah's Dreaming",
    parentEntity: 'MUDYIN PTY LTD',
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
    parentEntity: 'MUDYIN PTY LTD',
    status: 'future_phase',
    phase: 'Future stream - not yet open for public delivery',
    summary:
      'A future Mudyin sub-program stream held under the parent operating entity until its rollout requirements are approved.',
    description:
      "Mirabella's Dreaming is part of the staged Mudyin program model. It remains in future-phase public language until leadership confirms delivery model, safeguards, approvals, and resourcing.",
    culturalNote:
      'The site can receive enquiries, but it does not describe this stream as a confirmed active service.',
    enquiryEnabled: true,
    publicEnabled: true,
    sortOrder: 3,
  },
]

const sitePages = [
  {
    slug: 'governance',
    title: 'Governance and Transparency',
    body:
      'Mudyin operates under MUDYIN PTY LTD with controlled program approvals, document control, consent, incident, complaints, risk, partnership, and spending delegation pathways.',
    status: 'published',
    version: 1,
    ownerRole: 'super_admin',
  },
  {
    slug: 'programs',
    title: 'Programs and Streams',
    body:
      'Mudyin presents Womens Business, Aaliyahs Dreaming, and Mirabellas Dreaming as sub-program streams under the parent operating entity. Future-phase streams must not be represented as live delivery until approved.',
    status: 'published',
    version: 1,
    ownerRole: 'admin',
  },
]

function makePassword() {
  return [
    crypto.randomBytes(9).toString('base64url'),
    crypto.randomBytes(9).toString('base64url'),
    crypto.randomBytes(9).toString('base64url'),
  ].join('-')
}

async function upsertOperationalRecords() {
  for (const stream of programStreams) {
    await prisma.programStream.upsert({
      where: { slug: stream.slug },
      update: stream,
      create: stream,
    })
  }

  for (const page of sitePages) {
    await prisma.sitePage.upsert({
      where: { slug: page.slug },
      update: {
        ...page,
        lastReviewedAt: new Date(),
        publishedAt: page.status === 'published' ? new Date() : null,
      },
      create: {
        ...page,
        lastReviewedAt: new Date(),
        publishedAt: page.status === 'published' ? new Date() : null,
      },
    })
  }
}

async function provisionBootstrapAdmin() {
  const activeSuperAdmins = await prisma.adminProfile.findMany({
    where: { role: 'super_admin', status: 'active' },
    include: { user: true },
    orderBy: { createdAt: 'asc' },
  })

  if (activeSuperAdmins.length > 1) {
    throw new Error(
      `Refusing to seed bootstrap admin because ${activeSuperAdmins.length} active super_admin accounts already exist.`
    )
  }

  const tempPassword = makePassword()
  const passwordHash = await hash(tempPassword, 12)
  let userId
  let email
  let mode

  if (activeSuperAdmins.length === 1) {
    const existing = activeSuperAdmins[0]
    userId = existing.userId
    email = existing.user.email
    mode = 'rotated_existing_super_admin'

    await prisma.user.update({
      where: { id: userId },
      data: {
        password: passwordHash,
        name: existing.user.name || 'Bootstrap Super Admin',
      },
    })

    await prisma.adminProfile.update({
      where: { id: existing.id },
      data: {
        bootstrap: true,
        status: 'active',
        role: 'super_admin',
        scope: ['mudyin'],
        mustChangePassword: true,
      },
    })
  } else {
    email = bootstrapEmail
    mode = 'created_bootstrap_super_admin'

    const user = await prisma.user.upsert({
      where: { email },
      update: {
        password: passwordHash,
        name: 'Bootstrap Super Admin',
        dateOfBirth: new Date('1990-01-01T00:00:00.000Z'),
        ageGroup: '26+',
      },
      create: {
        email,
        password: passwordHash,
        name: 'Bootstrap Super Admin',
        dateOfBirth: new Date('1990-01-01T00:00:00.000Z'),
        ageGroup: '26+',
      },
    })

    userId = user.id

    await prisma.adminProfile.upsert({
      where: { userId },
      update: {
        role: 'super_admin',
        status: 'active',
        scope: ['mudyin'],
        mustChangePassword: true,
        bootstrap: true,
      },
      create: {
        userId,
        role: 'super_admin',
        status: 'active',
        scope: ['mudyin'],
        mustChangePassword: true,
        bootstrap: true,
      },
    })
  }

  await prisma.auditLog.create({
    data: {
      userId,
      action: 'mudyin_bootstrap_super_admin_seeded',
      details: {
        mode,
        email,
        firstLoginPasswordReset: true,
        outputPath,
      },
    },
  })

  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(
    outputPath,
    [
      'Mudyin bootstrap super admin credentials',
      `Generated at: ${new Date().toISOString()}`,
      `Admin login URL: ${adminLoginUrl}`,
      `Production admin URL: https://www.mudyin.com/admin/login`,
      `Email: ${email}`,
      `Temporary password: ${tempPassword}`,
      'First-login password reset enforced: yes',
      'Additional admin creation pathway: log in as this super_admin, rotate password, open /admin/users, create admin/editor account.',
      '',
    ].join('\n'),
    { encoding: 'utf8' }
  )

  return { email, tempPassword, mode, outputPath }
}

try {
  await upsertOperationalRecords()
  const result = await provisionBootstrapAdmin()
  console.log(JSON.stringify({ ok: true, ...result }, null, 2))
} finally {
  await prisma.$disconnect()
}
