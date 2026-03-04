'use client'

import { useState } from 'react'
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react'

interface ReportFormProps {
  contentType: 'post' | 'comment' | 'photo'
  contentId: string
  onClose?: () => void
}

export function ReportForm({ contentType, contentId, onClose }: ReportFormProps) {
  const [reason, setReason] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!reason) {
      setError('Please select a reason')
      return
    }

    try {
      setLoading(true)
      setError('')

      const response = await fetch('/api/moderation/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentType,
          contentId,
          reason,
          description,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit report')
      }

      setSuccess(true)
      setTimeout(() => {
        onClose?.()
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit report')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="card-dark p-6 text-center">
        <CheckCircle className="mx-auto mb-3 text-sage-400" size={48} />
        <p className="text-white font-semibold mb-2">Thank you for reporting</p>
        <p className="text-white/60 text-sm">
          Our moderation team will review this and take appropriate action.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="card-dark p-6 space-y-4">
      <h3 className="text-lg font-semibold text-white mb-4">Report {contentType}</h3>

      {error && (
        <div className="flex gap-2 p-3 bg-red-500/20 border border-red-500/50 rounded text-red-200 text-sm">
          <AlertCircle size={18} className="flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <div>
        <label className="block text-white/80 text-sm font-medium mb-2">
          Reason for reporting
        </label>
        <select
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full bg-white/10 text-white rounded p-2 focus:outline-none focus:ring-2 focus:ring-sage-500"
        >
          <option value="">Select a reason...</option>
          <option value="inappropriate">Inappropriate content</option>
          <option value="harmful">Harmful or dangerous</option>
          <option value="copyright">Copyright violation</option>
          <option value="spam">Spam or misleading</option>
          <option value="abuse">Abuse or harassment</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-white/80 text-sm font-medium mb-2">
          Additional details (optional)
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={500}
          rows={4}
          placeholder="Provide any additional context that helps us understand the issue..."
          className="w-full bg-white/10 text-white placeholder-white/40 rounded p-2 focus:outline-none focus:ring-2 focus:ring-sage-500"
        />
        <p className="text-white/40 text-xs mt-1">
          {description.length} / 500 characters
        </p>
      </div>

      <div className="flex gap-2 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="btn-ghost flex-1"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || !reason}
          className="btn-primary flex-1 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit Report'
          )}
        </button>
      </div>
    </form>
  )
}
