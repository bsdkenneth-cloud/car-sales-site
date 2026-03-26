import Link from 'next/link'
import { InquiryForm } from '@/components/inquiry-form'
import { prisma } from '@/lib/prisma'

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
  return prisma.vehicle.findMany({
    orderBy: [{ price: 'asc' }],
  })
}

export default async function Home() {
  const vehicles = await getVehicles()

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#1f2937,_#020617_50%)] text-white">
      <section className="border-b border-white/10 px-6 py-20">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-emerald-300">Ever Rise · Imported Vehicles</p>
            <h1 className="mt-5 text-5xl font-semibold leading-tight md:text-6xl">幫客戶更快找到可信、透明、可落地的進口車方案</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
              不是只賣一台車，而是把車源篩選、價格推導、詢價回覆、代尋流程，整理成真正可營運的系統。
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="#inventory" className="rounded-full bg-emerald-400 px-6 py-3 font-semibold text-zinc-950 transition hover:bg-emerald-300">查看庫存</a>
              <a href="#inquiry" className="rounded-full border border-white/15 px-6 py-3 font-semibold text-white transition hover:bg-white/5">立即詢價</a>
              <Link href="/admin" className="rounded-full border border-white/15 px-6 py-3 font-semibold text-white transition hover:bg-white/5">進入後台</Link>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm text-zinc-400">目前庫存</p>
                <p className="mt-2 text-3xl font-semibold">{vehicles.length}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm text-zinc-400">主打流程</p>
                <p className="mt-2 text-3xl font-semibold">代尋 / 價格推導</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm text-zinc-400">資料來源</p>
                <p className="mt-2 text-3xl font-semibold">API / JSON 匯入</p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/30 backdrop-blur">
            <p className="text-sm uppercase tracking-[0.35em] text-zinc-400">What this site can already do</p>
            <ul className="mt-6 space-y-4 text-zinc-200">
              <li>• Prisma / SQLite inventory backend</li>
              <li>• Vehicles API + Orders API</li>
              <li>• Inquiry form creating customer + pending order</li>
              <li>• Admin dashboard for inventory and inquiry review</li>
              <li>• Vehicle import endpoint for operational data flow</li>
              <li>• Pricing calculator script for quote alignment</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="inventory" className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-end justify-between gap-6">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">Inventory</p>
              <h2 className="mt-3 text-3xl font-semibold">現有庫存</h2>
            </div>
            <p className="max-w-xl text-right text-sm leading-6 text-zinc-400">目前頁面直接讀取資料庫內容；後續可以接真實拍賣來源、同步匯率、進口成本與實際詢價流程。</p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {vehicles.map((vehicle) => (
              <article key={vehicle.id} className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/20 backdrop-blur">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm text-zinc-400">#{vehicle.id} · {vehicle.year}</p>
                  <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs uppercase tracking-[0.25em] text-emerald-300">Available</span>
                </div>
                <h3 className="mt-4 text-2xl font-semibold">{vehicle.model}</h3>
                <p className="mt-3 min-h-12 text-sm leading-6 text-zinc-300">{vehicle.options}</p>
                <div className="mt-6 grid gap-3 text-sm text-zinc-200">
                  <div className="flex items-center justify-between"><span className="text-zinc-400">里程</span><span>{vehicle.mileage.toLocaleString()} km</span></div>
                  <div className="flex items-center justify-between"><span className="text-zinc-400">成本</span><span>${vehicle.cost.toLocaleString()}</span></div>
                  <div className="flex items-center justify-between text-base font-semibold"><span className="text-zinc-300">售價</span><span className="text-emerald-300">${vehicle.price.toLocaleString()}</span></div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="inquiry" className="px-6 py-16">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">Inquiry</p>
            <h2 className="mt-3 text-3xl font-semibold">留下需求，我們回覆最接近的車源與方案</h2>
            <p className="mt-4 text-zinc-300 leading-7">
              這一版詢價表單已經會把客戶資料寫進系統，並建立 pending order，讓後台可以直接追蹤。
            </p>
          </div>
          <InquiryForm vehicles={vehicles.map((item) => ({ id: item.id, model: item.model, year: item.year }))} />
        </div>
      </section>
    </main>
  )
}
