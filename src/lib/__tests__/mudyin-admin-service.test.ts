import { canCreateAdminUsers, createAdminUserSchema } from '../admin-service'

describe('Mudyin admin role controls', () => {
  it('allows only super_admin to create admin users', () => {
    expect(canCreateAdminUsers('super_admin')).toBe(true)
    expect(canCreateAdminUsers('admin')).toBe(false)
    expect(canCreateAdminUsers('editor')).toBe(false)
    expect(canCreateAdminUsers(undefined)).toBe(false)
  })

  it('does not allow routine admin creation to mint another super_admin', () => {
    expect(
      createAdminUserSchema.safeParse({
        email: 'ops@mudyin.local',
        name: 'Ops Admin',
        role: 'admin',
        scope: ['mudyin'],
      }).success,
    ).toBe(true)

    expect(
      createAdminUserSchema.safeParse({
        email: 'super@mudyin.local',
        name: 'Extra Super Admin',
        role: 'super_admin',
        scope: ['mudyin'],
      }).success,
    ).toBe(false)
  })
})
