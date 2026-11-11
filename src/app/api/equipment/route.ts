import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { profileId, name, model, yearsOwned, description, provenance } = await req.json()
  if (!profileId || !name) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  const item = await prisma.equipmentItem.create({
    data: { profileId, name, model: model || null, yearsOwned: yearsOwned || null, description: description || null, provenance: provenance || null },
  })
  return NextResponse.json(item, { status: 201 })
}
