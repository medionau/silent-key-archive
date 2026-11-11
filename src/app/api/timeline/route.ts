import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { profileId, year, title, description, isHighlight } = await req.json()
  if (!profileId || !year || !title) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  const event = await prisma.timelineEvent.create({
    data: { profileId, year, title, description: description || null, isHighlight: isHighlight ?? false },
  })
  return NextResponse.json(event, { status: 201 })
}
