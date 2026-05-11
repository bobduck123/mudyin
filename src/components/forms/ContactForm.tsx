'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Send, CheckCircle2, Loader2, AlertCircle } from 'lucide-react'

const schema = z.object({
  name: z.string().min(2, 'Please enter your full name'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  enquiryType: z.enum(['general', 'program', 'healing', 'workshop', 'partnership', 'media', 'volunteer'], {
    error: 'Please select an enquiry type',
  }),
  preferredService: z.string().optional(),
  preferredDateTime: z.string().optional(),
  message: z.string().min(20, 'Message must be at least 20 characters'),
  consent: z.literal(true, {
    error: 'Please confirm consent before sending your enquiry',
  }),
  website: z.string().max(0, 'Spam detected').optional(),
})

type FormData = z.infer<typeof schema>

type Status = 'idle' | 'submitting' | 'success' | 'error'

const enquiryTypes = [
  { value: 'general', label: 'General enquiry' },
  { value: 'program', label: 'Program stream information' },
  { value: 'healing', label: 'Healing-centred support' },
  { value: 'workshop', label: 'Workshop or group request' },
  { value: 'partnership', label: 'Partnership opportunity' },
  { value: 'media', label: 'Media and press' },
  { value: 'volunteer', label: 'Volunteering' },
]

type ContactFormProps = {
  defaultPreferredService?: string
}

export function ContactForm({ defaultPreferredService = '' }: ContactFormProps) {
  const [status, setStatus] = useState<Status>('idle')
  const [serverMessage, setServerMessage] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      consent: false as unknown as true,
      preferredService: defaultPreferredService,
    },
  })

  const onSubmit = async (data: FormData) => {
    if (data.website) return

    setStatus('submitting')
    setServerMessage(null)

    try {
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const result = await response.json().catch(() => ({}))

      if (!response.ok || result?.success === false) {
        throw new Error(result?.error || 'Unable to send enquiry')
      }

      setServerMessage(result?.message || null)
      setStatus('success')
      reset()
    } catch (error) {
      setServerMessage(error instanceof Error ? error.message : null)
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
          backgroundColor: 'rgba(111,138,120,0.12)',
          border: '1px solid rgba(111,138,120,0.35)',
        }}
      >
        <CheckCircle2
          size={48}
          className="mx-auto mb-4"
          style={{ color: 'var(--color-sage-400)' }}
          aria-hidden="true"
        />
        <h3 className="font-display font-semibold text-2xl mb-2" style={{ color: 'var(--color-foreground)' }}>
          Enquiry received
        </h3>
        <p className="mb-6" style={{ color: 'rgba(255,255,255,0.68)' }}>
          {serverMessage || 'Thank you for reaching out. Our team will be in touch within 1-2 business days.'}
        </p>
        <button onClick={() => setStatus('idle')} className="btn-outline text-sm">
          Send another enquiry
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-label="General enquiry form"
      className="space-y-5"
    >
      <div aria-hidden="true" style={{ display: 'none' }}>
        <label htmlFor="website">Leave this blank</label>
        <input id="website" type="text" tabIndex={-1} autoComplete="off" {...register('website')} />
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="contact-name" className="block text-sm font-medium mb-2" style={{ color: 'rgba(255,255,255,0.82)' }}>
            Full name <span aria-hidden="true" style={{ color: 'var(--color-ochre-500)' }}>*</span>
          </label>
          <input
            id="contact-name"
            type="text"
            autoComplete="name"
            placeholder="Your full name"
            aria-required="true"
            aria-describedby={errors.name ? 'contact-name-error' : undefined}
            aria-invalid={!!errors.name}
            className="input-dark"
            {...register('name')}
          />
          {errors.name && (
            <p id="contact-name-error" role="alert" className="mt-1.5 text-xs flex items-center gap-1" style={{ color: '#fca5a5' }}>
              <AlertCircle size={11} aria-hidden="true" /> {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="contact-email" className="block text-sm font-medium mb-2" style={{ color: 'rgba(255,255,255,0.82)' }}>
            Email address <span aria-hidden="true" style={{ color: 'var(--color-ochre-500)' }}>*</span>
          </label>
          <input
            id="contact-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-required="true"
            aria-describedby={errors.email ? 'contact-email-error' : undefined}
            aria-invalid={!!errors.email}
            className="input-dark"
            {...register('email')}
          />
          {errors.email && (
            <p id="contact-email-error" role="alert" className="mt-1.5 text-xs flex items-center gap-1" style={{ color: '#fca5a5' }}>
              <AlertCircle size={11} aria-hidden="true" /> {errors.email.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="contact-phone" className="block text-sm font-medium mb-2" style={{ color: 'rgba(255,255,255,0.82)' }}>
            Phone <span className="text-xs ml-1" style={{ color: 'rgba(255,255,255,0.5)' }}>(optional)</span>
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
          <label htmlFor="contact-type" className="block text-sm font-medium mb-2" style={{ color: 'rgba(255,255,255,0.82)' }}>
            Enquiry type <span aria-hidden="true" style={{ color: 'var(--color-ochre-500)' }}>*</span>
          </label>
          <select
            id="contact-type"
            aria-required="true"
            aria-describedby={errors.enquiryType ? 'contact-type-error' : undefined}
            aria-invalid={!!errors.enquiryType}
            className="input-dark"
            style={{ appearance: 'none', cursor: 'pointer' }}
            {...register('enquiryType')}
          >
            <option value="">Select enquiry type...</option>
            {enquiryTypes.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
          {errors.enquiryType && (
            <p id="contact-type-error" role="alert" className="mt-1.5 text-xs flex items-center gap-1" style={{ color: '#fca5a5' }}>
              <AlertCircle size={11} aria-hidden="true" /> {errors.enquiryType.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="contact-service" className="block text-sm font-medium mb-2" style={{ color: 'rgba(255,255,255,0.82)' }}>
            Preferred stream or workshop <span className="text-xs ml-1" style={{ color: 'rgba(255,255,255,0.5)' }}>(optional)</span>
          </label>
          <input
            id="contact-service"
            type="text"
            placeholder="Thrive Tribe, Young Spirit Mentoring, Culture Country"
            className="input-dark"
            {...register('preferredService')}
          />
        </div>

        <div>
          <label htmlFor="contact-date" className="block text-sm font-medium mb-2" style={{ color: 'rgba(255,255,255,0.82)' }}>
            Preferred date or time <span className="text-xs ml-1" style={{ color: 'rgba(255,255,255,0.5)' }}>(optional)</span>
          </label>
          <input
            id="contact-date"
            type="text"
            placeholder="Preferred day, time, or future intake window..."
            className="input-dark"
            {...register('preferredDateTime')}
          />
        </div>
      </div>

      <div>
        <label htmlFor="contact-message" className="block text-sm font-medium mb-2" style={{ color: 'rgba(255,255,255,0.82)' }}>
          Message <span aria-hidden="true" style={{ color: 'var(--color-ochre-500)' }}>*</span>
        </label>
        <textarea
          id="contact-message"
          rows={5}
          placeholder="Tell us how we can help..."
          aria-required="true"
          aria-describedby={errors.message ? 'contact-message-error' : undefined}
          aria-invalid={!!errors.message}
          className="input-dark resize-none"
          {...register('message')}
        />
        {errors.message && (
          <p id="contact-message-error" role="alert" className="mt-1.5 text-xs flex items-center gap-1" style={{ color: '#fca5a5' }}>
            <AlertCircle size={11} aria-hidden="true" /> {errors.message.message}
          </p>
        )}
      </div>

      <div>
        <label className="flex items-start gap-3 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
          <input
            type="checkbox"
            className="mt-1 h-4 w-4"
            aria-describedby={errors.consent ? 'contact-consent-error' : undefined}
            aria-invalid={!!errors.consent}
            {...register('consent')}
          />
          <span>
            I consent to Mudyin using these details to respond to my enquiry. <span aria-hidden="true" style={{ color: 'var(--color-ochre-500)' }}>*</span>
          </span>
        </label>
        {errors.consent && (
          <p id="contact-consent-error" role="alert" className="mt-1.5 text-xs flex items-center gap-1" style={{ color: '#fca5a5' }}>
            <AlertCircle size={11} aria-hidden="true" /> {errors.consent.message}
          </p>
        )}
      </div>

      {status === 'error' && (
        <div
          className="rounded-xl p-4 text-sm flex items-center gap-3"
          role="alert"
          style={{
            backgroundColor: 'rgba(185,95,64,0.14)',
            border: '1px solid rgba(185,95,64,0.36)',
            color: '#f6c4ae',
          }}
        >
          <AlertCircle size={16} aria-hidden="true" />
          {serverMessage || 'Something went wrong. Please try again or email us directly at yaama@mudyin.com.'}
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="btn-primary w-full sm:w-auto"
        aria-disabled={status === 'submitting'}
      >
        {status === 'submitting' ? (
          <>
            <Loader2 size={16} className="animate-spin" aria-hidden="true" />
            Sending...
          </>
        ) : (
          <>
            <Send size={16} aria-hidden="true" />
            Send enquiry
          </>
        )}
      </button>

      <p className="text-xs" style={{ color: 'rgba(255,255,255,0.48)' }}>
        We respond within 1-2 business days. For urgent matters, call{' '}
        <a href="tel:0478796298" className="underline" style={{ color: 'var(--color-ochre-400)' }}>0478 796 298</a>.
      </p>
    </form>
  )
}
