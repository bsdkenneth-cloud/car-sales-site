import NavBar from '@/components/NavBar'

export default function ContactPage() {
 return (
  <>
   <NavBar />
   <main className='bg-gray-50 py-16'>
    <div className='container mx-auto max-w-3xl px-4'>
     <h1 className='text-4xl font-bold text-zinc-900'>聯絡我們</h1>
     <p className='mt-6 text-lg leading-8 text-zinc-600'>
      如果你正在找特定車款，或希望我們協助評估預算、來源與交車流程，歡迎直接留下聯絡方式。
     </p>

     <div className='mt-10 rounded-3xl bg-white p-8 shadow'>
      <div className='grid gap-6 md:grid-cols-2'>
       <div>
        <p className='text-sm uppercase tracking-[0.3em] text-zinc-400'>Phone</p>
        <p className='mt-2 text-lg font-semibold text-zinc-900'>+886 968 216 460</p>
       </div>
       <div>
        <p className='text-sm uppercase tracking-[0.3em] text-zinc-400'>Email</p>
        <p className='mt-2 text-lg font-semibold text-zinc-900'>sales@everrise-mobility.example</p>
       </div>
       <div>
        <p className='text-sm uppercase tracking-[0.3em] text-zinc-400'>Service</p>
        <p className='mt-2 text-lg font-semibold text-zinc-900'>外匯車銷售 / 代尋 / 報價評估</p>
       </div>
       <div>
        <p className='text-sm uppercase tracking-[0.3em] text-zinc-400'>Lead Time</p>
        <p className='mt-2 text-lg font-semibold text-zinc-900'>通常 1–3 個工作天內回覆</p>
       </div>
      </div>
     </div>
    </div>
   </main>
  </>
 )
}
