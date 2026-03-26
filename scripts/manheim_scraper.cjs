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

function normalizeNumber(value, fallback = 0) {
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true })
}

function readSourceData(sourcePath) {
  if (sourcePath && fs.existsSync(sourcePath)) {
    return JSON.parse(fs.readFileSync(sourcePath, 'utf8'))
  }

  return [
    { model: 'Mercedes C300 AMG Line', year: 2021, mileage: 28000, options: 'Sunroof, Burmester audio, 360 camera', cost: 26800 },
    { model: 'Mercedes C300 Avantgarde', year: 2020, mileage: 36000, options: 'Leather seats, keyless, Apple CarPlay', cost: 24500 },
    { model: 'BMW 330i M Sport', year: 2021, mileage: 24000, options: 'HUD, adaptive cruise', cost: 28900 },
    { model: 'Mercedes C300 4MATIC', year: 2022, mileage: 18000, options: 'AMG package, 19-inch wheels', cost: 31200 },
  ]
}

async function main() {
  const args = parseArgs(process.argv)
  const search = String(args.search || '').trim()
  const maxPrice = normalizeNumber(args.max_price, Number.MAX_SAFE_INTEGER)
  const source = args.source ? path.resolve(process.cwd(), String(args.source)) : null

  const rawVehicles = readSourceData(source)
  const matched = rawVehicles.filter((item) => {
    const matchesSearch = !search || String(item.model || '').toLowerCase().includes(search.toLowerCase())
    const matchesPrice = normalizeNumber(item.cost, Number.MAX_SAFE_INTEGER) <= maxPrice
    return matchesSearch && matchesPrice
  })

  const created = []
  const skipped = []

  for (const item of matched) {
    const cost = normalizeNumber(item.cost)
    const existing = await prisma.vehicle.findFirst({
      where: {
        model: item.model,
        year: normalizeNumber(item.year),
        mileage: normalizeNumber(item.mileage),
        cost,
      },
    })

    if (existing) {
      skipped.push({ id: existing.id, model: existing.model, year: existing.year, cost: existing.cost })
      continue
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        model: String(item.model),
        year: normalizeNumber(item.year),
        mileage: normalizeNumber(item.mileage),
        options: String(item.options || 'Imported from Manheim scraper'),
        cost,
        price: normalizeNumber(item.price, Math.ceil((cost * 1.15) / 100) * 100),
      },
    })

    created.push({ id: vehicle.id, model: vehicle.model, year: vehicle.year, cost: vehicle.cost, price: vehicle.price })
  }

  const runSummary = {
    task: 'manheim_scraper',
    ranAt: new Date().toISOString(),
    criteria: { search, max_price: maxPrice, source: source || 'built-in sample dataset' },
    totalSourceRecords: rawVehicles.length,
    matchedRecords: matched.length,
    createdCount: created.length,
    skippedCount: skipped.length,
    created,
    skipped,
  }

  const outDir = path.join(process.cwd(), 'data', 'auction-runs')
  ensureDir(outDir)
  fs.writeFileSync(path.join(outDir, 'latest-manheim.json'), JSON.stringify(runSummary, null, 2))

  console.log(JSON.stringify(runSummary, null, 2))
}

main()
  .catch((error) => {
    console.error('[manheim_scraper] failed:', error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
