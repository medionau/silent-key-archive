'use client'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'

export function Navigation() {
  const { data: session } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="bg-[#182B42] text-white">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        <Link href="/" className="font-serif text-lg text-white hover:text-amber-200 transition-colors whitespace-nowrap">
          Silent Key Archive
        </Link>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-6 text-sm">
          <Link href="/" className="text-white/70 hover:text-white transition-colors">Search</Link>
          {session ? (
            <>
              <Link href="/dashboard" className="text-white/70 hover:text-white transition-colors">Dashboard</Link>
              <Link href="/memorial/new" className="bg-amber-700 hover:bg-amber-600 px-3 py-1.5 rounded text-white text-sm font-medium transition-colors">
                + Add Memorial
              </Link>
              <button onClick={() => signOut()} className="text-white/50 hover:text-white transition-colors">
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="text-white/70 hover:text-white transition-colors">Log in</Link>
              <Link href="/auth/register" className="bg-amber-700 hover:bg-amber-600 px-3 py-1.5 rounded text-white text-sm font-medium transition-colors">
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden text-white/70 hover:text-white"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {menuOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden border-t border-white/10 px-4 py-3 flex flex-col gap-3 text-sm">
          <Link href="/" onClick={() => setMenuOpen(false)} className="text-white/80">Search</Link>
          {session ? (
            <>
              <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="text-white/80">Dashboard</Link>
              <Link href="/memorial/new" onClick={() => setMenuOpen(false)} className="text-white/80">+ Add Memorial</Link>
              <button onClick={() => { signOut(); setMenuOpen(false) }} className="text-left text-white/60">Sign out</button>
            </>
          ) : (
            <>
              <Link href="/auth/login" onClick={() => setMenuOpen(false)} className="text-white/80">Log in</Link>
              <Link href="/auth/register" onClick={() => setMenuOpen(false)} className="text-white/80">Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
