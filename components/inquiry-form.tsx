"use client"

import { useState } from 'react'

type Vehicle = {
  id: number
  model: string
  year: number
}

export function InquiryForm({ vehicles }: { vehicles: Vehicle[] }) {
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setStatus('')

    const payload = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      vehicleId: formData.get('vehicleId'),
      notes: formData.get('notes'),
    }

    const res = await fetch('/api/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      setStatus('送出失敗，請檢查欄位後再試一次。')
      setLoading(false)
      return
    }

    setStatus('詢價已送出，我們會盡快與您聯絡。')
    setLoading(false)
  }

  return (
    <form
      action={handleSubmit}
      className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <input name="name" placeholder="姓名" className="rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none" required />
        <input name="email" type="email" placeholder="Email" className="rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none" required />
        <input name="phone" placeholder="電話 / WhatsApp" className="rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none" />
        <select name="vehicleId" className="rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none" required defaultValue="">
          <option value="" disabled>選擇感興趣車款</option>
          {vehicles.map((vehicle) => (
            <option key={vehicle.id} value={vehicle.id}>{vehicle.year} {vehicle.model}</option>
          ))}
        </select>
      </div>
      <textarea name="notes" placeholder="需求備註，例如預算、車色、交車時間" className="mt-4 min-h-28 w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none" />
      <div className="mt-4 flex items-center justify-between gap-4">
        <p className="text-sm text-zinc-400">我們會依照你的預算與偏好回覆最接近的庫存或可代尋方案。</p>
        <button disabled={loading} className="rounded-full bg-emerald-400 px-5 py-3 font-semibold text-zinc-950 transition hover:bg-emerald-300 disabled:opacity-60">
          {loading ? '送出中...' : '送出詢價'}
        </button>
      </div>
      {status ? <p className="mt-4 text-sm text-emerald-300">{status}</p> : null}
    </form>
  )
}
