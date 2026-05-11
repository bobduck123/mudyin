'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MapPin, Phone, Mail, Clock, ChevronDown } from 'lucide-react'
import { ContactForm } from '@/components/forms/ContactForm'
import { BookingRequestForm } from '@/components/forms/BookingRequestForm'
import { siteConfig, faqs } from '@/lib/data'
import { mudyinProgramStreams } from '@/lib/mudyin-operational-model'

const contactCards = [
  {
    Icon: MapPin,
    title: 'Location',
    lines: ['Location confirmed during intake', 'Public delivery by request only'],
    href: 'https://maps.google.com/?q=Campbelltown+Park+NSW',
    cta: null,
  },
  {
    Icon: Phone,
    title: 'Phone',
    lines: ['0478 796 298', 'Uncle Dave Bell'],
    href: 'tel:0478796298',
    cta: 'Call now',
  },
  {
    Icon: Mail,
    title: 'Email',
    lines: [siteConfig.email, 'Response within 1-2 business days'],
    href: `mailto:${siteConfig.email}`,
    cta: 'Send email',
  },
  {
    Icon: Clock,
    title: 'Current intake',
    lines: ['Enquiries and booking requests open', 'No booking is confirmed online'],
    href: null,
    cta: null,
  },
]

const faqCategories = Array.from(new Set(faqs.map(f => f.category)))

type ContactPageClientProps = {
  programSlug: string
}

export function ContactPageClient({ programSlug }: ContactPageClientProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [activeCategory, setActiveCategory] = useState('Programs')
  const selectedProgram = mudyinProgramStreams.find((stream) => stream.slug === programSlug)
  const defaultPreferredService = selectedProgram?.name ?? ''

  const filtered = faqs.filter(f => f.category === activeCategory)

  return (
    <>
      <section className="pt-32 pb-16 section-padding" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="container-wide">
          <div className="max-w-2xl">
            <span className="section-label">Get in Touch</span>
            <h1
              className="font-display font-semibold mt-2 mb-5"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'var(--color-foreground)' }}
            >
              Enquiries and Booking Requests
            </h1>
            <p className="text-lg leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
              Send a general enquiry or booking request for a Mudyin stream. Requests are reviewed by the team before anything is confirmed.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-16 section-padding" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="container-wide">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
            {contactCards.map(({ Icon, title, lines, href, cta }) => (
              <div key={title} className="card-dark p-6">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: 'rgba(111,138,120,0.14)', border: '1px solid rgba(111,138,120,0.28)' }}
                >
                  <Icon size={18} style={{ color: 'var(--color-ochre-400)' }} aria-hidden="true" />
                </div>
                <h2 className="font-display font-semibold text-lg mb-2" style={{ color: 'var(--color-foreground)' }}>
                  {title}
                </h2>
                {lines.map((line, i) => (
                  <p key={i} className="text-sm" style={{ color: i === 0 ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.5)' }}>
                    {line}
                  </p>
                ))}
                {href && cta && (
                  <a
                    href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="btn-ghost text-xs mt-4 px-0 py-0 hover:underline"
                    style={{ color: 'var(--color-ochre-400)' }}
                  >
                    {cta} &gt;
                  </a>
                )}
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            <div id="general-enquiry">
              <h2 className="font-display font-semibold text-2xl mb-6" style={{ color: 'var(--color-foreground)' }}>
                General enquiry
              </h2>
              <ContactForm key={`enquiry-${defaultPreferredService}`} defaultPreferredService={defaultPreferredService} />
            </div>

            <div id="booking-request">
              <h2 className="font-display font-semibold text-2xl mb-6" style={{ color: 'var(--color-foreground)' }}>
                Booking request
              </h2>
              <BookingRequestForm key={`booking-${defaultPreferredService}`} defaultPreferredService={defaultPreferredService} />
            </div>
          </div>

          <div className="mt-16">
            <h2 className="font-display font-semibold text-2xl mb-6" style={{ color: 'var(--color-foreground)' }}>
              Frequently asked questions
            </h2>

            <div className="flex flex-wrap gap-2 mb-6" role="tablist" aria-label="FAQ categories">
              {faqCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => { setActiveCategory(cat); setOpenFaq(null) }}
                  role="tab"
                  aria-selected={activeCategory === cat}
                  className="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200"
                  style={
                    activeCategory === cat
                      ? { backgroundColor: 'var(--color-ochre-500)', color: 'var(--color-charcoal-950)' }
                      : { border: '1px solid rgba(255,255,255,0.18)', color: 'rgba(255,255,255,0.62)' }
                  }
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="space-y-2" role="list">
              {filtered.map((faq, i) => {
                const isOpen = openFaq === i
                return (
                  <div
                    key={i}
                    className="rounded-xl overflow-hidden"
                    style={{
                      border: isOpen ? '1px solid rgba(200,167,93,0.32)' : '1px solid rgba(255,255,255,0.16)',
                      backgroundColor: isOpen ? 'rgba(200,167,93,0.08)' : 'rgba(255,255,255,0.04)',
                      transition: 'all 0.2s ease',
                    }}
                    role="listitem"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      className="w-full flex items-start justify-between gap-3 p-4 text-left"
                    >
                      <span
                        className="font-medium text-sm"
                        style={{ color: isOpen ? 'var(--color-ochre-400)' : 'rgba(255,255,255,0.85)' }}
                      >
                        {faq.question}
                      </span>
                      <ChevronDown
                        size={16}
                        className="flex-shrink-0 mt-0.5 transition-transform duration-200"
                        style={{
                          transform: isOpen ? 'rotate(180deg)' : 'none',
                          color: 'rgba(255,255,255,0.45)',
                        }}
                        aria-hidden="true"
                      />
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4">
                        <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <p className="text-sm mt-6" style={{ color: 'rgba(255,255,255,0.48)' }}>
              Still have questions?{' '}
              <Link href="#booking-request" style={{ color: 'var(--color-ochre-400)' }} className="hover:underline">
                Send a booking request
              </Link>{' '}
              or call us on{' '}
              <a href="tel:0478796298" style={{ color: 'var(--color-ochre-400)' }} className="hover:underline">
                0478 796 298
              </a>.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
