'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function NewMemorialForm() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    callsign: '',
    name: '',
    born: '',
    died: '',
    locationQth: '',
    licenceClass: '',
    firstLicenced: '',
    biography: '',
    isDraft: true,
  })

  function update(field: string, value: string | boolean) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    const res = await fetch('/api/memorials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        callsign: form.callsign.toUpperCase().trim(),
        born: form.born ? parseInt(form.born) : null,
        died: form.died ? parseInt(form.died) : null,
        firstLicenced: form.firstLicenced ? parseInt(form.firstLicenced) : null,
      }),
    })
    setSaving(false)
    if (!res.ok) {
      const data = await res.json()
      setError(data.error || 'Save failed.')
      return
    }
    const data = await res.json()
    router.push(`/memorial/${data.callsign}/edit`)
  }

  const inputClass = "w-full border border-stone-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#182B42]"
  const labelClass = "block text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1"

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Callsign *</label>
          <input required value={form.callsign} onChange={e => update('callsign', e.target.value)}
            className={`${inputClass} font-mono uppercase`} placeholder="VK3XYZ" />
        </div>
        <div>
          <label className={labelClass}>Full Name *</label>
          <input required value={form.name} onChange={e => update('name', e.target.value)}
            className={inputClass} placeholder="Thomas Mitchell" />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div>
          <label className={labelClass}>Born</label>
          <input type="number" value={form.born} onChange={e => update('born', e.target.value)}
            className={inputClass} placeholder="1935" min={1850} max={2010} />
        </div>
        <div>
          <label className={labelClass}>Died</label>
          <input type="number" value={form.died} onChange={e => update('died', e.target.value)}
            className={inputClass} placeholder="2019" min={1900} max={2030} />
        </div>
        <div>
          <label className={labelClass}>First Licenced</label>
          <input type="number" value={form.firstLicenced} onChange={e => update('firstLicenced', e.target.value)}
            className={inputClass} placeholder="1958" min={1900} max={2030} />
        </div>
        <div>
          <label className={labelClass}>Licence Class</label>
          <input value={form.licenceClass} onChange={e => update('licenceClass', e.target.value)}
            className={inputClass} placeholder="Amateur (Full)" />
        </div>
      </div>

      <div>
        <label className={labelClass}>QTH / Location</label>
        <input value={form.locationQth} onChange={e => update('locationQth', e.target.value)}
          className={inputClass} placeholder="Shepparton, Victoria" />
      </div>

      <div>
        <label className={labelClass}>Biography</label>
        <textarea rows={8} value={form.biography} onChange={e => update('biography', e.target.value)}
          className={`${inputClass} resize-none`}
          placeholder="Write a biography — use blank lines to separate paragraphs." />
      </div>

      <div className="flex items-center gap-3 pt-2">
        <label className="flex items-center gap-2 text-sm text-stone-600 cursor-pointer">
          <input type="checkbox" checked={!form.isDraft} onChange={e => update('isDraft', !e.target.checked)}
            className="rounded" />
          Publish immediately (visible to everyone)
        </label>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving}
          className="bg-[#182B42] hover:bg-[#1e3a5f] text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-colors disabled:opacity-50">
          {saving ? 'Saving…' : form.isDraft ? 'Save as draft' : 'Publish memorial'}
        </button>
        <button type="button" onClick={() => router.back()}
          className="text-stone-500 hover:text-stone-700 px-4 py-2.5 text-sm">
          Cancel
        </button>
      </div>
    </form>
  )
}
