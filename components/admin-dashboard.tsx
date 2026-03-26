"use client"

import { useState } from 'react'

type Vehicle = {
  id: number
  model: string
  year: number
  mileage: number
  cost: number
  price: number
}

type Order = {
  id: number
  status: string
  customer: {
    name: string
    email: string
  }
  vehicle: {
    model: string
    year: number
  }
}

const sampleImportPayload = [
  {
    model: 'Mercedes C300 Night Edition',
    year: 2022,
    mileage: 19000,
    options: '360 camera, panoramic roof, Burmester',
    cost: 29400,
    price: 34800,
  },
]

export function AdminDashboard({ vehicles, orders }: { vehicles: Vehicle[]; orders: Order[] }) {
  const [importStatus, setImportStatus] = useState('')

  async function importSampleVehicles() {
    setImportStatus('匯入中...')
    const res = await fetch('/api/import-vehicles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vehicles: sampleImportPayload }),
    })

    const data = await res.json()

    if (!res.ok) {
      setImportStatus(data.error || '匯入失敗')
      return
    }

    setImportStatus(`已匯入 ${data.imported} 台，略過 ${data.skipped} 台。重新整理即可看到最新資料。`)
  }

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 text-white">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">Admin</p>
            <h1 className="mt-2 text-3xl font-semibold">車源管理後台</h1>
            <p className="mt-2 text-zinc-400">目前支援庫存檢視、詢價訂單查看，以及 JSON 匯入流程。</p>
          </div>
          <button onClick={importSampleVehicles} className="rounded-full bg-emerald-400 px-5 py-3 font-semibold text-zinc-950 transition hover:bg-emerald-300">
            匯入一筆示範車源
          </button>
        </div>
        {importStatus ? <p className="mt-4 text-sm text-emerald-300">{importStatus}</p> : null}
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 text-white">
          <p className="text-sm text-zinc-500">庫存總數</p>
          <p className="mt-3 text-4xl font-semibold">{vehicles.length}</p>
        </div>
        <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 text-white">
          <p className="text-sm text-zinc-500">詢價 / 訂單</p>
          <p className="mt-3 text-4xl font-semibold">{orders.length}</p>
        </div>
        <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 text-white">
          <p className="text-sm text-zinc-500">平均售價</p>
          <p className="mt-3 text-4xl font-semibold">${Math.round((vehicles.reduce((sum, item) => sum + item.price, 0) || 0) / Math.max(vehicles.length, 1)).toLocaleString()}</p>
        </div>
      </section>

      <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 text-white">
        <h2 className="text-2xl font-semibold">目前庫存</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-zinc-500">
              <tr>
                <th className="pb-3">車款</th>
                <th className="pb-3">年份</th>
                <th className="pb-3">里程</th>
                <th className="pb-3">成本</th>
                <th className="pb-3">售價</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((vehicle) => (
                <tr key={vehicle.id} className="border-t border-zinc-800">
                  <td className="py-3">{vehicle.model}</td>
                  <td className="py-3">{vehicle.year}</td>
                  <td className="py-3">{vehicle.mileage.toLocaleString()} km</td>
                  <td className="py-3">${vehicle.cost.toLocaleString()}</td>
                  <td className="py-3 text-emerald-300">${vehicle.price.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 text-white">
        <h2 className="text-2xl font-semibold">最近詢價 / 訂單</h2>
        <div className="mt-4 space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium">{order.customer.name} · {order.vehicle.year} {order.vehicle.model}</p>
                  <p className="text-sm text-zinc-400">{order.customer.email}</p>
                </div>
                <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs uppercase tracking-[0.2em] text-zinc-300">{order.status}</span>
              </div>
            </div>
          ))}
          {orders.length === 0 ? <p className="text-zinc-400">目前還沒有新的詢價或訂單。</p> : null}
        </div>
      </section>
    </div>
  )
}
