import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export const metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/login')

  const userId = (session.user as { id: string }).id

  const myProfiles = await prisma.operatorProfile.findMany({
    where: { createdById: userId },
    orderBy: { updatedAt: 'desc' },
    include: { _count: { select: { tributes: true, timelineEvents: true } } },
  })

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-[#182B42]">Dashboard</h1>
          <p className="text-stone-500 text-sm mt-1">Welcome, {session.user?.name}</p>
        </div>
        <Link
          href="/memorial/new"
          className="bg-[#182B42] hover:bg-[#1e3a5f] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
        >
          + Add Memorial
        </Link>
      </div>

      {myProfiles.length === 0 ? (
        <div className="bg-stone-100 rounded-xl p-10 text-center">
          <p className="text-stone-500 mb-4">You haven't created any memorials yet.</p>
          <Link href="/memorial/new" className="text-[#182B42] font-semibold hover:underline">
            Create your first memorial →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {myProfiles.map(p => (
            <div key={p.id} className="bg-white border border-stone-200 rounded-lg p-5 flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-mono font-bold text-[#182B42]">{p.callsign}</span>
                  <span className={`badge-pill text-xs ${p.isDraft ? 'bg-stone-100 text-stone-500' : 'bg-green-100 text-green-700'}`}>
                    {p.isDraft ? 'Draft' : 'Published'}
                  </span>
                </div>
                <p className="font-serif text-stone-700">{p.name}</p>
                <p className="text-xs text-stone-400 mt-1">
                  {p._count.timelineEvents} events · {p._count.tributes} tributes
                </p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                {!p.isDraft && (
                  <Link
                    href={`/memorial/${p.callsign}`}
                    className="text-xs text-stone-500 hover:text-[#182B42] border border-stone-200 rounded px-3 py-1.5 transition-colors"
                  >
                    View
                  </Link>
                )}
                <Link
                  href={`/memorial/${p.callsign}/edit`}
                  className="text-xs bg-[#182B42] text-white hover:bg-[#1e3a5f] rounded px-3 py-1.5 transition-colors"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
