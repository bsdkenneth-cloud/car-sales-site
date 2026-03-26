import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { name, email, phone, vehicleId, notes } = body

  if (!name || !email || !vehicleId) {
    return NextResponse.json({ error: 'name, email, and vehicleId are required.' }, { status: 400 })
  }

  const customer = await prisma.customer.upsert({
    where: { email },
    update: {
      name,
      phone: phone || null,
    },
    create: {
      name,
      email,
      phone: phone || null,
    },
  })

  const order = await prisma.order.create({
    data: {
      customerId: customer.id,
      vehicleId: Number(vehicleId),
      status: notes ? `inquiry:${notes}` : 'pending',
    },
    include: {
      customer: true,
      vehicle: true,
    },
  })

  return NextResponse.json({ ok: true, order }, { status: 201 })
}
