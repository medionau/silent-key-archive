'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || 'Registration failed')
      setLoading(false)
      return
    }

    await signIn('credentials', { email, password, callbackUrl: '/dashboard' })
  }

  return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <h1 className="font-serif text-3xl text-[#182B42] mb-2">Create account</h1>
      <p className="text-stone-500 text-sm mb-8">
        Already have an account?{' '}
        <Link href="/auth/login" className="text-[#182B42] hover:underline font-medium">Log in</Link>
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1">Name</label>
          <input
            required
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full border border-stone-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#182B42]"
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1">Email</label>
          <input
            required
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border border-stone-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#182B42]"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1">Password</label>
          <input
            required
            type="password"
            minLength={8}
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border border-stone-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#182B42]"
            placeholder="At least 8 characters"
          />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#182B42] hover:bg-[#1e3a5f] text-white py-2.5 rounded-lg font-semibold text-sm transition-colors disabled:opacity-50"
        >
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>
    </div>
  )
}
