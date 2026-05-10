'use client'

import { FormEvent, useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setLoading(true)

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError('The admin email or password was not accepted.')
      setLoading(false)
      return
    }

    const response = await fetch('/api/admin/me')
    if (!response.ok) {
      setError('This account is not authorised for Mudyin admin access.')
      setLoading(false)
      return
    }

    const data = await response.json()
    router.replace(data.admin?.mustChangePassword ? '/admin/first-login' : '/admin')
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-white/80">
          Admin email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-2 w-full rounded-lg border border-white/15 bg-white/8 px-4 py-3 text-white outline-none focus:border-sage-400"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-semibold text-white/80">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-2 w-full rounded-lg border border-white/15 bg-white/8 px-4 py-3 text-white outline-none focus:border-sage-400"
        />
      </div>
      {error && (
        <p role="alert" className="rounded-lg border border-clay-300/40 bg-clay-900/40 px-4 py-3 text-sm text-clay-100">
          {error}
        </p>
      )}
      <button type="submit" className="btn-primary w-full" disabled={loading}>
        {loading ? 'Checking access...' : 'Log in'}
      </button>
    </form>
  )
}
