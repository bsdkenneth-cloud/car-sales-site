import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type ImportVehicle = {
  model: string
  year: number
  mileage: number
  options: string
  cost: number
  price?: number
}

function normalizeNumber(value: unknown, fallback = 0) {
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const vehicles = Array.isArray(body.vehicles) ? (body.vehicles as ImportVehicle[]) : []

  if (vehicles.length === 0) {
    return NextResponse.json({ error: 'No vehicles provided.' }, { status: 400 })
  }

  const created = []
  const skipped = []

  for (const item of vehicles) {
    const existing = await prisma.vehicle.findFirst({
      where: {
        model: item.model,
        year: normalizeNumber(item.year),
        mileage: normalizeNumber(item.mileage),
        cost: normalizeNumber(item.cost),
      },
    })

    if (existing) {
      skipped.push(existing.id)
      continue
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        model: item.model,
        year: normalizeNumber(item.year),
        mileage: normalizeNumber(item.mileage),
        options: item.options,
        cost: normalizeNumber(item.cost),
        price: normalizeNumber(item.price, Math.ceil((normalizeNumber(item.cost) * 1.15) / 100) * 100),
      },
    })

    created.push(vehicle)
  }

  return NextResponse.json({
    imported: created.length,
    skipped: skipped.length,
    vehicles: created,
  })
}
