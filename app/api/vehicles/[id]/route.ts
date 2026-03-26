import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json()
  const vehicle = await prisma.vehicle.update({
    where: { id: Number(id) },
    data: {
      model: body.model,
      year: Number(body.year),
      mileage: Number(body.mileage),
      options: body.options,
      cost: Number(body.cost),
      price: Number(body.price),
    },
  })

  return NextResponse.json(vehicle)
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  await prisma.order.deleteMany({ where: { vehicleId: Number(id) } })
  await prisma.vehicle.delete({ where: { id: Number(id) } })

  return NextResponse.json({ ok: true })
}
