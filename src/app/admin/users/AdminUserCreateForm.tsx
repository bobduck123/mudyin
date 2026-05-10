'use client'

import { FormEvent, useState } from 'react'

type CreatedAdmin = {
  email: string
  temporaryPassword: string
}

export function AdminUserCreateForm() {
  const [createdAdmin, setCreatedAdmin] = useState<CreatedAdmin | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setCreatedAdmin(null)
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    const payload = {
      email: String(formData.get('email') || ''),
      name: String(formData.get('name') || ''),
      role: String(formData.get('role') || 'admin'),
      scope: ['mudyin'],
    }

    const response = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await response.json()
    setLoading(false)

    if (!response.ok || !data.success) {
      setError(data.error || 'Admin user could not be created.')
      return
    }

    setCreatedAdmin({
      email: data.user.email,
      temporaryPassword: data.temporaryPassword,
    })
    event.currentTarget.reset()
  }

  return (
    <form onSubmit={onSubmit} className="card-dark rounded-2xl p-6 healing-border">
      <h2 className="text-xl font-semibold text-white">Create admin account</h2>
      <p className="mt-2 text-sm leading-6 text-white/60">
        New admins receive a temporary password and must rotate it on first login.
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-white/80">
            Name
          </label>
          <input id="name" name="name" required className="mt-2 w-full rounded-lg border border-white/15 bg-white/8 px-3 py-2 text-white" />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-white/80">
            Email
          </label>
          <input id="email" name="email" type="email" required className="mt-2 w-full rounded-lg border border-white/15 bg-white/8 px-3 py-2 text-white" />
        </div>
        <div>
          <label htmlFor="role" className="block text-sm font-semibold text-white/80">
            Role
          </label>
          <select id="role" name="role" defaultValue="admin" className="mt-2 w-full rounded-lg border border-white/15 bg-white/8 px-3 py-2 text-white">
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
          </select>
        </div>
      </div>
      <button type="submit" className="btn-primary mt-6" disabled={loading}>
        {loading ? 'Creating...' : 'Create admin'}
      </button>
      {error && <p role="alert" className="mt-4 rounded-lg border border-clay-300/40 bg-clay-900/40 px-4 py-3 text-sm text-clay-100">{error}</p>}
      {createdAdmin && (
        <div className="mt-4 rounded-lg border border-sage-300/30 bg-sage-900/35 px-4 py-3 text-sm text-sage-50">
          Created {createdAdmin.email}. Temporary password: <code>{createdAdmin.temporaryPassword}</code>
        </div>
      )}
    </form>
  )
}
