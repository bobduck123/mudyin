'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'

export function PasswordResetForm() {
  const router = useRouter()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setLoading(true)

    const response = await fetch('/api/admin/password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword, newPassword }),
    })

    const data = await response.json()
    if (!response.ok || !data.success) {
      setError(data.error || 'Password could not be updated.')
      setLoading(false)
      return
    }

    router.replace('/admin')
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label htmlFor="currentPassword" className="block text-sm font-semibold text-white/80">
          Temporary password
        </label>
        <input
          id="currentPassword"
          name="currentPassword"
          type="password"
          autoComplete="current-password"
          required
          value={currentPassword}
          onChange={(event) => setCurrentPassword(event.target.value)}
          className="mt-2 w-full rounded-lg border border-white/15 bg-white/8 px-4 py-3 text-white outline-none focus:border-sage-400"
        />
      </div>
      <div>
        <label htmlFor="newPassword" className="block text-sm font-semibold text-white/80">
          New password
        </label>
        <input
          id="newPassword"
          name="newPassword"
          type="password"
          autoComplete="new-password"
          required
          minLength={14}
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
          className="mt-2 w-full rounded-lg border border-white/15 bg-white/8 px-4 py-3 text-white outline-none focus:border-sage-400"
        />
      </div>
      {error && (
        <p role="alert" className="rounded-lg border border-clay-300/40 bg-clay-900/40 px-4 py-3 text-sm text-clay-100">
          {error}
        </p>
      )}
      <button type="submit" className="btn-primary w-full" disabled={loading}>
        {loading ? 'Updating...' : 'Set new password'}
      </button>
    </form>
  )
}
