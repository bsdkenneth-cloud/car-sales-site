type Vehicle = {
  id: number
  model: string
  year: number
  mileage: number
  options: string
  cost: number
  price: number
}

async function getVehicles(): Promise<Vehicle[]> {
  const res = await fetch('http://localhost:3000/api/vehicles', { cache: 'no-store' }).catch(() => null)
  if (!res || !res.ok) return []
  return (await res.json()) as Vehicle[]
}

export default async function Home() {
  const vehicles = await getVehicles()

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10">
          <p className="text-sm uppercase tracking-[0.3em] text-zinc-400">Car Sales Site</p>
          <h1 className="mt-3 text-4xl font-semibold">進口車庫存總覽</h1>
          <p className="mt-3 text-zinc-300">Prisma / SQLite / Next.js 已接通，下面直接讀取資料庫中的車輛清單。</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {vehicles.length === 0 ? (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 text-zinc-300">目前沒有車輛資料，先跑 seed 或匯入腳本即可。</div>
          ) : (
            vehicles.map((vehicle) => (
              <article key={vehicle.id} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-lg shadow-black/20">
                <p className="text-sm text-zinc-400">#{vehicle.id} · {vehicle.year}</p>
                <h2 className="mt-2 text-2xl font-semibold">{vehicle.model}</h2>
                <p className="mt-3 text-sm leading-6 text-zinc-300">{vehicle.options}</p>
                <div className="mt-5 space-y-2 text-sm text-zinc-200">
                  <div>里程：{vehicle.mileage.toLocaleString()} km</div>
                  <div>成本：${vehicle.cost.toLocaleString()}</div>
                  <div className="text-emerald-400">售價：${vehicle.price.toLocaleString()}</div>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </main>
  )
}
