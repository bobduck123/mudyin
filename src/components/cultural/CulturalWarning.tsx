// Standard cultural warning used in Australian Aboriginal and Torres Strait
// Islander media. Applied to content that may contain images, voices, or names
// of people who have passed away.

interface Props {
  compact?: boolean
}

export function CulturalWarning({ compact = false }: Props) {
  if (compact) {
    return (
      <p
        className="text-xs py-1 px-3 rounded-full inline-block mb-3"
        style={{
          backgroundColor: 'rgba(184,117,85,0.15)',
          color: 'rgba(229,170,56,0.9)',
          border: '1px solid rgba(184,117,85,0.3)',
        }}
        role="note"
        aria-label="Cultural warning"
      >
        ⚠ Cultural warning — may contain images or names of deceased persons
      </p>
    )
  }

  return (
    <div
      role="note"
      aria-label="Cultural warning notice"
      className="rounded-xl p-4 mb-6"
      style={{
        backgroundColor: 'rgba(184,117,85,0.12)',
        border: '1px solid rgba(184,117,85,0.35)',
      }}
    >
      <p className="text-sm font-semibold mb-1" style={{ color: 'var(--color-ochre-400)' }}>
        Cultural Warning
      </p>
      <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>
        This content may contain images, voices, or names of Aboriginal and Torres Strait Islander
        people who have passed away. We ask that you be mindful of this when sharing.
      </p>
    </div>
  )
}
