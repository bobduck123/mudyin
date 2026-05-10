'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { ChevronDown, LogOut, Settings, User } from 'lucide-react'

export function UserProfileMenu() {
  const { data: session, status } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  // Show nothing while loading
  if (status === 'loading') {
    return null
  }

  // Show auth buttons if not logged in
  if (status === 'unauthenticated') {
    return (
      <div className="hidden lg:flex items-center gap-3">
        <Link href="/contact#general-enquiry" className="btn-ghost text-sm">
          Enquire
        </Link>
        <Link href="/contact#booking-request" className="btn-primary text-sm px-5 py-2.5">
          Request a Booking
        </Link>
      </div>
    )
  }

  // Get user initials
  const initials = session?.user?.name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase() || 'U'

  return (
    <div ref={dropdownRef} className="hidden lg:flex items-center gap-3">
      <Link href="/contact#booking-request" className="btn-ghost text-sm">
        Request
      </Link>

      {/* Profile Dropdown */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
            style={{ backgroundColor: 'var(--color-ochre-400)' }}
          >
            {initials}
          </div>
          <ChevronDown
            size={16}
            className={`transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
            style={{ color: 'rgba(255,255,255,0.7)' }}
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div
            role="menu"
            className="absolute top-full right-0 mt-2 min-w-[220px] rounded-xl py-2 shadow-card"
            style={{
              backgroundColor: 'rgba(47,36,29,0.97)',
              border: '1px solid rgba(65,70,72,0.5)',
              backdropFilter: 'blur(16px)',
            }}
          >
            {/* User Info */}
            <div className="px-4 py-3 border-b" style={{ borderColor: 'rgba(65,70,72,0.3)' }}>
              <p className="text-sm font-semibold text-white">
                {session?.user?.name}
              </p>
              <p className="text-xs text-gray-400">
                {session?.user?.email}
              </p>
            </div>

            {/* Menu Items */}
            <Link
              href={`/community/members/${session?.user?.id}`}
              role="menuitem"
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/75 hover:text-white hover:bg-white/5 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <User size={16} />
              My Profile
            </Link>

            <Link
              href="/community/members"
              role="menuitem"
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/75 hover:text-white hover:bg-white/5 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Settings size={16} />
              Browse Members
            </Link>

            <div className="border-t my-2" style={{ borderColor: 'rgba(65,70,72,0.3)' }} />

            {/* Logout */}
            <button
              role="menuitem"
              onClick={() => {
                setIsOpen(false)
                signOut()
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-white/5 transition-colors"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
