'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function SearchForm({ initialQuery }: { initialQuery: string }) {
  const [q, setQ] = useState(initialQuery)
  const router = useRouter()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (q.trim()) {
      router.push(`/?q=${encodeURIComponent(q.trim())}`)
    } else {
      router.push('/')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
      <input
        type="search"
        value={q}
        onChange={e => setQ(e.target.value)}
        placeholder="Search callsign or name…"
        className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-white/60 text-base"
      />
      <button
        type="submit"
        className="px-5 py-3 bg-amber-700 hover:bg-amber-600 rounded-lg text-white font-semibold transition-colors whitespace-nowrap"
      >
        Search
      </button>
    </form>
  )
}
