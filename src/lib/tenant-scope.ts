export type TenantScopedRecord = {
  siteId?: string | null
  tenantScope?: string | null
}

export type TenantScopeCheck =
  | { ok: true }
  | { ok: false; reason: 'missing-scope' | 'cross-tenant'; message: string }

export function assertTenantScope(
  record: TenantScopedRecord | null | undefined,
  expectedSiteId: string,
): TenantScopeCheck {
  if (!record) {
    return { ok: true }
  }

  if (!record.siteId) {
    return {
      ok: false,
      reason: 'missing-scope',
      message: 'Record is missing siteId and cannot be safely served from a white-label surface.',
    }
  }

  if (record.siteId !== expectedSiteId) {
    return {
      ok: false,
      reason: 'cross-tenant',
      message: `Record belongs to ${record.siteId}, not ${expectedSiteId}.`,
    }
  }

  return { ok: true }
}

export function withTenantWhere<TWhere extends Record<string, unknown>>(
  where: TWhere,
  siteId: string,
): TWhere & { siteId: string } {
  return { ...where, siteId }
}

