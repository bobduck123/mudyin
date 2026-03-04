'use client'

import Link from 'next/link'
import { Facebook, Instagram, Youtube, MapPin, Phone, Mail, Heart } from 'lucide-react'
import { siteConfig } from '@/lib/data'
import { AcknowledgementOfCountry } from '@/components/cultural/AcknowledgementOfCountry'
import { NewsletterForm } from '@/components/forms/NewsletterForm'

const programLinks = [
  { label: 'Young Spirit Mentoring (YSMP)', href: '/programs/ysmp' },
  { label: 'Thrive Tribe',                  href: '/programs/thrive-tribe' },
  { label: 'Healing Centre',                href: '/programs/healing-centre' },
  { label: 'All Programs',                  href: '/programs' },
]

const involvedLinks = [
  { label: 'Enroll in a Program',  href: '/enroll' },
  { label: 'Volunteer',            href: '/contact?type=volunteer' },
  { label: 'Partner With Us',      href: '/contact?type=partnership' },
  { label: 'Make a Donation',      href: '/donate' },
  { label: 'Monthly Giving',       href: '/donate#monthly' },
]

const legalLinks = [
  { label: 'Privacy Policy',         href: '/privacy' },
  { label: 'Terms of Use',           href: '/terms' },
  { label: 'Accessibility',          href: '/accessibility' },
  { label: 'ICIP Protocols',         href: '/icip' },
  { label: 'Child Safety Policy',    href: '/about/child-safety' },
]

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer role="contentinfo" aria-label="Site footer">
      {/* Main footer */}
      <div
        className="section-padding py-16 lg:py-20"
        style={{
          backgroundColor: 'rgba(10,10,10,1)',
          borderTop: '1px solid rgba(65,70,72,0.35)',
        }}
      >
        <div className="container-wide">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

            {/* Brand column */}
            <div className="lg:col-span-1">
              <Link href="/" aria-label="Mudyin — home">
                <span
                  className="font-display font-bold text-2xl block mb-0.5"
                  style={{ color: 'var(--color-ochre-400)' }}
                >
                  Mudyin
                </span>
                <span
                  className="font-body text-xs tracking-widest uppercase block mb-1"
                  style={{ color: 'rgba(255,255,255,0.4)' }}
                >
                  Aboriginal Healing Centre
                </span>
                <span
                  className="font-script text-lg block"
                  style={{ color: 'rgba(210,168,85,0.5)' }}
                >
                  Two Worlds Strong
                </span>
              </Link>

              <p className="mt-4 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
                Healing, empowering, and connecting Aboriginal communities through culture, community, and 25 years of purpose.
              </p>

              {/* Social links */}
              <div className="flex gap-3 mt-6">
                {[
                  { href: siteConfig.social.facebook,  Icon: Facebook,  label: 'Facebook' },
                  { href: siteConfig.social.instagram, Icon: Instagram, label: 'Instagram' },
                  { href: siteConfig.social.youtube,   Icon: Youtube,   label: 'YouTube' },
                ].map(({ href, Icon, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Mudyin on ${label}`}
                    className="w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-200"
                    style={{
                      border: '1px solid rgba(65,70,72,0.5)',
                      color: 'rgba(255,255,255,0.5)',
                    }}
                    onMouseEnter={e => {
                      const el = e.currentTarget
                      el.style.backgroundColor = 'rgba(210,168,85,0.15)'
                      el.style.borderColor = 'rgba(210,168,85,0.4)'
                      el.style.color = 'var(--color-ochre-400)'
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget
                      el.style.backgroundColor = 'transparent'
                      el.style.borderColor = 'rgba(65,70,72,0.5)'
                      el.style.color = 'rgba(255,255,255,0.5)'
                    }}
                  >
                    <Icon size={15} aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>

            {/* Programs column */}
            <div>
              <h3
                className="text-xs font-semibold tracking-widest uppercase mb-4"
                style={{ color: 'rgba(255,255,255,0.35)' }}
              >
                Programs
              </h3>
              <ul className="space-y-2.5">
                {programLinks.map(link => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm transition-colors duration-200 block"
                      style={{ color: 'rgba(255,255,255,0.6)' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--color-ochre-400)' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.6)' }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Get Involved column */}
            <div>
              <h3
                className="text-xs font-semibold tracking-widest uppercase mb-4"
                style={{ color: 'rgba(255,255,255,0.35)' }}
              >
                Get Involved
              </h3>
              <ul className="space-y-2.5">
                {involvedLinks.map(link => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm transition-colors duration-200 block"
                      style={{ color: 'rgba(255,255,255,0.6)' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--color-ochre-400)' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.6)' }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Contact */}
              <div className="mt-8 space-y-2">
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="flex items-center gap-2 text-sm transition-colors duration-200"
                  style={{ color: 'rgba(255,255,255,0.6)' }}
                >
                  <Mail size={13} aria-hidden="true" />
                  {siteConfig.email}
                </a>
                <a
                  href={`tel:${siteConfig.phone.replace(/\s/g, '')}`}
                  className="flex items-center gap-2 text-sm transition-colors duration-200"
                  style={{ color: 'rgba(255,255,255,0.6)' }}
                >
                  <Phone size={13} aria-hidden="true" />
                  {siteConfig.phone}
                </a>
                <div className="flex items-start gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  <MapPin size={13} aria-hidden="true" className="mt-0.5 flex-shrink-0" />
                  <span>{siteConfig.address.suburb}, {siteConfig.address.state}</span>
                </div>
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <h3
                className="text-xs font-semibold tracking-widest uppercase mb-2"
                style={{ color: 'rgba(255,255,255,0.35)' }}
              >
                Stay Connected
              </h3>
              <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.55)' }}>
                Community stories, program updates, and cultural events — straight to your inbox.
              </p>
              <NewsletterForm />
            </div>
          </div>

          {/* Acknowledgement of Country */}
          <AcknowledgementOfCountry variant="footer" />

          {/* Bottom bar */}
          <div
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-6 pt-6"
            style={{ borderTop: '1px solid rgba(65,70,72,0.3)' }}
          >
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
              © {year} {siteConfig.name}. ABN: {siteConfig.abn}. All rights reserved.
            </p>

            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {legalLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs transition-colors duration-200"
                  style={{ color: 'rgba(255,255,255,0.4)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--color-ochre-400)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.4)' }}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <p className="text-xs flex items-center gap-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Made with <Heart size={10} fill="currentColor" aria-hidden="true" style={{ color: 'var(--color-ochre-600)' }} /> for community
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
