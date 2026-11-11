import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { profileId, authorName, authorCallsign, content } = body

  if (!profileId || !authorName || !content) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const tribute = await prisma.tribute.create({
    data: {
      profileId,
      authorName: authorName.trim(),
      authorCallsign: authorCallsign?.trim().toUpperCase() || null,
      content: content.trim(),
      approved: true,
    },
  })

  return NextResponse.json(tribute, { status: 201 })
}
