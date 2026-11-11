import { prisma } from '@/lib/db'
import Link from 'next/link'
import { SearchForm } from '@/components/SearchForm'

export default async function HomePage({
  searchParams,
}: {
  searchParams: { q?: string }
}) {
  const query = searchParams.q?.trim() ?? ''

  const results = query
    ? await prisma.operatorProfile.findMany({
        where: {
          isDraft: false,
          OR: [
            { callsign: { contains: query, mode: 'insensitive' } },
            { name: { contains: query, mode: 'insensitive' } },
            { locationQth: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: 20,
        orderBy: { callsign: 'asc' },
      })
    : []

  const recent = !query
    ? await prisma.operatorProfile.findMany({
        where: { isDraft: false },
        take: 6,
        orderBy: { createdAt: 'desc' },
      })
    : []

  return (
    <div>
      {/* Hero */}
      <div className="bg-[#182B42] text-white py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="font-serif text-4xl md:text-5xl mb-4 text-white">
            Silent Key Archive
          </h1>
          <p className="text-white/70 text-lg mb-8 leading-relaxed">
            A digital memorial for Australian amateur radio operators who have become silent keys.
            Preserving their stories, equipment, and legacy for the community.
          </p>
          <SearchForm initialQuery={query} />
          <p className="text-white/40 text-sm mt-4">
            Search by callsign, name, or location — e.g. VK3TOM, Thomas Mitchell, Shepparton
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Search results */}
        {query && (
          <div className="mb-10">
            <h2 className="font-serif text-2xl text-[#182B42] mb-5">
              {results.length === 0
                ? `No results for "${query}"`
                : `${results.length} result${results.length === 1 ? '' : 's'} for "${query}"`}
            </h2>
            {results.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.map(p => (
                  <ProfileCard key={p.id} profile={p} />
                ))}
              </div>
            )}
            {results.length === 0 && (
              <div className="bg-stone-100 rounded-lg p-8 text-center text-stone-500">
                <p className="mb-3">This callsign is not yet in the archive.</p>
                <Link
                  href="/memorial/new"
                  className="text-[#182B42] font-semibold hover:underline"
                >
                  Create a memorial →
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Recent memorials */}
        {!query && recent.length > 0 && (
          <div>
            <h2 className="font-serif text-2xl text-[#182B42] mb-5">Recent memorials</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recent.map(p => (
                <ProfileCard key={p.id} profile={p} />
              ))}
            </div>
          </div>
        )}

        {/* About section */}
        {!query && (
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-stone-200 pt-12">
            {[
              {
                icon: '📻',
                title: 'Preserve Their Story',
                body: 'Biography, oral history recordings, timeline of key events, and a complete equipment log.',
              },
              {
                icon: '🔑',
                title: 'Honour Their Legacy',
                body: 'Club memberships, Elmer relationships, contest achievements, and emergency communications service.',
              },
              {
                icon: '📖',
                title: 'Share Their Memory',
                body: 'Tributes from fellow operators, family members, and the wider amateur radio community.',
              },
            ].map(item => (
              <div key={item.title} className="text-center">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-serif text-lg text-[#182B42] mb-2">{item.title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ProfileCard({ profile }: { profile: { callsign: string; name: string; born: number | null; died: number | null; locationQth: string | null } }) {
  return (
    <Link
      href={`/memorial/${profile.callsign}`}
      className="bg-white border border-stone-200 rounded-lg p-5 hover:border-[#182B42] hover:shadow-md transition-all group"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="font-mono text-sm font-bold text-[#182B42] group-hover:text-amber-700 transition-colors">
          {profile.callsign}
        </span>
        {profile.born && profile.died && (
          <span className="text-xs text-stone-400 whitespace-nowrap">
            {profile.born}–{profile.died}
          </span>
        )}
      </div>
      <p className="font-serif text-base text-stone-800 mb-1">{profile.name}</p>
      {profile.locationQth && (
        <p className="text-xs text-stone-400">{profile.locationQth}</p>
      )}
    </Link>
  )
}
