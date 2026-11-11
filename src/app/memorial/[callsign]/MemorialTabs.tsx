'use client'
import { useState } from 'react'
import type { OperatorProfile, TimelineEvent, Tribute, EquipmentItem, OralHistoryEntry, ClubMembership, OperatorConnection } from '@prisma/client'

type FullProfile = OperatorProfile & {
  timelineEvents: TimelineEvent[]
  tributes: Tribute[]
  equipmentItems: EquipmentItem[]
  oralHistoryEntries: OralHistoryEntry[]
  clubMemberships: ClubMembership[]
  connectionsFrom: (OperatorConnection & { toProfile: OperatorProfile })[]
  connectionsTo: (OperatorConnection & { fromProfile: OperatorProfile })[]
}

const TABS = [
  { id: 'biography', label: 'Biography' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'equipment', label: 'Equipment' },
  { id: 'oral-history', label: 'Oral History' },
  { id: 'tributes', label: 'Tributes' },
]

export function MemorialTabs({ profile }: { profile: FullProfile }) {
  const [active, setActive] = useState('biography')
  const [tributeName, setTributeName] = useState('')
  const [tributeCall, setTributeCall] = useState('')
  const [tributeContent, setTributeContent] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  async function handleTributeSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    await fetch('/api/tributes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        profileId: profile.id,
        authorName: tributeName,
        authorCallsign: tributeCall || undefined,
        content: tributeContent,
      }),
    })
    setSubmitting(false)
    setSubmitted(true)
    setTributeName('')
    setTributeCall('')
    setTributeContent('')
  }

  return (
    <div id="tabs">
      {/* Tab bar */}
      <div className="flex gap-1 border-b border-stone-200 mb-6 overflow-x-auto">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActive(tab.id); if (tab.id === 'tributes') window.location.hash = 'tributes' }}
            className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors ${
              active === tab.id ? 'tab-active' : 'tab-inactive'
            }`}
          >
            {tab.label}
            {tab.id === 'tributes' && profile.tributes.length > 0 && (
              <span className="ml-1.5 bg-stone-100 text-stone-500 text-xs px-1.5 py-0.5 rounded-full">
                {profile.tributes.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Biography */}
      {active === 'biography' && (
        <div className="prose prose-stone max-w-none">
          {profile.biography
            ? profile.biography.split('\n\n').map((para, i) => (
                <p key={i} className="text-stone-700 leading-relaxed mb-4 text-[15px]">{para}</p>
              ))
            : <p className="text-stone-400 italic">No biography has been added yet.</p>
          }
        </div>
      )}

      {/* Timeline */}
      {active === 'timeline' && (
        <div>
          {profile.timelineEvents.length === 0
            ? <p className="text-stone-400 italic">No timeline events have been added yet.</p>
            : (
              <div className="relative">
                <div className="absolute left-[72px] top-0 bottom-0 w-px bg-stone-200" />
                <div className="space-y-6">
                  {profile.timelineEvents.map(event => (
                    <div key={event.id} className="flex gap-4 relative">
                      <div className="w-16 text-right flex-shrink-0">
                        <span className="text-sm font-mono font-bold text-[#182B42]">{event.year}</span>
                      </div>
                      <div className={`w-3 h-3 rounded-full flex-shrink-0 mt-1 z-10 ring-2 ring-white ${event.isHighlight ? 'bg-amber-600' : 'bg-stone-300'}`} />
                      <div className="flex-1 pb-2">
                        <p className={`font-medium text-sm ${event.isHighlight ? 'text-[#182B42]' : 'text-stone-700'}`}>
                          {event.title}
                        </p>
                        {event.description && (
                          <p className="text-stone-500 text-sm mt-0.5 leading-relaxed">{event.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          }
        </div>
      )}

      {/* Equipment */}
      {active === 'equipment' && (
        <div>
          {profile.equipmentItems.length === 0
            ? <p className="text-stone-400 italic">No equipment has been listed yet.</p>
            : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {profile.equipmentItems.map(item => (
                  <div key={item.id} className="bg-white border border-stone-200 rounded-lg p-4">
                    <div className="font-serif text-base font-medium text-stone-800 mb-1">{item.name}</div>
                    {item.model && <div className="font-mono text-xs text-[#182B42] mb-2">{item.model}</div>}
                    {item.yearsOwned && (
                      <div className="text-xs text-stone-400 mb-2">Owned: {item.yearsOwned}</div>
                    )}
                    {item.description && (
                      <p className="text-sm text-stone-600 leading-relaxed mb-2">{item.description}</p>
                    )}
                    {item.provenance && (
                      <div className="callout-amber text-xs text-stone-600 mt-2">
                        <span className="font-semibold text-amber-700">Provenance: </span>
                        {item.provenance}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )
          }
        </div>
      )}

      {/* Oral History */}
      {active === 'oral-history' && (
        <div className="space-y-6">
          {profile.oralHistoryEntries.length === 0
            ? <p className="text-stone-400 italic">No oral history entries have been recorded yet.</p>
            : profile.oralHistoryEntries.map(entry => (
              <div key={entry.id} className="border-l-4 border-[#182B42]/20 pl-5">
                <p className="font-serif text-base font-medium text-stone-700 mb-3 italic">
                  "{entry.question}"
                </p>
                <p className="text-stone-700 leading-relaxed text-[15px]">{entry.answer}</p>
                {entry.yearRecorded && (
                  <p className="text-xs text-stone-400 mt-2">Recorded {entry.yearRecorded}</p>
                )}
              </div>
            ))
          }
        </div>
      )}

      {/* Tributes */}
      {active === 'tributes' && (
        <div id="tributes" className="space-y-6">
          {/* Existing tributes */}
          {profile.tributes.map(tribute => (
            <div key={tribute.id} className="bg-white border border-stone-200 rounded-lg p-5">
              <p className="text-stone-700 leading-relaxed mb-4 text-[15px]">"{tribute.content}"</p>
              <div className="flex items-center gap-2">
                <span className="font-medium text-stone-800 text-sm">{tribute.authorName}</span>
                {tribute.authorCallsign && (
                  <span className="font-mono text-xs text-[#182B42] bg-stone-100 px-2 py-0.5 rounded">
                    {tribute.authorCallsign}
                  </span>
                )}
              </div>
            </div>
          ))}

          {/* Submission form */}
          <div className="bg-stone-50 border border-stone-200 rounded-lg p-6 mt-8">
            <h3 className="font-serif text-lg text-[#182B42] mb-4">Leave a tribute</h3>
            {submitted ? (
              <div className="bg-green-50 border border-green-200 rounded-md p-4 text-green-800 text-sm">
                ✓ Thank you — your tribute has been submitted.
              </div>
            ) : (
              <form onSubmit={handleTributeSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1">
                      Your Name *
                    </label>
                    <input
                      required
                      value={tributeName}
                      onChange={e => setTributeName(e.target.value)}
                      className="w-full border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#182B42]"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1">
                      Callsign (optional)
                    </label>
                    <input
                      value={tributeCall}
                      onChange={e => setTributeCall(e.target.value)}
                      className="w-full border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#182B42] font-mono"
                      placeholder="VK3XYZ"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1">
                    Your tribute *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={tributeContent}
                    onChange={e => setTributeContent(e.target.value)}
                    className="w-full border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#182B42] resize-none"
                    placeholder="Share a memory, story, or message…"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#182B42] hover:bg-[#1e3a5f] text-white px-5 py-2 rounded text-sm font-semibold transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Submitting…' : 'Submit tribute'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
