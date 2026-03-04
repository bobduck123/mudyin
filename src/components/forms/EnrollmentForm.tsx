'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CheckCircle2, Loader2, AlertCircle, ChevronRight, ChevronLeft, User, Heart, ShieldCheck } from 'lucide-react'
import { generateMockReceiptNumber } from '@/lib/stripe-mock'

// ─── Step Schemas ─────────────────────────────────────────────────────────────

const step1Schema = z.object({
  firstName:        z.string().min(1, 'First name is required'),
  lastName:         z.string().min(1, 'Last name is required'),
  preferredName:    z.string().optional(),
  dateOfBirth:      z.string().min(1, 'Date of birth is required'),
  email:            z.string().email('Valid email required'),
  phone:            z.string().regex(/^(\+61|0)[2-9]\d{8}$/, 'Enter a valid Australian mobile number'),
  genderIdentity:   z.string().optional(),
  culturalIdentity: z.string().optional(),
})

const step2Schema = z.object({
  emergencyContact1Name:     z.string().min(1, 'Emergency contact name is required'),
  emergencyContact1Phone:    z.string().min(6, 'Emergency contact phone is required'),
  emergencyContact1Relation: z.string().min(1, 'Relationship is required'),
  emergencyContact2Name:     z.string().optional(),
  emergencyContact2Phone:    z.string().optional(),
  medicalConditions:         z.string().optional(),
  medications:               z.string().optional(),
  allergies:                 z.string().optional(),
  guardianName:              z.string().optional(),
  guardianPhone:             z.string().optional(),
  guardianEmail:             z.string().optional(),
})

const step3Schema = z.object({
  mediaConsent:          z.boolean().optional(),
  dataConsent:           z.literal(true, { error: 'Data consent is required to complete enrollment' }),
  medicalConsentGiven:   z.literal(true, { error: 'Medical consent is required' }),
  codeOfConductAgreed:   z.literal(true, { error: 'You must agree to the Code of Conduct' }),
  additionalNotes:       z.string().optional(),
})

type Step1Data = z.infer<typeof step1Schema>
type Step2Data = z.infer<typeof step2Schema>
type Step3Data = z.infer<typeof step3Schema>

type AllData = Step1Data & Step2Data & Step3Data

interface Props {
  program?: string
}

// ─── Step Indicator ───────────────────────────────────────────────────────────

