'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ChevronDown } from 'lucide-react'
import { navLinks, siteConfig } from '@/lib/data'
import { cn } from '@/lib/utils'
import { UserProfileMenu } from './UserProfileMenu'
import { NotificationBell } from '@/components/notifications/NotificationBell'

export function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const pathname = usePathname()
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 36)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    setMobileOpen(false)
    setOpenDropdown(null)
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [pathname])

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  const toggleDropdown = (label: string) => {
    setOpenDropdown(prev => (prev === label ? null : label))
  }

  const isActive = (href: string) =>
    pathname === href || (href !== '/' && pathname.startsWith(href))

  return (
    <>
      <nav
        role="navigation"
        aria-label="Main navigation"
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          scrolled ? 'py-2.5' : 'py-4',
        )}
      >
        <div className="container-wide section-padding">
          <div
            className={cn(
              'relative flex items-center justify-between gap-3 rounded-2xl px-3 sm:px-4 transition-all duration-500 healing-border',
              scrolled ? 'py-2.5' : 'py-3',
            )}
            style={{
              background:
                'linear-gradient(180deg, rgba(47,36,29,0.93) 0%, rgba(58,44,35,0.88) 100%)',
              backdropFilter: 'blur(6px)',
              boxShadow: scrolled
                ? '0 8px 20px rgba(0,0,0,0.34), inset 0 0 0 1px rgba(255,255,255,0.025)'
                : '0 6px 14px rgba(0,0,0,0.28), inset 0 0 0 1px rgba(255,255,255,0.015)',
            }}
          >
            <Link
              href="/"
              className="flex flex-col leading-none focus-visible:outline-none group"
              aria-label="Mudyin Aboriginal Healing Centre - home"
            >
              <span
                className="font-display font-bold tracking-wide group-hover:opacity-80 transition-opacity"
                style={{ fontSize: '1.375rem', color: 'var(--color-ochre-400)' }}
              >
                Mudyin
              </span>
              <span
                className="font-body text-[11px] tracking-[0.22em] uppercase"
                style={{ color: 'rgba(255,255,255,0.56)' }}
              >
                Healing Centre
              </span>
              <span
                className="font-script text-sm flex items-center gap-1.5"
                style={{ color: 'rgba(200,167,93,0.62)' }}
              >
                <span className="w-2 h-2 rounded-full healing-disc" aria-hidden="true" />
                Two Worlds Strong
              </span>
            </Link>

            <div ref={dropdownRef} className="hidden lg:flex items-center gap-1">
              {navLinks.map(link => (
                <div key={link.label} className="relative">
                  {link.children ? (
                    <>
                      <button
                        onClick={() => toggleDropdown(link.label)}
                        onKeyDown={e => {
                          if (e.key === 'Escape') setOpenDropdown(null)
                        }}
                        aria-haspopup="true"
                        aria-expanded={openDropdown === link.label}
                        className={cn(
                          'flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200',
                          isActive(link.href)
                            ? 'text-ochre-400'
                            : 'text-white/80 hover:text-white',
                        )}
                        style={isActive(link.href) ? { color: 'var(--color-ochre-400)' } : {}}
                      >
                        {link.label}
                        <ChevronDown
                          size={14}
                          className={cn(
                            'transition-transform duration-200',
                            openDropdown === link.label ? 'rotate-180' : '',
                          )}
                        />
                      </button>

                      {openDropdown === link.label && (
                        <div
                          role="menu"
                          className="absolute top-full left-0 mt-2 min-w-[220px] rounded-xl py-2 shadow-card healing-border"
                          style={{
                            background:
                              'linear-gradient(180deg, rgba(47,36,29,0.97) 0%, rgba(58,44,35,0.94) 100%)',
                            backdropFilter: 'blur(16px)',
                          }}
                        >
                          {link.children.map(child => (
                            <Link
                              key={child.href}
                              href={child.href}
                              role="menuitem"
                              className={cn(
                                'block px-4 py-2.5 text-sm transition-colors duration-150',
                                isActive(child.href)
                                  ? 'text-ochre-400 bg-ochre-500/10'
                                  : 'text-white/75 hover:text-white hover:bg-white/5',
                              )}
                              style={isActive(child.href) ? { color: 'var(--color-ochre-400)' } : {}}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={link.href}
                      className={cn(
                        'px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200',
                        isActive(link.href) ? 'text-ochre-400' : 'text-white/80 hover:text-white',
                      )}
                      style={isActive(link.href) ? { color: 'var(--color-ochre-400)' } : {}}
                    >
                      {link.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              <div className="hidden sm:block">
                <NotificationBell />
              </div>
              <div className="hidden lg:block">
                <UserProfileMenu />
              </div>
              <button
                onClick={() => setMobileOpen(prev => !prev)}
                className="lg:hidden p-2 rounded-lg focus-visible:outline"
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileOpen}
                aria-controls="mobile-menu"
                style={{ color: 'var(--color-ochre-400)' }}
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {mobileOpen && (
        <div
          id="mobile-menu"
          role="dialog"
          aria-label="Mobile navigation menu"
          aria-modal="true"
          className="fixed inset-0 z-40 lg:hidden flex flex-col"
          style={{ backgroundColor: 'rgba(47,36,29,0.98)', backdropFilter: 'blur(16px)' }}
        >
          <div className="h-24" />

          <nav className="flex-1 overflow-y-auto px-6 py-8">
            <ul className="space-y-1" role="list">
              {navLinks.map(link => (
                <li key={link.label}>
                  {link.children ? (
                    <div>
                      <button
                        onClick={() => toggleDropdown(link.label)}
                        className="flex items-center justify-between w-full px-4 py-3.5 rounded-xl text-left font-medium"
                        style={{
                          color:
                            openDropdown === link.label
                              ? 'var(--color-ochre-400)'
                              : 'rgba(255,255,255,0.85)',
                        }}
                        aria-expanded={openDropdown === link.label}
                      >
                        {link.label}
                        <ChevronDown
                          size={16}
                          className={cn(
                            'transition-transform duration-200',
                            openDropdown === link.label ? 'rotate-180' : '',
                          )}
                        />
                      </button>

                      {openDropdown === link.label && (
                        <ul
                          className="ml-4 mt-1 border-l pl-4 space-y-1"
                          style={{ borderColor: 'rgba(223,206,214,0.3)' }}
                        >
                          {link.children.map(child => (
                            <li key={child.href}>
                              <Link
                                href={child.href}
                                className="block py-2.5 px-3 rounded-lg text-sm"
                                style={{
                                  color: isActive(child.href)
                                    ? 'var(--color-ochre-400)'
                                    : 'rgba(255,255,255,0.65)',
                                }}
                              >
                                {child.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={link.href}
                      className="block px-4 py-3.5 rounded-xl font-medium"
                      style={{
                        color: isActive(link.href)
                          ? 'var(--color-ochre-400)'
                          : 'rgba(255,255,255,0.85)',
                        backgroundColor: isActive(link.href)
                          ? 'rgba(255,255,255,0.06)'
                          : 'transparent',
                      }}
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-3">
              <Link href="/contact#booking-request" className="btn-primary text-center text-base py-4">
                Request a Booking
              </Link>
              <Link href="/contact#general-enquiry" className="btn-outline text-center text-base py-4">
                General Enquiry
              </Link>
            </div>

            <div className="mt-8 pt-6" style={{ borderTop: '1px solid rgba(65,70,72,0.4)' }}>
              <p
                className="text-xs mb-3"
                style={{ color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em' }}
              >
                CONTACT
              </p>
              <a
                href="tel:0478796298"
                className="block text-sm mb-1 hover:underline"
                style={{ color: 'var(--color-ochre-400)' }}
              >
                0478 796 298
              </a>
              <a
                href={`mailto:${siteConfig.email}`}
                className="block text-sm"
                style={{ color: 'var(--color-ochre-400)' }}
              >
                {siteConfig.email}
              </a>
            </div>
          </nav>
        </div>
      )}
    </>
  )
}
