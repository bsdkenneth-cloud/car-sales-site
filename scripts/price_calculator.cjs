#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs')
const path = require('path')
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3')
const { PrismaClient } = require('@prisma/client')

const adapter = new PrismaBetterSqlite3({ url: 'file:./dev.db' })
const prisma = new PrismaClient({ adapter })

function parseArgs(argv) {
  const out = {}
  for (let i = 2; i < argv.length; i += 1) {
    const token = argv[i]
    if (!token.startsWith('--')) continue
    const key = token.slice(2)
    const next = argv[i + 1]
    if (!next || next.startsWith('--')) {
      out[key] = true
      continue
    }
    out[key] = next
    i += 1
  }
  return out
}

function num(value, fallback = 0) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function roundToHundred(value) {
  return Math.ceil(value / 100) * 100
}

function getTaiwanAnnualTax(displacement) {
  const cc = num(displacement)
  if (cc <= 1200) return 8640
  if (cc <= 1800) return 11920
  if (cc <= 2400) return 17410
  if (cc <= 3000) return 28220
  if (cc <= 4200) return 46170
  return 69690
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true })
}

async function main() {
  const args = parseArgs(process.argv)
  const cost = num(args.cost)
  const displacement = num(args.displacement)
  const freight = num(args.freight)
  const insurance = num(args.insurance)
  const marginRate = num(args.margin_rate, 0.15)
  const opsBuffer = num(args.ops_buffer, 3000)
  const search = String(args.search || '').trim()

  const annualTax = getTaiwanAnnualTax(displacement)
  const landedCost = cost + freight + insurance
  const subtotal = landedCost + annualTax + opsBuffer
  const suggestedPrice = roundToHundred(subtotal * (1 + marginRate))

  let updatedCount = 0
  let updatedVehicles = []

  if (search) {
    const result = await prisma.vehicle.updateMany({
      where: { model: { contains: search } },
      data: { cost, price: suggestedPrice },
    })
    updatedCount = result.count
    updatedVehicles = await prisma.vehicle.findMany({
      where: { model: { contains: search } },
      orderBy: { createdAt: 'desc' },
    })
  }

  const summary = {
    task: 'price_calculator',
    ranAt: new Date().toISOString(),
    inputs: { cost, displacement, freight, insurance, marginRate, opsBuffer, search: search || null },
    breakdown: { landedCost, annualTax, subtotalBeforeMargin: subtotal, suggestedPrice },
    updatedCount,
    updatedVehicles: updatedVehicles.map((v) => ({ id: v.id, model: v.model, year: v.year, cost: v.cost, price: v.price })),
    note: search
      ? 'Matched vehicles were updated in Prisma.'
      : 'No --search provided, so the script only calculated and logged the pricing summary.',
  }

  const outDir = path.join(process.cwd(), 'data', 'pricing-runs')
  ensureDir(outDir)
  fs.writeFileSync(path.join(outDir, 'latest-price-calculation.json'), JSON.stringify(summary, null, 2))

  console.log(JSON.stringify(summary, null, 2))
}

main()
  .catch((error) => {
    console.error('[price_calculator] failed:', error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
