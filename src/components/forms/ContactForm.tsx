'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Send, CheckCircle2, Loader2, AlertCircle } from 'lucide-react'

const schema = z.object({
  name:         z.string().min(2, 'Please enter your full name'),
  email:        z.string().email('Please enter a valid email address'),
  phone:        z.string().optional(),
  inquiryType:  z.enum(['general', 'program', 'partnership', 'media', 'volunteer'], {
    error: 'Please select an inquiry type',
  }),
  message:      z.string().min(20, 'Message must be at least 20 characters'),
  // Honeypot — must be empty
  website:      z.string().max(0, 'Spam detected').optional(),
})

type FormData = z.infer<typeof schema>

type Status = 'idle' | 'submitting' | 'success' | 'error'

const inquiryTypes = [
  { value: 'general',     label: 'General Enquiry' },
  { value: 'program',     label: 'Program Information' },
  { value: 'partnership', label: 'Partnership Opportunity' },
  { value: 'media',       label: 'Media & Press' },
  { value: 'volunteer',   label: 'Volunteering' },
]

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    // Honeypot check
    if (data.website) return

    setStatus('submitting')
    try {
      // In production: POST to /api/contact
      // For now: simulate network request
      await new Promise(r => setTimeout(r, 1500))

      console.info('[Contact Form] Submission:', {
        name:        data.name,
        email:       data.email,
        inquiryType: data.inquiryType,
        message:     data.message.slice(0, 50) + '…',
      })

      setStatus('success')
      reset()
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div
        className="rounded-2xl p-8 text-center"
        role="status"
        aria-live="polite"
        style={{
          backgroundColor: 'rgba(157,193,131,0.08)',
          border: '1px solid rgba(157,193,131,0.3)',
        }}
      >
        <CheckCircle2
          size={48}
          className="mx-auto mb-4"
          style={{ color: 'var(--color-sage-400)' }}
          aria-hidden="true"
        />
        <h3
          className="font-display font-semibold text-2xl mb-2"
          style={{ color: 'var(--color-foreground)' }}
        >
          Message Received
        </h3>
        <p className="mb-6" style={{ color: 'rgba(255,255,255,0.65)' }}>
          Thank you for reaching out. Our team will be in touch within 1–2 business days.
        </p>
        <button onClick={() => setStatus('idle')} className="btn-outline text-sm">
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-label="Contact form"
      className="space-y-5"
    >
      {/* Honeypot — hidden from real users, catches bots */}
      <div aria-hidden="true" style={{ display: 'none' }}>
        <label htmlFor="website">Leave this blank</label>
        <input id="website" type="text" tabIndex={-1} autoComplete="off" {...register('website')} />
      </div>

      {/* Name + Email row */}
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="contact-name" className="block text-sm font-medium mb-2" style={{ color: 'rgba(255,255,255,0.8)' }}>
            Full Name <span aria-hidden="true" style={{ color: 'var(--color-ochre-500)' }}>*</span>
          </label>
          <input
            id="contact-name"
            type="text"
            autoComplete="name"
            placeholder="Your full name"
            aria-required="true"
            aria-describedby={errors.name ? 'name-error' : undefined}
            aria-invalid={!!errors.name}
            className="input-dark"
            {...register('name')}
          />
          {errors.name && (
            <p id="name-error" role="alert" className="mt-1.5 text-xs flex items-center gap-1" style={{ color: '#f87171' }}>
              <AlertCircle size={11} aria-hidden="true" /> {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="contact-email" className="block text-sm font-medium mb-2" style={{ color: 'rgba(255,255,255,0.8)' }}>
            Email Address <span aria-hidden="true" style={{ color: 'var(--color-ochre-500)' }}>*</span>
          </label>
          <input
            id="contact-email"
            type="email"
            autoComplete="email"
            placeholder="your@email.com"
            aria-required="true"
            aria-describedby={errors.email ? 'email-error' : undefined}
            aria-invalid={!!errors.email}
            className="input-dark"
            {...register('email')}
          />
          {errors.email && (
            <p id="email-error" role="alert" className="mt-1.5 text-xs flex items-center gap-1" style={{ color: '#f87171' }}>
              <AlertCircle size={11} aria-hidden="true" /> {errors.email.message}
            </p>
          )}
        </div>
      </div>

      {/* Phone + Inquiry type */}
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="contact-phone" className="block text-sm font-medium mb-2" style={{ color: 'rgba(255,255,255,0.8)' }}>
            Phone Number <span className="text-xs ml-1" style={{ color: 'rgba(255,255,255,0.4)' }}>(optional)</span>
          </label>
          <input
            id="contact-phone"
            type="tel"
            autoComplete="tel"
            placeholder="04XX XXX XXX"
            className="input-dark"
            {...register('phone')}
          />
        </div>

        <div>
          <label htmlFor="contact-type" className="block text-sm font-medium mb-2" style={{ color: 'rgba(255,255,255,0.8)' }}>
            Inquiry Type <span aria-hidden="true" style={{ color: 'var(--color-ochre-500)' }}>*</span>
          </label>
          <select
            id="contact-type"
            aria-required="true"
            aria-describedby={errors.inquiryType ? 'type-error' : undefined}
            aria-invalid={!!errors.inquiryType}
            className="input-dark"
            style={{ appearance: 'none', cursor: 'pointer' }}
            {...register('inquiryType')}
          >
            <option value="">Select inquiry type…</option>
            {inquiryTypes.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
          {errors.inquiryType && (
            <p id="type-error" role="alert" className="mt-1.5 text-xs flex items-center gap-1" style={{ color: '#f87171' }}>
              <AlertCircle size={11} aria-hidden="true" /> {errors.inquiryType.message}
            </p>
          )}
        </div>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="contact-message" className="block text-sm font-medium mb-2" style={{ color: 'rgba(255,255,255,0.8)' }}>
          Message <span aria-hidden="true" style={{ color: 'var(--color-ochre-500)' }}>*</span>
        </label>
        <textarea
          id="contact-message"
          rows={5}
          placeholder="Tell us how we can help…"
          aria-required="true"
          aria-describedby={errors.message ? 'message-error' : undefined}
          aria-invalid={!!errors.message}
          className="input-dark resize-none"
          {...register('message')}
        />
        {errors.message && (
          <p id="message-error" role="alert" className="mt-1.5 text-xs flex items-center gap-1" style={{ color: '#f87171' }}>
            <AlertCircle size={11} aria-hidden="true" /> {errors.message.message}
          </p>
        )}
      </div>

      {/* Error state */}
      {status === 'error' && (
        <div
          className="rounded-xl p-4 text-sm flex items-center gap-3"
          role="alert"
          style={{
            backgroundColor: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.3)',
            color: '#fca5a5',
          }}
        >
          <AlertCircle size={16} aria-hidden="true" />
          Something went wrong. Please try again or email us directly at info@mudyin.org.au
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={status === 'submitting'}
        className="btn-primary w-full sm:w-auto"
        aria-disabled={status === 'submitting'}
      >
        {status === 'submitting' ? (
          <>
            <Loader2 size={16} className="animate-spin" aria-hidden="true" />
            Sending…
          </>
        ) : (
          <>
            <Send size={16} aria-hidden="true" />
            Send Message
          </>
        )}
      </button>

      <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
        We respond within 1–2 business days. For urgent matters, call{' '}
        <a href="tel:0478796298" className="underline" style={{ color: 'var(--color-ochre-400)' }}>0478 796 298</a>.
      </p>
    </form>
  )
}
