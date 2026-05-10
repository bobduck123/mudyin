'use client'

import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'

type Milestone = {
  year: string
  title: string
  detail: string
}

function MilestoneItem({ milestone, index }: { milestone: Milestone; index: number }) {
  const { ref, isInView } = useIntersectionObserver<HTMLLIElement>({ threshold: 0.2 })

  return (
    <li
      ref={ref}
      className="relative pl-10 pb-11 last:pb-0 animate-on-scroll"
      style={{
        transitionDelay: `${index * 120}ms`,
        opacity: isInView ? 1 : undefined,
        transform: isInView ? 'translateY(0)' : undefined,
      }}
    >
      <span
        className="absolute left-0 top-1 w-4 h-4 rounded-full healing-disc -translate-x-[9px]"
        aria-hidden="true"
      />
      <div className="flex items-start gap-5">
        <span
          className="font-display font-bold text-3xl flex-shrink-0 w-16"
          style={{ color: 'var(--color-ochre-400)' }}
        >
          {milestone.year}
        </span>
        <div>
          <h3 className="font-display font-semibold text-xl mb-2">{milestone.title}</h3>
          <p className="text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
            {milestone.detail}
          </p>
        </div>
      </div>
    </li>
  )
}

export function CountryMilestoneTrail({ milestones }: { milestones: Milestone[] }) {
  return (
    <div className="grid lg:grid-cols-12 gap-8">
      <aside className="lg:col-span-5 rounded-2xl p-6 healing-panel grounded-lines healing-border">
        <p className="text-xs uppercase tracking-[0.16em] mb-2" style={{ color: 'rgba(255,255,255,0.56)' }}>
          Country Map Trail
        </p>
        <h3 className="font-display text-3xl mb-4">Tracks Across Time</h3>
        <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.72)' }}>
          The trail below follows key turning points where community action scaled into lasting impact.
        </p>
        <div className="relative h-56 rounded-xl healing-border" style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
          <svg viewBox="0 0 300 220" className="absolute inset-0 w-full h-full opacity-70" aria-hidden="true">
            <defs>
              <radialGradient id="trailSunDisc" cx="50%" cy="50%" r="58%">
                <stop offset="0%" stopColor="rgba(200,167,93,0.9)" />
                <stop offset="58%" stopColor="rgba(184,117,85,0.55)" />
                <stop offset="100%" stopColor="rgba(2,2,2,0.92)" />
              </radialGradient>
            </defs>
            <path
              d="M20,160 C70,120 110,180 160,130 C205,85 235,115 280,55"
              fill="none"
              stroke="rgba(223,206,214,0.55)"
              strokeWidth="1.8"
              strokeDasharray="3 7"
            />
            <circle cx="85" cy="138" r="8" fill="url(#trailSunDisc)" />
            <circle cx="150" cy="140" r="7" fill="url(#trailSunDisc)" />
            <circle cx="212" cy="102" r="8" fill="url(#trailSunDisc)" />
          </svg>
          <span className="absolute left-[24%] top-[58%] w-3 h-3 rounded-full healing-disc" />
          <span className="absolute left-[48%] top-[55%] w-3 h-3 rounded-full healing-disc" />
          <span className="absolute left-[70%] top-[40%] w-3 h-3 rounded-full healing-disc" />
        </div>
      </aside>

      <div className="lg:col-span-7">
        <ol
          className="relative"
          aria-label="Mudyin history timeline"
          style={{ borderLeft: '2px solid rgba(223,206,214,0.3)' }}
        >
          {milestones.map((milestone, idx) => (
            <MilestoneItem key={milestone.year} milestone={milestone} index={idx} />
          ))}
        </ol>
      </div>
    </div>
  )
}
