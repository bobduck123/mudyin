'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ChevronDown } from 'lucide-react'
import { navLinks } from '@/lib/data'
import { cn } from '@/lib/utils'
import { UserProfileMenu } from './UserProfileMenu'
import { NotificationBell } from '@/components/notifications/NotificationBell'

export function Navigation() {
  const [scrolled,      setScrolled]      = useState(false)
  const [mobileOpen,    setMobileOpen]    = useState(false)
  const [openDropdown,  setOpenDropdown]  = useState<string | null>(null)
  const pathname                          = usePathname()
  const dropdownRef                       = useRef<HTMLDivElement>(null)

  // Detect scroll for background transition
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    setMobileOpen(false)
    setOpenDropdown(null)
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [pathname])

  // Close dropdown on outside click
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
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
          scrolled
            ? 'py-3 shadow-card'
            : 'py-5',
        )}
        style={{
          backgroundColor: scrolled
            ? 'rgba(20,20,20,0.96)'
            : 'rgba(20,20,20,0.6)',
          backdropFilter: 'blur(12px)',
          borderBottom: scrolled ? '1px solid rgba(65,70,72,0.4)' : 'none',
        }}
      >
        <div className="container-wide section-padding flex items-center justify-between gap-4">

          {/* Brand */}
          <Link
            href="/"
            className="flex flex-col leading-none focus-visible:outline-none group"
            aria-label="Mudyin Aboriginal Healing Centre — home"
          >
            <span
              className="font-display font-bold tracking-wide group-hover:opacity-80 transition-opacity"
              style={{ fontSize: '1.375rem', color: 'var(--color-ochre-400)' }}
            >
              Mudyin
            </span>
            <span
              className="font-body text-xs tracking-widest uppercase"
              style={{ color: 'rgba(255,255,255,0.5)' }}
            >
              Healing Centre
            </span>
            <span
              className="font-script text-sm"
              style={{ color: 'rgba(210,168,85,0.55)' }}
            >
              Two Worlds Strong
            </span>
          </Link>

          {/* Desktop links */}
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

                    {/* Dropdown */}
                    {openDropdown === link.label && (
                      <div
                        role="menu"
                        className="absolute top-full left-0 mt-2 min-w-[220px] rounded-xl py-2 shadow-card"
                        style={{
                          backgroundColor: 'rgba(20,20,20,0.97)',
                          border: '1px solid rgba(65,70,72,0.5)',
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
                      isActive(link.href)
                        ? 'text-ochre-400'
                        : 'text-white/80 hover:text-white',
                    )}
                    style={isActive(link.href) ? { color: 'var(--color-ochre-400)' } : {}}
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Notifications */}
          <NotificationBell />

          {/* Desktop User Menu */}
          <UserProfileMenu />

          {/* Mobile menu button */}
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
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          id="mobile-menu"
          role="dialog"
          aria-label="Mobile navigation menu"
          aria-modal="true"
          className="fixed inset-0 z-40 lg:hidden flex flex-col"
          style={{ backgroundColor: 'rgba(20,20,20,0.98)', backdropFilter: 'blur(16px)' }}
        >
          {/* Spacer for nav height */}
          <div className="h-20" />

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
                          color: openDropdown === link.label
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
                        <ul className="ml-4 mt-1 border-l pl-4 space-y-1" style={{ borderColor: 'rgba(210,168,85,0.25)' }}>
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
                        backgroundColor: isActive(link.href) ? 'rgba(210,168,85,0.08)' : 'transparent',
                      }}
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>

            {/* Mobile CTAs */}
            <div className="mt-8 flex flex-col gap-3">
              <Link href="/enroll" className="btn-primary text-center text-base py-4">
                Get Involved
              </Link>
              <Link href="/donate" className="btn-outline text-center text-base py-4">
                Make a Donation
              </Link>
            </div>

            {/* Contact in mobile */}
            <div className="mt-8 pt-6" style={{ borderTop: '1px solid rgba(65,70,72,0.4)' }}>
              <p className="text-xs mb-3" style={{ color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em' }}>
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
                href="mailto:info@mudyin.org.au"
                className="block text-sm"
                style={{ color: 'var(--color-ochre-400)' }}
              >
                info@mudyin.org.au
              </a>
            </div>
          </nav>
        </div>
      )}
    </>
  )
}
