import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const orders = await prisma.order.findMany({
    include: {
      customer: true,
      vehicle: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(orders)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { customerId, vehicleId, status } = body

  const order = await prisma.order.create({
    data: {
      customerId: Number(customerId),
      vehicleId: Number(vehicleId),
      status: status ?? 'pending',
    },
    include: {
      customer: true,
      vehicle: true,
    },
  })

  return NextResponse.json(order, { status: 201 })
}
