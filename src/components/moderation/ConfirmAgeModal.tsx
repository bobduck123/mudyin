'use client'

import { useState, useCallback } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import * as RadioGroup from '@radix-ui/react-radio-group'
import * as Checkbox from '@radix-ui/react-checkbox'

interface ConfirmAgeModalProps {
  isOpen: boolean
  onConfirm: (ageGroup: string) => void
}

export function ConfirmAgeModal({
  isOpen,
  onConfirm,
}: ConfirmAgeModalProps) {
  const [selectedAge, setSelectedAge] = useState<string>('')
  const [confirmed, setConfirmed] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = useCallback(async () => {
    if (!selectedAge || !confirmed) {
      return
    }

    setIsSubmitting(true)
    try {
      onConfirm(selectedAge)
    } finally {
      setIsSubmitting(false)
    }
  }, [selectedAge, confirmed, onConfirm])

  const isValid = selectedAge && confirmed

  return (
    <Dialog.Root open={isOpen} onOpenChange={() => {}}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl p-6 shadow-xl"
          style={{ backgroundColor: 'white' }}
          onPointerDownOutside={e => e.preventDefault()}
          onEscapeKeyDown={e => e.preventDefault()}
        >
          <div className="mb-6">
            <Dialog.Title className="font-display text-2xl font-bold">
              Verify Your Age
            </Dialog.Title>
            <Dialog.Description className="mt-2 text-sm text-gray-600">
              Mudyin is committed to keeping our community safe. Please confirm your age to continue.
            </Dialog.Description>
          </div>

          <div className="space-y-6 py-6">
            {/* Age Selection */}
            <div className="space-y-4">
              <label className="text-sm font-semibold uppercase tracking-widest">
                How old are you?
              </label>
              <RadioGroup.Root value={selectedAge} onValueChange={setSelectedAge}>
                {['13-17', '18-25', '26+', '<13'].map(age => (
                  <div
                    key={age}
                    className="flex items-center space-x-3 rounded-lg border border-gray-300 p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <RadioGroup.Item
                      value={age}
                      id={`age-${age}`}
                      className="h-5 w-5 flex-shrink-0 rounded-full border-2 border-gray-400 focus-visible:outline focus-visible:outline-2"
                      style={{
                        backgroundColor:
                          selectedAge === age ? 'var(--color-ochre-400)' : 'white',
                        borderColor:
                          selectedAge === age
                            ? 'var(--color-ochre-400)'
                            : '#d1d5db',
                      }}
                    >
                      <RadioGroup.Indicator className="flex items-center justify-center">
                        <div
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: 'white' }}
                        />
                      </RadioGroup.Indicator>
                    </RadioGroup.Item>
                    <label
                      htmlFor={`age-${age}`}
                      className="flex-1 cursor-pointer font-medium"
                    >
                      {age === '<13'
                        ? 'Under 13 years old'
                        : age === '26+'
                          ? '26 years or older'
                          : `${age} years old`}
                    </label>
                  </div>
                ))}
              </RadioGroup.Root>

              {selectedAge === '<13' && (
                <div
                  className="rounded-lg border-l-4 p-4"
                  style={{
                    backgroundColor: 'rgba(157, 193, 131, 0.08)',
                    borderColor: 'var(--color-sage-500)',
                  }}
                >
                  <p className="text-sm text-gray-700">
                    <strong>Note:</strong> If you&apos;re under 13, we&apos;ll need your parent or guardian&apos;s permission. You&apos;ll receive an email asking for their consent.
                  </p>
                </div>
              )}
            </div>

            {/* Confirmation Checkbox */}
            <div className="flex items-start space-x-3">
              <Checkbox.Root
                id="confirm-age"
                checked={confirmed}
                onCheckedChange={(checked) => setConfirmed(checked === true)}
                className="mt-1 h-5 w-5 rounded border-2 border-gray-400 focus-visible:outline focus-visible:outline-2"
                style={{
                  backgroundColor:
                    confirmed ? 'var(--color-ochre-400)' : 'white',
                  borderColor: confirmed
                    ? 'var(--color-ochre-400)'
                    : '#d1d5db',
                }}
              >
                <Checkbox.Indicator className="flex items-center justify-center">
                  <svg
                    className="h-3 w-3 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </Checkbox.Indicator>
              </Checkbox.Root>
              <label
                htmlFor="confirm-age"
                className="text-sm leading-relaxed cursor-pointer"
              >
                I confirm that I am {selectedAge === '<13' ? 'under 13' : selectedAge}{' '}
                years old and I have read and agree to the Community Guidelines
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSubmit}
              disabled={!isValid || isSubmitting}
              className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Confirming...' : 'Continue'}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
