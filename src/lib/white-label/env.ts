import { validateWhiteLabelRegistry } from './site-registry'

export type EnvCheckSeverity = 'error' | 'warn'

export type EnvCheck = {
  name: string
  severity: EnvCheckSeverity
  message: string
  remediation: string
}

export type RuntimeEnvMode = 'runtime' | 'readiness' | 'control'

const PRODUCTION_REQUIRED = [
  'DATABASE_URL',
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET',
] as const

const CONTROL_REQUIRED = ['CONTROL_PLANE_SECRET'] as const

const OPTIONAL_OPERATIONAL = [
  'RESEND_API_KEY',
  'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'NEXT_PUBLIC_PLAUSIBLE_DOMAIN',
  'NEXT_PUBLIC_GA_MEASUREMENT_ID',
  'NEXT_PUBLIC_SITE_SLUG',
  'NEXT_PUBLIC_TENANT_KEY',
  'NEXT_PUBLIC_API_BASE_URL',
  'NEXT_PUBLIC_PUBLIC_SITE_URL',
  'ANU_PUBLIC_ENQUIRIES_ENDPOINT',
  'ANU_PUBLIC_BOOKING_REQUEST_ENDPOINT',
] as const

function isMissing(value: string | undefined): boolean {
  return !value || value.trim() === '' || value.includes('REPLACE_WITH') || value.includes('generate_with')
}

export function validateRuntimeEnvironment(
  env: NodeJS.ProcessEnv = process.env,
  mode: RuntimeEnvMode = 'runtime',
): EnvCheck[] {
  const checks: EnvCheck[] = []
  const isProduction = env.NODE_ENV === 'production'

  const required = new Set<string>()
  if (isProduction || mode === 'readiness') {
    PRODUCTION_REQUIRED.forEach((name) => required.add(name))
  }
  if (mode === 'control') {
    CONTROL_REQUIRED.forEach((name) => required.add(name))
  }

  for (const name of required) {
    if (isMissing(env[name])) {
      checks.push({
        name,
        severity: 'error',
        message: `${name} is required for ${mode === 'control' ? 'control-plane' : 'production'} runtime.`,
        remediation: `Set ${name} in Vercel Project Settings -> Environment Variables for Production and Preview.`,
      })
    }
  }

  for (const name of OPTIONAL_OPERATIONAL) {
    if (isMissing(env[name])) {
      checks.push({
        name,
        severity: 'warn',
        message: `${name} is not configured; related features will run in degraded or disabled mode.`,
        remediation: `Set ${name} if the related feature is part of the launch scope.`,
      })
    }
  }

  for (const issue of validateWhiteLabelRegistry()) {
    checks.push({
      name: `site:${issue.siteId}:${issue.field}`,
      severity: 'error',
      message: issue.message,
      remediation: `Fix ${issue.field} in the white-label site registry.`,
    })
  }

  return checks
}

export function summarizeEnvChecks(checks: EnvCheck[]) {
  return {
    ok: checks.every((check) => check.severity !== 'error'),
    errors: checks.filter((check) => check.severity === 'error'),
    warnings: checks.filter((check) => check.severity === 'warn'),
  }
}
