import { cn } from '@/lib/utils'

interface Props {
  className?: string
  label?: string
}

/** Overlaid badge for ICIP-protected cultural images. */
export function ICIPBadge({ className, label = '© Mudyin — ICIP Protected' }: Props) {
  return (
    <div
      className={cn('absolute bottom-2 left-2 z-10', className)}
      aria-label="Indigenous Cultural and Intellectual Property protected content"
    >
      <span
        className="text-xs font-medium px-2 py-1 rounded"
        style={{
          backgroundColor: 'rgba(0,0,0,0.55)',
          color: 'rgba(229,170,56,0.85)',
          backdropFilter: 'blur(4px)',
          border: '1px solid rgba(210,168,85,0.2)',
        }}
      >
        {label}
      </span>
    </div>
  )
}
