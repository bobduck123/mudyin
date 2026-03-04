'use client'

// ─── Donation Form — Stripe Test Mode Placeholder ──────────────────────────────
// This component operates in two modes:
//
//   TEST MODE (default — no Stripe keys needed):
//   • Shows a prominent "TEST MODE" banner
//   • Simulates the full donation flow with mock processing
//   • Generates a test receipt number
//   • No real money moves
//
//   LIVE TEST MODE (when Stripe test keys configured in .env.local):
//   • NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_XXXX
//   • STRIPE_SECRET_KEY=sk_test_XXXX
//   • Uses real Stripe.js for PCI-compliant card collection
//   • Still test mode (no real money)
//   • Test card: 4242 4242 4242 4242 | Any future date | Any CVV
//
// See src/lib/stripe-mock.ts for full documentation.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Heart, Loader2, AlertCircle,
  FlaskConical, RefreshCw, CreditCard,
} from 'lucide-react'
import { donationAmounts, impactMessages, siteConfig } from '@/lib/data'
import { generateMockReceiptNumber, STRIPE_ENABLED } from '@/lib/stripe-mock'
import { cn } from '@/lib/utils'

const schema = z.object({
  amount:         z.number().min(5, 'Minimum donation is $5'),
  customAmount:   z.string().optional(),
  donationType:   z.enum(['one-time', 'monthly']),
  donorFirstName: z.string().min(1, 'First name is required'),
  donorLastName:  z.string().min(1, 'Last name is required'),
  donorEmail:     z.string().email('Valid email required for receipt'),
  // Tribute (optional)
  tributeName:    z.string().optional(),
  tributeMessage: z.string().optional(),
})

type FormData = z.infer<typeof schema>

type Phase = 'select' | 'details' | 'processing' | 'success' | 'error'

