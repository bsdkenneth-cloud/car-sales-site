import { AdminDashboard } from '@/components/admin-dashboard'
import { prisma } from '@/lib/prisma'

export default async function AdminPage() {
  const [vehicles, orders] = await Promise.all([
    prisma.vehicle.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.order.findMany({
      include: {
        customer: true,
        vehicle: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
  ])

  return (
    <main className="min-h-screen bg-black px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <AdminDashboard vehicles={vehicles} orders={orders} />
      </div>
    </main>
  )
}
