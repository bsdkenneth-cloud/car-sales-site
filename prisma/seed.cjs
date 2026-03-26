/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3')
const { PrismaClient } = require('@prisma/client')

const adapter = new PrismaBetterSqlite3({ url: 'file:./dev.db' })
const prisma = new PrismaClient({ adapter })

async function main() {
  await prisma.order.deleteMany()
  await prisma.customer.deleteMany()
  await prisma.vehicle.deleteMany()

  const vehicles = await prisma.vehicle.createMany({
    data: [
      {
        model: 'Mercedes C300 AMG Line',
        year: 2021,
        mileage: 28000,
        options: 'Sunroof, Burmester audio, 360 camera',
        cost: 26800,
        price: 30900,
      },
      {
        model: 'Mercedes C300 Avantgarde',
        year: 2020,
        mileage: 36000,
        options: 'Leather seats, keyless, Apple CarPlay',
        cost: 24500,
        price: 28200,
      },
      {
        model: 'BMW 330i M Sport',
        year: 2021,
        mileage: 24000,
        options: 'HUD, adaptive cruise',
        cost: 28900,
        price: 33200,
      },
    ],
  })

  const customer = await prisma.customer.create({
    data: {
      name: 'Kenneth Demo',
      email: 'kenneth.demo@example.com',
      phone: '0912-345-678',
    },
  })

  const firstVehicle = await prisma.vehicle.findFirst({ orderBy: { id: 'asc' } })

  if (firstVehicle) {
    await prisma.order.create({
      data: {
        customerId: customer.id,
        vehicleId: firstVehicle.id,
        status: 'pending',
      },
    })
  }

  console.log(JSON.stringify({ seededVehicles: vehicles.count, customerId: customer.id }, null, 2))
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
