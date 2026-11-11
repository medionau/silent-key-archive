import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect, notFound } from 'next/navigation'
import { EditMemorialForm } from './EditMemorialForm'

export default async function EditMemorialPage({ params }: { params: { callsign: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/login')

  const userId = (session.user as { id: string }).id
  const profile = await prisma.operatorProfile.findUnique({
    where: { callsign: params.callsign.toUpperCase() },
    include: {
      timelineEvents: { orderBy: { year: 'asc' } },
      equipmentItems: { orderBy: { createdAt: 'asc' } },
      oralHistoryEntries: { orderBy: { createdAt: 'asc' } },
      clubMemberships: true,
    },
  })

  if (!profile || profile.createdById !== userId) notFound()

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-3xl text-[#182B42]">Edit {profile.callsign}</h1>
        {!profile.isDraft && (
          <a href={`/memorial/${profile.callsign}`}
            className="text-sm text-[#182B42] hover:underline">
            View public page →
          </a>
        )}
      </div>
      <EditMemorialForm profile={profile} />
    </div>
  )
}
