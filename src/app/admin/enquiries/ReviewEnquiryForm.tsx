'use client'

import { FormEvent, useState } from 'react'

export function ReviewEnquiryForm({ enquiryId, currentStatus }: { enquiryId: string; currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus)
  const [adminNotes, setAdminNotes] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage('')
    setLoading(true)

    const response = await fetch(`/api/admin/enquiries/${enquiryId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, adminNotes }),
    })

    const data = await response.json()
    setLoading(false)
    setMessage(response.ok && data.success ? 'Review saved.' : data.error || 'Review could not be saved.')
  }

  return (
    <form onSubmit={onSubmit} className="mt-5 grid gap-3 md:grid-cols-[180px_1fr_auto]">
      <label className="sr-only" htmlFor={`status-${enquiryId}`}>
        Review status
      </label>
      <select
        id={`status-${enquiryId}`}
        value={status}
        onChange={(event) => setStatus(event.target.value)}
        className="rounded-lg border border-white/15 bg-white/8 px-3 py-2 text-sm text-white"
      >
        <option value="new">New</option>
        <option value="reviewed">Reviewed</option>
        <option value="closed">Closed</option>
      </select>
      <label className="sr-only" htmlFor={`notes-${enquiryId}`}>
        Admin notes
      </label>
      <input
        id={`notes-${enquiryId}`}
        value={adminNotes}
        onChange={(event) => setAdminNotes(event.target.value)}
        placeholder="Internal note"
        className="rounded-lg border border-white/15 bg-white/8 px-3 py-2 text-sm text-white placeholder:text-white/35"
      />
      <button type="submit" className="btn-outline px-4 py-2 text-sm" disabled={loading}>
        {loading ? 'Saving...' : 'Save'}
      </button>
      {message && <p className="text-xs text-white/55 md:col-span-3">{message}</p>}
    </form>
  )
}
