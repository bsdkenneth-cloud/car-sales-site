import NavBar from '@/components/NavBar'

export default function AboutPage() {
 return (
  <>
   <NavBar />
   <main className='bg-gray-50 py-16'>
    <div className='container mx-auto max-w-4xl px-4'>
     <h1 className='text-4xl font-bold text-zinc-900'>關於我們</h1>
     <p className='mt-6 text-lg leading-8 text-zinc-600'>
      我們專注於高品質外匯車、平行輸入車與代尋服務，重視資訊透明、價格邏輯與車況篩選，
      希望讓客戶不是只看到漂亮照片，而是真正理解每一台車的來源、成本與交付價值。
     </p>

     <div className='mt-10 grid gap-6 md:grid-cols-3'>
      <section className='rounded-2xl bg-white p-6 shadow'>
       <h2 className='text-xl font-semibold text-blue-700'>精選車源</h2>
       <p className='mt-3 text-sm leading-6 text-zinc-600'>從可落地成交的車源出發，不用大量堆車，而是優先做高匹配度與高信任成交。</p>
      </section>
      <section className='rounded-2xl bg-white p-6 shadow'>
       <h2 className='text-xl font-semibold text-blue-700'>價格透明</h2>
       <p className='mt-3 text-sm leading-6 text-zinc-600'>我們重視成本、運費、保險、稅費與合理利潤，不做模糊報價。</p>
      </section>
      <section className='rounded-2xl bg-white p-6 shadow'>
       <h2 className='text-xl font-semibold text-blue-700'>專業代辦</h2>
       <p className='mt-3 text-sm leading-6 text-zinc-600'>從選車、代尋、報價到交付，建立一條可追蹤、可管理的服務流程。</p>
      </section>
     </div>
    </div>
   </main>
  </>
 )
}
