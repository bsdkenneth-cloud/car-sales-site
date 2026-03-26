"use client"

import { useState } from 'react'

type Vehicle = {
  id: number
  model: string
  year: number
  mileage: number
  options: string
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

const ORDER_STATUSES = ['new', 'contacted', 'negotiating', 'won', 'lost']

export function AdminDashboard({ vehicles, orders }: { vehicles: Vehicle[]; orders: Order[] }) {
  const [importStatus, setImportStatus] = useState('')
  const [sourceUrl, setSourceUrl] = useState('')

  async function importSampleVehicles() {
    setImportStatus('匯入中...')
    const res = await fetch('/api/import-vehicles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vehicles: sampleImportPayload }),
    })

    const data = await res.json()
    setImportStatus(res.ok ? `已匯入 ${data.imported} 台，略過 ${data.skipped} 台。重新整理即可看到最新資料。` : data.error || '匯入失敗')
  }

  async function importFromUrl() {
    if (!sourceUrl) return
    setImportStatus('從外部網址匯入中...')
    const res = await fetch('/api/import-vehicles/from-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sourceUrl }),
    })
    const data = await res.json()
    setImportStatus(res.ok ? `網址匯入完成：新增 ${data.imported} 台，略過 ${data.skipped} 台。` : data.error || '網址匯入失敗')
  }

  async function updateVehicle(vehicle: Vehicle) {
    const nextPrice = window.prompt(`更新 ${vehicle.model} 售價`, String(vehicle.price))
    if (!nextPrice) return

    await fetch(`/api/vehicles/${vehicle.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...vehicle, price: Number(nextPrice) }),
    })

    window.location.reload()
  }

  async function deleteVehicle(id: number) {
    const confirmed = window.confirm('確定刪除此車輛與相關訂單？')
    if (!confirmed) return

    await fetch(`/api/vehicles/${id}`, { method: 'DELETE' })
    window.location.reload()
  }

  async function updateOrderStatus(id: number, status: string) {
    await fetch(`/api/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    window.location.reload()
  }

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 text-white">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">Admin</p>
            <h1 className="mt-2 text-3xl font-semibold">車源管理後台</h1>
            <p className="mt-2 text-zinc-400">目前支援庫存檢視、詢價訂單查看、價格調整，以及 URL / JSON 匯入。</p>
          </div>
          <button onClick={importSampleVehicles} className="rounded-full bg-emerald-400 px-5 py-3 font-semibold text-zinc-950 transition hover:bg-emerald-300">
            匯入一筆示範車源
          </button>
        </div>
        <div className="mt-4 flex flex-col gap-3 md:flex-row">
          <input value={sourceUrl} onChange={(e) => setSourceUrl(e.target.value)} placeholder="貼上外部 JSON URL 進行匯入" className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none" />
          <button onClick={importFromUrl} className="rounded-full border border-white/15 px-5 py-3 font-semibold text-white transition hover:bg-white/5">從網址匯入</button>
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
                <th className="pb-3">操作</th>
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
                  <td className="py-3">
                    <div className="flex gap-2">
                      <button onClick={() => updateVehicle(vehicle)} className="rounded-full border border-white/15 px-3 py-1 text-xs">改價</button>
                      <button onClick={() => deleteVehicle(vehicle.id)} className="rounded-full border border-red-500/30 px-3 py-1 text-xs text-red-300">刪除</button>
                    </div>
                  </td>
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
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-medium">{order.customer.name} · {order.vehicle.year} {order.vehicle.model}</p>
                  <p className="text-sm text-zinc-400">{order.customer.email}</p>
                </div>
                <select value={order.status} onChange={(e) => updateOrderStatus(order.id, e.target.value)} className="rounded-full border border-white/15 bg-zinc-950 px-4 py-2 text-sm text-white outline-none">
                  {ORDER_STATUSES.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
          {orders.length === 0 ? <p className="text-zinc-400">目前還沒有新的詢價或訂單。</p> : null}
        </div>
      </section>
    </div>
  )
}
