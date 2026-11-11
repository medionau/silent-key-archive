import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const userId = (session.user as { id: string }).id
  const profile = await prisma.operatorProfile.findUnique({ where: { id: params.id } })
  if (!profile || profile.createdById !== userId) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const { name, born, died, locationQth, licenceClass, firstLicenced, biography, isDraft } = await req.json()

  const updated = await prisma.operatorProfile.update({
    where: { id: params.id },
    data: { name, born, died, locationQth, licenceClass, firstLicenced, biography, isDraft },
  })

  return NextResponse.json(updated)
}
