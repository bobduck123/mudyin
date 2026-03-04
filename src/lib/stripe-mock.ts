// ─── Stripe Testing Placeholder ──────────────────────────────────────────────
// This module provides a functional testing interface for Stripe payments.
//
// HOW IT WORKS:
//   - When NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is set to a real `pk_test_...` key,
//     real Stripe test-mode processing occurs (no real money moves).
//   - When the key is absent, a mock implementation simulates the full flow
//     so the UI can be tested without any Stripe account.
//
// TO ACTIVATE REAL TEST MODE:
//   1. Create a free Stripe account at https://stripe.com
//   2. Go to Developers → API Keys → Test mode keys
//   3. Add to .env.local:
//        NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_XXXX
//        STRIPE_SECRET_KEY=sk_test_XXXX
//
// STRIPE TEST CARDS (use these in the UI when testing):
//   Visa success:          4242 4242 4242 4242  Exp: any future  CVV: any
//   Requires 3D Secure:    4000 0025 0000 3155
//   Card declined:         4000 0000 0000 9995
//   Insufficient funds:    4000 0000 0000 9995
// ─────────────────────────────────────────────────────────────────────────────

export const STRIPE_ENABLED =
  typeof process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY === 'string' &&
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.startsWith('pk_')

export const STRIPE_IS_TEST_MODE =
  STRIPE_ENABLED &&
  (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.includes('test') ?? false)

export type MockPaymentResult = {
  success: boolean
  paymentIntentId: string
  receiptNumber: string
  amount: number
  currency: string
  error?: string
}

/** Simulates a successful payment for UI/integration testing without Stripe keys. */
export async function mockProcessPayment(
  amount: number,
  donorEmail: string,
  donorName: string,
): Promise<MockPaymentResult> {
  // Simulate network latency
  await new Promise(r => setTimeout(r, 1800))

  const timestamp = Date.now().toString(36).toUpperCase()
  const receiptNumber = `MUDYIN-TEST-${timestamp}`

  console.info('[Stripe Mock] Payment processed (test mode — no real transaction)')
  console.info(`[Stripe Mock] Amount: $${amount} AUD | Donor: ${donorName} <${donorEmail}>`)
  console.info(`[Stripe Mock] Receipt: ${receiptNumber}`)

  return {
    success:         true,
    paymentIntentId: `pi_test_${timestamp}`,
    receiptNumber,
    amount,
    currency:        'aud',
  }
}

/** Generates a fake receipt number for display purposes in mock mode. */
export function generateMockReceiptNumber(): string {
  const year = new Date().getFullYear()
  const rand = Math.floor(Math.random() * 90000) + 10000
  return `MUDYIN-${year}-${rand}`
}

/** Returns the stripe publishable key or null if not configured. */
export function getStripePublishableKey(): string | null {
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  if (!key || !key.startsWith('pk_')) return null
  return key
}
