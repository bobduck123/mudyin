'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Send, CheckCircle2, Loader2 } from 'lucide-react'

const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

type FormData = z.infer<typeof schema>

export function NewsletterForm() {
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    // In production: POST to /api/newsletter or Mailchimp/ConvertKit endpoint
    // For testing, we simulate a delay and succeed
    await new Promise(r => setTimeout(r, 1000))
    console.info('[Newsletter] Subscribed:', data.email)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div
        className="flex items-center gap-2 text-sm py-3 px-4 rounded-xl"
        role="status"
        aria-live="polite"
        style={{
          backgroundColor: 'rgba(157,193,131,0.12)',
          border: '1px solid rgba(157,193,131,0.3)',
          color: 'var(--color-sage-400)',
        }}
      >
        <CheckCircle2 size={15} aria-hidden="true" />
        You&apos;re subscribed. Welcome to the community!
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate aria-label="Newsletter subscription">
      <div className="flex gap-2">
        <div className="flex-1">
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            autoComplete="email"
            placeholder="your@email.com"
            aria-describedby={errors.email ? 'newsletter-error' : undefined}
            aria-invalid={!!errors.email}
            className="input-dark text-sm py-2.5"
            {...register('email')}
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary px-4 py-2.5 text-sm flex-shrink-0"
          aria-label="Subscribe to newsletter"
        >
          {isSubmitting
            ? <Loader2 size={15} className="animate-spin" aria-hidden="true" />
            : <Send size={15} aria-hidden="true" />
          }
        </button>
      </div>
      {errors.email && (
        <p id="newsletter-error" role="alert" className="mt-1.5 text-xs" style={{ color: '#f87171' }}>
          {errors.email.message}
        </p>
      )}
    </form>
  )
}
