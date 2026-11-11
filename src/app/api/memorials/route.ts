import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const userId = (session.user as { id: string }).id
  const { callsign, name, born, died, locationQth, licenceClass, firstLicenced, biography, isDraft } = await req.json()

  if (!callsign || !name) {
    return NextResponse.json({ error: 'Callsign and name are required.' }, { status: 400 })
  }

  const existing = await prisma.operatorProfile.findUnique({ where: { callsign } })
  if (existing) {
    return NextResponse.json({ error: `${callsign} already exists in the archive.` }, { status: 409 })
  }

  const profile = await prisma.operatorProfile.create({
    data: {
      callsign: callsign.toUpperCase(),
      name,
      born: born || null,
      died: died || null,
      locationQth: locationQth || null,
      licenceClass: licenceClass || null,
      firstLicenced: firstLicenced || null,
      biography: biography || null,
      isDraft: isDraft ?? true,
      createdById: userId,
    },
  })

  return NextResponse.json(profile, { status: 201 })
}
