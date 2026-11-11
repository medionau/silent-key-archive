'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { OperatorProfile, TimelineEvent, EquipmentItem, OralHistoryEntry, ClubMembership } from '@prisma/client'

type Props = {
  profile: OperatorProfile & {
    timelineEvents: TimelineEvent[]
    equipmentItems: EquipmentItem[]
    oralHistoryEntries: OralHistoryEntry[]
    clubMemberships: ClubMembership[]
  }
}

export function EditMemorialForm({ profile }: Props) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [activeSection, setActiveSection] = useState<'basics' | 'timeline' | 'equipment' | 'oral'>('basics')

  const [form, setForm] = useState({
    name: profile.name,
    born: profile.born?.toString() ?? '',
    died: profile.died?.toString() ?? '',
    locationQth: profile.locationQth ?? '',
    licenceClass: profile.licenceClass ?? '',
    firstLicenced: profile.firstLicenced?.toString() ?? '',
    biography: profile.biography ?? '',
    isDraft: profile.isDraft,
  })

  // Timeline state
  const [events, setEvents] = useState(profile.timelineEvents)
  const [newEvent, setNewEvent] = useState({ year: '', title: '', description: '', isHighlight: false })

  // Equipment state
  const [equipment, setEquipment] = useState(profile.equipmentItems)
  const [newEquip, setNewEquip] = useState({ name: '', model: '', yearsOwned: '', description: '', provenance: '' })

  function update(field: string, value: string | boolean) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function saveBasics() {
    setSaving(true); setError(''); setSaved(false)
    const res = await fetch(`/api/memorials/${profile.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        born: form.born ? parseInt(form.born) : null,
        died: form.died ? parseInt(form.died) : null,
        firstLicenced: form.firstLicenced ? parseInt(form.firstLicenced) : null,
      }),
    })
    setSaving(false)
    if (!res.ok) { setError('Save failed.'); return }
    setSaved(true)
    router.refresh()
  }

  async function addEvent() {
    if (!newEvent.year || !newEvent.title) return
    const res = await fetch('/api/timeline', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId: profile.id, ...newEvent, year: parseInt(newEvent.year) }),
    })
    if (res.ok) {
      const ev = await res.json()
      setEvents(e => [...e, ev].sort((a, b) => a.year - b.year))
      setNewEvent({ year: '', title: '', description: '', isHighlight: false })
    }
  }

  async function deleteEvent(id: string) {
    await fetch(`/api/timeline/${id}`, { method: 'DELETE' })
    setEvents(e => e.filter(x => x.id !== id))
  }

  async function addEquipment() {
    if (!newEquip.name) return
    const res = await fetch('/api/equipment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId: profile.id, ...newEquip }),
    })
    if (res.ok) {
      const item = await res.json()
      setEquipment(e => [...e, item])
      setNewEquip({ name: '', model: '', yearsOwned: '', description: '', provenance: '' })
    }
  }

  async function deleteEquipment(id: string) {
    await fetch(`/api/equipment/${id}`, { method: 'DELETE' })
    setEquipment(e => e.filter(x => x.id !== id))
  }

  const inputClass = "w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#182B42]"
  const labelClass = "block text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1"
  const sections = ['basics', 'timeline', 'equipment', 'oral'] as const

  return (
    <div>
      {/* Section tabs */}
      <div className="flex gap-1 border-b border-stone-200 mb-6">
        {(['basics', 'timeline', 'equipment', 'oral'] as const).map(s => (
          <button key={s} onClick={() => setActiveSection(s)}
            className={`px-4 py-2 text-sm font-medium capitalize ${activeSection === s ? 'tab-active' : 'tab-inactive'}`}>
            {s === 'oral' ? 'Oral History' : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* Basics */}
      {activeSection === 'basics' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Full Name *</label>
              <input value={form.name} onChange={e => update('name', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>QTH / Location</label>
              <input value={form.locationQth} onChange={e => update('locationQth', e.target.value)} className={inputClass} />
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {(['born', 'died', 'firstLicenced'] as const).map(f => (
              <div key={f}>
                <label className={labelClass}>{f === 'firstLicenced' ? 'First Licenced' : f.charAt(0).toUpperCase() + f.slice(1)}</label>
                <input type="number" value={form[f]} onChange={e => update(f, e.target.value)} className={inputClass} placeholder="Year" />
              </div>
            ))}
            <div>
              <label className={labelClass}>Licence Class</label>
              <input value={form.licenceClass} onChange={e => update('licenceClass', e.target.value)} className={inputClass} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Biography</label>
            <textarea rows={10} value={form.biography} onChange={e => update('biography', e.target.value)}
              className={`${inputClass} resize-none`} />
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-stone-600 cursor-pointer">
              <input type="checkbox" checked={!form.isDraft} onChange={e => update('isDraft', !e.target.checked)} />
              Published (visible to everyone)
            </label>
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          {saved && <p className="text-green-600 text-sm">✓ Saved</p>}
          <button onClick={saveBasics} disabled={saving}
            className="bg-[#182B42] hover:bg-[#1e3a5f] text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50">
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      )}

      {/* Timeline */}
      {activeSection === 'timeline' && (
        <div className="space-y-6">
          <div className="space-y-2">
            {events.map(ev => (
              <div key={ev.id} className="flex items-start gap-3 p-3 bg-white border border-stone-200 rounded-lg">
                <span className="font-mono text-sm font-bold text-[#182B42] w-12 flex-shrink-0">{ev.year}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{ev.title}</p>
                  {ev.description && <p className="text-xs text-stone-500 mt-0.5 truncate">{ev.description}</p>}
                </div>
                {ev.isHighlight && <span className="text-amber-500 text-xs">★</span>}
                <button onClick={() => deleteEvent(ev.id)} className="text-stone-300 hover:text-red-400 transition-colors text-lg leading-none">×</button>
              </div>
            ))}
          </div>
          <div className="bg-stone-50 border border-stone-200 rounded-lg p-4 space-y-3">
            <h4 className="text-sm font-semibold text-stone-700">Add event</h4>
            <div className="grid grid-cols-[80px_1fr] gap-3">
              <input type="number" placeholder="Year" value={newEvent.year}
                onChange={e => setNewEvent(n => ({ ...n, year: e.target.value }))}
                className={inputClass} />
              <input placeholder="Title" value={newEvent.title}
                onChange={e => setNewEvent(n => ({ ...n, title: e.target.value }))}
                className={inputClass} />
            </div>
            <input placeholder="Description (optional)" value={newEvent.description}
              onChange={e => setNewEvent(n => ({ ...n, description: e.target.value }))}
              className={inputClass} />
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-stone-600 cursor-pointer">
                <input type="checkbox" checked={newEvent.isHighlight}
                  onChange={e => setNewEvent(n => ({ ...n, isHighlight: e.target.checked }))} />
                Highlight event
              </label>
              <button onClick={addEvent}
                className="bg-[#182B42] text-white px-4 py-1.5 rounded text-sm font-medium">
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Equipment */}
      {activeSection === 'equipment' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {equipment.map(item => (
              <div key={item.id} className="bg-white border border-stone-200 rounded-lg p-4 relative">
                <button onClick={() => deleteEquipment(item.id)}
                  className="absolute top-2 right-2 text-stone-300 hover:text-red-400 text-lg leading-none">×</button>
                <div className="font-serif text-sm font-medium">{item.name}</div>
                {item.model && <div className="font-mono text-xs text-[#182B42]">{item.model}</div>}
                {item.yearsOwned && <div className="text-xs text-stone-400">{item.yearsOwned}</div>}
              </div>
            ))}
          </div>
          <div className="bg-stone-50 border border-stone-200 rounded-lg p-4 space-y-3">
            <h4 className="text-sm font-semibold text-stone-700">Add equipment</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input placeholder="Name *" value={newEquip.name}
                onChange={e => setNewEquip(n => ({ ...n, name: e.target.value }))} className={inputClass} />
              <input placeholder="Model" value={newEquip.model}
                onChange={e => setNewEquip(n => ({ ...n, model: e.target.value }))} className={inputClass} />
            </div>
            <input placeholder="Years owned (e.g. 1965–1988)" value={newEquip.yearsOwned}
              onChange={e => setNewEquip(n => ({ ...n, yearsOwned: e.target.value }))} className={inputClass} />
            <textarea placeholder="Description" rows={2} value={newEquip.description}
              onChange={e => setNewEquip(n => ({ ...n, description: e.target.value }))}
              className={`${inputClass} resize-none`} />
            <textarea placeholder="Provenance (where it went after)" rows={2} value={newEquip.provenance}
              onChange={e => setNewEquip(n => ({ ...n, provenance: e.target.value }))}
              className={`${inputClass} resize-none`} />
            <div className="text-right">
              <button onClick={addEquipment}
                className="bg-[#182B42] text-white px-4 py-1.5 rounded text-sm font-medium">
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Oral history placeholder */}
      {activeSection === 'oral' && (
        <div className="text-stone-500 text-sm py-4">
          Oral history entry management coming soon. Existing entries show on the public memorial page.
        </div>
      )}
    </div>
  )
}
