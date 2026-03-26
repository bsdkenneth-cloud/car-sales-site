import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const vehicles = await prisma.vehicle.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(vehicles)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { model, year, mileage, options, cost, price } = body

  const vehicle = await prisma.vehicle.create({
    data: {
      model,
      year: Number(year),
      mileage: Number(mileage),
      options,
      cost: Number(cost),
      price: Number(price),
    },
  })

  return NextResponse.json(vehicle, { status: 201 })
}