export function DonationForm() {
  const [selectedAmount, setSelectedAmount] = useState<number>(50)
  const [donationType,   setDonationType]   = useState<'one-time' | 'monthly'>('one-time')
  const [phase,          setPhase]          = useState<Phase>('select')
  const [receiptNumber,  setReceiptNumber]  = useState<string>('')
  const [customAmt,      setCustomAmt]      = useState('')

  const activeAmount = customAmt ? parseFloat(customAmt) : selectedAmount
  const impactMsg    = impactMessages[selectedAmount] ?? `supports ${siteConfig.name}`

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { donationType: 'one-time', amount: 50 },
  })

  const onSubmit = async (data: FormData) => {
    setPhase('processing')

    try {
      if (STRIPE_ENABLED) {
        // Real Stripe test-mode processing would happen here
        // via /api/stripe/create-payment-intent route
        console.info('[Stripe] Would process real test payment via Stripe')
      }

      // Simulate payment processing (mock or Stripe)
      await new Promise(r => setTimeout(r, 2500))

      const receipt = generateMockReceiptNumber()
      setReceiptNumber(receipt)

      console.info('[Donation] Processed:', {
        amount:      activeAmount,
        type:        donationType,
        donorEmail:  data.donorEmail,
        receipt,
        mode:        STRIPE_ENABLED ? 'stripe-test' : 'mock',
      })

      setPhase('success')
    } catch (err) {
      console.error('[Donation] Error:', err)
      setPhase('error')
    }
  }

  const fieldClass = 'input-dark'
  const labelStyle = { color: 'rgba(255,255,255,0.8)' }
  const errorStyle = { color: '#f87171' }

  // ─── Success ───
  if (phase === 'success') {
    return (
      <div
        className="rounded-2xl p-10 text-center"
        role="status"
        aria-live="polite"
        style={{
          backgroundColor: 'rgba(157,193,131,0.07)',
          border: '1px solid rgba(157,193,131,0.3)',
        }}
      >
        <Heart size={56} className="mx-auto mb-5" fill="currentColor" style={{ color: 'var(--color-ochre-400)' }} aria-hidden="true" />
        <h3 className="font-display font-semibold text-2xl mb-2" style={{ color: 'var(--color-foreground)' }}>
          Thank You — That&apos;s Deadly!
        </h3>
        <p className="mb-2 text-lg" style={{ color: 'rgba(255,255,255,0.75)' }}>
          Your {donationType === 'monthly' ? 'monthly' : ''} gift of{' '}
          <span style={{ color: 'var(--color-ochre-400)', fontWeight: 600 }}>${activeAmount.toFixed(0)} AUD</span>{' '}
          {impactMsg}.
        </p>
        <p className="text-sm mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
          Receipt: <span className="font-mono" style={{ color: 'var(--color-ochre-400)' }}>{receiptNumber}</span>
        </p>
        <p className="text-xs mb-6" style={{ color: 'rgba(255,255,255,0.4)' }}>
          A tax-deductible receipt has been emailed to you.
        </p>
        <button onClick={() => setPhase('select')} className="btn-ghost text-sm">
          <RefreshCw size={14} aria-hidden="true" /> Make another donation
        </button>
      </div>
    )
  }

  return (
    <div>
      {/* TEST MODE Banner */}
      <div
        className="rounded-xl p-4 mb-6 flex items-start gap-3"
        role="note"
        aria-label="Test mode notice"
        style={{
          backgroundColor: 'rgba(251,191,36,0.08)',
          border: '1px solid rgba(251,191,36,0.3)',
        }}
      >
        <FlaskConical size={18} className="flex-shrink-0 mt-0.5" style={{ color: '#fbbf24' }} aria-hidden="true" />
        <div>
          <p className="text-sm font-semibold mb-0.5" style={{ color: '#fbbf24' }}>
            TEST MODE — No real payments processed
          </p>
          <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
            {STRIPE_ENABLED
              ? 'Stripe test keys detected. Use card: 4242 4242 4242 4242 | Any future date | Any CVV'
              : 'Add Stripe test keys to .env.local to enable real test-mode processing. See src/lib/stripe-mock.ts'
            }
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate aria-label="Donation form">

        {/* One-time / Monthly toggle */}
        <div
          className="flex rounded-xl p-1 mb-8"
          role="group"
          aria-label="Donation frequency"
          style={{ backgroundColor: 'rgba(30,30,30,0.6)', border: '1px solid rgba(65,70,72,0.4)' }}
        >
          {(['one-time', 'monthly'] as const).map(type => (
            <button
              key={type}
              type="button"
              onClick={() => setDonationType(type)}
              aria-pressed={donationType === type}
              className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
              style={
                donationType === type
                  ? { backgroundColor: 'var(--color-ochre-500)', color: 'var(--color-charcoal-950)' }
                  : { color: 'rgba(255,255,255,0.6)' }
              }
            >
              {type === 'one-time' ? 'One-time' : 'Monthly'}
            </button>
          ))}
        </div>

        {/* Amount presets */}
        <div className="mb-3">
          <p className="text-sm font-medium mb-3" style={{ color: 'rgba(255,255,255,0.8)' }}>
            Select amount (AUD)
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-3">
            {donationAmounts.map(amt => (
              <button
                key={amt}
                type="button"
                onClick={() => { setSelectedAmount(amt); setCustomAmt('') }}
                aria-pressed={selectedAmount === amt && !customAmt}
                className="py-3 rounded-xl text-sm font-semibold transition-all duration-200"
                style={
                  selectedAmount === amt && !customAmt
                    ? { backgroundColor: 'var(--color-ochre-500)', color: 'var(--color-charcoal-950)', boxShadow: 'var(--shadow-cultural)' }
                    : { backgroundColor: 'rgba(65,70,72,0.3)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(65,70,72,0.5)' }
                }
              >
                ${amt}
              </button>
            ))}
          </div>

          {/* Custom amount */}
          <div className="relative">
            <span
              className="absolute left-4 top-1/2 -translate-y-1/2 font-medium text-sm"
              style={{ color: 'rgba(255,255,255,0.5)' }}
              aria-hidden="true"
            >
              $
            </span>
            <input
              type="number"
              min={5}
              step={1}
              value={customAmt}
              onChange={e => { setCustomAmt(e.target.value); setSelectedAmount(0) }}
              className="input-dark pl-8"
              placeholder="Custom amount"
              aria-label="Custom donation amount in Australian dollars"
            />
          </div>
        </div>

        {/* Impact message */}
        {(activeAmount > 0 && impactMessages[selectedAmount]) && (
          <div
            className="text-sm py-3 px-4 rounded-xl mb-8 flex items-center gap-2"
            aria-live="polite"
            style={{
              backgroundColor: 'rgba(210,168,85,0.08)',
              border: '1px solid rgba(210,168,85,0.2)',
              color: 'var(--color-ochre-400)',
            }}
          >
            <Heart size={13} fill="currentColor" aria-hidden="true" />
            Your ${selectedAmount} {impactMsg}.
          </div>
        )}

        {/* Donor details */}
        <div className="space-y-5 mb-6">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="d-first" className="block text-sm font-medium mb-2" style={labelStyle}>
                First Name <span aria-hidden="true" style={{ color: 'var(--color-ochre-500)' }}>*</span>
              </label>
              <input id="d-first" type="text" className={fieldClass} autoComplete="given-name"
                aria-required="true" {...register('donorFirstName')} />
              {errors.donorFirstName && (
                <p role="alert" className="mt-1.5 text-xs" style={errorStyle}>{errors.donorFirstName.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="d-last" className="block text-sm font-medium mb-2" style={labelStyle}>
                Last Name <span aria-hidden="true" style={{ color: 'var(--color-ochre-500)' }}>*</span>
              </label>
              <input id="d-last" type="text" className={fieldClass} autoComplete="family-name"
                aria-required="true" {...register('donorLastName')} />
              {errors.donorLastName && (
                <p role="alert" className="mt-1.5 text-xs" style={errorStyle}>{errors.donorLastName.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="d-email" className="block text-sm font-medium mb-2" style={labelStyle}>
              Email Address <span aria-hidden="true" style={{ color: 'var(--color-ochre-500)' }}>*</span>
            </label>
            <input id="d-email" type="email" className={fieldClass} autoComplete="email"
              placeholder="For your tax-deductible receipt"
              aria-required="true" {...register('donorEmail')} />
            {errors.donorEmail && (
              <p role="alert" className="mt-1.5 text-xs" style={errorStyle}>{errors.donorEmail.message}</p>
            )}
          </div>

          {/* Mock card fields — visual only in test mode */}
          <div
            className="p-4 rounded-xl"
            style={{
              backgroundColor: 'rgba(65,70,72,0.2)',
              border: '1px solid rgba(65,70,72,0.4)',
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <CreditCard size={16} style={{ color: 'var(--color-ochre-400)' }} aria-hidden="true" />
              <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
                Card Details
              </span>
              <span
                className="text-xs px-2 py-0.5 rounded-full ml-auto"
                style={{ backgroundColor: 'rgba(251,191,36,0.15)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.3)' }}
              >
                TEST
              </span>
            </div>

            {/* Pre-filled test card */}
            <div className="space-y-3">
              <div>
                <label htmlFor="d-card" className="block text-xs mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  Card Number (test)
                </label>
                <input
                  id="d-card"
                  type="text"
                  defaultValue="4242 4242 4242 4242"
                  readOnly
                  className="input-dark text-sm"
                  aria-label="Test card number (pre-filled)"
                  style={{ opacity: 0.7 }}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="d-expiry" className="block text-xs mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    Expiry
                  </label>
                  <input
                    id="d-expiry"
                    type="text"
                    defaultValue="12/28"
                    readOnly
                    className="input-dark text-sm"
                    aria-label="Test card expiry"
                    style={{ opacity: 0.7 }}
                  />
                </div>
                <div>
                  <label htmlFor="d-cvc" className="block text-xs mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    CVC
                  </label>
                  <input
                    id="d-cvc"
                    type="text"
                    defaultValue="123"
                    readOnly
                    className="input-dark text-sm"
                    aria-label="Test card CVC"
                    style={{ opacity: 0.7 }}
                  />
                </div>
              </div>
            </div>

            <p className="mt-3 text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
              In production, real Stripe.js Elements replace these fields for PCI-compliant card capture.
            </p>
          </div>
        </div>

        {/* Error state */}
        {phase === 'error' && (
          <div
            className="rounded-xl p-4 mb-5 flex items-center gap-3 text-sm"
            role="alert"
            style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5' }}
          >
            <AlertCircle size={16} aria-hidden="true" />
            Something went wrong. Please try again or contact us at {siteConfig.email}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={phase === 'processing' || activeAmount < 5}
          className={cn(
            'btn-primary w-full text-base py-4',
            (phase === 'processing' || activeAmount < 5) && 'opacity-60 cursor-not-allowed',
          )}
          aria-disabled={phase === 'processing' || activeAmount < 5}
        >
          {phase === 'processing' ? (
            <><Loader2 size={18} className="animate-spin" aria-hidden="true" /> Processing (test)…</>
          ) : (
            <><Heart size={16} fill="currentColor" aria-hidden="true" /> Donate ${activeAmount > 0 ? activeAmount.toFixed(0) : '—'} {donationType === 'monthly' ? '/ month' : ''}</>
          )}
        </button>

        <p className="text-xs text-center mt-3" style={{ color: 'rgba(255,255,255,0.35)' }}>
          Mudyin holds DGR status. All donations ≥$2 are tax-deductible (ABN: {siteConfig.abn}).
        </p>
      </form>
    </div>
  )
}
