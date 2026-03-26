import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const sourceUrl = String(body.sourceUrl || '')

  if (!sourceUrl) {
    return NextResponse.json({ error: 'sourceUrl is required.' }, { status: 400 })
  }

  const res = await fetch(sourceUrl)
  if (!res.ok) {
    return NextResponse.json({ error: `Failed to fetch source: ${res.status}` }, { status: 400 })
  }

  const vehicles = await res.json()

  const importRes = await fetch(new URL('/api/import-vehicles', request.url), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ vehicles }),
  })

  const data = await importRes.json()
  return NextResponse.json({ sourceUrl, ...data }, { status: importRes.status })
}
