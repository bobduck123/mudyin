// ─── Acknowledgement of Country ──────────────────────────────────────────────
// IMPORTANT: The text of this acknowledgement must be reviewed and approved
// by Uncle Dave Bell and Kaiyu Bayles before launch. The text below is a
// respectful placeholder that follows AIATSIS guidelines.
// ─────────────────────────────────────────────────────────────────────────────

interface Props {
  variant?: 'banner' | 'footer' | 'full'
}

export function AcknowledgementOfCountry({ variant = 'banner' }: Props) {
  if (variant === 'banner') {
    return (
      <div
        role="complementary"
        aria-label="Acknowledgement of Country"
        style={{
          backgroundColor: 'rgba(20,20,20,0.95)',
          borderBottom: '1px solid rgba(210,168,85,0.2)',
        }}
        className="py-2 px-4 text-center"
      >
        <p className="text-xs" style={{ color: 'rgba(229,170,56,0.75)' }}>
          Mudyin Aboriginal Healing Centre acknowledges the Traditional Custodians of Country throughout
          Australia and pays respect to Elders past, present, and emerging.
        </p>
      </div>
    )
  }

  if (variant === 'footer') {
    return (
      <div
        role="complementary"
        aria-label="Acknowledgement of Country"
        className="mt-8 pt-8"
        style={{ borderTop: '1px solid rgba(65,70,72,0.4)' }}
      >
        <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
          <span style={{ color: 'var(--color-ochre-500)', fontWeight: 600 }}>
            Acknowledgement of Country:
          </span>{' '}
          We acknowledge the Traditional Custodians of the lands on which we live, learn, and work.
          We pay our deepest respects to Elders past, present, and emerging, and we recognise the
          ongoing spiritual and cultural connection Aboriginal and Torres Strait Islander peoples
          have with their Country.
        </p>
      </div>
    )
  }

  // Full variant — for dedicated pages
  return (
    <section
      aria-label="Acknowledgement of Country"
      className="py-12 px-6"
      style={{
        background: 'linear-gradient(135deg, rgba(184,117,85,0.1), rgba(210,168,85,0.05))',
        borderLeft: '4px solid var(--color-ochre-500)',
      }}
    >
      <span className="section-label">Acknowledgement</span>
      <h2
        className="text-2xl font-display font-semibold mt-2 mb-4"
        style={{ color: 'var(--color-foreground)' }}
      >
        Acknowledgement of Country
      </h2>
      <p className="leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.8)' }}>
        Mudyin Aboriginal Healing Centre acknowledges the Traditional Custodians of Country throughout
        Australia and recognises their continuing connection to land, waters, culture, and community.
        We pay our deepest respects to Elders past, present, and emerging.
      </p>
      <p className="leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
        The work of Mudyin is grounded in Aboriginal sovereignty, culture, and self-determination.
        We are committed to walking alongside communities in a spirit of truth-telling, healing, and
        genuine partnership.
      </p>
    </section>
  )
}