function StepIndicator({ step, total }: { step: number; total: number }) {
  const steps = [
    { label: 'Personal Details', Icon: User },
    { label: 'Emergency & Medical', Icon: Heart },
    { label: 'Consent', Icon: ShieldCheck },
  ]

  return (
    <div className="flex items-center justify-between mb-10" role="list" aria-label="Enrollment progress">
      {steps.map((s, i) => {
        const num = i + 1
        const isActive    = num === step
        const isCompleted = num < step

        return (
          <div key={s.label} className="flex items-center flex-1" role="listitem">
            <div className="flex flex-col items-center">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold mb-1 transition-all duration-300"
                aria-current={isActive ? 'step' : undefined}
                style={
                  isCompleted
                    ? { backgroundColor: 'var(--color-ochre-500)', color: 'var(--color-charcoal-950)' }
                    : isActive
                      ? { backgroundColor: 'rgba(210,168,85,0.15)', border: '2px solid var(--color-ochre-500)', color: 'var(--color-ochre-400)' }
                      : { backgroundColor: 'rgba(65,70,72,0.4)', color: 'rgba(255,255,255,0.4)' }
                }
              >
                {isCompleted
                  ? <CheckCircle2 size={18} aria-hidden="true" />
                  : num
                }
              </div>
              <span
                className="text-xs text-center hidden sm:block max-w-[80px]"
                style={{ color: isActive ? 'var(--color-ochre-400)' : 'rgba(255,255,255,0.4)' }}
              >
                {s.label}
              </span>
            </div>

            {/* Connector line */}
            {i < total - 1 && (
              <div
                className="flex-1 h-px mx-2 mb-5"
                aria-hidden="true"
                style={{
                  backgroundColor: num < step
                    ? 'var(--color-ochre-500)'
                    : 'rgba(65,70,72,0.5)',
                  transition: 'background-color 0.3s',
                }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function EnrollmentForm({ program }: Props) {
  const [step,        setStep]        = useState(1)
  const [formData,    setFormData]    = useState<Partial<AllData>>({})
  const [submitting,  setSubmitting]  = useState(false)
  const [success,     setSuccess]     = useState<string | null>(null)
  const [serverError, setServerError] = useState<string | null>(null)

  // ─── Step 1 ───
  const form1 = useForm<Step1Data>({ resolver: zodResolver(step1Schema), defaultValues: formData })
  const onStep1 = (data: Step1Data) => {
    setFormData(prev => ({ ...prev, ...data }))
    setStep(2)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // ─── Step 2 ───
  const form2 = useForm<Step2Data>({ resolver: zodResolver(step2Schema), defaultValues: formData })
  const onStep2 = (data: Step2Data) => {
    setFormData(prev => ({ ...prev, ...data }))
    setStep(3)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // ─── Step 3 ───
  const form3 = useForm<Step3Data>({ resolver: zodResolver(step3Schema) })
  const onStep3 = async (data: Step3Data) => {
    const allData: AllData = { ...formData as AllData, ...data }
    setSubmitting(true)
    setServerError(null)

    try {
      // In production: POST to /api/enroll
      await new Promise(r => setTimeout(r, 2000))

      const ref = generateMockReceiptNumber()
      console.info('[Enrollment] Submitted:', { program, name: `${allData.firstName} ${allData.lastName}`, ref })
      setSuccess(ref)
    } catch {
      setServerError('Something went wrong. Please try again or call 0478 796 298.')
    } finally {
      setSubmitting(false)
    }
  }

  // ─── Success screen ───
  if (success) {
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
        <CheckCircle2 size={56} className="mx-auto mb-5" style={{ color: 'var(--color-sage-400)' }} aria-hidden="true" />
        <h3 className="font-display font-semibold text-2xl mb-2" style={{ color: 'var(--color-foreground)' }}>
          Enrollment Submitted!
        </h3>
        <p className="mb-2" style={{ color: 'rgba(255,255,255,0.7)' }}>
          Your application has been received. Our team will be in touch within 2–3 business days.
        </p>
        <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.45)' }}>
          Reference number: <span className="font-mono font-bold" style={{ color: 'var(--color-ochre-400)' }}>{success}</span>
        </p>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
          A confirmation email has been sent. Check your inbox (and junk folder).
        </p>
      </div>
    )
  }

  const fieldClass = 'input-dark'
  const labelClass = 'block text-sm font-medium mb-2'
  const labelStyle = { color: 'rgba(255,255,255,0.8)' }
  const errorStyle = { color: '#f87171' }

  return (
    <div className="card-dark p-8">
      <StepIndicator step={step} total={3} />

      {/* ─── Step 1 ─── */}
      {step === 1 && (
        <form onSubmit={form1.handleSubmit(onStep1)} noValidate aria-label="Step 1: Personal details">
          <h3 className="font-display font-semibold text-xl mb-6" style={{ color: 'var(--color-foreground)' }}>
            Personal Details
          </h3>

          <div className="grid sm:grid-cols-2 gap-5 mb-5">
            <div>
              <label htmlFor="f-firstName" className={labelClass} style={labelStyle}>
                First Name <span aria-hidden="true" style={{ color: 'var(--color-ochre-500)' }}>*</span>
              </label>
              <input id="f-firstName" type="text" className={fieldClass} autoComplete="given-name"
                aria-required="true" aria-invalid={!!form1.formState.errors.firstName}
                {...form1.register('firstName')} />
              {form1.formState.errors.firstName && (
                <p role="alert" className="mt-1.5 text-xs" style={errorStyle}>{form1.formState.errors.firstName.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="f-lastName" className={labelClass} style={labelStyle}>
                Last Name <span aria-hidden="true" style={{ color: 'var(--color-ochre-500)' }}>*</span>
              </label>
              <input id="f-lastName" type="text" className={fieldClass} autoComplete="family-name"
                aria-required="true" aria-invalid={!!form1.formState.errors.lastName}
                {...form1.register('lastName')} />
              {form1.formState.errors.lastName && (
                <p role="alert" className="mt-1.5 text-xs" style={errorStyle}>{form1.formState.errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5 mb-5">
            <div>
              <label htmlFor="f-preferred" className={labelClass} style={labelStyle}>
                Preferred Name <span className="text-xs ml-1" style={{ color: 'rgba(255,255,255,0.4)' }}>(optional)</span>
              </label>
              <input id="f-preferred" type="text" className={fieldClass} placeholder="What we should call you"
                {...form1.register('preferredName')} />
            </div>

            <div>
              <label htmlFor="f-dob" className={labelClass} style={labelStyle}>
                Date of Birth <span aria-hidden="true" style={{ color: 'var(--color-ochre-500)' }}>*</span>
              </label>
              <input id="f-dob" type="date" className={fieldClass} aria-required="true"
                aria-invalid={!!form1.formState.errors.dateOfBirth}
                {...form1.register('dateOfBirth')} />
              {form1.formState.errors.dateOfBirth && (
                <p role="alert" className="mt-1.5 text-xs" style={errorStyle}>{form1.formState.errors.dateOfBirth.message}</p>
              )}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5 mb-5">
            <div>
              <label htmlFor="f-email" className={labelClass} style={labelStyle}>
                Email <span aria-hidden="true" style={{ color: 'var(--color-ochre-500)' }}>*</span>
              </label>
              <input id="f-email" type="email" className={fieldClass} autoComplete="email"
                aria-required="true" aria-invalid={!!form1.formState.errors.email}
                {...form1.register('email')} />
              {form1.formState.errors.email && (
                <p role="alert" className="mt-1.5 text-xs" style={errorStyle}>{form1.formState.errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="f-phone" className={labelClass} style={labelStyle}>
                Mobile Number <span aria-hidden="true" style={{ color: 'var(--color-ochre-500)' }}>*</span>
              </label>
              <input id="f-phone" type="tel" className={fieldClass} autoComplete="tel" placeholder="04XX XXX XXX"
                aria-required="true" aria-invalid={!!form1.formState.errors.phone}
                {...form1.register('phone')} />
              {form1.formState.errors.phone && (
                <p role="alert" className="mt-1.5 text-xs" style={errorStyle}>{form1.formState.errors.phone.message}</p>
              )}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5 mb-8">
            <div>
              <label htmlFor="f-gender" className={labelClass} style={labelStyle}>
                Gender Identity <span className="text-xs ml-1" style={{ color: 'rgba(255,255,255,0.4)' }}>(optional, free text)</span>
              </label>
              <input id="f-gender" type="text" className={fieldClass}
                placeholder="How you identify (optional)"
                {...form1.register('genderIdentity')} />
            </div>

            <div>
              <label htmlFor="f-cultural" className={labelClass} style={labelStyle}>
                Cultural Identity <span className="text-xs ml-1" style={{ color: 'rgba(255,255,255,0.4)' }}>(optional)</span>
              </label>
              <input id="f-cultural" type="text" className={fieldClass}
                placeholder="e.g. Aboriginal, Torres Strait Islander"
                {...form1.register('culturalIdentity')} />
            </div>
          </div>

          <div className="flex justify-end">
            <button type="submit" className="btn-primary">
              Continue
              <ChevronRight size={16} aria-hidden="true" />
            </button>
          </div>
        </form>
      )}

      {/* ─── Step 2 ─── */}
      {step === 2 && (
        <form onSubmit={form2.handleSubmit(onStep2)} noValidate aria-label="Step 2: Emergency contacts and medical">
          <h3 className="font-display font-semibold text-xl mb-6" style={{ color: 'var(--color-foreground)' }}>
            Emergency Contacts & Medical
          </h3>

          <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.55)' }}>
            We keep this information confidential and only use it in case of emergency.
          </p>

          <h4 className="text-sm font-semibold mb-4" style={{ color: 'var(--color-ochre-400)' }}>Primary Emergency Contact</h4>
          <div className="grid sm:grid-cols-3 gap-5 mb-6">
            <div>
              <label htmlFor="f-ec1n" className={labelClass} style={labelStyle}>
                Name <span aria-hidden="true" style={{ color: 'var(--color-ochre-500)' }}>*</span>
              </label>
              <input id="f-ec1n" type="text" className={fieldClass}
                aria-required="true" {...form2.register('emergencyContact1Name')} />
              {form2.formState.errors.emergencyContact1Name && (
                <p role="alert" className="mt-1.5 text-xs" style={errorStyle}>{form2.formState.errors.emergencyContact1Name.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="f-ec1p" className={labelClass} style={labelStyle}>
                Phone <span aria-hidden="true" style={{ color: 'var(--color-ochre-500)' }}>*</span>
              </label>
              <input id="f-ec1p" type="tel" className={fieldClass}
                aria-required="true" {...form2.register('emergencyContact1Phone')} />
              {form2.formState.errors.emergencyContact1Phone && (
                <p role="alert" className="mt-1.5 text-xs" style={errorStyle}>{form2.formState.errors.emergencyContact1Phone.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="f-ec1r" className={labelClass} style={labelStyle}>
                Relationship <span aria-hidden="true" style={{ color: 'var(--color-ochre-500)' }}>*</span>
              </label>
              <input id="f-ec1r" type="text" className={fieldClass} placeholder="e.g. Parent, Aunty"
                aria-required="true" {...form2.register('emergencyContact1Relation')} />
              {form2.formState.errors.emergencyContact1Relation && (
                <p role="alert" className="mt-1.5 text-xs" style={errorStyle}>{form2.formState.errors.emergencyContact1Relation.message}</p>
              )}
            </div>
          </div>

          <h4 className="text-sm font-semibold mb-4" style={{ color: 'rgba(255,255,255,0.5)' }}>Secondary Emergency Contact <span className="font-normal text-xs">(optional)</span></h4>
          <div className="grid sm:grid-cols-3 gap-5 mb-8">
            <div>
              <label htmlFor="f-ec2n" className={labelClass} style={labelStyle}>Name</label>
              <input id="f-ec2n" type="text" className={fieldClass} {...form2.register('emergencyContact2Name')} />
            </div>
            <div>
              <label htmlFor="f-ec2p" className={labelClass} style={labelStyle}>Phone</label>
              <input id="f-ec2p" type="tel" className={fieldClass} {...form2.register('emergencyContact2Phone')} />
            </div>
            <div aria-hidden="true" />
          </div>

          <h4 className="text-sm font-semibold mb-4" style={{ color: 'var(--color-ochre-400)' }}>Medical Information</h4>
          <p className="text-xs mb-4" style={{ color: 'rgba(255,255,255,0.45)' }}>
            This is optional but helps us support you safely. All medical information is confidential.
          </p>
          <div className="space-y-5 mb-8">
            {[
              { id: 'f-medical', label: 'Medical Conditions', name: 'medicalConditions' as const, placeholder: 'e.g. asthma, diabetes (or "none")' },
              { id: 'f-meds',    label: 'Current Medications', name: 'medications' as const,       placeholder: 'Any medications you are currently taking' },
              { id: 'f-allergy', label: 'Allergies',           name: 'allergies' as const,         placeholder: 'Food, environmental, or medication allergies' },
            ].map(field => (
              <div key={field.id}>
                <label htmlFor={field.id} className={labelClass} style={labelStyle}>
                  {field.label} <span className="text-xs ml-1" style={{ color: 'rgba(255,255,255,0.4)' }}>(optional)</span>
                </label>
                <input id={field.id} type="text" className={fieldClass} placeholder={field.placeholder}
                  {...form2.register(field.name)} />
              </div>
            ))}
          </div>

          <div className="flex justify-between">
            <button type="button" onClick={() => setStep(1)} className="btn-ghost">
              <ChevronLeft size={16} aria-hidden="true" /> Back
            </button>
            <button type="submit" className="btn-primary">
              Continue <ChevronRight size={16} aria-hidden="true" />
            </button>
          </div>
        </form>
      )}

      {/* ─── Step 3 ─── */}
      {step === 3 && (
        <form onSubmit={form3.handleSubmit(onStep3)} noValidate aria-label="Step 3: Consent and submit">
          <h3 className="font-display font-semibold text-xl mb-6" style={{ color: 'var(--color-foreground)' }}>
            Consent & Confirmation
          </h3>

          <div className="space-y-5 mb-8">
            {/* Required consents */}
            {[
              {
                id:   'c-data',
                name: 'dataConsent' as const,
                label: 'Data Consent (Required)',
                desc:  'I consent to Mudyin Aboriginal Healing Centre collecting and storing my personal information for program administration purposes, in accordance with the Australian Privacy Act.',
                required: true,
              },
              {
                id:   'c-medical',
                name: 'medicalConsentGiven' as const,
                label: 'Medical Treatment Consent (Required)',
                desc:  'In the event of a medical emergency where I cannot be contacted, I consent to emergency medical treatment being provided to the participant.',
                required: true,
              },
              {
                id:   'c-conduct',
                name: 'codeOfConductAgreed' as const,
                label: 'Code of Conduct (Required)',
                desc:  'I agree to abide by Mudyin\'s Code of Conduct, which promotes a safe, respectful, and culturally appropriate environment for all participants.',
                required: true,
              },
              {
                id:   'c-media',
                name: 'mediaConsent' as const,
                label: 'Media Consent (Optional)',
                desc:  'I consent to Mudyin using photos or video that may include the participant for program promotion and reporting purposes. This can be withdrawn at any time.',
                required: false,
              },
            ].map(consent => {
              const error = form3.formState.errors[consent.name]
              return (
                <div
                  key={consent.id}
                  className="flex items-start gap-3 p-4 rounded-xl"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(65,70,72,0.5)',
                  }}
                >
                  <input
                    id={consent.id}
                    type="checkbox"
                    className="mt-1 w-4 h-4 flex-shrink-0 rounded"
                    aria-required={consent.required}
                    aria-describedby={`${consent.id}-desc`}
                    aria-invalid={!!error}
                    style={{ accentColor: 'var(--color-ochre-500)' }}
                    {...form3.register(consent.name as keyof Step3Data)}
                  />
                  <div>
                    <label htmlFor={consent.id} className="text-sm font-medium block mb-1" style={{ color: 'rgba(255,255,255,0.9)', cursor: 'pointer' }}>
                      {consent.label}
                    </label>
                    <p id={`${consent.id}-desc`} className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
                      {consent.desc}
                    </p>
                    {error && (
                      <p role="alert" className="mt-2 text-xs flex items-center gap-1" style={{ color: '#f87171' }}>
                        <AlertCircle size={11} aria-hidden="true" /> {error.message as string}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Additional notes */}
          <div className="mb-8">
            <label htmlFor="f-notes" className={labelClass} style={labelStyle}>
              Additional Notes <span className="text-xs ml-1" style={{ color: 'rgba(255,255,255,0.4)' }}>(optional)</span>
            </label>
            <textarea
              id="f-notes"
              rows={3}
              className="input-dark resize-none"
              placeholder="Anything else we should know to support you well…"
              {...form3.register('additionalNotes')}
            />
          </div>

          {serverError && (
            <div
              className="rounded-xl p-4 mb-5 text-sm flex items-center gap-3"
              role="alert"
              style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5' }}
            >
              <AlertCircle size={16} aria-hidden="true" /> {serverError}
            </div>
          )}

          <div className="flex justify-between">
            <button type="button" onClick={() => setStep(2)} className="btn-ghost">
              <ChevronLeft size={16} aria-hidden="true" /> Back
            </button>
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting
                ? <><Loader2 size={16} className="animate-spin" aria-hidden="true" /> Submitting…</>
                : <><CheckCircle2 size={16} aria-hidden="true" /> Submit Enrollment</>
              }
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
