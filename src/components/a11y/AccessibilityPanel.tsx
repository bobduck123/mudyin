'use client'

import { useEffect, useMemo, useState } from 'react'
import { Accessibility, X } from 'lucide-react'

type TextScale = 0 | 1 | 2 | 3

type A11yState = {
  reducedMotion: boolean
  highContrast: boolean
  largerType: boolean
  simplerLayout: boolean
  textScale: TextScale
}

const STORAGE_KEY = 'mudyin_a11y_v1'

const initialState: A11yState = {
  reducedMotion: false,
  highContrast: false,
  largerType: false,
  simplerLayout: false,
  textScale: 1,
}

export function AccessibilityPanel() {
  const [open, setOpen] = useState(false)
  const [ready, setReady] = useState(false)
  const [state, setState] = useState<A11yState>(initialState)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<A11yState>
        setState((prev) => ({
          ...prev,
          ...parsed,
          textScale:
            parsed.textScale === 1 || parsed.textScale === 2 || parsed.textScale === 3
              ? parsed.textScale
              : 1,
        }))
      }
    } catch {
      // Ignore malformed local storage and use defaults.
    } finally {
      setReady(true)
    }
  }, [])

  useEffect(() => {
    if (!ready) return

    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))

    const body = document.body
    body.classList.toggle('a11y-reduced-motion', state.reducedMotion)
    body.classList.toggle('a11y-high-contrast', state.highContrast)
    body.classList.toggle('a11y-simple-layout', state.simplerLayout)

    body.classList.remove('a11y-large-text-1', 'a11y-large-text-2', 'a11y-large-text-3')
    if (state.largerType) {
      body.classList.add(`a11y-large-text-${state.textScale}`)
    }
  }, [state, ready])

  const summary = useMemo(() => {
    const items = [
      state.reducedMotion,
      state.highContrast,
      state.largerType,
      state.simplerLayout,
    ].filter(Boolean).length
    return items
  }, [state])

  if (!ready) return null

  return (
    <div className="fixed bottom-5 right-5 z-[60]">
      {open && (
        <div
          className="w-72 rounded-2xl p-4 mb-3 shadow-xl healing-panel healing-border"
          style={{
            backdropFilter: 'blur(12px)',
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold healing-accent-hint">Accessibility</p>
            <button
              onClick={() => setOpen(false)}
              className="btn-ghost p-1"
              aria-label="Close accessibility panel"
            >
              <X size={14} />
            </button>
          </div>

          <div className="space-y-2 text-xs">
            <label className="flex items-center justify-between gap-3">
              <span>Reduce motion</span>
              <input
                type="checkbox"
                checked={state.reducedMotion}
                onChange={(e) =>
                  setState((prev) => ({ ...prev, reducedMotion: e.target.checked }))
                }
              />
            </label>
            <label className="flex items-center justify-between gap-3">
              <span>High contrast + borders</span>
              <input
                type="checkbox"
                checked={state.highContrast}
                onChange={(e) =>
                  setState((prev) => ({ ...prev, highContrast: e.target.checked }))
                }
              />
            </label>
            <label className="flex items-center justify-between gap-3">
              <span>Larger type</span>
              <input
                type="checkbox"
                checked={state.largerType}
                onChange={(e) =>
                  setState((prev) => ({ ...prev, largerType: e.target.checked }))
                }
              />
            </label>
            {state.largerType && (
              <div className="pl-1">
                <p className="mb-1" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  Text size
                </p>
                <div className="flex gap-1">
                  {[1, 2, 3].map((step) => (
                    <button
                      key={step}
                      onClick={() =>
                        setState((prev) => ({ ...prev, textScale: step as TextScale }))
                      }
                      className="px-2 py-1 rounded text-[11px]"
                      style={
                        state.textScale === step
                          ? { backgroundColor: 'var(--color-ochre-400)', color: 'var(--color-charcoal-950)' }
                          : { backgroundColor: 'rgba(255,255,255,0.08)' }
                      }
                    >
                      {step}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <label className="flex items-center justify-between gap-3">
              <span>Simpler layout</span>
              <input
                type="checkbox"
                checked={state.simplerLayout}
                onChange={(e) =>
                  setState((prev) => ({ ...prev, simplerLayout: e.target.checked }))
                }
              />
            </label>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((prev) => !prev)}
        className="h-12 rounded-full inline-flex items-center justify-center gap-2 px-4 shadow-lg btn-clay-glass"
        aria-label="Open accessibility settings"
        aria-expanded={open}
        style={{
          color: summary > 0 ? '#ffffff' : 'rgba(255,255,255,0.88)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <Accessibility size={18} />
        <span className="text-xs font-semibold">Access</span>
      </button>
    </div>
  )
}
