'use client'

import { useState, useEffect } from 'react'
import { Phone, MessageCircle, Globe, X } from 'lucide-react'

interface CrisisResource {
  name: string
  description: string
  phone?: string
  sms?: string
  web?: string
  supportTypes: string[]
}

interface CrisisResourceBannerProps {
  triggers: string[]
  onDismiss?: () => void
  autoHide?: boolean
}

export function CrisisResourceBanner({
  triggers: _triggers,
  onDismiss,
  autoHide: _autoHide = false,
}: CrisisResourceBannerProps) {
  const [resources, setResources] = useState<CrisisResource[]>([])
  const [isVisible, setIsVisible] = useState(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadResources()
  }, [])

  async function loadResources() {
    try {
      const response = await fetch('/api/crisis-resources')
      if (!response.ok) throw new Error('Failed to fetch resources')

      const data = await response.json()
      setResources(data.resources || [])
    } catch (error) {
      console.error('Error loading crisis resources:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isVisible || loading || resources.length === 0) {
    return null
  }

  return (
    <div className="bg-gradient-to-r from-red-900/20 to-red-800/20 border-l-4 border-red-500 p-4 rounded-lg mb-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-red-300 font-semibold mb-3">
            ⚠️ If you or someone you know needs support:
          </h3>

          <div className="space-y-2">
            {resources.slice(0, 3).map((resource, idx) => (
              <div key={idx} className="bg-white/5 p-3 rounded">
                <p className="text-white font-medium text-sm mb-1">
                  {resource.name}
                </p>
                <p className="text-white/70 text-xs mb-2">
                  {resource.description}
                </p>

                <div className="flex gap-3 flex-wrap">
                  {resource.phone && (
                    <a
                      href={`tel:${resource.phone}`}
                      className="flex items-center gap-1 text-red-300 hover:text-red-200 text-xs transition"
                    >
                      <Phone size={14} />
                      {resource.phone}
                    </a>
                  )}
                  {resource.sms && (
                    <a
                      href={`sms:${resource.sms}`}
                      className="flex items-center gap-1 text-red-300 hover:text-red-200 text-xs transition"
                    >
                      <MessageCircle size={14} />
                      SMS: {resource.sms}
                    </a>
                  )}
                  {resource.web && (
                    <a
                      href={resource.web}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-red-300 hover:text-red-200 text-xs transition"
                    >
                      <Globe size={14} />
                      Web
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          <p className="text-white/60 text-xs mt-3">
            These services are confidential, free, and available 24/7. You don&apos;t have to
            go through this alone.
          </p>
        </div>

        <button
          onClick={() => {
            setIsVisible(false)
            onDismiss?.()
          }}
          className="text-white/60 hover:text-white transition flex-shrink-0"
          aria-label="Dismiss crisis resources"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  )
}
