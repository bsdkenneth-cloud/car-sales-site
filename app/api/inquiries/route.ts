import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendInquiryNotifications } from '@/lib/notifications'

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
      status: 'new',
    },
    include: {
      customer: true,
      vehicle: true,
    },
  })

  const notificationResults = await sendInquiryNotifications({
    customerName: customer.name,
    email: customer.email,
    phone: customer.phone,
    vehicleLabel: `${order.vehicle.year} ${order.vehicle.model}`,
    notes: notes || null,
  })

  return NextResponse.json({ ok: true, order, notifications: notificationResults }, { status: 201 })
}
