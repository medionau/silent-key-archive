import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import { MemorialTabs } from './MemorialTabs'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { callsign: string } }): Promise<Metadata> {
  const profile = await prisma.operatorProfile.findUnique({
    where: { callsign: params.callsign.toUpperCase() },
  })
  if (!profile) return { title: 'Not Found' }
  return {
    title: `${profile.callsign} — ${profile.name}`,
    description: `Memorial page for ${profile.name} (${profile.callsign})${profile.born && profile.died ? `, ${profile.born}–${profile.died}` : ''}.`,
  }
}

export default async function MemorialPage({ params }: { params: { callsign: string } }) {
  const callsign = params.callsign.toUpperCase()

  const profile = await prisma.operatorProfile.findUnique({
    where: { callsign },
    include: {
      timelineEvents: { orderBy: { year: 'asc' } },
      tributes: { where: { approved: true }, orderBy: { createdAt: 'desc' } },
      equipmentItems: { orderBy: { createdAt: 'asc' } },
      oralHistoryEntries: { orderBy: { createdAt: 'asc' } },
      clubMemberships: { orderBy: { createdAt: 'asc' } },
      connectionsFrom: { include: { toProfile: true } },
      connectionsTo: { include: { fromProfile: true } },
    },
  })

  if (!profile || profile.isDraft) notFound()

  const years = profile.born && profile.died
    ? profile.died - profile.born
    : null

  return (
    <div>
      {/* Hero */}
      <div className="bg-[#182B42] text-white">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <div className="flex flex-col sm:flex-row sm:items-end gap-6">
            {/* Callsign badge */}
            <div className="bg-white/10 border border-white/20 rounded-xl px-6 py-5 text-center flex-shrink-0">
              <div className="font-mono text-3xl font-bold text-white tracking-widest">
                {profile.callsign}
              </div>
              <div className="text-white/50 text-xs mt-1 uppercase tracking-widest">Callsign</div>
            </div>

            <div>
              <h1 className="font-serif text-3xl md:text-4xl text-white mb-2">
                {profile.name}
              </h1>
              <div className="flex flex-wrap gap-x-5 gap-y-1 text-white/60 text-sm">
                {profile.born && profile.died && (
                  <span>{profile.born}–{profile.died}{years ? ` · ${years} years` : ''}</span>
                )}
                {profile.locationQth && <span>📍 {profile.locationQth}</span>}
                {profile.licenceClass && <span>🔑 {profile.licenceClass}</span>}
                {profile.firstLicenced && <span>First licenced {profile.firstLicenced}</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8">
          {/* Tabs */}
          <div>
            <MemorialTabs profile={profile} />
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Station details */}
            <div className="bg-white border border-stone-200 rounded-lg p-5">
              <h3 className="font-serif text-base text-[#182B42] mb-3">Station Details</h3>
              <dl className="space-y-2 text-sm">
                <div>
                  <dt className="text-stone-400 text-xs uppercase tracking-wide">Callsign</dt>
                  <dd className="font-mono font-bold text-[#182B42]">{profile.callsign}</dd>
                </div>
                {profile.licenceClass && (
                  <div>
                    <dt className="text-stone-400 text-xs uppercase tracking-wide">Licence Class</dt>
                    <dd>{profile.licenceClass}</dd>
                  </div>
                )}
                {profile.firstLicenced && (
                  <div>
                    <dt className="text-stone-400 text-xs uppercase tracking-wide">First Licenced</dt>
                    <dd>{profile.firstLicenced}</dd>
                  </div>
                )}
                {profile.locationQth && (
                  <div>
                    <dt className="text-stone-400 text-xs uppercase tracking-wide">QTH</dt>
                    <dd>{profile.locationQth}</dd>
                  </div>
                )}
                {profile.born && profile.died && (
                  <div>
                    <dt className="text-stone-400 text-xs uppercase tracking-wide">Years Licensed</dt>
                    <dd>{profile.died - (profile.firstLicenced ?? profile.born)} years</dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Connections */}
            {(profile.connectionsFrom.length > 0 || profile.connectionsTo.length > 0) && (
              <div className="bg-white border border-stone-200 rounded-lg p-5">
                <h3 className="font-serif text-base text-[#182B42] mb-3">Operator Connections</h3>
                <ul className="space-y-3 text-sm">
                  {profile.connectionsFrom.map(conn => (
                    <li key={conn.id}>
                      <a href={`/memorial/${conn.toProfile.callsign}`} className="font-mono font-bold text-[#182B42] hover:underline">
                        {conn.toProfile.callsign}
                      </a>
                      <span className="text-stone-400"> · </span>
                      <span className="text-stone-500 capitalize">{conn.relationshipType.replace('_', ' ')}</span>
                      {conn.description && <p className="text-stone-400 text-xs mt-0.5">{conn.description}</p>}
                    </li>
                  ))}
                  {profile.connectionsTo.map(conn => (
                    <li key={conn.id}>
                      <a href={`/memorial/${conn.fromProfile.callsign}`} className="font-mono font-bold text-[#182B42] hover:underline">
                        {conn.fromProfile.callsign}
                      </a>
                      <span className="text-stone-400"> · </span>
                      <span className="text-stone-500 capitalize">{conn.relationshipType.replace('_', ' ')}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Club memberships */}
            {profile.clubMemberships.length > 0 && (
              <div className="bg-white border border-stone-200 rounded-lg p-5">
                <h3 className="font-serif text-base text-[#182B42] mb-3">Club Memberships</h3>
                <ul className="space-y-3 text-sm">
                  {profile.clubMemberships.map(m => (
                    <li key={m.id}>
                      <div className="font-medium text-stone-800">{m.clubName}</div>
                      {m.clubCall && <div className="font-mono text-xs text-[#182B42]">{m.clubCall}</div>}
                      {m.years && <div className="text-stone-400 text-xs">{m.years}</div>}
                      {m.role && <div className="text-stone-500 text-xs">{m.role}</div>}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Contribute CTA */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-5">
              <h3 className="font-serif text-base text-[#7A4F0C] mb-2">Contribute</h3>
              <p className="text-sm text-stone-600 mb-3">
                Did you know {profile.name.split(' ')[0]}? Leave a tribute or share a memory.
              </p>
              <a
                href="#tributes"
                className="text-sm font-semibold text-[#7A4F0C] hover:underline"
              >
                Leave a tribute →
              </a>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
